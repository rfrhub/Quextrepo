import React, { useState, useMemo } from 'react';
import {
  OperationProject,
  ChangeOrderRecord,
  ChangeOrderLineItem,
  ChangeOrderStatus,
  BOMCategory,
} from '../types';
import {
  QUEUXT_HARDWARE_CATALOG,
  QUEUXT_SOFTWARE_CATALOG,
  MYQUEXT_FULL_PRODUCT_CATALOG,
} from '../data/catalogData';
import {
  FilePlus2,
  Package,
  Cloud,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Edit3,
  Check,
  Filter,
  Tag,
  FileText,
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

  // 1. Hardware Catalog items
  for (const hw of QUEUXT_HARDWARE_CATALOG) {
    map.set(hw.sku, {
      id: hw.id,
      sku: hw.sku,
      name: hw.name,
      productType: 'Hardware',
      category: hw.category,
      bomCategory: hw.category,
      manufacturer: hw.manufacturer || 'Quext',
      unitPrice: hw.unitPrice,
      unitCost: hw.unitCost,
      billingType: 'One-Time',
      description: hw.description,
      typicalScope: hw.typicalScope || 'Property Deployment Scope',
    });
  }

  // 2. Software Catalog items
  for (const sw of QUEUXT_SOFTWARE_CATALOG) {
    map.set(sw.sku, {
      id: sw.id,
      sku: sw.sku,
      name: sw.name,
      productType: 'Software',
      category: sw.category,
      bomCategory: sw.bomCategory,
      manufacturer: sw.brandName || 'Quext Software',
      unitPrice: sw.sellPrice,
      unitCost: sw.cost,
      billingType: sw.isBilledPerUnit ? 'Per Unit / Month' : 'Per Property / Month',
      description: sw.description,
      typicalScope: sw.isBilledPerUnit ? 'All Residential Units (Monthly SaaS)' : 'Property-Wide Subscription',
    });
  }

  // 3. Ensure any additional items from MYQUEXT_FULL_PRODUCT_CATALOG are included
  for (const fullItem of MYQUEXT_FULL_PRODUCT_CATALOG) {
    if (!map.has(fullItem.sku)) {
      const isSw = fullItem.pricingModel === 'SaaS';
      map.set(fullItem.sku, {
        id: fullItem.id,
        sku: fullItem.sku,
        name: fullItem.name,
        productType: isSw ? 'Software' : 'Hardware',
        category: fullItem.category,
        bomCategory: fullItem.bomCategory,
        manufacturer: fullItem.brandName || 'Quext',
        unitPrice: fullItem.sellPrice,
        unitCost: fullItem.cost,
        billingType: isSw
          ? fullItem.isBilledPerUnit
            ? 'Per Unit / Month'
            : 'Per Property / Month'
          : 'One-Time',
        description: fullItem.description,
        typicalScope: isSw
          ? fullItem.isBilledPerUnit
            ? 'All Residential Units (Monthly SaaS)'
            : 'Property-Wide Subscription'
          : 'Property Deployment Scope',
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

  // Builder Modal / Drawer state for creating a new Change Order or adding items to an existing Change Order
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [targetChangeOrderId, setTargetChangeOrderId] = useState<string | null>(null); // null = creating new CO; string = adding items to existing CO

  // New Change Order metadata form state
  const [coTitle, setCoTitle] = useState('');
  const [coReason, setCoReason] = useState('');
  const [coStatus, setCoStatus] = useState<ChangeOrderStatus>('Approved');
  const [coApprovedBy, setCoApprovedBy] = useState('');
  const [coNotes, setCoNotes] = useState('');
  const [stagedItems, setStagedItems] = useState<ChangeOrderLineItem[]>([]);

  // Product Catalog Picker filters
  const [catalogTab, setCatalogTab] = useState<'ALL' | 'Hardware' | 'Software'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick-configure state for selected catalog item before adding to staged list
  const [configuringEntry, setConfiguringEntry] = useState<UnifiedCatalogEntry | null>(null);
  const [configQty, setConfigQty] = useState<number>(1);
  const [configSpares, setConfigSpares] = useState<number>(0);
  const [configPrice, setConfigPrice] = useState<number>(0);
  const [configLocation, setConfigLocation] = useState<string>('');
  const [configNotes, setConfigNotes] = useState<string>('');

  // Expanded Change Order cards
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});

  // Inline editing for existing Change Order metadata
  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editReasonValue, setEditReasonValue] = useState('');
  const [editApprovedByValue, setEditApprovedByValue] = useState('');

  // Available categories & brands based on catalogTab
  const availableCategories = useMemo(() => {
    const base =
      catalogTab === 'ALL'
        ? UNIFIED_CHANGE_ORDER_CATALOG
        : UNIFIED_CHANGE_ORDER_CATALOG.filter((item) => item.productType === catalogTab);
    return Array.from(new Set(base.map((i) => i.category))).sort();
  }, [catalogTab]);

  const availableBrands = useMemo(() => {
    const base =
      catalogTab === 'ALL'
        ? UNIFIED_CHANGE_ORDER_CATALOG
        : UNIFIED_CHANGE_ORDER_CATALOG.filter((item) => item.productType === catalogTab);
    return Array.from(new Set(base.map((i) => i.manufacturer))).sort();
  }, [catalogTab]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return UNIFIED_CHANGE_ORDER_CATALOG.filter((entry) => {
      if (catalogTab !== 'ALL' && entry.productType !== catalogTab) return false;
      if (selectedCategory !== 'ALL' && entry.category !== selectedCategory) return false;
      if (selectedBrand !== 'ALL' && entry.manufacturer !== selectedBrand) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.sku.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.manufacturer.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q)
      );
    });
  }, [catalogTab, selectedCategory, selectedBrand, searchQuery]);

  // Aggregate summary metrics across all Change Orders (kept strictly separate from Original BOM)
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
    setCoTitle(`Change Order #${nextNum} — Additional Scope`);
    setCoReason('');
    setCoStatus('Approved');
    setCoApprovedBy('');
    setCoNotes('');
    setStagedItems([]);
    setConfiguringEntry(null);
    setIsBuilderOpen(true);
  };

  const openAddItemToExistingCO = (co: ChangeOrderRecord) => {
    setTargetChangeOrderId(co.id);
    setCoTitle(co.title);
    setStagedItems([]);
    setConfiguringEntry(null);
    setIsBuilderOpen(true);
  };

  const handleSelectCatalogProduct = (entry: UnifiedCatalogEntry) => {
    setConfiguringEntry(entry);
    const defaultQty =
      entry.productType === 'Software' && entry.billingType === 'Per Unit / Month'
        ? project.unitsCount || 1
        : 1;
    setConfigQty(defaultQty);
    setConfigSpares(0);
    setConfigPrice(entry.unitPrice);
    setConfigLocation(entry.typicalScope || 'Change Order Scope');
    setConfigNotes('');
  };

  const handleAddConfiguredItemToStaged = () => {
    if (!configuringEntry) return;
    const newItem: ChangeOrderLineItem = {
      id: `co-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: configuringEntry.id,
      sku: configuringEntry.sku,
      name: configuringEntry.name,
      productType: configuringEntry.productType,
      category: configuringEntry.category,
      bomCategory: configuringEntry.bomCategory,
      manufacturer: configuringEntry.manufacturer,
      quantity: Math.max(1, Number(configQty) || 1),
      installedCount: 0,
      sparesCount: configuringEntry.productType === 'Hardware' ? Math.max(0, Number(configSpares) || 0) : 0,
      unitPrice: Math.max(0, Number(configPrice) || 0),
      billingType: configuringEntry.billingType,
      location: configLocation.trim() || configuringEntry.typicalScope || 'Change Order Scope',
      description: configuringEntry.description,
      notes: configNotes.trim() || undefined,
    };

    setStagedItems((prev) => [...prev, newItem]);
    setConfiguringEntry(null);
  };

  const handleRemoveStagedItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveBuilder = () => {
    if (stagedItems.length === 0) return;

    const nowIso = new Date().toISOString();

    if (targetChangeOrderId) {
      // Append staged items to existing Change Order
      const updatedCOs = changeOrders.map((co) => {
        if (co.id !== targetChangeOrderId) return co;
        return {
          ...co,
          items: [...(co.items || []), ...stagedItems],
          updatedAt: nowIso,
        };
      });

      onUpdateProject({
        ...project,
        changeOrders: updatedCOs,
        lastUpdated: nowIso,
      });
    } else {
      // Create new Change Order record
      const coIndex = changeOrders.length + 1;
      const coNumber = `CO-${new Date().getFullYear()}-${String(coIndex).padStart(3, '0')}`;
      const newRecord: ChangeOrderRecord = {
        id: `co-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        changeOrderNumber: coNumber,
        projectId: project.id,
        propertyName: project.propertyName,
        title: coTitle.trim() || `Change Order #${coIndex}`,
        reason: coReason.trim() || 'Additional hardware/software scope requested outside original BOM',
        status: coStatus,
        createdBy: currentUserName,
        createdAt: nowIso,
        updatedAt: nowIso,
        approvedBy: coApprovedBy.trim() || undefined,
        approvedAt:
          coStatus === 'Approved' || coStatus === 'In Fulfillment / Installed' ? nowIso : undefined,
        items: stagedItems,
        notes: coNotes.trim() || undefined,
      };

      onUpdateProject({
        ...project,
        changeOrders: [newRecord, ...changeOrders],
        lastUpdated: nowIso,
      });
    }

    setIsBuilderOpen(false);
    setTargetChangeOrderId(null);
    setStagedItems([]);
    setConfiguringEntry(null);
  };

  const handleUpdateChangeOrderStatus = (coId: string, nextStatus: ChangeOrderStatus) => {
    const nowIso = new Date().toISOString();
    const updatedCOs = changeOrders.map((co) => {
      if (co.id !== coId) return co;
      return {
        ...co,
        status: nextStatus,
        approvedAt:
          (nextStatus === 'Approved' || nextStatus === 'In Fulfillment / Installed') && !co.approvedAt
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
              Change Orders & Supplemental Catalog Scope
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
            Add supplemental Hardware and Software/SaaS items from the official Quext Product Catalog outside of the baseline Bill of Materials. Original BOM line items ({project.bomItems?.length || 0} items) remain untouched.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={openNewChangeOrderBuilder}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + New Change Order (Hardware & Software Catalog)
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Change Orders
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
              CO Hardware Installed / Total
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
              CO Software Activated / Total
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
              Change Order Scope Value
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

      {/* Change Order Builder Panel (Create New CO or Add Items to Existing CO) */}
      {isBuilderOpen && (
        <div className="p-5 sm:p-6 bg-indigo-950/20 border-b border-indigo-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {targetChangeOrderId
                    ? `Add Catalog Items to ${coTitle}`
                    : 'Create New Change Order (Separate from Original BOM)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Select items from both the Quext Hardware Catalog and Software/SaaS Catalog below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsBuilderOpen(false);
                setConfiguringEntry(null);
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata inputs when creating a new Change Order */}
          {!targetChangeOrderId && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Change Order Title *
                </label>
                <input
                  type="text"
                  value={coTitle}
                  onChange={(e) => setCoTitle(e.target.value)}
                  placeholder="e.g., CO #1 — Additional Common Area Readers & Video Intercom Licenses"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Change Order Status
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

              <div className="md:col-span-3">
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

          {/* Product Catalog Browser (Hardware + Software Catalogs) */}
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
                  Software & SaaS Catalog (
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

            {/* Catalog Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.map((entry) => {
                const isSelected = configuringEntry?.sku === entry.sku;
                const isHardware = entry.productType === 'Hardware';
                return (
                  <div
                    key={entry.sku}
                    onClick={() => handleSelectCatalogProduct(entry)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-400 ring-1 ring-indigo-400/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
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
                        <span className="text-[10px] font-mono text-slate-400">{entry.sku}</span>
                      </div>
                      <p className="text-xs font-bold text-white leading-snug">{entry.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {entry.manufacturer} • {entry.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">
                          ${entry.unitPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          {entry.billingType === 'One-Time'
                            ? 'one-time'
                            : entry.billingType === 'Per Unit / Month'
                            ? '/unit/mo'
                            : '/prop/mo'}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        Select
                      </span>
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

            {/* Selected Catalog Product Configuration Bar */}
            {configuringEntry && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        configuringEntry.productType === 'Hardware'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {configuringEntry.productType} Catalog
                    </span>
                    <span className="text-xs font-bold text-white">{configuringEntry.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({configuringEntry.sku})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfiguringEntry(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      {configuringEntry.productType === 'Hardware' ? 'Quantity *' : 'License Qty *'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={configQty}
                      onChange={(e) => setConfigQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>

                  {configuringEntry.productType === 'Hardware' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Attic Stock / Spares
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={configSpares}
                        onChange={(e) =>
                          setConfigSpares(Math.max(0, parseInt(e.target.value, 10) || 0))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Unit Price ({configuringEntry.billingType})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={configPrice}
                      onChange={(e) => setConfigPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>

                  <div className={configuringEntry.productType === 'Hardware' ? '' : 'sm:col-span-2'}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Deployment Location / Scope
                    </label>
                    <input
                      type="text"
                      value={configLocation}
                      onChange={(e) => setConfigLocation(e.target.value)}
                      placeholder="e.g., Clubhouse, Pool Gate, All Units"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddConfiguredItemToStaged}
                      className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Change Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Staged Change Order Line Items Preview */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Staged Change Order Items ({stagedItems.length})
              </span>
              {stagedItems.length > 0 && (
                <span className="text-xs text-slate-400">
                  Ready to save outside of baseline BOM
                </span>
              )}
            </div>

            {stagedItems.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                Click any Hardware or Software product above to stage it for this Change Order.
              </div>
            ) : (
              <div className="space-y-2">
                {stagedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.productType === 'Hardware'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {item.productType}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">
                          {item.name}{' '}
                          <span className="text-[10px] font-mono text-slate-400">({item.sku})</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.category} • Location: {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono text-xs">
                        <span className="text-white font-bold">{item.quantity}</span>
                        <span className="text-slate-400"> × ${item.unitPrice.toLocaleString()}</span>
                        <span className="text-emerald-400 font-bold ml-2">
                          = ${(item.quantity * item.unitPrice).toLocaleString()}
                          {item.billingType !== 'One-Time' ? '/mo' : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStagedItem(item.id)}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsBuilderOpen(false);
                  setConfiguringEntry(null);
                  setStagedItems([]);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
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
                  ? `Add ${stagedItems.length} Item(s) to Change Order`
                  : `Save Change Order (${stagedItems.length} Item${stagedItems.length === 1 ? '' : 's'})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Change Orders */}
      <div className="p-5 sm:p-6 space-y-4">
        {changeOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                No Change Orders Logged for {project.propertyName}
              </p>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                Need to add extra hardware or software licenses after the initial BOM was finalized? Create a Change Order to select items from the Quext Hardware & Software Catalogs while keeping the original BOM separate.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={openNewChangeOrderBuilder}
                className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create First Change Order
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

            return (
              <div
                key={co.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-md"
              >
                {/* Change Order Card Header */}
                <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    {editingHeaderId === co.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          className="px-2.5 py-1.5 rounded bg-slate-950 border border-indigo-500/50 text-xs text-white font-bold"
                          placeholder="Change Order Title"
                        />
                        <input
                          type="text"
                          value={editReasonValue}
                          onChange={(e) => setEditReasonValue(e.target.value)}
                          className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder="Reason / Scope Justification"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editApprovedByValue}
                            onChange={(e) => setEditApprovedByValue(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                            placeholder="Approved By"
                          />
                          <button
                            type="button"
                            onClick={() => saveEditingHeader(co.id)}
                            className="px-2.5 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save
                          </button>
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
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Change Order Title & Reason"
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
                      {co.approvedBy && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">
                            Approved by: {co.approvedBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Controls & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={co.status}
                      onChange={(e) =>
                        handleUpdateChangeOrderStatus(co.id, e.target.value as ChangeOrderStatus)
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
                      Add Catalog Item
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteChangeOrder(co.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors"
                      title="Delete Change Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedIds((prev) => ({ ...prev, [co.id]: !prev[co.id] }))
                      }
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Order Line Items Table */}
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
                            const pct = qty > 0 ? Math.min(100, Math.round((installed / qty) * 100)) : 0;

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
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    <span className="font-mono text-indigo-300">{item.sku}</span>
                                    <span>•</span>
                                    <span>{item.manufacturer}</span>
                                    <span>•</span>
                                    <span>{item.category}</span>
                                  </div>
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
                                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
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
                                        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
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
                                  <div className="text-[10px] text-slate-500">{item.billingType}</div>
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
                                    className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                                    title="Remove item from Change Order"
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

                    {/* Change Order Footer Totals */}
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
    </div>
  );
};
