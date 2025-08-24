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