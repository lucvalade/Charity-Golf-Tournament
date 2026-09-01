import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/initialData';
import { useTournament } from '../context/TournamentContext';
import { Mail, Phone, MapPin, Send, Heart, Users, CheckCircle, Clock, Calendar } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addToast } = useTournament();
  const [activeTab, setActiveTab] = useState<'inquiry' | 'volunteer'>('inquiry');

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('General Tournament Question');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isInquirySent, setIsInquirySent] = useState(false);

  // Volunteer Form State
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volRole, setVolRole] = useState('Morning Check-In & Gift Bag Desk (10:00 AM - 12:30 PM)');
  const [volShirt, setVolShirt] = useState('L');
  const [isVolSent, setIsVolSent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setIsVolSent(true);
    addToast('success', 'Volunteer Sign-Up Received!', `Thank you ${volName} for volunteering to support Amina's memorial mission!`);
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
            Have a question about sponsorships, foursomes, or tax deductions? Interested in volunteering on game day? We would love to hear from you.
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
                    <a href="mailto:committee@saiedcharitygolf.org" className="text-amber-300 hover:underline">
                      committee@saiedcharitygolf.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Direct Phone & SMS</div>
                    <div className="text-slate-200">(905) 555-0199 / (555) 789-2026</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Tournament Venue</div>
                    <div className="text-slate-200">{EVENT_DETAILS.venue.name}</div>
                    <div className="text-slate-400 text-xs">{EVENT_DETAILS.venue.address}</div>
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
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'inquiry'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Send An Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('volunteer')}
                className={`flex-1 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'volunteer'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Volunteer On-Course</span>
              </button>
            </div>

            {/* TAB 1: General Inquiry Form */}
            {activeTab === 'inquiry' && (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Sterling"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
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
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
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
                    <option value="Foursome & Golfer Pairings Request">Foursome & Golfer Pairings Request</option>
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
                    onChange={(e) => setInquiryMessage(e.target.value)}
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
            {activeTab === 'volunteer' && (
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
                      onChange={(e) => setVolName(e.target.value)}
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
                      onChange={(e) => setVolEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 345-6789"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
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
                    <option value="Morning Check-In & Gift Bag Desk (10:00 AM - 12:30 PM)">Morning Check-In & Gift Bag Desk (10:00 AM - 12:30 PM)</option>
                    <option value="On-Course Hole Marshall & Hole-in-One Spotter (12:00 PM - 5:00 PM)">On-Course Hole Marshall & Hole-in-One Spotter (12:00 PM - 5:00 PM)</option>
                    <option value="Beverage Cart Hospitality Assistant (12:30 PM - 4:30 PM)">Beverage Cart Hospitality Assistant (12:30 PM - 4:30 PM)</option>
                    <option value="Charity Mega Raffle & Silent Auction Coordinator (4:30 PM - 7:30 PM)">Charity Mega Raffle & Silent Auction Coordinator (4:30 PM - 7:30 PM)</option>
                    <option value="Putting Shootout & Skills Contest Monitor (10:30 AM - 12:15 PM)">Putting Shootout & Skills Contest Monitor (10:30 AM - 12:15 PM)</option>
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
