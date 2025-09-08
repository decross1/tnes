// Extend existing character types with creation system
export * from './game';

export type BackstoryMethod = 'ai-generate' | 'custom-write' | 'keywords' | 'skip';

export interface CharacterCreationState {
  isActive: boolean;
  step: 'class' | 'name' | 'backstory' | 'confirmation' | 'campaign';
  selectedClass?: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName?: string;
  backstoryMethod?: BackstoryMethod;
  backstoryContent?: string;
  backstoryKeywords?: string[];
  portraitUrl?: string;
  isGeneratingBackstory?: boolean;
  isGeneratingPortrait?: boolean;
}

export interface ClassInfo {
  name: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  description: string;
  primaryAbility: string;
  hitDie: string;
  proficiencies: string[];
  equipment: string[];
  flavorText: string;
  icon: string;
}

export const CHARACTER_CLASSES: Record<string, ClassInfo> = {
  Fighter: {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons and armor.',
    primaryAbility: 'Strength or Dexterity',
    hitDie: 'd10',
    proficiencies: ['All armor', 'Shields', 'Simple weapons', 'Martial weapons'],
    equipment: ['Chain mail', 'Shield', 'Martial weapon', 'Light crossbow'],
    flavorText: 'Warriors who live for the thrill of battle and the glory of victory.',
    icon: '⚔️'
  },
  Rogue: {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
    primaryAbility: 'Dexterity',
    hitDie: 'd8',
    proficiencies: ['Light armor', 'Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    equipment: ['Leather armor', 'Dagger', 'Thieves tools', 'Shortbow'],
    flavorText: 'Masters of shadow and subterfuge, striking from the darkness.',
    icon: '🗡️'
  },
  Wizard: {
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of spells.',
    primaryAbility: 'Intelligence',
    hitDie: 'd6',
    proficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    equipment: ['Spellbook', 'Quarterstaff', 'Component pouch', 'Scholar pack'],
    flavorText: 'Students of arcane arts who bend reality through study and intellect.',
    icon: '🔮'
  },
  Cleric: {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a deity.',
    primaryAbility: 'Wisdom',
    hitDie: 'd8',
    proficiencies: ['Light armor', 'Medium armor', 'Shields', 'Simple weapons'],
    equipment: ['Chain shirt', 'Shield', 'Warhammer', 'Holy symbol'],
    flavorText: 'Divine servants who channel the power of their deity to aid allies.',
    icon: '✨'
  }
};

export interface BackstoryTemplate {
  method: BackstoryMethod;
  title: string;
  description: string;
  icon: string;
  placeholder?: string;
}

export const BACKSTORY_OPTIONS: BackstoryTemplate[] = [
  {
    method: 'ai-generate',
    title: 'Generate My Story',
    description: 'Let AI create a compelling backstory based on your class and name',
    icon: '🎲'
  },
  {
    method: 'keywords',
    title: 'Build from Keywords',
    description: 'Provide keywords and themes to guide the story generation',
    icon: '🏷️'
  },
  {
    method: 'custom-write',
    title: 'Write My Own',
    description: 'Create your own unique backstory from scratch',
    icon: '✍️',
    placeholder: 'Write your character\'s backstory here...'
  },
  {
    method: 'skip',
    title: 'Skip & Start Playing',
    description: 'Use a default backstory and jump into the adventure',
    icon: '⚡'
  }
];