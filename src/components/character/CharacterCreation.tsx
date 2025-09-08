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
  const [portraitGenerationError, setPortraitGenerationError] = useState<string>('');

  const canProceed = () => {
    switch (step) {
      case 'class':
        return !!selectedClass;
      case 'name':
        return characterName.trim().length > 0;
      case 'backstory':
        // Allow proceeding if:
        // - Content already exists (custom-write or generated)
        // - Skip method is selected
        // - Keywords method with at least 1 keyword
        // - AI-generate method (will generate on submit)
        return !!backstoryContent || 
               backstoryMethod === 'skip' || 
               (backstoryMethod === 'keywords' && backstoryKeywords.length > 0) ||
               backstoryMethod === 'ai-generate';
      case 'confirmation':
        return !!backstoryContent && !!portraitUrl; // Need both backstory and portrait (since we only get here after successful generation)
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
      case 'confirmation':
        await handleCompleteCharacter();
        break;
      default:
        break;
    }
  };

  const handleBackstoryComplete = async () => {
    let finalBackstory = backstoryContent;

    console.group('🎯 === CHARACTER CREATION WORKFLOW ===');
    console.log('📋 Backstory Method Decision:', {
      method: backstoryMethod,
      hasExistingContent: !!backstoryContent,
      needsGeneration: !backstoryContent && backstoryMethod !== 'skip' && backstoryMethod !== 'custom-write',
      keywordCount: backstoryKeywords.length
    });

    // 🚨 CONDITIONAL API CALLING LOGIC
    if (backstoryMethod === 'custom-write') {
      console.log('✍️ CUSTOM BACKSTORY: Using user-written content, skipping Claude API');
      finalBackstory = backstoryContent; // User already wrote it
    } else if (!backstoryContent && backstoryMethod !== 'skip') {
      // Only call Claude API when we need to generate content
      console.log('🤖 CALLING CLAUDE API for backstory generation...');
      setIsGeneratingBackstory(true);
      
      try {
        const method = backstoryMethod === 'keywords' ? 'keywords' : 
                     backstoryMethod === 'ai-generate' ? 'full' : 'class-based';
        
        const backstoryResult = await claudeApi.generateCharacterBackstory({
          characterName,
          characterClass: selectedClass as 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric',
          keywords: backstoryMethod === 'keywords' ? backstoryKeywords : undefined,
          method,
          campaignTone: undefined, // TODO: Add campaign tone from campaign setup
          wordLimit: 200
        });
        
        finalBackstory = backstoryResult.backstory;
        setBackstoryContent(finalBackstory);
        console.log('✅ Claude API backstory generation completed');
        
      } catch (error) {
        console.error('❌ Failed to generate backstory:', error);
        // Use fallback
        finalBackstory = `You are ${characterName}, a ${selectedClass} with a mysterious past. Your journey begins now.`;
        setBackstoryContent(finalBackstory);
        console.log('🔄 Using fallback backstory due to API error');
      } finally {
        setIsGeneratingBackstory(false);
      }
    } else if (backstoryMethod === 'skip') {
      console.log('⚡ SKIP METHOD: Using default class-based backstory');
      finalBackstory = `You are ${characterName}, a ${selectedClass} ready for adventure.`;
    }

    console.log('📖 Final backstory length:', finalBackstory.length, 'characters');
    console.groupEnd();

    // Generate portrait using the new function
    await generatePortrait();
  };

  const handleCompleteCharacter = async () => {
    // Complete character creation with all generated data
    onComplete({
      name: characterName,
      class: selectedClass,
      backstory: backstoryContent,
      portraitUrl: portraitUrl
    });
  };

  const handleRetryPortraitGeneration = async () => {
    // Retry portrait generation with current character data
    await generatePortrait();
  };

  const generatePortrait = async () => {
    if (!characterName || !selectedClass || !backstoryContent) {
      console.error('❌ Cannot generate portrait: missing character data');
      return;
    }

    setIsGeneratingPortrait(true);
    setPortraitGenerationError('');
    
    try {
      console.group('🎨 === PORTRAIT GENERATION RETRY ===');
      console.log('📝 RETRYING PORTRAIT FOR:', {
        characterName,
        characterClass: selectedClass,
        backstory: backstoryContent.substring(0, 100) + '...',
        backstoryLength: backstoryContent.length
      });
      
      const portrait = await imageApi.generateCharacterPortrait({
        characterName,
        characterClass: selectedClass,
        backstory: backstoryContent
      });
      
      console.log('✅ PORTRAIT RETRY RESPONSE:', {
        url: portrait.url,
        urlLength: portrait.url?.length || 0,
        alt_text: portrait.alt_text,
        revised_prompt: portrait.revised_prompt
      });
      
      if (portrait.url && portrait.url.length > 0) {
        console.log('✅ PORTRAIT RETRY SUCCESSFUL - Moving to confirmation');
        setPortraitUrl(portrait.url);
        setPortraitGenerationError('');
        setStep('confirmation');
      } else {
        throw new Error('Portrait generation returned empty URL');
      }
      
      console.groupEnd();
    } catch (error) {
      console.error('❌ PORTRAIT RETRY FAILED:', error);
      console.groupEnd();
      
      setPortraitUrl('');
      setPortraitGenerationError(`Portrait generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  const handleRestartCharacterCreation = () => {
    // Reset all state and go back to class selection
    setSelectedClass('');
    setCharacterName('');
    setBackstoryMethod('ai-generate');
    setBackstoryContent('');
    setBackstoryKeywords([]);
    setPortraitUrl('');
    setPortraitGenerationError('');
    setStep('class');
  };

  const handleBack = () => {
    switch (step) {
      case 'name':
        setStep('class');
        break;
      case 'backstory':
        setStep('name');
        break;
      case 'confirmation':
        setStep('backstory');
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
              {['class', 'name', 'backstory', 'confirmation'].map((s, index) => (
                <div
                  key={s}
                  style={{
                    width: '30px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: ['class', 'name', 'backstory', 'confirmation'].indexOf(step) >= index ? '#D4AF37' : '#E5E7EB'
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
              <div key="backstory">
                <BackstoryGenerator
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
                
                {/* Portrait Generation Status */}
                {isGeneratingPortrait && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '24px',
                      padding: '20px',
                      backgroundColor: '#F0F8FF',
                      border: '2px solid #4682B4',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>🎨</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4682B4', marginBottom: '8px' }}>
                      Generating Your Portrait
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                      Creating a unique character portrait based on your backstory...
                    </p>
                    
                    {/* Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#E0E0E0',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '60%',
                        height: '100%',
                        backgroundColor: '#4682B4',
                        borderRadius: '3px',
                        animation: 'pulse 2s infinite ease-in-out'
                      }} />
                    </div>
                    
                    <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                      This may take 30-60 seconds...
                    </p>
                  </motion.div>
                )}

                {/* Portrait Generation Error */}
                {portraitGenerationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '24px',
                      padding: '20px',
                      backgroundColor: '#FFF5F5',
                      border: '2px solid #F56565',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>❌</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F56565', marginBottom: '8px' }}>
                      Portrait Generation Failed
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                      {portraitGenerationError}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={handleRetryPortraitGeneration}
                        disabled={isGeneratingPortrait}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#4299E1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: isGeneratingPortrait ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          fontSize: '14px',
                          opacity: isGeneratingPortrait ? 0.6 : 1
                        }}
                      >
                        🔄 Try Again
                      </button>
                      <button
                        onClick={() => {
                          setPortraitGenerationError('');
                          setPortraitUrl('');
                          setStep('confirmation');
                        }}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#6B7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}
                      >
                        ⚡ Skip Portrait
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ textAlign: 'center' }}
                onAnimationComplete={() => {
                  console.log('🔍 CONFIRMATION STEP REACHED:', {
                    step,
                    portraitUrl,
                    portraitUrlLength: portraitUrl?.length || 0,
                    backstoryContent: backstoryContent?.substring(0, 50) + '...'
                  });
                }}
              >
                <h3 style={{ fontSize: '24px', marginBottom: '24px', color: '#8B5A3C' }}>
                  🎭 Character Complete!
                </h3>
                
                <div style={{ marginBottom: '24px' }}>
                  {portraitUrl ? (
                    <img
                      src={portraitUrl}
                      alt={`${characterName} portrait`}
                      style={{
                        width: '200px',
                        height: '267px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '3px solid #D4AF37',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        marginBottom: '16px'
                      }}
                      onLoad={() => console.log('✅ Portrait image loaded successfully:', portraitUrl)}
                      onError={() => console.error('❌ Portrait image failed to load:', portraitUrl)}
                    />
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '267px',
                      backgroundColor: '#F4E4BC',
                      border: '3px solid #D4AF37',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '48px'
                    }}>
                      {CHARACTER_CLASSES[selectedClass]?.icon}
                      <div style={{ fontSize: '12px', marginTop: '8px', color: '#8B5A3C' }}>
                        {isGeneratingPortrait ? 'Generating...' : 'Portrait not available'}
                      </div>
                    </div>
                  )}
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B5A3C', marginBottom: '4px' }}>
                    {characterName}
                  </h4>
                  <p style={{ color: '#666', fontSize: '16px', marginBottom: '16px' }}>
                    Level 1 {selectedClass}
                  </p>
                </div>

                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  backgroundColor: '#F9F9F9', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  marginBottom: '24px',
                  textAlign: 'left'
                }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#8B5A3C' }}>
                    📖 Your Story:
                  </h5>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                    {backstoryContent}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={handleRestartCharacterCreation}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#6B7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                    🔄 Start Over
                  </button>
                  <button
                    onClick={handleCompleteCharacter}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#D4AF37',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    ⚔️ Begin Adventure!
                  </button>
                </div>

                <p style={{ 
                  fontSize: '12px', 
                  color: '#999', 
                  marginTop: '16px',
                  fontStyle: 'italic'
                }}>
                  ⚠️ Starting over will require re-entering all character details
                </p>
              </motion.div>
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

            {step !== 'confirmation' && (
              <>
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
                    'Generate Character'
                  ) : 'Next'}
                </button>
              </>
            )}

            {step === 'confirmation' && (
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                Review your character and choose to proceed or start over
              </div>
            )}
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