import { mockAuditLogs } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Audit Trail</h1>
      <Card>
        <CardHeader>
          <CardTitle>Decision & Action Log</CardTitle>
          <CardDescription>
            A chronological record of all user actions and system-generated decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User/System</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>
                    {log.user === 'SYSTEM' ? (
                      <Badge variant="secondary">SYSTEM</Badge>
                    ) : (
                      <Badge variant="outline" className="text-primary border-primary">{log.user}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
