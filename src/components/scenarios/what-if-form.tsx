
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
import { Input } from '../ui/input';

const scenarioSchema = z.object({
  scenarioType: z.enum([
    'engine-failure',
    'track-maintenance',
    'signal-failure',
    'derailment',
    'medical-emergency',
    'security-threat',
    'reroute-train',
    'reschedule-train',
  ]),
  trainId: z.string().optional(),
  trackId: z.string().optional(),
  duration: z.string().optional(),
  newRoute: z.string().optional(),
  rescheduleTime: z.string().optional(),
  optimizationGoals: z.string().min(1, 'Optimization goals are required.'),
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
      scenarioType: undefined,
      trainId: '',
      trackId: '',
      duration: '',
      newRoute: '',
      rescheduleTime: '',
    },
  });

  const scenarioType = form.watch('scenarioType');

  async function onSubmit(values: ScenarioFormValues) {
    setIsLoading(true);
    setAiResult(null);

    let scenarioDescription = '';
    const train = values.trainId ? mockTrains.find(t => t.id === values.trainId) : null;
    
    switch (values.scenarioType) {
      case 'engine-failure':
        scenarioDescription = `What if Train ${train?.name} (${values.trainId}) has an engine failure at ${train?.currentLocation}?`;
        break;
      case 'track-maintenance':
        scenarioDescription = `What if the track section ${values.trackId} is blocked for maintenance for ${values.duration} hours?`;
        break;
      case 'signal-failure':
        scenarioDescription = `What if there is a signal failure on section ${values.trackId} expected to last ${values.duration} hours?`;
        break;
      case 'derailment':
        scenarioDescription = `What if Train ${train?.name} (${values.trainId}) derails near ${train?.currentLocation}?`;
        break;
      case 'medical-emergency':
        scenarioDescription = `What if there is a medical emergency on Train ${train?.name} (${values.trainId}), requiring a ${values.duration} minute stop at the next station?`;
        break;
      case 'security-threat':
        scenarioDescription = `What if a security threat is reported on Train ${train?.name} (${values.trainId})?`;
        break;
      case 'reroute-train':
        scenarioDescription = `What if we change the route of Train ${train?.name} (${values.trainId}) to the following route: ${values.newRoute}?`;
        break;
      case 'reschedule-train':
         scenarioDescription = `What if we reschedule the departure of Train ${train?.name} (${values.trainId}) to ${values.rescheduleTime}?`;
        break;
    }

    try {
      const result = await refineScenarioParameters({
        scenarioDescription,
        currentKpis: 'Overall Punctuality: 82%, Average Delay: 18 min, Track Utilization: 76%',
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
  
  const scenarios = [
    { value: 'engine-failure', label: 'Engine Failure' },
    { value: 'track-maintenance', label: 'Track Maintenance' },
    { value: 'signal-failure', label: 'Signal Failure' },
    { value: 'derailment', label: 'Derailment' },
    { value: 'medical-emergency', label: 'Medical Emergency' },
    { value: 'security-threat', label: 'Security Threat' },
    { value: 'reroute-train', label: 'Reroute a Train' },
    { value: 'reschedule-train', label: 'Reschedule a Train' },
  ];

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
                    <FormLabel>Select a scenario...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a scenario type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {scenarios.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(scenarioType === 'engine-failure' || scenarioType === 'derailment' || scenarioType === 'medical-emergency' || scenarioType === 'security-threat' || scenarioType === 'reroute-train' || scenarioType === 'reschedule-train') && (
                <FormField
                  control={form.control}
                  name="trainId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which train?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a train" />
                          </SelectTrigger>
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

              {(scenarioType === 'track-maintenance' || scenarioType === 'signal-failure') && (
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
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...new Set(mockDisruptions.map(d => d.location))].map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(scenarioType === 'track-maintenance' || scenarioType === 'signal-failure' || scenarioType === 'medical-emergency') && (
                 <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration (in minutes)?</FormLabel>
                      <FormControl>
                         <Input type="number" placeholder="e.g., 60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {scenarioType === 'reroute-train' && (
                  <FormField
                    control={form.control}
                    name="newRoute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is the new route?</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the new route (e.g., via Panvel, then to Vasai Road)" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              {scenarioType === 'reschedule-train' && (
                 <FormField
                  control={form.control}
                  name="rescheduleTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Departure Time</FormLabel>
                      <FormControl>
                         <Input type="time" {...field} />
                      </FormControl>
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
                      <Textarea placeholder="What are you trying to achieve? (e.g., maximize throughput, minimize delays)..." {...field} rows={3} />
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
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
                <ul className="list-disc space-y-2 pl-5">
                    {aiResult.refinedParameters.split('\n').map((item, index) => item && <li key={index}>{item.replace(/^- /, '')}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-accent/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Reasoning</CardTitle>
                <CardDescription>The "why" behind the AI's suggestions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{aiResult.reasoning}</p>
              </CardContent>
            </Card>
          </>
        )}
        {!isLoading && !aiResult && (
          <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed">
            <Sparkles className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">AI suggestions will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
