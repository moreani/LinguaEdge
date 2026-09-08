import { MistakeRecord, MistakeCategory } from '../types';

export class MistakeEngine {
  /**
   * Calculates weakness score using PRD Phase 6 formula:
   * weaknessScore = errorFrequency * severityWeight * recencyWeight
   */
  public static calculateWeaknessScore(
    frequency: number,
    severity: 'minor' | 'moderate' | 'critical',
    lastSeenIso: string
  ): number {
    const severityWeights = {
      minor: 1.0,
      moderate: 2.0,
      critical: 3.5
    };

    const severityWeight = severityWeights[severity] || 1.5;

    // Recency weight: 1.0 if today, decaying by 10% per day, minimum 0.2
    const daysSince = Math.max(0, (Date.now() - new Date(lastSeenIso).getTime()) / (1000 * 60 * 60 * 24));
    const recencyWeight = Math.max(0.2, Math.pow(0.9, daysSince));

    const score = frequency * severityWeight * recencyWeight;
    return parseFloat(score.toFixed(2));
  }

  /**
   * Rank mistake categories by aggregate weakness score
   */
  public static rankWeakestCategories(mistakes: MistakeRecord[]): { category: MistakeCategory; score: number }[] {
    const categoryScores: Partial<Record<MistakeCategory, number>> = {};

    mistakes.forEach(m => {
      const current = categoryScores[m.category] || 0;
      categoryScores[m.category] = current + m.weaknessScore;
    });

    return (Object.entries(categoryScores) as [MistakeCategory, number][])
      .map(([category, score]) => ({ category, score: parseFloat(score.toFixed(2)) }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Merges a newly encountered mistake into an existing list of records
   */
  public static recordMistake(
    existing: MistakeRecord[], 
    newMistake: Omit<MistakeRecord, 'id' | 'weaknessScore'>
  ): MistakeRecord[] {
    const records = [...existing];
    const matchIndex = records.findIndex(
      m => m.category === newMistake.category && m.originalText.toLowerCase() === newMistake.originalText.toLowerCase()
    );

    const nowIso = new Date().toISOString();

    if (matchIndex >= 0) {
      const existingRecord = records[matchIndex];
      const newFrequency = existingRecord.frequency + 1;
      const score = this.calculateWeaknessScore(newFrequency, newMistake.severity, nowIso);

      records[matchIndex] = {
        ...existingRecord,
        frequency: newFrequency,
        lastSeen: nowIso,
        severity: newMistake.severity,
        weaknessScore: score
      };
    } else {
      const score = this.calculateWeaknessScore(1, newMistake.severity, nowIso);
      records.unshift({
        id: 'mst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        ...newMistake,
        frequency: 1,
        lastSeen: nowIso,
        weaknessScore: score
      });
    }

    return records;
  }
}
