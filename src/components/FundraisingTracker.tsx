import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS, SPONSORSHIP_PACKAGES } from '../data/initialData';
import { Target, TrendingUp, Heart, Users, Award, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export const FundraisingTracker: React.FC = () => {
  const {
    totalRaised,
    totalCharityNet,
    totalGolfFees,
    registrationDonationPortion,
    registrationGolfFeePortion,
    goalAmount,
    goalPercentage,
    totalGolfers,
    sponsors,
    donations,
    registrations,
    openDonationModal,
    openRegistrationModal
  } = useTournament();

  const juravinskiRaised = totalRaised * 0.75;
  const juravinskiTarget = (goalAmount || 2000) * 0.75;
  const juravinskiPct = Math.min(100, Math.round((juravinskiRaised / juravinskiTarget) * 100));

  const redCrossRaised = totalRaised * 0.25;
  const redCrossTarget = (goalAmount || 2000) * 0.25;
  const redCrossPct = Math.min(100, Math.round((redCrossRaised / redCrossTarget) * 100));

  const sponsorTotal = sponsors.reduce((acc, s) => {
    const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === s.tier);
    return acc + (pkg?.amount || 0);
  }, 0);

  const registrationTotal = registrations.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
  const donationTotal = donations.reduce((acc, d) => acc + (d.amount || 0), 0);

  return (
    <section id="goal" className="py-12 bg-[#F3F4F6] border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 overflow-hidden relative">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E4D2B] via-[#D4AF37] to-[#15803D]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left summary & progress bar */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-[#1E4D2B]">
                  <Target className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-heading">
                    <span style={{ fontSize: '20px' }} className="text-[20px] font-extrabold inline-block">2026</span> Memorial Goal
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Supporting Juravinski Breast Cancer Research (75%) &amp; Canadian Red Cross - Fire &amp; Flood (25%)
                  </p>
                </div>
              </div>

              {/* Big metric numbers */}
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                <span className="text-3xl sm:text-5xl font-extrabold text-[#1E4D2B] font-mono tracking-tight">
                  ${(totalRaised || 0).toLocaleString()}
                </span>
                <span className="text-lg sm:text-xl font-medium text-slate-500">
                  raised of <strong className="text-slate-800 font-semibold">${(goalAmount || 2000).toLocaleString()}</strong> goal
                </span>
                <div className="p-[2px] rounded-full bg-gradient-to-r from-[#1E4D2B] via-[#D4AF37] via-rose-500 to-emerald-500 shadow-xs inline-block">
                  <span className="block px-3.5 py-1 text-[13.8px] sm:text-[14px] font-extrabold rounded-full bg-emerald-50 text-emerald-950 font-mono tracking-tight">
                    {goalPercentage || 0}% Funded
                  </span>
                </div>
              </div>

              {/* Visual Thermometer */}
              <div className="space-y-2">
                <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-300 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalPercentage || 0}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#1E4D2B] via-[#15803D] to-[#D4AF37] rounded-full relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
                  </motion.div>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>$0</span>
                  <span className="text-[#1E4D2B] font-bold">Current: ${(totalRaised || 0).toLocaleString()}</span>
                  <span>${(goalAmount || 2000).toLocaleString()} (Target Goal)</span>
                </div>
              </div>

              {/* Dynamic Live Fund Allocation Split (As money is raised) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Live Fund Breakdown:</span>
                  <span className="text-emerald-700 font-mono">100% Directly to Beneficiaries</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Juravinski 75% Split */}
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-xs">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          Juravinski Breast Cancer Research
                        </div>
                        <div className="text-[11px] text-slate-500">75% Allocation Share</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        ${Math.round(juravinskiRaised).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${juravinskiPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{juravinskiPct}% funded</span>
                      <span>Target: ${Math.round(juravinskiTarget).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Canadian Red Cross 25% Split */}
                  <div className="p-3 bg-white rounded-lg border border-rose-200 shadow-xs">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                          Canadian Red Cross - Fire &amp; Flood
                        </div>
                        <div className="text-[11px] text-slate-500">25% Allocation Share</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-700">
                        ${Math.round(redCrossRaised).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${redCrossPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{redCrossPct}% funded</span>
                      <span>Target: ${Math.round(redCrossTarget).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openDonationModal(100)}
                  className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-bold rounded-xl shadow-sm transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Donate in memoriam
                </button>
                <button
                  onClick={() => openRegistrationModal('foursome')}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#1E4D2B] border border-[#1E4D2B]/30 text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  Register Player/Team
                </button>
              </div>
            </div>

            {/* Right stat breakdown tiles */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#295534] to-emerald-900 text-white border border-emerald-700 shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Heart className="w-4 h-4 fill-amber-300" />
                    <span className="text-xs font-bold uppercase tracking-wider">Net Charity Donation Raised</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    Pure Giving
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                  ${(totalCharityNet || 0).toLocaleString()} CAD
                </div>
                <p className="text-[11px] text-emerald-100 mt-1">
                  Direct proceeds to Juravinski Breast Cancer Research &amp; Red Cross
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[#295534] mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Registration Gifts</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-mono">
                    ${(registrationDonationPortion || 0).toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">$30 per Golfer Entry</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Course &amp; Golf Fees</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800 font-mono">
                    ${(totalGolfFees || 0).toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">$90 / $70 Green &amp; Carts</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Sponsorships</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-mono">
                    ${sponsorTotal.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sponsors.length} Corporate Partners</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-rose-500 mb-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Direct Gifts</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-mono">
                    ${donationTotal.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{donations.length} Dedicated Tributes</p>
                </div>
              </div>

              {/* Fee Formula Note */}
              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-900 leading-snug">
                <strong className="font-bold">Fee Allocation Transparency:</strong> For e-transfers &amp; entry fees, <strong>$30</strong> of every $120 ($90 golf fees) or $100 ($70 golf fees) registration is tracked as a direct charitable contribution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
