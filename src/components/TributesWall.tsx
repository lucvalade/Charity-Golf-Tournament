import React, { useState, useMemo } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, MessageSquare, Sparkles, Plus, Quote, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TributesWall: React.FC = () => {
  const { donations, openMemorialNoteModal, openDonationModal } = useTournament();
  const [filterType, setFilterType] = useState<'all' | 'tributes' | 'recent'>('all');

  const filteredDonations = useMemo(() => {
    let list = [...donations];

    if (filterType === 'tributes') {
      list = list.filter(d => Boolean(d.message && d.message.trim().length > 0));
    } else if (filterType === 'recent') {
      list.sort((a, b) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime());
    }

    return list;
  }, [donations, filterType]);

  const messagesCount = useMemo(() => {
    return donations.filter(d => Boolean(d.message && d.message.trim().length > 0)).length;
  }, [donations]);

  return (
    <section id="tributes" className="py-20 bg-[#FBFBFA] border-t border-slate-200 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold uppercase tracking-widest mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Memorial Book &amp; Tribute Wall</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
              Words of Love, Hope &amp; Remembrance
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Heartfelt messages from friends, family, tournament golfers, and community members honoring the enduring memory of {EVENT_DETAILS.memorialHonoree}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openMemorialNoteModal}
              className="px-5 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Add a Memorial Note</span>
            </button>

            <button
              onClick={() => openDonationModal(100)}
              className="px-4 py-3 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Make Memorial Gift</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>View:</span>
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Tributes ({donations.length})
            </button>
            <button
              onClick={() => setFilterType('tributes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'tributes'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Personal Messages ({messagesCount})
            </button>
            <button
              onClick={() => setFilterType('recent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'recent'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Most Recent
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
            <span>Synced in real-time with the Memorial Book</span>
          </div>
        </div>

        {/* Tribute Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Card: Quick Compose Prompt Card */}
          <div
            onClick={openMemorialNoteModal}
            className="rounded-2xl p-6 border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 transition cursor-pointer flex flex-col items-center justify-center text-center group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-110 transition">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-rose-700 transition">
              Leave a Memorial Message
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              Honor Naseem Mohammed with your personal memories or encouragement for Saied &amp; the family.
            </p>
            <span className="mt-3 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
              Click to write a note &rarr;
            </span>
          </div>

          <AnimatePresence>
            {filteredDonations.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {item.donorName ? item.donorName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {item.donorName || 'Anonymous Supporter'}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(item.donatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {item.amount > 0 ? (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ${item.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Memorial Note
                      </span>
                    )}
                  </div>

                  {item.tributeType !== 'general' && item.tributeName && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded-md mb-3">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />
                      <span>In Memory of {item.tributeName}</span>
                    </div>
                  )}

                  {item.message ? (
                    <div className="relative pl-3 border-l-2 border-rose-300/80 my-1">
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Supporting the 2026 Memorial Tournament.
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    {item.amount > 0 ? 'Verified Donation' : 'Memorial Book Tribute'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
