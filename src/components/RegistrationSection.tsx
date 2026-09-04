import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { PRICING_RULES, EVENT_DETAILS } from '../data/initialData';
import { Users, User, CheckCircle2, Sparkles, Trophy, ArrowRight, ShieldCheck, Ticket, DollarSign } from 'lucide-react';

export const RegistrationSection: React.FC = () => {
  const { openRegistrationModal, registrations } = useTournament();

  return (
    <section id="register" className="py-20 bg-[#FBFBFA] relative scroll-mt-20">
      <div id="golfer-registration-inventory" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div id="golfer-registration" className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3 scroll-mt-24">
            <Users className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Golfer Registration & Add-On Inventory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Register for the Charity Classic
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            All golfer registrations include 18 holes of championship golf with GPS cart, premium gift bag, gourmet continental breakfast, on-course refreshments, and full banquet luncheon entry.
          </p>
        </div>

        {/* 2 Main Registration Cards (Green Fee & Cart, Dinner Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 items-stretch max-w-4xl mx-auto">
          {/* Individual Golfer Card - Green Fee & Cart */}
          <div className="bg-white rounded-2xl border-2 border-[#1E4D2B] shadow-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-2xl transition relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-2 pt-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E4D2B] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                    Green Fee &amp; Cart
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Single Player Tournament Entry</p>
                </div>
              </div>

              <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1E4D2B] font-mono">
                  $120–$130
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Golfer
                </span>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Green Fee &amp; Cart Package Includes:
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>18 Holes Championship Golf with GPS Cart</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deluxe Golfer Gift Bag &amp; Tournament Apparel</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Unlimited Range Balls, Breakfast &amp; On-Course Drinks</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Full Dinner &amp; Awards Banquet Entry</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Live Squabbit{' '}
                    <a
                      href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-emerald-700 font-semibold"
                    >
                      Leaderboard
                    </a>{' '}
                    Sync &amp; Contests
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openRegistrationModal('individual')}
              className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-900/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Golfer</span>
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
                    Dinner
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Supporter • Dinner &amp; Awards Banquet</p>
                </div>
              </div>

              <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  $50–$60
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  (to be finalized) Per Guest
                </span>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Dinner Guest Pass Includes:
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Access to Dinner &amp; Awards Banquet</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>FABULOUS Turkey Dinner</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Silent Auction &amp; Charity Mega Raffle Participation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Naseem Mohammed Memorial Tribute Ceremony</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openRegistrationModal('dinner_only')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register for Dinner</span>
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
                Mulligans, Mega Raffle Packs &amp; Skill Shootouts
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Boost your score and support cancer patient relief: Mulligans (3 for $50), Mega Raffle Tickets ($25/$50 packs), Putting Shootout ($20), and Tiger Drive on Hole #11 ($25).
              </p>
            </div>

            <button
              onClick={() => openRegistrationModal('individual')}
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
