import React from 'react';
import { Quote } from '../types';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuoteAnalysisViewProps {
  quote: Quote;
  quotesList: Quote[];
  onSelectQuoteForAnalysis: (quoteId: string) => void;
  onGoToOperationsProject: (projectId: string) => void;
}

export const QuoteAnalysisView: React.FC<QuoteAnalysisViewProps> = ({
  quote,
  quotesList,
  onSelectQuoteForAnalysis,
  onGoToOperationsProject,
}) => {
  const totalBOMQty = quote.bomItems.reduce((acc, i) => acc + i.quantity, 0);
  const hardwarePerUnit = quote.unitsCount > 0 ? Math.round(quote.totalHardwareAmount / quote.unitsCount) : 0;
  const saasPerUnitMonth = quote.unitsCount > 0 ? (quote.monthlyServiceFee / quote.unitsCount).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Analysis Breadcrumb Header (White Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-mono font-medium">
              <span>myquext.com</span>
              <span>/</span>
              <span>analysis</span>
              <span>/</span>
              <span className="text-sky-700 font-bold">{quote.id}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                {quote.propertyName}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                ★ {quote.stage}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
              <span>Client: <strong className="text-slate-900">{quote.clientName}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {quote.address}, {quote.city}, {quote.state}
              </span>
              <span>·</span>
              <span>Quote Reference: <strong className="text-slate-900 font-mono">#{quote.quoteNumber}</strong></span>
            </div>
          </div>

          {/* Quote Switcher dropdown */}
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-[11px] text-slate-500 font-semibold">Select Quote Analysis View:</span>
            <select
              value={quote.id}
              onChange={(e) => onSelectQuoteForAnalysis(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            >
              {quotesList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.propertyName} (#{q.quoteNumber}) - {q.stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Link to Operations */}
        {quote.stage === 'Deal Won' && (
          <div className="mt-5 p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-100 text-sky-700 rounded-lg border border-sky-300 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Deal Won Quote Active in Operations</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  This quote has been converted into an active Operations project with full Smart Community Bill of Materials (BOM) tracking and sticky post-it notes.
                </p>
              </div>
            </div>

            <button
              onClick={() => onGoToOperationsProject(quote.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all shrink-0 self-start sm:self-auto"
            >
              <span>View in Operations Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Financial Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Hardware (BOM)</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            ${quote.totalHardwareAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            ${hardwarePerUnit.toLocaleString()} / residential unit
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Turnkey Field Installation</div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono mt-1 tabular-nums">
            ${quote.totalInstallAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Full certified installer labor & commissioning
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Monthly Quext IoT Platform</div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono mt-1 tabular-nums">
            ${quote.monthlyServiceFee.toLocaleString()}<span className="text-xs font-normal">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            ${saasPerUnitMonth} / unit / month
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Scope of Work</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 tabular-nums">
            {quote.unitsCount} Units
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalBOMQty.toLocaleString()} total hardware units on BOM
          </div>
        </div>
      </div>

      {/* Smart Community Bill of Materials (BOM) on Quote */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Smart Community Bill of Materials (BOM) Quoted</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These items are synced directly into the field installer tracking system when marked as Deal Won.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-sky-700">
            {quote.bomItems.length} Quoted Line Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Item & Model</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Scope / Location</th>
                <th className="py-3 px-3 text-right">Quoted Quantity</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Extended Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {quote.bomItems.map((item) => {
                const extended = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">Model: {item.model}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                      ${item.unitPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sky-700 tabular-nums">
                      ${extended.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 text-xs font-semibold">
                <td colSpan={3} className="py-3 px-4 text-slate-700">
                  Total Quoted Hardware Line Items
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-900 font-bold tabular-nums">
                  {totalBOMQty.toLocaleString()} units
                </td>
                <td></td>
                <td className="py-3 px-4 text-right font-mono text-sky-800 font-bold text-sm tabular-nums">
                  ${quote.totalHardwareAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
