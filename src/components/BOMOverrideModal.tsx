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
  Info
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Selected item configuration
  const [selectedProduct, setSelectedProduct] = useState<HardwareCatalogItem | null>(null);
  const [overrideQuantity, setOverrideQuantity] = useState<number>(10);
  const [overrideSpares, setOverrideSpares] = useState<number>(1);
  const [overrideLocation, setOverrideLocation] = useState<string>('All Residential Units');
  const [overrideUnitPrice, setOverrideUnitPrice] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>('Customer change order: Scope addition approved by property owner');

  // Category list
  const categories = useMemo(() => {
    const list = Array.from(new Set(QUEUXT_HARDWARE_CATALOG.map((h) => h.category)));
    return ['All', ...list];
  }, []);

  // Brand list
  const brands = useMemo(() => {
    const list = Array.from(new Set(QUEUXT_HARDWARE_CATALOG.map((h) => h.manufacturer)));
    return ['All', ...list];
  }, []);

  // Filtered hardware items
  const filteredProducts = useMemo(() => {
    return QUEUXT_HARDWARE_CATALOG.filter((h) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.sku.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.manufacturer.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || h.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || h.manufacturer === selectedBrand;

      return matchesSearch && matchesCat && matchesBrand;
    });
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Handle choosing a product
  const handleSelectProduct = (prod: HardwareCatalogItem) => {
    setSelectedProduct(prod);
    setOverrideUnitPrice(prod.unitPrice || prod.unitCost || 100);
    if (prod.typicalScope === 'Per Residential Unit') {
      setOverrideLocation('All Residential Units');
    } else if (prod.typicalScope === 'Central Infrastructure / Riser') {
      setOverrideLocation('Clubhouse Rooftop & Riser Closets');
    } else {
      setOverrideLocation('Common Area Amenities & Leasing Office');
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
      category: selectedProduct.category,
      quantity: overrideQuantity,
      installedCount: 0,
      sparesCount: overrideSpares,
      unitPrice: overrideUnitPrice,
      location: overrideLocation.trim() || 'Project Site',
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
          locationCompleted: overrideLocation.trim() || 'Project Site',
          statusCheck: 'Verified & Online',
          notes: `⚡ BOM OVERRIDE: Added directly from myquext.com Product Catalog (${selectedProduct.manufacturer} ${selectedProduct.name}). Reason: ${overrideReason}`,
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
            {/* Search and Brand Filters */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search hardware by name, SKU, or manufacturer (Schlage, Quext, Eagle Eye, Resideo)..."
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
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Items Selection List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Select a product from the official catalog ({filteredProducts.length} available)</span>
                {selectedProduct && (
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Selected: {selectedProduct.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      data-catalog-id={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                            {prod.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="font-bold text-slate-900">${prod.unitPrice} retail</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-mono">Cost: ${prod.unitCost}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sky-700 font-medium">{prod.manufacturer}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{prod.category}</span>
                        <span className={`font-bold ${isSelected ? 'text-amber-800' : 'text-slate-600'}`}>
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
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Configure Line Item Scope for {project.propertyName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Override Quantity *
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
                      Spares Allocated
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={overrideSpares}
                      onChange={(e) => setOverrideSpares(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Unit Price ($) *
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
                    Designated Installation Location *
                  </label>
                  <input
                    type="text"
                    value={overrideLocation}
                    onChange={(e) => setOverrideLocation(e.target.value)}
                    placeholder="e.g. All Residential Units, Clubhouse & Amenities, Gate Entry..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                    required
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">Quick suggestions:</span>
                    {['All Residential Units', 'Clubhouse & Leasing Office', 'Amenity Gates & Pool', 'Building Risers & Exterior'].map((loc) => (
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
                        Hardware Line Item
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans italic">
                        Not in original quote
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-900">
                        <strong>{selectedProduct.name}</strong> ({selectedProduct.sku})
                      </td>
                      <td className="py-3 px-4 text-amber-700 font-sans font-bold text-right">
                        +{overrideQuantity} units (+{overrideSpares} spares)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        Installation Area
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
