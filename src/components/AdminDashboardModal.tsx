import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS, SPONSORSHIP_PACKAGES } from '../data/initialData';
import {
  X,
  Shield,
  Users,
  Award,
  Heart,
  CheckCircle2,
  Download,
  Search,
  RefreshCw,
  DollarSign,
  QrCode,
  FileSpreadsheet,
  Mail,
  Check,
  Clock,
  AlertCircle,
  FileText,
  Banknote,
  UserCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';

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
    updatePaymentStatus,
    resetToDefaults,
    addToast
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'checkin' | 'golfers' | 'sponsors' | 'donations'>('golfers');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cheque' | 'cash' | 'credit_card'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [expandedRegId, setExpandedRegId] = useState<string | null>(null);

  if (!isAdminOpen) return null;

  const handleExportCSV = () => {
    // Generate comprehensive CSV content for Luc Valade with every golfer & teammate
    const headers = [
      'Confirmation Code',
      'Registration Type',
      'Team Name',
      'Payment Method',
      'Payment Status',
      'Total Amount CAD',
      'Routed To Email',
      'Primary Golfer Name',
      'Primary Email',
      'Primary Phone',
      'Primary Handicap',
      'Primary Shirt Size',
      'Primary Dietary',
      'Teammate 2 Name',
      'Teammate 2 Email',
      'Teammate 2 Phone',
      'Teammate 2 Handicap',
      'Teammate 3 Name',
      'Teammate 3 Email',
      'Teammate 3 Phone',
      'Teammate 3 Handicap',
      'Teammate 4 Name',
      'Teammate 4 Email',
      'Teammate 4 Phone',
      'Teammate 4 Handicap',
      'Mulligans',
      '10-Raffle Packs',
      '25-Raffle Packs',
      'Putting Contest Entries',
      'Tiger Drive Entries',
      'Checked In',
      'Assigned Cart',
      'Assigned Hole',
      'Registered At'
    ];

    const rows = registrations.map((r) => {
      const p2 = r.additionalPlayers?.[0] || ({} as any);
      const p3 = r.additionalPlayers?.[1] || ({} as any);
      const p4 = r.additionalPlayers?.[2] || ({} as any);

      return [
        r.confirmationCode,
        r.type,
        `"${r.teamName || 'N/A'}"`,
        r.paymentMethod || 'credit_card',
        r.paymentStatus || 'paid',
        r.totalAmount,
        r.routedToEmail || 'ms_smnm@outlook.com',
        `"${r.primaryContact.name}"`,
        r.primaryContact.email,
        r.primaryContact.phone,
        r.primaryContact.handicap || 'N/A',
        r.primaryContact.shirtSize || 'N/A',
        `"${r.primaryContact.dietaryRestrictions || 'None'}"`,
        `"${p2.name || ''}"`,
        p2.email || '',
        p2.phone || '',
        p2.handicap || '',
        `"${p3.name || ''}"`,
        p3.email || '',
        p3.phone || '',
        p3.handicap || '',
        `"${p4.name || ''}"`,
        p4.email || '',
        p4.phone || '',
        p4.handicap || '',
        r.addons.mulligansCount,
        r.addons.rafflePacks10,
        r.addons.rafflePacks25,
        r.addons.puttingContestCount,
        r.addons.tigerDriveCount,
        r.checkedIn ? 'YES' : 'NO',
        r.assignedCart || 'Unassigned',
        r.assignedStartingHole || 1,
        `"${new Date(r.registeredAt).toISOString()}"`
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Luc_Valade_Admin_Golfers_Database_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Database CSV Exported', 'Full golfer and offline payment records exported for Luc Valade.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      admin: 'Luc Valade',
      founder: 'Saied Mohammed',
      contactEmail: 'ms_smnm@outlook.com',
      exportDate: new Date().toISOString(),
      registrations,
      sponsors,
      donations,
      summary: {
        totalRaised,
        goalAmount,
        totalGolfers
      }
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tournament_full_database_luc_valade_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('success', 'Database JSON Exported', 'Complete database exported for Administrator Luc Valade.');
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.primaryContact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.teamName && r.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.additionalPlayers &&
        r.additionalPlayers.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesPayment =
      paymentFilter === 'all' || r.paymentMethod === paymentFilter;

    const matchesStatus =
      statusFilter === 'all' || r.paymentStatus === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const pendingChequeCount = registrations.filter(
    (r) => (r.paymentMethod === 'cheque' || r.paymentMethod === 'cash') && r.paymentStatus === 'pending'
  ).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900 border border-emerald-600 text-amber-200">
                  Luc Valade Administrator Portal
                </span>
                <span className="text-xs text-slate-300">Central Tournament Database</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-white flex items-center gap-2">
                <span>Golfer Database &amp; Management Oversight</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold border border-emerald-600 transition cursor-pointer shadow-xs"
              title="Download full golfer CSV database"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-600 transition cursor-pointer shadow-xs"
              title="Backup entire database as JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-slate-50 border-b border-slate-200 text-xs p-4 gap-3 shrink-0">
          <div>
            <span className="text-slate-500 font-medium">Total Raised:</span>
            <div className="text-base font-extrabold font-mono text-[#1E4D2B]">
              ${totalRaised.toLocaleString()} CAD
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Fundraising Goal:</span>
            <div className="text-base font-extrabold font-mono text-slate-900">
              ${goalAmount.toLocaleString()} CAD
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Registered Golfers:</span>
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
          <div>
            <span className="text-slate-500 font-medium">Pending Cheque/Cash:</span>
            <div className={`text-base font-extrabold font-mono ${pendingChequeCount > 0 ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
              {pendingChequeCount} Pending
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('golfers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'golfers'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Golfer Database ({registrations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'checkin'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Check-in Desk ({checkedInCount}/{registrations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sponsors'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Sponsors ({sponsors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'donations'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Donations ({donations.length})</span>
            </button>
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search golfer, email, code, team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E4D2B]"
              />
            </div>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB: GOLFER DATABASE (LUC VALADE ADMIN ACCESS) */}
          {activeTab === 'golfers' && (
            <div className="space-y-4">
              {/* Notice Banner for Luc Valade & Saied Mohammed */}
              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold">
                    LV
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">
                      Luc Valade Central Administration View
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Tracking all registered golfers, full rosters, handicaps, add-ons, and payment routing to Saied Mohammed (
                      <a href="mailto:ms_smnm@outlook.com" className="text-[#1E4D2B] underline font-bold">
                        ms_smnm@outlook.com
                      </a>
                      ).
                    </p>
                  </div>
                </div>

                {/* Filter controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span>Payment:</span>
                  </div>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as any)}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="all">All Methods</option>
                    <option value="cheque">Cheque Only</option>
                    <option value="cash">Cash Only</option>
                    <option value="credit_card">Credit Card</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              {/* Registrations List / Table */}
              <div className="space-y-3">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    No registrations found matching the current search or filters.
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => {
                    const isExpanded = expandedRegId === reg.id;
                    const isOffline = reg.paymentMethod === 'cheque' || reg.paymentMethod === 'cash';

                    return (
                      <div
                        key={reg.id}
                        className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-xs overflow-hidden"
                      >
                        <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-[200px]">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                              {reg.type === 'foursome' ? (
                                <Users className="w-5 h-5 text-[#1E4D2B]" />
                              ) : reg.type === 'dinner_only' ? (
                                <Heart className="w-5 h-5 text-rose-600" />
                              ) : (
                                <Users className="w-5 h-5 text-blue-700" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {reg.primaryContact.name}
                                </h4>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                  {reg.confirmationCode}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                                <span>{reg.teamName || (reg.type === 'dinner_only' ? 'Dinner Guest' : 'Individual Player')}</span>
                                <span>&bull;</span>
                                <span className="font-mono">{reg.primaryContact.phone}</span>
                                <span>&bull;</span>
                                <span className="text-slate-600">{reg.primaryContact.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Method & Status Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Method Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                                reg.paymentMethod === 'cheque'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : reg.paymentMethod === 'cash'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {reg.paymentMethod === 'cheque' ? (
                                <>
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Cheque (Saied)</span>
                                </>
                              ) : reg.paymentMethod === 'cash' ? (
                                <>
                                  <Banknote className="w-3.5 h-3.5" />
                                  <span>Cash (Saied)</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Credit Card</span>
                                </>
                              )}
                            </span>

                            {/* Status Badge & Toggle Action for Luc Valade */}
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                                reg.paymentStatus === 'paid'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-500 text-white'
                              }`}
                            >
                              {reg.paymentStatus === 'paid' ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>PAID</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>PENDING</span>
                                </>
                              )}
                            </span>

                            {/* Amount */}
                            <span className="font-mono font-extrabold text-sm text-[#1E4D2B] px-2">
                              ${reg.totalAmount.toLocaleString()} CAD
                            </span>

                            {/* Payment Status Action Button for Luc Valade */}
                            <button
                              onClick={() => {
                                const newStatus = reg.paymentStatus === 'paid' ? 'pending' : 'paid';
                                updatePaymentStatus(reg.id, newStatus);
                                addToast(
                                  'success',
                                  'Payment Status Updated',
                                  `Registration ${reg.confirmationCode} set to ${newStatus.toUpperCase()}`
                                );
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                                reg.paymentStatus === 'paid'
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              }`}
                              title="Toggle payment received status"
                            >
                              {reg.paymentStatus === 'paid' ? 'Mark Pending' : 'Mark Payment Received'}
                            </button>

                            {/* Email Saied action if offline payment */}
                            {isOffline && (
                              <a
                                href={`mailto:ms_smnm@outlook.com?subject=${encodeURIComponent(
                                  `[Luc Valade Admin] Check on Payment for ${reg.primaryContact.name} (${reg.confirmationCode})`
                                )}&body=${encodeURIComponent(
                                  `Hi Saied,\n\nLuc Valade here following up on the ${reg.paymentMethod} payment of $${reg.totalAmount} CAD for ${reg.primaryContact.name} (Code: ${reg.confirmationCode}).\n\nPlease let me know once funds are collected so I can mark it as paid in the central database.\n\nThank you!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-500 hover:text-[#1E4D2B] rounded-lg hover:bg-slate-100 transition"
                                title="Contact Saied Mohammed regarding payment"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}

                            {/* Toggle Accordion */}
                            <button
                              onClick={() => setExpandedRegId(isExpanded ? null : reg.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                              aria-label="Toggle details"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded details view */}
                        {isExpanded && (
                          <div className="bg-slate-50/80 p-4 border-t border-slate-200 text-xs space-y-4">
                            {/* Routing & Admin Note */}
                            <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-slate-700">Notification Routing: </span>
                                <span className="font-mono text-[#1E4D2B] font-bold">
                                  {reg.routedToEmail || 'ms_smnm@outlook.com'} (Saied Mohammed)
                                </span>
                              </div>
                              <div className="text-slate-500">
                                Registration Date: <strong>{new Date(reg.registeredAt).toLocaleString()}</strong>
                              </div>
                            </div>

                            {/* Complete Golfer Roster */}
                            <div>
                              <h5 className="font-bold uppercase tracking-wider text-slate-600 text-[11px] mb-2 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#1E4D2B]" />
                                <span>Full Golfer Roster &amp; Player Specifications</span>
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Player 1 / Captain */}
                                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                                  <div className="flex justify-between items-center font-bold text-slate-900 pb-1 border-b border-slate-100">
                                    <span>Player #1 (Primary Contact / Captain)</span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                      Captain
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                                    <div>Name: <strong>{reg.primaryContact.name}</strong></div>
                                    <div>Handicap: <strong>{reg.primaryContact.handicap || 'None / Not Provided'}</strong></div>
                                    <div>Email: <strong className="font-mono">{reg.primaryContact.email}</strong></div>
                                    <div>Phone: <strong>{reg.primaryContact.phone}</strong></div>
                                    <div>Shirt Size: <strong>{reg.primaryContact.shirtSize || 'None'}</strong></div>
                                    <div>Dietary: <strong>{reg.primaryContact.dietaryRestrictions || 'None'}</strong></div>
                                  </div>
                                </div>

                                {/* Additional Players (2, 3, 4) */}
                                {reg.additionalPlayers && reg.additionalPlayers.length > 0 ? (
                                  reg.additionalPlayers.map((player, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                                      <div className="flex justify-between items-center font-bold text-slate-900 pb-1 border-b border-slate-100">
                                        <span>Player #{idx + 2}</span>
                                        <span className="text-[10px] text-slate-500">Roster Member</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                                        <div>Name: <strong>{player.name || 'TBD'}</strong></div>
                                        <div>Handicap: <strong>{player.handicap || 'None / Not Provided'}</strong></div>
                                        <div>Email: <strong className="font-mono">{player.email || 'N/A'}</strong></div>
                                        <div>Phone: <strong>{player.phone || 'N/A'}</strong></div>
                                        <div>Shirt Size: <strong>{player.shirtSize || 'None'}</strong></div>
                                        <div>Dietary: <strong>{player.dietaryRestrictions || 'None'}</strong></div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 bg-white/60 rounded-lg border border-slate-200 text-slate-400 italic flex items-center justify-center">
                                    Individual registration — no additional team members.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Add-ons & Logistics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <span className="font-bold text-slate-700 block mb-1">Charity Add-on Inventory:</span>
                                <div className="flex flex-wrap gap-1.5 text-[11px]">
                                  <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                                    {reg.addons.mulligansCount} Mulligans
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                                    {reg.addons.rafflePacks10}x 10-Raffles
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                                    {reg.addons.rafflePacks25}x 25-Raffles
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                                    {reg.addons.puttingContestCount} Putting Shootout
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                                    {reg.addons.tigerDriveCount} Tiger Drive
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <span className="font-bold text-slate-700 block mb-1">Course Logistics:</span>
                                <div className="text-[11px] space-y-0.5">
                                  <div>Cart: <strong>{reg.assignedCart || 'Unassigned'}</strong></div>
                                  <div>Starting Hole: <strong>Hole #{reg.assignedStartingHole || 1}A</strong></div>
                                  <div>Arrival Status: <strong>{reg.checkedIn ? 'Checked In' : 'Pending Morning Arrival'}</strong></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: CHECK-IN DESK */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Team / Contact</th>
                      <th className="py-2.5 px-3">Payment</th>
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
                          <div className="flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                reg.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {reg.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                            </span>
                            <span className="capitalize text-[10px] text-slate-500 font-medium">
                              ({reg.paymentMethod || 'card'})
                            </span>
                          </div>
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

          {/* TAB: SPONSORS */}
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
                      const pkg = SPONSORSHIP_PACKAGES.find((p) => p.id === sp.tier);
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

          {/* TAB: DONATIONS */}
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
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Administrator: <strong>Luc Valade</strong> &bull; Contact: <strong>Saied Mohammed</strong>
            </span>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer"
            >
              Close Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
