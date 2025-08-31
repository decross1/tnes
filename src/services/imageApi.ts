import type { 
  PortraitGenerationRequest, 
  PortraitGenerationResponse, 
  ImageGenerationRequest,
  ImageAPIResponse 
} from '../types/api';

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
  private modelsLabApiKey: string;
  private preferredProvider: 'modelslab' | 'dalle';

  constructor() {
    this.openaiApiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    this.modelsLabApiKey = (import.meta as any).env?.VITE_STABILITY_API_KEY || ''; // Note: Models Lab uses the same env var for backward compatibility
    
    // Prefer Models Lab (Stable Diffusion) first, then DALL-E fallback
    this.preferredProvider = this.modelsLabApiKey ? 'modelslab' : 'dalle';
    
    if (!this.openaiApiKey && !this.modelsLabApiKey) {
      console.warn('No image generation API keys found. Set VITE_STABILITY_API_KEY for Models Lab or VITE_OPENAI_API_KEY for DALL-E in your .env file.');
    }
  }

  async generatePortrait(request: PortraitGenerationRequest): Promise<PortraitGenerationResponse> {
    const startTime = Date.now();
    
    try {
      // 🚫 TEMPORARILY DISABLED - Models Lab API to prevent credit usage
      // Uncomment when ready to test with real API calls
      /*
      // Try Models Lab first
      if (this.modelsLabApiKey) {
        try {
          const result = await this.generateWithModelsLab(request);
          return {
            ...result,
            generationTime: Date.now() - startTime,
            provider: 'modelslab'
          };
        } catch (error) {
          console.warn('Models Lab generation failed, trying DALL-E fallback:', error);
        }
      }
      
      // Try DALL-E as fallback
      if (this.openaiApiKey) {
        try {
          const result = await this.generateWithDallE(request.prompt);
          return {
            url: result.url,
            prompt: request.prompt,
            generationTime: Date.now() - startTime,
            provider: 'dalle'
          };
        } catch (error) {
          console.warn('DALL-E generation failed, using fallback:', error);
        }
      }
      */
      
      // Log what would have been sent to Models Lab (for debugging)
      console.log('🎨 WOULD SEND TO MODELS LAB:', {
        prompt: request.prompt,
        characterClass: request.characterClass,
        aspectRatio: request.aspectRatio || '3:4',
        quality: request.quality || 'standard'
      });
      
      // Use fallback portrait (simulating fast generation for testing)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return {
        url: this.generatePlaceholderPortrait(request.characterClass),
        prompt: request.prompt,
        generationTime: Date.now() - startTime,
        provider: 'fallback'
      };
      
    } catch (error) {
      console.error('Portrait generation failed:', error);
      return {
        url: this.generatePlaceholderPortrait(request.characterClass),
        prompt: request.prompt,
        generationTime: Date.now() - startTime,
        provider: 'fallback'
      };
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
    
    // 🚫 TEMPORARILY DISABLED - Models Lab API to prevent credit usage
    /*
    if (this.preferredProvider === 'modelslab' && this.modelsLabApiKey) {
      try {
        const result = await this.generateWithModelsLab({
          prompt,
          characterClass,
          aspectRatio: '3:4',
          quality: 'standard'
        });
        return {
          url: result.url,
          alt_text: `${characterClass} character portrait`,
          revised_prompt: prompt
        };
      } catch (error) {
        console.warn('Models Lab failed, trying DALL-E:', error);
        if (this.openaiApiKey) {
          return await this.generateWithDallE(prompt);
        }
      }
    } else if (this.openaiApiKey) {
      return await this.generateWithDallE(prompt);
    }
    */
    
    // Log what would be generated (for debugging)
    console.log('🖼️ WOULD GENERATE CHARACTER PORTRAIT:', {
      characterName: params.characterName,
      characterClass,
      prompt: prompt
    });
    
    // Return placeholder image
    return {
      url: this.generatePlaceholderPortrait(characterClass),
      alt_text: `${characterClass} character portrait`,
    };
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

  private async generateWithModelsLab(request: PortraitGenerationRequest): Promise<{ url: string; prompt: string }> {
    try {
      const { prompt, aspectRatio = '3:4', quality = 'standard' } = request;
      
      // Models Lab API expects specific format
      const requestBody = {
        key: this.modelsLabApiKey,
        model_id: 'stable-diffusion-xl-base-1.0', // SDXL model for better quality
        prompt: prompt,
        negative_prompt: 'blurry, low quality, distorted, mutated, deformed, text, watermark, signature',
        width: aspectRatio === '3:4' ? 768 : 1024,
        height: aspectRatio === '3:4' ? 1024 : 1024,
        samples: 1,
        num_inference_steps: quality === 'high' ? 50 : 25,
        guidance_scale: 7.5,
        safety_checker: true,
        enhance_prompt: true,
        seed: null,
        webhook: null,
        track_id: null
      };

      const response = await fetch('https://modelslab.com/api/v6/realtime/text2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Models Lab API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`Models Lab generation error: ${data.message || 'Unknown error'}`);
      }

      if (!data.output || !data.output[0]) {
        throw new Error('No image generated by Models Lab');
      }

      return {
        url: data.output[0],
        prompt: data.meta?.prompt || prompt
      };
    } catch (error) {
      console.error('Models Lab generation failed:', error);
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

    const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="${color}" opacity="0.1"/><circle cx="128" cy="100" r="40" fill="${color}" opacity="0.3"/><rect x="88" y="140" width="80" height="80" rx="10" fill="${color}" opacity="0.3"/><text x="128" y="200" text-anchor="middle" font-size="24">[${characterClass[0]}]</text><text x="128" y="235" text-anchor="middle" font-size="12" fill="${color}">${characterClass}</text></svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  async generateSceneImage(sceneDescription: string): Promise<ImageResponse> {
    const prompt = `Fantasy D&D scene, ${sceneDescription}, digital art, epic fantasy setting, detailed environment, atmospheric lighting, high quality, cinematic composition`;
    
    // 🚫 TEMPORARILY DISABLED - Models Lab API to prevent credit usage
    /*
    if (this.preferredProvider === 'modelslab' && this.modelsLabApiKey) {
      try {
        const result = await this.generateWithModelsLab({
          prompt,
          characterClass: 'Fighter', // Default for scene generation
          aspectRatio: '16:9' as any, // Scene images use 16:9
          quality: 'standard'
        });
        return {
          url: result.url,
          alt_text: 'D&D scene illustration',
          revised_prompt: result.prompt
        };
      } catch (error) {
        console.warn('Models Lab scene generation failed, trying DALL-E:', error);
        if (this.openaiApiKey) {
          return await this.generateWithDallE(prompt);
        }
      }
    } else if (this.openaiApiKey) {
      return await this.generateWithDallE(prompt);
    }
    */
    
    console.log('🏞️ WOULD GENERATE SCENE:', { prompt });
    
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

  isConfigured(): boolean {
    return !!(this.openaiApiKey || this.modelsLabApiKey);
  }

  getAvailableProviders(): string[] {
    const providers = [];
    if (this.modelsLabApiKey) providers.push('Models Lab (Stable Diffusion)');
    if (this.openaiApiKey) providers.push('DALL-E 3');
    return providers;
  }

  getPreferredProvider(): 'modelslab' | 'dalle' | 'none' {
    if (this.modelsLabApiKey) return 'modelslab';
    if (this.openaiApiKey) return 'dalle';
    return 'none';
  }
}

export const imageApi = new ImageApiService();