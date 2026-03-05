import { ChecklistItem } from "@/data/checklistData";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  index: number;
  onUpdate: (id: string, updates: Partial<ChecklistItem>) => void;
}

const ChecklistItemRow = ({ item, index, onUpdate }: ChecklistItemRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getComplianceLabel = () => {
    if (item.compliance === true) return "Compliant";
    if (item.compliance === false) return "Non-compliant";
    return "Pending";
  };

  return (
    <div
      className="group relative grid grid-cols-1 md:grid-cols-[auto_1fr_100px_120px_1fr] gap-2 md:gap-4 items-start py-3 md:py-4 px-3 md:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index number with status indicator */}
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md">
          {index + 1}
        </span>
        {item.compliance !== null && (
          <span className="absolute left-14 top-3 md:top-4 text-xs text-muted-foreground">
            {getComplianceLabel()}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="flex items-start gap-2 md:gap-3 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
          {item.question}
        </p>
        {item.compliance === null && isHovered && (
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5">
            (Select)
          </span>
        )}
      </div>

      {/* Compliance buttons */}
      <div className="flex items-center gap-1.5 md:gap-2 ml-8 md:ml-0">
        <button
          onClick={() => onUpdate(item.id, { compliance: item.compliance === true ? null : true })}
          className={`relative group/btn px-2.5 py-1.5 text-xs rounded-lg transition-all duration-200 ${
            item.compliance === true
              ? "bg-success/10 text-success ring-1 ring-success/20"
              : "text-gray-600 hover:text-success hover:bg-success/5"
          }`}
          title="Mark as compliant"
        >
          Yes
        </button>
        <button
          onClick={() => onUpdate(item.id, { compliance: item.compliance === false ? null : false })}
          className={`relative group/btn px-2.5 py-1.5 text-xs rounded-lg transition-all duration-200 ${
            item.compliance === false
              ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
              : "text-gray-600 hover:text-destructive hover:bg-destructive/5"
          }`}
          title="Mark as non-compliant"
        >
          No
        </button>
      </div>

      {/* Score display */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium hidden sm:inline">Weight</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            {item.weight}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Score</span>
          <span
            className={`text-sm font-bold px-2 py-1 rounded-md ${
              item.compliance === true
                ? "bg-success/10 text-success"
                : item.compliance === false
                ? "bg-destructive/10 text-destructive"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}
          >
            {item.compliance === true ? item.weight : item.compliance === false ? "0" : "—"}
          </span>
        </div>
      </div>

      {/* Comments and responsible person */}
      <div className="flex gap-2 min-w-0">
        <div className="relative flex-1 min-w-[150px]">
          <Input
            placeholder="Add comment..."
            value={item.comments}
            onChange={(e) => onUpdate(item.id, { comments: e.target.value })}
            className="text-xs h-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="relative w-32 shrink-0">
          <Input
            placeholder="Person"
            value={item.responsiblePerson}
            onChange={(e) => onUpdate(item.id, { responsiblePerson: e.target.value })}
            className="text-xs h-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Quick actions tooltip - appears on hover */}
      {isHovered && item.compliance === null && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap">
          Click ✓ or ✗ to set compliance
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default ChecklistItemRow;