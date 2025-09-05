import { useState } from 'react';
import useGameStore from '../../stores/gameStore';
import SimpleCampaignGenerator from './SimpleCampaignGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import type { CampaignGenerationRequest, CampaignGenerationResult } from '../../types/streamlinedCampaign';
import { claudeApi } from '../../services/claudeApi';

interface CampaignConstructorIntegrationProps {
  onConstructorComplete: () => void;
}

export default function CampaignConstructorIntegration({
  onConstructorComplete
}: CampaignConstructorIntegrationProps) {
  const { 
    character,
    goToGame,
    campaigns,
    saveCampaignToSlot,
    setCurrentScene
  } = useGameStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<CampaignGenerationResult | null>(null);
  const [showCampaignPreview, setShowCampaignPreview] = useState(false);

  const handleCampaignGenerationRequest = async (request: CampaignGenerationRequest) => {
    console.log('🚀 Starting campaign generation:', request);
    setIsGenerating(true);

    try {
      // Generate the complete campaign using Claude AI
      const campaign = await claudeApi.generateCampaign(request);
      console.log('✅ Campaign generated successfully:', campaign);

      setGeneratedCampaign(campaign);
      setShowCampaignPreview(true);
    } catch (error) {
      console.error('❌ Campaign generation failed:', error);
      // Could show error UI here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartAdventure = () => {
    if (!generatedCampaign) return;

    console.log('🎯 Starting adventure with generated campaign:', generatedCampaign.title);
    
    // Create the first scene from the first decision
    const firstDecision = generatedCampaign.decisions[0];
    const firstScene = {
      id: `campaign_${generatedCampaign.id}_decision_1`,
      title: firstDecision.title,
      description: firstDecision.scenario,
      choices: firstDecision.choices.map(choice => ({
        id: choice.id,
        text: choice.text,
        abilityCheck: choice.abilityCheck
      })),
      campaignContext: {
        campaignId: generatedCampaign.id,
        decisionId: firstDecision.id,
        totalDecisions: generatedCampaign.decisions.length
      }
    };

    // Set the first scene
    setCurrentScene(firstScene);

    // Save campaign to current slot
    if (campaigns.currentSlot) {
      saveCampaignToSlot(campaigns.currentSlot);
    }

    // Go to game and complete the constructor flow
    goToGame();
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
            Please create a character before generating your campaign.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!showCampaignPreview ? (
          <motion.div
            key="generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SimpleCampaignGenerator
              onGenerateComplete={handleCampaignGenerationRequest}
              characterName={character.name}
              characterClass={character.class.name}
              characterBackstory={character.backstory || ''}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-gradient-to-b from-fantasy-midnight to-fantasy-shadow flex items-center justify-center p-4"
          >
            <div className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-4xl p-8">
              {/* Campaign Preview Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📜</div>
                <h1 className="font-fantasy text-3xl font-bold text-fantasy-midnight mb-2">
                  Your Adventure Awaits
                </h1>
                <p className="text-fantasy-shadow">
                  Campaign generated for <span className="font-semibold text-fantasy-midnight">{character.name}</span>
                </p>
              </div>

              {generatedCampaign && (
                <div className="space-y-6">
                  {/* Campaign Title and Description */}
                  <div className="bg-white/50 rounded-lg p-6 text-center">
                    <h2 className="font-fantasy text-2xl font-bold text-fantasy-midnight mb-3">
                      {generatedCampaign.title}
                    </h2>
                    <p className="text-fantasy-shadow text-lg leading-relaxed">
                      {generatedCampaign.description}
                    </p>
                  </div>

                  {/* Campaign Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-fantasy-gold/10 rounded-lg p-4">
                      <h3 className="font-fantasy font-bold text-fantasy-midnight mb-2">
                        📍 Setting
                      </h3>
                      <p className="text-fantasy-shadow">{generatedCampaign.setting}</p>
                    </div>
                    <div className="bg-fantasy-bronze/10 rounded-lg p-4">
                      <h3 className="font-fantasy font-bold text-fantasy-midnight mb-2">
                        🎯 Primary Goal
                      </h3>
                      <p className="text-fantasy-shadow">{generatedCampaign.mainGoal}</p>
                    </div>
                  </div>

                  {/* Keywords Display */}
                  {generatedCampaign.keywords.length > 0 && (
                    <div className="bg-fantasy-silver/10 rounded-lg p-4">
                      <h3 className="font-fantasy font-bold text-fantasy-midnight mb-3">
                        🏷️ Adventure Elements
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedCampaign.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-fantasy-bronze/20 text-fantasy-midnight rounded-full border border-fantasy-bronze text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Campaign Stats */}
                  <div className="bg-fantasy-crimson/10 rounded-lg p-4 text-center">
                    <h3 className="font-fantasy font-bold text-fantasy-midnight mb-3">
                      📊 Adventure Overview
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-fantasy-midnight">Decisions</div>
                        <div className="text-fantasy-shadow">{generatedCampaign.decisions.length}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-fantasy-midnight">Type</div>
                        <div className="text-fantasy-shadow capitalize">{generatedCampaign.generationType}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-fantasy-midnight">Character</div>
                        <div className="text-fantasy-shadow">{character.class.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setShowCampaignPreview(false)}
                      className="flex-1 py-3 bg-fantasy-silver text-fantasy-midnight font-medium rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      ← Generate Different Campaign
                    </button>
                    <button
                      onClick={handleStartAdventure}
                      className="flex-2 py-3 bg-fantasy-crimson text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Begin Adventure! ⚔️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-fantasy-parchment rounded-xl p-8 text-center max-w-md mx-4">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight mb-3">
                AI Crafting Your Adventure
              </h3>
              <p className="text-fantasy-shadow mb-6">
                Claude is generating a personalized 15-decision campaign for {character.name}...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-fantasy-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-fantasy-bronze rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-fantasy-crimson rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}