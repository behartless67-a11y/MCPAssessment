import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse-fork';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { RemediationService } from './remediation-service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, TXT, and MD files are allowed.'));
    }
  }
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Helper function to extract text from different file types
async function extractTextFromFile(filePath: string, mimetype: string): Promise<string> {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimetype === 'text/plain' || mimetype === 'text/markdown') {
      return await fs.readFile(filePath, 'utf-8');
    }
    throw new Error('Unsupported file type');
  } finally {
    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
}

// Load UVA Brand Guidelines
let UVA_BRAND_GUIDELINES = '';
try {
  UVA_BRAND_GUIDELINES = await fs.readFile(
    path.join(__dirname, '../../UVA-Brand-Guidelines.md'),
    'utf-8'
  );
} catch (error) {
  console.warn('Warning: Could not load UVA Brand Guidelines');
}

// Load Visual Hierarchy Guidelines
let VISUAL_HIERARCHY_GUIDELINES = '';
try {
  VISUAL_HIERARCHY_GUIDELINES = await fs.readFile(
    path.join(__dirname, '../../Visual-Hierarchy-Guidelines.md'),
    'utf-8'
  );
} catch (error) {
  console.warn('Warning: Could not load Visual Hierarchy Guidelines');
}

// Load MCP tools information
const MCP_TOOLS = {
  analyze_qm_compliance: {
    name: 'analyze_qm_compliance',
    description: 'Analyze course content for Quality Matters compliance',
  },
  analyze_document: {
    name: 'analyze_document',
    description: 'Analyze document for accessibility, branding, and layout',
  },
  get_recommendations: {
    name: 'get_recommendations',
    description: 'Get recommendations for improving coursework',
  },
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Upload and analyze file - performs ALL analyses at once
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType } = req.body;

    // Extract text from file
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    // Use Claude with MCP-like prompting to analyze the document
    const systemPrompt = `You are an expert in educational course design, accessibility (WCAG 2.1 AA), pedagogical best practices, UVA branding guidelines, and visual hierarchy principles. Analyze the provided document and return a comprehensive assessment covering ALL areas in JSON format.

UVA Brand Guidelines Reference:
${UVA_BRAND_GUIDELINES}

Visual Hierarchy Guidelines Reference:
${VISUAL_HIERARCHY_GUIDELINES}`;

    const userPrompt = `Perform a COMPREHENSIVE analysis of this ${documentType || 'document'} covering WCAG 2.1 AA accessibility, UVA branding, visual hierarchy, and general best practices for educational content.

Document content:
${text}

Provide a complete analysis in this JSON format:
{
  "accessibility": {
    "status": "red|yellow|green",
    "statusReason": "<why this status was assigned>",
    "wcagLevel": "AA",
    "issues": [
      {
        "severity": "critical|warning|info",
        "principle": "Perceivable|Operable|Understandable|Robust",
        "criterion": "<WCAG criterion number>",
        "description": "<what's wrong>",
        "recommendation": "<how to fix>",
        "canAutoRemediate": <boolean - true if this can be automatically fixed>
      }
    ],
    "passedCriteria": ["<list of passed criteria>"],
    "recommendations": ["<accessibility recommendations>"]
  },
  "branding": {
    "status": "yellow",
    "statusReason": "Always yellow to remind about Frank Batten School of Public Policy branding requirements",
    "mentionsSchool": <boolean - true if 'Frank Batten School of Public Policy' or 'Batten School' appears>,
    "colorUsage": {
      "usesUVAColors": <boolean>,
      "properContrast": <boolean>,
      "issues": ["<color-related issues>"]
    },
    "typography": {
      "usesApprovedFonts": <boolean>,
      "issues": ["<font-related issues>"]
    },
    "logoUsage": {
      "hasLogo": <boolean>,
      "isCorrectlyUsed": <boolean>,
      "issues": ["<logo-related issues>"]
    },
    "recommendations": ["<branding recommendations - ALWAYS include reminder to mention Frank Batten School of Public Policy>"]
  },
  "visualHierarchy": {
    "status": "red|yellow|green",
    "statusReason": "<why this status was assigned>",
    "overallScore": "<excellent|good|needs improvement|poor>",
    "sizeAndScale": {
      "hasProperHierarchy": <boolean>,
      "issues": ["<size/scale issues>"],
      "recommendations": ["<size/scale improvements>"]
    },
    "colorAndContrast": {
      "effectiveUse": <boolean>,
      "issues": ["<color/contrast issues>"],
      "recommendations": ["<color/contrast improvements>"]
    },
    "alignment": {
      "consistent": <boolean>,
      "scanningPattern": "<F-pattern|Z-pattern|unclear>",
      "issues": ["<alignment issues>"],
      "recommendations": ["<alignment improvements>"]
    },
    "proximity": {
      "effectiveGrouping": <boolean>,
      "issues": ["<proximity/grouping issues>"],
      "recommendations": ["<proximity improvements>"]
    },
    "whitespace": {
      "adequate": <boolean>,
      "issues": ["<whitespace issues>"],
      "recommendations": ["<whitespace improvements>"]
    },
    "typography": {
      "hierarchyClear": <boolean>,
      "fontChoices": "<appropriate|needs improvement>",
      "issues": ["<typography issues>"],
      "recommendations": ["<typography improvements>"]
    },
    "cognitiveLoad": {
      "appropriate": <boolean>,
      "assessment": "<low|medium|high>",
      "recommendations": ["<cognitive load improvements>"]
    },
    "recommendations": ["<overall visual hierarchy recommendations>"]
  },
  "general": {
    "documentType": "${documentType || 'general'}",
    "overallRecommendations": ["<general recommendations>"],
    "structure": ["<structural improvements>"],
    "content": ["<content improvements>"],
    "clarity": ["<clarity improvements>"],
    "pedagogy": ["<pedagogical improvements>"],
    "layout": {
      "suggestions": ["<layout improvements>"]
    }
  }
}

IMPORTANT STATUS RULES:
- Accessibility: "red" if ANY critical issues exist, "yellow" if only warnings exist, "green" if all checks pass
- Branding: ALWAYS "yellow" to remind about school name requirements
- Visual Hierarchy: "red" if poor/many issues, "yellow" if needs improvement, "green" if excellent/good

Be thorough and specific. Analyze against WCAG 2.1 AA criteria, UVA brand guidelines, and visual hierarchy principles from the guidelines provided. For general recommendations, focus on educational best practices, clarity, structure, and effective pedagogy.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Try to parse JSON from the response
    let analysisResult;
    try {
      // Look for JSON in code blocks or raw JSON
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                       responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        analysisResult = JSON.parse(jsonStr);
      } else {
        analysisResult = JSON.parse(responseText);
      }
    } catch (parseError) {
      // If parsing fails, return the text response
      analysisResult = {
        rawResponse: responseText,
        error: 'Could not parse structured response'
      };
    }

    res.json({
      success: true,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      documentType: documentType || 'general',
      extractedText: text.substring(0, 500) + '...', // Preview
      ...analysisResult // Spread all analysis results into response
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis failed'
    });
  }
});

// Get QM template
app.get('/api/qm/template/:standard', async (req, res) => {
  try {
    const standard = parseInt(req.params.standard);

    if (standard < 1 || standard > 8) {
      return res.status(400).json({ error: 'Standard must be between 1 and 8' });
    }

    const systemPrompt = `You are an expert in Quality Matters standards. Provide a detailed template and guidance for QM General Standard ${standard}.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Provide a comprehensive template and best practices for Quality Matters General Standard ${standard}. Include examples and implementation guidance.`
        }
      ],
      system: systemPrompt
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    res.json({
      success: true,
      standard,
      template: responseText
    });

  } catch (error) {
    console.error('Template error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get template'
    });
  }
});

// Get QM standard info
app.get('/api/qm/standard/:standard', (req, res) => {
  const standard = parseInt(req.params.standard);

  const standardInfo: Record<number, any> = {
    1: {
      number: 1,
      name: 'Course Overview and Introduction',
      description: 'Helps learners understand course structure and get started successfully',
      pointsPossible: 16,
      specificReviewStandards: 8,
      essentialStandards: ['1.1', '1.2'],
    },
    2: {
      number: 2,
      name: 'Learning Objectives (Competencies)',
      description: 'Clearly articulated, measurable learning outcomes',
      pointsPossible: 11,
      specificReviewStandards: 5,
      essentialStandards: ['2.1', '2.2'],
    },
    3: {
      number: 3,
      name: 'Assessment and Measurement',
      description: 'Assessments that accurately measure achievement of learning objectives',
      pointsPossible: 15,
      specificReviewStandards: 6,
      essentialStandards: ['3.1', '3.2', '3.3'],
    },
    4: {
      number: 4,
      name: 'Instructional Materials',
      description: 'High-quality, relevant, and diverse learning resources',
      pointsPossible: 12,
      specificReviewStandards: 6,
      essentialStandards: ['4.1'],
    },
    5: {
      number: 5,
      name: 'Learning Activities and Learner Interaction',
      description: 'Active engagement and meaningful interaction',
      pointsPossible: 8,
      specificReviewStandards: 4,
      essentialStandards: ['5.1'],
    },
    6: {
      number: 6,
      name: 'Course Technology',
      description: 'Tools that enhance learning without creating barriers',
      pointsPossible: 9,
      specificReviewStandards: 5,
      essentialStandards: ['6.1'],
    },
    7: {
      number: 7,
      name: 'Learner Support',
      description: 'Resources and services that help learners succeed',
      pointsPossible: 6,
      specificReviewStandards: 4,
      essentialStandards: [],
    },
    8: {
      number: 8,
      name: 'Accessibility and Usability',
      description: 'Courses designed for all learners, including those with disabilities',
      pointsPossible: 11,
      specificReviewStandards: 6,
      essentialStandards: ['8.1'],
    },
  };

  const info = standardInfo[standard];
  if (!info) {
    return res.status(400).json({ error: 'Invalid standard number. Must be 1-8.' });
  }

  res.json(info);
});

// Remediation endpoint
app.post('/api/remediate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileExt = path.extname(fileName).toLowerCase();

    // Only support DOCX for now
    if (fileExt !== '.docx') {
      await fs.unlink(filePath);
      return res.status(400).json({
        error: 'Only DOCX files are supported for auto-remediation'
      });
    }

    // Parse the issues from the request body
    const issues = JSON.parse(req.body.issues || '[]');

    if (issues.length === 0) {
      await fs.unlink(filePath);
      return res.status(400).json({ error: 'No accessibility issues provided' });
    }

    // Get remediation summary
    const summary = RemediationService.getRemediationSummary(issues);

    if (!summary.canAutoRemediate) {
      await fs.unlink(filePath);
      return res.json({
        success: false,
        message: 'No auto-remediable issues found. All issues require manual fixes.',
        summary
      });
    }

    // Perform remediation (don't delete original file yet, service needs it)
    const result = await RemediationService.remediateDOCX(filePath, issues);

    if (result.success && result.filePath) {
      // Send the remediated file
      res.download(result.filePath, fileName.replace('.docx', '_remediated.docx'), async (err) => {
        if (err) {
          console.error('Error sending file:', err);
        }
        // Clean up both original and remediated files after sending
        try {
          await fs.unlink(filePath);
          await fs.unlink(result.filePath!);
        } catch (e) {
          console.error('Error cleaning up files:', e);
        }
      });
    } else {
      // Clean up original file if remediation failed
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error('Error cleaning up original file:', e);
      }
      res.json(result);
    }
  } catch (error: any) {
    console.error('Remediation error:', error);
    res.status(500).json({
      error: 'Remediation failed',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: POST http://localhost:${PORT}/api/analyze`);
  console.log(`Remediation endpoint: POST http://localhost:${PORT}/api/remediate`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('\n⚠️  WARNING: ANTHROPIC_API_KEY not set in environment variables');
    console.warn('   Create a .env file with: ANTHROPIC_API_KEY=your-key-here\n');
  }
});

export default app;
