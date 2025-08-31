import { claudeApi } from './claudeApi';
import { imageApi } from './imageApi';
import type { BackstoryGenerationRequest, PortraitPromptRequest, PortraitGenerationRequest } from '../types/api';

// Test data for character generation
const testCharacterData: BackstoryGenerationRequest = {
  characterClass: 'Fighter',
  characterName: 'Marcus Brightblade',
  method: 'full',
  campaignTone: 'heroic',
  wordLimit: 200
};

const testKeywordsData: BackstoryGenerationRequest = {
  characterClass: 'Rogue',
  characterName: 'Lyra Shadowstep',
  method: 'keywords',
  keywords: ['revenge', 'noble house', 'cursed dagger', 'betrayal'],
  campaignTone: 'dark',
  wordLimit: 180
};

const testPortraitKeywords = ['scarred', 'battle-worn', 'determined', 'heavy armor'];

export async function testCharacterGeneration() {
  console.log('🧪 Testing Character Generation Services...\n');
  
  if (!claudeApi.isConfigured()) {
    console.log('⚠️  Claude API key not configured - testing will use fallback responses');
  }
  
  if (!imageApi.isConfigured()) {
    console.log('⚠️  Image API key not configured - testing will use placeholder images');
  }
  
  console.log(`📊 Available image providers: ${imageApi.getAvailableProviders().join(', ') || 'None'}`);
  console.log(`🎯 Preferred provider: ${imageApi.getPreferredProvider()}\n`);
  
  // Test 1: Full backstory generation
  console.log('🔮 Test 1: Full Backstory Generation');
  console.log(`Character: ${testCharacterData.characterName} (${testCharacterData.characterClass})`);
  try {
    const backstoryResult = await claudeApi.generateCharacterBackstory(testCharacterData);
    console.log(`✅ Backstory generated successfully!`);
    console.log(`📝 Word count: ${backstoryResult.wordCount}`);
    console.log(`🎭 Confidence: ${Math.round(backstoryResult.confidence * 100)}%`);
    console.log(`🏷️  Extracted traits: ${backstoryResult.extractedTraits.join(', ')}`);
    console.log(`📖 Preview: "${backstoryResult.backstory.substring(0, 100)}..."\n`);
    
    // Test portrait prompt generation
    console.log('🎨 Test 1b: Portrait Prompt Generation for Full Backstory');
    const portraitPromptRequest: PortraitPromptRequest = {
      characterClass: testCharacterData.characterClass,
      characterName: testCharacterData.characterName,
      userKeywords: testPortraitKeywords,
      backstoryContent: backstoryResult.backstory,
      campaignTone: testCharacterData.campaignTone
    };
    
    const promptResult = await claudeApi.generatePortraitPrompt(portraitPromptRequest);
    console.log(`✅ Portrait prompt generated!`);
    console.log(`🎯 Confidence: ${Math.round(promptResult.confidence * 100)}%`);
    console.log(`🏷️  Processed keywords: ${promptResult.processedKeywords.join(', ')}`);
    console.log(`🖼️  Prompt preview: "${promptResult.prompt.substring(0, 120)}..."\n`);
    
    // Test portrait generation
    console.log('🖼️  Test 1c: Portrait Image Generation');
    const portraitRequest: PortraitGenerationRequest = {
      prompt: promptResult.prompt,
      characterClass: testCharacterData.characterClass,
      aspectRatio: '3:4',
      quality: 'standard'
    };
    
    const portraitResult = await imageApi.generatePortrait(portraitRequest);
    console.log(`✅ Portrait generated successfully!`);
    console.log(`⏱️  Generation time: ${portraitResult.generationTime}ms`);
    console.log(`🏭 Provider: ${portraitResult.provider}`);
    console.log(`🔗 URL type: ${portraitResult.url.startsWith('data:') ? 'Base64/SVG' : 'HTTP URL'}\n`);
    
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }
  
  // Test 2: Keywords-based generation
  console.log('🔮 Test 2: Keywords-Based Generation');
  console.log(`Character: ${testKeywordsData.characterName} (${testKeywordsData.characterClass})`);
  console.log(`Keywords: ${testKeywordsData.keywords?.join(', ')}`);
  try {
    const backstoryResult = await claudeApi.generateCharacterBackstory(testKeywordsData);
    console.log(`✅ Keywords backstory generated successfully!`);
    console.log(`📝 Word count: ${backstoryResult.wordCount}`);
    console.log(`🎭 Confidence: ${Math.round(backstoryResult.confidence * 100)}%`);
    console.log(`🏷️  Extracted traits: ${backstoryResult.extractedTraits.join(', ')}`);
    console.log(`📖 Preview: "${backstoryResult.backstory.substring(0, 100)}..."\n`);
    
  } catch (error) {
    console.error('❌ Test 2 failed:', error);
  }
  
  // Test 3: Class-based generation (fastest)
  console.log('🔮 Test 3: Class-Based Quick Generation');
  const quickData: BackstoryGenerationRequest = {
    characterClass: 'Wizard',
    characterName: 'Elara Starweaver',
    method: 'class-based',
    wordLimit: 150
  };
  
  try {
    const backstoryResult = await claudeApi.generateCharacterBackstory(quickData);
    console.log(`✅ Class-based backstory generated!`);
    console.log(`📝 Word count: ${backstoryResult.wordCount}`);
    console.log(`🎭 Confidence: ${Math.round(backstoryResult.confidence * 100)}%`);
    console.log(`📖 Preview: "${backstoryResult.backstory.substring(0, 100)}..."\n`);
    
  } catch (error) {
    console.error('❌ Test 3 failed:', error);
  }
  
  console.log('🏁 Character generation testing complete!');
  
  // Return results for potential UI testing
  return {
    claudeConfigured: claudeApi.isConfigured(),
    imageConfigured: imageApi.isConfigured(),
    availableProviders: imageApi.getAvailableProviders(),
    preferredProvider: imageApi.getPreferredProvider()
  };
}

// Enable running this directly in browser console or Node for testing
if (typeof window !== 'undefined') {
  (window as any).testCharacterGeneration = testCharacterGeneration;
}