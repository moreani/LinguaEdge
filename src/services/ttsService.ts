import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { SupportedLanguage } from '../types';

export interface TTSVoice {
  id: string;
  name: string;
  lang: string;
  default?: boolean;
}

// BCP 47 Language mapping for all supported languages
export const LANGUAGE_TO_LOCALE: Record<SupportedLanguage, string> = {
  Korean: 'ko-KR',
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Japanese: 'ja-JP',
  Italian: 'it-IT',
  Portuguese: 'pt-BR',
  Mandarin: 'zh-CN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN'
};

// Default sample phrases for testing voices
export const SAMPLE_PHRASES: Record<SupportedLanguage, string> = {
  Korean: '안녕하세요! LinguaEdge와 함께 오프라인으로 즐겁게 한국어를 배워봐요.',
  English: 'Hello! Welcome to LinguaEdge, your private on-device language tutor.',
  Spanish: '¡Hola! Bienvenido a LinguaEdge, tu tutor de idiomas sin conexión.',
  French: 'Bonjour! Bienvenue sur LinguaEdge, votre tuteur de langue hors ligne.',
  German: 'Hallo! Willkommen bei LinguaEdge, deinem Offline-Sprachlehrer.',
  Japanese: 'こんにちは！LinguaEdgeへようこそ。オフラインで楽しく言語を学びましょう。',
  Italian: 'Ciao! Benvenuto su LinguaEdge, il tuo tutor linguistico offline.',
  Portuguese: 'Olá! Bem-vindo ao LinguaEdge, seu tutor de idiomas offline.',
  Mandarin: '你好！欢迎使用LinguaEdge离线语言导师。',
  Hindi: 'नमस्ते! LinguaEdge में आपका स्वागत है, आपका व्यक्तिगत भाषा शिक्षक।',
  Marathi: 'नमस्कार! LinguaEdge मध्ये आपले स्वागत आहे, आपले वैयक्तिक भाषा शिक्षक.'
};

class TTSService {
  private isNative = Capacitor.isNativePlatform();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking = false;

  public getLocaleForLanguage(language: SupportedLanguage | string): string {
    if (language in LANGUAGE_TO_LOCALE) {
      return LANGUAGE_TO_LOCALE[language as SupportedLanguage];
    }
    // If it's already a locale like "ko-KR", return it
    if (language.includes('-') || language.length === 2) {
      return language;
    }
    return 'en-US';
  }

  /**
   * Retrieves available voices from native engine or browser window.speechSynthesis
   */
  public async getAvailableVoices(locale?: string): Promise<TTSVoice[]> {
    const voices: TTSVoice[] = [];

    // Native Capacitor plugin
    if (this.isNative) {
      try {
        const res = await TextToSpeech.getSupportedVoices();
        if (res && res.voices) {
          for (let i = 0; i < res.voices.length; i++) {
            const v = res.voices[i];
            const voiceLocale = v.lang || '';
            if (!locale || voiceLocale.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase())) {
              voices.push({
                id: v.voiceURI || `${v.name}_${i}`,
                name: v.name,
                lang: v.lang,
                default: v.default
              });
            }
          }
        }
      } catch (err) {
        console.warn('Native getSupportedVoices failed, falling back to Web Speech:', err);
      }
    }

    // Web Speech API fallback or complement
    if (voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synthVoices = window.speechSynthesis.getVoices();
      for (let i = 0; i < synthVoices.length; i++) {
        const v = synthVoices[i];
        if (!locale || v.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase())) {
          voices.push({
            id: v.voiceURI || `${v.name}_${i}`,
            name: v.name,
            lang: v.lang,
            default: v.default
          });
        }
      }
    }

    return voices;
  }

  /**
   * Speak text with language locale, optional voice, rate and pitch
   */
  public async speak(options: {
    text: string;
    lang?: string;
    rate?: number;
    pitch?: number;
    voiceId?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }): Promise<void> {
    const {
      text,
      lang = 'en-US',
      rate = 0.9,
      pitch = 1.0,
      voiceId,
      onStart,
      onEnd,
      onError
    } = options;

    if (!text || !text.trim()) return;

    // Stop existing speech
    await this.stop();

    this.isCurrentlySpeaking = true;
    if (onStart) onStart();

    // Try native Capacitor TextToSpeech first
    if (this.isNative) {
      try {
        await TextToSpeech.speak({
          text,
          lang,
          rate: Math.max(0.5, Math.min(2.0, rate)),
          pitch: Math.max(0.5, Math.min(2.0, pitch)),
          voice: voiceId ? parseInt(voiceId, 10) || undefined : undefined
        });
        this.isCurrentlySpeaking = false;
        if (onEnd) onEnd();
        return;
      } catch (nativeErr) {
        console.warn('Native TTS speak error, falling back to Web Speech API:', nativeErr);
      }
    }

    // Fallback to window.speechSynthesis (also works offline on Android WebView & Chromium)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;

        if (voiceId) {
          const available = window.speechSynthesis.getVoices();
          const match = available.find(v => v.voiceURI === voiceId || v.name === voiceId);
          if (match) utterance.voice = match;
        }

        utterance.onend = () => {
          this.isCurrentlySpeaking = false;
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          this.isCurrentlySpeaking = false;
          this.currentUtterance = null;
          if (onError) onError(e);
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.isCurrentlySpeaking = false;
        if (onError) onError(err);
      }
    } else {
      this.isCurrentlySpeaking = false;
      if (onEnd) onEnd();
    }
  }

  /**
   * Stop any current speech playback immediately
   */
  public async stop(): Promise<void> {
    this.isCurrentlySpeaking = false;
    if (this.isNative) {
      try {
        await TextToSpeech.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore stop errors
      }
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

export const ttsService = new TTSService();
