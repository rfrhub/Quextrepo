import React from 'react';
import { 
  PortalGuideScreenshot 
} from '../data/portalGuideData';
import { 
  Building2, 
  Radio, 
  Thermometer, 
  Key, 
  FileText, 
  LifeBuoy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  Lock, 
  Unlock, 
  Download, 
  Mail, 
  ChevronDown, 
  Phone,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  UserPlus,
  Users,
  UserCheck,
  Calendar,
  Clock,
  CreditCard,
  Hash,
  Shield,
  Trash2
} from 'lucide-react';

export const PortalScreenshotMockup: React.FC<{
  screenshot: PortalGuideScreenshot;
  theme?: 'white' | 'dark';
}> = ({ screenshot, theme = 'white' }) => {
  const isWhite = theme === 'white';

  return (
    <div className="my-5 space-y-2">
      {/* Screenshot Frame Container */}
      <div className={`rounded-xl border shadow-xl overflow-hidden text-xs font-sans ${
        isWhite 
          ? 'bg-[#0f172a] text-zinc-100 border-zinc-700/80 shadow-zinc-400/20' 
          : 'bg-[#090d16] text-zinc-100 border-zinc-700/80 shadow-black/60'
      }`}>
        {/* Browser Top Window Bar */}
        <div className="bg-[#0b0f19] px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] font-mono text-zinc-400 ml-2 truncate max-w-xs sm:max-w-md bg-[#131826] px-3 py-1 rounded-md border border-zinc-700/50">
              🔒 {screenshot.urlPath}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="border border-white/80 px-1.5 py-0.5 rounded bg-black text-white font-extrabold text-[10px] tracking-tight">
              quext
            </div>
            <span className="text-[10px] text-purple-400 font-mono hidden sm:inline-block">Portal UI Snapshot</span>
          </div>
        </div>

        {/* Screenshot Body based on type */}
        <div className="p-4 sm:p-5 bg-[#0e1320] text-zinc-200">
          
          {/* SCREENSHOT 1: COMMUNITY SPATIAL HIERARCHY TREE */}
          {screenshot.type === 'property_tree' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
                  Community Hierarchy Tree View
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-mono border border-purple-700/50">
                  Database Structure
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Tier 1 */}
                <div className="p-3.5 rounded-xl bg-[#13192a] border-2 border-purple-600/70 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-purple-400 uppercase">Tier 1: Community/ Ownership</div>
                  <div className="font-bold text-white text-xs">The Heights Capital Partners</div>
                  <div className="text-[10px] text-zinc-400">Overall ownership group &amp; property management entity.</div>
                  <div className="text-[10px] font-mono text-zinc-500 pt-1">Hardware: N/A</div>
                </div>

                {/* Tier 2 */}
                <div className="p-3.5 rounded-xl bg-[#13192a] border border-zinc-700 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Tier 2: Building / Property</div>
                  <div className="font-bold text-white text-xs">Building A (100-200)</div>
                  <div className="text-[10px] text-zinc-400">Physical structure and network backhaul risers.</div>
                  <div className="text-[10px] font-mono text-cyan-300 pt-1">Cellular Gateways, Hubs, Bridges</div>
                </div>

                {/* Tier 3 */}
                <div className="p-3.5 rounded-xl bg-[#13192a] border border-zinc-700 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">Tier 3: Common Areas</div>
                  <div className="font-bold text-white text-xs">Clubhouse &amp; Pool Gate</div>
                  <div className="text-[10px] text-zinc-400">Shared resident amenities &amp; perimeter entries.</div>
                  <div className="text-[10px] font-mono text-amber-300 pt-1 truncate">RC's, XE360, NDE, BE/FE, PDK</div>
                </div>

                {/* Tier 4 */}
                <div className="p-3.5 rounded-xl bg-[#13192a] border border-zinc-700 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Tier 4: Residential Units</div>
                  <div className="font-bold text-white text-xs">Unit 201 — Unit 220</div>
                  <div className="text-[10px] text-zinc-400">Individual tenant living spaces and HVAC zones.</div>
                  <div className="text-[10px] font-mono text-emerald-300 pt-1">Quext T-Stat, Schlage Control</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 2: PORTAL LOGIN & COMMUNITY SELECTOR */}
          {screenshot.type === 'portal_login' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Login Box */}
              <div className="md:col-span-6 bg-[#131929] p-5 rounded-xl border border-zinc-700 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-700/80">
                  <div className="border border-white px-2 py-0.5 rounded bg-black text-white font-black text-xs">
                    quext
                  </div>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Technician Login</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Corporate Email Address</label>
                  <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-zinc-200 text-xs font-mono">
                    installer.tech@authorizedpartner.com
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Password</label>
                  <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-zinc-400 text-xs font-mono">
                    ••••••••••••••••
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-900/50 flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Community Selector Preview */}
              <div className="md:col-span-6 bg-[#131929] p-5 rounded-xl border border-zinc-700 space-y-3">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  Property Selector Header
                </div>
                <div className="p-3 bg-[#0a0e1a] border border-purple-500/60 rounded-lg space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Active Property Work Order</span>
                  <div className="flex items-center justify-between text-white font-bold text-xs">
                    <span>The Heights at Austin (#1042)</span>
                    <ChevronDown className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Scope Verified: 148 Residential Units Active
                  </div>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Select your assigned community from the top bar before initiating unit provisioning or gateway telemetry inspections.
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 3: STAFF MANAGEMENT & CREATE USER */}
          {screenshot.type === 'staff_management' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Location:</span>
                  <span className="text-xs font-mono text-zinc-200">Staff &gt; Create New Staff User</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-mono text-[10px] border border-purple-700/50 flex items-center gap-1">
                  <UserPlus className="w-3 h-3" />
                  <span>Role Provisioning</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-7 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-mono">First Name</label>
                      <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-white font-mono text-xs">
                        Marcus
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-mono">Last Name</label>
                      <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-white font-mono text-xs">
                        Vance
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-mono">Corporate Email Address</label>
                    <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-purple-300 font-mono text-xs">
                      m.vance@certifiedinstaller.com
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-mono">Role &amp; Permissions</label>
                    <div className="p-2 rounded bg-purple-950/40 border border-purple-500/60 text-white font-bold text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        Certified Field Installer
                      </span>
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-[#0a0e1a] p-4 rounded-xl border border-zinc-700 space-y-3">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Community Scope &amp; Access</div>
                  <div className="p-2.5 rounded-lg bg-[#111728] border border-zinc-700 space-y-1">
                    <div className="text-white font-bold text-xs flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                      The Heights at Austin (#1042)
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      ✓ 24/7 Virtual Keys Assigned
                    </div>
                  </div>

                  <button className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/50 flex items-center justify-center gap-2">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create User &amp; Send Invite</span>
                  </button>
                  <div className="text-[10px] text-zinc-400 text-center">
                    Automated welcome link active for 48 hours
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 4: ISSUE STAFF & VENDOR KEYS */}
          {screenshot.type === 'issue_staff_vendor_keys' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Location:</span>
                  <span className="text-xs font-mono text-zinc-200">People &gt; Keyring &gt; Manage Keys</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-700/50 flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  <span>Key Modality Dispatch</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-purple-950/40 border-2 border-purple-500/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 font-bold">VIRTUAL KEY</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="font-bold text-white text-xs">Staff Admin BLE Key</div>
                  <div className="text-[10px] text-zinc-300">Direct app-to-lock connection. Unlimited locations.</div>
                  <div className="text-[10px] text-purple-300 font-mono pt-1">Recommended for Staff</div>
                </div>

                <div className="p-3 rounded-xl bg-[#13192a] border border-zinc-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">MOBILE BLE KEY</span>
                    <span className="text-[9px] font-mono text-zinc-400">Max 15 doors</span>
                  </div>
                  <div className="font-bold text-white text-xs">Vendor Hub Key</div>
                  <div className="text-[10px] text-zinc-400">Communicates via Thermostat Hub on work orders.</div>
                  <div className="text-[10px] text-cyan-300 font-mono pt-1">Ideal for Vendors</div>
                </div>

                <div className="p-3 rounded-xl bg-[#13192a] border border-zinc-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-300 font-bold">PHYSICAL FOB / PIN</span>
                    <span className="text-[9px] font-mono text-zinc-400">Hardware</span>
                  </div>
                  <div className="font-bold text-white text-xs">RFID Badge &amp; PIN</div>
                  <div className="text-[10px] text-zinc-400">Badge ID or 4-8 digit keypad numeric credentials.</div>
                  <div className="text-[10px] text-amber-300 font-mono pt-1">Physical Fallback</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 5: ASSIGN TEMPORARY ACCESS */}
          {screenshot.type === 'temporary_access' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Location:</span>
                  <span className="text-xs font-mono text-zinc-200">Access &gt; (⋮) Grant Temporary Access</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-700/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Time-Bound Window</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-mono">Date Range Window</label>
                    <div className="p-2.5 rounded-lg bg-[#0a0e1a] border border-zinc-700 flex items-center justify-between text-xs text-white font-mono">
                      <span>Mar 15, 2026 8:00 AM</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                      <span>Mar 19, 2026 5:00 PM</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-mono">Active Schedule Profile</label>
                    <div className="p-2 rounded bg-purple-950/40 border border-purple-500/60 text-white text-xs font-bold flex items-center justify-between">
                      <span>Contractor Shift (Mon-Fri, 08:00 - 17:00)</span>
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 bg-[#0a0e1a] p-3.5 rounded-xl border border-zinc-700 space-y-2.5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Assigned Units (12 / 15 Max Limit)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Unit 201', 'Unit 202', 'Unit 203', 'Unit 204', 'Maintenance Room', 'Pool Gate'].map(u => (
                      <span key={u} className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-mono border border-purple-700/50">
                        ✓ {u}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    Auto-Revocation scheduled at expiration timestamp
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 6: PIN CODE CREATION & ACCESS */}
          {screenshot.type === 'pin_code_access' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Location:</span>
                  <span className="text-xs font-mono text-zinc-200">Access &gt; PIN Codes &gt; Generate Code</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono text-[10px] border border-amber-700/50 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>Keypad Encryption</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-7 bg-[#0a0e1a] p-4 rounded-xl border border-zinc-700 space-y-2.5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Generated Cryptographic PIN</span>
                  <div className="text-2xl font-mono font-black tracking-widest text-purple-300 py-1 bg-[#131929] rounded-lg border border-purple-500/60">
                    8 4 9 2 0 6
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Transmitted securely to Schlage Deadbolt over LoRaWAN gateway.
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-[#131929] border border-zinc-700 space-y-1">
                    <span className="text-zinc-400 text-[10px]">TARGET LOCK</span>
                    <div className="text-white font-bold">Building A · Unit 204 Door</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131929] border border-zinc-700 space-y-1">
                    <span className="text-zinc-400 text-[10px]">VALIDITY DURATION</span>
                    <div className="text-emerald-400 font-bold">Expires in 48 Hours</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 7: KEY FOB DISTRIBUTION */}
          {screenshot.type === 'key_fob_distribution' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Location:</span>
                  <span className="text-xs font-mono text-zinc-200">People &gt; Staff / Resident &gt; Keyring &gt; Fobs</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-700/50 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>13.56MHz DESFire Token</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-7 space-y-2.5">
                  <div className="p-3 bg-[#0a0e1a] rounded-xl border border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-900/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs font-mono">QXT-FOB-94812</div>
                        <div className="text-[10px] text-zinc-400">Assigned to Marcus Vance (Staff Master)</div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/80 border border-red-800/60">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-zinc-400">
                    Fob allocation limit: 3 fobs per resident / 5 fobs per staff profile.
                  </div>
                </div>

                <div className="md:col-span-5 bg-[#0a0e1a] p-3.5 rounded-xl border border-zinc-700 space-y-2 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Reader Test Status</span>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    ✓ SYNCED TO LOCK WHITELIST
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Instant strike unlock on RC Card Reader
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 8: GATEWAY STATUS & LORAWAN TELEMETRY */}
          {screenshot.type === 'gateway_status' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#131a2c] rounded-xl border border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">TEKTELIC Kona Micro IoT Gateway · Model T00048</div>
                    <div className="text-[10px] font-mono text-zinc-400">Gateway EUI: 00-16-C0-01-FF-42-88-12 · IP: 192.168.1.140</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE &amp; OPERATIONAL
                  </span>
                </div>
              </div>

              {/* Gateway Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#111726] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">BACKHAUL TYPE</span>
                  <span className="text-white font-bold">PoE Gigabit Ethernet</span>
                </div>
                <div className="p-3 bg-[#111726] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">LORA CHANNEL</span>
                  <span className="text-cyan-300 font-bold">US915 Sub-Band 2</span>
                </div>
                <div className="p-3 bg-[#111726] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">AVERAGE RSSI</span>
                  <span className="text-emerald-400 font-bold">-78 dBm (Optimal)</span>
                </div>
                <div className="p-3 bg-[#111726] rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">PACKET LOSS</span>
                  <span className="text-emerald-400 font-bold">&lt; 0.2% (Healthy)</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 9: THERMOSTAT HVAC CONFIG & O/B POLARITY */}
          {screenshot.type === 'hvac_config' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Path:</span>
                  <span className="text-xs font-mono text-zinc-200">devices &gt; Thermostats &gt; Unit 204 &gt; Settings</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono text-[10px] border border-purple-700/50">
                  QXT100048
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* HVAC Config Selector */}
                <div className="md:col-span-7 space-y-3">
                  <div className="text-xs font-bold text-white">HVAC System Configuration</div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-mono">System Type</label>
                    <div className="p-2.5 rounded-lg bg-[#0a0e1a] border border-zinc-700 text-xs text-white font-mono font-bold">
                      Heat Pump (Single Stage Compressor + Aux Heat)
                    </div>
                  </div>

                  {/* O/B Polarity Switcher with high-contrast highlight */}
                  <div className="space-y-1 p-3 rounded-lg bg-purple-950/40 border border-purple-500/60">
                    <label className="text-[10px] text-purple-300 uppercase font-mono font-bold flex items-center justify-between">
                      <span>O/B Reversing Valve Polarity</span>
                      <span className="text-amber-400 text-[10px]">★ Critical Config Step</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded bg-purple-600 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                        <span>O (Energized in Cool)</span>
                      </div>
                      <div className="p-2 rounded bg-black/50 text-zinc-400 text-center text-xs font-mono border border-zinc-800">
                        <span>B (Energized in Heat)</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-300 pt-1 font-sans">
                      If AC blows warm air during cooling test, click "B" polarity, then click Save.
                    </div>
                  </div>
                </div>

                {/* Save Action Box */}
                <div className="md:col-span-5 bg-[#0a0e1a] p-4 rounded-xl border border-zinc-700 space-y-3">
                  <div className="text-xs font-bold text-white">Apply &amp; Push Configuration</div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                    Changes are transmitted over LoRaWAN directly to the thermostat subbase within 3 seconds.
                  </div>
                  <button className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Save Configuration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 10: ACCESS CONTROL & DIGITAL NFC CREDENTIAL */}
          {screenshot.type === 'access_wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Credentials List */}
              <div className="md:col-span-7 bg-[#111728] p-4 rounded-xl border border-zinc-700 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold text-white">Access Control &gt; Digital Credentials</span>
                  <span className="text-[10px] font-mono text-purple-400">DESFire EV3 / PKI</span>
                </div>

                <div className="p-3 bg-[#0a0e1a] rounded-lg border border-purple-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Installer Field Master Pass</div>
                      <div className="text-[10px] text-zinc-400 font-mono">Apple Wallet &amp; Google Wallet · Express Mode</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <div className="text-[11px] text-zinc-300">
                  Hold iPhone or Android device within 1.5 inches of the RC Card Reader lens to verify keyless entry and strike release.
                </div>
              </div>

              {/* Reader Relay Action Preview */}
              <div className="md:col-span-5 bg-[#111728] p-4 rounded-xl border border-zinc-700 space-y-3 text-center">
                <div className="text-xs font-bold text-white">RC Card Reader State</div>
                <div className="w-12 h-12 rounded-full bg-emerald-900/60 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/60">
                  <Unlock className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono">RELAY TRIGGERED: UNLOCKED</div>
                <div className="text-[10px] text-zinc-400 font-mono">Electric Strike Pulse: 5.0 Seconds</div>
              </div>
            </div>
          )}

          {/* SCREENSHOT 11: DEVICE REPORT & EXPORT PDF BUTTON */}
          {screenshot.type === 'device_report_export' && (
            <div className="space-y-4 bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div>
                  <div className="text-xs font-bold text-white">Home &gt; Device Report</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Verify installed devices match the project Scope of Work (SOW)</div>
                </div>

                {/* Highlighted Export PDF Button */}
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-900/50 flex items-center gap-2 border border-purple-400/50">
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>

              {/* Device Table Preview */}
              <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0e1a] text-purple-300 font-mono text-[10px] uppercase border-b border-zinc-800">
                    <tr>
                      <th className="py-2 px-3">Unit / Location</th>
                      <th className="py-2 px-3">Device Type</th>
                      <th className="py-2 px-3">DevEUI / Serial</th>
                      <th className="py-2 px-3">SOW Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 bg-[#0c101c] font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-3 text-white font-bold">Unit 201</td>
                      <td className="py-2 px-3 text-zinc-300">Quext Smart Thermostat</td>
                      <td className="py-2 px-3 text-zinc-400">70-B3-D5-7E-D0-04-A1-01</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">✓ Matches SOW</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white font-bold">Unit 201</td>
                      <td className="py-2 px-3 text-zinc-300">Schlage Control Lock</td>
                      <td className="py-2 px-3 text-zinc-400">BE467F-FE410-098231</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">✓ Matches SOW</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white font-bold">Clubhouse Gate</td>
                      <td className="py-2 px-3 text-zinc-300">RC Card Reader (NFC)</td>
                      <td className="py-2 px-3 text-zinc-400">RC-04-COMM-88912</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">✓ Matches SOW</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREENSHOT 12: TIER-2/3 SUPPORT & ESCALATION MODAL */}
          {screenshot.type === 'support_modal' && (
            <div className="bg-[#111728] p-4 sm:p-5 rounded-xl border border-zinc-700 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-purple-400" />
                  Quext Support &amp; Project Manager Escalation Modal
                </span>
                <span className="text-[10px] font-mono text-cyan-400">1-800-798-8319 (Opt. 2)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-500 block text-[10px]">RECIPIENT (TO)</span>
                  <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-emerald-300">
                    support@onequext.com
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-purple-300 block text-[10px] font-bold">CC (PROJECT MANAGER) ★</span>
                  <div className="p-2 rounded bg-purple-950/50 border border-purple-500/60 text-white font-bold">
                    your.projectmanager@onequext.com
                  </div>
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <span className="text-zinc-500 block text-[10px]">SUBJECT LINE</span>
                <div className="p-2 rounded bg-[#0a0e1a] border border-zinc-700 text-white font-bold">
                  [URGENT FIELD INSTALL] - The Heights at Austin - Unit 204
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Screenshot Caption Footer */}
        <div className="bg-[#090d16] px-4 py-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Figure: {screenshot.caption}</span>
          <span className="text-purple-400">Quext Field Standard v4.4</span>
        </div>
      </div>
    </div>
  );
};
