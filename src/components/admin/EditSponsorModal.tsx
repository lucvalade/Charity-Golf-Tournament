import React, { useState, useEffect } from 'react';
import { X, Save, Award, Building, Mail, Phone, Globe, AlertCircle } from 'lucide-react';
import { SponsorRecord, SponsorTier } from '../../types';
import { SPONSORSHIP_PACKAGES } from '../../data/initialData';
import {
  capitalizeWords,
  capitalizeSentences,
  formatPhoneNumber,
  isValidPhone,
  isValidEmail,
  formatWebsiteUrl,
  isValidWebsiteUrl
} from '../../utils/textFormatting';

interface EditSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsor: SponsorRecord | null;
  onSave: (sponsorId: string, updates: Partial<SponsorRecord>) => void;
}

export const EditSponsorModal: React.FC<EditSponsorModalProps> = ({
  isOpen,
  onClose,
  sponsor,
  onSave
}) => {
  const [companyName, setCompanyName] = useState(sponsor?.companyName ? capitalizeWords(sponsor.companyName) : '');
  const [tier, setTier] = useState<SponsorTier>(sponsor?.tier || 'eagle');
  const [contactName, setContactName] = useState(sponsor?.contactName ? capitalizeWords(sponsor.contactName) : '');
  const [email, setEmail] = useState(sponsor?.email || '');
  const [phone, setPhone] = useState(sponsor?.phone ? formatPhoneNumber(sponsor.phone) : '');
  const [websiteUrl, setWebsiteUrl] = useState(sponsor?.websiteUrl ? formatWebsiteUrl(sponsor.websiteUrl) : '');
  const [customNote, setCustomNote] = useState(sponsor?.customNote ? capitalizeSentences(sponsor.customNote) : '');

  // Validation error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (sponsor) {
      setCompanyName(sponsor.companyName ? capitalizeWords(sponsor.companyName) : '');
      setTier(sponsor.tier);
      setContactName(sponsor.contactName ? capitalizeWords(sponsor.contactName) : '');
      setEmail(sponsor.email || '');
      setPhone(sponsor.phone ? formatPhoneNumber(sponsor.phone) : '');
      setWebsiteUrl(sponsor.websiteUrl ? formatWebsiteUrl(sponsor.websiteUrl) : '');
      setCustomNote(sponsor.customNote ? capitalizeSentences(sponsor.customNote) : '');
      setEmailError(null);
      setPhoneError(null);
      setUrlError(null);
    }
  }, [sponsor]);

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(capitalizeWords(e.target.value));
  };

  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactName(capitalizeWords(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (formatted && !isValidPhone(formatted)) {
      setPhoneError('Must be formatted as (###) ###-####');
    } else {
      setPhoneError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !isValidEmail(val)) {
      setEmailError('Format must match name@domain.com');
    } else {
      setEmailError(null);
    }
  };

  const handleWebsiteBlur = () => {
    if (websiteUrl.trim()) {
      const formatted = formatWebsiteUrl(websiteUrl);
      setWebsiteUrl(formatted);
      if (!isValidWebsiteUrl(formatted)) {
        setUrlError('Must be formatted like https://sierravalley.example.com');
      } else {
        setUrlError(null);
      }
    } else {
      setUrlError(null);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomNote(capitalizeSentences(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate email
    if (email.trim() && !isValidEmail(email)) {
      setEmailError('Invalid email format. Must match standard regex: name@example.com');
      hasError = true;
    } else {
      setEmailError(null);
    }

    // Validate phone
    if (phone.trim() && !isValidPhone(phone)) {
      setPhoneError('Invalid phone number. Required format: (###) ###-####');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    // Validate website URL
    const formattedUrl = websiteUrl.trim() ? formatWebsiteUrl(websiteUrl) : '';
    if (formattedUrl && !isValidWebsiteUrl(formattedUrl)) {
      setUrlError('Must be formatted like https://sierravalley.example.com');
      hasError = true;
    } else {
      setUrlError(null);
    }

    if (hasError || !sponsor) return;

    onSave(sponsor.id, {
      companyName: capitalizeWords(companyName.trim()) || 'Valued Corporate Partner',
      tier,
      contactName: capitalizeWords(contactName.trim()),
      email: email.trim(),
      phone: phone.trim(),
      websiteUrl: formattedUrl,
      customNote: capitalizeSentences(customNote.trim())
    });
    onClose();
  };

  if (!isOpen || !sponsor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-bold text-sm">Edit Corporate Sponsor</h3>
              <p className="text-xs text-emerald-200/90">{sponsor.companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Company / Organization Name</span>
              <span className="text-[10px] font-normal text-slate-500 lowercase">(auto-capitalized)</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={handleCompanyNameChange}
              onBlur={() => setCompanyName(capitalizeWords(companyName))}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. Acme Financial Group"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Sponsorship Tier Package
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as SponsorTier)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
            >
              {SPONSORSHIP_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — ${pkg.amount.toLocaleString()} CAD
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Key Contact Name <span className="text-[10px] font-normal text-slate-500 lowercase">(caps)</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={handleContactNameChange}
                onBlur={() => setContactName(capitalizeWords(contactName))}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full text-xs font-medium px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-hidden ${
                  emailError ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/40' : 'border-slate-300 focus:ring-[#1E4D2B]'
                }`}
                placeholder="contact@company.com"
              />
              {emailError && (
                <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone: (###) ###-####</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full text-xs font-medium px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-hidden ${
                  phoneError ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/40' : 'border-slate-300 focus:ring-[#1E4D2B]'
                }`}
                placeholder="(905) 555-0199"
                maxLength={14}
              />
              {phoneError && (
                <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Website (https://...)</span>
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  setUrlError(null);
                }}
                onBlur={handleWebsiteBlur}
                className={`w-full text-xs font-medium px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-hidden ${
                  urlError ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/40' : 'border-slate-300 focus:ring-[#1E4D2B]'
                }`}
                placeholder="https://sierravalley.example.com"
              />
              {urlError && (
                <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{urlError}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Internal Sponsor Notes / Signage Placement{' '}
              <span className="text-[10px] font-normal text-slate-500 lowercase">(sentence capitalized)</span>
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={handleNoteChange}
              onBlur={() => setCustomNote(capitalizeSentences(customNote))}
              className="w-full text-xs font-medium p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. Signage on Tee #1, foursome included."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Sponsor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
