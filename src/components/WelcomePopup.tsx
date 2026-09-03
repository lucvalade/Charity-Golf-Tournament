import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Users, Gift, Trophy, Heart, ArrowRight, ShieldCheck, Sparkles, HandHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY_DISMISSED = 'saied_golf_dismiss_welcome_popup';

export const WelcomePopup: React.FC = () => {
  const { goToVolunteerSection, openDonationModal } = useTournament();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (!isDismissed) {
        // Show after a brief delay for a clean entrance
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDoNotDisplayAgain = () => {
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    } catch (e) {
      console.warn('Storage write failed', e);
    }
    setIsOpen(false);
  };

  const handleVolunteerClick = () => {
    setIsOpen(false);
    goToVolunteerSection();
  };

  const handleDonationClick = () => {
    setIsOpen(false);
    openDonationModal(100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="welcome-popup-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-popup-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Strip */}
            <div className="h-2 bg-gradient-to-r from-[#1E4D2B] via-[#D4AF37] to-[#15803D]" />

            {/* Header with Close (X) Button */}
            <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1E4D2B]">
                  Tournament Announcement &amp; Key Updates
                </span>
              </div>
              <button
                id="welcome-popup-close-btn"
                type="button"
                onClick={handleClose}
                aria-label="Close Announcement"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* 1. Volunteers NEEDED Callout Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-50/60 border-2 border-amber-400/80 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base tracking-tight mb-1.5">
                  <span className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 shadow-xs">
                    <Users className="w-4 h-4" />
                  </span>
                  <span id="welcome-popup-title" className="text-lg text-amber-950 font-serif-heading font-extrabold">
                    Volunteers NEEDED
                  </span>
                  <span className="text-[10px] text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Sign-Up Open
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  We are looking for enthusiastic community volunteers to help with morning golfer check-in, gift bags, hospitality stations, and on-course contests!
                </p>
                <button
                  id="welcome-popup-volunteer-btn"
                  type="button"
                  onClick={handleVolunteerClick}
                  className="w-full py-2.5 px-4 bg-[#1E4D2B] hover:bg-[#163820] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Contact Tournament Organizers &amp; Volunteer, Volunteer On-Course tab</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition" />
                </button>
              </div>

              {/* 2. Key Tournament Highlights List */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                {/* Donations only (Unlimited) */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Donations only (Unlimited)
                      </span>
                      <button
                        type="button"
                        onClick={handleDonationClick}
                        className="text-[11px] font-bold text-[#EA580C] hover:underline cursor-pointer"
                      >
                        Donate Online &rarr;
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Non-golfers and supporters anywhere are warmly welcomed to make open, tax-deductible memorial contributions in any amount.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Donations of Prizes accepted */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Donations of Prizes accepted
                    </span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Individual, merchant, and corporate gift basket, equipment, or merchandise donations for our tournament raffles and silent auction are actively accepted!
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Several individual and team prizes */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1E4D2B] flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Several individual and team prizes
                    </span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Exciting contests across 18 holes: 1st/2nd/3rd Team Scramble Champions, Longest Drive (Men/Women), Closest to Pin, Putting Contest Champion &amp; Door Prizes!
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Funds Donated to (75% / 25% Allocation) */}
              <div className="p-4 rounded-2xl bg-[#1E4D2B] text-white shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Funds Donated to</span>
                  </div>
                  <span className="text-[10px] text-emerald-200 uppercase font-semibold">
                    100% Net Proceeds
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Juravinski Breast Cancer Research(75%) */}
                  <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-50">
                        Juravinski Breast Cancer Research
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#D4AF37] text-sm shrink-0 ml-2">
                      (75%)
                    </span>
                  </div>

                  {/* Canadian Red Cross - Fire & Flood (25%) */}
                  <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                      <span className="font-semibold text-emerald-50">
                        Canadian Red Cross - Fire &amp; Flood
                      </span>
                    </div>
                    <span className="font-mono font-bold text-rose-300 text-sm shrink-0 ml-2">
                      (25%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with "Do Not Display Again" link */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <button
                id="welcome-popup-do-not-display-link"
                type="button"
                onClick={handleDoNotDisplayAgain}
                className="text-xs text-slate-500 hover:text-slate-800 underline transition cursor-pointer order-2 sm:order-1"
              >
                Do Not Display Again
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2 bg-[#1E4D2B] hover:bg-[#163820] text-white text-xs font-bold rounded-xl transition cursor-pointer order-1 sm:order-2"
              >
                Continue to Tournament Site
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
