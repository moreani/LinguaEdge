import { SkillProgress, MistakeRecord, LessonSession, VocabularyWord } from '../types';

export class SkillEngine {
  /**
   * Recalculates all skill scores deterministically from local activity data
   */
  public static computeSkills(
    mistakes: MistakeRecord[],
    lessons: LessonSession[],
    vocabulary: VocabularyWord[]
  ): SkillProgress[] {
    const nowIso = new Date().toISOString();

    // 1. Grammar score: penalized by active high weakness scores, boosted by completed practice lessons
    const totalWeakness = mistakes.reduce((sum, m) => sum + m.weaknessScore, 0);
    const grammarLessons = lessons.filter(l => l.type === 'targeted_practice');
    const avgGrammarLessonScore = grammarLessons.length > 0
      ? grammarLessons.reduce((sum, l) => sum + l.score, 0) / grammarLessons.length
      : 70;
    
    const rawGrammar = Math.max(30, Math.min(100, avgGrammarLessonScore - (totalWeakness * 2.5)));

    // 2. Vocabulary score: based on reviewed words and average confidence
    const wordsCount = vocabulary.length;
    const avgConfidence = wordsCount > 0
      ? vocabulary.reduce((sum, w) => sum + w.confidence, 0) / wordsCount
      : 2.5;
    const rawVocab = Math.max(25, Math.min(100, Math.round((wordsCount * 4) + (avgConfidence * 15))));

    // 3. Conversation score: based on completed conversation sessions and turns
    const convLessons = lessons.filter(l => l.type === 'conversation');
    const convCount = convLessons.length;
    const rawConv = Math.min(100, 45 + (convCount * 8));

    // 4. Listening score
    const rawListening = Math.min(100, 50 + (convCount * 5));

    return [
      {
        skill: 'grammar',
        score: Math.round(rawGrammar),
        trend: rawGrammar >= 75 ? 'improving' : rawGrammar >= 55 ? 'stable' : 'needs_work',
        updatedAt: nowIso
      },
      {
        skill: 'vocabulary',
        score: Math.round(rawVocab),
        trend: rawVocab >= 70 ? 'improving' : 'stable',
        updatedAt: nowIso
      },
      {
        skill: 'conversation',
        score: Math.round(rawConv),
        trend: convCount >= 3 ? 'improving' : 'stable',
        updatedAt: nowIso
      },
      {
        skill: 'listening',
        score: Math.round(rawListening),
        trend: 'stable',
        updatedAt: nowIso
      }
    ];
  }
}
