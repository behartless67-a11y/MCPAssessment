# UVA Document Fixer - Python Version

## Overview
This tool automatically applies UVA Batten School branding and formatting standards to Word documents (.docx files). It fixes fonts, colors, spacing, headings, hyperlinks, and removes unnecessary formatting.

## Quick Start

### Command Line Usage (Recommended)
```bash
cd python-fixer
python fix_single_file.py "path/to/your/document.docx"
```

The fixed document will be saved in `output/fixed-document-[timestamp].docx`

### Web Interface Usage
```bash
cd python-fixer
python server.py
```

Then open browser to: `http://localhost:8080`

**Note:** If you make code changes, you must restart the server (Ctrl+C, then run again) for changes to take effect.

## UVA Brand Standards Applied

### Fonts
- **Headings:** Adobe Caslon Pro
- **Body Text:** Franklin Gothic

### Colors
- **Headings:** Navy Blue (#232D4B / RGB 35, 45, 75)
- **Body Text:** Black (#000000)

### Font Sizes
- **Heading 1:** 18pt
- **Heading 2:** 15pt
- **Heading 3:** 13pt
- **Body Text:** 11pt
- **Hyperlinks:** Match surrounding text size (11pt for body, 15pt if in Heading 2)

### Spacing
- **After Headings:** 0pt (body text directly underneath)
- **After Paragraphs:** 0pt
- **Line Spacing:** 1.0 for headings, 1.15 for body text
- **Period Spacing:** Exactly one space after periods

## What This Tool Fixes

### 1. Fake Headings → Proper Heading Styles
**Problem:** Text that looks like a heading (bold, large, short) but uses "Normal" style

**Solution:** Automatically converts to proper Heading 1, 2, or 3 based on:
- Font size (18pt → H1, 15pt → H2, 13pt → H3)
- Bold formatting
- Text length (< 80 characters)
- Special case: Bold 18pt text with hyperlinks → Heading 2 (subsections)

**Examples:**
- "INTRODUCTION" (18pt, bold, Normal style) → Heading 1
- "South Africa" (18pt, bold, hyperlinked) → Heading 2

### 2. Hyperlink Font Sizes
**Problem:** Hyperlinks appearing too large (18pt) instead of matching body text (11pt)

**Solution:**
- Direct XML manipulation of hyperlink elements (python-docx API doesn't handle this well)
- Sets font size at XML level: `<w:sz w:val="22"/>` (22 half-points = 11pt)
- Handles both regular hyperlinks and hyperlinks within headings

**Technical Details:**
- Hyperlinks are stored as `<w:hyperlink>` XML elements
- Font size must be set on child `<w:r>` (run) elements
- Method: `_fix_hyperlinks_xml()` in [document_fixer.py](document_fixer.py#L431)

### 3. Spacing Issues

#### Empty Paragraphs
**Problem:** Multiple empty paragraphs creating excessive whitespace

**Solution:**
- Iteratively removes all empty paragraphs (runs 10 iterations max)
- Removes paragraphs with no text or only whitespace
- Method: `_clean_whitespace()` removes empty paragraph XML elements

**Results:** Typically removes 100+ empty paragraphs per document

#### Spacing Between Runs
**Problem:** Words running together after hyperlinks or formatted text (e.g., "including**Burkina Faso**" or "[1]monitors")

**Solution:**
- Detects adjacent runs with missing spaces
- Adds space when transitioning from text/number/closing punctuation to letters
- Handles empty runs between content runs
- Method: `_clean_whitespace()` second pass checks all run pairs

**Examples:**
- `[1]` + `monitors` → `[1] monitors`
- `including�` + hyperlink "Burkina Faso" → `including Burkina Faso`

#### Spacing Before Hyperlinks (XML Level)
**Problem:** Text running into hyperlinks at XML level (e.g., "including�Burkina Faso")

**Solution:**
- Checks the run immediately before each `<w:hyperlink>` element
- Adds space if text ends with alphanumeric or special chars like `�`
- Sets `xml:space="preserve"` attribute to maintain the space
- Method: `_fix_hyperlinks_xml()` spacing logic

### 4. Unwanted Formatting Removal

#### Italics, Small Caps, All Caps
**Problem:** These formatting styles aren't part of UVA brand standards

**Solution:** Automatically removes:
- `run.font.italic = False`
- `run.font.small_caps = False`
- `run.font.all_caps = False`

#### Inappropriate Underlines
**Problem:** Underlined text (except hyperlinks)

**Solution:** Removes underlines from non-hyperlink text while preserving hyperlink underlines

#### Colored Text (Non-Hyperlinks)
**Problem:** Body text in random colors

**Solution:** Sets body text to black, preserves hyperlink colors

### 5. Period Spacing
**Problem:** Missing spaces after periods (e.g., "word.Word") or multiple spaces

**Solution:** Regular expressions:
- `\.(?=[A-Z])` → `. ` (add space after period before capital letter)
- `\. {2,}` → `. ` (replace multiple spaces with one)

### 6. Word Comments
**Problem:** Comments from Word appear in the document

**Solution:** Removes all comment XML elements from the document

## File Structure

```
python-fixer/
├── document_fixer.py       # Main document fixing logic
├── server.py              # Flask web server (port 8080)
├── fix_single_file.py     # Command-line script
├── check_output.py        # Utility to verify hyperlink sizes
├── text_to_docx.py        # Convert plain text to formatted DOCX
├── output/                # Fixed documents saved here
├── battenlogo.png         # UVA Batten School logo
└── README.md              # This file
```

## Key Methods in `document_fixer.py`

### `apply_uva_branding()`
Main orchestration method that:
1. Removes Word comments
2. Converts fake headings to proper styles
3. Fixes all paragraphs (fonts, colors, sizes)
4. Fixes table cells
5. Applies style changes
6. Cleans whitespace
7. Fixes hyperlinks at XML level
8. Adds logo to footer

### `_fix_fake_headings()`
Detects and converts fake headings:
- Checks text length (< 80 chars)
- Detects bold formatting
- Measures font size (18pt, 15pt, 13pt)
- Special handling for hyperlinked headings (subsections)

### `_fix_paragraph(paragraph)`
Fixes individual paragraph formatting:
- Determines if heading vs body text
- Sets correct font (Adobe Caslon Pro vs Franklin Gothic)
- Sets correct color (Navy Blue vs Black)
- Sets correct size (18pt/15pt/13pt/11pt)
- Removes italics, small caps, all caps, inappropriate underlines
- Sets spacing (0pt after headings)

### `_clean_whitespace()`
Two-pass cleaning:
1. **First pass:** Removes empty paragraphs (iterative, up to 10 rounds)
2. **Second pass:** Fixes spacing between runs
   - Skips empty runs to find next content
   - Adds spaces between alphanumeric/punctuation and letters
   - Fixes period spacing with regex

### `_fix_hyperlinks_xml()`
Direct XML manipulation:
1. **Spacing:** Adds space before hyperlink if previous run needs it
2. **Font Size:** Sets `<w:sz w:val="22"/>` on all hyperlink runs
3. **Complex Scripts:** Also sets `<w:szCs>` for compatibility

### `_apply_style_changes()`
Modifies document-level styles:
- Heading 1-6 styles: Adobe Caslon Pro, Navy Blue, bold, specific sizes
- Hyperlink style: Franklin Gothic, 11pt
- Sets spacing to 0pt for all heading styles

## Common Issues & Solutions

### Issue: Changes Not Appearing
**Causes:**
1. Multiple Python servers running (old code cached)
2. Flask debug mode not reloading code
3. File is open in Word (locked)

**Solutions:**
1. Kill all Python processes: `taskkill /F /IM python.exe`
2. Use command-line script instead of web interface
3. Close Word document before processing

### Issue: Hyperlinks Still Large
**Cause:** The python-docx API doesn't properly set font sizes on hyperlink elements

**Solution:** Direct XML manipulation in `_fix_hyperlinks_xml()`:
```python
sz = rPr.get_or_add_sz()
sz.val = 22  # 11pt = 22 half-points
```

### Issue: Words Running Together
**Causes:**
1. Empty runs between content runs
2. Missing space before hyperlink elements at XML level

**Solutions:**
1. Skip empty runs when checking adjacent runs
2. Check and fix spacing at XML level before hyperlinks

### Issue: Headings Shrinking to Body Size
**Cause:** Text using "Normal" style instead of proper Heading styles

**Solution:** Enable fake heading detection (`_fix_fake_headings()`)

## Development History & Key Learnings

### Hyperlink Font Size Journey
This was the most challenging fix, requiring multiple attempts:

1. **Attempt 1:** Set via python-docx API (`run.font.size = Pt(11)`)
   - **Result:** ❌ Didn't persist to saved file

2. **Attempt 2:** Modified Hyperlink style definition
   - **Result:** ❌ Hyperlinks inherited from parent elements

3. **Attempt 3:** Set at XML level via `run._element.rPr.get_or_add_sz().val = 22`
   - **Result:** ❌ Set on wrong runs (not the actual hyperlink runs)

4. **Attempt 4:** Remove hyperlink XML elements entirely
   - **Result:** ❌ Made links non-clickable but STILL 18pt!

5. **Attempt 5:** Direct XML manipulation finding `<w:hyperlink>` elements
   - **Result:** ✅ **SUCCESS!** This finally worked.

**Key Insight:** Hyperlinks in Word DOCX are complex XML structures. The python-docx library doesn't expose proper access to hyperlink formatting. Direct XML manipulation using lxml is required.

### Spacing Between Runs Journey

1. **Initial Issue:** `[1]monitors` - no space after hyperlink
2. **First Attempt:** Check adjacent runs only
   - **Result:** ❌ Missed cases with empty runs between
3. **Second Attempt:** Skip empty runs to find next content
   - **Result:** ✅ Fixed spacing between runs in python-docx paragraph structure

4. **Second Issue:** `including�Burkina Faso` - no space before hyperlink
5. **Solution:** Add XML-level spacing check before `<w:hyperlink>` elements
   - **Result:** ✅ Fixed spacing at XML level

**Key Insight:** Word documents have TWO levels of structure:
- **Python-docx level:** Paragraphs with runs (some empty)
- **XML level:** Complex nested structure with hyperlink elements separate from runs

Both levels must be fixed independently.

### Fake Heading Detection
Initially disabled due to false positives. Re-enabled with better logic:
- Detect 18pt bold text → Heading 1
- Detect 18pt bold hyperlinked text → Heading 2 (subsections)
- Only converts text < 80 characters

## Technical Notes

### Word Font Size Units
Word uses **half-points** for font sizes:
- 11pt = 22 half-points
- 13pt = 26 half-points
- 15pt = 30 half-points
- 18pt = 36 half-points

In XML: `<w:sz w:val="22"/>`
In python-docx: `Pt(11)`

### XML Namespaces
```python
nsmap = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}
```

Use `qn('w:tagname')` from python-docx for qualified names.

### Preserving Spaces in XML
When adding trailing spaces to text elements, you must set:
```python
t_element.set(qn('xml:space'), 'preserve')
```

Otherwise Word will strip the space when loading the document.

### Empty Paragraph Removal
Must remove from XML directly:
```python
p_element = paragraph._element
parent = p_element.getparent()
parent.remove(p_element)
```

Cannot use python-docx API for this.

## Testing & Verification

### Verify Hyperlink Sizes
```bash
cd python-fixer
python check_output.py "output/fixed-document-[timestamp].docx"
```

This reads the actual XML and shows true font sizes.

### Check Document Structure
```python
from docx import Document
doc = Document('file.docx')

for i, para in enumerate(doc.paragraphs):
    print(f"Para {i}: style='{para.style.name}', text='{para.text[:50]}'")
    for j, run in enumerate(para.runs):
        size = run.font.size.pt if run.font.size else 'None'
        print(f"  Run {j}: size={size}pt, text='{run.text[:30]}'")
```

### Test Specific Document
```bash
cd python-fixer
python fix_single_file.py test-input.docx
```

Check output in `output/` folder.

## Dependencies

```
python-docx
Flask
lxml
```

Install via:
```bash
pip install python-docx Flask lxml
```

## Setup Instructions

### 1. Install Python
Download and install Python from: https://www.python.org/downloads/

**Important:** Check "Add Python to PATH" during installation!

### 2. Install Required Libraries
```bash
cd python-fixer
pip install -r requirements.txt
```

### 3. Run the Tool

**Command Line (Recommended):**
```bash
python fix_single_file.py "your-document.docx"
```

**Web Interface:**
```bash
python server.py
```
Then open: http://localhost:8080

## Future Improvements

### Potential Enhancements
1. **Table Formatting:** Apply UVA branding to tables (borders, header colors)
2. **Image Handling:** Ensure images have proper captions and alt text
3. **Accessibility Checks:** Validate heading hierarchy, alt text, color contrast
4. **Batch Processing:** Process multiple files at once
5. **Configuration File:** Allow customization of brand standards
6. **Undo Feature:** Save original document before making changes
7. **Change Preview:** Show what will be changed before applying

### Known Limitations
1. **PDF Input:** Currently only supports DOCX files (PDF support would require OCR)
2. **Complex Tables:** Nested tables may not format perfectly
3. **Embedded Objects:** Charts, equations may not retain formatting
4. **Track Changes:** Doesn't preserve Word track changes
5. **Custom Styles:** May override user-created custom styles

## Changelog

### v2.0 (Current) - October 2025
- ✅ Fixed hyperlink font sizes via XML manipulation
- ✅ Fixed spacing between runs (including empty runs)
- ✅ Fixed spacing before hyperlinks at XML level
- ✅ Added fake heading detection and conversion
- ✅ Added period spacing normalization
- ✅ Removed 100+ empty paragraphs per document
- ✅ Improved whitespace cleanup
- ✅ Added comprehensive documentation

### v1.0 - Initial Version
- Basic font and color application
- Heading style fixes
- Logo insertion in footer
- Web interface and command-line tool

## Support

### Common Commands

**Kill all Python processes (if stuck):**
```bash
taskkill /F /IM python.exe
```

**Check which Python processes are running:**
```bash
tasklist | findstr python
```

**Find recent output files:**
```bash
ls -lt output/*.docx | head -5
```

**Open latest output file:**
```bash
start "" "output/fixed-document-[timestamp].docx"
```

### Troubleshooting

**"Python not found"**
- Make sure Python is installed and added to PATH
- Try `python3` instead of `python`

**"Module not found"**
- Run: `pip install -r requirements.txt`

**"Logo not found"**
- Make sure `battenlogo.png` is in the parent folder
- Server will skip logo if file is missing

**"PackageNotFoundError"**
- File path is incorrect or file is locked
- Close Word document before processing
- Use full absolute path to file

---

**Last Updated:** October 9, 2025
**Version:** 2.0
**Maintained by:** UVA Batten School
