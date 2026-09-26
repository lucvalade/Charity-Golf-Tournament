import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Palette,
  ImageIcon,
  Printer,
  Link as LinkIcon,
  Trophy,
  Heart,
  Award,
  Calendar,
  MapPin
} from 'lucide-react';
import { EVENT_DETAILS } from '../data/initialData';

interface BrandedQrCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToast?: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
}

export const BrandedQrCodeGeneratorModal: React.FC<BrandedQrCodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  addToast
}) => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://fragrantbreezegolf.com';

  // Preset Selection
  const [selectedPreset, setSelectedPreset] = useState<'register' | 'donate' | 'sponsors' | 'schedule' | 'venue'>('register');
  const [customUrl, setCustomUrl] = useState<string>(`${currentOrigin}/#register`);
  const [qrLabel, setQrLabel] = useState<string>('Scan to Register for Tournament');

  // Brand Color Customization
  const [fgColor, setFgColor] = useState<string>('#1E4D2B'); // Tournament Emerald Green
  const [bgColor, setBgColor] = useState<string>('#FFFFFF'); // Crisp White
  const [logoOption, setLogoOption] = useState<'trophy' | 'heart' | 'gold' | 'none'>('trophy');
  const [logoSize, setLogoSize] = useState<number>(48);
  const [qrSize, setQrSize] = useState<number>(300);
  const [includeMargin, setIncludeMargin] = useState<boolean>(true);

  // Status state
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);

  if (!isOpen) return null;

  // Handle Preset change
  const handlePresetSelect = (preset: 'register' | 'donate' | 'sponsors' | 'schedule' | 'venue') => {
    setSelectedPreset(preset);
    switch (preset) {
      case 'register':
        setCustomUrl(`${currentOrigin}/#register`);
        setQrLabel('Scan to Register for Tournament');
        break;
      case 'donate':
        setCustomUrl(`${currentOrigin}/#donate`);
        setQrLabel('Scan to Donate to Cancer Research');
        break;
      case 'sponsors':
        setCustomUrl(`${currentOrigin}/#sponsorships`);
        setQrLabel('Scan for Corporate Sponsorships');
        break;
      case 'schedule':
        setCustomUrl(`${currentOrigin}/#schedule`);
        setQrLabel('Scan for Tournament Itinerary');
        break;
      case 'venue':
        setCustomUrl('https://maps.google.com/?q=Burford+Golf+Links+120+Golf+Links+Rd+Burford+ON');
        setQrLabel('Scan for Venue GPS Directions');
        break;
    }
  };

  // Determine Logo Image Source
  const getLogoSrc = (): string | undefined => {
    if (logoOption === 'none') return undefined;

    // Default SVG Icons encoded as Data URLs
    if (logoOption === 'trophy') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%231E4D2B" stroke="%23D4AF37" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;
    }
    if (logoOption === 'heart') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23e11d48" stroke="%23ffffff" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    }
    if (logoOption === 'gold') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23D4AF37" stroke="%231E4D2B" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    return undefined;
  };

  // Download PNG (High Resolution for print / social media)
  const downloadPng = () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const exportScale = 3;
        canvas.width = qrSize * exportScale;
        canvas.height = qrSize * exportScale;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          const cleanPresetName = selectedPreset.toUpperCase();
          downloadLink.download = `FragrantBreeze_Branded_QR_${cleanPresetName}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          if (addToast) {
            addToast('success', 'PNG Downloaded!', `High-resolution Branded QR Code downloaded.`);
          }
        }
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Error downloading QR code PNG:', err);
      if (addToast) addToast('error', 'Download Error', 'Failed to render PNG image.');
    }
  };

  // Download SVG
  const downloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `FragrantBreeze_Branded_QR_${selectedPreset.toUpperCase()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      if (addToast) {
        addToast('success', 'SVG Downloaded!', 'Vector format saved for graphic designers & printers.');
      }
    } catch (err) {
      console.error('SVG download failed', err);
    }
  };

  // Copy PNG to Clipboard
  const copyToClipboard = async () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = qrSize * 2;
        canvas.height = qrSize * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
                if (addToast) {
                  addToast('success', 'Image Copied!', 'Branded QR Code copied to your clipboard.');
                }
              } catch (clipErr) {
                navigator.clipboard.writeText(customUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
                if (addToast) {
                  addToast('info', 'URL Copied', 'QR Code destination link copied to clipboard.');
                }
              }
            }
          });
        }
      };
      image.src = blobURL;
    } catch (err) {
      navigator.clipboard.writeText(customUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Print Poster Badge
  const printFlyer = () => {
    if (!svgRef.current) return;
    setIsGeneratingFlyer(true);

    try {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgDataBase64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);

      const printWindow = window.open('', '_blank', 'width=850,height=1100');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Fragrant Breeze Golf Tournament - QR Poster Badge</title>
            <style>
              @page { size: letter portrait; margin: 0; }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 2.5rem;
                background: #ffffff;
                color: #0f172a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .poster-card {
                width: 100%;
                max-width: 680px;
                border: 4px solid #1E4D2B;
                border-radius: 24px;
                padding: 2.5rem;
                text-align: center;
                box-shadow: inset 0 0 0 2px #D4AF37;
                background: #ffffff;
              }
              .badge-header {
                background: #1E4D2B;
                color: #ffffff;
                padding: 1.25rem 1.5rem;
                border-radius: 16px;
                margin-bottom: 2rem;
                border: 1px solid #D4AF37;
              }
              .badge-header h1 {
                font-size: 1.8rem;
                margin: 0;
                font-weight: 800;
                letter-spacing: 0.05em;
                color: #F6E8B6;
              }
              .badge-header p {
                margin: 0.4rem 0 0 0;
                font-size: 0.9rem;
                color: #e2e8f0;
              }
              .qr-container {
                display: inline-block;
                padding: 1.5rem;
                background: #ffffff;
                border-radius: 20px;
                border: 2px solid #e2e8f0;
                margin: 1rem 0;
              }
              .qr-container img {
                width: 280px;
                height: 280px;
                display: block;
              }
              .label-text {
                font-size: 1.35rem;
                font-weight: 800;
                color: #1E4D2B;
                margin: 1rem 0 0.25rem 0;
                text-transform: uppercase;
                letter-spacing: 0.03em;
              }
              .url-text {
                font-family: monospace;
                font-size: 0.95rem;
                color: #475569;
                word-break: break-all;
                margin-top: 0.25rem;
              }
              .event-footer {
                margin-top: 2rem;
                padding-top: 1.25rem;
                border-top: 2px dashed #cbd5e1;
                font-size: 0.85rem;
                color: #64748b;
              }
              .event-date {
                font-weight: 700;
                color: #1E4D2B;
                font-size: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="poster-card">
              <div class="badge-header">
                <h1>Fragrant Breeze Golf Tournament</h1>
                <p>In Loving Memory of Naseem Mohammed &bull; Official Event Portal</p>
              </div>

              <div class="qr-container">
                <img src="${svgDataBase64}" alt="Branded Event QR Code" />
              </div>

              <div class="label-text">${qrLabel || 'Scan to Access Tournament Portal'}</div>
              <div class="url-text">${customUrl}</div>

              <div class="event-footer">
                <div class="event-date">Monday, October 5, 2026 &bull; Burford Golf Links</div>
                <p style="margin-top: 6px;">Point your smartphone camera at the QR code above to scan.</p>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        if (addToast) addToast('info', 'Printing QR Poster', 'Opening print preview dialog...');
        window.print();
      }
    } catch (err) {
      console.error('Print poster error:', err);
      window.print();
    } finally {
      setIsGeneratingFlyer(false);
    }
  };

  const logoSrc = getLogoSrc();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1E4D2B] via-[#15381E] to-slate-900 text-white flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#1E4D2B] rounded-[10px] flex items-center justify-center">
                <QrCode className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold font-serif-heading tracking-wide">
                  Branded QR Code Generator
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Centered Emblem
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                Generate high-resolution vector &amp; PNG QR codes for print flyers, posters, and golfer passes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-slate-800 dark:text-slate-100">
            {/* Step 1: Destination Preset */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1E4D2B] dark:text-amber-300 max-sm:text-white max-sm:font-extrabold max-sm:bg-[#1E4D2B] max-sm:px-3 max-sm:py-1.5 max-sm:rounded-lg mb-2 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#1E4D2B] dark:text-amber-300 max-sm:text-white" />
                <span>1. Select Destination Preset</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('register')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    selectedPreset === 'register'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 text-[#1E4D2B] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <div className="text-xs">Register Page</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Golfer Registration</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('donate')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    selectedPreset === 'donate'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 text-[#1E4D2B] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-xs">Donate Portal</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Memorial Gifts</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('sponsors')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    selectedPreset === 'sponsors'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 text-[#1E4D2B] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs">Sponsors</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Corporate Packages</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('schedule')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    selectedPreset === 'schedule'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 text-[#1E4D2B] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-xs">Itinerary</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Tournament Schedule</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('venue')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    selectedPreset === 'venue'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 text-[#1E4D2B] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs">GPS Directions</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Burford Golf Links</div>
                  </div>
                </button>
              </div>

              {/* Callout Label Input */}
              <div className="mt-3">
                <input
                  type="text"
                  value={qrLabel}
                  onChange={(e) => setQrLabel(e.target.value)}
                  placeholder="Flyer Callout Label (e.g., Scan to Register)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>
            </div>

            {/* Step 2: Centered Logo / Emblem */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1E4D2B] dark:text-amber-300 max-sm:text-white max-sm:font-extrabold max-sm:bg-[#1E4D2B] max-sm:px-3 max-sm:py-1.5 max-sm:rounded-lg mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1E4D2B] dark:text-amber-300 max-sm:text-white" />
                <span>2. Centered Logo / Emblem Icon</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setLogoOption('trophy')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    logoOption === 'trophy'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Trophy className="w-5 h-5 text-[#1E4D2B] mx-auto mb-1" />
                  <span className="text-[11px] block">Green Trophy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoOption('heart')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    logoOption === 'heart'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mx-auto mb-1" />
                  <span className="text-[11px] block">Memorial Heart</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoOption('gold')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    logoOption === 'gold'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <span className="text-[11px] block">Gold Crest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoOption('none')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    logoOption === 'none'
                      ? 'border-[#1E4D2B] bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <X className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] block">No Logo</span>
                </button>
              </div>
            </div>

            {/* Step 3: Brand Colors */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1E4D2B] dark:text-amber-300 max-sm:text-white max-sm:font-extrabold max-sm:bg-[#1E4D2B] max-sm:px-3 max-sm:py-1.5 max-sm:rounded-lg mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#1E4D2B] dark:text-amber-300 max-sm:text-white" />
                <span>3. Brand Color Styling</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#1E4D2B');
                    setBgColor('#FFFFFF');
                  }}
                  className="p-2 bg-[#1E4D2B] text-white rounded-xl border border-slate-300 text-xs font-bold transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white shrink-0 border border-slate-400" />
                  <span>Emerald / White</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#0F2D17');
                    setBgColor('#F6E8B6');
                  }}
                  className="p-2 bg-[#0F2D17] text-[#D4AF37] rounded-xl border border-amber-300 text-xs font-bold transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F6E8B6] shrink-0 border border-amber-400" />
                  <span>Forest &amp; Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#1e3a8a');
                    setBgColor('#FFFFFF');
                  }}
                  className="p-2 bg-[#1e3a8a] text-white rounded-xl border border-slate-300 text-xs font-bold transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white shrink-0 border border-slate-400" />
                  <span>Royal Blue</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#0f172a');
                    setBgColor('#FFFFFF');
                  }}
                  className="p-2 bg-[#0f172a] text-white rounded-xl border border-slate-300 text-xs font-bold transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white shrink-0 border border-slate-400" />
                  <span>Midnight Dark</span>
                </button>
              </div>

              {/* Custom Color Pickers */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">QR Pattern Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Background Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center space-y-1 mb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#1E4D2B] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Live Canvas
              </span>
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Centered Emblem
              </h4>
            </div>

            {/* QR Card Container */}
            <div
              className="p-6 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: bgColor }}
            >
              <div className="relative">
                <QRCodeSVG
                  ref={svgRef}
                  value={customUrl || currentOrigin}
                  size={220}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                  includeMargin={includeMargin}
                  imageSettings={
                    logoSrc
                      ? {
                          src: logoSrc,
                          x: undefined,
                          y: undefined,
                          height: logoSize,
                          width: logoSize,
                          opacity: 1,
                          excavate: true
                        }
                      : undefined
                  }
                />
              </div>

              {/* Label below QR */}
              {qrLabel && (
                <div className="mt-4 text-center max-w-[220px]">
                  <p className="text-xs font-bold text-slate-900 font-serif-heading leading-tight" style={{ color: fgColor }}>
                    {qrLabel}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {customUrl}
                  </p>
                </div>
              )}
            </div>

            {/* Export & Action Buttons */}
            <div className="w-full mt-6 space-y-2">
              <button
                type="button"
                onClick={downloadPng}
                className="w-full py-2.5 px-4 bg-[#1E4D2B] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download High-Res PNG (Print Ready)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={downloadSvg}
                  className="py-2 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`py-2 px-3 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Image'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={printFlyer}
                className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print QR Poster Badge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              6th Annual Fragrant Breeze Golf Tournament &bull; Monday, Oct 5, 2026 &bull; Burford Golf Links
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition cursor-pointer"
          >
            Close Generator
          </button>
        </div>
      </div>
    </div>
  );
};
