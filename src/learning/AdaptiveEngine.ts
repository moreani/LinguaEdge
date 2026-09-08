import { MistakeRecord, MistakeCategory, UserProfile, Exercise } from '../types';
import { MistakeEngine } from './MistakeEngine';
import { TeacherEngine } from '../ai/TeacherEngine';

export class AdaptiveEngine {
  private teacherEngine: TeacherEngine;

  constructor(teacherEngine: TeacherEngine) {
    this.teacherEngine = teacherEngine;
  }

  /**
   * Identifies the primary category the learner should practice next
   */
  public selectNextPracticeTopic(mistakes: MistakeRecord[]): MistakeCategory {
    const ranked = MistakeEngine.rankWeakestCategories(mistakes);
    if (ranked.length > 0 && ranked[0].score > 0) {
      return ranked[0].category;
    }
    // Default curriculum starting point
    return 'past_tense';
  }

  /**
   * Generates a batch of adaptive exercises targeting the learner's weaknesses
   */
  public async generateAdaptiveSession(
    user: UserProfile, 
    mistakes: MistakeRecord[], 
    count: number = 3
  ): Promise<Exercise[]> {
    const primaryCategory = this.selectNextPracticeTopic(mistakes);
    const ranked = MistakeEngine.rankWeakestCategories(mistakes);
    
    const categoriesToPractice: MistakeCategory[] = [primaryCategory];
    if (count > 1 && ranked.length > 1) {
      categoriesToPractice.push(ranked[1].category);
    }
    while (categoriesToPractice.length < count) {
      categoriesToPractice.push(primaryCategory);
    }

    const exercises: Exercise[] = [];
    for (const cat of categoriesToPractice) {
      const ex = await this.teacherEngine.generateExercise(cat, user);
      exercises.push(ex);
    }

    return exercises;
  }

  /**
   * When learner answers correctly in practice, reduce the weakness score of that mistake
   */
  public resolveWeakness(mistakes: MistakeRecord[], category: MistakeCategory): MistakeRecord[] {
    return mistakes.map(m => {
      if (m.category === category) {
        const reducedScore = Math.max(0, m.weaknessScore * 0.6); // 40% reduction
        return {
          ...m,
          weaknessScore: parseFloat(reducedScore.toFixed(2))
        };
      }
      return m;
    });
  }
}
