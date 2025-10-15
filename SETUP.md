# Complete Setup Guide

## System Overview

You now have a complete coursework assessment system with three components:

1. **MCP Server** - Backend tools for brand kits, QM templates, analysis
2. **API Gateway** - REST API with Claude AI integration
3. **Web Frontend** - User-friendly interface for file upload and analysis

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   USER BROWSER                        │
│              http://localhost:3000                    │
└─────────────────────┬────────────────────────────────┘
                      │
                      ↓
┌──────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND                         │
│    • File Upload UI                                   │
│    • Results Visualization                            │
│    • QM/Accessibility Display                         │
└─────────────────────┬────────────────────────────────┘
                      │ HTTP POST /api/analyze
                      ↓
┌──────────────────────────────────────────────────────┐
│              EXPRESS API GATEWAY                      │
│              http://localhost:3001                    │
│    • File Processing (PDF/DOCX)                       │
│    • Claude AI Integration                            │
│    • JSON API Endpoints                               │
└─────────────────────┬────────────────────────────────┘
                      │ (Optional)
                      ↓
┌──────────────────────────────────────────────────────┐
│              MCP SERVER (Optional)                    │
│    • Brand Kit Management                             │
│    • QM Templates                                     │
│    • Analysis Tools                                   │
│    • Can be used via Claude Desktop                   │
└──────────────────────────────────────────────────────┘
```

## Quick Start (Recommended)

### What You'll Need

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Anthropic API Key** - [Get one here](https://console.anthropic.com/)
3. **A code editor** (VS Code recommended)
4. **A test document** (syllabus, assignment, etc.)

### 5-Minute Setup

**Step 1: Clone/Download Project**

You already have the project files.

**Step 2: Set Up API Server**

```bash
# Navigate to API server
cd api-server

# Install packages
npm install

# Create environment file
echo ANTHROPIC_API_KEY=your-key-here > .env

# Start server
npm run dev
```

✅ API server running on http://localhost:3001

**Step 3: Set Up Frontend (New Terminal)**

```bash
# Navigate to frontend
cd web-frontend

# Install packages
npm install

# Start frontend
npm run dev
```

✅ Frontend running on http://localhost:3000

**Step 4: Test It!**

1. Open http://localhost:3000 in your browser
2. Select "Quality Matters" analysis
3. Upload a syllabus or document
4. Wait 30-60 seconds
5. Review results!

---

## Detailed Setup

### Prerequisites Installation

#### 1. Install Node.js

**Windows:**
```bash
# Download from nodejs.org and run installer
# Verify installation:
node --version  # Should show v18.x or higher
npm --version   # Should show v9.x or higher
```

**Mac:**
```bash
# Using Homebrew
brew install node@18

# Verify
node --version
npm --version
```

#### 2. Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)
6. Keep it secret!

---

### Component Setup

#### MCP Server (Optional - for Claude Desktop integration)

```bash
# From project root
npm install
npm run build

# Test
npm start
# Should see: "MCP Coursework Assessment Server running on stdio"
```

**Configure in Claude Desktop:**

Edit config file:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add:
```json
{
  "mcpServers": {
    "coursework-assessment": {
      "command": "node",
      "args": [
        "C:\\path\\to\\MCPAssessmentTool\\dist\\index.js"
      ]
    }
  }
}
```

Restart Claude Desktop.

#### API Gateway (Required for Web Frontend)

```bash
cd api-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start development server
npm run dev

# Or build and run production
npm run build
npm start
```

**Verify it's working:**
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok","message":"API server is running"}
```

#### Web Frontend (Required for UI)

```bash
cd web-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm start
```

**Verify it's working:**

Open http://localhost:3000 - you should see the UVA Course Assessment Tool

---

## Configuration

### API Server (.env)

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional
PORT=3001
NODE_ENV=development
```

### Frontend (next.config.js)

If deploying, update API URL:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NODE_ENV === 'production'
        ? 'https://your-api-domain.com/api/:path*'
        : 'http://localhost:3001/api/:path*',
    },
  ];
}
```

---

## Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

### Quick Test

1. Create a test file `test-syllabus.txt`:

```
COURSE SYLLABUS
HIST 101: American History

Learning Objectives:
Students will learn about American history.

Grading:
Exams: 60%
Papers: 40%
```

2. Upload to http://localhost:3000
3. Select "Quality Matters"
4. Click Analyze
5. Review results

**Expected:**
- QM score < 85% (document is incomplete)
- Missing essential standards (objectives not measurable)
- Recommendations for improvement

---

## Troubleshooting

### API Server Won't Start

**Problem:** Port 3001 already in use

**Fix:**
```bash
# Windows: Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID [process-id] /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

Or change port in `.env`:
```
PORT=3002
```

### Frontend Can't Connect to API

**Problem:** "Failed to fetch" or CORS errors

**Fix:**
1. Verify API server is running: http://localhost:3001/api/health
2. Check browser console for actual error
3. Clear browser cache
4. Restart both servers

### No API Key Warning

**Problem:** "ANTHROPIC_API_KEY not set"

**Fix:**
1. Create `.env` file in `api-server/` directory
2. Add: `ANTHROPIC_API_KEY=your-actual-key`
3. Restart API server
4. Verify key is valid at console.anthropic.com

### File Upload Fails

**Problem:** "Could not extract text from file"

**Fix:**
1. Try a simple .txt file first
2. Check file size (< 10MB)
3. For PDFs: Ensure it's a text PDF, not scanned image
4. For DOCX: Ensure it's valid Microsoft Word format

### Analysis Takes Forever

**Problem:** Analysis running > 2 minutes

**Possible causes:**
- Very large document
- API rate limiting
- Network issues
- Invalid API key

**Fix:**
1. Check API server console for errors
2. Verify API key is correct
3. Try smaller document
4. Check network connection

---

## Development Workflow

### Making Changes

**To API Server:**
```bash
cd api-server
# Edit files in src/
npm run dev  # Auto-reloads on changes
```

**To Frontend:**
```bash
cd web-frontend
# Edit files in app/
npm run dev  # Auto-reloads on changes
```

**To MCP Server:**
```bash
# Edit files in src/
npm run build  # Rebuild after changes
```

### Adding Features

**New Analysis Type:**
1. Update `analysisType` type in `web-frontend/app/page.tsx`
2. Add UI button in type selector
3. Create results component
4. Update API server handler in `api-server/src/server.ts`

**New QM Template:**
1. Edit `src/qm-tools.ts`
2. Add to `defaultQMTemplates` array
3. Rebuild: `npm run build`

---

## Production Deployment

### Option 1: Simple VPS Deployment

```bash
# On your server
git clone your-repo
cd MCPAssessmentTool

# Set up API server
cd api-server
npm install
npm run build
echo "ANTHROPIC_API_KEY=your-key" > .env
npm start &  # Run in background

# Set up frontend
cd ../web-frontend
npm install
npm run build
npm start &  # Run in background

# Use nginx or Apache to reverse proxy
```

### Option 2: Docker (Future Enhancement)

Create `Dockerfile` and `docker-compose.yml` for containerized deployment.

### Option 3: Serverless

- **Frontend:** Deploy to Vercel (zero-config Next.js support)
- **API:** Deploy to AWS Lambda or Google Cloud Functions

---

## Costs

### Development (Free)
- Node.js: Free
- Next.js: Free
- Anthropic API: Pay-as-you-go

### Production (Estimated Monthly)

**Anthropic API Usage:**
- Small team (100 analyses/month): ~$10-20
- Medium (1000 analyses/month): ~$75-150
- Large (10k analyses/month): ~$750-1500

**Hosting:**
- VPS (Digital Ocean, Linode): $10-20/month
- Vercel (Frontend): Free - $20/month
- AWS/GCP: Variable, ~$20-100/month

**Total:** $30-200/month for typical academic use

---

## Security Considerations

### Before Production:

1. ✅ Add authentication (user login)
2. ✅ Add HTTPS (SSL certificate)
3. ✅ Rate limiting (prevent abuse)
4. ✅ Input validation (sanitize uploads)
5. ✅ Virus scanning (uploaded files)
6. ✅ Secure API keys (use secrets manager)
7. ✅ CORS restrictions (specific domains only)
8. ✅ File size limits (already implemented)
9. ✅ Error handling (don't expose internals)
10. ✅ Logging and monitoring

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor API usage and costs
- Check error logs
- Backup any custom templates

**Monthly:**
- Update dependencies
- Review security advisories
- Check disk space (uploaded files cleanup)

**Quarterly:**
- Update Claude model if new versions available
- Review and update QM standards if changed
- Update WCAG guidelines if new version

### Updates

```bash
# Update dependencies
cd api-server && npm update
cd web-frontend && npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

## Support and Resources

### Documentation
- [README.md](./README.md) - Project overview
- [TESTING.md](./TESTING.md) - Testing guide
- [Quality-Matters-Guidelines.md](./Quality-Matters-Guidelines.md) - QM standards
- [UVA-Brand-Guidelines.md](./UVA-Brand-Guidelines.md) - Accessibility & branding

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Quality Matters](https://www.qualitymatters.org/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

### Getting Help

1. Check browser console (F12)
2. Check API server console
3. Review error messages
4. Consult documentation
5. Check GitHub issues (if applicable)

---

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test with sample documents
3. ✅ Customize branding/colors if needed
4. ✅ Add authentication for production
5. ✅ Deploy to production server
6. ✅ Train faculty on usage
7. ✅ Monitor usage and iterate

---

## Success!

You now have a fully functional AI-powered course assessment tool that can:

- ✅ Analyze syllabi for Quality Matters compliance
- ✅ Check accessibility (WCAG 2.1 AA)
- ✅ Provide actionable recommendations
- ✅ Process multiple file formats
- ✅ Display beautiful, color-coded results
- ✅ Scale to handle your institution's needs

**Happy Analyzing! 🎓📊♿**
