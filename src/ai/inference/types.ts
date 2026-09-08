export interface InferenceConfig {
  modelPath: string;
  contextSize: number;
  temperature: number;
  maxTokens: number;
  topP?: number;
  threads?: number;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  systemPrompt?: string;
  onToken?: (token: string) => void;
}

export interface LocalInference {
  load(config: InferenceConfig): Promise<void>;
  unload(): Promise<void>;
  isLoaded(): Promise<boolean>;
  generate(prompt: string, options?: GenerationOptions): AsyncIterable<string>;
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  stop(): Promise<void>;
}
