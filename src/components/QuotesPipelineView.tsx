import React, { useState } from 'react';
import { Quote, DealStage } from '../types';
import { CheckCircle2, ArrowRight, ExternalLink, Filter, Sparkles } from 'lucide-react';

interface QuotesPipelineViewProps {
  quotes: Quote[];
  onUpdateQuoteStage: (quoteId: string, newStage: DealStage) => void;
  onViewQuoteAnalysis: (quoteId: string) => void;
  onGoToOperationsProject: (projectId: string) => void;
}

export const QuotesPipelineView: React.FC<QuotesPipelineViewProps> = ({
  quotes,
  onUpdateQuoteStage,
  onViewQuoteAnalysis,
  onGoToOperationsProject,
}) => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const stages: DealStage[] = [
    'Prospect',
    'Needs Analysis',
    'Proposal Sent',
    'Contract Review',
    'Deal Won',
    'Closed Lost',
  ];

  const handleStageSelect = (quote: Quote, newStage: DealStage) => {
    onUpdateQuoteStage(quote.id, newStage);
    if (newStage === 'Deal Won') {
      setNotification(
        `"${quote.propertyName}" marked as Deal Won! A dedicated implementation project has been created under Operations with the Smart Community BOM.`
      );
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesStage = stageFilter === 'all' || quote.stage === stageFilter;
    const matchesSearch =
      quote.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageBadgeStyle = (stage: DealStage) => {
    switch (stage) {
      case 'Deal Won':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Contract Review':
        return 'bg-purple-50 text-purple-800 border-purple-300 font-bold';
      case 'Proposal Sent':
        return 'bg-sky-50 text-sky-800 border-sky-300 font-bold';
      case 'Needs Analysis':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner (White Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 rounded">
                Quext CRM Pipeline
              </span>
              <span className="text-xs text-slate-500">· Informed by myquext.com</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              Quotes & Deal Stage Automation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              When any quote is marked as <strong className="text-emerald-700">&quot;Deal Won&quot;</strong>, the system automatically pulls its Smart Community Bill of Materials (BOM) and provisions an active Operations installation project.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewQuoteAnalysis('33om1u0TTgW3MYKO2FhH')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              <span>Open Detailed Quote #33om1u0TTg</span>
            </button>
          </div>
        </div>

        {/* Live Notification */}
        {notification && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-sm"
            >
              &times;
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-5 border-t border-slate-200">
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Search quotes by property, client, quote #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              <option value="all">All Stages ({quotes.length})</option>
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st} ({quotes.filter((q) => q.stage === st).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Quote Number & Property</th>
                <th className="py-3 px-3">Client Company</th>
                <th className="py-3 px-3">Units</th>
                <th className="py-3 px-4 min-w-[200px]">
                  <span className="text-sky-700 font-bold">Deal Stage (Select &quot;Deal Won&quot;)</span>
                </th>
                <th className="py-3 px-3 text-right">Hardware Quoted</th>
                <th className="py-3 px-3 text-right">BOM Lines</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredQuotes.map((quote) => {
                const isWon = quote.stage === 'Deal Won';
                const totalBOMQty = quote.bomItems.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <tr
                    key={quote.id}
                    className={`hover:bg-slate-50/90 transition-colors ${
                      isWon ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Number & Property */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{quote.propertyName}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span className="text-sky-700 font-bold">#{quote.quoteNumber}</span>
                          <span>·</span>
                          <span>{quote.city}, {quote.state}</span>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-3 text-slate-800 font-semibold">
                      {quote.clientName}
                    </td>

                    {/* Units */}
                    <td className="py-3.5 px-3 font-mono text-slate-800 tabular-nums font-bold">
                      {quote.unitsCount}
                    </td>

                    {/* Deal Stage Interactive Selector */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={quote.stage}
                          onChange={(e) => handleStageSelect(quote, e.target.value as DealStage)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${getStageBadgeStyle(
                            quote.stage
                          )}`}
                        >
                          {stages.map((st) => (
                            <option key={st} value={st}>
                              {st === 'Deal Won' ? '★ Deal Won' : st}
                            </option>
                          ))}
                        </select>
                        {isWon && (
                          <span className="text-[10px] text-emerald-700 font-bold font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Auto-Synced
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Hardware Amount */}
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${quote.totalHardwareAmount.toLocaleString()}
                    </td>

                    {/* BOM Lines */}
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {quote.bomItems.length} lines ({totalBOMQty.toLocaleString()} units)
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewQuoteAnalysis(quote.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
                          title="View detailed quote analysis & financial breakdown"
                        >
                          Analysis
                        </button>

                        {isWon && (
                          <button
                            type="button"
                            onClick={() => onGoToOperationsProject(quote.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
                            title="Go directly to this project's Operations tab"
                          >
                            <span>Open Project</span>
                            <ArrowRight className="w-3 h-3" />
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
  );
};
