import { JudgeProfile, DecisionWeights } from '../models/judge-profile';
import { TechnicalOption } from '../models/technical-option';
import { HackathonContext } from '../models/hackathon-context';

export class DemoJudge extends JudgeProfile {
  readonly name = "Demo-Focused Judge";
  readonly description = "Prioritizes visual impact, presentation value, and quick demo setup";
  
  readonly weights: DecisionWeights = {
    visualImpact: 0.3,
    timeToImplementation: 0.25,
    demoReliability: 0.2,
    teamSkillAlignment: 0.15,
    learningCurve: 0.1,
    integrationComplexity: 0.0
  };

  scoreOption(option: TechnicalOption, context: HackathonContext): number {
    // TODO: Implement scoring logic
    // - Calculate team skill alignment based on context.teamSkills vs option.requiredSkills
    // - Apply weights to each factor
    // - Return total score (0-100 scale)
    return 0;
  }
}