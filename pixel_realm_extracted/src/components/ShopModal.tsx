import React from 'react';
import { useGame } from '../context/GameContext';
import { ITEMS_DATABASE } from '../data/items';
import { X, Store, Coins, ShoppingBag } from 'lucide-react';

export const ShopModal: React.FC = () => {
  const { shopItems, stats, buyItem, setActiveModal } = useGame();

  if (!shopItems) return null;

  return (
    <div id="shop-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="shop-modal-card"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Merchant Goods</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-yellow-400 text-xs font-bold font-mono">
              <Coins className="w-3.5 h-3.5" />
              {stats.gold} Gold
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Goods List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shopItems.map((entry, idx) => {
            const item = ITEMS_DATABASE[entry.itemId];
            if (!item) return null;
            const canAfford = stats.gold >= entry.price;

            return (
              <div
                key={`${entry.itemId}-${idx}`}
                className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 mt-1 font-mono">
                    <Coins className="w-3 h-3" /> {entry.price} Gold
                  </div>
                </div>

                <button
                  onClick={() => buyItem(entry.itemId, entry.price)}
                  disabled={!canAfford}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-md ${
                    canAfford
                      ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Buy
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
