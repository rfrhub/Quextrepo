import React, { useState, useMemo } from 'react';
import {
  OperationProject,
  BOMItem,
  BOMCategory,
  AVAILABLE_PMS,
  AVAILABLE_CSMS,
  CSMName,
  AVAILABLE_FIELD_TECHS,
  FieldTechName,
  ProjectStatusTag,
  ProjectPlatform,
  AVAILABLE_PLATFORMS,
  getPlatformBadgeStyle,
} from '../types';
import { IntegratorPartnerSelector } from './IntegratorPartnerSelector';
import { QUEUXT_HARDWARE_CATALOG, QUEUXT_SOFTWARE_CATALOG } from '../data/catalogData';
import { createDefaultMilestones } from '../data/initialData';
import {
  Plus,
  X,
  Building2,
  Package,
  ShieldCheck,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Check,
  Search,
  Server,
  DollarSign,
  Tag,
  FileSpreadsheet,
} from 'lucide-react';

interface CreateManualProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: OperationProject) => void;
  onOpenImportModal?: () => void;
}

export const CreateManualProjectModal: React.FC<CreateManualProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  onOpenImportModal,
}) => {
  if (!isOpen) return null;

  const [propertyName, setPropertyName] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('TX');
  const [unitsCount, setUnitsCount] = useState<number>(200);
  const [targetDate, setTargetDate] = useState<string>('2026-12-15');
  const [pmName, setPmName] = useState<string>(AVAILABLE_PMS[0].name);
  const [csmName, setCsmName] = useState<CSMName>('Nicole Franklin');
  const [fieldTechName, setFieldTechName] = useState<FieldTechName>('Hector Lopez');
  const [statusTag, setStatusTag] = useState<ProjectStatusTag>('On Track');
  const [platform, setPlatform] = useState<ProjectPlatform>('Quext');
  const [integratorPartners, setIntegratorPartners] = useState<string[]>(['SKBM']);

  // Active Catalog Tab for Browsing
  const [activeCatalogTab, setActiveCatalogTab] = useState<'none' | 'hardware' | 'software'>('none');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [hwCategoryFilter, setHwCategoryFilter] = useState<string>('All');
  const [swSearch, setSwSearch] = useState<string>('');
  const [swTierFilter, setSwTierFilter] = useState<string>('All');

  // Selected Software Subscriptions
  const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<string[]>([
    'sw-core',
    'sw-access',
    'sw-hvac',
    'sw-leak',
  ]);

  // Manual BOM creation items with spares
  const [bomItems, setBomItems] = useState<
    Array<{
      name: string;
      model: string;
      category: BOMCategory;
      quantity: number;
      sparesCount: number;
      unitPrice: number;
      location: string;
      description?: string;
    }>
  >([
    {
      name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet NFC)',
      model: 'QXT-DL-900',
      category: 'Smart Access Control',
      quantity: 200,
      sparesCount: 10,
      unitPrice: 220,
      location: 'All Residential Units',
      description: 'Integrated digital key deadbolt with NFC/BLE reader.',
    },
    {
      name: 'Quext IoT Smart Thermostat (LoRaWAN Hubless)',
      model: 'QXT-TH-300',
      category: 'Smart Thermostats & HVAC',
      quantity: 200,
      sparesCount: 10,
      unitPrice: 165,
      location: 'All Residential Units',
      description: 'Hubless LoRaWAN thermostat with dual humidity sensing.',
    },
    {
      name: 'Quext LoRaWAN Outdoor Gateway Base Station (8-Channel)',
      model: 'QXT-GW-LR8',
      category: 'IoT Gateways & Mesh',
      quantity: 3,
      sparesCount: 1,
      unitPrice: 1250,
      location: 'Clubhouse Rooftop & Buildings',
      description: 'IP67 rated 8-channel cellular-backhaul LoRa gateway.',
    },
  ]);

  // Form for custom item addition
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemModel, setNewItemModel] = useState<string>('');
  const [newItemCat, setNewItemCat] = useState<BOMCategory>('Smart Access Control');
  const [newItemQty, setNewItemQty] = useState<number>(10);
  const [newItemSpares, setNewItemSpares] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(150);

  // Requirement: "specifically when the Residential units count gets updated adjust how many unit locks and thermostats are designated in the BOM hardware line items as a helpful quick add."
  const handleUnitsCountChange = (newCount: number) => {
    setUnitsCount(newCount);
    // Auto adjust unit locks and thermostats
    setBomItems((prev) =>
      prev.map((item) => {
        const isLock =
          item.name.toLowerCase().includes('deadbolt') ||
          item.name.toLowerCase().includes('lock') ||
          item.category === 'Smart Access Control';
        const isThermostat =
          item.name.toLowerCase().includes('thermostat') ||
          item.category === 'Smart Thermostats & HVAC';

        if (isLock && item.location.toLowerCase().includes('unit')) {
          return { ...item, quantity: newCount };
        }
        if (isThermostat && item.location.toLowerCase().includes('unit')) {
          return { ...item, quantity: newCount };
        }
        return item;
      })
    );
  };

  const handleAddBOMItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setBomItems([
      ...bomItems,
      {
        name: newItemName.trim(),
        model: newItemModel.trim() || `MANUAL-${bomItems.length + 1}`,
        category: newItemCat,
        quantity: newItemQty,
        sparesCount: newItemSpares,
        unitPrice: newItemPrice,
        location: 'Designated Scope',
      },
    ]);

    setNewItemName('');
    setNewItemModel('');
    setNewItemQty(10);
    setNewItemSpares(1);
  };

  const handleAddFromHardwareCatalog = (hwItem: typeof QUEUXT_HARDWARE_CATALOG[0]) => {
    // Check if already in BOM
    const existingIndex = bomItems.findIndex((b) => b.model === hwItem.sku);
    if (existingIndex >= 0) {
      alert(`"${hwItem.name}" is already in the BOM.`);
      return;
    }

    const defaultQty = hwItem.typicalScope === 'Per Residential Unit' ? unitsCount : 4;
    const defaultSpares = hwItem.typicalScope === 'Per Residential Unit' ? Math.max(2, Math.round(unitsCount * 0.05)) : 1;

    setBomItems([
      ...bomItems,
      {
        name: hwItem.name,
        model: hwItem.sku,
        category: hwItem.category,
        quantity: defaultQty,
        sparesCount: defaultSpares,
        unitPrice: hwItem.unitPrice,
        location: hwItem.typicalScope,
        description: hwItem.description,
      },
    ]);
  };

  const toggleSoftwareModule = (swId: string) => {
    if (selectedSoftwareIds.includes(swId)) {
      setSelectedSoftwareIds(selectedSoftwareIds.filter((id) => id !== swId));
    } else {
      setSelectedSoftwareIds([...selectedSoftwareIds, swId]);
    }
  };

  const handleRemoveBOMItem = (idx: number) => {
    setBomItems(bomItems.filter((_, i) => i !== idx));
  };

  const handleUpdateItemSpares = (idx: number, spares: number) => {
    setBomItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, sparesCount: Math.max(0, spares) } : item))
    );
  };

  const handleUpdateItemQty = (idx: number, qty: number) => {
    setBomItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  // Calculate totals
  const totalHardwareAmount = bomItems.reduce(
    (acc, item) => acc + (item.quantity + (item.sparesCount || 0)) * item.unitPrice,
    0
  );

  const monthlySaaSPerUnit = QUEUXT_SOFTWARE_CATALOG.filter(
    (sw) => selectedSoftwareIds.includes(sw.id) && sw.billingType === 'per_unit_per_month'
  ).reduce((acc, sw) => acc + sw.monthlyPrice, 0);

  const monthlySaaSPerProperty = QUEUXT_SOFTWARE_CATALOG.filter(
    (sw) => selectedSoftwareIds.includes(sw.id) && sw.billingType === 'per_property_per_month'
  ).reduce((acc, sw) => acc + sw.monthlyPrice, 0);

  const totalMonthlyFee = unitsCount * monthlySaaSPerUnit + monthlySaaSPerProperty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim() || !clientName.trim()) return;

    const projectId = `proj-manual-${Date.now()}`;
    const selectedPM = AVAILABLE_PMS.find((p) => p.name === pmName) || AVAILABLE_PMS[0];

    const formattedBOM: BOMItem[] = bomItems.map((item, idx) => ({
      id: `bom-m-${idx}-${Date.now()}`,
      name: item.name,
      model: item.model || `MANUAL-${idx + 1}`,
      category: item.category,
      location: item.location,
      quantity: item.quantity,
      sparesCount: item.sparesCount || 0,
      sparesDelivered: false,
      installedCount: 0,
      unitPrice: item.unitPrice,
      description: item.description,
      postItLogs: [],
    }));

    const newProject: OperationProject = {
      id: projectId,
      quoteId: `manual-quote-${Date.now()}`,
      quoteNumber: `QXT-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyName: propertyName.trim(),
      clientName: clientName.trim(),
      address: address.trim() || '100 Main St',
      city: city.trim() || 'Austin',
      state: state.trim() || 'TX',
      unitsCount,
      heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
      assignedPM: selectedPM,
      assignedCSM: csmName,
      assignedFieldTech: fieldTechName,
      integratorPartners,
      statusTag,
      platform,
      statusReason: 'Manually initialized project with locked implementation BOM and selected software catalog.',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: targetDate,
      isManuallyCreated: true,
      isBomLocked: true, // Baseline lock
      bomItems: formattedBOM,
      installLogs: [],
      notes: [
        {
          id: `note-${Date.now()}`,
          projectId,
          author: selectedPM.name,
          timestamp: 'Just now',
          category: 'General Context',
          text: `Project created manually with ${formattedBOM.length} BOM line items. Total quoted hardware: $${totalHardwareAmount.toLocaleString()}. Projected software: $${totalMonthlyFee.toLocaleString()}/mo across ${selectedSoftwareIds.length} modules.`,
          isPinned: true,
        },
      ],
      milestones: createDefaultMilestones(`m-${projectId}`, new Date().toISOString().split('T')[0], targetDate),
      customerIntake: {
        pmsSoftware: 'Yardi',
        commonAreaDoors: [
          { id: 'cad-m1', doorName: 'Clubhouse Main Entry', buildingOrArea: 'Clubhouse', installedStatus: 'Pending' },
          { id: 'cad-m2', doorName: 'Fitness Center Entry', buildingOrArea: 'Clubhouse Floor 1', installedStatus: 'Pending' },
        ],
        staffRoles: [],
        walkthroughCompleted: false,
        emailUpdatesCadence: 'weekly',
      },
      lastUpdated: new Date().toISOString(),
    };

    onCreateProject(newProject);
    onClose();
  };

  const hwCategories: string[] = useMemo(() => {
    const cats = Array.from(new Set(QUEUXT_HARDWARE_CATALOG.map((h) => h.category)));
    return ['All', ...cats];
  }, []);

  const filteredHardware = QUEUXT_HARDWARE_CATALOG.filter((h) => {
    const matchesSearch =
      !catalogSearch.trim() ||
      h.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      h.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      h.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      h.manufacturer.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = hwCategoryFilter === 'All' || h.category === hwCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const swTiers: string[] = useMemo(() => {
    const tiers = Array.from(new Set(QUEUXT_SOFTWARE_CATALOG.map((s) => s.tier)));
    return ['All', ...tiers];
  }, []);

  const filteredSoftware = QUEUXT_SOFTWARE_CATALOG.filter((s) => {
    const matchesSearch =
      !swSearch.trim() ||
      s.name.toLowerCase().includes(swSearch.toLowerCase()) ||
      s.sku.toLowerCase().includes(swSearch.toLowerCase()) ||
      s.tier.toLowerCase().includes(swSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(swSearch.toLowerCase());
    const matchesTier = swTierFilter === 'All' || s.tier === swTierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Create Manual Project</h2>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-mono">
                  Full Catalog Integrated
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Configure community parameters, browse official Hardware & Software catalogs, and lock BOM baseline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenImportModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportModal();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 rounded-lg transition-colors cursor-pointer"
                title="Switch to bulk import projects via CSV or Excel spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Import CSV / Excel</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* General Information */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Property & Community Information</span>
              </div>
              <span className="text-slate-400 text-xs font-normal">Fields marked with * are required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-slate-700">Property Name *</label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Apex at Ridgecrest"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 mt-1 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Client / Property Owner *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Cortland Management"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 mt-1 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 5200 Innovation Parkway"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 mt-1 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Austin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 mt-1 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="TX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 mt-1 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Residential Units Count with Auto-Sync Notification */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Residential Units Count *</label>
                  <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    ⚡ Auto-Syncs Lock & Stat Quantities
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  required
                  value={unitsCount}
                  onChange={(e) => handleUnitsCountChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold mt-1 focus:outline-none focus:border-sky-500 tabular-nums"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Updating this automatically updates unit lock and thermostat quantities below as a helpful quick add.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Target Completion Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono mt-1 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Platform Tag Selector */}
              <div className="sm:col-span-2 pt-1">
                <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Platform Tag *</span>
                  <span className="text-slate-400 font-normal text-[11px]">(Platform utilized for IoT and Access Control)</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVAILABLE_PLATFORMS.map((plat) => {
                    const isSelected = platform === plat;
                    const badgeStyle = getPlatformBadgeStyle(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setPlatform(plat)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${badgeStyle.badgeClass} ring-2 ring-purple-400/40 shadow-xs`
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? badgeStyle.dotColor : 'bg-slate-300'}`} />
                        <span>{plat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Personnel */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-slate-900 text-sm">Assigned Operations Team</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Project Manager</label>
                <select
                  value={pmName}
                  onChange={(e) => setPmName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-sky-800 text-xs mt-1"
                >
                  {AVAILABLE_PMS.map((pm) => (
                    <option key={pm.name} value={pm.name}>
                      {pm.name} ({pm.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Customer Success (CSM)</label>
                <select
                  value={csmName}
                  onChange={(e) => setCsmName(e.target.value as CSMName)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-purple-800 text-xs mt-1"
                >
                  {AVAILABLE_CSMS.map((csm) => (
                    <option key={csm} value={csm}>
                      {csm}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Field Tech</label>
                <select
                  value={fieldTechName}
                  onChange={(e) => setFieldTechName(e.target.value as FieldTechName)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-amber-800 text-xs mt-1"
                >
                  {AVAILABLE_FIELD_TECHS.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Initial Health Tag</label>
                <select
                  value={statusTag}
                  onChange={(e) => setStatusTag(e.target.value as ProjectStatusTag)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800 text-xs mt-1"
                >
                  <option value="On Track">On Track</option>
                  <option value="Behind Schedule">Behind Schedule</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
            </div>

            {/* Integrator Partner(s) / Field Installers */}
            <div className="pt-3 border-t border-slate-200">
              <label className="font-semibold text-slate-700 block mb-1">
                Integrator Partner(s) &amp; Certified Installers
              </label>
              <IntegratorPartnerSelector
                assignedPartners={integratorPartners}
                projectName={propertyName.trim() || 'New Manual Project'}
                onChange={setIntegratorPartners}
                label=""
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Select from the main Integrator Partners list (SKBM, ATB, SBH, Everbase, JTS), type in a manual Integrator Partner, or assign from your History of Used Integrators.
              </p>
            </div>
          </div>

          {/* Catalog Explorers: Hardware and Software Catalogs */}
          <div className="border border-sky-200 rounded-xl bg-sky-50/40 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-sky-600" />
                  <span>Official Quext Hardware & Software Catalogs</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Browse items from myquext.com analysis quotes to populate this project with verified pricing and costs.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveCatalogTab(activeCatalogTab === 'hardware' ? 'none' : 'hardware')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCatalogTab === 'hardware'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Browse Hardware Catalog ({QUEUXT_HARDWARE_CATALOG.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCatalogTab(activeCatalogTab === 'software' ? 'none' : 'software')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCatalogTab === 'software'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Configure Software Subscriptions ({QUEUXT_SOFTWARE_CATALOG.length})
                </button>
              </div>
            </div>

            {/* Hardware Catalog Drawer */}
            {activeCatalogTab === 'hardware' && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-inner">
                {/* Search & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search hardware by name, SKU, manufacturer (Schlage, Quext, Eagle Eye, Resideo)..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Showing {filteredHardware.length} of {QUEUXT_HARDWARE_CATALOG.length} hardware items
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {hwCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setHwCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        hwCategoryFilter === cat
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredHardware.map((hw) => {
                    const isAdded = bomItems.some((b) => b.model === hw.sku);
                    return (
                      <div
                        key={hw.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between gap-2 hover:border-sky-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-slate-800 border">
                                  {hw.manufacturer}
                                </span>
                                <span className="font-bold text-slate-900 text-xs">{hw.name}</span>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border shrink-0">
                              {hw.sku}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-900">${hw.unitPrice} retail</span>
                            <span>•</span>
                            <span className="text-slate-500 font-mono">(Cost: ${hw.unitCost})</span>
                            <span>•</span>
                            <span className="text-sky-700 font-medium">{hw.category}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{hw.description}</p>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleAddFromHardwareCatalog(hw)}
                            disabled={isAdded}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                            }`}
                          >
                            {isAdded ? '✓ Added to BOM' : '+ Add to Project BOM'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Software Catalog Drawer */}
            {activeCatalogTab === 'software' && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search software subscriptions by module or tier..."
                      value={swSearch}
                      onChange={(e) => setSwSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                      <span>Monthly Revenue: ${totalMonthlyFee.toLocaleString()}/mo</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      ({unitsCount} units)
                    </span>
                  </div>
                </div>

                {/* Tier Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {swTiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSwTierFilter(tier)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        swTierFilter === tier
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredSoftware.map((sw) => {
                    const isSelected = selectedSoftwareIds.includes(sw.id);
                    return (
                      <div
                        key={sw.id}
                        onClick={() => toggleSoftwareModule(sw.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-400 ring-1 ring-purple-400'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{sw.name}</span>
                            <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border">
                              ${sw.monthlyPrice}
                              {sw.billingType === 'per_unit_per_month' ? '/unit/mo' : '/prop/mo'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Tier: {sw.tier} • (Wholesale cost: ${sw.monthlyCost})
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{sw.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                          <span className="text-[10px] text-purple-900 font-medium">
                            {isSelected ? '✓ Included in Scope' : '+ Click to Include'}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-slate-800">
                            {sw.billingType === 'per_unit_per_month'
                              ? `$${(sw.monthlyPrice * unitsCount).toLocaleString()}/mo`
                              : `$${sw.monthlyPrice}/mo`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* BOM Setup with Spares Option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-600" />
                <span>BOM Hardware Line Items & Spares</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  Locked Once Created
                </span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                {bomItems.length} products defined   Total Hardware: ${totalHardwareAmount.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Spares & Audit Policy:</strong> Spares are included in the line item total for purchasing and delivery, but are kept distinct and do not count toward installed device completion. Once created, these baseline numbers are locked for audit integrity.
              </span>
            </div>

            {/* List of items with Spares & Quick Adjustments */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {bomItems.map((item, idx) => {
                const totalItemCount = item.quantity + (item.sparesCount || 0);
                return (
                  <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-sky-700">{item.model}</span>
                        <span> </span>
                        <span>{item.category}</span>
                        <span> </span>
                        <span>${item.unitPrice}/unit</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Base Quantity */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-[11px]">Base Units:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-center"
                        />
                      </div>

                      {/* Spares Option */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-800 font-semibold text-[11px]">Spares:</span>
                        <input
                          type="number"
                          min={0}
                          value={item.sparesCount}
                          onChange={(e) => handleUpdateItemSpares(idx, parseInt(e.target.value, 10) || 0)}
                          className="w-14 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-mono font-bold text-center text-amber-900"
                        />
                      </div>

                      {/* Line Item Total */}
                      <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        Total: {totalItemCount}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBOMItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove product"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Item Row */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800 text-xs">Add Custom Product to BOM:</span>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Custom Product Name"
                  className="sm:col-span-2 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={newItemModel}
                  onChange={(e) => setNewItemModel(e.target.value)}
                  placeholder="SKU / Model"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                />
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value as BOMCategory)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium"
                >
                  <option value="Smart Access Control">Smart Access Control</option>
                  <option value="Smart Thermostats & HVAC">Smart Thermostats</option>
                  <option value="IoT Gateways & Mesh">Gateways & Hubs</option>
                  <option value="Sensors & Leak Protection">Sensors & Leaks</option>
                  <option value="Bulk Managed Wi-Fi">Managed Wi-Fi</option>
                  <option value="Common Area & Utilities">Common Area & Utilities</option>
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseInt(e.target.value, 10) || 1)}
                    placeholder="Qty"
                    className="w-16 px-1.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-center"
                    title="Base Quantity"
                  />
                  <input
                    type="number"
                    min={0}
                    value={newItemSpares}
                    onChange={(e) => setNewItemSpares(parseInt(e.target.value, 10) || 0)}
                    placeholder="Spares"
                    className="w-14 px-1.5 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-mono text-center text-amber-900"
                    title="Spares Quantity"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(parseInt(e.target.value, 10) || 1)}
                    placeholder="Price"
                    className="w-16 px-1.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-center"
                    title="Unit Retail Price"
                  />
                  <button
                    type="button"
                    onClick={handleAddBOMItem}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              Hardware: <strong className="text-slate-800">${totalHardwareAmount.toLocaleString()}</strong>   Software:{' '}
              <strong className="text-purple-700">${totalMonthlyFee.toLocaleString()}/mo</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
              >
                Create Project & Lock BOM Baseline
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
