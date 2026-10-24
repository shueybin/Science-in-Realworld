import React, { useState, useEffect } from 'react';
import { ChemicalElement } from './types';
import { ELEMENTS, ELEMENTS_BY_SYM, ELEMENTS_BY_Z } from './data/elementsData';
import { Header } from './components/Header';
import { PeriodicTable } from './components/PeriodicTable';
import { BrowseView } from './components/BrowseView';
import { QuizLab } from './components/QuizLab';
import { CompareElements } from './components/CompareElements';
import { LicensePortal } from './components/LicensePortal';
import { ElementDetailModal } from './components/ElementDetailModal';
import { PlayStoreLauncherModal } from './components/PlayStoreLauncherModal';
import { useLicense } from './context/LicenseContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Sparkles, Smartphone, GraduationCap, ShieldCheck, WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const { activeOrg, isLicensed, activateLicenseKey } = useLicense();
  const isOnline = useOnlineStatus();

  const [activeTab, setActiveTab] = useState<'table' | 'browse' | 'quiz' | 'compare' | 'licenses' | 'playstore'>('table');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('theme_mode');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (_) {}
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('theme_mode', theme);
    } catch (_) {}
  }, [theme]);

  // Handle URL hash changes (e.g. #Li, #Fe, #Au) from user's original HTML functionality
  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || '').replace('#', '').trim().toLowerCase();
      if (hash && ELEMENTS_BY_SYM[hash]) {
        setSelectedElement(ELEMENTS_BY_SYM[hash]);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handle URL search params (e.g. ?license=EDU-OAKRIDGE-2026 or ?tab=quiz)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const licenseParam = params.get('license');
      const tabParam = params.get('tab');

      if (tabParam && ['table', 'browse', 'quiz', 'compare', 'licenses', 'playstore'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }

      if (licenseParam && !isLicensed) {
        // Auto-fill or prompt
        setActiveTab('licenses');
      }
    } catch (_) {}
  }, [isLicensed]);

  const handleSelectElement = (element: ChemicalElement) => {
    setSelectedElement(element);
    try {
      window.history.replaceState(null, '', `#${element.s}`);
    } catch (_) {}
  };

  const handleCloseElementModal = () => {
    setSelectedElement(null);
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* App Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* Offline notice bar if offline */}
        {!isOnline && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-700 dark:text-amber-300">
            <WifiOff className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Offline Mode Active:</strong> All 118 real-world elements, electron Bohr models, quiz modules, and cached institutional licenses are available with zero internet connection.
            </span>
          </div>
        )}

        {/* Tab 1: Periodic Table View */}
        {activeTab === 'table' && (
          <PeriodicTable onSelectElement={handleSelectElement} />
        )}

        {/* Tab 2: 1-by-1 Flashcard Browse */}
        {activeTab === 'browse' && (
          <BrowseView onSelectElement={handleSelectElement} />
        )}

        {/* Tab 3: Chemistry Quiz Lab */}
        {activeTab === 'quiz' && (
          <QuizLab />
        )}

        {/* Tab 4: Side-by-Side Element Comparator */}
        {activeTab === 'compare' && (
          <CompareElements />
        )}

        {/* Tab 5: B2B License Hub */}
        {activeTab === 'licenses' && (
          <LicensePortal />
        )}

        {/* Tab 6: Android Play Store Kit */}
        {activeTab === 'playstore' && (
          <div className="max-w-2xl mx-auto">
            <PlayStoreLauncherModal isOpen={true} onClose={() => setActiveTab('table')} />
          </div>
        )}
      </main>

      {/* Element Detail Drawer / Sheet */}
      <ElementDetailModal
        element={selectedElement}
        onClose={handleCloseElementModal}
        onOpenQuizForElement={(el) => {
          setActiveTab('quiz');
        }}
      />

      {/* Play Store Modal (when triggered from header button) */}
      <PlayStoreLauncherModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      {/* App Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-heading font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
              <span>Science in Realworld – Periodic Table</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400 font-mono">
                B2B Edition
              </span>
            </div>
            <p className="text-[11px] max-w-xl text-slate-400 leading-relaxed">
              Every element paired with its best-known everyday real-world use, inspired by Keith Enevoldsen’s “Periodic Table of the Elements in Pictures and Words”. Direct links: add #{'{symbol}'} to address.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-[11px]">
            <div className="flex items-center justify-center sm:justify-end gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <span>License: {activeOrg?.name || 'Academic Group'}</span>
              <span>·</span>
              <button
                onClick={() => setIsPlayStoreModalOpen(true)}
                className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Smartphone className="w-3 h-3" />
                Play Store Package
              </button>
            </div>
            <div className="text-slate-400">
              Android Play Store TWA & PWA Verified · 100% Offline Chemistry Lab
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
