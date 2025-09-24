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
  prompt: `You are an expert in train scheduling. Given the scenario, suggest concise, actionable parameter refinements.

**Scenario:** {{{scenarioDescription}}}
**Current KPIs:** {{{currentKpis}}}
**Optimization Goals:** {{{optimizationGoals}}}

Provide the refined parameters as a bulleted list of simple, direct suggestions (e.g., "Reduce freight train holding time to 15 minutes," "Assign Platform 3 for all northbound express trains"). The reasoning should briefly explain the strategy.
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
