import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';

interface CampaignSlot {
  id: string;
  character?: Character;
  campaign?: {
    id: string;
    name: string;
    createdAt: Date;
    lastPlayed: Date;
  };
  isEmpty: boolean;
  lastPlayed?: Date;
}

interface CampaignManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewCampaign: () => void;
  onLoadCampaign: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  campaigns: CampaignSlot[];
}

export default function CampaignManager({ 
  isOpen, 
  onClose, 
  onStartNewCampaign, 
  onLoadCampaign, 
  onDeleteCampaign,
  campaigns 
}: CampaignManagerProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirmingDelete === campaignId) {
      onDeleteCampaign(campaignId);
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(campaignId);
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-fantasy font-bold text-fantasy-midnight">
              Campaign Manager
            </h2>
            <button
              onClick={onClose}
              className="text-fantasy-shadow hover:text-fantasy-midnight text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-fantasy-shadow mt-2">
            Manage your adventures (Maximum 2 active campaigns)
          </p>
        </div>

        {/* Campaign Slots */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border-2 border-fantasy-bronze p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-fantasy font-bold text-fantasy-midnight text-lg">
                    Campaign Slot {index + 1}
                  </h3>
                  {!slot.isEmpty && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onLoadCampaign(slot.id)}
                        className="px-3 py-1 bg-fantasy-gold text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(slot.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          confirmingDelete === slot.id
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {confirmingDelete === slot.id ? 'Confirm Delete' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>

                {slot.isEmpty ? (
                  <div className="text-center py-8">
                    <div className="text-4xl text-fantasy-shadow mb-4">⚔️</div>
                    <p className="text-fantasy-shadow mb-4">Empty campaign slot</p>
                    <button
                      onClick={onStartNewCampaign}
                      className="choice-button px-4 py-2"
                    >
                      Start New Adventure
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Character Portrait */}
                    <div className="flex items-center gap-4 mb-4">
                      {slot.character?.portraitUrl ? (
                        <img
                          src={slot.character.portraitUrl}
                          alt={`${slot.character.name} portrait`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-fantasy-gold"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-fantasy-bronze flex items-center justify-center border-2 border-fantasy-gold">
                          <span className="text-white text-xl font-bold">
                            {slot.character?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-fantasy-midnight">
                          {slot.character?.name || 'Unknown Hero'}
                        </h4>
                        <p className="text-fantasy-shadow text-sm">
                          Level {slot.character?.level || 1} {slot.character?.class?.name || 'Adventurer'}
                        </p>
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="bg-fantasy-parchment p-3 rounded border border-fantasy-bronze">
                      <p className="text-sm text-fantasy-shadow mb-2">
                        <strong>Campaign:</strong> {slot.campaign?.name || 'Unnamed Adventure'}
                      </p>
                      <p className="text-sm text-fantasy-shadow">
                        <strong>Last Played:</strong> {slot.lastPlayed?.toLocaleDateString() || 'Never'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}