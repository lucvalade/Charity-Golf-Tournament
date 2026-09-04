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

export interface RegistrationRecord {
  id: string;
  type: RegistrationType;
  teamName?: string;
  primaryContact: PlayerInfo;
  additionalPlayers: PlayerInfo[];
  addons: AddonSelection;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  paymentMethod: 'credit_card' | 'cheque' | 'etransfer' | 'cash' | 'check' | 'invoice';
  confirmationCode: string;
  registeredAt: string;
  checkedIn: boolean;
  assignedCart?: string;
  assignedStartingHole?: number;
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
