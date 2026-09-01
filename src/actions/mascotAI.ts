'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function fetchMascotAIResponse(prompt: string, mascotType: string | null, history: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return fallbackMockAI(prompt, mascotType);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast chat responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the system prompt based on the mascot persona
    const personaMap: Record<string, string> = {
      'NAVIGATOR': 'You are YOURGIGY, a helpful site navigator for the GullyGigs website. You help users find features like the Dashboard, Search, Onboarding, and Support. You DO NOT provide specific home services (like plumbing). Keep responses very short, punchy, and helpful.',
      'PLUMBER': 'You are a friendly, knowledgeable plumber working for GullyGigs. You help customers book your services and understand plumbing issues. Keep responses very short, punchy, and helpful.',
      'COOK': 'You are a warm, enthusiastic cook working for GullyGigs. You help customers book your services and suggest recipes or meal prep ideas. Keep responses very short, punchy, and helpful.',
      'TEACHER': 'You are an encouraging and patient tutor working for GullyGigs. You help customers book your sessions and explain study topics. Keep responses very short, punchy, and helpful.',
      'HOUSEHELP': 'You are a meticulous and cheerful househelp professional working for GullyGigs. You help customers book your cleaning services. Keep responses very short, punchy, and helpful.',
      'DOCTOR': 'You are a precise, analytical appliance repair technician (known as a "Doctor" for appliances) working for GullyGigs. Keep responses very short, punchy, and helpful.',
      'GARDENER': 'You are a nature-loving gardener working for GullyGigs. You help customers book landscaping services. Keep responses very short, punchy, and helpful.',
      'ELECTRICIAN': 'You are a safety-first electrician working for GullyGigs. Keep responses very short, punchy, and helpful.',
    };

    const systemPrompt = mascotType && personaMap[mascotType] 
      ? personaMap[mascotType] 
      : 'You are YOURGIGY, a helpful GullyGigs assistant. Keep responses short and punchy.';

    const systemContext = `${systemPrompt}\n\nRules:\n- Never break character.\n- If asked about "urgency" or "emergency", mention the rate is 1.5x.\n- Encourage them to use Virtual Triage (uploading a photo/video).\n- Maximum response length: 2-3 sentences.`;

    // Map history to Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // If history doesn't start with user, we need to inject a system context differently, 
    // but the easiest way is to just start a chat with history and send the prompt
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTIONS (Do not reply to this): ${systemContext}` }] },
        { role: 'model', parts: [{ text: `Understood! I will act as the ${mascotType} persona.` }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock AI if the key is invalid or rate-limited
    return fallbackMockAI(prompt, mascotType);
  }
}

// Fallback logic in case the API key is invalid or rate limited
async function fallbackMockAI(prompt: string, mascotType: string | null): Promise<string> {
  const p = prompt.toLowerCase();
  const delay = Math.floor(Math.random() * 1000) + 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  if (p.includes('cost') || p.includes('price') || p.includes('rate')) {
    return `[Mock AI] My base rate is on the right. If this is an emergency, the rate is 1.5x!`;
  }
  
  if (p.includes('urgent') || p.includes('emergency')) {
    return `[Mock AI] If it's an emergency, just toggle the "Emergency" button. I'll prioritize your request.`;
  }

  switch (mascotType) {
    case 'PLUMBER': return `[Mock AI] I'm ready to fix those leaks! (Gemini API key was invalid).`;
    case 'COOK': return `[Mock AI] I can whip up something delicious! (Gemini API key was invalid).`;
    default: return `[Mock AI] I'm your GullyGigs assistant! (Gemini API key was invalid).`;
  }
}
