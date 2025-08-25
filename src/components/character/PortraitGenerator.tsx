import { motion, AnimatePresence } from 'framer-motion';

interface PortraitGeneratorProps {
  portraitUrl?: string;
  isGenerating: boolean;
  characterName: string;
  characterClass: string;
}

export default function PortraitGenerator({ 
  portraitUrl, 
  isGenerating, 
  characterName, 
  characterClass 
}: PortraitGeneratorProps) {
  return (
    <AnimatePresence>
      {(portraitUrl || isGenerating) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '200px',
            backgroundColor: '#FFFFFF',
            border: '3px solid #D4AF37',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#D4AF37'
            }}>
              Character Portrait
            </h4>

            <div style={{ 
              width: '120px', 
              height: '120px', 
              margin: '0 auto 12px',
              borderRadius: '60px',
              overflow: 'hidden',
              border: '3px solid #CD7F32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F4E4BC'
            }}>
              {isGenerating ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #D4AF37',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 8px'
                  }} />
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    Creating...
                  </div>
                </div>
              ) : portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={`${characterName} portrait`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: '32px', 
                  opacity: 0.5 
                }}>
                  {characterClass === 'Fighter' ? '⚔️' :
                   characterClass === 'Rogue' ? '🗡️' :
                   characterClass === 'Wizard' ? '🔮' :
                   characterClass === 'Cleric' ? '✨' : '🎭'}
                </div>
              )}
            </div>

            <div style={{ fontSize: '12px', color: '#666' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {characterName}
              </div>
              <div>
                {characterClass}
              </div>
            </div>

            {isGenerating && (
              <div style={{ 
                fontSize: '10px', 
                color: '#D4AF37', 
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                Generating portrait...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}