import { AnimatePresence } from 'framer-motion';
import useGameStore from './stores/gameStore';
import MainMenuScreen from './components/screens/MainMenuScreen';
import CharacterCreation from './components/character/CharacterCreation';

function App() {
  try {
    const {
      character,
      currentScene,
      storyHistory,
      pendingRoll,
      ui,
      characterCreation,
      campaigns,
      currentScreen,
      updateCharacterCreation,
      completeCharacterCreation,
      createNewCampaign,
      loadCampaign,
      deleteCampaign,
      goToMainMenu
    } = useGameStore();

    return (
      <div className="min-h-screen">
        {/* Clean UI - Remove debug info */}
        {currentScreen === 'mainMenu' ? (
          <MainMenuScreen
            campaigns={campaigns.slots}
            onStartNewCampaign={createNewCampaign}
            onLoadCampaign={loadCampaign}
            onDeleteCampaign={deleteCampaign}
          />
        ) : (
          <div style={{ padding: '20px', background: '#e0f0ff', margin: '20px 0' }}>
            <h2>Game Screen (Placeholder)</h2>
            <p>Playing as: <strong>{character?.name}</strong></p>
            <p>Current Slot: {campaigns.currentSlot}</p>
            <button onClick={goToMainMenu}>Back to Main Menu</button>
          </div>
        )}

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
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error Loading App</h1>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default App;