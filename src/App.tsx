import React, { useState, useEffect } from 'react';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useModelStore } from './store/modelStore';
import { seedInitialDataIfEmpty } from './database';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/navigation/BottomNav';
import { OnboardingScreen } from './screens/onboarding/OnboardingScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { ChatScreen } from './screens/chat/ChatScreen';
import { PracticeScreen } from './screens/practice/PracticeScreen';
import { VocabularyScreen } from './screens/vocabulary/VocabularyScreen';
import { ProgressScreen } from './screens/progress/ProgressScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { MistakeCategory } from './types';

export const App: React.FC = () => {
  const { isOnboarded, isLoading: isUserLoading, loadUser } = useUserStore();
  const { dueVocabulary, loadProgress } = useProgressStore();
  const { initModels } = useModelStore();

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [practiceCategory, setPracticeCategory] = useState<MistakeCategory | undefined>(undefined);

  useEffect(() => {
    const initApp = async () => {
      await seedInitialDataIfEmpty();
      await loadUser();
      await loadProgress();
      initModels();
    };
    initApp();
  }, []);

  const handlePracticeSpecificCategory = (category: string) => {
    setPracticeCategory(category as MistakeCategory);
    setCurrentTab('practice');
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium">Loading LinguaLocal Engine...</p>
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
        {currentTab === 'home' && (
          <HomeScreen onNavigateTab={tab => setCurrentTab(tab)} />
        )}
        {currentTab === 'chat' && (
          <ChatScreen onPracticeTopic={handlePracticeSpecificCategory} />
        )}
        {currentTab === 'practice' && (
          <PracticeScreen initialCategory={practiceCategory} />
        )}
        {currentTab === 'vocabulary' && (
          <VocabularyScreen />
        )}
        {currentTab === 'progress' && (
          <ProgressScreen />
        )}
        {currentTab === 'profile' && (
          <ProfileScreen />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab !== 'practice') {
            setPracticeCategory(undefined);
          }
          setCurrentTab(tab);
        }}
        dueVocabularyCount={dueVocabulary.length}
      />
    </div>
  );
};

export default App;
