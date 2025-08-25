import { motion } from 'framer-motion';
import { CHARACTER_CLASSES } from '../../types/character';

interface ClassSelectionProps {
  selectedClass: string;
  onSelect: (className: string) => void;
}

export default function ClassSelection({ selectedClass, onSelect }: ClassSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Choose Your Class</h3>
        <p style={{ color: '#666' }}>Select the type of hero you want to play</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px' 
      }}>
        {Object.values(CHARACTER_CLASSES).map((classInfo) => (
          <motion.div
            key={classInfo.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(classInfo.name)}
            style={{
              padding: '20px',
              border: `3px solid ${selectedClass === classInfo.name ? '#D4AF37' : '#E5E7EB'}`,
              borderRadius: '12px',
              backgroundColor: selectedClass === classInfo.name ? '#FEF7E0' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60px',
              height: '60px',
              background: selectedClass === classInfo.name ? 
                'linear-gradient(-45deg, #D4AF37, #CD7F32)' : 
                'linear-gradient(-45deg, #F3F4F6, #E5E7EB)',
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              opacity: 0.3
            }} />

            <div style={{ position: 'relative' }}>
              {/* Class Icon */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '48px' }}>{classInfo.icon}</span>
              </div>

              {/* Class Name */}
              <h4 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: selectedClass === classInfo.name ? '#D4AF37' : '#2C2C2C'
              }}>
                {classInfo.name}
              </h4>

              {/* Class Description */}
              <p style={{ 
                color: '#666', 
                marginBottom: '16px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {classInfo.description}
              </p>

              {/* Flavor Text */}
              <p style={{
                fontStyle: 'italic',
                color: '#8B7355',
                fontSize: '13px',
                marginBottom: '16px',
                borderLeft: '3px solid #D4AF37',
                paddingLeft: '12px'
              }}>
                {classInfo.flavorText}
              </p>

              {/* Class Details */}
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Primary:</strong> {classInfo.primaryAbility}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Hit Die:</strong> {classInfo.hitDie}
                </div>
                <div>
                  <strong>Proficiencies:</strong> {classInfo.proficiencies.slice(0, 2).join(', ')}
                  {classInfo.proficiencies.length > 2 && '...'}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedClass === classInfo.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Class Preview */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#F4E4BC',
            borderRadius: '8px',
            border: '2px solid #D4AF37'
          }}
        >
          <h4 style={{ color: '#D4AF37', marginBottom: '8px' }}>
            {CHARACTER_CLASSES[selectedClass].name} Starting Equipment
          </h4>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {CHARACTER_CLASSES[selectedClass].equipment.join(', ')}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}