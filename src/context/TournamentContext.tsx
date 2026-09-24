import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RegistrationRecord,
  SponsorRecord,
  DonationRecord,
  LeaderboardTeam,
  SponsorTier,
  AddonSelection,
  PlayerInfo,
  RegistrationType,
  ReceiptInfo,
  OutreachLead,
  OutreachEmailTemplate,
  OutreachDailyQuota
} from '../types';
import {
  EVENT_DETAILS,
  INITIAL_REGISTRATIONS,
  INITIAL_SPONSORS,
  INITIAL_DONATIONS,
  INITIAL_LEADERBOARD,
  PRICING_RULES,
  SPONSORSHIP_PACKAGES
} from '../data/initialData';
import {
  DEFAULT_OUTREACH_TEMPLATES,
  INITIAL_OUTREACH_LEADS
} from '../data/initialOutreachData';
import { isEmailSuppressed } from '../data/suppressionList';
import { outreachAnalytics } from '../services/outreachAnalyticsService';
import { convertEasternToUTC } from '../utils/timezoneUtils';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface TournamentContextType {
  registrations: RegistrationRecord[];
  sponsors: SponsorRecord[];
  donations: DonationRecord[];
  leaderboard: LeaderboardTeam[];
  totalRaised: number;
  totalGolfers: number;
  goalAmount: number;
  goalPercentage: number;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  registerTeamOrPlayer: (data: {
    type: RegistrationType;
    teamName?: string;
    primaryContact: PlayerInfo;
    additionalPlayers: PlayerInfo[];
    requestedTeammates?: string[];
    receiptInfo?: ReceiptInfo;
    addons: AddonSelection;
    paymentMethod: 'credit_card' | 'cheque' | 'etransfer' | 'cash' | 'check' | 'invoice';
    notes?: string;
  }) => RegistrationRecord;
  addSponsorship: (data: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    tier: SponsorTier;
    websiteUrl?: string;
    logoUrl?: string;
    customNote?: string;
  }) => SponsorRecord;
  addDonation: (data: {
    donorName: string;
    donorEmail?: string;
    paymentMethod?: 'Cash' | 'e-transfer' | 'Cheque' | string;
    amount: number;
    isAnonymous: boolean;
    tributeType?: 'in_memory_of' | 'in_honor_of' | 'general';
    tributeName?: string;
    message?: string;
  }) => DonationRecord;
  // Golfer & Registration Management
  updateRegistration: (regId: string, updates: Partial<RegistrationRecord>) => void;
  deleteRegistration: (regId: string) => void;
  updateGolfer: (regId: string, playerIndex: number, updates: Partial<PlayerInfo>) => void;
  deleteGolfer: (regId: string, playerIndex: number) => void;
  // Sponsor & Donation Management
  updateSponsor: (sponsorId: string, updates: Partial<SponsorRecord>) => void;
  deleteSponsor: (sponsorId: string) => void;
  updateDonation: (donationId: string, updates: Partial<DonationRecord>) => void;
  deleteDonation: (donationId: string) => void;
  checkInPlayer: (regId: string, cart?: string) => void;
  updatePaymentStatus: (regId: string, status: 'paid' | 'pending') => void;
  updateLeaderboardScore: (squabbitId: string, scoreDelta: number, thruDelta: number) => void;
  resetToDefaults: () => void;
  calculateAddonTotal: (addons: AddonSelection) => number;
  calculateRegistrationTotal: (type: RegistrationType, addons: AddonSelection, golferType?: 'member' | 'other') => number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openRegistrationModal: (preselectedType?: RegistrationType, initialStep?: 1 | 2) => void;
  regModalInitialStep: 1 | 2;
  openDonationModal: (preselectedAmount?: number) => void;
  openSponsorModal: (preselectedTier?: SponsorTier) => void;
  openAgendaModal: () => void;
  openMemorialNoteModal: () => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  openApiKeyModal: () => void;
  isRegModalOpen: boolean;
  setIsRegModalOpen: (open: boolean) => void;
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: (open: boolean) => void;
  isInlineDonationOpen: boolean;
  setIsInlineDonationOpen: (open: boolean) => void;
  isSponsorModalOpen: boolean;
  setIsSponsorModalOpen: (open: boolean) => void;
  isAgendaOpen: boolean;
  setIsAgendaOpen: (open: boolean) => void;
  isMemorialNoteModalOpen: boolean;
  setIsMemorialNoteModalOpen: (open: boolean) => void;
  selectedRegType: RegistrationType;
  selectedSponsorTier: SponsorTier;
  selectedDonationAmount: number;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  lastConfirmation: RegistrationRecord | null;
  setLastConfirmation: (rec: RegistrationRecord | null) => void;
  contactTab: 'inquiry' | 'volunteer';
  setContactTab: (tab: 'inquiry' | 'volunteer') => void;
  goToVolunteerSection: () => void;
  isSplashVisible: boolean;
  triggerSplash: () => void;
  closeSplash: () => void;
  // Outreach CRM & Solicitations Engine
  outreachLeads: OutreachLead[];
  outreachTemplates: OutreachEmailTemplate[];
  addOutreachLead: (lead: Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>) => OutreachLead;
  updateOutreachLead: (id: string, updates: Partial<OutreachLead>) => void;
  deleteOutreachLead: (id: string) => void;
  promoteLeadToSponsor: (leadId: string) => SponsorRecord | null;
  addOutreachTemplate: (template: Omit<OutreachEmailTemplate, 'id' | 'updatedAt'>) => OutreachEmailTemplate;
  updateOutreachTemplate: (id: string, updates: Partial<OutreachEmailTemplate>) => void;
  deleteOutreachTemplate: (id: string) => void;
  importOutreachLeads: (leads: Array<Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>>) => number;
  sendOutreachEmailToLead: (leadId: string, templateId: string, customSubject: string, customBody: string, customBodyHtml?: string) => Promise<{ success: boolean; error?: string }>;
  refreshOutreachTracking: () => Promise<void>;
  resetToOutscraperDirectory: () => void;
  resetToOntarioGolfVendorsDirectory: () => void;
  outreachQuota: OutreachDailyQuota;
  refreshOutreachQuota: () => Promise<void>;
  sendTestTemplateEmail: (params: {
    templateId?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    recipientEmail?: string;
  }) => Promise<{ success: boolean; error?: string; isAuthError?: boolean; helpUrl?: string; messageId?: string }>;
  sendMassOutreachEmails: (params: {
    leadIds: string[];
    templateId?: string;
    subjectTemplate: string;
    bodyTemplate: string;
    batchDelayMs?: number;
  }) => Promise<{
    success: boolean;
    totalRequested: number;
    succeededCount: number;
    failedCount: number;
    skippedDueToQuota: number;
    remainingDailyQuota: number;
    error?: string;
    results?: Array<any>;
  }>;
  scheduleOutreachCampaign: (params: {
    leadIds: string[];
    templateId?: string;
    subjectTemplate: string;
    bodyTemplate: string;
    dateStr: string; // "2026-09-27" or "2026-10-04"
    timeStr?: string; // "20:00"
    targetSegment?: 'unopened_only' | 'all_non_responders';
  }) => Promise<{
    success: boolean;
    message?: string;
    scheduledForEasternDisplay?: string;
    scheduledForUTC?: string;
    error?: string;
  }>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REGISTRATIONS: 'saied_golf_registrations_v4',
  SPONSORS: 'saied_golf_sponsors_v4',
  DONATIONS: 'saied_golf_donations_v4',
  LEADERBOARD: 'saied_golf_leaderboard_v4',
  OUTREACH_LEADS: 'fbgt_outreach_leads_ontario_351',
  OUTREACH_TEMPLATES: 'fbgt_outreach_templates_v2'
};

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed
            .filter((r: any) => {
              const isLuc = r.teamName?.toLowerCase().includes('dummies') || r.primaryContact?.name?.toLowerCase().includes('luc valade');
              const isSaied = r.teamName?.toLowerCase().includes('fairway eagles') || r.primaryContact?.name?.toLowerCase().includes('saied mohammed');
              const isObsoleteDefault = ['reg-102', 'reg-103', 'reg-104'].includes(r.id) || ['Samantha Reed', 'Julian Tremblay', 'David & Karen Sterling'].includes(r.primaryContact?.name) || r.confirmationCode === 'SAIED-6240' || r.id === 'SAIED-6240';
              if (isObsoleteDefault) return false;
              return isLuc || isSaied || (r.id && r.primaryContact?.name && r.type);
            })
            .map((r: any) => ({
              ...r,
              primaryContact: r.primaryContact || {
                id: r.id || 'p-default',
                name: r.captainName || 'Valued Participant',
                email: r.captainEmail || '',
                phone: r.captainPhone || '',
                handicap: '',
                shirtSize: 'L'
              },
              requestedTeammates: Array.isArray(r.requestedTeammates) ? r.requestedTeammates : []
            }));

          const hasLuc = valid.some((r: any) => r.primaryContact?.name?.toLowerCase().includes('luc valade') || r.teamName?.toLowerCase().includes('dummies'));
          const hasSaied = valid.some((r: any) => r.primaryContact?.name?.toLowerCase().includes('saied mohammed') || r.teamName?.toLowerCase().includes('fairway eagles'));

          let result = [...valid];
          if (!hasLuc) {
            const luc = INITIAL_REGISTRATIONS.find(r => r.teamName === 'Team Dummies');
            if (luc) result.unshift(luc);
          }
          if (!hasSaied) {
            const saied = INITIAL_REGISTRATIONS.find(r => r.teamName === 'The Fairway Eagles');
            if (saied) result.push(saied);
          }
          return result;
        }
      }
      return INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [regModalInitialStep, setRegModalInitialStep] = useState<1 | 2>(1);

  const [sponsors, setSponsors] = useState<SponsorRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPONSORS);
      return saved ? JSON.parse(saved) : INITIAL_SPONSORS;
    } catch {
      return INITIAL_SPONSORS;
    }
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Outreach CRM Leads and Templates State (Ontario Golf Vendors Directory Leads)
  const [outreachLeads, setOutreachLeads] = useState<OutreachLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OUTREACH_LEADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 300) {
          // Merge with INITIAL_OUTREACH_LEADS so that any newly added leads (e.g. Mak's Source for Sports)
          // and updated suppression states (Bounced) are guaranteed to be present and up-to-date
          const existingMap = new Map<string, OutreachLead>();
          parsed.forEach((item: OutreachLead) => {
            if (item && item.emailAddress) {
              existingMap.set(item.emailAddress.toLowerCase().trim(), item);
            }
          });

          // Reconcile with latest INITIAL_OUTREACH_LEADS
          const merged = INITIAL_OUTREACH_LEADS.map((initLead) => {
            const emailKey = initLead.emailAddress.toLowerCase().trim();
            const existing = existingMap.get(emailKey);
            // If contact is suppressed/bounced, enforce Bounced status
            if (isEmailSuppressed(emailKey)) {
              return {
                ...(existing || initLead),
                status: 'Bounced',
                notes: initLead.notes || existing?.notes || 'Bounced / blocked address'
              };
            }
            if (existing) {
              return {
                ...initLead,
                ...existing,
                // keep latest phone, address, website if existing lacked them
                contactNumber: existing.contactNumber || initLead.contactNumber,
                address: existing.address || initLead.address,
                city: existing.city || initLead.city,
                prov: existing.prov || initLead.prov,
                businessUrl: existing.businessUrl || initLead.businessUrl
              };
            }
            return initLead;
          });

          // Also include any user-created custom leads from localStorage not in initial dataset
          parsed.forEach((item: OutreachLead) => {
            if (item && item.emailAddress) {
              const emailKey = item.emailAddress.toLowerCase().trim();
              const alreadyIncluded = merged.some((m) => m.emailAddress.toLowerCase().trim() === emailKey);
              if (!alreadyIncluded) {
                merged.push(item);
              }
            }
          });

          return merged;
        }
      }
      return INITIAL_OUTREACH_LEADS;
    } catch {
      return INITIAL_OUTREACH_LEADS;
    }
  });

  const [outreachTemplates, setOutreachTemplates] = useState<OutreachEmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OUTREACH_TEMPLATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((t: any) => t.category === 'hole_contest_sponsorship')) {
          return parsed;
        }
      }
      return DEFAULT_OUTREACH_TEMPLATES;
    } catch {
      return DEFAULT_OUTREACH_TEMPLATES;
    }
  });

  const [outreachQuota, setOutreachQuota] = useState<OutreachDailyQuota>({
    date: new Date().toISOString().split('T')[0],
    sentToday: 0,
    dailyLimit: 1500,
    remaining: 1500
  });

  const refreshOutreachQuota = async () => {
    try {
      const resp = await fetch('/api/outreach/quota');
      if (resp.ok) {
        const data = await resp.json();
        setOutreachQuota(data);
      }
    } catch (e) {
      console.warn('Could not fetch outreach quota:', e);
    }
  };

  useEffect(() => {
    refreshOutreachQuota();
  }, []);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isInlineDonationOpen, setIsInlineDonationOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [isMemorialNoteModalOpen, setIsMemorialNoteModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpenState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      return p === '/admin' || p.startsWith('/admin') || h === '#/admin' || h === '#admin';
    }
    return false;
  });

  const setIsAdminOpen = (open: boolean) => {
    setIsAdminOpenState(open);
    if (typeof window !== 'undefined') {
      if (open) {
        if (window.location.pathname !== '/admin' && window.location.hash !== '#/admin') {
          window.history.pushState({ page: 'admin' }, '', '/admin');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (window.location.pathname === '/admin' || window.location.hash === '#/admin' || window.location.hash === '#admin') {
          window.history.pushState({ page: 'home' }, '', '/');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.toLowerCase();
        const h = window.location.hash.toLowerCase();
        const shouldBeAdmin = p === '/admin' || p.startsWith('/admin') || h === '#/admin' || h === '#admin';
        setIsAdminOpenState(shouldBeAdmin);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('saied_tournament_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (passcode: string): boolean => {
    const normalized = passcode.trim().toLowerCase();
    const validCodes = [
      'admin',
      'admin2026',
      'luc',
      'luc2026',
      '2026',
      'saied2026',
      'luc.valade@gmail.com',
      'naseem2026'
    ];
    if (validCodes.includes(normalized)) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('saied_tournament_admin_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('saied_tournament_admin_auth');
    } catch {
      // ignore
    }
  };

  const [selectedRegType, setSelectedRegType] = useState<RegistrationType>('foursome');
  const [selectedSponsorTier, setSelectedSponsorTier] = useState<SponsorTier>('eagle');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number>(100);
  const [lastConfirmation, setLastConfirmation] = useState<RegistrationRecord | null>(null);
  const [contactTab, setContactTab] = useState<'inquiry' | 'volunteer'>('inquiry');
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(() => {
    try {
      const alreadyShown = sessionStorage.getItem('fragrant_breeze_splash_shown');
      return !alreadyShown;
    } catch {
      return false;
    }
  });

  const triggerSplash = () => setIsSplashVisible(true);
  const closeSplash = () => {
    setIsSplashVisible(false);
    try {
      sessionStorage.setItem('fragrant_breeze_splash_shown', 'true');
    } catch {
      // ignore
    }
  };

  const goToVolunteerSection = () => {
    setContactTab('volunteer');
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(sponsors));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [sponsors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [leaderboard]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OUTREACH_LEADS, JSON.stringify(outreachLeads));
      outreachAnalytics.updateLeadsDirectory(outreachLeads);
    } catch (e) {
      console.warn('Outreach leads storage sync failed', e);
    }
  }, [outreachLeads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OUTREACH_TEMPLATES, JSON.stringify(outreachTemplates));
    } catch (e) {
      console.warn('Outreach templates storage sync failed', e);
    }
  }, [outreachTemplates]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const calculateAddonTotal = (addons: AddonSelection): number => {
    // 3 mulligans bundle is $50, singles are $20
    const mPacks3 = Math.floor(addons.mulligansCount / 3);
    const mSingles = addons.mulligansCount % 3;
    const mulliganCost = (mPacks3 * PRICING_RULES.mulliganPack3) + (mSingles * PRICING_RULES.mulliganSingle);

    const raffleCost = (addons.rafflePacks10 * PRICING_RULES.rafflePack10) + (addons.rafflePacks25 * PRICING_RULES.rafflePack25);
    const contestCost = (addons.puttingContestCount * PRICING_RULES.puttingContest) + (addons.tigerDriveCount * PRICING_RULES.tigerDrive);

    return mulliganCost + raffleCost + contestCost;
  };

  const calculateRegistrationTotal = (
    type: RegistrationType,
    addons: AddonSelection,
    golferType: 'member' | 'other' = 'other'
  ): number => {
    let base = golferType === 'member' ? PRICING_RULES.memberGolfer : PRICING_RULES.otherGolfer;
    if (type === 'foursome') {
      base = PRICING_RULES.foursomeTeam;
    } else if (type === 'dinner_only') {
      base = PRICING_RULES.dinnerOnly;
    }
    return base + calculateAddonTotal(addons);
  };

  // Financial calculations
  const regRevenue = registrations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  const crmPledgeRevenue = (Array.isArray(outreachLeads) ? outreachLeads : [])
    .filter((l) => l && (l.status === 'Pledged' || (Number(l.pledgedAmount) || 0) > 0))
    .reduce((sum, l) => sum + (Number(l?.pledgedAmount) || 0), 0);

  const confirmedSponsorRevenue = sponsors.reduce((sum, s) => {
    const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === s.tier);
    return sum + (pkg?.amount || s.amount || 0);
  }, 0);

  const sponsorRevenue = confirmedSponsorRevenue + crmPledgeRevenue;
  const directDonationRevenue = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const totalRaised = regRevenue + sponsorRevenue + directDonationRevenue;
  const goalAmount = EVENT_DETAILS.goalAmount;
  const goalPercentage = Math.min(100, Math.round((totalRaised / goalAmount) * 100));

  const totalGolfers = registrations.reduce((sum, r) => {
    if (r.type === 'dinner_only') return sum;
    return sum + 1 + (r.additionalPlayers?.length || 0);
  }, 0);

  const registerTeamOrPlayer = (data: {
    type: RegistrationType;
    golferType?: 'member' | 'other';
    teamName?: string;
    primaryContact: PlayerInfo;
    additionalPlayers: PlayerInfo[];
    requestedTeammates?: string[];
    receiptInfo?: ReceiptInfo;
    addons: AddonSelection;
    paymentMethod: 'credit_card' | 'cheque' | 'etransfer' | 'cash' | 'check' | 'invoice';
    notes?: string;
  }): RegistrationRecord => {
    const totalAmount = calculateRegistrationTotal(data.type, data.addons, data.golferType);
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const confirmationCode = `SAIED-${codeNum}`;
    const isOfflinePayment = data.paymentMethod === 'cheque' || data.paymentMethod === 'etransfer' || data.paymentMethod === 'cash';

    const newReg: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      type: data.type,
      golferType: data.golferType,
      teamName: data.teamName || (data.type === 'foursome' ? `${data.primaryContact.name}'s Foursome` : undefined),
      primaryContact: data.primaryContact,
      additionalPlayers: data.additionalPlayers,
      requestedTeammates: data.requestedTeammates,
      receiptInfo: data.receiptInfo,
      addons: data.addons,
      totalAmount,
      paymentStatus: isOfflinePayment ? 'pending' : 'paid',
      paymentMethod: data.paymentMethod,
      confirmationCode,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      assignedStartingHole: (registrations.length % 18) + 1,
      assignedCart: `Cart #${registrations.length + 1}${data.type === 'foursome' ? 'A & B' : 'A'}`,
      notes: data.notes,
      routedToEmail: isOfflinePayment ? 'ms_smnm@outlook.com' : undefined
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setLastConfirmation(newReg);
    addToast(
      'success',
      'Registration Confirmed!',
      `Welcome ${data.primaryContact.name}! Your confirmation code is ${confirmationCode}.`
    );
    return newReg;
  };

  const addSponsorship = (data: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    tier: SponsorTier;
    websiteUrl?: string;
    logoUrl?: string;
    customNote?: string;
  }): SponsorRecord => {
    const newSponsor: SponsorRecord = {
      id: `sp-${Date.now()}`,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      tier: data.tier,
      websiteUrl: data.websiteUrl,
      logoUrl: data.logoUrl,
      pledgedAt: new Date().toISOString(),
      status: 'confirmed',
      customNote: data.customNote
    };

    setSponsors((prev) => [newSponsor, ...prev]);
    const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === data.tier);

    // Dispatch automated pledge notification email to Luc Valade & Saied Mohammed
    fetch('/api/notify-pledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        tier: pkg?.name || data.tier,
        pledgedAmount: pkg?.amount || 0,
        notes: data.customNote,
        source: 'Website Sponsor Pledge Modal'
      })
    }).catch(err => console.warn('Pledge notification call error:', err));

    addToast(
      'success',
      'Sponsorship Pledged!',
      `Thank you to ${data.companyName} for becoming a ${pkg?.name || data.tier} Sponsor!`
    );
    return newSponsor;
  };

  const addDonation = (data: {
    donorName: string;
    donorEmail?: string;
    paymentMethod?: 'Cash' | 'e-transfer' | 'Cheque' | string;
    amount: number;
    isAnonymous: boolean;
    tributeType?: 'in_memory_of' | 'in_honor_of' | 'general';
    tributeName?: string;
    message?: string;
  }): DonationRecord => {
    const newDonation: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: data.isAnonymous ? 'Anonymous Supporter' : data.donorName,
      donorEmail: data.donorEmail,
      paymentMethod: data.paymentMethod,
      amount: data.amount,
      isAnonymous: data.isAnonymous,
      tributeType: data.tributeType || 'in_memory_of',
      tributeName: data.tributeName || EVENT_DETAILS.memorialHonoree,
      message: data.message,
      donatedAt: new Date().toISOString()
    };

    setDonations((prev) => [newDonation, ...prev]);
    addToast(
      'success',
      'Memorial Donation Received',
      `Thank you for your generous gift of $${data.amount.toLocaleString()} in loving memory of ${newDonation.tributeName}.`
    );
    return newDonation;
  };

  // Golfer & Registration Management
  const updateRegistration = (regId: string, updates: Partial<RegistrationRecord>) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, ...updates } : r))
    );
    addToast('success', 'Registration Updated', 'Registration details modified successfully.');
  };

  const deleteRegistration = (regId: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== regId));
    addToast('info', 'Registration Deleted', 'Registration was removed from the roster.');
  };

  const updateGolfer = (regId: string, playerIndex: number, playerUpdates: Partial<PlayerInfo>) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id !== regId) return reg;
        if (playerIndex === 0) {
          return {
            ...reg,
            primaryContact: { ...reg.primaryContact, ...playerUpdates }
          };
        } else {
          const addIdx = playerIndex - 1;
          const newAdditionals = [...(reg.additionalPlayers || [])];
          if (newAdditionals[addIdx]) {
            newAdditionals[addIdx] = { ...newAdditionals[addIdx], ...playerUpdates };
          }
          return {
            ...reg,
            additionalPlayers: newAdditionals
          };
        }
      })
    );
    addToast('success', 'Golfer Updated', 'Golfer profile modified successfully.');
  };

  const deleteGolfer = (regId: string, playerIndex: number) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id !== regId) return reg;
        if (playerIndex === 0) {
          // If captain is deleted and additional players exist, promote player 2 to captain
          if (reg.additionalPlayers && reg.additionalPlayers.length > 0) {
            const [promoted, ...remaining] = reg.additionalPlayers;
            return {
              ...reg,
              primaryContact: promoted,
              additionalPlayers: remaining
            };
          } else {
            return {
              ...reg,
              primaryContact: {
                id: `player-${Date.now()}`,
                name: 'Unassigned Golfer',
                email: 'tbd@example.com',
                phone: '',
                handicap: ''
              }
            };
          }
        } else {
          const addIdx = playerIndex - 1;
          const newAdditionals = reg.additionalPlayers.filter((_, idx) => idx !== addIdx);
          return {
            ...reg,
            additionalPlayers: newAdditionals
          };
        }
      })
    );
    addToast('info', 'Golfer Removed', 'Golfer removed from the roster.');
  };

  // Sponsor Management
  const updateSponsor = (sponsorId: string, updates: Partial<SponsorRecord>) => {
    setSponsors((prev) =>
      prev.map((s) => (s.id === sponsorId ? { ...s, ...updates } : s))
    );
    addToast('success', 'Sponsor Updated', 'Sponsor partner record modified.');
  };

  const deleteSponsor = (sponsorId: string) => {
    setSponsors((prev) => prev.filter((s) => s.id !== sponsorId));
    addToast('info', 'Sponsor Deleted', 'Sponsor partner record was removed.');
  };

  // Donation Management
  const updateDonation = (donationId: string, updates: Partial<DonationRecord>) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, ...updates } : d))
    );
    addToast('success', 'Donation Updated', 'Memorial tribute gift record modified.');
  };

  const deleteDonation = (donationId: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== donationId));
    addToast('info', 'Donation Deleted', 'Donation record was removed.');
  };

  const checkInPlayer = (regId: string, cart?: string) => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === regId) {
          const updated = { ...r, checkedIn: !r.checkedIn };
          if (cart) updated.assignedCart = cart;
          return updated;
        }
        return r;
      })
    );
    addToast('info', 'Check-in Updated', 'Golfer status updated successfully.');
  };

  const updatePaymentStatus = (regId: string, status: 'paid' | 'pending') => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === regId) {
          return { ...r, paymentStatus: status };
        }
        return r;
      })
    );
    addToast('success', 'Payment Status Updated', `Registration payment marked as ${status.toUpperCase()}.`);
  };

  const updateLeaderboardScore = (squabbitId: string, scoreDelta: number, thruDelta: number) => {
    setLeaderboard((prev) =>
      prev
        .map((team) => {
          if (team.squabbitId === squabbitId) {
            const newThru = Math.min(18, team.thruHoles + thruDelta);
            const newScoreToPar = team.scoreToPar + scoreDelta;
            const newStatus = newThru === 18 ? 'F' : 'Live';
            return {
              ...team,
              scoreToPar: newScoreToPar,
              thruHoles: newThru,
              status: newStatus as 'F' | 'Live'
            };
          }
          return team;
        })
        .sort((a, b) => a.scoreToPar - b.scoreToPar)
        .map((team, idx) => ({ ...team, rank: idx + 1 }))
    );
    addToast('info', 'Squabbit Synced', 'Live leaderboard scores updated.');
  };

  const resetToDefaults = () => {
    setRegistrations(INITIAL_REGISTRATIONS);
    setSponsors(INITIAL_SPONSORS);
    setDonations(INITIAL_DONATIONS);
    setLeaderboard(INITIAL_LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.SPONSORS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    addToast('info', 'Reset Complete', 'Restored default tournament data.');
  };

  const openRegistrationModal = (preselectedType: RegistrationType = 'foursome', initialStep: 1 | 2 = 1) => {
    setSelectedRegType(preselectedType);
    setRegModalInitialStep(initialStep);
    setIsRegModalOpen(true);
    setTimeout(() => {
      const el = document.getElementById('inline-registration-container') || document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const openDonationModal = (preselectedAmount: number = 100) => {
    setSelectedDonationAmount(preselectedAmount);
    setIsDonationModalOpen(true);
  };

  const openSponsorModal = (preselectedTier: SponsorTier = 'eagle') => {
    setSelectedSponsorTier(preselectedTier);
    setIsSponsorModalOpen(true);
  };

  const openAgendaModal = () => {
    setIsAgendaOpen(true);
  };

  const openMemorialNoteModal = () => {
    setIsMemorialNoteModalOpen(true);
  };

  const openApiKeyModal = () => {
    setIsApiKeyModalOpen(true);
  };

  // Outreach CRM Operations
  const addOutreachLead = (leadData: Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>): OutreachLead => {
    const newLead: OutreachLead = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOutreachLeads((prev) => [newLead, ...prev]);
    addToast('success', 'Lead Added', `${newLead.businessName} was added to the Outreach Directory.`);
    return newLead;
  };

  const updateOutreachLead = (id: string, updates: Partial<OutreachLead>) => {
    setOutreachLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          return {
            ...lead,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return lead;
      })
    );
  };

  const deleteOutreachLead = (id: string) => {
    setOutreachLeads((prev) => prev.filter((l) => l.id !== id));
    addToast('info', 'Lead Removed', 'Lead was deleted from your directory.');
  };

  const promoteLeadToSponsor = (leadId: string): SponsorRecord | null => {
    const lead = outreachLeads.find((l) => l.id === leadId);
    if (!lead) return null;

    let tier: SponsorTier = 'hole';
    if (lead.targetTier.includes('Title')) tier = 'presenting';
    else if (lead.targetTier.includes('Eagle')) tier = 'eagle';
    else if (lead.targetTier.includes('Birdie') || lead.targetTier.includes('Beverage')) tier = 'birdie';
    else if (lead.targetTier.includes('Hole')) tier = 'hole';
    else tier = 'contest';

    const newSponsor = addSponsorship({
      companyName: lead.businessName,
      contactName: lead.recipientName,
      email: lead.emailAddress,
      phone: lead.contactNumber || '',
      tier,
      websiteUrl: lead.businessUrl,
      customNote: `Promoted from Outreach CRM (${lead.notes || 'Pledged sponsor package'})`
    });

    const defaultAmount = tier === 'presenting' ? 10000 : tier === 'eagle' ? 5000 : tier === 'birdie' ? 2500 : 1000;

    updateOutreachLead(leadId, {
      status: 'Pledged',
      pledgedAmount: lead.pledgedAmount || defaultAmount
    });

    addToast(
      'success',
      'Sponsor Promoted',
      `${lead.businessName} has been converted into an official confirmed Tournament Sponsor!`
    );
    return newSponsor;
  };

  const addOutreachTemplate = (tplData: Omit<OutreachEmailTemplate, 'id' | 'updatedAt'>): OutreachEmailTemplate => {
    const newTpl: OutreachEmailTemplate = {
      ...tplData,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      updatedAt: new Date().toISOString()
    };
    setOutreachTemplates((prev) => [...prev, newTpl]);
    addToast('success', 'Template Created', `"${newTpl.title}" template saved.`);
    return newTpl;
  };

  const updateOutreachTemplate = (id: string, updates: Partial<OutreachEmailTemplate>) => {
    setOutreachTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
    addToast('success', 'Template Updated', 'Letter template changes saved.');
  };

  const deleteOutreachTemplate = (id: string) => {
    setOutreachTemplates((prev) => prev.filter((t) => t.id !== id));
    addToast('info', 'Template Removed', 'Template was removed.');
  };

  const importOutreachLeads = (newLeadsData: Array<Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>>): number => {
    const now = new Date().toISOString();
    const created: OutreachLead[] = newLeadsData.map((d, i) => ({
      ...d,
      id: `lead-import-${Date.now()}-${i}`,
      createdAt: now,
      updatedAt: now
    }));
    setOutreachLeads((prev) => [...created, ...prev]);
    addToast('success', 'CSV Import Complete', `Imported ${created.length} new prospective leads into your Outreach CRM.`);
    return created.length;
  };

  const sendOutreachEmailToLead = async (
    leadId: string,
    templateId: string,
    customSubject: string,
    customBody: string,
    customBodyHtml?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const lead = outreachLeads.find((l) => l.id === leadId);
    if (!lead) return { success: false, error: 'Lead not found' };

    try {
      const resp = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          recipientEmail: lead.emailAddress,
          recipientName: lead.recipientName,
          businessName: lead.businessName,
          subject: customSubject,
          bodyText: customBody,
          bodyHtml: customBodyHtml,
          templateId
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        const errorMsg = data.error || data.warning || 'Failed to dispatch email';
        addToast('error', 'Email Dispatch Failed', errorMsg);
        return { success: false, error: errorMsg };
      }

      updateOutreachLead(leadId, {
        status: lead.status === 'Identified' ? 'Letter Sent' : lead.status,
        lastContactDate: new Date().toISOString(),
        lastEmailSubject: customSubject,
        lastEmailLogId: data.logId
      });

      outreachAnalytics.recordSentEmail({
        leadId: lead.id,
        businessName: lead.businessName,
        recipientEmail: lead.emailAddress,
        recipientName: lead.recipientName,
        subject: customSubject,
        templateId,
        logId: data.logId
      });

      addToast('success', 'Outreach Letter Sent!', `Dispatched to ${lead.recipientName} (${lead.emailAddress}) with open tracking pixel.`);
      return { success: true };
    } catch (e: any) {
      const msg = e?.message || 'Network error dispatching email';
      addToast('error', 'Network Error', msg);
      return { success: false, error: msg };
    }
  };

  const resetToOntarioGolfVendorsDirectory = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.OUTREACH_LEADS, JSON.stringify(INITIAL_OUTREACH_LEADS));
      localStorage.setItem(STORAGE_KEYS.OUTREACH_TEMPLATES, JSON.stringify(DEFAULT_OUTREACH_TEMPLATES));
    } catch (e) {
      console.warn('Storage error on reset:', e);
    }
    setOutreachLeads(INITIAL_OUTREACH_LEADS);
    setOutreachTemplates(DEFAULT_OUTREACH_TEMPLATES);
    addToast(
      'success',
      'Ontario Golf Vendors Directory Loaded',
      `Synchronized all ${INITIAL_OUTREACH_LEADS.length} verified prospect leads from Ontario Golf Vendors Directory (Col A: Business Name, Col G: Email Address).`
    );
  };
  const resetToOutscraperDirectory = resetToOntarioGolfVendorsDirectory;

  const refreshOutreachTracking = async () => {
    try {
      const resp = await fetch('/api/outreach/logs');
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.logs)) {
          const logsByLead = new Map<string, any>();
          for (const l of data.logs) {
            if (l.leadId && (!logsByLead.has(l.leadId) || l.openCount > (logsByLead.get(l.leadId)?.openCount || 0))) {
              logsByLead.set(l.leadId, l);
            }
          }

          setOutreachLeads((prev) =>
            prev.map((lead) => {
              const matchingLog = logsByLead.get(lead.id);
              if (matchingLog && matchingLog.openCount > (lead.openCount || 0)) {
                return {
                  ...lead,
                  openCount: matchingLog.openCount,
                  status:
                    lead.status === 'Letter Sent' || lead.status === 'Followed Up' ? 'Opened' : lead.status
                };
              }
              return lead;
            })
          );
        }
      }
    } catch (e) {
      console.warn('Could not refresh outreach tracking:', e);
    }
  };

  const sendTestTemplateEmail = async (params: {
    templateId?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    recipientEmail?: string;
  }): Promise<{ success: boolean; error?: string; isAuthError?: boolean; helpUrl?: string; messageId?: string }> => {
    try {
      const resp = await fetch('/api/outreach/send-test-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: params.templateId,
          subject: params.subject,
          bodyText: params.bodyText,
          bodyHtml: params.bodyHtml,
          recipientEmail: params.recipientEmail || 'luc.valade@gmail.com'
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        const errorMsg = data.error || 'Failed to dispatch test template email';
        addToast('error', 'Test Email Error', errorMsg);
        return {
          success: false,
          error: errorMsg,
          isAuthError: data.isAuthError,
          helpUrl: data.helpUrl
        };
      }

      addToast(
        'success',
        'Test Email Sent!',
        `Delivered template preview to ${params.recipientEmail || 'luc.valade@gmail.com'}.`
      );
      return { success: true, messageId: data.messageId };
    } catch (e: any) {
      const msg = e?.message || 'Network error sending test template email';
      addToast('error', 'Network Error', msg);
      return { success: false, error: msg };
    }
  };

  const sendMassOutreachEmails = async (params: {
    leadIds: string[];
    templateId?: string;
    subjectTemplate: string;
    bodyTemplate: string;
    batchDelayMs?: number;
  }): Promise<{
    success: boolean;
    totalRequested: number;
    succeededCount: number;
    failedCount: number;
    skippedDueToQuota: number;
    remainingDailyQuota: number;
    error?: string;
    results?: Array<any>;
  }> => {
    const selectedLeads = outreachLeads.filter((l) => params.leadIds.includes(l.id));
    if (selectedLeads.length === 0) {
      return {
        success: false,
        totalRequested: 0,
        succeededCount: 0,
        failedCount: 0,
        skippedDueToQuota: 0,
        remainingDailyQuota: outreachQuota.remaining,
        error: 'No valid leads selected for mass dispatch'
      };
    }

    try {
      const resp = await fetch('/api/outreach/send-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedLeads.map((l) => ({
            leadId: l.id,
            recipientEmail: l.emailAddress,
            recipientName: l.recipientName,
            businessName: l.businessName,
            city: l.city,
            targetTier: l.targetTier
          })),
          templateId: params.templateId,
          subjectTemplate: params.subjectTemplate,
          bodyTemplate: params.bodyTemplate,
          batchDelayMs: params.batchDelayMs || 250
        })
      });

      const data = await resp.json();

      // Refresh daily quota after batch
      refreshOutreachQuota();

      if (!resp.ok && !data.results) {
        const errorMsg = data.error || 'Failed to dispatch mass email campaign';
        addToast('error', 'Mass Dispatch Failed', errorMsg);
        return {
          success: false,
          totalRequested: selectedLeads.length,
          succeededCount: 0,
          failedCount: selectedLeads.length,
          skippedDueToQuota: 0,
          remainingDailyQuota: outreachQuota.remaining,
          error: errorMsg
        };
      }

      // Update lead statuses for all succeeded leads
      if (Array.isArray(data.results)) {
        const successfulLeadIds = new Set(
          data.results.filter((r: any) => r.status === 'sent').map((r: any) => r.leadId)
        );

        setOutreachLeads((prev) =>
          prev.map((lead) => {
            if (successfulLeadIds.has(lead.id)) {
              return {
                ...lead,
                status: lead.status === 'Identified' ? 'Letter Sent' : lead.status,
                lastContactDate: new Date().toISOString(),
                lastEmailSubject: params.subjectTemplate.replace(/\{\{\s*business_name\s*\}\}/gi, lead.businessName)
              };
            }
            return lead;
          })
        );
      }

      if (data.succeededCount > 0) {
        addToast(
          'success',
          'Mass Campaign Dispatched!',
          `Successfully dispatched ${data.succeededCount} mail merge letters via Google Workspace SMTP.`
        );
      }

      return {
        success: data.success,
        totalRequested: data.totalRequested || selectedLeads.length,
        succeededCount: data.succeededCount || 0,
        failedCount: data.failedCount || 0,
        skippedDueToQuota: data.skippedDueToQuota || 0,
        remainingDailyQuota: data.remainingDailyQuota !== undefined ? data.remainingDailyQuota : outreachQuota.remaining,
        error: data.error,
        results: data.results
      };
    } catch (e: any) {
      const msg = e?.message || 'Network error during mass mail dispatch';
      addToast('error', 'Network Error', msg);
      return {
        success: false,
        totalRequested: selectedLeads.length,
        succeededCount: 0,
        failedCount: selectedLeads.length,
        skippedDueToQuota: 0,
        remainingDailyQuota: outreachQuota.remaining,
        error: msg
      };
    }
  };

  const scheduleOutreachCampaign = async (params: {
    leadIds: string[];
    templateId?: string;
    subjectTemplate: string;
    bodyTemplate: string;
    dateStr: string;
    timeStr?: string;
    targetSegment?: 'unopened_only' | 'all_non_responders';
  }) => {
    const time = params.timeStr || '20:00';
    const { utcISO, easternDisplay } = convertEasternToUTC(params.dateStr, time);

    const selectedLeads = outreachLeads.filter((l) => params.leadIds.includes(l.id));

    if (selectedLeads.length === 0) {
      addToast('error', 'No Leads Selected', 'Please select at least one recipient to schedule a campaign.');
      return { success: false, error: 'No leads selected' };
    }

    try {
      const resp = await fetch('/api/outreach/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: params.leadIds,
          recipients: selectedLeads.map((l) => ({
            leadId: l.id,
            recipientEmail: l.emailAddress,
            recipientName: l.recipientName,
            businessName: l.businessName,
            city: l.city,
            targetTier: l.targetTier,
            status: l.status,
            openCount: l.openCount || 0
          })),
          templateId: params.templateId || 'precision-sched',
          subjectTemplate: params.subjectTemplate,
          bodyTemplate: params.bodyTemplate,
          scheduledForLocal: `${params.dateStr}T${time}`,
          timezone: 'America/Toronto',
          scheduledForUTC: utcISO,
          scheduledForEasternDisplay: easternDisplay,
          targetSegment: params.targetSegment || 'unopened_only'
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        addToast('error', 'Scheduling Failed', data.error || 'Failed to schedule campaign');
        return { success: false, error: data.error };
      }

      addToast(
        'success',
        'Campaign Scheduled!',
        `Blast queued for exactly 8:00 PM Eastern (${easternDisplay}) for ${selectedLeads.length} recipients.`
      );

      return {
        success: true,
        message: data.message,
        scheduledForEasternDisplay: easternDisplay,
        scheduledForUTC: utcISO
      };
    } catch (e: any) {
      const msg = e?.message || 'Failed to connect to scheduler backend';
      addToast('error', 'Network Error', msg);
      return { success: false, error: msg };
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        registrations,
        sponsors,
        donations,
        leaderboard,
        totalRaised,
        totalGolfers,
        goalAmount,
        goalPercentage,
        toasts,
        addToast,
        removeToast,
        registerTeamOrPlayer,
        addSponsorship,
        addDonation,
        checkInPlayer,
        updatePaymentStatus,
        updateRegistration,
        deleteRegistration,
        updateGolfer,
        deleteGolfer,
        updateSponsor,
        deleteSponsor,
        updateDonation,
        deleteDonation,
        updateLeaderboardScore,
        resetToDefaults,
        calculateAddonTotal,
        calculateRegistrationTotal,
        activeTab,
        setActiveTab,
        openRegistrationModal,
        regModalInitialStep,
        openDonationModal,
        openSponsorModal,
        openAgendaModal,
        openMemorialNoteModal,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        openApiKeyModal,
        isRegModalOpen,
        setIsRegModalOpen,
        isDonationModalOpen,
        setIsDonationModalOpen,
        isInlineDonationOpen,
        setIsInlineDonationOpen,
        isSponsorModalOpen,
        setIsSponsorModalOpen,
        isAgendaOpen,
        setIsAgendaOpen,
        isMemorialNoteModalOpen,
        setIsMemorialNoteModalOpen,
        selectedRegType,
        selectedSponsorTier,
        selectedDonationAmount,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        lastConfirmation,
        setLastConfirmation,
        contactTab,
        setContactTab,
        goToVolunteerSection,
        isSplashVisible,
        triggerSplash,
        closeSplash,
        // Outreach CRM & Solicitations Engine
        outreachLeads,
        outreachTemplates,
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
        resetToOntarioGolfVendorsDirectory,
        outreachQuota,
        refreshOutreachQuota,
        sendTestTemplateEmail,
        sendMassOutreachEmails,
        scheduleOutreachCampaign
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
