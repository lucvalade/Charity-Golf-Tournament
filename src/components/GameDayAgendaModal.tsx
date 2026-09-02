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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={() => setIsAgendaOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agenda-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 my-8 transition transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F2D17] via-[#1E4D2B] to-[#15381E] text-white p-6 relative border-b border-[#D4AF37]/30">
          <button
            onClick={() => setIsAgendaOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0F2D17] font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Official Schedule
            </span>
            <span className="text-emerald-200 text-xs font-semibold">
              Saied October Charity Golf Tournament
            </span>
          </div>

          <h2 id="agenda-modal-title" className="text-2xl sm:text-3xl font-extrabold font-serif-heading text-white tracking-tight">
            Game Day Agenda
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-200">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Monday Oct 5, 2026</span>
            </div>
            <a
              href={EVENT_DETAILS.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-200 hover:text-white underline-offset-2 hover:underline transition"
              title={`Open ${EVENT_DETAILS.venue.name} in Google Maps`}
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{EVENT_DETAILS.venue.name}</span>
            </a>
          </div>
        </div>

        {/* Modal Body / Timeline */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Timeline Items */}
          <div className="space-y-4">
            {/* Event 1: 9:30 AM */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 transition hover:shadow-sm">
              <div className="p-3 bg-[#1E4D2B] text-amber-300 rounded-xl shrink-0 shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-[#1E4D2B] flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    9:30 am
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Warm-Up & Contest
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Registration, Chipping and Putting Competition
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Kick off the morning with check-in, gift bag pickup, and warm-up on the championship putting greens and chipping grounds. Warm up your short game and compete for early contest trophies.
                </p>
              </div>
            </div>

            {/* Event 2: 11:00 AM */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 transition hover:shadow-sm">
              <div className="p-3 bg-amber-600 text-white rounded-xl shrink-0 shadow-sm">
                <Flag className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-amber-900 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-700" />
                    11:00 am
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Shotgun Start
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Tee off (shotgun)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  All foursomes head to their assigned starting holes for a simultaneous shotgun launch across the 18-hole championship layout with live{' '}
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
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 transition hover:shadow-sm">
              <div className="p-3 bg-blue-900 text-blue-200 rounded-xl shrink-0 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-blue-950 flex items-center gap-1">
                    Game Format
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Team Play
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  6-6-6 format (Swapping Partners version, details to follow)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  An exciting 18-hole structured competition where partners rotate every 6 holes to maximize camaraderie, strategic play, and friendly competition. Complete rules walkthrough provided during cart briefing.
                </p>
              </div>
            </div>

            {/* Event 4: 4:00 PM */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 transition hover:shadow-sm">
              <div className="p-3 bg-orange-600 text-white rounded-xl shrink-0 shadow-sm">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-orange-950 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-orange-700" />
                    4:00 pm
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                    Grand Banquet
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  FABULOUS Turkey Dinner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Gather in the grand ballroom for a festive turkey feast with all the trimmings, tournament award ceremonies, silent auction reveals, and{' '}
                  <a
                    href="https://app.squabbitgolf.com/#z9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-800 underline hover:text-orange-950 font-semibold"
                  >
                    Squabbit live leaderboard
                  </a>{' '}
                  championship celebrations ($50-$60 Dinner to be finalized).
                </p>
              </div>
            </div>

            {/* Event 5: Special Dinner & Donation Option */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/90 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-600 text-white rounded-lg shrink-0 mt-0.5">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-rose-950">
                      $50-$60 Dinner to be finalized
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                      LIMITED
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-900/80 mt-1 leading-relaxed">
                    Not playing in the tournament? Join us exclusively for the fabulous 4:00 PM Turkey Dinner, awards ceremony, and charity fundraiser to support the memorial mission in honor of Amina Mohammed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Highlights */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tournament Quick Facts
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Live Scoring powered by Squabbit Golf
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Driving range &amp; practice access included
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Trophies for 1st, 2nd, Closest-to-Pin &amp; Longest Drive
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                100% of auction proceeds benefit oncology care
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setIsAgendaOpen(false)}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setIsAgendaOpen(false);
                openDonationModal(100);
              }}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-amber-200 hover:text-white border border-[#D4AF37]/50 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Dinner / Memorial Donation</span>
            </button>

            <button
              onClick={() => {
                setIsAgendaOpen(false);
                openRegistrationModal('foursome');
              }}
              className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Register Golfer or Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
