import React from 'react';
import { IMPACT_DATA, EVENT_DETAILS } from '../data/initialData';
import { Heart, ShieldCheck, TrendingUp, HandHeart, Building, Activity, Sparkles, ArrowUpRight } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

export const ImpactSection: React.FC = () => {
  const { totalRaised = 0, goalAmount = 50000, goalPercentage = 0, openDonationModal } = useTournament();
  const percentage = goalPercentage || Math.min(100, Math.round(((totalRaised || 0) / (goalAmount || 50000)) * 100));

  const getInitiativeIcon = (index: number) => {
    switch (index) {
      case 0: return <HandHeart className="w-5 h-5 text-rose-500" />;
      case 1: return <Activity className="w-5 h-5 text-emerald-600" />;
      case 2: return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 3: return <Building className="w-5 h-5 text-sky-600" />;
      default: return <Heart className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section id="impact" className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Our Cause & Charitable Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            How Every Dollar Changes Lives
          </h2>
          <p className="mt-3 text-base text-slate-600">
            100% of net tournament proceeds directly fund oncology patient relief, essential medication support, and comfort grants through {EVENT_DETAILS.beneficiaryOrg}.
          </p>
        </div>

        {/* Real-time Progress Bar & Stats Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#1E4D2B] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                2026 Memorial Campaign Progress
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading">
                ${(totalRaised || 0).toLocaleString()} Raised Toward Our ${(goalAmount || 50000).toLocaleString()} Goal
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Together, our community has already achieved {percentage}% of our funding milestone for cancer patient emergency relief grants.
              </p>

              {/* Progress track */}
              <div className="pt-2">
                <div className="w-full bg-emerald-950/80 rounded-full h-4 p-0.5 overflow-hidden border border-emerald-700/60 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-[#D4AF37] transition-all duration-1000 shadow-md"
                    style={{ width: `${Math.max(5, percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-emerald-200 mt-2">
                  <span>$0 Baseline</span>
                  <span className="font-bold text-[#D4AF37] text-sm">{percentage}% Funded</span>
                  <span>Goal: ${(goalAmount || 50000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => openDonationModal(100)}
                className="w-full py-3.5 px-6 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Make a Direct Memorial Donation</span>
              </button>
              <a
                href="#register"
                className="w-full py-3 px-6 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl border border-emerald-600 transition flex items-center justify-center gap-2 text-center"
              >
                <span>Register a Foursome Team ($800)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {IMPACT_DATA.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#1E4D2B] mb-4 group-hover:scale-110 transition duration-200">
                <TrendingUp className="w-6 h-6 text-[#1E4D2B]" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-[#1E4D2B] mt-1 font-serif-heading">
                {metric.label}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {metric.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Fund Allocation Breakdown Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Transparent Stewardship
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-heading">
                How Your Support is Allocated
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#1E4D2B]" />
              <span>100% Tax-Deductible 501(c)(3)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {IMPACT_DATA.allocation.map((init, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-200 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {getInitiativeIcon(idx)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {init.title}
                      </h4>
                      <span className="text-xs font-semibold text-emerald-700">
                        {init.percent}% of Tournament Net Funds
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {init.description}
                </p>

                {/* Micro Percentage Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1E4D2B]"
                    style={{ width: `${init.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
