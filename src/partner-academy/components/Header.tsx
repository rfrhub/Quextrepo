import React, { useState } from 'react';
import { useAuth, isQuextEmployeeUser } from '../context/AuthContext';
import { QuextLogo } from './QuextLogo';
import { ShieldCheck, UserCheck, Building2, Award, ChevronDown, Zap } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLoginModal: () => void;
  onOpenCertModal: () => void;
  onOpenInstallersClip?: () => void;
  onOpenUnifiedSignInModal?: () => void;
  onExitToOperationsHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLoginModal,
  onOpenCertModal,
  onOpenInstallersClip,
  onOpenUnifiedSignInModal,
  onExitToOperationsHub,
}) => {
  const { currentUser, currentCompany, switchRole } = useAuth();
  const isQuextEmployee = isQuextEmployeeUser(currentUser, currentCompany);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels: Record<string, string> = {
    partner_installer: 'Field Installer',
    partner_admin: 'Partner Admin',
    quext_director: 'Quext Director',
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const guidesItems = [
    {
      id: 'befe_guide',
      title: 'BE/FE Field Guide',
      desc: 'Schlage Control BE467 / FE410 onboarding & 2-turn thumbturn FDR',
      group: 'locks',
    },
    {
      id: 'ndeb_guide',
      title: 'NDEB Field Guide',
      desc: 'Schlage NDE/NDEB wireless lever reset pin & 3-turn handle sequence',
      group: 'locks',
    },
    {
      id: 'xe360_guide',
      title: 'XE360 Field Guide',
      desc: 'Schlage XE360 architectural exit trim/mortise 5s mode switch FDR',
      group: 'locks',
    },
    {
      id: 'rc_reader_guide',
      title: 'RC Reader Controller Field Guide',
      desc: 'Schlage RC11 / RC15 pure IP reader network & 7-14s FDR reset',
      group: 'locks',
    },
    {
      id: 'gateway_guide',
      title: 'Smart Community Gateway Guide',
      desc: 'TEKTELIC outdoor gateway mounting, Unistrut & antenna, T568B wiring, PoE & verification',
      group: 'general',
    },
    {
      id: 'wallet_guide',
      title: 'Wallet Upgrade',
      desc: 'Mobile credential reader upgrade & Apple/Google Wallet provisioning',
      group: 'general',
    },
    {
      id: 'portal_guide',
      title: 'Quext Portal',
      desc: 'Installer portal commissioning, property device binding & tests',
      group: 'general',
    },
    {
      id: 'thermostat_flow',
      title: 'Integrated Thermostats',
      desc: 'Interactive 12-page sub-base wiring & onboarding flow simulator',
      group: 'general',
    },
    {
      id: 'leak_sensors',
      title: 'Leak Sensors',
      desc: 'Water leak detector & toilet tank run sensor installation',
      group: 'general',
    },
    {
      id: 'qr_intercom_guide',
      title: 'QR Intercom Plaque',
      desc: 'Physical plaque mounting, visitor flow & tenant directory onboarding',
      group: 'general',
    },
    {
      id: 'integration_checklists',
      title: 'Integration Checklists',
      desc: 'Hardware verification checklists for Brivo, door strikes & relays',
      group: 'general',
    },
    {
      id: 'spec_sheets',
      title: 'Spec Sheets, Manuals & Cut Sheets',
      desc: 'Official OEM data sheets, door prep templates, hole routing blueprints, and user guides',
      group: 'specs',
    },
  ];

  const schematicsWiringItems = [
    {
      id: 'butterfly_wiring',
      title: 'Butterfly Intercom Wiring',
      desc: '8" & 12" Video Intercom connected to Quext RC Reader Controller REX & Common',
    },
    {
      id: 'schematics_lab',
      title: 'RC Schematics',
      desc: 'Elevator, 12V/24V strike, RBSN relay & PS914-2RS wiring blueprints',
    },
    {
      id: 'wiring_sandbox',
      title: 'Quext thermostat Wiring Sandbox',
      desc: 'Interactive 24VAC HVAC R/C/W/Y/G/Aux lead simulator & official reference diagrams',
    },
  ];

  const isGuidesActive = guidesItems.some((item) => item.id === currentTab);
  const isSchematicsWiringActive = schematicsWiringItems.some((item) => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('curriculum')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-md cursor-pointer"
        >
          <QuextLogo size="md" />
        </button>

        {/* Zone 2: Navigation bar consolidated like myquext.com & onequext.com */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-semibold text-zinc-300">
          {/* 1. Field Courses (kept where it is) */}
          <button
            onClick={() => setCurrentTab('curriculum')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'curriculum'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Field Courses
          </button>

          {/* 2. Guides Parent Dropdown Tab */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('guides')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => {
                if (isGuidesActive) {
                  setOpenDropdown(openDropdown === 'guides' ? null : 'guides');
                } else {
                  setCurrentTab('wallet_guide');
                }
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isGuidesActive
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Guides</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'guides' ? 'rotate-180 text-purple-300' : 'text-zinc-400'
                }`}
              />
            </button>

            {/* Guides Dropdown Menu styled after onequext.com */}
            {openDropdown === 'guides' && (
              <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-[#0c0c0e] border border-white/10 ring-1 ring-white/5 rounded-2xl shadow-2xl shadow-black/80 p-2.5 w-[360px] max-h-[500px] overflow-y-auto scrollbar-thin">
                  <div className="px-2.5 py-1.5 mb-1 border-b border-white/5 flex items-center justify-between">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
                      Field Installation Guides
                    </p>
                    <span className="text-[9px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded">
                      {guidesItems.length} Guides
                    </span>
                  </div>
                  <div className="space-y-1">
                    {guidesItems.map((guide) => {
                      const isActive = currentTab === guide.id;
                      return (
                        <button
                          key={guide.id}
                          onClick={() => {
                            setCurrentTab(guide.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-purple-950/50 border border-purple-500/30 text-white'
                              : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[13px] font-semibold ${
                                isActive ? 'text-purple-300' : 'group-hover:text-purple-300'
                              } transition-colors`}
                            >
                              {guide.title}
                            </span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 leading-snug mt-0.5 line-clamp-1">
                            {guide.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Schematics and Wiring Parent Dropdown Tab */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('schematics_wiring')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => {
                if (isSchematicsWiringActive) {
                  setOpenDropdown(openDropdown === 'schematics_wiring' ? null : 'schematics_wiring');
                } else {
                  setCurrentTab('butterfly_wiring');
                }
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSchematicsWiringActive
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Schematics and Wiring</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'schematics_wiring' ? 'rotate-180 text-purple-300' : 'text-zinc-400'
                }`}
              />
            </button>

            {/* Schematics and Wiring Dropdown Menu */}
            {openDropdown === 'schematics_wiring' && (
              <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-[#0c0c0e] border border-white/10 ring-1 ring-white/5 rounded-2xl shadow-2xl shadow-black/80 p-2.5 w-[350px]">
                  <div className="px-2.5 py-1.5 mb-1 border-b border-white/5 flex items-center justify-between">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
                      Schematics &amp; Wiring Labs
                    </p>
                    <span className="text-[9px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded">
                      {schematicsWiringItems.length} Diagrams
                    </span>
                  </div>
                  <div className="space-y-1">
                    {schematicsWiringItems.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentTab(item.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-purple-950/50 border border-purple-500/30 text-white'
                              : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[13px] font-semibold ${
                                isActive ? 'text-purple-300' : 'group-hover:text-purple-300'
                              } transition-colors`}
                            >
                              {item.title}
                            </span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 leading-snug mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Spec Sheets Manuals and Cut sheets */}
          <button
            onClick={() => setCurrentTab('spec_sheets')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'spec_sheets'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Spec Sheets Manuals and Cut sheets
          </button>

          {/* 5. Certificates */}
          <button
            onClick={onOpenCertModal}
            className="px-3.5 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer"
          >
            Certificates
          </button>

          {/* 5. Company Portal (for admin/director roles) */}
          {currentUser.role !== 'partner_installer' && (
            <button
              onClick={() => setCurrentTab('admin_portal')}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'admin_portal'
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Company Portal
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Installers Clip Field App Action Button */}
          <button
            type="button"
            onClick={onOpenInstallersClip || (() => setCurrentTab('installers_clip'))}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md border border-sky-400/40 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Open Installers Clip — In-the-Field Logging App for Integrator Partners"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
            <span className="hidden sm:inline">Installers Clip</span>
            <span className="sm:hidden">Clip</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded text-[9px] font-black uppercase tracking-wider">
              Field
            </span>
          </button>

          {/* Quick Role & Company Context Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-zinc-800 hover:border-zinc-700 text-left text-xs transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-white max-w-[120px] truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-purple-400 font-medium leading-none mt-0.5 font-mono">
                  {roleLabels[currentUser.role]} · {currentCompany.code}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
            </button>

            {/* Dropdown for role selection */}
            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <div className="font-bold text-white text-sm">{currentUser.name}</div>
                  <div className="text-zinc-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{currentCompany.name}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                    FIELD ID: {currentUser.fieldIdNumber}
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 tracking-wider uppercase font-mono">
                    Select Active Role
                  </div>

                  <button
                    onClick={() => {
                      switchRole('partner_installer');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      currentUser.role === 'partner_installer'
                        ? 'bg-purple-950/40 text-purple-300 font-bold border border-purple-500/30'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-400" />
                      Field Installer
                    </span>
                    {currentUser.role === 'partner_installer' && (
                      <span className="text-[10px] text-purple-400 font-mono">ACTIVE</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('partner_admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      currentUser.role === 'partner_admin'
                        ? 'bg-purple-950/40 text-purple-300 font-bold border border-purple-500/30'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Partner Admin
                    </span>
                    {currentUser.role === 'partner_admin' && (
                      <span className="text-[10px] text-purple-400 font-mono">ACTIVE</span>
                    )}
                  </button>

                  {isQuextEmployee && (
                    <button
                      onClick={() => {
                        switchRole('quext_director');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        currentUser.role === 'quext_director'
                          ? 'bg-purple-950/40 text-purple-300 font-bold border border-purple-500/30'
                          : 'text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" />
                        Quext Director
                      </span>
                      {currentUser.role === 'quext_director' && (
                        <span className="text-[10px] text-purple-400 font-mono">ACTIVE</span>
                      )}
                    </button>
                  )}
                </div>

                <div className="border-t border-zinc-800/80 pt-1 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onOpenLoginModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Partner Profile &amp; Company</span>
                  </button>
                  {onExitToOperationsHub && (
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onExitToOperationsHub();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-zinc-900 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {onExitToOperationsHub && (
            <button
              onClick={onExitToOperationsHub}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full transition-colors cursor-pointer"
              title="Sign out of Partner Academy"
            >
              <span>Sign Out</span>
            </button>
          )}

          {/* Portal Sign-in */}
          <button
            onClick={onOpenLoginModal}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-md transition-all whitespace-nowrap active:scale-95 cursor-pointer"
          >
            Partner Portal
          </button>
        </div>
      </div>
    </header>
  );
};
