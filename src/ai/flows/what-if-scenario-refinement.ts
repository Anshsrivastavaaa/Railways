'use server';
/**
 * @fileOverview An AI-powered tool to refine what-if simulation parameters for train scheduling.
 *
 * - refineScenarioParameters - A function that refines the parameters of a train scheduling scenario.
 * - RefineScenarioParametersInput - The input type for the refineScenarioParameters function.
 * - RefineScenarioParametersOutput - The return type for the refineScenarioParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineScenarioParametersInputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A description of the current what-if scenario, including routing, holding, and platform strategies.'),
  currentKpis: z
    .string()
    .describe('The current key performance indicators (KPIs) for the scenario, such as punctuality and average delays.'),
  optimizationGoals: z
    .string()
    .describe('The optimization goals for the scenario, such as maximizing throughput or minimizing delays.'),
});
export type RefineScenarioParametersInput = z.infer<typeof RefineScenarioParametersInputSchema>;

const RefineScenarioParametersOutputSchema = z.object({
  refinedParameters: z
    .string()
    .describe('Refined parameters for the what-if scenario, including suggested adjustments to routing, holding, and platform strategies.'),
  reasoning: z
    .string()
    .describe('Explanation of why the suggested parameter adjustments are expected to improve the scenario outcomes.'),
});
export type RefineScenarioParametersOutput = z.infer<typeof RefineScenarioParametersOutputSchema>;

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
