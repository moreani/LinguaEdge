import React from 'react';
import { Home, Dumbbell, MessageSquare, BookOpen, BarChart3, Settings } from 'lucide-react';

export type TabType = 'home' | 'practice' | 'chat' | 'vocabulary' | 'progress' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  dueVocabularyCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  dueVocabularyCount = 0
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'chat', label: 'AI Tutor', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'practice', label: 'Practice', icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'vocabulary', label: 'Vocab', icon: <BookOpen className="w-5 h-5" />, badge: dueVocabularyCount },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'Models', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-brand-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-slate-900">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
