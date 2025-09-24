import { mockTrains } from "@/lib/mock-data";
import { Train } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statusColors: { [key in Train['status']]: string } = {
  'On Time': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Delayed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Halted': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Rerouted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

const priorityColors: { [key in Train['priority']]: string } = {
    'High': 'border-primary text-primary',
    'Medium': 'border-yellow-500 text-yellow-600',
    'Low': 'border-gray-400 text-muted-foreground',
};

export default function TrainsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Live Train Status</h1>
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Train Monitoring</CardTitle>
          <CardDescription>
            An overview of all active trains in the network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delay</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Next Station</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell className="font-medium">{train.id}</TableCell>
                  <TableCell>{train.name}</TableCell>
                  <TableCell>{train.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-semibold", priorityColors[train.priority])}>{train.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-semibold", statusColors[train.status])}>{train.status}</Badge>
                  </TableCell>
                  <TableCell className={cn(train.delay > 0 ? 'text-red-600 font-semibold' : 'text-green-600')}>{train.delay} min</TableCell>
                  <TableCell>{train.currentLocation}</TableCell>
                  <TableCell>{train.nextStation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
