import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import {
  X,
  Heart,
  CreditCard,
  Sparkles,
  User,
  Mail,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Wand2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Validation & Formatting Helpers ---

export const formatTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word
        .split('-')
        .map((sub) => (sub.length > 0 ? sub.charAt(0).toUpperCase() + sub.slice(1) : ''))
        .join('-');
    })
    .join(' ');
};

export const formatFirstLetterCaps = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const AI_TRIBUTE_SUGGESTIONS = [
  "In loving memory of an extraordinary soul whose grace, warmth, and beautiful spirit continue to illuminate our lives and inspire us all.",
  "Honoring a radiant life filled with love, laughter, and courage. Forever cherished and remembered in our hearts on every fairway today.",
  "With deepest love and heartfelt remembrance. Sending strength, warmth, and endless appreciation to Saied and the entire family.",
  "In loving tribute to a legacy of boundless kindness, hope, and compassion. Proud to support this vital cause in her eternal honor.",
  "Your bright spirit, radiant smile, and gentle strength will forever guide us. Playing in loving remembrance today and always."
];

export const DonationModal: React.FC = () => {
  const { isDonationModalOpen, setIsDonationModalOpen, selectedDonationAmount, addDonation } = useTournament();

  const [amount, setAmount] = useState<number>(100);
  const [customInput, setCustomInput] = useState<string>('100');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tributeType, setTributeType] = useState<'in_memory_of' | 'in_honor_of' | 'general'>('in_memory_of');
  const [tributeName, setTributeName] = useState(EVENT_DETAILS.memorialHonoree);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation errors
  const [amountError, setAmountError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  // AI suggestions modal/tray state
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestionIndex, setAiSuggestionIndex] = useState(0);

  useEffect(() => {
    if (selectedDonationAmount) {
      const initialVal = Math.max(100, selectedDonationAmount);
      setAmount(initialVal);
      setCustomInput(initialVal.toString());
    } else {
      setAmount(100);
      setCustomInput('100');
    }
  }, [selectedDonationAmount, isDonationModalOpen]);

  if (!isDonationModalOpen) return null;

  const handlePresetClick = (val: number) => {
    const safeVal = Math.max(100, val);
    setAmount(safeVal);
    setCustomInput(safeVal.toString());
    setAmountError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomInput(raw);
    const parsed = Number(raw);
    if (!raw || isNaN(parsed)) {
      setAmount(0);
      setAmountError('Please enter your donation amount. Min $100');
    } else if (parsed < 100) {
      setAmount(parsed);
      setAmountError('Please enter your donation amount. Min $100');
    } else {
      setAmount(parsed);
      setAmountError('');
    }
  };

  const handleCustomAmountBlur = () => {
    const parsed = Number(customInput);
    if (!customInput || isNaN(parsed) || parsed < 100) {
      setAmount(100);
      setCustomInput('100');
      setAmountError('');
    }
  };

  const handleEmailBlur = (val: string) => {
    let trimmed = val.trim();
    if (trimmed && !trimmed.includes('@')) {
      trimmed = `${trimmed}@gmail.com`;
    }
    setDonorEmail(trimmed);
    if (trimmed && !isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
    } else {
      setEmailError('');
    }
  };

  const handleApplyAiSuggestion = (suggestionText: string) => {
    setMessage(formatFirstLetterCaps(suggestionText));
    setShowAiSuggestions(false);
  };

  const handleCycleAiSuggestion = () => {
    const nextIdx = (aiSuggestionIndex + 1) % AI_TRIBUTE_SUGGESTIONS.length;
    setAiSuggestionIndex(nextIdx);
    setMessage(formatFirstLetterCaps(AI_TRIBUTE_SUGGESTIONS[nextIdx]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Restrict donation amount to minimum $100
    if (!amount || amount < 100) {
      setAmountError('Please enter your donation amount. Min $100');
      hasError = true;
    } else {
      setAmountError('');
    }

    // Validate Donor Name if not anonymous
    if (!isAnonymous && !donorName.trim()) {
      setNameError('Please provide your name (or select Give Anonymously).');
      hasError = true;
    } else {
      setNameError('');
    }

    // Validate Email
    if (donorEmail.trim() && !isValidEmail(donorEmail.trim())) {
      setEmailError('Please enter a valid email address with @ and domain (e.g. name@domain.com).');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    setIsProcessing(true);

    setTimeout(() => {
      addDonation({
        donorName: isAnonymous ? 'Anonymous Supporter' : donorName,
        donorEmail: donorEmail.trim(),
        amount: Math.max(100, amount),
        isAnonymous,
        tributeType,
        tributeName: tributeType === 'general' ? undefined : tributeName,
        message
      });

      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const handleClose = () => {
    setIsDonationModalOpen(false);
    setIsSuccess(false);
    setDonorName('');
    setDonorEmail('');
    setMessage('');
    setAmountError('');
    setNameError('');
    setEmailError('');
    setShowAiSuggestions(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E4D2B] to-[#15381E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-200 tracking-wider">
                Memorial Dedication Gift
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-white">
                Support Cancer Patient Relief
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
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 fill-current" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900 font-serif-heading">
                Thank You for Your Generosity!
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Your memorial gift of <strong>${amount.toLocaleString()}</strong> in honor of <strong>{tributeName}</strong> has been received with heartfelt appreciation.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-slate-800">{EVENT_DETAILS.beneficiaryOrg}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Status:</span>
                <span className="font-bold text-emerald-700">100% Tax-Deductible 501(c)(3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Email:</span>
                <span className="text-slate-800">{donorEmail || 'Receipt Generated on Screen'}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Close &amp; View Tribute Wall
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Amount Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Donation Amount
              </label>
              {/* Presets updated: $100, $150, $250, $500, $1000 */}
              <div className="grid grid-cols-5 gap-2 mb-2.5">
                {[100, 150, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetClick(val)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold font-mono border transition cursor-pointer ${
                      amount === val
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-2 ring-[#1E4D2B]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {/* Custom amount input restricted to min $100 */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="100"
                  step="5"
                  placeholder="100"
                  value={customInput}
                  onChange={handleCustomAmountChange}
                  onBlur={handleCustomAmountBlur}
                  className={`w-full pl-7 pr-3 py-2 text-sm border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                    amountError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                  }`}
                />
              </div>

              {/* Requested notice text below donation amounts */}
              <p className={`text-xs mt-1.5 font-medium ${amountError ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                Please enter your donation amount. Min $100
              </p>
            </div>

            {/* Dedication Options */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Memorial Dedication
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setTributeType('in_memory_of');
                    setTributeName(EVENT_DETAILS.memorialHonoree);
                  }}
                  className={`py-1.5 px-2 rounded-lg font-semibold border transition cursor-pointer ${
                    tributeType === 'in_memory_of'
                      ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B]'
                      : 'border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  In Memory Of
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTributeType('in_honor_of');
                    setTributeName(EVENT_DETAILS.founder);
                  }}
                  className={`py-1.5 px-2 rounded-lg font-semibold border transition cursor-pointer ${
                    tributeType === 'in_honor_of'
                      ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B]'
                      : 'border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  In Honor Of
                </button>
                <button
                  type="button"
                  onClick={() => setTributeType('general')}
                  className={`py-1.5 px-2 rounded-lg font-semibold border transition cursor-pointer ${
                    tributeType === 'general'
                      ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B]'
                      : 'border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  General Support
                </button>
              </div>

              {tributeType !== 'general' && (
                <div>
                  <input
                    type="text"
                    value={tributeName}
                    onChange={(e) => setTributeName(formatTitleCase(e.target.value))}
                    placeholder="Dedication Name"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Memorial Message / Note for the Tribute Wall (Optional)
                  </label>

                  {/* AI Suggestion Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!showAiSuggestions) {
                        setShowAiSuggestions(true);
                      } else {
                        handleCycleAiSuggestion();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-[10px] font-bold shadow-xs transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>AI can write suggestions</span>
                  </button>
                </div>

                {/* AI Suggestions Panel */}
                {showAiSuggestions && (
                  <div className="mb-2 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-amber-600" />
                        Heartfelt AI Tribute Suggestions
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCycleAiSuggestion}
                          className="text-[10px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer underline"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Auto-Fill
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAiSuggestions(false)}
                          className="text-slate-400 hover:text-slate-700 text-xs"
                        >
                          &times;
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {AI_TRIBUTE_SUGGESTIONS.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyAiSuggestion(sug)}
                          className="text-left text-[11px] p-2 rounded-lg bg-white/90 hover:bg-white border border-amber-200/80 text-slate-700 hover:text-[#1E4D2B] transition cursor-pointer hover:border-[#1E4D2B]"
                        >
                          &ldquo;{sug}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  rows={2}
                  placeholder="Share a memory, heartfelt greeting, or words of encouragement for Saied & family..."
                  value={message}
                  onChange={(e) => setMessage(formatFirstLetterCaps(e.target.value))}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>

            {/* Donor Identity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Donor Information</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setNameError('');
                      }
                    }}
                    className="rounded text-[#1E4D2B] focus:ring-[#1E4D2B]"
                  />
                  <span>Give Anonymously</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required={!isAnonymous}
                      placeholder="Your Full Name *"
                      value={donorName}
                      onChange={(e) => {
                        const formatted = formatTitleCase(e.target.value);
                        setDonorName(formatted);
                        if (nameError) setNameError('');
                      }}
                      className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        nameError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                    />
                    {nameError && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {nameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email for Tax Receipt (name@domain.com)"
                      value={donorEmail}
                      onChange={(e) => {
                        setDonorEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      onBlur={(e) => handleEmailBlur(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] ${
                        emailError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                    />
                    {emailError && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {emailError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Tax-Deductible</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{isProcessing ? 'Processing Gift...' : `Donate $${Math.max(100, amount).toLocaleString()}`}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
