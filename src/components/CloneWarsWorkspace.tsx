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
  ThumbsUp,
  Star,
  Award,
  Table,
  Columns,
  Package,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CheckSquare,
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
  confidence: 'Confirmed' | 'High' | 'Medium' | 'Low';
  isConfirmedClone?: boolean;
}

export interface ConfirmedClonePair {
  id: string;
  projectAId: string;
  projectBId: string;
  projectAName: string;
  projectBName: string;
  sharedWords: string[];
  confirmedAt: string;
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
export const STORAGE_CONFIRMED_PAIRS_KEY = 'quext_clone_wars_confirmed_pairs_v1';
export const STORAGE_CONFIRMED_WORDS_KEY = 'quext_clone_wars_confirmed_words_v1';

export function loadConfirmedPairs(): ConfirmedClonePair[] {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIRMED_PAIRS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConfirmedPairs(pairs: ConfirmedClonePair[]) {
  try {
    localStorage.setItem(STORAGE_CONFIRMED_PAIRS_KEY, JSON.stringify(pairs));
  } catch (e) {
    console.warn('[Clone Wars] Failed to save confirmed pairs:', e);
  }
}

export function loadConfirmedWords(): Map<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIRMED_WORDS_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

export function saveConfirmedWords(wordsMap: Map<string, number>) {
  try {
    const obj = Object.fromEntries(wordsMap.entries());
    localStorage.setItem(STORAGE_CONFIRMED_WORDS_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('[Clone Wars] Failed to save confirmed words:', e);
  }
}

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

export function getBOMItemKey(item: BOMItem): string {
  const modelPart = (item.model || '').trim().toLowerCase();
  const namePart = (item.name || '').trim().toLowerCase();
  return modelPart ? `${modelPart}__${namePart}` : namePart || item.id;
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
  learnedFalsePositiveWords: Set<string> = new Set(),
  confirmedPairIds: Set<string> = new Set(),
  confirmedIndicatorWords: Set<string> = new Set()
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

      const isExplicitConfirmed = confirmedPairIds.has(key1) || confirmedPairIds.has(key2);

      const words2 = extractSignificantWords(p2.propertyName);
      const rawShared = Array.from(new Set(words2.filter((w) => set1.has(w))));

      // 2. Filter out words learned to be false-positive noise, unless verified as clone
      const shared = rawShared.filter(
        (w) => isExplicitConfirmed || !learnedFalsePositiveWords.has(w.toLowerCase())
      );

      if (isExplicitConfirmed || shared.length > 0) {
        // Calculate similarity
        const union = new Set([...words1, ...words2]);
        const ratio = shared.length / (union.size || 1);

        // Check if shares any reinforced positive indicator keywords learned from confirmed duplicates
        const sharesPositiveIndicator = shared.some((w) =>
          confirmedIndicatorWords.has(w.toLowerCase())
        );

        let confidence: 'Confirmed' | 'High' | 'Medium' | 'Low' = 'Low';
        if (isExplicitConfirmed) {
          confidence = 'Confirmed';
        } else if (ratio >= 0.5 || shared.length >= 2 || sharesPositiveIndicator) {
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
          sharedWords: shared.length > 0 ? shared : ['confirmed_clone'],
          confidence,
          isConfirmedClone: isExplicitConfirmed,
        });
      }
    }
  }

  // Sort: Confirmed first, then High, Medium, Low
  const score = (c: CloneCluster) => {
    if (c.isConfirmedClone) return 1000;
    if (c.confidence === 'High') return 100 + c.sharedWords.length;
    if (c.confidence === 'Medium') return 20 + c.sharedWords.length;
    return c.sharedWords.length;
  };

  return clusters.sort((a, b) => score(b) - score(a));
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

  // Scanner Tuning, Confirmed Duplicates, & Ignored Matches state (persisted to localStorage)
  const [confirmedPairs, setConfirmedPairs] = useState<ConfirmedClonePair[]>(() => loadConfirmedPairs());
  const [confirmedWords, setConfirmedWords] = useState<Map<string, number>>(() => loadConfirmedWords());
  const [dismissedPairs, setDismissedPairs] = useState<DismissedClonePair[]>(() => loadDismissedPairs());
  const [learnedWords, setLearnedWords] = useState<Map<string, number>>(() => loadLearnedWords());
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);
  const [tuningTab, setTuningTab] = useState<'confirmed' | 'pairs' | 'words'>('confirmed');
  const [newWordInput, setNewWordInput] = useState<string>('');
  const [trainingNotice, setTrainingNotice] = useState<{
    type: 'confirmed' | 'dismissed';
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
  const [chosenBOMMode, setChosenBOMMode] = useState<'A' | 'B' | 'combine' | 'custom'>('combine');
  const [bomCustomChoices, setBomCustomChoices] = useState<Record<string, 'combine' | 'A' | 'B' | 'sum' | 'exclude'>>({});
  const [bomViewMode, setBomViewMode] = useState<'matrix' | 'side-by-side'>('matrix');
  const [bomSearchTerm, setBomSearchTerm] = useState<string>('');
  const [bomFilterTab, setBomFilterTab] = useState<'all' | 'diff' | 'a_only' | 'b_only'>('all');
  const [bomExpanded, setBomExpanded] = useState<boolean>(true);
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

  // Set of confirmed clone pair IDs (bidirectional)
  const confirmedSet = useMemo(() => {
    const set = new Set<string>();
    confirmedPairs.forEach((p) => {
      set.add(p.id);
      set.add(`${p.projectBId}__${p.projectAId}`);
    });
    return set;
  }, [confirmedPairs]);

  // Set of confirmed duplicate indicator words
  const confirmedWordsSet = useMemo(() => {
    return new Set(Array.from(confirmedWords.keys()));
  }, [confirmedWords]);

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

  // Scan clusters based on current projects list, factoring in confirmed clones & learned noise words
  const detectedClusters = useMemo(() => {
    return detectCloneClusters(
      projects,
      strictScan,
      dismissedSet,
      learnedWordsSet,
      confirmedSet,
      confirmedWordsSet
    );
  }, [projects, strictScan, dismissedSet, learnedWordsSet, confirmedSet, confirmedWordsSet]);

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

  // Mark identified match as a VERIFIED CLONE to train the duplicate scanner
  const handleMarkAsClone = (pA: OperationProject, pB: OperationProject, words: string[]) => {
    const pairId = `${pA.id}__${pB.id}`;
    const reverseKey = `${pB.id}__${pA.id}`;
    const now = new Date().toISOString();

    const newConfirmed: ConfirmedClonePair = {
      id: pairId,
      projectAId: pA.id,
      projectBId: pB.id,
      projectAName: pA.propertyName,
      projectBName: pB.propertyName,
      sharedWords: words,
      confirmedAt: now,
    };

    const updatedConfirmed = [
      newConfirmed,
      ...confirmedPairs.filter((p) => p.id !== pairId && p.id !== reverseKey),
    ];
    setConfirmedPairs(updatedConfirmed);
    saveConfirmedPairs(updatedConfirmed);

    // If this pair was previously dismissed, un-dismiss it
    const updatedDismissed = dismissedPairs.filter(
      (p) => p.id !== pairId && p.id !== reverseKey
    );
    if (updatedDismissed.length !== dismissedPairs.length) {
      setDismissedPairs(updatedDismissed);
      saveDismissedPairs(updatedDismissed);
    }

    // Teach scanner positive indicator words
    const updatedPosWords = new Map(confirmedWords);
    const updatedNegWords = new Map(learnedWords);

    words.forEach((w) => {
      const clean = w.toLowerCase().trim();
      if (clean.length >= 3 && !COMMON_STOPWORDS.has(clean)) {
        updatedPosWords.set(clean, (updatedPosWords.get(clean) || 0) + 1);
        // Clear from negative noise words so duplicate detection knows this is a real match indicator
        if (updatedNegWords.has(clean)) {
          updatedNegWords.delete(clean);
        }
      }
    });

    setConfirmedWords(updatedPosWords);
    saveConfirmedWords(updatedPosWords);

    setLearnedWords(updatedNegWords);
    saveLearnedWords(updatedNegWords);

    setTrainingNotice({
      type: 'confirmed',
      pairId,
      pairAName: pA.propertyName,
      pairBName: pB.propertyName,
      words,
    });
  };

  // Unmark a confirmed clone
  const handleUnmarkConfirmedClone = (pairId: string, words: string[]) => {
    const [idA, idB] = pairId.split('__');
    const updatedConfirmed = confirmedPairs.filter(
      (p) => p.id !== pairId && !(p.projectAId === idB && p.projectBId === idA)
    );
    setConfirmedPairs(updatedConfirmed);
    saveConfirmedPairs(updatedConfirmed);

    const updatedPosWords = new Map(confirmedWords);
    words.forEach((w) => {
      const clean = w.toLowerCase().trim();
      if (updatedPosWords.has(clean)) {
        const count = (updatedPosWords.get(clean) || 1) - 1;
        if (count <= 0) {
          updatedPosWords.delete(clean);
        } else {
          updatedPosWords.set(clean, count);
        }
      }
    });
    setConfirmedWords(updatedPosWords);
    saveConfirmedWords(updatedPosWords);
    setTrainingNotice(null);
  };

  // Remove confirmed word from positive indicators
  const handleRemoveConfirmedWord = (word: string) => {
    const updatedPosWords = new Map(confirmedWords);
    updatedPosWords.delete(word.toLowerCase());
    setConfirmedWords(updatedPosWords);
    saveConfirmedWords(updatedPosWords);
  };

  // Mark identified match as NOT a clone: removes it and teaches the duplicate scanner
  const handleMarkNotClone = (pA: OperationProject, pB: OperationProject, words: string[]) => {
    const pairId = `${pA.id}__${pB.id}`;
    const reverseKey = `${pB.id}__${pA.id}`;
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
        (p) => p.id !== pairId && p.id !== reverseKey
      ),
    ];
    setDismissedPairs(updatedDismissed);
    saveDismissedPairs(updatedDismissed);

    // If this pair was previously confirmed, unconfirm it
    const updatedConfirmed = confirmedPairs.filter(
      (p) => p.id !== pairId && p.id !== reverseKey
    );
    if (updatedConfirmed.length !== confirmedPairs.length) {
      setConfirmedPairs(updatedConfirmed);
      saveConfirmedPairs(updatedConfirmed);
    }

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

    setTrainingNotice({
      type: 'dismissed',
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
    setTrainingNotice(null);
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
    setConfirmedPairs([]);
    setConfirmedWords(new Map());
    localStorage.removeItem(STORAGE_DISMISSED_PAIRS_KEY);
    localStorage.removeItem(STORAGE_LEARNED_WORDS_KEY);
    localStorage.removeItem(STORAGE_CONFIRMED_PAIRS_KEY);
    localStorage.removeItem(STORAGE_CONFIRMED_WORDS_KEY);
    setTrainingNotice(null);
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
    setBomCustomChoices({});
    setBomSearchTerm('');
    setBomFilterTab('all');
    setBomExpanded(true);
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
      } else if (chosenBOMMode === 'custom') {
        const allKeys = new Set<string>();
        const mapA = new Map<string, BOMItem>();
        const mapB = new Map<string, BOMItem>();

        (projectA.bomItems || []).forEach((item) => {
          const k = getBOMItemKey(item);
          mapA.set(k, item);
          allKeys.add(k);
        });
        (projectB.bomItems || []).forEach((item) => {
          const k = getBOMItemKey(item);
          mapB.set(k, item);
          allKeys.add(k);
        });

        const customItems: BOMItem[] = [];
        allKeys.forEach((key) => {
          const choice = bomCustomChoices[key] || 'combine';
          if (choice === 'exclude') return;

          const itA = mapA.get(key);
          const itB = mapB.get(key);

          if (choice === 'A' && itA) {
            customItems.push({ ...itA });
          } else if (choice === 'B' && itB) {
            customItems.push({ ...itB });
          } else if (choice === 'sum' && itA && itB) {
            customItems.push({
              ...itA,
              quantity: (itA.quantity || 0) + (itB.quantity || 0),
              installedCount: (itA.installedCount || 0) + (itB.installedCount || 0),
            });
          } else {
            // Default combine / deduplicate
            if (itA && itB) {
              customItems.push({
                ...itA,
                quantity: Math.max(itA.quantity || 0, itB.quantity || 0),
                installedCount: Math.max(itA.installedCount || 0, itB.installedCount || 0),
              });
            } else if (itA) {
              customItems.push({ ...itA });
            } else if (itB) {
              customItems.push({ ...itB });
            }
          }
        });
        bomItems = customItems;
      } else {
        // Combine & Deduplicate
        const itemMap = new Map<string, BOMItem>();
        [...(projectA.bomItems || []), ...(projectB.bomItems || [])].forEach((item) => {
          const key = getBOMItemKey(item);
          if (itemMap.has(key)) {
            const existing = itemMap.get(key)!;
            itemMap.set(key, {
              ...existing,
              quantity: Math.max(existing.quantity || 0, item.quantity || 0),
              installedCount: Math.max(existing.installedCount || 0, item.installedCount || 0),
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
    bomCustomChoices,
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

  // Detailed BOM Comparison Computations
  const bomComparisonRows = useMemo(() => {
    if (!activePair) return [];
    const itemsA = activePair.projectA.bomItems || [];
    const itemsB = activePair.projectB.bomItems || [];

    const mapA = new Map<string, BOMItem>();
    const mapB = new Map<string, BOMItem>();
    const allKeys = new Set<string>();

    itemsA.forEach((item) => {
      const k = getBOMItemKey(item);
      mapA.set(k, item);
      allKeys.add(k);
    });

    itemsB.forEach((item) => {
      const k = getBOMItemKey(item);
      mapB.set(k, item);
      allKeys.add(k);
    });

    const rows: {
      key: string;
      itemA?: BOMItem;
      itemB?: BOMItem;
      name: string;
      model: string;
      category: string;
      location: string;
      status: 'match' | 'qty_diff' | 'a_only' | 'b_only';
    }[] = [];

    allKeys.forEach((k) => {
      const itA = mapA.get(k);
      const itB = mapB.get(k);
      const sample = itA || itB!;
      let status: 'match' | 'qty_diff' | 'a_only' | 'b_only' = 'match';
      if (itA && itB) {
        if (
          itA.quantity === itB.quantity &&
          itA.installedCount === itB.installedCount &&
          itA.unitPrice === itB.unitPrice
        ) {
          status = 'match';
        } else {
          status = 'qty_diff';
        }
      } else if (itA) {
        status = 'a_only';
      } else {
        status = 'b_only';
      }

      rows.push({
        key: k,
        itemA: itA,
        itemB: itB,
        name: sample.name,
        model: sample.model,
        category: sample.category || 'Hardware',
        location: sample.location || 'Site Units',
        status,
      });
    });

    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [activePair]);

  const filteredBomRows = useMemo(() => {
    let rows = bomComparisonRows;
    if (bomFilterTab === 'diff') {
      rows = rows.filter((r) => r.status !== 'match');
    } else if (bomFilterTab === 'a_only') {
      rows = rows.filter((r) => r.status === 'a_only');
    } else if (bomFilterTab === 'b_only') {
      rows = rows.filter((r) => r.status === 'b_only');
    }

    if (!bomSearchTerm.trim()) return rows;
    const q = bomSearchTerm.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
    );
  }, [bomComparisonRows, bomSearchTerm, bomFilterTab]);

  const bomStatsA = useMemo(() => {
    const items = activePair?.projectA.bomItems || [];
    const totalQty = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    const totalInstalled = items.reduce((acc, i) => acc + (i.installedCount || 0), 0);
    const totalValue = items.reduce((acc, i) => acc + ((i.quantity || 0) * (i.unitPrice || 0)), 0);
    return { count: items.length, totalQty, totalInstalled, totalValue, items };
  }, [activePair]);

  const bomStatsB = useMemo(() => {
    const items = activePair?.projectB.bomItems || [];
    const totalQty = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    const totalInstalled = items.reduce((acc, i) => acc + (i.installedCount || 0), 0);
    const totalValue = items.reduce((acc, i) => acc + ((i.quantity || 0) * (i.unitPrice || 0)), 0);
    return { count: items.length, totalQty, totalInstalled, totalValue, items };
  }, [activePair]);

  const finalBomStats = useMemo(() => {
    const items = previewFinalProject?.bomItems || [];
    const totalQty = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    const totalInstalled = items.reduce((acc, i) => acc + (i.installedCount || 0), 0);
    const totalValue = items.reduce((acc, i) => acc + ((i.quantity || 0) * (i.unitPrice || 0)), 0);
    return { count: items.length, totalQty, totalInstalled, totalValue };
  }, [previewFinalProject]);

  const handleSetItemDecision = (key: string, choice: 'combine' | 'A' | 'B' | 'sum' | 'exclude') => {
    setChosenBOMMode('custom');
    setBomCustomChoices((prev) => ({
      ...prev,
      [key]: choice,
    }));
  };

  const getEffectiveItemChoice = (row: (typeof bomComparisonRows)[0]): 'combine' | 'A' | 'B' | 'sum' | 'exclude' => {
    if (chosenBOMMode === 'custom') {
      return bomCustomChoices[row.key] || 'combine';
    }
    if (chosenBOMMode === 'A') {
      return row.itemA ? 'A' : 'exclude';
    }
    if (chosenBOMMode === 'B') {
      return row.itemB ? 'B' : 'exclude';
    }
    return 'combine';
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
              title="Manage confirmed duplicates, dismissed pairs, and learned scanner keywords"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanner Tuning</span>
              {(confirmedPairs.length > 0 || confirmedWords.size > 0 || dismissedPairs.length > 0 || learnedWords.size > 0) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {confirmedPairs.length + confirmedWords.size + dismissedPairs.length + learnedWords.size}
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
                <div className="flex items-center gap-1.5">
                  {confirmedPairs.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                      <span>{confirmedPairs.length} Confirmed</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {detectedClusters.length} Found
                  </span>
                </div>
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

            {/* Scanner Learning & Dismissal Notification Banner */}
            {trainingNotice && (
              <div
                className={`p-3 rounded-2xl text-xs shadow-md space-y-2 border ${
                  trainingNotice.type === 'confirmed'
                    ? 'bg-emerald-950/40 border-emerald-500/50'
                    : 'bg-slate-900 border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    {trainingNotice.type === 'confirmed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-[11px] leading-tight text-slate-300">
                      <span className="font-semibold text-slate-100">
                        {trainingNotice.type === 'confirmed'
                          ? 'Confirmed as True Duplicate:'
                          : 'Dismissed as non-duplicate:'}
                      </span>{' '}
                      <span className="text-white font-medium">&quot;{trainingNotice.pairAName}&quot;</span> &amp;{' '}
                      <span className="text-white font-medium">&quot;{trainingNotice.pairBName}&quot;</span>.
                      {trainingNotice.words.length > 0 && (
                        <p
                          className={`text-[10px] mt-1 ${
                            trainingNotice.type === 'confirmed' ? 'text-emerald-300' : 'text-cyan-300'
                          }`}
                        >
                          {trainingNotice.type === 'confirmed'
                            ? 'Scanner learned positive duplicate indicator(s): '
                            : 'Scanner learned to ignore generic term(s): '}
                          <span className="font-mono font-bold">{trainingNotice.words.join(', ')}</span>.
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTrainingNotice(null)}
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
                    <span>View Scanner Training</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (trainingNotice.type === 'confirmed') {
                        handleUnmarkConfirmedClone(trainingNotice.pairId, trainingNotice.words);
                      } else {
                        handleUndoDismiss(trainingNotice.pairId, trainingNotice.words);
                      }
                      setTrainingNotice(null);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-colors ${
                      trainingNotice.type === 'confirmed'
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                    }`}
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
                          : cluster.isConfirmedClone
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                          : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                      }`}
                      onClick={() =>
                        handleLoadPair(cluster.projectA, cluster.projectB, cluster.sharedWords)
                      }
                    >
                      {/* Shared Words Badges & Confidence */}
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
                        {cluster.isConfirmedClone ? (
                          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                            <span>Confirmed Clone</span>
                          </span>
                        ) : (
                          <span
                            className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${
                              cluster.confidence === 'High'
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {cluster.confidence} Match
                          </span>
                        )}
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

                      {/* Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {cluster.isConfirmedClone ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnmarkConfirmedClone(cluster.id, cluster.sharedWords);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-rose-500/20 text-emerald-300 hover:text-rose-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors cursor-pointer group/unmark"
                              title="Marked as a verified clone. Click to unmark."
                            >
                              <Check className="w-3 h-3 text-emerald-400 group-hover/unmark:hidden" />
                              <X className="w-3 h-3 text-rose-400 hidden group-hover/unmark:inline" />
                              <span className="group-hover/unmark:hidden">Confirmed Clone</span>
                              <span className="hidden group-hover/unmark:inline">Unmark</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsClone(
                                  cluster.projectA,
                                  cluster.projectB,
                                  cluster.sharedWords
                                );
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Mark this match as a confirmed duplicate to train the scanner"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Mark as Clone</span>
                            </button>
                          )}

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
                        </div>

                        <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1 group">
                          <span>Merge Arena</span>
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
                    {activePair &&
                    (confirmedSet.has(`${activePair.projectA.id}__${activePair.projectB.id}`) ||
                      confirmedSet.has(`${activePair.projectB.id}__${activePair.projectA.id}`)) ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (activePair) {
                            handleUnmarkConfirmedClone(
                              `${activePair.projectA.id}__${activePair.projectB.id}`,
                              activePair.sharedWords || []
                            );
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer transition-colors"
                        title="Marked as a verified clone. Click to unmark."
                      >
                        <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>Confirmed Clone</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (activePair) {
                            handleMarkAsClone(
                              activePair.projectA,
                              activePair.projectB,
                              activePair.sharedWords || []
                            );
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer transition-colors"
                        title="Mark this match as a verified clone to teach the duplicate detector"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Mark as Clone</span>
                      </button>
                    )}

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
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-amber-400" />
                          <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                            Hardware Bill of Materials (BOM Scope)
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {finalBomStats.count} Selected ({finalBomStats.totalQty} Units · ${finalBomStats.totalValue.toLocaleString()})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Inspect line-by-line hardware differences between Version A and Version B and choose how each item consolidates.
                        </p>
                      </div>

                      {/* View & Expand Toggles */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="inline-flex rounded-xl bg-slate-950 p-0.5 border border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => setBomViewMode('matrix')}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              bomViewMode === 'matrix'
                                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Unified comparison matrix table"
                          >
                            <Table className="w-3 h-3" />
                            <span>Comparison Matrix</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBomViewMode('side-by-side')}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              bomViewMode === 'side-by-side'
                                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Side-by-side dual columns"
                          >
                            <Columns className="w-3 h-3" />
                            <span>Side-by-Side</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBomExpanded((v) => !v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                        >
                          {bomExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              <span>Hide Details</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              <span>View Details ({bomComparisonRows.length})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scope Strategy Presets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setChosenBOMMode('combine');
                          setBomCustomChoices({});
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'combine'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">
                            Combine &amp; Deduplicate
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">
                            Smart Merge
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                          Merges identical SKUs from both projects and chooses max/combined quantities.
                        </p>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-1.5">
                          {finalBomStats.count} items · {finalBomStats.totalQty} devices
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setChosenBOMMode('A');
                          setBomCustomChoices({});
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'A'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-amber-400">
                            Alpha Scope Only (A)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">
                            Version A
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 truncate">
                          Strictly keep line items from &quot;{activePair.projectA.propertyName}&quot;.
                        </p>
                        <span className="text-[10px] font-mono text-amber-300 font-bold block mt-1.5">
                          {bomStatsA.count} items · {bomStatsA.totalQty} units · ${bomStatsA.totalValue.toLocaleString()}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setChosenBOMMode('B');
                          setBomCustomChoices({});
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'B'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-amber-400">
                            Beta Scope Only (B)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">
                            Version B
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 truncate">
                          Strictly keep line items from &quot;{activePair.projectB.propertyName}&quot;.
                        </p>
                        <span className="text-[10px] font-mono text-amber-300 font-bold block mt-1.5">
                          {bomStatsB.count} items · {bomStatsB.totalQty} units · ${bomStatsB.totalValue.toLocaleString()}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChosenBOMMode('custom')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          chosenBOMMode === 'custom'
                            ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-cyan-400">
                            Custom Item Picker
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono font-bold">
                            Per-Item
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                          Fine-tune individual hardware rows below choosing between A, B, combine, or exclude.
                        </p>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block mt-1.5">
                          {Object.keys(bomCustomChoices).length > 0
                            ? `${Object.keys(bomCustomChoices).length} Custom Overrides`
                            : 'Pick any row below'}
                        </span>
                      </button>
                    </div>

                    {/* Summary KPI Cards for Alpha vs Beta vs Master Result */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Alpha Card */}
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                            Version Alpha (A)
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {bomStatsA.count} Line Items
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-100 truncate" title={activePair.projectA.propertyName}>
                          {activePair.projectA.propertyName}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                          <span className="text-slate-400">
                            Units: <strong className="text-white">{bomStatsA.totalQty}</strong> ({bomStatsA.totalInstalled} inst.)
                          </span>
                          <span className="text-amber-300 font-mono font-bold">
                            ${bomStatsA.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Beta Card */}
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                            Version Beta (B)
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {bomStatsB.count} Line Items
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-100 truncate" title={activePair.projectB.propertyName}>
                          {activePair.projectB.propertyName}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                          <span className="text-slate-400">
                            Units: <strong className="text-white">{bomStatsB.totalQty}</strong> ({bomStatsB.totalInstalled} inst.)
                          </span>
                          <span className="text-amber-300 font-mono font-bold">
                            ${bomStatsB.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Resulting Master Project BOM Card */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Master Project Result</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-300">
                            {finalBomStats.count} Line Items
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">
                          Final Master Project BOM
                        </p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-900/40">
                          <span className="text-slate-300">
                            Total Units: <strong className="text-white">{finalBomStats.totalQty}</strong> ({finalBomStats.totalInstalled} inst.)
                          </span>
                          <span className="text-emerald-300 font-mono font-bold">
                            ${finalBomStats.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Breakdown Workspace (Collapsible) */}
                    {bomExpanded && (
                      <div className="pt-2 space-y-3">
                        {/* Filters & Search Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          {/* Search Input */}
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Filter BOM by device name, SKU model, category, or location..."
                              value={bomSearchTerm}
                              onChange={(e) => setBomSearchTerm(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                            />
                            {bomSearchTerm && (
                              <button
                                type="button"
                                onClick={() => setBomSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Filter Tabs */}
                          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
                            <button
                              type="button"
                              onClick={() => setBomFilterTab('all')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                bomFilterTab === 'all'
                                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              All ({bomComparisonRows.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setBomFilterTab('diff')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                bomFilterTab === 'diff'
                                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              Differences ({bomComparisonRows.filter((r) => r.status !== 'match').length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setBomFilterTab('a_only')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                bomFilterTab === 'a_only'
                                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              Alpha Only ({bomComparisonRows.filter((r) => r.status === 'a_only').length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setBomFilterTab('b_only')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                bomFilterTab === 'b_only'
                                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              Beta Only ({bomComparisonRows.filter((r) => r.status === 'b_only').length})
                            </button>
                          </div>
                        </div>

                        {/* View Mode 1: Unified Matrix Table */}
                        {bomViewMode === 'matrix' ? (
                          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90 shadow-sm max-h-[520px] overflow-y-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                                <tr>
                                  <th className="py-2.5 px-3">Hardware Device / SKU</th>
                                  <th className="py-2.5 px-3">Version Alpha (A)</th>
                                  <th className="py-2.5 px-3">Version Beta (B)</th>
                                  <th className="py-2.5 px-3 text-center">Status</th>
                                  <th className="py-2.5 px-3 text-right">Master Selection</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/80">
                                {filteredBomRows.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 space-y-1">
                                      <Package className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                                      <p className="font-bold text-xs">No BOM Items Found</p>
                                      <p className="text-[11px] text-slate-500">
                                        No items match the current search or filter query.
                                      </p>
                                    </td>
                                  </tr>
                                ) : (
                                  filteredBomRows.map((row) => {
                                    const effectiveChoice = getEffectiveItemChoice(row);
                                    return (
                                      <tr
                                        key={row.key}
                                        className={`hover:bg-slate-900/60 transition-colors ${
                                          row.status === 'qty_diff'
                                            ? 'bg-amber-950/10'
                                            : row.status === 'a_only'
                                            ? 'bg-cyan-950/10'
                                            : row.status === 'b_only'
                                            ? 'bg-purple-950/10'
                                            : ''
                                        }`}
                                      >
                                        {/* 1. Device Info */}
                                        <td className="py-3 px-3 align-top min-w-[200px] max-w-[280px]">
                                          <div className="space-y-1">
                                            <span className="font-bold text-white block leading-tight">
                                              {row.name}
                                            </span>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                                                {row.model}
                                              </span>
                                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800/80 text-slate-400">
                                                {row.category}
                                              </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 block truncate">
                                              📍 {row.location}
                                            </span>
                                            {/* Hardware details if lock or thermostat */}
                                            {row.itemA?.lockFinishConfig && (
                                              <span className="text-[9px] font-mono text-slate-400 block truncate">
                                                Trim: {row.itemA.lockFinishConfig.befeTrimStyle || 'Std'} · Finish: {row.itemA.lockFinishConfig.befeColorFinish || 'Std'}
                                              </span>
                                            )}
                                            {row.itemA?.thermostatBrand && (
                                              <span className="text-[9px] font-mono text-cyan-300 block truncate">
                                                Brand: {row.itemA.thermostatBrand}
                                              </span>
                                            )}
                                          </div>
                                        </td>

                                        {/* 2. Version A Info */}
                                        <td className="py-3 px-3 align-top min-w-[140px]">
                                          {row.itemA ? (
                                            <div className="space-y-0.5 text-xs">
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-extrabold text-white">
                                                  {row.itemA.quantity} units
                                                </span>
                                                <span className="text-[10px] text-emerald-400 font-mono">
                                                  ({row.itemA.installedCount} inst.)
                                                </span>
                                              </div>
                                              <span className="text-[11px] text-slate-400 block font-mono">
                                                ${row.itemA.unitPrice} ea · Total: ${(row.itemA.quantity * row.itemA.unitPrice).toLocaleString()}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-[11px] text-slate-500 italic block py-1">
                                              — Not in Alpha —
                                            </span>
                                          )}
                                        </td>

                                        {/* 3. Version B Info */}
                                        <td className="py-3 px-3 align-top min-w-[140px]">
                                          {row.itemB ? (
                                            <div className="space-y-0.5 text-xs">
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-extrabold text-white">
                                                  {row.itemB.quantity} units
                                                </span>
                                                <span className="text-[10px] text-emerald-400 font-mono">
                                                  ({row.itemB.installedCount} inst.)
                                                </span>
                                              </div>
                                              <span className="text-[11px] text-slate-400 block font-mono">
                                                ${row.itemB.unitPrice} ea · Total: ${(row.itemB.quantity * row.itemB.unitPrice).toLocaleString()}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-[11px] text-slate-500 italic block py-1">
                                              — Not in Beta —
                                            </span>
                                          )}
                                        </td>

                                        {/* 4. Diff Status Badge */}
                                        <td className="py-3 px-3 align-top text-center min-w-[110px]">
                                          {row.status === 'match' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                              <Check className="w-3 h-3" />
                                              <span>Exact Match</span>
                                            </span>
                                          ) : row.status === 'qty_diff' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                              <AlertTriangle className="w-3 h-3" />
                                              <span>Qty Diff ({row.itemA?.quantity} vs {row.itemB?.quantity})</span>
                                            </span>
                                          ) : row.status === 'a_only' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                              <span>Alpha Only</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                              <span>Beta Only</span>
                                            </span>
                                          )}
                                        </td>

                                        {/* 5. Master Choice Decision Pills */}
                                        <td className="py-3 px-3 align-top text-right min-w-[210px]">
                                          <div className="flex flex-wrap items-center justify-end gap-1">
                                            {row.itemA && row.itemB ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'combine')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'combine'
                                                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Take max quantity: ${Math.max(row.itemA.quantity, row.itemB.quantity)} units`}
                                                >
                                                  Max ({Math.max(row.itemA.quantity, row.itemB.quantity)}u)
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'A')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'A'
                                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Keep Alpha quantity: ${row.itemA.quantity} units`}
                                                >
                                                  Alpha ({row.itemA.quantity}u)
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'B')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'B'
                                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Keep Beta quantity: ${row.itemB.quantity} units`}
                                                >
                                                  Beta ({row.itemB.quantity}u)
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'sum')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'sum'
                                                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Sum quantities: ${row.itemA.quantity + row.itemB.quantity} units`}
                                                >
                                                  Sum ({row.itemA.quantity + row.itemB.quantity}u)
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'exclude')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'exclude'
                                                      ? 'bg-rose-500 text-white shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700'
                                                  }`}
                                                  title="Omit this line item from final master project"
                                                >
                                                  Exclude
                                                </button>
                                              </>
                                            ) : row.itemA ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'A')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice !== 'exclude'
                                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Include item from Alpha (${row.itemA.quantity} units)`}
                                                >
                                                  Include Alpha ({row.itemA.quantity}u)
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'exclude')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'exclude'
                                                      ? 'bg-rose-500 text-white shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700'
                                                  }`}
                                                  title="Omit this line item from final master project"
                                                >
                                                  Exclude
                                                </button>
                                              </>
                                            ) : row.itemB ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'B')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice !== 'exclude'
                                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                                  }`}
                                                  title={`Include item from Beta (${row.itemB.quantity} units)`}
                                                >
                                                  Include Beta ({row.itemB.quantity}u)
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSetItemDecision(row.key, 'exclude')}
                                                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                                    effectiveChoice === 'exclude'
                                                      ? 'bg-rose-500 text-white shadow-xs'
                                                      : 'bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700'
                                                  }`}
                                                  title="Omit this line item from final master project"
                                                >
                                                  Exclude
                                                </button>
                                              </>
                                            ) : null}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          /* View Mode 2: Side-by-Side Dual Columns */
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
                            {/* Left Column: Version Alpha Scope */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 sticky top-0 z-10">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  <span className="text-xs font-extrabold text-white">
                                    Project Alpha Scope ({bomStatsA.count})
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-amber-300 font-bold">
                                  {bomStatsA.totalQty} Units · ${bomStatsA.totalValue.toLocaleString()}
                                </span>
                              </div>

                              {(activePair.projectA.bomItems || []).length === 0 ? (
                                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs">
                                  No BOM items in Project Alpha
                                </div>
                              ) : (
                                (activePair.projectA.bomItems || []).map((item) => {
                                  const key = getBOMItemKey(item);
                                  const matchingInB = (activePair.projectB.bomItems || []).find(
                                    (b) => getBOMItemKey(b) === key
                                  );
                                  const decision = bomCustomChoices[key] || (chosenBOMMode === 'A' ? 'A' : chosenBOMMode === 'B' ? 'exclude' : 'combine');
                                  const isSelected = decision === 'A' || decision === 'combine' || decision === 'sum';

                                  return (
                                    <div
                                      key={key}
                                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                                        isSelected
                                          ? 'bg-slate-950/90 border-amber-500/60 ring-1 ring-amber-500/30'
                                          : 'bg-slate-950/40 border-slate-800 opacity-70'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className="font-bold text-white block leading-snug">
                                            {item.name}
                                          </span>
                                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-800 text-amber-300 border border-slate-700 font-bold">
                                              {item.model}
                                            </span>
                                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400">
                                              {item.category}
                                            </span>
                                            {matchingInB ? (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                                In Both (Beta has {matchingInB.quantity}u)
                                              </span>
                                            ) : (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                                                Alpha Unique
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleSetItemDecision(key, 'A')}
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer shrink-0 ${
                                            decision === 'A'
                                              ? 'bg-amber-500 text-slate-950'
                                              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                                          }`}
                                        >
                                          {decision === 'A' ? 'Selected (A)' : 'Choose A'}
                                        </button>
                                      </div>

                                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Quoted Qty</span>
                                          <span className="font-bold text-white font-mono">{item.quantity}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Installed</span>
                                          <span className="font-bold text-emerald-400 font-mono">{item.installedCount}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Line Total</span>
                                          <span className="font-bold text-amber-300 font-mono">
                                            ${(item.quantity * item.unitPrice).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Right Column: Version Beta Scope */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 sticky top-0 z-10">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                  <span className="text-xs font-extrabold text-white">
                                    Project Beta Scope ({bomStatsB.count})
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                                  {bomStatsB.totalQty} Units · ${bomStatsB.totalValue.toLocaleString()}
                                </span>
                              </div>

                              {(activePair.projectB.bomItems || []).length === 0 ? (
                                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs">
                                  No BOM items in Project Beta
                                </div>
                              ) : (
                                (activePair.projectB.bomItems || []).map((item) => {
                                  const key = getBOMItemKey(item);
                                  const matchingInA = (activePair.projectA.bomItems || []).find(
                                    (a) => getBOMItemKey(a) === key
                                  );
                                  const decision = bomCustomChoices[key] || (chosenBOMMode === 'B' ? 'B' : chosenBOMMode === 'A' ? 'exclude' : 'combine');
                                  const isSelected = decision === 'B' || decision === 'combine' || decision === 'sum';

                                  return (
                                    <div
                                      key={key}
                                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                                        isSelected
                                          ? 'bg-slate-950/90 border-cyan-500/60 ring-1 ring-cyan-500/30'
                                          : 'bg-slate-950/40 border-slate-800 opacity-70'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className="font-bold text-white block leading-snug">
                                            {item.name}
                                          </span>
                                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                                              {item.model}
                                            </span>
                                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400">
                                              {item.category}
                                            </span>
                                            {matchingInA ? (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                                In Both (Alpha has {matchingInA.quantity}u)
                                              </span>
                                            ) : (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 font-mono font-bold">
                                                Beta Unique
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleSetItemDecision(key, 'B')}
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer shrink-0 ${
                                            decision === 'B'
                                              ? 'bg-cyan-500 text-slate-950'
                                              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                                          }`}
                                        >
                                          {decision === 'B' ? 'Selected (B)' : 'Choose B'}
                                        </button>
                                      </div>

                                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Quoted Qty</span>
                                          <span className="font-bold text-white font-mono">{item.quantity}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Installed</span>
                                          <span className="font-bold text-emerald-400 font-mono">{item.installedCount}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-slate-500 block">Line Total</span>
                                          <span className="font-bold text-cyan-300 font-mono">
                                            ${(item.quantity * item.unitPrice).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
            <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setTuningTab('confirmed')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  tuningTab === 'confirmed'
                    ? 'border-emerald-400 text-emerald-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Confirmed Clones ({confirmedPairs.length})
              </button>
              <button
                type="button"
                onClick={() => setTuningTab('pairs')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  tuningTab === 'words'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Learned Keywords ({confirmedWords.size + learnedWords.size})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {tuningTab === 'confirmed' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    These specific property pairs were marked as <strong className="text-emerald-300">&quot;Confirmed Clones&quot;</strong>. The scanner uses these pairs to learn positive naming patterns and boost matching confidence for other duplicates.
                  </p>

                  {confirmedPairs.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                      <Star className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-300">No Confirmed Clones Yet</p>
                      <p className="text-[11px] text-slate-500">
                        Click &quot;Mark as Clone&quot; on any duplicate match to train the scanner with positive duplicate patterns.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {confirmedPairs.map((pair) => (
                        <div
                          key={pair.id}
                          className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
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
                              <span className="text-[10px] text-slate-500">Learned clone tokens:</span>
                              {pair.sharedWords.map((w) => (
                                <span
                                  key={w}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold"
                                >
                                  {w}
                                </span>
                              ))}
                              <span className="text-[10px] text-slate-500 ml-2">
                                {new Date(pair.confirmedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnmarkConfirmedClone(pair.id, pair.sharedWords)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                            title="Unmark as confirmed clone"
                          >
                            <X className="w-3 h-3 text-rose-400" />
                            <span>Unmark</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : tuningTab === 'pairs' ? (
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
                <div className="space-y-5">
                  {/* Positive Indicators Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Positive Duplicate Indicators ({confirmedWords.size})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Boosts matching confidence</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Words learned from confirmed duplicates. When other property titles share these keywords, the scanner prioritizes them with higher duplicate confidence.
                    </p>

                    {confirmedWords.size === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-[11px]">
                        No positive indicator words learned yet. Mark any cluster as &quot;Mark as Clone&quot; to train.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                        {Array.from(confirmedWords.entries()).map(([word, count]) => (
                          <span
                            key={word}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                          >
                            <span>&quot;{word}&quot;</span>
                            {count > 1 && (
                              <span className="text-[10px] px-1 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                                x{count}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveConfirmedWord(word)}
                              className="p-0.5 text-emerald-300 hover:text-white rounded hover:bg-emerald-500/30 cursor-pointer"
                              title={`Remove "${word}" from positive duplicate indicators`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Negative Noise Stopwords Section */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Negative Noise Stopwords ({learnedWords.size})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Suppresses false positives</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Words in this negative stoplist are treated as common generic multifamily terms (e.g. <em>&quot;apartments&quot;</em>, <em>&quot;square&quot;</em>). The duplicate scanner ignores them.
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
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-[11px]">
                        No noise stopwords learned yet.
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
