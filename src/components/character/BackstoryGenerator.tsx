import { motion, AnimatePresence } from 'framer-motion';
import { BACKSTORY_OPTIONS, type BackstoryMethod } from '../../types/character';
import KeywordInput from '../campaign/KeywordInput';

interface BackstoryGeneratorProps {
  characterName: string;
  characterClass: string;
  method: BackstoryMethod;
  onMethodChange: (method: BackstoryMethod) => void;
  content: string;
  onContentChange: (content: string) => void;
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  isGenerating: boolean;
}

export default function BackstoryGenerator({
  characterName,
  characterClass,
  method,
  onMethodChange,
  content,
  onContentChange,
  keywords,
  onKeywordsChange,
  isGenerating
}: BackstoryGeneratorProps) {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
          Create {characterName}'s Story
        </h3>
        <p style={{ color: '#666' }}>
          How would you like to develop your {characterClass}'s backstory?
        </p>
      </div>

      {/* Method Selection */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px',
        marginBottom: '24px'
      }}>
        {BACKSTORY_OPTIONS.map((option) => (
          <motion.button
            key={option.method}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMethodChange(option.method)}
            style={{
              padding: '16px',
              border: `2px solid ${method === option.method ? '#D4AF37' : '#E5E7EB'}`,
              borderRadius: '8px',
              backgroundColor: method === option.method ? '#FEF7E0' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>
                {option.icon}
              </span>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {option.title}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
              {option.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Method-specific Content */}
      <AnimatePresence mode="wait">
        {method === 'keywords' && (
          <motion.div
            key="keywords"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: '24px' }}
          >
            <KeywordInput
              keywords={keywords}
              onKeywordsChange={onKeywordsChange}
              placeholder="Add story elements (e.g., revenge, noble house, cursed sword)"
              maxKeywords={5}
              suggestions={[
                'revenge', 'prophecy', 'artifact', 'rescue', 'mystery',
                'noble house', 'cursed item', 'lost family', 'secret society',
                'war veteran', 'exile', 'scholar', 'street orphan', 'merchant'
              ]}
              title="Story Keywords"
              description="Add elements you want included in your backstory"
            />
          </motion.div>
        )}

        {method === 'custom-write' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: '24px' }}
          >
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Write Your Backstory
            </label>
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder={`Write ${characterName}'s backstory here... Include their origin, motivation, and why they're adventuring.`}
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #D4AF37',
                borderRadius: '8px',
                backgroundColor: '#F4E4BC',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Write in second person ("You were born...") and aim for 150-200 words
            </p>
          </motion.div>
        )}

        {method === 'ai-generate' && (
          <motion.div
            key="ai-generate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '20px',
              backgroundColor: '#F4E4BC',
              borderRadius: '8px',
              border: '2px solid #D4AF37',
              textAlign: 'center',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎲</div>
            <h4 style={{ marginBottom: '8px', color: '#D4AF37' }}>
              AI Story Generation
            </h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Our AI will create a unique backstory for {characterName} the {characterClass}, 
              including their origin, motivation, and secrets that will influence your adventure.
            </p>
          </motion.div>
        )}

        {method === 'skip' && (
          <motion.div
            key="skip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '20px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              border: '2px solid #E5E7EB',
              textAlign: 'center',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
            <h4 style={{ marginBottom: '8px', color: '#6B7280' }}>
              Quick Start
            </h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              A default {characterClass} backstory will be used. You can always develop 
              your character's story through gameplay choices.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Content Preview */}
      {content && method !== 'custom-write' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#FEF7E0',
            borderRadius: '8px',
            border: '2px solid #D4AF37'
          }}
        >
          <h4 style={{ color: '#D4AF37', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>📜</span>
            {characterName}'s Story
          </h4>
          <div 
            className="story-text"
            style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}
          >
            {content}
          </div>
          <button
            onClick={() => onContentChange('')}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              backgroundColor: '#CD7F32',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Generate New Story
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            marginTop: '16px'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #D4AF37',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ marginLeft: '12px', color: '#D4AF37', fontWeight: 'medium' }}>
            Crafting {characterName}'s story...
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}