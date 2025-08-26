import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Decision } from '../../types';

interface StoryScrollProps {
  decisions: Decision[];
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'success' | 'failure' | 'critical' | 'no_roll';

export default function StoryScroll({ decisions, isOpen, onClose }: StoryScrollProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredDecisions = useMemo(() => {
    return decisions.filter(decision => {
      if (filter === 'all') return true;
      if (filter === 'no_roll') return !decision.roll;
      return decision.result === filter || (filter === 'critical' && (decision.result === 'critical_success' || decision.result === 'critical_failure'));
    });
  }, [decisions, filter]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

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
      case 'success': return 'text-green-600';
      case 'failure': return 'text-red-600';
      case 'critical_success': return 'text-green-700 font-bold';
      case 'critical_failure': return 'text-red-700 font-bold';
      case 'no_roll': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-fantasy-parchment rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="fantasy-border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight">
              Adventure Chronicle
            </h2>
            <button
              onClick={onClose}
              className="text-fantasy-shadow hover:text-fantasy-midnight text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'success', 'failure', 'critical', 'no_roll'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-fantasy-gold text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterType === 'all' ? 'All' :
                 filterType === 'no_roll' ? 'Story' :
                 filterType === 'critical' ? 'Critical' :
                 filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'all' && ` (${decisions.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Decisions List */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <AnimatePresence>
            {filteredDecisions.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-fantasy-shadow italic"
              >
                No decisions match the current filter.
              </motion.p>
            ) : (
              <div className="space-y-4">
                {filteredDecisions.map((decision, index) => {
                  const isExpanded = expandedItems.has(decision.id);
                  const isLongText = decision.choiceText.length > 100;

                  return (
                    <motion.div
                      key={decision.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg p-4 shadow-md border border-fantasy-bronze"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getResultIcon(decision.result)}
                          </span>
                          <div>
                            <span className="text-sm text-fantasy-shadow">
                              {decision.timestamp.toLocaleString()}
                            </span>
                            <span className={`ml-2 font-medium ${getResultColor(decision.result)}`}>
                              {decision.result.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Choice Text */}
                      <div className="mb-3">
                        <p className="story-text">
                          {isLongText && !isExpanded 
                            ? `${decision.choiceText.substring(0, 100)}...`
                            : decision.choiceText
                          }
                        </p>
                        {isLongText && (
                          <button
                            onClick={() => toggleExpanded(decision.id)}
                            className="text-fantasy-gold text-sm mt-1 hover:underline"
                          >
                            {isExpanded ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>

                      {/* Roll Details */}
                      {decision.roll && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-fantasy-parchment rounded p-3 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {decision.roll.advantage && '⬆️ '}
                              {decision.roll.disadvantage && '⬇️ '}
                              d20: {decision.roll.d20} + {decision.roll.modifier} = {decision.roll.total}
                            </span>
                            {decision.roll.d20 === 20 && <span className="text-green-600">Natural 20! 🎯</span>}
                            {decision.roll.d20 === 1 && <span className="text-red-600">Natural 1! 💥</span>}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="fantasy-border-t p-4 text-center text-sm text-fantasy-shadow">
          {decisions.length} total decisions made in this adventure
        </div>
      </motion.div>
    </motion.div>
  );
}