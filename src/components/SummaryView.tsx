import { ChecklistCategory } from "@/data/checklistData";
import {
  calculateTotalScore,
  calculateTotalMaxScore,
  getCompletedCount,
  getTotalItemCount,
  calculateCategoryScore,
  calculateCategoryMaxScore,
} from "@/lib/checklistUtils";

interface SummaryViewProps {
  categories: ChecklistCategory[];
}

const SummaryView = ({ categories }: SummaryViewProps) => {
  const totalScore = calculateTotalScore(categories);
  const maxScore = calculateTotalMaxScore(categories);
  const completed = getCompletedCount(categories);
  const total = getTotalItemCount(categories);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const completionPercentage = Math.round((completed / total) * 100);
  
  const compliant = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.compliance === true).length,
    0
  );
  const nonCompliant = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.compliance === false).length,
    0
  );
  const pending = total - completed;

  // Determine overall status
  const getOverallStatus = () => {
    if (percentage >= 80) return { label: "Excellent", color: "text-success", bg: "bg-success/10" };
    if (percentage >= 60) return { label: "Good", color: "text-primary", bg: "bg-primary/10" };
    if (percentage >= 40) return { label: "Fair", color: "text-warning", bg: "bg-warning/10" };
    return { label: "Needs Improvement", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const status = getOverallStatus();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with overall status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Summary</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of your checklist performance across all categories
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full ${status.bg}`}>
          <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Main score card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary score card */}
        <div className="md:col-span-1 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-white/80">Overall Score</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">{percentage}</span>
            <span className="text-2xl text-white/60">%</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-white/80">{totalScore}/{maxScore} points</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full mt-6">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Secondary stats grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            label="Completion"
            value={`${completionPercentage}%`}
            sub={`${completed}/${total} items`}
            color="primary"
          />
          <StatCard
            label="Compliant"
            value={compliant.toString()}
            sub={`${Math.round((compliant / total) * 100)}% of total`}
            color="success"
          />
          <StatCard
            label="Non-Compliant"
            value={nonCompliant.toString()}
            sub={`${Math.round((nonCompliant / total) * 100)}% of total`}
            color="destructive"
          />
          <StatCard
            label="Pending"
            value={pending.toString()}
            sub={`${Math.round((pending / total) * 100)}% remaining`}
            color="warning"
          />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Category Performance</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Click categories for details</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {categories.map((cat) => {
            const catScore = calculateCategoryScore(cat);
            const catMax = calculateCategoryMaxScore(cat);
            const catPct = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
            const catCompleted = cat.items.filter(i => i.compliance !== null).length;
            const catTotal = cat.items.length;
            
            return (
              <div 
                key={cat.id} 
                className="group relative px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* Category info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                      {cat.number}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {catCompleted}/{catTotal} items • {cat.items.filter(i => i.compliance === true).length} compliant
                      </p>
                    </div>
                  </div>

                  {/* Progress and score */}
                  <div className="flex items-center gap-6">
                    {/* Progress bar */}
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {Math.round((catCompleted / catTotal) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(catCompleted / catTotal) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{catScore}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">/{catMax}</span>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        catPct >= 75 ? "bg-success/10 text-success" :
                        catPct >= 50 ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {catPct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress indicator line at bottom */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500"
                     style={{ width: `${(catCompleted / catTotal) * 100}%` }} />
              </div>
            );
          })}
        </div>

        {/* Footer with total */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Total Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{totalScore}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {maxScore}</span>
              <span className={`ml-4 text-sm font-semibold ${status.color}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for stat cards
const StatCard = ({ 
  label, 
  value, 
  sub, 
  color = "primary",
}: { 
  label: string; 
  value: string; 
  sub: string; 
  color?: "primary" | "success" | "destructive" | "warning";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]} text-xs font-semibold`}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default SummaryView;