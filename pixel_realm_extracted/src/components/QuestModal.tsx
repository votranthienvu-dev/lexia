import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ITEMS_DATABASE } from '../data/items';
import { X, Scroll, CheckCircle2, Circle, Gift, Coins, Sparkles } from 'lucide-react';

export const QuestModal: React.FC = () => {
  const { quests, setActiveModal } = useGame();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredQuests = quests.filter(q => {
    if (filter === 'in_progress') return q.status === 'in_progress';
    if (filter === 'completed') return q.status === 'completed' || q.status === 'turned_in';
    return true;
  });

  return (
    <div id="quests-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="quests-modal-card"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Scroll className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Journal & Quests</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'in_progress' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Done
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quests List */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {filteredQuests.map(quest => {
            const isDone = quest.status === 'completed' || quest.status === 'turned_in';

            return (
              <div
                key={quest.id}
                className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        {quest.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Giver: {quest.giverName}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{quest.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{quest.description}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    {isDone ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {/* Objectives Checklist */}
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objectives</span>
                  {quest.objectives.map(obj => {
                    const finished = obj.current >= obj.required;
                    return (
                      <div key={obj.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {finished ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className={finished ? 'text-slate-400 line-through' : 'text-slate-200'}>
                            {obj.description}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">
                          {obj.current} / {obj.required}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Rewards */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> +{quest.rewards.exp} XP
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Coins className="w-3.5 h-3.5" /> +{quest.rewards.gold} Gold
                    </span>
                  </div>

                  {quest.rewards.items && (
                    <div className="flex items-center gap-1 text-indigo-400">
                      <Gift className="w-3.5 h-3.5" />
                      <span>{quest.rewards.items.map(i => `${ITEMS_DATABASE[i.itemId]?.name || i.itemId} x${i.quantity}`).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
