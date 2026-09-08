import React from 'react';
import { Exercise } from '../../types';
import { formatCategoryName } from '../../utils/formatters';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SpeakButton } from '../common/SpeakButton';

interface ExerciseRendererProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  onSelectOption: (option: string) => void;
  onTypeAnswer?: (text: string) => void;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  selectedAnswer,
  isSubmitted,
  isCorrect,
  onSelectOption,
  onTypeAnswer
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/70 rounded-3xl p-5 shadow-xl">
      {/* Category and Level chips */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
          {formatCategoryName(exercise.category)}
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
          CEFR {exercise.difficulty}
        </span>
      </div>

      {/* Instruction */}
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
        {exercise.instruction}
      </p>

      {/* Question Prompt */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/60 mb-5 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white leading-relaxed flex-1">
          {exercise.question}
        </h3>
        <SpeakButton text={exercise.question} size="sm" variant="pill" label="Listen" />
      </div>

      {/* Options or Input */}
      {exercise.options && exercise.options.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5">
          {exercise.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTarget = option.toLowerCase() === exercise.correctAnswer.toLowerCase();

            let stateStyle = 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-700/50 text-slate-200';
            if (isSelected && !isSubmitted) {
              stateStyle = 'bg-brand-600/30 border-brand-500 text-white font-medium ring-1 ring-brand-500';
            } else if (isSubmitted) {
              if (isTarget) {
                stateStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium';
              } else if (isSelected && !isCorrect) {
                stateStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
              } else {
                stateStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => onSelectOption(option)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm text-left transition-all ${stateStyle}`}
              >
                <span>{option}</span>
                {isSubmitted && isTarget && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            type="text"
            disabled={isSubmitted}
            value={selectedAnswer || ''}
            onChange={e => {
              onSelectOption(e.target.value);
              if (onTypeAnswer) onTypeAnswer(e.target.value);
            }}
            placeholder="Type your answer here..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      )}

      {/* Explanation when submitted */}
      {isSubmitted && (
        <div className={`mt-4 p-3.5 rounded-2xl text-xs leading-relaxed border ${
          isCorrect 
            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-800/50 text-rose-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Well done! Correct.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Correct Answer: {exercise.correctAnswer}</span>
              </>
            )}
          </div>
          <p className="text-slate-300">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};
