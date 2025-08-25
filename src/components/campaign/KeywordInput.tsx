import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  placeholder?: string;
  maxKeywords?: number;
  suggestions?: string[];
  title?: string;
  description?: string;
}

export default function KeywordInput({
  keywords,
  onKeywordsChange,
  placeholder = 'Add keywords...',
  maxKeywords = 10,
  suggestions = [],
  title = 'Keywords',
  description
}: KeywordInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < maxKeywords) {
      onKeywordsChange([...keywords, trimmed]);
      setInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onKeywordsChange(keywords.filter(k => k !== keywordToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(input);
    }
  };

  const filteredSuggestions = suggestions.filter(
    s => !keywords.includes(s.toLowerCase()) && 
         s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
          {title} {keywords.length > 0 && (
            <span style={{ color: '#666', fontWeight: 'normal' }}>
              ({keywords.length}/{maxKeywords})
            </span>
          )}
        </label>
        {description && (
          <p style={{ fontSize: '12px', color: '#666' }}>
            {description}
          </p>
        )}
      </div>

      {/* Current Keywords */}
      {keywords.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <AnimatePresence>
              {keywords.map((keyword) => (
                <motion.span
                  key={keyword}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    backgroundColor: '#D4AF37',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    style={{
                      marginLeft: '6px',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Input Field */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={keywords.length >= maxKeywords ? 
            `Maximum ${maxKeywords} keywords reached` : 
            placeholder
          }
          disabled={keywords.length >= maxKeywords}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #D4AF37',
            borderRadius: '8px',
            backgroundColor: keywords.length >= maxKeywords ? '#F3F4F6' : '#F4E4BC',
            fontSize: '14px'
          }}
        />

        {/* Add Button */}
        {input.trim() && keywords.length < maxKeywords && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => addKeyword(input)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#D4AF37',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            +
          </motion.button>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (input || filteredSuggestions.length > 0) && keywords.length < maxKeywords && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: '8px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}
          >
            {(filteredSuggestions.length > 0 ? filteredSuggestions : suggestions)
              .slice(0, 12)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addKeyword(suggestion)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    backgroundColor: '#E5E7EB',
                    border: '1px solid #D1D5DB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: '#374151',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4AF37';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  {suggestion}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
        Press Enter or click + to add keywords. Click suggestions to add them quickly.
      </p>
    </div>
  );
}