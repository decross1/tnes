import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';

interface GameChoice {
  id: string;
  text: string;
  description: string;
}

interface GameScenario {
  title: string;
  description: string;
  choices: GameChoice[];
  backgroundImage?: string;
}

export default function GameScreen() {
  console.log('🎮 GameScreen rendered');
  
  const store = useGameStore();
  const { 
    character, 
    campaigns, 
    goToMainMenu,
    campaign 
  } = store;

  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🎮 GameScreen state:', { 
    hasCharacter: !!character,
    characterName: character?.name,
    campaignSlot: campaigns.currentSlot,
    isLoading,
    hasScenario: !!currentScenario
  });

  useEffect(() => {
    // Generate or load the first scenario
    const generateFirstScenario = () => {
      if (!character) return null;

      const characterName = character.name;
      const characterClass = character.class.name;

      // Use campaign setup to influence the scenario
      const keywords = campaign?.campaignKeywords || [];
      const tone = campaign?.tone || 'heroic';

      let scenario: GameScenario;

      if (keywords.length > 0) {
        // Keyword-guided scenario
        scenario = {
          title: `${characterName} Begins the Adventure`,
          description: `${characterName} the ${characterClass} stands at the edge of a small village as twilight approaches. Recent rumors of ${keywords[0]} have been spreading through the local taverns, and whispers of ${keywords[1] || 'ancient mysteries'} draw your attention. The village elder approaches you with obvious relief.

"Thank the gods, an adventurer! We desperately need someone with your skills. Strange things have been happening, and the townsfolk are growing fearful. Will you hear our plea?"`,
          choices: [
            {
              id: 'listen',
              text: 'Listen to the Elder',
              description: 'Hear the full story and offer your aid to the troubled villagers'
            },
            {
              id: 'investigate',
              text: 'Investigate Alone',
              description: 'Skip the formalities and head straight to investigate the source of trouble'
            },
            {
              id: 'negotiate',
              text: 'Negotiate Terms',
              description: 'Ask about payment and what exactly you\'re getting yourself into'
            }
          ]
        };
      } else {
        // AI-generated default scenario
        scenario = {
          title: `The Crossroads of Destiny`,
          description: `${characterName} the ${characterClass} stands at a misty crossroads where three ancient stone markers point in different directions. The morning fog swirls around weathered paths that disappear into the distance, each promising different adventures and dangers.

To the north, a well-traveled road leads toward flickering lights and the sound of civilization. To the east, a narrow mountain path winds upward into storm clouds where strange lights dance. To the west, an overgrown trail disappears into a silent forest where no birds sing.

Your adventure begins with a choice that will shape everything that follows.`,
          choices: [
            {
              id: 'north',
              text: 'Take the Northern Road',
              description: 'Head toward civilization seeking allies, information, and supplies'
            },
            {
              id: 'east',
              text: 'Climb the Eastern Path',
              description: 'Brave the mountain dangers and investigate the mysterious lights'
            },
            {
              id: 'west',
              text: 'Enter the Silent Forest',
              description: 'Trust your instincts and explore the unnaturally quiet woodland'
            }
          ]
        };
      }

      return scenario;
    };

    setTimeout(() => {
      setCurrentScenario(generateFirstScenario());
      setIsLoading(false);
    }, 1000);
  }, [character, campaign]);

  const handleChoice = (choiceId: string) => {
    console.log('🎮 Choice button clicked:', choiceId);
    const choice = currentScenario?.choices.find(c => c.id === choiceId);
    if (!choice) {
      console.error('Choice not found:', choiceId);
      return;
    }

    console.log('🎯 Player chose:', choice);
    
    // For now, just show a placeholder
    setCurrentScenario({
      title: 'Adventure Continues...',
      description: `You chose: ${choice.text}. 

Your adventure continues from here! This is where the next scenario would be generated based on your choice and the campaign parameters you selected during creation.

The AI would take into account:
- Your character's class and backstory
- The campaign keywords you provided
- Your previous choices and actions
- The current story context

This creates a personalized, evolving narrative tailored specifically to your character and preferences.`,
      choices: [
        {
          id: 'continue',
          text: 'Continue Adventure',
          description: 'The story continues...'
        },
        {
          id: 'back',
          text: 'Return to Main Menu',
          description: 'Save and return to main menu'
        }
      ]
    });
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-fantasy-parchment flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight mb-4">
            No Character Found
          </h2>
          <p className="text-fantasy-shadow mb-6">
            You need to create a character before starting an adventure.
          </p>
          <button onClick={goToMainMenu} className="constructor-button">
            Return to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden">
      {/* Background with fantasy atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-fantasy-midnight/80 via-slate-900/70 to-fantasy-shadow/80"></div>
      
      {/* Character portrait overlay */}
      {character.portraitUrl && (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-20 h-24 rounded-lg border-2 border-fantasy-gold overflow-hidden shadow-xl">
            <img
              src={character.portraitUrl}
              alt={`${character.name} portrait`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Test buttons */}
      <div className="absolute top-4 right-4 z-[100] flex flex-col gap-2">
        <button
          onClick={() => {
            console.log('🧪 TEST BUTTON CLICKED - This should always work');
            alert('Test button works!');
          }}
          className="px-3 py-1 bg-green-500 text-white rounded text-xs border-2 border-white"
        >
          TEST
        </button>
        <button
          onClick={() => {
            console.log('🏠 Main Menu button clicked');
            console.log('🏠 goToMainMenu function:', typeof goToMainMenu);
            console.log('🏠 Store object:', store);
            try {
              // Try direct store access
              store.goToMainMenu();
              console.log('🏠 Successfully called store.goToMainMenu');
            } catch (error) {
              console.error('🏠 Error calling store.goToMainMenu:', error);
              try {
                goToMainMenu();
                console.log('🏠 Successfully called destructured goToMainMenu');
              } catch (error2) {
                console.error('🏠 Error calling destructured goToMainMenu:', error2);
              }
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg border-2 border-yellow-400 hover:bg-red-600 transition-colors text-sm font-medium backdrop-blur-sm cursor-pointer"
        >
          Main Menu
        </button>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-fantasy-gold/30 border-t-fantasy-gold rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-fantasy">
                Preparing your adventure...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Content */}
      {currentScenario && !isLoading && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
            {/* Scenario Card */}
            <div className="bg-fantasy-parchment/95 backdrop-blur-sm rounded-2xl border-3 border-fantasy-gold shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="fantasy-border-b p-6">
                <h1 className="text-2xl md:text-3xl font-fantasy font-bold text-fantasy-midnight text-center">
                  {currentScenario.title}
                </h1>
                <div className="text-center mt-2 text-fantasy-bronze">
                  <span className="text-sm font-medium">
                    Playing as {character.name} the {character.class.name}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 md:p-8">
                <div className="prose prose-fantasy max-w-none mb-8">
                  <p className="text-fantasy-shadow text-lg leading-relaxed whitespace-pre-line font-adventure">
                    {currentScenario.description}
                  </p>
                </div>

                {/* Choices */}
                <div className="space-y-4">
                  <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-4 text-center">
                    What do you choose?
                  </h3>
                  
                  {currentScenario.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleChoice(choice.id)}
                      className="w-full p-4 bg-white/80 hover:bg-white rounded-xl border-2 border-fantasy-bronze/30 hover:border-fantasy-gold transition-all duration-200 text-left group shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fantasy-gold/20 border-2 border-fantasy-gold/40 flex items-center justify-center font-bold text-fantasy-midnight group-hover:bg-fantasy-gold/30 transition-colors">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-fantasy font-bold text-fantasy-midnight text-lg mb-1 group-hover:text-fantasy-gold transition-colors">
                            {choice.text}
                          </h4>
                          <p className="text-fantasy-shadow text-sm">
                            {choice.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Character Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-fantasy-parchment/80 backdrop-blur-sm rounded-xl border-2 border-fantasy-bronze p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-fantasy-shadow">HP:</span>
                    <span className="font-bold text-fantasy-midnight">
                      {character.currentHp}/{character.maxHp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-fantasy-shadow">Level:</span>
                    <span className="font-bold text-fantasy-midnight">{character.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-fantasy-shadow">AC:</span>
                    <span className="font-bold text-fantasy-midnight">{character.armorClass}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 text-xs">
                  {Object.entries(character.abilities).map(([ability, score]) => (
                    <div key={ability} className="bg-fantasy-gold/20 rounded px-2 py-1 border border-fantasy-gold/40">
                      <span className="font-bold">{ability.slice(0, 3).toUpperCase()}</span>
                      <span className="ml-1">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}