import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { CATEGORIES } from '../data/elementsData';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { useLicense } from '../context/LicenseContext';
import {
  X,
  Volume2,
  VolumeX,
  Bookmark,
  ExternalLink,
  Share2,
  Atom,
  BookOpen,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface Props {
  element: ChemicalElement | null;
  onClose: () => void;
  onOpenQuizForElement?: (element: ChemicalElement) => void;
}

export const ElementDetailModal: React.FC<Props> = ({
  element,
  onClose,
  onOpenQuizForElement
}) => {
  const { currentUser, toggleBookmark } = useLicense();
  const [activeTab, setActiveTab] = useState<'info' | 'bohr'>('info');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!element) return null;

  const category = CATEGORIES[element.cat];
  const isBookmarked = currentUser?.bookmarkedElements.includes(element.z) || false;

  const speakElement = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${element.n}. Atomic number ${element.z}. Symbol ${element.s}. Category: ${category?.label}. Real world use: ${element.u}. ${element.d || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${element.s}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (_) {}
  };

  const thoughtCoUrl = `https://www.thoughtco.com/search?q=${encodeURIComponent(element.n + ' element facts')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category?.color }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {category?.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Pronunciation */}
            <button
              onClick={speakElement}
              className={`p-2 rounded-xl border transition ${
                isSpeaking
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 border-cyan-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Listen to element facts & pronunciation"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-cyan-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Bookmark for Student study list */}
            <button
              onClick={() => toggleBookmark(element.z)}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
              }`}
              title={isBookmarked ? 'Remove from study bookmarks' : 'Add to study bookmarks'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Main Visual Header: Big Symbol & Everyday Use */}
          <div className="text-center">
            <div
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-inner mb-2"
              style={{ backgroundColor: `${category?.color}22` }}
            >
              {element.i}
            </div>
            <div className="text-xs font-mono text-slate-400 font-semibold">
              ATOMIC NUMBER {element.z}
            </div>
            <h2
              className="font-heading font-extrabold text-5xl tracking-tight my-0.5"
              style={{ color: category?.color }}
            >
              {element.s}
            </h2>
            <div className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {element.n}
            </div>

            {/* Real World Everyday Use Banner */}
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-1">
                <span>⭐</span> Real-World Application
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {element.u}
              </p>
            </div>
          </div>

          {/* Tab buttons: Encyclopedia Info vs Bohr Quantum Model */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-heading font-semibold rounded-lg transition ${
                activeTab === 'info'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Encyclopedia & Facts
            </button>
            <button
              onClick={() => setActiveTab('bohr')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-heading font-semibold rounded-lg transition ${
                activeTab === 'bohr'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-cyan-500" />
              Bohr Atom Model
            </button>
          </div>

          {/* View Tab 1: Encyclopedia Overview */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Detailed narrative from HTML data */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Scientific Profile & Characteristics
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {element.d || element.u}
                </p>
              </div>

              {/* Chemical Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Atomic Weight</div>
                  <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {element.weight || '—'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">State at STP</div>
                  <div className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200 mt-0.5">
                    {element.state}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Period (Row)</div>
                  <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {element.r}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Group (Col)</div>
                  <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {element.c}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Tab 2: Interactive Bohr Atomic Model */}
          {activeTab === 'bohr' && (
            <BohrAtomVisualizer element={element} primaryColor={category?.color} />
          )}

          {/* Footer Actions: Share Direct Link & External Resource */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied Direct Link!' : `Direct Link (#${element.s})`}
            </button>

            <a
              href={thoughtCoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              ThoughtCo Facts
            </a>

            {onOpenQuizForElement && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQuizForElement(element);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Practice Quiz on {element.n}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
