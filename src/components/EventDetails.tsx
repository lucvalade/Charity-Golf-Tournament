import React, { useState } from 'react';
import { TOURNAMENT_SCHEDULE, EVENT_DETAILS } from '../data/initialData';
import { useTournament } from '../context/TournamentContext';
import { printTournamentSchedulePdf } from '../utils/formatters';
import { ItineraryPdfModal } from './ItineraryPdfModal';
import { Calendar, Clock, MapPin, Coffee, Heart, Flag, Trophy, Compass, CloudSun, ShieldCheck, ChevronRight, CheckCircle2, CalendarDays, ExternalLink, Printer, User, Target, X, FileDown } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'course' | 'rules'>('schedule');
  const [isPrintPdfOpen, setIsPrintPdfOpen] = useState(false);
  const [isProximityOpen, setIsProximityOpen] = useState(false);
  const { openAgendaModal, openRegistrationModal } = useTournament();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'Flag': return <Flag className="w-5 h-5 text-emerald-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const scrambleRules = [
    {
      title: '6-6-6 Format (Swapping Partners Version)',
      desc: '18-hole competition split into three 6-hole rotations where players swap partners within their group. Details and official scorecards will follow during the 11:00 AM cart dispatch.'
    },
    {
      title: 'Gross & Net',
      desc: 'Teams will compete in Gross & Net Scores and this is not based on handicaps.'
    },
    {
      title: 'Mulligans',
      desc: 'On hole #15, eahc player is aloud only 1 mulligan and can be used anywhere on the hole. Therefore, maximum for the group is 4 mulligans'
    },
    {
      title: 'Hole-in-One',
      desc: 'Sponsored by Bari for $111.11 (based on his birthday)'
    }
  ];

  return (
    <section id="schedule" className="py-20 bg-white border-t border-slate-200 relative scroll-mt-20">
      <div id="logistics" className="-top-24 relative" />
      <div id="itinerary" className="-top-24 relative" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header / Event Logistics & Schedule Card */}
        <div className="bg-[#1a4426] text-white rounded-3xl p-6 sm:p-10 mb-12 shadow-xl border border-emerald-700/60 relative overflow-hidden text-center max-w-5xl mx-auto">
          {/* Subtle gold decorative pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Event Logistics &amp; Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-heading tracking-tight">
              Itinerary &amp; Championship Course
            </h2>
            <div className="mt-3 text-base text-emerald-100 flex flex-col sm:flex-row items-center justify-center sm:gap-1.5 font-medium">
              <span className="font-semibold text-white">Monday, October 5, 2026</span>
              <span className="hidden sm:inline text-emerald-300">&bull;</span>
              <span>Burford Golf Links Course</span>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-emerald-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Registration &amp; Warmup: <strong className="text-white font-mono">9:30 AM</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Shotgun Tee-off: <strong className="text-white font-mono">11:00 AM</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Turkey Dinner &amp; Awards: <strong className="text-white font-mono">4:00 PM</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 px-2">
          <div className="flex flex-wrap sm:flex-nowrap justify-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold gap-1 sm:gap-0 max-w-full">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg transition cursor-pointer text-center flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                activeTab === 'schedule'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tournament Schedule
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg transition cursor-pointer text-center flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                activeTab === 'course'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Venue &amp; Course Guide
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg transition cursor-pointer text-center flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                activeTab === 'rules'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scramble Rules &amp; Prizes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-register-golfer-itinerary"
              onClick={() => openRegistrationModal('individual', 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs sm:text-sm shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
              title="Register Golfer • Choose Registration Format"
            >
              <User className="w-4 h-4" />
              <span>Register Golfer</span>
            </button>
            <button
              id="btn-print-pdf"
              onClick={() => setIsPrintPdfOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1E4D2B] hover:text-emerald-900 font-bold text-xs sm:text-sm shadow-xs border-2 border-slate-300 hover:border-[#1E4D2B] transition cursor-pointer"
              title="Print PDF (8.5 x 11 Itinerary flyer)"
            >
              <Printer className="w-4 h-4 text-[#1E4D2B]" />
              <span>Itinerary PDF</span>
            </button>
            <button
              id="btn-proximity-holes"
              onClick={() => setIsProximityOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1E4D2B] hover:text-emerald-950 font-bold text-xs sm:text-sm shadow-xs border-2 border-emerald-300 hover:border-[#1E4D2B] transition cursor-pointer"
              title="View 2026 FBGT Proximity Holes &amp; Querky Rules"
            >
              <Target className="w-4 h-4 text-[#1E4D2B]" />
              <span>Proximity Holes</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Schedule Timeline */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {TOURNAMENT_SCHEDULE.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:bg-[#1a4426] hover:text-white hover:border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-start gap-5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#1E4D2B] group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs transition-all duration-300">
                  {getIcon(item.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold font-mono text-[#1a4426] bg-emerald-100 group-hover:bg-emerald-950 group-hover:text-white group-hover:border group-hover:border-[#D4AF37] hover:bg-[#1a4426] hover:text-white px-3 py-1 rounded-full self-start transition-all duration-300 shadow-2xs">
                      {item.time}
                    </span>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-200 flex items-center gap-1 transition-colors duration-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 group-hover:text-[#D4AF37] shrink-0 transition-colors duration-300" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mt-2 font-serif-heading transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 group-hover:text-emerald-100 mt-1.5 leading-relaxed transition-colors duration-300">
                    {item.time.includes('11:00') ? (
                      'Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow).'
                    ) : item.time.includes('4:00') ? (
                      'Dinner & Donation option ($60) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner, prizes and trophy presentations, and memorial fundraising recap.'
                    ) : (
                      item.description
                    )}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => openRegistrationModal('individual', 1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Register Golfer</span>
              </button>
              <button
                id="btn-print-pdf-bottom"
                onClick={() => setIsPrintPdfOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] hover:bg-emerald-800 text-amber-200 hover:text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer border border-[#D4AF37]/50"
                title="Print PDF (8.5 x 11 Itinerary)"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Itinerary PDF</span>
              </button>
              <button
                id="btn-proximity-holes-bottom"
                onClick={() => setIsProximityOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer border border-amber-600"
                title="View 2026 FBGT Proximity Holes &amp; Querky Rules"
              >
                <Target className="w-4 h-4 text-slate-950" />
                <span>Proximity Holes</span>
              </button>
              <button
                onClick={openAgendaModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer border-2 border-slate-300 hover:border-[#1E4D2B]"
              >
                <CalendarDays className="w-4 h-4 text-[#1E4D2B]" />
                <span>Open Game Day Agenda Overview</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Course & Venue Guide */}
        {activeTab === 'course' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#1E4D2B] text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="mb-4">
                  <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                    Championship Facility
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-heading text-white mt-0.5">
                    Burford Golf Links
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-100 font-medium">
                  <p>
                    <strong className="text-amber-200">Facility:</strong> Championship Facility Burford Golf Links
                  </p>
                  <p>
                    <strong className="text-amber-200">Address:</strong> 120 Golf Links Rd., Burford, ON
                  </p>
                  <p>
                    <strong className="text-amber-200">Layout:</strong> 18-Hole Layout (Par 71)
                  </p>
                  <p>
                    <strong className="text-amber-200">Turf:</strong> Bentgrass Greens • Bluegrass/Ryegrass Fairways
                  </p>
                  <p>
                    <strong className="text-amber-200">Men's Blue Tees:</strong> 66.3 / 116 (5,438 Yards)
                  </p>
                  <p>
                    <strong className="text-amber-200">Ladies' Blue Tees:</strong> 71.8 / 129 (5,438 Yards)
                  </p>
                </div>
              </div>

              {/* Weather and amenities: Center aligned mini cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-center text-center sm:text-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">October Climate</div>
                    <div className="text-xs text-slate-500">Sunny 18°C &bull; 5mph Crisp Fall Breeze</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-center text-center sm:text-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">Dress Code</div>
                    <div className="text-xs text-slate-500">Normal Golf Attire Required</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Amenities: Centered at vertical middle height compared to left column */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 self-center my-auto shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-center sm:text-left">
                Included Amenities
              </h4>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free range &amp; putting balls</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GPS carts with USB chargers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full locker room access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>20% pro shop player discount</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: Rules & Contests (Scramble rules & prizes) */}
        {activeTab === 'rules' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {scrambleRules.map((rule, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 hover:bg-[#1e4d2c] p-6 rounded-2xl border border-slate-200 hover:border-[#D4AF37] shadow-sm transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-[#D4AF37] text-[#1E4D2B] group-hover:text-slate-950 font-bold text-xs flex items-center justify-center mb-3 transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-white mb-1 font-serif-heading transition-colors duration-300">
                  {rule.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white leading-relaxed transition-colors duration-300">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itinerary 8.5" x 11" PDF Print & Preview Modal */}
      <ItineraryPdfModal
        isOpen={isPrintPdfOpen}
        onClose={() => setIsPrintPdfOpen(false)}
      />

      {/* Proximity Holes Modal */}
      {isProximityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#1E4D2B] text-white p-5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <Target className="w-5.5 h-5.5 text-amber-300" />
                <div>
                  <h3 className="text-lg font-bold font-serif-heading">Proximity Holes &amp; Contest Rules</h3>
                  <p className="text-[11px] text-emerald-200">6th Annual Fragrant Breeze Golf Tournament</p>
                </div>
              </div>
              <button
                onClick={() => setIsProximityOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-900/40 hover:bg-emerald-900/80 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm flex-1">
              {/* Alert box */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs font-semibold leading-relaxed">
                📢 <strong className="text-amber-900">NOTE FOR LADIES CTP:</strong> IF THE TAG IS NOT YET ON GREEN, WRITE YOUR NAME EVEN IF YOUR BALL IS IN THE ROUGH!
              </div>

              {/* Proximity Holes */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#1E4D2B] text-xs uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-600 rounded-full" />
                  Official Proximity Contests
                </h4>
                <div className="divide-y divide-slate-100 font-medium">
                  {[
                    { hole: 'Hole #2', desc: 'Closest to pin (LADIES)', tag: 'Ladies Only' },
                    { hole: 'Hole #5', desc: 'Closest to pin (both MEN & LADIES) - 2 TAGS', tag: 'Men & Ladies' },
                    { hole: 'Hole #7', desc: 'Closest to pin (MEN)', tag: 'Men Only' },
                    { hole: 'Hole #10', desc: 'Closest to squiggly rope (both MEN & LADIES) - 2 TAGS', tag: 'Specialty Pin' },
                    { hole: 'Hole #11', desc: 'Closest to pin (LADIES)', tag: 'Ladies Only' },
                    { hole: 'Hole #11', desc: 'HOLE IN ONE CHALLENGE (ALL) $111.11 sponsored by Bari M.', highlight: true },
                    { hole: 'Hole #13', desc: 'Closest to pin (MEN)', tag: 'Men Only' },
                    { hole: 'Hole #16', desc: 'Longest drive in fairway (MEN)', tag: 'Men Only' },
                    { hole: 'Hole #17', desc: 'Longest drive in fairway (LADIES)', tag: 'Ladies Only' },
                    { hole: 'Hole #18', desc: 'Longest PUTT (ALL)', tag: 'All Players' }
                  ].map((p, i) => (
                    <div key={i} className={`py-2.5 flex items-start sm:items-center justify-between gap-4 ${p.highlight ? 'bg-amber-50/70 px-2 rounded-lg border border-amber-100' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${p.highlight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                          {p.hole}
                        </span>
                        <span className={`text-[13px] ${p.highlight ? 'font-black text-amber-950' : 'text-slate-700'}`}>
                          {p.desc}
                        </span>
                      </div>
                      {p.tag && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                          {p.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Querky Holes */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-[#1E4D2B] text-xs uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
                  Querky Holes &amp; Side Games
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      hole: 'Hole #3',
                      title: "Team surprise awaits — RACK 'EM UP",
                      desc: "Each partner must hole out. Your score is Tee to green strokes + sum of all putts from each partner to hole."
                    },
                    {
                      hole: 'Hole #9',
                      title: "Worst Ball Putting",
                      desc: "Both players putt from the ball furthest from pin on the putting surface."
                    },
                    {
                      hole: 'Hole #15',
                      title: "Do or Die",
                      desc: "Each player allowed an optional mulligan anywhere on this hole. But once you hit a mulligan, the 1st shot no longer is in play. Keep track of mulligans (tie-breaker)."
                    }
                  ].map((q, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                          {q.hole}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{q.title}</h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-1">{q.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2">
              <a
                href="/2026 fbgt proximity holes.pdf"
                download="2026 fbgt proximity holes.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
                title="Download 2026 fbgt proximity holes.pdf"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Download PDF Flyer</span>
              </a>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition cursor-pointer"
                title="Print this sheet"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Rules</span>
              </button>
              <button
                onClick={() => setIsProximityOpen(false)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
