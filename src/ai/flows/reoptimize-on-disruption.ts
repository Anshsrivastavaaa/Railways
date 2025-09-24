'use server';
/**
 * @fileOverview An AI-powered tool to re-optimize train schedules during disruptions.
 *
 * - reoptimizeOnDisruption - A function that generates a new schedule based on a disruption.
 * - ReoptimizationInput - The input type for the reoptimizeOnDisruption function.
 * - ReoptimizationOutput - The return type for the reoptimizeOnDisruption function.
 */

import {ai} from '@/ai/genkit';
import {Disruption, Train} from '@/lib/types';
import {z} from 'genkit';

const TrainSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Express', 'Local', 'Freight', 'Special']),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(['On Time', 'Delayed', 'Halted', 'Rerouted']),
  currentLocation: z.string(),
  delay: z.number(),
  nextStation: z.string(),
  eta: z.string(),
});

const DisruptionSchema = z.object({
  id: z.string(),
  type: z.enum(['Weather', 'Breakdown', 'Maintenance']),
  location: z.string(),
  description: z.string(),
  reportedAt: z.string(),
  status: z.enum(['Active', 'Resolved']),
});

export const ReoptimizationInputSchema = z.object({
  disruption: DisruptionSchema.describe('The details of the disruption that has occurred.'),
  trains: z.array(TrainSchema).describe('The current status of all relevant trains in the network.'),
  optimizationGoals: z.string().describe('The primary goals for the re-optimization, e.g., minimize overall delay, prioritize high-priority trains.'),
});
export type ReoptimizationInput = z.infer<typeof ReoptimizationInputSchema>;

export const ReoptimizationOutputSchema = z.object({
  reoptimizationSuggestions: z
    .string()
    .describe('A list of specific, actionable suggestions to re-optimize the train schedule. This could include new timings, reroutings, cancellations, or holding patterns for specific trains.'),
  reasoning: z
    .string()
    .describe('A clear explanation of why these suggestions are being made and how they help achieve the optimization goals, considering the disruption.'),
});
export type ReoptimizationOutput = z.infer<typeof ReoptimizationOutputSchema>;

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
