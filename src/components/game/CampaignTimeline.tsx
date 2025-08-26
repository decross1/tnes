import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Decision, Character } from '../../types';

interface CampaignTimelineProps {
  decisions: Decision[];
  character: Character;
}

interface TimelineCardProps {
  decision: Decision;
  index: number;
  onClick: () => void;
  isExpanded: boolean;
}

function TimelineCard({ decision, index, onClick, isExpanded }: TimelineCardProps) {
  const getResultIcon = (result: Decision['result']) => {
    switch (result) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'critical_success': return '🎯';
      case 'critical_failure': return '💥';
      case 'no_roll': return '📖';
      default: return '❓';
    }
  };

  const getResultColor = (result: Decision['result']) => {
    switch (result) {
      case 'success': return 'border-emerald-400/50 bg-emerald-900/20';
      case 'failure': return 'border-red-400/50 bg-red-900/20';
      case 'critical_success': return 'border-fantasy-gold/50 bg-fantasy-gold/10';
      case 'critical_failure': return 'border-fantasy-crimson/50 bg-fantasy-crimson/20';
      case 'no_roll': return 'border-slate-400/50 bg-slate-800/20';
      default: return 'border-slate-300/50 bg-slate-700/20';
    }
  };

  const getResultText = (result: Decision['result']) => {
    switch (result) {
      case 'success': return 'Success';
      case 'failure': return 'Failed';
      case 'critical_success': return 'Critical!';
      case 'critical_failure': return 'Fumble!';
      case 'no_roll': return 'Story';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getResultColor(decision.result)} border-l-4 rounded-r-lg mb-3`}
      onClick={onClick}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getResultIcon(decision.result)}</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {getResultText(decision.result)}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {decision.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Preview Text */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {decision.choiceText.length > 80 
            ? `${decision.choiceText.substring(0, 80)}...` 
            : decision.choiceText
          }
        </p>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200"
            >
              {/* Full choice text if truncated */}
              {decision.choiceText.length > 80 && (
                <p className="text-sm text-gray-700 mb-3">
                  {decision.choiceText}
                </p>
              )}

              {/* Roll details */}
              {decision.roll && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Roll: d20 + {decision.roll.modifier} = {decision.roll.total}
                    </span>
                    <div className="flex items-center space-x-2">
                      {decision.roll.advantage && <span className="text-green-600 text-xs">⬆️ ADV</span>}
                      {decision.roll.disadvantage && <span className="text-red-600 text-xs">⬇️ DIS</span>}
                      {decision.roll.d20 === 20 && <span className="text-yellow-600 text-xs">🎯 NAT 20</span>}
                      {decision.roll.d20 === 1 && <span className="text-red-600 text-xs">💥 NAT 1</span>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CampaignTimeline({ decisions, character }: CampaignTimelineProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (decisionId: string) => {
    setExpandedCard(expandedCard === decisionId ? null : decisionId);
  };

  // Reverse decisions to show most recent first
  const recentDecisions = [...decisions].reverse();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm border-b border-fantasy-gold/30 p-4">
        <h3 className="font-fantasy font-bold text-lg text-fantasy-gold mb-1">
          Story Timeline
        </h3>
        <p className="text-sm text-fantasy-bronze">
          {decisions.length} decision{decisions.length !== 1 ? 's' : ''} made
        </p>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {recentDecisions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 opacity-50">🗡️</div>
            <p className="text-fantasy-shadow text-sm">
              Your adventure begins here...
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {recentDecisions.map((decision, index) => (
              <TimelineCard
                key={decision.id}
                decision={decision}
                index={index}
                onClick={() => handleCardClick(decision.id)}
                isExpanded={expandedCard === decision.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats - Mobile only */}
      <div className="lg:hidden flex-shrink-0 bg-fantasy-midnight p-3 border-t border-fantasy-bronze">
        <div className="flex justify-between text-xs text-fantasy-bronze">
          <span>XP: {character.xp}</span>
          <span>Level {character.level}</span>
          <span>AC: {character.armorClass}</span>
        </div>
      </div>
    </div>
  );
}