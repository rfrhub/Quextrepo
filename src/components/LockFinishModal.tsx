import React, { useState, useEffect } from 'react';
import {
  BOMItem,
  LockFamilyType,
  LockFinishConfig,
  LockFinishSplit,
  BeFeTrimStyle,
  BeFeColorFinish,
  NdeColorFinish,
  NdeLeverType,
  Xe360ColorFinish,
  Xe360LeverStyle,
  Xe360Subtype,
  Xe360ExitTrimCrashbar,
  Xe360ExitTrimFunction,
  Xe360TubularFunction,
  Xe360MortiseFunction,
  BE_FE_TRIM_STYLES,
  BE_FE_COLOR_FINISHES,
  NDE_COLOR_FINISHES,
  NDE_LEVER_TYPES,
  XE360_COLOR_FINISHES,
  XE360_LEVER_STYLES,
  XE360_SUBTYPES,
  XE360_EXIT_TRIM_CRASHBARS,
  XE360_EXIT_TRIM_FUNCTIONS,
  XE360_TUBULAR_FUNCTIONS,
  XE360_MORTISE_FUNCTIONS,
  detectLockFamily,
  isLockFamilyLockedToBOM,
  getLockTypeDisplay,
  sanitizeLockSplits,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  getSingleLockFinishSummary,
} from '../types';
import {
  Lock,
  X,
  Check,
  Tag,
  Shield,
  Palette,
  DoorClosed,
  Sliders,
  Sparkles,
  Info,
  GitFork,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface LockFinishModalProps {
  item: BOMItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, config?: LockFinishConfig) => void;
}

export const LockFinishModal: React.FC<LockFinishModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [family, setFamily] = useState<LockFamilyType>('befe');

  // Split mode state
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splits, setSplits] = useState<LockFinishSplit[]>([]);
  const [activeSplitIndex, setActiveSplitIndex] = useState<number>(0);

  // Single mode state (BE / FE)
  const [befeTrimStyle, setBefeTrimStyle] = useState<BeFeTrimStyle>('Greenwich');
  const [befeColorFinish, setBefeColorFinish] = useState<BeFeColorFinish>('622 - Matte Black');

  // Single mode state (NDE)
  const [ndeColorFinish, setNdeColorFinish] = useState<NdeColorFinish>('619: Satin Nickel');
  const [ndeLeverType, setNdeLeverType] = useState<NdeLeverType>('Latitude (LAT)');

  // Single mode state (XE360)
  const [xe360Subtype, setXe360Subtype] = useState<Xe360Subtype>('Mortise');
  const [xe360ColorFinish, setXe360ColorFinish] = useState<Xe360ColorFinish>('622 - Matte Black');
  const [xe360LeverStyle, setXe360LeverStyle] = useState<Xe360LeverStyle>('LAT - Latitude');
  const [xe360ExitTrimCrashbar, setXe360ExitTrimCrashbar] = useState<Xe360ExitTrimCrashbar>(
    'Von Duprin 98/99 / XP98/99 rim'
  );
  const [xe360ExitTrimFunction, setXe360ExitTrimFunction] = useState<Xe360ExitTrimFunction>(
    'Interior push button with LED indicator (B)'
  );
  const [xe360TubularFunction, setXe360TubularFunction] = useState<Xe360TubularFunction>(
    'Push button (B) - Common areas and package rooms'
  );
  const [xe360MortiseFunction, setXe360MortiseFunction] = useState<Xe360MortiseFunction>(
    'Mortise deadbolt with thumbturn and LED indicator (D)'
  );
  const [customNotes, setCustomNotes] = useState<string>('');

  useEffect(() => {
    if (item && isOpen) {
      const detected = detectLockFamily(item);
      const cfg = item.lockFinishConfig;
      // If the BOM line item dictates the family (BE, FE, NDEB, XE360), use detected family
      const initialFamily = isLockFamilyLockedToBOM(item) ? detected : (cfg?.family || detected);
      setFamily(initialFamily);

      // Single values
      setBefeTrimStyle(cfg?.befeTrimStyle || 'Greenwich');
      setBefeColorFinish(cfg?.befeColorFinish || '622 - Matte Black');

      setNdeColorFinish(cfg?.ndeColorFinish || '619: Satin Nickel');
      setNdeLeverType(cfg?.ndeLeverType || 'Latitude (LAT)');

      const itemSubtype: Xe360Subtype = item.name.toLowerCase().includes('exit')
        ? 'Exit Trim'
        : item.name.toLowerCase().includes('tubular')
        ? 'Tubular'
        : 'Mortise';
      setXe360Subtype(cfg?.xe360Subtype || itemSubtype);
      setXe360ColorFinish(cfg?.xe360ColorFinish || '622 - Matte Black');
      setXe360LeverStyle(cfg?.xe360LeverStyle || 'LAT - Latitude');
      setXe360ExitTrimCrashbar(cfg?.xe360ExitTrimCrashbar || 'Von Duprin 98/99 / XP98/99 rim');
      setXe360ExitTrimFunction(cfg?.xe360ExitTrimFunction || 'Interior push button with LED indicator (B)');
      setXe360TubularFunction(cfg?.xe360TubularFunction || 'Push button (B) - Common areas and package rooms');
      setXe360MortiseFunction(
        cfg?.xe360MortiseFunction || 'Mortise deadbolt with thumbturn and LED indicator (D)'
      );
      setCustomNotes(cfg?.customNotes || '');

      // Initialize split state
      const hasSplits = Boolean(cfg?.isSplit && cfg.splits && cfg.splits.length > 0);
      setIsSplit(hasSplits);

      if (hasSplits && cfg?.splits) {
        setSplits(sanitizeLockSplits(cfg.splits, initialFamily));
        setActiveSplitIndex(0);
      } else {
        // Pre-initialize split choices with sensible distribution
        const q = item.quantity || 1;
        const q1 = Math.max(1, Math.round(q * 0.75));
        const q2 = Math.max(0, q - q1);

        if (initialFamily === 'befe') {
          setSplits([
            {
              id: 'split-1',
              label: 'Residential / Main Units',
              quantity: q2 > 0 ? q1 : q,
              befeTrimStyle: cfg?.befeTrimStyle || 'Greenwich',
              befeColorFinish: cfg?.befeColorFinish || '622 - Matte Black',
            },
            {
              id: 'split-2',
              label: 'Clubhouse / Amenities',
              quantity: q2 > 0 ? q2 : 0,
              befeTrimStyle: 'Addison',
              befeColorFinish: '619 - Satin Nickel',
            },
          ]);
        } else if (initialFamily === 'nde') {
          setSplits([
            {
              id: 'split-1',
              label: 'Residential / Main Units',
              quantity: q2 > 0 ? q1 : q,
              ndeColorFinish: cfg?.ndeColorFinish || '619: Satin Nickel',
              ndeLeverType: cfg?.ndeLeverType || 'Latitude (LAT)',
            },
            {
              id: 'split-2',
              label: 'Clubhouse / Amenities',
              quantity: q2 > 0 ? q2 : 0,
              ndeColorFinish: '622: Matte Black',
              ndeLeverType: 'Rhodes (RHO)',
            },
          ]);
        } else {
          setSplits([
            {
              id: 'split-1',
              label: 'Residential / Main Units',
              quantity: q2 > 0 ? q1 : q,
              xe360Subtype: cfg?.xe360Subtype || itemSubtype,
              xe360ColorFinish: cfg?.xe360ColorFinish || '622 - Matte Black',
              xe360LeverStyle: cfg?.xe360LeverStyle || 'LAT - Latitude',
              xe360ExitTrimCrashbar: cfg?.xe360ExitTrimCrashbar || 'Von Duprin 98/99 / XP98/99 rim',
              xe360ExitTrimFunction: cfg?.xe360ExitTrimFunction || 'Interior push button with LED indicator (B)',
              xe360TubularFunction: cfg?.xe360TubularFunction || 'Push button (B) - Common areas and package rooms',
              xe360MortiseFunction: cfg?.xe360MortiseFunction || 'Mortise deadbolt with thumbturn and LED indicator (D)',
            },
            {
              id: 'split-2',
              label: 'Clubhouse / Amenities',
              quantity: q2 > 0 ? q2 : 0,
              xe360Subtype: cfg?.xe360Subtype || itemSubtype,
              xe360ColorFinish: '619 - Satin Nickel',
              xe360LeverStyle: 'BRW - Broadway',
              xe360ExitTrimCrashbar: 'Falcon 25',
              xe360ExitTrimFunction: 'Interior LED indicator (I)',
              xe360TubularFunction: 'Push button (B) - Common areas and package rooms',
              xe360MortiseFunction: 'Interior push button (B)',
            },
          ]);
        }
        setActiveSplitIndex(0);
      }
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  // Split management helpers
  const totalAllocated = splits.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
  const remainingQty = (item.quantity || 0) - totalAllocated;

  const updateSplit = (index: number, updates: Partial<LockFinishSplit>) => {
    setSplits((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleAddSplit = () => {
    const newQty = remainingQty > 0 ? remainingQty : 1;
    let newSplit: LockFinishSplit;
    if (family === 'befe') {
      newSplit = {
        id: `split-${Date.now()}`,
        label: `Split Group #${splits.length + 1}`,
        quantity: newQty,
        befeTrimStyle: 'Greenwich',
        befeColorFinish: '625 - Polished Chrome',
      };
    } else if (family === 'nde') {
      newSplit = {
        id: `split-${Date.now()}`,
        label: `Split Group #${splits.length + 1}`,
        quantity: newQty,
        ndeColorFinish: '625: Bright Chrome',
        ndeLeverType: 'Broadway (BRW)',
      };
    } else {
      newSplit = {
        id: `split-${Date.now()}`,
        label: `Split Group #${splits.length + 1}`,
        quantity: newQty,
        xe360Subtype: 'Mortise',
        xe360ColorFinish: '626 - Satin Chrome',
        xe360LeverStyle: 'LONE - Longitude-Extended',
        xe360ExitTrimCrashbar: 'Von Duprin 98/99 / XP98/99 rim',
        xe360ExitTrimFunction: 'Interior push button with LED indicator (B)',
        xe360TubularFunction: 'Push button (B) - Common areas and package rooms',
        xe360MortiseFunction: 'Interior LED indicator (I)',
      };
    }
    setSplits((prev) => [...prev, newSplit]);
    setActiveSplitIndex(splits.length);
  };

  const handleRemoveSplit = (indexToRemove: number) => {
    if (splits.length <= 1) return;
    setSplits((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (activeSplitIndex >= splits.length - 1) {
      setActiveSplitIndex(Math.max(0, splits.length - 2));
    }
  };

  const handleFamilyChange = (newFam: LockFamilyType) => {
    if (isLockFamilyLockedToBOM(item)) return;
    setFamily(newFam);
    setSplits((prev) => sanitizeLockSplits(prev, newFam));
  };

  // Build current config object for preview and saving - strictly sanitized by family
  const currentSplits = sanitizeLockSplits(splits, family);
  const currentConfig: LockFinishConfig = {
    family,
    isSplit,
    ...(isSplit
      ? {
          splits: currentSplits,
          ...(family === 'befe' && {
            befeTrimStyle: currentSplits[0]?.befeTrimStyle || befeTrimStyle,
            befeColorFinish: currentSplits[0]?.befeColorFinish || befeColorFinish,
          }),
          ...(family === 'nde' && {
            ndeColorFinish: currentSplits[0]?.ndeColorFinish || ndeColorFinish,
            ndeLeverType: currentSplits[0]?.ndeLeverType || ndeLeverType,
          }),
          ...(family === 'xe360' && {
            xe360Subtype: currentSplits[0]?.xe360Subtype || xe360Subtype,
            xe360ColorFinish: currentSplits[0]?.xe360ColorFinish || xe360ColorFinish,
            xe360LeverStyle: currentSplits[0]?.xe360LeverStyle || xe360LeverStyle,
            xe360ExitTrimCrashbar: currentSplits[0]?.xe360ExitTrimCrashbar || xe360ExitTrimCrashbar,
            xe360ExitTrimFunction: currentSplits[0]?.xe360ExitTrimFunction || xe360ExitTrimFunction,
            xe360TubularGrade: 'ANSI/BHMA Grade 2',
            xe360TubularFunction: currentSplits[0]?.xe360TubularFunction || xe360TubularFunction,
            xe360MortiseGrade: 'ANSI/BHMA Grade 1',
            xe360MortiseFunction: currentSplits[0]?.xe360MortiseFunction || xe360MortiseFunction,
          }),
        }
      : {
          ...(family === 'befe' && {
            befeTrimStyle,
            befeColorFinish,
          }),
          ...(family === 'nde' && {
            ndeColorFinish,
            ndeLeverType,
          }),
          ...(family === 'xe360' && {
            xe360Subtype,
            xe360ColorFinish,
            xe360LeverStyle,
            ...(xe360Subtype === 'Exit Trim'
              ? {
                  xe360ExitTrimCrashbar,
                  xe360ExitTrimFunction,
                }
              : xe360Subtype === 'Tubular'
              ? {
                  xe360TubularGrade: 'ANSI/BHMA Grade 2',
                  xe360TubularFunction,
                }
              : {
                  xe360MortiseGrade: 'ANSI/BHMA Grade 1',
                  xe360MortiseFunction,
                }),
          }),
        }),
    customNotes: customNotes.trim() || undefined,
  };

  const previewTag = getLockFinishSummaryTag(currentConfig);

  const handleSave = () => {
    onSave(item.id, currentConfig);
    onClose();
  };

  const activeSplit = splits[activeSplitIndex] || splits[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Configure Lock Finish &amp; Trim Tag</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sky-900/80 text-sky-200 border border-sky-700/50 rounded-md">
                  PM Specification
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Define the trim style, lever type, and finish options for BOM line item: <strong>{item.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs flex-1">
          {/* Item Context Pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">{item.name}</span>
              <span className="font-mono text-[11px] text-slate-500">
                Model: {item.model} · Quoted Qty: <strong>{item.quantity} units</strong> · {item.location}
              </span>
            </div>
            {previewTag && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg shadow-2xs font-semibold text-slate-800 max-w-full">
                {isSplit ? (
                  <span className="flex -space-x-1 items-center shrink-0">
                    {splits.map((s, idx) => (
                      <span
                        key={s.id || idx}
                        className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                        style={{
                          backgroundColor: getLockFinishColorHex(
                            family === 'befe'
                              ? s.befeColorFinish
                              : family === 'nde'
                              ? s.ndeColorFinish
                              : s.xe360ColorFinish
                          ),
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  <span
                    className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                    style={{
                      backgroundColor: getLockFinishColorHex(
                        family === 'befe' ? befeColorFinish : family === 'nde' ? ndeColorFinish : xe360ColorFinish
                      ),
                    }}
                  />
                )}
                <span className="font-bold truncate text-[11px]">{previewTag}</span>
              </div>
            )}
          </div>

          {/* Single vs Split Mode Selection Banner */}
          <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                <GitFork className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs">Finish Distribution Mode</span>
                <span className="text-[11px] text-slate-500">
                  Does the customer require uniform finishes or a split between units/amenities?
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setIsSplit(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  !isSplit
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Single Finish (All {item.quantity} Units)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSplit(true);
                  if (splits.length === 0) {
                    handleAddSplit();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSplit
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Split Finish Choices</span>
              </button>
            </div>
          </div>

          {/* Lock Family Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Lock Model &amp; Type
              </label>
              {isLockFamilyLockedToBOM(item) && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>Matches BOM Line Item: <strong>{getLockTypeDisplay(item)}</strong></span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFamilyChange('befe')}
                disabled={isLockFamilyLockedToBOM(item) && family !== 'befe'}
                title={
                  isLockFamilyLockedToBOM(item) && family !== 'befe'
                    ? `Locked to BOM line item product: ${item.name}`
                    : undefined
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  isLockFamilyLockedToBOM(item) && family !== 'befe'
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                    : family === 'befe'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20 cursor-pointer'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">BE467 &amp; FE410</span>
                  {family === 'befe' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Unit Smart Deadbolts &amp; Interconnected
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleFamilyChange('nde')}
                disabled={isLockFamilyLockedToBOM(item) && family !== 'nde'}
                title={
                  isLockFamilyLockedToBOM(item) && family !== 'nde'
                    ? `Locked to BOM line item product: ${item.name}`
                    : undefined
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  isLockFamilyLockedToBOM(item) && family !== 'nde'
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                    : family === 'nde'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20 cursor-pointer'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">NDEB Series</span>
                  {family === 'nde' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Wireless Levers (Common Areas &amp; Office)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleFamilyChange('xe360')}
                disabled={isLockFamilyLockedToBOM(item) && family !== 'xe360'}
                title={
                  isLockFamilyLockedToBOM(item) && family !== 'xe360'
                    ? `Locked to BOM line item product: ${item.name}`
                    : undefined
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  isLockFamilyLockedToBOM(item) && family !== 'xe360'
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                    : family === 'xe360'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20 cursor-pointer'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">XE360 Series</span>
                  {family === 'xe360' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Exit Trim, Tubular &amp; Mortise
                </p>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SPLIT FINISH CHOICES SECTION                                    */}
          {/* ============================================================== */}
          {isSplit ? (
            <div className="space-y-4 bg-slate-50/90 p-4 rounded-xl border border-sky-200 animate-fadeIn">
              {/* Allocation Progress Bar & Summary */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Quantity Allocation: {totalAllocated} of {item.quantity} units
                    </span>
                  </div>
                  {totalAllocated === item.quantity ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Balanced ({item.quantity} Units)</span>
                    </span>
                  ) : remainingQty > 0 ? (
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{remainingQty} units unallocated</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (splits[activeSplitIndex]) {
                            updateSplit(activeSplitIndex, {
                              quantity: (splits[activeSplitIndex].quantity || 0) + remainingQty,
                            });
                          }
                        }}
                        className="text-[10px] font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer"
                        title="Add unallocated units to currently selected split group"
                      >
                        + Add {remainingQty} to current group
                      </button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Exceeds line item by {Math.abs(remainingQty)} units</span>
                    </span>
                  )}
                </div>

                {/* Multi-colored Visual Distribution Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-300">
                  {splits.map((s, idx) => {
                    const widthPct = Math.min(100, Math.max(0, ((s.quantity || 0) / (item.quantity || 1)) * 100));
                    const segHex = getLockFinishColorHex(
                      family === 'befe'
                        ? s.befeColorFinish
                        : family === 'nde'
                        ? s.ndeColorFinish
                        : s.xe360ColorFinish
                    );
                    return (
                      <div
                        key={s.id || idx}
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: segHex,
                        }}
                        title={`${s.label || `Group ${idx + 1}`}: ${s.quantity} units (${Math.round(widthPct)}%)`}
                        className="h-full transition-all border-r border-white/40 last:border-r-0"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Split Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {splits.map((s, idx) => {
                  const isAct = idx === activeSplitIndex;
                  const splitHex = getLockFinishColorHex(
                    family === 'befe'
                      ? s.befeColorFinish
                      : family === 'nde'
                      ? s.ndeColorFinish
                      : s.xe360ColorFinish
                  );
                  return (
                    <button
                      key={s.id || idx}
                      type="button"
                      onClick={() => setActiveSplitIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
                        isAct
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/60 shrink-0"
                        style={{ backgroundColor: splitHex }}
                      />
                      <span>{s.label || `Split Group #${idx + 1}`}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          isAct ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.quantity} units
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleAddSplit}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-dashed border-sky-400 text-sky-700 hover:bg-sky-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Another Split</span>
                </button>
              </div>

              {/* Active Split Editor Card */}
              {activeSplit && (
                <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  {/* Split Lock Type Info */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Lock Type: <strong className="text-slate-900">{getLockTypeDisplay(item, activeSplit)}</strong>
                    </span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md font-mono">
                      Line Item: {item.name}
                    </span>
                  </div>

                  {/* Split Group Metadata (Label, Quantity, Remove) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border-b border-slate-100 pb-3">
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                        Split Group Label / Location
                      </label>
                      <input
                        type="text"
                        value={activeSplit.label || ''}
                        onChange={(e) => updateSplit(activeSplitIndex, { label: e.target.value })}
                        placeholder="e.g. Residential Units, Clubhouse, Fitness Center..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                        Allocated Quantity (Units)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max={item.quantity * 2}
                          value={activeSplit.quantity}
                          onChange={(e) =>
                            updateSplit(activeSplitIndex, {
                              quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                          }
                          className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                        <span className="text-slate-500 font-mono text-[11px]">
                          ({Math.round(((activeSplit.quantity || 0) / (item.quantity || 1)) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      {splits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSplit(activeSplitIndex)}
                          className="px-2.5 py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Delete this split group"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE SPLIT HARDWARE OPTION SELECTORS */}
                  {/* 1. BE / FE */}
                  {family === 'befe' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <DoorClosed className="w-3.5 h-3.5 text-sky-600" />
                          <span>Trim Style for {activeSplit.label || `Group #${activeSplitIndex + 1}`} *</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {BE_FE_TRIM_STYLES.map((trim) => (
                            <button
                              key={trim}
                              type="button"
                              onClick={() => updateSplit(activeSplitIndex, { befeTrimStyle: trim })}
                              className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                                (activeSplit.befeTrimStyle || 'Greenwich') === trim
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <span>{trim}</span>
                              {(activeSplit.befeTrimStyle || 'Greenwich') === trim && (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-sky-600" />
                          <span>Color Finish *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {BE_FE_COLOR_FINISHES.map((finish) => {
                            const isSel = (activeSplit.befeColorFinish || '622 - Matte Black') === finish;
                            const hex = getLockFinishColorHex(finish);
                            return (
                              <button
                                key={finish}
                                type="button"
                                onClick={() => updateSplit(activeSplitIndex, { befeColorFinish: finish })}
                                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="text-xs">{finish}</span>
                                </div>
                                {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. NDE */}
                  {family === 'nde' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-sky-600" />
                          <span>Color Finish for {activeSplit.label || `Group #${activeSplitIndex + 1}`} *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {NDE_COLOR_FINISHES.map((finish) => {
                            const isSel = (activeSplit.ndeColorFinish || '619: Satin Nickel') === finish;
                            const hex = getLockFinishColorHex(finish);
                            return (
                              <button
                                key={finish}
                                type="button"
                                onClick={() => updateSplit(activeSplitIndex, { ndeColorFinish: finish })}
                                className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="text-xs truncate">{finish}</span>
                                </div>
                                {isSel && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-sky-600" />
                          <span>Lever Type *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {NDE_LEVER_TYPES.map((lever) => {
                            const isSel = (activeSplit.ndeLeverType || 'Latitude (LAT)') === lever;
                            return (
                              <button
                                key={lever}
                                type="button"
                                onClick={() => updateSplit(activeSplitIndex, { ndeLeverType: lever })}
                                className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-bold'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <span>{lever}</span>
                                {isSel && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. XE360 */}
                  {family === 'xe360' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-sky-600" />
                          <span>XE360 Lock Type *</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {XE360_SUBTYPES.map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => updateSplit(activeSplitIndex, { xe360Subtype: sub })}
                              className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                                (activeSplit.xe360Subtype || 'Mortise') === sub
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <span>XE360 {sub}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-sky-600" />
                          <span>Color Finish *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {XE360_COLOR_FINISHES.map((finish) => {
                            const isSel = (activeSplit.xe360ColorFinish || '622 - Matte Black') === finish;
                            const hex = getLockFinishColorHex(finish);
                            return (
                              <button
                                key={finish}
                                type="button"
                                onClick={() => updateSplit(activeSplitIndex, { xe360ColorFinish: finish })}
                                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="text-xs">{finish}</span>
                                </div>
                                {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-sky-600" />
                          <span>Lever Style *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {XE360_LEVER_STYLES.map((lever) => {
                            const isSel = (activeSplit.xe360LeverStyle || 'LAT - Latitude') === lever;
                            return (
                              <button
                                key={lever}
                                type="button"
                                onClick={() => updateSplit(activeSplitIndex, { xe360LeverStyle: lever })}
                                className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-bold'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <span>{lever}</span>
                                {isSel && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Exit Trim specific options */}
                      {(activeSplit.xe360Subtype || 'Mortise') === 'Exit Trim' && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                          <span className="font-bold text-amber-950 block text-[11px]">
                            Exit Trim Specific Settings
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                                Crashbar Device
                              </label>
                              <select
                                value={activeSplit.xe360ExitTrimCrashbar || 'Von Duprin 98/99 / XP98/99 rim'}
                                onChange={(e) =>
                                  updateSplit(activeSplitIndex, { xe360ExitTrimCrashbar: e.target.value as any })
                                }
                                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-semibold"
                              >
                                {XE360_EXIT_TRIM_CRASHBARS.map((cb) => (
                                  <option key={cb} value={cb}>
                                    {cb}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                                Function
                              </label>
                              <select
                                value={
                                  activeSplit.xe360ExitTrimFunction ||
                                  'Interior push button with LED indicator (B)'
                                }
                                onChange={(e) =>
                                  updateSplit(activeSplitIndex, { xe360ExitTrimFunction: e.target.value as any })
                                }
                                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-semibold"
                              >
                                {XE360_EXIT_TRIM_FUNCTIONS.map((fn) => (
                                  <option key={fn} value={fn}>
                                    {fn}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tubular lock specific options */}
                      {(activeSplit.xe360Subtype || 'Mortise') === 'Tubular' && (
                        <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                          <span className="font-bold text-sky-950 block text-[11px]">
                            Tubular Lock (ANSI/BHMA Grade 2) Function
                          </span>
                          <select
                            value={
                              activeSplit.xe360TubularFunction ||
                              'Push button (B) - Common areas and package rooms'
                            }
                            onChange={(e) =>
                              updateSplit(activeSplitIndex, { xe360TubularFunction: e.target.value as any })
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-semibold"
                          >
                            {XE360_TUBULAR_FUNCTIONS.map((fn) => (
                              <option key={fn} value={fn}>
                                {fn}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Mortise lock specific options */}
                      {(activeSplit.xe360Subtype || 'Mortise') === 'Mortise' && (
                        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                          <span className="font-bold text-purple-950 block text-[11px]">
                            Mortise Lock (ANSI/BHMA Grade 1) Function
                          </span>
                          <select
                            value={
                              activeSplit.xe360MortiseFunction ||
                              'Mortise deadbolt with thumbturn and LED indicator (D)'
                            }
                            onChange={(e) =>
                              updateSplit(activeSplitIndex, { xe360MortiseFunction: e.target.value as any })
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-semibold"
                          >
                            {XE360_MORTISE_FUNCTIONS.map((fn) => (
                              <option key={fn} value={fn}>
                                {fn}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scope / Location notes for this split */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                      Specific Scope / Door Notes for this Split (Optional)
                    </label>
                    <input
                      type="text"
                      value={activeSplit.notes || ''}
                      onChange={(e) => updateSplit(activeSplitIndex, { notes: e.target.value })}
                      placeholder="e.g. Building 100-300 corridor doors, North stairwell, Leasing office suite..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* SINGLE FINISH (ALL UNITS) CONFIGURATION                        */
            /* ============================================================== */
            <div className="space-y-4">
              {/* FAMILY 1: BE467 / FE410 CONFIGURATION */}
              {family === 'befe' && (
                <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                  {/* Trim Style */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <DoorClosed className="w-3.5 h-3.5 text-sky-600" />
                      <span>Trim Style *</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BE_FE_TRIM_STYLES.map((trim) => (
                        <button
                          key={trim}
                          type="button"
                          onClick={() => setBefeTrimStyle(trim)}
                          className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                            befeTrimStyle === trim
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{trim}</span>
                          {befeTrimStyle === trim && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Finish */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-sky-600" />
                      <span>Color Finish *</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BE_FE_COLOR_FINISHES.map((finish) => {
                        const isSel = befeColorFinish === finish;
                        const hex = getLockFinishColorHex(finish);
                        return (
                          <button
                            key={finish}
                            type="button"
                            onClick={() => setBefeColorFinish(finish)}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="text-xs">{finish}</span>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* FAMILY 2: NDE / NDEB CONFIGURATION */}
              {family === 'nde' && (
                <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                  {/* Color Finish */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-sky-600" />
                      <span>Color Finish * (9 Standard Architectural Finishes)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {NDE_COLOR_FINISHES.map((finish) => {
                        const isSel = ndeColorFinish === finish;
                        const hex = getLockFinishColorHex(finish);
                        return (
                          <button
                            key={finish}
                            type="button"
                            onClick={() => setNdeColorFinish(finish)}
                            className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="text-xs truncate">{finish}</span>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lever Type */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-sky-600" />
                      <span>Lever Type *</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {NDE_LEVER_TYPES.map((lever) => {
                        const isSel = ndeLeverType === lever;
                        return (
                          <button
                            key={lever}
                            type="button"
                            onClick={() => setNdeLeverType(lever)}
                            className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-bold'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <span>{lever}</span>
                            {isSel && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* FAMILY 3: XE360 CONFIGURATION */}
              {family === 'xe360' && (
                <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                  {/* XE360 Subtype */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-sky-600" />
                      <span>XE360 Lock Type *</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {XE360_SUBTYPES.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setXe360Subtype(sub)}
                          className={`py-2.5 px-3 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                            xe360Subtype === sub
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>XE360 {sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shared Color Finish */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-sky-600" />
                      <span>Color Finish * (Common across XE360 Exit Trim, Tubular &amp; Mortise)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {XE360_COLOR_FINISHES.map((finish) => {
                        const isSel = xe360ColorFinish === finish;
                        const hex = getLockFinishColorHex(finish);
                        return (
                          <button
                            key={finish}
                            type="button"
                            onClick={() => setXe360ColorFinish(finish)}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="text-xs">{finish}</span>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shared Lever Style */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-sky-600" />
                      <span>Lever Style *</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {XE360_LEVER_STYLES.map((lever) => {
                        const isSel = xe360LeverStyle === lever;
                        return (
                          <button
                            key={lever}
                            type="button"
                            onClick={() => setXe360LeverStyle(lever)}
                            className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-bold'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <span>{lever}</span>
                            {isSel && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Settings for XE360 Exit Trim */}
                  {xe360Subtype === 'Exit Trim' && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                        <Info className="w-4 h-4 text-amber-600" />
                        <span>XE360 Exit Trim Specific Settings</span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                          Crashbar Compatibility *
                        </label>
                        <select
                          value={xe360ExitTrimCrashbar}
                          onChange={(e) => setXe360ExitTrimCrashbar(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          {XE360_EXIT_TRIM_CRASHBARS.map((cb) => (
                            <option key={cb} value={cb}>
                              {cb}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                          Exit Trim Function *
                        </label>
                        <select
                          value={xe360ExitTrimFunction}
                          onChange={(e) => setXe360ExitTrimFunction(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          {XE360_EXIT_TRIM_FUNCTIONS.map((fn) => (
                            <option key={fn} value={fn}>
                              {fn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Specific Settings for XE360 Tubular Lock */}
                  {xe360Subtype === 'Tubular' && (
                    <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3">
                      <div className="font-bold text-sky-950 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-sky-600" />
                          <span>XE360 Tubular Lock Specific Settings</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white border border-sky-300 text-sky-800 rounded">
                          Grade: ANSI/BHMA Grade 2
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                          Tubular Lock Function (Common Areas &amp; Package Rooms) *
                        </label>
                        <select
                          value={xe360TubularFunction}
                          onChange={(e) => setXe360TubularFunction(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          {XE360_TUBULAR_FUNCTIONS.map((fn) => (
                            <option key={fn} value={fn}>
                              {fn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Specific Settings for XE360 Mortise Lock */}
                  {xe360Subtype === 'Mortise' && (
                    <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3">
                      <div className="font-bold text-purple-950 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-purple-600" />
                          <span>XE360 Mortise Lock Specific Settings</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white border border-purple-300 text-purple-800 rounded">
                          Grade: ANSI/BHMA Grade 1
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                          Mortise Function *
                        </label>
                        <select
                          value={xe360MortiseFunction}
                          onChange={(e) => setXe360MortiseFunction(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          {XE360_MORTISE_FUNCTIONS.map((fn) => (
                            <option key={fn} value={fn}>
                              {fn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Optional Project / Scope Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              General Lock Notes &amp; Scope Specification (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Clubhouse Pool Gate, Fitness Center North Double-Doors..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <span className="text-[11px] text-slate-600">
              Live tag will update on BOM table, Customer Kickoff, and Shipping Dock.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.lockFinishConfig && (
              <button
                type="button"
                onClick={() => {
                  onSave(item.id, undefined);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer mr-1"
                title="Remove lock finish tag from this line item"
              >
                Remove Tag
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSplit ? 'Apply Split Finish Tags' : 'Apply Lock Finish Tag'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
