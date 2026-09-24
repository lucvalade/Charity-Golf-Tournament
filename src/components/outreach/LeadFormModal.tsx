import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Save,
  Clock,
  AlertCircle
} from 'lucide-react';
import { OutreachLead, OutreachLeadStatus, OutreachTargetTier } from '../../types';
import {
  capitalizeWords,
  formatPhoneNumber,
  isValidPhone,
  isValidEmail,
  formatWebsiteUrl,
  isValidWebsiteUrl
} from '../../utils/textFormatting';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: OutreachLead | null;
  onSaveLead: (leadData: Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateLead?: (id: string, updates: Partial<OutreachLead>) => void;
}

const TARGET_TIERS: OutreachTargetTier[] = [
  'Title Sponsor',
  'Eagle Sponsor',
  'Birdie Sponsor',
  'Beverage Cart Sponsor',
  'Hole Sponsor',
  'Prize / Raffle Donor',
  'General Donor'
];

const STATUS_OPTIONS: OutreachLeadStatus[] = [
  'Identified',
  'Letter Sent',
  'Followed Up',
  'Opened',
  'Replied',
  'Pledged',
  'Declined',
  'Bounced'
];

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
  onSaveLead,
  onUpdateLead
}) => {
  const [businessName, setBusinessName] = useState(leadToEdit?.businessName || '');
  const [recipientName, setRecipientName] = useState(leadToEdit?.recipientName || '');
  const [emailAddress, setEmailAddress] = useState(leadToEdit?.emailAddress || '');
  const [contactNumber, setContactNumber] = useState(leadToEdit?.contactNumber || '');
  const [businessUrl, setBusinessUrl] = useState(leadToEdit?.businessUrl || '');
  const [address, setAddress] = useState(leadToEdit?.address || '');
  const [city, setCity] = useState(leadToEdit?.city || 'Burford');
  const [prov, setProv] = useState(leadToEdit?.prov || 'ON');
  const [targetTier, setTargetTier] = useState<OutreachTargetTier>(leadToEdit?.targetTier || 'Eagle Sponsor');
  const [status, setStatus] = useState<OutreachLeadStatus>(leadToEdit?.status || 'Identified');
  const [pledgedAmount, setPledgedAmount] = useState<number | ''>(leadToEdit?.pledgedAmount || '');
  const [paymentMethod, setPaymentMethod] = useState<'Cheque' | 'Credit Card' | 'e-Transfer' | null>(
    leadToEdit?.paymentMethod || null
  );
  const [nextFollowUpDate, setNextFollowUpDate] = useState(leadToEdit?.nextFollowUpDate || '');
  const [notes, setNotes] = useState(leadToEdit?.notes || '');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (leadToEdit) {
      setBusinessName(capitalizeWords(leadToEdit.businessName));
      setRecipientName(capitalizeWords(leadToEdit.recipientName));
      setEmailAddress(leadToEdit.emailAddress);
      setContactNumber(leadToEdit.contactNumber ? formatPhoneNumber(leadToEdit.contactNumber) : '');
      setBusinessUrl(leadToEdit.businessUrl ? formatWebsiteUrl(leadToEdit.businessUrl) : '');
      setAddress(leadToEdit.address || '');
      setCity(leadToEdit.city || 'Burford');
      setProv(leadToEdit.prov || 'ON');
      setTargetTier(leadToEdit.targetTier);
      setStatus(leadToEdit.status);
      setPledgedAmount(leadToEdit.pledgedAmount || '');
      setPaymentMethod(leadToEdit.paymentMethod || null);
      setNextFollowUpDate(leadToEdit.nextFollowUpDate || '');
      setNotes(leadToEdit.notes || '');
      setError('');
      setEmailError(null);
      setPhoneError(null);
      setUrlError(null);
    } else {
      setBusinessName('');
      setRecipientName('');
      setEmailAddress('');
      setContactNumber('');
      setBusinessUrl('');
      setAddress('');
      setCity('Burford');
      setProv('ON');
      setTargetTier('Eagle Sponsor');
      setStatus('Identified');
      setPledgedAmount('');
      setPaymentMethod(null);
      setNextFollowUpDate('');
      setNotes('');
      setError('');
      setEmailError(null);
      setPhoneError(null);
      setUrlError(null);
    }
  }, [leadToEdit]);

  const handleSetQuickFollowUp = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setNextFollowUpDate(d.toISOString().split('T')[0]);
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(capitalizeWords(e.target.value));
    if (error) setError('');
  };

  const handleRecipientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientName(capitalizeWords(e.target.value));
    if (error) setError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmailAddress(val);
    if (error) setError('');
    if (val && !isValidEmail(val)) {
      setEmailError('Format must match name@domain.com');
    } else {
      setEmailError(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContactNumber(formatted);
    if (formatted && !isValidPhone(formatted)) {
      setPhoneError('Must be formatted as (###) ###-####');
    } else {
      setPhoneError(null);
    }
  };

  const handleWebsiteBlur = () => {
    if (businessUrl.trim()) {
      const formatted = formatWebsiteUrl(businessUrl);
      setBusinessUrl(formatted);
      if (!isValidWebsiteUrl(formatted)) {
        setUrlError('Must be formatted like https://sierravalley.example.com');
      } else {
        setUrlError(null);
      }
    } else {
      setUrlError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !emailAddress.trim()) {
      setError('Contact Person and Email Address are required.');
      return;
    }

    let hasValidationError = false;

    // Validate email
    if (!isValidEmail(emailAddress.trim())) {
      setEmailError('Invalid email format. Must match standard regex: name@domain.com');
      hasValidationError = true;
    } else {
      setEmailError(null);
    }

    // Validate phone if provided
    if (contactNumber.trim() && !isValidPhone(contactNumber.trim())) {
      setPhoneError('Invalid phone number. Required format: (###) ###-####');
      hasValidationError = true;
    } else {
      setPhoneError(null);
    }

    // Validate URL if provided
    const formattedUrl = businessUrl.trim() ? formatWebsiteUrl(businessUrl) : '';
    if (formattedUrl && !isValidWebsiteUrl(formattedUrl)) {
      setUrlError('Must be formatted like https://sierravalley.example.com');
      hasValidationError = true;
    } else {
      setUrlError(null);
    }

    if (hasValidationError) {
      setError('Please resolve formatting errors before submitting.');
      return;
    }

    // Default company name to contact recipient if omitted
    const finalBusinessName = businessName.trim()
      ? capitalizeWords(businessName.trim())
      : capitalizeWords(recipientName.trim());

    const payload = {
      businessName: finalBusinessName,
      recipientName: capitalizeWords(recipientName.trim()),
      emailAddress: emailAddress.trim(),
      contactNumber: contactNumber.trim(),
      businessUrl: formattedUrl,
      address: address.trim(),
      city: city.trim(),
      prov: prov.trim(),
      targetTier,
      status,
      pledgedAmount: pledgedAmount ? Number(pledgedAmount) : undefined,
      paymentMethod,
      nextFollowUpDate: nextFollowUpDate || undefined,
      notes: notes.trim()
    };

    if (leadToEdit && onUpdateLead) {
      onUpdateLead(leadToEdit.id, payload);
    } else {
      onSaveLead(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {leadToEdit ? 'Edit Sponsor & Lead Profile' : 'Add New Prospect Lead'}
              </h2>
              <p className="text-xs text-emerald-200/90">
                Track corporate sponsor contacts and donation solicitation status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-semibold">
              {error}
            </div>
          )}

          {/* Business & Contact Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Organization Name <span className="font-normal text-slate-500 lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={businessName}
                  onChange={handleBusinessNameChange}
                  placeholder="e.g. Apex Commercial Capital (Leave blank if individual)"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Person (Salutation) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={handleRecipientNameChange}
                  placeholder="e.g. Marcus Vance"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  id="user-email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={emailAddress}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium font-mono ${
                    emailError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={handlePhoneChange}
                  placeholder="(905) 555-0100"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium ${
                    phoneError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* Website & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={businessUrl}
                  onChange={(e) => setBusinessUrl(e.target.value)}
                  onBlur={handleWebsiteBlur}
                  placeholder="https://sierravalley.example.com"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium ${
                    urlError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
              </div>
              {urlError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {urlError}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                City &amp; Prov
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Burford, ON"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Target Tier & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Partnership Tier
              </label>
              <select
                value={targetTier}
                onChange={(e) => setTargetTier(e.target.value as OutreachTargetTier)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-semibold"
              >
                {TARGET_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Outreach Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OutreachLeadStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-semibold"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pledged Amount & Payment Method (if pledged or agreed) */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-3">
            <span className="font-bold text-amber-900 block">
              Pledge &amp; Financial Commitment (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pledged Amount ($ CAD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={pledgedAmount}
                    onChange={(e) => setPledgedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2500"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod || ''}
                  onChange={(e) =>
                    setPaymentMethod(
                      (e.target.value as 'Cheque' | 'Credit Card' | 'e-Transfer') || null
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-semibold"
                >
                  <option value="">-- Select Payment Method --</option>
                  <option value="Cheque">Cheque (Payable to Naseem Hope / Fragrant Breeze)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="e-Transfer">Interac e-Transfer (ms_smnm@outlook.com)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Next Follow Up Date with Shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Next Action / Follow-Up Reminder Date
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">Quick set:</span>
                <button
                  type="button"
                  onClick={() => handleSetQuickFollowUp(3)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickFollowUp(7)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                >
                  +7d
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickFollowUp(14)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                >
                  +14d
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes &amp; Interaction Summary
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record phone discussions, corporate preferences, auction item details..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{leadToEdit ? 'Update Lead Record' : 'Save Prospect to CRM'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
