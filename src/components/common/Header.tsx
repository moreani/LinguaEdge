import React from 'react';
import { OfflineBadge } from './OfflineBadge';
import { Flame, Globe } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLanguageBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showLanguageBadge = true }) => {
  const { user } = useUserStore();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          {title ? (
            <h1 className="text-lg font-bold text-white truncate tracking-tight">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                LinguaEdge
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                100% Offline
              </span>
            </div>
          )}
          {subtitle && <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <OfflineBadge />

          {showLanguageBadge && user && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/60 rounded-full px-2.5 py-1 text-xs text-slate-200">
              <Globe className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-medium">{user.targetLanguage}</span>
              <span className="text-[10px] font-bold px-1 rounded bg-brand-500/30 text-brand-200">
                {user.level}
              </span>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-1 text-xs text-amber-400 font-semibold" title={`${user.streakDays} Day Streak`}>
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{user.streakDays}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
