import React, { useState, useEffect } from 'react';
import {
  InstallLogEntry,
  BOMItem,
  AVAILABLE_PMS,
  ProjectManagerInfo,
} from '../types';
import {
  ClipboardList,
  Plus,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  Sparkles,
  XCircle,
} from 'lucide-react';

interface SelectedBOMConfig {
  quantity: number;
  itemNotes: string;
}

interface InstallLogSectionProps {
  logs: InstallLogEntry[];
  bomItems: BOMItem[];
  projectIntegratorPartners?: string[];
  onAddLog: (newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => void;
  onDeleteLog: (logId: string) => void;
  preselectedItem?: BOMItem | null;
  onClearPreselectedItem?: () => void;
  defaultInstallerName?: string;
  editorRole?: 'pm' | 'field_tech' | 'integrator_partner';
  editorName?: string;
  onConfirmInstallation?: (changeId?: string, sowItemId?: string, logId?: string) => void;
  onApproveOverAllocation?: (logId: string) => void;
  onDenyOverAllocation?: (logId: string) => void;
  assignedPM?: ProjectManagerInfo;
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
  editorRole = 'pm',
  editorName,
  onConfirmInstallation,
  onApproveOverAllocation,
  onDenyOverAllocation,
  assignedPM,
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
  const [locationCompleted, setLocationCompleted] = useState<string>('');
  const [statusCheck, setStatusCheck] = useState<InstallLogEntry['statusCheck']>('Verified & Online');
  const [batchNotes, setBatchNotes] = useState<string>('');
  const [autoIncrementBOM, setAutoIncrementBOM] = useState<boolean>(true);

  // Multi-BOM Item selection map: { [itemId]: { quantity, itemNotes } }
  const [selectedBOMEntries, setSelectedBOMEntries] = useState<Record<string, SelectedBOMConfig>>({});

  const activePM = assignedPM || AVAILABLE_PMS[0];

  // Initialize or preselect items
  useEffect(() => {
    if (preselectedItem) {
      const rem = Math.max(1, preselectedItem.quantity - (preselectedItem.installedCount || 0));
      setSelectedBOMEntries((prev) => ({
        ...prev,
        [preselectedItem.id]: {
          quantity: rem,
          itemNotes: '',
        },
      }));
      setShowAddForm(true);
    }
  }, [preselectedItem]);

  const toggleAddForm = () => {
    if (!showAddForm && Object.keys(selectedBOMEntries).length === 0 && bomItems.length > 0) {
      const first = bomItems[0];
      const rem = Math.max(1, first.quantity - (first.installedCount || 0));
      setSelectedBOMEntries({ [first.id]: { quantity: rem, itemNotes: '' } });
    }
    setShowAddForm((prev) => !prev);
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedBOMEntries((prev) => {
      const next = { ...prev };
      if (next[itemId]) {
        delete next[itemId];
      } else {
        const item = bomItems.find((b) => b.id === itemId);
        const rem = item ? Math.max(1, item.quantity - (item.installedCount || 0)) : 10;
        next[itemId] = { quantity: rem, itemNotes: '' };
      }
      return next;
    });
  };

  const handleSelectAllBOMItems = () => {
    const next: Record<string, SelectedBOMConfig> = {};
    bomItems.forEach((b) => {
      const rem = Math.max(1, b.quantity - (b.installedCount || 0));
      next[b.id] = { quantity: rem, itemNotes: '' };
    });
    setSelectedBOMEntries(next);
  };

  const handleClearAllBOMItems = () => {
    setSelectedBOMEntries({});
  };

  const updateItemQuantity = (itemId: string, qty: number) => {
    setSelectedBOMEntries((prev) => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity: Math.max(1, qty),
        },
      };
    });
  };

  const setFullScope = (item: BOMItem) => {
    const rem = Math.max(0, item.quantity - (item.installedCount || 0));
    const currentVal = selectedBOMEntries[item.id]?.quantity || 0;
    // If currently at remainder, or remainder is 0, toggle to full quoted quantity
    const nextVal = rem > 0 && currentVal !== rem ? rem : item.quantity;
    updateItemQuantity(item.id, nextVal);
  };

  const updateItemNote = (itemId: string, note: string) => {
    setSelectedBOMEntries((prev) => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          itemNotes: note,
        },
      };
    });
  };

  const selectedCount = Object.keys(selectedBOMEntries).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIds = Object.keys(selectedBOMEntries);
    if (selectedIds.length === 0) return;

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

    const isPendingRole = editorRole === 'field_tech' || editorRole === 'integrator_partner';

    selectedIds.forEach((itemId) => {
      const item = bomItems.find((b) => b.id === itemId);
      if (!item) return;
      const entry = selectedBOMEntries[itemId];
      const isOverAllocation = (entry.quantity + (item.installedCount || 0)) > item.quantity;
      const offset = isOverAllocation ? (entry.quantity + (item.installedCount || 0)) - item.quantity : 0;

      const combinedNotes = [
        batchNotes.trim(),
        entry.itemNotes.trim() ? `[${item.name}: ${entry.itemNotes.trim()}]` : '',
      ]
        .filter(Boolean)
        .join(' · ') || 'Completed and verified by installer.';

      onAddLog(
        {
          projectId: item.id,
          timestamp: formattedTimestamp,
          installerName: installerName.trim() || (editorName || 'Field Technician'),
          itemId: item.id,
          itemName: item.name,
          quantityCompleted: Number(entry.quantity) || 1,
          locationCompleted: locationCompleted.trim() || item.location,
          statusCheck,
          notes: combinedNotes,
          color: isOverAllocation ? 'rose' : isPendingRole ? 'amber' : 'yellow',
          pendingPMConfirmation: isPendingRole || isOverAllocation,
          submittedByRole: editorRole,
          exceedsSOW: isOverAllocation,
          offsetQuantity: offset,
          itemNotes: entry.itemNotes.trim(),
          approvalStatus: isOverAllocation ? 'pending_approval' : undefined,
        },
        // If pending confirmation or over-allocation, do not increment BOM until PM approves
        isPendingRole || isOverAllocation ? false : autoIncrementBOM
      );
    });

    setLocationCompleted('');
    setBatchNotes('');
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
            <h3 className="text-base font-bold text-slate-900">Installer Completion &amp; Verification Log</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical audit log of all dates, times, and batch installations recorded by field teams and post-it notes.
          </p>
        </div>

        {/* User requested: Change the +Document Batch Entry button to say +Create Installer Log */}
        <button
          type="button"
          onClick={toggleAddForm}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : '+Create Installer Log'}</span>
        </button>
      </div>

      {/* Fillable Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Create Installer Log</span>
              <span className="text-slate-500 font-normal">· Multi-item BOM selector with scope controls</span>
            </div>
            {selectedCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[11px] font-bold">
                {selectedCount} BOM {selectedCount === 1 ? 'Item' : 'Items'} Selected
              </span>
            )}
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
                  {projectIntegratorPartners &&
                    projectIntegratorPartners.length > 0 &&
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
                <option value="Verified & Online">Verified &amp; Online</option>
                <option value="Signal Testing Passed">Signal Testing Passed</option>
                <option value="Pending LoRa Sync">Pending LoRa Sync</option>
                <option value="Hardware Swapped">Hardware Swapped</option>
              </select>
            </div>
          </div>

          {/* Location & Scope */}
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
                General Batch Verification Notes (Overall)
              </label>
              <input
                type="text"
                placeholder="e.g. RF RSSI confirmed at -74 dBm; hallway repeaters active."
                value={batchNotes}
                onChange={(e) => setBatchNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Multi-Item BOM Line Item Picker */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-slate-800 font-bold text-xs">
                  BOM Items Installed Picker ({selectedCount} Selected)
                </label>
                <p className="text-[11px] text-slate-500">
                  Select one or more BOM line items corresponding with this project to record in this batch.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllBOMItems}
                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Select All BOM Items
                </button>
                <button
                  type="button"
                  onClick={handleClearAllBOMItems}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* List of Project BOM Line Items with Multi-Select & Scope Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {bomItems.map((item) => {
                const isSelected = Boolean(selectedBOMEntries[item.id]);
                const entry = selectedBOMEntries[item.id] || { quantity: 0, itemNotes: '' };
                const remaining = Math.max(0, item.quantity - (item.installedCount || 0));
                const totalWithNew = (item.installedCount || 0) + (entry.quantity || 0);
                const exceedsSOW = isSelected && totalWithNew > item.quantity;
                const offset = Math.max(0, totalWithNew - item.quantity);

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? exceedsSOW
                          ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                          : 'bg-sky-50/60 border-sky-400 ring-2 ring-sky-300/30 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <label className="flex items-start gap-2.5 cursor-pointer min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-0 mt-0.5 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 flex-wrap">
                            <span>SKU: {item.model}</span>
                            <span>·</span>
                            <span>{item.category}</span>
                            <span>·</span>
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </label>

                      {/* Quoted / Installed / Remaining Badges */}
                      <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200" title="Quoted Base Quantity">
                          Quoted: {item.quantity}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold" title="Already Installed">
                          Installed: {item.installedCount || 0}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold" title="Remaining to Install">
                          Rem: {remaining}
                        </span>
                      </div>
                    </div>

                    {/* Expanded controls when item is selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">Quantity to Log:</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, Math.max(1, entry.quantity - 5))}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, Math.max(1, entry.quantity - 1))}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              >
                                -1
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={entry.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-extrabold text-sky-800 text-center text-xs focus:outline-none focus:border-sky-500"
                              />
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, entry.quantity + 1)}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              >
                                +1
                              </button>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, entry.quantity + 5)}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              >
                                +5
                              </button>
                            </div>
                          </div>

                          {/* HELPFUL FULL SCOPE BUTTON */}
                          <button
                            type="button"
                            onClick={() => setFullScope(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                            title="Set quantity to full total or remaining uninstalled scope"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>
                              Full Scope ({remaining > 0 ? `Remainder: ${remaining}` : `Total: ${item.quantity}`})
                            </span>
                          </button>
                        </div>

                        {/* LINE ITEM SPECIFIC NOTE INPUT */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Line Item Note (Tied directly to this hardware item):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Strike plate mortised, paired to gateway on 3rd floor..."
                            value={entry.itemNotes}
                            onChange={(e) => updateItemNote(item.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        {/* SOW QUANTITY EXCEEDED MESSAGE + ASSIGNED PM CONTACT DETAILS */}
                        {exceedsSOW && (
                          <div className="p-3 rounded-lg bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs space-y-2 mt-2 shadow-2xs">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-extrabold text-amber-900 block">
                                  Quantity exceeds SOW Quantities and the PM must be notified before making this change.
                                </strong>
                                <span className="text-[11px] text-amber-800">
                                  Logging {entry.quantity} units (total installed will be {totalWithNew}) exceeds the quoted SOW count ({item.quantity}) by <strong>+{offset} units</strong>.
                                </span>
                              </div>
                            </div>

                            {/* Assigned PM Card */}
                            <div className="p-2.5 rounded-lg bg-white/95 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400">
                                  Assigned Project Manager
                                </div>
                                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                  <span>{activePM.name}</span>
                                  <span className="text-slate-500 font-normal">({activePM.role})</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                                <a
                                  href={`mailto:${activePM.email}`}
                                  className="text-sky-700 hover:underline flex items-center gap-1 font-bold"
                                  title="Send email to PM"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>{activePM.email}</span>
                                </a>
                                {activePM.phone && (
                                  <a
                                    href={`tel:${activePM.phone}`}
                                    className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                                    title="Call PM"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{activePM.phone}</span>
                                  </a>
                                )}
                              </div>
                            </div>

                            <p className="text-[11px] text-amber-800 italic">
                              You may proceed to submit. The Project Manager will be notified and can approve or deny this over-allocation.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
              <span>Increment BOM Installed Count upon verification</span>
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
                disabled={selectedCount === 0}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs ${
                  selectedCount === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 cursor-pointer'
                }`}
              >
                Save Installer Log ({selectedCount} {selectedCount === 1 ? 'Item' : 'Items'})
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-3">Installer / Crew</th>
              <th className="py-3 px-3">BOM Item</th>
              <th className="py-3 px-3 text-right">Batch Qty</th>
              <th className="py-3 px-4">Location &amp; Scope</th>
              <th className="py-3 px-3">Verification</th>
              <th className="py-3 px-4">Notes &amp; Observations</th>
              <th className="py-3 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No installation entries recorded yet. Click &quot;+Create Installer Log&quot; or use the &quot;Post-It Note&quot; buttons on BOM rows.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    log.exceedsSOW && log.approvalStatus === 'denied'
                      ? 'bg-rose-50/30'
                      : log.exceedsSOW
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
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

                    {/* Exceeds SOW Notification & Approval / Denial Buttons */}
                    {log.exceedsSOW && (
                      <div className="mt-1 flex flex-col gap-1 items-start">
                        {log.approvalStatus === 'pending_approval' ? (
                          <>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              ⚠️ SOW Over-Allocation (+{log.offsetQuantity} units) · Awaiting PM Approval
                            </span>
                            {editorRole === 'pm' && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <button
                                  type="button"
                                  onClick={() => onApproveOverAllocation?.(log.id)}
                                  className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Approve this over-allocation and commit to BOM"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Approve &amp; Commit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDenyOverAllocation?.(log.id)}
                                  className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Deny over-allocation and flag line item offset"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Deny</span>
                                </button>
                              </div>
                            )}
                          </>
                        ) : log.approvalStatus === 'approved' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            ✓ Approved by PM (+{log.offsetQuantity} over quoted)
                          </span>
                        ) : log.approvalStatus === 'denied' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            ✕ Denied by PM (Offset: +{log.offsetQuantity} requires Change Order)
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* Standard Pending PM Review for non-over-allocated logs */}
                    {!log.exceedsSOW && log.pendingPMConfirmation && (
                      <div className="mt-1 flex flex-col gap-1 items-start">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          ⏳ Pending PM Review
                        </span>
                        {editorRole === 'pm' && (
                          <button
                            type="button"
                            onClick={() => onConfirmInstallation?.(undefined, undefined, log.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Confirm this installation log and increment BOM"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirm installation</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-sky-700 tabular-nums">
                    +{log.quantityCompleted}
                    {log.exceedsSOW && (
                      <div className="text-[10px] font-normal text-rose-600">
                        (+{log.offsetQuantity} over)
                      </div>
                    )}
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

                  <td className="py-3.5 px-4 text-slate-600 max-w-[280px]">
                    <div className="truncate" title={log.notes}>
                      {log.notes}
                    </div>
                    {log.itemNotes && (
                      <div className="text-[10px] text-slate-500 italic mt-0.5 truncate" title={`Line Item Note: ${log.itemNotes}`}>
                        Line Note: {log.itemNotes}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
