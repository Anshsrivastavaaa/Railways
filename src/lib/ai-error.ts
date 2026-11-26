/**
 * Parses errors thrown by Genkit / Google AI and returns a user-friendly
 * { title, description } pair for display in toasts or UI.
 *
 * Rules:
 *  - 503 / high demand  → Google overload message (not our fault)
 *  - 429 / quota        → rate-limit message (not our fault)
 *  - 401 / 403          → API key problem (config issue)
 *  - 404                → wrong model name (config issue)
 *  - anything else      → generic fallback
 */
export function parseAiError(error: unknown): { title: string; description: string } {
  const msg = error instanceof Error ? error.message : String(error);

  // 503 — Google server overload
  if (msg.includes('503') || msg.toLowerCase().includes('high demand') || msg.toLowerCase().includes('service unavailable')) {
    return {
      title: 'AI Temporarily Unavailable',
      description:
        "Google's AI servers are currently experiencing high demand. This is not an issue with RailFlow — please try again in a few moments.",
    };
  }

  // 429 — rate limit / quota exceeded
  if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
    return {
      title: 'AI Rate Limit Reached',
      description:
        "Your Google AI API quota has been temporarily exceeded. This is a Google-side limit — please wait a minute and try again.",
    };
  }

  // 401 / 403 — bad or missing API key
  if (msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('unauthorized')) {
    return {
      title: 'AI Authentication Failed',
      description:
        'Your Google AI API key appears to be invalid or missing. Please check your GEMINI_API_KEY in the .env.local file.',
    };
  }

  // 404 — wrong model name
  if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
    return {
      title: 'AI Model Not Found',
      description:
        'The configured AI model could not be found. Please check the model name in src/ai/genkit.ts.',
    };
  }

  // Generic fallback
  return {
    title: 'AI Request Failed',
    description:
      'An unexpected error occurred while contacting the AI. Please try again. If this keeps happening, check the browser console for details.',
  };
}
