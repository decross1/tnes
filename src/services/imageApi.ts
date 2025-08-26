export interface ImageGenerationParams {
  prompt: string;
  style?: 'fantasy' | 'realistic' | 'artistic';
  aspectRatio?: '1:1' | '16:9' | '4:3';
  size?: 'small' | 'medium' | 'large';
}

export interface ImageResponse {
  url: string;
  alt_text: string;
  revised_prompt?: string;
}

export interface ImageError {
  message: string;
  code: string;
  status: number;
}

class ImageApiService {
  private openaiApiKey: string;
  private stabilityApiKey: string;
  private preferredProvider: 'dalle' | 'stability';

  constructor() {
    this.openaiApiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    this.stabilityApiKey = (import.meta as any).env?.VITE_STABILITY_API_KEY || '';
    
    // Prefer DALL-E if available, fallback to Stability AI
    this.preferredProvider = this.openaiApiKey ? 'dalle' : 'stability';
    
    if (!this.openaiApiKey && !this.stabilityApiKey) {
      console.warn('No image generation API keys found. Set VITE_OPENAI_API_KEY or VITE_STABILITY_API_KEY in your .env file.');
    }
  }

  async generateCharacterPortrait(params: {
    characterName: string;
    characterClass: string;
    backstory: string;
    gender?: string;
    race?: string;
  }): Promise<ImageResponse> {
    const { characterName, characterClass, backstory, gender = 'any', race = 'human' } = params;

    const prompt = this.buildPortraitPrompt(characterClass, backstory, gender, race);
    
    if (this.preferredProvider === 'dalle' && this.openaiApiKey) {
      return await this.generateWithDallE(prompt);
    } else if (this.stabilityApiKey) {
      return await this.generateWithStability(prompt);
    } else {
      // Return placeholder image
      return {
        url: this.generatePlaceholderPortrait(characterClass),
        alt_text: `${characterClass} character portrait`,
      };
    }
  }

  private buildPortraitPrompt(characterClass: string, backstory: string, gender: string, race: string): string {
    // Extract key visual elements from backstory
    const backstoryContext = backstory.substring(0, 200);
    
    const basePrompt = `Fantasy D&D character portrait, ${race} ${characterClass}`;
    const styleGuide = `digital art, detailed face and upper body, epic fantasy setting, dramatic lighting, high quality`;
    const classSpecificDetails = this.getClassVisualDetails(characterClass);
    
    return `${basePrompt}, ${classSpecificDetails}, ${styleGuide}, character inspired by: ${backstoryContext}`;
  }

  private getClassVisualDetails(characterClass: string): string {
    const details = {
      Fighter: 'wearing armor, holding weapon, battle-scarred, determined expression, martial bearing',
      Rogue: 'dark clothing, hood or cloak, daggers, cunning expression, shadowy atmosphere',
      Wizard: 'robes, staff or spellbook, arcane symbols, wise expression, magical aura',
      Cleric: 'holy symbol, divine light, serene expression, blessed aura, religious vestments'
    };
    
    return details[characterClass as keyof typeof details] || details.Fighter;
  }

  private async generateWithDallE(prompt: string): Promise<ImageResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DALL-E API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0];

      return {
        url: imageData.url,
        alt_text: 'D&D character portrait',
        revised_prompt: imageData.revised_prompt
      };
    } catch (error) {
      console.error('DALL-E generation failed:', error);
      throw error;
    }
  }

  private async generateWithStability(prompt: string): Promise<ImageResponse> {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('output_format', 'png');
      formData.append('aspect_ratio', '1:1');
      formData.append('model', 'sd3-large');

      const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stabilityApiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Stability API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      return {
        url: imageUrl,
        alt_text: 'D&D character portrait'
      };
    } catch (error) {
      console.error('Stability AI generation failed:', error);
      throw error;
    }
  }

  private generatePlaceholderPortrait(characterClass: string): string {
    // Generate a simple SVG placeholder based on class
    const colors = {
      Fighter: '#8B0000',
      Rogue: '#2F4F4F', 
      Wizard: '#4B0082',
      Cleric: '#FFD700'
    };

    const icons = {
      Fighter: '⚔️',
      Rogue: '🗡️',
      Wizard: '🔮',
      Cleric: '✨'
    };

    const color = colors[characterClass as keyof typeof colors] || colors.Fighter;
    const icon = icons[characterClass as keyof typeof icons] || icons.Fighter;

    const svg = `
      <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" fill="${color}" opacity="0.1"/>
        <circle cx="128" cy="100" r="40" fill="${color}" opacity="0.3"/>
        <rect x="88" y="140" width="80" height="80" rx="10" fill="${color}" opacity="0.3"/>
        <text x="128" y="200" text-anchor="middle" font-size="32">${icon}</text>
        <text x="128" y="235" text-anchor="middle" font-size="14" fill="${color}">${characterClass}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  async generateSceneImage(sceneDescription: string): Promise<ImageResponse> {
    const prompt = `Fantasy D&D scene, ${sceneDescription}, digital art, epic fantasy setting, detailed environment, atmospheric lighting, high quality, cinematic composition`;
    
    if (this.preferredProvider === 'dalle' && this.openaiApiKey) {
      return await this.generateWithDallE(prompt);
    } else if (this.stabilityApiKey) {
      return await this.generateWithStability(prompt);
    } else {
      // Return placeholder scene
      return {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="512" height="256" viewBox="0 0 512 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="256" fill="#2F4F4F"/>
            <text x="256" y="128" text-anchor="middle" font-size="24" fill="white">Scene Image</text>
          </svg>
        `),
        alt_text: 'D&D scene illustration'
      };
    }
  }

  isConfigured(): boolean {
    return !!(this.openaiApiKey || this.stabilityApiKey);
  }

  getAvailableProviders(): string[] {
    const providers = [];
    if (this.openaiApiKey) providers.push('DALL-E 3');
    if (this.stabilityApiKey) providers.push('Stable Diffusion');
    return providers;
  }
}

export const imageApi = new ImageApiService();