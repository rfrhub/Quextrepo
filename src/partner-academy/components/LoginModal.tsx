import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PartnerCompany, UserRole } from '../types';
import { Building2, Key, Mail, Shield, UserCheck, Award, X, Check, PlusCircle } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const {
    currentCompany,
    currentUser,
    companies,
    allUsers,
    loginAsUser,
    switchCompany,
    registerCompany,
    loginWithCredentials,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo_switch' | 'credentials' | 'register_company'>('demo_switch');

  // Credentials tab state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCompanyCode, setLoginCompanyCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register company state
  const [regName, setRegName] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regRegion, setRegRegion] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginWithCredentials(loginEmail, loginCompanyCode);
    if (success) {
      onClose();
    } else {
      setLoginError('Invalid partner access code or email. Please check your company code or use one of the partner presets.');
    }
  };

  const handleRegisterCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCode || !regEmail) return;

    registerCompany({
      name: regName,
      code: regCode.toUpperCase(),
      region: regRegion || 'National Integration',
      tier: 'Authorized Partner',
      activeTechnicians: 1,
      contactEmail: regEmail,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1120] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-slate-800">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Quext Partner Access Gateway
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Company &amp; Role Authentication Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated enterprise access for certified multifamily installation contractor firms.
          </p>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl my-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('demo_switch')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'demo_switch'
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Presets (Instant)
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'credentials'
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Company Code Login
          </button>
          <button
            onClick={() => setActiveTab('register_company')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'register_company'
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Partner Firm
          </button>
        </div>

        {/* Tab 1: Instant Demo Switch */}
        {activeTab === 'demo_switch' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Select an authenticated partner role to test permissions, training tracks, or admin dashboards:
            </div>

            <div className="space-y-2.5">
              {allUsers
                .filter(
                  (user) =>
                    user.role !== 'quext_director' &&
                    user.companyId !== 'comp_quext_hq' &&
                    !user.email.toLowerCase().endsWith('@onequext.com') &&
                    !user.email.toLowerCase().endsWith('@quext.com')
                )
                .map((user) => {
                const isCurrent = user.id === currentUser.id;
                const comp = companies.find((c) => c.id === user.companyId);

                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      loginAsUser(user.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-lg'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{user.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-cyan-400/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded font-bold">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {comp?.name} · <span className="font-mono text-cyan-400">{comp?.code}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-300 capitalize block">
                        {user.role === 'partner_installer'
                          ? 'Field Installer'
                          : user.role === 'partner_admin'
                          ? 'Partner Admin'
                          : 'Certified Specialist'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {user.fieldIdNumber}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Code Login */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="text-xs text-slate-400">
              Enter your corporate partner company code and your technician email:
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Company Access Code</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SKB-101 or ATB-202"
                  value={loginCompanyCode}
                  onChange={(e) => setLoginCompanyCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-cyan-400"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Official codes: SKB-101, ATB-202, SBH-303, EVB-404, JTS-505, RMR-606, AMD-707
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Technician Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="installer@partnerfirm.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-md mt-4"
            >
              Sign In to Company Portal
            </button>
          </form>
        )}

        {/* Tab 3: Register Company */}
        {activeTab === 'register_company' && (
          <form onSubmit={handleRegisterCompany} className="space-y-4">
            <div className="text-xs text-slate-400">
              Register a new contractor organization into the Quext Certified Partner Network:
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Company / Firm Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Horizon Smart Living Integrators"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Company Code (3-4 chars)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRZ-201"
                  value={regCode}
                  onChange={(e) => setRegCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Service Region</label>
                <input
                  type="text"
                  placeholder="e.g. Southwest / Arizona"
                  value={regRegion}
                  onChange={(e) => setRegRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Lead Admin Email</label>
              <input
                type="email"
                required
                placeholder="operations@horizonsmart.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-md mt-4"
            >
              Provision Partner Workspace
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
