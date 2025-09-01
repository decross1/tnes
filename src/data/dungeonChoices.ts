// Complete choice data for the 15-step dungeon campaign constructor
import { DungeonConstructionOption } from '../types/dungeonCampaign';

export const DUNGEON_CHOICE_OPTIONS: Record<string, DungeonConstructionOption[]> = {
  'theme-selection': [
    {
      id: 'ancient-tomb',
      title: 'Ancient Tomb',
      description: 'A burial site of long-dead rulers, filled with traps and undead guardians',
      consequences: ['Undead enemies', 'Ancient traps', 'Cursed treasures'],
      icon: '⚱️',
      difficulty: 3,
      popularity: 4,
      tags: ['undead', 'traps', 'ancient']
    },
    {
      id: 'wizard-tower',
      title: 'Abandoned Wizard Tower',
      description: 'A vertical dungeon filled with magical experiments and arcane mysteries',
      consequences: ['Magical hazards', 'Reality distortions', 'Arcane puzzles'],
      icon: '🗼',
      difficulty: 4,
      popularity: 3,
      tags: ['magic', 'vertical', 'puzzles']
    },
    {
      id: 'underground-city',
      title: 'Lost Underground City',
      description: 'A vast subterranean metropolis with districts, politics, and secrets',
      consequences: ['Multiple factions', 'Complex politics', 'Urban exploration'],
      icon: '🏛️',
      difficulty: 4,
      popularity: 2,
      tags: ['social', 'large', 'politics']
    },
    {
      id: 'natural-cavern',
      title: 'Natural Cave System',
      description: 'An organic network of caves shaped by water and time',
      consequences: ['Natural hazards', 'Cave-ins', 'Underground streams'],
      icon: '🕳️',
      difficulty: 2,
      popularity: 4,
      tags: ['natural', 'exploration', 'survival']
    },
    {
      id: 'abandoned-mine',
      title: 'Abandoned Mine',
      description: 'Industrial tunnels and shafts abandoned after a catastrophe',
      consequences: ['Structural collapse', 'Toxic gases', 'Mining equipment'],
      icon: '⛏️',
      difficulty: 2,
      popularity: 3,
      tags: ['industrial', 'hazards', 'history']
    },
    {
      id: 'cult-temple',
      title: 'Cult Temple',
      description: 'A religious site dedicated to dark or forgotten deities',
      consequences: ['Fanatical enemies', 'Ritual chambers', 'Dark magic'],
      icon: '⛪',
      difficulty: 4,
      popularity: 3,
      tags: ['religious', 'cultists', 'dark']
    },
    {
      id: 'dragon-lair',
      title: 'Dragon\'s Lair',
      description: 'The dwelling of a mighty dragon, filled with hoarded treasure',
      consequences: ['Dragon encounter', 'Extreme danger', 'Massive treasure'],
      icon: '🐉',
      difficulty: 5,
      popularity: 2,
      tags: ['dragon', 'legendary', 'treasure']
    },
    {
      id: 'prison-fortress',
      title: 'Prison Fortress',
      description: 'A fortified complex designed to contain dangerous prisoners',
      consequences: ['Heavy security', 'Escaped prisoners', 'Military tactics'],
      icon: '🏰',
      difficulty: 3,
      popularity: 2,
      tags: ['fortress', 'guards', 'prisoners']
    }
  ],

  'size-scope': [
    {
      id: 'small',
      title: 'Compact Complex',
      description: '3-5 main areas, perfect for a focused adventure',
      consequences: ['Quick completion', 'Concentrated encounters', '1-2 hours'],
      icon: '🏠',
      difficulty: 1,
      popularity: 4,
      tags: ['quick', 'focused', 'intimate']
    },
    {
      id: 'medium',
      title: 'Standard Dungeon',
      description: '8-12 interconnected areas with varied challenges',
      consequences: ['Balanced pacing', 'Multiple paths', '2-4 hours'],
      icon: '🏰',
      difficulty: 2,
      popularity: 5,
      tags: ['balanced', 'classic', 'varied']
    },
    {
      id: 'large',
      title: 'Sprawling Complex',
      description: '15-20+ areas with multiple levels and secrets',
      consequences: ['Epic scope', 'Complex navigation', '4-6 hours'],
      icon: '🏛️',
      difficulty: 3,
      popularity: 3,
      tags: ['epic', 'complex', 'exploration']
    },
    {
      id: 'massive',
      title: 'Mega-Dungeon',
      description: 'A vast complex that could support multiple sessions',
      consequences: ['Overwhelming scope', 'Campaign-spanning', '8+ hours'],
      icon: '🗻',
      difficulty: 4,
      popularity: 1,
      tags: ['massive', 'campaign', 'overwhelming']
    }
  ],

  'entry-method': [
    {
      id: 'front-door',
      title: 'Main Entrance',
      description: 'Enter through the obvious front door, facing intended defenses',
      consequences: ['Expected by inhabitants', 'Full defenses active', 'Direct confrontation'],
      icon: '🚪',
      difficulty: 3,
      popularity: 4,
      tags: ['direct', 'combat', 'expected']
    },
    {
      id: 'secret-passage',
      title: 'Hidden Entry',
      description: 'Find and use a secret entrance to bypass outer defenses',
      consequences: ['Stealthy approach', 'Avoid some encounters', 'Discovery risk'],
      icon: '🔍',
      difficulty: 3,
      popularity: 3,
      tags: ['stealth', 'clever', 'bypass']
    },
    {
      id: 'breach-walls',
      title: 'Forced Entry',
      description: 'Create your own entrance through walls or barriers',
      consequences: ['Loud approach', 'Alert all inhabitants', 'Structural damage'],
      icon: '💥',
      difficulty: 2,
      popularity: 2,
      tags: ['aggressive', 'noisy', 'direct']
    },
    {
      id: 'underground',
      title: 'Tunnel Approach',
      description: 'Enter through underground tunnels, sewers, or natural caves',
      consequences: ['Unexpected angle', 'Underground creatures', 'Navigation challenges'],
      icon: '⬇️',
      difficulty: 3,
      popularity: 2,
      tags: ['underground', 'tactical', 'complex']
    },
    {
      id: 'aerial',
      title: 'From Above',
      description: 'Use magic, climbing, or flying to enter from the roof or upper levels',
      consequences: ['Requires special abilities', 'Surprising approach', 'Height dangers'],
      icon: '⬆️',
      difficulty: 4,
      popularity: 2,
      tags: ['aerial', 'special', 'surprising']
    }
  ],

  'primary-goal': [
    {
      id: 'treasure-hunt',
      title: 'Seek Ancient Treasures',
      description: 'Your primary goal is to claim the legendary wealth hidden within',
      consequences: ['Treasure-focused encounters', 'Trap emphasis', 'Greed complications'],
      icon: '💰',
      difficulty: 2,
      popularity: 5,
      tags: ['treasure', 'greed', 'wealth']
    },
    {
      id: 'rescue-mission',
      title: 'Rescue Someone Important',
      description: 'Someone dear to you is trapped within and needs your help',
      consequences: ['Time pressure', 'Emotional stakes', 'Hostage complications'],
      icon: '🆘',
      difficulty: 3,
      popularity: 4,
      tags: ['rescue', 'time', 'emotional']
    },
    {
      id: 'investigation',
      title: 'Uncover Dark Mysteries',
      description: 'Strange events require investigation and the truth must be found',
      consequences: ['Clue gathering', 'Mystery elements', 'Revelation moments'],
      icon: '🔍',
      difficulty: 3,
      popularity: 3,
      tags: ['mystery', 'investigation', 'truth']
    },
    {
      id: 'elimination',
      title: 'Eliminate a Threat',
      description: 'A dangerous enemy must be destroyed before they cause more harm',
      consequences: ['Combat focus', 'Tactical preparation', 'Enemy intelligence'],
      icon: '⚔️',
      difficulty: 4,
      popularity: 3,
      tags: ['combat', 'elimination', 'tactical']
    },
    {
      id: 'artifact-retrieval',
      title: 'Retrieve a Powerful Artifact',
      description: 'A magical item of great importance must be recovered',
      consequences: ['Artifact guardians', 'Magical complications', 'Power temptation'],
      icon: '🏆',
      difficulty: 4,
      popularity: 2,
      tags: ['artifact', 'magic', 'power']
    },
    {
      id: 'escape',
      title: 'Escape This Prison',
      description: 'You begin trapped within and must find your way out',
      consequences: ['Reverse dungeon', 'Limited resources', 'Desperation tactics'],
      icon: '🔓',
      difficulty: 4,
      popularity: 2,
      tags: ['escape', 'prison', 'desperation']
    }
  ],

  'secondary-objectives': [
    {
      id: 'map-creation',
      title: 'Chart the Unknown',
      description: 'Create a comprehensive map of this mysterious place',
      consequences: ['Exploration bonus', 'Navigation advantages', 'Cartography rewards'],
      icon: '🗺️',
      difficulty: 2,
      popularity: 3,
      tags: ['exploration', 'mapping', 'knowledge']
    },
    {
      id: 'lore-discovery',
      title: 'Uncover Ancient History',
      description: 'Learn the forgotten stories and secrets of this place',
      consequences: ['Historical insights', 'Knowledge rewards', 'Story depth'],
      icon: '📜',
      difficulty: 2,
      popularity: 4,
      tags: ['lore', 'history', 'stories']
    },
    {
      id: 'survivor-rescue',
      title: 'Save Any Survivors',
      description: 'Look for and rescue any remaining survivors',
      consequences: ['Additional NPCs', 'Moral choices', 'Resource sharing'],
      icon: '🏥',
      difficulty: 3,
      popularity: 4,
      tags: ['rescue', 'npcs', 'morality']
    },
    {
      id: 'resource-gathering',
      title: 'Collect Valuable Resources',
      description: 'Gather rare materials, components, and supplies',
      consequences: ['Material rewards', 'Crafting opportunities', 'Weight management'],
      icon: '⛏️',
      difficulty: 2,
      popularity: 3,
      tags: ['resources', 'crafting', 'gathering']
    },
    {
      id: 'enemy-intelligence',
      title: 'Gather Enemy Intelligence',
      description: 'Learn about the threats and their weaknesses',
      consequences: ['Tactical advantages', 'Enemy insights', 'Preparation benefits'],
      icon: '🕵️',
      difficulty: 3,
      popularity: 2,
      tags: ['intelligence', 'tactics', 'preparation']
    }
  ],

  'exploration-style': [
    {
      id: 'methodical',
      title: 'Careful and Methodical',
      description: 'Search every corner, check every door, leave no stone unturned',
      consequences: ['Find all secrets', 'Avoid most traps', 'Slower progress'],
      icon: '🔍',
      difficulty: 2,
      popularity: 4,
      tags: ['thorough', 'safe', 'secrets']
    },
    {
      id: 'aggressive',
      title: 'Bold and Direct',
      description: 'Charge forward with confidence, overcome obstacles through force',
      consequences: ['Fast progress', 'More combat', 'Higher risks'],
      icon: '⚡',
      difficulty: 3,
      popularity: 3,
      tags: ['fast', 'combat', 'risky']
    },
    {
      id: 'stealthy',
      title: 'Silent and Hidden',
      description: 'Avoid detection, slip past enemies, strike from the shadows',
      consequences: ['Avoid many fights', 'Stealth challenges', 'Surprise advantages'],
      icon: '👤',
      difficulty: 4,
      popularity: 2,
      tags: ['stealth', 'avoidance', 'surprise']
    },
    {
      id: 'diplomatic',
      title: 'Talk First, Fight Later',
      description: 'Attempt to negotiate, understand motivations, find peaceful solutions',
      consequences: ['Social encounters', 'Peaceful resolutions', 'Complex morality'],
      icon: '🤝',
      difficulty: 3,
      popularity: 2,
      tags: ['social', 'peaceful', 'complex']
    }
  ],

  'creature-types': [
    {
      id: 'undead',
      title: 'Undead Horrors',
      description: 'Skeletons, zombies, ghosts, and other creatures that defy death',
      consequences: ['Turn undead effective', 'Fearsome auras', 'Necrotic damage'],
      icon: '💀',
      difficulty: 3,
      popularity: 4,
      tags: ['undead', 'horror', 'necrotic']
    },
    {
      id: 'constructs',
      title: 'Magical Constructs',
      description: 'Animated objects, golems, and artificial beings',
      consequences: ['Immune to many effects', 'Predictable behavior', 'Repair challenges'],
      icon: '🤖',
      difficulty: 3,
      popularity: 3,
      tags: ['constructs', 'magic', 'artificial']
    },
    {
      id: 'beasts',
      title: 'Natural Predators',
      description: 'Wolves, bears, giant spiders, and other dangerous animals',
      consequences: ['Animal handling works', 'Pack tactics', 'Natural instincts'],
      icon: '🐺',
      difficulty: 2,
      popularity: 4,
      tags: ['beasts', 'natural', 'pack']
    },
    {
      id: 'humanoids',
      title: 'Hostile Humanoids',
      description: 'Bandits, cultists, guards, and other intelligent foes',
      consequences: ['Equipment variety', 'Tactical thinking', 'Social possibilities'],
      icon: '🗡️',
      difficulty: 3,
      popularity: 5,
      tags: ['humanoids', 'intelligent', 'varied']
    },
    {
      id: 'aberrations',
      title: 'Eldritch Aberrations',
      description: 'Mind flayers, beholders, and other reality-warping entities',
      consequences: ['Psychic attacks', 'Reality distortion', 'Madness risks'],
      icon: '👁️',
      difficulty: 5,
      popularity: 2,
      tags: ['aberrations', 'psychic', 'madness']
    },
    {
      id: 'elementals',
      title: 'Elemental Forces',
      description: 'Fire, water, earth, and air elementals with primal power',
      consequences: ['Elemental damage', 'Environmental effects', 'Resistance needs'],
      icon: '🔥',
      difficulty: 3,
      popularity: 3,
      tags: ['elementals', 'primal', 'environmental']
    }
  ],

  'magical-elements': [
    {
      id: 'none',
      title: 'Mundane Environment',
      description: 'Little to no magical influence, relying on natural and physical challenges',
      consequences: ['No magic surprises', 'Realistic physics', 'Skill-based solutions'],
      icon: '⚒️',
      difficulty: 2,
      popularity: 3,
      tags: ['mundane', 'realistic', 'skills']
    },
    {
      id: 'wild-magic',
      title: 'Wild Magic Zones',
      description: 'Unpredictable magical surges that can help or hinder',
      consequences: ['Random magical effects', 'Unpredictable outcomes', 'Chaos elements'],
      icon: '🌀',
      difficulty: 4,
      popularity: 2,
      tags: ['wild', 'unpredictable', 'chaos']
    },
    {
      id: 'dead-magic',
      title: 'Dead Magic Areas',
      description: 'Zones where magic fails completely, forcing alternative solutions',
      consequences: ['No spellcasting', 'Magic items fail', 'Physical solutions only'],
      icon: '🚫',
      difficulty: 3,
      popularity: 2,
      tags: ['dead-magic', 'anti-magic', 'physical']
    },
    {
      id: 'enchanted',
      title: 'Heavily Enchanted',
      description: 'Pervasive beneficial and harmful magical effects throughout',
      consequences: ['Magical atmosphere', 'Enhanced encounters', 'Spell interactions'],
      icon: '✨',
      difficulty: 3,
      popularity: 4,
      tags: ['enchanted', 'magical', 'enhanced']
    },
    {
      id: 'cursed',
      title: 'Cursed Grounds',
      description: 'Dark magic permeates the area, bringing misfortune and dread',
      consequences: ['Curse effects', 'Bad luck events', 'Removal challenges'],
      icon: '💀',
      difficulty: 4,
      popularity: 3,
      tags: ['cursed', 'dark', 'misfortune']
    }
  ],

  'treasure-focus': [
    {
      id: 'gold-gems',
      title: 'Coins and Precious Gems',
      description: 'Traditional treasure: gold pieces, silver, platinum, and gemstones',
      consequences: ['Liquid wealth', 'Weight considerations', 'Economic impact'],
      icon: '💎',
      difficulty: 1,
      popularity: 5,
      tags: ['traditional', 'wealth', 'liquid']
    },
    {
      id: 'magic-items',
      title: 'Magical Equipment',
      description: 'Enchanted weapons, armor, and wondrous items',
      consequences: ['Power increases', 'Identification needs', 'Attunement limits'],
      icon: '🗡️',
      difficulty: 2,
      popularity: 4,
      tags: ['magical', 'equipment', 'power']
    },
    {
      id: 'knowledge',
      title: 'Ancient Knowledge',
      description: 'Spellbooks, scrolls, maps, and forgotten secrets',
      consequences: ['Learning opportunities', 'Spell access', 'Information value'],
      icon: '📚',
      difficulty: 2,
      popularity: 3,
      tags: ['knowledge', 'spells', 'information']
    },
    {
      id: 'art-objects',
      title: 'Precious Art Objects',
      description: 'Statues, paintings, tapestries, and cultural artifacts',
      consequences: ['Cultural value', 'Difficult transport', 'Historical significance'],
      icon: '🏺',
      difficulty: 2,
      popularity: 2,
      tags: ['art', 'culture', 'historical']
    }
  ],

  'narrative-complexity': [
    {
      id: 'simple',
      title: 'Straightforward Adventure',
      description: 'Clear objectives, obvious enemies, simple moral choices',
      consequences: ['Easy to follow', 'Clear goals', 'Simple decisions'],
      icon: '➡️',
      difficulty: 1,
      popularity: 4,
      tags: ['simple', 'clear', 'straightforward']
    },
    {
      id: 'moderate',
      title: 'Layered Storytelling',
      description: 'Multiple plot threads, some moral ambiguity, character development',
      consequences: ['Moderate complexity', 'Character growth', 'Some tough choices'],
      icon: '🎭',
      difficulty: 2,
      popularity: 4,
      tags: ['layered', 'growth', 'choices']
    },
    {
      id: 'complex',
      title: 'Intricate Web of Plots',
      description: 'Multiple factions, shifting alliances, deep moral questions',
      consequences: ['High complexity', 'Difficult decisions', 'Multiple outcomes'],
      icon: '🕸️',
      difficulty: 4,
      popularity: 2,
      tags: ['complex', 'factions', 'moral']
    }
  ]
};