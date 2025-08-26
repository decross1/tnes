# Claude.md - D&D Solo Adventure App Development Guide

## Project Status: SCAFFOLDING COMPLETE ✅ → CHARACTER CREATION PHASE 🎭
**Current Phase**: Basic app structure completed, now implementing character creation with AI integration

## Project Context
You are helping build a dynamic choose-your-own-adventure D&D game where:
- Players create personalized characters with AI-generated backstories
- Binary choices at each decision point with D&D dice mechanics
- AI generates dynamic story content based on character and campaign keywords
- Each scene includes AI-generated images
- Three-tier keyword system drives personalized narrative evolution
- Story scroll tracks all decisions, rolls, and character development

## ✅ COMPLETED FEATURES (v0.1.0)

### Core Infrastructure
- ✅ Vite + React + TypeScript project setup
- ✅ Node.js 22.18.0 LTS compatibility
- ✅ Custom CSS styling system (fantasy theme)
- ✅ Zustand state management with persistence
- ✅ Framer Motion animations
- ✅ Complete TypeScript type definitions
- ✅ Git repository with main branch pushed to GitHub

### Game Mechanics
- ✅ D&D 5e ability score system
- ✅ Proper modifier calculations: `Math.floor((ability - 10) / 2)`
- ✅ Proficiency bonus: `2 + Math.floor((level - 1) / 4)`
- ✅ Advantage/Disadvantage dice rolling
- ✅ Critical success/failure detection (Natural 20/1)
- ✅ Four character classes: Fighter, Rogue, Wizard, Cleric

### UI Components (Existing)
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

## 🎭 CHARACTER CREATION SYSTEM (IN DEVELOPMENT)

### Game Initialization Flow
```
[Start] → [Character Selection] → [Backstory Options] → [Campaign Setup] → [Game Begin]
```

### Character Creation Interface
```typescript
interface CharacterCreationState {
  selectedClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  backstoryMethod: 'ai-generate' | 'custom-write' | 'keywords' | 'skip';
  backstoryContent?: string;
  backstoryKeywords?: string[];
  portraitUrl?: string;
  isGeneratingPortrait?: boolean;
}
```

### Backstory Generation Options
1. **🎲 "Generate My Story"** - AI creates full backstory based on class and name
2. **✍️ "Write My Own"** - Textarea for custom backstory input  
3. **🏷️ "Build from Keywords"** - Tag input system with suggestions
4. **⚡ "Skip & Start Playing"** - Use default class-based backstory

### Campaign Setup Interface
```typescript
interface CampaignSetup {
  mode: 'full-random' | 'guided';
  themes?: string[];        // ["dragons", "mystery", "dungeon"]
  tone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
  startingLocation?: 'tavern' | 'dungeon' | 'wilderness' | 'city' | 'random';
  campaignKeywords?: string[];  // Player's directional keywords
}
```

## 🧠 AI INTEGRATION ARCHITECTURE

### Claude API Integration
```typescript
// Backstory Generation
const generateBackstoryPrompt = (class: string, name: string, keywords?: string[]) => `
Create a compelling D&D character backstory for a ${class} named ${name}.
${keywords ? `Include these elements: ${keywords.join(', ')}` : ''}
Include: origin, motivation, a secret, and why they're adventuring.
Keep it under 200 words, mysterious, with hooks for adventure.
Write in second person perspective.
`;

// Portrait Generation Prompt
const generatePortraitPrompt = (class: string, backstory: string) => `
Create a detailed character portrait description for DALL-E:
Character: ${class}
Backstory context: ${backstory.substring(0, 200)}...

Style: Fantasy digital art, D&D character portrait, detailed face and upper body,
epic fantasy setting, dramatic lighting, high quality, --ar 1:1
`;
```

### Three-Tier Keyword System
```typescript
class KeywordManager {
  // Tier 1: Campaign Keywords (Weight: 1.0) - Set during campaign creation
  private campaignKeywords: Map<string, number>;
  
  // Tier 2: Dynamic Keywords (Weight: 0.5-0.8) - Extracted from player choices
  private dynamicKeywords: Map<string, number>;
  
  // Tier 3: Scene Keywords (Weight: 0.3) - Temporary scene-specific
  private sceneKeywords: Map<string, number>;

  getWeightedKeywords(): string[] {
    // Returns top 7 keywords sorted by weight and recency
  }
}
```

## 📊 EXTENDED STATE MANAGEMENT

### Updated Game Store Structure
```typescript
interface ExtendedGameState extends GameState {
  // Character Creation
  characterCreation: {
    isActive: boolean;
    step: 'class' | 'name' | 'backstory' | 'campaign';
    selectedClass?: CharacterClass;
    characterName?: string;
    backstoryMethod?: BackstoryMethod;
    backstoryContent?: string;
    portraitUrl?: string;
  };
  
  // Campaign Setup
  campaign: {
    keywords: string[];
    tone: 'dark' | 'heroic' | 'comedic' | 'gritty';
    startingLocation: string;
    mode: 'full-random' | 'guided';
    isSetup: boolean;
  };
  
  // Keyword Management
  keywordManager: {
    campaign: KeywordWeight[];
    dynamic: KeywordWeight[];
    scene: KeywordWeight[];
  };
  
  // Story Tracking
  storyArc: {
    act: 'introduction' | 'rising' | 'climax' | 'resolution';
    mainQuest?: QuestLine;
    sideQuests: QuestLine[];
    plotPoints: PlotPoint[];
    progress: number; // 0-100
  };
}
```

## Core Technologies (CURRENT)
- ✅ **Frontend**: React 19.1.1 with TypeScript 5.9.2
- ✅ **State Management**: Zustand 5.0.8 with persistence
- ✅ **Styling**: Custom CSS with fantasy theme
- 🟡 **AI Services**: Claude API for story/backstory, DALL-E 3/Stable Diffusion for portraits
- ✅ **Animations**: Framer Motion 12.23.12
- ✅ **Build Tool**: Vite 7.1.3

## 🚀 DEVELOPMENT ROADMAP

### Phase 1: Character Creation (CURRENT SPRINT)
- 🟡 **CharacterCreation** component with class selection cards
- 🟡 **BackstoryGenerator** with AI integration and keyword support
- 🟡 **KeywordInput** component with suggestions and tagging
- 🟡 **CampaignSetup** component with tone/location selection
- 🟡 **PortraitGenerator** with DALL-E/Stable Diffusion integration
- 🟡 **Claude API service layer** for backstory generation
- 🟡 **Extended GameStore** with character creation state

### Phase 2: AI Story Generation (NEXT)
- 🟡 Scene generation with keyword integration
- 🟡 Binary choice generation system
- 🟡 Outcome generation based on dice rolls
- 🟡 Dynamic keyword extraction from player actions
- 🟡 Story arc progression tracking

### Phase 3: Advanced Features
- 🟡 Character progression and leveling
- 🟡 Combat encounter system
- 🟡 Advanced relationship tracking
- 🟡 Campaign templates and presets

### Phase 4: Polish & Deployment
- 🟡 Sound effects and audio
- 🟡 Advanced image generation
- 🟡 Performance optimization
- 🟡 Deployment and hosting

## 🛠️ NEW COMPONENTS TO BUILD

### 1. CharacterCreation.tsx
- Class selection with visual cards
- Character naming interface
- Backstory generation options
- Portrait generation integration

### 2. KeywordInput.tsx
- Tag-based input system
- Suggestion chips with categories
- Keyword validation and weighting

### 3. CampaignSetup.tsx  
- Mode selection (random vs guided)
- Tone selector with descriptions
- Starting location picker
- Keyword integration for campaign direction

### 4. BackstoryGenerator.tsx
- Multiple generation methods
- Preview and editing capabilities
- Integration with keyword system

## 📁 UPDATED FILE STRUCTURE
```
src/
├── components/
│   ├── character/          # 🟡 NEW: Character creation components
│   │   ├── CharacterCreation.tsx
│   │   ├── ClassSelection.tsx
│   │   ├── BackstoryGenerator.tsx
│   │   └── PortraitGenerator.tsx
│   ├── campaign/           # 🟡 NEW: Campaign setup components
│   │   ├── CampaignSetup.tsx
│   │   ├── KeywordInput.tsx
│   │   └── ToneSelector.tsx
│   ├── game/              # ✅ EXISTING: Game components
│   │   ├── SceneDisplay.tsx
│   │   ├── ChoiceButtons.tsx
│   │   ├── DiceRoller.tsx
│   │   └── StoryScroll.tsx
├── services/              # 🟡 NEW: API integration
│   ├── claudeApi.ts
│   ├── imageApi.ts
│   └── fallbackContent.ts
├── stores/                # ✅ EXISTING + Extensions
│   ├── gameStore.ts       # Extended with character creation
│   └── keywordManager.ts  # 🟡 NEW: Keyword management
├── types/                 # ✅ EXISTING + Extensions
│   ├── character.ts       # Extended with creation types
│   ├── campaign.ts        # 🟡 NEW: Campaign types
│   └── keywords.ts        # 🟡 NEW: Keyword system types
├── utils/                 # ✅ EXISTING + Extensions
│   ├── character.ts       # Extended with creation utilities
│   ├── prompts.ts         # 🟡 NEW: AI prompt templates
│   └── keywordUtils.ts    # 🟡 NEW: Keyword processing
```

## 🎯 EXAMPLE CHARACTER CREATION FLOW
```
1. Player selects Fighter class
2. Names character "Marcus Brightblade"
3. Chooses "Build from Keywords" backstory option
4. Adds keywords: ["revenge", "noble house", "cursed sword"]
5. AI generates backstory incorporating all keywords
6. AI generates character portrait based on backstory
7. Player sets up campaign with "guided" mode
8. Adds campaign keywords: ["political intrigue", "ancient magic"]
9. Selects "dark fantasy" tone and "city" starting location  
10. Game begins with personalized opening scene
11. All keywords influence future story generation
```

## 💡 AI PROMPT ARCHITECTURE

### Backstory Generation Templates
```typescript
const BACKSTORY_PROMPTS = {
  full: (character: Character) => `...`,
  keywords: (character: Character, keywords: string[]) => `...`,
  class_based: (character: Character) => `...`,
};

const PORTRAIT_PROMPTS = {
  detailed: (character: Character, backstory: string) => `...`,
  simple: (character: Character) => `...`,
};
```

## 🔧 Development Commands
```bash
# Development (WORKING)
npm run dev              # Starts on http://localhost:5173/

# Build (WORKING) 
npm run build           # TypeScript compilation + Vite build

# Git workflow
git status              # Check current changes
git add .               # Stage changes
git commit -m "msg"     # Commit with message
git push origin feature/ai-integration  # Push to feature branch

# Environment Setup

## API Keys Configuration
The app requires AI service API keys for full functionality. Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

### Required API Keys
Add the following to your `.env` file:

```bash
# Claude API for backstory and story generation
VITE_CLAUDE_API_KEY=your_claude_api_key_here

# Image Generation APIs (choose one or both)
VITE_OPENAI_API_KEY=your_openai_api_key_here        # For DALL-E 3
VITE_STABILITY_API_KEY=your_stability_api_key_here  # For Stable Diffusion
```

### API Key Sources:
- **Claude API**: Get your key from [Anthropic Console](https://console.anthropic.com/)
- **OpenAI API**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Stability AI**: Get your key from [Stability AI Platform](https://platform.stability.ai/)

### Fallback Behavior:
- Without Claude API: Uses placeholder backstories
- Without image APIs: Shows default character portraits
- App functions without any API keys but with limited AI features
```

## 🧪 TESTING SCENARIOS

### Character Creation Testing
1. **Class Selection**: Ensure all 4 classes work with proper stats
2. **Backstory Generation**: Test all 4 generation methods
3. **Keyword Integration**: Verify keywords influence story generation
4. **Portrait Generation**: Test with different character descriptions
5. **Campaign Setup**: Ensure all combinations of settings work

### AI Integration Testing  
1. **API Resilience**: Handle API failures gracefully
2. **Prompt Effectiveness**: Verify generated content quality
3. **Keyword Weighting**: Test keyword priority system
4. **Context Persistence**: Ensure story continuity across scenes

This comprehensive system creates truly personalized D&D adventures that evolve based on player choices and maintain narrative continuity through the sophisticated keyword system!