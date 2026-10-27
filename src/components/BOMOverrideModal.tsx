import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  Plus,
  Layers,
  ArrowRight,
  RotateCcw,
  Building,
  Key,
  Thermometer,
  Radio,
  Wifi,
  Video,
  PhoneCall,
  Wrench,
  Cpu,
  SlidersHorizontal,
  Info,
  Cloud,
  Package
} from 'lucide-react';
import {
  OperationProject,
  Quote,
  BOMItem,
  BOMCategory,
  HardwareCatalogItem,
} from '../types';
import {
  QUEUXT_HARDWARE_CATALOG,
  MYQUEXT_FULL_PRODUCT_CATALOG,
} from '../data/catalogData';

export interface UnifiedCatalogItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  bomCategory: BOMCategory;
  productType: 'Hardware' | 'Software';
  manufacturer: string;
  unitCost: number;
  unitPrice: number;
  description: string;
  billingType?: string;
  isPopularQuickAdd?: boolean;
  specifications?: string[];
  typicalScope?: string;
  isBilledPerUnit?: boolean;
}

const UNIFIED_OVERRIDE_CATALOG: UnifiedCatalogItem[] = [
  ...QUEUXT_HARDWARE_CATALOG.map((h) => ({
    id: h.id,
    sku: h.sku,
    name: h.name,
    category: h.category,
    bomCategory: h.category,
    productType: 'Hardware' as const,
    manufacturer: h.manufacturer,
    unitCost: h.unitCost,
    unitPrice: h.unitPrice,
    description: h.description,
    typicalScope: h.typicalScope,
    isPopularQuickAdd: h.isPopularQuickAdd,
    specifications: h.specifications,
  })),
  ...MYQUEXT_FULL_PRODUCT_CATALOG
    .filter((p) => p.pricingModel === 'SaaS')
    .map((s) => ({
      id: s.id,
      sku: s.sku || s.id,
      name: s.name,
      category: 'Software & SaaS Licenses',
      bomCategory: s.bomCategory || 'Common Area & Utilities',
      productType: 'Software' as const,
      manufacturer: s.brandName || 'Quext',
      unitCost: s.cost || 0,
      unitPrice: s.sellPrice || s.msrp || 2.0,
      description: s.description || `${s.name} cloud license and software subscription service.`,
      typicalScope: s.isBilledPerUnit ? ('Per Residential Unit' as const) : ('Per Site Package' as const),
      billingType: s.isBilledPerUnit ? 'Per Unit / Month' : 'Per Property / Month',
      isBilledPerUnit: s.isBilledPerUnit,
      isPopularQuickAdd: true,
      specifications: s.specifications || [`Vendor: ${s.brandName}`, `Pricing: SaaS Monthly`],
    })),
];

interface BOMOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: OperationProject;
  quotesList?: Quote[];
  currentBOMItems: BOMItem[];
  onConfirmOverride: (newItem: BOMItem, overrideReason: string) => void;
}

export const BOMOverrideModal: React.FC<BOMOverrideModalProps> = ({
  isOpen,
  onClose,
  project,
  quotesList = [],
  currentBOMItems,
  onConfirmOverride,
}) => {
  if (!isOpen) return null;

  // Step in the modal: 'select' -> 'warning-confirm'
  const [step, setStep] = useState<'select' | 'warning-confirm'>('select');

  // Product search & filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'All' | 'Hardware' | 'Software'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Selected item configuration
  const [selectedProduct, setSelectedProduct] = useState<UnifiedCatalogItem | null>(null);
  const [overrideQuantity, setOverrideQuantity] = useState<number>(10);
  const [overrideSpares, setOverrideSpares] = useState<number>(1);
  const [overrideLocation, setOverrideLocation] = useState<string>('All Residential Units');
  const [overrideUnitPrice, setOverrideUnitPrice] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>('Customer change order: Scope addition approved by property owner');

  // Category list
  const categories = useMemo(() => {
    const list = Array.from(new Set(UNIFIED_OVERRIDE_CATALOG.map((h) => h.category)));
    return ['All', ...list];
  }, []);

  // Brand list
  const brands = useMemo(() => {
    const list = Array.from(new Set(UNIFIED_OVERRIDE_CATALOG.map((h) => h.manufacturer))).sort();
    return ['All', ...list];
  }, []);

  // Filtered catalog items (Hardware + Software)
  const filteredProducts = useMemo(() => {
    return UNIFIED_OVERRIDE_CATALOG.filter((h) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.sku.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.bomCategory.toLowerCase().includes(q) ||
        h.manufacturer.toLowerCase().includes(q) ||
        h.productType.toLowerCase().includes(q);

      const matchesType =
        selectedType === 'All' || h.productType === selectedType;
      const matchesCat =
        selectedCategory === 'All' || h.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All' || h.manufacturer === selectedBrand;

      return matchesSearch && matchesType && matchesCat && matchesBrand;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedBrand]);

  // Handle choosing a product (Hardware or Software)
  const handleSelectProduct = (prod: UnifiedCatalogItem) => {
    setSelectedProduct(prod);
    setOverrideUnitPrice(prod.unitPrice || prod.unitCost || (prod.productType === 'Software' ? 2 : 100));

    if (prod.productType === 'Software') {
      if (prod.isBilledPerUnit || prod.typicalScope === 'Per Residential Unit') {
        setOverrideQuantity(project.unitsCount || 180);
        setOverrideLocation('Software and Services (All Units)');
      } else {
        setOverrideQuantity(1);
        setOverrideLocation('Software and Services (Property License)');
      }
      setOverrideSpares(0);
      setOverrideReason('Customer change order: Added software subscription / cloud license to project contract');
    } else {
      setOverrideQuantity(10);
      setOverrideSpares(1);
      if (prod.typicalScope === 'Per Residential Unit') {
        setOverrideLocation('All Residential Units');
      } else if (prod.typicalScope === 'Central Infrastructure / Riser') {
        setOverrideLocation('Clubhouse Rooftop & Riser Closets');
      } else {
        setOverrideLocation('Common Area Amenities & Leasing Office');
      }
      setOverrideReason('Customer change order: Scope addition approved by property owner');
    }
  };

  // Baseline Quote BOM calculations
  const linkedQuote = useMemo(() => {
    return quotesList.find(
      (q) => q.id === project.quoteId || q.quoteNumber === project.quoteNumber
    );
  }, [quotesList, project.quoteId, project.quoteNumber]);

  const baselineQuoteBOM: BOMItem[] = useMemo(() => {
    if (project.originalQuoteBOM && project.originalQuoteBOM.length > 0) {
      return project.originalQuoteBOM;
    }
    if (linkedQuote?.bomItems && linkedQuote.bomItems.length > 0) {
      return linkedQuote.bomItems;
    }
    return currentBOMItems;
  }, [project.originalQuoteBOM, linkedQuote, currentBOMItems]);

  const quotedTotalDevices = baselineQuoteBOM.reduce((acc, i) => acc + i.quantity, 0);
  const quotedTotalCost = baselineQuoteBOM.reduce((acc, i) => acc + (i.quantity * (i.unitPrice || 0)), 0);

  const currentTotalDevices = currentBOMItems.reduce((acc, i) => acc + i.quantity, 0);
  const currentTotalCost = currentBOMItems.reduce((acc, i) => acc + (i.quantity * (i.unitPrice || 0)), 0);

  const newTotalDevices = currentTotalDevices + overrideQuantity;
  const newTotalCost = currentTotalCost + (overrideQuantity * overrideUnitPrice);

  const deviceVariance = newTotalDevices - quotedTotalDevices;
  const costVariance = newTotalCost - quotedTotalCost;

  const handleProceedToWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setStep('warning-confirm');
  };

  const handleFinalConfirm = () => {
    if (!selectedProduct) return;

    const newItem: BOMItem = {
      id: `bom-override-${Date.now()}`,
      name: selectedProduct.name,
      model: selectedProduct.sku,
      category: selectedProduct.bomCategory,
      quantity: overrideQuantity,
      installedCount: 0,
      sparesCount: overrideSpares,
      unitPrice: overrideUnitPrice,
      location:
        overrideLocation.trim() ||
        (selectedProduct.productType === 'Software' ? 'Software and Services' : 'Project Site'),
      description: selectedProduct.description,
      postItLogs: [
        {
          id: `log-override-${Date.now()}`,
          projectId: project.id,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          installerName: project.assignedPM?.name || 'Project Manager',
          itemId: `bom-override-${Date.now()}`,
          itemName: selectedProduct.name,
          quantityCompleted: 0,
          locationCompleted:
            overrideLocation.trim() ||
            (selectedProduct.productType === 'Software' ? 'Software and Services' : 'Project Site'),
          statusCheck: 'Verified & Online',
          notes: `⚡ BOM OVERRIDE: Added directly from myquext.com Product Catalog (${
            selectedProduct.productType === 'Software' ? 'Software SaaS License' : 'Hardware'
          }: ${selectedProduct.manufacturer} ${selectedProduct.name}). Reason: ${overrideReason}`,
        },
      ],
    };

    onConfirmOverride(newItem, overrideReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  BOM Override: Add Items from Product Catalog
                </h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono font-semibold">
                  PM Override Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {project.propertyName} · Quote #{project.quoteNumber} · Direct integration with myquext.com 85-product catalog
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

        {/* STEP 1: Select Product from Catalog & Configure */}
        {step === 'select' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Catalog Type Switcher: All | Hardware | Software */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('All');
                    if (selectedCategory === 'Software & SaaS Licenses') setSelectedCategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === 'All'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Products ({UNIFIED_OVERRIDE_CATALOG.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('Hardware');
                    if (selectedCategory === 'Software & SaaS Licenses') setSelectedCategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === 'Hardware'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hardware Devices (67)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('Software');
                    setSelectedCategory('All');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === 'Software'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Software Catalog (18)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                {selectedType === 'Software'
                  ? '18 Software SaaS items'
                  : selectedType === 'Hardware'
                  ? '67 Hardware items'
                  : '85 Total catalog items'}
              </div>
            </div>

            {/* Search and Brand Filters */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search hardware & software by name, SKU, manufacturer, or license (Brivo, Schlage, Quext, ButterflyMX)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Brands ({brands.length - 1})</option>
                    {brands.filter((b) => b !== 'All').map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat === 'Software & SaaS Licenses') {
                        setSelectedType('Software');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? cat === 'Software & SaaS Licenses'
                          ? 'bg-purple-600 text-white shadow-2xs font-bold'
                          : 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                        : cat === 'Software & SaaS Licenses'
                        ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'Software & SaaS Licenses' ? '⚡ Software & SaaS' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Items Selection List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Select a product from the official catalog ({filteredProducts.length} available)</span>
                {selectedProduct && (
                  <span
                    className={`font-semibold px-2 py-0.5 rounded border text-[11px] flex items-center gap-1 ${
                      selectedProduct.productType === 'Software'
                        ? 'text-purple-900 bg-purple-50 border-purple-300'
                        : 'text-amber-800 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {selectedProduct.productType === 'Software' && <Cloud className="w-3 h-3 text-purple-600" />}
                    Selected: {selectedProduct.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  const isSoftware = prod.productType === 'Software';
                  return (
                    <div
                      key={prod.id}
                      data-catalog-id={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? isSoftware
                            ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20'
                            : 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                          : isSoftware
                          ? 'bg-purple-50/25 border-purple-200/80 hover:border-purple-400 hover:bg-purple-50/50'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</span>
                          <span
                            className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                              isSoftware
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isSoftware && <Cloud className="w-2.5 h-2.5 text-purple-600" />}
                            {isSoftware ? 'Software SaaS' : prod.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className={`font-bold ${isSoftware ? 'text-purple-900' : 'text-slate-900'}`}>
                            ${prod.unitPrice} {isSoftware ? '/mo' : 'retail'}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-mono text-[10px]">
                            {isSoftware ? prod.billingType || 'Monthly' : `Cost: $${prod.unitCost}`}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sky-700 font-medium text-[10px]">{prod.manufacturer}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 text-[10px]">
                          {isSoftware ? `${prod.bomCategory} (Software)` : prod.category}
                        </span>
                        <span
                          className={`font-bold text-[11px] ${
                            isSelected
                              ? isSoftware
                                ? 'text-purple-800 font-extrabold'
                                : 'text-amber-800'
                              : 'text-slate-600'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : 'Click to select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line Item Configuration Form */}
            {selectedProduct && (
              <form onSubmit={handleProceedToWarning} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Configure Line Item Scope for {project.propertyName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedProduct.productType === 'Software'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {selectedProduct.productType === 'Software' ? 'Software / SaaS License' : 'Hardware Device'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {selectedProduct.productType === 'Software' ? 'License Quantity *' : 'Override Quantity *'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={overrideQuantity}
                      onChange={(e) => setOverrideQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {selectedProduct.productType === 'Software' ? 'Spares (N/A for SaaS)' : 'Spares Allocated'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      disabled={selectedProduct.productType === 'Software'}
                      value={overrideSpares}
                      onChange={(e) => setOverrideSpares(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono ${
                        selectedProduct.productType === 'Software'
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {selectedProduct.productType === 'Software' ? 'Monthly Price ($/mo) *' : 'Unit Price ($) *'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={overrideUnitPrice}
                      onChange={(e) => setOverrideUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Designated Installation / Deployment Location *
                  </label>
                  <input
                    type="text"
                    value={overrideLocation}
                    onChange={(e) => setOverrideLocation(e.target.value)}
                    placeholder="e.g. Software and Services, All Residential Units, Clubhouse & Amenities..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                    required
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">Quick suggestions:</span>
                    {(selectedProduct.productType === 'Software'
                      ? [
                          'Software and Services (All Units)',
                          'Software and Services (Property License)',
                          'Clubhouse & Leasing Admin Portal',
                          'Resident Mobile App & Cloud',
                        ]
                      : [
                          'All Residential Units',
                          'Clubhouse & Leasing Office',
                          'Amenity Gates & Pool',
                          'Building Risers & Exterior',
                        ]
                    ).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setOverrideLocation(loc)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PM Override Justification / Reason *
                  </label>
                  <textarea
                    rows={2}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Provide justification for adding this BOM item (e.g. customer change order, field tech signal extension, architectural layout adjustment)..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>

                {/* Scope Summary Preview */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600 font-medium">Line Item Total Addition:</span>{' '}
                    <strong className="text-slate-900">+{overrideQuantity} units</strong> (+{overrideSpares} spares)
                  </div>
                  <div className="font-mono font-bold text-slate-900">
                    +${(overrideQuantity * overrideUnitPrice).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Check Quote BOM Variance &amp; Proceed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: Warning Message when numbers don't match Quote BOM & Confirmation */}
        {step === 'warning-confirm' && selectedProduct && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Warning Callout Banner */}
            <div className="bg-amber-50 border-2 border-amber-400/80 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 tracking-tight">
                  WARNING: Project Numbers Will Not Match Quote BOM
                </h3>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  This project was officially converted from Quote <strong className="font-mono text-slate-950">#{project.quoteNumber}</strong> with an established baseline contract BOM.
                  Adding this item creates a variance between the contractual sales quote and the active installation Bill of Materials.
                </p>
              </div>
            </div>

            {/* Side-by-side Variance Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>BOM Discrepancy Analysis: Quoted Baseline vs. Overridden Project</span>
                <span className="font-mono text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                  Variance Detected
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-4 font-semibold">Hardware Metric</th>
                      <th className="py-2.5 px-4 font-semibold">Quote BOM Baseline</th>
                      <th className="py-2.5 px-4 font-semibold">Overridden Project BOM</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Variance / Discrepancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        Total Hardware Devices
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {quotedTotalDevices.toLocaleString()} units
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {newTotalDevices.toLocaleString()} units
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-700 text-right">
                        +{deviceVariance.toLocaleString()} units ({(deviceVariance > 0 ? '+' : '') + Math.round((deviceVariance / Math.max(1, quotedTotalDevices)) * 100)}%)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        Total Hardware BOM Value
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        ${quotedTotalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${newTotalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-700 text-right">
                        +${costVariance.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        {selectedProduct.productType === 'Software' ? 'Software SaaS Line Item' : 'Hardware Line Item'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans italic">
                        Not in original quote
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-900">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong>{selectedProduct.name}</strong>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              selectedProduct.productType === 'Software'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {selectedProduct.productType === 'Software' ? 'SaaS License' : selectedProduct.sku}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-amber-700 font-sans font-bold text-right">
                        +{overrideQuantity} {selectedProduct.productType === 'Software' ? 'licenses' : 'units'}
                        {overrideSpares > 0 ? ` (+${overrideSpares} spares)` : ''}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        Deployment Area
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans italic">—</td>
                      <td className="py-3 px-4 font-sans text-slate-700" colSpan={2}>
                        {overrideLocation}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Impact Details Callout */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Automatic Project Updates Upon Confirmation:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>Project Numbers:</strong> Total quoted hardware will immediately increase from{' '}
                  <span className="font-mono font-bold text-slate-900">{currentTotalDevices}</span> to{' '}
                  <span className="font-mono font-bold text-slate-900">{newTotalDevices} units</span>.
                </li>
                <li>
                  <strong>Deployment Tracking:</strong> Real-time installation percentage, field progress, and completion ratios will automatically recalculate.
                </li>
                <li>
                  <strong>SOW Forecaster &amp; Shipping Dock:</strong> Labor hours and incoming shipping allocations will reflect the additional line item.
                </li>
                <li>
                  <strong>Audit Log:</strong> An official PM BOM Override entry will be recorded under project notes with your justification:
                  <div className="mt-1 font-sans italic text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px]">
                    &quot;{overrideReason}&quot;
                  </div>
                </li>
              </ul>
            </div>

            {/* Confirmation Question */}
            <div className="p-4 bg-amber-500/10 border border-amber-300 rounded-xl text-center space-y-1">
              <p className="text-xs font-bold text-slate-900">
                Are you sure you want to confirm this BOM override and update the project&apos;s numbers?
              </p>
              <p className="text-[11px] text-slate-500">
                This change will be permanently applied to project <strong className="text-slate-800">{project.propertyName}</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                ← Back to Edit
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Confirm BOM Override &amp; Update Project Numbers</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
