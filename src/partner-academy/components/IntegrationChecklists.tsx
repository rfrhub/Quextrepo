import React, { useState, useEffect } from 'react';
import { BRIVO_PLATFORM_CHECKLIST } from '../data/integrationChecklistsData';
import { generateAndDownloadBrivoPdf } from '../utils/generateBrivoPdfChecklist';
import {
  Download,
  Printer,
  Check,
  Calendar,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Layers,
  FileCheck2
} from 'lucide-react';

interface IntegrationChecklistsProps {
  onOpenCourse?: (moduleId: string) => void;
}

export const IntegrationChecklists: React.FC<IntegrationChecklistsProps> = () => {
  const STORAGE_KEY_CHECKED = 'quext_brivo_pdf_checked_items_v3';
  const STORAGE_KEY_STATUSES = 'quext_brivo_pdf_p1_statuses_v3';
  const STORAGE_KEY_NOTES = 'quext_brivo_pdf_p1_notes_v3';
  const STORAGE_KEY_DATE = 'quext_brivo_pdf_completion_date_v3';

  // Checked items for Phases 2, 3, 4
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Phase 1 statuses (Pending / In Progress / Verified)
  const [phase1Statuses, setPhase1Statuses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      p1_fob_type: 'Pending',
      p1_door_schedules: 'Pending',
      p1_access_rules: 'Pending',
      p1_elevator_control: 'Pending'
    };
  });

  // Phase 1 notes
  const [phase1Notes, setPhase1Notes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Phase 4 Completion Date
  const [completionDate, setCompletionDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATE);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return new Date().toISOString().split('T')[0];
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');
  const [paperTheme, setPaperTheme] = useState<'dark' | 'white'>('dark');

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(completedItems));
    } catch (e) {
      console.error(e);
    }
  }, [completedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(phase1Statuses));
    } catch (e) {
      console.error(e);
    }
  }, [phase1Statuses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(phase1Notes));
    } catch (e) {
      console.error(e);
    }
  }, [phase1Notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATE, completionDate);
    } catch (e) {
      console.error(e);
    }
  }, [completionDate]);

  // Total checkable items count
  const allCheckableItemIds = [
    ...BRIVO_PLATFORM_CHECKLIST.phase2.items.map((i) => i.id),
    ...BRIVO_PLATFORM_CHECKLIST.phase3.step1.items.map((i) => i.id),
    ...BRIVO_PLATFORM_CHECKLIST.phase3.step2.items.map((i) => i.id),
    ...BRIVO_PLATFORM_CHECKLIST.phase3.step3.items.map((i) => i.id),
    ...BRIVO_PLATFORM_CHECKLIST.phase4.items.map((i) => i.id)
  ];

  const totalTasks = BRIVO_PLATFORM_CHECKLIST.phase1.items.length + allCheckableItemIds.length;
  const verifiedP1Count = Object.values(phase1Statuses).filter((s) => s === 'Verified').length;
  const totalCompleted = verifiedP1Count + completedItems.length;
  const progressPercent = Math.round((totalCompleted / (totalTasks || 1)) * 100);

  const toggleCheckbox = (id: string) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateP1Status = (id: string, status: string) => {
    setPhase1Statuses((prev) => ({
      ...prev,
      [id]: status
    }));
  };

  const updateP1Note = (id: string, note: string) => {
    setPhase1Notes((prev) => ({
      ...prev,
      [id]: note
    }));
  };

  const handleCheckAll = () => {
    setCompletedItems(allCheckableItemIds);
    setPhase1Statuses({
      p1_fob_type: 'Verified',
      p1_door_schedules: 'Verified',
      p1_access_rules: 'Verified',
      p1_elevator_control: 'Verified'
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist items and statuses?')) {
      setCompletedItems([]);
      setPhase1Statuses({
        p1_fob_type: 'Pending',
        p1_door_schedules: 'Pending',
        p1_access_rules: 'Pending',
        p1_elevator_control: 'Pending'
      });
      setPhase1Notes({});
    }
  };

  const handleDownloadPdf = (theme: 'white' | 'dark') => {
    setIsExporting(true);
    setExportMessage(`Generating ${theme === 'dark' ? 'Obsidian Dark' : 'Printable White'} PDF...`);

    setTimeout(() => {
      try {
        generateAndDownloadBrivoPdf({
          theme,
          completedItemIds: completedItems,
          phase1Statuses,
          phase1Notes,
          completionDate
        });
        setExportMessage('Downloaded!');
        setTimeout(() => {
          setIsExporting(false);
          setExportMessage('');
        }, 1000);
      } catch (err) {
        console.error(err);
        setIsExporting(false);
        setExportMessage('');
        window.print();
      }
    }, 200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* EXPORTING NOTIFICATION OVERLAY */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121e] border border-purple-500 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center mx-auto text-purple-300 animate-pulse">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Exporting PDF Checklist</h4>
              <p className="text-xs text-purple-300 font-mono mt-1">{exportMessage}</p>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integration Checklists</span>
            <span>·</span>
            <span>Checklist 01</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-purple-400" />
            <span>Brivo + Quext integration Checklist</span>
          </h2>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Theme Display Toggle */}
          <button
            onClick={() => setPaperTheme(paperTheme === 'dark' ? 'white' : 'dark')}
            className="px-3.5 py-2 rounded-xl bg-[#111728] border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{paperTheme === 'dark' ? 'Theme: Obsidian Dark' : 'Theme: Clean White'}</span>
          </button>

          {/* Download Dark PDF */}
          <button
            onClick={() => handleDownloadPdf('dark')}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-950/50 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Download White PDF */}
          <button
            onClick={() => handleDownloadPdf('white')}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Printable White PDF</span>
          </button>

          {/* Browser Print */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-zinc-800"
            title="Print or Save via Browser"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Reset / Check All */}
          <button
            onClick={handleCheckAll}
            className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Check All
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Reset All"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DOCUMENT CANVAS CONTAINER (Supports Dark Obsidian & Clean White Theme) */}
      <div
        className={`rounded-2xl p-6 sm:p-12 shadow-2xl transition-colors border ${
          paperTheme === 'white'
            ? 'bg-[#ffffff] text-[#111827] border-zinc-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
            : 'bg-[#0a0e18] text-zinc-100 border-zinc-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* DOCUMENT HEADER */}
        <div className="text-center space-y-3 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-blue-500">Brivo + Quext</span>{' '}
            <span className="text-purple-600 dark:text-purple-400">integration Checklist</span>
          </h1>

          {/* Centered Progress Tracker Pill */}
          <div className="flex justify-center pt-1">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold border ${
                paperTheme === 'white'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-purple-950/60 text-purple-300 border-purple-800/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              <span>
                Verified: {totalCompleted} of {totalTasks} Tasks ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PHASE 1: PRE-INTEGRATION INFORMATION GATHERING                    */}
        {/* ================================================================= */}
        <section className="space-y-4 pt-6 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2
              className={`text-base sm:text-lg font-bold tracking-tight ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-white'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase1.title}
            </h2>
          </div>

          {/* Table Matching Document */}
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`border-t border-b ${
                    paperTheme === 'white' ? 'border-zinc-200 text-zinc-900 font-bold' : 'border-zinc-800 text-zinc-200 font-bold'
                  }`}
                >
                  <th className="py-2.5 pr-4 font-bold w-1/5">Item / Scope</th>
                  <th className="py-2.5 px-4 font-bold w-2/5">Configuration Details</th>
                  <th className="py-2.5 px-4 font-bold w-1/6">Status</th>
                  <th className="py-2.5 pl-4 font-bold w-1/4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {BRIVO_PLATFORM_CHECKLIST.phase1.items.map((row) => {
                  const currentStatus = phase1Statuses[row.id] || row.defaultStatus;
                  const currentNote = phase1Notes[row.id] || '';

                  return (
                    <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3.5 pr-4 font-bold align-top">
                        <span className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                          {row.scope}
                        </span>
                      </td>

                      <td
                        className={`py-3.5 px-4 align-top leading-relaxed ${
                          paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'
                        }`}
                      >
                        {row.configurationDetails}
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        {/* Interactive Status Pill Button */}
                        <div className="inline-flex rounded-full overflow-hidden shadow-sm">
                          <button
                            onClick={() => {
                              const next =
                                currentStatus === 'Pending'
                                  ? 'In Progress'
                                  : currentStatus === 'In Progress'
                                  ? 'Verified'
                                  : 'Pending';
                              updateP1Status(row.id, next);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition-all cursor-pointer border ${
                              currentStatus === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                                : currentStatus === 'In Progress'
                                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700'
                                : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50'
                            }`}
                            title="Click to cycle status: Pending → In Progress → Verified"
                          >
                            {currentStatus}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 pl-4 align-top">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => updateP1Note(row.id, e.target.value)}
                          placeholder={row.notesPlaceholder}
                          className={`w-full text-xs px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                            paperTheme === 'white'
                              ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-purple-600 focus:bg-white placeholder-zinc-400'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-purple-400 focus:bg-black placeholder-zinc-500'
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PHASE 2: EXTERNAL SETUP (CUSTOMER, BRIVO RESELLER & BRIVO)        */}
        {/* ================================================================= */}
        <section className="space-y-4 py-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2
              className={`text-base sm:text-lg font-bold tracking-tight ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-white'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase2.title}
            </h2>
          </div>

          <div className="space-y-3 pt-1">
            {BRIVO_PLATFORM_CHECKLIST.phase2.items.map((item) => {
              const isChecked = completedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheckbox(item.id)}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheckbox(item.id);
                    }}
                    className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : paperTheme === 'white'
                        ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                        : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="text-xs sm:text-sm leading-relaxed">
                    <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                      {item.title}:{' '}
                    </strong>
                    <span className={paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'}>
                      {item.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* PHASE 3: INTERNAL QUEXT TECHNICAL IMPLEMENTATION                  */}
        {/* ================================================================= */}
        <section className="space-y-6 py-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2
              className={`text-base sm:text-lg font-bold tracking-tight ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-white'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase3.title}
            </h2>
          </div>

          {/* STEP 1: API Entry & Provisioning */}
          <div className="space-y-3">
            <h3
              className={`text-xs sm:text-sm font-bold ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-purple-300'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase3.step1.stepTitle}
            </h3>

            <div className="space-y-3 pl-1">
              {BRIVO_PLATFORM_CHECKLIST.phase3.step1.items.map((item) => {
                const isChecked = completedItems.includes(item.id);

                return (
                  <div key={item.id} className="space-y-1">
                    <div
                      onClick={() => toggleCheckbox(item.id)}
                      className="flex items-start gap-3 cursor-pointer group select-none"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCheckbox(item.id);
                        }}
                        className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : paperTheme === 'white'
                            ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                            : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="text-xs sm:text-sm leading-relaxed">
                        <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                          {item.title}:{' '}
                        </strong>
                        <span className={paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Sub-bullets */}
                    {item.subBullets && item.subBullets.length > 0 && (
                      <div className="pl-7 space-y-1">
                        {item.subBullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className={`text-xs flex items-start gap-2 ${
                              paperTheme === 'white' ? 'text-zinc-600' : 'text-zinc-400'
                            }`}
                          >
                            <span className="text-xs">○</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Site Scrub Assessment */}
          <div className="space-y-3">
            <div>
              <h3
                className={`text-xs sm:text-sm font-bold ${
                  paperTheme === 'white' ? 'text-zinc-900' : 'text-purple-300'
                }`}
              >
                {BRIVO_PLATFORM_CHECKLIST.phase3.step2.stepTitle}
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  paperTheme === 'white' ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                {BRIVO_PLATFORM_CHECKLIST.phase3.step2.description}
              </p>
            </div>

            <div className="space-y-2.5 pl-1">
              {BRIVO_PLATFORM_CHECKLIST.phase3.step2.items.map((item) => {
                const isChecked = completedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckbox(item.id)}
                    className={`flex items-start gap-3 cursor-pointer group select-none ${
                      item.indent ? 'pl-7' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheckbox(item.id);
                      }}
                      className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : paperTheme === 'white'
                          ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                          : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="text-xs sm:text-sm leading-relaxed">
                      {item.description ? (
                        <>
                          <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                            {item.title}:{' '}
                          </strong>
                          <span className={paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'}>
                            {item.description}
                          </span>
                        </>
                      ) : (
                        <span className={paperTheme === 'white' ? 'text-zinc-800' : 'text-zinc-200'}>
                          {item.title}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Door Mapping & Phased Rollout */}
          <div className="space-y-3">
            <h3
              className={`text-xs sm:text-sm font-bold ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-purple-300'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase3.step3.stepTitle}
            </h3>

            <div className="space-y-3 pl-1">
              {BRIVO_PLATFORM_CHECKLIST.phase3.step3.items.map((item) => {
                const isChecked = completedItems.includes(item.id);

                return (
                  <div key={item.id} className="space-y-1">
                    <div
                      onClick={() => toggleCheckbox(item.id)}
                      className="flex items-start gap-3 cursor-pointer group select-none"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCheckbox(item.id);
                        }}
                        className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : paperTheme === 'white'
                            ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                            : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="text-xs sm:text-sm leading-relaxed">
                        <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                          {item.title}:{' '}
                        </strong>
                        <span className={paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Sub-bullets */}
                    {item.subBullets && item.subBullets.length > 0 && (
                      <div className="pl-7 space-y-1">
                        {item.subBullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className={`text-xs flex items-start gap-2 ${
                              paperTheme === 'white' ? 'text-zinc-600' : 'text-zinc-400'
                            }`}
                          >
                            <span className="text-xs">○</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PHASE 4: VALIDATION & SIGN-OFF                                    */}
        {/* ================================================================= */}
        <section className="space-y-4 pt-8">
          <div>
            <h2
              className={`text-base sm:text-lg font-bold tracking-tight ${
                paperTheme === 'white' ? 'text-zinc-900' : 'text-white'
              }`}
            >
              {BRIVO_PLATFORM_CHECKLIST.phase4.title}
            </h2>
          </div>

          <div className="space-y-3 pt-1">
            {/* Initial System Testing & On-Site Alignment */}
            {BRIVO_PLATFORM_CHECKLIST.phase4.items.slice(0, 2).map((item) => {
              const isChecked = completedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheckbox(item.id)}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheckbox(item.id);
                    }}
                    className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : paperTheme === 'white'
                        ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                        : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="text-xs sm:text-sm leading-relaxed">
                    <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                      {item.title}:{' '}
                    </strong>
                    <span className={paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'}>
                      {item.description}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Completion Date */}
            {(() => {
              const dateItem = BRIVO_PLATFORM_CHECKLIST.phase4.items[2];
              const isDateChecked = completedItems.includes(dateItem.id);

              return (
                <div
                  onClick={() => toggleCheckbox(dateItem.id)}
                  className="flex items-center gap-3 cursor-pointer group select-none pt-1"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheckbox(dateItem.id);
                    }}
                    className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                      isDateChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : paperTheme === 'white'
                        ? 'border-zinc-400 group-hover:border-blue-600 bg-white'
                        : 'border-zinc-600 group-hover:border-purple-400 bg-zinc-900'
                    }`}
                  >
                    {isDateChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <strong className={paperTheme === 'white' ? 'text-zinc-950' : 'text-white'}>
                      Completion Date:
                    </strong>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border shadow-sm ${
                        paperTheme === 'white'
                          ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      <input
                        type="date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="bg-transparent focus:outline-none text-xs font-mono font-bold cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      </div>
    </div>
  );
};
