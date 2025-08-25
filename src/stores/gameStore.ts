import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  GameState, 
  Character, 
  Scene, 
  Decision, 
  PendingRoll, 
  UIState, 
  SaveData 
} from '../types';
import type { 
  CharacterCreationState, 
  BackstoryMethod 
} from '../types/character';
import type { 
  CampaignSetup,
  CampaignMode,
  CampaignTone,
  StartingLocation
} from '../types/campaign';
import type {
  KeywordWeight,
  StoryAct,
  QuestLine,
  PlotPoint
} from '../types/keywords';
import { createCharacter } from '../utils/character';
import { generateUniqueId } from '../utils/game';

// Extended Game State
interface ExtendedGameState extends GameState {
  // Character Creation
  characterCreation: CharacterCreationState;
  
  // Campaign Setup
  campaign: CampaignSetup;
  
  // Keyword Management
  keywordManager: {
    campaign: KeywordWeight[];
    dynamic: KeywordWeight[];
    scene: KeywordWeight[];
  };
  
  // Story Tracking
  storyArc: {
    act: StoryAct;
    mainQuest?: QuestLine;
    sideQuests: QuestLine[];
    plotPoints: PlotPoint[];
    progress: number; // 0-100
  };
}

interface ExtendedGameActions {
  // Original actions
  setCharacter: (character: Character) => void;
  setCurrentScene: (scene: Scene) => void;
  addDecision: (decision: Decision) => void;
  setPendingRoll: (roll: PendingRoll | null) => void;
  updateUI: (ui: Partial<UIState>) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: (saveData: ExtendedGameState) => void;

  // Character Creation actions
  startCharacterCreation: () => void;
  updateCharacterCreation: (update: Partial<CharacterCreationState>) => void;
  completeCharacterCreation: (character: {
    name: string;
    class: string;
    backstory: string;
    portraitUrl?: string;
  }) => void;

  // Campaign Setup actions
  updateCampaignSetup: (update: Partial<CampaignSetup>) => void;
  completeCampaignSetup: () => void;

  // Keyword Management actions
  addCampaignKeyword: (keyword: string, weight?: number) => void;
  addDynamicKeyword: (keyword: string, weight?: number) => void;
  addSceneKeyword: (keyword: string, weight?: number) => void;
  getActiveKeywords: () => string[];
  
  // Story Arc actions
  updateStoryArc: (update: Partial<ExtendedGameState['storyArc']>) => void;
  addPlotPoint: (plotPoint: PlotPoint) => void;
}

const initialCharacterCreation: CharacterCreationState = {
  isActive: false,
  step: 'class'
};

const initialCampaign: CampaignSetup = {
  mode: 'guided',
  isSetup: false
};

const initialKeywordManager = {
  campaign: [],
  dynamic: [],
  scene: []
};

const initialStoryArc = {
  act: 'introduction' as StoryAct,
  sideQuests: [],
  plotPoints: [],
  progress: 0
};

const initialScene: Scene = {
  id: 'start',
  title: 'The Adventure Begins',
  description: 'You find yourself at the entrance of a mysterious dungeon...',
  choices: [
    {
      id: 'enter',
      text: 'Enter the dungeon',
      abilityCheck: {
        ability: 'dexterity',
        dc: 10
      }
    },
    {
      id: 'examine',
      text: 'Examine the entrance carefully',
      abilityCheck: {
        ability: 'intelligence',
        dc: 12
      }
    }
  ]
};

const initialUIState: UIState = {
  isLoading: false,
  showCharacterSheet: false,
  showStoryScroll: false,
  showSettings: false,
  theme: 'dark',
  textSize: 'medium'
};

const initialSaveData: SaveData = {
  version: '1.0.0',
  lastSaved: new Date(),
  gameId: generateUniqueId()
};

const useGameStore = create<ExtendedGameState & ExtendedGameActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Core Game State
        character: createCharacter('Fighter'),
        currentScene: initialScene,
        storyHistory: [],
        pendingRoll: null,
        ui: initialUIState,
        saveData: initialSaveData,

        // Extended State
        characterCreation: initialCharacterCreation,
        campaign: initialCampaign,
        keywordManager: initialKeywordManager,
        storyArc: initialStoryArc,

        // Original Actions
        setCharacter: (character) =>
          set((state) => ({
            character,
            saveData: { ...state.saveData, lastSaved: new Date() }
          })),

        setCurrentScene: (scene) =>
          set((state) => ({
            currentScene: scene,
            saveData: { ...state.saveData, lastSaved: new Date() }
          })),

        addDecision: (decision) =>
          set((state) => ({
            storyHistory: [...state.storyHistory, decision],
            saveData: { ...state.saveData, lastSaved: new Date() }
          })),

        setPendingRoll: (roll) =>
          set(() => ({ pendingRoll: roll })),

        updateUI: (uiUpdate) =>
          set((state) => ({
            ui: { ...state.ui, ...uiUpdate }
          })),

        resetGame: () =>
          set(() => ({
            character: createCharacter('Fighter'),
            currentScene: initialScene,
            storyHistory: [],
            pendingRoll: null,
            ui: initialUIState,
            characterCreation: initialCharacterCreation,
            campaign: initialCampaign,
            keywordManager: initialKeywordManager,
            storyArc: initialStoryArc,
            saveData: {
              ...initialSaveData,
              gameId: generateUniqueId(),
              lastSaved: new Date()
            }
          })),

        saveGame: () =>
          set((state) => ({
            saveData: { ...state.saveData, lastSaved: new Date() }
          })),

        loadGame: (saveData) =>
          set(() => ({ ...saveData })),

        // Character Creation Actions
        startCharacterCreation: () =>
          set((state) => ({
            characterCreation: {
              ...initialCharacterCreation,
              isActive: true,
              step: 'class'
            }
          })),

        updateCharacterCreation: (update) =>
          set((state) => ({
            characterCreation: {
              ...state.characterCreation,
              ...update
            }
          })),

        completeCharacterCreation: (characterData) => {
          const { name, class: className, backstory, portraitUrl } = characterData;
          
          // Create full character with stats
          const character = createCharacter(className as any, name);
          
          // Add backstory and portrait
          const enhancedCharacter = {
            ...character,
            backstory,
            portraitUrl
          };

          set((state) => ({
            character: enhancedCharacter,
            characterCreation: {
              ...state.characterCreation,
              isActive: false
            },
            saveData: { ...state.saveData, lastSaved: new Date() }
          }));
        },

        // Campaign Setup Actions
        updateCampaignSetup: (update) =>
          set((state) => ({
            campaign: {
              ...state.campaign,
              ...update
            }
          })),

        completeCampaignSetup: () =>
          set((state) => {
            // Add campaign keywords to keyword manager
            const campaignKeywords = state.campaign.campaignKeywords || [];
            const keywordWeights: KeywordWeight[] = campaignKeywords.map(keyword => ({
              text: keyword,
              weight: 1.0,
              source: 'player' as const,
              addedAt: new Date(),
              category: 'theme' as const
            }));

            return {
              campaign: {
                ...state.campaign,
                isSetup: true
              },
              keywordManager: {
                ...state.keywordManager,
                campaign: keywordWeights
              },
              saveData: { ...state.saveData, lastSaved: new Date() }
            };
          }),

        // Keyword Management Actions
        addCampaignKeyword: (keyword, weight = 1.0) =>
          set((state) => ({
            keywordManager: {
              ...state.keywordManager,
              campaign: [...state.keywordManager.campaign, {
                text: keyword,
                weight,
                source: 'player' as const,
                addedAt: new Date(),
                category: 'theme' as const
              }]
            }
          })),

        addDynamicKeyword: (keyword, weight = 0.6) =>
          set((state) => {
            const existing = state.keywordManager.dynamic.find(k => k.text === keyword);
            if (existing) {
              // Increase weight of existing keyword
              const updated = state.keywordManager.dynamic.map(k => 
                k.text === keyword ? { ...k, weight: Math.min(k.weight + 0.1, 0.8) } : k
              );
              return {
                keywordManager: {
                  ...state.keywordManager,
                  dynamic: updated
                }
              };
            } else {
              // Add new dynamic keyword
              return {
                keywordManager: {
                  ...state.keywordManager,
                  dynamic: [...state.keywordManager.dynamic, {
                    text: keyword,
                    weight,
                    source: 'story' as const,
                    addedAt: new Date()
                  }]
                }
              };
            }
          }),

        addSceneKeyword: (keyword, weight = 0.3) =>
          set((state) => ({
            keywordManager: {
              ...state.keywordManager,
              scene: [{
                text: keyword,
                weight,
                source: 'system' as const,
                addedAt: new Date()
              }]
            }
          })),

        getActiveKeywords: () => {
          const state = get();
          const allKeywords = [
            ...state.keywordManager.campaign,
            ...state.keywordManager.dynamic,
            ...state.keywordManager.scene
          ];
          
          return allKeywords
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 7)
            .map(k => k.text);
        },

        // Story Arc Actions
        updateStoryArc: (update) =>
          set((state) => ({
            storyArc: {
              ...state.storyArc,
              ...update
            }
          })),

        addPlotPoint: (plotPoint) =>
          set((state) => ({
            storyArc: {
              ...state.storyArc,
              plotPoints: [...state.storyArc.plotPoints, plotPoint]
            }
          }))
      }),
      {
        name: 'dnd-adventure-game',
        version: 2, // Increment version for new state structure
      }
    ),
    { name: 'ExtendedGameStore' }
  )
);

export default useGameStore;