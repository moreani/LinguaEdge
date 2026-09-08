import { describe, it, expect } from 'vitest';
import { SpacedRepetition } from '../src/learning/SpacedRepetition';
import { MistakeEngine } from '../src/learning/MistakeEngine';
import { SkillEngine } from '../src/learning/SkillEngine';
import { AdaptiveEngine } from '../src/learning/AdaptiveEngine';
import { TeacherEngine } from '../src/ai/TeacherEngine';
import { MistakeRecord, VocabularyWord, UserProfile } from '../src/types';

describe('Learning & Adaptive Engine Suite', () => {
  describe('SpacedRepetition (SM-2 Algorithm)', () => {
    it('schedules next review in 1 day for brand new word', () => {
      const result = SpacedRepetition.calculateNextReview(0, 1, 2.5, 4);
      expect(result.reviewCount).toBe(1);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(2.5);
    });

    it('schedules 6 days on second successful review', () => {
      const result = SpacedRepetition.calculateNextReview(1, 1, 2.5, 4);
      expect(result.reviewCount).toBe(2);
      expect(result.intervalDays).toBe(6);
    });

    it('resets intervals upon failed recall (grade < 3)', () => {
      const result = SpacedRepetition.calculateNextReview(5, 30, 2.5, 1);
      expect(result.reviewCount).toBe(0);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBeLessThan(2.5);
    });
  });

  describe('MistakeEngine (Weakness Scoring Formula)', () => {
    it('calculates score based on frequency, severity, and recency', () => {
      const nowIso = new Date().toISOString();
      const score = MistakeEngine.calculateWeaknessScore(2, 'moderate', nowIso);
      // frequency(2) * moderate(2.0) * recency(1.0) = 4.0
      expect(score).toBe(4.0);
    });

    it('correctly ranks weakest categories by aggregate score', () => {
      const mistakes: MistakeRecord[] = [
        {
          id: '1',
          category: 'past_tense',
          originalText: 'I go',
          correctedText: 'I went',
          explanation: '',
          severity: 'moderate',
          frequency: 3,
          lastSeen: new Date().toISOString(),
          weaknessScore: 6.0
        },
        {
          id: '2',
          category: 'prepositions',
          originalText: 'in Monday',
          correctedText: 'on Monday',
          explanation: '',
          severity: 'minor',
          frequency: 1,
          lastSeen: new Date().toISOString(),
          weaknessScore: 1.0
        }
      ];

      const ranked = MistakeEngine.rankWeakestCategories(mistakes);
      expect(ranked[0].category).toBe('past_tense');
      expect(ranked[0].score).toBe(6.0);
      expect(ranked[1].category).toBe('prepositions');
    });
  });

  describe('AdaptiveEngine', () => {
    const teacher = new TeacherEngine();
    const adaptive = new AdaptiveEngine(teacher);

    it('reduces weakness score when learner answers correctly in practice', () => {
      const mistakes: MistakeRecord[] = [
        {
          id: '1',
          category: 'past_tense',
          originalText: 'I go',
          correctedText: 'I went',
          explanation: '',
          severity: 'moderate',
          frequency: 2,
          lastSeen: new Date().toISOString(),
          weaknessScore: 4.0
        }
      ];

      const updated = adaptive.resolveWeakness(mistakes, 'past_tense');
      expect(updated[0].weaknessScore).toBeLessThan(4.0);
      expect(updated[0].weaknessScore).toBe(2.4); // 40% reduction
    });
  });

  describe('SkillEngine', () => {
    it('computes 4 core linguistic skill scores deterministically', () => {
      const skills = SkillEngine.computeSkills([], [], []);
      expect(skills.length).toBe(4);
      expect(skills.find(s => s.skill === 'grammar')).toBeDefined();
      expect(skills.find(s => s.skill === 'vocabulary')).toBeDefined();
      expect(skills.find(s => s.skill === 'conversation')).toBeDefined();
      expect(skills.find(s => s.skill === 'listening')).toBeDefined();
      skills.forEach(s => {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      });
    });
  });
});
