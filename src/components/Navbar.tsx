import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Trophy, Heart, Calendar, Award, QrCode, Shield, Menu, X, Sparkles, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openRegistrationModal, openDonationModal, setIsAdminOpen } = useTournament();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? 'bg-[#1E4D2B]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/30 py-3'
          : 'bg-[#1E4D2B] border-b border-[#D4AF37]/20 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#8C5D12] p-[2px] shadow-md transition transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#1E4D2B] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-crest text-base md:text-lg font-bold text-white tracking-wider">
                SAIED OCTOBER
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#1E4D2B] uppercase tracking-wider">
                2026
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium tracking-wide flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-300 fill-rose-300 inline" />
              Charity Golf Classic &bull; In Memory of Amina
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-medium text-slate-100">
          <button
            onClick={() => scrollToSection('memorial')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            About Us
          </button>
          <button
            onClick={() => scrollToSection('schedule')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            Tournament Details
          </button>
          <button
            onClick={() => scrollToSection('sponsorships')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            Sponsorships
          </button>
          <button
            onClick={() => scrollToSection('squabbit')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer text-amber-300 font-semibold"
          >
            <QrCode className="w-3.5 h-3.5" />
            Live Scoring (Squabbit)
          </button>
          <button
            onClick={() => scrollToSection('impact')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            Our Cause / Impact
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(true)}
            title="Tournament Director Portal"
            className="p-2 rounded-lg text-amber-200/80 hover:text-white hover:bg-emerald-900/60 border border-emerald-700/50 transition cursor-pointer"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </button>

          <button
            onClick={() => openDonationModal(100)}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700 border border-[#D4AF37]/50 rounded-lg shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            <span>Make a Donation</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => openDonationModal(100)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 border border-[#D4AF37]/50 rounded-lg shadow-sm"
          >
            Donate
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#D4AF37] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#15381E] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-xl">
          <div className="grid grid-cols-1 gap-2 text-sm font-medium text-slate-100">
            <button
              onClick={() => scrollToSection('memorial')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              About Us (Memorial Mission)
            </button>
            <button
              onClick={() => scrollToSection('schedule')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              Tournament Details & Schedule
            </button>
            <button
              onClick={() => scrollToSection('sponsorships')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              Sponsorships
            </button>
            <button
              onClick={() => scrollToSection('squabbit')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-amber-300 font-semibold text-left"
            >
              <QrCode className="w-4 h-4" />
              Live Scoring (Squabbit Hub)
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              Our Cause & Impact
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              FAQ (Weather & Rules)
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-2 p-2 rounded hover:bg-emerald-900/60 text-left"
            >
              Contact & Volunteer
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openDonationModal(100);
              }}
              className="w-full py-2.5 text-sm font-semibold text-center text-white bg-emerald-800/90 hover:bg-emerald-700 border border-[#D4AF37]/50 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>Memorial Gift / Donation</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full py-2 text-xs font-medium text-center text-amber-200 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Tournament Director Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
