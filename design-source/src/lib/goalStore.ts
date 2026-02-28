// Simple cross-page goal store using localStorage + custom events
export interface ConvertedGoal {
  id: string;
  title: string;
  emoji: string;
  category: string;
  sourceBoard: string;
  steps: string[];
}

const STORAGE_KEY = "lifeos_converted_goals";

export const saveConvertedGoal = (goal: ConvertedGoal) => {
  const existing = getConvertedGoals();
  existing.push(goal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  window.dispatchEvent(new Event("goals-updated"));
};

export const getConvertedGoals = (): ConvertedGoal[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const clearConvertedGoals = () => {
  localStorage.removeItem(STORAGE_KEY);
};
