import React, { useState, useMemo } from 'react';
import { OperationProject, BOMItem, ManualLinkProjectHistory } from '../types';
import {
  Link2,
  ChevronDown,
  ChevronUp,
  History,
  Check,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
  X,
  Building2,
  User,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface ManualLinkPropertyToProjectPanelProps {
  property: OperationProject;
  projectsList: OperationProject[];
  onUpdateProperty: (updated: OperationProject) => void;
  currentUserName?: string;
  onOpenProjectInOperations?: (projectId: string) => void;
}

export const ManualLinkPropertyToProjectPanel: React.FC<ManualLinkPropertyToProjectPanelProps> = ({
  property,
  projectsList,
  onUpdateProperty,
  currentUserName = 'Customer Success Team',
  onOpenProjectInOperations,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [decision, setDecision] = useState<'Adopted Project BOM' | 'Kept Property BOM'>('Keep Property BOM' as any);
  const [syncPmAndTech, setSyncPmAndTech] = useState<boolean>(true);
  const [syncIntegrators, setSyncIntegrators] = useState<boolean>(true);
  const [syncMilestones, setSyncMilestones] = useState<boolean>(false);
  const [linkNotes, setLinkNotes] = useState<string>('');

  // Available operations projects excluding the current property itself
  const availableProjects = useMemo(() => {
    return projectsList.filter((p) => p.id !== property.id);
  }, [projectsList, property.id]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return availableProjects;
    return availableProjects.filter(
      (p) =>
        p.propertyName.toLowerCase().includes(query) ||
        (p.quoteNumber && p.quoteNumber.toLowerCase().includes(query)) ||
        (p.clientName && p.clientName.toLowerCase().includes(query)) ||
        (p.city && p.city.toLowerCase().includes(query)) ||
        (p.state && p.state.toLowerCase().includes(query)) ||
        (p.assignedPM?.name && p.assignedPM.name.toLowerCase().includes(query))
    );
  }, [availableProjects, searchQuery]);

  const selectedProject = availableProjects.find((p) => p.id === selectedProjectId);
  const history: ManualLinkProjectHistory[] = property.manualLinkProjectHistory || [];

  const handleStartLink = (projectId: string) => {
    if (!projectId) return;
    setSelectedProjectId(projectId);
    setDecision('Adopted Project BOM');
    setLinkNotes('');
    setShowComparisonModal(true);
  };

  const handleExecuteLink = () => {
    if (!selectedProject) return;

    const adoptBom = decision === 'Adopted Project BOM';

    // Build snapshot of previous vs new quantities
    const previousSnapshot = property.bomItems.map((item) => {
      const matchingProjectItem = selectedProject.bomItems.find(
        (pi) =>
          pi.category === item.category ||
          pi.name.toLowerCase() === item.name.toLowerCase()
      );
      const newQty = adoptBom
        ? (matchingProjectItem?.quantity ?? item.quantity)
        : item.quantity;

      return {
        itemId: item.id,
        name: item.name,
        previousQuantity: item.quantity,
        newQuantity: newQty,
      };
    });

    // Update BOM items
    let updatedBOM: BOMItem[] = property.bomItems;
    if (adoptBom) {
      if (selectedProject.bomItems && selectedProject.bomItems.length > 0) {
        // Map matching items and include any new project BOM items
        const existingCategoryMap = new Set(property.bomItems.map((i) => i.name.toLowerCase()));
        const updatedExisting = property.bomItems.map((item) => {
          const match = selectedProject.bomItems.find(
            (pi) =>
              pi.category === item.category ||
              pi.name.toLowerCase() === item.name.toLowerCase()
          );
          if (match) {
            return {
              ...item,
              quantity: match.quantity,
              unitPrice: match.unitPrice || item.unitPrice,
            };
          }
          return item;
        });

        const newItemsFromProject = selectedProject.bomItems
          .filter((pi) => !existingCategoryMap.has(pi.name.toLowerCase()))
          .map((pi) => ({
            ...pi,
            id: `bom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            installedCount: 0,
            verifiedCount: 0,
          }));

        updatedBOM = [...updatedExisting, ...newItemsFromProject];
      }
    }

    const decisionLabel: 'Adopted Project BOM' | 'Kept Property BOM' | 'Custom Sync' =
      adoptBom ? 'Adopted Project BOM' : 'Kept Property BOM';

    const historyEntry: ManualLinkProjectHistory = {
      id: `link-proj-${Date.now()}`,
      linkedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      linkedBy: currentUserName,
      targetProjectId: selectedProject.id,
      targetProjectName: selectedProject.propertyName,
      targetProjectNumber: selectedProject.quoteNumber || selectedProject.id,
      decision: decisionLabel,
      previousBOMSnapshot: previousSnapshot,
      notes: linkNotes.trim()
        ? linkNotes.trim()
        : `Linked property to Operations Project "${selectedProject.propertyName}". Decision: ${decisionLabel}.`,
    };

    const updatedProperty: OperationProject = {
      ...property,
      linkedProjectId: selectedProject.id,
      linkedProjectName: selectedProject.propertyName,
      linkedProjectNumber: selectedProject.quoteNumber || selectedProject.id,
      bomItems: updatedBOM,
      manualLinkProjectHistory: [historyEntry, ...history],
      assignedPM: syncPmAndTech && selectedProject.assignedPM ? selectedProject.assignedPM : property.assignedPM,
      assignedFieldTech:
        syncPmAndTech && selectedProject.assignedFieldTech
          ? selectedProject.assignedFieldTech
          : property.assignedFieldTech,
      integratorPartners:
        syncIntegrators && selectedProject.integratorPartners
          ? selectedProject.integratorPartners
          : property.integratorPartners,
      milestones:
        syncMilestones && selectedProject.milestones && selectedProject.milestones.length > 0
          ? selectedProject.milestones
          : property.milestones,
      targetCompletionDate:
        syncMilestones && selectedProject.targetCompletionDate
          ? selectedProject.targetCompletionDate
          : property.targetCompletionDate,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateProperty(updatedProperty);
    setShowComparisonModal(false);
    setSelectedProjectId('');
    setIsOpen(false);
  };

  const currentlyLinkedProject = availableProjects.find(
    (p) => p.id === property.linkedProjectId
  );

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-300 shadow-xs transition-all text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <Link2 className="w-4 h-4 text-emerald-600" />
        <span>Manual Link Project</span>
        {property.linkedProjectId && (
          <span className="px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 rounded font-bold">
            Linked
          </span>
        )}
        {history.length > 0 && (
          <span className="px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-700 rounded font-mono font-bold">
            {history.length}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 w-96 sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[540px] animate-in fade-in zoom-in-95 duration-100">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-900/50">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                  Manual Link Operations Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Linked Project Indicator */}
            {(property.linkedProjectId || currentlyLinkedProject) && (
              <div className="px-4 py-2.5 bg-emerald-50/80 border-b border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                      Currently Linked Project
                    </span>
                    <strong className="text-slate-900 truncate block">
                      {property.linkedProjectName || currentlyLinkedProject?.propertyName || property.linkedProjectId}
                    </strong>
                  </div>
                </div>
                {onOpenProjectInOperations && property.linkedProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenProjectInOperations(property.linkedProjectId!);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer ml-2"
                  >
                    Open in Ops
                  </button>
                )}
              </div>
            )}

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search operations projects by name, PM, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Project List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Available Projects ({filteredProjects.length})</span>
                <span>Select to Link</span>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching operations projects found.
                </div>
              ) : (
                filteredProjects.map((proj) => {
                  const isCurrentTarget = property.linkedProjectId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrentTarget
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : 'border-slate-150 hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {proj.propertyName}
                            </span>
                            {proj.quoteNumber && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {proj.quoteNumber}
                              </span>
                            )}
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {proj.statusTag}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>
                                {proj.city}, {proj.state}
                              </span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>PM: {proj.assignedPM?.name || 'Unassigned'}</span>
                            </span>
                            <span>•</span>
                            <span className="font-mono">{proj.unitsCount} Units</span>
                            <span>•</span>
                            <span>{proj.bomItems?.length || 0} BOM items</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartLink(proj.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
                        >
                          <span>{isCurrentTarget ? 'Re-Link' : 'Link'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* History Footer */}
            {history.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Link Audit History ({history.length})</span>
                  </div>
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span className="font-bold text-slate-800 truncate">
                          {item.targetProjectName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.linkedAt}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>By: {item.linkedBy}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                          {item.decision}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Comparison & Confirmation Modal */}
      {showComparisonModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-900/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    Manual Project Link
                  </span>
                </div>
                <h3 className="text-base font-black tracking-tight text-white">
                  Link Property to Operations Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Side by Side Property vs Project Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Property */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Current Property</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {property.propertyName}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Client: <strong>{property.clientName}</strong></div>
                    <div>Units: <strong className="font-mono">{property.unitsCount}</strong></div>
                    <div>Location: {property.city}, {property.state}</div>
                    <div>Assigned CSM: <strong>{property.assignedCSM || 'Nicole Franklin'}</strong></div>
                    <div>BOM Items: <strong className="font-mono">{property.bomItems.length}</strong></div>
                  </div>
                </div>

                {/* Selected Operations Project */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Selected Operations Project</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedProject.propertyName}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Project / Quote #: <strong className="font-mono">{selectedProject.quoteNumber || selectedProject.id}</strong></div>
                    <div>Status: <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold">{selectedProject.statusTag}</span></div>
                    <div>Units: <strong className="font-mono">{selectedProject.unitsCount}</strong></div>
                    <div>Implementation PM: <strong>{selectedProject.assignedPM?.name || 'Unassigned'}</strong></div>
                    <div>BOM Items: <strong className="font-mono">{selectedProject.bomItems?.length || 0}</strong></div>
                  </div>
                </div>
              </div>

              {/* BOM Decision */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  BOM Scope Synchronization
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision('Adopted Project BOM')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      decision === 'Adopted Project BOM'
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          decision === 'Adopted Project BOM'
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {decision === 'Adopted Project BOM' && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span>Adopt Project BOM Scope</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5">
                      Updates the property BOM with the project items, quantities, and pricing.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('Kept Property BOM')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      decision === 'Kept Property BOM'
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          decision === 'Kept Property BOM'
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {decision === 'Kept Property BOM' && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span>Keep Property Numbers</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5">
                      Links the reference to the project without altering current property BOM counts.
                    </p>
                  </button>
                </div>
              </div>

              {/* Additional Synchronizations */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Additional Project Attributes
                </span>
                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncPmAndTech}
                      onChange={(e) => setSyncPmAndTech(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-800">
                        Sync Implementation PM &amp; Assigned Field Tech
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {selectedProject.assignedPM?.name || 'PM'} &amp;{' '}
                        {selectedProject.assignedFieldTech || 'Field Tech'}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncIntegrators}
                      onChange={(e) => setSyncIntegrators(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-800">
                        Sync Integrator Partner &amp; Installers
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {(selectedProject.integratorPartners || []).join(', ') || 'No partners'}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncMilestones}
                      onChange={(e) => setSyncMilestones(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-800">
                        Sync Milestones &amp; Target Completion Date
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Target: {selectedProject.targetCompletionDate || 'TBD'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Link Notes (Optional)
                </label>
                <textarea
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  placeholder="Add context on why this property is being tied to this operations project..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteLink}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Link Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
