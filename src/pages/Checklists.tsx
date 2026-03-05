import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SubmissionRow {
  id: string;
  status: string;
  total_score: number | null;
  max_score: number | null;
  schedule: string | null;
  next_due: string | null;
  created_at: string;
  updated_at: string;
  checklist_templates: { name: string } | null;
}

const SCHEDULE_LABELS: Record<string, string> = {
  once: "One-time",
  weekly: "Weekly",
  biweekly: "Every 2 Weeks",
  monthly: "Monthly",
};

const Checklists = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("id, status, total_score, max_score, schedule, next_due, created_at, updated_at, checklist_templates(name)")
      .order("created_at", { ascending: false });

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setSubmissions((data as SubmissionRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchSubmissions();
  };

  const today = new Date().toISOString().split("T")[0];
  const scheduledDue = submissions.filter(
    (s) => s.schedule && s.schedule !== "once" && s.next_due
  );
  const overdue = scheduledDue.filter((s) => s.next_due! <= today);
  const upcoming = scheduledDue.filter((s) => s.next_due! > today).slice(0, 5);

  return (
    <div className="p-4 sm:p-5 lg:p-6 xl:p-8 space-y-4 sm:space-y-5 lg:space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">My Checklists</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Your QC audit submissions</p>
        </div>
        <Link to="/checklists/new">
          <Button className="w-full sm:w-auto">New Checklist</Button>
        </Link>
      </div>

      {/* Scheduled Audits Banner */}
      {(overdue.length > 0 || upcoming.length > 0) && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Scheduled Audits
          </h2>

          {overdue.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="py-3 px-3 sm:py-4 sm:px-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm sm:text-base font-semibold text-destructive">Overdue ({overdue.length})</p>
                </div>
                <div className="space-y-2">
                  {overdue.map((s) => (
                    <Link key={s.id} to={`/checklists/${s.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-md bg-background/80 p-2.5 sm:p-3 hover:bg-background transition-colors gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm sm:text-base font-medium text-foreground truncate">{s.checklist_templates?.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive font-medium shrink-0">
                          {SCHEDULE_LABELS[s.schedule!] || s.schedule}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-destructive font-medium shrink-0">
                        Due: {new Date(s.next_due!).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {upcoming.length > 0 && (
            <Card className="border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="py-3 px-3 sm:py-4 sm:px-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300">Upcoming ({upcoming.length})</p>
                </div>
                <div className="space-y-2">
                  {upcoming.map((s) => (
                    <Link key={s.id} to={`/checklists/${s.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-md bg-background/80 p-2.5 sm:p-3 hover:bg-background transition-colors gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm sm:text-base font-medium text-foreground truncate">{s.checklist_templates?.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium shrink-0">
                          {SCHEDULE_LABELS[s.schedule!] || s.schedule}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground font-medium shrink-0">
                        Due: {new Date(s.next_due!).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm sm:text-base py-8">Loading...</p>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12 lg:py-16">
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">No submissions yet.</p>
            <Link to="/checklists/new">
              <Button size="sm" className="w-full sm:w-auto">Start a Checklist</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 sm:py-5">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0 ${s.status === "completed" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                  {s.status === "completed" ? "Done" : "Open"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{s.checklist_templates?.name || "Unknown Template"}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                    <span>· Score: {s.total_score ?? 0}/{s.max_score ?? 0}</span>
                    {s.schedule && s.schedule !== "once" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                        {SCHEDULE_LABELS[s.schedule] || s.schedule}
                      </span>
                    )}
                    {s.next_due && (
                      <span className="inline-flex items-center gap-1 text-xs">
                        Next: {new Date(s.next_due).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <span className={`text-xs sm:text-sm px-2.5 py-1.5 sm:py-1 rounded-full whitespace-nowrap ${s.status === "completed" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                    {s.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                  <Link to={`/checklists/${s.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      {s.status === "in_progress" ? "Continue" : "View"}
                    </Button>
                  </Link>
                  {s.status === "in_progress" && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive w-full sm:w-auto">
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Checklists;
