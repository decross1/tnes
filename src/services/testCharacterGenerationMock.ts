// Mock character generation test that shows what prompts would look like
// without making actual API calls (to avoid CORS and save credits)

import type { BackstoryGenerationRequest, PortraitPromptRequest } from '../types/api';

export function mockCharacterGeneration() {
  console.log('🧪 Mock Character Generation Test (No API Calls)...\n');
  
  // Test 1: Full backstory generation - show what Claude would receive
  const testCharacterData: BackstoryGenerationRequest = {
    characterClass: 'Fighter',
    characterName: 'Marcus Brightblade', 
    method: 'full',
    campaignTone: 'heroic',
    wordLimit: 200
  };
  
  console.log('🔮 Test 1: Full Backstory Generation');
  console.log(`Character: ${testCharacterData.characterName} (${testCharacterData.characterClass})`);
  
  // Show what prompt would be sent to Claude
  const backstoryPrompt = `Create a unique and compelling backstory for a ${testCharacterData.characterClass} named ${testCharacterData.characterName}.

Include:
- Their origin and background
- What motivates them to adventure
- A secret or mystery from their past
- Why they left their previous life behind

Make it mysterious and engaging with hooks for future adventures. Write in second person ("You were born...").`;

  console.log('📝 CLAUDE BACKSTORY PROMPT:');
  console.log(`"${backstoryPrompt}"`);
  console.log(`🎯 System: Creative D&D dungeon master, ${testCharacterData.wordLimit} words, ${testCharacterData.campaignTone} tone\n`);
  
  // Mock Claude response
  const mockBackstory = `You were born into nobility as Marcus Brightblade, heir to a proud warrior house. Your father trained you from childhood in swordplay and tactics, preparing you to defend the family's honor. But when bandits razed your ancestral home and murdered your family, you barely escaped with your life and your father's enchanted blade. 

Now you wander the realm seeking vengeance against the mysterious Black Company that destroyed everything you held dear. The sword whispers to you in dreams, showing visions of your enemies and promising power if you can unlock its full potential. Some say the blade is cursed, but it's all you have left of your family's legacy.`;

  console.log('📖 MOCK BACKSTORY RESULT:');
  console.log(`"${mockBackstory}"`);
  console.log(`Word count: ${mockBackstory.split(/\s+/).length}\n`);
  
  // Test 2: Portrait prompt generation
  const portraitRequest: PortraitPromptRequest = {
    characterClass: 'Fighter',
    characterName: 'Marcus Brightblade',
    userKeywords: ['scarred', 'battle-worn', 'determined', 'heavy armor'],
    backstoryContent: mockBackstory,
    campaignTone: 'heroic'
  };
  
  console.log('🎨 Test 2: Portrait Prompt Generation');
  
  const portraitPromptRequest = `Create a detailed visual description for a fantasy character portrait suitable for Stable Diffusion.

Character: ${portraitRequest.characterName}, a ${portraitRequest.characterClass}
User-provided visual descriptors: ${portraitRequest.userKeywords.join(', ')}
Backstory context: ${portraitRequest.backstoryContent?.substring(0, 150)}...
Campaign tone: ${portraitRequest.campaignTone}

Generate a Stable Diffusion prompt that:
1. Incorporates all user keywords naturally into the visual description
2. Includes appropriate ${portraitRequest.characterClass}-specific visual elements (equipment, stance, etc.)
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

  console.log('📝 CLAUDE PORTRAIT PROMPT REQUEST:');
  console.log(`"${portraitPromptRequest}"`);
  
  // Mock Claude response for portrait prompt
  const mockPortraitPrompt = `fantasy art, detailed digital painting, character portrait, noble human fighter Marcus Brightblade, scarred face with determined expression, battle-worn heavy plate armor with family crest, sword at side, heroic pose, upper body shot, medieval fantasy setting, dramatic lighting, high quality rendering, 3:4 aspect ratio, detailed facial features, weathered warrior, battle scars, determined eyes, ornate armor details`;
  
  console.log('\n🖼️  MOCK CLAUDE PORTRAIT PROMPT RESULT:');
  console.log(`"${mockPortraitPrompt}"`);
  
  // Show what would be sent to Models Lab
  console.log('\n⚙️  MODELS LAB REQUEST PARAMETERS:');
  const modelsLabParams = {
    key: '[YOUR_API_KEY]',
    model_id: 'stable-diffusion-xl-base-1.0',
    prompt: mockPortraitPrompt,
    negative_prompt: 'blurry, low quality, distorted, mutated, deformed, text, watermark, signature',
    width: 768,
    height: 1024,
    samples: 1,
    num_inference_steps: 25,
    guidance_scale: 7.5,
    safety_checker: true,
    enhance_prompt: true
  };
  
  console.log(JSON.stringify(modelsLabParams, null, 2));
  
  // Test with different character types
  console.log('\n🔮 Test 3: Keywords-Based Rogue');
  const rogueKeywords = ['revenge', 'noble house', 'cursed dagger', 'betrayal'];
  console.log(`Keywords: ${rogueKeywords.join(', ')}`);
  
  const roguePrompt = `Create a compelling D&D character backstory for a Rogue named Lyra Shadowstep.

Incorporate these elements naturally into the story: ${rogueKeywords.join(', ')}

Include:
- Origin that connects to the keywords
- Motivation for adventuring
- A secret or mystery
- Adventure hooks

Write in second person perspective ("You grew up..."). Keep under 180 words and make it mysterious and engaging.`;

  console.log('📝 ROGUE BACKSTORY PROMPT:');
  console.log(`"${roguePrompt}"`);
  
  const mockRoguePortraitPrompt = `fantasy art, detailed digital painting, character portrait, half-elf rogue Lyra Shadowstep, hooded cloak, vengeful expression, noble features marred by betrayal, cursed ornate dagger at belt, dark leather armor with house sigil, shadowy atmosphere, upper body shot, medieval fantasy setting, moody lighting, high quality rendering, 3:4 aspect ratio, piercing eyes, determined but haunted expression`;
  
  console.log('\n🗡️  MOCK ROGUE PORTRAIT PROMPT:');
  console.log(`"${mockRoguePortraitPrompt}"`);
  
  console.log('\n🏁 Mock testing complete! These are the prompts that would be sent to the APIs.');
  console.log('💡 To test with real APIs, you need to set up a backend server to avoid CORS issues.');
  
  return {
    backstoryPrompt,
    mockBackstory,
    portraitPromptRequest,
    mockPortraitPrompt,
    modelsLabParams,
    roguePrompt,
    mockRoguePortraitPrompt
  };
}