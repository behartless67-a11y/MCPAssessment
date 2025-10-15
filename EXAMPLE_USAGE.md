# Example Usage: Document Auto-Fix

## Step-by-Step Guide

### Step 1: Create a Brand Kit

First, create a brand kit that defines your organization's branding:

```
User: "Create a brand kit for UVA with:
- Primary colors: UVA Blue #232D4B, UVA Orange #E57200
- Heading font: Adobe Caslon Pro
- Body font: Franklin Gothic
- Include WCAG AA accessibility requirements"
```

**Claude creates:**
```json
{
  "id": "brand-1728486000000",
  "name": "UVA Brand Kit",
  "organization": "University of Virginia",
  "colors": {
    "primary": ["#232D4B", "#E57200"],
    "secondary": ["#FFFFFF", "#F2F2F2"],
    "accent": ["#E57200"]
  },
  "fonts": {
    "headings": ["Adobe Caslon Pro"],
    "body": ["Franklin Gothic"]
  },
  "logos": [{
    "name": "UVA Logo",
    "description": "Official University of Virginia logo"
  }],
  "guidelines": {
    "accessibility": "WCAG 2.1 Level AA compliance required",
    "spacing": "Consistent spacing between sections",
    "imagery": "Use approved UVA imagery"
  }
}
```

Save the brand kit ID: `brand-1728486000000`

---

### Step 2: Upload and Fix a Document

Now you can fix any DOCX or PDF document:

```
User: "I have a syllabus document at C:\Documents\ENGL101-Syllabus.docx
Please fix it using the UVA brand kit. Make sure to:
- Apply the correct UVA fonts
- Add the UVA logo to the footer
- Fix any accessibility issues
- Correct the visual hierarchy"
```

**Claude responds:**

"I'll fix your document using the fix_document tool with the UVA brand kit."

**Tool Call:**
```json
{
  "filePath": "C:\\Documents\\ENGL101-Syllabus.docx",
  "brandKitId": "brand-1728486000000",
  "outputDir": "./output"
}
```

**Result:**
```json
{
  "success": true,
  "message": "Document fixed successfully!",
  "fixedDocument": "./output/fixed-document-1728486123456.docx",
  "changeLog": "./output/changelog-1728486123456.txt",
  "summary": {
    "totalFixes": 18,
    "fontFixes": 1,
    "accessibilityFixes": 4,
    "hierarchyFixes": 2,
    "logoAdded": true
  },
  "totalCorrections": 18,
  "corrections": [
    {
      "type": "logo",
      "description": "Added University of Virginia logo to footer",
      "location": "Footer",
      "after": "Logo inserted with proper branding"
    },
    {
      "type": "font",
      "description": "Applied brand fonts: Adobe Caslon Pro for headings, Franklin Gothic for body",
      "location": "Entire document",
      "after": "87 text elements updated with correct fonts"
    },
    {
      "type": "hierarchy",
      "description": "Improper heading hierarchy detected",
      "location": "Throughout document",
      "after": "Fixed 2 heading level issues"
    },
    {
      "type": "accessibility",
      "description": "Images need descriptive alt text",
      "location": "Image elements",
      "after": "Added descriptive alt text to images"
    },
    ...
  ]
}
```

---

### Step 3: Review the Fixed Document

**Fixed Document Output** (`fixed-document-1728486123456.docx`):

The document now has:
- ✅ **Headings** in Adobe Caslon Pro (UVA heading font)
- ✅ **Body text** in Franklin Gothic (UVA body font)
- ✅ **Primary color** #232D4B (UVA Blue) for all headings
- ✅ **Logo** in footer: "University of Virginia"
- ✅ **Proper H1→H2→H3** hierarchy (no skipped levels)
- ✅ **Consistent spacing** between sections
- ✅ **WCAG AA compliant** structure

**Change Log** (`changelog-1728486123456.txt`):

```
================================================================================
DOCUMENT CORRECTION REPORT
Brand Kit: UVA Brand Kit (University of Virginia)
Generated: 10/9/2025, 2:45:30 PM
================================================================================

SUMMARY
--------------------------------------------------------------------------------
Total Corrections: 18

  Font Corrections: 1
  Color Corrections: 0
  Accessibility Fixes: 4
  Visual Hierarchy Fixes: 2
  Logo Additions: 1
  Spacing Adjustments: 0

DETAILED CHANGES
--------------------------------------------------------------------------------

1. [HIERARCHY] Missing top-level heading (H1)
   Location: Document start
   After: Added H1 heading for document title

2. [HIERARCHY] Improper heading hierarchy detected
   Location: Throughout document
   After: Fixed 2 heading level issues

3. [ACCESSIBILITY] Images need descriptive alt text
   Location: Image elements
   After: Added descriptive alt text to images

4. [ACCESSIBILITY] Color contrast may need verification
   Location: Color usage
   After: Applied WCAG AA compliant color scheme

5. [LOGO] Added University of Virginia logo to footer
   Location: Footer
   After: Logo inserted with proper branding

6. [FONT] Applied brand fonts: Adobe Caslon Pro for headings, Franklin Gothic for body
   Location: Entire document
   After: 87 text elements updated with correct fonts

================================================================================
BRAND KIT APPLIED
--------------------------------------------------------------------------------
Primary Colors: #232D4B, #E57200
Heading Font: Adobe Caslon Pro
Body Font: Franklin Gothic
Accessibility Standard: WCAG 2.1 Level AA compliance required
================================================================================
```

---

## More Examples

### Example 2: Fix Multiple Documents in Batch

```
User: "I have three syllabi that need fixing:
1. C:\Syllabi\MATH201.docx
2. C:\Syllabi\HIST301.docx
3. C:\Syllabi\CHEM150.pdf

Fix all of them using the UVA brand kit."
```

Claude will call `fix_document` three times and provide three sets of output files.

---

### Example 3: PDF Document Fix

```
User: "Fix this PDF assignment sheet: C:\Assignments\Assignment1.pdf
Use the UVA brand kit."
```

**What happens:**
1. PDF is parsed to extract text
2. Text is analyzed for issues
3. New DOCX is created with:
   - UVA fonts
   - UVA colors
   - UVA logo in footer
   - All accessibility fixes
   - Proper hierarchy
4. Change log generated

**Output:** Fixed DOCX + Change Log (even though input was PDF)

---

### Example 4: Custom Output Directory

```
User: "Fix C:\Documents\Syllabus.docx with the UVA brand kit
and save the output to C:\Fixed-Documents\"
```

**Tool Call:**
```json
{
  "filePath": "C:\\Documents\\Syllabus.docx",
  "brandKitId": "brand-1728486000000",
  "outputDir": "C:\\Fixed-Documents"
}
```

**Output:**
- `C:\Fixed-Documents\fixed-document-1728486123456.docx`
- `C:\Fixed-Documents\changelog-1728486123456.txt`

---

## Real-World Scenarios

### Scenario 1: Instructor Preparing Course Materials

**Problem:** Professor has 10 old syllabi that don't follow current UVA branding or accessibility standards.

**Solution:**
1. Create UVA brand kit (one time)
2. Upload each syllabus
3. AI fixes all branding and accessibility issues
4. Professor reviews change logs
5. Ready to publish to students!

**Time Saved:** Hours of manual formatting → Minutes with AI

---

### Scenario 2: Instructional Designer Standardizing Department

**Problem:** Department has 50+ courses with inconsistent branding and poor accessibility.

**Solution:**
1. Create department brand kit
2. Batch process all syllabi and assignments
3. AI standardizes fonts, colors, logos, accessibility
4. Review change logs for quality assurance
5. Deploy standardized materials

**Impact:** Consistent professional branding across entire department

---

### Scenario 3: Accessibility Compliance Audit

**Problem:** University needs all course materials WCAG AA compliant by deadline.

**Solution:**
1. Upload all course documents
2. AI automatically fixes:
   - Heading hierarchy
   - Alt text for images
   - Color contrast
   - Document structure
3. Change logs provide audit trail
4. Materials now compliant

**Benefit:** Meet compliance requirements quickly and accurately

---

## Tips for Best Results

### ✅ DO:
- Create detailed brand kits with all fonts and colors
- Use absolute file paths
- Review change logs to understand what was fixed
- Test with sample documents first
- Keep brand kits up to date

### ❌ DON'T:
- Use relative file paths (won't work)
- Skip creating a brand kit first
- Forget to check the output directory
- Ignore the change log (it's valuable!)

---

## Troubleshooting

**Q: "File not found" error**
- A: Use absolute paths like `C:\Documents\file.docx`

**Q: "Brand kit not found" error**
- A: Make sure brand kit was created successfully and use the correct ID

**Q: Output directory doesn't exist**
- A: The tool creates it automatically, but parent directory must exist

**Q: Want to undo changes?**
- A: Keep your original files! Fixed document is separate.

---

## Summary

The `fix_document` tool provides:

🎯 **Automatic fixing** - No manual work required
🎨 **Brand compliance** - Fonts, colors, logos applied
♿ **Accessibility** - WCAG AA standards met
📊 **Transparency** - Change logs show all edits
⚡ **Speed** - Process documents in seconds
💾 **Safety** - Original files untouched

**Perfect for:** Educators, instructional designers, content creators, accessibility coordinators, anyone managing educational documents.
