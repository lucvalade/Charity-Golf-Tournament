import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, Sparkles, ShieldCheck, Activity, Award, Quote, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export const MemorialStory: React.FC = () => {
  const { openDonationModal } = useTournament();

  const impactPillars = [
    {
      icon: Activity,
      title: 'Direct Patient Hardship Relief',
      description: 'Funding immediate travel, lodging, medical co-pays, and nutritional support for oncology patients undergoing intensive care.'
    },
    {
      icon: ShieldCheck,
      title: 'Clinical Research Fellowships',
      description: 'Underwriting breakthrough early-detection clinical trials and targeted immunotherapy research at regional oncology centers.'
    },
    {
      icon: Heart,
      title: 'Community Wellness & Family Care',
      description: 'Providing comprehensive psychological counseling, child care assistance, and survivorship resources for affected families.'
    }
  ];

  return (
    <section id="memorial" className="py-20 bg-[#FBFBFA] relative overflow-hidden">
      {/* Decorative leaf / crest background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-[#1E4D2B] text-xs font-bold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>The Heart Behind the Tournament</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Honoring the Life &amp; Legacy of <br className="hidden sm:inline" />
            <span className="text-[#1E4D2B] italic">{EVENT_DETAILS.memorialHonoree}</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every fairway played, every putt sunk, and every dollar raised stands as a living tribute to Naseem’s boundless generosity and compassion.
          </p>
        </div>

        {/* Founder Letter Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-200/90 relative flex flex-col justify-between">
            <Quote className="w-12 h-12 text-emerald-100 absolute top-6 right-6" />
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <h3 className="text-xl font-bold text-slate-900 font-serif-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                A Letter from Founder {EVENT_DETAILS.founder}
              </h3>
              <p>
                <em>"Naseem had a radiant gift for making everyone feel seen, cherished, and valued. When she was diagnosed with cancer, her bravery was unmatched—she spent her days comforting other patients in the infusion room rather than dwelling on her own pain."</em>
              </p>
              <p>
                <em>"Golf was something we shared that brought joy, fresh air, and deep friendships. In her memory, we founded the Saied October Charity Golf Classic to turn our collective love into tangible, life-changing support for patients and families fighting the very battle she faced."</em>
              </p>
              <p className="font-semibold text-slate-900">
                <em>"Thank you for swinging with us, for giving generously, and for ensuring Naseem's legacy of kindness continues to touch lives for generations to come."</em>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-crest text-lg font-bold text-[#1E4D2B]">{EVENT_DETAILS.founder}</div>
                <div className="text-xs text-slate-500 font-medium">Tournament Founder & Loving Husband</div>
              </div>
              <button
                onClick={() => openDonationModal(250)}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#1E4D2B] border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-rose-500" />
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
              <h4 className="text-2xl font-bold text-white font-serif-heading">
                {EVENT_DETAILS.beneficiaryOrg}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Naseem Hope for Juravinski Breast Cancer Research represents the oncology research, and the Canadian Red Cross – Fire &amp; Flood represents specialized clinical care programs, domestic disaster relief, and emergency response funds.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/80 relative">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/60">
                  <div className="text-2xl font-bold text-[#D4AF37] font-mono">100%</div>
                  <div className="text-[11px] text-slate-300 uppercase mt-0.5">Net Proceeds to Care</div>
                </div>
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/60">
                  <div className="text-2xl font-bold text-emerald-300 font-mono">501(c)(3)</div>
                  <div className="text-[11px] text-slate-300 uppercase mt-0.5">Tax-Deductible</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#D4AF37]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1E4D2B] group-hover:bg-[#1E4D2B] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 font-serif-heading">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
