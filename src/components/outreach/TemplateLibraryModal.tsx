import React, { useState } from 'react';
import {
  X,
  FileText,
  Plus,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
  Type,
  Mail,
  Send,
  RotateCcw
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { OutreachEmailTemplate } from '../../types';
import { renderOutreachMarkdownToHtml } from '../../utils/outreachMarkdown';
import { capitalizeWords, capitalizeParagraphs } from '../../utils/textFormatting';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: OutreachEmailTemplate[];
  onAddTemplate: (tpl: Omit<OutreachEmailTemplate, 'id' | 'updatedAt'>) => void;
  onUpdateTemplate: (id: string, updates: Partial<OutreachEmailTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id || '');
  const [isEditingNew, setIsEditingNew] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OutreachEmailTemplate['category']>('corporate_sponsorship');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const { sendTestTemplateEmail } = useTournament();
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentNotice, setTestSentNotice] = useState(false);
  const [testError, setTestError] = useState('');

  const currentTemplate = templates.find((t) => t.id === activeTemplateId);

  const handleSendTestToLuc = async () => {
    setIsSendingTest(true);
    setTestError('');
    const sampleBody = body
      .replace(/\[Sponsor Name\]/gi, 'Brantford Financial Services')
      .replace(/\[Company Name\]/gi, 'Brantford Financial Services')
      .replace(/\[Contact Name\]/gi, 'David Miller')
      .replace(/\[Target Tier\]/gi, 'Hole Sponsor')
      .replace(/\[Tournament Date\]/gi, 'Monday October 5, 2026')
      .replace(/\[Course Location\]/gi, 'Burford Golf Links Course')
      .replace(/\[Founder Name\]/gi, 'Saied Mohammed')
      .replace(/\[Founder Phone\]/gi, '(905) 818-2005')
      .replace(/\[Memorial Honoree\]/gi, 'Naseem Mohammed')
      .replace(/\[Beneficiary Org\]/gi, 'Juravinski Breast Cancer Research & Canadian Red Cross');

    const html = renderOutreachMarkdownToHtml(sampleBody);
    const res = await sendTestTemplateEmail({
      templateId: currentTemplate?.id,
      subject: subject || 'Fragrant Breeze Memorial Golf Classic Outreach',
      bodyText: sampleBody,
      bodyHtml: html,
      recipientEmail: 'luc.valade@gmail.com'
    });

    setIsSendingTest(false);
    if (res.success) {
      setTestSentNotice(true);
      setTimeout(() => setTestSentNotice(false), 3500);
    } else {
      setTestError(res.error || 'Failed to dispatch test template email');
    }
  };

  const handleSelectTemplate = (tpl: OutreachEmailTemplate) => {
    setActiveTemplateId(tpl.id);
    setIsEditingNew(false);
    setTitle(capitalizeWords(tpl.title));
    setCategory(tpl.category);
    setSubject(capitalizeWords(tpl.subject));
    setBody(capitalizeParagraphs(tpl.body));
    setIsPreview(false);
  };

  const handleStartNew = () => {
    setIsEditingNew(true);
    setActiveTemplateId('');
    setTitle('New Solicitation Template');
    setCategory('corporate_sponsorship');
    setSubject('Sponsorship Opportunity - Fragrant Breeze Memorial Golf Classic');
    setBody(
      'Dear [Contact Name],\n\nWe Would Love To Welcome [Company Name] As A Valued Partner For Our Upcoming Tournament...\n\nWarm Regards,\n[Founder Name]\nFragrant Breeze Memorial Classic'
    );
    setIsPreview(false);
  };

  const handleInsertToken = (token: string) => {
    setBody((prev) => prev + token);
  };

  const handleFormatAll = () => {
    setTitle((prev) => capitalizeWords(prev));
    setSubject((prev) => capitalizeWords(prev));
    setBody((prev) => capitalizeParagraphs(prev));
  };

  const handleSave = () => {
    const formattedTitle = capitalizeWords(title.trim());
    const formattedSubject = capitalizeWords(subject.trim());
    const formattedBody = capitalizeParagraphs(body.trim());

    if (!formattedTitle || !formattedSubject || !formattedBody) return;

    if (isEditingNew) {
      onAddTemplate({
        title: formattedTitle,
        category,
        subject: formattedSubject,
        body: formattedBody,
        isDefault: false
      });
      setIsEditingNew(false);
    } else if (currentTemplate) {
      onUpdateTemplate(currentTemplate.id, {
        title: formattedTitle,
        category,
        subject: formattedSubject,
        body: formattedBody
      });
    }

    // Update local fields to reflect standardized capitalization
    setTitle(formattedTitle);
    setSubject(formattedSubject);
    setBody(formattedBody);

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Sync state with current template when opening
  React.useEffect(() => {
    if (currentTemplate && !isEditingNew) {
      setTitle(capitalizeWords(currentTemplate.title));
      setCategory(currentTemplate.category);
      setSubject(capitalizeWords(currentTemplate.subject));
      setBody(capitalizeParagraphs(currentTemplate.body));
    }
  }, [currentTemplate, isEditingNew]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Solicitation Email Templates</h2>
              <p className="text-xs text-emerald-200/90">
                Pre-approved outreach letters with dynamic mail-merge variables &amp; automated typography
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 flex-1 overflow-hidden min-h-[520px]">
          {/* Left Column: Template List */}
          <div className="p-4 space-y-3 bg-slate-50/70 overflow-y-auto max-h-[78vh] md:max-h-[80vh]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Templates ({templates.length})
              </span>
              <button
                type="button"
                onClick={handleStartNew}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-2">
              {templates.map((tpl) => {
                const isActive = !isEditingNew && tpl.id === activeTemplateId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1 text-xs ${
                      isActive
                        ? 'bg-white border-[#1E4D2B] shadow-xs text-slate-900 ring-2 ring-emerald-600/20'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="line-clamp-1">{tpl.title}</span>
                      {tpl.isDefault && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {tpl.subject}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Template Editor with Guaranteed Visible Bottom Buttons & Dedicated Scrollbar */}
          <div className="md:col-span-2 flex flex-col bg-white overflow-hidden max-h-[78vh] md:max-h-[80vh]">
            {/* Top Toolbar in Drafting Card */}
            <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {isEditingNew ? 'Drafting New Letter' : 'Editing Letter'}
                </span>
                {savedNotice && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved Successfully!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Auto Format / Capitalize Trigger Button */}
                {!isPreview && (
                  <button
                    type="button"
                    onClick={handleFormatAll}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    title="Auto-capitalize first letter of each word in title/subject, and first letter of each paragraph in body"
                  >
                    <Type className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Auto-Capitalize</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                    isPreview
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isPreview ? 'Back to Editor' : 'Preview Format'}</span>
                </button>

                {!isEditingNew && !currentTemplate?.isDefault && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this template?')) {
                        onDeleteTemplate(activeTemplateId);
                        setActiveTemplateId(templates[0]?.id || '');
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Form Body with Prominent Scrollbar on the Right-Hand Side */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 pr-3.5" style={{ scrollbarGutter: 'stable' }}>
              {!isPreview ? (
                <>
                  {/* Template Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Template Title
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">First Letter Caps</span>
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(capitalizeWords(e.target.value))}
                        onBlur={() => setTitle((prev) => capitalizeWords(prev))}
                        placeholder="e.g. Showcase Your Brand — Hole & Contest Sponsorship"
                        className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden text-slate-800"
                      >
                        <option value="hole_contest_sponsorship">Hole &amp; Contest Sponsorship</option>
                        <option value="corporate_sponsorship">Corporate Sponsorship</option>
                        <option value="prize_raffle">Prize &amp; Raffle Solicitation</option>
                        <option value="memorial_tribute">Memorial Tribute / Hole Sponsor</option>
                        <option value="follow_up">Follow-Up &amp; Thank You</option>
                        <option value="custom">Custom Letter</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Subject Line
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">First Letter Each Word In Caps</span>
                    </div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(capitalizeWords(e.target.value))}
                      onBlur={() => setSubject((prev) => capitalizeWords(prev))}
                      placeholder="e.g. Showcase Your Brand At The 6TH Annual Charity Fragrant Breeze Golf Tournament"
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden text-slate-900"
                    />
                  </div>

                  {/* Letter Body Template */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Body Template
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Paragraphs Capitalized Automatically</span>
                    </div>
                    <textarea
                      rows={10}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onBlur={() => setBody((prev) => capitalizeParagraphs(prev))}
                      placeholder="Write your email letter here. First letter of each paragraph will automatically be capitalized."
                      className="w-full text-xs font-sans leading-relaxed p-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden resize-y text-slate-800"
                    />
                  </div>

                  {/* Token Cheatsheet */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Click to insert dynamic mail-merge variables:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {[
                        { label: '[Sponsor Name]', value: ' **[Sponsor Name]** ' },
                        { label: '[Contact Name]', value: ' [Contact Name] ' },
                        { label: 'Burford Golf Links Link', value: ' **[Burford Golf Links Course](https://golfnorth.ca/burford)** ' },
                        { label: '(905) 818-2005 Dialer', value: ' **[(905) 818-2005](tel:19058182005)** ' },
                        { label: 'Tournament Web Link', value: ' [Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio) ' },
                        { label: '[Target Tier]', value: ' [Target Tier] ' },
                        { label: '[Tournament Date]', value: ' Monday October 5, 2026 ' }
                      ].map((tok) => (
                        <button
                          key={tok.label}
                          type="button"
                          onClick={() => handleInsertToken(tok.value)}
                          className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg font-mono text-[11px] transition cursor-pointer shadow-2xs"
                        >
                          {tok.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Sample Preview Format with Scrollbar below Sample Subject */
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs space-y-3">
                  <div className="pb-2 border-b border-slate-200 text-slate-700 font-medium">
                    <strong className="text-slate-900">Sample Subject:</strong>{' '}
                    {capitalizeWords(
                      subject
                        .replace(/\[Sponsor Name\]/gi, 'Brantford Financial Services')
                        .replace(/\[Company Name\]/gi, 'Brantford Financial Services')
                        .replace(/\[Contact Name\]/gi, 'David Miller')
                    )}
                  </div>

                  {/* Window below Sample Subject with DEDICATED SCROLL BAR */}
                  <div className="relative font-sans text-slate-800 leading-relaxed bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3 max-h-[380px] overflow-y-auto pr-3.5">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderOutreachMarkdownToHtml(
                          capitalizeParagraphs(
                            body
                              .replace(/\[Sponsor Name\]/gi, 'Brantford Financial Services')
                              .replace(/\[Company Name\]/gi, 'Brantford Financial Services')
                              .replace(/\[Contact Name\]/gi, 'David Miller')
                              .replace(/\[Target Tier\]/gi, 'Hole Sponsor')
                              .replace(/\[Tournament Date\]/gi, 'Monday October 5, 2026')
                              .replace(/\[Course Location\]/gi, 'Burford Golf Links Course')
                              .replace(/\[Founder Name\]/gi, 'Saied Mohammed')
                              .replace(/\[Founder Phone\]/gi, '(905) 818-2005')
                              .replace(/\[Memorial Honoree\]/gi, 'Naseem Mohammed')
                              .replace(/\[Beneficiary Org\]/gi, 'Juravinski Breast Cancer Research & Canadian Red Cross')
                          )
                        )
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Scroll inside the preview container above to inspect the full letter formatting.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions - ALWAYS VISIBLE AT BOTTOM */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-20">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition cursor-pointer border border-slate-200"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleSendTestToLuc}
                  disabled={isSendingTest}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Sends a test preview of this template directly to luc.valade@gmail.com"
                >
                  {isSendingTest ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
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
              </div>

              {testError && (
                <p className="text-[11px] text-rose-600 font-medium max-w-xs truncate">
                  {testError}
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
