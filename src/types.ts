export interface BrandKit {
  id: string;
  name: string;
  organization: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  fonts: {
    headings: string[];
    body: string[];
  };
  logos: {
    name: string;
    url?: string;
    description: string;
  }[];
  guidelines: {
    spacing: string;
    accessibility: string;
    imagery: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseLayoutTemplate {
  id: string;
  name: string;
  description: string;
  category: 'syllabus' | 'assignment' | 'module' | 'assessment' | 'general';
  structure: {
    sections: string[];
    requiredElements: string[];
    optionalElements: string[];
  };
  accessibilityFeatures: string[];
  bestPractices: string[];
}

export interface DocumentAnalysis {
  accessibility: {
    score: number;
    issues: {
      severity: 'critical' | 'warning' | 'info';
      description: string;
      recommendation: string;
    }[];
  };
  branding: {
    score: number;
    issues: {
      type: 'color' | 'font' | 'logo' | 'spacing';
      description: string;
      recommendation: string;
    }[];
  };
  layout: {
    score: number;
    suggestions: string[];
  };
  qualityMatters?: QualityMattersAnalysis;
}

export interface QualityMattersAnalysis {
  overallScore: number;
  totalPoints: number;
  maxPoints: number;
  passesEssentialStandards: boolean;
  meetsThreshold: boolean; // 85% or higher
  standardScores: {
    standard1: StandardScore; // Course Overview
    standard2: StandardScore; // Learning Objectives
    standard3: StandardScore; // Assessment
    standard4: StandardScore; // Materials
    standard5: StandardScore; // Activities
    standard6: StandardScore; // Technology
    standard7: StandardScore; // Support
    standard8: StandardScore; // Accessibility
  };
  recommendations: string[];
  strengths: string[];
  criticalIssues: string[];
}

export interface StandardScore {
  name: string;
  pointsEarned: number;
  pointsPossible: number;
  percentage: number;
  essentialsMet: boolean;
  specificReviews: SpecificReviewResult[];
}

export interface SpecificReviewResult {
  number: string; // e.g., "1.1", "2.1"
  description: string;
  pointsPossible: number;
  pointsEarned: number;
  isEssential: boolean;
  met: boolean;
  feedback: string;
}

export interface QMTemplate {
  id: string;
  name: string;
  description: string;
  standard: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  specificReviewStandards: string[];
  template: string;
  examples: string[];
  bestPractices: string[];
}
