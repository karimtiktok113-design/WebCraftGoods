import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowUpRight, Shield, LogIn, LogOut, Package, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
  const { user, isAdmin, logout } = useAuth();
  const { mode, toggleMode, activeTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[1px] shadow-md shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white font-heading whitespace-nowrap">
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
            {/* Light / Dark Mode Toggle */}
            <button
              id="navbar-theme-mode-toggle"
              onClick={toggleMode}
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all active:scale-95 flex items-center justify-center group shrink-0"
              aria-label={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <button
              id="navbar-admin-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border whitespace-nowrap shrink-0 ${
                isAdmin
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin CMS'}</span>
            </button>

            <a
              id="navbar-explore-btn"
              href="#products"
              className="inline-flex items-center justify-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </a>

            {isAdmin && (
              <button
                id="navbar-logout-btn"
                onClick={logout}
                title="Sign out of Owner Admin"
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800 shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Right Controls - strictly single line, zero overlapping */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
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

            {/* Quick Admin button on mobile: compact icon or icon+text depending on width */}
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-5 py-5 shadow-2xl transition-all fixed top-[57px] left-0 right-0 max-h-[calc(100vh-57px)] overflow-y-auto z-50">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-transform"
              >
                <span>Explore Products</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
