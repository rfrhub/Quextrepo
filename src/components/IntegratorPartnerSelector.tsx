import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  OFFICIAL_CHANNEL_PARTNERS,
  DEFAULT_INTEGRATOR_PARTNERS,
  UsedIntegratorHistoryEntry,
  isOfficialChannelPartner,
  isMainIntegratorPartner,
  loadUsedIntegratorHistory,
  saveUsedIntegratorToHistory,
  removeUsedIntegratorFromHistory,
} from '../types';
import {
  Wrench,
  Plus,
  X,
  ChevronDown,
  CheckSquare,
  Square,
  Sparkles,
  History,
  Trash2,
  Check,
} from 'lucide-react';

interface IntegratorPartnerSelectorProps {
  assignedPartners: string[];
  onChange: (updatedPartners: string[]) => void;
  allProjects?: { propertyName?: string; integratorPartners?: string[] }[];
  projectName?: string;
  variant?: 'header' | 'compact' | 'form';
  label?: string;
}

export const IntegratorPartnerSelector: React.FC<IntegratorPartnerSelectorProps> = ({
  assignedPartners,
  onChange,
  allProjects,
  projectName,
  label = 'Integrator Partner / Installers:',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'all' | 'main' | 'history'>('all');
  const [customPartnerInput, setCustomPartnerInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [usedHistory, setUsedHistory] = useState<UsedIntegratorHistoryEntry[]>(() =>
    loadUsedIntegratorHistory(allProjects)
  );
  const [floatingPosition, setFloatingPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const floatingHubRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFloatingPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.min(420, window.innerWidth - 24);
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - dropdownWidth - 12);
    }
    const top = rect.bottom + 8;
    setFloatingPosition({ top, left });
  }, []);

  // Sync history & position when floating hub opens
  useEffect(() => {
    if (isOpen) {
      setUsedHistory(loadUsedIntegratorHistory(allProjects));
      updateFloatingPosition();
      window.addEventListener('scroll', updateFloatingPosition, true);
      window.addEventListener('resize', updateFloatingPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateFloatingPosition, true);
      window.removeEventListener('resize', updateFloatingPosition);
    };
  }, [isOpen, allProjects, updateFloatingPosition]);

  // Close floating hub on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        (!floatingHubRef.current || !floatingHubRef.current.contains(target))
      ) {
        setIsOpen(false);
        setErrorMessage('');
        setFeedbackMessage('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Official Channel Partners (OCP) list — strictly the official OCP list only (never includes manual entries)
  const ocpPartners: readonly string[] = OFFICIAL_CHANNEL_PARTNERS;
  const mainPartners: readonly string[] = ocpPartners;

  // Toggle partner assignment on the current project
  const handleTogglePartner = (partnerName: string, isFromHistory?: boolean) => {
    const isAssigned = assignedPartners.includes(partnerName);
    let updated: string[];
    if (isAssigned) {
      updated = assignedPartners.filter((p) => p !== partnerName);
    } else {
      updated = [...assignedPartners, partnerName];
      if (isFromHistory && !isMainIntegratorPartner(partnerName)) {
        const refreshed = saveUsedIntegratorToHistory(partnerName, projectName);
        setUsedHistory(refreshed);
      }
    }
    onChange(updated);
  };

  // Remove a partner directly from badge on the project
  const handleRemovePartner = (partnerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = assignedPartners.filter((p) => p !== partnerName);
    onChange(updated);
  };

  // Manual entry of custom integrator partner:
  // Assigns to project AND saves to History of Used Integrators (excluded from Main List)
  const handleAddCustomPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customPartnerInput.trim();
    if (!trimmed) {
      setErrorMessage('Please type in an Integrator Partner name.');
      return;
    }

    // Check if user typed a main partner name (case-insensitive)
    const matchedMain = mainPartners.find((p) => p.toLowerCase() === trimmed.toLowerCase());
    const finalName = matchedMain || trimmed;

    if (!matchedMain) {
      // Save to persistent History of Used Integrators (NOT the main list)
      const updatedHistory = saveUsedIntegratorToHistory(finalName, projectName);
      setUsedHistory(updatedHistory);
    }

    // Assign to this project if not already assigned
    if (!assignedPartners.some((p) => p.toLowerCase() === finalName.toLowerCase())) {
      onChange([...assignedPartners, finalName]);
    }

    setCustomPartnerInput('');
    setErrorMessage('');
    setFeedbackMessage(
      matchedMain
        ? `Assigned "${finalName}" to project.`
        : `Assigned "${finalName}" to project & saved to History of Used Integrators.`
    );
    setTimeout(() => setFeedbackMessage(''), 3500);
  };

  // Delete an entry from the History of Used Integrators
  const handleDeleteFromHistory = (partnerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeUsedIntegratorFromHistory(partnerName);
    setUsedHistory(updated);
  };

  // Badge color scheme based on partner name for visual distinctiveness
  const getBadgeColor = (name: string) => {
    switch (name) {
      case 'SKBM':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'ATB':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100';
      case 'SBH':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'Everbase':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100';
      case 'JTS':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
      case 'DIY':
      case 'DIY (Customer Self-Install)':
        return 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 font-bold';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={triggerRef}>
      {/* Trigger Row / Badges Display */}
      <div className="flex flex-wrap items-center gap-1.5">
        {label && (
          <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-sky-600" />
            <span>{label}</span>
          </span>
        )}

        {/* Current Assigned Badges with Quick Remove */}
        {assignedPartners.length === 0 ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>Assign Integrator / Installer</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {assignedPartners.map((partner) => {
              const isOCP = isOfficialChannelPartner(partner);
              return (
                <span
                  key={partner}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-md border transition-all ${getBadgeColor(
                    partner
                  )}`}
                  title={
                    isOCP
                      ? `${partner} (Official Channel Partner — OCP)`
                      : `${partner} (Manually entered integrator — stored in History of Used Integrators)`
                  }
                >
                  <span>{partner}</span>
                  {isOCP ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-sky-200/80 text-sky-900 border border-sky-300/60 shadow-2xs">
                      OCP
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1 py-0.2 rounded bg-purple-200/70 text-purple-900">
                      Manual
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleRemovePartner(partner, e)}
                    className="hover:text-rose-600 rounded p-0.5 transition-colors cursor-pointer ml-0.5"
                    title={`Remove ${partner} from project`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {/* Quick Edit / Add Manual Integrator button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors cursor-pointer"
              title="Assign from Main List, type in a Manual Integrator, or select from History of Used Integrators"
            >
              <Plus className="w-3 h-3" />
              <span>Edit / Add Integrator</span>
              <ChevronDown
                className={`w-3 h-3 text-sky-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Floating Dropdown Window (Rendered via Portal so it floats over the page and is never cut off) */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={floatingHubRef}
            style={{
              position: 'fixed',
              top: `${floatingPosition.top}px`,
              left: `${floatingPosition.left}px`,
              maxHeight: `calc(100vh - ${Math.max(24, floatingPosition.top + 16)}px)`,
            }}
            className="w-80 sm:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 z-[9999] ring-1 ring-slate-900/10 flex flex-col overflow-y-auto animate-fadeIn font-['Inter']"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 shrink-0">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-sky-600" />
                  <span>Assign Integrator Partner</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select from Official Channel Partners (OCP), type in a manual integrator, or reuse from history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Manual Type-In Entry Form (Assigns to project & saves to History of Used Integrators, NOT main list) */}
            <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl mb-3 shrink-0">
              <div className="text-[11px] font-bold text-purple-950 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Type In Manual Integrator Partner</span>
                </span>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                  Saved to History Only
                </span>
              </div>
              <p className="text-[10px] text-purple-800/90 mb-2">
                Manually typed integrators are assigned to this project and kept in your{' '}
                <strong>History of Used Integrators</strong> (not added to the main list).
              </p>

              <form onSubmit={handleAddCustomPartner} className="flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type integrator name (e.g. Apex Tech, Lone Star IoT)..."
                  value={customPartnerInput}
                  onChange={(e) => {
                    setCustomPartnerInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-purple-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign</span>
                </button>
              </form>

              {errorMessage && (
                <p className="text-[11px] text-rose-600 mt-1.5 font-medium">{errorMessage}</p>
              )}
              {feedbackMessage && (
                <p className="text-[11px] text-emerald-700 mt-1.5 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>{feedbackMessage}</span>
                </p>
              )}
            </div>

            {/* Filter Tabs between Main List and History of Used Integrators */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mb-2.5 text-[11px] font-bold shrink-0">
              <button
                type="button"
                onClick={() => setActiveView('all')}
                className={`flex-1 py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  activeView === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Sections
              </button>
              <button
                type="button"
                onClick={() => setActiveView('main')}
                className={`flex-1 py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  activeView === 'main'
                    ? 'bg-white text-sky-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OCP Partners ({mainPartners.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveView('history')}
                className={`flex-1 py-1 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeView === 'history'
                    ? 'bg-white text-purple-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3 h-3 text-purple-600" />
                <span>Used History ({usedHistory.length})</span>
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {/* SECTION 1: Official Channel Partners (OCP) List */}
              {(activeView === 'all' || activeView === 'main') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                      Official Channel Partners (OCP)
                    </span>
                    <span className="text-[10px] text-slate-400">Verified Directory</span>
                  </div>

                  {mainPartners.map((partner) => {
                    const isChecked = assignedPartners.includes(partner);

                    return (
                      <button
                        type="button"
                        key={partner}
                        onClick={() => handleTogglePartner(partner, false)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer text-left ${
                          isChecked
                            ? 'bg-sky-50 border-sky-300 text-sky-950 font-semibold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="font-bold">{partner}</span>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 border border-sky-300 px-1.5 py-0.2 rounded">
                            OCP
                          </span>
                        </div>
                        {isChecked && (
                          <span className="text-[11px] text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded">
                            Assigned
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SECTION 2: History of Used Integrators (Separate from Main List) */}
              {(activeView === 'all' || activeView === 'history') && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                      <History className="w-3 h-3 text-purple-600" />
                      <span>History of Used Integrators (Manual Entries)</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-600 font-semibold">
                      {usedHistory.length} saved
                    </span>
                  </div>

                  {usedHistory.length === 0 ? (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-[11px] text-slate-500">
                      No manually entered integrators in history yet. Type an integrator above to assign it to this project and save it here.
                    </div>
                  ) : (
                    usedHistory.map((entry) => {
                      const isChecked = assignedPartners.some(
                        (p) => p.toLowerCase() === entry.name.toLowerCase()
                      );

                      return (
                        <div
                          key={entry.name}
                          onClick={() => handleTogglePartner(entry.name, true)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer text-left ${
                            isChecked
                              ? 'bg-purple-50 border-purple-300 text-purple-950 font-semibold'
                              : 'bg-white hover:bg-purple-50/40 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold truncate">{entry.name}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded shrink-0">
                                  History
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {entry.lastUsedOnProject
                                  ? `Last used on ${entry.lastUsedOnProject} · ${entry.lastUsedAt}`
                                  : `Last used: ${entry.lastUsedAt}`}
                                {entry.usedCount > 1 ? ` (${entry.usedCount}x)` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {isChecked ? (
                              <span className="text-[10px] text-purple-800 font-bold bg-purple-100 px-2 py-0.5 rounded">
                                Assigned
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 hover:text-purple-700 font-semibold px-1.5 py-0.5 rounded bg-slate-100">
                                + Assign
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteFromHistory(entry.name, e)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                              title={`Remove "${entry.name}" from History of Used Integrators`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Summary / Done Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] shrink-0">
              <span className="text-slate-500">
                <strong className="text-slate-800">{assignedPartners.length}</strong> partner(s) assigned to project
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
