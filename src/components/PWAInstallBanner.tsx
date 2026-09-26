import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTournament } from '../context/TournamentContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Monitor, Smartphone, X, Sparkles, QrCode } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isDesktop } = usePWAInstall();
  const { openQrGeneratorModal } = useTournament();
  const [isDismissed, setIsDismissed] = useState(true); // default true until checked

  useEffect(() => {
    // Check if user dismissed banner in this session
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  // Do not show if app is already running as installed PWA or dismissed
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <aside
      aria-label="App Installation Notice"
      className="bg-gradient-to-r from-[#15381E] via-[#1E4D2B] to-[#15381E] border-b border-[#D4AF37]/30 text-white shadow-md relative z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Icon & Description */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-[#0F2916] border border-[#D4AF37]/50 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
            <img
              src="/android-chrome-192x192.png"
              alt="FBGT"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight">FBGT App</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-semibold border border-amber-400/30">
                <Sparkles className="w-2.5 h-2.5" />
                {isDesktop ? 'Desktop App' : 'Mobile & Tablet App'}
              </span>
            </div>
            <p className="text-emerald-100/90 text-xs truncate sm:whitespace-normal">
              {isDesktop
                ? 'Install FBGT on your computer for instant desktop access and offline tournament schedules.'
                : 'Install FBGT to your home screen for quick mobile check-in, scoring, and schedule.'}
            </p>
          </div>
        </div>

        {/* Right: Install Action & QR Code & Dismiss */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <PWAInstallButton
            variant="nav"
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          />

          <button
            type="button"
            onClick={openQrGeneratorModal}
            className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-[#D4AF37]/60 shadow-xs transition cursor-pointer whitespace-nowrap"
            title="Open Branded QR Code Generator & Options"
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>QR Code</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss app install notice"
            title="Dismiss notice"
            className="p-1.5 text-emerald-300 hover:text-white rounded-md hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
