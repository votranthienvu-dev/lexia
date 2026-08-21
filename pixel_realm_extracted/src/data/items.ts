import { GameItem, Recipe } from '../types/game';

export const ITEMS_DATABASE: Record<string, GameItem> = {
  // Tools
  pickaxe_iron: {
    id: 'pickaxe_iron',
    name: 'Iron Pickaxe',
    description: 'A sturdy iron pickaxe for mining stone, iron, and gold veins.',
    type: 'tool_pickaxe',
    rarity: 'uncommon',
    iconId: 'pickaxe',
    stackable: false,
    quantity: 1,
    stats: { attack: 8, miningPower: 15 },
    sellPrice: 30,
    color: '#94a3b8'
  },
  pickaxe_mithril: {
    id: 'pickaxe_mithril',
    name: 'Mithril Pickaxe',
    description: 'Forged from radiant deep earth mithril. Cuts through enchanted crystal veins with ease.',
    type: 'tool_pickaxe',
    rarity: 'epic',
    iconId: 'pickaxe',
    stackable: false,
    quantity: 1,
    stats: { attack: 22, miningPower: 45, speed: 2 },
    sellPrice: 180,
    color: '#38bdf8'
  },
  axe_woodcutter: {
    id: 'axe_woodcutter',
    name: 'Woodcutter Axe',
    description: 'A sharp heavy axe for felling trees and harvesting logs.',
    type: 'tool_axe',
    rarity: 'common',
    iconId: 'axe',
    stackable: false,
    quantity: 1,
    stats: { attack: 10, woodcuttingPower: 15 },
    sellPrice: 25,
    color: '#a1a1aa'
  },
  axe_runic: {
    id: 'axe_runic',
    name: 'Runic Battleaxe',
    description: 'Imbued with ancient forest spirits. Gathers timber rapidly and cleaves enemies.',
    type: 'tool_axe',
    rarity: 'rare',
    iconId: 'axe',
    stackable: false,
    quantity: 1,
    stats: { attack: 28, woodcuttingPower: 40, critChance: 12 },
    sellPrice: 150,
    color: '#10b981'
  },

  // Weapons (Melee)
  sword_novice: {
    id: 'sword_novice',
    name: 'Novice Broadsword',
    description: 'A reliable steel blade carried by aspiring adventurers.',
    type: 'weapon_melee',
    rarity: 'common',
    iconId: 'sword',
    stackable: false,
    quantity: 1,
    stats: { attack: 12, speed: 1 },
    sellPrice: 20,
    color: '#cbd5e1'
  },
  sword_flame: {
    id: 'sword_flame',
    name: 'Flametongue Greatsword',
    description: 'Enchanted with volcanic fire essence. Ignites enemies on hit.',
    type: 'weapon_melee',
    rarity: 'epic',
    iconId: 'sword',
    stackable: false,
    quantity: 1,
    stats: { attack: 38, magicPower: 15, critChance: 15 },
    sellPrice: 220,
    color: '#ef4444'
  },
  sword_radiant: {
    id: 'sword_radiant',
    name: 'Radiant Dawnblade',
    description: 'A legendary sacred sword blessed by the Sun Goddess.',
    type: 'weapon_melee',
    rarity: 'legendary',
    iconId: 'sword',
    stackable: false,
    quantity: 1,
    stats: { attack: 55, defense: 10, critChance: 25, healthBonus: 50 },
    sellPrice: 500,
    color: '#facc15'
  },

  // Weapons (Ranged)
  bow_hunter: {
    id: 'bow_hunter',
    name: 'Hunter Longbow',
    description: 'Carved from flexible yew wood. Shoots piercing arrows across distances.',
    type: 'weapon_ranged',
    rarity: 'uncommon',
    iconId: 'bow',
    stackable: false,
    quantity: 1,
    stats: { attack: 16, critChance: 10, speed: 2 },
    sellPrice: 45,
    color: '#b45309'
  },
  bow_elven: {
    id: 'bow_elven',
    name: 'Elven Windrunner Bow',
    description: 'Blessed by forest sylphs. Arrows fly with gale force.',
    type: 'weapon_ranged',
    rarity: 'rare',
    iconId: 'bow',
    stackable: false,
    quantity: 1,
    stats: { attack: 32, critChance: 22, speed: 5 },
    sellPrice: 190,
    color: '#22c55e'
  },

  // Weapons (Magic Staves & Scholar Grimoires)
  wand_scholar_quill: {
    id: 'wand_scholar_quill',
    name: 'Starlight Celestial Quill',
    description: 'A glowing feather quill woven from celestial crystal. Inscribes glowing arcane formulas in the air.',
    type: 'weapon_magic',
    rarity: 'rare',
    iconId: 'wand',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 35, critChance: 15, manaBonus: 50 },
    sellPrice: 160,
    color: '#38bdf8'
  },
  staff_apprentice: {
    id: 'staff_apprentice',
    name: 'Apprentice Wand',
    description: 'A polished oak staff topped with a glowing sapphire focus.',
    type: 'weapon_magic',
    rarity: 'uncommon',
    iconId: 'wand',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 18, manaBonus: 25 },
    sellPrice: 40,
    color: '#38bdf8'
  },
  staff_celestial: {
    id: 'staff_celestial',
    name: 'Celestial Archon Staff',
    description: 'Harnesses stellar energy to cast devastating elemental barrages.',
    type: 'weapon_magic',
    rarity: 'legendary',
    iconId: 'wand',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 60, attack: 10, manaBonus: 100, critChance: 20 },
    sellPrice: 450,
    color: '#a855f7'
  },

  // Shields / Offhand & Tomes
  tome_astronomy: {
    id: 'tome_astronomy',
    name: 'Astral Scholar Codex',
    description: 'An ancient illuminated grimoire containing celestial star charts and lost theorems. Pages float with soft starlight.',
    type: 'shield',
    rarity: 'rare',
    iconId: 'book-open',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 25, manaBonus: 60, defense: 8 },
    sellPrice: 180,
    color: '#0284c7'
  },
  shield_wooden: {
    id: 'shield_wooden',
    name: 'Reinforced Buckler',
    description: 'Oak wood shield banded with iron strips.',
    type: 'shield',
    rarity: 'common',
    iconId: 'shield',
    stackable: false,
    quantity: 1,
    stats: { defense: 6, healthBonus: 15 },
    sellPrice: 15,
    color: '#78350f'
  },
  shield_aegis: {
    id: 'shield_aegis',
    name: 'Aegis of the Vanguard',
    description: 'Heavy steel kite shield bearing the imperial golden crest.',
    type: 'shield',
    rarity: 'epic',
    iconId: 'shield',
    stackable: false,
    quantity: 1,
    stats: { defense: 25, healthBonus: 80 },
    sellPrice: 200,
    color: '#0284c7'
  },
  torch_adventurer: {
    id: 'torch_adventurer',
    name: 'Ever-burning Torch',
    description: 'Illuminates dark caves and crypts while granting slight warmth.',
    type: 'shield',
    rarity: 'uncommon',
    iconId: 'flame',
    stackable: false,
    quantity: 1,
    stats: { attack: 4, defense: 2 },
    sellPrice: 30,
    color: '#f97316'
  },

  // Helmets / Headgear
  hat_scholar_cap: {
    id: 'hat_scholar_cap',
    name: 'Celestial Scholar Beret',
    description: 'An elegant academic cap adorned with a golden star brooch and deep navy velvet cloth.',
    type: 'helmet',
    rarity: 'rare',
    iconId: 'sparkles',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 18, manaBonus: 50, defense: 8 },
    sellPrice: 140,
    color: '#1e3a8a'
  },
  helm_knight: {
    id: 'helm_knight',
    name: 'Iron Visor Helm',
    description: 'Solid forged iron helmet with a red warrior plume.',
    type: 'helmet',
    rarity: 'uncommon',
    iconId: 'hard-hat',
    stackable: false,
    quantity: 1,
    stats: { defense: 10, healthBonus: 20 },
    sellPrice: 40,
    color: '#94a3b8'
  },
  hat_wizard: {
    id: 'hat_wizard',
    name: 'Mystic Star Hat',
    description: 'Wide-brimmed purple hat woven from spellcloth and adorned with stars.',
    type: 'helmet',
    rarity: 'rare',
    iconId: 'sparkles',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 14, manaBonus: 40 },
    sellPrice: 120,
    color: '#7e22ce'
  },
  hood_ranger: {
    id: 'hood_ranger',
    name: 'Forest Camo Hood',
    description: 'Blends into foliage while sharpening the wearer\'s precision.',
    type: 'helmet',
    rarity: 'uncommon',
    iconId: 'eye',
    stackable: false,
    quantity: 1,
    stats: { defense: 6, critChance: 8, speed: 2 },
    sellPrice: 50,
    color: '#15803d'
  },
  crown_royal: {
    id: 'crown_royal',
    name: 'Crown of Eldoria',
    description: 'Pure gold crown set with radiant rubies. Symbol of ancient rulers.',
    type: 'helmet',
    rarity: 'mythic',
    iconId: 'crown',
    stackable: false,
    quantity: 1,
    stats: { defense: 20, magicPower: 25, attack: 20, healthBonus: 100, manaBonus: 100 },
    sellPrice: 1000,
    color: '#fbbf24'
  },

  // Armors / Robes
  robe_scholar: {
    id: 'robe_scholar',
    name: 'Grand Scholar Longcoat',
    description: 'A tailored high-collar scholar overcoat with gold filigree, white silk cravat, and a flowing azure mantle.',
    type: 'armor',
    rarity: 'rare',
    iconId: 'shirt',
    stackable: false,
    quantity: 1,
    stats: { defense: 14, magicPower: 26, manaBonus: 70, speed: 2 },
    sellPrice: 220,
    color: '#1e40af'
  },
  armor_leather: {
    id: 'armor_leather',
    name: 'Hunter Leather Tunic',
    description: 'Lightweight cured leather armor allowing swift movement.',
    type: 'armor',
    rarity: 'common',
    iconId: 'shirt',
    stackable: false,
    quantity: 1,
    stats: { defense: 8, speed: 1 },
    sellPrice: 25,
    color: '#b45309'
  },
  armor_plate: {
    id: 'armor_plate',
    name: 'Steel Plate Cuirass',
    description: 'Heavy interlocking steel plates that deflect ferocious beast claws.',
    type: 'armor',
    rarity: 'rare',
    iconId: 'shield-alert',
    stackable: false,
    quantity: 1,
    stats: { defense: 22, healthBonus: 60 },
    sellPrice: 140,
    color: '#64748b'
  },
  armor_robe: {
    id: 'armor_robe',
    name: 'Arcane Weaver Robes',
    description: 'Robes woven from starlight threads that amplify magic flow.',
    type: 'armor',
    rarity: 'epic',
    iconId: 'sparkles',
    stackable: false,
    quantity: 1,
    stats: { defense: 12, magicPower: 30, manaBonus: 80 },
    sellPrice: 210,
    color: '#2563eb'
  },
  armor_shadow: {
    id: 'armor_shadow',
    name: 'Shadow Stalker Cloak',
    description: 'Emits a shadowy mist that makes the wearer swift and lethal.',
    type: 'armor',
    rarity: 'epic',
    iconId: 'moon',
    stackable: false,
    quantity: 1,
    stats: { defense: 16, attack: 18, critChance: 18, speed: 4 },
    sellPrice: 260,
    color: '#581c87'
  },

  // Boots
  boots_scholar: {
    id: 'boots_scholar',
    name: 'Noble Scholar Riding Boots',
    description: 'Polished dark calfskin boots with golden buckle clasps and sturdy leather heels.',
    type: 'boots',
    rarity: 'rare',
    iconId: 'footprints',
    stackable: false,
    quantity: 1,
    stats: { defense: 8, speed: 4, manaBonus: 20 },
    sellPrice: 95,
    color: '#1e293b'
  },
  boots_leather: {
    id: 'boots_leather',
    name: 'Leather Boots',
    description: 'Comfortable walking boots suitable for long journeys.',
    type: 'boots',
    rarity: 'common',
    iconId: 'footprints',
    stackable: false,
    quantity: 1,
    stats: { defense: 4, speed: 2 },
    sellPrice: 15,
    color: '#78350f'
  },
  boots_winged: {
    id: 'boots_winged',
    name: 'Hermes Winged Sabatons',
    description: 'Enchanted boots that grant incredible sprint speed and agility.',
    type: 'boots',
    rarity: 'rare',
    iconId: 'wind',
    stackable: false,
    quantity: 1,
    stats: { defense: 10, speed: 6, critChance: 5 },
    sellPrice: 160,
    color: '#38bdf8'
  },

  // Accessories
  monocle_truth: {
    id: 'monocle_truth',
    name: 'Monocle of All-Seeing Truth',
    description: 'A finely crafted gold-rimmed monocle with an ethereal azure lens that deciphers ancient scripts and boosts spell precision.',
    type: 'accessory',
    rarity: 'rare',
    iconId: 'eye',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 20, critChance: 10, manaBonus: 40 },
    sellPrice: 150,
    color: '#38bdf8'
  },
  ring_ruby: {
    id: 'ring_ruby',
    name: 'Ruby Power Ring',
    description: 'Glows with a warm crimson fire, boosting physical strength.',
    type: 'accessory',
    rarity: 'rare',
    iconId: 'gem',
    stackable: false,
    quantity: 1,
    stats: { attack: 12, critChance: 6 },
    sellPrice: 90,
    color: '#ef4444'
  },
  amulet_mana: {
    id: 'amulet_mana',
    name: 'Sapphire Mana Pendant',
    description: 'Constantly replenishes mental focus and magical currents.',
    type: 'accessory',
    rarity: 'rare',
    iconId: 'sparkle',
    stackable: false,
    quantity: 1,
    stats: { magicPower: 15, manaBonus: 50 },
    sellPrice: 110,
    color: '#3b82f6'
  },

  // Consumables
  potion_hp_small: {
    id: 'potion_hp_small',
    name: 'Small Healing Potion',
    description: 'Restores 50 Health Points instantly.',
    type: 'consumable',
    rarity: 'common',
    iconId: 'heart',
    stackable: true,
    maxStack: 99,
    quantity: 1,
    effect: { healHp: 50 },
    sellPrice: 8,
    color: '#ef4444'
  },
  potion_hp_large: {
    id: 'potion_hp_large',
    name: 'Grand Elixir of Life',
    description: 'Restores 200 Health Points instantly.',
    type: 'consumable',
    rarity: 'rare',
    iconId: 'heart',
    stackable: true,
    maxStack: 99,
    quantity: 1,
    effect: { healHp: 200 },
    sellPrice: 35,
    color: '#dc2626'
  },
  potion_mp_small: {
    id: 'potion_mp_small',
    name: 'Mana Potion',
    description: 'Restores 50 Mana Points for casting spells.',
    type: 'consumable',
    rarity: 'common',
    iconId: 'droplet',
    stackable: true,
    maxStack: 99,
    quantity: 1,
    effect: { healMp: 50 },
    sellPrice: 8,
    color: '#3b82f6'
  },
  apple_fresh: {
    id: 'apple_fresh',
    name: 'Crisp Apple',
    description: 'Juicy wild apple harvested from orchard trees. Heals 20 HP.',
    type: 'consumable',
    rarity: 'common',
    iconId: 'apple',
    stackable: true,
    maxStack: 99,
    quantity: 1,
    effect: { healHp: 20 },
    sellPrice: 3,
    color: '#ef4444'
  },

  // Raw Materials
  wood_oak: {
    id: 'wood_oak',
    name: 'Oak Timber',
    description: 'Sturdy wood logs chopped from trees. Used for crafting.',
    type: 'material',
    rarity: 'common',
    iconId: 'tree-pine',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 2,
    color: '#78350f'
  },
  ore_iron: {
    id: 'ore_iron',
    name: 'Iron Ore',
    description: 'Dense metal ore mined from subterranean rock veins.',
    type: 'material',
    rarity: 'common',
    iconId: 'mountain',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 5,
    color: '#94a3b8'
  },
  ore_gold: {
    id: 'ore_gold',
    name: 'Gold Nugget',
    description: 'Precious golden ore used in masterwork gear and jewelry.',
    type: 'material',
    rarity: 'rare',
    iconId: 'coins',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 20,
    color: '#facc15'
  },
  ore_mithril: {
    id: 'ore_mithril',
    name: 'Mithril Shard',
    description: 'Luminous sky-blue metal with immense arcane conductivity.',
    type: 'material',
    rarity: 'epic',
    iconId: 'gem',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 50,
    color: '#38bdf8'
  },
  herb_healing: {
    id: 'herb_healing',
    name: 'Silverleaf Herb',
    description: 'Fragrant medicinal herb with potent recuperative properties.',
    type: 'material',
    rarity: 'common',
    iconId: 'flower',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 4,
    color: '#22c55e'
  },
  herb_mana: {
    id: 'herb_mana',
    name: 'Moonflower Petal',
    description: 'Glows under moonlight; the foundation for mana draughts.',
    type: 'material',
    rarity: 'uncommon',
    iconId: 'sparkle',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 6,
    color: '#818cf8'
  },
  monster_slime_gel: {
    id: 'monster_slime_gel',
    name: 'Green Slime Gel',
    description: 'Sticky translucent jelly dropped by meadow slimes.',
    type: 'material',
    rarity: 'common',
    iconId: 'flask-conical',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 3,
    color: '#4ade80'
  },
  monster_wolf_pelt: {
    id: 'monster_wolf_pelt',
    name: 'Direwolf Pelt',
    description: 'Thick warm fur pelt harvested from forest predators.',
    type: 'material',
    rarity: 'uncommon',
    iconId: 'shield',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 12,
    color: '#64748b'
  },
  monster_bone: {
    id: 'monster_bone',
    name: 'Ancient Skeletal Bone',
    description: 'Cursed calcified bone recovered from crypt warriors.',
    type: 'material',
    rarity: 'common',
    iconId: 'skull',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 8,
    color: '#e2e8f0'
  },
  crystal_arcane: {
    id: 'crystal_arcane',
    name: 'Pure Arcane Crystal',
    description: 'Pulsing core of raw magical power harvested from dungeon shrines.',
    type: 'material',
    rarity: 'epic',
    iconId: 'diamond',
    stackable: true,
    maxStack: 999,
    quantity: 1,
    sellPrice: 75,
    color: '#c084fc'
  }
};

export const CRAFTING_RECIPES: Recipe[] = [
  // Alchemy
  {
    id: 'recipe_potion_hp',
    resultItemId: 'potion_hp_small',
    resultQuantity: 2,
    category: 'alchemy',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'herb_healing', quantity: 2 },
      { itemId: 'monster_slime_gel', quantity: 1 }
    ]
  },
  {
    id: 'recipe_potion_mp',
    resultItemId: 'potion_mp_small',
    resultQuantity: 2,
    category: 'alchemy',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'herb_mana', quantity: 2 },
      { itemId: 'monster_slime_gel', quantity: 1 }
    ]
  },
  {
    id: 'recipe_potion_hp_large',
    resultItemId: 'potion_hp_large',
    resultQuantity: 1,
    category: 'alchemy',
    requiredLevel: 3,
    ingredients: [
      { itemId: 'potion_hp_small', quantity: 3 },
      { itemId: 'crystal_arcane', quantity: 1 }
    ]
  },

  // Blacksmithing
  {
    id: 'recipe_sword_novice',
    resultItemId: 'sword_novice',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'ore_iron', quantity: 5 },
      { itemId: 'wood_oak', quantity: 3 }
    ]
  },
  {
    id: 'recipe_pickaxe_iron',
    resultItemId: 'pickaxe_iron',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'ore_iron', quantity: 6 },
      { itemId: 'wood_oak', quantity: 4 }
    ]
  },
  {
    id: 'recipe_axe_woodcutter',
    resultItemId: 'axe_woodcutter',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'ore_iron', quantity: 4 },
      { itemId: 'wood_oak', quantity: 5 }
    ]
  },
  {
    id: 'recipe_shield_wooden',
    resultItemId: 'shield_wooden',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 1,
    ingredients: [
      { itemId: 'wood_oak', quantity: 8 },
      { itemId: 'ore_iron', quantity: 2 }
    ]
  },
  {
    id: 'recipe_armor_leather',
    resultItemId: 'armor_leather',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 2,
    ingredients: [
      { itemId: 'monster_wolf_pelt', quantity: 4 },
      { itemId: 'ore_iron', quantity: 2 }
    ]
  },
  {
    id: 'recipe_armor_plate',
    resultItemId: 'armor_plate',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 3,
    ingredients: [
      { itemId: 'ore_iron', quantity: 15 },
      { itemId: 'ore_gold', quantity: 3 }
    ]
  },
  {
    id: 'recipe_sword_flame',
    resultItemId: 'sword_flame',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 4,
    ingredients: [
      { itemId: 'ore_iron', quantity: 12 },
      { itemId: 'ore_gold', quantity: 6 },
      { itemId: 'crystal_arcane', quantity: 2 }
    ]
  },
  {
    id: 'recipe_pickaxe_mithril',
    resultItemId: 'pickaxe_mithril',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 5,
    ingredients: [
      { itemId: 'ore_mithril', quantity: 10 },
      { itemId: 'wood_oak', quantity: 8 },
      { itemId: 'crystal_arcane', quantity: 2 }
    ]
  },
  {
    id: 'recipe_boots_winged',
    resultItemId: 'boots_winged',
    resultQuantity: 1,
    category: 'blacksmith',
    requiredLevel: 4,
    ingredients: [
      { itemId: 'boots_leather', quantity: 1 },
      { itemId: 'ore_mithril', quantity: 5 },
      { itemId: 'monster_wolf_pelt', quantity: 4 }
    ]
  }
];
