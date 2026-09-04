import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, ExternalLink, RefreshCw, Trophy, Users, Check, Copy, Flame, Play, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SquabbitScoringSection: React.FC = () => {
  const { leaderboard, updateLeaderboardScore, addToast } = useTournament();
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState<'all' | 'scramble' | 'seniors'>('all');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'guide' | 'pairings'>('leaderboard');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.squabbitCode);
    setCopiedCode(true);
    addToast('info', 'Code Copied!', `Tournament code ${EVENT_DETAILS.squabbitCode} copied to clipboard.`);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSimulateHoleUpdate = () => {
    setIsSimulating(true);
    // pick a live team and simulate a birdie or eagle
    const liveTeams = leaderboard.filter(t => t.thruHoles < 18);
    const targetTeam = liveTeams.length > 0 ? liveTeams[Math.floor(Math.random() * liveTeams.length)] : leaderboard[0];

    setTimeout(() => {
      const isBirdie = Math.random() > 0.4;
      const scoreDelta = isBirdie ? -1 : -2;
      updateLeaderboardScore(targetTeam.squabbitId, scoreDelta, 1);
      setIsSimulating(false);
      addToast(
        'success',
        'Squabbit Live Score Posted!',
        `${targetTeam.teamName} carded a ${isBirdie ? 'Birdie (-1)' : 'Eagle (-2)'} on their latest hole!`
      );
    }, 600);
  };

  const filteredTeams = leaderboard.filter(team => {
    return team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.players.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <section id="squabbit" className="py-20 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
      <span id="scoring" className="block relative -top-24 invisible" />
      {/* Background design elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#111827]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
              <QrCode className="w-3.5 h-3.5" />
              <span>Official Tournament Scoring System</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-heading tracking-tight">
              Live Tournament Scoring via <span className="text-emerald-400">Squabbit</span>
            </h2>
            <p className="mt-3 text-base text-slate-300 max-w-2xl">
              We have partnered with <strong>Squabbit Golf</strong> for real-time live hole-by-hole scoring, digital scorecards, live GPS course yardages, and instant{' '}
              <a
                href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold inline-flex items-center gap-1"
              >
                <span>Leaderboard</span>
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>{' '}
              updates right from your smartphone.
            </p>
          </div>

          {/* Official App Store & Google Play Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Apple App Store Badge */}
            <a
              href="https://apps.apple.com/app/squabbit-golf/id1454178496"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-black hover:bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl text-white transition shadow-md group"
              title="Download Squabbit Golf on Apple App Store"
            >
              <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.94-12.04-14.58-6.19-9.5-11.07-20.73-14.64-33.68-3.57-12.96-5.36-24.63-5.36-35.01 0-14.57 3.66-26.4 10.97-35.48 7.32-9.08 16.48-13.73 27.5-13.97 4.58 0 9.8 1.25 15.66 3.76 5.86 2.5 9.53 3.82 11.01 3.94 1.83-.23 5.86-1.69 12.09-4.38 6.23-2.7 11.45-3.88 15.66-3.54 12.09.91 21.68 5.48 28.77 13.71-10.74 6.51-16 15.54-15.77 27.1.23 9.02 3.66 16.63 10.29 22.86 6.63 6.23 14.54 9.77 23.74 10.63-2.06 6.17-4.63 12.51-7.71 19.03zM119.22 33.64c0-7.31 2.66-14.23 7.97-20.74 5.31-6.51 11.83-10.74 19.54-12.69.23 1.14.34 2.17.34 3.09 0 7.31-2.77 14.34-8.31 21.09-5.54 6.74-12.11 10.97-19.71 12.69-.11-1.14-.17-2.3-.17-3.44z" />
              </svg>
              <div className="text-left leading-none">
                <div className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">Download on the</div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">App Store</div>
              </div>
            </a>

            {/* Google Play Store Badge */}
            <a
              href="https://play.google.com/store/apps/details?id=com.squabbit.squabbitgolf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-black hover:bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl text-white transition shadow-md group"
              title="Get Squabbit Golf on Google Play"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512">
                <path fill="#4285F4" d="M47.1 27.8C42.8 32.4 40 39.8 40 49.6v412.8c0 9.8 2.8 17.2 7.1 21.8l1.2 1.2 231.2-231.2v-5.6L48.3 26.6l-1.2 1.2z"/>
                <path fill="#FBBC04" d="M356.5 332.9l-77-77.3v-5.6l77-77.3 1.8 1 91.2 51.8c26 14.8 26 39 0 53.8l-91.2 51.8-1.8 1.8z"/>
                <path fill="#EA4335" d="M358.3 331.1L279.5 252.3 48.3 483.5c8.6 9.1 22.8 10.2 38.6 1.3l271.4-153.7"/>
                <path fill="#34A853" d="M358.3 174.5L86.9 20.8C71.1 11.9 56.9 13 48.3 22.1L279.5 253.3l78.8-78.8z"/>
              </svg>
              <div className="text-left leading-none">
                <div className="text-[8px] uppercase tracking-wider text-slate-300 font-medium">GET IT ON</div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Main Squabbit Grid: QR Code & Code Card (Left) + Interactive Leaderboard Frame (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: QR Code & On-course Access */}
          <div className="lg:col-span-4 space-y-6">
            {/* QR Code Pass Card */}
            <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-center">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Instant On-Course Scan
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-300 font-mono">
                  Squabbit Pro
                </span>
              </div>

              {/* QR Box */}
              <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto mb-4">
                <QRCodeSVG
                  value={EVENT_DETAILS.squabbitUrl}
                  size={170}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <p className="text-xs text-slate-300 font-medium mb-4">
                Scan with your phone camera on the practice range or tee box to open the tournament directly in Squabbit.
              </p>

              {/* Tournament Code Banner */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Tournament Join Code</div>
                  <div className="text-lg font-extrabold font-mono text-[#D4AF37] tracking-wider">
                    {EVENT_DETAILS.squabbitCode}
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick 3-Step Scoring Guide Card */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                How to Score in 3 Easy Steps
              </h4>
              <ol className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Download & Open Squabbit</strong> (iOS or Android) and click <em>"Join Tournament"</em>.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Enter Code {EVENT_DETAILS.squabbitCode}</strong> or scan the QR Code on your golf cart.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Assign 1 Scorer Per Foursome</strong> to enter gross scramble score after each hole.{' '}
                    <a
                      href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline font-semibold"
                    >
                      Leaderboard
                    </a>{' '}
                    updates instantly!
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Embedded Leaderboard Simulator Frame */}
          <div className="lg:col-span-8 bg-slate-800/95 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Simulated App Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black font-crest text-lg">
                  S
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Squabbit Live Feed • 18-Hole Scramble
                  </div>
                  <a
                    href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold text-white hover:text-[#D4AF37] transition inline-flex items-center gap-2 group"
                    title="Open live leaderboard at https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                  >
                    <span>Saied October Charity Classic Leaderboard</span>
                    <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-[#D4AF37] transition" />
                  </a>
                </div>
              </div>

              {/* Action: Open Live Leaderboard + Simulate Live Score update */}
              <div className="flex items-center gap-2">
                <a
                  href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#AA771C] text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Open live leaderboard at https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Squabbit Leaderboard</span>
                </a>
                <button
                  onClick={handleSimulateHoleUpdate}
                  disabled={isSimulating}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                  title="Simulate a real-time score entered by a player"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Syncing...' : 'Simulate Hole Score'}</span>
                </button>
              </div>
            </div>

            {/* Subheader / Tabs & Search */}
            <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      activeTab === 'leaderboard'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Leaderboard ({leaderboard.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('pairings')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      activeTab === 'pairings'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tee Times & Holes
                  </button>
                </div>

                <a
                  href="https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-300 hover:text-white transition inline-flex items-center gap-1 font-semibold hover:underline px-2 py-1"
                  title="Open Official Squabbit Tournament Leaderboard"
                >
                  <span>Official Web Leaderboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Search bar */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search team or golfer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Leaderboard Content Table */}
            {activeTab === 'leaderboard' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/60 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-16 text-center">Pos</th>
                      <th className="py-3 px-4">Team & Golfers</th>
                      <th className="py-3 px-3 text-center">To Par</th>
                      <th className="py-3 px-3 text-center">Thru</th>
                      <th className="py-3 px-3 text-center">Gross</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <AnimatePresence>
                      {filteredTeams.map((team, idx) => (
                        <motion.tr
                          key={team.squabbitId}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`hover:bg-slate-700/40 transition-colors ${
                            team.rank === 1 ? 'bg-amber-500/10' : idx % 2 === 0 ? 'bg-slate-800/40' : 'bg-transparent'
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-bold font-mono">
                            {team.rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D4AF37] text-slate-950 font-black shadow-sm">
                                1
                              </span>
                            ) : team.rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold">
                                2
                              </span>
                            ) : team.rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold">
                                3
                              </span>
                            ) : (
                              <span className="text-slate-400">T{team.rank}</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white flex items-center gap-2">
                              {team.teamName}
                              {team.rank === 1 && (
                                <Trophy className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] inline" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-1">
                              {team.players.map((player, pIdx) => (
                                <span key={pIdx} className="after:content-[','] last:after:content-[''] pr-1">
                                  {player}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`font-mono font-bold text-sm px-2.5 py-1 rounded-md ${
                                team.scoreToPar < 0
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : team.scoreToPar === 0
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {team.scoreToPar < 0 ? team.scoreToPar : team.scoreToPar === 0 ? 'E' : `+${team.scoreToPar}`}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-slate-300">
                            {team.thruHoles === 18 ? 'F (18)' : `${team.thruHoles}`}
                          </td>

                          <td className="py-3.5 px-3 text-center font-mono font-bold text-white text-sm">
                            {team.todayScore}
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                team.status === 'F'
                                  ? 'bg-slate-700 text-slate-300'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                              }`}
                            >
                              {team.status === 'F' ? 'Completed' : 'Live on Course'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              /* Pairings & Shotgun Hole Assignments */
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Shotgun Start: <strong>8:30 AM Sharp</strong></span>
                  <span>Format: <strong>4-Person Scramble</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {leaderboard.map((team, idx) => (
                    <div
                      key={team.squabbitId}
                      className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{team.teamName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Golfers: {team.players.join(', ')}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold px-2 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-lg">
                          Hole #{team.startingHole}A
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated App Footer Bar */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Live Squabbit API Sync Active &bull; Auto-refreshed</span>
              </div>
              <a
                href={EVENT_DETAILS.squabbitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Open in Squabbit Web <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
