import { UserProfile } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';

export class UserRepository {
  private db: DatabaseProvider;
  private readonly table = 'users';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getUser(): Promise<UserProfile | null> {
    const users = await this.db.findAll<UserProfile>(this.table);
    return users.length > 0 ? users[0] : null;
  }

  public async saveUser(user: UserProfile): Promise<UserProfile> {
    const existing = await this.getUser();
    if (existing) {
      const updated = await this.db.update<UserProfile>(this.table, existing.id, user);
      return updated!;
    }
    return await this.db.insert<UserProfile>(this.table, user);
  }

  public async updateStreak(streakDays: number, lastActiveDate: string): Promise<void> {
    const user = await this.getUser();
    if (user) {
      await this.db.update<UserProfile>(this.table, user.id, { streakDays, lastActiveDate });
    }
  }
}
