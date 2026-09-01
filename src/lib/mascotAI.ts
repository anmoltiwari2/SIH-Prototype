import { CustomerMascotKey } from './mascotConfig';

export async function fetchMockMascotResponse(prompt: string, mascotType: CustomerMascotKey | string | null): Promise<string> {
  const p = prompt.toLowerCase();
  
  // Simulate network delay for realism (1.5 - 2.5 seconds)
  const delay = Math.floor(Math.random() * 1000) + 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Contextual triggers based on common user questions during booking
  if (p.includes('cost') || p.includes('price') || p.includes('rate') || p.includes('pay')) {
    return `My base rate is shown on the right. If this is an emergency, the rate is 1.5x. You only pay after I complete the work!`;
  }
  
  if (p.includes('urgent') || p.includes('emergency') || p.includes('fast')) {
    return `If it's an emergency, just toggle the "Emergency (1.5x)" button. I'll drop everything and prioritize your request immediately.`;
  }
  
  if (p.includes('triage') || p.includes('photo') || p.includes('video') || p.includes('upload')) {
    return `You can upload photos or a short video using the Virtual Triage below! It helps me understand exactly what tools I need before I arrive.`;
  }
  
  if (p.includes('hello') || p.includes('hi') || p.includes('hey')) {
    return `Hello! I'm here to help you get this booked smoothly. Ask me anything about the pricing, emergency rates, or triage.`;
  }

  // Persona-specific fallbacks
  switch (mascotType) {
    case 'PLUMBER':
      return `I'm ready to fix those leaks! Make sure to describe the pipe issue clearly, and I'll bring the right wrenches.`;
    case 'COOK':
      return `I can whip up something delicious! Let me know if there are any specific dietary requirements in the description.`;
    case 'TEACHER':
      return `I'm excited to help you learn. Please let me know what specific topics we should cover in our session.`;
    case 'HOUSEHELP':
      return `I'll make your home sparkle! Just let me know which rooms need the most attention.`;
    case 'DOCTOR':
      return `I'll run a full diagnostic on that appliance. Uploading a video of the strange noise it's making really helps!`;
    case 'GARDENER':
      return `Ready to get my hands dirty! Tell me exactly which plants or lawns need tending to.`;
    case 'ELECTRICIAN':
      return `Safety first! Please describe the wiring issue, and avoid touching any exposed wires until I get there.`;
    default:
      return `I'm your GullyGigs assistant! Just fill out the form, upload any helpful photos, and click Book Now when you're ready.`;
  }
}
