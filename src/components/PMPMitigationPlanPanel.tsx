import React, { useState, useEffect } from 'react';
import {
  OperationProject,
  PMPMitigationPlan,
  PMPMitigationActionItem,
  PMPMitigationStrategyType,
  PMPMitigationActionPhase,
  calculateProjectScheduleHealth,
  generateTailoredPMPMitigationPlan,
  getEffectivePMPMitigationPlan,
} from '../types';
import {
  ShieldAlert,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  GitBranch,
  Layers,
  X,
  ClipboardCheck,
} from 'lucide-react';

interface PMPMitigationPlanPanelProps {
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
  variant?: 'full' | 'compact';
  defaultExpanded?: boolean;
}

const STRATEGY_OPTIONS: PMPMitigationStrategyType[] = [
  'Fast Tracking (Parallel Execution)',
  'Crashing & Resource Compression',
  'Critical Path Decoupling & Escalation',
  'Hybrid PMBOK Schedule Recovery',
];

const PHASE_OPTIONS: PMPMitigationActionPhase[] = [
  'Immediate (24-48h)',
  'Short-Term (7 Days)',
  'Milestone Recovery',
  'Risk Control',
];

export const PMPMitigationPlanPanel: React.FC<PMPMitigationPlanPanelProps> = ({
  project,
  onUpdateProject,
  variant = 'full',
  defaultExpanded = true,
}) => {
  const health = calculateProjectScheduleHealth(
    project.targetCompletionDate,
    project.statusTag,
    project.milestones,
    project.notes
  );

  const effectivePlan = getEffectivePMPMitigationPlan(project);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [draftPlan, setDraftPlan] = useState<PMPMitigationPlan>(effectivePlan);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Keep draft synced when project or notes change (unless actively editing)
  useEffect(() => {
    if (!isEditing) {
      setDraftPlan(getEffectivePMPMitigationPlan(project));
    }
  }, [project, isEditing]);

  // Only render when tagged Behind Schedule or High Risk
  if (health.effectiveTag !== 'Behind Schedule' && health.effectiveTag !== 'High Risk') {
    return null;
  }

  const isHighRisk = health.effectiveTag === 'High Risk';
  const completedActionsCount = effectivePlan.actionItems.filter((a) => a.status === 'Completed').length;
  const inProgressActionsCount = effectivePlan.actionItems.filter((a) => a.status === 'In Progress').length;
  const totalActionsCount = effectivePlan.actionItems.length;
  const actionProgressPct =
    totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0;

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Save full edited plan back to project
  const handleSavePlan = () => {
    const updatedPlan: PMPMitigationPlan = {
      ...draftPlan,
      tailoredFromNotesCount: project.notes?.length || 0,
      lastEditedBy: project.assignedPM?.name || 'Project Manager',
      lastUpdated: new Date().toISOString(),
      isCustomEdited: true,
    };

    onUpdateProject({
      ...project,
      pmpMitigationPlan: updatedPlan,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditing(false);
    triggerToast('PMP Mitigation Plan saved & updated.');
  };

  // Regenerate fresh plan tailored to latest project details & project notes
  const handleRegenerateFromNotes = () => {
    const freshPlan = generateTailoredPMPMitigationPlan(project);
    setDraftPlan(freshPlan);
    onUpdateProject({
      ...project,
      pmpMitigationPlan: freshPlan,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditing(false);
    triggerToast(`Re-synced PMP Mitigation Plan from project data & ${project.notes.length} project note(s).`);
  };

  // Quick-toggle an action item's status directly in view mode
  const handleCycleActionStatus = (actionId: string) => {
    const nextStatusMap: Record<PMPMitigationActionItem['status'], PMPMitigationActionItem['status']> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending',
    };

    const updatedItems = effectivePlan.actionItems.map((item) => {
      if (item.id === actionId) {
        return { ...item, status: nextStatusMap[item.status] };
      }
      return item;
    });

    const updatedPlan: PMPMitigationPlan = {
      ...effectivePlan,
      actionItems: updatedItems,
      lastEditedBy: project.assignedPM?.name || 'Project Manager',
      lastUpdated: new Date().toISOString(),
      isCustomEdited: true,
    };

    setDraftPlan(updatedPlan);
    onUpdateProject({
      ...project,
      pmpMitigationPlan: updatedPlan,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Add a new action item in edit mode
  const handleAddActionItem = () => {
    const newItem: PMPMitigationActionItem = {
      id: `pmp-act-custom-${Date.now()}`,
      phase: 'Immediate (24-48h)',
      pmpTechnique: 'PMBOK Risk Mitigation',
      action: '',
      owner: `${project.assignedPM?.name || 'PM'}`,
      status: 'Pending',
    };
    setDraftPlan((prev) => ({
      ...prev,
      actionItems: [...prev.actionItems, newItem],
    }));
  };

  // Update a specific action item in edit mode
  const handleUpdateDraftActionItem = (
    actionId: string,
    field: keyof PMPMitigationActionItem,
    value: string
  ) => {
    setDraftPlan((prev) => ({
      ...prev,
      actionItems: prev.actionItems.map((item) =>
        item.id === actionId ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Delete an action item in edit mode
  const handleDeleteDraftActionItem = (actionId: string) => {
    setDraftPlan((prev) => ({
      ...prev,
      actionItems: prev.actionItems.filter((item) => item.id !== actionId),
    }));
  };

  // Log mitigation snapshot to Project Notes
  const handleLogPlanToProjectNotes = () => {
    const activeActionsSummary = effectivePlan.actionItems
      .map((a, idx) => `${idx + 1}) [${a.status}] ${a.action} (${a.owner})`)
      .join(' ');
    const newNote = {
      id: `note-pmp-${Date.now()}`,
      projectId: project.id,
      author: project.assignedPM?.name || 'Project Manager',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      category: 'General Context' as const,
      text: `PMP Mitigation Plan (${effectivePlan.strategyType} · Target Recovery: ${effectivePlan.targetRecoveryDate}): ${activeActionsSummary}`,
      isPinned: true,
    };

    onUpdateProject({
      ...project,
      pmpMitigationPlan: {
        ...effectivePlan,
        tailoredFromNotesCount: (project.notes?.length || 0) + 1,
      },
      notes: [newNote, ...(project.notes || [])],
      lastUpdated: new Date().toISOString(),
    });
    triggerToast('Logged PMP Mitigation Plan snapshot to pinned Project Notes.');
  };

  // Compact card view (for Dashboard Roadblock cards & All Projects directory cards)
  if (variant === 'compact') {
    return (
      <div
        className={`mt-2.5 rounded-xl border transition-all ${
          isHighRisk
            ? 'bg-rose-50/95 border-rose-300 text-rose-950'
            : 'bg-amber-50/95 border-amber-300 text-amber-950'
        }`}
      >
        {/* Compact Header Bar */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldAlert
                className={`w-4 h-4 shrink-0 ${
                  isHighRisk ? 'text-rose-600' : 'text-amber-600'
                }`}
              />
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                  <span>PMP Mitigation Plan</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      isHighRisk
                        ? 'bg-rose-200/80 text-rose-900 border-rose-300'
                        : 'bg-amber-200/80 text-amber-900 border-amber-300'
                    }`}
                  >
                    {effectivePlan.strategyType}
                  </span>
                </div>
                <div className="text-[10px] opacity-80 font-medium mt-0.5">
                  Tailored from BOM &amp; {project.notes?.length || 0} Project Note
                  {(project.notes?.length || 0) === 1 ? '' : 's'} ·{' '}
                  <strong>
                    {completedActionsCount}/{totalActionsCount} Actions Done
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => !prev);
                  if (!isExpanded) {
                    setDraftPlan(effectivePlan);
                  }
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-colors cursor-pointer ${
                  isHighRisk
                    ? 'bg-white hover:bg-rose-100 text-rose-900 border-rose-300'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{isExpanded ? 'Hide Plan' : 'View / Edit Plan'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Preview of Top Tailored Action Item when collapsed */}
          {!isExpanded && effectivePlan.actionItems[0] && (
            <div className="p-2 bg-white/90 rounded-lg border border-black/10 text-[11px] text-slate-800 space-y-1">
              <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-slate-500">
                <span className="truncate">{effectivePlan.actionItems[0].pmpTechnique}</span>
                <span className="font-mono text-slate-600 shrink-0">
                  Recovery: {effectivePlan.targetRecoveryDate}
                </span>
              </div>
              <div className="text-slate-900 font-medium leading-snug line-clamp-2">
                {effectivePlan.actionItems[0].action}
              </div>
            </div>
          )}
        </div>

        {/* Expanded Full Interactive Editor inside Compact Card */}
        {isExpanded && (
          <div
            className="p-3 pt-0 border-t border-black/10 space-y-3 bg-white/90 rounded-b-xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {saveToast && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold flex items-center justify-between">
                <span>✓ {saveToast}</span>
                <button
                  type="button"
                  onClick={() => setSaveToast(null)}
                  className="text-emerald-700 hover:text-emerald-950"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>PMBOK® Tailored Schedule &amp; Risk Mitigation</span>
              </div>
              <div className="flex items-center gap-1.5">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftPlan(effectivePlan);
                        setIsEditing(true);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateFromNotes}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      title="Re-generate plan from latest project details and project notes"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Sync Notes</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSavePlan}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftPlan(effectivePlan);
                        setIsEditing(false);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                      PMP Strategy Type
                    </label>
                    <select
                      value={draftPlan.strategyType}
                      onChange={(e) =>
                        setDraftPlan((prev) => ({
                          ...prev,
                          strategyType: e.target.value as PMPMitigationStrategyType,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-900"
                    >
                      {STRATEGY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                      Target Recovery Date
                    </label>
                    <input
                      type="date"
                      value={draftPlan.targetRecoveryDate}
                      onChange={(e) =>
                        setDraftPlan((prev) => ({
                          ...prev,
                          targetRecoveryDate: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Root Cause &amp; Project Notes Synthesis
                  </label>
                  <textarea
                    rows={3}
                    value={draftPlan.rootCauseSynthesis}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({ ...prev, rootCauseSynthesis: e.target.value }))
                    }
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Schedule Compression Strategy (Fast Tracking / Crashing)
                  </label>
                  <textarea
                    rows={3}
                    value={draftPlan.scheduleCompressionPlan}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({ ...prev, scheduleCompressionPlan: e.target.value }))
                    }
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Stakeholder &amp; Vendor Escalation Plan
                  </label>
                  <textarea
                    rows={2}
                    value={draftPlan.stakeholderEscalationPlan}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        stakeholderEscalationPlan: e.target.value,
                      }))
                    }
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  />
                </div>

                {/* Editable Action Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">
                      Tailored PMP Action Steps ({draftPlan.actionItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddActionItem}
                      className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Step</span>
                    </button>
                  </div>

                  {draftPlan.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <select
                          value={item.phase}
                          onChange={(e) =>
                            handleUpdateDraftActionItem(item.id, 'phase', e.target.value)
                          }
                          className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-semibold"
                        >
                          {PHASE_OPTIONS.map((ph) => (
                            <option key={ph} value={ph}>
                              {ph}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={item.pmpTechnique}
                          onChange={(e) =>
                            handleUpdateDraftActionItem(item.id, 'pmpTechnique', e.target.value)
                          }
                          placeholder="PMP Technique"
                          className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded flex-1 min-w-[110px]"
                        />
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateDraftActionItem(item.id, 'status', e.target.value)
                          }
                          className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-bold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteDraftActionItem(item.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete step"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={item.action}
                        onChange={(e) =>
                          handleUpdateDraftActionItem(item.id, 'action', e.target.value)
                        }
                        placeholder="Action item description..."
                        className="w-full p-1.5 text-[11px] bg-white border border-slate-300 rounded text-slate-900"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-semibold">Owner:</span>
                        <input
                          type="text"
                          value={item.owner}
                          onChange={(e) =>
                            handleUpdateDraftActionItem(item.id, 'owner', e.target.value)
                          }
                          className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 uppercase text-[10px]">
                    1. Root Cause &amp; Notes Synthesis
                  </div>
                  <p className="text-slate-800 leading-relaxed">{effectivePlan.rootCauseSynthesis}</p>
                </div>

                <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-1">
                  <div className="font-bold text-indigo-950 uppercase text-[10px]">
                    2. Schedule Compression ({effectivePlan.strategyType})
                  </div>
                  <p className="text-slate-800 leading-relaxed">
                    {effectivePlan.scheduleCompressionPlan}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 uppercase text-[10px] flex items-center justify-between">
                    <span>3. Tailored Action Plan (Click status to update)</span>
                    <span className="font-mono text-indigo-700">{actionProgressPct}% Complete</span>
                  </div>
                  {effectivePlan.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300">
                            {item.phase}
                          </span>
                          <span className="text-[9px] font-bold text-indigo-700">
                            {item.pmpTechnique}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] font-medium ${
                            item.status === 'Completed'
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.action}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Owner: <strong className="text-slate-700">{item.owner}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCycleActionStatus(item.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-sky-100 text-sky-800 border-sky-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                        title="Click to cycle status (Pending → In Progress → Completed)"
                      >
                        {item.status}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // FULL VARIANT (For ProjectDetailView and Dashboard Expanded Modal/Drawer)
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border-2 space-y-4 animate-fadeIn shadow-xs ${
        isHighRisk
          ? 'bg-gradient-to-br from-rose-50 via-white to-rose-50/70 border-rose-300 text-slate-900'
          : 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/60 border-amber-300 text-slate-900'
      }`}
    >
      {/* Top Banner Header */}
      <div
        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b ${
          isHighRisk ? 'border-rose-200' : 'border-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
              isHighRisk
                ? 'bg-rose-100 border-rose-300 text-rose-700'
                : 'bg-amber-100 border-amber-300 text-amber-700'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-extrabold font-mono rounded uppercase tracking-wider border ${
                  isHighRisk
                    ? 'bg-rose-200 text-rose-950 border-rose-300'
                    : 'bg-amber-200 text-amber-950 border-amber-300'
                }`}
              >
                {health.effectiveTag} · PMP® Mitigation Framework
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
                Strategy: {effectivePlan.strategyType}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
                Tailored from BOM &amp; {project.notes?.length || 0} Project Note
                {(project.notes?.length || 0) === 1 ? '' : 's'}
              </span>
              {effectivePlan.isCustomEdited && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Edited by {effectivePlan.lastEditedBy || project.assignedPM.name}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
              Project Management Professional (PMP) Tailored Mitigation &amp; Recovery Plan
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Synthesized using PMBOK® Critical Path Method (CPM), Schedule Compression (Fast Tracking / Crashing), and Risk Response strategies tailored around{' '}
              <strong className="text-slate-800">{project.propertyName}</strong> telemetry and field notes.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraftPlan(effectivePlan);
                  setIsEditing(true);
                  setIsExpanded(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Mitigation Plan</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateFromNotes}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Re-synthesize plan from current project status and latest Project Notes"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Re-Sync with Notes</span>
              </button>

              <button
                type="button"
                onClick={handleLogPlanToProjectNotes}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Pin a snapshot of this mitigation plan to the Project Notes log"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pin to Project Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-xl text-xs cursor-pointer"
                title={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSavePlan}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Mitigation Plan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftPlan(effectivePlan);
                  setIsEditing(false);
                }}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Toast */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(null)}
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Strip: Schedule Variance, Action Completion, Target Recovery Date, Active Notes Analyzed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Schedule Variance (SV)
            </div>
            <div
              className={`text-sm font-extrabold font-mono mt-0.5 ${
                isHighRisk ? 'text-rose-700' : 'text-amber-700'
              }`}
            >
              {health.weeksBehindLabel}
            </div>
            <div className="text-[11px] text-slate-500">
              Baseline Target: {project.targetCompletionDate}
            </div>
          </div>
          <Clock className={`w-5 h-5 ${isHighRisk ? 'text-rose-500' : 'text-amber-500'}`} />
        </div>

        <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              PMP Target Recovery Date
            </div>
            <div className="text-sm font-extrabold font-mono text-indigo-900 mt-0.5">
              {effectivePlan.targetRecoveryDate}
            </div>
            <div className="text-[11px] text-slate-500">
              Lead PM: <strong className="text-slate-700">{project.assignedPM.name}</strong>
            </div>
          </div>
          <Target className="w-5 h-5 text-indigo-600" />
        </div>

        <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Mitigation Action Progress</span>
              <span className="font-mono text-indigo-700">{actionProgressPct}%</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {completedActionsCount} Completed · {inProgressActionsCount} In Progress
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${actionProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Project Notes Incorporated
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {project.notes?.length || 0} Field Note{(project.notes?.length || 0) === 1 ? '' : 's'} &amp; Logs
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[190px]">
              {project.notes?.[0]
                ? `Latest: [${project.notes[0].category}]`
                : 'Derived from PM status & BOM'}
            </div>
          </div>
          <FileText className="w-5 h-5 text-sky-600" />
        </div>
      </div>

      {isExpanded && (
        <>
          {/* EDIT MODE VIEW */}
          {isEditing ? (
            <div className="p-4 sm:p-5 bg-white rounded-xl border-2 border-indigo-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Editing Tailored PMP Mitigation Plan — {project.propertyName}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  Changes save directly to this project&apos;s operational record
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary PMBOK Schedule &amp; Risk Strategy
                  </label>
                  <select
                    value={draftPlan.strategyType}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        strategyType: e.target.value as PMPMitigationStrategyType,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    {STRATEGY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Schedule Recovery Date
                  </label>
                  <input
                    type="date"
                    value={draftPlan.targetRecoveryDate}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        targetRecoveryDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. PMBOK Qualitative Risk &amp; Root Cause Synthesis (Project &amp; Notes)
                  </label>
                  <textarea
                    rows={4}
                    value={draftPlan.rootCauseSynthesis}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        rootCauseSynthesis: e.target.value,
                      }))
                    }
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Schedule Compression Plan (Fast Tracking, Crashing &amp; Resource Leveling)
                  </label>
                  <textarea
                    rows={4}
                    value={draftPlan.scheduleCompressionPlan}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        scheduleCompressionPlan: e.target.value,
                      }))
                    }
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Stakeholder Engagement &amp; Third-Party Escalation Matrix
                  </label>
                  <textarea
                    rows={4}
                    value={draftPlan.stakeholderEscalationPlan}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        stakeholderEscalationPlan: e.target.value,
                      }))
                    }
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. Contingency Reserve &amp; Workaround Protocol
                  </label>
                  <textarea
                    rows={4}
                    value={draftPlan.contingencyReserveNotes}
                    onChange={(e) =>
                      setDraftPlan((prev) => ({
                        ...prev,
                        contingencyReserveNotes: e.target.value,
                      }))
                    }
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Editable Action Register */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      5. Tailored PMP Action Register ({draftPlan.actionItems.length} Steps)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Customize action descriptions, assign owners, adjust PMP techniques, or add new mitigation steps.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddActionItem}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add PMP Action Step</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {draftPlan.actionItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 flex-1">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            #{idx + 1}
                          </span>
                          <select
                            value={item.phase}
                            onChange={(e) =>
                              handleUpdateDraftActionItem(item.id, 'phase', e.target.value)
                            }
                            className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                          >
                            {PHASE_OPTIONS.map((ph) => (
                              <option key={ph} value={ph}>
                                {ph}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={item.pmpTechnique}
                            onChange={(e) =>
                              handleUpdateDraftActionItem(item.id, 'pmpTechnique', e.target.value)
                            }
                            placeholder="PMP Technique (e.g., Fast Tracking)"
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-indigo-900 min-w-[200px] flex-1"
                          />

                          <input
                            type="text"
                            value={item.owner}
                            onChange={(e) =>
                              handleUpdateDraftActionItem(item.id, 'owner', e.target.value)
                            }
                            placeholder="Assigned Owner"
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 min-w-[160px]"
                          />

                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateDraftActionItem(item.id, 'status', e.target.value)
                            }
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteDraftActionItem(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Remove action step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={item.action}
                        onChange={(e) =>
                          handleUpdateDraftActionItem(item.id, 'action', e.target.value)
                        }
                        placeholder="Describe the concrete mitigation step tailored to the project..."
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setDraftPlan(effectivePlan);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tailored Mitigation Plan</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW MODE: 4 PMP Pillars + Interactive Action Checklist */
            <div className="space-y-4">
              {/* Highlighted Project Notes Context Bar */}
              {project.notes && project.notes.length > 0 && (
                <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Project Notes Driving This Tailored Mitigation Plan:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2"
                      >
                        <AlertTriangle
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isHighRisk ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        />
                        <div>
                          <span className="font-bold text-slate-900">[{note.category}]</span>{' '}
                          <span>&ldquo;{note.text}&rdquo;</span>
                          <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                            Logged by {note.author} · {note.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4 PMP Knowledge Area Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-white/95 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <AlertTriangle
                        className={`w-3.5 h-3.5 ${
                          isHighRisk ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      />
                      <span>1. PMBOK Qualitative Risk &amp; Root Cause Analysis</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Identify &amp; Analyze Risks
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {effectivePlan.rootCauseSynthesis}
                  </p>
                </div>

                <div className="p-3.5 bg-white/95 rounded-xl border border-indigo-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                      <span>2. Schedule Compression ({effectivePlan.strategyType})</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Control Schedule
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {effectivePlan.scheduleCompressionPlan}
                  </p>
                </div>

                <div className="p-3.5 bg-white/95 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      <span>3. Stakeholder &amp; Vendor Escalation Matrix</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                      Stakeholder Engagement
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {effectivePlan.stakeholderEscalationPlan}
                  </p>
                </div>

                <div className="p-3.5 bg-white/95 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>4. Contingency Reserve &amp; Workaround Protocol</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Plan Risk Responses
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {effectivePlan.contingencyReserveNotes}
                  </p>
                </div>
              </div>

              {/* Interactive PMP Action Register */}
              <div className="p-4 bg-white/95 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>5. Tailored PMP Mitigation Action Register ({totalActionsCount} Steps)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Click any status badge to toggle progress (Pending → In Progress → Completed), or click &ldquo;Edit Mitigation Plan&rdquo; to customize steps.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftPlan(effectivePlan);
                      setIsEditing(true);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add / Edit Action Steps</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {effectivePlan.actionItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              item.phase === 'Immediate (24-48h)'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : item.phase === 'Short-Term (7 Days)'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            }`}
                          >
                            {item.phase}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {item.pmpTechnique}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Owner: <strong className="text-slate-800">{item.owner}</strong>
                          </span>
                        </div>
                        <p
                          className={`text-xs font-medium leading-relaxed ${
                            item.status === 'Completed'
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.action}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCycleActionStatus(item.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : item.status === 'In Progress'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                          }`}
                          title="Click to cycle status"
                        >
                          {item.status === 'Completed' && '✓ '}
                          {item.status === 'In Progress' && '⏳ '}
                          {item.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
