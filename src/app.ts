import { DecisionEngine } from './engines/decision-engine';
import { VerdictGenerator } from './engines/verdict-generator';
import { CourtroomAnalyzer } from './engines/courtroom-analyzer';
import { ReliabilityJudge } from './judges/reliability-judge';
import { DemoJudge } from './judges/demo-judge';
import { FLASK_OPTION, FASTAPI_OPTION } from './models/technical-option';
import { ContextBuilder } from './models/hackathon-context';

export class HackCourtApp {
  private decisionEngine = new DecisionEngine();
  private verdictGenerator = new VerdictGenerator();
  private courtroomAnalyzer = new CourtroomAnalyzer();
  private reliabilityJudge = new ReliabilityJudge();
  private demoJudge = new DemoJudge();
  
  // Main decision flow - VERDICT FIRST approach
  makeDecision(judgeType: 'reliability' | 'demo', contextData: any) {
    // TODO: Implement complete decision flow
    // 1. Build context from input data
    // 2. Select appropriate judge
    // 3. Analyze options using decision engine
    // 4. Generate verdict FIRST
    // 5. Create courtroom analysis for detailed explanation
    
    const context = new ContextBuilder()
      .setTeamSize(contextData.teamSize)
      .setDuration(contextData.duration)
      .setSkills(contextData.skills)
      .setDemoRequirements(contextData.demoRequirements)
      .setJudgingCriteria(contextData.judgingCriteria)
      .build();
    
    const judge = judgeType === 'reliability' ? this.reliabilityJudge : this.demoJudge;
    const options = [FLASK_OPTION, FASTAPI_OPTION];
    
    // TODO: Execute analysis
    const scoredOptions = this.decisionEngine.analyzeOptions(options, context, judge);
    
    // TODO: Generate verdict FIRST (this is the key requirement)
    const verdict = this.verdictGenerator.generateVerdict(scoredOptions, options);
    
    // TODO: Create courtroom presentation
    const openingStatements = this.courtroomAnalyzer.generateOpeningStatements(options);
    const exhibits = this.courtroomAnalyzer.presentEvidence(scoredOptions, options);
    const objections = this.courtroomAnalyzer.raiseObjections(scoredOptions, options);
    const closingArgument = this.courtroomAnalyzer.deliverClosingArgument(verdict, scoredOptions);
    
    return {
      verdict, // FIRST - immediate recommendation
      analysis: {
        openingStatements,
        exhibits,
        objections,
        closingArgument
      }
    };
  }
}

// Example usage - remove this when adding proper web interface
if (require.main === module) {
  console.log('🏛️  Starting Hack Court - Technical Decision Assistant');
  
  const app = new HackCourtApp();
  
  // Example decision scenario
  const exampleContext = {
    teamSize: 3,
    duration: 48, // 48-hour hackathon
    skills: ['python', 'javascript', 'react'],
    demoRequirements: ['web interface', 'live demo'],
    judgingCriteria: ['innovation', 'technical complexity', 'presentation']
  };
  
  console.log('\n📋 Analyzing technical options for hackathon scenario...');
  console.log('Team Size:', exampleContext.teamSize);
  console.log('Duration:', exampleContext.duration, 'hours');
  console.log('Skills:', exampleContext.skills.join(', '));
  
  try {
    const result = app.makeDecision('reliability', exampleContext);
    console.log('\n⚖️  VERDICT:', result.verdict);
    console.log('\n📊 Analysis completed successfully!');
    console.log('Use the web interface at public/index.html for interactive decisions.');
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}