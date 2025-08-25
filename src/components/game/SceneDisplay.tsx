import { motion } from 'framer-motion';
import type { Scene } from '../types';

interface SceneDisplayProps {
  scene: Scene;
  isLoading?: boolean;
}

export default function SceneDisplay({ scene, isLoading }: SceneDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fantasy-border scene-container"
      style={{ padding: '24px', marginBottom: '24px' }}
    >
      {/* Scene Image */}
      {scene.imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden' }}
        >
          <img
            src={scene.imageUrl}
            alt={scene.title}
            style={{ width: '100%', height: '256px', objectFit: 'cover' }}
          />
        </motion.div>
      )}

      {/* Scene Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ fontSize: '32px', fontWeight: 'bold', color: '#191970', marginBottom: '16px' }}
      >
        {scene.title}
      </motion.h2>

      {/* Scene Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="story-text"
        style={{ fontSize: '18px' }}
        dangerouslySetInnerHTML={{ __html: scene.description }}
      />

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ 
            width: '32px', 
            height: '32px', 
            border: '3px solid #D4AF37',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ marginLeft: '12px', color: '#191970', fontWeight: 'medium' }}>
            Loading next scene...
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}