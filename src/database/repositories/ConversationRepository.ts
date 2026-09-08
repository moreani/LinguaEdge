import { Conversation } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';

export class ConversationRepository {
  private db: DatabaseProvider;
  private readonly table = 'conversations';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getAll(): Promise<Conversation[]> {
    const list = await this.db.findAll<Conversation>(this.table);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getById(id: string): Promise<Conversation | null> {
    return await this.db.findById<Conversation>(this.table, id);
  }

  public async create(conv: Conversation): Promise<Conversation> {
    return await this.db.insert<Conversation>(this.table, conv);
  }

  public async update(id: string, updates: Partial<Conversation>): Promise<Conversation | null> {
    return await this.db.update<Conversation>(this.table, id, updates);
  }

  public async delete(id: string): Promise<boolean> {
    return await this.db.delete(this.table, id);
  }
}
