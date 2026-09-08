import { 
  UserProfile, 
  Message, 
  MistakeRecord, 
  CorrectionResult, 
  Exercise, 
  MistakeCategory, 
  CEFRLevel 
} from '../types';
import { LocalInference } from './inference/types';
import { LlamaCppInference } from './inference/LlamaCppInference';
import { PromptBuilder } from './PromptBuilder';
import { ContextManager } from './ContextManager';
import { 
  validateCorrectionResponse, 
  validateExerciseResponse, 
  StructuredSummaryResponse 
} from './schemas';

export interface ProcessLearnerInput {
  user: UserProfile;
  topic: string;
  learnerInput: string;
  recentMessages: Message[];
  knownWeaknesses: MistakeRecord[];
  onStreamingReplyToken?: (token: string) => void;
}

export interface ProcessLearnerResult {
  correction: CorrectionResult;
  assistantMessageText: string;
  newMistake?: Omit<MistakeRecord, 'id'>;
}

/**
 * TeacherEngine
 * 
 * Central orchestration service.
 * Coordinates PromptBuilder, ContextManager, LocalInference, and Schema Validation.
 * 100% OFFLINE. ZERO CLOUD APIS.
 */
export class TeacherEngine {
  private inference: LocalInference;
  private contextManager: ContextManager;

  constructor(inferenceEngine?: LocalInference) {
    this.inference = inferenceEngine || new LlamaCppInference();
    this.contextManager = new ContextManager(4);
  }

  public getInference(): LocalInference {
    return this.inference;
  }

  /**
   * Start conversation with initial pedagogical teacher greeting
   */
  public async startConversation(
    user: UserProfile, 
    topic: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    const prompt = `System Rules:
You are an encouraging language teacher speaking with a ${user.level} learner.
Target Language: ${user.targetLanguage}
Native Language: ${user.nativeLanguage}
Current lesson: ${topic}

Task: Greet the learner and ask an engaging opening question to start practicing.`;

    return await this.inference.generateText(prompt, { onToken });
  }

  /**
   * Process a learner sentence:
   * 1. Analyze for grammar/usage mistakes
   * 2. Formulate correction and explanation
   * 3. Stream conversational reply
   * 4. Synthesize follow-up exercise
   */
  public async processLearnerSentence(input: ProcessLearnerInput): Promise<ProcessLearnerResult> {
    const trimmedHistory = this.contextManager.trimHistory(input.recentMessages);

    // Build constrained prompt
    const prompt = PromptBuilder.buildCorrectionPrompt({
      user: input.user,
      currentTopic: input.topic,
      weaknesses: input.knownWeaknesses,
      recentMessages: trimmedHistory,
      userInput: input.learnerInput
    });

    // Execute local inference (zero cloud API)
    const rawOutput = await this.inference.generateText(prompt);

    // Validate structured output
    const structured = validateCorrectionResponse(rawOutput, input.learnerInput);

    // If streaming callback provided, deliver reply tokens
    if (input.onStreamingReplyToken) {
      const words = structured.replyToContinue.split(' ');
      for (const word of words) {
        input.onStreamingReplyToken(word + ' ');
      }
    }

    const correction: CorrectionResult = {
      isCorrect: structured.correct,
      originalText: structured.original,
      correctedText: structured.corrected,
      explanation: structured.explanation,
      ruleSummary: structured.ruleSummary,
      category: structured.topic,
      severity: structured.severity,
      nextExercise: structured.nextExercise
    };

    let newMistake: Omit<MistakeRecord, 'id'> | undefined;
    if (!structured.correct) {
      newMistake = {
        category: structured.topic,
        originalText: structured.original,
        correctedText: structured.corrected,
        explanation: structured.explanation,
        severity: structured.severity,
        frequency: 1,
        lastSeen: new Date().toISOString(),
        weaknessScore: structured.severity === 'critical' ? 3.0 : structured.severity === 'moderate' ? 2.0 : 1.0
      };
    }

    return {
      correction,
      assistantMessageText: structured.replyToContinue,
      newMistake
    };
  }

  /**
   * Generates a targeted practice exercise for a specific weak topic
   */
  public async generateExercise(
    category: MistakeCategory, 
    user: UserProfile, 
    topicContext?: string
  ): Promise<Exercise> {
    const prompt = PromptBuilder.buildExercisePrompt(category, user, topicContext);
    const rawOutput = await this.inference.generateText(prompt);
    const validated = validateExerciseResponse(rawOutput, category, user.level);

    return {
      id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: validated.options ? 'multiple_choice' : 'fill_blank',
      category: validated.category,
      difficulty: validated.difficulty,
      question: validated.question,
      instruction: validated.instruction,
      options: validated.options,
      correctAnswer: validated.correctAnswer,
      explanation: validated.explanation
    };
  }

  /**
   * Explains grammar rules simply based on learner CEFR level
   */
  public async explainGrammar(topic: MistakeCategory, level: CEFRLevel): Promise<string> {
    const prompt = `System Rules:
You are a language teacher. Explain the grammar rule for "${topic}" in simple terms for a ${level} learner.
Keep explanation under 70 words. Include one clear example.`;

    return await this.inference.generateText(prompt);
  }

  /**
   * Summarizes a completed conversation session
   */
  public async summarizeLesson(
    topic: string, 
    messages: Message[], 
    mistakes: MistakeRecord[]
  ): Promise<StructuredSummaryResponse> {
    const prompt = PromptBuilder.buildSummaryPrompt(topic, messages, mistakes);
    const rawOutput = await this.inference.generateText(prompt);
    
    try {
      let cleaned = rawOutput.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return JSON.parse(cleaned);
    } catch {
      return {
        type: 'summary',
        practicedTopic: topic,
        keyTakeaways: [
          'Practiced active conversational dialogue',
          'Identified and corrected grammatical patterns',
          'Strengthened vocabulary recall'
        ],
        topMistakesIdentified: mistakes.map(m => m.category).slice(0, 2),
        encouragement: 'Great job! Consistent daily practice is the key to natural fluency.',
        recommendedNextTopic: 'Daily Routine & Hobbies'
      };
    }
  }
}
