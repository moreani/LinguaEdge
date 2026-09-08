import { VocabularyWord } from '../types';

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2Result {
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  nextReviewDate: string;
}

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * Computes optimal review intervals purely offline on-device.
 */
export class SpacedRepetition {
  public static calculateNextReview(
    currentReviewCount: number,
    currentIntervalDays: number,
    currentEaseFactor: number,
    grade: ReviewGrade
  ): SM2Result {
    let intervalDays: number;
    let easeFactor: number;
    let reviewCount: number;

    // Adjust ease factor
    // EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    const efDelta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
    easeFactor = Math.max(1.3, currentEaseFactor + efDelta);

    if (grade < 3) {
      // Failed recall: reset intervals
      reviewCount = 0;
      intervalDays = 1;
    } else {
      // Successful recall
      reviewCount = currentReviewCount + 1;
      if (reviewCount === 1) {
        intervalDays = 1;
      } else if (reviewCount === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(currentIntervalDays * easeFactor);
      }
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);

    return {
      intervalDays,
      easeFactor: parseFloat(easeFactor.toFixed(2)),
      reviewCount,
      nextReviewDate: nextDate.toISOString()
    };
  }

  public static isDueForReview(word: VocabularyWord): boolean {
    const nextReview = new Date(word.nextReview).getTime();
    const now = Date.now();
    return nextReview <= now;
  }
}
