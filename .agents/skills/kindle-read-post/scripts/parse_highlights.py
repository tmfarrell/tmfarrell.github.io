#!/usr/bin/env python3
"""Extract highlights from a Kindle Notebook HTML export or a highlights CSV.

Usage:
    python3 parse_highlights.py <file.html|file.csv> [-o out.json]

Input formats:
  - Kindle "Notebook export" HTML (the file Kindle saves as "<Book> - Notebook.html")
  - CSV exports from Readwise, Amazon, clippings.io, etc. Columns are detected
    by header name (Highlight/Quote, Book Title, Book Author, Location, Page,
    Color, Note, Type, Date...).

Output: JSON with the book title, author, and the ordered list of highlights
(bookmarks, which carry no text, are skipped and counted separately).
"""
import argparse
import csv
import json
import re
import sys
from html.parser import HTMLParser

WS_RE = re.compile(r"\s+")


def clean(text):
    return WS_RE.sub(" ", text or "").strip()


# --------------------------------------------------------------------------
# Kindle Notebook HTML
# --------------------------------------------------------------------------
class NotebookParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = None
        self.author = None
        self.notes = []
        self._mode = None
        self._buf = []
        self._cur = None

    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class", "")
        if tag == "div" and cls == "bookTitle":
            self._mode, self._buf = "title", []
        elif tag == "div" and cls == "authors":
            self._mode, self._buf = "authors", []
        elif tag == "div" and cls == "citation":
            self._mode, self._buf = "citation", []
        elif tag == "div" and cls == "noteHeading":
            self._mode, self._buf = "heading", []
        elif tag == "div" and cls == "noteText":
            self._mode, self._buf = "text", []

    def handle_data(self, data):
        if self._mode:
            self._buf.append(data)

    def _flush_heading(self):
        raw = clean("".join(self._buf))
        m = re.search(
            r"^(Highlight|Bookmark|Note)\s*(?:\((\w+)\))?\s*[-:]\s*"
            r"Page\s*(\d+)(?:\s*[-·]\s*Location\s*(\d+))?",
            raw,
            re.IGNORECASE,
        )
        if not m:
            return
        self._cur = {
            "type": m.group(1).capitalize(),
            "color": (m.group(2) or "").lower() or None,
            "page": m.group(3),
            "location": m.group(4),
            "text": "",
        }
        self.notes.append(self._cur)

    def handle_endtag(self, tag):
        if tag != "div":
            return
        if self._mode == "title":
            self.title = clean("".join(self._buf))
        elif self._mode == "authors":
            self.author = clean("".join(self._buf))
        elif self._mode == "heading":
            self._flush_heading()
        elif self._mode == "text":
            if self._cur is not None:
                self._cur["text"] = clean("".join(self._buf))
        self._mode = None


def parse_html(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        source = f.read()
    p = NotebookParser()
    p.feed(source)
    return p.title, p.author, p.notes


# --------------------------------------------------------------------------
# CSV exports
# --------------------------------------------------------------------------
COLUMN_ALIASES = {
    "text": ["highlight", "highlight text", "quote", "clipping", "text"],
    "title": ["book title", "book", "source", "title"],
    "author": ["book author", "author", "authors"],
    "location": ["location", "loc"],
    "page": ["page", "page number", "page value"],
    "color": ["color", "colour", "annotation"],
    "note": ["note", "notes", "comment", "comments", "my note"],
    "type": ["type", "kind"],
    "date": ["date highlighted", "date", "created", "timestamp"],
}


def norm_header(name):
    return re.sub(r"[^a-z]+", " ", (name or "").lower()).strip()


def detect_columns(fieldnames):
    """Map normalized header -> (role, original_name)."""
    normalized = {}
    for name in fieldnames:
        n = norm_header(name)
        if n and n not in normalized:
            normalized[n] = name
    cols = {}
    for role, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in normalized:
                cols[role] = normalized[alias]
                break
    return cols


def read_csv(path):
    with open(path, encoding="utf-8-sig", errors="replace", newline="") as f:
        sample = f.read(8192)
        f.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(f, dialect=dialect)
        fieldnames = reader.fieldnames
        rows = list(reader)
    return rows, fieldnames


def parse_csv(path):
    rows, fieldnames = read_csv(path)
    cols = detect_columns(fieldnames)

    title = author = None
    tcol, acol = cols.get("title"), cols.get("author")
    notes = []
    for row in rows:
        if title is None and tcol and row.get(tcol, "").strip():
            title = clean(row[tcol])
        if author is None and acol and row.get(acol, "").strip():
            author = clean(row[acol])

        typ = (row.get(cols.get("type", "")) or "").strip().lower()
        text = (row.get(cols.get("text", "")) or "").strip()
        if typ in ("bookmark", "bookmarks"):
            continue
        if not text:
            continue

        rec = {
            "type": "Note" if typ in ("note", "notes") else "Highlight",
            "color": (row.get(cols.get("color", "")) or "").strip().lower() or None,
            "page": (row.get(cols.get("page", "")) or "").strip() or None,
            "location": (row.get(cols.get("location", "")) or "").strip() or None,
            "text": clean(text),
        }
        note_col = cols.get("note")
        if note_col and norm_header(note_col) != norm_header(cols.get("text", "")):
            comment = clean(row.get(note_col, ""))
            if comment:
                rec["comment"] = comment
        notes.append(rec)
    return title, author, notes


# --------------------------------------------------------------------------
def dedupe(notes):
    seen, out = set(), []
    for n in notes:
        key = n.get("text", "").strip().lower()
        if not key:
            continue
        if key in seen:
            continue
        seen.add(key)
        out.append(n)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input", help="Path to the Kindle Notebook HTML or highlights CSV")
    ap.add_argument("-o", "--output", help="Optional path to write the JSON result")
    args = ap.parse_args()

    path = args.input
    low = path.lower()

    if low.endswith((".html", ".htm")):
        title, author, notes = parse_html(path)
    elif low.endswith(".csv"):
        title, author, notes = parse_csv(path)
    else:
        with open(path, encoding="utf-8", errors="replace") as f:
            head = f.read(4096)
        if "<html" in head.lower():
            title, author, notes = parse_html(path)
        else:
            title, author, notes = parse_csv(path)

    bookmarks = [n for n in notes if n.get("type") == "Bookmark"]
    highlights = dedupe([n for n in notes if n.get("type") != "Bookmark"])

    result = {
        "title": title,
        "author": author,
        "source": path,
        "highlight_count": len(highlights),
        "skipped_bookmarks": len(bookmarks),
        "highlights": highlights,
    }

    out = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out + "\n")
    else:
        print(out)


if __name__ == "__main__":
    sys.exit(main())
