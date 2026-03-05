
import { describe, it, expect } from 'vitest';

// Mock data structures based on the application types
interface CategoryItem {
  weight: number;
  compliance: boolean | null;
  awarded_score?: number | null;
}

interface Category {
  items: CategoryItem[];
}

interface Template {
  template_categories: {
    category_items: {
      weight: number;
    }[];
  }[];
}

// Logic extracted from TemplateEditor.tsx
const calculateTotalWeight = (categories: { items: { weight: number }[] }[]) => {
  return categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.weight, 0), 0);
};

// Logic extracted from ChecklistFill.tsx
const calculateScore = (items: CategoryItem[]) => {
  const totalScore = items.reduce((sum, i) => sum + (i.awarded_score || 0), 0);
  const maxScore = items.reduce((sum, i) => sum + i.weight, 0);
  return { totalScore, maxScore };
};

// Logic extracted from Templates.tsx / NewChecklist.tsx
const getTemplateMaxScore = (t: Template) => {
  return t.template_categories?.reduce((sum, cat) => 
    sum + (cat.category_items?.reduce((s, i) => s + i.weight, 0) || 0)
  , 0) || 0;
};

describe('Weight Calculation Logic', () => {
  it('should calculate total weight correctly for TemplateEditor', () => {
    const categories = [
      { items: [{ weight: 10 }, { weight: 20 }] },
      { items: [{ weight: 30 }, { weight: 40 }] }
    ];
    expect(calculateTotalWeight(categories)).toBe(100);
  });

  it('should validate if total weight is not 100', () => {
    const categories = [
      { items: [{ weight: 10 }, { weight: 20 }] }
    ];
    expect(calculateTotalWeight(categories)).toBe(30);
    expect(calculateTotalWeight(categories) === 100).toBe(false);
  });

  it('should calculate score correctly for ChecklistFill with partial scoring', () => {
    const items = [
      { weight: 10, compliance: true, awarded_score: 10 },  // Full points
      { weight: 20, compliance: false, awarded_score: 0 },  // Zero points
      { weight: 30, compliance: null, awarded_score: null }, // Unanswered
      { weight: 40, compliance: null, awarded_score: 25 }   // Partial points (25/40)
    ];
    const { totalScore, maxScore } = calculateScore(items);
    expect(totalScore).toBe(35); // 10 + 0 + 0 + 25
    expect(maxScore).toBe(100);
  });

  it('should calculate max score correctly for Templates list', () => {
    const template: Template = {
      template_categories: [
        {
          category_items: [{ weight: 50 }]
        },
        {
          category_items: [{ weight: 25 }, { weight: 25 }]
        }
      ]
    };
    expect(getTemplateMaxScore(template)).toBe(100);
  });
});
