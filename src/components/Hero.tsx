import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Calendar, MapPin, Trophy, Heart, ArrowRight, QrCode, Sparkles, CalendarDays, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';

export const Hero: React.FC = () => {
  const { openRegistrationModal, openDonationModal, openAgendaModal, openQrGeneratorModal } = useTournament();

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
    <section id="hero" className="relative pt-6 pb-16 md:pb-24 bg-[#020617] text-white overflow-hidden">
      {/* Decorative background gradients and subtle turf textures */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#091a10] to-[#020617] opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Stack: a) Install App (Mobile/Tablet), b) Flanked Header Title, c) Foundation Letter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-6 gap-2 sm:gap-2.5"
        >
          {/* a) Install App Button & QR Code Link: Mobile and Tablet only (hidden on desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-2">
            <PWAInstallButton
              variant="compact"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-full border border-amber-500/80 shadow-xs transition cursor-pointer"
            />
            <button
              type="button"
              onClick={openQrGeneratorModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-200 hover:text-white bg-emerald-950/90 hover:bg-emerald-900 active:bg-emerald-950 rounded-full border border-[#D4AF37]/70 shadow-xs transition cursor-pointer"
              title="Open Branded QR Code Generator & Options"
            >
              <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>QR Code</span>
            </button>
          </div>

          {/* b) Fragrant Breeze Golf Classic Banner Layout: [ LEFT: Text Box (~80%) ] ------------ [ RIGHT: Circular Golfer Photo (~20%) ] */}
          <div className="flex items-center justify-between gap-3 sm:gap-6 w-full max-w-3xl mx-auto my-3">
            {/* LEFT SIDE: Event Title + Subtitle Box (~80%) */}
            <div className="flex-1 px-5 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-[#032817]/95 border-2 border-[#D4AF37]/90 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center">
              <span className="text-amber-400 font-extrabold text-sm sm:text-lg md:text-xl tracking-widest uppercase font-serif-heading">
                FRAGRANT BREEZE GOLF CLASSIC
              </span>
              <span className="text-slate-100 font-semibold text-xs sm:text-sm leading-snug mt-1">
                Honoring the Life &amp; Legacy of
              </span>
              <strong className="text-white font-extrabold text-sm sm:text-base md:text-lg leading-tight mt-0.5 tracking-wide">
                {EVENT_DETAILS.memorialHonoree}
              </strong>
            </div>

            {/* RIGHT SIDE: Circular Golfer Photo (~20%) */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#032817] via-[#D4AF37] to-[#15803D] shadow-2xl transition-transform duration-300 hover:scale-105">
                <div className="w-full h-full rounded-full border-2 border-[#D4AF37] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src="/images/female_putting.png"
                    alt="Female Golfer Putting - Sunset Scene"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center rounded-full scale-105"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.failedOnce) {
                        img.dataset.failedOnce = 'true';
                        img.src = '/female_putting.png';
                      } else {
                        img.src = '/images/female_putting_vertical.jpg';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
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
            className="text-center tracking-tight leading-tight"
          >
            <span className="block font-sans text-amber-300 text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider mb-1">
              6th Annual
            </span>
            <span className="block font-crest text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-sm">
              Fragrant Breeze
            </span>
            <span className="block gold-gradient-text drop-shadow font-crest text-2xl sm:text-4xl lg:text-5xl font-extrabold mt-1">
              Golf Tournament
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-xl text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Join founder Saied Mohammed for a premier 18-hole scramble classic celebrating love, community, and hope. 
            All proceeds directly support oncological research &amp; Red Cross patient relief.
          </motion.p>
        </div>

        {/* Key Event Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <div className="text-xs text-amber-200/80 uppercase font-semibold tracking-wider">Date</div>
            <div className="text-sm font-bold text-white mt-0.5">Mon, Oct 5, 2026</div>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <MapPin className="w-5 h-5 text-sky-400 mx-auto mb-1" />
            <div className="text-xs text-sky-200/80 uppercase font-semibold tracking-wider">Venue</div>
            <a
              href={EVENT_DETAILS.venue.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white mt-0.5 block hover:text-amber-200 transition underline-offset-2 hover:underline truncate"
            >
              {EVENT_DETAILS.venue.name}
            </a>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3.5 text-center shadow-md backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <div className="text-xs text-amber-200/80 uppercase font-semibold tracking-wider">Format</div>
            <div className="text-sm font-bold text-white mt-0.5">9:30 AM Scramble</div>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-2xl mx-auto"
        >
          <button
            onClick={() => openRegistrationModal('foursome')}
            className="px-6 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-orange-950/40 hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register Foursome</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openDonationModal(100)}
            className="px-5 py-3.5 bg-[#15381E] hover:bg-emerald-900 text-amber-200 hover:text-white border-2 border-[#D4AF37]/70 text-sm sm:text-base font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Make Memorial Gift</span>
          </button>

          <button
            onClick={openAgendaModal}
            className="px-4 py-3.5 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 hover:text-white border border-[#D4AF37]/60 text-xs sm:text-sm font-semibold rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
            <span>Agenda</span>
          </button>
        </motion.div>

        {/* Countdown Micro-Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 max-w-xl mx-auto bg-emerald-950/80 border border-[#D4AF37]/40 rounded-xl p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-[11px] uppercase font-bold tracking-widest text-[#D4AF37] flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tournament Countdown
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">Tee off: Mon, Oct 5, 2026</p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 py-1 min-w-[48px]">
                <span className="text-lg font-bold font-mono text-white">{timeLeft.days}</span>
                <span className="text-[9px] text-amber-200/80 uppercase font-semibold">Days</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-sm">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 py-1 min-w-[48px]">
                <span className="text-lg font-bold font-mono text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-amber-200/80 uppercase font-semibold">Hours</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-sm">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 py-1 min-w-[48px]">
                <span className="text-lg font-bold font-mono text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-amber-200/80 uppercase font-semibold">Mins</span>
              </div>
              <span className="text-[#D4AF37] font-bold text-sm">:</span>
              <div className="flex flex-col items-center bg-[#15381E] border border-emerald-700/80 rounded-lg px-2.5 py-1 min-w-[48px]">
                <span className="text-lg font-bold font-mono text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-amber-200/80 uppercase font-semibold">Secs</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
