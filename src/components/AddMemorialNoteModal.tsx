import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import {
  X,
  Heart,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  User,
  Quote,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INSPIRATION_PROMPTS = [
  "Forever in our hearts, your radiant warmth, grace, and smile will always guide us.",
  "Sending love, strength, and heartfelt prayers to Saied and the entire family. Proud to play for you today.",
  "In loving remembrance of Naseem — an enduring inspiration of kindness, courage, and resilience.",
  "May your gentle soul rest in everlasting peace. Honored to support this vital cause in your honor.",
  "Remembering a beautiful soul whose light continues to shine across our entire community."
];

export const AddMemorialNoteModal: React.FC = () => {
  const { isMemorialNoteModalOpen, setIsMemorialNoteModalOpen, addDonation, addToast } = useTournament();

  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [affiliation, setAffiliation] = useState('Friend of the Family');
  const [honoree, setHonoree] = useState(EVENT_DETAILS.memorialHonoree);
  const [message, setMessage] = useState('');
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');

  if (!isMemorialNoteModalOpen) return null;

  const handleClose = () => {
    setIsMemorialNoteModalOpen(false);
    setIsSuccess(false);
  };

  const handleInspirationClick = (prompt: string) => {
    setMessage(prompt);
    setMessageError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!isAnonymous && !authorName.trim()) {
      setNameError('Please provide your name or check "Post Anonymously"');
      valid = false;
    } else {
      setNameError('');
    }

    if (!message.trim() || message.trim().length < 5) {
      setMessageError('Please enter a heartfelt memorial note (at least 5 characters)');
      valid = false;
    } else {
      setMessageError('');
    }

    if (!valid) return;

    setIsSubmitting(true);

    try {
      const finalAmount = donationAmount === -1 ? Number(customAmount) || 0 : donationAmount;
      const displayName = isAnonymous ? 'Anonymous Supporter' : authorName.trim();

      addDonation({
        donorName: displayName,
        amount: finalAmount,
        isAnonymous,
        tributeType: 'in_memory_of',
        tributeName: honoree.trim() || EVENT_DETAILS.memorialHonoree,
        message: message.trim()
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
      addToast('success', 'Memorial Note Published!', 'Your heartfelt message is now permanently displayed on the Tribute Wall.');

      setTimeout(() => {
        setIsSubmitting(false);
        setIsMemorialNoteModalOpen(false);
        setIsSuccess(false);
        // Reset form
        setAuthorName('');
        setMessage('');
        setDonationAmount(0);

        // Smooth scroll to tributes wall so author immediately sees card
        const el = document.getElementById('tributes');
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 1400);
    } catch {
      setIsSubmitting(false);
      addToast('error', 'Submission Failed', 'Please try submitting your tribute again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-rose-200/80 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-memorial-title"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1E4D2B] via-[#163820] to-[#0F2D17] px-5 sm:px-7 py-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>Memorial Book &amp; Tribute Wall</span>
          </div>
          <h2 id="modal-memorial-title" className="text-xl sm:text-2xl font-bold font-serif-heading text-white tracking-tight">
            Add a Memorial Note
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-md">
            In loving memory of <span className="font-semibold text-amber-300">Naseem Mohammed</span>. Your message will be visible to all tournament guests and the family.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-8 h-8 fill-rose-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                Heartfelt Note Published!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for honoring Naseem Mohammed. Your words have been placed into the Memorial Book &amp; Tribute Wall.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Syncing cards on the tribute wall...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Author Name / Anonymous Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Your Name / Family Name
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-[#1E4D2B] focus:ring-[#1E4D2B]"
                    />
                    <span>Post anonymously</span>
                  </label>
                </div>

                {!isAnonymous ? (
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => {
                        setAuthorName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="e.g. John &amp; Sarah Thompson"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        nameError ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                ) : (
                  <div className="py-2 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                    Your note will be displayed as &ldquo;Anonymous Supporter&rdquo;
                  </div>
                )}
                {nameError && <p className="text-xs text-rose-600 mt-1">{nameError}</p>}
              </div>

              {/* Relationship / Affiliation & Dedication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Connection
                  </label>
                  <select
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  >
                    <option value="Friend of the Family">Friend of the Family</option>
                    <option value="Burford Tournament Golfer">Burford Tournament Golfer</option>
                    <option value="Colleague & Partner">Colleague &amp; Partner</option>
                    <option value="Cancer Survivor & Supporter">Cancer Survivor &amp; Supporter</option>
                    <option value="Community Member">Community Member</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tribute Dedication
                  </label>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-rose-50/80 border border-rose-200 rounded-xl text-xs font-semibold text-rose-900">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span>In Memory of {honoree}</span>
                  </div>
                </div>
              </div>

              {/* Memorial Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Your Memorial Note / Words of Remembrance *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {message.length} characters
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (messageError) setMessageError('');
                    }}
                    placeholder="Write your personal memories, comfort for Saied & the family, or words of remembrance to celebrate Naseem's enduring legacy..."
                    className={`w-full p-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] leading-relaxed resize-none ${
                      messageError ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                </div>
                {messageError && <p className="text-xs text-rose-600 mt-1">{messageError}</p>}
              </div>

              {/* Inspiration Prompts */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                  <Quote className="w-3 h-3 text-amber-600" />
                  <span>Click for Thought Starters / Inspirations:</span>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {INSPIRATION_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInspirationClick(prompt)}
                      className="w-full text-left text-[11px] text-slate-600 hover:text-slate-900 hover:bg-rose-50/70 p-1.5 rounded border border-slate-200/60 transition cursor-pointer line-clamp-1"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Memorial Contribution Choice */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Optional Memorial Gift to Cancer Research &amp; Relief
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDonationAmount(0)}
                    className={`py-2 px-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      donationAmount === 0
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Note Only ($0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationAmount(25)}
                    className={`py-2 px-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      donationAmount === 25
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    +$25 Gift
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationAmount(50)}
                    className={`py-2 px-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      donationAmount === 50
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    +$50 Gift
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationAmount(100)}
                    className={`py-2 px-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      donationAmount === 100
                        ? 'bg-[#EA580C] text-white border-[#EA580C]'
                        : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    +$100 Gift
                  </button>
                </div>
                {donationAmount > 0 && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Includes a ${donationAmount} charitable tax-deductible memorial gift to Juravinski &amp; Red Cross.</span>
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing Note...' : 'Publish Memorial Note to Tribute Wall'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
