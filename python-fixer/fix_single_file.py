"""
Simple script to fix a single DOCX file
Usage: python fix_single_file.py input.docx
"""

import sys
from document_fixer import fix_document

if len(sys.argv) < 2:
    print("Usage: python fix_single_file.py input.docx")
    sys.exit(1)

input_file = sys.argv[1]
print(f"Fixing {input_file}...")

result = fix_document(input_file, "output")

print(f"\nDONE!")
print(f"Fixed document: {result['fixed_document']}")
print(f"Change log: {result['change_log']}")
print(f"Total fixes: {result['summary']['total_fixes']}")
