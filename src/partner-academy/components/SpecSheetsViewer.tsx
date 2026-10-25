import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Layers,
  Wrench,
  Clock,
  Radio,
  Info,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  X,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckSquare,
  Sparkles,
  Sliders,
  Cpu,
  DoorOpen,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import {
  DOOR_PREP_CUT_SHEETS,
  DoorPrepCutSheet,
  HARDWARE_DATA_SHEETS,
  HardwareDataSheet,
  INSTALLATION_INFO_NEED_TO_KNOWS,
} from '../data/quextLockGuidesData';

type MainSectionFilter = 'all' | 'door_prep' | 'data_sheet';
type LockModelFilter = 'all' | 'BE467' | 'FE410' | 'NDEB' | 'XE360' | 'RC Reader';

export const SpecSheetsViewer: React.FC<{
  onOpenCourse?: (moduleId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}> = ({ onOpenCourse, onNavigateTab }) => {
  const [sectionFilter, setSectionFilter] = useState<MainSectionFilter>('all');
  const [modelFilter, setModelFilter] = useState<LockModelFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lightbox State (supports either Cut Sheet or Data Sheet)
  const [activeCutSheet, setActiveCutSheet] = useState<DoorPrepCutSheet | null>(null);
  const [activeDataSheet, setActiveDataSheet] = useState<HardwareDataSheet | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showNeedToKnows, setShowNeedToKnows] = useState<boolean>(false);

  // Filter Cut Sheets
  const filteredCutSheets = DOOR_PREP_CUT_SHEETS.filter((sheet) => {
    if (sectionFilter === 'data_sheet') return false;
    const matchesModel = modelFilter === 'all' || sheet.lockModel === modelFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      sheet.title.toLowerCase().includes(query) ||
      sheet.templateCode.toLowerCase().includes(query) ||
      sheet.lockFamilyName.toLowerCase().includes(query) ||
      sheet.doorMaterialLabel.toLowerCase().includes(query) ||
      sheet.description.toLowerCase().includes(query) ||
      sheet.keyFieldNotes.some((n) => n.toLowerCase().includes(query));
    return matchesModel && matchesSearch;
  });

  // Filter Data Sheets
  const filteredDataSheets = HARDWARE_DATA_SHEETS.filter((sheet) => {
    if (sectionFilter === 'door_prep') return false;
    const matchesModel = modelFilter === 'all' || sheet.lockModel === modelFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      sheet.title.toLowerCase().includes(query) ||
      sheet.docCode.toLowerCase().includes(query) ||
      sheet.lockFamilyName.toLowerCase().includes(query) ||
      sheet.grade.toLowerCase().includes(query) ||
      sheet.description.toLowerCase().includes(query) ||
      sheet.highlights.some((h) => h.toLowerCase().includes(query));
    return matchesModel && matchesSearch;
  });

  const totalFilteredCount = filteredCutSheets.length + filteredDataSheets.length;

  const openCutSheetModal = (sheet: DoorPrepCutSheet, pageIdx = 0) => {
    setActiveCutSheet(sheet);
    setActiveDataSheet(null);
    setActiveImageIndex(pageIdx);
    setZoomLevel(1);
  };

  const openDataSheetModal = (sheet: HardwareDataSheet, pageIdx = 0) => {
    setActiveDataSheet(sheet);
    setActiveCutSheet(null);
    setActiveImageIndex(pageIdx);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setActiveCutSheet(null);
    setActiveDataSheet(null);
    setActiveImageIndex(0);
    setZoomLevel(1);
  };

  return (
    <div className="space-y-8 pb-20 text-zinc-100">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#090b14] to-[#06070a] border border-cyan-900/40 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Technical Archive &amp; Cut Sheets
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Official Allegion &amp; Schlage Documentation
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Spec Sheets, Manuals &amp; Cut Sheets
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 mt-2.5 leading-relaxed">
              Complete technical engineering library housing official OEM hardware data sheets, door preparation templates, hole routing blueprints, and field installation guidelines for BE467, FE410, NDEB, XE360, and RC Reader Controllers.
            </p>

            {/* Quick Section Tabs */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setSectionFilter('all')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sectionFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Documents (15)</span>
              </button>

              <button
                onClick={() => setSectionFilter('door_prep')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sectionFilter === 'door_prep'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Door Prep Cut Sheets ({DOOR_PREP_CUT_SHEETS.length})</span>
              </button>

              <button
                onClick={() => setSectionFilter('data_sheet')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sectionFilter === 'data_sheet'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hardware Data Sheets ({HARDWARE_DATA_SHEETS.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Hardware Index Card */}
          <div className="flex flex-col gap-3 shrink-0 bg-zinc-950/90 border border-zinc-800/90 p-4 sm:p-5 rounded-2xl min-w-[280px]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold">
                Hardware Index
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                15 Official Assets
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-mono">BE467 Deadbolt</div>
                <div className="font-bold text-white text-xs mt-0.5">RB117 &amp; Data Sheet</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-mono">FE410 Interconnect</div>
                <div className="font-bold text-white text-xs mt-0.5">RF123/124 &amp; Spec</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-mono">NDEB Wireless</div>
                <div className="font-bold text-white text-xs mt-0.5">NDEB1/2 &amp; Data Sheet</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-mono">XE360 Series</div>
                <div className="font-bold text-white text-xs mt-0.5">Mortise / Tubular / Exit</div>
              </div>
            </div>

            <button
              onClick={() => setShowNeedToKnows(!showNeedToKnows)}
              className="mt-1 w-full py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-400" />
                <span>{showNeedToKnows ? 'Hide' : 'View'} Installation Guidelines</span>
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showNeedToKnows ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Slide 19: Installation Info and Need to Knows (Expandable Panel) */}
      {showNeedToKnows && (
        <div className="rounded-3xl bg-[#090b12] border border-purple-500/30 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                Slide 19 Architecture Reference
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Installation Guidelines &amp; Lead Times
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Homebase &amp; Quext Procedures
            </span>
          </div>

          {/* Shipping Timeline Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-zinc-900 border border-blue-800/40 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-900/40 text-cyan-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Homebase Onboarding Window</div>
                <div className="text-xs text-zinc-300">{INSTALLATION_INFO_NEED_TO_KNOWS.shippingTimeline.homebaseOnboarding}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-900/40 text-purple-300 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Hardware Shipping Lead Time</div>
                <div className="text-xs text-zinc-300">{INSTALLATION_INFO_NEED_TO_KNOWS.shippingTimeline.shippingWindow}</div>
              </div>
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Card Readers (RC11 / RC15 / RCK15)</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {INSTALLATION_INFO_NEED_TO_KNOWS.cardReaders.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Smart Locks (BE467, FE410, XE360, NDEB)</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {INSTALLATION_INFO_NEED_TO_KNOWS.locks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Toolbar: Model Filter & Search */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090b12] border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Lock Model Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1 hidden sm:inline">Model:</span>
            {(['all', 'BE467', 'FE410', 'NDEB', 'XE360', 'RC Reader'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModelFilter(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  modelFilter === m
                    ? 'bg-cyan-500 text-black font-bold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {m === 'all' ? 'All Models' : m}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search code (RB117, 015589), model, grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
          <div>
            Showing <strong className="text-white">{totalFilteredCount}</strong> matching documents (
            <span className="text-amber-300">{filteredCutSheets.length} Cut Sheets</span> ·{' '}
            <span className="text-cyan-300">{filteredDataSheets.length} Data Sheets</span>)
          </div>
          {(sectionFilter !== 'all' || modelFilter !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSectionFilter('all');
                setModelFilter('all');
                setSearchQuery('');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline text-[11px]"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. SECTION A: DOOR PREP CUT SHEETS */}
      {filteredCutSheets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DoorOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Door Preparation Cut Sheets &amp; Templates</h2>
                <p className="text-xs text-zinc-400">1:1 scale hole drilling templates, backsets, and edge preps for door fabricators &amp; installers</p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/40">
              {filteredCutSheets.length} Cut Sheets
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCutSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="rounded-3xl bg-[#0b0d14] border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
              >
                {/* Card Header */}
                <div className="p-6 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/60 font-mono text-xs font-bold">
                        Template {sheet.templateCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-xs font-semibold">
                        {sheet.lockModel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                          sheet.doorMaterial === 'wood'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                            : sheet.doorMaterial === 'metal'
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-700/40'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/40'
                        }`}
                      >
                        {sheet.doorMaterial === 'wood'
                          ? 'Wood Door'
                          : sheet.doorMaterial === 'metal'
                          ? 'Hollow Metal'
                          : 'Retrofit Prep'}
                      </span>
                    </div>

                    <a
                      href={sheet.pdfPath}
                      download={sheet.pdfPath.split('/').pop()}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-300 border border-zinc-700 transition-colors shrink-0"
                      title="Download 1:1 Scale PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {sheet.description}
                  </p>
                </div>

                {/* Blueprint Preview Thumbnail */}
                <div
                  onClick={() => openCutSheetModal(sheet, 0)}
                  className="relative mx-6 my-2 bg-black/80 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group/img hover:border-amber-500/60 transition-all flex items-center justify-center min-h-[200px]"
                >
                  {sheet.previewImages.length > 0 ? (
                    <img
                      src={sheet.previewImages[0]}
                      alt={sheet.title}
                      className="w-full max-h-[220px] object-contain p-2 group-hover/img:scale-[1.02] transition-transform duration-200"
                    />
                  ) : (
                    <div className="py-12 text-center text-zinc-500 text-xs">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Blueprint document available for download
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                      <span>Inspect Template &amp; Zoom</span>
                    </span>
                  </div>

                  {sheet.previewImages.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                      {sheet.previewImages.length} Pages Available
                    </span>
                  )}
                </div>

                {/* Engineering Specs */}
                <div className="p-6 pt-2 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-zinc-950/70 border border-zinc-900 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Backset:</span>
                      <span className="font-bold text-zinc-200">{sheet.backset}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Cross-Bore:</span>
                      <span className="font-bold text-amber-300">{sheet.crossBoreDiameter}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Edge Latch Hole:</span>
                      <span className="font-bold text-zinc-200">{sheet.edgeBoreDiameter}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Door Thickness:</span>
                      <span className="font-bold text-zinc-200">{sheet.doorThickness}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Faceplate Corner:</span>
                      <span className="font-bold text-zinc-200 truncate block">{sheet.faceplate}</span>
                    </div>
                    {sheet.centerToCenter ? (
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Hole Spacing:</span>
                        <span className="font-bold text-emerald-400">{sheet.centerToCenter}</span>
                      </div>
                    ) : sheet.dpsPrep ? (
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">DPS Sensor:</span>
                        <span className="font-bold text-purple-300">{sheet.dpsPrep}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Drawing:</span>
                        <span className="font-bold text-zinc-300">Allegion Certified</span>
                      </div>
                    )}
                  </div>

                  {/* Installer Field Requirements */}
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Field Rule:</span>
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {sheet.keyFieldNotes[0]}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => openCutSheetModal(sheet, 0)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>Inspect Blueprint</span>
                    </button>

                    <a
                      href={sheet.pdfPath}
                      download={sheet.pdfPath.split('/').pop()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download 1:1 PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SECTION B: HARDWARE DATA SHEETS & SPEC SHEETS */}
      {filteredDataSheets.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Hardware Data Sheets &amp; Engineering Specifications</h2>
                <p className="text-xs text-zinc-400">Electrical ratings, credential verification speeds, battery life curves, and ordering configuration guides</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40">
              {filteredDataSheets.length} Data Sheets
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDataSheets.map((ds) => (
              <div
                key={ds.id}
                className="rounded-3xl bg-[#0b0d14] border border-zinc-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
              >
                {/* Card Header */}
                <div className="p-6 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-bold">
                        Doc {ds.docCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-xs font-semibold">
                        {ds.lockModel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-purple-950/60 text-purple-300 border border-purple-700/40">
                        {ds.pageCount} Pages
                      </span>
                    </div>

                    <a
                      href={ds.pdfPath}
                      download={ds.pdfPath.split('/').pop()}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-zinc-700 transition-colors shrink-0"
                      title="Download Official Data Sheet PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {ds.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {ds.description}
                  </p>
                </div>

                {/* Data Sheet Page Preview Thumbnail */}
                <div
                  onClick={() => openDataSheetModal(ds, 0)}
                  className="relative mx-6 my-2 bg-black/80 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group/img hover:border-cyan-500/60 transition-all flex items-center justify-center min-h-[200px]"
                >
                  {ds.previewImages.length > 0 ? (
                    <img
                      src={ds.previewImages[0]}
                      alt={ds.title}
                      className="w-full max-h-[220px] object-contain p-2 group-hover/img:scale-[1.02] transition-transform duration-200"
                    />
                  ) : (
                    <div className="py-12 text-center text-zinc-500 text-xs">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Data sheet document ready for download
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                      <span>Inspect Full Data Sheet</span>
                    </span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                    {ds.pageCount} Pages Available
                  </span>
                </div>

                {/* Key Electrical & Mechanical Ratings */}
                <div className="p-6 pt-2 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/70 border border-zinc-900 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">ANSI / BHMA Rating:</span>
                      <span className="font-bold text-white text-[11px] block truncate">{ds.grade}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Memory Capacity:</span>
                      <span className="font-bold text-cyan-300 text-[11px] block truncate">{ds.credentials}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Power &amp; Battery:</span>
                      <span className="font-bold text-emerald-400 text-[11px] block truncate">
                        {ds.batteryLife || ds.power || '4 AA Batteries'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Mobile Access:</span>
                      <span className="font-bold text-purple-300 text-[11px] block truncate">
                        BLE 5.0, NFC, Apple Wallet
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Key Architectural Feature:</span>
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {ds.highlights[0]}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => openDataSheetModal(ds, 0)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>View Pages</span>
                    </button>

                    <a
                      href={ds.pdfPath}
                      download={ds.pdfPath.split('/').pop()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Unified Fullscreen Lightbox / Inspector Modal */}
      {(activeCutSheet || activeDataSheet) && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3 text-zinc-200">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-bold">
                {activeCutSheet ? `Template ${activeCutSheet.templateCode}` : `Doc ${activeDataSheet?.docCode}`}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {activeCutSheet?.title || activeDataSheet?.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {activeCutSheet
                    ? `${activeCutSheet.doorMaterialLabel} · ${activeCutSheet.lockFamilyName}`
                    : `${activeDataSheet?.grade} · ${activeDataSheet?.lockFamilyName}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-2 text-zinc-400">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Download Button */}
              <a
                href={activeCutSheet?.pdfPath || activeDataSheet?.pdfPath}
                download={(activeCutSheet?.pdfPath || activeDataSheet?.pdfPath || '').split('/').pop()}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Document View & Technical Details */}
          <div className="flex-1 overflow-auto flex flex-col xl:flex-row gap-4 p-2 sm:p-4">
            {/* Center Canvas */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-2 bg-[#050608] border border-zinc-800 rounded-2xl relative min-h-[400px]">
              {activeCutSheet && activeCutSheet.previewImages.length > 0 && (
                <div
                  className="transition-transform duration-150 origin-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={activeCutSheet.previewImages[activeImageIndex]}
                    alt={`${activeCutSheet.title} - Page ${activeImageIndex + 1}`}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              )}

              {activeDataSheet && activeDataSheet.previewImages.length > 0 && (
                <div
                  className="transition-transform duration-150 origin-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={activeDataSheet.previewImages[activeImageIndex]}
                    alt={`${activeDataSheet.title} - Page ${activeImageIndex + 1}`}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              )}

              {/* Multi-page switcher tabs */}
              {((activeCutSheet?.previewImages.length || 0) > 1 || (activeDataSheet?.previewImages.length || 0) > 1) && (
                <div className="absolute bottom-4 flex items-center gap-2 bg-black/85 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-2xl">
                  {(activeCutSheet?.previewImages || activeDataSheet?.previewImages || []).map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActiveImageIndex(pIdx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeImageIndex === pIdx
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Page {pIdx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Technical Inspector Panel */}
            <div className="w-full xl:w-96 shrink-0 bg-[#0c0e16] border border-zinc-800 rounded-2xl p-5 space-y-4 overflow-y-auto">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  Technical Specifications
                </span>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {activeCutSheet?.templateCode || activeDataSheet?.docCode} Overview
                </h4>
              </div>

              {activeCutSheet && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Lock Model:</span>
                      <span className="font-bold text-white">{activeCutSheet.lockModel}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Door Material:</span>
                      <span className="font-bold text-zinc-200">{activeCutSheet.doorMaterialLabel}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Door Thickness:</span>
                      <span className="font-bold text-zinc-200">{activeCutSheet.doorThickness}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Backsets Supported:</span>
                      <span className="font-bold text-cyan-300">{activeCutSheet.backset}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Cross-Bore Hole:</span>
                      <span className="font-bold text-white">{activeCutSheet.crossBoreDiameter}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Edge Latch Hole:</span>
                      <span className="font-bold text-white">{activeCutSheet.edgeBoreDiameter}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Installer Field Notes:</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 list-disc ml-4">
                      {activeCutSheet.keyFieldNotes.map((note, idx) => (
                        <li key={idx} className="leading-snug">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeDataSheet && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Model:</span>
                      <span className="font-bold text-white">{activeDataSheet.lockModel}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">ANSI / BHMA Rating:</span>
                      <span className="font-bold text-cyan-300">{activeDataSheet.grade}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Memory:</span>
                      <span className="font-bold text-white">{activeDataSheet.credentials}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Power:</span>
                      <span className="font-bold text-emerald-400">
                        {activeDataSheet.batteryLife || activeDataSheet.power || '4 AA Batteries'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Architectural Specifications:</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 list-disc ml-4">
                      {activeDataSheet.highlights.map((item, idx) => (
                        <li key={idx} className="leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200">
                <strong className="text-white block mb-1">Official OEM Document:</strong>
                Downloaded PDFs contain original vector geometry, wiring pinout diagrams, and full ordering pricebook codes from Allegion.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
