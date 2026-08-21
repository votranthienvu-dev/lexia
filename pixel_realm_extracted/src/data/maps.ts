import { MapZone, BiomeType, ResourceNode, Monster } from '../types/game';
import { MONSTER_TEMPLATES } from './monsters';
import { WORLD_NPCS } from './quests';

// Generate procedural tile layout helper
function createGrid(width: number, height: number, defaultTile: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(defaultTile);
    }
    grid.push(row);
  }
  return grid;
}

// 1. VILLAGE ZONE
function getVillageMap(): MapZone {
  const width = 36;
  const height = 28;
  const tiles = createGrid(width, height, 0); // 0 = grass

  // Stone path from south to center plaza and north/east exits
  for (let y = 4; y < height - 2; y++) {
    tiles[y][18] = 2; // Stone path
    tiles[y][19] = 2;
  }
  for (let x = 6; x < width - 6; x++) {
    tiles[14][x] = 2;
    tiles[15][x] = 2;
  }
  // Plaza cobblestone center
  for (let y = 12; y <= 17; y++) {
    for (let x = 15; x <= 22; x++) {
      tiles[y][x] = 2;
    }
  }

  // Water pond in south-west
  for (let y = 19; y <= 24; y++) {
    for (let x = 4; x <= 10; x++) {
      tiles[y][x] = 3;
    }
  }

  // Houses / Walls
  // Elder's hall (top center)
  for (let y = 5; y <= 9; y++) {
    for (let x = 15; x <= 22; x++) {
      tiles[y][x] = (y === 5 || x === 15 || x === 22) ? 6 : 5; // wall or wood floor
    }
  }
  tiles[9][18] = 5; // door
  tiles[9][19] = 5;

  // Blacksmith forge (east)
  for (let y = 11; y <= 16; y++) {
    for (let x = 25; x <= 31; x++) {
      tiles[y][x] = (y === 11 || x === 25 || x === 31) ? 6 : 5;
    }
  }
  tiles[14][25] = 2; // door path

  // Resource nodes (Trees, herbs, simple ores)
  const resourceNodes: ResourceNode[] = [
    {
      id: 'node_tree_1',
      x: 180,
      y: 180,
      type: 'tree',
      hp: 30,
      maxHp: 30,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [
        { itemId: 'wood_oak', min: 2, max: 4, chance: 1.0 },
        { itemId: 'apple_fresh', min: 1, max: 2, chance: 0.5 }
      ],
      expReward: { type: 'woodcutting', amount: 20 }
    },
    {
      id: 'node_tree_2',
      x: 240,
      y: 160,
      type: 'tree',
      hp: 30,
      maxHp: 30,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [
        { itemId: 'wood_oak', min: 2, max: 4, chance: 1.0 }
      ],
      expReward: { type: 'woodcutting', amount: 20 }
    },
    {
      id: 'node_tree_3',
      x: 140,
      y: 480,
      type: 'tree',
      hp: 30,
      maxHp: 30,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [
        { itemId: 'wood_oak', min: 2, max: 4, chance: 1.0 },
        { itemId: 'apple_fresh', min: 1, max: 2, chance: 0.6 }
      ],
      expReward: { type: 'woodcutting', amount: 20 }
    },
    {
      id: 'node_tree_4',
      x: 880,
      y: 450,
      type: 'tree',
      hp: 30,
      maxHp: 30,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [
        { itemId: 'wood_oak', min: 2, max: 4, chance: 1.0 }
      ],
      expReward: { type: 'woodcutting', amount: 20 }
    },
    {
      id: 'node_herb_1',
      x: 320,
      y: 460,
      type: 'herb_health',
      hp: 15,
      maxHp: 15,
      requiredTool: 'hand',
      respawnTime: 15,
      lootTable: [
        { itemId: 'herb_healing', min: 1, max: 3, chance: 1.0 }
      ],
      expReward: { type: 'herbalism', amount: 15 }
    },
    {
      id: 'node_herb_2',
      x: 440,
      y: 500,
      type: 'herb_health',
      hp: 15,
      maxHp: 15,
      requiredTool: 'hand',
      respawnTime: 15,
      lootTable: [
        { itemId: 'herb_healing', min: 1, max: 3, chance: 1.0 }
      ],
      expReward: { type: 'herbalism', amount: 15 }
    },
    {
      id: 'node_herb_3',
      x: 750,
      y: 200,
      type: 'herb_mana',
      hp: 15,
      maxHp: 15,
      requiredTool: 'hand',
      respawnTime: 15,
      lootTable: [
        { itemId: 'herb_mana', min: 1, max: 2, chance: 1.0 }
      ],
      expReward: { type: 'herbalism', amount: 20 }
    },
    {
      id: 'node_chest_village',
      x: 820,
      y: 120,
      type: 'chest',
      hp: 20,
      maxHp: 20,
      requiredTool: 'hand',
      respawnTime: 60,
      lootTable: [
        { itemId: 'potion_hp_small', min: 2, max: 4, chance: 1.0 },
        { itemId: 'ore_iron', min: 3, max: 6, chance: 1.0 },
        { itemId: 'boots_leather', min: 1, max: 1, chance: 0.8 }
      ],
      expReward: { type: 'combat', amount: 30 }
    }
  ];

  // Slimes roaming the outskirts of the village
  const monsters: Monster[] = [
    {
      ...MONSTER_TEMPLATES.slime_green,
      id: 'm_slime_1',
      x: 260,
      y: 620,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.slime_green,
      id: 'm_slime_2',
      x: 840,
      y: 600,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    }
  ];

  return {
    id: 'village',
    name: 'Village of Eldoria',
    description: 'A peaceful frontier settlement with lush green meadows, friendly traders, and ancient orchards.',
    width: width * 32,
    height: height * 32,
    ambientLight: 1.0,
    tiles,
    decorations: [
      { x: 580, y: 440, type: 'anvil' },
      { x: 380, y: 220, type: 'fountain' },
      { x: 190, y: 390, type: 'flag' }
    ],
    resourceNodes,
    monsters,
    npcs: WORLD_NPCS.village || [],
    portals: [
      {
        x: 18 * 32 + 16,
        y: 40,
        targetZone: 'forest',
        targetX: 18 * 32,
        targetY: 26 * 32,
        name: 'Whispering Forest (North)'
      },
      {
        x: (width - 2) * 32,
        y: 15 * 32,
        targetZone: 'mines',
        targetX: 60,
        targetY: 15 * 32,
        name: 'Obsidian Caverns (East)'
      }
    ]
  };
}

// 2. FOREST ZONE
function getForestMap(): MapZone {
  const width = 36;
  const height = 28;
  const tiles = createGrid(width, height, 0);

  // Dirt paths through dense forest
  for (let y = 0; y < height; y++) {
    tiles[y][18] = 1; // dirt path
    tiles[y][19] = 1;
  }
  for (let x = 4; x < width - 4; x++) {
    tiles[12][x] = 1;
  }

  // Dense trees and herbs
  const resourceNodes: ResourceNode[] = [
    {
      id: 'f_tree_1',
      x: 140,
      y: 160,
      type: 'tree',
      hp: 40,
      maxHp: 40,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [{ itemId: 'wood_oak', min: 3, max: 6, chance: 1.0 }],
      expReward: { type: 'woodcutting', amount: 30 }
    },
    {
      id: 'f_tree_2',
      x: 320,
      y: 220,
      type: 'tree',
      hp: 40,
      maxHp: 40,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [{ itemId: 'wood_oak', min: 3, max: 6, chance: 1.0 }],
      expReward: { type: 'woodcutting', amount: 30 }
    },
    {
      id: 'f_tree_3',
      x: 820,
      y: 250,
      type: 'tree',
      hp: 40,
      maxHp: 40,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [{ itemId: 'wood_oak', min: 3, max: 6, chance: 1.0 }],
      expReward: { type: 'woodcutting', amount: 30 }
    },
    {
      id: 'f_tree_4',
      x: 950,
      y: 500,
      type: 'tree',
      hp: 40,
      maxHp: 40,
      requiredTool: 'axe',
      respawnTime: 20,
      lootTable: [{ itemId: 'wood_oak', min: 3, max: 6, chance: 1.0 }],
      expReward: { type: 'woodcutting', amount: 30 }
    },
    {
      id: 'f_herb_1',
      x: 200,
      y: 540,
      type: 'herb_mana',
      hp: 15,
      maxHp: 15,
      requiredTool: 'hand',
      respawnTime: 15,
      lootTable: [{ itemId: 'herb_mana', min: 2, max: 4, chance: 1.0 }],
      expReward: { type: 'herbalism', amount: 25 }
    },
    {
      id: 'f_herb_2',
      x: 720,
      y: 520,
      type: 'herb_health',
      hp: 15,
      maxHp: 15,
      requiredTool: 'hand',
      respawnTime: 15,
      lootTable: [{ itemId: 'herb_healing', min: 2, max: 4, chance: 1.0 }],
      expReward: { type: 'herbalism', amount: 25 }
    },
    {
      id: 'f_crystal_1',
      x: 480,
      y: 180,
      type: 'magic_crystal',
      hp: 45,
      maxHp: 45,
      requiredTool: 'pickaxe',
      respawnTime: 40,
      lootTable: [{ itemId: 'crystal_arcane', min: 1, max: 2, chance: 0.9 }],
      expReward: { type: 'mining', amount: 50 }
    }
  ];

  // Wolves and Goblins
  const monsters: Monster[] = [
    {
      ...MONSTER_TEMPLATES.wolf_dire,
      id: 'f_wolf_1',
      x: 220,
      y: 280,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.wolf_dire,
      id: 'f_wolf_2',
      x: 780,
      y: 320,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.goblin_scout,
      id: 'f_goblin_1',
      x: 380,
      y: 500,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.goblin_scout,
      id: 'f_goblin_2',
      x: 880,
      y: 620,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    }
  ];

  return {
    id: 'forest',
    name: 'Whispering Forest',
    description: 'Dense ancient woods where direwolves prowl and arcane flowers bloom in enchanted clearings.',
    width: width * 32,
    height: height * 32,
    ambientLight: 0.85,
    tiles,
    decorations: [],
    resourceNodes,
    monsters,
    npcs: [],
    portals: [
      {
        x: 18 * 32 + 16,
        y: (height - 2) * 32,
        targetZone: 'village',
        targetX: 18 * 32 + 16,
        targetY: 70,
        name: 'Village of Eldoria (South)'
      },
      {
        x: 18 * 32 + 16,
        y: 40,
        targetZone: 'crypt',
        targetX: 18 * 32 + 16,
        targetY: 26 * 32,
        name: 'Ancient Sunken Crypt (North Entrance)'
      }
    ]
  };
}

// 3. MINES / OBSIDIAN CAVERNS
function getMinesMap(): MapZone {
  const width = 36;
  const height = 28;
  const tiles = createGrid(width, height, 4); // 4 = dark rock

  // Stone path cavern tunnels
  for (let y = 6; y <= 22; y++) {
    for (let x = 4; x <= 32; x++) {
      if (Math.abs(y - 14) <= 4 || Math.abs(x - 18) <= 4) {
        tiles[y][x] = 2; // mined stone floor
      }
    }
  }

  const resourceNodes: ResourceNode[] = [
    {
      id: 'm_iron_1',
      x: 220,
      y: 220,
      type: 'iron_ore',
      hp: 40,
      maxHp: 40,
      requiredTool: 'pickaxe',
      respawnTime: 25,
      lootTable: [{ itemId: 'ore_iron', min: 2, max: 5, chance: 1.0 }],
      expReward: { type: 'mining', amount: 35 }
    },
    {
      id: 'm_iron_2',
      x: 340,
      y: 480,
      type: 'iron_ore',
      hp: 40,
      maxHp: 40,
      requiredTool: 'pickaxe',
      respawnTime: 25,
      lootTable: [{ itemId: 'ore_iron', min: 2, max: 5, chance: 1.0 }],
      expReward: { type: 'mining', amount: 35 }
    },
    {
      id: 'm_gold_1',
      x: 780,
      y: 240,
      type: 'gold_ore',
      hp: 55,
      maxHp: 55,
      requiredTool: 'pickaxe',
      respawnTime: 35,
      lootTable: [
        { itemId: 'ore_gold', min: 1, max: 3, chance: 1.0 },
        { itemId: 'ore_iron', min: 1, max: 2, chance: 0.5 }
      ],
      expReward: { type: 'mining', amount: 60 }
    },
    {
      id: 'm_gold_2',
      x: 820,
      y: 520,
      type: 'gold_ore',
      hp: 55,
      maxHp: 55,
      requiredTool: 'pickaxe',
      respawnTime: 35,
      lootTable: [{ itemId: 'ore_gold', min: 1, max: 3, chance: 1.0 }],
      expReward: { type: 'mining', amount: 60 }
    },
    {
      id: 'm_mithril_1',
      x: 580,
      y: 380,
      type: 'mithril_ore',
      hp: 80,
      maxHp: 80,
      requiredTool: 'pickaxe',
      respawnTime: 50,
      lootTable: [
        { itemId: 'ore_mithril', min: 2, max: 4, chance: 1.0 },
        { itemId: 'crystal_arcane', min: 1, max: 1, chance: 0.3 }
      ],
      expReward: { type: 'mining', amount: 100 }
    },
    {
      id: 'm_chest_1',
      x: 950,
      y: 380,
      type: 'chest',
      hp: 20,
      maxHp: 20,
      requiredTool: 'hand',
      respawnTime: 90,
      lootTable: [
        { itemId: 'ore_mithril', min: 3, max: 6, chance: 1.0 },
        { itemId: 'potion_hp_large', min: 2, max: 3, chance: 1.0 },
        { itemId: 'ring_ruby', min: 1, max: 1, chance: 0.7 }
      ],
      expReward: { type: 'combat', amount: 80 }
    }
  ];

  const monsters: Monster[] = [
    {
      ...MONSTER_TEMPLATES.skeleton_warrior,
      id: 'm_skel_1',
      x: 300,
      y: 320,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.skeleton_warrior,
      id: 'm_skel_2',
      x: 720,
      y: 440,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.golem_obsidian,
      id: 'm_golem_1',
      x: 580,
      y: 500,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    }
  ];

  return {
    id: 'mines',
    name: 'Obsidian Caverns',
    description: 'Deep subterranean shafts rich with iron, gold, and mythical mithril ore guarded by stone golems.',
    width: width * 32,
    height: height * 32,
    ambientLight: 0.45, // Atmospheric underground lighting
    tiles,
    decorations: [],
    resourceNodes,
    monsters,
    npcs: [],
    portals: [
      {
        x: 40,
        y: 14 * 32,
        targetZone: 'village',
        targetX: (36 - 3) * 32,
        targetY: 15 * 32,
        name: 'Village of Eldoria (West)'
      },
      {
        x: 18 * 32,
        y: 40,
        targetZone: 'snow_peak',
        targetX: 18 * 32,
        targetY: 26 * 32,
        name: 'Frozen Celestial Peak (North Pass)'
      }
    ]
  };
}

// 4. ANCIENT CRYPT (Boss Dungeon)
function getCryptMap(): MapZone {
  const width = 36;
  const height = 28;
  const tiles = createGrid(width, height, 6); // 6 = wall/dungeon stone

  // Grand throne room & chambers
  for (let y = 4; y <= 24; y++) {
    for (let x = 6; x <= 30; x++) {
      tiles[y][x] = 2; // Stone floor
    }
  }

  const resourceNodes: ResourceNode[] = [
    {
      id: 'crypt_crystal_1',
      x: 280,
      y: 200,
      type: 'magic_crystal',
      hp: 50,
      maxHp: 50,
      requiredTool: 'pickaxe',
      respawnTime: 40,
      lootTable: [{ itemId: 'crystal_arcane', min: 2, max: 4, chance: 1.0 }],
      expReward: { type: 'mining', amount: 80 }
    },
    {
      id: 'crypt_crystal_2',
      x: 860,
      y: 200,
      type: 'magic_crystal',
      hp: 50,
      maxHp: 50,
      requiredTool: 'pickaxe',
      respawnTime: 40,
      lootTable: [{ itemId: 'crystal_arcane', min: 2, max: 4, chance: 1.0 }],
      expReward: { type: 'mining', amount: 80 }
    },
    {
      id: 'crypt_chest_royal',
      x: 576,
      y: 120,
      type: 'chest',
      hp: 30,
      maxHp: 30,
      requiredTool: 'hand',
      respawnTime: 180,
      lootTable: [
        { itemId: 'sword_radiant', min: 1, max: 1, chance: 0.5 },
        { itemId: 'crown_royal', min: 1, max: 1, chance: 0.5 },
        { itemId: 'potion_hp_large', min: 4, max: 6, chance: 1.0 }
      ],
      expReward: { type: 'combat', amount: 200 }
    }
  ];

  // Guards & Dragon Boss
  const monsters: Monster[] = [
    {
      ...MONSTER_TEMPLATES.skeleton_warrior,
      id: 'c_skel_1',
      x: 340,
      y: 520,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.skeleton_warrior,
      id: 'c_skel_2',
      x: 800,
      y: 520,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.dragon_boss,
      id: 'c_boss_dragon',
      x: 576,
      y: 300,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    }
  ];

  return {
    id: 'crypt',
    name: 'Ancient Sunken Crypt',
    description: 'The sealed sanctum of ancient dragon kings. Extreme danger!',
    width: width * 32,
    height: height * 32,
    ambientLight: 0.4,
    tiles,
    decorations: [],
    resourceNodes,
    monsters,
    npcs: [],
    portals: [
      {
        x: 18 * 32,
        y: (height - 2) * 32,
        targetZone: 'forest',
        targetX: 18 * 32,
        targetY: 80,
        name: 'Whispering Forest (South Exit)'
      }
    ]
  };
}

// 5. SNOW PEAK
function getSnowPeakMap(): MapZone {
  const width = 36;
  const height = 28;
  const tiles = createGrid(width, height, 0); // 0 = icy snow

  const resourceNodes: ResourceNode[] = [
    {
      id: 'sp_mithril_1',
      x: 280,
      y: 320,
      type: 'mithril_ore',
      hp: 75,
      maxHp: 75,
      requiredTool: 'pickaxe',
      respawnTime: 40,
      lootTable: [{ itemId: 'ore_mithril', min: 2, max: 5, chance: 1.0 }],
      expReward: { type: 'mining', amount: 80 }
    },
    {
      id: 'sp_herb_1',
      x: 740,
      y: 400,
      type: 'herb_mana',
      hp: 20,
      maxHp: 20,
      requiredTool: 'hand',
      respawnTime: 20,
      lootTable: [{ itemId: 'herb_mana', min: 3, max: 5, chance: 1.0 }],
      expReward: { type: 'herbalism', amount: 40 }
    }
  ];

  const monsters: Monster[] = [
    {
      ...MONSTER_TEMPLATES.wolf_dire,
      id: 'sp_wolf_1',
      x: 380,
      y: 380,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    },
    {
      ...MONSTER_TEMPLATES.golem_obsidian,
      id: 'sp_golem_1',
      x: 820,
      y: 320,
      lastAttackTime: 0,
      isDead: false,
      animFrame: 0
    }
  ];

  return {
    id: 'snow_peak',
    name: 'Frozen Celestial Peak',
    description: 'High glacial summits shrouded in eternal frost and sparkling crystal veins.',
    width: width * 32,
    height: height * 32,
    ambientLight: 0.95,
    tiles,
    decorations: [],
    resourceNodes,
    monsters,
    npcs: [],
    portals: [
      {
        x: 18 * 32,
        y: (height - 2) * 32,
        targetZone: 'mines',
        targetX: 18 * 32,
        targetY: 80,
        name: 'Obsidian Caverns (South Tunnel)'
      }
    ]
  };
}

export const WORLD_MAPS: Record<BiomeType, () => MapZone> = {
  village: getVillageMap,
  forest: getForestMap,
  mines: getMinesMap,
  crypt: getCryptMap,
  snow_peak: getSnowPeakMap
};
