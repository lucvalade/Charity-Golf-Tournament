import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, MessageSquare, Sparkles, Plus, Quote, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ComposePromptCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth < 768) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsInView(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`rounded-2xl p-6 border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[220px] ${
        isInView
          ? 'bg-[#1e4d2b] text-white border-emerald-500 shadow-lg'
          : 'border-rose-300 hover:border-emerald-500 bg-rose-50/40 hover:bg-[#1e4d2b] hover:text-white shadow-xs hover:shadow-lg'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isInView
            ? 'bg-white/15 text-amber-300 border border-white/20 scale-110'
            : 'bg-white text-rose-600 shadow-sm border border-rose-200 group-hover:bg-white/15 group-hover:text-amber-300 group-hover:border-white/20 group-hover:scale-110'
        }`}
      >
        <Plus className="w-6 h-6" />
      </div>
      <h3
        className={`text-base font-bold mt-3 font-serif-heading transition-colors duration-300 ${
          isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
        }`}
      >
        Leave a Memorial Message
      </h3>
      <p
        className={`text-xs mt-1 max-w-xs leading-relaxed transition-colors duration-300 ${
          isInView ? 'text-emerald-100' : 'text-slate-600 group-hover:text-emerald-100'
        }`}
      >
        Honor Naseem Mohammed with your personal memories or encouragement for Saied &amp; the family.
      </p>
      <span
        className={`mt-3 px-3.5 py-1 rounded-full text-[11px] font-bold transition-colors duration-300 ${
          isInView
            ? 'bg-amber-400 text-slate-950 font-extrabold'
            : 'bg-rose-100 text-rose-800 group-hover:bg-amber-400 group-hover:text-slate-950'
        }`}
      >
        Click to write a note &rarr;
      </span>
    </div>
  );
};

interface TributeCardProps {
  item: any;
  idx: number;
}

const TributeCard: React.FC<TributeCardProps> = ({ item, idx }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth < 768) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsInView(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
    >
      <div
        ref={cardRef}
        className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer ${
          isInView
            ? 'bg-[#1e4d2b] text-white border-emerald-600 shadow-xl transform -translate-y-0.5'
            : 'bg-white border-slate-200 hover:bg-[#1e4d2b] hover:text-white hover:border-emerald-600 hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-colors duration-300 ${
                  isInView
                    ? 'bg-white/15 border border-white/20 text-[#D4AF37]'
                    : 'bg-rose-100/80 border border-rose-200 text-rose-700 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-[#D4AF37]'
                }`}
              >
                {item.donorName ? item.donorName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h4
                  className={`text-sm font-bold leading-tight font-serif-heading transition-colors duration-300 ${
                    isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
                  }`}
                >
                  {item.donorName || 'Anonymous Supporter'}
                </h4>
                <div
                  className={`text-[11px] mt-0.5 transition-colors duration-300 ${
                    isInView ? 'text-emerald-200' : 'text-slate-400 group-hover:text-emerald-200'
                  }`}
                >
                  {new Date(item.donatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {item.amount > 0 ? (
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-colors duration-300 ${
                  isInView
                    ? 'bg-white/15 text-amber-300 border-white/20'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:bg-white/15 group-hover:text-amber-300 group-hover:border-white/20'
                }`}
              >
                ${item.amount.toLocaleString()}
              </span>
            ) : (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors duration-300 ${
                  isInView
                    ? 'bg-white/15 text-amber-300 border-white/20'
                    : 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-white/15 group-hover:text-amber-300 group-hover:border-white/20'
                }`}
              >
                Memorial Note
              </span>
            )}
          </div>

          {item.tributeType !== 'general' && item.tributeName && (
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md mb-3 border transition-colors duration-300 ${
                isInView
                  ? 'bg-white/10 text-emerald-100 border-white/20'
                  : 'bg-rose-50/80 text-rose-800 border-rose-200/60 group-hover:bg-white/10 group-hover:text-emerald-100 group-hover:border-white/20'
              }`}
            >
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />
              <span>In Memory of {item.tributeName}</span>
            </div>
          )}

          {item.message ? (
            <div
              className={`relative pl-3 border-l-2 my-1 transition-colors duration-300 ${
                isInView ? 'border-amber-400' : 'border-rose-300/80 group-hover:border-amber-400'
              }`}
            >
              <p
                className={`text-xs sm:text-sm italic leading-relaxed transition-colors duration-300 ${
                  isInView ? 'text-white' : 'text-slate-700 group-hover:text-white'
                }`}
              >
                &ldquo;{item.message}&rdquo;
              </p>
            </div>
          ) : (
            <p
              className={`text-xs italic transition-colors duration-300 ${
                isInView ? 'text-emerald-200' : 'text-slate-400 group-hover:text-emerald-200'
              }`}
            >
              Supporting the 2026 Memorial Tournament.
            </p>
          )}
        </div>

        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] transition-colors duration-300 ${
            isInView
              ? 'border-emerald-700/60 text-emerald-200'
              : 'border-slate-100 text-slate-400 group-hover:border-emerald-700/60 group-hover:text-emerald-200'
          }`}
        >
          <span
            className={`font-medium flex items-center gap-1 transition-colors duration-300 ${
              isInView ? 'text-emerald-200' : 'text-emerald-700 group-hover:text-emerald-200'
            }`}
          >
            {item.amount > 0 ? 'Verified Donation' : 'Memorial Book Tribute'}
          </span>
          <Sparkles
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-amber-500 group-hover:text-amber-300'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

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
          <ComposePromptCard onClick={openMemorialNoteModal} />

          <AnimatePresence>
            {filteredDonations.map((item, idx) => (
              <TributeCard key={item.id} item={item} idx={idx} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
