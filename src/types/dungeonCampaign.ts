// Dungeon Campaign Construction Types
// Designed for iterative choice-based campaign creation with 10-15 meaningful decisions

export type DungeonSize = 'small' | 'medium' | 'large' | 'massive';
export type DungeonTheme = 'ancient-tomb' | 'wizard-tower' | 'underground-city' | 'natural-cavern' | 'abandoned-mine' | 'cult-temple' | 'dragon-lair' | 'prison-fortress';
export type DungeonDanger = 'low-risk' | 'moderate' | 'dangerous' | 'deadly';
export type ExplorationStyle = 'methodical' | 'aggressive' | 'stealthy' | 'diplomatic';
export type PrimaryGoal = 'treasure-hunt' | 'rescue-mission' | 'investigation' | 'elimination' | 'artifact-retrieval' | 'escape';

export interface DungeonThemeInfo {
  id: DungeonTheme;
  name: string;
  description: string;
  atmosphere: string;
  commonEnemies: string[];
  visualStyle: string;
  icon: string;
  difficulty: DungeonDanger;
  suggestedSize: DungeonSize;
}

export interface DungeonConstructionStep {
  id: string;
  step: number;
  title: string;
  description: string;
  choiceType: 'single-select' | 'multi-select' | 'slider' | 'text-input';
  options?: DungeonConstructionOption[];
  maxSelections?: number;
  isRequired: boolean;
  dependsOn?: string[];
  unlocks?: string[];
}

export interface DungeonConstructionOption {
  id: string;
  title: string;
  description: string;
  consequences: string[];
  icon: string;
  difficulty: number; // 1-5 scale
  popularity: number; // How common this choice is
  tags: string[];
}

export interface DungeonConstructionState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  choices: Record<string, any>;
  unlockedSteps: string[];
  campaignPreview: string;
  estimatedDuration: number; // in hours
  recommendedLevel: number;
}

export interface CampaignConstructionResult {
  dungeonId: string;
  campaignName: string;
  theme: DungeonTheme;
  size: DungeonSize;
  dangerLevel: DungeonDanger;
  primaryGoal: PrimaryGoal;
  explorationStyle: ExplorationStyle;
  choices: Record<string, any>;
  generatedNarrative: string;
  firstScenePrompt: string;
  characterIntegration: string;
  estimatedLength: number;
  keyNPCs: string[];
  majorEncounters: string[];
  treasureTypes: string[];
  plotTwists: string[];
}

// The 15 Core Construction Steps
export const DUNGEON_CONSTRUCTION_STEPS: DungeonConstructionStep[] = [
  {
    id: 'theme-selection',
    step: 1,
    title: 'Choose Your Dungeon Theme',
    description: 'What type of ancient place calls to your character?',
    choiceType: 'single-select',
    isRequired: true,
    unlocks: ['size-scope', 'entry-method']
  },
  {
    id: 'size-scope',
    step: 2,
    title: 'Dungeon Scope & Scale',
    description: 'How extensive is this underground realm?',
    choiceType: 'single-select',
    isRequired: true,
    dependsOn: ['theme-selection'],
    unlocks: ['danger-level']
  },
  {
    id: 'entry-method',
    step: 3,
    title: 'How Do You Enter?',
    description: 'Your approach determines the first encounter',
    choiceType: 'single-select',
    isRequired: true,
    dependsOn: ['theme-selection'],
    unlocks: ['primary-goal']
  },
  {
    id: 'primary-goal',
    step: 4,
    title: 'Your Primary Objective',
    description: 'What drives you into this dangerous place?',
    choiceType: 'single-select',
    isRequired: true,
    dependsOn: ['entry-method'],
    unlocks: ['secondary-objectives']
  },
  {
    id: 'secondary-objectives',
    step: 5,
    title: 'Secondary Goals',
    description: 'Choose additional objectives (optional but rewarding)',
    choiceType: 'multi-select',
    maxSelections: 2,
    isRequired: false,
    dependsOn: ['primary-goal'],
    unlocks: ['exploration-style']
  },
  {
    id: 'exploration-style',
    step: 6,
    title: 'Your Exploration Approach',
    description: 'How do you prefer to tackle unknown dangers?',
    choiceType: 'single-select',
    isRequired: true,
    dependsOn: ['secondary-objectives'],
    unlocks: ['risk-tolerance', 'party-composition']
  },
  {
    id: 'risk-tolerance',
    step: 7,
    title: 'Risk vs. Reward Preference',
    description: 'How much danger are you willing to face for greater treasure?',
    choiceType: 'slider',
    isRequired: true,
    dependsOn: ['exploration-style'],
    unlocks: ['environmental-hazards']
  },
  {
    id: 'party-composition',
    step: 8,
    title: 'Companions & Allies',
    description: 'Who accompanies you on this perilous journey?',
    choiceType: 'multi-select',
    maxSelections: 3,
    isRequired: false,
    dependsOn: ['exploration-style'],
    unlocks: ['social-encounters']
  },
  {
    id: 'environmental-hazards',
    step: 9,
    title: 'Environmental Challenges',
    description: 'What natural dangers lurk in these depths?',
    choiceType: 'multi-select',
    maxSelections: 2,
    isRequired: false,
    dependsOn: ['risk-tolerance'],
    unlocks: ['creature-types']
  },
  {
    id: 'creature-types',
    step: 10,
    title: 'Primary Inhabitants',
    description: 'What creatures have made this place their domain?',
    choiceType: 'multi-select',
    maxSelections: 3,
    isRequired: true,
    dependsOn: ['environmental-hazards'],
    unlocks: ['magical-elements']
  },
  {
    id: 'magical-elements',
    step: 11,
    title: 'Arcane Influences',
    description: 'What magical forces permeate this place?',
    choiceType: 'single-select',
    isRequired: false,
    dependsOn: ['creature-types'],
    unlocks: ['treasure-focus']
  },
  {
    id: 'treasure-focus',
    step: 12,
    title: 'Treasure Preferences',
    description: 'What type of rewards most interest you?',
    choiceType: 'multi-select',
    maxSelections: 2,
    isRequired: true,
    dependsOn: ['magical-elements'],
    unlocks: ['narrative-complexity']
  },
  {
    id: 'social-encounters',
    step: 13,
    title: 'Social Dynamics',
    description: 'How complex should NPC interactions be?',
    choiceType: 'single-select',
    isRequired: false,
    dependsOn: ['party-composition'],
    unlocks: ['narrative-complexity']
  },
  {
    id: 'narrative-complexity',
    step: 14,
    title: 'Story Depth',
    description: 'How intricate should the plot be?',
    choiceType: 'single-select',
    isRequired: true,
    dependsOn: ['treasure-focus', 'social-encounters'],
    unlocks: ['final-customization']
  },
  {
    id: 'final-customization',
    step: 15,
    title: 'Personal Touches',
    description: 'Add final customizations to make this adventure uniquely yours',
    choiceType: 'text-input',
    isRequired: false,
    dependsOn: ['narrative-complexity']
  }
];

export const DUNGEON_THEMES: Record<DungeonTheme, DungeonThemeInfo> = {
  'ancient-tomb': {
    id: 'ancient-tomb',
    name: 'Ancient Tomb',
    description: 'A burial site of long-dead rulers, filled with traps and undead guardians',
    atmosphere: 'Eerie silence broken by distant echoes, dusty air thick with age',
    commonEnemies: ['Skeletons', 'Mummies', 'Wraiths', 'Tomb Guardians'],
    visualStyle: 'Egyptian/Mesopotamian architecture with hieroglyphs and sarcophagi',
    icon: '⚱️',
    difficulty: 'moderate',
    suggestedSize: 'medium'
  },
  'wizard-tower': {
    id: 'wizard-tower',
    name: 'Abandoned Wizard Tower',
    description: 'A vertical dungeon filled with magical experiments and arcane mysteries',
    atmosphere: 'Crackling magical energy, floating objects, reality-bending rooms',
    commonEnemies: ['Animated Objects', 'Elementals', 'Magical Constructs', 'Aberrations'],
    visualStyle: 'Tall spire with impossible architecture and glowing runes',
    icon: '🗼',
    difficulty: 'dangerous',
    suggestedSize: 'small'
  },
  'underground-city': {
    id: 'underground-city',
    name: 'Lost Underground City',
    description: 'A vast subterranean metropolis with districts, politics, and secrets',
    atmosphere: 'Dim torchlight illuminates stone streets and forgotten marketplaces',
    commonEnemies: ['Drow', 'Duergar', 'Deep Gnomes', 'Underground Factions'],
    visualStyle: 'Multi-level city carved from living rock',
    icon: '🏛️',
    difficulty: 'dangerous',
    suggestedSize: 'massive'
  },
  'natural-cavern': {
    id: 'natural-cavern',
    name: 'Natural Cave System',
    description: 'An organic network of caves shaped by water and time',
    atmosphere: 'Dripping water echoes, natural formations create maze-like passages',
    commonEnemies: ['Cave Beasts', 'Oozes', 'Bats', 'Underground Predators'],
    visualStyle: 'Organic formations, underground rivers, crystal formations',
    icon: '🕳️',
    difficulty: 'low-risk',
    suggestedSize: 'large'
  },
  'abandoned-mine': {
    id: 'abandoned-mine',
    name: 'Abandoned Mine',
    description: 'Industrial tunnels and shafts abandoned after a catastrophe',
    atmosphere: 'Creaking wooden supports, mine carts, and the scent of old earth',
    commonEnemies: ['Miners\' Ghosts', 'Cave-ins', 'Gas Pockets', 'Claim Jumpers'],
    visualStyle: 'Wooden support beams, mining equipment, track systems',
    icon: '⛏️',
    difficulty: 'moderate',
    suggestedSize: 'medium'
  },
  'cult-temple': {
    id: 'cult-temple',
    name: 'Cult Temple',
    description: 'A religious site dedicated to dark or forgotten deities',
    atmosphere: 'Ominous chanting, sacrificial chambers, oppressive divine presence',
    commonEnemies: ['Cultists', 'Summoned Demons', 'Religious Fanatics', 'Dark Priests'],
    visualStyle: 'Religious iconography, altars, ritual chambers',
    icon: '⛪',
    difficulty: 'dangerous',
    suggestedSize: 'medium'
  },
  'dragon-lair': {
    id: 'dragon-lair',
    name: 'Dragon\'s Lair',
    description: 'The dwelling of a mighty dragon, filled with hoarded treasure',
    atmosphere: 'Oppressive heat or cold, the overwhelming presence of ancient power',
    commonEnemies: ['Dragon', 'Kobolds', 'Dragonborn Servants', 'Treasure Guardians'],
    visualStyle: 'Massive caverns with treasure hoards and draconic aesthetics',
    icon: '🐉',
    difficulty: 'deadly',
    suggestedSize: 'large'
  },
  'prison-fortress': {
    id: 'prison-fortress',
    name: 'Prison Fortress',
    description: 'A fortified complex designed to contain dangerous prisoners',
    atmosphere: 'Clanking chains, barred windows, oppressive security measures',
    commonEnemies: ['Guards', 'Escaped Prisoners', 'Torture Devices', 'Wardens'],
    visualStyle: 'Stone walls, iron bars, guard towers, interrogation chambers',
    icon: '🏰',
    difficulty: 'moderate',
    suggestedSize: 'medium'
  }
};