import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { OperationProject, buildPartnerAcademyPortalUrl } from '../types';
import {
  loadPartnerSecurityCredentials,
  savePartnerSecurityCredentials,
  rotatePartnerSecureCode,
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

  // Sync credentials on open
  React.useEffect(() => {
    if (isOpen) {
      setCredentials(loadPartnerSecurityCredentials());
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  const credentialsList = Object.values(credentials);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b101b] border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative my-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 shrink-0">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Security Vault
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {credentialsList.length} Registered Partners
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Integrator Partner Access Codes &amp; Logins
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Encrypted high-entropy access credentials and pre-authenticated direct links to supply to integrator contractors.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Overview Alert */}
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
              <strong>Copy Partner Link</strong>. When the contractor accesses the portal, they are automatically authenticated and locked to their organization—user switching and impersonation are permanently disabled in Partner Academy.
            </div>
          </div>
        </div>

        {/* Credentials List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredList.map((cred) => {
            const isCodeCopied = copiedCodeId === cred.companyId;
            const isLinkCopied = copiedLinkId === cred.companyId;
            const isRotating = rotatingId === cred.companyId;
            const directUrl = buildPartnerAcademyPortalUrl(cred.partnerShortName);
            const activeProjectsCount = projectCountsByPartner[cred.partnerShortName.toLowerCase()] || 0;

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
                    {activeProjectsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3" />
                        {activeProjectsCount} Ops Project{activeProjectsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

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
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            Codes generated using high-entropy SHA-resistant tokens. Legacy 3-digit codes remain supported as fallback.
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
