import { create } from 'zustand';
import { UserProfile, SupportedLanguage, CEFRLevel } from '../types';
import { userRepo } from '../database';

interface UserState {
  user: UserProfile | null;
  isOnboarded: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'streakDays' | 'lastActiveDate' | 'createdAt'>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isOnboarded: false,
  isLoading: true,

  loadUser: async () => {
    set({ isLoading: true });
    const user = await userRepo.getUser();
    if (user) {
      set({ user, isOnboarded: true, isLoading: false });
    } else {
      set({ user: null, isOnboarded: false, isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    await userRepo.saveUser(updated);
    set({ user: updated });
  },

  completeOnboarding: async (profileData) => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      nativeLanguage: profileData.nativeLanguage,
      targetLanguage: profileData.targetLanguage,
      level: profileData.level,
      dailyGoalMinutes: profileData.dailyGoalMinutes,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    await userRepo.saveUser(newUser);
    set({ user: newUser, isOnboarded: true });
  }
}));
