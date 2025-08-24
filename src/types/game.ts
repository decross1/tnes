export interface Character {
  name: string;
  level: number;
  xp: number;
  class: CharacterClass;
  abilities: AbilityScores;
  hitPoints: {
    current: number;
    max: number;
  };
  inventory: Item[];
  spells?: Spell[];
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  choices: Choice[];
  isLoading?: boolean;
}

export interface Choice {
  id: string;
  text: string;
  abilityCheck?: AbilityCheck;
  consequence?: string;
  isDisabled?: boolean;
}

export interface AbilityCheck {
  ability: keyof AbilityScores;
  dc: number;
  advantage?: boolean;
  disadvantage?: boolean;
}

export interface Decision {
  id: string;
  sceneId: string;
  choiceId: string;
  choiceText: string;
  roll?: DiceRoll;
  result: 'success' | 'failure' | 'critical_success' | 'critical_failure' | 'no_roll';
  timestamp: Date;
}

export interface DiceRoll {
  d20: number;
  modifier: number;
  total: number;
  advantage?: boolean;
  disadvantage?: boolean;
  naturalRoll?: number[];
}

export interface PendingRoll {
  choice: Choice;
  character: Character;
  onResult: (result: DiceRoll) => void;
}

export interface GameState {
  character: Character;
  currentScene: Scene;
  storyHistory: Decision[];
  pendingRoll: PendingRoll | null;
  ui: UIState;
  saveData: SaveData;
}

export interface UIState {
  isLoading: boolean;
  showCharacterSheet: boolean;
  showStoryScroll: boolean;
  showSettings: boolean;
  theme: 'light' | 'dark';
  textSize: 'small' | 'medium' | 'large';
}

export interface SaveData {
  version: string;
  lastSaved: Date;
  gameId: string;
}

export interface CharacterClass {
  name: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  abilityBonus: Partial<AbilityScores>;
  proficiencies: string[];
  hitDie: number;
  startingHp: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
  description: string;
  quantity: number;
  equipped?: boolean;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
  castTime: string;
  range: string;
  components: string;
  duration: string;
  prepared?: boolean;
}

export type DifficultyClass = 5 | 10 | 15 | 20 | 25 | 30;

export interface SceneContext {
  character: Character;
  recentHistory: Decision[];
  currentObjective?: string;
  toneGuidelines: string;
}