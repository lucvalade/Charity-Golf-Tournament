import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, RefreshCw, Key } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇨🇦' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇨🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Filipino', flag: '🇵🇭' },
];

function getActiveLanguageFromCookie(): string {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : 'en';
}

interface LanguageSelectorProps {
  isMobile?: boolean;
  onLanguageChange?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false, onLanguageChange }) => {
  const { openApiKeyModal } = useTournament();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCode(getActiveLanguageFromCookie());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectLanguage = (code: string) => {
    setIsTranslating(true);
    setActiveCode(code);
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange();

    // Set Google Translate cookie
    const domain = window.location.hostname;
    if (code === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `googtrans=/en/en; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=${domain};`;
    }

    // Trigger Google Translate widget select element if available
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      setTimeout(() => setIsTranslating(false), 600);
    } else {
      // If widget isn't fully ready yet, reload page to activate cookie translation
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === activeCode) || LANGUAGES[0];

  // Mobile layout
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-amber-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-300" />
            <span>Language / Langue</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            {currentLang.flag} {currentLang.nativeName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1">
          {LANGUAGES.map((lang) => {
            const isSelected = activeCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#0F2D17] font-bold shadow-sm'
                    : 'bg-emerald-950/60 text-slate-200 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* API Key Configure Button removed: managed exclusively in Admin portal */}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-100 bg-[#14381E] hover:bg-emerald-900/80 border border-emerald-700/60 hover:border-[#D4AF37]/60 transition cursor-pointer shadow-sm group"
        title="Translate Website (Google Translate)"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
        <span className="flex items-center gap-1">
          <span className="text-xs">{currentLang.flag}</span>
          <span className="font-bold uppercase tracking-wider">{currentLang.code.split('-')[0]}</span>
        </span>
        {isTranslating ? (
          <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />
        ) : (
          <ChevronDown
            className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-300' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#14381E] border border-[#D4AF37]/40 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-200/70 border-b border-emerald-800/80 flex items-center justify-between">
            <span>Select Language</span>
            <span className="text-emerald-400/80 font-mono text-[9px]">Google Translate</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = activeCode === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-800/80 text-amber-200 font-bold'
                      : 'text-slate-100 hover:bg-emerald-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <div className="font-medium text-slate-100 group-hover:text-amber-200">
                        {lang.nativeName}
                      </div>
                      <div className="text-[10px] text-slate-400">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-emerald-800/80 bg-emerald-950/40 text-[10px] text-slate-400 text-center">
            Powered by Google Translate
          </div>
        </div>
      )}
    </div>
  );
};
