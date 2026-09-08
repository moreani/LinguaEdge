import { create } from 'zustand';
import { ttsService, TTSVoice, SAMPLE_PHRASES } from '../services/ttsService';
import { SupportedLanguage } from '../types';

interface VoiceState {
  rate: number;
  pitch: number;
  selectedVoiceId: string | null;
  availableVoices: TTSVoice[];
  isSpeaking: boolean;
  activeSpeakingText: string | null;
  isLoadingVoices: boolean;

  loadVoices: (targetLanguage?: SupportedLanguage) => Promise<void>;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setSelectedVoiceId: (voiceId: string | null) => void;
  speakText: (text: string, language?: SupportedLanguage | string, customRate?: number) => Promise<void>;
  stopSpeaking: () => Promise<void>;
  testVoice: (language: SupportedLanguage) => Promise<void>;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  rate: 0.9, // 0.9x is optimal for language learners
  pitch: 1.0,
  selectedVoiceId: null,
  availableVoices: [],
  isSpeaking: false,
  activeSpeakingText: null,
  isLoadingVoices: false,

  loadVoices: async (targetLanguage?: SupportedLanguage) => {
    set({ isLoadingVoices: true });
    try {
      const locale = targetLanguage ? ttsService.getLocaleForLanguage(targetLanguage) : undefined;
      const voices = await ttsService.getAvailableVoices(locale);
      set({ 
        availableVoices: voices, 
        isLoadingVoices: false,
        selectedVoiceId: voices.length > 0 ? (get().selectedVoiceId || voices[0].id) : null 
      });
    } catch (err) {
      set({ isLoadingVoices: false });
    }
  },

  setRate: (rate: number) => {
    set({ rate: Math.max(0.5, Math.min(1.5, rate)) });
  },

  setPitch: (pitch: number) => {
    set({ pitch: Math.max(0.5, Math.min(1.5, pitch)) });
  },

  setSelectedVoiceId: (voiceId: string | null) => {
    set({ selectedVoiceId: voiceId });
  },

  speakText: async (text: string, language?: SupportedLanguage | string, customRate?: number) => {
    const { rate, pitch, selectedVoiceId, activeSpeakingText } = get();

    // If already speaking the exact same text, toggle stop
    if (get().isSpeaking && activeSpeakingText === text) {
      await get().stopSpeaking();
      return;
    }

    const locale = language ? ttsService.getLocaleForLanguage(language) : 'en-US';

    set({ isSpeaking: true, activeSpeakingText: text });

    await ttsService.speak({
      text,
      lang: locale,
      rate: customRate !== undefined ? customRate : rate,
      pitch,
      voiceId: selectedVoiceId || undefined,
      onStart: () => {
        set({ isSpeaking: true, activeSpeakingText: text });
      },
      onEnd: () => {
        set({ isSpeaking: false, activeSpeakingText: null });
      },
      onError: () => {
        set({ isSpeaking: false, activeSpeakingText: null });
      }
    });
  },

  stopSpeaking: async () => {
    await ttsService.stop();
    set({ isSpeaking: false, activeSpeakingText: null });
  },

  testVoice: async (language: SupportedLanguage) => {
    const sample = SAMPLE_PHRASES[language] || SAMPLE_PHRASES.English;
    await get().speakText(sample, language);
  }
}));
