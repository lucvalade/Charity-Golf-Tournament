import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, Sparkles, ShieldCheck, Activity, Award, Quote, Gift, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export const MemorialStory: React.FC = () => {
  const { openDonationModal } = useTournament();

  return (
    <section id="memorial" className="py-20 bg-[#FBFBFA] relative overflow-hidden scroll-mt-20">
      <span id="about" className="block relative -top-24 invisible" />
      {/* Decorative leaf / crest background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a4426] border border-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Our Purpose</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Honoring <span className="text-[#1E4D2B] italic">Naseem Mohammed</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every shot and dollar raised honors Naseem’s boundless generosity and compassion.
          </p>
        </div>

        {/* Founder Letter Card / Our Purpose Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-7 bg-[#1a4426] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-emerald-700/60 relative flex flex-col justify-between overflow-hidden">
            <Quote className="w-16 h-16 text-emerald-900/40 absolute top-6 right-6 pointer-events-none" />
            <div className="space-y-4 text-slate-100 leading-relaxed text-sm sm:text-base relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                  Our Purpose
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-heading flex items-center gap-2 pt-1">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                A Letter from Founder {EVENT_DETAILS.founder}
              </h3>
              <p className="text-slate-100 leading-relaxed italic">
                "One could never find a more gracious and self sacrificing person than the example that we had in our Mother. She always took the time and effort regardless of whatever birthday party, holiday, or social gathering, to make sure that whoever was present was a well comforted guest, taken care of and treated like royalty."
              </p>
              <p className="font-semibold text-amber-200 leading-relaxed italic pt-1">
                "Now, in the same spirit of joy &amp; fun, we hold this tournament."
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/80 flex items-center justify-between relative z-10">
              <div>
                <div className="font-crest text-lg font-bold text-[#D4AF37]">{EVENT_DETAILS.founder}</div>
                <div className="text-xs text-emerald-200 font-medium">Tournament Founder &amp; Loving Husband</div>
              </div>
              <button
                onClick={() => openDonationModal(250)}
                className="px-4 py-2 bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Gift className="w-4 h-4 text-rose-400" />
                Dedicate a Tribute Gift
              </button>
            </div>
          </div>

          {/* Tribute Visual & Memorial Photo Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E4D2B] via-[#15381E] to-[#0F2615] rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-[#D4AF37]/40">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#D4AF37]/60 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-rose-300 fill-rose-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                100% Philanthropic Allocation
              </span>
              <div className="space-y-3 pt-1">
                <div>
                  <h4 className="text-base font-bold text-white font-serif-heading">
                    Juravinski Breast Cancer Research:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-0.5">
                    Advances oncology clinical trials and research.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-serif-heading">
                    Canadian Red Cross (Fire &amp; Flood):
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-0.5">
                    Funds local disaster relief, emergency response, and clinical care.
                  </p>
                </div>

                {/* Foundation Acknowledgement Letter */}
                <div className="pt-2">
                  <a
                    href="/Fragrant%20Breeze%20Acknowledgement%20Letter%20-%20September%201,%202026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#D4AF37] text-amber-200 hover:text-white text-xs font-semibold transition"
                    title="Read official letter from Hamilton Health Sciences Foundation (PDF)"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Official Foundation Acknowledgement Letter</span>
                    <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/80 relative">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/60">
                  <div className="text-2xl font-bold text-[#D4AF37] font-mono">100%</div>
                  <div className="text-[11px] text-slate-300 uppercase mt-0.5">Net Proceeds to Care</div>
                </div>
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/60">
                  <div className="text-xl font-bold text-amber-300 font-mono">Memorial</div>
                  <div className="text-[11px] text-slate-300 uppercase mt-0.5">Charitable Classic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
