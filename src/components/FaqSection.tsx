import React, { useState, useEffect, useRef } from 'react';
import { FAQ_DATA, FaqItem } from '../data/initialData';
import { HelpCircle, ChevronDown, CloudRain, Shirt, Sparkles, Trophy, Flag, ShieldCheck } from 'lucide-react';

interface FaqItemCardProps {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  getCategoryIcon: (cat: string, isInView: boolean) => React.ReactNode;
}

const FaqItemCard: React.FC<FaqItemCardProps> = ({ faq, isOpen, onToggle, getCategoryIcon }) => {
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
      className={`rounded-2xl border overflow-hidden transition-all duration-300 group cursor-pointer ${
        isInView
          ? 'bg-[#1e4d2b] text-white border-emerald-600 shadow-md'
          : 'bg-white border-slate-200 hover:bg-[#1e4d2b] hover:text-white hover:border-emerald-600 shadow-xs hover:shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${
              isInView
                ? 'bg-white/15 border-white/20 text-[#D4AF37]'
                : 'bg-slate-50 border-slate-200 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-[#D4AF37]'
            }`}
          >
            {getCategoryIcon(faq.category, isInView)}
          </div>
          <span
            className={`font-bold text-sm sm:text-base font-serif-heading transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
            }`}
          >
            {faq.question}
          </span>
        </div>
        <div
          className={`p-1.5 rounded-lg transition transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          } ${
            isInView
              ? 'bg-white/15 text-white'
              : 'bg-slate-50 text-slate-500 group-hover:bg-white/15 group-hover:text-white'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div
          className={`px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t pl-16 transition-colors duration-300 ${
            isInView
              ? 'border-emerald-700/60 text-emerald-100'
              : 'border-slate-100 text-slate-600 group-hover:border-emerald-700/60 group-hover:text-emerald-100'
          }`}
        >
          <p>
            {faq.answer.includes('leaderboard') ? (
              <>
                {faq.answer.split('leaderboard')[0]}
                <a
                  href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline font-semibold transition-colors duration-300 ${
                    isInView
                      ? 'text-amber-300 hover:text-white'
                      : 'text-emerald-700 hover:text-emerald-900 group-hover:text-amber-300 group-hover:hover:text-white'
                  }`}
                >
                  leaderboard
                </a>
                {faq.answer.split('leaderboard')[1]}
              </>
            ) : (
              faq.answer
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'dress' | 'rentals' | 'format'>('all');

  const filteredFaqs = activeCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const getCategoryIcon = (cat: string, isInView: boolean) => {
    switch (cat) {
      case 'dress':
        return (
          <Shirt
            className={`w-4 h-4 transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-emerald-600 group-hover:text-amber-300'
            }`}
          />
        );
      case 'rentals':
        return (
          <Sparkles
            className={`w-4 h-4 transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-[#D4AF37] group-hover:text-amber-300'
            }`}
          />
        );
      case 'format':
        return (
          <Flag
            className={`w-4 h-4 transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-rose-500 group-hover:text-amber-300'
            }`}
          />
        );
      default:
        return (
          <HelpCircle
            className={`w-4 h-4 transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-slate-500 group-hover:text-amber-300'
            }`}
          />
        );
    }
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Tournament Guidelines &amp; Policies
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Answers regarding clubhouse dress code, golf club rental reservations, and 4-person scramble scoring rules.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#1E4D2B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Questions ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('dress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'dress'
                ? 'bg-[#1E4D2B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            Dress Code
          </button>
          <button
            onClick={() => setActiveCategory('rentals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'rentals'
                ? 'bg-[#1E4D2B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Club Rentals
          </button>
          <button
            onClick={() => setActiveCategory('format')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'format'
                ? 'bg-[#1E4D2B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            Scramble &amp; Scoring
          </button>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <FaqItemCard
                key={faq.id}
                faq={faq}
                isOpen={isOpen}
                onToggle={() => setOpenIndex(isOpen ? null : idx)}
                getCategoryIcon={getCategoryIcon}
              />
            );
          })}
        </div>

        {/* Pro Shop Support Box */}
        <div className="mt-10 max-w-4xl mx-auto p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 hover:bg-[#1e4d2b] hover:text-white transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 group cursor-pointer shadow-xs hover:shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1E4D2B] group-hover:bg-white/15 group-hover:text-amber-300 flex items-center justify-center shrink-0 transition-colors duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 group-hover:text-white text-xs sm:text-sm transition-colors duration-300">
                Have a special request or accessibility question?
              </div>
              <div className="text-xs text-slate-600 group-hover:text-emerald-100 transition-colors duration-300">
                Our tournament committee and clubhouse staff are happy to assist.
              </div>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 bg-[#1E4D2B] group-hover:bg-amber-400 group-hover:text-slate-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            Contact Organizers
          </a>
        </div>
      </div>
    </section>
  );
};
