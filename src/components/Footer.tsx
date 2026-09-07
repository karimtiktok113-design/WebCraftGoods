import React from 'react';
import {
  Package,
  Twitter,
  Github,
  Dribbble,
  Linkedin,
  ArrowUp,
  Sun,
  Moon,
  MessageSquare,
  Youtube,
  Instagram,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { FooterLinkItem } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  const { websiteContent } = useData();
  const { mode, toggleMode, activeTheme } = useTheme();
  const footer = websiteContent.footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#admin') {
      e.preventDefault();
      onOpenAdmin();
      return;
    }
    if (href.startsWith('#')) {
      if (onNavigateHome) {
        onNavigateHome();
      }
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Fallback defaults for columns
  const col1Links: FooterLinkItem[] =
    footer.column1Links && footer.column1Links.length > 0
      ? footer.column1Links
      : [
          { id: '1', label: 'All Products', href: '#products' },
          { id: '2', label: 'Notion Planners', href: '#products' },
          { id: '3', label: 'UI Kits & Design', href: '#products' },
          { id: '4', label: 'Financial Models', href: '#products' },
        ];

  const col2Links: FooterLinkItem[] =
    footer.column2Links && footer.column2Links.length > 0
      ? footer.column2Links
      : [
          { id: '1', label: 'About Us', href: '#about' },
          { id: '2', label: 'Features', href: '#features' },
          { id: '3', label: 'FAQ & Licensing', href: '#faq' },
          { id: '4', label: 'Direct Support', href: '#contact' },
        ];

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800/80 pt-12 sm:pt-16 pb-10 sm:pb-12 text-slate-400 text-xs w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-heading">
                WebCraft<span className="text-amber-400">Goods</span>
              </span>
              {footer.badgeText && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {footer.badgeText}
                </span>
              )}
            </div>

            <p className="text-slate-400 font-light leading-relaxed max-w-sm mb-5">
              {footer.brandDescription ||
                'WebCraft Goods engineers elite digital templates, Notion systems, and developer boilerplates for modern professionals and teams.'}
            </p>

            {footer.contactEmail && (
              <p className="text-[11px] text-slate-500 mb-4">
                Inquiries:{' '}
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  {footer.contactEmail}
                </a>
              </p>
            )}

            {/* Social Links List */}
            <div className="flex flex-wrap items-center gap-2">
              {footer.socialLinks?.twitter && (
                <a
                  href={footer.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.github && (
                <a
                  href={footer.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.dribbble && (
                <a
                  href={footer.socialLinks.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="Dribbble"
                >
                  <Dribbble className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.linkedin && (
                <a
                  href={footer.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.discord && (
                <a
                  href={footer.socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="Discord"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.youtube && (
                <a
                  href={footer.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks?.instagram && (
                <a
                  href={footer.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Column 1 (Marketplace) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
              {footer.column1Title || 'Marketplace'}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {col1Links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="hover:text-amber-400 transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Column 2 (Company & Support) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
              {footer.column2Title || 'Company'}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {col2Links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="hover:text-amber-400 transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Column 3 (Admin & Governance / Action) */}
          <div className="sm:col-span-2 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{footer.column3Title || 'Admin & Governance'}</span>
            </h4>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed font-light">
              {footer.column3Text ||
                'Protected by Firebase Authentication with real-time Firestore database synchronization.'}
            </p>
            <button
              onClick={() => {
                if (footer.column3ButtonHref && footer.column3ButtonHref !== '#admin') {
                  if (footer.column3ButtonHref.startsWith('http')) {
                    window.open(footer.column3ButtonHref, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = footer.column3ButtonHref;
                  }
                } else {
                  onOpenAdmin();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 font-semibold text-xs transition-colors active:scale-95 shadow-sm"
            >
              <span>{footer.column3ButtonText || 'Open Admin CMS Portal'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-slate-500 text-xs">
              {footer.copyrightText || '© 2026 WebCraft Goods Inc. All rights reserved.'}
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: activeTheme.colors.primary }}
              />
              <span className="text-[11px] text-slate-400 font-medium">
                Theme: <strong className="text-slate-300">{activeTheme.name}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Light or Dark Mode"
            >
              {mode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

