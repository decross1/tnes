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
}

interface MainMenuScreenProps {
  campaigns: CampaignSlot[];
  onStartNewCampaign: () => void;
  onLoadCampaign: (slotId: string) => void;
  onDeleteCampaign: (slotId: string) => void;
}

export default function MainMenuScreen({
  campaigns,
  onStartNewCampaign,
  onLoadCampaign,
  onDeleteCampaign
}: MainMenuScreenProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const activeCampaigns = campaigns.filter(c => !c.isEmpty);
  const emptySlotsCount = campaigns.filter(c => c.isEmpty).length;

  const handleMenuToggle = (slotId: string) => {
    setActiveMenu(activeMenu === slotId ? null : slotId);
  };

  const handleDeleteCampaign = (slotId: string) => {
    onDeleteCampaign(slotId);
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col relative overflow-hidden" style={{backgroundImage: 'url(/images/background.jpg)'}}>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <header className="relative z-10 w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <div className="text-6xl md:text-8xl font-bold font-fantasy bg-gradient-to-r from-fantasy-gold via-amber-300 to-fantasy-gold bg-clip-text text-transparent drop-shadow-2xl">
              TNES
            </div>
            <div className="text-lg md:text-xl text-fantasy-gold font-medium tracking-[0.3em] mt-2 drop-shadow-lg">
              THE NEVER ENDING STORY
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          
          {/* Active Adventures Section */}
          {activeCampaigns.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6 font-fantasy">
                Continue Your Adventures
              </h2>
              
              <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                {activeCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Adventure Card */}
                    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 border-2 border-fantasy-gold/30 shadow-2xl hover:shadow-fantasy-gold/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
                         onClick={() => onLoadCampaign(campaign.id)}>
                      
                      {/* Character Portrait & Info */}
                      <div className="flex items-center mb-4">
                        {campaign.character?.portraitUrl ? (
                          <img
                            src={campaign.character.portraitUrl}
                            alt={`${campaign.character.name} portrait`}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-fantasy-gold shadow-xl"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-fantasy-gold/50 shadow-xl">
                            <div className="w-12 h-12 bg-fantasy-gold/20 rounded-md flex items-center justify-center">
                              <span className="text-fantasy-gold text-xs font-medium">IMG</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-bold text-white font-fantasy">
                            {campaign.character?.name || 'Unknown Hero'}
                          </h3>
                          <div className="flex items-center text-fantasy-gold text-sm mt-1">
                            <span className="bg-fantasy-gold/20 border border-fantasy-gold/40 px-2 py-1 rounded-full font-semibold text-xs">
                              Level {campaign.character?.level || 1}
                            </span>
                            <span className="ml-2 font-adventure text-xs">{campaign.character?.class?.name || 'Adventurer'}</span>
                          </div>
                        </div>

                        {/* Options Menu */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuToggle(campaign.id);
                          }}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                          <span className="text-xl">⋮</span>
                        </button>
                      </div>

                      {/* Play Button */}
                      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-lg p-3 text-center hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg border border-emerald-400/30">
                        <div className="flex items-center justify-center text-white font-bold text-sm font-adventure">
                          CONTINUE ADVENTURE
                        </div>
                      </div>

                      {/* Last Played */}
                      <div className="mt-2 text-center text-fantasy-gold/70 text-xs font-adventure">
                        Last Adventure: {campaign.campaign?.lastPlayed 
                          ? new Date(campaign.campaign.lastPlayed).toLocaleDateString() 
                          : 'Never'}
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {activeMenu === campaign.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-16 right-4 z-20 bg-slate-800 rounded-lg shadow-xl border border-red-500/30 overflow-hidden"
                      >
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="w-full px-4 py-3 text-left hover:bg-red-500/20 text-red-400 font-medium transition-colors flex items-center"
                        >
                          <span className="mr-2">🗑️</span>
                          End Campaign
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* New Adventure Section */}
          {emptySlotsCount > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: activeCampaigns.length * 0.1 + 0.2 }}
              className="text-center"
            >
              {activeCampaigns.length === 0 && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    ✨ Begin Your Epic Journey ✨
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Create your hero and embark on an endless adventure filled with magic, danger, and glory!
                  </p>
                </div>
              )}
              
              <motion.button
                onClick={onStartNewCampaign}
                className="relative group bg-gradient-to-r from-fantasy-midnight via-purple-700 to-fantasy-midnight text-white font-bold text-xl py-8 px-16 rounded-2xl shadow-2xl hover:shadow-fantasy-gold/25 transition-all duration-300 transform hover:scale-105 border-2 border-fantasy-gold/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center font-fantasy tracking-wide">
                  <span className="mr-4 text-3xl">✨</span>
                  {activeCampaigns.length === 0 ? 'BEGIN YOUR LEGEND' : 'FORGE NEW DESTINY'}
                  <span className="ml-4 text-3xl">⚔️</span>
                </span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-fantasy-gold/20 via-purple-600/20 to-fantasy-gold/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </motion.button>
              
              {activeCampaigns.length > 0 && (
                <p className="text-gray-400 text-sm mt-4">
                  {emptySlotsCount} campaign slot{emptySlotsCount > 1 ? 's' : ''} available
                </p>
              )}
            </motion.section>
          )}

          {/* Campaign Limit Reached */}
          {emptySlotsCount === 0 && activeCampaigns.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="bg-gradient-to-r from-fantasy-crimson/20 to-orange-900/30 rounded-2xl p-8 border-2 border-fantasy-crimson/40 shadow-2xl backdrop-blur-sm">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-fantasy-crimson mb-4 font-fantasy">Adventure Limit Reached</h3>
                <p className="text-red-200 font-adventure text-lg leading-relaxed">
                  You have reached the maximum of 2 active campaigns. End an existing campaign to begin a new adventure.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}