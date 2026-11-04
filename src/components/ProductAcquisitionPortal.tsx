import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  OperationProject,
  LockFinishConfig,
  ProductAcquisitionSourceSection,
  ProductAcquisitionItemType,
  ProductAcquisitionFulfillmentStatus,
  AcquisitionOrderMilestones,
  ProjectActivityNotification,
  BOMItem,
  InstallLogEntry,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  formatFullFinishDetailsLines,
  getCategoryDisplayName,
  getPropertyManagementCompany,
  getProjectIntegratorPartners,
  normalizeFieldTech,
  canEditProductAcquisitionPortal,
  isProductAcquisitionUser,
  isCustomerSuccessManager,
  getDockItemTrackingNumbers,
  ShippingDockItem,
} from '../types';
import { LockFinishModal } from './LockFinishModal';
import {
  Package,
  Wrench,
  FilePlus2,
  Layers,
  Search,
  Filter,
  Building2,
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Calendar,
  Hash,
  AlertCircle,
  X,
  Edit2,
  ShieldAlert,
  Lock,
  Link2,
  Kanban,
  List,
  Warehouse,
  ShoppingCart,
  Inbox,
  Sliders,
  MoveRight,
  MoveLeft,
} from 'lucide-react';

export type AcquisitionKanbanColumnId =
  | 'Incoming'
  | 'Ordered'
  | 'Arrived at Warehouse'
  | 'Shipped'
  | 'Delivered';

export function getKanbanColumnForItem(
  item: UnifiedAcquisitionIntakeItem
): AcquisitionKanbanColumnId {
  if (item.isDelivered) {
    return 'Delivered';
  }
  if (item.isShipped) {
    return 'Shipped';
  }
  if (item.isArrivedToWarehouse) {
    return 'Arrived at Warehouse';
  }
  if (item.isOrdered) {
    return 'Ordered';
  }
  return 'Incoming';
}

export interface UnifiedAcquisitionIntakeItem {
  uid: string;
  projectId: string;
  propertyName: string;
  clientName: string;
  propertyManagementCompany: string;
  quoteNumber: string;
  assignedPMName: string;
  assignedCSMName: string;
  integratorPartners: string[];
  assignedFieldTech: string;
  // Tag 1: Where it came from
  sourceWorkspace: 'Project' | 'Property';
  sourceWorkspaceBadgeLabel: 'Project Page (Operations)' | 'Property Page (Customer Success)';
  // Tag 2: Section it came from & Type based on section
  sourceSection: ProductAcquisitionSourceSection;
  itemType: ProductAcquisitionItemType;
  // Reference IDs
  referenceNumber: string; // e.g., RMA-2026-01, CO-2026-01, ACQ-BOM-2026-01
  parentRecordId: string; // ticket.id, co.id, or submission.id
  lineItemId?: string; // for changeOrders
  bomItemId?: string;
  // Full Product Details
  productName: string;
  modelOrSku: string;
  productType: 'Hardware' | 'Software';
  category: string;
  manufacturer: string;
  locationOrScope: string;
  description: string;
  quantity: number;
  quotedQuantity?: number;
  installedCount?: number;
  sparesCount?: number;
  unitPrice: number;
  totalCost: number;
  billingCadence?: string;
  thermostatBrand?: string;
  lockFinishConfig?: LockFinishConfig;
  // Additional Context (RMA / Order / BOM Notes)
  reasonOrNotes: string;
  rmaDetails?: {
    matchedCompany: string;
    rmaStatus: string;
    claimType?: string;
    serialNumbers?: string;
    issuedRmaNumber?: string;
    returnTrackingNumber?: string;
    replacementTrackingNumber?: string;
  };
  fulfillmentStatus: ProductAcquisitionFulfillmentStatus;
  createdAt: string;
  createdBy: string;
  // Order Fulfillment Milestones & Needed By Date
  neededByDate?: string;
  isOrdered?: boolean;
  orderedAt?: string;
  isArrivedToWarehouse?: boolean;
  arrivedAt?: string;
  isShipped?: boolean;
  shippedAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  tiedShippingDockId?: string;
  tiedShippingDockBatch?: string;
}

interface ProductAcquisitionPortalProps {
  projects: OperationProject[];
  onUpdateProject: (updated: OperationProject) => void;
  onOpenProjectInOperations: (projectId: string) => void;
  onOpenPropertyInCustomerSuccess: (projectId: string) => void;
  currentUserName?: string;
}

const FULFILLMENT_STATUS_OPTIONS: ProductAcquisitionFulfillmentStatus[] = [
  'Pending Acquisition / Review',
  'PO Submitted / Ordered',
  'In Transit / Shipped',
  'Delivered / Fulfilled',
  'Cancelled',
];

function resolveOverrideFulfillmentStatus(raw: any): ProductAcquisitionFulfillmentStatus | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'object' && raw.status) return raw.status as ProductAcquisitionFulfillmentStatus;
  if (typeof raw === 'string') return raw as ProductAcquisitionFulfillmentStatus;
  return undefined;
}

export function isProjectMilestoneCompleted(p?: Partial<OperationProject> | null): boolean {
  if (!p || !p.milestones || p.milestones.length === 0) return false;
  // 1. Final milestone ('Project Closed' or closure) marked as Completed
  const closedMilestone = p.milestones.find(
    (m) =>
      m.title === 'Project Closed' ||
      m.title.toLowerCase().includes('closed') ||
      m.title.toLowerCase().includes('closure')
  );
  if (closedMilestone && closedMilestone.status === 'Completed') return true;
  // 2. 'Product Acquisition' milestone marked as Completed
  const acqMilestone = p.milestones.find(
    (m) =>
      m.title === 'Product Acquisition' ||
      m.title.toLowerCase().includes('acquisition')
  );
  if (acqMilestone && acqMilestone.status === 'Completed') return true;
  // 3. All milestones on the project are marked as Completed
  if (p.milestones.every((m) => m.status === 'Completed')) return true;
  // 4. Project status tag is 'Completed' or project is completed
  if ((p as any).isCompleted || (p.statusTag as any) === 'Completed') return true;
  return false;
}

export const ProductAcquisitionPortal: React.FC<ProductAcquisitionPortalProps> = ({
  projects,
  onUpdateProject,
  onOpenProjectInOperations,
  onOpenPropertyInCustomerSuccess,
  currentUserName = 'Product Acquisition Specialist',
}) => {
  const canEdit = canEditProductAcquisitionPortal(currentUserName);
  const [workspaceFilter, setWorkspaceFilter] = useState<'ALL' | 'Project' | 'Property'>('ALL');
  const [sectionTypeFilter, setSectionTypeFilter] = useState<'ALL' | ProductAcquisitionSourceSection>('ALL');
  const [propertyFilter, setPropertyFilter] = useState<string>('ALL');
  const [propertySearchQuery, setPropertySearchQuery] = useState<string>('');
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState<boolean>(false);
  const propertySearchContainerRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductAcquisitionFulfillmentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFinishUids, setExpandedFinishUids] = useState<Record<string, boolean>>({});
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Close property dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        propertySearchContainerRef.current &&
        !propertySearchContainerRef.current.contains(e.target as Node)
      ) {
        setIsPropertyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // View mode: 'kanban' (default) or 'list'
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedItemUid, setDraggedItemUid] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<AcquisitionKanbanColumnId | null>(null);

  // Local draft states for tracking numbers being edited per order UID
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>({});
  const [selectedDockItemForUid, setSelectedDockItemForUid] = useState<Record<string, string>>({});

  // Modal state to edit finish options directly from the Product Acquisition Portal
  const [editingFinishIntakeItem, setEditingFinishIntakeItem] =
    useState<UnifiedAcquisitionIntakeItem | null>(null);

  // Aggregate all intake items from all 4 sources across all projects/properties
  const allIntakeItems = useMemo<UnifiedAcquisitionIntakeItem[]>(() => {
    const list: UnifiedAcquisitionIntakeItem[] = [];

    for (const project of projects) {
      const pmc = getPropertyManagementCompany(project) || project.clientName || 'Not Specified';
      const partners = getProjectIntegratorPartners(project);
      const fieldTech = normalizeFieldTech(project.assignedFieldTech);
      const pmName = project.assignedPM?.name || 'Unassigned PM';
      const csmName = project.assignedCSM || 'Unassigned CSM';
      const overrides = project.acquisitionStatusOverrides || {};
      const milestones = project.acquisitionMilestones || {};

      // 1. Intake from Hardware RMA Ticketing Workflow (Project & Property pages)
      for (const ticket of project.rmaTickets || []) {
        const ws: 'Project' | 'Property' = ticket.sourceWorkspace === 'Property' ? 'Property' : 'Project';
        const uid = `rma::${project.id}::${ticket.id}`;
        const matchedBom = project.bomItems.find((b) => b.id === ticket.bomItemId);
        const resolvedFinish = ticket.lockFinishConfig || matchedBom?.lockFinishConfig;
        const resolvedTherm = ticket.thermostatBrand || matchedBom?.thermostatBrand;
        const uPrice = ticket.unitPrice ?? matchedBom?.unitPrice ?? 0;
        const qty = Math.max(1, Number(ticket.defectiveQuantity) || 1);

        const itemMilestone = milestones[uid];
        const isOrd = !!(itemMilestone?.isOrdered ?? ticket.isOrdered ?? (ticket.status === '3. RMA Number Issued'));
        const isArr = !!(itemMilestone?.isArrivedToWarehouse ?? ticket.isArrivedToWarehouse);
        const isShip = !!(itemMilestone?.isShipped ?? ticket.isShipped ?? (ticket.status === '4. Packaged & Shipped'));
        const isDeliv = !!(itemMilestone?.isDelivered ?? (ticket as any).isDelivered ?? (ticket.status === '5. Replacement Received / Closed'));
        const track = itemMilestone?.trackingNumber || ticket.trackingNumber || ticket.returnTrackingNumber || '';
        const needed = itemMilestone?.neededByDate || ticket.neededByDate || '';

        const defaultFulfillment: ProductAcquisitionFulfillmentStatus =
          isDeliv || ticket.status === '5. Replacement Received / Closed'
            ? 'Delivered / Fulfilled'
            : isShip || ticket.status === '4. Packaged & Shipped'
            ? 'In Transit / Shipped'
            : isOrd || ticket.status === '3. RMA Number Issued'
            ? 'PO Submitted / Ordered'
            : 'Pending Acquisition / Review';

        list.push({
          uid,
          projectId: project.id,
          propertyName: project.propertyName,
          clientName: project.clientName,
          propertyManagementCompany: pmc,
          quoteNumber: project.quoteNumber,
          assignedPMName: pmName,
          assignedCSMName: csmName,
          integratorPartners: partners,
          assignedFieldTech: fieldTech,
          sourceWorkspace: ws,
          sourceWorkspaceBadgeLabel:
            ws === 'Property' ? 'Property Page (Customer Success)' : 'Project Page (Operations)',
          sourceSection: 'Hardware RMA Ticketing Workflow',
          itemType: 'RMA Replacement / Warranty Claim',
          referenceNumber: ticket.ticketNumber,
          parentRecordId: ticket.id,
          bomItemId: ticket.bomItemId,
          productName: ticket.bomItemName,
          modelOrSku: ticket.bomItemModel,
          productType: 'Hardware',
          category: getCategoryDisplayName(ticket.bomItemCategory || matchedBom?.category || 'Hardware'),
          manufacturer: ticket.matchedCompany,
          locationOrScope: ticket.location || matchedBom?.location || 'Field RMA Replacement',
          description:
            ticket.description ||
            matchedBom?.description ||
            `${ticket.matchedCompany} RMA replacement hardware`,
          quantity: qty,
          quotedQuantity: matchedBom?.quantity,
          installedCount: matchedBom?.installedCount,
          sparesCount: matchedBom?.sparesCount,
          unitPrice: uPrice,
          totalCost: Number((qty * uPrice).toFixed(2)),
          thermostatBrand: resolvedTherm,
          lockFinishConfig: resolvedFinish,
          reasonOrNotes:
            ticket.failureDescription ||
            ticket.troubleshootingNotes ||
            'Hardware RMA Warranty Replacement',
          rmaDetails: {
            matchedCompany: ticket.matchedCompany,
            rmaStatus: ticket.status,
            claimType: ticket.brivoClaimType || ticket.eenReplacementMethod || ticket.pdkRmaPath,
            serialNumbers: ticket.serialNumbers,
            issuedRmaNumber: ticket.issuedRmaNumber,
            returnTrackingNumber: ticket.returnTrackingNumber,
            replacementTrackingNumber: track,
          },
          fulfillmentStatus: resolveOverrideFulfillmentStatus(overrides[uid]) || defaultFulfillment,
          createdAt: ticket.createdAt,
          createdBy: ticket.createdBy,
          neededByDate: needed,
          isOrdered: isOrd,
          orderedAt: itemMilestone?.orderedAt || ticket.orderedAt,
          isArrivedToWarehouse: isArr,
          arrivedAt: itemMilestone?.arrivedAt || ticket.arrivedAt,
          isShipped: isShip,
          shippedAt: itemMilestone?.shippedAt || ticket.shippedAt,
          isDelivered: isDeliv,
          deliveredAt: itemMilestone?.deliveredAt || (ticket as any).deliveredAt,
          trackingNumber: track,
          tiedShippingDockId: itemMilestone?.tiedShippingDockId || ticket.tiedShippingDockId,
          tiedShippingDockBatch: itemMilestone?.tiedShippingDockBatch || ticket.tiedShippingDockBatch,
        });
      }

      // 2 & 3. Intake from Product Acquisition and Change Order (Project Page) & Supplemental Order Catalog (Property Page)
      for (const co of project.changeOrders || []) {
        const ws: 'Project' | 'Property' = co.sourceWorkspace === 'Property' ? 'Property' : 'Project';
        const section: ProductAcquisitionSourceSection =
          ws === 'Property'
            ? 'Supplemental Order Catalog'
            : 'Product Acquisition and Change Order';
        const itemType: ProductAcquisitionItemType =
          ws === 'Property'
            ? 'Supplemental Catalog Order (Property)'
            : 'Product Acquisition & Change Order (Project)';

        const orderMilestone = milestones[`co::${project.id}::${co.id}`];

        for (const item of co.items || []) {
          const uid = `co::${project.id}::${co.id}::${item.id}`;
          const itemMilestone = milestones[uid] || orderMilestone;
          const qty = Math.max(1, Number(item.quantity) || 1);
          const uPrice = Number(item.unitPrice) || 0;

          const isOrd = !!(itemMilestone?.isOrdered ?? co.isOrdered ?? (co.status === 'Approved'));
          const isArr = !!(itemMilestone?.isArrivedToWarehouse ?? co.isArrivedToWarehouse);
          const isShip = !!(itemMilestone?.isShipped ?? co.isShipped);
          const isDeliv = !!(itemMilestone?.isDelivered ?? (co as any).isDelivered ?? (co.status === 'In Fulfillment / Installed' || item.installedCount >= item.quantity));
          const track = itemMilestone?.trackingNumber || co.trackingNumber || '';
          const needed = itemMilestone?.neededByDate || co.neededByDate || '';

          const defaultFulfillment: ProductAcquisitionFulfillmentStatus =
            isDeliv || co.status === 'In Fulfillment / Installed' || item.installedCount >= item.quantity
              ? 'Delivered / Fulfilled'
              : isShip
              ? 'In Transit / Shipped'
              : isOrd || co.status === 'Approved'
              ? 'PO Submitted / Ordered'
              : co.status === 'Cancelled'
              ? 'Cancelled'
              : 'Pending Acquisition / Review';

          list.push({
            uid,
            projectId: project.id,
            propertyName: project.propertyName,
            clientName: project.clientName,
            propertyManagementCompany: pmc,
            quoteNumber: project.quoteNumber,
            assignedPMName: pmName,
            assignedCSMName: csmName,
            integratorPartners:
              co.integratorPartners && co.integratorPartners.length > 0
                ? co.integratorPartners
                : partners,
            assignedFieldTech: co.assignedFieldTech
              ? normalizeFieldTech(co.assignedFieldTech)
              : fieldTech,
            sourceWorkspace: ws,
            sourceWorkspaceBadgeLabel:
              ws === 'Property' ? 'Property Page (Customer Success)' : 'Project Page (Operations)',
            sourceSection: section,
            itemType,
            referenceNumber: co.changeOrderNumber,
            parentRecordId: co.id,
            lineItemId: item.id,
            productName: item.name,
            modelOrSku: item.sku,
            productType: item.productType,
            category: getCategoryDisplayName(item.category),
            manufacturer: item.manufacturer || 'Quext',
            locationOrScope: item.location || co.title,
            description: item.description || `${item.productType} catalog item on ${co.changeOrderNumber}`,
            quantity: qty,
            installedCount: item.installedCount,
            unitPrice: uPrice,
            totalCost: Number((qty * uPrice).toFixed(2)),
            billingCadence: item.billingType,
            thermostatBrand: item.thermostatBrand,
            lockFinishConfig: item.lockFinishConfig,
            reasonOrNotes: [co.title, item.notes, co.reason].filter(Boolean).join(' — '),
            fulfillmentStatus: resolveOverrideFulfillmentStatus(overrides[uid]) || defaultFulfillment,
            createdAt: co.createdAt,
            createdBy: co.createdBy,
            neededByDate: needed,
            isOrdered: isOrd,
            orderedAt: itemMilestone?.orderedAt || co.orderedAt,
            isArrivedToWarehouse: isArr,
            arrivedAt: itemMilestone?.arrivedAt || co.arrivedAt,
            isShipped: isShip,
            shippedAt: itemMilestone?.shippedAt || co.shippedAt,
            isDelivered: isDeliv,
            deliveredAt: itemMilestone?.deliveredAt || (co as any).deliveredAt,
            trackingNumber: track,
            tiedShippingDockId:
              itemMilestone?.tiedShippingDockId || item.tiedShippingDockId || co.tiedShippingDockId,
            tiedShippingDockBatch:
              itemMilestone?.tiedShippingDockBatch || item.tiedShippingDockBatch || co.tiedShippingDockBatch,
          });
        }
      }

      // 4. Intake from Smart Community Bill of Materials (BOM) sent via "Send to Acquisition" button
      for (const sub of project.bomAcquisitionSubmissions || []) {
        const ws: 'Project' | 'Property' = sub.sourceWorkspace === 'Property' ? 'Property' : 'Project';
        const uid = `bom::${project.id}::${sub.id}`;
        const matchedBom = project.bomItems.find((b) => b.id === sub.bomItemId);
        const resolvedFinish = sub.lockFinishConfig || matchedBom?.lockFinishConfig;
        const itemMilestone = milestones[uid];

        const isOrd = !!(itemMilestone?.isOrdered ?? sub.isOrdered ?? (sub.fulfillmentStatus === 'PO Submitted / Ordered'));
        const isArr = !!(itemMilestone?.isArrivedToWarehouse ?? (sub as any).isArrivedToWarehouse);
        const isShip = !!(itemMilestone?.isShipped ?? (sub as any).isShipped ?? (sub.fulfillmentStatus === 'In Transit / Shipped'));
        const isDeliv = !!(itemMilestone?.isDelivered ?? (sub as any).isDelivered ?? (sub.fulfillmentStatus === 'Delivered / Fulfilled'));
        const track = itemMilestone?.trackingNumber || sub.trackingNumber || sub.poOrTrackingNumber || '';
        const needed = itemMilestone?.neededByDate || sub.neededByDate || '';

        list.push({
          uid,
          projectId: project.id,
          propertyName: project.propertyName,
          clientName: project.clientName,
          propertyManagementCompany: pmc,
          quoteNumber: project.quoteNumber,
          assignedPMName: pmName,
          assignedCSMName: csmName,
          integratorPartners: partners,
          assignedFieldTech: fieldTech,
          sourceWorkspace: ws,
          sourceWorkspaceBadgeLabel:
            ws === 'Property' ? 'Property Page (Customer Success)' : 'Project Page (Operations)',
          sourceSection: 'Smart Community Bill of Materials (BOM)',
          itemType: 'BOM Line-Item Acquisition Request',
          referenceNumber: sub.submissionNumber,
          parentRecordId: sub.id,
          bomItemId: sub.bomItemId,
          productName: sub.name || sub.itemName || 'BOM Item',
          modelOrSku: sub.model,
          productType: 'Hardware',
          category: getCategoryDisplayName(sub.category),
          manufacturer: sub.thermostatBrand || 'Quext / Authorized OEM',
          locationOrScope: sub.location || 'Smart Community BOM Scope',
          description:
            sub.description ||
            matchedBom?.description ||
            `Smart Community BOM Line Item (${sub.model})`,
          quantity: sub.confirmedQuantity ?? sub.confirmedQuantityToSend ?? 1,
          quotedQuantity: sub.quotedQuantity ?? sub.originalBomQuantity,
          installedCount: sub.installedCount ?? sub.installedBomQuantity,
          sparesCount: sub.sparesCount,
          unitPrice: sub.unitPrice,
          totalCost: sub.totalCost ?? (sub.confirmedQuantity ?? 1) * sub.unitPrice,
          thermostatBrand: sub.thermostatBrand,
          lockFinishConfig: resolvedFinish,
          reasonOrNotes:
            sub.notes ||
            `Confirmed BOM quantity (${sub.confirmedQuantity ?? sub.confirmedQuantityToSend} quoted) sent to Product Acquisition`,
          fulfillmentStatus:
            resolveOverrideFulfillmentStatus(overrides[uid]) ||
            sub.fulfillmentStatus ||
            sub.status ||
            'Pending Acquisition / Review',
          createdAt: sub.createdAt,
          createdBy: sub.createdBy,
          neededByDate: needed,
          isOrdered: isOrd,
          orderedAt: itemMilestone?.orderedAt || sub.orderedAt,
          isArrivedToWarehouse: isArr,
          arrivedAt: itemMilestone?.arrivedAt || sub.arrivedAt,
          isShipped: isShip,
          shippedAt: itemMilestone?.shippedAt || sub.shippedAt,
          isDelivered: isDeliv,
          deliveredAt: itemMilestone?.deliveredAt || (sub as any).deliveredAt,
          trackingNumber: track,
          tiedShippingDockId: itemMilestone?.tiedShippingDockId || sub.tiedShippingDockId,
          tiedShippingDockBatch: itemMilestone?.tiedShippingDockBatch || sub.tiedShippingDockBatch,
        });
      }
    }

    return list;
  }, [projects]);

  // Summary KPIs
  const kpis = useMemo(() => {
    const rmaCount = allIntakeItems.filter(
      (i) => i.sourceSection === 'Hardware RMA Ticketing Workflow'
    ).length;
    const projectCoCount = allIntakeItems.filter(
      (i) => i.sourceSection === 'Product Acquisition and Change Order'
    ).length;
    const propertySuppCount = allIntakeItems.filter(
      (i) => i.sourceSection === 'Supplemental Order Catalog'
    ).length;
    const bomSentCount = allIntakeItems.filter(
      (i) => i.sourceSection === 'Smart Community Bill of Materials (BOM)'
    ).length;
    const fromProjectPage = allIntakeItems.filter((i) => i.sourceWorkspace === 'Project').length;
    const fromPropertyPage = allIntakeItems.filter((i) => i.sourceWorkspace === 'Property').length;
    const totalUnits = allIntakeItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    const totalValue = allIntakeItems.reduce((sum, i) => sum + (Number(i.totalCost) || 0), 0);

    const orderedCount = allIntakeItems.filter((i) => i.isOrdered).length;
    const arrivedCount = allIntakeItems.filter((i) => i.isArrivedToWarehouse).length;
    const shippedCount = allIntakeItems.filter((i) => i.isShipped).length;

    return {
      totalItems: allIntakeItems.length,
      rmaCount,
      projectCoCount,
      propertySuppCount,
      bomSentCount,
      fromProjectPage,
      fromPropertyPage,
      totalUnits,
      totalValue,
      orderedCount,
      arrivedCount,
      shippedCount,
    };
  }, [allIntakeItems]);

  // Project-level order counts for the Property/Project filter
  const projectOrderCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const item of allIntakeItems) {
      counts[item.projectId] = (counts[item.projectId] || 0) + 1;
    }
    return counts;
  }, [allIntakeItems]);

  // Matching projects for the property search bar popover
  const matchingProjectsForSearch = useMemo(() => {
    const q = propertySearchQuery.trim().toLowerCase();
    if (!q) {
      // Sort projects by order count descending, then alphabetical
      return [...projects].sort((a, b) => {
        const countA = projectOrderCounts[a.id] || 0;
        const countB = projectOrderCounts[b.id] || 0;
        if (countA !== countB) return countB - countA;
        return a.propertyName.localeCompare(b.propertyName);
      });
    }
    return projects.filter((p) => {
      return (
        p.propertyName.toLowerCase().includes(q) ||
        (p.quoteNumber && p.quoteNumber.toLowerCase().includes(q)) ||
        (p.clientName && p.clientName.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
      );
    });
  }, [projects, propertySearchQuery, projectOrderCounts]);

  // Filtered Intake Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const propQ = propertySearchQuery.trim().toLowerCase();
    return allIntakeItems.filter((item) => {
      if (workspaceFilter !== 'ALL' && item.sourceWorkspace !== workspaceFilter) return false;
      if (sectionTypeFilter !== 'ALL' && item.sourceSection !== sectionTypeFilter) return false;
      if (statusFilter !== 'ALL' && item.fulfillmentStatus !== statusFilter) return false;

      // Property / Project filter logic
      if (propertyFilter !== 'ALL') {
        if (item.projectId !== propertyFilter) return false;
      } else if (propQ) {
        const matchesProp =
          item.propertyName.toLowerCase().includes(propQ) ||
          item.projectId.toLowerCase().includes(propQ) ||
          (item.quoteNumber && item.quoteNumber.toLowerCase().includes(propQ)) ||
          (item.clientName && item.clientName.toLowerCase().includes(propQ));
        if (!matchesProp) return false;
      }

      if (!q) return true;
      const finishText = getLockFinishSummaryTag(item.lockFinishConfig) || '';
      return (
        item.productName.toLowerCase().includes(q) ||
        item.modelOrSku.toLowerCase().includes(q) ||
        item.propertyName.toLowerCase().includes(q) ||
        item.referenceNumber.toLowerCase().includes(q) ||
        item.sourceSection.toLowerCase().includes(q) ||
        item.itemType.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.locationOrScope.toLowerCase().includes(q) ||
        (item.trackingNumber && item.trackingNumber.toLowerCase().includes(q)) ||
        finishText.toLowerCase().includes(q)
      );
    });
  }, [allIntakeItems, workspaceFilter, sectionTypeFilter, propertyFilter, propertySearchQuery, statusFilter, searchQuery]);

  // Selected project object for the project filter banner
  const selectedProjectObj = useMemo(() => {
    if (propertyFilter === 'ALL') return null;
    return projects.find((p) => p.id === propertyFilter) || null;
  }, [projects, propertyFilter]);

  // Master handler that updates fulfillment milestones, talks back to the originating section,
  // ties tracking numbers to the shipping dock, and generates a notification to PMs.
  const handleUpdateMilestone = (
    item: UnifiedAcquisitionIntakeItem,
    updates: Partial<AcquisitionOrderMilestones> & {
      tiedShippingDockId?: string;
    }
  ) => {
    const targetProject = projects.find((p) => p.id === item.projectId);
    if (!targetProject) return;

    const chosenDockId =
      updates.tiedShippingDockId ||
      selectedDockItemForUid[item.uid] ||
      item.tiedShippingDockId;
    const chosenDock = (targetProject.shippingDockItems || []).find((d) => d.id === chosenDockId);

    const currentMilestones = targetProject.acquisitionMilestones?.[item.uid] || {
      isOrdered: item.isOrdered,
      orderedAt: item.orderedAt,
      isArrivedToWarehouse: item.isArrivedToWarehouse,
      arrivedAt: item.arrivedAt,
      isShipped: item.isShipped,
      shippedAt: item.shippedAt,
      isDelivered: item.isDelivered,
      deliveredAt: item.deliveredAt,
      trackingNumber: item.trackingNumber,
      neededByDate: item.neededByDate,
      tiedShippingDockId: item.tiedShippingDockId,
      tiedShippingDockBatch: item.tiedShippingDockBatch,
    };

    const nextMilestone: AcquisitionOrderMilestones = {
      ...currentMilestones,
      ...updates,
      tiedShippingDockId: chosenDock?.id || updates.tiedShippingDockId || currentMilestones.tiedShippingDockId,
      tiedShippingDockBatch: chosenDock?.shipmentBatchLabel || currentMilestones.tiedShippingDockBatch,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUserName,
    };

    const nextMilestonesMap = {
      ...(targetProject.acquisitionMilestones || {}),
      [item.uid]: nextMilestone,
      ...(item.parentRecordId && item.uid.startsWith('co::')
        ? { [`co::${targetProject.id}::${item.parentRecordId}`]: nextMilestone }
        : {}),
      ...(item.parentRecordId && item.uid.startsWith('rma::')
        ? { [`rma::${targetProject.id}::${item.parentRecordId}`]: nextMilestone }
        : {}),
      ...(item.parentRecordId && item.uid.startsWith('bom::')
        ? { [`bom::${targetProject.id}::${item.parentRecordId}`]: nextMilestone }
        : {}),
    };

    // Derive fulfillment status based on milestones
    let derivedStatus: ProductAcquisitionFulfillmentStatus = 'Pending Acquisition / Review';
    if (nextMilestone.isDelivered) {
      derivedStatus = 'Delivered / Fulfilled';
    } else if (nextMilestone.isShipped) {
      derivedStatus = 'In Transit / Shipped';
    } else if (nextMilestone.isArrivedToWarehouse) {
      derivedStatus = 'PO Submitted / Ordered';
    } else if (nextMilestone.isOrdered) {
      derivedStatus = 'PO Submitted / Ordered';
    }

    const nextOverrides = {
      ...(targetProject.acquisitionStatusOverrides || {}),
      [item.uid]: derivedStatus,
    };

    // 1. Talk back to RMA Tickets if originating section is Hardware RMA
    let nextRmaTickets = targetProject.rmaTickets;
    if (item.sourceSection === 'Hardware RMA Ticketing Workflow') {
      nextRmaTickets = (targetProject.rmaTickets || []).map((t) => {
        if (t.id !== item.parentRecordId) return t;
        let newRmaStatus = t.status;
        if (nextMilestone.isDelivered) {
          newRmaStatus = '5. Replacement Received / Closed';
        } else if (nextMilestone.isShipped) {
          newRmaStatus = '4. Packaged & Shipped';
        } else if (nextMilestone.isArrivedToWarehouse) {
          newRmaStatus = '4. Packaged & Shipped';
        } else if (nextMilestone.isOrdered && t.status === '1. Tech Support Troubleshooting') {
          newRmaStatus = '3. RMA Number Issued';
        }
        const trackingVal = nextMilestone.trackingNumber || t.trackingNumber || t.returnTrackingNumber;
        return {
          ...t,
          status: newRmaStatus,
          isOrdered: nextMilestone.isOrdered,
          orderedAt: nextMilestone.orderedAt,
          isArrivedToWarehouse: nextMilestone.isArrivedToWarehouse,
          arrivedAt: nextMilestone.arrivedAt,
          isShipped: nextMilestone.isShipped,
          shippedAt: nextMilestone.shippedAt,
          isDelivered: nextMilestone.isDelivered,
          deliveredAt: nextMilestone.deliveredAt,
          trackingNumber: trackingVal,
          returnTrackingNumber: trackingVal,
          tiedShippingDockId: chosenDock?.id || t.tiedShippingDockId,
          tiedShippingDockBatch: chosenDock?.shipmentBatchLabel || t.tiedShippingDockBatch,
          neededByDate: nextMilestone.neededByDate || t.neededByDate,
          updatedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      });
    }

    // 2. Talk back to Change Orders if originating section is Change Order / Supplemental Order
    let nextChangeOrders = targetProject.changeOrders;
    if (
      item.sourceSection === 'Product Acquisition and Change Order' ||
      item.sourceSection === 'Supplemental Order Catalog'
    ) {
      nextChangeOrders = (targetProject.changeOrders || []).map((co) => {
        if (co.id !== item.parentRecordId) return co;
        let newCoStatus = co.status;
        if (nextMilestone.isShipped) {
          newCoStatus = 'In Fulfillment / Installed';
        } else if (nextMilestone.isOrdered && co.status === 'Draft') {
          newCoStatus = 'Approved';
        }
        const trackingVal = nextMilestone.trackingNumber || co.trackingNumber;
        const updatedItems = (co.items || []).map((ci) => {
          if (ci.id === item.lineItemId) {
            return {
              ...ci,
              trackingNumber: trackingVal || ci.trackingNumber,
              tiedShippingDockId: chosenDock?.id || ci.tiedShippingDockId,
              tiedShippingDockBatch: chosenDock?.shipmentBatchLabel || ci.tiedShippingDockBatch,
            };
          }
          return ci;
        });
        return {
          ...co,
          status: newCoStatus,
          isOrdered: nextMilestone.isOrdered,
          orderedAt: nextMilestone.orderedAt,
          isArrivedToWarehouse: nextMilestone.isArrivedToWarehouse,
          arrivedAt: nextMilestone.arrivedAt,
          isShipped: nextMilestone.isShipped,
          shippedAt: nextMilestone.shippedAt,
          isDelivered: nextMilestone.isDelivered,
          deliveredAt: nextMilestone.deliveredAt,
          trackingNumber: trackingVal,
          tiedShippingDockId: chosenDock?.id || co.tiedShippingDockId,
          tiedShippingDockBatch: chosenDock?.shipmentBatchLabel || co.tiedShippingDockBatch,
          neededByDate: nextMilestone.neededByDate || co.neededByDate,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      });
    }

    // 3. Talk back to BOM Submissions if originating section is Smart Community BOM
    let nextBomSubmissions = targetProject.bomAcquisitionSubmissions;
    if (item.sourceSection === 'Smart Community Bill of Materials (BOM)') {
      nextBomSubmissions = (targetProject.bomAcquisitionSubmissions || []).map((s) => {
        if (s.id !== item.parentRecordId) return s;
        const trackingVal = nextMilestone.trackingNumber || s.trackingNumber || s.poOrTrackingNumber;
        return {
          ...s,
          fulfillmentStatus: derivedStatus,
          status: derivedStatus,
          isOrdered: nextMilestone.isOrdered,
          orderedAt: nextMilestone.orderedAt,
          isArrivedToWarehouse: nextMilestone.isArrivedToWarehouse,
          arrivedAt: nextMilestone.arrivedAt,
          isShipped: nextMilestone.isShipped,
          shippedAt: nextMilestone.shippedAt,
          isDelivered: nextMilestone.isDelivered,
          deliveredAt: nextMilestone.deliveredAt,
          trackingNumber: trackingVal,
          poOrTrackingNumber: trackingVal,
          tiedShippingDockId: chosenDock?.id || s.tiedShippingDockId,
          tiedShippingDockBatch: chosenDock?.shipmentBatchLabel || s.tiedShippingDockBatch,
          neededByDate: nextMilestone.neededByDate || s.neededByDate,
          updatedAt: new Date().toISOString(),
        };
      });
    }

    // 4. Document tracking number directly on originating BOM line item notes & logs
    let nextBomItems = targetProject.bomItems;
    if (nextMilestone.trackingNumber) {
      const trackingVal = nextMilestone.trackingNumber;
      nextBomItems = (targetProject.bomItems || []).map((bi) => {
        const isTarget =
          bi.id === item.lineItemId ||
          bi.id === item.parentRecordId ||
          (targetProject.bomAcquisitionSubmissions || []).some(
            (s) => s.id === item.parentRecordId && s.bomItemId === bi.id
          );
        if (!isTarget) return bi;

        const newLog: InstallLogEntry = {
          id: `log-track-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          projectId: targetProject.id,
          itemId: bi.id,
          itemName: bi.name,
          timestamp: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          installerName: currentUserName || 'Product Acquisition Portal',
          statusCheck: 'Hardware Swapped',
          quantityCompleted: 0,
          locationCompleted: bi.location || 'Warehouse / In Transit',
          notes: `Tracking # documented: ${trackingVal}`,
          itemNotes: `Dispatched / Shipped via Product Acquisition Portal (Tracking #: ${trackingVal})`,
        };

        const existingLogs = bi.postItLogs || [];
        const alreadyHasTrack = existingLogs.some(
          (l) => l.notes?.includes(trackingVal) || l.itemNotes?.includes(trackingVal)
        );

        return {
          ...bi,
          trackingNumber: trackingVal,
          postItLogs: alreadyHasTrack ? existingLogs : [newLog, ...existingLogs],
        };
      });
    }

    // 5. Document tracking number in Project Notes (accessible to CSMs & PMs)
    let nextProjectNotes = targetProject.notes || [];
    if (updates.trackingNumber && updates.trackingNumber.trim()) {
      const trackVal = updates.trackingNumber.trim();
      const alreadyHasNote = nextProjectNotes.some((n) => n.text?.includes(trackVal));
      if (!alreadyHasNote) {
        const newNote = {
          id: `note-track-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          projectId: targetProject.id,
          author: currentUserName || 'Product Acquisition Portal',
          timestamp: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          category: 'Hardware Delivery' as const,
          text: `Carrier Tracking # populated: ${trackVal} for ${item.productName} (${item.referenceNumber || item.sourceSection}). Dispatched to ${targetProject.propertyName}.`,
        };
        nextProjectNotes = [newNote, ...nextProjectNotes];
      }
    }

    // 6. Tie tracking number into the Shipping Dock line item if specified
    let nextShippingDockItems = targetProject.shippingDockItems || [];
    const trackingToTie = (
      updates.trackingNumber !== undefined
        ? updates.trackingNumber
        : (nextMilestone.trackingNumber || '')
    ).trim();

    if (chosenDockId && trackingToTie) {
      nextShippingDockItems = nextShippingDockItems.map((dock) => {
        if (dock.id === chosenDockId) {
          const currentTracks = getDockItemTrackingNumbers(dock);
          const nextTracks = currentTracks.includes(trackingToTie)
            ? currentTracks
            : [...currentTracks, trackingToTie];
          return {
            ...dock,
            trackingNumbers: nextTracks,
            trackingNumber: nextTracks.join(', '),
            tiedOriginIds: Array.from(
              new Set([
                ...(dock.tiedOriginIds || []),
                item.uid,
                item.lineItemId || item.parentRecordId,
              ])
            ),
          };
        }
        return dock;
      });
    }

    // 7. Generate high-priority notification to PMs in their Notifications tab
    let changeSummary = 'Order milestones updated in Product Acquisition Portal';
    let badgeLabel = 'Order Updated';
    if (updates.isDelivered !== undefined) {
      if (updates.isDelivered) {
        changeSummary = 'Order marked as Delivered & Received On-Site.';
        badgeLabel = 'Delivered';
      } else {
        changeSummary = 'Order unmarked as Delivered.';
        badgeLabel = 'Delivery Update';
      }
    } else if (updates.isShipped !== undefined) {
      if (updates.isShipped) {
        changeSummary = updates.trackingNumber
          ? `Order marked as Shipped. Tracking #: ${updates.trackingNumber}`
          : 'Order marked as Shipped (Tracking # input opened for dispatch tracking).';
        badgeLabel = 'Shipped';
      } else {
        changeSummary = 'Order unmarked as Shipped.';
        badgeLabel = 'Fulfillment Update';
      }
    } else if (updates.trackingNumber !== undefined) {
      changeSummary = `Tracking # populated: ${updates.trackingNumber}`;
      badgeLabel = 'Tracking Added';
    } else if (updates.isArrivedToWarehouse !== undefined) {
      changeSummary = updates.isArrivedToWarehouse
        ? 'Order marked as Arrived to Warehouse.'
        : 'Order unmarked as Arrived to Warehouse.';
      badgeLabel = 'Warehouse Arrival';
    } else if (updates.isOrdered !== undefined) {
      changeSummary = updates.isOrdered ? 'Order marked as Ordered.' : 'Order unmarked as Ordered.';
      badgeLabel = 'Ordered';
    } else if (updates.neededByDate !== undefined) {
      changeSummary = `When needed by date set to: ${updates.neededByDate}`;
      badgeLabel = 'Date Updated';
    }

    const notif: ProjectActivityNotification = {
      id: `notif-acq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: targetProject.id,
      propertyName: targetProject.propertyName,
      assignedPMName: targetProject.assignedPM?.name || 'Project Manager',
      assignedFieldTech: targetProject.assignedFieldTech || 'Hector Garcia',
      timestamp: 'Just now',
      createdAtIso: new Date().toISOString(),
      audience: 'pm',
      category: 'acquisition_update',
      section: 'bom',
      sectionTargetId:
        item.sourceSection === 'Hardware RMA Ticketing Workflow'
          ? 'rma-ticketing-workflow'
          : item.sourceSection === 'Smart Community Bill of Materials (BOM)'
          ? 'pm-bom-table'
          : 'supplemental-order-catalog-section',
      title: `Product Acquisition Update: ${item.productName}`,
      details: `${item.productName} (${item.referenceNumber}) on ${targetProject.propertyName}: ${changeSummary}`,
      actorName: currentUserName,
      actorRole: 'system',
      badgeLabel,
    };

    // Requirement: if "3. Shipped" is selected and project is marked as Completed on its milestone, do not send a notification to the PM
    const isShippedSelected =
      updates.isShipped === true ||
      (updates.trackingNumber !== undefined && nextMilestone.isShipped);
    const isCompletedOnMilestone = isProjectMilestoneCompleted(targetProject);
    const shouldSuppressPmNotification = isShippedSelected && isCompletedOnMilestone;

    const nextActivityNotifications = shouldSuppressPmNotification
      ? targetProject.activityNotifications || []
      : [notif, ...(targetProject.activityNotifications || [])];

    onUpdateProject({
      ...targetProject,
      acquisitionMilestones: nextMilestonesMap,
      acquisitionStatusOverrides: nextOverrides,
      rmaTickets: nextRmaTickets,
      changeOrders: nextChangeOrders,
      bomAcquisitionSubmissions: nextBomSubmissions,
      bomItems: nextBomItems,
      shippingDockItems: nextShippingDockItems,
      notes: nextProjectNotes,
      activityNotifications: nextActivityNotifications,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Toggle milestone handlers
  const handleToggleMilestone = (
    item: UnifiedAcquisitionIntakeItem,
    milestoneType: 'Ordered' | 'Arrived' | 'Shipped' | 'Delivered'
  ) => {
    if (!canEdit) return;
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (milestoneType === 'Ordered') {
      const nextVal = !item.isOrdered;
      handleUpdateMilestone(item, {
        isOrdered: nextVal,
        orderedAt: nextVal ? today : undefined,
        ...(!nextVal
          ? {
              isArrivedToWarehouse: false,
              arrivedAt: undefined,
              isShipped: false,
              shippedAt: undefined,
              isDelivered: false,
              deliveredAt: undefined,
            }
          : {}),
      });
    } else if (milestoneType === 'Arrived') {
      const nextVal = !item.isArrivedToWarehouse;
      handleUpdateMilestone(item, {
        isArrivedToWarehouse: nextVal,
        arrivedAt: nextVal ? today : undefined,
        ...(nextVal
          ? {
              isOrdered: true,
              orderedAt: item.orderedAt || today,
            }
          : {
              isShipped: false,
              shippedAt: undefined,
              isDelivered: false,
              deliveredAt: undefined,
            }),
      });
    } else if (milestoneType === 'Shipped') {
      const nextVal = !item.isShipped;
      // When marked as Shipped, open up Tracking # to populate
      if (nextVal && !trackingDrafts[item.uid] && item.trackingNumber) {
        setTrackingDrafts((prev) => ({ ...prev, [item.uid]: item.trackingNumber || '' }));
      }
      handleUpdateMilestone(item, {
        isShipped: nextVal,
        shippedAt: nextVal ? today : undefined,
        ...(nextVal
          ? {
              isOrdered: true,
              orderedAt: item.orderedAt || today,
              isArrivedToWarehouse: true,
              arrivedAt: item.arrivedAt || today,
            }
          : {
              isDelivered: false,
              deliveredAt: undefined,
            }),
      });
    } else if (milestoneType === 'Delivered') {
      const nextVal = !item.isDelivered;
      handleUpdateMilestone(item, {
        isDelivered: nextVal,
        deliveredAt: nextVal ? today : undefined,
        ...(nextVal
          ? {
              isOrdered: true,
              orderedAt: item.orderedAt || today,
              isArrivedToWarehouse: true,
              arrivedAt: item.arrivedAt || today,
              isShipped: true,
              shippedAt: item.shippedAt || today,
            }
          : {}),
      });
    }
  };

  const handleMoveItemToColumn = (
    item: UnifiedAcquisitionIntakeItem,
    targetCol: AcquisitionKanbanColumnId
  ) => {
    if (!canEdit) return;
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (targetCol === 'Incoming') {
      handleUpdateMilestone(item, {
        isOrdered: false,
        orderedAt: undefined,
        isArrivedToWarehouse: false,
        arrivedAt: undefined,
        isShipped: false,
        shippedAt: undefined,
        isDelivered: false,
        deliveredAt: undefined,
      });
    } else if (targetCol === 'Ordered') {
      handleUpdateMilestone(item, {
        isOrdered: true,
        orderedAt: item.orderedAt || today,
        isArrivedToWarehouse: false,
        arrivedAt: undefined,
        isShipped: false,
        shippedAt: undefined,
        isDelivered: false,
        deliveredAt: undefined,
      });
    } else if (targetCol === 'Arrived at Warehouse') {
      handleUpdateMilestone(item, {
        isOrdered: true,
        orderedAt: item.orderedAt || today,
        isArrivedToWarehouse: true,
        arrivedAt: item.arrivedAt || today,
        isShipped: false,
        shippedAt: undefined,
        isDelivered: false,
        deliveredAt: undefined,
      });
    } else if (targetCol === 'Shipped') {
      handleUpdateMilestone(item, {
        isOrdered: true,
        orderedAt: item.orderedAt || today,
        isArrivedToWarehouse: true,
        arrivedAt: item.arrivedAt || today,
        isShipped: true,
        shippedAt: item.shippedAt || today,
        isDelivered: false,
        deliveredAt: undefined,
      });
    } else if (targetCol === 'Delivered') {
      handleUpdateMilestone(item, {
        isOrdered: true,
        orderedAt: item.orderedAt || today,
        isArrivedToWarehouse: true,
        arrivedAt: item.arrivedAt || today,
        isShipped: true,
        shippedAt: item.shippedAt || today,
        isDelivered: true,
        deliveredAt: item.deliveredAt || today,
      });
    }
  };

  const handleSaveTracking = (item: UnifiedAcquisitionIntakeItem) => {
    if (!canEdit) return;
    const rawVal = trackingDrafts[item.uid] ?? item.trackingNumber ?? '';
    const cleanTracking = rawVal.trim();
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const chosenDockId = selectedDockItemForUid[item.uid] || item.tiedShippingDockId;

    handleUpdateMilestone(item, {
      isShipped: true,
      shippedAt: item.shippedAt || today,
      trackingNumber: cleanTracking,
      tiedShippingDockId: chosenDockId,
    });
  };

  const handleUpdateFulfillmentStatus = (
    item: UnifiedAcquisitionIntakeItem,
    nextStatus: ProductAcquisitionFulfillmentStatus
  ) => {
    if (!canEdit) return;
    const targetProject = projects.find((p) => p.id === item.projectId);
    if (!targetProject) return;

    const nextOverrides = {
      ...(targetProject.acquisitionStatusOverrides || {}),
      [item.uid]: nextStatus,
    };

    const nextBomSubmissions =
      item.sourceSection === 'Smart Community Bill of Materials (BOM)'
        ? (targetProject.bomAcquisitionSubmissions || []).map((s) =>
            s.id === item.parentRecordId ? { ...s, fulfillmentStatus: nextStatus } : s
          )
        : targetProject.bomAcquisitionSubmissions;

    onUpdateProject({
      ...targetProject,
      acquisitionStatusOverrides: nextOverrides,
      bomAcquisitionSubmissions: nextBomSubmissions,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteBomSubmission = (item: UnifiedAcquisitionIntakeItem) => {
    if (item.sourceSection !== 'Smart Community Bill of Materials (BOM)') return;
    const targetProject = projects.find((p) => p.id === item.projectId);
    if (!targetProject) return;
    onUpdateProject({
      ...targetProject,
      bomAcquisitionSubmissions: (targetProject.bomAcquisitionSubmissions || []).filter(
        (s) => s.id !== item.parentRecordId
      ),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveFinishOnIntakeItem = (config?: LockFinishConfig) => {
    if (!editingFinishIntakeItem) return;
    const targetProject = projects.find((p) => p.id === editingFinishIntakeItem.projectId);
    if (!targetProject) return;

    if (editingFinishIntakeItem.sourceSection === 'Hardware RMA Ticketing Workflow') {
      const updatedTickets = (targetProject.rmaTickets || []).map((t) =>
        t.id === editingFinishIntakeItem.parentRecordId ? { ...t, lockFinishConfig: config } : t
      );
      onUpdateProject({
        ...targetProject,
        rmaTickets: updatedTickets,
        lastUpdated: new Date().toISOString(),
      });
    } else if (
      editingFinishIntakeItem.sourceSection === 'Product Acquisition and Change Order' ||
      editingFinishIntakeItem.sourceSection === 'Supplemental Order Catalog'
    ) {
      const updatedCOs = (targetProject.changeOrders || []).map((co) => {
        if (co.id !== editingFinishIntakeItem.parentRecordId) return co;
        return {
          ...co,
          items: (co.items || []).map((li) =>
            li.id === editingFinishIntakeItem.lineItemId ? { ...li, lockFinishConfig: config } : li
          ),
        };
      });
      onUpdateProject({
        ...targetProject,
        changeOrders: updatedCOs,
        lastUpdated: new Date().toISOString(),
      });
    } else if (
      editingFinishIntakeItem.sourceSection === 'Smart Community Bill of Materials (BOM)'
    ) {
      const updatedSubs = (targetProject.bomAcquisitionSubmissions || []).map((s) =>
        s.id === editingFinishIntakeItem.parentRecordId ? { ...s, lockFinishConfig: config } : s
      );
      const updatedBom = (targetProject.bomItems || []).map((b) =>
        b.id === editingFinishIntakeItem.bomItemId ? { ...b, lockFinishConfig: config } : b
      );
      onUpdateProject({
        ...targetProject,
        bomItems: updatedBom,
        bomAcquisitionSubmissions: updatedSubs,
        lastUpdated: new Date().toISOString(),
      });
    }

    setEditingFinishIntakeItem(null);
  };

  const handleCopyItemSpecification = (item: UnifiedAcquisitionIntakeItem) => {
    const finishLines = formatFullFinishDetailsLines(item.lockFinishConfig, {
      name: item.productName,
      model: item.modelOrSku,
      category: item.category,
      thermostatBrand: item.thermostatBrand as any,
    });
    const text = [
      `=== QUEXT PRODUCT ACQUISITION PORTAL RECORD: ${item.referenceNumber} ===`,
      `Origin Workspace: ${item.sourceWorkspaceBadgeLabel}`,
      `Source Section: ${item.sourceSection}`,
      `Acquisition Type: ${item.itemType}`,
      `Property / Project: ${item.propertyName} (Quote #${item.quoteNumber})`,
      `Client / Owner: ${item.clientName} | Property Mgmt: ${item.propertyManagementCompany}`,
      `Assigned PM: ${item.assignedPMName} | Assigned CSM: ${item.assignedCSMName}`,
      `Integrator Partner(s): ${item.integratorPartners.join(', ') || 'None'} | Field Tech: ${item.assignedFieldTech}`,
      `--- FULFILLMENT STATUS & MILESTONES ---`,
      `Needed By Date: ${item.neededByDate || 'Not Specified'}`,
      `Ordered: ${item.isOrdered ? `Yes (${item.orderedAt || 'Completed'})` : 'No'}`,
      `Arrived to Warehouse: ${item.isArrivedToWarehouse ? `Yes (${item.arrivedAt || 'Completed'})` : 'No'}`,
      `Shipped: ${item.isShipped ? `Yes (${item.shippedAt || 'Completed'})` : 'No'}`,
      `Tracking #: ${item.trackingNumber || 'Pending'}`,
      `Fulfillment Stage: ${item.fulfillmentStatus}`,
      `--- PRODUCT DETAILS ---`,
      `Product Name: ${item.productName}`,
      `Model / SKU: ${item.modelOrSku}`,
      `Category: ${item.category} (${item.productType})`,
      `Confirmed Quantity: ${item.quantity}`,
      `Unit Price: $${item.unitPrice.toFixed(2)} | Total Value: $${item.totalCost.toFixed(2)}`,
      `Location / Scope: ${item.locationOrScope}`,
      `Description: ${item.description}`,
      ...(finishLines.length > 0
        ? [`--- FINISH & HARDWARE OPTIONS ---`, ...finishLines.map((l) => `  • ${l}`)]
        : [`Finish Options: Standard Factory Finish`]),
      `Notes / Reason: ${item.reasonOrNotes}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedUid(item.uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleExportAcquisitionCsv = () => {
    const headers = [
      'Reference #',
      'Origin Workspace',
      'Source Section',
      'Acquisition Type',
      'Property / Project',
      'Quote #',
      'Client / Owner',
      'Property Management Co',
      'Product Name',
      'Model / SKU',
      'Category',
      'Confirmed Quantity',
      'Unit Price',
      'Total Cost',
      'Needed By Date',
      'Ordered',
      'Arrived Warehouse',
      'Shipped',
      'Tracking #',
      'Finish & Hardware Options',
      'Location / Scope',
      'Fulfillment Status',
      'Created By',
      'Created At',
      'Notes / Reason',
    ];

    const rows = filteredItems.map((item) => {
      const finishLines = formatFullFinishDetailsLines(item.lockFinishConfig, {
        name: item.productName,
        model: item.modelOrSku,
        category: item.category,
        thermostatBrand: item.thermostatBrand as any,
      });
      return [
        item.referenceNumber,
        item.sourceWorkspaceBadgeLabel,
        item.sourceSection,
        item.itemType,
        item.propertyName,
        item.quoteNumber,
        item.clientName,
        item.propertyManagementCompany,
        item.productName,
        item.modelOrSku,
        item.category,
        String(item.quantity),
        item.unitPrice.toFixed(2),
        item.totalCost.toFixed(2),
        item.neededByDate || '',
        item.isOrdered ? `Yes (${item.orderedAt || ''})` : 'No',
        item.isArrivedToWarehouse ? `Yes (${item.arrivedAt || ''})` : 'No',
        item.isShipped ? `Yes (${item.shippedAt || ''})` : 'No',
        item.trackingNumber || '',
        finishLines.join(' | ') || getLockFinishSummaryTag(item.lockFinishConfig) || 'Standard',
        item.locationOrScope,
        item.fulfillmentStatus,
        item.createdBy,
        item.createdAt,
        item.reasonOrNotes,
      ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quext_Product_Acquisition_Portal_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSectionBadgeStyle = (section: ProductAcquisitionSourceSection) => {
    switch (section) {
      case 'Hardware RMA Ticketing Workflow':
        return {
          badge: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-700" />,
        };
      case 'Product Acquisition and Change Order':
        return {
          badge: 'bg-indigo-100 text-indigo-950 border-indigo-300',
          icon: <FilePlus2 className="w-3.5 h-3.5 text-indigo-700" />,
        };
      case 'Supplemental Order Catalog':
        return {
          badge: 'bg-purple-100 text-purple-950 border-purple-300',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-700" />,
        };
      case 'Smart Community Bill of Materials (BOM)':
        return {
          badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <Layers className="w-3.5 h-3.5 text-emerald-700" />,
        };
    }
  };

  const getSectionShortBadge = (section: ProductAcquisitionSourceSection) => {
    switch (section) {
      case 'Hardware RMA Ticketing Workflow':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Product Acquisition and Change Order':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Supplemental Order Catalog':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Smart Community Bill of Materials (BOM)':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getSectionShortName = (section: ProductAcquisitionSourceSection) => {
    switch (section) {
      case 'Hardware RMA Ticketing Workflow':
        return 'RMA Claim';
      case 'Product Acquisition and Change Order':
        return 'Change Order';
      case 'Supplemental Order Catalog':
        return 'Supplemental';
      case 'Smart Community Bill of Materials (BOM)':
        return 'BOM Intake';
    }
  };

  const KANBAN_COLUMNS: {
    id: AcquisitionKanbanColumnId;
    title: string;
    subtitle: string;
    badgeColor: string;
    headerBg: string;
    borderAccent: string;
    iconBg: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'Incoming',
      title: 'Incoming',
      subtitle: 'Awaiting Action / Unordered',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      headerBg: 'bg-slate-50/90 border-slate-200',
      borderAccent: 'border-t-slate-400',
      iconBg: 'bg-slate-100 text-slate-700',
      icon: <Inbox className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'Ordered',
      title: 'Ordered',
      subtitle: 'PO Placed / Vendor Order',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      headerBg: 'bg-indigo-50/70 border-indigo-200',
      borderAccent: 'border-t-indigo-500',
      iconBg: 'bg-indigo-100 text-indigo-700',
      icon: <ShoppingCart className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: 'Arrived at Warehouse',
      title: 'Arrived at Warehouse',
      subtitle: 'Received at Quext Dock',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
      headerBg: 'bg-teal-50/70 border-teal-200',
      borderAccent: 'border-t-teal-500',
      iconBg: 'bg-teal-100 text-teal-700',
      icon: <Warehouse className="w-4 h-4 text-teal-600" />,
    },
    {
      id: 'Shipped',
      title: 'Shipped',
      subtitle: 'In Transit to Job Site',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
      headerBg: 'bg-sky-50/70 border-sky-200',
      borderAccent: 'border-t-sky-500',
      iconBg: 'bg-sky-100 text-sky-700',
      icon: <Truck className="w-4 h-4 text-sky-600" />,
    },
    {
      id: 'Delivered',
      title: 'Delivered',
      subtitle: 'Received On-Site & Fulfilled',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      headerBg: 'bg-emerald-50/70 border-emerald-200',
      borderAccent: 'border-t-emerald-500',
      iconBg: 'bg-emerald-100 text-emerald-700',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
  ];

  const getFulfillmentBadgeStyle = (status: ProductAcquisitionFulfillmentStatus) => {
    switch (status) {
      case 'Delivered / Fulfilled':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'In Transit / Shipped':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'PO Submitted / Ordered':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-amber-50 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 rounded-2xl border border-emerald-500/30 p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Centralized Hardware &amp; Software Intake Hub</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-200 border border-white/15">
                Project &amp; Property Pages Connected
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center gap-1">
                <Truck className="w-3 h-3 text-sky-400" />
                <span>Live Fulfillment Milestones &amp; Tracking</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Product Acquisition Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Centrally intake and manage orders originating from the{' '}
              <strong className="text-amber-300">Hardware RMA Ticketing Workflow</strong>,{' '}
              <strong className="text-purple-300">Supplemental Order Catalog</strong>,{' '}
              <strong className="text-indigo-300">Product Acquisition and Change Order</strong>, and{' '}
              <strong className="text-emerald-300">Smart Community Bill of Materials (BOM)</strong>.
              Mark each order as <strong className="text-indigo-300">Ordered</strong>,{' '}
              <strong className="text-teal-300">Arrived to Warehouse</strong>, and{' '}
              <strong className="text-sky-300">Shipped</strong> with live tracking numbers that sync back to the originating sections and alert PMs instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportAcquisitionCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Queue (CSV)</span>
            </button>
          </div>
        </div>

        {/* KPI Cards by Source Section & Stage */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setSectionTypeFilter('ALL');
              setWorkspaceFilter('ALL');
            }}
            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
              sectionTypeFilter === 'ALL' && workspaceFilter === 'ALL'
                ? 'bg-white/15 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Total Intake Queue
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">{kpis.totalItems}</div>
            <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
              {kpis.totalUnits.toLocaleString()} total units
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSectionTypeFilter(
                sectionTypeFilter === 'Hardware RMA Ticketing Workflow'
                  ? 'ALL'
                  : 'Hardware RMA Ticketing Workflow'
              )
            }
            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
              sectionTypeFilter === 'Hardware RMA Ticketing Workflow'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span>From RMA Section</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">{kpis.rmaCount}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">RMA Replacement Claims</div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSectionTypeFilter(
                sectionTypeFilter === 'Product Acquisition and Change Order'
                  ? 'ALL'
                  : 'Product Acquisition and Change Order'
              )
            }
            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
              sectionTypeFilter === 'Product Acquisition and Change Order'
                ? 'bg-indigo-500/25 border-indigo-400 ring-2 ring-indigo-400/30'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <FilePlus2 className="w-3 h-3" />
              <span>Project Acq. &amp; CO</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {kpis.projectCoCount}
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">From Project Page</div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSectionTypeFilter(
                sectionTypeFilter === 'Supplemental Order Catalog'
                  ? 'ALL'
                  : 'Supplemental Order Catalog'
              )
            }
            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
              sectionTypeFilter === 'Supplemental Order Catalog'
                ? 'bg-purple-500/25 border-purple-400 ring-2 ring-purple-400/30'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Supplemental Catalog</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {kpis.propertySuppCount}
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">From Property Page</div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSectionTypeFilter(
                sectionTypeFilter === 'Smart Community Bill of Materials (BOM)'
                  ? 'ALL'
                  : 'Smart Community Bill of Materials (BOM)'
              )
            }
            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
              sectionTypeFilter === 'Smart Community Bill of Materials (BOM)'
                ? 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>From Smart BOM</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">{kpis.bomSentCount}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Confirmed BOM Transfers</div>
          </button>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Milestone Breakdown
            </div>
            <div className="text-sm font-black font-mono text-white mt-1 flex flex-col gap-0.5">
              <span className="text-indigo-300">Ordered: {kpis.orderedCount}</span>
              <span className="text-teal-300">Warehouse: {kpis.arrivedCount}</span>
              <span className="text-sky-300">Shipped: {kpis.shippedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Banner for Non-Acquisition Users */}
      {!canEdit && (
        <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>View-Only Mode:</strong> Signed in as <strong>{currentUserName}</strong>. Customer Success Managers and viewers have view-only access here. Full edit permissions are granted to Product Acquisition Users (Clint Branch, John McBride) and PMs.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold shrink-0">
            Read-Only
          </span>
        </div>
      )}

      {/* Prominent Property / Project Filter Banner (When a specific project is selected) */}
      {selectedProjectObj && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl border-2 border-emerald-500/50 p-5 shadow-lg animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>Filtered to Single Project</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                  Quote #{selectedProjectObj.quoteNumber}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{selectedProjectObj.propertyName}</span>
                <span className="text-sm font-normal text-slate-300">
                  — {selectedProjectObj.clientName}
                </span>
              </h2>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  <strong>Property Mgmt Co:</strong>{' '}
                  {getPropertyManagementCompany(selectedProjectObj) || 'None Specified'}
                </span>
                <span>•</span>
                <span>
                  <strong>PM:</strong> {selectedProjectObj.assignedPM?.name || 'Unassigned'}
                </span>
                <span>•</span>
                <span>
                  <strong>CSM:</strong> {selectedProjectObj.assignedCSM || 'Unassigned'}
                </span>
                <span>•</span>
                <span>
                  <strong>Field Tech:</strong>{' '}
                  {normalizeFieldTech(selectedProjectObj.assignedFieldTech)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="text-right px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Project Orders</div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  {filteredItems.length} orders
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPropertyFilter('ALL');
                  setPropertySearchQuery('');
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <X className="w-4 h-4 text-slate-700" />
                <span>Clear Project Filter (View All)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Filter & Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Origin Workspace Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Origin:</span>
            </span>
            {(['ALL', 'Project', 'Property'] as const).map((ws) => (
              <button
                key={ws}
                type="button"
                onClick={() => setWorkspaceFilter(ws)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workspaceFilter === ws
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ws === 'ALL'
                  ? `All Workspaces (${allIntakeItems.length})`
                  : ws === 'Project'
                  ? `Project Page (${kpis.fromProjectPage})`
                  : `Property Page (${kpis.fromPropertyPage})`}
              </button>
            ))}
          </div>

          {/* Search & Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, product, finish, tracking #..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 w-56 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Property / Project Search Bar (Replacing previous static dropdown) */}
            <div className="relative" ref={propertySearchContainerRef}>
              <div className="relative flex items-center">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={propertySearchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPropertySearchQuery(val);
                    setIsPropertyDropdownOpen(true);
                    if (!val.trim()) {
                      setPropertyFilter('ALL');
                    }
                  }}
                  onFocus={() => setIsPropertyDropdownOpen(true)}
                  placeholder="Search properties & projects..."
                  className="pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 w-52 sm:w-64 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium placeholder-slate-400"
                />
                {(propertySearchQuery || propertyFilter !== 'ALL') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPropertySearchQuery('');
                      setPropertyFilter('ALL');
                      setIsPropertyDropdownOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
                    title="Clear property search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>

              {/* Autocomplete / Suggested Properties Popover */}
              {isPropertyDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 sm:w-80 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                  <div className="p-2 bg-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Select Property / Project</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPropertyFilter('ALL');
                        setPropertySearchQuery('');
                        setIsPropertyDropdownOpen(false);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                    >
                      Show All ({projects.length})
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPropertyFilter('ALL');
                        setPropertySearchQuery('');
                        setIsPropertyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        propertyFilter === 'ALL' && !propertySearchQuery ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>All Properties &amp; Projects</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {allIntakeItems.length} orders
                      </span>
                    </button>

                    {matchingProjectsForSearch.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-slate-500">
                        No properties found matching &ldquo;{propertySearchQuery}&rdquo;
                      </div>
                    ) : (
                      matchingProjectsForSearch.slice(0, 25).map((p) => {
                        const orderCount = projectOrderCounts[p.id] || 0;
                        const isSelected = propertyFilter === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPropertyFilter(p.id);
                              setPropertySearchQuery(p.propertyName);
                              setIsPropertyDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                              isSelected ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-slate-800'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="truncate font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>{p.propertyName}</span>
                                {p.quoteNumber && (
                                  <span className="text-[10px] font-mono text-slate-500 font-normal">
                                    #{p.quoteNumber}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {p.clientName} {p.city ? `• ${p.city}, ${p.state}` : ''}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                                orderCount > 0
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <select
              value={sectionTypeFilter}
              onChange={(e) => setSectionTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
            >
              <option value="ALL">All Intake Sections (4)</option>
              <option value="Hardware RMA Ticketing Workflow">
                Section: Hardware RMA Ticketing Workflow
              </option>
              <option value="Product Acquisition and Change Order">
                Section: Product Acquisition and Change Order (Project)
              </option>
              <option value="Supplemental Order Catalog">
                Section: Supplemental Order Catalog (Property)
              </option>
              <option value="Smart Community Bill of Materials (BOM)">
                Section: Smart Community Bill of Materials (BOM)
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
            >
              <option value="ALL">All Fulfillment Statuses</option>
              {FULFILLMENT_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* View Mode Switcher: Kanban Board (Default) vs List View */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Switch to Kanban Board View (Default)"
              >
                <Kanban className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kanban Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Switch to Detailed List View"
              >
                <List className="w-3.5 h-3.5 text-slate-500" />
                <span>List View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Items List or Kanban View */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-slate-900">
            No Product Acquisition Intake Items Match Current Filters
          </div>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Items automatically appear here whenever you create an <strong>RMA Ticket</strong>, create an order in{' '}
            <strong>Product Acquisition and Change Order</strong> (Project Page) or{' '}
            <strong>Supplemental Order Catalog</strong> (Property Page), or click{' '}
            <strong>Send to Acquisition</strong> on any line item in the{' '}
            <strong>Smart Community Bill of Materials (BOM)</strong>.
          </p>
          {(propertyFilter !== 'ALL' || propertySearchQuery.trim()) && (
            <button
              type="button"
              onClick={() => {
                setPropertyFilter('ALL');
                setPropertySearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Property Filter</span>
            </button>
          )}
        </div>
      ) : viewMode === 'kanban' ? (
        /* ========================================================================= */
        /* KANBAN BOARD VIEW (DEFAULT)                                               */
        /* Columns: Incoming, Ordered, Arrived at Warehouse, Shipped, Delivered      */
        /* ========================================================================= */
        <div className="space-y-3">
          {/* Quick Kanban Guide Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Kanban className="w-3.5 h-3.5 text-emerald-600" />
                <span>Default Kanban Board:</span>
              </span>
              <span>
                Checking the <strong>Ordered</strong>, <strong>Warehouse</strong>, <strong>Shipped</strong>, or <strong>Delivered</strong> boxes dictates column placement. Cards can also be dragged between columns.
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[10.5px]">
              Showing {filteredItems.length} total orders across 5 stages
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[640px] scrollbar-thin">
            {KANBAN_COLUMNS.map((col, colIdx) => {
              const colItems = filteredItems.filter(
                (item) => getKanbanColumnForItem(item) === col.id
              );
              const totalUnitsInCol = colItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
              const totalCostInCol = colItems.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
              const isDragTarget = dragOverCol === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDragEnter={() => setDragOverCol(col.id)}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setDragOverCol(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverCol(null);
                    const uid = e.dataTransfer.getData('text/plain') || draggedItemUid;
                    if (uid) {
                      const it = allIntakeItems.find((x) => x.uid === uid);
                      if (it) handleMoveItemToColumn(it, col.id);
                    }
                  }}
                  className={`w-[325px] 2xl:w-[350px] shrink-0 rounded-2xl border transition-all duration-200 flex flex-col bg-slate-50/70 shadow-2xs ${
                    isDragTarget
                      ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/40 shadow-md'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Column Header */}
                  <div className={`p-3.5 rounded-t-2xl border-b border-slate-200 bg-white border-t-4 ${col.borderAccent}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${col.iconBg}`}>
                          {col.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-extrabold text-slate-900 truncate">
                            {col.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 truncate">{col.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                          title={`${colItems.length} orders in this column`}
                        >
                          {colItems.length}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{totalUnitsInCol.toLocaleString()} units</span>
                      {totalCostInCol > 0 && <span>${totalCostInCol.toLocaleString()}</span>}
                    </div>
                  </div>

                  {/* Column Card Stack */}
                  <div className="p-3 space-y-3 min-h-[460px] flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {colItems.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2 text-slate-400">
                        <div className="text-xs font-semibold">No orders in {col.title}</div>
                        <p className="text-[10.5px] leading-relaxed">
                          {canEdit
                            ? `Drag items here or check the milestone box on any card to move to ${col.title}.`
                            : `Currently no intake orders in ${col.title}.`}
                        </p>
                      </div>
                    ) : (
                      colItems.map((item) => {
                        const currentTrackingDraft = trackingDrafts[item.uid] ?? item.trackingNumber ?? '';

                        return (
                          <div
                            key={item.uid}
                            draggable={canEdit}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', item.uid);
                              setDraggedItemUid(item.uid);
                            }}
                            onDragEnd={() => setDraggedItemUid(null)}
                            className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden text-left ${
                              draggedItemUid === item.uid ? 'opacity-40 scale-[0.98]' : ''
                            } ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''}`}
                          >
                            {/* Card Top: Badges */}
                            <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 flex items-center justify-between gap-1.5 text-[10px]">
                              <div className="flex items-center gap-1 flex-wrap min-w-0">
                                <span
                                  className={`px-1.5 py-0.2 rounded font-bold border shrink-0 ${
                                    item.sourceWorkspace === 'Property'
                                      ? 'bg-teal-50 text-teal-900 border-teal-200'
                                      : 'bg-blue-50 text-blue-900 border-blue-200'
                                  }`}
                                >
                                  {item.sourceWorkspace}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded font-semibold border truncate max-w-[110px] shrink-0 ${getSectionShortBadge(
                                    item.sourceSection
                                  )}`}
                                  title={item.sourceSection}
                                >
                                  {getSectionShortName(item.sourceSection)}
                                </span>
                              </div>
                              <span className="font-mono text-slate-500 font-bold shrink-0">
                                #{item.referenceNumber}
                              </span>
                            </div>

                            {/* Card Main: Product & Property */}
                            <div className="p-3 space-y-2">
                              <div>
                                <div
                                  className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug"
                                  title={item.productName}
                                >
                                  {item.productName}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center justify-between gap-1 mt-0.5">
                                  <span className="truncate max-w-[160px] font-mono">
                                    {item.modelOrSku || item.category}
                                  </span>
                                  <span className="font-mono font-bold text-slate-900 px-1.5 py-0.2 bg-slate-100 rounded border border-slate-200 shrink-0">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>

                              {/* Property & Client */}
                              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] space-y-0.5">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{item.propertyName}</span>
                                </div>
                                <div className="text-slate-500 truncate flex items-center justify-between">
                                  <span className="truncate">{item.clientName}</span>
                                  {item.totalCost > 0 && (
                                    <span className="font-mono font-bold text-slate-700 shrink-0">
                                      ${item.totalCost.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Needed By Date */}
                              {item.neededByDate && (
                                <div className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>Needed: {item.neededByDate}</span>
                                </div>
                              )}

                              {/* Lock Finish Configuration if present */}
                              {item.lockFinishConfig && (
                                <button
                                  type="button"
                                  onClick={() => setEditingFinishIntakeItem(item)}
                                  className="w-full text-left text-[9.5px] font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 truncate flex items-center justify-between cursor-pointer transition-colors"
                                  title="Click to view or edit lock finish options"
                                >
                                  <span className="truncate">
                                    Finish: {getLockFinishSummaryTag(item.lockFinishConfig)}
                                  </span>
                                  <Sliders className="w-3 h-3 text-purple-600 shrink-0" />
                                </button>
                              )}

                              {/* Tracking # Input & Dispatch Details (Retained in Kanban View when marked Shipped / Delivered) */}
                              {(item.isShipped || item.isDelivered || item.trackingNumber) && (
                                <div
                                  className="p-2.5 bg-slate-900 text-white rounded-lg border border-sky-500/40 space-y-2 shadow-2xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between gap-1 text-[10px]">
                                    <span className="font-bold text-sky-200 flex items-center gap-1.5">
                                      <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                      <span>Carrier Tracking #:</span>
                                    </span>
                                    {item.trackingNumber ? (
                                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/90 px-1.5 py-0.2 rounded border border-emerald-500/40">
                                        ✓ Saved
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/40">
                                        Pending Tracking
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      disabled={!canEdit}
                                      value={currentTrackingDraft}
                                      onChange={(e) =>
                                        setTrackingDrafts((prev) => ({ ...prev, [item.uid]: e.target.value }))
                                      }
                                      placeholder="Carrier Tracking # (e.g., 1Z...)"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleSaveTracking(item);
                                        }
                                      }}
                                      className={`w-full px-2 py-1 text-[10px] font-mono font-bold bg-slate-950 border border-sky-400/50 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all ${
                                        !canEdit ? 'opacity-70 cursor-not-allowed' : ''
                                      }`}
                                      title="Enter tracking number and press Enter or click Save"
                                    />
                                    {canEdit && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSaveTracking(item);
                                        }}
                                        className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer transition-all shadow-2xs shrink-0 active:scale-95"
                                        title="Save tracking number"
                                      >
                                        Save
                                      </button>
                                    )}
                                    {item.trackingNumber && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(item.trackingNumber || '');
                                          setCopiedUid(`track::${item.uid}`);
                                          setTimeout(() => setCopiedUid(null), 2000);
                                        }}
                                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-[10px] cursor-pointer shrink-0"
                                        title="Copy tracking number"
                                      >
                                        {copiedUid === `track::${item.uid}` ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>

                                  {/* Optional Tie to Shipping Dock Item */}
                                  {(() => {
                                    const projectForCard = projects.find((p) => p.id === item.projectId);
                                    const dockItems = projectForCard?.shippingDockItems || [];
                                    if (dockItems.length === 0) return null;

                                    const activeDockId =
                                      selectedDockItemForUid[item.uid] ||
                                      item.tiedShippingDockId ||
                                      dockItems.find((d) =>
                                        getDockItemTrackingNumbers(d).includes(
                                          (item.trackingNumber || currentTrackingDraft || '').trim()
                                        )
                                      )?.id ||
                                      '';

                                    return (
                                      <div className="pt-1.5 border-t border-slate-800 flex items-center gap-1.5 text-[9px] text-sky-300">
                                        <Link2 className="w-3 h-3 text-sky-400 shrink-0" />
                                        <span className="shrink-0 font-medium">Dock:</span>
                                        <select
                                          disabled={!canEdit}
                                          value={activeDockId}
                                          onChange={(e) => {
                                            const dockId = e.target.value;
                                            setSelectedDockItemForUid((prev) => ({ ...prev, [item.uid]: dockId }));
                                            if (item.trackingNumber) {
                                              handleUpdateMilestone(item, {
                                                trackingNumber: item.trackingNumber,
                                                tiedShippingDockId: dockId,
                                              });
                                            }
                                          }}
                                          className="w-full bg-slate-950 border border-sky-800/80 rounded px-1.5 py-0.5 text-[9px] font-mono text-sky-200 truncate focus:outline-none"
                                        >
                                          <option value="">Auto / Standalone Dock</option>
                                          {dockItems.map((d) => (
                                            <option key={d.id} value={d.id}>
                                              {d.shipmentBatchLabel || 'Batch'} · {d.carrier || 'Carrier'}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>

                            {/* Card Bottom: Milestone Checkbox Buttons */}
                            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 space-y-1.5">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Stage Checkboxes:
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-[10px]">
                                {/* 1. Ordered */}
                                <button
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleMilestone(item, 'Ordered');
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-1 rounded border font-semibold transition-all ${
                                    !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                                  } ${
                                    item.isOrdered
                                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xs'
                                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                  }`}
                                  title="Ordered: Check to move to Ordered column"
                                >
                                  <span
                                    className={`w-3 h-3 rounded flex items-center justify-center border text-[8px] ${
                                      item.isOrdered ? 'bg-white border-white text-indigo-700' : 'border-slate-400'
                                    }`}
                                  >
                                    {item.isOrdered && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                  <span className="truncate">Ordered</span>
                                </button>

                                {/* 2. Warehouse */}
                                <button
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleMilestone(item, 'Arrived');
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-1 rounded border font-semibold transition-all ${
                                    !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                                  } ${
                                    item.isArrivedToWarehouse
                                      ? 'bg-teal-600 text-white border-teal-500 shadow-2xs'
                                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                  }`}
                                  title="Arrived at Warehouse: Check to move to Arrived at Warehouse column"
                                >
                                  <span
                                    className={`w-3 h-3 rounded flex items-center justify-center border text-[8px] ${
                                      item.isArrivedToWarehouse
                                        ? 'bg-white border-white text-teal-700'
                                        : 'border-slate-400'
                                    }`}
                                  >
                                    {item.isArrivedToWarehouse && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                  <span className="truncate">Warehouse</span>
                                </button>

                                {/* 3. Shipped */}
                                <button
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleMilestone(item, 'Shipped');
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-1 rounded border font-semibold transition-all ${
                                    !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                                  } ${
                                    item.isShipped
                                      ? 'bg-sky-600 text-white border-sky-500 shadow-2xs'
                                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                  }`}
                                  title="Shipped: Check to move to Shipped column"
                                >
                                  <span
                                    className={`w-3 h-3 rounded flex items-center justify-center border text-[8px] ${
                                      item.isShipped ? 'bg-white border-white text-sky-700' : 'border-slate-400'
                                    }`}
                                  >
                                    {item.isShipped && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                  <span className="truncate">Shipped</span>
                                </button>

                                {/* 4. Delivered */}
                                <button
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleMilestone(item, 'Delivered');
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-1 rounded border font-semibold transition-all ${
                                    !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                                  } ${
                                    item.isDelivered
                                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                  }`}
                                  title="Delivered: Check to move to Delivered column"
                                >
                                  <span
                                    className={`w-3 h-3 rounded flex items-center justify-center border text-[8px] ${
                                      item.isDelivered ? 'bg-white border-white text-emerald-700' : 'border-slate-400'
                                    }`}
                                  >
                                    {item.isDelivered && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                  <span className="truncate">Delivered</span>
                                </button>
                              </div>

                              {/* Bottom Navigation & Actions */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyItemSpecification(item)}
                                    className="text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                    title="Copy specifications"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>{copiedUid === item.uid ? 'Copied' : 'Specs'}</span>
                                  </button>

                                  {/* Quick Step Buttons for moving to previous/next column */}
                                  {canEdit && colIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveItemToColumn(item, KANBAN_COLUMNS[colIdx - 1].id)}
                                      className="p-0.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
                                      title={`Move left to ${KANBAN_COLUMNS[colIdx - 1].title}`}
                                    >
                                      <MoveLeft className="w-3 h-3" />
                                    </button>
                                  )}
                                  {canEdit && colIdx < KANBAN_COLUMNS.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveItemToColumn(item, KANBAN_COLUMNS[colIdx + 1].id)}
                                      className="p-0.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
                                      title={`Move right to ${KANBAN_COLUMNS[colIdx + 1].title}`}
                                    >
                                      <MoveRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>

                                {item.sourceWorkspace === 'Property' ? (
                                  <button
                                    type="button"
                                    onClick={() => onOpenPropertyInCustomerSuccess(item.projectId)}
                                    className="text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Property</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onOpenProjectInOperations(item.projectId)}
                                    className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Project</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const sectionStyle = getSectionBadgeStyle(item.sourceSection);
            const finishSummary = getLockFinishSummaryTag(item.lockFinishConfig);
            const finishLines = formatFullFinishDetailsLines(item.lockFinishConfig, {
              name: item.productName,
              model: item.modelOrSku,
              category: item.category,
              thermostatBrand: item.thermostatBrand as any,
            });
            const isFinishExpanded = !!expandedFinishUids[item.uid];
            const currentTrackingDraft = trackingDrafts[item.uid] ?? item.trackingNumber ?? '';
            const projectForCard = projects.find((p) => p.id === item.projectId);
            const isCardProjectCompleted = isProjectMilestoneCompleted(projectForCard);

            return (
              <div
                key={item.uid}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Top Origin & Section Type Tag Bar */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tag 1: Where it came from (Project vs Property Page) */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                        item.sourceWorkspace === 'Property'
                          ? 'bg-teal-100 text-teal-950 border-teal-300'
                          : 'bg-blue-100 text-blue-950 border-blue-300'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Origin: {item.sourceWorkspaceBadgeLabel}</span>
                    </span>

                    {/* Tag 2: Section it came from & Type */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${sectionStyle.badge}`}
                    >
                      {sectionStyle.icon}
                      <span>Section: {item.sourceSection}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white font-mono">
                      Type: {item.itemType}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white text-slate-800 border border-slate-300">
                      Ref #{item.referenceNumber}
                    </span>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filter by this project button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (propertyFilter === item.projectId) {
                          setPropertyFilter('ALL');
                          setPropertySearchQuery('');
                        } else {
                          setPropertyFilter(item.projectId);
                          setPropertySearchQuery(item.propertyName);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border transition-colors ${
                        propertyFilter === item.projectId
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                      title={`Filter acquisition view to only show orders associated with ${item.propertyName}`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>
                        {propertyFilter === item.projectId
                          ? 'Viewing Only This Project'
                          : 'Filter By This Project'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyItemSpecification(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold cursor-pointer"
                      title="Copy full product & finish specifications"
                    >
                      {copiedUid === item.uid ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Specs</span>
                        </>
                      )}
                    </button>

                    {item.sourceWorkspace === 'Property' ? (
                      <button
                        type="button"
                        onClick={() => onOpenPropertyInCustomerSuccess(item.projectId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-[11px] font-bold cursor-pointer"
                      >
                        <span>Open Property</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenProjectInOperations(item.projectId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold cursor-pointer"
                      >
                        <span>Open Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {item.sourceSection === 'Smart Community Bill of Materials (BOM)' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBomSubmission(item)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remove BOM submission from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Product & Milestones Body */}
                <div className="p-5 space-y-4">
                  {/* Fulfillment Milestones & Stage Tracker (Ordered, Arrived to Warehouse, Shipped, Tracking #) */}
                  <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-3 shadow-inner">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mr-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Order Milestones:</span>
                        </span>

                        {/* 1. Ordered Toggle */}
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleMilestone(item, 'Ordered')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            item.isOrdered
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-700'
                          }`}
                          title={
                            !canEdit
                              ? 'View-only: Product Acquisition Users (Clint Branch, John McBride) and PMs have edit access'
                              : 'Click to toggle Ordered status'
                          }
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              item.isOrdered ? 'bg-white border-white text-indigo-700' : 'border-slate-500'
                            }`}
                          >
                            {item.isOrdered && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>1. Ordered</span>
                          {item.isOrdered && item.orderedAt && (
                            <span className="text-[10px] opacity-80 font-mono">({item.orderedAt})</span>
                          )}
                        </button>

                        {/* 2. Arrived to Warehouse Toggle */}
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleMilestone(item, 'Arrived')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            item.isArrivedToWarehouse
                              ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-700'
                          }`}
                          title={
                            !canEdit
                              ? 'View-only: Product Acquisition Users and PMs have edit access'
                              : 'Click to toggle Arrived to Warehouse status'
                          }
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              item.isArrivedToWarehouse ? 'bg-white border-white text-teal-700' : 'border-slate-500'
                            }`}
                          >
                            {item.isArrivedToWarehouse && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>2. Arrived to Warehouse</span>
                          {item.isArrivedToWarehouse && item.arrivedAt && (
                            <span className="text-[10px] opacity-80 font-mono">({item.arrivedAt})</span>
                          )}
                        </button>

                        {/* 3. Shipped Toggle (Opens Tracking #) */}
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleMilestone(item, 'Shipped')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            item.isShipped
                              ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-700'
                          }`}
                          title={
                            !canEdit
                              ? 'View-only: Product Acquisition Users and PMs have edit access'
                              : isCardProjectCompleted
                              ? 'Project is marked as Completed on its milestone — PM notification is suppressed'
                              : 'Click to toggle Shipped status (opens Tracking # to populate and notifies PM)'
                          }
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              item.isShipped ? 'bg-white border-white text-sky-700' : 'border-slate-500'
                            }`}
                          >
                            {item.isShipped && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>3. Shipped</span>
                          {item.isShipped && item.shippedAt && (
                            <span className="text-[10px] opacity-80 font-mono">({item.shippedAt})</span>
                          )}
                          {item.isShipped && isCardProjectCompleted && (
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              title="Project milestone is Completed — PM notification suppressed"
                            >
                              PM Notif Suppressed
                            </span>
                          )}
                        </button>

                        {/* 4. Delivered Toggle */}
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleMilestone(item, 'Delivered')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            !canEdit ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            item.isDelivered
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-700'
                          }`}
                          title={
                            !canEdit
                              ? 'View-only: Product Acquisition Users and PMs have edit access'
                              : 'Click to toggle Delivered milestone'
                          }
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              item.isDelivered ? 'bg-white border-white text-emerald-700' : 'border-slate-500'
                            }`}
                          >
                            {item.isDelivered && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>4. Delivered</span>
                          {item.isDelivered && item.deliveredAt && (
                            <span className="text-[10px] opacity-80 font-mono">({item.deliveredAt})</span>
                          )}
                        </button>
                      </div>

                      {/* Viewable (Non-editable) Needed By Date Display */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-300">Needed By:</span>
                        {item.neededByDate ? (
                          <span className="font-mono text-xs font-black text-amber-300 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                            {item.neededByDate}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Not Specified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shipped -> Tracking # Populator Field */}
                    {(item.isShipped || item.trackingNumber) && (
                      <div className="p-3 bg-sky-950/70 rounded-xl border border-sky-500/40 flex flex-col gap-2.5 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shrink-0">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-sky-200 block">
                                Tracking # Dispatch Information
                              </span>
                              <span className="text-[10px] text-sky-300/80">
                                Saves directly to origin element, ties to Shipping Dock, and notifies the PM.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              disabled={!canEdit}
                              value={currentTrackingDraft}
                              onChange={(e) =>
                                setTrackingDrafts((prev) => ({ ...prev, [item.uid]: e.target.value }))
                              }
                              placeholder="Carrier Tracking # (e.g., 1Z9999999999999999)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveTracking(item);
                                }
                              }}
                              className={`px-3 py-1.5 text-xs font-mono font-bold bg-slate-950 border border-sky-400/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 w-64 ${
                                !canEdit ? 'opacity-80 cursor-not-allowed' : ''
                              }`}
                            />
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => handleSaveTracking(item)}
                                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                              >
                                Save Tracking #
                              </button>
                            )}
                            {item.trackingNumber && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.trackingNumber || '');
                                  setCopiedUid(`track::${item.uid}`);
                                  setTimeout(() => setCopiedUid(null), 2000);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 text-xs font-bold cursor-pointer"
                                title="Copy Tracking #"
                              >
                                {copiedUid === `track::${item.uid}` ? 'Copied' : 'Copy'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Tie to Shipping Dock Line Item if originating project has shipping dock items */}
                        {(() => {
                          const projectForCard = projects.find((p) => p.id === item.projectId);
                          const dockItems = projectForCard?.shippingDockItems || [];
                          if (dockItems.length === 0) return null;

                          const activeDockId =
                            selectedDockItemForUid[item.uid] ||
                            item.tiedShippingDockId ||
                            dockItems.find((d) =>
                              getDockItemTrackingNumbers(d).includes(
                                (item.trackingNumber || currentTrackingDraft || '').trim()
                              )
                            )?.id ||
                            '';

                          return (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-800/50 text-xs">
                              <div className="flex items-center gap-1 text-sky-300 font-semibold">
                                <Link2 className="w-3.5 h-3.5 text-sky-400" />
                                <span>Tie to Shipping Dock Line Item:</span>
                              </div>
                              <select
                                disabled={!canEdit}
                                value={activeDockId}
                                onChange={(e) => {
                                  const nextDockId = e.target.value;
                                  setSelectedDockItemForUid((prev) => ({ ...prev, [item.uid]: nextDockId }));
                                  if (item.trackingNumber || currentTrackingDraft) {
                                    handleUpdateMilestone(item, {
                                      trackingNumber: (currentTrackingDraft || item.trackingNumber || '').trim(),
                                      tiedShippingDockId: nextDockId,
                                    });
                                  }
                                }}
                                className={`px-2.5 py-1 text-xs font-semibold bg-slate-900 border border-sky-400/50 rounded-lg text-sky-200 focus:outline-none focus:border-sky-400 cursor-pointer ${
                                  !canEdit ? 'opacity-80 cursor-not-allowed' : ''
                                }`}
                              >
                                <option value="">(Untied / Select Dock Item...)</option>
                                {dockItems.map((dock) => (
                                  <option key={dock.id} value={dock.id}>
                                    {dock.shipmentBatchLabel} ({dock.carrier})
                                  </option>
                                ))}
                              </select>
                              {activeDockId && (
                                <span className="text-emerald-400 font-bold inline-flex items-center gap-1 text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3" /> Tied to Dock
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Product Specification & Quantities */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">
                          {item.productName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono text-xs font-bold">
                          SKU / Model: {item.modelOrSku}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                          {item.category} ({item.productType})
                        </span>
                        {item.thermostatBrand && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                            Brand: {item.thermostatBrand}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          <strong>Property / Project:</strong> {item.propertyName} (#{item.quoteNumber})
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Client:</strong> {item.clientName}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Property Mgmt Co:</strong> {item.propertyManagementCompany}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Location / Scope:</strong> {item.locationOrScope}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          <strong>PM:</strong> {item.assignedPMName}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>CSM:</strong> {item.assignedCSMName}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Integrator Partner(s):</strong>{' '}
                          {item.integratorPartners.join(', ') || 'None'}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Field Tech:</strong> {item.assignedFieldTech}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Submitted:</strong> {item.createdAt} by {item.createdBy}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Quantity & Valuation Box */}
                    <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-800 shrink-0">
                      <div className="text-right pr-3 border-r border-slate-700">
                        <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                          Confirmed Qty
                        </div>
                        <div className="text-xl font-black font-mono text-white">
                          {item.quantity.toLocaleString()}
                        </div>
                        {item.quotedQuantity !== undefined && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            BOM Quoted: {item.quotedQuantity}
                            {item.sparesCount ? ` (+${item.sparesCount} spares)` : ''}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          Est. Total Value
                        </div>
                        <div className="text-lg font-black font-mono text-emerald-400">
                          ${item.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / unit
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Finish Options Bar & Expandable Full Finish Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="text-xs font-bold text-sky-300">
                          Product Finish &amp; Hardware Specifications:
                        </span>
                        {item.lockFinishConfig ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                              style={{
                                backgroundColor: getLockFinishColorHex(
                                  item.lockFinishConfig.befeColorFinish ||
                                    item.lockFinishConfig.ndeColorFinish ||
                                    item.lockFinishConfig.xe360ColorFinish
                                ),
                              }}
                            />
                            <span>{finishSummary}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Standard Factory Finish (Click &quot;Set / Edit Finish Options&quot; to attach lock trim/color/lever specs)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {finishLines.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedFinishUids((prev) => ({
                                ...prev,
                                [item.uid]: !prev[item.uid],
                              }))
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                          >
                            <span>{isFinishExpanded ? 'Hide Full Finish Specs' : 'View Full Finish Specs'}</span>
                            {isFinishExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingFinishIntakeItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold cursor-pointer"
                        >
                          <span>🎨 {item.lockFinishConfig ? 'Edit Finish Options' : '+ Set Finish Options'}</span>
                        </button>
                      </div>
                    </div>

                    {(isFinishExpanded || (item.lockFinishConfig && finishLines.length > 0)) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
                        {finishLines.map((line, idx) => (
                          <div
                            key={idx}
                            className="text-[11px] text-slate-200 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RMA / Order / BOM Context Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <strong className="text-slate-800">Notes / Scope Justification:</strong>{' '}
                      {item.reasonOrNotes || 'Standard product acquisition intake'}
                    </div>
                    {item.rmaDetails && (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          OEM: {item.rmaDetails.matchedCompany}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          RMA Step: {item.rmaDetails.rmaStatus}
                        </span>
                        {item.rmaDetails.issuedRmaNumber && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                            RMA #: {item.rmaDetails.issuedRmaNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lock Finish Modal for Editing Finish Options Directly Inside the Product Acquisition Portal */}
      {editingFinishIntakeItem && (
        <LockFinishModal
          item={
            {
              id: editingFinishIntakeItem.uid,
              name: editingFinishIntakeItem.productName,
              model: editingFinishIntakeItem.modelOrSku,
              category: editingFinishIntakeItem.category as any,
              quantity: editingFinishIntakeItem.quantity,
              installedCount: editingFinishIntakeItem.installedCount || 0,
              location: editingFinishIntakeItem.locationOrScope,
              lockFinishConfig: editingFinishIntakeItem.lockFinishConfig,
            } as BOMItem
          }
          isOpen={!!editingFinishIntakeItem}
          onClose={() => setEditingFinishIntakeItem(null)}
          onSave={(_, config) => handleSaveFinishOnIntakeItem(config)}
        />
      )}
    </div>
  );
};
