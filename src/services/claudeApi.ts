import type { 
  BackstoryGenerationRequest, 
  BackstoryGenerationResponse,
  PortraitPromptRequest,
  PortraitPromptResponse 
} from '../types/api';
import type {
  CampaignGenerationRequest,
  CampaignGenerationResult,
  CampaignDecision,
  CampaignPlayState
} from '../types/streamlinedCampaign';

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

    console.log('🔗 Using backend proxy for Claude API...');
    console.log('📡 Proxy endpoint: http://localhost:3001/api/claude/messages');

    try {
      const response = await fetch('http://localhost:3001/api/claude/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend proxy error:', response.status, errorData);
        throw new Error(`Backend proxy error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ Claude API response received through proxy');
      
      return {
        content: data.content[0]?.text || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('❌ Claude API request failed through proxy:', error);
      
      // Check if backend is running
      if (error instanceof Error && error.message.includes('fetch')) {
        console.error('🚨 Backend proxy appears to be down!');
        console.error('💡 Start backend: cd server && npm run dev');
        throw new Error('Backend proxy server is not running. Please start: cd server && npm run dev');
      }
      
      throw error;
    }
  }

  /**
   * 🧪 ENHANCED MOCK RESPONSE GENERATOR
   * Analyzes the real prompt structure and generates contextually appropriate responses
   */
  private generateEnhancedMockResponse(prompt: string, options: any): ClaudeResponse {
    console.log('🔍 ANALYZING PROMPT STRUCTURE FOR MOCK RESPONSE...');
    
    // Extract key information from the structured prompt
    const characterMatch = prompt.match(/for (\w+), a (\w+)/);
    const characterName = characterMatch ? characterMatch[1] : 'the adventurer';
    const characterClass = characterMatch ? characterMatch[2] : 'hero';
    
    // Extract keywords if present
    const keywordSection = prompt.match(/🎯 REQUIRED ELEMENTS TO WEAVE INTO THE STORY:\n(.*?)(?=\n\n📖|$)/s);
    const keywords = keywordSection ? 
      keywordSection[1].split('\n').map(line => line.replace('• ', '').trim()).filter(Boolean) : [];
    
    console.log('📊 EXTRACTED PROMPT DATA:', {
      characterName,
      characterClass,
      keywords,
      promptType: keywords.length > 0 ? 'keyword-driven' : 'open-ended',
      promptLength: prompt.length
    });

    // Generate appropriate mock backstory
    let mockBackstory = '';
    
    if (keywords.length > 0) {
      mockBackstory = this.generateKeywordContextualBackstory(characterName, characterClass, keywords);
    } else if (prompt.includes('classic') || prompt.includes('archetype')) {
      mockBackstory = this.generateClassBasedBackstory(characterName, characterClass);
    } else {
      mockBackstory = this.generateOpenEndedBackstory(characterName, characterClass);
    }

    console.log('✅ MOCK RESPONSE GENERATED:', {
      wordCount: mockBackstory.split(/\s+/).length,
      keywordsIncorporated: keywords.filter(k => mockBackstory.toLowerCase().includes(k.toLowerCase())).length,
      totalKeywords: keywords.length
    });

    return {
      content: mockBackstory,
      usage: {
        input_tokens: prompt.length,
        output_tokens: mockBackstory.length
      }
    };
  }

  private generateKeywordContextualBackstory(name: string, characterClass: string, keywords: string[]): string {
    // Create a backstory that weaves in the actual keywords provided
    const keywordLower = keywords.map(k => k.toLowerCase());
    
    const openingTemplate = `You are ${name}, a ${characterClass} whose life has been forever marked by extraordinary circumstances.`;
    
    let backstoryParts = [openingTemplate];
    
    // Handle revenge keyword
    if (keywordLower.includes('revenge')) {
      backstoryParts.push(`A burning desire for revenge drives every decision you make.`);
    }
    
    // Handle artifact keyword  
    if (keywordLower.includes('artifact')) {
      backstoryParts.push(`An ancient artifact came into your possession under mysterious circumstances, its power both blessing and curse.`);
    }
    
    // Handle lost twin keyword
    if (keywordLower.includes('lost twin')) {
      backstoryParts.push(`Your twin sibling vanished without a trace, leaving behind only questions and a desperate need to uncover the truth.`);
    }
    
    // Handle cyborg keyword
    if (keywordLower.includes('cyborg')) {
      backstoryParts.push(`The mechanical augmentations that replaced parts of your body serve as constant reminders of a traumatic past.`);
    }
    
    // Handle two toned hair keyword
    if (keywordLower.includes('two toned hair')) {
      backstoryParts.push(`Your distinctive two-toned hair marks you as different, a visible sign of the magical forces that shaped your destiny.`);
    }
    
    // Add generic keywords
    const remainingKeywords = keywords.filter(k => 
      !['revenge', 'artifact', 'lost twin', 'cyborg', 'two toned hair'].includes(k.toLowerCase())
    );
    
    if (remainingKeywords.length > 0) {
      backstoryParts.push(`The elements of ${remainingKeywords.slice(0,2).join(' and ')} played crucial roles in shaping who you became.`);
    }
    
    // Add class-specific motivation
    const classMotivations = {
      Cleric: `Your faith was tested by these trials, but emerging stronger, you now serve as a divine instrument seeking both redemption and justice.`,
      Fighter: `These experiences forged you into a formidable warrior, your skills honed by necessity and your resolve unbreakable.`,
      Wizard: `Through study and determination, you've learned to harness arcane forces, using knowledge as both weapon and shield.`,
      Rogue: `The shadows became your allies, teaching you that sometimes the most direct path isn't the wisest one.`
    };
    
    backstoryParts.push(classMotivations[characterClass as keyof typeof classMotivations] || 
      `Your journey as a ${characterClass} began from these formative experiences, shaping your skills and worldview.`);
    
    backstoryParts.push(`Now you venture forth, knowing that your past holds keys to mysteries yet unsolved, and that your unique combination of experiences makes you both powerful and dangerous to those who would oppose you.`);
    
    return backstoryParts.join(' ');
  }

  private generateClassBasedBackstory(name: string, characterClass: string): string {
    const classBackstories = {
      Fighter: `You are ${name}, forged in the crucible of countless battles. Your sword arm has known both victory and defeat, and scars tell the story of lessons learned the hard way.`,
      Wizard: `You are ${name}, a scholar of the arcane arts whose thirst for knowledge knows no bounds. Your studies were interrupted by mysterious circumstances.`,
      Rogue: `You are ${name}, a shadow walker who learned that survival requires more than quick hands and quicker wit.`,
      Cleric: `You are ${name}, chosen by divine forces to serve as their instrument in mortal affairs. Your faith was tested by crisis but emerged stronger.`
    };
    
    return classBackstories[characterClass as keyof typeof classBackstories] || 
           `You are ${name}, a ${characterClass} with a mysterious past and an uncertain future.`;
  }

  private generateOpenEndedBackstory(name: string, characterClass: string): string {
    return `You are ${name}, a ${characterClass} whose past is shrouded in mystery. The path that led you to adventure began with a single, life-changing moment that you can never forget. Now you seek answers to questions that haunt your dreams, carrying secrets that could change the world if discovered. Your skills as a ${characterClass} serve you well, but they are merely tools in service of a greater purpose that you are only beginning to understand.`;
  }

  private generateMockKeywordBackstory(keywords: string, fullPrompt: string): string {
    // Extract character name and class from prompt
    const nameMatch = fullPrompt.match(/for a (\w+) named (\w+)/);
    const characterClass = nameMatch ? nameMatch[1] : 'adventurer';
    const characterName = nameMatch ? nameMatch[2] : 'the hero';
    
    // Parse the actual keywords from the extracted string
    const keywordArray = keywords.split(',').map(k => k.trim());
    
    console.log('🔍 Mock generation using keywords:', keywordArray);
    
    // Generate backstory that actually incorporates the user's keywords
    if (keywordArray.includes('plant') || keywordArray.includes('flower') || keywordArray.includes('tropical')) {
      // Tropical/plant themed backstory
      return `You are ${characterName}, a ${characterClass} who grew up in the verdant rainforests of the distant tropics. The constant sound of rain on broad leaves was your childhood lullaby, while flowering vines and exotic plants became your closest companions.

Your unusual bond with nature began when you discovered a rare flower that bloomed only during storms. This plant revealed to you the secret paths through the jungle canopy, where you learned to move as silently as the morning mist. Even the native koala-like creatures accepted you as one of their own, teaching you their ancient wisdom.

But when outsiders came to exploit your tropical homeland, burning the sacred groves and capturing the peaceful creatures, you were forced to flee. Now you carry seeds from your lost paradise, hoping to find a new place where the old magic can take root. The rain still calls to you, whispering of secrets yet to be discovered.

Your quest is to protect what remains of the natural world, using skills learned in paradise lost.`;
    } else if (keywordArray.some(k => ['pirate', 'submarine', 'sea'].includes(k.toLowerCase()))) {
      // Maritime themed backstory  
      return `You are ${characterName}, a ${characterClass} whose life has been shaped by the endless ocean. Your adventures began aboard vessels that sailed both above and beneath the waves, learning secrets that few surface dwellers could imagine.

Your distinctive appearance and unwavering loyalty earned you respect among crews who valued skill over convention. The submarine's captain became your mentor, teaching you arts both arcane and practical in the depths where sunlight never reaches.

But betrayal struck when you discovered your crew planned to use ancient artifacts for dark purposes. The vessel's destruction left you stranded, carrying only your hard-won knowledge and a burning need to prevent the awakening of things better left sleeping.

Now you walk the surface world, your past making you both valuable and hunted. The artifacts you guard are sought by many, and your distinctive features make hiding nearly impossible.

Your quest for justice has only just begun.`;
    } else {
      // Generic keyword-incorporating backstory
      return `You are ${characterName}, a ${characterClass} whose past is intertwined with elements that others might consider ordinary: ${keywordArray.slice(0, 3).join(', ')}. But in your hands, these seemingly simple things became the foundation of extraordinary abilities.

Your training began in an unexpected place, where you learned that true power comes not from grand gestures but from understanding the subtle connections between all things. The ${keywordArray[0] || 'mysterious element'} that others overlooked became your greatest strength.

A secret from your past involves ${keywordArray[1] || 'an ancient mystery'}, something that changed your understanding of the world forever. When danger threatened everything you held dear, you were forced to leave behind the life you knew and venture into the unknown.

Now you carry both burden and blessing, knowing that your unique knowledge makes you valuable to some and dangerous to others. Your quest is to find a place where your abilities can serve a greater purpose.

The adventure that awaits will test everything you've learned.`;
    }
  }

  private generateMockGenericBackstory(fullPrompt: string): string {
    const nameMatch = fullPrompt.match(/for a (\w+) named (\w+)/);
    const characterClass = nameMatch ? nameMatch[1] : 'adventurer';
    const characterName = nameMatch ? nameMatch[2] : 'the hero';
    
    const classBackstories = {
      Fighter: `You are ${characterName}, forged in the crucible of countless battles. Your sword arm has known both victory and defeat, and scars tell the story of lessons learned the hard way. A personal tragedy drove you from your homeland, and now you seek redemption through acts of heroism. Ancient enemies still pursue you, and only by growing stronger can you hope to face the darkness of your past.`,
      
      Wizard: `You are ${characterName}, a scholar of the arcane arts whose thirst for knowledge knows no bounds. Your studies were interrupted by a mysterious event that left gaps in your memory - and in your spellbook. Ancient magical energies call to you from forgotten ruins and dusty tomes. Someone or something wants to prevent you from recovering your lost knowledge, making your quest for truth increasingly dangerous.`,
      
      Rogue: `You are ${characterName}, a shadow walker who learned that survival requires more than quick hands and quicker wit. A betrayal by someone you trusted left you questioning everything you thought you knew about loyalty. Now you work alone, taking jobs that others won't touch. But your past catches up in unexpected ways, and some debts can only be paid in blood.`,
      
      Cleric: `You are ${characterName}, chosen by divine forces to serve as their instrument in mortal affairs. Your faith was tested by a crisis that shook the very foundations of your beliefs, but emerging from that trial only strengthened your resolve. Divine visions guide your path, but interpreting them correctly means the difference between salvation and catastrophe.`
    };
    
    return classBackstories[characterClass as keyof typeof classBackstories] || classBackstories.Fighter;
  }

  async generateCharacterBackstory(request: BackstoryGenerationRequest): Promise<BackstoryGenerationResponse> {
    const { characterName, characterClass, keywords = [], method, campaignTone, wordLimit = 200 } = request;

    // 🚨 CONDITIONAL API CALLING: Don't call Claude for custom-write method
    if (method === 'custom-write') {
      console.log('💬 CUSTOM BACKSTORY: Skipping Claude API call - user wrote their own backstory');
      return {
        backstory: '', // Will be filled by user content
        extractedTraits: [],
        wordCount: 0,
        confidence: 1.0 // Perfect confidence for user-written content
      };
    }

    // 📋 DYNAMIC PROMPT STRUCTURE BUILDING
    const promptBuilder = this.buildDynamicPrompt({
      characterName,
      characterClass, 
      keywords,
      method,
      campaignTone,
      wordLimit
    });

    console.group('🏗️ === DYNAMIC PROMPT CONSTRUCTION ===');
    console.log('📊 Prompt Configuration:', {
      method,
      hasKeywords: keywords.length > 0,
      keywordCount: keywords.length,
      hasCampaignTone: !!campaignTone,
      wordLimit
    });
    console.groupEnd();

    try {
      // 📋 DETAILED WORKFLOW LOGGING
      console.group('🎭 === BACKSTORY GENERATION WORKFLOW ===');
      
      console.log('📝 1. INPUT PARAMETERS:', {
        characterName,
        characterClass,
        method,
        keywords: keywords || [],
        campaignTone: campaignTone || 'none',
        wordLimit
      });

      console.log('🤖 2. CLAUDE API REQUEST STRUCTURE:', {
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: Math.ceil(wordLimit * 1.5),
        temperature: 0.85,
        systemPrompt: promptBuilder.systemPrompt,
        userPrompt: promptBuilder.userPrompt
      });

      console.log('🔍 3. KEYWORD INTEGRATION:', {
        keywordsUsed: keywords,
        keywordIntegrationStrategy: method === 'keywords' ? 'direct-incorporation' : 'contextual-influence',
        promptStructure: promptBuilder.structure
      });

      const response = await this.makeRequest(promptBuilder.userPrompt, {
        maxTokens: Math.ceil(wordLimit * 1.5), // Allow some buffer for generation
        temperature: 0.85,
        system: promptBuilder.systemPrompt
      });

      const backstory = response.content.trim();
      const wordCount = backstory.split(/\s+/).length;
      
      // Extract key traits/themes from the backstory for future use
      const extractedTraits = this.extractTraitsFromBackstory(backstory, characterClass);

      console.log('📖 3. CLAUDE API RESPONSE:', {
        backstory,
        wordCount,
        usage: response.usage
      });

      console.log('🏷️ 4. EXTRACTED TRAITS:', {
        traits: extractedTraits,
        count: extractedTraits.length
      });

      const result = {
        backstory,
        extractedTraits,
        wordCount,
        confidence: 0.9 // High confidence for successful API response
      };

      console.log('✅ 5. FINAL BACKSTORY RESULT:', result);
      console.groupEnd();

      return result;
    } catch (error) {
      console.error('❌ Failed to generate backstory:', error);
      // Return fallback backstory
      const fallbackBackstory = this.getFallbackBackstory(characterClass, characterName);
      console.log('🔄 Using Fallback Backstory:', {
        characterClass,
        characterName,
        fallbackBackstory,
        confidence: 0.3
      });
      return {
        backstory: fallbackBackstory,
        extractedTraits: this.extractTraitsFromBackstory(fallbackBackstory, characterClass),
        wordCount: fallbackBackstory.split(/\s+/).length,
        confidence: 0.3 // Lower confidence for fallback
      };
    }
  }

  /**
   * 🏗️ DYNAMIC PROMPT BUILDER
   * Creates context-aware prompts based on user input method and available data
   */
  private buildDynamicPrompt(params: {
    characterName: string;
    characterClass: string;
    keywords: string[];
    method: string;
    campaignTone?: string;
    wordLimit: number;
  }) {
    const { characterName, characterClass, keywords, method, campaignTone, wordLimit } = params;

    // Base system prompt with dynamic tone integration
    const systemPrompt = [
      'You are a master D&D dungeon master and storyteller.',
      'Create compelling character backstories with mystery, motivation, and adventure hooks.',
      'Write in second person perspective ("You are/were...").',
      `Keep responses under ${wordLimit} words.`,
      campaignTone ? `Maintain a ${campaignTone} tone throughout.` : '',
      'Focus on creating hooks that can drive future adventures and character development.'
    ].filter(Boolean).join(' ');

    let userPrompt = '';
    let structure = '';

    switch (method) {
      case 'keywords':
        structure = 'keyword-driven-narrative';
        userPrompt = this.buildKeywordDrivenPrompt(characterName, characterClass, keywords, wordLimit);
        break;

      case 'full':
        structure = 'open-ended-generation';  
        userPrompt = this.buildFullGenerationPrompt(characterName, characterClass, wordLimit);
        break;

      case 'class-based':
        structure = 'archetype-focused';
        userPrompt = this.buildClassBasedPrompt(characterName, characterClass, wordLimit);
        break;

      case 'skip':
        structure = 'minimal-default';
        userPrompt = this.buildMinimalPrompt(characterName, characterClass);
        break;

      default:
        structure = 'fallback';
        userPrompt = this.buildFullGenerationPrompt(characterName, characterClass, wordLimit);
    }

    return {
      systemPrompt,
      userPrompt,
      structure,
      metadata: {
        method,
        keywordCount: keywords.length,
        hasTone: !!campaignTone,
        wordLimit
      }
    };
  }

  private buildKeywordDrivenPrompt(name: string, characterClass: string, keywords: string[], wordLimit: number): string {
    return `Create a D&D character backstory for ${name}, a ${characterClass}.

🎯 REQUIRED ELEMENTS TO WEAVE INTO THE STORY:
${keywords.map(k => `• ${k}`).join('\n')}

📖 BACKSTORY REQUIREMENTS:
• Naturally incorporate ALL provided elements into a cohesive narrative
• Explain how these elements shaped ${name}'s path to becoming a ${characterClass}
• Include a compelling origin story that connects the elements
• Add a personal motivation for adventuring
• Include a secret or mystery that could drive future quests
• Create potential adventure hooks that GMs can use

✍️ WRITING STYLE:
• Write in second person ("You grew up in...")
• Keep under ${wordLimit} words
• Make it engaging and mysterious
• Focus on character depth and story hooks

Begin the backstory now:`;
  }

  private buildFullGenerationPrompt(name: string, characterClass: string, wordLimit: number): string {
    return `Create a unique and compelling backstory for ${name}, a ${characterClass}.

📖 INCLUDE IN THE BACKSTORY:
• Origin and early life that shaped them
• The event or circumstances that led them to become a ${characterClass}
• What motivates them to seek adventure
• A secret, mystery, or unresolved conflict from their past
• Why they left their previous life behind
• Personality traits that emerge from their history

✍️ REQUIREMENTS:
• Write in second person perspective ("You were born...")
• Keep under ${wordLimit} words
• Make it mysterious and engaging with hooks for future adventures
• Focus on character development opportunities

Create ${name}'s backstory:`;
  }

  private buildClassBasedPrompt(name: string, characterClass: string, wordLimit: number): string {
    return `Create a classic ${characterClass} backstory for ${name}.

📖 FOCUS ON ${characterClass.toUpperCase()} ARCHETYPE:
• What led them to pursue the ${characterClass} path
• Their training, mentorship, or awakening to their abilities
• Why they've chosen to adventure rather than settle down
• A personal goal or quest specific to their class
• How their class abilities manifest in their personality

✍️ REQUIREMENTS:
• Write in second person perspective
• Keep under ${wordLimit} words  
• Stay true to D&D ${characterClass} traditions while adding unique elements

Create ${name} the ${characterClass}'s backstory:`;
  }

  private buildMinimalPrompt(name: string, characterClass: string): string {
    return `Create a brief, classic backstory for ${name}, a ${characterClass}. Focus on the essential elements that explain why they adventure. Write in second person, keep it under 100 words, and include one mystery or hook for future development.`;
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

  /**
   * Generate a complete 15-decision D&D campaign based on character and player input
   */
  async generateCampaign(request: CampaignGenerationRequest): Promise<CampaignGenerationResult> {
    console.log('🎯 Generating complete D&D campaign:', {
      type: request.type,
      keywords: request.keywords,
      character: request.characterIntegration.name,
      class: request.characterIntegration.class
    });

    const systemPrompt = `You are an expert D&D dungeon master creating an immersive 15-decision campaign. Generate a complete adventure with interconnected choices that create a compelling narrative arc from beginning to end.`;

    const userPrompt = this.buildCampaignGenerationPrompt(request);

    try {
      const response = await this.makeRequest(userPrompt, {
        maxTokens: 4000, // Larger for complete campaign
        temperature: 0.8,
        system: systemPrompt
      });

      const campaignResult = this.parseCampaignResponse(response.content, request);
      
      console.log('✅ Campaign generated successfully:', {
        decisionsCount: campaignResult.decisions.length,
        campaignTitle: campaignResult.title
      });

      return campaignResult;
    } catch (error) {
      console.warn('⚠️ AI campaign generation failed, using fallback');
      return this.generateFallbackCampaign(request);
    }
  }

  private buildCampaignGenerationPrompt(request: CampaignGenerationRequest): string {
    const { characterIntegration, type, keywords } = request;
    
    let prompt = `
🎯 CAMPAIGN GENERATION REQUEST

📋 CHARACTER INTEGRATION:
- Name: ${characterIntegration.name}
- Class: ${characterIntegration.class}
- Backstory: ${characterIntegration.backstory}

🎲 CAMPAIGN REQUIREMENTS:
- Type: ${type === 'keywords' ? 'Keyword-guided adventure' : 'Fully random adventure'}
${keywords && keywords.length > 0 ? `- Keywords to incorporate: ${keywords.join(', ')}` : ''}

📖 GENERATE A COMPLETE 15-DECISION CAMPAIGN:

Create an engaging D&D adventure with exactly 15 interconnected decisions. Each decision should:
1. Present a clear scenario building on previous choices
2. Offer 2-4 meaningful choice options (minimum 1, maximum 4)
3. Have clear consequences that affect the story
4. Include appropriate ability checks for D&D mechanics
5. Build toward a satisfying narrative climax and resolution

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "Campaign Title",
  "description": "2-3 sentence campaign overview",
  "setting": "Where the adventure takes place",
  "mainGoal": "Primary objective for the character",
  "decisions": [
    {
      "id": 1,
      "title": "Decision Title",
      "scenario": "Detailed scenario description (2-3 sentences)",
      "choices": [
        {
          "id": "A",
          "text": "Choice description",
          "type": "exploration" | "social" | "combat" | "tactical",
          "abilityCheck": {
            "ability": "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma",
            "dc": 10-20
          },
          "consequences": "What happens if chosen"
        }
      ]
    }
  ]
}

🎪 STORY ARC GUIDELINES:
- Decisions 1-3: Introduction and setup
- Decisions 4-8: Rising action and complications  
- Decisions 9-12: Climax and major challenges
- Decisions 13-15: Resolution and consequences

⚔️ CHOICE TYPE DISTRIBUTION:
- Exploration: Investigation, movement, discovery
- Social: Dialogue, persuasion, deception
- Combat: Direct confrontation, tactics
- Tactical: Planning, resource management, strategy

🎭 INTEGRATE THE CHARACTER:
- Use ${characterIntegration.name}'s ${characterIntegration.class} abilities naturally
- Reference their backstory: ${characterIntegration.backstory.slice(0, 200)}...
- Make choices relevant to their class strengths and weaknesses

${keywords && keywords.length > 0 ? `
🏷️ KEYWORD INTEGRATION:
Weave these elements naturally into the story: ${keywords.join(', ')}
` : ''}

Generate the complete campaign now:
`;

    return prompt;
  }

  private parseCampaignResponse(response: string, request: CampaignGenerationRequest): CampaignGenerationResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const campaignData = JSON.parse(jsonMatch[0]);
        return {
          ...campaignData,
          id: `campaign_${Date.now()}`,
          characterIntegration: request.characterIntegration,
          generationType: request.type,
          keywords: request.keywords || []
        };
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.warn('Failed to parse AI campaign response, using fallback');
      return this.generateFallbackCampaign(request);
    }
  }

  private generateFallbackCampaign(request: CampaignGenerationRequest): CampaignGenerationResult {
    const { characterIntegration, keywords = [] } = request;
    
    return {
      id: `campaign_fallback_${Date.now()}`,
      title: `${characterIntegration.name}'s Adventure`,
      description: `A thrilling adventure for ${characterIntegration.name} the ${characterIntegration.class}, filled with mystery and danger.`,
      setting: keywords.includes('dungeon') ? 'Ancient Dungeon' : 'Mysterious Wilderness',
      mainGoal: keywords.includes('treasure') ? 'Find the legendary treasure' : 'Uncover the truth behind recent events',
      characterIntegration: request.characterIntegration,
      generationType: request.type,
      keywords: keywords,
      decisions: this.generateFallbackDecisions(characterIntegration, keywords)
    };
  }

  private generateFallbackDecisions(character: any, keywords: string[]): CampaignDecision[] {
    // Generate 15 basic decisions as fallback
    const decisions: CampaignDecision[] = [];
    
    for (let i = 1; i <= 15; i++) {
      decisions.push({
        id: i,
        title: `Decision ${i}`,
        scenario: `${character.name} faces a new challenge in their adventure. The path ahead is uncertain, but your ${character.class} training will guide you.`,
        choices: [
          {
            id: 'A',
            text: 'Act with courage and determination',
            type: 'combat',
            abilityCheck: { ability: 'strength', dc: 12 },
            consequences: 'You face the challenge head-on'
          },
          {
            id: 'B', 
            text: 'Use wit and cunning to find another way',
            type: 'tactical',
            abilityCheck: { ability: 'intelligence', dc: 13 },
            consequences: 'You discover an alternative approach'
          }
        ]
      });
    }
    
    return decisions;
  }

  /**
   * Generate a dynamic campaign preview based on dungeon construction choices
   */
  async generateCampaignPreview(
    constructionChoices: Record<string, any>,
    characterName: string,
    characterClass: string
  ): Promise<string> {
    console.log('🏰 Generating campaign preview for:', {
      characterName,
      characterClass,
      choicesMade: Object.keys(constructionChoices).length,
      theme: constructionChoices['theme-selection'],
      goal: constructionChoices['primary-goal']
    });

    // Build context from construction choices
    const context = this.buildCampaignContext(constructionChoices);
    
    const systemPrompt = `You are an expert D&D dungeon master creating an engaging campaign preview. Generate a compelling 2-3 sentence preview that captures the atmosphere and stakes of the adventure based on the player's construction choices.`;

    const userPrompt = `
Create a campaign preview for:
Character: ${characterName} the ${characterClass}
Theme: ${context.theme}
Primary Goal: ${context.goal}
Setting Details: ${context.details}
Tone: ${context.tone}

Write a compelling 2-3 sentence preview that:
1. Sets the atmospheric tone
2. Hints at the primary challenge/goal
3. Creates anticipation for the adventure
4. Incorporates the character's class meaningfully

Keep it under 150 words and write in second person ("You find yourself...").
`;

    try {
      const response = await this.makeRequest(userPrompt, {
        maxTokens: 200,
        temperature: 0.9,
        system: systemPrompt
      });

      let preview = response.content.trim();
      
      // Ensure it starts with the character's name if it doesn't already
      if (!preview.includes(characterName)) {
        preview = `${characterName} the ${characterClass}... ${preview}`;
      }

      console.log('✅ Campaign preview generated:', {
        previewLength: preview.length,
        wordCount: preview.split(/\s+/).length
      });

      return preview;
    } catch (error) {
      console.warn('⚠️ AI preview generation failed, using fallback');
      return this.generateFallbackCampaignPreview(constructionChoices, characterName, characterClass);
    }
  }

  private buildCampaignContext(choices: Record<string, any>): {
    theme: string;
    goal: string;
    details: string;
    tone: string;
  } {
    const theme = choices['theme-selection'] || 'unknown';
    const goal = choices['primary-goal'] || 'adventure';
    const size = choices['size-scope'] || 'medium';
    const entryMethod = choices['entry-method'] || 'front-door';
    const exploration = choices['exploration-style'] || 'methodical';
    const creatures = choices['creature-types'] || [];
    const magic = choices['magical-elements'] || 'none';
    const riskLevel = choices['risk-tolerance'] || 3;

    // Convert theme ID to readable name
    const themeNames: Record<string, string> = {
      'ancient-tomb': 'Ancient Tomb',
      'wizard-tower': 'Wizard Tower',
      'underground-city': 'Underground City',
      'natural-cavern': 'Natural Caverns',
      'abandoned-mine': 'Abandoned Mine',
      'cult-temple': 'Dark Temple',
      'dragon-lair': 'Dragon Lair',
      'prison-fortress': 'Prison Fortress'
    };

    const goalNames: Record<string, string> = {
      'treasure-hunt': 'seeking ancient treasures',
      'rescue-mission': 'on a desperate rescue mission',
      'investigation': 'investigating dark mysteries',
      'elimination': 'hunting dangerous foes',
      'artifact-retrieval': 'pursuing a legendary artifact',
      'escape': 'planning a daring escape'
    };

    const context = {
      theme: themeNames[theme] || 'mysterious location',
      goal: goalNames[goal] || 'unknown purpose',
      details: `${size} scale, ${entryMethod} entry, ${exploration} approach`,
      tone: riskLevel <= 2 ? 'cautious' : riskLevel >= 4 ? 'dangerous' : 'balanced'
    };

    if (Array.isArray(creatures) && creatures.length > 0) {
      context.details += `, inhabited by ${creatures.join(', ')}`;
    }

    if (magic && magic !== 'none') {
      context.details += `, with ${magic} magical influence`;
    }

    return context;
  }

  private generateFallbackCampaignPreview(
    choices: Record<string, any>,
    characterName: string,
    characterClass: string
  ): string {
    const theme = choices['theme-selection'];
    const goal = choices['primary-goal'];
    
    const themeDescriptions: Record<string, string> = {
      'ancient-tomb': 'the cursed halls of an ancient burial ground',
      'wizard-tower': 'a tower crackling with wild magical energy',
      'underground-city': 'the forgotten streets of a subterranean metropolis',
      'natural-cavern': 'the winding depths of natural cave systems',
      'abandoned-mine': 'the haunted tunnels of a deserted mine',
      'cult-temple': 'the dark chambers of a forbidden temple',
      'dragon-lair': 'the treasure-filled lair of an ancient wyrm',
      'prison-fortress': 'the oppressive walls of a maximum-security fortress'
    };

    const goalMotivations: Record<string, string> = {
      'treasure-hunt': 'Legends speak of vast riches hidden within',
      'rescue-mission': 'Someone dear to you is trapped inside',
      'investigation': 'Dark mysteries demand investigation',
      'elimination': 'A terrible threat must be eliminated',
      'artifact-retrieval': 'A powerful artifact awaits the worthy',
      'escape': 'You must find a way out of this prison'
    };

    const themeDesc = themeDescriptions[theme] || 'a mysterious and dangerous place';
    const motivation = goalMotivations[goal] || 'Adventure calls to you';

    return `${characterName} the ${characterClass} stands before ${themeDesc}. ${motivation}, but only the brave dare enter. Your skills will be tested as you navigate this perilous domain.`;
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

  /**
   * Generate an expansion pack with 15 new decisions based on completed campaign
   */
  async generateExpansionPack(
    originalCampaign: CampaignGenerationResult,
    completedPlayState: CampaignPlayState
  ): Promise<CampaignGenerationResult> {
    console.log('🚀 Generating expansion pack for completed campaign:', {
      originalTitle: originalCampaign.title,
      decisionsCompleted: completedPlayState.decisionHistory.length,
      characterSurvived: completedPlayState.characterStatus.currentHP > 0
    });

    const systemPrompt = `You are an expert D&D dungeon master creating a 15-decision expansion pack that continues the story from a completed campaign. Build on previous events while introducing new challenges and storylines.`;

    const userPrompt = this.buildExpansionPackPrompt(originalCampaign, completedPlayState);

    try {
      const response = await this.makeRequest(userPrompt, {
        maxTokens: 4000,
        temperature: 0.8,
        system: systemPrompt
      });

      const expansionResult = this.parseExpansionResponse(response.content, originalCampaign, completedPlayState);
      
      console.log('✅ Expansion pack generated successfully:', {
        decisionsCount: expansionResult.decisions.length,
        expansionTitle: expansionResult.title
      });

      return expansionResult;
    } catch (error) {
      console.warn('⚠️ AI expansion generation failed, using fallback');
      return this.generateFallbackExpansion(originalCampaign, completedPlayState);
    }
  }

  private buildExpansionPackPrompt(
    originalCampaign: CampaignGenerationResult,
    completedPlayState: CampaignPlayState
  ): string {
    const { characterIntegration } = originalCampaign;
    const lastDecisions = completedPlayState.decisionHistory.slice(-3);
    const characterSurvived = completedPlayState.characterStatus.currentHP > 0;
    
    return `
🎯 EXPANSION PACK GENERATION REQUEST

📋 ORIGINAL CAMPAIGN CONTEXT:
- Title: ${originalCampaign.title}
- Setting: ${originalCampaign.setting}
- Main Goal: ${originalCampaign.mainGoal}
- Character: ${characterIntegration.name} the ${characterIntegration.class}
- Original Keywords: ${originalCampaign.keywords.join(', ')}

📊 COMPLETED ADVENTURE SUMMARY:
- Decisions Completed: ${completedPlayState.decisionHistory.length}
- Character Status: ${characterSurvived ? `Alive (${completedPlayState.characterStatus.currentHP} HP)` : 'Deceased'}
- Final Choices Made:
${lastDecisions.map(d => `  • Decision ${d.decisionId}: ${d.choiceText} - ${d.storyOutcome}`).join('\n')}

🎪 EXPANSION PACK REQUIREMENTS:

Create a NEW 15-decision campaign that:
1. Builds on the consequences of the completed adventure
2. References key events and choices from the original story
3. Introduces new challenges while maintaining continuity
4. ${characterSurvived ? 'Continues the character\'s journey with new goals' : 'Could involve legacy, resurrection, or spiritual continuation'}
5. Escalates the stakes based on what was accomplished/learned

📖 GENERATE EXACTLY 15 NEW DECISIONS:

Each decision should:
- Build logically from previous events
- Offer 2-4 meaningful choices (min 1, max 4)
- Include appropriate ability checks
- Reference the character's previous experiences
- Create new story threads while honoring established ones

FORMAT AS JSON:
{
  "title": "Expansion Pack Title (continuing from ${originalCampaign.title})",
  "description": "2-3 sentence overview connecting to original adventure",
  "setting": "New or evolved setting based on original consequences",
  "mainGoal": "New primary objective building on original completion",
  "decisions": [
    {
      "id": 1,
      "title": "Opening Decision Title",
      "scenario": "Scenario building on original adventure completion",
      "choices": [
        {
          "id": "A",
          "text": "Choice description",
          "type": "exploration" | "social" | "combat" | "tactical",
          "abilityCheck": {
            "ability": "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma",
            "dc": 10-20
          },
          "consequences": "What happens if chosen"
        }
      ]
    }
    // ... repeat for all 15 decisions
  ]
}

🔗 STORY CONTINUITY GUIDELINES:
- Reference specific choices made in original campaign
- Build on established character development
- Introduce consequences of previous actions
- Create new allies/enemies based on past decisions
- Escalate the scale and stakes appropriately

🎭 CHARACTER INTEGRATION:
- Use ${characterIntegration.name}'s established personality
- Reference their growth through the original adventure
- Build on their ${characterIntegration.class} abilities
- Consider how previous experiences changed them

Generate the complete expansion pack now:
`;
  }

  private parseExpansionResponse(
    response: string,
    originalCampaign: CampaignGenerationResult,
    completedPlayState: CampaignPlayState
  ): CampaignGenerationResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const expansionData = JSON.parse(jsonMatch[0]);
        return {
          ...expansionData,
          id: `expansion_${originalCampaign.id}_${Date.now()}`,
          characterIntegration: originalCampaign.characterIntegration,
          generationType: 'expansion',
          keywords: [...originalCampaign.keywords, 'continuation', 'expansion']
        };
      }
      throw new Error('No valid JSON found in expansion response');
    } catch (error) {
      console.warn('Failed to parse AI expansion response, using fallback');
      return this.generateFallbackExpansion(originalCampaign, completedPlayState);
    }
  }

  private generateFallbackExpansion(
    originalCampaign: CampaignGenerationResult,
    completedPlayState: CampaignPlayState
  ): CampaignGenerationResult {
    const { characterIntegration } = originalCampaign;
    const characterSurvived = completedPlayState.characterStatus.currentHP > 0;
    
    return {
      id: `expansion_fallback_${Date.now()}`,
      title: `${originalCampaign.title}: The Aftermath`,
      description: `Following the completion of their original quest, ${characterIntegration.name} faces new challenges that arise from their previous actions. The consequences of past decisions now shape an entirely new adventure.`,
      setting: `${originalCampaign.setting} and Beyond`,
      mainGoal: characterSurvived 
        ? `Deal with the consequences of your previous victory`
        : `Honor the fallen hero's legacy through spiritual continuation`,
      characterIntegration: originalCampaign.characterIntegration,
      generationType: 'expansion',
      keywords: [...originalCampaign.keywords, 'continuation', 'consequences'],
      decisions: this.generateFallbackExpansionDecisions(characterIntegration, characterSurvived)
    };
  }

  private generateFallbackExpansionDecisions(character: any, characterSurvived: boolean): CampaignDecision[] {
    const decisions: CampaignDecision[] = [];
    
    for (let i = 1; i <= 15; i++) {
      decisions.push({
        id: i,
        title: `Expansion Decision ${i}`,
        scenario: characterSurvived 
          ? `${character.name} faces new challenges that stem from their previous adventure. The consequences of past actions now demand attention.`
          : `The spirit of ${character.name} continues to influence events, with their legacy guiding new heroes who must complete what was started.`,
        choices: [
          {
            id: 'A',
            text: characterSurvived ? 'Use experience from previous adventure' : 'Honor the fallen hero\'s memory',
            type: 'tactical',
            abilityCheck: { ability: 'wisdom', dc: 14 },
            consequences: 'Past experience guides current action'
          },
          {
            id: 'B',
            text: 'Embrace new approaches and fresh perspectives',
            type: 'exploration',
            abilityCheck: { ability: 'intelligence', dc: 13 },
            consequences: 'Innovation leads to unexpected outcomes'
          },
          {
            id: 'C',
            text: 'Seek allies who understand the weight of legacy',
            type: 'social',
            abilityCheck: { ability: 'charisma', dc: 15 },
            consequences: 'Strong bonds form through shared purpose'
          }
        ]
      });
    }
    
    return decisions;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const claudeApi = new ClaudeApiService();