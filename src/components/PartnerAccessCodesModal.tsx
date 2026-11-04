import React, { useState, useMemo, useRef } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building2,
  Search,
  X,
  Mail,
  MapPin,
  FolderGit2,
  Lock,
  PlusCircle,
  Sparkles,
  Key,
  User,
  Trash2,
} from 'lucide-react';
import { OperationProject, buildPartnerAcademyPortalUrl } from '../types';
import {
  loadPartnerSecurityCredentials,
  rotatePartnerSecureCode,
  generateCompanyCodeFromName,
  registerNewPartnerFirm,
  deletePartnerFirm,
  PartnerSecurityCredential,
} from '../partner-academy/utils/partnerSecurity';

interface PartnerAccessCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: OperationProject[];
  onOpenPartnerAcademy?: (partnerShortName?: string) => void;
}

export const PartnerAccessCodesModal: React.FC<PartnerAccessCodesModalProps> = ({
  isOpen,
  onClose,
  projects = [],
  onOpenPartnerAcademy,
}) => {
  const [credentials, setCredentials] = useState<Record<string, PartnerSecurityCredential>>(() =>
    loadPartnerSecurityCredentials()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);

  // Register Partner Firm flow state
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regRegion, setRegRegion] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');
  const [hasManuallyEditedCode, setHasManuallyEditedCode] = useState(false);
  const [recentlyCreatedCred, setRecentlyCreatedCred] = useState<PartnerSecurityCredential | null>(null);
  const randomSuffixRef = useRef<string>(Math.floor(1000000 + Math.random() * 9000000).toString());

  // Real-time project association during registration
  const [selectedProjectIdsForReg, setSelectedProjectIdsForReg] = useState<string[]>([]);
  const [showProjectPickerForReg, setShowProjectPickerForReg] = useState(false);

  // Delete partner state & feedback
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletedFeedback, setDeletedFeedback] = useState<string | null>(null);

  // Sync credentials on open and on updates
  React.useEffect(() => {
    if (isOpen) {
      setCredentials(loadPartnerSecurityCredentials());
      setShowRegisterForm(false);
      setRecentlyCreatedCred(null);
      setConfirmDeleteId(null);
      setDeletedFeedback(null);
      setRegFirstName('');
      setRegLastName('');
      setSelectedProjectIdsForReg([]);
      setShowProjectPickerForReg(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleSync = () => {
      setCredentials(loadPartnerSecurityCredentials());
    };
    window.addEventListener('quext-partner-credentials-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('quext-partner-credentials-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute active projects count per partner
  const projectCountsByPartner = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      const partners = p.integratorPartners || [];
      for (const partner of partners) {
        const norm = partner.trim().toLowerCase();
        counts[norm] = (counts[norm] || 0) + 1;
      }
    }
    return counts;
  }, [projects]);

  // Real-time detection of projects already assigned to company name typed in registration form
  const detectedProjectsForReg = useMemo(() => {
    if (!regName.trim()) return [];
    const q = regName.trim().toLowerCase();
    return projects.filter((p) => {
      const partners = p.integratorPartners || [];
      return partners.some((partner) => {
        const pNorm = partner.trim().toLowerCase();
        return pNorm === q || pNorm.includes(q) || q.includes(pNorm);
      });
    });
  }, [projects, regName]);

  if (!isOpen) return null;

  const credentialsList = Object.values(credentials).sort((a, b) => {
    const timeA = new Date(a.lastGeneratedAt || 0).getTime();
    const timeB = new Date(b.lastGeneratedAt || 0).getTime();
    return timeB - timeA;
  });

  const filteredList = credentialsList.filter((cred) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cred.partnerShortName.toLowerCase().includes(q) ||
      cred.companyName.toLowerCase().includes(q) ||
      cred.secureAccessCode.toLowerCase().includes(q) ||
      cred.legacyCode.toLowerCase().includes(q) ||
      cred.defaultEmail.toLowerCase().includes(q) ||
      cred.region.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = (cred: PartnerSecurityCredential) => {
    navigator.clipboard.writeText(cred.secureAccessCode);
    setCopiedCodeId(cred.companyId);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleCopyLink = (cred: PartnerSecurityCredential) => {
    const url = buildPartnerAcademyPortalUrl(cred.partnerShortName);
    navigator.clipboard.writeText(url);
    setCopiedLinkId(cred.companyId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const handleRotateCode = (companyId: string) => {
    setRotatingId(companyId);
    setTimeout(() => {
      rotatePartnerSecureCode(companyId);
      setCredentials(loadPartnerSecurityCredentials());
      setRotatingId(null);
    }, 400);
  };

  const handleCompanyNameChange = (val: string) => {
    setRegName(val);
    if (!hasManuallyEditedCode && val.trim().length > 0) {
      setRegCode(generateCompanyCodeFromName(val, randomSuffixRef.current));
    } else if (!hasManuallyEditedCode && val.trim().length === 0) {
      setRegCode('');
    }
  };

  const handleGenerateNewCompanyCode = () => {
    randomSuffixRef.current = Math.floor(1000000 + Math.random() * 9000000).toString();
    const generated = generateCompanyCodeFromName(regName || 'New Partner', randomSuffixRef.current);
    setRegCode(generated);
    setHasManuallyEditedCode(false);
  };

  const handleSubmitRegisterFirm = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regCode.trim() || !regEmail.trim()) {
      setRegError('Please provide company name, access code, and technician contact email.');
      return;
    }

    try {
      const newCred = registerNewPartnerFirm({
        companyName: regName.trim(),
        companyCode: regCode.trim(),
        region: regRegion.trim() || 'National Integration',
        defaultEmail: regEmail.trim(),
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
      });

      setCredentials(loadPartnerSecurityCredentials());
      setRecentlyCreatedCred(newCred);
      setShowRegisterForm(false);

      // If user selected projects to assign to this partner during registration, dispatch assignment
      if (selectedProjectIdsForReg.length > 0) {
        window.dispatchEvent(
          new CustomEvent('quext-assign-partner-to-projects', {
            detail: {
              companyName: regName.trim(),
              projectIds: selectedProjectIdsForReg,
            },
          })
        );
      }

      setRegName('');
      setRegCode('');
      setRegFirstName('');
      setRegLastName('');
      setRegRegion('');
      setRegEmail('');
      setSelectedProjectIdsForReg([]);
      setShowProjectPickerForReg(false);
      setHasManuallyEditedCode(false);
    } catch (err: any) {
      setRegError(err?.message || 'Failed to register partner firm.');
    }
  };

  const handleDeletePartner = (cred: PartnerSecurityCredential) => {
    deletePartnerFirm(cred.companyId);
    setCredentials(loadPartnerSecurityCredentials());
    setConfirmDeleteId(null);
    if (recentlyCreatedCred?.companyId === cred.companyId) {
      setRecentlyCreatedCred(null);
    }
    setDeletedFeedback(`Partner firm "${cred.companyName}" was successfully deleted.`);
    setTimeout(() => setDeletedFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b101b] border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative my-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 shrink-0">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Security Vault
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {credentialsList.length} Registered Partners
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 truncate">
                Integrator Partner Access Codes &amp; Logins
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Encrypted high-entropy access credentials and pre-authenticated direct links to supply to integrator contractors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Register Partner Firm Button for PMs */}
            <button
              type="button"
              onClick={() => {
                setShowRegisterForm((prev) => !prev);
                setRecentlyCreatedCred(null);
                setRegError('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                showRegisterForm
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-900/30'
              }`}
              title="Create a new partner firm access code and pre-authenticated direct link"
            >
              {showRegisterForm ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Registration</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register Partner Firm</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recently Created Partner Success Alert */}
        {recentlyCreatedCred && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white block">
                  ✓ Partner Firm Registered: {recentlyCreatedCred.companyName}
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">
                  Secure Access Code: <strong className="text-white">{recentlyCreatedCred.secureAccessCode}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyCode(recentlyCreatedCred)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCodeId === recentlyCreatedCred.companyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCodeId === recentlyCreatedCred.companyId ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopyLink(recentlyCreatedCred)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-emerald-600/50"
              >
                {copiedLinkId === recentlyCreatedCred.companyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLinkId === recentlyCreatedCred.companyId ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRecentlyCreatedCred(null)}
                className="p-1 text-emerald-400 hover:text-white rounded cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Register Partner Firm Form (Moved from LoginModal) */}
        {showRegisterForm ? (
          <form
            onSubmit={handleSubmitRegisterFirm}
            className="my-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0d1424] border border-purple-500/30 shadow-2xl space-y-4 shrink-0 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PM Partner Onboarding Portal</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  Register Partner Firm &amp; Create Access Code
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Company / Firm Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Smart Living or Greg and Sons"
                  value={regName}
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Company Code (Initials + 7 digits) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewCompanyCode}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Generate a new company code"
                  >
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    <span>Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. GAS-4829103"
                    value={regCode}
                    onChange={(e) => {
                      setRegCode(e.target.value.toUpperCase());
                      setHasManuallyEditedCode(true);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-16 py-2 text-xs text-white font-mono uppercase tracking-wider focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateNewCompanyCode}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Used by contractors to authenticate into the Partner Portal.
                </span>
              </div>
            </div>

            {/* Contact Person Name: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lead Contact First Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Marcus"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lead Contact Last Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Vance"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lead Admin / Technician Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="operations@partnerfirm.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Service Region (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Southwest / Arizona or National Integration"
                    value={regRegion}
                    onChange={(e) => setRegRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* REAL-TIME OPERATIONS PROJECT AWARENESS & ASSIGNMENT SECTION */}
            <div className="pt-1">
              {regName.trim() ? (
                detectedProjectsForReg.length > 0 ? (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-bold text-white">
                          ✓ Operations Projects Assigned ({detectedProjectsForReg.length}):
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                        Recognized by Company
                      </span>
                    </div>

                    <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                      We found active operations projects already assigned to &ldquo;{regName}&rdquo;. Registering this partner will immediately grant contractor technicians authenticated access to these communities:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {detectedProjectsForReg.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate">{p.propertyName}</span>
                            <span className="text-[10px] text-slate-400">
                              {p.city}, {p.state} · {p.unitsCount} units
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0 ml-2">
                            {p.statusTag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-300">
                          No operations projects currently assigned to &ldquo;{regName}&rdquo;.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowProjectPickerForReg((prev) => !prev)}
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        {showProjectPickerForReg ? 'Hide Project Picker' : '+ Assign Active Projects Now'}
                      </button>
                    </div>

                    {showProjectPickerForReg && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-400 block">
                          Select existing projects to assign to this partner firm upon registration:
                        </span>
                        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                          {projects.map((p) => {
                            const isChecked = selectedProjectIdsForReg.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-cyan-950/60 border-cyan-500/60 text-white'
                                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      setSelectedProjectIdsForReg((prev) =>
                                        isChecked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                                      )
                                    }
                                    className="w-3.5 h-3.5 rounded text-cyan-500 border-slate-700 bg-slate-900 cursor-pointer shrink-0"
                                  />
                                  <span className="font-semibold truncate">{p.propertyName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">({p.unitsCount}u)</span>
                                </div>
                                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                  {p.city}, {p.state}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : null}
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">⚠</span>
                <span>{regError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/40 cursor-pointer transition-all active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Create Partner Code &amp; Register Firm</span>
              </button>
            </div>
          </form>
        ) : (
          /* Search & Overview Alert */
          <div className="py-4 space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search partner by name, region, access code (e.g. QX-SPR), or technician email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">How Partner Authentication Works:</span>{' '}
                Provide the <strong>Secure Access Code</strong> along with their email, or send the{' '}
                <strong>Copy Partner Link</strong>. When the contractor accesses the portal, they are prompted by the{' '}
                <strong>Company &amp; Role Authentication Portal</strong> to enter their code and email to enter.
              </div>
            </div>
          </div>
        )}

        {/* Deletion feedback banner */}
        {deletedFeedback && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{deletedFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setDeletedFeedback(null)}
              className="text-rose-400 hover:text-rose-200 p-1 cursor-pointer transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Credentials List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredList.map((cred) => {
            const isCodeCopied = copiedCodeId === cred.companyId;
            const isLinkCopied = copiedLinkId === cred.companyId;
            const isRotating = rotatingId === cred.companyId;
            const directUrl = buildPartnerAcademyPortalUrl(cred.partnerShortName);
            const partnerAssignedProjects = projects.filter((p) => {
              const partners = p.integratorPartners || [];
              const qShort = cred.partnerShortName.toLowerCase();
              const qFull = cred.companyName.toLowerCase();
              return partners.some((pt) => {
                const ptNorm = pt.toLowerCase();
                return (
                  ptNorm === qShort ||
                  ptNorm === qFull ||
                  ptNorm.includes(qShort) ||
                  qShort.includes(ptNorm)
                );
              });
            });
            const activeProjectsCount = partnerAssignedProjects.length;

            return (
              <div
                key={cred.companyId}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/90 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Partner Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                      {cred.companyName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950/70 text-purple-300 border border-purple-800/60">
                      {cred.partnerShortName}
                    </span>
                    {activeProjectsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3" />
                        {activeProjectsCount} Ops Project{activeProjectsCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-500 bg-slate-950/60 border border-slate-800">
                        0 Projects
                      </span>
                    )}
                  </div>

                  {/* Assigned Operations Projects Pills */}
                  {partnerAssignedProjects.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3 text-cyan-400" />
                        <span>Assigned Projects:</span>
                      </span>
                      {partnerAssignedProjects.map((proj) => (
                        <span
                          key={proj.id}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/90 text-slate-200 border border-slate-700 flex items-center gap-1"
                        >
                          <span>{proj.propertyName}</span>
                          <span className="text-slate-400 font-mono text-[9px]">({proj.unitsCount}u)</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{cred.defaultEmail}</span>
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cred.region}</span>
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-500">Lead: {cred.leadName}</span>
                  </div>

                  {/* Direct Link Preview */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 font-mono block truncate max-w-lg">
                      Link: {directUrl}
                    </span>
                  </div>
                </div>

                {/* Secure Access Code + Copy Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 md:pl-4 md:border-l border-slate-800">
                  {/* Secure Code Monospace Pill */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/60 border border-purple-500/40">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300 tracking-wider">
                        {cred.secureAccessCode}
                      </span>
                    </div>

                    {/* Copy Code button */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(cred)}
                      className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Copy Secure Access Code"
                    >
                      {isCodeCopied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
                      )}
                    </button>

                    {/* Rotate Code button */}
                    <button
                      type="button"
                      disabled={isRotating}
                      onClick={() => handleRotateCode(cred.companyId)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Rotate & Regenerate Secure Access Code"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(cred)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
                    title="Copy Pre-Authenticated Link with Secure Access Code"
                  >
                    {isLinkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Partner Link</span>
                      </>
                    )}
                  </button>

                  {/* Launch Portal shortcut */}
                  {onOpenPartnerAcademy && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPartnerAcademy(cred.partnerShortName);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer shrink-0"
                      title="Open Partner Academy as this partner"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Partner Action with Inline Confirmation */}
                  {confirmDeleteId === cred.companyId ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs shadow-lg animate-in fade-in duration-150 shrink-0">
                      <span className="text-[11px] font-semibold text-rose-200">Delete firm?</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(cred)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors shadow-sm"
                        title={`Confirm permanent deletion of ${cred.companyName}`}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-1.5 py-1 rounded-lg text-[10px] text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(cred.companyId)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 transition-colors cursor-pointer shrink-0"
                      title={`Delete ${cred.companyName} partner firm and access credentials`}
                      aria-label={`Delete ${cred.companyName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            PM Security Controls: Generate codes for contractor firms and deliver direct portal links.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
