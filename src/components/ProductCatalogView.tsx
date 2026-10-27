import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Tag,
  DollarSign,
  Cpu,
  Radio,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Server,
  Key,
  Flame,
  Droplets,
  Video,
  PhoneCall,
  Wrench,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Building,
  Check,
  Copy
} from 'lucide-react';
import {
  MYQUEXT_FULL_PRODUCT_CATALOG,
  MyQuextCatalogProduct,
  QUEUXT_HARDWARE_CATALOG,
  QUEUXT_SOFTWARE_CATALOG
} from '../data/catalogData';

export const ProductCatalogView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedPricingModel, setSelectedPricingModel] = useState<string>('All');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'brand'>('name');
  const [detailProduct, setDetailProduct] = useState<MyQuextCatalogProduct | null>(null);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  // Derive unique categories with counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = { All: MYQUEXT_FULL_PRODUCT_CATALOG.length };
    MYQUEXT_FULL_PRODUCT_CATALOG.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Derive unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(MYQUEXT_FULL_PRODUCT_CATALOG.map((p) => p.brandName))).filter(Boolean);
    list.sort((a, b) => a.localeCompare(b));
    return ['All', ...list];
  }, []);

  // Derive unique protocols
  const allProtocols = useMemo(() => {
    const protoSet = new Set<string>();
    MYQUEXT_FULL_PRODUCT_CATALOG.forEach((p) => {
      p.supportedProtocols?.forEach((proto) => protoSet.add(proto));
    });
    return ['All', ...Array.from(protoSet).sort()];
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return MYQUEXT_FULL_PRODUCT_CATALOG.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku?.toLowerCase().includes(query) || false;
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        const matchesBrand = item.brandName.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesProto = item.supportedProtocols?.some((pr) => pr.toLowerCase().includes(query)) || false;
        if (!matchesName && !matchesSku && !matchesDesc && !matchesBrand && !matchesCat && !matchesProto) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'All' && item.brandName !== selectedBrand) {
        return false;
      }

      // Pricing Model
      if (selectedPricingModel !== 'All') {
        if (selectedPricingModel === 'SaaS' && item.pricingModel !== 'SaaS') return false;
        if (selectedPricingModel === 'One-Time' && item.pricingModel !== 'One-Time') return false;
        if (selectedPricingModel === 'Services' && !item.pricingModel.includes('Professional Services')) return false;
      }

      // Protocol
      if (selectedProtocol !== 'All') {
        if (!item.supportedProtocols || !item.supportedProtocols.includes(selectedProtocol)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'brand') return a.brandName.localeCompare(b.brandName) || a.name.localeCompare(b.name);
      const priceA = a.sellPrice || a.msrp || a.cost;
      const priceB = b.sellPrice || b.msrp || b.cost;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedBrand, selectedPricingModel, selectedProtocol, sortBy]);

  const handleCopySku = (sku: string) => {
    navigator.clipboard?.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Access Control':
      case 'Supported Access Control':
        return <Key className="w-3.5 h-3.5 text-blue-600" />;
      case 'Security Cameras':
        return <Video className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Smart Thermostats':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'Smart Leak':
        return <Droplets className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Internet Connectivity':
        return <Wifi className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Intercoms':
        return <PhoneCall className="w-3.5 h-3.5 text-purple-600" />;
      case 'Professional Services':
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case 'Accessories':
        return <Cpu className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Live Official Catalog
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                myquext.com Synchronized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Inter_Tight',sans-serif] tracking-tight">
              myquext.com Product Catalog &amp; BOM Sourcing
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Standardized enterprise hardware, IoT infrastructure, security hardware, and recurring SaaS subscriptions.
              All quotes, bills of materials (BOM), and newly created projects source their specs, costs, and MSRP directly from this canonical catalog.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {MYQUEXT_FULL_PRODUCT_CATALOG.length}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Products
              </div>
            </div>
            <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-200/70 text-center">
              <div className="text-2xl font-extrabold text-blue-700 font-mono">
                {QUEUXT_HARDWARE_CATALOG.length}
              </div>
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mt-0.5">
                Hardware &amp; Capex
              </div>
            </div>
            <div className="bg-purple-50/70 rounded-xl p-3 border border-purple-200/70 text-center">
              <div className="text-2xl font-extrabold text-purple-700 font-mono">
                {QUEUXT_SOFTWARE_CATALOG.length}
              </div>
              <div className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider mt-0.5">
                SaaS Subscriptions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.entries(categoryStats).map(([cat, count]) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat)}
              <span>{cat}</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-blue-700/80 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by product name, SKU, manufacturer, specs, or protocol (e.g., Schlage, LoRaWAN, Wi-Fi 7)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Brand, Model, View mode */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Brand Dropdown */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Brands ({brands.length - 1})</option>
              {brands.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Pricing Model Dropdown */}
            <select
              value={selectedPricingModel}
              onChange={(e) => setSelectedPricingModel(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Pricing Types</option>
              <option value="One-Time">Capex / Hardware (62)</option>
              <option value="SaaS">Cloud SaaS (18)</option>
              <option value="Services">Professional Services (5)</option>
            </select>

            {/* Protocol Dropdown */}
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Protocols</option>
              {allProtocols.filter((p) => p !== 'All').map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="brand">Sort: Brand</option>
              <option value="price-asc">Sort: Price (Low → High)</option>
              <option value="price-desc">Sort: Price (High → Low)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
            <strong className="text-slate-900">{MYQUEXT_FULL_PRODUCT_CATALOG.length}</strong> products
            {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPricingModel !== 'All' || selectedProtocol !== 'All' || searchQuery) && (
              <span className="ml-2 text-blue-600 font-medium">
                (Filtered view)
              </span>
            )}
          </div>
          {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPricingModel !== 'All' || selectedProtocol !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSelectedPricingModel('All');
                setSelectedProtocol('All');
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => {
            const isSaaS = prod.pricingModel === 'SaaS';
            const isServices = prod.pricingModel.includes('Professional Services');
            const displayPrice = prod.sellPrice || prod.msrp || prod.cost;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Brand & Model Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {prod.brandName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          isSaaS
                            ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                            : isServices
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        }`}
                      >
                        {isSaaS ? 'SaaS Recurring' : isServices ? 'Pro Service' : 'Capex Hardware'}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-slate-900">
                        {displayPrice > 0 ? (
                          <>
                            ${displayPrice.toLocaleString()}
                            <span className="text-[10px] text-slate-500 font-normal">
                              {isSaaS ? (prod.isBilledPerUnit ? '/u/mo' : '/p/mo') : ''}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Platform Tier
                          </span>
                        )}
                      </div>
                      {prod.cost > 0 && prod.cost !== displayPrice && (
                        <div className="text-[10px] font-mono text-slate-400">
                          Cost: ${prod.cost.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & SKU */}
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-100">
                        SKU: {prod.sku || prod.id.slice(0, 10)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySku(prod.sku || prod.id)}
                        className="text-slate-300 hover:text-slate-600 transition-colors"
                        title="Copy SKU"
                      >
                        {copiedSku === (prod.sku || prod.id) ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prod.shortDescription || prod.description}
                  </p>

                  {/* Protocols / Tags */}
                  {prod.supportedProtocols && prod.supportedProtocols.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {prod.supportedProtocols.map((proto) => (
                        <span
                          key={proto}
                          className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {proto}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    {getCategoryIcon(prod.category)}
                    <span>{prod.category}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setDetailProduct(prod)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <span>View Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Brand / Manufacturer</th>
                  <th className="py-3 px-4">Product Name &amp; SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing Model</th>
                  <th className="py-3 px-4">Wholesale Cost</th>
                  <th className="py-3 px-4">Sell / MSRP</th>
                  <th className="py-3 px-4">Supported Protocols</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const displayPrice = prod.sellPrice || prod.msrp || prod.cost;
                  const isSaaS = prod.pricingModel === 'SaaS';
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {prod.brandName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{prod.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">SKU: {prod.sku || prod.id}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {getCategoryIcon(prod.category)}
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSaaS
                              ? 'bg-purple-50 text-purple-700'
                              : prod.pricingModel.includes('Professional Services')
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {prod.pricingModel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        ${prod.cost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        ${displayPrice.toLocaleString()}
                        {isSaaS ? (prod.isBilledPerUnit ? ' /u/mo' : ' /p/mo') : ''}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {prod.supportedProtocols?.map((proto) => (
                            <span
                              key={proto}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-mono"
                            >
                              {proto}
                            </span>
                          )) || <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDetailProduct(prod)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border">
                    {detailProduct.brandName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {detailProduct.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-['Inter_Tight',sans-serif]">
                  {detailProduct.name}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  SKU: {detailProduct.sku || detailProduct.id}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Wholesale Cost
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  ${detailProduct.cost.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Retail / MSRP
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  ${(detailProduct.msrp || detailProduct.sellPrice || detailProduct.cost).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Pricing Cadence
                </div>
                <div className="text-sm font-bold text-blue-700 mt-1">
                  {detailProduct.pricingModel === 'SaaS'
                    ? detailProduct.isBilledPerUnit
                      ? 'Monthly / Unit'
                      : 'Monthly / Property'
                    : detailProduct.pricingModel}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Description &amp; Scope
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {detailProduct.description || 'Standard Quext enterprise smart community hardware module.'}
              </p>
            </div>

            {/* Specifications & Supported Protocols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Supported Protocols &amp; Interfaces
                </h4>
                {detailProduct.supportedProtocols && detailProduct.supportedProtocols.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {detailProduct.supportedProtocols.map((pr: string) => (
                      <span
                        key={pr}
                        className="px-2 py-1 rounded-md text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
                      >
                        {pr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Standard OEM specification</div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Operations &amp; BOM Scope
                </h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <strong className="text-slate-800">BOM Category:</strong> {detailProduct.bomCategory}
                  </div>
                  <div>
                    <strong className="text-slate-800">Deployment Unit:</strong>{' '}
                    {detailProduct.isBilledPerUnit ? 'Per Residential Unit' : 'Property Common Infrastructure'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopySku(detailProduct.sku || detailProduct.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {copiedSku === (detailProduct.sku || detailProduct.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy SKU ({detailProduct.sku || detailProduct.id})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
