# D&D Adventure Game - AI Narrative Workflow Design

## 🎮 Game Initialization Flow

### Phase 1: Character Creation
```
[Start] → [Character Selection] → [Backstory Options] → [Campaign Setup] → [Game Begin]
```

#### 1.1 Character Selection Screen
```typescript
interface CharacterCreationState {
  selectedClass: 'Fighter' | 'Rogue' | 'Wizard' | 'Cleric';
  characterName: string;
  backstoryMethod: 'ai-generate' | 'custom-write' | 'keywords' | 'skip';
  backstoryContent?: string;
  backstoryKeywords?: string[];
}
```

**UI Flow:**
1. **Class Selection** (4 cards with class descriptions)
2. **Name Your Hero** (text input)
3. **Backstory Options:**
   - 🎲 "Generate My Story" (AI creates full backstory)
   - ✍️ "Write My Own" (textarea for custom backstory)
   - 🏷️ "Build from Keywords" (tag input system)
   - ⚡ "Skip & Start Playing" (use default backstory)

#### 1.2 Backstory Generation
```typescript
// Keywords to Backstory Prompt
const generateBackstoryPrompt = (keywords: string[]) => `
Create a compelling D&D character backstory for a ${character.class}.
Include these elements: ${keywords.join(', ')}
Keep it under 200 words, mysterious, with hooks for adventure.
Write in second person perspective.
`;

// Full AI Generation Prompt
const fullBackstoryPrompt = () => `
Generate a unique backstory for a ${character.class} named ${character.name}.
Include: origin, motivation, a secret, and why they're adventuring.
Keep mysterious, under 200 words, second person.
`;
```

### Phase 2: Campaign Direction Setup

#### 2.1 Campaign Initialization Screen
```typescript
interface CampaignSetup {
  mode: 'full-random' | 'guided';
  themes?: string[];        // ["dragons", "mystery", "dungeon"]
  tone?: 'dark' | 'heroic' | 'comedic' | 'gritty';
  startingLocation?: 'tavern' | 'dungeon' | 'wilderness' | 'city' | 'random';
  campaignKeywords?: string[];  // Player's directional keywords
}
```

**UI Components:**
```jsx
// Campaign Setup Component
<CampaignSetup>
  <h2>Shape Your Adventure</h2>
  
  <ToggleChoice>
    <Option value="full-random">
      🎲 Pure Chaos
      "Let fate decide everything"
    </Option>
    <Option value="guided">
      🧭 Guided Journey
      "I have some ideas..."
    </Option>
  </ToggleChoice>

  {mode === 'guided' && (
    <>
      <KeywordInput
        placeholder="Add story elements (e.g., revenge, artifact, prophecy)"
        suggestions={STORY_SUGGESTIONS}
        max={5}
      />
      
      <ToneSelector>
        <Tone value="dark">Dark Fantasy</Tone>
        <Tone value="heroic">Epic Heroes</Tone>
        <Tone value="comedic">Light-hearted</Tone>
        <Tone value="gritty">Gritty Realism</Tone>
      </ToneSelector>
      
      <StartingLocation>
        <Location value="tavern">🍺 Classic Tavern</Location>
        <Location value="dungeon">⚔️ In Media Res</Location>
        <Location value="wilderness">🌲 Wilderness</Location>
        <Location value="city">🏰 Urban Adventure</Location>
      </StartingLocation>
    </>
  )}
</CampaignSetup>
```

## 🎯 Core Gameplay Loop

### Binary Choice System with Dice Rolls

#### Scene Generation Flow
```
[Current Scene] → [Generate 2 Choices] → [Player Selects] → [Roll Dice] → [Generate Outcome] → [Next Scene]
```

#### AI Context Management
```typescript
interface StoryContext {
  // Persistent Context (never changes)
  campaign: {
    keywords: string[];
    tone: string;
    themes: string[];
  };
  
  // Character Context
  character: {
    name: string;
    class: string;
    level: number;
    backstory: string;
    recentInjuries?: string[];
    recentAchievements?: string[];
  };
  
  // Rolling Context (last 3-5 scenes)
  recentHistory: {
    scene: string;
    choice: string;
    outcome: 'success' | 'failure' | 'critical';
    consequences: string;
  }[];
  
  // Current Context
  currentObjective?: string;
  immediateThreats?: string[];
  availableResources?: string[];
  
  // Story Arc Tracking
  storyArc: {
    act: 'introduction' | 'rising' | 'climax' | 'resolution';
    mainQuestProgress: number; // 0-100
    sideQuests: string[];
  };
}
```

### Choice Generation System

#### Binary Choice Architecture
```typescript
const generateChoicesPrompt = (context: StoryContext) => `
Current scene: ${context.currentScene}
Character: ${context.character.class} named ${context.character.name}
Campaign themes: ${context.campaign.keywords.join(', ')}
Recent events: ${formatRecentHistory(context.recentHistory)}

Generate exactly 2 choices that:
1. Are meaningfully different approaches
2. Each require a D&D ability check (vary the abilities)
3. Respect the campaign tone: ${context.campaign.tone}
4. Incorporate campaign keywords where natural
5. One choice should be more ${context.character.class}-aligned
6. Have different difficulty levels (one easier, one harder but more rewarding)

Format as JSON:
{
  "choice1": {
    "text": "action description",
    "ability": "STR|DEX|CON|INT|WIS|CHA",
    "dc": number (10-20),
    "advantage": boolean,
    "successHint": "what might happen if successful",
    "failureHint": "what might happen if failed"
  },
  "choice2": { ... }
}
`;
```

#### Outcome Generation
```typescript
const generateOutcomePrompt = (
  context: StoryContext, 
  choice: Choice, 
  rollResult: DiceRoll
) => `
Scene: ${context.currentScene}
Action taken: ${choice.text}
Roll result: ${rollResult.result} (${rollResult.total} vs DC ${choice.dc})
Critical: ${rollResult.isCritical}

Campaign keywords to weave in: ${context.campaign.keywords.join(', ')}
Tone: ${context.campaign.tone}

Generate the outcome that:
1. Reflects the ${rollResult.result} appropriately
2. If critical success/failure, make it memorable
3. Introduces next binary choice setup
4. Maintains continuity with: ${context.recentHistory}
5. Subtly incorporates campaign keywords
6. Progresses toward campaign themes

Include:
- Immediate outcome (2-3 sentences)
- Scene transition
- Next scene setup with image description
`;
```

## 🔄 Keyword Integration Strategy

### Three-Tier Keyword System

#### Tier 1: Campaign Keywords (Persistent)
- Set during campaign creation
- Always influence story direction
- Examples: "dragon cult", "lost artifact", "revenge"

#### Tier 2: Dynamic Keywords (Evolving)
- Extracted from player choices and outcomes
- Build up over time
- Examples: "befriended goblin", "cursed sword", "inn debt"

#### Tier 3: Scene Keywords (Temporary)
- Relevant only to current scene/encounter
- Cleared after scene completion
- Examples: "burning building", "angry merchant"

### Keyword Weighting Algorithm
```typescript
class KeywordManager {
  private campaignKeywords: Map<string, number>; // Weight: 1.0
  private dynamicKeywords: Map<string, number>;  // Weight: 0.5-0.8
  private sceneKeywords: Map<string, number>;    // Weight: 0.3

  getWeightedKeywords(): string[] {
    const allKeywords = [
      ...this.campaignKeywords.entries(),
      ...this.dynamicKeywords.entries(),
      ...this.sceneKeywords.entries()
    ];
    
    // Sort by weight and recency
    return allKeywords
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7) // Top 7 keywords
      .map(([keyword]) => keyword);
  }
  
  // Add keyword from player action
  addDynamicKeyword(keyword: string, weight: number = 0.5) {
    this.dynamicKeywords.set(keyword, weight);
    // Decay older keywords
    this.decayKeywords();
  }
  
  private decayKeywords() {
    this.dynamicKeywords.forEach((weight, keyword) => {
      const newWeight = weight * 0.9;
      if (newWeight < 0.1) {
        this.dynamicKeywords.delete(keyword);
      } else {
        this.dynamicKeywords.set(keyword, newWeight);
      }
    });
  }
}
```

## 🎨 UI Components for Keyword System

### Keyword Input Component
```tsx
const KeywordInput: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const suggestions = [
    // Adventure Themes
    'revenge', 'prophecy', 'artifact', 'rescue', 'mystery',
    // Creatures/Enemies  
    'dragons', 'undead', 'cultists', 'bandits', 'fey',
    // Settings
    'dungeon', 'forest', 'city', 'mountains', 'sea',
    // Tone
    'horror', 'comedy', 'romance', 'political', 'war'
  ];
  
  return (
    <div className="keyword-input-container">
      <label>Guide Your Story (Optional)</label>
      <div className="keyword-tags">
        {keywords.map(keyword => (
          <Tag key={keyword} onRemove={() => removeKeyword(keyword)}>
            {keyword}
          </Tag>
        ))}
      </div>
      <input
        placeholder="Add keywords (press Enter)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="suggestions">
        {suggestions
          .filter(s => !keywords.includes(s))
          .map(suggestion => (
            <SuggestionChip 
              key={suggestion}
              onClick={() => addKeyword(suggestion)}
            >
              {suggestion}
            </SuggestionChip>
          ))}
      </div>
    </div>
  );
};
```

### Campaign Tracker Component
```tsx
const CampaignTracker: React.FC = () => {
  const { campaignKeywords, dynamicKeywords, storyArc } = useGameStore();
  
  return (
    <div className="campaign-tracker">
      <h3>Your Story Threads</h3>
      
      <div className="keyword-cloud">
        <h4>Campaign Focus</h4>
        {campaignKeywords.map(kw => (
          <span className="keyword-primary">{kw}</span>
        ))}
      </div>
      
      <div className="keyword-cloud">
        <h4>Emerging Themes</h4>
        {dynamicKeywords.map(kw => (
          <span 
            className="keyword-dynamic"
            style={{ opacity: kw.weight }}
          >
            {kw.text}
          </span>
        ))}
      </div>
      
      <div className="story-progress">
        <h4>Story Arc</h4>
        <ProgressBar value={storyArc.progress} />
        <span>{storyArc.act}</span>
      </div>
    </div>
  );
};
```

## 📊 State Management Updates

### Extended Game Store
```typescript
interface ExtendedGameState extends GameState {
  // Campaign Setup
  campaign: {
    keywords: string[];
    tone: CampaignTone;
    startingLocation: string;
    mode: 'full-random' | 'guided';
  };
  
  // Keyword Management
  keywordManager: {
    campaign: KeywordWeight[];
    dynamic: KeywordWeight[];
    scene: KeywordWeight[];
  };
  
  // Story Tracking
  storyArc: {
    act: StoryAct;
    mainQuest: QuestLine;
    sideQuests: QuestLine[];
    plotPoints: PlotPoint[];
  };
  
  // Character Development
  characterDevelopment: {
    backstory: string;
    traits: string[];
    relationships: NPC[];
    reputation: ReputationTracker;
  };
}

interface KeywordWeight {
  text: string;
  weight: number;
  source: 'player' | 'story' | 'system';
  addedAt: Date;
}
```

## 🚀 Implementation Priority

### Phase 1: Core Systems (Week 1)
1. ✅ Character creation with backstory options
2. ✅ Keyword input system
3. ✅ Campaign setup UI
4. ⬜ Basic AI prompt templates

### Phase 2: AI Integration (Week 2)
1. ⬜ Claude API service layer
2. ⬜ Scene generation with keywords
3. ⬜ Choice generation system
4. ⬜ Outcome generation based on rolls

### Phase 3: Keyword Evolution (Week 3)
1. ⬜ Dynamic keyword extraction
2. ⬜ Keyword weighting system
3. ⬜ Story arc tracking
4. ⬜ Campaign tracker UI

### Phase 4: Polish (Week 4)
1. ⬜ Image generation integration
2. ⬜ Sound effects
3. ⬜ Advanced backstory generation
4. ⬜ Campaign templates

## 🎲 Example Gameplay Flow

```
1. Player creates Fighter named "Marcus"
2. Chooses keywords: ["revenge", "noble house", "cursed sword"]
3. AI generates backstory incorporating keywords
4. Campaign begins in a tavern (player choice)
5. First scene generated with revenge subplot hint
6. Two choices presented:
   - Confront suspicious hooded figure (CHA check, DC 12)
   - Investigate strange noise upstairs (DEX check, DC 15)
7. Player chooses confrontation, rolls 14 (success)
8. Hooded figure reveals connection to noble house
9. Dynamic keyword "mysterious informant" added
10. Next scene incorporates both revenge and informant...
```

This creates a personalized, evolving narrative that respects player agency while maintaining D&D's randomness!