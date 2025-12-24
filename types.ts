
export enum Quadrant {
  COGNITIVE = 'cognitive',
  PHYSICAL = 'physical',
  BIOLOGICAL = 'biological',
  RELATIONAL = 'relational',
  CREATIVE = 'creative',
  EDU_MANAGER = 'edu_manager',
  ARCHIVES = 'archives'
}

export interface CapsuleStatus {
  co2: number;
  temp: number;
  lux: number;
  noiseCancelling: boolean;
  privacyMode: boolean;
}

export interface LogicAnalysisResult {
  score: number;
  summary: string;
  weakness: string;
  suggestion: string;
}

export interface MealPlan {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  recommendation: string;
}

export interface KnowledgePoint {
  topic: string;
  subTopic: string;
  masteryScore: number;
  lastReviewed: string;
  decayRate: number;
  status: 'critical' | 'review' | 'mastered';
}

export type Grade = 
  | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6'
  | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';

export type Subject = 
  | 'Math' | 'Physics' | 'Chemistry' | 'English' | 'Chinese' 
  | 'Biology' | 'History' | 'Geography' | 'Politics' | 'Science';

export interface AcademicAnalysis {
  subject: Subject;
  ocrText: string;
  errorAttribution: {
    type: string;
    explanation: string;
  };
  knowledgeMapping: KnowledgePoint[];
}

export interface HomeworkTask {
  id: string;
  subject: string;
  description: string;
  estimatedMin: number;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ExamEvent {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  type: string;
  predictedScore: number;
}

export interface ExamScore {
  examName: string;
  date: string;
  totalScore: number;
  rank: number;
}

export type FacialExpression = 'Happy' | 'Frustrated' | 'Confused' | 'Focused' | 'Neutral';

export interface EmotionalWeather {
  hrv: number;
  status: 'sunny' | 'cloudy' | 'stormy';
  detectedExpression: FacialExpression;
  outburstProbability: number;
  stressIndex: number;
}

export interface GrowthData {
  height: number;
  weight: number;
  growthRateCmPerMonth: number;
  bmi: number;
}

export interface SportsAdvice {
  focusArea: string;
  preventionWarning: string;
  customDrill: string;
}

export interface ParentingScript {
  analysis: string;
  step1: string;
  step2: string;
  step3: string;
}

export interface ChildSystemContext {
  recentExamTrend: 'rising' | 'falling' | 'stable';
  homeworkCompletionRate: number;
  averageSleepDuration: number;
  recentStressLevel: 'low' | 'medium' | 'high';
  physicalActivityLevel: 'low' | 'medium' | 'high';
}

export interface ArtAnalysis {
  creativityScore: number;
  techniqueScore: number;
  compositionAnalysis: string;
  colorUsage: string;
  encouragement: string;
}

export type QualityEducationCategory = 'Music' | 'Art' | 'Logic' | 'Language';

export interface QualityEduAnalysis {
  category: QualityEducationCategory;
  score: number;
  feedback: string;
  metrics: {
    label: string;
    value: string;
    status: 'good' | 'average' | 'poor';
  }[];
}

export interface MusicReport {
  pitchStability: number;
  rhythmAccuracy: number;
  focusScore: number;
  summary: string;
  suggestion: string;
}

export interface BoardAnalysis {
  winProbability: number;
  criticalMove: string;
  moveExplanation: string;
  suggestedMoves: {
    x: number;
    y: number;
    type: 'good' | 'bad';
  }[];
}

export interface CodeDebugHint {
  hint: string;
  concept: string;
  line?: number;
}

export interface DailyPlanTask {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  target: string;
}

export interface DailyGoal {
  type: string;
  current: number;
  target: number;
  unit: string;
}

export interface GrowthRecord {
  month: string;
  height: number;
  weight: number;
  standardHeight?: number;
  standardWeight?: number;
}

export interface SportsRecord {
  month: string;
  item: string;
  score: number;
  grade: number;
}

export interface FocusInterval {
  hour: string;
  focusScore: number;
  recommendation?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export type FlowState = 'deep_focus' | 'idle';

export interface AIButlerTask {
  id: string;
  timestamp: string;
  type: 'correction' | 'reminder' | 'encouragement';
  description: string;
  savedParentNagging: boolean;
}

export interface MissionContract {
  title: string;
  target: number;
  current: number;
  unit: string;
  rewardSkin: string;
  status: 'active' | 'completed';
}

export interface ResilienceIntervention {
  id: string;
  timestamp: string;
  trigger: string;
  action: string;
  script: string;
}

export interface ParentTask {
  id: string;
  title: string;
  status: 'active' | 'completed';
  streakDays: number;
}

export interface WeeklyReportData {
  music: { sessions: number; duration: number; rhythmScore: number; rhythmImprovement: number };
  art: { pages: number; postureAlerts: number; penAccuracy: number };
  logic: { wins: number; losses: number; tacticalAnalysis: string };
  language: { emotionScore: number; speedIssue: boolean };
  academic: { strongSubject: string; weakSubject: string };
}

export interface WeeklyAIInsight {
  summary: string;
  suggestions: string[];
}
