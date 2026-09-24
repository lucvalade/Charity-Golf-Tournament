import React, { useState } from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  Key,
  Users,
  CheckCircle2,
  Award,
  Heart,
  Mail,
  BarChart3,
  Download,
  Settings,
  Lock,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  RefreshCw,
  FolderGit2,
  Send,
  Calendar,
  Activity,
  FileText,
  Eye,
  EyeOff,
  Layers,
  Database
} from 'lucide-react';

interface AdminManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminManualModal: React.FC<AdminManualModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'access' | 'roster' | 'checkin' | 'sponsors' | 'crm' | 'telemetry' | 'reports'>('all');

  if (!isOpen) return null;

  const adminUrl = 'https://fragrant-breeze-golf-tournament.ai.studio/admin';
  const passcode = 'admin2026';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(adminUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(passcode);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#1E4D2B] to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Operations &amp; User Manual</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              HOW TO use the admin panel
            </h2>
            <p className="text-xs text-slate-300">
              Fragrant Breeze Memorial Golf Classic &bull; Director &amp; Founder Administrative Portal Guide
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
            aria-label="Close user manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation Pills */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs font-semibold overflow-x-auto shrink-0">
          <span className="text-slate-500 mr-1 shrink-0">Quick Jump:</span>
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'access', label: '1. Access & Security' },
            { id: 'roster', label: '2. Golfer Roster' },
            { id: 'checkin', label: '3. Game-Day Check-In' },
            { id: 'sponsors', label: '4. Sponsors & Donations' },
            { id: 'crm', label: '5. CRM Directory & Templates' },
            { id: 'telemetry', label: '6. Email Analytics & Telemetry' },
            { id: 'reports', label: '7. Send Pledges Report & Exports' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`px-3 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                activeSection === item.id
                  ? 'bg-[#1E4D2B] text-white border-[#1E4D2B] font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Modal Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Quick Access & Security */}
          {(activeSection === 'all' || activeSection === 'access') && (
            <section className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#1E4D2B] font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3>1. Administration Access &amp; Passcode Security</h3>
              </div>
              <p className="text-xs text-slate-600">
                The admin panel is restricted to Tournament Director <strong>Luc Valade</strong> and Founder <strong>Saied Mohammed</strong>. It provides complete oversight of golfer rosters, payment reconciliations, check-in operations, corporate sponsorship leads, and database backups.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Admin Direct URL */}
                <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                    Admin Portal Direct URL
                  </span>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 truncate">
                    <span className="truncate">{adminUrl}</span>
                    <button
                      onClick={handleCopyUrl}
                      className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded transition cursor-pointer shrink-0"
                      title="Copy URL to Clipboard"
                    >
                      {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Master Passcode */}
                <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                    Master Administrator Passcode
                  </span>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span>{passcode}</span>
                    <button
                      onClick={handleCopyPasscode}
                      className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded transition cursor-pointer shrink-0"
                      title="Copy Passcode"
                    >
                      {copiedPasscode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Golfer Roster */}
          {(activeSection === 'all' || activeSection === 'roster') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Users className="w-5 h-5 text-blue-600 shrink-0" />
                <h3>2. Golfer Roster &amp; Registration Management</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                <li>
                  <strong>Viewing Player Details:</strong> Click on any registration row to expand and view all teammate names, contact emails, phone numbers, handicaps, shirt sizes, and dietary restrictions.
                </li>
                <li>
                  <strong>Editing Registrations:</strong> Use the <span className="font-semibold text-slate-800">Edit Player</span> or <span className="font-semibold text-slate-800">Edit Registration</span> buttons to modify shirt sizes, team names, or add-on packages (Mulligans, Raffle Tickets, Putting Contest).
                </li>
                <li>
                  <strong>Payment Status Reconciliations:</strong> Toggle payment status between <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">PAID</span> and <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">PENDING</span>. Filter by Cheque, E-Transfer, Cash, or Credit Card.
                </li>
                <li>
                  <strong>Deleting Records:</strong> Click the trash icon to delete a record. A safety confirmation modal (<span className="text-rose-700 font-semibold">Yes, Delete</span> / <span className="text-slate-600 font-semibold">No, Cancel</span>) ensures zero accidental data loss.
                </li>
              </ul>
            </section>
          )}

          {/* Section 3: Check-in */}
          {(activeSection === 'all' || activeSection === 'checkin') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3>3. Game-Day Check-In &amp; Hole/Cart Assignments</h3>
              </div>
              <p className="text-xs text-slate-600">
                Designed for seamless morning desk operations at Royal Ashburn Golf Club on October 5, 2026.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-blue-600" /> Instant Player Search
                  </strong>
                  <p className="text-slate-600 text-[11px]">
                    Search arriving golfers by last name, confirmation code, or company team name.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Arrival Toggle
                  </strong>
                  <p className="text-slate-600 text-[11px]">
                    Click <span className="font-bold text-emerald-700">Check In</span> to confirm arrival and issue player welcome gift bags.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5 text-slate-600" /> Hole &amp; Cart Pairings
                  </strong>
                  <p className="text-slate-600 text-[11px]">
                    Assign starting holes (Holes 1–18 shotgun start) and cart numbers (Cart A/B).
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Sponsors & Donations */}
          {(activeSection === 'all' || activeSection === 'sponsors') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <h3>4. Corporate Sponsors &amp; Memorial Donations</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                <li>
                  <strong>Sponsor Packages:</strong> Oversee Title ($5,000), Gold ($3,000), Silver ($1,500), Hole ($500), Lunch/Dinner ($2,500), Beverage Cart ($2,000), and Cart ($1,000) sponsors.
                </li>
                <li>
                  <strong>Offline Pledges &amp; Cheques:</strong> Manually record incoming cheque payments, e-transfer reference codes, or custom corporate logos.
                </li>
                <li>
                  <strong>Memorial Tax Receipts:</strong> Review tax-deductible gifts made in memory of Naseem Mohammed and generate electronic donor receipts.
                </li>
              </ul>
            </section>
          )}

          {/* Section 5: CRM Directory, Templates & Scheduling */}
          {(activeSection === 'all' || activeSection === 'crm') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Mail className="w-5 h-5 text-sky-600 shrink-0" />
                <h3>5. CRM Directory, Templates &amp; Delivery Management</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* 1. CRM Directory */}
                <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900 text-xs">
                    <Database className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>CRM Directory &amp; Contact Database</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Access a pre-vetted database of <strong>200+ GTA corporate contacts</strong>, local businesses, golf clubs, and foundations. Search contacts by industry, city, or decision-maker title, and import leads directly into your active outreach campaign with 1 click.
                  </p>
                </div>

                {/* 2. Templates */}
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs">
                    <FileText className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span>Templates &amp; Letter Customization</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Utilize the built-in <strong>Template Library</strong> with pre-approved letter templates for Title ($5k), Gold ($3k), Silver ($1.5k), and Hole ($500) packages. Automatically inserts dynamic variables (<code>{`{{companyName}}`}</code>, <code>{`{{contactPerson}}`}</code>) with AI tone refinement (Formal, Warm, High Urgency).
                  </p>
                </div>

                {/* 3. Schedule Delivery Dates */}
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Schedule Delivery Dates &amp; Reminders</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Configure scheduled dispatch dates for follow-up letters and reminder sequences. Allows directors to queue up corporate outreach and align scheduled email dispatches with fiscal sponsorship deadlines.
                  </p>
                </div>

                {/* 4. Sync Tracking */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                    <RefreshCw className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Sync Tracking &amp; State Reconciliation</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Background synchronization engine that continuously aligns local lead states, server logs (<code>outreach-logs.json</code>), and 1x1 tracking pixel events. Automatically reconciles status transitions when recipients open, reply, or pledge.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 6: Analytics Telemetry & Email Analytics */}
          {(activeSection === 'all' || activeSection === 'telemetry') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3>6. Email Analytics &amp; Telemetry Insights</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* 1. Analytics Telemetry */}
                <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                    <Activity className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Analytics Telemetry &amp; System Logs</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Real-time telemetry monitoring server HTTP dispatch statuses, SMTP response latency, delivery success rates, bounce flags, and background cron job executions across 24-hour and 7-day activity timelines.
                  </p>
                </div>

                {/* 2. Email Analytics */}
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                    <Eye className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Email Analytics &amp; Engagement Breakdown</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Dedicated outreach analytics tracking <strong>Emails Opened</strong> vs. <strong>Emails NOT Opened</strong>, open percentages, response rates, and pledge conversion velocity. Clicking any analytics card instantly filters the active CRM lead table.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 7: Send Pledges Report & Executive Exports */}
          {(activeSection === 'all' || activeSection === 'reports') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Send className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3>7. Send Pledges Report &amp; Data Exports</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                {/* Send Pledges Report Highlight */}
                <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#1E4D2B]">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      Send Pledges &amp; Pipeline Executive Report
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">
                      SMTP Dispatch Engine
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Triggers formatted, executive-level sponsorship status reports via SMTP to designated directors (<strong>Luc Valade</strong> and <strong>Saied Mohammed</strong>).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-0.5">
                      <strong className="text-emerald-900 block font-bold">Designated Executive Recipients</strong>
                      <p className="text-slate-600 text-[10px]">Add, edit, or remove executive target emails. Requires at least 1 valid recipient before dispatching.</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-0.5">
                      <strong className="text-emerald-900 block font-bold">Pledges Raised "As of Date"</strong>
                      <p className="text-slate-600 text-[10px]">Select an effective audit snapshot date (e.g. Sep 21, 2026) to lock total pledged revenue calculations.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block flex items-center gap-1 font-bold">
                      <Download className="w-3.5 h-3.5 text-emerald-700" /> Export CSV Spreadsheet
                    </strong>
                    <p className="text-slate-600 text-[11px]">
                      Downloads full player rosters, contact info, shirt sizes, dietary notes, and payment statuses for Excel.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block flex items-center gap-1 font-bold">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" /> Backup JSON Snapshot
                    </strong>
                    <p className="text-slate-600 text-[11px]">
                      Generates raw, complete database backups for archival or emergency system restoration.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 text-center sm:text-left">
            Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold rounded-xl transition cursor-pointer shadow-xs text-center"
          >
            Got it, Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
