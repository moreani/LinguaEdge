import React, { useState, useEffect } from 'react';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useModelStore } from './store/modelStore';
import { seedInitialDataIfEmpty } from './database';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/navigation/BottomNav';
import { OnboardingScreen } from './screens/onboarding/OnboardingScreen';
import { ChatScreen } from './screens/chat/ChatScreen';
import { VocabularyScreen } from './screens/vocabulary/VocabularyScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { PandaAvatar } from './components/common/PandaAvatar';

export const App: React.FC = () => {
  const { isOnboarded, isLoading: isUserLoading, loadUser } = useUserStore();
  const { dueVocabulary, loadProgress } = useProgressStore();
  const { initModels } = useModelStore();

  const [currentTab, setCurrentTab] = useState<TabType>('tutor');

  useEffect(() => {
    const initApp = async () => {
      await seedInitialDataIfEmpty();
      await loadUser();
      await loadProgress();
      initModels();
    };
    initApp();
  }, []);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <PandaAvatar size="xl" mood="happy" className="animate-bounce" />
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-white">LinguaEdge</h2>
          <p className="text-xs text-brand-300">Pandi is preparing your lesson... 🐼</p>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <OnboardingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
      <Header />

      <main className="flex-1 overflow-x-hidden">
        {currentTab === 'tutor' && (
          <ChatScreen />
        )}
        {currentTab === 'vocabulary' && (
          <VocabularyScreen />
        )}
        {currentTab === 'settings' && (
          <ProfileScreen />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        dueVocabularyCount={dueVocabulary.length}
      />
    </div>
  );
};

export default App;
