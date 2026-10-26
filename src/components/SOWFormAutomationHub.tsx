import React, { useState, useEffect, useMemo } from 'react';
import { GoogleFormSubmission, FieldTechContact } from '../types/sowForm';
import {
  loadSubmissions,
  saveSubmissions,
  addSubmission,
  deleteSubmission,
  DEFAULT_FIELD_TECHS,
  dispatchSowEmailToTech,
  getGoogleAppsScriptWebhookCode,
  getGoogleAppsScriptDirectEmailCode,
} from '../services/sowFormService';
import {
  createSowPdfDocument,
  downloadSowPdf,
  getSowPdfDataUri,
} from '../utils/generateSowPdf';
import {
  FileText,
  Send,
  Download,
  Eye,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  Mail,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  UserCheck,
  Layers,
  MapPin,
  Calendar,
  Phone,
  Truck,
  X,
  Code2,
} from 'lucide-react';

interface SOWFormAutomationHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProject?: (projectId: string) => void;
}

export const SOWFormAutomationHub: React.FC<SOWFormAutomationHubProps> = ({
  isOpen,
  onClose,
}) => {
  const [submissions, setSubmissions] = useState<GoogleFormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'setup' | 'simulator'>('submissions');
  const [selectedSubForPreview, setSelectedSubForPreview] = useState<GoogleFormSubmission | null>(null);
  const [selectedSubForDispatch, setSelectedSubForDispatch] = useState<GoogleFormSubmission | null>(null);
  const [selectedTech, setSelectedTech] = useState<FieldTechContact>(DEFAULT_FIELD_TECHS[0]);
  const [customTechEmail, setCustomTechEmail] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [copiedCodeType, setCopiedCodeType] = useState<'webhook' | 'cloud' | null>(null);

  // Simulator Form State
  const [simCommunity, setSimCommunity] = useState('Meridian Heights at Domain');
  const [simAddress, setSimAddress] = useState('11400 Domain Dr, Austin, TX 78758');
  const [simInstallDate, setSimInstallDate] = useState('2026-11-02');
  const [simPocName, setSimPocName] = useState('Gregory Price');
  const [simPocRole, setSimPocRole] = useState('Lead Facilities Director');
  const [simPocPhone, setSimPocPhone] = useState('(512) 555-3419');
  const [simPocEmail, setSimPocEmail] = useState('gprice@meridianheights.com');
  const [simLocks, setSimLocks] = useState('12 Deadbolts across Building 7: Motor torque error after door settlement.');
  const [simAccess, setSimAccess] = useState('Pedestrian gate south entrance magnetic lock keypad unresponsive.');
  const [simWifi, setSimWifi] = useState('Resident AP 7-102 & 7-104 degraded signal (-88 dBm).');
  const [simThermo, setSimThermo] = useState('Units 708 & 712 thermostats losing WiFi sync.');
  const [simShipping, setSimShipping] = useState<'Yes' | 'No'>('Yes');
  const [simParts, setSimParts] = useState('4x Quext Deadbolt units, 1x Brivo Keypad module');

  // Load submissions and listen for live updates
  const refreshSubmissions = () => {
    // 1. Load from localStorage
    const local = loadSubmissions();

    // 2. Also check the Vite server webhook store if available
    fetch('/api/forms/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.submissions) && data.submissions.length > 0) {
          const map = new Map<string, GoogleFormSubmission>();
          // Combine both, server submissions take priority
          local.forEach((s) => map.set(s.id, s));
          data.submissions.forEach((s: GoogleFormSubmission) => map.set(s.id, s));
          const combined = Array.from(map.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          setSubmissions(combined);
          saveSubmissions(combined);
        } else {
          setSubmissions(local);
        }
      })
      .catch(() => {
        setSubmissions(local);
      });
  };

  useEffect(() => {
    if (isOpen) {
      refreshSubmissions();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => refreshSubmissions();
    window.addEventListener('quext_sow_submissions_updated', handleUpdate);
    return () => window.removeEventListener('quext_sow_submissions_updated', handleUpdate);
  }, []);

  // Webhook host URL
  const webhookHost = window.location.origin;
  const webhookUrl = `${webhookHost}/api/forms/webhook`;

  const copyToClipboard = (text: string, type: 'webhook' | 'cloud') => {
    navigator.clipboard.writeText(text);
    setCopiedCodeType(type);
    setTimeout(() => setCopiedCodeType(null), 2500);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addSubmission({
      source: 'simulator',
      communityName: simCommunity,
      workSiteAddress: simAddress,
      installDate: simInstallDate,
      pocName: simPocName,
      pocTitle: simPocRole,
      pocPhone: simPocPhone,
      pocEmail: simPocEmail,
      unitLocksIssue: simLocks,
      accessControlIssue: simAccess,
      residentWifiIssue: simWifi,
      thermostatsIssue: simThermo,
      equipmentNeedsShipping: simShipping,
      equipmentToShip: simParts,
      shippingRecipient: simPocName,
      shippingPhone: simPocPhone,
      shippingMethod: '2 Day',
    });

    refreshSubmissions();
    setActiveTab('submissions');
    setSelectedSubForPreview(created);
  };

  const handleDispatch = async () => {
    if (!selectedSubForDispatch) return;
    setIsDispatching(true);
    setDispatchSuccessMsg(null);

    const techToUse: FieldTechContact = customTechEmail
      ? {
          id: 'custom-tech',
          name: 'Assigned Field Tech',
          email: customTechEmail.trim(),
          phone: '',
          role: 'Field Technician',
          region: 'Onsite',
        }
      : selectedTech;

    try {
      const res = await dispatchSowEmailToTech({
        submissionId: selectedSubForDispatch.id,
        tech: techToUse,
        customNotes,
      });

      refreshSubmissions();
      setIsDispatching(false);

      if (res.fallback) {
        setDispatchSuccessMsg(
          `SOW PDF downloaded! Since Gmail API was not connected, the PDF has been downloaded for you to email directly to ${techToUse.email}.`
        );
      } else {
        setDispatchSuccessMsg(`Work order and attached SOW PDF successfully sent to ${techToUse.email}!`);
      }

      setTimeout(() => {
        setSelectedSubForDispatch(null);
        setDispatchSuccessMsg(null);
        setCustomNotes('');
      }, 3500);
    } catch (err: any) {
      setIsDispatching(false);
      alert('Error dispatching: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  OneQuext SOW Automation Hub
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Form Listener Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Connected to Google Form • Detects submissions • Generates SOW PDF • Emails Field Tech
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-teal-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Google Form
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'submissions'
                  ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Form Submissions & SOWs
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              Simulate Form Submission
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'setup'
                  ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Google Form Connection & Script
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={refreshSubmissions}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-200 transition text-slate-700"
              title="Refresh submissions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {/* TAB 1: SUBMISSIONS LIST */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Incoming SOW Work Orders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submissions received from the Google Form automatically generate the 2-page OneQuext Scope of Work (SOW) PDF ready for email dispatch.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Test Submission
                  </button>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">No submissions yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    Whenever someone fills out the Google Form, their submission will automatically appear here, generate the filled SOW PDF, and prepare the tech email.
                  </p>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create a Test Submission Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {submissions.map((sub) => {
                    const products: string[] = [];
                    if (sub.unitLocksIssue) products.push('Unit Locks');
                    if (sub.accessControlIssue) products.push('Access Control');
                    if (sub.camerasIssue) products.push('Cameras');
                    if (sub.residentWifiIssue || sub.communityWifiIssue || sub.staffWifiIssue) products.push('Wi-Fi');
                    if (sub.thermostatsIssue) products.push('Thermostats');
                    if (sub.leakSensorsIssue) products.push('Leak Sensors');

                    return (
                      <div
                        key={sub.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {sub.sowReferenceNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                sub.status === 'sent_to_tech'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-sky-100 text-sky-800 border border-sky-200'
                              }`}
                            >
                              {sub.status === 'sent_to_tech' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Dispatched to Tech ({sub.assignedTechName || sub.assignedTechEmail})
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-sky-600" />
                                  SOW Generated (Ready to Send)
                                </>
                              )}
                            </span>
                            <span className="text-xs text-slate-400">
                              Submitted: {new Date(sub.submittedAt).toLocaleDateString()} at{' '}
                              {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900">
                            {sub.communityName}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {sub.workSiteAddress}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-teal-600" />
                              Install Date: {sub.installDate || 'TBD'}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                              POC: {sub.pocName} ({sub.pocTitle || 'Site Contact'}) • {sub.pocPhone}
                            </span>
                          </div>

                          {/* Scope Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-500">Scope:</span>
                            {products.length > 0 ? (
                              products.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Standard Check</span>
                            )}
                            {sub.equipmentNeedsShipping === 'Yes' && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Hardware Shipped ({sub.shippingMethod || 'Ground'})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                          <button
                            onClick={() => setSelectedSubForPreview(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
                            title="Preview 2-Page SOW Document"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            Preview SOW
                          </button>

                          <button
                            onClick={() => downloadSowPdf(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-teal-600" />
                            PDF
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSubForDispatch(sub);
                              setDispatchSuccessMsg(null);
                            }}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition ${
                              sub.status === 'sent_to_tech'
                                ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {sub.status === 'sent_to_tech' ? 'Re-send to Tech' : 'Email to Field Tech'}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove SOW submission for "${sub.communityName}"?`)) {
                                deleteSubmission(sub.id);
                                refreshSubmissions();
                              }
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SIMULATE FORM SUBMISSION */}
          {activeTab === 'simulator' && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Test Google Form Submission Simulator
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in or customize this sample form to immediately generate the OneQuext SOW PDF and test the Field Tech email dispatch workflow.
                </p>
              </div>

              <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      1. Community / Site Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={simCommunity}
                      onChange={(e) => setSimCommunity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      2. Install Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={simInstallDate}
                      onChange={(e) => setSimInstallDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Work Site Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={simAddress}
                    onChange={(e) => setSimAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      4. POC Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={simPocName}
                      onChange={(e) => setSimPocName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      5. POC Title / Role
                    </label>
                    <input
                      type="text"
                      value={simPocRole}
                      onChange={(e) => setSimPocRole(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      6. POC Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={simPocPhone}
                      onChange={(e) => setSimPocPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2">Scope of Work & Device Issues</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Unit Locks Issue Description
                      </label>
                      <textarea
                        rows={2}
                        value={simLocks}
                        onChange={(e) => setSimLocks(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Access Control Issue Description
                      </label>
                      <textarea
                        rows={2}
                        value={simAccess}
                        onChange={(e) => setSimAccess(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Wi-Fi Issue Description
                        </label>
                        <input
                          type="text"
                          value={simWifi}
                          onChange={(e) => setSimWifi(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Thermostats Issue Description
                        </label>
                        <input
                          type="text"
                          value={simThermo}
                          onChange={(e) => setSimThermo(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2">Equipment Shipping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Equipment to be Shipped?
                      </label>
                      <select
                        value={simShipping}
                        onChange={(e) => setSimShipping(e.target.value as 'Yes' | 'No')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Equipment Needed & Quantities
                      </label>
                      <input
                        type="text"
                        value={simParts}
                        onChange={(e) => setSimParts(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('submissions')}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    Submit & Generate SOW PDF
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SETUP & GOOGLE APPS SCRIPT */}
          {activeTab === 'setup' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Architecture Explanation Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      How Google Form Submissions Are Detected & Processed
                    </h3>
                    <p className="text-xs text-slate-500">
                      Two simple ways to connect your live Google Form to this automation app.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                        Method A (Recommended)
                      </span>
                      <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Live Webhook
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      Real-Time Webhook to OneQuext Hub
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Whenever someone submits the Google Form, Google Apps Script posts the answers to this app’s webhook. The SOW PDF is immediately created, previewable, and ready to email with 1 click.
                    </p>
                    <div className="text-[11px] font-mono bg-white p-2.5 rounded-md border border-teal-200 text-slate-800 break-all select-all">
                      {webhookUrl}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Method B
                      </span>
                      <span className="text-[10px] bg-slate-700 text-white font-bold px-2 py-0.5 rounded-full">
                        100% Google Cloud Native
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      Direct GmailApp Dispatch
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Runs 24/7 in Google Cloud without needing a running server. It converts the form responses into the SOW PDF and sends it directly to your Field Tech’s inbox via Gmail.
                    </p>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                      Zero server required • Zero hosting cost
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  60-Second Setup Guide: Installing Script in Your Google Form
                </h4>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Open your Google Form in Google Drive
                      </p>
                      <a
                        href="https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 font-medium inline-flex items-center gap-1 hover:underline mt-0.5"
                      >
                        https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Open the Script Editor
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        In the top-right corner of the Google Form, click the <strong>three vertical dots (⋮)</strong> and select <strong>Script editor</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Paste the script & click Save
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Delete any existing placeholder code in <code className="bg-slate-200 px-1 py-0.5 rounded">Code.gs</code>, paste the code below, and click the <strong>Save (Disk)</strong> icon.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Add the "On form submit" Trigger
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Click the <strong>Clock icon (Triggers)</strong> on the left toolbar → Click <strong>+ Add Trigger</strong> (bottom right) → Set <em>"Choose which function to run"</em> to <strong>onFormSubmit</strong> → Set <em>"Select event type"</em> to <strong>On form submit</strong> → Click <strong>Save</strong>!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Box */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Google Apps Script (Ready to Copy & Paste)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(getGoogleAppsScriptWebhookCode(webhookUrl), 'webhook')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs"
                    >
                      {copiedCodeType === 'webhook' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          Copied Webhook Script!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Webhook Script
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          getGoogleAppsScriptDirectEmailCode('austin.ricks@onequext.com'),
                          'cloud'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      {copiedCodeType === 'cloud' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied Direct Email Script!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Direct Email Script
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="text-[11px] font-mono leading-relaxed text-slate-300 bg-slate-950/70 p-4 rounded-lg overflow-x-auto max-h-80 border border-slate-800">
                  {getGoogleAppsScriptWebhookCode(webhookUrl)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Target Form: <strong>Onsite Visit Scheduling and SOW Information Form</strong>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2-PAGE SOW DOCUMENT PREVIEW MODAL */}
      {/* ============================================================ */}
      {selectedSubForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    OneQuext Scope of Work (SOW) — Document Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSubForPreview.communityName} • Reference: {selectedSubForPreview.sowReferenceNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSowPdf(selectedSubForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    const toDispatch = selectedSubForPreview;
                    setSelectedSubForPreview(null);
                    setSelectedSubForDispatch(toDispatch);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send to Field Tech
                </button>
                <button
                  onClick={() => setSelectedSubForPreview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Render Body - Two Page Layout */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/80 flex flex-col items-center gap-6">
              {/* PAGE 1 PREVIEW */}
              <div
                className="w-full max-w-[680px] bg-white rounded shadow-lg p-10 border border-slate-300 relative text-[11px] leading-normal text-slate-800 select-none"
                style={{ minHeight: '880px', fontFamily: 'Arial, sans-serif' }}
              >
                {/* Header */}
                <div className="text-center mb-1">
                  <h1 className="text-xl font-bold text-[#1B365D] tracking-tight m-0">
                    OneQuext SCOPE OF WORK (SOW)
                  </h1>
                  <p className="text-xs italic text-slate-500 mt-1 mb-3">
                    Technical Installation & Site Work Order
                  </p>
                </div>

                {/* Navy Divider */}
                <div className="h-[2.5px] bg-[#1B365D] w-full mb-3" />

                {/* SOW Meta Box */}
                <div className="border border-[#BCCADB] mb-4">
                  <div className="grid grid-cols-12 border-b border-[#BCCADB] last:border-b-0">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      SOW Reference #:
                    </div>
                    <div className="col-span-8 p-1.5 font-mono text-[10px] text-slate-800">
                      {selectedSubForPreview.sowReferenceNumber}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 border-b border-[#BCCADB] last:border-b-0">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      Date Prepared:
                    </div>
                    <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                      {selectedSubForPreview.datePrepared || new Date().toISOString().split('T')[0]}
                    </div>
                  </div>
                  <div className="grid grid-cols-12">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      Prepared By:
                    </div>
                    <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                      {selectedSubForPreview.preparedBy || 'Quext Field Operations & Google Form Intake'}
                    </div>
                  </div>
                </div>

                {/* SITE & PROJECT IDENTIFICATION */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    SITE & PROJECT IDENTIFICATION
                  </div>
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Community / Site Name:
                      </div>
                      <div className="col-span-8 p-1.5 font-bold text-[10px] text-slate-900">
                        {selectedSubForPreview.communityName}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Work Site Address:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.workSiteAddress}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Install Date:
                      </div>
                      <div className="col-span-8 p-1.5 font-bold text-[10px] text-teal-700">
                        {selectedSubForPreview.installDate || 'TBD'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Product / Equipment:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        Smart Locks, Gate Access Control, Community Wi-Fi, Thermostats, IoT Sensors
                      </div>
                    </div>
                  </div>
                </div>

                {/* POINT OF CONTACT (POC) */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    POINT OF CONTACT (POC)
                  </div>
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        POC Name:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800 font-semibold">
                        {selectedSubForPreview.pocName}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        POC Title / Role:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.pocTitle || 'Site Contact'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        POC Phone Number:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800 font-medium">
                        {selectedSubForPreview.pocPhone}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        POC Email Address:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.pocEmail}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Alternate Contact:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.alternateContact || 'None provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROJECT OVERVIEW */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    PROJECT OVERVIEW
                  </div>
                  <p className="text-[10px] text-slate-700 mb-2 leading-relaxed">
                    Field installation and technical service order for <strong>{selectedSubForPreview.communityName}</strong> scheduled for <strong>{selectedSubForPreview.installDate || 'the requested deployment window'}</strong>. The certified field technician will conduct targeted onsite diagnostics, hardware installation, firmware provisioning, and cloud gateway verification for reported systems.
                  </p>
                  <p className="text-[10px] text-slate-700">
                    <strong className="text-[#1B365D]">Equipment:</strong> Smart Deadbolts, Zigbee Gateways, Access Control Boards, Thermostats
                  </p>
                </div>

                {/* EQUIPMENT OVERVIEW & SCOPE OF WORK */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    EQUIPMENT OVERVIEW & SCOPE OF WORK
                  </div>
                  <div className="border border-[#BCCADB]">
                    {selectedSubForPreview.unitLocksIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Unit Locks Scope:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          {selectedSubForPreview.unitLocksIssue}
                        </div>
                      </div>
                    )}

                    {selectedSubForPreview.accessControlIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Access Control Scope:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          {selectedSubForPreview.accessControlIssue}
                        </div>
                      </div>
                    )}

                    {selectedSubForPreview.camerasIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Cameras Scope:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          {selectedSubForPreview.camerasIssue}
                        </div>
                      </div>
                    )}

                    {(selectedSubForPreview.residentWifiIssue || selectedSubForPreview.communityWifiIssue) && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Wi-Fi Scope:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          {selectedSubForPreview.residentWifiIssue || selectedSubForPreview.communityWifiIssue}
                        </div>
                      </div>
                    )}

                    {selectedSubForPreview.thermostatsIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Thermostats Scope:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          {selectedSubForPreview.thermostatsIssue}
                        </div>
                      </div>
                    )}

                    {selectedSubForPreview.equipmentNeedsShipping === 'Yes' && (
                      <div className="grid grid-cols-12">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          Equipment Shipping:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                          <strong>Shipped:</strong> {selectedSubForPreview.equipmentToShip || 'Hardware Kit'} ({selectedSubForPreview.shippingMethod || 'Ground'})<br />
                          <strong>Recipient:</strong> {selectedSubForPreview.shippingRecipient || selectedSubForPreview.pocName}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-4 left-10 right-10 flex justify-between text-[9px] text-slate-400 border-t border-slate-200 pt-2">
                  <span>OneQuext Scope of Work • Confidential</span>
                  <span>Page 1 of 2</span>
                </div>
              </div>

              {/* PAGE 2 PREVIEW */}
              <div
                className="w-full max-w-[680px] bg-white rounded shadow-lg p-10 border border-slate-300 relative text-[11px] leading-normal text-slate-800 select-none"
                style={{ minHeight: '880px', fontFamily: 'Arial, sans-serif' }}
              >
                {/* COMMUNICATION METHOD WHILE ONSITE */}
                <div className="mb-5">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    COMMUNICATION METHOD WHILE ONSITE
                  </div>
                  <p className="text-[10px] text-slate-600 mb-3">
                    Indicate how the on-site technician(s) should communicate with the project team, POC, and/or support desk during the engagement.
                  </p>

                  <div className="grid grid-cols-4 gap-2 mb-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB] flex items-center justify-center font-bold text-[9px] text-[#1B365D]">
                        X
                      </span>
                      <span>Cell Phone</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB]" />
                      <span>Radio</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB] flex items-center justify-center font-bold text-[9px] text-[#1B365D]">
                        X
                      </span>
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB] flex items-center justify-center font-bold text-[9px] text-[#1B365D]">
                        X
                      </span>
                      <span>Text/SMS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB]" />
                      <span>Conferencing App (Teams/Zoom)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB]" />
                      <span>Walkie-Talkie/PTT</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border border-[#BCCADB]" />
                      <span>Other: —</span>
                    </div>
                  </div>

                  {/* Comm Table */}
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Primary Contact Method:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.primaryContactMethod || 'Cell Phone & Text/SMS'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Backup Contact Method:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.backupContactMethod || 'Email to Site POC'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Check-in Frequency:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.checkInFrequency || 'Upon site arrival and before leaving site'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Escalation Contact:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.escalationContact || 'Quext Field Operations Desk (888-555-QXT)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DOCUMENTATION REQUIREMENTS */}
                <div className="mb-6">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-2">
                    DOCUMENTATION REQUIREMENTS
                  </div>
                  <ol className="text-[10px] text-slate-700 space-y-1.5 pl-4 list-decimal">
                    <li>
                      <strong>Pre-Installation Documentation:</strong> Complete high-resolution photos of initial unit locks, access panels, thermostat wiring, and cable terminations before initiating any disassembly.
                    </li>
                    <li>
                      <strong>Device Asset Tracking:</strong> Accurately record all installed and replaced MAC addresses, serial numbers, firmware revisions, and unit numbers in the Quext Field Portal.
                    </li>
                    <li>
                      <strong>Functional Testing & Validation:</strong> Verify live telemetry on the OneQuext Cloud Dashboard for every repaired or newly commissioned device (Locks, Thermostats, APs, Leak Sensors).
                    </li>
                    <li>
                      <strong>Tenant Respect & Site Cleanliness:</strong> Ensure all debris, wire trimmings, and old hardware packaging are neatly cleaned and removed from resident units and common facilities.
                    </li>
                    <li>
                      <strong>Scope Change & Escalation:</strong> Any deviations from the initial work order or pre-existing site damages must be documented with photos and approved by the Project Manager before proceeding.
                    </li>
                  </ol>
                </div>

                {/* APPROVAL / SIGN-OFF */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    APPROVAL / SIGN-OFF
                  </div>
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-2.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Technician Name / Signature:
                      </div>
                      <div className="col-span-8 p-2.5 text-[10px] text-slate-400 italic">
                        {selectedSubForPreview.assignedTechName
                          ? `${selectedSubForPreview.assignedTechName} (Onsite Sign-Off Pending)`
                          : '____________________________________ (Signature)'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-2 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Date:
                      </div>
                      <div className="col-span-8 p-2 text-[10px] text-slate-400">
                        ____ / ____ / ________
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-2.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        POC Name / Signature:
                      </div>
                      <div className="col-span-8 p-2.5 text-[10px] text-slate-600 font-medium">
                        {selectedSubForPreview.pocName} (Property Walkthrough Verification)
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-2 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Date:
                      </div>
                      <div className="col-span-8 p-2 text-[10px] text-slate-400">
                        ____ / ____ / ________
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-10 right-10 flex justify-between text-[9px] text-slate-400 border-t border-slate-200 pt-2">
                  <span>OneQuext Scope of Work • Confidential</span>
                  <span>Page 2 of 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DISPATCH TO FIELD TECH MODAL */}
      {/* ============================================================ */}
      {selectedSubForDispatch && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Email SOW to Field Tech
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSubForDispatch.communityName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubForDispatch(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {dispatchSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Dispatched Successfully</h4>
                    <p className="text-xs mt-1">{dispatchSuccessMsg}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Work Order:</span>
                      <strong className="text-slate-800 font-mono">
                        {selectedSubForDispatch.sowReferenceNumber}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Install Date:</span>
                      <strong className="text-teal-700">
                        {selectedSubForDispatch.installDate || 'TBD'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Site Contact:</span>
                      <strong className="text-slate-800">
                        {selectedSubForDispatch.pocName} ({selectedSubForDispatch.pocPhone})
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Attachment:</span>
                      <span className="font-semibold text-teal-700 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        OneQuext_SOW.pdf (2 Pages)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Select Assigned Field Tech
                    </label>
                    <select
                      value={selectedTech.id}
                      onChange={(e) => {
                        const found = DEFAULT_FIELD_TECHS.find((t) => t.id === e.target.value);
                        if (found) setSelectedTech(found);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-teal-600"
                    >
                      {DEFAULT_FIELD_TECHS.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} — {tech.role} ({tech.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Or Custom Field Tech Email:
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. technician@contractor.com"
                      value={customTechEmail}
                      onChange={(e) => setCustomTechEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Dispatcher Notes / Specific Instructions (Optional):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Please enter via the leasing office side door. Call Marcus 15 minutes before arrival."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedSubForDispatch(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDispatch}
                      disabled={isDispatching}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition shadow-xs disabled:opacity-50"
                    >
                      {isDispatching ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sending Email & PDF...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Work Order to Tech
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
