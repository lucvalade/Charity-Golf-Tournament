import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS, SPONSORSHIP_PACKAGES } from '../data/initialData';
import {
  Shield,
  Users,
  Award,
  Heart,
  CheckCircle2,
  Download,
  Search,
  RefreshCw,
  DollarSign,
  FileSpreadsheet,
  Mail,
  Check,
  Clock,
  AlertCircle,
  FileText,
  Banknote,
  Send,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Filter,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  Phone,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

interface AdminPortalPageProps {
  onBackToSite?: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onBackToSite }) => {
  const {
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
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
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cheque' | 'etransfer' | 'cash' | 'credit_card'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [expandedRegId, setExpandedRegId] = useState<string | null>(null);

  // Lock Screen States
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleBack = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      setIsAdminOpen(false);
    }
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the administrator passcode.');
      return;
    }
    const success = loginAdmin(passcode);
    if (success) {
      setAuthError('');
      setPasscode('');
      addToast('success', 'Admin Access Granted', 'Welcome to the Director Portal, Luc Valade.');
    } else {
      setAuthError('Access Denied: Incorrect passcode. This section is restricted to tournament administrators only.');
    }
  };

  const handleQuickUnlock = () => {
    const success = loginAdmin('admin2026');
    if (success) {
      setAuthError('');
      setPasscode('');
      addToast('success', 'Admin Access Granted', 'Welcome to the Director Portal, Luc Valade.');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Confirmation Code',
      'Registration Type',
      'Team Name',
      'Payment Method',
      'Payment Status',
      'Total Amount CAD',
      'Payment Routing',
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
        'Saied Mohammed',
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
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            admin: 'Luc Valade',
            founder: 'Saied Mohammed',
            exportDate: new Date().toISOString(),
            registrations,
            sponsors,
            donations,
            summary: {
              totalRaised,
              goalAmount,
              totalGolfers
            }
          },
          null,
          2
        )
      );

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `tournament_full_database_luc_valade_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('success', 'Database JSON Exported', 'Complete database exported for Administrator Luc Valade.');
  };

  // If locked, present the Admins Only Lock Screen as a regular full page
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        {/* Top Header Bar */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-800/70"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Tournament Site</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">2026 Memorial Charity Golf Classic</span>
          </div>
        </header>

        {/* Lock Screen Centered Body */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-[#1E4D2B] text-white p-6 relative">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center relative shrink-0">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                  <Lock className="w-3.5 h-3.5 text-amber-300 absolute -bottom-1 -right-1 bg-[#0F2D17] rounded-full p-0.5 border border-amber-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Admins Only</span>
                  </div>
                  <h1 className="text-xl font-bold font-serif text-white">
                    Administrator Verification
                  </h1>
                  <p className="text-xs text-emerald-200/90">
                    Luc Valade Tournament Director Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Restricted Access Portal:</strong> You must be a verified tournament administrator to view player rosters, payment status reconciliations, morning check-in operations, and database backups.
                </div>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Administrator Passcode</span>
                    <span className="text-[11px] font-normal text-slate-500">Authorized Personnel</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="Enter admin passcode (e.g. admin2026)"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] focus:bg-white transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                    >
                      {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#1E4D2B] to-[#14381E] hover:brightness-110 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-amber-300" />
                  <span>Unlock Admin Portal</span>
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Director in Charge:</span>
                  <span className="font-semibold text-slate-800">Luc Valade</span>
                </div>

                {/* Quick unlock helper for Luc Valade */}
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold text-[#1E4D2B] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quick Unlock (Luc Valade Demo Key)</span>
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 transition text-center cursor-pointer mt-0.5"
                >
                  Cancel &amp; Return to Public Tournament Website
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Filtered registrations list
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
  const pendingOfflineCount = registrations.filter(
    (r) => (r.paymentMethod === 'cheque' || r.paymentMethod === 'etransfer' || r.paymentMethod === 'cash') && r.paymentStatus === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#1E4D2B]">
      {/* Top Portal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1E4D2B] text-white shadow-md border-b border-emerald-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back Link & Portal Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold border border-emerald-700/60 transition cursor-pointer shadow-xs"
              title="Return to public tournament site"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Tournament Site</span>
            </button>

            <div className="h-5 w-px bg-emerald-700/60 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Luc Valade Director Portal</span>
                  </span>
                  <span className="text-xs text-slate-300 hidden md:inline">&bull; 2026 Memorial Charity Golf</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutAdmin();
                addToast('info', 'Section Locked', 'Administrator section locked. Passcode is required to re-enter.');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/90 hover:bg-amber-900 text-amber-200 hover:text-white rounded-lg text-xs font-semibold border border-amber-600/60 transition cursor-pointer shadow-xs"
              title="Lock portal (require passcode to re-enter)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lock Portal</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold border border-emerald-600 transition cursor-pointer shadow-xs"
              title="Download full golfer CSV database"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-600 transition cursor-pointer shadow-xs"
              title="Backup entire database as JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Title & Status Banner */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4D2B] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Tournament Director Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Golfer Database &amp; Operations Oversight
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Centralized administrative control for Tournament Director <strong>Luc Valade</strong> and Founder <strong>Saied Mohammed</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Active</span>
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold">
              Oct 5, 2026 &bull; Royal Ashburn
            </span>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Raised */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Raised</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#1E4D2B]">
              ${totalRaised.toLocaleString()} CAD
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-emerald-600 to-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalRaised / goalAmount) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 pt-0.5 flex justify-between">
              <span>{Math.round((totalRaised / goalAmount) * 100)}% of goal</span>
              <span>Goal: ${goalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 2: Registered Golfers */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Registered Golfers</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              {totalGolfers}{' '}
              <span className="text-xs font-normal text-slate-400">/ 144 Max</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              {144 - totalGolfers} field spots remaining
            </div>
          </div>

          {/* Card 3: Morning Check-in Readiness */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Check-in Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              {checkedInCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ {registrations.length} groups</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              {registrations.length - checkedInCount} groups pending morning arrival
            </div>
          </div>

          {/* Card 4: Pending Offline Payments */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pending Payments</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-700">
              {pendingOfflineCount}{' '}
              <span className="text-xs font-normal text-slate-400">Pending</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Pending receipt by Saied Mohammed
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('golfers')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'golfers'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Golfer Roster &amp; Registrations ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>On-Site Check-in Desk ({checkedInCount}/{registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsors')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'sponsors'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Corporate Sponsors ({sponsors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'donations'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Memorial Donations ({donations.length})</span>
          </button>
        </div>

        {/* Tab 1: GOLFERS ROSTER & REGISTRATIONS */}
        {activeTab === 'golfers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by golfer name, email, confirmation code, team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="cheque">Cheque Only</option>
                  <option value="etransfer">e-Transfer Only</option>
                  <option value="cash">Cash Only</option>
                  <option value="credit_card">Credit Card</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>

            {/* Registrations List */}
            <div className="space-y-2.5 pt-2">
              {filteredRegistrations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No registrations found matching your query.
                </div>
              ) : (
                filteredRegistrations.map((reg) => {
                  const isExpanded = expandedRegId === reg.id;
                  const totalPlayersCount = 1 + (reg.additionalPlayers ? reg.additionalPlayers.length : 0);

                  return (
                    <div
                      key={reg.id}
                      className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition shadow-xs"
                    >
                      {/* Header Row */}
                      <div className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setExpandedRegId(isExpanded ? null : reg.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0 mt-0.5"
                            title={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                                {reg.confirmationCode}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {reg.primaryContact.name}
                              </span>
                              {reg.teamName && (
                                <span className="text-xs text-slate-500 font-medium">
                                  &bull; Team: <strong>{reg.teamName}</strong>
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                {reg.type} ({totalPlayersCount} {totalPlayersCount === 1 ? 'Golfer' : 'Golfers'})
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="font-mono">{reg.primaryContact.email}</span>
                              <span>&bull;</span>
                              <span>{reg.primaryContact.phone}</span>
                              <span>&bull;</span>
                              <span>Cart: <strong>{reg.assignedCart || 'Unassigned'}</strong></span>
                              <span>&bull;</span>
                              <span>Hole: <strong>#{reg.assignedStartingHole || 1}A</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                          {/* Payment Method Badge */}
                          <div
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                              reg.paymentMethod === 'cheque'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : reg.paymentMethod === 'etransfer'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
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
                            ) : reg.paymentMethod === 'etransfer' ? (
                              <>
                                <Send className="w-3.5 h-3.5 text-[#1E4D2B]" />
                                <span>e-Transfer (Saied)</span>
                              </>
                            ) : reg.paymentMethod === 'cash' ? (
                              <>
                                <Banknote className="w-3.5 h-3.5" />
                                <span>Cash (Saied)</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Card</span>
                              </>
                            )}
                          </div>

                          {/* Payment Status Toggle Button */}
                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                reg.id,
                                reg.paymentStatus === 'paid' ? 'pending' : 'paid'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                              reg.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                            }`}
                            title="Click to toggle Paid / Pending payment status"
                          >
                            {reg.paymentStatus === 'paid' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Paid ($ {reg.totalAmount.toLocaleString()})</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Pending ($ {reg.totalAmount.toLocaleString()})</span>
                              </>
                            )}
                          </button>

                          {/* Quick Check-in Toggle */}
                          <button
                            onClick={() => checkInPlayer(reg.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                              reg.checkedIn
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                            title="Toggle Check-in"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{reg.checkedIn ? 'Arrived' : 'Check In'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Player & Logistics Details */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-4">
                          {/* Financial & Notification Routing */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                            <div>
                              <span className="text-slate-500">Total Charged: </span>
                              <span className="font-mono font-bold text-slate-900">
                                ${reg.totalAmount.toLocaleString()} CAD
                              </span>
                              <span className="text-slate-400 ml-2">
                                (Status:{' '}
                                <strong className={reg.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
                                  {reg.paymentStatus.toUpperCase()}
                                </strong>
                                )
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700">Notification Routing: </span>
                              <span className="font-mono text-[#1E4D2B] font-bold">
                                Saied Mohammed (ms_smnm@outlook.com)
                              </span>
                            </div>
                            <div className="text-slate-500">
                              Registered: <strong>{new Date(reg.registeredAt).toLocaleString()}</strong>
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
                                  Individual registration — single golfer.
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

        {/* Tab 2: ON-SITE CHECK-IN DESK */}
        {activeTab === 'checkin' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Morning Check-in &amp; Cart Dispatch</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Operate 1-click check-in at 10:30 AM registration desk. Roster assignments sync immediately.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick search golfer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Team / Contact</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Cart / Hole</th>
                    <th className="py-2.5 px-3">Add-on Inventory</th>
                    <th className="py-2.5 px-3 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className={`hover:bg-slate-50 transition ${reg.checkedIn ? 'bg-emerald-50/40' : ''}`}>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
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

        {/* Tab 3: CORPORATE SPONSORS */}
        {activeTab === 'sponsors' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Corporate Sponsors &amp; Community Partners</span>
              </h3>
              <p className="text-xs text-slate-500">
                Partner commitments supporting the 2026 Memorial Charity Golf Classic.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Tier Package</th>
                    <th className="py-2.5 px-3">Key Contact</th>
                    <th className="py-2.5 px-3">Commitment Amount</th>
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
                          ${pkg?.amount.toLocaleString() || '0'} CAD
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

        {/* Tab 4: MEMORIAL DONATIONS & TRIBUTES */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>Memorial Gifts &amp; Community Tributes</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct charitable gifts pledged in loving memory of {EVENT_DETAILS.memorialHonoree}.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Donor</th>
                    <th className="py-2.5 px-3">Tribute Honoree</th>
                    <th className="py-2.5 px-3">Gift Amount</th>
                    <th className="py-2.5 px-3">Tribute Note</th>
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
                        ${don.amount.toLocaleString()} CAD
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

        {/* Footer Administration Utility Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <button
            onClick={resetToDefaults}
            className="text-slate-500 hover:text-red-700 flex items-center gap-1.5 font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial</span>
          </button>

          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>
              Tournament Administrator: <strong className="text-slate-800">Luc Valade</strong> &bull; Founder: <strong className="text-slate-800">Saied Mohammed</strong>
            </span>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer shadow-xs"
            >
              Exit to Public Site
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
