import { MistakeRecord, MistakeCategory } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';
import { MistakeEngine } from '../../learning/MistakeEngine';

export class MistakeRepository {
  private db: DatabaseProvider;
  private readonly table = 'mistakes';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getAll(): Promise<MistakeRecord[]> {
    const list = await this.db.findAll<MistakeRecord>(this.table);
    return list.sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  public async getByCategory(category: MistakeCategory): Promise<MistakeRecord[]> {
    return await this.db.findWhere<MistakeRecord>(this.table, m => m.category === category);
  }

  public async recordMistake(mistake: Omit<MistakeRecord, 'id' | 'weaknessScore'>): Promise<MistakeRecord> {
    const all = await this.getAll();
    const updatedRecords = MistakeEngine.recordMistake(all, mistake);
    
    // Clear and re-save
    for (const r of updatedRecords) {
      const existing = await this.db.findById<MistakeRecord>(this.table, r.id);
      if (existing) {
        await this.db.update<MistakeRecord>(this.table, r.id, r);
      } else {
        await this.db.insert<MistakeRecord>(this.table, r);
      }
    }

    return updatedRecords[0];
  }

  public async updateWeaknessScores(records: MistakeRecord[]): Promise<void> {
    for (const r of records) {
      await this.db.update<MistakeRecord>(this.table, r.id, { weaknessScore: r.weaknessScore });
    }
  }

  public async delete(id: string): Promise<boolean> {
    return await this.db.delete(this.table, id);
  }
}
