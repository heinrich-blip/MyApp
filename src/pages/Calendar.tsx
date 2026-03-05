import { useEffect, useMemo, useState } from "react";
import type { DayContentProps } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarView } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DueItem {
  id: string;
  next_due: string | null;
  schedule_start: string | null;
  schedule: string | null;
  checklist_templates: { name: string } | null;
}

function advanceBySchedule(date: Date, schedule: string): Date {
  const next = new Date(date);
  if (schedule === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (schedule === "biweekly") {
    next.setDate(next.getDate() + 14);
  } else if (schedule === "monthly") {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setDate(next.getDate() + 7);
  }
  return next;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    const fetchDue = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("submissions")
        .select("id, next_due, schedule_start, schedule, checklist_templates(name)")
        .neq("schedule", "once")
        .not("next_due", "is", null)
        .order("next_due", { ascending: true });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setItems((data as DueItem[]) || []);
      }
      setLoading(false);
    };

    fetchDue();
  }, [user]);

  const toKey = (d: Date) => d.toISOString().split("T")[0];
  const todayKey = toKey(new Date());

  const occurrences = useMemo(() => {
    const startWindow = new Date();
    const endWindow = new Date();
    endWindow.setDate(endWindow.getDate() + 90);

    const result: { date: string; item: DueItem }[] = [];

    items.forEach((item) => {
      if (!item.schedule || item.schedule === "once") return;
      const baseDate = item.schedule_start || item.next_due;
      if (!baseDate) return;

      let cursor = new Date(baseDate);
      while (cursor < startWindow) {
        cursor = advanceBySchedule(cursor, item.schedule);
      }
      while (cursor <= endWindow) {
        result.push({ date: cursor.toISOString().split("T")[0], item });
        cursor = advanceBySchedule(cursor, item.schedule);
      }
    });

    return result;
  }, [items]);

  const dueDates = useMemo(
    () => occurrences.map((o) => new Date(o.date)),
    [occurrences]
  );

  const entriesByDate = useMemo(() => {
    const map: Record<string, { name: string; schedule: string }[]> = {};
    occurrences.forEach((o) => {
      const key = o.date;
      if (!map[key]) map[key] = [];
      map[key].push({
        name: o.item.checklist_templates?.name || "Untitled Checklist",
        schedule: o.item.schedule || "weekly",
      });
    });
    return map;
  }, [occurrences]);

  const overdue = occurrences.filter((o) => o.date < todayKey);
  const upcoming = occurrences.filter((o) => o.date >= todayKey);

  const selectedCount = selectedDate ? (entriesByDate[toKey(selectedDate)]?.length || 0) : 0;

  const DayEntryContent = ({ date }: DayContentProps) => {
    const key = toKey(date);
    const entries = entriesByDate[key] || [];
    const first = entries[0];
    const remaining = entries.length - 1;

    return (
      <div className="h-full w-full rounded-md border border-transparent p-1.5 text-left hover:border-border/60">
        <div className="text-xs font-medium text-foreground">{date.getDate()}</div>
        {entries.length > 0 && (
          <div className="mt-1 space-y-1">
            <p className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              {first?.name}
            </p>
            {remaining > 0 && (
              <p className="text-[10px] text-muted-foreground">+{remaining} more</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground">Scheduled checklist due dates shown directly on each day</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedDate && (
            <span className="text-xs text-muted-foreground">
              {toKey(selectedDate)} · {selectedCount} due
            </span>
          )}
          {selectedDate && (
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(undefined)}>
              Clear Date
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Due Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <CalendarView
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ due: dueDates }}
                modifiersClassNames={{ due: "bg-primary/5" }}
                components={{ DayContent: DayEntryContent }}
                className="w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-4",
                  table: "w-full border-collapse",
                  head_row: "grid grid-cols-7",
                  row: "grid grid-cols-7 mt-0",
                  head_cell: "rounded-none border border-border/40 py-2 text-xs font-medium text-muted-foreground",
                  cell: "h-24 rounded-none border border-border/40 p-0 align-top",
                  day: "h-full w-full rounded-none p-0 text-left font-normal",
                  day_today: "bg-muted/20",
                  day_outside: "opacity-40",
                }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Overdue events</p>
                  <p className="text-xl font-semibold text-foreground">{overdue.length}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Upcoming events</p>
                  <p className="text-xl font-semibold text-foreground">{upcoming.length}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
