import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, Character, Scene, Decision, PendingRoll, UIState, SaveData } from '../types';
import { createCharacter } from '../utils/character';
import { generateUniqueId } from '../utils/game';

interface GameActions {
  setCharacter: (character: Character) => void;
  setCurrentScene: (scene: Scene) => void;
  addDecision: (decision: Decision) => void;
  setPendingRoll: (roll: PendingRoll | null) => void;
  updateUI: (ui: Partial<UIState>) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: (saveData: GameState) => void;
}

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

const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      (set) => ({
        character: createCharacter('Fighter'),
        currentScene: initialScene,
        storyHistory: [],
        pendingRoll: null,
        ui: initialUIState,
        saveData: initialSaveData,

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
          set(() => ({ ...saveData }))
      }),
      {
        name: 'dnd-adventure-game',
        version: 1,
      }
    ),
    { name: 'GameStore' }
  )
);

export default useGameStore;