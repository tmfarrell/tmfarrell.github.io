#!/usr/bin/env python3

import datetime as dt
import re
import fire
import os
from collections import defaultdict


def post_header(title):
    return (f"---\nlayout: post\ntitle:  'Re: \"{title}\"'\n"
            f"date:   {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
            "categories: reading\nhidden: true\n---\n\n")

def post_table(title, author="Unknown"):
    return (
        f"| **Title** | {title} |\n"
        f"| **Author** | {author} |\n"
        f"| **Type** | Book |\n"
    )

def highlight_to_blockquote(highlight_text):
    # Split highlight into paragraphs and wrap each in <p> tags
    paragraphs = [p.strip() for p in highlight_text.split('\n') if p.strip()]
    content = ''.join([f"<p>{p}</p>" for p in paragraphs])
    return f"<blockquote>{content}</blockquote>"

def generate_title(paragraph):
    """Generate a simple title from the first few words of the paragraph"""
    words = paragraph.split()[:5]
    return ' '.join(words) + ('...' if len(paragraph.split()) > 5 else '')

def clean_title(raw_title):
    """Clean and format book title"""
    # Remove common file extensions and clean up
    title = raw_title.replace('-', ' ').replace('_', ' ')
    title = re.sub(r'\s+', ' ', title).strip()
    
    # Capitalize words properly
    title = ' '.join(word.capitalize() for word in title.split())
    
    return title

def parse_kindle_highlights(file_path):
    """Parse Kindle highlights file and return dictionary of books with their highlights"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by the separator
    entries = content.split('==========')
    
    books = defaultdict(list)
    
    for entry in entries:
        entry = entry.strip()
        if not entry:
            continue
            
        lines = entry.split('\n')
        if len(lines) < 2:
            continue
            
        # First line should be the book title
        book_title_raw = lines[0].strip()
        if not book_title_raw:
            continue
            
        # Second line should be the metadata (- Your Highlight on page...)
        if len(lines) < 2 or not lines[1].startswith('- Your'):
            continue
            
        metadata_line = lines[1].strip()
        
        # Skip bookmarks, only process highlights and notes
        if 'Bookmark' in metadata_line:
            continue
            
        # Extract the highlight text (everything after the metadata line)
        highlight_lines = lines[2:]
        highlight_text = '\n'.join(highlight_lines).strip()
        
        if not highlight_text:
            continue
            
        # Clean the book title
        book_title = clean_title(book_title_raw)
        
        # Store highlight with metadata
        books[book_title].append({
            'text': highlight_text,
            'metadata': metadata_line,
            'type': 'Note' if 'Note' in metadata_line else 'Highlight'
        })
    
    return books

def create_filename(title):
    """Create a safe filename from title"""
    # Remove special characters and replace spaces with underscores
    safe_title = re.sub(r'[^\w\s-]', '', title.lower())
    safe_title = re.sub(r'[-\s]+', '_', safe_title)
    return safe_title[:50]  # Limit length

def main(kindle_file, output_dir="_posts"):
    """
    Process Kindle highlights file and create individual blog posts for each book
    
    Args:
        kindle_file: Path to the Kindle highlights file (e.g., "My Clippings.txt")
        output_dir: Directory to save the generated posts (default: "_posts")
    """
    
    print(f"Processing Kindle highlights from: {kindle_file}")
    
    # Parse the highlights
    books = parse_kindle_highlights(kindle_file)
    
    print(f"Found {len(books)} books with highlights")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process each book
    for book_title, highlights in books.items():
        print(f"\nProcessing '{book_title}' with {len(highlights)} highlights...")
        
        # Create the post content
        post_content = post_header(book_title)
        post_content += post_table(book_title)
        post_content += "\n\n"
        
        # Add each highlight as a blockquote
        for i, highlight_data in enumerate(highlights):
            highlight_text = highlight_data['text']
            highlight_type = highlight_data['type']
            
            # Generate a title for the highlight
            try:
                section_title = generate_title(highlight_text)
            except:
                section_title = f"{highlight_type} {i+1}"
            
            # Add the highlight
            post_content += f"### {section_title}\n\n"
            post_content += highlight_to_blockquote(highlight_text)
            post_content += "\n\n"
        
        # Create filename
        filename = create_filename(book_title)
        post_filename = f"{dt.datetime.now().strftime('%Y-%m-%d')}-re_{filename}.md"
        post_path = os.path.join(output_dir, post_filename)
        
        # Write the post
        with open(post_path, 'w', encoding='utf-8') as f:
            f.write(post_content)
            
        print(f"Created post: {post_path}")
    
    print(f"\nProcessing complete! Generated {len(books)} posts in {output_dir}/")

if __name__ == '__main__':
    fire.Fire(main)