import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  RotateCcw,
  MousePointerClick,
  Zap,
} from 'lucide-react';
import { OperationProject } from '../types';

export interface TutorialNavigationTarget {
  portal: 'operations' | 'field-tech' | 'partner-academy' | 'salesHub';
  operationsMainTab?: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis';
  operationsSubTab?: string;
  projectDetailTab?: 'field-bom' | 'customer-comms' | 'customer-kickoff';
  fieldTechName?: 'Sean Gates' | 'Hector Lopez';
  partnerShortName?: string;
}

export interface CompactTutorialStep {
  id: string;
  number: number;
  chapter: string;
  featureName: string;
  targetSelector: string;
  preferredPlacement?: 'bottom' | 'top' | 'left' | 'right';
  navigation: TutorialNavigationTarget;
  message: string;
  tryItOutPrompt?: string;
}

interface PMTutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (target: TutorialNavigationTarget) => void;
  projects: OperationProject[];
  currentPortal: 'operations' | 'field-tech' | 'partner-academy' | 'salesHub';
  currentOperationsMainTab?: string;
  currentOperationsSubTab?: string;
  currentStepIndex: number;
  onStepChange: (newIndex: number) => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export const PMTutorialGuide: React.FC<PMTutorialGuideProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  projects,
  currentPortal,
  currentOperationsMainTab,
  currentOperationsSubTab,
  currentStepIndex,
  onStepChange,
}) => {
  const primaryProject = projects[0] || {
    id: '33om1u0TTgW3MYKO2FhH',
    propertyName: 'Cortland Old Fourth Ward',
  };

  const COMPACT_STEPS: CompactTutorialStep[] = [
    {
      id: 'step-1-top-ops',
      number: 1,
      chapter: 'Navigation',
      featureName: 'Operations Tab',
      targetSelector: '[data-tutorial-id="top-nav-operations"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'This is your primary Operations hub. When deals in the Sales Hub reach "Deal Won", they are automatically provisioned here as active multi-family installation projects.',
      tryItOutPrompt: 'Click the Operations tab to test it and advance!',
    },
    {
      id: 'step-2-overview-subtab',
      number: 2,
      chapter: 'Dashboard',
      featureName: 'Installation Overview',
      targetSelector: '[data-tutorial-id="subnav-installation-overview"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'Your daily executive cockpit. Tracks total active projects, hardware units in-flight, go-live schedules, and velocity metrics across all communities.',
      tryItOutPrompt: 'Click Installation Overview to proceed to the horizon axis!',
    },
    {
      id: 'step-3-horizon-axis',
      number: 3,
      chapter: 'Executive View',
      featureName: 'Horizon Timeline Axis',
      targetSelector: '[data-tutorial-id="horizon-timeline-axis"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'Groups upcoming rollouts into 4 time buckets: +7 Days (immediate launch), +8–14 Days, +15–28 Days, and +29 Days & Beyond. Built for fast leadership pulse checks.',
      tryItOutPrompt: 'Click any zone card (+7 Days, 8–14 Days) to auto-advance!',
    },
    {
      id: 'step-4-spotlight-bar',
      number: 4,
      chapter: 'Carousel',
      featureName: 'Spotlight Bar & Scroller',
      targetSelector: '[data-tutorial-id="horizon-spotlight-bar"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'When multiple projects land on the same delivery date or window, use the ◀ and ▶ arrows here to cycle through properties before clicking "Open Project".',
      tryItOutPrompt: 'Click the ◀ or ▶ arrows in the spotlight bar to test the scroller!',
    },
    {
      id: 'step-5-rollout-btn',
      number: 5,
      chapter: 'Rail Toggle',
      featureName: 'Rollout Sequence Rail Button',
      targetSelector: '[data-tutorial-id="horizon-rollout-btn"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'The vertical chronological rollout countdown rail is minimized into this button on the tile to keep the screen clean. Click it to expand or collapse the sequence rail.',
      tryItOutPrompt: 'Click this button to toggle the Rollout Sequence rail!',
    },
    {
      id: 'step-6-all-projects-subtab',
      number: 6,
      chapter: 'Directory',
      featureName: 'All Projects Sub-Tab',
      targetSelector: '[data-tutorial-id="subnav-all-projects"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      message:
        'The master directory of every property installation. View total unit counts, assigned PMs, target go-live dates, and current milestone health tags.',
      tryItOutPrompt: 'Click All Projects to view the master directory!',
    },
    {
      id: 'step-7-all-projects-view',
      number: 7,
      chapter: 'Status Health',
      featureName: 'Project Health Tags & Search',
      targetSelector: '[data-tutorial-id="all-projects-container"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      message:
        'Filter by property name, client, or health tag: On Track (green), At Risk (amber), Blocked (red), or Critical Delay (rose). Clicking any row opens its 360° workspace.',
      tryItOutPrompt: 'Click on any project row to enter its workspace!',
    },
    {
      id: 'step-8-new-project-btn',
      number: 8,
      chapter: 'Provisioning',
      featureName: '+ New Project (Manual Button)',
      targetSelector: '[data-tutorial-id="create-manual-project-btn"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      message:
        'Use this button to manually spin up pilot rollouts, internal hardware lab staging, or retrofit contracts without needing an upstream CRM quote.',
      tryItOutPrompt: 'Click Next to learn about Kickoff Attention!',
    },
    {
      id: 'step-9-kickoff-queue',
      number: 9,
      chapter: 'Intake Queue',
      featureName: 'Kickoff Attention Queue',
      targetSelector: '[data-tutorial-id="subnav-kickoff-attention"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'kickoff-attention',
      },
      message:
        'Your high-priority follow-up list: houses newly won deals from Sales Hub awaiting client kickoff calls, initial SOW reviews, and contact alignment.',
      tryItOutPrompt: 'Click Kickoff Attention to inspect pending deals!',
    },
    {
      id: 'step-10-milestones-rail',
      number: 10,
      chapter: 'Milestones',
      featureName: '7-Milestone Progress Tracker',
      targetSelector: '[data-tutorial-id="milestones-tracker-rail"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Every project follows 7 strict milestones: Kickoff → Portal Buildout → Product Acquisition → CSM Intro → Implementation → CSM Handoff → Closed. Note: Projects on CSM Handoff auto-close after 7 days!',
      tryItOutPrompt: 'Click any milestone card right now to cycle its status!',
    },
    {
      id: 'step-11-bom-table',
      number: 11,
      chapter: 'Hardware BOM',
      featureName: 'Bill of Materials (BOM) Table',
      targetSelector: '[data-tutorial-id="hardware-bom-table"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Tracks required Smart Deadbolts (BLE & Apple Wallet), LoRaWAN Thermostats, Gateways, and Water Sensors. As field techs log installs, the "Installed Count" column updates live in real-time!',
      tryItOutPrompt: 'Click any row or note in the BOM table to test it!',
    },
    {
      id: 'step-12-shipping-dock',
      number: 12,
      chapter: 'Logistics',
      featureName: 'Shipping Dock & Pallet Manifests',
      targetSelector: '[data-tutorial-id="shipping-dock-section"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Tracks freight carriers (FedEx Freight, Old Dominion, Estes) and pallet shipments. Once verified on-site, click "Confirm Delivery" before sending installation crews.',
      tryItOutPrompt: 'Click anywhere in the Shipping Dock section to advance!',
    },
    {
      id: 'step-13-sow-mitigation',
      number: 13,
      chapter: 'Controls',
      featureName: 'SOW Forecaster & Risk Mitigation',
      targetSelector: '[data-tutorial-id="sow-and-mitigation-section"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Forecasts trade labor hours (door boring, low-voltage wiring, hub mounting) against budget. If supply chain or property delays arise, open the Mitigation Plan to log corrective action items.',
      tryItOutPrompt: 'Click anywhere in the SOW or Mitigation section to advance!',
    },
    {
      id: 'step-14-customer-comms',
      number: 14,
      chapter: 'Client Comms',
      featureName: 'Customer Comms & Kickoff Deck',
      targetSelector: '[data-tutorial-id="customer-comms-panel"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'customer-comms',
      },
      message:
        'Generate pre-formatted milestone email notifications to property stakeholders with one-click Gmail dispatch. Also includes the interactive Customer Kickoff slide deck for owner meetings.',
      tryItOutPrompt: 'Click anywhere in Customer Comms to advance!',
    },
    {
      id: 'step-15-field-tech-btn',
      number: 15,
      chapter: 'Field Access',
      featureName: 'Field Tech Portal Button',
      targetSelector: '[data-tutorial-id="subnav-field-tech-btn"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'This button lets PMs switch into the Field Tech Portal to inspect what our on-site technicians (Sean Gates & Hector Lopez) see on their mobile phones and tablets.',
      tryItOutPrompt: 'Click the Field Tech Portal button to enter the live field view!',
    },
    {
      id: 'step-16-field-tech-hub',
      number: 16,
      chapter: 'Field Portal',
      featureName: 'Field Tech Portal (Sean & Hector)',
      targetSelector: '[data-tutorial-id="field-tech-hub"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'field-tech',
        fieldTechName: 'Sean Gates',
      },
      message:
        'Built exclusively for Sean Gates & Hector Lopez. Optimized for walking hallways: unit checklists, 1-tap hardware toggles (Installed, In Progress, Blocked), and blocker photo logging that syncs instantly to your PM dock.',
      tryItOutPrompt: 'Click any community card or route to test it!',
    },
    {
      id: 'step-17-partner-academy',
      number: 17,
      chapter: 'Integrators',
      featureName: 'Partner Academy (Subcontractors)',
      targetSelector: '[data-tutorial-id="partner-academy-hub"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'partner-academy',
        partnerShortName: 'SKBM',
      },
      message:
        'Dedicated to third-party low-voltage integrators (SKBM, etc.). They have no access to internal Quext pricing or margins. Here they complete hardware certification exams and download project wiring prep bundles.',
      tryItOutPrompt: 'Click any course module or button to test it!',
    },
    {
      id: 'step-18-profile-menu',
      number: 18,
      chapter: 'Relaunch',
      featureName: 'Profile Menu (Tutorial Access)',
      targetSelector: '[data-tutorial-id="top-nav-profile-menu"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'Tutorial complete! You can re-open this guidance walkthrough at any time by clicking your profile avatar here and selecting "PM Onboarding Tutorial" directly below Workspace.',
      tryItOutPrompt: 'Click Finish to complete your onboarding tutorial!',
    },
  ];

  const safeStepIndex = Math.max(0, Math.min(currentStepIndex, COMPACT_STEPS.length - 1));
  const activeStep = COMPACT_STEPS[safeStepIndex];

  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
    arrowPlacement: 'top' | 'bottom' | 'left' | 'right';
    arrowOffset: number;
  }>({
    top: 100,
    left: 20,
    arrowPlacement: 'bottom',
    arrowOffset: 50,
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);
  const isAdvancingRef = useRef<boolean>(false);

  // Helper to safely find the element or a reliable fallback so the spotlight never disappears
  const resolveTargetElement = useCallback((selector: string): HTMLElement | null => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) return el;

    // Fallbacks if specific element isn't in DOM yet:
    if (selector.includes('horizon-spotlight-bar')) {
      return (
        (document.querySelector('[data-tutorial-id="horizon-spotlight-bar"]') as HTMLElement | null) ||
        (document.querySelector('[data-tutorial-id="horizon-timeline-axis"]') as HTMLElement | null)
      );
    }
    if (selector.includes('create-manual-project-btn')) {
      return (
        (document.querySelector('[data-tutorial-id="create-manual-project-btn"]') as HTMLElement | null) ||
        (document.querySelector('[data-tutorial-id="all-projects-container"]') as HTMLElement | null)
      );
    }
    if (selector.includes('subnav-')) {
      return (
        (document.querySelector(selector) as HTMLElement | null) ||
        (document.querySelector('[data-tutorial-id="operations-subnav-bar"]') as HTMLElement | null)
      );
    }
    return null;
  }, []);

  // Strictly clamp position within visible viewport so Next / Back is 100% ALWAYS accessible
  const updatePosition = useCallback(() => {
    if (!isOpen || isMinimized) return;
    const el = resolveTargetElement(activeStep.targetSelector);

    const popoverWidth = Math.min(340, window.innerWidth - 32);
    const measuredHeight = popoverRef.current?.offsetHeight;
    const popoverHeight = measuredHeight && measuredHeight > 80 ? measuredHeight : 310;
    const arrowGap = 12;

    const minTop = 16;
    const maxTop = Math.max(minTop, window.innerHeight - popoverHeight - 20);
    const minLeft = 16;
    const maxLeft = Math.max(minLeft, window.innerWidth - popoverWidth - 16);

    if (!el) {
      setTargetRect(null);
      // Safe fallback: anchored in visible bottom-right corner, 100% inside viewport
      setPopoverPos({
        top: maxTop,
        left: maxLeft,
        arrowPlacement: 'bottom',
        arrowOffset: 50,
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    });

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let placement: 'top' | 'bottom' | 'left' | 'right' = activeStep.preferredPlacement || 'bottom';

    // Auto-flip if not enough room
    if (placement === 'bottom') {
      if (spaceBelow < popoverHeight + 20 && spaceAbove >= popoverHeight + 20) {
        placement = 'top';
      }
    } else if (placement === 'top') {
      if (spaceAbove < popoverHeight + 20 && spaceBelow >= popoverHeight + 20) {
        placement = 'bottom';
      }
    }

    let top = 0;
    let left = 0;
    let arrowOffset = 50;

    if (placement === 'bottom') {
      top = rect.bottom + arrowGap;
      const targetCenter = rect.left + rect.width / 2;
      left = targetCenter - popoverWidth / 2;
      arrowOffset = Math.max(20, Math.min(popoverWidth - 20, targetCenter - left));

      // If bottom placement still overflows the viewport bottom fold, flip or clamp
      if (top + popoverHeight > window.innerHeight - 20) {
        if (rect.top - popoverHeight - arrowGap >= 16) {
          placement = 'top';
          top = rect.top - popoverHeight - arrowGap;
        } else {
          top = window.innerHeight - popoverHeight - 20;
        }
      }
    } else if (placement === 'top') {
      top = rect.top - popoverHeight - arrowGap;
      const targetCenter = rect.left + rect.width / 2;
      left = targetCenter - popoverWidth / 2;
      arrowOffset = Math.max(20, Math.min(popoverWidth - 20, targetCenter - left));

      if (top < 16) {
        if (rect.bottom + popoverHeight + arrowGap <= window.innerHeight - 20) {
          placement = 'bottom';
          top = rect.bottom + arrowGap;
        } else {
          top = 16;
        }
      }
    } else if (placement === 'right') {
      left = rect.right + arrowGap;
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      arrowOffset = 40;
    } else {
      left = rect.left - popoverWidth - arrowGap;
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      arrowOffset = 40;
    }

    // STRICT GUARANTEE: clamped inside viewport fold
    const clampTop = Math.max(minTop, Math.min(maxTop, top));
    const clampLeft = Math.max(minLeft, Math.min(maxLeft, left));

    setPopoverPos({
      top: clampTop,
      left: clampLeft,
      arrowPlacement: placement,
      arrowOffset: Math.max(24, Math.min(popoverWidth - 24, arrowOffset)),
    });
  }, [isOpen, isMinimized, activeStep, resolveTargetElement]);

  // Step transition with view navigation & smooth fade
  const goToStep = useCallback(
    (index: number) => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;

      const targetIndex = Math.max(0, Math.min(index, COMPACT_STEPS.length - 1));
      const targetStep = COMPACT_STEPS[targetIndex];

      setIsFading(true);

      setTimeout(() => {
        onStepChange(targetIndex);
        onNavigateToView(targetStep.navigation);

        let attempts = 0;
        const pollElement = () => {
          attempts++;
          const el = document.querySelector(targetStep.targetSelector) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            setTimeout(() => {
              updatePosition();
              setIsFading(false);
              isAdvancingRef.current = false;
            }, 180);
          } else if (attempts < 10) {
            setTimeout(pollElement, 60);
          } else {
            updatePosition();
            setIsFading(false);
            isAdvancingRef.current = false;
          }
        };

        setTimeout(pollElement, 80);
      }, 120);
    },
    [COMPACT_STEPS, onNavigateToView, onStepChange, updatePosition]
  );

  const handleNext = useCallback(() => {
    if (safeStepIndex < COMPACT_STEPS.length - 1) {
      goToStep(safeStepIndex + 1);
    } else {
      onClose();
    }
  }, [safeStepIndex, COMPACT_STEPS.length, goToStep, onClose]);

  const handlePrev = useCallback(() => {
    if (safeStepIndex > 0) {
      goToStep(safeStepIndex - 1);
    }
  }, [safeStepIndex, goToStep]);

  // AUTO-ADVANCE ON TARGET INTERACTION:
  // When user interacts with the spotlighted feature, advance to next step automatically!
  useEffect(() => {
    if (!isOpen || isFading) return;

    const el = resolveTargetElement(activeStep.targetSelector);
    if (!el) return;

    let triggered = false;
    const handleTargetClick = (e: MouseEvent) => {
      // Don't intercept clicks inside the popover itself!
      if ((e.target as HTMLElement)?.closest?.('[data-tutorial-popover="true"]')) {
        return;
      }

      if (triggered || isAdvancingRef.current) return;
      triggered = true;

      // Allow 260ms for element native action to execute first, then auto-advance!
      setTimeout(() => {
        handleNext();
      }, 260);
    };

    el.addEventListener('click', handleTargetClick, { capture: true });
    return () => {
      el.removeEventListener('click', handleTargetClick, { capture: true });
    };
  }, [isOpen, isFading, activeStep, handleNext, resolveTargetElement]);

  // Keyboard navigation support: ArrowRight / Enter = Next, ArrowLeft = Back, Escape = Close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Continuous position and spotlight tracking across all scroll containers & dynamic tab mounts
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    let attempts = 0;
    const findAndScroll = () => {
      attempts++;
      const el = resolveTargetElement(activeStep.targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        setTimeout(updatePosition, 100);
      } else if (attempts < 12) {
        setTimeout(findAndScroll, 70);
      } else {
        updatePosition();
      }
    };

    findAndScroll();

    let animFrame: number;
    let isRunning = true;
    const syncLoop = () => {
      if (!isRunning) return;
      updatePosition();
      animFrame = requestAnimationFrame(syncLoop);
    };
    animFrame = requestAnimationFrame(syncLoop);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, isMinimized, safeStepIndex, activeStep, updatePosition, resolveTargetElement]);

  if (!isOpen) return null;

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[100000] animate-bounce-short">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-950 hover:bg-black text-white rounded-full shadow-2xl border-2 border-blue-500 ring-4 ring-black/40 cursor-pointer transition-transform hover:scale-105"
        >
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-blue-300">
              PM Guide • Step {activeStep.number}/{COMPACT_STEPS.length}
            </div>
            <div className="text-xs font-bold truncate max-w-[150px]">
              {activeStep.featureName}
            </div>
          </div>
          <Maximize2 className="w-3.5 h-3.5 ml-1 text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99998] pointer-events-none">
      {/* 1. Backdrop Spotlight with Guaranteed Box-Shadow Cutout & Highlight Ring */}
      {targetRect ? (
        <div
          className="fixed pointer-events-none z-[99998] transition-opacity duration-150 ease-out"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            borderRadius: '10px',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.72)',
            opacity: isFading ? 0.35 : 1,
          }}
        >
          {/* Glowing Animated Spotlight Border directly around the real feature */}
          <div className="absolute inset-0 rounded-[10px] border-2 border-blue-500 ring-4 ring-blue-500/70 shadow-[0_0_30px_rgba(59,130,246,0.9)] animate-pulse" />
        </div>
      ) : (
        /* Fallback dark overlay while element is being scrolled into focus */
        <div
          className="fixed inset-0 pointer-events-none z-[99998] transition-opacity duration-200"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.70)' }}
        />
      )}

      {/* 2. Small, Space-Saving Message Window with Opaque Solid Borders & 100% Guaranteed Visibility */}
      <div
        ref={popoverRef}
        data-tutorial-popover="true"
        className={`fixed pointer-events-auto w-[90vw] max-w-[340px] max-h-[calc(100vh-32px)] flex flex-col bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] border-2 border-slate-900 ring-4 ring-slate-900/40 overflow-hidden z-[100000] transition-opacity duration-150 ease-in-out ${
          isFading ? 'opacity-90' : 'opacity-100'
        }`}
        style={{
          top: `${popoverPos.top}px`,
          left: `${popoverPos.left}px`,
        }}
      >
        {/* Directional Opaque Arrow */}
        {targetRect && popoverPos.arrowPlacement === 'bottom' && (
          <div
            className="absolute -top-2 w-4 h-4 bg-slate-950 rotate-45 border-t-2 border-l-2 border-slate-900 z-10"
            style={{ left: `${popoverPos.arrowOffset}px` }}
          />
        )}
        {targetRect && popoverPos.arrowPlacement === 'top' && (
          <div
            className="absolute -bottom-2 w-4 h-4 bg-slate-100 rotate-45 border-b-2 border-r-2 border-slate-900 z-10"
            style={{ left: `${popoverPos.arrowOffset}px` }}
          />
        )}

        {/* Compact Header: Deep Opaque Slate-950 */}
        <div className="bg-slate-950 text-white px-3 py-2 flex items-center justify-between gap-2 shrink-0 border-b-2 border-slate-800 select-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <span>Step {activeStep.number} of {COMPACT_STEPS.length}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 truncate">{activeStep.chapter}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Minimize to floating badge"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Exit tutorial (Esc)"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-200 w-full shrink-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(activeStep.number / COMPACT_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Compact Body: Explaining One Feature at a Time with Smooth Scroll Container */}
        <div className="p-3.5 space-y-2.5 text-xs text-slate-800 overflow-y-auto flex-1 min-h-0">
          {/* Feature Tag */}
          <div className="flex items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
              <span>{activeStep.featureName}</span>
            </span>

            {/* Interactive Indicator */}
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              <MousePointerClick className="w-2.5 h-2.5 text-emerald-600" />
              <span>Interactive</span>
            </span>
          </div>

          {/* Crisp Message (One Feature Explanation) */}
          <p className="text-[12px] leading-relaxed text-slate-700 font-normal">
            {activeStep.message}
          </p>

          {/* Try It Out Banner with Auto-Advance */}
          {activeStep.tryItOutPrompt && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-950 flex items-start gap-1.5 leading-snug font-medium shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 fill-amber-500" />
              <div>
                <strong className="text-amber-900 font-bold block">Try It Out!</strong>
                <span>{activeStep.tryItOutPrompt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer Controls with Opaque Border & 100% Guaranteed Visibility */}
        <div className="px-3 py-2 bg-slate-100 border-t-2 border-slate-200 flex items-center justify-between gap-2 shrink-0 select-none">
          <button
            type="button"
            onClick={() => goToStep(0)}
            title="Restart tutorial"
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeStepIndex === 0}
              onClick={handlePrev}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors ${
                safeStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 rounded-md text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{safeStepIndex === COMPACT_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
