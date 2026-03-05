import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Schedule = "once" | "weekly" | "biweekly" | "monthly";

const SCHEDULE_OPTIONS: { value: Schedule; label: string; description: string }[] = [
  { value: "once", label: "One-time", description: "Single audit, no recurrence" },
  { value: "weekly", label: "Weekly", description: "Repeats every 7 days" },
  { value: "biweekly", label: "Every 2 Weeks", description: "Repeats every 14 days" },
  { value: "monthly", label: "Monthly", description: "Repeats every 30 days" },
];

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

const NewChecklist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});
  const [startDates, setStartDates] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase
      .from("checklist_templates")
      .select("*, template_categories(category_items(weight))")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        setTemplates(data || []);
        setLoading(false);
      });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTemplateWeight = (t: any) => {
    return t.template_categories?.reduce((sum: number, cat: any) => 
      sum + (cat.category_items?.reduce((s: number, i: any) => s + i.weight, 0) || 0)
    , 0) || 0;
  };

  const handleStart = async (templateId: string) => {
    if (!user) return;
    setCreating(templateId);

    const schedule = schedules[templateId] || "once";
    const startDate = startDates[templateId] || formatDateInput(new Date());
    const nextDue = schedule === "once" ? null : startDate;

    try {
      // Fetch all items for score calculation
      const { data: cats } = await supabase
        .from("template_categories")
        .select("id, category_items(id, weight)")
        .eq("template_id", templateId);

      interface CatItem { id: string; weight: number }
      const allItems = (cats || []).flatMap((c) => (c.category_items || []) as CatItem[]);
      const maxScore = allItems.reduce((sum, i) => sum + i.weight, 0);

      // Create submission
      const { data: sub, error } = await supabase
        .from("submissions")
        .insert({
          template_id: templateId,
          user_id: user.id,
          max_score: maxScore,
          schedule,
          next_due: nextDue,
          schedule_start: schedule === "once" ? null : startDate,
        })
        .select("id")
        .single();
      if (error) throw error;

      // Create blank submission items
      const items = allItems.map((i) => ({
        submission_id: sub.id,
        item_id: i.id,
        weight_at_submission: i.weight,
      }));
      if (items.length > 0) {
        const { error: itemError } = await supabase.from("submission_items").insert(items);
        if (itemError) throw itemError;
      }

      navigate(`/checklists/${sub.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setCreating(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Start New Checklist</h1>
          <p className="text-sm text-muted-foreground">Choose a template to begin your audit</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading templates...</p>
      ) : templates.length === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center text-muted-foreground">
          No active templates available. Ask an admin to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{t.name}</p>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      Max Score: {getTemplateWeight(t)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.description || "No description"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <Select
                  value={schedules[t.id] || "once"}
                  onValueChange={(v) => {
                    const next = v as Schedule;
                    setSchedules((prev) => ({ ...prev, [t.id]: next }));
                    if (next !== "once" && !startDates[t.id]) {
                      setStartDates((prev) => ({ ...prev, [t.id]: formatDateInput(new Date()) }));
                    }
                  }}
                >
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-muted-foreground ml-1.5 text-xs">— {opt.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(schedules[t.id] || "once") !== "once" && (
                  <input
                    type="date"
                    value={startDates[t.id] || formatDateInput(new Date())}
                    onChange={(e) => setStartDates((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    className="h-9 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  />
                )}
                <Button onClick={() => handleStart(t.id)} disabled={creating === t.id} size="sm">
                  {creating === t.id ? "Starting..." : "Start"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewChecklist;
