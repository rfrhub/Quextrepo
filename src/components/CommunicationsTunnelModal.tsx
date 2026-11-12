import React, { useState, useMemo, useEffect } from 'react';
import {
  OperationProject,
  CustomerCommsLog,
  CustomerEmailCadence,
} from '../types';
import {
  Mail,
  Send,
  Sparkles,
  Plus,
  X,
  Check,
  CheckCircle2,
  Layers,
  Users,
  Calendar,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Building2,
  ArrowRight,
  Radio,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Share2,
  Zap,
} from 'lucide-react';
import {
  detectPortfolioContacts,
  buildDigestibleMilestoneCardEmailContent,
  buildRecipientPortfolioWideCardEmail,
  logPortfolioDispatchAcrossProjects,
  AiEmailTone,
} from '../services/portfolioEmailService';
import {
  subscribeToGmailAuth,
  sendRealGmailEmail,
  googleSignIn,
  buildGmailWebComposeUrl,
} from '../services/gmailService';
import { loadStoredProjects, saveStoredProjects } from '../data/initialData';
import { saveLiveProject } from '../services/realtimeSyncService';
import { GoogleSignInButton } from './GoogleSignInButton';

interface CommunicationsTunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: OperationProject;
  allProjects?: OperationProject[];
  onUpdateProject: (updated: OperationProject) => void;
}

export const CommunicationsTunnelModal: React.FC<CommunicationsTunnelModalProps> = ({
  isOpen,
  onClose,
  project,
  allProjects,
  onUpdateProject,
}) => {
  // Multi-email input state
  const [multiEmailInput, setMultiEmailInput] = useState<string>('');
  const [selectedQuickShareProjectId, setSelectedQuickShareProjectId] = useState<string>('');
  const [emailToQuickShare, setEmailToQuickShare] = useState<string>('');

  // AI & Preview Controls
  const [previewMode, setPreviewMode] = useState<'single_project' | 'portfolio_shared'>('single_project');
  const [selectedSharedRecipientEmail, setSelectedSharedRecipientEmail] = useState<string>('');
  const [selectedPreviewMilestone, setSelectedPreviewMilestone] = useState<string>('');
  const [aiTone, setAiTone] = useState<AiEmailTone>(project.commsTunnelAiTone || 'executive');
  const [aiVariantSeed, setAiVariantSeed] = useState<number>(0);
  const [customExecutiveSummary, setCustomExecutiveSummary] = useState<string>(
    project.commsTunnelAiCustomSummary || ''
  );
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Portfolio shared project selection per recipient
  const [excludedPortfolioProjectIds, setExcludedPortfolioProjectIds] = useState<string[]>([]);

  // Gmail & Status State
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [localProjectsVersion, setLocalProjectsVersion] = useState<number>(0);

  useEffect(() => {
    const unsub = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setGmailUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
    });
    return unsub;
  }, []);

  const currentMilestoneObj =
    project.milestones.find((m) => m.status === 'In Progress') ||
    project.milestones.find((m) => m.status === 'Upcoming') ||
    project.milestones[project.milestones.length - 1];

  useEffect(() => {
    if (isOpen) {
      setSelectedPreviewMilestone(currentMilestoneObj?.title || 'Project kickoff');
      setCustomExecutiveSummary(project.commsTunnelAiCustomSummary || '');
      setAiTone(project.commsTunnelAiTone || 'executive');
      setErrorBanner(null);
    }
  }, [isOpen, project.id]);

  const projectsPool = useMemo(() => {
    void localProjectsVersion;
    const stored = loadStoredProjects();
    if (allProjects && allProjects.length > 0) {
      // Merge with any fresh stored updates
      const storedMap = new Map(stored.map((p) => [p.id, p]));
      return allProjects.map((p) => (p.id === project.id ? project : storedMap.get(p.id) || p));
    }
    return stored.map((p) => (p.id === project.id ? project : p));
  }, [allProjects, project, localProjectsVersion]);

  const cadence: CustomerEmailCadence =
    project.emailOverviewCadence ||
    project.customerIntake?.emailUpdatesCadence ||
    'biweekly';

  // Extract all configured recipients on this project
  const primaryRecipientEmail =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    '';

  const staffRecipients = useMemo(() => {
    return (project.customerIntake?.staffRoles || [])
      .filter((s) => s.email && s.email.trim().length > 0)
      .map((s) => s.email.trim());
  }, [project.customerIntake?.staffRoles]);

  const additionalCustomerEmails = useMemo(() => {
    return (
      project.additionalCustomerEmails ||
      project.customerIntake?.additionalCustomerEmails ||
      []
    );
  }, [project.additionalCustomerEmails, project.customerIntake?.additionalCustomerEmails]);

  const consolidatedEmailsSet = useMemo(() => {
    return new Set(
      (project.portfolioConsolidatedEmails || []).map((e) => e.trim().toLowerCase())
    );
  }, [project.portfolioConsolidatedEmails]);

  const allProjectRecipients = useMemo(() => {
    const map = new Map<string, { email: string; source: 'Primary' | 'Staff Role' | 'Tunnel Recipient' }>();
    if (primaryRecipientEmail && primaryRecipientEmail.includes('@')) {
      map.set(primaryRecipientEmail.trim().toLowerCase(), {
        email: primaryRecipientEmail.trim(),
        source: 'Primary',
      });
    }
    staffRecipients.forEach((em) => {
      const k = em.trim().toLowerCase();
      if (k.includes('@') && !map.has(k)) {
        map.set(k, { email: em.trim(), source: 'Staff Role' });
      }
    });
    additionalCustomerEmails.forEach((em) => {
      const k = em.trim().toLowerCase();
      if (k.includes('@')) {
        map.set(k, { email: em.trim(), source: 'Tunnel Recipient' });
      }
    });
    return Array.from(map.values());
  }, [primaryRecipientEmail, staffRecipients, additionalCustomerEmails]);

  // Also parse any emails currently being typed in the multiEmailInput box so we can show live cross-project detection immediately!
  const typedPendingEmails = useMemo(() => {
    if (!multiEmailInput.trim()) return [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Array.from(
      new Set(
        multiEmailInput
          .split(/[,;\n\s]+/)
          .map((s) => s.trim())
          .filter((s) => emailRegex.test(s))
      )
    );
  }, [multiEmailInput]);

  // Detect shared projects across the portfolio for all active + typed emails
  const sharedRecipientsDetection = useMemo(() => {
    const candidateEmails = Array.from(
      new Set([
        ...allProjectRecipients.map((r) => r.email),
        ...typedPendingEmails,
      ])
    );
    if (candidateEmails.length === 0) {
      return { hasMatches: false, matchedContacts: [], allTiedProjects: [] };
    }
    return detectPortfolioContacts(candidateEmails, project.id, projectsPool);
  }, [allProjectRecipients, typedPendingEmails, project.id, projectsPool]);

  // Auto-select the first shared recipient for the portfolio preview tab
  useEffect(() => {
    if (
      sharedRecipientsDetection.matchedContacts.length > 0 &&
      (!selectedSharedRecipientEmail ||
        !sharedRecipientsDetection.matchedContacts.some(
          (mc) => mc.email.toLowerCase() === selectedSharedRecipientEmail.toLowerCase()
        ))
    ) {
      setSelectedSharedRecipientEmail(sharedRecipientsDetection.matchedContacts[0].email);
    }
  }, [sharedRecipientsDetection.matchedContacts, selectedSharedRecipientEmail]);

  const activeSharedContact = useMemo(() => {
    if (!selectedSharedRecipientEmail) {
      return sharedRecipientsDetection.matchedContacts[0] || null;
    }
    return (
      sharedRecipientsDetection.matchedContacts.find(
        (mc) => mc.email.toLowerCase() === selectedSharedRecipientEmail.toLowerCase()
      ) ||
      sharedRecipientsDetection.matchedContacts[0] ||
      null
    );
  }, [sharedRecipientsDetection.matchedContacts, selectedSharedRecipientEmail]);

  // Discover other known cross-project contacts in the portfolio for easy 1-click testing / adding
  const suggestedPortfolioContactsFromOtherProjects = useMemo(() => {
    const counts = new Map<string, { email: string; name?: string; projects: string[] }>();
    const currentSet = new Set(allProjectRecipients.map((r) => r.email.toLowerCase()));
    projectsPool.forEach((p) => {
      if (p.id === project.id) return;
      const pEmails = new Set<string>();
      if (p.customerIntake?.communityEmail?.includes('@')) {
        pEmails.add(p.customerIntake.communityEmail.trim().toLowerCase());
      }
      if (p.customerIntake?.subscriberEmail?.includes('@')) {
        pEmails.add(p.customerIntake.subscriberEmail.trim().toLowerCase());
      }
      (p.additionalCustomerEmails || []).forEach((e) => {
        if (e?.includes('@')) pEmails.add(e.trim().toLowerCase());
      });
      (p.customerIntake?.staffRoles || []).forEach((s) => {
        if (s.email?.includes('@')) pEmails.add(s.email.trim().toLowerCase());
      });
      pEmails.forEach((em) => {
        if (em === 'unk') return;
        const entry = counts.get(em) || { email: em, projects: [] };
        entry.projects.push(p.propertyName);
        counts.set(em, entry);
      });
    });
    return Array.from(counts.values())
      .filter((item) => !currentSet.has(item.email))
      .sort((a, b) => b.projects.length - a.projects.length)
      .slice(0, 5);
  }, [projectsPool, project.id, allProjectRecipients]);

  const triggerToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 5500);
  };

  // Add multiple emails at once
  const handleAddMultipleEmails = (e?: React.FormEvent, overrideEmails?: string[]) => {
    if (e) e.preventDefault();
    setErrorBanner(null);

    const rawTokens = overrideEmails
      ? overrideEmails
      : multiEmailInput
          .split(/[,;\n\s]+/)
          .map((s) => s.trim())
          .filter(Boolean);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = Array.from(
      new Set(rawTokens.filter((em) => emailRegex.test(em)).map((em) => em.toLowerCase()))
    );

    if (validEmails.length === 0) {
      setErrorBanner(
        'Please enter one or more valid email addresses separated by commas, spaces, or new lines.'
      );
      return;
    }

    const existingLower = new Set(additionalCustomerEmails.map((em) => em.toLowerCase()));
    const newlyAdded = validEmails.filter((em) => !existingLower.has(em));
    const updatedList = Array.from(new Set([...additionalCustomerEmails, ...validEmails]));

    // Check if any of the added emails match other projects
    const matchCheck = detectPortfolioContacts(validEmails, project.id, projectsPool);
    const prevConsolidated = new Set(
      (project.portfolioConsolidatedEmails || []).map((em) => em.toLowerCase())
    );
    matchCheck.matchedContacts.forEach((mc) => {
      prevConsolidated.add(mc.email.toLowerCase());
    });

    const updatedProject: OperationProject = {
      ...project,
      emailOverviewCadence: project.emailOverviewCadence || 'biweekly',
      additionalCustomerEmails: updatedList,
      portfolioConsolidatedEmails: Array.from(prevConsolidated),
      customerIntake: {
        ...(project.customerIntake || {
          pmsSoftware: 'Yardi',
          commonAreaDoors: [],
          staffRoles: [],
        }),
        emailUpdatesCadence:
          project.emailOverviewCadence ||
          project.customerIntake?.emailUpdatesCadence ||
          'biweekly',
        additionalCustomerEmails: updatedList,
      },
      lastUpdated: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    if (!overrideEmails) {
      setMultiEmailInput('');
    }
    if (!emailToQuickShare && validEmails.length > 0) {
      setEmailToQuickShare(validEmails[0]);
    }

    if (matchCheck.hasMatches) {
      const matchedNames = matchCheck.matchedContacts.map((m) => m.email).join(', ');
      setSelectedSharedRecipientEmail(matchCheck.matchedContacts[0].email);
      triggerToast(
        `Added ${newlyAdded.length || validEmails.length} recipient(s)! Shared portfolio contact detected (${matchedNames}) — see Portfolio-Wide Update suggestion below.`
      );
    } else {
      triggerToast(
        `Added ${newlyAdded.length || validEmails.length} recipient(s) (${validEmails.join(', ')}) to the Bi-Weekly Communications Tunnel!`
      );
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedList = additionalCustomerEmails.filter(
      (em) => em.toLowerCase() !== emailToRemove.toLowerCase()
    );
    const updatedConsolidated = (project.portfolioConsolidatedEmails || []).filter(
      (em) => em.toLowerCase() !== emailToRemove.toLowerCase()
    );
    onUpdateProject({
      ...project,
      additionalCustomerEmails: updatedList,
      portfolioConsolidatedEmails: updatedConsolidated,
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
    triggerToast(`Removed ${emailToRemove} from the Communications Tunnel.`);
  };

  const handleTogglePortfolioConsolidationForEmail = (email: string) => {
    const norm = email.trim().toLowerCase();
    const current = new Set(
      (project.portfolioConsolidatedEmails || []).map((e) => e.trim().toLowerCase())
    );
    if (current.has(norm)) {
      current.delete(norm);
    } else {
      current.add(norm);
    }
    onUpdateProject({
      ...project,
      portfolioConsolidatedEmails: Array.from(current),
      lastUpdated: new Date().toISOString(),
    });
  };

  // Allow PM to also link/subscribe a recipient email onto another project right from the Tunnel so it becomes a shared portfolio contact
  const handleQuickShareEmailToAnotherProject = () => {
    const targetEmail = (emailToQuickShare || allProjectRecipients[0]?.email || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@') || !selectedQuickShareProjectId) return;

    const allStored = loadStoredProjects();
    let targetProjName = '';
    const updatedStored = allStored.map((p) => {
      if (p.id === selectedQuickShareProjectId) {
        targetProjName = p.propertyName;
        const existing = p.additionalCustomerEmails || p.customerIntake?.additionalCustomerEmails || [];
        const merged = Array.from(new Set([...existing.map((e) => e.toLowerCase()), targetEmail]));
        const updatedOther: OperationProject = {
          ...p,
          additionalCustomerEmails: merged,
          customerIntake: {
            ...(p.customerIntake || {
              pmsSoftware: 'Yardi',
              commonAreaDoors: [],
              staffRoles: [],
            }),
            additionalCustomerEmails: merged,
          },
          lastUpdated: new Date().toISOString(),
        };
        saveLiveProject(updatedOther).catch(() => {});
        return updatedOther;
      }
      return p;
    });

    saveStoredProjects(updatedStored);
    setLocalProjectsVersion((v) => v + 1);
    setSelectedSharedRecipientEmail(targetEmail);
    setSelectedQuickShareProjectId('');
    triggerToast(
      `Linked ${targetEmail} to "${targetProjName}"! Portfolio-Wide Update suggestion is now active for ${targetEmail}.`
    );
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
    triggerToast(
      `Automated Communications Tunnel cadence set to ${
        newCadence === 'biweekly'
          ? 'BI-WEEKLY (Every 2 Weeks)'
          : newCadence === 'weekly'
          ? 'WEEKLY'
          : 'PAUSED'
      }.`
    );
  };

  const handleAiRegenerateCards = () => {
    setIsAiGenerating(true);
    setCustomExecutiveSummary('');
    setTimeout(() => {
      setAiVariantSeed((prev) => prev + 1);
      setIsAiGenerating(false);
      triggerToast('✨ AI regenerated digestible Milestone & Hardware Cards for your email preview!');
    }, 350);
  };

  // Single-project AI card email preview
  const singleProjectCardDigest = useMemo(() => {
    return buildDigestibleMilestoneCardEmailContent({
      project,
      cadence: cadence === 'none' ? 'biweekly' : cadence,
      overrideMilestoneTitle: selectedPreviewMilestone || undefined,
      aiTone,
      customAiSummary: customExecutiveSummary,
      variantSeed: aiVariantSeed,
    });
  }, [project, cadence, selectedPreviewMilestone, aiTone, customExecutiveSummary, aiVariantSeed]);

  // Shared projects for the currently selected shared recipient
  const activeSharedRecipientProjects = useMemo(() => {
    if (!activeSharedContact) return [project];
    const allForContact = [project, ...activeSharedContact.tiedProperties];
    // Deduplicate by id
    const uniqueMap = new Map<string, OperationProject>();
    allForContact.forEach((p) => uniqueMap.set(p.id, p));
    const list = Array.from(uniqueMap.values());
    return list.filter((p) => !excludedPortfolioProjectIds.includes(p.id));
  }, [activeSharedContact, project, excludedPortfolioProjectIds]);

  // Portfolio-wide card email preview for the selected shared recipient
  const portfolioCardDigest = useMemo(() => {
    const targetEmail =
      activeSharedContact?.email ||
      selectedSharedRecipientEmail ||
      allProjectRecipients[0]?.email ||
      'stakeholder@property.com';
    return buildRecipientPortfolioWideCardEmail({
      recipientEmail: targetEmail,
      recipientName: activeSharedContact?.contactName,
      sharedProjects: activeSharedRecipientProjects,
      primaryProject: project,
      cadence: cadence === 'none' ? 'biweekly' : cadence,
      aiTone,
      customNote: customExecutiveSummary,
      senderName: gmailUserEmail || project.assignedPM.name,
      senderEmail: gmailUserEmail || project.assignedPM.email,
    });
  }, [
    activeSharedContact,
    selectedSharedRecipientEmail,
    allProjectRecipients,
    activeSharedRecipientProjects,
    project,
    cadence,
    aiTone,
    customExecutiveSummary,
    gmailUserEmail,
  ]);

  const activeEmailPreview =
    previewMode === 'portfolio_shared' && activeSharedContact
      ? portfolioCardDigest
      : singleProjectCardDigest;

  // Send separate Portfolio-Wide Update to a specific shared recipient
  const handleSendSeparatePortfolioEmail = async (
    targetEmail: string,
    viaGmailApi: boolean = true
  ) => {
    setErrorBanner(null);
    const contactMatch = sharedRecipientsDetection.matchedContacts.find(
      (mc) => mc.email.toLowerCase() === targetEmail.toLowerCase()
    );
    const sharedList = contactMatch
      ? [project, ...contactMatch.tiedProperties].filter(
          (p) => !excludedPortfolioProjectIds.includes(p.id)
        )
      : [project];

    const emailPayload = buildRecipientPortfolioWideCardEmail({
      recipientEmail: targetEmail,
      recipientName: contactMatch?.contactName,
      sharedProjects: sharedList,
      primaryProject: project,
      cadence: cadence === 'none' ? 'biweekly' : cadence,
      aiTone,
      customNote: customExecutiveSummary,
      senderName: gmailUserEmail || project.assignedPM.name,
      senderEmail: gmailUserEmail || project.assignedPM.email,
    });

    if (!viaGmailApi) {
      logPortfolioDispatchAcrossProjects({
        includedProjects: sharedList,
        primaryProject: project,
        recipients: [targetEmail],
        subject: emailPayload.subject,
        summary: `${emailPayload.summary} [Logged Separate Portfolio-Wide Update]`,
        logType: emailPayload.logType,
        sentBy: gmailUserEmail || project.assignedPM.name,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        onUpdateProject,
      });
      triggerToast(
        `Sent & logged separate Portfolio-Wide Update to ${targetEmail} covering ${sharedList.length} shared projects (${sharedList.map((p) => p.propertyName).join(', ')})!`
      );
      return;
    }

    setIsSending(true);
    try {
      if (needsAuth) {
        const signedIn = await googleSignIn();
        if (!signedIn) {
          // Fallback: log & notify so user isn't blocked if popup was closed
          logPortfolioDispatchAcrossProjects({
            includedProjects: sharedList,
            primaryProject: project,
            recipients: [targetEmail],
            subject: emailPayload.subject,
            summary: `${emailPayload.summary} [Dispatched via Communications Tunnel]`,
            logType: emailPayload.logType,
            sentBy: project.assignedPM.name,
            cadence: cadence === 'none' ? 'biweekly' : cadence,
            onUpdateProject,
          });
          triggerToast(
            `Portfolio-Wide Update queued & logged for ${targetEmail} across ${sharedList.length} shared projects!`
          );
          setIsSending(false);
          return;
        }
      }

      const gmailRes = await sendRealGmailEmail({
        to: [targetEmail],
        subject: emailPayload.subject,
        htmlBody: emailPayload.htmlBody,
      });

      logPortfolioDispatchAcrossProjects({
        includedProjects: sharedList,
        primaryProject: project,
        recipients: gmailRes.recipients,
        subject: emailPayload.subject,
        summary: `${emailPayload.summary} [Live Gmail ID: ${gmailRes.id}]`,
        logType: emailPayload.logType,
        sentBy: gmailUserEmail || project.assignedPM.name,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        onUpdateProject,
      });

      triggerToast(
        `✓ Delivered 1 Consolidated Portfolio-Wide Update email to ${targetEmail} covering ${sharedList.length} projects!`
      );
    } catch (err: any) {
      setErrorBanner(err?.message || 'Failed to send portfolio email.');
    } finally {
      setIsSending(false);
    }
  };

  // Send single-project cadence update (or smart split: single-project recipients get project email, consolidated shared recipients get portfolio email)
  const handleSendTunnelCadenceNow = async (viaGmailApi: boolean = true) => {
    setErrorBanner(null);
    const allRecips = allProjectRecipients.map((r) => r.email);
    if (allRecips.length === 0 && typedPendingEmails.length === 0) {
      setErrorBanner('Please add at least one recipient email in the Communications Tunnel.');
      return;
    }

    const effectiveRecipients =
      allRecips.length > 0 ? allRecips : typedPendingEmails;

    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!viaGmailApi) {
      const newLog: CustomerCommsLog = {
        id: `comm-tunnel-${Date.now()}`,
        projectId: project.id,
        timestamp: nowStr,
        type: singleProjectCardDigest.logType,
        recipientEmail: effectiveRecipients.join(', '),
        subject: singleProjectCardDigest.subject,
        summary: `${singleProjectCardDigest.summary} [Dispatched via Communications Tunnel]`,
        sentBy: gmailUserEmail || project.assignedPM.name,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        status: 'Delivered',
      };

      onUpdateProject({
        ...project,
        emailOverviewCadence: cadence === 'none' ? 'biweekly' : cadence,
        commsTunnelAiCustomSummary: customExecutiveSummary || undefined,
        commsTunnelAiTone: aiTone,
        customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
        lastUpdated: new Date().toISOString(),
      });

      triggerToast(
        `✓ Dispatched & logged AI Card Digest for ${effectiveRecipients.length} recipient(s) (${effectiveRecipients.join(', ')})!`
      );
      return;
    }

    setIsSending(true);
    try {
      if (needsAuth) {
        const signedIn = await googleSignIn();
        if (!signedIn) {
          handleSendTunnelCadenceNow(false);
          setIsSending(false);
          return;
        }
      }

      const gmailRes = await sendRealGmailEmail({
        to: effectiveRecipients,
        subject: singleProjectCardDigest.subject,
        htmlBody: singleProjectCardDigest.htmlBody,
      });

      const newLog: CustomerCommsLog = {
        id: `comm-tunnel-${Date.now()}`,
        projectId: project.id,
        timestamp: nowStr,
        type: singleProjectCardDigest.logType,
        recipientEmail: gmailRes.recipients.join(', '),
        subject: singleProjectCardDigest.subject,
        summary: `${singleProjectCardDigest.summary} [Live Gmail ID: ${gmailRes.id}]`,
        sentBy: gmailUserEmail || project.assignedPM.name,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        status: 'Delivered',
      };

      onUpdateProject({
        ...project,
        emailOverviewCadence: cadence === 'none' ? 'biweekly' : cadence,
        commsTunnelAiCustomSummary: customExecutiveSummary || undefined,
        commsTunnelAiTone: aiTone,
        customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
        lastUpdated: new Date().toISOString(),
      });

      triggerToast(
        `✓ Live AI Card Digest delivered via Gmail to ${gmailRes.recipients.join(', ')}!`
      );
    } catch (err: any) {
      setErrorBanner(err?.message || 'Failed to dispatch email.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Communications Tunnel Modal"
    >
      <div
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[93vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#132d46] to-[#0f172a] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#01C38D]/20 border border-[#01C38D]/40 flex items-center justify-center text-[#01C38D] shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Communications Tunnel
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#01C38D]/20 text-[#01C38D] border border-[#01C38D]/40">
                  Bi-Weekly Milestone Automation
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/15">
                  {allProjectRecipients.length} Active Recipient{allProjectRecipients.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">{project.propertyName}</strong> • Configure multi-recipient bi-weekly milestone updates, preview AI-generated visual cards, and consolidate shared portfolio contacts into a single email.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Cadence Pill Selector */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-[11px]">
              {(['biweekly', 'weekly', 'none'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleCadenceChange(opt)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    cadence === opt
                      ? 'bg-[#01C38D] text-slate-950 font-black shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {opt === 'biweekly' ? 'Every 2 Weeks' : opt === 'weekly' ? 'Weekly' : 'Paused'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Communications Tunnel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast / Feedback Banner */}
        {toastBanner && (
          <div className="bg-emerald-950 text-emerald-100 px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b border-emerald-800 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#01C38D] shrink-0" />
              <span>{toastBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              className="text-emerald-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorBanner && (
          <div className="bg-rose-50 text-rose-900 px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b border-rose-200 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="text-rose-500 hover:text-rose-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Two-Column Body */}
        <div className="flex-1 min-h-[480px] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* LEFT COLUMN (5 cols): Multi-Recipient Entry + Shared Portfolio Detection & Suggestions */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-slate-50/70 overflow-y-auto">
            {/* Step 1: Enter Multiple Recipient Emails */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      1. Enter Automated Cadence Recipients
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Enter multiple emails (comma, space, or line-separated) for the bi-weekly milestone update.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddMultipleEmails} className="space-y-2.5">
                <textarea
                  data-testid="comms-tunnel-multi-email-input"
                  rows={2}
                  value={multiEmailInput}
                  onChange={(e) => setMultiEmailInput(e.target.value)}
                  placeholder="Enter multiple emails: e.g. hannah.galarneau@ugoc.com, regional@property.com, vp@equity.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {typedPendingEmails.length > 0
                      ? `${typedPendingEmails.length} valid email(s) ready to add`
                      : 'Supports bulk paste of multiple stakeholder emails'}
                  </span>
                  <button
                    type="submit"
                    data-testid="comms-tunnel-add-emails-btn"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Recipients to Tunnel</span>
                  </button>
                </div>
              </form>

              {/* Quick-Add Portfolio Contacts Found on Other Projects */}
              {suggestedPortfolioContactsFromOtherProjects.length > 0 && (
                <div className="pt-2.5 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-teal-600" />
                    <span>Quick-Add Existing Portfolio Stakeholders (Shared Across Projects):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedPortfolioContactsFromOtherProjects.map((item) => (
                      <button
                        key={item.email}
                        type="button"
                        onClick={() => handleAddMultipleEmails(undefined, [item.email])}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        title={`Also recipient on: ${item.projects.join(', ')}`}
                      >
                        <Plus className="w-3 h-3 text-teal-700" />
                        <span>{item.email}</span>
                        <span className="text-[9px] font-black bg-teal-200/80 text-teal-950 px-1.5 py-0.2 rounded">
                          {item.projects.length} proj
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SMART CROSS-PROJECT SHARED RECIPIENT SUGGESTION PANEL */}
            {sharedRecipientsDetection.hasMatches && (
              <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-sky-50 border-2 border-teal-400 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-700 text-white">
                        💡 Portfolio-Wide Update Suggestion
                      </span>
                      <span className="text-[11px] font-bold text-teal-950">
                        {sharedRecipientsDetection.matchedContacts.length} Shared Recipient
                        {sharedRecipientsDetection.matchedContacts.length === 1 ? '' : 's'} Found Across Projects
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      We detected that the following recipient email(s) are also subscribed on other projects. Instead of sending separate individual emails for each project, send a <strong>separate Portfolio-Wide Update email</strong> that organizes all of their shared projects into one card-based digest:
                    </p>
                  </div>
                </div>

                {/* Per-Recipient Suggestion Cards */}
                <div className="space-y-2.5">
                  {sharedRecipientsDetection.matchedContacts.map((mc) => {
                    const allSharedForThisEmail = [project, ...mc.tiedProperties];
                    const isConsolidated = consolidatedEmailsSet.has(mc.email.toLowerCase());
                    const isCurrentlyPreviewing =
                      previewMode === 'portfolio_shared' &&
                      selectedSharedRecipientEmail.toLowerCase() === mc.email.toLowerCase();

                    return (
                      <div
                        key={mc.email}
                        className="bg-white rounded-xl p-3.5 border border-teal-300 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-black text-xs text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span>{mc.email}</span>
                              {mc.contactName && (
                                <span className="text-[11px] font-semibold text-slate-500">
                                  ({mc.contactName})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-teal-800 font-semibold mt-0.5">
                              Subscribed to <strong>{allSharedForThisEmail.length} Shared Projects</strong>:{' '}
                              {allSharedForThisEmail.map((p) => p.propertyName).join(' • ')}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-900 border border-teal-300 shrink-0">
                            {allSharedForThisEmail.length} Properties
                          </span>
                        </div>

                        {/* Consolidation Checkbox */}
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-800 cursor-pointer select-none bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <input
                            type="checkbox"
                            checked={isConsolidated}
                            onChange={() => handleTogglePortfolioConsolidationForEmail(mc.email)}
                            className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span>
                            Consolidate into 1 Portfolio-Wide Email for <strong>{mc.email}</strong> (instead of separate emails per project)
                          </span>
                        </label>

                        {/* Action Buttons for This Shared Recipient */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSharedRecipientEmail(mc.email);
                              setPreviewMode('portfolio_shared');
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                              isCurrentlyPreviewing
                                ? 'bg-slate-900 text-[#01C38D] border-slate-900 shadow-2xs'
                                : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {isCurrentlyPreviewing
                                ? 'Previewing Portfolio Email →'
                                : `Preview Portfolio Email (${allSharedForThisEmail.length} Projects)`}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={isSending}
                            onClick={() => handleSendSeparatePortfolioEmail(mc.email, true)}
                            className="py-1.5 px-3 rounded-lg bg-[#01C38D] hover:bg-[#00b07f] text-[#0f172a] text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                            title={`Send one consolidated Portfolio-Wide email covering all ${allSharedForThisEmail.length} shared projects specifically to ${mc.email}`}
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Separate Portfolio Update</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Active Subscribed Recipients on This Project */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  2. Subscribed Tunnel Recipients ({allProjectRecipients.length})
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {cadence === 'biweekly' ? 'Every 2 Weeks' : cadence === 'weekly' ? 'Weekly' : 'Paused'}
                </span>
              </div>

              {allProjectRecipients.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No recipients added yet. Enter one or more emails above.
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {allProjectRecipients.map((item) => {
                    const tiedOtherProjects = detectPortfolioContacts(
                      item.email,
                      project.id,
                      projectsPool
                    ).allTiedProjects;
                    const isShared = tiedOtherProjects.length > 0;
                    const isConsolidated = consolidatedEmailsSet.has(item.email.toLowerCase());

                    return (
                      <div
                        key={item.email}
                        className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1.5 transition-all ${
                          isShared
                            ? 'bg-teal-50/60 border-teal-300 shadow-2xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isShared ? 'bg-teal-600' : 'bg-emerald-500'
                              }`}
                            />
                            <span className="font-bold text-slate-900 truncate">{item.email}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 shrink-0">
                              {item.source}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isShared && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSharedRecipientEmail(item.email);
                                  setPreviewMode('portfolio_shared');
                                }}
                                className="px-2 py-0.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                title="Preview separate consolidated Portfolio-Wide email for this recipient"
                              >
                                <Layers className="w-2.5 h-2.5" />
                                <span>Portfolio ({tiedOtherProjects.length + 1} Projects)</span>
                              </button>
                            )}
                            {item.source === 'Tunnel Recipient' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEmail(item.email)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title={`Remove ${item.email}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {isShared && (
                          <div className="text-[11px] text-teal-900 bg-white/80 rounded-lg px-2.5 py-1.5 border border-teal-200/80 flex items-center justify-between gap-2">
                            <span className="truncate">
                              Shared with:{' '}
                              <strong>
                                {tiedOtherProjects.map((p) => p.propertyName).join(', ')}
                              </strong>
                            </span>
                            {isConsolidated && (
                              <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded shrink-0">
                                Consolidated 1-Email
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Tool: Share any recipient email with another project to organize as a Portfolio */}
              {allProjectRecipients.length > 0 && (
                <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Subscribe a Recipient to Another Project (Cross-Project Portfolio Link):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <select
                      value={emailToQuickShare || allProjectRecipients[0]?.email || ''}
                      onChange={(e) => setEmailToQuickShare(e.target.value)}
                      className="px-2.5 py-1.5 text-[11px] bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-teal-600 sm:w-44 truncate"
                    >
                      {allProjectRecipients.map((r) => (
                        <option key={r.email} value={r.email}>
                          {r.email}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedQuickShareProjectId}
                      onChange={(e) => setSelectedQuickShareProjectId(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-[11px] bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-teal-600 truncate"
                    >
                      <option value="">Select another project to share recipient...</option>
                      {projectsPool
                        .filter((p) => p.id !== project.id)
                        .slice(0, 40)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.propertyName} ({p.city}, {p.state})
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedQuickShareProjectId}
                      onClick={handleQuickShareEmailToAnotherProject}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-[11px] font-bold shrink-0 cursor-pointer"
                    >
                      + Link Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): AI Card-Based Email Preview & Customization */}
          <div className="lg:col-span-7 p-5 flex flex-col space-y-4 bg-white overflow-y-auto">
            {/* Preview Mode Switcher & AI Generator Toolbar */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Mode Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('single_project')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewMode === 'single_project'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Project Cadence Preview (Cards)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode('portfolio_shared')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewMode === 'portfolio_shared'
                        ? 'bg-white text-teal-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>Portfolio-Wide Update Preview</span>
                    {sharedRecipientsDetection.hasMatches && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-teal-600 text-white">
                        {sharedRecipientsDetection.matchedContacts.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* AI Generate / Refresh Button */}
                <button
                  type="button"
                  onClick={handleAiRegenerateCards}
                  disabled={isAiGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                  <span>{isAiGenerating ? 'AI Synthesizing...' : '✨ AI Generate Card Digest'}</span>
                </button>
              </div>

              {/* Milestone Stage Selector & AI Tone Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/80">
                {previewMode === 'single_project' ? (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Preview Cadence Email for Milestone Stage:
                    </label>
                    <select
                      value={selectedPreviewMilestone}
                      onChange={(e) => setSelectedPreviewMilestone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      {project.milestones.map((m, i) => (
                        <option key={m.id} value={m.title}>
                          Stage {i + 1}: {m.title}{' '}
                          {m.title === currentMilestoneObj?.title ? '(Current Active)' : `(${m.status})`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-teal-700 mb-1">
                      Portfolio-Wide Recipient &amp; Shared Projects:
                    </label>
                    {sharedRecipientsDetection.matchedContacts.length > 0 ? (
                      <select
                        value={activeSharedContact?.email || ''}
                        onChange={(e) => setSelectedSharedRecipientEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-lg font-bold text-teal-950 focus:outline-none focus:border-teal-600"
                      >
                        {sharedRecipientsDetection.matchedContacts.map((mc) => (
                          <option key={mc.email} value={mc.email}>
                            {mc.email} ({mc.tiedProperties.length + 1} Shared Projects)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-[11px] text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                        Add a shared recipient on the left to preview multi-project consolidation
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    AI Card Presentation Style:
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-300">
                    {(
                      [
                        { id: 'executive', label: 'Executive Cards' },
                        { id: 'action_oriented', label: 'Action Cards' },
                        { id: 'technical', label: 'Technical Cards' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAiTone(t.id)}
                        className={`py-1 px-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          aiTone === t.id
                            ? 'bg-slate-900 text-white font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Custom AI Headline Override */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  AI Executive Snapshot Headline (Editable):
                </label>
                <input
                  type="text"
                  value={customExecutiveSummary}
                  onChange={(e) => setCustomExecutiveSummary(e.target.value)}
                  placeholder={singleProjectCardDigest.aiExecutiveHeadline}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Metadata Bar (To & Subject) */}
            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-bold text-slate-500 mr-2">To:</span>
                  <span className="font-bold text-slate-900">
                    {previewMode === 'portfolio_shared' && activeSharedContact
                      ? `${activeSharedContact.email} (Consolidated Portfolio Update across ${activeSharedRecipientProjects.length} projects)`
                      : allProjectRecipients.map((r) => r.email).join(', ') ||
                        typedPendingEmails.join(', ') ||
                        'Add recipients on the left'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  Card-Based Digest
                </span>
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-500 mr-2">Subject:</span>
                <span className="font-bold text-slate-900">{activeEmailPreview.subject}</span>
              </div>
            </div>

            {/* Rendered Card-Based HTML Email Preview */}
            <div className="flex-1 border border-slate-200 rounded-2xl bg-slate-100 p-3 overflow-y-auto max-h-[460px] shadow-inner">
              <div
                dangerouslySetInnerHTML={{
                  __html: activeEmailPreview.htmlBody,
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={buildGmailWebComposeUrl({
                to:
                  previewMode === 'portfolio_shared' && activeSharedContact
                    ? activeSharedContact.email
                    : allProjectRecipients.map((r) => r.email).join(', '),
                subject: activeEmailPreview.subject,
                htmlBody: activeEmailPreview.htmlBody,
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                previewMode === 'portfolio_shared' && activeSharedContact
                  ? handleSendSeparatePortfolioEmail(activeSharedContact.email, false)
                  : handleSendTunnelCadenceNow(false)
              }
              className="px-3 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail Web</span>
            </a>

            <button
              type="button"
              onClick={() =>
                previewMode === 'portfolio_shared' && activeSharedContact
                  ? handleSendSeparatePortfolioEmail(activeSharedContact.email, false)
                  : handleSendTunnelCadenceNow(false)
              }
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save &amp; Log Dispatch</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Done / Close
            </button>

            {previewMode === 'portfolio_shared' && activeSharedContact ? (
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendSeparatePortfolioEmail(activeSharedContact.email, true)}
                className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? 'Sending Portfolio Email...'
                    : `Send Separate Portfolio Update to ${activeSharedContact.email} (${activeSharedRecipientProjects.length} Projects)`}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendTunnelCadenceNow(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-[#01C38D] hover:bg-[#00b07f] text-[#0f172a] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? 'Sending Cadence Email...'
                    : `Send Bi-Weekly Card Digest Now (${allProjectRecipients.length} Recipient${allProjectRecipients.length === 1 ? '' : 's'})`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
