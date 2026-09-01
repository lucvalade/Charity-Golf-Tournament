import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, MessageSquare, Sparkles, Filter, Gift, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TributesWall: React.FC = () => {
  const { donations, openDonationModal } = useTournament();
  const [filterType, setFilterType] = useState<'all' | 'tributes' | 'recent'>('all');

  const filteredDonations = donations.filter(d => {
    if (filterType === 'tributes') return Boolean(d.message && d.message.trim().length > 0);
    return true;
  });

  return (
    <section id="tributes" className="py-20 bg-[#FBFBFA] border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold uppercase tracking-widest mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Memorial Book & Tribute Wall</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
              Words of Love, Hope & Remembrance
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Heartfelt messages from friends, family, corporate sponsors, and community members honoring the memory of {EVENT_DETAILS.memorialHonoree}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openDonationModal(100)}
              className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Add a Memorial Note</span>
            </button>
          </div>
        </div>

        {/* Tribute Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDonations.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                        {item.donorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.donorName}
                        </h4>
                        <div className="text-[10px] text-slate-400">
                          {new Date(item.donatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>

                  {item.tributeType !== 'general' && item.tributeName && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md mb-3">
                      <Heart className="w-3 h-3 fill-current text-rose-500" />
                      <span>In Memory of {item.tributeName}</span>
                    </div>
                  )}

                  {item.message ? (
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      "{item.message}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Supporting the 2026 Memorial Tournament.
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-700 font-medium">Verified Donation</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
