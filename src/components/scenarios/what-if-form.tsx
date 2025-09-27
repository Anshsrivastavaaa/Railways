
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { refineScenarioParameters } from '@/ai/flows/what-if-scenario-refinement';
import { RefineScenarioParametersOutput } from '@/lib/types';
import { mockTrains, mockDisruptions } from '@/lib/mock-data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

const scenarioSchema = z.object({
  scenarioType: z.enum(['add-train', 'halt-train', 'change-route', 'track-maintenance']),
  trainId: z.string().optional(),
  newRoute: z.string().optional(),
  trackId: z.string().optional(),
  optimizationGoals: z.string().min(1, "Optimization goals are required."),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

export function WhatIfForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<RefineScenarioParametersOutput | null>(null);

  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      optimizationGoals: 'Minimize freight delay while maintaining high-priority train punctuality above 95%.',
    },
  });

  const scenarioType = form.watch('scenarioType');

  async function onSubmit(values: ScenarioFormValues) {
    setIsLoading(true);
    setAiResult(null);

    let scenarioDescription = '';
    switch (values.scenarioType) {
        case 'add-train':
            scenarioDescription = `What if we add a new high-priority passenger train to the network?`;
            break;
        case 'halt-train':
            const train = mockTrains.find(t => t.id === values.trainId);
            scenarioDescription = `What if we halt Train ${values.trainId} (${train?.name}) at its current location?`;
            break;
        case 'change-route':
            const trainToReroute = mockTrains.find(t => t.id === values.trainId);
            scenarioDescription = `What if we change the route of Train ${values.trainId} (${trainToReroute?.name}) to the following route: ${values.newRoute}?`;
            break;
        case 'track-maintenance':
            scenarioDescription = `What if Track ID ${values.trackId} is closed for maintenance?`;
            break;
    }

    try {
      const result = await refineScenarioParameters({
        scenarioDescription,
        currentKpis: 'Current KPIs are stable. Rajdhani punctuality is 98%, but average freight delay is 12%.',
        optimizationGoals: values.optimizationGoals,
      });
      setAiResult(result);
    } catch (error) {
      console.error('Error refining scenario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Bot className="text-primary" />
            Scenario Builder
          </CardTitle>
          <CardDescription>Follow the steps to build your what-if scenario.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="scenarioType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What if...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a scenario type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="add-train">I add a new train?</SelectItem>
                        <SelectItem value="halt-train">I halt a train?</SelectItem>
                        <SelectItem value="change-route">I change a train's route?</SelectItem>
                        <SelectItem value="track-maintenance">A track is under maintenance?</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {scenarioType === 'halt-train' && (
                <FormField
                  control={form.control}
                  name="trainId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which train?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a train to halt" />
                          </Trigger>
                        </FormControl>
                        <SelectContent>
                          {mockTrains.map(train => (
                            <SelectItem key={train.id} value={train.id}>
                              {train.name} ({train.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {scenarioType === 'change-route' && (
                <>
                  <FormField
                    control={form.control}
                    name="trainId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which train?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a train to re-route" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            {mockTrains.map(train => (
                              <SelectItem key={train.id} value={train.id}>
                                {train.name} ({train.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={form.control}
                      name="newRoute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What is the new route?</FormLabel>
                           <FormControl>
                             <Textarea placeholder="Describe the new route (e.g., via Panvel, then to Vasai Road)" {...field} rows={2}/>
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </>
              )}

              {scenarioType === 'track-maintenance' && (
                <FormField
                  control={form.control}
                  name="trackId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which track section?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a track section" />
                          </Trigger>
                        </FormControl>
                        <SelectContent>
                          {mockDisruptions.map(d => (
                            <SelectItem key={d.id} value={d.location}>
                              {d.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="optimizationGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optimization Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What are you trying to achieve? (e.g., maximize throughput, minimize delays)..." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading || !scenarioType} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refining...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Refine with AI</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        {isLoading && (
            <Card className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">AI is analyzing your scenario...</p>
            </Card>
        )}
        {aiResult && (
          <>
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Refined Parameters</CardTitle>
                <CardDescription>AI-suggested adjustments to your scenario.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{aiResult.refinedParameters}</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Reasoning</CardTitle>
                <CardDescription>The "why" behind the AI's suggestions.</CardDescription>
              </Header>
              <CardContent>
                <p className="whitespace-pre-wrap">{aiResult.reasoning}</p>
              </CardContent>
            </Card>
          </>
        )}
        {!isLoading && !aiResult && (
             <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed">
                <Sparkles className="h-16 w-16 text-muted-foreground/50"/>
                <p className="mt-4 text-muted-foreground">AI suggestions will appear here.</p>
            </Card>
        )}
      </div>
    </div>
  );
}
