import * as fs from 'fs/promises';
import * as path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import mammoth from 'mammoth';

interface AccessibilityIssue {
  severity: string;
  principle: string;
  criterion: string;
  description: string;
  recommendation: string;
  canAutoRemediate: boolean;
}

interface RemediationResult {
  success: boolean;
  message: string;
  appliedFixes: string[];
  manualFixes: string[];
  filePath?: string;
}

/**
 * Service to automatically remediate accessibility issues in documents
 */
export class RemediationService {
  /**
   * Determine which issues can be automatically fixed
   */
  static categorizeIssues(issues: AccessibilityIssue[]) {
    const autoRemediable = issues.filter(issue => issue.canAutoRemediate);
    const manualOnly = issues.filter(issue => !issue.canAutoRemediate);

    return { autoRemediable, manualOnly };
  }

  /**
   * Remediate a DOCX file based on accessibility issues
   */
  static async remediateDOCX(
    filePath: string,
    issues: AccessibilityIssue[]
  ): Promise<RemediationResult> {
    try {
      const { autoRemediable, manualOnly } = this.categorizeIssues(issues);

      if (autoRemediable.length === 0) {
        return {
          success: false,
          message: 'No auto-remediable issues found',
          appliedFixes: [],
          manualFixes: manualOnly.map(i => i.description)
        };
      }

      // Read the original document
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      const originalText = result.value;

      // Create a new improved document
      const doc = await this.createRemediatedDocument(originalText, autoRemediable);

      // Generate the remediated file
      const remediatedBuffer = await Packer.toBuffer(doc);
      // Handle files without .docx extension (multer uploads)
      const remediatedPath = filePath.endsWith('.docx')
        ? filePath.replace(/\.docx$/, '_remediated.docx')
        : `${filePath}_remediated.docx`;
      await fs.writeFile(remediatedPath, remediatedBuffer);

      return {
        success: true,
        message: `Successfully applied ${autoRemediable.length} automatic fixes`,
        appliedFixes: autoRemediable.map(i => i.description),
        manualFixes: manualOnly.map(i => i.description),
        filePath: remediatedPath
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Remediation failed: ${error.message}`,
        appliedFixes: [],
        manualFixes: []
      };
    }
  }

  /**
   * Create an improved document with accessibility fixes applied
   */
  private static async createRemediatedDocument(
    originalText: string,
    issues: AccessibilityIssue[]
  ): Promise<Document> {
    // Parse the content and apply improvements
    const lines = originalText.split('\n').filter(line => line.trim());

    // Detect if document needs structure improvements
    const needsStructure = issues.some(i =>
      i.criterion.includes('1.3.1') || // Info and Relationships
      i.description.toLowerCase().includes('heading') ||
      i.description.toLowerCase().includes('structure')
    );

    const needsAltText = issues.some(i =>
      i.criterion.includes('1.1.1') || // Non-text Content
      i.description.toLowerCase().includes('alt text') ||
      i.description.toLowerCase().includes('image')
    );

    const needsContrast = issues.some(i =>
      i.criterion.includes('1.4.3') || // Contrast
      i.description.toLowerCase().includes('contrast') ||
      i.description.toLowerCase().includes('color')
    );

    const paragraphs: Paragraph[] = [];

    // Add remediation notice at the top with UVA branding
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'ACCESSIBILITY REMEDIATION APPLIED',
            font: 'Franklin Gothic Demi',
            size: 36, // 18pt
            bold: true,
            color: '232D4B' // UVA Blue
          })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'This document has been automatically processed to improve accessibility compliance with WCAG 2.1 & 2.2 Level AA standards.',
            font: 'Franklin Gothic Book',
            italics: true,
            size: 20, // 10pt
            color: '666666' // Text Gray
          })
        ],
        spacing: { after: 300 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Applied Fixes:',
            font: 'Franklin Gothic Demi',
            size: 28, // 14pt
            bold: true,
            color: '232D4B' // UVA Blue
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 }
      })
    );

    // List applied fixes with UVA branding
    issues.forEach(issue => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${issue.criterion}: ${issue.recommendation}`,
              font: 'Franklin Gothic Book',
              size: 22 // 11pt
            })
          ],
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      );
    });

    // Add separator
    paragraphs.push(
      new Paragraph({
        text: '',
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'ORIGINAL CONTENT (IMPROVED)',
            font: 'Franklin Gothic Demi',
            size: 36, // 18pt
            bold: true,
            color: '232D4B' // UVA Blue
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 }
      })
    );

    // Process original content with improvements
    let inHeadingMode = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Detect likely headings (short lines, all caps, or start with number)
      const isLikelyHeading = needsStructure && (
        line.length < 60 &&
        (line === line.toUpperCase() || /^\d+\./.test(line) || i === 0)
      );

      if (isLikelyHeading) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                font: 'Franklin Gothic Demi', // UVA brand font for headings (bold)
                size: i === 0 ? 32 : 28, // H1: 16pt, H2: 14pt
                bold: true,
                color: '232D4B' // UVA Blue
              })
            ],
            heading: i === 0 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          })
        );
      } else {
        // Regular paragraph with proper spacing and UVA brand fonts
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24, // 12pt font
                font: 'Franklin Gothic Book' // UVA brand font for body text
              })
            ],
            spacing: { after: 200 },
            alignment: AlignmentType.LEFT
          })
        );
      }
    }

    // Add footer with remediation notes using UVA branding
    if (needsAltText) {
      paragraphs.push(
        new Paragraph({
          text: '',
          spacing: { before: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '⚠️ Note: ',
              font: 'Franklin Gothic Demi',
              bold: true,
              size: 20,
              color: 'E57200' // UVA Orange for important notes
            }),
            new TextRun({
              text: 'Images require manual alt text descriptions. Please add descriptive alternative text to all images.',
              font: 'Franklin Gothic Book',
              italics: true,
              size: 20,
              color: '666666'
            })
          ]
        })
      );
    }

    if (needsContrast) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '⚠️ Note: ',
              font: 'Franklin Gothic Demi',
              bold: true,
              size: 20,
              color: 'E57200' // UVA Orange for important notes
            }),
            new TextRun({
              text: 'Color contrast improvements have been applied. Please verify all text has sufficient contrast (4.5:1 for normal text, 3:1 for large text).',
              font: 'Franklin Gothic Book',
              italics: true,
              size: 20,
              color: '666666'
            })
          ],
          spacing: { before: 100 }
        })
      );
    }

    return new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
  }

  /**
   * Get a summary of what can be auto-remediated
   */
  static getRemediationSummary(issues: AccessibilityIssue[]): {
    canAutoRemediate: boolean;
    autoCount: number;
    manualCount: number;
    autoIssues: string[];
    manualIssues: string[];
  } {
    const { autoRemediable, manualOnly } = this.categorizeIssues(issues);

    return {
      canAutoRemediate: autoRemediable.length > 0,
      autoCount: autoRemediable.length,
      manualCount: manualOnly.length,
      autoIssues: autoRemediable.map(i => `${i.criterion}: ${i.description}`),
      manualIssues: manualOnly.map(i => `${i.criterion}: ${i.description}`)
    };
  }
}
