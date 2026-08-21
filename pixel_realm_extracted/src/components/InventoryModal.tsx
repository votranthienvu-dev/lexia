import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameItem, ItemRarity } from '../types/game';
import { 
  X, 
  Sparkles, 
  Sword, 
  Shield, 
  Heart, 
  Droplet, 
  Zap, 
  Coins, 
  Trash2, 
  CheckCircle,
  Package
} from 'lucide-react';

const RARITY_COLORS: Record<ItemRarity, { border: string; bg: string; text: string }> = {
  common: { border: 'border-slate-600', bg: 'bg-slate-800/80', text: 'text-slate-300' },
  uncommon: { border: 'border-emerald-500', bg: 'bg-emerald-950/40', text: 'text-emerald-400' },
  rare: { border: 'border-sky-500', bg: 'bg-sky-950/40', text: 'text-sky-400' },
  epic: { border: 'border-purple-500', bg: 'bg-purple-950/40', text: 'text-purple-400' },
  legendary: { border: 'border-amber-500', bg: 'bg-amber-950/40', text: 'text-amber-400' },
  mythic: { border: 'border-rose-500', bg: 'bg-rose-950/40', text: 'text-rose-400' }
};

export const InventoryModal: React.FC = () => {
  const {
    inventory,
    equipItem,
    useConsumable,
    setActiveModal,
    sellItem,
    shopItems
  } = useGame();

  const [selectedItem, setSelectedItem] = useState<GameItem | null>(inventory[0] || null);

  const isEquippable = (type: string) =>
    type.startsWith('weapon') || type.startsWith('tool') || type === 'shield' || type === 'helmet' || type === 'armor' || type === 'boots' || type === 'accessory';

  return (
    <div id="inventory-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="inventory-modal-card"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Backpack & Items ({inventory.length} / 32)</h2>
          </div>
          <button
            id="close-inventory-modal"
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Item Grid */}
          <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800 grid grid-cols-5 sm:grid-cols-6 gap-2.5 max-h-[360px] overflow-y-auto content-start">
            {inventory.map((item, index) => {
              const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => setSelectedItem(item)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 border transition-all ${
                    rarityStyle.bg
                  } ${rarityStyle.border} ${
                    isSelected ? 'ring-2 ring-indigo-400 scale-105 shadow-lg' : 'hover:border-white/60'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mb-1"
                    style={{ backgroundColor: item.color || '#94a3b8' }}
                  />
                  <span className="text-[10px] font-bold text-slate-200 truncate max-w-full text-center leading-none">
                    {item.name.slice(0, 4)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-amber-300 font-mono bg-slate-950/80 px-1 rounded">
                      {item.quantity}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Empty filler slots */}
            {Array.from({ length: Math.max(0, 30 - inventory.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square rounded-xl border border-slate-800/40 bg-slate-900/30 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-slate-800/40" />
              </div>
            ))}
          </div>

          {/* Item Detail Inspector */}
          <div className="md:col-span-5 bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 flex flex-col justify-between">
            {selectedItem ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        RARITY_COLORS[selectedItem.rarity].text
                      }`}
                    >
                      {selectedItem.rarity}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{selectedItem.type.replace('_', ' ')}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedItem.description}</p>
                </div>

                {/* Stats Breakdown */}
                {selectedItem.stats && (
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-xs">
                    {selectedItem.stats.attack && (
                      <div className="flex justify-between text-red-400">
                        <span>Physical Attack</span>
                        <span className="font-bold">+{selectedItem.stats.attack}</span>
                      </div>
                    )}
                    {selectedItem.stats.magicPower && (
                      <div className="flex justify-between text-purple-400">
                        <span>Magic Power</span>
                        <span className="font-bold">+{selectedItem.stats.magicPower}</span>
                      </div>
                    )}
                    {selectedItem.stats.defense && (
                      <div className="flex justify-between text-sky-400">
                        <span>Defense</span>
                        <span className="font-bold">+{selectedItem.stats.defense}</span>
                      </div>
                    )}
                    {selectedItem.stats.speed && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Movement Speed</span>
                        <span className="font-bold">+{selectedItem.stats.speed}</span>
                      </div>
                    )}
                    {selectedItem.stats.critChance && (
                      <div className="flex justify-between text-amber-400">
                        <span>Crit Chance</span>
                        <span className="font-bold">+{selectedItem.stats.critChance}%</span>
                      </div>
                    )}
                    {selectedItem.stats.miningPower && (
                      <div className="flex justify-between text-yellow-400">
                        <span>Mining Power</span>
                        <span className="font-bold">+{selectedItem.stats.miningPower}</span>
                      </div>
                    )}
                    {selectedItem.stats.woodcuttingPower && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Woodcutting Power</span>
                        <span className="font-bold">+{selectedItem.stats.woodcuttingPower}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Consumable Effects */}
                {selectedItem.effect && (
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col gap-1 text-xs">
                    {selectedItem.effect.healHp && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Heal Health</span>
                        <span className="font-bold">+{selectedItem.effect.healHp} HP</span>
                      </div>
                    )}
                    {selectedItem.effect.healMp && (
                      <div className="flex justify-between text-sky-400">
                        <span>Restore Mana</span>
                        <span className="font-bold">+{selectedItem.effect.healMp} MP</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Sell Value */}
                <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>Sell Value: {selectedItem.sellPrice} Gold each</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-2">
                  {isEquippable(selectedItem.type) && (
                    <button
                      onClick={() => equipItem(selectedItem)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Equip Item
                    </button>
                  )}

                  {selectedItem.type === 'consumable' && (
                    <button
                      onClick={() => useConsumable(selectedItem)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-4 h-4" /> Consume / Use
                    </button>
                  )}

                  {shopItems && (
                    <button
                      onClick={() => sellItem(selectedItem)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-4 h-4" /> Sell 1x for {selectedItem.sellPrice} G
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Select an item to inspect details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
