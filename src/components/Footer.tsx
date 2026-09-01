import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { Heart, Trophy, Shield, MapPin, Mail, Phone, ExternalLink, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAdminOpen, openDonationModal, openRegistrationModal } = useTournament();

  return (
    <footer className="bg-[#0D2414] text-slate-300 border-t border-[#D4AF37]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/80">
          {/* Col 1 & 2: Branding & Memorial Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-slate-950 font-black text-xl font-crest shadow-md">
                S
              </div>
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 font-sans block">
                  October 2026 Memorial Classic
                </span>
                <span className="font-serif-heading text-lg font-bold text-white tracking-tight">
                  Saied October Charity
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              An annual memorial golf tournament honoring the cherished memory of Amina Mohammed. 
              Uniting passionate golfers, corporate sponsors, and community friends to bring direct comfort and patient relief to families facing cancer diagnoses.
            </p>

            <div className="text-xs text-amber-200/90 font-medium flex items-center gap-1.5 pt-1">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
              <span>Benefiting {EVENT_DETAILS.beneficiaryOrg}</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
              Tournament Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition">Memorial Story & Mission</a>
              </li>
              <li>
                <a href="#register" className="hover:text-white transition">Golfer Registration</a>
              </li>
              <li>
                <a href="#sponsorships" className="hover:text-white transition">Sponsor Packages</a>
              </li>
              <li>
                <a href="#scoring" className="hover:text-white transition">Squabbit Live Leaderboard</a>
              </li>
              <li>
                <a href="#tributes" className="hover:text-white transition">Tribute & Memorial Book</a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-white transition">Schedule & Rules</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Event Logistics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
              Event Details
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {EVENT_DETAILS.venue.name}<br />
                  {EVENT_DETAILS.venue.address}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block text-[11px]">Date & Format:</span>
                <span className="font-semibold text-white">Friday, Sept 18, 2026</span>
                <span className="text-slate-400 block text-[11px]">8:30 AM Shotgun Start (4-Person Scramble)</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Live Scoring App:</span>
                <span className="font-mono text-emerald-400 font-bold">Squabbit Tournament App</span>
              </div>
            </div>
          </div>

          {/* Col 5: Tax Info & Director Access */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
              501(c)(3) Non-Profit
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              All contributions, sponsorships, and tournament gifts are tax-deductible to the fullest extent of the law. Tax ID: <strong>{EVENT_DETAILS.taxId}</strong>
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-full py-2 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 rounded-xl text-xs font-bold text-amber-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Director Portal & Check-in</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            &copy; 2026 {EVENT_DETAILS.name}. In Loving Memory of {EVENT_DETAILS.memorialHonoree}.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span>Powered by Squabbit Scoring</span>
            <span>&bull;</span>
            <button
              onClick={() => openDonationModal(100)}
              className="text-[#D4AF37] hover:underline cursor-pointer"
            >
              Make Memorial Donation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
