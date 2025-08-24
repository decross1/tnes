# Claude.md - D&D Solo Adventure App Development Guide

## Project Status: SCAFFOLDING COMPLETE ✅
**Current Phase**: Basic app structure and UI completed, ready for AI integration

## Project Context
You are helping build a dynamic choose-your-own-adventure D&D game where:
- Players make binary choices at each decision point
- Dice rolls (d20 + modifiers) determine outcomes
- AI generates dynamic story content and choices
- Each scene includes an AI-generated image
- A story scroll tracks all decisions and rolls
- The game follows simplified D&D 5e mechanics

## ✅ COMPLETED FEATURES (v0.1.0)

### Core Infrastructure
- ✅ Vite + React + TypeScript project setup
- ✅ Node.js 22.18.0 LTS compatibility
- ✅ Custom CSS styling system (fantasy theme)
- ✅ Zustand state management with persistence
- ✅ Framer Motion animations
- ✅ Complete TypeScript type definitions

### Game Mechanics
- ✅ D&D 5e ability score system
- ✅ Proper modifier calculations: `Math.floor((ability - 10) / 2)`
- ✅ Proficiency bonus: `2 + Math.floor((level - 1) / 4)`
- ✅ Advantage/Disadvantage dice rolling
- ✅ Critical success/failure detection (Natural 20/1)
- ✅ Four character classes: Fighter, Rogue, Wizard, Cleric

### UI Components
- ✅ **SceneDisplay**: Story rendering with image support
- ✅ **ChoiceButtons**: Interactive choices with ability check indicators  
- ✅ **DiceRoller**: Animated 3D dice with proper D&D mechanics
- ✅ **StoryScroll**: Adventure history with filtering and search
- ✅ **Character Stats**: Real-time ability scores and HP tracking

### Styling & UX
- ✅ Fantasy-themed UI with parchment backgrounds
- ✅ Medieval color palette (gold, bronze, midnight blue)
- ✅ Cinzel and Merriweather fonts for fantasy aesthetics
- ✅ Responsive design for mobile and desktop
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling

## Core Technologies (CURRENT)
- ✅ **Frontend**: React 19.1.1 with TypeScript 5.9.2
- ✅ **State Management**: Zustand 5.0.8 with persistence
- ✅ **Styling**: Custom CSS with fantasy theme (Tailwind CSS removed due to v4 compatibility issues)
- 🟡 **AI Services**: Claude API for story, DALL-E 3 or Stable Diffusion for images (NOT YET IMPLEMENTED)
- ✅ **Animations**: Framer Motion 12.23.12 for dice rolls and transitions
- ✅ **Build Tool**: Vite 7.1.3

## 🔄 NEXT DEVELOPMENT PHASE

### Priority 1: AI Integration
- 🟡 Set up Claude API service layer
- 🟡 Implement dynamic story generation
- 🟡 Create scene context system for continuity
- 🟡 Add image generation integration

### Priority 2: Game Content
- 🟡 Create fallback story content system
- 🟡 Build scene templates and variations
- 🟡 Implement combat encounters
- 🟡 Add character progression (leveling, XP, items)

### Priority 3: Polish & Features
- 🟡 Sound effects and audio
- 🟡 Save/load system improvements  
- 🟡 Character creation wizard
- 🟡 Settings and accessibility options

## IMPORTANT TECHNICAL NOTES

### CSS Architecture Decision
**CHANGED**: Removed Tailwind CSS v4.1.12 due to PostCSS compatibility issues. Now using custom CSS with:
- Fantasy color palette and typography
- Component-based styling approach
- Responsive design patterns
- Animation keyframes for dice and transitions

### Current File Structure
```
src/
├── components/          # UI components (SceneDisplay, ChoiceButtons, etc.)
├── stores/             # Zustand state management
├── types/              # TypeScript interfaces
├── utils/              # Game mechanics and character utilities
├── services/           # 🟡 API integration layer (TODO)
├── assets/             # 🟡 Images and sounds (TODO)
├── App.tsx             # Main application
├── main.tsx            # React entry point
└── index.css           # Custom fantasy-themed CSS
```

### Development Commands
```bash
# Development (WORKING)
npm run dev              # Starts on http://localhost:5173/

# Build (WORKING) 
npm run build           # TypeScript compilation + Vite build

# Environment Setup
# Add your API keys to .env file:
# VITE_CLAUDE_API_KEY=your_key_here
# VITE_IMAGE_API_KEY=your_key_here
```

## Development Principles

### 1. Game Mechanics First
Always ensure D&D mechanics are properly implemented:
- Ability modifiers: `Math.floor((ability - 10) / 2)`
- Proficiency bonus: `2 + Math.floor((level - 1) / 4)`
- Advantage/Disadvantage: Roll twice, take higher/lower
- Critical hits/fails: Natural 20/1 on d20

### 2. AI Prompt Engineering
When generating prompts for Claude API:
```typescript
// Always include:
const context = {
  characterState: getCurrentCharacter(),
  recentHistory: getLastNDecisions(3),
  currentObjective: getActiveQuest(),
  toneGuidelines: "Dark fantasy, immersive, second-person narrative"
};
```

### 3. Image Generation Best Practices
```typescript
// Image prompt structure:
const imagePrompt = `
  Fantasy digital art style,
  ${sceneDescription},
  Dramatic lighting,
  Epic composition,
  D&D aesthetic,
  --ar 16:9
`;
```

### 4. State Management Pattern
```typescript
// Use this structure for game state:
interface GameState {
  character: Character;
  currentScene: Scene;
  storyHistory: Decision[];
  pendingRoll: PendingRoll | null;
  ui: UIState;
}
```

## Component Development Guidelines

### Scene Display Component
```tsx
// SceneDisplay should:
// 1. Render markdown from AI response
// 2. Lazy load images with skeleton
// 3. Animate text appearance
// 4. Handle long descriptions with "read more"
```

### Choice Buttons
```tsx
// Each choice should display:
// - Choice text
// - Required ability check (e.g., "DEX Check DC 15")
// - Advantage/disadvantage indicators
// - Disabled state while rolling
```

### Dice Roller
```tsx
// Implement:
// - 3D dice animation or sprite sequence
// - Sound effects
// - Roll history in tooltip
// - Modifier breakdown on hover
```

### Story Scroll
```tsx
// Features:
// - Virtualized list for performance
// - Collapsible entries
// - Filter by decision type
// - Export to PDF/markdown
```

## API Integration Patterns

### Claude API Calls
```typescript
// Use exponential backoff for retries
// Cache responses by context hash
// Implement streaming for long responses
// Add timeout handling (30s max)

async function generateScene(context: SceneContext): Promise<Scene> {
  const cacheKey = hashContext(context);
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  
  try {
    const response = await claudeAPI.complete({
      prompt: buildScenePrompt(context),
      max_tokens: 1000,
      temperature: 0.8,
    });
    
    const scene = parseSceneResponse(response);
    cache.set(cacheKey, scene);
    return scene;
  } catch (error) {
    return fallbackSceneGenerator(context);
  }
}
```

### Image Generation
```typescript
// Queue image requests to respect rate limits
// Generate placeholder while waiting
// Store images with scene ID
// Implement retry with different prompts on failure
```

## Game Flow Implementation

### Scene Transition Flow
1. Player selects choice
2. Show dice rolling animation
3. Calculate result with modifiers
4. Fade out current scene
5. Generate next scene (show loading state)
6. Request image generation (async)
7. Fade in new scene
8. Update story scroll
9. Check for level up/game over conditions

### Combat Encounters
```typescript
// Simplified combat:
// - Initiative: Single d20 roll determines who goes first
// - Actions: Attack, Defend (+2 AC), Special Ability, Flee
// - Enemy AI: Simple behavior trees based on HP thresholds
// - Victory: XP, loot table roll, story continuation
```

## Error Handling & Edge Cases

### API Failures
```typescript
// Always have fallbacks:
const fallbacks = {
  scene: generateLocalScene,        // Pre-written scenes
  image: getPlaceholderImage,       // Genre-appropriate stock images
  choice: getDefaultChoices,        // Generic "continue" options
};
```

### Save System
```typescript
// Auto-save after each decision
// Store in localStorage with versioning
// Cloud sync optional (Firebase/Supabase)
// Export/import JSON save files
```

## Performance Optimizations

### Critical Rendering Path
1. Load character data first
2. Render UI skeleton
3. Fetch current scene
4. Load images async
5. Preload next possible scenes

### Bundle Optimization
```javascript
// Lazy load heavy components:
const StoryScroll = lazy(() => import('./StoryScroll'));
const CharacterSheet = lazy(() => import('./CharacterSheet'));
```

## Testing Scenarios

### Key Test Cases
1. **Character Creation**: All classes properly initialized
2. **Dice Rolling**: Modifiers correctly applied
3. **Story Continuity**: Choices affect future scenes
4. **Edge Cases**: 
   - Death handling
   - Level 10 cap
   - Empty inventory
   - Network offline
5. **Save/Load**: State persistence across sessions

### Automated Testing
```typescript
// Test utilities:
mockDiceRoll(20); // Force critical success
mockAPIResponse(testScene); // Predictable scenes
testDecisionPath(['choice1', 'choice2', 'choice3']); // Test sequences
```

## Deployment Checklist

### Environment Variables
```env
VITE_CLAUDE_API_KEY=
VITE_IMAGE_API_KEY=
VITE_API_BASE_URL=
VITE_ENABLE_ANALYTICS=
```

### Pre-deployment
- [ ] API keys secured
- [ ] Error tracking configured (Sentry)
- [ ] Analytics setup (optional)
- [ ] Performance monitoring
- [ ] Content moderation rules
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Image CDN configured

## Common Pitfalls to Avoid

1. **Don't block UI on API calls** - Always show loading states
2. **Don't trust AI output** - Validate and sanitize all responses
3. **Don't store sensitive data client-side** - Use secure backend
4. **Don't ignore mobile users** - Responsive design from start
5. **Don't overcomplicate D&D rules** - Keep it simple and fun

## Accessibility Requirements

- Keyboard navigation for all interactions
- Screen reader support for story text
- High contrast mode option
- Adjustable text size
- Alternative text for all images
- Dice roll results in text (not just visual)

## Future Enhancement Ideas

1. **Multiplayer Mode**: Party-based adventures
2. **Custom Campaigns**: User-created story modules
3. **Voice Narration**: TTS for scene descriptions
4. **Character Portraits**: AI-generated character art
5. **Achievements**: Unlock new classes/abilities
6. **Mod Support**: Custom rules and content

## Quick Reference

### D&D 5e Ability Scores
- **STR**: Athletics, melee attacks
- **DEX**: Acrobatics, stealth, initiative
- **CON**: HP, concentration, endurance
- **INT**: Investigation, arcana, history
- **WIS**: Perception, insight, survival
- **CHA**: Persuasion, deception, performance

### Difficulty Classes
- **Very Easy**: DC 5
- **Easy**: DC 10
- **Medium**: DC 15
- **Hard**: DC 20
- **Very Hard**: DC 25
- **Nearly Impossible**: DC 30

### Character Archetypes
1. **Fighter**: +2 STR, proficiency in athletics, intimidation
2. **Rogue**: +2 DEX, proficiency in stealth, sleight of hand
3. **Wizard**: +2 INT, proficiency in arcana, investigation
4. **Cleric**: +2 WIS, proficiency in medicine, religion

## Development Commands

```bash
# Initial setup
npm create vite@latest dnd-adventure -- --template react-ts
npm install zustand framer-motion axios tailwindcss

# Development
npm run dev

# Testing
npm run test
npm run test:e2e

# Build
npm run build
npm run preview

# Deployment
npm run deploy
```

Remember: The goal is to create an immersive, fun experience that captures the magic of D&D while being accessible to solo players. Keep the interface intuitive, the story engaging, and the dice rolls exciting!