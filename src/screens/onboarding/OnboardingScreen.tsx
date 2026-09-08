import React, { useState } from 'react';
import { SupportedLanguage, CEFRLevel } from '../../types';
import { useUserStore } from '../../store/userStore';
import { useModelStore } from '../../store/modelStore';
import { Sparkles, Globe, Target, Cpu, HardDrive, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { formatMb } from '../../utils/formatters';

const LANGUAGES: SupportedLanguage[] = [
  'Spanish', 'French', 'German', 'Japanese', 'Korean', 'English', 
  'Italian', 'Portuguese', 'Mandarin', 'Hindi', 'Marathi'
];

const LEVELS: { level: CEFRLevel; label: string; desc: string }[] = [
  { level: 'A1', label: 'Beginner', desc: 'Starting from scratch, basic greetings and words' },
  { level: 'A2', label: 'Elementary', desc: 'Simple everyday conversations and routines' },
  { level: 'B1', label: 'Intermediate', desc: 'Expressing opinions and understanding main ideas' },
  { level: 'B2', label: 'Upper Intermediate', desc: 'Fluent discussions on technical or complex topics' },
  { level: 'C1', label: 'Advanced', desc: 'Nuanced expression and deep linguistic mastery' }
];

const GOALS = [
  { minutes: 10, label: 'Casual (10 min/day)' },
  { minutes: 15, label: 'Regular (15 min/day)' },
  { minutes: 25, label: 'Intensive (25 min/day)' }
];

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useUserStore();
  const { models, downloadModel, downloadingModelId, downloadProgress } = useModelStore();

  const [step, setStep] = useState<number>(1);
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('Spanish');
  const [nativeLanguage, setNativeLanguage] = useState<SupportedLanguage>('English');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [selectedModelId, setSelectedModelId] = useState<string>('qwen2.5-0.5b-instruct');

  const handleFinish = async () => {
    // If selected model is not installed, trigger download
    const model = models.find(m => m.id === selectedModelId);
    if (model && !model.isInstalled) {
      await downloadModel(model.id);
    }

    await completeOnboarding({
      nativeLanguage,
      targetLanguage,
      level,
      dailyGoalMinutes: dailyGoal
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top progress indicator */}
      <div className="pt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">100% Offline & Private</span>
          </div>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="my-auto py-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
                <Globe className="w-8 h-8" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                What language do you want to learn?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your AI teacher will speak directly with you in this language.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto p-1">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setTargetLanguage(lang)}
                  className={`p-3 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
                    targetLanguage === lang
                      ? 'bg-brand-600/30 border-brand-500 text-white ring-1 ring-brand-500'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang}</span>
                  {targetLanguage === lang && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </button>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Your Native Language (for explanations):
              </label>
              <select
                value={nativeLanguage}
                onChange={e => setNativeLanguage(e.target.value as SupportedLanguage)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                <Target className="w-8 h-8" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                What is your current level?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We'll adapt sentence complexity, vocabulary, and grammar rules.
              </p>
            </div>

            <div className="space-y-2.5">
              {LEVELS.map(lvl => (
                <button
                  key={lvl.level}
                  onClick={() => setLevel(lvl.level)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    level === lvl.level
                      ? 'bg-brand-600/30 border-brand-500 ring-1 ring-brand-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 text-brand-300 border border-slate-700">
                    {lvl.level}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lvl.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{lvl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                <Sparkles className="w-8 h-8" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Set your daily learning goal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Small consistent daily habits lead to effortless fluency.
              </p>
            </div>

            <div className="space-y-3">
              {GOALS.map(g => (
                <button
                  key={g.minutes}
                  onClick={() => setDailyGoal(g.minutes)}
                  className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between ${
                    dailyGoal === g.minutes
                      ? 'bg-brand-600/30 border-brand-500 text-white ring-1 ring-brand-500'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{g.label}</span>
                  {dailyGoal === g.minutes && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <Cpu className="w-8 h-8" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Setup Local AI Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Runs 100% on your device. No cloud API, zero data leaves your phone.
              </p>
            </div>

            <div className="space-y-3">
              {models.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    selectedModelId === m.id
                      ? 'bg-brand-600/30 border-brand-500 ring-1 ring-brand-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {m.displayName}
                      {m.isInstalled && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                          Installed
                        </span>
                      )}
                    </h4>
                    <span className="text-xs font-mono text-slate-400">{formatMb(m.sizeMb)}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                    <span>RAM: {m.minRamGb}GB min</span>
                    <span>Format: GGUF {m.quantization}</span>
                  </div>
                </button>
              ))}
            </div>

            {downloadingModelId && (
              <div className="mt-4 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Downloading Model File...</span>
                  <span className="font-semibold">{downloadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Button Controls */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-md ml-auto"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-lg ml-auto"
          >
            <span>Start Learning Offline</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
