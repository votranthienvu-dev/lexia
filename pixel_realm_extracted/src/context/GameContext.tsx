import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CharacterAppearance,
  EquipmentSlots,
  GameItem,
  PlayerStats,
  Masteries,
  ActionState,
  Direction,
  BiomeType,
  MapZone,
  Monster,
  ResourceNode,
  NPC,
  Projectile,
  FloatingText,
  Particle,
  Quest,
  Recipe
} from '../types/game';
import { ITEMS_DATABASE, CRAFTING_RECIPES } from '../data/items';
import { WORLD_MAPS } from '../data/maps';
import { INITIAL_QUESTS } from '../data/quests';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'PIXEL_REALM_RPG_SAVE_V1';

interface GameContextType {
  // Player state
  playerX: number;
  playerY: number;
  playerDirection: Direction;
  playerState: ActionState;
  appearance: CharacterAppearance;
  setAppearance: React.Dispatch<React.SetStateAction<CharacterAppearance>>;
  equipment: EquipmentSlots;
  stats: PlayerStats;
  masteries: Masteries;
  inventory: GameItem[];
  hotbar: (GameItem | null)[];
  activeHotbarIndex: number;
  setActiveHotbarIndex: (idx: number) => void;

  // World state
  currentZoneId: BiomeType;
  currentZone: MapZone;
  monsters: Monster[];
  resourceNodes: ResourceNode[];
  npcs: NPC[];
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  particles: Particle[];
  gameTimeHours: number; // 0 - 24

  // Quests & Dialogue
  quests: Quest[];
  activeDialogueNPC: NPC | null;
  activeDialogueId: string;
  selectDialogueOption: (nextId?: string, action?: string, questId?: string) => void;
  closeDialogue: () => void;

  // Actions
  movePlayer: (dx: number, dy: number) => void;
  setPlayerDirection: (dir: Direction) => void;
  performAction: (actionType?: 'attack' | 'gather' | 'spell') => void;
  interactNearest: () => void;
  changeZone: (zoneId: BiomeType, targetX?: number, targetY?: number) => void;

  // Inventory & Equipment
  equipItem: (item: GameItem) => void;
  unequipSlot: (slot: keyof EquipmentSlots) => void;
  useConsumable: (item: GameItem) => void;
  craftItem: (recipe: Recipe) => boolean;
  allocateStatPoint: (stat: 'strength' | 'dexterity' | 'intelligence' | 'vitality') => void;
  
  // UI Panels
  activeModal: 'inventory' | 'character' | 'crafting' | 'quests' | 'skills' | 'map' | 'shop' | null;
  setActiveModal: (modal: 'inventory' | 'character' | 'crafting' | 'quests' | 'skills' | 'map' | 'shop' | null) => void;
  shopItems: { itemId: string; price: number }[] | null;
  buyItem: (itemId: string, price: number) => void;
  sellItem: (item: GameItem) => void;

  // Helpers & Audio
  soundEnabled: boolean;
  toggleSound: () => void;
  saveGame: () => void;
  resetGame: () => void;
  addFloatingText: (x: number, y: number, text: string, color: string) => void;
  spawnParticles: (x: number, y: number, color: string, count: number, shape?: 'square' | 'spark' | 'leaf') => void;
  animTick: number;
}

const defaultAppearance: CharacterAppearance = {
  gender: 'male',
  skinColor: '#fcd34d',
  hairStyle: 'scholar_parted',
  hairColor: '#1e293b',
  eyeColor: '#0284c7',
  eyewear: 'monocle',
  facialHair: 'none',
  shirtColor: '#1e3a8a',
  pantsColor: '#0f172a',
  shoesColor: '#1e293b',
  capeStyle: 'scholar_mantle',
  coatDetail: 'scholar_cravat'
};

const defaultStats: PlayerStats = {
  level: 1,
  exp: 0,
  maxExp: 100,
  hp: 120,
  maxHp: 120,
  mp: 60,
  maxMp: 60,
  stamina: 100,
  maxStamina: 100,
  gold: 80,
  statPoints: 5,
  skillPoints: 2,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  vitality: 10
};

const defaultMasteries: Masteries = {
  woodcutting: { level: 1, exp: 0 },
  mining: { level: 1, exp: 0 },
  herbalism: { level: 1, exp: 0 },
  combat: { level: 1, exp: 0 }
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Player state
  const [playerX, setPlayerX] = useState(576);
  const [playerY, setPlayerY] = useState(480);
  const [playerDirection, setPlayerDirection] = useState<Direction>('down');
  const [playerState, setPlayerState] = useState<ActionState>('idle');
  const [appearance, setAppearance] = useState<CharacterAppearance>(defaultAppearance);

  const [equipment, setEquipment] = useState<EquipmentSlots>({
    weapon: ITEMS_DATABASE.wand_scholar_quill,
    offhand: ITEMS_DATABASE.tome_astronomy,
    helmet: ITEMS_DATABASE.hat_scholar_cap,
    armor: ITEMS_DATABASE.robe_scholar,
    boots: ITEMS_DATABASE.boots_scholar,
    accessory: ITEMS_DATABASE.monocle_truth
  });

  const [stats, setStats] = useState<PlayerStats>(defaultStats);
  const [masteries, setMasteries] = useState<Masteries>(defaultMasteries);

  const [inventory, setInventory] = useState<GameItem[]>([
    { ...ITEMS_DATABASE.sword_novice, quantity: 1 },
    { ...ITEMS_DATABASE.pickaxe_iron, quantity: 1 },
    { ...ITEMS_DATABASE.axe_woodcutter, quantity: 1 },
    { ...ITEMS_DATABASE.torch_adventurer, quantity: 1 },
    { ...ITEMS_DATABASE.armor_leather, quantity: 1 },
    { ...ITEMS_DATABASE.potion_hp_small, quantity: 5 },
    { ...ITEMS_DATABASE.potion_mp_small, quantity: 5 },
    { ...ITEMS_DATABASE.apple_fresh, quantity: 6 }
  ]);

  const [hotbar, setHotbar] = useState<(GameItem | null)[]>([
    ITEMS_DATABASE.wand_scholar_quill,
    ITEMS_DATABASE.tome_astronomy,
    ITEMS_DATABASE.sword_novice,
    ITEMS_DATABASE.pickaxe_iron,
    ITEMS_DATABASE.axe_woodcutter,
    ITEMS_DATABASE.potion_hp_small
  ]);
  const [activeHotbarIndex, setActiveHotbarIndex] = useState(0);

  // Map & Entity state
  const [currentZoneId, setCurrentZoneId] = useState<BiomeType>('village');
  const [currentZone, setCurrentZone] = useState<MapZone>(() => WORLD_MAPS.village());
  const [monsters, setMonsters] = useState<Monster[]>(() => WORLD_MAPS.village().monsters);
  const [resourceNodes, setResourceNodes] = useState<ResourceNode[]>(() => WORLD_MAPS.village().resourceNodes);
  const [npcs, setNpcs] = useState<NPC[]>(() => WORLD_MAPS.village().npcs);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameTimeHours, setGameTimeHours] = useState<number>(12); // Noon
  const [animTick, setAnimTick] = useState(0);

  // Quests & Dialogue
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activeDialogueNPC, setActiveDialogueNPC] = useState<NPC | null>(null);
  const [activeDialogueId, setActiveDialogueId] = useState<string>('start');

  // Modals & UI
  const [activeModal, setActiveModal] = useState<'inventory' | 'character' | 'crafting' | 'quests' | 'skills' | 'map' | 'shop' | null>(null);
  const [shopItems, setShopItems] = useState<{ itemId: string; price: number }[] | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Animation & game loop refs
  const stateTimerRef = useRef<number | null>(null);

  // Floating text creator
  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    setFloatingTexts(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        x: x + (Math.random() * 16 - 8),
        y: y - 10,
        text,
        color,
        lifetime: 0,
        maxLifetime: 45,
        vy: -1.2
      }
    ]);
  }, []);

  // Spawn particle effects
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, shape: 'square' | 'spark' | 'leaf' = 'square') => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      newParticles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3 + 2,
        lifetime: 0,
        maxLifetime: Math.random() * 20 + 20,
        shape
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Sound toggle
  const toggleSound = () => {
    const newVal = sound.toggleSound();
    setSoundEnabled(newVal);
  };

  // Add Item to inventory with stack logic
  const addItemToInventory = useCallback((itemTemplate: GameItem, quantity: number = 1) => {
    setInventory(prev => {
      const existingIdx = prev.findIndex(i => i.id === itemTemplate.id);
      if (existingIdx >= 0 && itemTemplate.stackable) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity
        };
        return next;
      } else {
        return [...prev, { ...itemTemplate, quantity }];
      }
    });

    addFloatingText(playerX, playerY - 30, `+${quantity} ${itemTemplate.name}`, '#facc15');
    sound.playPickup();

    // Check gathering quests
    setQuests(prevQuests =>
      prevQuests.map(q => {
        if (q.status !== 'in_progress') return q;
        let anyUpdated = false;
        const newObjs = q.objectives.map(obj => {
          if (obj.targetType === 'gather' && obj.targetId === itemTemplate.id) {
            const nextCurrent = Math.min(obj.required, obj.current + quantity);
            if (nextCurrent !== obj.current) anyUpdated = true;
            return { ...obj, current: nextCurrent };
          }
          return obj;
        });

        const allCompleted = newObjs.every(o => o.current >= o.required);
        if (allCompleted && q.status === 'in_progress') {
          sound.playQuestComplete();
          addFloatingText(playerX, playerY - 50, `Quest Objective Complete: ${q.title}!`, '#4ade80');
          return { ...q, objectives: newObjs, status: 'completed' };
        }
        return anyUpdated ? { ...q, objectives: newObjs } : q;
      })
    );
  }, [playerX, playerY, addFloatingText]);

  // Give EXP & level up check
  const addExp = useCallback((amount: number) => {
    setStats(prev => {
      let currentExp = prev.exp + amount;
      let currentLvl = prev.level;
      let currentMaxExp = prev.maxExp;
      let statPointsGain = prev.statPoints;
      let skillPointsGain = prev.skillPoints;
      let maxHpGain = prev.maxHp;
      let maxMpGain = prev.maxMp;

      while (currentExp >= currentMaxExp) {
        currentExp -= currentMaxExp;
        currentLvl += 1;
        currentMaxExp = Math.floor(currentMaxExp * 1.5);
        statPointsGain += 5;
        skillPointsGain += 1;
        maxHpGain += 25;
        maxMpGain += 15;

        sound.playLevelUp();
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
        addFloatingText(playerX, playerY - 45, `LEVEL UP! Level ${currentLvl}`, '#facc15');
      }

      return {
        ...prev,
        level: currentLvl,
        exp: currentExp,
        maxExp: currentMaxExp,
        hp: maxHpGain,
        maxHp: maxHpGain,
        mp: maxMpGain,
        maxMp: maxMpGain,
        statPoints: statPointsGain,
        skillPoints: skillPointsGain
      };
    });
  }, [playerX, playerY, addFloatingText]);

  // Move Player
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (playerState === 'attack' || playerState === 'gather' || playerState === 'cast') return;

    let dir: Direction = playerDirection;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else if (Math.abs(dy) > 0) {
      dir = dy > 0 ? 'down' : 'up';
    }
    setPlayerDirection(dir);

    // Calculate move speed with equipment bonus
    const speedBonus = (equipment.boots?.stats?.speed || 0) + (equipment.armor?.stats?.speed || 0);
    const totalSpeed = 3.2 + speedBonus * 0.4;

    const nextX = Math.max(20, Math.min(currentZone.width - 20, playerX + dx * totalSpeed));
    const nextY = Math.max(20, Math.min(currentZone.height - 20, playerY + dy * totalSpeed));

    // Collision check against tiles (e.g. wall/water)
    const tileX = Math.floor(nextX / 32);
    const tileY = Math.floor(nextY / 32);
    const tileType = currentZone.tiles[tileY]?.[tileX];

    // 6 = wall, 3 = deep water
    if (tileType === 6 || tileType === 3) {
      return; // blocked
    }

    setPlayerX(nextX);
    setPlayerY(nextY);
    setPlayerState('walk');

    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    stateTimerRef.current = window.setTimeout(() => {
      setPlayerState('idle');
    }, 150);

    // Check portals
    currentZone.portals.forEach(portal => {
      const dist = Math.hypot(portal.x - nextX, portal.y - nextY);
      if (dist < 32) {
        changeZone(portal.targetZone, portal.targetX, portal.targetY);
      }
    });
  }, [playerState, playerDirection, playerX, playerY, currentZone, equipment]);

  // Zone transition
  const changeZone = (zoneId: BiomeType, targetX?: number, targetY?: number) => {
    if (WORLD_MAPS[zoneId]) {
      const newZone = WORLD_MAPS[zoneId]();
      setCurrentZoneId(zoneId);
      setCurrentZone(newZone);
      setMonsters(newZone.monsters);
      setResourceNodes(newZone.resourceNodes);
      setNpcs(newZone.npcs);
      setProjectiles([]);
      setPlayerX(targetX || newZone.width / 2);
      setPlayerY(targetY || newZone.height / 2);
      addFloatingText(targetX || newZone.width / 2, targetY || newZone.height / 2, `Entered: ${newZone.name}`, '#38bdf8');
    }
  };

  // Perform Attack or Gathering Action
  const performAction = useCallback((actionType?: 'attack' | 'gather' | 'spell') => {
    if (playerState === 'attack' || playerState === 'gather' || playerState === 'cast') return;

    const equippedWeapon = equipment.weapon;
    const isPickaxe = equippedWeapon?.type === 'tool_pickaxe';
    const isAxe = equippedWeapon?.type === 'tool_axe';
    const isRanged = equippedWeapon?.type === 'weapon_ranged';
    const isMagic = equippedWeapon?.type === 'weapon_magic';

    // 1. Gather check (Resource Nodes within range)
    let gatheredNode: ResourceNode | null = null;
    let minNodeDist = 50;

    resourceNodes.forEach(node => {
      const dist = Math.hypot(node.x - playerX, node.y - playerY);
      if (dist < minNodeDist && node.hp > 0) {
        gatheredNode = node;
        minNodeDist = dist;
      }
    });

    if (gatheredNode && (actionType === 'gather' || !actionType)) {
      setPlayerState('gather');
      if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = window.setTimeout(() => setPlayerState('idle'), 250);

      const target = gatheredNode as ResourceNode;
      if (target.type === 'tree') {
        sound.playChop();
        spawnParticles(target.x, target.y, '#15803d', 5, 'leaf');
      } else if (target.type.includes('ore') || target.type === 'magic_crystal') {
        sound.playMining();
        spawnParticles(target.x, target.y, target.type.includes('gold') ? '#facc15' : '#38bdf8', 6, 'spark');
      } else if (target.type === 'chest') {
        sound.playChestOpen();
        spawnParticles(target.x, target.y, '#fbbf24', 12, 'spark');
      } else {
        sound.playPickup();
        spawnParticles(target.x, target.y, '#22c55e', 4, 'leaf');
      }

      // Damage node
      const power = isPickaxe ? (equippedWeapon?.stats?.miningPower || 10) : (isAxe ? (equippedWeapon?.stats?.woodcuttingPower || 10) : 10);
      const remainingHp = Math.max(0, target.hp - power);

      setResourceNodes(prev =>
        prev.map(n => {
          if (n.id === target.id) {
            return { ...n, hp: remainingHp };
          }
          return n;
        })
      );

      if (remainingHp <= 0) {
        // Drop loot
        target.lootTable.forEach(loot => {
          if (Math.random() <= loot.chance) {
            const count = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
            const item = ITEMS_DATABASE[loot.itemId];
            if (item) {
              addItemToInventory(item, count);
            }
          }
        });
        // Exp
        if (target.expReward) {
          addExp(target.expReward.amount);
        }
      }
      return;
    }

    // 2. Cast Spell if magic staff or spell action
    if (isMagic || actionType === 'spell') {
      if (stats.mp < 15) {
        addFloatingText(playerX, playerY - 30, 'Not enough Mana!', '#38bdf8');
        return;
      }
      setStats(prev => ({ ...prev, mp: prev.mp - 15 }));
      setPlayerState('cast');
      sound.playSpell('fire');
      spawnParticles(playerX, playerY, '#38bdf8', 8, 'spark');

      if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = window.setTimeout(() => setPlayerState('idle'), 300);

      // Spawn Fireball/Magic Projectile in facing direction
      const angle = playerDirection === 'right' ? 0 : (playerDirection === 'down' ? Math.PI * 0.5 : (playerDirection === 'left' ? Math.PI : -Math.PI * 0.5));
      const speed = 7;
      setProjectiles(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          x: playerX,
          y: playerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'fireball',
          damage: (stats.intelligence * 2) + (equippedWeapon?.stats?.magicPower || 20),
          range: 300,
          distanceTraveled: 0,
          isPlayer: true,
          color: '#ef4444',
          size: 6
        }
      ]);
      return;
    }

    // 3. Shoot Arrow if Bow
    if (isRanged) {
      setPlayerState('attack');
      sound.playShoot();
      if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = window.setTimeout(() => setPlayerState('idle'), 250);

      const angle = playerDirection === 'right' ? 0 : (playerDirection === 'down' ? Math.PI * 0.5 : (playerDirection === 'left' ? Math.PI : -Math.PI * 0.5));
      const speed = 8;
      setProjectiles(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          x: playerX,
          y: playerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'arrow',
          damage: (stats.dexterity * 1.5) + (equippedWeapon?.stats?.attack || 15),
          range: 350,
          distanceTraveled: 0,
          isPlayer: true,
          color: '#facc15',
          size: 4
        }
      ]);
      return;
    }

    // 4. Melee Slash Attack
    setPlayerState('attack');
    sound.playSlash();
    spawnParticles(playerX, playerY, '#ffffff', 4, 'spark');

    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    stateTimerRef.current = window.setTimeout(() => setPlayerState('idle'), 200);

    // Hit enemies in front
    const attackRange = 48;
    const baseDamage = stats.strength + (equippedWeapon?.stats?.attack || 10);

    setMonsters(prevMonsters =>
      prevMonsters.map(m => {
        if (m.isDead) return m;
        const dist = Math.hypot(m.x - playerX, m.y - playerY);
        if (dist <= attackRange) {
          const isCrit = Math.random() * 100 < (equippedWeapon?.stats?.critChance || 5) + stats.dexterity * 0.5;
          const damage = Math.floor((baseDamage - m.defense * 0.5) * (isCrit ? 1.75 : 1));
          const finalDamage = Math.max(1, damage);

          sound.playHit();
          if (isCrit) sound.playCrit();

          addFloatingText(m.x, m.y - 15, `${finalDamage}${isCrit ? ' CRIT!' : ''}`, isCrit ? '#facc15' : '#ef4444');
          spawnParticles(m.x, m.y, m.color || '#ef4444', 8, 'spark');

          const newHp = m.hp - finalDamage;
          if (newHp <= 0) {
            // Monster defeated!
            addExp(m.expYield);
            setStats(s => ({ ...s, gold: s.gold + m.goldYield }));
            addFloatingText(m.x, m.y - 30, `+${m.goldYield} Gold`, '#fbbf24');

            // Loot drop
            m.loot.forEach(l => {
              if (Math.random() <= l.chance) {
                const count = Math.floor(Math.random() * (l.max - l.min + 1)) + l.min;
                const item = ITEMS_DATABASE[l.itemId];
                if (item) addItemToInventory(item, count);
              }
            });

            // Update kill quests
            setQuests(prevQ =>
              prevQ.map(q => {
                if (q.status !== 'in_progress') return q;
                let changed = false;
                const nextObjs = q.objectives.map(obj => {
                  if (obj.targetType === 'kill' && (obj.targetId === m.typeId || obj.targetId === m.id)) {
                    changed = true;
                    return { ...obj, current: Math.min(obj.required, obj.current + 1) };
                  }
                  return obj;
                });
                const allDone = nextObjs.every(o => o.current >= o.required);
                if (allDone) {
                  sound.playQuestComplete();
                  addFloatingText(playerX, playerY - 50, `Quest Complete: ${q.title}!`, '#4ade80');
                  return { ...q, objectives: nextObjs, status: 'completed' };
                }
                return changed ? { ...q, objectives: nextObjs } : q;
              })
            );

            return { ...m, hp: 0, isDead: true };
          }
          return { ...m, hp: newHp };
        }
        return m;
      })
    );
  }, [playerState, equipment, resourceNodes, playerX, playerY, stats, playerDirection, addFloatingText, spawnParticles, addItemToInventory, addExp]);

  // Interact Nearest (NPC or Object)
  const interactNearest = useCallback(() => {
    // 1. Check NPC
    let nearestNPC: NPC | null = null;
    let minDist = 60;
    npcs.forEach(npc => {
      const dist = Math.hypot(npc.x - playerX, npc.y - playerY);
      if (dist < minDist) {
        nearestNPC = npc;
        minDist = dist;
      }
    });

    if (nearestNPC) {
      setActiveDialogueNPC(nearestNPC);
      setActiveDialogueId('start');
      return;
    }

    // 2. Check Resource Node
    performAction('gather');
  }, [npcs, playerX, playerY, performAction]);

  // Select dialogue option
  const selectDialogueOption = (nextId?: string, action?: string, questId?: string) => {
    if (action === 'close') {
      setActiveDialogueNPC(null);
      return;
    }
    if (action === 'heal') {
      setStats(prev => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }));
      sound.playSpell('heal');
      addFloatingText(playerX, playerY - 30, 'Fully Healed & Restored!', '#22c55e');
      spawnParticles(playerX, playerY, '#22c55e', 12, 'spark');
    } else if (action === 'open_crafting') {
      setActiveModal('crafting');
      setActiveDialogueNPC(null);
      return;
    } else if (action === 'open_shop') {
      if (activeDialogueNPC?.shopItems) {
        setShopItems(activeDialogueNPC.shopItems);
        setActiveModal('shop');
      }
      setActiveDialogueNPC(null);
      return;
    } else if (action === 'give_quest' && questId) {
      setQuests(prev =>
        prev.map(q => (q.id === questId ? { ...q, status: 'in_progress' } : q))
      );
      sound.playQuestComplete();
      addFloatingText(playerX, playerY - 40, 'New Quest Accepted!', '#38bdf8');
    }

    if (nextId) {
      setActiveDialogueId(nextId);
    } else {
      setActiveDialogueNPC(null);
    }
  };

  const closeDialogue = () => {
    setActiveDialogueNPC(null);
  };

  // Equip Item
  const equipItem = (item: GameItem) => {
    sound.playEquip();
    let slot: keyof EquipmentSlots | null = null;
    if (item.type.startsWith('weapon') || item.type.startsWith('tool')) slot = 'weapon';
    else if (item.type === 'shield') slot = 'offhand';
    else if (item.type === 'helmet') slot = 'helmet';
    else if (item.type === 'armor') slot = 'armor';
    else if (item.type === 'boots') slot = 'boots';
    else if (item.type === 'accessory') slot = 'accessory';

    if (!slot) return;

    const previousItem = equipment[slot];
    setEquipment(prev => ({ ...prev, [slot!]: item }));

    // Update inventory
    setInventory(prev => {
      const filtered = prev.filter(i => i.id !== item.id || i.quantity > 1);
      // decrease quantity or remove
      const updated = prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)).filter(i => i.quantity > 0);
      if (previousItem) {
        updated.push(previousItem);
      }
      return updated;
    });

    addFloatingText(playerX, playerY - 30, `Equipped ${item.name}`, '#38bdf8');
  };

  // Unequip Slot
  const unequipSlot = (slot: keyof EquipmentSlots) => {
    const item = equipment[slot];
    if (!item) return;

    sound.playEquip();
    setEquipment(prev => ({ ...prev, [slot]: null }));
    addItemToInventory(item, 1);
  };

  // Use Consumable
  const useConsumable = (item: GameItem) => {
    if (item.type !== 'consumable') return;

    if (item.effect?.healHp) {
      setStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + item.effect!.healHp!) }));
      sound.playSpell('heal');
      addFloatingText(playerX, playerY - 25, `+${item.effect.healHp} HP`, '#22c55e');
      spawnParticles(playerX, playerY, '#22c55e', 8, 'spark');
    }
    if (item.effect?.healMp) {
      setStats(prev => ({ ...prev, mp: Math.min(prev.maxMp, prev.mp + item.effect!.healMp!) }));
      sound.playSpell('heal');
      addFloatingText(playerX, playerY - 25, `+${item.effect.healMp} MP`, '#38bdf8');
      spawnParticles(playerX, playerY, '#38bdf8', 8, 'spark');
    }

    // Decrement from inventory
    setInventory(prev =>
      prev
        .map(i => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  };

  // Crafting
  const craftItem = (recipe: Recipe): boolean => {
    // Check if player has ingredients
    for (const req of recipe.ingredients) {
      const invItem = inventory.find(i => i.id === req.itemId);
      if (!invItem || invItem.quantity < req.quantity) {
        addFloatingText(playerX, playerY - 30, 'Missing materials!', '#ef4444');
        return false;
      }
    }

    // Deduct ingredients
    setInventory(prev => {
      let current = [...prev];
      for (const req of recipe.ingredients) {
        current = current
          .map(i => (i.id === req.itemId ? { ...i, quantity: i.quantity - req.quantity } : i))
          .filter(i => i.quantity > 0);
      }
      return current;
    });

    const resultTemplate = ITEMS_DATABASE[recipe.resultItemId];
    if (resultTemplate) {
      addItemToInventory(resultTemplate, recipe.resultQuantity);
      sound.playMining();
      addFloatingText(playerX, playerY - 40, `Crafted: ${resultTemplate.name}`, '#4ade80');
      spawnParticles(playerX, playerY, '#fbbf24', 12, 'spark');
      return true;
    }
    return false;
  };

  // Allocate Stat Point
  const allocateStatPoint = (stat: 'strength' | 'dexterity' | 'intelligence' | 'vitality') => {
    if (stats.statPoints <= 0) return;
    sound.playEquip();
    setStats(prev => {
      const nextHp = stat === 'vitality' ? prev.maxHp + 15 : prev.maxHp;
      const nextMp = stat === 'intelligence' ? prev.maxMp + 10 : prev.maxMp;
      return {
        ...prev,
        statPoints: prev.statPoints - 1,
        [stat]: prev[stat] + 1,
        maxHp: nextHp,
        hp: Math.min(nextHp, prev.hp + (stat === 'vitality' ? 15 : 0)),
        maxMp: nextMp,
        mp: Math.min(nextMp, prev.mp + (stat === 'intelligence' ? 10 : 0))
      };
    });
  };

  // Shop Buy & Sell
  const buyItem = (itemId: string, price: number) => {
    if (stats.gold < price) {
      addFloatingText(playerX, playerY - 30, 'Not enough Gold!', '#ef4444');
      return;
    }
    const item = ITEMS_DATABASE[itemId];
    if (!item) return;

    setStats(prev => ({ ...prev, gold: prev.gold - price }));
    addItemToInventory(item, 1);
    sound.playPickup();
  };

  const sellItem = (item: GameItem) => {
    const sellVal = Math.max(1, item.sellPrice);
    setStats(prev => ({ ...prev, gold: prev.gold + sellVal }));
    setInventory(prev =>
      prev
        .map(i => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
    sound.playPickup();
    addFloatingText(playerX, playerY - 30, `+${sellVal} Gold`, '#fbbf24');
  };

  // Save Game
  const saveGame = () => {
    const saveData = {
      playerX,
      playerY,
      playerDirection,
      appearance,
      equipment,
      stats,
      masteries,
      inventory,
      currentZoneId,
      quests
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      addFloatingText(playerX, playerY - 40, 'Game Progress Saved!', '#4ade80');
      sound.playPickup();
    } catch (e) {
      console.error(e);
    }
  };

  // Load Game
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.appearance) setAppearance(data.appearance);
        if (data.equipment) setEquipment(data.equipment);
        if (data.stats) setStats(data.stats);
        if (data.masteries) setMasteries(data.masteries);
        if (data.inventory) setInventory(data.inventory);
        if (data.quests) setQuests(data.quests);
        if (data.currentZoneId && WORLD_MAPS[data.currentZoneId as BiomeType]) {
          setCurrentZoneId(data.currentZoneId);
          setCurrentZone(WORLD_MAPS[data.currentZoneId as BiomeType]());
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Reset Game
  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  // Main Game Loop Tick (60 FPS)
  useEffect(() => {
    let animId: number;

    const loop = () => {
      setAnimTick(t => (t + 1) % 10000);

      // Advance game world time clock
      setGameTimeHours(prev => (prev + 0.003) % 24);

      // 1. Update Projectiles
      setProjectiles(prevProjectiles => {
        const next: Projectile[] = [];
        for (const p of prevProjectiles) {
          const nx = p.x + p.vx;
          const ny = p.y + p.vy;
          const dist = p.distanceTraveled + Math.hypot(p.vx, p.vy);

          let collided = false;
          if (p.isPlayer) {
            // Check monster collision
            setMonsters(currentMonsters =>
              currentMonsters.map(m => {
                if (m.isDead) return m;
                const d = Math.hypot(m.x - nx, m.y - ny);
                if (d < 24) {
                  collided = true;
                  const newHp = Math.max(0, m.hp - p.damage);
                  sound.playHit();
                  addFloatingText(m.x, m.y - 20, `${p.damage}`, '#ef4444');
                  spawnParticles(m.x, m.y, p.color, 6, 'spark');

                  if (newHp === 0) {
                    addExp(m.expYield);
                    setStats(s => ({ ...s, gold: s.gold + m.goldYield }));
                    m.loot.forEach(l => {
                      if (Math.random() <= l.chance) {
                        const itm = ITEMS_DATABASE[l.itemId];
                        if (itm) addItemToInventory(itm, 1);
                      }
                    });
                    return { ...m, hp: 0, isDead: true };
                  }
                  return { ...m, hp: newHp };
                }
                return m;
              })
            );
          }

          if (!collided && dist < p.range) {
            next.push({ ...p, x: nx, y: ny, distanceTraveled: dist });
          }
        }
        return next;
      });

      // 2. Update Monster AI (Aggro & Movement towards player)
      setMonsters(prevMonsters =>
        prevMonsters.map(m => {
          if (m.isDead) return m;
          const dist = Math.hypot(playerX - m.x, playerY - m.y);
          const now = Date.now();

          // Monster AI Aggro
          if (dist < m.aggroRange && dist > m.attackRange) {
            const angle = Math.atan2(playerY - m.y, playerX - m.x);
            const mx = m.x + Math.cos(angle) * m.speed;
            const my = m.y + Math.sin(angle) * m.speed;
            const mDir: Direction = Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))
              ? (Math.cos(angle) > 0 ? 'right' : 'left')
              : (Math.sin(angle) > 0 ? 'down' : 'up');

            return { ...m, x: mx, y: my, direction: mDir, state: 'walk' };
          } else if (dist <= m.attackRange) {
            // Monster attacks player
            if (now - m.lastAttackTime >= m.attackCooldown) {
              const def = (equipment.armor?.stats?.defense || 0) + (equipment.offhand?.stats?.defense || 0) + (equipment.helmet?.stats?.defense || 0);
              const playerDmg = Math.max(2, Math.floor(m.attack - def * 0.4));

              setStats(s => {
                const nextHp = Math.max(0, s.hp - playerDmg);
                if (nextHp === 0) {
                  addFloatingText(playerX, playerY - 30, 'DEFEATED! Respawning in village...', '#ef4444');
                  // Respawn in village
                  setTimeout(() => {
                    changeZone('village', 576, 480);
                    setStats(st => ({ ...st, hp: st.maxHp }));
                  }, 1000);
                }
                return { ...s, hp: nextHp };
              });

              sound.playHit();
              addFloatingText(playerX, playerY - 20, `-${playerDmg}`, '#ef4444');
              spawnParticles(playerX, playerY, '#ef4444', 5, 'spark');

              return { ...m, lastAttackTime: now, state: 'attack' };
            }
          }
          return { ...m, state: 'idle' };
        })
      );

      // 3. Update Floating Texts
      setFloatingTexts(prev =>
        prev
          .map(t => ({ ...t, y: t.y + t.vy, lifetime: t.lifetime + 1 }))
          .filter(t => t.lifetime < t.maxLifetime)
      );

      // 4. Update Particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            lifetime: p.lifetime + 1
          }))
          .filter(p => p.lifetime < p.maxLifetime)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [playerX, playerY, equipment, addFloatingText, spawnParticles, addItemToInventory, addExp]);

  return (
    <GameContext.Provider
      value={{
        playerX,
        playerY,
        playerDirection,
        playerState,
        appearance,
        setAppearance,
        equipment,
        stats,
        masteries,
        inventory,
        hotbar,
        activeHotbarIndex,
        setActiveHotbarIndex,
        currentZoneId,
        currentZone,
        monsters,
        resourceNodes,
        npcs,
        projectiles,
        floatingTexts,
        particles,
        gameTimeHours,
        quests,
        activeDialogueNPC,
        activeDialogueId,
        selectDialogueOption,
        closeDialogue,
        movePlayer,
        setPlayerDirection,
        performAction,
        interactNearest,
        changeZone,
        equipItem,
        unequipSlot,
        useConsumable,
        craftItem,
        allocateStatPoint,
        activeModal,
        setActiveModal,
        shopItems,
        buyItem,
        sellItem,
        soundEnabled,
        toggleSound,
        saveGame,
        resetGame,
        addFloatingText,
        spawnParticles,
        animTick
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
