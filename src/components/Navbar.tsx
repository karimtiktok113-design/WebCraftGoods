import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, ArrowUpRight, Shield, LogIn, LogOut, Package, Sun, Moon, Palette, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PREMIUM_THEMES } from '../lib/themes';
import { PremiumThemeId } from '../types';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateHome?: () => void;
  isProductPage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onNavigateHome,
  isProductPage = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAdmin, logout } = useAuth();
  const { mode, toggleMode, effectiveThemeId, effectiveTheme, setThemeId, activatePremiumTheme, isSaving } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    if (themeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themeDropdownOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Products', href: '#products' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isProductPage
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30 py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-nowrap w-full gap-2">
          {/* Logo & Brand - strictly single line, shrink-0 */}
          <a
            id="brand-logo-link"
            href="#hero"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none cursor-pointer shrink-0 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[1px] shadow-md shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white font-heading whitespace-nowrap group-hover:text-amber-300 transition-colors">
                WebCraft<span className="text-amber-400">Goods</span>
              </span>
              <span className="hidden sm:block text-[9px] md:text-[10px] uppercase tracking-wider text-slate-400 -mt-0.5 font-medium whitespace-nowrap">
                Digital Marketplace
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                href={link.href}
                onClick={(e) => {
                  if (onNavigateHome) {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }
                }}
                className="text-xs xl:text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Theme Selector Popover */}
            <div className="relative" ref={themeDropdownRef}>
              <motion.button
                id="navbar-theme-selector-btn"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                title={`Active Theme: ${effectiveTheme.name} (Click to change)`}
                className="h-9 px-2.5 sm:px-3 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex items-center gap-2 group shrink-0 cursor-pointer"
                aria-label="Select Theme"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: effectiveTheme.colors.primary }}
                />
                <span className="text-xs font-semibold hidden xl:inline">{effectiveTheme.name}</span>
                <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </motion.button>

              {/* Theme Dropdown Menu */}
              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 text-left"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Select Theme</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Live Reactive</span>
                    </div>

                    <div className="py-1.5 space-y-1 max-h-80 overflow-y-auto">
                      {PREMIUM_THEMES.map((theme) => {
                        const isCurrent = effectiveThemeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            id={`theme-select-item-${theme.id}`}
                            onClick={() => {
                              setThemeId(theme.id);
                              setThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left group cursor-pointer ${
                              isCurrent
                                ? 'bg-slate-900 border border-slate-700 shadow-sm'
                                : 'hover:bg-slate-900/70 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-4 h-4 rounded-full shrink-0 shadow-sm border border-white/10 flex items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary }}
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {theme.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">{theme.tagline}</div>
                              </div>
                            </div>

                            {isCurrent && (
                              <div className="shrink-0 p-1 rounded-md bg-slate-800 text-amber-400">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAdmin && (
                      <div className="pt-2 mt-1 border-t border-slate-800/80">
                        <button
                          onClick={() => {
                            setThemeDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full py-1.5 px-2 text-center text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
                        >
                          Manage Global Store Themes &rarr;
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Light / Dark Mode Toggle */}
            <motion.button
              id="navbar-theme-mode-toggle"
              onClick={toggleMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex items-center justify-center group shrink-0 cursor-pointer"
              aria-label={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </motion.button>

            <motion.button
              id="navbar-admin-btn"
              onClick={onOpenAdmin}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border whitespace-nowrap shrink-0 cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin CMS'}</span>
            </motion.button>

            <motion.a
              id="navbar-explore-btn"
              href="#products"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shimmer-btn inline-flex items-center justify-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </motion.a>

            {isAdmin && (
              <motion.button
                id="navbar-logout-btn"
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign out of Owner Admin"
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Mobile Right Controls - strictly single line, zero overlapping */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Mobile Theme Indicator Dot Button */}
            <button
              id="mobile-theme-quick-btn"
              onClick={() => setMobileMenuOpen(true)}
              title={`Theme: ${effectiveTheme.name}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 active:scale-95 shrink-0"
              aria-label="Theme selection"
            >
              <div
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ backgroundColor: effectiveTheme.colors.primary }}
              />
            </button>

            {/* Quick Mobile Light / Dark Toggle */}
            <button
              id="mobile-theme-mode-toggle"
              onClick={toggleMode}
              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900/80 active:scale-95 shrink-0"
              aria-label={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Admin button on mobile */}
            <button
              id="mobile-admin-quick-btn"
              onClick={onOpenAdmin}
              title="Admin CMS"
              className="h-8 px-2 sm:px-2.5 flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 active:scale-95 shrink-0"
              aria-label="Admin CMS"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] hidden sm:inline whitespace-nowrap">Admin</span>
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-slate-800/60 bg-slate-900/50 active:scale-95 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-5 py-5 shadow-2xl fixed top-[57px] left-0 right-0 max-h-[calc(100vh-57px)] overflow-y-auto z-50"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/60 px-3 py-2.5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-800/80 flex flex-col gap-2.5">
                {/* Mobile Theme Switcher Row */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Theme Preset</span>
                    </span>
                    <span className="text-xs font-bold text-amber-400">{effectiveTheme.name}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {PREMIUM_THEMES.map((t) => {
                      const isSel = effectiveThemeId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                            isSel
                              ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                              : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.colors.primary }}
                          />
                          <span>{t.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Mode Switcher Row */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-300 font-medium">Appearance</span>
                  <button
                    onClick={toggleMode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    {mode === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Switch to Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-slate-700" />
                        <span>Switch to Dark</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/30 text-sm font-semibold text-amber-400 active:scale-[0.98] transition-transform"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin CMS Panel</span>
                </button>
                <a
                  href="#products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="shimmer-btn w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-transform"
                >
                  <span>Explore Products</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
