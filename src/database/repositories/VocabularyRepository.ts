import { VocabularyWord } from '../../types';
import { DatabaseProvider } from '../DatabaseProvider';
import { SpacedRepetition } from '../../learning/SpacedRepetition';

export class VocabularyRepository {
  private db: DatabaseProvider;
  private readonly table = 'vocabulary';

  constructor(db?: DatabaseProvider) {
    this.db = db || DatabaseProvider.getInstance();
  }

  public async getAll(): Promise<VocabularyWord[]> {
    return await this.db.findAll<VocabularyWord>(this.table);
  }

  public async getDueForReview(): Promise<VocabularyWord[]> {
    const all = await this.getAll();
    return all.filter(word => SpacedRepetition.isDueForReview(word));
  }

  public async getById(id: string): Promise<VocabularyWord | null> {
    return await this.db.findById<VocabularyWord>(this.table, id);
  }

  public async addWord(word: VocabularyWord): Promise<VocabularyWord> {
    return await this.db.insert<VocabularyWord>(this.table, word);
  }

  public async updateWord(id: string, updates: Partial<VocabularyWord>): Promise<VocabularyWord | null> {
    return await this.db.update<VocabularyWord>(this.table, id, updates);
  }

  public async deleteWord(id: string): Promise<boolean> {
    return await this.db.delete(this.table, id);
  }
}
