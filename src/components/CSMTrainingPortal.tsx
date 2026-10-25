import React, { useState } from 'react';
import {
  OperationProject,
  getCsmHandoffAutoCloseInfo,
  CSM_CALENDAR_BOOKING_DIRECTORY,
  getCSMCalendarBookingProfile,
  QUEXT_TRAINING_HELP_ARTICLE_URL,
} from '../types';
import {
  X,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Send,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  Calendar,
  ExternalLink,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LiveGmailConfirmModal, LiveGmailModalPayload } from './LiveGmailConfirmModal';

interface CSMTrainingPortalProps {
  project: OperationProject;
  onClose: () => void;
  onUpdateProject?: (updatedProject: OperationProject) => void;
  initialMode?: 'csm-intro-booking' | 'csm-handoff';
}

export const CSMTrainingPortal: React.FC<CSMTrainingPortalProps> = ({
  project,
  onClose,
  onUpdateProject,
  initialMode,
}) => {
  const isCurrentlyOnCsmHandoff = project.milestones.some(
    (m) =>
      m.title.toLowerCase().includes('csm handoff') &&
      (m.status === 'In Progress' || m.status === 'Completed')
  );

  const [portalMode, setPortalMode] = useState<'csm-intro-booking' | 'csm-handoff'>(
    initialMode || (isCurrentlyOnCsmHandoff ? 'csm-handoff' : 'csm-intro-booking')
  );
  const [communicationSent, setCommunicationSent] = useState(false);
  const [bookingEmailSent, setBookingEmailSent] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [gmailModalPayload, setGmailModalPayload] = useState<LiveGmailModalPayload | null>(null);

  const assignedCsmName = project.assignedCSM || 'Nicole Franklin';
  const designatedCsm = getCSMCalendarBookingProfile(assignedCsmName);
  const autoCloseInfo = getCsmHandoffAutoCloseInfo(project);

  const defaultRecipient =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'RFRleasing@gmail.com';

  const handleSendCsmIntroCalendarAutomation = () => {
    const allCsmLinksHtml = CSM_CALENDAR_BOOKING_DIRECTORY.map(
      (csm) => `
        <li style="margin-bottom: 10px;">
          <strong>${csm.name}</strong> (${csm.title}) — <em>"${csm.quote}"</em><br/>
          👉 <a href="${csm.bookingUrl}" style="color: #0284c7; font-weight: bold;">Click Here to Book a Session with ${csm.name}</a>
        </li>
      `
    ).join('');

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #0284c7; text-transform: uppercase; line-height: 28px;">CSM Intro - Pre-Implementation</span>
        </div>
        <p>Hello <strong>${project.clientName}</strong> Team,</p>
        <p><strong>${project.propertyName}</strong> has reached the <strong>CSM Intro - Pre-implementation</strong> milestone! Are you just getting started with Quext Smart Communities? Whether you're brand new or need a walkthrough, book time directly with your designated Customer Success Manager below.</p>
        
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 10px; border: 1px solid #bbf7d0; margin: 16px 0;">
          <div style="font-size: 11px; text-transform: uppercase; color: #047857; font-weight: bold; margin-bottom: 4px;">Your Designated Customer Success Manager</div>
          <div style="font-size: 16px; font-weight: bold; color: #0f172a;">${designatedCsm.name} — ${designatedCsm.title}</div>
          <p style="font-style: italic; color: #334155; margin: 6px 0 12px 0;">"${designatedCsm.quote}"</p>
          <p style="margin: 0;">
            👉 <a href="${designatedCsm.bookingUrl}" style="display: inline-block; background-color: #01C38D; color: #191E29; font-weight: bold; padding: 10px 16px; border-radius: 8px; text-decoration: none;">Click Here to Book a Session with ${designatedCsm.name}</a>
          </p>
        </div>

        <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 18px;">Full Quext CSM Booking Directory (<a href="${QUEXT_TRAINING_HELP_ARTICLE_URL}">Help Center Article</a>):</p>
        <ul style="font-size: 12px; color: #334155; padding-left: 18px;">
          ${allCsmLinksHtml}
        </ul>

        <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; margin-top: 16px;">
          <strong>What We Can Help With:</strong> Getting started with your system • Feature walkthroughs and refreshers • Troubleshooting and questions • Best practices and tips.<br/>
          <strong>Related Guides:</strong> <a href="https://help.quext.io/en/articles/10297981-staff-create-a-quext-pass">Staff - Create a Quext Pass</a> | <a href="https://help.quext.io/en/articles/13622261-residents-how-to-set-up-and-use-wallet-access">Residents - How to Set Up and Use Wallet Access</a>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: `Confirm & Send CSM Calendar Booking Link (${designatedCsm.name})`,
      defaultRecipients: defaultRecipient,
      subject: `[CSM Intro - Pre-Implementation] Schedule Your Training Session with ${designatedCsm.name} — ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        if (onUpdateProject) {
          const newLog = {
            id: `log-csm-booking-${Date.now()}`,
            projectId: project.id,
            timestamp: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'csm_training_portal' as const,
            recipientEmail: recipients.join(', '),
            subject,
            summary: `Triggered CSM Intro - Pre-Implementation Calendar Booking automation for ${designatedCsm.name} (${designatedCsm.bookingUrl}) via ${QUEXT_TRAINING_HELP_ARTICLE_URL} [Gmail ID: ${gmailMessageId || 'Sent'}].`,
            sentBy: project.assignedPM.name,
            status: 'Delivered' as const,
          };

          onUpdateProject({
            ...project,
            customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
            lastUpdated: new Date().toISOString(),
          });
        }
        setBookingEmailSent(true);
      },
    });
  };

  const handleSendHandoffCommunication = () => {
    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #64748b; text-transform: uppercase; line-height: 28px;">CSM Handoff</span>
        </div>
        <p>Hello <strong>${project.clientName}</strong> Team,</p>
        <p>Congratulations! <strong>${project.propertyName}</strong> has reached the <strong>CSM Handoff</strong> milestone. We are officially transitioning your property from Implementation Engineering to your dedicated Customer Success Manager, <strong>${designatedCsm.name}</strong> (${designatedCsm.email} • ${designatedCsm.phone}).</p>
        ${customNote ? `<p style="background-color: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid #01C38D;"><strong>PM Note:</strong> ${customNote}</p>` : ''}
        <p style="font-size: 12px; color: #64748b;">Note: Your implementation project record will automatically transition to Closed status 7 days following CSM Handoff initiation.</p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send CSM Handoff Communication',
      defaultRecipients: defaultRecipient,
      subject: `[Quext CSM Handoff] Welcome to Customer Success — ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        if (onUpdateProject) {
          const newLog = {
            id: `log-csm-handoff-${Date.now()}`,
            projectId: project.id,
            timestamp: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'csm_handoff_email' as const,
            recipientEmail: recipients.join(', '),
            subject,
            summary: `Dispatched official CSM Handoff communication introducing ${designatedCsm.name} (${designatedCsm.email}).${customNote ? ` Note: "${customNote}"` : ''} [Gmail ID: ${gmailMessageId || 'Sent'}]`,
            sentBy: project.assignedPM.name,
            status: 'Delivered' as const,
          };

          onUpdateProject({
            ...project,
            csmHandoffEnteredAt:
              project.csmHandoffEnteredAt || new Date().toISOString().split('T')[0],
            customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
            lastUpdated: new Date().toISOString(),
          });
        }
        setCommunicationSent(true);
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#191E29] via-[#132D46] to-[#01C38D] text-white p-6 sm:p-8 overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPortalMode('csm-intro-booking')}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      portalMode === 'csm-intro-booking'
                        ? 'bg-[#01C38D] text-[#191E29] shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>CSM Intro - Pre-Implementation (Schedule Training)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortalMode('csm-handoff')}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      portalMode === 'csm-handoff'
                        ? 'bg-[#01C38D] text-[#191E29] shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CSM Handoff Milestone (Handoff Info Only)</span>
                  </button>
                </div>

                {portalMode === 'csm-intro-booking' ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5">
                      Schedule a Training Session with Your CSM
                    </h1>
                    <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                      Triggered on the <strong>CSM Intro - Pre-implementation</strong> milestone for{' '}
                      <strong className="text-white">{project.propertyName}</strong>. Whether you&apos;re brand new or need a feature walkthrough, book time directly with your designated Customer Success Manager below.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5">
                      Welcome to Customer Success Handoff!
                    </h1>
                    <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                      Congratulations on reaching the final stage of implementation at{' '}
                      <strong className="text-white">{project.propertyName}</strong>. Transitioning from Implementation Engineering to your dedicated Customer Success Manager (handoff details only).
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50">
            {portalMode === 'csm-intro-booking' ? (
              <>
                {/* Top Automation Bar & Help Article Reference */}
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-sky-600 text-white rounded-xl shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-950">
                          CSM Intro - Pre-Implementation Calendar Automation
                        </span>
                        <a
                          href={QUEXT_TRAINING_HELP_ARTICLE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:underline bg-white px-2 py-0.5 rounded border border-sky-200"
                        >
                          <span>help.quext.io Article #14668354</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-sky-900 mt-1 leading-relaxed">
                        Automatically provides the customer with their designated CSM&apos;s Google Calendar booking link (<strong>{designatedCsm.name}</strong>) as well as the full Quext CSM scheduling directory.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendCsmIntroCalendarAutomation}
                    className="px-4 py-2.5 rounded-xl bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {bookingEmailSent
                        ? 'Send Booking Link Again'
                        : `Email ${designatedCsm.name}'s Booking Link`}
                    </span>
                  </button>
                </div>

                {/* Designated CSM Featured Booking Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#01C38D] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={designatedCsm.avatar}
                      alt={designatedCsm.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#01C38D] shadow-sm shrink-0"
                    />
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ★ Designated Project CSM for {project.propertyName}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">
                        {designatedCsm.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-500">{designatedCsm.title}</p>
                      <p className="text-xs italic text-slate-700 mt-1.5">
                        &ldquo;{designatedCsm.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                    <a
                      href={designatedCsm.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#01C38D]" />
                      <span>👉 Click Here to Book a Session</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                    <span className="text-[10px] font-mono text-slate-500 text-center truncate max-w-[260px]">
                      {designatedCsm.bookingUrl}
                    </span>
                  </div>
                </div>

                {/* Full CSM Directory from https://help.quext.io/en/articles/14668354-schedule-a-training-session */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
                      Choose Your Customer Success Manager (Individual Booking Links)
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Synced with help.quext.io
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CSM_CALENDAR_BOOKING_DIRECTORY.map((csm) => {
                      const isDesignated = csm.name === designatedCsm.name;
                      return (
                        <div
                          key={csm.name}
                          className={`p-4 rounded-2xl border bg-white flex flex-col justify-between gap-3 transition-all ${
                            isDesignated
                              ? 'border-[#01C38D] ring-2 ring-[#01C38D]/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <img
                              src={csm.avatar}
                              alt={csm.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-black text-sm text-slate-900 truncate">
                                  {csm.name}
                                </h4>
                                {isDesignated && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                    Assigned CSM
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-500">
                                {csm.title}
                              </div>
                              <p className="text-xs italic text-slate-600 mt-1">
                                &ldquo;{csm.quote}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={csm.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-black text-sky-700 hover:text-sky-900 hover:underline"
                            >
                              <span>👉 Click Here to Book a Session</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <span className="text-[10px] font-mono text-slate-400">
                              Google Calendar
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* What We Can Help With & Related Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                      <Sparkles className="w-4 h-4 text-[#01C38D]" />
                      <span>What We Can Help With</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium list-disc list-inside">
                      <li>Getting started with your system</li>
                      <li>Feature walkthroughs and refreshers</li>
                      <li>Troubleshooting and questions</li>
                      <li>Best practices and tips</li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>Related Quext Help Center Articles</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <a
                        href="https://help.quext.io/en/articles/10297981-staff-create-a-quext-pass"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-sky-800 font-bold border border-slate-200 transition-colors"
                      >
                        <span>Staff - Create a Quext Pass</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="https://help.quext.io/en/articles/13622261-residents-how-to-set-up-and-use-wallet-access"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-sky-800 font-bold border border-slate-200 transition-colors"
                      >
                        <span>Residents - How to Set Up and Use Wallet Access</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Not sure who your CSM is? Use &ldquo;Chat with Support&rdquo; within the More page of your app.
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 7-Day Auto-Close Rule Notice */}
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                        7-Day CSM Handoff Auto-Close Policy
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                        Once a project enters the <strong>CSM Handoff</strong> milestone, it remains in active transition review for 7 days and then automatically transitions to <strong>Project Closed</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {autoCloseInfo.isAlreadyClosed ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Project Closed
                      </span>
                    ) : autoCloseInfo.isOnCsmHandoff ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        Auto-Closes in {autoCloseInfo.daysRemaining}{' '}
                        {autoCloseInfo.daysRemaining === 1 ? 'Day' : 'Days'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 text-xs font-bold">
                        7-Day Window Armed
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Grid: CSM Intro & Department Transition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CSM Profile Card */}
                  <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#01C38D]/10 rounded-bl-full pointer-events-none" />

                    <div className="relative shrink-0">
                      <img
                        src={designatedCsm.avatar}
                        alt={designatedCsm.name}
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#01C38D] shadow-md"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-[#01C38D] text-[#191E29] p-1.5 rounded-lg shadow-sm">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#01C38D] bg-[#01C38D]/10 px-2.5 py-0.5 rounded-md">
                          Your Dedicated CSM
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 mt-1">
                          {designatedCsm.name}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500">
                          {designatedCsm.title}
                        </p>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        &ldquo;{designatedCsm.quote}&rdquo;
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                        <a
                          href={`mailto:${designatedCsm.email}`}
                          className="flex items-center hover:text-[#01C38D] transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-1.5 text-slate-400" />
                          {designatedCsm.email}
                        </a>
                        <a
                          href={`tel:${designatedCsm.phone}`}
                          className="flex items-center hover:text-[#01C38D] transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-1.5 text-slate-400" />
                          {designatedCsm.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Department Transition Card */}
                  <div className="bg-[#191E29] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#01C38D]">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">Department Transition</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your physical installation and portal configuration are complete. Moving forward, your CSM is your primary point of contact for ongoing account management, resident adoption, and long-term property success.
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#01C38D]">
                      <span>Implementation</span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="bg-[#01C38D] text-[#191E29] px-2.5 py-1 rounded-md">
                        Customer Success
                      </span>
                    </div>
                  </div>
                </div>

                {/* CSM Handoff Summary & Dispatch Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-[#01C38D]/20 text-[#01C38D] rounded-xl">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">CSM Handoff Communication Package</h3>
                        <p className="text-xs text-slate-400">
                          Send the official CSM introduction and handoff details directly to {project.propertyName} stakeholders
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-[#01C38D] text-[11px] font-black uppercase tracking-wider rounded-full">
                      Handoff Only • No Training Links
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    {communicationSent ? (
                      <div className="text-center py-8 max-w-lg mx-auto space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900">
                          CSM Handoff Communication Sent!
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          The CSM Handoff introduction for <strong>{project.propertyName}</strong> introducing <strong>{designatedCsm.name}</strong> ({designatedCsm.email}) has been dispatched to the customer stakeholder list.
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={() => setCommunicationSent(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            Send another handoff communication
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Included Handoff Information
                          </h4>
                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs text-slate-700">
                            <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                              <span className="font-semibold text-slate-500">Property &amp; Project:</span>
                              <span className="font-black text-slate-900">
                                {project.propertyName} ({project.unitsCount} Units)
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                              <span className="font-semibold text-slate-500">Transitioning PM:</span>
                              <span className="font-bold text-slate-800">
                                {project.assignedPM.name}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                              <span className="font-semibold text-slate-500">Assigned CSM:</span>
                              <span className="font-black text-emerald-700">
                                {designatedCsm.name}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                              <span className="font-semibold text-slate-500">CSM Direct Contact:</span>
                              <span className="font-bold text-slate-800">
                                {designatedCsm.email} • {designatedCsm.phone}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="font-semibold text-slate-500">
                                Project Closure Schedule:
                              </span>
                              <span className="font-bold text-slate-800">
                                Auto-closes 7 days after handoff initiation
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                              Optional Personal Handoff Note from PM
                            </label>
                            <textarea
                              rows={2}
                              value={customNote}
                              onChange={(e) => setCustomNote(e.target.value)}
                              placeholder="Add a warm transition note for the property manager and regional team..."
                              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#01C38D] outline-none transition-all resize-none"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-5">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                              Ready to Dispatch
                            </span>
                            <h4 className="text-base font-black text-slate-900">
                              Send Official CSM Handoff Communication
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Dispatches the formal handoff email introducing {designatedCsm.name}, providing direct escalation contacts, and confirming completion of the implementation phase.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleSendHandoffCommunication}
                            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] shadow-lg shadow-[#01C38D]/20 transition-all cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send CSM Handoff Communication</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:px-8 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 text-xs text-slate-500">
            <span>
              {portalMode === 'csm-intro-booking'
                ? 'Quext CSM Intro - Pre-Implementation Calendar Booking Automation'
                : 'Quext Customer Success Handoff Portal'}
            </span>
            <button
              onClick={onClose}
              className="font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>

        <LiveGmailConfirmModal
          payload={gmailModalPayload}
          onClose={() => setGmailModalPayload(null)}
        />
      </div>
    </AnimatePresence>
  );
};

