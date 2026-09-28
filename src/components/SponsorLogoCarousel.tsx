import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import { SPONSORSHIP_PACKAGES } from '../data/initialData';
import { SponsorRecord, SponsorTier } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Globe,
  ShieldCheck,
  Pause,
  Play,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface SponsorLogoCarouselProps {
  className?: string;
}

export const SponsorLogoCarousel: React.FC<SponsorLogoCarouselProps> = ({ className = '' }) => {
  const { sponsors, openSponsorModal } = useTournament();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Ensure we have sponsors to show
  const activeSponsors = sponsors.length > 0 ? sponsors : [];

  // Helper to map sponsor tier to package details
  const getPackageDetails = (tier: SponsorTier) => {
    const pkg = SPONSORSHIP_PACKAGES.find((p) => p.id === tier);
    if (pkg) return pkg;
    switch (tier) {
      case 'presenting':
        return { name: 'Presenting Title Partner', amount: 10000, badgeColor: 'bg-amber-100 text-amber-950 border-amber-400' };
      case 'eagle':
        return { name: 'Memorial Eagle Sponsor', amount: 5000, badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400' };
      case 'birdie':
        return { name: 'Birdie Foursome Sponsor', amount: 2500, badgeColor: 'bg-blue-100 text-blue-950 border-blue-400' };
      case 'hole':
        return { name: 'Hole & Tee Box Sponsor', amount: 500, badgeColor: 'bg-[#D4AF37]/20 text-emerald-950 border-[#D4AF37]' };
      case 'contest':
        return { name: 'Putting & Contest Sponsor', amount: 300, badgeColor: 'bg-purple-100 text-purple-950 border-purple-300' };
      default:
        return { name: 'Corporate Sponsor', amount: 1000, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  // Auto-slide interval (3.5 seconds)
  useEffect(() => {
    if (isPaused || activeSponsors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, activeSponsors.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSponsors.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
  };

  // Swipe gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (activeSponsors.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 text-center">
        <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
        <h4 className="text-base font-bold text-slate-900">Corporate Partners Directory</h4>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          Become a featured partner for the 6th Annual Fragrant Breeze Classic.
        </p>
        <button
          onClick={() => openSponsorModal('eagle')}
          className="mt-4 px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition"
        >
          + Become a Corporate Sponsor
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#1E4D2B] via-[#15803D] to-[#0F2D17] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/40 relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-700/80 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Corporate Partners Directory</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-serif-heading text-white tracking-tight">
            Our Tournament Sponsors &amp; Brand Partners
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
            Click any corporate partner below to visit their official website and explore their community support.
          </p>
        </div>

        {/* Action & Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
            title={isPaused ? "Resume auto-play" : "Pause auto-play"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5 text-emerald-300" />}
            <span className="hidden sm:inline font-mono">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={() => openSponsorModal('eagle')}
            className="px-3.5 py-2 bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join as Sponsor</span>
          </button>
        </div>
      </div>

      {/* Main Carousel Display Area */}
      <div className="relative z-10 min-h-[220px]">
        {/* Navigation Buttons (Left & Right) */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-emerald-950/90 hover:bg-[#D4AF37] text-emerald-200 hover:text-emerald-950 border border-[#D4AF37]/50 shadow-xl transition active:scale-95 cursor-pointer"
          aria-label="Previous Sponsor"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-emerald-950/90 hover:bg-[#D4AF37] text-emerald-200 hover:text-emerald-950 border border-[#D4AF37]/50 shadow-xl transition active:scale-95 cursor-pointer"
          aria-label="Next Sponsor"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Visible Sponsor Cards Grid (Renders 3 visible cards with transition) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 sm:px-8">
          {[0, 1, 2].map((offset) => {
            const index = (currentIndex + offset) % activeSponsors.length;
            const sponsor: SponsorRecord = activeSponsors[index];
            if (!sponsor) return null;

            const pkg = getPackageDetails(sponsor.tier);
            const website = sponsor.websiteUrl || 'https://golfnorth.ca';
            const isFeatured = offset === 0;

            return (
              <a
                key={`${sponsor.id}-${index}-${offset}`}
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-emerald-950/80 hover:bg-emerald-900 border-2 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden cursor-pointer transform hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                    : 'border-emerald-700/60 hover:border-[#D4AF37]/80'
                }`}
              >
                {/* Outer Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top Sponsor Tier Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${pkg.badgeColor}`}>
                      {pkg.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Verified Partner</span>
                    </span>
                  </div>

                  {/* Company Logo / Crest Box */}
                  <div className="w-full h-20 bg-emerald-900/90 rounded-xl border border-emerald-700/80 flex items-center justify-center p-3 mb-3 group-hover:border-[#D4AF37]/80 transition">
                    {sponsor.logoUrl ? (
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.companyName}
                        className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm tracking-wide">
                        <Building2 className="w-6 h-6 text-[#D4AF37]" />
                        <span className="font-serif-heading line-clamp-1">{sponsor.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <h4 className="text-base font-extrabold text-white font-serif-heading group-hover:text-amber-300 transition line-clamp-1">
                    {sponsor.companyName}
                  </h4>

                  {/* Partnership Custom Note */}
                  {sponsor.customNote && (
                    <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2 italic font-normal">
                      &ldquo;{sponsor.customNote}&rdquo;
                    </p>
                  )}
                </div>

                {/* Visit Website CTA Footer */}
                <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-amber-300 font-bold group-hover:text-white transition">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-200">
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-emerald-950 font-extrabold group-hover:bg-amber-300 transition shadow-2xs">
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3 text-emerald-950" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Carousel Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
        {activeSponsors.map((s, idx) => (
          <button
            key={`dot-${s.id}-${idx}`}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-8 h-2 bg-[#D4AF37] shadow-sm'
                : 'w-2 h-2 bg-emerald-700/80 hover:bg-emerald-500'
            }`}
            title={`Go to slide ${idx + 1}: ${s.companyName}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
