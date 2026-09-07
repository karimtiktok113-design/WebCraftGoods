import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Eye,
  Sun,
  Moon,
  ShieldCheck,
  RefreshCw,
  Zap,
  ArrowRight,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PREMIUM_THEMES, PremiumThemeConfig } from '../../lib/themes';
import { PremiumThemeId, ThemeMode } from '../../types';

export const ThemeSettingsTab: React.FC = () => {
  const {
    mode,
    setMode,
    toggleMode,
    activeThemeId,
    activeTheme,
    effectiveThemeId,
    previewThemeId,
    setPreviewThemeId,
    activatePremiumTheme,
    updateStoreThemeSettings,
    isSaving,
  } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<PremiumThemeId | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleActivate = async (theme: PremiumThemeConfig) => {
    setActivatingId(theme.id);
    try {
      await activatePremiumTheme(theme.id);
      showToast(`✨ "${theme.name}" premium theme is now active across your entire store!`);
    } catch (err: any) {
      alert(`Failed to activate theme: ${err.message || 'Please try again'}`);
    } finally {
      setActivatingId(null);
    }
  };

  const handleSetDefaultMode = async (newDefaultMode: ThemeMode) => {
    try {
      await updateStoreThemeSettings({ defaultMode: newDefaultMode });
      showToast(`Default store appearance updated to ${newDefaultMode.toUpperCase()} mode.`);
    } catch (err: any) {
      alert(`Failed to update default mode: ${err.message || 'Please try again'}`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Purpose Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Storefront Styling & Brand System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            Premium Themes & Display Modes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Exclusive themes can <strong className="text-slate-200">only be activated from this Admin Panel</strong>. 
            When activated, the theme immediately syncs across all customer sessions in real-time.
          </p>
        </div>

        {/* Live Admin Appearance Quick Switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setMode('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'dark'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => setMode('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'light'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
        </div>
      </div>

      {/* Live Active Theme Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 transition-all duration-700"
          style={{ backgroundColor: activeTheme.colors.primary }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE ON LIVE STORE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700">
                {activeTheme.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-3">
              <span>{activeTheme.name}</span>
              <span
                className="w-4 h-4 rounded-full inline-block shadow-md"
                style={{ backgroundColor: activeTheme.colors.primary }}
              />
            </h3>

            <p className="text-sm text-slate-300 font-medium mt-1">
              {activeTheme.tagline}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {activeTheme.description}
            </p>
          </div>

          {/* Color Palette Hierarchy Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium">
              <div className="text-slate-200 font-bold">Live Palette</div>
              <div className="text-[10px] text-slate-500 font-mono">RGB & Hex values</div>
            </div>

            <div className="flex items-center gap-2">
              {activeTheme.colors.swatches.map((swatch, idx) => (
                <div key={idx} className="group relative flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-xl shadow-md border border-white/10 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1 opacity-80 group-hover:opacity-100">
                    {swatch}
                  </span>
                </div>
              ))}
            </div>

            {previewThemeId && (
              <button
                onClick={() => setPreviewThemeId(null)}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold ml-2"
              >
                Reset Live Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Default Store Mode Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Default Store Theme Mode</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose what mode new visitors will experience upon their first visit. Customers can still toggle mode via the navbar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSetDefaultMode('dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              mode === 'dark'
                ? 'bg-slate-950 border-amber-400 text-amber-400 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Default Dark</span>
          </button>

          <button
            onClick={() => handleSetDefaultMode('light')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              mode === 'light'
                ? 'bg-slate-100 border-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Default Light</span>
          </button>
        </div>
      </div>

      {/* Grid of All Premium Themes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <span>Premium Theme Catalog ({PREMIUM_THEMES.length} Available)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin Activated Only
            </span>
          </h3>
          <span className="text-xs text-slate-400">Click &apos;Activate&apos; to apply globally</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PREMIUM_THEMES.map((theme) => {
            const isThemeActive = activeThemeId === theme.id;
            const isCurrentlyPreviewing = previewThemeId === theme.id;
            const isActivating = activatingId === theme.id;

            return (
              <div
                key={theme.id}
                className={`relative flex flex-col justify-between rounded-2xl border transition-all duration-300 p-5 ${
                  isThemeActive
                    ? 'bg-slate-900 border-2 border-emerald-500/80 shadow-xl shadow-emerald-500/10'
                    : isCurrentlyPreviewing
                    ? 'bg-slate-900/90 border-2 border-amber-400 shadow-xl shadow-amber-500/15'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-950 text-slate-300 border border-slate-800">
                      {theme.category}
                    </span>

                    {isThemeActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-extrabold shadow-sm">
                        <Check className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : isCurrentlyPreviewing ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-extrabold shadow-sm animate-pulse">
                        <Eye className="w-3 h-3" />
                        PREVIEWING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-400 bg-slate-950/60 border border-slate-800">
                        {theme.badge}
                      </span>
                    )}
                  </div>

                  {/* Theme Title */}
                  <h4 className="text-lg font-bold text-white font-heading flex items-center justify-between">
                    <span>{theme.name}</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </h4>

                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {theme.tagline}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2 font-light">
                    {theme.description}
                  </p>

                  {/* Live Mini Preview Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className="text-slate-400">Sample Card</span>
                      <span
                        className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: `${theme.colors.primary}25`,
                          color: theme.colors.primary,
                        }}
                      >
                        $49.00
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 py-1.5 px-2 rounded-lg text-center font-bold text-[11px] shadow-sm"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.id === 'titanium-mono' && mode === 'dark' ? '#0f172a' : '#ffffff',
                        }}
                      >
                        Purchase Now
                      </div>

                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center border text-[10px]"
                        style={{
                          borderColor: `${theme.colors.primary}50`,
                          color: theme.colors.primary,
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">Color Spectrum</span>
                      <div className="flex items-center gap-1.5">
                        {theme.colors.swatches.map((c, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white/10"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isCurrentlyPreviewing) {
                        setPreviewThemeId(null);
                      } else {
                        setPreviewThemeId(theme.id);
                        showToast(`Previewing "${theme.name}" live. Click 'Activate' to save it.`);
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      isCurrentlyPreviewing
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isCurrentlyPreviewing ? 'Stop Preview' : 'Live Preview'}</span>
                  </button>

                  <button
                    disabled={isThemeActive || isActivating || isSaving}
                    onClick={() => handleActivate(theme)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                      isThemeActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default opacity-80'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    {isThemeActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Theme</span>
                      </>
                    ) : isActivating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Activate Theme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Access Restriction Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Admin Authorization Enforced: </span>
          Only authenticated administrators can change the global store brand theme and default mode. 
          Customer accounts and anonymous visitors cannot alter your store branding, but are given a seamless Light / Dark mode toggle in the navigation bar for high-comfort viewing.
        </div>
      </div>
    </div>
  );
};
