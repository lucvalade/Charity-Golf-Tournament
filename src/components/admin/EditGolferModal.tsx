import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Award, Shirt, Utensils } from 'lucide-react';
import { PlayerInfo } from '../../types';
import { capitalizeWords, formatPhoneNumber } from '../../utils/textFormatting';

interface EditGolferModalProps {
  isOpen: boolean;
  onClose: () => void;
  regId: string;
  playerIndex: number;
  player: PlayerInfo | null;
  onSave: (regId: string, playerIndex: number, updates: Partial<PlayerInfo>) => void;
}

export const EditGolferModal: React.FC<EditGolferModalProps> = ({
  isOpen,
  onClose,
  regId,
  playerIndex,
  player,
  onSave
}) => {
  const [name, setName] = useState(player?.name ? capitalizeWords(player.name) : '');
  const [email, setEmail] = useState(player?.email || '');
  const [phone, setPhone] = useState(player?.phone ? formatPhoneNumber(player.phone) : '');
  const [handicap, setHandicap] = useState(player?.handicap || '');
  const [shirtSize, setShirtSize] = useState(player?.shirtSize || 'L');
  const [dietary, setDietary] = useState(player?.dietaryRestrictions || '');

  useEffect(() => {
    if (player) {
      setName(player.name ? capitalizeWords(player.name) : '');
      setEmail(player.email || '');
      setPhone(player.phone ? formatPhoneNumber(player.phone) : '');
      setHandicap(player.handicap || '');
      setShirtSize(player.shirtSize || 'L');
      setDietary(player.dietaryRestrictions || '');
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(regId, playerIndex, {
      name: capitalizeWords(name.trim()) || 'Golfer',
      email: email.trim(),
      phone: phone.trim(),
      handicap: handicap.trim(),
      shirtSize: shirtSize as any,
      dietaryRestrictions: dietary.trim()
    });
    onClose();
  };

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-bold text-sm">
                Edit Golfer #{playerIndex + 1} {playerIndex === 0 ? '(Captain)' : ''}
              </h3>
              <p className="text-xs text-emerald-200/90">Modify golfer details, contact, and preferences</p>
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
              Full Name <span className="text-[10px] font-normal text-slate-500 lowercase">(auto-capitalized)</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(capitalizeWords(e.target.value))}
              onBlur={() => setName(capitalizeWords(name))}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="golfer@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone: (###) ###-####</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                maxLength={14}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="(905) 555-0199"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Handicap / Index</span>
              </label>
              <input
                type="text"
                value={handicap}
                onChange={(e) => setHandicap(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
                placeholder="e.g. 14 or scratch"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Shirt className="w-3.5 h-3.5 text-slate-400" />
                <span>Shirt Size</span>
              </label>
              <select
                value={shirtSize}
                onChange={(e) => setShirtSize(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              >
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">2XL</option>
                <option value="XXXL">3XL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-slate-400" />
              <span>Dietary Restrictions &amp; Banquet Notes</span>
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E4D2B] focus:outline-hidden"
              placeholder="e.g. Vegetarian, Gluten-Free, Nut allergy, etc."
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
              <span>Save Golfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
