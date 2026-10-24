import React, { useState, useEffect } from 'react';
import { ChemicalElement } from '../types';
import { ELEMENTS, CATEGORIES } from '../data/elementsData';
import { useLicense } from '../context/LicenseContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  Printer
} from 'lucide-react';

interface Question {
  prompt: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  element: ChemicalElement;
}

export const QuizLab: React.FC = () => {
  const { activeOrg, currentUser, recordQuizScore } = useLicense();
  const [quizMode, setQuizMode] = useState<'uses' | 'symbols' | 'categories'>('uses');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [certificateReady, setCertificateReady] = useState(false);

  // Generate 10 randomized questions based on quiz mode
  const generateQuestions = (mode: 'uses' | 'symbols' | 'categories') => {
    const shuffledElements = [...ELEMENTS].sort(() => 0.5 - Math.random()).slice(0, 10);
    const generated: Question[] = [];

    shuffledElements.forEach(el => {
      let prompt = '';
      let correctAnswer = '';
      let explanation = '';
      const otherElements = ELEMENTS.filter(e => e.z !== el.z).sort(() => 0.5 - Math.random());

      if (mode === 'uses') {
        prompt = `Which element is known for: "${el.u}"?`;
        correctAnswer = `${el.n} (${el.s})`;
        const distractor1 = `${otherElements[0].n} (${otherElements[0].s})`;
        const distractor2 = `${otherElements[1].n} (${otherElements[1].s})`;
        const distractor3 = `${otherElements[2].n} (${otherElements[2].s})`;
        const options = [correctAnswer, distractor1, distractor2, distractor3].sort(() => 0.5 - Math.random());
        explanation = `${el.n} (Symbol: ${el.s}, Atomic Number: ${el.z}) is used for: ${el.u}.`;
        generated.push({ prompt, correctAnswer, options, explanation, element: el });
      } else if (mode === 'symbols') {
        prompt = `What is the chemical symbol and atomic number for ${el.n}?`;
        correctAnswer = `${el.s} (#${el.z})`;
        const distractor1 = `${otherElements[0].s} (#${otherElements[0].z})`;
        const distractor2 = `${otherElements[1].s} (#${otherElements[1].z})`;
        const distractor3 = `${otherElements[2].s} (#${otherElements[2].z})`;
        const options = [correctAnswer, distractor1, distractor2, distractor3].sort(() => 0.5 - Math.random());
        explanation = `${el.n} has the chemical symbol "${el.s}" and atomic number ${el.z}.`;
        generated.push({ prompt, correctAnswer, options, explanation, element: el });
      } else {
        const catObj = CATEGORIES[el.cat];
        prompt = `Which chemical family does ${el.n} (${el.s}) belong to?`;
        correctAnswer = catObj?.label || 'Metal';
        const otherCats = Object.values(CATEGORIES).filter(c => c.label !== correctAnswer);
        const distractor1 = otherCats[0]?.label;
        const distractor2 = otherCats[1]?.label;
        const distractor3 = otherCats[2]?.label;
        const options = [correctAnswer, distractor1, distractor2, distractor3].sort(() => 0.5 - Math.random());
        explanation = `${el.n} is classified as a ${catObj?.label}.`;
        generated.push({ prompt, correctAnswer, options, explanation, element: el });
      }
    });

    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
    setCertificateReady(false);
  };

  useEffect(() => {
    generateQuestions(quizMode);
  }, [quizMode]);

  const handleSelectAnswer = (option: string) => {
    if (selectedOption !== null) return; // Already answered this question

    setSelectedOption(option);
    const currentQ = questions[currentQIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      // Finished quiz!
      setQuizFinished(true);
      const finalScorePercent = Math.round(((score + (selectedOption === questions[currentQIndex]?.correctAnswer ? 10 : 0)) / 100) * 100);
      recordQuizScore(finalScorePercent);

      if (finalScorePercent >= 70) {
        setCertificateReady(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const currentQ = questions[currentQIndex];
  const finalPercentage = Math.round((score / 100) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-4 py-2">
      {/* Quiz Category Selection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-500" />
              Classroom & Team Chemistry Quiz
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned for {activeOrg?.name || 'Classroom Team'} · Student: {currentUser?.name || 'Guest'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {streak > 1 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-bounce">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                {streak} Streak!
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Score: {score} pts
            </span>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setQuizMode('uses')}
            className={`py-2 px-1 text-xs font-heading font-semibold rounded-xl text-center transition ${
              quizMode === 'uses'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Real-World Uses
          </button>
          <button
            onClick={() => setQuizMode('symbols')}
            className={`py-2 px-1 text-xs font-heading font-semibold rounded-xl text-center transition ${
              quizMode === 'symbols'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Symbols & Numbers
          </button>
          <button
            onClick={() => setQuizMode('categories')}
            className={`py-2 px-1 text-xs font-heading font-semibold rounded-xl text-center transition ${
              quizMode === 'categories'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Chemical Families
          </button>
        </div>
      </div>

      {/* Quiz In-Progress Card */}
      {!quizFinished && currentQ && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-5">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>QUESTION {currentQIndex + 1} OF {questions.length}</span>
            <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentQ.element.i}</span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                {currentQ.prompt}
              </h3>
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === currentQ.correctAnswer;
              const hasAnswered = selectedOption !== null;

              let buttonStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-800 dark:text-slate-100';

              if (hasAnswered) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-semibold';
                } else {
                  buttonStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${buttonStyle}`}
                >
                  <span className="text-sm font-medium">{option}</span>
                  {hasAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation & Next Button */}
          {selectedOption !== null && (
            <div className="pt-2 space-y-3 animate-in fade-in-50">
              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-950 dark:text-cyan-200">
                <strong className="block font-semibold mb-0.5">Explanation:</strong>
                {currentQ.explanation}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-heading font-semibold text-sm hover:opacity-95 transition shadow-md"
              >
                {currentQIndex === questions.length - 1 ? 'Finish & See Results' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Finished Summary & Certificate */}
      {quizFinished && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Outstanding effort, {currentUser?.name || 'Explorer'}!
            </p>
          </div>

          {/* Score Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 max-w-sm mx-auto">
            <div className="text-3xl font-heading font-extrabold text-cyan-600 dark:text-cyan-400">
              {score} / 100
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Grade: {finalPercentage >= 90 ? 'A+ (Mastery)' : finalPercentage >= 75 ? 'A (Proficient)' : finalPercentage >= 50 ? 'B (Passing)' : 'Needs Practice'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Result recorded to institutional roster: {activeOrg?.name}
            </div>
          </div>

          {/* Certificate of Chemistry Achievement */}
          {certificateReady && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-cyan-400 dark:border-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-mono">
                  OFFICIAL INSTITUTION CERTIFICATE
                </span>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Certificate of Real-World Chemistry Mastery
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Awarded to <strong className="text-slate-900 dark:text-white">{currentUser?.name || 'Student'}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white">{activeOrg?.name || 'Classroom'}</strong> for achieving{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">{score}%</strong> in the Real-World Periodic Table Examination.
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>License Key: {activeOrg?.licenseKey}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => generateQuestions(quizMode)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-heading font-semibold text-sm transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Take Another Quiz
            </button>
            {certificateReady && (
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition font-heading font-semibold text-sm"
              >
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
