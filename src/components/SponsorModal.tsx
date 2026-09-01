import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { SPONSORSHIP_PACKAGES, EVENT_DETAILS } from '../data/initialData';
import { SponsorTier } from '../types';
import { X, Award, CheckCircle, Building2, User, Mail, Phone, Globe, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SponsorModal: React.FC = () => {
  const { isSponsorModalOpen, setIsSponsorModalOpen, selectedSponsorTier, addSponsorship } = useTournament();

  const [tier, setTier] = useState<SponsorTier>(selectedSponsorTier || 'eagle');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedSponsorTier) {
      setTier(selectedSponsorTier);
    }
  }, [selectedSponsorTier]);

  if (!isSponsorModalOpen) return null;

  const currentPkg = SPONSORSHIP_PACKAGES.find(p => p.id === tier) || SPONSORSHIP_PACKAGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addSponsorship({
        companyName,
        contactName,
        email,
        phone: phone || '(555) 000-0000',
        tier,
        websiteUrl,
        customNote
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const handleClose = () => {
    setIsSponsorModalOpen(false);
    setIsSuccess(false);
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsiteUrl('');
    setCustomNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-6 sm:p-7 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-200 tracking-wider">
                Corporate Partnership Pledge
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-white">
                Sponsor the 2026 Memorial Classic
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900 font-serif-heading">
                Thank You, {companyName}!
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Your pledge for the <strong>{currentPkg.name}</strong> (${currentPkg.amount.toLocaleString()}) has been recorded. Our tournament director will reach out with your sponsorship invoice and branding onboarding kit.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Tournament:</span>
                <span className="font-semibold text-slate-800">{EVENT_DETAILS.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier Selected:</span>
                <span className="font-bold text-[#1E4D2B]">{currentPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Deductible Receipt:</span>
                <span className="font-semibold text-slate-800">501(c)(3) Eligible</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-3 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-sm rounded-xl transition cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Package Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Sponsorship Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SPONSORSHIP_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setTier(pkg.id as SponsorTier)}
                    className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                      tier === pkg.id
                        ? 'border-[#1E4D2B] bg-emerald-50/70 ring-2 ring-[#1E4D2B]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-xs font-bold font-mono text-[#1E4D2B]">
                        ${pkg.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {pkg.benefits[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Biotech Group"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Contact Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="sjenkins@apexbiotech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Website / Brand Link
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dedication Note / Program Recognition Message (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. In loving memory of Amina Mohammed from the Apex Biotech team."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
              />
            </div>

            {/* Total summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Selected Commitment:</div>
                <div className="text-sm font-bold text-slate-900">{currentPkg.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Pledge Amount:</div>
                <div className="text-xl font-extrabold font-mono text-[#1E4D2B]">
                  ${currentPkg.amount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming...' : 'Submit Sponsorship Pledge'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
