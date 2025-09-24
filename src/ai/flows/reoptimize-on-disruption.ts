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
  prompt: `You are an expert railway traffic controller. A disruption has occurred on the network. Your task is to re-optimize the train schedule to mitigate the impact of the disruption.

Analyze the provided disruption details and the current status of all trains. Then, generate a set of actionable suggestions to re-optimize the schedule based on the stated goals.

**Optimization Goals:**
"{{{optimizationGoals}}}"

**Disruption Details:**
- **Type:** {{{disruption.type}}}
- **Location:** {{{disruption.location}}}
- **Description:** {{{disruption.description}}}
- **Status:** {{{disruption.status}}}

**Current Train Status:**
{{#each trains}}
- **Train ID:** {{id}} ({{name}})
  - **Priority:** {{priority}}
  - **Status:** {{status}} (Delay: {{delay}} min)
  - **Location:** {{currentLocation}}
  - **Next Station:** {{nextStation}}
{{/each}}

Based on this information, provide a new optimized schedule and the reasoning for your decisions.
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
