import { useState } from 'react';
import useGameStore from '../../stores/gameStore';
import SimpleCampaignCreator from './SimpleCampaignCreator';
import { CampaignResultPopup } from './CampaignPopup';
import { motion } from 'framer-motion';

interface CampaignConstructorIntegrationProps {
  onConstructorComplete: () => void;
}

export default function CampaignConstructorIntegration({
  onConstructorComplete
}: CampaignConstructorIntegrationProps) {
  const { 
    character,
    updateCampaignSetup,
    goToGame,
    campaigns,
    saveCampaignToSlot
  } = useGameStore();

  const [constructorOpen, setConstructorOpen] = useState(false);
  const [resultPopupOpen, setResultPopupOpen] = useState(false);
  const [campaignResult, setCampaignResult] = useState<any>(null);

  const handleOpenConstructor = () => {
    setConstructorOpen(true);
  };

  const handleCloseConstructor = () => {
    setConstructorOpen(false);
  };

  const handleConstructorComplete = (result: any) => {
    console.log('🏗️ Campaign construction complete:', result);
    console.log('🏗️ About to show result popup with theme:', result.theme);
    
    // Process and store the campaign result
    setCampaignResult(result);
    
    // Update game store with campaign setup
    updateCampaignSetup({
      mode: result.type === 'ai-generated' ? 'full-random' : 'guided',
      themes: result.data.keywords || [],
      tone: 'heroic', // Default tone for now
      campaignKeywords: result.data.keywords || [],
      isSetup: true
    });
    
    // Close constructor and show result popup
    setConstructorOpen(false);
    setResultPopupOpen(true);
  };

  const handleBeginAdventure = () => {
    console.log('🚀 Beginning adventure...', { 
      currentSlot: campaigns.currentSlot,
      hasCharacter: !!character 
    });
    
    setResultPopupOpen(false);
    
    // Generate initial scene based on campaign construction
    const initialScene = generateInitialScene(campaignResult);
    console.log('📜 Generated initial scene:', initialScene);
    
    // Go to the game screen
    goToGame();
    
    // Use setTimeout to ensure state update has been processed
    setTimeout(() => {
      // Save the updated state to the current campaign slot
      if (campaigns.currentSlot) {
        console.log('💾 Saving campaign state to slot:', campaigns.currentSlot);
        saveCampaignToSlot(campaigns.currentSlot);
      }
    }, 100);
    
    // Notify parent component
    onConstructorComplete();
  };

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight mb-2">
            Character Required
          </h3>
          <p className="text-fantasy-shadow">
            Please create a character before constructing your dungeon campaign.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Campaign Constructor Launch Button/Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-fantasy-parchment rounded-xl border-3 border-fantasy-gold p-8 text-center shadow-lg"
      >
        <div className="mb-6">
          <div className="text-6xl mb-4">🏗️</div>
          <h2 className="font-fantasy text-2xl font-bold text-fantasy-midnight mb-4">
            Construct Your Dungeon Campaign
          </h2>
          <p className="text-fantasy-shadow leading-relaxed mb-6">
            Design a personalized dungeon adventure tailored to{' '}
            <span className="font-semibold text-fantasy-midnight">{character.name}</span>{' '}
            the <span className="font-semibold text-fantasy-midnight">{character.class.name}</span>.
            Make meaningful choices that will shape your adventure through 15 carefully crafted decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="bg-white/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-semibold text-fantasy-midnight mb-1">Choice-Driven</h3>
            <p className="text-fantasy-shadow">15 meaningful decisions shape your unique adventure</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🎭</div>
            <h3 className="font-semibold text-fantasy-midnight mb-1">Character-Focused</h3>
            <p className="text-fantasy-shadow">Tailored to your character's class and backstory</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <div className="text-2xl mb-2">⚔️</div>
            <h3 className="font-semibold text-fantasy-midnight mb-1">D&D Style</h3>
            <p className="text-fantasy-shadow">Authentic dungeon exploration experience</p>
          </div>
        </div>

        <button
          onClick={handleOpenConstructor}
          className="constructor-button text-lg px-8 py-3"
        >
          Begin Construction ⚒️
        </button>
      </motion.div>

      {/* The actual constructor modal */}
      <SimpleCampaignCreator
        onComplete={(result) => {
          // Process the simple campaign result
          const processedResult = {
            campaignName: generateCampaignName(result.type, result.data.keywords),
            theme: result.type,
            estimatedDuration: 2,
            characterName: character?.name || '',
            choices: {
              'campaign-type': result.type,
              'keywords': result.data.keywords || [],
              'user-prompt': result.data.userPrompt || ''
            }
          };
          handleConstructorComplete(processedResult);
        }}
        onCancel={handleCloseConstructor}
      />

      {/* Result popup with Pinky image */}
      {campaignResult && (
        <>
          {console.log('🎯 Rendering CampaignResultPopup:', { 
            hasResult: !!campaignResult, 
            isOpen: resultPopupOpen,
            resultTheme: campaignResult.theme 
          })}
          <CampaignResultPopup
            isOpen={resultPopupOpen}
            onClose={() => setResultPopupOpen(false)}
            onBeginAdventure={handleBeginAdventure}
            campaignResult={campaignResult}
          />
        </>
      )}
    </>
  );
}

// Helper functions for campaign processing

function determineCampaignTone(choices: Record<string, any>): 'dark' | 'heroic' | 'comedic' | 'gritty' {
  const theme = choices['theme-selection'];
  const goal = choices['primary-goal'];
  const complexity = choices['narrative-complexity'];
  
  // Determine tone based on choices
  if (theme === 'cult-temple' || theme === 'ancient-tomb') {
    return 'dark';
  }
  
  if (goal === 'rescue-mission' || goal === 'elimination') {
    return 'heroic';
  }
  
  if (complexity === 'complex') {
    return 'gritty';
  }
  
  return 'heroic'; // Default to heroic
}

function mapThemeToLocation(theme: string): 'tavern' | 'dungeon' | 'wilderness' | 'city' | 'random' {
  const locationMap: Record<string, 'tavern' | 'dungeon' | 'wilderness' | 'city' | 'random'> = {
    'ancient-tomb': 'dungeon',
    'wizard-tower': 'dungeon',
    'underground-city': 'city',
    'natural-cavern': 'wilderness',
    'abandoned-mine': 'wilderness',
    'cult-temple': 'dungeon',
    'dragon-lair': 'dungeon',
    'prison-fortress': 'dungeon'
  };
  
  return locationMap[theme] || 'dungeon';
}

function extractCampaignKeywords(choices: Record<string, any>): string[] {
  const keywords: string[] = [];
  
  // Add theme-based keywords
  const theme = choices['theme-selection'];
  if (theme) keywords.push(theme);
  
  // Add goal-based keywords  
  const goal = choices['primary-goal'];
  if (goal) keywords.push(goal);
  
  // Add creature type keywords
  const creatures = choices['creature-types'];
  if (Array.isArray(creatures)) {
    keywords.push(...creatures);
  } else if (creatures) {
    keywords.push(creatures);
  }
  
  // Add magical element keywords
  const magic = choices['magical-elements'];
  if (magic && magic !== 'none') keywords.push(magic);
  
  // Add exploration style
  const style = choices['exploration-style'];
  if (style) keywords.push(style);
  
  return keywords.filter(Boolean);
}

function generateCampaignName(type: string, keywords?: string[]): string {
  const typeNames = {
    'ai-generated': 'AI-Generated Adventure',
    'keyword-guided': keywords && keywords.length > 0 
      ? `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} Campaign`
      : 'Guided Adventure',
    'user-prompt': 'Custom Adventure'
  };
  
  return typeNames[type as keyof typeof typeNames] || 'New Adventure';
}

function generateInitialScene(campaignResult: any): string {
  const { characterName, characterClass, choices } = campaignResult;
  const campaignType = choices['campaign-type'];
  const keywords = choices['keywords'] || [];
  const userPrompt = choices['user-prompt'] || '';
  
  // Use the first scenario from the campaign result if it exists
  if (campaignResult.firstScenario) {
    return campaignResult.firstScenario;
  }
  
  // Fallback scenario generation
  let scene = `${characterName} the ${characterClass} stands ready to begin their adventure. `;
  
  if (campaignType === 'keyword-guided' && keywords.length > 0) {
    scene += `Recent events involving ${keywords.slice(0, 2).join(' and ')} have led to this moment. `;
  } else if (campaignType === 'user-prompt' && userPrompt) {
    scene += `The circumstances you envisioned have come to pass. `;
  } else {
    scene += `Fate has guided you to this crossroads. `;
  }
  
  scene += '\n\nThree paths lie before you:\n\n';
  scene += '**A)** Seek information and allies in the nearby settlement\n';
  scene += '**B)** Investigate the mysterious occurrences directly\n';
  scene += '**C)** Prepare thoroughly before taking any action\n\n';
  scene += 'What do you choose?';
  
  return scene;
}