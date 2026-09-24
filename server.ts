import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Ensure data directory exists for local persistence
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data directory:', e);
  }
}

const SMTP_CONFIG_FILE = path.join(DATA_DIR, 'smtp-config.json');
const EMAIL_LOGS_FILE = path.join(DATA_DIR, 'email-logs.json');
const OUTREACH_LOGS_FILE = path.join(DATA_DIR, 'outreach-logs.json');
const OUTREACH_QUOTA_FILE = path.join(DATA_DIR, 'outreach-quota.json');
const SCHEDULED_CAMPAIGNS_FILE = path.join(DATA_DIR, 'scheduled-campaigns.json');
const DRAFT_EMAILS_FILE = path.join(DATA_DIR, 'draft_emails.json');

// Scheduled Campaign interface for Precision Campaign Scheduler
export interface ScheduledCampaign {
  id: string;
  leadIds: string[];
  recipients: Array<{
    leadId: string;
    recipientEmail: string;
    recipientName: string;
    businessName: string;
    city?: string;
    targetTier?: string;
    status?: string;
  }>;
  templateId: string;
  subjectTemplate: string;
  bodyTemplate: string;
  scheduledForLocal: string;
  timezone: string;
  scheduledForUTC: string;
  scheduledForEasternDisplay: string;
  targetSegment?: 'unopened_only' | 'all_non_responders';
  status: 'scheduled' | 'dispatched' | 'aborted' | 'partially_aborted' | 'cancelled';
  createdAt: string;
  dispatchResult?: {
    total: number;
    sentCount: number;
    abortedCount: number;
    failedCount: number;
    abortedLeads: Array<{ leadId: string; businessName: string; status: string; reason: string }>;
    dispatchedAt: string;
  };
}

let scheduledCampaigns: ScheduledCampaign[] = [];

try {
  if (fs.existsSync(SCHEDULED_CAMPAIGNS_FILE)) {
    scheduledCampaigns = JSON.parse(fs.readFileSync(SCHEDULED_CAMPAIGNS_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load scheduled-campaigns.json:', e);
}

function persistScheduledCampaigns() {
  try {
    fs.writeFileSync(SCHEDULED_CAMPAIGNS_FILE, JSON.stringify(scheduledCampaigns, null, 2));
    fs.writeFileSync(DRAFT_EMAILS_FILE, JSON.stringify(scheduledCampaigns, null, 2));
  } catch (e) {
    console.warn('Could not write scheduled-campaigns.json / draft_emails.json:', e);
  }
}

// Outreach email logs interface
export interface ServerOutreachLog {
  id: string;
  leadId: string;
  leadBusiness: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'failed';
  openCount: number;
  openedAt?: string;
  messageId?: string;
  error?: string;
}

let outreachLogs: ServerOutreachLog[] = [];

try {
  if (fs.existsSync(OUTREACH_LOGS_FILE)) {
    outreachLogs = JSON.parse(fs.readFileSync(OUTREACH_LOGS_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load outreach-logs.json:', e);
}

function persistOutreachLogs() {
  try {
    fs.writeFileSync(OUTREACH_LOGS_FILE, JSON.stringify(outreachLogs, null, 2));
  } catch (e) {
    console.warn('Could not write outreach-logs.json:', e);
  }
}

// Master Suppression List - Hard bounces, undeliverable, and blocked addresses strictly excluded from outreach
const SUPPRESSED_EMAILS = new Set([
  'accessibility@splitsville.ca',
  'stacey@golfatpeak.com',
  'shop@ultimategolfandleisure.ca',
  'tward@alteredimage.com',
  'ttrupp@g.emporia.edu',
  'tdejonge@flamboroughhills.com',
  'tclaydon.forest@golfnorth.ca',
  'support@parluxegolf.com',
  'summer.pelger@nike.com',
  'ssiple@gcduke.com',
  'victor.ortiz@toysrus.com'
]);

function isSuppressed(email?: string): boolean {
  if (!email) return false;
  return SUPPRESSED_EMAILS.has(email.toLowerCase().trim());
}

// Google Workspace Daily Mail Merge Quota Tracker (1,500 messages/day limit per user account)
interface OutreachDailyQuota {
  date: string; // YYYY-MM-DD
  sentToday: number;
  dailyLimit: number; // 1,500
}

let dailyQuotaState: OutreachDailyQuota = {
  date: new Date().toISOString().split('T')[0],
  sentToday: 0,
  dailyLimit: 1500
};

try {
  if (fs.existsSync(OUTREACH_QUOTA_FILE)) {
    const savedQuota = JSON.parse(fs.readFileSync(OUTREACH_QUOTA_FILE, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    if (savedQuota && savedQuota.date === today) {
      dailyQuotaState = {
        date: today,
        sentToday: Number(savedQuota.sentToday) || 0,
        dailyLimit: 1500
      };
    }
  }
} catch (e) {
  console.warn('Could not load outreach-quota.json:', e);
}

function persistQuota() {
  try {
    fs.writeFileSync(OUTREACH_QUOTA_FILE, JSON.stringify(dailyQuotaState, null, 2));
  } catch (e) {
    console.warn('Could not write outreach-quota.json:', e);
  }
}

function getDailyQuota(): OutreachDailyQuota {
  const today = new Date().toISOString().split('T')[0];
  if (dailyQuotaState.date !== today) {
    dailyQuotaState.date = today;
    dailyQuotaState.sentToday = 0;
    persistQuota();
  }
  return dailyQuotaState;
}

function recordOutreachSent(count = 1) {
  const current = getDailyQuota();
  current.sentToday += count;
  persistQuota();
}

// SMTP configuration state with Google Workspace Gmail details provided by user
let smtpState = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // TLS on port 587
  user: process.env.SMTP_USER || 'luc.valade@gmail.com',
  pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || ''
};

// Load persisted SMTP config if available
try {
  if (fs.existsSync(SMTP_CONFIG_FILE)) {
    const savedConfig = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
    if (savedConfig.pass) smtpState.pass = savedConfig.pass;
    if (savedConfig.user) smtpState.user = savedConfig.user;
    if (savedConfig.host) smtpState.host = savedConfig.host;
    if (savedConfig.port) smtpState.port = savedConfig.port;
  }
} catch (e) {
  console.warn('Could not load saved smtp-config.json:', e);
}

function cleanSmtpPassword(pass?: string): string {
  if (!pass) return '';
  let trimmed = pass.trim();
  // Strip surrounding quotes
  trimmed = trimmed.replace(/^["']|["']$/g, '');
  // If user pasted a 16-character Google App Password with spaces (e.g. "abcd efgh ijkl mnop"),
  // Google displays them in four groups of 4. Removing internal spaces is required for standard SMTP auth.
  if (/^[a-zA-Z0-9]{4}\s+[a-zA-Z0-9]{4}\s+[a-zA-Z0-9]{4}\s+[a-zA-Z0-9]{4}$/.test(trimmed)) {
    return trimmed.replace(/\s+/g, '');
  }
  // Also strip all spaces if it's 16 characters excluding whitespace
  const noSpaces = trimmed.replace(/\s+/g, '');
  if (noSpaces.length === 16 && /^[a-zA-Z0-9]{16}$/.test(noSpaces)) {
    return noSpaces;
  }
  return trimmed;
}

function parseSmtpError(err: any): { isAuthError: boolean; friendlyMessage: string; helpUrl?: string } {
  const msg = (err?.message || '').toLowerCase();
  const code = err?.responseCode || 0;

  if (code === 535 || msg.includes('535-5.7.8') || msg.includes('badcredentials') || msg.includes('username and password not accepted')) {
    return {
      isAuthError: true,
      friendlyMessage: 'Google Workspace rejected the login (Error 535: Bad Credentials). Google no longer accepts account passwords for SMTP. Please generate a 16-character App Password at https://myaccount.google.com/apppasswords.',
      helpUrl: 'https://myaccount.google.com/apppasswords'
    };
  }

  if (code === 534 || msg.includes('534-5.7.9') || msg.includes('application-specific password required') || msg.includes('invalidsecondfactor')) {
    return {
      isAuthError: true,
      friendlyMessage: 'Google Workspace requires an Application-Specific Password (Error 534). Please generate a 16-character App Password at https://myaccount.google.com/apppasswords.',
      helpUrl: 'https://myaccount.google.com/apppasswords'
    };
  }

  return {
    isAuthError: false,
    friendlyMessage: err?.message || 'Failed to authenticate with SMTP server.'
  };
}

function createSmtpTransporter(password: string, overrideUser?: string, overrideHost?: string, overridePort?: number) {
  const cleaned = cleanSmtpPassword(password);
  const host = overrideHost || smtpState.host;
  const port = overridePort || smtpState.port;
  const user = overrideUser || smtpState.user;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: cleaned
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

function interpolateTokens(tpl: string, lead: any): string {
  const biz = lead.businessName || 'Valued Business Partner';
  const person = lead.recipientName || lead.businessName || 'Community Partner';
  const tier = lead.targetTier || 'Hole & Contest Sponsor';
  const city = lead.city || 'Burford / Brantford area';

  return tpl
    .replace(/\{\{\s*business_name\s*\}\}/gi, biz)
    .replace(/\[Company Name\]/gi, biz)
    .replace(/\[Sponsor Name\]/gi, biz)
    .replace(/\{\{\s*recipient_name\s*\}\}/gi, person)
    .replace(/\[Contact Name\]/gi, person)
    .replace(/\{\{\s*target_tier\s*\}\}/gi, tier)
    .replace(/\[Target Tier\]/gi, tier)
    .replace(/\{\{\s*city\s*\}\}/gi, city)
    .replace(/\[City\]/gi, city)
    .replace(/\{\{\s*tournament_date\s*\}\}/gi, 'Monday October 5, 2026')
    .replace(/\[Tournament Date\]/gi, 'Monday October 5, 2026')
    .replace(/\{\{\s*venue_name\s*\}\}/gi, 'Burford Golf Links Course')
    .replace(/\[Course Location\]/gi, 'Burford Golf Links Course 120 Golf Links Rd., Burford ON')
    .replace(/\{\{\s*contact_number\s*\}\}/gi, '(905) 818-2005')
    .replace(/\[Founder Name\]/gi, 'Saied Mohammed')
    .replace(/\[Beneficiary Org\]/gi, 'Juravinski Breast Cancer Research & Canadian Red Cross')
    .replace(/\[Memorial Honoree\]/gi, 'Naseem Mohammed');
}

function formatTextToHtml(text: string): string {
  const blocks = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/);
  return blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    const lines = trimmed.split('\n');
    if (lines.every(l => /^\s*[*•-]\s+/.test(l))) {
      const items = lines.map(l => {
        let item = l.replace(/^\s*[*•-]\s+/, '').trim();
        item = item.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
        item = item.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
        return `<li style="margin-bottom: 6px; line-height: 1.6; color: #334155;">${item}</li>`;
      }).join('');
      return `<ul style="margin: 10px 0 16px 20px; padding: 0;">${items}</ul>`;
    } else {
      let pText = lines.map(l => {
        let line = l.trim();
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
        line = line.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
        return line;
      }).join('<br/>');
      return `<p style="margin: 0 0 16px 0; line-height: 1.65; color: #334155; font-size: 14.5px;">${pText}</p>`;
    }
  }).join('');
}

export async function processScheduledEmails(
  nowDate: Date = new Date(),
  liveLeadStatuses?: Record<string, string>
) {
  const dueCampaigns = scheduledCampaigns.filter(
    (c) => c.status === 'scheduled' && new Date(c.scheduledForUTC) <= nowDate
  );

  if (dueCampaigns.length === 0) {
    return { processedCount: 0, results: [] };
  }

  const results = [];

  for (const campaign of dueCampaigns) {
    let sentCount = 0;
    let abortedCount = 0;
    let failedCount = 0;
    const abortedLeads: Array<{ leadId: string; businessName: string; status: string; reason: string }> = [];

    const transporter = createSmtpTransporter(smtpState.pass);

    for (const recipient of campaign.recipients) {
      // PRE-DISPATCH SAFETY & HARD SUPPRESSION VALIDATION CHECK:
      const currentStatus = (liveLeadStatuses && liveLeadStatuses[recipient.leadId]) || recipient.status || 'Identified';

      const hardExcludedStatuses = ['Bounced', 'Blocked', 'Failed', 'Replied', 'Pledged', 'Declined'];
      const isHardExcludedStatus = hardExcludedStatuses.includes(currentStatus);
      const isEmailSuppressedCheck = isSuppressed(recipient.recipientEmail);

      // Audience Target Segment check: Unopened Only vs All Non-Responders
      const targetSegment = campaign.targetSegment || 'unopened_only';
      const isOpenedAndUnopenedTarget = targetSegment === 'unopened_only' && (currentStatus === 'Opened' || ((recipient as any).openCount && (recipient as any).openCount > 0));

      if (isHardExcludedStatus || isEmailSuppressedCheck || isOpenedAndUnopenedTarget) {
        abortedCount++;
        let reason = `Hard Exclusion: Lead status is "${currentStatus}" prior to dispatch`;
        if (isEmailSuppressedCheck) {
          reason = `Suppression Exclusion: Email ${recipient.recipientEmail} is flagged in suppression list`;
        } else if (isOpenedAndUnopenedTarget) {
          reason = `Audience Segment Exclusion: Lead opened initial email, but target segment is "Unopened Only"`;
        }

        abortedLeads.push({
          leadId: recipient.leadId,
          businessName: recipient.businessName,
          status: currentStatus,
          reason
        });
        console.log(`[Precision Scheduler Protection]: Aborted email to ${recipient.businessName} (${recipient.recipientEmail}) - ${reason}`);
        continue;
      }

      // Check daily quota
      const quota = getDailyQuota();
      if (quota.sentToday >= quota.dailyLimit) {
        failedCount++;
        continue;
      }

      if (isSuppressed(recipient.recipientEmail)) {
        failedCount++;
        continue;
      }

      const personalizedSubject = interpolateTokens(campaign.subjectTemplate, recipient);
      const personalizedBodyText = interpolateTokens(campaign.bodyTemplate, recipient);
      const personalizedBodyHtml = formatTextToHtml(personalizedBodyText);

      const logId = `outreach-sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const trackingUrl = `https://fragrant-breeze-golf-tournament.ai.studio/api/outreach/track-open/${logId}`;
      const trackingPixelHtml = `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;

      const styledHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #1E4D2B; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #D4AF37; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #D4AF37; color: #1E4D2B; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
    .title { font-size: 20px; font-weight: bold; margin: 0; color: #ffffff; }
    .subtitle { font-size: 13px; color: #e2e8f0; margin-top: 4px; }
    .content { padding: 28px; font-size: 14px; line-height: 1.65; color: #334155; }
    .footer { background-color: #f1f5f9; padding: 18px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Precision Campaign Outreach</div>
      <div class="title">Fragrant Breeze Memorial Golf Classic</div>
      <div class="subtitle">October 5, 2026 &bull; Burford Golf Links Course</div>
    </div>
    <div class="content">
      ${personalizedBodyHtml}
      ${trackingPixelHtml}
    </div>
    <div class="footer">
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed<br />
      Benefiting Juravinski Breast Cancer Research &amp; Canadian Red Cross<br />
      Questions or replies? Reply directly to this email or call (905) 818-2005.
    </div>
  </div>
</body>
</html>`;

      try {
        if (!smtpState.pass) {
          throw new Error('SMTP credentials not configured');
        }

        const info = await transporter.sendMail({
          from: `"Fragrant Breeze Golf Classic - Precision Scheduler" <${smtpState.user}>`,
          to: recipient.recipientEmail,
          replyTo: 'luc.valade@gmail.com',
          subject: personalizedSubject,
          text: personalizedBodyText,
          html: styledHtml
        });

        recordOutreachSent(1);
        sentCount++;

        outreachLogs.unshift({
          id: logId,
          leadId: recipient.leadId || 'unlinked',
          leadBusiness: recipient.businessName || recipient.recipientEmail,
          recipientEmail: recipient.recipientEmail,
          recipientName: recipient.recipientName || recipient.recipientEmail,
          subject: personalizedSubject,
          sentAt: new Date().toISOString(),
          status: 'sent',
          openCount: 0,
          messageId: info.messageId
        });
      } catch (err: any) {
        failedCount++;
      }
    }

    campaign.status = abortedCount === campaign.recipients.length
      ? 'aborted'
      : (sentCount > 0 ? 'dispatched' : 'partially_aborted');

    campaign.dispatchResult = {
      total: campaign.recipients.length,
      sentCount,
      abortedCount,
      failedCount,
      abortedLeads,
      dispatchedAt: new Date().toISOString()
    };

    results.push(campaign);
  }

  persistOutreachLogs();
  persistScheduledCampaigns();

  return { processedCount: dueCampaigns.length, results };
}

function persistSmtpConfig() {
  try {
    fs.writeFileSync(
      SMTP_CONFIG_FILE,
      JSON.stringify(
        {
          host: smtpState.host,
          port: smtpState.port,
          user: smtpState.user,
          pass: smtpState.pass
        },
        null,
        2
      )
    );
  } catch (e) {
    console.warn('Could not persist smtp-config.json:', e);
  }
}

// ==========================================
// EMAIL TRACKING SYSTEM
// ==========================================
export interface EmailLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  recipientType: 'admin' | 'golfer' | 'test' | 'inquiry';
  subject: string;
  status: 'sent' | 'failed';
  error?: string;
  messageId?: string;
  confirmationCode?: string;
  paymentMethod?: string;
  amount?: number;
  golferName?: string;
}

let emailLogs: EmailLogEntry[] = [];

// Load persisted email logs
try {
  if (fs.existsSync(EMAIL_LOGS_FILE)) {
    emailLogs = JSON.parse(fs.readFileSync(EMAIL_LOGS_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load email-logs.json:', e);
}

function addEmailLog(entry: Omit<EmailLogEntry, 'id' | 'timestamp'>) {
  const newEntry: EmailLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  emailLogs.unshift(newEntry);
  if (emailLogs.length > 200) {
    emailLogs = emailLogs.slice(0, 200);
  }
  try {
    fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify(emailLogs, null, 2));
  } catch (e) {
    console.warn('Could not write email-logs.json:', e);
  }
  return newEntry;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Serve static assets from public/ directory (PWA manifest, icons, service worker, PDF)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Explicit favicon and PWA asset handlers with exact MIME types
  app.get('/favicon.ico', (_req, res) => {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
  });

  app.get('/manifest.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
  });

  app.get('/sw.js', (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Serve the Hamilton Health Sciences Foundation Acknowledgement Letter PDF
  const sendAcknowledgementPdf = (_req: express.Request, res: express.Response) => {
    const pdfPath = path.join(process.cwd(), 'public', 'Fragrant Breeze Acknowledgement Letter - September 1, 2026.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Fragrant Breeze Acknowledgement Letter - September 1, 2026.pdf"');
    res.sendFile(pdfPath);
  };

  app.get('/Fragrant%20Breeze%20Acknowledgement%20Letter%20-%20September%201,%202026.pdf', sendAcknowledgementPdf);
  app.get('/Fragrant Breeze Acknowledgement Letter - September 1, 2026.pdf', sendAcknowledgementPdf);
  app.get('/api/acknowledgement-letter.pdf', sendAcknowledgementPdf);

  // Get SMTP Status (masks password)
  app.get('/api/smtp-config', (_req, res) => {
    res.json({
      host: smtpState.host,
      port: smtpState.port,
      user: smtpState.user,
      hasPassword: Boolean(smtpState.pass && smtpState.pass.trim().length > 0)
    });
  });

  // Save/Update SMTP Configuration & Password
  app.post('/api/smtp-config', (req, res) => {
    const { password, host, port, user } = req.body;
    if (typeof password === 'string') {
      smtpState.pass = cleanSmtpPassword(password);
    }
    if (typeof host === 'string' && host.trim()) {
      smtpState.host = host.trim();
    }
    if (typeof port === 'number' && port > 0) {
      smtpState.port = port;
    }
    if (typeof user === 'string' && user.trim()) {
      smtpState.user = user.trim();
    }

    persistSmtpConfig();

    res.json({
      success: true,
      message: 'SMTP settings updated and persisted successfully',
      hasPassword: Boolean(smtpState.pass && smtpState.pass.trim().length > 0),
      user: smtpState.user
    });
  });

  // Get Email Tracking Logs
  app.get('/api/email-logs', (_req, res) => {
    res.json({
      success: true,
      logs: emailLogs
    });
  });

  // Clear Email Tracking Logs
  app.post('/api/email-logs/clear', (_req, res) => {
    emailLogs = [];
    try {
      fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify([], null, 2));
    } catch (e) {
      console.warn('Could not clear email-logs.json:', e);
    }
    res.json({ success: true, message: 'Email logs cleared.' });
  });

  // Test SMTP Connection (Handshake Only)
  app.post('/api/test-smtp', async (req, res) => {
    const rawPassword = req.body.password || smtpState.pass || '';
    const targetUser = (req.body.user || smtpState.user || '').trim();
    const targetHost = (req.body.host || smtpState.host || '').trim();
    const targetPort = req.body.port || smtpState.port;
    const passwordToUse = cleanSmtpPassword(rawPassword);
    if (!passwordToUse) {
      addEmailLog({
        recipient: targetUser || 'luc.valade@gmail.com',
        recipientType: 'test',
        subject: 'SMTP Handshake Verification',
        status: 'failed',
        error: 'Password is required to test SMTP connection.'
      });
      return res.status(400).json({
        success: false,
        error: 'Password is required to test SMTP connection.'
      });
    }

    try {
      const transporter = createSmtpTransporter(passwordToUse, targetUser, targetHost, targetPort);
      await transporter.verify();
      addEmailLog({
        recipient: targetUser,
        recipientType: 'test',
        subject: 'SMTP Handshake Verification',
        status: 'sent',
        messageId: `verify-${Date.now()}`
      });
      return res.json({
        success: true,
        message: `Successfully connected to ${targetHost}:${targetPort} using ${targetUser}`
      });
    } catch (err: any) {
      const { isAuthError, friendlyMessage, helpUrl } = parseSmtpError(err);
      console.info(`[SMTP Verification Notice] ${friendlyMessage}`);
      addEmailLog({
        recipient: targetUser,
        recipientType: 'test',
        subject: 'SMTP Handshake Verification',
        status: 'failed',
        error: friendlyMessage
      });
      return res.json({
        success: false,
        error: friendlyMessage,
        isAuthError,
        helpUrl,
        rawError: err?.message
      });
    }
  });

  // Send Live Test Email to luc.valade@gmail.com
  app.post('/api/test-email', async (req, res) => {
    const rawPassword = req.body.password || smtpState.pass || '';
    const passwordToUse = cleanSmtpPassword(rawPassword);
    const target = (req.body.recipient || 'luc.valade@gmail.com').trim();

    if (!passwordToUse) {
      addEmailLog({
        recipient: target,
        recipientType: 'test',
        subject: '[TEST EMAIL] Google Workspace SMTP Delivery Verification',
        status: 'failed',
        error: 'SMTP Google Workspace App Password not configured on server. Please configure it in Email & SMTP Settings.'
      });
      return res.status(400).json({
        success: false,
        error: 'SMTP Google Workspace App Password not configured on server. Please enter the App Password in Email & SMTP Settings.'
      });
    }

    try {
      const transporter = createSmtpTransporter(passwordToUse);

      const info = await transporter.sendMail({
        from: `"Fragrant Breeze Golf" <${smtpState.user}>`,
        to: target,
        subject: `[TEST EMAIL] Fragrant Breeze Golf Tournament Email Delivery Test (${new Date().toLocaleTimeString()})`,
        text: `This is an automated test message from the Fragrant Breeze Golf Tournament email delivery system.\n\nServer: ${smtpState.host}:${smtpState.port}\nSender: ${smtpState.user}\nRecipient: ${target}\nTime: ${new Date().toISOString()}\n\nIf you received this message, Google Workspace SMTP delivery is functioning properly.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 2px solid #1E4D2B; border-radius: 12px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1E4D2B; margin-top: 0;">Fragrant Breeze Email Delivery Test</h2>
            <p>This confirms that <strong>Google Workspace Gmail SMTP</strong> is configured and delivering messages successfully.</p>
            <ul style="font-size: 13px; color: #475569;">
              <li><strong>Host:</strong> ${smtpState.host}:${smtpState.port}</li>
              <li><strong>From:</strong> ${smtpState.user}</li>
              <li><strong>To:</strong> ${target}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <div style="margin-top: 16px; padding: 10px; background: #ecfdf5; border-radius: 8px; font-weight: bold; color: #065f46; font-size: 12px;">
              &check; Google Workspace SMTP Verified &amp; Active
            </div>
          </div>
        `
      });

      addEmailLog({
        recipient: target,
        recipientType: 'test',
        subject: '[TEST EMAIL] Google Workspace SMTP Delivery Verification',
        status: 'sent',
        messageId: info.messageId
      });

      return res.json({
        success: true,
        message: `Test email sent successfully to ${target}! Message ID: ${info.messageId}`,
        messageId: info.messageId
      });
    } catch (err: any) {
      const { isAuthError, friendlyMessage, helpUrl } = parseSmtpError(err);
      console.info(`[Test Email Notice] ${friendlyMessage}`);
      addEmailLog({
        recipient: target,
        recipientType: 'test',
        subject: '[TEST EMAIL] Google Workspace SMTP Delivery Verification',
        status: 'failed',
        error: friendlyMessage
      });
      return res.json({
        success: false,
        error: friendlyMessage,
        isAuthError,
        helpUrl,
        rawError: err?.message
      });
    }
  });

  // Send Registration Email to Saied Mohammed and Golfer
  app.post('/api/send-registration-email', async (req, res) => {
    try {
      const {
        registration,
        totalAmount,
        customPassword,
        recipientEmail = 'luc.valade@gmail.com'
      } = req.body;

      if (!registration || !registration.primaryContact) {
        return res.status(400).json({
          success: false,
          error: 'Missing registration details'
        });
      }

      const rec = registration;
      const primary = rec.primaryContact;
      const targetAdminEmail = 'luc.valade@gmail.com';
      const targetGolferEmail = 'luc.valade@gmail.com';
      const formattedTotal = Number(totalAmount || rec.totalAmount || 0).toLocaleString();

      const methodLabel =
        rec.paymentMethod === 'cheque'
          ? 'CHEQUE (Payable to Saied Mohammed)'
          : rec.paymentMethod === 'cash'
          ? 'CASH (Bring it to the event)'
          : 'INTERAC E-TRANSFER';

      const passwordToUse = cleanSmtpPassword(customPassword || smtpState.pass || '');

      if (!passwordToUse) {
        // Track the attempt so administrator can see it in Email Tracking Logs
        addEmailLog({
          recipient: targetAdminEmail,
          recipientType: 'admin',
          subject: `[ADMIN ALERT] New Registration (${rec.type === 'dinner_only' ? 'Dinner' : 'Golfer'}): ${primary.name} - ${rec.confirmationCode}`,
          status: 'failed',
          error: 'SMTP Google Workspace App Password not configured on server. Please configure it in Email & SMTP Settings.',
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });

        addEmailLog({
          recipient: primary.email || targetGolferEmail,
          recipientType: 'golfer',
          subject: `[GOLFER CONFIRMATION] Fragrant Breeze Golf Classic: ${primary.name} (${rec.confirmationCode})`,
          status: 'failed',
          error: 'SMTP Google Workspace App Password not configured on server. Please configure it in Email & SMTP Settings.',
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });

        return res.json({
          success: true,
          emailDispatched: false,
          needsPassword: true,
          warning: 'Registration confirmed! Email delivery pending configuration of Google Workspace App Password.'
        });
      }

      const textBody = `ATTENTION: Luc Valade (luc.valade@gmail.com)
TOURNAMENT: Fragrant Breeze Golf Tournament (Fragrant Breeze Memorial Classic)
PRE-LAUNCH NOTICE: Registration routed to Luc Valade (luc.valade@gmail.com)
FOUNDER: Saied Mohammed (fragrant.breeze2023@gmail.com)

NEW GOLFER REGISTRATION RECEIVED (${methodLabel})

=======================================================
REGISTRATION SUMMARY
=======================================================
Confirmation Code: ${rec.confirmationCode}
Entry Type: ${rec.type === 'dinner_only' ? 'Dinner & Awards Banquet Pass ($50–$60, TBD)' : 'Green Fee & Cart Package ($120–$130)'}
Payment Method: ${methodLabel}
Payment Status: PENDING RECEIPT BY SAIED MOHAMMED
Total Amount Due: $${formattedTotal} CAD
Registration Date: ${new Date(rec.registeredAt || Date.now()).toLocaleString()}
Starting Hole: Hole #${rec.assignedStartingHole || '1'}A
Assigned Cart: ${rec.assignedCart || 'Cart TBA'}

=======================================================
PRIMARY GOLFER / CONTACT DETAILS
=======================================================
Full Name: ${primary.name}
Email: ${primary.email}
Phone: ${primary.phone}
Dietary Restrictions: ${primary.dietaryRestrictions || 'None'}

${
  rec.requestedTeammates && rec.requestedTeammates.filter(Boolean).length > 0
    ? `=======================================================
REQUESTED FOURSOME TEAMMATES ("I would like to play with:")
=======================================================
${rec.requestedTeammates.filter(Boolean).map((n: string, i: number) => `${i + 1}. ${n}`).join('\n')}
`
    : ''
}

${
  rec.receiptInfo?.needed
    ? `=======================================================
OFFICIAL TAX RECEIPT MAILING ADDRESS
=======================================================
Street Address: ${rec.receiptInfo.address || 'N/A'}
City: ${rec.receiptInfo.city || 'N/A'}
Province: ${rec.receiptInfo.province || 'N/A'}
Postal Code: ${rec.receiptInfo.postalCode || 'N/A'}
`
    : 'Official Tax Receipt Requested: No'
}

=======================================================
PAYMENT INSTRUCTIONS
=======================================================
${
  rec.paymentMethod === 'cheque'
    ? `Make Cheque Payable To: Saied Mohammed
Memo Line: 2026 Memorial Golf
Total Amount: $${formattedTotal} CAD
Mail to Saied Mohammed or present at the registration desk.`
    : rec.paymentMethod === 'cash'
    ? `Cash Payment Selected:
Bring cash to the event check-in desk or prior to Saied Mohammed.
Memo Line: 2026 Memorial Golf
Total Amount: $${formattedTotal} CAD`
    : `Interac e-Transfer Instructions:
Send e-Transfer to: fragrant.breeze2023@gmail.com
Total Amount: $${formattedTotal} CAD
Memo / Transfer Note: 2026 Memorial Golf
Status: PENDING RECEIPT BY SAIED MOHAMMED`
}

All registration records are logged in the tournament database.`;

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: #1E4D2B; color: #ffffff; padding: 24px 28px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #fde68a; }
    .content { padding: 28px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; }
    .section-title { font-size: 13px; font-weight: 700; color: #1E4D2B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 12px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .total-box { background: #ecfdf5; border: 2px solid #1E4D2B; border-radius: 12px; padding: 16px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-weight: 700; color: #065f46; font-size: 14px; }
    .total-val { font-size: 22px; font-weight: 800; color: #1E4D2B; font-family: monospace; }
    .instructions { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; font-size: 13px; color: #78350f; line-height: 1.5; }
    .footer { background: #f8fafc; padding: 16px 28px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Fragrant Breeze Golf Tournament</h1>
      <p>Official Registration Notification &bull; Honoring Naseem Mohammed</p>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #fef08a;">Pre-Launch Routing: Luc Valade (luc.valade@gmail.com)</p>
    </div>
    <div class="content">
      <span class="badge">${methodLabel}</span>
      <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a;">New Golfer Registration Received</h2>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #475569;">
        A new participant registration has been submitted by <strong>${primary.name}</strong>.
      </p>

      <div class="total-box">
        <div class="total-label">Total Amount Due:</div>
        <div class="total-val">$${formattedTotal} CAD</div>
      </div>

      <div class="section-title">Registration Summary</div>
      <div class="row"><span class="label">Confirmation Code</span><span class="value" style="font-family: monospace; color: #1E4D2B; font-weight: 800;">${rec.confirmationCode}</span></div>
      <div class="row"><span class="label">Package Type</span><span class="value">${rec.type === 'dinner_only' ? 'Dinner Guest Pass' : 'Green Fee & Cart Package'}</span></div>
      <div class="row"><span class="label">Payment Method</span><span class="value">${methodLabel}</span></div>
      <div class="row"><span class="label">Registration Time</span><span class="value">${new Date(rec.registeredAt || Date.now()).toLocaleString()}</span></div>

      <div class="section-title">Primary Participant Contact</div>
      <div class="row"><span class="label">Full Name</span><span class="value">${primary.name}</span></div>
      <div class="row"><span class="label">Email Address</span><span class="value"><a href="mailto:${primary.email}">${primary.email}</a></span></div>
      <div class="row"><span class="label">Phone Number</span><span class="value">${primary.phone}</span></div>
      <div class="row"><span class="label">Dietary Notes</span><span class="value">${primary.dietaryRestrictions || 'None'}</span></div>

      ${
        rec.requestedTeammates && rec.requestedTeammates.filter(Boolean).length > 0
          ? `
          <div class="section-title">Requested Foursome Teammates</div>
          <ul style="margin: 8px 0; padding-left: 20px; font-size: 13px; color: #334155;">
            ${rec.requestedTeammates.filter(Boolean).map((n: string) => `<li><strong>${n}</strong></li>`).join('')}
          </ul>
          `
          : ''
      }

      ${
        rec.receiptInfo?.needed
          ? `
          <div class="section-title">Official Tax Receipt Address</div>
          <div class="row"><span class="label">Address</span><span class="value">${rec.receiptInfo.address || 'N/A'}</span></div>
          <div class="row"><span class="label">City / Province</span><span class="value">${rec.receiptInfo.city || ''}, ${rec.receiptInfo.province || ''}</span></div>
          <div class="row"><span class="label">Postal Code</span><span class="value" style="font-family: monospace;">${rec.receiptInfo.postalCode || 'N/A'}</span></div>
          `
          : '<div class="row"><span class="label">Tax Receipt Requested</span><span class="value">No</span></div>'
      }

      <div class="section-title">Payment Instructions</div>
      <div class="instructions">
        ${
          rec.paymentMethod === 'cheque'
            ? '<strong>Cheque:</strong> Payable to <strong>Saied Mohammed</strong> &bull; Memo: <strong>2026 Memorial Golf</strong>'
            : rec.paymentMethod === 'cash'
            ? '<strong>Cash:</strong> Bring to event check-in or prior to Saied Mohammed &bull; Memo: <strong>2026 Memorial Golf</strong>'
            : '<strong>Interac e-Transfer:</strong> Send to <strong>fragrant.breeze2023@gmail.com</strong> &bull; Memo: <strong>2026 Memorial Golf</strong>'
        }
      </div>
    </div>
    <div class="footer">
      Sent from Google Workspace Gmail (${smtpState.user}) &bull; Fragrant Breeze Golf Tournament
    </div>
  </div>
</body>
</html>
`;

      const transporter = createSmtpTransporter(passwordToUse);

      // 1. Send Admin Notification Email to luc.valade@gmail.com
      const adminMailOptions = {
        from: `"Fragrant Breeze Golf Tournament" <${smtpState.user}>`,
        to: targetAdminEmail,
        cc: [smtpState.user].filter(Boolean).join(', '),
        replyTo: primary.email,
        subject: `[ADMIN ALERT] New Registration (${rec.type === 'dinner_only' ? 'Dinner' : 'Golfer'}): ${primary.name} - ${rec.confirmationCode}`,
        text: textBody,
        html: htmlBody
      };

      let adminInfo: any = null;
      let adminErrorMsg: string | null = null;
      try {
        adminInfo = await transporter.sendMail(adminMailOptions);
        console.log('Admin registration email successfully sent to', targetAdminEmail, adminInfo.messageId);
        addEmailLog({
          recipient: targetAdminEmail,
          recipientType: 'admin',
          subject: adminMailOptions.subject,
          status: 'sent',
          messageId: adminInfo.messageId,
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });
      } catch (adminErr: any) {
        const { friendlyMessage } = parseSmtpError(adminErr);
        adminErrorMsg = friendlyMessage;
        console.warn('[Admin Registration Email Notice]:', friendlyMessage, adminErr?.message || adminErr);
        addEmailLog({
          recipient: targetAdminEmail,
          recipientType: 'admin',
          subject: adminMailOptions.subject,
          status: 'failed',
          error: friendlyMessage,
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });
      }

      // 2. Send Official Golfer Confirmation Email to luc.valade@gmail.com (and cc primary email if different)
      const golferPaymentInstructions =
        rec.paymentMethod === 'cheque'
          ? `PAYMENT INSTRUCTIONS (CHEQUE):
- Payable to: Saied Mohammed
- Amount: $${formattedTotal} CAD
- Memo: 2026 Memorial Golf - ${rec.confirmationCode}
- Check-in: Please present your cheque at the welcome desk starting at 9:30 AM at Burford Golf Links Course.`
          : rec.paymentMethod === 'cash'
          ? `PAYMENT INSTRUCTIONS (CASH):
- Amount: $${formattedTotal} CAD
- Payment Timing: Bring exact cash to the registration desk on tournament morning (opens 9:30 AM).
- Receipt: Committee will issue a signed official receipt upon check-in.`
          : `PAYMENT INSTRUCTIONS (INTERAC E-TRANSFER):
- Send To: fragrant.breeze2023@gmail.com
- Recipient: Saied Mohammed (Auto-deposit enabled)
- Amount: $${formattedTotal} CAD
- Transfer Memo: 2026 Memorial Golf - ${primary.name} (${rec.confirmationCode})`;

      const golferTextBody = `Dear ${primary.name},

Thank you for registering for the 6th Annual Fragrant Breeze Golf Tournament in loving memory of Naseem Mohammed. We are delighted to confirm your entry and look forward to an inspiring day of golf and community fellowship!

ALL EMAILS ROUTED TO: ${targetGolferEmail}

=======================================================
REGISTRATION CONFIRMATION DETAILS
=======================================================
Confirmation Code: ${rec.confirmationCode}
Package: ${rec.type === 'dinner_only' ? 'Dinner & Awards Banquet Pass ($50–$60, TBD)' : 'Green Fee & Cart Package ($120–$130)'}
Total Amount: $${formattedTotal} CAD
Payment Method: ${methodLabel}
Starting Hole: Hole #${rec.assignedStartingHole || '1'}A (Cart: ${rec.assignedCart || 'Cart TBA'})
Teammates: ${rec.requestedTeammates && rec.requestedTeammates.filter(Boolean).length > 0 ? rec.requestedTeammates.filter(Boolean).join(', ') : 'Assigned with friendly group'}

=======================================================
${golferPaymentInstructions}
=======================================================

TOURNAMENT SCHEDULE & LOCATION
Date: Monday, October 5, 2026
Venue: Burford Golf Links Course (1204 Burford Delhi Townline Rd, Burford, ON N0E 1A0)
- 9:30 AM: Registration, Practice & Chipping/Putting Contest
- 11:00 AM: Shotgun Start (Dynamic 6-6-6 Format)
- 4:00 PM: FABULOUS Turkey Dinner, Awards & Memorial Ceremony

Questions or Updates?
Founder: Saied Mohammed (fragrant.breeze2023@gmail.com)
Tournament Administrator: Luc Valade (luc.valade@gmail.com)

With heartfelt gratitude,
Fragrant Breeze Golf Tournament Committee
In Loving Memory of Naseem Mohammed
`;

      const golferHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: #1e4d2b; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #d4af37; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 12px; color: #fef08a; }
    .content { padding: 24px; }
    .greeting { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
    .box { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #cbd5e1; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 700; text-align: right; }
    .payment-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .payment-title { font-weight: 800; font-size: 14px; color: #065f46; margin-bottom: 8px; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .tag { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; rounded: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>6th Annual Fragrant Breeze Golf Classic</h1>
      <p>In Loving Memory of Naseem Mohammed &bull; Monday, October 5, 2026</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${primary.name},</div>
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        Thank you for registering for the <strong>6th Annual Fragrant Breeze Golf Tournament</strong>. We are delighted to have you join us at Burford Golf Links Course for a memorable day honoring Naseem Mohammed and supporting our health care charities!
      </p>

      <div class="box">
        <div class="row">
          <span class="label">Confirmation Code</span>
          <span class="value" style="color: #1e4d2b; font-family: monospace; font-size: 14px;">${rec.confirmationCode}</span>
        </div>
        <div class="row">
          <span class="label">Player Name</span>
          <span class="value">${primary.name}</span>
        </div>
        <div class="row">
          <span class="label">Package</span>
          <span class="value">${rec.type === 'dinner_only' ? 'Dinner & Awards Banquet Pass' : 'Green Fee & Cart Package'}</span>
        </div>
        <div class="row">
          <span class="label">Total Amount Due</span>
          <span class="value" style="color: #1e4d2b; font-size: 15px;">$${formattedTotal} CAD</span>
        </div>
        <div class="row">
          <span class="label">Starting Hole</span>
          <span class="value">Hole #${rec.assignedStartingHole || '1'}A (${rec.assignedCart || 'Cart TBA'})</span>
        </div>
        <div class="row">
          <span class="label">Venue</span>
          <span class="value">Burford Golf Links Course</span>
        </div>
      </div>

      <div class="payment-box">
        <div class="payment-title">${methodLabel}</div>
        <p style="font-size: 12px; margin: 4px 0; color: #047857; white-space: pre-line;">
          ${golferPaymentInstructions}
        </p>
      </div>

      <div style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 16px;">
        <strong>Schedule Highlights:</strong><br>
        &bull; 9:30 AM: Registration &amp; Chipping/Putting Warmup<br>
        &bull; 11:00 AM: Shotgun Start (Dynamic 6-6-6 Format)<br>
        &bull; 4:00 PM: FABULOUS Turkey Dinner &amp; Awards Banquet
      </div>
    </div>
    <div class="footer">
      Routed to: ${targetGolferEmail} &bull; Fragrant Breeze Golf Classic
    </div>
  </div>
</body>
</html>
`;

      const golferMailOptions = {
        from: `"Fragrant Breeze Golf Tournament" <${smtpState.user}>`,
        to: targetGolferEmail,
        cc: primary.email && primary.email !== targetGolferEmail ? primary.email : undefined,
        replyTo: 'luc.valade@gmail.com',
        subject: `[GOLFER CONFIRMATION] 6th Annual Fragrant Breeze Golf Classic: ${primary.name} (${rec.confirmationCode})`,
        text: golferTextBody,
        html: golferHtmlBody
      };

      try {
        const golferInfo = await transporter.sendMail(golferMailOptions);
        console.log('Golfer confirmation email successfully sent to', targetGolferEmail, golferInfo.messageId);
        addEmailLog({
          recipient: targetGolferEmail,
          recipientType: 'golfer',
          subject: golferMailOptions.subject,
          status: 'sent',
          messageId: golferInfo.messageId,
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });
      } catch (golferErr: any) {
        console.warn('Could not send separate golfer email copy:', golferErr);
        addEmailLog({
          recipient: targetGolferEmail,
          recipientType: 'golfer',
          subject: golferMailOptions.subject,
          status: 'failed',
          error: golferErr?.message || 'Failed to send golfer confirmation copy',
          confirmationCode: rec.confirmationCode,
          paymentMethod: rec.paymentMethod,
          amount: Number(totalAmount || rec.totalAmount || 0),
          golferName: primary.name
        });
      }

      if (adminInfo?.messageId) {
        return res.json({
          success: true,
          emailDispatched: true,
          messageId: adminInfo.messageId,
          recipient: targetAdminEmail
        });
      } else {
        return res.json({
          success: true,
          emailDispatched: false,
          warning: adminErrorMsg || 'Registration saved, but email notification could not be dispatched via SMTP.',
          recipient: targetAdminEmail
        });
      }
    } catch (err: any) {
      const { friendlyMessage } = parseSmtpError(err);
      console.warn('[Registration Server Handler Notice]:', friendlyMessage, err?.message || err);
      return res.json({
        success: true,
        emailDispatched: false,
        warning: friendlyMessage
      });
    }
  });

  // Send Immediate Sponsorship Pledge Notification to Luc Valade & Saied Mohammed
  app.post('/api/notify-pledge', async (req, res) => {
    try {
      const {
        companyName,
        contactName,
        email,
        phone,
        tier,
        pledgedAmount,
        notes,
        source = 'Outreach CRM'
      } = req.body;

      if (!companyName) {
        return res.status(400).json({ success: false, error: 'Missing company name' });
      }

      const formattedAmount = Number(pledgedAmount || 0).toLocaleString();
      const recipients = ['luc.valade@gmail.com', 'ms_smnm@outlook.com'];

      const textBody = `NEW SPONSORSHIP PLEDGE ALERT
=======================================================
Company: ${companyName}
Contact Person: ${contactName || 'Not specified'}
Email: ${email || 'Not specified'}
Phone: ${phone || 'Not specified'}
Package / Tier: ${tier || 'Corporate Sponsor'}
Pledged Amount: $${formattedAmount} CAD
Source: ${source}
Notes: ${notes || 'None'}
Timestamp: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}

Copies dispatched to:
- Luc Valade (luc.valade@gmail.com)
- Saied Mohammed (ms_smnm@outlook.com)
`;

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: #1e4d2b; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #d4af37; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
    .header p { margin: 6px 0 0 0; font-size: 12px; color: #fef08a; }
    .badge { display: inline-block; background: #d4af37; color: #1e4d2b; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; margin-bottom: 10px; }
    .content { padding: 24px; }
    .box { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #cbd5e1; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13.5px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 700; text-align: right; }
    .amount-banner { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 18px; text-align: center; margin: 16px 0; }
    .amount-val { font-size: 28px; font-weight: 900; color: #065f46; font-family: monospace; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Sponsorship Pledge Secured</div>
      <h1>${companyName}</h1>
      <p>6th Annual Fragrant Breeze Golf Classic &bull; October 5, 2026</p>
    </div>
    <div class="content">
      <div class="amount-banner">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #047857;">Pledged Amount</div>
        <div class="amount-val">$${formattedAmount} CAD</div>
        <div style="font-size: 12px; color: #065f46; margin-top: 4px;">Tier: <strong>${tier || 'Corporate Partner'}</strong></div>
      </div>

      <div class="box">
        <div class="row"><span class="label">Company Name</span><span class="value">${companyName}</span></div>
        <div class="row"><span class="label">Contact Person</span><span class="value">${contactName || 'N/A'}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${email || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${phone || 'N/A'}</span></div>
        <div class="row"><span class="label">Source</span><span class="value">${source}</span></div>
        ${notes ? `<div class="row"><span class="label">Notes</span><span class="value">${notes}</span></div>` : ''}
      </div>
    </div>
    <div class="footer">
      Copies dispatched to <strong>luc.valade@gmail.com</strong> &amp; <strong>ms_smnm@outlook.com</strong><br/>
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed
    </div>
  </div>
</body>
</html>
`;

      const passwordToUse = cleanSmtpPassword(smtpState.pass || '');
      if (passwordToUse) {
        const transporter = createSmtpTransporter(passwordToUse);
        const mailOptions = {
          from: `"Fragrant Breeze Golf Tournament" <${smtpState.user}>`,
          to: recipients.join(', '),
          cc: 'fragrant.breeze2023@gmail.com',
          replyTo: email || 'luc.valade@gmail.com',
          subject: `[NEW SPONSOR PLEDGE] $${formattedAmount} CAD from ${companyName} (${tier || 'Corporate Sponsor'})`,
          text: textBody,
          html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[Pledge Mailer Alert] Dispatched pledge notice to Luc Valade & Saied Mohammed:', info.messageId);

        addEmailLog({
          recipient: recipients.join(', '),
          recipientType: 'admin',
          subject: mailOptions.subject,
          status: 'sent',
          messageId: info.messageId,
          amount: Number(pledgedAmount || 0),
          golferName: contactName || companyName
        });

        return res.json({ success: true, messageId: info.messageId, recipients });
      } else {
        console.info('[Pledge Mailer Notice] Saved pledge alert internally (SMTP password not provided)');
        return res.json({ success: true, emailDispatched: false, warning: 'Pledge recorded, SMTP offline.' });
      }
    } catch (err: any) {
      console.warn('[Pledge Mailer Notice] Warning dispatching pledge email:', err?.message || err);
      return res.json({ success: true, emailDispatched: false, error: err?.message });
    }
  });

  // Send 10 AM Daily Pledges & Pipeline Executive Report to Saied & Luc
  app.post('/api/outreach/send-pledges-report', async (req, res) => {
    try {
      const { leads = [], customNotes = '', recipients: reqRecipients, asOfDate } = req.body;
      const recipients = Array.isArray(reqRecipients) && reqRecipients.length > 0
        ? reqRecipients
        : ['luc.valade@gmail.com', 'ms_smnm@outlook.com'];

      const reportAsOfDate = asOfDate || new Date().toISOString().split('T')[0];
      const formattedAsOfDate = new Date(reportAsOfDate + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      // Extract Pledged Leads
      const pledgedLeads = Array.isArray(leads)
        ? leads.filter((l: any) => l && (l.status === 'Pledged' || (Number(l.pledgedAmount) || 0) > 0))
        : [];

      const totalPledged = pledgedLeads.reduce((sum: number, l: any) => sum + (Number(l.pledgedAmount) || 0), 0);
      const formattedTotal = totalPledged.toLocaleString();

      const tableRowsHtml = pledgedLeads.length > 0
        ? pledgedLeads.map((l: any, i: number) => `
          <tr style="border-bottom: 1px solid #e2e8f0; background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px; font-weight: 700; color: #0f172a;">${l.businessName || l.companyName || 'N/A'}</td>
            <td style="padding: 10px; color: #334155;">${l.recipientName || l.contactPerson || 'N/A'}<br/><span style="font-size: 11px; color: #64748b;">${l.emailAddress || l.email || ''}</span></td>
            <td style="padding: 10px; font-size: 11px; color: #475569;">${l.lastContactDate ? new Date(l.lastContactDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}</td>
            <td style="padding: 10px; font-weight: 600; color: #1e4d2b;">${l.targetTier || 'Sponsor'}</td>
            <td style="padding: 10px;"><span style="background: #dcfce7; color: #166534; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">${l.status || 'Pledged'}</span></td>
            <td style="padding: 10px; text-align: right; font-weight: 900; font-family: monospace; color: #065f46; font-size: 14px;">$${Number(l.pledgedAmount || 0).toLocaleString()} CAD</td>
          </tr>
        `).join('')
        : `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #64748b;">No active pledges recorded at this time.</td></tr>`;

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: #1e4d2b; color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #d4af37; }
    .header h1 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 12px; color: #fef08a; }
    .badge { display: inline-block; background: #d4af37; color: #1e4d2b; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; margin-bottom: 8px; }
    .content { padding: 24px; }
    .kpi-row { display: flex; gap: 12px; margin-bottom: 20px; }
    .kpi-box { flex: 1; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; text-align: center; }
    .kpi-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #047857; }
    .kpi-val { font-size: 24px; font-weight: 900; color: #065f46; font-family: monospace; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">10:00 AM Executive Dispatch</div>
      <h1>Daily Sponsorship Pledges &amp; Pipeline Report</h1>
      <p>6th Annual Fragrant Breeze Memorial Golf Classic &bull; Monday, October 5, 2026</p>
    </div>
    <div class="content">
      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-title">Total Pledged Raised (As of ${formattedAsOfDate})</div>
          <div class="kpi-val">$${formattedTotal} CAD</div>
        </div>
        <div class="kpi-box" style="background: #f0f9ff; border-color: #bae6fd;">
          <div class="kpi-title" style="color: #0369a1;">Pledged Corporate Partners</div>
          <div class="kpi-val" style="color: #075985;">${pledgedLeads.length} Sponsors</div>
        </div>
      </div>

      ${customNotes ? `<div style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; font-size: 12px; color: #92400e; margin-bottom: 16px;"><strong>Executive Note:</strong> ${customNotes}</div>` : ''}

      <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; tracking-wider;">
        Confirmed Pledges Directory (${pledgedLeads.length} Companies)
      </div>

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact &amp; Email</th>
            <th>Date/Time</th>
            <th>Target Tier</th>
            <th>Pipeline Status</th>
            <th style="text-align: right;">Pledged ($)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>
    <div class="footer">
      Dispatched to: <strong>${recipients.join(', ')}</strong><br/>
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed
    </div>
  </div>
</body>
</html>
`;

      const passwordToUse = cleanSmtpPassword(smtpState.pass || '');
      if (passwordToUse) {
        const transporter = createSmtpTransporter(passwordToUse);
        const mailOptions = {
          from: `"Fragrant Breeze Executive CRM" <${smtpState.user}>`,
          to: recipients.join(', '),
          cc: 'fragrant.breeze2023@gmail.com',
          replyTo: 'luc.valade@gmail.com',
          subject: `[10 AM PLEDGES REPORT] $${formattedTotal} CAD Secured as of ${formattedAsOfDate} (${pledgedLeads.length} Pledged Sponsors)`,
          text: `DAILY SPONSORSHIP PLEDGES REPORT (10:00 AM Dispatch)\nTotal Pledges Raised (As of ${formattedAsOfDate}): $${formattedTotal} CAD\nTotal Pledged Sponsors: ${pledgedLeads.length}\n\nDispatched to: ${recipients.join(', ')}`,
          html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[10 AM Pledges Report] Sent executive report to Saied & Luc:', info.messageId);

        addEmailLog({
          recipient: recipients.join(', '),
          recipientType: 'admin',
          subject: mailOptions.subject,
          status: 'sent',
          messageId: info.messageId,
          amount: totalPledged,
          golferName: `Daily 10 AM Report (${pledgedLeads.length} Sponsors)`
        });

        return res.json({ success: true, messageId: info.messageId, recipients, totalPledged, pledgedCount: pledgedLeads.length });
      } else {
        console.info('[10 AM Pledges Report] Generated report internally (SMTP password not provided)');
        return res.json({ success: true, emailDispatched: false, warning: 'Pledge report generated, SMTP offline.', totalPledged, pledgedCount: pledgedLeads.length });
      }
    } catch (err: any) {
      console.warn('[10 AM Pledges Report] Error dispatching report:', err?.message || err);
      return res.json({ success: true, emailDispatched: false, error: err?.message });
    }
  });

  // ==========================================
  // OUTREACH CRM & SOLICITATION EMAIL SYSTEM
  // ==========================================

  // Ontario Golf Vendors Directory - 351 captured names
  app.get('/api/outreach/ontario-golf-directory', (_req, res) => {
    try {
      const csvPath = path.join(process.cwd(), 'data', 'charity_golf_email_addresses.csv');
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: 'Directory file not found' });
      }
      const text = fs.readFileSync(csvPath, 'utf-8');
      
      // Parse CSV
      const rows: string[][] = [];
      let row: string[] = [];
      let token = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];
        if (c === '"' && inQuotes && next === '"') {
          token += '"';
          i++;
        } else if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          row.push(token.trim());
          token = '';
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
          if (c === '\r' && next === '\n') i++;
          row.push(token.trim());
          if (row.some((f) => f.length > 0)) rows.push(row);
          row = [];
          token = '';
        } else {
          token += c;
        }
      }
      if (token || row.length > 0) {
        row.push(token.trim());
        if (row.some((f) => f.length > 0)) rows.push(row);
      }

      const header = rows[0] || [];
      const dataRows = rows.slice(1);

      const items = dataRows.map((r, idx) => ({
        index: idx + 1,
        businessName: r[0] || '', // Column A
        emailAddress: r[6] || '', // Column G
        address: r[1] || '',
        city: r[2] || '',
        prov: r[3] || 'ON',
        description: r[4] || '',
        contactNumber: r[5] || '',
        namesForEmail: r[7] || '',
        contactPerson: r[8] || '',
        businessUrl: r[9] || ''
      }));

      res.json({
        sheetName: 'Ontario Golf Vendors Directory',
        columnA: 'Business Name',
        columnG: 'Email Address',
        totalCaptured: items.length,
        items
      });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Error loading directory' });
    }
  });

  // Get all outreach email logs
  app.get('/api/outreach/logs', (_req, res) => {
    res.json({ logs: outreachLogs });
  });

  // 1x1 Transparent GIF Open Tracking Pixel Handler
  const TRANSPARENT_GIF_BUFFER = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  app.get('/api/outreach/track-open/:logId', (req, res) => {
    const { logId } = req.params;
    try {
      const log = outreachLogs.find((l) => l.id === logId);
      if (log) {
        log.openCount = (log.openCount || 0) + 1;
        log.status = 'opened';
        if (!log.openedAt) {
          log.openedAt = new Date().toISOString();
        }
        persistOutreachLogs();
        console.log(`[Outreach Tracking] Email open recorded for lead ${log.leadBusiness} (${logId}), open count: ${log.openCount}`);
      }
    } catch (err) {
      console.warn('[Outreach Tracking] Error updating log on open:', err);
    }

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(TRANSPARENT_GIF_BUFFER);
  });

  // 1-Click Outreach Email Send Handler via Google Workspace SMTP
  app.post('/api/outreach/send', async (req, res) => {
    try {
      const {
        leadId,
        recipientEmail,
        recipientName,
        businessName,
        subject,
        bodyText,
        bodyHtml
      } = req.body;

      if (!recipientEmail || !subject) {
        return res.status(400).json({ error: 'recipientEmail and subject are required' });
      }

      if (isSuppressed(recipientEmail)) {
        return res.status(400).json({
          success: false,
          error: `Email address ${recipientEmail} is on the suppression list (bounced/blocked previously). Outreach was not sent.`
        });
      }

      if (!smtpState.pass) {
        return res.status(400).json({
          error: 'SMTP password not configured. Please save your Google Workspace App Password in Admin Portal.'
        });
      }

      const quota = getDailyQuota();
      if (quota.sentToday >= quota.dailyLimit) {
        return res.status(429).json({
          success: false,
          error: `Daily Google Workspace limit reached (${quota.dailyLimit} messages/day per account). Quota resets tomorrow.`
        });
      }

      const logId = `outreach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
      const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
      const trackingUrl = `${proto}://${host}/api/outreach/track-open/${logId}`;

      function formatBodyToHtml(text: string): string {
        const blocks = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          if (!trimmed) return '';
          const lines = trimmed.split('\n');
          if (lines.every(l => /^\s*[*•-]\s+/.test(l))) {
            const items = lines.map(l => {
              let item = l.replace(/^\s*[*•-]\s+/, '').trim();
              item = item.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              item = item.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return `<li style="margin-bottom: 6px; line-height: 1.6; color: #334155;">${item}</li>`;
            }).join('');
            return `<ul style="margin: 10px 0 16px 20px; padding: 0;">${items}</ul>`;
          } else {
            let pText = lines.map(l => {
              let line = l.trim();
              line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              line = line.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return line;
            }).join('<br/>');
            return `<p style="margin: 0 0 16px 0; line-height: 1.65; color: #334155; font-size: 14.5px;">${pText}</p>`;
          }
        }).join('');
      }

      const rawBody = bodyHtml || (bodyText ? formatBodyToHtml(bodyText) : '');

      const trackingPixelHtml = `<img src="${trackingUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`;

      const styledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #1E4D2B; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #D4AF37; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #D4AF37; color: #1E4D2B; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
    .title { font-size: 20px; font-weight: bold; margin: 0; color: #ffffff; }
    .subtitle { font-size: 13px; color: #e2e8f0; margin-top: 4px; }
    .content { padding: 28px; font-size: 14px; line-height: 1.65; color: #334155; }
    .footer { background-color: #f1f5f9; padding: 18px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
    .btn { display: inline-block; background-color: #1E4D2B; color: #ffffff !important; font-weight: bold; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Tournament Outreach</div>
      <div class="title">Fragrant Breeze Memorial Golf Classic</div>
      <div class="subtitle">October 5, 2026 &bull; Burford Golf Links Course</div>
    </div>
    <div class="content">
      ${rawBody}
      ${trackingPixelHtml}
    </div>
    <div class="footer">
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed<br />
      Benefiting Juravinski Breast Cancer Research &amp; Canadian Red Cross<br />
      Questions or replies? Simply reply directly to this email or call (905) 818-2005.
    </div>
  </div>
</body>
</html>
`;

      const transporter = createSmtpTransporter(smtpState.pass);
      const mailOptions = {
        from: `"Fragrant Breeze Golf Classic - Outreach" <${smtpState.user}>`,
        to: recipientEmail,
        replyTo: 'luc.valade@gmail.com',
        subject: subject,
        text: bodyText || subject,
        html: styledHtml
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('[Outreach Mailer] Successfully dispatched letter to', recipientEmail, 'messageId:', info.messageId);

      recordOutreachSent(1);

      const logEntry: ServerOutreachLog = {
        id: logId,
        leadId: leadId || 'unlinked',
        leadBusiness: businessName || recipientEmail,
        recipientEmail: recipientEmail,
        recipientName: recipientName || recipientEmail,
        subject: subject,
        sentAt: new Date().toISOString(),
        status: 'sent',
        openCount: 0,
        messageId: info.messageId
      };

      outreachLogs.unshift(logEntry);
      if (outreachLogs.length > 300) outreachLogs = outreachLogs.slice(0, 300);
      persistOutreachLogs();

      return res.json({
        success: true,
        logId,
        messageId: info.messageId,
        recipient: recipientEmail,
        remainingQuota: Math.max(0, dailyQuotaState.dailyLimit - dailyQuotaState.sentToday)
      });
    } catch (err: any) {
      const { friendlyMessage } = parseSmtpError(err);
      console.info('[Outreach Mailer Notice]:', friendlyMessage);
      return res.json({
        success: false,
        error: friendlyMessage || err?.message || 'Failed to dispatch email letter via SMTP.'
      });
    }
  });

  // Get Daily Mail Merge Quota Status (up to 1,500 messages/day for Google Workspace)
  app.get('/api/outreach/quota', (_req, res) => {
    const q = getDailyQuota();
    res.json({
      date: q.date,
      sentToday: q.sentToday,
      dailyLimit: q.dailyLimit,
      remaining: Math.max(0, q.dailyLimit - q.sentToday)
    });
  });

  // Send Test Template Email directly to luc.valade@gmail.com
  app.post('/api/outreach/send-test-template', async (req, res) => {
    try {
      const targetEmail = (req.body.recipientEmail || 'luc.valade@gmail.com').trim();
      const subject = req.body.subject || 'Showcase Your Brand at the 6TH Annual Charity Fragrant Breeze Golf Tournament — Hole & Contest Sponsorship';
      const bodyText = req.body.bodyText || '';
      const bodyHtml = req.body.bodyHtml;

      if (!smtpState.pass) {
        return res.status(400).json({
          success: false,
          error: 'SMTP password not configured. Please save your Google Workspace App Password in Admin Portal Email Settings.'
        });
      }

      const logId = `test-outreach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
      const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
      const trackingUrl = `${proto}://${host}/api/outreach/track-open/${logId}`;

      function formatTextToHtml(text: string): string {
        const blocks = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          if (!trimmed) return '';
          const lines = trimmed.split('\n');
          if (lines.every(l => /^\s*[*•-]\s+/.test(l))) {
            const items = lines.map(l => {
              let item = l.replace(/^\s*[*•-]\s+/, '').trim();
              item = item.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              item = item.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return `<li style="margin-bottom: 6px; line-height: 1.6; color: #334155;">${item}</li>`;
            }).join('');
            return `<ul style="margin: 10px 0 16px 20px; padding: 0;">${items}</ul>`;
          } else {
            let pText = lines.map(l => {
              let line = l.trim();
              line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              line = line.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return line;
            }).join('<br/>');
            return `<p style="margin: 0 0 16px 0; line-height: 1.65; color: #334155; font-size: 14.5px;">${pText}</p>`;
          }
        }).join('');
      }

      const contentHtml = bodyHtml || formatTextToHtml(bodyText);
      const trackingPixelHtml = `<img src="${trackingUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`;

      const styledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #1E4D2B; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #D4AF37; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #D4AF37; color: #1E4D2B; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
    .test-pill { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #38bdf8; color: #082f49; padding: 3px 8px; border-radius: 4px; margin-left: 6px; }
    .title { font-size: 20px; font-weight: bold; margin: 0; color: #ffffff; }
    .subtitle { font-size: 13px; color: #e2e8f0; margin-top: 4px; }
    .content { padding: 28px; font-size: 14px; line-height: 1.65; color: #334155; }
    .footer { background-color: #f1f5f9; padding: 18px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <span class="badge">Official Tournament Outreach</span>
        <span class="test-pill">Template Test Preview</span>
      </div>
      <div class="title">Fragrant Breeze Memorial Golf Classic</div>
      <div class="subtitle">October 5, 2026 &bull; Burford Golf Links Course</div>
    </div>
    <div class="content">
      ${contentHtml}
      ${trackingPixelHtml}
    </div>
    <div class="footer">
      Sent to: <strong>${targetEmail}</strong> as an authorized preview.<br/>
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed<br />
      Benefiting Juravinski Breast Cancer Research &amp; Canadian Red Cross<br />
      Questions or replies? Reply to this email or call (905) 818-2005.
    </div>
  </div>
</body>
</html>
`;

      const transporter = createSmtpTransporter(smtpState.pass);
      const mailOptions = {
        from: `"Fragrant Breeze Golf Classic" <${smtpState.user}>`,
        to: targetEmail,
        replyTo: 'luc.valade@gmail.com',
        subject: `[TEST PREVIEW] ${subject}`,
        text: bodyText || subject,
        html: styledHtml
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('[Test Template Mailer] Successfully dispatched preview to', targetEmail, 'messageId:', info.messageId);

      return res.json({
        success: true,
        messageId: info.messageId,
        recipient: targetEmail,
        message: `Test email with template successfully delivered to ${targetEmail}!`
      });
    } catch (err: any) {
      const { friendlyMessage, isAuthError, helpUrl } = parseSmtpError(err);
      console.info(`[Test Template Mailer Notice] ${friendlyMessage}`);
      return res.json({
        success: false,
        error: friendlyMessage || err?.message || 'Failed to dispatch test template email.',
        isAuthError,
        helpUrl
      });
    }
  });

  // MASS EMAIL / MAIL MERGE DISPATCH SYSTEM
  // Enforces daily limit up to 1,500 messages per day per Google Workspace account
  app.post('/api/outreach/send-batch', async (req, res) => {
    try {
      const {
        recipients,
        templateId,
        subjectTemplate,
        bodyTemplate,
        batchDelayMs = 300
      } = req.body;

      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients array is required and must not be empty' });
      }

      if (!subjectTemplate || !bodyTemplate) {
        return res.status(400).json({ error: 'subjectTemplate and bodyTemplate are required' });
      }

      if (!smtpState.pass) {
        return res.status(400).json({
          error: 'SMTP password not configured. Please save your Google Workspace App Password in Admin Portal.'
        });
      }

      // Filter out suppressed and invalid contacts before quota check
      const cleanRecipients = recipients.filter((r: any) => !isSuppressed(r.recipientEmail));
      const suppressedCount = recipients.length - cleanRecipients.length;

      const quota = getDailyQuota();
      const remainingQuota = Math.max(0, quota.dailyLimit - quota.sentToday);

      if (remainingQuota <= 0) {
        return res.status(429).json({
          success: false,
          error: `Daily limit reached (${quota.dailyLimit} messages/day per Google Workspace account). You have sent ${quota.sentToday} messages today. Limit resets tomorrow.`,
          sentToday: quota.sentToday,
          dailyLimit: quota.dailyLimit,
          remaining: 0
        });
      }

      // Check if batch exceeds remaining quota
      const toProcess = cleanRecipients.slice(0, remainingQuota);
      const willBeSkippedDueToQuota = cleanRecipients.length - toProcess.length;

      const transporter = createSmtpTransporter(smtpState.pass);
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
      const proto = req.get('x-forwarded-proto') || req.protocol || 'https';

      function interpolateTokens(tpl: string, lead: any): string {
        const biz = lead.businessName || 'Valued Business Partner';
        const person = lead.recipientName || lead.businessName || 'Community Partner';
        const tier = lead.targetTier || 'Hole & Contest Sponsor';
        const city = lead.city || 'Burford / Brantford area';

        return tpl
          .replace(/\{\{\s*business_name\s*\}\}/gi, biz)
          .replace(/\[Company Name\]/gi, biz)
          .replace(/\[Sponsor Name\]/gi, biz)
          .replace(/\{\{\s*recipient_name\s*\}\}/gi, person)
          .replace(/\[Contact Name\]/gi, person)
          .replace(/\{\{\s*target_tier\s*\}\}/gi, tier)
          .replace(/\[Target Tier\]/gi, tier)
          .replace(/\{\{\s*city\s*\}\}/gi, city)
          .replace(/\[City\]/gi, city)
          .replace(/\{\{\s*tournament_date\s*\}\}/gi, 'Monday October 5, 2026')
          .replace(/\[Tournament Date\]/gi, 'Monday October 5, 2026')
          .replace(/\{\{\s*venue_name\s*\}\}/gi, 'Burford Golf Links Course')
          .replace(/\[Course Location\]/gi, 'Burford Golf Links Course 120 Golf Links Rd., Burford ON')
          .replace(/\{\{\s*contact_number\s*\}\}/gi, '(905) 818-2005')
          .replace(/\[Founder Name\]/gi, 'Saied Mohammed')
          .replace(/\[Beneficiary Org\]/gi, 'Juravinski Breast Cancer Research & Canadian Red Cross')
          .replace(/\[Memorial Honoree\]/gi, 'Naseem Mohammed');
      }

      function formatTextToHtml(text: string): string {
        const blocks = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          if (!trimmed) return '';
          const lines = trimmed.split('\n');
          if (lines.every(l => /^\s*[*•-]\s+/.test(l))) {
            const items = lines.map(l => {
              let item = l.replace(/^\s*[*•-]\s+/, '').trim();
              item = item.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              item = item.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return `<li style="margin-bottom: 6px; line-height: 1.6; color: #334155;">${item}</li>`;
            }).join('');
            return `<ul style="margin: 10px 0 16px 20px; padding: 0;">${items}</ul>`;
          } else {
            let pText = lines.map(l => {
              let line = l.trim();
              line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1E4D2B; font-weight: bold; text-decoration: underline;">$1</a>');
              line = line.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');
              return line;
            }).join('<br/>');
            return `<p style="margin: 0 0 16px 0; line-height: 1.65; color: #334155; font-size: 14.5px;">${pText}</p>`;
          }
        }).join('');
      }

      const results: Array<{
        leadId: string;
        recipientEmail: string;
        businessName: string;
        status: 'sent' | 'failed';
        messageId?: string;
        error?: string;
        logId?: string;
      }> = [];

      let succeededCount = 0;
      let failedCount = 0;

      // Sequential dispatch with throttling delay to respect SMTP rate limits
      for (let i = 0; i < toProcess.length; i++) {
        const lead = toProcess[i];
        const personalizedSubject = interpolateTokens(subjectTemplate, lead);
        const personalizedBodyText = interpolateTokens(bodyTemplate, lead);
        const personalizedBodyHtml = formatTextToHtml(personalizedBodyText);

        const logId = `outreach-batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        const trackingUrl = `${proto}://${host}/api/outreach/track-open/${logId}`;
        const trackingPixelHtml = `<img src="${trackingUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`;

        const styledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #1E4D2B; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #D4AF37; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #D4AF37; color: #1E4D2B; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
    .title { font-size: 20px; font-weight: bold; margin: 0; color: #ffffff; }
    .subtitle { font-size: 13px; color: #e2e8f0; margin-top: 4px; }
    .content { padding: 28px; font-size: 14px; line-height: 1.65; color: #334155; }
    .footer { background-color: #f1f5f9; padding: 18px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Tournament Outreach</div>
      <div class="title">Fragrant Breeze Memorial Golf Classic</div>
      <div class="subtitle">October 5, 2026 &bull; Burford Golf Links Course</div>
    </div>
    <div class="content">
      ${personalizedBodyHtml}
      ${trackingPixelHtml}
    </div>
    <div class="footer">
      Fragrant Breeze Memorial Golf Classic &bull; Honoring Naseem Mohammed<br />
      Benefiting Juravinski Breast Cancer Research &amp; Canadian Red Cross<br />
      Questions or replies? Reply directly to this email or call (905) 818-2005.
    </div>
  </div>
</body>
</html>
`;

        try {
          const info = await transporter.sendMail({
            from: `"Fragrant Breeze Golf Classic - Outreach" <${smtpState.user}>`,
            to: lead.recipientEmail,
            replyTo: 'luc.valade@gmail.com',
            subject: personalizedSubject,
            text: personalizedBodyText,
            html: styledHtml
          });

          recordOutreachSent(1);
          succeededCount++;

          const logEntry: ServerOutreachLog = {
            id: logId,
            leadId: lead.leadId || 'unlinked',
            leadBusiness: lead.businessName || lead.recipientEmail,
            recipientEmail: lead.recipientEmail,
            recipientName: lead.recipientName || lead.recipientEmail,
            subject: personalizedSubject,
            sentAt: new Date().toISOString(),
            status: 'sent',
            openCount: 0,
            messageId: info.messageId
          };

          outreachLogs.unshift(logEntry);

          results.push({
            leadId: lead.leadId,
            recipientEmail: lead.recipientEmail,
            businessName: lead.businessName,
            status: 'sent',
            messageId: info.messageId,
            logId
          });
        } catch (err: any) {
          failedCount++;
          const { friendlyMessage } = parseSmtpError(err);
          results.push({
            leadId: lead.leadId,
            recipientEmail: lead.recipientEmail,
            businessName: lead.businessName,
            status: 'failed',
            error: friendlyMessage || err?.message || 'Dispatch failed'
          });

          // If auth error, abort batch early to prevent spamming failed attempts
          const isAuthErr = err?.responseCode === 535 || err?.responseCode === 534;
          if (isAuthErr && i === 0) {
            persistOutreachLogs();
            return res.json({
              success: false,
              error: friendlyMessage,
              succeededCount,
              failedCount,
              results,
              stoppedEarly: true
            });
          }
        }

        // Slight rate-limiting delay between SMTP transactions
        if (i < toProcess.length - 1 && batchDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, Math.min(1000, batchDelayMs)));
        }
      }

      if (outreachLogs.length > 500) outreachLogs = outreachLogs.slice(0, 500);
      persistOutreachLogs();

      const finalQuota = getDailyQuota();

      return res.json({
        success: succeededCount > 0,
        totalRequested: recipients.length,
        processed: toProcess.length,
        succeededCount,
        failedCount,
        skippedDueToQuota: willBeSkippedDueToQuota,
        dailySentToday: finalQuota.sentToday,
        dailyLimit: finalQuota.dailyLimit,
        remainingDailyQuota: Math.max(0, finalQuota.dailyLimit - finalQuota.sentToday),
        results
      });
    } catch (err: any) {
      console.warn('[Outreach Batch Error]:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Server error processing batch dispatch'
      });
    }
  });

  // =========================================================
  // PRECISION CAMPAIGN SCHEDULER & CLOUD FUNCTION ROUTING
  // Handles America/Toronto 8:00 PM Eastern scheduling & Pre-Dispatch Safety Checks
  // =========================================================

  // Schedule a Precision Campaign Blast
  app.post('/api/outreach/schedule', (req, res) => {
    try {
      const {
        leadIds,
        recipients,
        templateId,
        subjectTemplate,
        bodyTemplate,
        scheduledForLocal,
        timezone = 'America/Toronto',
        scheduledForUTC,
        scheduledForEasternDisplay,
        targetSegment = 'unopened_only'
      } = req.body;

      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients list is required' });
      }

      if (!scheduledForUTC) {
        return res.status(400).json({ error: 'scheduledForUTC is required' });
      }

      const campaignId = `camp_sched_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const newCampaign: ScheduledCampaign = {
        id: campaignId,
        leadIds: leadIds || recipients.map((r: any) => r.leadId),
        recipients,
        templateId: templateId || 'tpl-precision',
        subjectTemplate,
        bodyTemplate,
        scheduledForLocal: scheduledForLocal || '2026-09-27T20:00',
        timezone: timezone || 'America/Toronto',
        scheduledForUTC,
        scheduledForEasternDisplay: scheduledForEasternDisplay || 'Sunday, Sept 27 @ 8:00 PM Eastern',
        targetSegment,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      scheduledCampaigns.unshift(newCampaign);
      persistScheduledCampaigns();

      return res.json({
        success: true,
        message: `Campaign scheduled for exactly 8:00 PM Eastern (${newCampaign.scheduledForEasternDisplay}).`,
        campaign: newCampaign
      });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || 'Error scheduling campaign' });
    }
  });

  // Get all scheduled campaigns
  app.get('/api/outreach/scheduled', (_req, res) => {
    return res.json({
      success: true,
      campaigns: scheduledCampaigns
    });
  });

  // Process due scheduled campaigns (Pre-Dispatch Safety Check included)
  app.post('/api/outreach/process-scheduled', async (req, res) => {
    try {
      const liveLeadStatuses = req.body?.liveLeadStatuses;
      const resData = await processScheduledEmails(new Date(), liveLeadStatuses);
      return res.json({
        success: true,
        ...resData
      });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || 'Error processing scheduled emails' });
    }
  });

  // Cancel a scheduled campaign
  app.delete('/api/outreach/scheduled/:id', (req, res) => {
    const { id } = req.params;
    const campaign = scheduledCampaigns.find((c) => c.id === id);
    if (!campaign) {
      return res.status(404).json({ error: 'Scheduled campaign not found' });
    }
    campaign.status = 'cancelled';
    persistScheduledCampaigns();
    return res.json({ success: true, message: 'Scheduled campaign cancelled', campaign });
  });

  // Background cron check for Precision Campaign Scheduler (Runs every 30 seconds)
  setInterval(() => {
    processScheduledEmails().catch((err) => {
      console.warn('[Precision Scheduler Background Check Error]:', err);
    });
  }, 30000);

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
