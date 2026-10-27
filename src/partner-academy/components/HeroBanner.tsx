import React from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSE_MODULES } from '../data/mockData';
import { Award, CheckCircle2, Shield, ArrowRight, Sparkles, Cpu, BookOpen, Scan, Droplets } from 'lucide-react';

interface HeroBannerProps {
  onStartCourse: (moduleId: string) => void;
  onOpenCertModal: () => void;
  onOpenWiringSandbox: () => void;
  onOpenPortalGuide?: () => void;
  onOpenWalletGuide?: () => void;
  onOpenIntegrationChecklists?: () => void;
  onOpenQrIntercomGuide?: () => void;
  onOpenLeakSensorsGuide?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartCourse,
  onOpenCertModal,
  onOpenWiringSandbox,
  onOpenPortalGuide,
  onOpenWalletGuide,
  onOpenIntegrationChecklists,
  onOpenQrIntercomGuide,
  onOpenLeakSensorsGuide,
}) => {
  const { currentUser, currentCompany } = useAuth();

  const totalCourses = COURSE_MODULES.length;
  const passedCourses = COURSE_MODULES.filter((m) => {
    const score = currentUser.quizScores[m.id];
    return score !== undefined && score >= m.quiz.passingScore;
  }).length;

  const totalCompletedLessons = currentUser.completedLessons.length;
  const totalLessonsOverall = COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallPercent = Math.round((totalCompletedLessons / (totalLessonsOverall || 1)) * 100);

  const isCertified = currentUser.certifications.length > 0 || passedCourses === totalCourses;

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-black pt-8 pb-12">
      {/* Quext ambient aurora lighting */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 -z-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-10 -z-10 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Unboxed metadata line */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-zinc-400 font-medium">
              <span className="text-purple-400 font-bold">{currentCompany.name}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">PARTNER ID: {currentCompany.code}</span>
              <span aria-hidden="true">·</span>
              <span>{currentCompany.tier}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Quext Installation Partner Training &amp; Field Education
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              Complete the official OEM installation curricula for <strong>Quext Smart Thermostats (QXT100048)</strong>, <strong>NFC Apple/Google Wallet Access</strong>, commercial <strong>XE360, NDE &amp; BE/FE locks</strong>, <strong>RC Card Reader schematics</strong>, and <strong>Quext Portal Device Provisioning</strong>.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onOpenWalletGuide && (
                <button
                  onClick={onOpenWalletGuide}
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-full shadow-lg shadow-purple-900/30 transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Wallet Upgrade Field Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {onOpenPortalGuide && (
                <button
                  onClick={onOpenPortalGuide}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-purple-300" />
                  <span>Portal Guide Manual</span>
                </button>
              )}

              {onOpenIntegrationChecklists && (
                <button
                  onClick={onOpenIntegrationChecklists}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Integration Checklists</span>
                </button>
              )}

              {onOpenQrIntercomGuide && (
                <button
                  onClick={onOpenQrIntercomGuide}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4 text-purple-400" />
                  <span>QR Intercom Plaque</span>
                </button>
              )}

              {onOpenLeakSensorsGuide && (
                <button
                  onClick={onOpenLeakSensorsGuide}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Leak Sensors</span>
                </button>
              )}

              <button
                onClick={() => onStartCourse('mod_thermostat_onboarding')}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Thermostat Guide</span>
              </button>

              <button
                onClick={() => onStartCourse('mod_rc_card_readers')}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>RC Schematics</span>
              </button>

              <button
                onClick={onOpenCertModal}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 border cursor-pointer ${
                  isCertified
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <Award className={`w-4 h-4 ${isCertified ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{isCertified ? 'Official Credential (Unlocked)' : 'Partner Certification'}</span>
              </button>
            </div>

            {/* Technician Progress Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-zinc-800 max-w-xl shadow-lg mt-2">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Technician Roster: {currentUser.name} ({currentUser.fieldIdNumber})
                </span>
                <span className="font-mono text-purple-300 font-bold tabular-nums">
                  {overallPercent}% Curriculum Progress
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(overallPercent, 5)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <span>
                    <strong className="text-white tabular-nums">{passedCourses}</strong> of{' '}
                    <strong className="text-white tabular-nums">{totalCourses}</strong> Exams Passed
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Passing Score: 80%</span>
                </div>
                {isCertified ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Quext Certified Installer
                  </span>
                ) : (
                  <span className="text-purple-300 font-medium">
                    {totalCourses - passedCourses} courses remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-950 group">
              <img
                src="/src/assets/images/quext_hero_technician_thermostat_1791385383167.jpg"
                alt="Quext Field Installation Engineer Installing Quext Thermostat on Wall"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Boxed Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-md border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="inline-block border border-white px-2 py-0.5 text-white font-extrabold text-xs rounded mb-1">
                    quext
                  </div>
                  <div className="text-sm font-bold text-white">
                    Thermostat Onboarding &amp; Access Controls
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Model QXT100048 · LoRaWAN Gateway · NFC Express Mode
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
