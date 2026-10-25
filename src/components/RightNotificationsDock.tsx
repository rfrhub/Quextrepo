import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  OperationProject,
  ProjectActivityNotification,
  FieldTechName,
  normalizeFieldTech,
  AVAILABLE_PMS,
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
} from 'lucide-react';

interface RightNotificationsDockProps {
  mode: 'pm' | 'field-tech';
  projects: OperationProject[];
  fieldTech?: FieldTechName | null;
  latestNotification?: ProjectActivityNotification | null;
  autoPopTriggerKey?: number;
  onSelectProject?: (projectId: string) => void;
}

export const RightNotificationsDock: React.FC<RightNotificationsDockProps> = ({
  mode,
  projects,
  fieldTech,
  latestNotification,
  autoPopTriggerKey = 0,
  onSelectProject,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOpen, setIsTouchOpen] = useState(false);
  const [isAutoSlidingOut, setIsAutoSlidingOut] = useState(false);
  const [pmFilter, setPmFilter] = useState<string>('all');
  const [techCategoryFilter, setTechCategoryFilter] = useState<'all' | 'pm_update' | 'installer_log'>('all');

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const autoSlideTimerRef = useRef<number | null>(null);

  // Automatically slide out for 5 seconds whenever a new notification is triggered
  useEffect(() => {
    if (autoPopTriggerKey > 0 && latestNotification) {
      // Only auto-open if the notification matches the current portal mode
      const matchesMode =
        (mode === 'pm' && latestNotification.audience === 'pm') ||
        (mode === 'field-tech' && latestNotification.audience === 'field_tech');

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

  // Build notification items for PM mode (Customer updates) or Field Tech mode (PM updates + Installer log changes)
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
        if (mode === 'pm' && notif.audience === 'pm') {
          if (!seenIds.has(notif.id)) {
            seenIds.add(notif.id);
            items.push(notif);
          }
        } else if (mode === 'field-tech' && notif.audience === 'field_tech') {
          if (!seenIds.has(notif.id)) {
            seenIds.add(notif.id);
            items.push(notif);
          }
        }
      });

      // 2. Baseline items so the dock always shows rich, accurate history from existing project state
      if (mode === 'pm') {
        if (p.customerIntake?.walkthroughCompleted) {
          const fallbackId = `baseline-kickoff-${p.id}`;
          const alreadyHasKickoffNotif = items.some(
            (i) => i.projectId === p.id && i.category === 'customer_kickoff_submission'
          );
          if (!alreadyHasKickoffNotif && !seenIds.has(fallbackId)) {
            seenIds.add(fallbackId);
            const subDate = p.customerIntake.submittedAt
              ? new Date(p.customerIntake.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Submitted';
            items.push({
              id: fallbackId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: subDate,
              createdAtIso: p.customerIntake.submittedAt || p.lastUpdated || '2026-10-20T10:00:00Z',
              audience: 'pm',
              category: 'customer_kickoff_submission',
              title: 'Customer Submitted Kickoff Walkthrough Form',
              details: `Confirmed PMS (${p.customerIntake.pmsSoftware || 'Yardi'}), ${
                p.customerIntake.commonAreaDoors?.length || 0
              } Common Area Doors, and ${p.customerIntake.staffRoles?.length || 0} Staff Access Roles.`,
              actorName: p.customerIntake.submittedBy || p.clientName || 'Property Customer',
              badgeLabel: 'Kickoff Submitted',
            });
          }
        }

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
              timestamp: p.productAcceptanceSubmission.signedAt,
              createdAtIso: p.lastUpdated || '2026-10-21T09:00:00Z',
              audience: 'pm',
              category: 'customer_acceptance',
              title: `Product Acceptance Signed by ${p.productAcceptanceSubmission.signedByName}`,
              details: `${p.productAcceptanceSubmission.signedByTitle} (${p.productAcceptanceSubmission.signedByEmail}) confirmed shipment delivery acceptance.`,
              actorName: p.productAcceptanceSubmission.signedByName,
              badgeLabel: 'Customer Acceptance',
            });
          }
        }
      } else {
        // Field Tech mode baseline: PM updates (notes, SOW forecasts, shipping dock) + Installer logs
        (p.installLogs || []).slice(0, 4).forEach((log) => {
          const logId = `baseline-ft-log-${log.id}`;
          const alreadyHasLog = items.some(
            (i) => i.projectId === p.id && i.details.includes(log.locationCompleted) && i.title.includes(log.itemName)
          );
          if (!alreadyHasLog && !seenIds.has(logId)) {
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
              title: `Installer Log: +${log.quantityCompleted} ${log.itemName}`,
              details: `${log.locationCompleted} · Logged by ${log.installerName} (${log.statusCheck})`,
              actorName: log.installerName,
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
              title: `PM Note (${note.category}) by ${note.author}`,
              details: note.text,
              actorName: note.author,
              badgeLabel: 'PM Project Update',
            });
          }
        });

        (p.sowForecastItems || []).slice(0, 2).forEach((sow) => {
          const sowId = `baseline-ft-sow-${p.id}-${sow.id}`;
          if (!seenIds.has(sowId)) {
            seenIds.add(sowId);
            items.push({
              id: sowId,
              projectId: p.id,
              propertyName: p.propertyName,
              assignedPMName: p.assignedPM.name,
              assignedFieldTech: techName,
              timestamp: sow.scheduledStartDate || 'Scheduled',
              createdAtIso: sow.scheduledStartDate || '2026-10-19T12:00:00Z',
              audience: 'field_tech',
              category: 'pm_update',
              title: `PM SOW Forecast: ${sow.bomItemName} (${sow.forecastedQuantity} units)`,
              details: `${sow.buildingOrArea} · ${sow.workDescription} · Installer: ${sow.assignedInstaller}`,
              actorName: p.assignedPM.name,
              badgeLabel: 'PM SOW Update',
            });
          }
        });
      }
    });

    // Sort newest first (live notifications with ISO timestamps first)
    return items.sort((a, b) => (b.createdAtIso || '').localeCompare(a.createdAtIso || ''));
  }, [projects, mode, fieldTech]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (mode === 'pm' && pmFilter !== 'all' && n.assignedPMName !== pmFilter) {
        return false;
      }
      if (mode === 'field-tech' && techCategoryFilter !== 'all' && n.category !== techCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [notifications, mode, pmFilter, techCategoryFilter]);

  const getBadgeStyle = (category: ProjectActivityNotification['category']) => {
    switch (category) {
      case 'customer_kickoff_submission':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'customer_walkthrough_update':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'customer_acceptance':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'installer_log':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pm_update':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <>
      {/* Invisible Right-Edge Hover & Swipe Sensor Strip */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => setIsTouchOpen(true)}
        className="fixed top-0 right-0 bottom-0 w-3.5 z-40 cursor-pointer group"
        title={
          mode === 'pm'
            ? 'Hover or swipe left to view Customer Updates & Walkthrough Notifications'
            : 'Hover or swipe left to view PM Project Updates & Installer Log Notifications'
        }
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
            {mode === 'pm' ? 'Customer Updates' : 'Field Alerts'}
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
        className={`fixed top-0 right-0 bottom-0 z-50 w-[340px] sm:w-[390px] max-w-[92vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
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
                  ? 'Real-time notifications when customers submit or update kickoff walkthrough answers.'
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
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs shrink-0">
          {mode === 'pm' ? (
            <>
              <span className="text-[11px] font-bold text-slate-600">Assigned PM:</span>
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Project Managers</option>
                {AVAILABLE_PMS.map((pm) => (
                  <option key={pm.name} value={pm.name}>
                    {pm.name}
                  </option>
                ))}
              </select>
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
              <div className="text-xs font-bold text-slate-700">No Notifications Yet</div>
              <p className="text-[11px] text-slate-500 mt-1">
                {mode === 'pm'
                  ? 'Customer kickoff walkthrough submissions and updates will appear here automatically.'
                  : 'PM updates and Installer Completion & Verification Log changes for your projects will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isLatestHighlighted =
                latestNotification && item.id === latestNotification.id && isAutoSlidingOut;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectProject) {
                      onSelectProject(item.projectId);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    onSelectProject ? 'cursor-pointer' : ''
                  } ${
                    isLatestHighlighted
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200 shadow-md'
                      : 'bg-white hover:bg-sky-50/40 border-slate-200 hover:border-sky-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-extrabold text-xs text-sky-800 truncate">
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

                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {item.title}
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.details}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {mode === 'pm' ? `PM: ${item.assignedPMName}` : `By: ${item.actorName}`}
                    </span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dock Footer Hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Hover right edge or swipe left on mobile</span>
          <span className="font-bold text-slate-700">Auto-shows 5s on update</span>
        </div>
      </aside>
    </>
  );
};
