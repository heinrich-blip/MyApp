import { useState, useEffect, useCallback } from "react";
import { createInitialChecklist, ChecklistCategory, ChecklistItem } from "@/data/checklistData";
import {
  saveChecklist,
  loadChecklist,
  getSavedAt,
  exportToCSV,
  calculateTotalScore,
  calculateTotalMaxScore,
  getCompletedCount,
  getTotalItemCount,
} from "@/lib/checklistUtils";
import CategorySection from "@/components/CategorySection";
import SummaryView from "@/components/SummaryView";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type View = "checklist" | "summary";

// Helper functions for styling
const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return "text-success";
  if (percentage >= 60) return "text-warning";
  return "text-destructive";
};

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 80) return "[&>div]:bg-success";
  if (percentage >= 60) return "[&>div]:bg-warning";
  return "[&>div]:bg-destructive";
};

const Index = () => {
  const [categories, setCategories] = useState<ChecklistCategory[]>(() => {
    return loadChecklist() || createInitialChecklist();
  });
  const [view, setView] = useState<View>("checklist");
  const [savedAt, setSavedAt] = useState<string | null>(getSavedAt());
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateItem = useCallback(
    (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : cat
        )
      );
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveChecklist(categories);
      setSavedAt(new Date().toISOString());
      toast({
        title: "Success!",
        description: "Checklist saved successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save checklist.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    exportToCSV(categories);
    toast({
      title: "Exported",
      description: "CSV file has been downloaded.",
      variant: "default",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      const fresh = createInitialChecklist();
      setCategories(fresh);
      localStorage.removeItem("qa-checklist-data");
      localStorage.removeItem("qa-checklist-saved-at");
      setSavedAt(null);
      toast({
        title: "Reset Complete",
        description: "Checklist has been reset to initial state.",
        variant: "default",
      });
    }
  };

  const totalScore = calculateTotalScore(categories);
  const maxScore = calculateTotalMaxScore(categories);
  const completed = getCompletedCount(categories);
  const total = getTotalItemCount(categories);
  const completionPercentage = Math.round((completed / total) * 100);
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Transport Division – Human Capital Audit
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    QA Compliance Checklist v2.0
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <Button
                  variant={view === "checklist" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("checklist")}
                  className={`relative ${
                    view === "checklist" 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  Checklist
                </Button>
                <Button
                  variant={view === "summary" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("summary")}
                  className={`relative ${
                    view === "summary" 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  Summary
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Score Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Score</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalScore}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/{maxScore}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xs font-semibold text-primary">
                    Score
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Score percentage</span>
                    <span className={`text-xs font-semibold ${getScoreColor(scorePercentage)}`}>
                      {scorePercentage}%
                    </span>
                  </div>
                  <Progress 
                    value={scorePercentage} 
                    className={`h-2 ${getProgressBarColor(scorePercentage)}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Completion Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {completed}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/{total}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-xs font-semibold text-success">
                    Done
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-xs font-semibold text-success">{completionPercentage}%</span>
                  </div>
                  <Progress 
                    value={completionPercentage} 
                    className="h-2 [&>div]:bg-success"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pending Items Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Items</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {total - completed}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-xs font-semibold text-warning">
                    Open
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(((total - completed) / total) * 100)}% remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Last Saved Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Saved</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                      {savedAt ? new Date(savedAt).toLocaleTimeString() : '—'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xs font-semibold text-gray-500">
                    Time
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {savedAt ? new Date(savedAt).toLocaleDateString() : 'Not saved yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {categories.length} Categories
              </Badge>
              <Badge variant="outline">
                {completed}/{total} Items
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset all checklist data</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as CSV file</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save current progress</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Content Area */}
          <div className="animate-fade-in">
            {view === "checklist" ? (
              <div className="space-y-6">
                {categories.map((cat) => (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    onUpdateItem={handleUpdateItem}
                  />
                ))}
                
                {/* Final Score Card */}
                <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xs font-semibold text-primary">
                          Score
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Final Total Score
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalScore} / {maxScore}
                          </p>
                        </div>
                      </div>
                      <Badge className={`px-3 py-1 ${
                        scorePercentage >= 80 ? 'bg-success' :
                        scorePercentage >= 60 ? 'bg-warning' :
                        'bg-destructive'
                      }`}>
                        {scorePercentage}% Complete
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <SummaryView categories={categories} />
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;