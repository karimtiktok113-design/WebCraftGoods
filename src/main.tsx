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
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch (_) {}
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      } catch (_) {}
    }
  } catch (_) {}
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
