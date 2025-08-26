import { motion } from 'framer-motion';
import type { Character } from '../../types';

interface CharacterDetailsModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterDetailsModal({ character, isOpen, onClose }: CharacterDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="fantasy-border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight">
              Character Details
            </h2>
            <button
              onClick={onClose}
              className="text-fantasy-shadow hover:text-fantasy-midnight text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Character Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Character Portrait */}
          <div className="text-center mb-6">
            {character.portraitUrl ? (
              <div className="inline-block">
                <img
                  src={character.portraitUrl}
                  alt={`${character.name} portrait`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-fantasy-gold shadow-lg"
                />
              </div>
            ) : (
              <div className="inline-block w-32 h-32 rounded-full bg-fantasy-bronze flex items-center justify-center border-4 border-fantasy-gold">
                <span className="text-white text-4xl font-bold">
                  {character.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-fantasy-bronze">
              <h3 className="font-fantasy font-bold text-fantasy-midnight mb-2">Character Info</h3>
              <p><strong>Name:</strong> {character.name}</p>
              <p><strong>Class:</strong> {character.class.name}</p>
              <p><strong>Level:</strong> {character.level}</p>
              <p><strong>XP:</strong> {character.xp.toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-fantasy-bronze">
              <h3 className="font-fantasy font-bold text-fantasy-midnight mb-2">Vital Stats</h3>
              <p><strong>Hit Points:</strong> {character.hitPoints.current}/{character.hitPoints.max}</p>
              <p><strong>Armor Class:</strong> {character.armorClass}</p>
              <p><strong>Prof. Bonus:</strong> +{character.proficiencyBonus}</p>
            </div>
          </div>

          {/* Ability Scores */}
          <div className="mb-6">
            <h3 className="font-fantasy font-bold text-fantasy-midnight mb-3">Ability Scores</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(character.abilities).map(([ability, score]) => {
                const modifier = Math.floor((score - 10) / 2);
                return (
                  <div key={ability} className="bg-white p-3 rounded-lg border border-fantasy-bronze text-center">
                    <div className="font-fantasy font-bold text-fantasy-midnight uppercase text-sm">
                      {ability.slice(0, 3)}
                    </div>
                    <div className="text-2xl font-bold">{score}</div>
                    <div className="text-sm text-fantasy-shadow">
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Class Features */}
          <div className="mb-6">
            <h3 className="font-fantasy font-bold text-fantasy-midnight mb-3">Class Features</h3>
            <div className="bg-white p-4 rounded-lg border border-fantasy-bronze">
              <p className="text-fantasy-shadow">{character.class.description}</p>
            </div>
          </div>

          {/* Backstory */}
          {character.backstory && (
            <div className="mb-6">
              <h3 className="font-fantasy font-bold text-fantasy-midnight mb-3">Backstory</h3>
              <div className="bg-white p-4 rounded-lg border border-fantasy-bronze">
                <p className="story-text whitespace-pre-wrap">{character.backstory}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="fantasy-border-t p-4 text-center">
          <button
            onClick={onClose}
            className="choice-button px-6 py-2"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}