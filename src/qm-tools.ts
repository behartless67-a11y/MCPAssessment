import { QMTemplate } from './types.js';

/**
 * Default Quality Matters templates
 */
export const defaultQMTemplates: QMTemplate[] = [
  {
    id: 'qm-template-1-start-here',
    name: 'Start Here Module Template',
    description: 'Template for creating an effective "Start Here" module for QM Standard 1',
    standard: 1,
    specificReviewStandards: ['1.1', '1.2', '1.3', '1.4'],
    template: `# Start Here Module

## Welcome to the Course
[Welcome message from instructor]

## Course Overview
[Brief description of course content and objectives]

## Getting Started Checklist
- [ ] Review the syllabus
- [ ] Check technology requirements
- [ ] Introduce yourself in the discussion board
- [ ] Review the course schedule
- [ ] Set up notifications

## Technology Requirements
- Required software and hardware
- Browser requirements
- Accessibility tools

## Communication Plan
- How to contact instructor
- Expected response time
- Office hours

## Course Navigation
[Guide to navigating the course structure]`,
    examples: [
      'Welcome video introduction',
      'Interactive course tour',
      'Technology check quiz',
    ],
    bestPractices: [
      'Keep the Start Here module concise and welcoming',
      'Include clear next steps',
      'Provide contact information prominently',
      'Test all links and technology requirements',
    ],
  },
  {
    id: 'qm-template-2-learning-objectives',
    name: 'Learning Objectives Template',
    description: 'Template for writing measurable learning objectives aligned with QM Standard 2',
    standard: 2,
    specificReviewStandards: ['2.1', '2.2', '2.3'],
    template: `# Learning Objectives

## Course-Level Learning Objectives
By the end of this course, students will be able to:
1. [Action verb] + [content] + [context/condition] + [degree/criterion]
2. [Action verb] + [content] + [context/condition] + [degree/criterion]
3. [Action verb] + [content] + [context/condition] + [degree/criterion]

## Module [X] Learning Objectives
By the end of this module, students will be able to:
1. [Action verb] + [content] + [context/condition] + [degree/criterion]
2. [Action verb] + [content] + [context/condition] + [degree/criterion]

## Bloom's Taxonomy Reference
- Remember: identify, define, list, recall
- Understand: explain, describe, summarize
- Apply: demonstrate, solve, use, apply
- Analyze: compare, contrast, differentiate
- Evaluate: assess, critique, judge
- Create: design, develop, construct`,
    examples: [
      'Analyze case studies to identify ethical considerations in research (Analyze level)',
      'Design an experiment to test a hypothesis using proper scientific methodology (Create level)',
    ],
    bestPractices: [
      'Use measurable action verbs from Bloom\'s Taxonomy',
      'Align objectives with assessments',
      'Make objectives specific and observable',
      'Include objectives at various cognitive levels',
    ],
  },
  {
    id: 'qm-template-3-rubric',
    name: 'Assessment Rubric Template',
    description: 'Template for creating clear assessment rubrics aligned with QM Standard 3',
    standard: 3,
    specificReviewStandards: ['3.3', '3.4'],
    template: `# Assignment Rubric

| Criteria | Exemplary (4) | Proficient (3) | Developing (2) | Beginning (1) | Points |
|----------|---------------|----------------|----------------|---------------|--------|
| [Criterion 1 aligned with objective] | [Detailed description] | [Detailed description] | [Detailed description] | [Detailed description] | /4 |
| [Criterion 2 aligned with objective] | [Detailed description] | [Detailed description] | [Detailed description] | [Detailed description] | /4 |
| [Criterion 3 aligned with objective] | [Detailed description] | [Detailed description] | [Detailed description] | [Detailed description] | /4 |

**Total Points: /12**

## Grading Scale
- A: 11-12 points
- B: 9-10 points
- C: 7-8 points
- D: 5-6 points
- F: Below 5 points`,
    examples: [
      'Research Paper Rubric with criteria for thesis, evidence, organization, and citations',
      'Presentation Rubric with criteria for content, delivery, and visuals',
    ],
    bestPractices: [
      'Align rubric criteria with learning objectives',
      'Use clear, descriptive language for each performance level',
      'Share rubric with students before assignment',
      'Include point values for each criterion',
    ],
  },
  {
    id: 'qm-template-7-support',
    name: 'Student Support Resources Page',
    description: 'Template for providing learner support resources (QM Standard 7)',
    standard: 7,
    specificReviewStandards: ['7.1', '7.2', '7.3', '7.4'],
    template: `# Student Support Resources

## Technical Support
- **IT Help Desk**: [Contact information]
- **LMS Support**: [Contact information]
- **Hours**: [Availability]

## Academic Support Services
- **Writing Center**: [Link and contact]
- **Tutoring Services**: [Link and contact]
- **Library Services**: [Link and contact]
- **Research Help**: [Link and contact]

## Accessibility Services
- **Disability Services**: [Contact information]
- **Accommodations**: [How to request]
- **Assistive Technology**: [Available resources]

## Student Wellness
- **Counseling Services**: [Contact information]
- **Health Services**: [Contact information]
- **Crisis Resources**: [24/7 contact]

## Additional Resources
- Career Services
- Financial Aid
- Academic Advising`,
    examples: [
      'Comprehensive resource page with embedded videos',
      'Quick reference card with key contacts',
    ],
    bestPractices: [
      'Keep contact information up to date',
      'Provide multiple ways to access support',
      'Include hours of operation',
      'Link to institutional resources',
    ],
  },
  {
    id: 'qm-template-8-accessibility',
    name: 'Accessibility Checklist',
    description: 'Checklist for ensuring course accessibility (QM Standard 8)',
    standard: 8,
    specificReviewStandards: ['8.1', '8.2', '8.3', '8.4', '8.5'],
    template: `# Course Accessibility Checklist

## Text and Documents
- [ ] All text is readable (minimum 12pt font)
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Documents are in accessible formats (Word, PDF/UA)
- [ ] Proper heading structure (H1, H2, H3)
- [ ] Descriptive link text (not "click here")

## Images and Graphics
- [ ] All images have alt text
- [ ] Complex images have long descriptions
- [ ] Decorative images marked as decorative
- [ ] Charts and graphs have text alternatives

## Videos and Audio
- [ ] All videos have captions
- [ ] Transcripts provided for audio content
- [ ] No flashing content (seizure risk)
- [ ] Audio descriptions for visual content

## Navigation and Usability
- [ ] Consistent navigation throughout course
- [ ] Course can be navigated with keyboard only
- [ ] Clear instructions for all activities
- [ ] Sufficient time for timed activities

## Course Materials
- [ ] Tables have proper headers
- [ ] Lists use proper formatting
- [ ] Color is not the only means of conveying information
- [ ] Forms have proper labels`,
    examples: [
      'Weekly accessibility review schedule',
      'Automated accessibility checker results',
    ],
    bestPractices: [
      'Check accessibility before publishing',
      'Use built-in accessibility checkers',
      'Test with assistive technologies',
      'Provide alternative formats upon request',
    ],
  },
];

/**
 * Analyze course content for QM compliance
 */
export function analyzeQMCompliance(content: string, documentType?: string): any {
  const analysis = {
    overallScore: 0,
    totalPoints: 101,
    percentageScore: 0,
    meetsThreshold: false,
    essentialStandardsMet: 0,
    totalEssentialStandards: 11,
    standards: [] as any[],
    criticalIssues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Standard 1: Course Overview and Introduction (16 points)
  const std1Score = analyzeStandard1(content);
  analysis.standards.push(std1Score);
  analysis.overallScore += std1Score.pointsEarned;

  // Standard 2: Learning Objectives (11 points)
  const std2Score = analyzeStandard2(content);
  analysis.standards.push(std2Score);
  analysis.overallScore += std2Score.pointsEarned;

  // Standard 3: Assessment and Measurement (15 points)
  const std3Score = analyzeStandard3(content);
  analysis.standards.push(std3Score);
  analysis.overallScore += std3Score.pointsEarned;

  // Standard 4: Instructional Materials (12 points)
  const std4Score = analyzeStandard4(content);
  analysis.standards.push(std4Score);
  analysis.overallScore += std4Score.pointsEarned;

  // Standard 5: Learning Activities (8 points)
  const std5Score = analyzeStandard5(content);
  analysis.standards.push(std5Score);
  analysis.overallScore += std5Score.pointsEarned;

  // Standard 6: Course Technology (9 points)
  const std6Score = analyzeStandard6(content);
  analysis.standards.push(std6Score);
  analysis.overallScore += std6Score.pointsEarned;

  // Standard 7: Learner Support (6 points)
  const std7Score = analyzeStandard7(content);
  analysis.standards.push(std7Score);
  analysis.overallScore += std7Score.pointsEarned;

  // Standard 8: Accessibility (11 points)
  const std8Score = analyzeStandard8(content);
  analysis.standards.push(std8Score);
  analysis.overallScore += std8Score.pointsEarned;

  // Calculate percentage
  analysis.percentageScore = Math.round((analysis.overallScore / analysis.totalPoints) * 100);
  analysis.meetsThreshold = analysis.percentageScore >= 85;

  // Count essential standards met
  analysis.essentialStandardsMet = analysis.standards.reduce((count, std) => {
    return count + std.essentialMet;
  }, 0);

  // Compile recommendations and issues
  analysis.standards.forEach(std => {
    if (std.issues && std.issues.length > 0) {
      analysis.criticalIssues.push(...std.issues);
    }
    if (std.recommendations && std.recommendations.length > 0) {
      analysis.recommendations.push(...std.recommendations);
    }
    if (std.strengths && std.strengths.length > 0) {
      analysis.strengths.push(...std.strengths);
    }
  });

  return analysis;
}

// Individual standard analysis functions
function analyzeStandard1(content: string) {
  const result = {
    standard: 1,
    name: 'Course Overview and Introduction',
    pointsPossible: 16,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for getting started information (SRS 1.1 - Essential, 3 points)
  if (/getting started|start here|begin|welcome/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Course includes getting started information');
  } else {
    result.issues.push('Missing "Getting Started" or "Start Here" section (Essential Standard 1.1)');
    result.recommendations.push('Add a "Start Here" module with clear instructions for beginning the course');
  }

  // Check for course structure/navigation (SRS 1.2 - Essential, 3 points)
  if (/navigation|course structure|module|week|schedule/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Course structure is explained');
  } else {
    result.issues.push('Course structure and navigation not clearly explained (Essential Standard 1.2)');
    result.recommendations.push('Include a section explaining how the course is organized');
  }

  // Other standards (10 points possible)
  if (/etiquette|netiquette|communication/i.test(content)) {
    result.pointsEarned += 2;
  }

  return result;
}

function analyzeStandard2(content: string) {
  const result = {
    standard: 2,
    name: 'Learning Objectives',
    pointsPossible: 11,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for course-level objectives (SRS 2.1 - Essential, 3 points)
  if (/learning objective|learning outcome|students will|learners will/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Course includes learning objectives');
  } else {
    result.issues.push('Course-level learning objectives not found (Essential Standard 2.1)');
    result.recommendations.push('Add clear, measurable course-level learning objectives');
  }

  // Check for module-level objectives (SRS 2.2 - Essential, 3 points)
  if (/module objective|unit objective|lesson objective/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
  } else {
    result.issues.push('Module-level objectives missing (Essential Standard 2.2)');
    result.recommendations.push('Include specific learning objectives for each module');
  }

  return result;
}

function analyzeStandard3(content: string) {
  const result = {
    standard: 3,
    name: 'Assessment and Measurement',
    pointsPossible: 15,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for grading policy (SRS 3.1 - Essential, 3 points)
  if (/grading|grade|assessment|points/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Grading policy is present');
  } else {
    result.issues.push('Grading policy not clearly stated (Essential Standard 3.1)');
    result.recommendations.push('Include a clear grading policy with point distributions');
  }

  // Check for rubrics (SRS 3.3 - Essential, 3 points)
  if (/rubric|criteria|scoring guide/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Assessment rubrics/criteria included');
  } else {
    result.issues.push('Assessment rubrics not found (Essential Standard 3.3)');
    result.recommendations.push('Provide rubrics or clear grading criteria for assignments');
  }

  return result;
}

function analyzeStandard4(content: string) {
  const result = {
    standard: 4,
    name: 'Instructional Materials',
    pointsPossible: 12,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for instructional materials (SRS 4.1 - Essential, 3 points)
  if (/reading|textbook|materials|resources/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Instructional materials are referenced');
  } else {
    result.issues.push('Instructional materials not clearly identified (Essential Standard 4.1)');
    result.recommendations.push('List required and supplementary instructional materials');
  }

  return result;
}

function analyzeStandard5(content: string) {
  const result = {
    standard: 5,
    name: 'Learning Activities and Interaction',
    pointsPossible: 8,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for learning activities (SRS 5.1 - Essential, 3 points)
  if (/activity|activities|discussion|assignment|project/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Learning activities are included');
  } else {
    result.issues.push('Learning activities not clearly described (Essential Standard 5.1)');
    result.recommendations.push('Describe learning activities that engage students with content');
  }

  return result;
}

function analyzeStandard6(content: string) {
  const result = {
    standard: 6,
    name: 'Course Technology',
    pointsPossible: 9,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for technology requirements (SRS 6.1 - Essential, 3 points)
  if (/technology|software|browser|hardware|system requirements/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Technology requirements are specified');
  } else {
    result.issues.push('Technology requirements not stated (Essential Standard 6.1)');
    result.recommendations.push('Specify required technology, software, and technical skills');
  }

  return result;
}

function analyzeStandard7(content: string) {
  const result = {
    standard: 7,
    name: 'Learner Support',
    pointsPossible: 6,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for support resources (no essential standards in Standard 7)
  if (/support|help|assistance|tutoring|library/i.test(content)) {
    result.pointsEarned += 2;
    result.strengths.push('Support resources are mentioned');
  } else {
    result.recommendations.push('Include information about learner support services');
  }

  return result;
}

function analyzeStandard8(content: string) {
  const result = {
    standard: 8,
    name: 'Accessibility and Usability',
    pointsPossible: 11,
    pointsEarned: 0,
    essentialMet: 0,
    issues: [] as string[],
    recommendations: [] as string[],
    strengths: [] as string[],
  };

  // Check for accessibility statement (SRS 8.1 - Essential, 3 points)
  if (/accessibility|accommodation|disability|wcag/i.test(content)) {
    result.pointsEarned += 3;
    result.essentialMet += 1;
    result.strengths.push('Accessibility considerations are addressed');
  } else {
    result.issues.push('Accessibility statement not found (Essential Standard 8.1)');
    result.recommendations.push('Include accessibility statement and accommodation information');
  }

  return result;
}
