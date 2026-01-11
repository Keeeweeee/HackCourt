export interface HackathonContext {
  teamSize: number;
  hackathonDuration: number; // hours
  teamSkills: string[]; // e.g., ["python", "javascript", "react"]
  demoRequirements: string[]; // e.g., ["web interface", "live demo"]
  judgingCriteria: string[]; // e.g., ["innovation", "technical complexity"]
}

export class ContextBuilder {
  private context: Partial<HackathonContext> = {};

  setTeamSize(size: number): ContextBuilder {
    this.context.teamSize = size;
    return this;
  }

  setDuration(hours: number): ContextBuilder {
    this.context.hackathonDuration = hours;
    return this;
  }

  setSkills(skills: string[]): ContextBuilder {
    this.context.teamSkills = skills;
    return this;
  }

  setDemoRequirements(requirements: string[]): ContextBuilder {
    this.context.demoRequirements = requirements;
    return this;
  }

  setJudgingCriteria(criteria: string[]): ContextBuilder {
    this.context.judgingCriteria = criteria;
    return this;
  }

  build(): HackathonContext {
    // TODO: Add validation to ensure all required fields are present
    return this.context as HackathonContext;
  }
}