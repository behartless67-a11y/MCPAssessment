import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as storage from './dist/storage.js';
import { fixDocument } from './dist/document-fixer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/output', express.static('output'));

// Initialize storage
await storage.initStorage();

// Routes

// Get all brand kits
app.get('/api/brand-kits', async (req, res) => {
  try {
    const brandKits = await storage.getAllBrandKits();
    res.json(brandKits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a brand kit
app.post('/api/brand-kits', async (req, res) => {
  try {
    const brandKit = {
      id: `brand-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveBrandKit(brandKit);
    res.json(brandKit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fix document
app.post('/api/fix-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { brandKitId } = req.body;
    if (!brandKitId) {
      return res.status(400).json({ error: 'Brand kit ID required' });
    }

    // Get brand kit
    const brandKit = await storage.getBrandKitById(brandKitId);
    if (!brandKit) {
      return res.status(404).json({ error: 'Brand kit not found' });
    }

    // Fix the document
    const result = await fixDocument(req.file.path, brandKit, './output');

    // Return the result with download links
    res.json({
      success: true,
      message: 'Document fixed successfully!',
      fixedDocument: `/output/${path.basename(result.fixedDocumentPath)}`,
      changeLog: `/output/${path.basename(result.changeLogPath)}`,
      summary: result.summary,
      corrections: result.fixes,
    });
  } catch (error) {
    console.error('Error fixing document:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Document Fixer Web Server running!`);
  console.log(`\n📍 Open in browser: http://localhost:${PORT}`);
  console.log(`\n✨ Ready to fix documents!\n`);
});
