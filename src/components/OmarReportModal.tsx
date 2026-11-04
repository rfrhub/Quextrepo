import React, { useState, useMemo } from 'react';
import { OperationProject } from '../types';
import {
  downloadOmarDashboardPdf,
  isProjectClosed,
  didProjectCloseInScope,
  parseDateComponents,
  OmarTimeframe,
} from '../utils/generateOmarDashboardPdf';
import {
  X,
  FileDown,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  Filter,
} from 'lucide-react';

export type OmarReportTimeframe = OmarTimeframe;

interface OmarReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: OperationProject[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getProjectDates(p: OperationProject) {
  const implM = p.milestones?.find(
    (m) => m.title === 'Implementation' || m.title.toLowerCase().includes('implement')
  );
  const closedM = p.milestones?.find(
    (m) => m.title === 'Project Closed' || m.title.toLowerCase().includes('closed')
  );

  const dates = [
    p.targetCompletionDate,
    p.startDate,
    (p as any).installationStartDate,
    (p as any).installationEndDate,
    implM?.targetDate,
    implM?.startedAt,
    implM?.completedDate,
    closedM?.completedDate,
    closedM?.targetDate,
  ].filter(Boolean) as string[];

  return dates.map(parseDateComponents).filter(Boolean) as {
    year: number;
    month: number;
    quarter: 1 | 2 | 3 | 4;
  }[];
}

export const OmarReportModal: React.FC<OmarReportModalProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYearVal = now.getFullYear();
  const currentQuarterVal = (Math.floor(currentMonthIdx / 3) + 1) as 1 | 2 | 3 | 4;

  const [timeframe, setTimeframe] = useState<OmarReportTimeframe>('all_time');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthIdx);
  const [selectedYear, setSelectedYear] = useState<number>(currentYearVal);
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(currentQuarterVal);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Compute filter label
  const filterLabel = useMemo(() => {
    switch (timeframe) {
      case 'current_month':
        return `${MONTH_NAMES[currentMonthIdx]} ${currentYearVal}`;
      case 'specific_month':
        return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
      case 'specific_quarter':
        return `Q${selectedQuarter} ${selectedYear}`;
      case 'current_year':
        return `${selectedYear} Full Year`;
      case 'all_time':
      default:
        return 'All Time Portfolio';
    }
  }, [timeframe, selectedMonth, selectedYear, selectedQuarter, currentMonthIdx, currentYearVal]);

  // Filter projects based on selected timeframe
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (timeframe === 'all_time') return true;

      const closed = isProjectClosed(p);
      if (closed) {
        // Closed project: check if its closure date falls within the timeframe
        return didProjectCloseInScope(p, {
          timeframe,
          selectedMonth,
          selectedYear,
          selectedQuarter,
        });
      }

      // Active project: check if its installation/milestone dates fall in the timeframe
      const projectDates = getProjectDates(p);
      if (projectDates.length === 0) {
        return timeframe === 'current_year';
      }

      if (timeframe === 'current_month') {
        return projectDates.some(
          (d) => d.year === currentYearVal && d.month === currentMonthIdx
        );
      }

      if (timeframe === 'specific_month') {
        return projectDates.some(
          (d) => d.year === selectedYear && d.month === selectedMonth
        );
      }

      if (timeframe === 'specific_quarter') {
        return projectDates.some(
          (d) => d.year === selectedYear && d.quarter === selectedQuarter
        );
      }

      if (timeframe === 'current_year') {
        return projectDates.some((d) => d.year === selectedYear);
      }

      return true;
    });
  }, [
    projects,
    timeframe,
    selectedMonth,
    selectedYear,
    selectedQuarter,
    currentMonthIdx,
    currentYearVal,
  ]);

  const closedCountInFiltered = useMemo(() => {
    return filteredProjects.filter((p) =>
      didProjectCloseInScope(p, {
        timeframe,
        selectedMonth,
        selectedYear,
        selectedQuarter,
      })
    ).length;
  }, [filteredProjects, timeframe, selectedMonth, selectedYear, selectedQuarter]);

  const totalUnitsInFiltered = useMemo(() => {
    return filteredProjects.reduce((sum, p) => sum + (p.unitsCount || 0), 0);
  }, [filteredProjects]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        downloadOmarDashboardPdf(filteredProjects, {
          filterLabel,
          fileName: `Quext_Master_Projects_Dashboard_${filterLabel.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
          timeframeScope: {
            timeframe,
            selectedMonth,
            selectedYear,
            selectedQuarter,
          },
        });
        onClose();
      } catch (err) {
        console.error('Failed to generate report PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                Export Master Projects Dashboard Report
              </h2>
              <p className="text-xs text-slate-400">
                Generate official executive landscape PDF with scorecard and milestone dates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-700">
          {/* Timeframe Scope Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Select Report Timeframe Scope</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTimeframe('all_time')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  timeframe === 'all_time'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold">All Time</div>
                <div className="text-[10px] text-slate-500">Full 167 portfolio</div>
              </button>

              <button
                type="button"
                onClick={() => setTimeframe('current_month')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  timeframe === 'current_month'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold">Current Month</div>
                <div className="text-[10px] text-slate-500">
                  {MONTH_NAMES[currentMonthIdx]} {currentYearVal}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTimeframe('current_year')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  timeframe === 'current_year'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold">Current Year</div>
                <div className="text-[10px] text-slate-500">Year {currentYearVal}</div>
              </button>

              <button
                type="button"
                onClick={() => setTimeframe('specific_quarter')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  timeframe === 'specific_quarter'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold">Specific Quarter</div>
                <div className="text-[10px] text-slate-500">Q1, Q2, Q3, or Q4</div>
              </button>

              <button
                type="button"
                onClick={() => setTimeframe('specific_month')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  timeframe === 'specific_month'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold">Specific Month</div>
                <div className="text-[10px] text-slate-500">Pick any month & year</div>
              </button>
            </div>
          </div>

          {/* Sub-selectors for Specific Month / Specific Quarter */}
          {timeframe === 'specific_month' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                >
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {timeframe === 'specific_quarter' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Quarter</label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                >
                  <option value={1}>Q1 (Jan - Mar)</option>
                  <option value={2}>Q2 (Apr - Jun)</option>
                  <option value={3}>Q3 (Jul - Sep)</option>
                  <option value={4}>Q4 (Oct - Dec)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                >
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Summary Preview Box */}
          <div className="p-3.5 bg-gradient-to-br from-sky-50/70 to-blue-50/50 border border-sky-200 rounded-xl flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-sky-600" />
                <span>Report Scope Preview</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">{filterLabel}</div>
              <div className="text-[11px] text-slate-600">
                {filteredProjects.length} total projects · {totalUnitsInFiltered.toLocaleString()} units ·{' '}
                <span className="font-semibold text-indigo-700">
                  {closedCountInFiltered} {closedCountInFiltered === 1 ? 'project' : 'projects'} closed in timeline
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-600 text-white font-mono font-bold text-xs shadow-2xs">
                {filteredProjects.length} Projects
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || filteredProjects.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-sky-400" />
                <span>Generate &amp; Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
