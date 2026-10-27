import React, { useState } from 'react';
import { useAuth, isQuextEmployeeUser } from '../context/AuthContext';
import { QuextLogo } from './QuextLogo';
import { ShieldCheck, UserCheck, Building2, Award, ChevronDown, Zap, Menu, X, Copy, Check, Share2 } from 'lucide-react';
import { buildPartnerAcademyPortalUrl } from '../../types';

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
  const { currentUser, currentCompany } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyPartnerLink = () => {
    const url = buildPartnerAcademyPortalUrl(currentCompany?.name || undefined);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('curriculum')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-md cursor-pointer shrink-0"
        >
          <div className="flex items-center gap-2">
            <QuextLogo size="sm" showSubtitle={false} />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-purple-300 border border-purple-500/30">
              Academy
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation bar consolidated like myquext.com & onequext.com */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 text-xs font-semibold text-zinc-300 min-w-0">
          {/* 1. Field Courses */}
          <button
            onClick={() => setCurrentTab('curriculum')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'curriculum'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden 2xl:inline">Field </span>Courses
          </button>

          {/* 2. Guides Parent Dropdown Tab */}
          <div
            className="relative shrink-0"
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
              className={`px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 whitespace-nowrap cursor-pointer ${
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
            className="relative shrink-0"
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
              className={`px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isSchematicsWiringActive
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span><span className="hidden 2xl:inline">Wiring &amp; </span>Schematics</span>
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

          {/* 4. Spec Sheets, Manuals & Cut Sheets */}
          <button
            onClick={() => setCurrentTab('spec_sheets')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'spec_sheets'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            title="Spec Sheets, OEM Manuals, Templates & Cut Sheets"
          >
            <span>Spec Sheets</span>
          </button>

          {/* 5. Certificates */}
          <button
            onClick={onOpenCertModal}
            className="px-2.5 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Certificates
          </button>

          {/* 6. Company Portal (for admin/director roles) */}
          {currentUser.role !== 'partner_installer' && (
            <button
              onClick={() => setCurrentTab('admin_portal')}
              className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                currentTab === 'admin_portal'
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Company Portal
            </button>
          )}
        </nav>

        {/* Zone 3: Actions - guaranteed shrink-0 ml-auto, flex-nowrap, neatly spaced */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto flex-nowrap">
          {/* Read-Only Verified Partner Identity Pill (User switching removed) */}
          <div
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#111114] border border-zinc-800 text-left shrink-0 shadow-sm"
            title={`Authenticated Partner Session: ${currentUser.name} (${currentCompany.name})`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-[11px] shadow-sm shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 max-w-[85px] sm:max-w-[120px] 2xl:max-w-[150px]">
              <div className="font-semibold text-white text-xs truncate leading-tight flex items-center gap-1">
                <span className="truncate">{currentUser.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </div>
              <div className="text-[10px] text-purple-300/90 font-mono truncate leading-none mt-0.5">
                {currentCompany.code || currentCompany.name}
              </div>
            </div>
          </div>

          {/* Copy Partner Link Button */}
          <button
            type="button"
            onClick={handleCopyPartnerLink}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-full transition-colors cursor-pointer shrink-0"
            title="Copy pre-authenticated Partner Academy link for field integrators"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden 2xl:inline">{copiedLink ? 'Link Copied!' : 'Copy Partner Link'}</span>
            <span className="2xl:hidden">{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>

          {/* Installers Clip Field App Action Button */}
          <button
            type="button"
            onClick={onOpenInstallersClip || (() => setCurrentTab('installers_clip'))}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md border border-sky-400/30 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Open Installers Clip — In-the-Field Logging App for Integrator Partners"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
            <span className="hidden sm:inline">Installers Clip</span>
            <span className="sm:hidden">Clip</span>
          </button>

          {/* Sign Out Button (if returned to operations hub or authenticated session) */}
          {onExitToOperationsHub && (
            <button
              type="button"
              onClick={onExitToOperationsHub}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-colors cursor-pointer shrink-0"
              title="Sign out of Partner Academy"
            >
              <span>Sign Out</span>
            </button>
          )}

          {/* Mobile Nav Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-0.5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-zinc-800 mt-3 pt-3 pb-2 space-y-1">
          <button
            onClick={() => {
              setCurrentTab('curriculum');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentTab === 'curriculum'
                ? 'bg-purple-950/50 text-purple-300 font-bold border border-purple-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            Field Courses
          </button>
          <button
            onClick={() => {
              setCurrentTab('wallet_guide');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              isGuidesActive
                ? 'bg-purple-950/50 text-purple-300 font-bold border border-purple-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            Field Installation Guides
          </button>
          <button
            onClick={() => {
              setCurrentTab('butterfly_wiring');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              isSchematicsWiringActive
                ? 'bg-purple-950/50 text-purple-300 font-bold border border-purple-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            Schematics &amp; Wiring
          </button>
          <button
            onClick={() => {
              setCurrentTab('spec_sheets');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentTab === 'spec_sheets'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            Spec Sheets, Manuals &amp; Cut Sheets
          </button>
          <button
            onClick={() => {
              onOpenCertModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Certificates
          </button>
          {currentUser.role !== 'partner_installer' && (
            <button
              onClick={() => {
                setCurrentTab('admin_portal');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                currentTab === 'admin_portal'
                  ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              Company Portal
            </button>
          )}
        </div>
      )}
    </header>
  );
};
