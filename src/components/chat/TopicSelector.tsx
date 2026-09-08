import React from 'react';
import { ConversationTopic } from '../../types';
import { Utensils, Plane, Clock, ShoppingBag, Briefcase, Users, HeartPulse, Compass } from 'lucide-react';

import { PandaAvatar } from '../common/PandaAvatar';

interface TopicSelectorProps {
  onSelectTopic: (topic: ConversationTopic) => void;
}

const TOPICS: { topic: ConversationTopic; icon: React.ReactNode; desc: string }[] = [
  { topic: 'Ordering at a Restaurant', icon: <Utensils className="w-4 h-4 text-amber-400" />, desc: 'Food, drinks, recommendations' },
  { topic: 'Airport & Travel Directions', icon: <Plane className="w-4 h-4 text-sky-400" />, desc: 'Boarding, tickets, luggage, taxis' },
  { topic: 'Daily Routine & Hobbies', icon: <Clock className="w-4 h-4 text-emerald-400" />, desc: 'Time, schedule, habits, sports' },
  { topic: 'Shopping & Bargaining', icon: <ShoppingBag className="w-4 h-4 text-rose-400" />, desc: 'Prices, sizes, discounts, stores' },
  { topic: 'Making New Friends', icon: <Users className="w-4 h-4 text-purple-400" />, desc: 'Introductions, interests, origins' },
  { topic: 'Doctor & Health Visit', icon: <HeartPulse className="w-4 h-4 text-red-400" />, desc: 'Symptoms, pharmacy, prescriptions' },
  { topic: 'Job Interview & Career', icon: <Briefcase className="w-4 h-4 text-blue-400" />, desc: 'Work history, skills, ambitions' },
  { topic: 'Weekend Plans & Culture', icon: <Compass className="w-4 h-4 text-indigo-400" />, desc: 'Festivals, music, outings' }
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic }) => {
  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800 to-indigo-950/40 border border-brand-500/30 rounded-3xl p-4 flex items-center gap-3.5 shadow-xl">
        <PandaAvatar size="lg" mood="cheering" className="flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-white">Hi! I'm Pandi, your tutor 🐼</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Pick a topic below and let's practice speaking together! Tap any message to hear pronunciation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TOPICS.map(item => (
          <button
            key={item.topic}
            onClick={() => onSelectTopic(item.topic)}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/50 transition-all text-left group shadow-sm hover:scale-[1.01]"
          >
            <span className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-brand-500/40 transition-colors">
              {item.icon}
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                {item.topic}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
