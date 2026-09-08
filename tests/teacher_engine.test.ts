import { describe, it, expect } from 'vitest';
import { TeacherEngine } from '../src/ai/TeacherEngine';
import { OnDeviceInference } from '../src/ai/inference/OnDeviceInference';
import { UserProfile } from '../src/types';

describe('TeacherEngine (100% Offline, Zero Cloud API)', () => {
  const inference = new OnDeviceInference();
  const teacher = new TeacherEngine(inference);

  const mockUser: UserProfile = {
    id: 'user_test',
    nativeLanguage: 'English',
    targetLanguage: 'Spanish',
    level: 'A2',
    dailyGoalMinutes: 15,
    streakDays: 3,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  it('initializes and confirms inference engine is loaded', async () => {
    await inference.load({
      modelPath: 'qwen2.5-0.5b-instruct-q4_k_m.gguf',
      contextSize: 2048,
      temperature: 0.7,
      maxTokens: 512
    });
    const loaded = await inference.isLoaded();
    expect(loaded).toBe(true);
  });

  it('starts a conversation with pedagogical greeting', async () => {
    const greeting = await teacher.startConversation(mockUser, 'Ordering at a Restaurant');
    expect(greeting).toBeDefined();
    expect(greeting.length).toBeGreaterThan(10);
    expect(greeting).toContain('Ordering at a Restaurant');
  });

  it('accurately identifies and corrects past tense mistakes', async () => {
    const result = await teacher.processLearnerSentence({
      user: mockUser,
      topic: 'Airport & Travel Directions',
      learnerInput: 'I go market yesterday to buy tickets',
      recentMessages: [],
      knownWeaknesses: []
    });

    expect(result.correction).toBeDefined();
    expect(result.correction.isCorrect).toBe(false);
    expect(result.correction.category).toBe('past_tense');
    expect(result.correction.correctedText.toLowerCase()).toContain('went');
    expect(result.correction.explanation).toBeDefined();
    expect(result.correction.ruleSummary).toBeDefined();
    expect(result.correction.nextExercise).toBeDefined();
    expect(result.newMistake).toBeDefined();
    expect(result.newMistake?.category).toBe('past_tense');
  });

  it('accurately identifies preposition errors with days of the week', async () => {
    const result = await teacher.processLearnerSentence({
      user: mockUser,
      topic: 'Weekend Plans',
      learnerInput: 'I will travel in Monday morning',
      recentMessages: [],
      knownWeaknesses: []
    });

    expect(result.correction.isCorrect).toBe(false);
    expect(result.correction.category).toBe('prepositions');
    expect(result.correction.correctedText.toLowerCase()).toContain('on monday');
  });

  it('generates a targeted exercise matching CEFR level', async () => {
    const exercise = await teacher.generateExercise('prepositions', mockUser);
    expect(exercise).toBeDefined();
    expect(exercise.category).toBe('prepositions');
    expect(exercise.difficulty).toBe('A2');
    expect(exercise.question.length).toBeGreaterThan(5);
    expect(exercise.correctAnswer).toBeDefined();
    expect(exercise.explanation).toBeDefined();
  });

  it('summarizes a lesson session without API dependency', async () => {
    const summary = await teacher.summarizeLesson('Travel', [], []);
    expect(summary.type).toBe('summary');
    expect(summary.practicedTopic).toBe('Travel');
    expect(summary.keyTakeaways.length).toBeGreaterThan(0);
  });
});
