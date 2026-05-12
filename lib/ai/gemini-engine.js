import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

export async function generateAICloserResponse(agentConfig, leadContext, conversationHistory) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not configured.");
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const antiSpamPrompt = `
You are an AI Helper representing a human. 
Your tone is: ${agentConfig.tone || 'Friendly and Casual'}.
Your main goal: ${agentConfig.goal || 'Get them to reply and build rapport.'}

STRICT LINGUISTIC RULES (MODULE 07 NO-BOT POLICY):
1. NO BUZZWORDS: Do not use words like "Revolutionize", "Deep Dive", "Synergy", "Unlock", "Delve", "Leverage", "Optimize".
2. SIMPLICITY: Keep vocabulary to a 5th-grade reading level.
3. CONCISENESS: Your response MUST be under 30 words.
4. HUMAN CONNECTION: Use relational words like "Gotcha", "Makes sense", "Hey".

Lead Profile Data:
- Company: ${leadContext.company || 'Unknown'}
- Position: ${leadContext.position || 'Unknown'}
- Name: ${leadContext.name || 'Unknown'}

Previous Conversation History:
${conversationHistory.slice(-3).map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

Based on the prompt and rules above, generate the NEXT reply from you (the agent). Wait to reply if the user seems aggressive. If they are aggressive, ONLY reply with "[[AGENT_ARCHIVE_ACTION]]".
`;

        const result = await model.generateContent(antiSpamPrompt);
        const responseText = result.response.text();
        
        // Final sanity check constraints
        if (responseText.includes("[[AGENT_ARCHIVE_ACTION]]")) {
            return { action: 'archive', response: null };
        }

        let words = responseText.split(' ');
        if (words.length > 30) {
           words = words.slice(0, 30);
           return { action: 'send', response: words.join(' ') + "..." };
        }

        return { action: 'send', response: responseText };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return { action: 'error', response: null, error: error.message };
    }
}

export async function rewriteRepostCaption(originalCaption, referenceContext) {
    if (!process.env.GEMINI_API_KEY) return originalCaption;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
You are an AI Content Creator.
Your objective is to perform an 'Intelligent Repost' (Module 10).
Rewrite the following caption entirely to avoid 'Duplicate Content' flags. 
Maintain the core value, but change the vocabulary, structure, and Call-to-Action (CTA).
STRICT RULES:
- 0% Plagiarism from the original.
- Zero buzzwords.
- Proper line breaks for readability.

Original Caption:
"${originalCaption}"

Context / Vibe:
${referenceContext}

New Caption:`;
        
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error("Gemini Error:", e);
        return originalCaption;
    }
}
