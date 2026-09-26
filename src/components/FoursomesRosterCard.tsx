import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Users, User, Mail, Phone, ShieldCheck, Search, Send, CheckCircle2, ChevronRight, Award, DollarSign, Clock, Edit3, PlusCircle, Calendar, Lock } from 'lucide-react';
import { RegistrationRecord } from '../types';
import { LineupDataEntryModal } from './LineupDataEntryModal';
import { formatNameTitleCase } from '../utils/textFormatting';

interface FoursomesRosterCardProps {
  title?: string;
  subtitle?: string;
  showSolicitationAction?: boolean;
  onSendSolicitation?: (primaryContactEmail: string, teamName?: string) => void;
  className?: string;
}

export const FoursomesRosterCard: React.FC<FoursomesRosterCardProps> = ({
  title = "Foursomes Management",
  subtitle = "2026 FBGT Line Up (Oct 5, 2026) & Primary Golfer Contacts",
  showSolicitationAction = true,
  onSendSolicitation,
  className = ""
}) => {
  const { registrations, openSponsorModal, openRegistrationModal, isAdminAuthenticated, setIsAdminOpen } = useTournament();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "member" | "other">("all");
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<RegistrationRecord | null>(null);

  // Filter registrations that are foursomes or have additional players
  const foursomes = registrations.filter((r) => {
    const isFoursomeType = r.type === 'foursome' || (r.additionalPlayers && r.additionalPlayers.length > 0);
    if (!isFoursomeType) return false;

    // Filter by classification rate
    if (filterType === "member" && r.golferType !== "member") return false;
    if (filterType === "other" && r.golferType === "member") return false;

    // Filter by search query
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchTeam = r.teamName?.toLowerCase().includes(q);
    const matchPrimaryName = r.primaryContact?.name?.toLowerCase().includes(q);
    const matchPrimaryEmail = r.primaryContact?.email?.toLowerCase().includes(q);
    const matchPrimaryPhone = r.primaryContact?.phone?.toLowerCase().includes(q);
    const matchOtherGolfers = r.additionalPlayers?.some(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    );

    return matchTeam || matchPrimaryName || matchPrimaryEmail || matchPrimaryPhone || matchOtherGolfers;
  });

  if (!isAdminAuthenticated) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ${className}`}>
        <div className="bg-gradient-to-r from-[#1E4D2B] via-[#15803D] to-[#0F2D17] p-6 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 font-bold text-[10px] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tournament Director Security Gate</span>
          </div>
          <h3 className="text-2xl font-extrabold font-serif-heading text-white">
            Foursomes Management &bull; Restricted Access
          </h3>
          <p className="text-xs text-emerald-100 max-w-lg mx-auto mt-2 leading-relaxed font-sans">
            Foursomes management data and team rosters are strictly confidential. Only authorized Tournament Directors (<strong>Saied Mohammed — ms_smnm@outlook.com</strong> &amp; <strong>Administrator — luc.valade@gmail.com</strong>) are permitted to view team line-ups and access the Add / Register Team data entry form.
          </p>
        </div>
        <div className="p-8 text-center bg-slate-50 space-y-4">
          <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
            Please log in with your Director Passcode or credentials to view the 2026 FBGT team lineups and manage player rosters.
          </p>
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="px-6 py-3 bg-[#1E4D2B] hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer border border-amber-400/30"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>Sign In to Access Foursomes Management</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ${className}`}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1E4D2B] via-[#15803D] to-[#0F2D17] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Digital Registration Card &bull; Foursomes</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif-heading text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Oct 5, 2026 &bull; {foursomes.length} Teams</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setEditingTeam(null);
                setIsDataEntryOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              title="Open Data Entry Form to add or edit team players"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add / Register Team</span>
            </button>
            <button
              type="button"
              onClick={() => openRegistrationModal('foursome')}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Register</span>
            </button>
          </div>
        </div>

        {/* Search & Classification Filter Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/70 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              type="text"
              placeholder="Search foursome name, primary contact name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-emerald-950/70 border border-emerald-700/80 rounded-xl text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#D4AF37] text-emerald-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              All Foursomes ({registrations.filter(r => r.type === 'foursome' || (r.additionalPlayers && r.additionalPlayers.length > 0)).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('member')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterType === 'member'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Members ($100/ea)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('other')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterType === 'other'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Others ($120/ea)
            </button>
          </div>
        </div>
      </div>

      {/* Foursomes List Grid */}
      <div className="p-5 sm:p-6">
        {foursomes.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Foursomes Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm ? "No foursome entries matched your search parameters." : "No foursome registrations recorded yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {foursomes.map((foursome, index) => {
              const isMemberTeam = foursome.golferType === 'member';
              const rateLabel = isMemberTeam ? "Member Foursome ($100/player)" : "Guest / Other Foursome ($120/player)";
              const totalPlayers = 1 + (foursome.additionalPlayers?.length || 0);

              return (
                <div
                  key={foursome.id || index}
                  className="bg-slate-50/80 hover:bg-emerald-50/30 border-2 border-slate-200 hover:border-[#1E4D2B] rounded-2xl p-5 transition-all duration-300 shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Team Name, Tee Time & Status Badge */}
                    <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#1E4D2B] text-amber-300 border border-amber-400/30">
                            Team #{foursome.teamNumber || (index + 1)}
                          </span>
                          <span className="text-[10px] font-extrabold font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-700" />
                            <span>Tee Time: {foursome.teeTime || '11:00'}</span>
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isMemberTeam
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {isMemberTeam ? '$100/ea' : '$120/ea'}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 font-serif-heading leading-snug">
                          {formatNameTitleCase(foursome.teamName) || `${formatNameTitleCase(foursome.primaryContact?.name)}'s Foursome`}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Code: <strong className="text-slate-800">{foursome.confirmationCode}</strong> &bull; {totalPlayers} Golfers
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          foursome.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {foursome.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                        <div className="text-xs font-mono font-bold text-[#1E4D2B]">
                          ${foursome.totalAmount ? foursome.totalAmount.toLocaleString() : (isMemberTeam ? '400' : '480')} CAD
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTeam(foursome);
                            setIsDataEntryOpen(true);
                          }}
                          className="px-2 py-1 bg-slate-200 hover:bg-[#1E4D2B] hover:text-white text-slate-700 font-bold text-[10px] rounded-md transition flex items-center gap-1 cursor-pointer"
                          title="Edit players or tee time in Data Entry Form"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    {/* Primary Golfer Details (Contact) * */}
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-700/30 shadow-xs mb-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#1E4D2B] uppercase tracking-wider border-b border-emerald-100 pb-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          Primary Golfer Details (Contact) *
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-semibold">
                          Main Point of Contact
                        </span>
                      </div>

                      <div className="text-sm font-extrabold text-slate-900 leading-tight">
                        {formatNameTitleCase(foursome.primaryContact?.name) || "Name Not Specified"}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 font-sans pt-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a href={`mailto:${foursome.primaryContact?.email}`} className="hover:text-emerald-800 hover:underline truncate font-medium">
                            {foursome.primaryContact?.email || "No Email"}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a href={`tel:${foursome.primaryContact?.phone}`} className="hover:text-emerald-800 hover:underline truncate font-mono">
                            {foursome.primaryContact?.phone || "No Phone"}
                          </a>
                        </div>
                      </div>

                      {(foursome.primaryContact?.handicap || foursome.primaryContact?.shirtSize) && (
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-3">
                          {foursome.primaryContact?.handicap && <span>Handicap: <strong>{foursome.primaryContact.handicap}</strong></span>}
                          {foursome.primaryContact?.shirtSize && <span>Shirt: <strong>{foursome.primaryContact.shirtSize}</strong></span>}
                        </div>
                      )}
                    </div>

                    {/* Other Golfers in Foursome */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                        <span>Names of the Other Golfers:</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {foursome.additionalPlayers?.length || 0} Teammates Recorded
                        </span>
                      </div>

                      {(!foursome.additionalPlayers || foursome.additionalPlayers.length === 0) ? (
                        <div className="text-xs italic text-slate-400 bg-white/60 p-2.5 rounded-lg border border-slate-200">
                          No additional teammate names listed yet (Individual golfers will be paired at shotgun start).
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {foursome.additionalPlayers.map((player, pIdx) => (
                            <div
                              key={player.id || pIdx}
                              className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {pIdx + 2}
                                </span>
                                <span className="font-bold text-slate-900 truncate">
                                  {formatNameTitleCase(player.name)}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
                                {player.email && (
                                  <a href={`mailto:${player.email}`} className="hover:text-emerald-800 truncate max-w-[120px] hidden sm:inline" title={player.email}>
                                    {player.email}
                                  </a>
                                )}
                                {player.phone && (
                                  <span className="font-mono text-[10px]">{player.phone}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-slate-500">
                      Fee Allocation: <strong className="text-emerald-800">$30 Charity Donation</strong> per player
                    </div>

                    <div className="flex items-center gap-2">
                      {showSolicitationAction && onSendSolicitation && (
                        <button
                          type="button"
                          onClick={() => onSendSolicitation(foursome.primaryContact?.email, foursome.teamName)}
                          className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                          title="Open Corporate Sponsor & Donation Solicitation Letter for this Foursome"
                        >
                          <Send className="w-3 h-3 text-[#D4AF37]" />
                          <span>Solicitation Letter</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openSponsorModal('eagle')}
                        className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-lg border border-amber-300 transition flex items-center gap-1 cursor-pointer"
                        title="Sponsor this Foursome"
                      >
                        <Award className="w-3 h-3 text-amber-700" />
                        <span>Sponsor Team</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Data Entry Form Modal */}
      <LineupDataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => {
          setIsDataEntryOpen(false);
          setEditingTeam(null);
        }}
        editingTeam={editingTeam}
      />
    </div>
  );
};
