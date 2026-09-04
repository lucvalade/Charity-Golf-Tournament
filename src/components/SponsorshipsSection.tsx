import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { SPONSORSHIP_PACKAGES } from '../data/initialData';
import { Award, CheckCircle2, Star, Sparkles, Building2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { SponsorTier } from '../types';

export const SponsorshipsSection: React.FC = () => {
  const { sponsors, openSponsorModal } = useTournament();

  return (
    <section id="sponsorships" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Corporate Partnerships & Philanthropy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Tournament Sponsorship Packages
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Elevate your company brand while driving direct, life-saving impact. 
            All sponsorships include prominent recognition, exclusive perks, and 100% tax-deductible contributions.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {SPONSORSHIP_PACKAGES.map((pkg) => {
            const isPresenting = pkg.id === 'presenting';
            const isEagle = pkg.id === 'eagle';

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl flex flex-col justify-between transition-all duration-300 relative border ${
                  isPresenting
                    ? 'border-[#D4AF37] bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 shadow-xl ring-2 ring-[#D4AF37]/50'
                    : isEagle
                    ? 'border-emerald-600/60 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-md hover:shadow-lg'
                } p-6 sm:p-8`}
              >
                {/* Ribbon for Title */}
                {isPresenting && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Premier Title Partner</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 min-h-[36px] mb-4">
                    {pkg.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#1E4D2B] font-mono">
                      ${pkg.amount.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      / Sponsor
                    </span>
                  </div>

                  {/* Highlights / Inclusions */}
                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Package Inclusions:
                    </div>
                    {pkg.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {benefit.includes('Leaderboard') ? (
                            <>
                              {benefit.split('Leaderboard')[0]}
                              <a
                                href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-emerald-700 font-semibold"
                              >
                                Leaderboard
                              </a>
                              {benefit.split('Leaderboard')[1]}
                            </>
                          ) : benefit.includes('leaderboards') ? (
                            <>
                              {benefit.split('leaderboards')[0]}
                              <a
                                href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-emerald-700 font-semibold"
                              >
                                leaderboards
                              </a>
                              {benefit.split('leaderboards')[1]}
                            </>
                          ) : (
                            benefit
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openSponsorModal(pkg.id as SponsorTier)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      isPresenting
                        ? 'bg-[#D4AF37] hover:bg-[#b89528] text-slate-950 shadow-md'
                        : isEagle
                        ? 'bg-[#1E4D2B] hover:bg-emerald-900 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Pledge {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Existing Confirmed Sponsors Wall */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Community Leadership
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif-heading mt-0.5">
                Our 2026 Memorial Tournament Partners
              </h3>
            </div>
            <button
              onClick={() => openSponsorModal('eagle')}
              className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Join as Corporate Sponsor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => {
              const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === sponsor.tier);
              return (
                <div
                  key={sponsor.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                        {pkg?.name || sponsor.tier}
                      </span>
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {sponsor.companyName}
                    </h4>
                    {sponsor.customNote && (
                      <p className="text-xs text-slate-600 italic mt-2">
                        "{sponsor.customNote}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Contact: {sponsor.contactName}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
