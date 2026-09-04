import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Heart,
  Calendar,
  Award,
  QrCode,
  Shield,
  Menu,
  X,
  Users,
  HelpCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openDonationModal, setIsAdminOpen, isAdminAuthenticated } = useTournament();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminHovered, setAdminHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1E4D2B]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/30 py-2.5 sm:py-3'
          : 'bg-[#1E4D2B] border-b border-[#D4AF37]/20 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#8C5D12] p-[2px] shadow-md transition transform group-hover:scale-105 shrink-0">
            <div className="w-full h-full rounded-full bg-[#1E4D2B] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <div className="font-crest text-sm sm:text-base md:text-lg font-bold text-white tracking-wide leading-tight">
              Charity Golf Classic
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/95 font-medium tracking-wide flex items-center gap-1 leading-tight mt-0.5">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0 inline" />
              <span>In Memory of Naseem Mohammed</span>
            </p>
          </div>
        </button>

        {/* Desktop Nav Links - 6 Streamlined Links (No clumsy More dropdown) */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-semibold text-slate-100">
          <button
            onClick={() => scrollToSection('memorial')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>The Cause</span>
          </button>
          <button
            onClick={() => scrollToSection('schedule')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Tournament Info</span>
          </button>
          <button
            onClick={() => scrollToSection('sponsorships')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sponsors</span>
          </button>
          <button
            onClick={() => scrollToSection('squabbit')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span>Live Scoring</span>
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>Volunteer &amp; Contact</span>
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Desktop CTAs: Register to Play (Gold/White) + Donate (High-Vis Accent) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
          {/* CTA 1: Register to Play */}
          <button
            onClick={() => scrollToSection('register')}
            className="px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-[#0F2D17] bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] hover:brightness-105 border border-[#D4AF37] rounded-lg shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Register to Play</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F2D17]" />
          </button>

          {/* CTA 2: Donate ($100 Memorial Checkout Modal) */}
          <button
            onClick={() => openDonationModal(100)}
            className="px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-md transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
            <span>Donate</span>
          </button>

          {/* Tournament Director Portal Button (Admins Only) with Hover Popup */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setAdminHovered(true)}
            onMouseLeave={() => setAdminHovered(false)}
          >
            <button
              onClick={() => setIsAdminOpen(true)}
              onFocus={() => setAdminHovered(true)}
              onBlur={() => setAdminHovered(false)}
              title="Admins Only"
              className="p-2 rounded-lg text-amber-200/90 hover:text-white hover:bg-emerald-900/60 border border-emerald-700/50 transition cursor-pointer relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Admins Only"
              id="nav-admin-shield-button"
            >
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              {!isAdminAuthenticated ? (
                <Lock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-amber-300 bg-[#0F2D17] rounded-full p-0.5 border border-emerald-600" />
              ) : (
                <span className="w-2 h-2 absolute -top-0.5 -right-0.5 bg-emerald-400 rounded-full border border-[#0F2D17]" />
              )}
            </button>

            {/* Small popup on hover: Admins Only */}
            {adminHovered && (
              <div
                role="tooltip"
                id="admin-shield-popup"
                className="absolute top-full right-0 mt-2 z-50 pointer-events-none transition-all duration-150 transform translate-y-0 animate-in fade-in zoom-in-95"
              >
                <div className="relative px-2.5 py-1 bg-slate-950 text-white text-[11px] font-bold rounded-md shadow-2xl border border-amber-400/50 flex items-center gap-1.5 whitespace-nowrap">
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="tracking-wide">Admins Only</span>
                  {/* Arrow pointing up to shield */}
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-950 border-t border-l border-amber-400/50 rotate-45" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header Buttons (Brand on left, prominent Register CTA + Hamburger on right) */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => scrollToSection('register')}
            className="px-3 py-1.5 text-xs font-bold text-[#0F2D17] bg-gradient-to-r from-[#D4AF37] to-[#F6E8B6] border border-[#D4AF37] rounded-lg shadow-xs active:scale-95"
          >
            Register
          </button>
          <button
            onClick={() => openDonationModal(100)}
            className="px-2.5 py-1.5 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-xs"
          >
            Donate
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white hover:text-[#D4AF37] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer: 6 Streamlined links + Donate & Register CTAs */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#15381E] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1.5 text-sm font-medium text-slate-100">
            {/* 1. The Cause */}
            <button
              onClick={() => scrollToSection('memorial')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>The Cause</span>
            </button>

            {/* 2. Tournament Info */}
            <button
              onClick={() => scrollToSection('schedule')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Tournament Info</span>
            </button>

            {/* 3. Sponsors */}
            <button
              onClick={() => scrollToSection('sponsorships')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Sponsors</span>
            </button>

            {/* 4. Live Scoring */}
            <button
              onClick={() => scrollToSection('squabbit')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition text-amber-200"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Live Scoring</span>
            </button>

            {/* 5. Volunteer & Contact */}
            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Volunteer &amp; Contact</span>
            </button>

            {/* 6. FAQ */}
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-900/60 text-left transition"
            >
              <HelpCircle className="w-4 h-4 text-amber-200" />
              <span>FAQ</span>
            </button>
          </div>

          {/* Mobile Actions: Register to Play + Donate + Admin Portal */}
          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('register')}
              className="w-full py-2.5 text-sm font-bold text-center text-[#0F2D17] bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] border border-[#D4AF37] rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <span>Register to Play</span>
              <ArrowRight className="w-4 h-4 text-[#0F2D17]" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openDonationModal(100);
              }}
              className="w-full py-2.5 text-sm font-bold text-center text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>Donate ($100 Memorial Gift)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full py-2 text-xs font-semibold text-center text-amber-200 hover:text-white flex items-center justify-center gap-1.5 mt-1 border border-emerald-800/80 rounded-lg bg-emerald-950/40"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Admins Only (Director Portal)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
