import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, startOfWeek, startOfMonth, subWeeks, subMonths } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface SubmissionRow {
  id: string;
  total_score: number | null;
  max_score: number | null;
  status: string;
  updated_at: string;
  checklist_templates: { name: string } | null;
}

const average = (values: number[]) => {
  if (!values.length) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
};

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("submissions")
        .select("id, total_score, max_score, status, updated_at, checklist_templates(name)")
        .eq("status", "completed")
        .not("total_score", "is", null)
        .not("max_score", "is", null)
        .order("updated_at", { ascending: false });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setSubmissions((data as SubmissionRow[]) || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const { weeklySeries, monthlySeries, templateTable, combinedOverall } = useMemo(() => {
    const now = new Date();
    const weekCutoff = subWeeks(now, 1);
    const monthCutoff = subMonths(now, 1);

    const weeklyBuckets = new Map<string, number[]>();
    const monthlyBuckets = new Map<string, number[]>();

    const weeks = Array.from({ length: 8 }, (_, i) => startOfWeek(subWeeks(now, 7 - i), { weekStartsOn: 1 }));
    const months = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(now, 5 - i)));

    const templateStats: Record<string, { weekly: number[]; monthly: number[]; all: number[] }> = {};
    const allPercents: number[] = [];

    submissions.forEach((sub) => {
      if (!sub.total_score || !sub.max_score || sub.max_score === 0) return;
      const percent = Math.round((sub.total_score / sub.max_score) * 100);
      const completedAt = new Date(sub.updated_at);
      const name = sub.checklist_templates?.name || "Unknown Checklist";

      allPercents.push(percent);

      if (!templateStats[name]) {
        templateStats[name] = { weekly: [], monthly: [], all: [] };
      }
      templateStats[name].all.push(percent);
      if (completedAt >= weekCutoff) templateStats[name].weekly.push(percent);
      if (completedAt >= monthCutoff) templateStats[name].monthly.push(percent);

      const weekKey = format(startOfWeek(completedAt, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const monthKey = format(startOfMonth(completedAt), "yyyy-MM-dd");

      if (!weeklyBuckets.has(weekKey)) weeklyBuckets.set(weekKey, []);
      weeklyBuckets.get(weekKey)!.push(percent);

      if (!monthlyBuckets.has(monthKey)) monthlyBuckets.set(monthKey, []);
      monthlyBuckets.get(monthKey)!.push(percent);
    });

    const weeklySeries = weeks.map((start) => {
      const key = format(start, "yyyy-MM-dd");
      return {
        label: format(start, "MMM d"),
        score: average(weeklyBuckets.get(key) || []),
      };
    });

    const monthlySeries = months.map((start) => {
      const key = format(start, "yyyy-MM-dd");
      return {
        label: format(start, "MMM yyyy"),
        score: average(monthlyBuckets.get(key) || []),
      };
    });

    const templateTable = Object.entries(templateStats)
      .map(([name, stats]) => ({
        name,
        weekly: average(stats.weekly),
        monthly: average(stats.monthly),
        combined: average(stats.all),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      weeklySeries,
      monthlySeries,
      templateTable,
      combinedOverall: average(allPercents),
    };
  }, [submissions]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Weekly and monthly performance by checklist</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Combined Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{combinedOverall}%</p>
            <p className="text-xs text-muted-foreground">Average of completed checklists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Weekly Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{weeklySeries[weeklySeries.length - 1]?.score ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Monthly Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{monthlySeries[monthlySeries.length - 1]?.score ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer
              config={{
                score: { label: "Score", color: "var(--color-primary)" },
              }}
              className="h-full"
            >
              <LineChart data={weeklySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer
              config={{
                score: { label: "Score", color: "var(--color-primary)" },
              }}
              className="h-full"
            >
              <LineChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : templateTable.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed checklists yet.</p>
          ) : (
            templateTable.map((row) => (
              <div key={row.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{row.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Weekly: {row.weekly}%</Badge>
                  <Badge variant="outline" className="text-[10px]">Monthly: {row.monthly}%</Badge>
                  <Badge variant="outline" className="text-[10px]">Combined: {row.combined}%</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
