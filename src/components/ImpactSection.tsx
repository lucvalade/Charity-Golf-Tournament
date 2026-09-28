import React, { useEffect, useRef, useState } from 'react';
import { IMPACT_DATA, EVENT_DETAILS } from '../data/initialData';
import { Heart, ShieldCheck, TrendingUp, HandHeart, Building, Activity, Sparkles, ArrowUpRight } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

// Helper component for Memorial Progress Metric Cards with mouseover and mobile in-view #1e4d2b background & white text
interface MetricCardProps {
  metric: {
    value: string;
    label: string;
    sub: string;
  };
  idx: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, idx }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Detect when in view on mobile devices
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger when at least 30% of card is in viewport on mobile
        if (window.innerWidth < 768) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
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
      className={`p-6 rounded-2xl border transition-all duration-300 text-center group cursor-pointer shadow-xs ${
        isInView
          ? 'bg-[#1E4D2B] text-white border-emerald-700 shadow-md transform -translate-y-1'
          : 'bg-white text-slate-900 border-slate-200 hover:bg-[#1E4D2B] hover:text-white hover:border-emerald-700 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-4 transition duration-300 ${
          isInView
            ? 'bg-white/15 border-white/20 text-[#D4AF37] scale-110'
            : 'bg-emerald-50 border-emerald-100 text-[#1E4D2B] group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-[#D4AF37] group-hover:scale-110'
        }`}
      >
        <TrendingUp className="w-6 h-6" />
      </div>
      <div
        className={`text-3xl font-extrabold font-mono tracking-tight transition-colors duration-300 ${
          isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
        }`}
      >
        {metric.value}
      </div>
      <div
        className={`text-sm font-bold mt-1 font-serif-heading transition-colors duration-300 ${
          isInView ? 'text-amber-300' : 'text-[#1E4D2B] group-hover:text-amber-300'
        }`}
      >
        {metric.label}
      </div>
      <p
        className={`text-xs mt-2 leading-relaxed transition-colors duration-300 ${
          isInView ? 'text-emerald-100' : 'text-slate-500 group-hover:text-emerald-100'
        }`}
      >
        {metric.sub}
      </p>
    </div>
  );
};

// Helper component for Memorial Allocation Cards with mouseover and mobile in-view #1e4d2b background & white text
interface AllocationCardProps {
  init: (typeof IMPACT_DATA.allocation)[0];
  idx: number;
  totalRaised: number;
  targetGoal: number;
}

const AllocationCard: React.FC<AllocationCardProps> = ({ init, idx, totalRaised, targetGoal }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth < 768) {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsInView(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const allocatedAmount = (totalRaised * init.percent) / 100;
  const targetAmount = (targetGoal * init.percent) / 100;
  const allocPct = Math.min(100, Math.round((allocatedAmount / targetAmount) * 100));

  const getInitiativeIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Activity className="w-5 h-5" />;
      case 1:
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 group cursor-pointer ${
        isInView
          ? 'bg-[#1E4D2B] text-white border-emerald-600 shadow-lg'
          : `bg-slate-50 hover:bg-[#1E4D2B] hover:text-white hover:border-emerald-600 hover:shadow-lg ${
              init.percent === 75 ? 'border-emerald-200' : 'border-rose-200'
            }`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors duration-300 ${
              isInView
                ? 'bg-white/15 border border-white/20 text-[#D4AF37]'
                : 'bg-white border border-slate-200 text-[#1E4D2B] group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-[#D4AF37]'
            }`}
          >
            {getInitiativeIcon(idx)}
          </div>
          <div>
            <h4
              className={`font-bold text-lg font-serif-heading transition-colors duration-300 ${
                isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
              }`}
            >
              {init.title} ({init.percent}%)
            </h4>
            <span
              className={`text-xs font-bold transition-colors duration-300 ${
                isInView
                  ? 'text-amber-300'
                  : init.percent === 75
                  ? 'text-emerald-700 group-hover:text-amber-300'
                  : 'text-rose-700 group-hover:text-amber-300'
              }`}
            >
              {init.percent}% of Tournament Net Funds
            </span>
          </div>
        </div>
      </div>

      <p
        className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
          isInView ? 'text-emerald-100' : 'text-slate-600 group-hover:text-emerald-100'
        }`}
      >
        {init.description}
      </p>

      {/* Dynamic split financial breakdown */}
      <div
        className={`pt-2 border-t space-y-2 transition-colors duration-300 ${
          isInView ? 'border-emerald-700/60' : 'border-slate-200/80 group-hover:border-emerald-700/60'
        }`}
      >
        <div className="flex justify-between items-baseline text-xs">
          <span
            className={`font-semibold transition-colors duration-300 ${
              isInView ? 'text-emerald-200' : 'text-slate-600 group-hover:text-emerald-200'
            }`}
          >
            Dynamic Live Allocation:
          </span>
          <span
            className={`font-mono font-bold text-sm transition-colors duration-300 ${
              isInView ? 'text-white' : 'text-slate-900 group-hover:text-white'
            }`}
          >
            ${Math.round(allocatedAmount).toLocaleString()} CAD
          </span>
        </div>

        <div
          className={`flex justify-between text-[11px] transition-colors duration-300 ${
            isInView ? 'text-emerald-200' : 'text-slate-500 group-hover:text-emerald-200'
          }`}
        >
          <span>100% of net proceeds directly distributed</span>
          <span
            className={`font-semibold transition-colors duration-300 ${
              isInView ? 'text-amber-300' : 'text-slate-700 group-hover:text-amber-300'
            }`}
          >
            {init.percent}% of Total Raised
          </span>
        </div>
      </div>
    </div>
  );
};

export const ImpactSection: React.FC = () => {
  const { totalRaised = 0, goalAmount = 2000, goalPercentage = 0, openDonationModal } = useTournament();
  const targetGoal = goalAmount || 2000;
  const percentage = goalPercentage || Math.min(100, Math.round(((totalRaised || 0) / targetGoal) * 100));

  return (
    <section id="impact" className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Our Cause & Charitable Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            How Every Dollar Changes Lives
          </h2>
          <p className="mt-3 text-base text-slate-600">
            100% of net tournament proceeds directly support Juravinski Breast Cancer Research (75%) and the Canadian Red Cross - Fire &amp; Flood (25%).
          </p>
        </div>

        {/* Real-time Progress Bar & Stats Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#1E4D2B] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                2026 Memorial Campaign Progress
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading">
                ${(totalRaised || 0).toLocaleString()} CAD Raised to Date
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Together, our community has pooled these vital resources to support Juravinski Breast Cancer Research (75%) and the Canadian Red Cross - Fire &amp; Flood (25%).
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => openDonationModal(100)}
                className="w-full py-3.5 px-6 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Make a Direct Memorial Donation</span>
              </button>
              <a
                href="#register"
                className="w-full py-3 px-6 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl border border-emerald-600 transition flex items-center justify-center gap-2 text-center"
              >
                <span>Register a Foursome Team</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {IMPACT_DATA.metrics.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} idx={idx} />
          ))}
        </div>

        {/* Fund Allocation Breakdown Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Transparent Stewardship
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-heading">
                How Your Support is Allocated &amp; Distributed
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                As money is raised, 100% of net proceeds are automatically allocated between our two vital charitable partners:
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#1E4D2B]" />
              <span>Official 501(c)(3) &amp; Canadian Charity Allocation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {IMPACT_DATA.allocation.map((init, idx) => (
              <AllocationCard
                key={idx}
                init={init}
                idx={idx}
                totalRaised={totalRaised}
                targetGoal={targetGoal}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
