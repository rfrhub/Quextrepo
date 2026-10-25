import React, { useState } from 'react';
import { OperationProject } from '../types';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  Building2,
  KeyRound,
  Sliders,
  Radio,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PortalBuildOutModalProps {
  project: OperationProject;
  isOpen: boolean;
  onClose: () => void;
  onSaveToProject?: (updatedProject: OperationProject) => void;
}

export const PortalBuildOutModal: React.FC<PortalBuildOutModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveToProject,
}) => {
  if (!isOpen) return null;

  // Derive initial values from project BOM and customer intake
  const intake = project.customerIntake || {
    pmsSoftware: 'Yardi',
    commonAreaDoors: [],
    staffRoles: [],
  };

  const hasLeakSensors = project.bomItems.some(
    (i) => i.category === 'Sensors & Leak Protection' || i.name.toLowerCase().includes('leak')
  );

  const hasThermostats = project.bomItems.some(
    (i) => i.category === 'Smart Thermostats & HVAC' || i.name.toLowerCase().includes('thermostat')
  );

  const hasAccessControl = project.bomItems.some(
    (i) =>
      i.category === 'Smart Access Control' &&
      (i.name.toLowerCase().includes('reader') ||
        i.name.toLowerCase().includes('intercom') ||
        i.name.toLowerCase().includes('gate') ||
        i.name.toLowerCase().includes('xe360'))
  );

  const hasLocks = project.bomItems.some(
    (i) =>
      i.category === 'Smart Access Control' &&
      (i.name.toLowerCase().includes('lock') || i.name.toLowerCase().includes('deadbolt'))
  );

  const hasGateways = project.bomItems.some(
    (i) => i.category === 'IoT Gateways & Mesh' || i.name.toLowerCase().includes('gateway')
  );

  // Form State corresponding to the 18 PDF Questions
  const [companyName, setCompanyName] = useState<string>(project.clientName || '');
  const [propertyName, setPropertyName] = useState<string>(project.propertyName || '');
  const [sitePhone, setSitePhone] = useState<string>(intake.sitePhoneNumber || '(512) 555-8841');
  const [communityEmail, setCommunityEmail] = useState<string>(intake.communityEmail || 'leasing@property.com');
  const [timeZone, setTimeZone] = useState<string>(intake.timeZone || 'Central Time (CT)');
  const [physicalAddress, setPhysicalAddress] = useState<string>(
    `${project.address}, ${project.city}, ${project.state}`
  );
  const [priorityDating, setPriorityDating] = useState<string>(intake.priorityDating || '2026-10-28');
  const [useLeakSensors, setUseLeakSensors] = useState<boolean>(hasLeakSensors);
  
  // Product ecosystem derived from BOM
  const defaultEcosystem =
    hasLocks && hasThermostats && hasAccessControl
      ? 'Locks and Stats and Access Control'
      : hasLocks && hasAccessControl
      ? 'Unit Locks + Access Control'
      : hasLocks && hasThermostats
      ? 'Unit locks and Stats only'
      : 'Unit Locks Only';
  const [productEcosystem, setProductEcosystem] = useState<string>(defaultEcosystem);

  const defaultConnectivity =
    hasGateways && hasThermostats
      ? 'Gateway with Thermostat'
      : hasGateways
      ? 'Gateway no Thermostat'
      : 'Offline No Gateway';
  const [connectivity, setConnectivity] = useState<string>(defaultConnectivity);

  const [brivoIntegration, setBrivoIntegration] = useState<boolean>(false);
  const [cameras, setCameras] = useState<boolean>(false);
  const [tempRange, setTempRange] = useState<string>(intake.thermostatTempRange || '65°F cool / 75°F heat');
  const [butterflyIntercom, setButterflyIntercom] = useState<boolean>(false);
  const [pmsActive, setPmsActive] = useState<boolean>(intake.pmsSoftware !== 'None');
  const [pmsSoftware, setPmsSoftware] = useState<string>(intake.pmsSoftware || 'Yardi');
  const [propertyNotified, setPropertyNotified] = useState<boolean>(intake.pmsNoticeAcknowledged ?? true);
  const [fireKeys, setFireKeys] = useState<string>(
    intake.fireKeysFobs || 'Knox Box #4 - Master Fobs QXT-FOB-01, QXT-FOB-02'
  );
  const [customGroups, setCustomGroups] = useState<string>(
    intake.customGroupsNotes || 'Group 1: Resident Amenities (Pool, Fitness), Group 2: Service Riser Access'
  );
  const [useNfc, setUseNfc] = useState<boolean>(
    project.useNfcWallet ?? project.communityDetails?.nfcWalletConfigured ?? true
  );
  const [useQrIntercom, setUseQrIntercom] = useState<boolean>(
    project.useQrIntercom ?? project.customerIntake?.useQrIntercom ?? false
  );

  const handleToggleNfc = (checked: boolean) => {
    setUseNfc(checked);
    if (onSaveToProject) {
      onSaveToProject({
        ...project,
        useNfcWallet: checked,
        communityDetails: project.communityDetails
          ? {
              ...project.communityDetails,
              nfcWalletConfigured: checked,
            }
          : undefined,
        customerIntake: {
          ...(project.customerIntake || { pmsSoftware: 'Yardi', commonAreaDoors: [], staffRoles: [] }),
          useNfcWallet: checked,
        },
      });
    }
  };

  const handleToggleQrIntercom = (checked: boolean) => {
    setUseQrIntercom(checked);
    if (onSaveToProject) {
      onSaveToProject({
        ...project,
        useQrIntercom: checked,
        customerIntake: {
          ...(project.customerIntake || { pmsSoftware: 'Yardi', commonAreaDoors: [], staffRoles: [] }),
          useQrIntercom: checked,
        },
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
              <img
                src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png"
                alt="Quext"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Portal Build Out Form</h2>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-mono">
                  Official Launch Spec
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Capturing configuration parameters to launch {project.propertyName} in Quext Portal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 printable-area">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-slate-700 flex items-center justify-between">
            <span>
              Values below are auto-populated from <strong>{project.propertyName}</strong> BOM and customer kickoff intake. You can edit any parameter prior to PDF generation.
            </span>
            <span className="font-mono text-xs font-bold text-sky-800 shrink-0 ml-2">
              Quote #{project.quoteNumber}
            </span>
          </div>

          {/* Form Questions Grid */}
          <div className="space-y-5">
            
            {/* 1. Company Name & 2. Property Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  1. Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="text-[11px] text-slate-500">
                  Parent entity or property management company that manages the property.
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  2. Property Name <span className="text-rose-500">*</span>
                </label>
                <div className="text-[11px] text-slate-500">
                  Name of the site as indicated by the customer.
                </div>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 3. Naming Conventions for Common Areas of Locks */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="font-bold text-slate-900 text-sm">
                3. Naming Conventions for Common Areas of Locks & Master Tracker
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Site Phone Number:</span>
                  <input
                    type="text"
                    value={sitePhone}
                    onChange={(e) => setSitePhone(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Community Email:</span>
                  <input
                    type="text"
                    value={communityEmail}
                    onChange={(e) => setCommunityEmail(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Property Time Zone:</span>
                  <input
                    type="text"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Physical Address:</span>
                  <input
                    type="text"
                    value={physicalAddress}
                    onChange={(e) => setPhysicalAddress(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                  />
                </div>
              </div>

              {/* Common Area Doors List */}
              <div className="mt-2 pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700 text-xs">
                  Common Area Doors Defined in Location Tree ({intake.commonAreaDoors.length} doors):
                </span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {intake.commonAreaDoors.length > 0 ? (
                    intake.commonAreaDoors.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-800 shadow-2xs"
                      >
                        🚪 {d.doorName} {d.buildingOrArea ? `(${d.buildingOrArea})` : ''}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No custom common area doors added yet in Kickoff.</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Priority Dating for Portal */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900">
                4. Priority Dating for Portal
              </label>
              <div className="text-[11px] text-slate-500">
                Helps determine the build out queue priority for engineering.
              </div>
              <input
                type="date"
                value={priorityDating}
                onChange={(e) => setPriorityDating(e.target.value)}
                className="w-64 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            {/* 5. Leak Sensors & 6. Product Ecosystem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-bold text-slate-900">
                  5. Will the property be using leak sensors?
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="leakSensors"
                      checked={useLeakSensors}
                      onChange={() => setUseLeakSensors(true)}
                    />
                    <span>Yes (BOM verified)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="leakSensors"
                      checked={!useLeakSensors}
                      onChange={() => setUseLeakSensors(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-bold text-slate-900">
                  6. Product Ecosystem
                </label>
                <select
                  value={productEcosystem}
                  onChange={(e) => setProductEcosystem(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                >
                  <option value="Locks and Stats and Access Control">Locks and Stats and Access Control</option>
                  <option value="Unit Locks + Access Control">Unit Locks + Access Control</option>
                  <option value="Unit locks and Stats only">Unit locks and Stats only</option>
                  <option value="Unit Locks Only">Unit Locks Only</option>
                </select>
              </div>
            </div>

            {/* 7. Connectivity & 8. Brivo & 9. Cameras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-900">7. Connectivity for Ecosystem</label>
                <select
                  value={connectivity}
                  onChange={(e) => setConnectivity(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-medium text-xs"
                >
                  <option value="Gateway with Thermostat">Gateway with Thermostat</option>
                  <option value="Gateway no Thermostat">Gateway no Thermostat</option>
                  <option value="Offline No Gateway">Offline No Gateway</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-900">8. Brivo System Integration?</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="brivo"
                      checked={brivoIntegration}
                      onChange={() => setBrivoIntegration(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="brivo"
                      checked={!brivoIntegration}
                      onChange={() => setBrivoIntegration(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-900">9. Cameras?</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cameras"
                      checked={cameras}
                      onChange={() => setCameras(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cameras"
                      checked={!cameras}
                      onChange={() => setCameras(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 10. Thermostats Temperature Range & 11. Butterfly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  10. Thermostats Temperature Range
                </label>
                <div className="text-[11px] text-slate-500">
                  Desired temperature range for thermostats on site (e.g. 65°F cool, 75°F heat).
                </div>
                <input
                  type="text"
                  value={tempRange}
                  onChange={(e) => setTempRange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  11. Butterfly Intercom System?
                </label>
                <div className="text-[11px] text-slate-500">
                  Whether integration with ButterflyMX is required on site.
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="butterfly"
                      checked={butterflyIntercom}
                      onChange={() => setButterflyIntercom(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="butterfly"
                      checked={!butterflyIntercom}
                      onChange={() => setButterflyIntercom(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 12, 13, 14. PMS Software Integration */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="font-bold text-slate-900 text-sm">
                PMS Software Integrations (Questions 12, 13, 14)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">12. PMS Integration Active:</span>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pmsActive"
                        checked={pmsActive}
                        onChange={() => setPmsActive(true)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pmsActive"
                        checked={!pmsActive}
                        onChange={() => setPmsActive(false)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500">13. Software Name:</span>
                  <input
                    type="text"
                    value={pmsSoftware}
                    onChange={(e) => setPmsSoftware(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-800 mt-1"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500">14. Property Notified to Connect:</span>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="notified"
                        checked={propertyNotified}
                        onChange={() => setPropertyNotified(true)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="notified"
                        checked={!propertyNotified}
                        onChange={() => setPropertyNotified(false)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 15. Fire Keys & 16. Custom Groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  15. Fire Keys (Fob Numbers)
                </label>
                <div className="text-[11px] text-slate-500">
                  List fob numbers for emergency services and Knox Box.
                </div>
                <input
                  type="text"
                  value={fireKeys}
                  onChange={(e) => setFireKeys(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  16. Custom Groups Needed?
                </label>
                <div className="text-[11px] text-slate-500">
                  Groups and doors to be included in each access tier.
                </div>
                <input
                  type="text"
                  value={customGroups}
                  onChange={(e) => setCustomGroups(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            {/* 17. Staff/Installers User Entry & 18. NFC Wallet Upgrade + QR Intercom Feature */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-bold text-slate-900 text-sm">
                  17. Staff & Installers User Entry ({intake.staffRoles.length} users captured)
                </label>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <label className="inline-flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useNfc}
                      onChange={(e) => handleToggleNfc(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>18a. NFC Wallet Upgrade (Apple/Google Wallet)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useQrIntercom}
                      onChange={(e) => handleToggleQrIntercom(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>18b. QR Intercom Feature</span>
                  </label>
                </div>
              </div>

              <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200">
                {intake.staffRoles.length > 0 ? (
                  intake.staffRoles.map((s) => (
                    <div key={s.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {s.firstName} {s.lastName}
                        </span>{' '}
                        · <span className="text-slate-500">{s.email}</span> ·{' '}
                        <span className="text-slate-500 font-mono">{s.phoneNumber}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                        {s.permissionLevel} Permissions
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-slate-400 italic">No staff entries recorded yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 text-xs">
          <div className="text-slate-500">
            Form verified for Quext Platform Cloud Core provisioning.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
