import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Heart,
  Calendar,
  Award,
  Shield,
  Menu,
  X,
  Users,
  HelpCircle,
  ArrowRight,
  Lock,
  ChevronDown,
  Target,
  BookOpen,
  HeartHandshake,
  Key,
  QrCode,
  LogOut
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { openDonationModal, setIsAdminOpen, isAdminAuthenticated, logoutAdmin, addToast, openApiKeyModal, openQrGeneratorModal } = useTournament();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close More menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      try {
        window.history.pushState(null, '', `#${id}`);
      } catch {
        // fallback
      }
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1E4D2B]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/30 py-2.5 sm:py-3'
          : 'bg-[#1E4D2B] border-b border-[#D4AF37]/20 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Logo + Links + Hamburger Toggle */}
        <div className="flex items-center justify-between gap-2 py-2">
          {/* Brand / Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none min-w-0 flex-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#8C5D12] p-[2px] shadow-md transition transform group-hover:scale-105 shrink-0">
              <div className="w-full h-full rounded-full bg-[#1E4D2B] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-crest text-[10.5px] sm:text-[12px] md:text-[13.5px] font-bold text-white tracking-wide leading-tight truncate sm:whitespace-normal">
                6th Annual Fragrant Breeze Golf Tournament
              </div>
              <p className="text-[10px] sm:text-xs text-amber-200/95 font-medium tracking-wide flex items-center gap-1 leading-tight mt-0.5 truncate">
                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 fill-rose-400 shrink-0 inline" />
                <span className="truncate">In Memory of Naseem Mohammed</span>
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs xl:text-sm font-semibold text-slate-100">
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
            {/* FAQ */}
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>FAQ</span>
            </button>

            {/* More Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer whitespace-nowrap py-1 font-semibold ${
                  moreMenuOpen ? 'text-[#D4AF37]' : 'text-slate-100'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreMenuOpen ? 'rotate-180 text-[#D4AF37]' : 'text-amber-200/80'
                  }`}
                />
              </button>
              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-2.5 w-64 bg-[#14381E] border border-[#D4AF37]/40 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-amber-200/60 border-b border-emerald-800/80 mb-1">
                    Additional Details
                  </div>
                  <button onClick={() => scrollToSection('memorial')} className="w-full text-left px-3.5 py-2 hover:bg-emerald-800/60 transition flex items-center gap-2.5 text-xs text-slate-100 hover:text-amber-200 group cursor-pointer">
                    <HeartHandshake className="w-4 h-4 text-rose-300 shrink-0" />
                    <div><div className="font-semibold">Our Cause &amp; Impact</div><div className="text-[10px] text-slate-300">Fund allocation &amp; charities</div></div>
                  </button>
                  <button onClick={() => scrollToSection('tributes')} className="w-full text-left px-3.5 py-2 hover:bg-emerald-800/60 transition flex items-center gap-2.5 text-xs text-slate-100 hover:text-amber-200 group cursor-pointer">
                    <BookOpen className="w-4 h-4 text-amber-200 shrink-0" />
                    <div><div className="font-semibold">Memorial Tribute Wall</div><div className="text-[10px] text-slate-300">Community notes of love</div></div>
                  </button>
                  <button onClick={() => scrollToSection('goal')} className="w-full text-left px-3.5 py-2 hover:bg-emerald-800/60 transition flex items-center gap-2.5 text-xs text-slate-100 hover:text-amber-200 group cursor-pointer">
                    <Target className="w-4 h-4 text-emerald-300 shrink-0" />
                    <div><div className="font-semibold">2026 Fundraising Goal</div><div className="text-[10px] text-slate-300">Campaign progress &amp; metrics</div></div>
                  </button>
                  <button onClick={() => { setMoreMenuOpen(false); openQrGeneratorModal(); }} className="w-full text-left px-3.5 py-2 hover:bg-emerald-800/60 transition flex items-center gap-2.5 text-xs text-amber-200 hover:text-white group cursor-pointer border-t border-emerald-800/80 mt-1">
                    <QrCode className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <div><div className="font-semibold">Branded QR Code Generator</div><div className="text-[10px] text-amber-200/80">Create vector &amp; PNG flyer QRs</div></div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTAs: Language Selector + Register + Donate */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Google Translate Language Selector */}
            <LanguageSelector />

            {/* Log Out Button (Left of Register) */}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  logoutAdmin();
                  addToast('info', 'Logged Out', 'You have been logged out of the Tournament Director portal.');
                }}
                className="px-3 py-2 text-xs xl:text-sm font-bold text-rose-200 bg-rose-950/80 hover:bg-rose-900 hover:text-white border border-rose-400/50 rounded-lg shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                title="Log Out of Director Portal"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
                <span>Log Out</span>
              </button>
            )}

            {/* CTA 1: Register to Play */}
            <button
              onClick={() => scrollToSection('register')}
              className="px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-[#0F2D17] bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] hover:brightness-105 border border-[#D4AF37] rounded-lg shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0F2D17]" />
            </button>

            {/* CTA 2: Donate */}
            <button
              onClick={() => openDonationModal(100)}
              className="px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-md transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
              <span>Donate</span>
            </button>
          </div>

          {/* Prominent Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden shrink-0 px-2.5 py-1.5 text-amber-300 hover:text-white bg-emerald-950/90 hover:bg-emerald-900 border border-[#D4AF37]/80 rounded-xl shadow-md focus:outline-none cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-95"
            aria-label="Toggle navigation menu"
            title="Open navigation menu"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-5 h-5 text-amber-300" />
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">Close</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5 text-amber-300" />
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Row 2 (Mobile ONLY): Quick Action CTAs */}
        <div className="lg:hidden border-t border-[#D4AF37]/30 pt-2 pb-0.5 mt-1 flex items-center justify-between sm:justify-center gap-2">
          {/* Log Out Button (Mobile, left of Register) */}
          {isAdminAuthenticated && (
            <button
              onClick={() => {
                logoutAdmin();
                addToast('info', 'Logged Out', 'You have been logged out of the Director portal.');
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-400/50 rounded-lg shadow-xs transition active:scale-95 whitespace-nowrap flex items-center gap-1"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Log Out</span>
            </button>
          )}

          {/* Register to Play */}
          <button
            onClick={() => scrollToSection('register')}
            className="px-3 py-1.5 text-xs font-bold text-[#0F2D17] bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] hover:brightness-105 border border-[#D4AF37] rounded-lg shadow-sm transition active:scale-95 whitespace-nowrap flex items-center gap-1"
          >
            <span>Register</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F2D17]" />
          </button>

          {/* Donate */}
          <button
            onClick={() => openDonationModal(100)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-md transition active:scale-95 whitespace-nowrap flex items-center gap-1"
          >
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
            <span>Donate</span>
          </button>
          
          <LanguageSelector />
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12331B] border-b-2 border-[#D4AF37]/60 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-100">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300/80 border-b border-emerald-800/80 mb-1">
              Main Menu
            </div>
            <button
              onClick={() => scrollToSection('memorial')}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-slate-100 hover:text-amber-200"
            >
              <Heart className="w-4 h-4 text-rose-300 shrink-0" />
              <span>The Cause &amp; Memorial Story</span>
            </button>
            <button
              onClick={() => scrollToSection('schedule')}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-slate-100 hover:text-amber-200"
            >
              <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Tournament Schedule &amp; Agenda</span>
            </button>
            <button
              onClick={() => scrollToSection('register')}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-slate-100 hover:text-amber-200"
            >
              <Users className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Registration &amp; Guest Passes</span>
            </button>
            <button
              onClick={() => scrollToSection('sponsorships')}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-slate-100 hover:text-amber-200"
            >
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Corporate Sponsorship Packages</span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-slate-100 hover:text-amber-200"
            >
              <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>FAQ &amp; Course Guidelines</span>
            </button>

            {/* Additional Features Section */}
            <div className="pt-2 mt-2 border-t border-emerald-800/80">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300/80 border-b border-emerald-800/80 mb-1">
                More Tournament Highlights
              </div>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => scrollToSection('tributes')}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-xs text-slate-200 hover:text-amber-200"
                >
                  <BookOpen className="w-4 h-4 text-amber-200 shrink-0" />
                  <span>Memorial Tribute Wall</span>
                </button>
                <button
                  onClick={() => scrollToSection('goal')}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-xs text-slate-200 hover:text-amber-200"
                >
                  <Target className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>2026 Fundraising Goal &amp; Tracker</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openQrGeneratorModal();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-900/80 text-left transition text-xs text-amber-300 font-bold"
                >
                  <QrCode className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Branded QR Code Generator</span>
                </button>
              </div>
            </div>

            {/* Admin Director Portal */}
            <div className="pt-3 border-t border-emerald-800/80 mt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-center text-amber-200 hover:text-white flex items-center justify-center gap-2 border border-[#D4AF37]/50 rounded-lg bg-emerald-950/80 active:bg-emerald-900 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <Lock className="w-3 h-3 text-amber-300" />
                <span>{isAdminAuthenticated ? 'Tournament Director Portal' : 'Admins Only (Director Portal)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
