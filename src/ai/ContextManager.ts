import { Message } from '../types';

export class ContextManager {
  private readonly maxTurns: number;

  constructor(maxTurns: number = 4) {
    this.maxTurns = maxTurns;
  }

  /**
   * Trims message history to the most recent N turns to prevent context window overflow
   * on resource-constrained mobile hardware.
   */
  public trimHistory(messages: Message[]): Message[] {
    if (messages.length <= this.maxTurns) {
      return [...messages];
    }
    return messages.slice(-this.maxTurns);
  }

  /**
   * Estimates token count for text using the 4-char per token heuristic
   */
  public estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Ensures the total prompt does not exceed max context tokens
   */
  public fitsWithinContext(prompt: string, maxContextTokens: number = 2048): boolean {
    return this.estimateTokens(prompt) <= maxContextTokens;
  }
}
