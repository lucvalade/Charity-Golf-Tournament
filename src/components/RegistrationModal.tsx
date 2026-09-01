import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PRICING_RULES, EVENT_DETAILS } from '../data/initialData';
import { RegistrationType, AddonSelection, PlayerInfo, RegistrationRecord } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Users, User, Trophy, Ticket, CheckCircle, CreditCard, ChevronRight, ChevronLeft, Sparkles, Printer, Download, MapPin, Calendar, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegistrationModal: React.FC = () => {
  const {
    isRegModalOpen,
    setIsRegModalOpen,
    selectedRegType,
    registerTeamOrPlayer,
    calculateAddonTotal,
    calculateRegistrationTotal,
    lastConfirmation,
    setLastConfirmation
  } = useTournament();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [regType, setRegType] = useState<RegistrationType>(selectedRegType || 'foursome');
  const [teamName, setTeamName] = useState('');

  // Primary Contact
  const [primaryPlayer, setPrimaryPlayer] = useState<PlayerInfo>({
    id: `p-${Date.now()}-1`,
    name: '',
    email: '',
    phone: '',
    handicap: '',
    shirtSize: 'L',
    dietaryRestrictions: ''
  });

  // Additional 3 players for foursome
  const [additionalPlayers, setAdditionalPlayers] = useState<PlayerInfo[]>([
    { id: `p-${Date.now()}-2`, name: '', email: '', phone: '', handicap: '', shirtSize: 'L' },
    { id: `p-${Date.now()}-3`, name: '', email: '', phone: '', handicap: '', shirtSize: 'XL' },
    { id: `p-${Date.now()}-4`, name: '', email: '', phone: '', handicap: '', shirtSize: 'M' }
  ]);

  // Add-ons
  const [addons, setAddons] = useState<AddonSelection>({
    mulligansCount: 3, // default bundle of 3
    rafflePacks10: 1,
    rafflePacks25: 0,
    puttingContestCount: 2,
    tigerDriveCount: 2
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'check' | 'invoice'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);

  useEffect(() => {
    if (selectedRegType) {
      setRegType(selectedRegType);
    }
  }, [selectedRegType]);

  if (!isRegModalOpen) return null;

  const totalAmount = calculateRegistrationTotal(regType, addons);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // validate primary contact
      if (!primaryPlayer.name.trim() || !primaryPlayer.email.trim() || !primaryPlayer.phone.trim()) {
        alert('Please fill in the primary contact name, email, and phone number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const created = registerTeamOrPlayer({
        type: regType,
        teamName: regType === 'foursome' ? (teamName.trim() || `${primaryPlayer.name}'s Foursome`) : undefined,
        primaryContact: primaryPlayer,
        additionalPlayers: regType === 'foursome' ? additionalPlayers : [],
        addons,
        paymentMethod
      });

      setIsProcessing(false);
      setConfirmedRecord(created);
      setStep(5);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 700);
  };

  const handleClose = () => {
    setIsRegModalOpen(false);
    setStep(1);
    setConfirmedRecord(null);
  };

  const updateAdditionalPlayer = (index: number, field: keyof PlayerInfo, value: string) => {
    const updated = [...additionalPlayers];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalPlayers(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-[#1E4D2B] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-200 tracking-wider">
                Digital Registration Card • September 2026
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-white">
                {step === 5 ? 'Registration Confirmed!' : 'Charity Golf Classic Entry'}
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

        {/* Stepper Progress Bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1E4D2B] font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-300 text-slate-600'}`}>1</span>
              <span>Entry Type</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1E4D2B] font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-300 text-slate-600'}`}>2</span>
              <span>Player Roster</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#1E4D2B] font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-300 text-slate-600'}`}>3</span>
              <span>Add-Ons</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#1E4D2B] font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-300 text-slate-600'}`}>4</span>
              <span>Checkout</span>
            </div>
          </div>
        )}

        {/* STEP 1: Entry Type Selection */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Registration Format
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRegType('foursome')}
                  className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    regType === 'foursome'
                      ? 'border-[#1E4D2B] bg-emerald-50/60 ring-2 ring-[#1E4D2B]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                    <Users className="w-5 h-5 text-[#1E4D2B]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">Tournament Foursome</h4>
                    <p className="text-xs text-slate-500 mt-0.5">4 Golfers &bull; 2 Carts &bull; Scramble</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#1E4D2B] font-mono">${PRICING_RULES.foursomeTeam}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Save $50</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegType('individual')}
                  className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    regType === 'individual'
                      ? 'border-[#1E4D2B] bg-emerald-50/60 ring-2 ring-[#1E4D2B]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Single Entry
                    </span>
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">Individual Golfer</h4>
                    <p className="text-xs text-slate-500 mt-0.5">1 Golfer &bull; Paired on Game Day</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">${PRICING_RULES.individualGolfer}</span>
                    <span className="text-xs text-slate-500">Per Player</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegType('dinner_only')}
                  className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    regType === 'dinner_only'
                      ? 'border-[#1E4D2B] bg-emerald-50/60 ring-2 ring-[#1E4D2B]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Supporter
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">Dinner Only</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Cocktail Hour & Awards Banquet</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">${PRICING_RULES.dinnerOnly}</span>
                    <span className="text-xs text-slate-500">Per Guest</span>
                  </div>
                </button>
              </div>
            </div>

            {regType === 'foursome' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Team / Foursome Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fairway Eagles, Apex Golfers, The Bogeymen"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>{regType === 'dinner_only' ? 'Continue to Guest Details' : 'Continue to Golfer Details'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Golfer Info & Roster */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Primary Golfer */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E4D2B] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {regType === 'dinner_only' ? 'Guest & Supporter Details (Contact) *' : 'Primary Golfer / Team Captain (Contact) *'}
                  </h4>
                </div>
                <span className="text-[11px] text-[#1E4D2B] font-semibold">Receives Confirmation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saied Mohammed"
                    value={primaryPlayer.name}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="saied@example.com"
                    value={primaryPlayer.email}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={primaryPlayer.phone}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Handicap / GHIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 10.4 or Est."
                    value={primaryPlayer.handicap || ''}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, handicap: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shirt / Glove Size</label>
                  <select
                    value={primaryPlayer.shirtSize}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, shirtSize: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="2XL">2X-Large (2XL)</option>
                    <option value="3XL">3X-Large (3XL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dietary Needs</label>
                  <input
                    type="text"
                    placeholder="e.g. Halal, Vegan, Gluten-Free"
                    value={primaryPlayer.dietaryRestrictions || ''}
                    onChange={(e) => setPrimaryPlayer({ ...primaryPlayer, dietaryRestrictions: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                  />
                </div>
              </div>
            </div>

            {/* Additional 3 Golfers if Foursome */}
            {regType === 'foursome' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Foursome Teammates (Can be updated later if TBD)
                  </h4>
                  <span className="text-xs text-slate-500">Players 2, 3, & 4</span>
                </div>

                {additionalPlayers.map((player, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                        {idx + 2}
                      </span>
                      <span className="font-semibold text-xs text-slate-800">Golfer #{idx + 2}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Golfer Name (or TBD)"
                          value={player.name}
                          onChange={(e) => updateAdditionalPlayer(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email (Optional)"
                          value={player.email}
                          onChange={(e) => updateAdditionalPlayer(idx, 'email', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Handicap"
                          value={player.handicap || ''}
                          onChange={(e) => updateAdditionalPlayer(idx, 'handicap', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Select Add-Ons & Mulligans</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Add-On Inventory Selection */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-900 font-serif-heading">
                Customize Tournament Day Add-Ons
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Every add-on directly increases our donation total for cancer patient assistance.
              </p>
            </div>

            <div className="space-y-4">
              {/* Mulligans */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Tournament Mulligans</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      3 for $50 Bundle (Save $10)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    $20 each or $50 for a 3-pack. Extra tee shots or putts on any hole!
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, mulligansCount: Math.max(0, addons.mulligansCount - 1) })}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold font-mono text-slate-900">
                      {addons.mulligansCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, mulligansCount: addons.mulligansCount + 1 })}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Mega Raffle Packs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Charity Mega Raffle Packs</span>
                    <Ticket className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Win signed sports memorabilia, luxury golf getaways, TaylorMade clubs, and fine dining packages.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 mb-0.5">10 Tickets ($25)</span>
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setAddons({ ...addons, rafflePacks10: Math.max(0, addons.rafflePacks10 - 1) })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold font-mono">{addons.rafflePacks10}</span>
                      <button
                        type="button"
                        onClick={() => setAddons({ ...addons, rafflePacks10: addons.rafflePacks10 + 1 })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-emerald-700 font-bold mb-0.5">25 Tickets ($50)</span>
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setAddons({ ...addons, rafflePacks25: Math.max(0, addons.rafflePacks25 - 1) })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold font-mono">{addons.rafflePacks25}</span>
                      <button
                        type="button"
                        onClick={() => setAddons({ ...addons, rafflePacks25: addons.rafflePacks25 + 1 })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Putting Contest & Tiger Drive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Putting Shootout ($20)</span>
                    <p className="text-[11px] text-slate-500">$5,000 Putt finalist entry</p>
                  </div>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, puttingContestCount: Math.max(0, addons.puttingContestCount - 1) })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold font-mono">{addons.puttingContestCount}</span>
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, puttingContestCount: addons.puttingContestCount + 1 })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Tiger Drive Hole #11 ($25)</span>
                    <p className="text-[11px] text-slate-500">Tee off from 150yd fairway marker</p>
                  </div>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, tigerDriveCount: Math.max(0, addons.tigerDriveCount - 1) })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold font-mono">{addons.tigerDriveCount}</span>
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, tigerDriveCount: addons.tigerDriveCount + 1 })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtotal preview */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-semibold">Registration + Selected Add-Ons:</span>
                <div className="text-xs text-emerald-600">All proceeds benefit {EVENT_DETAILS.beneficiaryOrg}</div>
              </div>
              <div className="text-2xl font-extrabold text-[#1E4D2B] font-mono">
                ${totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Review & Payment Checkout */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Order Summary Column */}
              <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-200">
                  Registration Summary
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {regType === 'foursome'
                        ? 'Tournament Foursome Team'
                        : regType === 'dinner_only'
                        ? 'Awards Dinner & Banquet Pass'
                        : 'Individual Golfer Entry'}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ${regType === 'foursome'
                        ? PRICING_RULES.foursomeTeam
                        : regType === 'dinner_only'
                        ? PRICING_RULES.dinnerOnly
                        : PRICING_RULES.individualGolfer}
                    </span>
                  </div>

                  {addons.mulligansCount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{addons.mulligansCount}x Mulligans</span>
                      <span className="font-mono font-semibold">
                        ${Math.floor(addons.mulligansCount / 3) * 50 + (addons.mulligansCount % 3) * 20}
                      </span>
                    </div>
                  )}

                  {addons.rafflePacks10 > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{addons.rafflePacks10}x 10-Raffle Packs</span>
                      <span className="font-mono font-semibold">${addons.rafflePacks10 * 25}</span>
                    </div>
                  )}

                  {addons.rafflePacks25 > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{addons.rafflePacks25}x 25-Raffle Packs</span>
                      <span className="font-mono font-semibold">${addons.rafflePacks25 * 50}</span>
                    </div>
                  )}

                  {addons.puttingContestCount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{addons.puttingContestCount}x Putting Shootout</span>
                      <span className="font-mono font-semibold">${addons.puttingContestCount * 20}</span>
                    </div>
                  )}

                  {addons.tigerDriveCount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{addons.tigerDriveCount}x Tiger Drive #11</span>
                      <span className="font-mono font-semibold">${addons.tigerDriveCount * 25}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Total Due:</span>
                  <span className="text-2xl font-extrabold text-[#1E4D2B] font-mono">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Details Column */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#1E4D2B]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Payment Method
                  </span>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('check')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'check'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Mail Check
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('invoice')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'invoice'
                        ? 'border-[#1E4D2B] bg-emerald-50 text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Company Invoice
                  </button>
                </div>

                {paymentMethod === 'credit_card' ? (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Payment Instructions:</strong> Please make checks payable to <em>"{EVENT_DETAILS.beneficiaryOrg}"</em> with memo line: <em>{primaryPlayer.name} - Golf 2026</em>. Mail to tournament office or bring on tournament morning.
                  </div>
                )}

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span>100% of registration net fees go directly to oncology patient relief.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Confirming Registration...' : `Pay $${totalAmount.toLocaleString()} & Confirm`}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Digital Golfer Pass & Confirmation */}
        {step === 5 && confirmedRecord && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-[#1E4D2B] tracking-wider">
                Registration Confirmed &bull; See You on the Green
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading mt-1">
                Welcome to the 2026 Memorial Classic!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                A confirmation has been sent to <strong>{confirmedRecord.primaryContact.email}</strong>. Please present this digital golfer pass at the clubhouse check-in desk.
              </p>
            </div>

            {/* Printable Digital Player/Guest Pass */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-[#1E4D2B] to-[#13301B] text-white p-6 rounded-2xl shadow-xl border border-[#D4AF37]/50 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-slate-950 text-[10px] font-black uppercase rounded-bl-lg">
                {confirmedRecord.type === 'dinner_only' ? 'OFFICIAL DINNER GUEST PASS' : 'OFFICIAL PLAYER PASS'}
              </div>

              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-200">Tournament Pass</div>
                  <div className="text-sm font-bold font-crest">SAIED OCTOBER CHARITY</div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={`SAIED-GOLF-PASS:${confirmedRecord.confirmationCode}`}
                    size={64}
                    level="M"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-emerald-700/80 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {confirmedRecord.type === 'dinner_only' ? 'Guest Name:' : 'Golfer / Captain:'}
                  </span>
                  <span className="font-bold text-white">{confirmedRecord.primaryContact.name}</span>
                </div>
                {confirmedRecord.teamName && (
                  <div className="flex justify-between">
                    <span className="text-slate-300">Team:</span>
                    <span className="font-bold text-amber-300">{confirmedRecord.teamName}</span>
                  </div>
                )}
                {confirmedRecord.type !== 'dinner_only' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Starting Hole:</span>
                      <span className="font-mono font-bold text-emerald-300">Hole #{confirmedRecord.assignedStartingHole}A (Shotgun 12:30 PM)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Cart Assignment:</span>
                      <span className="font-mono font-bold text-white">{confirmedRecord.assignedCart}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-slate-300">Access Level:</span>
                    <span className="font-mono font-bold text-amber-300">5:00 PM Cocktail Hour & Awards Banquet</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-300">Confirmation Code:</span>
                  <span className="font-mono font-bold text-[#D4AF37] text-sm">{confirmedRecord.confirmationCode}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-700/80 flex items-center justify-between text-[11px] text-slate-300">
                <span>Squabbit Code: <strong>{EVENT_DETAILS.squabbitCode}</strong></span>
                <span>Friday, Sept 18, 2026</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Golfer Pass</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
