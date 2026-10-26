import React, { useState, useMemo } from 'react';
import {
  Quote,
  OperationProject,
  DealStage,
} from '../types';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  Calendar,
  FileText,
  Building2,
  Users,
  Activity,
  Compass,
  MapPin,
  Plus,
  Search,
  Bug,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Layers,
  ExternalLink,
  Filter,
  BookOpen,
  Wrench,
  RotateCcw,
  Maximize2,
  Award,
  TrendingUp,
  Package,
  ShieldCheck,
  UserCheck,
  Lightbulb,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { CloudSyncIndicator } from './CloudSyncIndicator';

export type MyQuextTopTab =
  | 'salesHub'
  | 'operations'
  | 'customerSuccess'
  | 'reports'
  | 'productCatalog';

export type SalesHubSidebarTab =
  | 'dashboard'
  | 'approvals'
  | 'pipeline'
  | 'meetings'
  | 'quotes'
  | 'accounts'
  | 'leads'
  | 'pulse'
  | 'discovery'
  | 'gfiberDeals'
  | 'dealMap';

export type OperationsEmbeddedTab =
  | 'overview'
  | 'activity-hub'
  | 'timeline'
  | 'quotes'
  | 'analysis';

interface ExtendedQuote extends Quote {
  myquextStage?: string;
  myquextSource?: 'analysis' | 'lead' | 'building' | string;
  buildType?: string;
}

interface MyQuextPlatformShellProps {
  quotes: ExtendedQuote[];
  projects: OperationProject[];
  onUpdateQuoteStage: (quoteId: string, newStage: DealStage, myquextStageLabel?: string) => void;
  onCreateNewOpportunity?: (newQuote: ExtendedQuote, markWonImmediately: boolean) => void;
  onSyncLiveMyQuext: () => Promise<void>;
  isSyncingLive: boolean;
  lastSyncedInfo: string | null;
  // Current signed-in myquext.com Team Member (Raul Recalde, Sean Gates, Hector Lopez, etc.)
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserRoleLabel?: string;
  currentUserAvatarInitial?: string;
  onLogout: () => void;
  onOpenFieldTechPortal: () => void;
  // Navigation into embedded Operations views
  activeTopTab: MyQuextTopTab;
  onSelectTopTab: (tab: MyQuextTopTab) => void;
  operationsMainTab: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis';
  onSelectOperationsMainTab: (tab: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis') => void;
  operationsSubTab: string;
  onSelectOperationsSubTab: (subTab: string) => void;
  onGoToOperationsDashboard: () => void;
  onGoToOperationsProject: (projectId: string) => void;
  onViewQuoteAnalysis: (quoteId: string) => void;
  onOpenLoginModal: () => void;
  onOpenPartnerAcademy: () => void;
  onOpenSowAutomation?: () => void;
  onOpenPMTutorial?: () => void;
  onResetData: () => void;
  onToggleStandaloneMode: () => void;
  children: React.ReactNode;
}

const MYQUEXT_STAGE_OPTIONS: { label: string; dealStage: DealStage; badgeClass: string }[] = [
  { label: 'Draft', dealStage: 'Prospect', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  { label: 'AI Prospecting Target', dealStage: 'Prospect', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { label: 'Survey/Design Requested', dealStage: 'Needs Analysis', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
  { label: 'Estimate Sent', dealStage: 'Proposal Sent', badgeClass: 'bg-sky-50 text-sky-800 border-sky-200' },
  { label: 'Pending Contract', dealStage: 'Contract Review', badgeClass: 'bg-purple-50 text-purple-800 border-purple-200' },
  { label: 'Deal Won', dealStage: 'Deal Won', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { label: 'Project Kickoff', dealStage: 'Deal Won', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { label: 'On Deck', dealStage: 'Deal Won', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200' },
  { label: 'Closed Lost', dealStage: 'Closed Lost', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export const MyQuextPlatformShell: React.FC<MyQuextPlatformShellProps> = ({
  quotes,
  projects,
  onUpdateQuoteStage,
  onCreateNewOpportunity,
  onSyncLiveMyQuext,
  isSyncingLive,
  lastSyncedInfo,
  currentUserName = 'Raul Recalde',
  currentUserEmail = 'raul.recalde@onequext.com',
  currentUserRoleLabel = 'TEAM MEMBER',
  currentUserAvatarInitial = 'R',
  onLogout,
  onOpenFieldTechPortal,
  activeTopTab,
  onSelectTopTab,
  operationsMainTab,
  onSelectOperationsMainTab,
  operationsSubTab,
  onSelectOperationsSubTab,
  onGoToOperationsDashboard,
  onGoToOperationsProject,
  onViewQuoteAnalysis,
  onOpenLoginModal,
  onOpenPartnerAcademy,
  onOpenSowAutomation,
  onOpenPMTutorial,
  onResetData,
  onToggleStandaloneMode,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [salesSubTab, setSalesSubTab] = useState<SalesHubSidebarTab>('dashboard');
  const [whatsHappeningFilter, setWhatsHappeningFilter] = useState<'all' | 'mentions' | 'Leading' | 'Contributing'>('all');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearchDropdown, setShowGlobalSearchDropdown] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [toastBanner, setToastBanner] = useState<{
    propertyName: string;
    projectId: string;
    units: number;
    clientName: string;
  } | null>(null);
  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newClientName, setNewClientName] = useState('Cortland');
  const [newCity, setNewCity] = useState('Atlanta');
  const [newState, setNewState] = useState('GA');
  const [newUnits, setNewUnits] = useState(260);
  const [newMarkWon, setNewMarkWon] = useState(true);

  // Distinct sales reps from real myquext data
  const salesReps = useMemo(() => {
    const set = new Set<string>();
    quotes.forEach((q) => {
      if (q.assignedSalesLead) set.add(q.assignedSalesLead);
    });
    return Array.from(set).sort();
  }, [quotes]);

  // AI Prospecting Daily Targets (Brookridge Redevelopment Project & Cortland Old Fourth Ward first!)
  const dailyTargets = useMemo(() => {
    const brookridge = quotes.find((q) =>
      q.propertyName.toLowerCase().includes('brookridge redevelopment')
    );
    const cortlandOfw = quotes.find((q) =>
      q.propertyName.toLowerCase().includes('cortland old fourth ward')
    );
    const list: ExtendedQuote[] = [];
    if (brookridge) list.push(brookridge);
    if (cortlandOfw) list.push(cortlandOfw);
    quotes
      .filter((q) => q.myquextSource === 'lead' && !list.some((x) => x.id === q.id))
      .slice(0, 4)
      .forEach((q) => list.push(q));
    return list;
  }, [quotes]);

  // Filtered opportunities for Sales Hub tables/lists
  const filteredOpportunities = useMemo(() => {
    return quotes.filter((q) => {
      const effectiveMyQuextStage = q.myquextStage || (q.stage === 'Deal Won' ? 'Deal Won' : q.stage);
      const matchesStage =
        stageFilter === 'all' ||
        q.stage === stageFilter ||
        effectiveMyQuextStage.toLowerCase() === stageFilter.toLowerCase();
      const matchesRep = repFilter === 'all' || q.assignedSalesLead === repFilter;
      const matchesSearch =
        !globalSearch.trim() ||
        q.propertyName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        q.clientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        q.city.toLowerCase().includes(globalSearch.toLowerCase()) ||
        q.state.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (q.assignedSalesLead || '').toLowerCase().includes(globalSearch.toLowerCase());
      return matchesStage && matchesRep && matchesSearch;
    });
  }, [quotes, stageFilter, repFilter, globalSearch]);

  const handleStageChangeWithToast = (quote: ExtendedQuote, selectedLabel: string) => {
    const matched = MYQUEXT_STAGE_OPTIONS.find((o) => o.label === selectedLabel);
    const targetDealStage: DealStage = matched ? matched.dealStage : 'Deal Won';
    onUpdateQuoteStage(quote.id, targetDealStage, selectedLabel);

    if (targetDealStage === 'Deal Won') {
      setToastBanner({
        propertyName: quote.propertyName,
        projectId: quote.id,
        units: quote.unitsCount,
        clientName: quote.clientName,
      });
    }
  };

  const handleQuickPromoteToDealWon = (quote: ExtendedQuote) => {
    onUpdateQuoteStage(quote.id, 'Deal Won', 'Deal Won');
    setToastBanner({
      propertyName: quote.propertyName,
      projectId: quote.id,
      units: quote.unitsCount,
      clientName: quote.clientName,
    });
  };

  const handleOpenProjectInOperations = (projectId: string) => {
    onSelectTopTab('operations');
    onGoToOperationsProject(projectId);
  };

  const handleCreateOpportunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim() || !onCreateNewOpportunity) return;
    const id = `myquext_${Date.now()}`;
    const units = Math.max(10, Number(newUnits) || 200);
    const created: ExtendedQuote = {
      id,
      quoteNumber: `QXT-2026-${Math.floor(4000 + Math.random() * 5000)}`,
      propertyName: newPropName.trim(),
      clientName: newClientName.trim() || 'Cortland',
      address: `100 ${newPropName.trim()} Pkwy`,
      city: newCity.trim() || 'Atlanta',
      state: newState.trim() || 'GA',
      unitsCount: units,
      stage: newMarkWon ? 'Deal Won' : 'Proposal Sent',
      myquextStage: newMarkWon ? 'Deal Won' : 'Estimate Sent',
      myquextSource: 'analysis',
      buildType: 'Retrofit',
      stageUpdatedAt: new Date().toISOString(),
      totalHardwareAmount: units * 465,
      totalInstallAmount: units * 165,
      monthlyServiceFee: units * 28,
      assignedSalesLead: 'Raul Recalde',
      notes: `Created in myquext.com Sales Hub (${units} units in ${newCity}, ${newState}).`,
      bomItems: [
        {
          id: `bom-${id}-1`,
          name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
          model: 'QXT-DL-900',
          category: 'Smart Access Control',
          location: 'All Residential Units',
          quantity: units,
          installedCount: 0,
          unitPrice: 220,
        },
        {
          id: `bom-${id}-2`,
          name: 'Quext IoT Smart Thermostat (LoRaWAN)',
          model: 'QXT-TH-300',
          category: 'Smart Thermostats & HVAC',
          location: 'All Residential Units',
          quantity: units,
          installedCount: 0,
          unitPrice: 165,
        },
        {
          id: `bom-${id}-3`,
          name: 'Quext LoRaWAN Outdoor Gateway Base Station',
          model: 'QXT-GW-LR8',
          category: 'IoT Gateways & Mesh',
          location: 'Rooftop & Clubhouse',
          quantity: Math.max(2, Math.ceil(units / 70)),
          installedCount: 0,
          unitPrice: 1250,
        },
        {
          id: `bom-${id}-4`,
          name: 'Smart Flood & Water Leak Detector',
          model: 'QXT-LK-100',
          category: 'Sensors & Leak Protection',
          location: 'Unit Utility Closets',
          quantity: units,
          installedCount: 0,
          unitPrice: 55,
        },
      ],
    };

    onCreateNewOpportunity(created, newMarkWon);
    setIsNewAnalysisModalOpen(false);
    setNewPropName('');
    if (newMarkWon) {
      setToastBanner({
        propertyName: created.propertyName,
        projectId: created.id,
        units: created.unitsCount,
        clientName: created.clientName,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-['Inter',sans-serif]">
      {/* =====================================================================
          PIXEL-ACCURATE https://myquext.com/# TOP HEADER BAR
      ===================================================================== */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 shadow-2xs">
        {/* Left: [quext] Logo + Main Platform Navigation */}
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            onClick={() => onSelectTopTab('salesHub')}
            className="flex items-center shrink-0 cursor-pointer group focus:outline-none"
            title="https://myquext.com/#"
          >
            <span className="text-[22px] font-bold tracking-tight text-slate-900 font-['Inter_Tight',sans-serif] flex items-center">
              <span className="text-blue-600 font-normal mr-0.5">[</span>
              <span>quext</span>
              <span className="text-blue-600 font-normal ml-0.5">]</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              type="button"
              onClick={() => onSelectTopTab('salesHub')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTopTab === 'salesHub'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <span>Sales Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100/80 text-blue-700 font-bold tabular-nums">
                {quotes.length}
              </span>
            </button>

            <button
              type="button"
              data-tutorial-id="top-nav-operations"
              onClick={() => {
                onSelectTopTab('operations');
                if (operationsMainTab === 'quotes') {
                  onGoToOperationsDashboard();
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTopTab === 'operations'
                  ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <span>Operations</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  activeTopTab === 'operations'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTopTab('customerSuccess')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                activeTopTab === 'customerSuccess'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              Customer Success
            </button>

            <button
              type="button"
              onClick={() => onSelectTopTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                activeTopTab === 'reports'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              Reports
            </button>

            <button
              type="button"
              onClick={() => onSelectTopTab('productCatalog')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                activeTopTab === 'productCatalog'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              Product Catalog
            </button>
          </nav>
        </div>

        {/* Right: Search buildings/contacts + Live Sync + Bug Icon + Raul Recalde Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search Pill matching myquext.com */}
          <div className="relative hidden sm:block">
            <div className="flex items-center w-60 lg:w-72 h-9 px-3 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-slate-500 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setShowGlobalSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowGlobalSearchDropdown(false), 180)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowGlobalSearchDropdown(true);
                }}
                placeholder="Search buildings, contacts..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
              />
              <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </div>

            {/* Quick Search Results Dropdown across all myquext opportunities & projects */}
            {showGlobalSearchDropdown && globalSearch.trim().length > 0 && (
              <div className="absolute right-0 mt-1.5 w-96 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                <div className="px-3 py-2 bg-slate-50 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                  <span>myquext.com Opportunities &amp; Projects</span>
                  <span>{filteredOpportunities.length} matches</span>
                </div>
                {filteredOpportunities.slice(0, 8).map((item) => {
                  const isWon = item.stage === 'Deal Won';
                  return (
                    <div
                      key={item.id}
                      className="px-3.5 py-2.5 hover:bg-blue-50/60 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {item.propertyName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.clientName} • {item.unitsCount} units • {item.city}, {item.state}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isWon ? (
                          <button
                            type="button"
                            onMouseDown={() => handleOpenProjectInOperations(item.id)}
                            className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 cursor-pointer"
                          >
                            Open in Ops →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onMouseDown={() => handleQuickPromoteToDealWon(item)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 cursor-pointer"
                          >
                            Mark Deal Won
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Multi-User Cloud Sync Indicator */}
          <CloudSyncIndicator />

          {/* Live Sync from myquext.com Firestore button (Small Square Reload Symbol) */}
          <button
            type="button"
            onClick={onSyncLiveMyQuext}
            disabled={isSyncingLive}
            title={
              lastSyncedInfo ||
              (isSyncingLive ? 'Syncing myquext.com...' : 'Live myquext.com Sync')
            }
            aria-label="Live myquext.com Sync"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingLive ? 'animate-spin' : ''}`} />
          </button>

          {/* Toggle Standalone Mode */}
          <button
            type="button"
            onClick={onToggleStandaloneMode}
            title="Switch between myquext.com Platform Shell and Standalone Operations Mode"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden 2xl:inline">Standalone View</span>
          </button>

          {/* Bug Icon matching screenshot */}
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((v) => !v)}
            title="Report a Bug"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bug className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Badge + Dropdown Menu matching Screenshot 1 */}
          <div className="relative">
            <button
              type="button"
              data-tutorial-id="top-nav-profile-menu"
              onClick={() => setIsProfileMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-left"
              title={`${currentUserName} (${currentUserEmail})`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUserAvatarInitial}
              </div>
              <div className="hidden lg:block leading-tight">
                <div className="text-xs font-semibold text-slate-800">{currentUserName}</div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {currentUserRoleLabel}
                </div>
              </div>
            </button>

            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-[260px] bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-50 text-left">
                  {/* Header: Raul Recalde / raul.recalde@onequext.com */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      {currentUserName}
                    </p>
                    <p className="text-xs font-normal text-slate-500 truncate mt-0.5">
                      {currentUserEmail}
                    </p>
                  </div>

                  {/* Section 1 */}
                  <div className="py-1.5">
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>My Profile &amp; Notifications</span>
                      <UserCheck className="w-4 h-4 text-[#635bff] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Team Management</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSelectTopTab('operations');
                        onGoToOperationsDashboard();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenPMTutorial?.();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50/80 flex items-center justify-between cursor-pointer transition-colors group"
                      title="Interactive guidance tutorial for training Project Managers"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                        <span className="font-semibold text-blue-800">PM Onboarding Tutorial</span>
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 rounded-full shrink-0">
                        Training
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 2 */}
                  <div className="py-1.5">
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                    >
                      <span className="leading-snug text-left">
                        Bug Tracker &amp; What&apos;s
                        <br />
                        New
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-[#635bff] border border-indigo-200/80 rounded-full shrink-0">
                        New
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Report a Bug</span>
                      <Bug className="w-4 h-4 text-rose-600 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Request a Feature</span>
                      <Lightbulb className="w-4 h-4 text-[#635bff] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Developer Hub</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 3: Logout */}
                  <div className="pt-1.5 pb-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          DEAL WON LIVE PROVISIONING BANNER (WHEN STAGE CHANGED TO DEAL WON)
      ===================================================================== */}
      {toastBanner && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 z-40">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 font-bold">
              🔔
            </span>
            <span>
              <strong>GONG! Deal Won:</strong>{' '}
              <span className="underline font-bold">{toastBanner.propertyName}</span> (
              {toastBanner.units} units • {toastBanner.clientName}) has been automatically
              provisioned as an active installation project in the{' '}
              <strong>Operations</strong> workspace!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const pid = toastBanner.projectId;
                setToastBanner(null);
                handleOpenProjectInOperations(pid);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-xs cursor-pointer"
            >
              <span>Open in Operations Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              className="text-white/80 hover:text-white px-1.5 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN BODY: SWITCH BY TOP TAB (SALES HUB vs OPERATIONS vs OTHERS)
      ===================================================================== */}
      {activeTopTab === 'salesHub' && (
        <div className="flex-1 flex min-h-0">
          {/* -----------------------------------------------------------------
              LEFT SIDEBAR: SALES HUB (Pipeline, Quotes & Leads)
              Matches https://myquext.com/# screenshot pixel-for-pixel
          ----------------------------------------------------------------- */}
          <aside
            className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all ${
              sidebarCollapsed ? 'w-16 p-2.5 items-center' : 'w-64 p-4'
            }`}
          >
            <div
              className={`pb-4 mb-2 border-b border-slate-100 flex items-center justify-between w-full ${
                sidebarCollapsed ? 'px-0 justify-center' : 'px-2'
              }`}
            >
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-base font-semibold font-['Inter_Tight',sans-serif] text-slate-900 tracking-tight truncate">
                    Sales Hub
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Pipeline, Quotes &amp; Leads
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                title={sidebarCollapsed ? 'Expand Sales Hub menu' : 'Collapse Sales Hub menu'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            <nav className="flex flex-col space-y-1 flex-1 overflow-y-auto w-full">
              {(
                [
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: 4 },
                  { id: 'pipeline', label: 'Pipeline', icon: Kanban, badge: quotes.length },
                  { id: 'meetings', label: 'Meetings', icon: Calendar },
                  { id: 'quotes', label: 'Quotes', icon: FileText, badge: quotes.filter((q) => q.myquextSource !== 'lead').length },
                  { id: 'accounts', label: 'Accounts', icon: Building2, badge: 112 },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = salesSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSalesSubTab(item.id)}
                    className={`py-2 text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap ${
                      sidebarCollapsed ? 'px-2.5 justify-center w-10 h-10' : 'px-3 text-left w-full'
                    } ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && 'badge' in item && item.badge ? (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none text-slate-600 bg-slate-100 rounded-md tabular-nums shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              {sidebarCollapsed ? (
                <div className="my-2 w-8 border-t border-slate-100" />
              ) : (
                <div className="pt-4 pb-1.5 w-full">
                  <h3 className="text-xs font-medium text-slate-400 px-3">Resources</h3>
                </div>
              )}

              {(
                [
                  {
                    id: 'leads',
                    label: 'Leads',
                    icon: Users,
                    badge: quotes.filter((q) => q.myquextSource === 'lead').length,
                  },
                  { id: 'pulse', label: 'Pulse', icon: Activity },
                  { id: 'discovery', label: 'Discovery', icon: Compass },
                  { id: 'gfiberDeals', label: 'GFiber Deals', icon: Award },
                  { id: 'dealMap', label: 'Deal Map', icon: MapPin },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = salesSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSalesSubTab(item.id)}
                    className={`py-2 text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap ${
                      sidebarCollapsed ? 'px-2.5 justify-center w-10 h-10' : 'px-3 text-left w-full'
                    } ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && 'badge' in item && item.badge ? (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none text-slate-600 bg-slate-100 rounded-md tabular-nums shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            {/* Bottom New Analysis Button matching screenshot */}
            <div
              className={`mt-auto pt-4 border-t border-slate-100 w-full ${
                sidebarCollapsed ? 'px-0 flex justify-center' : 'px-1'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsNewAnalysisModalOpen(true)}
                className={`${
                  sidebarCollapsed ? 'w-10 h-9 px-0' : 'w-full h-9 px-4'
                } bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center text-xs shadow-2xs cursor-pointer gap-2`}
              >
                <Plus className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>New Analysis</span>}
              </button>
            </div>
          </aside>

          {/* -----------------------------------------------------------------
              SALES HUB MAIN CONTENT AREA
          ----------------------------------------------------------------- */}
          <div className="flex-1 min-w-0 bg-slate-50/70 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {salesSubTab === 'dashboard' && (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* "What's Happening" Header Row matching screenshot */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-[26px] sm:text-[28px] font-semibold font-['Inter_Tight',sans-serif] text-slate-900 tracking-tight leading-tight">
                        What&apos;s Happening
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <div className="inline-flex items-center justify-center h-9 px-3.5 bg-white rounded-lg border border-slate-200/90 text-xs font-medium text-slate-700 shadow-2xs gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{quotes.length} Live Opportunities</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 font-semibold">
                        {projects.length} Deal Won in Ops
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Bar matching screenshot: All | Mentions | Leading | Contributing */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'mentions', label: '@ Mentions' },
                        { id: 'Leading', label: 'Leading' },
                        { id: 'Contributing', label: 'Contributing' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setWhatsHappeningFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          whatsHappeningFilter === tab.id
                            ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 font-medium'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSalesSubTab('quotes')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-xs font-semibold text-blue-600 shadow-2xs cursor-pointer"
                    >
                      <span>View All {quotes.length} Opportunities</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* =============================================================
                    CARD 1: AI PROSPECTING — DAILY TARGETS 🎯
                    Exact match to screenshot (Brookridge Redevelopment Project & Cortland Old Fourth Ward)
                    + Direct Stage Selector to mark "Deal Won" -> creates Operations Project!
                ============================================================= */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        [q]
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">
                            AI Prospecting
                          </span>
                          <span className="text-xs text-slate-400">generated daily targets</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Today, 12:00 AM</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Interactive Stage Sync
                    </span>
                  </div>

                  <div className="pl-0 sm:pl-13 space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>Daily Targets</span>
                        <span>🎯</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Suggested AI prospecting targets for today from{' '}
                        <span className="font-mono text-slate-700">myquext.com</span>. Change any
                        target&apos;s stage to <strong className="text-emerald-700">Deal Won</strong>{' '}
                        to immediately create its project in the <strong>Operations</strong> tab:
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {dailyTargets.slice(0, 2).map((target) => {
                        const isWon = target.stage === 'Deal Won';
                        const currentLabel =
                          target.myquextStage || (isWon ? 'Deal Won' : 'AI Prospecting Target');
                        return (
                          <div
                            key={target.id}
                            className={`rounded-xl border p-4 transition-all ${
                              isWon
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-slate-900">
                                    {target.propertyName}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                                    {target.unitsCount} Units
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    • {target.clientName}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>
                                    {target.address}, {target.city}, {target.state}
                                  </span>
                                </div>
                                {target.notes && (
                                  <p className="text-xs text-slate-500 pt-0.5">{target.notes}</p>
                                )}
                              </div>

                              {/* Stage Selector & Action Button */}
                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <select
                                  value={currentLabel}
                                  onChange={(e) =>
                                    handleStageChangeWithToast(target, e.target.value)
                                  }
                                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                                    isWon
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {MYQUEXT_STAGE_OPTIONS.map((opt) => (
                                    <option key={opt.label} value={opt.label}>
                                      {opt.label === 'Deal Won' ? '★ Deal Won' : opt.label}
                                    </option>
                                  ))}
                                </select>

                                {isWon ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenProjectInOperations(target.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                                  >
                                    <span>Open in Operations</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickPromoteToDealWon(target)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Move to Deal Won</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* =============================================================
                    CARD 2: ACTIVE MYQUEXT.COM OPPORTUNITIES FEED
                    Every real opportunity from myquext.com with live stage selector
                ============================================================= */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900 font-['Inter_Tight',sans-serif]">
                          Live myquext.com Sales Hub Opportunities ({filteredOpportunities.length})
                        </h2>
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          Real-Time Operations Provisioning
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Every opportunity synced from <span className="font-mono">myquext.com</span>.
                        Change any stage to <strong className="text-emerald-700">Deal Won</strong> to
                        automatically create or update its project in the{' '}
                        <strong>Operations</strong> workspace.
                      </p>
                    </div>

                    {/* Stage & Rep Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Stages ({quotes.length})</option>
                        <option value="Deal Won">
                          ★ Deal Won / Kickoff ({quotes.filter((q) => q.stage === 'Deal Won').length})
                        </option>
                        <option value="Proposal Sent">
                          Estimate Sent ({quotes.filter((q) => q.stage === 'Proposal Sent').length})
                        </option>
                        <option value="Needs Analysis">
                          Survey/Design Requested (
                          {quotes.filter((q) => q.stage === 'Needs Analysis').length})
                        </option>
                        <option value="Prospect">
                          Draft / New Construction / Leads (
                          {quotes.filter((q) => q.stage === 'Prospect').length})
                        </option>
                      </select>

                      <select
                        value={repFilter}
                        onChange={(e) => setRepFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Sales Reps</option>
                        {salesReps.map((rep) => (
                          <option key={rep} value={rep}>
                            {rep}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Opportunity Feed List */}
                  <div className="divide-y divide-slate-100">
                    {filteredOpportunities.slice(0, 35).map((opp) => {
                      const isWon = opp.stage === 'Deal Won';
                      const currentLabel =
                        opp.myquextStage || (isWon ? 'Deal Won' : 'Estimate Sent');
                      const totalBomDevices = opp.bomItems.reduce((s, b) => s + b.quantity, 0);

                      return (
                        <div
                          key={opp.id}
                          className={`py-3.5 px-3 rounded-xl transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                            isWon ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-slate-900">
                                {opp.propertyName}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 rounded">
                                {opp.unitsCount} Units
                              </span>
                              <span className="text-xs font-medium text-slate-600">
                                {opp.clientName}
                              </span>
                              {opp.buildType && (
                                <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded">
                                  {opp.buildType}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <span>
                                📍 {opp.address}, {opp.city}, {opp.state}
                              </span>
                              <span>•</span>
                              <span>
                                Rep: <strong className="text-slate-700">{opp.assignedSalesLead}</strong>
                              </span>
                              <span>•</span>
                              <span className="font-mono text-[11px] text-slate-600">
                                Hardware: ${opp.totalHardwareAmount.toLocaleString()} ({opp.bomItems.length}{' '}
                                BOM lines / {totalBomDevices.toLocaleString()} devices)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <select
                              value={
                                MYQUEXT_STAGE_OPTIONS.some((o) => o.label === currentLabel)
                                  ? currentLabel
                                  : isWon
                                  ? 'Deal Won'
                                  : 'Estimate Sent'
                              }
                              onChange={(e) => handleStageChangeWithToast(opp, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                                isWon
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {MYQUEXT_STAGE_OPTIONS.map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  {opt.label === 'Deal Won' ? '★ Deal Won' : opt.label}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectTopTab('operations');
                                onViewQuoteAnalysis(opp.id);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                            >
                              BOM Quote
                            </button>

                            {isWon ? (
                              <button
                                type="button"
                                onClick={() => handleOpenProjectInOperations(opp.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                              >
                                <span>Open Project in Ops</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleQuickPromoteToDealWon(opp)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Deal Won → Ops</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredOpportunities.length > 35 && (
                    <div className="pt-3 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={() => setSalesSubTab('quotes')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        View all {filteredOpportunities.length} matching opportunities in Full Quotes
                        Table →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                SALES HUB -> PIPELINE / QUOTES / LEADS / OTHER SUB-TABS
            --------------------------------------------------------------- */}
            {salesSubTab !== 'dashboard' && (
              <div className="max-w-7xl mx-auto space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                        myquext.com Sales Hub
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 capitalize font-medium">
                        {salesSubTab}
                      </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 font-['Inter_Tight',sans-serif] mt-1">
                      {salesSubTab === 'leads'
                        ? 'AI Prospecting & Targeting Leads'
                        : salesSubTab === 'pipeline'
                        ? 'Deal Stage Pipeline & Operations Handoff'
                        : 'All myquext.com Quotes & Opportunities'}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Changing any opportunity&apos;s stage to{' '}
                      <strong className="text-emerald-700">Deal Won</strong> immediately creates its
                      project inside the <strong>Operations</strong> workspace with its Smart
                      Community BOM.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                      className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Stages ({quotes.length})</option>
                      <option value="Deal Won">
                        ★ Deal Won / Project Kickoff (
                        {quotes.filter((q) => q.stage === 'Deal Won').length})
                      </option>
                      <option value="Proposal Sent">
                        Estimate Sent ({quotes.filter((q) => q.stage === 'Proposal Sent').length})
                      </option>
                      <option value="Needs Analysis">
                        Survey/Design Requested (
                        {quotes.filter((q) => q.stage === 'Needs Analysis').length})
                      </option>
                      <option value="Prospect">
                        Draft / Leads ({quotes.filter((q) => q.stage === 'Prospect').length})
                      </option>
                    </select>

                    <select
                      value={repFilter}
                      onChange={(e) => setRepFilter(e.target.value)}
                      className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Sales Reps</option>
                      {salesReps.map((rep) => (
                        <option key={rep} value={rep}>
                          {rep}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsNewAnalysisModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Opportunity</span>
                    </button>
                  </div>
                </div>

                {/* Full Opportunities Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Property / Opportunity</th>
                          <th className="py-3 px-3">Owner / Client</th>
                          <th className="py-3 px-3">Sales Rep</th>
                          <th className="py-3 px-3">Units</th>
                          <th className="py-3 px-4">myquext.com Stage</th>
                          <th className="py-3 px-3 text-right">Quoted BOM</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredOpportunities
                          .filter((q) =>
                            salesSubTab === 'leads' ? q.myquextSource === 'lead' : true
                          )
                          .map((opp) => {
                            const isWon = opp.stage === 'Deal Won';
                            const currentLabel =
                              opp.myquextStage || (isWon ? 'Deal Won' : 'Estimate Sent');
                            return (
                              <tr
                                key={opp.id}
                                className={
                                  isWon
                                    ? 'bg-emerald-50/35 hover:bg-emerald-50/60'
                                    : 'hover:bg-slate-50'
                                }
                              >
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-slate-900 text-sm">
                                    {opp.propertyName}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {opp.address}, {opp.city}, {opp.state} •{' '}
                                    <span className="font-mono">{opp.quoteNumber}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-medium text-slate-800">
                                  {opp.clientName}
                                </td>
                                <td className="py-3 px-3 text-slate-600">
                                  {opp.assignedSalesLead}
                                </td>
                                <td className="py-3 px-3 font-mono font-semibold text-slate-900 tabular-nums">
                                  {opp.unitsCount}
                                </td>
                                <td className="py-3 px-4">
                                  <select
                                    value={
                                      MYQUEXT_STAGE_OPTIONS.some((o) => o.label === currentLabel)
                                        ? currentLabel
                                        : isWon
                                        ? 'Deal Won'
                                        : 'Estimate Sent'
                                    }
                                    onChange={(e) =>
                                      handleStageChangeWithToast(opp, e.target.value)
                                    }
                                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                                      isWon
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                        : 'bg-white text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {MYQUEXT_STAGE_OPTIONS.map((opt) => (
                                      <option key={opt.label} value={opt.label}>
                                        {opt.label === 'Deal Won' ? '★ Deal Won' : opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-slate-800 tabular-nums">
                                  <div className="font-semibold">
                                    ${opp.totalHardwareAmount.toLocaleString()}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {opp.bomItems.length} BOM lines
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSelectTopTab('operations');
                                        onViewQuoteAnalysis(opp.id);
                                      }}
                                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                                    >
                                      BOM
                                    </button>
                                    {isWon ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenProjectInOperations(opp.id)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                                      >
                                        <span>Open in Ops</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleQuickPromoteToDealWon(opp)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                                      >
                                        <span>Deal Won</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          OPERATIONS TAB: YOUR COMPLETE INSTALLATION WORKSPACE EMBEDDED INSIDE
          THE myquext.com SHELL!
      ===================================================================== */}
      {activeTopTab === 'operations' && (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sub-Navigation Bar inside the myquext.com Operations Tab */}
          <div
            data-tutorial-id="operations-subnav-bar"
            className="sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs transition-all"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Operations Workspace:</span>
              </span>

              <button
                type="button"
                data-tutorial-id="subnav-installation-overview"
                onClick={onGoToOperationsDashboard}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  operationsMainTab === 'operations' && operationsSubTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Installation Overview</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    operationsMainTab === 'operations' && operationsSubTab === 'dashboard'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {projects.length} Active
                </span>
              </button>

              <button
                type="button"
                data-tutorial-id="subnav-all-projects"
                onClick={() => {
                  onSelectOperationsMainTab('operations');
                  onSelectOperationsSubTab('all-projects');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'operations' && operationsSubTab === 'all-projects'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Projects ({projects.length})
              </button>

              <button
                type="button"
                data-tutorial-id="subnav-kickoff-attention"
                onClick={() => {
                  onSelectOperationsMainTab('operations');
                  onSelectOperationsSubTab('kickoff-attention');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'operations' && operationsSubTab === 'kickoff-attention'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Kickoff Attention
              </button>

              <button
                type="button"
                onClick={() => onSelectOperationsMainTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'home'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Live Activity Hub
              </button>

              <button
                type="button"
                onClick={() => onSelectOperationsMainTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'timeline'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Installation Timeline
              </button>

              <button
                type="button"
                onClick={() => onSelectOperationsMainTab('quotes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'quotes'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Quotes &amp; Deal Stage Sync ({quotes.length})
              </button>

              <button
                type="button"
                onClick={() => onSelectOperationsMainTab('analysis')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  operationsMainTab === 'analysis'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Quote Analysis
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-tutorial-id="subnav-field-tech-btn"
                onClick={onOpenFieldTechPortal || onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                <span>Field Tech Portal</span>
              </button>

              <button
                type="button"
                onClick={onResetData}
                title="Reset to default myquext.com opportunities & projects"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Embedded Operations Content */}
          <div className="flex-1">{children}</div>
        </div>
      )}

      {/* =====================================================================
          CUSTOMER SUCCESS / REPORTS / PRODUCT CATALOG TABS IN myquext.com SHELL
      ===================================================================== */}
      {activeTopTab === 'customerSuccess' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                myquext.com Customer Success
              </span>
              <h1 className="text-2xl font-semibold text-slate-900 font-['Inter_Tight',sans-serif] mt-1">
                Active Buildings &amp; CSM Portfolio ({projects.length})
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Properties transitioned from Sales Hub &amp; Operations into active Customer Success
                management.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenSowAutomation && (
                <button
                  type="button"
                  onClick={onOpenSowAutomation}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                  title="Open OneQuext SOW Google Form Automation Hub & Field Tech Dispatcher"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>SOW Automation Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onSelectTopTab('operations');
                  onGoToOperationsDashboard();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                <span>Go to Operations Installation Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SOW Automation Feature Hub in Customer Success */}
          {onOpenSowAutomation && (
            <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-teal-500/30 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative z-10 space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>OneQuext SOW Google Form Automation Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Automate SOW Intake &amp; Field Tech Dispatch
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Collect Google Form survey submissions, auto-generate official branded SOW PDF agreements,
                  and dispatch Field Techs (Sean Gates, Hector Lopez) with 1-click email and calendar notifications.
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <button
                  type="button"
                  onClick={onOpenSowAutomation}
                  className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>Launch SOW Automation Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 18).map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {proj.propertyName}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {proj.unitsCount} Units
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {proj.clientName} • {proj.city}, {proj.state}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Assigned CSM: <strong className="text-slate-800">{proj.assignedCSM}</strong> • PM:{' '}
                    <strong className="text-slate-800">{proj.assignedPM.name}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenProjectInOperations(proj.id)}
                  className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Open Project in Operations →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTopTab === 'reports' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 font-['Inter_Tight',sans-serif]">
                myquext.com Executive Reports &amp; Pipeline Velocity
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Live rollup across all {quotes.length} Sales Hub opportunities and {projects.length}{' '}
                active Operations installations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectTopTab('operations');
                onGoToOperationsDashboard();
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              Open Operations Dashboard →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Total myquext Opportunities</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{quotes.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Synced with myquext.com Firestore
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Deal Won / In Operations</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{projects.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {projects.reduce((s, p) => s + p.unitsCount, 0).toLocaleString()} total units under
                deployment
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Total Quoted Hardware</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                $
                {(
                  quotes.reduce((s, q) => s + q.totalHardwareAmount, 0) / 1_000_000
                ).toFixed(2)}
                M
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across all active BOM quotes</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Recurring Monthly SaaS (MRR)</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                ${quotes.reduce((s, q) => s + q.monthlyServiceFee, 0).toLocaleString()}/mo
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Smart Community &amp; Managed Wi-Fi</div>
            </div>
          </div>
        </div>
      )}

      {activeTopTab === 'productCatalog' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h1 className="text-2xl font-semibold text-slate-900 font-['Inter_Tight',sans-serif]">
              myquext.com Smart Community &amp; GFiber Product Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Standardized hardware SKUs automatically mapped to Operations BOMs when opportunities
              move to Deal Won.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Quext Smart Deadbolt Lock / Schlage BE467',
                sku: 'QXT-DL-900 / SCH-BE467',
                category: 'Smart Access Control',
                msrp: '$220.00',
                desc: 'BLE, NFC Apple/Google Wallet & fob residential entry lock.',
              },
              {
                name: 'Quext IoT Smart Thermostat (LoRaWAN)',
                sku: 'QXT-TH-300',
                category: 'Smart Thermostats & HVAC',
                msrp: '$165.00',
                desc: 'Hubless LoRaWAN smart thermostat with vacant unit HVAC automation.',
              },
              {
                name: 'Quext LoRaWAN Outdoor Gateway Base Station',
                sku: 'QXT-GW-LR8',
                category: 'IoT Gateways & Mesh',
                msrp: '$1,250.00',
                desc: 'IP67 8-channel property-wide LoRaWAN head-end controller.',
              },
              {
                name: 'Aeotec / Resideo L1 Smart Water Leak Detector',
                sku: 'QXT-LK-100',
                category: 'Sensors & Leak Protection',
                msrp: '$55.00',
                desc: 'Wireless water leak & freeze protection sensor for water heaters & laundry.',
              },
              {
                name: 'Managed Wi-Fi 7 Wallplate & Outdoor Access Points',
                sku: 'QXT-WF7-WP / CAM-XV2',
                category: 'Bulk Managed Wi-Fi',
                msrp: '$195.00',
                desc: 'High-density tri-band Wi-Fi 7 residential & amenity access points.',
              },
              {
                name: 'Quext Video Intercom & Perimeter Access Reader',
                sku: 'QXT-IC-20',
                category: 'Smart Access Control',
                msrp: '$1,450.00',
                desc: 'Touchscreen video directory intercom & mobile perimeter reader.',
              },
            ].map((prod) => (
              <div
                key={prod.sku}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded">
                    {prod.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{prod.msrp}</span>
                </div>
                <div className="font-semibold text-sm text-slate-900">{prod.name}</div>
                <div className="text-[11px] font-mono text-slate-400">SKU: {prod.sku}</div>
                <p className="text-xs text-slate-500">{prod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          NEW ANALYSIS / OPPORTUNITY MODAL
      ===================================================================== */}
      {isNewAnalysisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 font-['Inter_Tight',sans-serif]">
                New myquext.com Opportunity / Quote
              </h3>
              <button
                type="button"
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateOpportunitySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="e.g. Cortland Buckhead Phase II"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Owner / Management Company
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMarkWon}
                  onChange={(e) => setNewMarkWon(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span className="font-semibold text-emerald-800">
                  Set stage to &quot;Deal Won&quot; &amp; create Operations project immediately
                </span>
              </label>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAnalysisModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
