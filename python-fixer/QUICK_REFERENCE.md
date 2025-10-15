# UVA Document Fixer - Quick Reference

## Most Common Usage

```bash
cd python-fixer
python fix_single_file.py "C:\path\to\your\document.docx"
```

Output: `python-fixer\output\fixed-document-[timestamp].docx`

## What Gets Fixed Automatically

✅ **Fonts:**
- Headings → Adobe Caslon Pro
- Body → Franklin Gothic

✅ **Sizes:**
- H1: 18pt
- H2: 15pt
- H3: 13pt
- Body: 11pt
- Hyperlinks: 11pt (or 15pt if in H2)

✅ **Colors:**
- Headings → Navy Blue (#232D4B)
- Body → Black

✅ **Spacing:**
- 0pt after headings
- Removes 100+ empty paragraphs
- Fixes "word.Word" → "word. Word"
- Fixes "[1]monitors" → "[1] monitors"
- Fixes "andSudan" → "and Sudan"

✅ **Removes:**
- Italics
- Small caps
- All caps
- Inappropriate underlines
- Word comments

✅ **Converts:**
- Fake headings (bold 18pt) → Heading 1
- Fake subheadings (bold 18pt links) → Heading 2

## Quick Troubleshooting

### Problem: Changes not appearing
```bash
# Kill all Python processes
taskkill /F /IM python.exe

# Re-run
python fix_single_file.py "your-file.docx"
```

### Problem: File locked
Close the Word document first, then run the tool.

### Problem: Hyperlinks still large
This was fixed in v2.0. Make sure you're using the latest code with `_fix_hyperlinks_xml()` method.

### Problem: Words running together
This was fixed in v2.0. The tool now:
1. Skips empty runs when checking spacing
2. Fixes spacing at XML level before hyperlinks

## Verify The Fix Worked

```bash
cd python-fixer
python check_output.py "output\fixed-document-[timestamp].docx"
```

Look for:
- All hyperlinks should be 11.0pt (or 15.0pt if in headings)
- No "18.0pt" hyperlinks

## Key Files

- `document_fixer.py` - Main logic
- `fix_single_file.py` - Command-line tool (use this!)
- `server.py` - Web interface (port 8080)
- `check_output.py` - Verification tool
- `output/` - Fixed documents here

## Critical Code Sections

### Hyperlink Font Size Fix
**File:** `document_fixer.py`
**Method:** `_fix_hyperlinks_xml()` (line ~431)

**What it does:**
- Finds `<w:hyperlink>` XML elements
- Sets `<w:sz w:val="22"/>` (11pt = 22 half-points)
- Adds spaces before hyperlinks if needed

**Why it's needed:**
Python-docx API doesn't properly handle hyperlink font sizes. Must use direct XML manipulation.

### Fake Heading Conversion
**File:** `document_fixer.py`
**Method:** `_fix_fake_headings()` (line ~453)

**What it does:**
- Detects bold 18pt text under 80 chars
- Converts to Heading 1 (or Heading 2 if hyperlinked)

**Why it's needed:**
Many documents use "Normal" style with bold/large text instead of proper heading styles.

### Spacing Fixes
**File:** `document_fixer.py`
**Method:** `_clean_whitespace()` (line ~334)

**What it does:**
1. Removes empty paragraphs (100+ removed typically)
2. Adds spaces between runs (fixes "[1]monitors")
3. Fixes period spacing ("word.Word" → "word. Word")

**Why it's needed:**
Word documents have complex run structures with empty runs and missing spaces.

## Key Learnings

### 1. Two Levels of Document Structure
- **Python-docx level:** Paragraphs → Runs (some empty)
- **XML level:** Complex nested structure with `<w:hyperlink>` elements

**Both must be fixed independently!**

### 2. Word Font Size Units
Word uses **half-points**:
- 11pt = 22 half-points
- 15pt = 30 half-points
- 18pt = 36 half-points

In XML: `<w:sz w:val="22"/>`

### 3. Empty Runs Break Spacing
When checking adjacent runs, skip empty ones:

```python
# Find next non-empty run
for j in range(i + 1, len(runs)):
    if runs[j].text and runs[j].text.strip():
        next_run = runs[j]
        break
```

### 4. Preserve Spaces in XML
When adding trailing spaces:

```python
t_element.text += ' '
t_element.set(qn('xml:space'), 'preserve')
```

Otherwise Word strips the space!

## Version History

### v2.0 (October 2025) - CURRENT
All major issues fixed:
- ✅ Hyperlink sizes (XML manipulation)
- ✅ Spacing between runs (skip empty runs)
- ✅ Spacing before hyperlinks (XML level)
- ✅ Fake headings (detect and convert)
- ✅ Period spacing (regex)

### v1.0
Basic formatting only. Had issues with:
- ❌ Hyperlinks stayed 18pt
- ❌ Words ran together
- ❌ Fake headings not detected

## If Something Breaks

1. **Check the README.md** - Full details on every fix
2. **Look at git history** - See what changed
3. **Test with test-input.docx** - Verify before using on real docs
4. **Use check_output.py** - Verify actual XML font sizes
5. **Read the code comments** - Every tricky part is documented

## Need to Modify?

### Change font sizes:
Edit `document_fixer.py` lines 122-129:
```python
elif paragraph.style.name == 'Heading 1' or paragraph.style.name == 'Title':
    correct_size = Pt(18)  # Change this
```

### Change colors:
Edit lines 14-16:
```python
UVA_NAVY_BLUE = RGBColor(35, 45, 75)  # Change this
```

### Change spacing:
Edit lines in `_fix_paragraph()` around line 234:
```python
paragraph.paragraph_format.space_after = Pt(0)  # Change this
```

### Disable fake heading detection:
Comment out line 41:
```python
# self._fix_fake_headings()
```

---

**Last Updated:** October 9, 2025
**See README.md for full documentation**
