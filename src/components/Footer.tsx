import React from 'react';
import { Package, Twitter, Github, Dribbble, Linkedin, ArrowUp } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  const { websiteContent } = useData();
  const footer = websiteContent.footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

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
            </div>

            <p className="text-slate-400 font-light leading-relaxed max-w-sm mb-5">
              {footer.brandDescription ||
                'WebCraft Goods engineers elite digital templates, Notion systems, and developer boilerplates for modern professionals and teams.'}
            </p>

            <div className="flex items-center gap-2.5">
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
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
              Marketplace
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <a href="#products" className="hover:text-white transition-colors py-1 inline-block">
                  All Products
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors py-1 inline-block">
                  Notion Planners
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors py-1 inline-block">
                  UI Kits & Design
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors py-1 inline-block">
                  Financial Models
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <a href="#about" className="hover:text-white transition-colors py-1 inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors py-1 inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors py-1 inline-block">
                  FAQ & Licensing
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors py-1 inline-block">
                  Direct Support
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="sm:col-span-2 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
              Admin & Governance
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Protected by Firebase Authentication with real-time Firestore database synchronization.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 font-semibold text-xs transition-colors active:scale-95"
            >
              Open Admin CMS Portal
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-500 text-xs">
            {footer.copyrightText || '© 2026 WebCraft Goods Inc. All rights reserved.'}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
