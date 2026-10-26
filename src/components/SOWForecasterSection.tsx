import React, { useState } from 'react';
import {
  OperationProject,
  SOWForecastItem,
  CustomerCommsLog,
  BOMItem,
  getProjectIntegratorPartners,
  PendingInstallationChange,
  InstallLogEntry,
} from '../types';
import {
  ClipboardList,
  Plus,
  Send,
  CheckCircle2,
  Trash2,
  Wrench,
  Edit3,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { LiveGmailConfirmModal, LiveGmailModalPayload } from './LiveGmailConfirmModal';

interface SOWForecasterSectionProps {
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
  editorRole?: 'pm' | 'field_tech' | 'integrator_partner';
  editorName?: string;
  onConfirmInstallation?: (changeId?: string, sowItemId?: string) => void;
}

export const SOWForecasterSection: React.FC<SOWForecasterSectionProps> = ({
  project,
  onUpdateProject,
  editorRole = 'pm',
  editorName,
  onConfirmInstallation,
}) => {
  const sowItems: SOWForecastItem[] = project.sowForecastItems || [];
  const bomItems = project.bomItems || [];
  const partners = getProjectIntegratorPartners(project);

  const getDefaultBomForecastQty = (b: BOMItem): number => {
    const rem = Math.max(0, b.quantity - (b.installedCount || 0));
    return rem > 0 ? rem : Math.max(1, b.quantity);
  };

  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [selectedBomIds, setSelectedBomIds] = useState<string[]>(
    bomItems[0] ? [bomItems[0].id] : []
  );
  const [selectedBomQuantities, setSelectedBomQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    bomItems.forEach((b) => {
      initial[b.id] = getDefaultBomForecastQty(b);
    });
    return initial;
  });
  const [workDescription, setWorkDescription] = useState<string>('');
  const [buildingOrArea, setBuildingOrArea] = useState<string>('');
  const [assignedInstaller, setAssignedInstaller] = useState<string>(
    partners[0] ? `${partners[0]} Field Crew` : 'SKBM Field Crew'
  );
  const [forecastedQuantity, setForecastedQuantity] = useState<number>(
    bomItems[0] ? getDefaultBomForecastQty(bomItems[0]) : 24
  );
  const [scheduledStartDate, setScheduledStartDate] = useState<string>('2026-10-23');
  const [scheduledEndDate, setScheduledEndDate] = useState<string>('2026-10-30');
  const [itemStatus, setItemStatus] = useState<SOWForecastItem['status']>('Forecasted');
  const [itemNotes, setItemNotes] = useState<string>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [sentAlert, setSentAlert] = useState<string | null>(null);
  const [gmailModalPayload, setGmailModalPayload] = useState<LiveGmailModalPayload | null>(null);

  // Resolve 1:1 BOM item quantities for any existing SOWForecastItem
  const getRowBomQuantities = (item: SOWForecastItem): Record<string, number> => {
    const rowBomIds =
      item.bomItemIds && item.bomItemIds.length > 0 ? item.bomItemIds : [item.bomItemId];
    const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
    const map: Record<string, number> = {};

    if (matchedBoms.length === 1) {
      const onlyBom = matchedBoms[0];
      map[onlyBom.id] =
        item.bomItemQuantities?.[onlyBom.id] !== undefined
          ? item.bomItemQuantities[onlyBom.id]
          : item.forecastedQuantity;
      return map;
    }

    matchedBoms.forEach((b) => {
      if (item.bomItemQuantities && item.bomItemQuantities[b.id] !== undefined) {
        map[b.id] = item.bomItemQuantities[b.id];
      } else {
        map[b.id] = getDefaultBomForecastQty(b);
      }
    });
    return map;
  };

  // Compute BOM vs SOW Forecast alignment metrics
  const totalBomQuoted = bomItems.reduce((acc, b) => acc + b.quantity, 0);
  const totalBomInstalled = bomItems.reduce((acc, b) => acc + (b.installedCount || 0), 0);
  const totalBomRemaining = Math.max(0, totalBomQuoted - totalBomInstalled);
  const totalForecastedUnits = sowItems.reduce((acc, s) => acc + (s.forecastedQuantity || 0), 0);

  const syncFieldsFromSelectedBoms = (
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
          nextQtyMap[b.id] = getDefaultBomForecastQty(b);
        }
      });
      setSelectedBomQuantities(nextQtyMap);

      const sumQty = matchedList.reduce(
        (sum, b) => sum + Math.max(0, nextQtyMap[b.id] ?? getDefaultBomForecastQty(b)),
        0
      );
      setForecastedQuantity(sumQty);

      const uniqueLocations = Array.from(
        new Set(matchedList.map((b) => b.location).filter(Boolean))
      );
      if (!buildingOrArea.trim() && uniqueLocations.length > 0) {
        setBuildingOrArea(uniqueLocations.join(' & '));
      }
      if (!workDescription.trim()) {
        setWorkDescription(
          `Install, wire, and commission ${matchedList.map((b) => b.name).join(' + ')}`
        );
      }
    }
  };

  const handleToggleBomIdSelection = (bomId: string) => {
    const exists = selectedBomIds.includes(bomId);
    const nextIds = exists
      ? selectedBomIds.filter((id) => id !== bomId)
      : [...selectedBomIds, bomId];
    syncFieldsFromSelectedBoms(nextIds);
  };

  const handleAdjustSelectedBomQty = (bomId: string, nextVal: number) => {
    const clamped = Math.max(0, nextVal);
    const updatedMap = {
      ...selectedBomQuantities,
      [bomId]: clamped,
    };
    setSelectedBomQuantities(updatedMap);
    const matchedList = bomItems.filter((b) => selectedBomIds.includes(b.id));
    if (matchedList.length > 0) {
      const sumQty = matchedList.reduce((sum, b) => sum + (updatedMap[b.id] ?? 0), 0);
      setForecastedQuantity(sumQty);
    }
  };

  const handleAddSOWItem = (e: React.FormEvent) => {
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
        selectedBomQuantities[b.id] ?? getDefaultBomForecastQty(b)
      );
    });

    const total1To1Qty =
      matchedBoms.length > 0
        ? matchedBoms.reduce((sum, b) => sum + (bomQtyMap[b.id] ?? 0), 0)
        : Math.max(1, Number(forecastedQuantity) || 1);

    const combinedNames =
      matchedBoms.map((b) => b.name).join(' + ') || 'Custom Hardware Scope';

    const newItem: SOWForecastItem = {
      id: `sow-${Date.now()}`,
      bomItemId: matchedBoms[0]?.id || 'custom-bom',
      bomItemName: combinedNames,
      bomItemIds: matchedBoms.map((b) => b.id),
      bomItemNames: matchedBoms.map((b) => b.name),
      bomItemQuantities: bomQtyMap,
      workDescription:
        workDescription.trim() ||
        `Install and commission ${combinedNames} per SOW schedule`,
      buildingOrArea:
        buildingOrArea.trim() ||
        Array.from(new Set(matchedBoms.map((b) => b.location).filter(Boolean))).join(' & ') ||
        'Property Buildings',
      assignedInstaller: assignedInstaller.trim() || `${partners[0] || 'SKBM'} Field Crew`,
      forecastedQuantity: total1To1Qty,
      scheduledStartDate,
      scheduledEndDate,
      status: itemStatus,
      notes: itemNotes.trim(),
    };

    onUpdateProject({
      ...project,
      sowForecastItems: [...sowItems, newItem],
      lastUpdated: new Date().toISOString(),
    });

    setWorkDescription('');
    setBuildingOrArea('');
    setItemNotes('');
    setIsAddingItem(false);
  };

  const handleUpdateSOWItem = (id: string, updates: Partial<SOWForecastItem>) => {
    let newlyCompletedItem: SOWForecastItem | null = null;
    let qtyMapForCompleted: Record<string, number> = {};

    const updated = sowItems.map((item) => {
      if (item.id === id) {
        let merged: SOWForecastItem = { ...item, ...updates };
        if (updates.bomItemIds) {
          const matchedBoms = bomItems.filter((b) => updates.bomItemIds!.includes(b.id));
          const existingQtyMap = getRowBomQuantities(item);
          const nextQtyMap: Record<string, number> = {};
          matchedBoms.forEach((b) => {
            nextQtyMap[b.id] =
              updates.bomItemQuantities?.[b.id] ??
              existingQtyMap[b.id] ??
              getDefaultBomForecastQty(b);
          });
          const nextTotalQty = matchedBoms.reduce(
            (sum, b) => sum + (nextQtyMap[b.id] ?? 0),
            0
          );
          merged = {
            ...merged,
            bomItemId: matchedBoms[0]?.id || item.bomItemId,
            bomItemName:
              matchedBoms.map((b) => b.name).join(' + ') || item.bomItemName,
            bomItemIds: matchedBoms.map((b) => b.id),
            bomItemNames: matchedBoms.map((b) => b.name),
            bomItemQuantities: nextQtyMap,
            forecastedQuantity:
              updates.forecastedQuantity !== undefined
                ? updates.forecastedQuantity
                : nextTotalQty,
          };
        }
        if (updates.bomItemId && updates.bomItemId !== item.bomItemId) {
          const matched = bomItems.find((b) => b.id === updates.bomItemId);
          const defaultQty = matched ? getDefaultBomForecastQty(matched) : item.forecastedQuantity;
          merged = {
            ...merged,
            bomItemIds: matched ? [matched.id] : item.bomItemIds,
            bomItemNames: matched ? [matched.name] : item.bomItemNames,
            bomItemName: matched ? matched.name : item.bomItemName,
            bomItemQuantities: matched ? { [matched.id]: defaultQty } : item.bomItemQuantities,
            forecastedQuantity: defaultQty,
          };
        }

        // If marking as completed
        if (updates.status === 'Completed' && item.status !== 'Completed') {
          qtyMapForCompleted = getRowBomQuantities(merged);
          if (editorRole === 'field_tech' || editorRole === 'integrator_partner') {
            merged.pendingPMConfirmation = true;
            merged.submittedByRole = editorRole;
          } else {
            merged.pendingPMConfirmation = false;
            merged.confirmedAt = new Date().toISOString();
          }
          newlyCompletedItem = merged;
        }

        return merged;
      }
      return item;
    });

    if (newlyCompletedItem && (editorRole === 'field_tech' || editorRole === 'integrator_partner')) {
      // Stage pending installation change for PM review & confirmation
      const completedSow = newlyCompletedItem as SOWForecastItem;
      const pendingChange: PendingInstallationChange = {
        id: `pending-sow-${Date.now()}`,
        source: 'sow_forecaster',
        sourceId: completedSow.id,
        title: `SOW Item Completed: ${completedSow.workDescription || completedSow.bomItemName}`,
        submittedBy: editorName || (editorRole === 'field_tech' ? 'Field Technician' : 'Integrator Partner Crew'),
        submittedRole: editorRole,
        submittedAt: new Date().toISOString(),
        details: `Marked Completed in ${completedSow.buildingOrArea || 'All Zones'} (${completedSow.forecastedQuantity} units). Awaiting PM Confirmation.`,
        bomIncrements: qtyMapForCompleted,
        status: 'pending',
      };

      onUpdateProject({
        ...project,
        sowForecastItems: updated,
        pendingInstallationChanges: [pendingChange, ...(project.pendingInstallationChanges || [])],
        lastUpdated: new Date().toISOString(),
      });
      return;
    }

    if (newlyCompletedItem && editorRole === 'pm') {
      // Direct PM update: commit updates to BOM installed counts and installer logs immediately!
      const updatedBOM = project.bomItems.map((b) => {
        const inc = qtyMapForCompleted[b.id] || 0;
        if (inc > 0) {
          return {
            ...b,
            installedCount: Math.min(b.quantity, (b.installedCount || 0) + inc),
          };
        }
        return b;
      });

      const nowTime = new Date();
      const formattedTimestamp = `${nowTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })} ${nowTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      const completedSow = newlyCompletedItem as SOWForecastItem;
      const newLogs: InstallLogEntry[] = Object.entries(qtyMapForCompleted).map(([bomId, qty]) => {
        const b = project.bomItems.find((x) => x.id === bomId);
        return {
          id: `log-sow-${Date.now()}-${bomId}`,
          projectId: project.id,
          timestamp: formattedTimestamp,
          installerName: completedSow.assignedInstaller || 'Project Manager Direct Verification',
          itemId: bomId,
          itemName: b?.name || completedSow.bomItemName,
          quantityCompleted: qty,
          locationCompleted: completedSow.buildingOrArea || 'Site-wide',
          statusCheck: 'Verified & Online',
          notes: `SOW Scope Completed: ${completedSow.workDescription || completedSow.bomItemName}`,
          color: 'emerald',
        };
      });

      onUpdateProject({
        ...project,
        bomItems: updatedBOM,
        installLogs: [...newLogs, ...project.installLogs],
        sowForecastItems: updated,
        lastUpdated: new Date().toISOString(),
      });
      return;
    }

    onUpdateProject({
      ...project,
      sowForecastItems: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Update a specific BOM item's 1:1 quantity directly in an existing SOW Forecast table row
  const handleUpdateRowBomItemQty = (
    item: SOWForecastItem,
    bomId: string,
    newQty: number
  ) => {
    const clamped = Math.max(0, newQty);
    const currentMap = getRowBomQuantities(item);
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

    handleUpdateSOWItem(item.id, {
      bomItemQuantities: nextMap,
      forecastedQuantity: totalQty,
    });
  };

  const handleDeleteSOWItem = (id: string) => {
    onUpdateProject({
      ...project,
      sowForecastItems: sowItems.filter((item) => item.id !== id),
      lastUpdated: new Date().toISOString(),
    });
  };

  const formatItem1To1BreakdownText = (item: SOWForecastItem): string => {
    const rowBomIds =
      item.bomItemIds && item.bomItemIds.length > 0 ? item.bomItemIds : [item.bomItemId];
    const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
    const qtyMap = getRowBomQuantities(item);
    if (matchedBoms.length === 0) {
      return `${item.bomItemName} (${item.forecastedQuantity} units)`;
    }
    return matchedBoms
      .map((b) => `${b.name}: ${qtyMap[b.id] ?? 0}/${b.quantity} units`)
      .join(', ');
  };

  const formatSOWDateDisplay = (item: SOWForecastItem): string => {
    if (!item.scheduledStartDate && !item.scheduledEndDate) return 'TBD';
    if (
      !item.scheduledEndDate ||
      item.scheduledStartDate === item.scheduledEndDate
    ) {
      return item.scheduledStartDate;
    }
    return `${item.scheduledStartDate} – ${item.scheduledEndDate}`;
  };

  // Builds a clean, clutter-free HTML table showing What Was Installed, Quantity, Date, and Scope of Work Summary
  const buildSOWEmailTableHtml = (itemsToRender: SOWForecastItem[]): string => {
    if (itemsToRender.length === 0) {
      return `<p style="font-size: 13px; color: #64748b; margin: 12px 0;">Initial installation scope alignment is currently in progress.</p>`;
    }

    const tableRows = itemsToRender
      .map((item) => {
        const rowBomIds =
          item.bomItemIds && item.bomItemIds.length > 0
            ? item.bomItemIds
            : [item.bomItemId];
        const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
        const qtyMap = getRowBomQuantities(item);

        const installedItemsHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-weight: 600; color: #0f172a;">${b.name}</div>`
                )
                .join('')
            : `<div style="font-weight: 600; color: #0f172a;">${item.bomItemName}</div>`;

        const quantityHtml =
          matchedBoms.length > 0
            ? matchedBoms
                .map(
                  (b) =>
                    `<div style="margin-bottom: 3px; font-family: monospace; font-weight: 700; color: #312e81;">${
                      qtyMap[b.id] ?? 0
                    } units</div>`
                )
                .join('')
            : `<div style="font-family: monospace; font-weight: 700; color: #312e81;">${item.forecastedQuantity} units</div>`;

        const dateStr = formatSOWDateDisplay(item);
        const scopeSummaryHtml = `
          <div style="color: #1e293b; font-weight: 500; line-height: 1.4;">${item.workDescription}</div>
          ${
            item.buildingOrArea
              ? `<div style="font-size: 11px; color: #64748b; margin-top: 3px;">Location: ${item.buildingOrArea}</div>`
              : ''
          }
        `;

        return `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
              ${installedItemsHtml}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px; white-space: nowrap;">
              ${quantityHtml}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #334155; white-space: nowrap;">
              ${dateStr}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
              ${scopeSummaryHtml}
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">What Was Installed</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Date</th>
            <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Scope of Work Summary</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  const getDefaultCustomerRecipient = (): string =>
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'RFRleasing@gmail.com';

  const handleSendSOWOverviewToCustomer = () => {
    const recipient = getDefaultCustomerRecipient();

    const cadence =
      project.emailOverviewCadence ||
      project.customerIntake?.emailUpdatesCadence ||
      'weekly';

    const summaryLines = sowItems
      .map(
        (s) =>
          `${formatItem1To1BreakdownText(s)} (${formatSOWDateDisplay(s)}): ${s.workDescription}`
      )
      .join(' | ');

    const tableHtml = buildSOWEmailTableHtml(sowItems);

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #4f46e5; font-weight: bold; text-transform: uppercase; line-height: 28px;">Installation Scope Summary</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155;">Here is the latest installation &amp; Scope of Work summary for <strong>${project.propertyName}</strong>:</p>
        ${tableHtml}
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations (${project.assignedPM.email})
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send SOW Forecaster Overview via Gmail',
      defaultRecipients: recipient,
      subject: `Installation Scope Summary: ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const updatedSowItems = sowItems.map((item) => ({
          ...item,
          lastNotifiedCustomerAt: nowStr,
        }));

        const newLog: CustomerCommsLog = {
          id: `sow-comms-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'sow_forecast_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Dispatched SOW Forecaster Overview (${sowItems.length} line items, ${totalForecastedUnits} units). Scope: ${summaryLines || 'Initial forecast'} [Gmail ID: ${gmailMessageId || 'Sent'}]`,
          sentBy: project.assignedPM.name,
          cadence,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          sowForecastItems: updatedSowItems,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });

        setSentAlert(
          `Real email delivered via Gmail to ${recipients.join(', ')} (Synced with ${cadence.toUpperCase()} cadence)!`
        );
        setTimeout(() => setSentAlert(null), 5000);
      },
    });
  };

  // Send an individual SOW Forecaster line-item update to the customer via Gmail
  const handleSendSingleSOWItemToCustomer = (item: SOWForecastItem) => {
    const recipient = getDefaultCustomerRecipient();
    const tableHtml = buildSOWEmailTableHtml([item]);
    const breakdownText = formatItem1To1BreakdownText(item);

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #4f46e5; font-weight: bold; text-transform: uppercase; line-height: 28px;">Installation Scope Update</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155;">Here is an installation &amp; Scope of Work update for <strong>${project.propertyName}</strong>:</p>
        ${tableHtml}
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM.name}</strong> • Quext Implementation Operations (${project.assignedPM.email})
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: `Confirm & Send SOW Line Item Update (${item.bomItemName}) via Gmail`,
      defaultRecipients: recipient,
      subject: `Installation Scope Update (${item.bomItemName}): ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const updatedSowItems = sowItems.map((s) =>
          s.id === item.id ? { ...s, lastNotifiedCustomerAt: nowStr } : s
        );

        const newLog: CustomerCommsLog = {
          id: `sow-item-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'sow_forecast_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent single SOW line-item update for ${breakdownText} (${formatSOWDateDisplay(item)} — ${item.workDescription}) [Gmail ID: ${gmailMessageId || 'Sent'}].`,
          sentBy: project.assignedPM.name,
          status: 'Delivered',
        };

        onUpdateProject({
          ...project,
          sowForecastItems: updatedSowItems,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });

        setSentAlert(
          `Real email delivered via Gmail: SOW line-item update for "${item.bomItemName}" sent to ${recipients.join(', ')}!`
        );
        setTimeout(() => setSentAlert(null), 5000);
      },
    });
  };

  return (
    <div id="sow-forecaster-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              SOW Forecaster
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded font-bold uppercase">
              CSM Intro - Pre-Implementation Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Forecast scope of work for installers via line items, document what work will be completed, and adjust 1:1 quantities for each matched BOM line item with arrows or manual entry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSendSOWOverviewToCustomer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Send SOW Forecaster overview to customer now"
          >
            <Send className="w-3.5 h-3.5 text-indigo-700" />
            <span>Send SOW Overview to Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingItem ? 'Cancel' : '+ Add SOW Forecast Line Item'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {sentAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center justify-between font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sentAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setSentAlert(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* BOM Match Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase text-slate-500">Total BOM Quoted</div>
          <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
            {totalBomQuoted.toLocaleString()} <span className="text-xs font-normal text-slate-500">devices</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across {bomItems.length} BOM line items</div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase text-slate-500">Installed vs Remaining BOM</div>
          <div className="text-base font-extrabold text-sky-800 font-mono mt-0.5">
            {totalBomInstalled.toLocaleString()} <span className="text-xs font-normal text-slate-500">installed</span> ·{' '}
            <span className="text-amber-700">{totalBomRemaining.toLocaleString()} rem</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Live field installation progress</div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-indigo-200">
          <div className="text-[10px] font-bold uppercase text-indigo-700">SOW Forecasted Scope</div>
          <div className="text-base font-extrabold text-indigo-900 font-mono mt-0.5">
            {totalForecastedUnits.toLocaleString()} <span className="text-xs font-normal text-indigo-700">forecasted units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{sowItems.length} installer work packages</div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex flex-col justify-between">
          <div className="text-[10px] font-bold uppercase text-slate-500">Customer Cadence Sync</div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-slate-900 text-xs capitalize">
              {project.emailOverviewCadence || project.customerIntake?.emailUpdatesCadence || 'Weekly'} Cadence
            </span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-indigo-800">
              <input
                type="checkbox"
                checked={project.sowForecastCadenceEnabled ?? true}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    sowForecastCadenceEnabled: e.target.checked,
                    lastUpdated: new Date().toISOString(),
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Auto-Send on Milestone</span>
            </label>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Dispatches automatically on CSM Intro - Pre-implementation
          </div>
        </div>
      </div>

      {/* Add SOW Forecast Line Item Form (Supports Multiple BOM Line Items with 1:1 Quantities) */}
      {isAddingItem && (
        <form
          onSubmit={handleAddSOWItem}
          className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3 text-xs animate-fadeIn"
        >
          <div className="font-bold text-indigo-950 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Forecasted Installer Scope Line Item (1:1 Qty per BOM Line Item)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Multi-select BOM Line Items Checklist with 1:1 Qty Adjusters */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Match to BOM Line Item(s) &amp; Adjust 1:1 Forecast Qty ({selectedBomIds.length} selected) *
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => syncFieldsFromSelectedBoms(bomItems.map((b) => b.id))}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() =>
                      syncFieldsFromSelectedBoms(bomItems[0] ? [bomItems[0].id] : [])
                    }
                    className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg p-2 max-h-52 overflow-y-auto space-y-1.5">
                {bomItems.map((b) => {
                  const rem = Math.max(0, b.quantity - (b.installedCount || 0));
                  const isChecked = selectedBomIds.includes(b.id);
                  const currentItemQty =
                    selectedBomQuantities[b.id] ?? getDefaultBomForecastQty(b);
                  return (
                    <div
                      key={b.id}
                      className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                        isChecked
                          ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <label className="flex items-center gap-2 min-w-0 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBomIdSelection(b.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
                          Quoted: {b.quantity} | Rem: {rem}
                        </span>

                        {isChecked && (
                          <div
                            className="flex items-center gap-1 bg-white border border-indigo-300 rounded-md px-1 py-0.5 shadow-2xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] font-bold text-indigo-700 px-1">
                              Qty:
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdjustSelectedBomQty(b.id, currentItemQty - 1)
                              }
                              className="p-0.5 hover:bg-indigo-100 text-indigo-700 rounded transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentItemQty}
                              onChange={(e) =>
                                handleAdjustSelectedBomQty(
                                  b.id,
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 text-center px-1 py-0.5 bg-indigo-50/50 border border-indigo-200 rounded font-mono font-bold text-indigo-950 text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleAdjustSelectedBomQty(b.id, currentItemQty + 1)
                              }
                              className="p-0.5 hover:bg-indigo-100 text-indigo-700 rounded transition-colors cursor-pointer"
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

            {/* 1:1 Selected BOM Quantities Summary & Installer Assignment */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white border border-indigo-200 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[11px] font-bold text-indigo-950">
                    1:1 BOM Forecasted Quantities
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Total: {forecastedQuantity} units
                  </span>
                </div>

                {selectedBomIds.length === 0 ? (
                  <div className="text-[11px] text-slate-400 py-1">
                    Select one or more BOM items on the left to adjust 1:1 quantities.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {bomItems
                      .filter((b) => selectedBomIds.includes(b.id))
                      .map((b) => {
                        const qty =
                          selectedBomQuantities[b.id] ?? getDefaultBomForecastQty(b);
                        return (
                          <div
                            key={`summary-qty-${b.id}`}
                            className="flex items-center justify-between gap-2 text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200/80"
                          >
                            <span className="truncate font-semibold text-slate-800">
                              {b.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleAdjustSelectedBomQty(b.id, qty - 1)}
                                className="p-0.5 bg-white hover:bg-indigo-50 border border-slate-300 rounded text-slate-700 cursor-pointer"
                                title="Decrease"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={qty}
                                onChange={(e) =>
                                  handleAdjustSelectedBomQty(
                                    b.id,
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="w-14 text-center px-1 py-0.5 bg-white border border-indigo-300 rounded font-mono font-bold text-indigo-950 text-[11px]"
                              />
                              <button
                                type="button"
                                onClick={() => handleAdjustSelectedBomQty(b.id, qty + 1)}
                                className="p-0.5 bg-white hover:bg-indigo-50 border border-slate-300 rounded text-slate-700 cursor-pointer"
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

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Assigned Installer / Crew *
                </label>
                <input
                  type="text"
                  value={assignedInstaller}
                  onChange={(e) => setAssignedInstaller(e.target.value)}
                  placeholder="e.g. SKBM Field Crew Alpha"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Scope of Work Description (What Work Will Be Completed) *
              </label>
              <input
                type="text"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="e.g. Install & calibrate BLE deadbolts, mortise strike plates, and verify Apple Wallet keys"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Building / Area Location *
              </label>
              <input
                type="text"
                value={buildingOrArea}
                onChange={(e) => setBuildingOrArea(e.target.value)}
                placeholder="e.g. Buildings 3 & 4 (Floors 1-3)"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Forecasted Start Date
              </label>
              <input
                type="date"
                value={scheduledStartDate}
                onChange={(e) => setScheduledStartDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Forecasted Completion Date
              </label>
              <input
                type="date"
                value={scheduledEndDate}
                onChange={(e) => setScheduledEndDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Forecast Status
              </label>
              <select
                value={itemStatus}
                onChange={(e) => setItemStatus(e.target.value as SOWForecastItem['status'])}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
              >
                <option value="Forecasted">Forecasted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
            >
              Save SOW Forecast Item
            </button>
          </div>
        </form>
      )}

      {/* SOW Forecaster Line Items Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-2.5 px-3 min-w-[230px]">Matched BOM Line Item(s)</th>
              <th className="py-2.5 px-3 min-w-[220px]">Scope of Work to Complete</th>
              <th className="py-2.5 px-3">Building / Location</th>
              <th className="py-2.5 px-3">Assigned Installer</th>
              <th className="py-2.5 px-3 min-w-[250px] text-right">
                1:1 BOM Qty Match (Forecast / BOM)
              </th>
              <th className="py-2.5 px-3">Forecast Window</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Send By Line Item / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sowItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No SOW forecast line items documented yet. Click <strong>&quot;+ Add SOW Forecast Line Item&quot;</strong> above to match installer scope 1:1 against BOM items.
                </td>
              </tr>
            ) : (
              sowItems.map((item) => {
                const rowBomIds =
                  item.bomItemIds && item.bomItemIds.length > 0
                    ? item.bomItemIds
                    : [item.bomItemId];
                const matchedBoms = bomItems.filter((b) => rowBomIds.includes(b.id));
                const rowQtyMap = getRowBomQuantities(item);
                const bomQuoted = matchedBoms.reduce((acc, b) => acc + b.quantity, 0);
                const bomInstalled = matchedBoms.reduce(
                  (acc, b) => acc + (b.installedCount || 0),
                  0
                );
                const bomRemaining = Math.max(0, bomQuoted - bomInstalled);
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Matched BOM Item(s) */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <div className="bg-white border border-indigo-300 rounded-lg p-1.5 max-h-36 overflow-y-auto space-y-1">
                          {bomItems.map((b) => {
                            const checked = rowBomIds.includes(b.id);
                            return (
                              <label
                                key={b.id}
                                className="flex items-center gap-1.5 text-[11px] cursor-pointer hover:bg-indigo-50 px-1.5 py-0.5 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const nextIds = checked
                                      ? rowBomIds.filter((id) => id !== b.id)
                                      : [...rowBomIds, b.id];
                                    if (nextIds.length > 0) {
                                      handleUpdateSOWItem(item.id, { bomItemIds: nextIds });
                                    }
                                  }}
                                  className="rounded border-slate-300 text-indigo-600"
                                />
                                <span className="truncate font-semibold text-slate-800">
                                  {b.name} ({b.model})
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {matchedBoms.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {matchedBoms.map((b) => {
                                const itemQty = rowQtyMap[b.id] ?? 0;
                                return (
                                  <span
                                    key={b.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-950"
                                  >
                                    <span>{b.name}</span>
                                    <span className="font-mono text-[10px] text-indigo-600">
                                      ({b.model})
                                    </span>
                                    <span className="ml-0.5 px-1.5 py-0.2 rounded bg-white border border-indigo-200 font-mono text-[10px] text-indigo-800">
                                      Qty: {itemQty}
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="font-bold text-slate-900">{item.bomItemName}</div>
                          )}
                          {matchedBoms.length > 0 && (
                            <div className="text-[10px] font-mono text-slate-500">
                              {matchedBoms.length > 1
                                ? `${matchedBoms.length} BOM Items Matched (1:1)`
                                : `SKU: ${matchedBoms[0].model}`}{' '}
                              · Total Quoted: {bomQuoted} (Rem: {bomRemaining})
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Scope of Work Description */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.workDescription}
                          onChange={(e) =>
                            handleUpdateSOWItem(item.id, { workDescription: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-indigo-300 rounded text-xs"
                        />
                      ) : (
                        <div className="text-slate-800 font-medium leading-snug">
                          {item.workDescription}
                        </div>
                      )}
                    </td>

                    {/* Building / Location */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.buildingOrArea}
                          onChange={(e) =>
                            handleUpdateSOWItem(item.id, { buildingOrArea: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-indigo-300 rounded text-xs"
                        />
                      ) : (
                        <span className="text-slate-700">{item.buildingOrArea}</span>
                      )}
                    </td>

                    {/* Assigned Installer */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.assignedInstaller}
                          onChange={(e) =>
                            handleUpdateSOWItem(item.id, { assignedInstaller: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-indigo-300 rounded text-xs"
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                          <Wrench className="w-3 h-3 text-indigo-600" />
                          {item.assignedInstaller}
                        </span>
                      )}
                    </td>

                    {/* 1:1 Forecasted Quantity per BOM Line Item */}
                    <td className="py-2.5 px-3 text-right">
                      {matchedBoms.length > 0 ? (
                        <div className="space-y-1.5">
                          {matchedBoms.map((b) => {
                            const itemQty = rowQtyMap[b.id] ?? 0;
                            const bRem = Math.max(0, b.quantity - (b.installedCount || 0));
                            return (
                              <div
                                key={`row-qty-${item.id}-${b.id}`}
                                className="flex items-center justify-end gap-1.5 bg-indigo-50/40 border border-indigo-200/80 rounded-lg px-2 py-1"
                              >
                                <span
                                  className="text-[10px] font-semibold text-slate-700 truncate max-w-[115px]"
                                  title={b.name}
                                >
                                  {b.name}:
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateRowBomItemQty(item, b.id, itemQty - 1)
                                    }
                                    className="p-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700 transition-colors cursor-pointer"
                                    title={`Decrease ${b.name} forecast quantity`}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    value={itemQty}
                                    onChange={(e) =>
                                      handleUpdateRowBomItemQty(
                                        item,
                                        b.id,
                                        parseInt(e.target.value, 10) || 0
                                      )
                                    }
                                    className="w-14 text-center px-1 py-0.5 bg-white border border-indigo-300 rounded font-mono font-bold text-indigo-950 text-xs focus:outline-none focus:border-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateRowBomItemQty(item, b.id, itemQty + 1)
                                    }
                                    className="p-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700 transition-colors cursor-pointer"
                                    title={`Increase ${b.name} forecast quantity`}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                </div>
                                <span
                                  className="text-[10px] font-mono text-slate-500 min-w-[38px] text-right"
                                  title={`Quoted: ${b.quantity} | Remaining: ${bRem}`}
                                >
                                  / {b.quantity}
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-end gap-2 pt-0.5 text-[10px] font-mono">
                            <span className="font-bold text-indigo-900">
                              Total: {item.forecastedQuantity} / {bomQuoted}
                            </span>
                            <span
                              className={
                                item.forecastedQuantity === bomRemaining ||
                                item.forecastedQuantity === bomQuoted
                                  ? 'text-emerald-700 font-semibold'
                                  : 'text-slate-500'
                              }
                            >
                              {item.forecastedQuantity === bomRemaining
                                ? '✓ Matches Rem'
                                : item.forecastedQuantity === bomQuoted
                                ? '✓ Matches Full'
                                : `(${bomRemaining} rem)`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSOWItem(item.id, {
                                forecastedQuantity: Math.max(0, item.forecastedQuantity - 1),
                              })
                            }
                            className="p-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700 cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={item.forecastedQuantity}
                            onChange={(e) =>
                              handleUpdateSOWItem(item.id, {
                                forecastedQuantity: Math.max(
                                  0,
                                  parseInt(e.target.value, 10) || 0
                                ),
                              })
                            }
                            className="w-16 text-center px-1.5 py-0.5 bg-indigo-50/70 border border-indigo-300 rounded font-mono font-bold text-indigo-950"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSOWItem(item.id, {
                                forecastedQuantity: item.forecastedQuantity + 1,
                              })
                            }
                            className="p-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700 cursor-pointer"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Forecast Window */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input
                            type="date"
                            value={item.scheduledStartDate}
                            onChange={(e) =>
                              handleUpdateSOWItem(item.id, { scheduledStartDate: e.target.value })
                            }
                            className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                          />
                          <input
                            type="date"
                            value={item.scheduledEndDate}
                            onChange={(e) =>
                              handleUpdateSOWItem(item.id, { scheduledEndDate: e.target.value })
                            }
                            className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                          />
                        </div>
                      ) : (
                        <div>
                          <div>{item.scheduledStartDate}</div>
                          <div className="text-slate-400">to {item.scheduledEndDate}</div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateSOWItem(item.id, {
                            status: e.target.value as SOWForecastItem['status'],
                          })
                        }
                        className={`text-xs font-bold rounded px-2 py-1 border cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        <option value="Forecasted">📅 Forecasted</option>
                        <option value="In Progress">⚡ In Progress</option>
                        <option value="Completed">✓ Completed</option>
                      </select>

                      {item.status === 'Completed' && item.pendingPMConfirmation && (
                        <div className="mt-1 flex flex-col gap-1 items-start">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ⏳ Pending PM Review
                          </span>
                          {editorRole === 'pm' && (
                            <button
                              type="button"
                              onClick={() => onConfirmInstallation?.(undefined, item.id)}
                              className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="Confirm this installation update and commit to BOM"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirm installation</span>
                            </button>
                          )}
                        </div>
                      )}

                      {item.status === 'Completed' && !item.pendingPMConfirmation && item.confirmedAt && (
                        <div className="mt-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            ✓ Confirmed by PM
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Send By Line Item / Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendSingleSOWItemToCustomer(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[11px] shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                            title="Send clean table update for only this SOW line item to the customer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Line Item</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(isEditing ? null : item.id)}
                            className="p-1 text-slate-500 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                            title={isEditing ? 'Done editing' : 'Edit SOW line item'}
                          >
                            {isEditing ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Edit3 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSOWItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Delete SOW line item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.lastNotifiedCustomerAt && (
                          <span className="text-[10px] font-mono text-emerald-700">
                            Sent {item.lastNotifiedCustomerAt}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <LiveGmailConfirmModal
        payload={gmailModalPayload}
        onClose={() => setGmailModalPayload(null)}
      />
    </div>
  );
};
