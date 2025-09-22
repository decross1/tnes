import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import DiceRoller from '../game/DiceRoller';
import { claudeApi } from '../../services/claudeApi';
import type { 
  CampaignGenerationResult, 
  CampaignDecision, 
  CampaignChoice, 
  CampaignPlayState,
  CampaignDecisionResult,
  NextScenarioRequest,
  StoryContext,
  DecisionSummary,
  NarrativePhase
} from '../../types/streamlinedCampaign';

export default function StreamlinedGameScreen() {
  const { 
    character,
    currentScene,
    goToMainMenu,
    addDecision
  } = useGameStore();

  // Local state for campaign progression
  const [activeCampaign, setActiveCampaign] = useState<CampaignGenerationResult | null>(null);
  const [playState, setPlayState] = useState<CampaignPlayState | null>(null);
  const [currentDecision, setCurrentDecision] = useState<CampaignDecision | null>(null);
  const [pendingRoll, setPendingRoll] = useState<{ choice: CampaignChoice; diceResult?: number } | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  
  // New state for AI-driven story tracking
  const [storyContext, setStoryContext] = useState<StoryContext | null>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Initialize campaign from scene context
  useEffect(() => {
    console.log('🎮 Initializing StreamlinedGameScreen with scene:', currentScene);
    
    if (currentScene?.campaignContext) {
      // For now, we'll need to reconstruct the campaign from scene context
      // In a full implementation, this would be stored in the game store
      console.log('📊 Campaign context found:', currentScene.campaignContext);
      
      // Create a basic current decision from the scene
      const mockDecision: CampaignDecision = {
        id: currentScene.campaignContext.decisionId || 1,
        title: currentScene.title,
        scenario: currentScene.description,
        choices: (currentScene.choices || []).map((choice, index) => ({
          id: choice.id || String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
          text: choice.text,
          type: 'exploration', // Default type
          abilityCheck: choice.abilityCheck,
          consequences: 'Your choice will affect the story...'
        }))
      };

      setCurrentDecision(mockDecision);
      
      // Initialize play state - ALWAYS set totalDecisions to 15 for dynamic campaigns
      setPlayState({
        campaignId: currentScene.campaignContext.campaignId || 'unknown',
        currentDecision: currentScene.campaignContext.decisionId || 1,
        totalDecisions: 15, // Fixed: Always 15 decisions for dynamic campaigns
        decisionHistory: [],
        isComplete: false,
        characterStatus: {
          currentHP: character?.hitPoints?.current || 20,
          maxHP: character?.hitPoints?.max || 20,
          conditions: [],
          inventory: []
        }
      });
    }
    // Initialize story context and campaign data from scene
    if (currentScene?.campaignContext && !storyContext) {
      // Get campaign data from the scene (passed from CampaignConstructorIntegration)
      let campaignData = activeCampaign;
      
      // Check if scene has campaign data embedded
      if (!campaignData && (currentScene as any).campaignData) {
        campaignData = (currentScene as any).campaignData as CampaignGenerationResult;
        setActiveCampaign(campaignData);
        console.log('📊 Loaded campaign data from scene:', campaignData.title);
      }
      
      // Fallback if still no campaign data
      if (!campaignData) {
        const fallbackCampaignData: CampaignGenerationResult = {
          id: currentScene.campaignContext.campaignId,
          title: 'Your Adventure',
          description: 'An AI-driven adventure that adapts to your choices',
          setting: 'A mysterious realm',
          mainGoal: 'Complete your quest and discover your destiny',
          characterIntegration: {
            name: character?.name || 'Hero',
            class: character?.class?.name || 'Adventurer',
            backstory: character?.backstory || 'A mysterious past guides your actions'
          },
          generationType: 'random',
          keywords: [],
          decisions: [] // Empty for dynamic generation
        };
        setActiveCampaign(fallbackCampaignData);
        campaignData = fallbackCampaignData;
      }
      
      const initialStoryContext: StoryContext = {
        campaignTitle: campaignData?.title || 'Your Adventure',
        campaignGoal: campaignData?.mainGoal || 'Complete your quest',
        setting: campaignData?.setting || 'A mysterious realm',
        keywords: campaignData?.keywords || [],
        allies: [],
        enemies: [],
        currentObjectives: [campaignData?.mainGoal || 'Begin your adventure'],
        characterCondition: 'healthy',
        inventory: []
      };
      setStoryContext(initialStoryContext);
      console.log('📖 Initialized story context:', initialStoryContext);
    }
  }, [currentScene, character]);

  // Helper function to determine current narrative phase
  const getNarrativePhase = (decisionNumber: number): NarrativePhase => {
    if (decisionNumber <= 3) return 'introduction';
    if (decisionNumber <= 8) return 'exploration';
    if (decisionNumber <= 12) return 'complications';
    if (decisionNumber <= 14) return 'climax';
    return 'resolution';
  };

  // Helper function to create detailed decision summaries for AI context
  const createDecisionSummaries = (history: CampaignDecisionResult[]): DecisionSummary[] => {
    return history.slice(-5).map(decision => {
      // Create detailed story impact based on success/failure
      let detailedImpact = decision.storyOutcome;
      
      if (decision.abilityCheck) {
        const rollInfo = `(rolled ${decision.abilityCheck.roll} vs DC ${decision.abilityCheck.dc})`;
        const outcomeDesc = decision.abilityCheck.result === 'success' ? 'succeeded' :
                           decision.abilityCheck.result === 'failure' ? 'failed' :
                           decision.abilityCheck.result === 'critical_success' ? 'critically succeeded' :
                           decision.abilityCheck.result === 'critical_failure' ? 'critically failed' : 'attempted';
        
        detailedImpact = `${character?.name} ${outcomeDesc} ${rollInfo}: ${decision.storyOutcome}`;
      }
      
      return {
        decisionNumber: decision.decisionId,
        title: `Decision ${decision.decisionId}`,
        choiceMade: decision.choiceText,
        outcome: decision.abilityCheck?.result || 'no_roll',
        consequences: decision.consequences,
        storyImpact: detailedImpact
      };
    });
  };

  // Helper function to extract key events from decision history
  const extractKeyEvents = (history: CampaignDecisionResult[]): string[] => {
    return history
      .filter(decision => 
        decision.abilityCheck?.result === 'critical_success' || 
        decision.abilityCheck?.result === 'critical_failure' ||
        decision.storyOutcome.toLowerCase().includes('important') ||
        decision.storyOutcome.toLowerCase().includes('significant')
      )
      .map(decision => `${decision.choiceText}: ${decision.storyOutcome}`)
      .slice(-3); // Keep only the last 3 key events
  };

  const handleChoiceSelect = useCallback(async (choice: CampaignChoice) => {
    console.log('🎯 Player selected choice:', choice);

    if (choice.abilityCheck) {
      // Show dice rolling interface
      setPendingRoll({ choice });
    } else {
      // Process choice immediately without dice roll
      await processChoice(choice, null);
    }
  }, []);

  const handleDiceRoll = useCallback(async (result: number) => {
    if (!pendingRoll) return;

    console.log('🎲 Dice roll result:', result);
    
    const success = result >= (pendingRoll.choice.abilityCheck?.dc || 10);
    console.log('✅ Ability check:', { 
      roll: result, 
      dc: pendingRoll.choice.abilityCheck?.dc, 
      success 
    });

    await processChoice(pendingRoll.choice, result);
    setPendingRoll(null);
  }, [pendingRoll]);

  const processChoice = async (choice: CampaignChoice, diceResult: number | null) => {
    if (!playState || !currentDecision) return;

    // Create decision result
    const decisionResult: CampaignDecisionResult = {
      decisionId: currentDecision.id,
      choiceId: choice.id,
      choiceText: choice.text,
      abilityCheck: diceResult !== null && choice.abilityCheck ? {
        ability: choice.abilityCheck.ability,
        dc: choice.abilityCheck.dc,
        roll: diceResult,
        result: diceResult >= choice.abilityCheck.dc 
          ? (diceResult === 20 ? 'critical_success' : 'success')
          : (diceResult === 1 ? 'critical_failure' : 'failure')
      } : undefined,
      consequences: choice.consequences,
      storyOutcome: generateStoryOutcome(choice, diceResult),
      timestamp: new Date()
    };

    // Handle special completion choices
    if (playState.isComplete && currentDecision.title.includes('Campaign Complete')) {
      if (choice.id === 'A') {
        // Generate Expansion Pack
        console.log('🚀 Generating expansion pack...');
        if (activeCampaign && playState) {
          try {
            const { claudeApi } = await import('../../services/claudeApi');
            const expansionCampaign = await claudeApi.generateExpansionPack(activeCampaign, playState);
            console.log('✅ Expansion pack generated:', expansionCampaign.title);
            
            // Set the new expansion as the active campaign
            setActiveCampaign(expansionCampaign);
            
            // Create new play state for the expansion
            const expansionPlayState = {
              campaignId: expansionCampaign.id,
              currentDecision: 1,
              totalDecisions: expansionCampaign.decisions.length,
              decisionHistory: [],
              isComplete: false,
              characterStatus: {
                currentHP: character?.hitPoints?.current || 20,
                maxHP: character?.hitPoints?.max || 20,
                conditions: [],
                inventory: []
              }
            };
            setPlayState(expansionPlayState);
            
            // Set first decision of expansion
            const firstDecision = expansionCampaign.decisions[0];
            setCurrentDecision(firstDecision);
          } catch (error) {
            console.error('❌ Failed to generate expansion pack:', error);
            alert('Failed to generate expansion pack. Please try again.');
          }
        }
        return;
      } else if (choice.id === 'B') {
        // View Full Campaign Summary
        console.log('📊 Showing campaign summary...');
        // TODO: Create detailed summary modal
        alert('Campaign summary would be displayed here!');
        return;
      } else if (choice.id === 'C') {
        // Return to Main Menu
        console.log('🏠 Returning to main menu...');
        goToMainMenu();
        return;
      }
    }

    // Update play state
    const newPlayState = {
      ...playState,
      currentDecision: playState.currentDecision + 1,
      decisionHistory: [...playState.decisionHistory, decisionResult],
      isComplete: playState.currentDecision >= playState.totalDecisions
    };

    setPlayState(newPlayState);

    // Add to game store (for story scroll)
    addDecision({
      id: `decision_${currentDecision.id}`,
      sceneId: `campaign_scene_${currentDecision.id}`,
      choiceId: choice.id,
      choiceText: choice.text,
      result: decisionResult.abilityCheck?.result || 'no_roll',
      timestamp: new Date()
    });

    // Check if campaign is complete
    if (newPlayState.isComplete) {
      handleCampaignComplete(newPlayState);
    } else {
      // Generate next decision (now async)
      await generateNextDecision(newPlayState.currentDecision);
    }
  };

  const generateStoryOutcome = (choice: CampaignChoice, diceResult: number | null): string => {
    if (diceResult !== null && choice.abilityCheck) {
      const success = diceResult >= choice.abilityCheck.dc;
      return success 
        ? `✅ Success! ${choice.consequences}`
        : `❌ Failure. Despite your efforts, the outcome was not what you hoped.`;
    }
    return choice.consequences;
  };

  const generateNextDecision = async (decisionNumber: number) => {
    if (!character || !playState || !storyContext) {
      console.error('Missing required data for AI scenario generation');
      return;
    }

    setIsGeneratingScenario(true);
    
    try {
      console.log(`🤖 Generating AI scenario for decision ${decisionNumber}`);
      
      // Always try AI generation first for decisions > 1
      if (decisionNumber > 1) {
        // Prepare AI generation request
        const narrativePhase = getNarrativePhase(decisionNumber);
        const recentDecisions = createDecisionSummaries(playState.decisionHistory);
        const keyEvents = extractKeyEvents(playState.decisionHistory);

        const request: NextScenarioRequest = {
          character: {
            name: character.name,
            class: character.class.name,
            backstory: character.backstory || 'A mysterious past guides your actions.',
            level: character.level
          },
          decisionNumber,
          narrativePhase,
          storyContext,
          recentDecisions,
          keyEvents
        };

        try {
          // Generate the scenario using AI
          const response = await claudeApi.generateNextScenario(request);
          
          console.log('✅ AI scenario generated successfully:', response.decision.title);
          
          // Update story context with any changes from AI
          if (response.updatedStoryContext) {
            setStoryContext(prev => prev ? { ...prev, ...response.updatedStoryContext } : prev);
          }
          
          setCurrentDecision(response.decision);
          setIsGeneratingScenario(false);
          return;
        } catch (aiError) {
          console.warn('AI generation failed, trying pre-generated fallback:', aiError);
          // Continue to pre-generated fallback below
        }
      }

      // Fallback: Use pre-generated campaign decisions (only for decision 1 or if AI fails)
      if (activeCampaign && activeCampaign.decisions) {
        const nextDecision = activeCampaign.decisions.find(d => d.id === decisionNumber);
        if (nextDecision) {
          console.log(`🎯 Using fallback decision ${decisionNumber} from generated campaign`);
          setCurrentDecision(nextDecision);
          setIsGeneratingScenario(false);
          return;
        }
      }
      
    } catch (error) {
      console.error('Failed to generate AI scenario, using enhanced fallback:', error);
      
      // Enhanced fallback that's still better than the old generic version
      const narrativePhase = getNarrativePhase(decisionNumber);
      const fallbackDecision: CampaignDecision = {
        id: decisionNumber,
        title: `${narrativePhase === 'introduction' ? 'The Journey Begins' : 
                narrativePhase === 'exploration' ? 'Deeper Into Mystery' :
                narrativePhase === 'complications' ? 'Rising Tensions' :
                narrativePhase === 'climax' ? 'The Final Test' : 'Resolution'}`,
        scenario: `${character.name} faces a pivotal moment in the ${narrativePhase} of your adventure. The choices you've made have led to this critical juncture where your ${character.class.name} skills will be put to the test.`,
        choices: [
          {
            id: 'A',
            text: `Use your ${character.class.name} training to take direct action`,
            type: 'combat',
            abilityCheck: { 
              ability: character.class.name === 'Fighter' ? 'strength' : 
                      character.class.name === 'Rogue' ? 'dexterity' :
                      character.class.name === 'Wizard' ? 'intelligence' : 'wisdom', 
              dc: Math.min(20, Math.max(10, 10 + Math.floor(decisionNumber / 2)))
            },
            consequences: 'You rely on your primary abilities to overcome the challenge'
          },
          {
            id: 'B',
            text: 'Look for a clever alternative approach',
            type: 'tactical',
            abilityCheck: { ability: 'intelligence', dc: Math.min(20, Math.max(10, 12 + Math.floor(decisionNumber / 3))) },
            consequences: 'You attempt to find an innovative solution'
          },
          {
            id: 'C',
            text: 'Try to understand the situation better first',
            type: 'exploration',
            abilityCheck: { ability: 'wisdom', dc: Math.min(20, Math.max(10, 8 + Math.floor(decisionNumber / 2))) },
            consequences: 'You gather more information before acting'
          }
        ]
      };
      
      setCurrentDecision(fallbackDecision);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const handleCampaignComplete = (finalPlayState: CampaignPlayState) => {
    console.log('🎉 Campaign completed!', finalPlayState);
    
    // Create summary of the adventure
    const campaignSummary = {
      characterName: character?.name || 'Unknown Hero',
      decisionsCompleted: finalPlayState.decisionHistory.length,
      totalDecisions: finalPlayState.totalDecisions,
      finalHP: finalPlayState.characterStatus.currentHP,
      survived: finalPlayState.characterStatus.currentHP > 0,
      keyChoices: finalPlayState.decisionHistory.slice(-3).map(d => ({
        decision: d.decisionId,
        choice: d.choiceText,
        outcome: d.storyOutcome
      }))
    };

    // Create completion state with summary
    const completionDecision: CampaignDecision = {
      id: finalPlayState.totalDecisions + 1,
      title: '🎉 Campaign Complete!',
      scenario: `Congratulations, ${campaignSummary.characterName}! You have successfully completed your adventure.
      
Through ${campaignSummary.decisionsCompleted} challenging decisions, you have proven yourself as a true hero. Your journey has come to an end with ${campaignSummary.finalHP} HP remaining.

Your adventure will be remembered for these pivotal moments:
${campaignSummary.keyChoices.map((choice, i) => `• ${choice.choice} - ${choice.outcome}`).join('\n')}

What would you like to do next?`,
      choices: [
        {
          id: 'A',
          text: 'Generate Expansion Pack',
          type: 'exploration',
          consequences: 'Continue your adventure with 15 new decisions based on your completed story'
        },
        {
          id: 'B', 
          text: 'View Full Campaign Summary',
          type: 'social',
          consequences: 'See a detailed breakdown of your entire adventure'
        },
        {
          id: 'C',
          text: 'Return to Main Menu',
          type: 'exploration', 
          consequences: 'Save your progress and start a new adventure'
        }
      ]
    };

    setCurrentDecision(completionDecision);
    setPlayState(prev => prev ? { ...prev, isComplete: true } : null);
  };

  if (!character || !currentDecision || !playState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fantasy-midnight to-fantasy-shadow flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-fantasy mb-4">Loading Adventure...</h2>
          <button
            onClick={goToMainMenu}
            className="px-6 py-3 bg-fantasy-gold text-fantasy-midnight rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fantasy-midnight to-fantasy-shadow">
      {/* Scenario Generation Loading Overlay */}
      <AnimatePresence>
        {isGeneratingScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-fantasy-parchment rounded-xl shadow-2xl p-8 text-center max-w-md mx-4"
            >
              <div className="w-16 h-16 border-4 border-fantasy-gold/30 border-t-fantasy-gold rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-2">
                Crafting Your Next Adventure...
              </h3>
              <p className="text-fantasy-shadow text-sm">
                The AI is weaving your story based on your previous choices and character development.
              </p>
              <div className="mt-4 text-xs text-fantasy-bronze">
                Decision {playState?.currentDecision || '?'} of {playState?.totalDecisions || 15}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-full bg-fantasy-shadow p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-fantasy-gold font-fantasy font-bold">
              Decision {playState.currentDecision} of {playState.totalDecisions}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={goToMainMenu}
                className="px-3 py-1 bg-fantasy-bronze text-fantasy-parchment rounded hover:bg-opacity-80 transition-colors text-sm"
                title="Return to Main Menu"
              >
                🏠 Menu
              </button>
              <button
                onClick={() => setShowProgress(!showProgress)}
                className="text-fantasy-bronze hover:text-fantasy-gold transition-colors"
                title="Show Progress"
              >
                📊
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-fantasy-gold rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${(playState.currentDecision / playState.totalDecisions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!pendingRoll ? (
              <motion.div
                key={`decision-${currentDecision.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-fantasy-parchment rounded-xl shadow-2xl p-8"
              >
                {/* Previous Story Context */}
                {playState && playState.decisionHistory.length > 0 && playState.decisionHistory[playState.decisionHistory.length - 1] && (
                  <div className="mb-8 p-4 bg-fantasy-silver/20 rounded-lg border-l-4 border-fantasy-bronze">
                    <h2 className="font-fantasy text-lg font-bold text-fantasy-midnight mb-3 flex items-center">
                      📖 Previous Story
                    </h2>
                    <div className="text-sm text-fantasy-shadow space-y-2">
                      <div>
                        <span className="font-semibold">Your Previous Choice:</span> {playState.decisionHistory[playState.decisionHistory.length - 1].choiceText}
                      </div>
                      {playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck && (
                        <div>
                          <span className="font-semibold">Roll Result:</span> {
                            playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck?.result === 'success' ? '✅' : 
                            playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck?.result === 'failure' ? '❌' : 
                            playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck?.result === 'critical_success' ? '🌟' : 
                            playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck?.result === 'critical_failure' ? '💥' : '➡️'
                          } Rolled {playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck.roll} vs DC {playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck.dc} 
                          ({playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck.result === 'success' || playState.decisionHistory[playState.decisionHistory.length - 1].abilityCheck.result === 'critical_success' ? 'Success' : 'Failure'})
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">What Happened:</span> {playState.decisionHistory[playState.decisionHistory.length - 1].storyOutcome}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scenario */}
                <div className="mb-8">
                  <h1 className="font-fantasy text-3xl font-bold text-fantasy-midnight mb-4 text-center">
                    {currentDecision.title}
                  </h1>
                  <div className="bg-white/30 rounded-lg p-6">
                    <p className="text-fantasy-shadow text-lg leading-relaxed">
                      {currentDecision.scenario}
                    </p>
                  </div>
                </div>

                {/* Choices */}
                <div className="space-y-4">
                  <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight text-center mb-6">
                    What do you do?
                  </h3>
                  {currentDecision.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 bg-white/50 hover:bg-fantasy-gold/20 border-2 border-fantasy-bronze hover:border-fantasy-gold rounded-lg transition-all text-left"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-bold text-fantasy-midnight text-xl">
                          {choice.id}.
                        </span>
                        <div className="flex-1">
                          <p className="text-fantasy-midnight font-medium">
                            {choice.text}
                          </p>
                          {choice.abilityCheck && (
                            <div className="text-sm text-fantasy-bronze mt-1">
                              🎲 {choice.abilityCheck.ability.charAt(0).toUpperCase() + choice.abilityCheck.ability.slice(1)} Check (DC {choice.abilityCheck.dc})
                            </div>
                          )}
                          <div className="text-xs text-fantasy-shadow mt-1 capitalize">
                            {choice.type} Choice
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Character Status */}
                <div className="mt-8 pt-6 border-t border-fantasy-bronze/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fantasy-shadow">
                      {character.name} the {character.class.name}
                    </span>
                    <span className="text-fantasy-shadow">
                      HP: {playState.characterStatus.currentHP}/{playState.characterStatus.maxHP}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dice-rolling"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-fantasy-parchment rounded-xl shadow-2xl p-8 text-center"
              >
                <h2 className="font-fantasy text-2xl font-bold text-fantasy-midnight mb-4">
                  Ability Check Required!
                </h2>
                <p className="text-fantasy-shadow mb-6">
                  Roll for <strong>{pendingRoll.choice.abilityCheck?.ability}</strong> (DC {pendingRoll.choice.abilityCheck?.dc})
                </p>
                
                <DiceRoller
                  character={character}
                  abilityCheck={{
                    ability: pendingRoll.choice.abilityCheck?.ability || 'strength',
                    dc: pendingRoll.choice.abilityCheck?.dc || 10
                  }}
                  onRollComplete={(result) => handleDiceRoll(result.total)}
                />

                <div className="mt-6 text-sm text-fantasy-shadow">
                  Choice: {pendingRoll.choice.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Detail Panel */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-fantasy-parchment shadow-2xl p-6 overflow-y-auto z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-fantasy text-xl font-bold text-fantasy-midnight">
                Adventure Progress
              </h3>
              <button
                onClick={() => setShowProgress(false)}
                className="text-fantasy-bronze hover:text-fantasy-midnight text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/30 rounded-lg p-4">
                <h4 className="font-semibold text-fantasy-midnight mb-2">Campaign Status</h4>
                <div className="text-sm text-fantasy-shadow">
                  <div>Decision: {playState.currentDecision}/{playState.totalDecisions}</div>
                  <div>Progress: {Math.round((playState.currentDecision / playState.totalDecisions) * 100)}%</div>
                </div>
              </div>

              {playState.decisionHistory.length > 0 && (
                <div className="bg-white/30 rounded-lg p-4">
                  <h4 className="font-semibold text-fantasy-midnight mb-2">Story Timeline</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {playState.decisionHistory.slice(-5).reverse().map((decision, index) => {
                      const outcomeIcon = decision.abilityCheck?.result === 'success' ? '✅' : 
                                         decision.abilityCheck?.result === 'failure' ? '❌' : 
                                         decision.abilityCheck?.result === 'critical_success' ? '🌟' : 
                                         decision.abilityCheck?.result === 'critical_failure' ? '💥' : '➡️';
                      
                      return (
                        <div key={decision.decisionId} className="border-l-2 border-fantasy-bronze/30 pl-3 pb-3">
                          <div className="font-medium text-fantasy-midnight text-sm mb-1">
                            Decision {decision.decisionId}: {decision.choiceId}
                          </div>
                          <div className="text-xs text-fantasy-shadow mb-1">
                            <strong>Choice:</strong> {decision.choiceText}
                          </div>
                          {decision.abilityCheck && (
                            <div className="text-xs text-fantasy-shadow mb-1">
                              <strong>Roll:</strong> {outcomeIcon} {decision.abilityCheck.roll} vs DC {decision.abilityCheck.dc}
                            </div>
                          )}
                          <div className="text-xs text-fantasy-shadow">
                            <strong>Outcome:</strong> {decision.storyOutcome}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}