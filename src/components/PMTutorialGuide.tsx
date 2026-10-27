import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Play,
  Pause,
  Clock,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { OperationProject } from '../types';

export interface TutorialNavigationTarget {
  portal: 'operations' | 'field-tech' | 'partner-academy' | 'salesHub' | 'productCatalog';
  operationsMainTab?: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis' | 'productCatalog';
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

  // Learning Mode: 'manual' (click step-by-step) vs 'auto' (7s automated progression)
  const [tutorialMode, setTutorialMode] = useState<'manual' | 'auto'>('manual');
  const [showModeModal, setShowModeModal] = useState<boolean>(true);
  const [autoLearnSecondsRemaining, setAutoLearnSecondsRemaining] = useState<number>(7);
  const [isAutoPaused, setIsAutoPaused] = useState<boolean>(false);

  // Reset mode modal when tutorial is newly opened
  useEffect(() => {
    if (isOpen) {
      setShowModeModal(true);
      setAutoLearnSecondsRemaining(7);
      setIsAutoPaused(false);
    }
  }, [isOpen]);

  const COMPACT_STEPS: CompactTutorialStep[] = useMemo(() => [
    {
      id: 'step-1-top-ops',
      number: 1,
      chapter: 'Operations Platform',
      featureName: 'Operations Hub',
      targetSelector: '[data-tutorial-id="top-nav-operations"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'Welcome to the PM Operations Hub! When deals in Sales Hub reach "Deal Won", they are automatically provisioned here as active multi-family smart community installation workspaces.',
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
        'Your daily executive cockpit. Tracks total active projects, hardware units in-flight, go-live commitments, and velocity metrics across all multi-family communities.',
      tryItOutPrompt: 'Click Installation Overview to proceed to the horizon axis!',
    },
    {
      id: 'step-3-horizon-axis',
      number: 3,
      chapter: 'Schedule Horizon',
      featureName: 'Horizon Delivery Axis & Spotlights',
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
      id: 'step-4-all-projects-subtab',
      number: 4,
      chapter: 'Project Directory',
      featureName: 'All Projects Directory & Health Tags',
      targetSelector: '[data-tutorial-id="subnav-all-projects"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      message:
        'The master directory of every property installation. View total unit counts, assigned PMs, target go-live dates, and live status tags: On Track (green), At Risk (amber), Blocked (red), or Critical Delay (rose).',
      tryItOutPrompt: 'Click All Projects to view the master directory!',
    },
    {
      id: 'step-5-new-project-btn',
      number: 5,
      chapter: 'Provisioning',
      featureName: '+ New Project Provisioning',
      targetSelector: '[data-tutorial-id="create-manual-project-btn"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      message:
        'Use this button to manually spin up pilot rollouts, internal hardware lab staging, or retrofit contracts without needing an upstream CRM sales quote. PMs can also search quotes directly by name within the creation modal.',
      tryItOutPrompt: 'Click Next to learn about Milestone 1: Kickoff!',
    },
    {
      id: 'step-6-kickoff-queue',
      number: 6,
      chapter: 'Milestone 1: Kickoff',
      featureName: 'Kickoff Attention Queue',
      targetSelector: '[data-tutorial-id="subnav-kickoff-attention"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'kickoff-attention',
      },
      message:
        'Milestone 1 Kickoff begins here. High-priority queue housing newly won deals from Sales Hub awaiting client kickoff calls, initial SOW reviews, and property stakeholder alignment.',
      tryItOutPrompt: 'Click Kickoff Attention to inspect pending deals!',
    },
    {
      id: 'step-7-customer-comms',
      number: 7,
      chapter: 'Milestone 1: Kickoff',
      featureName: 'Customer Comms & Kickoff Presentation Deck',
      targetSelector: '[data-tutorial-id="customer-comms-panel"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'customer-comms',
      },
      message:
        'Generate pre-formatted milestone email notifications to property stakeholders with 1-click Gmail dispatch. Includes the interactive 12-slide Customer Kickoff Presentation Deck for owner kickoff meetings.',
      tryItOutPrompt: 'Click anywhere in Customer Comms to advance!',
    },
    {
      id: 'step-8-milestones-rail',
      number: 8,
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
        'Every project moves through 7 strict milestones: 1. Kickoff → 2. Portal Buildout → 3. Product Acquisition → 4. CSM Intro → 5. Implementation → 6. CSM Handoff → 7. Closed. Note: Projects in CSM Handoff automatically close after 7 days!',
      tryItOutPrompt: 'Click any milestone card right now to cycle its status!',
    },
    {
      id: 'step-9-common-doors',
      number: 9,
      chapter: 'Milestone 2: Portal Buildout',
      featureName: 'Common Area Doors Location Tree',
      targetSelector: '[data-tutorial-id="common-doors-section"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'In Milestone 2 Portal Buildout, map every perimeter door, leasing office, package room, and amenity gate. Associate specific smart locks, reader controllers (RC11/RC15), and intercoms to door profiles.',
      tryItOutPrompt: 'Click anywhere in Common Area Doors to advance!',
    },
    {
      id: 'step-10-lock-finishes',
      number: 10,
      chapter: 'Milestone 2: Portal Buildout',
      featureName: 'Lock Finishes & Split Choices',
      targetSelector: '[data-tutorial-id="hardware-bom-table"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Click "🎨 Set Lock Finish" on lock items to configure Schlage BE467 / FE410, NDEB Series (properly matched to NDEB Lock Model & Type), or XE360, selecting Matte Black, Satin Nickel, or Aged Bronze with custom residential vs. amenity split finish distributions.',
      tryItOutPrompt: 'Click anywhere in the BOM table to advance!',
    },
    {
      id: 'step-11-product-catalog',
      number: 11,
      chapter: 'Milestone 3: Acquisition',
      featureName: 'myquext.com Product Catalog',
      targetSelector: '[data-tutorial-id="top-nav-product-catalog"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'productCatalog',
        operationsMainTab: 'productCatalog',
      },
      message:
        'Directly synced from myquext.com. Access the master product catalog for all IoT smart locks, thermostats, LoRaWAN gateways, sensors, and installation accessories with live MSRP and specifications.',
      tryItOutPrompt: 'Click Product Catalog to inspect hardware specifications!',
    },
    {
      id: 'step-12-bom-override',
      number: 12,
      chapter: 'Milestone 3: Acquisition',
      featureName: 'BOM Table & Secret BOM OVERRIDE',
      targetSelector: '[data-tutorial-id="hardware-bom-table"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Tracks quoted hardware vs. installed progress. Next to Quoted Hardware, clicking the invisible "BOM OVERIDE" button 7 times unlocks the red BOM OVERRIDE mode. PMs can add catalog items directly or delete line items with quote variance warnings and permanent audit logging.',
      tryItOutPrompt: 'Click anywhere in the BOM table to advance!',
    },
    {
      id: 'step-13-shipping-dock',
      number: 13,
      chapter: 'Milestone 4: Logistics',
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
        'Manage logistics with dispatch carriers including FedEx, UPS, Quext Local Delivery, Customer Pickup, Omega TMS, SAIA LTL Freight, and Old Dominion. Track pallet manifests and tracking numbers to confirm delivery on-site before deploying installers.',
      tryItOutPrompt: 'Click anywhere in the Shipping Dock section to advance!',
    },
    {
      id: 'step-14-product-acceptance',
      number: 14,
      chapter: 'Milestone 4: Logistics',
      featureName: 'Product Acceptance Portal & Sign-Off',
      targetSelector: '[data-tutorial-id="shipping-dock-section"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Generates a dedicated mobile link and QR code for on-site property staff to inspect pallets, upload photos of any damaged boxes, and provide a digital signature confirming delivered inventory.',
      tryItOutPrompt: 'Click anywhere in the Shipping Dock section to advance!',
    },
    {
      id: 'step-15-sow-diy',
      number: 15,
      chapter: 'Milestone 5: Implementation',
      featureName: 'SOW Forecaster & DIY Integrator Mode',
      targetSelector: '[data-tutorial-id="sow-and-mitigation-section"]',
      preferredPlacement: 'top',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Forecasts trade labor hours (door boring, low-voltage wiring, hub mounting) against budget. If the property self-installs, toggle the DIY Partner Integrator tag: 0 SOW entries are required, and the project displays the DIY tag.',
      tryItOutPrompt: 'Click anywhere in the SOW section to advance!',
    },
    {
      id: 'step-16-field-tech',
      number: 16,
      chapter: 'Milestone 5: Implementation',
      featureName: 'Field Tech Mobile Hub (Sean & Hector)',
      targetSelector: '[data-tutorial-id="field-tech-hub"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'field-tech',
        fieldTechName: 'Sean Gates',
      },
      message:
        'Built exclusively for Sean Gates & Hector Lopez. Optimized for mobile hallway walking: unit checklists, 1-tap hardware status toggles (Installed, In Progress, Blocked), and blocker photo capture syncing live to your PM dashboard.',
      tryItOutPrompt: 'Click any community card or route to test it!',
    },
    {
      id: 'step-17-partner-academy',
      number: 17,
      chapter: 'Milestone 6: Certified Partners',
      featureName: 'Partner Academy (Subcontractor Integrators)',
      targetSelector: '[data-tutorial-id="partner-academy-hub"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'partner-academy',
        partnerShortName: 'SKBM',
      },
      message:
        'Dedicated to certified subcontractor integrators (SKBM, etc.). They access door templates (NDEB1/2, BE467, FE410, XE360), FDR reset guides, and certification exams with zero access to internal Quext pricing or margins.',
      tryItOutPrompt: 'Click any course module or button to test it!',
    },
    {
      id: 'step-18-csm-handoff',
      number: 18,
      chapter: 'Milestone 7: Handoff & Closed',
      featureName: 'CSM Handoff & 7-Day Auto-Close',
      targetSelector: '[data-tutorial-id="milestones-tracker-rail"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      message:
        'Milestone 7: Transitions the completed community to Customer Success (Nicole Franklin). Once CSM handoff communications are dispatched, the project is scheduled for automated closure in 7 days!',
      tryItOutPrompt: 'Click Next for the final wrap-up!',
    },
    {
      id: 'step-19-profile-menu',
      number: 19,
      chapter: 'Certification Complete',
      featureName: 'Profile Menu (Replay Training)',
      targetSelector: '[data-tutorial-id="top-nav-profile-menu"]',
      preferredPlacement: 'bottom',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      message:
        'Congratulations! You\'ve completed the PM Onboarding Tutorial across all 7 project milestones. Re-launch this training anytime in Manual or Auto Learn mode by clicking your profile avatar here.',
      tryItOutPrompt: 'Click Finish to complete your onboarding tutorial!',
    },
  ], [primaryProject.id]);

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

  const prevTargetRectRef = useRef<ElementRect | null>(null);
  const prevPopoverPosRef = useRef<{
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

  const safeStepIndexRef = useRef(safeStepIndex);
  safeStepIndexRef.current = safeStepIndex;

  const goToStepRef = useRef<(idx: number) => void>(() => {});
  const onCloseRef = useRef<() => void>(() => {});
  onCloseRef.current = onClose;

  // Helper to safely find the element or a reliable fallback so the spotlight never disappears
  const resolveTargetElement = useCallback((selector: string): HTMLElement | null => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) return el;

    // Fallbacks if specific element isn't in DOM yet:
    if (selector.includes('top-nav-product-catalog')) {
      return (
        (document.querySelector('[data-tutorial-id="top-nav-product-catalog"]') as HTMLElement | null) ||
        (document.querySelector('[data-tutorial-id="top-nav-operations"]') as HTMLElement | null)
      );
    }
    if (selector.includes('common-doors-section')) {
      return (
        (document.querySelector('[data-tutorial-id="common-doors-section"]') as HTMLElement | null) ||
        (document.querySelector('[data-tutorial-id="hardware-bom-table"]') as HTMLElement | null)
      );
    }
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
    if (!isOpen || isMinimized || showModeModal) return;
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
      if (prevTargetRectRef.current !== null) {
        prevTargetRectRef.current = null;
        setTargetRect(null);
      }
      if (
        prevPopoverPosRef.current.top !== maxTop ||
        prevPopoverPosRef.current.left !== maxLeft ||
        prevPopoverPosRef.current.arrowPlacement !== 'bottom'
      ) {
        const nextPos = {
          top: maxTop,
          left: maxLeft,
          arrowPlacement: 'bottom' as const,
          arrowOffset: 50,
        };
        prevPopoverPosRef.current = nextPos;
        setPopoverPos(nextPos);
      }
      return;
    }

    const rect = el.getBoundingClientRect();
    if (
      !prevTargetRectRef.current ||
      Math.abs(prevTargetRectRef.current.top - rect.top) > 1 ||
      Math.abs(prevTargetRectRef.current.left - rect.left) > 1 ||
      Math.abs(prevTargetRectRef.current.width - rect.width) > 1 ||
      Math.abs(prevTargetRectRef.current.height - rect.height) > 1
    ) {
      const nextRect: ElementRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      };
      prevTargetRectRef.current = nextRect;
      setTargetRect(nextRect);
    }

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
    const finalArrowOffset = Math.max(24, Math.min(popoverWidth - 24, arrowOffset));

    if (
      Math.abs(prevPopoverPosRef.current.top - clampTop) > 1 ||
      Math.abs(prevPopoverPosRef.current.left - clampLeft) > 1 ||
      prevPopoverPosRef.current.arrowPlacement !== placement ||
      Math.abs(prevPopoverPosRef.current.arrowOffset - finalArrowOffset) > 1
    ) {
      const nextPos = {
        top: clampTop,
        left: clampLeft,
        arrowPlacement: placement,
        arrowOffset: finalArrowOffset,
      };
      prevPopoverPosRef.current = nextPos;
      setPopoverPos(nextPos);
    }
  }, [isOpen, isMinimized, showModeModal, activeStep, resolveTargetElement]);

  // Step transition with view navigation & smooth fade
  const goToStep = useCallback(
    (index: number) => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;
      // Auto-release lock after max 800ms
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 800);

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
  goToStepRef.current = goToStep;

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

  const handleStartMode = (mode: 'manual' | 'auto') => {
    setTutorialMode(mode);
    setShowModeModal(false);
    setAutoLearnSecondsRemaining(7);
    setIsAutoPaused(false);
    goToStep(0);
  };

  // Auto Learn: 7 seconds per step automated progression
  useEffect(() => {
    if (!isOpen || showModeModal || isMinimized || tutorialMode !== 'auto' || isAutoPaused) {
      return;
    }

    const timer = setInterval(() => {
      setAutoLearnSecondsRemaining((prev) => {
        const nextVal = prev - 1;
        if (nextVal <= 0) {
          const currentIndex = safeStepIndexRef.current;
          if (currentIndex < COMPACT_STEPS.length - 1) {
            goToStepRef.current(currentIndex + 1);
          } else {
            onCloseRef.current();
          }
          return 7;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, showModeModal, isMinimized, tutorialMode, isAutoPaused, COMPACT_STEPS.length]);

  // When step changes, reset auto-learn timer to 7
  useEffect(() => {
    setAutoLearnSecondsRemaining(7);
  }, [safeStepIndex]);

  // AUTO-ADVANCE ON TARGET INTERACTION:
  // When user interacts with the spotlighted feature, advance to next step automatically!
  useEffect(() => {
    if (!isOpen || showModeModal || isFading) return;

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
  }, [isOpen, showModeModal, isFading, activeStep, handleNext, resolveTargetElement]);

  // Keyboard navigation support: ArrowRight / Enter = Next, ArrowLeft = Back, Escape = Close, Space = Pause/Resume Auto
  useEffect(() => {
    if (!isOpen || showModeModal) return;

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
      } else if (e.key === ' ' && tutorialMode === 'auto') {
        e.preventDefault();
        setIsAutoPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showModeModal, tutorialMode, handleNext, handlePrev, onClose]);

  // Continuous position and spotlight tracking across all scroll containers & dynamic tab mounts
  useEffect(() => {
    if (!isOpen || isMinimized || showModeModal) return;

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
    let frameCount = 0;
    const syncLoop = () => {
      if (!isRunning) return;
      updatePosition();
      frameCount++;
      if (frameCount < 45) {
        animFrame = requestAnimationFrame(syncLoop);
      }
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
  }, [isOpen, isMinimized, showModeModal, safeStepIndex, activeStep, updatePosition, resolveTargetElement]);

  if (!isOpen) return null;

  // Mode Selection Modal (Shown when launching tutorial)
  if (showModeModal) {
    return (
      <div className="fixed inset-0 z-[100010] pointer-events-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-slate-900 animate-scaleUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-5 text-center relative border-b border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Exit Tutorial"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-blue-500/30">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight">PM Onboarding Tutorial</h2>
            <p className="text-xs text-blue-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
              Master the end-to-end multi-family smart community lifecycle across all 7 project milestones.
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="p-5 space-y-3.5 bg-slate-50/50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Your Learning Mode:
            </div>

            {/* Option 1: Manual Step-by-Step */}
            <button
              type="button"
              onClick={() => handleStartMode('manual')}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition-all shadow-xs hover:shadow-md group block"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                      Manual Step-by-Step
                    </h3>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Self-Paced
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Click through each step at your own speed using Next/Back buttons and interactive on-screen triggers.
                  </p>
                </div>
              </div>
            </button>

            {/* Option 2: Auto Learn */}
            <button
              type="button"
              onClick={() => handleStartMode('auto')}
              className="w-full text-left p-4 rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all shadow-xs group block"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <span>Auto Learn</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </h3>
                    <span className="text-[10px] font-extrabold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                      7s per step
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Hands-free walkthrough. Automatically progresses through all 19 steps with 7 seconds on each milestone without requiring any clicks.
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>19 Process Steps (All 7 Milestones)</span>
            </span>
            <span>Pause or switch modes anytime</span>
          </div>
        </div>
      </div>
    );
  }

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[100000] animate-bounce-short pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-950 hover:bg-black text-white rounded-full shadow-2xl border-2 border-blue-500 ring-4 ring-black/40 cursor-pointer transition-transform hover:scale-105"
        >
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-1">
              <span>Step {activeStep.number}/{COMPACT_STEPS.length}</span>
              {tutorialMode === 'auto' && (
                <span className="text-amber-300 font-mono">({autoLearnSecondsRemaining}s)</span>
              )}
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

        {/* Auto Learn Active Strip with 7s Countdown & Pause Toggle */}
        {tutorialMode === 'auto' && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white px-3 py-1.5 text-[11px] font-mono flex items-center justify-between shrink-0 border-b border-indigo-700/60 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className={`w-3.5 h-3.5 text-amber-300 ${!isAutoPaused ? 'animate-spin' : ''}`} />
              <span className="text-amber-200">Auto Learn:</span>
              <span className="text-white bg-indigo-800 px-1.5 py-0.2 rounded font-mono">
                {isAutoPaused ? 'Paused' : `${autoLearnSecondsRemaining}s`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAutoPaused(!isAutoPaused)}
                className="px-2 py-0.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-sans font-bold text-[10px] cursor-pointer transition-colors shadow-2xs"
              >
                {isAutoPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                type="button"
                onClick={() => setTutorialMode('manual')}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-indigo-100 font-sans font-semibold text-[10px] cursor-pointer transition-colors"
                title="Switch to Manual Step-by-Step"
              >
                Manual
              </button>
            </div>
          </div>
        )}

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

        {/* Compact Footer Controls with Mode Selector & 100% Guaranteed Visibility */}
        <div className="px-3 py-2 bg-slate-100 border-t-2 border-slate-200 flex items-center justify-between gap-2 shrink-0 select-none">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowModeModal(true)}
              title="Change Mode / Restart"
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Modes</span>
            </button>

            {tutorialMode === 'manual' ? (
              <button
                type="button"
                onClick={() => {
                  setTutorialMode('auto');
                  setAutoLearnSecondsRemaining(7);
                  setIsAutoPaused(false);
                }}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
                title="Switch to Auto Learn (7s per step)"
              >
                <Play className="w-2.5 h-2.5 fill-indigo-600" />
                <span>Auto Learn</span>
              </button>
            ) : null}
          </div>

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
