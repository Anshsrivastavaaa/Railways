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
  prompt: `You are an expert in train scheduling and optimization. Given the current what-if scenario, KPIs, and optimization goals, suggest refined parameters to improve the scenario outcomes.

Scenario Description: {{{scenarioDescription}}}
Current KPIs: {{{currentKpis}}}
Optimization Goals: {{{optimizationGoals}}}

Refined Parameters: 
Reasoning: `,
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
