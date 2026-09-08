import { Message } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';

export class MessageRepository {
  private db: DatabaseProvider;
  private readonly table = 'messages';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getByConversationId(conversationId: string): Promise<Message[]> {
    const list = await this.db.findWhere<Message>(
      this.table,
      m => m.conversationId === conversationId
    );
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public async addMessage(message: Message): Promise<Message> {
    return await this.db.insert<Message>(this.table, message);
  }

  public async deleteByConversationId(conversationId: string): Promise<void> {
    const messages = await this.getByConversationId(conversationId);
    for (const m of messages) {
      await this.db.delete(this.table, m.id);
    }
  }
}
