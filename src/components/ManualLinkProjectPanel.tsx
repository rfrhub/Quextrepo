import React, { useState, useMemo } from 'react';
import { OperationProject, Quote, BOMItem, ManualLinkQuoteHistory } from '../types';
import {
  Link2,
  ChevronDown,
  ChevronUp,
  History,
  Check,
  AlertCircle,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  Lock,
  Search,
  X,
  Building2,
  Tag,
} from 'lucide-react';

interface ManualLinkProjectPanelProps {
  project: OperationProject;
  quotesList: Quote[];
  onUpdateProject: (updated: OperationProject) => void;
}

export const ManualLinkProjectPanel: React.FC<ManualLinkProjectPanelProps> = ({
  project,
  quotesList,
  onUpdateProject,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredQuotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return quotesList;
    return quotesList.filter(
      (q) =>
        q.propertyName.toLowerCase().includes(query) ||
        q.quoteNumber.toLowerCase().includes(query) ||
        (q.clientName && q.clientName.toLowerCase().includes(query)) ||
        (q.city && q.city.toLowerCase().includes(query)) ||
        (q.state && q.state.toLowerCase().includes(query))
    );
  }, [quotesList, searchQuery]);

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Deal Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Contract Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Proposal Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Needs Analysis':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Closed Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const selectedQuote = quotesList.find((q) => q.id === selectedQuoteId);
  const history = project.manualLinkHistory || [];

  const handleStartLink = (quoteId: string) => {
    if (!quoteId) return;
    setSelectedQuoteId(quoteId);
    setShowComparisonModal(true);
  };

  const handleExecuteLink = (keepQuoteNumbers: boolean) => {
    if (!selectedQuote) return;

    // Build snapshot of previous vs new quantities
    const previousSnapshot = project.bomItems.map((item) => {
      const matchingQuoteItem = selectedQuote.bomItems.find(
        (qi) => qi.category === item.category || qi.name.toLowerCase() === item.name.toLowerCase()
      );
      const newQty = keepQuoteNumbers ? (matchingQuoteItem?.quantity ?? item.quantity) : item.quantity;

      return {
        itemId: item.id,
        name: item.name,
        previousQuantity: item.quantity,
        newQuantity: newQty,
      };
    });

    // Update BOM items
    const updatedBOM: BOMItem[] = project.bomItems.map((item) => {
      const matchingQuoteItem = selectedQuote.bomItems.find(
        (qi) => qi.category === item.category || qi.name.toLowerCase() === item.name.toLowerCase()
      );

      if (keepQuoteNumbers && matchingQuoteItem) {
        return {
          ...item,
          quantity: matchingQuoteItem.quantity,
          unitPrice: matchingQuoteItem.unitPrice || item.unitPrice,
        };
      }
      return item;
    });

    const decisionText = keepQuoteNumbers ? 'Kept Quote Numbers' : 'Kept Project Numbers';

    const historyEntry: ManualLinkQuoteHistory = {
      id: `link-hist-${Date.now()}`,
      linkedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      linkedBy: project.assignedPM.name || 'Project Manager',
      quoteId: selectedQuote.id,
      quoteNumber: selectedQuote.quoteNumber,
      decision: decisionText,
      previousBOMSnapshot: previousSnapshot,
      notes: `Linked project to Quote #${selectedQuote.quoteNumber}. Decision: ${decisionText}.`,
    };

    const updatedProject: OperationProject = {
      ...project,
      quoteId: selectedQuote.id,
      quoteNumber: selectedQuote.quoteNumber,
      bomItems: updatedBOM,
      manualLinkHistory: [historyEntry, ...history],
      lastUpdated: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setShowComparisonModal(false);
    setSelectedQuoteId('');
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle Button on Bottom-Left */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-300 shadow-xs transition-all text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <Link2 className="w-4 h-4 text-sky-600" />
        <span>Manual Link Project</span>
        {history.length > 0 && (
          <span className="px-1.5 py-0.2 text-[10px] bg-sky-100 text-sky-800 rounded font-mono font-bold">
            {history.length}
          </span>
        )}
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {/* Flyout Panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-[440px] max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-40 space-y-4 text-xs text-slate-800">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-sky-600" />
              <span>Manual Quote Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                Linked: #{project.quoteNumber}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100 cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search Quotes by Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-600" />
                <span>Search Quote by Name:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {filteredQuotes.length} of {quotesList.length} quotes
              </span>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quote by property name (e.g. Broadstone, Vue)..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtered Quotes List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-lg p-1.5 bg-slate-50/50 scrollbar-thin">
              {filteredQuotes.length === 0 ? (
                <div className="py-6 px-3 text-center space-y-1.5">
                  <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">No quotes matching "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400">Try searching with a different property name or quote #.</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-1 px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                filteredQuotes.map((q) => {
                  const isCurrentQuote = String(q.quoteNumber) === String(project.quoteNumber);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleStartLink(q.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer group flex flex-col gap-1 ${
                        isCurrentQuote
                          ? 'bg-sky-50/80 border-sky-300 hover:bg-sky-100/80'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate group-hover:text-sky-700 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{q.propertyName}</span>
                            {isCurrentQuote && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-200 text-sky-800 rounded font-mono uppercase tracking-wider shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          {q.clientName && (
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{q.clientName}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            #{q.quoteNumber}
                          </span>
                          <div className="mt-0.5">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border ${getStageBadgeColor(
                                q.stage
                              )}`}
                            >
                              {q.stage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 mt-0.5">
                        <span>
                          {q.unitsCount ? `${q.unitsCount} Units` : ''}
                          {q.city && q.state ? ` · ${q.city}, ${q.state}` : ''}
                        </span>
                        <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          <span>Compare &amp; Link</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Connection Audit History */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Link Decision History ({history.length})</span>
            </div>

            {history.length === 0 ? (
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 text-[11px] italic text-center">
                No manual quote links recorded yet.
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2 divide-y divide-slate-100">
                {history.map((item) => (
                  <div key={item.id} className="pt-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Quote #{item.quoteNumber}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.linkedAt}</span>
                    </div>

                    <div className="text-sky-700 font-semibold">{item.decision}</div>

                    {/* Snapshot of Numbers Before Connection */}
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 space-y-1 text-[10px]">
                      <div className="font-semibold text-slate-600">Numbers before connection:</div>
                      {item.previousBOMSnapshot.slice(0, 3).map((snap, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-slate-600">
                          <span className="truncate max-w-[180px]">{snap.name}</span>
                          <span className="font-mono">
                            {snap.previousQuantity} → <strong className="text-slate-900">{snap.newQuantity}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Comparison Modal (Prompts User which numbers to keep) */}
      {showComparisonModal && selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200">
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded">
                    BOM Quantity Comparison
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Quote #{selectedQuote.quoteNumber} ↔ {project.propertyName}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Which BOM numbers do you want to keep?
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Compare the quoted hardware counts with current project implementation numbers before saving.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100 p-2.5 font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-6">BOM Hardware Category</div>
                <div className="col-span-3 text-center">Quote #{selectedQuote.quoteNumber}</div>
                <div className="col-span-3 text-center">Current Project BOM</div>
              </div>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {project.bomItems.map((item) => {
                  const matchingQuoteItem = selectedQuote.bomItems.find(
                    (qi) => qi.category === item.category || qi.name.toLowerCase() === item.name.toLowerCase()
                  );
                  const quoteQty = matchingQuoteItem?.quantity ?? '—';
                  const isDiff = quoteQty !== '—' && quoteQty !== item.quantity;

                  return (
                    <div key={item.id} className={`grid grid-cols-12 p-2.5 items-center ${isDiff ? 'bg-amber-50/50' : ''}`}>
                      <div className="col-span-6 pr-2">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.category}</div>
                      </div>
                      <div className="col-span-3 text-center font-mono font-bold text-sky-700">
                        {quoteQty}
                      </div>
                      <div className="col-span-3 text-center font-mono font-bold text-slate-900">
                        {item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleExecuteLink(true)}
                className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-xl text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-sky-950 text-xs">Keep Quote Numbers</div>
                <div className="text-[11px] text-sky-800 mt-0.5">
                  Overwrite project quantities with #{selectedQuote.quoteNumber} quoted counts.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteLink(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-slate-900 text-xs">Keep Project Numbers</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Link quote reference but preserve existing project implementation quantities.
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
