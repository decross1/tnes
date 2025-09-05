# Claude.md - D&D Solo Adventure App Development Guide

## 🚨 DEVELOPMENT PHILOSOPHY: NO MOCK SOLUTIONS
**CRITICAL PRINCIPLE**: Always solve technical issues with real implementations, not mocks or workarounds.
- **Database issues**: Use real databases (SQLite, PostgreSQL, etc.)
- **API issues**: Create proper backend proxies/services 
- **CORS issues**: Implement backend solutions, not browser workarounds
- **Authentication**: Real auth systems, not placeholder tokens
- **Testing**: Use real APIs with proper error handling and fallbacks

**Rationale**: Mocks hide real-world complexity and integration challenges. Build production-ready architecture from day one.

## Project Status: UI SYSTEM COMPLETE ✅ → DUNGEON CAMPAIGN CONSTRUCTOR 🏰
**Current Phase**: Character design and GameScreen complete. Now implementing the 15-step dungeon campaign construction workflow that creates personalized campaigns with interconnected decision trees, enhanced choice architecture, and dynamic AI generation.

## Project Context
You are helping build a dynamic choose-your-own-adventure D&D game where:
- Players create personalized characters with AI-generated backstories and portraits
- Advanced choice architecture with exploration, social, combat, and tactical options
- AI generates dynamic story content using enhanced keyword integration system
- Campaign generation workflow creates 10-15 interconnected decision scenarios
- World persistence engine tracks locations, NPCs, quests, and faction relationships
- Enhanced narrative techniques using SAPI method (Sensory, Atmosphere, Points of Interest, Immediate)
- Dynamic difficulty scaling based on character background and player performance

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

## 🏰 DUNGEON CAMPAIGN CONSTRUCTOR (CURRENT FOCUS)

### Campaign Generation Workflow
```
[Character Complete] → [Dungeon Theme] → [15 Construction Steps] → [AI Campaign Build] → [First Scene] → [10-15 Connected Decisions]
```

### Dungeon Construction System
**Goal**: Create personalized campaigns through 15 meaningful choices that build interconnected adventure experiences:

```typescript
interface DungeonConstructionState {
  currentStep: number;        // 1-15 construction steps
  totalSteps: number;         // Always 15
  isComplete: boolean;
  choices: Record<string, any>; // Player's construction choices
  unlockedSteps: string[];    // Dependency-based step unlocking
  campaignPreview: string;    // AI-generated preview
  estimatedDuration: number;  // Campaign length in hours
  recommendedLevel: number;   // Starting level recommendation
}
```

### The 15 Construction Steps System
Each step builds on previous choices with dependency unlocking:

1. **🏛️ Theme Selection** → Unlocks: Size/Scope, Entry Method
2. **📐 Size & Scope** → Unlocks: Danger Level  
3. **🚪 Entry Method** → Unlocks: Primary Goal
4. **🎯 Primary Objective** → Unlocks: Secondary Goals
5. **📋 Secondary Goals** → Unlocks: Exploration Style
6. **🧭 Exploration Style** → Unlocks: Risk Tolerance, Party Composition
7. **⚖️ Risk vs Reward** → Unlocks: Environmental Hazards
8. **👥 Companions & Allies** → Unlocks: Social Encounters  
9. **🌊 Environmental Challenges** → Unlocks: Creature Types
10. **🐉 Primary Inhabitants** → Unlocks: Magical Elements
11. **✨ Arcane Influences** → Unlocks: Treasure Focus
12. **💎 Treasure Preferences** → Unlocks: Narrative Complexity
13. **💬 Social Dynamics** → Unlocks: Narrative Complexity
14. **📚 Story Depth** → Unlocks: Final Customization  
15. **🎨 Personal Touches** → Completes Construction

### Dungeon Theme Options (8 Core Types)
```typescript
type DungeonTheme = 
  | 'ancient-tomb'     // ⚱️ Burial sites with undead guardians
  | 'wizard-tower'     // 🗼 Vertical magical laboratories
  | 'underground-city' // 🏛️ Vast subterranean metropolis
  | 'natural-cavern'   // 🕳️ Organic cave systems
  | 'abandoned-mine'   // ⛏️ Industrial tunnels and shafts
  | 'cult-temple'      // ⛪ Religious sites with dark rituals
  | 'dragon-lair'      // 🐉 Treasure hoards and ancient power
  | 'prison-fortress'; // 🏰 Fortified containment complex
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

### 🎯 Phase 2: Dungeon Campaign Constructor (CURRENT FOCUS)
- 🟡 **DungeonConstructor Component**: 15-step campaign construction interface
- 🟡 **Theme Selection System**: 8 dungeon themes with visual cards and descriptions
- 🟡 **Dependency Management**: Step unlocking based on previous choices
- 🟡 **Campaign Preview Generator**: AI-generated campaign summaries
- 🟡 **Enhanced Choice Architecture**: Exploration, social, combat, tactical options
- 🟡 **SAPI Narrative Method**: Sensory, Atmosphere, Points of Interest, Immediate
- 🟡 **World Persistence Engine**: Location, NPC, quest, and faction tracking
- 🟡 **Dynamic Difficulty Scaling**: Adjusts based on character background and performance

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

## 🛠️ DUNGEON CAMPAIGN CONSTRUCTOR COMPONENTS

### 1. DungeonConstructor.tsx (PRIMARY COMPONENT)
- 15-step guided campaign construction interface
- Progress indicator showing current step (1-15)
- Dependency-based step unlocking system
- Construction choices persistence and validation
- AI-generated campaign preview updates
- Estimated duration and difficulty calculations

### 2. ThemeSelection.tsx
- Visual grid of 8 dungeon theme cards
- Each card shows icon, name, description, atmosphere
- Difficulty and size recommendations per theme
- Visual preview of common enemies and aesthetics
- Unlocks Size/Scope and Entry Method steps

### 3. DungeonStepCard.tsx
- Reusable component for construction steps
- Supports: single-select, multi-select, slider, text-input
- Conditional rendering based on choice type
- Dependency checking and step unlocking logic
- Choice validation and consequence preview

### 4. ConstructionProgress.tsx
- Visual progress indicator (1-15 steps)
- Completed, current, and locked step states
- Step navigation with dependency enforcement
- Campaign preview sidebar with real-time updates
- Construction summary and choice review

### 5. CampaignPreviewGenerator.tsx
- AI-powered campaign summary generation
- Real-time updates based on construction choices
- Integration with three-tier keyword system
- Estimated duration and difficulty calculations
- First scene preview generation

### 6. Enhanced SceneGenerator.tsx
- SAPI method implementation (Sensory, Atmosphere, Points of Interest, Immediate)
- Enhanced choice architecture with 4 choice types:
  - **Exploration**: Movement, investigation, environmental interaction
  - **Social**: Dialogue, negotiation, relationship building
  - **Combat**: Direct confrontation, tactical positioning
  - **Tactical**: Planning, resource management, strategic thinking
- Dynamic difficulty scaling based on character and choices
- World persistence integration

### 7. WorldPersistenceEngine.tsx
- Location tracking and relationship management
- NPC relationship and reputation systems
- Quest state management (main and side quests)
- Faction influence and politics tracking
- Environmental state persistence

### 8. Enhanced ChoiceArchitecture.tsx
- Four choice types with distinct mechanics:
  - **Exploration**: Perception, Investigation, Athletics checks
  - **Social**: Persuasion, Deception, Insight, Intimidation
  - **Combat**: Initiative, Attack rolls, Damage calculations
  - **Tactical**: Planning phases, Resource allocation, Strategy
- Ability check integration with character stats
- Consequence chains based on choice types

### 9. DifficultyScaler.tsx
- Character background analysis for difficulty adjustment
- Player performance tracking and adaptation
- Challenge rating calculations
- Reward scaling based on difficulty and performance
- Accessibility options for different play styles

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

## 🏰 DUNGEON CAMPAIGN CONSTRUCTION EXAMPLE
```
1. Player completes character creation: Fighter "Marcus Brightblade"
2. Enters Dungeon Constructor - sees 15-step progress indicator
3. **Step 1**: Selects "Ancient Tomb" theme → Unlocks Steps 2 & 3
4. **Step 2**: Chooses "Medium" size scope → Unlocks Step 7 (Risk Tolerance)
5. **Step 3**: Selects "Hidden Entrance" entry method → Unlocks Step 4
6. **Step 4**: Primary goal "Artifact Retrieval" → Unlocks Step 5
7. **Step 5**: Adds secondary goals: ["Survive", "Learn History"] → Unlocks Step 6
8. **Step 6**: Exploration style "Methodical" → Unlocks Steps 7 & 8
9. **Step 7**: Risk tolerance slider: 60% (moderate risk) → Unlocks Step 9
10. **Step 8**: Companions: ["Scholarly Guide", "Torch Bearer"] → Unlocks Step 13
11. **Step 9**: Environmental hazards: ["Cave-ins", "Poison Gas"] → Unlocks Step 10
12. **Step 10**: Creatures: ["Undead", "Constructs", "Traps"] → Unlocks Step 11
13. **Step 11**: Magical elements: "Necromantic Aura" → Unlocks Step 12
14. **Step 12**: Treasure focus: ["Ancient Weapons", "Lost Knowledge"] → Unlocks Step 14
15. **Step 13**: Social complexity: "Moderate" (competing expeditions) → Unlocks Step 14
16. **Step 14**: Story depth: "Complex" (multiple plot threads) → Unlocks Step 15
17. **Step 15**: Personal touches: "Connects to family curse from backstory"
18. **AI Campaign Generation**: Creates interconnected decision tree with 10-15 scenarios
19. **First Scene**: "The Crumbling Entrance" with 4 choice types (Exploration/Social/Combat/Tactical)
20. **World Persistence**: Tracks locations, NPCs, faction relationships, and quest states
```

## 🧠 AI CAMPAIGN GENERATION ARCHITECTURE

### Enhanced Choice Architecture (4 Types)
```typescript
interface EnhancedChoice {
  id: string;
  text: string;
  type: 'exploration' | 'social' | 'combat' | 'tactical';
  abilityCheck?: {
    ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
    dc: number;
    advantage?: boolean;
    disadvantage?: boolean;
  };
  consequences: {
    success: string;
    failure: string;
    criticalSuccess?: string;
    criticalFailure?: string;
  };
  worldStateChanges?: {
    locations?: string[];
    npcs?: string[];
    factions?: string[];
    quests?: string[];
  };
}

// Choice Type Specializations
const CHOICE_MECHANICS = {
  exploration: {
    primaryAbilities: ['dexterity', 'intelligence', 'wisdom'],
    commonChecks: ['Perception', 'Investigation', 'Athletics', 'Survival'],
    consequences: ['New locations', 'Hidden passages', 'Environmental hazards']
  },
  social: {
    primaryAbilities: ['charisma', 'wisdom', 'intelligence'], 
    commonChecks: ['Persuasion', 'Deception', 'Insight', 'Intimidation'],
    consequences: ['NPC relationships', 'Information gained', 'Faction standing']
  },
  combat: {
    primaryAbilities: ['strength', 'dexterity', 'constitution'],
    commonChecks: ['Initiative', 'Attack', 'Damage', 'Saving Throws'],
    consequences: ['HP changes', 'Equipment damage', 'Tactical position']
  },
  tactical: {
    primaryAbilities: ['intelligence', 'wisdom'],
    commonChecks: ['Strategy', 'Planning', 'Resource Management'],
    consequences: ['Future advantages', 'Resource allocation', 'Long-term benefits']
  }
};
```

### SAPI Narrative Method
```typescript
interface SAPIScene {
  sensory: {
    sight: string[];    // Visual details that create atmosphere
    sound: string[];    // Audio elements for immersion
    smell: string[];    // Scents that establish environment
    touch: string[];    // Tactile sensations
    taste?: string[];   // Optional taste elements
  };
  atmosphere: {
    mood: 'tense' | 'mysterious' | 'peaceful' | 'threatening' | 'wonder';
    lighting: 'bright' | 'dim' | 'flickering' | 'dark' | 'magical';
    weather?: string;   // If outdoor/affected location
    temperature: 'cold' | 'cool' | 'warm' | 'hot' | 'variable';
  };
  pointsOfInterest: {
    interactive: string[];  // Elements players can interact with
    narrative: string[];    // Story-relevant details
    hidden: string[];       // Secrets requiring investigation
    tactical: string[];     // Combat-relevant features
  };
  immediate: {
    urgency: 'none' | 'low' | 'medium' | 'high' | 'critical';
    timeConstraints?: string;
    immediateThreat?: string;
    requiredAction?: string;
  };
}

const generateSAPIScene = (constructionChoices: DungeonConstructionResult) => {
  return `
  You are generating a D&D scene using the SAPI method:
  
  SENSORY: Create rich sensory details for ${constructionChoices.theme}
  ATMOSPHERE: Establish ${constructionChoices.dangerLevel} danger mood
  POINTS OF INTEREST: Include interactive elements matching ${constructionChoices.explorationStyle} style
  IMMEDIATE: Set urgency level based on ${constructionChoices.primaryGoal}
  
  Construction Context: ${JSON.stringify(constructionChoices.choices)}
  Character Integration: ${constructionChoices.characterIntegration}
  
  Generate a scene that provides exactly 4 choices:
  - 1 Exploration choice (investigation/movement)
  - 1 Social choice (interaction with NPCs/environment)  
  - 1 Combat choice (direct confrontation)
  - 1 Tactical choice (planning/strategy)
  
  Each choice should have clear ability check requirements and consequences.
  `;
};
```

### World Persistence Engine
```typescript
interface WorldState {
  locations: Map<string, LocationState>;
  npcs: Map<string, NPCState>;
  factions: Map<string, FactionState>;
  quests: Map<string, QuestState>;
  relationships: Map<string, RelationshipState>;
  timeline: TimelineEvent[];
  globalFlags: Map<string, boolean>;
}

interface LocationState {
  id: string;
  name: string;
  description: string;
  visited: boolean;
  accessibility: 'open' | 'locked' | 'hidden' | 'destroyed';
  connectedLocations: string[];
  npcsPresent: string[];
  activeQuests: string[];
  environmentalHazards: string[];
  lastVisited?: Date;
}

interface NPCState {
  id: string;
  name: string;
  role: string;
  currentLocation: string;
  relationshipLevel: number; // -100 to 100
  lastInteraction?: Date;
  importantDialogue: string[];
  questsOffered: string[];
  questsCompleted: string[];
  alive: boolean;
  mood: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'helpful';
}

interface QuestState {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'faction' | 'personal';
  status: 'available' | 'active' | 'completed' | 'failed' | 'locked';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeLimit?: Date;
  questGiver: string;
  involvedNPCs: string[];
  requiredLocations: string[];
}
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

## 🚀 DUNGEON CAMPAIGN CONSTRUCTOR IMPLEMENTATION

### Phase 1: Constructor Foundation (Days 1-2)
1. **DungeonConstructor Component**: Create 15-step construction interface with progress tracking
2. **Type Definitions**: Implement all dungeon construction types from `/types/dungeonCampaign.ts`
3. **ThemeSelection UI**: Build visual grid of 8 dungeon themes with cards and descriptions
4. **Dependency Engine**: Implement step unlocking system based on construction dependencies

### Phase 2: Construction Steps & Choices (Days 3-4)  
1. **DungeonStepCard Component**: Reusable step component supporting all choice types
2. **Choice Validation**: Implement validation logic for each step type
3. **Campaign Preview**: Real-time AI-generated campaign summaries
4. **Construction Progress**: Visual progress indicator with step navigation

### Phase 3: Enhanced Choice Architecture (Days 5-6)
1. **4-Choice Type System**: Implement Exploration, Social, Combat, Tactical choice generation
2. **SAPI Scene Generation**: Integrate Sensory, Atmosphere, Points of Interest, Immediate method
3. **World Persistence Engine**: Build location, NPC, quest, and faction tracking
4. **Dynamic Difficulty Scaling**: Implement character background and performance-based scaling

### Phase 4: Integration & Campaign Generation (Day 7-8)
1. **AI Campaign Builder**: Generate 10-15 interconnected decision scenarios from construction choices
2. **First Scene Generation**: Create opening scene with enhanced 4-choice architecture
3. **GameStore Integration**: Connect constructor with campaign state management
4. **Campaign Navigation**: Integrate constructor completion with game beginning

### Phase 5: Testing & Polish (Day 9-10)
1. **Constructor Flow Testing**: Test all 15 steps with various choice combinations
2. **Campaign Generation Testing**: Validate AI-generated campaigns match construction choices
3. **Choice Architecture Testing**: Ensure 4-choice types work with ability checks and consequences
4. **World Persistence Testing**: Verify state tracking across multiple decisions
5. **Performance Optimization**: Optimize construction UI and AI generation performance

## 🎯 SUCCESS METRICS & PERFORMANCE TARGETS

### Dungeon Constructor Performance
- **Constructor Load Time**: Interface ready in under 500ms
- **Step Transitions**: Smooth navigation between steps (< 100ms)
- **Choice Validation**: Real-time validation feedback (< 50ms)
- **Campaign Preview Updates**: AI-generated preview within 2 seconds
- **Step Dependency Logic**: Instant unlocking/locking based on choices
- **Progress Indicator**: Always accurate and responsive

### AI Campaign Generation Performance  
- **Campaign Construction**: Complete 15-step process in under 30 seconds
- **First Scene Generation**: Opening scenario ready within 10 seconds
- **4-Choice Architecture**: Each scene provides exactly 4 distinct choice types
- **SAPI Implementation**: Rich sensory details in every scene description
- **World Persistence**: State updates processed instantly (< 100ms)
- **Difficulty Scaling**: Dynamic adjustments based on player performance

### User Experience Standards
- **Constructor Intuitive**: No external guidance needed for completion
- **Choice Consequences**: Clear previews of decision outcomes
- **Construction Flow**: Logical progression from simple to complex choices
- **Campaign Preview**: Accurate representation of final adventure
- **Mobile Optimization**: Full constructor functionality on mobile devices
- **Accessibility**: Screen reader compatible with keyboard navigation

This comprehensive dungeon campaign constructor creates truly personalized D&D adventures through meaningful player choices that directly influence the generated campaign, world state, and ongoing narrative experience!