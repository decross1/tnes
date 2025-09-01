import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';

interface SimpleCampaignCreatorProps {
  onComplete: (campaignData: CampaignCreationResult) => void;
  onCancel: () => void;
}

interface CampaignCreationResult {
  type: 'ai-generated' | 'keyword-guided' | 'user-prompt';
  data: {
    keywords?: string[];
    userPrompt?: string;
    characterIntegration: boolean;
  };
  firstScenario: string;
}

export default function SimpleCampaignCreator({ onComplete, onCancel }: SimpleCampaignCreatorProps) {
  const { character } = useGameStore();
  const [selectedType, setSelectedType] = useState<'ai-generated' | 'keyword-guided' | 'user-prompt' | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTypeSelect = (type: 'ai-generated' | 'keyword-guided' | 'user-prompt') => {
    setSelectedType(type);
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && keywords.length < 8 && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleGenerate = async () => {
    if (!selectedType || !character) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate campaign generation based on type
      const campaignData: CampaignCreationResult = {
        type: selectedType,
        data: {
          keywords: selectedType === 'keyword-guided' ? keywords : undefined,
          userPrompt: selectedType === 'user-prompt' ? userPrompt : undefined,
          characterIntegration: selectedType !== 'user-prompt' // Always integrate character except for custom prompts
        },
        firstScenario: generateFirstScenario(selectedType, character, keywords, userPrompt)
      };
      
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onComplete(campaignData);
    } catch (error) {
      console.error('Campaign generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = () => {
    switch (selectedType) {
      case 'ai-generated':
        return true;
      case 'keyword-guided':
        return keywords.length >= 2;
      case 'user-prompt':
        return userPrompt.trim().length >= 50;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="fantasy-border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight">
                Create Your Campaign
              </h2>
              <p className="text-fantasy-shadow mt-1">
                Choose how you'd like to build your adventure for{' '}
                <span className="font-semibold text-fantasy-midnight">{character?.name}</span>
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-fantasy-shadow hover:text-fantasy-midnight text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!selectedType ? (
            // Step 1: Choose Campaign Creation Type
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-6 text-center">
                How would you like to create your campaign?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Generated */}
                <motion.button
                  onClick={() => handleTypeSelect('ai-generated')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white rounded-xl border-2 border-fantasy-bronze/30 hover:border-fantasy-gold hover:shadow-lg transition-all text-left group"
                >
                  <div className="text-4xl mb-4">🎲</div>
                  <h4 className="font-fantasy font-bold text-fantasy-midnight text-lg mb-3">
                    AI Generated
                  </h4>
                  <p className="text-fantasy-shadow text-sm mb-4 leading-relaxed">
                    Let the AI create a completely unique adventure, sometimes incorporating your backstory, 
                    other times creating entirely new worlds while keeping key character elements.
                  </p>
                  <div className="text-xs text-fantasy-bronze">
                    <strong>Best for:</strong> Quick start, surprise adventures
                  </div>
                </motion.button>

                {/* Keyword Guided */}
                <motion.button
                  onClick={() => handleTypeSelect('keyword-guided')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white rounded-xl border-2 border-fantasy-bronze/30 hover:border-fantasy-gold hover:shadow-lg transition-all text-left group"
                >
                  <div className="text-4xl mb-4">🏷️</div>
                  <h4 className="font-fantasy font-bold text-fantasy-midnight text-lg mb-3">
                    Keyword Guided
                  </h4>
                  <p className="text-fantasy-shadow text-sm mb-4 leading-relaxed">
                    Provide keywords and themes to guide the AI in building your campaign. 
                    Shape the adventure while letting AI handle the details.
                  </p>
                  <div className="text-xs text-fantasy-bronze">
                    <strong>Best for:</strong> Controlled creativity, themed adventures
                  </div>
                </motion.button>

                {/* Custom Prompt */}
                <motion.button
                  onClick={() => handleTypeSelect('user-prompt')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white rounded-xl border-2 border-fantasy-bronze/30 hover:border-fantasy-gold hover:shadow-lg transition-all text-left group"
                >
                  <div className="text-4xl mb-4">✍️</div>
                  <h4 className="font-fantasy font-bold text-fantasy-midnight text-lg mb-3">
                    Custom Prompt
                  </h4>
                  <p className="text-fantasy-shadow text-sm mb-4 leading-relaxed">
                    Write your own detailed prompt for the campaign generator. 
                    Full creative control over the story direction and elements.
                  </p>
                  <div className="text-xs text-fantasy-crimson">
                    <strong>⚠️ Advanced:</strong> May cause volatile outputs
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Step 2: Configure Selected Type
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setSelectedType(null)}
                className="mb-4 text-fantasy-bronze hover:text-fantasy-midnight text-sm flex items-center"
              >
                ← Back to selection
              </button>

              {selectedType === 'ai-generated' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-6">🎲</div>
                  <h3 className="text-2xl font-fantasy font-bold text-fantasy-midnight mb-4">
                    AI Generated Campaign
                  </h3>
                  <p className="text-fantasy-shadow text-lg max-w-2xl mx-auto mb-8">
                    The AI will create a unique adventure for {character?.name} the {character?.class.name}, 
                    drawing inspiration from your character's backstory and combining it with creative new elements.
                  </p>
                  <div className="bg-fantasy-gold/10 border border-fantasy-gold/30 rounded-lg p-4 max-w-xl mx-auto">
                    <h4 className="font-semibold text-fantasy-midnight mb-2">What to expect:</h4>
                    <ul className="text-sm text-fantasy-shadow text-left space-y-1">
                      <li>• Unique storyline tailored to your character</li>
                      <li>• Unpredictable but logical narrative flow</li>
                      <li>• Mix of character backstory and new elements</li>
                      <li>• Balanced difficulty and pacing</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedType === 'keyword-guided' && (
                <div>
                  <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-4">
                    Guide Your Adventure with Keywords
                  </h3>
                  <p className="text-fantasy-shadow mb-6">
                    Add 2-8 keywords or themes that you'd like to see in your campaign. 
                    The AI will weave these elements into the story.
                  </p>

                  <div className="mb-6">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        placeholder="Enter a keyword or theme..."
                        className="flex-1 px-3 py-2 border-2 border-fantasy-bronze/30 rounded-lg focus:border-fantasy-gold focus:outline-none"
                        maxLength={30}
                      />
                      <button
                        onClick={handleAddKeyword}
                        disabled={!currentKeyword.trim() || keywords.length >= 8}
                        className="constructor-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 bg-fantasy-gold/20 border border-fantasy-gold/40 rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="text-fantasy-bronze hover:text-fantasy-midnight ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xs text-fantasy-shadow mt-2">
                      {keywords.length}/8 keywords • {keywords.length < 2 ? 'Add at least 2 keywords' : 'Ready to generate!'}
                    </p>
                  </div>

                  <div className="bg-fantasy-bronze/10 border border-fantasy-bronze/30 rounded-lg p-4">
                    <h4 className="font-semibold text-fantasy-midnight mb-2">Example keywords:</h4>
                    <div className="text-sm text-fantasy-shadow">
                      <strong>Themes:</strong> mystery, revenge, ancient magic, political intrigue<br/>
                      <strong>Settings:</strong> underground city, haunted forest, pirate ship, wizard tower<br/>
                      <strong>Elements:</strong> cursed artifact, lost family, dragon cult, time travel
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 'user-prompt' && (
                <div>
                  <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-4">
                    Write Your Campaign Prompt
                  </h3>
                  <div className="bg-fantasy-crimson/10 border border-fantasy-crimson/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚠️</div>
                      <div>
                        <h4 className="font-semibold text-fantasy-crimson mb-1">Advanced Option</h4>
                        <p className="text-sm text-fantasy-shadow">
                          Custom prompts may produce unpredictable or volatile outputs. 
                          Be specific about what you want to ensure better results.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Describe the campaign you want in detail. Include setting, themes, conflicts, NPCs, and any specific elements you want to see. Be as detailed as possible for best results..."
                      className="constructor-textarea h-48"
                      maxLength={1000}
                    />
                    <div className="constructor-character-counter">
                      {userPrompt.length}/1000 characters
                      {userPrompt.length < 50 && (
                        <span className="text-fantasy-crimson ml-2">
                          (Minimum 50 characters for generation)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-fantasy-bronze/10 border border-fantasy-bronze/30 rounded-lg p-4">
                    <h4 className="font-semibold text-fantasy-midnight mb-2">Tips for better prompts:</h4>
                    <ul className="text-sm text-fantasy-shadow space-y-1">
                      <li>• Be specific about setting, tone, and main conflict</li>
                      <li>• Mention if you want your character's backstory integrated</li>
                      <li>• Describe key NPCs, locations, or plot elements</li>
                      <li>• Specify the type of adventure (dungeon crawl, social intrigue, etc.)</li>
                      <li>• Include any specific themes or moral dilemmas</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="fantasy-border-t p-4 flex justify-between items-center">
          <button
            onClick={onCancel}
            className="constructor-button secondary"
          >
            Cancel
          </button>

          {selectedType && (
            <motion.button
              onClick={handleGenerate}
              disabled={!canGenerate() || isGenerating}
              className="constructor-button px-8"
              whileHover={canGenerate() && !isGenerating ? { scale: 1.05 } : {}}
              whileTap={canGenerate() && !isGenerating ? { scale: 0.95 } : {}}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Campaign...
                </span>
              ) : (
                'Generate Campaign ⚔️'
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to generate first scenario based on campaign type
function generateFirstScenario(
  type: 'ai-generated' | 'keyword-guided' | 'user-prompt',
  character: any,
  keywords: string[],
  userPrompt: string
): string {
  const characterName = character?.name || 'Hero';
  const characterClass = character?.class?.name || 'Adventurer';

  switch (type) {
    case 'ai-generated':
      return `${characterName} the ${characterClass} stands at a crossroads in the misty dawn. The road ahead splits three ways: a well-traveled path leading toward a bustling town where smoke rises from chimneys, a narrow trail winding up into dark mountains where strange lights flicker, and an overgrown route disappearing into an ancient forest where no birds sing. Each path promises different adventures, different dangers, and different rewards.

What do you choose?

**A)** Take the well-traveled road to the town, seeking information and supplies among civilization
**B)** Follow the mountain trail toward the mysterious lights, embracing the unknown dangers above
**C)** Enter the silent forest, trusting your instincts to guide you through the unnatural quiet`;

    case 'keyword-guided':
      const keywordContext = keywords.length > 0 
        ? `As fate would have it, whispers of ${keywords.slice(0, 2).join(' and ')} have been following you for days.` 
        : '';
      
      return `${characterName} the ${characterClass} arrives at the village of Millhaven just as the sun sets behind storm clouds. ${keywordContext} The innkeeper, a nervous halfling, approaches you with urgent news: "Adventurer! Thank the gods you're here. We need someone brave enough to help us. There's been..." He glances around nervously before continuing in a whisper.

How do you respond?

**A)** "Tell me everything. I'm here to help." (Listen to his full story and offer immediate assistance)
**B)** "What's in it for me?" (Negotiate payment and terms before committing to anything)
**C)** "I'll need a room and meal first." (Take care of your own needs before getting involved in local troubles)`;

    case 'user-prompt':
      // For custom prompts, create a generic scenario that can adapt to any setting
      return `${characterName} the ${characterClass} finds themselves at the beginning of their greatest adventure yet. The circumstances that brought you here are exactly as you envisioned, and now the moment of first crucial decision arrives. The situation unfolds before you with all the elements you specified, and three clear paths of action present themselves.

What is your choice?

**A)** Take the bold, direct approach - face the challenge head-on with courage and determination
**B)** Use cunning and strategy - approach the situation with careful planning and clever thinking  
**C)** Seek more information first - investigate further before committing to any major action`;

    default:
      return 'An error occurred generating the scenario.';
  }
}