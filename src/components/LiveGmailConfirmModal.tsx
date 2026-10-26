import React, { useState, useEffect } from 'react';
import {
  subscribeToGmailAuth,
  sendRealGmailEmail,
  googleSignIn,
  buildGmailWebComposeUrl,
  logout,
} from '../services/gmailService';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  Mail,
  Send,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  LogOut,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export interface LiveGmailModalPayload {
  title: string;
  defaultRecipients: string;
  subject: string;
  htmlBody: string;
  previewSummary?: string;
  onDispatched: (result: {
    recipients: string[];
    subject: string;
    gmailMessageId?: string;
    sentViaGmail: boolean;
  }) => void;
}

interface LiveGmailConfirmModalProps {
  payload: LiveGmailModalPayload | null;
  onClose: () => void;
}

export const LiveGmailConfirmModal: React.FC<LiveGmailConfirmModalProps> = ({
  payload,
  onClose,
}) => {
  const isNetworkHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const [recipientInput, setRecipientInput] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState<boolean>(isNetworkHost);

  useEffect(() => {
    const unsub = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setAuthUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (payload) {
      setRecipientInput(payload.defaultRecipients);
      setSubjectInput(payload.subject);
      setErrorMsg(null);
    }
  }, [payload]);

  if (!payload) return null;

  const getCleanRecipients = () =>
    recipientInput
      .split(/[,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

  const handleConfirmAndSendRealEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRecipients = getCleanRecipients();
    if (cleanRecipients.length === 0) {
      setErrorMsg('Please enter at least one recipient email address.');
      return;
    }

    // If on a network IP (phone or local network) and not yet authenticated,
    // Google popup sign-in throws auth/unauthorized-domain in Firebase.
    // Seamlessly open pre-filled in Gmail Web and log the dispatch!
    if (needsAuth && isUnauthorizedDomain) {
      window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
      handleLogAndCompleteWithoutApi(true);
      return;
    }

    setIsSending(true);
    try {
      if (needsAuth) {
        const signInResult = await googleSignIn();
        if (!signInResult) {
          setErrorMsg(
            'Google Sign-In popup was closed before finishing. You can click "Sign in with Google" again, or use "Open in Gmail Web" / "Log Dispatch Only" below.'
          );
          setIsSending(false);
          return;
        }
      }

      const result = await sendRealGmailEmail({
        to: cleanRecipients,
        subject: subjectInput.trim() || payload.subject,
        htmlBody: payload.htmlBody,
      });

      payload.onDispatched({
        recipients: result.recipients,
        subject: subjectInput.trim() || payload.subject,
        gmailMessageId: result.id,
        sentViaGmail: true,
      });
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';
      if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        setIsUnauthorizedDomain(true);
        setErrorMsg(
          `Domain/IP "${typeof window !== 'undefined' ? window.location.hostname : 'current domain'}" is not on Firebase's Authorized Domains list for direct popup sign-ins. You can send this email immediately using "Send via Gmail Web" below.`
        );
      } else if (err?.message === 'NOT_AUTHENTICATED') {
        setNeedsAuth(true);
        setErrorMsg(
          'Please sign in with Google so we can send this email from your Gmail account with your permission.'
        );
      } else {
        setErrorMsg(message || 'Failed to send email via Gmail API.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleLogAndCompleteWithoutApi = (viaComposeTab: boolean) => {
    const cleanRecipients = getCleanRecipients();
    const finalRecipients =
      cleanRecipients.length > 0 ? cleanRecipients : ['RFRleasing@gmail.com'];
    payload.onDispatched({
      recipients: finalRecipients,
      subject: subjectInput.trim() || payload.subject,
      gmailMessageId: viaComposeTab ? `gmail-web-${Date.now()}` : undefined,
      sentViaGmail: viaComposeTab,
    });
    onClose();
  };

  const gmailComposeUrl = buildGmailWebComposeUrl({
    to: recipientInput || 'RFRleasing@gmail.com',
    subject: subjectInput.trim() || payload.subject,
    htmlBody: payload.htmlBody,
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#191E29] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#01C38D]/20 border border-[#01C38D]/40 flex items-center justify-center text-[#01C38D]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">{payload.title}</h3>
              <p className="text-[11px] text-slate-300">
                Confirm recipient(s) and message details before sending a real email via Gmail
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleConfirmAndSendRealEmail}
          className="p-6 space-y-4 overflow-y-auto text-xs flex-1"
        >
          {/* Google Account Connection Banner */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              !needsAuth
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : isUnauthorizedDomain
                ? 'bg-sky-50 border-sky-300 text-sky-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  !needsAuth ? 'text-emerald-600' : isUnauthorizedDomain ? 'text-sky-600' : 'text-amber-600'
                }`}
              />
              <div>
                <div className="font-bold text-xs">
                  {!needsAuth
                    ? `Gmail Connected: ${authUserEmail || 'Authenticated User'}`
                    : isUnauthorizedDomain
                    ? `Mobile / Local Network IP Mode (${typeof window !== 'undefined' ? window.location.hostname : ''})`
                    : 'Connect Gmail to Send Directly via API'}
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {!needsAuth
                    ? 'Ready to dispatch a real HTML email directly to the recipient inboxes below.'
                    : isUnauthorizedDomain
                    ? 'Direct popup sign-in is restricted by Firebase on local network IPs. You can email the customer with 1-click via Gmail Web below!'
                    : 'Sign in with Google for 1-click API delivery, or use "Open in Gmail Web" below.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {needsAuth ? (
                <div className="flex items-center gap-1.5">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLogAndCompleteWithoutApi(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-2xs transition-colors cursor-pointer"
                    title="Open pre-filled in Gmail Web Compose"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Gmail Web</span>
                  </a>
                  {!isUnauthorizedDomain && (
                    <GoogleSignInButton
                      onSuccess={() => setErrorMsg(null)}
                      onError={(msg) => {
                        if (msg.includes('unauthorized-domain')) {
                          setIsUnauthorizedDomain(true);
                        }
                        setErrorMsg(msg);
                      }}
                    />
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-emerald-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Switch or disconnect Google account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Switch Account</span>
                </button>
              )}
            </div>
          </div>

          {/* Editable Recipient(s) & Subject for Real Inbox / Team Stress-Testing */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  To (Real Inbox Recipient Email(s)) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const target = authUserEmail || 'RFRleasing@gmail.com';
                    if (!recipientInput.toLowerCase().includes(target.toLowerCase())) {
                      setRecipientInput((prev) =>
                        prev.trim() ? `${prev.trim()}, ${target}` : target
                      );
                    }
                  }}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Add My Inbox ({authUserEmail || 'RFRleasing@gmail.com'})</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="e.g. RFRleasing@gmail.com, teammate@onequext.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-sky-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Tip: Enter your own email or comma-separated team member emails to stress-test live delivery in real inboxes.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Subject Line *</label>
              <input
                type="text"
                required
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* HTML Email Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email Content Preview (Will Be Sent via Gmail)
              </span>
              <span className="text-[10px] font-mono text-slate-400">HTML Formatted</span>
            </div>
            <div
              className="border border-slate-200 rounded-xl p-4 bg-white max-h-56 overflow-y-auto text-xs text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: payload.htmlBody }}
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              {isUnauthorizedDomain && (
                <div className="pl-6 pt-1 flex items-center gap-2">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLogAndCompleteWithoutApi(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] font-black rounded-lg text-xs shadow-2xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send Pre-Filled via Gmail Web Instead &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Mandatory Confirmation Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLogAndCompleteWithoutApi(true)}
                  className="px-3 py-2 rounded-xl text-[11px] font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors"
                  title="Open pre-filled message in Gmail Web Compose tab and record dispatch"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail Web</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleLogAndCompleteWithoutApi(false)}
                  className="px-3 py-2 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Record dispatch in project log without sending external email"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Log Dispatch Only</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {needsAuth && isUnauthorizedDomain ? (
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLogAndCompleteWithoutApi(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] cursor-pointer"
                    title="Open pre-filled in Gmail Web and record dispatch"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send via Gmail Web &amp; Log Dispatch</span>
                  </a>
                ) : (
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSending
                        ? 'Sending to Real Inbox...'
                        : needsAuth
                        ? 'Sign In & Send Real Email via Gmail'
                        : 'Confirm & Send Real Email via Gmail'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

