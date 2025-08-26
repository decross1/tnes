import type { Choice } from '../../types';
import SceneCard from './SceneCard';

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceButtons({ choices, onChoiceSelect, disabled }: ChoiceButtonsProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Legends of Runeterra style card grid */}
      <div className={`
        grid gap-6
        ${choices.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 
          choices.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}
      `}>
        {choices.map((choice, index) => (
          <SceneCard
            key={choice.id}
            choice={choice}
            onSelect={onChoiceSelect}
            disabled={disabled || choice.isDisabled}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}