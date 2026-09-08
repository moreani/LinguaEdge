import React, { useEffect } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useUserStore } from '../../store/userStore';
import { BarChart3, TrendingUp, AlertCircle, Trash2, Flame, Award, Clock } from 'lucide-react';
import { formatCategoryName, formatDate } from '../../utils/formatters';

export const ProgressScreen: React.FC = () => {
  const { skills, mistakes, lessons, weeklyStats, overallMastery, loadProgress, deleteMistake } = useProgressStore();
  const { user } = useUserStore();

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-2 space-y-5">
      {/* Top Overview Score Card */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-800 border border-brand-500/30 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider block mb-1">
            Proficiency Rating
          </span>
          <h2 className="text-3xl font-extrabold text-white">{overallMastery}%</h2>
          <p className="text-xs text-slate-400 mt-1">
            CEFR {user?.level || 'A2'} · {user?.targetLanguage || 'Spanish'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-brand-500/40 bg-brand-500/10 shadow-inner">
          <Award className="w-8 h-8 text-brand-400" />
        </div>
      </div>

      {/* 4 Skill Mastery Bars */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-1">
          <h3 className="font-bold text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <span>Skill Breakdown</span>
          </h3>
          <span className="text-[10px] text-slate-400">Dynamic Heuristic</span>
        </div>

        {skills.map(s => (
          <div key={s.skill} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium capitalize">{s.skill}</span>
              <span className="text-white font-bold">{s.score}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>7-Day Sessions</span>
          </span>
          <h4 className="text-2xl font-bold text-white">{weeklyStats.completedCount}</h4>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Average Score</span>
          </span>
          <h4 className="text-2xl font-bold text-white">{weeklyStats.avgScore}%</h4>
        </div>
      </div>

      {/* Mistake Log & Weak Topics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Recurring Mistake Memory ({mistakes.length})</span>
          </h3>
          <span className="text-[10px] text-slate-500">Stored in Local SQLite</span>
        </div>

        {mistakes.length === 0 ? (
          <div className="bg-slate-800/60 rounded-2xl p-4 text-center text-xs text-slate-400">
            No mistakes recorded yet. Start a conversation to receive personalized corrections!
          </div>
        ) : (
          <div className="space-y-2.5">
            {mistakes.map(m => (
              <div
                key={m.id}
                className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 text-xs text-slate-300 relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-white text-xs">
                      {formatCategoryName(m.category)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                      m.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : m.severity === 'moderate'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {m.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Freq: {m.frequency}x
                    </span>
                  </div>

                  <button
                    onClick={() => deleteMistake(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Delete mistake"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 font-mono text-[11px] bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
                  <p className="line-through text-rose-400/90">{m.originalText}</p>
                  <p className="text-emerald-400">{m.correctedText}</p>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {m.explanation}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800">
                  <span>Last seen: {formatDate(m.lastSeen)}</span>
                  <span>Weakness Index: {m.weaknessScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
