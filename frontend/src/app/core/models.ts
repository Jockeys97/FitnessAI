export type Level = 'beginner' | 'intermediate' | 'advanced';

export type Goal = 'fat_loss' | 'muscle_gain' | 'performance';

export interface PlanDay {
  day: string;
  exercises: string[];
}

export interface Plan {
  id: string;
  summary: string;
  createdAt: string;
  week: PlanDay[];
}

export interface Questionnaire {
  age: number;
  level: Level;
  goal: Goal;
  daysPerWeek: number;
  constraints?: string;
}