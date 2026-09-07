import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeMode, PremiumThemeId, StoreThemeSettings } from '../types';
import { PREMIUM_THEMES, DEFAULT_THEME_SETTINGS, getThemeConfig, PremiumThemeConfig } from '../lib/themes';
import { useData } from './DataContext';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  activeThemeId: PremiumThemeId;
  activeTheme: PremiumThemeConfig;
  effectiveThemeId: PremiumThemeId;
  effectiveTheme: PremiumThemeConfig;
  previewThemeId: PremiumThemeId | null;
  setPreviewThemeId: (id: PremiumThemeId | null) => void;
  activatePremiumTheme: (themeId: PremiumThemeId) => Promise<void>;
  updateStoreThemeSettings: (settings: Partial<StoreThemeSettings>) => Promise<void>;
  isSaving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_MODE_KEY = 'webcraft_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { websiteContent, updateWebsiteContent } = useData();

  // The persistent store-wide theme chosen by the admin from Firestore
  const storeThemeSettings: StoreThemeSettings = useMemo(() => {
    return {
      ...DEFAULT_THEME_SETTINGS,
      ...(websiteContent.theme || {}),
    };
  }, [websiteContent.theme]);

  // Local visitor preference for Dark / Light mode (default to store setting or 'dark')
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return storeThemeSettings.defaultMode || 'dark';
  });

  // Live admin temporary preview before saving
  const [previewThemeId, setPreviewThemeId] = useState<PremiumThemeId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active theme ID (from Firestore or default)
  const activeThemeId: PremiumThemeId = storeThemeSettings.activeThemeId || 'amber-gold';

  // Effective theme currently visible (preview has precedence if active)
  const effectiveThemeId = previewThemeId || activeThemeId;
  const effectiveTheme = useMemo(() => getThemeConfig(effectiveThemeId), [effectiveThemeId]);
  const activeTheme = useMemo(() => getThemeConfig(activeThemeId), [activeThemeId]);

  // Apply Mode & Theme classes and CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // 1. Set Light / Dark Mode class
    if (mode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
    }

    // 2. Clear old theme classes and attach current theme class
    PREMIUM_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
      body.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${effectiveThemeId}`);
    body.classList.add(`theme-${effectiveThemeId}`);

    // 3. Inject dynamic CSS Custom Properties for instant 100% reactive theme shifts
    root.style.setProperty('--theme-primary', effectiveTheme.colors.primary);
    root.style.setProperty('--theme-primary-hover', effectiveTheme.colors.primaryHover);
    root.style.setProperty('--theme-primary-light', effectiveTheme.colors.primaryLight);
    root.style.setProperty('--theme-primary-rgb', effectiveTheme.colors.primaryRgb);
    root.style.setProperty('--theme-accent', effectiveTheme.colors.accent);
    root.style.setProperty('--theme-glow', effectiveTheme.colors.glow);
  }, [mode, effectiveThemeId, effectiveTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_MODE_KEY, newMode);
    }
  };

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  // Admin-only: Activate a premium theme globally across the store
  const activatePremiumTheme = async (themeId: PremiumThemeId): Promise<void> => {
    setIsSaving(true);
    try {
      const updatedSettings: StoreThemeSettings = {
        ...storeThemeSettings,
        activeThemeId: themeId,
        updatedAt: new Date().toISOString(),
      };
      await updateWebsiteContent('theme', updatedSettings);
      setPreviewThemeId(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Admin-only: Update theme settings (like default mode)
  const updateStoreThemeSettings = async (settings: Partial<StoreThemeSettings>): Promise<void> => {
    setIsSaving(true);
    try {
      const updatedSettings: StoreThemeSettings = {
        ...storeThemeSettings,
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      await updateWebsiteContent('theme', updatedSettings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleMode,
        setMode,
        activeThemeId,
        activeTheme,
        effectiveThemeId,
        effectiveTheme,
        previewThemeId,
        setPreviewThemeId,
        activatePremiumTheme,
        updateStoreThemeSettings,
        isSaving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
