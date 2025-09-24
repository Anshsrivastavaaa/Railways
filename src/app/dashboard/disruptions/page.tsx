import { mockDisruptions } from "@/lib/mock-data";
import { Disruption } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const statusColors: { [key in Disruption['status']]: string } = {
  'Active': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const typeColors: { [key in Disruption['type']]: string } = {
    'Weather': 'border-blue-500 text-blue-600',
    'Breakdown': 'border-orange-500 text-orange-600',
    'Maintenance': 'border-purple-500 text-purple-600',
};

export default function DisruptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Disruption Management</h1>
        <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4"/>
            Report New Disruption
        </Button>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
