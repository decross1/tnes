export type CampaignMode = 'full-random' | 'guided';
export type CampaignTone = 'dark' | 'heroic' | 'comedic' | 'gritty';
export type StartingLocation = 'tavern' | 'dungeon' | 'wilderness' | 'city' | 'random';

export interface CampaignSetup {
  mode: CampaignMode;
  themes?: string[];
  tone?: CampaignTone;
  startingLocation?: StartingLocation;
  campaignKeywords?: string[];
  isSetup: boolean;
}

export interface ToneInfo {
  name: CampaignTone;
  title: string;
  description: string;
  examples: string[];
  icon: string;
}

export const CAMPAIGN_TONES: Record<CampaignTone, ToneInfo> = {
  dark: {
    name: 'dark',
    title: 'Dark Fantasy',
    description: 'Grim and atmospheric adventures with moral complexity',
    examples: ['Cursed kingdoms', 'Eldritch horrors', 'Betrayal and sacrifice'],
    icon: '🌙'
  },
  heroic: {
    name: 'heroic',
    title: 'Epic Heroes',
    description: 'Classic heroic fantasy with clear good vs evil',
    examples: ['Saving kingdoms', 'Defeating ancient evils', 'Noble quests'],
    icon: '⭐'
  },
  comedic: {
    name: 'comedic',
    title: 'Light-hearted',
    description: 'Fun and whimsical adventures with humor and levity',
    examples: ['Bumbling villains', 'Silly situations', 'Happy endings'],
    icon: '😄'
  },
  gritty: {
    name: 'gritty',
    title: 'Gritty Realism',
    description: 'Realistic consequences and resource management',
    examples: ['Political intrigue', 'Resource scarcity', 'Survival challenges'],
    icon: '⚰️'
  }
};

export interface LocationInfo {
  name: StartingLocation;
  title: string;
  description: string;
  atmosphere: string;
  icon: string;
}

export const STARTING_LOCATIONS: Record<StartingLocation, LocationInfo> = {
  tavern: {
    name: 'tavern',
    title: 'Classic Tavern',
    description: 'Begin your adventure in a bustling tavern filled with rumors and opportunities',
    atmosphere: 'Warm, social, traditional D&D opening',
    icon: '🍺'
  },
  dungeon: {
    name: 'dungeon',
    title: 'In Media Res',
    description: 'Start already exploring a mysterious dungeon or ancient ruins',
    atmosphere: 'Action-packed, immediate danger and mystery',
    icon: '⚔️'
  },
  wilderness: {
    name: 'wilderness',
    title: 'Wilderness',
    description: 'Begin your journey on the road or in the wild frontier',
    atmosphere: 'Open-ended, survival elements, natural beauty',
    icon: '🌲'
  },
  city: {
    name: 'city',
    title: 'Urban Adventure',
    description: 'Start in a bustling city full of politics, crime, and opportunity',
    atmosphere: 'Social intrigue, diverse NPCs, complex plots',
    icon: '🏰'
  },
  random: {
    name: 'random',
    title: 'Surprise Me',
    description: 'Let fate decide where your adventure begins',
    atmosphere: 'Unpredictable, could be anywhere!',
    icon: '🎲'
  }
};

export const KEYWORD_SUGGESTIONS = {
  themes: [
    'revenge', 'prophecy', 'artifact', 'rescue', 'mystery',
    'war', 'politics', 'romance', 'family', 'honor'
  ],
  creatures: [
    'dragons', 'undead', 'cultists', 'bandits', 'fey',
    'demons', 'giants', 'aberrations', 'elementals', 'beasts'
  ],
  settings: [
    'dungeon', 'forest', 'city', 'mountains', 'sea',
    'desert', 'swamp', 'ruins', 'castle', 'temple'
  ],
  tone: [
    'horror', 'comedy', 'epic', 'intrigue', 'survival',
    'exploration', 'social', 'combat', 'stealth', 'magic'
  ]
};