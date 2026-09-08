import { UserProfile, MistakeRecord, Message, MistakeCategory } from '../types';

export interface PromptContext {
  user: UserProfile;
  currentTopic: string;
  weaknesses: MistakeRecord[];
  recentMessages: Message[];
  userInput: string;
}

/**
 * PromptBuilder
 * 
 * Constructs narrow, constrained, task-specific prompts for local on-device models.
 * Following 03_LLM_USAGE_GUIDE.md recommendations:
 * 1. Compact context window (last 2-4 turns).
 * 2. Strict system rules.
 * 3. Structured JSON output specification.
 */
export class PromptBuilder {
  /**
   * Build the prompt for sentence correction and conversational continuation
   */
  public static buildCorrectionPrompt(context: PromptContext): string {
    const { user, currentTopic, weaknesses, recentMessages, userInput } = context;

    const weakTopicsText = weaknesses.length > 0 
      ? weaknesses.slice(0, 3).map(w => `- ${w.category}: "${w.originalText}" → "${w.correctedText}"`).join('\n')
      : '- None identified yet';

    const recentTurnsText = recentMessages
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'Learner' : 'Teacher'}: ${m.content}`)
      .join('\n');

    return `System Rules:
You are an encouraging, patient personal language teacher running 100% locally on the user's mobile device.
Target Language: ${user.targetLanguage}
Learner Native Language: ${user.nativeLanguage}
Learner CEFR Level: ${user.level}

Teaching Instructions:
1. Review the learner's sentence carefully.
2. If there are grammatical, prepositional, tense, or vocabulary mistakes, correct them naturally.
3. Explain the rule in simple language suited for level ${user.level}.
4. Provide a friendly conversational reply to keep the dialogue flowing.
5. Create a mini follow-up exercise testing the same concept.
6. Output MUST be valid JSON adhering to the schema below.

Learner Weak Areas:
${weakTopicsText}

Current Lesson Topic:
${currentTopic}

Recent Conversation History:
${recentTurnsText || '(New conversation started)'}

Task: Analyze and correct the learner sentence
Learner Sentence: "${userInput}"

Required JSON Schema:
{
  "type": "correction",
  "correct": boolean,
  "original": "${userInput}",
  "corrected": string,
  "explanation": string,
  "ruleSummary": string,
  "topic": string,
  "severity": "minor" | "moderate" | "critical",
  "replyToContinue": string,
  "nextExercise": {
    "prompt": string,
    "targetAnswer": string
  }
}`;
  }

  /**
   * Build prompt for generating a targeted practice exercise based on a specific mistake category
   */
  public static buildExercisePrompt(
    category: MistakeCategory, 
    user: UserProfile,
    topicContext?: string
  ): string {
    return `System Rules:
You are a language teacher generator creating targeted offline practice exercises.
Target Language: ${user.targetLanguage}
Learner Level: ${user.level}
Target Category: ${category}
Context: ${topicContext || 'General Daily Life'}

Task: Generate a targeted practice exercise
Generate 1 multiple-choice or fill-in-the-blank exercise specifically addressing "${category}".
Ensure the difficulty matches CEFR ${user.level}.

Required JSON Schema:
{
  "type": "exercise",
  "category": "${category}",
  "difficulty": "${user.level}",
  "question": string,
  "instruction": string,
  "options": [string, string, string, string],
  "correctAnswer": string,
  "explanation": string
}`;
  }

  /**
   * Build prompt for end-of-lesson summary
   */
  public static buildSummaryPrompt(
    topic: string, 
    messages: Message[], 
    mistakes: MistakeRecord[]
  ): string {
    const mistakesSummary = mistakes.map(m => m.category).join(', ') || 'No critical errors';
    
    return `System Rules:
Summarize the language learning session concisely.
Session Topic: ${topic}
Total Turns: ${messages.length}
Observed Mistakes: ${mistakesSummary}

Task: Summarize the learning session

Required JSON Schema:
{
  "type": "summary",
  "practicedTopic": "${topic}",
  "keyTakeaways": [string, string, string],
  "topMistakesIdentified": [string, string],
  "encouragement": string,
  "recommendedNextTopic": string
}`;
  }
}
