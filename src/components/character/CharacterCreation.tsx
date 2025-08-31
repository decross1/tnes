import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTER_CLASSES, type CharacterCreationState, type BackstoryMethod } from '../../types/character';
import { claudeApi } from '../../services/claudeApi';
import { imageApi } from '../../services/imageApi';
import ClassSelection from './ClassSelection';
import BackstoryGenerator from './BackstoryGenerator';
import PortraitGenerator from './PortraitGenerator';
import { PromptDebugger } from '../dev/PromptDebugger';

interface CharacterCreationProps {
  onComplete: (character: {
    name: string;
    class: string;
    backstory: string;
    portraitUrl?: string;
  }) => void;
  onCancel?: () => void;
}

export default function CharacterCreation({ onComplete, onCancel }: CharacterCreationProps) {
  const [step, setStep] = useState<CharacterCreationState['step']>('class');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('');
  const [backstoryMethod, setBackstoryMethod] = useState<BackstoryMethod>('ai-generate');
  const [backstoryContent, setBackstoryContent] = useState<string>('');
  const [backstoryKeywords, setBackstoryKeywords] = useState<string[]>([]);
  const [portraitUrl, setPortraitUrl] = useState<string>('');
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 'class':
        return !!selectedClass;
      case 'name':
        return characterName.trim().length > 0;
      case 'backstory':
        return !!backstoryContent || backstoryMethod === 'skip';
      default:
        return true;
    }
  };

  const handleNext = async () => {
    switch (step) {
      case 'class':
        setStep('name');
        break;
      case 'name':
        setStep('backstory');
        break;
      case 'backstory':
        await handleBackstoryComplete();
        break;
      default:
        break;
    }
  };

  const handleBackstoryComplete = async () => {
    let finalBackstory = backstoryContent;

    // Generate backstory if needed
    if (!backstoryContent && backstoryMethod !== 'skip') {
      setIsGeneratingBackstory(true);
      try {
        const method = backstoryMethod === 'keywords' ? 'keywords' : 
                     backstoryMethod === 'ai-generate' ? 'full' : 'class-based';
        
        finalBackstory = await claudeApi.generateCharacterBackstory({
          characterName,
          characterClass: selectedClass,
          keywords: backstoryMethod === 'keywords' ? backstoryKeywords : undefined,
          method
        });
        setBackstoryContent(finalBackstory);
      } catch (error) {
        console.error('Failed to generate backstory:', error);
        // Use fallback
        finalBackstory = `You are ${characterName}, a ${selectedClass} with a mysterious past. Your journey begins now.`;
        setBackstoryContent(finalBackstory);
      } finally {
        setIsGeneratingBackstory(false);
      }
    }

    // Generate portrait
    setIsGeneratingPortrait(true);
    try {
      const portrait = await imageApi.generateCharacterPortrait({
        characterName,
        characterClass: selectedClass,
        backstory: finalBackstory
      });
      setPortraitUrl(portrait.url);
    } catch (error) {
      console.error('Failed to generate portrait:', error);
      // Portrait is optional, continue without it
    } finally {
      setIsGeneratingPortrait(false);
    }

    // Complete character creation
    onComplete({
      name: characterName,
      class: selectedClass,
      backstory: finalBackstory,
      portraitUrl: portraitUrl
    });
  };

  const handleBack = () => {
    switch (step) {
      case 'name':
        setStep('class');
        break;
      case 'backstory':
        setStep('name');
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal"
        style={{ maxWidth: '800px', width: '90vw' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Create Your Character</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['class', 'name', 'backstory'].map((s, index) => (
                <div
                  key={s}
                  style={{
                    width: '40px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: ['class', 'name', 'backstory'].indexOf(step) >= index ? '#D4AF37' : '#E5E7EB'
                  }}
                />
              ))}
            </div>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="close-button">×</button>
          )}
        </div>

        {/* Content */}
        <div className="modal-content">
          <AnimatePresence mode="wait">
            {step === 'class' && (
              <ClassSelection
                key="class"
                selectedClass={selectedClass}
                onSelect={setSelectedClass}
              />
            )}

            {step === 'name' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ textAlign: 'center' }}
              >
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>
                  Name Your {selectedClass}
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px' }}>
                    {CHARACTER_CLASSES[selectedClass]?.icon}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter character name..."
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '18px',
                    textAlign: 'center',
                    border: '2px solid #D4AF37',
                    borderRadius: '8px',
                    backgroundColor: '#F4E4BC',
                    marginBottom: '16px'
                  }}
                  autoFocus
                />
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Choose a name that fits your {selectedClass}'s background and personality
                </p>
              </motion.div>
            )}

            {step === 'backstory' && (
              <BackstoryGenerator
                key="backstory"
                characterName={characterName}
                characterClass={selectedClass}
                method={backstoryMethod}
                onMethodChange={setBackstoryMethod}
                content={backstoryContent}
                onContentChange={setBackstoryContent}
                keywords={backstoryKeywords}
                onKeywordsChange={setBackstoryKeywords}
                isGenerating={isGeneratingBackstory}
              />
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <button
              onClick={handleBack}
              disabled={step === 'class'}
              style={{
                padding: '12px 24px',
                backgroundColor: step === 'class' ? '#E5E7EB' : '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: step === 'class' ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Back
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
              {step === 'class' && 'Choose your character class'}
              {step === 'name' && 'Name your character'}
              {step === 'backstory' && 'Create your backstory'}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isGeneratingBackstory || isGeneratingPortrait}
              className="choice-button"
              style={{
                padding: '12px 24px',
                opacity: (!canProceed() || isGeneratingBackstory || isGeneratingPortrait) ? 0.5 : 1,
                cursor: (!canProceed() || isGeneratingBackstory || isGeneratingPortrait) ? 'not-allowed' : 'pointer'
              }}
            >
              {step === 'backstory' ? (
                isGeneratingBackstory ? 'Generating Story...' :
                isGeneratingPortrait ? 'Creating Portrait...' :
                'Create Character'
              ) : 'Next'}
            </button>
          </div>
          
          {/* Development Only: Prompt Debugger */}
          {process.env.NODE_ENV === 'development' && characterName && selectedClass && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <PromptDebugger
                characterClass={selectedClass as any}
                characterName={characterName}
                userKeywords={['scarred', 'battle-worn', 'determined', 'heavy armor']} // Mock visual keywords for now
                backstoryKeywords={backstoryKeywords}
                campaignTone="heroic"
                method={
                  backstoryMethod === 'keywords' ? 'keywords' : 
                  backstoryMethod === 'ai-generate' ? 'full' : 
                  'class-based'
                }
              />
            </div>
          )}
        </div>

        {/* Portrait Preview */}
        <PortraitGenerator
          portraitUrl={portraitUrl}
          isGenerating={isGeneratingPortrait}
          characterName={characterName}
          characterClass={selectedClass}
        />
      </motion.div>
    </div>
  );
}