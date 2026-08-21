import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Heart, 
  Droplet, 
  Shield, 
  Coins, 
  Sparkles, 
  Backpack, 
  User, 
  Scroll, 
  Hammer, 
  Map as MapIcon, 
  Volume2, 
  VolumeX, 
  Save, 
  Sun, 
  Moon,
  Swords,
  Hand
} from 'lucide-react';

export const HUD: React.FC = () => {
  const {
    stats,
    currentZone,
    gameTimeHours,
    hotbar,
    activeHotbarIndex,
    setActiveHotbarIndex,
    activeModal,
    setActiveModal,
    soundEnabled,
    toggleSound,
    saveGame,
    movePlayer,
    performAction,
    interactNearest
  } = useGame();

  const isDay = gameTimeHours >= 6 && gameTimeHours < 18;
  const timeFormatted = `${Math.floor(gameTimeHours).toString().padStart(2, '0')}:${Math.floor((gameTimeHours % 1) * 60).toString().padStart(2, '0')}`;

  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (stats.mp / stats.maxMp) * 100));
  const expPercent = Math.max(0, Math.min(100, (stats.exp / stats.maxExp) * 100));

  return (
    <div id="game-hud-overlay" className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 select-none">
      {/* Top Header: Player Status & Zone Info */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Player Stats Bars */}
        <div className="pointer-events-auto flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/60 shadow-xl min-w-[260px]">
          {/* Level & Name */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Level {stats.level} Hero
            </span>
            <span className="flex items-center gap-1 text-yellow-400 font-mono">
              <Coins className="w-3.5 h-3.5" />
              {stats.gold} G
            </span>
          </div>

          {/* Health Bar */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500/30 shrink-0" />
            <div className="relative w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-200"
                style={{ width: `${hpPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
                {stats.hp} / {stats.maxHp}
              </span>
            </div>
          </div>

          {/* Mana Bar */}
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-sky-500 fill-sky-500/30 shrink-0" />
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-200"
                style={{ width: `${mpPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/90">
                {stats.mp} / {stats.maxMp}
              </span>
            </div>
          </div>

          {/* EXP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold w-4 text-center">XP</span>
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-200"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Zone & Clock Info */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-xl">
          {isDay ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">{currentZone.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">{timeFormatted} {isDay ? 'Day' : 'Night'}</span>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl">
          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            id="btn-save-game"
            onClick={saveGame}
            className="p-2 rounded-lg hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Save Game Progress"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Center: Hotbar & Menu Navigation Buttons */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Navigation Bar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
          <button
            id="nav-character-btn"
            onClick={() => setActiveModal(activeModal === 'character' ? null : 'character')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeModal === 'character' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Character (C)</span>
          </button>

          <button
            id="nav-inventory-btn"
            onClick={() => setActiveModal(activeModal === 'inventory' ? null : 'inventory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeModal === 'inventory' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Backpack className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory (I)</span>
          </button>

          <button
            id="nav-crafting-btn"
            onClick={() => setActiveModal(activeModal === 'crafting' ? null : 'crafting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeModal === 'crafting' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span className="hidden sm:inline">Craft (K)</span>
          </button>

          <button
            id="nav-quests-btn"
            onClick={() => setActiveModal(activeModal === 'quests' ? null : 'quests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeModal === 'quests' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span className="hidden sm:inline">Quests (Q)</span>
          </button>

          <button
            id="nav-map-btn"
            onClick={() => setActiveModal(activeModal === 'map' ? null : 'map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeModal === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">World Map (M)</span>
          </button>
        </div>

        {/* Hotbar Slots (1-6) */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl">
          {hotbar.map((item, idx) => {
            const isSelected = activeHotbarIndex === idx;
            return (
              <button
                key={idx}
                id={`hotbar-slot-${idx}`}
                onClick={() => setActiveHotbarIndex(idx)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-105'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                }`}
                title={item ? `${item.name} (${idx + 1})` : `Empty Slot ${idx + 1}`}
              >
                <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-400">
                  {idx + 1}
                </span>
                {item && (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold truncate max-w-[34px] text-center text-slate-200">
                      {item.name.slice(0, 3)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-amber-300 font-mono">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* On-Screen Mobile Action Controls (Visible on mobile/touch) */}
      <div className="pointer-events-auto flex items-center justify-between mt-auto pt-2 sm:hidden">
        {/* Virtual D-Pad */}
        <div className="relative w-28 h-28 bg-slate-900/80 rounded-full border border-slate-700 p-2 flex items-center justify-center">
          <button
            onClick={() => movePlayer(0, -1)}
            className="absolute top-1 px-3 py-1.5 bg-slate-800 rounded-t-lg active:bg-indigo-600 text-xs font-bold"
          >
            ▲
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="absolute bottom-1 px-3 py-1.5 bg-slate-800 rounded-b-lg active:bg-indigo-600 text-xs font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => movePlayer(-1, 0)}
            className="absolute left-1 py-3 px-1.5 bg-slate-800 rounded-l-lg active:bg-indigo-600 text-xs font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="absolute right-1 py-3 px-1.5 bg-slate-800 rounded-r-lg active:bg-indigo-600 text-xs font-bold"
          >
            ▶
          </button>
        </div>

        {/* Action & Interact Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => interactNearest()}
            className="w-14 h-14 bg-amber-600/90 active:bg-amber-500 rounded-full flex flex-col items-center justify-center shadow-lg border border-amber-400 text-white font-bold"
          >
            <Hand className="w-5 h-5" />
            <span className="text-[9px]">Talk</span>
          </button>
          <button
            onClick={() => performAction()}
            className="w-16 h-16 bg-red-600/90 active:bg-red-500 rounded-full flex flex-col items-center justify-center shadow-lg border border-red-400 text-white font-bold"
          >
            <Swords className="w-6 h-6" />
            <span className="text-[10px]">Act</span>
          </button>
        </div>
      </div>
    </div>
  );
};
