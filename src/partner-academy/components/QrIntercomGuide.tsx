import React, { useState } from 'react';
import {
  QR_INTERCOM_GUIDE_STEPS,
  PLAQUE_SPECS,
  IntercomStep
} from '../data/qrIntercomGuideData';
import {
  VerticalTamarinRidgePlaque,
  HorizontalGeokeyPlaque,
  VectorQrCode,
  GeokeyLockLogo
} from './QrPlaqueVisual';
import { generateAndDownloadQrIntercomPdf } from '../utils/generateQrIntercomPdfGuide';
import {
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Smartphone,
  Phone,
  Video,
  Key,
  Shield,
  MapPin,
  Camera,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ExternalLink,
  Lock,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface QrIntercomGuideProps {
  onOpenCourse?: (moduleId: string) => void;
}

export const QrIntercomGuide: React.FC<QrIntercomGuideProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stepper' | 'continuous_deck' | 'plaque_showcase'>('stepper');
  const [paperTheme, setPaperTheme] = useState<'dark' | 'white'>('dark');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  // Interactive Simulator States
  const [simGeofenceState, setSimGeofenceState] = useState<'inside' | 'outside' | 'no_location'>('inside');
  const [simVisitorName, setSimVisitorName] = useState<string>('Raul Recalde');
  const [simSelectedPerson, setSimSelectedPerson] = useState<string>('G. Ayers');
  const [simVideoConfirmed, setSimVideoConfirmed] = useState<boolean>(true);
  const [simDoorUnlocked, setSimDoorUnlocked] = useState<boolean>(false);
  const [simActiveTab, setSimActiveTab] = useState<'landing' | 'name' | 'directory' | 'calling' | 'resident_call' | 'video_confirm' | 'live_stream'>('landing');

  // Customizer for Plaque
  const [customPropertyName, setCustomPropertyName] = useState<string>('WESTLINE @ FLANAGAN LAKE');
  const [customPlaqueType, setCustomPlaqueType] = useState<'vertical' | 'horizontal'>('vertical');

  const currentStep = QR_INTERCOM_GUIDE_STEPS[currentStepIndex];

  const handleDownloadPdf = (theme: 'white' | 'dark') => {
    setIsExporting(true);
    setExportMessage(`Generating ${theme === 'dark' ? 'Obsidian Dark' : 'Printable White'} PDF...`);

    setTimeout(() => {
      try {
        generateAndDownloadQrIntercomPdf({ theme });
        setExportMessage('Downloaded!');
        setTimeout(() => {
          setIsExporting(false);
          setExportMessage('');
        }, 1000);
      } catch (err) {
        console.error(err);
        setIsExporting(false);
        setExportMessage('');
        window.print();
      }
    }, 200);
  };

  const handleSimUnlock = () => {
    setSimDoorUnlocked(true);
    setTimeout(() => {
      setSimDoorUnlocked(false);
    }, 4000);
  };

  // Render Step Mockup Visual inside Stepper & Deck
  const renderStepMockup = (step: IntercomStep) => {
    switch (step.mockupType) {
      // STEP 1: Portal Settings Mockup
      case 'portal_settings':
        return (
          <div className="rounded-2xl bg-[#0f172a] border border-blue-900/50 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-zinc-400 ml-2">Geokey Portal · Custom Settings</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                Intercom Landing Page
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <span className="font-semibold text-white">Enable Intercom System</span>
                <div className="w-10 h-5 rounded-full bg-blue-600 relative flex items-center px-0.5">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-semibold">Name</label>
                  <input
                    type="text"
                    readOnly
                    value="Westline Intercom System"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-semibold">QR Code Geofence (Meters)</label>
                  <input
                    type="text"
                    readOnly
                    value="150 m"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold">Landing Page URL</label>
                <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden text-xs">
                  <span className="px-2.5 py-2 text-zinc-500 font-mono text-[11px] bg-zinc-950/60 border-r border-zinc-800">
                    https://www.
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="westlineflanagan"
                    className="px-2.5 py-2 bg-transparent text-purple-300 font-mono text-xs flex-1 focus:outline-none"
                  />
                  <span className="px-2.5 py-2 text-zinc-400 font-mono text-[11px]">
                    .geokeyaccess.com
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-semibold">Primary Color</label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-700">
                    <span className="w-6 h-6 rounded bg-[#1e2a4a] border border-blue-400/40" />
                    <span className="font-mono text-zinc-300">#1E2A4A (Navy)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-semibold">Secondary Color</label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-700">
                    <span className="w-6 h-6 rounded bg-[#4b778d] border border-cyan-400/40" />
                    <span className="font-mono text-zinc-300">#4B778D (Teal)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 2: QR Plaque Scan Badge
      case 'qr_scan_badge':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {/* The Isolated Plaque Component itself */}
            <div className="scale-95 sm:scale-100 transition-transform">
              <VerticalTamarinRidgePlaque
                propertyName="WESTLINE INTERCOM"
                subTitle="@ FLANAGAN LAKE"
                onScanClick={() => {
                  setCurrentStepIndex(2);
                }}
              />
            </div>
            <p className="text-xs text-zinc-400 text-center max-w-sm">
              <strong className="text-white">Pure Isolated Plaque:</strong> Stainless steel finish with laser-etched QR code. No background wall or keypad.
            </p>
          </div>
        );

      // STEP 3: Landing Page & Geofence Validation
      case 'landing_page':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl space-y-4 text-center">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto" />

            {/* Mobile Web Browser View */}
            <div className="rounded-2xl bg-[#1e2a4a] text-white p-5 space-y-6 min-h-[380px] flex flex-col justify-between border border-blue-900/60 shadow-inner">
              <div className="space-y-3 pt-2">
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">
                  THE WESTLINE
                </div>
                <h4 className="text-xl font-bold tracking-tight">@ FLANAGAN LAKE</h4>
                <div className="w-16 h-0.5 bg-blue-300/40 mx-auto" />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 px-2">
                <button
                  onClick={() => setCurrentStepIndex(3)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#4b778d] hover:bg-[#5b879d] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Leasing</span>
                </button>

                <button
                  onClick={() => setCurrentStepIndex(3)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#4b778d] hover:bg-[#5b879d] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>People</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-1.5 text-[10px] text-blue-300/80 font-medium border-t border-blue-900/40">
                <span>Powered by</span>
                <GeokeyLockLogo size={12} color="#93c5fd" />
                <span className="font-bold text-white">Geokey</span>
              </div>
            </div>
          </div>
        );

      // STEP 4: Name Prompt Screen
      case 'name_prompt':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl space-y-4 text-center">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto" />

            <div className="rounded-2xl bg-[#1e2a4a] text-white p-5 space-y-6 min-h-[380px] flex flex-col justify-between border border-blue-900/60">
              <div className="space-y-2 pt-2">
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">
                  THE WESTLINE
                </div>
                <h4 className="text-xl font-bold tracking-tight">@ FLANAGAN LAKE</h4>
              </div>

              <div className="space-y-4 px-2">
                <p className="text-xs text-blue-100 font-medium">
                  Please enter your name to access the directory
                </p>
                <input
                  type="text"
                  value={simVisitorName}
                  onChange={(e) => setSimVisitorName(e.target.value)}
                  placeholder="Visitor Name"
                  className="w-full px-3 py-2.5 rounded-lg bg-white text-zinc-900 font-semibold text-xs text-center focus:outline-none"
                />
                <button
                  onClick={() => setCurrentStepIndex(4)}
                  className="w-full py-2.5 rounded-lg bg-[#4b778d] hover:bg-[#5b879d] text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Submit
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-blue-300/80">
                <span>Powered by Geokey</span>
              </div>
            </div>
          </div>
        );

      // STEP 5: Resident Directory Search
      case 'directory_search':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl space-y-3">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto" />

            <div className="rounded-2xl bg-[#1e2a4a] text-white p-4 space-y-3 min-h-[380px] flex flex-col border border-blue-900/60">
              <div className="text-center space-y-1">
                <div className="text-[9px] text-blue-200 uppercase tracking-wider font-bold">THE WESTLINE</div>
                <h5 className="text-sm font-bold">@ FLANAGAN LAKE</h5>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resident..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs focus:outline-none"
                />
              </div>

              {/* Resident List */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
                {[
                  { name: 'G. Ayers', video: true, call: true },
                  { name: 'C. Cardon', video: true, call: true },
                  { name: 'R. Evans', video: false, call: true },
                  { name: 'T. Givens', video: true, call: true },
                  { name: 'P. James', video: true, call: false },
                  { name: 'R. Mitchell', video: true, call: true }
                ].map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSimSelectedPerson(res.name);
                      setCurrentStepIndex(5);
                    }}
                    className="p-2.5 rounded-xl bg-[#28385e] hover:bg-[#344877] border border-blue-400/20 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-white">{res.name}</span>
                    <div className="flex items-center gap-2">
                      {res.video && (
                        <span className="p-1 rounded bg-blue-600/50 text-blue-200 hover:text-white" title="Video Call">
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {res.call && (
                        <span className="p-1 rounded bg-green-600/50 text-green-200 hover:text-white" title="Voice Call">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-center text-blue-300">
                Tap resident to place voice or video call
              </div>
            </div>
          </div>
        );

      // STEP 6: Outgoing Voice Calling
      case 'voice_calling':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl text-center">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

            <div className="rounded-2xl bg-[#111827] text-white p-6 space-y-6 min-h-[380px] flex flex-col justify-between border border-zinc-800">
              <div className="space-y-1 pt-4">
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider animate-pulse">
                  Calling
                </span>
                <h4 className="text-2xl font-bold text-white">{simSelectedPerson}</h4>
              </div>

              {/* Property Crest Circle */}
              <div className="w-24 h-24 rounded-full bg-blue-900/40 border-2 border-blue-500/40 mx-auto flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[8px] font-bold text-blue-200">THE WESTLINE</span>
                <span className="text-[9px] font-extrabold text-white">@ FLANAGAN LAKE</span>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-zinc-400">Westline Intercom System</p>
                <button
                  onClick={() => setCurrentStepIndex(4)}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-red-600/40 cursor-pointer active:scale-95 transition-all"
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </button>
                <span className="block text-[11px] text-zinc-400 font-semibold">End Call</span>
              </div>
            </div>
          </div>
        );

      // STEP 7: Resident Incoming Audio Call
      case 'incoming_audio':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl text-center">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

            <div className="rounded-2xl bg-[#111827] text-white p-5 space-y-5 min-h-[380px] flex flex-col justify-between border border-zinc-800">
              <div className="space-y-1 pt-2">
                <span className="text-xs text-green-400 font-bold uppercase tracking-wider animate-pulse">
                  Incoming Call
                </span>
                <h4 className="text-2xl font-bold text-white">{simVisitorName}</h4>
              </div>

              {/* Property Crest */}
              <div className="w-20 h-20 rounded-full bg-blue-900/40 border-2 border-blue-500/40 mx-auto flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[7px] font-bold text-blue-200">THE WESTLINE</span>
                <span className="text-[8px] font-extrabold text-white">@ FLANAGAN LAKE</span>
              </div>

              <p className="text-[11px] text-zinc-400">Westline Intercom System</p>

              {/* 4 Resident Action Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(5)}
                    className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Decline"
                  >
                    ✕
                  </button>
                  <span className="text-[9px] text-zinc-400 font-bold">Decline</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(7)}
                    className="w-11 h-11 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Request Video"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] text-zinc-400 font-bold">Req Video</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={handleSimUnlock}
                    className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Unlock Door"
                  >
                    <Key className="w-4 h-4 text-black" />
                  </button>
                  <span className="text-[9px] text-amber-400 font-bold">Unlock</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(9)}
                    className="w-11 h-11 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Answer Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] text-green-400 font-bold">Answer</span>
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 8: Video Request Confirmation Modal
      case 'video_request_modal':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl text-center relative overflow-hidden">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

            <div className="rounded-2xl bg-[#111827] text-white p-5 space-y-6 min-h-[380px] flex flex-col justify-between border border-zinc-800 relative">
              <div className="space-y-1 pt-2 opacity-40">
                <span className="text-xs text-blue-400">Calling</span>
                <h4 className="text-xl font-bold">{simSelectedPerson}</h4>
              </div>

              {/* Centered Modal Box */}
              <div className="p-4 rounded-xl bg-white text-zinc-950 shadow-2xl border border-zinc-300 space-y-3 z-10">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                  Please Confirm!
                </div>
                <p className="text-xs font-semibold leading-relaxed text-zinc-900">
                  {simSelectedPerson} is requesting a video call. Do you wish to proceed?
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSimVideoConfirmed(false);
                      setCurrentStepIndex(5);
                    }}
                    className="py-2 px-3 rounded-lg border border-zinc-400 text-zinc-800 text-xs font-bold hover:bg-zinc-100 cursor-pointer"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      setSimVideoConfirmed(true);
                      setCurrentStepIndex(8);
                    }}
                    className="py-2 px-3 rounded-lg bg-[#1e2a4a] text-white text-xs font-bold hover:bg-[#2c3d69] cursor-pointer shadow-md"
                  >
                    Yes
                  </button>
                </div>
              </div>

              <div className="opacity-40">
                <button className="w-12 h-12 rounded-full bg-red-600 text-white mx-auto flex items-center justify-center">
                  <Phone className="w-5 h-5 rotate-[135deg]" />
                </button>
              </div>
            </div>
          </div>
        );

      // STEP 9: Incoming Video Call Prompt
      case 'incoming_video':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl text-center">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

            <div className="rounded-2xl bg-[#111827] text-white p-5 space-y-6 min-h-[380px] flex flex-col justify-between border border-zinc-800">
              <div className="space-y-1 pt-2">
                <span className="text-xs text-purple-400 font-bold uppercase tracking-wider animate-pulse flex items-center justify-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  Incoming Video Call
                </span>
                <h4 className="text-2xl font-bold text-white">{simVisitorName}</h4>
              </div>

              <div className="w-20 h-20 rounded-full bg-purple-900/40 border-2 border-purple-500/40 mx-auto flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[7px] font-bold text-purple-200">THE WESTLINE</span>
                <span className="text-[8px] font-extrabold text-white">@ FLANAGAN LAKE</span>
              </div>

              <p className="text-[11px] text-zinc-400">Westline Intercom System</p>

              {/* 3 Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(7)}
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Decline"
                  >
                    ✕
                  </button>
                  <span className="text-[10px] text-zinc-400 font-bold">Decline</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={handleSimUnlock}
                    className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Unlock Door"
                  >
                    <Key className="w-5 h-5 text-black" />
                  </button>
                  <span className="text-[10px] text-amber-400 font-bold">Unlock</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(9)}
                    className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow cursor-pointer active:scale-95"
                    title="Answer Video"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-green-400 font-bold">Answer</span>
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 10: Live Video Stream & Door Release
      case 'live_video_stream':
        return (
          <div className="w-64 sm:w-72 mx-auto rounded-[2.5rem] bg-black p-3 border-4 border-zinc-800 shadow-2xl text-center relative overflow-hidden">
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

            {/* Video Viewport Container */}
            <div className="rounded-2xl bg-zinc-900 text-white min-h-[380px] flex flex-col justify-between relative overflow-hidden border border-zinc-800">
              {/* Simulated Visitor Video Feed (Atmospheric portrait placeholder) */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-none" />
              
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(/src/assets/images/quext_field_technician_hero_1791229726783.jpg)'
                }}
              />

              {/* Status Header */}
              <div className="relative z-20 pt-4 px-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-green-400 border border-green-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE STREAM
                </span>
                <span className="text-[10px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded">
                  HD 1080p
                </span>
              </div>

              {/* Door Unlock Toast Overlay */}
              {simDoorUnlocked && (
                <div className="relative z-30 mx-4 p-3 rounded-xl bg-emerald-500 text-zinc-950 font-extrabold text-xs shadow-2xl flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DOOR UNLOCKED (RELAY PULSED)</span>
                </div>
              )}

              {/* Live Controls Bar */}
              <div className="relative z-20 p-4 pb-5 flex items-center justify-around">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCurrentStepIndex(0)}
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl cursor-pointer active:scale-95"
                    title="End Call"
                  >
                    <Phone className="w-6 h-6 rotate-[135deg]" />
                  </button>
                  <span className="text-[10px] text-zinc-300 font-bold">End Call</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={handleSimUnlock}
                    className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-xl cursor-pointer active:scale-95 shadow-amber-500/30"
                    title="Unlock Entrance Door"
                  >
                    <Key className="w-6 h-6 text-black" />
                  </button>
                  <span className="text-[10px] text-amber-300 font-extrabold">Unlock Door</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* EXPORTING OVERLAY */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121e] border border-purple-500 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center mx-auto text-purple-300 animate-pulse">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Exporting QR Intercom Guide</h4>
              <p className="text-xs text-purple-300 font-mono mt-1">{exportMessage}</p>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER CONTROLS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QXT-DOC-QR-INTERCOM-2026</span>
            <span>·</span>
            <span>Geokey Cloud Architecture</span>
            <span className="hidden sm:inline">·</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
              📱 iPhone Mockups on All Steps (PDF & Web)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            QR Intercom Plaque Integration Guide
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Field installation manual and plaque hardware guide for cloud video calling, entrance plaques, GPS geofencing, and remote door release. PDF downloads include high-resolution iPhone device mockups for each step.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Tabs */}
          <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              onClick={() => setViewMode('stepper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'stepper'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Step Walkthrough
            </button>
            <button
              onClick={() => setViewMode('plaque_showcase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'plaque_showcase'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Plaque Hardware
            </button>
            <button
              onClick={() => setViewMode('continuous_deck')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'continuous_deck'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All 10 Steps Deck
            </button>
          </div>

          {/* Theme Display Toggle */}
          <button
            onClick={() => setPaperTheme(paperTheme === 'dark' ? 'white' : 'dark')}
            className="px-3.5 py-2 rounded-xl bg-[#111728] border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{paperTheme === 'dark' ? 'Obsidian Dark' : 'Clean White'}</span>
          </button>

          {/* Download Dark PDF */}
          <button
            onClick={() => handleDownloadPdf('dark')}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-950/50 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dark PDF</span>
          </button>

          {/* Download White PDF */}
          <button
            onClick={() => handleDownloadPdf('white')}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Printable White PDF</span>
          </button>

          {/* Browser Print */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 1: PLAQUE HARDWARE SHOWCASE (ISOLATED PLAQUES ONLY)               */}
      {/* ===================================================================== */}
      {viewMode === 'plaque_showcase' && (
        <div className="space-y-8">
          {/* Header banner explaining isolated plaques */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12182c] via-[#090d18] to-[#1c1236] border border-purple-500/30 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Isolated Hardware View</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Official QR Intercom Entrance Plaques
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Below are the official architectural entrance plaques isolated cleanly with zero background interference — no brick or stone walls, no surrounding keypads, and no hands in frame. These brushed stainless steel and architectural aluminum plaques mount directly at entrance gates, storefront glass sidelites, or door frames.
            </p>
          </div>

          {/* Side-by-Side Dual Plaque Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* 1. Vertical Custom Multi-Family Plaque */}
            <div className="rounded-2xl bg-[#0a0e18] border border-zinc-800 p-6 space-y-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Format A</span>
                  <h3 className="text-base font-bold text-white">Vertical Architectural Plaque</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40 text-xs font-mono font-bold">
                  8" × 10" Plate
                </span>
              </div>

              {/* Plaque Renderer */}
              <div className="py-2">
                <VerticalTamarinRidgePlaque
                  propertyName="TAMARIN | RIDGE"
                  subTitle="APARTMENTS"
                  onScanClick={() => setViewMode('stepper')}
                />
              </div>

              <div className="w-full space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Material:</span>
                  <span className="font-semibold text-white">Grade 316 Brushed Stainless Steel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Engraving:</span>
                  <span className="font-semibold text-white">Fiber-Laser Etched Dark Carbon Matrix</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Mounting:</span>
                  <span className="font-semibold text-white">4 Corner Countersunk Machine Screws</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Weather Rating:</span>
                  <span className="font-semibold text-emerald-400">IP67 Submersible & UV Proof</span>
                </div>
              </div>
            </div>

            {/* 2. Horizontal Compact Glass / Mullion Plaque */}
            <div className="rounded-2xl bg-[#0a0e18] border border-zinc-800 p-6 space-y-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Format B</span>
                  <h3 className="text-base font-bold text-white">Horizontal Compact Plaque</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/40 text-xs font-mono font-bold">
                  7.5" × 3.5" Plate
                </span>
              </div>

              {/* Plaque Renderer */}
              <div className="py-6">
                <HorizontalGeokeyPlaque
                  propertyName="Geokey"
                  onScanClick={() => setViewMode('stepper')}
                />
              </div>

              <div className="w-full space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Material:</span>
                  <span className="font-semibold text-white">Anodized Brushed Architectural Aluminum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Applications:</span>
                  <span className="font-semibold text-white">Glass Sidelites, Door Mullions, Pedestals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Mounting:</span>
                  <span className="font-semibold text-white">Standoff Bolts or 3M VHB Industrial Tape</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Zero Wiring:</span>
                  <span className="font-semibold text-cyan-400">100% Cloud Connected via Caller LTE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: STEPPER WALKTHROUGH (STEP-BY-STEP SIMULATION)                  */}
      {/* ===================================================================== */}
      {viewMode === 'stepper' && (
        <div className="space-y-6">
          {/* Stepper Navigation Pills Bar */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {QR_INTERCOM_GUIDE_STEPS.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    currentStepIndex === idx
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'bg-[#111728] border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px]">
                    {step.stepNumber}
                  </span>
                  <span className="hidden sm:inline">
                    {step.stepNumber === 1
                      ? 'Portal Config'
                      : step.stepNumber === 2
                      ? 'QR Plaque Scan'
                      : step.stepNumber === 3
                      ? 'Geofence Check'
                      : step.stepNumber === 4
                      ? 'Routing'
                      : step.stepNumber === 5
                      ? 'Directory'
                      : step.stepNumber === 6
                      ? 'Voice Calling'
                      : step.stepNumber === 7
                      ? 'Resident Audio'
                      : step.stepNumber === 8
                      ? 'Video Request'
                      : step.stepNumber === 9
                      ? 'Incoming Video'
                      : 'Video & Unlock'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Content Card */}
          <div
            className={`rounded-2xl p-6 sm:p-10 shadow-2xl border transition-colors ${
              paperTheme === 'white'
                ? 'bg-white text-zinc-900 border-zinc-300'
                : 'bg-[#0a0e18] text-white border-zinc-800'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Step Instruction Details */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                    Step {currentStep.stepNumber} of {QR_INTERCOM_GUIDE_STEPS.length}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold font-mono">
                    {currentStep.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {currentStep.title}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed ${
                      paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'
                    }`}
                  >
                    {currentStep.summary}
                  </p>
                </div>

                {/* Specific Bullets from PDF */}
                <div className="space-y-2.5 pt-2">
                  {currentStep.details.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                      <span
                        className={paperTheme === 'white' ? 'text-zinc-800' : 'text-zinc-300'}
                      >
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Callout box if present */}
                {currentStep.callout && (
                  <div
                    className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                      currentStep.callout.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                        : currentStep.callout.type === 'success'
                        ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                        : 'bg-blue-950/30 border-blue-600/40 text-blue-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{currentStep.callout.text}</span>
                  </div>
                )}

                {/* Next / Previous Controls */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentStepIndex((prev) =>
                        Math.min(QR_INTERCOM_GUIDE_STEPS.length - 1, prev + 1)
                      )
                    }
                    disabled={currentStepIndex === QR_INTERCOM_GUIDE_STEPS.length - 1}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-900/40"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Realistic Interactive Device / Plaque Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                {renderStepMockup(currentStep)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: ALL 10 STEPS CONTINUOUS DECK (PRINTABLE FORMAT)               */}
      {/* ===================================================================== */}
      {viewMode === 'continuous_deck' && (
        <div className="space-y-8">
          {QR_INTERCOM_GUIDE_STEPS.map((step) => (
            <div
              key={step.stepNumber}
              className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors ${
                paperTheme === 'white'
                  ? 'bg-white text-zinc-900 border-zinc-300'
                  : 'bg-[#0a0e18] text-white border-zinc-800'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                      Step {step.stepNumber} of 10
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold font-mono">
                      {step.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      paperTheme === 'white' ? 'text-zinc-700' : 'text-zinc-300'
                    }`}
                  >
                    {step.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    {step.details.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span
                          className={
                            paperTheme === 'white' ? 'text-zinc-800' : 'text-zinc-300'
                          }
                        >
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center py-2">
                  {renderStepMockup(step)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
