import { create } from 'zustand';
import { Conversation, Message, CorrectionResult, ConversationTopic } from '../types';
import { conversationRepo, messageRepo, mistakeRepo, lessonRepo } from '../database';
import { TeacherEngine } from '../ai/TeacherEngine';
import { useUserStore } from './userStore';

interface ConversationState {
  teacherEngine: TeacherEngine;
  currentConversation: Conversation | null;
  messages: Message[];
  isGenerating: boolean;
  streamingReply: string;
  activeCorrection: CorrectionResult | null;
  loadConversation: (id: string) => Promise<void>;
  startNewConversation: (topic: ConversationTopic | string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearActiveCorrection: () => void;
  endCurrentConversation: () => Promise<void>;
}

const teacherEngine = new TeacherEngine();

export const useConversationStore = create<ConversationState>((set, get) => ({
  teacherEngine,
  currentConversation: null,
  messages: [],
  isGenerating: false,
  streamingReply: '',
  activeCorrection: null,

  loadConversation: async (id: string) => {
    const conv = await conversationRepo.getById(id);
    if (!conv) return;
    const msgs = await messageRepo.getByConversationId(id);
    set({
      currentConversation: conv,
      messages: msgs,
      activeCorrection: null,
      streamingReply: ''
    });
  },

  startNewConversation: async (topic: ConversationTopic | string) => {
    const user = useUserStore.getState().user;
    if (!user) return;

    const newConv: Conversation = {
      id: 'conv_' + Date.now(),
      topic,
      targetLanguage: user.targetLanguage,
      createdAt: new Date().toISOString(),
      durationSeconds: 0,
      messageCount: 0
    };

    await conversationRepo.create(newConv);
    set({
      currentConversation: newConv,
      messages: [],
      isGenerating: true,
      streamingReply: ''
    });

    // Start conversation with teacher greeting
    try {
      const greeting = await teacherEngine.startConversation(user, topic);
      const assistantMsg: Message = {
        id: 'msg_' + Date.now(),
        conversationId: newConv.id,
        role: 'assistant',
        content: greeting,
        createdAt: new Date().toISOString()
      };
      await messageRepo.addMessage(assistantMsg);
      set({
        messages: [assistantMsg],
        isGenerating: false
      });
    } catch (err) {
      console.error('Error starting conversation:', err);
      const greeting = user.targetLanguage === 'Korean'
        ? `안녕하세요! 🐼 판디 선생님이에요. 오늘 "${topic}"에 대해 함께 즐겁게 이야기해 볼까요? (Hello! I'm Pandi. Let's practice "${topic}" together!)`
        : `¡Hola! 🐼 Soy tu tutor Pandi. Hoy vamos a practicar "${topic}". ¿Cómo estás?`;
      const assistantMsg: Message = {
        id: 'msg_' + Date.now(),
        conversationId: newConv.id,
        role: 'assistant',
        content: greeting,
        createdAt: new Date().toISOString()
      };
      await messageRepo.addMessage(assistantMsg);
      set({
        messages: [assistantMsg],
        isGenerating: false
      });
    }
  },

  sendMessage: async (text: string) => {
    const { currentConversation, messages, teacherEngine } = get();
    const user = useUserStore.getState().user;
    if (!currentConversation || !user || text.trim() === '') return;

    // 1. Add user message
    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      conversationId: currentConversation.id,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    await messageRepo.addMessage(userMsg);
    set({
      messages: updatedMessages,
      isGenerating: true,
      streamingReply: '',
      activeCorrection: null
    });

    try {
      // 2. Fetch known weaknesses for dynamic context
      const weaknesses = await mistakeRepo.getAll();

      // 3. Execute teacher engine offline
      const result = await teacherEngine.processLearnerSentence({
        user,
        topic: currentConversation.topic,
        learnerInput: text.trim(),
        recentMessages: updatedMessages,
        knownWeaknesses: weaknesses,
        onStreamingReplyToken: (token) => {
          set(state => ({ streamingReply: state.streamingReply + token }));
        }
      });

      // 4. Save mistake to database if an error was detected
      if (result.newMistake) {
        await mistakeRepo.recordMistake(result.newMistake);
      }

      // 5. Add assistant message
      const assistantMsg: Message = {
        id: 'msg_' + Date.now() + 1,
        conversationId: currentConversation.id,
        role: 'assistant',
        content: result.assistantMessageText,
        createdAt: new Date().toISOString(),
        correction: result.correction
      };

      await messageRepo.addMessage(assistantMsg);

      // 6. Update conversation count
      await conversationRepo.update(currentConversation.id, {
        messageCount: updatedMessages.length + 1
      });

      set({
        messages: [...updatedMessages, assistantMsg],
        isGenerating: false,
        streamingReply: '',
        activeCorrection: result.correction.isCorrect ? null : result.correction
      });
    } catch (err) {
      console.error('Error in conversation turn:', err);
      const fallbackContent = user.targetLanguage === 'Korean'
        ? `안녕하세요! 🐼 판디가 메시지를 잘 받았어요. 우리 계속해서 한국어로 이야기해 봐요! (I got your message! Shall we continue practicing?)`
        : `¡Hola! 🐼 Pandi recibió tu mensaje. ¡Sigamos practicando juntos!`;

      const fallbackMsg: Message = {
        id: 'msg_' + Date.now() + 1,
        conversationId: currentConversation.id,
        role: 'assistant',
        content: fallbackContent,
        createdAt: new Date().toISOString()
      };
      await messageRepo.addMessage(fallbackMsg);

      set({
        messages: [...updatedMessages, fallbackMsg],
        isGenerating: false,
        streamingReply: ''
      });
    }
  },

  clearActiveCorrection: () => {
    set({ activeCorrection: null });
  },

  endCurrentConversation: async () => {
    const { currentConversation, messages, teacherEngine } = get();
    if (!currentConversation || messages.length === 0) return;

    const mistakes = await mistakeRepo.getAll();
    const summary = await teacherEngine.summarizeLesson(
      currentConversation.topic,
      messages,
      mistakes
    );

    await conversationRepo.update(currentConversation.id, {
      summary: summary.encouragement
    });

    // Record as completed lesson session
    await lessonRepo.addLesson({
      id: 'les_' + Date.now(),
      type: 'conversation',
      topic: currentConversation.topic,
      difficulty: useUserStore.getState().user?.level || 'A2',
      score: 85,
      completedAt: new Date().toISOString(),
      exercisesCompleted: messages.filter(m => m.role === 'user').length,
      mistakesCount: mistakes.length
    });
  }
}));
