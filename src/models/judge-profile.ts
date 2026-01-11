export interface DecisionWeights {
  timeToImplementation: number;
  teamSkillAlignment: number;
  demoReliability: number;
  learningCurve: number;
  integrationComplexity: number;
  visualImpact: number;
}

export abstract class JudgeProfile {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly weights: DecisionWeights;

  // TODO: Implement scoring logic that applies weights to technical options
  abstract scoreOption(option: any, context: any): number;
}