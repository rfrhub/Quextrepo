import React, { useState } from 'react';
import { CourseModule } from '../types';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, RotateCcw, X, BookOpen, ShieldCheck } from 'lucide-react';

interface QuizModalProps {
  module: CourseModule;
  initialMode?: 'practice_quiz' | 'certification_exam';
  onClose: () => void;
  onViewCertificate: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  initialMode = 'certification_exam',
  onClose,
  onViewCertificate,
}) => {
  const { submitQuizScore } = useAuth();
  const [activeMode, setActiveMode] = useState<'practice_quiz' | 'certification_exam'>(initialMode);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    unlockedCert: boolean;
  } | null>(null);

  const hasPracticeQuiz = Boolean(module.practiceQuiz && module.practiceQuiz.questions.length > 0);
  const currentQuizData = activeMode === 'practice_quiz' && module.practiceQuiz
    ? module.practiceQuiz
    : module.quiz;

  const questions = currentQuizData.questions;
  const passingScore = currentQuizData.passingScore || 80;

  const handleSwitchMode = (mode: 'practice_quiz' | 'certification_exam') => {
    setActiveMode(mode);
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    if (activeMode === 'certification_exam') {
      const { passed, unlockedCert } = submitQuizScore(module.id, calculatedScore);
      setResult({
        score: calculatedScore,
        passed,
        unlockedCert,
      });
    } else {
      // Practice quiz: recorded as practice pass without locking certification unless desired
      setResult({
        score: calculatedScore,
        passed: calculatedScore >= passingScore,
        unlockedCert: false,
      });
    }

    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl relative my-8 text-[#f8fafc]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Mode Switcher */}
        <div className="pb-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
              MODULE {module.number}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {module.code} · {module.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {module.title}
          </h2>

          {/* Tab Switcher: Practice Quiz vs Certification Exam */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => handleSwitchMode('certification_exam')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activeMode === 'certification_exam'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-900/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Certification Exam ({module.quiz.questions.length} Questions · 20 Qs)</span>
            </button>

            {hasPracticeQuiz && (
              <button
                onClick={() => handleSwitchMode('practice_quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  activeMode === 'practice_quiz'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-900/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Lesson Practice Quiz ({module.practiceQuiz?.questions.length} Questions)</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 pt-1">
            {activeMode === 'certification_exam' ? (
              <>
                Passing requirement: <strong className="text-white">{passingScore}% or higher</strong>. Certified score will be permanently stamped on your official partner credential.
              </>
            ) : (
              <>
                Practice check: <strong className="text-white">{questions.length} questions</strong> covering each step across all lessons in this course to reinforce field knowledge retention.
              </>
            )}
          </p>
        </div>

        {/* Exam Results Banner (if submitted) */}
        {submitted && result && (
          <div
            className={`my-6 p-5 rounded-xl border ${
              result.passed
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.passed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-bold">
                    {result.passed
                      ? activeMode === 'certification_exam'
                        ? 'Certification Exam Passed!'
                        : 'Practice Knowledge Check Mastered!'
                      : 'Score Below Passing Threshold'}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    {result.passed
                      ? `Congratulations! You scored ${result.score}% (Passing bar: ${passingScore}%).`
                      : `You scored ${result.score}%. An 80% score is required to maintain Quext OEM partner compliance.`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono tabular-nums">
                  {result.score}%
                </span>
              </div>
            </div>

            {result.unlockedCert && (
              <div className="mt-4 pt-4 border-t border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>All curriculum modules complete! Official Partner Certificate unlocked.</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onViewCertificate();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress Tracker */}
        {!submitted && (
          <div className="my-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <span>
              Progress: <strong className="text-white">{answeredCount}</strong> of <strong className="text-white">{questions.length}</strong> questions answered
            </span>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="my-6 space-y-6 max-h-[55vh] overflow-y-auto pr-2">
          {questions.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = submitted && selectedOpt === q.correctIndex;
            const isWrong = submitted && selectedOpt !== q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-rose-950/20 border-rose-500/40'
                    : selectedOpt !== undefined
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-sm font-bold text-white">
                    <span className="text-cyan-400 mr-1.5 font-mono">Q{qIdx + 1}.</span>
                    {q.question}
                  </div>
                  {submitted && (
                    <div>
                      {isCorrect ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                          CORRECT
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                          INCORRECT
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    const isRightOption = submitted && oIdx === q.correctIndex;

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isRightOption
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 font-semibold'
                            : isSelected
                            ? submitted
                              ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                              : 'bg-blue-600/30 border-cyan-400 text-white font-medium shadow-sm'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation upon submission */}
                {submitted && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <span className="text-cyan-400 font-semibold mr-1">Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          {!submitted ? (
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{activeMode === 'certification_exam' ? 'Submit Exam for Certification' : 'Submit Practice Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{result?.passed ? 'Retake Check' : 'Try Again'}</span>
              </button>
              {activeMode === 'practice_quiz' && (
                <button
                  onClick={() => handleSwitchMode('certification_exam')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Launch 20-Question Exam</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Continue Curriculum
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
