import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CRAFTING_RECIPES, ITEMS_DATABASE } from '../data/items';
import { Recipe } from '../types/game';
import { X, Hammer, FlaskConical, Sparkles, Check, AlertCircle } from 'lucide-react';

export const CraftingModal: React.FC = () => {
  const { inventory, craftItem, setActiveModal } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'blacksmith' | 'alchemy'>('blacksmith');

  const filteredRecipes = CRAFTING_RECIPES.filter(r => r.category === selectedCategory);

  const canCraft = (recipe: Recipe): boolean => {
    return recipe.ingredients.every(req => {
      const invItem = inventory.find(i => i.id === req.itemId);
      return invItem && invItem.quantity >= req.quantity;
    });
  };

  return (
    <div id="crafting-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="crafting-modal-card"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Hammer className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Crafting Workshop</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('blacksmith')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'blacksmith' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" /> Blacksmithing
            </button>
            <button
              onClick={() => setSelectedCategory('alchemy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'alchemy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" /> Alchemy
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recipe List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map(recipe => {
            const resultItem = ITEMS_DATABASE[recipe.resultItemId];
            if (!resultItem) return null;
            const craftable = canCraft(recipe);

            return (
              <div
                key={recipe.id}
                className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{resultItem.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{resultItem.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                      x{recipe.resultQuantity}
                    </span>
                  </div>

                  {/* Required Ingredients List */}
                  <div className="mt-3 flex flex-col gap-1.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Required Materials</span>
                    {recipe.ingredients.map(req => {
                      const matItem = ITEMS_DATABASE[req.itemId];
                      const invItem = inventory.find(i => i.id === req.itemId);
                      const currentCount = invItem ? invItem.quantity : 0;
                      const hasEnough = currentCount >= req.quantity;

                      return (
                        <div key={req.itemId} className="flex items-center justify-between text-xs">
                          <span className={hasEnough ? 'text-slate-300' : 'text-slate-500'}>
                            {matItem?.name || req.itemId}
                          </span>
                          <span className={`font-mono font-bold ${hasEnough ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {currentCount} / {req.quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Craft Button */}
                <button
                  onClick={() => craftItem(recipe)}
                  disabled={!craftable}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                    craftable
                      ? selectedCategory === 'blacksmith'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {craftable ? (
                    <>
                      <Sparkles className="w-4 h-4" /> Forge / Brew
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" /> Missing Materials
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
