import { AnimatePresence } from 'framer-motion';
import useGameStore from './stores/gameStore';
import MainMenuScreen from './components/screens/MainMenuScreen';
import CharacterCreation from './components/character/CharacterCreation';
import CampaignConstructorIntegration from './components/campaign/CampaignConstructorIntegration';

function App() {
  try {
    const {
      character,
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
        {/* Main Navigation */}
        {currentScreen === 'mainMenu' && (
          <MainMenuScreen
            campaigns={campaigns.slots}
            onStartNewCampaign={createNewCampaign}
            onLoadCampaign={loadCampaign}
            onDeleteCampaign={deleteCampaign}
          />
        )}

        {currentScreen === 'campaignConstructor' && character && (
          <CampaignConstructorIntegration
            onConstructorComplete={() => {
              // After campaign is constructed, go to game
              goToMainMenu(); // For now, go back to main menu until game screen is ready
            }}
          />
        )}

        {currentScreen === 'game' && (
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