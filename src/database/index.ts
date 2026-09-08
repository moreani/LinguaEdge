import { UserRepository } from './repositories/UserRepository';
import { ConversationRepository } from './repositories/ConversationRepository';
import { MessageRepository } from './repositories/MessageRepository';
import { MistakeRepository } from './repositories/MistakeRepository';
import { VocabularyRepository } from './repositories/VocabularyRepository';
import { LessonRepository } from './repositories/LessonRepository';
import { SkillRepository } from './repositories/SkillRepository';
import { DatabaseProvider } from './DatabaseProvider';

export const dbProvider = DatabaseProvider.getInstance();
export const userRepo = new UserRepository(dbProvider);
export const conversationRepo = new ConversationRepository(dbProvider);
export const messageRepo = new MessageRepository(dbProvider);
export const mistakeRepo = new MistakeRepository(dbProvider);
export const vocabularyRepo = new VocabularyRepository(dbProvider);
export const lessonRepo = new LessonRepository(dbProvider);
export const skillRepo = new SkillRepository(dbProvider);

/**
 * Initializes default starting offline data if database is empty
 */
export async function seedInitialDataIfEmpty() {
  const existingUser = await userRepo.getUser();
  if (!existingUser) {
    await userRepo.saveUser({
      id: 'user_default',
      nativeLanguage: 'English',
      targetLanguage: 'Spanish',
      level: 'A2',
      dailyGoalMinutes: 15,
      streakDays: 3,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }

  const existingVocab = await vocabularyRepo.getAll();
  if (existingVocab.length === 0) {
    const starterVocab = [
      {
        id: 'voc_1',
        word: 'Desafortunadamente',
        translation: 'Unfortunately',
        phonetic: 'deh-sah-for-too-nah-dah-men-teh',
        partOfSpeech: 'Adverb',
        exampleSentence: 'Desafortunadamente no puedo ir hoy.',
        exampleTranslation: 'Unfortunately I cannot go today.',
        targetLanguage: 'Spanish' as const,
        confidence: 3,
        reviewCount: 2,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() - 3600000).toISOString(), // Due now
        intervalDays: 1,
        easeFactor: 2.5
      },
      {
        id: 'voc_2',
        word: 'Acostumbrarse',
        translation: 'To get used to',
        phonetic: 'ah-kos-toom-brar-seh',
        partOfSpeech: 'Verb',
        exampleSentence: 'Tengo que acostumbrarme al nuevo horario.',
        exampleTranslation: 'I have to get used to the new schedule.',
        targetLanguage: 'Spanish' as const,
        confidence: 2,
        reviewCount: 1,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() - 7200000).toISOString(), // Due now
        intervalDays: 1,
        easeFactor: 2.5
      },
      {
        id: 'voc_3',
        word: 'Desarrollar',
        translation: 'To develop',
        phonetic: 'deh-sah-rro-yar',
        partOfSpeech: 'Verb',
        exampleSentence: 'Queremos desarrollar una aplicación útil.',
        exampleTranslation: 'We want to develop a useful application.',
        targetLanguage: 'Spanish' as const,
        confidence: 4,
        reviewCount: 4,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + 86400000 * 3).toISOString(),
        intervalDays: 4,
        easeFactor: 2.6
      }
    ];

    for (const v of starterVocab) {
      await vocabularyRepo.addWord(v);
    }
  }

  const existingMistakes = await mistakeRepo.getAll();
  if (existingMistakes.length === 0) {
    await mistakeRepo.recordMistake({
      category: 'past_tense',
      originalText: 'Ayer yo ir a la playa',
      correctedText: 'Ayer yo fui a la playa',
      explanation: 'Irregular simple past "fui" must be used for completed past events.',
      severity: 'moderate',
      frequency: 2,
      lastSeen: new Date().toISOString()
    });
  }
}
