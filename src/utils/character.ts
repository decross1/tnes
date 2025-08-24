import type { Character, CharacterClass, AbilityScores } from '../types';

const characterClasses: Record<string, CharacterClass> = {
  Fighter: {
    name: 'Fighter',
    abilityBonus: { strength: 2 },
    proficiencies: ['athletics', 'intimidation'],
    hitDie: 10,
    startingHp: 12
  },
  Rogue: {
    name: 'Rogue',
    abilityBonus: { dexterity: 2 },
    proficiencies: ['stealth', 'sleight_of_hand'],
    hitDie: 8,
    startingHp: 10
  },
  Wizard: {
    name: 'Wizard',
    abilityBonus: { intelligence: 2 },
    proficiencies: ['arcana', 'investigation'],
    hitDie: 6,
    startingHp: 8
  },
  Cleric: {
    name: 'Cleric',
    abilityBonus: { wisdom: 2 },
    proficiencies: ['medicine', 'religion'],
    hitDie: 8,
    startingHp: 10
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
    inventory: [],
    spells: className === 'Wizard' || className === 'Cleric' ? [] : undefined
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