import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Trophy } from 'lucide-react';

interface SplashScreenProps {
  duration?: number; // in milliseconds (default 2500ms = 2.5s)
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  duration = 2500,
  onComplete,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    try {
      localStorage.setItem('fragrant_breeze_splash_shown', 'true');
      sessionStorage.setItem('fragrant_breeze_splash_shown', 'true');
    } catch {
      // ignore
    }

    const startTime = Date.now();
    const intervalMs = 30;

    const timer = setInterval(() => {
      const currentElapsed = Date.now() - startTime;
      if (currentElapsed >= duration) {
        clearInterval(timer);
        setElapsed(duration);
        setIsExiting(true);

        // Allow 400ms fade-out transition before unmounting
        setTimeout(() => {
          setShouldRender(false);
          onCompleteRef.current?.();
        }, 400);
      } else {
        setElapsed(currentElapsed);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [duration]);

  const handleManualDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExiting(true);
    setShouldRender(false);
    try {
      localStorage.setItem('fragrant_breeze_splash_shown', 'true');
      sessionStorage.setItem('fragrant_breeze_splash_shown', 'true');
    } catch {
      // ignore
    }
    onCompleteRef.current?.();
  };

  if (!shouldRender) {
    return null;
  }

  const progressPercent = Math.min(100, Math.round((elapsed / duration) * 100));
  const remainingSeconds = Math.max(1, Math.ceil((duration - elapsed) / 1000));

  return (
    <div
      id="app-splash-screen"
      role="dialog"
      aria-label="Fragrant Breeze Golf Tournament Launch"
      onClick={handleManualDismiss}
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #245e34 0%, #1E4D2B 45%, #102917 100%)',
      }}
    >
      {/* Background Subtle Ambient Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-[#D4AF37]/15 pointer-events-none animate-pulse" />
      </div>

      {/* Main Branding Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* LOGO CONTAINER */}
        <div className="relative mb-6 sm:mb-7 group">
          {/* Subtle Outer Glowing Halo */}
          <div className="absolute -inset-2.5 bg-gradient-to-tr from-[#D4AF37] via-amber-200 to-[#AA771C] rounded-[32px] opacity-35 blur-md animate-pulse pointer-events-none" />

          {/* Golden Crest Border */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-[2.5px] bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#8C5D12] shadow-2xl">
            <div className="w-full h-full rounded-[22px] bg-[#122e1a] flex items-center justify-center p-3.5 sm:p-4 overflow-hidden border border-emerald-700/40">
              <img
                src="/android-chrome-192x192.png"
                alt="Charity Golf - Fragrant Breeze Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>

        {/* LINE 1 & LINE 2 (Exact requested text) */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Line 1 - Fragrant Breeze */}
          <h1
            id="splash-line-1"
            className="font-crest text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide text-center drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] leading-tight"
          >
            Fragrant Breeze
          </h1>

          {/* Line 2 - Golf Tournament */}
          <h2
            id="splash-line-2"
            className="font-crest text-base sm:text-lg md:text-xl font-bold tracking-[0.22em] sm:tracking-[0.28em] text-[#D4AF37] uppercase text-center drop-shadow-sm leading-tight"
          >
            Golf Tournament
          </h2>
        </div>

        {/* Memorial Dedication Subline */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0 inline animate-pulse" />
            <span>In Loving Memory of Naseem Mohammed</span>
          </p>
          <p className="text-[10.5px] sm:text-[11.5px] text-amber-200/75 tracking-wider uppercase font-semibold">
            Burford Golf Links • October 5, 2026
          </p>
        </div>

        {/* 2.5-Second Progress Bar */}
        <div className="mt-8 sm:mt-9 w-60 sm:w-68 max-w-[85vw] flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-emerald-950/80 rounded-full overflow-hidden border border-[#D4AF37]/35 p-[1px] shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-75 ease-linear shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-[10px] text-emerald-200/80 font-mono tracking-wider px-1">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>LAUNCHING APP</span>
            </span>
            <span className="text-amber-300 font-bold">{remainingSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Skip Button at bottom */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-auto z-20">
        <button
          type="button"
          onClick={handleManualDismiss}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-full border border-amber-300 shadow-xl transition transform hover:scale-105 cursor-pointer"
        >
          <span>Tap Anywhere or Click Here to Enter App &rarr;</span>
        </button>
      </div>
    </div>
  );
};
