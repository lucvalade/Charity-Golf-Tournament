/**
 * Master Suppression & Undeliverable List
 * Addresses that have hard-bounced, returned "Address not found", or been blocked by recipient system.
 * These addresses are strictly prevented from receiving future outreach emails.
 */

export interface SuppressedContact {
  email: string;
  businessName: string;
  reason: 'Blocked by System' | 'Address not found / Hard Bounce';
  dateAdded: string;
  notes: string;
}

export const SUPPRESSED_EMAIL_LIST: SuppressedContact[] = [
  // Message blocked by system
  {
    email: 'accessibility@splitsville.ca',
    businessName: 'Splitsville Bowl Burlington',
    reason: 'Blocked by System',
    dateAdded: '2026-09-14',
    notes: 'Message blocked by recipient mail server policy.'
  },
  {
    email: 'stacey@golfatpeak.com',
    businessName: 'Peak Performance Golf & Athletics',
    reason: 'Blocked by System',
    dateAdded: '2026-09-14',
    notes: 'Message blocked by recipient mail server policy.'
  },
  {
    email: 'shop@ultimategolfandleisure.ca',
    businessName: 'Ultimate Golf & Leisure',
    reason: 'Blocked by System',
    dateAdded: '2026-09-14',
    notes: 'Message blocked by recipient mail server policy.'
  },

  // Address not found / Hard bounce
  {
    email: 'tward@alteredimage.com',
    businessName: 'Cambridge Club',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'ttrupp@g.emporia.edu',
    businessName: 'Apex Centre',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'tdejonge@flamboroughhills.com',
    businessName: 'Flamborough Hills Golf Club',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'tclaydon.forest@golfnorth.ca',
    businessName: 'Scenic Woods Golf Club',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'support@parluxegolf.com',
    businessName: 'Parluxe Indoor Golf',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'summer.pelger@nike.com',
    businessName: 'Nike - The Eaton Center',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'ssiple@gcduke.com',
    businessName: 'G.C. Duke Equipment Ltd',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  },
  {
    email: 'victor.ortiz@toysrus.com',
    businessName: 'PLAYLAB',
    reason: 'Address not found / Hard Bounce',
    dateAdded: '2026-09-14',
    notes: 'Address not found on mail server. Do not email.'
  }
];

export const SUPPRESSED_EMAIL_SET = new Set(
  SUPPRESSED_EMAIL_LIST.map((item) => item.email.toLowerCase().trim())
);

export function isEmailSuppressed(email: string | undefined | null): boolean {
  if (!email) return false;
  return SUPPRESSED_EMAIL_SET.has(email.toLowerCase().trim());
}
