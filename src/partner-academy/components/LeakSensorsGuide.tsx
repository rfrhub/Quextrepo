import React, { useState, useEffect } from 'react';
import {
  LEAK_APP_ONBOARDING_STEPS,
  LeakAppStep
} from '../data/leakAppOnboardingData';
import {
  TOILET_INSTALLATION_STEPS,
  POINT_OF_USE_LEAK_LOCATIONS,
  TROUBLESHOOTING_CASES,
  LEAK_SENSOR_SPECS,
  PORTAL_AUTOMATION_RULES
} from '../data/leakSensorsGuideData';
import { generateAndDownloadLeakOnboardingPdf } from '../utils/generateLeakOnboardingPdfGuide';
import { generateAndDownloadLeakSensorsPdf } from '../utils/generateLeakSensorsPdfGuide';
import {
  saveScreenshot,
  loadAllScreenshots,
  clearAllScreenshotsDB
} from '../utils/screenshotStorage';
import {
  Droplets,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  Smartphone,
  Layers,
  Activity,
  Radio,
  Clock,
  Wrench,
  Gauge,
  Bell,
  RefreshCw,
  Info,
  Building2,
  Send,
  Zap,
  Volume2,
  Scan,
  Check,
  RotateCcw,
  Video,
  FileText,
  SlidersHorizontal,
  Trash2,
  Image as ImageIcon,
  CheckCheck
} from 'lucide-react';

interface LeakSensorsGuideProps {
  onOpenCourse?: (moduleId: string) => void;
}

export const LeakSensorsGuide: React.FC<LeakSensorsGuideProps> = ({ onOpenCourse }) => {
  // Navigation tabs: Onboarding App Guide vs Mechanical Installation vs Interactive Simulator vs Diagnostics
  const [activeTab, setActiveTab] = useState<'app_onboarding' | 'mechanical_install' | 'simulator' | 'diagnostics'>('app_onboarding');

  // App Onboarding Stepper state
  const [currentAppStepIndex, setCurrentAppStepIndex] = useState<number>(0);
  const [appViewMode, setAppViewMode] = useState<'stepper' | 'grid'>('stepper');

  // Exact Screenshots State (maps step number 1-15 to base64 Data URL)
  const [stepScreenshots, setStepScreenshots] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('quext_leak_step_screenshots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load from IndexedDB on component mount to recover any screenshots exceeding localStorage quota
  useEffect(() => {
    loadAllScreenshots().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setStepScreenshots((prev) => ({ ...prev, ...data }));
      }
    });
  }, []);

  const handleClearAllScreenshots = async () => {
    setStepScreenshots({});
    await clearAllScreenshotsDB();
  };

  // Mechanical Stepper state
  const [currentMechStepIndex, setCurrentMechStepIndex] = useState<number>(0);

  // PDF Export state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  // Flush Simulator State
  const [isFlushing, setIsFlushing] = useState<boolean>(false);
  const [simWaterLevel, setSimWaterLevel] = useState<number>(100);
  const [simMagnetUp, setSimMagnetUp] = useState<boolean>(false);
  const [simTelemetrySent, setSimTelemetrySent] = useState<boolean>(false);
  const [simFlushCount, setSimFlushCount] = useState<number>(4);
  const [simFlapperLeak, setSimFlapperLeak] = useState<boolean>(false);

  // Surface Probe Wet Test State
  const [probeWet, setProbeWet] = useState<boolean>(false);
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);

  // Portal Automation Dispatch Roster
  const [roster, setRoster] = useState<Array<{ name: string; phone: string; role: string }>>([
    { name: 'Raul Recalde', phone: '(555) 349-8821', role: 'Lead Field Engineer' },
    { name: 'Marcus Vance', phone: '(555) 712-4409', role: 'Property Maintenance Supervisor' }
  ]);
  const [newTechName, setNewTechName] = useState<string>('');
  const [newTechPhone, setNewTechPhone] = useState<string>('');
  const [testAlertSent, setTestAlertSent] = useState<string | null>(null);

  // Active Troubleshooting Case
  const [selectedCaseId, setSelectedCaseId] = useState<string>('ts-01');

  const currentAppStep = LEAK_APP_ONBOARDING_STEPS[currentAppStepIndex];
  const currentMechStep = TOILET_INSTALLATION_STEPS[currentMechStepIndex];

  // Download PDF Handler
  const handleDownloadPdf = (theme: 'white' | 'dark', guideType: 'app' | 'mechanical') => {
    setIsExporting(true);
    setExportMessage(`Generating ${theme === 'dark' ? 'Obsidian Dark' : 'Printable White'} PDF Guide...`);

    setTimeout(() => {
      try {
        if (guideType === 'app') {
          generateAndDownloadLeakOnboardingPdf({ theme, screenshots: stepScreenshots });
        } else {
          generateAndDownloadLeakSensorsPdf({ theme });
        }
        setExportMessage('Downloaded successfully!');
        setTimeout(() => {
          setIsExporting(false);
          setExportMessage('');
        }, 1200);
      } catch (err) {
        console.error(err);
        setIsExporting(false);
        setExportMessage('');
        window.print();
      }
    }, 250);
  };

  const handleTriggerFlush = () => {
    if (isFlushing) return;
    setIsFlushing(true);
    setSimTelemetrySent(false);

    // Step 1: Tank drops from 100 to 15
    const drainInterval = setInterval(() => {
      setSimWaterLevel((prev) => {
        if (prev <= 15) {
          clearInterval(drainInterval);
          setSimMagnetUp(true); // Fill valve activates, flow begins

          // Step 2: Tank refills from 15 back to 100
          setTimeout(() => {
            const fillInterval = setInterval(() => {
              setSimWaterLevel((fPrev) => {
                if (fPrev >= 100) {
                  clearInterval(fillInterval);
                  setSimMagnetUp(false); // Valve shuts, flow stops
                  setIsFlushing(false);
                  setSimTelemetrySent(true);
                  setSimFlushCount((c) => c + 1);
                  return 100;
                }
                return fPrev + 5;
              });
            }, 60);
          }, 400);

          return 15;
        }
        return prev - 10;
      });
    }, 40);
  };

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName || !newTechPhone) return;
    setRoster([...roster, { name: newTechName, phone: newTechPhone, role: 'Field Technician' }]);
    setNewTechName('');
    setNewTechPhone('');
  };

  const handleTriggerTestAlert = (ruleTitle: string) => {
    setTestAlertSent(ruleTitle);
    setTimeout(() => {
      setTestAlertSent(null);
    }, 3500);
  };

  // Render iPhone Screen Mockup for each Step
  const renderIPhoneMockup = (step: LeakAppStep) => {
    const isVideo = step.sourceType === 'video_capture';
    const customImg = stepScreenshots[step.stepNumber];

    return (
      <div className="w-full max-w-[285px] sm:max-w-[305px] mx-auto flex flex-col items-center select-none">
        {/* Device Status & Source Indicator: Blue bubble on all slides */}
        <div className="w-full flex items-center justify-between mb-2 px-2 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-400">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>iPhone 15 Pro</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-semibold text-blue-300">
            Quext Admin iOS
          </span>
        </div>

        {/* iPhone Chassis Outer Border */}
        <div className="w-full rounded-[3rem] bg-gradient-to-b from-[#323644] via-[#1a1d26] to-[#11131a] p-[8px] border-[3px] border-[#3e4657] shadow-2xl shadow-black/80 relative transition-all duration-300 hover:border-zinc-500">
          {/* Side Hardware Buttons Simulation */}
          <div className="absolute -left-[5px] top-24 w-[3px] h-8 bg-[#3e4657] rounded-l-xs" />
          <div className="absolute -left-[5px] top-36 w-[3px] h-12 bg-[#3e4657] rounded-l-xs" />
          <div className="absolute -left-[5px] top-52 w-[3px] h-12 bg-[#3e4657] rounded-l-xs" />
          <div className="absolute -right-[5px] top-32 w-[3px] h-16 bg-[#3e4657] rounded-r-xs" />

          {/* Hardware Top Bezel: Camera Eyelit & Speaker (Outside Screen, Never covers text on screenshot) */}
          <div className="w-full flex items-center justify-center gap-2 mb-1.5 pt-0.5 pointer-events-none select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a0f1d] border border-zinc-700/80 flex items-center justify-center shadow-inner">
              <div className="w-1 h-1 rounded-full bg-[#00112c] border border-blue-400/40" />
            </div>
            <div className="w-8 h-0.5 bg-zinc-800 rounded-full" />
          </div>

          {/* Screen Inner Viewport (Bordered exactly by iPhone titanium bezel) */}
          <div className="rounded-[2.4rem] bg-black overflow-hidden relative shadow-inner w-full h-[550px] sm:h-[580px] flex items-center justify-center p-0.5">
            {customImg ? (
              /* Custom User Screenshot: 100% Uncropped View (No cropping at bottom, top, or sides) */
              <img
                src={customImg}
                alt={`Step ${step.stepNumber} - ${step.title}`}
                className="w-full h-full object-contain object-center select-none"
              />
            ) : (
              /* High-Fidelity Quext Admin iOS Native Screen */
              <div className="flex flex-col h-full justify-between p-3.5 bg-[#090d16] text-white">
                {/* App Navigation Bar */}
                <div className="border-b border-zinc-800/80 pb-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    {step.uiMockup.headerBack ? (
                      <div className="flex items-center gap-0.5 text-[11px] text-blue-400 font-semibold cursor-pointer">
                        <ChevronLeft className="w-4 h-4 -ml-1 text-blue-400" />
                        <span>Back</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span>QUEXT ADMIN</span>
                      </div>
                    )}
                    {step.uiMockup.headerNext ? (
                      <div className="text-[11px] text-blue-400 font-bold cursor-pointer hover:underline">
                        {step.uiMockup.headerNext}
                      </div>
                    ) : (
                      <div className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 font-mono">
                        Step {step.stepNumber}/15
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-bold text-white tracking-tight leading-tight">
                    {step.uiMockup.headerTitle}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {step.screenSubtitle || 'Quext Multifamily Operations'}
                  </div>
                </div>

                {/* Screen Content Body based on step mockup type */}
                <div className="my-auto py-2 space-y-2.5">
                  {/* Step 1: Home Screen Select Service */}
                  {step.uiMockup.mainContent.type === 'home_service' && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#121a2e] to-[#0d1424] border border-blue-900/50 space-y-1.5">
                        <div className="text-[9px] text-blue-300 uppercase font-mono font-bold tracking-wider">Property Operations</div>
                        <div className="text-xs font-bold text-white">The Westline @ Flanagan Lake</div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>36 Buildings Online • Mesh Healthy</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center opacity-60">
                          <Building2 className="w-5 h-5 mx-auto text-zinc-400 mb-1" />
                          <div className="text-[10px] text-zinc-300 font-medium">Residents</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-950/90 border-2 border-blue-500 text-center shadow-lg shadow-blue-500/20 relative animate-pulse">
                          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-cyan-400 text-black text-[8px] font-extrabold">
                            SELECT
                          </span>
                          <Wrench className="w-5 h-5 mx-auto text-cyan-300 mb-1" />
                          <div className="text-[11px] text-white font-bold">Service</div>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-black/40 border border-zinc-800 text-[10px] text-zinc-400 text-center">
                        Tap <span className="text-cyan-300 font-bold">Service</span> to open building &amp; unit installation roster.
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Building */}
                  {step.uiMockup.mainContent.type === 'select_building' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="Building 1"
                          className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                          placeholder="Search building..."
                        />
                      </div>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {[
                          { name: 'Building 1', units: '36 Units • Gateway Online', selected: true },
                          { name: 'Building 2', units: '42 Units', selected: false },
                          { name: 'Building 3', units: '38 Units', selected: false },
                          { name: 'Clubhouse & Leasing', units: 'Common Area', selected: false }
                        ].map((b, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                              b.selected
                                ? 'bg-blue-950/90 border-blue-500 text-white shadow-md'
                                : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className={`w-4 h-4 ${b.selected ? 'text-blue-400' : 'text-zinc-500'}`} />
                              <div>
                                <div className="font-bold text-[11px]">{b.name}</div>
                                <div className="text-[9px] text-zinc-400">{b.units}</div>
                              </div>
                            </div>
                            {b.selected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Select Unit */}
                  {step.uiMockup.mainContent.type === 'select_unit' && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-zinc-300 flex items-center justify-between">
                        <span>Building 1 Units:</span>
                        <span className="text-[9px] text-blue-400">Filter: All</span>
                      </div>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {[
                          { num: 'Unit 101', status: 'Occupied', selected: false },
                          { num: 'Unit 102', status: 'Vacant Ready', selected: false },
                          { num: 'Unit 104', status: 'Occupied • Target Unit', selected: true },
                          { num: 'Unit 105', status: 'Occupied', selected: false }
                        ].map((u, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                              u.selected
                                ? 'bg-blue-950/90 border-blue-500 text-white shadow-md ring-1 ring-blue-400/50'
                                : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 opacity-75'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-[11px]">{u.num}</div>
                              <div className="text-[9px] text-zinc-400">{u.status}</div>
                            </div>
                            {u.selected && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                                Selected
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Install Device Menu */}
                  {step.uiMockup.mainContent.type === 'install_device_menu' && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                        <div className="text-[9px] text-zinc-400 uppercase font-mono">Installed Hardware in Unit 104</div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Quext Smart Thermostat (Hub Online)</span>
                        </div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Schlage Control Smart Lock (Online)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/50 text-center">
                        <div className="text-[11px] text-blue-200 font-medium">Ready to add water leak sensor to Unit 104</div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Select Other Devices */}
                  {step.uiMockup.mainContent.type === 'other_devices_list' && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-300">Select Hardware Category:</div>
                      {[
                        { name: 'Thermostats', sub: 'Quext IoT Thermostats & Hubs', selected: false },
                        { name: 'Smart Locks', sub: 'Schlage NDE, BE467F, XE360', selected: false },
                        { name: 'Access Readers', sub: 'Schlage RC11 Mullion', selected: false },
                        { name: 'Other Devices', sub: 'Water Leak Sensors & Peripheral Hardware', selected: true }
                      ].map((cat, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                            cat.selected
                              ? 'bg-blue-950 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                              : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[11px]">{cat.name}</div>
                            <div className="text-[9px] text-zinc-400">{cat.sub}</div>
                          </div>
                          {cat.selected && <Check className="w-3.5 h-3.5 text-blue-300" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 6: Scan QR Code Camera */}
                  {step.uiMockup.mainContent.type === 'scan_qr_camera' && (
                    <div className="space-y-2 text-center">
                      <div className="relative w-40 h-40 mx-auto rounded-2xl bg-black border-2 border-dashed border-cyan-400 flex flex-col items-center justify-center p-2 overflow-hidden shadow-inner">
                        {/* Animated scanning laser line */}
                        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-sm shadow-cyan-400" />
                        <div className="w-24 h-24 border-2 border-cyan-400/80 rounded-lg flex items-center justify-center relative">
                          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
                          <Scan className="w-10 h-10 text-cyan-300 animate-pulse" />
                        </div>
                        <div className="text-[8px] text-cyan-200 mt-1 font-mono tracking-wider">RETICLE ALIGNED</div>
                      </div>
                      <div className="text-[9px] text-zinc-400">
                        Point camera at QR code on leak sensor body.
                      </div>
                    </div>
                  )}

                  {/* Step 7: Leak Sensor QR Code Scanned */}
                  {step.uiMockup.mainContent.type === 'qr_scanned_details' && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-center space-y-0.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                        <div className="text-xs font-bold text-emerald-200">QR Code Captured!</div>
                        <div className="text-[9px] text-zinc-300">Payload Cryptographically Verified</div>
                      </div>

                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Model:</span>
                          <span className="text-white font-mono font-bold">SI-FLUSH-01</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">DevEUI:</span>
                          <span className="text-cyan-300 font-mono">00-80-E1-04-3A-9F-72-B1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Protocol:</span>
                          <span className="text-white">LoRaWAN / SI-Mesh</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 8: Specify Where Device Is */}
                  {step.uiMockup.mainContent.type === 'specify_location' && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-300">Assign Fixture Sub-Location:</div>
                      <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
                        {[
                          { name: 'Master Bathroom - Toilet', selected: true },
                          { name: 'Guest Bathroom - Toilet', selected: false },
                          { name: 'Kitchen Sink - Under Basin', selected: false },
                          { name: 'Water Heater Pan', selected: false },
                          { name: 'Washing Machine Tray', selected: false }
                        ].map((loc, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                              loc.selected
                                ? 'bg-blue-950/90 border-blue-400 text-white'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Droplets className={`w-3.5 h-3.5 ${loc.selected ? 'text-cyan-300' : 'text-zinc-500'}`} />
                              <span className="font-medium text-[11px]">{loc.name}</span>
                            </div>
                            {loc.selected && <Check className="w-3.5 h-3.5 text-blue-300" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 9: Select Next */}
                  {step.uiMockup.mainContent.type === 'select_next_preview' && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-[10px]">
                        <div className="text-xs font-bold text-white border-b border-zinc-800 pb-1">
                          Setup Summary
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Unit:</span>
                          <span className="text-white font-bold">Building 1 &gt; Unit 104</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Device:</span>
                          <span className="text-white">SI Water Leak &amp; Run Sensor</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Location:</span>
                          <span className="text-cyan-300 font-bold">Master Bathroom Toilet</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-black/40 border border-zinc-800 text-[10px] text-zinc-300 text-center">
                        Confirm configuration and tap <span className="text-blue-400 font-bold">Next</span>.
                      </div>
                    </div>
                  )}

                  {/* Step 10: Power On The Leak Sensor */}
                  {step.uiMockup.mainContent.type === 'power_on_prompt' && (
                    <div className="space-y-2 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-amber-950/70 border border-amber-500/70 flex items-center justify-center text-amber-300">
                        <Zap className="w-7 h-7 animate-bounce" />
                      </div>
                      <div className="text-xs font-bold text-white">Power On Leak Sensor</div>
                      <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-300 leading-relaxed">
                        Pull the plastic battery isolation tab. Sensor LED will flash blue indicating power-on.
                      </div>
                    </div>
                  )}

                  {/* Step 11: Power On Leak Sensor Device Capture */}
                  {step.uiMockup.mainContent.type === 'power_on_video' && (
                    <div className="space-y-2 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-cyan-950/70 border border-cyan-500/70 flex items-center justify-center text-cyan-300">
                        <Volume2 className="w-7 h-7" />
                      </div>
                      <div className="text-xs font-bold text-white">Rock Sensor &amp; Confirm Click</div>
                      <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-300 leading-relaxed">
                        Tilt the sensor in hand. Listen for internal magnetic piston click to verify shuttle mobility.
                      </div>
                      <div className="text-[9px] text-emerald-400 font-mono">
                        ✓ Piston Mobility &amp; Gasket Checked
                      </div>
                    </div>
                  )}

                  {/* Step 12: Then Tap Install */}
                  {step.uiMockup.mainContent.type === 'tap_install' && (
                    <div className="space-y-2.5 text-center">
                      <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                        <Radio className="w-6 h-6 text-blue-400 mx-auto animate-pulse" />
                        <div className="text-xs font-bold text-white">Hub Gateway in Range</div>
                        <div className="text-[10px] text-zinc-400">
                          Signal: -58 dBm (Strong SI-Mesh coverage)
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/40 text-[10px] text-blue-200">
                        Tap <span className="font-bold text-white">Install</span> to bind sensor to Quext Cloud.
                      </div>
                    </div>
                  )}

                  {/* Step 13: Wait For Onboarding */}
                  {step.uiMockup.mainContent.type === 'wait_onboarding' && (
                    <div className="space-y-3 text-center py-1">
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-14 h-14 rounded-full border-4 border-blue-900 border-t-cyan-400 animate-spin" />
                        <Radio className="w-5 h-5 text-cyan-300 absolute inset-0 m-auto" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">Onboarding in Progress...</div>
                        <div className="text-[9px] text-zinc-400">Registering keys with Quext Cloud</div>
                      </div>

                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[85%] animate-pulse" />
                      </div>
                      <div className="text-[8px] text-zinc-500 font-mono">ESTIMATED: 8 SECONDS REMAINING</div>
                    </div>
                  )}

                  {/* Step 14: Then Tap Finish */}
                  {step.uiMockup.mainContent.type === 'tap_finish' && (
                    <div className="space-y-2 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="text-xs font-bold text-white">Installation Successful!</div>
                      <div className="text-[9px] text-zinc-400 max-w-[200px] mx-auto">
                        Water leak sensor registered to Unit 104 • Master Bathroom Toilet.
                      </div>
                    </div>
                  )}

                  {/* Step 15: Device Will Appear Now on Install Device Page */}
                  {step.uiMockup.mainContent.type === 'device_in_list' && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-300">Unit 104 Devices Inventory:</div>
                      <div className="space-y-1">
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="text-white">Quext Smart Thermostat</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded-sm bg-emerald-950 text-emerald-400 font-mono">Online</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="text-white">Schlage Control Lock</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded-sm bg-emerald-950 text-emerald-400 font-mono">Online</span>
                        </div>
                        <div className="p-2 rounded-xl bg-blue-950/80 border-2 border-emerald-500/80 flex items-center justify-between text-[10px] shadow-lg shadow-blue-500/10">
                          <div>
                            <div className="text-white font-bold flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-cyan-400" />
                              <span>Water Leak Sensor</span>
                            </div>
                            <div className="text-[8px] text-blue-300">Master Bathroom Toilet</div>
                          </div>
                          <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Screen Footer Action Button */}
                {step.uiMockup.footerButton && (
                  <button
                    onClick={() => {
                      if (currentAppStepIndex < LEAK_APP_ONBOARDING_STEPS.length - 1) {
                        setCurrentAppStepIndex(currentAppStepIndex + 1);
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>{step.uiMockup.footerButton.label}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Top Header Banner Aligned with onequext.com */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#10172a] to-[#0c101d] border border-zinc-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 border border-purple-500/50 text-purple-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quext IoT Ecosystem</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-300">
                Quext Admin Mobile App
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                15-Step Commissioning SOP
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Quext Admin App: Leak Sensor Onboarding Guide
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
              Step-by-step mobile commissioning guide for onboarding Sensor Industries water leak and toilet run sensors into the Quext Admin App, with centered device mockups, QR barcode optical scanning, and gateway verification.
            </p>
          </div>

          {/* Action Buttons: Printable White & Obsidian Dark PDF */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleDownloadPdf('white', activeTab === 'mechanical_install' ? 'mechanical' : 'app')}
              disabled={isExporting}
              className="px-4 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Printable White PDF</span>
            </button>

            <button
              onClick={() => handleDownloadPdf('dark', activeTab === 'mechanical_install' ? 'mechanical' : 'app')}
              disabled={isExporting}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-cyan-300" />
              <span>Obsidian Dark PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
              title="Print to Paper Binder"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExporting && exportMessage && (
          <div className="mt-4 p-3 rounded-xl bg-purple-950/80 border border-purple-500/60 text-purple-200 text-xs font-semibold flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{exportMessage}</span>
          </div>
        )}
      </div>

      {/* Main Feature Navigation Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('app_onboarding')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'app_onboarding'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>15-Step App Onboarding Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('mechanical_install')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'mechanical_install'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Mechanical Field Installation</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Interactive Flush Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Portal Rules &amp; Diagnostics</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: QUExt ADMIN APP 15-STEP ONBOARDING GUIDE           */}
      {/* ============================================================== */}
      {activeTab === 'app_onboarding' && (
        <div className="space-y-6">
          {/* Exact Screenshots Active Status Bar (Upload Option Removed) */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#101b30] to-[#0d1424] border border-blue-900/60 p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3 text-cyan-400" />
                    <span>Exact Device Mockup Mode</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    <span>Exact Screenshots Centered &amp; Fitted</span>
                  </span>
                  {Object.keys(stepScreenshots).length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/80 border border-blue-500/40 text-blue-300">
                      {Object.keys(stepScreenshots).length} / 15 Slides Loaded
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white">
                  Quext Admin App Exact Screenshots &amp; iPhone 15 Pro Frame
                </h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                  Each step is framed in an iPhone 15 Pro titanium mockup border. All screenshots fill the mockup space edge-to-edge, with calibrated centering applied across all slides and special precision tuning on Slides 7 through 15 (optical barcode decoded, location picker, video hardware actuation, gateway install, and active roster).
                </p>
              </div>

              {Object.keys(stepScreenshots).length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleClearAllScreenshots}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Reset screenshots to high-fidelity simulated app UI"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reset to Native UI</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stepper View / Grid View Sub-Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold">View Style:</span>
              <button
                onClick={() => setAppViewMode('stepper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  appViewMode === 'stepper'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                }`}
              >
                Interactive Stepper Walkthrough
              </button>
              <button
                onClick={() => setAppViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  appViewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                }`}
              >
                All 15 Steps Grid
              </button>
            </div>

            <div className="text-xs text-zinc-400 font-mono">
              Step {currentAppStepIndex + 1} of {LEAK_APP_ONBOARDING_STEPS.length} : {currentAppStep.category}
            </div>
          </div>

          {/* SUB-VIEW A: STEPPER WALKTHROUGH */}
          {appViewMode === 'stepper' && (
            <div className="space-y-6">
              {/* Step indicator bar */}
              <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 overflow-x-auto pb-1">
                {LEAK_APP_ONBOARDING_STEPS.map((step, idx) => {
                  const isCurrent = idx === currentAppStepIndex;
                  const isDone = idx < currentAppStepIndex;
                  return (
                    <button
                      key={step.stepNumber}
                      onClick={() => setCurrentAppStepIndex(idx)}
                      className={`h-11 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                          : isDone
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900 border border-zinc-800/80'
                      }`}
                    >
                      <span className="text-[9px]">S{step.stepNumber}</span>
                      <span className="text-[11px] font-bold">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Showcase Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-3xl bg-[#0c101d] border border-zinc-800 p-6 sm:p-8 shadow-2xl">
                {/* Left Column: Step Details & Protocol */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950/80 border border-purple-500/50 text-purple-300">
                        STEP {currentAppStep.stepNumber} OF 15
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {currentAppStep.category}
                      </span>
                      {currentAppStep.sourceType === 'video_capture' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-500/50 text-amber-300 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video Demo Recentered</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {currentAppStep.title}
                    </h2>
                    <p className="text-sm font-semibold text-cyan-300 leading-relaxed">
                      {currentAppStep.actionText}
                    </p>
                  </div>

                  {/* Summary & Description */}
                  <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Operational Context
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      {currentAppStep.description}
                    </p>
                  </div>

                  {/* Action Steps SOP */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Standard Operating Procedure (SOP):</span>
                    </div>
                    <div className="space-y-2">
                      {currentAppStep.instructions.map((ins, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300"
                        >
                          <span className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{ins}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technician Field Tip */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/40 space-y-1">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Certified Field Technician Tip:</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {currentAppStep.fieldTip}
                    </p>
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => setCurrentAppStepIndex(Math.max(0, currentAppStepIndex - 1))}
                      disabled={currentAppStepIndex === 0}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Step</span>
                    </button>

                    <button
                      onClick={() =>
                        setCurrentAppStepIndex(
                          Math.min(LEAK_APP_ONBOARDING_STEPS.length - 1, currentAppStepIndex + 1)
                        )
                      }
                      disabled={currentAppStepIndex === LEAK_APP_ONBOARDING_STEPS.length - 1}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-purple-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Centered iPhone Mockup */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="text-center mb-3">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                      Quext Admin Mobile Screen
                    </span>
                  </div>
                  {renderIPhoneMockup(currentAppStep)}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW B: ALL 15 STEPS GRID */}
          {appViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEAK_APP_ONBOARDING_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  onClick={() => {
                    setCurrentAppStepIndex(step.stepNumber - 1);
                    setAppViewMode('stepper');
                  }}
                  className="rounded-3xl bg-[#0c101d] border border-zinc-800 p-5 space-y-4 shadow-xl hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
                      Step {step.stepNumber} of 15
                    </span>
                    <span className="text-[10px] text-zinc-400">{step.category}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {step.actionText}
                    </p>
                  </div>

                  <div className="scale-90 -my-4 origin-top">
                    {renderIPhoneMockup(step)}
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
                    <span>View full SOP details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: MECHANICAL FIELD INSTALLATION                      */}
      {/* ============================================================== */}
      {activeTab === 'mechanical_install' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-[#0c101d] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 border border-purple-500/50 text-purple-300">
                PLUMBING FIXTURE COMMISSIONING
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Mechanical Sensor Installation (Toilet &amp; Point-of-Use)
              </h2>
              <p className="text-sm text-zinc-300 max-w-3xl">
                Physical installation steps for mounting the in-line toilet sensor onto the fill valve shank and placing point-of-use flood probes.
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-7 gap-2">
              {TOILET_INSTALLATION_STEPS.map((step, idx) => {
                const isCurrent = idx === currentMechStepIndex;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setCurrentMechStepIndex(idx)}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-purple-400">Step {step.stepNumber}</div>
                    <div className="text-xs font-bold truncate mt-1">{step.phase.split(':')[1] || step.phase}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Mechanical Step */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-zinc-800">
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {currentMechStep.phase}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{currentMechStep.title}</h3>
                  <p className="text-sm text-zinc-300 mt-2">{currentMechStep.summary}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Key Mechanical Actions:
                  </div>
                  {currentMechStep.keyActions.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                {currentMechStep.fieldWarning && (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span><strong>CRITICAL WARNING:</strong> {currentMechStep.fieldWarning}</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4 text-center">
                <div className="text-xs font-mono text-zinc-400 uppercase">Hardware Specification</div>
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-900/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                  <Wrench className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-white">{currentMechStep.hardwareFocus}</div>
                <div className="text-xs text-zinc-400">
                  Estimated Field Time: <span className="text-purple-300 font-bold">{currentMechStep.timeEstimate}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-800 text-[11px] text-zinc-400">
                  Required Tools: {currentMechStep.toolsRequired.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: INTERACTIVE FLUSH SIMULATOR                        */}
      {/* ============================================================== */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cutaway Animated Toilet & Sensor Stage */}
            <div className="lg:col-span-7 rounded-3xl bg-[#0c101d] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Real-Time Hydraulic &amp; RF Stage</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">In-Line Toilet Sensor Simulator</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                      simMagnetUp
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 animate-pulse'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {simMagnetUp ? 'FLOW DETECTED (>0.1 GPM)' : 'STATIC STANDBY (0 GPM)'}
                  </span>
                </div>
              </div>

              {/* Graphic Graphic Cutaway View */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#080d19] to-[#04060b] border border-zinc-800/80 p-6 min-h-[340px] flex flex-col justify-between overflow-hidden">
                {/* Water Tank Simulation */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Toilet Porcelain Tank Level</span>
                    <span className="text-cyan-400 font-bold">{simWaterLevel}%</span>
                  </div>
                  <div className="w-full h-8 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700/80 p-1">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 rounded-lg transition-all duration-300 relative"
                      style={{ width: `${simWaterLevel}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Hydraulic Sensor Body Illustration */}
                <div className="my-6 p-4 rounded-xl bg-black/60 border border-zinc-800 max-w-sm mx-auto w-full text-center space-y-3">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">
                    SI-FLUSH-01 In-Line Sensor Body
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-400">Internal Shuttle</div>
                      <div
                        className={`w-10 h-10 mx-auto rounded-lg border flex items-center justify-center transition-all ${
                          simMagnetUp
                            ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/30 -translate-y-2'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 translate-y-0'
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400">
                        {simMagnetUp ? 'Piston Raised' : 'Piston Seated'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-400">Reed Switch</div>
                      <div
                        className={`w-10 h-10 mx-auto rounded-full border flex items-center justify-center transition-all ${
                          simMagnetUp
                            ? 'bg-purple-900/60 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/30'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                        }`}
                      >
                        <Radio className="w-5 h-5" />
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400">
                        {simMagnetUp ? 'Circuit Closed' : 'Circuit Open'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Trigger */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                  <button
                    onClick={handleTriggerFlush}
                    disabled={isFlushing}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isFlushing ? 'Water Flowing & Flushing...' : 'Simulate Toilet Flush'}</span>
                  </button>

                  <button
                    onClick={() => setSimFlushCount(0)}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Reset Counter"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Gateway Telemetry Dashboard */}
            <div className="lg:col-span-5 rounded-3xl bg-[#0c101d] border border-zinc-800 p-6 space-y-5 shadow-2xl">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                    QUExt CLOUD TELEMETRY
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">Quext Thermostat Hub Feed</h4>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Verified Flushes</div>
                  <div className="text-2xl font-extrabold text-white font-mono">{simFlushCount}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Radio Signal Strength</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">RSSI: -62 dBm | SNR: 9.8 dB</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Last Data Packet</div>
                  <div className="text-xs font-mono text-zinc-300 bg-black/60 p-2.5 rounded-lg border border-zinc-800 overflow-x-auto">
                    {simTelemetrySent
                      ? '{"event":"FLUSH_COMPLETE","duration_sec":42,"gallons":1.28,"status":"OK"}'
                      : '{"event":"STANDBY_HEARTBEAT","batt_v":3.62,"temp_f":71.4}'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: PORTAL RULES & DIAGNOSTICS                         */}
      {/* ============================================================== */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0c101d] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 border border-amber-500/50 text-amber-300">
                FIELD RESOLUTION &amp; ALERTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Quext IoT Portal Automation &amp; Diagnostics
              </h2>
              <p className="text-sm text-zinc-300 max-w-3xl">
                Automated incident rules, instant SMS dispatch rosters, and field troubleshooting protocols for multifamily leak mitigation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PORTAL_AUTOMATION_RULES.triggerTypes.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                      RULE #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                      Automated
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <p className="text-xs text-zinc-300 font-mono text-[11px] bg-black/40 p-2 rounded-lg border border-zinc-800">
                    Threshold: {rule.threshold}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Action: {rule.action}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Quext Cloud Trigger</span>
                    <button
                      onClick={() => handleTriggerTestAlert(rule.name)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-bold text-[10px] cursor-pointer"
                    >
                      Test Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {testAlertSent && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulated SMS &amp; Push Notification dispatched to on-call roster for: {testAlertSent}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
