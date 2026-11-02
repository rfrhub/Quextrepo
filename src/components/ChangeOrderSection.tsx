import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  OperationProject,
  ChangeOrderRecord,
  ChangeOrderLineItem,
  ChangeOrderStatus,
  BOMCategory,
  AVAILABLE_FIELD_TECHS,
  FieldTechName,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  isDiyPartner,
  LockFinishConfig,
  isLockBOMItem,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  formatFullFinishDetailsLines,
} from '../types';
import {
  QUEUXT_HARDWARE_CATALOG,
  QUEUXT_SOFTWARE_CATALOG,
  MYQUEXT_FULL_PRODUCT_CATALOG,
} from '../data/catalogData';
import { IntegratorPartnerSelector } from './IntegratorPartnerSelector';
import { LockFinishModal } from './LockFinishModal';
import {
  FilePlus2,
  Package,
  Cloud,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  ShieldCheck,
  Layers,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Edit3,
  Check,
  Wrench,
  Calendar,
  Truck,
} from 'lucide-react';

interface UnifiedCatalogEntry {
  id: string;
  sku: string;
  name: string;
  productType: 'Hardware' | 'Software';
  category: string;
  bomCategory: BOMCategory;
  manufacturer: string;
  unitPrice: number;
  unitCost: number;
  billingType: 'One-Time' | 'Per Unit / Month' | 'Per Property / Month';
  description: string;
  typicalScope: string;
}

const UNIFIED_CHANGE_ORDER_CATALOG: UnifiedCatalogEntry[] = (() => {
  const map = new Map<string, UnifiedCatalogEntry>();

  // 1. Primary Canonical Catalog (MYQUEXT_FULL_PRODUCT_CATALOG: 85 Hardware + Software/SaaS items)
  for (const fullItem of MYQUEXT_FULL_PRODUCT_CATALOG) {
    const isSw = fullItem.pricingModel === 'SaaS';
    const skuKey = String(fullItem.sku || fullItem.id);
    map.set(skuKey, {
      id: String(fullItem.id || skuKey),
      sku: skuKey,
      name: String(fullItem.name || 'Catalog Product'),
      productType: isSw ? 'Software' : 'Hardware',
      category: String(
        fullItem.category || fullItem.bomCategory || (isSw ? 'Software & SaaS' : 'Hardware')
      ),
      bomCategory: (fullItem.bomCategory || 'Smart Access Control') as BOMCategory,
      manufacturer: String(fullItem.brandName || 'Quext'),
      unitPrice: Number(fullItem.sellPrice ?? fullItem.msrp ?? fullItem.cost ?? 0) || 0,
      unitCost: Number(fullItem.cost ?? 0) || 0,
      billingType: isSw
        ? fullItem.isBilledPerUnit
          ? 'Per Unit / Month'
          : 'Per Property / Month'
        : 'One-Time',
      description: String(fullItem.description || fullItem.shortDescription || ''),
      typicalScope: isSw
        ? fullItem.isBilledPerUnit
          ? 'All Residential Units (Monthly SaaS)'
          : 'Property-Wide Subscription'
        : 'Property Deployment Scope',
    });
  }

  // 2. Hardware Catalog items
  for (const hw of QUEUXT_HARDWARE_CATALOG) {
    const skuKey = String(hw.sku || hw.id);
    if (!map.has(skuKey)) {
      map.set(skuKey, {
        id: String(hw.id || skuKey),
        sku: skuKey,
        name: String(hw.name || 'Hardware Item'),
        productType: 'Hardware',
        category: String(hw.category || 'Smart Access Control'),
        bomCategory: (hw.category || 'Smart Access Control') as BOMCategory,
        manufacturer: String(hw.manufacturer || 'Quext'),
        unitPrice: Number(hw.unitPrice ?? hw.unitCost ?? 0) || 0,
        unitCost: Number(hw.unitCost ?? 0) || 0,
        billingType: 'One-Time',
        description: String(hw.description || ''),
        typicalScope: String(hw.typicalScope || 'Property Deployment Scope'),
      });
    }
  }

  // 3. Software Catalog items
  for (const sw of QUEUXT_SOFTWARE_CATALOG) {
    const skuKey = String(sw.sku || sw.id);
    if (!map.has(skuKey)) {
      const isPerUnit = sw.billingType === 'per_unit_per_month';
      map.set(skuKey, {
        id: String(sw.id || skuKey),
        sku: skuKey,
        name: String(sw.name || 'Software Subscription'),
        productType: 'Software',
        category: String(sw.tier || (sw.features && sw.features[0]) || 'Software & SaaS'),
        bomCategory: 'Smart Access Control',
        manufacturer: String((sw.features && sw.features[1]) || 'Quext Software'),
        unitPrice: Number(sw.monthlyPrice ?? sw.monthlyCost ?? 0) || 0,
        unitCost: Number(sw.monthlyCost ?? 0) || 0,
        billingType: isPerUnit ? 'Per Unit / Month' : 'Per Property / Month',
        description: String(sw.description || ''),
        typicalScope: isPerUnit
          ? 'All Residential Units (Monthly SaaS)'
          : 'Property-Wide Subscription',
      });
    }
  }

  return Array.from(map.values());
})();

const CHANGE_ORDER_STATUSES: ChangeOrderStatus[] = [
  'Draft',
  'Pending Customer Approval',
  'Approved',
  'In Fulfillment / Installed',
];

function getStatusBadgeStyle(status: ChangeOrderStatus): string {
  switch (status) {
    case 'Draft':
      return 'bg-slate-800 text-slate-300 border-slate-600';
    case 'Pending Customer Approval':
      return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    case 'Approved':
      return 'bg-sky-950/60 text-sky-300 border-sky-500/40';
    case 'In Fulfillment / Installed':
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

interface ChangeOrderSectionProps {
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
  currentUserName?: string;
  contextLabel?: 'Project' | 'Property';
}

export const ChangeOrderSection: React.FC<ChangeOrderSectionProps> = ({
  project,
  onUpdateProject,
  currentUserName = 'Project Manager',
  contextLabel = 'Project',
}) => {
  const changeOrders: ChangeOrderRecord[] = useMemo(
    () => (Array.isArray(project.changeOrders) ? project.changeOrders : []),
    [project.changeOrders]
  );

  // Builder Modal / Drawer state for creating a new Order or adding multiple items to an existing Order
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [targetChangeOrderId, setTargetChangeOrderId] = useState<string | null>(null);

  // New Order metadata form state
  const [coTitle, setCoTitle] = useState('');
  const [coReason, setCoReason] = useState('');
  const [coStatus, setCoStatus] = useState<ChangeOrderStatus>('Approved');
  const [coApprovedBy, setCoApprovedBy] = useState('');
  const [coNeededByDate, setCoNeededByDate] = useState('');
  const [coNotes, setCoNotes] = useState('');
  const [coPartners, setCoPartners] = useState<string[]>(() =>
    getProjectIntegratorPartners(project)
  );
  const [coFieldTech, setCoFieldTech] = useState<FieldTechName>(() =>
    normalizeFieldTech(project.assignedFieldTech)
  );

  // Multi-item staged list for the current Order
  const [stagedItems, setStagedItems] = useState<ChangeOrderLineItem[]>([]);

  // Product Catalog Picker filters
  const [catalogTab, setCatalogTab] = useState<'ALL' | 'Hardware' | 'Software'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded Order cards
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});

  // Finish Options modal state for Staged or Existing Change Order line items
  const [finishModalTarget, setFinishModalTarget] = useState<{
    mode: 'staged' | 'existing';
    coId?: string;
    item: ChangeOrderLineItem;
  } | null>(null);
  const [expandedFinishItemIds, setExpandedFinishItemIds] = useState<Record<string, boolean>>({});

  // Inline editing for existing Order metadata
  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editReasonValue, setEditReasonValue] = useState('');
  const [editApprovedByValue, setEditApprovedByValue] = useState('');
  const [editNeededByValue, setEditNeededByValue] = useState('');

  const builderPanelRef = useRef<HTMLDivElement | null>(null);
  const stagedTableRef = useRef<HTMLDivElement | null>(null);

  // Available categories & brands based on catalogTab
  const availableCategories = useMemo(() => {
    const base =
      catalogTab === 'ALL'
        ? UNIFIED_CHANGE_ORDER_CATALOG
        : UNIFIED_CHANGE_ORDER_CATALOG.filter((item) => item.productType === catalogTab);
    return Array.from(
      new Set(base.map((i) => String(i.category || 'General')).filter(Boolean))
    ).sort();
  }, [catalogTab]);

  const availableBrands = useMemo(() => {
    const base =
      catalogTab === 'ALL'
        ? UNIFIED_CHANGE_ORDER_CATALOG
        : UNIFIED_CHANGE_ORDER_CATALOG.filter((item) => item.productType === catalogTab);
    return Array.from(
      new Set(base.map((i) => String(i.manufacturer || 'Quext')).filter(Boolean))
    ).sort();
  }, [catalogTab]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return UNIFIED_CHANGE_ORDER_CATALOG.filter((entry) => {
      if (catalogTab !== 'ALL' && entry.productType !== catalogTab) return false;
      if (selectedCategory !== 'ALL' && entry.category !== selectedCategory) return false;
      if (selectedBrand !== 'ALL' && entry.manufacturer !== selectedBrand) return false;
      if (!q) return true;
      return (
        String(entry.name || '').toLowerCase().includes(q) ||
        String(entry.sku || '').toLowerCase().includes(q) ||
        String(entry.category || '').toLowerCase().includes(q) ||
        String(entry.manufacturer || '').toLowerCase().includes(q) ||
        String(entry.description || '').toLowerCase().includes(q)
      );
    });
  }, [catalogTab, selectedCategory, selectedBrand, searchQuery]);

  // Aggregate summary metrics across all Orders (kept strictly separate from Original BOM)
  const summaryStats = useMemo(() => {
    let totalHardwareUnits = 0;
    let installedHardwareUnits = 0;
    let totalHardwareValue = 0;

    let totalSoftwareLicenses = 0;
    let activatedSoftwareLicenses = 0;
    let monthlySoftwareRecurring = 0;

    let totalLineItems = 0;

    for (const co of changeOrders) {
      for (const item of co.items || []) {
        totalLineItems += 1;
        const qty = Number(item.quantity) || 0;
        const inst = Number(item.installedCount) || 0;
        const price = Number(item.unitPrice) || 0;

        if (item.productType === 'Hardware') {
          totalHardwareUnits += qty;
          installedHardwareUnits += inst;
          totalHardwareValue += qty * price;
        } else {
          totalSoftwareLicenses += qty;
          activatedSoftwareLicenses += inst;
          monthlySoftwareRecurring += qty * price;
        }
      }
    }

    return {
      totalChangeOrders: changeOrders.length,
      totalLineItems,
      totalHardwareUnits,
      installedHardwareUnits,
      totalHardwareValue,
      totalSoftwareLicenses,
      activatedSoftwareLicenses,
      monthlySoftwareRecurring,
    };
  }, [changeOrders]);

  const openNewChangeOrderBuilder = () => {
    const nextNum = changeOrders.length + 1;
    setTargetChangeOrderId(null);
    setCoTitle(
      contextLabel === 'Project'
        ? `Product Acquisition & Change Order #${nextNum} — Additional Scope`
        : `Supplemental Order #${nextNum} — Additional Scope`
    );
    setCoReason('');
    setCoStatus('Approved');
    setCoApprovedBy('');
    setCoNeededByDate('');
    setCoNotes('');
    setCoPartners(getProjectIntegratorPartners(project));
    setCoFieldTech(normalizeFieldTech(project.assignedFieldTech));
    setStagedItems([]);
    setIsBuilderOpen(true);
    setTimeout(() => {
      builderPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  useEffect(() => {
    const handleExternalOpen = () => {
      openNewChangeOrderBuilder();
    };
    window.addEventListener('quext:open-change-order-builder', handleExternalOpen);
    return () => {
      window.removeEventListener('quext:open-change-order-builder', handleExternalOpen);
    };
  }, [changeOrders.length, project, contextLabel]);

  const openAddItemToExistingCO = (co: ChangeOrderRecord) => {
    setTargetChangeOrderId(co.id);
    setCoTitle(co.title);
    setCoNeededByDate(co.neededByDate || '');
    setCoPartners(
      co.integratorPartners && co.integratorPartners.length > 0
        ? co.integratorPartners
        : getProjectIntegratorPartners(project)
    );
    setCoFieldTech(normalizeFieldTech(co.assignedFieldTech || project.assignedFieldTech));
    setStagedItems([]);
    setIsBuilderOpen(true);
    setTimeout(() => {
      builderPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  // Multi-item 1-click addition: clicking any catalog product adds it directly to the Order's staged items list!
  const handleAddCatalogProductToOrder = (entry: UnifiedCatalogEntry) => {
    const defaultQty =
      entry.productType === 'Software' && entry.billingType === 'Per Unit / Month'
        ? project.unitsCount || 1
        : 1;

    setStagedItems((prev) => {
      const newItem: ChangeOrderLineItem = {
        id: `co-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        catalogId: entry.id,
        sku: entry.sku,
        name: entry.name,
        productType: entry.productType,
        category: entry.category,
        bomCategory: entry.bomCategory,
        manufacturer: entry.manufacturer,
        quantity: defaultQty,
        installedCount: 0,
        sparesCount: 0,
        unitPrice: Math.max(0, Number(entry.unitPrice) || 0),
        billingType: entry.billingType,
        location: entry.typicalScope || 'Supplemental Order Scope',
        description: entry.description,
      };
      return [...prev, newItem];
    });
  };

  const handleIncrementStagedBySku = (sku: string) => {
    setStagedItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
      )
    );
  };

  const handleUpdateStagedItem = (
    itemId: string,
    updater: (item: ChangeOrderLineItem) => ChangeOrderLineItem
  ) => {
    setStagedItems((prev) => prev.map((item) => (item.id === itemId ? updater(item) : item)));
  };

  const handleRemoveStagedItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveBuilder = () => {
    if (stagedItems.length === 0) return;

    const nowIso = new Date().toISOString();
    const isNowDiy = coPartners.some(isDiyPartner);

    if (targetChangeOrderId) {
      // Append all staged items to the existing Order
      const updatedCOs = changeOrders.map((co) => {
        if (co.id !== targetChangeOrderId) return co;
        return {
          ...co,
          sourceWorkspace: co.sourceWorkspace || contextLabel,
          sourceSectionLabel:
            co.sourceSectionLabel ||
            (contextLabel === 'Project'
              ? 'Product Acquisition and Change Order'
              : 'Supplemental Order Catalog'),
          integratorPartners: coPartners,
          assignedFieldTech: coFieldTech,
          items: [...(co.items || []), ...stagedItems],
          neededByDate: coNeededByDate.trim() || co.neededByDate,
          updatedAt: nowIso,
        };
      });

      onUpdateProject({
        ...project,
        integratorPartners: coPartners,
        isDiyInstallation: isNowDiy,
        assignedFieldTech: coFieldTech,
        changeOrders: updatedCOs,
        lastUpdated: nowIso,
      });
    } else {
      // Create new Supplemental Order record with all staged items
      const coIndex = changeOrders.length + 1;
      const coNumber = `${contextLabel === 'Project' ? 'PACO' : 'SO'}-${new Date().getFullYear()}-${String(coIndex).padStart(3, '0')}`;
      const newRecord: ChangeOrderRecord = {
        id: `co-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        changeOrderNumber: coNumber,
        projectId: project.id,
        propertyName: project.propertyName,
        title:
          coTitle.trim() ||
          `${contextLabel === 'Project' ? 'Change Order' : 'Supplemental Order'} #${coIndex}`,
        reason:
          coReason.trim() || 'Additional hardware/software scope requested outside original BOM',
        status: coStatus,
        createdBy: currentUserName,
        createdAt: nowIso,
        updatedAt: nowIso,
        approvedBy: coApprovedBy.trim() || undefined,
        approvedAt:
          coStatus === 'Approved' || coStatus === 'In Fulfillment / Installed'
            ? nowIso
            : undefined,
        integratorPartners: coPartners,
        assignedFieldTech: coFieldTech,
        sourceWorkspace: contextLabel,
        sourceSectionLabel:
          contextLabel === 'Project'
            ? 'Product Acquisition and Change Order'
            : 'Supplemental Order Catalog',
        items: stagedItems,
        neededByDate: coNeededByDate.trim() || undefined,
        notes: coNotes.trim() || undefined,
      };

      onUpdateProject({
        ...project,
        integratorPartners: coPartners,
        isDiyInstallation: isNowDiy,
        assignedFieldTech: coFieldTech,
        changeOrders: [newRecord, ...changeOrders],
        lastUpdated: nowIso,
      });
    }

    setIsBuilderOpen(false);
    setTargetChangeOrderId(null);
    setStagedItems([]);
  };

  const handleUpdateChangeOrderStatus = (coId: string, nextStatus: ChangeOrderStatus) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        status: nextStatus,
        approvedAt:
          (nextStatus === 'Approved' || nextStatus === 'In Fulfillment / Installed') &&
          !co.approvedAt
            ? nowIso
            : co.approvedAt,
        updatedAt: nowIso,
      };
    });

    onUpdateProject({
      ...project,
      changeOrders: updatedCOs,
      lastUpdated: nowIso,
    });
  };

  const handleUpdateOrderPartnersAndTech = (
    coId: string,
    nextPartners: string[],
    nextTech: FieldTechName
  ) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        integratorPartners: nextPartners,
        assignedFieldTech: nextTech,
        updatedAt: nowIso,
      };
    });

    onUpdateProject({
      ...project,
      integratorPartners: nextPartners,
      isDiyInstallation: nextPartners.some(isDiyPartner),
      assignedFieldTech: nextTech,
      changeOrders: updatedCOs,
      lastUpdated: nowIso,
    });
  };

  const handleDeleteChangeOrder = (coId: string) => {
    const updatedCOs = changeOrders.filter((co) => co.id !== coId);
    onUpdateProject({
      ...project,
      changeOrders: updatedCOs,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateLineItem = (
    coId: string,
    itemId: string,
    updater: (item: ChangeOrderLineItem) => ChangeOrderLineItem
  ) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        items: (co.items || []).map((item) => (item.id === itemId ? updater(item) : item)),
        updatedAt: nowIso,
      };
    });

    onUpdateProject({
      ...project,
      changeOrders: updatedCOs,
      lastUpdated: nowIso,
    });
  };

  const handleDeleteLineItem = (coId: string, itemId: string) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        items: (co.items || []).filter((item) => item.id !== itemId),
        updatedAt: nowIso,
      };
    });

    onUpdateProject({
      ...project,
      changeOrders: updatedCOs,
      lastUpdated: nowIso,
    });
  };

  const startEditingHeader = (co: ChangeOrderRecord) => {
    setEditingHeaderId(co.id);
    setEditTitleValue(co.title);
    setEditReasonValue(co.reason || '');
    setEditApprovedByValue(co.approvedBy || '');
    setEditNeededByValue(co.neededByDate || '');
  };

  const saveEditingHeader = (coId: string) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        title: editTitleValue.trim() || co.title,
        reason: editReasonValue.trim(),
        approvedBy: editApprovedByValue.trim() || undefined,
        neededByDate: editNeededByValue.trim() || undefined,
        updatedAt: nowIso,
      };
    });
    onUpdateProject({
      ...project,
      changeOrders: updatedCOs,
      lastUpdated: nowIso,
    });
    setEditingHeaderId(null);
  };

  const stagedHwTotal = useMemo(
    () =>
      stagedItems
        .filter((i) => i.productType === 'Hardware')
        .reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0),
    [stagedItems]
  );

  const stagedSwMonthly = useMemo(
    () =>
      stagedItems
        .filter((i) => i.productType === 'Software')
        .reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0),
    [stagedItems]
  );

  const sectionHeading =
    contextLabel === 'Project'
      ? 'Product Acquisition and Change Order'
      : 'Supplemental Order Catalog';

  return (
    <div
      id="change-order-workflow"
      className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Header Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {sectionHeading}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Separate from Original BOM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {contextLabel} Workspace
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Create multi-item supplemental orders selecting from both the Quext Hardware Catalog and Software/SaaS Catalog outside of the baseline Bill of Materials. Original BOM line items ({project.bomItems?.length || 0} items) remain untouched.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('quext:open-product-acquisition-portal'));
            }}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open the centralized Product Acquisition Portal"
          >
            <Package className="w-4 h-4" />
            <span>Product Acquisition Portal</span>
          </button>
          <button
            type="button"
            onClick={openNewChangeOrderBuilder}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {contextLabel === 'Project'
              ? '+ New Product Acquisition & Change Order'
              : '+ New Supplemental Order'} (Hardware &amp; Software Catalog)
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Supplemental Orders
            </p>
            <p className="text-xl font-black text-white mt-0.5">
              {summaryStats.totalChangeOrders}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({summaryStats.totalLineItems} line {summaryStats.totalLineItems === 1 ? 'item' : 'items'})
              </span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              Supplemental Hardware Installed / Total
            </p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">
              <span className="text-emerald-400">{summaryStats.installedHardwareUnits}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{summaryStats.totalHardwareUnits}</span>
              <span className="text-xs font-sans font-normal text-slate-400 ml-1.5">units</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/90">
              Supplemental Software Activated / Total
            </p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">
              <span className="text-sky-400">{summaryStats.activatedSoftwareLicenses}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{summaryStats.totalSoftwareLicenses}</span>
              <span className="text-xs font-sans font-normal text-slate-400 ml-1.5">licenses</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cloud className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">
              Supplemental Order Scope Value
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base font-black text-emerald-400 font-mono">
                ${summaryStats.totalHardwareValue.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">HW</span>
              <span className="text-slate-600">•</span>
              <span className="text-sm font-bold text-sky-400 font-mono">
                +${summaryStats.monthlySoftwareRecurring.toLocaleString()}/mo
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =====================================================================
          SUPPLEMENTAL ORDER BUILDER PANEL (MULTI-ITEM ORDER CREATION)
      ===================================================================== */}
      {isBuilderOpen && (
        <div
          ref={builderPanelRef}
          id="change-order-builder-panel"
          className="p-5 sm:p-6 bg-indigo-950/20 border-b border-indigo-500/30 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {targetChangeOrderId
                    ? `Add Multiple Catalog Items to ${coTitle}`
                    : contextLabel === 'Project'
                    ? 'Create New Product Acquisition & Change Order (Multi-Item Hardware & Software Order)'
                    : 'Create New Supplemental Order (Multi-Item Hardware & Software Order)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click as many Hardware and Software catalog items as needed below—all selected items are combined onto this single Order.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsBuilderOpen(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Order Metadata + Integrator Partner / Installers + Field Tech */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
            {targetChangeOrderId ? (
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    Target Order
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">{coTitle}</p>
                </div>
                <div>
                  <label
                    htmlFor="co-target-needed-by-date"
                    className="block text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>When needed by? *</span>
                  </label>
                  <input
                    type="date"
                    id="co-target-needed-by-date"
                    value={coNeededByDate}
                    onChange={(e) => setCoNeededByDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-amber-500/50 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Order Title *
                  </label>
                  <input
                    type="text"
                    value={coTitle}
                    onChange={(e) => setCoTitle(e.target.value)}
                    placeholder={
                      contextLabel === 'Project'
                        ? 'e.g., Product Acquisition & Change Order #1 — Additional Readers & Locks'
                        : 'e.g., Supplemental Order #1 — Additional Readers, Locks & SaaS Licenses'
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Order Status
                  </label>
                  <select
                    value={coStatus}
                    onChange={(e) => setCoStatus(e.target.value as ChangeOrderStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CHANGE_ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Customer / PM Approver (Optional)
                  </label>
                  <input
                    type="text"
                    value={coApprovedBy}
                    onChange={(e) => setCoApprovedBy(e.target.value)}
                    placeholder="e.g., Regional Manager / Owner Rep"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Scope Reason / Justification
                  </label>
                  <input
                    type="text"
                    value={coReason}
                    onChange={(e) => setCoReason(e.target.value)}
                    placeholder="Reason for adding items outside of the baseline BOM (e.g., newly added amenity doors, extra leak sensors, SaaS tier expansion)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="co-new-needed-by-date"
                    className="block text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>When needed by? *</span>
                  </label>
                  <input
                    type="date"
                    id="co-new-needed-by-date"
                    value={coNeededByDate}
                    onChange={(e) => setCoNeededByDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-amber-500/50 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Internal Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={coNotes}
                    onChange={(e) => setCoNotes(e.target.value)}
                    placeholder="PO #, billing note, or install instructions"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Assigned Integrator Partner / Installers & Field Tech on Order Creation */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900">
                <IntegratorPartnerSelector
                  assignedPartners={coPartners}
                  projectName={project.propertyName}
                  label="Integrator Partner / Installers:"
                  onChange={(updatedPartners) => {
                    setCoPartners(updatedPartners);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-slate-600 text-xs font-medium">Field Tech:</span>
                <select
                  value={coFieldTech}
                  onChange={(e) => setCoFieldTech(e.target.value as FieldTechName)}
                  className="font-bold text-sky-900 bg-transparent focus:outline-none cursor-pointer text-xs"
                >
                  {AVAILABLE_FIELD_TECHS.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[11px] text-slate-400">
                Assign the Integrator Partner / Installers and Field Tech responsible for this Supplemental Order.
              </span>
            </div>
          </div>

          {/* Product Catalog Browser (Hardware + Software Catalogs — Click Multiple Items to Add to Same Order) */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Catalog Type Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCatalogTab('ALL');
                    setSelectedCategory('ALL');
                    setSelectedBrand('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    catalogTab === 'ALL'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  All Catalog ({UNIFIED_CHANGE_ORDER_CATALOG.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCatalogTab('Hardware');
                    setSelectedCategory('ALL');
                    setSelectedBrand('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    catalogTab === 'Hardware'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Hardware Catalog (
                  {UNIFIED_CHANGE_ORDER_CATALOG.filter((i) => i.productType === 'Hardware').length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCatalogTab('Software');
                    setSelectedCategory('ALL');
                    setSelectedBrand('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    catalogTab === 'Software'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cloud className="w-3.5 h-3.5" />
                  Software &amp; SaaS Catalog (
                  {UNIFIED_CHANGE_ORDER_CATALOG.filter((i) => i.productType === 'Software').length})
                </button>
              </div>

              {/* Search & Category / Manufacturer Filters */}
              <div className="flex flex-wrap items-center gap-2 flex-1 lg:justify-end">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SKU, hardware, or software..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Brands / Vendors</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catalog Product Grid — Multi-Item 1-Click Add */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.map((entry) => {
                const matchingStaged = stagedItems.filter((i) => i.sku === entry.sku);
                const isAdded = matchingStaged.length > 0;
                const totalStagedQty = matchingStaged.reduce(
                  (sum, i) => sum + (Number(i.quantity) || 0),
                  0
                );
                const isHardware = entry.productType === 'Hardware';

                return (
                  <div
                    key={entry.sku}
                    onClick={() => handleAddCatalogProductToOrder(entry)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isAdded
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            isHardware
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {isHardware ? (
                            <Package className="w-3 h-3" />
                          ) : (
                            <Cloud className="w-3 h-3" />
                          )}
                          {entry.productType}
                        </span>
                        {isAdded ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            In Order (Qty: {totalStagedQty})
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">{entry.sku}</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white leading-snug">{entry.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {entry.manufacturer} • {entry.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">
                          ${(Number(entry.unitPrice) || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          {entry.billingType === 'One-Time'
                            ? 'one-time'
                            : entry.billingType === 'Per Unit / Month'
                            ? '/unit/mo'
                            : '/prop/mo'}
                        </span>
                      </div>

                      {isAdded ? (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleIncrementStagedBySku(entry.sku)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                            title="Increase quantity by 1"
                          >
                            +1 Qty
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddCatalogProductToOrder(entry)}
                            className="px-2 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer"
                            title="Add another separate line item row for this product (e.g., for a different location)"
                          >
                            + New Row
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          Add to Order
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  No catalog products match your current filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Multi-Item Staged Order Table (Edit Quantities, Spares, Unit Prices & Locations for All Items on This Order) */}
          <div
            ref={stagedTableRef}
            className="bg-slate-900/95 border border-indigo-500/40 rounded-xl p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Items on This Supplemental Order ({stagedItems.length} Line{' '}
                  {stagedItems.length === 1 ? 'Item' : 'Items'})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Multi-Item Order Enabled
                </span>
              </div>
              {stagedItems.length > 0 && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-300">
                    HW Total:{' '}
                    <strong className="text-emerald-400">${stagedHwTotal.toLocaleString()}</strong>
                  </span>
                  <span className="text-slate-300">
                    SW Monthly:{' '}
                    <strong className="text-sky-400">+${stagedSwMonthly.toLocaleString()}/mo</strong>
                  </span>
                </div>
              )}
            </div>

            {stagedItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                Click one or more <strong>Hardware</strong> or <strong>Software</strong> catalog items above to add them to this Order. You can add as many different items as needed onto a single Order.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2 px-2.5">Type</th>
                      <th className="py-2 px-2.5">Catalog Product</th>
                      <th className="py-2 px-2.5">Deployment Location / Scope</th>
                      <th className="py-2 px-2.5 text-center">Quantity</th>
                      <th className="py-2 px-2.5 text-center">Spares</th>
                      <th className="py-2 px-2.5 text-right">Unit Price</th>
                      <th className="py-2 px-2.5 text-right">Subtotal</th>
                      <th className="py-2 px-2 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {stagedItems.map((item) => {
                      const isHw = item.productType === 'Hardware';
                      const qty = Math.max(1, Number(item.quantity) || 1);
                      return (
                        <tr key={item.id} className="hover:bg-slate-950/60">
                          <td className="py-2.5 px-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isHw
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {item.productType}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {item.sku} • {item.manufacturer}
                            </div>
                            {isHw && (
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                {item.lockFinishConfig ? (
                                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-indigo-500/40 text-[10px] text-white">
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
                                    <span className="font-semibold text-indigo-200">
                                      {getLockFinishSummaryTag(item.lockFinishConfig)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFinishModalTarget({ mode: 'staged', item })
                                      }
                                      className="text-sky-300 hover:text-white font-bold underline ml-1 cursor-pointer"
                                    >
                                      ✎ Edit Finish
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setFinishModalTarget({ mode: 'staged', item })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                                    title="Configure lock trim style, color finish, lever style, or split finishes for this item"
                                  >
                                    <span>
                                      {isLockBOMItem(item)
                                        ? '🎨 + Set Lock Finish Options'
                                        : '🎨 + Finish / Hardware Options'}
                                    </span>
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="text"
                              value={item.location || ''}
                              onChange={(e) =>
                                handleUpdateStagedItem(item.id, (prev) => ({
                                  ...prev,
                                  location: e.target.value,
                                }))
                              }
                              placeholder="e.g., Clubhouse, Bldg 1, All Units"
                              className="w-full min-w-[150px] px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateStagedItem(item.id, (prev) => ({
                                    ...prev,
                                    quantity: Math.max(1, (Number(prev.quantity) || 1) - 1),
                                  }))
                                }
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => {
                                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                                  handleUpdateStagedItem(item.id, (prev) => ({
                                    ...prev,
                                    quantity: val,
                                  }));
                                }}
                                className="w-14 text-center py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-white"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateStagedItem(item.id, (prev) => ({
                                    ...prev,
                                    quantity: (Number(prev.quantity) || 1) + 1,
                                  }))
                                }
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            {isHw ? (
                              <input
                                type="number"
                                min={0}
                                value={item.sparesCount || 0}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  handleUpdateStagedItem(item.id, (prev) => ({
                                    ...prev,
                                    sparesCount: val,
                                  }));
                                }}
                                className="w-14 text-center py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200"
                              />
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const val = Math.max(0, parseFloat(e.target.value) || 0);
                                handleUpdateStagedItem(item.id, (prev) => ({
                                  ...prev,
                                  unitPrice: val,
                                }));
                              }}
                              className="w-20 text-right py-1 px-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                            />
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono font-bold text-emerald-400">
                            ${(qty * (Number(item.unitPrice) || 0)).toLocaleString()}
                            {item.billingType !== 'One-Time' ? '/mo' : ''}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveStagedItem(item.id)}
                              className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Remove item from Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsBuilderOpen(false);
                  setStagedItems([]);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={stagedItems.length === 0}
                onClick={handleSaveBuilder}
                className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stagedItems.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {targetChangeOrderId
                  ? `Add ${stagedItems.length} Item(s) to Supplemental Order`
                  : `Save Supplemental Order (${stagedItems.length} Item${
                      stagedItems.length === 1 ? '' : 's'
                    })`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Supplemental Orders */}
      <div className="p-5 sm:p-6 space-y-4">
        {changeOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                No Supplemental Orders Logged for {project.propertyName}
              </p>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                Need to add extra hardware or software licenses after the initial BOM was finalized? Create a multi-item Supplemental Order to select items from the Quext Hardware &amp; Software Catalogs while keeping the original BOM separate.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={openNewChangeOrderBuilder}
                className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create First Supplemental Order
              </button>
            </div>
          </div>
        ) : (
          changeOrders.map((co) => {
            const isCollapsed = !!collapsedIds[co.id];
            const hwItems = (co.items || []).filter((i) => i.productType === 'Hardware');
            const swItems = (co.items || []).filter((i) => i.productType === 'Software');
            const coHwTotal = hwItems.reduce(
              (acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
              0
            );
            const coSwMonthly = swItems.reduce(
              (acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
              0
            );
            const orderPartners =
              co.integratorPartners && co.integratorPartners.length > 0
                ? co.integratorPartners
                : getProjectIntegratorPartners(project);
            const orderFieldTech = normalizeFieldTech(
              co.assignedFieldTech || project.assignedFieldTech
            );
            const acqUid = `co::${project.id}::${co.id}`;
            const firstItemUid = co.items && co.items[0] ? `co::${project.id}::${co.id}::${co.items[0].id}` : '';
            const acqMilestone = project.acquisitionMilestones?.[acqUid] || (firstItemUid ? project.acquisitionMilestones?.[firstItemUid] : undefined);
            const trackNum = acqMilestone?.trackingNumber || co.trackingNumber;
            const neededBy = acqMilestone?.neededByDate || co.neededByDate;
            const isShipped = !!(acqMilestone?.isShipped ?? co.isShipped ?? (co.status === 'In Fulfillment / Installed'));
            const isArrived = !!(acqMilestone?.isArrivedToWarehouse ?? co.isArrivedToWarehouse);
            const isOrdered = !!(acqMilestone?.isOrdered ?? co.isOrdered ?? (co.status === 'Approved'));

            return (
              <div
                key={co.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-md"
              >
                {/* Supplemental Order Card Header */}
                <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      {editingHeaderId === co.id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-lg border border-indigo-500/40">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                              Order Title
                            </label>
                            <input
                              type="text"
                              value={editTitleValue}
                              onChange={(e) => setEditTitleValue(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-indigo-500/50 text-xs text-white font-bold"
                              placeholder="Order Title"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                              Scope Reason
                            </label>
                            <input
                              type="text"
                              value={editReasonValue}
                              onChange={(e) => setEditReasonValue(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                              placeholder="Reason / Scope Justification"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5 flex items-center gap-1 cursor-pointer">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              <span>When needed by? *</span>
                            </label>
                            <input
                              type="date"
                              value={editNeededByValue}
                              onChange={(e) => setEditNeededByValue(e.target.value)}
                              onClick={(e) => e.currentTarget.showPicker?.()}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-amber-500/50 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [color-scheme:dark]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                              Approved By
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editApprovedByValue}
                                onChange={(e) => setEditApprovedByValue(e.target.value)}
                                className="flex-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                                placeholder="Approved By"
                              />
                              <button
                                type="button"
                                onClick={() => saveEditingHeader(co.id)}
                                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold">
                            {co.changeOrderNumber}
                          </span>
                          <h4 className="text-sm font-bold text-white">{co.title}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(
                              co.status
                            )}`}
                          >
                            {co.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => startEditingHeader(co)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Order Title, Reason & Needed By Date"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        {co.reason && <span>Scope: {co.reason}</span>}
                        <span>•</span>
                        <span>Created by {co.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(co.createdAt).toLocaleDateString()}</span>
                        {trackNum && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
                              <Truck className="w-3 h-3 text-sky-400" />
                              Tracking #: {trackNum}
                            </span>
                          </>
                        )}
                        {co.neededByDate && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              Needed By: {co.neededByDate}
                            </span>
                          </>
                        )}
                        {co.approvedBy && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">
                              Approved by: {co.approvedBy}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Acquisition Portal Status Badge & Milestones */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isShipped
                              ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                              : isArrived
                              ? 'bg-teal-950/80 text-teal-300 border-teal-500/40'
                              : isOrdered
                              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          <Package className="w-3 h-3 text-emerald-400" />
                          <span>
                            Acquisition Portal:{' '}
                            {isShipped
                              ? 'Shipped'
                              : isArrived
                              ? 'Arrived to Warehouse'
                              : isOrdered
                              ? 'Ordered'
                              : 'In Intake Queue'}
                          </span>
                          {trackNum && (
                            <span className="inline-flex items-center gap-1 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-[10px] text-sky-300 border border-sky-500/40">
                              <Truck className="w-3 h-3 text-sky-400" />
                              <span>Track: {trackNum}</span>
                            </span>
                          )}
                        </span>
                        {neededBy && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>Needed by: {neededBy}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Controls & Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={co.status}
                        onChange={(e) =>
                          handleUpdateChangeOrderStatus(
                            co.id,
                            e.target.value as ChangeOrderStatus
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        {CHANGE_ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            Status: {st}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => openAddItemToExistingCO(co)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Catalog Items
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChangeOrder(co.id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors cursor-pointer"
                        title="Delete Supplemental Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedIds((prev) => ({ ...prev, [co.id]: !prev[co.id] }))
                        }
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 cursor-pointer"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Assigned Integrator Partner / Installers & Field Tech on Each Order */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-900">
                      <IntegratorPartnerSelector
                        assignedPartners={orderPartners}
                        projectName={project.propertyName}
                        label="Integrator Partner / Installers:"
                        onChange={(updatedPartners) =>
                          handleUpdateOrderPartnersAndTech(
                            co.id,
                            updatedPartners,
                            orderFieldTech
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <span className="text-slate-500 text-xs">Field Tech:</span>
                      <select
                        value={orderFieldTech}
                        onChange={(e) =>
                          handleUpdateOrderPartnersAndTech(
                            co.id,
                            orderPartners,
                            e.target.value as FieldTechName
                          )
                        }
                        className="font-bold text-sky-900 bg-transparent focus:outline-none cursor-pointer text-xs"
                      >
                        {AVAILABLE_FIELD_TECHS.map((tech) => (
                          <option key={tech} value={tech}>
                            {tech}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Order Line Items Table */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-2 px-3">Catalog Type</th>
                            <th className="py-2 px-3">Product / SKU</th>
                            <th className="py-2 px-3">Location / Scope</th>
                            <th className="py-2 px-3 text-center">Installed / Total Qty</th>
                            <th className="py-2 px-3 text-center">Total Qty</th>
                            <th className="py-2 px-3 text-right">Unit Price</th>
                            <th className="py-2 px-3 text-right">Line Subtotal</th>
                            <th className="py-2 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                          {(co.items || []).map((item) => {
                            const isHw = item.productType === 'Hardware';
                            const qty = Math.max(0, Number(item.quantity) || 0);
                            const installed = Math.max(0, Number(item.installedCount) || 0);
                            const pct =
                              qty > 0 ? Math.min(100, Math.round((installed / qty) * 100)) : 0;

                            return (
                              <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-3 align-middle">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      isHw
                                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                        : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                    }`}
                                  >
                                    {isHw ? (
                                      <Package className="w-3 h-3" />
                                    ) : (
                                      <Cloud className="w-3 h-3" />
                                    )}
                                    {item.productType}
                                  </span>
                                </td>

                                <td className="py-3 px-3 align-middle">
                                  <div className="font-bold text-white">{item.name}</div>
                                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-indigo-300">{item.sku}</span>
                                    <span>•</span>
                                    <span>{item.manufacturer}</span>
                                    <span>•</span>
                                    <span>{item.category}</span>
                                    {(item.trackingNumber || trackNum) && (
                                      <>
                                        <span>•</span>
                                        <span className="inline-flex items-center gap-1 font-mono text-sky-400 bg-sky-950/70 border border-sky-500/30 px-1.5 py-0.2 rounded text-[10px]">
                                          <Truck className="w-2.5 h-2.5 text-sky-400" />
                                          Track: {item.trackingNumber || trackNum}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {isHw && (
                                    <div className="mt-1.5 space-y-1.5">
                                      {item.lockFinishConfig ? (
                                        <div className="inline-flex flex-wrap items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-white">
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
                                          <span className="font-semibold">
                                            {getLockFinishSummaryTag(item.lockFinishConfig)}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setExpandedFinishItemIds((prev) => ({
                                                ...prev,
                                                [item.id]: !prev[item.id],
                                              }))
                                            }
                                            className="px-1.5 py-0.2 rounded-full bg-slate-800 text-sky-300 font-bold cursor-pointer"
                                          >
                                            {expandedFinishItemIds[item.id] ? 'Hide' : 'Options'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setFinishModalTarget({
                                                mode: 'existing',
                                                coId: co.id,
                                                item,
                                              })
                                            }
                                            className="text-amber-300 hover:text-white font-bold underline cursor-pointer"
                                          >
                                            ✎ Edit
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setFinishModalTarget({
                                              mode: 'existing',
                                              coId: co.id,
                                              item,
                                            })
                                          }
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                                        >
                                          <span>
                                            {isLockBOMItem(item)
                                              ? '🎨 + Set Lock Finish Options'
                                              : '🎨 + Finish / Hardware Options'}
                                          </span>
                                        </button>
                                      )}

                                      {item.lockFinishConfig && expandedFinishItemIds[item.id] && (
                                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 space-y-0.5">
                                          {formatFullFinishDetailsLines(
                                            item.lockFinishConfig,
                                            item
                                          ).map((line, lIdx) => (
                                            <div key={lIdx}>{line}</div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td className="py-3 px-3 align-middle">
                                  <input
                                    type="text"
                                    value={item.location || ''}
                                    onChange={(e) =>
                                      handleUpdateLineItem(co.id, item.id, (prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                      }))
                                    }
                                    className="w-full max-w-[180px] px-2 py-1 rounded bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 focus:outline-none"
                                  />
                                </td>

                                {/* Installed / Activated Counter */}
                                <td className="py-3 px-3 align-middle">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateLineItem(co.id, item.id, (prev) => ({
                                            ...prev,
                                            installedCount: Math.max(
                                              0,
                                              (Number(prev.installedCount) || 0) - 1
                                            ),
                                          }))
                                        }
                                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
                                        title="Decrease installed count by 1"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>

                                      <input
                                        type="number"
                                        min={0}
                                        value={installed}
                                        onChange={(e) => {
                                          const val = Math.max(
                                            0,
                                            parseInt(e.target.value, 10) || 0
                                          );
                                          handleUpdateLineItem(co.id, item.id, (prev) => ({
                                            ...prev,
                                            installedCount: val,
                                          }));
                                        }}
                                        className="w-14 text-center py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-emerald-400"
                                      />

                                      <span className="text-slate-500 font-mono">/ {qty}</span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateLineItem(co.id, item.id, (prev) => ({
                                            ...prev,
                                            installedCount: (Number(prev.installedCount) || 0) + 1,
                                          }))
                                        }
                                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
                                        title="Increase installed count by 1"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateLineItem(co.id, item.id, (prev) => ({
                                            ...prev,
                                            installedCount: prev.quantity,
                                          }))
                                        }
                                        className="px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer"
                                        title="Mark all installed/activated"
                                      >
                                        All
                                      </button>
                                    </div>
                                    <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500 transition-all"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Total Quantity Stepper */}
                                <td className="py-3 px-3 align-middle text-center">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateLineItem(co.id, item.id, (prev) => ({
                                          ...prev,
                                          quantity: Math.max(1, (Number(prev.quantity) || 1) - 1),
                                        }))
                                      }
                                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 cursor-pointer"
                                    >
                                      <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <input
                                      type="number"
                                      min={1}
                                      value={qty}
                                      onChange={(e) => {
                                        const val = Math.max(
                                          1,
                                          parseInt(e.target.value, 10) || 1
                                        );
                                        handleUpdateLineItem(co.id, item.id, (prev) => ({
                                          ...prev,
                                          quantity: val,
                                        }));
                                      }}
                                      className="w-12 text-center py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateLineItem(co.id, item.id, (prev) => ({
                                          ...prev,
                                          quantity: (Number(prev.quantity) || 0) + 1,
                                        }))
                                      }
                                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 cursor-pointer"
                                    >
                                      <Plus className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </td>

                                {/* Unit Price */}
                                <td className="py-3 px-3 align-middle text-right font-mono">
                                  <div className="inline-flex items-center gap-1 justify-end">
                                    <span className="text-slate-400">$</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step="0.01"
                                      value={item.unitPrice}
                                      onChange={(e) => {
                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                        handleUpdateLineItem(co.id, item.id, (prev) => ({
                                          ...prev,
                                          unitPrice: val,
                                        }));
                                      }}
                                      className="w-20 text-right py-0.5 px-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                                    />
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {item.billingType}
                                  </div>
                                </td>

                                {/* Subtotal */}
                                <td className="py-3 px-3 align-middle text-right font-mono font-bold text-emerald-400">
                                  ${(qty * (Number(item.unitPrice) || 0)).toLocaleString()}
                                  {item.billingType !== 'One-Time' && (
                                    <span className="text-[10px] text-sky-400 block font-normal">
                                      /month
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-2 align-middle text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLineItem(co.id, item.id)}
                                    className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Remove item from Supplemental Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Footer Totals */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {hwItems.length} Hardware item(s)
                        </span>{' '}
                        •{' '}
                        <span className="font-semibold text-slate-300">
                          {swItems.length} Software/SaaS item(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-slate-300">
                          One-Time Hardware:{' '}
                          <strong className="text-emerald-400">
                            ${coHwTotal.toLocaleString()}
                          </strong>
                        </span>
                        <span className="text-slate-300">
                          Recurring Software:{' '}
                          <strong className="text-sky-400">
                            +${coSwMonthly.toLocaleString()}/mo
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Lock Finish & Hardware Options Modal for Staged or Existing Change Order Line Items */}
      {finishModalTarget && (
        <LockFinishModal
          item={{
            id: finishModalTarget.item.id,
            name: finishModalTarget.item.name,
            model: finishModalTarget.item.sku,
            category: finishModalTarget.item.bomCategory || 'Smart Access Control',
            location: finishModalTarget.item.location || 'Property-Wide',
            quantity: Math.max(1, Number(finishModalTarget.item.quantity) || 1),
            installedCount: Number(finishModalTarget.item.installedCount) || 0,
            unitPrice: Number(finishModalTarget.item.unitPrice) || 0,
            lockFinishConfig: finishModalTarget.item.lockFinishConfig,
          }}
          isOpen={Boolean(finishModalTarget)}
          onClose={() => setFinishModalTarget(null)}
          onSave={(_itemId, config) => {
            if (finishModalTarget.mode === 'staged') {
              handleUpdateStagedItem(finishModalTarget.item.id, (prev) => ({
                ...prev,
                lockFinishConfig: config,
              }));
            } else if (finishModalTarget.mode === 'existing' && finishModalTarget.coId) {
              handleUpdateLineItem(
                finishModalTarget.coId,
                finishModalTarget.item.id,
                (prev) => ({
                  ...prev,
                  lockFinishConfig: config,
                })
              );
            }
            setFinishModalTarget(null);
          }}
        />
      )}
    </div>
  );
};
