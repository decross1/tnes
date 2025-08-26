import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DiceRoll, AbilityCheck, Character } from '../../types';
import { performAbilityCheck, formatAbilityName, isCritical } from '../../utils/game';

interface DiceRollerProps {
  character: Character;
  abilityCheck: AbilityCheck;
  onRollComplete: (result: DiceRoll) => void;
  autoRoll?: boolean;
}

export default function DiceRoller({ character, abilityCheck, onRollComplete, autoRoll = false }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<DiceRoll | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const rollResult = performAbilityCheck(character, abilityCheck);
      setResult(rollResult);
      setIsRolling(false);
      setShowResult(true);

      setTimeout(() => {
        onRollComplete(rollResult);
      }, 2000);
    }, 1200);
  };

  useEffect(() => {
    if (autoRoll) {
      handleRoll();
    }
  }, [autoRoll]);

  const critical = result ? isCritical(result) : 'none';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '24px',
      background: 'linear-gradient(135deg, #F4E4BC 0%, #FEF7E0 100%)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '3px solid #D4AF37',
      marginBottom: '24px'
    }}>
      {/* Ability Check Info */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'Cinzel, serif', fontWeight: 'bold', color: '#191970', marginBottom: '8px' }}>
          {formatAbilityName(abilityCheck.ability)} Check
        </h3>
        <p style={{ color: '#2C2C2C' }}>
          Roll 1d20 + modifier vs DC {abilityCheck.dc}
        </p>
        {(abilityCheck.advantage || abilityCheck.disadvantage) && (
          <p style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            marginTop: '4px',
            color: abilityCheck.advantage ? '#16a34a' : '#dc2626'
          }}>
            {abilityCheck.advantage ? 'Advantage' : 'Disadvantage'} - Roll twice, take {abilityCheck.advantage ? 'higher' : 'lower'}
          </p>
        )}
      </div>

      {/* Dice Animation */}
      <div className="mb-6">
        <AnimatePresence>
          {isRolling ? (
            <motion.div
              key="rolling"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotateX: [0, 360, 720],
                rotateY: [0, 360, 720]
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 1.2,
                rotateX: { duration: 1.2, ease: "easeInOut" },
                rotateY: { duration: 1.2, ease: "easeInOut" }
              }}
              className="dice-face text-4xl"
            >
              ?
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`dice-face text-4xl ${
                critical === 'success' ? 'bg-green-200 border-green-600' :
                critical === 'failure' ? 'bg-red-200 border-red-600' :
                'bg-white border-gray-800'
              }`}
            >
              {result.d20}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="dice-face cursor-pointer hover:scale-105 transition-transform text-4xl"
              onClick={handleRoll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="opacity-50">20</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Roll Button */}
      {!autoRoll && !isRolling && !result && (
        <motion.button
          className="choice-button px-6 py-3"
          onClick={handleRoll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Roll the Dice!
        </motion.button>
      )}

      {/* Result Display */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-3">
              <span className="text-2xl font-bold text-fantasy-midnight">
                {result.d20} + {result.modifier} = {result.total}
              </span>
            </div>
            
            <div className={`text-lg font-semibold ${
              result.total >= abilityCheck.dc ? 'text-green-600' : 'text-red-600'
            }`}>
              {critical === 'success' ? 'Critical Success!' :
               critical === 'failure' ? 'Critical Failure!' :
               result.total >= abilityCheck.dc ? 'Success!' : 'Failure!'}
            </div>

            {critical !== 'none' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-sm mt-2 opacity-75"
              >
                Natural {result.d20}!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}