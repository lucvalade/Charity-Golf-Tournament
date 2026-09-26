import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTournament } from '../context/TournamentContext';
import { Smartphone, Monitor, Download, X, Share, CheckCircle2, ArrowRight, QrCode } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'hero' | 'banner' | 'compact';
  onInstallStarted?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav',
  onInstallStarted,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, browserName, install } = usePWAInstall();
  const { openQrGeneratorModal } = useTournament();
  const [showModal, setShowModal] = useState(false);

  // If already running inside standalone PWA mode, don't show install buttons
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    onInstallStarted?.();
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Install FBGT App"
        title="Install FBGT App to Desktop, Tablet, or Phone"
        className={
          className ||
          (variant === 'compact'
            ? 'px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/50 rounded-lg flex items-center gap-1.5 transition cursor-pointer'
            : 'px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer')
        }
      >
        {isDesktop ? <Monitor className="w-3.5 h-3.5 text-slate-900" /> : <Smartphone className="w-3.5 h-3.5 text-slate-900" />}
        <span>Install App</span>
      </button>

      {/* Cross-Platform Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-13 h-13 rounded-2xl bg-[#1E4D2B] border-2 border-[#D4AF37] flex items-center justify-center p-2 shadow-sm shrink-0">
                <img
                  src="/android-chrome-192x192.png"
                  alt="FBGT App Icon"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#1E4D2B] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Progressive Web App
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-heading">Install "FBGT"</h3>
                <p className="text-xs text-slate-500">Standalone app shortcut named FBGT</p>
              </div>
            </div>

            {/* If direct browser prompt is available, offer single-click install */}
            {isInstallable && (
              <div className="mb-4">
                <button
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowModal(false);
                  }}
                  className="w-full py-3 px-4 bg-[#1E4D2B] hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Click to Install Immediately</span>
                </button>
                <div className="mt-2 text-center text-[11px] text-slate-400">or follow the manual steps below:</div>
              </div>
            )}

            {/* Step-by-Step Instructions based on OS / Browser */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {isIOS ? (
                // iOS Safari
                <>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>iPhone &amp; iPad (Safari)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      Tap the <strong className="text-slate-900 inline-flex items-center gap-1">Share button <Share className="w-3.5 h-3.5 text-blue-600 inline" /></strong> in the bottom Safari toolbar.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      Confirm name is <strong className="text-slate-900">"FBGT"</strong> and tap <strong className="text-emerald-700">Add</strong> in the top-right.
                    </div>
                  </div>
                </>
              ) : isDesktop ? (
                // Desktop (Chrome, Edge, Safari, Brave)
                <>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Desktop Installation ({browserName === 'edge' ? 'Microsoft Edge' : browserName === 'safari' ? 'macOS Safari' : 'Google Chrome / Browser'})</span>
                  </div>
                  {browserName === 'safari' ? (
                    <>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <div>In the top Mac menu bar, click <strong className="text-slate-900">File</strong>.</div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <div>Select <strong className="text-slate-900">Add to Dock...</strong></div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <div>Click <strong className="text-emerald-700">Add</strong> to create the desktop app.</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <div>Look at the right side of your browser address bar for the <strong className="text-slate-900">Install icon</strong> (a computer monitor with down arrow or ⊕ symbol).</div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <div>Or click the browser menu <strong className="text-slate-900">(⋮)</strong> at top right &rarr; select <strong className="text-slate-900">Save and share</strong> &rarr; <strong className="text-emerald-700">Install FBGT</strong>.</div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <div>Click <strong className="text-emerald-700">Install</strong> to add the app to your Desktop and Taskbar.</div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Android & other Mobile devices
                <>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Android, Tablet &amp; Mobile</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>Tap the browser menu <strong className="text-slate-900">(⋮)</strong> at top right.</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>Tap <strong className="text-slate-900">Install app</strong> or <strong className="text-slate-900">Add to Home screen</strong>.</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>Confirm <strong className="text-slate-900">"FBGT"</strong> to save the app icon to your home screen.</div>
                  </div>
                </>
              )}
            </div>

            {/* Benefits */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No App Store needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full screen experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant 1-tap launch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Offline schedule access</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  openQrGeneratorModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#1E4D2B] hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>QR Code Options</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
