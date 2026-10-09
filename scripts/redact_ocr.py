#!/usr/bin/env python3
import argparse
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

from PIL import Image, ImageDraw


EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")
NUM7_RE = re.compile(r"\\b\\d{7}\\b")
NUM6_8_RE = re.compile(r"\\b\\d{6,8}\\b")
MRN_RE = re.compile(r"\\bMRN\\b", re.IGNORECASE)
DR_RE = re.compile(r"\\bDR\\.?\\b", re.IGNORECASE)
MD_RE = re.compile(r"\\bMD\\b")
UPPER_2_3 = re.compile(r"^[A-Z]{2,3}$")

NAMES = [
    # explicit
    "Martinez", "Laura", "Thompson", "Brown", "Gonzalez", "Campbell",
    "Green", "Williams", "Chen", "Farrell",
    # common first names seen in screenshots
    "Daniel", "Linda", "Joseph", "Nancy", "Rebecca", "Robert",
]
NAME_PREFIXES = [
    "Thomp", "Marti", "Gonza", "Campb", "Rebec", "Dan", "Lin", "Rob", "Will", "Brow",
]


@dataclass
class WordBox:
    text: str
    left: int
    top: int
    width: int
    height: int
    line_key: Tuple[int, int, int]  # block, par, line

    @property
    def right(self) -> int:
        return self.left + self.width

    @property
    def bottom(self) -> int:
        return self.top + self.height

    def to_rect(self) -> Tuple[int, int, int, int]:
        return (self.left, self.top, self.right, self.bottom)


def run(cmd: List[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, text=True)


def pdftoppm_to_pngs(pdf_path: Path, out_dir: Path, prefix: str, dpi: int) -> List[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    run(["pdftoppm", "-png", f"-rx", str(dpi), f"-ry", str(dpi), str(pdf_path), str(out_dir / prefix)])
    pages = sorted(out_dir.glob(f"{prefix}-*.png"))
    return pages


def tesseract_tsv(image_path: Path) -> List[WordBox]:
    # TSV columns: level,page_num,block_num,par_num,line_num,word_num,left,top,width,height,conf,text
    cp = run(["tesseract", str(image_path), "stdout", "-l", "eng", "--psm", "3", "tsv"])
    lines = cp.stdout.splitlines()
    result: List[WordBox] = []
    header = None
    for i, line in enumerate(lines):
        if i == 0:
            header = line.split("\t")
            continue
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        level = int(parts[0] or 0)
        if level != 5:
            continue
        try:
            block = int(parts[2] or 0)
            par = int(parts[3] or 0)
            ln = int(parts[4] or 0)
            left = int(parts[6] or 0)
            top = int(parts[7] or 0)
            width = int(parts[8] or 0)
            height = int(parts[9] or 0)
            text = parts[11]
        except Exception:
            continue
        if not text.strip():
            continue
        result.append(WordBox(text=text.strip(), left=left, top=top, width=width, height=height, line_key=(block, par, ln)))
    return result


def merge_rects(rects: List[Tuple[int, int, int, int]], pad: int = 2) -> List[Tuple[int, int, int, int]]:
    # simple iterative merge for overlapping/adjacent rects
    changed = True
    rects = [(x1 - pad, y1 - pad, x2 + pad, y2 + pad) for (x1, y1, x2, y2) in rects]
    while changed:
        changed = False
        new: List[Tuple[int, int, int, int]] = []
        while rects:
            r = rects.pop()
            rx1, ry1, rx2, ry2 = r
            merged = False
            for j in range(len(rects)):
                x1, y1, x2, y2 = rects[j]
                # overlap or touch
                if not (rx2 < x1 or x2 < rx1 or ry2 < y1 or y2 < ry1):
                    # union
                    nx1, ny1, nx2, ny2 = min(rx1, x1), min(ry1, y1), max(rx2, x2), max(ry2, y2)
                    rects[j] = (nx1, ny1, nx2, ny2)
                    merged = True
                    changed = True
                    break
            if not merged:
                new.append(r)
        rects = new
    return rects


def build_redaction_rects(words: List[WordBox], doc_type: str) -> List[Tuple[int, int, int, int]]:
    rects: List[Tuple[int, int, int, int]] = []
    by_line: Dict[Tuple[int, int, int], List[WordBox]] = {}
    for wb in words:
        by_line.setdefault(wb.line_key, []).append(wb)

    # per-word tests
    for wb in words:
        t = wb.text
        if EMAIL_RE.search(t):
            rects.append(wb.to_rect())
            continue
        if MRN_RE.search(t):
            # redact MRN token and entire line
            for w in by_line[wb.line_key]:
                rects.append(w.to_rect())
            continue
        if doc_type == "health" and NUM6_8_RE.search(t):
            rects.append(wb.to_rect())
            continue
        # redact explicit names and prefixes
        if any(t.lower() == n.lower() for n in NAMES) or any(t.lower().startswith(p.lower()) for p in NAME_PREFIXES):
            rects.append(wb.to_rect())
            continue
        if t in {"Admin"}:
            rects.append(wb.to_rect())
            continue
        if UPPER_2_3.match(t):
            # Likely avatar initials; keep small regions only (avoid over-redaction)
            if 12 <= wb.height <= 100:
                rects.append(wb.to_rect())
                continue

    # line-level rules: provider names with DR/MD
    for line_key, ws in by_line.items():
        line_text = " ".join(w.text for w in ws)
        if DR_RE.search(line_text) or MD_RE.search(line_text):
            for w in ws:
                rects.append(w.to_rect())

    # Merge overlaps and pad
    rects = merge_rects(rects, pad=3)
    return rects


def apply_redactions(image_path: Path, rects: List[Tuple[int, int, int, int]], out_path: Path, artifacts_dir: Path, page_label: str):
    im = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(im)
    for i, (x1, y1, x2, y2) in enumerate(rects):
        # Save before crop
        before = im.crop((x1, y1, x2, y2))
        before.save(artifacts_dir / f"{page_label}-box{i:02d}-before.png")
        # Draw solid neutral box
        draw.rectangle([(x1, y1), (x2, y2)], fill=(242, 242, 242))
        # Save after crop
        after = im.crop((x1, y1, x2, y2))
        after.save(artifacts_dir / f"{page_label}-box{i:02d}-after.png")
    im.save(out_path)


def ocr_full_text(image_path: Path) -> str:
    cp = run(["tesseract", str(image_path), "stdout", "-l", "eng"])
    return cp.stdout


def fail_if_patterns(text: str, where: str):
    violations: List[str] = []
    if EMAIL_RE.search(text):
        violations.append("email")
    if re.search(r"\\bMRN\\b", text, re.IGNORECASE):
        violations.append("MRN")
    if NUM7_RE.search(text):
        violations.append("7-digit number")
    for name in ["Martinez", "Thompson", "Brown", "Gonzalez", "Campbell", "Green", "Williams", "Chen", "Farrell"]:
        if re.search(rf"\\b{name}\\b", text, re.IGNORECASE):
            violations.append(name)
    if violations:
        raise SystemExit(f"OCR check failed in {where}: found {', '.join(sorted(set(violations)))}")


def assemble_pdf(jpg_paths: List[Path], out_pdf: Path):
    out_pdf.parent.mkdir(parents=True, exist_ok=True)
    args = ["python3", "-m", "img2pdf", *[str(p) for p in jpg_paths], "-o", str(out_pdf)]
    run(args)


def process(pdf: Path, out_pdf: Path, work_dir: Path, artifacts_dir: Path, doc_type: str, dpi: int):
    pages = pdftoppm_to_pngs(pdf, work_dir, "page", dpi=dpi)
    redacted_jpgs: List[Path] = []
    # clear artifacts dir
    if artifacts_dir.exists():
        shutil.rmtree(artifacts_dir)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    for idx, img in enumerate(pages, start=1):
        words = tesseract_tsv(img)
        rects = build_redaction_rects(words, doc_type=doc_type)
        redacted_png = work_dir / f"{img.stem}-redacted.png"
        page_label = f"{doc_type}-p{idx}"
        apply_redactions(img, rects, redacted_png, artifacts_dir, page_label)
        # OCR check page
        txt = ocr_full_text(redacted_png)
        fail_if_patterns(txt, f"{doc_type} page {idx}")
        # Convert to JPG for PDF assembly (quality/size control)
        jpg_out = work_dir / f"{img.stem}-redacted.jpg"
        with Image.open(redacted_png) as pim:
            pim.save(jpg_out, quality=85, optimize=True)
        redacted_jpgs.append(jpg_out)
    assemble_pdf(redacted_jpgs, out_pdf)
    print(f"Wrote {out_pdf} ({out_pdf.stat().st_size/1024:.1f} KB)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True, help="input PDF path")
    ap.add_argument("--out", dest="outp", required=True, help="output PDF path")
    ap.add_argument("--type", dest="doc_type", choices=["platform", "health"], required=True)
    ap.add_argument("--dpi", type=int, default=200)
    ap.add_argument("--work", default="/tmp/redact_work")
    ap.add_argument("--artifacts", default="/opt/cursor/artifacts/redactions-ocr")
    args = ap.parse_args()

    process(Path(args.inp), Path(args.outp), Path(args.work) / args.doc_type, Path(args.artifacts) / args.doc_type, args.doc_type, dpi=args.dpi)


if __name__ == "__main__":
    main()

