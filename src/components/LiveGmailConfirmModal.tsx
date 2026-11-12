import React, { useState, useEffect, useMemo } from 'react';
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
  Layers,
  Building2,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OperationProject, CustomerEmailCadence } from '../types';
import { loadStoredProjects } from '../data/initialData';
import {
  detectPortfolioContacts,
  buildPortfolioUpdateEmailContent,
  logPortfolioDispatchAcrossProjects,
  PortfolioCommunicationType,
} from '../services/portfolioEmailService';

export interface LiveGmailModalPayload {
  title: string;
  defaultRecipients: string;
  subject: string;
  htmlBody: string;
  previewSummary?: string;
  currentProject?: OperationProject;
  allProjects?: OperationProject[];
  emailType?: PortfolioCommunicationType;
  cadence?: CustomerEmailCadence;
  onDispatched: (result: {
    recipients: string[];
    subject: string;
    gmailMessageId?: string;
    sentViaGmail: boolean;
    includedPortfolioProjects?: OperationProject[];
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

  // Portfolio Update state
  const [includePortfolioUpdate, setIncludePortfolioUpdate] = useState<boolean>(true);
  const [selectedPortfolioProjectIds, setSelectedPortfolioProjectIds] = useState<string[]>([]);
  const [showPortfolioPropertyList, setShowPortfolioPropertyList] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setAuthUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
    });
    return unsub;
  }, []);

  const allProjectsPool = useMemo(() => {
    if (payload?.allProjects && payload.allProjects.length > 0) {
      return payload.allProjects;
    }
    return loadStoredProjects();
  }, [payload?.allProjects]);

  // Identify current project
  const currentProject = useMemo(() => {
    if (payload?.currentProject) return payload.currentProject;
    if (payload?.subject && allProjectsPool.length > 0) {
      const match = allProjectsPool.find(
        (p) =>
          p.propertyName &&
          payload.subject.toLowerCase().includes(p.propertyName.toLowerCase())
      );
      if (match) return match;
    }
    return allProjectsPool[0] || null;
  }, [payload?.currentProject, payload?.subject, allProjectsPool]);

  // Detect portfolio contacts
  const portfolioDetection = useMemo(() => {
    if (!recipientInput.trim()) {
      return { hasMatches: false, matchedContacts: [], allTiedProjects: [] };
    }
    return detectPortfolioContacts(
      recipientInput,
      currentProject?.id,
      allProjectsPool
    );
  }, [recipientInput, currentProject?.id, allProjectsPool]);

  // Initialize selected portfolio project IDs when matches change
  useEffect(() => {
    if (portfolioDetection.hasMatches && currentProject) {
      const allIds = [currentProject.id, ...portfolioDetection.allTiedProjects.map((p) => p.id)];
      setSelectedPortfolioProjectIds(allIds);
      setIncludePortfolioUpdate(true);
    } else {
      setSelectedPortfolioProjectIds(currentProject ? [currentProject.id] : []);
    }
  }, [portfolioDetection.hasMatches, currentProject?.id]);

  useEffect(() => {
    if (payload) {
      setRecipientInput(payload.defaultRecipients);
      setSubjectInput(payload.subject);
      setErrorMsg(null);
    }
  }, [payload]);

  const cleanRecipients = useMemo(() => {
    return recipientInput
      .split(/[,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);
  }, [recipientInput]);

  // Effective projects included in the portfolio update
  const effectivePortfolioProjects = useMemo(() => {
    if (!currentProject) return [];
    if (!includePortfolioUpdate || !portfolioDetection.hasMatches) {
      return [currentProject];
    }
    const pool = [currentProject, ...portfolioDetection.allTiedProjects];
    return pool.filter((p) => selectedPortfolioProjectIds.includes(p.id));
  }, [
    currentProject,
    includePortfolioUpdate,
    portfolioDetection.hasMatches,
    portfolioDetection.allTiedProjects,
    selectedPortfolioProjectIds,
  ]);

  // Generate Portfolio Update content if enabled
  const portfolioContent = useMemo(() => {
    if (
      !includePortfolioUpdate ||
      !portfolioDetection.hasMatches ||
      !currentProject ||
      effectivePortfolioProjects.length <= 1
    ) {
      return null;
    }

    return buildPortfolioUpdateEmailContent({
      primaryProject: currentProject,
      includedProjects: effectivePortfolioProjects,
      matchedContacts: portfolioDetection.matchedContacts,
      communicationType: payload?.emailType || 'general',
      originalSubject: payload?.subject || subjectInput,
      originalSummary: payload?.previewSummary || '',
      cadence: payload?.cadence || 'weekly',
      senderName: authUserEmail || currentProject.assignedPM?.name,
      senderEmail: authUserEmail || currentProject.assignedPM?.email,
    });
  }, [
    includePortfolioUpdate,
    portfolioDetection.hasMatches,
    portfolioDetection.matchedContacts,
    currentProject,
    effectivePortfolioProjects,
    payload?.emailType,
    payload?.subject,
    payload?.previewSummary,
    payload?.cadence,
    subjectInput,
    authUserEmail,
  ]);

  const activeHtmlBody = portfolioContent ? portfolioContent.htmlBody : payload?.htmlBody || '';
  const activeSubject = portfolioContent ? portfolioContent.subject : subjectInput.trim() || payload?.subject || '';

  const gmailComposeUrl = useMemo(() => {
    return buildGmailWebComposeUrl({
      to: cleanRecipients.join(', ') || payload?.defaultRecipients || '',
      subject: activeSubject,
      htmlBody: activeHtmlBody,
    });
  }, [cleanRecipients, activeSubject, activeHtmlBody, payload?.defaultRecipients]);

  if (!payload) return null;

  const handleToggleProject = (id: string) => {
    if (currentProject && id === currentProject.id) return; // Keep primary project
    setSelectedPortfolioProjectIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleConfirmAndSendRealEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cleanRecipients.length === 0) {
      setErrorMsg('Please enter at least one recipient email address.');
      return;
    }

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
        subject: activeSubject,
        htmlBody: activeHtmlBody,
      });

      // If portfolio update was included, log across all included properties
      if (portfolioContent && currentProject && effectivePortfolioProjects.length > 1) {
        logPortfolioDispatchAcrossProjects({
          includedProjects: effectivePortfolioProjects,
          primaryProject: currentProject,
          recipients: result.recipients,
          subject: activeSubject,
          summary: portfolioContent.summary,
          logType: portfolioContent.logType,
          sentBy: authUserEmail || currentProject.assignedPM?.name || 'Quext Operations',
          cadence: payload.cadence || 'weekly',
        });
      }

      payload.onDispatched({
        recipients: result.recipients,
        subject: activeSubject,
        gmailMessageId: result.id,
        sentViaGmail: true,
        includedPortfolioProjects: effectivePortfolioProjects,
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
    const finalRecipients =
      cleanRecipients.length > 0 ? cleanRecipients : [payload.defaultRecipients];

    if (portfolioContent && currentProject && effectivePortfolioProjects.length > 1) {
      logPortfolioDispatchAcrossProjects({
        includedProjects: effectivePortfolioProjects,
        primaryProject: currentProject,
        recipients: finalRecipients,
        subject: activeSubject,
        summary: viaComposeTab
          ? `${portfolioContent.summary} [Opened in Gmail Web Compose]`
          : portfolioContent.summary,
        logType: portfolioContent.logType,
        sentBy: authUserEmail || currentProject.assignedPM?.name || 'Quext Operations',
        cadence: payload.cadence || 'weekly',
      });
    }

    payload.onDispatched({
      recipients: finalRecipients,
      subject: activeSubject,
      gmailMessageId: viaComposeTab ? 'gmail-web-compose' : 'logged-only',
      sentViaGmail: false,
      includedPortfolioProjects: effectivePortfolioProjects,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#191E29] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#01C38D]/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#01C38D] text-slate-950 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                {portfolioContent ? `Portfolio Update: ${payload.title}` : payload.title}
              </h3>
              <p className="text-[11px] text-slate-300">
                Verify recipient inbox &amp; subject before dispatching
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Portfolio Contact Detection Alert Prompt */}
          {portfolioDetection.hasMatches && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                        Portfolio Contact Detected
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {portfolioDetection.matchedContacts.map((c) => c.email).join(', ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {portfolioDetection.matchedContacts[0]?.contactName ? (
                        <strong>{portfolioDetection.matchedContacts[0].contactName} </strong>
                      ) : (
                        'This contact '
                      )}
                      is also registered as a Community Site Contact / Staff Member across{' '}
                      <strong>{portfolioDetection.allTiedProjects.length} other properties</strong> in
                      your portfolio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Prompt Checkbox Toggle */}
              <div className="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-900 select-none">
                  <input
                    type="checkbox"
                    checked={includePortfolioUpdate}
                    onChange={(e) => setIncludePortfolioUpdate(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-emerald-400 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>
                    Provide an &ldquo;Portfolio Update&rdquo; covering all tied properties on this single email
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowPortfolioPropertyList(!showPortfolioPropertyList)}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer underline"
                >
                  <span>
                    {showPortfolioPropertyList ? 'Hide Property List' : `View ${effectivePortfolioProjects.length} Properties`}
                  </span>
                  {showPortfolioPropertyList ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Expandable Property Checklist */}
              {showPortfolioPropertyList && (
                <div className="pt-2 space-y-1.5 border-t border-emerald-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select properties to include in this consolidated email:
                  </div>
                  {[currentProject, ...portfolioDetection.allTiedProjects]
                    .filter(Boolean)
                    .map((proj) => {
                      const isPrimary = proj?.id === currentProject?.id;
                      const isChecked = selectedPortfolioProjectIds.includes(proj!.id);
                      return (
                        <div
                          key={proj!.id}
                          onClick={() => handleToggleProject(proj!.id)}
                          className={`p-2 rounded-xl border flex items-center justify-between transition-colors cursor-pointer text-xs ${
                            isChecked
                              ? 'bg-white border-emerald-300'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <div>
                              <span className="font-bold text-slate-900">
                                {proj!.propertyName}
                              </span>
                              {isPrimary && (
                                <span className="ml-1.5 text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Current
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 ml-2">
                                ({proj!.city}, {proj!.state} • {proj!.unitsCount} Units)
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            {proj!.statusTag}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Gmail Auth Status Banner */}
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
                  !needsAuth
                    ? 'text-emerald-600'
                    : isUnauthorizedDomain
                    ? 'text-sky-600'
                    : 'text-amber-600'
                }`}
              />
              <div>
                <div className="font-bold text-xs">
                  {!needsAuth
                    ? `Gmail Connected: ${authUserEmail || 'Authenticated User'}`
                    : isUnauthorizedDomain
                    ? `Mobile / Local Network IP Mode`
                    : 'Connect Gmail to Send Directly via API'}
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {!needsAuth
                    ? 'Ready to dispatch a real HTML email directly to the recipient inboxes below.'
                    : 'Sign in with Google for 1-click delivery, or use "Open in Gmail Web" below.'}
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
                >
                  <LogOut className="w-3 h-3" />
                  <span>Switch Account</span>
                </button>
              )}
            </div>
          </div>

          {/* Editable Recipient(s) & Subject */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  To (Real Inbox Recipient Email(s)) *
                </label>
                {authUserEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = authUserEmail;
                      if (!recipientInput.toLowerCase().includes(target.toLowerCase())) {
                        setRecipientInput((prev) => (prev.trim() ? `${prev.trim()}, ${target}` : target));
                      }
                    }}
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded cursor-pointer"
                  >
                    + Add {authUserEmail}
                  </button>
                )}
              </div>
              <input
                type="text"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="e.g. customer@property.com, team@onequext.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Subject Line {portfolioContent && <span className="text-emerald-700 font-bold">(Portfolio Update)</span>}
              </label>
              <input
                type="text"
                value={activeSubject}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Live Rendered HTML Email Body Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rendered Email HTML Body Preview</span>
                {portfolioContent && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Consolidated Portfolio Preview ({effectivePortfolioProjects.length} Properties)
                  </span>
                )}
              </span>
            </div>
            <div
              className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-700 max-h-72 overflow-y-auto leading-relaxed shadow-inner"
              dangerouslySetInnerHTML={{ __html: activeHtmlBody }}
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLogAndCompleteWithoutApi(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail Web</span>
            </a>
            <button
              type="button"
              onClick={() => handleLogAndCompleteWithoutApi(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Log Dispatch Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAndSendRealEmail}
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-colors bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] cursor-pointer disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSending
                  ? 'Sending Real Email...'
                  : needsAuth
                  ? 'Sign In & Send via Gmail'
                  : portfolioContent
                  ? `Send Portfolio Update (${effectivePortfolioProjects.length} Props)`
                  : 'Send Real Email via Gmail'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
