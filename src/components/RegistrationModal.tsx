import React, { useState, useEffect, useMemo } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PRICING_RULES, EVENT_DETAILS } from '../data/initialData';
import { RegistrationType, AddonSelection, PlayerInfo, RegistrationRecord } from '../types';
import {
  formatTitleCase,
  formatCanadianPostalCode,
  isValidCanadianPostalCode
} from '../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  User,
  CheckCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Printer,
  Heart,
  ShieldCheck,
  Copy,
  AlertCircle,
  Mail,
  FileText,
  Send,
  Banknote
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone.trim());
};

export interface RegistrationModalProps {
  inline?: boolean;
  onClose?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ inline = false, onClose }) => {
  const {
    isRegModalOpen,
    setIsRegModalOpen,
    selectedRegType,
    registerTeamOrPlayer,
    calculateRegistrationTotal,
    openDonationModal,
    registrations,
    isAdminAuthenticated,
    regModalInitialStep,
    addToast
  } = useTournament();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [regType, setRegType] = useState<RegistrationType>(
    selectedRegType && selectedRegType !== 'foursome' ? selectedRegType : 'individual'
  );

  // Primary Contact
  const [primaryPlayer, setPrimaryPlayer] = useState<PlayerInfo>({
    id: `p-${Date.now()}-1`,
    name: '',
    email: '',
    phone: '',
    dietaryRestrictions: ''
  });

  // "I would like to play with (First & Last Name)" - 3 additional text areas
  const [requestedTeammates, setRequestedTeammates] = useState<string[]>(['', '', '']);

  // Receipt option
  const [needReceipt, setNeedReceipt] = useState(false);
  const [receiptAddress, setReceiptAddress] = useState('');
  const [receiptCity, setReceiptCity] = useState('');
  const [receiptProvince, setReceiptProvince] = useState('');
  const [receiptPostalCode, setReceiptPostalCode] = useState('');

  // Add-ons (Default zero since Add-Ons tab is removed)
  const [addons] = useState<AddonSelection>({
    mulligansCount: 0,
    rafflePacks10: 0,
    rafflePacks25: 0,
    puttingContestCount: 0,
    tigerDriveCount: 0
  });

  // Google Workspace SMTP Settings State
  const [smtpPassword, setSmtpPassword] = useState(() => {
    return localStorage.getItem('fb_smtp_pass') || '';
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [smtpStatusMsg, setSmtpStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [emailSendResult, setEmailSendResult] = useState<{
    attempted: boolean;
    success: boolean;
    message?: string;
  } | null>(null);

  // Payment Method Selection (Cheque, Interac e-Transfer, Cash) - NO Credit Card
  const [paymentMethod, setPaymentMethod] = useState<'cheque' | 'etransfer' | 'cash'>('cheque');
  const [golferEmailPreviewMethod, setGolferEmailPreviewMethod] = useState<'cheque' | 'etransfer' | 'cash'>('cheque');
  const [emailPreviewMode, setEmailPreviewMode] = useState<'formatted' | 'text'>('formatted');
  const [copiedGolferEmail, setCopiedGolferEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);
  const [copiedDetails, setCopiedDetails] = useState(false);

  // Golfer Classification state (Member $100 vs Other $120)
  const [golferType, setGolferType] = useState<'member' | 'other'>('member');

  // Inline Validation Errors
  const [rosterErrors, setRosterErrors] = useState<{ [key: string]: string }>({});
  const [receiptErrors, setReceiptErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setGolferEmailPreviewMethod(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    if (isRegModalOpen) {
      setStep(regModalInitialStep || 1);
    }
    if (selectedRegType && selectedRegType !== 'foursome') {
      setRegType(selectedRegType);
    } else {
      setRegType('individual');
    }
  }, [selectedRegType, isRegModalOpen, regModalInitialStep]);

  // Sync SMTP config from backend
  useEffect(() => {
    fetch('/api/smtp-config')
      .then((r) => r.json())
      .then((data) => {
        if (data.hasPassword && !smtpPassword) {
          // password already present in server environment
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSmtpPassword = async () => {
    if (!smtpPassword.trim()) {
      setSmtpStatusMsg({ text: 'Please enter a password before saving.', isError: true });
      return;
    }
    setIsSavingSmtp(true);
    setSmtpStatusMsg(null);
    try {
      localStorage.setItem('fb_smtp_pass', smtpPassword.trim());
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: smtpPassword.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSmtpStatusMsg({ text: 'Password saved to backend and browser storage.', isError: false });
      } else {
        setSmtpStatusMsg({ text: data.error || 'Saved in browser storage.', isError: false });
      }
    } catch (e: any) {
      setSmtpStatusMsg({ text: 'Saved in browser storage.', isError: false });
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleTestSmtpConnection = async () => {
    if (!smtpPassword.trim()) {
      setSmtpStatusMsg({ text: 'Please enter a password to test connection.', isError: true });
      return;
    }
    setIsTestingSmtp(true);
    setSmtpStatusMsg(null);
    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: smtpPassword.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSmtpStatusMsg({
          text: 'Connected successfully to smtp.gmail.com:587 as sales@aiopenhouseconnect.com!',
          isError: false
        });
      } else {
        setSmtpStatusMsg({
          text: data.error || 'Connection failed. Verify your password or App Password.',
          isError: true
        });
      }
    } catch (e: any) {
      setSmtpStatusMsg({ text: e.message || 'Server connection error.', isError: true });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Check if an existing registrant requested to play with this golfer's name
  const pairingInvitation = useMemo(() => {
    const trimmedName = primaryPlayer.name.trim().toLowerCase();
    if (!trimmedName || trimmedName.length < 3) return null;

    for (const reg of registrations) {
      if (reg.requestedTeammates && Array.isArray(reg.requestedTeammates)) {
        const found = reg.requestedTeammates.some(
          (tm) => tm && tm.trim().toLowerCase() === trimmedName
        );
        if (found) {
          return reg.primaryContact?.name || 'A registered golfer';
        }
      }
    }
    return null;
  }, [primaryPlayer.name, registrations]);

  const totalAmount = useMemo(
    () => calculateRegistrationTotal(regType, addons, golferType),
    [calculateRegistrationTotal, regType, addons, golferType]
  );

  const getGolferEmailData = (method: 'cheque' | 'cash' | 'etransfer', record?: RegistrationRecord | null) => {
    const golferName = record ? record.primaryContact.name : (primaryPlayer.name.trim() || 'Valued Participant');
    const golferEmail = record ? record.primaryContact.email : (primaryPlayer.email.trim() || 'golfer@example.com');
    const totalDue = record ? record.totalAmount.toLocaleString() : totalAmount.toLocaleString();
    const code = record ? record.confirmationCode : 'FB-2026-SAMPLE';
    const isDinner = (record ? record.type : regType) === 'dinner_only';
    const recGolferType = record ? record.golferType : golferType;
    const packageTitle = isDinner
      ? 'Dinner Guest Pass ($60)'
      : recGolferType === 'member'
      ? 'Green Fee & Cart Package - Member ($100)'
      : 'Green Fee & Cart Package - Other ($120)';
    const teammates = (record ? record.requestedTeammates : requestedTeammates) || [];
    const teammatesList = teammates.filter(Boolean);
    const teammatesStr = teammatesList.length > 0
      ? teammatesList.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n')
      : '  None specified (we will pair you with friendly tournament players)';
    const receiptReq = record ? record.receiptInfo?.needed : needReceipt;
    const taxAddress = receiptReq
      ? (record
          ? `${record.receiptInfo?.address || ''}, ${record.receiptInfo?.city || ''}, ${record.receiptInfo?.province || ''} ${record.receiptInfo?.postalCode || ''}`
          : `${receiptAddress || ''}, ${receiptCity || ''}, ${receiptProvince || ''} ${receiptPostalCode || ''}`)
      : 'Not requested';

    let subject = '';
    let methodBadge = '';
    let actionHighlights: { label: string; value: string }[] = [];
    let paymentInstructions = '';

    if (method === 'cheque') {
      subject = `Registration Confirmation & Cheque Payment Instructions • 2026 Fragrant Breeze Golf Classic [Code: ${code}]`;
      methodBadge = 'Cheque (Payable to Saied Mohammed)';
      actionHighlights = [
        { label: 'Payable To', value: 'Saied Mohammed' },
        { label: 'Total Amount', value: `$${totalDue} CAD` },
        { label: 'Cheque Memo Line', value: `2026 Memorial Golf - ${golferName}` },
        { label: 'Payment Timing', value: 'Bring to 9:30 AM check-in desk on Monday, Oct 5, 2026 or mail in advance' },
        { label: 'Status', value: 'Spot Reserved (Pending cheque presentation at check-in)' }
      ];
      paymentInstructions = `=======================================================
CHEQUE PAYMENT INSTRUCTIONS FOR THE GOLFER
=======================================================
• Make Cheque Payable To: Saied Mohammed
• Total Amount: $${totalDue} CAD
• Cheque Memo Line: 2026 Memorial Golf - ${golferName}
• Delivery Options:
  Option 1 (Recommended): Bring your cheque directly to the 9:30 AM registration desk on tournament morning (Monday, October 5, 2026) at Burford Golf Links Course.
  Option 2: Mail or hand-deliver your cheque in advance to tournament founder Saied Mohammed.
• What Happens at Check-In:
  Present your confirmation code [${code}] at the registration table. Our desk team will record your payment, hand you your player gift bag, driving range pass, dinner wristband, and cart assignment!
• Status: SPOT RESERVED (Pending cheque presentation at check-in)`;
    } else if (method === 'cash') {
      subject = `Registration Confirmation & Cash Check-In Instructions • 2026 Fragrant Breeze Golf Classic [Code: ${code}]`;
      methodBadge = 'Cash (Bring to Event Check-In)';
      actionHighlights = [
        { label: 'Payment Method', value: 'Cash (Bring to Event Check-In)' },
        { label: 'Total Amount Due', value: `$${totalDue} CAD (Exact amount appreciated)` },
        { label: 'When to Pay', value: 'Monday, Oct 5, 2026 at 9:30 AM registration desk (or prior to Saied)' },
        { label: 'Desk Receipt', value: 'Signed physical receipt and gift bag issued upon payment at check-in' },
        { label: 'Status', value: 'Spot Reserved (Pending cash payment at check-in)' }
      ];
      paymentInstructions = `=======================================================
CASH PAYMENT INSTRUCTIONS FOR THE GOLFER
=======================================================
• Total Amount Due: $${totalDue} CAD (Exact cash is appreciated)
• Payment Timing: Bring cash to the registration desk on tournament morning (Monday, October 5, 2026 starting at 9:30 AM) at Burford Golf Links Course, or pay prior to tournament founder Saied Mohammed.
• What Happens at Check-In:
  Present your confirmation code [${code}] at the desk. Our welcome team will provide a signed physical cash receipt, your player credentials, raffle tickets, and golf cart keys.
• Status: SPOT RESERVED (Pending cash payment at check-in)`;
    } else {
      subject = `Registration Confirmation & Interac e-Transfer Instructions • 2026 Fragrant Breeze Golf Classic [Code: ${code}]`;
      methodBadge = 'Interac e-Transfer (fragrant.breeze2023@gmail.com)';
      actionHighlights = [
        { label: 'Send e-Transfer To', value: 'fragrant.breeze2023@gmail.com' },
        { label: 'Recipient Name', value: 'Saied Mohammed' },
        { label: 'Transfer Amount', value: `$${totalDue} CAD` },
        { label: 'Fee Allocation Breakdown', value: `$30 Charitable Donation + ${totalDue === 100 ? '$70' : '$90'} Golf Course & Cart Fees` },
        { label: 'Required Memo / Note', value: `2026 Memorial Golf - ${golferName} - ${code}` },
        { label: 'Security Question', value: 'Auto-deposit enabled (If prompted: Q: Tournament / A: Memorial2026)' }
      ];
      paymentInstructions = `=======================================================
INTERAC E-TRANSFER INSTRUCTIONS FOR THE GOLFER
=======================================================
• Open your online banking app and initiate an Interac e-Transfer.
• Recipient Name: Saied Mohammed
• Recipient Email: fragrant.breeze2023@gmail.com
• Transfer Amount: $${totalDue} CAD
• Fee Breakdown: Out of your $${totalDue} fee, $30 is the actual charitable donation amount ($30 to charity, ${totalDue === 100 ? '$70' : '$90'} to golf fees).
• Required Memo / Message: 2026 Memorial Golf - ${golferName} - ${code}
• Security Question / Answer:
  Auto-deposit is typically enabled. If your bank requires a security question:
  Question: "Tournament"
  Answer: "Memorial2026"
• Status: PENDING E-TRANSFER (Your spot is reserved; marked completed as soon as transfer is confirmed)`;
    }

    const fullPlainText = `FROM: Fragrant Breeze Golf Tournament <sales@aiopenhouseconnect.com>
TO: ${golferName} <${golferEmail}>
DATE: ${new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
SUBJECT: ${subject}

Dear ${golferName},

Thank you for registering for the 6th Annual Fragrant Breeze Golf Tournament in loving memory of Naseem Mohammed. We are delighted to confirm your entry!

Here is your complete registration record and instructions for completing your payment via ${methodBadge}:

=======================================================
REGISTRATION CONFIRMATION SUMMARY
=======================================================
• Confirmation Code: ${code}
• Golfer / Guest: ${golferName}
• Email: ${golferEmail}
• Entry Package: ${packageTitle}
• Total Amount: $${totalDue} CAD
• Payment Method: ${methodBadge}
• Tournament Date: Monday, October 5, 2026
• Location: Burford Golf Links Course (120 Golf Links Rd., Burford, ON)
• Assigned Starting Hole: Hole #1A (Cart TBA)
• Requested Teammates:
${teammatesStr}
• Charitable Tax Receipt Address: ${taxAddress}

${paymentInstructions}

=======================================================
TOURNAMENT DAY ITINERARY (MONDAY, OCTOBER 5, 2026)
=======================================================
• 9:30 AM: Registration, Practice Range Access, & Gift Bag Pickup
• 11:00 AM: Shotgun Start (18 Holes, dynamic 6-6-6 Swapping Partners format)
• 4:00 PM: FABULOUS Turkey Dinner & Awards Banquet

=======================================================
CONTACT & QUESTIONS
=======================================================
If you have any questions or need to make adjustments:
• Tournament Founder: Saied Mohammed (fragrant.breeze2023@gmail.com)
• Tournament Administrator: Luc Valade (luc.valade@gmail.com)

Thank you for your generous support of Hamilton Health Sciences Foundation & Juravinski Cancer Centre in honor of Naseem Mohammed. See you on the green!

Warm regards,
The Fragrant Breeze Tournament Committee
Burford Golf Links Course • October 5, 2026
`;

    return {
      subject,
      methodBadge,
      actionHighlights,
      paymentInstructions,
      fullPlainText,
      golferName,
      golferEmail,
      totalDue,
      code,
      packageTitle,
      teammatesList,
      receiptReq,
      taxAddress
    };
  };

  const sampleEmailText = useMemo(() => {
    return getGolferEmailData(paymentMethod).fullPlainText;
  }, [paymentMethod, regType, totalAmount, primaryPlayer, requestedTeammates, needReceipt, receiptAddress, receiptCity, receiptProvince, receiptPostalCode]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Validate Primary Player
      const errors: { [key: string]: string } = {};

      if (!primaryPlayer.name.trim()) {
        errors.name = 'Full name is required (first & last name capitalized).';
      }

      if (!primaryPlayer.email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!isValidEmail(primaryPlayer.email)) {
        errors.email = 'Please enter a valid email address with @ and domain (e.g. name@example.com).';
      }

      if (!primaryPlayer.phone.trim()) {
        errors.phone = 'Phone number is required in (###) ###-#### format.';
      } else if (!isValidPhone(primaryPlayer.phone)) {
        errors.phone = 'Phone format must be exactly (###) ###-####';
      }

      if (Object.keys(errors).length > 0) {
        setRosterErrors(errors);
        return;
      }
      setRosterErrors({});

      // Validate Receipt fields if activated
      if (needReceipt) {
        const rErrors: { [key: string]: string } = {};
        if (!receiptAddress.trim()) {
          rErrors.address = 'Street address is required for your official tax receipt.';
        }
        if (!receiptCity.trim()) {
          rErrors.city = 'City is required (first letter capitalized).';
        }
        if (!receiptProvince.trim()) {
          rErrors.province = 'Province is required (first letter capitalized).';
        }
        if (!receiptPostalCode.trim()) {
          rErrors.postalCode = 'Canada postal code is required (Format: A1A 1A1).';
        } else if (!isValidCanadianPostalCode(receiptPostalCode)) {
          rErrors.postalCode = 'Invalid postal code format. Use alternating ANA NAN with single space (e.g. L8P 4S6), no hyphens.';
        }

        if (Object.keys(rErrors).length > 0) {
          setReceiptErrors(rErrors);
          return;
        }
      }
      setReceiptErrors({});
      setStep(3);
    }
  };

  const generateSaiedEmailText = (rec: RegistrationRecord, total: number) => {
    const methodLabel =
      rec.paymentMethod === 'cheque'
        ? 'CHEQUE (Payable to Saied Mohammed)'
        : rec.paymentMethod === 'cash'
        ? 'CASH (Bring it to the event)'
        : 'INTERAC E-TRANSFER';

    return `ATTENTION: Luc Valade (luc.valade@gmail.com)
TOURNAMENT: Fragrant Breeze Golf Tournament (Fragrant Breeze Memorial Classic)
PRE-LAUNCH ROUTING: Registration routed to Luc Valade (luc.valade@gmail.com)
FOUNDER: Saied Mohammed (fragrant.breeze2023@gmail.com)

NEW GOLFER REGISTRATION RECEIVED (${methodLabel})

=======================================================
REGISTRATION SUMMARY
=======================================================
Confirmation Code: ${rec.confirmationCode}
Entry Type: ${rec.type === 'dinner_only' ? 'Dinner Guest Pass ($60)' : rec.golferType === 'member' ? 'Green Fee & Cart Package - Member ($100)' : 'Green Fee & Cart Package - Other ($120)'}
Payment Method: ${methodLabel}
Payment Status: PENDING RECEIPT BY SAIED MOHAMMED
Total Amount Due: $${total.toLocaleString()} CAD
Registration Date: ${new Date(rec.registeredAt).toLocaleString()}
Starting Hole: Hole #${rec.assignedStartingHole}A
Assigned Cart: ${rec.assignedCart}

=======================================================
PRIMARY GOLFER / CONTACT DETAILS
=======================================================
Full Name: ${rec.primaryContact.name}
Email: ${rec.primaryContact.email}
Phone: ${rec.primaryContact.phone}
Dietary Restrictions: ${rec.primaryContact.dietaryRestrictions || 'None'}

${
  rec.requestedTeammates && rec.requestedTeammates.filter(Boolean).length > 0
    ? `=======================================================
REQUESTED FOURSOME TEAMMATES ("I would like to play with:")
=======================================================
${rec.requestedTeammates.filter(Boolean).map((n, i) => `${i + 1}. ${n}`).join('\n')}
`
    : ''
}

${
  rec.receiptInfo?.needed
    ? `=======================================================
OFFICIAL TAX RECEIPT MAILING ADDRESS
=======================================================
Street Address: ${rec.receiptInfo.address || 'N/A'}
City: ${rec.receiptInfo.city || 'N/A'}
Province: ${rec.receiptInfo.province || 'N/A'}
Postal Code: ${rec.receiptInfo.postalCode || 'N/A'}
`
    : 'Official Tax Receipt Requested: No'
}

=======================================================
PAYMENT INSTRUCTIONS
=======================================================
${
  rec.paymentMethod === 'cheque'
    ? `Make Cheque Payable To: Saied Mohammed
Memo Line: 2026 Memorial Golf
Total Amount: $${total.toLocaleString()} CAD
Mail to Saied Mohammed or present at the 9:30 AM registration desk.`
    : rec.paymentMethod === 'cash'
    ? `Cash Payment Selected:
Bring cash to the 9:30 AM event check-in desk or prior to Saied Mohammed.
Memo Line: 2026 Memorial Golf
Total Amount: $${total.toLocaleString()} CAD`
    : `Interac e-Transfer Instructions:
Send e-Transfer to: fragrant.breeze2023@gmail.com
Total Amount: $${total.toLocaleString()} CAD
Memo / Transfer Note: 2026 Memorial Golf
Status: PENDING RECEIPT BY SAIED MOHAMMED`
}

*All registration records are logged in the tournament database.*`;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const created = registerTeamOrPlayer({
      type: regType,
      golferType: regType === 'dinner_only' ? undefined : golferType,
      primaryContact: primaryPlayer,
      additionalPlayers: [],
      requestedTeammates: requestedTeammates.filter(Boolean),
      receiptInfo: {
        needed: needReceipt,
        address: needReceipt ? receiptAddress : undefined,
        city: needReceipt ? receiptCity : undefined,
        province: needReceipt ? receiptProvince : undefined,
        postalCode: needReceipt ? receiptPostalCode : undefined
      },
      addons,
      paymentMethod
    });

    // Send the email in the backend to Saied Mohammed (fragrant.breeze2023@gmail.com) via Google Workspace Gmail SMTP
    let emailSuccess = false;
    let emailErrorMsg = '';

    try {
      const resp = await fetch('/api/send-registration-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration: created,
          totalAmount,
          customPassword: smtpPassword.trim(),
          recipientEmail: 'luc.valade@gmail.com'
        })
      });
      const data = await resp.json();
      if (data.success) {
        emailSuccess = true;
      } else {
        emailErrorMsg = data.error || 'SMTP delivery could not complete';
      }
    } catch (err: any) {
      emailErrorMsg = err?.message || 'Server connection error';
    }

    setEmailSendResult({
      attempted: true,
      success: emailSuccess,
      message: emailSuccess
        ? 'Email dispatched to tournament administrator Luc Valade (luc.valade@gmail.com) via Google Workspace Gmail SMTP'
        : emailErrorMsg
    });

    setIsProcessing(false);
    setConfirmedRecord(created);
    setStep(4);
    resetFormFields();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const resetFormFields = () => {
    setPrimaryPlayer({
      id: `p-${Date.now()}-1`,
      name: '',
      email: '',
      phone: '',
      dietaryRestrictions: ''
    });
    setRequestedTeammates(['', '', '']);
    setNeedReceipt(false);
    setReceiptAddress('');
    setReceiptCity('');
    setReceiptProvince('');
    setReceiptPostalCode('');
    setPaymentMethod('cheque');
    setRosterErrors({});
    setReceiptErrors({});
  };

  const handleClose = () => {
    if (onClose) onClose();
    setIsRegModalOpen(false);
    setStep(1);
    setConfirmedRecord(null);
    setRosterErrors({});
    setReceiptErrors({});
    setEmailSendResult(null);
    resetFormFields();
  };

  if (!inline && !isRegModalOpen) return null;

  return (
    <div
      id="inline-registration-container"
      className={
        inline
          ? "w-full lg:w-[75%] max-w-5xl mx-auto my-8 scroll-mt-28"
          : "fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:py-10"
      }
    >
      <div
        className={
          inline
            ? "bg-white rounded-3xl w-full overflow-hidden shadow-2xl border-2 border-[#1E4D2B] relative animate-in fade-in slide-in-from-top-4 duration-300"
            : "bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-auto"
        }
      >
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-5 sm:p-6 relative flex flex-col">
          <button
            onClick={handleClose}
            className={
              inline
                ? "mb-4 self-end px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/20"
                : "mb-3 sm:absolute sm:top-4 sm:right-4 p-2 rounded-full hover:bg-white/20 text-white transition cursor-pointer self-end sm:self-auto"
            }
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            {inline && <span>Hide Form</span>}
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Fragrant Breeze Golf Tournament Entry</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-heading">
            {step === 4 ? 'Registration Confirmed' : 'Digital Registration Card • October 2026'}
          </h3>
          <div className="sm:hidden flex items-center gap-2 text-amber-300 text-[10px] font-semibold uppercase tracking-wider mt-2">
            <Sparkles className="w-3 h-3" />
            <span>Fragrant Breeze Golf Tournament Entry</span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Honoring {EVENT_DETAILS.memorialHonoree} &bull; Benefiting {EVENT_DETAILS.beneficiaryOrg}
          </p>

          {/* Stepper Progress: Sky Blue for completed steps, Gold for current active step */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-emerald-800/80 text-xs">
              {/* Step 1 */}
              <div
                className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 transition text-xs ${
                  step > 1
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/60 font-semibold shadow-xs'
                    : step === 1
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] text-[#0F2D17] font-extrabold shadow-sm ring-1 ring-[#D4AF37]'
                    : 'text-emerald-300/50 bg-emerald-950/40 border border-emerald-800/40'
                }`}
              >
                {step > 1 ? (
                  <CheckCircle className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#0F2D17] text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                )}
                <span>1. Card Format</span>
              </div>

              <span className="text-emerald-400/40">&bull;</span>

              {/* Step 2 */}
              <div
                className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 transition text-xs ${
                  step > 2
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/60 font-semibold shadow-xs'
                    : step === 2
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] text-[#0F2D17] font-extrabold shadow-sm ring-1 ring-[#D4AF37]'
                    : 'text-emerald-300/50 bg-emerald-950/40 border border-emerald-800/40'
                }`}
              >
                {step > 2 ? (
                  <CheckCircle className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    step === 2 ? 'bg-[#0F2D17] text-[#D4AF37]' : 'bg-emerald-900/60 text-emerald-400'
                  }`}>2</span>
                )}
                <span>{regType === 'dinner_only' ? '2. Guest Details' : '2. Player Roster'}</span>
              </div>

              <span className="text-emerald-400/40">&bull;</span>

              {/* Step 3 */}
              <div
                className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 transition text-xs ${
                  step > 3
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/60 font-semibold shadow-xs'
                    : step === 3
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F6E8B6] to-[#D4AF37] text-[#0F2D17] font-extrabold shadow-sm ring-1 ring-[#D4AF37]'
                    : 'text-emerald-300/50 bg-emerald-950/40 border border-emerald-800/40'
                }`}
              >
                {step > 3 ? (
                  <CheckCircle className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    step === 3 ? 'bg-[#0F2D17] text-[#D4AF37]' : 'bg-emerald-900/60 text-emerald-400'
                  }`}>3</span>
                )}
                <span>3. Payment Method</span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: Choose Registration Card Format */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-7 space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Registration Card Format
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Green Fee & Cart Package */}
                <button
                  type="button"
                  onClick={() => setRegType('individual')}
                  className={`p-4 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    regType === 'individual'
                      ? 'border-[#1E4D2B] bg-emerald-50/70 ring-2 ring-[#1E4D2B]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                        - $100 Members | - $120 Others
                      </span>
                      <User className="w-4 h-4 text-[#1E4D2B]" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      Green Fee &amp; Cart
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      1 Golfer &bull; 18 Holes &bull; GPS Cart
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col font-mono text-xs font-bold text-[#1E4D2B]">
                    <div>- $100 Members</div>
                    <div>- $120 Others</div>
                  </div>
                </button>

                {/* 2. Supporter - Dinner */}
                <button
                  type="button"
                  onClick={() => setRegType('dinner_only')}
                  className={`p-4 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    regType === 'dinner_only'
                      ? 'border-[#1E4D2B] bg-emerald-50/70 ring-2 ring-[#1E4D2B]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        Supporter $60
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-700" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      Dinner Guest Pass
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dinner &amp; Awards Banquet
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      $60
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Per Guest</span>
                  </div>
                </button>

                {/* 3. Donations Card */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    openDonationModal(100);
                  }}
                  className="p-4 rounded-2xl text-left border-2 border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50/80 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        Donations
                      </span>
                      <Heart className="w-4 h-4 text-rose-600 fill-rose-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      Be Generous
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      It’s for great causes
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-200 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-rose-700">Tax Receipt</span>
                    <span className="text-[11px] text-rose-600 font-bold flex items-center gap-0.5">
                      Donate Now <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {regType === 'dinner_only'
                    ? 'Continue to Guest Details (Step 2)'
                    : 'Continue to Player Roster (Step 2)'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: TAB - Player Roster Step */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-7 space-y-5">
            {/* Pairing Notice Alert if someone previously requested to play with this golfer */}
            {pairingInvitation && (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 animate-fadeIn shadow-xs">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">
                    Foursome Pairing Invitation Found!
                  </span>
                  <p className="mt-0.5">
                    Notice: <strong>{pairingInvitation}</strong> would like you to be part of their foursome for golf!
                  </p>
                </div>
              </div>
            )}

            {/* Golfer Classification (Member $100 vs Other $120) */}
            {regType !== 'dinner_only' && (
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/90 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Golfer Classification / Fee Rate *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGolferType('member')}
                    className={`p-3 rounded-xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                      golferType === 'member'
                        ? 'border-[#1E4D2B] bg-white ring-2 ring-[#1E4D2B]'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Member Rate</div>
                      <div className="text-[10px] text-slate-500">Course / Club Member</div>
                    </div>
                    <span className="font-mono font-extrabold text-[#1E4D2B] text-xs sm:text-sm">- $100 Members</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGolferType('other')}
                    className={`p-3 rounded-xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                      golferType === 'other'
                        ? 'border-[#1E4D2B] bg-white ring-2 ring-[#1E4D2B]'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Other Rate</div>
                      <div className="text-[10px] text-slate-500">Non-Member / Guest</div>
                    </div>
                    <span className="font-mono font-extrabold text-[#1E4D2B] text-xs sm:text-sm">- $120 Others</span>
                  </button>
                </div>
              </div>
            )}

            {/* Primary Golfer Info */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E4D2B] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {regType === 'dinner_only'
                      ? 'Guest & Supporter Details (Contact) *'
                      : 'Primary Golfer Details (Contact) *'}
                  </h4>
                </div>
                <span className="text-[10px] text-[#1E4D2B] font-semibold">Receives Confirmation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Full Name: Capitalized first letter of each word */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saied Mohammed"
                    value={primaryPlayer.name}
                    onChange={(e) => {
                      const formatted = formatTitleCase(e.target.value);
                      setPrimaryPlayer({ ...primaryPlayer, name: formatted });
                      if (rosterErrors.name) {
                        setRosterErrors((prev) => ({ ...prev, name: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                      rosterErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {rosterErrors.name && (
                    <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {rosterErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={primaryPlayer.email}
                    onChange={(e) => {
                      setPrimaryPlayer({ ...primaryPlayer, email: e.target.value });
                      if (rosterErrors.email) {
                        setRosterErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                      rosterErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {rosterErrors.email && (
                    <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {rosterErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={primaryPlayer.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setPrimaryPlayer({ ...primaryPlayer, phone: formatted });
                      if (rosterErrors.phone) {
                        setRosterErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                      rosterErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {rosterErrors.phone && (
                    <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {rosterErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Dietary Needs */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Dietary Needs (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, Gluten-Free"
                  value={primaryPlayer.dietaryRestrictions || ''}
                  onChange={(e) =>
                    setPrimaryPlayer({
                      ...primaryPlayer,
                      dietaryRestrictions: formatTitleCase(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
                />
              </div>
            </div>

            {/* "I would like to play with (First & Last Name)" */}
            {regType !== 'dinner_only' && (
              <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    I would like to play with (First &amp; Last Name)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Enter the full names of up to 3 golfers you would like paired with in your foursome. The first letter of each name will be capitalized automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx}>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                        Golfer #{idx + 2} Full Name
                      </label>
                      <input
                        type="text"
                        placeholder={`Golfer #${idx + 2} Name`}
                        value={requestedTeammates[idx] || ''}
                        onChange={(e) => {
                          const val = formatTitleCase(e.target.value);
                          const updated = [...requestedTeammates];
                          updated[idx] = val;
                          setRequestedTeammates(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* "Need a receipt?" check mark option */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={needReceipt}
                  onChange={(e) => setNeedReceipt(e.target.checked)}
                  className="w-4 h-4 text-[#1E4D2B] rounded border-slate-300 focus:ring-[#1E4D2B] cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Need a receipt?
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Tax Deductible
                </span>
              </label>

              {/* Conditional Receipt Fields */}
              {needReceipt && (
                <div className="pt-3 border-t border-slate-200 space-y-3 animate-fadeIn">
                  <p className="text-[11px] text-slate-600">
                    Please provide your mailing address for your official charitable donation tax receipt:
                  </p>

                  {/* Address: First letter of each word in caps */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Address (Street Address, Unit / Suite) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Main Street, Suite 400"
                      value={receiptAddress}
                      onChange={(e) => {
                        const val = formatTitleCase(e.target.value);
                        setReceiptAddress(val);
                        if (receiptErrors.address) {
                          setReceiptErrors((prev) => ({ ...prev, address: '' }));
                        }
                      }}
                      className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white capitalize ${
                        receiptErrors.address ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                    />
                    {receiptErrors.address && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {receiptErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* City: First letter capitalized */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hamilton"
                        value={receiptCity}
                        onChange={(e) => {
                          const val = formatTitleCase(e.target.value);
                          setReceiptCity(val);
                          if (receiptErrors.city) {
                            setReceiptErrors((prev) => ({ ...prev, city: '' }));
                          }
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                          receiptErrors.city ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                        }`}
                      />
                      {receiptErrors.city && (
                        <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {receiptErrors.city}
                        </p>
                      )}
                    </div>

                    {/* Province: First letter of every word is in caps */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Province *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ontario"
                        value={receiptProvince}
                        onChange={(e) => {
                          const val = formatTitleCase(e.target.value);
                          setReceiptProvince(val);
                          if (receiptErrors.province) {
                            setReceiptErrors((prev) => ({ ...prev, province: '' }));
                          }
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                          receiptErrors.province ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                        }`}
                      />
                      {receiptErrors.province && (
                        <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {receiptErrors.province}
                        </p>
                      )}
                    </div>

                    {/* Postal Code: Canada Postal Codes (Format: A1A 1A1, ANA NAN, single space, no hyphens) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Postal Code (A1A 1A1) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. L8P 4S6"
                        maxLength={7}
                        value={receiptPostalCode}
                        onChange={(e) => {
                          const formatted = formatCanadianPostalCode(e.target.value);
                          setReceiptPostalCode(formatted);
                          if (receiptErrors.postalCode) {
                            setReceiptErrors((prev) => ({ ...prev, postalCode: '' }));
                          }
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white ${
                          receiptErrors.postalCode ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                        }`}
                      />
                      {receiptErrors.postalCode ? (
                        <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {receiptErrors.postalCode}
                        </p>
                      ) : (
                        <span className="text-[9px] text-slate-400 mt-0.5 block">
                          Format: ANA NAN (e.g. L8P 4S6)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
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
                <span>Continue to Payment Method</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Review & Payment Method (NO Credit Card) */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="p-6 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Order Summary Column */}
              <div className="md:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                  Registration Summary
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {regType === 'dinner_only'
                        ? 'Dinner Guest Pass'
                        : golferType === 'member'
                        ? 'Green Fee & Cart (Member)'
                        : 'Green Fee & Cart (Other)'}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ${regType === 'dinner_only'
                        ? PRICING_RULES.dinnerOnly
                        : golferType === 'member'
                        ? PRICING_RULES.memberGolfer
                        : PRICING_RULES.otherGolfer}
                    </span>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200/60">
                    <div>Golfer: <strong className="text-slate-800">{primaryPlayer.name || 'Participant'}</strong></div>
                    <div>Email: <strong className="text-slate-800">{primaryPlayer.email || 'N/A'}</strong></div>
                    {requestedTeammates.filter(Boolean).length > 0 && (
                      <div className="mt-1 text-emerald-800">
                        Playing with: {requestedTeammates.filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Total Due:</span>
                  <span className="text-2xl font-extrabold text-[#1E4D2B] font-mono">
                    ${totalAmount.toLocaleString()} CAD
                  </span>
                </div>

                {needReceipt && (
                  <div className="pt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="font-bold">Official Tax Receipt Requested</span>
                    <div className="text-slate-600 text-[10px] mt-0.5">
                      {receiptAddress}, {receiptCity}, {receiptProvince} {receiptPostalCode}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Details Column (Cheque, Interac e-Transfer, Cash) */}
              <div className="md:col-span-7 space-y-4">
                {/* Notice Banner */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-950 block">
                      Important Payment Notice:
                    </span>
                    <span>
                      Payment can only be made via <strong>Cash</strong> at the event or prior to Saied, <strong>Cheque</strong> payable to Saied Mohammed, or <strong>Interac e-Transfer</strong> to{' '}
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-950 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300">
                        <span>fragrant.breeze2023@gmail.com</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('fragrant.breeze2023@gmail.com');
                            setCopiedDetails(true);
                            addToast('info', 'Email Copied', 'fragrant.breeze2023@gmail.com copied to clipboard.');
                            setTimeout(() => setCopiedDetails(false), 2000);
                          }}
                          className="p-1 rounded bg-white hover:bg-emerald-200 text-emerald-800 transition cursor-pointer shadow-2xs"
                          title="Copy e-Transfer email address"
                        >
                          {copiedDetails ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-emerald-800" />}
                        </button>
                      </span>.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border-2 border-[#1E4D2B] rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] shadow-xs cursor-pointer"
                  >
                    <option value="cheque">Cheque (Payable to Saied Mohammed)</option>
                    <option value="cash">Cash (Bring it to the event)</option>
                    <option value="etransfer">Interac e-Transfer</option>
                  </select>
                </div>

                {/* CHEQUE PAYMENT DETAILS */}
                {paymentMethod === 'cheque' && (
                  <div className="p-4 bg-gradient-to-br from-amber-50/90 to-emerald-50/60 rounded-xl border border-amber-300 space-y-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block">
                          Cheque Payment Instructions
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          Payable to Saied Mohammed
                        </h5>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1.5 text-slate-800">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Make Cheque Payable To:</span>
                        <span className="font-bold text-slate-900">Saied Mohammed</span>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Memo Line:</span>
                        <span className="font-mono font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          2026 Memorial Golf
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Total Cheque Amount:</span>
                        <span className="text-sm font-extrabold font-mono text-[#1E4D2B]">
                          ${totalAmount.toLocaleString()} CAD
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-amber-900 flex items-start gap-1.5">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-amber-800 mt-0.5" />
                      <span>
                        All player registration information will be confirmed to the golfer and routed to tournament administrator <strong>Luc Valade (luc.valade@gmail.com)</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* INTERAC E-TRANSFER DETAILS */}
                {paymentMethod === 'etransfer' && (
                  <div className="p-4 bg-gradient-to-br from-emerald-50/90 to-amber-50/50 rounded-xl border border-emerald-400 space-y-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1E4D2B] text-white flex items-center justify-center shrink-0">
                        <Send className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#1E4D2B] block">
                          Interac e-Transfer Instructions
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          Electronic Funds Transfer via Banking App
                        </h5>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1.5 text-slate-800">
                      <div className="pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium block mb-1">Send e-Transfer To:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1E4D2B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block w-full text-center">
                            fragrant.breeze2023@gmail.com
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('fragrant.breeze2023@gmail.com');
                              setCopiedDetails(true);
                              setTimeout(() => setCopiedDetails(false), 2000);
                            }}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${copiedDetails ? 'bg-emerald-200' : 'bg-emerald-100 hover:bg-emerald-200'}`}
                            title="Copy email to clipboard"
                          >
                            <Copy className="w-4 h-4 text-[#1E4D2B]" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Memo / Transfer Note:</span>
                        <span className="font-mono font-bold text-slate-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          2026 Memorial Golf
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Total Amount:</span>
                        <span className="text-sm font-extrabold font-mono text-[#1E4D2B]">
                          ${totalAmount.toLocaleString()} CAD
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#1E4D2B] mt-0.5" />
                      <span>
                        All player registration information will be confirmed to the golfer and routed to tournament administrator <strong>Luc Valade (luc.valade@gmail.com)</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* CASH PAYMENT DETAILS */}
                {paymentMethod === 'cash' && (
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50/60 rounded-xl border border-slate-300 space-y-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                        <Banknote className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900 block">
                          Cash Payment Selected
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          Cash (Bring it to the event)
                        </h5>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-800">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Payment Timing:</span>
                        <span className="font-semibold text-slate-900">At 9:30 AM Check-In or prior to Saied</span>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Memo / Reference:</span>
                        <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          2026 Memorial Golf
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Total Amount Due:</span>
                        <span className="text-sm font-extrabold font-mono text-[#1E4D2B]">
                          ${totalAmount.toLocaleString()} CAD
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#1E4D2B] mt-0.5" />
                      <span>
                        All player registration information will be confirmed to the golfer and routed to tournament administrator <strong>Luc Valade (luc.valade@gmail.com)</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* SPOT TO ENTER PASSWORD FOR GOOGLE WORKSPACE GMAIL SMTP - FOR ADMINS ONLY */}
                {isAdminAuthenticated && (
                  <div className="p-4 bg-emerald-50/90 border-2 border-[#1E4D2B] rounded-xl space-y-2.5 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1E4D2B] text-white flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Google Workspace Email Delivery (smtp.gmail.com:587)
                          </div>
                          <div className="text-[11px] text-emerald-950 font-medium">
                            User ID: <span className="font-mono font-bold">sales@aiopenhouseconnect.com</span>
                          </div>
                        </div>
                      </div>
                      {smtpPassword ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-700" /> Password Set
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                          Password Needed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Enter Password / App Password:
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showSmtpPassword ? 'text' : 'password'}
                            value={smtpPassword}
                            onChange={(e) => {
                              setSmtpPassword(e.target.value);
                              localStorage.setItem('fb_smtp_pass', e.target.value);
                              setSmtpStatusMsg(null);
                            }}
                            placeholder="Enter Google Workspace password or App Password"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] font-mono bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                            className="absolute right-2 top-2 text-[10px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                          >
                            {showSmtpPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveSmtpPassword}
                          disabled={isSavingSmtp}
                          className="px-3.5 py-2 bg-[#1E4D2B] hover:bg-[#15381E] text-white text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                          {isSavingSmtp ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={handleTestSmtpConnection}
                          disabled={isTestingSmtp}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                          {isTestingSmtp ? 'Testing...' : 'Test'}
                        </button>
                      </div>

                      {smtpStatusMsg && (
                        <p className={`text-[11px] mt-1 font-medium ${smtpStatusMsg.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {smtpStatusMsg.text}
                        </p>
                      )}

                      <p className="text-[10px] text-slate-500 leading-tight">
                        When pressing confirm below, the server will send the registration directly to <strong>Saied Mohammed's email</strong> from your Google Workspace account.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Player Roster
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Confirming Registration & Sending Email...'
                    : paymentMethod === 'cheque'
                    ? `Confirm Cheque ($${totalAmount.toLocaleString()}) & Send to Saied`
                    : paymentMethod === 'cash'
                    ? `Confirm Cash ($${totalAmount.toLocaleString()}) & Send to Saied`
                    : `Confirm e-Transfer ($${totalAmount.toLocaleString()}) & Send to Saied`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Digital Golfer Pass & Confirmation */}
        {step === 4 && confirmedRecord && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-[#1E4D2B] tracking-wider">
                Registration Confirmed &bull; See You on the Green
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading mt-1">
                Welcome to the Fragrant Breeze Tournament!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                A confirmation has been recorded for <strong>{confirmedRecord.primaryContact.name}</strong> ({confirmedRecord.primaryContact.email}).
              </p>
            </div>

            {/* Google Workspace Backend Email Delivery Status Banner */}
            {emailSendResult && (
              <div className={`max-w-md mx-auto p-4 rounded-2xl border text-left space-y-1.5 ${
                emailSendResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-start gap-2">
                  {emailSendResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {emailSendResult.success
                        ? 'Email Sent via Google Workspace (sales@aiopenhouseconnect.com)'
                        : 'Server Email Notification Notice'}
                    </div>
                    <p className="text-xs mt-0.5">
                      {emailSendResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Offline Payment Routing Notice */}
            <div className="max-w-xl mx-auto p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Registration Dispatched to Tournament Administration
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    All player information has been prepared and routed to Tournament Administrator{' '}
                    <strong>Luc Valade</strong> at{' '}
                    <span className="font-mono font-bold text-[#1E4D2B]">luc.valade@gmail.com</span> (and cc'd to Founder Saied Mohammed).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <strong className="text-slate-900">
                    {confirmedRecord.paymentMethod === 'cheque'
                      ? 'Cheque (Payable to Saied Mohammed)'
                      : confirmedRecord.paymentMethod === 'cash'
                      ? 'Cash (Bring to event or prior to Saied)'
                      : 'Interac e-Transfer'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Memo Line:</span>
                  <strong className="font-mono text-slate-900">2026 Memorial Golf</strong>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <strong className="text-[#1E4D2B] font-mono text-sm">
                    ${confirmedRecord.totalAmount.toLocaleString()} CAD
                  </strong>
                </div>
                {confirmedRecord.receiptInfo?.needed && (
                  <div className="pt-1.5 border-t border-slate-100 flex justify-between">
                    <span>Tax Receipt:</span>
                    <strong className="text-emerald-700">Requested ({confirmedRecord.receiptInfo.postalCode})</strong>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`mailto:luc.valade@gmail.com?cc=fragrant.breeze2023@gmail.com&subject=${encodeURIComponent(
                    `[2026 Memorial Golf] ${
                      confirmedRecord.paymentMethod === 'cheque'
                        ? 'Cheque'
                        : confirmedRecord.paymentMethod === 'cash'
                        ? 'Cash'
                        : 'e-Transfer'
                    } Registration: ${confirmedRecord.primaryContact.name} - ${confirmedRecord.confirmationCode}`
                  )}&body=${encodeURIComponent(
                    generateSaiedEmailText(confirmedRecord, confirmedRecord.totalAmount)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-[#1E4D2B] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Email to Luc Valade (luc.valade@gmail.com)</span>
                </a>
                <button
                  onClick={() => {
                    const text = generateSaiedEmailText(confirmedRecord, confirmedRecord.totalAmount);
                    navigator.clipboard.writeText(text);
                    setCopiedDetails(true);
                    setTimeout(() => setCopiedDetails(false), 3000);
                  }}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>{copiedDetails ? 'Copied!' : 'Copy Admin Notice'}</span>
                </button>
              </div>
            </div>

            {/* GOLFER CONFIRMATION EMAIL RECORD CARD */}
            {(() => {
              const golferConfirmedData = getGolferEmailData(confirmedRecord.paymentMethod, confirmedRecord);
              return (
                <div className="max-w-xl mx-auto bg-slate-900 text-white rounded-2xl border border-slate-700 text-left overflow-hidden shadow-md">
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-bold font-serif-heading">Your Golfer Confirmation Email</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(golferConfirmedData.fullPlainText);
                        setCopiedGolferEmail(true);
                        setTimeout(() => setCopiedGolferEmail(false), 2500);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedGolferEmail ? 'Copied!' : 'Copy Golfer Email'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 font-mono text-[11px] text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed border-t border-slate-800">
                    {golferConfirmedData.fullPlainText}
                  </div>
                </div>
              );
            })()}

            {/* Pass Card with QR */}
            <div className="max-w-md mx-auto bg-white border-2 border-dashed border-[#1E4D2B] rounded-2xl p-5 text-left space-y-3 shadow-sm">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {confirmedRecord.confirmationCode}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-1 font-serif-heading">
                    {confirmedRecord.primaryContact.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {confirmedRecord.type === 'dinner_only' ? 'Dinner Guest Pass' : 'Green Fee & Cart Package'}
                  </p>
                </div>
                <QRCodeSVG
                  value={confirmedRecord.confirmationCode}
                  size={72}
                  bgColor="#ffffff"
                  fgColor="#1E4D2B"
                  level="H"
                  imageSettings={{
                    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%231E4D2B" stroke="%23D4AF37" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
                    x: undefined,
                    y: undefined,
                    height: 18,
                    width: 18,
                    opacity: 1,
                    excavate: true
                  }}
                />
              </div>

              {confirmedRecord.requestedTeammates && confirmedRecord.requestedTeammates.length > 0 && (
                <div className="text-xs">
                  <span className="text-slate-500 text-[11px] font-semibold">Requested Foursome Partners:</span>
                  <div className="text-slate-800 font-medium mt-0.5">
                    {confirmedRecord.requestedTeammates.join(', ')}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 text-[10px]">Starting Hole:</span>
                  <div className="font-mono font-bold text-slate-900">Hole #{confirmedRecord.assignedStartingHole}A</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Assigned Cart:</span>
                  <div className="font-mono font-bold text-slate-900">{confirmedRecord.assignedCart}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#1E4D2B] hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
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
