import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Mail,
  Send,
  Eye,
  FileText,
  Building2,
  User,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Phone,
  ExternalLink,
  RotateCcw,
  Check,
  Wand2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { OutreachLead, OutreachEmailTemplate } from '../../types';
import { EVENT_DETAILS } from '../../data/initialData';
import { outreachAnalytics, CampaignRecord } from '../../services/outreachAnalyticsService';
import { interpolateLetterTokens, renderOutreachMarkdownToHtml } from '../../utils/outreachMarkdown';

interface SendLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: OutreachLead | null;
  templates: OutreachEmailTemplate[];
  onSendEmail: (
    leadId: string,
    templateId: string,
    subject: string,
    body: string,
    bodyHtml?: string,
    campaignId?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export const SendLetterModal: React.FC<SendLetterModalProps> = ({
  isOpen,
  onClose,
  lead,
  templates,
  onSendEmail
}) => {
  // Prefer the official "Showcase Your Brand" Hole & Contest template
  const defaultTpl =
    templates.find((t) => t.category === 'hole_contest_sponsorship') ||
    templates.find((t) => t.isDefault) ||
    templates[0];

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTpl?.id || '');
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp_2');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const list = outreachAnalytics.getCampaigns();
    setCampaigns(list);
    if (list.length > 0) {
      setSelectedCampaignId(list[0].id);
    }
  }, []);

  // AI Assistant Drawer state
  const [showAiToolbar, setShowAiToolbar] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiActionMessage, setAiActionMessage] = useState<string>('');

  // When template changes, interpolate defaults
  useEffect(() => {
    const tpl = templates.find((t) => t.id === selectedTemplateId) || defaultTpl;
    if (tpl && lead) {
      setSubject(interpolateLetterTokens(tpl.subject, lead));
      setBody(interpolateLetterTokens(tpl.body, lead));
    }
  }, [selectedTemplateId, lead, templates]);

  // Insert token chip into body
  const handleInsertToken = (token: string) => {
    setBody((prev) => prev + token);
  };

  // Generate rendered HTML for live Branded Preview and dispatch
  const renderedHtml = useMemo(() => {
    return renderOutreachMarkdownToHtml(body);
  }, [body]);

  // AI Assistant actions
  const handleAiAction = (actionType: 'tailor_local' | 'contest_focus' | 'concise' | 'philanthropic' | 'reset') => {
    if (!lead) return;
    setAiGenerating(true);
    setAiActionMessage('Applying AI customization...');

    setTimeout(() => {
      const bizName = lead.businessName || 'Valued Partner';
      const cityStr = lead.city ? ` in ${lead.city}` : ' in our community';

      if (actionType === 'reset') {
        const tpl = templates.find((t) => t.id === selectedTemplateId) || defaultTpl;
        if (tpl) {
          setSubject(interpolateLetterTokens(tpl.subject, lead));
          setBody(interpolateLetterTokens(tpl.body, lead));
          setAiActionMessage('Restored to official template specifications.');
        }
      } else if (actionType === 'tailor_local') {
        setSubject(`Showcase ${bizName} at the 6TH Annual Charity Fragrant Breeze Golf Tournament`);
        setBody(
          `Dear **${bizName}**,

Community leadership and local business visibility are at the heart of our annual charity golf tournament, hosted in loving memory to support vital local causes. Given your outstanding presence${cityStr}, we would be honored to partner with **${bizName}** this season.

On **Monday October 5, 2026**, we are welcoming more than 60 local leaders, golfers, and community members to the Championship Venue of **[Burford Golf Links Course](https://golfnorth.ca/burford)** 120 Golf Links Rd., Burford ON, for an exceptional day of golf, networking, and philanthropy. We are currently inviting select local businesses to sponsor our high-visibility on-course contests, including the Closest-to-the-Pin, Longest Drive holes, Hole in one, Longest Putt, Closest to Squiggley line and top 4-some teams.

**Hole & Contest Sponsorship Benefits Include:**
* **Dedicated Signage:** Exclusive corporate signage prominently displayed on your sponsored tee box or green.
* **Direct Customer Engagement:** An opportunity to set up a promotional station at your hole to greet players, distribute branded collateral, or host a mini-game.
* **Digital & Leaderboard Visibility:** Company logo featured on the tournament website and live digital leaderboard.
* **Banquet Invitation:** Tickets to join our post-tournament awards dinner and networking reception.

Partnering as a hole sponsor is an exceptional way to put **${bizName}** in front of active community members while supporting a meaningful memorial cause. Please let me know if you would like to claim a hole sponsor slot, or feel free to contact me at **[(905) 818-2005](tel:19058182005)**.

Warm regards,

Saied Mohammed
Tournament Director
[(905) 818-2005](tel:19058182005)

[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`
        );
        setAiActionMessage(`Customized specifically for ${bizName}${cityStr}.`);
      } else if (actionType === 'contest_focus') {
        setSubject(`High-Visibility On-Course Contest Sponsorship — 6th Annual Fragrant Breeze Classic`);
        setBody(
          `Dear **${bizName}**,

We are excited to present a premier branding opportunity for **${bizName}** at the 6th Annual Fragrant Breeze Memorial Golf Classic.

On **Monday October 5, 2026**, over 60 local executives, entrepreneurs, and golfers will compete at the Championship Venue of **[Burford Golf Links Course](https://golfnorth.ca/burford)** 120 Golf Links Rd., Burford ON. We have opened exclusive sponsorship for our most active competition holes:

**Available Contest Sponsorships:**
* **Hole-in-One Championship Contest:** Standout brand attribution on our headline prize hole.
* **Closest-to-the-Pin & Longest Drive:** High-traffic tee boxes with dedicated custom company signage.
* **Putting Contest & Closest to Squiggley Line:** Continuous golfer engagement throughout the round.
* **Top 4-Some Team Awards:** Co-branded trophy presentation during our evening banquet.

Each contest sponsor receives exclusive tee signage, digital exposure on our live scoring app, and tickets to our post-round awards banquet.

Please call me at **[(905) 818-2005](tel:19058182005)** to secure your preferred contest hole before slots fill.

Warm regards,

Saied Mohammed
Tournament Director
[(905) 818-2005](tel:19058182005)

[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`
        );
        setAiActionMessage('Refocused letter on competitive contest holes & prizes.');
      } else if (actionType === 'concise') {
        setSubject(`Hole & Contest Sponsorship — Fragrant Breeze Charity Golf (Oct 5)`);
        setBody(
          `Dear **${bizName}**,

I am writing to invite **${bizName}** to sponsor an on-course contest at the 6th Annual Charity Fragrant Breeze Golf Tournament on **Monday October 5, 2026** at **[Burford Golf Links Course](https://golfnorth.ca/burford)** 120 Golf Links Rd., Burford ON.

We are welcoming 60+ local community leaders for a full day of scramble golf benefiting Juravinski Cancer Research and local programs.

**Sponsorship Highlights:**
* Dedicated 24"x18" tee box signage with your company logo
* Direct interaction with golfers via your own promo table or activity
* Website and live digital leaderboard recognition
* Post-round awards banquet invitation

To claim your hole or ask any questions, please reply directly to this email or call me at **[(905) 818-2005](tel:19058182005)**.

Warm regards,

Saied Mohammed
Tournament Director
[(905) 818-2005](tel:19058182005)

[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`
        );
        setAiActionMessage('Condensed to concise executive 45-second read.');
      } else if (actionType === 'philanthropic') {
        setSubject(`Supporting Local Cancer Research & Community — Fragrant Breeze Golf Memorial`);
        setBody(
          `Dear **${bizName}**,

Community compassion and local business solidarity are the cornerstones of the Fragrant Breeze Memorial Golf Classic, held annually in loving tribute to Naseem Mohammed.

On **Monday October 5, 2026**, community champions and business leaders will gather at **[Burford Golf Links Course](https://golfnorth.ca/burford)** 120 Golf Links Rd., Burford ON, to turn our shared fellowship into tangible support for vital cancer research and community relief initiatives.

We would be deeply honored to welcome **${bizName}** as an official Hole & Contest Sponsor. Your partnership directly underwrites our charitable contributions while providing prominent visibility:
* Dedicated memorial & corporate tee box signage
* Logo recognition in our tribute program and tournament website
* Opportunities to greet participants on-course
* Evening banquet invitation to celebrate our fundraising milestones

Thank you for considering partnering with us for this heartfelt mission. Please feel free to reach me at **[(905) 818-2005](tel:19058182005)**.

With heartfelt appreciation,

Saied Mohammed
Tournament Director & Founder
[(905) 818-2005](tel:19058182005)

[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`
        );
        setAiActionMessage('Harmonized tone with memorial tribute & charity impact.');
      }

      setAiGenerating(false);
    }, 350);
  };

  const { sendTestTemplateEmail } = useTournament();
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentNotice, setTestSentNotice] = useState(false);

  const handleSendTestToLuc = async () => {
    setIsSendingTest(true);
    setErrorMessage('');
    const htmlToSend = renderOutreachMarkdownToHtml(body);
    const res = await sendTestTemplateEmail({
      templateId: selectedTemplateId,
      subject: subject,
      bodyText: body,
      bodyHtml: htmlToSend,
      recipientEmail: 'luc.valade@gmail.com'
    });
    setIsSendingTest(false);
    if (res.success) {
      setTestSentNotice(true);
      setTimeout(() => setTestSentNotice(false), 3000);
    } else {
      setErrorMessage(res.error || 'Failed to send test preview email to luc.valade@gmail.com.');
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setErrorMessage('Please provide both an email subject and letter body.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    // Send both plain text and rich HTML
    const htmlToSend = renderOutreachMarkdownToHtml(body);
    const res = await onSendEmail(lead.id, selectedTemplateId, subject, body, htmlToSend, selectedCampaignId);
    
    // Also trigger custom event for local analytics service
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fbgt:email-sent', {
          detail: {
            leadId: lead.id,
            businessName: lead.businessName,
            recipientEmail: lead.emailAddress,
            recipientName: lead.recipientName,
            subject,
            templateId: selectedTemplateId,
            campaignId: selectedCampaignId
          }
        })
      );
    }

    setIsSending(false);

    if (res.success) {
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 1800);
    } else {
      setErrorMessage(res.error || 'Failed to dispatch email. Please check your SMTP password.');
    }
  };

  if (!isOpen || !lead) return null;

  // Check compliance items
  const hasCourseLink = (body || '').includes('https://golfnorth.ca/burford');
  const hasPhoneDialer = (body || '').includes('tel:19058182005');
  const hasTournamentLink = (body || '').includes('fragrant-breeze-golf-tournament');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1E4D2B] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">1-Click Solicitation Dispatch</h2>
              <p className="text-xs text-emerald-200/90">
                Personalized tournament outreach with 1x1 open tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
            disabled={isSending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Summary Bar */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/60 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>{lead.businessName}</span>
            </div>
            {lead.recipientName && lead.recipientName !== lead.businessName && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{lead.recipientName}</span>
              </div>
            )}
            <div className="text-slate-600 font-mono text-[11px]">
              &lt;{lead.emailAddress}&gt;
            </div>
            {lead.city && (
              <span className="text-slate-500 text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {lead.city}, {lead.prov || 'ON'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold border border-emerald-300 text-[11px]">
              {lead.targetTier || 'Hole Sponsor'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to Send Email</p>
                <p className="text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {sendSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#1E4D2B] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Letter Successfully Dispatched!</p>
                <p className="text-emerald-700">
                  Routed via Google Workspace SMTP. Status updated to <strong>Letter Sent</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Campaign & Template Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
                Campaign:
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden w-full"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
                Template:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden w-full truncate"
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Switcher & AI Toolbar Toggle */}
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              onClick={() => setShowAiToolbar(!showAiToolbar)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
                showAiToolbar
                  ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Assistant</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showAiToolbar ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className={`px-3 py-1 font-semibold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  !isPreviewMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className={`px-3 py-1 font-semibold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  isPreviewMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Branded Preview</span>
              </button>
            </div>
          </div>

          {/* AI Outreach Assistant Bar */}
          {showAiToolbar && (
            <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border border-purple-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>AI Outreach Assistant &amp; Compliance Optimizer</span>
                </div>
                {aiActionMessage && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-700" />
                    {aiActionMessage}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => handleAiAction('tailor_local')}
                  className="px-2.5 py-1.5 bg-white hover:bg-purple-50 text-purple-900 font-semibold rounded-lg border border-purple-200 shadow-2xs transition cursor-pointer text-left flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                  <span className="truncate">Tailor to Lead</span>
                </button>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => handleAiAction('contest_focus')}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 font-semibold rounded-lg border border-amber-200 shadow-2xs transition cursor-pointer text-left flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate">Contest Holes Focus</span>
                </button>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => handleAiAction('concise')}
                  className="px-2.5 py-1.5 bg-white hover:bg-sky-50 text-sky-900 font-semibold rounded-lg border border-sky-200 shadow-2xs transition cursor-pointer text-left flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-sky-600 shrink-0" />
                  <span className="truncate">Concise 45s Read</span>
                </button>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => handleAiAction('philanthropic')}
                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 font-semibold rounded-lg border border-emerald-200 shadow-2xs transition cursor-pointer text-left flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Memorial Focus</span>
                </button>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => handleAiAction('reset')}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer text-left flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">Reset Template</span>
                </button>
              </div>

              {/* Requirement Check Indicators */}
              <div className="pt-2 border-t border-purple-200/60 flex flex-wrap items-center gap-3 text-[11px]">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Requirements:</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${hasCourseLink ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasCourseLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '○'}
                  Burford Golf Links Link
                </span>
                <span className={`inline-flex items-center gap-1 font-semibold ${hasPhoneDialer ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasPhoneDialer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '○'}
                  Phone Click-to-Call Link
                </span>
                <span className={`inline-flex items-center gap-1 font-semibold ${hasTournamentLink ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasTournamentLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '○'}
                  Tournament URL Link
                </span>
              </div>
            </div>
          )}

          {!isPreviewMode ? (
            /* Edit Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm font-semibold px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  placeholder="Subject line..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Letter Body (Markdown Supported)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Auto-interpolated for {lead.businessName}
                  </span>
                </div>
                <textarea
                  rows={13}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full text-xs sm:text-sm font-mono leading-relaxed p-3.5 bg-slate-50 border border-slate-300 rounded-xl shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden resize-y text-slate-800"
                  placeholder="Compose your personalized solicitation letter..."
                />
              </div>

              {/* Quick Insertion Chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Insert token or quick link:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleInsertToken(` **${lead.businessName}** `)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <span>[Sponsor Name]</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertToken(' **[Burford Golf Links Course](https://golfnorth.ca/burford)** ')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-emerald-700" />
                    <span>Burford Links Course Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertToken(' **[(905) 818-2005](tel:19058182005)** ')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-amber-700" />
                    <span>(905) 818-2005 Dialer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertToken(' [Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio) ')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg font-mono transition cursor-pointer"
                  >
                    Tournament Web URL
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertToken(' Monday October 5, 2026 ')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg font-mono transition cursor-pointer"
                  >
                    Tournament Date
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Branded Preview Mode */
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100 p-4">
              <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden text-xs">
                {/* Header Banner */}
                <div className="bg-[#1E4D2B] text-white p-5 border-b-3 border-[#D4AF37]">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#1E4D2B] px-2 py-0.5 rounded">
                    Official Tournament Outreach
                  </span>
                  <h3 className="text-base font-bold mt-2 text-white">
                    Fragrant Breeze Memorial Golf Classic
                  </h3>
                  <p className="text-emerald-200 text-[11px] mt-0.5">
                    {EVENT_DETAILS.dateString} &bull; Burford Golf Links Course
                  </p>
                </div>

                {/* Email Metadata */}
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div>
                    <strong className="text-slate-700">To:</strong> {lead.recipientName || lead.businessName} &lt;{lead.emailAddress}&gt;
                  </div>
                  <div>
                    <strong className="text-slate-700">Subject:</strong> {subject}
                  </div>
                </div>

                {/* Letter Body Preview with Rich Formatted HTML */}
                <div
                  className="p-5 text-slate-700 leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />

                {/* Footer */}
                <div className="bg-slate-50 p-4 text-[11px] text-slate-500 border-t border-slate-200 text-center leading-normal">
                  Fragrant Breeze Memorial Golf Classic &bull; Honoring {EVENT_DETAILS.memorialHonoree}<br />
                  Benefiting {EVENT_DETAILS.beneficiaryOrg}<br />
                  Direct questions or replies to{' '}
                  <a href="tel:19058182005" className="text-[#1E4D2B] font-bold underline">
                    {EVENT_DETAILS.phone}
                  </a>.
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Tracking Note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Automated Open Tracking &amp; Delivery</p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                Sent from <strong>sales@aiopenhouseconnect.com</strong> with <strong>Reply-To: luc.valade@gmail.com</strong>.
                An embedded 1x1 transparent tracking pixel will automatically capture when {lead.recipientName || lead.businessName} opens this letter.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendTestToLuc}
              disabled={isSending || isSendingTest}
              className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Dispatches a live preview directly to luc.valade@gmail.com without contacting the lead"
            >
              {isSendingTest ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Test...</span>
                </>
              ) : testSentNotice ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sent to luc.valade@gmail.com!</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Test to luc.valade@gmail.com</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || sendSuccess}
              className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Letter via Google Workspace...</span>
                </>
              ) : sendSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Dispatch Solicitation Letter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
