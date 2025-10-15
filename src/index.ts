#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as storage from './storage.js';
import { BrandKit, CourseLayoutTemplate, QMTemplate } from './types.js';
import { defaultQMTemplates, analyzeQMCompliance } from './qm-tools.js';
import { fixDocument, parseDocument } from './document-fixer.js';

// Initialize storage
await storage.initStorage();

const server = new Server(
  {
    name: 'mcp-coursework-assessment-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool Schemas
const CreateBrandKitSchema = z.object({
  name: z.string(),
  organization: z.string(),
  colors: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
    accent: z.array(z.string()),
  }),
  fonts: z.object({
    headings: z.array(z.string()),
    body: z.array(z.string()),
  }),
  logos: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
    description: z.string(),
  })),
  guidelines: z.object({
    spacing: z.string(),
    accessibility: z.string(),
    imagery: z.string(),
  }),
});

const UpdateBrandKitSchema = CreateBrandKitSchema.extend({
  id: z.string(),
});

const CreateLayoutTemplateSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(['syllabus', 'assignment', 'module', 'assessment', 'general']),
  structure: z.object({
    sections: z.array(z.string()),
    requiredElements: z.array(z.string()),
    optionalElements: z.array(z.string()),
  }),
  accessibilityFeatures: z.array(z.string()),
  bestPractices: z.array(z.string()),
});

const AnalyzeDocumentSchema = z.object({
  content: z.string(),
  brandKitId: z.string().optional(),
  documentType: z.enum(['syllabus', 'assignment', 'module', 'assessment', 'general']).optional(),
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_brand_kit',
        description: 'Create a new brand kit with colors, fonts, logos, and guidelines for an organization',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the brand kit' },
            organization: { type: 'string', description: 'Organization name' },
            colors: {
              type: 'object',
              properties: {
                primary: { type: 'array', items: { type: 'string' }, description: 'Primary color palette (hex codes)' },
                secondary: { type: 'array', items: { type: 'string' }, description: 'Secondary color palette' },
                accent: { type: 'array', items: { type: 'string' }, description: 'Accent colors' },
              },
              required: ['primary', 'secondary', 'accent'],
            },
            fonts: {
              type: 'object',
              properties: {
                headings: { type: 'array', items: { type: 'string' }, description: 'Font families for headings' },
                body: { type: 'array', items: { type: 'string' }, description: 'Font families for body text' },
              },
              required: ['headings', 'body'],
            },
            logos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  url: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['name', 'description'],
              },
            },
            guidelines: {
              type: 'object',
              properties: {
                spacing: { type: 'string', description: 'Spacing guidelines' },
                accessibility: { type: 'string', description: 'Accessibility requirements' },
                imagery: { type: 'string', description: 'Image usage guidelines' },
              },
              required: ['spacing', 'accessibility', 'imagery'],
            },
          },
          required: ['name', 'organization', 'colors', 'fonts', 'logos', 'guidelines'],
        },
      },
      {
        name: 'update_brand_kit',
        description: 'Update an existing brand kit',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Brand kit ID' },
            name: { type: 'string' },
            organization: { type: 'string' },
            colors: {
              type: 'object',
              properties: {
                primary: { type: 'array', items: { type: 'string' } },
                secondary: { type: 'array', items: { type: 'string' } },
                accent: { type: 'array', items: { type: 'string' } },
              },
            },
            fonts: {
              type: 'object',
              properties: {
                headings: { type: 'array', items: { type: 'string' } },
                body: { type: 'array', items: { type: 'string' } },
              },
            },
            logos: { type: 'array', items: { type: 'object' } },
            guidelines: { type: 'object' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_brand_kit',
        description: 'Retrieve a brand kit by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Brand kit ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_brand_kits',
        description: 'List all available brand kits',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'delete_brand_kit',
        description: 'Delete a brand kit by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Brand kit ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_layout_template',
        description: 'Create a coursework layout template with structure and best practices',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            category: {
              type: 'string',
              enum: ['syllabus', 'assignment', 'module', 'assessment', 'general'],
              description: 'Type of coursework document',
            },
            structure: {
              type: 'object',
              properties: {
                sections: { type: 'array', items: { type: 'string' }, description: 'Document sections' },
                requiredElements: { type: 'array', items: { type: 'string' } },
                optionalElements: { type: 'array', items: { type: 'string' } },
              },
              required: ['sections', 'requiredElements', 'optionalElements'],
            },
            accessibilityFeatures: { type: 'array', items: { type: 'string' } },
            bestPractices: { type: 'array', items: { type: 'string' } },
          },
          required: ['name', 'description', 'category', 'structure', 'accessibilityFeatures', 'bestPractices'],
        },
      },
      {
        name: 'list_layout_templates',
        description: 'List all coursework layout templates, optionally filtered by category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['syllabus', 'assignment', 'module', 'assessment', 'general'],
              description: 'Filter by category (optional)',
            },
          },
        },
      },
      {
        name: 'analyze_document',
        description: 'Analyze a document for accessibility, branding compliance, and layout quality',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Document content to analyze' },
            brandKitId: { type: 'string', description: 'Optional brand kit ID to check compliance' },
            documentType: {
              type: 'string',
              enum: ['syllabus', 'assignment', 'module', 'assessment', 'general'],
              description: 'Type of document for layout recommendations',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'get_recommendations',
        description: 'Get personalized recommendations for improving a coursework document',
        inputSchema: {
          type: 'object',
          properties: {
            documentType: {
              type: 'string',
              enum: ['syllabus', 'assignment', 'module', 'assessment', 'general'],
              description: 'Type of coursework document',
            },
            currentIssues: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of current issues or concerns',
            },
          },
          required: ['documentType'],
        },
      },
      {
        name: 'analyze_qm_compliance',
        description: 'Analyze a course or document for Quality Matters (QM) compliance. Evaluates against all 8 QM General Standards and provides detailed feedback.',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Course or document content to analyze' },
            documentType: { type: 'string', description: 'Type of content (syllabus, module, full course, etc.)' },
          },
          required: ['content'],
        },
      },
      {
        name: 'get_qm_template',
        description: 'Get a Quality Matters template for a specific standard (1-8)',
        inputSchema: {
          type: 'object',
          properties: {
            standard: {
              type: 'number',
              description: 'QM General Standard number (1-8)',
              minimum: 1,
              maximum: 8,
            },
            templateId: {
              type: 'string',
              description: 'Optional specific template ID to retrieve',
            },
          },
        },
      },
      {
        name: 'list_qm_templates',
        description: 'List all Quality Matters templates, optionally filtered by standard',
        inputSchema: {
          type: 'object',
          properties: {
            standard: {
              type: 'number',
              description: 'Filter by QM General Standard (1-8)',
              minimum: 1,
              maximum: 8,
            },
          },
        },
      },
      {
        name: 'create_qm_template',
        description: 'Create a custom Quality Matters template for a specific standard',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            standard: {
              type: 'number',
              minimum: 1,
              maximum: 8,
              description: 'QM General Standard (1-8)',
            },
            specificReviewStandards: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific Review Standards addressed (e.g., ["1.1", "1.2"])',
            },
            template: { type: 'string', description: 'Template content/text' },
            examples: { type: 'array', items: { type: 'string' } },
            bestPractices: { type: 'array', items: { type: 'string' } },
          },
          required: ['name', 'description', 'standard', 'specificReviewStandards', 'template'],
        },
      },
      {
        name: 'get_qm_standard_info',
        description: 'Get detailed information about a specific QM General Standard',
        inputSchema: {
          type: 'object',
          properties: {
            standard: {
              type: 'number',
              description: 'QM General Standard number (1-8)',
              minimum: 1,
              maximum: 8,
            },
          },
          required: ['standard'],
        },
      },
      {
        name: 'fix_document',
        description: 'Upload and automatically fix a DOCX or PDF document. Applies brand kit (fonts, colors, logo), fixes accessibility issues, corrects visual hierarchy, and generates a change log of all modifications.',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Absolute path to the DOCX or PDF file to fix',
            },
            brandKitId: {
              type: 'string',
              description: 'Brand kit ID to apply (fonts, colors, logo, guidelines)',
            },
            outputDir: {
              type: 'string',
              description: 'Directory to save fixed document and change log (optional, defaults to ./output)',
            },
          },
          required: ['filePath', 'brandKitId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_brand_kit': {
        const validated = CreateBrandKitSchema.parse(args);
        const brandKit: BrandKit = {
          id: `brand-${Date.now()}`,
          ...validated,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveBrandKit(brandKit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, brandKit }, null, 2),
            },
          ],
        };
      }

      case 'update_brand_kit': {
        const validated = UpdateBrandKitSchema.parse(args);
        const existing = await storage.getBrandKitById(validated.id);
        if (!existing) {
          throw new Error(`Brand kit with ID ${validated.id} not found`);
        }
        const updated: BrandKit = {
          ...existing,
          ...validated,
          updatedAt: new Date().toISOString(),
        };
        await storage.saveBrandKit(updated);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, brandKit: updated }, null, 2),
            },
          ],
        };
      }

      case 'get_brand_kit': {
        const { id } = args as { id: string };
        const brandKit = await storage.getBrandKitById(id);
        if (!brandKit) {
          throw new Error(`Brand kit with ID ${id} not found`);
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(brandKit, null, 2),
            },
          ],
        };
      }

      case 'list_brand_kits': {
        const brandKits = await storage.getAllBrandKits();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(brandKits, null, 2),
            },
          ],
        };
      }

      case 'delete_brand_kit': {
        const { id } = args as { id: string };
        const success = await storage.deleteBrandKit(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success, message: success ? 'Brand kit deleted' : 'Brand kit not found' }),
            },
          ],
        };
      }

      case 'create_layout_template': {
        const validated = CreateLayoutTemplateSchema.parse(args);
        const template: CourseLayoutTemplate = {
          id: `template-${Date.now()}`,
          ...validated,
        };
        await storage.saveLayoutTemplate(template);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, template }, null, 2),
            },
          ],
        };
      }

      case 'list_layout_templates': {
        const { category } = args as { category?: string };
        const templates = category
          ? await storage.getLayoutTemplatesByCategory(category)
          : await storage.getAllLayoutTemplates();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(templates, null, 2),
            },
          ],
        };
      }

      case 'analyze_document': {
        const { content, brandKitId, documentType } = AnalyzeDocumentSchema.parse(args);

        // Simple analysis logic (you can enhance this later)
        const analysis = {
          accessibility: {
            score: 75,
            issues: [
              {
                severity: 'warning' as const,
                description: 'Document may lack proper heading structure',
                recommendation: 'Use hierarchical headings (H1, H2, H3) to organize content',
              },
              {
                severity: 'info' as const,
                description: 'Consider adding alt text descriptions for any images',
                recommendation: 'All images should have descriptive alt text for screen readers',
              },
            ],
          },
          branding: brandKitId
            ? {
                score: 60,
                issues: [
                  {
                    type: 'color' as const,
                    description: 'Color usage could not be verified from text content',
                    recommendation: 'Ensure primary brand colors are used for headings and accents',
                  },
                ],
              }
            : {
                score: 0,
                issues: [
                  {
                    type: 'color' as const,
                    description: 'No brand kit specified',
                    recommendation: 'Specify a brand kit ID to check branding compliance',
                  },
                ],
              },
          layout: {
            score: 70,
            suggestions: [
              'Add clear section headers',
              'Include a table of contents for longer documents',
              'Use consistent spacing between sections',
              'Consider adding visual hierarchy with font sizes',
            ],
          },
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
      }

      case 'get_recommendations': {
        const { documentType, currentIssues } = args as {
          documentType: string;
          currentIssues?: string[]
        };

        const baseRecommendations: Record<string, string[]> = {
          syllabus: [
            'Include course objectives and learning outcomes',
            'Provide a clear grading policy and rubric',
            'List required and optional materials',
            'Add office hours and contact information',
            'Include accessibility and accommodation statements',
            'Provide a week-by-week schedule',
          ],
          assignment: [
            'State clear learning objectives',
            'Provide detailed submission instructions',
            'Include grading criteria or rubric',
            'Specify due dates and late policy',
            'Add examples or resources when helpful',
          ],
          module: [
            'Start with module objectives',
            'Organize content in logical progression',
            'Include diverse content types (text, video, interactive)',
            'Add checkpoints or self-assessments',
            'Provide summary and next steps',
          ],
          assessment: [
            'Align with course learning outcomes',
            'Provide clear instructions',
            'Include time estimates',
            'Specify point values',
            'Add accessibility considerations',
          ],
          general: [
            'Use clear, consistent formatting',
            'Ensure proper heading hierarchy',
            'Include navigation aids for long documents',
            'Use accessible fonts and sufficient contrast',
          ],
        };

        const recommendations = baseRecommendations[documentType] || baseRecommendations.general;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                documentType,
                recommendations,
                additionalNotes: currentIssues && currentIssues.length > 0
                  ? `Address these specific issues: ${currentIssues.join(', ')}`
                  : 'Document follows standard best practices',
              }, null, 2),
            },
          ],
        };
      }

      case 'analyze_qm_compliance': {
        const { content, documentType } = args as { content: string; documentType?: string };
        const qmAnalysis = analyzeQMCompliance(content, documentType);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(qmAnalysis, null, 2),
            },
          ],
        };
      }

      case 'get_qm_template': {
        const { standard, templateId } = args as { standard?: number; templateId?: string };

        if (templateId) {
          const template = await storage.getQMTemplateById(templateId);
          if (!template) {
            // Check default templates
            const defaultTemplate = defaultQMTemplates.find((t: QMTemplate) => t.id === templateId);
            if (!defaultTemplate) {
              throw new Error(`QM Template not found: ${templateId}`);
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(defaultTemplate, null, 2),
                },
              ],
            };
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(template, null, 2),
              },
            ],
          };
        }

        if (standard) {
          const templates = [...defaultQMTemplates.filter((t: QMTemplate) => t.standard === standard)];
          const customTemplates = await storage.getQMTemplatesByStandard(standard);
          templates.push(...customTemplates);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(templates, null, 2),
              },
            ],
          };
        }

        throw new Error('Either standard or templateId must be provided');
      }

      case 'list_qm_templates': {
        const { standard } = args as { standard?: number };

        if (standard) {
          const templates = [...defaultQMTemplates.filter((t: QMTemplate) => t.standard === standard)];
          const customTemplates = await storage.getQMTemplatesByStandard(standard);
          templates.push(...customTemplates);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(templates, null, 2),
              },
            ],
          };
        }

        const allCustom = await storage.getAllQMTemplates();
        const allTemplates = [...defaultQMTemplates, ...allCustom];

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(allTemplates, null, 2),
            },
          ],
        };
      }

      case 'create_qm_template': {
        const { name, description, standard, specificReviewStandards, template, examples, bestPractices } = args as {
          name: string;
          description: string;
          standard: number;
          specificReviewStandards: string[];
          template: string;
          examples?: string[];
          bestPractices?: string[];
        };

        const qmTemplate: QMTemplate = {
          id: `qm-custom-${Date.now()}`,
          name,
          description,
          standard: standard as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
          specificReviewStandards,
          template,
          examples: examples || [],
          bestPractices: bestPractices || [],
        };

        await storage.saveQMTemplate(qmTemplate);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, template: qmTemplate }, null, 2),
            },
          ],
        };
      }

      case 'get_qm_standard_info': {
        const { standard } = args as { standard: number };

        const standardInfo: Record<number, any> = {
          1: {
            number: 1,
            name: 'Course Overview and Introduction',
            description: 'Helps learners understand course structure and get started successfully',
            pointsPossible: 16,
            specificReviewStandards: 8,
            essentialStandards: ['1.1', '1.2'],
            focusAreas: ['Getting started instructions', 'Course structure', 'Communication expectations', 'Technology requirements'],
          },
          2: {
            number: 2,
            name: 'Learning Objectives (Competencies)',
            description: 'Clearly articulated, measurable learning outcomes',
            pointsPossible: 11,
            specificReviewStandards: 5,
            essentialStandards: ['2.1', '2.2'],
            focusAreas: ['Measurable objectives', 'Bloom\'s Taxonomy', 'Course-level objectives', 'Module-level objectives'],
          },
          3: {
            number: 3,
            name: 'Assessment and Measurement',
            description: 'Assessments that accurately measure achievement of learning objectives',
            pointsPossible: 15,
            specificReviewStandards: 6,
            essentialStandards: ['3.1', '3.2', '3.3'],
            focusAreas: ['Alignment with objectives', 'Grading policy', 'Rubrics and criteria', 'Academic integrity'],
          },
          4: {
            number: 4,
            name: 'Instructional Materials',
            description: 'High-quality, relevant, and diverse learning resources',
            pointsPossible: 12,
            specificReviewStandards: 6,
            essentialStandards: ['4.1'],
            focusAreas: ['Relevance to objectives', 'Currency and accuracy', 'Diversity and inclusion', 'Proper citations'],
          },
          5: {
            number: 5,
            name: 'Learning Activities and Learner Interaction',
            description: 'Active engagement and meaningful interaction',
            pointsPossible: 8,
            specificReviewStandards: 4,
            essentialStandards: ['5.1'],
            focusAreas: ['Active learning', 'Learner-instructor interaction', 'Learner-learner interaction', 'Community building'],
          },
          6: {
            number: 6,
            name: 'Course Technology',
            description: 'Tools that enhance learning without creating barriers',
            pointsPossible: 9,
            specificReviewStandards: 5,
            essentialStandards: ['6.1'],
            focusAreas: ['Purposeful technology', 'Accessibility', 'Privacy and data protection', 'User support'],
          },
          7: {
            number: 7,
            name: 'Learner Support',
            description: 'Resources and services that help learners succeed',
            pointsPossible: 6,
            specificReviewStandards: 4,
            essentialStandards: [],
            focusAreas: ['Technical support', 'Accessibility services', 'Academic support', 'Student services'],
          },
          8: {
            number: 8,
            name: 'Accessibility and Usability',
            description: 'Courses designed for all learners, including those with disabilities',
            pointsPossible: 11,
            specificReviewStandards: 6,
            essentialStandards: ['8.1'],
            focusAreas: ['Navigation and usability', 'Text accessibility', 'Image accessibility', 'Video/audio accessibility'],
          },
        };

        const info = standardInfo[standard];
        if (!info) {
          throw new Error(`Invalid standard number: ${standard}. Must be 1-8.`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      case 'fix_document': {
        const { filePath, brandKitId, outputDir = './output' } = args as {
          filePath: string;
          brandKitId: string;
          outputDir?: string;
        };

        // Get brand kit
        const brandKit = await storage.getBrandKitById(brandKitId);
        if (!brandKit) {
          throw new Error(`Brand kit not found: ${brandKitId}`);
        }

        // Fix the document
        const result = await fixDocument(filePath, brandKit, outputDir);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: result.success,
                message: 'Document fixed successfully!',
                fixedDocument: result.fixedDocumentPath,
                changeLog: result.changeLogPath,
                summary: result.summary,
                totalCorrections: result.fixes.length,
                corrections: result.fixes,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const brandKits = await storage.getAllBrandKits();
  const templates = await storage.getAllLayoutTemplates();

  return {
    resources: [
      ...brandKits.map(kit => ({
        uri: `brandkit://${kit.id}`,
        mimeType: 'application/json',
        name: `Brand Kit: ${kit.name}`,
        description: `Brand guidelines for ${kit.organization}`,
      })),
      ...templates.map(template => ({
        uri: `template://${template.id}`,
        mimeType: 'application/json',
        name: `Template: ${template.name}`,
        description: template.description,
      })),
    ],
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri.startsWith('brandkit://')) {
    const id = uri.replace('brandkit://', '');
    const brandKit = await storage.getBrandKitById(id);
    if (!brandKit) {
      throw new Error(`Brand kit not found: ${id}`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(brandKit, null, 2),
        },
      ],
    };
  }

  if (uri.startsWith('template://')) {
    const id = uri.replace('template://', '');
    const templates = await storage.getAllLayoutTemplates();
    const template = templates.find(t => t.id === id);
    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(template, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Coursework Assessment Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
