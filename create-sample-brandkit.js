import * as storage from './dist/storage.js';

// Initialize storage
await storage.initStorage();

// Create UVA brand kit
const uvaBrandKit = {
  id: 'brand-uva-2025',
  name: 'UVA Brand Kit',
  organization: 'University of Virginia',
  colors: {
    primary: ['#232D4B', '#E57200'],
    secondary: ['#FFFFFF', '#F2F2F2'],
    accent: ['#E57200', '#007BAC']
  },
  fonts: {
    headings: ['Adobe Caslon Pro', 'Georgia', 'serif'],
    body: ['Franklin Gothic', 'Arial', 'sans-serif']
  },
  logos: [{
    name: 'UVA Logo',
    description: 'Official University of Virginia logo'
  }],
  guidelines: {
    spacing: 'Use consistent spacing between sections (20pt before headings, 12pt after paragraphs)',
    accessibility: 'WCAG 2.1 Level AA compliance required - minimum 4.5:1 contrast ratio for text',
    imagery: 'Use approved UVA imagery and photography'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await storage.saveBrandKit(uvaBrandKit);

console.log('✅ Sample UVA brand kit created!');
console.log('ID:', uvaBrandKit.id);
