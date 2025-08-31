import type { 
  BackstoryGenerationRequest, 
  BackstoryGenerationResponse,
  PortraitPromptRequest,
  PortraitPromptResponse 
} from '../types/api';

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

  async generateCharacterBackstory(request: BackstoryGenerationRequest): Promise<BackstoryGenerationResponse> {
    const { characterName, characterClass, keywords = [], method, campaignTone, wordLimit = 200 } = request;

    let prompt = '';
    let systemPrompt = `You are a creative D&D dungeon master. Create compelling character backstories that include mystery, motivation, and adventure hooks. Write in second person perspective and keep under ${wordLimit} words.${campaignTone ? ` The tone should be ${campaignTone}.` : ''}`;

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

Write in second person perspective ("You grew up..."). Keep under ${wordLimit} words and make it mysterious and engaging.`;
        break;

      case 'class-based':
        prompt = `Create a classic backstory for a ${characterClass} named ${characterName}.

Focus on typical ${characterClass} origins and motivations:
- What led them to become a ${characterClass}
- Their training or awakening to their abilities  
- Why they're now adventuring
- A personal goal or quest

Write in second person perspective and keep under ${wordLimit} words.`;
        break;
    }

    try {
      const response = await this.makeRequest(prompt, {
        maxTokens: Math.ceil(wordLimit * 1.5), // Allow some buffer for generation
        temperature: 0.85,
        system: systemPrompt
      });

      const backstory = response.content.trim();
      const wordCount = backstory.split(/\s+/).length;
      
      // Extract key traits/themes from the backstory for future use
      const extractedTraits = this.extractTraitsFromBackstory(backstory, characterClass);

      return {
        backstory,
        extractedTraits,
        wordCount,
        confidence: 0.9 // High confidence for successful API response
      };
    } catch (error) {
      console.error('Failed to generate backstory:', error);
      // Return fallback backstory
      const fallbackBackstory = this.getFallbackBackstory(characterClass, characterName);
      return {
        backstory: fallbackBackstory,
        extractedTraits: this.extractTraitsFromBackstory(fallbackBackstory, characterClass),
        wordCount: fallbackBackstory.split(/\s+/).length,
        confidence: 0.3 // Lower confidence for fallback
      };
    }
  }

  async generatePortraitPrompt(request: PortraitPromptRequest): Promise<PortraitPromptResponse> {
    const { characterClass, characterName, userKeywords, backstoryContent, campaignTone } = request;

    const systemPrompt = `You are an expert at creating detailed visual descriptions for fantasy character portraits. Generate a Stable Diffusion prompt that will create a high-quality D&D character portrait. Focus on visual details that can be rendered well by AI image generators.`;

    const backstoryHints = backstoryContent ? backstoryContent.substring(0, 150) + '...' : '';
    const keywordList = userKeywords.join(', ');
    
    const prompt = `Create a detailed visual description for a fantasy character portrait suitable for Stable Diffusion.

Character: ${characterName}, a ${characterClass}
User-provided visual descriptors: ${keywordList}
${backstoryHints ? `Backstory context: ${backstoryHints}` : ''}
${campaignTone ? `Campaign tone: ${campaignTone}` : ''}

Generate a Stable Diffusion prompt that:
1. Incorporates all user keywords naturally into the visual description
2. Includes appropriate ${characterClass}-specific visual elements (equipment, stance, etc.)
3. Maintains D&D fantasy aesthetic
4. Suggests appropriate pose and facial expression
5. Specifies art style: "fantasy art, detailed digital painting, character portrait"
6. Uses proper Stable Diffusion formatting and keywords

Requirements:
- 3:4 portrait aspect ratio
- Focus on upper body and face
- High quality, detailed rendering
- Fantasy/medieval setting appropriate

Output only the optimized Stable Diffusion prompt, no explanations or additional text.`;

    try {
      const response = await this.makeRequest(prompt, {
        maxTokens: 200,
        temperature: 0.7, // Lower temperature for more consistent prompt structure
        system: systemPrompt
      });

      const generatedPrompt = response.content.trim();
      
      // Process keywords to ensure they're incorporated
      const processedKeywords = this.validateKeywordIncorporation(userKeywords, generatedPrompt);
      
      return {
        prompt: generatedPrompt,
        processedKeywords,
        confidence: processedKeywords.length / userKeywords.length // Confidence based on keyword incorporation
      };
    } catch (error) {
      console.error('Failed to generate portrait prompt:', error);
      // Return fallback prompt
      return this.getFallbackPortraitPrompt(characterClass, characterName, userKeywords);
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

  private extractTraitsFromBackstory(backstory: string, characterClass: string): string[] {
    // Simple extraction of key themes/traits from backstory
    const traits: string[] = [];
    
    // Look for common character traits and themes
    const traitPatterns = [
      /\b(brave|courageous|fearless|bold)\b/i,
      /\b(mysterious|secretive|hidden|unknown)\b/i,
      /\b(loyal|faithful|devoted|dedicated)\b/i,
      /\b(skilled|expert|master|talented)\b/i,
      /\b(tragic|loss|betrayal|pain)\b/i,
      /\b(noble|honor|justice|righteous)\b/i,
      /\b(cunning|clever|smart|wise)\b/i,
      /\b(outcast|exile|wanderer|loner)\b/i
    ];
    
    traitPatterns.forEach(pattern => {
      const match = backstory.match(pattern);
      if (match) {
        traits.push(match[1].toLowerCase());
      }
    });
    
    // Add class-specific default traits if none found
    if (traits.length === 0) {
      const classTraits = {
        Fighter: ['brave', 'skilled'],
        Rogue: ['cunning', 'secretive'], 
        Wizard: ['wise', 'mysterious'],
        Cleric: ['faithful', 'righteous']
      };
      traits.push(...(classTraits[characterClass as keyof typeof classTraits] || ['determined']));
    }
    
    return traits.slice(0, 5); // Limit to 5 traits
  }

  private validateKeywordIncorporation(userKeywords: string[], generatedPrompt: string): string[] {
    const incorporated: string[] = [];
    
    userKeywords.forEach(keyword => {
      // Check if keyword or similar concept is included in the prompt
      if (generatedPrompt.toLowerCase().includes(keyword.toLowerCase())) {
        incorporated.push(keyword);
      }
    });
    
    return incorporated;
  }

  private getFallbackPortraitPrompt(characterClass: string, characterName: string, userKeywords: string[]): PortraitPromptResponse {
    const classDescriptors = {
      Fighter: "armored warrior, sword and shield, battle-ready stance, determined expression",
      Rogue: "leather armor, daggers, hooded cloak, shadowy appearance, cunning eyes", 
      Wizard: "robes, staff or spellbook, arcane symbols, wise expression, magical aura",
      Cleric: "holy symbols, divine armor, blessed weapon, serene expression, divine light"
    };
    
    const basePrompt = classDescriptors[characterClass as keyof typeof classDescriptors] || classDescriptors.Fighter;
    const keywordString = userKeywords.join(', ');
    
    const fallbackPrompt = `fantasy art, detailed digital painting, character portrait of ${characterName}, ${characterClass}, ${basePrompt}${keywordString ? ', ' + keywordString : ''}, upper body, 3:4 aspect ratio, high quality, detailed rendering, fantasy setting`;
    
    return {
      prompt: fallbackPrompt,
      processedKeywords: userKeywords, // Assume all keywords are incorporated in fallback
      confidence: 0.5 // Medium confidence for fallback
    };
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const claudeApi = new ClaudeApiService();