import { ScenarioForm } from "@/components/scenarios/scenario-form";

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">What-If Scenario Simulation</h1>
      <p className="text-muted-foreground">
        Use our AI-powered tool to refine your strategies. Describe a scenario, input the current KPIs and your goals, and let the AI suggest optimized parameters.
      </p>
      <ScenarioForm />
    </div>
  );
}
