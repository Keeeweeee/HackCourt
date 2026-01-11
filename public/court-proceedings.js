// Court Proceedings - Legal Counsel for Technical Decisions

// MODE CONTRACTS AND VALIDATION
// Strict separation between Compare and Advisory modes to prevent output contamination

// Mode contract validation
function validateModeContract(caseType, result) {
    console.log('Validating mode contract for:', caseType, result);
    
    if (caseType === 'compare') {
        // Compare mode MUST NOT have advisory-specific properties
        if (result.recommendedStack || result.stack || result.consultation) {
            throw new Error(`CONTAMINATION ERROR: Advisory output detected in Compare mode. Found: ${Object.keys(result).join(', ')}`);
        }
        
        // Compare mode MUST have required properties
        if (!result.winner || !result.reasoning || !result.evidence) {
            throw new Error(`INVALID COMPARE OUTPUT: Missing required properties. Expected: winner, reasoning, evidence`);
        }
        
        // Winner must be Option A or Option B
        if (!['Option A', 'Option B'].includes(result.winner)) {
            throw new Error(`INVALID COMPARE WINNER: Must be "Option A" or "Option B", got: ${result.winner}`);
        }
        
        console.log('✅ Compare mode contract validated');
        
    } else if (caseType === 'counsel') {
        // Advisory mode MUST NOT have compare-specific properties  
        if (result.winner && ['Option A', 'Option B'].includes(result.winner)) {
            throw new Error(`CONTAMINATION ERROR: Compare output detected in Advisory mode. Found winner: ${result.winner}`);
        }
        
        // Advisory mode MUST have required properties
        if (!result.stack || !result.stack.name || !result.stack.components) {
            throw new Error(`INVALID ADVISORY OUTPUT: Missing required stack properties. Expected: stack.name, stack.components`);
        }
        
        console.log('✅ Advisory mode contract validated');
        
    } else {
        throw new Error(`UNKNOWN CASE TYPE: ${caseType}. Must be 'compare' or 'counsel'`);
    }
}

// Strict case type enforcement
function enforceCaseType(expectedType) {
    if (currentCase.type !== expectedType) {
        throw new Error(`MODE VIOLATION: Expected ${expectedType}, but currentCase.type is ${currentCase.type}`);
    }
}

// Scroll-to-top helper function
function scrollToTopInstant() {
    window.scrollTo({ top: 0, behavior: 'auto' });
}

// Current case state
let currentCase = {
    type: 'compare', // 'compare' | 'counsel'
    judge: 'reliability', // 'reliability' | 'demo'
    data: null,
    activeTab: 'home' // 'home' | 'compare' | 'counsel' | 'precedents'
};

// Judge configurations with legal terminology
const judgeProfiles = {
    reliability: {
        name: "Hon. Justice Reliability",
        specialty: "Stability & Proven Solutions",
        philosophy: "The court prioritizes proven solutions and minimal risk to ensure project success.",
        weights: {
            stability: 0.35,
            learningCurve: 0.25,
            teamAlignment: 0.20,
            timeToImplementation: 0.15,
            visualImpact: 0.05
        }
    },
    demo: {
        name: "Hon. Justice Innovation", 
        specialty: "Impact & Presentation",
        philosophy: "The court values innovation and presentation impact for maximum demonstration effect.",
        weights: {
            visualImpact: 0.35,
            demoAppeal: 0.25,
            timeToDemo: 0.20,
            innovation: 0.15,
            stability: 0.05
        }
    }
};

// Scroll-triggered Animation System using IntersectionObserver
class ScrollAnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.initializeObserver();
    }
    
    initializeObserver() {
        // Create intersection observer with proper threshold
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    // Disconnect observer for this element (run only once)
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        console.log('ScrollAnimationController: IntersectionObserver initialized');
    }
    
    animateElement(element) {
        console.log('ScrollAnimationController: Animating element', element.className);
        
        // Add visible class to trigger CSS transition
        element.classList.add('reveal-visible');
        
        // Handle staggered children if they exist
        const children = element.querySelectorAll('.reveal');
        if (children.length > 0) {
            children.forEach((child, index) => {
                // Add stagger class based on index
                const staggerClass = `reveal-stagger-${Math.min(index + 1, 6)}`;
                child.classList.add(staggerClass);
                
                // Trigger child animation after parent starts
                setTimeout(() => {
                    child.classList.add('reveal-visible');
                }, 50 + (index * 80));
            });
        }
    }
    
    observeElement(element) {
        if (element && !this.animatedElements.has(element)) {
            element.classList.add('reveal');
            this.observer.observe(element);
            console.log('ScrollAnimationController: Observing element', element.className);
        }
    }
    
    observeElements(elements) {
        elements.forEach(element => this.observeElement(element));
    }
    
    reset() {
        // Reset for new case presentations
        this.animatedElements.clear();
        console.log('ScrollAnimationController: Reset for new case');
    }
}

// Global animation controller instance
let scrollAnimationController = null;
const compareDecisionEngine = {
    // Main decision logic for compare mode using MCQs as primary constraints
    makeDecision(context, optionA, optionB, judge) {
        const { duration, teamSize, skillLevel, primaryGoal } = context;
        
        // Risk assessment based on MCQs
        const isHighRisk = (duration <= 24 && skillLevel === 'beginner') ||
                          (duration <= 36 && skillLevel === 'beginner' && teamSize === 'solo');
        
        const isLowRisk = (duration >= 48 && skillLevel === 'advanced') ||
                         (duration >= 36 && skillLevel === 'intermediate' && teamSize !== 'solo');

        let winner, confidence, reasoning, warnings = [];

        if (judge === 'reliability') {
            // Hon. Justice Reliability - Risk-averse, proven solutions
            if (isHighRisk) {
                // Always choose the simpler/safer option for high-risk scenarios
                winner = this.selectSaferOption(optionA, optionB);
                confidence = 'high';
                reasoning = `The court strongly favors the safer technical approach given the high-risk constraints (${skillLevel} skill level, ${duration}-hour timeline, ${teamSize} team). Proven stability takes precedence over innovation.`;
                
                if (primaryGoal === 'demo-first') {
                    warnings.push("The court advises against demo-first goals given current risk factors");
                }
            } else if (skillLevel === 'beginner' || duration <= 24) {
                winner = this.selectSaferOption(optionA, optionB);
                confidence = 'high';
                reasoning = `The court recommends the more established option to minimize learning overhead and implementation risk within the ${duration}-hour constraint.`;
            } else if (primaryGoal === 'production-leaning' && skillLevel === 'advanced') {
                winner = this.selectMoreRobustOption(optionA, optionB);
                confidence = 'high';
                reasoning = `Given advanced skill level and production-leaning goals, the court favors the option with superior architectural foundations and long-term maintainability.`;
            } else {
                winner = this.selectBalancedOption(optionA, optionB, 'stability');
                confidence = 'medium';
                reasoning = `The court finds both options viable but leans toward the approach offering better stability-to-complexity ratio for intermediate constraints.`;
            }
        } else {
            // Hon. Justice Innovation - Demo-first bias, allows complexity
            if (primaryGoal === 'demo-first' && skillLevel !== 'beginner') {
                winner = this.selectMoreInnovativeOption(optionA, optionB);
                confidence = skillLevel === 'advanced' ? 'high' : 'medium';
                reasoning = `The court prioritizes demonstration impact and innovation. The selected option provides superior visual appeal and presentation capabilities for ${skillLevel} teams.`;
                
                if (duration <= 24 && skillLevel === 'intermediate') {
                    warnings.push("The court cautions that this ambitious approach requires careful time management");
                    confidence = 'medium';
                }
            } else if (primaryGoal === 'production-leaning') {
                winner = this.selectMoreRobustOption(optionA, optionB);
                confidence = 'high';
                reasoning = `Despite innovation focus, the court recognizes production-leaning goals require architectural sophistication and long-term viability.`;
            } else if (isHighRisk) {
                winner = this.selectSaferOption(optionA, optionB);
                confidence = 'medium';
                reasoning = `The court reluctantly recommends the safer option due to high-risk constraints, though this limits demonstration potential.`;
                warnings.push("Consider focusing on core functionality over visual impact given constraints");
            } else {
                winner = this.selectBalancedOption(optionA, optionB, 'innovation');
                confidence = 'high';
                reasoning = `The court balances innovation potential with practical constraints, favoring the option with better demonstration capabilities while maintaining feasibility.`;
            }
        }

        // Generate evidence based on decision
        const evidence = this.generateEvidence(context, winner, optionA, optionB, judge);

        return {
            winner,
            confidence,
            reasoning,
            warnings,
            evidence
        };
    },

    // Heuristic functions to select options based on criteria
    selectSaferOption(optionA, optionB) {
        // Simple heuristic: look for keywords indicating stability/simplicity
        const safeKeywords = ['flask', 'simple', 'basic', 'minimal', 'proven', 'stable', 'vanilla', 'html', 'css'];
        const complexKeywords = ['fastapi', 'react', 'vue', 'angular', 'typescript', 'async', 'microservice', 'docker'];
        
        const aScore = this.scoreOptionSafety(optionA, safeKeywords, complexKeywords);
        const bScore = this.scoreOptionSafety(optionB, safeKeywords, complexKeywords);
        
        return aScore >= bScore ? 'Option A' : 'Option B';
    },

    selectMoreInnovativeOption(optionA, optionB) {
        // Look for modern/innovative keywords
        const innovativeKeywords = ['fastapi', 'react', 'vue', 'typescript', 'async', 'modern', 'latest', 'cutting-edge', 'ai', 'ml'];
        const traditionalKeywords = ['flask', 'jquery', 'vanilla', 'basic', 'simple', 'traditional'];
        
        const aScore = this.scoreOptionInnovation(optionA, innovativeKeywords, traditionalKeywords);
        const bScore = this.scoreOptionInnovation(optionB, innovativeKeywords, traditionalKeywords);
        
        return aScore >= bScore ? 'Option A' : 'Option B';
    },

    selectMoreRobustOption(optionA, optionB) {
        // Look for architecture/robustness keywords
        const robustKeywords = ['typescript', 'architecture', 'scalable', 'enterprise', 'testing', 'ci/cd', 'database', 'api'];
        const simpleKeywords = ['simple', 'basic', 'minimal', 'quick', 'prototype'];
        
        const aScore = this.scoreOptionRobustness(optionA, robustKeywords, simpleKeywords);
        const bScore = this.scoreOptionRobustness(optionB, robustKeywords, simpleKeywords);
        
        return aScore >= bScore ? 'Option A' : 'Option B';
    },

    selectBalancedOption(optionA, optionB, bias) {
        // Balanced selection with slight bias
        if (bias === 'stability') {
            return this.selectSaferOption(optionA, optionB);
        } else {
            return this.selectMoreInnovativeOption(optionA, optionB);
        }
    },

    // Scoring helper functions
    scoreOptionSafety(option, safeKeywords, complexKeywords) {
        const text = option.toLowerCase();
        let score = 0;
        
        safeKeywords.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        
        complexKeywords.forEach(keyword => {
            if (text.includes(keyword)) score -= 1;
        });
        
        return score;
    },

    scoreOptionInnovation(option, innovativeKeywords, traditionalKeywords) {
        const text = option.toLowerCase();
        let score = 0;
        
        innovativeKeywords.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        
        traditionalKeywords.forEach(keyword => {
            if (text.includes(keyword)) score -= 1;
        });
        
        return score;
    },

    scoreOptionRobustness(option, robustKeywords, simpleKeywords) {
        const text = option.toLowerCase();
        let score = 0;
        
        robustKeywords.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        
        simpleKeywords.forEach(keyword => {
            if (text.includes(keyword)) score -= 1;
        });
        
        return score;
    },

    generateEvidence(context, winner, optionA, optionB, judge) {
        const { duration, skillLevel, primaryGoal } = context;
        const loser = winner === 'Option A' ? 'Option B' : 'Option A';
        
        return [
            {
                id: "A",
                title: "Constraint-Technology Alignment",
                explanation: `${winner} demonstrates superior alignment with ${duration}-hour timeline and ${skillLevel} skill level constraints.`,
                beneficiary: winner,
                advantage: "winner"
            },
            {
                id: "B", 
                title: judge === 'reliability' ? "Risk Assessment" : "Innovation Potential",
                explanation: judge === 'reliability' ? 
                    `${winner} presents lower implementation risk while maintaining development velocity.` :
                    `${winner} offers superior demonstration impact and presentation capabilities.`,
                beneficiary: winner,
                advantage: "winner"
            },
            {
                id: "C",
                title: "Goal Optimization",
                explanation: `The selected approach prioritizes ${primaryGoal} objectives while accounting for practical implementation constraints.`,
                beneficiary: winner,
                advantage: winner === 'Option A' ? "winner" : "runner-up"
            }
        ];
    }
};

// Deterministic Advisory Decision Engine
const advisoryDecisionEngine = {
    // Normalized stack definitions
    stacks: {
        rapidPrototype: {
            name: "Rapid Prototype Stack",
            components: [
                "Static HTML/CSS/JavaScript frontend",
                "Serverless functions (Vercel/Netlify)",
                "Third-party APIs for data",
                "Simple deployment"
            ],
            description: "Minimal custom code with maximum external service leverage"
        },
        flaskSimple: {
            name: "Flask + Simple Frontend Stack",
            components: [
                "Flask API backend",
                "HTML/CSS/JavaScript frontend",
                "SQLite database",
                "Simple deployment"
            ],
            description: "Proven Python stack with minimal complexity"
        },
        expressStatic: {
            name: "Express + Static Frontend Stack",
            components: [
                "Express.js API backend",
                "Static HTML/CSS/JS frontend",
                "JSON file storage",
                "Node.js deployment"
            ],
            description: "Familiar JavaScript stack with low deployment complexity"
        },
        balancedModern: {
            name: "Balanced Modern Stack",
            components: [
                "React or Vue.js frontend",
                "Node.js or Python backend",
                "REST API architecture",
                "Simple database (SQLite/PostgreSQL)"
            ],
            description: "Modern but proven technologies with good documentation"
        },
        demoImpact: {
            name: "Demo-Impact Stack",
            components: [
                "Next.js or Nuxt.js framework",
                "Modern UI library (Tailwind CSS)",
                "API backend with real-time features",
                "Cloud deployment (Vercel/Netlify)"
            ],
            description: "Cutting-edge technologies optimized for presentation impact"
        },
        productionLeaning: {
            name: "Production-Leaning Stack",
            components: [
                "TypeScript frontend framework",
                "Structured backend architecture",
                "Proper database design",
                "Testing and CI/CD setup"
            ],
            description: "Enterprise-ready approach with clear separation of concerns"
        }
    },

    // Main decision logic
    makeDecision(context, judge) {
        const { duration, teamSize, skillLevel, primaryGoal } = context;
        
        // Risk factors assessment
        const isHighRisk = (duration <= 24 && skillLevel === 'beginner') ||
                          (duration <= 36 && skillLevel === 'beginner' && teamSize === 'solo');
        
        const isLowRisk = (duration >= 48 && skillLevel === 'advanced') ||
                         (duration >= 36 && skillLevel === 'intermediate' && teamSize !== 'solo');

        let recommendedStack;
        let confidence = 'high';
        let warnings = [];
        let rejectedAlternatives = [];

        if (judge === 'reliability') {
            // Hon. Justice Reliability - Risk-averse, proven solutions
            if (isHighRisk || (skillLevel === 'beginner' && duration <= 36)) {
                recommendedStack = this.stacks.rapidPrototype;
                if (primaryGoal === 'production-leaning') {
                    warnings.push("The court strongly advises against production-leaning goals given current constraints");
                }
            } else if (skillLevel === 'beginner' || duration <= 24) {
                recommendedStack = this.stacks.flaskSimple;
            } else if (primaryGoal === 'production-leaning' || (skillLevel === 'advanced' && duration >= 48)) {
                recommendedStack = this.stacks.productionLeaning;
            } else if (skillLevel === 'intermediate' && duration >= 36) {
                recommendedStack = this.stacks.balancedModern;
            } else {
                recommendedStack = this.stacks.expressStatic;
            }

            // Reliability judge rejections
            rejectedAlternatives = [
                { name: "Cutting-edge frameworks", reason: "Unproven stability for hackathon timeline" },
                { name: "Complex microservices", reason: "Excessive architectural complexity" },
                { name: "Experimental technologies", reason: "High risk of unexpected issues" }
            ];

        } else {
            // Hon. Justice Innovation - Demo-first bias, allows complexity
            if (primaryGoal === 'demo-first' && skillLevel !== 'beginner') {
                recommendedStack = this.stacks.demoImpact;
                if (duration <= 24 && skillLevel === 'intermediate') {
                    warnings.push("The court cautions that this ambitious approach requires careful time management");
                    confidence = 'medium';
                }
                if (duration <= 24 && teamSize === 'solo') {
                    warnings.push("Solo development with demo-impact stack under 24 hours presents significant execution risk");
                    confidence = 'low';
                }
            } else if (primaryGoal === 'production-leaning') {
                recommendedStack = this.stacks.productionLeaning;
            } else if (skillLevel === 'advanced' && duration >= 36) {
                recommendedStack = this.stacks.balancedModern;
            } else if (isHighRisk) {
                recommendedStack = this.stacks.rapidPrototype;
                warnings.push("The court recommends focusing on core functionality over visual impact given constraints");
            } else {
                recommendedStack = this.stacks.expressStatic;
            }

            // Innovation judge rejections
            rejectedAlternatives = [
                { name: "Legacy technologies", reason: "Limited demonstration impact and reduced judge engagement" },
                { name: "Purely functional approaches", reason: "Insufficient visual appeal for presentation-focused evaluation" },
                { name: "Minimal UI frameworks", reason: "Reduced capacity for impressive user experience demonstration" }
            ];
        }

        // Generate evidence based on decision
        const evidence = this.generateEvidence(context, recommendedStack, judge);
        
        // Ensure exactly 3 evidence items (safety check)
        if (evidence.length !== 3) {
            console.warn('Advisory Engine: Evidence count mismatch, padding to 3 items');
            while (evidence.length < 3) {
                const evidenceId = String.fromCharCode(65 + evidence.length);
                evidence.push({
                    id: evidenceId,
                    title: "Additional Evidence",
                    explanation: `${recommendedStack.name} provides additional benefits for the given constraints.`,
                    beneficiary: recommendedStack.name,
                    advantage: "winner"
                });
            }
            if (evidence.length > 3) {
                evidence.splice(3);
            }
        }

        return {
            stack: recommendedStack,
            confidence,
            warnings,
            rejectedAlternatives,
            evidence,
            reasoning: this.generateReasoning(context, recommendedStack, judge)
        };
    },

    generateReasoning(context, stack, judge) {
        const { duration, teamSize, skillLevel, primaryGoal } = context;
        
        const judgePhilosophy = judge === 'reliability' ? 
            "prioritizing proven stability and minimal risk" :
            "emphasizing demonstration impact and technical innovation";
            
        const contextFactors = [
            `${duration}-hour timeline`,
            `${teamSize} team`,
            `${skillLevel} skill level`,
            `${primaryGoal} approach`
        ].join(', ');
        
        return `The court finds that ${stack.name} optimally balances project requirements with team constraints (${contextFactors}), ${judgePhilosophy}. This approach leverages ${stack.components.slice(0, 2).join(' and ')} to deliver ${stack.description.toLowerCase()}.`;
    },

    generateEvidence(context, recommendedStack, judge) {
        const { duration, skillLevel, primaryGoal } = context;
        
        return [
            {
                id: "A",
                title: "Technology-Constraint Alignment",
                explanation: `${recommendedStack.name} aligns optimally with ${duration}-hour timeline and ${skillLevel} skill level constraints.`,
                beneficiary: recommendedStack.name,
                advantage: "winner"
            },
            {
                id: "B", 
                title: "Risk-Benefit Assessment",
                explanation: `Recommended approach ${judge === 'reliability' ? 'minimizes technical risk' : 'maximizes demonstration impact'} while maintaining development velocity.`,
                beneficiary: recommendedStack.name,
                advantage: "winner"
            },
            {
                id: "C",
                title: "Goal Optimization",
                explanation: `Stack selection prioritizes ${primaryGoal} objectives while accounting for practical implementation constraints.`,
                beneficiary: recommendedStack.name,
                advantage: "winner"
            }
        ];
    }
};

// Tab Navigation Management
function initializeTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (navTabs.length === 0) {
        console.warn('Navigation tabs not found');
        return;
    }
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = tab.getAttribute('data-tab');
            switchToTab(targetTab);
        });
    });
    
    // Initialize "Enter the Court" button
    const enterCourtBtn = document.getElementById('enter-court-btn');
    if (enterCourtBtn) {
        enterCourtBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToTab('compare');
        });
    }
}

function switchToTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // ALWAYS scroll to top when switching tabs (BEFORE DOM rendering)
    scrollToTopInstant();
    
    // Update active tab state
    currentCase.activeTab = tabName;
    
    // Update navigation UI
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-content`) {
            content.classList.add('active');
        }
    });
    
    // Hide court proceedings when switching tabs
    const proceedings = document.getElementById('court-proceedings');
    if (proceedings && !proceedings.classList.contains('hidden')) {
        proceedings.classList.add('hidden');
    }
    
    // Initialize animations for the active tab
    setTimeout(() => {
        initializeGlobalScrollAnimations();
    }, 100);
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    const currentTheme = localStorage.getItem('hackcourt-theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('hackcourt-theme', newTheme);
    });
}

// Judge selection management for each tab
function initializeJudges() {
    // Compare tab judges
    const compareJudgeBtns = document.querySelectorAll('#compare-content .judge-btn');
    initializeJudgeGroup(compareJudgeBtns, 'compare');
    
    // Counsel tab judges  
    const counselJudgeBtns = document.querySelectorAll('#counsel-content .judge-btn');
    initializeJudgeGroup(counselJudgeBtns, 'counsel');
}

function initializeJudgeGroup(judgeBtns, context) {
    if (judgeBtns.length === 0) {
        console.warn(`Judge buttons not found for ${context}`);
        return;
    }
    
    judgeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Update active state within this group
            judgeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current judge
            currentCase.judge = btn.getAttribute('data-judge');
            console.log(`${context} judge selected:`, currentCase.judge);
        });
    });
}

// Case submission management
function initializeCaseSubmission() {
    // Compare mode submission
    const compareSubmitBtn = document.getElementById('compare-submit-case');
    if (compareSubmitBtn) {
        compareSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCompareSubmission();
        });
    }
    
    // Counsel mode submission
    const counselSubmitBtn = document.getElementById('counsel-submit-case');
    if (counselSubmitBtn) {
        counselSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCounselSubmission();
        });
    }
}

// Handle Compare Two Options submission with MCQs
async function handleCompareSubmission() {
    console.log('Handling compare submission');
    
    // Collect MCQ data (required)
    const duration = document.querySelector('input[name="compare-duration"]:checked')?.value;
    const teamSize = document.querySelector('input[name="compare-teamSize"]:checked')?.value;
    const skillLevel = document.querySelector('input[name="compare-skillLevel"]:checked')?.value;
    const primaryGoal = document.querySelector('input[name="compare-primaryGoal"]:checked')?.value;
    
    // Collect option arguments
    const optionA = document.getElementById('compare-option-a')?.value.trim() || '';
    const optionB = document.getElementById('compare-option-b')?.value.trim() || '';
    
    // Validation
    if (!duration || !teamSize || !skillLevel || !primaryGoal) {
        alert('Please select all required project context options before presenting your case to the court.');
        return;
    }
    
    if (!optionA || !optionB) {
        alert('Please describe both technical options before presenting your case to the court.');
        return;
    }
    
    // Set case data using CANONICAL format
    currentCase.type = 'compare';
    currentCase.data = {
        options: [optionA, optionB],
        context: {
            duration: parseInt(duration),
            teamSize,
            skillLevel,
            primaryGoal
        }
    };
    
    // Try AI engine first, fallback to deterministic engine
    await generateCompareDecisionWithAI();
    
    // Present case to court
    presentCaseToCourtroom();
    
    // ALWAYS scroll to the VERY TOP after case submission (smooth scroll)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle Seek Technical Counsel submission
async function handleCounselSubmission() {
    console.log('Handling counsel submission');
    
    // Collect MCQ data
    const duration = document.querySelector('input[name="counsel-duration"]:checked')?.value;
    const teamSize = document.querySelector('input[name="counsel-teamSize"]:checked')?.value;
    const skillLevel = document.querySelector('input[name="counsel-skillLevel"]:checked')?.value;
    const primaryGoal = document.querySelector('input[name="counsel-primaryGoal"]:checked')?.value;
    const projectTheme = document.getElementById('counsel-project-theme')?.value.trim() || '';
    
    if (!duration || !teamSize || !skillLevel || !primaryGoal) {
        alert('Please select all required options before presenting your case to the court.');
        return;
    }
    
    // Set case data using CANONICAL format
    currentCase.type = 'counsel';
    currentCase.data = {
        projectDescription: projectTheme || 'General hackathon project',
        context: {
            duration: parseInt(duration),
            teamSize,
            skillLevel,
            primaryGoal
        }
    };
    
    // Try AI engine first, fallback to deterministic engine
    await generateAdvisoryRecommendationWithAI();
    
    // Present case to court
    presentCaseToCourtroom();
    
    // ALWAYS scroll to the VERY TOP after case submission (smooth scroll)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate deterministic compare decision
function generateCompareDecision() {
    enforceCaseType('compare');
    
    const decision = compareDecisionEngine.makeDecision(
        currentCase.data.context,
        currentCase.data.options[0],
        currentCase.data.options[1],
        currentCase.judge
    );
    
    // FAIL FAST: Validate Compare mode contract
    validateModeContract('compare', decision);
    
    // Ensure exactly 3 evidence items
    while (decision.evidence.length < 3) {
        const evidenceId = String.fromCharCode(65 + decision.evidence.length);
        decision.evidence.push({
            id: evidenceId,
            title: "Additional Evidence",
            explanation: `${decision.winner} provides additional benefits for the given constraints.`,
            beneficiary: decision.winner,
            advantage: "winner"
        });
    }
    if (decision.evidence.length > 3) {
        decision.evidence = decision.evidence.slice(0, 3);
    }
    
    // Generate warning for reliability judge if conditions warrant
    let warning = null;
    if (currentCase.judge === 'reliability') {
        const context = currentCase.data.context;
        if ((context.skillLevel === 'intermediate' || context.skillLevel === 'beginner') && 
            decision.confidence !== 'high') {
            warning = {
                severity: 'low',
                reason: 'This decision involves trade-offs that may introduce minor risk under hackathon constraints.'
            };
        }
    }
    
    // Override with existing warnings if present
    if (decision.warnings.length > 0) {
        warning = {
            severity: decision.confidence === 'low' ? 'high' : 'medium',
            reason: decision.warnings[0]
        };
    }
    
    // Store decision in COMPARE-SPECIFIC format
    if (!window.caseTypeData) window.caseTypeData = {};
    if (!window.caseTypeData.compare) window.caseTypeData.compare = {};
    
    window.caseTypeData.compare[currentCase.judge] = {
        caseType: 'compare', // Explicit case type marker
        winningOption: decision.winner, // Option A or Option B only
        arguments: [
            {
                label: "Plaintiff's Argument",
                title: "Option A", 
                content: currentCase.data.options[0]
            },
            {
                label: "Defendant's Argument",
                title: "Option B",
                content: currentCase.data.options[1]
            }
        ],
        verdict: {
            winner: decision.winner,
            confidence: decision.confidence,
            reasoning: decision.reasoning
        },
        evidence: decision.evidence,
        warning: warning
    };
}

// AI-integrated compare decision generation
async function generateCompareDecisionWithAI() {
    enforceCaseType('compare');
    
    // Build case payload for AI engine using CANONICAL format
    const casePayload = {
        mode: 'compare',
        options: currentCase.data.options,
        context: currentCase.data.context,
        judge: currentCase.judge
    };
    
    try {
        // Try AI engine first
        const aiResult = await getAIVerdict(casePayload);
        
        if (aiResult) {
            // Use the NORMALIZED AI result directly (post-validation and normalization)
            // FAIL FAST: Validate Compare mode contract
            validateModeContract('compare', aiResult);
            
            // Ensure exactly 3 evidence items (should already be enforced by normalization)
            while (aiResult.evidence.length < 3) {
                const evidenceId = String.fromCharCode(65 + aiResult.evidence.length);
                aiResult.evidence.push({
                    id: evidenceId,
                    title: "Additional Evidence",
                    explanation: `${aiResult.winner} provides additional benefits for the given constraints.`,
                    beneficiary: aiResult.winner,
                    advantage: "winner"
                });
            }
            if (aiResult.evidence.length > 3) {
                aiResult.evidence = aiResult.evidence.slice(0, 3);
            }
            
            // Store decision in COMPARE-SPECIFIC format using normalized AI result
            if (!window.caseTypeData) window.caseTypeData = {};
            if (!window.caseTypeData.compare) window.caseTypeData.compare = {};
            
            window.caseTypeData.compare[currentCase.judge] = {
                caseType: 'compare',
                winningOption: aiResult.winner,
                arguments: [
                    {
                        label: "Plaintiff's Argument",
                        title: "Option A", 
                        content: currentCase.data.options[0]
                    },
                    {
                        label: "Defendant's Argument",
                        title: "Option B",
                        content: currentCase.data.options[1]
                    }
                ],
                verdict: {
                    winner: aiResult.winner,
                    confidence: aiResult.confidence,
                    reasoning: aiResult.reasoning
                },
                evidence: aiResult.evidence,
                warning: aiResult.warning,
                aiPowered: true // Mark as AI-generated
            };
            
            return;
        }
    } catch (error) {
        console.warn('AI Engine failed, falling back to deterministic engine:', error);
    }
    
    // Fallback to deterministic engine
    generateCompareDecision();
}

// Main court proceedings function (UPDATED FOR IMMEDIATE VISIBILITY)
function presentCaseToCourtroom() {
    console.log('Presenting case to courtroom:', currentCase);
    
    // Initialize scroll animation controller if not exists
    if (!scrollAnimationController) {
        scrollAnimationController = new ScrollAnimationController();
    } else {
        scrollAnimationController.reset();
    }
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show court proceedings immediately
    const proceedings = document.getElementById('court-proceedings');
    proceedings.classList.remove('hidden');
    proceedings.style.display = 'block';
    
    // Remove any existing reveal classes from previous renders
    proceedings.querySelectorAll('.reveal, .reveal-visible').forEach(el => {
        el.classList.remove('reveal', 'reveal-visible');
        // Remove stagger classes
        for (let i = 1; i <= 6; i++) {
            el.classList.remove(`reveal-stagger-${i}`);
        }
    });
    
    // HARD SPLIT: Use completely separate render paths
    try {
        if (currentCase.type === 'compare') {
            console.log('🏛️ Rendering COMPARE proceedings');
            const compareData = window.caseTypeData.compare[currentCase.judge];
            renderCompareProceedings(compareData);
            
        } else if (currentCase.type === 'counsel') {
            console.log('📋 Rendering ADVISORY consultation');
            const advisoryData = window.caseTypeData.counsel[currentCase.judge];
            renderAdvisoryConsultation(advisoryData);
            
        } else {
            throw new Error(`UNKNOWN CASE TYPE: ${currentCase.type}. Must be 'compare' or 'counsel'`);
        }
        
    } catch (error) {
        console.error('❌ RENDER ERROR:', error);
        alert(`Rendering failed: ${error.message}`);
        return;
    }
    
    // Optional: Setup scroll-triggered animations for decorative elements only
    // This is not required for content visibility
    setTimeout(() => {
        setupOptionalScrollAnimations();
    }, 100);
}

// Setup optional scroll-triggered animations for decorative elements only
// Content visibility does NOT depend on this function
function setupOptionalScrollAnimations() {
    console.log('Setting up optional scroll-triggered animations for decorative elements');
    
    const animatableElements = [];
    
    // Only animate decorative elements that have .reveal class
    // Major sections are now visible by default
    
    // Individual evidence cards (optional animation)
    const evidenceCards = document.querySelectorAll('.evidence-card.reveal');
    evidenceCards.forEach(card => {
        animatableElements.push(card);
    });
    
    // Individual rejected cards (optional animation)
    const rejectedCards = document.querySelectorAll('.rejected-card.reveal');
    rejectedCards.forEach(card => {
        animatableElements.push(card);
    });
    
    // Only observe elements that actually have .reveal class
    if (animatableElements.length > 0) {
        scrollAnimationController.observeElements(animatableElements);
        console.log(`ScrollAnimationController: Observing ${animatableElements.length} decorative elements`);
    } else {
        console.log('ScrollAnimationController: No decorative elements to animate');
    }
}

// Generate concrete advisory recommendation using MCQ data
function generateAdvisoryRecommendation() {
    enforceCaseType('counsel');
    
    const recommendation = advisoryDecisionEngine.makeDecision(
        currentCase.data.context,
        currentCase.judge
    );
    
    // FAIL FAST: Validate Advisory mode contract
    validateModeContract('counsel', recommendation);
    
    // Store recommendation in ADVISORY-SPECIFIC format
    if (!window.caseTypeData) window.caseTypeData = {};
    if (!window.caseTypeData.counsel) window.caseTypeData.counsel = {};
    
    window.caseTypeData.counsel[currentCase.judge] = {
        caseType: 'counsel', // Explicit case type marker
        recommendedStack: recommendation.stack.name,
        stackComponents: recommendation.stack.components,
        stackDescription: recommendation.stack.description,
        // Flatten for renderer compatibility
        stackName: recommendation.stack.name,
        stack: Array.isArray(recommendation.stack.components) ? recommendation.stack.components : [],
        rejectedAlternatives: Array.isArray(recommendation.rejectedAlternatives) ? recommendation.rejectedAlternatives : [],
        verdict: {
            winner: recommendation.stack.name, // Stack name, NOT Option A/B
            confidence: recommendation.confidence,
            reasoning: recommendation.reasoning
        },
        consultation: {
            recommendedStack: recommendation.stack,
            warnings: recommendation.warnings,
            rejectedAlternatives: recommendation.rejectedAlternatives
        },
        evidence: Array.isArray(recommendation.evidence) ? recommendation.evidence : [],
        warning: recommendation.warnings.length > 0 ? {
            reason: recommendation.warnings[0],
            severity: recommendation.confidence === 'low' ? 'high' : 'medium',
            recommendation: recommendation.warnings.length > 1 ? 
                `Additional considerations: ${recommendation.warnings.slice(1).join('; ')}.` : 
                "Proceed with careful monitoring of identified risk factors."
        } : null
    };
}

// AI-integrated advisory recommendation generation
async function generateAdvisoryRecommendationWithAI() {
    enforceCaseType('counsel');
    
    // Build case payload for AI engine using CANONICAL format
    const casePayload = {
        mode: 'advisory',
        projectDescription: currentCase.data.projectDescription,
        context: currentCase.data.context,
        judge: currentCase.judge
    };
    
    try {
        // Try AI engine first
        const aiResult = await getAIVerdict(casePayload);
        
        if (aiResult) {
            // Convert AI result to internal format
            const recommendation = {
                stack: {
                    name: aiResult.stackName,
                    components: aiResult.stack,
                    description: `AI-recommended stack: ${aiResult.stackName}`
                },
                confidence: aiResult.confidence || 'medium',
                reasoning: aiResult.reasoning,
                evidence: aiResult.evidence || [],
                warnings: [],
                rejectedAlternatives: aiResult.rejectedAlternatives || []
            };
            
            // FAIL FAST: Validate Advisory mode contract
            validateModeContract('counsel', recommendation);
            
            // Store recommendation in ADVISORY-SPECIFIC format
            if (!window.caseTypeData) window.caseTypeData = {};
            if (!window.caseTypeData.counsel) window.caseTypeData.counsel = {};
            
            window.caseTypeData.counsel[currentCase.judge] = {
                caseType: 'counsel',
                recommendedStack: recommendation.stack.name,
                stackComponents: recommendation.stack.components,
                stackDescription: recommendation.stack.description,
                // Flatten for renderer compatibility
                stackName: recommendation.stack.name,
                stack: Array.isArray(recommendation.stack.components) ? recommendation.stack.components : [],
                rejectedAlternatives: Array.isArray(recommendation.rejectedAlternatives) ? recommendation.rejectedAlternatives : [],
                verdict: {
                    winner: recommendation.stack.name,
                    confidence: recommendation.confidence,
                    reasoning: recommendation.reasoning
                },
                consultation: {
                    recommendedStack: recommendation.stack,
                    warnings: recommendation.warnings,
                    rejectedAlternatives: recommendation.rejectedAlternatives
                },
                evidence: Array.isArray(recommendation.evidence) ? recommendation.evidence : [],
                warning: null,
                aiPowered: true // Mark as AI-generated
            };
            
            return;
        }
    } catch (error) {
        console.warn('AI Engine failed, falling back to deterministic engine:', error);
    }
    
    // Fallback to deterministic engine
    generateAdvisoryRecommendation();
}

// HARD SPLIT RENDER FUNCTIONS - NO SHARED OUTPUT
// Two completely separate render paths to prevent contamination

// Render Compare Two Options proceedings (COMPARE MODE ONLY)
function renderCompareProceedings(caseData) {
    enforceCaseType('compare');
    console.log('Rendering COMPARE proceedings only');
    
    const config = caseData;
    const proceedings = document.getElementById('court-proceedings');
    
    // Ensure court proceedings is always visible
    proceedings.classList.remove('hidden');
    proceedings.style.display = 'block';
    
    // Validate we have compare-specific data
    if (!config.arguments || !config.winningOption) {
        throw new Error('INVALID COMPARE DATA: Missing arguments or winningOption');
    }
    
    // Build Compare-specific DOM structure (REMOVED .reveal from major sections)
    proceedings.innerHTML = `
        <!-- Arguments Presented (Compare Only) -->
        <section class="arguments-section" id="arguments-section">
            <div class="section-header">
                <h2 class="section-title">Arguments Presented</h2>
                <div class="section-subtitle">Counsel's opening statements</div>
            </div>
            
            <div class="arguments-grid" id="arguments-grid">
                ${config.arguments.map(argument => `
                    <div class="argument-card">
                        <div class="argument-header">
                            <div class="argument-label">${argument.label}</div>
                        </div>
                        <div class="argument-title">${extractTitleFromInput(argument.content)}</div>
                        <div class="argument-content">${argument.content}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Court's Ruling (Compare Only) -->
        <section class="ruling-section">
            <div class="section-header">
                <h2 class="section-title">Court's Ruling</h2>
                <div class="section-subtitle">The honorable court's decision</div>
            </div>
            
            <div class="ruling-card" id="ruling-card">
                <div class="ruling-header">
                    <div class="ruling-label">THE COURT FINDS IN FAVOR OF</div>
                    <div class="confidence-seal ${config.verdict.confidence}">
                        <span class="confidence-text">${config.verdict.confidence.toUpperCase()} CONFIDENCE</span>
                    </div>
                </div>
                
                <div class="ruling-decision">
                    <div class="decision-option">${config.verdict.winner}</div>
                </div>
                
                <div class="ruling-rationale">
                    <div class="rationale-label">Court's Reasoning</div>
                    <div class="rationale-text">${config.verdict.reasoning}</div>
                </div>
                
                <div class="court-signature">
                    <div class="signature-line">
                        <span class="judge-signature">${judgeProfiles[currentCase.judge].name}</span>
                        <span class="ruling-date">${new Date().getFullYear()}</span>
                    </div>
                </div>
                
                <div class="court-actions">
                    <button type="button" class="new-case-btn" id="new-case-btn">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">File a New Case</span>
                    </button>
                </div>
            </div>
        </section>

        ${config.warning ? `
        <!-- Warnings from the Bench (Compare Only) -->
        <section class="warnings-section" id="warnings-section">
            <div class="section-header">
                <h2 class="section-title">Warning from the Bench</h2>
                <div class="section-subtitle">Judicial caution regarding this decision</div>
            </div>
            
            <div class="warning-notice">
                <div class="warning-header">
                    <div class="warning-icon">⚠</div>
                    <div class="warning-title">JUDICIAL WARNING</div>
                    <div class="risk-level">${config.warning.severity.toUpperCase()} RISK</div>
                </div>
                
                <div class="warning-content">
                    <div class="court-caution">
                        <span class="caution-prefix">The Court cautions:</span>
                        <span class="warning-reason">${config.warning.reason}</span>
                    </div>
                    
                    ${config.warning.recommendation ? `
                        <div class="judicial-recommendation">
                            <span style="font-weight: 600; color: var(--accent-warning); font-style: normal;">Court's Recommendation:</span>
                            ${config.warning.recommendation}
                        </div>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Evidence & Trade-offs (Compare Only) -->
        <section class="evidence-section">
            <div class="section-header">
                <h2 class="section-title">Evidence & Trade-offs</h2>
                <div class="section-subtitle">Supporting documentation for the court's decision</div>
            </div>
            
            <div class="evidence-grid">
                ${config.evidence.map(evidence => {
                    // Customize beneficiary names for compare cases
                    let beneficiary = evidence.beneficiary;
                    if (beneficiary.includes('Option')) {
                        if (beneficiary === 'Option A') {
                            beneficiary = extractTitleFromInput(currentCase.data.options[0]);
                        } else if (beneficiary === 'Option B') {
                            beneficiary = extractTitleFromInput(currentCase.data.options[1]);
                        }
                    }
                    
                    return `
                        <div class="evidence-card reveal">
                            <div class="evidence-header">
                                <div class="evidence-label">Evidence ${evidence.id}</div>
                                <div class="advantage-indicator ${evidence.advantage}">
                                    ${evidence.advantage === 'winner' ? 'Strong Advantage' : 
                                      evidence.advantage === 'runner-up' ? 'Moderate Advantage' : 'Comparable'}
                                </div>
                            </div>
                            <div class="evidence-title">${evidence.title}</div>
                            <div class="evidence-explanation">${evidence.explanation}</div>
                            <div class="evidence-beneficiary">
                                Favors: <span class="beneficiary-name">${beneficiary}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
    `;
    
    // Re-initialize new case button
    initializeNewCaseFlow();
    
    console.log('✅ Compare proceedings rendered successfully');
}

// Render Advisory Consultation proceedings (ADVISORY MODE ONLY)
function renderAdvisoryConsultation(caseData) {
    enforceCaseType('counsel');
    console.log('Rendering ADVISORY consultation only');
    
    const config = caseData;
    const proceedings = document.getElementById('court-proceedings');
    
    // Ensure court proceedings is always visible
    proceedings.classList.remove('hidden');
    proceedings.style.display = 'block';
    
    // Validate we have advisory-specific data
    //if (!config.recommendedStack || !config.stackComponents) {
    //    throw new Error('INVALID ADVISORY DATA: Missing recommendedStack or stackComponents');
    //}
    
    // Build Advisory-specific DOM structure (REMOVED .reveal from major sections)
    proceedings.innerHTML = `
        <!-- Court's Recommendation (Advisory Only) -->
        <section class="recommendation-section">
            <div class="section-header">
                <h2 class="section-title">Court's Recommendation</h2>
                <div class="section-subtitle">Technical counsel for your project</div>
            </div>
            
            <div class="ruling-card">
                <div class="ruling-header">
                    <div class="ruling-label">THE COURT RECOMMENDS</div>
                    <div class="confidence-seal ${config.verdict.confidence}">
                        <span class="confidence-text">${config.verdict.confidence.toUpperCase()} CONFIDENCE</span>
                    </div>
                </div>
                
                <div class="ruling-decision">
                    <div class="decision-option">${config.recommendedStack}</div>
                </div>
                
                <div class="court-signature">
                    <div class="signature-line">
                        <span class="judge-signature">${judgeProfiles[currentCase.judge].name}</span>
                        <span class="ruling-date">${new Date().getFullYear()}</span>
                    </div>
                </div>
                
                <div class="court-actions">
                    <button type="button" class="new-case-btn" id="new-case-btn">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">File a New Case</span>
                    </button>
                </div>
            </div>
        </section>

        ${config.warning ? `
        <!-- Judicial Warning (Advisory Only) -->
        <section class="warnings-section">
            <div class="section-header">
                <h2 class="section-title">Judicial Warning</h2>
                <div class="section-subtitle">Court's caution regarding this recommendation</div>
            </div>
            
            <div class="warning-notice">
                <div class="warning-header">
                    <div class="warning-icon">⚠</div>
                    <div class="warning-title">JUDICIAL WARNING</div>
                    <div class="risk-level">${config.warning.severity.toUpperCase()} RISK</div>
                </div>
                
                <div class="warning-content">
                    <div class="court-caution">
                        <span class="caution-prefix">The Court cautions:</span>
                        <span class="warning-reason">${config.warning.reason}</span>
                    </div>
                    
                    ${config.warning.recommendation ? `
                        <div class="judicial-recommendation">
                            <span style="font-weight: 600; color: var(--accent-warning); font-style: normal;">Court's Recommendation:</span>
                            ${config.warning.recommendation}
                        </div>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Legal Consultation Memo (Advisory Only) -->
        <section class="consultation-section">
            <div class="section-header">
                <h2 class="section-title">Legal Consultation Memo</h2>
                <div class="section-subtitle">Court's technical counsel and recommendations</div>
            </div>
            
            <div class="consultation-memo">
                <div class="memo-section">
                    <h3 class="memo-section-title">Recommended Technology Stack</h3>
                    <div class="recommended-stack">
                        <div class="stack-name">${config.stackName}</div>
                        <ul class="stack-components">
                        ${config.stack.map(component =>
                            `<li class="stack-component">${component}</li>`
                        ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="memo-section">
                    <h3 class="memo-section-title">Court's Reasoning</h3>
                    <div class="court-reasoning">${config.verdict.reasoning}</div>
                </div>
            </div>
        </section>

        <!-- Evidence & Trade-offs (Advisory Only) -->
        <section class="evidence-section">
            <div class="section-header">
                <h2 class="section-title">Evidence & Trade-offs</h2>
                <div class="section-subtitle">Supporting documentation for the court's recommendation</div>
            </div>
            
            <div class="evidence-grid">
                ${config.evidence.map(evidence => `
                    <div class="evidence-card reveal">
                        <div class="evidence-header">
                            <div class="evidence-label">Evidence ${evidence.id}</div>
                            <div class="advantage-indicator ${evidence.advantage}">
                                ${evidence.advantage === 'winner' ? 'Strong Advantage' : 
                                  evidence.advantage === 'runner-up' ? 'Moderate Advantage' : 'Comparable'}
                            </div>
                        </div>
                        <div class="evidence-title">${evidence.title}</div>
                        <div class="evidence-explanation">${evidence.explanation}</div>
                        <div class="evidence-beneficiary">
                            Supports: <span class="beneficiary-name">${evidence.beneficiary || 'Recommended Stack'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Rejected Alternatives (Advisory Only) -->
        <section class="rejected-section">
            <div class="section-header">
                <h2 class="section-title">Rejected Alternatives</h2>
                <div class="section-subtitle">Technologies explicitly dismissed by the court</div>
            </div>
            
            <div class="rejected-grid">
            ${config.rejectedAlternatives.map(alt => `
                <div class="rejected-card reveal">
                <div class="rejected-header">
                    <div class="rejected-label">Rejected</div>
                </div>
                <div class="rejected-name">${alt.name}</div>
                <div class="rejected-reason">${alt.reason}</div>
                </div>
            `).join('')}
            </div>
        </section>
    `;
    
    // Re-initialize new case button
    initializeNewCaseFlow();
    
    console.log('✅ Advisory consultation rendered successfully');
}

// OLD SHARED RENDER FUNCTIONS REMOVED
// These functions have been replaced by completely separate render paths:
// - renderCompareProceedings() for Compare mode
// - renderAdvisoryConsultation() for Advisory mode
// This ensures strict mode separation and prevents output contamination

// Utility function to extract title from user input
function extractTitleFromInput(input) {
    // Extract first few words or technology name from input
    const words = input.trim().split(' ');
    const firstLine = input.split('\n')[0];
    
    // Look for common technology patterns
    const techPatterns = [
        /react/i, /vue/i, /angular/i, /svelte/i,
        /node/i, /express/i, /fastapi/i, /flask/i, /django/i,
        /typescript/i, /javascript/i, /python/i, /java/i,
        /mongodb/i, /postgresql/i, /mysql/i, /redis/i
    ];
    
    for (const pattern of techPatterns) {
        const match = input.match(pattern);
        if (match) {
            return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
        }
    }
    
    // Fallback to first few words
    return firstLine.length > 30 ? 
        firstLine.substring(0, 30) + '...' : 
        firstLine || words.slice(0, 3).join(' ');
}

// Sample case data structure (UPDATED WITH EXPLICIT CASE TYPE METADATA)
const precedentCases = {
    'flask-vs-fastapi': {
        caseType: 'compare', // Explicit case type metadata
        judge: 'reliability',
        data: {
            mcqData: {
                duration: 24,
                teamSize: 'medium',
                skillLevel: 'intermediate',
                primaryGoal: 'balanced'
            },
            optionA: 'Flask - Lightweight Python web framework with minimal setup. Proven stability, extensive documentation, and simple deployment. Perfect for rapid prototyping with familiar patterns.',
            optionB: 'FastAPI - Modern Python API framework with automatic documentation generation. Built-in async support, type hints, and interactive API docs. Great for impressive demos.'
        }
    },
    'simple-vs-complex': {
        caseType: 'compare', // Explicit case type metadata
        judge: 'reliability',
        data: {
            mcqData: {
                duration: 48,
                teamSize: 'small',
                skillLevel: 'beginner',
                primaryGoal: 'balanced'
            },
            optionA: 'Simple Stack - Static HTML/CSS/JavaScript frontend with serverless functions. Minimal dependencies, easy deployment, predictable behavior. Focus on core functionality.',
            optionB: 'Enterprise Architecture - Microservices with Docker, API gateway, database clusters, CI/CD pipeline. Scalable and professional but complex setup and configuration.'
        }
    },
    'beginner-advisory': {
        caseType: 'counsel', // Explicit case type metadata
        judge: 'reliability', 
        data: {
            duration: 36,
            teamSize: 'small',
            skillLevel: 'beginner',
            primaryGoal: 'balanced',
            projectTheme: 'Simple task management web application with basic user authentication and data persistence. First hackathon for most team members.'
        }
    },
    'demo-focused': {
        caseType: 'counsel', // Explicit case type metadata
        judge: 'demo',
        data: {
            duration: 48,
            teamSize: 'medium',
            skillLevel: 'advanced',
            primaryGoal: 'demo-first',
            projectTheme: 'AI-powered code review assistant with real-time collaboration features and impressive visual interface for technical judges.'
        }
    },
    'fullstack-dilemma': {
        caseType: 'compare', // Explicit case type metadata
        judge: 'demo', 
        data: {
            mcqData: {
                duration: 36,
                teamSize: 'small',
                skillLevel: 'intermediate',
                primaryGoal: 'demo-first'
            },
            optionA: 'React - Popular component-based library with extensive ecosystem. Team has some experience, great for interactive UIs, large community support and resources.',
            optionB: 'Vue.js - Progressive framework with gentler learning curve. Excellent documentation, simpler syntax, good performance, but team is less familiar with it.'
        }
    }
};

// Initialize precedent cases
function initializePrecedentCases() {
    const precedentButtons = document.querySelectorAll('.precedent-case');
    
    if (precedentButtons.length === 0) {
        console.warn('Precedent case buttons not found');
        return;
    }
    
    precedentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const caseId = button.getAttribute('data-case');
            if (caseId) {
                loadPrecedentCase(caseId);
            }
        });
    });
}

// Load a precedent case into the form (UPDATED FOR NEW STRUCTURE)
function loadPrecedentCase(caseId) {
    const precedent = precedentCases[caseId];
    if (!precedent) {
        console.error('Precedent case not found:', caseId);
        return;
    }
    
    console.log('Loading precedent case:', caseId, precedent);
    
    // Switch to appropriate tab
    if (precedent.caseType === 'compare') {
        switchToTab('compare');
        currentCase.type = 'compare';
        
        // Fill MCQ data
        if (precedent.data.mcqData) {
            const { duration, teamSize, skillLevel, primaryGoal } = precedent.data.mcqData;
            
            if (duration) {
                const durationRadio = document.querySelector(`input[name="compare-duration"][value="${duration}"]`);
                if (durationRadio) durationRadio.checked = true;
            }
            if (teamSize) {
                const teamSizeRadio = document.querySelector(`input[name="compare-teamSize"][value="${teamSize}"]`);
                if (teamSizeRadio) teamSizeRadio.checked = true;
            }
            if (skillLevel) {
                const skillLevelRadio = document.querySelector(`input[name="compare-skillLevel"][value="${skillLevel}"]`);
                if (skillLevelRadio) skillLevelRadio.checked = true;
            }
            if (primaryGoal) {
                const primaryGoalRadio = document.querySelector(`input[name="compare-primaryGoal"][value="${primaryGoal}"]`);
                if (primaryGoalRadio) primaryGoalRadio.checked = true;
            }
        }
        
        // Fill option arguments
        if (precedent.data.optionA) {
            const optionAField = document.getElementById('compare-option-a');
            if (optionAField) optionAField.value = precedent.data.optionA;
        }
        if (precedent.data.optionB) {
            const optionBField = document.getElementById('compare-option-b');
            if (optionBField) optionBField.value = precedent.data.optionB;
        }
        
        // Set judge
        if (precedent.judge) {
            currentCase.judge = precedent.judge;
            updateJudgeUI('compare', precedent.judge);
        }
        
    } else if (precedent.caseType === 'counsel') {
        switchToTab('counsel');
        currentCase.type = 'counsel';
        
        console.log('Technical counsel precedent loaded');
        
        // Set MCQ values for advisory cases
        const { duration, teamSize, skillLevel, primaryGoal, projectTheme } = precedent.data;
        
        if (duration) {
            const durationRadio = document.querySelector(`input[name="counsel-duration"][value="${duration}"]`);
            if (durationRadio) {
                durationRadio.checked = true;
                console.log('Set duration:', duration);
            }
        }
        if (teamSize) {
            const teamSizeRadio = document.querySelector(`input[name="counsel-teamSize"][value="${teamSize}"]`);
            if (teamSizeRadio) {
                teamSizeRadio.checked = true;
                console.log('Set teamSize:', teamSize);
            }
        }
        if (skillLevel) {
            const skillLevelRadio = document.querySelector(`input[name="counsel-skillLevel"][value="${skillLevel}"]`);
            if (skillLevelRadio) {
                skillLevelRadio.checked = true;
                console.log('Set skillLevel:', skillLevel);
            }
        }
        if (primaryGoal) {
            const primaryGoalRadio = document.querySelector(`input[name="counsel-primaryGoal"][value="${primaryGoal}"]`);
            if (primaryGoalRadio) {
                primaryGoalRadio.checked = true;
                console.log('Set primaryGoal:', primaryGoal);
            }
        }
        if (projectTheme) {
            const themeField = document.getElementById('counsel-project-theme');
            if (themeField) {
                themeField.value = projectTheme;
                console.log('Set projectTheme:', projectTheme);
            }
        }
        
        // Set judge
        if (precedent.judge) {
            currentCase.judge = precedent.judge;
            updateJudgeUI('counsel', precedent.judge);
        }
    }
    
    // Add visual feedback
    showPrecedentLoadedFeedback();
    
    // ALWAYS scroll to the VERY TOP after data is loaded (smooth scroll)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update judge UI to match precedent (UPDATED FOR TAB STRUCTURE)
function updateJudgeUI(context, judge) {
    const judgeBtns = document.querySelectorAll(`#${context}-content .judge-btn`);
    
    judgeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-judge') === judge) {
            btn.classList.add('active');
        }
    });
}

// Show visual feedback when precedent is loaded
function showPrecedentLoadedFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'precedent-feedback';
    feedback.innerHTML = '📋 Precedent case loaded - review and submit to court';
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--accent-gold);
        color: var(--text-primary);
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        z-index: 1000;
        box-shadow: var(--shadow-secondary);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for feedback
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(feedbackStyles);

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are fully rendered
    setTimeout(() => {
        console.log('Initializing HackCourt...');
        initializeTabNavigation();
        initializeTheme();
        initializeJudges();
        initializeCaseSubmission();
        initializeNewCaseFlow();
        initializePrecedentCases();
        initializeStickyHeader();
        initializeGlobalScrollAnimations(); // Initialize animations for all grids
        
        console.log('HackCourt JS initialized successfully');
    }, 100);
});

// Sticky header collapse using IntersectionObserver
// Uses a sentinel element to trigger header state changes instead of scroll math
// This eliminates glitches and provides consistent behavior across all page heights
function initializeStickyHeader() {
    const header = document.querySelector('.court-chamber');
    const sentinel = document.getElementById('header-sentinel');
    
    if (!header || !sentinel) {
        console.warn('Header or sentinel element not found');
        return;
    }
    
    // IntersectionObserver to watch when sentinel leaves/enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Sentinel is visible - header should be expanded
                header.classList.remove('scrolled');
            } else {
                // Sentinel is not visible - header should be collapsed
                header.classList.add('scrolled');
            }
        });
    }, {
        // Trigger when sentinel completely leaves/enters viewport
        threshold: 0,
        rootMargin: '0px'
    });
    
    observer.observe(sentinel);
    
    console.log('Header collapse initialized with IntersectionObserver');
}

// Global scroll animations - IntersectionObserver based
// Triggers subtle rise-in animations for .reveal elements across ALL pages
function initializeGlobalScrollAnimations() {
    // Find all .reveal elements across all tabs and court proceedings
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('reveal-visible');
                
                // Handle staggered children if they exist
                const staggeredChildren = entry.target.querySelectorAll('[class*="reveal-stagger-"]');
                staggeredChildren.forEach(child => {
                    child.classList.add('reveal-visible');
                });
                
                // Unobserve to ensure animation only runs once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
    console.log(`Global scroll animations initialized for ${reveals.length} elements`);
}

// Home page scroll animations - IntersectionObserver based
// Triggers subtle rise-in animations for .reveal elements on HOME page only
function initializeHomeScrollAnimations() {
    // Only run if we're on the home tab
    const homeContent = document.getElementById('home-content');
    if (!homeContent || !homeContent.classList.contains('active')) {
        return;
    }
    
    const reveals = homeContent.querySelectorAll('.reveal');
    if (!reveals.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('reveal-visible');
                
                // Handle staggered children if they exist
                const staggeredChildren = entry.target.querySelectorAll('[class*="reveal-stagger-"]');
                staggeredChildren.forEach(child => {
                    child.classList.add('reveal-visible');
                });
                
                // Unobserve to ensure animation only runs once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
    console.log(`Home scroll animations initialized for ${reveals.length} elements`);
}

// New Case Flow Management (UPDATED FOR TAB STRUCTURE)
function initializeNewCaseFlow() {
    const newCaseBtn = document.getElementById('new-case-btn');
    
    if (!newCaseBtn) {
        console.warn('New case button not found');
        return;
    }
    
    newCaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        fileNewCase();
    });
}

// File a new case - reset state and return to home
function fileNewCase() {
    // Reset case state (preserve theme and judge selection)
    currentCase.data = null;
    
    // Reset animation controller
    if (scrollAnimationController) {
        scrollAnimationController.reset();
    }
    
    // Clear all form inputs
    clearFormInputs();
    
    // Hide court proceedings with fade out
    const proceedings = document.getElementById('court-proceedings');
    proceedings.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    proceedings.style.opacity = '0';
    proceedings.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        // Hide proceedings and return to home tab
        proceedings.classList.add('hidden');
        proceedings.style.opacity = '';
        proceedings.style.transform = '';
        proceedings.style.transition = '';
        
        // Switch to home tab
        switchToTab('home');
        
        // Smooth scroll to top
        window.scrollTo({ 
            top: 0,
            behavior: 'smooth'
        });
        
    }, 400);
}

// Clear all form inputs while preserving selections (UPDATED FOR NEW STRUCTURE)
function clearFormInputs() {
    // Clear compare form inputs
    const compareOptionA = document.getElementById('compare-option-a');
    const compareOptionB = document.getElementById('compare-option-b');
    
    if (compareOptionA) compareOptionA.value = '';
    if (compareOptionB) compareOptionB.value = '';
    
    // Clear counsel form inputs
    const counselProjectTheme = document.getElementById('counsel-project-theme');
    if (counselProjectTheme) counselProjectTheme.value = '';
    
    // Reset MCQ radio buttons to first option for both forms
    const allRadioGroups = [
        'compare-duration', 'compare-teamSize', 'compare-skillLevel', 'compare-primaryGoal',
        'counsel-duration', 'counsel-teamSize', 'counsel-skillLevel', 'counsel-primaryGoal'
    ];
    
    allRadioGroups.forEach(groupName => {
        const radios = document.querySelectorAll(`input[name="${groupName}"]`);
        if (radios.length > 0) radios[0].checked = true;
    });
    
    // Note: We preserve judge selections as they represent user preferences
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        currentCase,
        judgeProfiles,
        compareDecisionEngine,
        advisoryDecisionEngine,
        presentCaseToCourtroom,
        extractTitleFromInput,
        fileNewCase,
        clearFormInputs,
        switchToTab,
        ScrollAnimationController
    };
}