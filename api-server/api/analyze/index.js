const multipart = require('parse-multipart');
const mammoth = require('mammoth');
const Anthropic = require('@anthropic-ai/sdk').default;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Helper function to extract text from DOCX
async function extractTextFromBuffer(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

module.exports = async function (context, req) {
  context.log('Analyze function triggered');

  try {
    // Parse multipart form data
    const contentType = req.headers['content-type'] || req.headers['Content-Type'] || '';
    context.log('Content-Type:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      context.res = {
        status: 400,
        body: { error: 'Content-Type must be multipart/form-data', receivedType: contentType }
      };
      return;
    }

    // Extract boundary from content-type header manually
    // Format is: multipart/form-data; boundary=----WebKitFormBoundary...
    const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
    if (!boundaryMatch || !boundaryMatch[1]) {
      context.res = {
        status: 400,
        body: { error: 'Invalid multipart boundary', contentType: contentType }
      };
      return;
    }

    const boundary = boundaryMatch[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
    context.log('Extracted boundary:', boundary);

    // Parse the multipart data
    let bodyBuffer;
    try {
      if (Buffer.isBuffer(req.body)) {
        bodyBuffer = req.body;
      } else if (req.rawBody) {
        bodyBuffer = Buffer.from(req.rawBody, 'binary');
      } else if (typeof req.body === 'string') {
        bodyBuffer = Buffer.from(req.body, 'binary');
      } else {
        throw new Error('Unexpected request body format: ' + typeof req.body);
      }
      context.log('Body buffer size:', bodyBuffer.length);
    } catch (bufferError) {
      context.log.error('Buffer creation error:', bufferError);
      context.res = {
        status: 400,
        body: {
          error: 'Failed to create buffer from request body',
          details: bufferError.message,
          bodyType: typeof req.body
        }
      };
      return;
    }

    let parts;
    try {
      parts = multipart.Parse(bodyBuffer, boundary);
      context.log('Parsed parts count:', parts.length);
    } catch (parseError) {
      context.log.error('Multipart parse error:', parseError);
      context.res = {
        status: 400,
        body: {
          error: 'Failed to parse multipart data',
          details: parseError.message,
          stack: parseError.stack
        }
      };
      return;
    }

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
${text.substring(0, 10000)} // Limit to first 10k chars to avoid token limits

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
        "canAutoRemediate": true|false
      }
    ],
    "passedCriteria": ["<list of passed criteria>"],
    "recommendations": ["<accessibility recommendations>"]
  },
  "branding": {
    "status": "yellow",
    "statusReason": "Always yellow to remind about Frank Batten School of Public Policy branding requirements",
    "mentionsSchool": true|false,
    "colorUsage": {
      "usesUVAColors": true|false,
      "properContrast": true|false,
      "issues": ["<color-related issues>"]
    },
    "typography": {
      "usesApprovedFonts": true|false,
      "issues": ["<font-related issues>"]
    },
    "logoUsage": {
      "hasLogo": true|false,
      "isCorrectlyUsed": true|false,
      "issues": ["<logo-related issues>"]
    },
    "recommendations": ["<branding recommendations - ALWAYS include reminder to mention Frank Batten School of Public Policy>"]
  },
  "visualHierarchy": {
    "status": "red|yellow|green",
    "statusReason": "<why this status was assigned>",
    "overallScore": "<excellent|good|needs improvement|poor>",
    "sizeAndScale": {
      "hasProperHierarchy": true|false,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "colorAndContrast": {
      "effectiveUse": true|false,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "alignment": {
      "consistent": true|false,
      "scanningPattern": "<F-pattern|Z-pattern|unclear>",
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "proximity": {
      "effectiveGrouping": true|false,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "whitespace": {
      "adequate": true|false,
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "typography": {
      "hierarchyClear": true|false,
      "fontChoices": "<appropriate|needs improvement>",
      "issues": ["<issues>"],
      "recommendations": ["<improvements>"]
    },
    "cognitiveLoad": {
      "appropriate": true|false,
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
- Branding: ALWAYS "yellow" to remind about Frank Batten School branding
- Visual Hierarchy: "red" if poor/many issues, "yellow" if needs improvement, "green" if excellent/good

Be thorough and analyze against WCAG 2.1 & 2.2 Level AA criteria, UVA brand guidelines, and visual hierarchy principles.`;

    context.log('Calling Claude API...');

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

    context.log('Claude API response received');

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
      context.log.error('JSON parse error:', parseError);
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
        error: error.message || 'Analysis failed',
        details: error.stack
      }
    };
  }
};
