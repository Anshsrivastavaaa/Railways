import { z } from 'zod';

export type Train = {
  id: string;
  name: string;
  type: 'Express' | 'Local' | 'Freight' | 'Special';
  priority: 'High' | 'Medium' | 'Low';
  status: 'On Time' | 'Delayed' | 'Halted' | 'Rerouted';
  currentLocation: string;
  delay: number; // in minutes
  nextStation: string;
  eta: string;
};

export type Kpi = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
};

export type Disruption = {
  id: string;
  type: 'Weather' | 'Breakdown' | 'Maintenance';
  location: string;
  description: string;
  reportedAt: string;
  status: 'Active' | 'Resolved';
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
};

// Schema for Genkit flow: reoptimizeOnDisruption
export const TrainSchema = z.object({
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

export const DisruptionSchema = z.object({
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


// Schema for Genkit flow: whatIfScenarioRefinement
export const RefineScenarioParametersInputSchema = z.object({
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

export const RefineScenarioParametersOutputSchema = z.object({
  refinedParameters: z
    .string()
    .describe('Refined parameters for the what-if scenario, including suggested adjustments to routing, holding, and platform strategies.'),
  reasoning: z
    .string()
    .describe('Explanation of why the suggested parameter adjustments are expected to improve the scenario outcomes.'),
});
export type RefineScenarioParametersOutput = z.infer<typeof RefineScenarioParametersOutputSchema>;
