import React, { useState, useEffect } from 'react';
import {
  OperationProject,
  ShippingDockItem,
  buildProductAcceptancePortalUrl,
  getLockFinishSummaryTag,
  isLockBOMItem,
} from '../types';
import {
  subscribeToGmailAuth,
  sendRealGmailEmail,
  googleSignIn,
  buildGmailWebComposeUrl,
  logout,
} from '../services/gmailService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { getDockRowBomQuantities } from './ShippingDockSection';
import { ProductAcceptanceQRCode } from './ProductAcceptanceQRCode';
import {
  FileSignature,
  Mail,
  Send,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Building2,
  User,
  Package,
} from 'lucide-react';

interface ConfirmProductAcceptanceModalProps {
  project: OperationProject;
  isOpen: boolean;
  onClose: () => void;
  onPreviewPortal: () => void;
  onDispatched: (result: {
    recipients: string[];
    subject: string;
    gmailMessageId?: string;
    sentViaGmail: boolean;
  }) => void;
}

export const ConfirmProductAcceptanceModal: React.FC<ConfirmProductAcceptanceModalProps> = ({
  project,
  isOpen,
  onClose,
  onPreviewPortal,
  onDispatched,
}) => {
  const dockItems: ShippingDockItem[] = project.shippingDockItems || [];
  const bomItems = project.bomItems || [];
  const defaultCustomerEmail =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'RFRleasing@gmail.com';

  const customerContactName =
    project.customerIntake?.staffRoles?.[0]
      ? `${project.customerIntake.staffRoles[0].firstName} ${project.customerIntake.staffRoles[0].lastName} (${project.customerIntake.staffRoles[0].roleOrTitle || 'Contact'})`
      : project.clientName || 'Property Representative';

  const defaultSubject = `Action Required: Confirm & Sign Product Acceptance Portal - ${project.propertyName}`;

  const isNetworkHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const [recipientInput, setRecipientInput] = useState<string>(defaultCustomerEmail);
  const [subjectInput, setSubjectInput] = useState<string>(defaultSubject);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState<boolean>(isNetworkHost);

  const portalLink = buildProductAcceptancePortalUrl(project.id);

  // Calculate total units shipped across batches
  const totalShippedUnits = dockItems.reduce((acc, item) => acc + (item.shippedQuantity || 0), 0);

  useEffect(() => {
    const unsub = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setAuthUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRecipientInput(defaultCustomerEmail);
      setSubjectInput(defaultSubject);
      setErrorMsg(null);
    }
  }, [isOpen, defaultCustomerEmail, defaultSubject]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalLink).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getCleanRecipients = () =>
    recipientInput
      .split(/[,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

  // Build shipment table for HTML email
  const buildShipmentHtmlTable = () => {
    if (dockItems.length === 0) {
      return `<p style="font-size: 13px; color: #64748b; margin: 12px 0;">No shipment batches logged yet.</p>`;
    }

    const tableRows = dockItems
      .map((item) => {
        const rowBomIds =
          item.bomItemIds && item.bomItemIds.length > 0
            ? item.bomItemIds
            : [item.bomItemId];
        const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
        const qtyMap = getDockRowBomQuantities(item, bomItems);

        const hardwareItemsHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-weight: 600; color: #0f172a;">${b.name}${
                      isLockBOMItem(b) && b.lockFinishConfig
                        ? `<br/><span style="font-size: 11px; color: #475569; font-weight: normal;">Finish: ${getLockFinishSummaryTag(
                            b.lockFinishConfig
                          )}</span>`
                        : ''
                    }</div>`
                )
                .join('')
            : `<div style="font-weight: 600; color: #0f172a;">${item.bomItemName}</div>`;

        const quantityHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-family: monospace; font-weight: 700; color: #059669;">${
                      qtyMap[b.id] ?? 0
                    } units</div>`
                )
                .join('')
            : `<div style="font-family: monospace; font-weight: 700; color: #059669;">${item.shippedQuantity} units</div>`;

        return `
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
              ${hardwareItemsHtml}
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.shipmentBatchLabel}</div>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px; white-space: nowrap;">
              ${quantityHtml}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #1e293b;">
              <div style="font-weight: 600;">${item.carrier}</div>
              <div style="font-family: monospace; font-size: 11px; color: #0284c7; margin-top: 2px;">${item.trackingNumber}</div>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #334155; white-space: nowrap;">
              <div><strong>Shipped:</strong> ${item.shippedDate || 'TBD'}</div>
              <div style="margin-top: 2px;"><strong>ETA:</strong> ${item.estimatedArrivalDate || 'TBD'}</div>
              <div style="margin-top: 4px; display: inline-block; padding: 2px 6px; border-radius: 4px; background-color: #ecfdf5; color: #065f46; font-size: 10px; font-weight: 700;">${item.status}</div>
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
            <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0;">Hardware Line Item</th>
            <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
            <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0;">Carrier &amp; Tracking</th>
            <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0;">Ship Date &amp; ETA</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  const emailHtmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #059669; padding-bottom: 14px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between;">
        <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
        <span style="font-size: 11px; color: #059669; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; float: right; line-height: 28px;">Product Acceptance Portal</span>
      </div>

      <p style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a;">Hello <strong>${project.clientName}</strong> Team,</p>
      
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155; line-height: 1.6;">
        Hardware shipments for <strong>${project.propertyName}</strong> (Quote #${project.quoteNumber}) have been dispatched and are arriving on site.
      </p>

      <p style="margin: 0 0 16px 0; font-size: 13px; color: #334155; line-height: 1.6;">
        Please access your dedicated <strong>Product Acceptance Portal</strong> to verify received shipment boxes, record any delivery scenario notes on individual line items (e.g. storage room location, partial arrivals), and submit your digital acceptance signature:
      </p>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${portalLink}" style="background-color: #059669; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Open &amp; Sign Product Acceptance Portal &rarr;
        </a>
      </div>

      <!-- Dedicated On-Site Mobile QR Code for Shipping Dock & Warehouse Staff -->
      <div style="background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <div style="font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
          📱 On-Site Property Staff Mobile QR Code
        </div>
        <p style="font-size: 12px; color: #047857; margin: 0 0 14px 0; line-height: 1.5;">
          Point your smartphone camera at the QR code below while on the shipping dock to <strong>inspect pallets</strong>, <strong>upload photos of any damaged boxes</strong>, and <strong>sign digitally</strong> confirming delivered inventory.
        </p>
        <div style="display: inline-block; background: #ffffff; padding: 12px; border-radius: 12px; border: 1px solid #a7f3d0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(portalLink)}" alt="Scan Product Acceptance Portal QR Code" width="160" height="160" style="display: block; margin: 0 auto;" />
        </div>
        <div style="margin-top: 10px; font-size: 11px; color: #065f46; font-weight: 600;">
          Works directly with iOS Camera and Android QR Scanner · No App Download Required
        </div>
      </div>

      <div style="margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
          Hardware Shipment Summary (${dockItems.length} Batches · ${totalShippedUnits} Total Units)
        </div>
        ${buildShipmentHtmlTable()}
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin: 16px 0; font-size: 12px; color: #64748b;">
        <strong>Direct Portal URL:</strong><br/>
        <a href="${portalLink}" style="color: #0284c7; word-break: break-all;">${portalLink}</a>
      </div>

      <p style="margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px; line-height: 1.5;">
        Best regards,<br/>
        <strong style="color: #0f172a;">${project.assignedPM.name}</strong> • Quext Implementation Operations<br/>
        <a href="mailto:${project.assignedPM.email || 'support@onequext.com'}" style="color: #0284c7; text-decoration: none;">${project.assignedPM.email || 'support@onequext.com'}</a>
      </p>
    </div>
  `;

  const handleConfirmAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRecipients = getCleanRecipients();
    if (cleanRecipients.length === 0) {
      setErrorMsg('Please enter at least one recipient email address for the customer.');
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
            'Google Sign-In popup was closed before finishing. You can click "Sign in with Google" again or use "Open in Gmail Web" below.'
          );
          setIsSending(false);
          return;
        }
      }

      const result = await sendRealGmailEmail({
        to: cleanRecipients,
        subject: subjectInput.trim() || defaultSubject,
        htmlBody: emailHtmlBody,
      });

      onDispatched({
        recipients: result.recipients,
        subject: subjectInput.trim() || defaultSubject,
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
          `Domain/IP "${typeof window !== 'undefined' ? window.location.hostname : 'current domain'}" is not on Firebase's Authorized Domains list for direct popup sign-ins. You can send this email immediately using "Send via Gmail Web" below (or access via http://localhost:3000 on your laptop).`
        );
      } else if (err?.message === 'NOT_AUTHENTICATED') {
        setNeedsAuth(true);
        setErrorMsg(
          'Please sign in with Google so we can send this email from your authorized Gmail account.'
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
    const finalRecipients = cleanRecipients.length > 0 ? cleanRecipients : [defaultCustomerEmail];
    onDispatched({
      recipients: finalRecipients,
      subject: subjectInput.trim() || defaultSubject,
      gmailMessageId: viaComposeTab ? `gmail-web-${Date.now()}` : undefined,
      sentViaGmail: viaComposeTab,
    });
    onClose();
  };

  const gmailComposeUrl = buildGmailWebComposeUrl({
    to: recipientInput || defaultCustomerEmail,
    subject: subjectInput.trim() || defaultSubject,
    htmlBody: emailHtmlBody,
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Confirm &amp; Send Product Acceptance Portal
              </h3>
              <p className="text-[11px] text-slate-300">
                Confirm customer details, shipment scope, and message before emailing the portal link
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmAndSend} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
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
                    : 'Connect Gmail to Email Customer Directly'}
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {!needsAuth
                    ? 'Emails will be sent from your Google Account directly to the customer.'
                    : isUnauthorizedDomain
                    ? 'Direct popup sign-in is restricted by Firebase on local network IPs. You can email the customer with 1-click via Gmail Web below!'
                    : 'Sign in with Google for direct delivery, or use "Open in Gmail Web" below.'}
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

          {/* Project & Associated Customer Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Project &amp; Associated Customer</span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-slate-700">
                Quote #{project.quoteNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold text-[11px] block">Customer Client &amp; Property:</span>
                <span className="font-bold text-slate-900">{project.propertyName}</span>
                <span className="text-slate-600 ml-1">({project.clientName})</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[11px] block">Primary Client Contact:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {customerContactName}
                </span>
              </div>
            </div>

            {/* Recipient Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Customer Recipient Email(s) *</span>
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
                placeholder="e.g. client@property.com, manager@property.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                This email will be delivered to the client so they can open their portal, check delivery notes, and sign.
              </p>
            </div>
          </div>

          {/* Portal Scope Header */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-slate-900 text-xs">
                Acceptance Scope: {dockItems.length} Batches ({totalShippedUnits} Hardware Units)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {project.productAcceptanceSubmission ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Signed by {project.productAcceptanceSubmission.signedByName}
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-bold">
                  Pending Customer Sign-off
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  onPreviewPortal();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
                title="Open interactive preview of the Product Acceptance Portal"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Preview Portal</span>
              </button>
            </div>
          </div>

          {/* Dedicated Mobile Link and QR Code Card for On-Site Staff */}
          <ProductAcceptanceQRCode
            url={portalLink}
            propertyName={project.propertyName}
            quoteNumber={project.quoteNumber}
            size={130}
          />

          {/* Subject Line */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Email Subject Line *</label>
            <input
              type="text"
              required
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* HTML Email Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Message Preview (Customer Email Content)
              </span>
              <span className="text-[10px] font-mono text-slate-400">HTML Format</span>
            </div>
            <div
              className="border border-slate-200 rounded-xl p-4 bg-white max-h-52 overflow-y-auto text-xs text-slate-700 leading-relaxed shadow-2xs"
              dangerouslySetInnerHTML={{ __html: emailHtmlBody }}
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send Pre-Filled via Gmail Web Instead &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLogAndCompleteWithoutApi(true)}
                  className="px-3 py-2 rounded-xl text-[11px] font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors"
                  title="Open pre-filled message in Gmail Web Compose tab and log dispatch"
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
                    className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    title="Open pre-filled in Gmail Web and record dispatch in project log"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send via Gmail Web &amp; Log Dispatch</span>
                  </a>
                ) : (
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSending
                        ? 'Sending to Customer...'
                        : needsAuth
                        ? 'Sign In & Send via Gmail'
                        : 'Confirm & Send to Customer via Gmail'}
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
