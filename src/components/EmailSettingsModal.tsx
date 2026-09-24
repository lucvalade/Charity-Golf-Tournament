import React, { useState, useEffect } from 'react';
import { Mail, Server, CheckCircle, AlertCircle, X, Key, ShieldCheck, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface EmailSettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInlineScreen?: boolean;
}

export const EmailSettingsModal: React.FC<EmailSettingsModalProps> = ({ isOpen, onClose, isInlineScreen }) => {
  const [smtpUser, setSmtpUser] = useState('luc.valade@gmail.com');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasPasswordOnServer, setHasPasswordOnServer] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean; helpUrl?: string } | null>(null);

  useEffect(() => {
    if (!isOpen && !isInlineScreen) return;

    // Load from localStorage if present
    const cached = localStorage.getItem('fb_smtp_pass');
    if (cached) {
      setPassword(cached);
    }

    // Check backend status
    fetch('/api/smtp-config')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setSmtpUser(data.user);
        if (data.host) setSmtpHost(data.host);
        if (data.port) setSmtpPort(data.port);
        if (data.hasPassword) setHasPasswordOnServer(true);
      })
      .catch((err) => console.warn('Failed to load smtp config from server', err));
  }, [isOpen, isInlineScreen]);

  if (!isOpen && !isInlineScreen) return null;

  const handleSave = async () => {
    if (!password.trim()) {
      setStatusMsg({ text: 'Please enter a password before saving.', isError: true });
      return;
    }
    setIsSaving(true);
    setStatusMsg(null);
    try {
      localStorage.setItem('fb_smtp_pass', password.trim());
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password.trim(),
          user: smtpUser.trim(),
          host: smtpHost.trim(),
          port: smtpPort
        })
      });
      const data = await res.json();
      if (data.success) {
        setHasPasswordOnServer(true);
        setStatusMsg({
          text: 'Google Workspace Gmail credentials saved and active on server!',
          isError: false
        });
      } else {
        setStatusMsg({ text: data.error || 'Failed to update backend settings', isError: true });
      }
    } catch (e: any) {
      localStorage.setItem('fb_smtp_pass', password.trim());
      setStatusMsg({
        text: 'Password saved in browser storage and will be sent with registration requests.',
        isError: false
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!password.trim()) {
      setStatusMsg({ text: 'Please enter a password to test the connection.', isError: true });
      return;
    }
    setIsTesting(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password.trim(),
          user: smtpUser.trim(),
          host: smtpHost.trim(),
          port: smtpPort
        })
      });
      const data = await res.json();
      if (data.success) {
        setHasPasswordOnServer(true);
        setStatusMsg({
          text: `Connection verified! Authenticated successfully with ${smtpHost}:${smtpPort} as ${smtpUser}.`,
          isError: false
        });
      } else {
        setStatusMsg({
          text: data.error || 'Connection failed. For Google Workspace/Gmail, ensure an App Password is used.',
          isError: true,
          helpUrl: data.helpUrl || (data.isAuthError ? 'https://myaccount.google.com/apppasswords' : undefined)
        });
      }
    } catch (e: any) {
      setStatusMsg({
        text: e.message || 'Error reaching backend server.',
        isError: true
      });
    } finally {
      setIsTesting(false);
    }
  };

  const formContent = (
    <div className="space-y-4 pt-1">
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600">SMTP Host (Outgoing):</span>
          <span className="font-mono font-bold text-slate-900">{smtpHost}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600">Port &amp; Encryption:</span>
          <span className="font-mono font-bold text-slate-900">Port {smtpPort} (TLS)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600">IMAP Host (Incoming):</span>
          <span className="font-mono font-bold text-slate-900">imap.gmail.com:993 (SSL)</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
          <span className="font-semibold text-slate-600">Registration Recipient:</span>
          <span className="font-mono font-bold text-[#1E4D2B]">luc.valade@gmail.com (Pre-Launch: Luc Valade)</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          SMTP Sender Account (Email Address)
        </label>
        <input
          type="email"
          value={smtpUser}
          onChange={(e) => {
            setSmtpUser(e.target.value.trim());
            setStatusMsg(null);
          }}
          placeholder="e.g. luc.valade@gmail.com or sales@aiopenhouseconnect.com"
          className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white font-semibold text-slate-900"
        />
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[10.5px] text-slate-500 font-medium">Quick Select:</span>
          <button
            type="button"
            onClick={() => {
              setSmtpUser('luc.valade@gmail.com');
              setStatusMsg(null);
            }}
            className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold cursor-pointer transition ${
              smtpUser === 'luc.valade@gmail.com'
                ? 'bg-[#1E4D2B] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            luc.valade@gmail.com
          </button>
          <button
            type="button"
            onClick={() => {
              setSmtpUser('sales@aiopenhouseconnect.com');
              setStatusMsg(null);
            }}
            className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold cursor-pointer transition ${
              smtpUser === 'sales@aiopenhouseconnect.com'
                ? 'bg-[#1E4D2B] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            sales@aiopenhouseconnect.com
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Google Workspace 16-Character App Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Key className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStatusMsg(null);
            }}
            placeholder="Enter your 16-character App Password (e.g. abcd efgh ijkl mnop)"
            className="w-full pl-9 pr-12 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4D2B] bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Warning if user typed account password */}
        {password.length > 0 && (/[!@#$%^&*(),.?":{}|<>]/.test(password) || (password.replace(/\s+/g, '').length !== 16 && password.replace(/\s+/g, '').length > 5)) && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Heads up:</span> This appears to be your standard email account login password. Google Workspace systematically rejects regular passwords over SMTP with <strong>Error 535 Bad Credentials</strong>. You must generate and enter a 16-character App Password.
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1E4D2B]" />
              <span>How to generate your App Password:</span>
            </span>
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E4D2B] hover:underline font-bold text-[11px] inline-flex items-center gap-1 shrink-0"
            >
              <span>Open Google App Passwords</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 leading-relaxed pl-1">
            <li>
              Make sure you are logged into the Google Account matching the sender above: <strong className="font-mono text-slate-900 bg-emerald-100/70 px-1 py-0.5 rounded">{smtpUser}</strong>.
            </li>
            <li>Ensure <strong>2-Step Verification</strong> is ON for this account.</li>
            <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-[#1E4D2B] underline font-semibold">myaccount.google.com/apppasswords</a>.</li>
            <li>Enter App name <span className="font-mono bg-slate-200 px-1 rounded text-slate-800">Fragrant Breeze</span> and click <strong>Create</strong>.</li>
            <li>Copy the <strong>16-letter passcode</strong> (e.g. <code className="font-mono bg-amber-100 px-1 rounded text-amber-900">xxxx xxxx xxxx xxxx</code>) and paste it above.</li>
          </ol>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-[10.5px] text-blue-900 mt-2">
            <strong>Important:</strong> Google App Passwords are tied strictly to the Google Account they are created under. If your App Password was created while logged into <em>luc.valade@gmail.com</em>, set the sender above to <em>luc.valade@gmail.com</em>. If you want to send from <em>sales@aiopenhouseconnect.com</em>, switch Google accounts first before generating the password.
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex flex-col gap-2 ${
            statusMsg.isError
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-start gap-2">
            {statusMsg.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            )}
            <span className="leading-relaxed">{statusMsg.text}</span>
          </div>
          {statusMsg.helpUrl && (
            <div className="pt-1.5 pl-6">
              <a
                href={statusMsg.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-[11px] rounded-lg shadow-xs transition"
              >
                <span>Open Google App Passwords</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {hasPasswordOnServer && !statusMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Password configured on backend server. Ready to dispatch registration emails!</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 min-w-[120px] py-2.5 bg-[#1E4D2B] hover:bg-[#15381E] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={isTesting}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          type="button"
          onClick={async () => {
            setIsTesting(true);
            setStatusMsg(null);
            try {
              const res = await fetch('/api/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  password: password.trim(),
                  user: smtpUser.trim(),
                  recipient: 'luc.valade@gmail.com'
                })
              });
              const data = await res.json();
              if (data.success) {
                setStatusMsg({
                  text: data.message || 'Live test email dispatched successfully to luc.valade@gmail.com!',
                  isError: false
                });
              } else {
                setStatusMsg({
                  text: data.error || 'Failed to dispatch test email',
                  isError: true,
                  helpUrl: data.helpUrl
                });
              }
            } catch (e: any) {
              setStatusMsg({ text: e.message || 'Failed to dispatch test email', isError: true });
            } finally {
              setIsTesting(false);
            }
          }}
          disabled={isTesting}
          className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-emerald-700" />
          <span>Send Test Email</span>
        </button>
      </div>
    </div>
  );

  if (isInlineScreen) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4 max-w-3xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center">
            <Mail className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Google Workspace Email Configuration
            </h3>
            <p className="text-xs text-slate-600">
              Configure smtp.gmail.com (sales@aiopenhouseconnect.com) to automatically dispatch golfer registrations to Luc Valade (luc.valade@gmail.com).
            </p>
          </div>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-800/30 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Google Workspace Email Delivery</h3>
              <p className="text-xs text-emerald-200">
                Outgoing SMTP Server &bull; Fragrant Breeze Golf Tournament
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {formContent}
        </div>
      </div>
    </div>
  );
};
