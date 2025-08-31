export interface ClaudeAPIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ImageAPIResponse {
  url: string;
  alt_text?: string;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
}

export interface SceneGenerationRequest {
  context: import('./game').SceneContext;
  previousChoice?: string;
  rollResult?: import('./game').DiceRoll;
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'fantasy' | 'realistic' | 'artistic';
  aspectRatio?: '16:9' | '1:1' | '4:3';
}

// Portrait Generation Types
export interface PortraitPromptRequest {
  characterClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  userKeywords: string[];
  backstoryContent?: string;
  campaignTone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
}

export interface PortraitPromptResponse {
  prompt: string;
  processedKeywords: string[];
  confidence: number;
}

export interface PortraitGenerationRequest {
  prompt: string;
  characterClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  aspectRatio?: '3:4' | '1:1';
  quality?: 'standard' | 'high';
}

export interface PortraitGenerationResponse {
  url: string;
  prompt: string;
  generationTime: number;
  provider: 'modelslab' | 'dalle' | 'fallback';
}

// Character Background Generation Types
export interface BackstoryGenerationRequest {
  characterClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  method: 'full' | 'keywords' | 'class-based';
  keywords?: string[];
  campaignTone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
  wordLimit?: number;
}

export interface BackstoryGenerationResponse {
  backstory: string;
  extractedTraits: string[];
  wordCount: number;
  confidence: number;
}