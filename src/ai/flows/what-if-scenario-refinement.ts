'use server';
/**
 * @fileOverview An AI-powered tool to refine what-if simulation parameters for train scheduling.
 *
 * - refineScenarioParameters - A function that refines the parameters of a train scheduling scenario.
 */

import {ai} from '@/ai/genkit';
import {
  RefineScenarioParametersInputSchema,
  RefineScenarioParametersOutputSchema,
  type RefineScenarioParametersInput,
  type RefineScenarioParametersOutput,
} from '@/lib/types';

export async function refineScenarioParameters(input: RefineScenarioParametersInput): Promise<RefineScenarioParametersOutput> {
  return refineScenarioParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineScenarioParametersPrompt',
  input: {schema: RefineScenarioParametersInputSchema},
  output: {schema: RefineScenarioParametersOutputSchema},
  prompt: `You are an AI assistant for a busy train traffic controller who needs extremely brief and crisp recommendations. Your suggestions must be direct, one-line commands.

**Scenario Description:** {{{scenarioDescription}}}
**Current KPIs:** {{{currentKpis}}}
**Optimization Goals:** {{{optimizationGoals}}}

Provide the refined parameters as a highly concise, bulleted list of no more than 3 one-line commands. Each command must be immediately actionable (e.g., "- Reduce freight holding time: 15 min", "- Assign Platform 3: Northbound express trains"). The reasoning must be a single, brief sentence explaining the overall strategy.
`,
});

const refineScenarioParametersFlow = ai.defineFlow(
  {
    name: 'refineScenarioParametersFlow',
    inputSchema: RefineScenarioParametersInputSchema,
    outputSchema: RefineScenarioParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
