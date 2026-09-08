import { ModelInfo } from '../types';

export const MODEL_CATALOG: ModelInfo[] = [
  {
    id: 'qwen2.5-0.5b-instruct',
    displayName: 'Qwen 2.5 0.5B (Ultra-Lightweight)',
    fileName: 'qwen2.5-0.5b-instruct-q4_k_m.gguf',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    sizeMb: 395,
    minRamGb: 2,
    recommended: false,
    description: 'Fastest model, lowest memory consumption. Perfect for older or entry-level phones.',
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Mandarin'],
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isInstalled: true,
    isLoaded: false,
    status: 'installed'
  },
  {
    id: 'qwen2.5-1.5b-instruct',
    displayName: 'Qwen 2.5 1.5B (Top Pick: Multilingual Teacher)',
    fileName: 'qwen2.5-1.5b-instruct-q4_k_m.gguf',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    sizeMb: 980,
    minRamGb: 3,
    recommended: true,
    description: 'Premier multilingual model. Outstanding in Korean, Japanese, European languages and strict JSON schema output.',
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Mandarin', 'Italian', 'Hindi'],
    checksum: '6a827d97b3724c96ad019b88ebcf196f1335b7194f4544d6739f4e24eb5efea0',
    isInstalled: true,
    isLoaded: true,
    status: 'loaded'
  },
  {
    id: 'llama-3.2-1b-instruct',
    displayName: 'Llama 3.2 1B (Balanced Western Teacher)',
    fileName: 'Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    sizeMb: 820,
    minRamGb: 3,
    recommended: false,
    description: 'Excellent balance between pedagogical grammar explanation depth and speed.',
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Hindi', 'Marathi'],
    checksum: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    isInstalled: false,
    isLoaded: false,
    status: 'not_installed'
  },
  {
    id: 'gemma-2-2b-instruct',
    displayName: 'Gemma 2 2B (Advanced Teacher)',
    fileName: 'gemma-2-2b-it-Q4_K_M.gguf',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    sizeMb: 1650,
    minRamGb: 4,
    recommended: false,
    description: 'Highest reasoning and nuanced linguistic explanations. Recommended for mid-to-high-end devices.',
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese'],
    checksum: '7d363e8a49c6934c9d924976ca18f8cc020d2d348b6c40a334cf407dbecce48c',
    isInstalled: false,
    isLoaded: false,
    status: 'not_installed'
  }
];
