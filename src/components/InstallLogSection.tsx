import React, { useState } from 'react';
import { InstallLogEntry, BOMItem } from '../types';
import { ClipboardList, Plus, Clock, User, MapPin, CheckCircle2, Trash2, CheckSquare, Square } from 'lucide-react';

interface InstallLogSectionProps {
  logs: InstallLogEntry[];
  bomItems: BOMItem[];
  projectIntegratorPartners?: string[];
  onAddLog: (newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => void;
  onDeleteLog: (logId: string) => void;
  preselectedItem?: BOMItem | null;
  onClearPreselectedItem?: () => void;
  defaultInstallerName?: string;
}

export const InstallLogSection: React.FC<InstallLogSectionProps> = ({
  logs,
  bomItems,
  projectIntegratorPartners = [],
  onAddLog,
  onDeleteLog,
  preselectedItem,
  onClearPreselectedItem,
  defaultInstallerName,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form states
  const now = new Date();
  const [dateField, setDateField] = useState<string>(now.toISOString().split('T')[0]);
  const [timeField, setTimeField] = useState<string>(
    now.toTimeString().split(' ')[0].substring(0, 5)
  );
  const [installerName, setInstallerName] = useState<string>(
    defaultInstallerName || 'Austin Crew Alpha (Marco T.)'
  );
  const [selectedItemId, setSelectedItemId] = useState<string>(
    preselectedItem ? preselectedItem.id : bomItems[0]?.id || ''
  );
  const [quantityCompleted, setQuantityCompleted] = useState<number>(10);
  const [isAllQuantity, setIsAllQuantity] = useState<boolean>(false);
  const [locationCompleted, setLocationCompleted] = useState<string>('');
  const [statusCheck, setStatusCheck] = useState<InstallLogEntry['statusCheck']>('Verified & Online');
  const [notes, setNotes] = useState<string>('');
  const [autoIncrementBOM, setAutoIncrementBOM] = useState<boolean>(true);

  const currentSelectedItem = bomItems.find((i) => i.id === selectedItemId) || bomItems[0];

  React.useEffect(() => {
    if (preselectedItem) {
      setSelectedItemId(preselectedItem.id);
      setShowAddForm(true);
    }
  }, [preselectedItem]);

  // When selected item changes, if ALL was checked, update quantity based on quoted amount
  const handleItemChange = (newItemId: string) => {
    setSelectedItemId(newItemId);
    const item = bomItems.find((i) => i.id === newItemId);
    if (item && isAllQuantity) {
      setQuantityCompleted(item.quantity);
    }
  };

  const handleToggleAllQuantity = (checked: boolean) => {
    setIsAllQuantity(checked);
    if (checked && currentSelectedItem) {
      // Updates based on the quoted amount for that line item!
      setQuantityCompleted(currentSelectedItem.quantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = currentSelectedItem;
    if (!item) return;

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

    onAddLog(
      {
        projectId: item.id,
        timestamp: formattedTimestamp,
        installerName: installerName.trim() || 'Field Technician',
        itemId: item.id,
        itemName: item.name,
        quantityCompleted: Number(quantityCompleted) || 1,
        locationCompleted: locationCompleted.trim() || item.location,
        statusCheck,
        notes: notes.trim() || 'Completed and verified by installer.',
        color: 'yellow',
      },
      autoIncrementBOM
    );

    setLocationCompleted('');
    setNotes('');
    setIsAllQuantity(false);
    setShowAddForm(false);
    if (onClearPreselectedItem) onClearPreselectedItem();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Installer Completion & Verification Log</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical audit log of all dates, times, and batch installations recorded by field teams and post-it notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Document Batch Entry'}</span>
        </button>
      </div>

      {/* Fillable Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2">
            <span>New Batch Log Entry</span>
            <span className="text-slate-500 font-normal">· Synced to project history and BOM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Installation Date
              </label>
              <input
                type="date"
                required
                value={dateField}
                onChange={(e) => setDateField(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Time Completed
              </label>
              <input
                type="time"
                required
                value={timeField}
                onChange={(e) => setTimeField(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold">
                  Installer / Crew Lead
                </label>
                <div className="flex items-center gap-1 text-[11px] flex-wrap justify-end">
                  <span className="text-slate-400">Quick:</span>
                  {projectIntegratorPartners && projectIntegratorPartners.length > 0 &&
                    projectIntegratorPartners.map((partner) => (
                      <button
                        key={partner}
                        type="button"
                        onClick={() => setInstallerName(`${partner} Installation Crew`)}
                        className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 cursor-pointer font-bold shadow-2xs"
                        title={`Select assigned partner ${partner} as installer`}
                      >
                        {partner}
                      </button>
                    ))}
                  <button
                    type="button"
                    onClick={() => setInstallerName('Hector (Field Tech)')}
                    className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-pointer font-medium"
                  >
                    Hector
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallerName('Sean (Field Tech)')}
                    className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-pointer font-medium"
                  >
                    Sean
                  </button>
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. SKBM Installation Crew, Hector (Field Tech)..."
                value={installerName}
                onChange={(e) => setInstallerName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Verification Status
              </label>
              <select
                value={statusCheck}
                onChange={(e) => setStatusCheck(e.target.value as InstallLogEntry['statusCheck'])}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              >
                <option value="Verified & Online">Verified & Online</option>
                <option value="Signal Testing Passed">Signal Testing Passed</option>
                <option value="Pending LoRa Sync">Pending LoRa Sync</option>
                <option value="Hardware Swapped">Hardware Swapped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
            {/* BOM Item Installed Dropdown: Only item name among options, quantities removed */}
            <div className="sm:col-span-7">
              <label className="block text-slate-700 font-semibold mb-1">
                BOM Item Installed
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => handleItemChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              >
                {bomItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Completed in Batch: Fillable Number + ALL Checkbox */}
            <div className="sm:col-span-5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Quantity Completed in Batch
                </label>
                {currentSelectedItem && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    (Quoted: {currentSelectedItem.quantity})
                  </span>
                )}
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
                    if (currentSelectedItem && val !== currentSelectedItem.quantity) {
                      setIsAllQuantity(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sky-800 font-mono font-bold focus:outline-none focus:border-sky-500 tabular-nums"
                  placeholder="Type quantity..."
                />

                {/* Option for ALL - updates based on quoted amount for that line item */}
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold cursor-pointer transition-colors shrink-0">
                  <input
                    type="checkbox"
                    checked={isAllQuantity}
                    onChange={(e) => handleToggleAllQuantity(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span>ALL ({currentSelectedItem?.quantity || 0})</span>
                </label>
              </div>

              {/* Warning when exceeding quoted amount */}
              {currentSelectedItem && autoIncrementBOM && (currentSelectedItem.installedCount + Number(quantityCompleted) > currentSelectedItem.quantity) && (
                <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-300 rounded text-rose-900 text-[11px] font-semibold mt-1">
                  <span>⚠️ Warning: Logging {quantityCompleted} units will exceed quoted amount ({currentSelectedItem.quantity}) by +{(currentSelectedItem.installedCount + Number(quantityCompleted)) - currentSelectedItem.quantity} units.</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Specific Location / Units Completed
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Building 3, Units 301 through 324"
                value={locationCompleted}
                onChange={(e) => setLocationCompleted(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Batch Verification Notes
              </label>
              <input
                type="text"
                placeholder="e.g. RF RSSI confirmed at -74 dBm; strike plate aligned."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={autoIncrementBOM}
                onChange={(e) => setAutoIncrementBOM(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 bg-white border-slate-300 focus:ring-0"
              />
              <span>Increment this item&apos;s Installed Count in BOM by {quantityCompleted} units</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
              >
                Save Installer Log
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-3">Installer / Crew</th>
              <th className="py-3 px-3">BOM Item</th>
              <th className="py-3 px-3 text-right">Batch Qty</th>
              <th className="py-3 px-4">Location & Scope</th>
              <th className="py-3 px-3">Verification</th>
              <th className="py-3 px-4">Notes & Observations</th>
              <th className="py-3 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No installation entries recorded yet. Click &quot;Document Batch Entry&quot; or use the &quot;Post-It Note&quot; buttons on BOM rows.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{log.installerName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-800 max-w-[200px]">
                    <span className="font-medium">{log.itemName}</span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-sky-700 tabular-nums">
                    +{log.quantityCompleted}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{log.locationCompleted}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        log.statusCheck === 'Verified & Online' || log.statusCheck === 'Signal Testing Passed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {log.statusCheck}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-[260px] truncate" title={log.notes}>
                    {log.notes}
                  </td>

                  <td className="py-3.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove log entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
