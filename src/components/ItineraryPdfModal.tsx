import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, Calendar, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { EVENT_DETAILS } from '../data/initialData';

interface ItineraryPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ItineraryPdfModal: React.FC<ItineraryPdfModalProps> = ({ isOpen, onClose }) => {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Clean up print classes on unmount or after print dialog
  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-itinerary');
      setIsPrinting(false);
      setStatusMessage(null);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      document.body.classList.remove('printing-itinerary');
    };
  }, []);

  if (!isOpen) return null;

  /**
   * Save directly as a downloadable 8.5" x 11" PDF file with proper filename
   */
  const handleSavePdf = async () => {
    if (!printContainerRef.current || isSavingPdf) return;
    setIsSavingPdf(true);
    setStatusMessage('Generating 8.5" x 11" high-resolution PDF...');

    try {
      const sheetElement = printContainerRef.current;

      // Ensure web fonts are completely loaded before capturing canvas
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Render the 8.5" x 11" element with 2x resolution
      const canvas = await html2canvas(sheetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fafaf9',
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const clonedSheet = clonedDoc.getElementById('printable-itinerary-sheet');
          if (clonedSheet) {
            clonedSheet.style.width = '816px';
            clonedSheet.style.height = '1056px';
            clonedSheet.style.maxWidth = '816px';
            clonedSheet.style.maxHeight = '1056px';
            clonedSheet.style.margin = '0 auto';
            clonedSheet.style.boxShadow = 'none';
            clonedSheet.style.border = 'none';
            clonedSheet.style.borderRadius = '0';
          }
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render returned empty image dimensions');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Standard US Letter: 8.5 x 11 inches
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = 'Fragrant-Breeze-Golf-Tournament-Itinerary-2026.pdf';
      pdf.save(fileName);

      setSaveSuccess(true);
      setStatusMessage(`Saved "${fileName}" to downloads!`);
      setTimeout(() => {
        setSaveSuccess(false);
        setStatusMessage(null);
      }, 4000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatusMessage('Direct PDF creation error. Launching print-to-PDF window...');
      handlePrintPdf();
    } finally {
      setIsSavingPdf(false);
    }
  };

  /**
   * Calls up the browser's print-to-PDF window with pure Letter-size sheet layout
   */
  const handlePrintPdf = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    setStatusMessage('Opening print preview dialog...');

    // Add isolation class to body
    document.body.classList.add('printing-itinerary');

    // Small timeout ensures CSS layout updates before print dialog freezes execution
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          console.error('Print trigger error:', err);
        } finally {
          setIsPrinting(false);
          setTimeout(() => {
            document.body.classList.remove('printing-itinerary');
            setStatusMessage(null);
          }, 1500);
        }
      }, 150);
    });
  };

  return (
    <div
      id="itinerary-pdf-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-modal-title"
    >
      <div
        id="itinerary-pdf-modal-card"
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls Bar (Hidden When Printing) */}
        <div id="itinerary-modal-header-bar" className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-white no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E4D2B] text-amber-300 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 id="itinerary-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                Print Itinerary (8.5&quot; &times; 11&quot; Letter Size)
              </h2>
              <p className="text-[11px] text-slate-300">
                Fragrant Breeze Golf Tournament &bull; Burford Golf Links Course
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Print PDF Button */}
            <button
              id="modal-top-btn-print-pdf"
              onClick={handlePrintPdf}
              disabled={isPrinting}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#1E4D2B] hover:bg-emerald-700 text-amber-200 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer border border-[#D4AF37]/40 disabled:opacity-60"
              title="Call up the Print to PDF function"
            >
              {isPrinting ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Printer className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>{isPrinting ? 'Calling Print...' : 'Print PDF'}</span>
            </button>

            {/* Save as PDF Button */}
            <button
              id="modal-top-btn-save-pdf"
              onClick={handleSavePdf}
              disabled={isSavingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer border border-amber-400/40 disabled:opacity-60"
              title="Save as Fragrant-Breeze-Golf-Tournament-Itinerary-2026.pdf"
            >
              {isSavingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle className="w-4 h-4 text-emerald-300" />
              ) : (
                <Download className="w-4 h-4 text-amber-200" />
              )}
              <span>{isSavingPdf ? 'Saving PDF...' : saveSuccess ? 'Saved!' : 'Save as PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div id="itinerary-preview-scroll-wrapper" className="p-3 sm:p-6 overflow-y-auto bg-slate-950/60 flex justify-center items-center">
          {/* The 8.5" x 11" Paper Sheet */}
          <div
            id="printable-itinerary-sheet"
            ref={printContainerRef}
            className="w-full max-w-[700px] aspect-[8.5/11] bg-[#FAFAF9] text-slate-900 rounded-sm shadow-2xl relative overflow-hidden border border-slate-200 flex flex-col justify-between p-6 sm:p-10 select-none print:shadow-none print:border-0 print:m-0 print:max-w-none print:w-[8.5in] print:h-[11in]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: '#fafaf9'
            }}
          >
            {/* SVG Watercolor wash accents (Fully parsed by html2canvas & CSS printing) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="wash-blue" cx="15%" cy="8%" r="45%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wash-green" cx="85%" cy="28%" r="40%">
                  <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wash-cyan" cx="45%" cy="92%" r="50%">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#wash-blue)" />
              <rect width="100%" height="100%" fill="url(#wash-green)" />
              <rect width="100%" height="100%" fill="url(#wash-cyan)" />
            </svg>

            {/* Top Illustrations */}
            {/* 1. Argyle Golf Sweater / Vest (Top-Left) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-16 h-20 sm:w-20 sm:h-26 pointer-events-none z-10 drop-shadow-sm">
              <svg viewBox="0 0 100 130" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sweater Body */}
                <path
                  d="M20 28 L38 35 L42 20 C46 25 54 25 58 20 L62 35 L80 28 L88 60 L80 62 L80 120 L20 120 L20 62 L12 60 Z"
                  fill="#38bdf8"
                />
                {/* Argyle Diamond Patterns */}
                <polygon points="50,45 68,65 50,85 32,65" fill="#0284c7" />
                <polygon points="50,85 68,105 50,120 32,105" fill="#0369a1" />
                <polygon points="26,45 38,58 26,71 14,58" fill="#0284c7" opacity="0.8" />
                <polygon points="74,45 86,58 74,71 62,58" fill="#0284c7" opacity="0.8" />
                {/* Criss-cross stitch lines */}
                <line x1="20" y1="35" x2="80" y2="105" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.9" />
                <line x1="80" y1="35" x2="20" y2="105" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.9" />
                {/* Collar V-Neck Ribbing */}
                <path d="M38 35 L50 62 L62 35" stroke="#0369a1" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M20 116 L80 116" stroke="#0369a1" strokeWidth="4" />
              </svg>
            </div>

            {/* 2. Golf Sunglasses (Top-Right) */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-16 h-8 sm:w-22 sm:h-11 pointer-events-none z-10 drop-shadow-sm">
              <svg viewBox="0 0 120 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Frame */}
                <path
                  d="M10 24 C14 14 38 12 55 20 C60 22 65 22 70 20 C87 12 111 14 115 24 C117 38 100 48 76 44 C68 42 63 35 60 35 C57 35 52 42 44 44 C20 48 3 38 10 24 Z"
                  fill="#1e293b"
                />
                {/* Cyan wrap bridge accent */}
                <path d="M5 24 C20 10 100 10 115 24" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
                {/* Lenses with cyan reflection */}
                <ellipse cx="36" cy="30" rx="20" ry="12" fill="#0f172a" />
                <ellipse cx="84" cy="30" rx="20" ry="12" fill="#0f172a" />
                <path d="M22 25 Q35 20 48 26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M72 25 Q85 20 98 26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>

            {/* 3. Mid-Left: Golf Iron pointing down */}
            <div className="absolute top-1/3 -left-1 sm:left-2 w-10 h-32 sm:w-14 sm:h-44 pointer-events-none z-10 drop-shadow-sm opacity-90">
              <svg viewBox="0 0 60 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grip */}
                <line x1="28" y1="10" x2="30" y2="45" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
                {/* Shaft */}
                <line x1="30" y1="45" x2="36" y2="140" stroke="#94a3b8" strokeWidth="3" />
                {/* Hosel and Iron Head */}
                <path
                  d="M36 140 L38 152 C39 157 44 162 52 165 C57 167 56 172 48 172 C32 172 24 163 24 153 C24 148 34 140 36 140 Z"
                  fill="#64748b"
                />
                {/* Face grooves */}
                <line x1="34" y1="158" x2="48" y2="164" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="33" y1="162" x2="46" y2="167" stroke="#e2e8f0" strokeWidth="1" />
              </svg>
            </div>

            {/* 4. Mid-Right: Leather Golf Bag with Clubs */}
            <div className="absolute top-1/4 -right-1 sm:right-3 w-14 h-36 sm:w-20 sm:h-52 pointer-events-none z-10 drop-shadow-md opacity-95">
              <svg viewBox="0 0 90 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clubs sticking out */}
                <line x1="35" y1="35" x2="25" y2="10" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="23" cy="8" r="5" fill="#334155" />
                <line x1="45" y1="35" x2="48" y2="6" stroke="#94a3b8" strokeWidth="2.5" />
                <rect x="42" y="3" width="12" height="7" rx="3" fill="#b91c1c" />
                <line x1="55" y1="35" x2="68" y2="14" stroke="#94a3b8" strokeWidth="2.5" />
                <ellipse cx="71" cy="13" rx="7" ry="4" fill="#d97706" />
                {/* Bag Collar */}
                <rect x="30" y="35" width="34" height="10" rx="3" fill="#78350f" />
                {/* Bag Main Cylinder */}
                <path
                  d="M30 45 L26 150 C26 158 35 165 47 165 C59 165 68 158 68 150 L64 45 Z"
                  fill="#b45309"
                />
                {/* Pockets */}
                <rect x="30" y="70" width="34" height="30" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
                <rect x="34" y="110" width="26" height="35" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
                {/* Carrying Strap */}
                <path d="M28 55 C12 80 14 125 26 145" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="28" cy="55" r="2.5" fill="#fbbf24" />
                <circle cx="26" cy="145" r="2.5" fill="#fbbf24" />
              </svg>
            </div>

            {/* Header Content */}
            <div className="text-center relative z-20 pt-1 sm:pt-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-slate-800 uppercase font-sans">
                Fragrant Breeze
              </h3>
              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase font-sans mt-0.5">
                Golf Tournament
              </h4>

              {/* Script Calligraphy "itinerary" */}
              <div
                className="text-4xl sm:text-6xl text-slate-900 my-1 sm:my-2 select-none"
                style={{
                  fontFamily: "'Dancing Script', 'Alex Brush', cursive",
                  fontWeight: 700
                }}
              >
                itinerary
              </div>

              {/* Date & Location */}
              <div className="space-y-0.5">
                <div className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-slate-800 uppercase">
                  Monday October 5, 2026
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#1E4D2B] uppercase">
                  Burford Golf Links Course
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider">
                  120 Golf Links Rd., Burford ON
                </div>
              </div>
            </div>

            {/* Schedule Items: 9:30 AM to 4:00 PM */}
            <div className="relative z-20 my-auto py-3 space-y-4 sm:space-y-6 max-w-lg mx-auto text-center">
              {/* Event 1: 9:30 AM */}
              <div className="space-y-1">
                <div className="inline-block text-xs sm:text-sm font-extrabold tracking-wider text-[#1E4D2B] font-mono bg-emerald-100/70 px-3 py-0.5 rounded-full">
                  9:30 AM
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                  New Restaurant in the Upper Level
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 italic">
                  Championship Practice Green &amp; Chipping Area
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-serif">
                  Registration, Chipping and Putting Competition
                </h5>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed max-w-md mx-auto">
                  Check-in, snacks will be provided, and official registration in Pro shop, chipping and putting competition (warm-up before the game).
                </p>
              </div>

              {/* Divider */}
              <div className="w-16 h-px bg-slate-300 mx-auto opacity-70" />

              {/* Event 2: 11:00 AM */}
              <div className="space-y-1">
                <div className="inline-block text-xs sm:text-sm font-extrabold tracking-wider text-amber-900 font-mono bg-amber-100/80 px-3 py-0.5 rounded-full">
                  11:00 AM
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                  All 18 Holes
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-serif">
                  Tee off (Shotgun Start)
                </h5>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed max-w-md mx-auto">
                  Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow).
                </p>
              </div>

              {/* Divider */}
              <div className="w-16 h-px bg-slate-300 mx-auto opacity-70" />

              {/* Event 3: 4:00 PM */}
              <div className="space-y-1">
                <div className="inline-block text-xs sm:text-sm font-extrabold tracking-wider text-orange-950 font-mono bg-orange-100/80 px-3 py-0.5 rounded-full">
                  4:00 PM
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Restaurant in the Upper Level
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-serif">
                  FABULOUS Turkey Dinner
                </h5>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed max-w-md mx-auto">
                  Dinner &amp; Donation option ($60) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner. Prizes and Trophy presentations, and memorial fundraising recap.
                </p>
              </div>
            </div>

            {/* Bottom Footer Section with Green Hill, Pin Flag, Ball, and Red Golf Cart */}
            <div className="relative z-20 pt-2 text-center">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 italic tracking-wide mb-2">
                golf equipment available to hire &bull; live mobile scoring
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest">
                In Loving Memory of Naseem Mohammed &bull; Benefiting Juravinski Cancer Research &amp; Red Cross
              </div>

              {/* Bottom Landscape Illustration: Putting Green Hill + Red Flag + Ball + Red Golf Cart */}
              <div className="w-full h-16 sm:h-22 mt-2 relative overflow-hidden">
                <svg viewBox="0 0 500 100" className="w-full h-full" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Rolling Green Hills */}
                  <path
                    d="M0 70 Q120 40 260 58 T500 45 L500 100 L0 100 Z"
                    fill="#4ade80"
                  />
                  <path
                    d="M0 80 Q140 55 300 70 T500 60 L500 100 L0 100 Z"
                    fill="#22c55e"
                  />
                  <path
                    d="M0 90 Q160 70 340 82 T500 75 L500 100 L0 100 Z"
                    fill="#15803d"
                  />

                  {/* Hole & Flag on Left */}
                  {/* Cup */}
                  <ellipse cx="60" cy="85" rx="8" ry="3.5" fill="#0f172a" opacity="0.8" />
                  {/* Flagpole */}
                  <line x1="60" y1="85" x2="60" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  {/* Red Pennant Flag */}
                  <polygon points="60,28 36,36 60,44" fill="#dc2626" />
                  <text x="51" y="38" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">1</text>
                  {/* Golf Ball */}
                  <circle cx="80" cy="86" r="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <ellipse cx="80" cy="89" rx="3.5" ry="1.2" fill="#0f172a" opacity="0.25" />

                  {/* Red Golf Cart on Right */}
                  <g transform="translate(380, 26)">
                    {/* Cart Body */}
                    <path d="M15 35 L45 35 L50 25 L65 25 C68 25 72 29 72 35 L76 35 C78 35 80 37 80 40 L80 46 L8 46 L8 40 C8 37 10 35 15 35 Z" fill="#dc2626" />
                    {/* Canopy Roof */}
                    <path d="M18 6 L65 6 C68 6 70 8 70 10 L68 12 L15 12 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                    {/* Roof Struts */}
                    <line x1="22" y1="12" x2="20" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="62" y1="12" x2="52" y2="25" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Seat */}
                    <rect x="24" y="24" width="16" height="12" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" />
                    {/* Steering Wheel */}
                    <line x1="48" y1="23" x2="42" y2="29" stroke="#1e293b" strokeWidth="2" />
                    {/* Wheels */}
                    <circle cx="22" cy="48" r="8" fill="#1e293b" />
                    <circle cx="22" cy="48" r="4" fill="#94a3b8" />
                    <circle cx="68" cy="48" r="8" fill="#1e293b" />
                    <circle cx="68" cy="48" r="4" fill="#94a3b8" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions (Not Printed) */}
        <div id="itinerary-modal-footer-bar" className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Formatted for standard 8.5&quot; &times; 11&quot; letter paper</span>
            {statusMessage && (
              <span className="hidden sm:inline text-amber-300 font-medium">
                &bull; {statusMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Print PDF */}
            <button
              id="modal-footer-btn-print-pdf"
              onClick={handlePrintPdf}
              disabled={isPrinting}
              className="px-4 py-2 rounded-xl bg-[#1E4D2B] hover:bg-emerald-700 text-amber-200 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              title="Call up the Print to PDF function"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              )}
              <span>{isPrinting ? 'Calling Print...' : 'Print PDF'}</span>
            </button>

            {/* Print/Save as PDF */}
            <button
              id="modal-footer-btn-save-pdf"
              onClick={handleSavePdf}
              disabled={isSavingPdf}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              title="Save directly as Fragrant-Breeze-Golf-Tournament-Itinerary-2026.pdf"
            >
              {isSavingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-200" />
              )}
              <span>{isSavingPdf ? 'Saving PDF...' : saveSuccess ? 'PDF Saved!' : 'Print/Save as PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
