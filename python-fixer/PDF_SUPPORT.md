# PDF Support Documentation

## Overview
As of v2.1, the UVA Document Fixer now supports PDF files! The tool automatically converts PDFs to DOCX format, then applies all UVA branding fixes.

## How It Works

### Command Line
```bash
cd python-fixer
python fix_single_file.py "your-document.pdf"
```

The tool will:
1. Detect that it's a PDF file
2. Convert PDF → DOCX using pdf2docx library
3. Apply all UVA branding fixes
4. Save the fixed DOCX file in `output/`

### Web Interface
1. Go to http://localhost:8080
2. Click "Upload Document"
3. Select your PDF file
4. Click "Fix My Document"
5. Download the fixed DOCX file

## Technical Details

### PDF to DOCX Conversion
The tool uses the `pdf2docx` library, which:
- Extracts text, images, and formatting from PDF
- Converts to DOCX while preserving layout
- Handles multi-page documents
- Supports tables, images, and complex layouts

**Note:** PDF conversion quality depends on how the original PDF was created:
- ✅ **Best:** PDFs created from Word/Office (native text)
- ⚠️ **Good:** PDFs with embedded fonts and selectable text
- ❌ **Poor:** Scanned PDFs (requires OCR, not currently supported)

### Conversion Process

1. **Input:** `document.pdf`
2. **Intermediate:** `document-converted-[timestamp].docx` (saved in `output/`)
3. **Final:** `fixed-document-[timestamp].docx` (fully branded)

Both the converted and fixed files are saved, so you can see the before/after.

## Code Changes

### document_fixer.py
Added `convert_pdf_to_docx()` function:
```python
def convert_pdf_to_docx(pdf_path, output_dir="output"):
    """Convert PDF to DOCX using pdf2docx"""
    cv = Converter(pdf_path)
    cv.convert(docx_path, start=0, end=None)
    cv.close()
    return docx_path
```

Modified `fix_document()` to auto-detect PDFs:
```python
def fix_document(input_path, output_dir="output"):
    file_ext = os.path.splitext(input_path)[1].lower()

    # If PDF, convert to DOCX first
    if file_ext == '.pdf':
        docx_path = convert_pdf_to_docx(input_path, output_dir)
        input_path = docx_path
```

### server.py
Removed the PDF error check - now automatically handles PDFs:
```python
# Before (v2.0):
if filename.lower().endswith('.pdf'):
    return jsonify({'error': 'PDF support coming soon!'}), 400

# After (v2.1):
# Automatically handled by fix_document()
result = fix_document(temp_path, OUTPUT_FOLDER)
```

### requirements.txt
Added PDF dependencies:
```
pdf2docx==0.5.8
```

This installs:
- PyMuPDF (PDF parsing)
- fonttools (font handling)
- opencv-python-headless (image processing)
- numpy (numerical operations)

## Known Limitations

### 1. Scanned PDFs
**Problem:** PDFs created from scans/images don't have selectable text

**Solution:** Use an OCR tool first (like Adobe Acrobat Pro or online OCR services) to convert the scanned PDF to a text PDF, then upload to our tool.

### 2. Complex Formatting
**Problem:** Some PDF elements don't translate perfectly to DOCX:
- Custom fonts may be substituted
- Exact spacing may differ slightly
- Some graphics/shapes may not preserve perfectly

**Solution:** Review the converted file and make manual adjustments if needed.

### 3. Large Files
**Problem:** Very large PDFs (100+ pages) may take time to convert

**Expected Time:**
- 1-10 pages: 5-10 seconds
- 10-50 pages: 30-60 seconds
- 50-100 pages: 1-3 minutes
- 100+ pages: 3+ minutes

**Solution:** Be patient, the tool will show "Converting PDF..." message while working.

### 4. Encrypted PDFs
**Problem:** Password-protected PDFs cannot be converted

**Solution:** Remove password protection first, then upload.

## Testing

### Test with Command Line
```bash
cd python-fixer
python fix_single_file.py "test.pdf"
```

Expected output:
```
>>> PDF detected, converting to DOCX first...
>>> Converting PDF to DOCX: test.pdf
>>> PDF converted successfully: output/test-converted-[timestamp].docx
>>> apply_uva_branding() started
[... branding fixes ...]
>>> Fixed document: output/fixed-document-[timestamp].docx
```

### Test with Web Interface
1. Start server: `python server.py`
2. Open browser: http://localhost:8080
3. Upload a PDF
4. Should work seamlessly - no error messages

## Troubleshooting

### Error: "PDF conversion failed"
**Causes:**
- Corrupted PDF file
- Encrypted/password-protected PDF
- Scanned PDF without text layer

**Solutions:**
- Try opening PDF in Adobe Reader to verify it's valid
- Remove password protection
- Use OCR if it's a scanned PDF

### Error: "PyMuPDF not found"
**Cause:** pdf2docx dependencies not installed

**Solution:**
```bash
pip install pdf2docx
```

### Conversion Takes Too Long
**Cause:** Large PDF or complex formatting

**Solutions:**
- Wait patiently (check console for progress)
- If > 5 minutes, try splitting PDF into smaller files
- Simplify PDF by removing unnecessary images/graphics

### Poor Conversion Quality
**Cause:** PDF created from scans or has complex layouts

**Solutions:**
- Use OCR tool first if scanned
- Consider manually re-creating the document in Word
- Try an online PDF→DOCX converter first, then upload the DOCX

## Benefits

### For Users
- ✅ No need to manually convert PDFs first
- ✅ One-click workflow: upload PDF → get branded DOCX
- ✅ Saves time and reduces errors
- ✅ Works with both web and command-line interfaces

### For Workflow
- ✅ Handles legacy PDF documents
- ✅ Supports documents from external sources
- ✅ Enables batch processing of mixed PDF/DOCX files
- ✅ Future-proof: works with any PDF format

## Future Enhancements

### Planned Features
1. **OCR Support:** Auto-detect scanned PDFs and apply OCR
2. **Batch Processing:** Convert multiple PDFs at once
3. **Quality Options:** Choose conversion quality (fast vs accurate)
4. **Page Selection:** Convert only specific pages from PDF
5. **Metadata Preservation:** Keep PDF metadata in DOCX properties

### Potential Libraries
- `pytesseract` for OCR
- `pdf2image` for better image handling
- `pdfplumber` for improved table extraction

## Changelog

### v2.1 - October 2025
- ✅ Added PDF to DOCX conversion support
- ✅ Automatic file type detection
- ✅ Seamless integration with existing workflow
- ✅ Updated documentation

---

**Last Updated:** October 9, 2025
**Version:** 2.1
**See README.md for full documentation**
