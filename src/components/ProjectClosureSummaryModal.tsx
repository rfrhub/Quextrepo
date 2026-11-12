import React, { useState, useMemo, useEffect } from 'react';
import { OperationProject } from '../types';
import { LiveGmailConfirmModal, LiveGmailModalPayload } from './LiveGmailConfirmModal';
import {
  buildProjectClosureCardEmail,
  AiEmailTone,
} from '../services/portfolioEmailService';
import {
  X,
  Mail,
  Printer,
  CheckCircle2,
  Sparkles,
  Send,
  Layers,
  MessageSquarePlus,
} from 'lucide-react';

interface ProjectClosureSummaryModalProps {
  project: OperationProject;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail?: (emailData: {
    recipientEmail: string;
    ccEmail: string;
    subject: string;
    message: string;
  }) => void;
}

export const ProjectClosureSummaryModal: React.FC<ProjectClosureSummaryModalProps> = ({
  project,
  isOpen,
  onClose,
  onSendEmail,
}) => {
  const csmName = project.assignedCSM || 'Nicole Franklin';
  const csmEmail = `${csmName.toLowerCase().replace(' ', '.')}@onequext.com`;
  const pmName = project.assignedPM.name;
  const pmEmail = project.assignedPM.email;

  const clientEmail =
    project.customerIntake?.communityEmail ||
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    project.assignedPM?.email ||
    '';

  const [toEmail, setToEmail] = useState<string>(clientEmail);
  const [ccEmail, setCcEmail] = useState<string>(`${csmEmail}, ${pmEmail}`);
  const [subject, setSubject] = useState<string>(
    `Project Closure & Implementation Handover Certificate - ${project.propertyName}`
  );
  const [aiTone, setAiTone] = useState<AiEmailTone>(project.commsTunnelAiTone || 'executive');
  const [customHeadline, setCustomHeadline] = useState<string>('');
  const [includePmNoteCard, setIncludePmNoteCard] = useState<boolean>(true);
  const [pmHandoverNote, setPmHandoverNote] = useState<string>(
    `It has been a pleasure partnering with the ${project.propertyName} team throughout your smart community deployment. All ${project.unitsCount} residential units, gateways, and portal integrations are verified online, and ${csmName} is ready to support your team moving forward!`
  );
  const [isSent, setIsSent] = useState<boolean>(false);
  const [gmailModalPayload, setGmailModalPayload] = useState<LiveGmailModalPayload | null>(null);

  useEffect(() => {
    setToEmail(clientEmail);
    setCcEmail(`${csmEmail}, ${pmEmail}`);
    setSubject(`Project Closure & Implementation Handover Certificate - ${project.propertyName}`);
    setAiTone(project.commsTunnelAiTone || 'executive');
    setPmHandoverNote(
      `It has been a pleasure partnering with the ${project.propertyName} team throughout your smart community deployment. All ${project.unitsCount} residential units, gateways, and portal integrations are verified online, and ${csmName} is ready to support your team moving forward!`
    );
  }, [project.id, clientEmail, csmEmail, pmEmail, project.propertyName, project.unitsCount, csmName, project.commsTunnelAiTone]);

  const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalInstalled = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);

  const closureCardEmail = useMemo(
    () =>
      buildProjectClosureCardEmail({
        project,
        customPmNote: includePmNoteCard ? pmHandoverNote : '',
        customHeadline,
        aiTone,
      }),
    [project, includePmNoteCard, pmHandoverNote, customHeadline, aiTone]
  );

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    const allRecipients = [toEmail, ccEmail]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ');

    setGmailModalPayload({
      title: 'Confirm & Send Card-Based Project Closure Email via Gmail',
      defaultRecipients: allRecipients,
      subject,
      htmlBody: closureCardEmail.htmlBody,
      onDispatched: ({ recipients, subject: finalSubject }) => {
        if (onSendEmail) {
          onSendEmail({
            recipientEmail: recipients.join(', '),
            ccEmail,
            subject: finalSubject,
            message: closureCardEmail.summary,
          });
        }
        setIsSent(true);
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  One-Page Project Closure Summary & Customer Email
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
                  Final Handover
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official handover certificate and customer email notification with CSM auto-CC.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Printable 1-Page Summary Certificate Canvas */}
          <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <img
                    src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png"
                    alt="Quext"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Official Implementation Handover Certificate
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                    {project.propertyName}
                  </h3>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-emerald-700 font-bold">STATUS: 100% CLOSED</div>
                <div className="text-slate-500 text-[11px]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Scope</div>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">{project.unitsCount} Units</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Hardware Installed</div>
                <div className="text-base font-extrabold text-emerald-700 font-mono mt-0.5">{totalInstalled} / {totalQuoted}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">PMS Bi-Directional Sync</div>
                <div className="text-base font-extrabold text-sky-700 font-mono mt-0.5">{project.customerIntake?.pmsSoftware || 'Yardi'}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Common Doors</div>
                <div className="text-base font-extrabold text-purple-700 font-mono mt-0.5">{project.customerIntake?.commonAreaDoors?.length || 0} Doors</div>
              </div>
            </div>

            {/* CSM Handover Callout Box (Prominently displaying CSM contact info) */}
            <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    Customer Success (CSM) Handover Complete
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-mono">
                  Primary Contact Moving Forward
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                Implementation has officially completed and handed off to our Customer Success team. Moving forward,{' '}
                <strong>{csmName}</strong> is your dedicated Customer Success Manager for all portal support, resident key questions, and staff training.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono">
                <span className="text-purple-900 font-bold">{csmName}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700">Email: {csmEmail}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700">Phone: (806) 555-0190</span>
              </div>
            </div>
          </div>

          {/* Email Dispatch Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Send One-Page Summary &amp; CSM Introduction Email</span>
              </div>
              <span className="text-[11px] text-slate-500">
                CSM is automatically CC&apos;d • Branded with Quext Logo (Top-Left)
              </span>
            </div>

            {isSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Closure summary and CSM introduction email successfully sent to {toEmail} (CC: {ccEmail})!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-xs text-emerald-800 underline font-bold"
                >
                  Edit &amp; Resend
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Recipient Email (Customer) *
                    </label>
                    <input
                      type="email"
                      required
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Automatic CC (CSM &amp; PM)
                    </label>
                    <input
                      type="text"
                      required
                      value={ccEmail}
                      onChange={(e) => setCcEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-medium text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-semibold"
                  />
                </div>

                {/* AI Card Presentation Controls & Optional PM Handover Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Card-Based Closure Email Builder (Communications Tunnel Style)</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {(
                        [
                          { id: 'executive', label: 'Executive Cards' },
                          { id: 'action_oriented', label: 'Action Cards' },
                          { id: 'technical', label: 'Technical Cards' },
                        ] as { id: AiEmailTone; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setAiTone(opt.id);
                            setCustomHeadline('');
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            aiTone === opt.id
                              ? 'bg-slate-900 text-[#01C38D] shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      AI Executive Handover Summary Headline (Editable)
                    </label>
                    <input
                      type="text"
                      value={customHeadline || closureCardEmail.aiHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-1.5 font-bold text-slate-800 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePmNoteCard}
                          onChange={(e) => setIncludePmNoteCard(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Include Personal PM Handover Message Card</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Embedded Card Preview
                      </span>
                    </div>
                    {includePmNoteCard && (
                      <textarea
                        rows={2}
                        value={pmHandoverNote}
                        onChange={(e) => setPmHandoverNote(e.target.value)}
                        placeholder="Add a warm personal handover note from the PM..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs leading-relaxed"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 text-xs">
                      Live Card-Based Customer Email Preview (Embedded Cards)
                    </label>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Card-Based Digest
                    </span>
                  </div>
                  <div
                    data-testid="project-closure-card-email-preview"
                    className="bg-slate-200/70 border border-slate-300 rounded-xl p-3 max-h-[420px] overflow-y-auto shadow-inner"
                    dangerouslySetInnerHTML={{ __html: closureCardEmail.htmlBody }}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Project Closure Email &amp; Introduce CSM</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      <LiveGmailConfirmModal
        payload={
          gmailModalPayload
            ? {
                ...gmailModalPayload,
                currentProject: project,
              }
            : null
        }
        onClose={() => setGmailModalPayload(null)}
      />
    </div>
  );
};
