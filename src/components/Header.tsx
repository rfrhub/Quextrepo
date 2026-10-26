import React, { useState, useEffect } from 'react';
import {
  Layers,
  FileText,
  Building2,
  Calendar,
  Mail,
  LogOut,
  Wrench,
  ChevronDown,
  Activity,
  Menu,
  X,
  BookOpen,
  Zap,
} from 'lucide-react';
import { QuextLogo } from './QuextLogo';
import { initAuth, subscribeToGmailAuth, logout } from '../services/gmailService';
import { GoogleSignInButton } from './GoogleSignInButton';

interface HeaderProps {
  currentMainTab: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis';
  onSelectMainTab: (tab: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis') => void;
  onGoToOperationsDashboard: () => void;
  wonProjectsCount: number;
  totalQuotesCount: number;
  onOpenLoginModal?: () => void;
  onOpenPartnerAcademy?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMainTab,
  onSelectMainTab,
  onGoToOperationsDashboard,
  wonProjectsCount,
  totalQuotesCount,
  onOpenLoginModal,
  onOpenPartnerAcademy,
}) => {
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubInit = initAuth(
      (user) => {
        setGmailUserEmail(user.email);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
      }
    );
    const unsubState = subscribeToGmailAuth(({ user, needsAuth: reqAuth }) => {
      setGmailUserEmail(user?.email || null);
      setNeedsAuth(reqAuth);
    });
    return () => {
      unsubInit();
      unsubState();
    };
  }, []);

  const handleMobileNavSelect = (tab: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis') => {
    setMobileMenuOpen(false);
    if (tab === 'operations') {
      onGoToOperationsDashboard();
    } else {
      onSelectMainTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Quext Brand Logo button -> Takes us to Homescreen */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <QuextLogo
              className="h-6 sm:h-7 w-auto"
              onClick={() => handleMobileNavSelect('home')}
            />

            {/* Operations Button in the top left -> Takes us directly to Installation Overview Dashboard */}
            <button
              type="button"
              onClick={() => handleMobileNavSelect('operations')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                currentMainTab === 'operations'
                  ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title="Go to Installation Overview Dashboard"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Operations</span>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links (lg and up) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 overflow-x-auto scrollbar-none">
            {/* Homescreen Tab */}
            <button
              onClick={() => onSelectMainTab('home')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentMainTab === 'home'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Live Activity Hub</span>
            </button>

            {/* Operations Dashboard Tab */}
            <button
              onClick={onGoToOperationsDashboard}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentMainTab === 'operations'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Installation Overview</span>
              <span className="px-1.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded tabular-nums">
                {wonProjectsCount} Active
              </span>
            </button>

            {/* Installation Timeline Tab */}
            <button
              onClick={() => onSelectMainTab('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentMainTab === 'timeline'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Installation Timeline</span>
            </button>

            {/* Quotes Pipeline Tab */}
            <button
              onClick={() => onSelectMainTab('quotes')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentMainTab === 'quotes'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Quotes & Deals</span>
              <span className="text-xs text-slate-500 tabular-nums">
                ({totalQuotesCount})
              </span>
            </button>

            {/* Direct Analysis Tab for 33om1u0TTgW3MYKO2FhH */}
            <button
              onClick={() => onSelectMainTab('analysis')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentMainTab === 'analysis'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Quote Analysis</span>
              <span className="hidden xl:inline text-[10px] font-mono text-slate-500">
                #33om1u0TTg
              </span>
            </button>
          </nav>

          {/* Zone 3: Gmail Live Connection, Field Tech Login, Profile & Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden md:block">
              {needsAuth ? (
                <GoogleSignInButton label="Sign in with Google" />
              ) : (
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-xs">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span
                    className="font-bold text-emerald-900 max-w-[140px] truncate"
                    title={gmailUserEmail || 'Gmail Connected'}
                  >
                    {gmailUserEmail || 'Gmail Live'}
                  </span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-emerald-700 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                    title="Disconnect Gmail account"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {onOpenPartnerAcademy && (
              <button
                type="button"
                onClick={onOpenPartnerAcademy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Open Quext Partner Training & Certification Academy Portal"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Partner Academy</span>
                <span className="sm:hidden">Academy</span>
              </button>
            )}

            {onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Simulate myquext.com Email Routing (Partner Academy, Field Tech, or PM)"
              >
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Sign-In / Email Router</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 hover:bg-slate-50 p-1 rounded-lg transition-colors cursor-pointer"
              title="Switch account / Field Tech Login (Sean Gates & Hector Lopez)"
            >
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RR
              </div>
              <div className="hidden xl:block text-left leading-tight">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  <span>Raul Recalde</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Director of Implementation
                </div>
              </div>
            </button>

            {/* Mobile Menu Drawer Button (< lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Horizontal Swipeable Navigation Strip (< lg) */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleMobileNavSelect('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              currentMainTab === 'home'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity Hub</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileNavSelect('operations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              currentMainTab === 'operations'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Installations ({wonProjectsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileNavSelect('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              currentMainTab === 'timeline'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileNavSelect('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              currentMainTab === 'quotes'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotes ({totalQuotesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileNavSelect('analysis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              currentMainTab === 'analysis'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Quote Analysis</span>
          </button>
        </div>

        {/* Expandable Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleMobileNavSelect('home')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  currentMainTab === 'home'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>Live Activity Hub</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Home</span>
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavSelect('operations')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  currentMainTab === 'operations'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Installation Overview</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-sky-100 text-sky-800 rounded">
                  {wonProjectsCount} Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavSelect('timeline')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  currentMainTab === 'timeline'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Installation Timeline</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavSelect('quotes')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  currentMainTab === 'quotes'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Quotes &amp; Deals</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{totalQuotesCount} Quotes</span>
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavSelect('analysis')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  currentMainTab === 'analysis'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Quote Analysis</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">#33om1u0TTg</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                {needsAuth ? (
                  <GoogleSignInButton label="Sign in with Google" />
                ) : (
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-xs">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-900 truncate max-w-[180px]">
                      {gmailUserEmail || 'Gmail Live'}
                    </span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="text-emerald-700 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {onOpenLoginModal && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-300 rounded-lg cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-sky-600" />
                  <span>Switch to Field Tech Portal</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Fixed Thumb-Zone Bottom Navigation Bar for Mobile Phones (md:hidden) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 grid grid-cols-5 gap-1"
      >
        <button
          type="button"
          onClick={() => handleMobileNavSelect('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
            currentMainTab === 'home'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Activity</span>
        </button>

        <button
          type="button"
          onClick={() => handleMobileNavSelect('operations')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
            currentMainTab === 'operations'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => handleMobileNavSelect('timeline')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
            currentMainTab === 'timeline'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => handleMobileNavSelect('quotes')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
            currentMainTab === 'quotes'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Quotes</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenLoginModal && onOpenLoginModal()}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-sky-600" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Field Tech</span>
        </button>
      </nav>
    </>
  );
};

