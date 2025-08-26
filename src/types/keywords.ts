export interface KeywordWeight {
  text: string;
  weight: number;
  source: 'player' | 'story' | 'system';
  addedAt: Date;
  category?: 'theme' | 'creature' | 'setting' | 'tone' | 'character' | 'plot';
}

export interface KeywordManager {
  // Tier 1: Campaign Keywords (Weight: 1.0) - Persistent throughout campaign
  campaign: Map<string, KeywordWeight>;
  
  // Tier 2: Dynamic Keywords (Weight: 0.5-0.8) - Evolve based on player actions  
  dynamic: Map<string, KeywordWeight>;
  
  // Tier 3: Scene Keywords (Weight: 0.3) - Temporary scene-specific
  scene: Map<string, KeywordWeight>;
}

export interface QuestLine {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  keywords: string[];
  progress: number; // 0-100
  steps: QuestStep[];
}

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
  keywords?: string[];
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  importance: 'minor' | 'major' | 'critical';
  resolved: boolean;
  sceneId?: string;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  relationship: 'friendly' | 'neutral' | 'hostile' | 'romantic' | 'rival';
  keywords: string[];
  importance: 'minor' | 'major' | 'critical';
  lastSeen?: string;
}

export interface ReputationTracker {
  factions: Map<string, number>; // -100 to 100
  locations: Map<string, number>; // -100 to 100
  general: number; // Overall reputation -100 to 100
}

export type StoryAct = 'introduction' | 'rising' | 'climax' | 'resolution';

export interface StoryContext {
  // Persistent Context (never changes)
  campaign: {
    keywords: string[];
    tone: string;
    themes: string[];
    startingLocation: string;
    mode: 'full-random' | 'guided';
  };
  
  // Character Context
  character: {
    name: string;
    class: string;
    level: number;
    backstory: string;
    portraitUrl?: string;
    recentInjuries?: string[];
    recentAchievements?: string[];
  };
  
  // Rolling Context (last 3-5 scenes)
  recentHistory: {
    scene: string;
    choice: string;
    outcome: 'success' | 'failure' | 'critical_success' | 'critical_failure';
    consequences: string;
    keywords: string[];
  }[];
  
  // Current Context
  currentObjective?: string;
  immediateThreats?: string[];
  availableResources?: string[];
  
  // Story Arc Tracking
  storyArc: {
    act: StoryAct;
    mainQuestProgress: number; // 0-100
    sideQuests: string[];
    plotPoints: PlotPoint[];
  };
  
  // Weighted Keywords for Current Generation
  activeKeywords: string[];
}