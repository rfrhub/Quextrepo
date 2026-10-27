import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  OperationProject,
  ProjectActivityNotification,
  ProjectNotificationSection,
  FieldTechName,
  normalizeFieldTech,
  AVAILABLE_PMS,
  isLockBOMItem,
} from '../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  FileCheck,
  Wrench,
  ClipboardList,
  Truck,
  DoorOpen,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  MessageSquare,
  Layers,
  Tag,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Filter,
} from 'lucide-react';

interface RightNotificationsDockProps {
  mode: 'pm' | 'field-tech';
  projects: OperationProject[];
  fieldTech?: FieldTechName | null;
  latestNotification?: ProjectActivityNotification | null;
  autoPopTriggerKey?: number;
  onSelectProject?: (projectId: string, sectionTargetId?: string) => void;
  currentUserName?: string;
}

interface SectionTabDef {
  id: ProjectNotificationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTION_TABS: SectionTabDef[] = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'kickoff', label: 'Kickoff', icon: FileCheck },
  { id: 'bom', label: 'BOM & Locks', icon: Tag },
  { id: 'shipping', label: 'Shipping Dock', icon: Truck },
  { id: 'sow', label: 'SOW & Schedule', icon: Calendar },
  { id: 'common_doors', label: 'Common Doors', icon: DoorOpen },
  { id: 'installer_logs', label: 'Installer Logs', icon: Wrench },
  { id: 'notes', label: 'Notes', icon: MessageSquare },
  { id: 'milestones', label: 'Milestones', icon: DollarSign },
];

export const RightNotificationsDock: React.FC<RightNotificationsDockProps> = ({
  mode,
  projects,
  fieldTech,
  latestNotification,
  autoPopTriggerKey = 0,
  onSelectProject,
  currentUserName = 'Raul Recalde',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOpen, setIsTouchOpen] = useState(false);
  const [isAutoSlidingOut, setIsAutoSlidingOut] = useState(false);
  const [pmFilter, setPmFilter] = useState<string>('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<ProjectNotificationSection>('all');
  const [techCategoryFilter, setTechCategoryFilter] = useState<'all' | 'pm_update' | 'installer_log'>('all');

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const autoSlideTimerRef = useRef<number | null>(null);

  // Automatically slide out for 5 seconds whenever a new notification is triggered
  useEffect(() => {
    if (autoPopTriggerKey > 0 && latestNotification) {
      const matchesMode =
        (mode === 'pm' && (latestNotification.audience === 'pm' || latestNotification.audience === 'all')) ||
        (mode === 'field-tech' && (latestNotification.audience === 'field_tech' || latestNotification.audience === 'all'));

      if (matchesMode) {
        setIsAutoSlidingOut(true);
        if (autoSlideTimerRef.current) {
          window.clearTimeout(autoSlideTimerRef.current);
        }
        autoSlideTimerRef.current = window.setTimeout(() => {
          setIsAutoSlidingOut(false);
        }, 5000);
      }
    }
    return () => {
      if (autoSlideTimerRef.current) {
        window.clearTimeout(autoSlideTimerRef.current);
      }
    };
  }, [autoPopTriggerKey, latestNotification, mode]);

  // Global touch listener on mobile so sliding left from the right side of the screen pulls out the dock
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        touchStartXRef.current === null ||
        touchStartYRef.current === null ||
        !e.touches ||
        e.touches.length === 0
      ) {
        return;
      }

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartXRef.current;
      const deltaY = Math.abs(touch.clientY - touchStartYRef.current);

      // Ignore primarily vertical scrolling
      if (deltaY > Math.abs(deltaX)) return;

      const viewportWidth = window.innerWidth;
      // Slide left from right edge (within 48px of right screen edge)
      if (!isTouchOpen && touchStartXRef.current >= viewportWidth - 48 && deltaX < -28) {
        setIsTouchOpen(true);
        touchStartXRef.current = null;
        touchStartYRef.current = null;
      } else if (isTouchOpen && deltaX > 36) {
        // Slide right to hide dock
        setIsTouchOpen(false);
        setIsAutoSlidingOut(false);
        touchStartXRef.current = null;
        touchStartYRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchOpen]);

  const isOpen = isHovered || isTouchOpen || isAutoSlidingOut;

  // Helper to determine if an update was made by the current user
  const isSelfUpdate = (actorName?: string) => {
    if (!actorName || !currentUserName) return false;
    const a = actorName.trim().toLowerCase();
    const u = currentUserName.trim().toLowerCase();
    if (a === u) return true;
    if (a.startsWith(u) || u.startsWith(a)) return true;
    const aFirst = a.split(' ')[0];
    const uFirst = u.split(' ')[0];
    const aLast = a.split(' ')[1];
    const uLast = u.split(' ')[1];
    if (aFirst && uFirst && aFirst === uFirst && aLast && uLast && aLast === uLast) {
      return true;
    }
    return false;
  };

  // Build notification items across all 8 project sections
  const notifications = useMemo<ProjectActivityNotification[]>(() => {
    const items: ProjectActivityNotification[] = [];
    const seenIds = new Set<string>();

    const relevantProjects =
      mode === 'field-tech' && fieldTech
        ? projects.filter((p) => normalizeFieldTech(p.assignedFieldTech) === fieldTech)
        : projects;

    relevantProjects.forEach((p) => {
      const techName = normalizeFieldTech(p.assignedFieldTech);

      // 1. Explicit live activityNotifications recorded on the project
      (p.activityNotifications || []).forEach((notif) => {
        const matchesAudience =
          (mode === 'pm' && (notif.audience === 'pm' || notif.audience === 'all')) ||
          (mode === 'field-tech' && (notif.audience === 'field_tech' || notif.audience === 'all'));

        if (matchesAudience && !seenIds.has(notif.id)) {
          seenIds.add(notif.id);

          // Infer section and scroll target if not set
          let inferredSection: ProjectNotificationSection = notif.section || 'kickoff';
          let inferredTargetId = notif.sectionTargetId;

          if (!notif.section) {
            if (notif.category === 'customer_kickoff_submission' || notif.category === 'customer_walkthrough_update') {
              inferredSection = 'kickoff';
              inferredTargetId = inferredTargetId || 'pm-kickoff-intake';
            } else if (notif.category === 'customer_acceptance' || notif.category === 'shipping_update') {
              inferredSection = 'shipping';
              inferredTargetId = inferredTargetId || 'shipping-dock-section';
            } else if (notif.category === 'bom_update') {
              inferredSection = 'bom';
              inferredTargetId = inferredTargetId || 'pm-bom-table';
            } else if (notif.category === 'sow_update') {
              inferredSection = 'sow';
              inferredTargetId = inferredTargetId || 'sow-and-mitigation-section';
            } else if (notif.category === 'common_door_update') {
              inferredSection = 'common_doors';
              inferredTargetId = inferredTargetId || 'pm-common-doors';
            } else if (notif.category === 'installer_log') {
              inferredSection = 'installer_logs';
              inferredTargetId = inferredTargetId || 'pm-installer-logs';
            } else if (notif.category === 'note_update') {
              inferredSection = 'notes';
              inferredTargetId = inferredTargetId || 'pm-project-notes';
            } else if (notif.category === 'milestone_update') {
              inferredSection = 'milestones';
              inferredTargetId = inferredTargetId || 'pm-financial-milestones';
            }
          }

          items.push({
            ...notif,
            section: inferredSection,
            sectionTargetId: inferredTargetId,
          });
        }
      });

      // 2. Baseline items for all sections so the dock always shows a rich, live feed of all operations
      if (mode === 'pm') {
        // --- SECTION 1: KICKOFF & WALKTHROUGH ---
        if (p.customerIntake?.walkthroughCompleted) {
          const kickoffId = `baseline-kickoff-${p.id}`;
          if (!seenIds.has(kickoffId)) {
            seenIds.add(kickoffId);
            const subDate = p.customerIntake.submittedAt
              ? new Date(p.customerIntake.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Oct 22, 10:30 AM';
            items.push({
              id: kickoffId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: subDate,
              createdAtIso: p.customerIntake.submittedAt || p.lastUpdated || '2026-10-22T10:30:00Z',
              audience: 'pm',
              category: 'customer_kickoff_submission',
              section: 'kickoff',
              sectionTargetId: 'pm-kickoff-intake',
              title: 'Customer Submitted Kickoff Walkthrough Form',
              details: `Confirmed PMS (${p.customerIntake.pmsSoftware || 'Yardi'}), ${
                p.customerIntake.commonAreaDoors?.length || 4
              } Common Area Doors, and ${p.customerIntake.staffRoles?.length || 3} Staff Access Roles.`,
              actorName: p.customerIntake.submittedBy || p.clientName || 'Property Customer',
              actorRole: 'customer',
              badgeLabel: 'Kickoff Submitted',
            });
          }
        }

        // --- SECTION 2: BOM & HARDWARE / LOCK TAGS ---
        const lockBomItems = (p.bomItems || []).filter(isLockBOMItem);
        lockBomItems.slice(0, 2).forEach((lockItem, idx) => {
          const bomNotifId = `baseline-bom-lock-${p.id}-${lockItem.id || idx}`;
          if (!seenIds.has(bomNotifId)) {
            seenIds.add(bomNotifId);
            const cfg = lockItem.lockFinishConfig;
            let finishSummary = 'Matte Black 622 · Greenwich Trim';
            if (cfg) {
              if (cfg.isSplit && cfg.splits && cfg.splits.length > 0) {
                finishSummary = `Split finish (${cfg.splits.length} batches: ${cfg.splits
                  .map(
                    (s) =>
                      `${s.quantity}x ${s.label || s.befeColorFinish || s.ndeColorFinish || s.xe360ColorFinish || 'Finish'}`
                  )
                  .join(', ')})`;
              } else if (cfg.family === 'nde') {
                finishSummary = `${cfg.ndeColorFinish || '626 - Satin Chrome'} · ${cfg.ndeLeverType || 'Rhodes'}`;
              } else if (cfg.family === 'xe360') {
                finishSummary = `${cfg.xe360ColorFinish || '622 - Matte Black'} · ${cfg.xe360LeverStyle || 'Latitude'}`;
              } else if (cfg.family === 'befe') {
                finishSummary = `${cfg.befeTrimStyle || 'Greenwich'} · ${cfg.befeColorFinish || '622 - Matte Black'}`;
              }
            }

            items.push({
              id: bomNotifId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 23, 02:15 PM',
              createdAtIso: '2026-10-23T14:15:00Z',
              audience: 'pm',
              category: 'bom_update',
              section: 'bom',
              sectionTargetId: 'pm-bom-table',
              title: `Lock Finish Tag Configured: ${lockItem.name}`,
              details: `${lockItem.quantity} units tagged with ${finishSummary}. Verified for factory fulfillment.`,
              actorName: p.assignedPM.name === currentUserName ? 'Bethany Condon' : p.assignedPM.name,
              actorRole: 'pm',
              badgeLabel: 'BOM Lock Tag',
            });
          }
        });

        // Gateway line item course requirement
        const gatewayItem = (p.bomItems || []).find((b) => b.name.toLowerCase().includes('gateway') || b.model?.includes('GW'));
        if (gatewayItem) {
          const gwNotifId = `baseline-bom-gw-${p.id}`;
          if (!seenIds.has(gwNotifId)) {
            seenIds.add(gwNotifId);
            items.push({
              id: gwNotifId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 22, 11:45 AM',
              createdAtIso: '2026-10-22T11:45:00Z',
              audience: 'pm',
              category: 'bom_update',
              section: 'bom',
              sectionTargetId: 'pm-bom-table',
              title: `Gateway Installer Guide & Course Assigned: ${gatewayItem.name}`,
              details: `LoRaWAN Gateway line item present (${gatewayItem.quantity} units). Assigned Partner Academy Gateway Course to field technicians.`,
              actorName: 'Megan Rossman',
              actorRole: 'pm',
              badgeLabel: 'Gateway Course',
            });
          }
        }

        // --- SECTION 3: SHIPPING DOCK & PRODUCT ACCEPTANCE ---
        if (p.productAcceptanceSubmission) {
          const accId = `baseline-acceptance-${p.id}`;
          if (!seenIds.has(accId)) {
            seenIds.add(accId);
            items.push({
              id: accId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: p.productAcceptanceSubmission.signedAt || 'Oct 23, 09:20 AM',
              createdAtIso: p.lastUpdated || '2026-10-23T09:20:00Z',
              audience: 'pm',
              category: 'customer_acceptance',
              section: 'shipping',
              sectionTargetId: 'shipping-dock-section',
              title: `Product Acceptance Signed by ${p.productAcceptanceSubmission.signedByName}`,
              details: `${p.productAcceptanceSubmission.signedByTitle} (${p.productAcceptanceSubmission.signedByEmail}) signed shipment delivery acceptance for ${p.propertyName}.`,
              actorName: p.productAcceptanceSubmission.signedByName,
              actorRole: 'customer',
              badgeLabel: 'Customer Acceptance',
            });
          }
        }

        (p.shippingDockItems || []).slice(0, 2).forEach((dockItem) => {
          const dockId = `baseline-shipping-${p.id}-${dockItem.id}`;
          if (!seenIds.has(dockId)) {
            seenIds.add(dockId);
            items.push({
              id: dockId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 22, 01:10 PM',
              createdAtIso: '2026-10-22T13:10:00Z',
              audience: 'pm',
              category: 'shipping_update',
              section: 'shipping',
              sectionTargetId: 'shipping-dock-section',
              title: `Shipping Dock Staged: ${dockItem.bomItemName}`,
              details: `Carrier: ${dockItem.carrier || 'Freight Line'} · Tracking #${dockItem.trackingNumber || 'PRO-77491'} · ${dockItem.shippedQuantity || 24} units delivered to site staging.`,
              actorName: 'Bill Meyers (SKBM Smart Tech)',
              actorRole: 'installer_partner',
              badgeLabel: 'Shipping Dock',
            });
          }
        });

        // --- SECTION 4: SOW & SCHEDULE FORECASTER ---
        (p.sowForecastItems || []).slice(0, 2).forEach((sow) => {
          const sowId = `baseline-sow-${p.id}-${sow.id}`;
          if (!seenIds.has(sowId)) {
            seenIds.add(sowId);
            items.push({
              id: sowId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: sow.scheduledStartDate || 'Oct 21, 08:00 AM',
              createdAtIso: sow.scheduledStartDate || '2026-10-21T08:00:00Z',
              audience: 'pm',
              category: 'sow_update',
              section: 'sow',
              sectionTargetId: 'sow-and-mitigation-section',
              title: `SOW Schedule Dispatched: ${sow.bomItemName}`,
              details: `${sow.buildingOrArea} · ${sow.forecastedQuantity} units scheduled (${sow.scheduledStartDate || 'Oct 24'} - ${sow.scheduledEndDate || 'Oct 29'}) · Installer: ${sow.assignedInstaller}.`,
              actorName: sow.assignedInstaller || 'Elena Rostova (ATB)',
              actorRole: 'installer_partner',
              badgeLabel: 'SOW Dispatched',
            });
          }
        });

        if (p.pmpMitigationPlan) {
          const pmpId = `baseline-pmp-${p.id}`;
          if (!seenIds.has(pmpId)) {
            seenIds.add(pmpId);
            items.push({
              id: pmpId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 23, 04:30 PM',
              createdAtIso: '2026-10-23T16:30:00Z',
              audience: 'pm',
              category: 'sow_update',
              section: 'sow',
              sectionTargetId: 'sow-and-mitigation-section',
              title: 'PMP Schedule Mitigation Recovery Plan Active',
              details: 'Field installation partner deployed +2 supplemental technicians to maintain timeline and eliminate schedule drift.',
              actorName: techName || 'Hector Lopez',
              actorRole: 'field_tech',
              badgeLabel: 'PMP Mitigation',
            });
          }
        }

        // --- SECTION 5: COMMON AREA DOORS ---
        const doors = p.customerIntake?.commonAreaDoors || [];
        doors.slice(0, 1).forEach((door, didx) => {
          const doorId = `baseline-door-${p.id}-${door.id || didx}`;
          if (!seenIds.has(doorId)) {
            seenIds.add(doorId);
            items.push({
              id: doorId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 22, 03:40 PM',
              createdAtIso: '2026-10-22T15:40:00Z',
              audience: 'pm',
              category: 'common_door_update',
              section: 'common_doors',
              sectionTargetId: 'pm-common-doors',
              title: `Common Door Access Configured: ${door.doorName || 'Clubhouse & Amenity Gates'}`,
              details: `Device: ${door.installedDeviceName || 'Schlage MT20W Reader'} · Access: 24/7 NFC Mobile Key & Apple Wallet Credential.`,
              actorName: 'Shanna Olmstead (Spirit Security)',
              actorRole: 'installer_partner',
              badgeLabel: 'Common Doors',
            });
          }
        });

        // --- SECTION 6: INSTALLER COMPLETION & VERIFICATION LOGS ---
        (p.installLogs || []).slice(0, 3).forEach((log) => {
          const logId = `baseline-install-log-${log.id}`;
          if (!seenIds.has(logId)) {
            seenIds.add(logId);
            const isPartner =
              log.installerName?.includes('Tech') ||
              log.installerName?.includes('SKBM') ||
              log.installerName?.includes('ATB') ||
              log.installerName?.includes('Vance');

            items.push({
              id: logId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: log.timestamp || 'Oct 23, 11:15 AM',
              createdAtIso: log.timestamp || '2026-10-23T11:15:00Z',
              audience: 'pm',
              category: 'installer_log',
              section: 'installer_logs',
              sectionTargetId: 'pm-installer-logs',
              title: `Hardware Installed: +${log.quantityCompleted} ${log.itemName}`,
              details: `${log.locationCompleted} · Logged by ${log.installerName} (${log.statusCheck || 'Passed QC & Commissioning'}).`,
              actorName: log.installerName,
              actorRole: isPartner ? 'installer_partner' : 'field_tech',
              badgeLabel: 'Installer Log',
            });
          }
        });

        // --- SECTION 7: TEAM NOTES (FROM OTHER TEAM MEMBERS) ---
        (p.notes || []).slice(0, 3).forEach((note) => {
          const noteId = `baseline-note-${note.id}`;
          if (!seenIds.has(noteId)) {
            seenIds.add(noteId);
            const isTech = note.author === 'Sean Gates' || note.author === 'Hector Lopez';
            const isPartner =
              note.author?.includes('SKBM') || note.author?.includes('ATB') || note.author?.includes('Vance');

            items.push({
              id: noteId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: note.timestamp || 'Oct 21, 09:30 AM',
              createdAtIso: note.timestamp || '2026-10-21T09:30:00Z',
              audience: 'pm',
              category: 'note_update',
              section: 'notes',
              sectionTargetId: 'pm-project-notes',
              title: `Team Note (${note.category}): ${note.author}`,
              details: note.text,
              actorName: note.author,
              actorRole: isTech ? 'field_tech' : isPartner ? 'installer_partner' : 'pm',
              badgeLabel: 'Team Note',
            });
          }
        });

        // --- SECTION 8: MILESTONES & FINANCIAL BILLING STATUS ---
        const activeMilestone =
          (p.milestones || []).find((m) => m.status === 'In Progress') || (p.milestones || [])[0];
        if (activeMilestone) {
          const msId = `baseline-ms-${p.id}-${activeMilestone.id}`;
          if (!seenIds.has(msId)) {
            seenIds.add(msId);
            items.push({
              id: msId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: 'Oct 23, 08:30 AM',
              createdAtIso: '2026-10-23T08:30:00Z',
              audience: 'pm',
              category: 'milestone_update',
              section: 'milestones',
              sectionTargetId: 'pm-financial-milestones',
              title: `Milestone Phase Active: ${activeMilestone.title}`,
              details: `${p.propertyName} is actively in progress with target date ${activeMilestone.targetDate}.`,
              actorName: 'Megan Rossman (Operations)',
              actorRole: 'pm',
              badgeLabel: 'Milestone Phase',
            });
          }
        }

        const billingId = `baseline-billing-${p.id}`;
        if (!seenIds.has(billingId)) {
          seenIds.add(billingId);
          items.push({
            id: billingId,
            projectId: p.id,
            propertyName: p.propertyName,
            assignedPMName: p.assignedPM.name,
            assignedFieldTech: techName,
            timestamp: 'Oct 22, 02:00 PM',
            createdAtIso: '2026-10-22T14:00:00Z',
            audience: 'pm',
            category: 'milestone_update',
            section: 'milestones',
            sectionTargetId: 'pm-financial-milestones',
            title: 'Deposit Invoice Cleared & Released',
            details: 'Finance approved 100% deposit payment receipt. Hardware warehouse release authorization confirmed.',
            actorName: 'Megan Rossman (Operations)',
            actorRole: 'pm',
            badgeLabel: 'Billing Cleared',
          });
        }
      } else {
        // Field Tech mode baseline: PM updates + Installer logs
        (p.installLogs || []).slice(0, 5).forEach((log) => {
          const logId = `baseline-ft-log-${log.id}`;
          if (!seenIds.has(logId)) {
            seenIds.add(logId);
            items.push({
              id: logId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: log.timestamp,
              createdAtIso: log.timestamp || '2026-10-21T08:00:00Z',
              audience: 'field_tech',
              category: 'installer_log',
              section: 'installer_logs',
              sectionTargetId: 'pm-installer-logs',
              title: `Installer Log: +${log.quantityCompleted} ${log.itemName}`,
              details: `${log.locationCompleted} · Logged by ${log.installerName} (${log.statusCheck})`,
              actorName: log.installerName,
              actorRole: 'installer_partner',
              badgeLabel: 'Installer Log',
            });
          }
        });

        (p.notes || []).slice(0, 3).forEach((note) => {
          const noteId = `baseline-ft-note-${note.id}`;
          if (!seenIds.has(noteId)) {
            seenIds.add(noteId);
            items.push({
              id: noteId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: note.timestamp,
              createdAtIso: note.timestamp || '2026-10-20T12:00:00Z',
              audience: 'field_tech',
              category: 'pm_update',
              section: 'notes',
              sectionTargetId: 'pm-project-notes',
              title: `PM Note (${note.category}) by ${note.author}`,
              details: note.text,
              actorName: note.author,
              actorRole: 'pm',
              badgeLabel: 'PM Project Update',
            });
          }
        });
      }
    });

    // Sort newest first
    return items.sort((a, b) => (b.createdAtIso || '').localeCompare(a.createdAtIso || ''));
  }, [projects, mode, fieldTech, currentUserName]);

  // Compute live counts per section (taking into account assigned PM filter and self-update suppression)
  const sectionCounts = useMemo(() => {
    const counts: Record<ProjectNotificationSection, number> = {
      all: 0,
      kickoff: 0,
      bom: 0,
      shipping: 0,
      sow: 0,
      common_doors: 0,
      installer_logs: 0,
      notes: 0,
      milestones: 0,
    };

    notifications.forEach((n) => {
      // Ignore updates made by the same user in PM mode
      if (mode === 'pm' && isSelfUpdate(n.actorName)) {
        return;
      }
      if (mode === 'pm' && pmFilter !== 'all' && n.assignedPMName !== pmFilter) {
        return;
      }

      counts.all += 1;
      if (n.section && counts[n.section] !== undefined) {
        counts[n.section] += 1;
      }
    });

    return counts;
  }, [notifications, mode, pmFilter, currentUserName]);

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // 1. SUPPRESS SELF-UPDATES: Ignore updates made by the same user
      if (mode === 'pm' && isSelfUpdate(n.actorName)) {
        return false;
      }

      // 2. PM Filter
      if (mode === 'pm' && pmFilter !== 'all' && n.assignedPMName !== pmFilter) {
        return false;
      }

      // 3. Section Filter (PM mode)
      if (mode === 'pm' && selectedSectionFilter !== 'all' && n.section !== selectedSectionFilter) {
        return false;
      }

      // 4. Tech Category Filter (Field Tech mode)
      if (mode === 'field-tech' && techCategoryFilter !== 'all' && n.category !== techCategoryFilter) {
        return false;
      }

      return true;
    });
  }, [notifications, mode, pmFilter, selectedSectionFilter, techCategoryFilter, currentUserName]);

  const getBadgeStyle = (category: ProjectActivityNotification['category']) => {
    switch (category) {
      case 'customer_kickoff_submission':
      case 'customer_walkthrough_update':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'customer_acceptance':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'bom_update':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'shipping_update':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'sow_update':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'common_door_update':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'installer_log':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'note_update':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'milestone_update':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pm_update':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getActorRoleBadge = (actorRole?: string) => {
    switch (actorRole) {
      case 'customer':
        return { label: 'Customer', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'field_tech':
        return { label: 'Field Tech', style: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'installer_partner':
        return { label: 'Partner Integrator', style: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'pm':
      default:
        return { label: 'PM Team', style: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
  };

  return (
    <>
      {/* Invisible Right-Edge Hover & Swipe Sensor Strip */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => setIsTouchOpen(true)}
        className="fixed top-0 right-0 bottom-0 w-3.5 z-40 cursor-pointer group"
        title="Hover or swipe left to view Notifications"
      >
        {/* Subtle Edge Handle Pill so users know where the hidden dock lives */}
        <div
          className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 py-3 px-1.5 rounded-l-xl border border-r-0 shadow-md transition-all duration-300 ${
            isOpen
              ? 'opacity-0 pointer-events-none translate-x-full'
              : 'opacity-90 hover:opacity-100 translate-x-0 bg-white border-slate-300 text-slate-700 hover:bg-sky-50 hover:border-sky-300'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
          <div className="relative">
            <Bell className="w-4 h-4 text-sky-600" />
            {filteredNotifications.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-2xs">
                {Math.min(filteredNotifications.length, 99)}
              </span>
            )}
          </div>
          <span
            className="text-[9px] font-extrabold uppercase tracking-widest text-slate-600 py-1"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            Notifications
          </span>
        </div>
      </div>

      {/* Mobile Backdrop when pulled out via touch */}
      {isTouchOpen && (
        <div
          onClick={() => {
            setIsTouchOpen(false);
            setIsAutoSlidingOut(false);
          }}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-40 sm:hidden"
        />
      )}

      {/* Slide-Out Right Notification Dock */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[360px] sm:w-[420px] max-w-[94vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Auto-Slide-Out 5-Second Banner when triggered by a live event */}
        {isAutoSlidingOut && latestNotification && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white px-4 py-2 text-[11px] font-bold flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0 animate-spin" />
              <span className="truncate">Live Update Received · Auto-hiding in 5s</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAutoSlidingOut(false)}
              className="text-white/80 hover:text-white text-[10px] underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dock Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-white via-sky-50/50 to-white flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-sky-100 text-sky-800 border border-sky-200">
                  {mode === 'pm' ? 'PM Live Feed' : `${fieldTech || 'Field Tech'} Dock`}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ({filteredNotifications.length})
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-1">
                {mode === 'pm'
                  ? 'Customer Walkthrough & Portal Updates'
                  : 'PM Project & Installer Log Updates'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {mode === 'pm'
                  ? 'Feed from other PMs, Field Techs, Integrator Partners & Customers.'
                  : 'Real-time notifications when a PM updates your assigned projects or Installer Logs change.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsHovered(false);
              setIsTouchOpen(false);
              setIsAutoSlidingOut(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Hide Notifications Dock"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar inside Dock */}
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
          {mode === 'pm' ? (
            <>
              {/* Assigned PM Selector & Self-Suppression Indicator */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Assigned PM:</span>
                <select
                  value={pmFilter}
                  onChange={(e) => setPmFilter(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Project Managers</option>
                  {AVAILABLE_PMS.map((pm) => (
                    <option key={pm.name} value={pm.name}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter Pills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-slate-400" />
                    Filter by Section
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Ignoring updates by you ({currentUserName.split(' ')[0]})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {SECTION_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const count = sectionCounts[tab.id] || 0;
                    const isSelected = selectedSectionFilter === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedSectionFilter(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-sky-800 text-sky-100'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1 w-full">
              <button
                type="button"
                onClick={() => setTechCategoryFilter('all')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  techCategoryFilter === 'all'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Updates
              </button>
              <button
                type="button"
                onClick={() => setTechCategoryFilter('pm_update')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  techCategoryFilter === 'pm_update'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                PM Updates
              </button>
              <button
                type="button"
                onClick={() => setTechCategoryFilter('installer_log')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  techCategoryFilter === 'installer_log'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Installer Logs
              </button>
            </div>
          )}
        </div>

        {/* Notifications Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">No Notifications for this Section</div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[260px] mx-auto">
                {mode === 'pm'
                  ? `No recent updates in "${SECTION_TABS.find((t) => t.id === selectedSectionFilter)?.label || 'this section'}" from other PMs, Field Techs, or Partners.`
                  : 'PM updates and Installer Completion & Verification Log changes for your projects will appear here.'}
              </p>
              {mode === 'pm' && selectedSectionFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedSectionFilter('all')}
                  className="mt-3 px-3 py-1 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer transition-colors"
                >
                  View All Sections ({sectionCounts.all})
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isLatestHighlighted =
                latestNotification && item.id === latestNotification.id && isAutoSlidingOut;
              const roleMeta = getActorRoleBadge(item.actorRole);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectProject) {
                      onSelectProject(item.projectId, item.sectionTargetId);
                    }
                  }}
                  className={`group p-3.5 rounded-xl border transition-all ${
                    onSelectProject ? 'cursor-pointer' : ''
                  } ${
                    isLatestHighlighted
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200 shadow-md'
                      : 'bg-white hover:bg-sky-50/50 border-slate-200 hover:border-sky-300 shadow-2xs'
                  }`}
                >
                  {/* Top Header: Property Name + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-xs text-sky-900 group-hover:text-sky-700 transition-colors truncate">
                      {item.propertyName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border shrink-0 ${getBadgeStyle(
                        item.category
                      )}`}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-xs font-bold text-slate-900 leading-snug flex items-center justify-between gap-2">
                    <span>{item.title}</span>
                    {item.sectionTargetId && onSelectProject && (
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>

                  {/* Details */}
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.details}
                  </p>

                  {/* Meta Bar: Actor, Role, Section and Timestamp */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">
                        {item.actorName}
                      </span>
                      {item.actorRole && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${roleMeta.style}`}>
                          {roleMeta.label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dock Footer Hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>Feeds from other PMs, Techs &amp; Partners</span>
          </span>
          <span className="font-bold text-slate-700">Auto-shows 5s on live event</span>
        </div>
      </aside>
    </>
  );
};
