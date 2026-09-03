import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/initialData';
import { useTournament } from '../context/TournamentContext';
import { Mail, Phone, MapPin, Send, Heart, Users, CheckCircle, Clock, Calendar, ExternalLink, AlertCircle } from 'lucide-react';

const formatTitleCase = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const formatPhoneNumber = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const isValidPhone = (phone: string): boolean => {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone.trim());
};

export const ContactSection: React.FC = () => {
  const { addToast, contactTab, setContactTab } = useTournament();

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('General Tournament Question');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryEmailError, setInquiryEmailError] = useState('');
  const [isInquirySent, setIsInquirySent] = useState(false);

  // Volunteer Form State
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volRole, setVolRole] = useState('Morning Check-In & Gift Bag Desk (10:00 AM - 12:30 PM)');
  const [volShirt, setVolShirt] = useState('L');
  const [volEmailError, setVolEmailError] = useState('');
  const [volPhoneError, setVolPhoneError] = useState('');
  const [isVolSent, setIsVolSent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(inquiryEmail)) {
      setInquiryEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
      return;
    }
    setInquiryEmailError('');

    setIsInquirySent(true);
    addToast('success', 'Message Sent!', `Thank you ${inquiryName}, the tournament committee will respond within 24 hours.`);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setIsInquirySent(false);
    }, 2000);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!isValidEmail(volEmail)) {
      setVolEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
      hasError = true;
    } else {
      setVolEmailError('');
    }

    if (!isValidPhone(volPhone)) {
      setVolPhoneError('Phone number must be exactly 10 digits in (###) ###-#### format.');
      hasError = true;
    } else {
      setVolPhoneError('');
    }

    if (hasError) return;

    setIsVolSent(true);
    addToast('success', 'Volunteer Sign-Up Received!', `Thank you ${volName} for volunteering to support Naseem's memorial mission!`);
    setTimeout(() => {
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setIsVolSent(false);
    }, 2000);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Mail className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Connect & Volunteer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading tracking-tight">
            Contact Tournament Organizers & Volunteer
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Have a question about sponsorships, registrations, or tax deductions? Interested in volunteering on game day? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contacts & Venue Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E4D2B] text-white p-7 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#D4AF37]" />
                Tournament Executive Committee
              </div>
              <h3 className="text-2xl font-bold font-serif-heading text-white">
                {EVENT_DETAILS.name}
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                Benefiting {EVENT_DETAILS.beneficiaryOrg}
              </p>

              <div className="mt-6 pt-6 border-t border-emerald-800 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Tournament Founder & Chair</div>
                    <div className="text-slate-300">{EVENT_DETAILS.founder}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email Inquiries</div>
                    <a href={`mailto:${EVENT_DETAILS.email}`} className="text-amber-300 hover:underline">
                      {EVENT_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Direct Phone</div>
                    <a href="tel:9058182005" className="text-slate-200 hover:text-amber-300 transition hover:underline">
                      {EVENT_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Tournament Venue</div>
                    <a
                      href={EVENT_DETAILS.venue.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-100 font-semibold hover:text-amber-300 transition hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>{EVENT_DETAILS.venue.name}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-300" />
                    </a>
                    <a
                      href={EVENT_DETAILS.venue.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 text-xs hover:text-white transition hover:underline block mt-0.5"
                    >
                      {EVENT_DETAILS.venue.address}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Info & Quick Specs */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>501(c)(3) Charitable Tax Deductible Status</span>
              </div>
              <p>
                Federal Tax ID / EIN: <strong>{EVENT_DETAILS.taxId}</strong>. All donations and net sponsorship contributions are tax-deductible to the fullest extent of the law.
              </p>
            </div>
          </div>

          {/* Right Column: Tabbed Forms (General Inquiry vs Volunteer Sign-Up) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
            {/* Form Toggle Tabs */}
            <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setContactTab('inquiry')}
                className={`flex-1 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  contactTab === 'inquiry'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Send An Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => setContactTab('volunteer')}
                className={`flex-1 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  contactTab === 'volunteer'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Volunteer On-Course</span>
              </button>
            </div>

            {/* TAB 1: General Inquiry Form */}
            {contactTab === 'inquiry' && (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Sterling"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(formatTitleCase(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={inquiryEmail}
                      onChange={(e) => {
                        setInquiryEmail(e.target.value);
                        if (inquiryEmailError) setInquiryEmailError('');
                      }}
                      onBlur={() => {
                        if (inquiryEmail.trim() && !isValidEmail(inquiryEmail)) {
                          setInquiryEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
                        } else {
                          setInquiryEmailError('');
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        inquiryEmailError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {inquiryEmailError && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {inquiryEmailError}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Subject</label>
                  <select
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
                  >
                    <option value="General Tournament Question">General Tournament Question</option>
                    <option value="Corporate Sponsorship & Invoice Inquiry">Corporate Sponsorship & Invoice Inquiry</option>
                    <option value="Registration & Golfer Pairings Request">Registration & Golfer Pairings Request</option>
                    <option value="Silent Auction Item Donation">Silent Auction Item Donation</option>
                    <option value="Memorial Tribute & Dedications">Memorial Tribute & Dedications</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you with the 2026 Memorial Golf Classic?"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(capitalizeFirstLetter(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isInquirySent}
                  className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isInquirySent ? 'Message Sent!' : 'Send Inquiry to Committee'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: Volunteer Sign-Up Form */}
            {contactTab === 'volunteer' && (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <strong>Join Our Volunteer Crew:</strong> Volunteers receive complimentary event meals, a tournament polo shirt, and an invitation to the evening Awards Banquet!
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Volunteer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={volName}
                      onChange={(e) => setVolName(formatTitleCase(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={volEmail}
                      onChange={(e) => {
                        setVolEmail(e.target.value);
                        if (volEmailError) setVolEmailError('');
                      }}
                      onBlur={() => {
                        if (volEmail.trim() && !isValidEmail(volEmail)) {
                          setVolEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
                        } else {
                          setVolEmailError('');
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        volEmailError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {volEmailError && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {volEmailError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(905) 818-2005"
                      value={volPhone}
                      onChange={(e) => {
                        setVolPhone(formatPhoneNumber(e.target.value));
                        if (volPhoneError) setVolPhoneError('');
                      }}
                      onBlur={() => {
                        if (volPhone.trim() && !isValidPhone(volPhone)) {
                          setVolPhoneError('Phone format must be exactly (###) ###-####');
                        } else {
                          setVolPhoneError('');
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        volPhoneError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {volPhoneError && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {volPhoneError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Volunteer Polo Shirt Size</label>
                    <select
                      value={volShirt}
                      onChange={(e) => setVolShirt(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
                    >
                      <option value="S">Small (S)</option>
                      <option value="M">Medium (M)</option>
                      <option value="L">Large (L)</option>
                      <option value="XL">X-Large (XL)</option>
                      <option value="2XL">2X-Large (2XL)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Volunteer Role</label>
                  <select
                    value={volRole}
                    onChange={(e) => setVolRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
                  >
                    <option value="Morning Check-In & Gift Bag Desk (9:30 AM - 12:00 PM)">Morning Check-In & Gift Bag Desk (9:30 AM - 12:00 PM)</option>
                    <option value="On-Course Hole Marshall & Hole-in-One Spotter (12:00 PM - 5:00 PM)">On-Course Hole Marshall & Hole-in-One Spotter (12:00 PM - 5:00 PM)</option>
                    <option value="Beverage Cart Hospitality Assistant (12:30 PM - 4:30 PM)">Beverage Cart Hospitality Assistant (12:30 PM - 4:30 PM)</option>
                    <option value="Charity Mega Raffle & Silent Auction Coordinator (4:30 PM - 7:30 PM)">Charity Mega Raffle & Silent Auction Coordinator (4:30 PM - 7:30 PM)</option>
                    <option value="Chipping & Putting Competition Monitor (9:30 AM - 11:30 AM)">Chipping & Putting Competition Monitor (9:30 AM - 11:30 AM)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isVolSent}
                  className="w-full py-3.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{isVolSent ? 'Signed Up Successfully!' : 'Register as Tournament Volunteer'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
