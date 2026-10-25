import React, { useState } from 'react';
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
        <div className="absolute bottom-full left-0 mb-2 w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-40 space-y-4 text-xs text-slate-800">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-sky-600" />
              <span>Manual Quote Connection</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Quote #{project.quoteNumber}
            </span>
          </div>

          {/* Quote Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Select Quote to Link & Compare:</label>
            <select
              value={selectedQuoteId}
              onChange={(e) => handleStartLink(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="">-- Choose Pipeline Quote --</option>
              {quotesList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.quoteNumber} · {q.propertyName} ({q.stage})
                </option>
              ))}
            </select>
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
