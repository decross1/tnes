import type { Character, CharacterClass, AbilityScores } from '../types';

const characterClasses: Record<string, CharacterClass> = {
  Fighter: {
    name: 'Fighter',
    abilityBonus: { strength: 2 },
    proficiencies: ['athletics', 'intimidation'],
    hitDie: 10,
    startingHp: 12,
    description: 'Masters of martial combat, skilled with a variety of weapons and armor. Fighters can deal and withstand significant physical punishment.'
  },
  Rogue: {
    name: 'Rogue',
    abilityBonus: { dexterity: 2 },
    proficiencies: ['stealth', 'sleight_of_hand'],
    hitDie: 8,
    startingHp: 10,
    description: 'Skilled in stealth and trickery, rogues can strike with precision and avoid danger with agility. They excel at skills and sneak attacks.'
  },
  Wizard: {
    name: 'Wizard',
    abilityBonus: { intelligence: 2 },
    proficiencies: ['arcana', 'investigation'],
    hitDie: 6,
    startingHp: 8,
    description: 'Scholarly magic-users capable of manipulating the structures of magic itself. Wizards possess powerful spells and vast arcane knowledge.'
  },
  Cleric: {
    name: 'Cleric',
    abilityBonus: { wisdom: 2 },
    proficiencies: ['medicine', 'religion'],
    hitDie: 8,
    startingHp: 10,
    description: 'Divine spellcasters who serve the gods. Clerics can heal allies, harm enemies, and provide support through divine magic.'
  }
};

export function createCharacter(className: keyof typeof characterClasses, name: string = 'Adventurer'): Character {
  const characterClass = characterClasses[className];
  const baseAbilities: AbilityScores = {
    strength: 13,
    dexterity: 13,
    constitution: 14,
    intelligence: 12,
    wisdom: 12,
    charisma: 11
  };

  const abilities = { ...baseAbilities };
  
  Object.entries(characterClass.abilityBonus).forEach(([ability, bonus]) => {
    if (bonus) {
      abilities[ability as keyof AbilityScores] += bonus;
    }
  });

  const conModifier = Math.floor((abilities.constitution - 10) / 2);
  const startingHp = characterClass.startingHp + conModifier;

  return {
    name,
    level: 1,
    xp: 0,
    class: characterClass,
    abilities,
    hitPoints: {
      current: startingHp,
      max: startingHp
    },
    armorClass: 10 + getAbilityModifier(abilities.dexterity), // Base AC 10 + DEX modifier
    proficiencyBonus: getProficiencyBonus(1), // Level 1 proficiency bonus
    inventory: [],
    spells: className === 'Wizard' || className === 'Cleric' ? [] : undefined,
    backstory: undefined,
    portraitUrl: undefined
  };
}

export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

export function calculateAbilityCheckBonus(
  character: Character,
  ability: keyof AbilityScores,
  proficient: boolean = false
): number {
  const abilityModifier = getAbilityModifier(character.abilities[ability]);
  const proficiencyBonus = proficient ? getProficiencyBonus(character.level) : 0;
  return abilityModifier + proficiencyBonus;
}