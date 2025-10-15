import * as fs from 'fs/promises';
import * as path from 'path';
import { BrandKit, CourseLayoutTemplate, QMTemplate } from './types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const BRAND_KITS_FILE = path.join(DATA_DIR, 'brand-kits.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'layout-templates.json');
const QM_TEMPLATES_FILE = path.join(DATA_DIR, 'qm-templates.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function ensureFile(filePath: string, defaultContent: any) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
  }
}

export async function initStorage() {
  await ensureDataDir();
  await ensureFile(BRAND_KITS_FILE, []);
  await ensureFile(TEMPLATES_FILE, []);
  await ensureFile(QM_TEMPLATES_FILE, []);
}

// Brand Kit Operations
export async function saveBrandKit(brandKit: BrandKit): Promise<void> {
  const kits = await getAllBrandKits();
  const existingIndex = kits.findIndex(k => k.id === brandKit.id);

  if (existingIndex >= 0) {
    kits[existingIndex] = { ...brandKit, updatedAt: new Date().toISOString() };
  } else {
    kits.push(brandKit);
  }

  await fs.writeFile(BRAND_KITS_FILE, JSON.stringify(kits, null, 2));
}

export async function getAllBrandKits(): Promise<BrandKit[]> {
  try {
    const content = await fs.readFile(BRAND_KITS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getBrandKitById(id: string): Promise<BrandKit | null> {
  const kits = await getAllBrandKits();
  return kits.find(k => k.id === id) || null;
}

export async function deleteBrandKit(id: string): Promise<boolean> {
  const kits = await getAllBrandKits();
  const filtered = kits.filter(k => k.id !== id);

  if (filtered.length === kits.length) {
    return false;
  }

  await fs.writeFile(BRAND_KITS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// Course Layout Template Operations
export async function saveLayoutTemplate(template: CourseLayoutTemplate): Promise<void> {
  const templates = await getAllLayoutTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

export async function getAllLayoutTemplates(): Promise<CourseLayoutTemplate[]> {
  try {
    const content = await fs.readFile(TEMPLATES_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getLayoutTemplatesByCategory(category: string): Promise<CourseLayoutTemplate[]> {
  const templates = await getAllLayoutTemplates();
  return templates.filter(t => t.category === category);
}

export async function deleteLayoutTemplate(id: string): Promise<boolean> {
  const templates = await getAllLayoutTemplates();
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length === templates.length) {
    return false;
  }

  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// QM Template Operations
export async function saveQMTemplate(template: QMTemplate): Promise<void> {
  const templates = await getAllQMTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  await fs.writeFile(QM_TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

export async function getAllQMTemplates(): Promise<QMTemplate[]> {
  try {
    const content = await fs.readFile(QM_TEMPLATES_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getQMTemplatesByStandard(standard: number): Promise<QMTemplate[]> {
  const templates = await getAllQMTemplates();
  return templates.filter(t => t.standard === standard);
}

export async function getQMTemplateById(id: string): Promise<QMTemplate | null> {
  const templates = await getAllQMTemplates();
  return templates.find(t => t.id === id) || null;
}

export async function deleteQMTemplate(id: string): Promise<boolean> {
  const templates = await getAllQMTemplates();
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length === templates.length) {
    return false;
  }

  await fs.writeFile(QM_TEMPLATES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
