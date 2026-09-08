import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useVoiceStore } from '../../store/voiceStore';
import { SupportedLanguage, CEFRLevel } from '../../types';
import { ShieldCheck, Globe, Volume2 } from 'lucide-react';
import { PandaAvatar } from '../../components/common/PandaAvatar';

const ALL_LANGUAGES: SupportedLanguage[] = [
  'Korean', 'English', 'Spanish', 'French', 'German', 'Japanese', 
  'Italian', 'Portuguese', 'Mandarin', 'Hindi', 'Marathi'
];

const ALL_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile } = useUserStore();

  const {
    rate,
    availableVoices,
    selectedVoiceId,
    loadVoices,
    setRate,
    setSelectedVoiceId,
    testVoice
  } = useVoiceStore();

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadVoices(user?.targetLanguage);
  }, [user?.targetLanguage]);

  const handleLanguageChange = async (targetLanguage: SupportedLanguage) => {
    setIsUpdating(true);
    await updateProfile({ targetLanguage });
    await loadVoices(targetLanguage);
    setIsUpdating(false);
  };

  const handleLevelChange = async (level: CEFRLevel) => {
    setIsUpdating(true);
    await updateProfile({ level });
    setIsUpdating(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-2 space-y-5">
      {/* 100% Offline Privacy Badge */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-emerald-300">100% Offline & Private Guarantee</h4>
          <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-relaxed">
            All AI language inference, error corrections, SQLite records, and vocabulary reviews operate entirely on this device.
            Zero cloud AI APIs are used. No conversation data ever leaves your device.
          </p>
        </div>
      </div>

      {/* Language & Level Settings */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-400" />
          <span>Learner Preferences</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Target Language:</label>
            <select
              value={user?.targetLanguage || 'Spanish'}
              onChange={e => handleLanguageChange(e.target.value as SupportedLanguage)}
              disabled={isUpdating}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {ALL_LANGUAGES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">CEFR Level:</label>
            <select
              value={user?.level || 'A2'}
              onChange={e => handleLevelChange(e.target.value as CEFRLevel)}
              disabled={isUpdating}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {ALL_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Voice & Offline Speech (TTS) Settings */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-brand-400" />
            <span>Voice & Pronunciation (TTS)</span>
          </h3>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Offline Speech
          </span>
        </div>

        {/* Voice Selector */}
        <div>
          <label className="block text-[11px] text-slate-400 font-medium mb-1">
            {user?.targetLanguage || 'Target'} Voice:
          </label>
          {availableVoices.length > 0 ? (
            <select
              value={selectedVoiceId || ''}
              onChange={e => setSelectedVoiceId(e.target.value || null)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 truncate"
            >
              {availableVoices.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
              Default system {user?.targetLanguage || 'device'} voice
            </div>
          )}
        </div>

        {/* Speech Speed / Rate */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span>Speech Speed:</span>
            <span className="text-brand-300 font-bold">{rate}x</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 0.75, label: '0.75x Slow' },
              { val: 0.9, label: '0.9x Learner' },
              { val: 1.0, label: '1.0x Normal' },
              { val: 1.25, label: '1.25x Fast' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setRate(item.val)}
                className={`py-1.5 px-1 rounded-xl text-xs font-semibold border transition-all ${
                  rate === item.val
                    ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => testVoice(user?.targetLanguage || 'English')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-brand-300 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-brand-400" />
            <span>Test {user?.targetLanguage || 'Target'} Pronunciation</span>
          </button>
        </div>
      </div>

      {/* Pandi Companion Card */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800 to-indigo-950/40 border border-brand-500/30 rounded-3xl p-5 space-y-3 text-center shadow-xl">
        <PandaAvatar size="lg" mood="cheering" className="mx-auto" />
        <h3 className="text-base font-bold text-white">Made With Love For You ❤️</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
          Pandi is here with you every step of the way! Practice a few minutes every day and you will master {user?.targetLanguage || 'your new language'}.
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-400">
          <div>
            <span className="block font-bold text-white text-base">🔥 {user?.streakDays || 1}</span>
            <span className="text-[10px]">Day Streak</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="block font-bold text-brand-300 text-base">CEFR {user?.level || 'A1'}</span>
            <span className="text-[10px]">Current Level</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="block font-bold text-emerald-400 text-base">100%</span>
            <span className="text-[10px]">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
