import React, { useState } from 'react';
import {
  OperationProject,
  ShippingDockItem,
  ShippingCarrier,
  ShipmentDockStatus,
  CustomerCommsLog,
  BOMItem,
  getProjectIntegratorPartners,
  buildProductAcceptancePortalUrl,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
} from '../types';
import {
  Truck,
  PackageCheck,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  FileSignature,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { LiveGmailConfirmModal, LiveGmailModalPayload } from './LiveGmailConfirmModal';
import { ConfirmProductAcceptanceModal } from './ConfirmProductAcceptanceModal';

interface ShippingDockSectionProps {
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
}

export function getDefaultBomShipmentQty(b: BOMItem): number {
  return Math.max(1, b.quantity + (b.sparesCount || 0));
}

export function getDockRowBomQuantities(
  item: ShippingDockItem,
  bomItems: BOMItem[]
): Record<string, number> {
  const rowBomIds =
    item.bomItemIds && item.bomItemIds.length > 0 ? item.bomItemIds : [item.bomItemId];
  const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
  const map: Record<string, number> = {};

  if (matchedBoms.length === 1) {
    const onlyBom = matchedBoms[0];
    map[onlyBom.id] =
      item.bomItemQuantities?.[onlyBom.id] !== undefined
        ? item.bomItemQuantities[onlyBom.id]
        : item.shippedQuantity;
    return map;
  }

  matchedBoms.forEach((b) => {
    if (item.bomItemQuantities && item.bomItemQuantities[b.id] !== undefined) {
      map[b.id] = item.bomItemQuantities[b.id];
    } else {
      map[b.id] = getDefaultBomShipmentQty(b);
    }
  });
  return map;
}

export const ProductAcceptancePortalModal: React.FC<{
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
  onClose?: () => void;
  isStandaloneClientView?: boolean;
}> = ({ project, onUpdateProject, onClose, isStandaloneClientView }) => {
  const dockItems: ShippingDockItem[] = project.shippingDockItems || [];
  const bomItems = project.bomItems || [];
  const existingSub = project.productAcceptanceSubmission;

  const [localItems, setLocalItems] = useState<ShippingDockItem[]>(dockItems);
  const [signedByName, setSignedByName] = useState<string>(
    existingSub?.signedByName ||
      (project.customerIntake?.staffRoles?.[0]
        ? `${project.customerIntake.staffRoles[0].firstName} ${project.customerIntake.staffRoles[0].lastName}`
        : 'Elena Vance')
  );
  const [signedByTitle, setSignedByTitle] = useState<string>(
    existingSub?.signedByTitle ||
      project.customerIntake?.staffRoles?.[0]?.roleOrTitle ||
      'Regional Property Manager'
  );
  const [signedByEmail, setSignedByEmail] = useState<string>(
    existingSub?.signedByEmail ||
      project.customerIntake?.subscriberEmail ||
      project.customerIntake?.communityEmail ||
      'leasing@property.com'
  );
  const [signatureText, setSignatureText] = useState<string>(
    existingSub?.signatureText || ''
  );
  const [overallNotes, setOverallNotes] = useState<string>(
    existingSub?.overallDeliveryNotes || ''
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(existingSub));

  const handleToggleItemAccepted = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              customerAccepted: !item.customerAccepted,
              status: !item.customerAccepted ? 'Accepted by Customer' : 'Delivered to Site',
            }
          : item
      )
    );
  };

  const handleScenarioNoteChange = (id: string, note: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customerScenarioNotes: note } : item))
    );
  };

  const handleSignAndSubmitAcceptance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureText.trim() || !signedByName.trim()) return;

    const finalizedItems: ShippingDockItem[] = localItems.map((item) => ({
      ...item,
      customerAccepted: true,
      status: 'Accepted by Customer',
    }));

    const submission = {
      signedByName: signedByName.trim(),
      signedByTitle: signedByTitle.trim(),
      signedByEmail: signedByEmail.trim(),
      signatureText: signatureText.trim(),
      signedAt: new Date().toLocaleString(),
      overallDeliveryNotes: overallNotes.trim(),
    };

    const newLog: CustomerCommsLog = {
      id: `acceptance-signed-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'product_acceptance_request',
      recipientEmail: signedByEmail.trim(),
      subject: `Product Acceptance Signed: ${project.propertyName}`,
      summary: `Customer (${signedByName.trim()}) confirmed receipt and signed the Product Acceptance Portal for ${finalizedItems.length} shipment line items.`,
      sentBy: signedByName.trim(),
      status: 'Delivered',
    };

    onUpdateProject({
      ...project,
      shippingDockItems: finalizedItems,
      productAcceptanceSubmission: submission,
      customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
      lastUpdated: new Date().toISOString(),
    });

    setLocalItems(finalizedItems);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 uppercase tracking-wider">
              Customer Product Acceptance Portal
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-300 font-mono">Quote #{project.quoteNumber}</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white text-xs px-2.5 py-1 rounded border border-white/20 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Portal</span>
            </button>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
          Hardware Delivery &amp; Product Acceptance Sign-Off
        </h2>
        <p className="text-slate-200 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
          Please review the hardware shipments communicated for <strong>{project.propertyName}</strong>. Confirm receipt of each BOM line item, add notes to explain any delivery scenarios (e.g., partial boxes, staging room location, or damaged packaging) on each line item, and sign below.
        </p>
      </div>

      <form onSubmit={handleSignAndSubmitAcceptance} className="p-6 sm:p-8 space-y-6 text-xs">
        {isSubmitted && project.productAcceptanceSubmission && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-emerald-900">
                  Product Acceptance Officially Signed &amp; Recorded
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Signed by <strong>{project.productAcceptanceSubmission.signedByName}</strong> ({project.productAcceptanceSubmission.signedByTitle}) on{' '}
                  <span className="font-mono">{project.productAcceptanceSubmission.signedAt}</span>. You can update line-item scenario notes below at any time.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-emerald-800 shrink-0">
              Signature: {project.productAcceptanceSubmission.signatureText}
            </span>
          </div>
        )}

        {/* Shipped Line Items with Customer Scenario Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Communicated Shipment Line Items ({localItems.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Add scenario notes on any line item if quantities or conditions differ
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                  <th className="py-3 px-3">Confirm Receipt</th>
                  <th className="py-3 px-3">Batch &amp; Integrator</th>
                  <th className="py-3 px-3">BOM Hardware Line Item(s) (1:1 Qty)</th>
                  <th className="py-3 px-3 text-right">Shipped Qty</th>
                  <th className="py-3 px-3">Carrier &amp; Tracking #</th>
                  <th className="py-3 px-3 min-w-[260px]">
                    Customer Line-Item Scenario Notes (Explain Scenarios / Exceptions)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localItems.map((item) => {
                  const rowBomIds =
                    item.bomItemIds && item.bomItemIds.length > 0
                      ? item.bomItemIds
                      : [item.bomItemId];
                  const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
                  const rowQtyMap = getDockRowBomQuantities(item, bomItems);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={Boolean(item.customerAccepted)}
                            onChange={() => handleToggleItemAccepted(item.id)}
                            className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                          />
                          <span className={item.customerAccepted ? 'text-emerald-700' : 'text-slate-600'}>
                            {item.customerAccepted ? 'Received ✓' : 'Confirm'}
                          </span>
                        </label>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.shipmentBatchLabel}</div>
                        <div className="text-[10px] text-slate-500">Integrator: {item.integratorName}</div>
                      </td>
                      <td className="py-3 px-3">
                        {matchedBoms.length > 0 ? (
                          <div className="space-y-1">
                            {matchedBoms.map((b) => (
                              <div
                                key={`portal-bom-${item.id}-${b.id}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1"
                              >
                                <div>
                                  <span className="font-bold text-slate-900">
                                    {b.name}{' '}
                                    <span className="font-mono text-[10px] text-slate-500">
                                      ({b.model})
                                    </span>
                                  </span>
                                  {b.lockFinishConfig && (
                                    <div className="inline-flex items-center gap-1.5 ml-2 font-sans font-semibold text-[10px] text-slate-700 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                                      <span
                                        className="w-2 h-2 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                                        style={{
                                          backgroundColor: getLockFinishColorHex(
                                            b.lockFinishConfig.befeColorFinish ||
                                            b.lockFinishConfig.ndeColorFinish ||
                                            b.lockFinishConfig.xe360ColorFinish
                                          ),
                                        }}
                                      />
                                      <span>Finish: {getLockFinishSummaryTag(b.lockFinishConfig)}</span>
                                    </div>
                                  )}
                                </div>
                                <span className="font-mono font-bold text-sky-800 shrink-0">
                                  Qty: {rowQtyMap[b.id] ?? 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-slate-900">{item.bomItemName}</div>
                            <div className="text-[10px] font-mono text-slate-500">
                              SKU: {item.bomItemModel}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {item.shippedQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{item.carrier}</div>
                        <div className="font-mono text-[11px] text-sky-700 font-bold">
                          {item.trackingNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={item.customerScenarioNotes || ''}
                          onChange={(e) => handleScenarioNoteChange(item.id, e.target.value)}
                          placeholder="Add note to explain scenario on this line item (e.g., partial delivery, stored in Bldg 2)..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Sign-Off Block */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-emerald-600" />
            <span>Official Customer Product Acceptance Signature</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={signedByName}
                onChange={(e) => setSignedByName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role / Title *</label>
              <input
                type="text"
                required
                value={signedByTitle}
                onChange={(e) => setSignedByTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={signedByEmail}
                onChange={(e) => setSignedByEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Digital Signature (Type Full Name to Sign) *
              </label>
              <input
                type="text"
                required
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Type your full name as digital signature..."
                className="w-full px-3 py-2 bg-amber-50/60 border-2 border-amber-300 rounded-lg text-slate-900 font-serif italic text-sm font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Overall Staging / Receiving Notes (Optional)
              </label>
              <input
                type="text"
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                placeholder="e.g. Pallets secured in Clubhouse Storage Room B"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              By signing, you confirm receipt of the communicated shipment batches subject to any line-item scenario notes above.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              <span>{isSubmitted ? 'Update Signed Acceptance & Notes' : 'Sign & Confirm Product Acceptance'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ShippingDockSection: React.FC<ShippingDockSectionProps> = ({
  project,
  onUpdateProject,
}) => {
  const dockItems: ShippingDockItem[] = project.shippingDockItems || [];
  const bomItems = project.bomItems || [];
  const partners = getProjectIntegratorPartners(project);

  const [isAddingShipment, setIsAddingShipment] = useState<boolean>(false);
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState<boolean>(false);
  const [isSendPortalModalOpen, setIsSendPortalModalOpen] = useState<boolean>(false);
  const [copiedPortalLink, setCopiedPortalLink] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);
  const [gmailModalPayload, setGmailModalPayload] = useState<LiveGmailModalPayload | null>(null);

  // New shipment row state (supports 1 or multiple BOM line items with 1:1 quantities)
  const [batchLabel, setBatchLabel] = useState<string>(`Batch #${dockItems.length + 1} - Integrator Shipment`);
  const [integratorName, setIntegratorName] = useState<string>(partners[0] || 'SKBM');
  const [selectedBomIds, setSelectedBomIds] = useState<string[]>(
    bomItems[0] ? [bomItems[0].id] : []
  );
  const [selectedBomQuantities, setSelectedBomQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    bomItems.forEach((b) => {
      initial[b.id] = getDefaultBomShipmentQty(b);
    });
    return initial;
  });
  const [shippedQuantity, setShippedQuantity] = useState<number>(
    bomItems[0] ? getDefaultBomShipmentQty(bomItems[0]) : 50
  );
  const [carrier, setCarrier] = useState<ShippingCarrier>('FedEx Freight');
  const [trackingNumber, setTrackingNumber] = useState<string>(
    `QXT-TRK-${project.quoteNumber.replace(/[^0-9]/g, '')}-${100 + dockItems.length + 1}`
  );
  const [shippedDate, setShippedDate] = useState<string>('2026-10-21');
  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState<string>('2026-10-25');
  const [status, setStatus] = useState<ShipmentDockStatus>('Shipped / In Transit');
  const [editingBomRowId, setEditingBomRowId] = useState<string | null>(null);

  const defaultRecipient =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'RFRleasing@gmail.com';

  const syncShipmentQtyFromSelectedBoms = (
    nextIds: string[],
    qtyOverrides?: Record<string, number>
  ) => {
    setSelectedBomIds(nextIds);
    const activeQtyMap = qtyOverrides || selectedBomQuantities;
    const matchedList = bomItems.filter((b) => nextIds.includes(b.id));
    if (matchedList.length > 0) {
      const nextQtyMap = { ...activeQtyMap };
      matchedList.forEach((b) => {
        if (nextQtyMap[b.id] === undefined) {
          nextQtyMap[b.id] = getDefaultBomShipmentQty(b);
        }
      });
      setSelectedBomQuantities(nextQtyMap);

      const totalQty = matchedList.reduce(
        (sum, b) => sum + Math.max(0, nextQtyMap[b.id] ?? getDefaultBomShipmentQty(b)),
        0
      );
      setShippedQuantity(totalQty);
    }
  };

  const handleToggleShipmentBomId = (bomId: string) => {
    const exists = selectedBomIds.includes(bomId);
    const nextIds = exists
      ? selectedBomIds.filter((id) => id !== bomId)
      : [...selectedBomIds, bomId];
    syncShipmentQtyFromSelectedBoms(nextIds);
  };

  const handleAdjustSelectedShipmentBomQty = (bomId: string, nextVal: number) => {
    const clamped = Math.max(0, nextVal);
    const updatedMap = {
      ...selectedBomQuantities,
      [bomId]: clamped,
    };
    setSelectedBomQuantities(updatedMap);
    const matchedList = bomItems.filter((b) => selectedBomIds.includes(b.id));
    if (matchedList.length > 0) {
      const sumQty = matchedList.reduce((sum, b) => sum + (updatedMap[b.id] ?? 0), 0);
      setShippedQuantity(sumQty);
    }
  };

  const handleAddShipmentRow = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedBoms =
      bomItems.filter((b) => selectedBomIds.includes(b.id)).length > 0
        ? bomItems.filter((b) => selectedBomIds.includes(b.id))
        : bomItems[0]
        ? [bomItems[0]]
        : [];

    const bomQtyMap: Record<string, number> = {};
    matchedBoms.forEach((b) => {
      bomQtyMap[b.id] = Math.max(
        0,
        selectedBomQuantities[b.id] ?? getDefaultBomShipmentQty(b)
      );
    });

    const total1To1Qty =
      matchedBoms.length > 0
        ? matchedBoms.reduce((sum, b) => sum + (bomQtyMap[b.id] ?? 0), 0)
        : Math.max(1, Number(shippedQuantity) || 1);

    const combinedNames =
      matchedBoms.map((b) => b.name).join(' + ') || 'Hardware Shipment';
    const combinedModels =
      matchedBoms.map((b) => b.model).join(' + ') || 'QXT-HW';

    const newRow: ShippingDockItem = {
      id: `dock-${Date.now()}`,
      shipmentBatchLabel: batchLabel.trim() || `Batch #${dockItems.length + 1}`,
      integratorName: integratorName.trim() || partners[0] || 'SKBM',
      bomItemId: matchedBoms[0]?.id || 'custom',
      bomItemName: combinedNames,
      bomItemModel: combinedModels,
      bomItemIds: matchedBoms.map((b) => b.id),
      bomItemNames: matchedBoms.map((b) => b.name),
      bomItemModels: matchedBoms.map((b) => b.model),
      bomItemQuantities: bomQtyMap,
      shippedQuantity: total1To1Qty,
      carrier,
      trackingNumber: trackingNumber.trim() || 'PENDING-TRK',
      shippedDate,
      estimatedArrivalDate,
      status,
      customerAccepted: false,
      customerScenarioNotes: '',
    };

    onUpdateProject({
      ...project,
      shippingDockItems: [...dockItems, newRow],
      lastUpdated: new Date().toISOString(),
    });

    setIsAddingShipment(false);
  };

  const handleUpdateDockItem = (id: string, updates: Partial<ShippingDockItem>) => {
    const updated = dockItems.map((item) => {
      if (item.id === id) {
        if (updates.bomItemIds) {
          const matchedBoms = bomItems.filter((b) => updates.bomItemIds!.includes(b.id));
          const existingQtyMap = getDockRowBomQuantities(item, bomItems);
          const nextQtyMap: Record<string, number> = {};
          matchedBoms.forEach((b) => {
            nextQtyMap[b.id] =
              updates.bomItemQuantities?.[b.id] ??
              existingQtyMap[b.id] ??
              getDefaultBomShipmentQty(b);
          });
          const nextTotalQty = matchedBoms.reduce(
            (sum, b) => sum + (nextQtyMap[b.id] ?? 0),
            0
          );
          return {
            ...item,
            ...updates,
            bomItemId: matchedBoms[0]?.id || item.bomItemId,
            bomItemName:
              matchedBoms.map((b) => b.name).join(' + ') || item.bomItemName,
            bomItemModel:
              matchedBoms.map((b) => b.model).join(' + ') || item.bomItemModel,
            bomItemIds: matchedBoms.map((b) => b.id),
            bomItemNames: matchedBoms.map((b) => b.name),
            bomItemModels: matchedBoms.map((b) => b.model),
            bomItemQuantities: nextQtyMap,
            shippedQuantity:
              updates.shippedQuantity !== undefined
                ? updates.shippedQuantity
                : nextTotalQty,
          };
        }
        if (updates.bomItemId && updates.bomItemId !== item.bomItemId) {
          const matched = bomItems.find((b) => b.id === updates.bomItemId);
          const defaultQty = matched ? getDefaultBomShipmentQty(matched) : item.shippedQuantity;
          return {
            ...item,
            ...updates,
            bomItemIds: matched ? [matched.id] : item.bomItemIds,
            bomItemNames: matched ? [matched.name] : item.bomItemNames,
            bomItemModels: matched ? [matched.model] : item.bomItemModels,
            bomItemName: matched ? matched.name : item.bomItemName,
            bomItemModel: matched ? matched.model : item.bomItemModel,
            bomItemQuantities: matched ? { [matched.id]: defaultQty } : item.bomItemQuantities,
            shippedQuantity: defaultQty,
          };
        }
        return { ...item, ...updates };
      }
      return item;
    });

    onUpdateProject({
      ...project,
      shippingDockItems: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Update a specific BOM item's 1:1 shipped quantity directly in an existing Shipping Dock table row
  const handleUpdateDockRowBomItemQty = (
    item: ShippingDockItem,
    bomId: string,
    newQty: number
  ) => {
    const clamped = Math.max(0, newQty);
    const currentMap = getDockRowBomQuantities(item, bomItems);
    const nextMap: Record<string, number> = {
      ...currentMap,
      [bomId]: clamped,
    };
    const rowBomIds =
      item.bomItemIds && item.bomItemIds.length > 0 ? item.bomItemIds : [item.bomItemId];
    const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
    const totalQty =
      matchedBoms.length > 0
        ? matchedBoms.reduce((sum, b) => sum + (nextMap[b.id] ?? 0), 0)
        : clamped;

    handleUpdateDockItem(item.id, {
      bomItemQuantities: nextMap,
      shippedQuantity: totalQty,
    });
  };

  const handleDeleteDockItem = (id: string) => {
    onUpdateProject({
      ...project,
      shippingDockItems: dockItems.filter((i) => i.id !== id),
      lastUpdated: new Date().toISOString(),
    });
  };

  const formatDockItem1To1Breakdown = (item: ShippingDockItem): string => {
    const rowBomIds =
      item.bomItemIds && item.bomItemIds.length > 0 ? item.bomItemIds : [item.bomItemId];
    const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
    const qtyMap = getDockRowBomQuantities(item, bomItems);
    if (matchedBoms.length === 0) {
      return `${item.bomItemName} (Qty ${item.shippedQuantity})`;
    }
    return matchedBoms
      .map((b) => {
        const finishStr = b.lockFinishConfig ? ` [${getLockFinishSummaryTag(b.lockFinishConfig)}]` : '';
        return `${b.name}${finishStr} (${b.model}): Qty ${qtyMap[b.id] ?? 0}`;
      })
      .join(' + ');
  };

  // Builds a clean, clutter-free HTML table for Shipping Dock customer emails
  const buildShippingEmailTableHtml = (itemsToRender: ShippingDockItem[]): string => {
    if (itemsToRender.length === 0) {
      return `<p style="font-size: 13px; color: #64748b; margin: 12px 0;">No shipment batches logged yet.</p>`;
    }

    const tableRows = itemsToRender
      .map((item) => {
        const rowBomIds =
          item.bomItemIds && item.bomItemIds.length > 0
            ? item.bomItemIds
            : [item.bomItemId];
        const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
        const qtyMap = getDockRowBomQuantities(item, bomItems);

        const hardwareItemsHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-weight: 600; color: #0f172a;">${b.name}${
                      b.lockFinishConfig
                        ? `<br/><span style="font-size: 11px; color: #475569; font-weight: normal;">Finish: ${getLockFinishSummaryTag(
                            b.lockFinishConfig
                          )}</span>`
                        : ''
                    }</div>`
                )
                .join('')
            : `<div style="font-weight: 600; color: #0f172a;">${item.bomItemName}</div>`;

        const quantityHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-family: monospace; font-weight: 700; color: #0369a1;">${
                      qtyMap[b.id] ?? 0
                    } units</div>`
                )
                .join('')
            : `<div style="font-family: monospace; font-weight: 700; color: #0369a1;">${item.shippedQuantity} units</div>`;

        return `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
              ${hardwareItemsHtml}
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.shipmentBatchLabel}</div>
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px; white-space: nowrap;">
              ${quantityHtml}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #1e293b;">
              <div style="font-weight: 600;">${item.carrier}</div>
              <div style="font-family: monospace; font-size: 11px; color: #0284c7; margin-top: 2px;">${item.trackingNumber}</div>
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #334155; white-space: nowrap;">
              <div><strong>Shipped:</strong> ${item.shippedDate || 'TBD'}</div>
              <div style="margin-top: 2px;"><strong>ETA:</strong> ${item.estimatedArrivalDate || 'TBD'}</div>
              <div style="margin-top: 4px; display: inline-block; padding: 2px 6px; border-radius: 4px; background-color: #f0f9ff; color: #0369a1; font-size: 10px; font-weight: 700;">${item.status}</div>
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Hardware Shipped</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Carrier &amp; Tracking</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Ship Date &amp; ETA</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  // Send ALL shipment updates as a whole to the customer via Gmail
  const handleSendAllShipmentsUpdate = () => {
    const portalLink = buildProductAcceptancePortalUrl(project.id);
    const summaryText = dockItems
      .map(
        (d) =>
          `${formatDockItem1To1Breakdown(d)} [Total ${d.shippedQuantity} units via ${d.carrier}, Tracking: ${d.trackingNumber}, Status: ${d.status}]`
      )
      .join('; ');

    const tableHtml = buildShippingEmailTableHtml(dockItems);

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #0284c7; font-weight: bold; text-transform: uppercase; line-height: 28px;">Shipping Dock Update</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155;">Here is the hardware shipping summary for <strong>${project.propertyName}</strong>:</p>
        ${tableHtml}
        <p style="margin-top: 16px; font-size: 13px; color: #334155;">Once received on site, please confirm delivery in the <a href="${portalLink}" style="color: #0284c7; font-weight: 600;">Product Acceptance Portal</a>.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send Full Shipping Dock Update via Gmail',
      defaultRecipients: defaultRecipient,
      subject: `Shipping Dock Update (All Batches): ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const updatedItems = dockItems.map((item) => ({
          ...item,
          lastNotifiedCustomerAt: nowStr,
        }));

        const newLog: CustomerCommsLog = {
          id: `ship-all-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'shipping_update_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent complete Shipping Dock table update (${dockItems.length} line items) to customer: ${summaryText} [Gmail ID: ${gmailMessageId || 'Sent'}]`,
          sentBy: project.assignedPM.name,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          shippingDockItems: updatedItems,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });

        setAlertBanner(
          `Real email delivered via Gmail: Full Shipping Dock update (${dockItems.length} line items) sent to ${recipients.join(', ')}!`
        );
        setTimeout(() => setAlertBanner(null), 5000);
      },
    });
  };

  // Send a single line item shipment update to the customer via Gmail
  const handleSendSingleLineItemUpdate = (item: ShippingDockItem) => {
    const portalLink = buildProductAcceptancePortalUrl(project.id);
    const breakdownStr = formatDockItem1To1Breakdown(item);
    const tableHtml = buildShippingEmailTableHtml([item]);

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #0284c7; font-weight: bold; text-transform: uppercase; line-height: 28px;">Shipment Update</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155;">Here is a hardware shipment update for <strong>${project.propertyName}</strong>:</p>
        ${tableHtml}
        <p style="margin-top: 16px; font-size: 13px; color: #334155;">Once received on site, please confirm delivery in the <a href="${portalLink}" style="color: #0284c7; font-weight: 600;">Product Acceptance Portal</a>.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: `Confirm & Send Batch Update (${item.bomItemName}) via Gmail`,
      defaultRecipients: defaultRecipient,
      subject: `Shipment Update (${item.bomItemName}): ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const updatedItems = dockItems.map((d) =>
          d.id === item.id ? { ...d, lastNotifiedCustomerAt: nowStr } : d
        );

        const newLog: CustomerCommsLog = {
          id: `ship-item-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'shipping_update_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent single-batch shipping update for ${breakdownStr} (Total ${item.shippedQuantity} units via ${item.carrier}, Tracking #: ${item.trackingNumber}, ETA: ${item.estimatedArrivalDate}) [Gmail ID: ${gmailMessageId || 'Sent'}].`,
          sentBy: project.assignedPM.name,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          shippingDockItems: updatedItems,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });

        setAlertBanner(
          `Real email delivered via Gmail: Single line-item update for "${item.bomItemName}" sent to ${recipients.join(', ')}!`
        );
        setTimeout(() => setAlertBanner(null), 5000);
      },
    });
  };

  // Prompt PM to confirm details and email Product Acceptance Portal to the customer
  const handleOpenSendProductAcceptancePortal = () => {
    setIsSendPortalModalOpen(true);
  };

  const handleProductAcceptanceDispatched = ({
    recipients,
    subject,
    gmailMessageId,
    sentViaGmail,
  }: {
    recipients: string[];
    subject: string;
    gmailMessageId?: string;
    sentViaGmail: boolean;
  }) => {
    const portalLink = buildProductAcceptancePortalUrl(project.id);
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLog: CustomerCommsLog = {
      id: `prod-accept-req-${Date.now()}`,
      projectId: project.id,
      timestamp: nowStr,
      type: 'product_acceptance_request',
      recipientEmail: recipients.join(', '),
      subject,
      summary: `Dispatched Product Acceptance Portal link (${portalLink}) via ${
        sentViaGmail ? 'Gmail' : 'Direct Dispatch'
      } to customer to confirm receipt of ${dockItems.length} shipment batches and sign off [ID: ${
        gmailMessageId || 'Sent'
      }].`,
      sentBy: project.assignedPM.name,
      status: 'Delivered',
    };

    onUpdateProject({
      ...project,
      customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
      lastUpdated: new Date().toISOString(),
    });

    setAlertBanner(
      `Real email delivered via Gmail: Product Acceptance Portal sent to ${recipients.join(', ')}!`
    );
    setTimeout(() => setAlertBanner(null), 5000);
  };

  return (
    <div id="shipping-dock-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Truck className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Shipping &ldquo;Dock&rdquo; Table
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 rounded font-bold">
              {dockItems.length} Shipment Batches
            </span>
            {project.productAcceptanceSubmission && (
              <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                Signed by {project.productAcceptanceSubmission.signedByName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track hardware shipments our integrators are sending to the customer, adjust 1:1 quantities for each tied BOM line item with arrows or manual entry, document tracking numbers, and dispatch updates &amp; the customer Product Acceptance Portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSendAllShipmentsUpdate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg transition-colors cursor-pointer"
            title="Send all shipment updates as a whole to the customer"
          >
            <Send className="w-3.5 h-3.5 text-sky-700" />
            <span>Send Full Update to Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAcceptanceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Preview what the customer sees in their Product Acceptance Portal"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Preview Portal</span>
          </button>

          <button
            type="button"
            onClick={handleOpenSendProductAcceptancePortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Prompt to confirm portal details and email the Product Acceptance Portal to the customer"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Send Product Acceptance Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingShipment(!isAddingShipment)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingShipment ? 'Cancel' : '+ Add Shipment Batch'}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center justify-between font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{alertBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Add New Shipment Form (Supports Multiple BOM Line Items with 1:1 Shipped Quantities) */}
      {isAddingShipment && (
        <form
          onSubmit={handleAddShipmentRow}
          className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-3 text-xs animate-fadeIn"
        >
          <div className="font-bold text-sky-950 text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-600" />
            <span>Log New Integrator Shipment Tied to BOM Line Items (1:1 Qty per BOM Item)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Shipment Batch Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={batchLabel}
                    onChange={(e) => setBatchLabel(e.target.value)}
                    placeholder="e.g. Batch #1 - Gateways & Locks"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sending Integrator / Partner *
                  </label>
                  <input
                    type="text"
                    required
                    value={integratorName}
                    onChange={(e) => setIntegratorName(e.target.value)}
                    placeholder="e.g. SKBM, ATB, SBH"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* 1:1 Selected BOM Shipped Quantities Summary Box */}
              <div className="bg-white border border-sky-200 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[11px] font-bold text-sky-950">
                    1:1 BOM Shipped Quantities
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Total Batch Qty: {shippedQuantity}
                  </span>
                </div>

                {selectedBomIds.length === 0 ? (
                  <div className="text-[11px] text-slate-400 py-1">
                    Select one or more BOM items on the right to adjust 1:1 shipped quantities.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {bomItems
                      .filter((b) => selectedBomIds.includes(b.id))
                      .map((b) => {
                        const qty =
                          selectedBomQuantities[b.id] ?? getDefaultBomShipmentQty(b);
                        return (
                          <div
                            key={`ship-summary-qty-${b.id}`}
                            className="flex items-center justify-between gap-2 text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200/80"
                          >
                            <span className="truncate font-semibold text-slate-800">
                              {b.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdjustSelectedShipmentBomQty(b.id, qty - 1)
                                }
                                className="p-0.5 bg-white hover:bg-sky-50 border border-slate-300 rounded text-slate-700 cursor-pointer"
                                title="Decrease"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={qty}
                                onChange={(e) =>
                                  handleAdjustSelectedShipmentBomQty(
                                    b.id,
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="w-14 text-center px-1 py-0.5 bg-white border border-sky-300 rounded font-mono font-bold text-sky-950 text-[11px]"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdjustSelectedShipmentBomQty(b.id, qty + 1)
                                }
                                className="p-0.5 bg-white hover:bg-sky-50 border border-slate-300 rounded text-slate-700 cursor-pointer"
                                title="Increase"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <span className="text-[10px] font-mono text-slate-500">
                                / {b.quantity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Multi-select BOM Line Items Checklist with 1:1 Qty Adjusters */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Tie to BOM Line Item(s) &amp; Adjust 1:1 Shipped Qty ({selectedBomIds.length} selected) *
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => syncShipmentQtyFromSelectedBoms(bomItems.map((b) => b.id))}
                    className="font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() =>
                      syncShipmentQtyFromSelectedBoms(bomItems[0] ? [bomItems[0].id] : [])
                    }
                    className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg p-2 max-h-52 overflow-y-auto space-y-1.5">
                {bomItems.map((b) => {
                  const isChecked = selectedBomIds.includes(b.id);
                  const currentItemQty =
                    selectedBomQuantities[b.id] ?? getDefaultBomShipmentQty(b);
                  return (
                    <div
                      key={b.id}
                      className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                        isChecked
                          ? 'bg-sky-50/90 border border-sky-200 text-sky-950 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <label className="flex items-center gap-2 min-w-0 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleShipmentBomId(b.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="truncate">
                          {b.name}{' '}
                          <span className="font-mono text-[10px] text-slate-500">
                            ({b.model})
                          </span>
                        </span>
                      </label>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500">
                          Quoted: {b.quantity} {b.sparesCount ? `+ ${b.sparesCount} spares` : ''}
                        </span>

                        {isChecked && (
                          <div
                            className="flex items-center gap-1 bg-white border border-sky-300 rounded-md px-1 py-0.5 shadow-2xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] font-bold text-sky-700 px-1">
                              Qty:
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdjustSelectedShipmentBomQty(
                                  b.id,
                                  currentItemQty - 1
                                )
                              }
                              className="p-0.5 hover:bg-sky-100 text-sky-700 rounded transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentItemQty}
                              onChange={(e) =>
                                handleAdjustSelectedShipmentBomQty(
                                  b.id,
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 text-center px-1 py-0.5 bg-sky-50/50 border border-sky-200 rounded font-mono font-bold text-sky-950 text-xs focus:outline-none focus:border-sky-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleAdjustSelectedShipmentBomQty(
                                  b.id,
                                  currentItemQty + 1
                                )
                              }
                              className="p-0.5 hover:bg-sky-100 text-sky-700 rounded transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Shipped Date
              </label>
              <input
                type="date"
                value={shippedDate}
                onChange={(e) => setShippedDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Carrier *
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value as ShippingCarrier)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="FedEx Freight">FedEx Freight</option>
                <option value="UPS Supply Chain">UPS Supply Chain</option>
                <option value="DHL Express">DHL Express</option>
                <option value="Old Dominion LTL">Old Dominion LTL</option>
                <option value="Direct Integrator Courier">Direct Integrator Courier</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Tracking Number *
              </label>
              <input
                type="text"
                required
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 1Z9999999999999999"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Est. Arrival Date
              </label>
              <input
                type="date"
                value={estimatedArrivalDate}
                onChange={(e) => setEstimatedArrivalDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Dock Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentDockStatus)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
              >
                <option value="Preparing at Dock">Preparing at Dock</option>
                <option value="Shipped / In Transit">Shipped / In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered to Site">Delivered to Site</option>
                <option value="Accepted by Customer">Accepted by Customer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingShipment(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
            >
              Save Shipment to Dock Table
            </button>
          </div>
        </form>
      )}

      {/* Shipping Dock Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-2.5 px-3">Shipment Batch &amp; Integrator</th>
              <th className="py-2.5 px-3 min-w-[230px]">Tied BOM Line Item(s)</th>
              <th className="py-2.5 px-3 min-w-[240px] text-right">
                1:1 Shipped Qty (by BOM Item)
              </th>
              <th className="py-2.5 px-3">Carrier</th>
              <th className="py-2.5 px-3 min-w-[175px]">Tracking Number</th>
              <th className="py-2.5 px-3">Ship / ETA Dates</th>
              <th className="py-2.5 px-3 min-w-[165px]">Shipment Status</th>
              <th className="py-2.5 px-3 min-w-[210px]">Customer Scenario Notes &amp; Sign-Off</th>
              <th className="py-2.5 px-3 text-right">Send By Line Item</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dockItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No shipments logged in the Shipping Dock Table yet. Click <strong>&quot;+ Add Shipment Batch&quot;</strong> above.
                </td>
              </tr>
            ) : (
              dockItems.map((item) => {
                const rowBomIds =
                  item.bomItemIds && item.bomItemIds.length > 0
                    ? item.bomItemIds
                    : [item.bomItemId];
                const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
                const rowQtyMap = getDockRowBomQuantities(item, bomItems);
                const totalRowQuoted = matchedBoms.reduce((acc, b) => acc + b.quantity, 0);
                const totalRowSpares = matchedBoms.reduce(
                  (acc, b) => acc + (b.sparesCount || 0),
                  0
                );
                const isEditingBoms = editingBomRowId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Batch & Integrator */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.shipmentBatchLabel}
                        onChange={(e) =>
                          handleUpdateDockItem(item.id, { shipmentBatchLabel: e.target.value })
                        }
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none w-full"
                      />
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span>Integrator:</span>
                        <input
                          type="text"
                          value={item.integratorName}
                          onChange={(e) =>
                            handleUpdateDockItem(item.id, { integratorName: e.target.value })
                          }
                          className="font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 w-24"
                        />
                      </div>
                    </td>

                    {/* Tied BOM Line Item(s) */}
                    <td className="py-2.5 px-3">
                      {isEditingBoms ? (
                        <div className="bg-white border border-sky-300 rounded-lg p-1.5 max-h-36 overflow-y-auto space-y-1">
                          {bomItems.map((b) => {
                            const checked = rowBomIds.includes(b.id);
                            return (
                              <label
                                key={b.id}
                                className="flex items-center gap-1.5 text-[11px] cursor-pointer hover:bg-sky-50 px-1.5 py-0.5 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const nextIds = checked
                                      ? rowBomIds.filter((id) => id !== b.id)
                                      : [...rowBomIds, b.id];
                                    if (nextIds.length > 0) {
                                      handleUpdateDockItem(item.id, { bomItemIds: nextIds });
                                    }
                                  }}
                                  className="rounded border-slate-300 text-sky-600"
                                />
                                <span className="truncate font-semibold text-slate-800">
                                  {b.name} ({b.model})
                                </span>
                              </label>
                            );
                          })}
                          <div className="pt-1 border-t border-slate-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingBomRowId(null)}
                              className="text-[10px] font-bold text-sky-700 hover:underline cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {matchedBoms.length > 0 ? (
                              matchedBoms.map((b) => {
                                const itemQty = rowQtyMap[b.id] ?? 0;
                                return (
                                  <span
                                    key={b.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[11px] font-bold text-sky-950"
                                  >
                                    <span>{b.name}</span>
                                    <span className="font-mono text-[10px] text-sky-700">
                                      ({b.model})
                                    </span>
                                    {b.lockFinishConfig && (
                                      <span className="inline-flex items-center gap-1 ml-0.5 px-1.5 py-0.2 rounded bg-slate-900 text-white font-sans text-[10px] font-medium">
                                        <span
                                          className="w-1.5 h-1.5 rounded-full border border-white/50 shrink-0"
                                          style={{
                                            backgroundColor: getLockFinishColorHex(
                                              b.lockFinishConfig.befeColorFinish ||
                                              b.lockFinishConfig.ndeColorFinish ||
                                              b.lockFinishConfig.xe360ColorFinish
                                            ),
                                          }}
                                        />
                                        <span>{getLockFinishSummaryTag(b.lockFinishConfig)}</span>
                                      </span>
                                    )}
                                    <span className="ml-0.5 px-1.5 py-0.2 rounded bg-white border border-sky-200 font-mono text-[10px] text-sky-900">
                                      Qty: {itemQty}
                                    </span>
                                  </span>
                                );
                              })
                            ) : (
                              <span className="font-bold text-slate-900">{item.bomItemName}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                            <span>
                              BOM Quoted: {totalRowQuoted}{' '}
                              {totalRowSpares ? `+ ${totalRowSpares} spares` : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingBomRowId(item.id)}
                              className="text-sky-700 hover:underline font-sans font-bold cursor-pointer"
                            >
                              + Edit BOM Items
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 1:1 Shipped Quantity per Tied BOM Line Item */}
                    <td className="py-2.5 px-3 text-right">
                      {matchedBoms.length > 0 ? (
                        <div className="space-y-1.5">
                          {matchedBoms.map((b) => {
                            const itemQty = rowQtyMap[b.id] ?? 0;
                            const bMaxWithSpares = b.quantity + (b.sparesCount || 0);
                            return (
                              <div
                                key={`dock-qty-${item.id}-${b.id}`}
                                className="flex items-center justify-end gap-1.5 bg-sky-50/40 border border-sky-200/80 rounded-lg px-2 py-1"
                              >
                                <span
                                  className="text-[10px] font-semibold text-slate-700 truncate max-w-[110px]"
                                  title={b.name}
                                >
                                  {b.name}:
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateDockRowBomItemQty(
                                        item,
                                        b.id,
                                        itemQty - 1
                                      )
                                    }
                                    className="p-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-sky-700 transition-colors cursor-pointer"
                                    title={`Decrease ${b.name} shipped quantity`}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    value={itemQty}
                                    onChange={(e) =>
                                      handleUpdateDockRowBomItemQty(
                                        item,
                                        b.id,
                                        parseInt(e.target.value, 10) || 0
                                      )
                                    }
                                    className="w-14 text-center px-1 py-0.5 bg-white border border-sky-300 rounded font-mono font-bold text-sky-950 text-xs focus:outline-none focus:border-sky-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateDockRowBomItemQty(
                                        item,
                                        b.id,
                                        itemQty + 1
                                      )
                                    }
                                    className="p-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-sky-700 transition-colors cursor-pointer"
                                    title={`Increase ${b.name} shipped quantity`}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                </div>
                                <span
                                  className="text-[10px] font-mono text-slate-500 min-w-[38px] text-right"
                                  title={`Quoted: ${b.quantity}${b.sparesCount ? ` + ${b.sparesCount} spares` : ''}`}
                                >
                                  / {bMaxWithSpares}
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-end gap-1.5 pt-0.5 text-[10px] font-mono">
                            <span className="font-bold text-sky-900">
                              Total Shipped: {item.shippedQuantity}
                            </span>
                            <span className="text-slate-400">
                              / {totalRowQuoted + totalRowSpares}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateDockItem(item.id, {
                                shippedQuantity: Math.max(0, item.shippedQuantity - 1),
                              })
                            }
                            className="p-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-sky-700 cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={item.shippedQuantity}
                            onChange={(e) =>
                              handleUpdateDockItem(item.id, {
                                shippedQuantity: Math.max(
                                  0,
                                  parseInt(e.target.value, 10) || 0
                                ),
                              })
                            }
                            className="w-16 text-center px-1.5 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateDockItem(item.id, {
                                shippedQuantity: item.shippedQuantity + 1,
                              })
                            }
                            className="p-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-sky-700 cursor-pointer"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Carrier */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.carrier}
                        onChange={(e) =>
                          handleUpdateDockItem(item.id, {
                            carrier: e.target.value as ShippingCarrier,
                          })
                        }
                        className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-medium"
                      >
                        <option value="FedEx Freight">FedEx Freight</option>
                        <option value="UPS Supply Chain">UPS Supply Chain</option>
                        <option value="DHL Express">DHL Express</option>
                        <option value="Old Dominion LTL">Old Dominion LTL</option>
                        <option value="Direct Integrator Courier">Direct Integrator Courier</option>
                      </select>
                    </td>

                    {/* Tracking Number */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.trackingNumber}
                        onChange={(e) =>
                          handleUpdateDockItem(item.id, { trackingNumber: e.target.value })
                        }
                        placeholder="Enter tracking #..."
                        className="w-full px-2 py-1 bg-sky-50/60 border border-sky-200 rounded font-mono font-bold text-sky-900 text-[11px] focus:outline-none focus:border-sky-500"
                      />
                    </td>

                    {/* Dates */}
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">Ship:</span>
                        <input
                          type="date"
                          value={item.shippedDate}
                          onChange={(e) =>
                            handleUpdateDockItem(item.id, { shippedDate: e.target.value })
                          }
                          className="bg-transparent text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">ETA:</span>
                        <input
                          type="date"
                          value={item.estimatedArrivalDate}
                          onChange={(e) =>
                            handleUpdateDockItem(item.id, { estimatedArrivalDate: e.target.value })
                          }
                          className="bg-transparent text-slate-900 font-bold focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateDockItem(item.id, {
                            status: e.target.value as ShipmentDockStatus,
                          })
                        }
                        className={`w-full text-xs font-bold rounded px-2 py-1 border cursor-pointer ${
                          item.status === 'Accepted by Customer'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.status === 'Delivered to Site'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'Shipped / In Transit' || item.status === 'Out for Delivery'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Preparing at Dock">📦 Preparing at Dock</option>
                        <option value="Shipped / In Transit">🚚 Shipped / In Transit</option>
                        <option value="Out for Delivery">📍 Out for Delivery</option>
                        <option value="Delivered to Site">✓ Delivered to Site</option>
                        <option value="Accepted by Customer">✍ Accepted by Customer</option>
                      </select>
                    </td>

                    {/* Customer Scenario Notes & Acceptance */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={item.customerScenarioNotes || ''}
                          onChange={(e) =>
                            handleUpdateDockItem(item.id, {
                              customerScenarioNotes: e.target.value,
                            })
                          }
                          placeholder="Customer scenario notes..."
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                        {item.customerAccepted && (
                          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Customer Confirmed Receipt</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Send Update by Line Item + Delete */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSendSingleLineItemUpdate(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                          title="Send shipping update for only this line item batch to the customer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Line Item</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDockItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Remove shipment row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.lastNotifiedCustomerAt && (
                        <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                          Sent: {item.lastNotifiedCustomerAt}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Product Acceptance Portal Modal */}
      {isAcceptanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto">
            <ProductAcceptancePortalModal
              project={project}
              onUpdateProject={onUpdateProject}
              onClose={() => setIsAcceptanceModalOpen(false)}
            />
          </div>
        </div>
      )}

      <ConfirmProductAcceptanceModal
        project={project}
        isOpen={isSendPortalModalOpen}
        onClose={() => setIsSendPortalModalOpen(false)}
        onPreviewPortal={() => {
          setIsSendPortalModalOpen(false);
          setIsAcceptanceModalOpen(true);
        }}
        onDispatched={handleProductAcceptanceDispatched}
      />

      <LiveGmailConfirmModal
        payload={gmailModalPayload}
        onClose={() => setGmailModalPayload(null)}
      />
    </div>
  );
};
