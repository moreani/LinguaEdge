import React from 'react';
import { useUserStore } from '../../store/userStore';
import { useProgressStore } from '../../store/progressStore';
import { useModelStore } from '../../store/modelStore';
import { MessageSquare, Dumbbell, BookOpen, Sparkles, Trophy, ChevronRight, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { ProgressBar } from '../../components/common/ProgressBar';
import { TabType } from '../../components/navigation/BottomNav';

interface HomeScreenProps {
  onNavigateTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateTab }) => {
  const { user } = useUserStore();
  const { overallMastery, mistakes, dueVocabulary, lessons } = useProgressStore();
  const { activeModel } = useModelStore();

  const completedToday = lessons.filter(l => {
    const today = new Date().toISOString().slice(0, 10);
    return l.completedAt.startsWith(today);
  }).length;

  const targetLessons = Math.ceil((user?.dailyGoalMinutes || 15) / 5);
  const dailyGoalProgress = Math.min(100, Math.round((completedToday / targetLessons) * 100));

  return (
    <div className="pb-24 pt-2 px-4 max-w-lg mx-auto space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-900/60 via-slate-900 to-indigo-950/60 border border-brand-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider block mb-1">
              Welcome back
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Ready to speak {user?.targetLanguage || 'Spanish'}?
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              CEFR {user?.level || 'A2'} · Personal Offline Tutor
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Daily Practice Goal</span>
            <span className="text-brand-300 font-bold">{completedToday} / {targetLessons} sessions</span>
          </div>
          <ProgressBar progress={dailyGoalProgress} />
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => onNavigateTab('chat')}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-lg transition-all transform active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Continue AI Conversation</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Adaptive Practice */}
        <button
          onClick={() => onNavigateTab('practice')}
          className="p-4 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left flex flex-col justify-between shadow-sm group hover:scale-[1.02]"
        >
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
              Adaptive Drills
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {mistakes.length > 0 ? `${mistakes.length} weak areas found` : 'Daily grammar practice'}
            </p>
          </div>
        </button>

        {/* Vocabulary Deck */}
        <button
          onClick={() => onNavigateTab('vocabulary')}
          className="p-4 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left flex flex-col justify-between shadow-sm group hover:scale-[1.02]"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              SRS Flashcards
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {dueVocabulary.length > 0 ? `${dueVocabulary.length} cards due today` : 'All caught up'}
            </p>
          </div>
        </button>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Today's Linguistic Challenge</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Use 3 past-tense irregular verbs in a conversation session today.
          </p>
        </div>
      </div>

      {/* Mastery & On-Device Security Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local GGUF: {activeModel ? activeModel.displayName.split(' ')[0] : 'Ready'}</span>
        </div>
        <button
          onClick={() => onNavigateTab('progress')}
          className="text-brand-400 font-semibold hover:underline flex items-center gap-1"
        >
          <span>Mastery: {overallMastery}%</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
