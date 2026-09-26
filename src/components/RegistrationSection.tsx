import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Users, User, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { RegistrationModal } from './RegistrationModal';
import { DonationModal } from './DonationModal';
import { FoursomesRosterCard } from './FoursomesRosterCard';

function useMobileTabletInView(threshold = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
      { threshold, rootMargin: '0px 0px -40px 0px' }
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
  }, [threshold]);

  return { ref, isInView };
}

export const RegistrationSection: React.FC = () => {
  const {
    openRegistrationModal,
    openDonationModal,
    isRegModalOpen,
    setIsRegModalOpen,
    isInlineDonationOpen,
    setIsInlineDonationOpen,
    selectedRegType
  } = useTournament();
  const [selectedCard, setSelectedCard] = useState<'golf' | 'dinner' | 'donation'>('golf');

  const { ref: golfRef, isInView: isGolfInView } = useMobileTabletInView();
  const { ref: dinnerRef, isInView: isDinnerInView } = useMobileTabletInView();
  const { ref: donationRef, isInView: isDonationInView } = useMobileTabletInView();

  // Keep selectedCard synchronized if external buttons call openRegistrationModal
  useEffect(() => {
    if (isRegModalOpen) {
      if (selectedRegType === 'dinner_only') {
        setSelectedCard('dinner');
      } else {
        setSelectedCard('golf');
      }
    } else if (isInlineDonationOpen) {
      setSelectedCard('donation');
    }
  }, [isRegModalOpen, isInlineDonationOpen, selectedRegType]);

  const handleCardClick = (type: 'golf' | 'dinner' | 'donation') => {
    setSelectedCard(type);
    if (type === 'golf') {
      setIsInlineDonationOpen(false);
      openRegistrationModal('individual', 2);
    } else if (type === 'dinner') {
      setIsInlineDonationOpen(false);
      openRegistrationModal('dinner_only', 2);
    } else if (type === 'donation') {
      setIsRegModalOpen(false);
      setIsInlineDonationOpen(true);
      openDonationModal(100);
      setTimeout(() => {
        const el = document.getElementById('inline-donation-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const isGolfActive = (selectedCard === 'golf' && isRegModalOpen) || (isRegModalOpen && selectedRegType !== 'dinner_only');
  const isDinnerActive = (selectedCard === 'dinner' && isRegModalOpen) || (isRegModalOpen && selectedRegType === 'dinner_only');
  const isDonationActive = selectedCard === 'donation' && isInlineDonationOpen;

  const isGolfHighlighted = isGolfActive || isGolfInView;
  const isDinnerHighlighted = isDinnerActive || isDinnerInView;
  const isDonationHighlighted = isDonationActive || isDonationInView;

  return (
    <section id="register" className="py-20 bg-[#FBFBFA] relative scroll-mt-20">
      <div id="golfer-registration-inventory" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div id="golfer-registration" className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3 scroll-mt-24">
            <Users className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Golfer Registration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Golfer Registration
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every registration includes course green fee, golf cart, on-course refreshments, and awards dinner.
          </p>
        </div>

        {/* 3 Registration & Donation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Green Fee & Cart Package */}
          <div
            ref={golfRef}
            onClick={() => handleCardClick('golf')}
            style={
              isGolfHighlighted
                ? { border: '2px solid #000000', backgroundColor: '#1e4d2b' }
                : undefined
            }
            className={`rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              isGolfHighlighted
                ? 'bg-[#1e4d2b] border-2 border-black text-white shadow-2xl ring-2 ring-emerald-400/40'
                : 'bg-white border-2 border-[#1E4D2B] text-slate-900 hover:bg-[#1e4d2b] hover:text-white hover:border-black hover:shadow-2xl'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2 pt-1">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    isGolfHighlighted
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-emerald-50 border-emerald-200 text-[#1E4D2B] group-hover:bg-white/20 group-hover:border-white/40 group-hover:text-white'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`font-bold leading-tight transition-colors ${
                      isGolfHighlighted ? 'text-white' : 'text-slate-900 group-hover:text-white'
                    }`}
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Green Fee &amp; Cart Package
                    <span className="block font-bold text-xs text-amber-500 font-sans mt-0.5">- $100 Members &bull; - $120 Others</span>
                  </h3>
                  <p
                    className={`text-xs font-medium mt-0.5 transition-colors ${
                      isGolfHighlighted ? 'text-white/90' : 'text-slate-500 group-hover:text-white/90'
                    }`}
                  >
                    1 Golfer &bull; Green Fee &amp; Cart
                  </p>
                </div>
              </div>

              <div
                className={`my-4 pb-4 border-b transition-colors ${
                  isGolfHighlighted ? 'border-white/25' : 'border-slate-100 group-hover:border-white/25'
                }`}
              >
                <div
                  className={`font-extrabold font-mono transition-colors text-lg leading-snug ${
                    isGolfHighlighted ? 'text-white' : 'text-[#1E4D2B] group-hover:text-white'
                  }`}
                >
                  <div>- $100 Members</div>
                  <div>- $120 Others</div>
                </div>
                <span
                  className={`text-xs font-medium transition-colors block mt-1 ${
                    isGolfHighlighted ? 'text-white/80' : 'text-slate-500 group-hover:text-white/80'
                  }`}
                >
                  Per Player (Green Fee &amp; Cart)
                </span>
              </div>

              {/* 2-Sentence Marketing Text */}
              <p
                className={`text-xs mb-4 leading-relaxed transition-colors ${
                  isGolfHighlighted ? 'text-white' : 'text-slate-600 group-hover:text-white'
                }`}
              >
                Enjoy an 18-hole scramble with course green fee and golf cart included. Compete in contests before joining our awards dinner.
              </p>

              <div
                className={`space-y-2.5 mb-6 text-xs transition-colors ${
                  isGolfHighlighted ? 'text-white' : 'text-slate-700 group-hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isGolfHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>18-Hole Green Fee &amp; Cart Included</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isGolfHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>Full On-Course Contest Eligibility &amp; Prizes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isGolfHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>Turkey Dinner &amp; Awards Evening Admission</span>
                </div>
              </div>
            </div>

            <div
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 ${
                isGolfActive
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : isGolfInView
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : 'bg-emerald-50 text-[#1E4D2B] border border-emerald-200 group-hover:bg-white group-hover:text-[#1e4d2b] group-hover:border-black group-hover:shadow-sm'
              }`}
            >
              {isGolfActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1e4d2b]" />
                  <span>Form Open Below</span>
                </>
              ) : (
                <span>Click to Select Package</span>
              )}
            </div>
          </div>

          {/* Card 2: Dinner Guest Pass */}
          <div
            ref={dinnerRef}
            onClick={() => handleCardClick('dinner')}
            style={
              isDinnerHighlighted
                ? { border: '2px solid #000000', backgroundColor: '#1e4d2b' }
                : undefined
            }
            className={`rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              isDinnerHighlighted
                ? 'bg-[#1e4d2b] border-2 border-black text-white shadow-2xl ring-2 ring-emerald-400/40'
                : 'bg-white border border-slate-200 text-slate-900 hover:bg-[#1e4d2b] hover:text-white hover:border-black hover:shadow-2xl'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2 pt-1">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    isDinnerHighlighted
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-amber-50 border-amber-200 text-amber-800 group-hover:bg-white/20 group-hover:border-white/40 group-hover:text-white'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`font-bold leading-tight transition-colors ${
                      isDinnerHighlighted ? 'text-white' : 'text-slate-900 group-hover:text-white'
                    }`}
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Dinner Guest Pass
                    <span className="block font-bold">($60)</span>
                  </h3>
                  <p
                    className={`text-xs font-medium mt-0.5 transition-colors ${
                      isDinnerHighlighted ? 'text-white/90' : 'text-slate-500 group-hover:text-white/90'
                    }`}
                  >
                    Supporter &bull; Dinner &amp; Awards Banquet
                  </p>
                </div>
              </div>

              <div
                className={`my-4 pb-4 border-b flex items-baseline gap-2 transition-colors ${
                  isDinnerHighlighted ? 'border-white/25' : 'border-slate-100 group-hover:border-white/25'
                }`}
              >
                <span
                  className={`font-extrabold font-mono transition-colors ${
                    isDinnerHighlighted ? 'text-white' : 'text-slate-900 group-hover:text-white'
                  }`}
                  style={{ fontSize: '27px', lineHeight: '1.2' }}
                >
                  $60
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isDinnerHighlighted ? 'text-white/80' : 'text-slate-500 group-hover:text-white/80'
                  }`}
                >
                  Per Guest
                </span>
              </div>

              {/* 2-Sentence Marketing Text */}
              <p
                className={`text-xs mb-4 leading-relaxed transition-colors ${
                  isDinnerHighlighted ? 'text-white' : 'text-slate-600 group-hover:text-white'
                }`}
              >
                Join us for an inspiring evening celebrating Naseem Mohammed's legacy with an exceptional banquet dinner. Enjoy the awards presentations, charity auction, and meaningful community fellowship.
              </p>

              <div
                className={`space-y-2.5 mb-6 text-xs transition-colors ${
                  isDinnerHighlighted ? 'text-white' : 'text-slate-700 group-hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDinnerHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>Turkey dinner &amp; awards banquet access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDinnerHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>Silent auction &amp; charity raffle</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDinnerHighlighted ? 'text-white' : 'text-emerald-600 group-hover:text-white'
                    }`}
                  />
                  <span>Naseem Mohammed memorial tribute</span>
                </div>
              </div>
            </div>

            <div
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 ${
                isDinnerActive
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : isDinnerInView
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : 'bg-slate-100 text-slate-800 border border-slate-300 group-hover:bg-white group-hover:text-[#1e4d2b] group-hover:border-black group-hover:shadow-sm'
              }`}
            >
              {isDinnerActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1e4d2b]" />
                  <span>Form Open Below</span>
                </>
              ) : (
                <span>Click to Select Package</span>
              )}
            </div>
          </div>

          {/* Card 3: Donations Card */}
          <div
            ref={donationRef}
            onClick={() => handleCardClick('donation')}
            style={
              isDonationHighlighted
                ? { border: '2px solid #000000', backgroundColor: '#1e4d2b' }
                : undefined
            }
            className={`rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              isDonationHighlighted
                ? 'bg-[#1e4d2b] border-2 border-black text-white shadow-2xl ring-2 ring-emerald-400/40'
                : 'bg-white border-2 border-rose-300 text-slate-900 hover:bg-[#1e4d2b] hover:text-white hover:border-black hover:shadow-2xl'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2 pt-1">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    isDonationHighlighted
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-rose-50 border-rose-200 text-rose-600 group-hover:bg-white/20 group-hover:border-white/40 group-hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isDonationHighlighted
                        ? 'fill-white text-white'
                        : 'fill-rose-600 text-rose-600 group-hover:fill-white group-hover:text-white'
                    }`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-bold leading-tight transition-colors ${
                      isDonationHighlighted ? 'text-white' : 'text-slate-900 group-hover:text-white'
                    }`}
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Donations
                  </h3>
                  <p
                    className={`text-xs font-semibold mt-0.5 transition-colors ${
                      isDonationHighlighted ? 'text-white/90' : 'text-rose-700 group-hover:text-white/90'
                    }`}
                  >
                    Be Generous &bull; It’s for great causes
                  </p>
                </div>
              </div>

              <div
                className={`my-4 pb-4 border-b flex items-baseline gap-2 transition-colors ${
                  isDonationHighlighted ? 'border-white/25' : 'border-slate-100 group-hover:border-white/25'
                }`}
              >
                <span
                  className={`font-extrabold font-serif-heading transition-colors ${
                    isDonationHighlighted ? 'text-white' : 'text-rose-600 group-hover:text-white'
                  }`}
                  style={{ fontSize: '27px', lineHeight: '1.2' }}
                >
                  Be Generous
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isDonationHighlighted ? 'text-white/80' : 'text-slate-500 group-hover:text-white/80'
                  }`}
                >
                  Tax-Deductible
                </span>
              </div>

              {/* Exact Text Requested */}
              <p
                className={`text-xs mb-4 leading-relaxed transition-colors ${
                  isDonationHighlighted ? 'text-white' : 'text-slate-600 group-hover:text-white'
                }`}
              >
                Support cancer research and humanitarian relief for Naseem Mohammed. 100% of contributions fund patient care and family support.
              </p>

              <div
                className={`space-y-2.5 mb-6 text-xs transition-colors ${
                  isDonationHighlighted ? 'text-white' : 'text-slate-700 group-hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDonationHighlighted ? 'text-white' : 'text-rose-500 group-hover:text-white'
                    }`}
                  />
                  <span>100% of proceeds fund oncology care &amp; relief</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDonationHighlighted ? 'text-white' : 'text-rose-500 group-hover:text-white'
                    }`}
                  />
                  <span>Honoring the memory of Naseem Mohammed</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                      isDonationHighlighted ? 'text-white' : 'text-rose-500 group-hover:text-white'
                    }`}
                  />
                  <span>Official charitable tax receipt issued by Hamilton Health Sciences Foundation at tax time.</span>
                </div>
              </div>
            </div>

            <div
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 ${
                isDonationActive
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : isDonationInView
                  ? 'bg-white text-[#1e4d2b] border-2 border-black font-extrabold shadow-sm'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 group-hover:bg-white group-hover:text-[#1e4d2b] group-hover:border-black group-hover:shadow-sm'
              }`}
            >
              {isDonationActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1e4d2b]" />
                  <span>Form Open Below</span>
                </>
              ) : (
                <span>Click to Select Package</span>
              )}
            </div>
          </div>
        </div>

        {/* Inline Expanded Registration / Donation Container at 75% of Screen */}
        {isRegModalOpen && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <RegistrationModal
              inline={true}
              onClose={() => setIsRegModalOpen(false)}
            />
          </div>
        )}

        {isInlineDonationOpen && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <DonationModal
              inline={true}
              onClose={() => setIsInlineDonationOpen(false)}
            />
          </div>
        )}

        {/* Foursomes Management Section */}
        <div className="mt-12">
          <FoursomesRosterCard
            title="Foursomes Management"
            subtitle="Registered Foursome Teams, Primary Contacts & Teammate Rosters • October 2026"
          />
        </div>
      </div>
    </section>
  );
};

