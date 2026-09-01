import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS, SPONSORSHIP_PACKAGES } from '../data/initialData';
import { X, Shield, Users, Award, Heart, CheckCircle2, Download, Search, RefreshCw, DollarSign, QrCode, FileSpreadsheet } from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    registrations,
    sponsors,
    donations,
    totalRaised,
    totalGolfers,
    goalAmount,
    checkInPlayer,
    resetToDefaults,
    addToast
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'checkin' | 'golfers' | 'sponsors' | 'donations'>('checkin');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAdminOpen) return null;

  const handleExportCSV = () => {
    // Generate CSV content for golfers
    const headers = ['Confirmation Code', 'Type', 'Team Name', 'Primary Golfer', 'Email', 'Phone', 'Handicap', 'Mulligans', 'Raffles', 'Total Paid', 'Checked In', 'Cart', 'Hole'];
    const rows = registrations.map(r => [
      r.confirmationCode,
      r.type,
      r.teamName || 'Individual',
      `"${r.primaryContact.name}"`,
      r.primaryContact.email,
      r.primaryContact.phone,
      r.primaryContact.handicap || 'N/A',
      r.addons.mulligansCount,
      r.addons.rafflePacks10 * 10 + r.addons.rafflePacks25 * 25,
      r.totalAmount,
      r.checkedIn ? 'YES' : 'NO',
      r.assignedCart || 'Unassigned',
      r.assignedStartingHole || 1
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Saied_Golf_2026_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Roster Exported', 'Downloaded tournament golfer CSV successfully.');
  };

  const filteredRegistrations = registrations.filter(r =>
    r.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.teamName && r.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const checkedInCount = registrations.filter(r => r.checkedIn).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900 border border-emerald-600 text-amber-200">
                  Director Portal
                </span>
                <span className="text-xs text-slate-300">October 2026</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-white">
                Tournament Management & On-Site Check-in Desk
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold border border-emerald-600 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-50 border-b border-slate-200 text-xs p-4 gap-3 shrink-0">
          <div>
            <span className="text-slate-500 font-medium">Total Raised:</span>
            <div className="text-base font-extrabold font-mono text-[#1E4D2B]">
              ${totalRaised.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Goal Target:</span>
            <div className="text-base font-extrabold font-mono text-slate-900">
              ${goalAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Total Players:</span>
            <div className="text-base font-extrabold font-mono text-slate-900">
              {totalGolfers} Golfers
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Checked In:</span>
            <div className="text-base font-extrabold font-mono text-emerald-700">
              {checkedInCount} of {registrations.length} Teams
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'checkin'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Check-in Desk ({registrations.length})
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'sponsors'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sponsors ({sponsors.length})
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'donations'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donations ({donations.length})
            </button>
          </div>

          <div className="w-full sm:w-60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search player or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E4D2B]"
              />
            </div>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Check-in Desk */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Team / Contact</th>
                      <th className="py-2.5 px-3">Cart / Hole</th>
                      <th className="py-2.5 px-3">Inventory Included</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className={`hover:bg-slate-50 transition ${reg.checkedIn ? 'bg-emerald-50/40' : ''}`}>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              reg.checkedIn
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {reg.checkedIn ? 'Checked In' : 'Pending Arrival'}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-[#1E4D2B]">
                          {reg.confirmationCode}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{reg.primaryContact.name}</div>
                          <div className="text-[11px] text-slate-500">{reg.teamName || 'Individual Player'}</div>
                          <div className="text-[10px] text-slate-400">{reg.primaryContact.phone}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{reg.assignedCart || 'Cart #TBD'}</div>
                          <div className="text-[10px] text-slate-500">Starting Hole #{reg.assignedStartingHole || 1}A</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="space-x-1">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                              {reg.addons.mulligansCount} Mulligans
                            </span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                              {reg.addons.rafflePacks10 * 10 + reg.addons.rafflePacks25 * 25} Raffles
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => checkInPlayer(reg.id)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                              reg.checkedIn
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                : 'bg-[#1E4D2B] text-white hover:bg-emerald-900 shadow-sm'
                            }`}
                          >
                            {reg.checkedIn ? 'Undo Check-in' : 'Mark Checked In'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Sponsors */}
          {activeTab === 'sponsors' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sponsors.map((sp) => {
                      const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === sp.tier);
                      return (
                        <tr key={sp.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {sp.companyName}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 text-[10px]">
                              {pkg?.name || sp.tier}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div>{sp.contactName}</div>
                            <div className="text-[10px] text-slate-400">{sp.email}</div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#1E4D2B]">
                            ${pkg?.amount.toLocaleString() || '0'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Donations */}
          {activeTab === 'donations' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Donor</th>
                      <th className="py-2.5 px-3">Tribute Name</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Message</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.map((don) => (
                      <tr key={don.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {don.donorName}
                        </td>
                        <td className="py-3 px-3 text-rose-700 font-medium">
                          {don.tributeName || 'General'}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#1E4D2B]">
                          ${don.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-slate-600 italic max-w-xs truncate">
                          {don.message || '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {new Date(don.donatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={resetToDefaults}
            className="text-slate-500 hover:text-red-700 flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial</span>
          </button>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
