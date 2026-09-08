import { describe, it, expect, beforeEach } from 'vitest';
import { ModelManager } from '../src/ai/ModelManager';
import { computeSha256, verifyModelChecksum } from '../src/utils/checksum';
import { DatabaseProvider } from '../src/database/DatabaseProvider';
import { UserRepository } from '../src/database/repositories/UserRepository';
import { ConversationRepository } from '../src/database/repositories/ConversationRepository';
import { MessageRepository } from '../src/database/repositories/MessageRepository';
import { MistakeRepository } from '../src/database/repositories/MistakeRepository';
import { VocabularyRepository } from '../src/database/repositories/VocabularyRepository';
import { UserProfile, Conversation, Message, VocabularyWord } from '../src/types';

describe('Model Manager & Database Suite', () => {
  describe('Checksum & Model Lifecycle', () => {
    it('computes deterministic SHA-256 hashes locally', async () => {
      const hash1 = await computeSha256('llama_model_gguf_weights');
      const hash2 = await computeSha256('llama_model_gguf_weights');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
    });

    it('manages model download, checksum verification, and loading', async () => {
      const manager = new ModelManager();
      const models = manager.listModels();
      expect(models.length).toBeGreaterThanOrEqual(3);

      const target = models.find(m => m.id === 'llama-3.2-1b-instruct')!;
      expect(target.isInstalled).toBe(false);

      // Download with progress callback
      let lastProgress = 0;
      const success = await manager.downloadModel(target.id, (p) => {
        lastProgress = p;
      });

      expect(success).toBe(true);
      expect(lastProgress).toBe(100);
      expect(target.isInstalled).toBe(true);

      // Load model into active runtime
      const loaded = await manager.loadModel(target.id);
      expect(loaded).toBe(true);
      expect(manager.getActiveModel()?.id).toBe(target.id);

      // Storage breakdown
      const storage = manager.getStorageInfo();
      expect(storage.modelsUsedMb).toBeGreaterThan(0);
      expect(storage.availableDeviceMb).toBeGreaterThan(0);

      // Unload
      const unloaded = await manager.unloadModel();
      expect(unloaded).toBe(true);
      expect(manager.getActiveModel()).toBeUndefined();
    });
  });

  describe('Database Repositories', () => {
    const db = DatabaseProvider.getInstance();
    const userRepo = new UserRepository(db);
    const convRepo = new ConversationRepository(db);
    const msgRepo = new MessageRepository(db);
    const vocabRepo = new VocabularyRepository(db);

    it('persists and retrieves user profile', async () => {
      const profile: UserProfile = {
        id: 'user_suite_test',
        nativeLanguage: 'English',
        targetLanguage: 'German',
        level: 'B1',
        dailyGoalMinutes: 20,
        streakDays: 5,
        lastActiveDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await userRepo.saveUser(profile);
      const retrieved = await userRepo.getUser();
      expect(retrieved).toBeDefined();
      expect(retrieved?.targetLanguage).toBe('German');
      expect(retrieved?.level).toBe('B1');
    });

    it('persists conversation turns and messages', async () => {
      const conv: Conversation = {
        id: 'conv_suite_1',
        topic: 'Job Interview',
        targetLanguage: 'German',
        createdAt: new Date().toISOString(),
        durationSeconds: 120,
        messageCount: 2
      };
      await convRepo.create(conv);

      const msg1: Message = {
        id: 'msg_suite_1',
        conversationId: conv.id,
        role: 'assistant',
        content: 'Guten Tag! Erzählen Sie mir von sich.',
        createdAt: new Date().toISOString()
      };
      const msg2: Message = {
        id: 'msg_suite_2',
        conversationId: conv.id,
        role: 'user',
        content: 'Ich arbeite als Softwareentwickler.',
        createdAt: new Date().toISOString()
      };

      await msgRepo.addMessage(msg1);
      await msgRepo.addMessage(msg2);

      const fetchedMessages = await msgRepo.getByConversationId(conv.id);
      expect(fetchedMessages.length).toBe(2);
      expect(fetchedMessages[0].role).toBe('assistant');
      expect(fetchedMessages[1].role).toBe('user');
    });

    it('stores vocabulary and filters due reviews', async () => {
      const word: VocabularyWord = {
        id: 'voc_suite_1',
        word: 'Entwicklung',
        translation: 'Development',
        exampleSentence: 'Software-Entwicklung ist spannend.',
        exampleTranslation: 'Software development is exciting.',
        targetLanguage: 'German',
        confidence: 2,
        reviewCount: 1,
        nextReview: new Date(Date.now() - 60000).toISOString(), // due in past
        intervalDays: 1,
        easeFactor: 2.5
      };

      await vocabRepo.addWord(word);
      const due = await vocabRepo.getDueForReview();
      expect(due.some(w => w.id === word.id)).toBe(true);
    });
  });
});
