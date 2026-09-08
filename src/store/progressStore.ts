import { create } from 'zustand';
import { SkillProgress, MistakeRecord, LessonSession, VocabularyWord } from '../types';
import { skillRepo, mistakeRepo, lessonRepo, vocabularyRepo } from '../database';
import { SkillEngine } from '../learning/SkillEngine';

interface ProgressState {
  skills: SkillProgress[];
  mistakes: MistakeRecord[];
  lessons: LessonSession[];
  dueVocabulary: VocabularyWord[];
  weeklyStats: { completedCount: number; avgScore: number };
  overallMastery: number;
  isLoading: boolean;
  loadProgress: () => Promise<void>;
  deleteMistake: (id: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  skills: [],
  mistakes: [],
  lessons: [],
  dueVocabulary: [],
  weeklyStats: { completedCount: 0, avgScore: 0 },
  overallMastery: 60,
  isLoading: true,

  loadProgress: async () => {
    set({ isLoading: true });
    try {
      const [mistakes, lessons, allVocab] = await Promise.all([
        mistakeRepo.getAll(),
        lessonRepo.getAll(),
        vocabularyRepo.getAll()
      ]);

      const dueVocab = await vocabularyRepo.getDueForReview();
      const weekly = await lessonRepo.getWeeklyStats();

      // Recalculate deterministic skills
      const calculatedSkills = SkillEngine.computeSkills(mistakes, lessons, allVocab);
      await skillRepo.saveSkills(calculatedSkills);

      const overall = Math.round(
        calculatedSkills.reduce((sum, s) => sum + s.score, 0) / calculatedSkills.length
      );

      set({
        skills: calculatedSkills,
        mistakes,
        lessons,
        dueVocabulary: dueVocab,
        weeklyStats: weekly,
        overallMastery: overall,
        isLoading: false
      });
    } catch {
      set({ isLoading: false });
    }
  },

  deleteMistake: async (id: string) => {
    await mistakeRepo.delete(id);
    await get().loadProgress();
  }
}));
