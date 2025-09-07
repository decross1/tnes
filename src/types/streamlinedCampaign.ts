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