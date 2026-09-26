export type RegistrationType = 'individual' | 'foursome' | 'dinner_only';

export interface PlayerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  handicap?: string;
  shirtSize?: 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | 'None';
  dietaryRestrictions?: string;
}

export interface AddonSelection {
  mulligansCount: number; // $20 each or 3 for $50
  rafflePacks10: number; // $25 (10 tickets)
  rafflePacks25: number; // $50 (25 tickets)
  puttingContestCount: number; // $20
  tigerDriveCount: number; // $25
}

export interface ReceiptInfo {
  needed: boolean;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export type PaymentStatus = 'paid' | 'pending';
export type PaymentMethod = 'credit_card' | 'cheque' | 'etransfer' | 'cash' | 'check' | 'invoice';

export interface RegistrationRecord {
  id: string;
  type: RegistrationType;
  golferType?: 'member' | 'other';
  teamName?: string;
  targetTier?: string;
  primaryContact: PlayerInfo;
  additionalPlayers: PlayerInfo[];
  requestedTeammates?: string[];
  receiptInfo?: ReceiptInfo;
  addons: AddonSelection;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  confirmationCode: string;
  registeredAt: string;
  checkedIn: boolean;
  assignedCart?: string;
  assignedStartingHole?: number;
  teamNumber?: string;
  teeTime?: string;
  notes?: string;
  routedToEmail?: string;
}

export type SponsorTier = 'presenting' | 'eagle' | 'birdie' | 'hole' | 'contest';

export interface SponsorPackage {
  id: SponsorTier;
  name: string;
  amount: number;
  description: string;
  spotsTotal: number;
  spotsRemaining: number;
  benefits: string[];
  foursomesIncluded: number;
  badgeColor: string;
}

export interface SponsorRecord {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  tier: SponsorTier;
  logoUrl?: string;
  websiteUrl?: string;
  pledgedAt: string;
  status: 'confirmed' | 'pending';
  customNote?: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail?: string;
  paymentMethod?: 'Cash' | 'e-transfer' | 'Cheque' | string;
  amount: number;
  isAnonymous: boolean;
  tributeType?: 'in_memory_of' | 'in_honor_of' | 'general';
  tributeName?: string;
  message?: string;
  donatedAt: string;
}

export interface LeaderboardTeam {
  rank: number;
  teamName: string;
  players: string[];
  scoreToPar: number; // e.g. -11, -8, +1
  thruHoles: number; // e.g. 18 or 14
  todayScore: number;
  startingHole: number;
  status: 'F' | 'Live' | 'Upcoming';
  squabbitId: string;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  location: string;
  description: string;
  iconName: string;
}

export type OutreachLeadStatus =
  | 'Identified'
  | 'Letter Sent'
  | 'Followed Up'
  | 'Opened'
  | 'Replied'
  | 'Pledged'
  | 'Declined'
  | 'Bounced'
  | 'Blocked'
  | 'Failed';

export type OutreachTargetTier =
  | 'Title Sponsor'
  | 'Eagle Sponsor'
  | 'Birdie Sponsor'
  | 'Beverage Cart Sponsor'
  | 'Beverage Cart'
  | 'Hole Sponsor'
  | 'Prize / Raffle Donor'
  | 'Prize & Raffle'
  | 'General Donor';

export interface OutreachLead {
  id: string;
  businessName: string;
  recipientName: string;
  emailAddress: string;
  contactNumber?: string;
  businessUrl?: string;
  address?: string;
  city?: string;
  prov?: string;
  targetTier: OutreachTargetTier;
  status: OutreachLeadStatus;
  pledgedAmount?: number;
  paymentMethod?: 'Cheque' | 'Credit Card' | 'e-Transfer' | null;
  nextFollowUpDate?: string;
  notes?: string;
  lastContactDate?: string;
  openCount?: number;
  lastEmailSubject?: string;
  lastEmailLogId?: string;
  bouncedAt?: string;
  hardBounce?: boolean;
  isSuppressed?: boolean;
  repliedAt?: string;
  pledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutreachEmailTemplate {
  id: string;
  title: string;
  category: 'hole_contest_sponsorship' | 'corporate_sponsorship' | 'prize_raffle' | 'memorial_tribute' | 'follow_up' | 'custom';
  subject: string;
  body: string;
  isDefault?: boolean;
  updatedAt: string;
}

export interface OutreachEmailLog {
  id: string;
  leadId: string;
  leadBusiness: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  templateId?: string;
  status: 'sent' | 'opened' | 'replied' | 'bounced';
  openCount: number;
  sentAt: string;
  openedAt?: string;
  messageId?: string;
}

export interface OutreachDailyQuota {
  date: string;
  sentToday: number;
  dailyLimit: number;
  remaining: number;
}

export interface BatchSendProgress {
  total: number;
  current: number;
  succeeded: number;
  failed: number;
  currentLeadName?: string;
  isPaused: boolean;
  isCompleted: boolean;
  errors: Array<{ leadId: string; businessName: string; email: string; error: string }>;
}
