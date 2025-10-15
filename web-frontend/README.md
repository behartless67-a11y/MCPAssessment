# UVA Course Assessment Tool - Web Frontend

Modern web interface for analyzing coursework using AI-powered Quality Matters and accessibility analysis.

## Features

- 📤 **Drag-and-drop file upload** (PDF, DOCX, TXT, MD)
- 🎓 **Quality Matters analysis** against all 8 standards
- ♿ **WCAG 2.1 AA accessibility** compliance checking
- 📊 **Visual score breakdowns** with color-coded results
- 🎨 **UVA branded** interface
- 📱 **Responsive design** (desktop and mobile)

## Tech Stack

- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **AI:** Claude AI (via API gateway)
- **File Processing:** Mammoth (DOCX), PDF.js (PDF)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Prerequisites

- Node.js 18+
- Running API server on port 3001 (see `/api-server`)

## Project Structure

```
web-frontend/
├── app/
│   ├── components/
│   │   ├── FileUpload.tsx          # File upload UI
│   │   ├── QMScore.tsx             # QM results display
│   │   ├── AccessibilityResults.tsx # WCAG results
│   │   └── AnalysisResults.tsx     # General results
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Homepage
│   └── globals.css                  # Global styles
├── public/                          # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

### API Proxy

The frontend proxies API requests to the backend:

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

### Tailwind Theme

UVA colors are configured in `tailwind.config.js`:

```javascript
colors: {
  uva: {
    blue: '#232D4B',
    orange: '#E57200',
    cyan: '#009FDF',
    yellow: '#FDDA24',
  },
}
```

## Usage

1. **Select Analysis Type:**
   - Quality Matters
   - Accessibility (WCAG 2.1 AA)
   - General Review

2. **Upload Document:**
   - Drag and drop or click to browse
   - Supported: PDF, DOCX, DOC, TXT, MD
   - Max size: 10MB

3. **View Results:**
   - Overall scores and breakdowns
   - Specific recommendations
   - Critical issues
   - Strengths

## Components

### FileUpload

Handles file upload with drag-and-drop support.

**Props:**
- `analysisType` - Type of analysis to perform
- `onAnalysisStart` - Callback when analysis starts
- `onAnalysisComplete` - Callback with results
- `onAnalysisError` - Callback on error

### QMScore

Displays Quality Matters analysis results.

**Shows:**
- Overall score (X/101 points)
- 85% threshold status
- Essential standards compliance
- Breakdown by standard
- Recommendations

### AccessibilityResults

Displays WCAG 2.1 AA analysis results.

**Shows:**
- Accessibility score
- Issues by severity (critical/warning/info)
- WCAG criteria passed
- Specific recommendations
- Branding compliance

### AnalysisResults

Displays general recommendations.

**Shows:**
- Document-specific recommendations
- Accessibility improvements
- Structure suggestions
- Content improvements

## Styling

### Theme Colors

```css
--uva-blue: #232D4B
--uva-orange: #E57200
```

### Utility Classes

```css
.btn-primary      /* Orange CTA button */
.btn-secondary    /* Blue button */
.card             /* White card with shadow */
.score-excellent  /* Green score (85%+) */
.score-good       /* Blue score (70-84%) */
.score-fair       /* Yellow score (50-69%) */
.score-poor       /* Red score (<50%) */
```

## Development

### Adding a New Analysis Type

1. Update `analysisType` type in `page.tsx`
2. Add option button in analysis type selector
3. Create new results component (e.g., `BrandingResults.tsx`)
4. Add case in results rendering section
5. Update API server to handle new type

### Customizing Styles

Edit `tailwind.config.js` for theme changes:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    },
    fontFamily: {
      // Add custom fonts
    },
  },
}
```

## API Integration

The frontend communicates with the API server:

**Endpoint:** `POST /api/analyze`

**Request:**
```javascript
FormData {
  file: File
  analysisType: 'qm' | 'accessibility' | 'general'
  documentType: 'syllabus' | 'assignment' | ...
}
```

**Response:**
```javascript
{
  success: boolean
  fileName: string
  fileType: string
  analysisType: string
  analysis: {
    // QM, Accessibility, or General results
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

Update API calls in `FileUpload.tsx` to use env var.

### Deployment Platforms

- **Vercel:** Zero-config (recommended for Next.js)
- **Netlify:** Supports Next.js
- **Docker:** Use included Dockerfile
- **Traditional hosting:** Build and serve `out/` directory

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

The frontend itself follows WCAG 2.1 AA:

- ✅ Keyboard navigation
- ✅ Screen reader compatible
- ✅ Sufficient color contrast
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ ARIA labels where needed

## Performance

- **First load:** < 2s
- **File upload:** < 1s
- **Analysis:** 20-60s (depends on AI)
- **Bundle size:** ~300KB gzipped

## Troubleshooting

### "Failed to fetch" error
- Check API server is running on port 3001
- Check browser console for CORS errors
- Verify proxy configuration

### Styles not loading
- Run `npm run build` to rebuild
- Clear browser cache
- Check tailwindcss is processing

### Upload not working
- Check file size (must be < 10MB)
- Check file type (PDF, DOCX, TXT, MD only)
- Check browser console for errors

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For issues or questions:
- Check [TESTING.md](../TESTING.md) for testing guide
- Review browser console for errors
- Verify API server is running
