import React, { useState } from 'react';
import {
  BOMItem,
  InstallLogEntry,
  ThermostatBrand,
  CommonAreaDoor,
  getCategoryUnitLabel,
  getCategoryDisplayName,
  isLockBOMItem,
  detectLockFamily,
  getLockTypeDisplay,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  getSingleLockFinishSummary,
  LockFinishConfig,
  OperationProject,
  Quote,
} from '../types';
import { PostItWindow } from './PostItWindow';
import { LockFinishModal } from './LockFinishModal';
import { BOMOverrideModal } from './BOMOverrideModal';
import { KeyRound, Thermometer, Radio, ShieldAlert, Wifi, Zap, Plus, Minus, Check, StickyNote, ChevronDown, ChevronUp, MapPin, User, Tag, AlertTriangle, SlidersHorizontal } from 'lucide-react';

interface BOMTableProps {
  items: BOMItem[];
  allProjectLogs: InstallLogEntry[];
  commonAreaDoors?: CommonAreaDoor[];
  projectIntegratorPartners?: string[];
  onUpdateInstalledCount: (itemId: string, newCount: number) => void;
  onSaveRowLog: (itemId: string, newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => void;
  onUpdateThermostatBrand?: (itemId: string, brand: ThermostatBrand) => void;
  onUpdateLockFinishConfig?: (itemId: string, config?: LockFinishConfig) => void;
  onToggleSparesDelivered?: (itemId: string) => void;
  onDeleteLog?: (logId: string) => void;
  isReadOnly?: boolean;
  project?: OperationProject;
  quotesList?: Quote[];
  onAddBOMItem?: (newItem: BOMItem, overrideReason: string) => void;
}

export const BOMTable: React.FC<BOMTableProps> = ({
  items,
  allProjectLogs,
  commonAreaDoors = [],
  projectIntegratorPartners,
  onUpdateInstalledCount,
  onSaveRowLog,
  onUpdateThermostatBrand,
  onUpdateLockFinishConfig,
  onToggleSparesDelivered,
  onDeleteLog,
  isReadOnly = false,
  project,
  quotesList = [],
  onAddBOMItem,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Post-it window state
  const [activePostItItem, setActivePostItItem] = useState<BOMItem | null>(null);
  // Lock finish modal state
  const [activeLockFinishItem, setActiveLockFinishItem] = useState<BOMItem | null>(null);
  // Row inline drawer expansion state
  const [expandedRowLogs, setExpandedRowLogs] = useState<Record<string, boolean>>({});
  // Lock finish expanded options card state (per row)
  const [expandedFinishRows, setExpandedFinishRows] = useState<Record<string, boolean>>({});

  // BOM Override states (triggered by clicking invisible button 7 times)
  const [overrideClicks, setOverrideClicks] = useState<number>(0);
  const clickCountRef = React.useRef<number>(0);
  const [isOverrideUnlocked, setIsOverrideUnlocked] = useState<boolean>(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleInvisibleOverrideClick = () => {
    clickCountRef.current += 1;
    const current = clickCountRef.current;
    setOverrideClicks(current);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setOverrideClicks(0);
    }, 6000);

    if (current >= 7) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      setOverrideClicks(0);
      setIsOverrideUnlocked(true);
      setIsOverrideModalOpen(true);
    }
  };

  const toggleRowLogs = (itemId: string) => {
    setExpandedRowLogs((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleExpandFinish = (itemId: string) => {
    setExpandedFinishRows((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const lockItems = items.filter((i) => isLockBOMItem(i));
  const hasLocksOnBOM = lockItems.length > 0;
  const allLocksExpanded = hasLocksOnBOM && lockItems.every((i) => expandedFinishRows[i.id]);

  const toggleExpandAllFinishes = () => {
    const nextState: Record<string, boolean> = {};
    lockItems.forEach((i) => {
      nextState[i.id] = !allLocksExpanded;
    });
    setExpandedFinishRows(nextState);
  };

  const getCategoryIcon = (category: string) => {
    const disp = getCategoryDisplayName(category);
    switch (disp) {
      case 'Smart Access Control':
        return <KeyRound className="w-4 h-4 text-sky-600" />;
      case 'Smart Thermostats':
        return <Thermometer className="w-4 h-4 text-amber-600" />;
      case 'Gateways and Hubs':
        return <Radio className="w-4 h-4 text-purple-600" />;
      case 'Sensors and Leak Protection':
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case 'Bulk Managed WiFi':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      default:
        return <Zap className="w-4 h-4 text-slate-500" />;
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map((i) => getCategoryDisplayName(i.category))))];

  const filteredItems = items.filter((item) => {
    const dispCategory = getCategoryDisplayName(item.category);
    const matchesCat = filterCategory === 'all' || dispCategory === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalQuoted = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalInstalled = items.reduce((acc, i) => acc + i.installedCount, 0);
  const overallPct = totalQuoted > 0 ? Math.round((totalInstalled / totalQuoted) * 100) : 0;

  const getLogsForItem = (itemId: string): InstallLogEntry[] => {
    const fromProject = allProjectLogs.filter((l) => l.itemId === itemId);
    const itemObj = items.find((i) => i.id === itemId);
    const fromItem = itemObj?.postItLogs || [];
    
    const map = new Map<string, InstallLogEntry>();
    [...fromProject, ...fromItem].forEach((l) => map.set(l.id, l));
    return Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-slate-900">Smart Community Bill of Materials (BOM)</h3>
            <span className="text-xs text-slate-500">· Pulled directly from Quoted Hardware</span>

            {/* Invisible Button: Called BOM OVERIDE - Only way to access this feature, turns red on click */}
            <button
              type="button"
              aria-label="BOM OVERIDE"
              title="BOM OVERIDE"
              onClick={handleInvisibleOverrideClick}
              className={`select-none cursor-pointer px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest transition-all rounded ${
                overrideClicks > 0
                  ? 'text-red-600 bg-red-50 border border-red-300 opacity-100 shadow-2xs font-bold'
                  : 'opacity-0 hover:opacity-60 text-red-600'
              }`}
            >
              BOM OVERIDE
            </button>

            {/* Overridden Status Badge (No visible Add button — invisible button is the ONLY way) */}
            {project?.isBomOverridden && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                BOM Overridden
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracked in locks, stats, GTWYs, and devices. Update counts live in the field and click &quot;Post-It Note&quot; to store notes inside each row.
          </p>
        </div>

        {/* Quick Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Search BOM items or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors w-48 sm:w-56"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
          >
            <option value="all">All Categories ({items.length})</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {hasLocksOnBOM && (
            <button
              type="button"
              onClick={toggleExpandAllFinishes}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Expand or collapse all lock hardware option specifications across the table"
            >
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              <span>{allLocksExpanded ? 'Collapse All Lock Options' : 'Expand All Lock Options'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Item & Model</th>
              <th className="py-3 px-3">Location / Scope</th>
              <th className="py-3 px-3 text-right">Quoted</th>
              <th className="py-3 px-4 text-center min-w-[210px]">
                <span className="text-sky-700 font-bold">Installed Qty (Fillable)</span>
              </th>
              <th className="py-3 px-3 text-right">Remaining</th>
              <th className="py-3 px-4 min-w-[140px]">Progress</th>
              {!isReadOnly && <th className="py-3 px-3 text-center">Row Notes & Logs</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.map((item) => {
              const remaining = Math.max(0, item.quantity - item.installedCount);
              const pct = item.quantity > 0 ? Math.min(100, Math.round((item.installedCount / item.quantity) * 100)) : 0;
              const isDone = item.installedCount >= item.quantity;
              const itemLogs = getLogsForItem(item.id);
              const isExpanded = expandedRowLogs[item.id];
              const dispCategory = getCategoryDisplayName(item.category);
              const unitLabel = getCategoryUnitLabel(item.category, item);
              const isThermostat = dispCategory === 'Smart Thermostats';
              const currentBrand: ThermostatBrand = item.thermostatBrand || (item.name.toLowerCase().includes('honeywell') ? 'Honeywell' : 'Quext');

              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`hover:bg-slate-50/90 transition-colors ${
                      item.overAllocationDenied
                        ? 'bg-rose-50/40 border-l-4 border-l-rose-500'
                        : isDone
                        ? 'bg-emerald-50/40'
                        : ''
                    }`}
                  >
                    {/* Item Name & Model */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                          {item.overAllocationDenied && (
                            <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-extrabold animate-pulse">
                              <span>⚠️ Offset Exceeded: +{item.overAllocationOffset} units Denied by PM (Requires Change Order)</span>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                            <span>SKU: {item.model}</span>
                            <span>·</span>
                            <span className="text-slate-600 font-sans">{dispCategory}</span>

                            {/* Honeywell or Quext Thermostat Brand: TWO selectable tags */}
                            {isThermostat && (
                              <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 ml-1">
                                <button
                                  type="button"
                                  onClick={() => onUpdateThermostatBrand && onUpdateThermostatBrand(item.id, 'Quext')}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                    currentBrand === 'Quext'
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                  title="Select Quext thermostat brand"
                                >
                                  Quext
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateThermostatBrand && onUpdateThermostatBrand(item.id, 'Honeywell')}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                    currentBrand === 'Honeywell'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                  title="Select Honeywell thermostat brand"
                                >
                                  Honeywell
                                </button>
                              </div>
                            )}

                            {/* Lock Finish & Trim Tag Badge */}
                            {isLockBOMItem(item) && (
                              <div className="inline-flex items-center gap-1.5 ml-1">
                                {item.lockFinishConfig ? (
                                  <div className="inline-flex items-center gap-1 bg-slate-900 text-white rounded-full p-0.5 border border-slate-700 shadow-xs">
                                    <button
                                      type="button"
                                      onClick={() => toggleExpandFinish(item.id)}
                                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-0.5 text-[10px] font-bold hover:text-sky-300 transition-colors cursor-pointer"
                                      title={expandedFinishRows[item.id] ? "Click to collapse lock hardware options" : "Click to expand all lock hardware specifications and options"}
                                    >
                                      {item.lockFinishConfig.isSplit && item.lockFinishConfig.splits && item.lockFinishConfig.splits.length > 0 ? (
                                        <>
                                          <span className="flex -space-x-1 items-center shrink-0">
                                            {item.lockFinishConfig.splits.map((s, idx) => (
                                              <span
                                                key={s.id || idx}
                                                className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                                                style={{
                                                  backgroundColor: getLockFinishColorHex(
                                                    s.befeColorFinish || s.ndeColorFinish || s.xe360ColorFinish
                                                  ),
                                                }}
                                              />
                                            ))}
                                          </span>
                                          <span className="font-bold text-sky-200">
                                            Split Finishes ({item.lockFinishConfig.splits.length}):
                                          </span>
                                          <span className="font-normal text-slate-200">
                                            {item.lockFinishConfig.splits
                                              .map((s) => {
                                                const fam = detectLockFamily(item);
                                                const label =
                                                  fam === 'befe'
                                                    ? s.befeColorFinish?.split(' - ')[1] || s.befeTrimStyle || 'Finish'
                                                    : fam === 'nde'
                                                    ? s.ndeColorFinish?.split(': ')[1] || s.ndeLeverType || 'Finish'
                                                    : s.xe360ColorFinish?.split(' - ')[1] || s.xe360LeverStyle || 'Finish';
                                                return `${s.quantity}x ${label}`;
                                              })
                                              .join(' · ')}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0"
                                            style={{
                                              backgroundColor: getLockFinishColorHex(
                                                item.lockFinishConfig.befeColorFinish ||
                                                item.lockFinishConfig.ndeColorFinish ||
                                                item.lockFinishConfig.xe360ColorFinish
                                              ),
                                            }}
                                          />
                                          <span className="font-semibold">{getLockFinishSummaryTag(item.lockFinishConfig)}</span>
                                        </>
                                      )}
                                      <span className="inline-flex items-center gap-0.5 text-[9px] text-sky-300 font-bold bg-slate-800 px-1.5 py-0.2 rounded-full border border-slate-700">
                                        <span>{expandedFinishRows[item.id] ? 'Hide' : 'Options'}</span>
                                        {expandedFinishRows[item.id] ? (
                                          <ChevronUp className="w-2.5 h-2.5" />
                                        ) : (
                                          <ChevronDown className="w-2.5 h-2.5" />
                                        )}
                                      </span>
                                    </button>

                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        onClick={() => setActiveLockFinishItem(item)}
                                        className="text-[9px] text-sky-300 hover:text-white font-semibold px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 border-l border-slate-700 cursor-pointer transition-colors"
                                        title="Click to modify lock trim style, color finish, lever type, and subtype settings"
                                      >
                                        ✎ Edit
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() => setActiveLockFinishItem(item)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border ${
                                      isReadOnly
                                        ? 'opacity-60 cursor-default bg-slate-100 text-slate-500 border-slate-200'
                                        : 'cursor-pointer bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
                                    }`}
                                    title="Associate lock trim style, color finish, and lever type"
                                  >
                                    <span>🎨 + Set Lock Finish</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Expanded Full Lock Options Card */}
                          {isLockBOMItem(item) && item.lockFinishConfig && expandedFinishRows[item.id] && (
                            <div className="mt-2.5 p-3.5 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-md space-y-3 text-xs animate-in fade-in duration-200 max-w-2xl">
                              {item.lockFinishConfig.isSplit && item.lockFinishConfig.splits && item.lockFinishConfig.splits.length > 0 ? (
                                <>
                                  {/* Split Header */}
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="flex -space-x-1 items-center">
                                        {item.lockFinishConfig.splits.map((s, idx) => (
                                          <span
                                            key={s.id || idx}
                                            className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm shrink-0"
                                            style={{
                                              backgroundColor: getLockFinishColorHex(
                                                s.befeColorFinish || s.ndeColorFinish || s.xe360ColorFinish
                                              ),
                                            }}
                                          />
                                        ))}
                                      </span>
                                      <div>
                                        <span className="font-bold text-sky-400 text-xs block">
                                          Split Finish Hardware Allocation Breakdown
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          {item.lockFinishConfig.splits.length} Groups · {item.quantity} Total Quoted Units
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {!isReadOnly && (
                                        <button
                                          type="button"
                                          onClick={() => setActiveLockFinishItem(item)}
                                          className="text-[10px] font-bold text-sky-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors"
                                        >
                                          ✎ Edit Splits
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandFinish(item.id)}
                                        className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                        <span>Collapse</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Proportional visual distribution bar */}
                                  <div className="space-y-1">
                                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                                      {item.lockFinishConfig.splits.map((s, idx) => {
                                        const widthPct = Math.min(100, Math.max(0, ((s.quantity || 0) / (item.quantity || 1)) * 100));
                                        const segHex = getLockFinishColorHex(
                                          s.befeColorFinish || s.ndeColorFinish || s.xe360ColorFinish
                                        );
                                        return (
                                          <div
                                            key={s.id || idx}
                                            style={{ width: `${widthPct}%`, backgroundColor: segHex }}
                                            title={`${s.label || `Group ${idx + 1}`}: ${s.quantity} units (${Math.round(widthPct)}%)`}
                                            className="h-full border-r border-slate-950 last:border-r-0"
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Individual Split Group Cards */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {item.lockFinishConfig.splits.map((s, idx) => {
                                      const splitHex = getLockFinishColorHex(
                                        s.befeColorFinish || s.ndeColorFinish || s.xe360ColorFinish
                                      );
                                      const pct = Math.round(((s.quantity || 0) / (item.quantity || 1)) * 100);
                                      return (
                                        <div
                                          key={s.id || idx}
                                          className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 space-y-2"
                                        >
                                          <div className="flex items-center justify-between gap-1 border-b border-slate-800/80 pb-1.5">
                                            <div className="flex items-center gap-2 truncate">
                                              <span
                                                className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                                                style={{ backgroundColor: splitHex }}
                                              />
                                              <span className="font-bold text-slate-100 text-xs truncate">
                                                {s.label || `Split Group #${idx + 1}`}
                                              </span>
                                            </div>
                                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 shrink-0">
                                              {s.quantity} units ({pct}%)
                                            </span>
                                          </div>

                                          <div className="space-y-1 text-[11px]">
                                            {/* Lock Type - ALWAYS MATCHES BOM LINE ITEM */}
                                            <div className="flex items-center justify-between text-slate-300">
                                              <span className="text-slate-400">Lock Type:</span>
                                              <span className="font-semibold text-sky-300">
                                                {getLockTypeDisplay(item, s)}
                                              </span>
                                            </div>

                                            <div className="flex items-center justify-between text-slate-300">
                                              <span className="text-slate-400">Finish:</span>
                                              <span className="font-semibold text-slate-100">
                                                {(detectLockFamily(item) === 'befe'
                                                  ? s.befeColorFinish
                                                  : detectLockFamily(item) === 'nde'
                                                  ? s.ndeColorFinish
                                                  : s.xe360ColorFinish) || 'Standard'}
                                              </span>
                                            </div>

                                            {detectLockFamily(item) === 'befe' && s.befeTrimStyle && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Trim Style:</span>
                                                <span className="font-semibold text-slate-100">{s.befeTrimStyle}</span>
                                              </div>
                                            )}

                                            {detectLockFamily(item) === 'nde' && s.ndeLeverType && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Lever:</span>
                                                <span className="font-semibold text-slate-100">{s.ndeLeverType}</span>
                                              </div>
                                            )}

                                            {detectLockFamily(item) === 'xe360' && s.xe360LeverStyle && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Lever Style:</span>
                                                <span className="font-semibold text-slate-100">{s.xe360LeverStyle}</span>
                                              </div>
                                            )}
                                            {detectLockFamily(item) === 'xe360' && s.xe360TubularGrade && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Grade:</span>
                                                <span className="font-semibold text-emerald-400">{s.xe360TubularGrade}</span>
                                              </div>
                                            )}
                                            {detectLockFamily(item) === 'xe360' && s.xe360MortiseGrade && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Grade:</span>
                                                <span className="font-semibold text-emerald-400">{s.xe360MortiseGrade}</span>
                                              </div>
                                            )}
                                            {detectLockFamily(item) === 'xe360' && (s.xe360ExitTrimFunction || s.xe360TubularFunction || s.xe360MortiseFunction) && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Function:</span>
                                                <span className="font-semibold text-sky-200 truncate ml-2 text-right">
                                                  {s.xe360ExitTrimFunction || s.xe360TubularFunction || s.xe360MortiseFunction}
                                                </span>
                                              </div>
                                            )}
                                            {detectLockFamily(item) === 'xe360' && s.xe360ExitTrimCrashbar && (
                                              <div className="flex items-center justify-between text-slate-300">
                                                <span className="text-slate-400">Crashbar:</span>
                                                <span className="font-semibold text-slate-200 truncate ml-2 text-right">
                                                  {s.xe360ExitTrimCrashbar}
                                                </span>
                                              </div>
                                            )}

                                            {s.notes && (
                                              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                                                <span className="font-bold text-slate-300">Scope:</span> {s.notes}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {item.lockFinishConfig.customNotes && (
                                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                                      <span className="font-bold text-slate-400">General Notes:</span> {item.lockFinishConfig.customNotes}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm shrink-0"
                                        style={{
                                          backgroundColor: getLockFinishColorHex(
                                            item.lockFinishConfig.befeColorFinish ||
                                            item.lockFinishConfig.ndeColorFinish ||
                                            item.lockFinishConfig.xe360ColorFinish
                                          ),
                                        }}
                                      />
                                      <span className="font-bold text-sky-400 text-xs">
                                        All Lock Hardware Options &amp; Specifications
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {!isReadOnly && (
                                        <button
                                          type="button"
                                          onClick={() => setActiveLockFinishItem(item)}
                                          className="text-[10px] font-bold text-sky-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors"
                                        >
                                          ✎ Edit Settings
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandFinish(item.id)}
                                        className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                        <span>Collapse</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                    {/* Lock Type - ALWAYS MATCHES BOM LINE ITEM */}
                                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                        Lock Type
                                      </span>
                                      <span className="font-bold text-sky-300">
                                        {getLockTypeDisplay(item)}
                                      </span>
                                    </div>

                                    {/* Color Finish */}
                                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                        Color Finish
                                      </span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span
                                          className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0"
                                          style={{
                                            backgroundColor: getLockFinishColorHex(
                                              item.lockFinishConfig.befeColorFinish ||
                                              item.lockFinishConfig.ndeColorFinish ||
                                              item.lockFinishConfig.xe360ColorFinish
                                            ),
                                          }}
                                        />
                                        <span className="font-bold text-slate-100">
                                          {item.lockFinishConfig.befeColorFinish ||
                                            item.lockFinishConfig.ndeColorFinish ||
                                            item.lockFinishConfig.xe360ColorFinish ||
                                            'Standard Finish'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Trim / Escutcheon Style (BE/FE) */}
                                    {detectLockFamily(item) === 'befe' && item.lockFinishConfig.befeTrimStyle && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          Trim / Escutcheon Style
                                        </span>
                                        <span className="font-bold text-slate-100">
                                          {item.lockFinishConfig.befeTrimStyle}
                                        </span>
                                      </div>
                                    )}

                                    {/* Lever Type (NDE) */}
                                    {detectLockFamily(item) === 'nde' && item.lockFinishConfig.ndeLeverType && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          Lever Style / Design
                                        </span>
                                        <span className="font-bold text-slate-100">
                                          {item.lockFinishConfig.ndeLeverType}
                                        </span>
                                      </div>
                                    )}

                                    {/* Lever Style (XE360) */}
                                    {detectLockFamily(item) === 'xe360' && item.lockFinishConfig.xe360LeverStyle && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          Lever Style
                                        </span>
                                        <span className="font-bold text-slate-100">
                                          {item.lockFinishConfig.xe360LeverStyle}
                                        </span>
                                      </div>
                                    )}

                                    {/* Security Grade (XE360 Tubular / Mortise) */}
                                    {detectLockFamily(item) === 'xe360' && (item.lockFinishConfig.xe360TubularGrade || item.lockFinishConfig.xe360MortiseGrade) && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          ANSI/BHMA Grade
                                        </span>
                                        <span className="font-bold text-emerald-400">
                                          {item.lockFinishConfig.xe360TubularGrade || item.lockFinishConfig.xe360MortiseGrade}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interior Function (XE360) */}
                                    {detectLockFamily(item) === 'xe360' && (item.lockFinishConfig.xe360ExitTrimFunction || item.lockFinishConfig.xe360TubularFunction || item.lockFinishConfig.xe360MortiseFunction) && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          Interior Function
                                        </span>
                                        <span className="font-semibold text-sky-200">
                                          {item.lockFinishConfig.xe360ExitTrimFunction ||
                                            item.lockFinishConfig.xe360TubularFunction ||
                                            item.lockFinishConfig.xe360MortiseFunction}
                                        </span>
                                      </div>
                                    )}

                                    {/* Crashbar Compatibility (XE360 Exit Trim) */}
                                    {detectLockFamily(item) === 'xe360' && item.lockFinishConfig.xe360ExitTrimCrashbar && (
                                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 sm:col-span-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                          Crashbar Compatibility
                                        </span>
                                        <span className="font-semibold text-slate-200">
                                          {item.lockFinishConfig.xe360ExitTrimCrashbar}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Custom Door / Scope Notes */}
                                  {item.lockFinishConfig.customNotes && (
                                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                                      <span className="font-bold text-slate-400">Door / Scope Notes:</span> {item.lockFinishConfig.customNotes}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-slate-700">
                      <div className="max-w-[200px] leading-relaxed text-xs">
                        {item.location}
                      </div>
                    </td>

                    {/* Quoted Quantity with Spares Distinct Option */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono font-bold text-slate-800 text-xs tabular-nums">
                        {item.quantity.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">{unitLabel}</span>
                      </div>
                      {/* Split Finishes Quantity Breakdown */}
                      {item.lockFinishConfig?.isSplit && item.lockFinishConfig.splits && item.lockFinishConfig.splits.length > 0 && (
                        <div className="mt-1 flex flex-col items-end gap-0.5">
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            {item.lockFinishConfig.splits.map((s, idx) => {
                              const qtyFam = detectLockFamily(item);
                              return (
                                <span
                                  key={s.id || idx}
                                  className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                  title={`${s.label || `Split ${idx + 1}`}: ${s.quantity} units (${getSingleLockFinishSummary(s, qtyFam)})`}
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{
                                      backgroundColor: getLockFinishColorHex(
                                        qtyFam === 'befe'
                                          ? s.befeColorFinish
                                          : qtyFam === 'nde'
                                          ? s.ndeColorFinish
                                          : s.xe360ColorFinish
                                      ),
                                    }}
                                  />
                                  <span>{s.quantity}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {/* Spares Option (Distinct, included in total item count but not installed count) */}
                      {(item.sparesCount ?? 0) > 0 && (
                        <div className="mt-1 flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            +{item.sparesCount} spares (Total: {item.quantity + (item.sparesCount ?? 0)})
                          </span>
                          {/* Subtle PM Spares Delivery Confirmation Checkbox / Indicator */}
                          <button
                            type="button"
                            onClick={() => onToggleSparesDelivered && onToggleSparesDelivered(item.id)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border transition-colors cursor-pointer ${
                              item.sparesDelivered
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
                            }`}
                            title={item.sparesDelivered ? 'Spares delivery to customer confirmed' : 'Click to confirm spares delivered to customer'}
                          >
                            <Check className={`w-3 h-3 ${item.sparesDelivered ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{item.sparesDelivered ? 'Spares Delivered' : 'Confirm Spares'}</span>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Installed Quantity (Fillable by PM) with Overage Warning */}
                    <td className="py-3.5 px-4">
                      {isReadOnly ? (
                        <div className="text-center font-mono font-bold text-sky-700 tabular-nums">
                          {item.installedCount.toLocaleString()} {unitLabel}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Minus button */}
                            <button
                              type="button"
                              onClick={() => onUpdateInstalledCount(item.id, Math.max(0, item.installedCount - 1))}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-300 transition-colors shrink-0 cursor-pointer"
                              title="Decrease 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            {/* Numeric input field */}
                            <input
                              type="number"
                              min="0"
                              value={item.installedCount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                onUpdateInstalledCount(item.id, isNaN(val) ? 0 : Math.max(0, val));
                              }}
                              className={`w-20 text-center py-1 px-2 font-mono font-bold text-xs sm:text-sm rounded border transition-colors tabular-nums focus:outline-none ${
                                item.installedCount > item.quantity
                                  ? 'bg-rose-50 border-rose-300 text-rose-800 focus:border-rose-500'
                                  : isDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:border-emerald-500'
                                  : 'bg-white border-slate-300 text-sky-800 focus:border-sky-500 focus:bg-sky-50/20'
                              }`}
                            />

                            {/* Plus button */}
                            <button
                              type="button"
                              onClick={() => onUpdateInstalledCount(item.id, item.installedCount + 1)}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-300 transition-colors shrink-0 cursor-pointer"
                              title="Increase 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            {/* Quick increment buttons (+5, Complete) */}
                            <div className="hidden sm:flex items-center gap-1 ml-1">
                              <button
                                type="button"
                                onClick={() => onUpdateInstalledCount(item.id, Math.min(item.quantity, item.installedCount + 5))}
                                className="px-1.5 py-1 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 cursor-pointer"
                                title="Add 5"
                              >
                                +5
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateInstalledCount(item.id, item.quantity)}
                                className="px-1.5 py-1 text-[10px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 rounded border border-sky-300 cursor-pointer"
                                title="Mark 100% Complete"
                              >
                                All
                              </button>
                            </div>
                          </div>

                          {/* Over-quota Warning */}
                          {item.installedCount > item.quantity && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-fadeIn">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Exceeds quoted ({item.quantity}) by +{item.installedCount - item.quantity}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Remaining */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      {remaining === 0 ? (
                        <span className="text-emerald-600 font-bold">0 Done</span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {remaining.toLocaleString()} <span className="text-[10px] text-slate-400">{unitLabel}</span>
                        </span>
                      )}
                    </td>

                    {/* Visual Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-600 tabular-nums">
                            {item.installedCount}/{item.quantity} {unitLabel}
                          </span>
                          <span
                            className={`font-bold tabular-nums ${
                              pct === 100 ? 'text-emerald-600' : pct > 50 ? 'text-sky-600' : 'text-amber-600'
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              pct === 100
                                ? 'bg-emerald-500'
                                : pct > 50
                                ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                                : 'bg-gradient-to-r from-amber-400 to-orange-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action: Open Post-It Note Window & View Row Logs */}
                    {!isReadOnly && (
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActivePostItItem(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                            title="Open Post-It Note window to log notes for this item"
                          >
                            <StickyNote className="w-3.5 h-3.5 text-amber-700" />
                            <span>Post-It Note</span>
                          </button>

                          {itemLogs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleRowLogs(item.id)}
                              className="px-1.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 flex items-center gap-1 cursor-pointer"
                              title={`${itemLogs.length} notes stored in this row`}
                            >
                              <span>{itemLogs.length}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Inline Expanded Post-It Notes for This Corresponding Row */}
                  {isExpanded && itemLogs.length > 0 && (
                    <tr className="bg-amber-50/40 border-b border-amber-200/60">
                      <td colSpan={7} className="p-4 pl-12">
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-amber-950 uppercase tracking-wider flex items-center justify-between">
                            <span>Post-It Notes Stored in this Row: {item.name}</span>
                            <button
                              type="button"
                              onClick={() => setActivePostItItem(item)}
                              className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs cursor-pointer"
                            >
                              + Add Another Post-It Note
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                            {itemLogs.map((log) => (
                              <div
                                key={log.id}
                                className="p-3 bg-[#fef9c3] border-2 border-yellow-300 rounded-lg shadow-sm text-xs text-amber-950 relative"
                              >
                                <div className="flex items-center justify-between font-mono text-[10px] text-amber-800 pb-1 border-b border-yellow-200/70 mb-1.5">
                                  <span>{log.timestamp}</span>
                                  <span className="font-bold text-amber-950">+{log.quantityCompleted} {unitLabel}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 mb-1">
                                  <User className="w-3 h-3 text-amber-700" />
                                  <span>{log.installerName}</span>
                                  <span>·</span>
                                  <MapPin className="w-3 h-3 text-amber-700" />
                                  <span className="truncate">{log.locationCompleted}</span>
                                </div>
                                <p className="text-amber-950 text-xs leading-relaxed bg-white/60 p-2 rounded border border-yellow-200">
                                  {log.notes}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Summary Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <span>
            Total BOM Quoted: <strong className="text-slate-900 font-mono tabular-nums">{totalQuoted.toLocaleString()}</strong> items
          </span>
          <span>·</span>
          <span>
            Total Installed: <strong className="text-sky-700 font-mono tabular-nums">{totalInstalled.toLocaleString()}</strong> items
          </span>
          <span>·</span>
          <span>
            Remaining: <strong className="text-slate-800 font-mono tabular-nums">{(totalQuoted - totalInstalled).toLocaleString()}</strong> items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">BOM Handover Completion:</span>
          <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <span className="font-mono font-bold text-slate-900 tabular-nums">{overallPct}%</span>
        </div>
      </div>

      {/* Floating Post-It Note Window Modal */}
      {activePostItItem && (
        <PostItWindow
          item={activePostItItem}
          existingLogs={getLogsForItem(activePostItItem.id)}
          commonAreaDoors={commonAreaDoors}
          projectIntegratorPartners={projectIntegratorPartners}
          onSaveLog={(newLog, autoIncrementBOM) => {
            onSaveRowLog(activePostItItem.id, newLog, autoIncrementBOM);
          }}
          onDeleteLog={onDeleteLog}
          onClose={() => setActivePostItItem(null)}
        />
      )}

      {/* Interactive Lock Finish & Trim Specification Modal */}
      {activeLockFinishItem && (
        <LockFinishModal
          item={activeLockFinishItem}
          isOpen={!!activeLockFinishItem}
          onClose={() => setActiveLockFinishItem(null)}
          onSave={(itemId, config) => {
            if (onUpdateLockFinishConfig) {
              onUpdateLockFinishConfig(itemId, config);
            }
          }}
        />
      )}

      {/* BOM Override Modal (Triggered by 7 clicks on invisible button) */}
      {isOverrideModalOpen && (
        <BOMOverrideModal
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          project={
            project || {
              id: 'current-project',
              quoteId: 'quote-current',
              quoteNumber: 'QXT-PROJECT',
              propertyName: 'Current Project Community',
              clientName: 'Client',
              address: '',
              city: '',
              state: '',
              unitsCount: 200,
              heroImage: '',
              assignedPM: { name: 'Project Manager', email: '', phone: '', avatar: '', role: 'Project Manager' },
              statusTag: 'On Track',
              startDate: '',
              targetCompletionDate: '',
              bomItems: items,
              installLogs: allProjectLogs,
              notes: [],
              milestones: [],
              lastUpdated: new Date().toISOString(),
            }
          }
          quotesList={quotesList}
          currentBOMItems={items}
          onConfirmOverride={(newItem, overrideReason) => {
            if (onAddBOMItem) {
              onAddBOMItem(newItem, overrideReason);
            }
          }}
        />
      )}

    </div>
  );
};
