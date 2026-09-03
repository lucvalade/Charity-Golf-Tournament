import React, { useState } from 'react';
import { TOURNAMENT_SCHEDULE, EVENT_DETAILS } from '../data/initialData';
import { useTournament } from '../context/TournamentContext';
import { Calendar, Clock, MapPin, Coffee, Heart, Flag, Trophy, Compass, CloudSun, ShieldCheck, ChevronRight, CheckCircle2, CalendarDays, ExternalLink } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'course' | 'rules'>('schedule');
  const { openAgendaModal } = useTournament();

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
      title: 'Gross & Net Flights',
      desc: 'Teams will compete in both Gross and Net divisions. Official USGA/GHIN handicaps will be factored for the Net flight awards.'
    },
    {
      title: 'Mulligans & Skills Rules',
      desc: 'Mulligans may be used anywhere on the course except on contest holes for prize eligibility. Maximum 2 mulligans per player on putting greens.'
    },
    {
      title: 'Hole-in-One Luxury Car Prize',
      desc: 'Sponsored hole on Par 3 #14 featuring a brand new luxury vehicle prize for the first verified ace of the morning!'
    }
  ];

  return (
    <section id="schedule" className="py-20 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Event Logistics & Itinerary</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Schedule of Events & Championship Course
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {EVENT_DETAILS.dateString} &bull; {EVENT_DETAILS.venue.name}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tournament Schedule
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`px-5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'course'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Venue & Course Guide
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-[#1E4D2B] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scramble Rules & Prizes
            </button>
          </div>
        </div>

        {/* TAB 1: Schedule Timeline */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {TOURNAMENT_SCHEDULE.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(item.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold font-mono text-[#1E4D2B] bg-emerald-100 px-2.5 py-0.5 rounded-full self-start">
                      {item.time}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-2 font-serif-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.time.includes('11:00') ? (
                      <>
                        Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow) with live{' '}
                        <a
                          href="https://squabbitgolf.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline hover:text-emerald-900 font-semibold"
                        >
                          Squabbit scoring app
                        </a>
                        .
                      </>
                    ) : item.time.includes('4:00') ? (
                      <>
                        Dinner &amp; Donation option ($50-$60 to be finalized) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner,{' '}
                        <a
                          href="https://app.squabbitgolf.com/#z9"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline hover:text-emerald-900 font-semibold"
                        >
                          Squabbit live leaderboard
                        </a>{' '}
                        reveal, trophy presentations, raffle draws, and memorial fundraising recap.
                      </>
                    ) : (
                      item.description
                    )}
                  </p>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <button
                onClick={openAgendaModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] hover:bg-emerald-800 text-amber-200 hover:text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer border border-[#D4AF37]/50"
              >
                <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                <span>Open Game Day Agenda Overview</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Course & Venue Guide */}
        {activeTab === 'course' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#1E4D2B] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <a
                  href={EVENT_DETAILS.venue.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-amber-200 mb-2 inline-flex items-center gap-1.5 transition"
                  title="Visit Burford Golf Links Official Website"
                >
                  <Compass className="w-4 h-4" />
                  <span>Championship Golf Facility</span>
                  <ExternalLink className="w-3 h-3 text-amber-300" />
                </a>
                <div className="space-y-1.5">
                  <a
                    href={EVENT_DETAILS.venue.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2"
                    title="Visit Burford Golf Links Official Website"
                  >
                    <h3 className="text-2xl font-bold font-serif-heading text-white group-hover:text-amber-200 transition underline-offset-2 group-hover:underline">
                      {EVENT_DETAILS.venue.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-emerald-300 group-hover:text-amber-200 shrink-0" />
                  </a>
                  <a
                    href={EVENT_DETAILS.venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    title="Open venue location in Google Maps"
                  >
                    <p className="text-xs text-amber-200 flex items-center gap-1.5 group-hover:text-amber-100 transition">
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>{EVENT_DETAILS.venue.address}</span>
                      <span className="text-[10px] text-emerald-200 ml-1 underline font-semibold">(View on Google Maps ↗)</span>
                    </p>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-emerald-800/80 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-300">Course Rating / Slope:</span>
                    <div className="font-bold text-white font-mono mt-0.5">{EVENT_DETAILS.venue.courseRating}</div>
                  </div>
                  <div>
                    <span className="text-slate-300">Greens & Fairways:</span>
                    <div className="font-bold text-white mt-0.5">Bentgrass Greens • Bermuda Fairways</div>
                  </div>
                </div>
              </div>

              {/* Weather and amenities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">October Climate</div>
                    <div className="text-xs text-slate-500">Sunny 18°C &bull; 5mph Crisp Fall Breeze</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Dress Code</div>
                    <div className="text-xs text-slate-500">Collared Shirts & Soft Spikes Required</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Facility Amenities Included:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complimentary Driving Range & Putting Green Balls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GPS Interactive Fleet Golf Carts with USB Chargers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Locker Room & Shower Amenities Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clubhouse Pro Shop 20% Player Discount Day of Event</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: Rules & Contests */}
        {activeTab === 'rules' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {scrambleRules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1 font-serif-heading">
                  {rule.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
