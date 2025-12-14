// Learning Insight Dashboard Types

export interface StudentRecord {
  studentId: string;
  studentName: string;
  cohort: string;
  module: string;
  date: string;
  durationMinutes: number;
  score: number;
  completed: boolean;
}

export interface KPISummary {
  totalStudents: number;
  avgScore: number;
  completionRate: number;
  avgTimeSpent: number;
}

export interface TrendData {
  date: string;
  avgScore: number;
}

export interface ModulePerformance {
  module: string;
  avgScore: number;
  count: number;
  stdDev?: number;
}

export interface CompletionStatus {
  status: "completed" | "in-progress" | "not-started";
  count: number;
  percentage: number;
}

export interface EngagementData {
  date: string;
  studyMinutes: number;
}

export interface ScoreTimeCorrelation {
  studentId: string;
  studentName: string;
  avgScore: number;
  totalMinutes: number;
}

export interface InsightSummary {
  kpi: KPISummary;
  trend: TrendData[];
  modulePerformance: ModulePerformance[];
  completionStatus: CompletionStatus[];
  engagement: EngagementData[];
  scoreTimeCorrelation: ScoreTimeCorrelation[];
}

export interface StudentDetail {
  studentId: string;
  studentName: string;
  cohort: string;
  avgScore: number;
  completionRate: number;
  totalTimeSpent: number;
  moduleScores: { module: string; score: number; completed: boolean }[];
}

export interface MLRecommendation {
  type: "focus" | "practice" | "review";
  module: string;
  reason: string;
}

export interface FilterOptions {
  startDate: string;
  endDate: string;
  cohort: string;
  module: string;
  searchQuery: string;
}
