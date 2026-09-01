import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, Gift, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const DonationSection: React.FC = () => {
  const { openDonationModal } = useTournament();
  const [customAmount, setCustomAmount] = useState<string>('100');

  const presetTiers = [
    { amount: 50, label: 'Patron of Hope', impact: 'Provides warm nutrition and travel aid for an outpatient oncology family.' },
    { amount: 100, label: 'Memorial Supporter', impact: 'Covers essential patient comfort packs and prescription co-pay assistance.' },
    { amount: 250, label: 'Care Champion', impact: 'Funds clinical oncology nurse consultations and family grief counseling sessions.' },
    { amount: 500, label: 'Legacy Benefactor', impact: 'Directly underwrites advanced genetic biomarker testing for one oncology patient.' },
    { amount: 1000, label: 'Philanthropic Leader', impact: 'Full grant supporting breakthrough clinical trial patient enrollment.' }
  ];

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-[#15381E] via-[#1E4D2B] to-[#15381E] text-white relative overflow-hidden">
      {/* Background glow and patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-[#D4AF37]/50 text-amber-200 text-xs font-bold uppercase tracking-widest mb-3 shadow-md">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Open Memorial Donation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-heading tracking-tight">
            Make a Memorial Gift in Honor of <br className="hidden sm:inline" />
            <span className="gold-gradient-text">{EVENT_DETAILS.memorialHonoree}</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">
            Even if you are unable to join us on the golf course, your tax-deductible gift provides immediate warmth, relief, and cutting-edge cancer care for patients in need.
          </p>
        </div>

        {/* Donation Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {presetTiers.map((tier) => (
            <div
              key={tier.amount}
              className="bg-emerald-950/70 border border-emerald-700/70 hover:border-[#D4AF37] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {tier.label}
                </span>
                <div className="text-3xl font-extrabold font-mono text-white mt-1 mb-2">
                  ${tier.amount}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[54px]">
                  {tier.impact}
                </p>
              </div>

              <button
                onClick={() => openDonationModal(tier.amount)}
                className="mt-4 w-full py-2.5 bg-emerald-800 group-hover:bg-[#D4AF37] group-hover:text-slate-950 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Give ${tier.amount}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Custom Gift Quick Bar */}
        <div className="bg-emerald-950/90 border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-white font-serif-heading">
                Choose a Custom Donation Amount
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Every dollar is 100% tax-deductible under 501(c)(3) guidelines.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-36">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-[#15381E] border border-emerald-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                onClick={() => openDonationModal(Number(customAmount) || 100)}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Donate Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
