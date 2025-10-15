import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import multipart from 'parse-multipart';
import mammoth from 'mammoth';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Helper function to extract text from DOCX
async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Analyze function triggered');

  try {
    // Parse multipart form data
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      context.res = {
        status: 400,
        body: { error: 'Content-Type must be multipart/form-data' }
      };
      return;
    }

    // Get boundary from content-type header
    const boundary = multipart.getBoundary(contentType);
    if (!boundary) {
      context.res = {
        status: 400,
        body: { error: 'Invalid multipart boundary' }
      };
      return;
    }

    // Parse the multipart data
    const parts = multipart.Parse(req.body, boundary);

    // Find the file part
    const filePart = parts.find(part => part.name === 'file');
    if (!filePart || !filePart.data) {
      context.res = {
        status: 400,
        body: { error: 'No file uploaded' }
      };
      return;
    }

    // Extract document type from form data (default to 'general')
    const documentTypePart = parts.find(part => part.name === 'documentType');
    const documentType = documentTypePart?.data?.toString('utf-8') || 'general';

    // Extract text from the uploaded file
    const text = await extractTextFromBuffer(filePart.data);

    if (!text || text.trim().length === 0) {
      context.res = {
        status: 400,
        body: { error: 'Could not extract text from file' }
      };
      return;
    }

    // Simplified prompts for Azure Function (to reduce load time)
    const systemPrompt = `You are an expert in accessibility (WCAG 2.1 & 2.2 Level AA), UVA branding, and document analysis. Analyze the provided document and return a comprehensive assessment in JSON format.`;

    const userPrompt = `Perform a COMPREHENSIVE analysis of this ${documentType || 'document'} covering WCAG 2.1 & 2.2 Level AA accessibility, UVA branding, visual hierarchy, and general best practices.

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
        "canAutoRemediate": <boolean>
      }
    ],
    "passedCriteria": ["<list of passed criteria>"],
    "recommendations": ["<accessibility recommendations>"]
  },
  "branding": {
    "status": "yellow",
    "statusReason": "Always yellow to remind about Frank Batten School of Public Policy branding requirements",
    "mentionsSchool": <boolean>,
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
    "recommendations": ["<branding recommendations>"]
  },
  "visualHierarchy": {
    "status": "red|yellow|green",
    "statusReason": "<why this status was assigned>",
    "overallScore": "<excellent|good|needs improvement|poor>",
    "sizeAndScale": {
      "hasProperHierarchy": <boolean>,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "colorAndContrast": {
      "effectiveUse": <boolean>,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "alignment": {
      "consistent": <boolean>,
      "scanningPattern": "<F-pattern|Z-pattern|unclear>",
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "proximity": {
      "effectiveGrouping": <boolean>,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "whitespace": {
      "adequate": <boolean>,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "typography": {
      "hierarchyClear": <boolean>,
      "fontChoices": "<appropriate|needs improvement>",
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "cognitiveLoad": {
      "appropriate": <boolean>,
      "assessment": "<low|medium|high>",
      "recommendations": ["<improvements>"]
    },
    "recommendations": ["<overall recommendations>"]
  },
  "general": {
    "documentType": "${documentType || 'general'}",
    "overallRecommendations": ["<recommendations>"],
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
- Accessibility: "red" if ANY critical issues, "yellow" if warnings only, "green" if all checks pass
- Branding: ALWAYS "yellow" to remind about school name requirements
- Visual Hierarchy: "red" if poor/many issues, "yellow" if needs improvement, "green" if excellent/good

Be thorough and analyze against WCAG 2.1 & 2.2 Level AA criteria, UVA brand guidelines, and visual hierarchy principles.`;

    // Call Claude API
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

    // Parse JSON from response
    let analysisResult;
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                       responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        analysisResult = JSON.parse(jsonStr);
      } else {
        analysisResult = JSON.parse(responseText);
      }
    } catch (parseError) {
      analysisResult = {
        rawResponse: responseText,
        error: 'Could not parse structured response'
      };
    }

    // Return successful response
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        success: true,
        fileName: filePart.filename || 'document',
        fileType: filePart.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        documentType: documentType || 'general',
        extractedText: text.substring(0, 500) + '...', // Preview
        ...analysisResult // Spread analysis results
      }
    };

  } catch (error) {
    context.log.error('Analysis error:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: error instanceof Error ? error.message : 'Analysis failed'
      }
    };
  }
};

export default httpTrigger;
