import { Quest, NPC } from '../types/game';

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_first_steps',
    title: 'First Steps of an Adventurer',
    description: 'Elder Cedric has requested that you gather materials from the meadow to craft your first basic equipment.',
    giverName: 'Elder Cedric',
    category: 'main',
    objectives: [
      {
        id: 'obj_gather_wood',
        description: 'Chop trees in Eldoria Meadow to collect Oak Timber',
        targetType: 'gather',
        targetId: 'wood_oak',
        current: 0,
        required: 5
      },
      {
        id: 'obj_gather_herbs',
        description: 'Harvest Silverleaf Herbs from the wild bushes',
        targetType: 'gather',
        targetId: 'herb_healing',
        current: 0,
        required: 4
      }
    ],
    rewards: {
      exp: 100,
      gold: 50,
      items: [
        { itemId: 'potion_hp_small', quantity: 3 },
        { itemId: 'pickaxe_iron', quantity: 1 }
      ]
    },
    status: 'in_progress'
  },
  {
    id: 'quest_slime_menace',
    title: 'Clearing the Meadows',
    description: 'Slimes have been encroaching onto the farmlands. Hunt down Meadow Slimes to protect the villagers.',
    giverName: 'Captain Valen',
    category: 'bounty',
    objectives: [
      {
        id: 'obj_kill_slimes',
        description: 'Defeat Meadow Slimes in Eldoria Meadow or Forest',
        targetType: 'kill',
        targetId: 'slime_green',
        current: 0,
        required: 5
      }
    ],
    rewards: {
      exp: 150,
      gold: 80,
      items: [
        { itemId: 'shield_wooden', quantity: 1 }
      ]
    },
    status: 'available'
  },
  {
    id: 'quest_deep_veins',
    title: 'Depths of Obsidian Caverns',
    description: 'Blacksmith Donald needs precious raw ores to forge battle-ready arms for the frontier guard.',
    giverName: 'Blacksmith Donald',
    category: 'gathering',
    objectives: [
      {
        id: 'obj_mine_iron',
        description: 'Mine Iron Ore from rocky veins in Obsidian Caverns',
        targetType: 'gather',
        targetId: 'ore_iron',
        current: 0,
        required: 8
      },
      {
        id: 'obj_mine_gold',
        description: 'Discover and mine Gold Nuggets',
        targetType: 'gather',
        targetId: 'ore_gold',
        current: 0,
        required: 3
      }
    ],
    rewards: {
      exp: 300,
      gold: 160,
      items: [
        { itemId: 'armor_plate', quantity: 1 }
      ]
    },
    status: 'available'
  },
  {
    id: 'quest_dragon_slayer',
    title: 'The Lord of Embers',
    description: 'The ancient red dragon Ignis has awakened in the Sunken Crypt. Vanquish the dragon to bring peace to Eldoria!',
    giverName: 'Elder Cedric',
    category: 'main',
    objectives: [
      {
        id: 'obj_slay_dragon',
        description: 'Vanquish Ignis, King of Embers in the Ancient Crypt',
        targetType: 'kill',
        targetId: 'dragon_boss',
        current: 0,
        required: 1
      }
    ],
    rewards: {
      exp: 1500,
      gold: 1000,
      items: [
        { itemId: 'sword_radiant', quantity: 1 },
        { itemId: 'crown_royal', quantity: 1 }
      ]
    },
    status: 'available'
  }
];

export const WORLD_NPCS: Record<string, NPC[]> = {
  village: [
    {
      id: 'npc_elder_cedric',
      name: 'Elder Cedric',
      title: 'Village Chieftain',
      x: 380,
      y: 280,
      direction: 'down',
      appearance: {
        gender: 'male',
        skinColor: '#fed7aa',
        hairStyle: 'wizard_braid',
        hairColor: '#e2e8f0',
        eyeColor: '#0284c7',
        facialHair: 'beard',
        shirtColor: '#4338ca',
        pantsColor: '#1e1b4b',
        shoesColor: '#451a03'
      },
      dialogueTree: [
        {
          id: 'start',
          text: 'Greetings, brave traveller! Welcome to the realm of Eldoria. You can explore our meadows, harvest herbs, chop wood, mine precious ores in the deep caverns, and equip yourself for the challenges ahead.',
          options: [
            { text: 'I am ready for a quest!', nextId: 'quest_info' },
            { text: 'Could you heal my wounds?', action: 'heal', nextId: 'healed' },
            { text: 'Farewell for now.', action: 'close' }
          ]
        },
        {
          id: 'quest_info',
          text: 'I see great potential in your eyes. First, gather wood from trees and herbs from the meadow to hone your gathering skills. Check your Quest Log (Q) for your objectives!',
          options: [
            { text: 'I will get right on it!', action: 'close' }
          ]
        },
        {
          id: 'healed',
          text: 'May the light of Eldoria rejuvenate your body and spirit. Your HP and MP have been fully restored!',
          options: [
            { text: 'Thank you, Elder.', action: 'close' }
          ]
        }
      ]
    },
    {
      id: 'npc_blacksmith_donald',
      name: 'Donald',
      title: 'Master Blacksmith',
      x: 580,
      y: 350,
      direction: 'left',
      appearance: {
        gender: 'male',
        skinColor: '#fcd34d',
        hairStyle: 'short',
        hairColor: '#78350f',
        eyeColor: '#92400e',
        facialHair: 'stubble',
        shirtColor: '#b45309',
        pantsColor: '#334155',
        shoesColor: '#1c1917'
      },
      dialogueTree: [
        {
          id: 'start',
          text: 'CLANG! Welcome to my forge. Bring me raw iron, gold, and timber and I can forge you razor-sharp swords, heavy armor, and high-tier pickaxes.',
          options: [
            { text: 'Show me your crafting forge.', action: 'open_crafting' },
            { text: 'Do you have goods for sale?', action: 'open_shop' },
            { text: 'I will return later.', action: 'close' }
          ]
        }
      ],
      shopItems: [
        { itemId: 'sword_novice', price: 25 },
        { itemId: 'pickaxe_iron', price: 35 },
        { itemId: 'axe_woodcutter', price: 30 },
        { itemId: 'shield_wooden', price: 20 },
        { itemId: 'helm_knight', price: 50 },
        { itemId: 'potion_hp_small', price: 10 },
        { itemId: 'potion_mp_small', price: 10 }
      ]
    },
    {
      id: 'npc_captain_valen',
      name: 'Captain Valen',
      title: 'Town Guard Guardmaster',
      x: 200,
      y: 420,
      direction: 'right',
      appearance: {
        gender: 'male',
        skinColor: '#fde047',
        hairStyle: 'spiky',
        hairColor: '#b45309',
        eyeColor: '#15803d',
        facialHair: 'none',
        shirtColor: '#94a3b8',
        pantsColor: '#1e293b',
        shoesColor: '#0f172a'
      },
      dialogueTree: [
        {
          id: 'start',
          text: 'Halt, adventurer! The wilds beyond our village walls are fraught with aggressive creatures—slimes, direwolves, and goblin bandits. Keep your sword sharp and your reflexes ready!',
          options: [
            { text: 'I am looking for bounties.', nextId: 'bounty' },
            { text: 'Understood, Captain.', action: 'close' }
          ]
        },
        {
          id: 'bounty',
          text: 'There is a bounty on Meadow Slimes and Direwolves roaming the Whispering Forest. Slay them to earn gold and honor!',
          options: [
            { text: 'Consider it done!', action: 'close' }
          ]
        }
      ]
    }
  ]
};
