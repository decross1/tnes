import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DungeonConstructionState, 
  DungeonConstructionStep,
  DungeonConstructionOption,
  DUNGEON_CONSTRUCTION_STEPS,
  DUNGEON_THEMES,
  DungeonTheme,
  DungeonSize,
  DungeonDanger,
  PrimaryGoal,
  ExplorationStyle
} from '../../types/dungeonCampaign';
import { DUNGEON_CHOICE_OPTIONS } from '../../data/dungeonChoices';

interface DungeonCampaignConstructorProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void; // TODO: Type properly when campaign result type is defined
  characterName: string;
  characterClass: string;
}

export default function DungeonCampaignConstructor({
  isOpen,
  onClose,
  onComplete,
  characterName,
  characterClass
}: DungeonCampaignConstructorProps) {
  const [constructionState, setConstructionState] = useState<DungeonConstructionState>({
    currentStep: 1,
    totalSteps: DUNGEON_CONSTRUCTION_STEPS.length,
    isComplete: false,
    choices: {},
    unlockedSteps: ['theme-selection'],
    campaignPreview: '',
    estimatedDuration: 2,
    recommendedLevel: 1
  });

  const currentStepData = useMemo(() => {
    return DUNGEON_CONSTRUCTION_STEPS.find(step => step.step === constructionState.currentStep);
  }, [constructionState.currentStep]);

  const canProceedToNext = useMemo(() => {
    if (!currentStepData) return false;
    if (!currentStepData.isRequired) return true;
    return !!constructionState.choices[currentStepData.id];
  }, [currentStepData, constructionState.choices]);

  const handleChoice = useCallback((stepId: string, value: any) => {
    setConstructionState(prev => {
      const newChoices = { ...prev.choices, [stepId]: value };
      const currentStep = DUNGEON_CONSTRUCTION_STEPS.find(s => s.id === stepId);
      let newUnlocked = [...prev.unlockedSteps];
      
      // Unlock dependent steps
      if (currentStep?.unlocks) {
        newUnlocked = [...new Set([...newUnlocked, ...currentStep.unlocks])];
      }

      return {
        ...prev,
        choices: newChoices,
        unlockedSteps: newUnlocked,
        campaignPreview: generateCampaignPreview(newChoices, characterName, characterClass)
      };
    });
  }, [characterName, characterClass]);

  const handleNext = useCallback(() => {
    setConstructionState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps)
    }));
  }, []);

  const handlePrevious = useCallback(() => {
    setConstructionState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  const handleComplete = useCallback(() => {
    // Generate final campaign result
    const result = {
      dungeonId: `dungeon_${Date.now()}`,
      campaignName: generateCampaignName(constructionState.choices),
      choices: constructionState.choices,
      characterName,
      characterClass,
      estimatedDuration: constructionState.estimatedDuration,
      recommendedLevel: constructionState.recommendedLevel
    };
    
    onComplete(result);
  }, [constructionState, characterName, characterClass, onComplete]);

  if (!isOpen || !currentStepData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Header */}
        <div className="fantasy-border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight">
              Dungeon Campaign Constructor
            </h2>
            <button
              onClick={onClose}
              className="text-fantasy-shadow hover:text-fantasy-midnight text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div
              className="bg-gradient-to-r from-fantasy-gold to-fantasy-bronze h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(constructionState.currentStep / constructionState.totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-fantasy-shadow">
            Step {constructionState.currentStep} of {constructionState.totalSteps}: {currentStepData.title}
          </p>
        </div>

        <div className="flex h-full max-h-[70vh]">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-fantasy font-bold text-fantasy-midnight mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-fantasy-shadow">
                    {currentStepData.description}
                  </p>
                  {!currentStepData.isRequired && (
                    <p className="text-sm text-fantasy-bronze mt-1">
                      (Optional - you can skip this step)
                    </p>
                  )}
                </div>

                <ChoiceRenderer
                  step={currentStepData}
                  currentChoice={constructionState.choices[currentStepData.id]}
                  onChoice={(value) => handleChoice(currentStepData.id, value)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar - Campaign Preview */}
          <div className="w-80 bg-white/80 border-l-2 border-fantasy-bronze p-4 overflow-y-auto">
            <h4 className="font-fantasy font-bold text-fantasy-midnight mb-3">Campaign Preview</h4>
            <div className="bg-fantasy-parchment/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-fantasy-shadow leading-relaxed">
                {constructionState.campaignPreview || 
                  `${characterName} the ${characterClass} prepares for an adventure...`}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fantasy-shadow">Estimated Duration:</span>
                <span className="font-semibold text-fantasy-midnight">
                  {constructionState.estimatedDuration}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-fantasy-shadow">Recommended Level:</span>
                <span className="font-semibold text-fantasy-midnight">
                  {constructionState.recommendedLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-fantasy-shadow">Choices Made:</span>
                <span className="font-semibold text-fantasy-midnight">
                  {Object.keys(constructionState.choices).length} / {constructionState.totalSteps}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="fantasy-border-t p-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={constructionState.currentStep === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-3">
            {constructionState.currentStep < constructionState.totalSteps ? (
              <>
                {!currentStepData.isRequired && (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-fantasy-silver text-fantasy-midnight rounded font-medium hover:bg-opacity-80 transition-colors"
                  >
                    Skip Step
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNext}
                  className="px-6 py-2 bg-fantasy-gold text-white rounded font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </>
            ) : (
              <button
                onClick={handleComplete}
                className="px-8 py-2 bg-fantasy-crimson text-white rounded font-bold hover:bg-opacity-90 transition-colors"
              >
                Begin Adventure! ⚔️
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper Components

interface ChoiceRendererProps {
  step: DungeonConstructionStep;
  currentChoice: any;
  onChoice: (value: any) => void;
}

function ChoiceRenderer({ step, currentChoice, onChoice }: ChoiceRendererProps) {
  switch (step.choiceType) {
    case 'single-select':
      return (
        <SingleSelectChoice
          stepId={step.id}
          options={getOptionsForStep(step.id)}
          currentChoice={currentChoice}
          onChoice={onChoice}
        />
      );
    case 'multi-select':
      return (
        <MultiSelectChoice
          stepId={step.id}
          options={getOptionsForStep(step.id)}
          currentChoice={currentChoice}
          onChoice={onChoice}
          maxSelections={step.maxSelections || 3}
        />
      );
    case 'slider':
      return (
        <SliderChoice
          stepId={step.id}
          currentChoice={currentChoice}
          onChoice={onChoice}
        />
      );
    case 'text-input':
      return (
        <TextInputChoice
          stepId={step.id}
          currentChoice={currentChoice}
          onChoice={onChoice}
        />
      );
    default:
      return <div>Unknown choice type</div>;
  }
}

// Single Select Component
function SingleSelectChoice({ stepId, options, currentChoice, onChoice }: {
  stepId: string;
  options: DungeonConstructionOption[];
  currentChoice: any;
  onChoice: (value: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onChoice(option.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentChoice === option.id
              ? 'border-fantasy-gold bg-fantasy-gold/20 shadow-lg'
              : 'border-fantasy-bronze/30 bg-white hover:border-fantasy-bronze hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{option.icon}</span>
            <div className="flex-1">
              <h4 className="font-fantasy font-bold text-fantasy-midnight mb-1">
                {option.title}
              </h4>
              <p className="text-sm text-fantasy-shadow mb-2">
                {option.description}
              </p>
              {option.consequences.length > 0 && (
                <div className="text-xs text-fantasy-bronze">
                  • {option.consequences[0]}
                </div>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// Multi Select Component
function MultiSelectChoice({ stepId, options, currentChoice, onChoice, maxSelections }: {
  stepId: string;
  options: DungeonConstructionOption[];
  currentChoice: any;
  onChoice: (value: any) => void;
  maxSelections: number;
}) {
  const selectedOptions = currentChoice || [];

  const handleToggle = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id: string) => id !== optionId)
      : selectedOptions.length < maxSelections
        ? [...selectedOptions, optionId]
        : selectedOptions;
    
    onChoice(newSelection);
  };

  return (
    <div>
      <p className="text-sm text-fantasy-bronze mb-4">
        Select up to {maxSelections} options ({selectedOptions.length}/{maxSelections} selected)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const canSelect = selectedOptions.length < maxSelections || isSelected;
          
          return (
            <motion.button
              key={option.id}
              onClick={() => canSelect && handleToggle(option.id)}
              disabled={!canSelect}
              whileHover={canSelect ? { scale: 1.02 } : {}}
              whileTap={canSelect ? { scale: 0.98 } : {}}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-fantasy-gold bg-fantasy-gold/20'
                  : canSelect
                    ? 'border-fantasy-bronze/30 bg-white hover:border-fantasy-bronze'
                    : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{option.icon}</span>
                <div>
                  <h5 className="font-semibold text-fantasy-midnight text-sm">
                    {option.title}
                  </h5>
                  <p className="text-xs text-fantasy-shadow">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Slider Choice Component
function SliderChoice({ stepId, currentChoice, onChoice }: {
  stepId: string;
  currentChoice: any;
  onChoice: (value: any) => void;
}) {
  const value = currentChoice || 3;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-fantasy-shadow">
        <span>Low Risk, Low Reward</span>
        <span>High Risk, High Reward</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChoice(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-fantasy-gold/20 rounded-full text-sm font-semibold text-fantasy-midnight">
          Risk Level: {['Minimal', 'Low', 'Moderate', 'High', 'Extreme'][value - 1]}
        </span>
      </div>
    </div>
  );
}

// Text Input Choice Component  
function TextInputChoice({ stepId, currentChoice, onChoice }: {
  stepId: string;
  currentChoice: any;
  onChoice: (value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <textarea
        value={currentChoice || ''}
        onChange={(e) => onChoice(e.target.value)}
        placeholder="Describe any specific elements you'd like to include in your dungeon adventure..."
        className="w-full h-32 p-3 border-2 border-fantasy-bronze/30 rounded-lg focus:border-fantasy-gold focus:outline-none resize-none"
        maxLength={500}
      />
      <p className="text-xs text-fantasy-shadow text-right">
        {(currentChoice || '').length}/500 characters
      </p>
    </div>
  );
}

// Helper Functions

function generateCampaignPreview(choices: Record<string, any>, characterName: string, characterClass: string): string {
  const theme = choices['theme-selection'];
  const size = choices['size-scope'];
  const goal = choices['primary-goal'];
  
  if (!theme) {
    return `${characterName} the ${characterClass} stands ready for adventure, considering what dangers await...`;
  }

  const themeInfo = DUNGEON_THEMES[theme as DungeonTheme];
  let preview = `${characterName} the ${characterClass} approaches ${themeInfo?.name.toLowerCase() || 'a mysterious location'}`;
  
  if (size) {
    const sizeDesc = {
      'small': 'compact',
      'medium': 'sprawling',
      'large': 'vast',
      'massive': 'enormous'
    }[size] || 'mysterious';
    preview += `, a ${sizeDesc} complex`;
  }
  
  if (goal) {
    const goalDesc = {
      'treasure-hunt': 'seeking ancient treasures',
      'rescue-mission': 'on a desperate rescue mission',
      'investigation': 'investigating dark mysteries',
      'elimination': 'hunting dangerous foes',
      'artifact-retrieval': 'pursuing a legendary artifact',
      'escape': 'planning a daring escape'
    }[goal] || 'with unknown purpose';
    preview += ` ${goalDesc}`;
  }
  
  preview += '. ' + (themeInfo?.atmosphere || 'The air is thick with anticipation and danger.');
  
  return preview;
}

function generateCampaignName(choices: Record<string, any>): string {
  const theme = choices['theme-selection'];
  const goal = choices['primary-goal'];
  
  const themeNames = {
    'ancient-tomb': 'Tomb',
    'wizard-tower': 'Tower',
    'underground-city': 'Depths',
    'natural-cavern': 'Caverns',
    'abandoned-mine': 'Mine',
    'cult-temple': 'Temple',
    'dragon-lair': 'Lair',
    'prison-fortress': 'Fortress'
  };
  
  const goalPrefixes = {
    'treasure-hunt': 'Treasures of the',
    'rescue-mission': 'Rescue from the',
    'investigation': 'Mystery of the',
    'elimination': 'Cleansing of the',
    'artifact-retrieval': 'Quest for the',
    'escape': 'Escape from the'
  };
  
  const themeName = themeNames[theme as keyof typeof themeNames] || 'Unknown';
  const goalPrefix = goalPrefixes[goal as keyof typeof goalPrefixes] || 'Adventure in the';
  
  return `${goalPrefix} ${themeName}`;
}

function getOptionsForStep(stepId: string): DungeonConstructionOption[] {
  return DUNGEON_CHOICE_OPTIONS[stepId] || [];
}