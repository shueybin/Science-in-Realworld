import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Copy,
  Terminal,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Layers,
  FileCode2,
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreLauncherModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2500);
    } catch (_) {}
  };

  const bubblewrapCommand = `npm install -g @bubblewrap/cli
bubblewrap init --manifest=${window.location.origin}/manifest.webmanifest
bubblewrap build`;

  const assetLinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.scienceinrealworld.periodictable",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7D:0F:52:AB:FC:0E:D4:57:9D:69:B8:31:0C:8A:2A:42:0B:4A:A5:68:1A:18:23:44:03:97:F2:70:E2"
      ]
    }
  }
]`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg">
                Google Play Store & Android App Launch Kit
              </h3>
              <p className="text-xs text-white/80">
                PWA / TWA Production Packaging & School Device Deployment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-slate-800 dark:text-slate-200">
          {/* Quick Direct Install Option */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>One-Tap Android App Installation</span>
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Install as a standalone WebAPK directly on your device. Launches from your home screen or app drawer with 100% offline support.
              </p>
            </div>

            {isInstalled ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs font-bold whitespace-nowrap">
                App Installed
              </span>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {isIOS ? 'Safari: Share -> Add to Home' : 'Installed / Ready in Browser'}
              </span>
            )}
          </div>

          {/* Android Play Store Specifications */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              Play Store Application Metadata
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-mono text-[10px] uppercase">Package Name</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  com.scienceinrealworld.periodictable
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-mono text-[10px] uppercase">Target Platform</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  Android 15 (API Level 35) & TWA
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-mono text-[10px] uppercase">Category</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  Education / Science / Reference
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-mono text-[10px] uppercase">Content Rating</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  Everyone (All Ages) · COPPA Compliant
                </div>
              </div>
            </div>
          </div>

          {/* Google Play Store Packaging CLI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                Build Android .AAB with Google Bubblewrap
              </h4>
              <button
                onClick={() => copyToClipboard(bubblewrapCommand, 'bubblewrap')}
                className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
              >
                <Copy className="w-3 h-3" />
                {copiedSection === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {bubblewrapCommand}
            </pre>
          </div>

          {/* Digital Asset Links Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-cyan-500" />
                Digital Asset Links (/public/.well-known/assetlinks.json)
              </h4>
              <button
                onClick={() => copyToClipboard(assetLinksJson, 'assetlinks')}
                className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
              >
                <Copy className="w-3 h-3" />
                {copiedSection === 'assetlinks' ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-36">
              {assetLinksJson}
            </pre>
          </div>

          {/* B2B School & Managed Google Play Deployment Guide */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
            <div className="font-heading font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span>B2B Distribution via Managed Google Play & Google Workspace</span>
            </div>
            <p className="text-blue-950/80 dark:text-blue-200/80 leading-relaxed">
              For schools and enterprise fleets: Publish as a <strong>Private App</strong> in Google Play Console or distribute through your MDM/EMM (Google Workspace Admin, Microsoft Intune, Jamf). This allows IT admins to push the app silently to all school Chromebooks, classroom tablets, or employee smartphones with pre-activated license keys!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
