import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
};

const weeklyData = [
  { day: "Mon", completed: 5, pending: 3 },
  { day: "Tue", completed: 7, pending: 2 },
  { day: "Wed", completed: 6, pending: 4 },
  { day: "Thu", completed: 8, pending: 5 },
  { day: "Fri", completed: 9, pending: 3 },
  { day: "Sat", completed: 4, pending: 6 },
  { day: "Sun", completed: 3, pending: 5 },
];

export default function Dashboard() {
  const [range, setRange] = React.useState<"week" | "month">("week");

  const totalCompleted = weeklyData.reduce((acc, d) => acc + d.completed, 0);
  const totalPending = weeklyData.reduce((acc, d) => acc + d.pending, 0);
  const total = totalCompleted + totalPending;

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your tasks and activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Beta</Badge>
          <Button variant="outline" onClick={() => setRange(range === "week" ? "month" : "week")}>{range === "week" ? "Switch to Monthly" : "Switch to Weekly"}</Button>
          <Button>New Task</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across the selected range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{totalCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Great job! Keep going.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{totalPending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Items waiting for your attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Activity</CardTitle>
                <CardDescription>Weekly breakdown of completed and pending tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={weeklyData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="completed" stroke="var(--color-completed)" fill="var(--color-completed)" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="pending" stroke="var(--color-pending)" fill="var(--color-pending)" fillOpacity={0.2} />
                    <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>High-level signals from your recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Most productive day: Friday</li>
                  <li>Consider clearing pending tasks from the weekend</li>
                  <li>You're on track to complete more tasks this week</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
