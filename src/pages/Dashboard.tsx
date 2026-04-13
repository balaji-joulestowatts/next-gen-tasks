import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  // Sample metrics and chart data for the dashboard. Replace with real data hooks as needed.
  const metrics = React.useMemo(
    () => ({
      total: 42,
      completed: 27,
      pending: 15,
    }),
    [],
  );

  const weeklyData = React.useMemo(
    () => [
      { name: "Mon", completed: 3, pending: 2 },
      { name: "Tue", completed: 5, pending: 1 },
      { name: "Wed", completed: 4, pending: 3 },
      { name: "Thu", completed: 6, pending: 2 },
      { name: "Fri", completed: 5, pending: 4 },
      { name: "Sat", completed: 2, pending: 2 },
      { name: "Sun", completed: 2, pending: 1 },
    ],
    [],
  );

  const chartConfig: ChartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1, 220 70% 50%))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2, 160 70% 45%))",
    },
  };

  const recentItems = React.useMemo(
    () => [
      { id: "1", title: "Write docs for API", status: "Completed", date: "2026-04-10" },
      { id: "2", title: "Design landing page", status: "Pending", date: "2026-04-11" },
      { id: "3", title: "Fix auth flow bug", status: "Completed", date: "2026-04-12" },
      { id: "4", title: "Add unit tests", status: "Pending", date: "2026-04-12" },
    ],
    [],
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tasks and activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.total}</div>
            <p className="text-sm text-muted-foreground">Across all lists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.completed}</div>
            <p className="text-sm text-muted-foreground">Well done!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.pending}</div>
            <p className="text-sm text-muted-foreground">Keep going</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span
                        className={
                          item.status === "Completed"
                            ? "text-green-600 dark:text-green-500"
                            : "text-amber-600 dark:text-amber-500"
                        }
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
