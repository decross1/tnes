import { useState } from 'react';
import useGameStore from '../../stores/gameStore';
import DungeonCampaignConstructor from './DungeonCampaignConstructor';
import { CampaignResultPopup } from './CampaignPopup';
import { motion } from 'framer-motion';
import { CampaignConstructionResult } from '../../types/dungeonCampaign';

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
  const [campaignResult, setCampaignResult] = useState<CampaignConstructionResult | null>(null);

  const handleOpenConstructor = () => {
    setConstructorOpen(true);
  };

  const handleCloseConstructor = () => {
    setConstructorOpen(false);
  };

  const handleConstructorComplete = (result: CampaignConstructionResult) => {
    console.log('🏗️ Dungeon campaign construction complete:', result);
    console.log('🏗️ About to show result popup with theme:', result.theme);
    
    // Process and store the campaign result
    setCampaignResult(result);
    
    // Update game store with campaign setup based on dungeon construction
    updateCampaignSetup({
      mode: 'guided', // Dungeon constructor is always guided
      themes: [result.theme],
      tone: determineCampaignTone(result.choices),
      campaignKeywords: extractCampaignKeywords(result.choices),
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

      {/* Dungeon Campaign Constructor */}
      <DungeonCampaignConstructor
        isOpen={constructorOpen}
        onClose={handleCloseConstructor}
        onComplete={handleConstructorComplete}
        characterName={character.name}
        characterClass={character.class.name}
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

function generateCampaignName(theme: string, goal?: string): string {
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
  
  const goalPrefixes: Record<string, string> = {
    'treasure-hunt': 'Treasures of the',
    'rescue-mission': 'Rescue from the',
    'investigation': 'Mystery of the',
    'elimination': 'Cleansing of the',
    'artifact-retrieval': 'Quest for the',
    'escape': 'Escape from the'
  };
  
  const themeName = themeNames[theme] || 'Unknown Dungeon';
  const goalPrefix = goal && goalPrefixes[goal] ? goalPrefixes[goal] : 'Adventure in the';
  
  return `${goalPrefix} ${themeName}`;
}

function generateInitialScene(campaignResult: CampaignConstructionResult): string {
  // Use the generated first scene prompt if available
  if (campaignResult.firstScenePrompt) {
    return campaignResult.firstScenePrompt;
  }
  
  // Generate based on dungeon construction choices
  const theme = campaignResult.theme;
  const goal = campaignResult.primaryGoal;
  const entryMethod = campaignResult.choices['entry-method'];
  
  let scene = `${campaignResult.characterIntegration}\n\n`;
  
  // Add atmosphere based on theme
  const themeDescriptions: Record<string, string> = {
    'ancient-tomb': 'Ancient stone walls covered in dust and shadow loom before you. The air is thick with the weight of centuries.',
    'wizard-tower': 'A tall spire pierces the sky, crackling with residual magical energy. Reality seems to shimmer around its base.',
    'underground-city': 'Carved stone buildings stretch into the darkness. Torch brackets line empty streets.',
    'natural-cavern': 'Natural stone formations create a maze of passages. Water drips echoing in the distance.',
    'abandoned-mine': 'Wooden support beams creak ominously. Mining equipment lies scattered and forgotten.',
    'cult-temple': 'Dark religious symbols cover the walls. The air feels oppressive with divine presence.',
    'dragon-lair': 'The overwhelming sense of ancient power emanates from within. Treasure glints in the shadows.',
    'prison-fortress': 'Iron bars and stone walls speak of confinement. Guard posts stand empty.'
  };
  
  scene += themeDescriptions[theme] || 'The entrance to your destination awaits before you.';
  scene += '\n\n';
  
  // Add entry-specific choices
  scene += 'How do you proceed?\n\n';
  
  if (entryMethod === 'front-door') {
    scene += '**A)** Enter through the main entrance boldly\n';
    scene += '**B)** Examine the entrance for traps first\n';
    scene += '**C)** Look for alternative ways in\n';
    scene += '**D)** Prepare yourself before entering\n';
  } else if (entryMethod === 'secret-passage') {
    scene += '**A)** Search for the hidden entrance you heard about\n';
    scene += '**B)** Use stealth to avoid detection\n';
    scene += '**C)** Scout the perimeter first\n';
    scene += '**D)** Consider other entry options\n';
  } else {
    scene += '**A)** Investigate your surroundings\n';
    scene += '**B)** Approach with caution\n';
    scene += '**C)** Plan your strategy\n';
    scene += '**D)** Act decisively\n';
  }
  
  scene += '\nWhat do you choose?';
  
  return scene;
}