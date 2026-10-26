import React, { useState } from 'react';
import {
  GATEWAY_GUIDE_METADATA,
  GATEWAY_REQUIRED_MATERIALS,
  GATEWAY_GUIDE_STEPS,
  GatewayGuideStep,
} from '../data/gatewayGuideData';
import { generateAndDownloadGatewayPdf } from '../utils/generateGatewayPdfGuide';
import {
  Radio,
  Download,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Layers,
  Wrench,
  Cable,
  Check,
  ExternalLink,
  Sparkles,
  Maximize2,
  FileText,
  ListChecks,
  HardDrive,
  Info,
} from 'lucide-react';

interface GatewayInstallerGuideProps {
  onOpenCourse?: (moduleId: string) => void;
}

export const GatewayInstallerGuide: React.FC<GatewayInstallerGuideProps> = ({ onOpenCourse }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slides' | 'continuous' | 'materials'>('slides');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Materials Checklist State for technicians on site
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});

  const toggleMaterialCheck = (item: string) => {
    setCheckedMaterials((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleDownloadPdf = (theme: 'white' | 'dark' = 'dark') => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateAndDownloadGatewayPdf(theme);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 200);
  };

  const currentStep: GatewayGuideStep = GATEWAY_GUIDE_STEPS[activeStepIndex] || GATEWAY_GUIDE_STEPS[0];

  // T568B Pinout chart colors
  const t568bPins = [
    { pin: 1, colorName: 'White / Orange', bg: '#ffffff', stripe: '#f97316', text: '#ea580c' },
    { pin: 2, colorName: 'Orange', bg: '#f97316', text: '#ffffff' },
    { pin: 3, colorName: 'White / Green', bg: '#ffffff', stripe: '#16a34a', text: '#15803d' },
    { pin: 4, colorName: 'Blue', bg: '#2563eb', text: '#ffffff' },
    { pin: 5, colorName: 'White / Blue', bg: '#ffffff', stripe: '#2563eb', text: '#1d4ed8' },
    { pin: 6, colorName: 'Green', bg: '#16a34a', text: '#ffffff' },
    { pin: 7, colorName: 'White / Brown', bg: '#ffffff', stripe: '#92400e', text: '#78350f' },
    { pin: 8, colorName: 'Brown', bg: '#78350f', text: '#ffffff' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Document Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono tracking-wider uppercase">
                Official OEM Field Manual
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                {GATEWAY_GUIDE_METADATA.documentCode}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono">
                12 Slide Manual
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Radio className="w-7 h-7 text-purple-400" />
              <span>{GATEWAY_GUIDE_METADATA.title}</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Complete installation standard for the TEKTELIC outdoor LoRaWAN base station: Unistrut backplane, EMT conduit mast, waterproof PoE cable gland, and T568B pinout.
            </p>

            {/* Quick Hotline Bar */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <a
                href="tel:8069933200"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-700/60 font-bold hover:bg-purple-900 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Field Support: {GATEWAY_GUIDE_METADATA.supportHotline}</span>
              </a>
              <span className="text-zinc-500 text-[11px]">
                Hardware: {GATEWAY_GUIDE_METADATA.targetDevice}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenCourse && (
              <button
                type="button"
                onClick={() => onOpenCourse('mod_gateway_installation')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Certification Course</span>
              </button>
            )}

            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={() => handleDownloadPdf('dark')}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Generate Field PDF"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Field PDF'}</span>
            </button>

            <a
              href={GATEWAY_GUIDE_METADATA.downloadPdfPath}
              download="Quext_Smart_Community_Gateway_Installer_Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download OEM Original PDF"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>OEM PDF</span>
            </a>
          </div>
        </div>

        {/* Navigation View Mode Tabs */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'slides'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Slide-by-Slide Deck</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'continuous'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Manual Deck</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('materials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'materials'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Bill of Materials &amp; T568B</span>
            </button>
          </div>

          {/* Quick Step Indicators */}
          {viewMode === 'slides' && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <span>Slide {activeStepIndex + 1} of {GATEWAY_GUIDE_STEPS.length}</span>
              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-zinc-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={activeStepIndex === GATEWAY_GUIDE_STEPS.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(GATEWAY_GUIDE_STEPS.length - 1, prev + 1))}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-zinc-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: SLIDE-BY-SLIDE INTERACTIVE DECK */}
      {viewMode === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Slide Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
              <img
                src={currentStep.slideImage}
                alt={currentStep.stepTitle}
                className="w-full h-auto object-contain max-h-[640px] bg-black cursor-zoom-in"
                onClick={() => setLightboxImage(currentStep.slideImage)}
              />

              {/* Lightbox prompt overlay on hover */}
              <button
                type="button"
                onClick={() => setLightboxImage(currentStep.slideImage)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
              >
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Zoom Slide</span>
              </button>

              {/* Bottom Caption Pill */}
              <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">STEP {currentStep.stepNumber}</span>
                  <span>·</span>
                  <span className="text-purple-300 font-mono">{currentStep.category}</span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Official Quext Slide
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
              {GATEWAY_GUIDE_STEPS.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`shrink-0 w-20 rounded-xl overflow-hidden border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 ring-2 ring-purple-500/30 opacity-100'
                        : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={step.slideImage}
                      alt={step.stepTitle}
                      className="w-full h-12 object-cover bg-black"
                    />
                    <div className="p-1 bg-zinc-900 text-[9px] font-bold text-center truncate text-zinc-300">
                      Step {step.stepNumber}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Step Explanation & Field Notes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                  Step {currentStep.stepNumber} · {currentStep.category}
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {currentStep.stepTitle}
                </h2>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {currentStep.summary}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                {currentStep.bulletPoints.map((bp, bIdx) => (
                  <div
                    key={bp.title}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {bIdx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{bp.title}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          {bp.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning Alert if present */}
              {currentStep.warningAlert && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300">Critical Field Rule</div>
                    <div className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                      {currentStep.warningAlert}
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Tips */}
              {currentStep.proTips && currentStep.proTips.length > 0 && (
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-700/40 text-purple-200 text-xs space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Quext Engineering Pro Tips</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-purple-200/90 list-disc list-inside">
                    {currentStep.proTips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  type="button"
                  disabled={activeStepIndex === GATEWAY_GUIDE_STEPS.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(GATEWAY_GUIDE_STEPS.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors flex items-center gap-1 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CONTINUOUS FULL MANUAL DECK */}
      {viewMode === 'continuous' && (
        <div className="space-y-8">
          {GATEWAY_GUIDE_STEPS.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{step.stepTitle}</h3>
                    <span className="text-xs font-mono text-purple-400">{step.category}</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Slide {idx + 1} of {GATEWAY_GUIDE_STEPS.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-md">
                  <img
                    src={step.slideImage}
                    alt={step.stepTitle}
                    className="w-full h-auto object-contain max-h-[380px] bg-black cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setLightboxImage(step.slideImage)}
                  />
                </div>

                <div className="md:col-span-7 space-y-3">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                    {step.summary}
                  </p>

                  <div className="space-y-2">
                    {step.bulletPoints.map((bp, bIdx) => (
                      <div
                        key={bp.title}
                        className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-xs"
                      >
                        <span className="font-bold text-white mr-1.5">{bIdx + 1}. {bp.title}:</span>
                        <span className="text-zinc-400">{bp.description}</span>
                      </div>
                    ))}
                  </div>

                  {step.warningAlert && (
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step.warningAlert}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: MATERIALS & TOOLS CHECKLIST + T568B PINOUT */}
      {viewMode === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Bill of Materials Checklist */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Installation Bill of Materials (BOM)</h3>
                    <p className="text-xs text-zinc-400">Check off items before leaving for the roof</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60">
                  {Object.values(checkedMaterials).filter(Boolean).length} of {GATEWAY_REQUIRED_MATERIALS.length} Checked
                </span>
              </div>

              <div className="space-y-2">
                {GATEWAY_REQUIRED_MATERIALS.map((mat) => {
                  const isChecked = Boolean(checkedMaterials[mat.item]);
                  return (
                    <div
                      key={mat.item}
                      onClick={() => toggleMaterialCheck(mat.item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-purple-950/30 border-purple-500/50 text-white'
                          : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'text-purple-200 line-through opacity-80' : 'text-white'}`}>
                            {mat.item}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">{mat.purpose}</div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-purple-300 shrink-0">
                        {mat.qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: T568B Pinout Diagram & Verification Hotline */}
          <div className="lg:col-span-5 space-y-4">
            {/* T568B Pinout Reference */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Cable className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">EIA/TIA-568B Pinout Standard</h3>
                  <p className="text-xs text-zinc-400">Strictly required on both gateway &amp; data closet ends</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {t568bPins.map((pin) => (
                  <div
                    key={pin.pin}
                    className="p-2 rounded-lg bg-black/60 border border-zinc-800 flex items-center gap-2.5 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {pin.pin}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-600 shrink-0 shadow-xs"
                        style={{ backgroundColor: pin.bg }}
                      />
                      <span className="font-semibold text-zinc-200 text-[11px] truncate">
                        {pin.colorName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs space-y-1">
                <div className="font-bold text-cyan-300">PoE Power Delivery (802.3af/at)</div>
                <p className="text-[11px] text-cyan-200/90 leading-relaxed">
                  Pins 1, 2, 3, 6 deliver 10/100 Mbps data. Pins 4, 5 (+) and 7, 8 (-) deliver 48V DC power from the PoE injector.
                </p>
              </div>
            </div>

            {/* Support Verification Card */}
            <div className="bg-gradient-to-br from-purple-950/70 to-zinc-900 border border-purple-600/40 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Live On-Site Verification</h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Before packing up your tools, call Quext Support while standing next to the gateway. An engineer will verify gateway heartbeat, packet RSSI, and provision the property IoT mesh.
              </p>

              <div className="p-3 bg-black/50 border border-purple-500/30 rounded-xl text-center">
                <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
                  Direct Field Hotline
                </div>
                <a
                  href="tel:8069933200"
                  className="text-lg font-extrabold text-white hover:text-purple-300 transition-colors block mt-0.5"
                >
                  806-993-3200 · OPTION 4
                </a>
                <div className="text-[10px] text-zinc-400 mt-1">
                  Have Gateway MAC Address &amp; Serial Number ready
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={lightboxImage}
              alt="Gateway Slide Enclosure"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl border border-zinc-700"
            />
            <div className="text-center text-xs text-zinc-400 mt-2 font-mono">
              Click anywhere to close full-size view
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
