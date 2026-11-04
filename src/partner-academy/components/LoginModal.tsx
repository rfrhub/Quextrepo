import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, Shield, X, Lock } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  isClosable?: boolean;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  isClosable = false,
  onLoginSuccess,
}) => {
  const { loginWithCredentials } = useAuth();

  // Extract initial code & email from query params if passed via direct link
  const [loginCompanyCode, setLoginCompanyCode] = useState(() => {
    if (typeof window === 'undefined') return '';
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const params = new URLSearchParams(search || (hash.includes('?') ? hash.split('?')[1] : ''));
    return params.get('code') || params.get('accessCode') || params.get('key') || '';
  });

  const [loginEmail, setLoginEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const params = new URLSearchParams(search || (hash.includes('?') ? hash.split('?')[1] : ''));
    return params.get('email') || '';
  });

  const [loginError, setLoginError] = useState('');

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginCompanyCode.trim() || !loginEmail.trim()) {
      setLoginError('Please enter both your Partner Secure Access Code and Technician Email.');
      return;
    }

    const success = loginWithCredentials(loginEmail.trim(), loginCompanyCode.trim());
    if (success) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quext_partner_portal_authenticated', 'true');
      }
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setLoginError(
        'Invalid partner secure access code or email. Please check the code provided by your Quext Project Manager.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (isClosable && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative my-3 sm:my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button - strictly only shown if isClosable is true */}
        {isClosable && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="pb-5 border-b border-slate-800">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Quext Partner Access Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Company &amp; Role Authentication Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Enter your encrypted Partner Secure Access Code (provided by your Quext PM) along with your technician email to authenticate into your partner organization.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4 pt-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Partner Secure Access Code
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. QX-SPR-9F4K-82A1 or GAS-4829103"
                value={loginCompanyCode}
                onChange={(e) => setLoginCompanyCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Enter your contractor organization&apos;s cryptographic token (e.g. QX-SPR-9F4K-82A1) or 7-digit code.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Technician Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="installer@partnerfirm.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Used to record certification credentials, quiz completions, and SOW execution audits.
            </span>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-lg shadow-blue-900/30 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Sign In to Company Portal</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Need access? Contact your Quext Implementation Project Manager to receive an authorized access code for your firm.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
