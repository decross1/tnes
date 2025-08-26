import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Choice } from '../../types';

interface SceneCardProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  index: number;
}

export default function SceneCard({ choice, onSelect, disabled = false, index }: SceneCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement AI image generation here
  const generateSceneImage = async (prompt: string): Promise<string> => {
    // This will be connected to DALL-E/Stable Diffusion
    // For now, return a placeholder
    return '/images/scene-placeholder.jpg';
  };

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        // Generate prompt for the scene
        const prompt = `Fantasy D&D scene: ${choice.text}. Detailed digital art, atmospheric lighting, cinematic composition.`;
        const url = await generateSceneImage(prompt);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to generate scene image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [choice.text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`
        relative group cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
      onClick={() => !disabled && onSelect(choice)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Card Container - Legends of Runeterra style */}
      <div className="
        relative w-full aspect-[3/4] rounded-2xl overflow-hidden
        border-3 border-fantasy-gold/50 shadow-2xl
        bg-gradient-to-b from-slate-800 to-slate-900
        backdrop-blur-sm
      ">
        {/* Scene Image */}
        <div className="absolute inset-0">
          {isLoading ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-fantasy-gold border-t-transparent rounded-full"></div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`Scene: ${choice.text}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <div className="text-fantasy-gold/60 text-6xl">🎭</div>
            </div>
          )}
        </div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Ability Check Badge */}
        {choice.abilityCheck && (
          <div className="absolute top-3 right-3 z-20">
            <div className="
              bg-fantasy-midnight/90 backdrop-blur-sm 
              border border-fantasy-gold/50 rounded-lg px-3 py-1
              text-fantasy-gold text-sm font-bold font-fantasy
            ">
              {choice.abilityCheck.ability.toUpperCase()} {choice.abilityCheck.difficulty}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="space-y-2">
            {/* Choice Text */}
            <p className="text-white font-adventure text-sm leading-relaxed line-clamp-3">
              {choice.text}
            </p>

            {/* Action Button */}
            <div className="
              bg-gradient-to-r from-fantasy-gold to-fantasy-bronze
              text-black font-bold text-center py-2 px-4 rounded-lg
              transform transition-all group-hover:shadow-lg group-hover:shadow-fantasy-gold/25
            ">
              CHOOSE THIS PATH
            </div>
          </div>
        </div>

        {/* Card Shine Effect */}
        <div className="
          absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
          bg-gradient-to-br from-transparent via-white/20 to-transparent
          pointer-events-none
        "></div>
      </div>
    </motion.div>
  );
}