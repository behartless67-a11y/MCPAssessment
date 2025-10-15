import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth';
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { BrandKit } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface DocumentFix {
  type: 'font' | 'color' | 'accessibility' | 'hierarchy' | 'logo' | 'spacing';
  description: string;
  location: string;
  before?: string;
  after?: string;
}

export interface FixDocumentResult {
  success: boolean;
  fixedDocumentPath: string;
  changeLogPath: string;
  fixes: DocumentFix[];
  summary: {
    totalFixes: number;
    fontFixes: number;
    accessibilityFixes: number;
    hierarchyFixes: number;
    logoAdded: boolean;
  };
}

/**
 * NEW APPROACH: Preserve original DOCX structure, only apply branding
 *
 * This is much better because it:
 * 1. Keeps all original formatting (spacing, indents, lists)
 * 2. Only changes fonts and colors
 * 3. Adds logo to footer
 */
export async function fixDocumentPreserveStructure(
  filePath: string,
  brandKit: BrandKit,
  outputDir: string
): Promise<FixDocumentResult> {
  const fixes: DocumentFix[] = [];

  // For DOCX files, we need to use a different library that preserves structure
  // For now, let's document what we WOULD do and use the simple text approach

  // TODO: Use docx-templater or similar to modify existing DOCX in-place
  // For now, we'll document the limitations

  fixes.push({
    type: 'font',
    description: 'NOTE: Currently rebuilding document from text. Original formatting may be lost.',
    location: 'Entire document',
    after: 'Consider using "Edit in Word" with Find/Replace for fonts to preserve formatting'
  });

  // Return empty result for now
  return {
    success: false,
    fixedDocumentPath: '',
    changeLogPath: '',
    fixes,
    summary: {
      totalFixes: 0,
      fontFixes: 0,
      accessibilityFixes: 0,
      hierarchyFixes: 0,
      logoAdded: false,
    },
  };
}

/**
 * BETTER SOLUTION: Generate Word macro/instructions to apply branding
 *
 * Since preserving DOCX structure is complex, a better approach is:
 * 1. Give users a Word macro they can run
 * 2. Or provide Find/Replace instructions
 * 3. Only generate new docs for plain text input
 */
export function generateWordMacroForBranding(brandKit: BrandKit): string {
  return `
' VBA Macro to Apply UVA Branding to Word Document
' Copy this into Word VBA Editor (Alt+F11)

Sub ApplyUVABranding()
    ' Apply heading font (Adobe Caslon Pro)
    With ActiveDocument.Styles("Heading 1").Font
        .Name = "${brandKit.fonts.headings[0]}"
        .Color = RGB(35, 45, 75) ' UVA Navy Blue
        .Bold = True
    End With

    With ActiveDocument.Styles("Heading 2").Font
        .Name = "${brandKit.fonts.headings[0]}"
        .Color = RGB(35, 45, 75)
        .Bold = True
    End With

    With ActiveDocument.Styles("Heading 3").Font
        .Name = "${brandKit.fonts.headings[0]}"
        .Color = RGB(35, 45, 75)
        .Bold = True
    End With

    ' Apply body font (Franklin Gothic)
    With ActiveDocument.Styles("Normal").Font
        .Name = "${brandKit.fonts.body[0]}"
    End With

    MsgBox "UVA branding applied! Fonts and colors updated.", vbInformation
End Sub
`;
}
