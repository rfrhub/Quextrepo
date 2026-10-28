import React, { useState, useMemo } from 'react';
import {
  OperationProject,
  BOMItem,
  ProjectMilestone,
  InstallLogEntry,
  ProjectNote,
  CustomerCommsLog,
  getProjectIntegratorPartners,
} from '../types';
import {
  GitMerge,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Layers,
  Building2,
  Calendar,
  Wrench,
  ChevronRight,
  X,
  Eye,
  Plus,
  ArrowLeft,
  GraduationCap,
  Users,
  ShieldAlert,
  Brain,
  Sliders,
  RotateCcw,
  Trash2,
  Check,
  HelpCircle,
  ThumbsDown,
} from 'lucide-react';

const COMMON_STOPWORDS = new Set([
  'the', 'at', 'in', 'and', 'a', 'an', 'of', 'for', 'on', 'to', 'by', 'with', 'from',
  '-', ',', '&', 'or', 'phase', 'pilot', 'llc', 'inc', 'corp', 'tx', 'fl', 'ca',
  'ga', 'nc', 'co', 'sc', 'tn', 'az', 'oh', 'mo', 'ut', 'wa', 'ny', 'nj',
]);

export interface CloneCluster {
  id: string;
  projectA: OperationProject;
  projectB: OperationProject;
  sharedWords: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export interface DismissedClonePair {
  id: string;
  projectAId: string;
  projectBId: string;
  projectAName: string;
  projectBName: string;
  sharedWords: string[];
  dismissedAt: string;
}

export const STORAGE_DISMISSED_PAIRS_KEY = 'quext_clone_wars_dismissed_pairs_v1';
export const STORAGE_LEARNED_WORDS_KEY = 'quext_clone_wars_learned_words_v1';

export function loadDismissedPairs(): DismissedClonePair[] {
  try {
    const raw = localStorage.getItem(STORAGE_DISMISSED_PAIRS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDismissedPairs(pairs: DismissedClonePair[]) {
  try {
    localStorage.setItem(STORAGE_DISMISSED_PAIRS_KEY, JSON.stringify(pairs));
  } catch (e) {
    console.warn('[Clone Wars] Failed to save dismissed pairs:', e);
  }
}

export function loadLearnedWords(): Map<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_LEARNED_WORDS_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

export function saveLearnedWords(wordsMap: Map<string, number>) {
  try {
    const obj = Object.fromEntries(wordsMap.entries());
    localStorage.setItem(STORAGE_LEARNED_WORDS_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('[Clone Wars] Failed to save learned words:', e);
  }
}

export function extractSignificantWords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !COMMON_STOPWORDS.has(w));
}

export function detectCloneClusters(
  projects: OperationProject[],
  strictMode = false,
  dismissedPairIds: Set<string> = new Set(),
  learnedFalsePositiveWords: Set<string> = new Set()
): CloneCluster[] {
  const clusters: CloneCluster[] = [];

  for (let i = 0; i < projects.length; i++) {
    const p1 = projects[i];
    const words1 = extractSignificantWords(p1.propertyName);
    const set1 = new Set(words1);

    for (let j = i + 1; j < projects.length; j++) {
      const p2 = projects[j];
      const key1 = `${p1.id}__${p2.id}`;
      const key2 = `${p2.id}__${p1.id}`;

      // 1. Skip if explicitly marked as not a clone
      if (dismissedPairIds.has(key1) || dismissedPairIds.has(key2)) {
        continue;
      }

      const words2 = extractSignificantWords(p2.propertyName);
      const rawShared = Array.from(new Set(words2.filter((w) => set1.has(w))));

      // 2. Filter out words learned to be false-positive noise
      const shared = rawShared.filter((w) => !learnedFalsePositiveWords.has(w.toLowerCase()));

      if (shared.length > 0) {
        // Calculate Jaccard similarity
        const union = new Set([...words1, ...words2]);
        const ratio = shared.length / (union.size || 1);

        let confidence: 'High' | 'Medium' | 'Low' = 'Low';
        if (ratio >= 0.5 || shared.length >= 2) {
          confidence = 'High';
        } else if (ratio >= 0.25 || shared.length === 1) {
          confidence = 'Medium';
        }

        if (strictMode && confidence === 'Low') {
          continue;
        }

        clusters.push({
          id: key1,
          projectA: p1,
          projectB: p2,
          sharedWords: shared,
          confidence,
        });
      }
    }
  }

  return clusters;
}

interface CloneWarsWorkspaceProps {
  projects: OperationProject[];
  onMergeProjects: (survivorProject: OperationProject, obsoleteProjectId: string) => void;
  onClose: () => void;
  onNavigateToProject?: (projectId: string) => void;
}

export const CloneWarsWorkspace: React.FC<CloneWarsWorkspaceProps> = ({
  projects,
  onMergeProjects,
  onClose,
  onNavigateToProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [strictScan, setStrictScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Scanner Tuning & Ignored Matches state (persisted to localStorage)
  const [dismissedPairs, setDismissedPairs] = useState<DismissedClonePair[]>(() => loadDismissedPairs());
  const [learnedWords, setLearnedWords] = useState<Map<string, number>>(() => loadLearnedWords());
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);
  const [tuningTab, setTuningTab] = useState<'pairs' | 'words'>('pairs');
  const [newWordInput, setNewWordInput] = useState<string>('');
  const [lastDismissedNotice, setLastDismissedNotice] = useState<{
    pairId: string;
    pairAName: string;
    pairBName: string;
    words: string[];
  } | null>(null);

  // Manual pair selection overrides
  const [manualProjAId, setManualProjAId] = useState<string>('');
  const [manualProjBId, setManualProjBId] = useState<string>('');

  // Active pair in the Merge Studio
  const [activePair, setActivePair] = useState<{
    projectA: OperationProject;
    projectB: OperationProject;
    sharedWords?: string[];
  } | null>(null);

  // Merge Blueprint state (tracks PM selections for each attribute)
  const [chosenSurvivorId, setChosenSurvivorId] = useState<'A' | 'B'>('A');
  const [chosenNameSource, setChosenNameSource] = useState<'A' | 'B' | 'custom'>('A');
  const [customName, setCustomName] = useState('');
  const [chosenClientSource, setChosenClientSource] = useState<'A' | 'B'>('A');
  const [chosenAddressSource, setChosenAddressSource] = useState<'A' | 'B'>('A');
  const [chosenUnitsMode, setChosenUnitsMode] = useState<'A' | 'B' | 'sum' | 'custom'>('sum');
  const [customUnits, setCustomUnits] = useState(0);
  const [chosenPMSource, setChosenPMSource] = useState<'A' | 'B'>('A');
  const [chosenStatusSource, setChosenStatusSource] = useState<'A' | 'B'>('A');
  const [chosenDatesSource, setChosenDatesSource] = useState<'A' | 'B'>('A');
  const [chosenBOMMode, setChosenBOMMode] = useState<'A' | 'B' | 'combine'>('combine');
  const [chosenPartnersMode, setChosenPartnersMode] = useState<'A' | 'B' | 'combine'>('combine');
  const [chosenMilestonesMode, setChosenMilestonesMode] = useState<'A' | 'B' | 'combine'>('combine');
  const [combineLogs, setCombineLogs] = useState(true);
  const [combineComms, setCombineComms] = useState(true);
  const [combineNotes, setCombineNotes] = useState(true);

  // Merge success banner
  const [mergedSuccessMsg, setMergedSuccessMsg] = useState<{
    survivorName: string;
    survivorId: string;
    obsoleteName: string;
  } | null>(null);

  // Set of dismissed pair IDs (bidirectional)
  const dismissedSet = useMemo(() => {
    const set = new Set<string>();
    dismissedPairs.forEach((p) => {
      set.add(p.id);
      set.add(`${p.projectBId}__${p.projectAId}`);
    });
    return set;
  }, [dismissedPairs]);

  // Set of learned false-positive words to filter
  const learnedWordsSet = useMemo(() => {
    return new Set(Array.from(learnedWords.keys()));
  }, [learnedWords]);

  // Scan clusters based on current projects list, ignoring dismissed pairs & learned noise words
  const detectedClusters = useMemo(() => {
    return detectCloneClusters(projects, strictScan, dismissedSet, learnedWordsSet);
  }, [projects, strictScan, dismissedSet, learnedWordsSet]);

  const filteredClusters = useMemo(() => {
    if (!searchTerm.trim()) return detectedClusters;
    const q = searchTerm.toLowerCase();
    return detectedClusters.filter(
      (c) =>
        c.projectA.propertyName.toLowerCase().includes(q) ||
        c.projectB.propertyName.toLowerCase().includes(q) ||
        c.sharedWords.some((w) => w.toLowerCase().includes(q))
    );
  }, [detectedClusters, searchTerm]);

  // Mark identified match as NOT a clone: removes it and teaches the duplicate scanner
  const handleMarkNotClone = (pA: OperationProject, pB: OperationProject, words: string[]) => {
    const pairId = `${pA.id}__${pB.id}`;
    const now = new Date().toISOString();

    const newDismissed: DismissedClonePair = {
      id: pairId,
      projectAId: pA.id,
      projectBId: pB.id,
      projectAName: pA.propertyName,
      projectBName: pB.propertyName,
      sharedWords: words,
      dismissedAt: now,
    };

    const updatedDismissed = [
      newDismissed,
      ...dismissedPairs.filter(
        (p) => p.id !== pairId && p.id !== `${pB.id}__${pA.id}`
      ),
    ];
    setDismissedPairs(updatedDismissed);
    saveDismissedPairs(updatedDismissed);

    // Teach scanner by counting false-positive words
    const updatedWords = new Map(learnedWords);
    words.forEach((w) => {
      const clean = w.toLowerCase().trim();
      if (clean.length >= 3 && !COMMON_STOPWORDS.has(clean)) {
        updatedWords.set(clean, (updatedWords.get(clean) || 0) + 1);
      }
    });
    setLearnedWords(updatedWords);
    saveLearnedWords(updatedWords);

    // If active in Arena, unload it
    if (
      activePair &&
      ((activePair.projectA.id === pA.id && activePair.projectB.id === pB.id) ||
        (activePair.projectA.id === pB.id && activePair.projectB.id === pA.id))
    ) {
      setActivePair(null);
    }

    setLastDismissedNotice({
      pairId,
      pairAName: pA.propertyName,
      pairBName: pB.propertyName,
      words,
    });
  };

  // Undo dismissing a pair
  const handleUndoDismiss = (pairId: string, words: string[]) => {
    const [idA, idB] = pairId.split('__');
    const updatedDismissed = dismissedPairs.filter(
      (p) => p.id !== pairId && !(p.projectAId === idB && p.projectBId === idA)
    );
    setDismissedPairs(updatedDismissed);
    saveDismissedPairs(updatedDismissed);

    const updatedWords = new Map(learnedWords);
    words.forEach((w) => {
      const clean = w.toLowerCase().trim();
      const count = (updatedWords.get(clean) || 1) - 1;
      if (count <= 0) {
        updatedWords.delete(clean);
      } else {
        updatedWords.set(clean, count);
      }
    });
    setLearnedWords(updatedWords);
    saveLearnedWords(updatedWords);
    setLastDismissedNotice(null);
  };

  // Re-enable an ignored pair from tuning modal
  const handleReEnablePair = (pair: DismissedClonePair) => {
    handleUndoDismiss(pair.id, pair.sharedWords);
  };

  // Remove a learned word filter
  const handleRemoveLearnedWord = (word: string) => {
    const updatedWords = new Map(learnedWords);
    updatedWords.delete(word.toLowerCase());
    setLearnedWords(updatedWords);
    saveLearnedWords(updatedWords);
  };

  // Add custom noise word filter
  const handleAddNewLearnedWord = () => {
    const clean = newWordInput.trim().toLowerCase();
    if (!clean || clean.length < 3) return;
    const updatedWords = new Map(learnedWords);
    updatedWords.set(clean, (updatedWords.get(clean) || 0) + 1);
    setLearnedWords(updatedWords);
    saveLearnedWords(updatedWords);
    setNewWordInput('');
  };

  // Reset all scanner training and ignored pairs
  const handleResetAllTraining = () => {
    setDismissedPairs([]);
    setLearnedWords(new Map());
    localStorage.removeItem(STORAGE_DISMISSED_PAIRS_KEY);
    localStorage.removeItem(STORAGE_LEARNED_WORDS_KEY);
    setLastDismissedNotice(null);
  };

  // Load a pair into the Merge Studio
  const handleLoadPair = (
    pA: OperationProject,
    pB: OperationProject,
    sharedWords?: string[]
  ) => {
    setActivePair({ projectA: pA, projectB: pB, sharedWords });
    setChosenSurvivorId('A');
    setChosenNameSource('A');
    setCustomName(pA.propertyName);
    setChosenClientSource('A');
    setChosenAddressSource('A');
    setChosenUnitsMode('sum');
    setCustomUnits((pA.unitsCount || 0) + (pB.unitsCount || 0));
    setChosenPMSource('A');
    setChosenStatusSource('A');
    setChosenDatesSource('A');
    setChosenBOMMode('combine');
    setChosenPartnersMode('combine');
    setChosenMilestonesMode('combine');
    setCombineLogs(true);
    setCombineComms(true);
    setCombineNotes(true);
    setMergedSuccessMsg(null);
  };

  const handleSimulateDuplicate = () => {
    if (projects.length === 0) return;
    const base = projects[0];
    const clone: OperationProject = {
      ...base,
      id: `clone_${Date.now()}`,
      propertyName: `${base.propertyName} (Duplicate Phase)`,
      clientName: base.clientName,
      unitsCount: Math.round(base.unitsCount * 0.5),
      lastUpdated: new Date().toISOString(),
    };
    handleLoadPair(base, clone, extractSignificantWords(base.propertyName));
  };

  const handleTriggerRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Compute finalized survivor project payload based on PM selections
  const previewFinalProject = useMemo<OperationProject | null>(() => {
    if (!activePair) return null;

    try {
      const { projectA, projectB } = activePair;

      const baseSurvivor = chosenSurvivorId === 'A' ? projectA : projectB;
      const donor = chosenSurvivorId === 'A' ? projectB : projectA;

      // 1. Property Name
      let propertyName = baseSurvivor.propertyName;
      if (chosenNameSource === 'A') propertyName = projectA.propertyName;
      else if (chosenNameSource === 'B') propertyName = projectB.propertyName;
      else if (chosenNameSource === 'custom' && customName.trim()) propertyName = customName.trim();

      // 2. Client Name
      const clientName = chosenClientSource === 'A' ? projectA.clientName : projectB.clientName;

      // 3. Address
      const addressSource = chosenAddressSource === 'A' ? projectA : projectB;

      // 4. Units
      let unitsCount = baseSurvivor.unitsCount;
      if (chosenUnitsMode === 'A') unitsCount = projectA.unitsCount;
      else if (chosenUnitsMode === 'B') unitsCount = projectB.unitsCount;
      else if (chosenUnitsMode === 'sum') unitsCount = (projectA.unitsCount || 0) + (projectB.unitsCount || 0);
      else if (chosenUnitsMode === 'custom') unitsCount = customUnits;

      // 5. Assigned PM
      const assignedPM = chosenPMSource === 'A' ? projectA.assignedPM : projectB.assignedPM;

      // 6. Status
      const statusSource = chosenStatusSource === 'A' ? projectA : projectB;

      // 7. Dates
      const datesSource = chosenDatesSource === 'A' ? projectA : projectB;

      // 8. BOM Items
      let bomItems: BOMItem[] = [];
      if (chosenBOMMode === 'A') {
        bomItems = [...(projectA.bomItems || [])];
      } else if (chosenBOMMode === 'B') {
        bomItems = [...(projectB.bomItems || [])];
      } else {
        // Combine & Deduplicate
        const itemMap = new Map<string, BOMItem>();
        [...(projectA.bomItems || []), ...(projectB.bomItems || [])].forEach((item) => {
          const itemName = item.name || (item as any).productName || item.model || 'BOM Item';
          const key = `${itemName.toLowerCase()}__${(item.model || '').toLowerCase()}__${(item.category || '').toLowerCase()}`;
          if (itemMap.has(key)) {
            const existing = itemMap.get(key)!;
            itemMap.set(key, {
              ...existing,
              quantity: (existing.quantity || 0) + (item.quantity || 0),
              installedCount: (existing.installedCount || 0) + (item.installedCount || 0),
            });
          } else {
            itemMap.set(key, { ...item });
          }
        });
        bomItems = Array.from(itemMap.values());
      }

      // 9. Integrator Partners
      let integratorPartners: string[] = [];
      if (chosenPartnersMode === 'A') {
        integratorPartners = getProjectIntegratorPartners(projectA);
      } else if (chosenPartnersMode === 'B') {
        integratorPartners = getProjectIntegratorPartners(projectB);
      } else {
        integratorPartners = Array.from(
          new Set([...getProjectIntegratorPartners(projectA), ...getProjectIntegratorPartners(projectB)])
        );
      }

      // 10. Milestones
      let milestones: ProjectMilestone[] = [];
      if (chosenMilestonesMode === 'A') {
        milestones = [...(projectA.milestones || [])];
      } else if (chosenMilestonesMode === 'B') {
        milestones = [...(projectB.milestones || [])];
      } else {
        const milestoneMap = new Map<string, ProjectMilestone>();
        [...(projectA.milestones || []), ...(projectB.milestones || [])].forEach((m) => {
          if (!milestoneMap.has(m.title) || m.status === 'Completed' || m.status === 'In Progress') {
            milestoneMap.set(m.title, { ...m });
          }
        });
        milestones = Array.from(milestoneMap.values());
      }

      // 11. Install Logs
      const installLogs: InstallLogEntry[] = combineLogs
        ? [...(projectA.installLogs || []), ...(projectB.installLogs || [])]
        : [...(baseSurvivor.installLogs || [])];

      // 12. Customer Comms
      const customerCommsLogs: CustomerCommsLog[] = combineComms
        ? [...(projectA.customerCommsLogs || []), ...(projectB.customerCommsLogs || [])]
        : [...(baseSurvivor.customerCommsLogs || [])];

      // 13. Project Notes
      const auditNote: ProjectNote = {
        id: `merge_${Date.now()}`,
        projectId: baseSurvivor.id,
        author: assignedPM?.name || 'Quext Project Manager',
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        category: 'General Context',
        text: `[The Clone Wars Merge] Project successfully merged with duplicate "${donor.propertyName}" (${donor.id}) on ${new Date().toLocaleDateString()}. Hardware BOM deduplicated, timelines consolidated.`,
        isPinned: true,
      };

      const notes: ProjectNote[] = combineNotes
        ? [auditNote, ...(projectA.notes || []), ...(projectB.notes || [])]
        : [auditNote, ...(baseSurvivor.notes || [])];

      return {
        ...baseSurvivor,
        propertyName,
        clientName,
        address: addressSource.address,
        city: addressSource.city,
        state: addressSource.state,
        unitsCount,
        assignedPM,
        platform: baseSurvivor.platform || donor.platform || 'Quext',
        statusTag: statusSource.statusTag,
        startDate: datesSource.startDate,
        targetCompletionDate: datesSource.targetCompletionDate,
        bomItems,
        integratorPartners,
        milestones,
        installLogs,
        customerCommsLogs,
        notes,
        lastUpdated: new Date().toISOString(),
      };
    } catch (err) {
      console.error('[The Clone Wars] Fail-safe caught error in previewFinalProject:', err);
      return activePair.projectA || null;
    }
  }, [
    activePair,
    chosenSurvivorId,
    chosenNameSource,
    customName,
    chosenClientSource,
    chosenAddressSource,
    chosenUnitsMode,
    customUnits,
    chosenPMSource,
    chosenStatusSource,
    chosenDatesSource,
    chosenBOMMode,
    chosenPartnersMode,
    chosenMilestonesMode,
    combineLogs,
    combineComms,
    combineNotes,
  ]);

  const handleExecuteMerge = () => {
    if (!previewFinalProject || !activePair) return;

    const survivor = previewFinalProject;
    const obsoleteId =
      chosenSurvivorId === 'A' ? activePair.projectB.id : activePair.projectA.id;
    const obsoleteName =
      chosenSurvivorId === 'A' ? activePair.projectB.propertyName : activePair.projectA.propertyName;

    onMergeProjects(survivor, obsoleteId);

    setMergedSuccessMsg({
      survivorName: survivor.propertyName,
      survivorId: survivor.id,
      obsoleteName,
    });

    setActivePair(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* =====================================================================
          1. HEADER & HERO BANNER
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>The Clone Wars</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    PM Duplicate Merge Studio
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Scans projects sharing name tokens, allows side-by-side element picking, and consolidates into one finalized master project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleTriggerRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Rescan site for matching title words"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Rescan Duplicates'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateDuplicate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
              title="Generate a duplicate project to test merging"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Clone Pair</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTuningModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Manage dismissed pairs and learned duplicate scanner stopwords"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanner Tuning</span>
              {(dismissedPairs.length > 0 || learnedWords.size > 0) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {dismissedPairs.length + learnedWords.size}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Workspace</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. MERGE SUCCESS BANNER (IF EXECUTED)
      ===================================================================== */}
      {mergedSuccessMsg && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-200 text-sm">
                  Clone War Finalized! Duplicate Merged Successfully.
                </p>
                <p className="text-emerald-300/80 mt-0.5">
                  Archived obsolete duplicate <span className="font-semibold text-emerald-100">&quot;{mergedSuccessMsg.obsoleteName}&quot;</span> and saved all selected attributes into master project <span className="font-semibold text-white">&quot;{mergedSuccessMsg.survivorName}&quot;</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onNavigateToProject && (
                <button
                  type="button"
                  onClick={() => onNavigateToProject(mergedSuccessMsg.survivorId)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Master Project</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setMergedSuccessMsg(null)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. MAIN CONTENT: 2-COLUMN VIEW (CLONE DETECTOR vs MERGE STUDIO)
      ===================================================================== */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* =====================================================================
              LEFT COLUMN (4 Cols): DETECTED DUPLICATE CLUSTERS
          ===================================================================== */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Detected Clone Clusters</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {detectedClusters.length} Found
                </span>
              </div>

              {/* Search & Strict Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by title or shared word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Scan Mode:</span>
                <button
                  type="button"
                  onClick={() => setStrictScan((v) => !v)}
                  className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                    strictScan
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {strictScan ? 'Strict (Multi-word matches)' : 'Broad (Any word shared)'}
                </button>
              </div>
            </div>

            {/* Dismissal / Scanner Learning Banner */}
            {lastDismissedNotice && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/40 text-xs shadow-md space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight text-slate-300">
                      <span className="font-semibold text-slate-100">Dismissed as duplicate:</span>{' '}
                      <span className="text-white font-medium">&quot;{lastDismissedNotice.pairAName}&quot;</span> &amp;{' '}
                      <span className="text-white font-medium">&quot;{lastDismissedNotice.pairBName}&quot;</span>.
                      {lastDismissedNotice.words.length > 0 && (
                        <p className="text-[10px] text-cyan-300 mt-1">
                          Scanner learned to ignore generic term(s):{' '}
                          <span className="font-mono font-bold">{lastDismissedNotice.words.join(', ')}</span>.
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLastDismissedNotice(null)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowTuningModal(true)}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Brain className="w-3 h-3" />
                    <span>View Tuning Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUndoDismiss(lastDismissedNotice.pairId, lastDismissedNotice.words);
                      setLastDismissedNotice(null);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/40 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Clusters List */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredClusters.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-200">No Duplicates Found</p>
                  <p className="text-[11px] text-slate-400">
                    No projects sharing name tokens were detected with current filters. Try switching to Broad mode or picking a manual pair below.
                  </p>
                </div>
              ) : (
                filteredClusters.map((cluster) => {
                  const isCurrentActive =
                    activePair &&
                    ((activePair.projectA.id === cluster.projectA.id &&
                      activePair.projectB.id === cluster.projectB.id) ||
                      (activePair.projectA.id === cluster.projectB.id &&
                        activePair.projectB.id === cluster.projectA.id));

                  return (
                    <div
                      key={cluster.id}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrentActive
                          ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                          : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                      }`}
                      onClick={() =>
                        handleLoadPair(cluster.projectA, cluster.projectB, cluster.sharedWords)
                      }
                    >
                      {/* Shared Words Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Shared:
                        </span>
                        {cluster.sharedWords.map((w) => (
                          <span
                            key={w}
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          >
                            &quot;{w}&quot;
                          </span>
                        ))}
                        <span
                          className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${
                            cluster.confidence === 'High'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {cluster.confidence} Match
                        </span>
                      </div>

                      {/* Project A vs Project B Comparison Card */}
                      <div className="space-y-2">
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-100 truncate block">
                              {cluster.projectA.propertyName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {cluster.projectA.unitsCount} units · {cluster.projectA.assignedPM?.name || 'Quext PM'}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 shrink-0">
                            A
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-100 truncate block">
                              {cluster.projectB.propertyName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {cluster.projectB.unitsCount} units · {cluster.projectB.assignedPM?.name || 'Quext PM'}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 shrink-0">
                            B
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkNotClone(
                              cluster.projectA,
                              cluster.projectB,
                              cluster.sharedWords
                            );
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Mark this match as NOT a duplicate. Removes it and teaches scanner to ignore these words."
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>Not a Clone</span>
                        </button>

                        <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1 group">
                          <span>Enter Merge Arena</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Manual Pair Selection Accordion */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Manual Pair Comparison</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Want to merge two projects whose titles do not share exact words? Select any two projects below:
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">
                    PROJECT ALPHA (1):
                  </label>
                  <select
                    value={manualProjAId}
                    onChange={(e) => setManualProjAId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="">Select Project A...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.propertyName} ({p.unitsCount}u)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">
                    PROJECT BETA (2):
                  </label>
                  <select
                    value={manualProjBId}
                    onChange={(e) => setManualProjBId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="">Select Project B...</option>
                    {projects
                      .filter((p) => p.id !== manualProjAId)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.propertyName} ({p.unitsCount}u)
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={!manualProjAId || !manualProjBId}
                  onClick={() => {
                    const pA = projects.find((p) => p.id === manualProjAId);
                    const pB = projects.find((p) => p.id === manualProjBId);
                    if (pA && pB) {
                      handleLoadPair(pA, pB, ['manual']);
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer mt-1"
                >
                  Load Custom Pair into Arena
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT COLUMN (8 Cols): MERGE ARENA & ELEMENT PICKER
          ===================================================================== */}
          <div className="xl:col-span-8 space-y-5">
            {!activePair ? (
              <div className="p-12 rounded-3xl bg-[#0F172A] border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                  <GitMerge className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-white">
                    Select a Clone Cluster to Enter the Merge Arena
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose one of the automatically detected clone clusters on the left, or use the manual selector to pick two projects to consolidate.
                  </p>
                </div>
                {detectedClusters.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleLoadPair(
                        detectedClusters[0].projectA,
                        detectedClusters[0].projectB,
                        detectedClusters[0].sharedWords
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>Load First Cluster: &quot;{detectedClusters[0].sharedWords[0]}&quot;</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
                {/* Arena Header */}
                <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      <GitMerge className="w-4 h-4" />
                      <span>Element-by-Element Merge Arena</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white mt-1">
                      Choose Elements to Finalize into Single Master Project
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click either Project Alpha or Project Beta (or Combine) on each attribute below.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (activePair) {
                          handleMarkNotClone(
                            activePair.projectA,
                            activePair.projectB,
                            activePair.sharedWords || []
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-semibold cursor-pointer transition-colors"
                      title="Dismiss this pair as NOT a duplicate. Unloads arena and trains scanner."
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Not a Clone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePair(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel Arena
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteMerge}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Execute Merge Finalization</span>
                    </button>
                  </div>
                </div>

                {/* Survivor Project Base ID Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">Permanent Master Project ID:</span>
                    <span className="text-[11px] text-slate-400">
                      The database record ID that will survive and remain active.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChosenSurvivorId('A')}
                      className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
                        chosenSurvivorId === 'A'
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Keep ID Alpha ({activePair.projectA.id.slice(0, 10)}...)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChosenSurvivorId('B')}
                      className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
                        chosenSurvivorId === 'B'
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Keep ID Beta ({activePair.projectB.id.slice(0, 10)}...)
                    </button>
                  </div>
                </div>

                {/* =======================================================
                    ATTRIBUTE COMPARISON GRID
                ======================================================= */}
                <div className="space-y-4">
                  {/* 1. Property Name */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        Property / Project Name
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        Selected:{' '}
                        {chosenNameSource === 'A'
                          ? 'Alpha'
                          : chosenNameSource === 'B'
                          ? 'Beta'
                          : 'Custom'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setChosenNameSource('A');
                          setCustomName(activePair.projectA.propertyName);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenNameSource === 'A'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Alpha</span>
                        <span className="text-xs">{activePair.projectA.propertyName}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setChosenNameSource('B');
                          setCustomName(activePair.projectB.propertyName);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenNameSource === 'B'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Beta</span>
                        <span className="text-xs">{activePair.projectB.propertyName}</span>
                      </button>

                      <div
                        onClick={() => setChosenNameSource('custom')}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          chosenNameSource === 'custom'
                            ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Custom Title</span>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => {
                            setCustomName(e.target.value);
                            setChosenNameSource('custom');
                          }}
                          placeholder="Type custom name..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white mt-1 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Client Name & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client Name */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Client / Management Account
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setChosenClientSource('A')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            chosenClientSource === 'A'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Alpha</span>
                          <span>{activePair.projectA.clientName || 'N/A'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChosenClientSource('B')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            chosenClientSource === 'B'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Beta</span>
                          <span>{activePair.projectB.clientName || 'N/A'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Property Address &amp; Region
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setChosenAddressSource('A')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            chosenAddressSource === 'A'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Alpha</span>
                          <span className="truncate block">{activePair.projectA.address}, {activePair.projectA.state}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChosenAddressSource('B')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            chosenAddressSource === 'B'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Beta</span>
                          <span className="truncate block">{activePair.projectB.address}, {activePair.projectB.state}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Units Count */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Total Units Count
                      </span>
                      <span className="text-xs font-mono font-extrabold text-amber-400">
                        Final Units: {previewFinalProject?.unitsCount || 0}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setChosenUnitsMode('A')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenUnitsMode === 'A'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Keep Alpha</span>
                        <span className="font-mono text-sm">{activePair.projectA.unitsCount} units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChosenUnitsMode('B')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenUnitsMode === 'B'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Keep Beta</span>
                        <span className="font-mono text-sm">{activePair.projectB.unitsCount} units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChosenUnitsMode('sum')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenUnitsMode === 'sum'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Combine Sum (A+B)</span>
                        <span className="font-mono text-sm text-emerald-400">
                          {(activePair.projectA.unitsCount || 0) + (activePair.projectB.unitsCount || 0)} units
                        </span>
                      </button>

                      <div
                        onClick={() => setChosenUnitsMode('custom')}
                        className={`p-2.5 rounded-xl border cursor-pointer ${
                          chosenUnitsMode === 'custom'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Custom Input</span>
                        <input
                          type="number"
                          value={customUnits}
                          onChange={(e) => {
                            setCustomUnits(parseInt(e.target.value, 10) || 0);
                            setChosenUnitsMode('custom');
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white font-mono mt-0.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Bill of Materials (BOM Hardware Items) */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        Hardware Bill of Materials (BOM Scope)
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {previewFinalProject?.bomItems?.length || 0} Merged Line Items
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setChosenBOMMode('combine')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'combine'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">
                            Combine &amp; Deduplicate (Recommended)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">
                            Smart Merge
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Merges identical SKUs from both projects and combines quantities.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChosenBOMMode('A')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'A'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Alpha Scope Only</span>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Keep {activePair.projectA.bomItems?.length || 0} line items from Alpha.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChosenBOMMode('B')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'B'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Beta Scope Only</span>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Keep {activePair.projectB.bomItems?.length || 0} line items from Beta.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* 5. Assigned Integrator Partners */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Assigned Integrator Partners
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setChosenPartnersMode('combine')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenPartnersMode === 'combine'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-amber-400 block">Combine All Partners</span>
                        <span className="text-[11px]">
                          {previewFinalProject?.integratorPartners?.join(', ') || 'No partners assigned'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenPartnersMode('A')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenPartnersMode === 'A'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Alpha Partners Only</span>
                        <span className="text-[11px]">
                          {getProjectIntegratorPartners(activePair.projectA).join(', ') || 'None'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenPartnersMode('B')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          chosenPartnersMode === 'B'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 block">Beta Partners Only</span>
                        <span className="text-[11px]">
                          {getProjectIntegratorPartners(activePair.projectB).join(', ') || 'None'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 6. PM & Milestones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Assigned PM */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Assigned Project Manager
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setChosenPMSource('A')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                            chosenPMSource === 'A'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Alpha PM</span>
                          <span>{activePair.projectA.assignedPM?.name || 'Quext PM'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChosenPMSource('B')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                            chosenPMSource === 'B'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Beta PM</span>
                          <span>{activePair.projectB.assignedPM?.name || 'Quext PM'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Milestone Pipeline Status
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setChosenMilestonesMode('combine')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                            chosenMilestonesMode === 'combine'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-amber-400 block">Combine Pipelines</span>
                          <span>Keep Most Advanced</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChosenMilestonesMode('A')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                            chosenMilestonesMode === 'A'
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 block">Alpha Pipeline</span>
                          <span>{activePair.projectA.milestones?.length || 0} Milestones</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 7. Checkboxes to preserve history & logs */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-5 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={combineLogs}
                        onChange={(e) => setCombineLogs(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/30"
                      />
                      <span>Combine Technician Install Logs</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={combineComms}
                        onChange={(e) => setCombineComms(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/30"
                      />
                      <span>Combine Customer Comms &amp; Email Digests</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={combineNotes}
                        onChange={(e) => setCombineNotes(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/30"
                      />
                      <span>Append Merge Audit Note</span>
                    </label>
                  </div>
                </div>

                {/* Final Blueprint Summary Footer & Execution Button */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-white block">Ready to finalize master project:</span>
                    <span>
                      &quot;{previewFinalProject?.propertyName}&quot; · {previewFinalProject?.unitsCount} units · {previewFinalProject?.bomItems?.length} BOM items.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteMerge}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Finalize Single Project &amp; Archive Duplicate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =====================================================================
          4. SCANNER TUNING & ADAPTIVE LEARNING MODAL
      ===================================================================== */}
      {showTuningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Scanner Adaptive Learning &amp; Tuning
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage dismissed clone pairs and noise keywords that train the duplicate scanner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTuningModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTuningTab('pairs')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                  tuningTab === 'pairs'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Dismissed Pairs ({dismissedPairs.length})
              </button>
              <button
                type="button"
                onClick={() => setTuningTab('words')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                  tuningTab === 'words'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Learned Noise Words ({learnedWords.size})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {tuningTab === 'pairs' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    These specific property pairs were marked as <strong className="text-slate-200">&quot;Not a Clone&quot;</strong>. The scanner permanently blacklists them from appearing together in clone alerts.
                  </p>

                  {dismissedPairs.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                      <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-300">No Dismissed Pairs</p>
                      <p className="text-[11px] text-slate-500">
                        When you click &quot;Not a Clone&quot; on a detected match card, it will be cataloged here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {dismissedPairs.map((pair) => (
                        <div
                          key={pair.id}
                          className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white truncate max-w-[200px]">
                                {pair.projectAName}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">vs</span>
                              <span className="font-bold text-white truncate max-w-[200px]">
                                {pair.projectBName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-500">Shared tokens:</span>
                              {pair.sharedWords.map((w) => (
                                <span
                                  key={w}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                                >
                                  {w}
                                </span>
                              ))}
                              <span className="text-[10px] text-slate-500 ml-2">
                                {new Date(pair.dismissedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleReEnablePair(pair)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                            title="Re-enable duplicate detection for this pair"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            <span>Re-Enable</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Words in this negative stoplist are treated as common generic multifamily terms (e.g. <em>&quot;apartments&quot;</em>, <em>&quot;square&quot;</em>). The duplicate scanner ignores them so properties sharing only these terms are not falsely flagged.
                  </p>

                  {/* Add Custom Word Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add custom noise word (e.g., residences, commons)..."
                      value={newWordInput}
                      onChange={(e) => setNewWordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewLearnedWord();
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      disabled={!newWordInput.trim() || newWordInput.trim().length < 3}
                      onClick={handleAddNewLearnedWord}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Add Stopword
                    </button>
                  </div>

                  {/* Learned Words Tag Cloud */}
                  {learnedWords.size === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-300">No Noise Keywords Learned Yet</p>
                      <p className="text-[11px] text-slate-500">
                        When you mark a match as &quot;Not a Clone&quot;, any generic shared words will automatically appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                      {Array.from(learnedWords.entries()).map(([word, count]) => (
                        <span
                          key={word}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-500/30"
                        >
                          <span>&quot;{word}&quot;</span>
                          {count > 1 && (
                            <span className="text-[10px] px-1 py-0.2 rounded-full bg-cyan-500/30 text-cyan-300 font-bold">
                              x{count}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveLearnedWord(word)}
                            className="p-0.5 text-cyan-300 hover:text-white rounded hover:bg-cyan-500/30 cursor-pointer"
                            title={`Remove "${word}" from noise stoplist`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/70">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all learned noise words and re-enable all dismissed clone pairs?')) {
                    handleResetAllTraining();
                  }
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Training</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTuningModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
