import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Mail,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Check,
  ShieldCheck,
  Eye,
  FileText,
  Building2,
  ArrowRight,
  AlertTriangle,
  Flame,
  Info,
  Calendar,
  CalendarDays
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { OutreachLead, OutreachEmailTemplate } from '../../types';
import { interpolateLetterTokens, renderOutreachMarkdownToHtml } from '../../utils/outreachMarkdown';
import {
  convertEasternToUTC,
  QUICK_SCHEDULE_OPTIONS,
  filterEligibleAudience,
  AudienceTargetSegment
} from '../../utils/timezoneUtils';

interface MassEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedLeadIds?: string[];
}

export const MassEmailModal: React.FC<MassEmailModalProps> = ({
  isOpen,
  onClose,
  initialSelectedLeadIds = []
}) => {
  const {
    outreachLeads,
    outreachTemplates,
    outreachQuota,
    refreshOutreachQuota,
    sendTestTemplateEmail,
    sendMassOutreachEmails,
    scheduleOutreachCampaign
  } = useTournament();

  // Selected lead IDs
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'identified' | 'opened'>('identified');

  // Precision Campaign Scheduler state
  const [dispatchMode, setDispatchMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-27');
  const [scheduledTime, setScheduledTime] = useState<string>('20:00');
  const [targetSegment, setTargetSegment] = useState<AudienceTargetSegment>('unopened_only');
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduledSuccess, setScheduledSuccess] = useState<{
    message: string;
    easternDisplay: string;
    utcISO: string;
  } | null>(null);

  // Dynamic Audience Segmentation Computation
  const audienceStats = useMemo(() => {
    return filterEligibleAudience(outreachLeads, targetSegment);
  }, [outreachLeads, targetSegment]);

  // Template selection
  const defaultTpl =
    outreachTemplates.find((t) => t.category === 'hole_contest_sponsorship') ||
    outreachTemplates.find((t) => t.title.toLowerCase().includes('showcase')) ||
    outreachTemplates[0];

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTpl?.id || '');
  const [subjectTemplate, setSubjectTemplate] = useState<string>('');
  const [bodyTemplate, setBodyTemplate] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Test Email state
  const [testEmailRecipient, setTestEmailRecipient] = useState<string>('luc.valade@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    isAuthError?: boolean;
    helpUrl?: string;
  } | null>(null);

  // Mass Dispatch execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<{
    current: number;
    total: number;
    succeeded: number;
    failed: number;
    currentLeadName?: string;
  }>({ current: 0, total: 0, succeeded: 0, failed: 0 });

  const [dispatchSummary, setDispatchSummary] = useState<{
    completed: boolean;
    totalRequested: number;
    succeededCount: number;
    failedCount: number;
    skippedDueToQuota: number;
    remainingQuota: number;
    results?: Array<any>;
  } | null>(null);

  // Initialize selected leads on open
  useEffect(() => {
    if (isOpen) {
      refreshOutreachQuota();
      setDispatchSummary(null);
      setTestResult(null);

      if (initialSelectedLeadIds.length > 0) {
        setSelectedLeadIds(initialSelectedLeadIds);
      } else {
        // Default to all identified/uncontacted leads
        const eligible = outreachLeads
          .filter((l) => l.emailAddress && l.emailAddress.includes('@') && l.status === 'Identified')
          .map((l) => l.id);
        setSelectedLeadIds(eligible.length > 0 ? eligible : outreachLeads.map((l) => l.id));
      }
    }
  }, [isOpen]);

  // Sync template subject and body
  useEffect(() => {
    const tpl = outreachTemplates.find((t) => t.id === selectedTemplateId) || defaultTpl;
    if (tpl) {
      setSubjectTemplate(tpl.subject);
      setBodyTemplate(tpl.body);
    }
  }, [selectedTemplateId, outreachTemplates]);

  // Quick filter changes
  const handleFilterChange = (mode: 'all' | 'identified' | 'opened') => {
    setFilterMode(mode);
    let ids: string[] = [];
    if (mode === 'identified') {
      ids = outreachLeads.filter((l) => l.status === 'Identified' && l.emailAddress).map((l) => l.id);
    } else if (mode === 'opened') {
      ids = outreachLeads.filter((l) => (l.openCount || 0) > 0 && l.emailAddress).map((l) => l.id);
    } else {
      ids = outreachLeads.filter((l) => l.emailAddress).map((l) => l.id);
    }
    setSelectedLeadIds(ids);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const toggleSelectAll = () => {
    const allValidIds = outreachLeads.filter((l) => l.emailAddress).map((l) => l.id);
    if (selectedLeadIds.length === allValidIds.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(allValidIds);
    }
  };

  // Sample lead for live preview
  const sampleLead = useMemo(() => {
    return outreachLeads.find((l) => selectedLeadIds.includes(l.id)) || outreachLeads[0] || {
      id: 'sample',
      businessName: 'St. George Pro Hardware',
      recipientName: 'Dave Miller',
      emailAddress: 'dave@stgeorgepro.ca',
      targetTier: 'Hole & Contest Sponsor',
      city: 'Burford ON',
      status: 'Identified'
    };
  }, [selectedLeadIds, outreachLeads]);

  // Preview content interpolated
  const previewSubject = useMemo(() => {
    return interpolateLetterTokens(subjectTemplate, sampleLead as OutreachLead);
  }, [subjectTemplate, sampleLead]);

  const previewBody = useMemo(() => {
    return interpolateLetterTokens(bodyTemplate, sampleLead as OutreachLead);
  }, [bodyTemplate, sampleLead]);

  const previewHtml = useMemo(() => {
    return renderOutreachMarkdownToHtml(previewBody);
  }, [previewBody]);

  // Handle single test email send
  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    const res = await sendTestTemplateEmail({
      templateId: selectedTemplateId,
      subject: previewSubject,
      bodyText: previewBody,
      bodyHtml: previewHtml,
      recipientEmail: testEmailRecipient.trim() || 'luc.valade@gmail.com'
    });

    setIsSendingTest(false);
    setTestResult({
      success: res.success,
      message: res.success
        ? `Preview successfully delivered to ${testEmailRecipient.trim() || 'luc.valade@gmail.com'}!`
        : undefined,
      error: res.error,
      isAuthError: res.isAuthError,
      helpUrl: res.helpUrl
    });
  };

  // Launch Mass Dispatch
  const handleLaunchMassDispatch = async () => {
    if (selectedLeadIds.length === 0) return;

    setIsExecuting(true);
    setDispatchSummary(null);
    setDispatchProgress({
      current: 0,
      total: selectedLeadIds.length,
      succeeded: 0,
      failed: 0
    });

    const res = await sendMassOutreachEmails({
      leadIds: selectedLeadIds,
      templateId: selectedTemplateId,
      subjectTemplate,
      bodyTemplate,
      batchDelayMs: 280
    });

    setIsExecuting(false);
    setDispatchSummary({
      completed: true,
      totalRequested: res.totalRequested,
      succeededCount: res.succeededCount,
      failedCount: res.failedCount,
      skippedDueToQuota: res.skippedDueToQuota,
      remainingQuota: res.remainingDailyQuota,
      results: res.results
    });
  };

  // Eastern Timezone computed info
  const scheduledTimezoneInfo = useMemo(() => {
    return convertEasternToUTC(scheduledDate, scheduledTime);
  }, [scheduledDate, scheduledTime]);

  // Handle Precision Campaign Schedule
  const handleScheduleCampaign = async () => {
    if (selectedLeadIds.length === 0) return;

    setIsScheduling(true);
    setScheduledSuccess(null);

    const res = await scheduleOutreachCampaign({
      leadIds: selectedLeadIds,
      templateId: selectedTemplateId,
      subjectTemplate,
      bodyTemplate,
      dateStr: scheduledDate,
      timeStr: scheduledTime,
      targetSegment
    });

    setIsScheduling(false);

    if (res.success) {
      setScheduledSuccess({
        message: res.message || 'Campaign successfully queued for dispatch!',
        easternDisplay: res.scheduledForEasternDisplay || scheduledTimezoneInfo.easternDisplay,
        utcISO: res.scheduledForUTC || scheduledTimezoneInfo.utcISO
      });
    }
  };

  if (!isOpen) return null;

  const validSelectedCount = selectedLeadIds.length;
  const remainingQuota = outreachQuota.remaining;
  const quotaPercentage = Math.min(100, Math.round((outreachQuota.sentToday / outreachQuota.dailyLimit) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Mass Solicitation Mail Merge</h2>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#1E4D2B] px-2 py-0.5 rounded">
                  High-Scale Outreach
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Automated 1-click personalized dispatch with Google Workspace deliverability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Dispatch Mode Selector Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDispatchMode('now')}
              className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                dispatchMode === 'now'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Send Immediate Batch</span>
            </button>
            <button
              type="button"
              onClick={() => setDispatchMode('schedule')}
              className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                dispatchMode === 'schedule'
                  ? 'bg-[#1E4D2B] text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Precision Campaign Scheduler (8:00 PM Eastern)</span>
            </button>
          </div>

          {/* Daily Quota Counter & Limit Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1.5k
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Daily Mail Merge Capacity: Up to 1,500 Messages / Day
                    <span className="text-xs font-normal text-slate-500">(Google Workspace Standard)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated per user account. Quota resets daily at midnight.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <div>
                  <span className="text-slate-500">Sent Today: </span>
                  <strong className="text-slate-800">{outreachQuota.sentToday}</strong>
                  <span className="text-slate-400"> / {outreachQuota.dailyLimit}</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-500">Remaining Today: </span>
                  <strong className={remainingQuota < 100 ? 'text-amber-600' : 'text-emerald-700'}>
                    {remainingQuota} messages
                  </strong>
                </div>
              </div>
            </div>

            {/* Quota bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  quotaPercentage > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.max(2, quotaPercentage)}%` }}
              />
            </div>
          </div>

          {/* PRECISION CAMPAIGN SCHEDULER PANEL */}
          {dispatchMode === 'schedule' && (
            <div className="bg-gradient-to-br from-emerald-900 via-[#1E4D2B] to-slate-900 border border-emerald-500/40 rounded-2xl p-5 text-white space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Precision Campaign Scheduler
                      <span className="text-[10px] font-mono bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                        America/Toronto (Eastern Time)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Timezone-aware scheduling targeting exact 8:00 PM Eastern campaign launches
                    </p>
                  </div>
                </div>

                {/* Display Confirmation Badge */}
                <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#D4AF37] text-slate-950 border border-amber-300 flex items-center gap-1.5 shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Blast will dispatch at exactly 8:00 PM Eastern.</span>
                </div>
              </div>

              {/* Audience Target Selector & Real-Time Recipient Counter */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    Audience Target Segmentation
                  </label>

                  {/* Real-Time Dynamic Counter Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/90 text-emerald-200 border border-emerald-400/40 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Eligible Recipients: {audienceStats.eligibleLeads.length} contacts ({audienceStats.excludedCount} bounced/responded contacts excluded)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetSegment('unopened_only');
                      const stats = filterEligibleAudience(outreachLeads, 'unopened_only');
                      setSelectedLeadIds(stats.eligibleLeads.map((l) => l.id));
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                      targetSegment === 'unopened_only'
                        ? 'bg-emerald-800/90 text-white border-emerald-400 font-bold ring-2 ring-emerald-400'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
                        1. Unopened Only (Default)
                      </span>
                      {targetSegment === 'unopened_only' && <Check className="w-4 h-4 text-emerald-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Query: <code className="text-amber-200/90">status == 'Letter Sent' &amp; openCount == 0</code>. Excludes anyone who opened initial email.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetSegment('all_non_responders');
                      const stats = filterEligibleAudience(outreachLeads, 'all_non_responders');
                      setSelectedLeadIds(stats.eligibleLeads.map((l) => l.id));
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                      targetSegment === 'all_non_responders'
                        ? 'bg-emerald-800/90 text-white border-emerald-400 font-bold ring-2 ring-emerald-400'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
                        2. All Non-Responders
                      </span>
                      {targetSegment === 'all_non_responders' && <Check className="w-4 h-4 text-emerald-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Query: <code className="text-amber-200/90">(Letter Sent | Opened) &amp; repliedAt == null</code>. Captures unopened &amp; opened non-responders.
                    </p>
                  </button>
                </div>
              </div>

              {/* Quick-Select Scheduling Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Quick-Select Campaign Launch Buttons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setScheduledDate('2026-09-27');
                      setScheduledTime('20:00');
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                      scheduledDate === '2026-09-27' && scheduledTime === '20:00'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-md ring-2 ring-amber-300'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        Send: Sunday, Sept 27 @ 8:00 PM
                      </span>
                      <span className="text-[10px] opacity-80 block font-mono">
                        Target Date: 2026-09-27 (20:00 EDT)
                      </span>
                    </div>
                    {scheduledDate === '2026-09-27' && scheduledTime === '20:00' && (
                      <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScheduledDate('2026-10-04');
                      setScheduledTime('20:00');
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                      scheduledDate === '2026-10-04' && scheduledTime === '20:00'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-md ring-2 ring-amber-300'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        Send: Sunday, Oct 4 @ 8:00 PM
                      </span>
                      <span className="text-[10px] opacity-80 block font-mono">
                        Target Date: 2026-10-04 (20:00 EDT)
                      </span>
                    </div>
                    {scheduledDate === '2026-10-04' && scheduledTime === '20:00' && (
                      <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* Custom Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Select Target Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-950/80 border border-white/20 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Select Target Time (24h Eastern)
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-950/80 border border-white/20 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Display Calculated UTC ISO string */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Exact Converted UTC ISO Timestamp:</span>
                <span className="text-emerald-300 font-bold text-xs">{scheduledTimezoneInfo.utcISO}</span>
              </div>

              {/* Pre-Dispatch Safety Check Card */}
              <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Crucial Pre-Dispatch Safety Check Enabled</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The cron job performs one final database check at the exact moment of dispatch (8:00 PM). If a lead's status changed to <strong>"Replied"</strong>, <strong>"Pledged"</strong>, or <strong>"Declined"</strong> between scheduling and 8:00 PM Sunday, the system MUST automatically abort that specific email to prevent sending follow-ups to contacts who already answered.
                </p>
              </div>

              {/* Scheduled Success Popup Notification */}
              {scheduledSuccess && (
                <div className="p-3.5 bg-emerald-950 border border-emerald-400/50 rounded-xl text-xs space-y-1 text-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{scheduledSuccess.message}</span>
                  </div>
                  <p>Scheduled for: <strong>{scheduledSuccess.easternDisplay}</strong></p>
                  <p className="text-[10px] font-mono text-emerald-300/80">UTC: {scheduledSuccess.utcISO}</p>
                </div>
              )}
            </div>
          )}

          {/* If Dispatch Completed Summary is available */}
          {dispatchSummary && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-emerald-950">
                    Mass Dispatch Campaign Complete!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Successfully dispatched <strong>{dispatchSummary.succeededCount}</strong> personalized outreach letters.
                    {dispatchSummary.failedCount > 0 && ` (${dispatchSummary.failedCount} failed)`}
                    {dispatchSummary.skippedDueToQuota > 0 && ` (${dispatchSummary.skippedDueToQuota} skipped due to daily quota)`}
                  </p>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Requested</span>
                      <strong className="text-sm text-slate-800">{dispatchSummary.totalRequested}</strong>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Delivered</span>
                      <strong className="text-sm text-emerald-700">{dispatchSummary.succeededCount}</strong>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Remaining Quota</span>
                      <strong className="text-sm text-slate-800">{dispatchSummary.remainingQuota}</strong>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Open Tracking</span>
                      <strong className="text-sm text-emerald-700">1x1 Active</strong>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setDispatchSummary(null)}
                      className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                    >
                      Prepare Another Campaign
                    </button>
                    <button
                      onClick={onClose}
                      className="text-xs font-semibold px-3 py-1.5 bg-white text-emerald-900 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      Return to CRM Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Email Section */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Step 1: Test Email to luc.valade@gmail.com
                  </h4>
                  <span className="text-[10px] uppercase font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                    Verification
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Send an exact preview of the <strong>"Showcase Your Brand"</strong> template with all branding and links before launching to prospective sponsors.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 w-52 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  placeholder="luc.valade@gmail.com"
                />
                <button
                  onClick={handleSendTest}
                  disabled={isSendingTest || isExecuting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      Sending Preview...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Test
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{testResult.success ? testResult.message : testResult.error}</p>
                  {testResult.isAuthError && (
                    <div className="mt-2 text-xs bg-white/70 p-2.5 rounded border border-rose-200 text-slate-800 space-y-1">
                      <p className="font-semibold text-rose-800">
                        Google Workspace App Password Required:
                      </p>
                      <p>
                        Your Google account requires a 16-character App Password to authorize SMTP dispatch.
                      </p>
                      <a
                        href={testResult.helpUrl || 'https://myaccount.google.com/apppasswords'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-800 font-bold underline hover:text-emerald-900 mt-1"
                      >
                        Generate App Password on Google Account
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1E4D2B]" />
                Select Solicitation Template
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    isPreviewMode
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isPreviewMode ? 'Hide Rendered Preview' : 'Show Rendered Preview'}
                </button>
              </div>
            </div>

            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              {outreachTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category === 'hole_contest_sponsorship' ? 'Hole & Contest' : t.category})
                </option>
              ))}
            </select>

            {/* Merge Tokens Guide */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 mr-1">Auto-Merged Tokens:</span>
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1E4D2B] font-mono">
                {'{{business_name}}'}
              </code>
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1E4D2B] font-mono">
                {'{{recipient_name}}'}
              </code>
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1E4D2B] font-mono">
                {'{{target_tier}}'}
              </code>
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1E4D2B] font-mono">
                {'{{city}}'}
              </code>
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1E4D2B] font-mono">
                {'{{tournament_date}}'}
              </code>
            </div>

            {/* Editable Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject Line Template</label>
              <input
                type="text"
                value={subjectTemplate}
                onChange={(e) => setSubjectTemplate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Editable Body or Rendered Preview */}
            {isPreviewMode ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                  <span>Sample Rendered Preview for: <strong>{sampleLead.businessName}</strong></span>
                  <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    Official Green & Gold Format
                  </span>
                </div>
                <div className="p-4 bg-white max-h-80 overflow-y-auto">
                  <div className="text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                    Subject: {previewSubject}
                  </div>
                  <div
                    className="text-xs text-slate-700 space-y-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Letter Body Template (Markdown & Links)</label>
                <textarea
                  rows={9}
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            )}
          </div>

          {/* Recipient Selection Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1E4D2B]" />
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Target Recipients ({validSelectedCount} selected)
                </h4>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => handleFilterChange('identified')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterMode === 'identified'
                      ? 'bg-white shadow-xs font-bold text-slate-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Uncontacted Only
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('opened')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterMode === 'opened'
                      ? 'bg-white shadow-xs font-bold text-slate-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Opened / Follow-up
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterMode === 'all'
                      ? 'bg-white shadow-xs font-bold text-slate-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Verified ({outreachLeads.length})
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.length > 0 && selectedLeadIds.length === outreachLeads.filter((l) => l.emailAddress).length}
                        onChange={toggleSelectAll}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </th>
                    <th className="p-2.5">Business Name</th>
                    <th className="p-2.5">Contact Person</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Tier</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outreachLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    const hasEmail = Boolean(lead.emailAddress && lead.emailAddress.includes('@'));

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                      >
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!hasEmail}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="rounded text-emerald-700 focus:ring-emerald-700 disabled:opacity-30"
                          />
                        </td>
                        <td className="p-2.5 font-medium text-slate-800">
                          {lead.businessName}
                        </td>
                        <td className="p-2.5 text-slate-600">{lead.recipientName}</td>
                        <td className="p-2.5 font-mono text-slate-600 text-[11px]">
                          {lead.emailAddress || <span className="text-rose-500 italic">No email</span>}
                        </td>
                        <td className="p-2.5 text-slate-600">{lead.targetTier}</td>
                        <td className="p-2.5">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded font-semibold ${
                              lead.status === 'Identified'
                                ? 'bg-slate-100 text-slate-700'
                                : lead.status === 'Opened'
                                ? 'bg-amber-100 text-amber-800'
                                : lead.status === 'Letter Sent'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            <span>Target Contacts: </span>
            <strong className="text-slate-900">{validSelectedCount} messages</strong>
            <span className="text-slate-400"> &bull; </span>
            <span>Execution Mode: </span>
            <strong className="text-emerald-800 font-bold">
              {dispatchMode === 'schedule' ? `Scheduled for ${scheduledTimezoneInfo.easternDisplay}` : 'Immediate Dispatch'}
            </strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isExecuting || isScheduling}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            >
              Cancel
            </button>

            {dispatchMode === 'schedule' ? (
              <button
                type="button"
                onClick={handleScheduleCampaign}
                disabled={isScheduling || validSelectedCount === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-[#1E4D2B] hover:from-emerald-900 hover:to-emerald-950 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 cursor-pointer"
              >
                {isScheduling ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span>Scheduling Blast...</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Schedule Campaign Blast ({validSelectedCount})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunchMassDispatch}
                disabled={isExecuting || validSelectedCount === 0 || remainingQuota <= 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span>Dispatching {validSelectedCount} Messages...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                    <span>Launch Mass Mail Merge ({validSelectedCount})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
