export enum ConfidenceLevel {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export interface Verdict {
  recommendedOption: string; // option id
  confidence: ConfidenceLevel;
  rationale: string; // one-sentence explanation
  alternativeConsideration?: string; // for low confidence cases
}

export interface ScoredOption {
  optionId: string;
  totalScore: number;
  factorScores: {
    timeToImplementation: number;
    teamSkillAlignment: number;
    demoReliability: number;
    learningCurve: number;
    integrationComplexity: number;
    visualImpact: number;
  };
  strengths: string[];
  weaknesses: string[];
}