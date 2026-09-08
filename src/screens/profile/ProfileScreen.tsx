import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useModelStore } from '../../store/modelStore';
import { SupportedLanguage, CEFRLevel } from '../../types';
import { Cpu, HardDrive, ShieldCheck, Download, Trash2, CheckCircle2, RotateCw, Globe, Target, AlertCircle } from 'lucide-react';
import { formatMb, formatBytes } from '../../utils/formatters';

const ALL_LANGUAGES: SupportedLanguage[] = [
  'Spanish', 'French', 'German', 'Japanese', 'Korean', 'English', 
  'Italian', 'Portuguese', 'Mandarin', 'Hindi', 'Marathi'
];

const ALL_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile } = useUserStore();
  const { 
    models, 
    activeModel, 
    storageInfo, 
    downloadingModelId, 
    downloadProgress, 
    downloadModel, 
    loadModel, 
    unloadModel, 
    deleteModel 
  } = useModelStore();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (targetLanguage: SupportedLanguage) => {
    setIsUpdating(true);
    await updateProfile({ targetLanguage });
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

      {/* On-Device AI Model Manager */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            <span>AI Model Manager</span>
          </h3>
          <span className="text-[10px] text-slate-400">GGUF Runtime</span>
        </div>

        <div className="space-y-3">
          {models.map(m => {
            const isDownloading = downloadingModelId === m.id;
            const isLoaded = activeModel?.id === m.id && m.isLoaded;

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all text-xs ${
                  isLoaded
                    ? 'bg-brand-950/40 border-brand-500/60 ring-1 ring-brand-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <span>{m.displayName}</span>
                      {isLoaded && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                  </div>
                  <span className="font-mono text-slate-400 font-semibold">{formatMb(m.sizeMb)}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono my-2">
                  <span>RAM: {m.minRamGb}GB min</span>
                  <span>Quant: {m.quantization}</span>
                  <span>Format: GGUF</span>
                </div>

                {isDownloading ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] text-brand-300 font-medium">
                      <span>Downloading & Verifying SHA-256...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    {!m.isInstalled ? (
                      <button
                        onClick={() => downloadModel(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download GGUF</span>
                      </button>
                    ) : isLoaded ? (
                      <button
                        onClick={() => unloadModel(m.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                      >
                        Unload
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => loadModel(m.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                        >
                          Load into RAM
                        </button>
                        <button
                          onClick={() => deleteModel(m.id)}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete model from device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage Information */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-brand-400" />
          <span>Device Storage Breakdown</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Installed AI Models:</span>
            <span className="font-semibold text-white">{formatMb(storageInfo.modelsUsedMb)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>SQLite Database & Memory:</span>
            <span className="font-semibold text-white">{formatMb(storageInfo.learningDataUsedMb)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Available Free Storage:</span>
            <span className="font-semibold text-emerald-400">{formatMb(storageInfo.availableDeviceMb)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
