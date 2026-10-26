import React, { useState, useEffect } from 'react';
import {
  BOMItem,
  LockFamilyType,
  LockFinishConfig,
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
  getLockFinishSummaryTag,
  getLockFinishColorHex,
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
} from 'lucide-react';

interface LockFinishModalProps {
  item: BOMItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, config: LockFinishConfig) => void;
}

export const LockFinishModal: React.FC<LockFinishModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [family, setFamily] = useState<LockFamilyType>('befe');

  // BE / FE
  const [befeTrimStyle, setBefeTrimStyle] = useState<BeFeTrimStyle>('Greenwich');
  const [befeColorFinish, setBefeColorFinish] = useState<BeFeColorFinish>('622 - Matte Black');

  // NDE
  const [ndeColorFinish, setNdeColorFinish] = useState<NdeColorFinish>('619: Satin Nickel');
  const [ndeLeverType, setNdeLeverType] = useState<NdeLeverType>('Latitude (LAT)');

  // XE360
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

      setFamily(cfg?.family || detected);

      // BE / FE
      setBefeTrimStyle(cfg?.befeTrimStyle || 'Greenwich');
      setBefeColorFinish(cfg?.befeColorFinish || '622 - Matte Black');

      // NDE
      setNdeColorFinish(cfg?.ndeColorFinish || '619: Satin Nickel');
      setNdeLeverType(cfg?.ndeLeverType || 'Latitude (LAT)');

      // XE360
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
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const currentConfig: LockFinishConfig = {
    family,
    ...(family === 'befe'
      ? { befeTrimStyle, befeColorFinish }
      : family === 'nde'
      ? { ndeColorFinish, ndeLeverType }
      : {
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
    customNotes: customNotes.trim() || undefined,
  };

  const previewTag = getLockFinishSummaryTag(currentConfig);
  const colorHex = getLockFinishColorHex(
    family === 'befe' ? befeColorFinish : family === 'nde' ? ndeColorFinish : xe360ColorFinish
  );

  const handleSave = () => {
    onSave(item.id, currentConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
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
                Define the exact trim style, lever type, and finish for BOM line item: <strong>{item.name}</strong>
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
                Model: {item.model} · Quoted Qty: {item.quantity} units · {item.location}
              </span>
            </div>
            {previewTag && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg shadow-2xs font-semibold text-slate-800">
                <span
                  className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                  style={{ backgroundColor: colorHex }}
                />
                <span className="font-bold">{previewTag}</span>
              </div>
            )}
          </div>

          {/* Lock Family Selector */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              Lock Model Family
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFamily('befe')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  family === 'befe'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
                onClick={() => setFamily('nde')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  family === 'nde'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">NDE / NDEBs</span>
                  {family === 'nde' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Wireless Levers (Common Areas &amp; Office)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFamily('xe360')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  family === 'xe360'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
                  <span>XE360 Hardware Subtype *</span>
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

                  {/* Crashbar Compatibility */}
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

                  {/* Functions */}
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

                  {/* Functions */}
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

                  {/* Functions */}
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

          {/* Optional Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Custom Door / Scope Notes (Optional)
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
              <span>Apply Lock Finish Tag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
