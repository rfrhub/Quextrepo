import React, { useState, useRef, useEffect, useMemo } from 'react';
import { OperationProject, InstallLogEntry, BOMItem, ProjectManagerInfo } from '../types';
import { InstallLogSection } from './InstallLogSection';
import { InstallerClipMediaSection } from './InstallerClipMediaSection';
import {
  ClipboardList,
  Camera,
  Mic,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Layers,
  Sparkles,
} from 'lucide-react';

interface InstallLogsAndMediaContainerProps {
  project: OperationProject;
  logs?: InstallLogEntry[];
  bomItems?: BOMItem[];
  projectIntegratorPartners: string[];
  onAddLog: (newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => void;
  onDeleteLog: (id: string) => void;
  editorRole?: 'pm' | 'field_tech';
  editorName?: string;
  defaultInstallerName?: string;
  assignedPM?: ProjectManagerInfo;
  onConfirmInstallation?: (
    changeId?: string,
    sowItemId?: string,
    logId?: string
  ) => void;
  onApproveOverAllocation?: (logId: string) => void;
  onDenyOverAllocation?: (logId: string) => void;
  onOpenInstallersClip?: () => void;
}

export const InstallLogsAndMediaContainer: React.FC<InstallLogsAndMediaContainerProps> = ({
  project,
  logs = [],
  bomItems = [],
  projectIntegratorPartners,
  onAddLog,
  onDeleteLog,
  editorRole = 'pm',
  editorName = 'Project Manager',
  defaultInstallerName,
  assignedPM,
  onConfirmInstallation,
  onApproveOverAllocation,
  onDenyOverAllocation,
  onOpenInstallersClip,
}) => {
  const effectiveLogs = logs.length > 0 ? logs : project.installLogs || [];
  const effectiveBOM = bomItems.length > 0 ? bomItems : project.bomItems || [];

  // Count items with field media
  const mediaCount = useMemo(() => {
    return effectiveLogs.filter(
      (log) =>
        (log.photos && log.photos.length > 0) ||
        Boolean(log.audioNoteUrl) ||
        Boolean(log.itemNotes && log.itemNotes.trim())
    ).length;
  }, [effectiveLogs]);

  const [activeSection, setActiveSection] = useState<'log' | 'media'>('log');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to selected section
  const scrollToSection = (section: 'log' | 'media') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;

    if (section === 'log') {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      setActiveSection('log');
    } else {
      container.scrollTo({ left: cardWidth, behavior: 'smooth' });
      setActiveSection('media');
    }
  };

  // Detect scroll position to update active pill and dots
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const threshold = container.clientWidth / 2;

    if (scrollLeft > threshold) {
      if (activeSection !== 'media') setActiveSection('media');
    } else {
      if (activeSection !== 'log') setActiveSection('log');
    }
  };

  return (
    <div className="space-y-3 scroll-mt-36" id="pm-installer-logs-and-media">
      {/* Top Navigation Bar: Scroll Left-to-Right between the Two Subsection Cards */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-3 sm:p-4 rounded-xl shadow-md border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
        <div className="flex flex-wrap items-center gap-2">
          {/* Section 1: Completion & Verification Log Tab */}
          <button
            type="button"
            onClick={() => scrollToSection('log')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'log'
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-sky-300" />
            <span>1. Completion &amp; Verification Log</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-900/80 text-sky-200 text-[10px] font-mono">
              {effectiveLogs.length}
            </span>
          </button>

          {/* Section 2: Installers Clip Field Media & Voice Verification Tab */}
          <button
            type="button"
            onClick={() => scrollToSection('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'media'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 text-sky-300" />
            <Mic className="w-3.5 h-3.5 text-emerald-300" />
            <span>2. Field Media &amp; Voice Memos</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-900/80 text-indigo-200 text-[10px] font-mono">
              {mediaCount}
            </span>
          </button>
        </div>

        {/* Scroll Left to Right Navigation Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Scroll Directional Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => scrollToSection('log')}
              disabled={activeSection === 'log'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'log'
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
              title="Scroll to Installer Completion & Verification Log"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">Logs</span>
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1 px-1.5">
              <span
                onClick={() => scrollToSection('log')}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  activeSection === 'log' ? 'bg-sky-400 w-4' : 'bg-slate-500'
                }`}
                title="Go to Completion Log"
              />
              <span
                onClick={() => scrollToSection('media')}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  activeSection === 'media' ? 'bg-indigo-400 w-4' : 'bg-slate-500'
                }`}
                title="Go to Field Media & Voice Memos"
              />
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('media')}
              disabled={activeSection === 'media'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'media'
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
              title="Scroll to Field Media & Voice Memos"
            >
              <span className="hidden md:inline">Media &amp; Audio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Launch Installers Clip Button */}
          {onOpenInstallersClip && (
            <button
              type="button"
              onClick={onOpenInstallersClip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              title="Launch Installers Clip standalone field app for this project"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Installers Clip</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Snap Container: Left to Right Scroll Navigation Between the Two Subsection Cards */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 pb-2 scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* SUBSECTION CARD 1: Installer Completion & Verification Log */}
        <div className="w-full min-w-full shrink-0 snap-start">
          <InstallLogSection
            logs={effectiveLogs}
            bomItems={effectiveBOM}
            projectIntegratorPartners={projectIntegratorPartners}
            onAddLog={onAddLog}
            onDeleteLog={onDeleteLog}
            editorRole={editorRole}
            editorName={editorName}
            defaultInstallerName={defaultInstallerName}
            assignedPM={assignedPM}
            onConfirmInstallation={onConfirmInstallation}
            onApproveOverAllocation={onApproveOverAllocation}
            onDenyOverAllocation={onDenyOverAllocation}
          />
        </div>

        {/* SUBSECTION CARD 2: Field Media & Voice Verification (Tied to BOM Line Items) */}
        <div className="w-full min-w-full shrink-0 snap-start">
          <InstallerClipMediaSection
            project={project}
            logs={effectiveLogs}
            bomItems={effectiveBOM}
            onOpenInstallersClip={onOpenInstallersClip}
          />
        </div>
      </div>
    </div>
  );
};
