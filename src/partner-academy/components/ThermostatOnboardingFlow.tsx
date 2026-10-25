import React, { useState } from 'react';
import { Check, X, QrCode, Smartphone, ArrowRight, ArrowLeft, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ThermostatOnboardingFlow: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [scanned, setScanned] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('Unit 101');
  const [installed, setInstalled] = useState<boolean>(false);

  const steps = [
    {
      num: 1,
      title: 'Double check you are using the Quext IOT Admin app',
      subtitle: 'Never use the resident Quext IoT app for onboarding hardware.',
    },
    {
      num: 2,
      title: 'Enter your email and password here, then Login!',
      subtitle: 'Agree to the Terms of Use, Privacy Policy, and EULA.',
    },
    {
      num: 3,
      title: 'Once logged in, tap on the Service gear icon',
      subtitle: 'Located on the bottom navigation bar.',
    },
    {
      num: 4,
      title: 'Select the location your thermostat will be onboarded to',
      subtitle: 'Navigate Community → Building → Unit number.',
    },
    {
      num: 5,
      title: 'Tap on "+ Install device" and select "Thermostat"',
      subtitle: 'Select Thermostat from the device modal.',
    },
    {
      num: 6,
      title: 'Scan QR code found on the back of the thermostat',
      subtitle: 'Place QR barcode in the camera view box.',
    },
    {
      num: 7,
      title: 'Confirm the location is correct and tap Install!',
      subtitle: 'Negotiating cryptographic keys with Quext Cloud.',
    },
    {
      num: 8,
      title: 'Verification: Confirming a successful setup',
      subtitle: 'Transport type: Lora Thermogate · Firmware: 0.73.2',
    },
  ];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-[#090b10] border-2 border-purple-900/60 rounded-2xl p-4 sm:p-7 shadow-2xl text-zinc-100 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            Interactive Onboarding Simulator · QXT100048
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Step {currentStep} of 8: {steps[currentStep - 1].title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{steps[currentStep - 1].subtitle}</p>
        </div>

        {/* Step Progress indicators */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                currentStep === s.num
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : currentStep > s.num
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}
            >
              {currentStep > s.num ? '✓' : s.num}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Device Frame */}
      <div className="max-w-md mx-auto my-6 bg-black border-4 border-zinc-800 rounded-3xl p-4 shadow-2xl overflow-hidden relative min-h-[480px] flex flex-col justify-between">
        {/* Phone Top Notch */}
        <div className="flex justify-between items-center text-[10px] text-zinc-400 pb-2 border-b border-zinc-900 px-2 font-mono">
          <span>11:18</span>
          <div className="w-16 h-3.5 bg-zinc-900 rounded-full" />
          <span>5G 98%</span>
        </div>

        {/* Step 1: App Check */}
        {currentStep === 1 && (
          <div className="py-6 text-center space-y-6">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Verify Correct Mobile Application
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Wrong App */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-red-500/40 relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  ✕
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-300 flex items-center justify-center font-bold text-black text-xl mb-2 shadow">
                  qxt
                </div>
                <span className="text-xs text-zinc-400 font-medium">Quext IoT</span>
                <span className="text-[10px] text-red-400 mt-1 font-semibold">Resident App (NO)</span>
              </div>

              {/* Correct App */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/60 relative flex flex-col items-center ring-1 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  ✓
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#0b101c] border-2 border-cyan-400 flex items-center justify-center font-bold text-white text-xl mb-2 shadow">
                  qxt
                </div>
                <span className="text-xs text-white font-semibold">Quext IoT Admin</span>
                <span className="text-[10px] text-emerald-400 mt-1 font-semibold">Installer App (YES)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed px-2">
              Always double-check your home screen icon before starting work. The resident-facing app will not discover technician commissioning beacons.
            </p>
          </div>
        )}

        {/* Step 2: Login Screen */}
        {currentStep === 2 && (
          <div className="py-4 space-y-4">
            <div className="text-center">
              <div className="inline-block border-2 border-white px-3 py-1 text-white font-bold text-lg rounded mb-2">
                quext
              </div>
              <div className="text-xs text-zinc-400">Admin Portal Authentication</div>
            </div>

            <div className="space-y-3 px-2">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase">Email</label>
                <input
                  type="text"
                  disabled
                  value="raul.recalde@onequext.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase">Password</label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div className="flex items-start gap-2 pt-2 text-[10px] text-zinc-400">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-purple-600" />
                <span>
                  I have read and agree to the Privacy Policy, Terms of Use, and End User License Agreement
                </span>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-lg bg-zinc-700 hover:bg-purple-600 text-white text-xs font-bold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bottom Gear Navigation */}
        {currentStep === 3 && (
          <div className="py-4 space-y-4 flex flex-col justify-between flex-1">
            <div className="space-y-2">
              <div className="text-xs font-bold text-white">My Doors &amp; Units</div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-zinc-900 flex justify-between items-center text-xs">
                  <span>Front Entrance</span>
                  <span className="text-zinc-500">🔒</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 flex justify-between items-center text-xs">
                  <span>Gym &amp; Amenities</span>
                  <span className="text-zinc-500">🔒</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl">
              <div className="text-2xl animate-bounce">⬇️</div>
              <div className="text-xs font-bold text-purple-300 mt-1">
                Tap on the "Service" gear icon on the bottom navigation bar
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="grid grid-cols-4 gap-1 pt-3 border-t border-zinc-800 text-center text-[10px]">
              <div className="text-zinc-500">Home</div>
              <div
                onClick={handleNext}
                className="text-purple-400 font-bold bg-purple-950/60 py-1 rounded cursor-pointer ring-1 ring-purple-400 animate-pulse"
              >
                ⚙️ Service
              </div>
              <div className="text-zinc-500">My Access</div>
              <div className="text-zinc-500">More</div>
            </div>
          </div>
        )}

        {/* Step 4: Select Location */}
        {currentStep === 4 && (
          <div className="py-2 space-y-3">
            <div className="text-xs font-bold text-white border-b border-zinc-800 pb-1.5 flex justify-between items-center">
              <span>Select Location for Service</span>
              <span className="text-[10px] text-purple-400">Building 1</span>
            </div>

            <div className="space-y-1.5 text-xs max-h-64 overflow-y-auto">
              {['Amenities (Common Area)', 'Building 1 > Unit 101', 'Building 1 > Unit 102', 'Building 1 > Unit 201', 'Homebase Office'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    handleNext();
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex justify-between items-center ${
                    selectedLocation === loc
                      ? 'bg-purple-900/40 border-purple-400 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <span>{loc}</span>
                  <span className="text-zinc-500">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Install Device pop-up */}
        {currentStep === 5 && (
          <div className="py-4 space-y-4">
            <div className="text-xs font-bold text-zinc-300">
              Location: <span className="text-white">{selectedLocation}</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-500 py-10">
              No devices currently installed in this space.
            </div>

            {/* Pop-up modal */}
            <div className="p-3 bg-zinc-900 border-2 border-purple-500 rounded-xl space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-purple-300 px-2 py-1">
                Select Device Type:
              </div>
              <div className="p-2 rounded hover:bg-zinc-800 cursor-pointer text-zinc-400">Lock</div>
              <div
                onClick={handleNext}
                className="p-2 rounded bg-purple-600/30 border border-purple-400 text-white font-bold cursor-pointer flex justify-between items-center"
              >
                <span>Thermostat</span>
                <span className="text-purple-300">Selected ✓</span>
              </div>
              <div className="p-2 rounded hover:bg-zinc-800 cursor-pointer text-zinc-400">Hub bridge</div>
              <div className="p-2 rounded hover:bg-zinc-800 cursor-pointer text-zinc-400">Other devices</div>
            </div>
          </div>
        )}

        {/* Step 6: Scan QR Code */}
        {currentStep === 6 && (
          <div className="py-4 text-center space-y-4">
            <div className="text-xs font-bold text-white">Scan Thermostat QR Barcode</div>

            {/* Camera Viewfinder */}
            <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-cyan-400 rounded-2xl flex flex-col items-center justify-center bg-zinc-950/80 p-4">
              <QrCode className="w-16 h-16 text-cyan-400 animate-pulse mb-2" />
              <div className="text-[10px] text-zinc-400">
                Hold phone camera over back QR sticker
              </div>

              {/* Scanning red laser line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </div>

            <button
              onClick={() => {
                setScanned(true);
                handleNext();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
            >
              Simulate Successful QR Scan
            </button>
          </div>
        )}

        {/* Step 7: Confirm & Install */}
        {currentStep === 7 && (
          <div className="py-4 space-y-4">
            <div className="text-xs font-bold text-white">Router to Install</div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Hardware ID</span>
                <span className="font-mono text-cyan-300 font-bold">
                  aa:aa:aa:00:01:00:09:0a
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Install In</span>
                <span className="font-semibold text-white">Unit 101-A</span>
              </div>
            </div>

            <button
              onClick={() => {
                setInstalled(true);
                handleNext();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Install Thermostat
            </button>
          </div>
        )}

        {/* Step 8: Verification Screen */}
        {currentStep === 8 && (
          <div className="py-4 space-y-3">
            <div className="text-center pb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-1" />
              <h4 className="text-base font-bold text-white">Onboarding Complete!</h4>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                COMMISSIONED TO QUEWT CLOUD
              </span>
            </div>

            {/* Device Detail Card from PDF Screenshot */}
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Thermostat</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  ONLINE
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                <span>Device ID:</span>
                <span className="font-mono text-zinc-200">aa:aa:aa:00:01:00:23:e1</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Device name:</span>
                <span className="text-zinc-200">Unit 101_thermostat_23e1</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Firmware version:</span>
                <span className="font-mono text-zinc-200">0.73.2</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Transport type:</span>
                <span className="text-purple-300 font-bold">Lora Thermogate</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-xs">
          <button
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            ‹ Prev Step
          </button>

          <button
            onClick={() => {
              setCurrentStep(1);
              setScanned(false);
              setInstalled(false);
            }}
            className="text-[10px] text-zinc-500 hover:text-zinc-300"
          >
            Reset Simulator
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
          >
            {currentStep === 8 ? 'Finish Module' : 'Next Step ›'}
          </button>
        </div>
      </div>
    </div>
  );
};
