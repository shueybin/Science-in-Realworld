import React, { useState, useEffect } from 'react';
import { ChemicalElement } from '../types';
import { SORTED_ELEMENTS, CATEGORIES } from '../data/elementsData';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { useLicense } from '../context/LicenseContext';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Atom,
  BookOpen,
  Shuffle
} from 'lucide-react';

interface Props {
  initialIndex?: number;
  onSelectElement: (element: ChemicalElement) => void;
}

export const BrowseView: React.FC<Props> = ({ initialIndex = 0, onSelectElement }) => {
  const { currentUser, toggleBookmark } = useLicense();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showBohr, setShowBohr] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const element = SORTED_ELEMENTS[currentIndex] || SORTED_ELEMENTS[0];
  const category = CATEGORIES[element.cat];
  const isBookmarked = currentUser?.bookmarkedElements.includes(element.z) || false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < SORTED_ELEMENTS.length - 1) {
        setCurrentIndex(i => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < SORTED_ELEMENTS.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * SORTED_ELEMENTS.length);
    setCurrentIndex(randomIndex);
  };

  const speakElement = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${element.n}. Symbol ${element.s}, atomic number ${element.z}. Used for: ${element.u}. ${element.d || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 py-2">
      {/* Top Quick Actions Bar */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
          ELEMENT {element.z} OF 118
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            title="Random Element"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-500" />
            <span>Random</span>
          </button>
          <button
            onClick={() => toggleBookmark(element.z)}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Bookmark for study"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={speakElement}
            className={`p-1.5 rounded-lg border transition ${
              isSpeaking
                ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 border-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Listen to pronunciation and facts"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-cyan-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        {/* Category Accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: category?.color }}
        />

        {/* View toggle (Info card vs Bohr orbital) */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button
            onClick={() => setShowBohr(!showBohr)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
              showBohr
                ? 'bg-cyan-500 text-white border-cyan-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>{showBohr ? 'View Card' : 'Bohr Atom'}</span>
          </button>
        </div>

        {showBohr ? (
          <div className="my-2">
            <BohrAtomVisualizer element={element} primaryColor={category?.color} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Realworld Icon Badge */}
            <div
              className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-inner mt-2"
              style={{ backgroundColor: `${category?.color}22` }}
            >
              {element.i}
            </div>

            {/* Atomic Number & Symbol */}
            <div>
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                Atomic Number {element.z}
              </span>
              <h1
                className="font-heading font-extrabold text-6xl tracking-tight my-1"
                style={{ color: category?.color }}
              >
                {element.s}
              </h1>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {element.n}
              </h2>
              <span
                className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${category?.color}18`,
                  color: category?.color,
                  border: `1px solid ${category?.color}40`
                }}
              >
                {category?.label}
              </span>
            </div>

            {/* Real-world Application Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-1">
                Everyday Real-World Application
              </span>
              <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {element.u}
              </p>
            </div>

            {/* Encyclopedia Description */}
            <div className="text-left p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
                About {element.n}
              </span>
              {element.d || element.u}
            </div>

            {/* Inspect Detail Button */}
            <button
              onClick={() => onSelectElement(element)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-heading font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition shadow-sm"
            >
              Open Full Chemical Dossier & Quiz
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons: Prev & Next */}
      <div className="flex items-center justify-between gap-3 px-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-heading font-semibold text-sm text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-98 transition shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === SORTED_ELEMENTS.length - 1}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-heading font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-95 active:scale-98 transition shadow-md"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Slider */}
      <div className="space-y-1.5 px-2">
        <input
          type="range"
          min={0}
          max={SORTED_ELEMENTS.length - 1}
          value={currentIndex}
          onChange={e => setCurrentIndex(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>H (1)</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {currentIndex + 1} / {SORTED_ELEMENTS.length}
          </span>
          <span>Og (118)</span>
        </div>
      </div>
    </div>
  );
};
