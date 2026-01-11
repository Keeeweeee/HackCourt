export enum LearningCurve {
  MINIMAL = "minimal",
  MODERATE = "moderate", 
  STEEP = "steep"
}

export interface TechnicalOption {
  id: string;
  name: string;
  description: string;
  learningCurve: LearningCurve;
  timeToImplementation: number; // hours estimate
  demoReliability: number; // 1-10 scale
  integrationComplexity: number; // 1-10 scale
  visualImpact: number; // 1-10 scale for demo appeal
  requiredSkills: string[]; // e.g., ["python", "sql"]
}

// Predefined options for Flask vs FastAPI comparison
export const FLASK_OPTION: TechnicalOption = {
  id: "flask",
  name: "Flask",
  description: "Lightweight Python web framework",
  learningCurve: LearningCurve.MINIMAL,
  timeToImplementation: 4,
  demoReliability: 8,
  integrationComplexity: 3,
  visualImpact: 6,
  requiredSkills: ["python", "html"]
};

export const FASTAPI_OPTION: TechnicalOption = {
  id: "fastapi",
  name: "FastAPI",
  description: "Modern Python API framework with automatic docs",
  learningCurve: LearningCurve.MODERATE,
  timeToImplementation: 6,
  demoReliability: 7,
  integrationComplexity: 5,
  visualImpact: 9,
  requiredSkills: ["python", "async", "pydantic"]
};