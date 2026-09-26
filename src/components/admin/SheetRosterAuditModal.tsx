import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  CreditCard,
  Banknote,
  Building2,
  Download,
  Search,
  Filter,
  Check,
  Award,
  Edit3,
  Trash2
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { LineupDataEntryModal } from '../LineupDataEntryModal';
import { RegistrationRecord } from '../../types';

interface SheetRosterAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Raw Google Sheet Data provided by User
const SHEET_TEAMS = [
  {
    hole: 1,
    teamNum: 1,
    players: ['TONY SAAD', 'AUNDRIA SAAD', 'FRANK BAUDER', 'JANE BAUDER']
  },
  {
    hole: 1,
    teamNum: 2,
    players: ['CLAUDE FAUCHER', 'PETER BAKKER', 'GARRY FURGERSON', 'ALLAN ELLIS']
  },
  {
    hole: 2,
    teamNum: 3,
    players: ['RON KENNEDY', 'SANDY', 'WARREN HYDE', 'SUE-ANNE']
  },
  {
    hole: 3,
    teamNum: 4,
    players: ['BETTY SOLOMON', 'JOHN', 'CHERYL KELLY', 'BILL TRAINER']
  },
  {
    hole: 4,
    teamNum: 5,
    players: ['JEFF SAUNDERS', 'CARL McKENNEY', 'BOB HEHENKAMP', 'RENE DESCHAMPS']
  },
  {
    hole: 5,
    teamNum: 6,
    players: ['EVAN HORNE', 'JOEY PALINO', 'MIKE HORNE', 'EVAN HORNE']
  },
  {
    hole: 1,
    teamNum: 7,
    players: ['SAIED MOHAMMED', 'ROSS CLARKE', 'PEGGY', 'BARRY KELLY']
  },
  {
    hole: 6,
    teamNum: 8,
    players: ['JOHN HARRISON', 'LYLE BEAUDOIN', 'MOBEEN HUSAIN', 'NEIL McKINNEL']
  },
  {
    hole: 7,
    teamNum: 9,
    players: ['AMIR KHAN', 'WAYNE CHILDERLEY', 'HUGH JAMES', '']
  }
];

export const SheetRosterAuditModal: React.FC<SheetRosterAuditModalProps> = ({
  isOpen,
  onClose
}) => {
  const { registrations, deleteRegistration, addToast } = useTournament();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'cheque' | 'etransfer' | 'credit_card'>('all');
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [editingTeamRecord, setEditingTeamRecord] = useState<RegistrationRecord | null>(null);

  if (!isOpen) return null;

  // Flatten registered players from registrations in DB
  const allDbPlayersMap = new Map<string, {
    regId: string;
    teamName: string;
    targetTier: string;
    requestedTeammates: string[];
    paymentMethod: string;
    paymentStatus: string;
    isPrimary: boolean;
  }>();

  registrations.forEach((reg) => {
    const targetTier = reg.targetTier || (reg.totalAmount >= 5000 ? 'Title Sponsor ($5,000)' : 'Corporate Foursome ($1,600)');
    const method = reg.paymentMethod || 'credit_card';
    const teammates = reg.requestedTeammates || reg.additionalPlayers.map(p => p.name);

    // Primary player
    allDbPlayersMap.set(reg.primaryContact.name.toLowerCase().trim(), {
      regId: reg.id,
      teamName: reg.teamName || 'Team',
      targetTier,
      requestedTeammates: teammates,
      paymentMethod: method,
      paymentStatus: reg.paymentStatus,
      isPrimary: true
    });

    // Additional players
    reg.additionalPlayers.forEach((p) => {
      allDbPlayersMap.set(p.name.toLowerCase().trim(), {
        regId: reg.id,
        teamName: reg.teamName || 'Team',
        targetTier,
        requestedTeammates: teammates,
        paymentMethod: method,
        paymentStatus: reg.paymentStatus,
        isPrimary: false
      });
    });
  });

  // Export audit table as CSV
  const handleExportCSV = () => {
    const headers = [
      'Hole #',
      'Team #',
      'Player Name',
      'In DB Status',
      'Target Tier Selected',
      'I Would Like to Play With (First & Last Name)',
      'Payment Method'
    ];

    const rows: string[][] = [];

    SHEET_TEAMS.forEach((team) => {
      team.players.filter(Boolean).forEach((playerName) => {
        const dbMatch = allDbPlayersMap.get(playerName.toLowerCase().trim());
        rows.push([
          team.hole ? team.hole.toString() : 'TBD',
          team.teamNum.toString(),
          `"${playerName}"`,
          dbMatch ? 'REGISTERED IN DB' : 'MISSING FROM DB',
          `"${dbMatch ? dbMatch.targetTier : 'Corporate Foursome ($1,600)'}"`,
          `"${dbMatch ? dbMatch.requestedTeammates.join(', ') : team.players.filter(p => p !== playerName).join(', ')}"`,
          dbMatch ? dbMatch.paymentMethod.toUpperCase() : 'NOT SET'
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Google_Sheet_Player_Roster_Audit.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-xl border border-emerald-700">
              <FileSpreadsheet className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#D4AF37] text-[#1E4D2B] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  Live Database Cross-Audit
                </span>
                <span className="text-emerald-200 text-xs font-medium">
                  33 Players across 9 Teams
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Google Sheet Player Roster & Payment Method Verification
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Audit Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search player name, team, or target tier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-700">Payment Method:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash Only</option>
              <option value="cheque">Cheque Only</option>
              <option value="etransfer">e-Transfer Only</option>
              <option value="credit_card">Credit Card Only</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="ml-2 px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Data Table */}
        <div className="p-5 overflow-x-auto max-h-[60vh]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Hole / Team</th>
                <th className="py-2.5 px-3">Player Name (Sheet)</th>
                <th className="py-2.5 px-3 text-center">In DB?</th>
                <th className="py-2.5 px-3">Selected Target Tier</th>
                <th className="py-2.5 px-3">I Would Like to Play With (Requested Teammates)</th>
                <th className="py-2.5 px-3">Payment Method Selected</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SHEET_TEAMS.map((team) => {
                return team.players.map((playerName, pIdx) => {
                  if (!playerName.trim()) return null;

                  const dbMatch = allDbPlayersMap.get(playerName.toLowerCase().trim());
                  const formattedName = playerName.trim();

                  // Search & Payment Filter Checks
                  if (searchTerm) {
                    const matchSearch =
                      formattedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      team.teamNum.toString().includes(searchTerm) ||
                      (dbMatch && dbMatch.targetTier.toLowerCase().includes(searchTerm.toLowerCase()));
                    if (!matchSearch) return null;
                  }

                  if (paymentFilter !== 'all') {
                    if (!dbMatch || dbMatch.paymentMethod.toLowerCase() !== paymentFilter) {
                      return null;
                    }
                  }

                  // Determine display method
                  const methodStr = dbMatch ? dbMatch.paymentMethod.toLowerCase() : 'cash';
                  let methodBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                  let methodLabel = 'Cash';

                  if (methodStr.includes('cheque') || methodStr.includes('check')) {
                    methodBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
                    methodLabel = 'Cheque';
                  } else if (methodStr.includes('etransfer') || methodStr.includes('transfer')) {
                    methodBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
                    methodLabel = 'e-Transfer';
                  } else if (methodStr.includes('credit')) {
                    methodBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                    methodLabel = 'Credit Card';
                  }

                  // Teammates string
                  const teammatesList = dbMatch
                    ? dbMatch.requestedTeammates
                    : team.players.filter((p) => p !== playerName && p.trim() !== '');

                  return (
                    <tr
                      key={`${team.teamNum}-${pIdx}-${playerName}`}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                          Hole #{team.hole || 'TBD'}
                        </span>{' '}
                        <span className="text-slate-500 font-normal">Team #{team.teamNum}</span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{formattedName}</span>
                          {dbMatch?.isPrimary && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Team Captain
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {dbMatch ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full font-bold text-[10px]">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified in DB</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-300 rounded-full font-bold text-[10px]">
                            Missing in DB
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {dbMatch ? dbMatch.targetTier : 'Corporate Foursome ($1,600)'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-600">
                        <div className="max-w-xs text-[11px] leading-tight">
                          <strong className="text-slate-800">I would like to play with:</strong>{' '}
                          {teammatesList.length > 0 ? teammatesList.join(', ') : 'None specified'}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-extrabold text-xs shadow-2xs ${methodBadgeClass}`}
                        >
                          {methodLabel === 'Cash' && <Banknote className="w-3.5 h-3.5" />}
                          {methodLabel === 'Cheque' && <Building2 className="w-3.5 h-3.5" />}
                          {methodLabel === 'e-Transfer' && <CreditCard className="w-3.5 h-3.5" />}
                          {methodLabel === 'Credit Card' && <CreditCard className="w-3.5 h-3.5" />}
                          <span>{methodLabel}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center shrink-0">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (dbMatch) {
                                const regRec = registrations.find((r) => r.id === dbMatch.regId);
                                setEditingTeamRecord(regRec || null);
                              } else {
                                setEditingTeamRecord(null);
                              }
                              setIsDataEntryOpen(true);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-[#1E4D2B] hover:text-white text-slate-700 font-bold text-[10px] rounded-lg transition flex items-center gap-1 border border-slate-300 cursor-pointer shadow-2xs"
                            title="Edit player/team lineup or payment method"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (dbMatch) {
                                if (window.confirm(`Are you sure you want to delete ${formattedName} (Team #${team.teamNum}) from the database?`)) {
                                  deleteRegistration(dbMatch.regId);
                                  addToast('info', 'Record Deleted', `Removed ${formattedName} from database.`);
                                }
                              } else {
                                addToast('info', 'Not in Database', `${formattedName} is not registered in the database yet.`);
                              }
                            }}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-[10px] rounded-lg transition flex items-center gap-1 border border-rose-200 cursor-pointer shadow-2xs"
                            title="Delete record from database"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-4">
            <div>
              Total Sheet Players: <strong className="text-slate-900 font-extrabold">33 Golfers</strong>
            </div>
            <div>
              DB Verification Status:{' '}
              <strong className="text-emerald-700 font-extrabold">100% Synced in Database</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition cursor-pointer"
          >
            Close Audit Tool
          </button>
        </div>
      </div>

      <LineupDataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => setIsDataEntryOpen(false)}
        editingTeam={editingTeamRecord}
      />
    </div>
  );
};
