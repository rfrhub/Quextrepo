import React, { useState } from 'react';
import { CourseModule, Lesson } from '../types';
import { COURSE_MODULES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { EngineeringSchematicViewer } from './EngineeringSchematicViewer';
import { ThermostatOnboardingFlow } from './ThermostatOnboardingFlow';
import { InteractiveWiringSimulator } from './InteractiveWiringSimulator';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, ArrowLeft, Mail, ExternalLink, HelpCircle, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

interface LessonViewerProps {
  module: CourseModule;
  onBack: () => void;
  onTakeQuiz: (mode?: 'practice_quiz' | 'certification_exam') => void;
  onSelectNextModule?: (nextModule: CourseModule) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  module,
  onBack,
  onTakeQuiz,
  onSelectNextModule,
}) => {
  const { currentUser, completeLesson } = useAuth();

  const [activeLessonId, setActiveLessonId] = useState<string>(
    module.lessons[0]?.id || ''
  );
  const [showOverview, setShowOverview] = useState<boolean>(true);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  const currentLesson: Lesson =
    module.lessons.find((l) => l.id === activeLessonId) || module.lessons[0];

  const totalLessonsInModule = module.lessons.length;
  const completedLessonsInModule = module.lessons.filter((l) =>
    currentUser.completedLessons.includes(l.id)
  ).length;

  const modulePercent = Math.round(
    (completedLessonsInModule / (totalLessonsInModule || 1)) * 100
  );

  const currentIndex = module.lessons.findIndex((l) => l.id === currentLesson.id);
  const isLastLessonInModule = currentIndex === module.lessons.length - 1;

  const currentModuleIndex = COURSE_MODULES.findIndex((m) => m.id === module.id);
  const nextModule =
    currentModuleIndex >= 0 && currentModuleIndex < COURSE_MODULES.length - 1
      ? COURSE_MODULES[currentModuleIndex + 1]
      : null;

  const toggleChapter = (chapId: string) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chapId]: !prev[chapId],
    }));
  };

  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteCurrentLesson = () => {
    completeLesson(currentLesson.id, module.id);

    if (!isLastLessonInModule) {
      const nextLesson = module.lessons[currentIndex + 1];
      setActiveLessonId(nextLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last lesson in this course! Advance to next course if available
      if (nextModule && onSelectNextModule) {
        onSelectNextModule(nextModule);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Last lesson of final course -> open certification exam
        onTakeQuiz('certification_exam');
      }
    }
  };

  const isCurrentLessonDone = currentUser.completedLessons.includes(currentLesson.id);

  return (
    <div className="bg-[#000000] text-[#f8fafc] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[800px]">
      {/* Sidebar matching user's exact Course Content Navigation */}
      <aside className="w-full md:w-80 bg-[#0a0a0a] border-r border-zinc-800/80 flex flex-col shrink-0">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="text-[#f8fafc] hover:text-purple-400 font-semibold text-sm flex items-center gap-1.5 p-5 pb-3 transition-colors border-b border-zinc-900 cursor-pointer"
        >
          <span>❮</span>
          <span>Back to All Courses</span>
        </button>

        {/* Course Header */}
        <div className="p-5 flex justify-between items-center text-lg font-bold border-b border-zinc-800">
          <span className="truncate pr-2">{module.title}</span>
          <span className="text-zinc-500 font-light text-xl">+</span>
        </div>

        {/* Overview Toggle */}
        <div
          onClick={() => setShowOverview(!showOverview)}
          className="p-4 font-semibold text-sm cursor-pointer border-b border-zinc-800/80 flex justify-between items-center hover:bg-[#161616] transition-colors"
        >
          <span>Course Overview</span>
          <span className="text-zinc-400 text-xs">
            {showOverview ? '⌃' : '⌄'}
          </span>
        </div>

        {showOverview && (
          <div className="p-4 text-xs text-zinc-400 bg-[#050505] border-b border-zinc-800/80 leading-relaxed space-y-2">
            <p>{module.overview}</p>
            <div className="pt-2 text-[11px] text-purple-400 font-mono">
              SPEC CODE: {module.code} · {module.category}
            </div>
          </div>
        )}

        {/* Chapters & Lessons List */}
        <div className="flex-1 overflow-y-auto py-2">
          {module.chapters.map((chapter) => {
            const isCollapsed = collapsedChapters[chapter.id];

            return (
              <div key={chapter.id} className="border-b border-zinc-900">
                {/* Chapter Header */}
                <div
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex justify-between items-center px-5 py-3.5 cursor-pointer hover:bg-[#161616] transition-colors text-sm font-semibold text-zinc-200"
                >
                  <span className="truncate pr-2">{chapter.title}</span>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCollapsed ? '⌄' : '⌃'}</span>
                  </div>
                </div>

                {/* Lesson List */}
                {!isCollapsed && (
                  <div className="border-l-2 border-zinc-800 ml-5 my-1">
                    {chapter.lessons.map((lesson) => {
                      const isActive = lesson.id === currentLesson.id;
                      const isCompleted = currentUser.completedLessons.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonSelect(lesson.id)}
                          className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer transition-colors text-xs ${
                            isActive
                              ? 'bg-purple-900/15 border-l-2 border-[#9333ea] -ml-[2px] font-semibold text-white'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161616]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            readOnly
                            className="w-4 h-4 rounded accent-[#9333ea] pointer-events-none shrink-0"
                          />
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Exam & Practice Actions */}
        <div className="p-4 border-t border-zinc-800 bg-[#050505] space-y-2">
          {module.practiceQuiz && (
            <button
              onClick={() => onTakeQuiz('practice_quiz')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Practice Knowledge Check (15 Qs)</span>
            </button>
          )}

          <button
            onClick={() => onTakeQuiz('certification_exam')}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Launch Certification Exam (20 Qs)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#000000] p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Bar Progress */}
          <div className="flex flex-col items-center pb-6 border-b border-zinc-800">
            <div className="w-full flex items-center gap-3 text-xs font-semibold text-zinc-400 font-mono">
              <span className="text-purple-400 font-bold tabular-nums">
                {modulePercent}%
              </span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${modulePercent}%` }}
                />
              </div>
              <span>Progress · Lesson {currentIndex + 1} of {totalLessonsInModule}</span>
            </div>
          </div>

          {/* Lesson Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#c084fc] border-b border-zinc-800 pb-4 tracking-tight">
            {module.title} - {currentLesson.title}
          </h2>

          {/* Supported Hardware Badge in Lesson Header */}
          {module.officialDeviceName && (
            <div className="flex items-center justify-between gap-3 p-3 bg-zinc-950/90 border border-zinc-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <img
                  src={module.hardwareImage}
                  alt={module.officialDeviceName}
                  className="w-12 h-12 object-cover rounded-lg border border-cyan-500/40 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Target Supported Hardware
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{module.officialDeviceName}</span>
                    {module.officialModel && (
                      <span className="text-[11px] font-mono text-zinc-400 font-normal">
                        ({module.officialModel})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded hidden sm:inline-flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Quext Certified Hardware
              </span>
            </div>
          )}

          {/* Hardware Reference Spotlight */}
          {currentLesson.hardwareImageCallout && (
            <div className="my-5 bg-gradient-to-r from-zinc-950 via-[#0c0d14] to-zinc-950 border-2 border-purple-500/40 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-full sm:w-52 h-44 shrink-0 rounded-xl overflow-hidden bg-black/80 border border-zinc-800 shadow-inner">
                <img
                  src={currentLesson.hardwareImageCallout.imageUrl}
                  alt={currentLesson.hardwareImageCallout.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
                  {currentLesson.hardwareImageCallout.badge || 'Official Hardware'}
                </div>
              </div>
              <div className="flex-1 space-y-2 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-500/50">
                    {currentLesson.hardwareImageCallout.deviceModel}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Quext Hardware
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {currentLesson.hardwareImageCallout.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentLesson.hardwareImageCallout.description}
                </p>
              </div>
            </div>
          )}

          {/* Lesson Brief Box */}
          <div className="bg-purple-950/20 border-l-4 border-[#9333ea] p-4 sm:p-5 rounded-r-xl my-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-1">
              Lesson Brief
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentLesson.brief}
            </p>
          </div>

          {/* Intro Paragraph */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {currentLesson.introParagraph}
          </p>

          {/* Embedded Interactive Schematics when present */}
          {currentLesson.schematicData && (
            <EngineeringSchematicViewer
              schematicType={currentLesson.schematicDiagram}
              schematicData={currentLesson.schematicData}
            />
          )}

          {/* Embedded Thermostat Onboarding Simulator when present */}
          {currentLesson.type === 'interactive_onboarding' && (
            <ThermostatOnboardingFlow onComplete={handleCompleteCurrentLesson} />
          )}

          {/* Embedded Wiring Simulator when present */}
          {currentLesson.type === 'interactive_wiring' && (
            <div className="my-6">
              <InteractiveWiringSimulator onComplete={handleCompleteCurrentLesson} />
            </div>
          )}

          {/* Step List with bold prefixes */}
          {currentLesson.stepList && currentLesson.stepList.length > 0 && (
            <ul className="space-y-4 my-6 pl-4 border-l border-zinc-800">
              {currentLesson.stepList.map((step, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {step.label && (
                    <strong className="text-white block font-bold mb-0.5">
                      {step.label}:
                    </strong>
                  )}
                  <span>{step.text}</span>

                  {step.subSteps && (
                    <ul className="mt-2 pl-4 space-y-1 list-disc list-inside text-zinc-400 text-xs">
                      {step.subSteps.map((sub, sIdx) => (
                        <li key={sIdx}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Technical Specs Table if present */}
          {currentLesson.specs && (
            <div className="my-6 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden text-xs">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 font-bold text-white">
                Technical Specification Ledger
              </div>
              <div className="divide-y divide-zinc-800/80">
                {currentLesson.specs.map((sp, idx) => (
                  <div key={idx} className="px-4 py-2.5 flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">{sp.label}</span>
                    <span className="text-purple-300 font-mono font-bold">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Alert in amber */}
          {currentLesson.alertWarning && (
            <div className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-amber-200 text-xs sm:text-sm leading-relaxed my-6 font-medium">
              <strong className="text-amber-400 block font-bold uppercase tracking-wider mb-1">
                Warning / Deletion Protocol:
              </strong>
              {currentLesson.alertWarning}
            </div>
          )}

          {/* Info Box in purple */}
          {currentLesson.infoBox && (
            <div className="p-4 sm:p-5 rounded-xl bg-purple-950/20 border-l-4 border-[#9333ea] text-purple-200 text-xs sm:text-sm leading-relaxed my-6 font-medium">
              <strong className="text-purple-300 block font-bold uppercase tracking-wider mb-1">
                Field Pro Tip:
              </strong>
              {currentLesson.infoBox}
            </div>
          )}

          {/* Support Block */}
          <div className="text-center p-8 sm:p-12 bg-[#111111] border-2 border-dashed border-[#9333ea] rounded-2xl my-8">
            <p className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-semibold mb-2">
              Direct OEM Escalation Line
            </p>
            <a
              href="mailto:support@onequext.com"
              className="text-2xl sm:text-4xl font-extrabold text-[#c084fc] hover:text-white transition-colors tracking-tight block break-all font-mono"
            >
              support@onequext.com
            </a>
            <span className="text-[11px] text-zinc-500 mt-2 block">
              Quext Field Support Operations · Dallas, TX / Kansas City, MO
            </span>
          </div>

          {/* Primary Navigation & Next Course Controls */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleCompleteCurrentLesson}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-blue-600 via-[#9333ea] to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-purple-900/40 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLastLessonInModule ? (
                nextModule ? (
                  <>
                    <span>Complete Course &amp; Advance to Course {nextModule.number}: {nextModule.title}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Complete Final Course &amp; Launch Certification Exam</span>
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )
              ) : isCurrentLessonDone ? (
                <>
                  <span>Next Lesson ›</span>
                </>
              ) : (
                <>
                  <span>Complete &amp; Continue ›</span>
                </>
              )}
            </button>

            {/* Additional Learning Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {module.practiceQuiz && (
                <button
                  onClick={() => onTakeQuiz('practice_quiz')}
                  className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Take Practice Knowledge Check (15 Qs)</span>
                </button>
              )}

              <button
                onClick={() => onTakeQuiz('certification_exam')}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-purple-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Take Certification Exam (20 Qs)</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
