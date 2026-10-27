import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { PARTNER_IDENTITY_DIRECTORY } from '../partner-academy/utils/projectCoursePackager';

export interface MyQuextSignedInUser {
  name: string;
  email: string;
  roleLabel: string;
  avatarInitial: string;
  accountType: 'team_member' | 'integrator_partner';
  fieldTechDefault?: 'Sean Gates' | 'Hector Lopez' | null;
  partnerCompanyId?: string;
  partnerShortName?: string;
}

interface MyQuextLoginPageProps {
  onSignInSuccess: (user: MyQuextSignedInUser) => void;
  onExploreCatalog?: () => void;
}

export function resolveEmailToMyQuextUser(rawEmail: string): MyQuextSignedInUser {
  const email = rawEmail.trim().toLowerCase() || 'raul.recalde@onequext.com';

  // 1. Check if Sean Gates or Hector Lopez (Quext Team Members who have full myquext.com access + Field Tech Portal toggle)
  if (email.includes('sean') || email.includes('gates')) {
    return {
      name: 'Sean Gates',
      email: email.includes('@') ? email : 'sean.gates@onequext.com',
      roleLabel: 'TEAM MEMBER',
      avatarInitial: 'S',
      accountType: 'team_member',
      fieldTechDefault: 'Sean Gates',
    };
  }

  if (email.includes('hector') || email.includes('lopez')) {
    return {
      name: 'Hector Lopez',
      email: email.includes('@') ? email : 'hector.lopez@onequext.com',
      roleLabel: 'TEAM MEMBER',
      avatarInitial: 'H',
      accountType: 'team_member',
      fieldTechDefault: 'Hector Lopez',
    };
  }

  // 2. Check Internal Quext Team Members (Raul Recalde, Bethany Condon, Megan Rossman, Blake Miller, or @onequext.com)
  if (email.includes('raul') || email.includes('recalde')) {
    return {
      name: 'Raul Recalde',
      email: 'raul.recalde@onequext.com',
      roleLabel: 'DIRECTOR OF IMPLEMENTATION',
      avatarInitial: 'R',
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  if (email.includes('bethany') || email.includes('condon')) {
    return {
      name: 'Bethany Condon',
      email: 'bethany.condon@onequext.com',
      roleLabel: 'PROJECT MANAGER',
      avatarInitial: 'B',
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  if (email.includes('megan') || email.includes('rossman')) {
    return {
      name: 'Megan Rossman',
      email: 'megan.rossman@onequext.com',
      roleLabel: 'DIRECTOR OF OPERATIONS',
      avatarInitial: 'M',
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  if (email.includes('ian') || email.includes('robertson') || email.includes('roberston')) {
    return {
      name: 'Ian Robertson',
      email: 'ian.robertson@onequext.com',
      roleLabel: 'PROJECT COORDINATOR',
      avatarInitial: 'I',
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  if (email.includes('blake') || email.includes('miller')) {
    return {
      name: 'Blake Miller',
      email: 'blake.miller@onequext.com',
      roleLabel: 'TEAM MEMBER',
      avatarInitial: 'B',
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  const isInternalQuext =
    email.endsWith('@onequext.com') ||
    email.endsWith('@myquext.com') ||
    email.endsWith('@quext.com') ||
    email.endsWith('@gfiber.com') ||
    email.endsWith('@google.com') ||
    email.endsWith('@resident.ventures');

  if (isInternalQuext && !email.includes('partner') && !email.includes('installer')) {
    const formattedName = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      name: formattedName || 'Raul Recalde',
      email,
      roleLabel: 'TEAM MEMBER',
      avatarInitial: (formattedName || 'R').charAt(0).toUpperCase(),
      accountType: 'team_member',
      fieldTechDefault: null,
    };
  }

  // 3. Check if Integrator Partner (SKBM, Everbase, ATB, SBH, JTS, RMR, All Media, iTech, or any external partner email)
  const matchedPartner = PARTNER_IDENTITY_DIRECTORY.find((p) => {
    const tokens = [
      p.partnerShortName.toLowerCase(),
      p.companyId.toLowerCase(),
      p.defaultEmail.toLowerCase(),
      ...(p.aliases || []).map((t) => t.toLowerCase()),
    ];
    return tokens.some((tok) => tok && email.includes(tok));
  });

  if (matchedPartner) {
    return {
      name: matchedPartner.leadName || `${matchedPartner.partnerShortName} Partner`,
      email: email.includes('@') ? email : matchedPartner.defaultEmail,
      roleLabel: 'INTEGRATOR PARTNER',
      avatarInitial: matchedPartner.partnerShortName.charAt(0).toUpperCase(),
      accountType: 'integrator_partner',
      partnerCompanyId: matchedPartner.companyId,
      partnerShortName: matchedPartner.partnerShortName,
    };
  }

  // 4. Default any other external email to Integrator Partner -> Partner Academy Portal
  const defaultPartner = PARTNER_IDENTITY_DIRECTORY[0];
  return {
    name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    roleLabel: 'INTEGRATOR PARTNER',
    avatarInitial: email.charAt(0).toUpperCase(),
    accountType: 'integrator_partner',
    partnerCompanyId: defaultPartner.companyId,
    partnerShortName: defaultPartner.partnerShortName,
  };
}

export const MyQuextLoginPage: React.FC<MyQuextLoginPageProps> = ({
  onSignInSuccess,
  onExploreCatalog,
}) => {
  const [authTab, setAuthTab] = useState<'password' | 'link'>('password');
  const [email, setEmail] = useState<string>('raul.recalde@onequext.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [linkSentMsg, setLinkSentMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'link') {
      setLinkSentMsg(`A sign-in link has been sent to ${email}. Redirecting...`);
      setTimeout(() => {
        onSignInSuccess(resolveEmailToMyQuextUser(email));
      }, 600);
      return;
    }
    onSignInSuccess(resolveEmailToMyQuextUser(email));
  };

  const handleQuickLogin = (targetEmail: string) => {
    setEmail(targetEmail);
    onSignInSuccess(resolveEmailToMyQuextUser(targetEmail));
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2 font-['Inter',sans-serif]">
      {/* =====================================================================
          LEFT COLUMN: SIGN-IN FORM (Matches Screenshot 2 pixel-for-pixel)
      ===================================================================== */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:flex-none lg:px-16 xl:px-20 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-[420px]">
          <div className="flex flex-col items-start mb-6">
            {/* Quext Black Box Logo matching Screenshot 2 */}
            <div className="mb-5 flex items-center">
              <div className="relative border-[2.5px] border-slate-900 px-2.5 py-1 flex items-center justify-center">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Inter_Tight',sans-serif] leading-none">
                  quext
                </span>
                <div className="w-2 h-2 border-r-[2.5px] border-b-[2.5px] border-slate-900 bg-white rotate-45 absolute -bottom-[6px] left-3" />
              </div>
              <span className="text-[8px] font-bold text-slate-500 self-end ml-0.5 leading-none">
                ®
              </span>
            </div>

            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quext Platform &amp; Admin</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Inter_Tight',sans-serif]">
              Welcome back
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Sign in to access property intelligence, quotes, and community automation.
            </p>
          </div>

          {/* Main Login Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
            <button
              type="button"
              onClick={() => onSignInSuccess(resolveEmailToMyQuextUser(email))}
              className="w-full h-10 flex items-center justify-center gap-3 px-4 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-4 w-4 shrink-0"
              />
              <span>Sign in with Google</span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Or sign in with email
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mb-5 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAuthTab('password')}
                className={`text-xs font-bold uppercase tracking-wider pb-2.5 px-1 cursor-pointer transition-colors ${
                  authTab === 'password'
                    ? 'text-[#635bff] border-b-2 border-[#635bff]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('link')}
                className={`text-xs font-bold uppercase tracking-wider pb-2.5 px-1 cursor-pointer transition-colors ${
                  authTab === 'link'
                    ? 'text-[#635bff] border-b-2 border-[#635bff]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Email Link
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Company email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:bg-white transition-all shadow-2xs"
                    placeholder="you@company.com"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold tracking-tighter select-none">
                    •••|
                  </span>
                </div>
              </div>

              {authTab === 'password' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthTab('link')}
                      className="text-xs font-semibold text-[#635bff] hover:text-indigo-700 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:bg-white transition-all shadow-2xs"
                      placeholder="••••••••"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold tracking-tighter select-none">
                      •••|
                    </span>
                  </div>
                </div>
              )}

              {linkSentMsg && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-medium">
                  {linkSentMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-10 flex items-center justify-center rounded-lg bg-[#635bff] hover:bg-[#5249e5] px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-[0.99]"
              >
                {authTab === 'password' ? 'Sign In to Workspace' : 'Send Sign-In Link'}
              </button>
            </form>
          </div>

          {/* Explore Public Product Catalog Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                if (onExploreCatalog) {
                  onExploreCatalog();
                } else {
                  onSignInSuccess(resolveEmailToMyQuextUser('raul.recalde@onequext.com'));
                }
              }}
              className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#635bff] shrink-0" />
              <span>Explore Public Product Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Quick Demo Sign-In Helper Pills (Team Members vs Integrator Partners) */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Quick Sign-In Presets (Team Members vs. Integrator Partners)
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-slate-500">
                Quext Team (Full myquext.com + Operations + Field Tech Portal):
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('raul.recalde@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Raul Recalde (Director)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('bethany.condon@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Bethany Condon (PM)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('megan.rossman@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Megan Rossman (Director of Ops)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ian.robertson@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Ian Robertson (Coordinator)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('sean.gates@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Sean Gates (Field Tech)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('hector.lopez@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Hector Lopez (Field Tech)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('blake.miller@onequext.com')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer"
                >
                  Blake Miller
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-semibold text-purple-700">
                Integrator Partners (Routes Directly to Partner Academy Portal Only):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PARTNER_IDENTITY_DIRECTORY.map((p) => (
                  <button
                    key={p.companyId}
                    type="button"
                    onClick={() => handleQuickLogin(p.defaultEmail)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 cursor-pointer"
                    title={`Sign in as ${p.partnerShortName} (${p.defaultEmail}) -> Opens Partner Academy Portal`}
                  >
                    {p.partnerShortName} ({p.defaultEmail})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          RIGHT COLUMN: DARK ENTERPRISE PARTNER NETWORK PANEL (Matches Screenshot 2)
      ===================================================================== */}
      <div className="relative hidden w-full flex-1 lg:flex flex-col justify-between p-12 xl:p-16 bg-[#0f1322] text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none select-none mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

        {/* Top Status Row */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Enterprise Partner Network Active
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400">v2.4.0 Operations</span>
        </div>

        {/* Center Hero Copy & Stats */}
        <div className="relative z-10 max-w-xl space-y-6 my-auto py-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Commercial PropTech &amp; Infrastructure</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight font-['Inter_Tight',sans-serif]">
              Unified Platform for Smart Communities &amp; Infrastructure
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              From IoT hardware specifications and architectural site surveys to equipment quoting
              and multi-gigabit fiber delivery—all synchronized in real time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 shadow-sm backdrop-blur-xs">
              <div className="text-2xl font-bold text-indigo-400 tabular-nums">1,200+</div>
              <div className="text-xs font-medium text-slate-400 mt-0.5">Properties Powered</div>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 shadow-sm backdrop-blur-xs">
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">99.4%</div>
              <div className="text-xs font-medium text-slate-400 mt-0.5">On-Time Turnaround</div>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 shadow-sm backdrop-blur-xs">
              <div className="text-2xl font-bold text-purple-400">Tier 1</div>
              <div className="text-xs font-medium text-slate-400 mt-0.5">
                National Infrastructure
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-5 shadow-xs backdrop-blur-xs">
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
              &ldquo;Having the RFP packages and floor plans pre-mapped with automated labor rate
              cards cut our estimating time from days to twenty minutes. Everything is
              transparent.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/60">
              <div className="w-8 h-8 rounded-lg bg-[#635bff] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                LV
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  Commercial Infrastructure Partner
                </div>
                <div className="text-xs text-slate-400">
                  Certified Regional Partner • Dallas, TX
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800">
          <span>Quext Operations Ecosystem</span>
          <span>Google Fiber Certified Infrastructure</span>
        </div>
      </div>
    </div>
  );
};
