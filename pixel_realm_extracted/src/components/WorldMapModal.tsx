import React from 'react';
import { useGame } from '../context/GameContext';
import { BiomeType } from '../types/game';
import { X, MapPin, Compass, Shield, Trees, Flame, Skull, Snowflake, Sparkles } from 'lucide-react';

const BIOMES_INFO: {
  id: BiomeType;
  name: string;
  desc: string;
  recommendedLvl: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'village',
    name: 'Village of Eldoria',
    desc: 'Peaceful frontier safe haven with traders, elder chieftain, lush herbal meadows, and fruit trees.',
    recommendedLvl: 'Lv. 1 - 3',
    color: 'from-emerald-900 to-emerald-950 border-emerald-500/50',
    icon: <Trees className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'forest',
    name: 'Whispering Forest',
    desc: 'Dense ancient woods teeming with direwolves, goblin scouts, and wild moonflowers.',
    recommendedLvl: 'Lv. 2 - 5',
    color: 'from-green-950 to-slate-950 border-green-500/50',
    icon: <Compass className="w-5 h-5 text-green-400" />
  },
  {
    id: 'mines',
    name: 'Obsidian Caverns',
    desc: 'Deep subterranean mining tunnels with rich veins of Iron, Gold, and Mithril guarded by Golems.',
    recommendedLvl: 'Lv. 4 - 8',
    color: 'from-slate-900 to-amber-950 border-amber-500/50',
    icon: <Flame className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'crypt',
    name: 'Ancient Sunken Crypt',
    desc: 'The sealed sanctum of ancient dragon lords, skeletal knights, and rare royal treasures.',
    recommendedLvl: 'Lv. 7 - 12 (Boss Arena)',
    color: 'from-purple-950 to-rose-950 border-rose-500/50',
    icon: <Skull className="w-5 h-5 text-rose-400" />
  },
  {
    id: 'snow_peak',
    name: 'Frozen Celestial Peak',
    desc: 'High glacial summits shrouded in eternal frost and sparkling crystal veins.',
    recommendedLvl: 'Lv. 6 - 10',
    color: 'from-sky-950 to-slate-950 border-sky-500/50',
    icon: <Snowflake className="w-5 h-5 text-sky-400" />
  }
];

export const WorldMapModal: React.FC = () => {
  const { currentZoneId, changeZone, setActiveModal } = useGame();

  return (
    <div id="world-map-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="world-map-card"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Realm Explorer & Map</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BIOMES_INFO.map(biome => {
            const isCurrent = currentZoneId === biome.id;

            return (
              <div
                key={biome.id}
                className={`p-5 rounded-2xl border bg-gradient-to-b ${biome.color} flex flex-col justify-between transition-all ${
                  isCurrent ? 'ring-2 ring-sky-400 shadow-xl scale-[1.02]' : 'hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                      {biome.icon}
                    </div>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full border border-sky-400/30">
                        <MapPin className="w-3.5 h-3.5" /> Current Location
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">{biome.recommendedLvl}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">{biome.name}</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{biome.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Waystone Portal</span>
                  <button
                    onClick={() => {
                      changeZone(biome.id);
                      setActiveModal(null);
                    }}
                    disabled={isCurrent}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg cursor-pointer'
                    }`}
                  >
                    {isCurrent ? 'Here' : 'Fast Travel'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
