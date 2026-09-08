import React, { useState } from 'react';
import { VocabularyWord } from '../../types';
import { RotateCw, Volume2, Sparkles, Check, ChevronRight } from 'lucide-react';
import { ReviewGrade } from '../../learning/SpacedRepetition';

interface FlashcardProps {
  word: VocabularyWord;
  onGrade: (grade: ReviewGrade) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ word, onGrade }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const simulatePronunciation = () => {
    setIsPlayingAudio(true);
    // In local browser, we can use window.speechSynthesis (runs locally on-device)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[260px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-brand-500/50"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {word.partOfSpeech || 'Word'}
          </span>
          <div className="flex items-center gap-1 text-brand-400">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Tap to flip</span>
          </div>
        </div>

        {!isFlipped ? (
          // Front of card
          <div className="text-center my-auto py-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              {word.word}
            </h2>
            {word.phonetic && (
              <p className="text-xs text-brand-400 font-mono mb-4">/{word.phonetic}/</p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                simulatePronunciation();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isPlayingAudio
                  ? 'bg-brand-500 text-white border-brand-400 scale-105'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'Speaking...' : 'Listen Pronunciation'}</span>
            </button>
          </div>
        ) : (
          // Back of card
          <div className="my-auto py-2 space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Meaning:
              </span>
              <h3 className="text-2xl font-bold text-white">{word.translation}</h3>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-left">
              <p className="text-xs text-brand-300 font-medium italic mb-1">
                "{word.exampleSentence}"
              </p>
              <p className="text-xs text-slate-400">
                "{word.exampleTranslation}"
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          <span>Review Count: {word.reviewCount}</span>
          <span>SRS Interval: {word.intervalDays}d</span>
        </div>
      </div>

      {/* SM-2 Rating Buttons (displayed when flipped) */}
      {isFlipped && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            onClick={() => onGrade(1)}
            className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
          >
            <span className="text-xs font-bold">Again</span>
            <span className="text-[10px] text-rose-500/80 mt-0.5">&lt; 1d</span>
          </button>
          <button
            onClick={() => onGrade(2)}
            className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 transition-colors"
          >
            <span className="text-xs font-bold">Hard</span>
            <span className="text-[10px] text-amber-500/80 mt-0.5">1d</span>
          </button>
          <button
            onClick={() => onGrade(3)}
            className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500/20 text-brand-400 transition-colors"
          >
            <span className="text-xs font-bold">Good</span>
            <span className="text-[10px] text-brand-500/80 mt-0.5">{Math.round(word.intervalDays * 1.5)}d</span>
          </button>
          <button
            onClick={() => onGrade(5)}
            className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
          >
            <span className="text-xs font-bold">Easy</span>
            <span className="text-[10px] text-emerald-500/80 mt-0.5">{Math.round(word.intervalDays * 2.5)}d</span>
          </button>
        </div>
      )}
    </div>
  );
};
