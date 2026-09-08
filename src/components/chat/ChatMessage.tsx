import React from 'react';
import { Message } from '../../types';
import { Bot, User, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface ChatMessageProps {
  message: Message;
  onViewCorrection?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onViewCorrection }) => {
  const isUser = message.role === 'user';
  const hasCorrection = message.correction && !message.correction.isCorrect;

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-md ${
          isUser
            ? 'bg-gradient-to-tr from-brand-600 to-indigo-600'
            : 'bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-400" />}
      </div>

      <div className={`max-w-[82%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-brand-600 text-white rounded-tr-xs shadow-md'
              : 'bg-slate-800/90 text-slate-100 rounded-tl-xs border border-slate-700/60 shadow-md'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Correction Trigger Pill if this message has an associated mistake */}
          {hasCorrection && (
            <button
              onClick={onViewCorrection}
              className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1 Grammar Improvement Available</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-500 mt-1 px-1">
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
