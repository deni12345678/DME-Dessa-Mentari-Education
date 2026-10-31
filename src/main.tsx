import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Declare global variable for PWA deferred prompt
declare global {
  interface Window {
    __deferredPWAInstallPrompt?: any;
  }
}

// Capture beforeinstallprompt globally as early as possible
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredPWAInstallPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-prompt-ready'));
  console.log('Dessa Mentari PWA prompt ready and captured globally');
});

window.addEventListener('appinstalled', () => {
  window.__deferredPWAInstallPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-installed'));
  console.log('Dessa Mentari PWA installed successfully');
});

// Register PWA service worker for mobile installation and offline capabilities
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Dessa Mentari PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration skipped or failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
