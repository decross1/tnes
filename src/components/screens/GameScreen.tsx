import { AnimatePresence } from 'framer-motion';
import type { Character, Scene, Decision, Choice, DiceRoll, PendingRoll, UIState } from '../../types';
import SceneDisplay from '../game/SceneDisplay';
import ChoiceButtons from '../game/ChoiceButtons';
import DiceRoller from '../game/DiceRoller';
import CharacterDetailsModal from '../character/CharacterDetailsModal';
import CampaignTimeline from '../game/CampaignTimeline';

interface GameScreenProps {
  character: Character;
  currentScene: Scene;
  storyHistory: Decision[];
  pendingRoll: PendingRoll | null;
  ui: UIState;
  onChoiceSelect: (choice: Choice) => void;
  onRollComplete: (result: DiceRoll) => void;
  onMainMenu: () => void;
  updateUI: (ui: Partial<UIState>) => void;
}

export default function GameScreen({
  character,
  currentScene,
  storyHistory,
  pendingRoll,
  ui,
  onChoiceSelect,
  onMainMenu,
  updateUI
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row" style={{backgroundImage: 'url(/images/background.jpg)'}}>
      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      {/* Mobile Header */}
      <header className="lg:hidden w-full bg-black/80 backdrop-blur-sm shadow-lg relative z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onMainMenu}
            className="text-fantasy-gold font-medium hover:text-fantasy-bronze transition-colors"
          >
            ← Main Menu
          </button>
          <h1 className="text-xl font-fantasy font-bold text-fantasy-gold">
            TNES
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Timeline Sidebar - Mobile: Top, Desktop: Right */}
      <aside className="lg:w-80 lg:min-h-screen bg-black/80 backdrop-blur-sm border-l-2 lg:border-l-2 border-b-2 lg:border-b-0 border-fantasy-gold/30 lg:order-2 relative z-10">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden flex flex-col">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-black/90 p-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-fantasy font-bold text-fantasy-gold">
                TNES
              </h1>
              <button
                onClick={onMainMenu}
                className="text-fantasy-bronze hover:text-fantasy-gold text-sm font-medium transition-colors"
              >
                Main Menu
              </button>
            </div>
            <div className="text-fantasy-bronze text-sm">
              {character.name} • Level {character.level} {character.class.name}
            </div>
          </div>
          
          <CampaignTimeline 
            decisions={storyHistory}
            character={character}
          />
        </div>
      </aside>

      {/* Main Game Area */}
      <main className="flex-1 lg:order-1 min-h-0 relative z-10">
        <div className="h-full flex flex-col">
          {/* Game Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
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
                    onChoiceSelect={onChoiceSelect}
                    disabled={ui.isLoading}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Character Stats Bar */}
          <div 
            className="lg:hidden bg-black/90 backdrop-blur-sm border-t-2 border-fantasy-gold/30 p-4 cursor-pointer"
            onClick={() => updateUI({ showCharacterDetails: true })}
            title="Tap to view character details"
          >
            <div className="flex items-center justify-between text-fantasy-bronze">
              <div className="flex items-center space-x-4">
                <strong className="text-fantasy-gold">{character.name}</strong>
                <span>HP: {character.hitPoints.current}/{character.hitPoints.max}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span>STR: {character.abilities.strength}</span>
                <span>DEX: {character.abilities.dexterity}</span>
                <span>CON: {character.abilities.constitution}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Character Details Modal */}
      <CharacterDetailsModal
        character={character}
        isOpen={ui.showCharacterDetails}
        onClose={() => updateUI({ showCharacterDetails: false })}
      />
    </div>
  );
}