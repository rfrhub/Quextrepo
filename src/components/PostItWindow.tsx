import React, { useState } from 'react';
import { BOMItem, InstallLogEntry, CommonAreaDoor } from '../types';
import { X, Pin, Save, Trash2, StickyNote, AlertTriangle, Check, MapPin } from 'lucide-react';

interface PostItWindowProps {
  item: BOMItem;
  existingLogs: InstallLogEntry[];
  commonAreaDoors?: CommonAreaDoor[];
  projectIntegratorPartners?: string[];
  onSaveLog: (newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => void;
  onDeleteLog?: (logId: string) => void;
  onClose: () => void;
}

export const PostItWindow: React.FC<PostItWindowProps> = ({
  item,
  existingLogs,
  commonAreaDoors = [],
  projectIntegratorPartners,
  onSaveLog,
  onDeleteLog,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'cyan' | 'emerald' | 'amber'>('yellow');

  // Form fields
  const now = new Date();
  const [dateField, setDateField] = useState<string>(now.toISOString().split('T')[0]);
  const [timeField, setTimeField] = useState<string>(
    now.toTimeString().split(' ')[0].substring(0, 5)
  );
  const [installerName, setInstallerName] = useState<string>('Austin Crew (Marco T.)');
  
  // Specific number or ALL option based on quoted amount
  const [quantityCompleted, setQuantityCompleted] = useState<number>(
    Math.min(10, Math.max(1, item.quantity - item.installedCount))
  );
  const [isAllQuantity, setIsAllQuantity] = useState<boolean>(false);

  const [locationCompleted, setLocationCompleted] = useState<string>(item.location || 'Building 1 Units');
  const [statusCheck, setStatusCheck] = useState<InstallLogEntry['statusCheck']>('Verified & Online');
  const [notes, setNotes] = useState<string>('');
  const [autoIncrementBOM, setAutoIncrementBOM] = useState<boolean>(true);

  // Toggle ALL option
  const handleToggleAll = (checked: boolean) => {
    setIsAllQuantity(checked);
    if (checked) {
      // Updates based on the quoted amount for that line item
      setQuantityCompleted(item.quantity);
    }
  };

  const colorStyles = {
    yellow: {
      bg: 'bg-[#fef9c3]',
      border: 'border-yellow-300',
      header: 'bg-[#fef08a] border-yellow-300',
      text: 'text-amber-950',
      subtext: 'text-amber-800',
      inputBg: 'bg-yellow-50/90 border-yellow-300 focus:border-amber-500',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    cyan: {
      bg: 'bg-[#e0f2fe]',
      border: 'border-sky-300',
      header: 'bg-[#bae6fd] border-sky-300',
      text: 'text-sky-950',
      subtext: 'text-sky-800',
      inputBg: 'bg-sky-50/90 border-sky-300 focus:border-sky-500',
      btn: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
    emerald: {
      bg: 'bg-[#dcfce7]',
      border: 'border-emerald-300',
      header: 'bg-[#bbf7d0] border-emerald-300',
      text: 'text-emerald-950',
      subtext: 'text-emerald-800',
      inputBg: 'bg-emerald-50/90 border-emerald-300 focus:border-emerald-500',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    amber: {
      bg: 'bg-[#ffedd5]',
      border: 'border-orange-300',
      header: 'bg-[#fed7aa] border-orange-300',
      text: 'text-orange-950',
      subtext: 'text-orange-800',
      inputBg: 'bg-orange-50/90 border-orange-300 focus:border-orange-500',
      btn: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
  };

  const style = colorStyles[selectedColor];

  // Check if entered quantity exceeds quoted amount
  const projectedTotalInstalled = autoIncrementBOM
    ? item.installedCount + (Number(quantityCompleted) || 0)
    : item.installedCount;
  const isOverQuoted = projectedTotalInstalled > item.quantity;
  const overageCount = projectedTotalInstalled - item.quantity;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDate = new Date(`${dateField}T${timeField || '12:00'}`);
    const formattedTimestamp = isNaN(parsedDate.getTime())
      ? `${dateField} ${timeField}`
      : `${parsedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })} ${parsedDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`;

    onSaveLog(
      {
        projectId: '',
        timestamp: formattedTimestamp,
        installerName: installerName.trim() || 'Field Technician',
        itemId: item.id,
        itemName: item.name,
        quantityCompleted: Number(quantityCompleted) || 1,
        locationCompleted: locationCompleted.trim() || item.location,
        statusCheck,
        notes: notes.trim() || 'Field batch installed and verified.',
        color: selectedColor,
      },
      autoIncrementBOM
    );

    onClose();
  };

  const itemLogs = existingLogs.filter((l) => l.itemId === item.id);

  // Common area location tree options
  const doorLocations = commonAreaDoors.map((d) => d.doorName);
  const standardLocations = [
    'Building 1 Units (101-124)',
    'Building 2 Units (201-224)',
    'Building 3 Units (301-324)',
    'Building 4 Units (401-424)',
    'All Residential Units',
    'Clubhouse / Leasing Office',
    'Fitness Center & Amenity Deck',
    'Main Pool Gate & Perimeter',
    'Package Delivery Concierge Room',
  ];
  const allLocationSuggestions = Array.from(new Set([...doorLocations, ...standardLocations]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-xl border-2 shadow-2xl overflow-hidden animate-post-it my-auto ${style.bg} ${style.border}`}
      >
        {/* Washi Tape Accent at Top Center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-amber-300/50 border-b border-amber-400/50 shadow-xs z-20 transform -rotate-1 rounded-b" />

        {/* Post-it Header Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between relative z-10 ${style.header}`}>
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="p-1 rounded bg-amber-400/30 text-amber-900 shrink-0">
              <Pin className="w-4 h-4 transform rotate-45 text-amber-900" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <span>Installer Post-It Note</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-300/60 text-amber-900">
                  Row Attachment
                </span>
              </div>
              <div className="text-xs font-bold text-amber-950 truncate max-w-[260px] sm:max-w-[320px]">
                {item.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {itemLogs.length > 0 && (
              <div className="flex rounded-md bg-amber-200/50 p-0.5 text-[11px] font-semibold text-amber-950">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeTab === 'create' ? 'bg-white shadow-xs font-bold' : 'opacity-70'}`}
                >
                  New Note
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer ${activeTab === 'history' ? 'bg-white shadow-xs font-bold' : 'opacity-70'}`}
                >
                  <StickyNote className="w-3 h-3" />
                  <span>Logs ({itemLogs.length})</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-amber-300/60 text-amber-950 transition-colors cursor-pointer"
              title="Close Post-It window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'create' ? (
          <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5 text-xs">
            {/* Post-It Note Tone Selector (Fixed spelling from Tone -> Note) */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
              <span className={`text-[11px] font-bold ${style.subtext}`}>
                Post-It Note:
              </span>
              <div className="flex items-center gap-2">
                {(['yellow', 'cyan', 'emerald', 'amber'] as const).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setSelectedColor(colorKey)}
                    className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                      colorKey === 'yellow'
                        ? 'bg-yellow-300 border-yellow-400'
                        : colorKey === 'cyan'
                        ? 'bg-sky-300 border-sky-400'
                        : colorKey === 'emerald'
                        ? 'bg-emerald-300 border-emerald-400'
                        : 'bg-orange-300 border-orange-400'
                    } ${selectedColor === colorKey ? 'ring-2 ring-amber-800 scale-110 shadow-sm' : 'opacity-80'}`}
                    title={`${colorKey} note`}
                  />
                ))}
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-semibold mb-1 ${style.text}`}>
                  Completion Date
                </label>
                <input
                  type="date"
                  required
                  value={dateField}
                  onChange={(e) => setDateField(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded border text-slate-800 font-mono text-xs focus:outline-none ${style.inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${style.text}`}>
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={timeField}
                  onChange={(e) => setTimeField(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded border text-slate-800 font-mono text-xs focus:outline-none ${style.inputBg}`}
                />
              </div>
            </div>

            {/* Installer Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`block font-semibold ${style.text}`}>
                  Installer Name / Field Crew
                </label>
                {projectIntegratorPartners && projectIntegratorPartners.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] flex-wrap justify-end">
                    <span className="text-amber-800/80 font-medium">Partner:</span>
                    {projectIntegratorPartners.map((partner) => (
                      <button
                        key={partner}
                        type="button"
                        onClick={() => setInstallerName(`${partner} Installation Crew`)}
                        className="px-1.5 py-0.5 rounded bg-white/80 hover:bg-white text-slate-800 border border-amber-300 cursor-pointer font-bold transition-colors shadow-2xs"
                        title={`Select ${partner} as the installer`}
                      >
                        {partner}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Austin Crew or SKBM Crew"
                value={installerName}
                onChange={(e) => setInstallerName(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded border text-slate-800 text-xs focus:outline-none ${style.inputBg}`}
              />
            </div>

            {/* Clean Quantity Completed & ALL Checkbox Row (Ensuring ALL fits cleanly with zero bleeding) */}
            <div className="p-2.5 bg-white/70 border border-amber-300/70 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`font-bold text-xs ${style.text}`}>
                  Batch Quantity Installed:
                </label>
                <span className="text-[11px] font-mono font-medium text-amber-900">
                  Current Quoted Baseline: <strong>{item.quantity}</strong> units
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityCompleted}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    setQuantityCompleted(val);
                    if (val !== item.quantity) {
                      setIsAllQuantity(false);
                    }
                  }}
                  className={`w-28 px-2.5 py-1.5 rounded border text-slate-900 font-bold font-mono text-xs text-center focus:outline-none tabular-nums ${style.inputBg}`}
                  placeholder="Qty"
                />

                {/* Option for ALL - cleaned up to fit neatly inside container without bleeding */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-400 bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold cursor-pointer shrink-0 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAllQuantity}
                    onChange={(e) => handleToggleAll(e.target.checked)}
                    className="w-4 h-4 text-amber-700 rounded border-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>ALL ({item.quantity})</span>
                </label>

                <div className="flex-1 text-right text-[11px] font-mono text-slate-600">
                  Remaining: {Math.max(0, item.quantity - item.installedCount)}
                </div>
              </div>

              {/* Requirement: Quantity Warning when exceeding quoted amount */}
              {isOverQuoted && (
                <div className="flex items-start gap-1.5 p-2 bg-rose-100 border border-rose-300 rounded text-rose-900 text-[11px] font-semibold mt-1 animate-fadeIn">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    Warning: Logging {quantityCompleted} units will exceed the quoted amount ({item.quantity} units) by {overageCount} units.
                  </span>
                </div>
              )}
            </div>

            {/* Requirement: Location/Scope with Common Area Location Tree Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`font-semibold ${style.text}`}>
                    Location / Scope
                  </label>
                  {commonAreaDoors.length > 0 && (
                    <span className="text-[10px] text-amber-800">
                      Common doors tree synced
                    </span>
                  )}
                </div>

                {/* Dropdown with Common Area Doors tree options + datalist fallback */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="location-options-list"
                    placeholder="Select or type location..."
                    value={locationCompleted}
                    onChange={(e) => setLocationCompleted(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded border text-slate-800 text-xs focus:outline-none ${style.inputBg}`}
                  />
                  <datalist id="location-options-list">
                    {allLocationSuggestions.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                {/* Quick pills from common doors tree if available */}
                {commonAreaDoors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {commonAreaDoors.slice(0, 3).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setLocationCompleted(d.doorName)}
                        className="px-1.5 py-0.5 text-[10px] bg-white/70 hover:bg-white text-slate-700 rounded border border-amber-200 cursor-pointer truncate max-w-[140px]"
                        title={`Select ${d.doorName}`}
                      >
                        {d.doorName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${style.text}`}>
                  Signal / QC Status
                </label>
                <select
                  value={statusCheck}
                  onChange={(e) => setStatusCheck(e.target.value as InstallLogEntry['statusCheck'])}
                  className={`w-full px-2.5 py-1.5 rounded border text-slate-800 text-xs focus:outline-none ${style.inputBg}`}
                >
                  <option value="Verified & Online">✓ Verified & Online</option>
                  <option value="Signal Testing Passed">📶 Signal Passed</option>
                  <option value="Pending LoRa Sync">⏳ Pending LoRa Sync</option>
                  <option value="Hardware Swapped">🔄 Hardware Swapped</option>
                </select>
              </div>
            </div>

            {/* Post-It Body: Ruled Notes Area */}
            <div>
              <label className={`block font-semibold mb-1 ${style.text}`}>
                Field Notes & Observation Details
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write installer observations, punch-list details, door prep notes, or LoRa signal dBm readings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-slate-900 text-xs leading-relaxed focus:outline-none font-medium placeholder-slate-500 shadow-inner ${style.inputBg}`}
                style={{
                  backgroundImage: 'linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.06) 24px)',
                  backgroundSize: '100% 24px',
                  lineHeight: '24px',
                }}
              />
            </div>

            {/* Auto Increment Checkbox */}
            <div className="p-2.5 rounded-lg bg-white/70 border border-amber-300/80 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-amber-950 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoIncrementBOM}
                  onChange={(e) => setAutoIncrementBOM(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-0"
                />
                <span>
                  Update BOM Installed Count: <strong className="font-mono">+{quantityCompleted}</strong> units
                </span>
              </label>

              <span className="text-[11px] font-mono text-amber-800 font-bold">
                New: {item.installedCount + (autoIncrementBOM ? quantityCompleted : 0)} / {item.quantity}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-200/60 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2 rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${style.btn}`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Store in Row</span>
              </button>
            </div>
          </form>
        ) : (
          /* History View */
          <div className="p-5 max-h-[460px] overflow-y-auto space-y-3 text-xs">
            <div className="text-xs font-semibold text-amber-950 mb-2 flex items-center justify-between">
              <span>Attached Post-It Notes ({itemLogs.length})</span>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="text-[11px] text-amber-800 hover:text-amber-950 underline font-semibold cursor-pointer"
              >
                + Add Another Note
              </button>
            </div>

            {itemLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-white/80 border border-amber-200 rounded-lg shadow-xs space-y-1.5 text-slate-800"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pb-1 border-b border-amber-100">
                  <span className="font-semibold text-slate-800">{log.timestamp}</span>
                  <span className="font-bold text-amber-900">+{log.quantityCompleted} units</span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{log.locationCompleted}</span>
                  <span>·</span>
                  <span>{log.installerName}</span>
                </div>
                <p className="text-slate-900 bg-amber-50/60 p-2 rounded border border-amber-100 text-xs leading-relaxed">
                  {log.notes}
                </p>
                {onDeleteLog && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onDeleteLog(log.id)}
                      className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Log
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
