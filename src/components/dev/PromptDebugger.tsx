import React, { useState } from 'react';

interface PromptDebuggerProps {
  characterClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  userKeywords?: string[];
  backstoryKeywords?: string[];
  campaignTone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
  method?: 'full' | 'keywords' | 'class-based';
}

export function PromptDebugger({
  characterClass,
  characterName,
  userKeywords = [],
  backstoryKeywords = [],
  campaignTone,
  method = 'full'
}: PromptDebuggerProps) {
  const [showPrompts, setShowPrompts] = useState(false);

  const generateBackstoryPrompt = () => {
    const wordLimit = 200;
    let prompt = '';
    
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

Incorporate these elements naturally into the story: ${backstoryKeywords.join(', ')}

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

    return prompt;
  };

  const generatePortraitPrompt = (mockBackstory: string) => {
    const keywordList = userKeywords.join(', ');
    const backstoryHints = mockBackstory ? mockBackstory.substring(0, 150) + '...' : '';
    
    return `Create a detailed visual description for a fantasy character portrait suitable for Stable Diffusion.

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
  };

  // Mock backstory for portrait generation
  const getMockBackstory = () => {
    const backstories = {
      Fighter: `You are ${characterName}, a seasoned warrior who learned to fight in the brutal conflicts of the borderlands. Your skill with blade and shield was forged in countless skirmishes, but a personal tragedy drove you to seek purpose beyond mere warfare. The scars you bear tell stories of battles won and comrades lost, and now you wander seeking a cause worth fighting for.`,
      
      Rogue: `You are ${characterName}, a child of the shadows who learned early that survival required cunning over strength. The streets taught you to be quick with your fingers and quicker with your wit. A betrayal by someone you trusted left you wary of others, but also gave you the skills to move unseen through the world.`,
      
      Wizard: `You are ${characterName}, a seeker of arcane knowledge who discovered your magical abilities through years of dedicated study. Your apprenticeship was cut short by mysterious circumstances, leaving you with incomplete training but an insatiable hunger for magical secrets.`,
      
      Cleric: `You are ${characterName}, chosen by divine forces to serve as their instrument in the mortal realm. Your faith was tested by a crisis that shook your very foundations, but emerging from that trial only strengthened your resolve.`
    };
    
    return backstories[characterClass];
  };

  const generateMockPortraitResult = () => {
    const classPrompts = {
      Fighter: `fantasy art, detailed digital painting, character portrait, human fighter ${characterName}, ${userKeywords.join(', ')}, armored warrior with sword and shield, battle-ready stance, determined expression, martial bearing, upper body shot, 3:4 aspect ratio, high quality rendering, epic fantasy setting, dramatic lighting`,
      
      Rogue: `fantasy art, detailed digital painting, character portrait, human rogue ${characterName}, ${userKeywords.join(', ')}, dark leather armor, hooded cloak, daggers at belt, cunning expression, shadowy atmosphere, upper body shot, 3:4 aspect ratio, high quality rendering, medieval fantasy setting, moody lighting`,
      
      Wizard: `fantasy art, detailed digital painting, character portrait, human wizard ${characterName}, ${userKeywords.join(', ')}, magical robes, staff or spellbook, arcane symbols, wise expression, magical aura, upper body shot, 3:4 aspect ratio, high quality rendering, fantasy setting, mystical lighting`,
      
      Cleric: `fantasy art, detailed digital painting, character portrait, human cleric ${characterName}, ${userKeywords.join(', ')}, holy vestments, divine symbol, blessed weapon, serene expression, divine light, upper body shot, 3:4 aspect ratio, high quality rendering, fantasy setting, holy lighting`
    };
    
    return classPrompts[characterClass];
  };

  if (!showPrompts) {
    return (
      <button
        onClick={() => setShowPrompts(true)}
        style={{
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '10px'
        }}
      >
        🔍 Debug: Show Claude Prompts
      </button>
    );
  }

  const backstoryPrompt = generateBackstoryPrompt();
  const mockBackstory = getMockBackstory();
  const portraitPrompt = generatePortraitPrompt(mockBackstory);
  const mockPortraitResult = generateMockPortraitResult();

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 10000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFD700', margin: 0 }}>🔍 Claude API Prompt Debugger</h2>
          <button
            onClick={() => setShowPrompts(false)}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
          <strong>Character Info:</strong><br />
          Name: {characterName}<br />
          Class: {characterClass}<br />
          Method: {method}<br />
          {userKeywords.length > 0 && <>Visual Keywords: {userKeywords.join(', ')}<br /></>}
          {backstoryKeywords.length > 0 && <>Backstory Keywords: {backstoryKeywords.join(', ')}<br /></>}
          {campaignTone && <>Campaign Tone: {campaignTone}<br /></>}
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#4CAF50' }}>📝 BACKSTORY GENERATION PROMPT</h3>
          <div style={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            border: '1px solid #4CAF50'
          }}>
            {backstoryPrompt}
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#888' }}>
            System: "You are a creative D&D dungeon master. Create compelling character backstories that include mystery, motivation, and adventure hooks. Write in second person perspective and keep under 200 words.{campaignTone ? ` The tone should be ${campaignTone}.` : ''}"
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#2196F3' }}>📖 MOCK BACKSTORY RESULT</h3>
          <div style={{ 
            backgroundColor: 'rgba(33, 150, 243, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            border: '1px solid #2196F3'
          }}>
            {mockBackstory}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#FF9800' }}>🎨 PORTRAIT PROMPT GENERATION REQUEST</h3>
          <div style={{ 
            backgroundColor: 'rgba(255, 152, 0, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            border: '1px solid #FF9800'
          }}>
            {portraitPrompt}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#9C27B0' }}>🖼️ MOCK PORTRAIT PROMPT RESULT</h3>
          <div style={{ 
            backgroundColor: 'rgba(156, 39, 176, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            border: '1px solid #9C27B0'
          }}>
            {mockPortraitResult}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#607D8B' }}>⚙️ MODELS LAB API REQUEST</h3>
          <div style={{ 
            backgroundColor: 'rgba(96, 125, 139, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            border: '1px solid #607D8B'
          }}>
            <pre style={{ margin: 0, fontSize: '11px' }}>
{JSON.stringify({
  key: "[YOUR_MODELS_LAB_API_KEY]",
  model_id: "stable-diffusion-xl-base-1.0",
  prompt: mockPortraitResult,
  negative_prompt: "blurry, low quality, distorted, mutated, deformed, text, watermark, signature",
  width: 768,
  height: 1024,
  samples: 1,
  num_inference_steps: 25,
  guidance_scale: 7.5,
  safety_checker: true,
  enhance_prompt: true,
  seed: null
}, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ 
          padding: '15px',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '4px',
          border: '1px solid #FFC107',
          color: '#FFC107'
        }}>
          <strong>💡 Next Steps:</strong><br />
          1. These are the exact prompts that would be sent to Claude API<br />
          2. Models Lab API is working directly from browser (no CORS issues)<br />
          3. To test Claude API, we'd need to build a simple backend proxy<br />
          4. For now, you can test the character creation flow with these mock responses
        </div>
      </div>
    </div>
  );
}