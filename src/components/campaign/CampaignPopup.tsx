import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCampaign: () => void;
  title: string;
  description: string;
  imageUrl?: string;
  characterName?: string;
  estimatedDuration?: number;
}

// Import the Pinky-generated images
const PINKY_IMAGES = [
  '/images/assets_task_01k41sb6kkfhkb07fwfg7bkvjp_1756701866_img_0.webp',
  '/images/assets_task_01k41sb6kkfhkb07fwfg7bkvjp_1756701866_img_1.webp'
];


export default function CampaignPopup({
  isOpen,
  onClose,
  onStartCampaign,
  title,
  description,
  imageUrl,
  characterName,
  estimatedDuration
}: CampaignPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !imageUrl) {
      // Randomly select one of the Pinky images for atmosphere
      const randomImage = PINKY_IMAGES[Math.floor(Math.random() * PINKY_IMAGES.length)];
      setSelectedImage(randomImage);
      setImageLoaded(false);
    } else if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageLoaded(false);
    }
  }, [isOpen, imageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Failed to load campaign image:', selectedImage);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="campaign-popup"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="campaign-popup-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="campaign-popup-close"
            aria-label="Close popup"
          >
            ×
          </button>

          {/* Header Image */}
          <div className="relative overflow-hidden rounded-t-xl">
            {!imageLoaded && (
              <div className="campaign-popup-image bg-gradient-to-br from-fantasy-midnight to-fantasy-shadow flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="text-4xl text-fantasy-gold mb-2">🏰</div>
                  <div className="text-fantasy-parchment text-sm">Loading...</div>
                </div>
              </div>
            )}
            
            {selectedImage && (
              <motion.img
                src={selectedImage}
                alt="Campaign atmosphere"
                className={`campaign-popup-image transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
            
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Character name overlay if provided */}
            {characterName && (
              <div className="absolute bottom-4 left-4 text-white">
                <div className="bg-black/50 rounded-lg px-3 py-1 backdrop-blur-sm">
                  <span className="font-fantasy font-bold text-lg">{characterName}</span>
                  <div className="text-sm opacity-90">begins their journey...</div>
                </div>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="campaign-popup-body">
            <motion.h2
              className="campaign-popup-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="campaign-popup-description"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>

            {/* Campaign Details */}
            {estimatedDuration && (
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-fantasy-gold/20 border border-fantasy-gold rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-fantasy-midnight">
                    <span className="text-lg">⏰</span>
                    <span className="font-semibold">
                      Estimated Duration: {estimatedDuration}h
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="campaign-popup-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onClose}
                className="constructor-button secondary"
              >
                Not Yet
              </button>
              <button
                onClick={onStartCampaign}
                className="constructor-button"
              >
                Begin Adventure! ⚔️
              </button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 text-fantasy-gold opacity-30">
            <div className="text-2xl">✦</div>
          </div>
          <div className="absolute top-8 right-8 text-fantasy-gold opacity-20">
            <div className="text-xl">⚜️</div>
          </div>
          <div className="absolute bottom-8 left-6 text-fantasy-bronze opacity-25">
            <div className="text-lg">🗡️</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Campaign result popup component for post-construction
interface CampaignResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBeginAdventure: () => void;
  campaignResult: {
    campaignName: string;
    theme: string;
    estimatedDuration: number;
    characterName: string;
    choices: Record<string, any>;
  };
}

export function CampaignResultPopup({
  isOpen,
  onClose,
  onBeginAdventure,
  campaignResult
}: CampaignResultPopupProps) {
  const getThemeImage = (theme: string) => {
    console.log('🖼️ Getting theme image for theme:', theme);
    
    // Map themes to appropriate Pinky images or return random
    const themeImageMap: Record<string, number> = {
      'ancient-tomb': 0,
      'wizard-tower': 1,
      'cult-temple': 0,
      'dragon-lair': 1,
      'default': Math.floor(Math.random() * PINKY_IMAGES.length)
    };
    
    const imageIndex = themeImageMap[theme] ?? themeImageMap.default;
    const selectedImageUrl = PINKY_IMAGES[imageIndex];
    console.log('🖼️ Selected image URL:', selectedImageUrl, 'for theme:', theme, 'at index:', imageIndex);
    
    return selectedImageUrl;
  };

  const generateCampaignSummary = () => {
    const { theme, choices } = campaignResult;
    const goal = choices['primary-goal'];
    const size = choices['size-scope'];
    
    let summary = `Your character ventures into `;
    
    switch (theme) {
      case 'ancient-tomb':
        summary += `a forgotten tomb where ancient guardians still roam the dusty halls`;
        break;
      case 'wizard-tower':
        summary += `an abandoned wizard's tower crackling with residual magical energy`;
        break;
      case 'underground-city':
        summary += `the depths of a lost underground city filled with forgotten secrets`;
        break;
      case 'natural-cavern':
        summary += `natural caverns carved by time and mysterious forces`;
        break;
      default:
        summary += `a mysterious location shrouded in danger and opportunity`;
    }
    
    if (goal) {
      const goalText = {
        'treasure-hunt': ', seeking legendary treasures',
        'rescue-mission': ', on a desperate rescue mission',
        'investigation': ', investigating dark mysteries',
        'elimination': ', hunting dangerous foes',
        'artifact-retrieval': ', pursuing a powerful artifact',
        'escape': ', planning a daring escape'
      }[goal] || '';
      summary += goalText;
    }
    
    summary += `. The ${size === 'small' ? 'compact' : size === 'medium' ? 'sprawling' : size === 'large' ? 'vast' : 'enormous'} complex awaits your courage and cunning.`;
    
    return summary;
  };

  if (!isOpen) return null;

  return (
    <CampaignPopup
      isOpen={isOpen}
      onClose={onClose}
      onStartCampaign={onBeginAdventure}
      title={campaignResult.campaignName}
      description={generateCampaignSummary()}
      imageUrl={getThemeImage(campaignResult.theme)}
      characterName={campaignResult.characterName}
      estimatedDuration={campaignResult.estimatedDuration}
    />
  );
}