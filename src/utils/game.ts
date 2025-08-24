import type { DiceRoll, Character, AbilityCheck } from '../types';

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function rollD20(advantage: boolean = false, disadvantage: boolean = false): number {
  if (advantage && disadvantage) {
    advantage = false;
    disadvantage = false;
  }

  if (advantage) {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    return Math.max(roll1, roll2);
  }

  if (disadvantage) {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    return Math.min(roll1, roll2);
  }

  return Math.floor(Math.random() * 20) + 1;
}

export function performAbilityCheck(
  character: Character,
  check: AbilityCheck
): DiceRoll {
  const roll = rollD20(check.advantage, check.disadvantage);
  const abilityModifier = Math.floor((character.abilities[check.ability] - 10) / 2);
  
  // Check if character is proficient in this ability (simplified logic)
  const isProficient = character.class.proficiencies.some(prof => 
    prof.toLowerCase().includes(check.ability.toLowerCase())
  );
  
  const proficiencyBonus = isProficient ? (2 + Math.floor((character.level - 1) / 4)) : 0;
  const modifier = abilityModifier + proficiencyBonus;
  const total = roll + modifier;

  return {
    d20: roll,
    modifier,
    total,
    advantage: check.advantage,
    disadvantage: check.disadvantage
  };
}

export function getDifficultyText(dc: number): string {
  if (dc <= 5) return 'Very Easy';
  if (dc <= 10) return 'Easy';
  if (dc <= 15) return 'Medium';
  if (dc <= 20) return 'Hard';
  if (dc <= 25) return 'Very Hard';
  return 'Nearly Impossible';
}

export function formatAbilityName(ability: string): string {
  const names: Record<string, string> = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA'
  };
  return names[ability] || ability.toUpperCase();
}

export function isSuccess(roll: DiceRoll, dc: number): boolean {
  return roll.total >= dc;
}

export function isCritical(roll: DiceRoll): 'success' | 'failure' | 'none' {
  if (roll.d20 === 20) return 'success';
  if (roll.d20 === 1) return 'failure';
  return 'none';
}