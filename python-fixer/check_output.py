"""
Check what sizes are actually in the output file
"""
import sys
from docx import Document

if len(sys.argv) < 2:
    print("Usage: python check_output.py output.docx")
    sys.exit(1)

doc = Document(sys.argv[1])

print("Checking all text runs in document:")
for i, para in enumerate(doc.paragraphs):
    for run in para.runs:
        if run.text.strip():
            size = run.font.size.pt if run.font.size else "None"
            has_underline = run.font.underline
            has_color = run.font.color.rgb is not None

            if has_underline or has_color:
                print(f"Para {i}: size={size}pt, underline={has_underline}, colored={has_color}, text='{run.text[:40]}'")
