import React from 'react';
import { BOMItem, InstallLogEntry, ThermostatBrand, getCategoryDisplayName, getCategoryUnitLabel } from '../types';
import { TrendingUp, CheckCircle, Calendar, BarChart2, Tag, Smartphone, QrCode } from 'lucide-react';

interface ProgressGraphProps {
  bomItems: BOMItem[];
  installLogs: InstallLogEntry[];
  targetCompletionDate: string;
  onUpdateThermostatBrand?: (brand: ThermostatBrand) => void;
  useNfcWallet?: boolean;
  useQrIntercom?: boolean;
  onToggleFeature?: (feature: 'nfc' | 'qr', checked: boolean) => void;
}

export const ProgressGraph: React.FC<ProgressGraphProps> = ({
  bomItems,
  installLogs,
  targetCompletionDate,
  onUpdateThermostatBrand,
  useNfcWallet = false,
  useQrIntercom = false,
  onToggleFeature,
}) => {
  const totalQuoted = bomItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalInstalled = bomItems.reduce((acc, item) => acc + item.installedCount, 0);
  const remaining = Math.max(0, totalQuoted - totalInstalled);
  const overallPct = totalQuoted > 0 ? Math.round((totalInstalled / totalQuoted) * 100) : 0;

  // Find thermostat brand for consistency across BOM and Graph
  const thermostatItem = bomItems.find(
    (item) => item.category === 'Smart Thermostats & HVAC' || item.name.toLowerCase().includes('thermostat')
  );
  const currentThermostatBrand: ThermostatBrand =
    thermostatItem?.thermostatBrand ||
    (thermostatItem?.name.toLowerCase().includes('honeywell') ? 'Honeywell' : 'Quext');

  // Group by exact category names using mapping
  const categoryGroups = new Map<string, { quoted: number; installed: number }>();
  bomItems.forEach((item) => {
    const dispName = getCategoryDisplayName(item.category);
    const existing = categoryGroups.get(dispName) || { quoted: 0, installed: 0 };
    categoryGroups.set(dispName, {
      quoted: existing.quoted + item.quantity,
      installed: existing.installed + item.installedCount,
    });
  });

  const categoryStats = Array.from(categoryGroups.entries()).map(([cat, stats]) => ({
    name: cat,
    unitLabel: getCategoryUnitLabel(cat),
    quoted: stats.quoted,
    installed: stats.installed,
    pct: stats.quoted > 0 ? Math.min(100, Math.round((stats.installed / stats.quoted) * 100)) : 0,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">BOM Installation Progress & Velocity Graph</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry correlating hardware items to field deployment in project-specific metrics (locks, stats, GTWYs, devices).
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-500 to-blue-600"></span>
            <span className="text-slate-700 font-medium">Installed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-300"></span>
            <span className="text-slate-500">Quoted Total</span>
          </div>
        </div>
      </div>

      {/* Grid: Left circular ring & KPIs + Right category comparative bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        
        {/* Left Column: Overall Progress Meter & Target Date */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50 rounded-xl border border-slate-200">
          {/* Radial progress meter */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-200"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradientLight)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - overallPct / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="progressGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {overallPct}%
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Installed
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-center">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Total Installed</div>
              <div className="text-sm font-bold text-sky-700 font-mono tabular-nums mt-0.5">
                {totalInstalled.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Remaining</div>
              <div className="text-sm font-bold text-slate-800 font-mono tabular-nums mt-0.5">
                {remaining.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Handover:</span>
            <span className="font-mono text-slate-900 font-bold">{targetCompletionDate}</span>
          </div>
        </div>

        {/* Right Column: Category Breakdown Comparative Bars */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hardware Categories Progress Breakdown
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 lowercase">
                <Tag className="w-3 h-3 text-amber-600" />
                <span>locks · stats · GTWYs · devices</span>
              </div>
            </div>

            {/* PM Feature Checkboxes inside Hardware Categories Progress Breakdown */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 bg-emerald-50/90 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={useNfcWallet}
                  onChange={(e) => onToggleFeature && onToggleFeature('nfc', e.target.checked)}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-950">NFC Wallet Upgrade</span>
              </label>

              <label className="inline-flex items-center gap-1.5 bg-indigo-50/90 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={useQrIntercom}
                  onChange={(e) => onToggleFeature && onToggleFeature('qr', e.target.checked)}
                  className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950">QR Intercom Feature</span>
              </label>
            </div>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((stat) => (
              <div key={stat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-800">{stat.name}</span>
                    {stat.name === 'Smart Thermostats' && (
                      <div className="inline-flex items-center rounded-md p-0.5 bg-slate-100 border border-slate-200 text-[10px]">
                        <button
                          type="button"
                          onClick={() => onUpdateThermostatBrand && onUpdateThermostatBrand('Quext')}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            currentThermostatBrand === 'Quext'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                          title="Set all project thermostats to Quext brand (syncs with BOM)"
                        >
                          Quext
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateThermostatBrand && onUpdateThermostatBrand('Honeywell')}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            currentThermostatBrand === 'Honeywell'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                          title="Set all project thermostats to Honeywell brand (syncs with BOM)"
                        >
                          Honeywell
                        </button>
                      </div>
                    )}
                    {stat.name === 'Smart Access Control' && useNfcWallet && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        NFC Wallet Active
                      </span>
                    )}
                    {(stat.name === 'Smart Access Control' || stat.name === 'Common Area & Utilities') &&
                      useQrIntercom && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-800">
                          <QrCode className="w-3 h-3 text-indigo-600" />
                          QR Intercom Active
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-600 font-medium tabular-nums">
                      {stat.installed.toLocaleString()} / {stat.quoted.toLocaleString()} {stat.unitLabel}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        stat.pct === 100
                          ? 'text-emerald-700'
                          : stat.pct > 50
                          ? 'text-sky-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {stat.pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stat.pct === 100
                        ? 'bg-emerald-500'
                        : stat.pct > 50
                        ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {bomItems.filter((i) => i.installedCount >= i.quantity).length} of {bomItems.length} BOM lines 100% completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>
                {installLogs.length} field installer logs verified
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
