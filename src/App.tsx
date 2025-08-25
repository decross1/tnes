import { AnimatePresence } from 'framer-motion';
import useGameStore from './stores/gameStore';
import SceneDisplay from './components/game/SceneDisplay';
import ChoiceButtons from './components/game/ChoiceButtons';
import DiceRoller from './components/game/DiceRoller';
import StoryScroll from './components/game/StoryScroll';
import CharacterCreation from './components/character/CharacterCreation';
import type { Choice, DiceRoll } from './types';
import { generateUniqueId } from './utils/game';

function App() {
  const {
    character,
    currentScene,
    storyHistory,
    pendingRoll,
    ui,
    characterCreation,
    campaign,
    setCurrentScene,
    addDecision,
    setPendingRoll,
    updateUI,
    startCharacterCreation,
    updateCharacterCreation,
    completeCharacterCreation
  } = useGameStore();

  const handleChoiceSelect = (choice: Choice) => {
    if (choice.abilityCheck) {
      setPendingRoll({
        choice,
        character,
        onResult: (result: DiceRoll) => handleRollResult(choice, result)
      });
    } else {
      const decision = {
        id: generateUniqueId(),
        sceneId: currentScene.id,
        choiceId: choice.id,
        choiceText: choice.text,
        result: 'no_roll' as const,
        timestamp: new Date()
      };
      addDecision(decision);
      
      // Mock scene transition for now
      setTimeout(() => {
        const newScene = {
          id: generateUniqueId(),
          title: 'Next Chapter',
          description: 'The adventure continues based on your choice...',
          choices: [
            {
              id: 'continue',
              text: 'Continue the journey',
              abilityCheck: {
                ability: 'wisdom' as const,
                dc: 12
              }
            }
          ]
        };
        setCurrentScene(newScene);
      }, 1000);
    }
  };

  const handleRollResult = (choice: Choice, result: DiceRoll) => {
    const success = choice.abilityCheck && result.total >= choice.abilityCheck.dc;
    const critical: 'success' | 'failure' | 'critical_success' | 'critical_failure' = 
      result.d20 === 20 ? 'critical_success' : 
      result.d20 === 1 ? 'critical_failure' :
      success ? 'success' : 'failure';

    const decision = {
      id: generateUniqueId(),
      sceneId: currentScene.id,
      choiceId: choice.id,
      choiceText: choice.text,
      roll: result,
      result: critical,
      timestamp: new Date()
    };

    addDecision(decision);
    setPendingRoll(null);

    // Mock scene transition based on result
    setTimeout(() => {
      const newScene = {
        id: generateUniqueId(),
        title: success ? 'Success!' : 'Setback',
        description: success 
          ? 'Your skill and luck have paid off! The path forward is clear...'
          : 'Things didn\'t go as planned, but the adventure must continue...',
        choices: [
          {
            id: 'next',
            text: 'What happens next?',
            abilityCheck: {
              ability: 'charisma' as const,
              dc: 15
            }
          }
        ]
      };
      setCurrentScene(newScene);
    }, 2500);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>D&D Solo Adventure</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>Level {character.level} {character.class.name}</span>
              <button
                onClick={() => updateUI({ showStoryScroll: true })}
                className="choice-button"
                style={{ width: 'auto', padding: '8px 16px' }}
              >
                Chronicle
              </button>
              <button
                onClick={startCharacterCreation}
                className="choice-button"
                style={{ width: 'auto', padding: '8px 16px', backgroundColor: '#CD7F32' }}
              >
                New Character
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div style={{ marginBottom: '24px' }}>
          {/* Scene Display */}
          <SceneDisplay scene={currentScene} isLoading={ui.isLoading} />

          {/* Dice Roller (when pending) */}
          <AnimatePresence>
            {pendingRoll && (
              <DiceRoller
                key="dice-roller"
                character={pendingRoll.character}
                abilityCheck={pendingRoll.choice.abilityCheck!}
                onRollComplete={pendingRoll.onResult}
                autoRoll={true}
              />
            )}
          </AnimatePresence>

          {/* Choice Buttons (when not rolling) */}
          <AnimatePresence>
            {!pendingRoll && (
              <ChoiceButtons
                key="choice-buttons"
                choices={currentScene.choices}
                onChoiceSelect={handleChoiceSelect}
                disabled={ui.isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Character Stats Bar */}
      <div className="stats-bar">
        <div className="stats-content">
          <div className="stats-left">
            <strong>{character.name}</strong>
            <span>HP: {character.hitPoints.current}/{character.hitPoints.max}</span>
            <span>XP: {character.xp}</span>
          </div>
          <div className="stats-right">
            <span>STR: {character.abilities.strength}</span>
            <span>DEX: {character.abilities.dexterity}</span>
            <span>CON: {character.abilities.constitution}</span>
            <span>INT: {character.abilities.intelligence}</span>
            <span>WIS: {character.abilities.wisdom}</span>
            <span>CHA: {character.abilities.charisma}</span>
          </div>
        </div>
      </div>

      {/* Story Scroll Modal */}
      <StoryScroll
        decisions={storyHistory}
        isOpen={ui.showStoryScroll}
        onClose={() => updateUI({ showStoryScroll: false })}
      />

      {/* Character Creation Modal */}
      <AnimatePresence>
        {characterCreation.isActive && (
          <CharacterCreation
            onComplete={completeCharacterCreation}
            onCancel={() => updateCharacterCreation({ isActive: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;