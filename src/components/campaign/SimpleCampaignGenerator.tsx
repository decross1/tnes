import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleCampaignGeneratorProps {
  onGenerateComplete: (campaignData: CampaignGenerationRequest) => void;
  characterName: string;
  characterClass: string;
  characterBackstory: string;
}

interface CampaignGenerationRequest {
  type: 'keywords' | 'random';
  keywords?: string[];
  characterIntegration: {
    name: string;
    class: string;
    backstory: string;
  };
}

export default function SimpleCampaignGenerator({
  onGenerateComplete,
  characterName,
  characterClass,
  characterBackstory
}: SimpleCampaignGeneratorProps) {
  const [generationType, setGenerationType] = useState<'keywords' | 'random' | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddKeyword = useCallback(() => {
    if (currentKeyword.trim() && keywords.length < 5 && !keywords.includes(currentKeyword.trim())) {
      setKeywords(prev => [...prev, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  }, [currentKeyword, keywords]);

  const handleRemoveKeyword = useCallback((keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);

    const campaignData: CampaignGenerationRequest = {
      type: generationType!,
      keywords: generationType === 'keywords' ? keywords : undefined,
      characterIntegration: {
        name: characterName,
        class: characterClass,
        backstory: characterBackstory
      }
    };

    // Small delay for UX
    setTimeout(() => {
      onGenerateComplete(campaignData);
      setIsGenerating(false);
    }, 1000);
  }, [generationType, keywords, characterName, characterClass, characterBackstory, onGenerateComplete]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      handleAddKeyword();
    }
  }, [handleAddKeyword, currentKeyword]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fantasy-midnight to-fantasy-shadow flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="font-fantasy text-3xl font-bold text-fantasy-midnight mb-2">
            Campaign Generator
          </h1>
          <p className="text-fantasy-shadow">
            Ready to begin <span className="font-semibold text-fantasy-midnight">{characterName}</span>'s adventure?
          </p>
        </div>

        {!generationType ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-center text-fantasy-shadow mb-8">
              Choose how you'd like to generate your campaign:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGenerationType('keywords')}
                className="p-6 bg-white rounded-lg border-2 border-fantasy-gold hover:border-fantasy-bronze transition-colors"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight mb-2">
                  Guided by Keywords
                </h3>
                <p className="text-sm text-fantasy-shadow">
                  Provide up to 5 keywords to guide your adventure's theme and direction
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGenerationType('random')}
                className="p-6 bg-white rounded-lg border-2 border-fantasy-silver hover:border-fantasy-bronze transition-colors"
              >
                <div className="text-4xl mb-3">🎲</div>
                <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight mb-2">
                  Surprise Me!
                </h3>
                <p className="text-sm text-fantasy-shadow">
                  Let the AI create a completely random adventure tailored to your character
                </p>
              </motion.button>
            </div>
          </motion.div>
        ) : generationType === 'keywords' ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight">
                Adventure Keywords
              </h3>
              <button
                onClick={() => setGenerationType(null)}
                className="text-fantasy-bronze hover:text-fantasy-midnight transition-colors"
              >
                ← Back
              </button>
            </div>

            <p className="text-fantasy-shadow mb-6">
              Add up to 5 keywords that will shape your adventure. Think about themes, locations, creatures, or story elements you'd like to encounter.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a keyword (e.g., dragons, mystery, ancient ruins...)"
                  className="flex-1 px-4 py-2 border-2 border-fantasy-silver rounded-lg focus:border-fantasy-gold focus:outline-none"
                  maxLength={20}
                  disabled={keywords.length >= 5}
                />
                <button
                  onClick={handleAddKeyword}
                  disabled={!currentKeyword.trim() || keywords.length >= 5}
                  className="px-4 py-2 bg-fantasy-gold text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                <AnimatePresence>
                  {keywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 px-3 py-1 bg-fantasy-bronze/20 text-fantasy-midnight rounded-full border border-fantasy-bronze"
                    >
                      <span className="text-sm font-medium">{keyword}</span>
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-fantasy-bronze hover:text-fantasy-crimson transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-sm text-fantasy-shadow">
                {keywords.length}/5 keywords • {keywords.length === 0 ? 'Add at least 1 keyword to continue' : 'Ready to generate!'}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={keywords.length === 0 || isGenerating}
                className="w-full py-3 bg-fantasy-crimson text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Campaign...
                  </div>
                ) : (
                  'Generate My Campaign ⚔️'
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight">
                Random Adventure
              </h3>
              <button
                onClick={() => setGenerationType(null)}
                className="text-fantasy-bronze hover:text-fantasy-midnight transition-colors"
              >
                ← Back
              </button>
            </div>

            <div className="text-6xl mb-4">🎲</div>
            <p className="text-fantasy-shadow mb-8">
              The AI will create a completely unique adventure based on <span className="font-semibold text-fantasy-midnight">{characterName}</span>'s background as a {characterClass}.
            </p>

            <div className="bg-fantasy-gold/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-fantasy-midnight">
                <strong>Your Character:</strong> {characterName} the {characterClass}
                <br />
                <strong>Backstory Preview:</strong> {characterBackstory.slice(0, 100)}...
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-fantasy-crimson text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Random Campaign...
                </div>
              ) : (
                'Generate Random Campaign 🎲'
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}