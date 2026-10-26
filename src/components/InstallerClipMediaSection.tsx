import React, { useState, useMemo, useRef } from 'react';
import { OperationProject, InstallLogEntry, BOMItem } from '../types';
import {
  Camera,
  Mic,
  Play,
  Pause,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  ChevronRight,
  FileText,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface InstallerClipMediaSectionProps {
  project: OperationProject;
  logs?: InstallLogEntry[];
  bomItems?: BOMItem[];
  onOpenInstallersClip?: () => void;
}

export const InstallerClipMediaSection: React.FC<InstallerClipMediaSectionProps> = ({
  project,
  logs = [],
  bomItems = [],
  onOpenInstallersClip,
}) => {
  const effectiveLogs = logs.length > 0 ? logs : project.installLogs || [];
  const effectiveBOM = bomItems.length > 0 ? bomItems : project.bomItems || [];

  // Filter logs that contain field media (photos, voice memos, or dedicated item notes)
  const mediaLogs = useMemo(() => {
    return effectiveLogs.filter(
      (log) =>
        (log.photos && log.photos.length > 0) ||
        Boolean(log.audioNoteUrl) ||
        Boolean(log.itemNotes && log.itemNotes.trim())
    );
  }, [effectiveLogs]);

  // Audio Playback State
  const [playingLogId, setPlayingLogId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<any>(null);

  // Lightbox Photo State
  const [activePhoto, setActivePhoto] = useState<{
    url: string;
    itemName: string;
    installerName: string;
    timestamp: string;
    location: string;
  } | null>(null);

  // Filters State
  const [selectedBOMId, setSelectedBOMId] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photos' | 'voice'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique BOM items that have media
  const bomItemsWithMedia = useMemo(() => {
    const itemMap = new Map<string, { id: string; name: string; category?: string }>();
    mediaLogs.forEach((log) => {
      if (log.itemId && !itemMap.has(log.itemId)) {
        itemMap.set(log.itemId, {
          id: log.itemId,
          name: log.itemName,
        });
      }
    });
    return Array.from(itemMap.values());
  }, [mediaLogs]);

  // Filtered Media Logs
  const filteredLogs = useMemo(() => {
    return mediaLogs.filter((log) => {
      // BOM Item filter
      if (selectedBOMId !== 'all' && log.itemId !== selectedBOMId) {
        return false;
      }
      // Media type filter
      if (mediaTypeFilter === 'photos' && (!log.photos || log.photos.length === 0)) {
        return false;
      }
      if (mediaTypeFilter === 'voice' && !log.audioNoteUrl) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = log.itemName.toLowerCase().includes(query);
        const matchesNotes = (log.notes || '').toLowerCase().includes(query);
        const matchesItemNotes = (log.itemNotes || '').toLowerCase().includes(query);
        const matchesInstaller = (log.installerName || '').toLowerCase().includes(query);
        const matchesLocation = (log.locationCompleted || '').toLowerCase().includes(query);
        if (!matchesName && !matchesNotes && !matchesItemNotes && !matchesInstaller && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [mediaLogs, selectedBOMId, mediaTypeFilter, searchQuery]);

  // Overall statistics
  const totalPhotos = mediaLogs.reduce((acc, log) => acc + (log.photos?.length || 0), 0);
  const totalVoiceMemos = mediaLogs.filter((log) => Boolean(log.audioNoteUrl)).length;
  const uniqueItemsCount = new Set(mediaLogs.map((l) => l.itemId)).size;
  const totalUnitsWithMedia = mediaLogs.reduce((acc, log) => acc + (log.quantityCompleted || 0), 0);

  // Audio Playback Handler
  const handleToggleAudio = (logId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingLogId === logId) {
      if (audioElementRef.current) {
        try {
          audioElementRef.current.pause();
        } catch {
          // ignore
        }
      }
      setPlayingLogId(null);
      setAudioProgress(0);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
      } catch {
        // ignore
      }
    }

    try {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      setPlayingLogId(logId);
      setAudioProgress(0);

      audio.onended = () => {
        setPlayingLogId(null);
        setAudioProgress(0);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };

      audio.onerror = () => {
        setPlayingLogId(null);
        setAudioProgress(0);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };

      audio.play().catch(() => {
        setTimeout(() => {
          setPlayingLogId(null);
          setAudioProgress(0);
        }, 3000);
      });

      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = setInterval(() => {
        if (audio.duration && !isNaN(audio.duration)) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
    } catch {
      setTimeout(() => setPlayingLogId(null), 1000);
    }
  };

  // Helper to find matching BOM item info
  const getBOMInfo = (itemId: string, itemNameFallback: string) => {
    const found = effectiveBOM.find((b) => b && (b.id === itemId || b.name === itemNameFallback));
    return {
      category: found?.category || 'Hardware & Peripherals',
      model: found?.model || 'Field Device',
      location: found?.location || 'Units & Common Areas',
      quantity: found?.quantity || 0,
      installedCount: found?.installedCount || 0,
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-0">
      {/* Subsection Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-600" />
                <Mic className="w-3 h-3 text-emerald-600" />
                Installers Clip Evidence
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Tied directly to Project BOM Line Items
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Field Media &amp; Voice Verification Log</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                {mediaLogs.length} Verified Entries
              </span>
            </h3>

            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              High-resolution installation photos and spoken voice memos recorded on ladders and in units by field technicians and certified partner crews, linked directly to their matching BOM hardware.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-sky-600" />
                <span>{totalPhotos} Photos</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-emerald-600" />
                <span>{totalVoiceMemos} Voice Notes</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold hidden sm:inline-flex">
                {uniqueItemsCount} BOM Items
              </span>
            </div>

            {onOpenInstallersClip && (
              <button
                type="button"
                onClick={onOpenInstallersClip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Launch mobile-optimized Installers Clip to capture more media"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>+ Launch Installers Clip</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        {mediaLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search BOM item, notes, location, or installer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Media Type Filter */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setMediaTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    mediaTypeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Evidence ({mediaLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTypeFilter('photos')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    mediaTypeFilter === 'photos'
                      ? 'bg-white text-sky-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3 h-3 text-sky-600" />
                  <span>Photos Only ({totalPhotos})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTypeFilter('voice')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    mediaTypeFilter === 'voice'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mic className="w-3 h-3 text-emerald-600" />
                  <span>Voice Memos ({totalVoiceMemos})</span>
                </button>
              </div>

              {/* BOM Item Dropdown Filter */}
              {bomItemsWithMedia.length > 1 && (
                <select
                  value={selectedBOMId}
                  onChange={(e) => setSelectedBOMId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="all">All BOM Line Items ({bomItemsWithMedia.length})</option>
                  {bomItemsWithMedia.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Media Items List or Empty State */}
      <div className="p-4 sm:p-5">
        {mediaLogs.length === 0 ? (
          /* Empty State when no photos or voice memos exist yet */
          <div className="py-12 px-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center mx-auto text-sky-600 shadow-2xs">
              <Camera className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-bold text-slate-900">
                No Field Media or Voice Memos Yet
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Photos snapped and voice memos recorded via <strong>Installers Clip</strong> will automatically appear in this card, tied directly to their respective BOM line items and verification logs.
              </p>
            </div>

            {onOpenInstallersClip && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenInstallersClip}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch Installers Clip for {project.propertyName}</span>
                </button>
              </div>
            )}
          </div>
        ) : filteredLogs.length === 0 ? (
          /* Empty State for specific search/filter query */
          <div className="py-10 text-center text-slate-500 text-xs space-y-2">
            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No media entries match the current filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBOMId('all');
                setMediaTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-sky-600 hover:underline font-bold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          /* Media Cards Grid: Each card is explicitly tied to its BOM Line Item */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredLogs.map((log) => {
              const bomInfo = getBOMInfo(log.itemId, log.itemName);
              const isAudioPlaying = playingLogId === log.id;
              const hasPhotos = log.photos && log.photos.length > 0;
              const hasVoice = Boolean(log.audioNoteUrl);

              return (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all p-4 shadow-2xs flex flex-col justify-between gap-3.5 hover:shadow-xs group"
                >
                  <div className="space-y-3">
                    {/* BOM Line Item Header: Explicit Hardware Identity */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3 text-sky-600" />
                          BOM Line Item
                        </span>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            log.statusCheck === 'Verified & Online' || log.statusCheck === 'Signal Testing Passed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {log.statusCheck}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {log.itemName}
                          </h4>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span>{bomInfo.category}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-600">{bomInfo.model}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {log.locationCompleted || bomInfo.location}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            +{log.quantityCompleted} Logged
                          </div>
                          {bomInfo.quantity > 0 && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Scope: {bomInfo.installedCount}/{bomInfo.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Spoken Voice Memo Audio Player (If recorded) */}
                    {hasVoice && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/90 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <Mic className="w-4 h-4 text-emerald-600" />
                            <span>Voice Memo Recording</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">
                            {log.audioNoteDuration ? `${log.audioNoteDuration}s` : 'Voice Note'}
                          </span>
                        </div>

                        {/* Interactive Audio Player Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleAudio(log.id, log.audioNoteUrl)}
                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            title={isAudioPlaying ? 'Pause voice memo' : 'Play voice memo'}
                          >
                            {isAudioPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-white" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            )}
                          </button>

                          {/* Animated Waveform Visualizer */}
                          <div className="flex-1 flex items-center gap-1 h-5 overflow-hidden">
                            {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 65, 90, 40, 75, 60, 80, 55].map((height, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-200 ${
                                  isAudioPlaying
                                    ? 'bg-emerald-500 animate-pulse'
                                    : 'bg-emerald-200'
                                }`}
                                style={{
                                  height: isAudioPlaying ? `${Math.max(25, height)}%` : '30%',
                                }}
                              />
                            ))}
                          </div>

                          <span className="text-[10px] font-mono text-emerald-800 font-bold shrink-0">
                            {isAudioPlaying ? 'Playing...' : 'Audio Ready'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Field Verification Photos Gallery (If attached) */}
                    {hasPhotos && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-sky-600" />
                            <span>Photo Verification ({log.photos?.length || 0})</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Click photo to enlarge
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {log.photos?.map((photoUrl, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() =>
                                setActivePhoto({
                                  url: photoUrl,
                                  itemName: log.itemName,
                                  installerName: log.installerName,
                                  timestamp: log.timestamp,
                                  location: log.locationCompleted,
                                })
                              }
                              className="group/photo relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer hover:border-sky-400 hover:ring-2 hover:ring-sky-200 transition-all shadow-2xs"
                              title={`View full photo #${pIdx + 1}`}
                            >
                              <img
                                src={photoUrl}
                                alt={`Verification ${pIdx + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/photo:bg-black/0 transition-colors" />
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono font-bold flex items-center gap-1">
                                <Maximize2 className="w-2.5 h-2.5" />
                                <span>#{pIdx + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dedicated BOM Line Item Notes */}
                    {log.itemNotes && (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-600" />
                          <span>Line Item Field Note</span>
                        </div>
                        <p className="text-slate-800 italic">
                          &ldquo;{log.itemNotes}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* General Batch Log Notes */}
                    {log.notes && log.notes !== log.itemNotes && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                        <span className="font-semibold text-slate-700">Batch Log Note:</span>{' '}
                        <span>{log.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metadata & Provenance */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-slate-700">{log.installerName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {log.submittedByRole === 'field_tech' ? 'Field Tech' : 'Partner Crew'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen / Lightbox Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
              <div>
                <div className="text-[10px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>Field Installation Photo Evidence</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {activePhoto.itemName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close photo viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Preview Container */}
            <div className="bg-black flex items-center justify-center max-h-[65vh] p-2">
              <img
                src={activePhoto.url}
                alt="Enlarged verification evidence"
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <User className="w-3 h-3 text-sky-400" />
                  <span>{activePhoto.installerName}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{activePhoto.location}</span>
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Logged: {activePhoto.timestamp}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
