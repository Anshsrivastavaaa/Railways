
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockDisruptions, mockTrains } from "@/lib/mock-data";
import { Disruption, ReoptimizationOutput } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bot, Loader2 } from "lucide-react";
import { reoptimizeOnDisruption } from "@/ai/flows/reoptimize-on-disruption";
import { useToast } from "@/hooks/use-toast";
import { parseAiError } from "@/lib/ai-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


const statusColors: { [key in Disruption['status']]: string } = {
  'Active': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const typeColors: { [key in Disruption['type']]: string } = {
    'Weather': 'border-blue-500 text-blue-600',
    'Breakdown': 'border-orange-500 text-orange-600',
    'Maintenance': 'border-purple-500 text-purple-600',
};

const newDisruptionSchema = z.object({
    type: z.enum(['Weather', 'Breakdown', 'Maintenance']),
    location: z.string().min(1, 'Location is required'),
    description: z.string().min(1, 'Description is required'),
});

type NewDisruptionForm = z.infer<typeof newDisruptionSchema>;

export default function DisruptionsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<ReoptimizationOutput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewDisruptionForm>({
      resolver: zodResolver(newDisruptionSchema),
  });

  const handleReoptimize = async (disruption: Disruption) => {
    setIsLoading(disruption.id);
    setOptimizationResult(null);
    try {
      const result = await reoptimizeOnDisruption({ 
        disruption,
        trains: mockTrains,
        optimizationGoals: "Maximize section throughput and minimize overall train travel time."
      });
      setOptimizationResult(result);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error re-optimizing schedule:', error);
      const { title, description } = parseAiError(error);
      toast({ variant: 'destructive', title, description });
    } finally {
      setIsLoading(null);
    }
  }

  const handleReportSubmit = (data: NewDisruptionForm) => {
    console.log('New Disruption Reported:', data);
    // Here you would typically send the data to your backend/database
    // For now, we'll just show a success toast and close the modal
    toast({
        title: 'Success',
        description: 'New disruption has been reported.',
    });
    setIsReportModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Disruption Management</h1>
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Report New Disruption
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Report New Disruption</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the network disruption.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleReportSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Disruption Type</Label>
                        <select
                            id="type"
                            {...register('type')}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Breakdown">Breakdown</option>
                            <option value="Weather">Weather</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" {...register('location')} placeholder="e.g., Section NDLS-CNB" />
                        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} placeholder="Describe the issue in detail" />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Report</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Network Disruption Log</CardTitle>
          <CardDescription>
            Log of all current and past network disruptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDisruptions.map((disruption) => (
                <TableRow key={disruption.id}>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-semibold", typeColors[disruption.type])}>{disruption.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{disruption.location}</TableCell>
                  <TableCell>{disruption.description}</TableCell>
                  <TableCell>{disruption.reportedAt}</TableCell>
                   <TableCell>
                    <Badge className={cn("font-semibold", statusColors[disruption.status])}>{disruption.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {disruption.status === 'Active' && (
                      <Button variant="outline" size="sm" onClick={() => handleReoptimize(disruption)} disabled={isLoading === disruption.id}>
                        {isLoading === disruption.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Bot className="mr-2 h-4 w-4" />
                        )}
                        Re-Optimize
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline flex items-center gap-2"><Bot className="text-primary"/> AI Re-optimization Plan</DialogTitle>
            <DialogDescription>
              AI-generated suggestions to mitigate the impact of the disruption.
            </DialogDescription>
          </DialogHeader>
          {optimizationResult && (
            <div className="grid gap-4 py-4">
               <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">New Schedule / Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5">
                    {optimizationResult.reoptimizationSuggestions.split('\n').map((suggestion, index) => (
                      suggestion && <li key={index}>{suggestion.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
               <Card className="bg-accent/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{optimizationResult.reasoning}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
