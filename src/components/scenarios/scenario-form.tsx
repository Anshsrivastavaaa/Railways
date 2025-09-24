'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { refineScenarioParameters, RefineScenarioParametersOutput } from '@/ai/flows/what-if-scenario-refinement';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BotMessageSquare, Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
  scenarioDescription: z.string().min(20, 'Please provide a more detailed scenario description.'),
  currentKpis: z.string().min(10, 'Please describe the current KPIs.'),
  optimizationGoals: z.string().min(10, 'Please specify your optimization goals.'),
});

export function ScenarioForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<RefineScenarioParametersOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenarioDescription: 'Current strategy involves holding freight trains for 30 minutes to allow Rajdhani express to pass at Ghaziabad junction.',
      currentKpis: 'Rajdhani punctuality is 98%, but average freight delay has increased by 15%. Overall network throughput is down 5%.',
      optimizationGoals: 'Minimize freight delay while maintaining high-priority train punctuality above 95%.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await refineScenarioParameters(values);
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
            <BotMessageSquare className="text-primary" />
            Scenario Parameters
          </CardTitle>
          <CardDescription>Define a scenario to get AI-powered refinement suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="scenarioDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scenario Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the current routing, holding, and platform strategies..." {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentKpis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current KPIs</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detail the current performance indicators (e.g., punctuality, delays)..." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Refine with AI
                  </>
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
              </CardHeader>
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
