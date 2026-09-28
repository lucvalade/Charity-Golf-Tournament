import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Mail,
  Eye,
  EyeOff,
  DollarSign,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  RefreshCw,
  Send,
  Building2,
  User,
  ChevronRight,
  Award,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronDown,
  Database,
  BarChart3,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Check,
  X,
  Phone
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { OutreachLead, OutreachLeadStatus, OutreachTargetTier, OutreachEmailTemplate } from '../../types';
import { SendLetterModal } from './SendLetterModal';
import { LeadFormModal } from './LeadFormModal';
import { TemplateLibraryModal } from './TemplateLibraryModal';
import { ImportLeadsModal } from './ImportLeadsModal';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { MassEmailModal } from './MassEmailModal';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { FoursomesRosterCard } from '../FoursomesRosterCard';
import { SponsorsCard } from './SponsorsCard';
import { filterEligibleAudience, AudienceTargetSegment } from '../../utils/timezoneUtils';
import { generateSolicitationLetterPDF, generateFilteredLeadsReportPDF } from '../../utils/pdfGenerator';

interface CategoryPdfDropdownProps {
  lead: OutreachLead;
  templates: OutreachEmailTemplate[];
  onGenerateCategoryPdf: (lead: OutreachLead, categoryKey: string) => void;
}

const CategoryPdfDropdown: React.FC<CategoryPdfDropdownProps> = ({
  lead,
  templates,
  onGenerateCategoryPdf
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const categories = [
    { key: 'corporate_sponsorship', label: 'Corporate Sponsorship PDF', desc: 'Title & Corporate Partner' },
    { key: 'hole_contest_sponsorship', label: 'Hole & Contest PDF', desc: 'Tee Box & Contest Sponsor' },
    { key: 'prize_raffle', label: 'Prize & Raffle PDF', desc: 'Silent Auction & Prize Donor' },
    { key: 'memorial_tribute', label: 'Memorial Tribute PDF', desc: 'Memorial Hole Sponsor' },
    { key: 'follow_up', label: 'Follow-Up Letter PDF', desc: 'Gentle Reminder' }
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-1">
        {/* Quick Primary PDF Button (Generates for Lead's Target Tier / Default) */}
        <button
          type="button"
          onClick={() => {
            const targetTier = (lead.targetTier || '').toLowerCase();
            let catKey = 'hole_contest_sponsorship';
            if (
              targetTier.includes('title') ||
              targetTier.includes('corporate') ||
              targetTier.includes('eagle') ||
              targetTier.includes('birdie')
            ) {
              catKey = 'corporate_sponsorship';
            } else if (targetTier.includes('prize') || targetTier.includes('raffle')) {
              catKey = 'prize_raffle';
            } else if (targetTier.includes('memorial')) {
              catKey = 'memorial_tribute';
            }
            onGenerateCategoryPdf(lead, catKey);
          }}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-l-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
          title={`Generate PDF solicitation letter for ${lead.businessName}`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>PDF</span>
        </button>

        {/* Category Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-r-lg text-xs font-bold transition shadow-2xs cursor-pointer border-l border-slate-600 flex items-center justify-center"
          title="Select Solicitation Category PDF"
        >
          <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Category Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in text-left">
          <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PDF By Category
          </div>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                onGenerateCategoryPdf(lead, cat.key);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-emerald-50/70 transition flex flex-col cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {cat.label}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-emerald-700 pl-5">
                {cat.desc}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const OutreachDashboard: React.FC = () => {
  const {
    outreachLeads,
    outreachTemplates,
    outreachQuota,
    sendTestTemplateEmail,
    addOutreachLead,
    updateOutreachLead,
    deleteOutreachLead,
    promoteLeadToSponsor,
    addOutreachTemplate,
    updateOutreachTemplate,
    deleteOutreachTemplate,
    importOutreachLeads,
    sendOutreachEmailToLead,
    refreshOutreachTracking,
    resetToOutscraperDirectory,
    addToast
  } = useTournament();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Selected lead IDs for batch actions
  const [checkedLeadIds, setCheckedLeadIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'sponsors' | 'foursomes' | 'analytics'>('table');

  // Modals state
  const [dashboardTargetSegment, setDashboardTargetSegment] = useState<AudienceTargetSegment>('unopened_only');
  const dashboardAudienceStats = useMemo(() => {
    return filterEligibleAudience(outreachLeads, dashboardTargetSegment);
  }, [outreachLeads, dashboardTargetSegment]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedLeadForSend, setSelectedLeadForSend] = useState<OutreachLead | null>(null);

  const [isMassModalOpen, setIsMassModalOpen] = useState(false);
  const [massModalInitialIds, setMassModalInitialIds] = useState<string[]>([]);

  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<OutreachLead | null>(null);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLead, setDrawerLead] = useState<OutreachLead | null>(null);

  // Bulk PDF generation menu state for displayed/filtered leads
  const [isBulkPdfMenuOpen, setIsBulkPdfMenuOpen] = useState(false);
  const bulkPdfDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bulkPdfDropdownRef.current && !bulkPdfDropdownRef.current.contains(event.target as Node)) {
        setIsBulkPdfMenuOpen(false);
      }
    };
    if (isBulkPdfMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBulkPdfMenuOpen]);

  // Generate PDF solicitation report for currently displayed/filtered section
  const handlePrintFilteredLeadsPdf = (categoryKey?: string) => {
    if (!filteredLeads || filteredLeads.length === 0) {
      addToast('info', 'No Displayed Leads', 'There are no leads currently displayed matching your filter criteria.');
      return;
    }

    if (categoryKey) {
      addToast(
        'success',
        'Generating Category PDFs',
        `Generating PDF solicitation letters for ${filteredLeads.length} currently displayed lead(s)...`
      );

      filteredLeads.forEach((lead, index) => {
        setTimeout(() => {
          const matchingTemplate = outreachTemplates.find((t) => t.category === categoryKey);
          generateSolicitationLetterPDF(lead, matchingTemplate);
        }, index * 200);
      });
      return;
    }

    const currentStatusName = statusFilter === 'all' ? 'All Leads' : statusFilter;
    const currentTierName = tierFilter === 'all' ? 'All Tiers' : tierFilter;

    addToast(
      'success',
      'Generating PDF Report',
      `Generating section PDF report for '${currentStatusName}' (${filteredLeads.length} leads)...`
    );

    generateFilteredLeadsReportPDF(filteredLeads, currentStatusName, currentTierName);
  };

  // Generate PDF solicitation letter tailored to a specific template category
  const handleGenerateCategoryPdf = (lead: OutreachLead, categoryKey: string) => {
    let matchingTemplate = outreachTemplates.find((t) => t.category === categoryKey);
    if (!matchingTemplate) {
      if (categoryKey === 'corporate_sponsorship') {
        matchingTemplate = outreachTemplates.find((t) => t.id === 'tpl-title-sponsor' || t.id === 'tpl-corporate-foursome');
      } else if (categoryKey === 'hole_contest_sponsorship') {
        matchingTemplate = outreachTemplates.find((t) => t.id === 'tpl-hole-sponsor');
      } else if (categoryKey === 'prize_raffle') {
        matchingTemplate = outreachTemplates.find((t) => t.id === 'tpl-prize-raffle');
      } else if (categoryKey === 'memorial_tribute') {
        matchingTemplate = outreachTemplates.find((t) => t.id === 'tpl-memorial-tribute');
      } else if (categoryKey === 'follow_up') {
        matchingTemplate = outreachTemplates.find((t) => t.id === 'tpl-gentle-followup');
      }
    }
    generateSolicitationLetterPDF(lead, matchingTemplate);
  };

  // Refresh tracking metrics from server
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshOutreachTracking();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Format date as "Sep 14/26" and time in 12-hour format e.g. "5:15 PM"
  const formatSentDateTime = (dateStr?: string) => {
    if (!dateStr) return { date: '-', time: '' };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: '-', time: '' };
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const day = d.getDate();
      const year = String(d.getFullYear()).slice(-2);
      const formattedDate = `${month} ${day}/${year}`;

      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

      return { date: formattedDate, time: formattedTime };
    } catch {
      return { date: '-', time: '' };
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const safeLeads = Array.isArray(outreachLeads) ? outreachLeads : [];
    const totalLeads = safeLeads.length;
    const sentLeads = safeLeads.filter(
      (l) => l && l.status && l.status !== 'Identified' && l.status !== 'Declined'
    ).length;

    // A lead is opened if openCount > 0 OR status is 'Opened', 'Replied', 'Pledged', or 'Followed Up'
    const isLeadOpened = (l: OutreachLead) => {
      if (!l) return false;
      const hasPixelOpens = (Number(l.openCount) || 0) > 0;
      const hasEngagedStatus = l.status === 'Opened' || l.status === 'Replied' || l.status === 'Pledged' || l.status === 'Followed Up';
      return hasPixelOpens || hasEngagedStatus;
    };

    const totalOpens = safeLeads.reduce(
      (sum, l) => sum + Math.max(Number(l?.openCount) || 0, isLeadOpened(l) ? 1 : 0),
      0
    );
    const openedLeads = safeLeads.filter(isLeadOpened).length;
    const openRate = sentLeads > 0 ? Math.round((openedLeads / sentLeads) * 100) : 0;
    const unopenedLeads = Math.max(0, sentLeads - openedLeads);
    const unopenedRate = sentLeads > 0 ? Math.round((unopenedLeads / sentLeads) * 100) : 0;

    const pledgedLeads = safeLeads.filter(
      (l) => l && (l.status === 'Pledged' || (Number(l.pledgedAmount) || 0) > 0)
    );
    const totalPledgedAmount = pledgedLeads.reduce((sum, l) => sum + (Number(l?.pledgedAmount) || 0), 0);

    const now = new Date();
    const overdueLeads = safeLeads.filter((l) => {
      if (!l || l.status === 'Pledged' || l.status === 'Declined') return false;
      if (l.nextFollowUpDate) {
        return new Date(l.nextFollowUpDate) <= now;
      }
      if (l.status === 'Letter Sent' && l.lastContactDate) {
        const contactDate = new Date(l.lastContactDate);
        const diffDays = (now.getTime() - contactDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 5;
      }
      return false;
    });

    return {
      totalLeads,
      sentLeads,
      totalOpens,
      openedLeads,
      openRate,
      unopenedLeads,
      unopenedRate,
      pledgedCount: pledgedLeads.length,
      totalPledgedAmount,
      overdueCount: overdueLeads.length
    };
  }, [outreachLeads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const safeLeads = Array.isArray(outreachLeads) ? outreachLeads : [];
    return safeLeads.filter((lead) => {
      if (!lead) return false;
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = (lead.businessName || '').toLowerCase().includes(query);
        const matchContact = (lead.recipientName || '').toLowerCase().includes(query);
        const matchEmail = (lead.emailAddress || '').toLowerCase().includes(query);
        const matchCity = (lead.city || '').toLowerCase().includes(query);
        if (!matchName && !matchContact && !matchEmail && !matchCity) return false;
      }

      // Status
      if (statusFilter !== 'all') {
        const isLeadOpened = (l: OutreachLead) => {
          if (!l) return false;
          const hasPixelOpens = (Number(l.openCount) || 0) > 0;
          const hasEngagedStatus = l.status === 'Opened' || l.status === 'Replied' || l.status === 'Pledged' || l.status === 'Followed Up';
          return hasPixelOpens || hasEngagedStatus;
        };

        if (statusFilter === 'Not Opened') {
          const isSent = lead.status !== 'Identified' && lead.status !== 'Declined';
          if (!isSent || isLeadOpened(lead)) return false;
        } else if (statusFilter === 'Opened') {
          if (!isLeadOpened(lead)) return false;
        } else if (statusFilter === 'Follow-Up Needed') {
          if (!lead || lead.status === 'Pledged' || lead.status === 'Declined') return false;
          const now = new Date();
          const isOverdue = Boolean(lead.nextFollowUpDate && new Date(lead.nextFollowUpDate) <= now);
          const isLetterSentOverdue = Boolean(
            (lead.status === 'Letter Sent' || lead.status === 'Opened') &&
            lead.lastContactDate &&
            (now.getTime() - new Date(lead.lastContactDate).getTime()) / (1000 * 3600 * 24) >= 3
          );
          const isExplicitFollowup = lead.status === 'Follow-Up Needed' || lead.status === 'Followed Up';
          if (!isOverdue && !isLetterSentOverdue && !isExplicitFollowup) return false;
        } else if (lead.status !== statusFilter) {
          return false;
        }
      }

      // Tier
      if (tierFilter !== 'all' && lead.targetTier !== tierFilter) {
        return false;
      }

      return true;
    });
  }, [outreachLeads, searchTerm, statusFilter, tierFilter]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tierFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Business Name',
      'Contact Person',
      'Email Address',
      'Phone Number',
      'Target Tier',
      'Status',
      'Opens',
      'Pledged Amount',
      'Payment Method',
      'City',
      'Next Action Date',
      'Notes'
    ];

    const rows = outreachLeads.map((l) => [
      l.id,
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.recipientName.replace(/"/g, '""')}"`,
      l.emailAddress,
      l.contactNumber || '',
      `"${l.targetTier}"`,
      l.status,
      l.openCount || 0,
      l.pledgedAmount || 0,
      l.paymentMethod || '',
      l.city || '',
      l.nextFollowUpDate || '',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FBGT_Outreach_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isSendingReport, setIsSendingReport] = useState(false);

  // Pledges Report Modal States
  const [isPledgeReportModalOpen, setIsPledgeReportModalOpen] = useState(false);
  const [isPledgeReportSuccessModalOpen, setIsPledgeReportSuccessModalOpen] = useState(false);
  const [reportDispatchResult, setReportDispatchResult] = useState<any>(null);
  const [customReportNote, setCustomReportNote] = useState('');

  // Executive Recipients State (Allow editing/removing, min 1 required)
  const [reportRecipients, setReportRecipients] = useState<string[]>([
    'luc.valade@gmail.com',
    'ms_smnm@outlook.com'
  ]);
  const [newRecipientInput, setNewRecipientInput] = useState('');
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<number | null>(null);
  const [editingRecipientEmail, setEditingRecipientEmail] = useState('');
  const [recipientError, setRecipientError] = useState('');

  // As of Date State
  const [asOfDate, setAsOfDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const handleAddRecipient = () => {
    setRecipientError('');
    const email = newRecipientInput.trim().toLowerCase();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRecipientError('Please enter a valid email address.');
      return;
    }
    if (reportRecipients.includes(email)) {
      setRecipientError('This recipient is already in the list.');
      return;
    }
    setReportRecipients([...reportRecipients, email]);
    setNewRecipientInput('');
  };

  const handleRemoveRecipient = (indexToRemove: number) => {
    setRecipientError('');
    if (reportRecipients.length <= 1) {
      setRecipientError('At least one recipient email address is required.');
      return;
    }
    setReportRecipients(reportRecipients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStartEditRecipient = (index: number, currentEmail: string) => {
    setEditingRecipientIndex(index);
    setEditingRecipientEmail(currentEmail);
    setRecipientError('');
  };

  const handleSaveEditRecipient = (index: number) => {
    setRecipientError('');
    const email = editingRecipientEmail.trim().toLowerCase();
    if (!email) {
      setRecipientError('Email address cannot be empty.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRecipientError('Please enter a valid email address.');
      return;
    }
    if (reportRecipients.some((r, idx) => idx !== index && r === email)) {
      setRecipientError('This recipient is already in the list.');
      return;
    }
    const updated = [...reportRecipients];
    updated[index] = email;
    setReportRecipients(updated);
    setEditingRecipientIndex(null);
    setEditingRecipientEmail('');
  };

  // Schedule Delivery Dates Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScheduleSuccessModalOpen, setIsScheduleSuccessModalOpen] = useState(false);
  const [scheduledDates, setScheduledDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('scheduledPledgeReportDates');
      return saved ? JSON.parse(saved) : ['2026-09-21', '2026-09-25', '2026-09-28', '2026-10-02', '2026-10-05'];
    } catch {
      return ['2026-09-21', '2026-09-25', '2026-09-28', '2026-10-02', '2026-10-05'];
    }
  });
  const [newDateInput, setNewDateInput] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');

  // Sync Tracking & Audit Log Modal State
  const [isSyncTrackingModalOpen, setIsSyncTrackingModalOpen] = useState(false);

  const handleExecuteSendPledgesReport = async () => {
    setRecipientError('');
    if (!reportRecipients || reportRecipients.length === 0) {
      setRecipientError('At least one recipient email address is required.');
      return;
    }
    try {
      setIsSendingReport(true);
      const res = await fetch('/api/outreach/send-pledges-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: outreachLeads,
          customNotes: customReportNote.trim() || '10:00 AM Daily Sponsorship Pledges & Pipeline Audit Report.',
          recipients: reportRecipients,
          asOfDate: asOfDate
        })
      });
      const data = await res.json();
      setReportDispatchResult(data);
      setIsPledgeReportModalOpen(false);
      setIsPledgeReportSuccessModalOpen(true);

      const formattedDate = new Date(asOfDate + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (data.success) {
        addToast(
          'success',
          'Pledges Report Dispatched',
          `Sent executive report as of ${formattedDate} to ${reportRecipients.length} recipients ($${Number(data.totalPledged || stats.totalPledgedAmount || 0).toLocaleString()} CAD total pledges).`
        );
      } else {
        addToast('error', 'Report Error', data.error || 'Failed to dispatch report.');
      }
    } catch (err: any) {
      addToast('error', 'Dispatch Error', err?.message || 'Server error.');
    } finally {
      setIsSendingReport(false);
    }
  };

  const handleSaveScheduleDates = () => {
    try {
      localStorage.setItem('scheduledPledgeReportDates', JSON.stringify(scheduledDates));
      localStorage.setItem('scheduledPledgeReportFreq', scheduleFrequency);
    } catch {}
    setIsScheduleModalOpen(false);
    setIsScheduleSuccessModalOpen(true);
    addToast('success', 'Schedule Saved', `Automated pledges report scheduled for ${scheduledDates.length} target dates.`);
  };

  const handleOpenSyncTrackingModal = () => {
    handleManualRefresh();
    setIsSyncTrackingModalOpen(true);
  };

  const openSendModalForLead = (lead: OutreachLead) => {
    setSelectedLeadForSend(lead);
    setIsSendModalOpen(true);
  };

  const openEditModalForLead = (lead: OutreachLead) => {
    setLeadToEdit(lead);
    setIsLeadFormOpen(true);
  };

  const openDrawerForLead = (lead: OutreachLead) => {
    setDrawerLead(lead);
    setIsDrawerOpen(true);
  };

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Determine if active filters are applied
  const hasActiveFilters = Boolean(searchTerm.trim() || statusFilter !== 'All' || tierFilter !== 'All');

  // All target leads: if filters are active, select all matching in database; otherwise the entire database of 351 leads
  const targetLeads = hasActiveFilters ? filteredLeads : (outreachLeads || []);
  const allDatabaseCount = (outreachLeads || []).length;

  // Check whether all target leads in the database are currently selected
  const isAllSelected = targetLeads.length > 0 && targetLeads.every((l) => checkedLeadIds.includes(l.id));

  // Set indeterminate state if some leads are selected
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = checkedLeadIds.length > 0 && !isAllSelected;
    }
  }, [checkedLeadIds.length, isAllSelected]);

  // When clicking the checkmark to the left of Company & Contact:
  // Select ALL company and contacts in the database (not just the ones on display)
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setCheckedLeadIds([]);
    } else {
      const idsToSelect = targetLeads.map((l) => l.id);
      setCheckedLeadIds(idsToSelect);
    }
  };

  const toggleRowLead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-[#1E4D2B] rounded-2xl text-white p-6 shadow-sm border border-emerald-800 flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1E4D2B] text-[10px] font-bold uppercase tracking-wider">
              Solicitation &amp; CRM Engine
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1.5 text-white">
            Corporate Sponsor &amp; Donation Solicitation Letters
          </h2>
          <p className="text-xs text-emerald-100 max-w-3xl mt-1 leading-relaxed">
            Dispatch personalized letters directly to prospective local businesses and donors.
            Track email opens, record phone conversations, schedule next-action reminders, and convert pledges into confirmed tournament sponsors with one click.
          </p>
        </div>

        {/* Action Buttons at bottom of card */}
        <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Left: View Mode Tabs */}
          <div className="inline-flex items-center p-1 bg-emerald-950/80 rounded-xl border border-emerald-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-[#1E4D2B] font-bold shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CRM Directory</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sponsors')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'sponsors'
                  ? 'bg-[#D4AF37] text-emerald-950 font-extrabold shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Sponsors Card</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('foursomes')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'foursomes'
                  ? 'bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37] text-emerald-950 font-extrabold shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Foursomes Card</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('analytics')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'analytics'
                  ? 'bg-[#D4AF37] text-[#1E4D2B] font-bold shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics Telemetry</span>
            </button>
          </div>

          {/* Right: Operational Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPledgeReportModalOpen(true)}
              disabled={isSendingReport}
              className="px-3.5 py-2 bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Preview & Send detailed 10:00 AM Pledges Report to Saied Mohammed & Luc Valade"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingReport ? 'animate-spin' : ''}`} />
              <span>{isSendingReport ? 'Sending Report...' : 'Send Pledges Report (Luc & Saied)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-emerald-600/60 shadow-sm cursor-pointer"
              title="Pick multiple dates to schedule automated pledges report delivery"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Schedule Delivery Dates ({scheduledDates.length})</span>
            </button>

            <button
              type="button"
              onClick={resetToOutscraperDirectory}
              className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-emerald-700/50 cursor-pointer shadow-2xs"
              title="Load all 351 verified Ontario Golf Vendors Directory leads (Column A: Business Name, Column G: Email Address)"
            >
              <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ontario Golf Vendors (351 Leads)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenSyncTrackingModal}
              className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-emerald-700/50 cursor-pointer shadow-2xs"
              title="Fetch live open tracking records & view sync logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Tracking</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Templates</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMassModalInitialIds(checkedLeadIds);
                setIsMassModalOpen(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-[#D4AF37] hover:from-amber-300 hover:to-amber-400 text-[#1E4D2B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Launch high-volume mail merge outreach (up to 1,500 messages/day)"
            >
              <Send className="w-3.5 h-3.5 text-[#1E4D2B]" />
              <span>Mass Mail Merge (1,500/day)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLeadToEdit(null);
                setIsLeadFormOpen(true);
              }}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-[#1E4D2B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Sponsors Card vs Analytics Dashboard vs Foursomes Card vs Table CRM */}
      {viewMode === 'sponsors' ? (
        <SponsorsCard
          title="Corporate Sponsor & Donation Solicitation — Sponsors Directory"
          subtitle="Real-time directory of tournament sponsors, contribution amounts, contact points, payment status, and sponsorship packages."
          onSendSolicitation={(email, companyName) => {
            setSelectedLeadForSend({
              id: `lead-sponsor-${Date.now()}`,
              companyName: companyName || 'Corporate Sponsor',
              contactName: companyName || 'Sponsor Delegate',
              email: email || '',
              phone: '',
              targetTier: 'Corporate Sponsor',
              status: 'Lead',
              lastContacted: new Date().toISOString()
            } as any);
            setIsSendModalOpen(true);
          }}
        />
      ) : viewMode === 'foursomes' ? (
        <FoursomesRosterCard
          title="Corporate Sponsor & Donation Solicitation — Foursomes Card"
          subtitle="Complete Roster of Member & Guest Foursomes &bull; Primary Contacts, Emails, Phones & Teammates"
          onSendSolicitation={(email, teamName) => {
            setSelectedLeadForSend({
              id: `lead-foursome-${Date.now()}`,
              companyName: teamName || 'Foursome Team',
              contactName: teamName || 'Primary Golfer Contact',
              email: email || '',
              phone: '',
              targetTier: 'Corporate Foursome ($1,600)',
              status: 'Lead',
              lastContacted: new Date().toISOString()
            } as any);
            setIsSendModalOpen(true);
          }}
        />
      ) : viewMode === 'analytics' ? (
        <AnalyticsDashboard
          leads={outreachLeads}
          onNavigateToCRM={() => setViewMode('table')}
        />
      ) : (
        <>
          {/* Daily Quota & Fast Actions Ribbon */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-200/70 border border-amber-300 flex items-center justify-center shrink-0">
            <Send className="w-3.5 h-3.5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span>Google Workspace Mail Merge Limit:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[11px]">
                {outreachQuota ? `${outreachQuota.sentToday} / ${outreachQuota.dailyLimit}` : '0 / 1,500'} sent today
              </span>
              <span className="text-amber-800/80 font-normal">
                ({outreachQuota?.remaining ?? 1500} messages remaining)
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 mt-0.5">
              Automated mail merge rate-limiting protects domain deliverability. Sender: <strong>sales@aiopenhouseconnect.com</strong> &bull; Reply-To: <strong>luc.valade@gmail.com</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold border border-amber-300 transition cursor-pointer shadow-2xs"
          >
            Send Test to luc.valade@gmail.com
          </button>
          <button
            type="button"
            onClick={() => {
              setMassModalInitialIds(checkedLeadIds);
              setIsMassModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Send className="w-3 h-3 text-[#D4AF37]" />
            <span>Launch Batch Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Pipeline Leads */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('all');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-800 transition">Total Leads</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalLeads}</div>
          <span className="text-[11px] text-slate-500 group-hover:text-emerald-700 font-medium">View All Leads Directory &rarr;</span>
        </button>

        {/* Card 2: Letters Sent */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('Letter Sent');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-sky-400 hover:shadow-md transition text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-sky-800 transition">Letters Sent</span>
            <Send className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-900">{stats.sentLeads}</div>
          <span className="text-[11px] text-sky-700">Dispatched via SMTP &rarr;</span>
        </button>

        {/* Card 3: Emails Opened */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('Opened');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-indigo-800 transition">Emails Opened</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-950 flex items-baseline gap-1.5">
            <span>{stats.openedLeads}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {stats.openRate}% rate
            </span>
          </div>
          <span className="text-[11px] text-slate-500 group-hover:text-indigo-700 font-medium">{stats.totalOpens} total pixel opens &rarr;</span>
        </button>

        {/* Card 4: Emails NOT Opened */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('Not Opened');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-800 transition">Emails NOT Opened</span>
            <EyeOff className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950 flex items-baseline gap-1.5">
            <span>{stats.unopenedLeads}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {stats.unopenedRate}% unopened
            </span>
          </div>
          <span className="text-[11px] text-slate-500 group-hover:text-amber-700 font-medium">Awaiting recipient opens &rarr;</span>
        </button>

        {/* Card 5: Pledges Secured */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('Pledged');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-gradient-to-br from-emerald-50/80 to-white p-4 rounded-xl border-2 border-emerald-500/80 shadow-xs hover:border-emerald-600 hover:shadow-md transition text-left cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 group-hover:text-emerald-950">Pledges Raised</span>
            <DollarSign className="w-4 h-4 text-emerald-700 font-bold" />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono tracking-tight">
            ${stats.totalPledgedAmount.toLocaleString()}
          </div>
          <span className="text-[11px] font-bold text-emerald-800 group-hover:underline flex items-center justify-between mt-0.5">
            <span>{stats.pledgedCount} committed sponsors</span>
            <span>Filter Pledged &rarr;</span>
          </span>
        </button>

        {/* Card 6: Action Needed */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('Follow-Up Needed');
            document.getElementById('leads-table-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-amber-50/60 p-4 rounded-xl border-2 border-amber-300 shadow-2xs hover:border-amber-500 hover:shadow-md transition text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 group-hover:text-amber-950">Action Needed</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950 flex items-baseline gap-1.5">
            <span>{stats.overdueCount}</span>
            {stats.overdueCount > 0 && (
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                Pending Follow-Up
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-900 font-medium group-hover:underline">Past 5 days or reminder set &rarr;</span>
        </button>
      </div>

      {/* Action & Filter Bar */}
      <div id="leads-table-container" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, contact person, email, or city..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'Identified', label: 'Identified' },
              { id: 'Letter Sent', label: 'Letter Sent' },
              { id: 'Opened', label: 'Opened' },
              { id: 'Not Opened', label: 'Not Opened' },
              { id: 'Follow-Up Needed', label: 'Follow-Up Needed' },
              { id: 'Replied', label: 'Replied' },
              { id: 'Pledged', label: 'Pledged' },
              { id: 'Declined', label: 'Declined' },
              { id: 'Bounced', label: 'Bounced / Suppressed' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-[#1E4D2B] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Tiers</option>
              <option value="Title Sponsor">Title Sponsor</option>
              <option value="Eagle Sponsor">Eagle Sponsor</option>
              <option value="Birdie Sponsor">Birdie Sponsor</option>
              <option value="Beverage Cart Sponsor">Beverage Cart Sponsor</option>
              <option value="Hole Sponsor">Hole Sponsor</option>
              <option value="Prize / Raffle Donor">Prize / Raffle Donor</option>
              <option value="General Donor">General Donor</option>
            </select>

            {/* PDF Generation button directly to the right of Tier dropdown */}
            <div className="relative inline-block text-left" ref={bulkPdfDropdownRef}>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handlePrintFilteredLeadsPdf()}
                  className="px-3.5 py-1 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-l-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                  title={`Generate PDF report for currently displayed section (${statusFilter === 'all' ? 'All Leads' : statusFilter})`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkPdfMenuOpen(!isBulkPdfMenuOpen)}
                  className="px-1.5 py-1 bg-[#15381E] hover:bg-emerald-950 text-white rounded-r-lg text-xs font-bold transition shadow-2xs cursor-pointer border-l border-emerald-800 flex items-center justify-center"
                  title="PDF Options for active section"
                >
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform ${isBulkPdfMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* PDF Menu */}
              {isBulkPdfMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in text-left text-slate-800">
                  <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Section Report ({statusFilter === 'all' ? 'All Leads' : statusFilter})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBulkPdfMenuOpen(false);
                      handlePrintFilteredLeadsPdf();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 transition flex items-center gap-2 cursor-pointer font-bold text-xs text-[#1E4D2B]"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generate Section Report PDF</span>
                  </button>

                  <div className="px-3 py-1 border-t border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Export Individual Category Letters:
                  </div>

                  {[
                    { key: 'corporate_sponsorship', label: 'Corporate Sponsorship Letters' },
                    { key: 'hole_contest_sponsorship', label: 'Hole & Contest Letters' },
                    { key: 'prize_raffle', label: 'Prize & Raffle Letters' },
                    { key: 'memorial_tribute', label: 'Memorial Tribute Letters' },
                    { key: 'follow_up', label: 'Follow-Up Letters' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setIsBulkPdfMenuOpen(false);
                        handlePrintFilteredLeadsPdf(cat.key);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-emerald-50/80 transition flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-emerald-900"
                    >
                      <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating/Inline Batch Action Ribbon */}
      {checkedLeadIds.length > 0 && (
        <div className="bg-[#1E4D2B] text-white p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-emerald-700 animate-in fade-in">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-[#D4AF37] text-[#1E4D2B] rounded-full font-bold text-xs">
              {checkedLeadIds.length} Selected
            </span>
            <span className="text-emerald-100">
              {checkedLeadIds.length === allDatabaseCount
                ? `All ${allDatabaseCount} companies & contacts in database selected for mass mail merge.`
                : `${checkedLeadIds.length} companies & contacts selected for mass mail merge.`}
            </span>
            {checkedLeadIds.length < allDatabaseCount && (
              <button
                type="button"
                onClick={() => setCheckedLeadIds((outreachLeads || []).map((l) => l.id))}
                className="underline text-amber-300 hover:text-amber-200 cursor-pointer font-semibold ml-1 transition"
                title={`Select all ${allDatabaseCount} companies and contacts in database`}
              >
                Select all {allDatabaseCount} in database
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCheckedLeadIds([])}
              className="px-3 py-1.5 text-xs text-emerald-200 hover:text-white hover:bg-emerald-800/80 rounded-lg transition cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={() => {
                setMassModalInitialIds(checkedLeadIds);
                setIsMassModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-[#D4AF37] hover:from-amber-300 hover:to-amber-400 text-[#1E4D2B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#1E4D2B]" />
              <span>Launch Mass Mail Merge ({checkedLeadIds.length} Leads)</span>
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#1E4D2B] focus:ring-emerald-500 cursor-pointer"
                    title={
                      isAllSelected
                        ? 'Deselect all'
                        : `Select all ${targetLeads.length} companies & contacts in database`
                    }
                  />
                </th>
                <th className="py-3 px-4">Company &amp; Contact</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Target Tier</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-center">Opens</th>
                <th className="py-3 px-4">Pledged</th>
                <th className="py-3 px-4">Next Action</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">PDF Solicitation Letter</th>
                <th className="py-3 px-4 text-right">Outreach Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const hasOpened = (lead.openCount || 0) > 0;
                  const isPledged = lead.status === 'Pledged';
                  const isChecked = checkedLeadIds.includes(lead.id);
                  const sentDateTime = formatSentDateTime(lead.lastContactDate || lead.createdAt);

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-50/70 transition-colors group cursor-pointer ${
                        isChecked ? 'bg-amber-50/50' : ''
                      }`}
                      onClick={() => openDrawerForLead(lead)}
                    >
                      {/* Checkbox column */}
                      <td className="py-3 px-3 text-center" onClick={(e) => toggleRowLead(lead.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#1E4D2B] focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Company & Contact (Email moved directly under Company Name) */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{lead.businessName}</span>
                          {lead.businessUrl && (
                            <a
                              href={lead.businessUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-emerald-700"
                              title="Visit Website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {/* Email Address directly under Company */}
                        <div className="font-mono text-slate-500 text-xs mt-0.5 break-all flex items-center gap-1">
                          <span className="text-slate-400">Email:</span>
                          <span>{lead.emailAddress}</span>
                        </div>
                        {/* Contact Number / Phone */}
                        {lead.contactNumber && (
                          <div className="font-mono text-[#1E4D2B] text-xs mt-0.5 flex items-center gap-1 font-semibold">
                            <span className="text-slate-400 font-normal">Phone:</span>
                            <Phone className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                            <span>{lead.contactNumber}</span>
                          </div>
                        )}
                        {/* Contact Name */}
                        {lead.recipientName && lead.recipientName !== lead.businessName && (
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            Attn: <span className="font-medium text-slate-600">{lead.recipientName}</span>
                          </div>
                        )}
                      </td>

                      {/* Date / Time Column */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{sentDateTime.date}</span>
                        </div>
                        {sentDateTime.time && (
                          <div className="text-[11px] text-slate-500 font-medium pl-4">
                            {sentDateTime.time}
                          </div>
                        )}
                      </td>

                      {/* Target Tier */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#1E4D2B] border border-emerald-200/80 inline-block">
                          {lead.targetTier}
                        </span>
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            lead.status === 'Pledged'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'Opened'
                              ? 'bg-indigo-100 text-indigo-800'
                              : lead.status === 'Letter Sent'
                              ? 'bg-sky-100 text-sky-800'
                              : lead.status === 'Followed Up'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'Declined'
                              ? 'bg-rose-100 text-rose-800'
                              : lead.status === 'Bounced'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.status === 'Bounced' ? 'Bounced / Blocked' : lead.status}
                        </span>
                      </td>

                      {/* Opens */}
                      <td className="py-3 px-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            hasOpened
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'text-slate-400'
                          }`}
                        >
                          <Eye className={`w-3.5 h-3.5 ${hasOpened ? 'text-indigo-600' : 'text-slate-300'}`} />
                          <span>{lead.openCount || 0}</span>
                        </div>
                      </td>

                      {/* Pledged Amount */}
                      <td className="py-3 px-4">
                        {lead.pledgedAmount ? (
                          <div className="font-bold text-emerald-900">
                            ${lead.pledgedAmount.toLocaleString()}
                            {lead.paymentMethod && (
                              <span className="text-[10px] text-slate-500 font-normal block">
                                via {lead.paymentMethod}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Next Action Date */}
                      <td className="py-3 px-4">
                        {lead.nextFollowUpDate ? (
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.nextFollowUpDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* PDF Solicitation Letter Column (To the left of Outreach Actions) */}
                      <td
                        className="py-3 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CategoryPdfDropdown
                          lead={lead}
                          templates={outreachTemplates}
                          onGenerateCategoryPdf={handleGenerateCategoryPdf}
                        />
                      </td>

                      {/* Outreach Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Send Letter */}
                          <button
                            type="button"
                            onClick={() => openSendModalForLead(lead)}
                            className="px-2.5 py-1 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title="Dispatch solicitation letter"
                          >
                            <Send className="w-3 h-3 text-amber-300" />
                            <span>Send</span>
                          </button>

                          {/* Promote to Sponsor button if pledged */}
                          {isPledged && (
                            <button
                              type="button"
                              onClick={() => promoteLeadToSponsor(lead.id)}
                              className="px-2 py-1 bg-[#D4AF37] hover:bg-amber-400 text-[#1E4D2B] rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              title="Convert to Confirmed Tournament Sponsor"
                            >
                              <Award className="w-3 h-3" />
                              <span>Sponsor</span>
                            </button>
                          )}

                          {/* Edit Lead */}
                          <button
                            type="button"
                            onClick={() => openEditModalForLead(lead)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Details Drawer */}
                          <button
                            type="button"
                            onClick={() => openDrawerForLead(lead)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="View Record"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <strong className="text-slate-900 font-bold">
              {filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 font-bold">
              {Math.min(currentPage * pageSize, filteredLeads.length)}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-900 font-bold">{filteredLeads.length}</strong> leads
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Sub Modals & Drawer */}
      {isSendModalOpen && selectedLeadForSend && (
        <SendLetterModal
          isOpen={isSendModalOpen}
          onClose={() => {
            setIsSendModalOpen(false);
            setSelectedLeadForSend(null);
          }}
          lead={selectedLeadForSend}
          templates={outreachTemplates}
          onSendEmail={sendOutreachEmailToLead}
        />
      )}

      {isLeadFormOpen && (
        <LeadFormModal
          isOpen={isLeadFormOpen}
          onClose={() => {
            setIsLeadFormOpen(false);
            setLeadToEdit(null);
          }}
          leadToEdit={leadToEdit}
          onSaveLead={addOutreachLead}
          onUpdateLead={updateOutreachLead}
        />
      )}

      {isTemplateModalOpen && (
        <TemplateLibraryModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          templates={outreachTemplates}
          onAddTemplate={addOutreachTemplate}
          onUpdateTemplate={updateOutreachTemplate}
          onDeleteTemplate={deleteOutreachTemplate}
        />
      )}

      {isImportModalOpen && (
        <ImportLeadsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportLeads={importOutreachLeads}
        />
      )}

      {isDrawerOpen && drawerLead && (
        <LeadDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setDrawerLead(null);
          }}
          lead={drawerLead}
          onUpdateLead={updateOutreachLead}
          onDeleteLead={deleteOutreachLead}
          onOpenSendModal={openSendModalForLead}
          onOpenEditModal={openEditModalForLead}
          onPromoteToSponsor={promoteLeadToSponsor}
        />
      )}

      {isMassModalOpen && (
        <MassEmailModal
          isOpen={isMassModalOpen}
          onClose={() => setIsMassModalOpen(false)}
          initialSelectedLeadIds={massModalInitialIds}
        />
      )}

      {/* 1. Send Pledges Report Preview Modal */}
      {isPledgeReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#1E4D2B] to-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-1">
                  <Send className="w-3 h-3" /> 10:00 AM Executive Dispatch
                </div>
                <h3 className="text-lg font-bold font-serif text-white">Send Daily Pledges &amp; Pipeline Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPledgeReportModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Recipient Editor Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                    Designated Executive Recipients ({reportRecipients.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Min. 1 email address required</span>
                </div>

                {/* Recipient Tags */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {reportRecipients.map((email, idx) => (
                    <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 shadow-2xs">
                      <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      {editingRecipientIndex === idx ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="email"
                            value={editingRecipientEmail}
                            onChange={(e) => setEditingRecipientEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditRecipient(idx);
                              if (e.key === 'Escape') setEditingRecipientIndex(null);
                            }}
                            className="px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditRecipient(idx)}
                            className="p-0.5 text-emerald-700 hover:text-emerald-900 cursor-pointer"
                            title="Save recipient email"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRecipientIndex(null)}
                            className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Cancel edit"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-mono text-[11px]">{email}</span>
                          <button
                            type="button"
                            onClick={() => handleStartEditRecipient(idx, email)}
                            className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                            title="Edit recipient email"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(idx)}
                            disabled={reportRecipients.length <= 1}
                            className={`p-0.5 cursor-pointer ml-0.5 ${
                              reportRecipients.length <= 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600'
                            }`}
                            title={reportRecipients.length <= 1 ? "At least one recipient is required" : "Remove recipient"}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Recipient Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="email"
                    value={newRecipientInput}
                    onChange={(e) => {
                      setNewRecipientInput(e.target.value);
                      setRecipientError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRecipient();
                      }
                    }}
                    placeholder="Add executive email address (e.g. director@company.com)..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Email
                  </button>
                </div>

                {recipientError && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {recipientError}
                  </p>
                )}
              </div>

              {/* As of Date & KPI Summary Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Pledges Raised "As of Date"
                  </label>
                  <input
                    type="date"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Signifies that total pledges raised are as of this specific date.
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
                  <div className="text-[10px] font-bold text-emerald-900 uppercase">
                    Total Pledges Secured (As of {new Date(asOfDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                  </div>
                  <div className="text-xl font-black font-mono text-[#1E4D2B]">
                    ${stats.totalPledgedAmount.toLocaleString()} CAD
                  </div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">
                    {stats.pledgedCount} Verified Sponsors
                  </span>
                </div>
              </div>

               {/* Pledged Companies Table Preview */}
              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-1.5">
                  Confirmed Pledges Breakdown ({stats.pledgedCount})
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Business</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Tier</th>
                        <th className="py-2 px-3 text-right">Pledged</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(outreachLeads || [])
                        .filter((l) => l && (l.status === 'Pledged' || (Number(l.pledgedAmount) || 0) > 0))
                        .map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-bold text-slate-800">{lead.businessName}</td>
                            <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">{lead.contactNumber || 'N/A'}</td>
                            <td className="py-1.5 px-3 text-slate-500">{lead.targetTier}</td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-emerald-700">
                              ${(Number(lead.pledgedAmount) || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom Note input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Optional Executive Dispatch Note
                </label>
                <textarea
                  rows={2}
                  value={customReportNote}
                  onChange={(e) => setCustomReportNote(e.target.value)}
                  placeholder="e.g. Pipeline status update for morning executive review..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPledgeReportModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSendPledgesReport}
                disabled={isSendingReport || reportRecipients.length === 0}
                className="px-5 py-2 bg-[#1E4D2B] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingReport ? 'animate-spin' : ''}`} />
                <span>{isSendingReport ? 'Dispatching...' : 'Confirm & Dispatch Report Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Send Pledges Report Success Popup Modal */}
      {isPledgeReportSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Pledges Report Dispatched!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                The executive sponsorship report has been dispatched to <strong>{reportRecipients.length} designated recipient(s)</strong>.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Total Pledges Reported:</span>
                <strong className="font-mono">${stats.totalPledgedAmount.toLocaleString()} CAD</strong>
              </div>
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Effective As of Date:</span>
                <strong>{new Date(asOfDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              </div>
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Pledged Sponsors:</span>
                <strong>{stats.pledgedCount} Companies</strong>
              </div>
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Dispatch Recipients:</span>
                <strong>{reportRecipients.length} Recipient(s)</strong>
              </div>
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Dispatch Timestamp:</span>
                <strong>{new Date().toLocaleTimeString()}</strong>
              </div>
              <div className="flex justify-between font-medium text-emerald-900">
                <span>Server Status:</span>
                <strong className="text-emerald-700">Verified &amp; Logged</strong>
              </div>
              <div className="text-[11px] font-mono text-slate-600 border-t border-emerald-200/60 pt-1 mt-1 truncate">
                {reportRecipients.join(', ')}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPledgeReportSuccessModalOpen(false)}
              className="w-full py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition"
            >
              Close Confirmation Window
            </button>
          </div>
        </div>
      )}

      {/* 3. Schedule Delivery Dates Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-emerald-900 to-[#1E4D2B] text-white p-5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-1">
                  <CalendarDays className="w-3 h-3" /> Automated Delivery Manager
                </div>
                <h3 className="text-lg font-bold font-serif text-white">Schedule Report Delivery Dates</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p className="text-slate-600">
                Select multiple calendar dates and frequency for automated 10:00 AM Pledges Report dispatch to <strong>Luc Valade</strong> &amp; <strong>Saied Mohammed</strong>.
              </p>

              {/* Delivery Frequency Option */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Automated Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleFrequency('daily')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                      scheduleFrequency === 'daily'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Daily 10:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFrequency('weekly')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                      scheduleFrequency === 'weekly'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Every Sunday
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFrequency('custom')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                      scheduleFrequency === 'custom'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Custom Dates
                  </button>
                </div>
              </div>

              {/* Audience Target Segment Selector & Real-Time Counter Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Audience Target Segmentation
                  </label>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Eligible Recipients: {dashboardAudienceStats.eligibleLeads.length} contacts ({dashboardAudienceStats.excludedCount} bounced/responded contacts excluded)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDashboardTargetSegment('unopened_only')}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      dashboardTargetSegment === 'unopened_only'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-extrabold text-[#1E4D2B]">1. Unopened Only (Default)</span>
                      {dashboardTargetSegment === 'unopened_only' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Query: <code className="text-slate-800 font-mono">status == 'Letter Sent' &amp; openCount == 0</code>. Excludes anyone who opened initial email.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDashboardTargetSegment('all_non_responders')}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      dashboardTargetSegment === 'all_non_responders'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-extrabold text-[#1E4D2B]">2. All Non-Responders</span>
                      {dashboardTargetSegment === 'all_non_responders' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Query: <code className="text-slate-800 font-mono">(Letter Sent | Opened) &amp; repliedAt == null</code>. Captures unopened &amp; opened non-responders.
                    </p>
                  </button>
                </div>
              </div>

              {/* Selected Dates Picker List */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Scheduled Campaign &amp; Delivery Dates ({scheduledDates.length} selected)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#D4AF37] text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs border border-amber-400">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" /> Blast will dispatch at exactly 8:00 PM Eastern.
                  </span>
                </div>

                {/* Quick-Select Sunday Buttons */}
                <div className="mb-3 space-y-1 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                    Sunday Campaign Quick-Select (8:00 PM Eastern):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!scheduledDates.includes('2026-09-27')) {
                          setScheduledDates([...scheduledDates, '2026-09-27'].sort());
                        }
                      }}
                      className="px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 flex items-center justify-between cursor-pointer"
                    >
                      <span>Send: Sunday, Sept 27 @ 8:00 PM</span>
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!scheduledDates.includes('2026-10-04')) {
                          setScheduledDates([...scheduledDates, '2026-10-04'].sort());
                        }
                      }}
                      className="px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 flex items-center justify-between cursor-pointer"
                    >
                      <span>Send: Sunday, Oct 4 @ 8:00 PM</span>
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                  </div>
                </div>

                {/* Add new date input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDateInput && !scheduledDates.includes(newDateInput)) {
                        setScheduledDates([...scheduledDates, newDateInput].sort());
                        setNewDateInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1E4D2B] text-white font-bold rounded-xl hover:bg-emerald-900 cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Date
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {scheduledDates.map((dStr) => (
                    <span
                      key={dStr}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-[11px] text-slate-800 shadow-2xs"
                    >
                      <Calendar className="w-3 h-3 text-emerald-700" /> {dStr}
                      <button
                        type="button"
                        onClick={() => setScheduledDates(scheduledDates.filter((x) => x !== dStr))}
                        className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Safety Check Notice */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Pre-Dispatch Safety Protection:</strong> System checks lead statuses at 8:00 PM launch. Leads marked as <em>Replied</em>, <em>Pledged</em>, or <em>Declined</em> are automatically aborted to prevent redundant emails.
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveScheduleDates}
                className="px-5 py-2 bg-[#1E4D2B] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" /> Save Schedule Delivery Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Schedule Success Confirmation Popup Modal */}
      {isScheduleSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
              <Bell className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Delivery Schedule Confirmed!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Automated executive pledge reports are scheduled for 10:00 AM dispatch on selected dates.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Active Schedule Summary:
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Frequency Mode:</span>
                <strong className="capitalize">{scheduleFrequency} Delivery</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Scheduled Dates:</span>
                <strong>{scheduledDates.length} Target Days</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Recipients:</span>
                <strong>Luc Valade &amp; Saied Mohammed</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleSuccessModalOpen(false)}
              className="w-full py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition"
            >
              Close Confirmation Window
            </button>
          </div>
        </div>
      )}

      {/* 5. Sync Tracking & Audit Log Modal */}
      {isSyncTrackingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider mb-1">
                  <RefreshCw className="w-3 h-3" /> Live Tracking Telemetry
                </div>
                <h3 className="text-lg font-bold font-serif text-white">CRM Sync &amp; Audit Tracking</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncTrackingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Vendor Directory</div>
                  <div className="text-lg font-bold font-mono text-slate-900">351 Leads</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Pledges Synced</div>
                  <div className="text-lg font-bold font-mono text-emerald-800">${stats.totalPledgedAmount.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-blue-800 uppercase">Total Opens</div>
                  <div className="text-lg font-bold font-mono text-blue-800">{stats.totalOpens} Opens</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Recent Sync Tracking Logs
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Active
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-200 p-3 font-mono text-[11px] space-y-2 max-h-44 overflow-y-auto">
                  <div className="text-emerald-400">
                    [{new Date().toLocaleTimeString()}] SYNC OK: Synced 351 vendor leads &amp; 11 pledge records.
                  </div>
                  <div className="text-slate-300">
                    [{new Date().toLocaleTimeString()}] TELEMETRY: Open tracking pixel active on Google Workspace.
                  </div>
                  <div className="text-amber-300">
                    [{new Date().toLocaleTimeString()}] AUDIT: Executive report recipients configured (Luc &amp; Saied).
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Last synced: {new Date().toLocaleTimeString()}
              </span>
              <button
                type="button"
                onClick={() => setIsSyncTrackingModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
