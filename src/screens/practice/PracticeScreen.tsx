import React, { useEffect } from 'react';
import { usePracticeStore } from '../../store/practiceStore';
import { useProgressStore } from '../../store/progressStore';
import { ExerciseRenderer } from '../../components/practice/ExerciseRenderer';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MistakeCategory } from '../../types';
import { Dumbbell, RotateCcw, Trophy, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { formatCategoryName } from '../../utils/formatters';

interface PracticeScreenProps {
  initialCategory?: MistakeCategory;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ initialCategory }) => {
  const {
    exercises,
    currentIndex,
    isLoading,
    selectedAnswer,
    isSubmitted,
    isCorrect,
    sessionScore,
    isSessionFinished,
    startPracticeSession,
    selectOption,
    submitAnswer,
    nextExercise
  } = usePracticeStore();

  const { mistakes } = useProgressStore();

  useEffect(() => {
    if (exercises.length === 0 && !isSessionFinished) {
      startPracticeSession(initialCategory);
    }
  }, [initialCategory]);

  const currentEx = exercises[currentIndex];
  const progressPct = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <h3 className="text-base font-bold text-white">Generating Targeted Offline Drills...</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Your local on-device AI teacher is synthesizing exercises adapted to your weak areas.
        </p>
      </div>
    );
  }

  if (isSessionFinished) {
    const pct = Math.round((sessionScore / (exercises.length || 1)) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 block mb-1">
            Session Completed
          </span>
          <h2 className="text-2xl font-extrabold text-white">Great Job Practicing!</h2>
          <p className="text-xs text-slate-400 mt-1">
            You scored {sessionScore} out of {exercises.length} ({pct}%)
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 text-xs text-slate-300 space-y-2 text-left">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Weakness scores updated in local memory</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Repeated successful answers reduce recurrence frequency in future adaptive sessions.
          </p>
        </div>

        <button
          onClick={() => startPracticeSession()}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-3.5 px-4 rounded-2xl text-xs font-bold shadow-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Another Set</span>
        </button>
      </div>
    );
  }

  if (!currentEx) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center space-y-4">
        <Dumbbell className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Exercises Loaded</h3>
        <button
          onClick={() => startPracticeSession()}
          className="px-5 py-2.5 bg-brand-600 rounded-xl text-xs font-bold text-white"
        >
          Start Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Progress header */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Question {currentIndex + 1} of {exercises.length}</span>
          <span className="text-brand-400 font-bold">Score: {sessionScore}</span>
        </div>
        <ProgressBar progress={progressPct} />
      </div>

      {/* Interactive exercise component */}
      <ExerciseRenderer
        exercise={currentEx}
        selectedAnswer={selectedAnswer}
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        onSelectOption={selectOption}
      />

      {/* Action button: Submit or Next */}
      <div className="pt-2">
        {!isSubmitted ? (
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
              selectedAnswer
                ? 'bg-brand-600 hover:bg-brand-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={nextExercise}
            className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl text-xs font-bold shadow-md transition-all"
          >
            <span>{currentIndex + 1 === exercises.length ? 'Complete Session' : 'Next Exercise'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Weakness topic tag */}
      {mistakes.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Target specific category:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mistakes.slice(0, 4).map(m => (
              <button
                key={m.id}
                onClick={() => startPracticeSession(m.category)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
              >
                {formatCategoryName(m.category)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
