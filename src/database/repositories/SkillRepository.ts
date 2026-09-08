import { SkillProgress } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';

export class SkillRepository {
  private db: DatabaseProvider;
  private readonly table = 'skills';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getAll(): Promise<SkillProgress[]> {
    const list = await this.db.findAll<SkillProgress & { id: string }>(this.table);
    if (list.length === 0) {
      return this.initDefaultSkills();
    }
    return list.map(item => ({
      skill: item.skill,
      score: item.score,
      trend: item.trend,
      updatedAt: item.updatedAt
    }));
  }

  public async saveSkills(skills: SkillProgress[]): Promise<void> {
    for (const s of skills) {
      const record = { id: s.skill, ...s };
      const existing = await this.db.findById(this.table, s.skill);
      if (existing) {
        await this.db.update(this.table, s.skill, record);
      } else {
        await this.db.insert(this.table, record);
      }
    }
  }

  private async initDefaultSkills(): Promise<SkillProgress[]> {
    const defaults: SkillProgress[] = [
      { skill: 'grammar', score: 65, trend: 'stable', updatedAt: new Date().toISOString() },
      { skill: 'vocabulary', score: 60, trend: 'improving', updatedAt: new Date().toISOString() },
      { skill: 'conversation', score: 55, trend: 'stable', updatedAt: new Date().toISOString() },
      { skill: 'listening', score: 50, trend: 'stable', updatedAt: new Date().toISOString() }
    ];
    await this.saveSkills(defaults);
    return defaults;
  }
}
