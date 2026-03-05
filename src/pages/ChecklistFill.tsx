import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { exportChecklistToPdf } from "@/lib/pdfExport";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Pre-configured responsible persons
const RESPONSIBLE_PERSONS = ["Alec", "Paul", "Cain", "Tanaka", "Vimbai", "Heinrich"];

interface SubmissionItemData {
  id: string;
  item_id: string;
  compliance: boolean | null;
  comments: string;
  responsible_person: string;
  weight_at_submission: number;
  awarded_score: number | null; // Added field for partial scoring
  question: string;
  category_name: string;
  category_number: number;
  category_id: string;
}

const ChecklistFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [templateName, setTemplateName] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [items, setItems] = useState<SubmissionItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSubmission = useCallback(async (subId: string) => {
    // Get submission
    const { data: sub } = await supabase
      .from("submissions")
      .select("*, checklist_templates(name)")
      .eq("id", subId)
      .maybeSingle();

    if (!sub) {
      toast({ title: "Not found", variant: "destructive" });
      navigate("/checklists");
      return;
    }

    const tmpl = sub.checklist_templates as { name?: string } | null;
    setTemplateName(tmpl?.name || "");
    setStatus(sub.status);

    // Get submission items with their related category_items -> template_categories
    const { data: subItems } = await supabase
      .from("submission_items")
      .select("*, category_items(question, sort_order, category_id, template_categories(name, category_number))")
      .eq("submission_id", subId);

    interface SubItemRow {
      id: string;
      item_id: string;
      compliance: boolean | null;
      comments: string | null;
      responsible_person: string | null;
      weight_at_submission: number;
      awarded_score?: number | null;
      category_items: {
        question: string;
        sort_order: number;
        category_id: string;
        template_categories: { name: string; category_number: number } | null;
      } | null;
    }

    const mapped: (SubmissionItemData & { sort_order: number })[] = ((subItems ?? []) as SubItemRow[])
      .map((si) => {
        return {
          id: si.id,
          item_id: si.item_id,
          compliance: si.compliance,
          comments: si.comments || "",
          responsible_person: si.responsible_person || "",
          weight_at_submission: si.weight_at_submission,
          awarded_score: si.awarded_score ?? (si.compliance === true ? si.weight_at_submission : (si.compliance === false ? 0 : null)),
          question: si.category_items?.question || "",
          category_name: si.category_items?.template_categories?.name || "",
          category_number: si.category_items?.template_categories?.category_number || 0,
          category_id: si.category_items?.category_id || "",
          sort_order: si.category_items?.sort_order || 0,
        };
      })
      .sort((a, b) => a.category_number - b.category_number || a.sort_order - b.sort_order);

    setItems(mapped);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (id) loadSubmission(id);
  }, [id, loadSubmission]);

  const updateItem = useCallback((itemId: string, updates: Partial<SubmissionItemData>) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, ...updates } : i)));
  }, []);

  const handleSave = async (complete = false) => {
    setSaving(true);
    try {
      // Update each item
      for (const item of items) {
        await supabase
          .from("submission_items")
          .update({
            comments: item.comments,
            responsible_person: item.responsible_person,
            awarded_score: item.awarded_score,
            compliance: item.awarded_score === item.weight_at_submission ? true : (item.awarded_score === 0 ? false : null),
          })
          .eq("id", item.id);
      }

      const totalScore = items.reduce((sum, i) => sum + (i.awarded_score || 0), 0);
      const maxScore = items.reduce((sum, i) => sum + i.weight_at_submission, 0);

      await supabase
        .from("submissions")
        .update({
          total_score: totalScore,
          max_score: maxScore,
          status: complete ? "completed" : "in_progress",
        })
        .eq("id", id!);

      if (complete) setStatus("completed");
      toast({ title: complete ? "Completed!" : "Saved", description: complete ? "Audit finalized." : "Progress saved." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setSaving(false);
  };

  const exportCSV = () => {
    const categories = [...new Set(items.map((i) => `${i.category_number}. ${i.category_name}`))];
    const headers = ["Category", "Question", "Compliance", "Weight", "Score", "Comments", "Responsible Person"];
    const rows = items.map((i) => {
      let complianceStr = "";
      if (i.awarded_score !== null) {
        if (i.awarded_score === i.weight_at_submission) complianceStr = "Yes";
        else if (i.awarded_score === 0) complianceStr = "No";
        else complianceStr = "Partial";
      }
      return [
        `${i.category_number}. ${i.category_name}`,
        `"${i.question}"`,
        complianceStr,
        i.weight_at_submission.toString(),
        i.awarded_score !== null ? i.awarded_score.toString() : "",
        `"${i.comments}"`,
        `"${i.responsible_person}"`,
      ];
    });
    const totalScore = items.reduce((s, i) => s + (i.awarded_score || 0), 0);
    const maxScore = items.reduce((s, i) => s + i.weight_at_submission, 0);
    rows.push([]);
    rows.push(["", "", "", "Max Score", maxScore.toString(), "", ""]);
    rows.push(["", "", "", "Total Score", totalScore.toString(), "", ""]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${templateName}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading checklist...</p>
      </div>
    </div>
  );

  const totalScore = items.reduce((sum, i) => sum + (i.awarded_score || 0), 0);
  const maxScore = items.reduce((sum, i) => sum + i.weight_at_submission, 0);
  const answeredCount = items.filter((i) => i.awarded_score !== null).length;
  const progressPct = items.length > 0 ? (answeredCount / items.length) * 100 : 0;
  const isReadonly = status === "completed";
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Group by category
  const grouped = items.reduce<Record<string, SubmissionItemData[]>>((acc, item) => {
    const key = `${item.category_number}|${item.category_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const categoryKeys = Object.keys(grouped).sort((a, b) => {
    const numA = parseInt(a.split("|")[0]);
    const numB = parseInt(b.split("|")[0]);
    return numA - numB;
  });

  // Per-step completion info
  const stepCompletions = categoryKeys.map((key) => {
    const g = grouped[key];
    const answered = g.filter((i) => i.awarded_score !== null).length;
    return { total: g.length, answered, complete: answered === g.length };
  });

  const getComplianceStatus = (score: number | null, max: number) => {
    if (score === null) return "Pending";
    if (score === max) return "Yes";
    if (score === 0) return "No";
    return "Partial";
  };

  const getStatusColor = (status: string) => {
    if (status === "Yes") return "text-success";
    if (status === "No") return "text-destructive";
    if (status === "Partial") return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/checklists")} className="shrink-0 self-start sm:self-auto">
              Back
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{templateName}</h1>
                {isReadonly && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Completed
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {answeredCount}/{items.length} questions answered
                </span>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                <span className={`font-medium ${getScoreColor(scorePercentage)}`}>
                  Score: {totalScore}/{maxScore} ({scorePercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Overall Progress</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{Math.round(progressPct)}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categoryKeys.map((key, idx) => {
            const [numStr, catName] = key.split("|");
            const catItems = grouped[key];
            const sc = stepCompletions[idx];
            const catScore = catItems.reduce((s, i) => s + (i.awarded_score || 0), 0);
            const catMax = catItems.reduce((s, i) => s + i.weight_at_submission, 0);
            const catPct = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
            return (
              <Card key={key} className="border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base font-bold shrink-0">
                        {numStr}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {catName}
                        </CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {sc.answered}/{sc.total} answered · Score: {catScore}/{catMax} ({catPct}%)
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs self-start sm:self-auto shrink-0">
                      Section {idx + 1} of {categoryKeys.length}
                    </Badge>
                  </div>
                  {/* Section progress bar */}
                  <div className="mt-3">
                    <Progress
                      value={(sc.answered / sc.total) * 100}
                      className="h-1.5"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead className="w-[100px]">Weight</TableHead>
                        <TableHead className="w-[150px]">Score</TableHead>
                        <TableHead>Comments / Remarks</TableHead>
                        <TableHead className="w-[200px]">Responsible Person</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catItems.map((item, qIdx) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{qIdx + 1}</TableCell>
                          <TableCell>{item.question}</TableCell>
                          <TableCell>
                            <span className={cn("font-medium", getStatusColor(getComplianceStatus(item.awarded_score, item.weight_at_submission)))}>
                              {getComplianceStatus(item.awarded_score, item.weight_at_submission)}
                            </span>
                          </TableCell>
                          <TableCell>{item.weight_at_submission}</TableCell>
                          <TableCell>
                            <Select
                              value={item.awarded_score !== null ? item.awarded_score.toString() : ""}
                              onValueChange={(value) => !isReadonly && updateItem(item.id, { awarded_score: parseInt(value) })}
                              disabled={isReadonly}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select score" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: item.weight_at_submission + 1 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Add comments..."
                              value={item.comments}
                              onChange={(e) => !isReadonly && updateItem(item.id, { comments: e.target.value })}
                              disabled={isReadonly}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.responsible_person}
                              onValueChange={(value) => !isReadonly && updateItem(item.id, { responsible_person: value })}
                              disabled={isReadonly}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select person" />
                              </SelectTrigger>
                              <SelectContent>
                                {RESPONSIBLE_PERSONS.map((person) => (
                                  <SelectItem key={person} value={person}>
                                    {person}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export & Complete Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 pb-8">
          <Button variant="outline" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const pdfCategories = Object.entries(grouped).map(([key, groupItems]) => {
                const [numStr, catName] = key.split("|");
                return {
                  number: parseInt(numStr),
                  name: catName,
                  items: groupItems.map((i) => ({
                    question: i.question,
                    compliance: i.compliance,
                    weight: i.weight_at_submission,
                    score: i.awarded_score || 0,
                    comments: i.comments,
                    responsible_person: i.responsible_person,
                  })),
                };
              });
              exportChecklistToPdf({ templateName, categories: pdfCategories });
            }}
          >
            Export PDF
          </Button>
          <div className="flex-1" />
          {!isReadonly && (
            <>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                {saving ? "Saving..." : "Save Progress"}
              </Button>
              <Button onClick={() => handleSave(true)} disabled={saving}>
                Complete Audit
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChecklistFill;