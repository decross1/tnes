import { motion } from 'framer-motion';
import type { Choice } from '../types';
import { formatAbilityName, getDifficultyText } from '../utils/game';

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceButtons({ choices, onChoiceSelect, disabled }: ChoiceButtonsProps) {
  return (
    <div className="choice-container">
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="choice-button"
          style={{
            padding: '16px',
            opacity: disabled || choice.isDisabled ? 0.5 : 1,
          }}
          onClick={() => !disabled && !choice.isDisabled && onChoiceSelect(choice)}
          disabled={disabled || choice.isDisabled}
          whileHover={!disabled && !choice.isDisabled ? { scale: 1.02 } : {}}
          whileTap={!disabled && !choice.isDisabled ? { scale: 0.98 } : {}}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Choice Text */}
            <span style={{ color: 'white', fontWeight: '500', marginBottom: '8px' }}>
              {choice.text}
            </span>

            {/* Ability Check Info */}
            {choice.abilityCheck && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span className="ability-check-badge">
                  {formatAbilityName(choice.abilityCheck.ability)} Check
                </span>
                <span className="ability-check-badge">
                  DC {choice.abilityCheck.dc} ({getDifficultyText(choice.abilityCheck.dc)})
                </span>
                {choice.abilityCheck.advantage && (
                  <span className="ability-check-badge" style={{ background: '#16a34a' }}>
                    Advantage
                  </span>
                )}
                {choice.abilityCheck.disadvantage && (
                  <span className="ability-check-badge" style={{ background: '#dc2626' }}>
                    Disadvantage
                  </span>
                )}
              </div>
            )}

            {/* Consequence Preview */}
            {choice.consequence && (
              <span style={{ color: '#F4E4BC', fontSize: '14px', opacity: 0.75, marginTop: '4px', fontStyle: 'italic' }}>
                {choice.consequence}
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}