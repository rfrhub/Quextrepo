import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OperationProject, calculateProjectScheduleHealth, getProjectPlatform, getPlatformBadgeStyle } from '../types';
import {
  Search,
  Building2,
  ChevronDown,
  Check,
  X,
  LayoutDashboard,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface SearchablePropertyPickerProps {
  projects: OperationProject[];
  selectedProjectId?: string | null;
  onSelectProject: (projectId: string) => void;
  onClearToDashboard?: () => void;
  className?: string;
}

export const SearchablePropertyPicker: React.FC<SearchablePropertyPickerProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onClearToDashboard,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Filter projects by property name, city, state, or PM
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const propName = (p.propertyName || '').toLowerCase();
      const city = (p.city || '').toLowerCase();
      const state = (p.state || '').toLowerCase();
      const pm = (p.assignedPM?.name || '').toLowerCase();
      const plat = getProjectPlatform(p).toLowerCase();
      const id = (p.id || '').toLowerCase();
      return (
        propName.includes(q) ||
        city.includes(q) ||
        state.includes(q) ||
        pm.includes(q) ||
        plat.includes(q) ||
        id.includes(q)
      );
    });
  }, [projects, searchQuery]);

  // Total selectable items (includes "Overview Dashboard" if onClearToDashboard provided and no query or matches query)
  const showDashboardOption = Boolean(onClearToDashboard) && (!searchQuery.trim() || 'overview dashboard all projects'.includes(searchQuery.toLowerCase()));

  // Reset highlighted index on search change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Auto focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (projectId: string) => {
    onSelectProject(projectId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleReturnToDashboard = () => {
    if (onClearToDashboard) {
      onClearToDashboard();
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = filteredProjects.length + (showDashboardOption ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showDashboardOption && highlightedIndex === 0) {
        handleReturnToDashboard();
      } else {
        const projectIndex = showDashboardOption ? highlightedIndex - 1 : highlightedIndex;
        const target = filteredProjects[projectIndex];
        if (target) {
          handleSelect(target.id);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative block sm:inline-block w-full sm:w-auto ${className}`}>
      {/* Trigger Button / Picker Input */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-w-[160px] sm:min-w-[240px] max-w-full sm:max-w-xs px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs ${
          isOpen
            ? 'bg-white border-sky-500 ring-2 ring-sky-500/20 text-slate-900'
            : selectedProject
            ? 'bg-sky-50/70 hover:bg-sky-50 border-sky-300 text-sky-950 hover:border-sky-400'
            : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Building2
            className={`w-3.5 h-3.5 shrink-0 ${
              selectedProject ? 'text-sky-600' : 'text-slate-400'
            }`}
          />
          {selectedProject ? (
            <div className="flex items-baseline gap-1.5 min-w-0 truncate text-left">
              <span className="font-bold text-slate-900 truncate">
                {selectedProject.propertyName}
              </span>
              <span className="text-[10px] text-slate-500 font-normal shrink-0">
                ({selectedProject.city})
              </span>
            </div>
          ) : (
            <span className="text-slate-500 font-medium">Jump to Property...</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedProject && onClearToDashboard && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleReturnToDashboard();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  handleReturnToDashboard();
                }
              }}
              className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Return to Overview Dashboard"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Searchable Picker Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-84 sm:w-96 max-w-[94vw] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-slate-900/10 animate-fadeIn">
          {/* Search Header */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search property by name, city, or PM..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-slate-400 font-medium">
              <span>
                {filteredProjects.length} {filteredProjects.length === 1 ? 'property' : 'properties'} found
              </span>
              <span className="hidden sm:inline">Use ↑↓ keys + Enter</span>
            </div>
          </div>

          {/* Scrollable List */}
          <div ref={listRef} className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {/* Overview Option */}
            {showDashboardOption && (
              <button
                type="button"
                onClick={handleReturnToDashboard}
                onMouseEnter={() => setHighlightedIndex(0)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  highlightedIndex === 0 ? 'bg-sky-50 text-sky-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                } ${!selectedProject ? 'bg-slate-50 font-semibold' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-3.5 h-3.5 text-sky-700" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Installation Overview Dashboard</div>
                    <div className="text-[10px] text-slate-500">View all projects &amp; operational metrics</div>
                  </div>
                </div>
                {!selectedProject && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
              </button>
            )}

            {filteredProjects.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-1">
                <AlertCircle className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  No properties match &quot;{searchQuery}&quot;
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching for a different property name or city.
                </p>
              </div>
            ) : (
              filteredProjects.map((project, idx) => {
                const isSelected = project.id === selectedProjectId;
                const itemIndex = showDashboardOption ? idx + 1 : idx;
                const isHighlighted = itemIndex === highlightedIndex;

                const health = calculateProjectScheduleHealth(
                  project.targetCompletionDate,
                  project.statusTag,
                  project.milestones,
                  project.notes
                );

                const statusColor =
                  health.effectiveTag === 'On Track'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : health.effectiveTag === 'High Risk'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleSelect(project.id)}
                    onMouseEnter={() => setHighlightedIndex(itemIndex)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/80 hover:bg-sky-100/70'
                        : isHighlighted
                        ? 'bg-slate-50'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs truncate ${
                              isSelected ? 'font-black text-sky-950' : 'font-bold text-slate-900'
                            }`}
                          >
                            {project.propertyName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${statusColor}`}
                          >
                            {health.effectiveTag}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              getPlatformBadgeStyle(getProjectPlatform(project)).badgeClass
                            }`}
                          >
                            {getProjectPlatform(project)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>
                            {project.city}, {project.state}
                          </span>
                          <span>•</span>
                          <span>{project.unitsCount} units</span>
                          {project.assignedPM?.name && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600">
                                PM: <strong>{project.assignedPM.name}</strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <Check className="w-4 h-4 text-sky-600" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
