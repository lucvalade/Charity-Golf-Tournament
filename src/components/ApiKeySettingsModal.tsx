import React, { useState, useEffect } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  X,
  Languages,
  Save,
  Trash2
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

export interface ApiKeysState {
  googleTranslateApiKey: string;
}

const STORAGE_KEY = 'saied_tournament_google_translate_key_v1';

export function getStoredTranslateApiKey(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved;
    }
  } catch (e) {
    console.error('Failed to parse stored Google Translate key', e);
  }
  return (import.meta as any).env?.VITE_GOOGLE_TRANSLATE_API_KEY || '';
}

export function saveStoredTranslateApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch (e) {
    console.error('Failed to save Google Translate key to local storage', e);
  }
}

// Backward compatibility export for any existing imports
export function getStoredApiKeys(): { googleTranslateApiKey: string } {
  return { googleTranslateApiKey: getStoredTranslateApiKey() };
}

interface ApiKeySettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInlineScreen?: boolean;
}

export const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({
  isOpen = true,
  onClose,
  isInlineScreen = false
}) => {
  const { addToast } = useTournament();

  const [apiKey, setApiKey] = useState<string>(getStoredTranslateApiKey);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Testing states
  const [testingTranslate, setTestingTranslate] = useState(false);
  const [translateTestResult, setTranslateTestResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredTranslateApiKey());
      setTranslateTestResult({ status: null, message: '' });
    }
  }, [isOpen]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredTranslateApiKey(apiKey.trim());
    addToast(
      'success',
      'API Key Saved',
      'GOOGLE_TRANSLATE_API_KEY has been saved securely to your local configuration.'
    );
    if (onClose && !isInlineScreen) {
      onClose();
    }
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestGoogleTranslate = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTranslateTestResult({
        status: 'error',
        message: 'Please paste your Google Cloud Translation API Key first.'
      });
      return;
    }

    setTestingTranslate(true);
    setTranslateTestResult({ status: null, message: 'Validating API key with Google Cloud Translation...' });

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(
          keyToTest
        )}&q=${encodeURIComponent('Welcome to the Charity Golf Tournament')}&target=fr`
      );

      const data = await response.json();

      if (response.ok && data?.data?.translations?.[0]?.translatedText) {
        setTranslateTestResult({
          status: 'success',
          message: `Connected successfully! Verification response: "${data.data.translations[0].translatedText}"`
        });
        addToast('success', 'API Key Verified', 'Google Cloud Translation API is connected and operating.');
      } else {
        const errorMsg = data?.error?.message || 'Invalid API key or Cloud Translation API is not enabled in your Google Cloud Project.';
        setTranslateTestResult({
          status: 'error',
          message: `Connection failed: ${errorMsg}`
        });
      }
    } catch (err: any) {
      setTranslateTestResult({
        status: 'error',
        message: `Network error verifying key: ${err.message || 'Please check your internet connection.'}`
      });
    } finally {
      setTestingTranslate(false);
    }
  };

  const handleClearKey = () => {
    if (window.confirm('Are you sure you want to clear the stored Google Translate API key?')) {
      setApiKey('');
      saveStoredTranslateApiKey('');
      setTranslateTestResult({ status: null, message: '' });
      addToast('info', 'API Key Removed', 'Stored Google Translate API key has been cleared.');
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#1E4D2B] to-[#15381E] text-white p-5 rounded-2xl border border-emerald-700/60 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
              <Languages className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif">Google Translate API Key</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900 border border-emerald-600 text-amber-200">
                  Multilingual Setup
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-xl leading-relaxed">
                Configure your Google Cloud Translation API Key to enable automated, high-fidelity real-time language translations across all tournament pages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-700 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Local Storage</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Card: GOOGLE_TRANSLATE_API_KEY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">GOOGLE_TRANSLATE_API_KEY</h4>
                <p className="text-xs text-slate-500">
                  Google Cloud Translation API v2 / Cloud Translation Basic credential.
                </p>
              </div>
            </div>
            <div>
              {apiKey.trim() ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Configured</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Default Widget Active
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full font-mono text-xs px-3.5 py-3 pr-24 rounded-xl border border-slate-300 focus:border-[#1E4D2B] focus:ring-2 focus:ring-[#1E4D2B]/20 outline-none transition bg-slate-50/50"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
              <span className="text-[11px] text-slate-500">
                You can obtain or generate this key from your Google Cloud Console.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestGoogleTranslate}
                  disabled={testingTranslate || !apiKey.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testingTranslate ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Test API Connection</span>
                </button>

                <a
                  href="https://console.cloud.google.com/apis/library/translate.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Translation Test Result Banner */}
            {translateTestResult.message && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                  translateTestResult.status === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : translateTestResult.status === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {translateTestResult.status === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {translateTestResult.status === 'error' && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="font-medium leading-relaxed">{translateTestResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* How to get a Google Cloud Translation API Key */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>How to setup in Google Cloud Console:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Go to <strong>Google Cloud Console</strong> &gt; <strong>APIs &amp; Services</strong>.</li>
            <li>Enable <strong>Cloud Translation API</strong> for your project.</li>
            <li>Go to <strong>Credentials</strong> &gt; <strong>Create Credentials</strong> &gt; <strong>API Key</strong>.</li>
            <li>Optionally restrict the API key to <strong>Cloud Translation API</strong> and paste it above.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClearKey}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stored Key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onClose && !isInlineScreen && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer text-center"
              >
                Close
              </button>
            )}
            <button
              type="submit"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-[#0F2D17] bg-[#D4AF37] hover:bg-[#c49f2f] rounded-xl shadow-md transition cursor-pointer text-center"
            >
              <Save className="w-4 h-4" />
              <span>Save API Key</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  // If used as an embedded screen inside AdminPortalPage
  if (isInlineScreen) {
    return content;
  }

  // Modal Presentation
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E4D2B] text-white border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100">
              Google Translate API Key
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};
