import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Calendar, MapPin, Trophy, Users, Heart, ArrowRight, QrCode, Sparkles, CheckCircle, CalendarDays, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';

export const Hero: React.FC = () => {
  const { totalRaised, totalGolfers, goalAmount, goalPercentage, openRegistrationModal, openDonationModal, openAgendaModal } = useTournament();

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.isoDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-[20px] pb-16 md:pb-24 bg-[#1E4D2B] text-white overflow-hidden">
      {/* Decorative background gradients and subtle turf textures */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#15381E] via-[#1E4D2B] to-[#13301B] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Stack: a) Install App (Mobile/Tablet), b) Memorial Legacy, c) Foundation Letter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-6 gap-2 sm:gap-2.5"
        >
          {/* a) Install App Button: Mobile and Tablet only (hidden on desktop) */}
          <div className="lg:hidden flex justify-center">
            <PWAInstallButton
              variant="compact"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-full border border-amber-500/80 shadow-xs transition cursor-pointer"
            />
          </div>

          {/* b) Fragrant Breeze Golf Classic - Honoring the Life & Legacy of Naseem Mohammed */}
          {/* Both Mobile and Desktop: 3 distinct lines, NO heart icon */}
          <div className="flex flex-col items-center justify-center text-center px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-950/80 border border-[#D4AF37]/60 shadow-md sm:shadow-lg text-xs tracking-wide max-w-[92vw] sm:max-w-md">
            <span className="text-amber-300 font-bold text-xs sm:text-sm leading-tight uppercase tracking-wider">
              Fragrant Breeze Golf Classic
            </span>
            <span className="text-slate-200 font-medium text-xs sm:text-[13px] leading-tight mt-1">
              Honoring the Life &amp; Legacy of
            </span>
            <strong className="text-white font-extrabold text-xs sm:text-sm leading-tight mt-0.5 tracking-wide">
              {EVENT_DETAILS.memorialHonoree}
            </strong>
          </div>

          {/* c) View Official Foundation Acknowledgement Letter */}
          <a
            href="/Fragrant%20Breeze%20Acknowledgement%20Letter%20-%20September%201,%202026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-[#D4AF37]/70 hover:border-yellow-300 transition-all shadow-lg backdrop-blur-sm cursor-pointer text-left"
            title="View Official Foundation Acknowledgement Letter (PDF)"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
            <span className="flex flex-col text-left">
              <span className="font-semibold text-yellow-300 text-xs sm:text-[13.5px] leading-snug tracking-wide group-hover:text-yellow-200 transition">
                View Official Foundation
              </span>
              <span className="font-semibold text-yellow-300 text-xs sm:text-[13.5px] leading-snug tracking-wide group-hover:text-yellow-200 transition">
                Acknowledgement Letter
              </span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400/90 group-hover:text-yellow-200 group-hover:opacity-100 shrink-0 transition ml-1" />
          </a>
        </motion.div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-crest text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white drop-shadow-sm"
          >
            Fragrant Breeze <br className="hidden sm:inline" />
            <span className="gold-gradient-text drop-shadow">Golf Tournament</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-xl text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Join the founder Saied Mohammed for a premier 18-hole scramble classic celebrating love, community, and hope. 
            All proceeds directly support oncological care & patient relief.
          </motion.p>
        </div>

        {/* Tournament Countdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 max-w-3xl mx-auto bg-emerald-950/80 border border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tournament Countdown
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Tee off on Monday, October 5, 2026</p>
            </div>

            {/* Timer digits */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[54px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">{timeLeft.days}</span>
                <span className="text-[10px] text-amber-200/80 uppercase font-semibold">Days</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[54px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-amber-200/80 uppercase font-semibold">Hours</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[54px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-amber-200/80 uppercase font-semibold">Mins</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[54px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-amber-200/80 uppercase font-semibold">Secs</span>
              </div>
            </div>
          </div>

          {/* Quick Fundraising Micro-Bar */}
          <div className="mt-4 pt-4 border-t border-emerald-800/80 flex flex-col items-center justify-center text-xs gap-2">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-white">${(totalRaised || 0).toLocaleString()}</strong> raised of ${(goalAmount || 2000).toLocaleString()} goal ({goalPercentage || 0}%)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-amber-200/90 text-center">
              <span className="font-semibold text-white"><strong>{totalGolfers}</strong> Golfers Registered</span>
              <div className="flex flex-col items-center gap-0.5 text-xs">
                <span>Juravinski (75%)</span>
                <span>Red Cross (25%)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Event Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/80 uppercase font-semibold tracking-wider">Tournament Date</div>
            <div className="text-sm font-bold text-white mt-0.5">Monday, October 5, 2026</div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <MapPin className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
            <div className="text-xs text-sky-200/80 uppercase font-semibold tracking-wider">Championship Venue</div>
            <a
              href={EVENT_DETAILS.venue.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Burford Golf Links Official Website"
              className="text-sm font-bold text-white mt-0.5 block hover:text-amber-200 transition underline-offset-2 hover:underline"
            >
              {EVENT_DETAILS.venue.name}
            </a>
            <a
              href={EVENT_DETAILS.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open venue location in Google Maps"
              className="text-[11px] text-slate-300 hover:text-sky-200 transition block mt-0.5 underline-offset-2 hover:underline"
            >
              {EVENT_DETAILS.venue.address}
            </a>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/80 uppercase font-semibold tracking-wider">Format & Start</div>
            <div className="text-sm font-bold text-white mt-0.5">
              9:30 AM Registration
              <br />
              Chipping & Putting Competition
            </div>
          </div>
        </motion.div>

        {/* Primary CTA Action Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2.5 sm:gap-4 max-w-2xl mx-auto"
        >
          <button
            onClick={() => openRegistrationModal('foursome')}
            className="w-[75%] max-w-xs sm:w-auto px-4 py-2.5 sm:px-8 sm:py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-base font-bold rounded-lg sm:rounded-xl shadow-md sm:shadow-lg shadow-orange-950/40 hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer"
          >
            <span>Register Foursome</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => openDonationModal(100)}
            className="w-[75%] max-w-xs sm:w-auto px-4 py-2.5 sm:px-7 sm:py-4 bg-[#15381E] hover:bg-emerald-900 text-amber-200 hover:text-white border-2 border-[#D4AF37]/70 text-xs sm:text-base font-bold rounded-lg sm:rounded-xl shadow-sm sm:shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-400 fill-rose-400" />
            <span>Make Memorial Gift</span>
          </button>

          <button
            onClick={openAgendaModal}
            className="w-[75%] max-w-xs sm:w-auto px-4 py-2.5 sm:px-6 sm:py-4 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 hover:text-white border border-[#D4AF37]/60 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-sm sm:shadow-md hover:shadow-emerald-950/50 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Game Day Agenda</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
