import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { EVENT_DETAILS } from '../data/initialData';
import { X, Heart, CheckCircle, CreditCard, Sparkles, User, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonationModal: React.FC = () => {
  const { isDonationModalOpen, setIsDonationModalOpen, selectedDonationAmount, addDonation } = useTournament();

  const [amount, setAmount] = useState<number>(selectedDonationAmount || 100);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tributeType, setTributeType] = useState<'in_memory_of' | 'in_honor_of' | 'general'>('in_memory_of');
  const [tributeName, setTributeName] = useState(EVENT_DETAILS.memorialHonoree);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedDonationAmount) {
      setAmount(selectedDonationAmount);
    }
  }, [selectedDonationAmount]);

  if (!isDonationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      alert('Please provide your name or check "Donate Anonymously".');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      addDonation({
        donorName: isAnonymous ? 'Anonymous Supporter' : donorName,
        donorEmail,
        amount,
        isAnonymous,
        tributeType,
        tributeName: tributeType === 'general' ? undefined : tributeName,
        message
      });

      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 80,
        spread: 70,
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
              Close & View Tribute Wall
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Amount Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Donation Amount
              </label>
              <div className="grid grid-cols-5 gap-2 mb-2.5">
                {[50, 100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
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

              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="5"
                  placeholder="Custom Amount"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
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
                    onChange={(e) => setTributeName(e.target.value)}
                    placeholder="Dedication Name"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Memorial Message / Note for the Tribute Wall (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a memory, heartfelt greeting, or words of encouragement for Saied & family..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                    onChange={(e) => setIsAnonymous(e.target.checked)}
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
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email for Tax Receipt"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                <span>{isProcessing ? 'Processing Gift...' : `Donate $${amount.toLocaleString()}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
