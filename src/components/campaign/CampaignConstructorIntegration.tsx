import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import DungeonCampaignConstructor from './DungeonCampaignConstructor';
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
    ui,
    setUI,
    setCampaignSetup,
    startNewGame
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
    
    // Process and store the campaign result
    setCampaignResult(result);
    
    // Update game store with campaign setup
    setCampaignSetup({
      mode: result.choices['narrative-complexity'] === 'simple' ? 'full-random' : 'guided',
      themes: [result.choices['theme-selection']],
      tone: determineCampaignTone(result.choices),
      startingLocation: mapThemeToLocation(result.choices['theme-selection']),
      campaignKeywords: extractCampaignKeywords(result.choices),
      isSetup: true
    });
    
    // Close constructor and show result popup
    setConstructorOpen(false);
    setResultPopupOpen(true);
  };

  const handleBeginAdventure = () => {
    setResultPopupOpen(false);
    
    // Generate initial scene based on campaign construction
    const initialScene = generateInitialScene(campaignResult);
    
    // Start the game with the constructed campaign
    startNewGame(initialScene);
    
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
      <DungeonCampaignConstructor
        isOpen={constructorOpen}
        onClose={handleCloseConstructor}
        onComplete={handleConstructorComplete}
        characterName={character?.name || ''}
        characterClass={character?.class?.name || ''}
      />

      {/* Result popup with Pinky image */}
      {campaignResult && (
        <CampaignResultPopup
          isOpen={resultPopupOpen}
          onClose={() => setResultPopupOpen(false)}
          onBeginAdventure={handleBeginAdventure}
          campaignResult={campaignResult}
        />
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

function generateInitialScene(campaignResult: any): string {
  const { choices, characterName, characterClass } = campaignResult;
  const theme = choices['theme-selection'];
  const entry = choices['entry-method'];
  const goal = choices['primary-goal'];
  
  const themeDescriptions = {
    'ancient-tomb': 'ancient stone corridors filled with the scent of ages past',
    'wizard-tower': 'a spiraling tower where magical energies crackle in the air',
    'underground-city': 'the outskirts of a vast subterranean metropolis',
    'natural-cavern': 'natural caves carved by underground rivers',
    'abandoned-mine': 'wooden-supported tunnels that echo with your footsteps',
    'cult-temple': 'dark hallways adorned with ominous religious symbols',
    'dragon-lair': 'massive caverns that reek of sulfur and danger',
    'prison-fortress': 'stone corridors designed for maximum security'
  };
  
  const entryDescriptions = {
    'front-door': 'You stand before the main entrance, knowing full well that your presence is expected.',
    'secret-passage': 'You slip through a hidden entrance you discovered, hoping to maintain the element of surprise.',
    'breach-walls': 'You force your way through a wall you\'ve broken, debris still falling around you.',
    'underground': 'You emerge from underground tunnels into the complex proper.',
    'aerial': 'You drop down from above, having gained entry from the roof or upper levels.'
  };
  
  const goalMotivations = {
    'treasure-hunt': 'The promise of legendary treasure drives you forward.',
    'rescue-mission': 'Someone important is trapped within, and time may be running out.',
    'investigation': 'Dark mysteries surround this place, and you must uncover the truth.',
    'elimination': 'A dangerous threat lurks here that must be destroyed.',
    'artifact-retrieval': 'A powerful artifact awaits, if you can claim it.',
    'escape': 'You find yourself trapped within and must find your way out.'
  };
  
  let scene = `${characterName} the ${characterClass} finds themselves in ${themeDescriptions[theme] || 'a mysterious location'}. `;
  scene += entryDescriptions[entry] || 'You enter through an unremarkable entrance. ';
  scene += '\n\n';
  scene += goalMotivations[goal] || 'Your purpose here is unclear, but danger certainly awaits. ';
  scene += '\n\n';
  scene += 'The adventure begins now. What do you do first?';
  
  return scene;
}