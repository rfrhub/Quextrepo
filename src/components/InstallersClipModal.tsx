import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  OperationProject,
  BOMItem,
  BOMCategory,
  InstallLogEntry,
  PendingInstallationChange,
  getCategoryDisplayName,
  AVAILABLE_PMS,
  ProjectManagerInfo,
} from '../types';
import {
  Zap,
  Camera,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Check,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Phone,
  Mail,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Smartphone,
  Layers,
  Search,
  Filter,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface StagedItemEntry {
  quantity: number;
  locationCompleted: string;
  statusCheck: 'Verified & Online' | 'Signal Testing Passed' | 'Pending LoRa Sync' | 'Hardware Swapped';
  notes: string;
  itemNotes: string;
  photos: string[]; // Base64 data URLs
  audioBlobUrl?: string; // Object URL or Base64
  audioDuration?: number; // In seconds
}

export interface InstallersClipProps {
  isOpen: boolean;
  onClose: () => void;
  projects: OperationProject[];
  onUpdateProject: (updatedProject: OperationProject) => void;
  initialProjectId?: string | null;
  activeInstallerName?: string;
  installerRole?: 'field_tech' | 'integrator_partner' | 'pm';
  companyName?: string;
}

export const InstallersClipModal: React.FC<InstallersClipProps> = ({
  isOpen,
  onClose,
  projects,
  onUpdateProject,
  initialProjectId,
  activeInstallerName = 'Sean Gates',
  installerRole = 'field_tech',
  companyName,
}) => {
  // Navigation: landing page (project cards) or inside a specific project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Staged entries per BOM item ID
  const [stagedEntries, setStagedEntries] = useState<Record<string, StagedItemEntry>>({});

  // Audio Recording State
  const [recordingItemId, setRecordingItemId] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playing State
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox Photo Preview
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Success Notification Toast
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [successToastMessage, setSuccessToastMessage] = useState<string>('');

  // Sync initialProjectId if passed
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioElementRef.current) audioElementRef.current.pause();
    };
  }, []);

  if (!isOpen) return null;

  // Selected Project object
  const activeProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null;

  const assignedPM = activeProject?.assignedPM || AVAILABLE_PMS[0];

  // Filtered projects for the Landing Screen
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.propertyName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  // Available categories for selected project
  const projectCategories = useMemo(() => {
    if (!activeProject) return [];
    const set = new Set<string>();
    activeProject.bomItems.forEach((b) => set.add(getCategoryDisplayName(b.category)));
    return Array.from(set);
  }, [activeProject]);

  // Filtered BOM items for selected project
  const filteredBOMItems = useMemo(() => {
    if (!activeProject) return [];
    if (activeCategoryFilter === 'all') return activeProject.bomItems;
    return activeProject.bomItems.filter(
      (b) => getCategoryDisplayName(b.category) === activeCategoryFilter
    );
  }, [activeProject, activeCategoryFilter]);

  // Helper to get or init staged item entry
  const getStagedItem = (item: BOMItem): StagedItemEntry => {
    if (stagedEntries[item.id]) return stagedEntries[item.id];
    return {
      quantity: 0,
      locationCompleted: item.location || 'Units / Common Areas',
      statusCheck: 'Verified & Online',
      notes: '',
      itemNotes: '',
      photos: [],
      audioBlobUrl: undefined,
      audioDuration: undefined,
    };
  };

  const updateStagedItem = (itemId: string, patch: Partial<StagedItemEntry>) => {
    setStagedEntries((prev) => {
      const existing = prev[itemId] || {
        quantity: 0,
        locationCompleted: 'Units / Common Areas',
        statusCheck: 'Verified & Online',
        notes: '',
        itemNotes: '',
        photos: [],
      };
      return {
        ...prev,
        [itemId]: {
          ...existing,
          ...patch,
        },
      };
    });
  };

  // 1-Finger Stepper Adjusters
  const handleAdjustQuantity = (item: BOMItem, delta: number) => {
    const cur = getStagedItem(item).quantity;
    const next = Math.max(0, cur + delta);
    updateStagedItem(item.id, { quantity: next });
  };

  // "Full Scope" 1-Finger Auto-fill Remainder Button
  const handleFullScope = (item: BOMItem) => {
    const remaining = Math.max(0, item.quantity - (item.installedCount || 0));
    updateStagedItem(item.id, { quantity: remaining > 0 ? remaining : item.quantity });
  };

  // Photo Capture / File Selection
  const handlePhotoCapture = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) {
          const currentPhotos = getStagedItem(
            filteredBOMItems.find((b) => b.id === itemId) || filteredBOMItems[0]
          ).photos || [];
          updateStagedItem(itemId, { photos: [...currentPhotos, dataUrl] });
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input value so same photo can be re-added if desired
    e.target.value = '';
  };

  const handleRemovePhoto = (itemId: string, photoIndex: number) => {
    const cur = getStagedItem(filteredBOMItems.find((b) => b.id === itemId) || filteredBOMItems[0]);
    const updatedPhotos = cur.photos.filter((_, idx) => idx !== photoIndex);
    updateStagedItem(itemId, { photos: updatedPhotos });
  };

  // Audio Voice Memo Recording Handlers
  const handleStartRecording = async (itemId: string) => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) {
            audioChunksRef.current.push(ev.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const blobUrl = URL.createObjectURL(audioBlob);
          updateStagedItem(itemId, {
            audioBlobUrl: blobUrl,
            audioDuration: recordingSeconds || 5,
          });
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setRecordingItemId(itemId);
        setRecordingSeconds(0);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        // Fallback for browsers or sandboxes without audio capture permission
        simulateAudioRecording(itemId);
      }
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported, using audio simulation memo:', err);
      simulateAudioRecording(itemId);
    }
  };

  const simulateAudioRecording = (itemId: string) => {
    setRecordingItemId(itemId);
    setRecordingSeconds(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = (itemId: string) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Synthetic fallback audio memo
      updateStagedItem(itemId, {
        audioBlobUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        audioDuration: recordingSeconds || 6,
      });
    }

    setRecordingItemId(null);
  };

  const handlePlayAudio = (itemId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    if (playingItemId === itemId) {
      if (audioElementRef.current) audioElementRef.current.pause();
      setPlayingItemId(null);
      return;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;
    setPlayingItemId(itemId);

    audio.onended = () => {
      setPlayingItemId(null);
    };

    audio.onerror = () => {
      // In case dummy data URI or unplayable blob
      setTimeout(() => setPlayingItemId(null), 3000);
    };

    audio.play().catch(() => {
      setTimeout(() => setPlayingItemId(null), 3000);
    });
  };

  const handleDeleteAudio = (itemId: string) => {
    if (playingItemId === itemId && audioElementRef.current) {
      audioElementRef.current.pause();
      setPlayingItemId(null);
    }
    updateStagedItem(itemId, { audioBlobUrl: undefined, audioDuration: undefined });
  };

  // Count active staged items with quantity > 0
  const activeStagedItemsList = Object.entries(stagedEntries).filter(([_, entry]) => entry.quantity > 0);
  const totalStagedUnits = activeStagedItemsList.reduce((sum, [_, entry]) => sum + entry.quantity, 0);

  // Submit Batch to Project
  const handleSubmitBatch = () => {
    if (!activeProject || activeStagedItemsList.length === 0) return;

    const isPendingRole = installerRole === 'field_tech' || installerRole === 'integrator_partner';
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} ${now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;

    const newLogs: InstallLogEntry[] = [];
    const updatedBOM = [...activeProject.bomItems];
    const newPendingChanges: PendingInstallationChange[] = [];

    activeStagedItemsList.forEach(([itemId, entry]) => {
      const bomIndex = updatedBOM.findIndex((b) => b.id === itemId);
      if (bomIndex === -1) return;
      const bom = updatedBOM[bomIndex];

      const totalWithNew = (bom.installedCount || 0) + entry.quantity;
      const isOverAllocation = totalWithNew > bom.quantity;
      const offset = Math.max(0, totalWithNew - bom.quantity);

      const logId = `clip-log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const combinedNotes = [
        entry.notes.trim(),
        entry.itemNotes.trim() ? `[${bom.name}: ${entry.itemNotes.trim()}]` : '',
        entry.photos.length > 0 ? `(${entry.photos.length} Photo${entry.photos.length > 1 ? 's' : ''} Attached)` : '',
        entry.audioBlobUrl ? `(Voice Memo: ${entry.audioDuration || 5}s)` : '',
      ]
        .filter(Boolean)
        .join(' · ') || 'Verified and completed via Installers Clip';

      const logEntry: InstallLogEntry = {
        id: logId,
        projectId: activeProject.id,
        timestamp: formattedTimestamp,
        installerName: activeInstallerName,
        itemId: bom.id,
        itemName: bom.name,
        quantityCompleted: entry.quantity,
        locationCompleted: entry.locationCompleted || bom.location,
        statusCheck: entry.statusCheck,
        notes: combinedNotes,
        color: isOverAllocation ? 'rose' : isPendingRole ? 'amber' : 'yellow',
        pendingPMConfirmation: isPendingRole || isOverAllocation,
        submittedByRole: installerRole,
        exceedsSOW: isOverAllocation,
        offsetQuantity: offset,
        itemNotes: entry.itemNotes.trim(),
        approvalStatus: isOverAllocation ? 'pending_approval' : undefined,
        photos: entry.photos,
        audioNoteUrl: entry.audioBlobUrl,
        audioNoteDuration: entry.audioDuration,
      };

      newLogs.push(logEntry);

      // Add to pending changes queue for Project Manager review banner
      newPendingChanges.push({
        id: `pending-clip-${logId}`,
        source: 'install_log',
        sourceId: logId,
        title: `Logged ${entry.quantity}x ${bom.name} (${entry.statusCheck})`,
        submittedBy: `${activeInstallerName} (${installerRole === 'field_tech' ? 'Field Tech' : 'Integrator Partner'})`,
        submittedRole: installerRole,
        submittedAt: formattedTimestamp,
        details: `${entry.locationCompleted || bom.location} · ${entry.quantity} units ${
          isOverAllocation ? `(⚠️ Exceeds Quoted by +${offset})` : ''
        }`,
        bomIncrements: { [bom.id]: entry.quantity },
        status: 'pending',
        associatedLog: logEntry,
        exceedsSOW: isOverAllocation,
        offsetQuantity: offset,
        approvalStatus: isOverAllocation ? 'pending_approval' : undefined,
      });

      // If NOT pending confirmation (e.g. approved PM) or auto-staging, update BOM counts
      const updatedItemLogs = [...(bom.postItLogs || []), logEntry];

      updatedBOM[bomIndex] = {
        ...bom,
        // Only increment installed count immediately if PM, or stage it for PM confirmation
        installedCount: isPendingRole && isOverAllocation
          ? bom.installedCount // Wait for PM approval if exceeds SOW
          : isPendingRole
          ? bom.installedCount + entry.quantity // Auto update for real-time progress, but flagged for PM confirmation
          : bom.installedCount + entry.quantity,
        postItLogs: updatedItemLogs,
        overAllocationOffset: isOverAllocation ? offset : bom.overAllocationOffset,
      };
    });

    const updatedProject: OperationProject = {
      ...activeProject,
      bomItems: updatedBOM,
      installLogs: [...(activeProject.installLogs || []), ...newLogs],
      pendingInstallationChanges: [
        ...(activeProject.pendingInstallationChanges || []),
        ...newPendingChanges,
      ],
      lastUpdated: 'Just now',
    };

    onUpdateProject(updatedProject);

    // Show celebration toast
    setSuccessToastMessage(
      `Logged ${totalStagedUnits} devices across ${activeStagedItemsList.length} BOM line item${
        activeStagedItemsList.length > 1 ? 's' : ''
      }! Synced to ${activeProject.propertyName}.`
    );
    setShowSuccessToast(true);

    // Reset staged items
    setStagedEntries({});

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col font-sans select-none overflow-hidden text-slate-100 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* TOP BAR / APP HEADER (Clean Mobile Native Shell)                         */}
      {/* ========================================================================= */}
      <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-emerald-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
                Installers Clip
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
                Field Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {activeInstallerName} {companyName ? `· ${companyName}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedProjectId && (
            <button
              type="button"
              onClick={() => {
                setSelectedProjectId(null);
                setStagedEntries({});
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">All Projects</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-rose-950/80 hover:border-rose-700 border border-slate-700 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Exit Installers Clip"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Close</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* TOAST CELEBRATION NOTIFICATION                                            */}
      {/* ========================================================================= */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-emerald-950 border-2 border-emerald-400 text-emerald-100 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 font-bold">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <strong className="block text-emerald-300 font-bold text-sm">
              Batch Log Successfully Saved!
            </strong>
            <p className="mt-0.5 text-emerald-100 leading-snug">{successToastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: UBER SIMPLIFIED LANDING PAGE (Tap Project Card with One Finger) */}
      {/* ========================================================================= */}
      {!selectedProjectId && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Welcome Card & Instructions */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>One-Finger Field Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Select Your Active Job Site
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Tap on any project card below to open its dedicated field logger. Log BOM item
                installations, snap photo verifications, and record voice notes with one hand while on
                the ladder or in the unit.
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Search Bar for Quick Filtering */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by property, city, or client name..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Large, Tactile 1-Finger Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
                <Building2 className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-base font-semibold text-slate-400">No matching projects found</p>
                <p className="text-xs">Try clearing your search term</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                // Compute project completion stats
                let quotedTotal = 0;
                let installedTotal = 0;
                project.bomItems.forEach((b) => {
                  quotedTotal += b.quantity;
                  installedTotal += b.installedCount || 0;
                });
                const pct = quotedTotal > 0 ? Math.round((installedTotal / quotedTotal) * 100) : 0;
                const remainingTotal = Math.max(0, quotedTotal - installedTotal);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveCategoryFilter('all');
                      setStagedEntries({});
                    }}
                    className="group text-left bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border-2 border-slate-800 hover:border-sky-500/80 rounded-2xl p-5 sm:p-6 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between gap-4 active:scale-[0.98]"
                  >
                    <div>
                      {/* Top Header Row of Project Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                            {project.propertyName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">
                              {project.city}, {project.state}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-400">{project.unitsCount} Units</span>
                          </div>
                        </div>

                        {/* Progress Badge */}
                        <div className="flex flex-col items-end shrink-0">
                          <span
                            className={`px-2.5 py-1 text-xs font-black rounded-lg border tabular-nums ${
                              pct >= 100
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : pct >= 50
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {pct}%
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Installed</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 100
                              ? 'bg-emerald-400'
                              : pct >= 50
                              ? 'bg-sky-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>

                      {/* Hardware Scope Stat Chips */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Quoted</div>
                          <div className="text-sm sm:text-base font-extrabold text-white tabular-nums">
                            {quotedTotal}
                          </div>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Done</div>
                          <div className="text-sm sm:text-base font-extrabold text-emerald-400 tabular-nums">
                            {installedTotal}
                          </div>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Left</div>
                          <div className="text-sm sm:text-base font-extrabold text-sky-400 tabular-nums">
                            {remainingTotal}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Tap Action Button Bar */}
                    <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-sky-400" />
                        <span>Tap to Log Installation</span>
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: IN-THE-FIELD VERIFICATION LOGGER (One-Finger Steppers & Media)  */}
      {/* ========================================================================= */}
      {selectedProjectId && activeProject && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Sub-Header: Active Project Details & 1-Finger Category Swipe Bar */}
          <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-3 sm:px-6 space-y-3 shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-black text-white truncate">
                    {activeProject.propertyName}
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                    {activeProject.city}, {activeProject.state}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Assigned PM: <strong className="text-slate-300">{assignedPM.name}</strong> ·{' '}
                  <a href={`tel:${assignedPM.phone}`} className="text-sky-400 hover:underline">
                    {assignedPM.phone}
                  </a>
                </p>
              </div>

              {/* Reset or Clear Staged */}
              {activeStagedItemsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStagedEntries({})}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-2 py-1 bg-slate-800/60 rounded-lg cursor-pointer"
                  title="Clear staged batch"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Batch</span>
                </button>
              )}
            </div>

            {/* 1-Finger Category Swipe / Scroll Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  activeCategoryFilter === 'all'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                All BOM Items ({activeProject.bomItems.length})
              </button>

              {projectCategories.map((catName) => {
                const count = activeProject.bomItems.filter(
                  (b) => getCategoryDisplayName(b.category) === catName
                ).length;
                const isCatActive = activeCategoryFilter === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setActiveCategoryFilter(catName)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                      isCatActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {catName} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOM Item Cards List (Scrollable Body) */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 max-w-4xl mx-auto w-full pb-28">
            {filteredBOMItems.map((item) => {
              const entry = getStagedItem(item);
              const remaining = Math.max(0, item.quantity - (item.installedCount || 0));
              const totalInstalledWithNew = (item.installedCount || 0) + (entry.quantity || 0);
              const isOverAllocation = totalInstalledWithNew > item.quantity;
              const offset = Math.max(0, totalInstalledWithNew - item.quantity);
              const isStagedActive = entry.quantity > 0;
              const pctInstalled =
                item.quantity > 0
                  ? Math.min(100, Math.round(((item.installedCount || 0) / item.quantity) * 100))
                  : 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-lg ${
                    isStagedActive
                      ? isOverAllocation
                        ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/20'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header: Device Name & Progress */}
                  <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/70">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                            {getCategoryDisplayName(item.category)}
                          </span>
                          <span className="text-xs text-slate-400 truncate">{item.location}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white mt-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">Model: {item.model}</p>
                      </div>

                      {/* Quoted vs Installed Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-black text-white tabular-nums">
                          <span className="text-emerald-400">{item.installedCount || 0}</span> /{' '}
                          <span>{item.quantity}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">
                          {remaining > 0 ? `${remaining} remaining` : 'Scope Complete'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pctInstalled >= 100 ? 'bg-emerald-400' : 'bg-sky-400'
                        }`}
                        style={{ width: `${pctInstalled}%` }}
                      />
                    </div>
                  </div>

                  {/* 1-Finger Stepper & Controls */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Stepper Row */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                          Log Units Completed Today
                        </span>
                        {/* ⚡ Full Scope Button */}
                        <button
                          type="button"
                          onClick={() => handleFullScope(item)}
                          className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          title="Fills the remaining quoted scope with 1 tap"
                        >
                          <Zap className="w-3.5 h-3.5 fill-amber-300" />
                          <span>+ Full Scope ({remaining})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Big Minus Button */}
                        <button
                          type="button"
                          onClick={() => handleAdjustQuantity(item, -1)}
                          disabled={entry.quantity <= 0}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-transform active:scale-90 shrink-0 shadow-md"
                        >
                          <Minus className="w-6 h-6" />
                        </button>

                        {/* Big Direct Input / Display */}
                        <div className="flex-1 h-14 sm:h-16 bg-slate-950 border-2 border-slate-800 rounded-2xl flex items-center justify-center px-4 relative">
                          <input
                            type="number"
                            min="0"
                            value={entry.quantity || ''}
                            onChange={(e) =>
                              updateStagedItem(item.id, {
                                quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                              })
                            }
                            placeholder="0"
                            className="w-full text-center text-2xl sm:text-3xl font-black text-white bg-transparent focus:outline-none tabular-nums"
                          />
                          <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
                            units
                          </span>
                        </div>

                        {/* Big Plus Button */}
                        <button
                          type="button"
                          onClick={() => handleAdjustQuantity(item, 1)}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-400 border border-sky-400/50 flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-transform active:scale-90 shrink-0 shadow-md shadow-sky-600/30"
                        >
                          <Plus className="w-6 h-6 stroke-[3]" />
                        </button>
                      </div>

                      {/* Quick Increment Pills */}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick:</span>
                        {[1, 5, 10, 25].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleAdjustQuantity(item, amt)}
                            className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition-transform active:scale-95"
                          >
                            +{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SOW OVER-ALLOCATION WARNING BANNER */}
                    {isOverAllocation && (
                      <div className="p-3.5 rounded-xl bg-amber-950/80 border-2 border-amber-400/80 text-amber-100 text-xs space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-extrabold text-amber-300 block text-xs sm:text-sm">
                              Quantity exceeds SOW Quantities and the PM must be notified before making
                              this change.
                            </strong>
                            <p className="text-amber-200/90 text-xs mt-0.5 leading-snug">
                              Logging {entry.quantity} units (new total will be {totalInstalledWithNew})
                              exceeds quoted total ({item.quantity}) by <strong>+{offset} units</strong>.
                            </p>
                          </div>
                        </div>

                        {/* 1-Tap PM Contact Link Cards */}
                        <div className="p-2.5 bg-black/40 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-amber-300/80 block text-[10px] font-bold uppercase">
                              Assigned Project Manager
                            </span>
                            <strong className="text-white text-xs sm:text-sm">{assignedPM.name}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${assignedPM.phone}`}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{assignedPM.phone}</span>
                            </a>
                            <a
                              href={`mailto:${assignedPM.email}?subject=${encodeURIComponent(
                                `SOW Over-allocation Notice: ${item.name} on ${activeProject.propertyName}`
                              )}&body=${encodeURIComponent(
                                `Hi ${assignedPM.name},\n\nI am logging ${entry.quantity} units of ${item.name} on ${activeProject.propertyName}. This exceeds quoted SOW by +${offset} units.\n\nPlease review and approve on the project page.\n\nThanks,\n${activeInstallerName}`
                              )}`}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email PM</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Check Chips */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                        Installation Status Check
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {(
                          [
                            'Verified & Online',
                            'Signal Testing Passed',
                            'Pending LoRa Sync',
                            'Hardware Swapped',
                          ] as const
                        ).map((status) => {
                          const isSelected = entry.statusCheck === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateStagedItem(item.id, { statusCheck: status })}
                              className={`px-2.5 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Completed Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                        Specific Units / Location
                      </label>
                      <input
                        type="text"
                        value={entry.locationCompleted}
                        onChange={(e) =>
                          updateStagedItem(item.id, { locationCompleted: e.target.value })
                        }
                        placeholder="e.g. Bldg 3, Units 301-316 or 2nd Floor Clubhouse"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Line Item Notes Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                        Field Notes for this BOM Item
                      </label>
                      <textarea
                        rows={2}
                        value={entry.itemNotes}
                        onChange={(e) => updateStagedItem(item.id, { itemNotes: e.target.value })}
                        placeholder="Type any install context, wiring details, or issues..."
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                      />
                    </div>

                    {/* MEDIA TOOLS: VOICE MEMO + PHOTO UPLOAD (EXCLUSIVE TO CLIP) */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                          Field Media & Verification
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {entry.photos.length} Photo{entry.photos.length === 1 ? '' : 's'} ·{' '}
                          {entry.audioBlobUrl ? 'Voice Note Attached' : 'No Voice Note'}
                        </span>
                      </div>

                      {/* Action Buttons: Camera Upload + Audio Recorder */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* 1. Camera / Photo Upload Button */}
                        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 text-sky-400 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shadow-sm">
                          <Camera className="w-4 h-4" />
                          <span>Snap / Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                            onChange={(e) => handlePhotoCapture(item.id, e)}
                            className="hidden"
                          />
                        </label>

                        {/* 2. Audio Voice Memo Recorder */}
                        {recordingItemId === item.id ? (
                          <button
                            type="button"
                            onClick={() => handleStopRecording(item.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 animate-pulse shadow-md shadow-rose-600/40"
                          >
                            <Square className="w-4 h-4 fill-white" />
                            <span>Stop Recording ({recordingSeconds}s)</span>
                          </button>
                        ) : entry.audioBlobUrl ? (
                          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl p-1.5">
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(item.id, entry.audioBlobUrl)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              {playingItemId === item.id ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-white" />
                                  <span>Pause Memo</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>Play Voice Memo ({entry.audioDuration || 5}s)</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAudio(item.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete voice note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartRecording(item.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shadow-sm"
                          >
                            <Mic className="w-4 h-4" />
                            <span>Record Voice Memo</span>
                          </button>
                        )}
                      </div>

                      {/* Photo Gallery Thumbnails */}
                      {entry.photos.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                          {entry.photos.map((photoUrl, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative group shrink-0 w-16 h-16 rounded-xl border border-slate-700 overflow-hidden bg-slate-950"
                            >
                              <img
                                src={photoUrl}
                                alt={`Install Verification ${pIdx + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setPreviewPhotoUrl(photoUrl)}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(item.id, pIdx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* STICKY BOTTOM 1-FINGER ACTION DOCK                                        */}
          {/* ========================================================================= */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-300">
                  {activeStagedItemsList.length} BOM Item{activeStagedItemsList.length === 1 ? '' : 's'}{' '}
                  Selected
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  <span className="text-emerald-400 tabular-nums">{totalStagedUnits}</span> Devices to
                  Commit
                </div>
              </div>

              {/* Big Green 1-Finger Submit Button */}
              <button
                type="button"
                onClick={handleSubmitBatch}
                disabled={activeStagedItemsList.length === 0}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Submit Batch Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL PHOTO LIGHTBOX PREVIEW MODAL                                         */}
      {/* ========================================================================= */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewPhotoUrl}
              alt="Installation Verification Full View"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
