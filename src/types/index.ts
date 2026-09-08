export type SupportedLanguage = 
  | 'Spanish' 
  | 'French' 
  | 'German' 
  | 'Japanese' 
  | 'English' 
  | 'Italian' 
  | 'Portuguese' 
  | 'Mandarin'
  | 'Korean'
  | 'Hindi'
  | 'Marathi';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type LearningGoal = 
  | 'travel' 
  | 'career' 
  | 'conversational_fluency' 
  | 'exam_prep' 
  | 'cultural_interest';

export interface UserProfile {
  id: string;
  nativeLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  level: CEFRLevel;
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string; // ISO date string
  createdAt: string;
}

export type ConversationTopic = 
  | 'Ordering at a Restaurant' 
  | 'Airport & Travel Directions' 
  | 'Daily Routine & Hobbies' 
  | 'Shopping & Bargaining' 
  | 'Job Interview & Career' 
  | 'Making New Friends' 
  | 'Doctor & Health Visit' 
  | 'Weekend Plans & Culture';

export interface Conversation {
  id: string;
  topic: ConversationTopic | string;
  targetLanguage: SupportedLanguage;
  createdAt: string;
  durationSeconds: number;
  messageCount: number;
  summary?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  correction?: CorrectionResult;
}

export interface CorrectionResult {
  isCorrect: boolean;
  originalText: string;
  correctedText: string;
  explanation: string;
  ruleSummary?: string;
  category: MistakeCategory;
  severity: 'minor' | 'moderate' | 'critical';
  nextExercise?: {
    prompt: string;
    targetAnswer: string;
  };
}

export type MistakeCategory = 
  | 'past_tense' 
  | 'prepositions' 
  | 'articles' 
  | 'verb_agreement' 
  | 'word_order' 
  | 'vocabulary_choice' 
  | 'pronouns' 
  | 'pluralization'
  | 'general_grammar';

export interface MistakeRecord {
  id: string;
  messageId?: string;
  category: MistakeCategory;
  originalText: string;
  correctedText: string;
  explanation: string;
  severity: 'minor' | 'moderate' | 'critical';
  frequency: number;
  lastSeen: string;
  weaknessScore: number; // calculated weakness metric
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
  exampleSentence: string;
  exampleTranslation: string;
  targetLanguage: SupportedLanguage;
  confidence: number; // 0 to 5
  reviewCount: number;
  lastReviewed?: string;
  nextReview: string; // ISO date string
  intervalDays: number; // SM-2 interval
  easeFactor: number; // SM-2 ease factor (default 2.5)
}

export type ExerciseType = 
  | 'fill_blank' 
  | 'multiple_choice' 
  | 'sentence_correction' 
  | 'translate_sentence' 
  | 'vocab_recall' 
  | 'free_response';

export interface Exercise {
  id: string;
  type: ExerciseType;
  category: MistakeCategory;
  difficulty: CEFRLevel;
  question: string;
  instruction: string;
  context?: string;
  options?: string[]; // for multiple_choice
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface LessonSession {
  id: string;
  type: 'conversation' | 'targeted_practice' | 'vocabulary_review';
  topic: string;
  difficulty: CEFRLevel;
  score: number; // 0-100
  completedAt: string;
  exercisesCompleted: number;
  mistakesCount: number;
}

export interface SkillProgress {
  skill: 'grammar' | 'vocabulary' | 'conversation' | 'listening';
  score: number; // 0 - 100
  trend: 'improving' | 'stable' | 'needs_work';
  updatedAt: string;
}

export interface ModelInfo {
  id: string;
  displayName: string;
  fileName: string;
  format: 'GGUF';
  quantization: string;
  sizeMb: number;
  minRamGb: number;
  recommended: boolean;
  description: string;
  supportedLanguages: SupportedLanguage[];
  checksum: string; // SHA-256
  isInstalled: boolean;
  isLoaded: boolean;
  downloadProgress?: number; // 0 - 100
  status: 'not_installed' | 'downloading' | 'verifying' | 'installed' | 'loaded' | 'error';
}

export type OfflineAIStatus = 
  | 'offline_ready' 
  | 'running_on_device' 
  | 'downloading' 
  | 'model_required' 
  | 'error';
