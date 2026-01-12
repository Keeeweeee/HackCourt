// AI-Powered Decision Engine for HackCourt
// Integrates Groq API with deterministic fallback for intelligent technical decision making

/**
 * Main AI Engine function that handles AI service calls with fallback logic
 * @param {Object} casePayload - The case data for AI analysis
 * @returns {Promise<Object|null>} AI verdict or null if all services fail
 */
async function getAIVerdict(casePayload) {
    // Check if API key is available
    const apiKey = getGroqAPIKey();
    if (!apiKey) {
        // No API key - skip AI and go straight to deterministic fallback
        return null;
    }
    
    // Try Groq first
    try {
        const groqResult = await queryGroqAPI(casePayload);
        if (groqResult) {
            const validatedResult = validateAIResponse(groqResult, casePayload.mode);
            if (validatedResult) {
                // Post-validation safety guard for Compare mode evidence count
                if (casePayload.mode === 'compare' && validatedResult.evidence.length !== 3) {
                    console.warn('AI Engine: Compare mode must have exactly 3 evidence items, falling back to deterministic');
                    return null;
                }
                
                // Post-validation safety guard for Advisory mode evidence count
                if (casePayload.mode === 'advisory' && validatedResult.evidence.length !== 3) {
                    console.warn('AI Engine: Advisory mode must have exactly 3 evidence items, falling back to deterministic');
                    return null;
                }
                
                // Auto-generate warnings if missing
                if (casePayload.mode === 'compare' && !validatedResult.warning) {
                    if (validatedResult.confidence === 'medium' || validatedResult.confidence === 'low') {
                        validatedResult.warning = {
                            severity: 'low',
                            reason: 'This decision involves trade-offs that may introduce minor risk under hackathon constraints.'
                        };
                    }
                } else if (casePayload.mode === 'advisory' && !validatedResult.warning) {
                    // Check for high complexity with short duration
                    if (casePayload.context && casePayload.context.duration <= 36) {
                        const stackComplexity = validatedResult.stack && validatedResult.stack.some(tech => 
                            tech.toLowerCase().includes('typescript') || 
                            tech.toLowerCase().includes('react') || 
                            tech.toLowerCase().includes('vue') ||
                            tech.toLowerCase().includes('angular')
                        );
                        if (stackComplexity) {
                            validatedResult.warning = {
                                severity: 'low',
                                reason: 'The recommended stack may require careful scope control to avoid overextension.'
                            };
                        }
                    }
                }
                
                return validatedResult;
            }
        }
    } catch (error) {
        console.warn('AI Engine: Groq failed:', error.message);
    }
    
    // Groq failed, fallback to deterministic engine
    return null;
}


/**
 * Query Groq API with 2000ms timeout
 * @param {Object} casePayload - The case data
 * @returns {Promise<Object>} Groq API response
 */
async function queryGroqAPI(casePayload) {
    console.log('AI Engine: Attempting Groq API call');
    
    const apiKey = getGroqAPIKey();
    if (!apiKey) {
        throw new Error('No API key available');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2000ms timeout
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: getSystemPrompt(casePayload.mode, casePayload.judge)
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(casePayload)
                    }
                ],
                temperature: 0.2
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.warn('AI Engine: Groq API error response:', errorBody);
            throw new Error(`Groq API error: ${response.status}`);
        }
        
        const data = await response.json();
        let aiResponse = JSON.parse(data.choices[0].message.content);
        aiResponse = normalizeAIResponse(aiResponse, casePayload.mode, casePayload);

        console.log('AI Engine: Groq API response received (normalized)');
        return aiResponse;

        
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn('AI Engine: Groq API timeout after 2000ms');
        } else {
            console.warn('AI Engine: Groq API failed:', error.message);
        }
        throw error;
    }
}
function normalizeAIResponse(raw, mode, casePayload) {
    if (!raw || typeof raw !== 'object') return raw;

    // Frontend owns mode
    raw.mode = mode;

    /* ======================
       COMPARE MODE FIXES
       ====================== */
        if (mode === 'compare') {
        // ---- FORCE MODE ----
        raw.mode = 'compare';

        // ---- FORCE WINNER ----
        const winnerText = (raw.winner || raw.decision || '').toLowerCase();

        if (winnerText.includes('a') || winnerText.includes('option a')) {
            raw.winner = 'Option A';
        } else if (winnerText.includes('option b')) {
            raw.winner = 'Option B';
        } else {
            // fallback heuristic using option names
            const a = casePayload.options[0].toLowerCase();
            const combined = JSON.stringify(raw).toLowerCase();

            raw.winner = combined.includes(a) ? 'Option A' : 'Option B';
        }

        // ---- FORCE CONFIDENCE ----
        if (!['high', 'medium', 'low'].includes(raw.confidence)) {
            raw.confidence = 'medium';
        }

        // ---- FORCE REASONING ----
        raw.reasoning =
            raw.reasoning ||
            raw.justification ||
            raw.summary ||
            'The court finds this option better aligned with the stated constraints and judging criteria.';

        // ---- FORCE EVIDENCE ----
        if (!Array.isArray(raw.evidence) || raw.evidence.length === 0) {
            raw.evidence = [
                {
                    id: 'A',
                    title: 'Constraint Alignment',
                    explanation: 'This option aligns more closely with time, skill, and demo constraints.',
                    beneficiary: raw.winner
                },
                {
                    id: 'B',
                    title: 'Implementation Risk',
                    explanation: 'This option presents lower implementation risk for the given constraints.',
                    beneficiary: raw.winner
                },
                {
                    id: 'C',
                    title: 'Technology Comparison',
                    explanation: 'Both options have merit, but this one better fits the project requirements.',
                    beneficiary: 'Both'
                }
            ];
        }
        
        // Ensure exactly 3 evidence items
        if (raw.evidence.length < 3) {
            while (raw.evidence.length < 3) {
                raw.evidence.push({
                    id: String.fromCharCode(65 + raw.evidence.length),
                    title: 'Additional Evidence',
                    explanation: 'This option provides additional benefits for the given constraints.',
                    beneficiary: raw.winner
                });
            }
        } else if (raw.evidence.length > 3) {
            raw.evidence = raw.evidence.slice(0, 3);
        }

        // ---- FORCE WARNING ----
        if (raw.warning && !raw.warning.severity) {
            raw.warning.severity = 'medium';
        }
        if (raw.warning && !raw.warning.reason) {
            raw.warning.reason = 'Additional considerations may apply to this decision.';
        }
    }


    /* ======================
       ADVISORY MODE FIXES
       ====================== */
        if (mode === 'advisory') {
        // ---- FORCE MODE ----
        raw.mode = 'advisory';

        // ---- FORCE STACK NAME ----
        if (!raw.stackName || typeof raw.stackName !== 'string') {
            if (Array.isArray(raw.stack) && raw.stack.length > 0) {
                raw.stackName = `${raw.stack[0]} Stack`;
            } else {
                raw.stackName = 'Recommended Hackathon Stack';
            }
        }

        // ---- FORCE STACK ARRAY ----
        if (!Array.isArray(raw.stack) || raw.stack.length === 0) {
            raw.stack = [
                'Frontend Framework',
                'Backend API',
                'Lightweight Database'
            ];
        }

        // ---- FORCE REASONING ----
        raw.reasoning =
            raw.reasoning ||
            raw.justification ||
            'This stack balances development speed, stability, and demo readiness for the given constraints.';

        // ---- FORCE EVIDENCE ----
        if (!Array.isArray(raw.evidence) || raw.evidence.length === 0) {
            raw.evidence = [
                {
                    id: 'A',
                    title: 'Feasibility',
                    explanation: 'The recommended stack can be implemented reliably within the available time and skill constraints.',
                    beneficiary: raw.stackName
                }
            ];
        }
        
        // Ensure each evidence item has beneficiary set to stackName
        raw.evidence.forEach(evidence => {
            evidence.beneficiary = raw.stackName;
        });
        
        // Ensure exactly 3 evidence items with judge-based defaults
        while (raw.evidence.length < 3) {
            const evidenceId = String.fromCharCode(65 + raw.evidence.length);
            let title, explanation;
            
            if (casePayload.judge === 'reliability') {
                const reliabilityEvidence = [
                    { title: 'Stability under time pressure', explanation: 'This stack maintains reliability even under tight hackathon deadlines.' },
                    { title: 'Low operational risk', explanation: 'The recommended technologies minimize deployment and runtime risks.' },
                    { title: 'Proven ecosystem maturity', explanation: 'This stack leverages well-established tools with extensive documentation.' }
                ];
                const evidence = reliabilityEvidence[raw.evidence.length - 1] || reliabilityEvidence[0];
                title = evidence.title;
                explanation = evidence.explanation;
            } else {
                const innovationEvidence = [
                    { title: 'Demo impact', explanation: 'This stack maximizes visual appeal and presentation capabilities.' },
                    { title: 'Developer experience', explanation: 'The recommended tools provide superior development workflow and productivity.' },
                    { title: 'Modern tooling advantage', explanation: 'This stack leverages cutting-edge technologies for competitive advantage.' }
                ];
                const evidence = innovationEvidence[raw.evidence.length - 1] || innovationEvidence[0];
                title = evidence.title;
                explanation = evidence.explanation;
            }
            
            raw.evidence.push({
                id: evidenceId,
                title: title,
                explanation: explanation,
                beneficiary: raw.stackName
            });
        }
        
        // Trim to exactly 3 if more than 3
        if (raw.evidence.length > 3) {
            raw.evidence = raw.evidence.slice(0, 3);
        }
        
        // Ensure proper advantage distribution
        if (raw.evidence.length === 3) {
            // Count current advantages
            const advantages = raw.evidence.map(e => e.advantage || 'Comparable');
            const strongCount = advantages.filter(a => a === 'Strong Advantage' || a === 'winner').length;
            const comparableCount = advantages.filter(a => a === 'Comparable').length;
            
            // If all are "Comparable" or no "Strong Advantage", force proper distribution
            if (strongCount === 0 || comparableCount === 3) {
                raw.evidence[0].advantage = 'Strong Advantage';
                raw.evidence[1].advantage = 'Moderate Advantage'; 
                raw.evidence[2].advantage = 'Comparable';
            }
            // If more than one "Comparable", adjust
            else if (comparableCount > 1) {
                let comparableFixed = 0;
                for (let i = 0; i < raw.evidence.length && comparableFixed < comparableCount - 1; i++) {
                    if (raw.evidence[i].advantage === 'Comparable') {
                        raw.evidence[i].advantage = i === 0 ? 'Strong Advantage' : 'Moderate Advantage';
                        comparableFixed++;
                    }
                }
            }
        }

        // ---- FORCE REJECTED ALTERNATIVES ----
        if (!Array.isArray(raw.rejectedAlternatives)) {
            raw.rejectedAlternatives = [];
        }
        
        // Inject judge-based defaults if empty or insufficient
        if (raw.rejectedAlternatives.length === 0) {
            if (casePayload.judge === 'reliability') {
                raw.rejectedAlternatives = [
                    'Overly complex architectures',
                    'Unstable or experimental frameworks',
                    'Heavy microservice designs'
                ];
            } else {
                raw.rejectedAlternatives = [
                    'Plain static implementations',
                    'Low-visual-impact stacks',
                    'Outdated UI frameworks'
                ];
            }
        }
        
        // Ensure minimum 3 items
        while (raw.rejectedAlternatives.length < 3) {
            if (casePayload.judge === 'reliability') {
                const reliabilityDefaults = [
                    'Overly complex architectures',
                    'Unstable or experimental frameworks', 
                    'Heavy microservice designs'
                ];
                raw.rejectedAlternatives.push(reliabilityDefaults[raw.rejectedAlternatives.length % reliabilityDefaults.length]);
            } else {
                const innovationDefaults = [
                    'Plain static implementations',
                    'Low-visual-impact stacks',
                    'Outdated UI frameworks'
                ];
                raw.rejectedAlternatives.push(innovationDefaults[raw.rejectedAlternatives.length % innovationDefaults.length]);
            }
        }
        
        // ---- FORCE WARNING SHAPE ----
        if (raw.warning && !raw.warning.severity) {
            raw.warning.severity = 'medium';
        }
        if (raw.warning && !raw.warning.reason) {
            raw.warning.reason = 'Additional considerations may apply to this recommendation.';
        }
    }


    return raw;
}

/**
 * Get system prompt based on mode and judge
 * @param {string} mode - 'compare' or 'advisory'
 * @param {string} judge - 'reliability' or 'innovation'
 * @returns {string} System prompt
 */
function getSystemPrompt(mode, judge) {
    const judgePhilosophy = judge === 'reliability' 
        ? 'You prefer stable, proven, low-risk technologies. You penalize novelty and unnecessary complexity.'
        : 'You prefer modern tooling, demo impact, and developer experience. You favor innovation and presentation capabilities.';

    if (mode === 'compare') {
        return `You are Hon. Justice HackCourt, a strict technical judge. ${judgePhilosophy}

You MUST NOT override judge philosophy unless constraints make it impossible.

Analyze the two technical options and respond with ONLY a valid JSON object matching this exact schema:

{
  "mode": "compare",
  "winner": "Option A" | "Option B",
  "confidence": "high" | "medium" | "low",
  "reasoning": "One sentence explaining the decision",
  "evidence": [
    {
      "id": "A",
      "title": "Evidence title",
      "explanation": "Evidence explanation",
      "beneficiary": "Option A" | "Option B" | "Both"
    }
  ],
  "warning": {
    "severity": "low" | "medium" | "high",
    "reason": "Warning reason"
  } | null
}

You MUST return exactly 3 evidence items.
Evidence A must strongly favor the winner.
Evidence B must moderately favor the winner.
Evidence C must compare both options.
At least one evidence item MUST be a Strong Advantage.
Responses that violate these rules are INVALID.

Consider hackathon constraints: time pressure, team skills, demo requirements. Focus on practical implementation within the given timeframe.`;
    } else {
        return `You are Hon. Justice HackCourt, a strict technical judge. ${judgePhilosophy}

You MUST NOT override judge philosophy unless constraints make it impossible.

Recommend a technology stack and respond with ONLY a valid JSON object matching this exact schema:

{
  "mode": "advisory",
  "stackName": "Descriptive stack name",
  "stack": ["Technology 1", "Technology 2", "Technology 3"],
  "reasoning": "One sentence explaining why this stack is recommended",
  "evidence": [
    {
      "id": "A",
      "title": "Evidence title",
      "explanation": "Evidence explanation",
      "beneficiary": "Stack name (must match stackName)"
    }
  ],
  "rejectedAlternatives": ["Alternative 1", "Alternative 2"]
}

You MUST return exactly 3 evidence items.
Each evidence item must include id (A, B, C), title, explanation, and beneficiary.
The beneficiary must always be the recommended stack name.
Responses with fewer than 3 evidence items are INVALID.

Consider hackathon constraints: time pressure, team skills, demo requirements. Recommend proven technologies that can deliver results quickly.`;
    }
}


/**
/**
 * Validate AI response against strict JSON schemas
 * @param {Object} response - AI response to validate
 * @param {string} mode - 'compare' or 'advisory'
 * @returns {Object|null} Validated response or null if invalid
 */
function validateAIResponse(response, mode) {
    console.log('AI Engine: Validating response for mode:', mode);
    
    if (!response || typeof response !== 'object') {
        console.warn('AI Engine: Invalid response - not an object');
        return null;
    }
    
    // Force mode to match frontend expectation (don't trust AI mode value)
    response.mode = mode;
    
    if (mode === 'compare') {
        return validateCompareResponse(response);
    } else if (mode === 'advisory') {
        return validateAdvisoryResponse(response);
    }
    
    console.warn('AI Engine: Invalid mode:', mode);
    return null;
}

/**
 * Validate compare mode response
 * @param {Object} response - Response to validate
 * @returns {Object|null} Validated response or null
 */
function validateCompareResponse(response) {
    const required = ['mode', 'winner', 'confidence', 'reasoning', 'evidence'];
    
    for (const field of required) {
        if (!response[field]) {
            console.warn(`AI Engine: Missing required field: ${field}`);
            return null;
        }
    }
    
    if (!['Option A', 'Option B'].includes(response.winner)) {
        console.warn('AI Engine: Invalid winner value');
        return null;
    }
    
    if (!['high', 'medium', 'low'].includes(response.confidence)) {
        console.warn('AI Engine: Invalid confidence value');
        return null;
    }
    
    if (!Array.isArray(response.evidence)) {
        console.warn('AI Engine: Evidence must be an array');
        return null;
    }
    
    // Validate evidence structure
    for (const evidence of response.evidence) {
        if (!evidence.id || !evidence.title || !evidence.explanation) {
            console.warn('AI Engine: Invalid evidence structure');
            return null;
        }
    }
    
    // Check for advisory contamination
    if (response.stackName || response.stack || response.rejectedAlternatives) {
        console.warn('AI Engine: Advisory contamination detected in compare response');
        return null;
    }
    
    console.log('AI Engine: Compare response validated successfully');
    return response;
}

/**
 * Validate advisory mode response
 * @param {Object} response - Response to validate
 * @returns {Object|null} Validated response or null
 */
function validateAdvisoryResponse(response) {
    const required = ['mode', 'stackName', 'stack', 'reasoning', 'evidence'];
    
    for (const field of required) {
        if (!response[field]) {
            console.warn(`AI Engine: Missing required field: ${field}`);
            return null;
        }
    }
    
    if (!Array.isArray(response.stack)) {
        console.warn('AI Engine: Stack must be an array');
        return null;
    }
    
    if (!Array.isArray(response.evidence)) {
        console.warn('AI Engine: Evidence must be an array');
        return null;
    }
    
    // Validate evidence structure
    for (const evidence of response.evidence) {
        if (!evidence.id || !evidence.title || !evidence.explanation) {
            console.warn('AI Engine: Invalid evidence structure');
            return null;
        }
    }
    
    // Ensure rejectedAlternatives is always an array
    if (!response.rejectedAlternatives || !Array.isArray(response.rejectedAlternatives)) {
        response.rejectedAlternatives = [];
    }
    
    // Check for compare contamination
    if (response.winner && ['Option A', 'Option B'].includes(response.winner)) {
        console.warn('AI Engine: Compare contamination detected in advisory response');
        return null;
    }
    
    // POST-VALIDATION SAFETY CHECKS
    // If rejectedAlternatives.length < 3 → return null (trigger deterministic fallback)
    if (response.rejectedAlternatives.length < 3) {
        console.warn('AI Engine: Advisory mode requires minimum 3 rejectedAlternatives, triggering fallback');
        return null;
    }
    
    // If evidence.length !== 3 → return null
    if (response.evidence.length !== 3) {
        console.warn('AI Engine: Advisory mode requires exactly 3 evidence items, triggering fallback');
        return null;
    }
    
    // If no "Strong Advantage" exists → return null
    const hasStrongAdvantage = response.evidence.some(e => 
        e.advantage === 'Strong Advantage' || e.advantage === 'winner'
    );
    if (!hasStrongAdvantage) {
        console.warn('AI Engine: Advisory mode requires at least one Strong Advantage, triggering fallback');
        return null;
    }
    
    console.log('AI Engine: Advisory response validated successfully');
    return response;
}

/**
 * Get Groq API key from config or localStorage
 * @returns {string|null} API key or null if not found
 */
function getGroqAPIKey() {
    // First check config
    if (window.HACKCOURT_CONFIG && window.HACKCOURT_CONFIG.GROQ_API_KEY) {
        return window.HACKCOURT_CONFIG.GROQ_API_KEY;
    }
    
    // Fallback to localStorage
    const apiKey = localStorage.getItem('groq-api-key');
    if (apiKey) {
        return apiKey;
    }
    
    // No key found - log warning once and return null
    console.warn('AI Engine: No Groq API key configured. Using deterministic decision engine.');
    return null;
}

// Export the main function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getAIVerdict };
} else {
    window.getAIVerdict = getAIVerdict;
}