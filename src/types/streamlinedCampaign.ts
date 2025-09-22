// Streamlined Campaign Generation Types
// Simple AI-driven campaign generation with 15 interconnected decisions

export interface CampaignGenerationRequest {
  type: 'keywords' | 'random';
  keywords?: string[];
  characterIntegration: {
    name: string;
    class: string;
    backstory: string;
  };
}

export interface CampaignChoice {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  type: 'exploration' | 'social' | 'combat' | 'tactical';
  abilityCheck?: {
    ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
    dc: number; // 10-20
  };
  consequences: string;
}

export interface CampaignDecision {
  id: number; // 1-15
  title: string;
  scenario: string; // 2-3 sentence scenario description
  choices: CampaignChoice[];
}

export interface CampaignGenerationResult {
  id: string;
  title: string;
  description: string; // 2-3 sentence overview
  setting: string;
  mainGoal: string;
  characterIntegration: {
    name: string;
    class: string;
    backstory: string;
  };
  generationType: 'keywords' | 'random' | 'expansion';
  keywords: string[];
  decisions: CampaignDecision[];
}

export interface CampaignPlayState {
  campaignId: string;
  currentDecision: number; // 1-15
  totalDecisions: number; // Always 15
  decisionHistory: CampaignDecisionResult[];
  isComplete: boolean;
  characterStatus: {
    currentHP: number;
    maxHP: number;
    conditions: string[];
    inventory: string[];
  };
}

export interface CampaignDecisionResult {
  decisionId: number;
  choiceId: string; // 'A', 'B', 'C', 'D'
  choiceText: string;
  abilityCheck?: {
    ability: string;
    dc: number;
    roll: number;
    result: 'success' | 'failure' | 'critical_success' | 'critical_failure';
  };
  consequences: string;
  storyOutcome: string;
  timestamp: Date;
}

export interface CampaignSummary {
  campaignId: string;
  title: string;
  characterName: string;
  completedDecisions: number;
  totalDecisions: number;
  keyEvents: string[];
  finalOutcome?: string;
  playtime: number; // in minutes
  completedAt?: Date;
}

export interface CampaignExpansion {
  id: string;
  parentCampaignId: string;
  title: string;
  description: string;
  decisions: CampaignDecision[];
  prerequisite: {
    campaignCompleted: boolean;
    characterSurvived: boolean;
    minimumChoices: number;
  };
}

// For the gameplay screen
export interface ActiveCampaignState {
  campaign: CampaignGenerationResult;
  playState: CampaignPlayState;
  currentDecision: CampaignDecision;
  availableChoices: CampaignChoice[];
  pendingRoll?: {
    choice: CampaignChoice;
    diceResult?: number;
  };
}

// New types for AI-driven dynamic scenario generation
export type NarrativePhase = 'introduction' | 'exploration' | 'complications' | 'climax' | 'resolution';

export interface StoryContext {
  campaignTitle: string;
  campaignGoal: string;
  setting: string;
  keywords: string[];
  currentLocation?: string;
  allies: string[];
  enemies: string[];
  currentObjectives: string[];
  characterCondition: string; // e.g., "healthy", "wounded", "exhausted"
  inventory: string[];
  reputation?: string; // e.g., "heroic", "cunning", "diplomatic"
}

export interface DecisionSummary {
  decisionNumber: number;
  title: string;
  choiceMade: string;
  outcome: 'success' | 'failure' | 'critical_success' | 'critical_failure' | 'no_roll';
  consequences: string;
  storyImpact: string; // Brief description of how this affected the story
}

export interface NextScenarioRequest {
  character: {
    name: string;
    class: string;
    backstory: string;
    level: number;
  };
  decisionNumber: number; // 1-15
  narrativePhase: NarrativePhase;
  storyContext: StoryContext;
  recentDecisions: DecisionSummary[]; // Last 3-5 decisions for immediate context
  keyEvents: string[]; // Major story beats to maintain continuity
}

export interface NextScenarioResponse {
  decision: CampaignDecision;
  updatedStoryContext: Partial<StoryContext>; // Any changes to story state
  narrativeHints?: string[]; // Hints for future story development
}