import React, { useEffect, useRef, useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { SPONSORSHIP_PACKAGES } from '../data/initialData';
import { Award, CheckCircle2, Star, Sparkles, Building2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { SponsorTier } from '../types';

interface SponsorPackageCardProps {
  pkg: (typeof SPONSORSHIP_PACKAGES)[0];
  onPledge: (tier: SponsorTier) => void;
}

const SponsorPackageCard: React.FC<SponsorPackageCardProps> = ({ pkg, onPledge }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Active on mobile and tablet (< 1024px)
        if (window.innerWidth < 1024) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsInView(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isPresenting = pkg.id === 'presenting';
  const isEagle = pkg.id === 'eagle';

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl flex flex-col justify-between transition-all duration-300 relative border p-6 sm:p-8 group cursor-pointer ${
        isInView
          ? 'bg-[#295636] text-white border-emerald-500 shadow-2xl transform -translate-y-1'
          : `hover:bg-[#295636] hover:text-white hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 ${
              isPresenting
                ? 'border-[#D4AF37] bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 shadow-xl ring-2 ring-[#D4AF37]/50'
                : isEagle
                ? 'border-emerald-600/60 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-md'
            }`
      }`}
    >
      {/* Ribbon for Title */}
      {isPresenting && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 z-10">
          <Star className="w-3.5 h-3.5 fill-slate-950" />
          <span>Premier Title Partner</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3
            className={`text-xl font-bold font-serif-heading transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
            }`}
          >
            {pkg.name}
          </h3>
        </div>

        <p
          className={`text-xs min-h-[36px] mb-4 leading-relaxed transition-colors duration-300 ${
            isInView ? 'text-white/90' : 'text-slate-600 group-hover:text-white/90'
          }`}
        >
          {pkg.description}
        </p>

        <div
          className={`mb-6 pb-6 border-b flex items-baseline gap-2 transition-colors duration-300 ${
            isInView ? 'border-white/25' : 'border-slate-100 group-hover:border-white/25'
          }`}
        >
          <span
            className={`text-3xl sm:text-4xl font-extrabold font-mono transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-[#1E4D2B] group-hover:text-white'
            }`}
          >
            ${pkg.amount.toLocaleString()}
          </span>
          <span
            className={`text-xs font-semibold uppercase transition-colors duration-300 ${
              isInView ? 'text-white/80' : 'text-slate-500 group-hover:text-white/80'
            }`}
          >
            / Sponsor
          </span>
        </div>

        {/* Highlights / Inclusions */}
        <div className="space-y-3 mb-8">
          <div
            className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-slate-700 group-hover:text-white'
            }`}
          >
            Package Inclusions:
          </div>
          {pkg.benefits.map((benefit, bIdx) => (
            <div
              key={bIdx}
              className={`flex items-start gap-2.5 text-xs sm:text-sm leading-snug transition-colors duration-300 ${
                isInView ? 'text-white' : 'text-slate-700 group-hover:text-white'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 transition-colors duration-300 ${
                  isInView ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                }`}
              />
              <span>
                {benefit.includes('Leaderboard') ? (
                  <>
                    {benefit.split('Leaderboard')[0]}
                    <a
                      href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline font-semibold transition-colors duration-300 ${
                        isInView
                          ? 'text-white underline hover:text-amber-200'
                          : 'hover:text-emerald-700 group-hover:text-white group-hover:hover:text-amber-200'
                      }`}
                    >
                      Leaderboard
                    </a>
                    {benefit.split('Leaderboard')[1]}
                  </>
                ) : benefit.includes('leaderboards') ? (
                  <>
                    {benefit.split('leaderboards')[0]}
                    <a
                      href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline font-semibold transition-colors duration-300 ${
                        isInView
                          ? 'text-white underline hover:text-amber-200'
                          : 'hover:text-emerald-700 group-hover:text-white group-hover:hover:text-amber-200'
                      }`}
                    >
                      leaderboards
                    </a>
                    {benefit.split('leaderboards')[1]}
                  </>
                ) : (
                  benefit
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`pt-4 border-t transition-colors duration-300 ${
          isInView ? 'border-white/25' : 'border-slate-100 group-hover:border-white/25'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPledge(pkg.id as SponsorTier);
          }}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            isInView
              ? 'bg-white hover:bg-slate-100 text-[#295636] shadow-md font-extrabold'
              : `group-hover:bg-white group-hover:text-[#295636] group-hover:shadow-md ${
                  isPresenting
                    ? 'bg-[#D4AF37] hover:bg-[#b89528] text-slate-950 shadow-md'
                    : isEagle
                    ? 'bg-[#1E4D2B] hover:bg-emerald-900 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`
          }`}
        >
          <span>Pledge {pkg.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ConfirmedSponsorCardProps {
  sponsor: any;
  pkg?: (typeof SPONSORSHIP_PACKAGES)[0];
}

const ConfirmedSponsorCard: React.FC<ConfirmedSponsorCardProps> = ({ sponsor, pkg }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Active on mobile and tablet (< 1024px)
        if (window.innerWidth < 1024) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsInView(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`p-5 rounded-xl border shadow-sm transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
        isInView
          ? 'bg-[#295636] text-white border-emerald-600 shadow-md transform -translate-y-0.5'
          : 'bg-white border-slate-200 hover:bg-[#295636] hover:text-white hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors duration-300 ${
              isInView
                ? 'bg-white/20 text-white border-white/30'
                : 'bg-amber-100 text-amber-950 border-amber-300 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
            }`}
          >
            {pkg?.name || sponsor.tier}
          </span>
          <Building2
            className={`w-4 h-4 transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-slate-400 group-hover:text-white'
            }`}
          />
        </div>
        <h4
          className={`text-base font-bold transition-colors duration-300 ${
            isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
          }`}
        >
          {sponsor.companyName}
        </h4>
        {sponsor.customNote && (
          <p
            className={`text-xs italic mt-2 transition-colors duration-300 ${
              isInView ? 'text-white/90' : 'text-slate-600 group-hover:text-white/90'
            }`}
          >
            "{sponsor.customNote}"
          </p>
        )}
      </div>

      <div
        className={`mt-4 pt-3 border-t flex items-center justify-between text-xs transition-colors duration-300 ${
          isInView
            ? 'border-white/25 text-white/80'
            : 'border-slate-100 text-slate-500 group-hover:border-white/25 group-hover:text-white/80'
        }`}
      >
        <span>Contact: {sponsor.contactName}</span>
        <span
          className={`font-semibold flex items-center gap-1 transition-colors duration-300 ${
            isInView ? 'text-white' : 'text-emerald-700 group-hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
        </span>
      </div>
    </div>
  );
};

export const SponsorshipsSection: React.FC = () => {
  const { sponsors, openSponsorModal } = useTournament();

  return (
    <section id="sponsorships" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sponsorship Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Sponsorship Packages
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Boost your brand while creating a life-saving impact. All packages feature prominent recognition, perks, and 100% tax-deductible contributions.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {SPONSORSHIP_PACKAGES.map((pkg) => (
            <SponsorPackageCard
              key={pkg.id}
              pkg={pkg}
              onPledge={openSponsorModal}
            />
          ))}
        </div>

        {/* Existing Confirmed Sponsors Wall */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Community Leadership
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif-heading mt-0.5">
                Our 2026 Memorial Tournament Partners
              </h3>
            </div>
            <button
              onClick={() => openSponsorModal('eagle')}
              className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Join as Corporate Sponsor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => {
              const pkg = SPONSORSHIP_PACKAGES.find((p) => p.id === sponsor.tier);
              return (
                <ConfirmedSponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  pkg={pkg}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
