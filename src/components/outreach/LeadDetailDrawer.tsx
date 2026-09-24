import React, { useState } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Send,
  Eye,
  CheckCircle2,
  Award,
  Edit2,
  Trash2,
  Plus,
  Clock,
  ExternalLink,
  FileText
} from 'lucide-react';
import { OutreachLead, OutreachLeadStatus } from '../../types';
import { generateSolicitationLetterPDF } from '../../utils/pdfGenerator';
import { useTournament } from '../../context/TournamentContext';

interface LeadDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: OutreachLead | null;
  onUpdateLead: (id: string, updates: Partial<OutreachLead>) => void;
  onDeleteLead: (id: string) => void;
  onOpenSendModal: (lead: OutreachLead) => void;
  onOpenEditModal: (lead: OutreachLead) => void;
  onPromoteToSponsor: (leadId: string) => void;
}

const STATUS_CONFIG: Record<OutreachLeadStatus, { label: string; bg: string; text: string }> = {
  Identified: { label: 'Identified Prospect', bg: 'bg-slate-100', text: 'text-slate-800' },
  'Letter Sent': { label: 'Letter Sent', bg: 'bg-sky-100', text: 'text-sky-800' },
  'Followed Up': { label: 'Follow-Up Needed', bg: 'bg-amber-100', text: 'text-amber-800' },
  Opened: { label: 'Opened Letter', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  Replied: { label: 'Replied / Discussion', bg: 'bg-purple-100', text: 'text-purple-800' },
  Pledged: { label: 'Pledged Sponsor', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Declined: { label: 'Declined', bg: 'bg-rose-100', text: 'text-rose-800' },
  Bounced: { label: 'Email Bounced', bg: 'bg-red-100', text: 'text-red-800' },
  Blocked: { label: 'Blocked by System', bg: 'bg-slate-200', text: 'text-slate-800' },
  Failed: { label: 'Delivery Failed', bg: 'bg-orange-100', text: 'text-orange-800' }
};

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  isOpen,
  onClose,
  lead,
  onUpdateLead,
  onDeleteLead,
  onOpenSendModal,
  onOpenEditModal,
  onPromoteToSponsor
}) => {
  const { outreachTemplates } = useTournament();
  const [newNote, setNewNote] = useState('');
  const [pledgedInput, setPledgedInput] = useState<number | ''>(lead?.pledgedAmount || '');
  const [paymentMethod, setPaymentMethod] = useState<'Cheque' | 'Credit Card' | 'e-Transfer' | null>(
    lead?.paymentMethod || null
  );

  React.useEffect(() => {
    if (lead) {
      setPledgedInput(lead.pledgedAmount || '');
      setPaymentMethod(lead.paymentMethod || null);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG.Identified;

  const handleStatusChange = (newStatus: OutreachLeadStatus) => {
    if (!lead) return;
    onUpdateLead(lead.id, { status: newStatus });

    if (newStatus === 'Pledged') {
      fetch('/api/notify-pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: lead.businessName,
          contactName: lead.contactPerson,
          email: lead.email,
          phone: lead.phone,
          tier: lead.targetTier,
          pledgedAmount: lead.pledgedAmount || 0,
          notes: lead.notes,
          source: 'Outreach CRM Status Selector'
        })
      }).catch(err => console.warn('Pledge notification error:', err));
    }
  };

  const handleAddNote = () => {
    if (!lead || !newNote.trim()) return;
    const timestamp = new Date().toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const updatedNotes = lead.notes
      ? `${lead.notes}\n[${timestamp}]: ${newNote.trim()}`
      : `[${timestamp}]: ${newNote.trim()}`;

    onUpdateLead(lead.id, { notes: updatedNotes });
    setNewNote('');
  };

  const handleUpdatePledge = () => {
    if (!lead) return;
    const amount = pledgedInput === '' ? undefined : Number(pledgedInput);
    onUpdateLead(lead.id, {
      pledgedAmount: amount,
      paymentMethod,
      status: pledgedInput ? 'Pledged' : lead.status
    });

    if (amount && amount > 0) {
      fetch('/api/notify-pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: lead.businessName,
          contactName: lead.contactPerson,
          email: lead.email,
          phone: lead.phone,
          tier: lead.targetTier,
          pledgedAmount: amount,
          notes: `Payment Method: ${paymentMethod || 'TBD'}. ${lead.notes || ''}`,
          source: 'Outreach CRM Pledge Card'
        })
      }).catch(err => console.warn('Pledge notification error:', err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-[#1E4D2B] text-white p-5 flex items-start justify-between border-b border-emerald-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#1E4D2B] px-2 py-0.5 rounded">
              {lead.targetTier}
            </span>
            <h2 className="text-lg font-bold text-white mt-1.5 leading-snug">
              {lead.businessName}
            </h2>
            <p className="text-xs text-emerald-200">
              Primary Contact: <strong>{lead.recipientName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* PDF Solicitation Letter Download Section with Category Selectors */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-[#1E4D2B] text-xs block">
                  Solicitation Letter Document (PDF)
                </span>
                <p className="text-[11px] text-emerald-800">
                  Generate official PDF letter customized for {lead.businessName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => generateSolicitationLetterPDF(lead)}
                className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>Default PDF</span>
              </button>
            </div>

            {/* Category PDF Quick Buttons */}
            <div className="pt-2 border-t border-emerald-200/70">
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                Generate By Category:
              </span>
              <div className="flex flex-wrap gap-1 text-[11px]">
                {[
                  { key: 'corporate_sponsorship', label: 'Corporate' },
                  { key: 'hole_contest_sponsorship', label: 'Hole & Contest' },
                  { key: 'prize_raffle', label: 'Prize / Raffle' },
                  { key: 'memorial_tribute', label: 'Memorial' },
                  { key: 'follow_up', label: 'Follow-Up' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      const tpl = outreachTemplates.find((t) => t.category === cat.key);
                      generateSolicitationLetterPDF(lead, tpl);
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-emerald-950 font-semibold rounded border border-emerald-300 cursor-pointer transition shadow-2xs"
                  >
                    {cat.label} PDF
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Current Pipeline Stage
              </span>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as OutreachLeadStatus)}
                className={`font-bold px-2.5 py-1 rounded-lg border text-xs cursor-pointer shadow-2xs ${statusInfo.bg} ${statusInfo.text} border-current/20`}
              >
                <option value="Identified">Identified Prospect</option>
                <option value="Letter Sent">Letter Sent</option>
                <option value="Followed Up">Follow-Up Needed</option>
                <option value="Opened">Opened Letter</option>
                <option value="Replied">Replied / Discussion</option>
                <option value="Pledged">Pledged Sponsor</option>
                <option value="Declined">Declined</option>
                <option value="Bounced">Email Bounced</option>
              </select>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Open Tracking
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-700 shadow-2xs">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lead.openCount || 0} Opens</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Contact Information
            </span>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {lead.emailAddress}
                </span>
              </div>

              {lead.contactNumber && (
                <div className="p-2.5 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone
                  </span>
                  <span className="font-medium text-slate-800">{lead.contactNumber}</span>
                </div>
              )}

              {lead.businessUrl && (
                <div className="p-2.5 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Website
                  </span>
                  <a
                    href={lead.businessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Date / Time Outreach Dispatched */}
              {(lead.lastContactDate || lead.createdAt) && (
                <div className="p-2.5 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Date / Time Sent
                  </span>
                  <span className="font-semibold text-slate-800">
                    {(() => {
                      const d = new Date(lead.lastContactDate || lead.createdAt);
                      if (isNaN(d.getTime())) return '-';
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const month = months[d.getMonth()];
                      const day = d.getDate();
                      const year = String(d.getFullYear()).slice(-2);
                      let hours = d.getHours();
                      const minutes = d.getMinutes();
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12 || 12;
                      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                      return `${month} ${day}/${year} at ${hours}:${formattedMinutes} ${ampm}`;
                    })()}
                  </span>
                </div>
              )}

              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Location
                </span>
                <span className="font-medium text-slate-800">
                  {lead.city || 'Burford'}, {lead.prov || 'ON'}
                </span>
              </div>

              {lead.nextFollowUpDate && (
                <div className="p-2.5 flex items-center justify-between bg-amber-50/50">
                  <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Next Action Date
                  </span>
                  <span className="font-bold text-amber-900">{lead.nextFollowUpDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Pledge Box */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-700" />
                Pledge Commitment ($ CAD)
              </span>
              {lead.status === 'Pledged' && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  Confirmed Pledge
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                step={50}
                value={pledgedInput}
                onChange={(e) =>
                  setPledgedInput(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="Pledged amount ($)"
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <select
                value={paymentMethod || ''}
                onChange={(e) =>
                  setPaymentMethod(
                    (e.target.value as 'Cheque' | 'Credit Card' | 'e-Transfer') || null
                  )
                }
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="">-- Method --</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit Card">Credit Card</option>
                <option value="e-Transfer">e-Transfer</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleUpdatePledge}
                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
              >
                Update Pledge
              </button>

              {/* 1-Click Promotion to Confirmed Sponsor */}
              <button
                type="button"
                onClick={() => onPromoteToSponsor(lead.id)}
                className="px-3 py-1 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Promote to Sponsor</span>
              </button>
            </div>
          </div>

          {/* Interaction Notes & Log */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Outreach &amp; Call Notes
            </span>
            {lead.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto font-sans text-xs">
                {lead.notes}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Add conversation note or response..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpenEditModal(lead)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove ${lead.businessName} from CRM?`)) {
                  onDeleteLead(lead.id);
                  onClose();
                }
              }}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenSendModal(lead)}
            className="px-4 py-2 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span>Dispatch Solicitation Letter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
