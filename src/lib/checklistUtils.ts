import { ChecklistCategory } from "@/data/checklistData";

export const calculateCategoryScore = (category: ChecklistCategory): number => {
  return category.items.reduce((sum, item) => {
    return sum + (item.compliance === true ? item.weight : 0);
  }, 0);
};

export const calculateCategoryMaxScore = (category: ChecklistCategory): number => {
  return category.items.reduce((sum, item) => sum + item.weight, 0);
};

export const calculateTotalScore = (categories: ChecklistCategory[]): number => {
  return categories.reduce((sum, cat) => sum + calculateCategoryScore(cat), 0);
};

export const calculateTotalMaxScore = (categories: ChecklistCategory[]): number => {
  return categories.reduce((sum, cat) => sum + calculateCategoryMaxScore(cat), 0);
};

export const getCompletedCount = (categories: ChecklistCategory[]): number => {
  return categories.reduce((sum, cat) => {
    return sum + cat.items.filter((item) => item.compliance !== null).length;
  }, 0);
};

export const getTotalItemCount = (categories: ChecklistCategory[]): number => {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0);
};

export const exportToCSV = (categories: ChecklistCategory[]): void => {
  const headers = ["Category", "Question", "Compliance (Yes/No)", "Weight", "Score", "Comments", "Responsible Person"];
  const rows = categories.flatMap((cat) =>
    cat.items.map((item) => [
      `${cat.number}. ${cat.name}`,
      `"${item.question}"`,
      item.compliance === null ? "" : item.compliance ? "Yes" : "No",
      item.weight.toString(),
      (item.compliance === true ? item.weight : 0).toString(),
      `"${item.comments}"`,
      `"${item.responsiblePerson}"`,
    ])
  );

  const totalScore = calculateTotalScore(categories);
  const maxScore = calculateTotalMaxScore(categories);
  rows.push([]);
  rows.push(["", "", "", "Sub Total Score", maxScore.toString(), "", ""]);
  rows.push(["", "", "", "Final Total Score", totalScore.toString(), "", ""]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `HC_Audit_Checklist_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const saveChecklist = (categories: ChecklistCategory[]): void => {
  localStorage.setItem("qa-checklist-data", JSON.stringify(categories));
  localStorage.setItem("qa-checklist-saved-at", new Date().toISOString());
};

export const loadChecklist = (): ChecklistCategory[] | null => {
  const data = localStorage.getItem("qa-checklist-data");
  return data ? JSON.parse(data) : null;
};

export const getSavedAt = (): string | null => {
  return localStorage.getItem("qa-checklist-saved-at");
};
