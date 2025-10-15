# Testing Guide - MCP Coursework Assessment Tool

## Overview

This guide will help you test the complete system including the MCP server, API gateway, and web frontend.

## Architecture

```
┌─────────────────┐
│  Web Frontend   │  (Next.js on port 3000)
│  React/Tailwind │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  API Gateway    │  (Express on port 3001)
│  + Claude AI    │
└────────┬────────┘
         │ (Optional: For advanced features)
         ↓
┌─────────────────┐
│   MCP Server    │  (Your backend tools)
│                 │
└─────────────────┘
```

## Quick Start - Simple Testing (Recommended)

**The easiest way to test is using just the API Gateway + Frontend:**

### Step 1: Set Up API Gateway

```bash
cd api-server

# Install dependencies
npm install

# Create .env file
echo "ANTHROPIC_API_KEY=your-key-here" > .env
# OR copy the example
cp .env.example .env
# Then edit .env and add your API key

# Run the server
npm run dev
```

Server should start on http://localhost:3001

### Step 2: Set Up Frontend

Open a **new terminal**:

```bash
cd web-frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

Frontend should start on http://localhost:3000

### Step 3: Test It!

1. Open browser to http://localhost:3000
2. You'll see the UVA Course Assessment Tool
3. Select an analysis type (Quality Matters, Accessibility, or General)
4. Upload a test document (see Test Documents section below)
5. Click "Analyze Document"
6. View results!

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it to your `.env` file in the `api-server` directory

---

## Test Documents

Create test documents to analyze:

### Test 1: Simple Syllabus (syllabus-test.txt)

```
COURSE SYLLABUS

HIST 101: Introduction to American History
Fall 2025

Instructor: Dr. Jane Smith
Email: jsmith@virginia.edu
Office Hours: MWF 2-3pm

COURSE DESCRIPTION
This course provides an overview of American history from colonial times to the present.

LEARNING OBJECTIVES
Students will learn about major events in American history.
Students will understand the causes of the Civil War.

GRADING
Midterm: 30%
Final: 40%
Papers: 30%

REQUIRED TEXTS
American History textbook (any edition)

SCHEDULE
Week 1: Colonial America
Week 2: Revolutionary War
...
```

### Test 2: Accessibility Test Document (assignment-test.txt)

```
Assignment 1: Research Paper

Due Date: October 15

Instructions:
Write a 5-page research paper on a topic of your choice.

Requirements:
- Must be 5 pages
- Use MLA format
- Submit on Canvas

Grading:
Your paper will be graded on content and formatting.
```

### Test 3: Good QM Example (good-module.txt)

```
MODULE 1: GETTING STARTED

LEARNING OBJECTIVES
By the end of this module, you will be able to:
1. Analyze the impact of climate change on coastal ecosystems using scientific data
2. Evaluate different mitigation strategies using evidence-based criteria
3. Create a data-driven presentation on environmental policy

MATERIALS
- Readings: Climate Science 101 (Chapter 1-3)
- Video: Introduction to Environmental Data Analysis (15 min)
- Interactive Simulation: Carbon Cycle Model

ACTIVITIES
1. Discussion: Post your analysis of the assigned reading by Wednesday
2. Data Analysis Exercise: Complete the worksheet using provided datasets
3. Peer Review: Review two classmates' analyses by Friday

ASSESSMENT
Quiz (10 points): Tests objectives 1-2
Presentation (25 points): Demonstrates objective 3

RUBRIC FOR PRESENTATION:
Excellent (23-25): Data analysis is thorough, conclusions well-supported
Good (20-22): Data analysis present, conclusions mostly supported
...

TECHNOLOGY
- Excel or Google Sheets for data analysis
- Tutorial: How to use Google Sheets (5 min video)

SUPPORT RESOURCES
- Tutoring: Available Mon-Fri 9am-5pm at Learning Center
- Technical Help: IT Help Desk 434-924-HELP
```

---

## What to Test

### 1. Quality Matters Analysis

**Upload:** `good-module.txt` or any course syllabus

**Expected Results:**
- Overall QM score out of 101 points
- Breakdown of all 8 standards
- Identification of essential standards met/missing
- Whether it meets 85% threshold
- Specific recommendations for improvement

**Look For:**
- Standard 1 (Course Overview): Does it have clear getting started info?
- Standard 2 (Objectives): Are objectives measurable?
- Standard 3 (Assessment): Are rubrics provided?
- Standard 8 (Accessibility): Are accessibility features mentioned?

### 2. Accessibility Analysis

**Upload:** `assignment-test.txt` or any PDF document

**Expected Results:**
- WCAG 2.1 AA compliance score
- List of accessibility issues by severity
- Specific WCAG criteria that failed
- Recommendations for fixes
- Branding compliance (if applicable)

**Look For:**
- Missing alt text warnings
- Color contrast issues
- Heading structure problems
- Link text quality

### 3. General Recommendations

**Upload:** Any document

**Expected Results:**
- Document-specific recommendations
- Accessibility improvements
- Structure suggestions
- Content improvements

---

## Expected Behavior

### File Upload
- ✅ Drag and drop works
- ✅ Click to browse works
- ✅ Accepts: PDF, DOCX, DOC, TXT, MD
- ✅ Rejects: Other file types
- ✅ Max file size: 10MB

### Analysis Types

**Quality Matters:**
- Shows overall score percentage
- Shows points (X/101)
- Shows 85% threshold status
- Shows each standard score
- Color-coded results (green=good, red=needs work)

**Accessibility:**
- Shows WCAG AA compliance score
- Lists issues by severity (critical/warning/info)
- Shows passed criteria
- Provides specific fix recommendations

**General:**
- Categorized recommendations
- Structured feedback
- Best practices

### UI/UX
- Loading spinner during analysis
- Error messages if something fails
- Color-coded results (UVA blue/orange theme)
- Responsive design (works on mobile)

---

## Troubleshooting

### "API Key not set" warning
- Make sure you created `.env` file in `api-server/`
- Add: `ANTHROPIC_API_KEY=your-actual-key`
- Restart the API server

### "Network Error" or "Failed to fetch"
- Check that API server is running on port 3001
- Check browser console for errors
- Make sure frontend is configured to proxy to localhost:3001

### "Could not extract text from file"
- File might be corrupted
- Try a simple .txt file first
- PDFs might be scanned images (need OCR)
- DOCX files must be valid Microsoft Word format

### Analysis takes too long
- First request can take 30-60 seconds (Claude thinking)
- Subsequent requests should be faster
- Large files take longer to process

### Results don't look right
- Check browser console for errors
- Verify JSON response structure
- Claude's responses may vary - this is expected

---

## Sample Test Session

Here's what a complete test session looks like:

1. **Start servers:**
   ```bash
   # Terminal 1
   cd api-server && npm run dev

   # Terminal 2
   cd web-frontend && npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Select "Quality Matters" analysis**

4. **Upload test syllabus**

5. **Wait 30-60 seconds for analysis**

6. **Review results:**
   - See overall QM score
   - Check each standard
   - Read recommendations
   - Note critical issues

7. **Try another analysis type (Accessibility)**

8. **Upload a different document**

9. **Compare results**

---

## Advanced Testing (Optional)

If you want to test the full MCP server integration:

### Step 1: Build MCP Server

```bash
cd ..  # Root directory
npm install
npm run build
```

### Step 2: Configure Claude Desktop

Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "coursework-assessment": {
      "command": "node",
      "args": ["./dist/index.js"]
    }
  }
}
```

### Step 3: Test via Claude Desktop

Open Claude Desktop and ask:

```
Can you analyze this syllabus for Quality Matters compliance?
[paste syllabus text]
```

---

## Performance Testing

### Expected Response Times
- File upload: < 1 second
- Text extraction: 1-5 seconds
- AI analysis: 20-60 seconds
- Total: 30-70 seconds typical

### File Size Limits
- Frontend: 10MB max
- Recommended: < 5MB for best performance
- Large PDFs (scanned images) will be slow

---

## Production Deployment Considerations

Before deploying to production:

1. **Environment Variables:**
   - Set `ANTHROPIC_API_KEY` securely
   - Use environment-specific configs
   - Never commit .env files

2. **CORS:**
   - Update CORS settings for your domain
   - Don't use `*` in production

3. **File Storage:**
   - Current setup deletes uploaded files immediately
   - Consider virus scanning for production
   - Add file validation

4. **Rate Limiting:**
   - Add rate limiting to API
   - Monitor API usage/costs
   - Consider caching results

5. **Error Handling:**
   - Add better error logging
   - User-friendly error messages
   - Monitoring and alerts

6. **Security:**
   - Add authentication
   - Validate all inputs
   - Use HTTPS only
   - Sanitize file uploads

---

## Cost Estimation

Using Claude API:

- **Per analysis:** ~$0.05 - $0.15 depending on document size
- **100 analyses/month:** ~$5-15
- **1000 analyses/month:** ~$50-150

Factors affecting cost:
- Document length
- Analysis complexity
- Model used (Sonnet 4 is premium)

---

## Next Steps

1. ✅ Test basic file upload and analysis
2. ✅ Try all three analysis types
3. ✅ Test with different document types (PDF, DOCX, TXT)
4. ✅ Review the accuracy of AI feedback
5. ✅ Test error handling (try invalid files)
6. Consider adding features:
   - User authentication
   - Save/export results
   - Compare multiple documents
   - Batch processing
   - Custom brand kits
   - Integration with Canvas LMS

---

## Questions or Issues?

If you encounter issues:

1. Check the browser console (F12)
2. Check the API server console
3. Verify your .env configuration
4. Make sure all npm packages installed
5. Try a simple .txt file first
6. Restart both servers

Common fixes:
- Clear browser cache
- Delete node_modules and reinstall
- Check firewall/antivirus settings
- Try different browser
- Update Node.js to latest LTS

---

## Success Criteria

You'll know it's working when:

✅ Frontend loads without errors
✅ File upload interface is responsive
✅ Can upload and process documents
✅ Analysis completes within 60 seconds
✅ Results display correctly formatted
✅ QM scores are calculated
✅ Recommendations are specific and actionable
✅ Different analysis types produce different results

**Happy Testing! 🎓**
