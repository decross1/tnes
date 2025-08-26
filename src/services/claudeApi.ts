export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeError {
  message: string;
  code: string;
  status: number;
}

class ClaudeApiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com';

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_CLAUDE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Claude API key not found. Set VITE_CLAUDE_API_KEY in your .env file.');
    }
  }

  private async makeRequest(prompt: string, options: {
    maxTokens?: number;
    temperature?: number;
    system?: string;
  } = {}): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      throw new Error('Claude API key is not configured');
    }

    const requestBody = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.8,
      system: options.system || 'You are a helpful D&D dungeon master creating engaging fantasy content.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        content: data.content[0]?.text || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('Claude API request failed:', error);
      throw error;
    }
  }

  async generateCharacterBackstory(params: {
    characterName: string;
    characterClass: string;
    keywords?: string[];
    method: 'full' | 'keywords' | 'class-based';
  }): Promise<string> {
    const { characterName, characterClass, keywords = [], method } = params;

    let prompt = '';
    let systemPrompt = 'You are a creative D&D dungeon master. Create compelling character backstories that include mystery, motivation, and adventure hooks. Write in second person perspective and keep under 200 words.';

    switch (method) {
      case 'full':
        prompt = `Create a unique and compelling backstory for a ${characterClass} named ${characterName}.

Include:
- Their origin and background
- What motivates them to adventure
- A secret or mystery from their past
- Why they left their previous life behind

Make it mysterious and engaging with hooks for future adventures. Write in second person ("You were born...").`;
        break;

      case 'keywords':
        prompt = `Create a compelling D&D character backstory for a ${characterClass} named ${characterName}.

Incorporate these elements naturally into the story: ${keywords.join(', ')}

Include:
- Origin that connects to the keywords
- Motivation for adventuring
- A secret or mystery
- Adventure hooks

Write in second person perspective ("You grew up..."). Keep under 200 words and make it mysterious and engaging.`;
        break;

      case 'class-based':
        prompt = `Create a classic backstory for a ${characterClass} named ${characterName}.

Focus on typical ${characterClass} origins and motivations:
- What led them to become a ${characterClass}
- Their training or awakening to their abilities  
- Why they're now adventuring
- A personal goal or quest

Write in second person perspective and keep under 200 words.`;
        break;
    }

    try {
      const response = await this.makeRequest(prompt, {
        maxTokens: 300,
        temperature: 0.85,
        system: systemPrompt
      });

      return response.content.trim();
    } catch (error) {
      console.error('Failed to generate backstory:', error);
      // Return fallback backstory
      return this.getFallbackBackstory(characterClass, characterName);
    }
  }

  async generateSceneContent(params: {
    context: any;
    previousChoice?: string;
    rollResult?: any;
  }): Promise<{
    scene: string;
    choices: Array<{
      text: string;
      ability: string;
      dc: number;
      advantage?: boolean;
      successHint?: string;
      failureHint?: string;
    }>;
    imageDescription: string;
  }> {
    // TODO: Implement scene generation
    // This will be implemented in the next phase
    throw new Error('Scene generation not yet implemented');
  }

  private getFallbackBackstory(characterClass: string, characterName: string): string {
    const fallbacks = {
      Fighter: `You are ${characterName}, a seasoned warrior who learned to fight in the brutal conflicts of the borderlands. Your skill with blade and shield was forged in countless skirmishes, but a personal tragedy drove you to seek purpose beyond mere warfare. Now you wander the realm, your sword ready to defend the innocent and your heart yearning for a cause worth fighting for. The scars you bear tell stories of battles won and comrades lost.`,
      
      Rogue: `You are ${characterName}, a child of the shadows who learned early that survival required cunning over strength. The streets taught you to be quick with your fingers and quicker with your wit. A betrayal by someone you trusted left you wary of others, but also gave you the skills to move unseen through the world. Now you seek fortune and perhaps redemption, though you're not sure which matters more.`,
      
      Wizard: `You are ${characterName}, a seeker of arcane knowledge who discovered your magical abilities through years of dedicated study. Your apprenticeship was cut short by mysterious circumstances, leaving you with incomplete training but an insatiable hunger for magical secrets. Ancient tomes call to you, and you sense that your destiny is tied to powers beyond mortal understanding.`,
      
      Cleric: `You are ${characterName}, chosen by divine forces to serve as their instrument in the mortal realm. Your faith was tested by a crisis that shook your very foundations, but emerging from that trial only strengthened your resolve. Now you carry both blessing and burden, knowing that your deity has plans for you that you cannot yet fully comprehend.`
    };

    return fallbacks[characterClass as keyof typeof fallbacks] || fallbacks.Fighter;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const claudeApi = new ClaudeApiService();