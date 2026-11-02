import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  User,
  Search,
  Database,
  RotateCcw,
} from 'lucide-react';
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
  parseProjectSpreadsheet,
  convertRowToOperationProject,
  ParsedProjectRow,
  TEMPLATE_REFERENCE_GUIDE,
} from '../utils/projectSpreadsheetService';
import {
  parseAndValidateProjectBackup,
  BackupParseResult,
} from '../utils/projectBackupService';
import { OperationProject, getPlatformBadgeStyle } from '../types';

interface ImportProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProjects: (projects: OperationProject[], isBackupRestore?: boolean) => void;
  onGoToDashboard?: () => void;
}

export const ImportProjectsModal: React.FC<ImportProjectsModalProps> = ({
  isOpen,
  onClose,
  onImportProjects,
  onGoToDashboard,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Parsed rows state (Spreadsheet)
  const [parsedRows, setParsedRows] = useState<ParsedProjectRow[]>([]);
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());

  // Parsed backup state (JSON)
  const [backupResult, setBackupResult] = useState<BackupParseResult | null>(null);
  const [selectedBackupIndices, setSelectedBackupIndices] = useState<Set<number>>(new Set());
  const [isBackupRestoreDone, setIsBackupRestoreDone] = useState<boolean>(false);

  // Search filter for preview
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  // Success state
  const [importedProjects, setImportedProjects] = useState<OperationProject[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);
    setParsedRows([]);
    setSelectedRowIndices(new Set());
    setBackupResult(null);
    setSelectedBackupIndices(new Set());
    setImportedProjects(null);
    setIsBackupRestoreDone(false);

    try {
      if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
        const text = await file.text();
        const res = parseAndValidateProjectBackup(text);
        if (!res.valid) {
          setParseError(res.error || 'The file is not a valid Quext project backup JSON.');
        } else {
          setBackupResult(res);
          const allIndices = new Set<number>();
          res.projects.forEach((_, idx) => allIndices.add(idx));
          setSelectedBackupIndices(allIndices);
        }
      } else {
        const buffer = await file.arrayBuffer();
        const result = parseProjectSpreadsheet(buffer, file.name);

        if (result.rows.length === 0) {
          setParseError('The file contains no data rows. Please check that you filled in the template starting on row 2.');
        } else {
          setParsedRows(result.rows);
          // Select all valid rows by default
          const validIndices = new Set<number>();
          result.rows.forEach((r, idx) => {
            if (r.isValid) validIndices.add(idx);
          });
          setSelectedRowIndices(validIndices);
        }
      }
    } catch (err: any) {
      console.error('[Import / Restore] Parsing failed:', err);
      setParseError(err?.message || 'Failed to read file. Please ensure it is a valid .xlsx, .xls, .csv, or .json file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setSelectedRowIndices(new Set());
    setBackupResult(null);
    setSelectedBackupIndices(new Set());
    setParseError(null);
    setImportedProjects(null);
    setIsBackupRestoreDone(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecuteRestoreBackup = () => {
    if (!backupResult || selectedBackupIndices.size === 0) return;
    const projectsToRestore = backupResult.projects.filter((_, idx) =>
      selectedBackupIndices.has(idx)
    );
    if (projectsToRestore.length === 0) return;

    setIsSubmitting(true);
    try {
      onImportProjects(projectsToRestore, true);
      setImportedProjects(projectsToRestore);
      setIsBackupRestoreDone(true);
    } catch (err: any) {
      console.error('[Backup Restore] Failed:', err);
      setParseError(err?.message || 'Failed to restore projects from backup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectRow = (idx: number) => {
    setSelectedRowIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (selectedRowIndices.size === validRows.length) {
      setSelectedRowIndices(new Set());
    } else {
      const next = new Set<number>();
      parsedRows.forEach((r, idx) => {
        if (r.isValid) next.add(idx);
      });
      setSelectedRowIndices(next);
    }
  };

  const filteredRows = useMemo(() => {
    if (!searchFilter.trim()) return parsedRows;
    const q = searchFilter.toLowerCase();
    return parsedRows.filter(
      (r) =>
        r.propertyName.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.platform.toLowerCase().includes(q) ||
        r.pmName.toLowerCase().includes(q)
    );
  }, [parsedRows, searchFilter]);

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const warningCount = parsedRows.filter((r) => r.isValid && r.warnings.length > 0).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  const handleExecuteImport = () => {
    const selectedRows = parsedRows.filter((_, idx) => selectedRowIndices.has(idx));
    if (selectedRows.length === 0) return;

    setIsSubmitting(true);
    try {
      const projectsToCreate = selectedRows.map((row, idx) =>
        convertRowToOperationProject(row, idx)
      );
      onImportProjects(projectsToCreate);
      setImportedProjects(projectsToCreate);
    } catch (err: any) {
      console.error('[Spreadsheet Import] Import failed:', err);
      setParseError(err?.message || 'Failed to create projects.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* =====================================================================
            MODAL HEADER
        ===================================================================== */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-sky-50/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Inter_Tight',sans-serif]">
                  Import &amp; Restore Projects
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-sky-100 text-sky-800 border border-sky-300">
                  JSON Backup · Excel · CSV
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Restore full project backups with complete BOM &amp; install logs, or batch import new projects from spreadsheets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================================
            MODAL BODY
        ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* SUCCESS SCREEN */}
          {importedProjects ? (
            <div className="py-8 px-4 text-center space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900">
                  {isBackupRestoreDone
                    ? `${importedProjects.length} Project${importedProjects.length === 1 ? '' : 's'} Successfully Restored!`
                    : `${importedProjects.length} Project${importedProjects.length === 1 ? '' : 's'} Successfully Created!`}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBackupRestoreDone
                    ? 'All project details—including fillable BOM items with installed counts, lock trim finishes & spares, technician install logs with photos, notes, milestone target dates, and customer intake—have been restored.'
                    : 'The projects have been imported with default milestones, initial BOM line items, and assigned implementation team members.'}
                </p>
              </div>

              {/* Imported Projects Pill List */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left max-h-48 overflow-y-auto space-y-1.5">
                {importedProjects.map((p) => {
                  const badgeStyle = getPlatformBadgeStyle(p.platform);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs"
                    >
                      <div className="font-semibold text-slate-900 truncate mr-2">
                        {p.propertyName}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {p.unitsCount} units
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeStyle.border} ${badgeStyle.bg} ${badgeStyle.text}`}
                        >
                          {p.platform || 'Quext'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  {isBackupRestoreDone ? 'Restore Another Backup' : 'Import More Projects'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onGoToDashboard) onGoToDashboard();
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Go to Installation Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. DOWNLOAD TEMPLATES CARD */}
              <div className="bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white border border-emerald-200/80 rounded-xl p-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                        Download Starter Template
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Download a pre-formatted template with verified column headers and sample data for <strong>Quext</strong>, <strong>Geokey</strong>, and <strong>Homebase</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Template Download Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={downloadExcelTemplate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200/80 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      title="Download formatted Excel workbook with sample rows and reference guidelines"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadCsvTemplate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-900 bg-sky-100 hover:bg-sky-200/80 border border-sky-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      title="Download standard comma-separated CSV template"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-700" />
                      <span>CSV (.csv)</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Guidelines Toggle */}
                <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowGuidelines((prev) => !prev)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{showGuidelines ? 'Hide' : 'View'} Accepted Column Headers &amp; Options Guide</span>
                    {showGuidelines ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Required: Property Name, Client Name, Units Count
                  </span>
                </div>

                {showGuidelines && (
                  <div className="mt-3 overflow-x-auto max-h-48 border border-slate-200 rounded-lg bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-100/80 text-slate-700 sticky top-0">
                        <tr>
                          {TEMPLATE_REFERENCE_GUIDE[0].map((h, i) => (
                            <th key={i} className="p-2 border-b border-slate-200 font-bold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {TEMPLATE_REFERENCE_GUIDE.slice(1).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/70">
                            <td className="p-2 font-semibold text-slate-900 whitespace-nowrap">{row[0]}</td>
                            <td className="p-2 whitespace-nowrap">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  row[1] === 'YES'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {row[1]}
                              </span>
                            </td>
                            <td className="p-2 font-mono text-[10px]">{row[2]}</td>
                            <td className="p-2 text-slate-500 whitespace-nowrap">{row[3]}</td>
                            <td className="p-2 text-slate-500">{row[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 2. FILE UPLOAD DROPZONE */}
              {!selectedFile && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-sky-500 bg-sky-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/70 bg-slate-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.json,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Drop your project backup (.json) or spreadsheet here, or <span className="text-sky-700 underline">browse files</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports Quext Project Backup (.json) files, and Microsoft Excel (.xlsx, .xls) / CSV (.csv) spreadsheets.
                  </p>
                </div>
              )}

              {/* PARSING LOADER */}
              {isParsing && (
                <div className="py-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-sky-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">Reading and validating file data...</p>
                </div>
              )}

              {/* PARSE ERROR BANNER */}
              {parseError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="font-bold">Import Error: </strong>
                    <span>{parseError}</span>
                  </div>
                </div>
              )}

              {/* 3A. BACKUP RESTORE PREVIEW TABLE */}
              {selectedFile && backupResult && (
                <div className="space-y-3">
                  <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="leading-tight truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {selectedFile.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
                            {backupResult.exportType === 'full_site_backup' ? 'Full Site Backup' : 'Single Project Backup'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          Exported {backupResult.exportedAt ? new Date(backupResult.exportedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'recently'} {backupResult.exportedBy ? `by ${backupResult.exportedBy}` : ''} · <strong>{backupResult.projects.length}</strong> project{backupResult.projects.length === 1 ? '' : 's'} included
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
                  </div>

                  {/* Projects selection banner */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedBackupIndices.size === backupResult.projects.length) {
                              setSelectedBackupIndices(new Set());
                            } else {
                              setSelectedBackupIndices(new Set(backupResult.projects.map((_, i) => i)));
                            }
                          }}
                          className="text-xs font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer"
                        >
                          {selectedBackupIndices.size === backupResult.projects.length ? 'Deselect All' : `Select All (${backupResult.projects.length})`}
                        </button>
                        <span className="text-slate-300">|</span>
                        <span>Selected: <strong className="text-slate-900">{selectedBackupIndices.size}</strong> of {backupResult.projects.length}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Lossless Full Project Restore
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {backupResult.projects.map((p, idx) => {
                        const isSelected = selectedBackupIndices.has(idx);
                        const badgeStyle = getPlatformBadgeStyle(p.platform);
                        const totalBom = p.bomItems?.length || 0;
                        const installedBomCount = (p.bomItems || []).reduce((sum, b) => sum + (b.installedCount || 0), 0);
                        const totalLogs = p.installLogs?.length || 0;
                        const photosCount = (p.installLogs || []).reduce((sum, l) => sum + (l.photos?.length || 0), 0);
                        const totalNotes = p.notes?.length || 0;

                        return (
                          <div
                            key={p.id || idx}
                            onClick={() => {
                              setSelectedBackupIndices((prev) => {
                                const next = new Set(prev);
                                if (next.has(idx)) next.delete(idx);
                                else next.add(idx);
                                return next;
                              });
                            }}
                            className={`p-3 transition-colors cursor-pointer flex items-start gap-3 text-xs ${
                              isSelected ? 'bg-sky-50/40 hover:bg-sky-50/70' : 'bg-white hover:bg-slate-50 opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // parent onClick handles toggle
                              className="mt-1 rounded text-sky-600 focus:ring-sky-500 shrink-0 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm">{p.propertyName}</span>
                                <span className="text-slate-500 font-medium">({p.clientName})</span>
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeStyle.border} ${badgeStyle.bg} ${badgeStyle.text}`}>
                                  {p.platform || 'Quext'}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  Quote #{p.quoteNumber}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Units &amp; PM</span>
                                  <strong className="text-slate-800">{p.unitsCount} units</strong> · {p.assignedPM?.name || 'Raul Recalde'}
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">BOM Items</span>
                                  <strong className="text-slate-800">{totalBom} items</strong> ({installedBomCount} installed)
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Install Logs</span>
                                  <strong className="text-slate-800">{totalLogs} logs</strong> ({photosCount} photos)
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Notes &amp; Milestones</span>
                                  <strong className="text-slate-800">{totalNotes} notes</strong> · {p.milestones?.length || 0} milestones
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PREVIEW & VALIDATION TABLE */}
              {selectedFile && parsedRows.length > 0 && (
                <div className="space-y-3">
                  {/* File Info Bar + Metric Badges */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="leading-tight truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {selectedFile.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB · {parsedRows.length} total rows detected
                        </div>
                      </div>
                    </div>

                    {/* Summary badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{validCount} Ready</span>
                      </span>
                      {warningCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>{warningCount} Warnings</span>
                        </span>
                      )}
                      {errorCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>{errorCount} Errors</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ml-1"
                      >
                        Change File
                      </button>
                    </div>
                  </div>

                  {/* Search and Table Actions */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                      >
                        {selectedRowIndices.size === validCount
                          ? 'Deselect All'
                          : `Select All Valid (${validCount})`}
                      </button>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">
                        Selected: <strong className="text-slate-800">{selectedRowIndices.size}</strong> of {parsedRows.length}
                      </span>
                    </div>

                    <div className="relative w-48 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filter rows..."
                        className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto max-h-72">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-bold">
                          <tr>
                            <th className="p-2.5 w-10 text-center border-b border-slate-200">
                              <input
                                type="checkbox"
                                checked={validCount > 0 && selectedRowIndices.size === validCount}
                                onChange={handleToggleSelectAll}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                            </th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Status</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Property Name</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Client</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Units</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Platform</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Target Date</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Assigned PM</th>
                            <th className="p-2.5 border-b border-slate-200 whitespace-nowrap">Hardware Scope</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredRows.map((row) => {
                            const originalIdx = parsedRows.indexOf(row);
                            const isSelected = selectedRowIndices.has(originalIdx);
                            const badgeStyle = getPlatformBadgeStyle(row.platform);

                            return (
                              <tr
                                key={row.rowNumber}
                                className={`transition-colors ${
                                  !row.isValid
                                    ? 'bg-rose-50/40 text-rose-900'
                                    : isSelected
                                    ? 'bg-emerald-50/30'
                                    : 'hover:bg-slate-50/80'
                                }`}
                              >
                                <td className="p-2.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={!row.isValid}
                                    onChange={() => toggleSelectRow(originalIdx)}
                                    className="rounded text-emerald-600 focus:ring-emerald-500 disabled:opacity-30"
                                  />
                                </td>

                                {/* Validation status */}
                                <td className="p-2.5 whitespace-nowrap">
                                  {!row.isValid ? (
                                    <span
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800"
                                      title={row.errors.join('; ')}
                                    >
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      <span>Error</span>
                                    </span>
                                  ) : row.warnings.length > 0 ? (
                                    <span
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"
                                      title={row.warnings.join('; ')}
                                    >
                                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                                      <span>Warning</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Ready</span>
                                    </span>
                                  )}
                                </td>

                                {/* Property name */}
                                <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span>{row.propertyName}</span>
                                    <span className="text-[10px] font-normal text-slate-400">
                                      {row.address}, {row.city}, {row.state}
                                    </span>
                                  </div>
                                </td>

                                {/* Client */}
                                <td className="p-2.5 whitespace-nowrap text-slate-600">
                                  {row.clientName}
                                </td>

                                {/* Units */}
                                <td className="p-2.5 font-bold whitespace-nowrap">
                                  {row.unitsCount}
                                </td>

                                {/* Platform */}
                                <td className="p-2.5 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle.border} ${badgeStyle.bg} ${badgeStyle.text}`}
                                  >
                                    {row.platform}
                                  </span>
                                </td>

                                {/* Target date */}
                                <td className="p-2.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                                  {row.targetCompletionDate}
                                </td>

                                {/* PM */}
                                <td className="p-2.5 whitespace-nowrap text-slate-700">
                                  {row.pmName}
                                </td>

                                {/* Hardware BOM */}
                                <td className="p-2.5 whitespace-nowrap text-[11px] text-slate-500">
                                  {row.locksCount} Locks · {row.thermostatsCount} Therm · {row.gatewaysCount} GW
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* =====================================================================
            MODAL FOOTER
        ===================================================================== */}
        {!importedProjects && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Clear File
                </button>
              )}

              {backupResult ? (
                <button
                  type="button"
                  disabled={selectedBackupIndices.size === 0 || isSubmitting}
                  onClick={handleExecuteRestoreBackup}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Restoring Projects...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        Restore {selectedBackupIndices.size} Project{selectedBackupIndices.size === 1 ? '' : 's'} to Site
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={selectedRowIndices.size === 0 || isSubmitting}
                  onClick={handleExecuteImport}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Projects...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>
                        Import {selectedRowIndices.size} Project{selectedRowIndices.size === 1 ? '' : 's'}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
