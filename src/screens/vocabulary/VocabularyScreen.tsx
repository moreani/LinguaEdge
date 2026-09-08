import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useUserStore } from '../../store/userStore';
import { vocabularyRepo } from '../../database';
import { VocabularyWord } from '../../types';
import { Flashcard } from '../../components/vocabulary/Flashcard';
import { SpacedRepetition, ReviewGrade } from '../../learning/SpacedRepetition';
import { BookOpen, Plus, Search, CheckCircle2, RotateCw, Volume2 } from 'lucide-react';
import { SpeakButton } from '../../components/common/SpeakButton';
import { PandaAvatar } from '../../components/common/PandaAvatar';

export const VocabularyScreen: React.FC = () => {
  const { dueVocabulary, loadProgress } = useProgressStore();
  const { user } = useUserStore();

  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingWord, setIsAddingWord] = useState(false);

  // New word form state
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExample, setNewExample] = useState('');

  const refreshWords = async () => {
    const list = await vocabularyRepo.getAll();
    setAllWords(list);
    await loadProgress();
  };

  useEffect(() => {
    refreshWords();
  }, []);

  const handleGrade = async (grade: ReviewGrade) => {
    const word = dueVocabulary[activeReviewIndex];
    if (!word) return;

    const sm2 = SpacedRepetition.calculateNextReview(
      word.reviewCount,
      word.intervalDays,
      word.easeFactor,
      grade
    );

    await vocabularyRepo.updateWord(word.id, {
      confidence: grade,
      reviewCount: sm2.reviewCount,
      intervalDays: sm2.intervalDays,
      easeFactor: sm2.easeFactor,
      lastReviewed: new Date().toISOString(),
      nextReview: sm2.nextReviewDate
    });

    if (activeReviewIndex + 1 < dueVocabulary.length) {
      setActiveReviewIndex(activeReviewIndex + 1);
    } else {
      setActiveReviewIndex(0);
    }

    await refreshWords();
  };

  const handleAddWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    const createdWord: VocabularyWord = {
      id: 'voc_' + Date.now(),
      word: newWord.trim(),
      translation: newTranslation.trim(),
      exampleSentence: newExample.trim() || `${newWord.trim()} en una oración de ejemplo.`,
      exampleTranslation: 'Example sentence.',
      targetLanguage: user?.targetLanguage || 'Spanish',
      confidence: 3,
      reviewCount: 0,
      nextReview: new Date().toISOString(),
      intervalDays: 1,
      easeFactor: 2.5
    };

    await vocabularyRepo.addWord(createdWord);
    setNewWord('');
    setNewTranslation('');
    setNewExample('');
    setIsAddingWord(false);
    await refreshWords();
  };

  const filteredWords = allWords.filter(w =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReviewWord = dueVocabulary[activeReviewIndex];

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-2 space-y-5">
      {/* Review Queue Card */}
      {dueVocabulary.length > 0 && activeReviewWord ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-300 uppercase tracking-wider">
              Daily Flashcards ({activeReviewIndex + 1} of {dueVocabulary.length})
            </span>
            <span className="text-emerald-400 font-medium text-[11px]">Tap to hear audio 🐼</span>
          </div>

          <Flashcard word={activeReviewWord} onGrade={handleGrade} />
        </div>
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 text-center space-y-2.5">
          <PandaAvatar size="lg" mood="cheering" className="mx-auto" />
          <h3 className="text-base font-bold text-white">All Caught Up for Today! 🐼</h3>
          <p className="text-xs text-slate-300">
            Pandi says you're doing fantastic! Review again tomorrow to keep your streak.
          </p>
        </div>
      )}

      {/* Vocabulary List Header */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white">Vocabulary Deck</h3>
          <p className="text-[11px] text-slate-400">{allWords.length} words saved offline</p>
        </div>

        <button
          onClick={() => setIsAddingWord(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search vocabulary words or translations..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Words List */}
      <div className="space-y-2">
        {filteredWords.map(word => (
          <div
            key={word.id}
            className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs"
          >
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">{word.word}</h4>
                <SpeakButton text={word.word} language={word.targetLanguage} size="xs" variant="ghost" />
              </div>
              <p className="text-slate-300 text-xs mt-0.5">{word.translation}</p>
              <p className="text-[11px] text-slate-500 italic mt-1 truncate">
                "{word.exampleSentence}"
              </p>
            </div>

            <div className="text-right flex flex-col items-end flex-shrink-0 ml-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-brand-300 border border-slate-700">
                SRS: {word.intervalDays}d
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Reviews: {word.reviewCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add word modal */}
      {isAddingWord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddWordSubmit}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Add New Vocabulary Word</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Target Language Word:</label>
              <input
                type="text"
                required
                value={newWord}
                onChange={e => setNewWord(e.target.value)}
                placeholder="e.g. Biblioteca"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Translation:</label>
              <input
                type="text"
                required
                value={newTranslation}
                onChange={e => setNewTranslation(e.target.value)}
                placeholder="e.g. Library"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Example Sentence (optional):</label>
              <input
                type="text"
                value={newExample}
                onChange={e => setNewExample(e.target.value)}
                placeholder="e.g. Voy a la biblioteca a estudiar."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingWord(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Save Word
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
