import React, { useState } from 'react';
import { Radio, Wifi, Lock, Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const InteractiveTroubleshooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lorawan' | 'smart_lock' | 'wifi'>('lorawan');

  // LoRaWAN Simulation State
  const [constructionType, setConstructionType] = useState<'concrete' | 'wood_frame' | 'steel_girder'>('concrete');
  const [buildingFloors, setBuildingFloors] = useState<number>(4);
  const [gatewayCount, setGatewayCount] = useState<number>(2);

  // Smart Lock Handing State
  const [doorSwing, setDoorSwing] = useState<'left' | 'right'>('right');
  const [strikeGapMm, setStrikeGapMm] = useState<number>(3); // 3mm is standard
  const [boltTested, setBoltTested] = useState<boolean>(false);

  // Wi-Fi RSSI sweep
  const [distanceFromApFeet, setDistanceFromApFeet] = useState<number>(18);
  const [frequencyBand, setFrequencyBand] = useState<'5GHz' | '2.4GHz'>('5GHz');

  // LoRaWAN Calculations
  const floorLossPerLevel = constructionType === 'concrete' ? 14 : constructionType === 'steel_girder' ? 10 : 6;
  const totalFloorLoss = (buildingFloors / gatewayCount) * floorLossPerLevel;
  const estimatedRssi = Math.round(-65 - totalFloorLoss);
  const isLorawanPassing = estimatedRssi >= -105;

  // Lock Calculations
  const hasBoltBinding = strikeGapMm < 2 || strikeGapMm > 5;
  const motorTorqueMah = hasBoltBinding ? 380 : 95; // mA current draw
  const estimatedBatteryYears = hasBoltBinding ? 0.4 : 2.5;

  // Wi-Fi RSSI Calculations
  const freeSpaceLoss = frequencyBand === '5GHz' ? Math.round(40 + 20 * Math.log10(distanceFromApFeet / 3)) : Math.round(34 + 18 * Math.log10(distanceFromApFeet / 3));
  const wifiRssi = -32 - freeSpaceLoss;
  const isWifiPassing = wifiRssi >= -65;

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Field Verification Suite
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Quext Multifamily Hardware Diagnostic Simulators
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate real field test parameters before submitting unit commissioning audit packages.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('lorawan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'lorawan'
                ? 'bg-blue-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            LoRaWAN RF Riser
          </button>
          <button
            onClick={() => setActiveTab('smart_lock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'smart_lock'
                ? 'bg-blue-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Deadbolt Handing
          </button>
          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'wifi'
                ? 'bg-blue-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Managed Wi-Fi Sweep
          </button>
        </div>
      </div>

      {/* LoRaWAN Tab Content */}
      {activeTab === 'lorawan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Multifamily Property Parameters</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Building Construction</label>
              <select
                value={constructionType}
                onChange={(e) => setConstructionType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="concrete">Post-Tensioned Concrete (High Attenuation)</option>
                <option value="steel_girder">Steel Girder &amp; Metal Decking (Medium)</option>
                <option value="wood_frame">Wood Frame 5-over-1 Podium (Low Attenuation)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Building Floors:</span>
                <span className="font-bold text-white tabular-nums">{buildingFloors} Floors</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={buildingFloors}
                onChange={(e) => setBuildingFloors(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Planned Carrier Gateways:</span>
                <span className="font-bold text-white tabular-nums">{gatewayCount} Gateways</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={gatewayCount}
                onChange={(e) => setGatewayCount(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Calculated Edge Signal Margin
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                  {estimatedRssi} dBm
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isLorawanPassing
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isLorawanPassing ? 'OEM COMPLIANT' : 'GATEWAY DENSITY LOW'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Quext LoRaWAN certification requires a link margin of <strong className="text-slate-200">-105 dBm</strong> or stronger to ensure continuous HVAC telemetry.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Packet Success Probability:</span>
                <span className="font-mono font-bold text-cyan-400 tabular-nums">
                  {isLorawanPassing ? '99.8%' : '84.2%'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                <span>Recommended Action:</span>
                <span className="text-white font-medium">
                  {isLorawanPassing ? 'Deploy in Riser B Center Shaft' : 'Add 1 Additional Gateway'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Lock Tab Content */}
      {activeTab === 'smart_lock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Strike Plate &amp; Alignment Calibrator</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Door Swing Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDoorSwing('left')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    doorSwing === 'left'
                      ? 'bg-blue-600/30 border-cyan-400 text-white font-bold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Left Hand Inswing
                </button>
                <button
                  onClick={() => setDoorSwing('right')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    doorSwing === 'right'
                      ? 'bg-blue-600/30 border-cyan-400 text-white font-bold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Right Hand Inswing
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Strike Plate Centering Clearance:</span>
                <span className="font-bold text-white tabular-nums">{strikeGapMm} mm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={strikeGapMm}
                onChange={(e) => {
                  setStrikeGapMm(parseFloat(e.target.value));
                  setBoltTested(false);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Recommended tolerance: 2.5 mm – 4.0 mm free floating clearance.
              </span>
            </div>

            <button
              onClick={() => setBoltTested(true)}
              className="w-full py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Motor Bolt Throw Cycle</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Motor Current Draw &amp; Battery Telemetry
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                  {motorTorqueMah} mA
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    !hasBoltBinding
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {!hasBoltBinding ? 'SMOOTH STROKE' : 'MOTOR BINDING DETECTED'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                {!hasBoltBinding
                  ? 'The deadbolt extends smoothly without rubbing the strike lip. Battery lifespan exceeds OEM benchmark.'
                  : 'Friction detected! Technician must file the strike plate cavity 1-2mm to avoid draining the 4xAA cells prematurely.'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Estimated AA Battery Life:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {estimatedBatteryYears} Years
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                <span>Audit Status:</span>
                <span
                  className={`font-semibold ${
                    !hasBoltBinding ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {!hasBoltBinding ? 'PASS (Ready for resident keys)' : 'FAIL (Readjust strike plate)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wi-Fi Tab Content */}
      {activeTab === 'wifi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Managed In-Wall AP Signal Verification</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Radio Frequency Band</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFrequencyBand('5GHz')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    frequencyBand === '5GHz'
                      ? 'bg-blue-600/30 border-cyan-400 text-white font-bold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  5 GHz High-Throughput
                </button>
                <button
                  onClick={() => setFrequencyBand('2.4GHz')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    frequencyBand === '2.4GHz'
                      ? 'bg-blue-600/30 border-cyan-400 text-white font-bold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  2.4 GHz IoT Penetration
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Distance from Corridor In-Wall AP:</span>
                <span className="font-bold text-white tabular-nums">{distanceFromApFeet} Feet</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={distanceFromApFeet}
                onChange={(e) => setDistanceFromApFeet(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Resident Corner Coverage Standard
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                  {wifiRssi} dBm
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isWifiPassing
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isWifiPassing ? 'PASS (-65 dBm Standard)' : 'WEAK SIGNAL'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Quext Managed Wi-Fi requires each resident unit living space to maintain -65 dBm or higher on 5 GHz for seamless gigabit roaming.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Estimated Speed:</span>
                <span className="font-mono font-bold text-cyan-400 tabular-nums">
                  {isWifiPassing ? '750 Mbps' : '120 Mbps'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                <span>VLAN Isolation:</span>
                <span className="text-emerald-400 font-semibold">Active &amp; Private</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
