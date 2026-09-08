import { LessonSession } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';

export class LessonRepository {
  private db: DatabaseProvider;
  private readonly table = 'lessons';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getAll(): Promise<LessonSession[]> {
    const list = await this.db.findAll<LessonSession>(this.table);
    return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  public async addLesson(lesson: LessonSession): Promise<LessonSession> {
    return await this.db.insert<LessonSession>(this.table, lesson);
  }

  public async getWeeklyStats(): Promise<{ completedCount: number; avgScore: number }> {
    const lessons = await this.getAll();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recent = lessons.filter(l => new Date(l.completedAt).getTime() >= oneWeekAgo);

    if (recent.length === 0) {
      return { completedCount: 0, avgScore: 0 };
    }

    const totalScore = recent.reduce((sum, l) => sum + l.score, 0);
    return {
      completedCount: recent.length,
      avgScore: Math.round(totalScore / recent.length)
    };
  }
}
