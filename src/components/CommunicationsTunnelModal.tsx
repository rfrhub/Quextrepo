import React, { useState, useMemo, useEffect } from 'react';
import {
  OperationProject,
  CustomerCommsLog,
  CustomerEmailCadence,
  CadenceWeekday,
  ALL_CADENCE_WEEKDAYS,
  DEFAULT_MULTI_DAY_WEEKDAYS,
  formatCustomerEmailCadenceLabel,
  CommsTunnelConfiguration,
  Stage1And2CustomOutstandingItem,
  getDockItemTrackingNumbers,
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
  ExternalLink,
  AlertCircle,
  Radio,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Search,
  Package,
  Truck,
  ClipboardList,
  FileText,
  MessageSquare,
} from 'lucide-react';
import {
  detectPortfolioContacts,
  getUnifiedGenuineProjectsPool,
  extractGenuineProjectRecipientEntries,
  searchGenuinePortfolioEmails,
  getAllProjectInstallLogs,
  isStageOneOrTwo,
  getStage1And2CustomerFinalizationItems,
  parseAndApplyCustomerEmailReplyToProject,
  isStageThreeToSeven,
  buildDigestibleMilestoneCardEmailContent,
  buildRecipientPortfolioWideCardEmail,
  logPortfolioDispatchAcrossProjects,
  consumeOneTimePmMessageConfig,
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
  // Multi-email input & genuine portfolio lookup state
  const [multiEmailInput, setMultiEmailInput] = useState<string>('');
  const [portfolioLookupQuery, setPortfolioLookupQuery] = useState<string>('');
  const [showPortfolioLookup, setShowPortfolioLookup] = useState<boolean>(false);

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

  // PM Personal Message Card state
  const [pmPersonalMessage, setPmPersonalMessage] = useState<string>(
    project.commsTunnelConfig?.pmPersonalMessage || ''
  );
  const [pmPersonalMessageTitle, setPmPersonalMessageTitle] = useState<string>(
    project.commsTunnelConfig?.pmPersonalMessageTitle || ''
  );
  const [pmPersonalMessageStyle, setPmPersonalMessageStyle] = useState<
    'pm_note' | 'action_required' | 'milestone_highlight'
  >(project.commsTunnelConfig?.pmPersonalMessageStyle || 'pm_note');
  const [pmPersonalMessageDeliveryMode, setPmPersonalMessageDeliveryMode] = useState<
    'one_time' | 'recurring_cadence'
  >(project.commsTunnelConfig?.pmPersonalMessageDeliveryMode || 'one_time');

  // Stage 1 (Project kickoff) & Stage 2 (Portal Buildout) Outstanding Customer Finalization Items State
  const [includeStage1And2OutstandingCard, setIncludeStage1And2OutstandingCard] = useState<boolean>(
    project.commsTunnelConfig?.includeStage1And2OutstandingCard ?? false
  );
  const [selectedStage1And2ItemIds, setSelectedStage1And2ItemIds] = useState<string[]>(
    project.commsTunnelConfig?.selectedStage1And2ItemIds || []
  );
  const [stage1And2ItemCustomPrompts, setStage1And2ItemCustomPrompts] = useState<
    Record<string, string>
  >(project.commsTunnelConfig?.stage1And2ItemCustomPrompts || {});
  const [customStage1And2Items, setCustomStage1And2Items] = useState<
    Stage1And2CustomOutstandingItem[]
  >(project.commsTunnelConfig?.customStage1And2Items || []);
  const [stage1And2StageFilter, setStage1And2StageFilter] = useState<'all' | 1 | 2>('all');
  const [forceShowStage1And2OnLaterStage, setForceShowStage1And2OnLaterStage] =
    useState<boolean>(false);
  const [editingPromptItemId, setEditingPromptItemId] = useState<string | null>(null);
  const [showAddCustomStage1And2Form, setShowAddCustomStage1And2Form] = useState<boolean>(false);
  const [newCustomItemStage, setNewCustomItemStage] = useState<1 | 2>(1);
  const [newCustomItemTitle, setNewCustomItemTitle] = useState<string>('');
  const [newCustomItemPrompt, setNewCustomItemPrompt] = useState<string>('');
  const [showCustomerReplyProcessor, setShowCustomerReplyProcessor] = useState<boolean>(false);
  const [customerReplyInputText, setCustomerReplyInputText] = useState<string>('');
  const [customerReplySenderEmail, setCustomerReplySenderEmail] = useState<string>('');

  // Stage 3–7 Field & Operations Card Inclusion State
  const [activeOpsSelectorTab, setActiveOpsSelectorTab] = useState<
    'bom' | 'shipping' | 'logs' | 'notes'
  >('bom');
  const [includeInstalledBomCard, setIncludeInstalledBomCard] = useState<boolean>(
    project.commsTunnelConfig?.includeInstalledBomCard ?? false
  );
  const [selectedBomItemIds, setSelectedBomItemIds] = useState<string[]>(
    project.commsTunnelConfig?.selectedBomItemIds || []
  );
  const [includeShippingDockCard, setIncludeShippingDockCard] = useState<boolean>(
    project.commsTunnelConfig?.includeShippingDockCard ?? false
  );
  const [selectedShippingDockIds, setSelectedShippingDockIds] = useState<string[]>(
    project.commsTunnelConfig?.selectedShippingDockIds || []
  );
  const [includeInstallerLogCard, setIncludeInstallerLogCard] = useState<boolean>(
    project.commsTunnelConfig?.includeInstallerLogCard ?? false
  );
  const [selectedInstallLogIds, setSelectedInstallLogIds] = useState<string[]>(
    project.commsTunnelConfig?.selectedInstallLogIds || []
  );
  const [includeProjectNotesCard, setIncludeProjectNotesCard] = useState<boolean>(
    project.commsTunnelConfig?.includeProjectNotesCard ?? false
  );
  const [selectedProjectNoteIds, setSelectedProjectNoteIds] = useState<string[]>(
    project.commsTunnelConfig?.selectedProjectNoteIds || []
  );
  const [forceShowOpsCardsOnEarlyStage, setForceShowOpsCardsOnEarlyStage] =
    useState<boolean>(false);

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

  const allInstallLogs = useMemo(() => getAllProjectInstallLogs(project), [project]);
  const shippingDockItems = useMemo(() => project.shippingDockItems || [], [project.shippingDockItems]);
  const projectNotes = useMemo(() => project.notes || [], [project.notes]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPreviewMilestone(currentMilestoneObj?.title || 'Project kickoff');
      setCustomExecutiveSummary(project.commsTunnelAiCustomSummary || '');
      setAiTone(project.commsTunnelAiTone || 'executive');
      setPmPersonalMessage(project.commsTunnelConfig?.pmPersonalMessage || '');
      setPmPersonalMessageTitle(project.commsTunnelConfig?.pmPersonalMessageTitle || '');
      setPmPersonalMessageStyle(project.commsTunnelConfig?.pmPersonalMessageStyle || 'pm_note');
      setPmPersonalMessageDeliveryMode(
        project.commsTunnelConfig?.pmPersonalMessageDeliveryMode || 'one_time'
      );
      const initialStage1And2Items = getStage1And2CustomerFinalizationItems(
        project,
        project.commsTunnelConfig
      );
      setIncludeStage1And2OutstandingCard(
        project.commsTunnelConfig?.includeStage1And2OutstandingCard ?? false
      );
      setSelectedStage1And2ItemIds(
        project.commsTunnelConfig?.selectedStage1And2ItemIds ||
          initialStage1And2Items.filter((it) => !it.isAlreadyProvidedOnProject).map((it) => it.id)
      );
      setStage1And2ItemCustomPrompts(
        project.commsTunnelConfig?.stage1And2ItemCustomPrompts || {}
      );
      setCustomStage1And2Items(project.commsTunnelConfig?.customStage1And2Items || []);
      setCustomerReplySenderEmail(project.customerIntake?.communityEmail || '');
      setIncludeInstalledBomCard(project.commsTunnelConfig?.includeInstalledBomCard ?? false);
      setSelectedBomItemIds(
        project.commsTunnelConfig?.selectedBomItemIds ||
          project.bomItems.filter((b) => (Number(b.installedCount) || 0) > 0).map((b) => b.id)
      );
      setIncludeShippingDockCard(project.commsTunnelConfig?.includeShippingDockCard ?? false);
      setSelectedShippingDockIds(
        project.commsTunnelConfig?.selectedShippingDockIds ||
          (project.shippingDockItems || []).map((d) => d.id)
      );
      setIncludeInstallerLogCard(project.commsTunnelConfig?.includeInstallerLogCard ?? false);
      setSelectedInstallLogIds(
        project.commsTunnelConfig?.selectedInstallLogIds ||
          getAllProjectInstallLogs(project).map((l) => l.id)
      );
      setIncludeProjectNotesCard(project.commsTunnelConfig?.includeProjectNotesCard ?? false);
      setSelectedProjectNoteIds(
        project.commsTunnelConfig?.selectedProjectNoteIds ||
          (project.notes || []).map((n) => n.id)
      );
      setErrorBanner(null);
    }
  }, [isOpen, project.id]);

  // Unified genuine project pool (merges live Firestore state + localStorage)
  const projectsPool = useMemo(() => {
    void localProjectsVersion;
    return getUnifiedGenuineProjectsPool(allProjects, project);
  }, [allProjects, project, localProjectsVersion]);

  const cadence: CustomerEmailCadence =
    project.emailOverviewCadence ||
    project.customerIntake?.emailUpdatesCadence ||
    'biweekly';
  const selectedWeekdays: CadenceWeekday[] = useMemo(() => {
    const raw =
      project.emailCadenceWeekdays ||
      project.customerIntake?.emailCadenceWeekdays ||
      DEFAULT_MULTI_DAY_WEEKDAYS;
    return raw.length > 0 ? raw : DEFAULT_MULTI_DAY_WEEKDAYS;
  }, [project.emailCadenceWeekdays, project.customerIntake?.emailCadenceWeekdays]);
  const isCadenceLive = cadence !== 'none';
  const cadenceShortLabel = formatCustomerEmailCadenceLabel(cadence, selectedWeekdays, true);

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

  // Extract all genuine recipients configured on this project
  const allProjectRecipients = useMemo(() => {
    const entries = extractGenuineProjectRecipientEntries(project);
    return entries.map((entry) => ({
      email: entry.email,
      source: entry.isExplicitTunnelRecipient
        ? ('Tunnel Recipient' as const)
        : entry.isCommunitySiteContact
        ? ('Primary' as const)
        : ('Staff Role' as const),
      roleLabel: entry.roleOrTitle,
    }));
  }, [project]);

  // Parse any emails currently being typed in the multiEmailInput box for immediate live cross-project detection
  const typedPendingEmails = useMemo(() => {
    if (!multiEmailInput.trim()) return [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Array.from(
      new Set(
        multiEmailInput
          .split(/[,;\n\s]+/)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => emailRegex.test(s))
      )
    );
  }, [multiEmailInput]);

  // Detect shared projects across the portfolio for all active + typed emails using genuine project data
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

  // Genuine portfolio email directory search results
  const portfolioLookupResults = useMemo(() => {
    return searchGenuinePortfolioEmails(portfolioLookupQuery, project.id, projectsPool).slice(0, 8);
  }, [portfolioLookupQuery, project.id, projectsPool]);

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

  // Check if active milestone or previewed milestone is Stage 1 (Project kickoff) or Stage 2 (Portal Buildout)
  const isCurrentOrPreviewStage1Or2 = useMemo(() => {
    return (
      isStageOneOrTwo(selectedPreviewMilestone, project) ||
      isStageOneOrTwo(currentMilestoneObj?.title, project)
    );
  }, [selectedPreviewMilestone, currentMilestoneObj?.title, project]);

  // Check if active milestone or previewed milestone is between Stage 3 and Stage 7
  const isCurrentOrPreviewStage3To7 = useMemo(() => {
    return (
      isStageThreeToSeven(selectedPreviewMilestone, project) ||
      isStageThreeToSeven(currentMilestoneObj?.title, project)
    );
  }, [selectedPreviewMilestone, currentMilestoneObj?.title, project]);

  // Active CommsTunnelConfiguration object for live email preview & persistence
  const activeCommsConfig: CommsTunnelConfiguration = useMemo(
    () => ({
      pmPersonalMessage,
      pmPersonalMessageTitle,
      pmPersonalMessageStyle,
      pmPersonalMessageDeliveryMode,
      lastSentOneTimePmMessage: project.commsTunnelConfig?.lastSentOneTimePmMessage,
      includeStage1And2OutstandingCard,
      selectedStage1And2ItemIds,
      stage1And2ItemCustomPrompts,
      customStage1And2Items,
      finalizedViaEmailReplyItemIds: project.commsTunnelConfig?.finalizedViaEmailReplyItemIds,
      includeInstalledBomCard,
      selectedBomItemIds,
      includeShippingDockCard,
      selectedShippingDockIds,
      includeInstallerLogCard,
      selectedInstallLogIds,
      includeProjectNotesCard,
      selectedProjectNoteIds,
    }),
    [
      pmPersonalMessage,
      pmPersonalMessageTitle,
      pmPersonalMessageStyle,
      pmPersonalMessageDeliveryMode,
      project.commsTunnelConfig?.lastSentOneTimePmMessage,
      includeStage1And2OutstandingCard,
      selectedStage1And2ItemIds,
      stage1And2ItemCustomPrompts,
      customStage1And2Items,
      project.commsTunnelConfig?.finalizedViaEmailReplyItemIds,
      includeInstalledBomCard,
      selectedBomItemIds,
      includeShippingDockCard,
      selectedShippingDockIds,
      includeInstallerLogCard,
      selectedInstallLogIds,
      includeProjectNotesCard,
      selectedProjectNoteIds,
    ]
  );

  // Live Stage 1 & 2 Customer Finalization Items list
  const stage1And2Items = useMemo(
    () => getStage1And2CustomerFinalizationItems(project, activeCommsConfig),
    [project, activeCommsConfig]
  );

  const filteredStage1And2Items = useMemo(() => {
    if (stage1And2StageFilter === 'all') return stage1And2Items;
    return stage1And2Items.filter((it) => it.stageNumber === stage1And2StageFilter);
  }, [stage1And2Items, stage1And2StageFilter]);

  const triggerToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 5500);
  };

  // Persist helper that updates React state, localStorage, and Cloud Firestore simultaneously
  const persistProjectUpdate = (updatedProject: OperationProject) => {
    onUpdateProject(updatedProject);
    saveLiveProject(updatedProject).catch(() => {});
    try {
      const stored = loadStoredProjects();
      const nextStored = stored.map((p) => (p.id === updatedProject.id ? updatedProject : p));
      saveStoredProjects(nextStored);
      setLocalProjectsVersion((v) => v + 1);
    } catch {
      // ignore local storage quota errors
    }
  };

  const handleSaveCommsConfigToProject = (
    overridePartial?: Partial<CommsTunnelConfiguration>,
    silent?: boolean
  ) => {
    const nextConfig: CommsTunnelConfiguration = {
      ...activeCommsConfig,
      ...(overridePartial || {}),
    };
    const updatedProject: OperationProject = {
      ...project,
      commsTunnelAiTone: aiTone,
      commsTunnelAiCustomSummary: customExecutiveSummary,
      commsTunnelConfig: nextConfig,
      lastUpdated: new Date().toISOString(),
    };
    persistProjectUpdate(updatedProject);
    if (!silent) {
      if (
        (nextConfig.pmPersonalMessage || '').trim() &&
        (nextConfig.pmPersonalMessageDeliveryMode || 'one_time') === 'one_time'
      ) {
        triggerToast(
          '⚡ Staged One-Time Unique PM Message Card for the next update only (will auto-clear after send so it never repeats on the cadence)!'
        );
      } else {
        triggerToast('Saved Communications Tunnel configuration to project!');
      }
    }
  };

  // Add a custom Stage 1 or Stage 2 item waiting on customer finalization
  const handleAddCustomStage1And2Item = () => {
    const cleanTitle = newCustomItemTitle.trim();
    const cleanPrompt = newCustomItemPrompt.trim();
    if (!cleanTitle) {
      setErrorBanner('Please enter a title for the custom Stage 1/2 item waiting on the customer.');
      return;
    }
    const newItem: Stage1And2CustomOutstandingItem = {
      id: `custom_stage${newCustomItemStage}_${Date.now()}`,
      stageNumber: newCustomItemStage,
      title: cleanTitle,
      promptOrDetailNeeded:
        cleanPrompt || `Please finalize "${cleanTitle}" for Stage ${newCustomItemStage} (${project.propertyName}).`,
      replyPlaceholder: `${cleanTitle} Confirmation`,
    };
    const nextCustomList = [...customStage1And2Items, newItem];
    const nextSelectedIds = Array.from(new Set([...selectedStage1And2ItemIds, newItem.id]));
    setCustomStage1And2Items(nextCustomList);
    setSelectedStage1And2ItemIds(nextSelectedIds);
    setIncludeStage1And2OutstandingCard(true);
    setNewCustomItemTitle('');
    setNewCustomItemPrompt('');
    setShowAddCustomStage1And2Form(false);
    handleSaveCommsConfigToProject(
      {
        customStage1And2Items: nextCustomList,
        selectedStage1And2ItemIds: nextSelectedIds,
        includeStage1And2OutstandingCard: true,
      },
      true
    );
    triggerToast(
      `Added custom Stage ${newCustomItemStage} item "${cleanTitle}" & embedded it into the customer email reply card!`
    );
  };

  // Process & apply a customer's email reply back to the PM for Stage 1 & 2 outstanding items
  const handleApplyCustomerEmailReply = () => {
    const cleanReply = customerReplyInputText.trim();
    if (!cleanReply) {
      setErrorBanner('Please paste or load the customer email reply text to apply their finalized details.');
      return;
    }
    setErrorBanner(null);

    const { updatedProject, updatedCommsConfig, finalizedCount, finalizedTitles } =
      parseAndApplyCustomerEmailReplyToProject(
        project,
        cleanReply,
        customerReplySenderEmail.trim() || project.customerIntake?.communityEmail || project.clientName,
        activeCommsConfig
      );

    setSelectedStage1And2ItemIds(updatedCommsConfig.selectedStage1And2ItemIds || []);
    setCustomerReplyInputText('');
    setShowCustomerReplyProcessor(false);
    persistProjectUpdate(updatedProject);

    if (finalizedCount > 0) {
      triggerToast(
        `✓ Processed customer email reply! Finalized ${finalizedCount} Stage 1 & 2 item(s) (${finalizedTitles.join(
          ', '
        )}) and synced to project!`
      );
    } else {
      triggerToast('Logged customer email reply to project notes & communication history!');
    }
  };

  // Polish PM Personal Message with AI
  const handleAiPolishPmMessage = () => {
    const draft = pmPersonalMessage.trim();
    const activeStage = selectedPreviewMilestone || currentMilestoneObj?.title || 'Project kickoff';
    const totalQuoted = project.bomItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
    const totalInstalled = project.bomItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);

    if (!draft) {
      const generated = `Hi ${project.clientName} Team,\n\nWe are pleased to share our latest ${
        cadence === 'biweekly' ? 'bi-weekly' : 'weekly'
      } deployment update for ${project.propertyName} as we progress through the ${activeStage} milestone (${totalInstalled.toLocaleString()} of ${totalQuoted.toLocaleString()} smart devices installed to date).\n\nPlease review the milestone and hardware cards below, and let me know if your onsite team has any questions or scheduling requests for the upcoming two-week window.`;
      setPmPersonalMessage(generated);
      handleSaveCommsConfigToProject({ pmPersonalMessage: generated }, true);
      triggerToast('✨ Generated a professional PM Personal Message card for your email!');
      return;
    }

    // Polish user's existing draft into clean executive prose
    const cleaned = draft.replace(/\s+/g, ' ').trim();
    const polished = cleaned.startsWith('Hi ') || cleaned.startsWith('Hello ')
      ? `${cleaned}\n\nThank you for your continued partnership on ${project.propertyName}. Please review the embedded status cards below and reach out directly if you need any adjustments.`
      : `Hi ${project.clientName} Team,\n\n${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}${
          /[.!?]$/.test(cleaned) ? '' : '.'
        }\n\nPlease review the updated milestone and field cards below for ${project.propertyName}, and feel free to reply directly if we can assist with anything on site.`;
    setPmPersonalMessage(polished);
    handleSaveCommsConfigToProject({ pmPersonalMessage: polished }, true);
    triggerToast('✨ Polished your PM Personal Message and embedded it into the email preview!');
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

    // Genuine check across all other projects in the database
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
      commsTunnelConfig: activeCommsConfig,
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

    persistProjectUpdate(updatedProject);
    if (!overrideEmails) {
      setMultiEmailInput('');
    }

    if (matchCheck.hasMatches) {
      const matchedNames = matchCheck.matchedContacts
        .map((m) => `${m.email} (${m.tiedProperties.length + 1} projects)`)
        .join(', ');
      setSelectedSharedRecipientEmail(matchCheck.matchedContacts[0].email);
      triggerToast(
        `Added ${newlyAdded.length || validEmails.length} recipient(s)! Genuine cross-project match found for ${matchedNames}.`
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
    const updatedProject: OperationProject = {
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
    };
    persistProjectUpdate(updatedProject);
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
    const updatedProject: OperationProject = {
      ...project,
      portfolioConsolidatedEmails: Array.from(current),
      lastUpdated: new Date().toISOString(),
    };
    persistProjectUpdate(updatedProject);
  };

  const handleCadenceChange = (
    newCadence: CustomerEmailCadence,
    customWeekdays?: CadenceWeekday[]
  ) => {
    const daysToSave =
      customWeekdays && customWeekdays.length > 0 ? customWeekdays : selectedWeekdays;
    const rememberedActive: Exclude<CustomerEmailCadence, 'none'> =
      newCadence !== 'none'
        ? newCadence
        : project.lastActiveEmailCadence ||
          (cadence !== 'none' ? cadence : 'biweekly');

    const updatedProject: OperationProject = {
      ...project,
      emailOverviewCadence: newCadence,
      emailCadenceWeekdays: daysToSave,
      lastActiveEmailCadence: rememberedActive,
      customerIntake: {
        ...(project.customerIntake || {
          pmsSoftware: 'Yardi',
          commonAreaDoors: [],
          staffRoles: [],
        }),
        emailUpdatesCadence: newCadence,
        emailCadenceWeekdays: daysToSave,
        lastActiveEmailCadence: rememberedActive,
      },
      lastUpdated: new Date().toISOString(),
    };
    persistProjectUpdate(updatedProject);
    triggerToast(
      newCadence === 'none'
        ? 'Automated Communications Tunnel cadence PAUSED (Not Live).'
        : `Automated Communications Tunnel cadence is LIVE: ${formatCustomerEmailCadenceLabel(
            newCadence,
            daysToSave,
            false
          )}.`
    );
  };

  const handleToggleTunnelWeekday = (day: CadenceWeekday) => {
    const orderMap: Record<CadenceWeekday, number> = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };
    const exists = selectedWeekdays.includes(day);
    if (exists && selectedWeekdays.length <= 1) {
      triggerToast('Keep at least 1 day selected for Multiple Days / Week cadence.');
      return;
    }
    const nextDays = exists
      ? selectedWeekdays.filter((d) => d !== day)
      : [...selectedWeekdays, day];
    nextDays.sort((a, b) => orderMap[a] - orderMap[b]);
    handleCadenceChange('multi_day', nextDays);
  };

  const handleAiRegenerateCards = () => {
    setIsAiGenerating(true);
    setCustomExecutiveSummary('');
    setTimeout(() => {
      setAiVariantSeed((prev) => prev + 1);
      setIsAiGenerating(false);
      triggerToast('✨ AI regenerated digestible Milestone & Hardware Cards for your email preview!');
    }, 300);
  };

  // Single-project AI card email preview (includes PM Personal Message + Stage 3-7 Operational Cards)
  const singleProjectCardDigest = useMemo(() => {
    return buildDigestibleMilestoneCardEmailContent({
      project,
      cadence: cadence === 'none' ? 'biweekly' : cadence,
      overrideMilestoneTitle: selectedPreviewMilestone || undefined,
      aiTone,
      customAiSummary: customExecutiveSummary,
      variantSeed: aiVariantSeed,
      commsConfig: activeCommsConfig,
    });
  }, [
    project,
    cadence,
    selectedPreviewMilestone,
    aiTone,
    customExecutiveSummary,
    aiVariantSeed,
    activeCommsConfig,
  ]);

  // Shared projects for the currently selected shared recipient
  const activeSharedRecipientProjects = useMemo(() => {
    if (!activeSharedContact) return [project];
    const allForContact = [project, ...activeSharedContact.tiedProperties];
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
      '';
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
      commsConfig: activeCommsConfig,
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
    activeCommsConfig,
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
      commsConfig: activeCommsConfig,
    });

    const senderIdentity = gmailUserEmail || project.assignedPM.name;
    const { nextConfig: consumedConfig, wasOneTimeConsumed } = consumeOneTimePmMessageConfig(
      activeCommsConfig,
      senderIdentity
    );

    if (!viaGmailApi) {
      logPortfolioDispatchAcrossProjects({
        includedProjects: sharedList,
        primaryProject: project,
        recipients: [targetEmail],
        subject: emailPayload.subject,
        summary: `${emailPayload.summary} [Logged Separate Portfolio-Wide Update]`,
        logType: emailPayload.logType,
        sentBy: senderIdentity,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        onUpdateProject,
      });
      if (wasOneTimeConsumed && consumedConfig) {
        setPmPersonalMessage('');
        setPmPersonalMessageTitle('');
        handleSaveCommsConfigToProject(consumedConfig, true);
      }
      triggerToast(
        wasOneTimeConsumed
          ? `Logged separate Portfolio-Wide Update for ${targetEmail} & auto-cleared your One-Time PM Message so it won't repeat on future cadence runs!`
          : `Logged separate Portfolio-Wide Update for ${targetEmail} across ${sharedList.length} shared projects!`
      );
      return;
    }

    setIsSending(true);
    try {
      if (needsAuth) {
        const token = await googleSignIn();
        if (!token) {
          setIsSending(false);
          return;
        }
      }

      const sendResult = await sendRealGmailEmail({
        to: targetEmail,
        subject: emailPayload.subject,
        htmlBody: emailPayload.htmlBody,
        replyTo: project.assignedPM.email,
      });

      logPortfolioDispatchAcrossProjects({
        includedProjects: sharedList,
        primaryProject: project,
        recipients: sendResult.recipients,
        subject: emailPayload.subject,
        summary: emailPayload.summary,
        logType: emailPayload.logType,
        sentBy: sendResult.senderEmail || senderIdentity,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        onUpdateProject,
      });

      if (wasOneTimeConsumed && consumedConfig) {
        setPmPersonalMessage('');
        setPmPersonalMessageTitle('');
        handleSaveCommsConfigToProject(consumedConfig, true);
      }

      triggerToast(
        wasOneTimeConsumed
          ? `Sent separate Portfolio-Wide Update to ${targetEmail} & auto-cleared your One-Time PM Message so it won't repeat on future cadence runs!`
          : `Sent separate Portfolio-Wide Update to ${targetEmail} covering ${sharedList.length} shared projects!`
      );
    } catch (err: any) {
      setErrorBanner(
        err?.message ||
          'Failed to send via Gmail API. You can use "Open in Gmail Web" or "Save & Log Dispatch" below.'
      );
    } finally {
      setIsSending(false);
    }
  };

  // Send the current Project Cadence Digest to all subscribed recipients
  const handleSendProjectDigestToAll = async (viaGmailApi: boolean = true) => {
    setErrorBanner(null);

    const recipientList = Array.from(
      new Set([
        ...allProjectRecipients.map((r) => r.email),
        ...typedPendingEmails,
      ])
    );

    if (recipientList.length === 0) {
      setErrorBanner('Please add at least one recipient email to the Communications Tunnel first.');
      return;
    }

    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const senderIdentity = gmailUserEmail || project.assignedPM.name;
    const { nextConfig: consumedConfig, wasOneTimeConsumed } = consumeOneTimePmMessageConfig(
      activeCommsConfig,
      senderIdentity
    );

    if (!viaGmailApi) {
      const newLog: CustomerCommsLog = {
        id: `comm-tunnel-${Date.now()}`,
        projectId: project.id,
        timestamp: nowFormatted,
        type: 'deployment_overview_email',
        recipientEmail: recipientList.join(', '),
        subject: singleProjectCardDigest.subject,
        summary: `${singleProjectCardDigest.summary}${
          wasOneTimeConsumed ? ' [Included One-Time PM Message Card • Auto-Cleared]' : ''
        } [Communications Tunnel]`,
        sentBy: senderIdentity,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        status: 'Sent',
      };

      if (wasOneTimeConsumed) {
        setPmPersonalMessage('');
        setPmPersonalMessageTitle('');
      }

      const updatedProj: OperationProject = {
        ...project,
        commsTunnelAiTone: aiTone,
        commsTunnelAiCustomSummary: customExecutiveSummary,
        commsTunnelConfig: consumedConfig || activeCommsConfig,
        customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
        lastUpdated: new Date().toISOString(),
      };
      persistProjectUpdate(updatedProj);
      triggerToast(
        wasOneTimeConsumed
          ? `Dispatched One-Time Unique Update for ${recipientList.length} recipient(s) & automatically cleared the PM Message Card from future cadence runs!`
          : `Saved & logged Bi-Weekly Card Digest for ${recipientList.length} recipient(s) (${recipientList.join(', ')})!`
      );
      return;
    }

    setIsSending(true);
    try {
      if (needsAuth) {
        const token = await googleSignIn();
        if (!token) {
          setIsSending(false);
          return;
        }
      }

      const sendResult = await sendRealGmailEmail({
        to: recipientList.join(', '),
        subject: singleProjectCardDigest.subject,
        htmlBody: singleProjectCardDigest.htmlBody,
        replyTo: project.assignedPM.email,
      });

      const newLog: CustomerCommsLog = {
        id: `comm-tunnel-${Date.now()}`,
        projectId: project.id,
        timestamp: nowFormatted,
        type: 'deployment_overview_email',
        recipientEmail: sendResult.recipients.join(', '),
        subject: singleProjectCardDigest.subject,
        summary: `${singleProjectCardDigest.summary}${
          wasOneTimeConsumed ? ' [Included One-Time PM Message Card • Auto-Cleared]' : ''
        }`,
        sentBy: sendResult.senderEmail || senderIdentity,
        cadence: cadence === 'none' ? 'biweekly' : cadence,
        status: 'Delivered',
      };

      if (wasOneTimeConsumed) {
        setPmPersonalMessage('');
        setPmPersonalMessageTitle('');
      }

      const updatedProj: OperationProject = {
        ...project,
        commsTunnelAiTone: aiTone,
        commsTunnelAiCustomSummary: customExecutiveSummary,
        commsTunnelConfig: consumedConfig || activeCommsConfig,
        customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
        lastUpdated: new Date().toISOString(),
      };
      persistProjectUpdate(updatedProj);
      triggerToast(
        wasOneTimeConsumed
          ? `Dispatched update via Gmail & automatically cleared your One-Time PM Message so it won't repeat on future cadence emails!`
          : `Dispatched Bi-Weekly Card Digest via Gmail to ${sendResult.recipients.length} recipient(s)!`
      );
    } catch (err: any) {
      setErrorBanner(
        err?.message ||
          'Failed to send via Gmail API. Use "Open in Gmail Web" or "Save & Log Dispatch" below.'
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const installedBomItemsCount = project.bomItems.filter(
    (b) => (Number(b.installedCount) || 0) > 0
  ).length;

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
                <span
                  data-testid="tunnel-modal-live-status-pill"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isCadenceLive
                      ? 'bg-[#01C38D]/20 text-[#01C38D] border-[#01C38D]/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCadenceLive ? 'bg-[#01C38D] animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {isCadenceLive ? `LIVE • ${cadenceShortLabel}` : 'PAUSED • NOT LIVE'}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/15">
                  {allProjectRecipients.length} Active Recipient{allProjectRecipients.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">{project.propertyName}</strong> • Configure multi-recipient milestone updates, add PM personal messaging &amp; Stage 1–7 cards, and consolidate shared portfolio contacts.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 self-end sm:self-center">
            <div className="flex items-center gap-2">
              {/* Cadence Pill Selector */}
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-[11px]">
                {(['multi_day', 'weekly', 'biweekly', 'none'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleCadenceChange(opt)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      cadence === opt
                        ? opt === 'none'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                          : 'bg-[#01C38D] text-slate-950 font-black shadow-2xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt === 'multi_day'
                      ? 'Multi-Day'
                      : opt === 'biweekly'
                      ? 'Bi-Weekly'
                      : opt === 'weekly'
                      ? 'Weekly'
                      : 'Paused'}
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

            {cadence === 'multi_day' && (
              <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700">
                <span className="text-[9px] font-black uppercase text-[#01C38D] mr-1">Days:</span>
                {ALL_CADENCE_WEEKDAYS.map((d) => {
                  const active = selectedWeekdays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleToggleTunnelWeekday(d.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                        active
                          ? 'bg-[#01C38D] text-slate-950'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {d.short}
                    </button>
                  );
                })}
              </div>
            )}
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
        <div className="flex-1 min-h-[500px] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* LEFT COLUMN (5 cols): Multi-Recipient Entry + Genuine Shared Portfolio Detection + PM Personal Message + Stage 3-7 Field Selector */}
          <div className="lg:col-span-5 p-5 space-y-4 bg-slate-50/70 overflow-y-auto">
            {/* Step 1: Enter Multiple Recipient Emails */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
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
                <button
                  type="button"
                  onClick={() => setShowPortfolioLookup((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Search real customer emails across all projects in the database"
                >
                  <Search className="w-3 h-3 text-teal-600" />
                  <span>{showPortfolioLookup ? 'Hide Lookup' : 'Lookup Portfolio Emails'}</span>
                </button>
              </div>

              <form onSubmit={handleAddMultipleEmails} className="space-y-2.5">
                <textarea
                  data-testid="comms-tunnel-multi-email-input"
                  rows={2}
                  value={multiEmailInput}
                  onChange={(e) => setMultiEmailInput(e.target.value)}
                  placeholder="Enter customer or stakeholder emails (comma, space, or newline separated)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {typedPendingEmails.length > 0
                      ? `${typedPendingEmails.length} valid email(s) ready — live cross-project scan active`
                      : 'Automatically checks all live projects for shared recipients'}
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

              {/* Optional Genuine Live Database Email Lookup */}
              {showPortfolioLookup && (
                <div className="pt-2.5 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1">
                      <Search className="w-3 h-3 text-teal-600" />
                      <span>Live Database Portfolio Email Directory</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Real project contacts only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={portfolioLookupQuery}
                    onChange={(e) => setPortfolioLookupQuery(e.target.value)}
                    placeholder="Search by customer email, name, or property name..."
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                  {portfolioLookupResults.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1.5">
                      No matching customer emails found on other projects.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {portfolioLookupResults.map((item) => {
                        const alreadyOnProject = allProjectRecipients.some(
                          (r) => r.email.toLowerCase() === item.email.toLowerCase()
                        );
                        return (
                          <div
                            key={item.email}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-[11px]"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                                <span>{item.email}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-teal-100 text-teal-900">
                                  {item.projects.length} {item.projects.length === 1 ? 'Project' : 'Projects'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {item.projects.map((p) => `${p.project.propertyName} (${p.roleOrTitle})`).join(' • ')}
                              </div>
                            </div>
                            {alreadyOnProject ? (
                              <span className="text-[10px] font-bold text-emerald-700 shrink-0">
                                ✓ Subscribed
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddMultipleEmails(undefined, [item.email])}
                                className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold shrink-0 cursor-pointer"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SMART CROSS-PROJECT SHARED RECIPIENT SUGGESTION PANEL (100% Genuine Matches Only) */}
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
                      This email is genuinely registered on other active projects in your database. Send a <strong>separate Portfolio-Wide Update email</strong> that organizes all of their shared projects into one card-based digest:
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
                              Registered across <strong>{allSharedForThisEmail.length} Shared Projects</strong>:
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold">
                                {project.propertyName} (Current)
                              </span>
                              {mc.propertyDetails.map((pd) => (
                                <span
                                  key={pd.project.id}
                                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-semibold"
                                  title={pd.roleOrTitle}
                                >
                                  {pd.project.propertyName} ({pd.roleOrTitle})
                                </span>
                              ))}
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
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
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
                  No customer recipients registered on this project yet. Enter one or more emails above.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
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
                        className={`p-2 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
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
                              {item.roleLabel || item.source}
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
                          <div className="text-[10px] text-teal-900 bg-white/80 rounded-lg px-2 py-1 border border-teal-200/80 flex items-center justify-between gap-2">
                            <span className="truncate">
                              Also on:{' '}
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
            </div>

            {/* Step 3: PM PERSONAL MESSAGE CARD COMPOSER */}
            <div
              data-testid="pm-personal-message-card-section"
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-[#01C38D] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        3. PM Personal Message Card
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          pmPersonalMessageDeliveryMode === 'one_time'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {pmPersonalMessageDeliveryMode === 'one_time'
                          ? '⚡ One-Time Unique Update'
                          : '🔁 Standing Cadence Note'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Add your personal note — rendered as a signed executive card alongside the milestone cards.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="comms-tunnel-ai-draft-pm-note-btn"
                  onClick={handleAiPolishPmMessage}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Generate or polish your personal PM message into a client-ready card"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>{pmPersonalMessage.trim() ? 'AI Polish Note' : 'AI Draft Note'}</span>
                </button>
              </div>

              {/* Delivery Frequency Mode Selector: One-Time Unique Update vs. Recurring Cadence Note */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Message Card Persistence Mode:
                  </span>
                  {pmPersonalMessageDeliveryMode === 'one_time' && (
                    <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Protected: Auto-Clears After 1 Send
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    data-testid="pm-message-mode-one-time"
                    onClick={() => {
                      setPmPersonalMessageDeliveryMode('one_time');
                      handleSaveCommsConfigToProject(
                        { pmPersonalMessageDeliveryMode: 'one_time' },
                        true
                      );
                    }}
                    className={`py-1.5 px-2.5 rounded-lg font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      pmPersonalMessageDeliveryMode === 'one_time'
                        ? 'bg-purple-900 text-white border-purple-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>⚡ One-Time Unique Update</span>
                  </button>
                  <button
                    type="button"
                    data-testid="pm-message-mode-recurring"
                    onClick={() => {
                      setPmPersonalMessageDeliveryMode('recurring_cadence');
                      handleSaveCommsConfigToProject(
                        { pmPersonalMessageDeliveryMode: 'recurring_cadence' },
                        true
                      );
                    }}
                    className={`py-1.5 px-2.5 rounded-lg font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      pmPersonalMessageDeliveryMode === 'recurring_cadence'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🔁 Recurring on Cadence</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  {pmPersonalMessageDeliveryMode === 'one_time' ? (
                    <>
                      <strong className="text-purple-900">One-Time Unique Update:</strong> Included in the{' '}
                      <strong>next dispatch only</strong>, then automatically cleared so you never send an update-specific message over and over on the cadence.
                    </>
                  ) : (
                    <>
                      <strong className="text-slate-900">Standing Cadence Note:</strong> Remains pinned to every recurring bi-weekly/weekly cadence update until you edit or clear it.
                    </>
                  )}
                </p>
              </div>

              {/* Card Style Selector */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-[10px]">
                {(
                  [
                    { id: 'pm_note', label: 'Executive PM Note' },
                    { id: 'action_required', label: 'Action Callout' },
                    { id: 'milestone_highlight', label: 'Milestone Spotlight' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPmPersonalMessageStyle(st.id)}
                    className={`py-1 px-2 rounded-md font-bold transition-all cursor-pointer ${
                      pmPersonalMessageStyle === st.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={pmPersonalMessageTitle}
                onChange={(e) => setPmPersonalMessageTitle(e.target.value)}
                placeholder={
                  pmPersonalMessageDeliveryMode === 'one_time'
                    ? 'Optional card heading (defaults to "Special Update from Your Project Manager")'
                    : 'Optional card heading (defaults to "A Personal Note from Your Project Manager")'
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-emerald-600"
              />

              <textarea
                data-testid="comms-tunnel-pm-personal-message"
                rows={3}
                value={pmPersonalMessage}
                onChange={(e) => setPmPersonalMessage(e.target.value)}
                placeholder={
                  pmPersonalMessageDeliveryMode === 'one_time'
                    ? `Write a one-time unique update from ${project.assignedPM.name} for this specific dispatch (auto-clears after send)...`
                    : `Write a standing personal note from ${project.assignedPM.name} to embed on recurring cadence updates...`
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <span className="text-[10px] text-slate-500">
                  Signed by <strong>{project.assignedPM.name}</strong> ({project.assignedPM.role})
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pmPersonalMessage.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setPmPersonalMessage('');
                        setPmPersonalMessageTitle('');
                        handleSaveCommsConfigToProject(
                          { pmPersonalMessage: '', pmPersonalMessageTitle: '' },
                          true
                        );
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}

                  {pmPersonalMessageDeliveryMode === 'one_time' ? (
                    <>
                      <button
                        type="button"
                        data-testid="stage-one-time-pm-message-btn"
                        onClick={() =>
                          handleSaveCommsConfigToProject({
                            pmPersonalMessageDeliveryMode: 'one_time',
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-[10px] font-black cursor-pointer"
                        title="Queue this message card for the next cadence send only; it will automatically clear after that dispatch"
                      >
                        Queue for Next Send Only
                      </button>
                      {pmPersonalMessage.trim() && (
                        <button
                          type="button"
                          data-testid="send-one-time-pm-message-now-btn"
                          onClick={() => handleSendProjectDigestToAll(false)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Send this update with your One-Time Message Card right now and automatically clear it from future cadence runs"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>Send 1-Time Update &amp; Auto-Clear</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      data-testid="save-recurring-pm-message-btn"
                      onClick={() =>
                        handleSaveCommsConfigToProject({
                          pmPersonalMessageDeliveryMode: 'recurring_cadence',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black cursor-pointer"
                    >
                      Pin to Recurring Cadence
                    </button>
                  )}
                </div>
              </div>

              {/* Last Sent One-Time Message Auto-Cleared Confirmation Banner */}
              {project.commsTunnelConfig?.lastSentOneTimePmMessage && (
                <div
                  data-testid="last-sent-one-time-pm-message-banner"
                  className="mt-1.5 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[10px] text-emerald-950 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      Last One-Time Message Sent &amp; Cleared from Cadence (
                      {project.commsTunnelConfig.lastSentOneTimePmMessage.sentAt})
                    </span>
                    <button
                      type="button"
                      data-testid="reuse-last-one-time-pm-message-btn"
                      onClick={() => {
                        const prev = project.commsTunnelConfig?.lastSentOneTimePmMessage;
                        if (!prev) return;
                        setPmPersonalMessage(prev.message);
                        setPmPersonalMessageTitle(prev.title || '');
                        if (prev.style) setPmPersonalMessageStyle(prev.style);
                        setPmPersonalMessageDeliveryMode('one_time');
                      }}
                      className="px-2 py-0.5 rounded bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shrink-0 cursor-pointer"
                    >
                      Load / Edit Again
                    </button>
                  </div>
                  <div className="text-slate-600 italic line-clamp-2 bg-white/80 px-2 py-1 rounded border border-emerald-100">
                    &ldquo;{project.commsTunnelConfig.lastSentOneTimePmMessage.message}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: STAGE 1 & 2 ITEMS WAITING ON CUSTOMER FINALIZATION (With Direct Email Reply to PM) */}
            <div
              data-testid="comms-tunnel-stage1and2-panel"
              className="bg-white p-4 rounded-xl border border-amber-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      4. Stage 1 &amp; 2 Items Waiting on Customer Finalization
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        isCurrentOrPreviewStage1Or2
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isCurrentOrPreviewStage1Or2 ? 'Active Stage 1–2' : 'Stages 1–2'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Highlight items you are waiting on the customer to finalize in Project Kickoff (Stage 1) or Portal Buildout (Stage 2). Embeds 1-click email reply buttons &amp; an inline reply checklist that routes back to <strong>{project.assignedPM.email}</strong>.
                  </p>
                </div>
                {!isCurrentOrPreviewStage1Or2 && (
                  <button
                    type="button"
                    onClick={() => setForceShowStage1And2OnLaterStage((prev) => !prev)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    {forceShowStage1And2OnLaterStage ? 'Hide Selector' : 'Configure Stage 1–2'}
                  </button>
                )}
              </div>

              {!isCurrentOrPreviewStage1Or2 && !forceShowStage1And2OnLaterStage ? (
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-[11px] text-slate-600 flex items-center justify-between gap-2">
                  <span>
                    Currently previewing <strong>{selectedPreviewMilestone}</strong>. Switch preview to Stage 1 (<em>Project kickoff</em>) or Stage 2 (<em>Portal Buildout</em>) or click <strong>Configure Stage 1–2</strong> to highlight pending customer items.
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Master Toggle + Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        data-testid="toggle-include-stage1and2-card"
                        checked={includeStage1And2OutstandingCard}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIncludeStage1And2OutstandingCard(checked);
                          handleSaveCommsConfigToProject(
                            { includeStage1And2OutstandingCard: checked },
                            true
                          );
                        }}
                        className="w-3.5 h-3.5 rounded text-amber-600 cursor-pointer"
                      />
                      <span>
                        Highlight Waiting Customer Items Card in Email ({selectedStage1And2ItemIds.length} Selected)
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const missingIds = stage1And2Items
                            .filter((it) => !it.isAlreadyProvidedOnProject)
                            .map((it) => it.id);
                          setSelectedStage1And2ItemIds(missingIds);
                          setIncludeStage1And2OutstandingCard(true);
                          handleSaveCommsConfigToProject(
                            {
                              selectedStage1And2ItemIds: missingIds,
                              includeStage1And2OutstandingCard: true,
                            },
                            true
                          );
                        }}
                        className="px-2 py-0.5 rounded bg-white border border-amber-300 text-[10px] font-bold text-amber-900 hover:bg-amber-100 cursor-pointer"
                      >
                        Select Pending ({stage1And2Items.filter((it) => !it.isAlreadyProvidedOnProject).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = stage1And2Items.map((it) => it.id);
                          setSelectedStage1And2ItemIds(allIds);
                          setIncludeStage1And2OutstandingCard(true);
                          handleSaveCommsConfigToProject(
                            {
                              selectedStage1And2ItemIds: allIds,
                              includeStage1And2OutstandingCard: true,
                            },
                            true
                          );
                        }}
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        All ({stage1And2Items.length})
                      </button>
                    </div>
                  </div>

                  {/* Stage Filter Pills & Custom Item / Process Reply Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[10px]">
                      {(
                        [
                          { id: 'all', label: `All (${stage1And2Items.length})` },
                          {
                            id: 1,
                            label: `Stage 1: Kickoff (${stage1And2Items.filter((i) => i.stageNumber === 1).length})`,
                          },
                          {
                            id: 2,
                            label: `Stage 2: Portal (${stage1And2Items.filter((i) => i.stageNumber === 2).length})`,
                          },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={String(tab.id)}
                          type="button"
                          onClick={() => setStage1And2StageFilter(tab.id)}
                          className={`py-1 px-2 rounded-md font-extrabold transition-all cursor-pointer ${
                            stage1And2StageFilter === tab.id
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        data-testid="toggle-add-custom-stage1and2-btn"
                        onClick={() => setShowAddCustomStage1And2Form((prev) => !prev)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Custom Item</span>
                      </button>
                      <button
                        type="button"
                        data-testid="toggle-customer-email-reply-processor"
                        onClick={() => setShowCustomerReplyProcessor((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border cursor-pointer transition-colors ${
                          showCustomerReplyProcessor
                            ? 'bg-emerald-900 text-white border-emerald-900'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                        title="Paste or process a customer's email reply back to the PM to automatically finalize these items on the project"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Process Customer Email Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Add Custom Outstanding Item Drawer */}
                  {showAddCustomStage1And2Form && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                          Add Custom Stage 1 or 2 Item Waiting on Customer
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddCustomStage1And2Form(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={newCustomItemStage}
                          onChange={(e) => setNewCustomItemStage(Number(e.target.value) as 1 | 2)}
                          className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                        >
                          <option value={1}>Stage 1: Project kickoff</option>
                          <option value={2}>Stage 2: Portal Buildout</option>
                        </select>
                        <input
                          type="text"
                          value={newCustomItemTitle}
                          onChange={(e) => setNewCustomItemTitle(e.target.value)}
                          placeholder="Item title (e.g., Elevator Access Relay Spec)"
                          className="col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCustomItemPrompt}
                          onChange={(e) => setNewCustomItemPrompt(e.target.value)}
                          placeholder="What specific details should the customer reply with by email?"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomStage1And2Item}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shrink-0 cursor-pointer"
                        >
                          + Add &amp; Highlight
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Customer Email Reply Processor Drawer */}
                  {showCustomerReplyProcessor && (
                    <div
                      data-testid="customer-email-reply-processor-drawer"
                      className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Apply Customer Email Reply Back to Project</span>
                          </div>
                          <p className="text-[10px] text-emerald-800">
                            When the customer replies by email to <strong>{project.assignedPM.email}</strong> (using the 1-click reply buttons or inline checklist), paste their reply below to automatically finalize the items &amp; update the project.
                          </p>
                        </div>
                        <button
                          type="button"
                          data-testid="load-sample-customer-email-reply-btn"
                          onClick={() => {
                            const activeWaiting = stage1And2Items.filter((it) =>
                              selectedStage1And2ItemIds.includes(it.id)
                            );
                            const sampleItems =
                              activeWaiting.length > 0 ? activeWaiting : stage1And2Items.slice(0, 3);
                            const sampleLines = [
                              `From: ${project.customerIntake?.communityEmail || 'customer@property.com'}`,
                              `To: ${project.assignedPM.email}`,
                              `Subject: Re: [Customer Finalization • ${project.propertyName}] Finalized Stage 1 & 2 Details`,
                              '',
                              ...sampleItems.flatMap((it, idx) => {
                                let sampleAns = 'Confirmed and approved by onsite property manager.';
                                if (it.id === 'stage1_pms_credentials') {
                                  sampleAns = `Yardi Voyager — Property Code: ${project.propertyName
                                    .slice(0, 4)
                                    .toUpperCase()}-100 (API sync approved)`;
                                } else if (it.id === 'stage1_common_doors') {
                                  sampleAns =
                                    'Clubhouse Main Entry, 24hr Fitness Center, Pool East Gate, Leasing Office Side Door';
                                } else if (it.id === 'stage1_staff_roles') {
                                  sampleAns = `Hannah Galarneau (${
                                    project.customerIntake?.communityEmail || 'manager@property.com'
                                  }) — Property Manager (Full Portal Admin)`;
                                } else if (it.id === 'stage1_site_maps_gateway') {
                                  sampleAns =
                                    'Clubhouse 2nd floor IDF closet and Building B roof parapet approved with PoE ethernet.';
                                } else if (it.id === 'stage1_thermostat_vacant_temp') {
                                  sampleAns = '64°F Heating / 76°F Cooling for all vacant units';
                                } else if (it.id === 'stage1_fire_keys_knox') {
                                  sampleAns =
                                    'Fire Marshal Knox Box #2 at main gate; 3 master fobs staged in Leasing Office safe.';
                                } else if (it.id === 'stage2_lock_finish_trim') {
                                  sampleAns =
                                    'Matte Black (622) finish with Century Trim and Latitude Lever confirmed for all units.';
                                } else if (it.id === 'stage2_nfc_wallet_art') {
                                  sampleAns =
                                    'Yes — Apple & Google NFC Wallet enabled with primary navy/emerald community branding.';
                                } else if (it.id === 'stage2_qr_intercom_logo') {
                                  sampleAns =
                                    'Yes — QR Video Intercom confirmed for main entry & pool gate.';
                                }
                                return [
                                  `${idx + 1}. [${it.title}] (Ref: ${it.id})`,
                                  `👉 ${it.replyFieldLabel}: ${sampleAns}`,
                                  '',
                                ];
                              }),
                            ];
                            setCustomerReplyInputText(sampleLines.join('\n'));
                          }}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold shrink-0 cursor-pointer"
                        >
                          Pre-Fill Sample Reply
                        </button>
                      </div>

                      <input
                        type="text"
                        value={customerReplySenderEmail}
                        onChange={(e) => setCustomerReplySenderEmail(e.target.value)}
                        placeholder={`Customer sender email (e.g., ${project.customerIntake?.communityEmail || 'manager@property.com'})`}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-900 font-semibold"
                      />

                      <textarea
                        data-testid="customer-email-reply-textarea"
                        rows={4}
                        value={customerReplyInputText}
                        onChange={(e) => setCustomerReplyInputText(e.target.value)}
                        placeholder="Paste the customer's email reply body here..."
                        className="w-full px-2.5 py-2 text-xs bg-white border border-emerald-300 rounded-lg text-slate-900 font-mono"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCustomerReplyProcessor(false)}
                          className="px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          data-testid="apply-customer-email-reply-btn"
                          onClick={handleApplyCustomerEmailReply}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply Customer Email Reply to Project</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stage 1 & 2 Checklist Items */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {filteredStage1And2Items.map((item) => {
                      const isChecked = selectedStage1And2ItemIds.includes(item.id);
                      const isEditingPrompt = editingPromptItemId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border text-[11px] transition-colors ${
                            isChecked
                              ? 'bg-amber-50/70 border-amber-300'
                              : item.isFinalizedViaEmailReply
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-slate-50 border-slate-200 opacity-85'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              onClick={() => {
                                const next = isChecked
                                  ? selectedStage1And2ItemIds.filter((id) => id !== item.id)
                                  : [...selectedStage1And2ItemIds, item.id];
                                setSelectedStage1And2ItemIds(next);
                                const nextInclude =
                                  next.length > 0 ? true : includeStage1And2OutstandingCard;
                                if (next.length > 0 && !includeStage1And2OutstandingCard) {
                                  setIncludeStage1And2OutstandingCard(true);
                                }
                                handleSaveCommsConfigToProject(
                                  {
                                    selectedStage1And2ItemIds: next,
                                    includeStage1And2OutstandingCard: nextInclude,
                                  },
                                  true
                                );
                              }}
                              className="flex items-start gap-2 min-w-0 flex-1 cursor-pointer"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                      item.stageNumber === 1
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-indigo-100 text-indigo-900'
                                    }`}
                                  >
                                    Stage {item.stageNumber}
                                  </span>
                                  <span className="font-bold text-slate-900">{item.title}</span>
                                </div>
                                <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">
                                  {item.promptOrDetailNeeded}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  Status: <strong className="text-slate-700">{item.currentValueSummary}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                  item.isFinalizedViaEmailReply
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : item.isAlreadyProvidedOnProject
                                    ? 'bg-slate-200 text-slate-700'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {item.isFinalizedViaEmailReply
                                  ? '✓ Finalized via Email'
                                  : item.isAlreadyProvidedOnProject
                                  ? '✓ On Project'
                                  : '⏳ Waiting on Customer'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingPromptItemId(isEditingPrompt ? null : item.id)
                                }
                                className="text-[9px] font-bold text-amber-800 hover:underline cursor-pointer"
                              >
                                {isEditingPrompt ? 'Done Editing' : 'Edit Question'}
                              </button>
                            </div>
                          </div>

                          {isEditingPrompt && (
                            <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center gap-1.5">
                              <input
                                type="text"
                                value={
                                  stage1And2ItemCustomPrompts[item.id] ?? item.promptOrDetailNeeded
                                }
                                onChange={(e) => {
                                  const nextPrompts = {
                                    ...stage1And2ItemCustomPrompts,
                                    [item.id]: e.target.value,
                                  };
                                  setStage1And2ItemCustomPrompts(nextPrompts);
                                  handleSaveCommsConfigToProject(
                                    { stage1And2ItemCustomPrompts: nextPrompts },
                                    true
                                  );
                                }}
                                className="flex-1 px-2 py-1 text-[11px] bg-white border border-amber-300 rounded-lg text-slate-900"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 5: STAGES 3–7 FIELD & OPERATIONS CARDS SELECTOR (Installed BOM, Shipping Dock, Installer Logs, Project Notes) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      5. Stage 3–7 Field &amp; Operations Cards
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        isCurrentOrPreviewStage3To7
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isCurrentOrPreviewStage3To7 ? 'Active Stage 3–7' : 'Stages 3–7'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select installed BOM items, Shipping Dock tracking batches, Installer Logs, or Project Notes to embed as cards in the update.
                  </p>
                </div>
                {!isCurrentOrPreviewStage3To7 && (
                  <button
                    type="button"
                    onClick={() => setForceShowOpsCardsOnEarlyStage((prev) => !prev)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    {forceShowOpsCardsOnEarlyStage ? 'Hide Selector' : 'Configure Early'}
                  </button>
                )}
              </div>

              {!isCurrentOrPreviewStage3To7 && !forceShowOpsCardsOnEarlyStage ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between gap-2">
                  <span>
                    Currently previewing <strong>{selectedPreviewMilestone}</strong>. Switch preview to Stages 3–7 (<em>Product Acquisition</em> through <em>Project Closed</em>) or click <strong>Configure Early</strong> to embed BOM, Shipping, Installer Log, or Note cards.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 4 Category Sub-Tabs */}
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-[10px]">
                    <button
                      type="button"
                      onClick={() => setActiveOpsSelectorTab('bom')}
                      className={`py-1.5 px-1.5 rounded-lg font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeOpsSelectorTab === 'bom'
                          ? 'bg-white text-sky-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Package className="w-3 h-3 text-sky-600 shrink-0" />
                      <span className="truncate">BOM ({project.bomItems.length})</span>
                      {includeInstalledBomCard && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOpsSelectorTab('shipping')}
                      className={`py-1.5 px-1.5 rounded-lg font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeOpsSelectorTab === 'shipping'
                          ? 'bg-white text-amber-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">Shipping ({shippingDockItems.length})</span>
                      {includeShippingDockCard && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOpsSelectorTab('logs')}
                      className={`py-1.5 px-1.5 rounded-lg font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeOpsSelectorTab === 'logs'
                          ? 'bg-white text-emerald-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ClipboardList className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Logs ({allInstallLogs.length})</span>
                      {includeInstallerLogCard && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOpsSelectorTab('notes')}
                      className={`py-1.5 px-1.5 rounded-lg font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeOpsSelectorTab === 'notes'
                          ? 'bg-white text-indigo-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span className="truncate">Notes ({projectNotes.length})</span>
                      {includeProjectNotesCard && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* TAB 1: INSTALLED BOM LINE ITEMS */}
                  {activeOpsSelectorTab === 'bom' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-sky-50/70 p-2 rounded-lg border border-sky-200">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            data-testid="toggle-include-bom-card"
                            checked={includeInstalledBomCard}
                            onChange={(e) => setIncludeInstalledBomCard(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
                          />
                          <span>Include Installed BOM Line Items Card in Email</span>
                        </label>
                        <div className="flex items-center gap-1">
                          {installedBomItemsCount > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setIncludeInstalledBomCard(true);
                                setSelectedBomItemIds(
                                  project.bomItems
                                    .filter((b) => (Number(b.installedCount) || 0) > 0)
                                    .map((b) => b.id)
                                );
                              }}
                              className="px-2 py-0.5 rounded bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold cursor-pointer"
                            >
                              Installed ({installedBomItemsCount})
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setIncludeInstalledBomCard(true);
                              setSelectedBomItemIds(project.bomItems.map((b) => b.id));
                            }}
                            className="px-2 py-0.5 rounded bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold cursor-pointer"
                          >
                            All ({project.bomItems.length})
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {project.bomItems.map((item) => {
                          const isChecked = selectedBomItemIds.includes(item.id);
                          const inst = Number(item.installedCount) || 0;
                          const qty = Number(item.quantity) || 0;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                const next = isChecked
                                  ? selectedBomItemIds.filter((id) => id !== item.id)
                                  : [...selectedBomItemIds, item.id];
                                setSelectedBomItemIds(next);
                                if (next.length > 0 && !includeInstalledBomCard) {
                                  setIncludeInstalledBomCard(true);
                                }
                              }}
                              className={`p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-sky-50/50 border-sky-300'
                                  : 'bg-slate-50 border-slate-200 opacity-75'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isChecked ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate">{item.name}</div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {item.model} • {item.location}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                                  inst > 0
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {inst}/{qty} Installed
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SHIPPING DOCK LINE ITEMS */}
                  {activeOpsSelectorTab === 'shipping' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            data-testid="toggle-include-shipping-card"
                            checked={includeShippingDockCard}
                            onChange={(e) => setIncludeShippingDockCard(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-amber-600 cursor-pointer"
                          />
                          <span>Include Shipping Dock &amp; Tracking Card in Email</span>
                        </label>
                      </div>

                      {shippingDockItems.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          No Shipping Dock batches logged on this project yet.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {shippingDockItems.map((dock) => {
                            const isChecked = selectedShippingDockIds.includes(dock.id);
                            const trackNums = getDockItemTrackingNumbers(dock);
                            return (
                              <div
                                key={dock.id}
                                onClick={() => {
                                  const next = isChecked
                                    ? selectedShippingDockIds.filter((id) => id !== dock.id)
                                    : [...selectedShippingDockIds, dock.id];
                                  setSelectedShippingDockIds(next);
                                  if (next.length > 0 && !includeShippingDockCard) {
                                    setIncludeShippingDockCard(true);
                                  }
                                }}
                                className={`p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-amber-50/50 border-amber-300'
                                    : 'bg-slate-50 border-slate-200 opacity-75'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 truncate">
                                      {dock.shipmentBatchLabel}: {dock.bomItemName} ({dock.shippedQuantity} units)
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {dock.carrier} • Tracking: {trackNums.join(', ') || dock.trackingNumber || 'Pending'}
                                    </div>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold shrink-0">
                                  {dock.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: INSTALLER LOG LINE ITEMS */}
                  {activeOpsSelectorTab === 'logs' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            data-testid="toggle-include-logs-card"
                            checked={includeInstallerLogCard}
                            onChange={(e) => setIncludeInstallerLogCard(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer"
                          />
                          <span>Include Field Installer Log Card in Email</span>
                        </label>
                      </div>

                      {allInstallLogs.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          No Installer Log entries recorded on this project yet.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {allInstallLogs.map((log) => {
                            const isChecked = selectedInstallLogIds.includes(log.id);
                            return (
                              <div
                                key={log.id}
                                onClick={() => {
                                  const next = isChecked
                                    ? selectedInstallLogIds.filter((id) => id !== log.id)
                                    : [...selectedInstallLogIds, log.id];
                                  setSelectedInstallLogIds(next);
                                  if (next.length > 0 && !includeInstallerLogCard) {
                                    setIncludeInstallerLogCard(true);
                                  }
                                }}
                                className={`p-2 rounded-lg border text-[11px] flex items-start justify-between gap-2 cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-50/50 border-emerald-300'
                                    : 'bg-slate-50 border-slate-200 opacity-75'
                                }`}
                              >
                                <div className="flex items-start gap-2 min-w-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900">
                                      +{log.quantityCompleted} {log.itemName} • {log.locationCompleted}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {log.installerName} ({log.timestamp}) — {log.statusCheck}
                                    </div>
                                    {(log.notes || log.fieldTechNotes) && (
                                      <div className="text-[10px] text-slate-700 mt-0.5 italic truncate">
                                        {log.notes || log.fieldTechNotes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: PROJECT NOTES */}
                  {activeOpsSelectorTab === 'notes' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-indigo-50/70 p-2 rounded-lg border border-indigo-200">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            data-testid="toggle-include-notes-card"
                            checked={includeProjectNotesCard}
                            onChange={(e) => setIncludeProjectNotesCard(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                          />
                          <span>Include Relevant Project Notes Card in Email</span>
                        </label>
                      </div>

                      {projectNotes.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          No Project Notes recorded on this project yet.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {projectNotes.map((note) => {
                            const isChecked = selectedProjectNoteIds.includes(note.id);
                            return (
                              <div
                                key={note.id}
                                onClick={() => {
                                  const next = isChecked
                                    ? selectedProjectNoteIds.filter((id) => id !== note.id)
                                    : [...selectedProjectNoteIds, note.id];
                                  setSelectedProjectNoteIds(next);
                                  if (next.length > 0 && !includeProjectNotesCard) {
                                    setIncludeProjectNotesCard(true);
                                  }
                                }}
                                className={`p-2 rounded-lg border text-[11px] flex items-start justify-between gap-2 cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-indigo-50/50 border-indigo-300'
                                    : 'bg-slate-50 border-slate-200 opacity-75'
                                }`}
                              >
                                <div className="flex items-start gap-2 min-w-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900">
                                      {note.category} • <span className="text-slate-500 font-normal">{note.author} ({note.timestamp})</span>
                                    </div>
                                    <div className="text-[10px] text-slate-700 mt-0.5 line-clamp-2">
                                      {note.text}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
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
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                  <span>{isAiGenerating ? 'AI Generating Cards...' : '✨ AI Generate Card Digest'}</span>
                </button>
              </div>

              {/* Milestone Stage Selector & AI Presentation Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/80">
                {previewMode === 'single_project' ? (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Preview Cadence Email for Milestone Stage:
                    </label>
                    <select
                      data-testid="comms-tunnel-milestone-stage-select"
                      value={selectedPreviewMilestone}
                      onChange={(e) => setSelectedPreviewMilestone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      {project.milestones.map((m, idx) => (
                        <option key={m.id || m.title} value={m.title}>
                          Stage {idx + 1}: {m.title}
                          {m.title === currentMilestoneObj?.title ? ' (Current Active)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-teal-800 mb-1">
                      Portfolio-Wide Recipient &amp; Shared Projects:
                    </label>
                    {sharedRecipientsDetection.matchedContacts.length > 0 ? (
                      <select
                        value={activeSharedContact?.email || ''}
                        onChange={(e) => setSelectedSharedRecipientEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-lg text-teal-950 font-bold focus:outline-none focus:border-teal-600"
                      >
                        {sharedRecipientsDetection.matchedContacts.map((mc) => (
                          <option key={mc.email} value={mc.email}>
                            {mc.email} ({mc.tiedProperties.length + 1} Shared Projects)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-500">
                        Enter a shared recipient email on the left to preview multi-project consolidation
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    AI Card Presentation Style:
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200 text-[11px]">
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
                        className={`py-1 px-2 rounded-md font-bold transition-all cursor-pointer ${
                          aiTone === t.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Custom AI Headline / Executive Note Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  AI Executive Snapshot Headline (Editable):
                </label>
                <input
                  type="text"
                  value={customExecutiveSummary}
                  onChange={(e) => setCustomExecutiveSummary(e.target.value)}
                  placeholder={singleProjectCardDigest.aiExecutiveHeadline}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Email Metadata Header Bar */}
            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-bold text-slate-500 mr-1.5">To:</span>
                  <span className="font-bold text-slate-900">
                    {previewMode === 'portfolio_shared' && activeSharedContact
                      ? `${activeSharedContact.email} (Consolidated Portfolio Update across ${activeSharedRecipientProjects.length} projects)`
                      : allProjectRecipients.map((r) => r.email).join(', ') ||
                        typedPendingEmails.join(', ') ||
                        'Enter recipient email(s) on the left'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  Card-Based Digest
                </span>
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-500 mr-1.5">Subject:</span>
                <span className="font-extrabold text-slate-900">{activeEmailPreview.subject}</span>
              </div>
            </div>

            {/* Live Rendered Card-Based Email Preview Container */}
            <div
              data-testid="comms-tunnel-email-preview-container"
              className="flex-1 border border-slate-200 rounded-2xl bg-slate-100/70 p-3 overflow-y-auto max-h-[480px] shadow-inner"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: activeEmailPreview.htmlBody,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Modal Action Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {needsAuth ? (
              <div className="flex items-center gap-2">
                <GoogleSignInButton />
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Sign in with Google for 1-click live inbox delivery
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected: {gmailUserEmail}</span>
              </span>
            )}

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
              onClick={() => {
                if (previewMode === 'portfolio_shared' && activeSharedContact) {
                  handleSendSeparatePortfolioEmail(activeSharedContact.email, false);
                } else {
                  handleSendProjectDigestToAll(false);
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail Web</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (previewMode === 'portfolio_shared' && activeSharedContact) {
                  handleSendSeparatePortfolioEmail(activeSharedContact.email, false);
                } else {
                  handleSendProjectDigestToAll(false);
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save &amp; Log Dispatch</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
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
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? 'Sending Portfolio Digest...'
                    : `Send Separate Portfolio Update to ${activeSharedContact.email} (${activeSharedRecipientProjects.length} Projects)`}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendProjectDigestToAll(true)}
                className="px-5 py-2.5 rounded-xl bg-[#01C38D] hover:bg-[#00b07f] text-[#0f172a] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? 'Sending Card Digest...'
                    : `Send ${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Card Digest Now (${allProjectRecipients.length} Recipients)`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
