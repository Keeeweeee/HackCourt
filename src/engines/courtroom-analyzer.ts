import { ScoredOption, Verdict } from '../models/verdict';
import { TechnicalOption } from '../models/technical-option';

export interface OpeningStatement {
  optionName: string;
  promise: string;
  keyStrengths: string[];
}

export interface Exhibit {
  title: string;
  evidence: string;
  supportedOption: string;
}

export interface Objection {
  targetOption: string;
  concern: string;
  severity: "minor" | "moderate" | "major";
}

export interface ClosingArgument {
  summary: string;
  verdictReinforcement: string;
}

export class CourtroomAnalyzer {
  
  generateOpeningStatements(options: TechnicalOption[]): OpeningStatement[] {
    // TODO: Create compelling opening statements for each option
    // Focus on their main value proposition for hackathons
    
    const statements: OpeningStatement[] = [];
    
    for (const option of options) {
      // TODO: Generate promise and key strengths based on option characteristics
      statements.push({
        optionName: option.name,
        promise: `${option.name} promises to deliver...`, // TODO: Complete based on option strengths
        keyStrengths: [] // TODO: Extract from option properties
      });
    }
    
    return statements;
  }
  
  presentEvidence(scoredOptions: ScoredOption[], allOptions: TechnicalOption[]): Exhibit[] {
    // TODO: Create exhibits that demonstrate key trade-offs
    // Focus on the most significant differences between options
    
    const exhibits: Exhibit[] = [];
    
    // TODO: Compare time-to-implementation
    // TODO: Compare team skill alignment
    // TODO: Compare demo reliability
    // TODO: Highlight the most critical trade-offs
    
    return exhibits;
  }
  
  raiseObjections(scoredOptions: ScoredOption[], allOptions: TechnicalOption[]): Objection[] {
    // TODO: Identify weaknesses in each option
    // Present them as courtroom objections
    
    const objections: Objection[] = [];
    
    for (const scored of scoredOptions) {
      // TODO: Convert weaknesses to objections
      for (const weakness of scored.weaknesses) {
        objections.push({
          targetOption: scored.optionId,
          concern: weakness,
          severity: "moderate" // TODO: Calculate based on impact
        });
      }
    }
    
    return objections;
  }
  
  deliverClosingArgument(verdict: Verdict, scoredOptions: ScoredOption[]): ClosingArgument {
    // TODO: Create closing argument that reinforces the verdict
    // Summarize the key reasons for the recommendation
    
    return {
      summary: "Based on the evidence presented...", // TODO: Summarize key factors
      verdictReinforcement: `Therefore, ${verdict.recommendedOption} is the clear choice.` // TODO: Reinforce verdict
    };
  }
}