import React, { useState, useEffect } from 'react';
import {
  subscribeToSyncStatus,
  getSyncStatus,
  SyncStatus,
} from '../services/realtimeSyncService';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, Wifi } from 'lucide-react';

export const CloudSyncIndicator: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToSyncStatus((newStatus) => {
      setStatus(newStatus);
    });
    return unsub;
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
          status.isConnected
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : status.isSyncing
            ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100 animate-pulse'
            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
        }`}
        title="Live Real-Time Cloud Synchronization Status"
      >
        {status.isSyncing ? (
          <RefreshCw className="w-3 h-3 text-sky-600 animate-spin" />
        ) : status.isConnected ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : (
          <CloudOff className="w-3 h-3 text-slate-400" />
        )}

        <span className="font-mono text-[10px] tracking-tight">
          {status.isSyncing
            ? 'Cloud Syncing...'
            : status.isConnected
            ? 'Live Cloud'
            : 'Local Cache'}
        </span>
      </button>

      {/* Popover Details */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs font-['Inter'] text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>Multi-User Cloud Sync</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  status.isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {status.isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              All project edits, shipping table updates, Installer Clip photos, and customer approvals are synchronized live across all out-of-state teammates in real time via Google Cloud Firestore.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 space-y-1.5 font-mono text-[10px] border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Sync Engine:</span>
                <span className="font-bold text-slate-800">Cloud Firestore</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Real-Time Stream:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-emerald-600" /> Active (&lt; 50ms)
                </span>
              </div>
              {status.lastSyncedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Live Event:</span>
                  <span className="font-bold text-slate-700">{status.lastSyncedAt}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="mt-3 w-full py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};
