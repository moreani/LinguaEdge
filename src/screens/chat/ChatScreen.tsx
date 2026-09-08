import React, { useState, useEffect, useRef } from 'react';
import { useConversationStore } from '../../store/conversationStore';
import { useUserStore } from '../../store/userStore';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { CorrectionCard } from '../../components/chat/CorrectionCard';
import { TopicSelector } from '../../components/chat/TopicSelector';
import { Send, Sparkles, Flag, RefreshCw, ChevronLeft, Award } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { PandaAvatar } from '../../components/common/PandaAvatar';

interface ChatScreenProps {
  onPracticeTopic?: (category: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onPracticeTopic }) => {
  const {
    currentConversation,
    messages,
    isGenerating,
    streamingReply,
    activeCorrection,
    startNewConversation,
    sendMessage,
    clearActiveCorrection,
    endCurrentConversation
  } = useConversationStore();

  const { user } = useUserStore();

  const [inputVal, setInputVal] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingReply, activeCorrection]);

  const handleSend = () => {
    if (inputVal.trim() && !isGenerating) {
      const text = inputVal;
      setInputVal('');
      sendMessage(text);
    }
  };

  const handleSelectTopic = async (topic: ConversationTopic) => {
    await startNewConversation(topic);
  };

  const handleEndSession = async () => {
    await endCurrentConversation();
    setShowSummaryModal(true);
  };

  // If no active conversation, show topic selection
  if (!currentConversation) {
    return <TopicSelector onSelectTopic={handleSelectTopic} />;
  }

  // Quick suggested replies based on language
  const suggestedReplies = user?.targetLanguage === 'Korean'
    ? ['안녕하세요! 오늘 날씨가 참 좋아요.', '어제 친구를 만났어요.', '이 음식 정말 맛있어요!']
    : user?.targetLanguage === 'Spanish'
    ? ['Ayer yo fui al centro.', 'Me gusta mucho viajar.', '¿Qué me recomiendas?']
    : ['Yesterday I went downtown.', 'I really like traveling.', 'What do you recommend?'];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-lg mx-auto px-4 pb-20">
      {/* Chat header with active topic */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => useConversationStore.setState({ currentConversation: null })}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Change Topic"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-xs font-bold text-white truncate">{currentConversation.topic}</h3>
            <p className="text-[10px] text-slate-400">Offline Teacher · {user?.targetLanguage}</p>
          </div>
        </div>

        <button
          onClick={handleEndSession}
          className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Finish</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onViewCorrection={() => {
              if (msg.correction) {
                useConversationStore.setState({ activeCorrection: msg.correction });
              }
            }}
          />
        ))}

        {/* Live token streaming bubble */}
        {isGenerating && streamingReply && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0">
              <PandaAvatar size="sm" mood="talking" className="animate-bounce" />
            </div>
            <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-xs bg-slate-800/90 text-slate-100 text-sm border border-slate-700/60 shadow-md">
              <p className="whitespace-pre-wrap">{streamingReply}</p>
              <span className="inline-block w-1.5 h-3 ml-1 bg-brand-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Active inline correction card */}
        {activeCorrection && (
          <CorrectionCard
            correction={activeCorrection}
            onDismiss={clearActiveCorrection}
            onPracticeTarget={onPracticeTopic}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick replies */}
      {!isGenerating && messages.length > 0 && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestedReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => sendMessage(reply)}
              className="text-xs whitespace-nowrap bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/60 transition-colors flex-shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Message input bar */}
      <div className="pt-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/70 rounded-2xl p-1.5 focus-within:border-brand-500 shadow-lg"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            disabled={isGenerating}
            placeholder={`Reply in ${user?.targetLanguage || 'Spanish'}...`}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isGenerating}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inputVal.trim() && !isGenerating
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Session summary modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-brand-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <PandaAvatar size="xl" mood="cheering" className="mx-auto" />
            <h3 className="text-xl font-bold text-white">You Did Amazing! 🐼</h3>
            <p className="text-xs text-slate-300">
              {currentConversation.summary || 'Pandi is proud of your effort! Keep practicing every day to become fluent.'}
            </p>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1 text-left">
              <div className="flex justify-between">
                <span>Total Exchanges:</span>
                <span className="font-semibold text-white">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Mistakes Corrected:</span>
                <span className="font-semibold text-amber-400">
                  {messages.filter(m => m.correction && !m.correction.isCorrect).length}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSummaryModal(false);
                useConversationStore.setState({ currentConversation: null });
              }}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-semibold text-xs transition-colors"
            >
              Back to Topics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
