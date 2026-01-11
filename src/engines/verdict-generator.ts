import { ScoredOption, Verdict, ConfidenceLevel } from '../models/verdict';
import { TechnicalOption } from '../models/technical-option';

export class VerdictGenerator {
  
  generateVerdict(scoredOptions: ScoredOption[], allOptions: TechnicalOption[]): Verdict {
    // TODO: Implement verdict-first logic
    // 1. Select highest scoring option as recommendation
    // 2. Calculate confidence based on score difference
    // 3. Generate one-sentence rationale
    // 4. Add alternative consideration for low confidence cases
    
    if (scoredOptions.length === 0) {
      throw new Error("No options to evaluate");
    }
    
    // TODO: Sort options by score and select winner
    const winner = scoredOptions[0];
    const runnerUp = scoredOptions.length > 1 ? scoredOptions[1] : null;
    
    // TODO: Calculate confidence level
    const confidence = this.calculateConfidence(winner, runnerUp);
    
    // TODO: Generate rationale based on winner's top strengths
    const rationale = this.generateRationale(winner, allOptions);
    
    // TODO: Add alternative consideration for low confidence
    const alternativeConsideration = confidence === ConfidenceLevel.LOW 
      ? this.generateAlternativeConsideration(runnerUp, allOptions)
      : undefined;
    
    return {
      recommendedOption: winner.optionId,
      confidence,
      rationale,
      alternativeConsideration
    };
  }
  
  private calculateConfidence(winner: ScoredOption, runnerUp: ScoredOption | null): ConfidenceLevel {
    // TODO: Implement confidence calculation
    // - HIGH: score difference > 15 points
    // - MEDIUM: score difference 5-15 points  
    // - LOW: score difference < 5 points
    return ConfidenceLevel.MEDIUM;
  }
  
  private generateRationale(winner: ScoredOption, allOptions: TechnicalOption[]): string {
    // TODO: Generate one-sentence rationale based on winner's top strength
    // Example: "Flask is recommended due to its minimal learning curve and high demo reliability."
    return `${winner.optionId} is recommended for hackathon constraints.`;
  }
  
  private generateAlternativeConsideration(runnerUp: ScoredOption | null, allOptions: TechnicalOption[]): string {
    // TODO: Generate alternative consideration for close calls
    // Example: "Consider FastAPI if your team has strong async Python experience."
    return runnerUp ? `Consider ${runnerUp.optionId} as an alternative.` : "";
  }
}