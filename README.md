# MCP Coursework Accessibility Assessment Tool

An AI-powered web application for analyzing educational documents for accessibility compliance. Upload syllabi, assignments, and course materials to get comprehensive WCAG 2.1 AA accessibility analysis with actionable recommendations.

## Overview

This tool helps educators create accessible course content by:
- **Analyzing documents for WCAG 2.1 AA compliance** - Comprehensive accessibility checking
- **Quality Matters (QM) analysis** - Evaluate course materials against QM standards
- **Providing actionable recommendations** - Specific guidance for fixing issues
- **Supporting multiple file formats** - PDF, DOCX, TXT, and more
- **UVA-branded interface** - Built with University of Virginia brand guidelines

Perfect for educators, instructional designers, and content creators who need to ensure their course materials are accessible to all students.

## Key Features

### 🎯 Accessibility Analysis (Primary Focus)
- **WCAG 2.1 Level AA compliance checking** - Industry-standard accessibility analysis
- **Issue severity categorization** - Critical, warning, and info-level issues
- **Specific WCAG criteria identification** - Know exactly which guidelines failed
- **Color contrast checking** - Ensure text meets 4.5:1 ratio requirements
- **Heading structure validation** - Verify proper heading hierarchy
- **Alt text detection** - Identify missing image descriptions
- **Link text quality** - Check for "click here" and vague links
- **Document structure** - Semantic HTML and proper organization
- **Actionable recommendations** - Step-by-step guidance for fixing issues

### 📊 Quality Matters (QM) Analysis
- **Complete QM evaluation** - All 8 General Standards assessed
- **Point-based scoring** - Out of 101 total points
- **Essential standards tracking** - 11 required 3-point standards
- **85% threshold verification** - QM certification eligibility check
- **Standard-by-standard breakdown** - See exactly where you need improvement

### 📤 Easy Document Upload
- **Drag-and-drop interface** - Simple file upload
- **Multiple file formats** - PDF, DOCX, DOC, TXT, MD supported
- **10MB file size limit** - Handle most course documents
- **Immediate processing** - Results in 30-60 seconds

### 📈 Results Visualization
- **Color-coded scores** - Quickly identify problem areas
- **Detailed breakdowns** - See specific issues and recommendations
- **Prioritized fixes** - Know what to address first
- **Exportable reports** - Save results for documentation

## Quick Start

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Anthropic API Key** - [Get one here](https://console.anthropic.com/)

### Installation (5 minutes)

**1. Clone the repository:**
```bash
git clone https://github.com/behartless67-a11y/MCPAssessment.git
cd MCPAssessment
```

**2. Set up the API server:**
```bash
cd api-server
npm install
echo "ANTHROPIC_API_KEY=your-key-here" > .env
npm run dev
```

The API server will start on http://localhost:3001

**3. Set up the web frontend (in a new terminal):**
```bash
cd web-frontend
npm install
npm run dev
```

The frontend will start on http://localhost:3000

**4. Start analyzing documents!**
- Open http://localhost:3000 in your browser
- Upload a document (PDF, DOCX, or TXT)
- Select analysis type (Accessibility recommended)
- Click "Analyze Document"
- Review results and recommendations

### Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive installation instructions, troubleshooting, and production deployment guidance.

## 🚀 Deploy to Azure (Production)

Deploy this application as an Azure Static Web App in just 5 minutes!

**Quick Deploy:**
1. Push code to GitHub
2. Create Azure Static Web App ([portal.azure.com](https://portal.azure.com))
3. Connect to your GitHub repo
4. Add `ANTHROPIC_API_KEY` to Azure configuration
5. Done! Your app will be live globally

**See full deployment guide:**
- **Quick Start:** [DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md) - 5-minute guide
- **Full Guide:** [AZURE-DEPLOYMENT.md](./AZURE-DEPLOYMENT.md) - Complete instructions with screenshots

**Cost:** Free tier available (100 GB bandwidth/month)

## How It Works

### Analysis Types

**1. Accessibility Analysis (Recommended)**
- Comprehensive WCAG 2.1 Level AA compliance check
- Identifies critical issues, warnings, and informational items
- Provides specific WCAG criteria that failed
- Includes actionable recommendations for each issue
- Checks color contrast, heading structure, alt text, link text, and more

**2. Quality Matters Analysis**
- Evaluates against all 8 QM General Standards
- Scores out of 101 total points
- Identifies which essential standards are met
- Shows 85% threshold status for QM certification
- Provides standard-by-standard breakdown with recommendations

**3. General Review**
- Document-specific recommendations
- Best practices for educational materials
- Content structure suggestions
- Accessibility and usability improvements

### What Gets Analyzed

The tool examines documents for:

**Accessibility Issues:**
- Color contrast ratios (WCAG AA: 4.5:1 for normal text)
- Heading hierarchy (proper H1→H2→H3 structure)
- Alternative text for images
- Link text quality (avoiding "click here")
- Document language specification
- Keyboard accessibility
- Focus indicators
- Form labels
- Semantic structure

**Quality Matters Standards:**
- Standard 1: Course Overview and Introduction
- Standard 2: Learning Objectives/Competencies
- Standard 3: Assessment and Measurement
- Standard 4: Instructional Materials
- Standard 5: Learning Activities and Learner Interaction
- Standard 6: Course Technology
- Standard 7: Learner Support
- Standard 8: Accessibility and Usability

**Document Structure:**
- Clear information hierarchy
- Proper use of headings and subheadings
- Logical reading order
- Consistent formatting
- Professional presentation

## Example Analysis Results

### Accessibility Analysis Output

```
Accessibility Score: 72/100

Critical Issues (3):
❌ Missing alt text on 5 images (WCAG 1.1.1)
❌ Color contrast ratio 3.2:1 on heading text (needs 4.5:1) (WCAG 1.4.3)
❌ Skipped heading level: H1 to H3 (WCAG 1.3.1)

Warnings (2):
⚠️ Generic link text "click here" (WCAG 2.4.4)
⚠️ Document language not specified (WCAG 3.1.1)

Recommendations:
1. Add descriptive alt text to all images
2. Change heading color to #232D4B for better contrast
3. Add H2 heading between H1 and H3
4. Replace "click here" with descriptive link text
5. Add lang="en" attribute to document
```

### Quality Matters Output

```
Overall Score: 78/101 points (77%)
Status: Below 85% threshold ❌

Standard Scores:
✅ Standard 1: Course Overview - 11/12 points
✅ Standard 2: Learning Objectives - 12/14 points
❌ Standard 3: Assessment - 8/15 points (Essential standard missing)
✅ Standard 4: Instructional Materials - 10/13 points
...

Critical Issues:
- Essential Standard 3.1 not met: Assessment rubrics missing
- Essential Standard 3.3 not met: No alignment between objectives and assessments

Recommendations:
1. Add detailed rubrics for all assessments
2. Create alignment matrix showing objectives to assessments
3. Include clear grading criteria
```

## Architecture

```
┌─────────────────────────────────────┐
│         Web Frontend                │
│   (Next.js + React + Tailwind)     │
│         Port 3000                   │
└──────────────┬──────────────────────┘
               │ HTTP/API Calls
               ↓
┌─────────────────────────────────────┐
│         API Gateway                 │
│   (Express + Claude AI)             │
│         Port 3001                   │
└──────────────┬──────────────────────┘
               │ Anthropic API
               ↓
┌─────────────────────────────────────┐
│      Claude AI (Sonnet 4.5)        │
│   WCAG & QM Analysis Engine         │
└─────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14 (React framework)
- Tailwind CSS (styling)
- TypeScript
- File upload with drag-and-drop
- Responsive design

**Backend:**
- Express.js (API server)
- Anthropic Claude AI (analysis engine)
- Mammoth (DOCX processing)
- PDF.js (PDF text extraction)
- CORS enabled

**MCP Server (Optional):**
- Model Context Protocol implementation
- Can be used with Claude Desktop
- Brand kit and template management

## Documentation & Resources

### Included Documentation
- **[SETUP.md](./SETUP.md)** - Detailed setup and installation guide
- **[TESTING.md](./TESTING.md)** - Testing guide with sample documents
- **[UVA-Brand-Guidelines.md](./UVA-Brand-Guidelines.md)** - Complete WCAG 2.1 AA checklist
- **[Quality-Matters-Guidelines.md](./Quality-Matters-Guidelines.md)** - QM 7th Edition standards

### External Resources
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Quality Matters](https://www.qualitymatters.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Anthropic Claude Documentation](https://docs.anthropic.com/)

## Contributing

Contributions are welcome! This tool is designed to help educators create more accessible content.

### Areas for Contribution
- Additional analysis features
- Support for more file formats
- Improved accessibility recommendations
- Integration with LMS platforms
- Better error handling
- Performance improvements
- Documentation improvements

## Roadmap

**Version 2.0 (Planned)**
- [ ] Batch document processing
- [ ] Export analysis reports (PDF, DOCX)
- [ ] Historical tracking and comparison
- [ ] Custom accessibility rules
- [ ] Integration with Canvas LMS
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Automated fix suggestions

**Version 3.0 (Future)**
- [ ] Real-time document editing with live feedback
- [ ] Collaborative review features
- [ ] Institution-wide analytics dashboard
- [ ] Custom branding profiles
- [ ] AI-powered content improvement suggestions

## Costs & Usage

### API Costs
This tool uses the Anthropic Claude API:
- **Per analysis:** ~$0.05 - $0.15
- **100 analyses/month:** ~$5-15
- **1000 analyses/month:** ~$50-150

Costs depend on document size and analysis complexity.

### Getting an API Key
1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env` file in api-server directory

## Frequently Asked Questions

**Q: What file formats are supported?**
A: PDF, DOCX, DOC, TXT, and MD files up to 10MB.

**Q: How long does analysis take?**
A: Typically 30-60 seconds depending on document size.

**Q: Is my document data stored?**
A: No, documents are processed in memory and immediately deleted after analysis.

**Q: Can I use this for commercial purposes?**
A: Yes, the tool is MIT licensed. However, you'll need your own Anthropic API key.

**Q: Does this work offline?**
A: No, it requires an internet connection to use the Claude AI API.

**Q: How accurate is the accessibility analysis?**
A: The tool provides comprehensive WCAG 2.1 AA analysis powered by Claude AI. However, manual review is still recommended for critical compliance.

**Q: Can I customize the analysis criteria?**
A: Currently uses standard WCAG 2.1 AA and QM 7th Edition criteria. Custom rules are planned for v2.0.

## Troubleshooting

**Issue: "Failed to fetch" error**
- Ensure API server is running on port 3001
- Check that your Anthropic API key is set in `.env`
- Verify firewall isn't blocking localhost connections

**Issue: "Could not extract text from file"**
- Try a simple .txt file first to verify setup
- For PDFs: Ensure it's a text PDF, not a scanned image
- For DOCX: Verify file isn't corrupted

**Issue: Analysis takes too long**
- First analysis can take 60+ seconds
- Large files (>5MB) take longer
- Check your internet connection

See [TESTING.md](./TESTING.md) for more troubleshooting tips.

## License

MIT License - feel free to use, modify, and distribute.

## Acknowledgments

Built with:
- [Anthropic Claude AI](https://www.anthropic.com/)
- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [Quality Matters](https://www.qualitymatters.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

- **Issues:** Open an issue on [GitHub](https://github.com/behartless67-a11y/MCPAssessment/issues)
- **Documentation:** See [SETUP.md](./SETUP.md) and [TESTING.md](./TESTING.md)
- **Discussions:** Use GitHub Discussions for questions and feature requests

---

**Made for educators, by educators. Making course content accessible to all students. 🎓♿**
