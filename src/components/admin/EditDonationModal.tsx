import React, { useState, useEffect } from 'react';
import { X, Save, Heart, DollarSign, Mail, MessageSquare } from 'lucide-react';
import { DonationRecord } from '../../types';

interface EditDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationRecord | null;
  onSave: (donationId: string, updates: Partial<DonationRecord>) => void;
}

export const EditDonationModal: React.FC<EditDonationModalProps> = ({
  isOpen,
  onClose,
  donation,
  onSave
}) => {
  const [donorName, setDonorName] = useState(donation?.donorName || '');
  const [donorEmail, setDonorEmail] = useState(donation?.donorEmail || '');
  const [paymentMethod, setPaymentMethod] = useState(donation?.paymentMethod || 'e-transfer');
  const [amount, setAmount] = useState<number>(donation?.amount || 0);
  const [tributeName, setTributeName] = useState(donation?.tributeName || '');
  const [message, setMessage] = useState(donation?.message || '');
  const [isAnonymous, setIsAnonymous] = useState(donation?.isAnonymous || false);

  useEffect(() => {
    if (donation) {
      setDonorName(donation.donorName || '');
      setDonorEmail(donation.donorEmail || '');
      setPaymentMethod(donation.paymentMethod || 'e-transfer');
      setAmount(donation.amount || 0);
      setTributeName(donation.tributeName || '');
      setMessage(donation.message || '');
      setIsAnonymous(donation.isAnonymous || false);
    }
  }, [donation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donation) return;
    onSave(donation.id, {
      donorName: donorName.trim() || (isAnonymous ? 'Anonymous Donor' : 'Supporter'),
      donorEmail: donorEmail.trim(),
      paymentMethod,
      amount: Number(amount) || 0,
      tributeName: tributeName.trim() || 'Naseem Mohammed',
      message: message.trim(),
      isAnonymous
    });
    onClose();
  };

  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm">Edit Memorial Donation</h3>
              <p className="text-xs text-emerald-200/90">In Memory of Naseem Mohammed</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Donor Name
              </label>
              <input
                type="text"
                required={!isAnonymous}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="Donor Name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Gift Amount ($ CAD)</span>
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Donor Email</span>
              </label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="donor@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              >
                <option value="Cash">Cash</option>
                <option value="e-transfer">e-transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tribute Honoree
            </label>
            <input
              type="text"
              value={tributeName}
              onChange={(e) => setTributeName(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. Naseem Mohammed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Memorial Tribute Message</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="In loving memory of..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAnonymousEdit"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isAnonymousEdit" className="text-xs font-medium text-slate-700 cursor-pointer">
              Display as Anonymous on Public Tribute Board
            </label>
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
              <span>Save Donation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
