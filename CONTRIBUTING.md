# Contributing to MCP Coursework Accessibility Assessment Tool

Thank you for your interest in contributing! This tool aims to make educational content more accessible, and we welcome contributions from developers, educators, and accessibility advocates.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive experience for everyone, regardless of background or identity.

### Our Standards
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## How Can I Contribute?

### Areas We Need Help

**1. Accessibility Improvements**
- Enhancing WCAG compliance checking
- Adding more detailed recommendations
- Improving screen reader compatibility
- Testing with assistive technologies

**2. Code Quality**
- Bug fixes
- Performance improvements
- Code refactoring
- Better error handling
- Unit and integration tests

**3. Features**
- Support for additional file formats
- Batch processing capabilities
- Export functionality (PDF reports)
- LMS integrations
- Custom accessibility rules

**4. Documentation**
- Improving setup guides
- Adding code comments
- Creating video tutorials
- Translating documentation
- Adding examples

**5. Design & UX**
- UI/UX improvements
- Responsive design enhancements
- Accessibility of the tool itself
- Better data visualization

## Development Setup

### Prerequisites
- Node.js 18+
- Git
- Code editor (VS Code recommended)
- Anthropic API key (for testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/MCPAssessment.git
cd MCPAssessment
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/behartless67-a11y/MCPAssessment.git
```

### Install Dependencies

**API Server:**
```bash
cd api-server
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

**Web Frontend:**
```bash
cd web-frontend
npm install
```

**MCP Server (optional):**
```bash
cd ..
npm install
npm run build
```

### Running Development Servers

**Terminal 1 - API Server:**
```bash
cd api-server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd web-frontend
npm run dev
```

Access the application at http://localhost:3000

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for new code
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Avoid `any` types when possible

### Code Style
```typescript
// Good
interface AnalysisResult {
  score: number;
  issues: AccessibilityIssue[];
}

// Avoid
let x: any;
```

### File Organization
```
api-server/
├── src/
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
```

### Naming Conventions
- **Files:** kebab-case (`accessibility-analyzer.ts`)
- **Components:** PascalCase (`FileUpload.tsx`)
- **Functions:** camelCase (`analyzeDocument()`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## Submitting Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes
- Write clear, concise code
- Follow existing patterns
- Add comments where needed
- Update documentation if needed

### 3. Test Your Changes
```bash
# Test API server
cd api-server
npm run build
npm start

# Test frontend
cd web-frontend
npm run build
npm start
```

Manual testing:
- Upload a test document
- Verify accessibility analysis works
- Check QM analysis works
- Test error handling
- Verify on different browsers

### 4. Commit Your Changes
```bash
git add .
git commit -m "Type: Brief description

Longer explanation of what changed and why.

Fixes #123"
```

Commit message format:
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Formatting, missing semicolons, etc.
- **refactor:** Code restructuring
- **test:** Adding tests
- **chore:** Maintenance tasks

Examples:
```
feat: Add support for PPTX files

Added PowerPoint file parsing using pptx-parser library.
Supports text extraction and basic accessibility checks.

Closes #45
```

```
fix: Correct color contrast calculation

Fixed bug where color contrast was calculated incorrectly
for semi-transparent colors.

Fixes #67
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Screenshots (if UI changes)

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested locally
- [ ] Screenshots added (if UI changes)

## Reporting Bugs

### Before Submitting
1. Check existing issues
2. Try latest version
3. Verify it's reproducible

### Bug Report Template
```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Upload file '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
 - OS: [e.g., Windows 11]
 - Browser: [e.g., Chrome 120]
 - Node version: [e.g., 18.17.0]
 - API Server version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

### Submit via GitHub Issues
https://github.com/behartless67-a11y/MCPAssessment/issues/new

## Suggesting Features

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Use case**
How would this feature be used? Who benefits?

**Additional context**
Mockups, examples, or references.
```

### Feature Discussion
For major features, consider:
1. Opening a discussion first
2. Getting feedback from maintainers
3. Creating a design document
4. Breaking into smaller PRs

## Development Guidelines

### Adding a New Analysis Feature

1. **Update API Server** (`api-server/src/server.ts`):
```typescript
// Add to analysis handler
case 'your-new-analysis':
  // Implementation
  break;
```

2. **Update Frontend** (`web-frontend/app/page.tsx`):
```typescript
// Add analysis type
type AnalysisType = 'qm' | 'accessibility' | 'your-new-type';
```

3. **Create Results Component**:
```typescript
// web-frontend/app/components/YourAnalysisResults.tsx
export default function YourAnalysisResults({ results }) {
  // Component implementation
}
```

4. **Update Documentation**:
- README.md
- TESTING.md
- Add example results

### Adding File Format Support

1. **Install parser** (`api-server/`):
```bash
npm install file-parser-library
```

2. **Add to file processor** (`api-server/src/utils/file-processor.ts`):
```typescript
case '.newext':
  text = await parseNewFormat(buffer);
  break;
```

3. **Update allowed types** (`web-frontend/app/components/FileUpload.tsx`):
```typescript
accept: {
  'application/new-type': ['.newext']
}
```

4. **Test thoroughly** with various files

## Testing Guidelines

### Manual Testing Checklist
- [ ] File upload works (drag and drop + click)
- [ ] All file formats process correctly
- [ ] Accessibility analysis produces valid results
- [ ] QM analysis scores correctly
- [ ] Error messages are clear
- [ ] Loading states work
- [ ] Results display properly
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Keyboard navigation works

### Adding Automated Tests
```typescript
// Example: api-server/src/__tests__/analyzer.test.ts
import { analyzeAccessibility } from '../services/analyzer';

describe('Accessibility Analyzer', () => {
  test('identifies missing alt text', () => {
    const result = analyzeAccessibility('<img src="test.jpg">');
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        type: 'critical',
        wcagCriteria: '1.1.1'
      })
    );
  });
});
```

## Code Review Process

### What to Expect
1. Maintainers will review your PR
2. May request changes or clarifications
3. Address feedback and push updates
4. Once approved, PR will be merged

### Review Criteria
- Code quality and style
- Functionality and correctness
- Test coverage
- Documentation
- Performance impact
- Security considerations

## Getting Help

### Resources
- **Documentation:** Check [SETUP.md](./SETUP.md) and [TESTING.md](./TESTING.md)
- **Issues:** Search existing issues
- **Discussions:** GitHub Discussions for questions
- **Examples:** Look at merged PRs for examples

### Communication
- Be respectful and patient
- Provide context and details
- Accept constructive feedback
- Ask questions when unclear

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in relevant documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making educational content more accessible! 🎓♿
