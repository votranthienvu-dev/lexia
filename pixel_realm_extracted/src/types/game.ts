export type Direction = 'up' | 'down' | 'left' | 'right';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type ItemType = 
  | 'weapon_melee' 
  | 'weapon_ranged' 
  | 'weapon_magic' 
  | 'shield' 
  | 'helmet' 
  | 'armor' 
  | 'boots' 
  | 'accessory' 
  | 'tool_pickaxe' 
  | 'tool_axe' 
  | 'consumable' 
  | 'material' 
  | 'quest';

export interface ItemStats {
  attack?: number;
  magicPower?: number;
  defense?: number;
  speed?: number;
  critChance?: number; // 0-100%
  miningPower?: number;
  woodcuttingPower?: number;
  healthBonus?: number;
  manaBonus?: number;
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  iconId: string;
  stackable: boolean;
  maxStack?: number;
  quantity: number;
  stats?: ItemStats;
  effect?: {
    healHp?: number;
    healMp?: number;
    buffType?: string;
    buffDuration?: number;
  };
  sellPrice: number;
  color?: string;
  visualId?: string; // Links to paperdoll renderer
}

export interface CharacterAppearance {
  gender: 'male' | 'female';
  skinColor: string;
  hairStyle: 'scholar_parted' | 'scholar_ponytail' | 'scholar_messy' | 'wizard_braid' | 'short' | 'spiky' | 'long' | 'curly';
  hairColor: string;
  eyeColor: string;
  eyewear?: 'none' | 'monocle' | 'spectacles' | 'scholar_circlet';
  facialHair?: 'none' | 'stubble' | 'beard';
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  capeStyle?: 'none' | 'scholar_mantle' | 'royal_cape' | 'arcane_wings';
  coatDetail?: 'scholar_cravat' | 'noble_tunic' | 'adventurer_vest' | 'none';
}

export interface EquipmentSlots {
  weapon: GameItem | null;
  offhand: GameItem | null;
  helmet: GameItem | null;
  armor: GameItem | null;
  boots: GameItem | null;
  accessory: GameItem | null;
}

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  statPoints: number;
  skillPoints: number;
  // Base attributes
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface Masteries {
  woodcutting: { level: number; exp: number };
  mining: { level: number; exp: number };
  herbalism: { level: number; exp: number };
  combat: { level: number; exp: number };
}

export type ActionState = 'idle' | 'walk' | 'attack' | 'cast' | 'gather' | 'hurt' | 'dead';

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  lifetime: number;
  maxLifetime: number;
  vy: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  lifetime: number;
  maxLifetime: number;
  shape?: 'square' | 'circle' | 'spark' | 'leaf';
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'arrow' | 'fireball' | 'frostbolt' | 'lightning' | 'enemy_bullet';
  damage: number;
  range: number;
  distanceTraveled: number;
  isPlayer: boolean;
  color: string;
  size: number;
}

export type BiomeType = 'village' | 'forest' | 'mines' | 'crypt' | 'snow_peak';

export interface ResourceNode {
  id: string;
  x: number;
  y: number;
  type: 'tree' | 'iron_ore' | 'gold_ore' | 'mithril_ore' | 'herb_health' | 'herb_mana' | 'chest' | 'magic_crystal' | 'water_spot';
  hp: number;
  maxHp: number;
  requiredTool: 'axe' | 'pickaxe' | 'hand' | 'key';
  respawnTime: number; // in seconds
  lastGatheredTime?: number;
  lootTable: { itemId: string; min: number; max: number; chance: number }[];
  expReward: { type: keyof Masteries; amount: number };
}

export interface Monster {
  id: string;
  typeId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: Direction;
  state: ActionState;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  expYield: number;
  goldYield: number;
  color: string;
  rarity: 'normal' | 'elite' | 'boss';
  attackRange: number;
  aggroRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  loot: { itemId: string; chance: number; min: number; max: number }[];
  isDead: boolean;
  respawnTimer?: number;
  animFrame: number;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  direction: Direction;
  appearance: CharacterAppearance;
  equippedWeapon?: string;
  equippedArmor?: string;
  dialogueTree: {
    id: string;
    text: string;
    options: {
      text: string;
      nextId?: string;
      action?: 'open_shop' | 'open_crafting' | 'give_quest' | 'heal' | 'close';
      questId?: string;
    }[];
  }[];
  shopItems?: { itemId: string; price: number }[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giverName: string;
  category: 'main' | 'side' | 'bounty' | 'gathering';
  objectives: {
    id: string;
    description: string;
    targetType: 'kill' | 'gather' | 'explore' | 'talk';
    targetId: string;
    current: number;
    required: number;
  }[];
  rewards: {
    exp: number;
    gold: number;
    items?: { itemId: string; quantity: number }[];
  };
  status: 'available' | 'in_progress' | 'completed' | 'turned_in';
}

export interface Recipe {
  id: string;
  resultItemId: string;
  resultQuantity: number;
  category: 'blacksmith' | 'alchemy' | 'cooking';
  requiredLevel: number;
  ingredients: { itemId: string; quantity: number }[];
}

export interface MapZone {
  id: BiomeType;
  name: string;
  description: string;
  width: number;
  height: number;
  ambientLight: number; // 0 (pitch black) - 1.0 (bright daylight)
  tiles: number[][]; // tile IDs: 0 = grass, 1 = dirt, 2 = stone path, 3 = water, 4 = dark rock, 5 = wood floor, 6 = wall/cliff
  decorations: { x: number; y: number; type: string }[];
  resourceNodes: ResourceNode[];
  monsters: Monster[];
  npcs: NPC[];
  portals: {
    x: number;
    y: number;
    targetZone: BiomeType;
    targetX: number;
    targetY: number;
    name: string;
  }[];
}
