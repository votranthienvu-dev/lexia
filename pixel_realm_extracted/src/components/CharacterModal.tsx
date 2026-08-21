import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { PixelRenderer } from '../utils/pixelRenderer';
import { Direction, EquipmentSlots } from '../types/game';
import { 
  X, 
  RotateCw, 
  Shield, 
  Sword, 
  Sparkles, 
  Heart, 
  Droplet, 
  Wind, 
  Flame, 
  Plus, 
  Check, 
  Palette,
  Eye,
  Crown
} from 'lucide-react';

const SKIN_TONES = ['#fcd34d', '#fed7aa', '#fde047', '#e2e8f0', '#d97706', '#78350f'];
const HAIR_COLORS = ['#1e293b', '#78350f', '#b45309', '#e2e8f0', '#fbbf24', '#0284c7', '#7c3aed', '#dc2626'];
const EYE_COLORS = ['#0284c7', '#38bdf8', '#10b981', '#78350f', '#a855f7', '#fbbf24', '#dc2626'];
const CLOTH_COLORS = ['#1e3a8a', '#1e40af', '#0f172a', '#065f46', '#701a75', '#991b1b', '#334155', '#ea580c'];

export const CharacterModal: React.FC = () => {
  const {
    appearance,
    setAppearance,
    equipment,
    unequipSlot,
    stats,
    masteries,
    allocateStatPoint,
    setActiveModal,
    animTick
  } = useGame();

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewDirection, setPreviewDirection] = useState<Direction>('down');
  const [activeTab, setActiveTab] = useState<'paperdoll' | 'customize' | 'masteries'>('paperdoll');

  // Rotate character preview
  const rotatePreview = () => {
    const sequence: Direction[] = ['down', 'right', 'up', 'left'];
    const currentIdx = sequence.indexOf(previewDirection);
    setPreviewDirection(sequence[(currentIdx + 1) % sequence.length]);
  };

  // Draw high-resolution Paperdoll
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Center and scale 4.5x for crisp high detail inspection
    PixelRenderer.drawHumanCharacter(
      ctx,
      canvas.width / 2,
      canvas.height / 2 + 10,
      4.5,
      appearance,
      equipment,
      previewDirection,
      'idle',
      animTick,
      true
    );
  }, [appearance, equipment, previewDirection, animTick]);

  // Compute total combat stats
  const totalAttack = stats.strength + (equipment.weapon?.stats?.attack || 0) + (equipment.accessory?.stats?.attack || 0);
  const totalDefense = (equipment.armor?.stats?.defense || 0) + (equipment.helmet?.stats?.defense || 0) + (equipment.offhand?.stats?.defense || 0) + (equipment.boots?.stats?.defense || 0);
  const totalMagic = stats.intelligence * 2 + (equipment.weapon?.stats?.magicPower || 0) + (equipment.armor?.stats?.magicPower || 0) + (equipment.helmet?.stats?.magicPower || 0);
  const totalCrit = (equipment.weapon?.stats?.critChance || 5) + (equipment.helmet?.stats?.critChance || 0) + Math.floor(stats.dexterity * 0.5);

  return (
    <div id="character-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="character-modal-card"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Hero Profile & Equipment</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('paperdoll')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paperdoll' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Paperdoll & Stats
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'customize' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('masteries')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'masteries' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Masteries
            </button>
            <button
              id="close-character-modal"
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Pixel Paperdoll Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="relative flex flex-col items-center justify-center w-full h-[280px]">
              <canvas
                id="character-paperdoll-canvas"
                ref={previewCanvasRef}
                width={240}
                height={260}
                className="pixelated drop-shadow-2xl"
              />
              <button
                onClick={rotatePreview}
                className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>
            </div>

            {/* Visual Equipment Gear Slots */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {/* Helmet */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Helmet</span>
                {equipment.helmet ? (
                  <button
                    onClick={() => unequipSlot('helmet')}
                    className="text-xs font-semibold text-amber-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.helmet.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>

              {/* Armor */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Armor</span>
                {equipment.armor ? (
                  <button
                    onClick={() => unequipSlot('armor')}
                    className="text-xs font-semibold text-amber-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.armor.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>

              {/* Boots */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Boots</span>
                {equipment.boots ? (
                  <button
                    onClick={() => unequipSlot('boots')}
                    className="text-xs font-semibold text-amber-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.boots.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>

              {/* Main Hand Weapon */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Weapon</span>
                {equipment.weapon ? (
                  <button
                    onClick={() => unequipSlot('weapon')}
                    className="text-xs font-semibold text-cyan-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.weapon.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>

              {/* Offhand Shield / Torch */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Off-Hand</span>
                {equipment.offhand ? (
                  <button
                    onClick={() => unequipSlot('offhand')}
                    className="text-xs font-semibold text-cyan-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.offhand.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>

              {/* Accessory */}
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 mb-1">Accessory</span>
                {equipment.accessory ? (
                  <button
                    onClick={() => unequipSlot('accessory')}
                    className="text-xs font-semibold text-purple-300 hover:text-red-400 truncate max-w-full"
                    title="Click to unequip"
                  >
                    {equipment.accessory.name}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Empty</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Tab Contents */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {activeTab === 'paperdoll' && (
              <>
                {/* Combat Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Sword className="w-3.5 h-3.5 text-red-400" /> Attack
                    </span>
                    <span className="text-lg font-bold text-white mt-1">{totalAttack}</span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-sky-400" /> Defense
                    </span>
                    <span className="text-lg font-bold text-white mt-1">{totalDefense}</span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Magic Power
                    </span>
                    <span className="text-lg font-bold text-white mt-1">{totalMagic}</span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Crit Rate
                    </span>
                    <span className="text-lg font-bold text-white mt-1">{totalCrit}%</span>
                  </div>
                </div>

                {/* Attributes & Point Allocation */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">Core Attributes</h3>
                    {stats.statPoints > 0 && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                        {stats.statPoints} Points Available
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Strength */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Strength (STR)</div>
                        <div className="text-[10px] text-slate-400">+Melee damage & carry</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{stats.strength}</span>
                        {stats.statPoints > 0 && (
                          <button
                            onClick={() => allocateStatPoint('strength')}
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dexterity */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Dexterity (DEX)</div>
                        <div className="text-[10px] text-slate-400">+Bow damage, crit & speed</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{stats.dexterity}</span>
                        {stats.statPoints > 0 && (
                          <button
                            onClick={() => allocateStatPoint('dexterity')}
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Intelligence */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Intelligence (INT)</div>
                        <div className="text-[10px] text-slate-400">+Spell power & Max Mana</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{stats.intelligence}</span>
                        {stats.statPoints > 0 && (
                          <button
                            onClick={() => allocateStatPoint('intelligence')}
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vitality */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Vitality (VIT)</div>
                        <div className="text-[10px] text-slate-400">+Max Health & recovery</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{stats.vitality}</span>
                        {stats.statPoints > 0 && (
                          <button
                            onClick={() => allocateStatPoint('vitality')}
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'customize' && (
              <div className="flex flex-col gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 max-h-[60vh] overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    Tùy Chỉnh Ngoại Hình & Phong Cách
                  </h3>
                </div>

                {/* Quick Archetype Presets */}
                <div>
                  <label className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> Hình Mẫu Học Giả & Nhân Vật
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setAppearance({
                        gender: 'male',
                        skinColor: '#fcd34d',
                        hairStyle: 'scholar_parted',
                        hairColor: '#1e293b',
                        eyeColor: '#0284c7',
                        eyewear: 'monocle',
                        shirtColor: '#1e3a8a',
                        pantsColor: '#0f172a',
                        shoesColor: '#1e293b',
                        capeStyle: 'scholar_mantle',
                        coatDetail: 'scholar_cravat'
                      })}
                      className="p-2 rounded-lg bg-slate-900 border border-blue-500/40 hover:border-blue-400 text-left transition-all"
                    >
                      <div className="text-xs font-bold text-blue-300">Học Giả Thiên Văn</div>
                      <div className="text-[10px] text-slate-400">Rẽ ngôi, kính đơn, áo choàng lam</div>
                    </button>

                    <button
                      onClick={() => setAppearance({
                        gender: 'male',
                        skinColor: '#fed7aa',
                        hairStyle: 'scholar_ponytail',
                        hairColor: '#e2e8f0',
                        eyeColor: '#a855f7',
                        eyewear: 'spectacles',
                        shirtColor: '#701a75',
                        pantsColor: '#1e1b4b',
                        shoesColor: '#3b0764',
                        capeStyle: 'scholar_mantle',
                        coatDetail: 'scholar_cravat'
                      })}
                      className="p-2 rounded-lg bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-left transition-all"
                    >
                      <div className="text-xs font-bold text-purple-300">Học Giả Quý Tộc</div>
                      <div className="text-[10px] text-slate-400">Tóc bạc đuôi ngựa, kính đôi</div>
                    </button>

                    <button
                      onClick={() => setAppearance({
                        gender: 'male',
                        skinColor: '#fde047',
                        hairStyle: 'scholar_messy',
                        hairColor: '#78350f',
                        eyeColor: '#10b981',
                        eyewear: 'scholar_circlet',
                        shirtColor: '#065f46',
                        pantsColor: '#022c22',
                        shoesColor: '#14532d',
                        capeStyle: 'scholar_mantle',
                        coatDetail: 'scholar_cravat'
                      })}
                      className="p-2 rounded-lg bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all"
                    >
                      <div className="text-xs font-bold text-emerald-300">Thư Sinh Lãng Tử</div>
                      <div className="text-[10px] text-slate-400">Tóc gợn sóng, vòng nguyệt quế</div>
                    </button>

                    <button
                      onClick={() => setAppearance({
                        gender: 'male',
                        skinColor: '#fed7aa',
                        hairStyle: 'spiky',
                        hairColor: '#dc2626',
                        eyeColor: '#fbbf24',
                        eyewear: 'none',
                        shirtColor: '#991b1b',
                        pantsColor: '#450a0a',
                        shoesColor: '#78350f',
                        capeStyle: 'royal_cape',
                        coatDetail: 'adventurer_vest'
                      })}
                      className="p-2 rounded-lg bg-slate-900 border border-rose-500/40 hover:border-rose-400 text-left transition-all"
                    >
                      <div className="text-xs font-bold text-rose-300">Kiếm Sĩ Hoàng Gia</div>
                      <div className="text-[10px] text-slate-400">Tóc gai, choàng hoàng tộc</div>
                    </button>
                  </div>
                </div>

                {/* Hairstyle Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Kiểu Tóc (Hairstyle)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { id: 'scholar_parted', label: 'Học Giả Rẽ Ngôi' },
                      { id: 'scholar_ponytail', label: 'Đuôi Ngựa Quý Tộc' },
                      { id: 'scholar_messy', label: 'Thư Sinh Gợn Sóng' },
                      { id: 'wizard_braid', label: 'Tóc Dài Phù Thủy' },
                      { id: 'short', label: 'Tóc Ngắn Gọn' },
                      { id: 'spiky', label: 'Tóc Gai Chiến Binh' },
                      { id: 'long', label: 'Tóc Dài Tự Nhiên' }
                    ] as const).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setAppearance(prev => ({ ...prev, hairStyle: item.id }))}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-all text-center ${
                          appearance.hairStyle === item.id
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eyewear Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Mắt Kính & Phụ Kiện Mặt (Eyewear)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { id: 'monocle', label: 'Kính Đơn Hoàng Gia' },
                      { id: 'spectacles', label: 'Mắt Kính Học Giả' },
                      { id: 'scholar_circlet', label: 'Vòng Nguyệt Quế' },
                      { id: 'none', label: 'Không Đeo Kính' }
                    ] as const).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setAppearance(prev => ({ ...prev, eyewear: item.id }))}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-all text-center ${
                          (appearance.eyewear || 'monocle') === item.id
                            ? 'bg-sky-600 border-sky-400 text-white shadow'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cape Style */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Áo Choàng Phong Nhã (Cape)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'scholar_mantle', label: 'Choàng Vai Học Giả' },
                      { id: 'royal_cape', label: 'Choàng Dài Hoàng Tộc' },
                      { id: 'none', label: 'Không Choàng' }
                    ] as const).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setAppearance(prev => ({ ...prev, capeStyle: item.id }))}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-all text-center ${
                          (appearance.capeStyle || 'scholar_mantle') === item.id
                            ? 'bg-amber-600 border-amber-400 text-white shadow'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Tone */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Màu Da (Skin Complexion)</label>
                  <div className="flex gap-2">
                    {SKIN_TONES.map(color => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, skinColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          appearance.skinColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Màu Tóc (Hair Color)</label>
                  <div className="flex gap-2 flex-wrap">
                    {HAIR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, hairColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          appearance.hairColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Eye Color */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Màu Mắt Tinh Tú (Eye Color)</label>
                  <div className="flex gap-2 flex-wrap">
                    {EYE_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, eyeColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          appearance.eyeColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Shirt / Robe Color */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Màu Áo Choàng / Lễ Phục (Coat Color)</label>
                  <div className="flex gap-2 flex-wrap">
                    {CLOTH_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, shirtColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          appearance.shirtColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'masteries' && (
              <div className="flex flex-col gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <h3 className="text-sm font-bold text-slate-200">Gathering & Combat Masteries</h3>

                {/* Woodcutting */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-400">Woodcutting Mastery</span>
                    <span className="text-slate-300 font-mono">Level {masteries.woodcutting.level}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[65%]" />
                  </div>
                </div>

                {/* Mining */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-sky-400">Mining Mastery</span>
                    <span className="text-slate-300 font-mono">Level {masteries.mining.level}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-[50%]" />
                  </div>
                </div>

                {/* Herbalism */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-400">Herbalism Mastery</span>
                    <span className="text-slate-300 font-mono">Level {masteries.herbalism.level}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[40%]" />
                  </div>
                </div>

                {/* Combat */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-red-400">Combat Mastery</span>
                    <span className="text-slate-300 font-mono">Level {masteries.combat.level}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[80%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
