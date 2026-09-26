import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { FBGT_TEE_TIMES } from '../data/initialData';
import { RegistrationRecord, PlayerInfo, PaymentMethod } from '../types';
import { Users, X, Clock, Calendar, CheckCircle2, User, Mail, Phone, Hash, ShieldCheck, DollarSign, Save } from 'lucide-react';
import { formatNameTitleCase } from '../utils/textFormatting';

interface LineupDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTeam?: RegistrationRecord | null;
}

export const LineupDataEntryModal: React.FC<LineupDataEntryModalProps> = ({
  isOpen,
  onClose,
  editingTeam
}) => {
  const { registerTeamOrPlayer, updateRegistration, addToast } = useTournament();

  const [teamNumber, setTeamNumber] = useState<string>('14');
  const [teeTime, setTeeTime] = useState<string>('12:36');
  const [teamName, setTeamName] = useState<string>('');
  const [golferType, setGolferType] = useState<'member' | 'other'>('other');

  // Player 1 Primary
  const [p1Name, setP1Name] = useState<string>('');
  const [p1Email, setP1Email] = useState<string>('');
  const [p1Phone, setP1Phone] = useState<string>('');
  const [p1Handicap, setP1Handicap] = useState<string>('12.0');
  const [p1Shirt, setP1Shirt] = useState<string>('L');

  // Player 2
  const [p2Name, setP2Name] = useState<string>('');
  const [p2Email, setP2Email] = useState<string>('');
  const [p2Phone, setP2Phone] = useState<string>('');

  // Player 3
  const [p3Name, setP3Name] = useState<string>('');
  const [p3Email, setP3Email] = useState<string>('');
  const [p3Phone, setP3Phone] = useState<string>('');

  // Player 4
  const [p4Name, setP4Name] = useState<string>('');
  const [p4Email, setP4Email] = useState<string>('');
  const [p4Phone, setP4Phone] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('etransfer');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [confirmationCode, setConfirmationCode] = useState<string>('FBGT-2026');
  const [notes, setNotes] = useState<string>('Lineup Entry for Oct 5, 2026 FBGT Tournament');

  useEffect(() => {
    if (editingTeam) {
      setTeamNumber(editingTeam.teamNumber || '1');
      setTeeTime(editingTeam.teeTime || '11:00');
      setTeamName(editingTeam.teamName || '');
      setGolferType(editingTeam.golferType || 'other');

      setP1Name(editingTeam.primaryContact?.name || '');
      setP1Email(editingTeam.primaryContact?.email || '');
      setP1Phone(editingTeam.primaryContact?.phone || '');
      setP1Handicap(editingTeam.primaryContact?.handicap || '12.0');
      setP1Shirt(editingTeam.primaryContact?.shirtSize || 'L');

      const add = editingTeam.additionalPlayers || [];
      setP2Name(add[0]?.name || '');
      setP2Email(add[0]?.email || '');
      setP2Phone(add[0]?.phone || '');

      setP3Name(add[1]?.name || '');
      setP3Email(add[1]?.email || '');
      setP3Phone(add[1]?.phone || '');

      setP4Name(add[2]?.name || '');
      setP4Email(add[2]?.email || '');
      setP4Phone(add[2]?.phone || '');

      setPaymentMethod(editingTeam.paymentMethod || 'etransfer');
      setPaymentStatus(editingTeam.paymentStatus || 'paid');
      setConfirmationCode(editingTeam.confirmationCode || 'FBGT-2026');
      setNotes(editingTeam.notes || '');
    } else {
      // Defaults for new entry
      setTeamName('');
      setP1Name('');
      setP1Email('');
      setP1Phone('');
      setP2Name('');
      setP2Email('');
      setP2Phone('');
      setP3Name('');
      setP3Email('');
      setP3Phone('');
      setP4Name('');
      setP4Email('');
      setP4Phone('');
    }
  }, [editingTeam, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!p1Name.trim()) {
      addToast('error', 'Validation Error', 'Primary Golfer (Player 1) name is required');
      return;
    }

    const formattedP1Name = formatNameTitleCase(p1Name.trim());
    const formattedP2Name = formatNameTitleCase(p2Name.trim());
    const formattedP3Name = formatNameTitleCase(p3Name.trim());
    const formattedP4Name = formatNameTitleCase(p4Name.trim());

    const cleanTeamName = teamName.trim()
      ? formatNameTitleCase(teamName.trim())
      : `Team ${teamNumber} (${formattedP1Name}${formattedP2Name ? ' / ' + formattedP2Name : ''})`;

    const primaryPlayer: PlayerInfo = {
      id: editingTeam ? editingTeam.primaryContact.id : `p-p1-${Date.now()}`,
      name: formattedP1Name,
      email: p1Email.trim() || `${formattedP1Name.toLowerCase().replace(/\s+/g, '.')}@fbgt.ca`,
      phone: p1Phone.trim() || '(905) 555-0100',
      handicap: p1Handicap,
      shirtSize: p1Shirt
    };

    const additionalPlayers: PlayerInfo[] = [];

    if (formattedP2Name) {
      additionalPlayers.push({
        id: `p-p2-${Date.now()}`,
        name: formattedP2Name,
        email: p2Email.trim() || `${formattedP2Name.toLowerCase().replace(/\s+/g, '.')}@fbgt.ca`,
        phone: p2Phone.trim() || '(905) 555-0102'
      });
    }

    if (formattedP3Name) {
      additionalPlayers.push({
        id: `p-p3-${Date.now()}`,
        name: formattedP3Name,
        email: p3Email.trim() || `${formattedP3Name.toLowerCase().replace(/\s+/g, '.')}@fbgt.ca`,
        phone: p3Phone.trim() || '(905) 555-0103'
      });
    }

    if (formattedP4Name) {
      additionalPlayers.push({
        id: `p-p4-${Date.now()}`,
        name: formattedP4Name,
        email: p4Email.trim() || `${formattedP4Name.toLowerCase().replace(/\s+/g, '.')}@fbgt.ca`,
        phone: p4Phone.trim() || '(905) 555-0104'
      });
    }

    const calculatedTotal = golferType === 'member' ? 400 : 1600;

    if (editingTeam) {
      updateRegistration(editingTeam.id, {
        teamNumber,
        teeTime,
        teamName: cleanTeamName,
        golferType,
        primaryContact: primaryPlayer,
        additionalPlayers,
        requestedTeammates: additionalPlayers.map((p) => p.name),
        paymentMethod,
        paymentStatus,
        confirmationCode: confirmationCode.trim() || 'FBGT-2026',
        totalAmount: calculatedTotal,
        notes
      });
      addToast('success', 'Lineup Updated', `Updated Team #${teamNumber} (${teeTime} Tee Time) successfully.`);
    } else {
      registerTeamOrPlayer({
        type: 'foursome',
        teamNumber,
        teeTime,
        teamName: cleanTeamName,
        golferType,
        targetTier: 'Corporate Foursome ($1,600)',
        primaryContact: primaryPlayer,
        additionalPlayers,
        requestedTeammates: additionalPlayers.map((p) => p.name),
        paymentMethod,
        paymentStatus,
        confirmationCode: confirmationCode.trim() || `FBGT-${Math.floor(1000 + Math.random() * 9000)}`,
        notes,
        addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 }
      });
      addToast('success', 'New Team Registered', `Team #${teamNumber} assigned to ${teeTime} Tee Time.`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E4D2B] via-[#15803D] to-[#0F2D17] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026 FBGT Line Up &bull; Oct 5, 2026</span>
          </div>

          <h3 className="text-2xl font-extrabold font-serif-heading text-white">
            {editingTeam ? `Edit Team #${editingTeam.teamNumber || ''} Lineup Entry` : 'Data Entry Form • Add / Register Team'}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Assign Tee Times, Primary Contacts &amp; Teammate Rosters &bull; Oct 5, 2026
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Tee Time & Team Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-[#1E4D2B] font-bold text-sm border-b border-slate-200 pb-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Tee Time &amp; Team Identifier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Team # / Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={teamNumber}
                    onChange={(e) => setTeamNumber(e.target.value)}
                    placeholder="e.g. 1, 2, 14, ???"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Tee Time (Oct 5, 2026)
                </label>
                <select
                  value={teeTime}
                  onChange={(e) => setTeeTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-emerald-900 focus:ring-2 focus:ring-[#1E4D2B]"
                >
                  {FBGT_TEE_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time} AM/PM Tee Time
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pricing Rate Tier
                </label>
                <select
                  value={golferType}
                  onChange={(e) => setGolferType(e.target.value as 'member' | 'other')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#1E4D2B]"
                >
                  <option value="other">Guest / Corporate Rate ($1,600 / $120 ea)</option>
                  <option value="member">Member Rate ($400 / $100 ea)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Team Name / Header
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team 1 (DEB MARTIN / ROBERT MARTIN / JEFF SAUNDERS / MAUREEN SAUNDERS)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1E4D2B]"
              />
            </div>
          </div>

          {/* Section 2: Player 1 (Primary Contact) */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                Player 1: Primary Golfer Details (Contact) *
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                Main Point of Contact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  placeholder="DEB MARTIN"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={p1Email}
                  onChange={(e) => setP1Email(e.target.value)}
                  placeholder="deb.martin@example.com"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={p1Phone}
                  onChange={(e) => setP1Phone(e.target.value)}
                  placeholder="(905) 555-0101"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Teammates (Players 2, 3, 4) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#1E4D2B]" />
                Names of the Other Golfers (Players 2, 3, 4)
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Use "??????" for unassigned open spots
              </span>
            </div>

            {/* Player 2 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Player 2 Name</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder="ROBERT MARTIN"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <input
                  type="email"
                  value={p2Email}
                  onChange={(e) => setP2Email(e.target.value)}
                  placeholder="robert.martin@example.com"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                />
                <input
                  type="text"
                  value={p2Phone}
                  onChange={(e) => setP2Phone(e.target.value)}
                  placeholder="(905) 555-0102"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Player 3 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Player 3 Name</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={p3Name}
                  onChange={(e) => setP3Name(e.target.value)}
                  placeholder="JEFF SAUNDERS"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <input
                  type="email"
                  value={p3Email}
                  onChange={(e) => setP3Email(e.target.value)}
                  placeholder="jeff.saunders@example.com"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                />
                <input
                  type="text"
                  value={p3Phone}
                  onChange={(e) => setP3Phone(e.target.value)}
                  placeholder="(905) 555-0103"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Player 4 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Player 4 Name</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={p4Name}
                  onChange={(e) => setP4Name(e.target.value)}
                  placeholder="MAUREEN SAUNDERS"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <input
                  type="email"
                  value={p4Email}
                  onChange={(e) => setP4Email(e.target.value)}
                  placeholder="maureen.saunders@example.com"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                />
                <input
                  type="text"
                  value={p4Phone}
                  onChange={(e) => setP4Phone(e.target.value)}
                  placeholder="(905) 555-0104"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="cheque">Cheque</option>
                <option value="etransfer">e-Transfer</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'pending')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="paid">Paid (Confirmed)</option>
                <option value="pending">Pending Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmation Code
              </label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="DMART-1010"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{editingTeam ? 'Save Lineup Changes' : 'Submit Team Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
