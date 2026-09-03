import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { 
  X, 
  Calendar, 
  Clock, 
  Trophy, 
  Utensils, 
  Flag, 
  Users, 
  Sparkles, 
  Heart, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Gift
} from 'lucide-react';

export const GameDayAgendaModal: React.FC = () => {
  const { 
    isAgendaOpen, 
    setIsAgendaOpen, 
    openRegistrationModal, 
    openDonationModal 
  } = useTournament();

  if (!isAgendaOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={() => setIsAgendaOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agenda-modal-title"
    >
      <div 
        className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 my-4 transition transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner - 25% more compact */}
        <div className="bg-gradient-to-r from-[#0F2D17] via-[#1E4D2B] to-[#15381E] text-white p-4 sm:p-5 relative border-b border-[#D4AF37]/30">
          <button
            onClick={() => setIsAgendaOpen(false)}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0F2D17] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Official Schedule
            </span>
            <span className="text-emerald-200 text-[11px] font-semibold">
              Saied October Charity Golf
            </span>
          </div>

          <h2 id="agenda-modal-title" className="text-lg sm:text-xl font-bold font-serif-heading text-white tracking-tight">
            Game Day Agenda
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-200">
            <div className="flex items-center gap-1 font-bold text-amber-200">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Monday Oct 5, 2026</span>
            </div>
            <a
              href={EVENT_DETAILS.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-200 hover:text-white underline-offset-2 hover:underline transition text-xs"
              title={`Open ${EVENT_DETAILS.venue.name} in Google Maps`}
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{EVENT_DETAILS.venue.name}</span>
            </a>
          </div>
        </div>

        {/* Modal Body / Timeline - 25% tighter layout */}
        <div className="p-4 sm:p-5 space-y-3.5 max-h-[62vh] overflow-y-auto">
          {/* Timeline Items */}
          <div className="space-y-2.5">
            {/* Event 1: 9:30 AM */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 transition hover:shadow-xs">
              <div className="p-2 bg-[#1E4D2B] text-amber-300 rounded-lg shrink-0 shadow-xs">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-[#1E4D2B] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    9:30 am
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Warm-Up & Contest
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  Registration, Chipping &amp; Putting Competition
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Kick off the morning with check-in, gift bag pickup, and warm-up on the putting greens and chipping grounds.
                </p>
              </div>
            </div>

            {/* Event 2: 11:00 AM */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 transition hover:shadow-xs">
              <div className="p-2 bg-amber-600 text-white rounded-lg shrink-0 shadow-xs">
                <Flag className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-amber-900 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" />
                    11:00 am
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Shotgun Start
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  Tee off (Shotgun)
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Simultaneous shotgun launch across 18 holes with live{' '}
                  <a
                    href="https://squabbitgolf.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline hover:text-emerald-900 font-semibold"
                  >
                    Squabbit scoring app
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Event 3: Tournament Format */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 transition hover:shadow-xs">
              <div className="p-2 bg-blue-900 text-blue-200 rounded-lg shrink-0 shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-blue-950 flex items-center gap-1">
                    Game Format
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                    Team Play
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  6-6-6 format (Swapping Partners)
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Partners rotate every 6 holes to maximize camaraderie, strategic play, and friendly competition.
                </p>
              </div>
            </div>

            {/* Event 4: 4:00 PM */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/70 border border-orange-200/80 transition hover:shadow-xs">
              <div className="p-2 bg-orange-600 text-white rounded-lg shrink-0 shadow-xs">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-orange-950 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-700" />
                    4:00 pm
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">
                    Grand Banquet
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  FABULOUS Turkey Dinner
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Dinner &amp; Donation option ($50-$60 to be finalized) [LIMITED #, book early]. Post-round celebration with{' '}
                  <a
                    href="https://app.squabbitgolf.com/#z9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-800 underline hover:text-orange-950 font-semibold"
                  >
                    Squabbit live leaderboard
                  </a>
                  , trophy awards, and charity draws.
                </p>
              </div>
            </div>

            {/* Event 5: Special Dinner & Donation Option */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/90 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-rose-600 text-white rounded-md shrink-0 mt-0.5">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                      Dinner &amp; Donation option ($50-$60)
                    </h4>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-1.5 py-0.5 rounded-full">
                      LIMITED #
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-900/80 mt-0.5 leading-relaxed">
                    Not playing? Join us exclusively for the fabulous 4:00 PM Turkey Dinner &amp; awards banquet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Highlights */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tournament Quick Facts
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Live Scoring by Squabbit Golf
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Practice &amp; range included
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                1st, 2nd, KP &amp; Long Drive trophies
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Proceeds support oncology care
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions - Compact */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setIsAgendaOpen(false)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsAgendaOpen(false);
                openDonationModal(100);
              }}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-200 hover:text-white border border-[#D4AF37]/50 text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Dinner / Donation</span>
            </button>

            <button
              onClick={() => {
                setIsAgendaOpen(false);
                openRegistrationModal('foursome');
              }}
              className="px-3.5 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>Register Golfer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
