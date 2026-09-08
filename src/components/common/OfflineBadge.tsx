import React from 'react';
import { useModelStore } from '../../store/modelStore';
import { Cpu, Download, AlertCircle, CheckCircle2, WifiOff } from 'lucide-react';

export const OfflineBadge: React.FC = () => {
  const { status, activeModel, downloadProgress } = useModelStore();

  switch (status) {
    case 'offline_ready':
    case 'running_on_device':
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <WifiOff className="w-3 h-3" />
          <span className="hidden sm:inline">Offline — AI Ready</span>
          <span className="sm:hidden text-[11px]">Offline</span>
          {activeModel && (
            <span className="hidden md:inline text-emerald-400/70 border-l border-emerald-500/30 pl-1.5 ml-0.5 text-[11px]">
              {activeModel.displayName.split(' ')[0]}
            </span>
          )}
        </div>
      );

    case 'downloading':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span>Downloading Local Model ({downloadProgress}%)</span>
        </div>
      );

    case 'model_required':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Model Required (Setup Offline AI)</span>
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5" />
          <span>Local AI</span>
        </div>
      );
  }
};
