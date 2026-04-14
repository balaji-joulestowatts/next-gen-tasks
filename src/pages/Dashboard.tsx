import * as React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";
import { LayoutDashboard, Home, CheckSquare, User } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const monthlyData = [
  { month: "Jan", created: 20, completed: 14 },
  { month: "Feb", created: 24, completed: 16 },
  { month: "Mar", created: 28, completed: 22 },
  { month: "Apr", created: 18, completed: 12 },
  { month: "May", created: 30, completed: 25 },
  { month: "Jun", created: 26, completed: 21 },
  { month: "Jul", created: 22, completed: 17 },
  { month: "Aug", created: 27, completed: 23 },
  { month: "Sep", created: 25, completed: 20 },
  { month: "Oct", created: 29, completed: 24 },
  { month: "Nov", created: 21, completed: 16 },
  { month: "Dec", created: 24, completed: 19 },
];

const withRates = monthlyData.map((d) => ({
  ...d,
  completionRate: Number(((d.completed / Math.max(d.created, 1)) * 100).toFixed(1)),
}));

const lineChartConfig = {
  created: { label: "Created", color: "#2563eb" }, // blue-600
  completed: { label: "Completed", color: "#16a34a" }, // green-600
};

const barChartConfig = {
  completionRate: { label: "Completion Rate", color: "#f59e0b" }, // amber-500
};

export default function Dashboard() {
  const totalCreated = monthlyData.reduce((acc, d) => acc + d.created, 0);
  const totalCompleted = monthlyData.reduce((acc, d) => acc + d.completed, 0);
  const overallRate = Number(((totalCompleted / Math.max(totalCreated, 1)) * 100).toFixed(1));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card/50 p-4 md:block">
        <div className="mb-8 flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
        <nav className="space-y-1">
          <SidebarLink to="/" label="Home" icon={Home} />
          <SidebarLink to="/dashboard" label="Overview" icon={LayoutDashboard} />
          <SidebarLink to="/smart-todos" label="Smart Todos" icon={CheckSquare} />
          <SidebarLink to="/profile" label="Profile" icon={User} />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Insights into your tasks performance this year.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Created</CardTitle>
              <CardDescription>All tasks created in the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCreated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Completed</CardTitle>
              <CardDescription>All tasks completed in the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCompleted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avg. Completion Rate</CardTitle>
              <CardDescription>Completed vs. created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Trend</CardTitle>
              <CardDescription>Created and completed per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[320px] w-full">
                <LineChart data={monthlyData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} dy={8} />
                  <YAxis tickLine={false} axisLine={false} dx={-4} />
                  <ChartTooltip cursor={{ stroke: "#e5e7eb" }} content={<ChartTooltipContent />} />
                  <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="created" stroke="var(--color-created)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Percent completed by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[320px] w-full">
                <BarChart data={withRates} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} dy={8} />
                  <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} dx={-4} domain={[0, 100]} />
                  <ChartTooltip cursor={{ fill: "#f5f5f5" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </RouterNavLink>
  );
}
