import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { PRICING_RULES, EVENT_DETAILS } from '../data/initialData';
import { Users, User, CheckCircle2, Sparkles, Trophy, ArrowRight, ShieldCheck, Ticket, DollarSign } from 'lucide-react';

export const RegistrationSection: React.FC = () => {
  const { openRegistrationModal, registrations } = useTournament();

  return (
    <section id="register" className="py-20 bg-[#FBFBFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Golfer Registration & Add-On Inventory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Register Your Foursome or Individual Entry
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            All registrations include 18 holes of championship golf with GPS cart, premium gift bag, gourmet continental breakfast, on-course refreshments, and full banquet luncheon entry.
          </p>
        </div>

        {/* 3 Main Registration Cards (Foursome, Individual, Dinner Only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch max-w-6xl mx-auto">
          {/* Foursome Card (Recommended) */}
          <div className="bg-white rounded-2xl border-2 border-[#1E4D2B] shadow-xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden ring-4 ring-emerald-600/10 md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-[#1E4D2B] text-amber-300 px-3.5 py-1 rounded-bl-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Most Popular • Team Best Value</span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 pt-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E4D2B] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                    Tournament Foursome
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">4-Person Scramble Team</p>
                </div>
              </div>

              <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#1E4D2B] font-mono">
                  ${PRICING_RULES.foursomeTeam}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Team ($212.50 per golfer)
                </span>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Foursome Package Includes:
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Four (4) Golfer Entries with GPS Cart Pairings</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Four (4) Deluxe Swag Bags & Apparel</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Welcome Lunch, On-Course Drinks & Awards Banquet</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Full Live Squabbit Team Sync & Leaderboard</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openRegistrationModal('foursome')}
              className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-900/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Foursome</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Individual Golfer Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                    Individual Golfer
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Single Player Entry</p>
                </div>
              </div>

              <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  ${PRICING_RULES.individualGolfer}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Golfer
                </span>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Individual Entry Includes:
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>18 Holes with Shared GPS Cart & Pairings</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>One (1) Deluxe Golfer Gift Swag Pack</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Unlimited Range Balls & Welcome Lunch</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Awards Dinner, Cocktail Hour & Banquet Entry</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openRegistrationModal('individual')}
              className="w-full py-3.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Individual</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dinner Only Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                    Dinner & Banquet Only
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Non-Golfing Supporter</p>
                </div>
              </div>

              <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  ${PRICING_RULES.dinnerOnly}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Guest
                </span>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Dinner Guest Pass Includes:
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Access to 5:00 PM Cocktail Hour & Open Bar</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Gourmet 3-Course Awards Banquet Dinner</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Silent Auction & Charity Mega Raffle Participation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Amina Mohammed Memorial Tribute Ceremony</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openRegistrationModal('dinner_only')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Dinner Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add-on Inventory Showcase Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-[#1E4D2B] rounded-2xl p-8 text-white shadow-xl max-w-5xl mx-auto border border-[#D4AF37]/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center md:justify-start gap-1.5">
                <Ticket className="w-4 h-4" />
                Tournament Day Add-Ons Available at Checkout
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-white">
                Mulligans, Mega Raffle Packs & Skill Shootouts
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Boost your score and support cancer patient relief: Mulligans (3 for $50), Mega Raffle Tickets ($25/$50 packs), Putting Shootout ($20), and Tiger Drive on Hole #11 ($25).
              </p>
            </div>

            <button
              onClick={() => openRegistrationModal('foursome')}
              className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b89528] text-slate-950 font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Customize Registration</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
