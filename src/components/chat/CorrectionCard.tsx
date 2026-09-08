import React, { useState } from 'react';
import { CorrectionResult } from '../../types';
import { CheckCircle2, AlertTriangle, BookOpen, ChevronRight, X } from 'lucide-react';
import { formatCategoryName } from '../../utils/formatters';

interface CorrectionCardProps {
  correction: CorrectionResult;
  onDismiss?: () => void;
  onPracticeTarget?: (category: string) => void;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({
  correction,
  onDismiss,
  onPracticeTarget
}) => {
  const [showRule, setShowRule] = useState(false);
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseChecked, setExerciseChecked] = useState<boolean | null>(null);

  const checkMiniExercise = () => {
    if (!correction.nextExercise) return;
    const isRight = exerciseAnswer.trim().toLowerCase() === correction.nextExercise.targetAnswer.trim().toLowerCase();
    setExerciseChecked(isRight);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/40 border border-amber-500/30 rounded-2xl p-4 shadow-xl mb-3 text-slate-200">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Teacher's Correction
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {formatCategoryName(correction.category)}
              </span>
            </h4>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Original vs Corrected comparison */}
      <div className="space-y-2 text-sm bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-0.5">
            Your Sentence:
          </span>
          <p className="line-through text-slate-400 font-mono text-xs">
            {correction.originalText}
          </p>
        </div>
        <div className="border-t border-slate-800/60 pt-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Better:
          </span>
          <p className="text-emerald-300 font-medium text-sm">
            {correction.correctedText}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-3">
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Why: </span>
          {correction.explanation}
        </p>
      </div>

      {/* Grammar Rule Toggle */}
      {correction.ruleSummary && (
        <div className="mt-2.5">
          <button
            onClick={() => setShowRule(!showRule)}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showRule ? 'Hide rule' : 'View grammar rule'}</span>
          </button>
          {showRule && (
            <div className="mt-2 text-xs bg-brand-950/40 border border-brand-800/40 rounded-lg p-2.5 text-brand-200">
              {correction.ruleSummary}
            </div>
          )}
        </div>
      )}

      {/* Follow-up mini practice */}
      {correction.nextExercise && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
            Quick Check:
          </span>
          <p className="text-xs text-slate-200 mb-2">{correction.nextExercise.prompt}</p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={exerciseAnswer}
              onChange={e => setExerciseAnswer(e.target.value)}
              placeholder="Type missing word..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={checkMiniExercise}
              className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Check
            </button>
          </div>

          {exerciseChecked !== null && (
            <div className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${exerciseChecked ? 'text-emerald-400' : 'text-rose-400'}`}>
              {exerciseChecked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Correct! You nailed the rule.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Not quite. The target was: "{correction.nextExercise.targetAnswer}".</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {onPracticeTarget && (
        <button
          onClick={() => onPracticeTarget(correction.category)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-brand-300 hover:text-brand-200 py-1.5 px-3 rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors"
        >
          <span>Practice more {formatCategoryName(correction.category)} exercises</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
