import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useVoiceStore } from '../../store/voiceStore';
import { useUserStore } from '../../store/userStore';
import { SupportedLanguage } from '../../types';

interface SpeakButtonProps {
  text: string;
  language?: SupportedLanguage | string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  slow?: boolean;
  className?: string;
  variant?: 'ghost' | 'pill' | 'solid';
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  language,
  label,
  size = 'sm',
  slow = false,
  className = '',
  variant = 'ghost'
}) => {
  const { isSpeaking, activeSpeakingText, speakText, stopSpeaking } = useVoiceStore();
  const { user } = useUserStore();

  const isCurrentTextSpeaking = isSpeaking && activeSpeakingText === text;
  const targetLang = language || user?.targetLanguage || 'English';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTextSpeaking) {
      stopSpeaking();
    } else {
      speakText(text, targetLang, slow ? 0.75 : undefined);
    }
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const fontSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-xs font-medium',
    lg: 'text-sm font-semibold'
  };

  let variantStyle = '';
  if (variant === 'ghost') {
    variantStyle = isCurrentTextSpeaking
      ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40 animate-pulse'
      : 'text-slate-400 hover:text-brand-300 hover:bg-slate-800/80';
  } else if (variant === 'pill') {
    variantStyle = isCurrentTextSpeaking
      ? 'bg-brand-500 text-white shadow-md animate-pulse ring-2 ring-brand-400/50'
      : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 hover:border-brand-500/40 shadow-sm';
  } else if (variant === 'solid') {
    variantStyle = isCurrentTextSpeaking
      ? 'bg-rose-600 text-white'
      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isCurrentTextSpeaking ? 'Tap to stop speech' : `Listen (${slow ? 'Slow' : 'Natural'})`}
      className={`inline-flex items-center justify-center gap-1.5 p-1.5 rounded-xl transition-all active:scale-95 flex-shrink-0 ${variantStyle} ${fontSizes[size]} ${className}`}
    >
      {isCurrentTextSpeaking ? (
        <VolumeX className={`${iconSizes[size]} text-rose-400 animate-spin-slow`} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
