import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSE_MODULES } from '../data/mockData';
import { Award, Download, Printer, ShieldCheck, CheckCircle2, Lock, X, Sparkles, Share2 } from 'lucide-react';

interface CertificateModalProps {
  onClose: () => void;
  onTakeRemainingExams?: () => void;
  subjectName?: string;
  userId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  onClose,
  onTakeRemainingExams,
  subjectName,
  userId,
}) => {
  const { currentUser, currentCompany, generateCertificate, submitQuizScore } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);

  // Check if all modules are passed
  const totalModules = COURSE_MODULES.length;
  const passedCount = COURSE_MODULES.filter((m) => {
    const score = currentUser.quizScores[m.id];
    return score !== undefined && score >= m.quiz.passingScore;
  }).length;

  const isFullyCertified = currentUser.certifications.length > 0 || passedCount === totalModules;
  const certData = generateCertificate(userId);
  const displaySubject = subjectName || (isFullyCertified ? 'Quext Smart Multifamily IoT & Access Hardware Ecosystem' : certData.courseTitle);

  // Instant fast-track for evaluation
  const handleQuickCertifyAll = () => {
    COURSE_MODULES.forEach((mod) => {
      submitQuizScore(mod.id, 96);
    });
  };

  // High-Res Canvas Download as PNG
  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background: Deep obsidian
    ctx.fillStyle = '#080C15';
    ctx.fillRect(0, 0, 2400, 1600);

    // Decorative gradient outer border
    const borderGrad = ctx.createLinearGradient(0, 0, 2400, 1600);
    borderGrad.addColorStop(0, '#3B82F6');
    borderGrad.addColorStop(0.5, '#8B5CF6');
    borderGrad.addColorStop(1, '#06B6D4');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 24;
    ctx.strokeRect(60, 60, 2280, 1480);

    // Inner subtle hairline
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 4;
    ctx.strokeRect(84, 84, 2232, 1432);

    // Radial ambient background glows
    const radial = ctx.createRadialGradient(1200, 400, 50, 1200, 400, 900);
    radial.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
    radial.addColorStop(1, 'rgba(8, 12, 21, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(80, 80, 2240, 1440);

    // Header Logo & Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('quext', 1140, 240);

    ctx.fillStyle = '#06B6D4';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ACADEMY', 1280, 240);

    // Certificate Title
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('OFFICIAL CERTIFIED PARTNER CREDENTIAL', 1200, 340);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 72px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('CERTIFICATE OF QUEXT EXPERTISE', 1200, 450);

    // Recipient Preamble
    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 32px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('THIS IS OFFICIALLY PRESENTED TO', 1200, 570);

    // Recipient Name
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 84px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(certData.technicianName.toUpperCase(), 1200, 680);

    // Partner Company & ID
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${certData.companyName} · Field ID: ${certData.fieldIdNumber}`, 1200, 755);

    // Body Prose with explicit subject passed
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '400 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Has successfully demonstrated technical expertise and satisfied all certification requirements in:`,
      1200,
      860
    );
    ctx.fillText(
      displaySubject,
      1200,
      910
    );

    // Certification Title Bar
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(400, 980, 1600, 100);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 980, 1600, 100);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(displaySubject, 1200, 1045);

    // Metadata Row: Issue Date, Expiry, Exam Score, Credential ID
    ctx.fillStyle = '#64748B';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ISSUED DATE:', 400, 1160);
    ctx.fillText('EXPIRATION DATE:', 750, 1160);
    ctx.fillText('AUDIT SCORE:', 1150, 1160);
    ctx.fillText('CREDENTIAL VERIFICATION ID:', 1450, 1160);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText(certData.issueDate, 400, 1205);
    ctx.fillText(certData.expiryDate, 750, 1205);
    ctx.fillText(`${certData.score}% (VERIFIED)`, 1150, 1205);
    ctx.fillText(certData.certificateId, 1450, 1205);

    // Signatures
    ctx.beginPath();
    ctx.moveTo(400, 1370);
    ctx.lineTo(850, 1370);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'italic bold 34px "Plus Jakarta Sans", cursive';
    ctx.fillText('Raul Recalde', 400, 1345);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Raul Recalde', 400, 1405);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VP of Partner Operations & Training, Quext', 400, 1435);

    // Seal on Right
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.arc(1800, 1350, 90, 0, 2 * Math.PI);
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#06B6D4';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('QUEXT OEM', 1800, 1335);
    ctx.fillText('CERTIFIED', 1800, 1360);
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('PARTNER SEAL', 1800, 1385);

    // Download trigger
    const link = document.createElement('a');
    link.download = `Quext_Certificate_${certData.technicianName.replace(/\s+/g, '_')}_${certData.certificateId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
      <div className="bg-[#0B1120] border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Verified Credential Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Official Partner Installation Certificate
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accredited credentials issued by Quext OEM Training Operations.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadPng}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Hi-Res Certificate</span>
            </button>
          </div>
        </div>

        {/* Candidate Status Notice if not yet certified */}
        {!isFullyCertified && (
          <div className="my-5 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-900/50 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <strong className="block text-amber-300 font-bold">
                  Curriculum Progress: {passedCount} of {totalModules} Exams Passed
                </strong>
                <span>
                  Complete all modules to unlock the verified credential. A provisional preview is shown below.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleQuickCertifyAll}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 font-bold text-xs transition-colors flex items-center gap-1"
                title="Instant pass for reviewer evaluation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fast-Track All Exams</span>
              </button>
            </div>
          </div>
        )}

        {/* The Certificate Canvas Frame */}
        <div
          ref={certRef}
          className="print-area my-6 relative rounded-2xl bg-gradient-to-b from-[#0B101E] via-[#080C15] to-[#0A0F1D] border-2 border-slate-700/80 p-6 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

          {/* Watermark if not certified */}
          {!isFullyCertified && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-4xl sm:text-6xl font-black text-rose-500/15 uppercase -rotate-12 tracking-widest border-4 border-rose-500/20 px-8 py-4 rounded-3xl">
                CANDIDATE PROVISIONAL PREVIEW
              </div>
            </div>
          )}

          {/* Certificate Header */}
          <div className="text-center relative z-20">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">quext</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded">
                ACADEMY
              </span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 mt-1">
              Official Partner Installation &amp; Commissioning Credential
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide mt-2">
              Certificate of Quext Expertise
            </h1>
          </div>

          {/* Certificate Body */}
          <div className="mt-8 text-center relative z-20">
            <div className="text-xs text-slate-400 uppercase tracking-widest">
              This is officially presented to
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 mt-2 tracking-tight">
              {certData.technicianName}
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">
              {certData.companyName} · Field ID: {certData.fieldIdNumber}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Has successfully demonstrated technical expertise, live field wiring competency, and satisfied all Quext OEM certification standards in:
            </p>

            {/* Credential Title Box */}
            <div className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg">
              <div className="text-xs sm:text-sm font-bold text-cyan-300">
                {displaySubject}
              </div>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left relative z-20">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Issue Date</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5">
                {certData.issueDate}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Valid Through</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5">
                {certData.expiryDate}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Exam Score</div>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                {certData.score}% (VERIFIED)
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Certificate ID</div>
              <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5 truncate">
                {certData.certificateId}
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20">
            {/* Signature 1 */}
            <div className="text-left w-full sm:w-auto">
              <div className="font-serif italic text-cyan-400 text-lg sm:text-xl font-bold border-b border-slate-700 pb-1 w-48">
                Raul Recalde
              </div>
              <div className="text-xs font-bold text-white mt-1">Raul Recalde</div>
              <div className="text-[10px] text-slate-400">
                VP of Partner Operations &amp; Training, Quext
              </div>
            </div>

            {/* Holographic Seal */}
            <div className="w-20 h-20 rounded-full border-4 border-cyan-400/80 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 flex flex-col items-center justify-center p-2 text-center shadow-lg shadow-cyan-500/20">
              <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                QUEXT
              </span>
              <Award className="w-5 h-5 text-cyan-300 my-0.5" />
              <span className="text-[7px] font-mono text-slate-300 uppercase tracking-widest font-semibold">
                SEAL
              </span>
            </div>

            {/* QR Verification Node */}
            <div className="text-right w-full sm:w-auto flex items-center justify-end gap-3">
              <div className="text-right">
                <div className="text-[9px] font-mono text-slate-400 uppercase">
                  Digital Verification
                </div>
                <div className="text-[10px] font-mono text-cyan-400 font-bold mt-0.5">
                  onequext.com/verify
                </div>
                <div className="text-[8px] font-mono text-slate-500 mt-0.5">
                  SHA-256 SIGNED
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-black">
                  <path
                    fill="currentColor"
                    d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4 4h4v2h-4v-2zm2-2h2v2h-2v-2zm-6-2h2v2h-2v-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer info */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Certificate valid for 24 months from issue date.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
