import React, { useState, useEffect } from 'react';
import { X, Save, FileText, DollarSign, Car, Flag, AlertCircle } from 'lucide-react';
import { RegistrationRecord, PaymentMethod, PaymentStatus } from '../../types';
import { capitalizeWords, formatCartAssignment } from '../../utils/textFormatting';

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: RegistrationRecord | null;
  onSave: (regId: string, updates: Partial<RegistrationRecord>) => void;
}

export const EditRegistrationModal: React.FC<EditRegistrationModalProps> = ({
  isOpen,
  onClose,
  registration,
  onSave
}) => {
  const [teamName, setTeamName] = useState(registration?.teamName ? capitalizeWords(registration.teamName) : '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(registration?.paymentMethod || 'credit_card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(registration?.paymentStatus || 'completed');
  const [totalAmount, setTotalAmount] = useState<number>(registration ? registration.totalAmount : 60);
  const [assignedCart, setAssignedCart] = useState(registration?.assignedCart ? formatCartAssignment(registration.assignedCart) : '');
  const [assignedStartingHole, setAssignedStartingHole] = useState<number>(
    registration?.assignedStartingHole ? Math.min(10, Math.max(1, registration.assignedStartingHole)) : 1
  );
  const [amountError, setAmountError] = useState<string | null>(null);

  useEffect(() => {
    if (registration) {
      setTeamName(registration.teamName ? capitalizeWords(registration.teamName) : '');
      setPaymentMethod(registration.paymentMethod);
      setPaymentStatus(registration.paymentStatus);
      setTotalAmount(registration.totalAmount);
      setAssignedCart(registration.assignedCart ? formatCartAssignment(registration.assignedCart) : '');
      setAssignedStartingHole(
        registration.assignedStartingHole ? Math.min(10, Math.max(1, registration.assignedStartingHole)) : 1
      );
      setAmountError(null);
    }
  }, [registration]);

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(capitalizeWords(e.target.value));
  };

  const handleCartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignedCart(formatCartAssignment(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;

    const finalAmount = Number(totalAmount);
    if (isNaN(finalAmount) || finalAmount < 0) {
      setAmountError('Total amount cannot be negative.');
      return;
    }

    onSave(registration.id, {
      teamName: capitalizeWords(teamName.trim()) || undefined,
      paymentMethod,
      paymentStatus,
      totalAmount: finalAmount,
      assignedCart: formatCartAssignment(assignedCart.trim()) || undefined,
      assignedStartingHole: Math.min(10, Math.max(1, Number(assignedStartingHole) || 1))
    });
    onClose();
  };

  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-bold text-sm">
                Edit Registration ({registration.confirmationCode})
              </h3>
              <p className="text-xs text-emerald-200/90">
                Primary Contact: {registration.primaryContact.name}
              </p>
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
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Foursome / Team Name <span className="text-[11px] font-normal text-slate-500">(Auto-capitalized)</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={handleTeamNameChange}
              onBlur={() => setTeamName(capitalizeWords(teamName))}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. Fairway Aces"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              >
                <option value="cheque">Cheque (to Saied Mohammed)</option>
                <option value="etransfer">e-Transfer (to Saied Mohammed)</option>
                <option value="cash">Cash (at check-in to Saied)</option>
                <option value="credit_card">Credit Card (Online)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              >
                <option value="paid">PAID (Verified)</option>
                <option value="pending">PENDING (Awaiting settlement)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Amount ($)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={totalAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setTotalAmount(val);
                  if (val < 0) {
                    setAmountError('Amount cannot be negative');
                  } else {
                    setAmountError(null);
                  }
                }}
                className={`w-full text-xs font-semibold px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-hidden ${
                  amountError ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/40' : 'border-slate-300 focus:ring-[#1E4D2B]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned Cart</span>
              </label>
              <input
                type="text"
                value={assignedCart}
                onChange={handleCartChange}
                onBlur={() => setAssignedCart(formatCartAssignment(assignedCart))}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="e.g. Cart #6A"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Starting Hole (1–10)</span>
              </label>
              <select
                value={assignedStartingHole}
                onChange={(e) => setAssignedStartingHole(parseInt(e.target.value) || 1)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => (
                  <option key={hole} value={hole}>
                    Hole #{hole}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {amountError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{amountError}</span>
            </div>
          )}

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
              <span>Save Registration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
