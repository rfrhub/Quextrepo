import React, { useState } from 'react';
import { OperationProject } from '../types';
import {
  RotateCcw,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar,
  FileText,
} from 'lucide-react';
import { resetProjectMilestonesToKickoff } from '../data/initialData';

interface ResetMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: OperationProject;
  currentUserName?: string;
  onConfirmReset: (updatedProject: OperationProject) => void;
}

export const ResetMilestonesModal: React.FC<ResetMilestonesModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUserName = 'Raul Recalde',
  onConfirmReset,
}) => {
  const [kickoffStatus, setKickoffStatus] = useState<'In Progress' | 'Upcoming'>('In Progress');
  const [addAuditNote, setAddAuditNote] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMilestones = project.milestones || [];
  const completedCount = currentMilestones.filter((m) => m.status === 'Completed').length;
  const inProgressMilestone = currentMilestones.find((m) => m.status === 'In Progress');
  const activeMilestone =
    inProgressMilestone ||
    currentMilestones.find((m) => m.status === 'Upcoming') ||
    currentMilestones[currentMilestones.length - 1] || {
      title: 'Project kickoff',
      status: 'Upcoming',
    };

  const handleExecuteReset = () => {
    setIsSubmitting(true);
    try {
      const updated = resetProjectMilestonesToKickoff(
        project,
        kickoffStatus,
        currentUserName,
        addAuditNote
      );
      onConfirmReset(updated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <RotateCcw className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Reset Milestones to Project Kickoff
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  PM Scope
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <span className="font-semibold text-white">{project.propertyName}</span> · Quote #{project.quoteNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Are you sure you want to reset milestone progress?</span>
              <p className="mt-1 text-amber-800">
                This will roll back all milestone execution progress on{' '}
                <strong className="text-amber-950">{project.propertyName}</strong> back to the beginning (
                <strong>Project kickoff</strong>). All downstream milestones will be returned to <em>Upcoming</em>, and previous milestone completion timestamps will be cleared.
              </p>
            </div>
          </div>

          {/* Current vs New State Comparison */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Milestone Transition Preview
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
              {/* Current */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current State</span>
                <div className="font-bold text-xs text-slate-900 truncate">{activeMilestone.title}</div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      activeMilestone.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeMilestone.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {activeMilestone.status}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    ({completedCount}/7 Done)
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 hidden sm:block" />
                <span className="text-xs font-bold sm:hidden">↓</span>
              </div>

              {/* New */}
              <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-300 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">After Reset</span>
                <div className="font-bold text-xs text-emerald-950 truncate">Project kickoff</div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      kickoffStatus === 'In Progress'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {kickoffStatus}
                  </span>
                  <span className="text-emerald-800 font-mono text-[10px] font-semibold">
                    (0/7 Done · Beginning)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Kickoff Status Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Choose Initial Status for Milestone 1 (&quot;Project kickoff&quot;):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setKickoffStatus('In Progress')}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  kickoffStatus === 'In Progress'
                    ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    In Progress
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Kickoff is immediately active so the team can resume intake and portal orientation.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setKickoffStatus('Upcoming')}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  kickoffStatus === 'Upcoming'
                    ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Upcoming
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    Unstarted
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  All 7 milestones will be set to Upcoming (clean unstarted slate).
                </p>
              </button>
            </div>
          </div>

          {/* Options & Notes */}
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addAuditNote}
                onChange={(e) => setAddAuditNote(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Record audit note in Project Notes</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Logs a timestamped entry authored by <strong>{currentUserName}</strong> for full team transparency.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 text-slate-600 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Hardware BOM counts, install logs with photos, customer intake, and SOW records will <strong>not</strong> be affected.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteReset}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-rose-600/30 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Resetting...' : 'Reset Milestones to Kickoff'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
