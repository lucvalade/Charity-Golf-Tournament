import React, { useState } from 'react';
import { FAQ_DATA, FaqItem } from '../data/initialData';
import { HelpCircle, ChevronDown, CloudRain, Shirt, Sparkles, Trophy, Flag, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'weather' | 'dress' | 'rentals' | 'format'>('all');

  const filteredFaqs = activeCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'weather': return <CloudRain className="w-4 h-4 text-sky-600" />;
      case 'dress': return <Shirt className="w-4 h-4 text-emerald-600" />;
      case 'rentals': return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
      case 'format': return <Flag className="w-4 h-4 text-rose-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
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
            Tournament Guidelines & Policies
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Answers regarding weather policies, clubhouse dress code, golf club rental reservations, and 4-person scramble scoring rules.
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
            onClick={() => setActiveCategory('weather')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'weather'
                ? 'bg-[#1E4D2B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Weather Policies
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
            Scramble & Scoring
          </button>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-sm transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base font-serif-heading">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg bg-slate-50 text-slate-500 transition transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-emerald-50 text-[#1E4D2B]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pl-16">
                    <p>
                      {faq.answer.includes('leaderboard') ? (
                        <>
                          {faq.answer.split('leaderboard')[0]}
                          <a
                            href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 underline hover:text-emerald-900 font-semibold"
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
          })}
        </div>

        {/* Pro Shop Support Box */}
        <div className="mt-10 max-w-4xl mx-auto p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1E4D2B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Have a special request or accessibility question?</div>
              <div className="text-xs text-slate-600">Our tournament committee and clubhouse staff are happy to assist.</div>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            Contact Organizers
          </a>
        </div>
      </div>
    </section>
  );
};
