// Ensure window.fetch is writable and cannot throw 'Cannot set property fetch of #<Window> which has only a getter'
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let activeFetch = origFetch;
    const desc = {
      get() {
        return activeFetch;
      },
      set(fn: typeof window.fetch) {
        activeFetch = fn;
      },
      configurable: true,
      enumerable: true,
    };
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      } catch (_) {}
    }
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch (_) {
      try {
        (window as any).fetch = activeFetch;
      } catch (_) {}
    }
  } catch (_) {}

  // Suppress harmless abort and fetch getter rejections from bubbling
  window.addEventListener('unhandledrejection', (event) => {
    if (event?.reason) {
      const msg = event.reason.message || String(event.reason);
      if (
        event.reason.name === 'AbortError' ||
        msg.includes('aborted') ||
        msg.includes('Abort')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  window.addEventListener('error', (event) => {
    if (event?.message) {
      if (
        event.message.includes('fetch of #<Window>') ||
        event.message.includes('aborted')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
