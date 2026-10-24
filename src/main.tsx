import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LicenseProvider } from './context/LicenseContext';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for instant offline availability & updates
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New chemistry periodic table content available.');
  },
  onOfflineReady() {
    console.log('Science in Realworld is ready for 100% offline classroom & laboratory use.');
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LicenseProvider>
      <App />
    </LicenseProvider>
  </React.StrictMode>
);
