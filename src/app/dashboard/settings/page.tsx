
'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Manage your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Controller A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="controller@indianrail.gov.in" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Input id="division" defaultValue="NDLS Division" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Theme</CardTitle>
                <CardDescription>
                  Choose between light and dark mode.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5"/>
                    <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        id="theme-switch"
                    />
                    <Moon className="h-5 w-5"/>
                </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                How you receive alerts for critical events.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts" className="flex-grow">System Alerts</Label>
                <Switch id="system-alerts" defaultChecked />
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
