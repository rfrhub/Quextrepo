import React, { useState, useEffect, useMemo } from 'react';
import {
  OperationProject,
  CustomerCommsLog,
  CustomerEmailCadence,
  getCsmHandoffAutoCloseInfo,
  getCSMCalendarBookingProfile,
  CSM_CALENDAR_BOOKING_DIRECTORY,
  QUEXT_TRAINING_HELP_ARTICLE_URL,
  buildCustomerKickoffPortalUrl,
} from '../types';
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
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  ExternalLink,
  ShieldCheck,
  BellRing,
  Eye,
  X,
  Check,
  RefreshCw,
  Copy,
  ClipboardList,
  AlertCircle,
  LogOut,
  Calendar,
  Users,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';

interface CustomerCommsControlPanelProps {
  project: OperationProject;
  onUpdateProject: (project: OperationProject) => void;
  onOpenKickoffWalkthrough: () => void;
  onOpenCSMPortal: (mode?: 'csm-intro-booking' | 'csm-handoff') => void;
}

export const CustomerCommsControlPanel: React.FC<CustomerCommsControlPanelProps> = ({
  project,
  onUpdateProject,
  onOpenKickoffWalkthrough,
  onOpenCSMPortal,
}) => {
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState<
    'kickoff' | 'digest' | 'csm' | 'csm_calendar' | 'sow_forecast' | 'stress_test' | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPortalUrl, setCopiedPortalUrl] = useState(false);

  // Live Gmail Authentication & Stress-Test Recipient State
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);
  const [stressTestRecipient, setStressTestRecipient] = useState<string>('RFRleasing@gmail.com');
  const [modalRecipientInput, setModalRecipientInput] = useState<string>('');
  const [isSendingLiveEmail, setIsSendingLiveEmail] = useState<boolean>(false);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setGmailUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
      if (user?.email) {
        setStressTestRecipient((prev) =>
          prev === 'RFRleasing@gmail.com' || !prev.trim() ? user.email! : prev
        );
      }
    });
    return unsub;
  }, []);

  const clientPortalUrl = buildCustomerKickoffPortalUrl(project.id);

  const handleCopyPortalUrl = () => {
    navigator.clipboard.writeText(clientPortalUrl);
    setCopiedPortalUrl(true);
    triggerToast('Client-only Kickoff Walkthrough link copied to clipboard!');
    setTimeout(() => setCopiedPortalUrl(false), 2500);
  };

  const cadence: CustomerEmailCadence =
    project.emailOverviewCadence ||
    project.customerIntake?.emailUpdatesCadence ||
    'weekly';
  const logs: CustomerCommsLog[] = project.customerCommsLogs || [];
  const sowForecastCadenceEnabled = project.sowForecastCadenceEnabled ?? true;

  // Compute progress metrics for dynamic email template
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.status === 'Completed').length;
  const currentMilestone =
    project.milestones.find((m) => m.status === 'In Progress') ||
    project.milestones.find((m) => m.status === 'Upcoming') ||
    project.milestones[project.milestones.length - 1];
  const progressPercent =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const isPreImplementationMilestone =
    currentMilestone?.title === 'CSM Intro - Pre-implementation';
  const csmHandoffMilestone = project.milestones.find((m) => m.title === 'CSM Handoff');
  const isCSMHandoffActive =
    csmHandoffMilestone?.status === 'In Progress' ||
    csmHandoffMilestone?.status === 'Completed';
  const autoCloseInfo = getCsmHandoffAutoCloseInfo(project);

  // Additional customer emails manually added by PM for automated and manual dispatches
  const additionalCustomerEmails = useMemo(() => {
    return (
      project.additionalCustomerEmails ||
      project.customerIntake?.additionalCustomerEmails ||
      []
    );
  }, [project.additionalCustomerEmails, project.customerIntake?.additionalCustomerEmails]);

  const [newCustomerEmailInput, setNewCustomerEmailInput] = useState<string>('');

  // Extract stakeholder emails from staffRoles / customerIntake
  const staffRecipients = useMemo(() => {
    return (project.customerIntake?.staffRoles || [])
      .filter((s) => s.email && s.email.trim().length > 0)
      .map((s) => s.email.trim());
  }, [project.customerIntake?.staffRoles]);

  const primaryRecipientEmail =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    stressTestRecipient ||
    'RFRleasing@gmail.com';

  // Comprehensive recipient list including primary, onsite staff, and PM-added customer emails
  const allConfiguredCustomerRecipients = useMemo(() => {
    const set = new Set<string>();
    if (primaryRecipientEmail && primaryRecipientEmail.trim()) {
      set.add(primaryRecipientEmail.trim());
    }
    staffRecipients.forEach((e) => {
      if (e.trim()) set.add(e.trim());
    });
    additionalCustomerEmails.forEach((e) => {
      if (e.trim()) set.add(e.trim());
    });
    return Array.from(set);
  }, [primaryRecipientEmail, staffRecipients, additionalCustomerEmails]);

  const defaultRecipients =
    allConfiguredCustomerRecipients.length > 0
      ? allConfiguredCustomerRecipients
      : [primaryRecipientEmail];

  const csmBookingProfile = getCSMCalendarBookingProfile(project.assignedCSM);

  const handleAddCustomerEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formEl = e?.target as HTMLElement | undefined;
    const fallbackInputVal = formEl?.closest('form')?.querySelector('input')?.value || '';
    const textToProcess = (newCustomerEmailInput || fallbackInputVal).trim();
    if (!textToProcess) return;

    // Parse comma or semicolon separated emails
    const rawTokens = textToProcess
      .split(/[,;\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = rawTokens.filter((email) => emailRegex.test(email));

    if (validEmails.length === 0) {
      triggerToast('Please enter a valid email address (e.g. owner@property.com).');
      return;
    }

    const currentList = new Set(additionalCustomerEmails.map((em) => em.toLowerCase()));
    const toAdd = validEmails.filter((em) => !currentList.has(em));

    if (toAdd.length === 0) {
      triggerToast('Entered email address is already in the customer distribution list.');
      setNewCustomerEmailInput('');
      return;
    }

    const updatedList = [...additionalCustomerEmails, ...toAdd];

    onUpdateProject({
      ...project,
      additionalCustomerEmails: updatedList,
      customerIntake: {
        ...(project.customerIntake || {
          pmsSoftware: 'Yardi',
          commonAreaDoors: [],
          staffRoles: [],
        }),
        additionalCustomerEmails: updatedList,
      },
      lastUpdated: new Date().toISOString(),
    });

    setNewCustomerEmailInput('');
    triggerToast(
      `Added ${toAdd.join(', ')} to automatic cadence and manual customer updates!`
    );
  };

  const handleRemoveCustomerEmail = (emailToRemove: string) => {
    const updatedList = additionalCustomerEmails.filter(
      (em) => em.toLowerCase() !== emailToRemove.toLowerCase()
    );

    onUpdateProject({
      ...project,
      additionalCustomerEmails: updatedList,
      customerIntake: {
        ...(project.customerIntake || {
          pmsSoftware: 'Yardi',
          commonAreaDoors: [],
          staffRoles: [],
        }),
        additionalCustomerEmails: updatedList,
      },
      lastUpdated: new Date().toISOString(),
    });

    triggerToast(`Removed ${emailToRemove} from customer communications.`);
  };

  const openModalWithRecipients = (
    modalType: 'kickoff' | 'digest' | 'csm' | 'csm_calendar' | 'sow_forecast' | 'stress_test'
  ) => {
    setSendErrorMessage(null);
    if (modalType === 'stress_test') {
      setModalRecipientInput(stressTestRecipient || gmailUserEmail || 'RFRleasing@gmail.com');
    } else {
      const combined = Array.from(
        new Set([
          ...(stressTestRecipient.trim()
            ? stressTestRecipient.split(/[,;]+/).map((s) => s.trim())
            : []),
          ...defaultRecipients,
        ])
      )
        .filter(Boolean)
        .join(', ');
      setModalRecipientInput(combined);
    }
    setShowEmailPreviewModal(modalType);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleCadenceChange = (newCadence: CustomerEmailCadence) => {
    onUpdateProject({
      ...project,
      emailOverviewCadence: newCadence,
      customerIntake: {
        ...(project.customerIntake || {
          pmsSoftware: 'Yardi',
          commonAreaDoors: [],
          staffRoles: [],
        }),
        emailUpdatesCadence: newCadence,
      },
      lastUpdated: new Date().toISOString(),
    });
    triggerToast(`Automated progress cadence updated to ${newCadence.toUpperCase()}.`);
  };

  const handleToggleSowForecastCadence = () => {
    const nextVal = !sowForecastCadenceEnabled;
    onUpdateProject({
      ...project,
      sowForecastCadenceEnabled: nextVal,
      lastUpdated: new Date().toISOString(),
    });
    triggerToast(
      nextVal
        ? `SOW Forecaster overview synced to ${cadence.toUpperCase()} customer cadence.`
        : 'SOW Forecaster milestone cadence automation paused.'
    );
  };

  const sowItems = project.sowForecastItems || [];

  const buildEmailContent = (
    modalType: 'kickoff' | 'digest' | 'csm' | 'csm_calendar' | 'sow_forecast' | 'stress_test'
  ): { subject: string; summary: string; htmlBody: string; logType: CustomerCommsLog['type'] } => {
    const logoImgTag = `<img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />`;

    if (modalType === 'kickoff') {
      const subject = `[Action Required] Quext Smart Community Kickoff Walkthrough & Hardware Guide — ${project.propertyName}`;
      const summary = `Dispatched interactive Customer Kickoff Walkthrough packet (${progressPercent}% milestone progress).`;
      const htmlBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
          <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
            ${logoImgTag}
            <span style="float: right; font-size: 11px; color: #64748b; text-transform: uppercase; line-height: 28px;">Customer Kickoff Walkthrough</span>
          </div>
          <p>Hello <strong>${project.clientName}</strong> Team,</p>
          <p>Welcome to your Quext Smart Community deployment for <strong>${project.propertyName}</strong> (${project.unitsCount} units). Below is your interactive <strong>Customer Kickoff Walkthrough &amp; Hardware Guide</strong> link:</p>
          <p style="margin: 20px 0;">
            <a href="${clientPortalUrl}" style="background-color: #01C38D; color: #0f172a; font-weight: bold; padding: 10px 18px; border-radius: 8px; text-decoration: none; display: inline-block;">Open Interactive Customer Kickoff Portal</a>
          </p>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px;">
            <strong>Included in your Kickoff Walkthrough:</strong>
            <ul>
              <li>End-to-End 7-Stage Deployment Roadmap &amp; Responsibilities</li>
              <li>Portal Build-Out, PMS Integration (${project.customerIntake?.pmsSoftware || 'Yardi'}) &amp; Common Area Door Tree</li>
              <li>QR Intercom Logo Upload &amp; NFC Wallet Upgrade Card Art Intake</li>
              <li>Site Maps Gateway Location Confirmation PDF Intake</li>
            </ul>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Best regards,<br/>
            <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations (${project.assignedPM.email})
          </p>
        </div>
      `;
      return { subject, summary, htmlBody, logType: 'kickoff_submission' };
    }

    if (modalType === 'digest') {
      const subject = `[${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Status Digest] ${project.propertyName} Deployment Progress (${progressPercent}% Complete)`;
      const summary = `Sent ${cadence} deployment progress overview at stage "${currentMilestone?.title || 'Kickoff'}" (${progressPercent}% complete).`;
      const htmlBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
          <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
            ${logoImgTag}
            <span style="float: right; font-size: 11px; color: #64748b; text-transform: uppercase; line-height: 28px;">Deployment Progress Digest</span>
          </div>
          <p>Hello <strong>${project.clientName}</strong> Team,</p>
          <p>Here is your <strong>${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Deployment Progress Digest</strong> for <strong>${project.propertyName}</strong>.</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Overall Milestone Completion:</strong> ${completedMilestones} of ${totalMilestones} Milestones (${progressPercent}%)</p>
            <p style="margin: 0 0 8px 0;"><strong>Current Active Stage:</strong> ${currentMilestone?.title || 'In Progress'}</p>
            <p style="margin: 0;"><strong>Target Completion Date:</strong> ${project.targetCompletionDate}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Best regards,<br/>
            <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
          </p>
        </div>
      `;
      return { subject, summary, htmlBody, logType: 'deployment_overview_email' };
    }

    if (modalType === 'csm_calendar') {
      const subject = `[CSM Intro - Pre-Implementation] Schedule a Training Session with ${csmBookingProfile.name} — ${project.propertyName}`;
      const summary = `Dispatched CSM Intro - Pre-implementation Calendar Booking Link for ${csmBookingProfile.name} (${csmBookingProfile.bookingUrl}) and Quext CSM Training Directory.`;
      const allCsmDirectoryRows = CSM_CALENDAR_BOOKING_DIRECTORY.map(
        (csm) => `
          <li style="margin-bottom: 8px;">
            <strong>${csm.name}</strong> (${csm.title}) — <em>"${csm.quote}"</em><br/>
            <a href="${csm.bookingUrl}" style="color: #0284c7; font-weight: bold;">Book time with ${csm.name.split(' ')[0]} here</a>
          </li>
        `
      ).join('');
      const htmlBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
          <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
            ${logoImgTag}
            <span style="float: right; font-size: 11px; color: #01C38D; text-transform: uppercase; font-weight: bold; line-height: 28px;">CSM Intro • Pre-Implementation</span>
          </div>
          <p>Hello <strong>${project.clientName}</strong> Team,</p>
          <p><strong>${project.propertyName}</strong> has entered the <strong>CSM Intro - Pre-implementation</strong> milestone! You can now schedule a personalized 1-on-1 training session directly with your designated Customer Success Manager.</p>
          <div style="background-color: #f0fdf4; padding: 16px; border-radius: 10px; border: 1px solid #bbf7d0; margin: 16px 0;">
            <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Your Designated CSM: ${csmBookingProfile.name}</strong> (${csmBookingProfile.title})</p>
            <p style="margin: 0 0 12px 0; font-style: italic; color: #166534;">"${csmBookingProfile.quote}"</p>
            <a href="${csmBookingProfile.bookingUrl}" style="background-color: #01C38D; color: #0f172a; font-weight: bold; padding: 10px 18px; border-radius: 8px; text-decoration: none; display: inline-block;">Book time with ${csmBookingProfile.name.split(' ')[0]} here</a>
          </div>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Schedule a Training Session — Full Quext CSM Directory (<a href="${QUEXT_TRAINING_HELP_ARTICLE_URL}" style="color: #0284c7;">help.quext.io</a>):</strong></p>
            <ul style="padding-left: 18px; margin: 0;">${allCsmDirectoryRows}</ul>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Best regards,<br/>
            <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
          </p>
        </div>
      `;
      return { subject, summary, htmlBody, logType: 'csm_handoff_email' };
    }

    if (modalType === 'sow_forecast') {
      const subject = `[Installation Scope Summary] ${project.propertyName} (${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Cadence)`;
      const summary = `Dispatched SOW Forecaster installer scope overview matched against BOM line items (${sowItems.length} scope items) on ${cadence} cadence.`;
      const tableRowsHtml = sowItems
        .map((item) => {
          const rowBomIds =
            item.bomItemIds && item.bomItemIds.length > 0
              ? item.bomItemIds
              : [item.bomItemId];
          const matchedBoms = project.bomItems.filter((b) => rowBomIds.includes(b.id));
          const qtyMap = item.bomItemQuantities || {};

          const installedHtml =
            matchedBoms.length > 0
              ? matchedBoms
                  .map(
                    (b) =>
                      `<div style="margin-bottom: 3px; font-weight: 600; color: #0f172a;">${b.name}</div>`
                  )
                  .join('')
              : `<div style="font-weight: 600; color: #0f172a;">${item.bomItemName}</div>`;

          const qtyHtml =
            matchedBoms.length > 0
              ? matchedBoms
                  .map((b) => {
                    const q =
                      qtyMap[b.id] !== undefined
                        ? qtyMap[b.id]
                        : matchedBoms.length === 1
                        ? item.forecastedQuantity
                        : b.quantity;
                    return `<div style="margin-bottom: 3px; font-family: monospace; font-weight: 700; color: #312e81;">${q} units</div>`;
                  })
                  .join('')
              : `<div style="font-family: monospace; font-weight: 700; color: #312e81;">${item.forecastedQuantity} units</div>`;

          const dateDisplay =
            !item.scheduledEndDate || item.scheduledStartDate === item.scheduledEndDate
              ? item.scheduledStartDate
              : `${item.scheduledStartDate} – ${item.scheduledEndDate}`;

          return `
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
                ${installedHtml}
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px; white-space: nowrap;">
                ${qtyHtml}
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #334155; white-space: nowrap;">
                ${dateDisplay}
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
                <div style="color: #1e293b; font-weight: 500; line-height: 1.4;">${item.workDescription}</div>
                ${
                  item.buildingOrArea
                    ? `<div style="font-size: 11px; color: #64748b; margin-top: 3px;">Location: ${item.buildingOrArea}</div>`
                    : ''
                }
              </td>
            </tr>
          `;
        })
        .join('');

      const tableSectionHtml =
        sowItems.length > 0
          ? `
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
                  <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">What Was Installed</th>
                  <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                  <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Date</th>
                  <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Scope of Work Summary</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>
          `
          : `<p style="font-size: 13px; color: #64748b; margin: 12px 0;">Initial installation scope alignment in progress.</p>`;

      const htmlBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
          <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
            ${logoImgTag}
            <span style="float: right; font-size: 11px; color: #4f46e5; font-weight: bold; text-transform: uppercase; line-height: 28px;">Installation Scope Summary</span>
          </div>
          <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155;">Here is the scheduled <strong>Installation &amp; Scope of Work Summary</strong> for <strong>${project.propertyName}</strong>:</p>
          ${tableSectionHtml}
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Best regards,<br/>
            <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
          </p>
        </div>
      `;
      return { subject, summary, htmlBody, logType: 'sow_forecast_email' };
    }

    if (modalType === 'stress_test') {
      const subject = `[Quext Live Inbox Stress-Test] Real Email Delivery Verification — ${project.propertyName}`;
      const summary = `Dispatched live Gmail API stress-test email for ${project.propertyName} (Quote #${project.quoteNumber}).`;
      const htmlBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 2px solid #01C38D; border-radius: 12px; color: #1e293b;">
          <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
            ${logoImgTag}
            <span style="float: right; font-size: 11px; color: #01C38D; font-weight: bold; text-transform: uppercase; line-height: 28px;">LIVE INBOX STRESS-TEST</span>
          </div>
          <p>Hello Quext Operations Team,</p>
          <p>This is a <strong>real live email</strong> dispatched directly from the Quext Operations &amp; Deployment Hub via the Gmail API to verify end-to-end inbox delivery.</p>
          <div style="background-color: #f0fdf4; padding: 14px; border-radius: 8px; border: 1px solid #bbf7d0; font-size: 13px; margin: 16px 0;">
            <p style="margin: 0 0 6px 0;"><strong>Active Project:</strong> ${project.propertyName} (${project.city}, ${project.state})</p>
            <p style="margin: 0 0 6px 0;"><strong>Quote Number:</strong> #${project.quoteNumber} (${project.unitsCount} Residential Units)</p>
            <p style="margin: 0 0 6px 0;"><strong>Assigned PM:</strong> ${project.assignedPM.name} (${project.assignedPM.email})</p>
            <p style="margin: 0;"><strong>Milestone Progress:</strong> ${completedMilestones}/${totalMilestones} Milestones (${progressPercent}%)</p>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            Customer Kickoff Link: <a href="${clientPortalUrl}">${clientPortalUrl}</a>
          </p>
        </div>
      `;
      return { subject, summary, htmlBody, logType: 'custom_email' };
    }

    const subject = `[Milestone Reached: CSM Handoff] Meet Your Quext Customer Success Manager — ${project.propertyName}`;
    const summary = `Dispatched CSM Handoff introduction for ${project.assignedCSM || 'Nicole Franklin'} (handoff details only, 7-day auto-close armed).`;
    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
          ${logoImgTag}
          <span style="float: right; font-size: 11px; color: #64748b; text-transform: uppercase; line-height: 28px;">CSM Handoff</span>
        </div>
        <p>Hello <strong>${project.clientName}</strong> Team,</p>
        <p>Congratulations! <strong>${project.propertyName}</strong> has reached the <strong>CSM Handoff</strong> milestone. We are transitioning your property from Implementation Engineering to Customer Success.</p>
        <div style="background-color: #f0fdf4; padding: 14px; border-radius: 8px; border: 1px solid #bbf7d0; font-size: 13px; margin: 16px 0;">
          <p style="margin: 0 0 6px 0;"><strong>Your Dedicated CSM:</strong> ${project.assignedCSM || 'Nicole Franklin'}</p>
          <p style="margin: 0;">Note: Your implementation project record will automatically transition to Closed status 7 days following CSM Handoff initiation.</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
        </p>
      </div>
    `;
    return { subject, summary, htmlBody, logType: 'csm_handoff_email' };
  };

  const handleConfirmAndSendEmail = async () => {
    if (!showEmailPreviewModal) return;
    setSendErrorMessage(null);

    const { subject, summary, htmlBody, logType } = buildEmailContent(showEmailPreviewModal);
    const recipientsList = modalRecipientInput
      .split(/[,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

    if (recipientsList.length === 0) {
      setSendErrorMessage('Please enter at least one recipient email address in the "To" field.');
      return;
    }

    setIsSendingLiveEmail(true);
    try {
      if (needsAuth) {
        const signInResult = await googleSignIn();
        if (!signInResult) {
          setSendErrorMessage(
            'Google Sign-In popup was closed before completing. You can click "Sign in with Google" again, or use "Open in Gmail Web" / "Log Dispatch Only" below.'
          );
          setIsSendingLiveEmail(false);
          return;
        }
      }

      const gmailResult = await sendRealGmailEmail({
        to: recipientsList,
        subject,
        htmlBody,
      });

      const nowStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newLog: CustomerCommsLog = {
        id: `comm-${Date.now()}`,
        projectId: project.id,
        timestamp: nowStr,
        type: logType,
        recipientEmail: gmailResult.recipients.join(', '),
        subject,
        summary: `${summary} [Live Gmail ID: ${gmailResult.id}]`,
        sentBy: gmailUserEmail || project.assignedPM.name,
        cadence,
        status: 'Delivered',
      };

      onUpdateProject({
        ...project,
        customerCommsLogs: [newLog, ...logs],
        lastUpdated: new Date().toISOString(),
      });

      setShowEmailPreviewModal(null);
      triggerToast(
        `Real email delivered via Gmail to ${gmailResult.recipients.join(', ')} (Message ID: ${gmailResult.id})!`
      );
    } catch (err: any) {
      if (err?.message === 'NOT_AUTHENTICATED') {
        setNeedsAuth(true);
        setSendErrorMessage(
          'Please sign in with Google so we can send this email to your real inbox with your permission.'
        );
      } else {
        setSendErrorMessage(err?.message || 'Failed to send real email via Gmail.');
      }
    } finally {
      setIsSendingLiveEmail(false);
    }
  };

  const handleLogAndCompleteWithoutApi = (viaComposeTab: boolean) => {
    if (!showEmailPreviewModal) return;
    const { subject, summary, logType } = buildEmailContent(showEmailPreviewModal);
    const recipientsList = modalRecipientInput
      .split(/[,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);
    const finalRecipients =
      recipientsList.length > 0 ? recipientsList : [primaryRecipientEmail];

    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLog: CustomerCommsLog = {
      id: `comm-${Date.now()}`,
      projectId: project.id,
      timestamp: nowStr,
      type: logType,
      recipientEmail: finalRecipients.join(', '),
      subject,
      summary: viaComposeTab ? `${summary} [Opened in Gmail Web Compose]` : summary,
      sentBy: gmailUserEmail || project.assignedPM.name,
      cadence,
      status: 'Delivered',
    };

    onUpdateProject({
      ...project,
      customerCommsLogs: [newLog, ...logs],
      lastUpdated: new Date().toISOString(),
    });

    setShowEmailPreviewModal(null);
    triggerToast(
      viaComposeTab
        ? `Opened pre-filled email in Gmail Web Compose for ${finalRecipients.join(', ')} and logged dispatch!`
        : `Logged communication dispatch for ${finalRecipients.join(', ')}!`
    );
  };

  const handleTriggerCadenceNow = async () => {
    if (cadence === 'none') {
      triggerToast('Automated cadence is currently paused. Please select Weekly or Bi-Weekly cadence.');
      return;
    }

    const { subject, summary, htmlBody, logType } = buildEmailContent('digest');
    const recipientsList = defaultRecipients;
    const cadenceSubject = `[Automated ${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Cadence] ${subject}`;

    setIsSendingLiveEmail(true);
    try {
      if (!needsAuth && sendRealGmailEmail) {
        const gmailResult = await sendRealGmailEmail({
          to: recipientsList,
          subject: cadenceSubject,
          htmlBody,
        });

        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newLog: CustomerCommsLog = {
          id: `comm-cadence-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: logType,
          recipientEmail: gmailResult.recipients.join(', '),
          subject: cadenceSubject,
          summary: `Automated ${cadence} cadence triggered. Delivered to ${gmailResult.recipients.length} customer recipient(s) [Gmail ID: ${gmailResult.id}].`,
          sentBy: gmailUserEmail || project.assignedPM.name,
          cadence,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          customerCommsLogs: [newLog, ...logs],
          lastUpdated: new Date().toISOString(),
        });

        triggerToast(
          `Automated ${cadence} cadence delivered via Gmail to ${gmailResult.recipients.join(', ')}!`
        );
      } else {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newLog: CustomerCommsLog = {
          id: `comm-cadence-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: logType,
          recipientEmail: recipientsList.join(', '),
          subject: cadenceSubject,
          summary: `Automated ${cadence} cadence triggered. Dispatched to ${recipientsList.length} customer recipient(s).`,
          sentBy: gmailUserEmail || project.assignedPM.name,
          cadence,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          customerCommsLogs: [newLog, ...logs],
          lastUpdated: new Date().toISOString(),
        });

        triggerToast(
          `Automated ${cadence} cadence triggered & logged for ${recipientsList.join(', ')}!`
        );
      }
    } catch (err: any) {
      triggerToast(err?.message || 'Failed to dispatch automated cadence.');
    } finally {
      setIsSendingLiveEmail(false);
    }
  };

  const lastKickoffSentLog = logs.find((l) => l.type === 'kickoff_submission');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#191E29] via-[#132D46] to-[#191E29] px-6 py-5 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#01C38D]/20 border border-[#01C38D]/40 flex items-center justify-center text-[#01C38D] shrink-0 mt-0.5">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#01C38D]/20 text-[#01C38D] border border-[#01C38D]/30">
                Customer Experience &amp; Automation Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {defaultRecipients.length} Active Stakeholder Recipient
                {defaultRecipients.length === 1 ? '' : 's'}
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight mt-1">
              Customer Communications &amp; Milestone Digest Control Panel
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Dispatch real Gmail client kickoff packets, weekly/bi-weekly milestone progress emails, SOW Forecaster overviews, and CSM handoff introductions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenKickoffWalkthrough}
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-[#01C38D]" />
            Launch Interactive Kickoff Doc
          </button>
          <button
            onClick={handleCopyPortalUrl}
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/30 transition-colors cursor-pointer"
            title="Copy standalone client-only URL without internal PM controls"
          >
            {copiedPortalUrl ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            {copiedPortalUrl ? 'Client Link Copied!' : 'Copy Client-Only Link'}
          </button>
          <button
            onClick={() => onOpenCSMPortal()}
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] text-xs font-black transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Preview CSM Booking &amp; Handoff Portal
          </button>
        </div>
      </div>

      {/* Live Inbox & Team Email Stress-Test Bar */}
      <div className="px-6 py-3.5 bg-emerald-50/70 border-b border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                Live Gmail Inbox &amp; Team Stress-Test Mode
              </span>
              {!needsAuth ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ Connected as {gmailUserEmail}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Sign in with Google to send real emails
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Enter your email or comma-separated team member emails below to deliver real emails directly to your inbox when testing any module.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={stressTestRecipient}
            onChange={(e) => setStressTestRecipient(e.target.value)}
            placeholder="e.g. RFRleasing@gmail.com, team@onequext.com"
            className="px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-900 font-medium w-64 focus:outline-none focus:border-emerald-600"
            title="Test recipient email(s) (comma-separated for multiple team members)"
          />
          <button
            type="button"
            onClick={() => openModalWithRecipients('stress_test')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Live Test Email</span>
          </button>
          {needsAuth ? (
            <GoogleSignInButton />
          ) : (
            <button
              type="button"
              onClick={() => logout()}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Disconnect or switch Google account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Customer Email Distribution List for Automated Cadence & Manual Updates */}
      <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Customer Email Distribution List (Cadence &amp; Manual Updates)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {allConfiguredCustomerRecipients.length} Recipient{allConfiguredCustomerRecipients.length === 1 ? '' : 's'} Subscribed
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                All customer emails listed below automatically receive recurring Weekly / Bi-Weekly milestone progress digests when cadence triggers, as well as any manual updates dispatched by PMs.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-medium text-slate-500">
              Active Cadence: <strong className="text-slate-900 font-bold uppercase">{cadence === 'biweekly' ? 'Bi-Weekly' : cadence === 'none' ? 'Paused' : 'Weekly'}</strong>
            </span>
          </div>
        </div>

        {/* Recipient Badges / Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          {/* Primary Contact */}
          {primaryRecipientEmail && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="font-semibold text-slate-800">{primaryRecipientEmail}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Primary
              </span>
            </div>
          )}

          {/* Onsite Staff Roles */}
          {staffRecipients
            .filter((e) => e.toLowerCase() !== primaryRecipientEmail.toLowerCase())
            .map((email) => (
              <div key={email} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{email}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Staff Role
                </span>
              </div>
            ))}

          {/* Manually Added Additional Customer Emails */}
          {additionalCustomerEmails.map((email) => (
            <div
              key={email}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs shadow-2xs group transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-emerald-950">{email}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Added by PM
              </span>
              <button
                type="button"
                onClick={() => handleRemoveCustomerEmail(email)}
                title={`Remove ${email} from customer distribution`}
                className="ml-1 p-0.5 rounded text-emerald-700 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {allConfiguredCustomerRecipients.length === 0 && (
            <span className="text-xs text-slate-400 italic">No customer recipients configured yet. Add one below.</span>
          )}
        </div>

        {/* Add Customer Email Form */}
        <form onSubmit={handleAddCustomerEmail} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={newCustomerEmailInput}
              onChange={(e) => setNewCustomerEmailInput(e.target.value)}
              placeholder="Add customer email (e.g. owner@property.com, assetmgr@equity.com)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer Email</span>
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950 text-emerald-200 px-6 py-3 text-xs font-bold flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#01C38D] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Core Automation Modules */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 bg-slate-50/60">
        {/* Module 1: Initial Kickoff Walkthrough & Hardware Guide */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Step 1 • Project Initiation
              </span>
              {lastKickoffSentLog ? (
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Sent
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-bold text-amber-600">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Ready to Send
                </span>
              )}
            </div>

            <h4 className="text-base font-black text-slate-900 mb-1.5">
              Customer Kickoff Walkthrough &amp; Intake Form
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Interactive client guide covering the 7 deployment milestones, hardware requirements, Site Map Gateway PDF upload, QR Intercom &amp; NFC Wallet asset uploads, and Common Area Door Tree schedule.
            </p>

            {/* Client Intake Submission Status Banner */}
            <div
              className={`rounded-xl p-3 border mb-3 ${
                project.customerIntake?.submittedAt
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-amber-50/70 border-amber-200/80'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">Customer Intake Status:</span>
                {project.customerIntake?.submittedAt ? (
                  <span className="font-black text-emerald-700 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Submitted
                  </span>
                ) : (
                  <span className="font-bold text-amber-800">Awaiting Client Input</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-4 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Last Dispatched:</span>
                <span className="font-bold text-slate-800">
                  {lastKickoffSentLog?.timestamp || 'Not sent yet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Primary Contact:</span>
                <span className="font-bold text-slate-800 truncate max-w-[160px]">
                  {primaryRecipientEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModalWithRecipients('kickoff')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#01C38D]" />
                <span>Send Kickoff Pack</span>
              </button>
              <button
                onClick={onOpenKickoffWalkthrough}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="View Interactive Kickoff Document"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleCopyPortalUrl}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copiedPortalUrl ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span>
                {copiedPortalUrl ? 'Copied Client-Only Link!' : 'Copy Client-Only Walkthrough URL'}
              </span>
            </button>
          </div>
        </div>

        {/* Module 2: Automated Weekly / Bi-Weekly Progress Cadence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Step 2 • Recurring Progress Digest
              </span>
              <span className="text-[11px] font-black text-slate-700">
                {progressPercent}% Complete
              </span>
            </div>

            <h4 className="text-base font-black text-slate-900 mb-1.5">
              Automated Milestone Status Cadence
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Automatically emails property stakeholders a visual milestone progress tracker, current stage summary, and upcoming customer action items.
            </p>

            {/* Cadence Selector */}
            <div className="mb-4">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Delivery Frequency
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['weekly', 'biweekly', 'none'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCadenceChange(option)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      cadence === option
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {option === 'biweekly' ? 'Bi-Weekly' : option === 'none' ? 'Paused' : 'Weekly'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-4 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Active Milestone:</span>
                <span className="font-bold text-emerald-700">{currentMilestone?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Cadence Start Date:</span>
                <span className="font-bold text-slate-800">
                  {project.emailCadenceStartDate ||
                    (cadence === 'none' ? 'Paused' : project.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Cadence Recipients:</span>
                <span className="font-bold text-slate-800">
                  {allConfiguredCustomerRecipients.length} Recipient{allConfiguredCustomerRecipients.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTriggerCadenceNow}
              disabled={cadence === 'none' || isSendingLiveEmail}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-40"
              title={`Trigger automated ${cadence} cadence email dispatch right now`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {cadence === 'none'
                  ? 'Cadence Paused'
                  : `Trigger ${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Cadence Now`}
              </span>
            </button>
            <button
              onClick={() => openModalWithRecipients('digest')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] text-xs font-black flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Preview &amp; Send Status Digest Now</span>
            </button>
          </div>
        </div>

        {/* Module 3: CSM Intro - Pre-implementation (CSM Calendar Booking Link + SOW Forecaster Automation) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Step 3 • CSM Intro - Pre-Implementation
              </span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isPreImplementationMilestone ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 mr-1" />
                {isPreImplementationMilestone ? 'Active Milestone' : 'Pre-Implementation'}
              </span>
            </div>

            <h4 className="text-base font-black text-slate-900 mb-1.5">
              CSM Calendar Booking &amp; SOW Forecaster Automation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Triggers whenever on the <strong>CSM Intro - Pre-implementation</strong> milestone: sends the customer their designated CSM&apos;s Google Calendar booking link (<a href={QUEXT_TRAINING_HELP_ARTICLE_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">help.quext.io</a>) and dispatches the SOW Forecaster overview on the{' '}
              <strong>
                {cadence === 'biweekly'
                  ? 'Bi-Weekly'
                  : cadence === 'weekly'
                  ? 'Weekly'
                  : 'Paused'}
              </strong>{' '}
              cadence.
            </p>

            {/* Designated CSM Calendar Booking Card */}
            <div className="bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-200 mb-3 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSM Booking: {csmBookingProfile.name}</span>
                </span>
                <a
                  href={csmBookingProfile.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
                >
                  <span>Book Calendar</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[10px] text-emerald-800 italic">
                &ldquo;{csmBookingProfile.quote}&rdquo;
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-4 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Trigger Milestone:</span>
                <span className="font-bold text-indigo-700">CSM Intro - Pre-implementation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Forecasted Line Items:</span>
                <span className="font-bold text-slate-800">{sowItems.length} Scope Line Items</span>
              </div>
              <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-600 font-bold">Auto-Send on Cadence:</span>
                <button
                  type="button"
                  onClick={handleToggleSowForecastCadence}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    sowForecastCadenceEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {sowForecastCadenceEnabled ? 'Enabled' : 'Paused'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openModalWithRecipients('csm_calendar')}
                className="flex-1 py-2 px-2.5 rounded-xl bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] text-xs font-black flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Send CSM Calendar Link</span>
              </button>
              <button
                onClick={() => onOpenCSMPortal('csm-intro-booking')}
                className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Open CSM Calendar Booking Directory Portal"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => openModalWithRecipients('sow_forecast')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Preview &amp; Send SOW Overview</span>
            </button>
          </div>
        </div>

        {/* Module 4: CSM Handoff Milestone Automation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Step 4 • Final Transition
              </span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isCSMHandoffActive ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
                {autoCloseInfo.isAlreadyClosed
                  ? 'Auto-Closed'
                  : autoCloseInfo.isOnCsmHandoff
                  ? `${autoCloseInfo.daysRemaining}d to Auto-Close`
                  : '7-Day Auto-Close'}
              </span>
            </div>

            <h4 className="text-base font-black text-slate-900 mb-1.5">
              CSM Handoff Milestone Automation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Sends the dedicated Customer Success Manager handoff introduction and department transition summary (without training links). Automatically closes the project <strong>7 days</strong> after entering CSM Handoff.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 mb-4 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Assigned CSM:</span>
                <span className="font-bold text-slate-800">
                  {project.assignedCSM || 'Nicole Franklin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Content Scope:</span>
                <span className="font-bold text-purple-700">CSM Handoff Info Only</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Auto-Close Rule:</span>
                <span className="font-bold text-slate-800">7 Days Post-Handoff</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => openModalWithRecipients('csm')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#01C38D]" />
              <span>Send Handoff Email</span>
            </button>
            <button
              onClick={() => onOpenCSMPortal('csm-handoff')}
              className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
              title="Open CSM Handoff Portal"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Communication Audit Log */}
      <div className="px-6 py-4 bg-white border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Recent Customer Communication Dispatch Log ({logs.length})
          </h4>
          <span className="text-[11px] text-slate-400">
            Live Gmail dispatches &amp; automated project logs
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No automated emails dispatched for this property yet. Use the controls above to send your first update.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-2 pr-4">Timestamp</th>
                  <th className="py-2 px-4">Communication Type</th>
                  <th className="py-2 px-4">Recipient(s)</th>
                  <th className="py-2 px-4">Subject Line</th>
                  <th className="py-2 px-4">Summary</th>
                  <th className="py-2 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 pr-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.type === 'kickoff_submission'
                            ? 'bg-blue-50 text-blue-700'
                            : log.type === 'deployment_overview_email'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.type === 'sow_forecast_email'
                            ? 'bg-indigo-50 text-indigo-700'
                            : log.type === 'shipping_update_email' ||
                              log.type === 'product_acceptance_request'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {log.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-700 max-w-[180px] truncate">
                      {log.recipientEmail}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 max-w-md truncate">
                      {log.subject}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">
                      {log.summary}
                    </td>
                    <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center text-emerald-600 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5 mr-1" /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Preview & Mandatory User Confirmation Modal for Real Gmail Delivery */}
      {showEmailPreviewModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#191E29] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-[#01C38D]" />
                <h3 className="font-bold text-base">
                  {showEmailPreviewModal === 'kickoff' &&
                    'Confirm & Dispatch Customer Kickoff Walkthrough Packet'}
                  {showEmailPreviewModal === 'digest' &&
                    'Confirm & Dispatch Automated Milestone Progress Digest'}
                  {showEmailPreviewModal === 'sow_forecast' &&
                    'Confirm & Dispatch SOW Forecaster Overview'}
                  {showEmailPreviewModal === 'csm_calendar' &&
                    'Confirm & Dispatch CSM Calendar Booking Link (Pre-Implementation)'}
                  {showEmailPreviewModal === 'csm' &&
                    'Confirm & Dispatch CSM Handoff Introduction'}
                  {showEmailPreviewModal === 'stress_test' &&
                    'Confirm & Send Live Inbox Stress-Test Email'}
                </h3>
              </div>
              <button
                onClick={() => setShowEmailPreviewModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Gmail Auth Status Banner inside Confirmation Modal */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  !needsAuth
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="text-xs">
                  <div className="font-bold">
                    {!needsAuth
                      ? `Sending via Gmail Account: ${gmailUserEmail}`
                      : 'Sign in with Google Required for Real Inbox Delivery'}
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    {!needsAuth
                      ? 'This email will be sent directly to the recipient inboxes listed below.'
                      : 'Authenticate with Google so we can send this email on your behalf with your permission.'}
                  </p>
                </div>
                {needsAuth && <GoogleSignInButton />}
              </div>

              {/* Editable To / From / Subject Block */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700">
                      To (Real Inbox Recipients — comma-separated):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const myEmail = gmailUserEmail || 'RFRleasing@gmail.com';
                        if (!modalRecipientInput.toLowerCase().includes(myEmail.toLowerCase())) {
                          setModalRecipientInput((prev) =>
                            prev.trim() ? `${prev.trim()}, ${myEmail}` : myEmail
                          );
                        }
                      }}
                      className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded cursor-pointer"
                    >
                      + Add {gmailUserEmail || 'RFRleasing@gmail.com'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={modalRecipientInput}
                    onChange={(e) => setModalRecipientInput(e.target.value)}
                    placeholder="e.g. RFRleasing@gmail.com, teammate@onequext.com"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex">
                  <span className="w-20 font-bold text-slate-500">From:</span>
                  <span className="text-slate-700">
                    {gmailUserEmail || `${project.assignedPM.name} <${project.assignedPM.email}>`}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-20 font-bold text-slate-500">Subject:</span>
                  <span className="font-bold text-slate-900">
                    {buildEmailContent(showEmailPreviewModal).subject}
                  </span>
                </div>
              </div>

              {/* Rendered HTML Email Body Preview */}
              <div
                className="border border-slate-200 rounded-xl p-4 bg-white text-xs text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: buildEmailContent(showEmailPreviewModal).htmlBody,
                }}
              />

              {sendErrorMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sendErrorMessage}</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={buildGmailWebComposeUrl({
                      to: modalRecipientInput || primaryRecipientEmail,
                      subject: buildEmailContent(showEmailPreviewModal).subject,
                      htmlBody: buildEmailContent(showEmailPreviewModal).htmlBody,
                    })}
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

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setShowEmailPreviewModal(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAndSendEmail}
                    disabled={isSendingLiveEmail}
                    className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-colors bg-[#01C38D] hover:bg-[#00b07f] text-[#191E29] cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSendingLiveEmail
                        ? 'Sending Real Email...'
                        : needsAuth
                        ? 'Sign In & Send Real Email via Gmail'
                        : 'Confirm & Send Real Email via Gmail'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
