import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RegistrationRecord,
  SponsorRecord,
  DonationRecord,
  LeaderboardTeam,
  SponsorTier,
  AddonSelection,
  PlayerInfo,
  RegistrationType
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
    addons: AddonSelection;
    paymentMethod: 'credit_card' | 'cheque' | 'cash' | 'check' | 'invoice';
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
    amount: number;
    isAnonymous: boolean;
    tributeType?: 'in_memory_of' | 'in_honor_of' | 'general';
    tributeName?: string;
    message?: string;
  }) => DonationRecord;
  checkInPlayer: (regId: string, cart?: string) => void;
  updatePaymentStatus: (regId: string, status: 'paid' | 'pending') => void;
  updateLeaderboardScore: (squabbitId: string, scoreDelta: number, thruDelta: number) => void;
  resetToDefaults: () => void;
  calculateAddonTotal: (addons: AddonSelection) => number;
  calculateRegistrationTotal: (type: RegistrationType, addons: AddonSelection) => number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openRegistrationModal: (preselectedType?: RegistrationType) => void;
  openDonationModal: (preselectedAmount?: number) => void;
  openSponsorModal: (preselectedTier?: SponsorTier) => void;
  openAgendaModal: () => void;
  isRegModalOpen: boolean;
  setIsRegModalOpen: (open: boolean) => void;
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: (open: boolean) => void;
  isSponsorModalOpen: boolean;
  setIsSponsorModalOpen: (open: boolean) => void;
  isAgendaOpen: boolean;
  setIsAgendaOpen: (open: boolean) => void;
  selectedRegType: RegistrationType;
  selectedSponsorTier: SponsorTier;
  selectedDonationAmount: number;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  lastConfirmation: RegistrationRecord | null;
  setLastConfirmation: (rec: RegistrationRecord | null) => void;
  contactTab: 'inquiry' | 'volunteer';
  setContactTab: (tab: 'inquiry' | 'volunteer') => void;
  goToVolunteerSection: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REGISTRATIONS: 'saied_golf_registrations_v2',
  SPONSORS: 'saied_golf_sponsors_v2',
  DONATIONS: 'saied_golf_donations_v2',
  LEADERBOARD: 'saied_golf_leaderboard_v2'
};

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

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

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedRegType, setSelectedRegType] = useState<RegistrationType>('foursome');
  const [selectedSponsorTier, setSelectedSponsorTier] = useState<SponsorTier>('eagle');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number>(100);
  const [lastConfirmation, setLastConfirmation] = useState<RegistrationRecord | null>(null);
  const [contactTab, setContactTab] = useState<'inquiry' | 'volunteer'>('inquiry');

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

  const calculateRegistrationTotal = (type: RegistrationType, addons: AddonSelection): number => {
    let base = PRICING_RULES.individualGolfer;
    if (type === 'foursome') {
      base = PRICING_RULES.foursomeTeam;
    } else if (type === 'dinner_only') {
      base = PRICING_RULES.dinnerOnly;
    }
    return base + calculateAddonTotal(addons);
  };

  // Financial calculations
  const regRevenue = registrations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const sponsorRevenue = sponsors.reduce((sum, s) => {
    const pkg = SPONSORSHIP_PACKAGES.find(p => p.id === s.tier);
    return sum + (pkg?.amount || 0);
  }, 0);
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
    teamName?: string;
    primaryContact: PlayerInfo;
    additionalPlayers: PlayerInfo[];
    addons: AddonSelection;
    paymentMethod: 'credit_card' | 'cheque' | 'cash' | 'check' | 'invoice';
    notes?: string;
  }): RegistrationRecord => {
    const totalAmount = calculateRegistrationTotal(data.type, data.addons);
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const confirmationCode = `SAIED-${codeNum}`;
    const isOfflinePayment = data.paymentMethod === 'cheque' || data.paymentMethod === 'cash';

    const newReg: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      type: data.type,
      teamName: data.teamName || (data.type === 'foursome' ? `${data.primaryContact.name}'s Foursome` : undefined),
      primaryContact: data.primaryContact,
      additionalPlayers: data.additionalPlayers,
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

  const openRegistrationModal = (preselectedType: RegistrationType = 'foursome') => {
    setSelectedRegType(preselectedType);
    setIsRegModalOpen(true);
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
        updateLeaderboardScore,
        resetToDefaults,
        calculateAddonTotal,
        calculateRegistrationTotal,
        activeTab,
        setActiveTab,
        openRegistrationModal,
        openDonationModal,
        openSponsorModal,
        openAgendaModal,
        isRegModalOpen,
        setIsRegModalOpen,
        isDonationModalOpen,
        setIsDonationModalOpen,
        isSponsorModalOpen,
        setIsSponsorModalOpen,
        isAgendaOpen,
        setIsAgendaOpen,
        selectedRegType,
        selectedSponsorTier,
        selectedDonationAmount,
        isAdminOpen,
        setIsAdminOpen,
        lastConfirmation,
        setLastConfirmation,
        contactTab,
        setContactTab,
        goToVolunteerSection
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
