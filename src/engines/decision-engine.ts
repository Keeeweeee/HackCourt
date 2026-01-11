import { TechnicalOption } from '../models/technical-option';
import { HackathonContext } from '../models/hackathon-context';
import { JudgeProfile } from '../models/judge-profile';
import { ScoredOption } from '../models/verdict';

export class DecisionEngine {
  
  analyzeOptions(
    options: TechnicalOption[], 
    context: HackathonContext, 
    judge: JudgeProfile
  ): ScoredOption[] {
    // TODO: Implement core analysis logic
    // 1. Score each option using the judge's scoreOption method
    // 2. Calculate individual factor scores for transparency
    // 3. Identify strengths and weaknesses for each option
    // 4. Return sorted array of scored options (highest score first)
    
    const scoredOptions: ScoredOption[] = [];
    
    for (const option of options) {
      // TODO: Calculate total score using judge.scoreOption()
      const totalScore = 0;
      
      // TODO: Calculate individual factor scores for transparency
      const factorScores = {
        timeToImplementation: 0,
        teamSkillAlignment: 0,
        demoReliability: 0,
        learningCurve: 0,
        integrationComplexity: 0,
        visualImpact: 0
      };
      
      // TODO: Determine strengths and weaknesses based on scores
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      scoredOptions.push({
        optionId: option.id,
        totalScore,
        factorScores,
        strengths,
        weaknesses
      });
    }
    
    // TODO: Sort by total score (descending)
    return scoredOptions;
  }
  
  private calculateTeamSkillAlignment(option: TechnicalOption, context: HackathonContext): number {
    // TODO: Calculate percentage of required skills that team has
    // Return value between 0-10
    return 0;
  }
  
  private calculateLearningCurveScore(option: TechnicalOption): number {
    // TODO: Convert learning curve enum to numeric score
    // MINIMAL = 10, MODERATE = 6, STEEP = 2
    return 0;
  }
}