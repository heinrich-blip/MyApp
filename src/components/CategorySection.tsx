import { ChecklistCategory, ChecklistItem } from "@/data/checklistData";
import { calculateCategoryMaxScore, calculateCategoryScore } from "@/lib/checklistUtils";
import { useState } from "react";
import ChecklistItemRow from "./ChecklistItemRow";

interface CategorySectionProps {
  category: ChecklistCategory;
  onUpdateItem: (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
}

const CategorySection = ({ category, onUpdateItem }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const score = calculateCategoryScore(category);
  const maxScore = calculateCategoryMaxScore(category);
  const answered = category.items.filter((i) => i.compliance !== null).length;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const completionPercentage = Math.round((answered / category.items.length) * 100);

  // Determine status label
  const getStatusLabel = () => {
    if (answered === 0) return "Not started";
    if (percentage >= 75) return "Strong";
    if (percentage >= 50) return "Moderate";
    return "Needs attention";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group"
      >
        <div className="relative px-6 py-5">
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="relative flex items-center justify-between">
            {/* Left section - Category info */}
            <div className="flex items-center gap-4">
              {/* Expand/collapse icon */}
              <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-muted-foreground">
                {isOpen ? "−" : "+"}
              </div>

              {/* Category number badge */}
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                {category.number}
              </div>

              {/* Category name and metadata */}
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {category.items.length} items • {answered} completed
                </p>
              </div>
            </div>

            {/* Right section - Progress and score */}
            <div className="flex items-center gap-6">
              {/* Status label */}
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">{getStatusLabel()}</span>
              </div>

              {/* Progress bar */}
              <div className="w-32">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Score badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {score}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    /{maxScore}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${percentage >= 75
                      ? "bg-success/10 text-success"
                      : percentage >= 50
                        ? "bg-warning/10 text-warning"
                        : answered > 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {answered > 0 ? `${percentage}% score` : "Not started"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content - Items grid */}
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          {/* Column headers - hidden on mobile */}
          <div className="hidden md:grid grid-cols-[auto_1fr_100px_120px_1fr] gap-3 lg:gap-4 px-4 lg:px-6 py-2 lg:py-3 bg-gray-100/80 dark:bg-gray-800/80 text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
            <span className="w-6 lg:w-8 text-center">#</span>
            <span>Question</span>
            <span className="text-center">Compliance</span>
            <span className="text-center">Score</span>
            <span>Details / Notes</span>
          </div>

          {/* Item rows */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {category.items.map((item, idx) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                index={idx}
                onUpdate={(itemId, updates) => onUpdateItem(category.id, itemId, updates)}
              />
            ))}
          </div>

          {/* Category summary footer */}
          <div className="px-4 lg:px-6 py-3 lg:py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                <span className="text-gray-600 dark:text-gray-400">Category summary</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Compliant: {category.items.filter(i => i.compliance === true).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Non-compliant: {category.items.filter(i => i.compliance === false).length}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;