import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CourseModule } from '../types';
import { COURSE_MODULES } from '../data/mockData';
import { Clock, CheckCircle2, BookOpen, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface CourseCurriculumProps {
  onSelectModule: (module: CourseModule) => void;
  onTakeQuiz: (module: CourseModule, mode?: 'practice_quiz' | 'certification_exam') => void;
  onOpenWiringSimulator: () => void;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  onSelectModule,
  onTakeQuiz,
  onOpenWiringSimulator,
}) => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'IoT Infrastructure & Gateways', label: 'IoT Gateways & Mesh' },
    { id: 'Climate & IoT', label: 'Thermostats & IoT' },
    { id: 'Smart Access', label: 'NFC Wallet & Deadbolts' },
    { id: 'Commercial Hardware', label: 'XE360 & NDE Locks' },
    { id: 'Reader Controllers', label: 'RC Readers & Schematics' },
    { id: 'Portal Operations', label: 'Portal & Management' },
  ];

  const filteredModules = COURSE_MODULES.filter((mod) => {
    if (selectedCategory === 'all') return true;
    return mod.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Official Quext Installation Curriculum
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Certified Partner Field Courses
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Direct field guides for Quext Patented Thermostats, Apple/Google NFC Wallet Access, Commercial XE360 &amp; NDE/LE Locks, and official RC Card Reader schematics drawn by Quext Engineering.
          </p>
        </div>

        {/* Category Filter Pills (Button tabs) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const completedLessonsCount = module.lessons.filter((l) =>
            currentUser.completedLessons.includes(l.id)
          ).length;

          const progress = Math.round(
            (completedLessonsCount / (module.lessons.length || 1)) * 100
          );

          const quizScore = currentUser.quizScores[module.id];
          const isPassed = quizScore !== undefined && quizScore >= module.quiz.passingScore;

          return (
            <div
              key={module.id}
              className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/60 transition-all flex flex-col group shadow-xl"
            >
              {/* Hardware Visual Banner */}
              <div className="relative h-44 overflow-hidden bg-zinc-950">
                <img
                  src={module.hardwareImage}
                  alt={module.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" />

                {/* Badge Number */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-black/80 text-purple-300 border border-zinc-700/80 backdrop-blur-sm">
                    COURSE {module.number}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                    {module.code}
                  </span>
                </div>

                {/* Status or Supported Hardware Badge */}
                {isPassed ? (
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-sm flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Passed ({quizScore}%)
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Supported OEM
                  </span>
                )}

                {/* Superimposed Official Hardware Badge */}
                {module.officialDeviceName && (
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-black/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="truncate">{module.officialDeviceName}</span>
                    </span>
                    {module.officialModel && (
                      <span className="text-[9px] font-mono text-zinc-300 bg-zinc-900/90 px-1.5 py-1 rounded-md border border-zinc-700/60 shrink-0">
                        {module.officialModel}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
                    <span className="text-purple-400 font-semibold">{module.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {module.durationMinutes} min
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{module.chapters.length} Chapters</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {module.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {module.shortDescription}
                  </p>

                  {/* Chapters breakdown */}
                  <div className="mt-4 pt-3 border-t border-zinc-900 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Curriculum Chapters ({module.chapters.length})
                    </div>
                    {module.chapters.map((chap, cIdx) => (
                      <div
                        key={chap.id}
                        className="flex items-center justify-between text-xs text-zinc-400"
                      >
                        <span className="truncate pr-2 font-medium">{chap.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {chap.lessons.length} {chap.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bar and buttons */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 font-medium">Progress</span>
                    <span className="font-mono text-purple-300 font-bold tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onSelectModule(module)}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{progress > 0 ? 'Resume Course Lessons' : 'Start Course Lessons'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {module.practiceQuiz && (
                        <button
                          onClick={() => onTakeQuiz(module, 'practice_quiz')}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="15-question knowledge retention check"
                        >
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          <span>Practice Quiz</span>
                        </button>
                      )}

                      <button
                        onClick={() => onTakeQuiz(module, 'certification_exam')}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                          isPassed
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                            : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800'
                        }`}
                        title="20-question comprehensive certification exam"
                      >
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                        <span>{isPassed ? `Exam (${quizScore}%)` : 'Cert Exam (20 Qs)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
