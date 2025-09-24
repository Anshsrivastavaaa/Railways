'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPunctualityData } from '@/lib/mock-data';

export function PunctualityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Punctuality by Train Type</CardTitle>
        <CardDescription>On-time vs. Delayed performance analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockPunctualityData} layout="vertical" stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} stroke="hsl(var(--foreground))" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Legend />
              <Bar dataKey="onTime" fill="hsl(var(--chart-2))" stackId="a" name="On Time" />
              <Bar dataKey="delayed" fill="hsl(var(--chart-1))" stackId="a" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
