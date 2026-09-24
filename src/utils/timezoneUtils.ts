/**
 * Timezone & Campaign Precision Scheduler Utilities
 * Targets America/Toronto (Eastern Time) for Sunday 8:00 PM campaigns
 */

import { isEmailSuppressed } from '../data/suppressionList';
import { OutreachLead } from '../types';

export interface ScheduledCampaignPayload {
  id: string;
  leadIds: string[];
  subjectTemplate: string;
  bodyTemplate: string;
  templateId: string;
  scheduledForLocal: string; // e.g. "2026-09-27T20:00"
  timezone: string; // "America/Toronto"
  scheduledForUTC: string; // Exact ISO UTC string
  scheduledForEasternDisplay: string; // "Sunday, Sept 27 @ 8:00 PM Eastern"
  status: 'scheduled' | 'dispatched' | 'aborted' | 'cancelled';
  createdAt: string;
  createdRecipientCount: number;
}

/**
 * Calculates exact UTC timestamp for 8:00 PM Eastern Time on a given date (YYYY-MM-DD)
 */
export function convertEasternToUTC(dateStr: string, timeStr: string = '20:00'): {
  utcISO: string;
  easternDisplay: string;
} {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // Approximate UTC date
  const baseUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  // Determine Eastern Time offset using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    hour12: false
  });

  const easternHourStr = formatter.format(baseUtc);
  const easternHour = parseInt(easternHourStr, 10) % 24;
  const hourDiff = hour - easternHour;

  const exactUtcDate = new Date(baseUtc.getTime() + hourDiff * 3600 * 1000);

  // Format Eastern display label
  const displayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedEastern = displayFormatter.format(exactUtcDate);

  return {
    utcISO: exactUtcDate.toISOString(),
    easternDisplay: `${formattedEastern} Eastern`
  };
}

/**
 * Quick Schedule Options
 */
export const QUICK_SCHEDULE_OPTIONS = [
  {
    id: 'sept-27-8pm',
    label: 'Send: Sunday, Sept 27 @ 8:00 PM',
    dateStr: '2026-09-27',
    timeStr: '20:00',
    easternDisplay: 'Sunday, Sept 27 @ 8:00 PM Eastern'
  },
  {
    id: 'oct-4-8pm',
    label: 'Send: Sunday, Oct 4 @ 8:00 PM',
    dateStr: '2026-10-04',
    timeStr: '20:00',
    easternDisplay: 'Sunday, Oct 4 @ 8:00 PM Eastern'
  }
];

export type AudienceTargetSegment = 'unopened_only' | 'all_non_responders';

/**
 * Hard Exclusion Rule:
 * Returns true if a contact MUST be excluded/suppressed from any campaign.
 * Conditions:
 * - status IN ["Bounced", "Blocked", "Failed", "Replied", "Pledged", "Declined"]
 * - Any contact with recorded bouncedAt timestamp OR hardBounce === true OR isSuppressed === true
 * - Any email in master suppression list
 */
export function isLeadHardExcluded(lead: Partial<OutreachLead> | any): boolean {
  if (!lead) return true;
  const hardExcludedStatuses = ['Bounced', 'Blocked', 'Failed', 'Replied', 'Pledged', 'Declined'];
  if (lead.status && hardExcludedStatuses.includes(lead.status)) return true;
  if (lead.bouncedAt || lead.hardBounce || lead.isSuppressed) return true;
  if (lead.emailAddress && isEmailSuppressed(lead.emailAddress)) return true;
  if (lead.recipientEmail && isEmailSuppressed(lead.recipientEmail)) return true;
  return false;
}

/**
 * Filters lead list based on Audience Segmentation Target:
 * 1. "Unopened Only" (Default): status == 'Letter Sent' AND openCount == 0 (excludes opened)
 * 2. "All Non-Responders": (status == 'Letter Sent' OR status == 'Opened') AND repliedAt == null
 */
export function filterEligibleAudience(
  leads: OutreachLead[],
  targetSegment: AudienceTargetSegment = 'unopened_only'
): {
  eligibleLeads: OutreachLead[];
  excludedCount: number;
  totalLeads: number;
  excludedBreakdown: {
    hardExcludedCount: number;
    openedExcludedCount: number;
  };
} {
  let hardExcludedCount = 0;
  let openedExcludedCount = 0;
  const eligibleLeads: OutreachLead[] = [];

  for (const lead of leads) {
    if (isLeadHardExcluded(lead)) {
      hardExcludedCount++;
      continue;
    }

    if (targetSegment === 'unopened_only') {
      // Must be 'Letter Sent' AND openCount == 0
      const isOpen = lead.status === 'Opened' || (lead.openCount && lead.openCount > 0);
      if (isOpen) {
        openedExcludedCount++;
        continue;
      }
      eligibleLeads.push(lead);
    } else if (targetSegment === 'all_non_responders') {
      // Must be ('Letter Sent' OR 'Opened') AND repliedAt == null
      const hasReplied = lead.status === 'Replied' || lead.repliedAt != null;
      if (hasReplied) {
        hardExcludedCount++;
        continue;
      }
      eligibleLeads.push(lead);
    }
  }

  const excludedCount = hardExcludedCount + openedExcludedCount;

  return {
    eligibleLeads,
    excludedCount,
    totalLeads: leads.length,
    excludedBreakdown: {
      hardExcludedCount,
      openedExcludedCount
    }
  };
}

/**
 * Safety Check: Determines if a lead should be aborted at dispatch time (8:00 PM)
 * Aborts if lead status changed to 'Bounced', 'Blocked', 'Failed', 'Replied', 'Pledged', or 'Declined'.
 */
export function shouldAbortLeadDispatch(leadStatus: string): boolean {
  const abortedStatuses = ['Bounced', 'Blocked', 'Failed', 'Replied', 'Pledged', 'Declined'];
  return abortedStatuses.includes(leadStatus);
}
