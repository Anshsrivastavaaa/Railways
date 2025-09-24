import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage your application preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
