
export enum Quadrant {
  COGNITIVE = 'Cognitive',
  PHYSICAL = 'Physical',
  BIOLOGICAL = 'Biological',
  RELATIONAL = 'Relational',
  CREATIVE = 'Creative',
  ARCHIVES = 'Archives',
  EDU_MANAGER = 'EduManager'
}

export interface Metric {
  label: string;
  value: number;
  max: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface CapsuleStatus {
  co2: number; // ppm
  temp: number; // celsius
  lux: number; // lumens
  noiseCancelling: boolean;
  privacyMode: boolean;
}

export interface LogicAnalysisResult {
  score: number; // 0-100 logic strength
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

// --- Academic Types ---
export type Grade = 
  | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6' 
  | 'Grade 7' | 'Grade 8' | 'Grade 9' 
  | 'Grade 10' | 'Grade 11' | 'Grade 12';

export type Subject = 
  | 'Math' | 'Physics' | 'Chemistry' | 'English' | 'Chinese' 
  | 'Biology' | 'History' | 'Geography' | 'Politics' | 'Science';

export type ErrorType = 'Foundational' | 'Misinterpretation' | 'Careless' | 'None';

export interface KnowledgePoint {
  topic: string; // The Domain/Category (e.g., "Algebra", "Mechanics")
  subTopic: string; // The specific node (e.g., "Linear Equations")
  masteryScore: number;
  lastReviewed: string;
  decayRate: number;
  status: 'critical' | 'review' | 'mastered';
}

export interface AcademicAnalysis {
  subject: Subject;
  ocrText: string;
  errorAttribution: {
    type: ErrorType;
    explanation: string;
  };
  knowledgeMapping: KnowledgePoint[];
}

export interface HomeworkTask {
  id: string;
  subject: Subject;
  description: string;
  estimatedMin: number;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface ExamEvent {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  type: 'Midterm' | 'Final' | 'Entrance' | 'Quiz';
  predictedScore?: number;
}

export interface ExamScore {
  examName: string;
  date: string;
  totalScore: number;
  rank: number;
}

// --- Biological / Rhythm Types ---
export interface FocusInterval {
  hour: string;
  focusScore: number; // 0-100
  recommendation?: string; // e.g., "Math/Physics"
}

// --- Relational / Collaboration Types ---

export type FlowState = 'deep_focus' | 'light_work' | 'idle';
export type FacialExpression = 'Neutral' | 'Happy' | 'Focused' | 'Confused' | 'Frustrated';

export interface EmotionalWeather {
  hrv: number; // Heart Rate Variability (ms) - lower is stress
  status: 'sunny' | 'cloudy' | 'stormy';
  detectedExpression: FacialExpression;
  outburstProbability: number; // 0-100%
  stressIndex: number; // 0-100 calculated stress
}

export interface ResilienceIntervention {
  id: string;
  timestamp: string;
  trigger: string;
  action: string;
  script: string;
}

export interface AIButlerTask {
  id: string;
  timestamp: string;
  type: 'correction' | 'reminder' | 'encouragement';
  description: string;
  savedParentNagging: boolean; // True if this replaced a parent intervention
}

export interface MissionContract {
  title: string;
  target: number;
  current: number;
  unit: string;
  rewardSkin: string;
  status: 'active' | 'completed';
}

export interface ParentTask {
  id: string;
  title: string;
  status: 'active' | 'completed';
  streakDays: number;
}

export interface WisdomInsight {
  category: 'Learning Style' | 'Health' | 'Communication';
  title: string;
  content: string;
  source: string;
}

export interface ChildSystemContext {
  recentExamTrend: 'rising' | 'falling' | 'stable';
  homeworkCompletionRate: number; // percentage
  averageSleepDuration: number; // hours
  recentStressLevel: 'high' | 'medium' | 'low';
  physicalActivityLevel: 'high' | 'medium' | 'low';
}

export interface ParentingScript {
  analysis: string; // Quantitative reasoning
  step1: string; // Validation/Empathy
  step2: string; // Curiosity/Inquiry
  step3: string; // Action/Alliance
}

// --- Sports / Physical Types ---

export type ExerciseType = 'JumpRope' | 'SitUps' | 'PullUps';

export interface ExerciseSession {
  type: ExerciseType;
  reps: number;
  durationSeconds: number;
  formScore: number; // 0-100
  calories: number;
  heartRate: number;
}

export interface GrowthData {
  height: number; // cm
  weight: number; // kg
  growthRateCmPerMonth: number; // e.g., 1.5 cm/month
  bmi: number;
}

export interface SportsAdvice {
  focusArea: string;
  preventionWarning: string;
  customDrill: string;
}

export interface DailyPlanTask {
  id: string;
  title: string;
  status: 'completed' | 'pending';
  target: string;
}

export interface DailyGoal {
  type: 'Steps' | 'Calories' | 'Distance' | 'Duration';
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
  score: number; // raw value
  grade: number; // 0-100 equivalent
}

// --- Quality Education / Creative Types ---
export type QualityEducationCategory = 'Music' | 'Art' | 'Logic' | 'Language';

export interface QualityEduAnalysis {
  category: QualityEducationCategory;
  score: number;
  feedback: string;
  metrics: { 
      label: string; 
      value: string | number; 
      status: 'good' | 'average' | 'poor' 
  }[];
}

export interface ArtAnalysis {
  creativityScore: number;
  techniqueScore: number;
  compositionAnalysis: string;
  colorUsage: string;
  encouragement: string;
}

export interface MusicReport {
  pitchStability: number; // 0-100
  rhythmAccuracy: number; // 0-100
  focusScore: number; // 0-100
  summary: string;
  suggestion: string;
}

// --- Logic Module Types ---
export interface BoardAnalysis {
  winProbability: number; // 0-100 for current player
  criticalMove: string; // e.g., "Q16"
  moveExplanation: string;
  suggestedMoves: { x: number, y: number, type: 'good' | 'bad' }[];
}

export interface CodeDebugHint {
  line?: number;
  hint: string; // Socratic question
  concept: string; // e.g., "Syntax", "Logic"
}

export interface CodingProject {
  title: string;
  description: string;
  steps: { id: number, text: string, done: boolean }[];
}
