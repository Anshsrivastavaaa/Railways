'use server';
/**
 * @fileOverview An AI-powered tool to re-optimize train schedules during disruptions.
 *
 * - reoptimizeOnDisruption - A function that generates a new schedule based on a disruption.
 */

import {ai} from '@/ai/genkit';
import {
  ReoptimizationInputSchema,
  ReoptimizationOutputSchema,
  type ReoptimizationInput,
  type ReoptimizationOutput,
} from '@/lib/types';


export async function reoptimizeOnDisruption(input: ReoptimizationInput): Promise<ReoptimizationOutput> {
  return reoptimizeOnDisruptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reoptimizeOnDisruptionPrompt',
  input: {schema: ReoptimizationInputSchema},
  output: {schema: ReoptimizationOutputSchema},
  prompt: `You are an expert railway traffic controller providing concise, actionable instructions. A disruption has occurred. Your task is to provide a simple, clear, and direct plan to mitigate the disruption's impact.

**Disruption:** {{{disruption.type}}} at {{{disruption.location}}} - "{{{disruption.description}}}"

**Optimization Goals:**
"{{{optimizationGoals}}}"

**Current Train Status:**
{{#each trains}}
- **Train ID:** {{id}} ({{name}}), Priority: {{priority}}, Status: {{status}}
{{/each}}

Provide a bulleted list of specific, simple instructions (e.g., "Stop Train X," "Divert Train Y to alternate route," "Reduce speed for all trains in Section Z"). Be direct and avoid lengthy explanations in the suggestions. The reasoning should briefly explain the overall strategy.
`,
});

const reoptimizeOnDisruptionFlow = ai.defineFlow(
  {
    name: 'reoptimizeOnDisruptionFlow',
    inputSchema: ReoptimizationInputSchema,
    outputSchema: ReoptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
