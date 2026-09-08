import { create } from 'zustand';
import { Exercise, MistakeCategory } from '../types';
import { mistakeRepo, lessonRepo } from '../database';
import { AdaptiveEngine } from '../learning/AdaptiveEngine';
import { TeacherEngine } from '../ai/TeacherEngine';
import { useUserStore } from './userStore';

interface PracticeState {
  adaptiveEngine: AdaptiveEngine;
  exercises: Exercise[];
  currentIndex: number;
  isLoading: boolean;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  sessionScore: number;
  isSessionFinished: boolean;
  startPracticeSession: (targetCategory?: MistakeCategory) => Promise<void>;
  selectOption: (option: string) => void;
  submitAnswer: () => Promise<void>;
  nextExercise: () => void;
}

const teacherEngine = new TeacherEngine();
const adaptiveEngine = new AdaptiveEngine(teacherEngine);

export const usePracticeStore = create<PracticeState>((set, get) => ({
  adaptiveEngine,
  exercises: [],
  currentIndex: 0,
  isLoading: false,
  selectedAnswer: null,
  isSubmitted: false,
  isCorrect: null,
  sessionScore: 0,
  isSessionFinished: false,

  startPracticeSession: async (targetCategory?: MistakeCategory) => {
    const user = useUserStore.getState().user;
    if (!user) return;

    set({ isLoading: true, isSessionFinished: false, currentIndex: 0, sessionScore: 0 });

    try {
      const mistakes = await mistakeRepo.getAll();
      let exerciseList: Exercise[] = [];

      if (targetCategory) {
        // Generate targeted batch for specific category
        for (let i = 0; i < 3; i++) {
          const ex = await teacherEngine.generateExercise(targetCategory, user);
          exerciseList.push(ex);
        }
      } else {
        // Adaptive selection based on ranked weaknesses
        exerciseList = await adaptiveEngine.generateAdaptiveSession(user, mistakes, 3);
      }

      set({
        exercises: exerciseList,
        currentIndex: 0,
        selectedAnswer: null,
        isSubmitted: false,
        isCorrect: null,
        isLoading: false
      });
    } catch {
      set({ isLoading: false });
    }
  },

  selectOption: (option: string) => {
    if (!get().isSubmitted) {
      set({ selectedAnswer: option });
    }
  },

  submitAnswer: async () => {
    const { exercises, currentIndex, selectedAnswer, sessionScore, adaptiveEngine } = get();
    const currentEx = exercises[currentIndex];
    if (!currentEx || !selectedAnswer) return;

    const correct = selectedAnswer.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();

    // If correct, reduce weakness score for this mistake category
    if (correct) {
      const allMistakes = await mistakeRepo.getAll();
      const updated = adaptiveEngine.resolveWeakness(allMistakes, currentEx.category);
      await mistakeRepo.updateWeaknessScores(updated);
    }

    set({
      isSubmitted: true,
      isCorrect: correct,
      sessionScore: correct ? sessionScore + 1 : sessionScore
    });
  },

  nextExercise: async () => {
    const { exercises, currentIndex, sessionScore } = get();
    if (currentIndex + 1 < exercises.length) {
      set({
        currentIndex: currentIndex + 1,
        selectedAnswer: null,
        isSubmitted: false,
        isCorrect: null
      });
    } else {
      // Session finished: save lesson to database
      const user = useUserStore.getState().user;
      const scorePct = Math.round((sessionScore / exercises.length) * 100);

      await lessonRepo.addLesson({
        id: 'les_' + Date.now(),
        type: 'targeted_practice',
        topic: 'Adaptive Grammar Drills',
        difficulty: user?.level || 'A2',
        score: scorePct,
        completedAt: new Date().toISOString(),
        exercisesCompleted: exercises.length,
        mistakesCount: exercises.length - sessionScore
      });

      set({ isSessionFinished: true });
    }
  }
}));
