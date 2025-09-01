# Claude.md - D&D Solo Adventure App Development Guide

## 🚨 DEVELOPMENT PHILOSOPHY: NO MOCK SOLUTIONS
**CRITICAL PRINCIPLE**: Always solve technical issues with real implementations, not mocks or workarounds.
- **Database issues**: Use real databases (SQLite, PostgreSQL, etc.)
- **API issues**: Create proper backend proxies/services 
- **CORS issues**: Implement backend solutions, not browser workarounds
- **Authentication**: Real auth systems, not placeholder tokens
- **Testing**: Use real APIs with proper error handling and fallbacks

**Rationale**: Mocks hide real-world complexity and integration challenges. Build production-ready architecture from day one.

## Project Status: CHARACTER DESIGN WORKFLOW COMPLETE ✅ → BACKEND PROXY COMPLETE ✅
**Current Phase**: Character design workflow with AI-powered backstory generation complete, backend proxy server implemented for real Claude API integration

## Project Context
You are helping build a dynamic choose-your-own-adventure D&D game where:
- Players create personalized characters with AI-generated backstories and portraits
- Binary choices at each decision point with D&D dice mechanics
- AI generates dynamic story content based on character and campaign keywords
- Each scene includes AI-generated images
- Three-tier keyword system drives personalized narrative evolution
- Story scroll tracks all decisions, rolls, and character development
- Campaign cards display character portraits and current progress
- In-game character profiles provide complete character sheets

## ✅ COMPLETED FEATURES (v0.2.0)

### Core Infrastructure
- ✅ Vite + React + TypeScript project setup
- ✅ Node.js 22.18.0 LTS compatibility
- ✅ Custom CSS styling system (fantasy theme)
- ✅ Zustand state management with persistence
- ✅ Framer Motion animations
- ✅ Complete TypeScript type definitions
- ✅ Git repository with main branch pushed to GitHub

### Backend Architecture (NEW ✅)
- ✅ **Express Proxy Server**: Production-ready backend on port 3001
- ✅ **CORS Resolution**: Proper cross-origin request handling
- ✅ **API Key Security**: Server-side Claude API key management
- ✅ **Request Logging**: Comprehensive request/response visibility
- ✅ **Error Handling**: User-friendly error messages and fallbacks
- ✅ **Health Monitoring**: `/health` endpoint for status checks

### AI Integration (NEW ✅)
- ✅ **Real Claude API**: Live integration through backend proxy
- ✅ **Dynamic Prompt System**: Context-aware prompt generation
- ✅ **Keyword Integration**: Structured keyword incorporation into prompts
- ✅ **Conditional API Calling**: Smart API usage based on user input method
- ✅ **Backstory Generation**: Multiple generation methods (AI, keywords, custom, skip)
- ✅ **Request Tracing**: Full workflow logging for debugging

### Character Creation System (NEW ✅)
- ✅ **Multi-Step Flow**: Class → Name → Backstory → Portrait
- ✅ **Four Generation Methods**: AI Generate, Keywords, Custom Write, Skip
- ✅ **Keyword Input System**: Tag-based keyword entry with suggestions
- ✅ **Backstory Generator**: Dynamic prompt-based AI content generation
- ✅ **Portrait Generation**: Character portrait with loading states
- ✅ **Campaign Management**: Multi-slot save/load system

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
- ✅ **CharacterCreation**: Complete multi-step character creation flow
- ✅ **BackstoryGenerator**: Multiple generation methods with UI
- ✅ **KeywordInput**: Tag-based input with suggestions
- ✅ **PortraitGenerator**: Character portrait generation with states

### Styling & UX
- ✅ Fantasy-themed UI with parchment backgrounds
- ✅ Medieval color palette (gold, bronze, midnight blue)
- ✅ Cinzel and Merriweather fonts for fantasy aesthetics
- ✅ Responsive design for mobile and desktop
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling

## 🎭 CHARACTER DESIGN WORKFLOW (COMPLETE ✅)

### Game Initialization Flow
```
[Start] → [Character Selection] → [Visual Keywords] → [Backstory Options] → [Campaign Setup] → [Game Begin]
```

### Character Creation Interface
```typescript
interface CharacterCreationState {
  selectedClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  visualKeywords: string[];  // NEW: For portrait generation
  backstoryMethod: 'ai-generate' | 'custom-write' | 'keywords' | 'skip';
  backstoryContent?: string;
  backstoryKeywords?: string[];
  portraitUrl?: string;
  portraitPrompt?: string;
  isGeneratingPortrait?: boolean;
  portraitGenerationError?: string;
}
```

### Visual Keyword Input System
- **Component**: `CharacterKeywordInput.tsx`
- **Categories**: Physical, Equipment, Style, Mood
- **Validation**: Maximum 5-7 keywords, inappropriate keyword prevention
- **Suggestions**: Class-appropriate defaults and category-based recommendations

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

### Campaign Card Display System
```typescript
interface CampaignState {
  campaignId: string;
  characterPortraitUrl: string;
  currentDecisionPrompt: string;
  lastPlayedTimestamp: number;
  campaignProgress: number; // 0-100
}
```

### In-Game Character Profile
```typescript
interface CharacterProfile {
  // Visual & Identity
  portraitUrl: string;
  name: string;
  class: CharacterClass;
  level: number;
  
  // Core Stats
  abilities: AbilityScores;
  
  // Vital Stats  
  currentHP: number;
  maxHP: number;
  armorClass: number;
  proficiencyBonus: number;
  
  // Background Summary
  backstoryBrief: string; // 100 word max
  traits: string[]; // 3-5 personality traits
  
  // Campaign Context
  currentObjective?: string;
  recentAchievements: string[]; // Last 3 notable events
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

// Portrait Generation Prompt (Enhanced)
interface PortraitPromptRequest {
  characterClass: CharacterClass;
  characterName: string;
  userKeywords: string[];
  backstoryContent?: string;
  campaignTone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
}

const PORTRAIT_PROMPT_TEMPLATE = `
Generate a detailed visual description for a fantasy character portrait.
Character: {name}, a {class}
User descriptors: {keywords}
Backstory elements: {backstoryHints}
Campaign tone: {tone}

Create a stable diffusion prompt that:
1. Incorporates all user keywords naturally
2. Maintains D&D fantasy aesthetic
3. Includes class-specific visual elements
4. Suggests appropriate pose and expression
5. Specifies art style: "fantasy art, detailed, painted style"

Output only the prompt, no explanations.
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
  // Character Creation & Design
  characterCreation: {
    isActive: boolean;
    step: 'class' | 'name' | 'visual-keywords' | 'backstory' | 'campaign';
    selectedClass?: CharacterClass;
    characterName?: string;
    visualKeywords: string[];      // NEW: Visual descriptors
    backstoryMethod?: BackstoryMethod;
    backstoryContent?: string;
    portraitUrl?: string;
    portraitPrompt?: string;       // NEW: Generated prompt
    isGeneratingPortrait?: boolean;
    portraitGenerationError?: string;
  };
  
  // Character Design
  characterDesign: {
    visualKeywords: string[];
    portraitUrl?: string;
    portraitPrompt?: string;
    isGeneratingPortrait: boolean;
    portraitGenerationError?: string;
  };
  
  // Profile View
  profileView: {
    isOpen: boolean;
    expandedSections: string[];
  };
  
  // Campaign Setup
  campaign: {
    keywords: string[];
    tone: 'dark' | 'heroic' | 'comedic' | 'gritty';
    startingLocation: string;
    mode: 'full-random' | 'guided';
    isSetup: boolean;
    portraitUrl?: string;          // NEW: For campaign cards
    currentDecisionPrompt?: string; // NEW: For campaign cards
    campaignProgress: number;       // NEW: 0-100 progress
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

### ✅ Phase 1: Character Design Workflow & Backend (COMPLETE)
- ✅ **Express Backend Proxy**: CORS resolution and API key security
- ✅ **Real Claude API Integration**: Live AI calls through backend
- ✅ **CharacterCreation**: Multi-step creation flow complete
- ✅ **BackstoryGenerator**: AI/manual/keyword/skip generation methods
- ✅ **KeywordInput**: Tag-based keyword system with suggestions
- ✅ **Dynamic Prompt System**: Context-aware AI prompt generation
- ✅ **Campaign Management**: Multi-slot save/load system
- ✅ **Portrait Generation**: Character portrait with loading states

### 🎯 Phase 2: AI Story Generation (CURRENT FOCUS)
- 🟡 **Scene Generation**: Dynamic story content with keyword integration
- 🟡 **Binary Choice System**: D&D-style decision points with ability checks
- 🟡 **Dice Roll Integration**: Outcome generation based on roll results
- 🟡 **Dynamic Keyword Extraction**: Auto-extract keywords from player actions
- 🟡 **Story Arc Tracking**: Progression through introduction/rising/climax/resolution
- 🟡 **Campaign Keywords**: Three-tier keyword weighting system

### Phase 3: Game Mechanics Enhancement
- 🟡 **Visual Keyword Integration**: Character portrait keyword system
- 🟡 **Campaign Setup UI**: Tone/location/mode selection interface
- 🟡 **Character Profile Modal**: In-game character sheet overlay
- 🟡 **Campaign Cards**: Visual campaign selection with progress
- 🟡 **Image Generation**: Scene and character portrait AI generation
- 🟡 **Game Screen**: Replace placeholder with full gameplay interface

### Phase 4: Advanced Features
- 🟡 **Character Progression**: Level advancement and ability increases
- 🟡 **Combat Encounters**: Turn-based combat system
- 🟡 **Relationship Tracking**: NPC relationship and reputation systems
- 🟡 **Campaign Templates**: Pre-built adventure scenarios
- 🟡 **Quest System**: Main and side quest tracking

### Phase 5: Polish & Production
- 🟡 **Sound Design**: Music and sound effects
- 🟡 **Advanced AI**: GPT-4 integration for enhanced generation
- 🟡 **Performance**: Optimization for large campaigns
- 🟡 **Deployment**: Production hosting and CI/CD
- 🟡 **Mobile Optimization**: Touch-friendly interface improvements

## 🛠️ NEW COMPONENTS TO BUILD

### 1. CharacterKeywordInput.tsx
- Tag-based input for visual descriptors
- Categories: Physical, Equipment, Style, Mood
- Class-appropriate keyword suggestions
- Maximum 5-7 keywords validation
- Integration with portrait generation

### 2. CampaignCard.tsx
- Campaign continuation card display
- Character portrait integration
- Current decision preview (50 char limit)
- Progress indicator and basic stats
- Continue campaign button

### 3. CharacterProfileModal.tsx
- In-game character sheet overlay
- Two-column layout (desktop), single column (mobile)
- Sections: Portrait & Identity, Ability Scores, Combat Stats, Background
- Collapsible backstory and campaign status
- Modal behavior with backdrop blur

### 4. PortraitDisplay.tsx
- Reusable portrait component
- Multiple size variants (thumbnail, profile, full)
- Loading states with class icon shimmer
- Error state with default class portrait fallback
- 3:4 aspect ratio maintenance

### 5. CharacterProfileButton.tsx
- Bottom navigation trigger for profile modal
- Integration with game UI layout
- Accessible keyboard navigation

### 6. Enhanced CharacterCreation.tsx
- Class selection with visual cards
- Character naming interface  
- Visual keyword input step
- Backstory generation options
- Portrait generation integration

### 7. Enhanced KeywordInput.tsx (Backstory)
- Tag-based input system for backstory keywords
- Suggestion chips with categories
- Keyword validation and weighting
- Separate from visual keywords

### 8. CampaignSetup.tsx  
- Mode selection (random vs guided)
- Tone selector with descriptions
- Starting location picker
- Campaign keyword integration

### 9. BackstoryGenerator.tsx
- Multiple generation methods
- Preview and editing capabilities
- Integration with keyword system

## 📁 CURRENT FILE STRUCTURE (v0.2.0)
```
tnes/                      # 🎯 PROJECT ROOT
├── frontend/              # 📱 FRONTEND (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── character/      # ✅ Character creation & design components
│   │   │   │   ├── CharacterCreation.tsx     # Multi-step creation flow
│   │   │   │   ├── BackstoryGenerator.tsx    # AI/manual backstory generation
│   │   │   │   ├── ClassSelection.tsx        # D&D class selection
│   │   │   │   ├── PortraitGenerator.tsx     # Character portrait display
│   │   │   │   └── CharacterDetailsModal.tsx # Character sheet modal
│   │   │   ├── campaign/       # ✅ Campaign setup & management
│   │   │   │   ├── CampaignManager.tsx       # Multi-slot campaign system
│   │   │   │   └── KeywordInput.tsx          # Tag-based keyword input
│   │   │   ├── game/           # ✅ Core game components
│   │   │   │   ├── SceneDisplay.tsx          # Story scene rendering
│   │   │   │   ├── ChoiceButtons.tsx         # Decision point interactions
│   │   │   │   ├── DiceRoller.tsx            # D&D dice mechanics
│   │   │   │   ├── StoryScroll.tsx           # Adventure history
│   │   │   │   ├── SceneCard.tsx             # Scene display cards
│   │   │   │   └── CampaignTimeline.tsx      # Campaign progression
│   │   │   ├── screens/        # ✅ Main screen components
│   │   │   │   ├── MainMenuScreen.tsx        # Campaign selection
│   │   │   │   └── GameScreen.tsx            # Active gameplay
│   │   │   └── dev/            # ✅ Development tools
│   │   │       ├── APITestRunner.tsx         # API testing interface
│   │   │       └── PromptDebugger.tsx        # AI prompt debugging
│   │   ├── services/           # ✅ API integration layer
│   │   │   ├── claudeApi.ts              # Claude AI integration (proxy)
│   │   │   ├── imageApi.ts               # Image generation services
│   │   │   ├── testCharacterGeneration.ts    # Testing utilities
│   │   │   └── testCharacterGenerationMock.ts # Mock responses
│   │   ├── stores/             # ✅ State management
│   │   │   └── gameStore.ts              # Zustand game state
│   │   ├── types/              # ✅ TypeScript definitions
│   │   │   ├── index.ts                  # Core game types
│   │   │   ├── character.ts              # Character creation types
│   │   │   ├── campaign.ts               # Campaign management types
│   │   │   ├── game.ts                   # Game mechanics types
│   │   │   ├── keywords.ts               # Keyword system types
│   │   │   └── api.ts                    # API response types
│   │   ├── utils/              # ✅ Utility functions
│   │   │   ├── character.ts              # Character creation utilities
│   │   │   └── game.ts                   # Game mechanics utilities
│   │   ├── hooks/              # ✅ Custom React hooks
│   │   ├── assets/             # ✅ Static assets
│   │   ├── App.tsx             # ✅ Main application component
│   │   ├── main.tsx            # ✅ React entry point
│   │   └── index.css           # ✅ Global styles
│   ├── public/                 # ✅ Static assets
│   │   └── images/             # Game assets
│   ├── package.json            # ✅ Frontend dependencies
│   ├── vite.config.ts          # ✅ Vite configuration
│   └── tsconfig.json           # ✅ TypeScript configuration
├── server/                     # 🚀 BACKEND (Express/Node.js) - NEW!
│   ├── server.js               # ✅ Express proxy server
│   ├── package.json            # ✅ Backend dependencies
│   └── README.md               # ✅ Backend documentation
├── scripts/                    # ✅ Development scripts
│   └── setup-node.sh           # Node.js version management
├── .env                        # ✅ Environment variables (API keys)
├── .env.example                # ✅ Environment template
├── start-dev.sh                # ✅ Development startup script - NEW!
├── claude.md                   # ✅ Development guide (this file)
├── DEVELOPMENT_STANDARDS.md    # ✅ Coding standards
├── game-workflow-design.md     # ✅ Game design document
└── README.md                   # ✅ Project documentation
```

## 🎯 EXAMPLE CHARACTER DESIGN FLOW
```
1. Player selects Fighter class
2. Names character "Marcus Brightblade"
3. Adds visual keywords: ["scarred", "heavy armor", "battle-worn", "determined"]
4. Claude generates portrait prompt incorporating keywords and class
5. Stable Diffusion generates character portrait
6. Player chooses "Build from Keywords" backstory option
7. Adds backstory keywords: ["revenge", "noble house", "cursed sword"]
8. AI generates backstory incorporating all keywords
9. Player sets up campaign with "guided" mode
10. Adds campaign keywords: ["political intrigue", "ancient magic"]
11. Selects "dark fantasy" tone and "city" starting location  
12. Campaign card displays with character portrait and stats
13. Game begins with personalized opening scene
14. Character profile accessible via bottom navigation during gameplay
15. All keywords influence future story generation
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

### 🚀 Quick Start (Recommended)
```bash
# Start both frontend and backend servers
./start-dev.sh

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Health:   http://localhost:3001/health
```

### 🔄 Manual Development Setup
```bash
# Option 1: Start both servers manually (2 terminals)

# Terminal 1 - Backend Proxy Server
cd server
source ~/.nvm/nvm.sh && nvm use 22
npm run dev              # Starts backend on http://localhost:3001

# Terminal 2 - Frontend Development Server  
source ~/.nvm/nvm.sh && nvm use 22
npm run dev              # Starts frontend on http://localhost:5173
```

### 🏗️ Individual Commands
```bash
# Node.js Setup (automatic with all commands)
npm run setup-node      # Manually switch to Node.js 22

# Frontend Only
npm run dev              # Start frontend development server (requires backend for full functionality)
npm run build            # Build production frontend
npm run lint             # Run ESLint on frontend code

# Backend Only  
cd server && npm run dev # Start backend proxy server

# Health Checks
curl http://localhost:3001/health  # Test backend health
curl http://localhost:5173         # Test frontend availability
```

### 🔧 Architecture Overview
```
Development Environment:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   Claude API    │
│   :5173         │    │   Proxy :3001   │    │   Anthropic     │
│   React/Vite    │    │   Express/Node  │    │   api.anthropic │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🌐 Git Workflow
```bash
git status               # Check current changes
git add .                # Stage changes
git commit -m "message"  # Commit with message
git push origin main     # Push to main branch
```

### 📋 Environment Setup

## API Keys Configuration
The app requires AI service API keys for full functionality. Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

### Required API Keys
Add the following to your `.env` file:

```bash
# Claude API for backstory and portrait prompt generation
VITE_CLAUDE_API_KEY=your_claude_api_key_here

# Image Generation APIs (choose one or both)
VITE_OPENAI_API_KEY=your_openai_api_key_here        # For DALL-E 3 (fallback)
VITE_STABILITY_API_KEY=your_stability_api_key_here  # For Stable Diffusion (primary)
```

### API Key Sources:
- **Claude API**: Get your key from [Anthropic Console](https://console.anthropic.com/)
- **OpenAI API**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Stability AI**: Get your key from [Stability AI Platform](https://platform.stability.ai/)

### Fallback Behavior:
- Without Claude API: Uses placeholder backstories and portrait prompts
- Without image APIs: Shows default character portraits
- API Fallback Strategy: Stable Diffusion → DALL-E 3 → Default class portraits
- App functions without any API keys but with limited AI features
```

## 🧪 TESTING SCENARIOS

### Character Creation Testing
1. **Class Selection**: Ensure all 4 classes work with proper stats
2. **Visual Keywords**: Test category suggestions and validation (max 5-7 keywords)
3. **Portrait Generation**: Test with different character descriptions and keywords
4. **Backstory Generation**: Test all 4 generation methods
5. **Keyword Integration**: Verify keywords influence story generation  
6. **Campaign Setup**: Ensure all combinations of settings work

### Character Design Testing
1. **Keyword Input**: Validate sanitization, category suggestions, duplicate prevention
2. **Portrait Generation**: Test API timeout handling (30s limit), fallback cascade, caching
3. **Profile Display**: Responsive layout, modal accessibility, data synchronization
4. **Campaign Cards**: Loading performance, portrait display, progress tracking

### AI Integration Testing  
1. **API Resilience**: Handle API failures gracefully with proper fallbacks
2. **Prompt Effectiveness**: Verify generated content quality and keyword incorporation
3. **Portrait Quality**: Ensure visual consistency across sessions
4. **Keyword Weighting**: Test keyword priority system
5. **Context Persistence**: Ensure story continuity across scenes

## 🔐 SECURITY CONSIDERATIONS
1. **Input Sanitization**: Sanitize all keyword inputs to prevent injection
2. **URL Validation**: Validate image URLs before display
3. **Rate Limiting**: Implement rate limiting for API calls
4. **API Key Security**: Store securely, never in code, environment-based access
5. **File Size Validation**: Validate portrait file sizes (max 500KB)
6. **Prompt Injection Prevention**: Validate and sanitize all user inputs to prompts

## 🎨 UI/UX SPECIFICATIONS

### Portrait Display Guidelines
- **Aspect Ratio**: 3:4 portrait orientation maintained across all variants
- **Size Variants**:
  - Thumbnail: 80x106px (campaign cards, quick references)  
  - Profile: 200x267px (character sheets, detailed view)
  - Full: 400x533px (character creation, modal display)
- **Loading State**: Shimmer effect with class icon placeholder
- **Error State**: Default class portrait fallback with retry option

### Character Profile Modal Design
- **Dimensions**: Max 600px width, 90% viewport on mobile
- **Height**: Max 80vh with internal scroll for overflow content
- **Animation**: Slide up from bottom (mobile), fade in with backdrop (desktop) 
- **Close Methods**: X button, backdrop click, ESC key, swipe down (mobile)
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Visual Keyword Categories
- **Physical**: hair color, build, age, scars, distinctive features
- **Equipment**: armor type, weapons, accessories, magical items
- **Style**: mysterious, battle-worn, noble, wild, elegant
- **Magical**: glowing eyes, arcane marks, aura, elemental effects

## 📊 DATA PERSISTENCE & CACHING

### Portrait Storage Strategy
- **Storage Method**: Base64 encoding for MVP, CDN URLs for production
- **Location**: LocalStorage with 30-day retention policy
- **Caching**: Aggressive caching with 15-minute refresh for duplicates
- **Size Management**: 500KB max per portrait, automatic compression
- **Cleanup**: Automatic removal of expired/unused portraits

### Character Profile Storage
```typescript
interface StoredCharacterProfile {
  campaignId: string;
  portraitUrl: string;
  portraitPrompt: string;
  visualKeywords: string[];
  backstoryKeywords: string[];
  profileData: CharacterProfile;
  createdAt: number;
  lastUpdated: number;
  version: string; // For migration compatibility
}
```

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure (Days 1-2)
1. **Portrait Service Architecture**: Create AI service layer with Claude integration
2. **API Integration**: Set up Stable Diffusion and DALL-E fallback systems
3. **Basic Keyword Input**: Create CharacterKeywordInput component foundation
4. **Type Definitions**: Extend existing types for portrait and design features

### Phase 2: UI Components (Days 3-4)  
1. **CharacterKeywordInput**: Complete visual descriptor input with categories
2. **CampaignCard**: Build campaign selection/continuation cards
3. **CharacterProfileModal**: Create in-game character sheet overlay
4. **PortraitDisplay**: Reusable portrait component with size variants

### Phase 3: Integration (Days 5-6)
1. **Character Creation Flow**: Connect portrait generation to creation process
2. **Campaign Management**: Update cards with portraits and progress
3. **Profile Integration**: Connect modal with game state and navigation
4. **Storage & Caching**: Implement portrait caching and data persistence

### Phase 4: Polish & Testing (Day 7)
1. **Loading States**: Add animations and loading indicators
2. **Error Handling**: Implement comprehensive error recovery
3. **Performance Optimization**: Optimize image loading and caching
4. **Accessibility**: Complete keyboard navigation and screen reader support
5. **Testing Suite**: Comprehensive testing of all new features

## 💡 SUCCESS METRICS & PERFORMANCE TARGETS
- **Portrait Generation**: Complete within 30 seconds (including prompt generation)
- **Keyword Input**: Intuitive operation without instructional guidance
- **Profile Modal**: Opens in under 200ms with smooth animations
- **Campaign Cards**: Load instantly with cached portraits
- **Error Recovery**: Zero failed portrait generations result in broken UI
- **Visual Consistency**: Character portraits maintain consistency across sessions
- **Mobile Performance**: All interactions remain smooth on mobile devices

This comprehensive character design workflow system creates truly personalized D&D adventures with AI-generated portraits that reflect player choices while maintaining visual consistency and performance across all devices!