import { WhatIfForm } from "@/components/scenarios/what-if-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
       <div className="space-y-2">
         <h1 className="text-3xl font-headline font-bold">What-If Scenario Simulation</h1>
         <p className="text-muted-foreground">
            Select a scenario type, fill in the details, and let the AI suggest an optimized operational plan.
         </p>
       </div>
      <WhatIfForm />
    </div>
  );
}
