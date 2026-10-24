import React from 'react';
import { useLicense } from '../context/LicenseContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Sparkles,
  Download,
  Building2,
  GraduationCap,
  Layers,
  HelpCircle,
  Scale,
  WifiOff,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'table' | 'browse' | 'quiz' | 'compare' | 'licenses' | 'playstore';
  setActiveTab: (tab: 'table' | 'browse' | 'quiz' | 'compare' | 'licenses' | 'playstore') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onOpenPlayStoreModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenPlayStoreModal
}) => {
  const { activeOrg, currentUser, isLicensed } = useLicense();
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  const handleTabClick = (tab: typeof activeTab) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Top Row: Brand & Status & Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div
            onClick={() => handleTabClick('table')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Science in Realworld
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                  B2B
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Every Element Paired with Real-World Applications
              </p>
            </div>
          </div>

          {/* Right actions: B2B License Badge, Install, Theme, Play Store */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Offline Alert */}
            {!isOnline && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium"
                title="Working offline. All 118 elements and cached licenses are accessible."
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Offline Mode</span>
              </div>
            )}

            {/* B2B License Org Pill */}
            <button
              onClick={() => handleTabClick('licenses')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                isLicensed
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-200'
              }`}
              title="Click to view Organization Group License dashboard"
            >
              {activeOrg?.type === 'school' || activeOrg?.type === 'university' ? (
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span className="max-w-[110px] sm:max-w-[160px] truncate font-semibold">
                {activeOrg ? activeOrg.name : 'Join Group'}
              </span>
              {activeOrg && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-mono">
                  {activeOrg.usedSeats}/{activeOrg.totalSeats}
                </span>
              )}
            </button>

            {/* Android Play Store Package Toolkit */}
            <button
              onClick={onOpenPlayStoreModal}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:brightness-110 active:scale-95 transition"
              title="Google Play Store & Android APK Launch Guide"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Store Kit</span>
            </button>

            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
                title="Install Android App directly"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => handleTabClick('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'table'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Periodic Table
          </button>

          <button
            onClick={() => handleTabClick('browse')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'browse'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>🃏</span>
            Flashcard Browse
          </button>

          <button
            onClick={() => handleTabClick('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'quiz'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            Classroom Quiz
          </button>

          <button
            onClick={() => handleTabClick('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'compare'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-500" />
            Compare
          </button>

          <button
            onClick={() => handleTabClick('licenses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'licenses'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            B2B License Hub
          </button>

          <button
            onClick={() => handleTabClick('playstore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition ${
              activeTab === 'playstore'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-500" />
            Android Play Store
          </button>
        </nav>
      </div>
    </header>
  );
};
