import React, { useState, useEffect, useRef } from 'react';
import {
  OperationProject,
  StaffRoleSubmission,
  CommonAreaDoor,
  CustomerCommsLog,
  BOMItem,
  InstallLogEntry,
  ThermostatBrand,
  AVAILABLE_PMS,
  AVAILABLE_FIELD_TECHS,
  Quote,
  calculateProjectScheduleHealth,
  getProjectIntegratorPartners,
  buildCustomerKickoffPortalUrl,
} from '../types';
import { ProjectDetailView } from './ProjectDetailView';
import { ShippingDockSection } from './ShippingDockSection';
import { SOWForecasterSection } from './SOWForecasterSection';
import { BOMTable } from './BOMTable';
import {
  VolumeX,
  BellOff,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  DoorOpen,
  FileText,
  Upload,
  Slack,
  Mail,
  QrCode,
  Smartphone,
  AlertTriangle,
  X,
  RotateCcw,
  Eye,
  Layers,
} from 'lucide-react';

export type FocusModeType = 'none' | 'initial-prompt' | 'standard' | 'quext-vision';

interface SavedProjectFocusProgress {
  projectId: string;
  milestoneTitle: string;
  currentStepIndex: number;
  kickoffStep2SubWindow?: boolean; // Whether inside the second sub-window of Kickoff Step 2
  completedChecklistIds: string[];
  automatedOptInEmails: string[];
  remainingSeconds: number;
  lastSavedAt: string;
}

const FOCUS_STORAGE_KEY = 'quext_vision_focus_sessions_v1';
const TWENTY_ONE_MINUTES_SECONDS = 21 * 60; // 1260 seconds

function loadSavedFocusSessions(): Record<string, SavedProjectFocusProgress> {
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load focus sessions', e);
  }
  return {};
}

function saveFocusSessions(map: Record<string, SavedProjectFocusProgress>) {
  try {
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save focus sessions', e);
  }
}

export function getActiveMilestoneForProject(project: OperationProject): string {
  const inProgress = project.milestones.find((m) => m.status === 'In Progress');
  if (inProgress) return inProgress.title;
  const upcoming = project.milestones.find((m) => m.status === 'Upcoming');
  if (upcoming) return upcoming.title;
  const completedNonClosed = [...project.milestones]
    .reverse()
    .find((m) => !m.title.toLowerCase().includes('closed'));
  return completedNonClosed?.title || 'Project kickoff';
}

export interface MilestoneChecklistItem {
  id: string;
  stepIndex: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export function evaluateMilestoneChecklist(
  project: OperationProject,
  milestoneTitle: string,
  explicitlyCompletedIds: string[]
): MilestoneChecklistItem[] {
  const norm = milestoneTitle.toLowerCase();
  const intake = project.customerIntake;
  const comms = project.customerCommsLogs || [];
  const hasExplicit = (id: string) => explicitlyCompletedIds.includes(id);

  if (norm.includes('kickoff')) {
    const hasContacts = (intake?.staffRoles?.length || 0) > 0 && hasExplicit('kickoff_step_1');
    const hasSentWalkthrough =
      hasExplicit('kickoff_step_2') ||
      comms.some((c) => c.id.includes('focus-kickoff-walkthrough'));
    const hasDoorTree =
      hasExplicit('kickoff_step_3') ||
      Boolean(
        (intake?.commonAreaDoors?.length || 0) > 0 &&
          (intake?.doorsConfirmedByCustomer ||
            comms.some((c) => c.id.includes('focus-door-reminder')))
      );
    const hasCustomerPms =
      hasExplicit('kickoff_step_4') ||
      comms.some((c) => c.id.includes('focus-pms-customer'));
    const hasTeamPms =
      hasExplicit('kickoff_step_5') ||
      (project.teamAssists || []).some((a) => a.id.includes('focus-pms-team'));
    const hasNfcQr =
      hasExplicit('kickoff_step_6') ||
      comms.some((c) => c.id.includes('focus-nfc-qr'));
    const hasSitePlans =
      hasExplicit('kickoff_step_7') ||
      Boolean(intake?.sitePlanPdfName && intake?.sitePlanConfirmedEdited) ||
      comms.some((c) => c.id.includes('focus-siteplan-req'));

    return [
      {
        id: 'kickoff_step_1',
        stepIndex: 0,
        title: 'Document Project Points of Contact & Automated Comms Opt-In',
        description:
          'Record first & last name, role, phone number, email, and automated Customer Comms Control Panel checkmark.',
        isCompleted: hasContacts,
      },
      {
        id: 'kickoff_step_2',
        stepIndex: 1,
        title: 'Send Customer Kickoff Walkthrough Document to Opted-In Contacts',
        description:
          'Dispatch the Customer Kickoff Walkthrough document to contacts opted into automated actions.',
        isCompleted: hasSentWalkthrough,
      },
      {
        id: 'kickoff_step_3',
        stepIndex: 2,
        title: 'Verify Common Area Door Tree List & Send Customer Reminder',
        description:
          'Review the Common Area Door Tree in its entirety and send a friendly reminder email if needed.',
        isCompleted: hasDoorTree,
      },
      {
        id: 'kickoff_step_4',
        stepIndex: 3,
        title: 'Verify Customer PMS Integration & Send Walkthrough Reminder',
        description:
          'Ensure customer PMS integration steps are completed or send walkthrough link with a kind reminder.',
        isCompleted: hasCustomerPms,
      },
      {
        id: 'kickoff_step_5',
        stepIndex: 4,
        title: 'Coordinate Internal Team PMS Software Connections (Slack / Email)',
        description:
          'Ensure internal team members have finalized steps for the chosen PMS software.',
        isCompleted: hasTeamPms,
      },
      {
        id: 'kickoff_step_6',
        stepIndex: 5,
        title: 'Confirm NFC Wallet & QR Intercom Project Features',
        description:
          'Check off NFC and QR Intercom features for the property and send kickoff document update request if needed.',
        isCompleted: hasNfcQr,
      },
      {
        id: 'kickoff_step_7',
        stepIndex: 6,
        title: 'Confirm Site Plans PDF for Gateway Locations',
        description:
          'Send customer PDF file upload request and confirm uploaded site plans reflect gateway installation locations.',
        isCompleted: hasSitePlans,
      },
    ];
  }

  if (norm.includes('portal buildout')) {
    const isDone =
      hasExplicit('portal_buildout_step_1') ||
      comms.some((c) => c.id.includes('focus-portal-finalize'));
    return [
      {
        id: 'portal_buildout_step_1',
        stepIndex: 0,
        title: 'Send Customer Kickoff Document to Finalize Remaining Form Items',
        description:
          'Dispatch the Customer Kickoff document to the customer to finish finalizing any incomplete items on the form.',
        isCompleted: isDone,
      },
    ];
  }

  if (norm.includes('product acquisition')) {
    const isDone =
      hasExplicit('product_acq_step_1') ||
      comms.some((c) => c.type === 'shipping_update_email' || c.type === 'product_acceptance_request');
    return [
      {
        id: 'product_acq_step_1',
        stepIndex: 0,
        title: 'Review & Update Shipping Dock and Send Customer Updates',
        description:
          'Review integrator shipments in the Shipping Dock, update tracking/statuses, and send updates to the customer.',
        isCompleted: isDone,
      },
    ];
  }

  if (norm.includes('csm intro') || norm.includes('pre-implementation')) {
    const isDone =
      hasExplicit('csm_intro_step_1') ||
      comms.some((c) => c.type === 'sow_forecast_email');
    return [
      {
        id: 'csm_intro_step_1',
        stepIndex: 0,
        title: 'Update SOW Forecaster & Send SOW Overview to Customer',
        description:
          'Forecast installer scope of work matched against BOM line items and dispatch the SOW overview to the customer.',
        isCompleted: isDone,
      },
    ];
  }

  if (norm.includes('implementation')) {
    const isDone = hasExplicit('implementation_step_1');
    return [
      {
        id: 'implementation_step_1',
        stepIndex: 0,
        title: 'Update Smart Community Bill of Materials (BOM) Section',
        description:
          'Review and update installed device counts, spares, and field installation logs on the Smart Community BOM.',
        isCompleted: isDone,
      },
    ];
  }

  // Default / CSM Handoff
  const isCsmDone =
    hasExplicit('csm_handoff_step_1') ||
    comms.some((c) => c.type === 'csm_handoff_email');
  return [
    {
      id: 'csm_handoff_step_1',
      stepIndex: 0,
      title: 'Send CSM Handoff Communication to Customer',
      description:
        'Dispatch the official Customer Success Manager (CSM) Handoff communication to the customer.',
      isCompleted: isCsmDone,
    },
  ];
}

interface QuextVisionFocusControllerProps {
  focusMode: FocusModeType;
  setFocusMode: (mode: FocusModeType) => void;
  projects: OperationProject[];
  quotesList: Quote[];
  activeProjectId: string;
  onSelectProjectId: (id: string) => void;
  onUpdateProject: (updated: OperationProject) => void;
}

export const QuextVisionFocusController: React.FC<QuextVisionFocusControllerProps> = ({
  focusMode,
  setFocusMode,
  projects,
  quotesList,
  activeProjectId,
  onSelectProjectId,
  onUpdateProject,
}) => {
  const project = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeMilestoneTitle = project ? getActiveMilestoneForProject(project) : 'Project kickoff';
  const sessionKey = project ? `${project.id}__${activeMilestoneTitle}` : 'default';

  const [savedSessions, setSavedSessions] = useState<Record<string, SavedProjectFocusProgress>>(
    () => loadSavedFocusSessions()
  );

  const currentSaved = savedSessions[sessionKey];

  // Current window step index for Quext Vision mode
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(
    currentSaved?.currentStepIndex || 0
  );
  // Sub-window state specifically for Project Kickoff Step 2 (Window 2A -> Window 2B)
  const [kickoffStep2SubWindow, setKickoffStep2SubWindow] = useState<boolean>(
    currentSaved?.kickoffStep2SubWindow || false
  );
  const [completedChecklistIds, setCompletedChecklistIds] = useState<string[]>(
    currentSaved?.completedChecklistIds || []
  );
  const [automatedOptInEmails, setAutomatedOptInEmails] = useState<string[]>(() => {
    if (currentSaved?.automatedOptInEmails && currentSaved.automatedOptInEmails.length > 0) {
      return currentSaved.automatedOptInEmails;
    }
    const sub = project?.customerIntake?.subscriberEmail;
    const comm = project?.customerIntake?.communityEmail;
    const firstStaff = project?.customerIntake?.staffRoles?.[0]?.email;
    return Array.from(new Set([sub, comm, firstStaff].filter(Boolean) as string[]));
  });

  // 21-Minute Session Countdown Timer
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    currentSaved?.remainingSeconds && currentSaved.remainingSeconds > 0
      ? currentSaved.remainingSeconds
      : TWENTY_ONE_MINUTES_SECONDS
  );
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] = useState<boolean>(false);

  // 7-Second Temporary Silence & Notification Banner
  const [showSilenceBanner, setShowSilenceBanner] = useState<boolean>(false);
  const [silenceBannerSecondsLeft, setSilenceBannerSecondsLeft] = useState<number>(7);

  // End Focus Session Confirmation Modal
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState<boolean>(false);
  const [confirmUnfinishedItemsChecked, setConfirmUnfinishedItemsChecked] = useState<boolean>(false);

  // Sync state when switching project or milestone
  useEffect(() => {
    const saved = savedSessions[sessionKey];
    if (saved) {
      setCurrentStepIndex(saved.currentStepIndex || 0);
      setKickoffStep2SubWindow(Boolean(saved.kickoffStep2SubWindow));
      setCompletedChecklistIds(saved.completedChecklistIds || []);
      if (saved.automatedOptInEmails?.length) {
        setAutomatedOptInEmails(saved.automatedOptInEmails);
      }
      setRemainingSeconds(
        saved.remainingSeconds > 0 ? saved.remainingSeconds : TWENTY_ONE_MINUTES_SECONDS
      );
    } else {
      setCurrentStepIndex(0);
      setKickoffStep2SubWindow(false);
      setCompletedChecklistIds([]);
      const sub = project?.customerIntake?.subscriberEmail;
      const comm = project?.customerIntake?.communityEmail;
      const firstStaff = project?.customerIntake?.staffRoles?.[0]?.email;
      setAutomatedOptInEmails(
        Array.from(new Set([sub, comm, firstStaff].filter(Boolean) as string[]))
      );
      setRemainingSeconds(TWENTY_ONE_MINUTES_SECONDS);
    }
  }, [sessionKey]);

  // Persist session progress whenever step, checklist, or timer changes
  useEffect(() => {
    if (!project || (focusMode !== 'standard' && focusMode !== 'quext-vision')) return;
    setSavedSessions((prev) => {
      const next: Record<string, SavedProjectFocusProgress> = {
        ...prev,
        [sessionKey]: {
          projectId: project.id,
          milestoneTitle: activeMilestoneTitle,
          currentStepIndex,
          kickoffStep2SubWindow,
          completedChecklistIds,
          automatedOptInEmails,
          remainingSeconds,
          lastSavedAt: new Date().toISOString(),
        },
      };
      saveFocusSessions(next);
      return next;
    });
  }, [
    project?.id,
    activeMilestoneTitle,
    currentStepIndex,
    kickoffStep2SubWindow,
    completedChecklistIds,
    automatedOptInEmails,
    remainingSeconds,
    focusMode,
    sessionKey,
  ]);

  // Trigger 7-second banner whenever entering 'standard' or 'quext-vision' mode
  const prevModeRef = useRef<FocusModeType>(focusMode);
  useEffect(() => {
    const enteredFocus =
      (focusMode === 'standard' || focusMode === 'quext-vision') &&
      prevModeRef.current !== 'standard' &&
      prevModeRef.current !== 'quext-vision';
    prevModeRef.current = focusMode;

    if (enteredFocus) {
      setShowSilenceBanner(true);
      setSilenceBannerSecondsLeft(7);
    }
  }, [focusMode]);

  useEffect(() => {
    if (!showSilenceBanner) return;
    const interval = setInterval(() => {
      setSilenceBannerSecondsLeft((prev) => {
        if (prev <= 1) {
          setShowSilenceBanner(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showSilenceBanner]);

  // 21-Minute Session Countdown Interval
  useEffect(() => {
    if (focusMode !== 'standard' && focusMode !== 'quext-vision') return;
    if (isSessionExpiredModalOpen || isEndSessionModalOpen) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsSessionExpiredModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [focusMode, isSessionExpiredModalOpen, isEndSessionModalOpen]);

  // Track edits made in Standard Focus Mode automatically in the background
  const markChecklistCompleted = (id: string) => {
    setCompletedChecklistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Wrapper around onUpdateProject to detect background checklist completion in Standard Focus Mode
  const handleTrackedUpdateProject = (updated: OperationProject) => {
    if (project) {
      const prevIntake = project.customerIntake;
      const nextIntake = updated.customerIntake;
      if ((nextIntake?.staffRoles?.length || 0) > (prevIntake?.staffRoles?.length || 0)) {
        markChecklistCompleted('kickoff_step_1');
      }
      if ((nextIntake?.commonAreaDoors?.length || 0) !== (prevIntake?.commonAreaDoors?.length || 0)) {
        markChecklistCompleted('kickoff_step_3');
      }
      if (
        updated.useNfcWallet !== project.useNfcWallet ||
        updated.useQrIntercom !== project.useQrIntercom
      ) {
        markChecklistCompleted('kickoff_step_6');
      }
      if (nextIntake?.sitePlanPdfName !== prevIntake?.sitePlanPdfName) {
        markChecklistCompleted('kickoff_step_7');
      }
      if (
        JSON.stringify(updated.shippingDockItems) !== JSON.stringify(project.shippingDockItems)
      ) {
        markChecklistCompleted('product_acq_step_1');
      }
      if (JSON.stringify(updated.sowForecastItems) !== JSON.stringify(project.sowForecastItems)) {
        markChecklistCompleted('csm_intro_step_1');
      }
      if (JSON.stringify(updated.bomItems) !== JSON.stringify(project.bomItems)) {
        markChecklistCompleted('implementation_step_1');
      }
    }
    onUpdateProject(updated);
  };

  if (!project) return null;

  const checklistItems = evaluateMilestoneChecklist(
    project,
    activeMilestoneTitle,
    completedChecklistIds
  );
  const completedCount = checklistItems.filter((i) => i.isCompleted).length;
  const remainingItems = checklistItems.filter((i) => !i.isCompleted);
  const checklistPct =
    checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : 100;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleRequestEndFocusSession = () => {
    setConfirmUnfinishedItemsChecked(remainingItems.length === 0);
    setIsEndSessionModalOpen(true);
  };

  const handleConfirmEndFocusSession = () => {
    setIsEndSessionModalOpen(false);
    setFocusMode('none');
  };

  // ============================================================================
  // INITIAL POP-UP WINDOW (Triggered immediately after 10 clicks in 5 seconds)
  // ============================================================================
  if (focusMode === 'initial-prompt') {
    const hasSavedProgress =
      currentSaved &&
      (currentSaved.currentStepIndex > 0 || currentSaved.completedChecklistIds.length > 0);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="bg-white border-2 border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Green Accent Top Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#01C38D] to-teal-500" />

          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center shrink-0">
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    maskImage: "url('/assets/aistudio/Quext_Vision_2d7a50c8.png')",
                    WebkitMaskImage: "url('/assets/aistudio/Quext_Vision_2d7a50c8.png')",
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    backgroundColor: '#702082',
                  }}
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                  21-Minute Productivity Session Unlocked
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                  Quext Focus Mode Activated
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFocusMode('none')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            Select the project you are working on below and choose how you would like to run your{' '}
            <strong>21-minute distraction-free focus session</strong>. Your progress is automatically saved so you can pick up right where you left off at any time.
          </p>

          {/* Project Selector */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl mb-6 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800">
              Project in Focus:
            </label>
            <select
              value={project.id}
              onChange={(e) => onSelectProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {projects.map((p) => {
                const ms = getActiveMilestoneForProject(p);
                const key = `${p.id}__${ms}`;
                const saved = savedSessions[key];
                const resumeLabel =
                  saved && (saved.currentStepIndex > 0 || saved.completedChecklistIds.length > 0)
                    ? ` ↺ (Resume Step ${saved.currentStepIndex + 1})`
                    : '';
                return (
                  <option key={p.id} value={p.id}>
                    {p.propertyName} — Current Milestone: {ms}
                    {resumeLabel}
                  </option>
                );
              })}
            </select>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-1">
              <span>
                Active Milestone:{' '}
                <strong className="text-emerald-900 font-bold">{activeMilestoneTitle}</strong>
              </span>
              {hasSavedProgress && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px]">
                  Saved session found — will resume where you left off!
                </span>
              )}
            </div>
          </div>

          {/* Two Required Mode Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setFocusMode('standard')}
              className="flex flex-col items-start justify-between p-4 rounded-xl border-2 border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-slate-500 group-hover:text-emerald-700 mb-1">
                  Standard Focus Mode
                </div>
                <div className="text-sm font-extrabold text-slate-900 leading-snug">
                  &ldquo;I know what I need to do outta my way.&rdquo;
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Removes all navigation bars and irrelevant links, applies the productivity green tint, and tracks your milestone checklist in the background.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFocusMode('quext-vision')}
              className="flex flex-col items-start justify-between p-4 rounded-xl border-2 border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white text-left transition-all cursor-pointer shadow-md"
            >
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-100 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Guided Step-by-Step Flow
                </div>
                <div className="text-base font-extrabold text-white leading-snug">
                  &ldquo;Use Quext Vision&rdquo;
                </div>
              </div>
              <p className="text-[11px] text-emerald-50 mt-2.5 leading-relaxed">
                Clears the screen to a minimal project view and progresses you one pop-up window at a time through the current milestone&rsquo;s checklist.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-white text-slate-900 font-['Inter']">
      {/* Subtle Opaque Green Tint to the Entire Site to Promote Productivity (Part 1 & Part 3) */}
      <div
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-500"
        style={{
          backgroundColor: 'rgba(16, 185, 129, 0.085)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Temporary 7-Second Silence & Turn Off Notifications Banner (Part 3, Rule 2) */}
      {showSilenceBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[94%] bg-slate-900 text-white border-2 border-emerald-400 rounded-2xl p-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
                <BellOff className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <span>Deep Focus Environment Check</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/30 rounded text-[10px] font-mono">
                    {silenceBannerSecondsLeft}s
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                  Please turn off notifications on your devices and silence the volume on your computer as well.
                </p>
              </div>
            </div>
            <VolumeX className="w-6 h-6 text-emerald-400 shrink-0 hidden sm:block" />
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
              style={{ width: `${(silenceBannerSecondsLeft / 7) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Top Focus Mode Control Bar (Minimal Project Context + 21-Min Timer + End Focus Session Button) */}
      <div className="sticky top-0 z-30 bg-emerald-950 text-white border-b border-emerald-800 shadow-sm">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {focusMode === 'quext-vision' ? 'Quext Vision Mode' : 'Standard Focus Mode'}
            </span>

            <select
              value={project.id}
              onChange={(e) => onSelectProjectId(e.target.value)}
              className="bg-emerald-900/80 border border-emerald-700 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-400 truncate max-w-[220px] sm:max-w-xs"
              title="Focused Project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.propertyName} ({getActiveMilestoneForProject(p)})
                </option>
              ))}
            </select>

            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-200 font-medium">
              <span>Milestone:</span>
              <strong className="text-white font-bold">{activeMilestoneTitle}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Switch between Standard Focus and Quext Vision */}
            <button
              type="button"
              onClick={() =>
                setFocusMode(focusMode === 'quext-vision' ? 'standard' : 'quext-vision')
              }
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-100 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {focusMode === 'quext-vision'
                  ? 'Switch to Standard Focus'
                  : 'Use Quext Vision'}
              </span>
            </button>

            {/* 21-Minute Session Countdown Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-emerald-500/40 font-mono text-xs font-bold text-emerald-300"
              title="21-Minute Focus Session Timer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            {/* Required Button in Both Modes: "End Focus Session" */}
            <button
              type="button"
              onClick={handleRequestEndFocusSession}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 border border-rose-400/40 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>End Focus Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================================
          MODE 1: STANDARD FOCUS MODE
          Removes all navigation bars and links not relevant to the current project
         ============================================================================ */}
      {focusMode === 'standard' && (
        <main className="max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <ProjectDetailView
            project={project}
            quotesList={quotesList}
            onUpdateProject={handleTrackedUpdateProject}
            // Omit onBackToDashboard and onViewQuoteAnalysis so irrelevant external links are removed!
          />
        </main>
      )}

      {/* ============================================================================
          MODE 2: QUEXT VISION MODE
          White screen with subtle green opaque tint + Single minimal representation
          of the project + One-by-one milestone pop-up windows
         ============================================================================ */}
      {focusMode === 'quext-vision' && (
        <main className="min-h-[calc(100vh-3.5rem)] bg-white flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl w-full space-y-6">
            {/* Single Minimal-Looking Representation of the Project They Are Working On */}
            <MinimalProjectRepresentationCard
              project={project}
              activeMilestoneTitle={activeMilestoneTitle}
              onUpdateProject={handleTrackedUpdateProject}
              currentStepIndex={currentStepIndex}
              totalSteps={checklistItems.length}
            />

            {/* Active Pop-Up Window for the Current Milestone Step */}
            <QuextVisionStepWindow
              project={project}
              activeMilestoneTitle={activeMilestoneTitle}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              kickoffStep2SubWindow={kickoffStep2SubWindow}
              setKickoffStep2SubWindow={setKickoffStep2SubWindow}
              automatedOptInEmails={automatedOptInEmails}
              setAutomatedOptInEmails={setAutomatedOptInEmails}
              markChecklistCompleted={markChecklistCompleted}
              onUpdateProject={handleTrackedUpdateProject}
              onRequestEndSession={handleRequestEndFocusSession}
            />
          </div>
        </main>
      )}

      {/* ============================================================================
          21-MINUTE SESSION EXPIRY MODAL (Part 1)
          "at the end give the option to stay in this mode or return to the normal mode of the site"
         ============================================================================ */}
      {isSessionExpiredModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  21-Minute Session Complete
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Focus Session Time Reached
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your 21-minute focus session for <strong>{project.propertyName}</strong> ({activeMilestoneTitle}) has finished. Your progress has been saved automatically. Would you like to stay in Focus Mode or return to the normal mode of the site?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSessionExpiredModalOpen(false);
                  setRemainingSeconds(TWENTY_ONE_MINUTES_SECONDS);
                  setFocusMode('none');
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                Return to Normal Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSessionExpiredModalOpen(false);
                  setRemainingSeconds(TWENTY_ONE_MINUTES_SECONDS);
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Stay in Focus Mode (+21 Min)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          END FOCUS SESSION — BACKGROUND CHECKLIST PROGRESS & CONFIRMATION MODAL (Part 2)
          "when they end their session with the button 'End Focus Session'. Present their
           progress against the checklist completion and ask them to confirm the items
           left on the checklist do not need to be completed at this time."
         ============================================================================ */}
      {isEndSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Milestone Checklist Audit · {activeMilestoneTitle}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                  Focus Session Progress Summary
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Project: <strong className="text-slate-800">{project.propertyName}</strong> · Saved at Step {currentStepIndex + 1} of {checklistItems.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEndSessionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Completion Bar */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Checklist Completion for {activeMilestoneTitle}
                </span>
                <span className="font-mono font-extrabold text-emerald-700">
                  {completedCount} / {checklistItems.length} Completed ({checklistPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${checklistPct}%` }}
                />
              </div>
            </div>

            {/* Completed vs Remaining Items List */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Milestone Checklist Status:
              </div>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      item.isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{item.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{item.description}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        item.isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {item.isCompleted ? 'Completed' : 'Remaining'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Requirement for Unfinished Items */}
            {remainingItems.length > 0 ? (
              <label className="flex items-start gap-2.5 p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl cursor-pointer text-xs text-amber-950">
                <input
                  type="checkbox"
                  checked={confirmUnfinishedItemsChecked}
                  onChange={(e) => setConfirmUnfinishedItemsChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-amber-400 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold leading-relaxed">
                  I confirm that the <strong>{remainingItems.length} remaining item(s)</strong> left on the checklist for{' '}
                  <strong>{activeMilestoneTitle}</strong> do not need to be completed at this time. (Your current spot will be remembered so you can continue where you left off later.)
                </span>
              </label>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All checklist items for {activeMilestoneTitle} have been completed!</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEndSessionModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Continue Focus Session
              </button>

              <button
                type="button"
                disabled={remainingItems.length > 0 && !confirmUnfinishedItemsChecked}
                onClick={handleConfirmEndFocusSession}
                className={`px-5 py-2 text-xs font-extrabold rounded-xl shadow-xs transition-all ${
                  remainingItems.length > 0 && !confirmUnfinishedItemsChecked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                Confirm &amp; Return to Normal Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MINIMAL PROJECT REPRESENTATION CARD (Part 2: "create a single minimal-looking
// representation of the project they are working on")
// ============================================================================
const MinimalProjectRepresentationCard: React.FC<{
  project: OperationProject;
  activeMilestoneTitle: string;
  onUpdateProject: (updated: OperationProject) => void;
  currentStepIndex: number;
  totalSteps: number;
}> = ({ project, activeMilestoneTitle, onUpdateProject, currentStepIndex, totalSteps }) => {
  const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalInstalled = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
  const pct = totalQuoted > 0 ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100)) : 0;

  const handleSelectActiveMilestone = (newTitle: string) => {
    const updatedMilestones = project.milestones.map((m) => {
      if (m.title === newTitle) {
        return { ...m, status: 'In Progress' as const };
      }
      if (m.status === 'In Progress') {
        return { ...m, status: 'Completed' as const };
      }
      return m;
    });
    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white border-2 border-emerald-600/30 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 rounded">
              Quext Vision Focus Card
            </span>
            <span className="text-xs font-mono text-slate-500">Quote #{project.quoteNumber}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                project.statusTag === 'On Track'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : project.statusTag === 'Behind Schedule'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              {project.statusTag}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
            {project.propertyName}
          </h1>
          <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
            <span>{project.clientName}</span>
            <span>·</span>
            <span>
              {project.city}, {project.state}
            </span>
            <span>·</span>
            <span className="font-mono font-semibold">{project.unitsCount} Units</span>
            <span>·</span>
            <span>
              PM: <strong className="text-slate-900">{project.assignedPM.name}</strong>
            </span>
          </div>
        </div>

        {/* Active Milestone Selector & Deployment Progress */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Current Milestone:</span>
            <select
              value={activeMilestoneTitle}
              onChange={(e) => handleSelectActiveMilestone(e.target.value)}
              className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-extrabold text-emerald-950 focus:outline-none focus:border-emerald-600"
            >
              {project.milestones
                .filter((m) => !m.title.toLowerCase().includes('closed'))
                .map((m) => (
                  <option key={m.id} value={m.title}>
                    {m.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-mono">
              Hardware Deployment: <strong className="text-slate-900">{pct}%</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-bold text-emerald-800">
              Window {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUEXT VISION STEP-BY-STEP POP-UP WINDOWS PER MILESTONE (Part 4)
// "Don’t display the entire checklist; this is for the site to keep track of in
//  the background. Just display each window as indicated below per milestone."
// ============================================================================
const QuextVisionStepWindow: React.FC<{
  project: OperationProject;
  activeMilestoneTitle: string;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  kickoffStep2SubWindow: boolean;
  setKickoffStep2SubWindow: (val: boolean) => void;
  automatedOptInEmails: string[];
  setAutomatedOptInEmails: React.Dispatch<React.SetStateAction<string[]>>;
  markChecklistCompleted: (id: string) => void;
  onUpdateProject: (updated: OperationProject) => void;
  onRequestEndSession: () => void;
}> = ({
  project,
  activeMilestoneTitle,
  currentStepIndex,
  setCurrentStepIndex,
  kickoffStep2SubWindow,
  setKickoffStep2SubWindow,
  automatedOptInEmails,
  setAutomatedOptInEmails,
  markChecklistCompleted,
  onUpdateProject,
  onRequestEndSession,
}) => {
  const normMilestone = activeMilestoneTitle.toLowerCase();
  const intake = project.customerIntake || {
    pmsSoftware: 'Yardi',
    commonAreaDoors: [],
    staffRoles: [],
  };

  const [windowFeedback, setWindowFeedback] = useState<string | null>(null);

  // Step 1 (Project Kickoff) Contact Form state
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('Property Manager');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [useForAutomatedComms, setUseForAutomatedComms] = useState<boolean>(true);

  // Step 3 (Project Kickoff) New Door state
  const [newDoorName, setNewDoorName] = useState<string>('');
  const [newDoorArea, setNewDoorArea] = useState<string>('Main Clubhouse');

  // Step 4 (Project Kickoff) Customer PMS Reminder message
  const walkthroughUrl = buildCustomerKickoffPortalUrl(project.id);
  const [pmsCustomerMsg, setPmsCustomerMsg] = useState<string>(
    `Hi ${project.clientName} Team,\n\nHere is your direct Customer Kickoff Walkthrough link (${walkthroughUrl}). Please kindly complete the required steps for your chosen PMS integration (${intake.pmsSoftware || 'Yardi'}) so our engineering team can finalize your property synchronization.\n\nThank you,\n${project.assignedPM.name}`
  );

  // Step 5 (Project Kickoff) Internal Team PMS message
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>(
    `${project.assignedFieldTech || 'Hector Lopez'} (Integrations & Field Engineering)`
  );
  const [pmsTeamMsg, setPmsTeamMsg] = useState<string>(
    `Hi team, please finalize our internal API and credentials connection steps for the chosen PMS software (${intake.pmsSoftware || 'Yardi'}) on ${project.propertyName} (Quote #${project.quoteNumber}). Let me know once verified!`
  );

  // Step 7 (Project Kickoff) Site Plans Gateway message
  const [sitePlanMsg, setSitePlanMsg] = useState<string>(
    `Hi ${project.clientName} Team,\n\nPlease use the Customer Kickoff Walkthrough portal (${walkthroughUrl}) to upload your property Site Plans PDF. Before uploading, please confirm that you have edited the site plan documents to clearly mark and reflect the exact locations of the LoRaWAN Gateways needing to be installed on your site.\n\nThank you,\n${project.assignedPM.name}`
  );

  const showNotice = (msg: string) => {
    setWindowFeedback(msg);
    setTimeout(() => setWindowFeedback(null), 4500);
  };

  const defaultRecipient =
    automatedOptInEmails[0] ||
    intake.subscriberEmail ||
    intake.communityEmail ||
    intake.staffRoles?.[0]?.email ||
    'leasing@property.com';

  // Helper to append a CustomerCommsLog
  const appendCommsLog = (
    idPrefix: string,
    type: CustomerCommsLog['type'],
    recipient: string,
    subject: string,
    summary: string
  ) => {
    const newLog: CustomerCommsLog = {
      id: `${idPrefix}-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      type,
      recipientEmail: recipient,
      subject,
      summary,
      sentBy: project.assignedPM.name,
      status: 'Sent',
    };
    onUpdateProject({
      ...project,
      customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
      lastUpdated: new Date().toISOString(),
    });
  };

  // ==========================================================================
  // 1. PROJECT KICKOFF MILESTONE WINDOWS (7 Sequential Windows)
  // ==========================================================================
  if (normMilestone.includes('kickoff')) {
    const step = Math.min(Math.max(0, currentStepIndex), 6);

    return (
      <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
        {windowFeedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{windowFeedback}</span>
          </div>
        )}

        {/* WINDOW 1: Points of Contact */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 1 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Document Points of Contact for {project.propertyName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter the project points of contact (first and last name, individual&rsquo;s role, phone number, email) and check whether to use their email for the automated actions of the Customer Comms Control Panel.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
                const cleanEmail = email.trim();
                const newContact: StaffRoleSubmission = {
                  id: `staff-${Date.now()}`,
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  roleOrTitle: roleTitle.trim() || 'Property Contact',
                  permissionLevel: 'Manager',
                  phoneNumber: phone.trim() || '(555) 019-2834',
                  email: cleanEmail,
                };

                const nextOptIns = useForAutomatedComms
                  ? Array.from(new Set([...automatedOptInEmails, cleanEmail]))
                  : automatedOptInEmails;
                setAutomatedOptInEmails(nextOptIns);

                onUpdateProject({
                  ...project,
                  customerIntake: {
                    ...intake,
                    staffRoles: [...(intake.staffRoles || []), newContact],
                    subscriberEmail: useForAutomatedComms
                      ? cleanEmail
                      : intake.subscriberEmail || cleanEmail,
                    communityEmail: useForAutomatedComms
                      ? cleanEmail
                      : intake.communityEmail || cleanEmail,
                  },
                  lastUpdated: new Date().toISOString(),
                });

                markChecklistCompleted('kickoff_step_1');
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
                showNotice(
                  `Saved ${newContact.firstName} ${newContact.lastName} (${cleanEmail})${
                    useForAutomatedComms ? ' — Enrolled in Automated Customer Comms!' : ''
                  }`
                );
              }}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Jordan"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Alvarez"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Individual&rsquo;s Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Regional Property Manager"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (512) 555-0148"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jordan.alvarez@propertymanagement.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer text-emerald-950 font-semibold">
                <input
                  type="checkbox"
                  checked={useForAutomatedComms}
                  onChange={(e) => setUseForAutomatedComms(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-emerald-400 focus:ring-emerald-500"
                />
                <span>
                  Use this email for the automated actions of the Customer Comms Control Panel
                </span>
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Point of Contact</span>
                </button>
              </div>
            </form>

            {/* Documented Points of Contact List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">
                Documented Points of Contact ({(intake.staffRoles || []).length})
              </div>
              {(intake.staffRoles || []).length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No points of contact added yet. Add a contact above.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {(intake.staffRoles || []).map((c) => {
                    const isOptedIn = automatedOptInEmails.includes(c.email);
                    return (
                      <div
                        key={c.id}
                        className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {c.firstName} {c.lastName}
                          </span>{' '}
                          <span className="text-slate-500">
                            ({c.roleOrTitle || c.permissionLevel})
                          </span>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {c.email} · {c.phoneNumber}
                          </div>
                        </div>

                        <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isOptedIn}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAutomatedOptInEmails((prev) =>
                                checked
                                  ? Array.from(new Set([...prev, c.email]))
                                  : prev.filter((em) => em !== c.email)
                              );
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>Automated Comms Opt-In</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_1');
                  setKickoffStep2SubWindow(false);
                  setCurrentStepIndex(1);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <span>Close Window &amp; Open Next Pop-Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 2A & 2B: Send Customer Kickoff Walkthrough Document -> Send to Opted-In Contacts */}
        {step === 1 && !kickoffStep2SubWindow && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 2 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Send Customer Kickoff Walkthrough Document
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Click the button below to prepare and send the Customer Kickoff Walkthrough document to the customer contacts who have opted in for automated actions.
              </p>
            </div>

            <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center space-y-4">
              <FileText className="w-10 h-10 text-emerald-600 mx-auto" />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Customer Kickoff Walkthrough Portal Link
                </div>
                <div className="text-xs font-mono text-emerald-800 mt-1 break-all">
                  {walkthroughUrl}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKickoffStep2SubWindow(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Customer Kickoff Walkthrough Document</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(0)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(2)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                <span>Skip to Next Window</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 2B: New Window Allowing PM to Send to Opted-In Automated Contacts */}
        {step === 1 && kickoffStep2SubWindow && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 2 (Opted-In Automated Contacts)
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Dispatch Walkthrough to Automated Comms Opt-In Contacts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Review the contacts who have opted in for the automated actions of the Customer Comms Control Panel and dispatch the Kickoff Walkthrough document.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-slate-800">
                Contacts Opted In for Automated Actions:
              </div>
              {automatedOptInEmails.length === 0 ? (
                <div className="text-slate-500">
                  Default recipient: <strong className="font-mono">{defaultRecipient}</strong>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {automatedOptInEmails.map((em) => (
                    <span
                      key={em}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      {em}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setKickoffStep2SubWindow(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const recipients =
                    automatedOptInEmails.length > 0
                      ? automatedOptInEmails.join(', ')
                      : defaultRecipient;
                  appendCommsLog(
                    'focus-kickoff-walkthrough',
                    'kickoff_submission',
                    recipients,
                    `Customer Kickoff Walkthrough Document: ${project.propertyName}`,
                    `Dispatched Customer Kickoff Walkthrough link (${walkthroughUrl}) to opted-in automated comms contacts (${recipients}).`
                  );
                  markChecklistCompleted('kickoff_step_2');
                  setKickoffStep2SubWindow(false);
                  setCurrentStepIndex(2);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send to Opted-In Contacts &amp; Open Next Window</span>
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 3: Common Area Door Tree List in its entirety + Friendly Reminder Email */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 3 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Common Area Door Tree Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ensure the Common Area Door Tree is filled out. Review the entire Common Area Door Tree list for <strong>{project.propertyName}</strong> below, add or update doors, or send a friendly reminder email to the customer to fill this out for us.
              </p>
            </div>

            {/* Entire Common Area Door Tree Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-emerald-600" />
                  <span>
                    Complete Common Area Door Tree ({(intake.commonAreaDoors || []).length} Doors)
                  </span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {intake.doorsConfirmedByCustomer
                    ? '✓ Approved by Customer'
                    : 'Pending Customer Confirmation'}
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                {(intake.commonAreaDoors || []).length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No Common Area Doors entered yet. Add a door below or send a reminder email to the customer.
                  </div>
                ) : (
                  (intake.commonAreaDoors || []).map((door, idx) => (
                    <div
                      key={door.id}
                      className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400">#{idx + 1}</span>
                        <input
                          type="text"
                          value={door.doorName}
                          onChange={(e) => {
                            const updatedDoors = (intake.commonAreaDoors || []).map((d) =>
                              d.id === door.id ? { ...d, doorName: e.target.value } : d
                            );
                            onUpdateProject({
                              ...project,
                              customerIntake: { ...intake, commonAreaDoors: updatedDoors },
                              lastUpdated: new Date().toISOString(),
                            });
                          }}
                          className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{door.buildingOrArea || 'Common Area'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {door.installedStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Door Row */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newDoorName.trim()) return;
                  const newDoor: CommonAreaDoor = {
                    id: `door-${Date.now()}`,
                    doorName: newDoorName.trim(),
                    buildingOrArea: newDoorArea.trim() || 'Common Area',
                    installedStatus: 'Pending',
                  };
                  onUpdateProject({
                    ...project,
                    customerIntake: {
                      ...intake,
                      commonAreaDoors: [...(intake.commonAreaDoors || []), newDoor],
                    },
                    lastUpdated: new Date().toISOString(),
                  });
                  setNewDoorName('');
                  markChecklistCompleted('kickoff_step_3');
                }}
                className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs"
              >
                <input
                  type="text"
                  value={newDoorName}
                  onChange={(e) => setNewDoorName(e.target.value)}
                  placeholder="Add door name (e.g. Fitness Center Entry)..."
                  className="flex-1 min-w-[180px] px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newDoorArea}
                  onChange={(e) => setNewDoorArea(e.target.value)}
                  placeholder="Building / Area..."
                  className="w-40 px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                >
                  + Add Door
                </button>
              </form>
            </div>

            {/* Friendly Reminder Email Button */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <div className="font-bold">Need the customer to complete or confirm the Door Tree?</div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Sends a friendly email reminder with the Customer Kickoff link to {defaultRecipient}.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  appendCommsLog(
                    'focus-door-reminder',
                    'custom_email',
                    defaultRecipient,
                    `Friendly Reminder: Common Area Door Tree Naming for ${project.propertyName}`,
                    `Sent a friendly reminder email to ${defaultRecipient} to fill out and confirm the Common Area Door Tree list on the Customer Kickoff Walkthrough.`
                  );
                  markChecklistCompleted('kickoff_step_3');
                  showNotice(`Friendly Common Area Door Tree reminder email sent to ${defaultRecipient}!`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs shrink-0 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Friendly Door Tree Reminder Email</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_3');
                  setCurrentStepIndex(3);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <span>Close Window &amp; Open Next Pop-Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 4: Customer PMS Integration Completion & Walkthrough Link Email */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 4 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Customer PMS Integration Verification ({intake.pmsSoftware || 'Yardi'})
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ensure the PMS Integration has been completed by the customer. Share the Customer Kickoff Walkthrough link below and email the customer a kind reminder to complete their steps for their chosen PMS integration.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-700">Customer Kickoff Walkthrough Link:</span>
                  <div className="font-mono text-emerald-800 font-bold mt-0.5 break-all">
                    {walkthroughUrl}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(walkthroughUrl);
                    showNotice('Customer Kickoff Walkthrough link copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-700 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Walkthrough Link</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kind Reminder Message to Customer ({defaultRecipient}):
                </label>
                <textarea
                  rows={4}
                  value={pmsCustomerMsg}
                  onChange={(e) => setPmsCustomerMsg(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    appendCommsLog(
                      'focus-pms-customer',
                      'custom_email',
                      defaultRecipient,
                      `Kind Reminder: Complete ${intake.pmsSoftware || 'PMS'} Integration Steps for ${project.propertyName}`,
                      pmsCustomerMsg
                    );
                    markChecklistCompleted('kickoff_step_4');
                    showNotice(`Sent Walkthrough Link & PMS Integration reminder to ${defaultRecipient}!`);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Email Customer Link &amp; PMS Integration Reminder</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(2)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_4');
                  setCurrentStepIndex(4);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <span>Close Window &amp; Open Next Pop-Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 5: Internal Team PMS Connections (Slack or Email Team Member) */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 5 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Internal Team PMS Software Connection Check
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ensure that our internal Quext team has made the necessary connections for the chosen PMS Software (<strong>{intake.pmsSoftware || 'Yardi'}</strong>). Use the links below to Slack or Email a team member with the prefilled message.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Internal Quext Team Member:
                </label>
                <select
                  value={selectedTeamMember}
                  onChange={(e) => setSelectedTeamMember(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                >
                  {AVAILABLE_FIELD_TECHS.map((tech) => (
                    <option key={tech} value={`${tech} (Field & PMS Engineering)`}>
                      {tech} (Field &amp; PMS Engineering)
                    </option>
                  ))}
                  {AVAILABLE_PMS.map((pm) => (
                    <option key={pm.email} value={`${pm.name} (${pm.email})`}>
                      {pm.name} — {pm.role} ({pm.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prefilled Message to Team Member:
                </label>
                <textarea
                  rows={3}
                  value={pmsTeamMsg}
                  onChange={(e) => setPmsTeamMsg(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProject({
                      ...project,
                      teamAssists: [
                        {
                          id: `focus-pms-team-${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          loggedBy: project.assignedPM.name,
                          assistanceDetails: `[Slack Sent to ${selectedTeamMember}] ${pmsTeamMsg}`,
                          createdAt: new Date().toISOString(),
                        },
                        ...(project.teamAssists || []),
                      ],
                      lastUpdated: new Date().toISOString(),
                    });
                    markChecklistCompleted('kickoff_step_5');
                    showNotice(`Slack message dispatched to ${selectedTeamMember}!`);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Slack className="w-4 h-4" />
                  <span>Slack Team Member</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateProject({
                      ...project,
                      teamAssists: [
                        {
                          id: `focus-pms-team-${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          loggedBy: project.assignedPM.name,
                          assistanceDetails: `[Email Sent to ${selectedTeamMember}] ${pmsTeamMsg}`,
                          createdAt: new Date().toISOString(),
                        },
                        ...(project.teamAssists || []),
                      ],
                      lastUpdated: new Date().toISOString(),
                    });
                    markChecklistCompleted('kickoff_step_5');
                    showNotice(`Email dispatched to ${selectedTeamMember}!`);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Team Member</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(3)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_5');
                  setCurrentStepIndex(5);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <span>Close Window &amp; Open Next Pop-Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 6: NFC & QR Intercom Checkboxes + Button to Send Kickoff Doc to Update */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 6 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                NFC Wallet Upgrade &amp; QR Intercom Feature Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ensure that if the property is using NFC or the QR Intercom feature, the checkboxes below are selected for the project. You can also send the Customer Kickoff document to the customer to update if they are using either feature and have not yet filled it out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(project.useNfcWallet ?? intake.useNfcWallet)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onUpdateProject({
                      ...project,
                      useNfcWallet: checked,
                      customerIntake: {
                        ...intake,
                        useNfcWallet: checked,
                      },
                      lastUpdated: new Date().toISOString(),
                    });
                    markChecklistCompleted('kickoff_step_6');
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600"
                />
                <div className="text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Property is using NFC Wallet Upgrade</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    {intake.nfcCardArtPhotoName
                      ? `✓ Customer uploaded card art: ${intake.nfcCardArtPhotoName}`
                      : 'Card art photo not yet uploaded by customer on Kickoff doc.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(project.useQrIntercom ?? intake.useQrIntercom)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onUpdateProject({
                      ...project,
                      useQrIntercom: checked,
                      customerIntake: {
                        ...intake,
                        useQrIntercom: checked,
                      },
                      lastUpdated: new Date().toISOString(),
                    });
                    markChecklistCompleted('kickoff_step_6');
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600"
                />
                <div className="text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    <span>Property is using QR Intercom Feature</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    {intake.qrIntercomLogoName
                      ? `✓ Customer uploaded QR logo: ${intake.qrIntercomLogoName}`
                      : 'QR Intercom logo not yet uploaded by customer on Kickoff doc.'}
                  </p>
                </div>
              </label>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <div className="font-bold">
                  Not filled out by the customer yet?
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Send the Customer Kickoff Document to {defaultRecipient} to confirm &amp; upload their NFC / QR Intercom assets.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  appendCommsLog(
                    'focus-nfc-qr',
                    'custom_email',
                    defaultRecipient,
                    `Action Needed: Confirm NFC Wallet & QR Intercom Preferences for ${project.propertyName}`,
                    `Sent Customer Kickoff Document link (${walkthroughUrl}) to ${defaultRecipient} to confirm and update NFC Wallet / QR Intercom features.`
                  );
                  markChecklistCompleted('kickoff_step_6');
                  showNotice(`Customer Kickoff Document sent to ${defaultRecipient} to update NFC & QR Intercom!`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Kickoff Doc to Update NFC / QR Features</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(4)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_6');
                  setCurrentStepIndex(6);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <span>Close Window &amp; Open Next Pop-Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WINDOW 7: Site Plans for Gateway Location Confirmation */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Project Kickoff · Pop-Up Window 7 of 7
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                Site Plans for Gateway Location Confirmation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ensure the site plans for Gateway location confirmation have been provided by the customer. Send the customer a PDF file upload request for site plans and message them to confirm they have edited the documents they are uploading to reflect the locations of the gateways needing to be installed on their site.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-800">Current Site Plan PDF Status: </span>
                  {intake.sitePlanPdfName ? (
                    <span className="font-mono font-bold text-emerald-700">
                      ✓ {intake.sitePlanPdfName} ({intake.sitePlanConfirmedEdited ? 'Locations Marked' : 'Pending Edit Confirmation'})
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      ⚠ Awaiting Customer Site Plan PDF Upload
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Message to Customer Confirming Gateway Locations Are Marked on Uploaded PDF:
                </label>
                <textarea
                  rows={4}
                  value={sitePlanMsg}
                  onChange={(e) => setSitePlanMsg(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    appendCommsLog(
                      'focus-siteplan-req',
                      'custom_email',
                      defaultRecipient,
                      `Site Plans PDF Upload & Gateway Location Confirmation: ${project.propertyName}`,
                      sitePlanMsg
                    );
                    markChecklistCompleted('kickoff_step_7');
                    showNotice(
                      `Sent Site Plans PDF upload link & Gateway location edit confirmation message to ${defaultRecipient}!`
                    );
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Customer Site Plan PDF Upload &amp; Gateway Confirmation Message</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(5)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Window</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markChecklistCompleted('kickoff_step_7');
                  onRequestEndSession();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Kickoff Checklist &amp; Review Session</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // 2. PORTAL BUILDOUT MILESTONE WINDOW
  // ==========================================================================
  if (normMilestone.includes('portal buildout')) {
    const missingItems: string[] = [];
    if (!intake.walkthroughCompleted) missingItems.push('Walkthrough Form Final Submission');
    if (!intake.pmsSoftware || intake.pmsSoftware === 'None') missingItems.push('PMS Software Selection');
    if (!intake.commonAreaDoors || intake.commonAreaDoors.length === 0) missingItems.push('Common Area Door Tree');
    if (!intake.staffRoles || intake.staffRoles.length === 0) missingItems.push('Staff Access Roster');
    if (!intake.sitePlanPdfName) missingItems.push('Site Plan Gateway Locations PDF');

    return (
      <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
        {windowFeedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{windowFeedback}</span>
          </div>
        )}

        <div className="border-b border-slate-200 pb-4">
          <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Portal Buildout Milestone · Pop-Up Window
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
            Finalize Customer Kickoff Document for Portal Buildout
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Send the Customer Kickoff document to the customer for them to finish finalizing the document if any items are not filled out on the form.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
          <div className="font-bold text-slate-800">
            Customer Kickoff Form Status Check:
          </div>
          {missingItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-semibold">
              ✓ All primary Customer Kickoff form sections have entries recorded. You can still send a finalization link below if updates are needed.
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-amber-800 font-semibold">
                Items not yet finalized on the Customer Kickoff form:
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {missingItems.map((m) => (
                  <li key={m} className="font-medium">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                appendCommsLog(
                  'focus-portal-finalize',
                  'kickoff_submission',
                  defaultRecipient,
                  `Action Required: Please Finalize Remaining Items on Customer Kickoff Document (${project.propertyName})`,
                  `Dispatched Customer Kickoff Walkthrough link (${walkthroughUrl}) to ${defaultRecipient} to finish finalizing remaining form items (${missingItems.join(', ') || 'Final Review'}).`
                );
                markChecklistCompleted('portal_buildout_step_1');
                showNotice(
                  `Sent Customer Kickoff Document to ${defaultRecipient} to finish finalizing the form!`
                );
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Customer Kickoff Document to Finish Finalizing Form</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 3. PRODUCT ACQUISITION MILESTONE WINDOW (Shipping Dock)
  // ==========================================================================
  if (normMilestone.includes('product acquisition')) {
    return (
      <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-fadeIn">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Product Acquisition Milestone · Pop-Up Window
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Review &amp; Update Shipping Dock
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Review and update integrator shipments in the Shipping Dock below and send shipment updates to the customer.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              markChecklistCompleted('product_acq_step_1');
              onRequestEndSession();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl cursor-pointer"
          >
            Mark Complete &amp; Finish
          </button>
        </div>

        <ShippingDockSection project={project} onUpdateProject={onUpdateProject} />
      </div>
    );
  }

  // ==========================================================================
  // 4. CSM INTRO - PRE-IMPLEMENTATION MILESTONE WINDOW (SOW Forecaster)
  // ==========================================================================
  if (normMilestone.includes('csm intro') || normMilestone.includes('pre-implementation')) {
    return (
      <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-fadeIn">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              CSM Intro - Pre-Implementation Milestone · Pop-Up Window
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Update SOW Forecaster &amp; Send Overview to Customer
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Update the SOW Forecaster section below and use the &ldquo;Send SOW Overview to Customer&rdquo; button to dispatch the overview.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              markChecklistCompleted('csm_intro_step_1');
              onRequestEndSession();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl cursor-pointer"
          >
            Mark Complete &amp; Finish
          </button>
        </div>

        <SOWForecasterSection project={project} onUpdateProject={onUpdateProject} />
      </div>
    );
  }

  // ==========================================================================
  // 5. IMPLEMENTATION MILESTONE WINDOW (Smart Community Bill of Materials BOM)
  // ==========================================================================
  if (normMilestone.includes('implementation')) {
    const handleUpdateInstalledCount = (itemId: string, newCount: number) => {
      const updatedItems = project.bomItems.map((item) =>
        item.id === itemId ? { ...item, installedCount: Math.max(0, newCount) } : item
      );
      markChecklistCompleted('implementation_step_1');
      onUpdateProject({
        ...project,
        bomItems: updatedItems,
        lastUpdated: new Date().toISOString(),
      });
    };

    const handleSaveRowLog = (
      itemId: string,
      newLog: Omit<InstallLogEntry, 'id'>,
      autoIncrementBOM: boolean
    ) => {
      const logEntry: InstallLogEntry = {
        ...newLog,
        id: `log-${Date.now()}`,
      };
      const updatedItems = project.bomItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            installedCount: autoIncrementBOM
              ? item.installedCount + newLog.quantityCompleted
              : item.installedCount,
            postItLogs: [logEntry, ...(item.postItLogs || [])],
          };
        }
        return item;
      });
      markChecklistCompleted('implementation_step_1');
      onUpdateProject({
        ...project,
        bomItems: updatedItems,
        installLogs: [logEntry, ...project.installLogs],
        lastUpdated: new Date().toISOString(),
      });
    };

    const handleUpdateThermostatBrand = (itemId: string, brand: ThermostatBrand) => {
      const updatedItems = project.bomItems.map((item) =>
        item.id === itemId ? { ...item, thermostatBrand: brand } : item
      );
      markChecklistCompleted('implementation_step_1');
      onUpdateProject({
        ...project,
        bomItems: updatedItems,
        lastUpdated: new Date().toISOString(),
      });
    };

    const handleToggleSparesDelivered = (itemId: string) => {
      const updatedItems = project.bomItems.map((item) =>
        item.id === itemId ? { ...item, sparesDelivered: !item.sparesDelivered } : item
      );
      markChecklistCompleted('implementation_step_1');
      onUpdateProject({
        ...project,
        bomItems: updatedItems,
        lastUpdated: new Date().toISOString(),
      });
    };

    return (
      <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-fadeIn">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Implementation Milestone · Pop-Up Window
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Smart Community Bill of Materials (BOM)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Update installed device quantities, spares delivery status, and installer field logs for <strong>{project.propertyName}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              markChecklistCompleted('implementation_step_1');
              onRequestEndSession();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl cursor-pointer"
          >
            Mark Complete &amp; Finish
          </button>
        </div>

        <BOMTable
          items={project.bomItems}
          allProjectLogs={project.installLogs}
          commonAreaDoors={project.customerIntake?.commonAreaDoors || []}
          projectIntegratorPartners={getProjectIntegratorPartners(project)}
          onUpdateInstalledCount={handleUpdateInstalledCount}
          onSaveRowLog={handleSaveRowLog}
          onUpdateThermostatBrand={handleUpdateThermostatBrand}
          onToggleSparesDelivered={handleToggleSparesDelivered}
        />
      </div>
    );
  }

  // ==========================================================================
  // 6. CSM HANDOFF MILESTONE WINDOW (Send CSM Handoff Communication)
  // ==========================================================================
  const csmName = project.assignedCSM || 'Nicole Franklin';

  return (
    <div className="bg-white border-2 border-emerald-600/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
      {windowFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{windowFeedback}</span>
        </div>
      )}

      <div className="border-b border-slate-200 pb-4">
        <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
          CSM Handoff Milestone · Pop-Up Window
        </span>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
          Send CSM Handoff Communication to Customer
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Send the official Customer Success Manager (CSM) Handoff communication introducing dedicated CSM <strong>{csmName}</strong> to <strong>{project.propertyName}</strong>.
        </p>
      </div>

      <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Dedicated CSM</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">{csmName}</div>
            <div className="text-[11px] text-slate-500">Quext Customer Success Organization</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Customer Recipient</div>
            <div className="text-sm font-extrabold text-emerald-900 font-mono mt-0.5">
              {defaultRecipient}
            </div>
            <div className="text-[11px] text-slate-500">Handoff Information Only (7-Day Auto-Close Active)</div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              appendCommsLog(
                'focus-csm-handoff',
                'csm_handoff_email',
                defaultRecipient,
                `Official Quext CSM Handoff Introduction: ${project.propertyName}`,
                `Sent official CSM Handoff communication introducing dedicated CSM (${csmName}) and post-deployment support transition details to ${defaultRecipient}. (Handoff info only).`
              );
              markChecklistCompleted('csm_handoff_step_1');
              showNotice(`Official CSM Handoff communication sent to ${defaultRecipient}!`);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send CSM Handoff Communication to Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
