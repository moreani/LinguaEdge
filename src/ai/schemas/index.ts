import { CorrectionResult, MistakeCategory, Exercise, CEFRLevel } from '../../types';

export interface StructuredCorrectionResponse {
  type: 'correction';
  correct: boolean;
  original: string;
  corrected: string;
  explanation: string;
  ruleSummary?: string;
  topic: MistakeCategory;
  severity: 'minor' | 'moderate' | 'critical';
  replyToContinue: string;
  nextExercise?: {
    prompt: string;
    targetAnswer: string;
  };
}

export interface StructuredExerciseResponse {
  type: 'exercise';
  category: MistakeCategory;
  difficulty: CEFRLevel;
  question: string;
  instruction: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StructuredSummaryResponse {
  type: 'summary';
  practicedTopic: string;
  keyTakeaways: string[];
  topMistakesIdentified: string[];
  encouragement: string;
  recommendedNextTopic: string;
}

/**
 * Validate and safely parse structured JSON output from the local model.
 * Never throws an error; returns fallback if format is invalid.
 */
export function validateCorrectionResponse(rawJson: string, originalInput: string): StructuredCorrectionResponse {
  try {
    // Extract JSON block if surrounded by markdown code fences
    let cleaned = rawJson.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Attempt parse
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.correct === 'boolean' && typeof parsed.explanation === 'string') {
      return {
        type: 'correction',
        correct: parsed.correct,
        original: parsed.original || originalInput,
        corrected: parsed.corrected || originalInput,
        explanation: parsed.explanation,
        ruleSummary: parsed.ruleSummary,
        topic: (parsed.topic as MistakeCategory) || 'general_grammar',
        severity: parsed.severity === 'critical' ? 'critical' : parsed.severity === 'minor' ? 'minor' : 'moderate',
        replyToContinue: parsed.replyToContinue || 'How would you like to continue our conversation?',
        nextExercise: parsed.nextExercise ? {
          prompt: String(parsed.nextExercise.prompt || ''),
          targetAnswer: String(parsed.nextExercise.targetAnswer || '')
        } : undefined
      };
    }
  } catch (err) {
    // Graceful fallback logging (offline diagnostic only)
  }

  // Safe fallback if local LLM returned plain text or malformed JSON
  return {
    type: 'correction',
    correct: true,
    original: originalInput,
    corrected: originalInput,
    explanation: 'Good job! Your sentence is understandable.',
    topic: 'general_grammar',
    severity: 'minor',
    replyToContinue: rawJson.length > 0 && !rawJson.includes('{') 
      ? rawJson 
      : 'That sounds interesting! Tell me more about that.'
  };
}

export function validateExerciseResponse(rawJson: string, fallbackCategory: MistakeCategory, level: CEFRLevel): StructuredExerciseResponse {
  try {
    let cleaned = rawJson.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleaned);
    if (parsed.question && parsed.correctAnswer) {
      return {
        type: 'exercise',
        category: (parsed.category as MistakeCategory) || fallbackCategory,
        difficulty: (parsed.difficulty as CEFRLevel) || level,
        question: parsed.question,
        instruction: parsed.instruction || 'Complete the sentence with the correct form:',
        options: Array.isArray(parsed.options) ? parsed.options : undefined,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation || `The correct answer is "${parsed.correctAnswer}".`
      };
    }
  } catch {
    // Fallback
  }

  // Deterministic fallback exercise
  return {
    type: 'exercise',
    category: fallbackCategory,
    difficulty: level,
    question: 'Yesterday, I ___ (go) to the library to study.',
    instruction: 'Fill in the blank with the correct past tense form:',
    options: ['go', 'went', 'gone', 'going'],
    correctAnswer: 'went',
    explanation: 'We use the simple past "went" because the action happened yesterday.'
  };
}
