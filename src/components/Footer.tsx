import React, { useState } from 'react';
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
  Download,
  RefreshCw,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
  Send,
  Globe,
  Share2,
  Mail,
  Check,
  X,
  CreditCard,
  LucideIcon,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { FooterLinkItem, TrustBadgeItem } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome?: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Download,
  RefreshCw,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
};

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  const { websiteContent } = useData();
  const { mode, toggleMode, effectiveTheme } = useTheme();
  const footer = websiteContent.footer;

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Legal Modal state
  const [activeLegalModal, setActiveLegalModal] = useState<{ title: string; content: string } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLinkItem) => {
    const href = link.href;
    if (href === '#admin') {
      e.preventDefault();
      onOpenAdmin();
      return;
    }

    if (href === '#privacy' || href === '#terms' || href === '#license' || href === '#security') {
      e.preventDefault();
      if (href === '#privacy') {
        setActiveLegalModal({
          title: 'Privacy Policy',
          content:
            'WebCraft Goods prioritizes customer confidentiality and data security. We do not sell, license, or monetize visitor personal details. Any data provided via contact forms or payment processing is strictly used to fulfill digital downloads and provide customer support, backed by enterprise-grade encryption and Firestore data isolation.',
        });
      } else if (href === '#terms') {
        setActiveLegalModal({
          title: 'Terms of Service',
          content:
            'By purchasing or downloading digital templates, code repositories, or Notion systems from WebCraft Goods, you receive a commercial license for individual and client production use. Redistribution, reselling, or public sublicensing of our raw source files as standalone digital assets is strictly prohibited.',
        });
      } else if (href === '#license') {
        setActiveLegalModal({
          title: 'Commercial License Terms',
          content:
            'All products include a single-seat commercial license. You are fully entitled to deploy websites, client deliverables, dashboards, and internal business tools built with our templates without recurring royalty payments.',
        });
      } else {
        setActiveLegalModal({
          title: 'Security & Integrity Overview',
          content:
            'Our applications are constructed with modern security benchmarks: zero arbitrary remote code execution, client-side OAuth token protection, sanitized inputs, and multi-tenant Firestore security rules.',
        });
      }
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2500);
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

  const legalLinks: FooterLinkItem[] =
    footer.legalLinks && footer.legalLinks.length > 0
      ? footer.legalLinks
      : [
          { id: '1', label: 'Privacy Policy', href: '#privacy' },
          { id: '2', label: 'Terms of Service', href: '#terms' },
          { id: '3', label: 'License Terms', href: '#license' },
          { id: '4', label: 'Security', href: '#security' },
        ];

  const trustBadges: TrustBadgeItem[] =
    footer.trustBadges && footer.trustBadges.length > 0
      ? footer.trustBadges
      : [
          { id: 'tb-1', label: 'Instant Download', sublabel: 'Direct file access', icon: 'Download' },
          { id: 'tb-2', label: 'Commercial License', sublabel: 'Client & personal use', icon: 'ShieldCheck' },
          { id: 'tb-3', label: 'Free Updates', sublabel: 'Lifetime revisions', icon: 'RefreshCw' },
          { id: 'tb-4', label: 'Verified Code', sublabel: 'Zero bloat', icon: 'Sparkles' },
        ];

  const currentYear = String(new Date().getFullYear());
  const formattedCopyright = (footer.copyrightText || '© {year} WebCraft Goods Inc. All rights reserved.').replace(
    '{year}',
    currentYear
  );

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800/80 pt-12 sm:pt-16 pb-10 sm:pb-12 text-slate-400 text-xs w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 sm:space-y-12">
        {/* 1. Optional Newsletter Banner */}
        {footer.showNewsletter !== false && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-900/90 border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold mb-2.5 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>VIP Creator Community</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading tracking-tight">
                  {footer.newsletterTitle || 'Get 20% Off Your First Digital Good'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                  {footer.newsletterSubtitle ||
                    'Join 45,000+ creators receiving our weekly templates, Notion systems, and exclusive subscriber perks.'}
                </p>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                {newsletterSubmitted ? (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>You are subscribed! Check your inbox for your 20% discount code.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        aria-label="Email address for newsletter"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder={footer.newsletterPlaceholder || 'Enter your email address...'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-amber-500 outline-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="shimmer-btn px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      {footer.newsletterButtonText || 'Subscribe'}
                    </button>
                  </form>
                )}
                {newsletterError && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{newsletterError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Optional Trust & Value Guarantees Row */}
        {footer.showTrustBadges !== false && trustBadges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-2">
            {trustBadges.map((badge) => {
              const IconComp = (badge.icon && ICON_MAP[badge.icon]) || ShieldCheck;
              return (
                <div
                  key={badge.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex items-center gap-3 transition-colors hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <IconComp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white tracking-tight truncate">{badge.label}</h5>
                    {badge.sublabel && (
                      <p className="text-[10px] text-slate-400 truncate font-light">{badge.sublabel}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Main Footer Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1px] shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-heading">
                {footer.brandName || 'WebCraft'}
                <span className="text-amber-400">{footer.brandAccent !== undefined ? footer.brandAccent : 'Goods'}</span>
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

            {footer.showContactEmail !== false && footer.contactEmail && (
              <p className="text-[11px] text-slate-500 mb-4">
                Inquiries:{' '}
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium"
                >
                  {footer.contactEmail}
                </a>
              </p>
            )}

            {/* Social Links List */}
            {footer.showSocialLinks !== false && (
              <div className="flex flex-wrap items-center gap-2">
                {footer.socialLinks?.twitter && (
                  <a
                    href={footer.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                    aria-label="Twitter / X"
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
                {footer.socialLinks?.telegram && (
                  <a
                    href={footer.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                    aria-label="Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {footer.socialLinks?.threads && (
                  <a
                    href={footer.socialLinks.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                    aria-label="Threads"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                )}
                {footer.socialLinks?.producthunt && (
                  <a
                    href={footer.socialLinks.producthunt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors active:scale-95"
                    aria-label="Product Hunt"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Column 1 (Marketplace / Products) */}
          {footer.showColumn1 !== false && (
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
                {footer.column1Title || 'Marketplace'}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {col1Links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="hover:text-amber-400 transition-colors py-1 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      {link.openInNewTab && (
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic Column 2 (Company & Resources) */}
          {footer.showColumn2 !== false && (
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading">
                {footer.column2Title || 'Company'}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {col2Links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="hover:text-amber-400 transition-colors py-1 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      {link.openInNewTab && (
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic Column 3 (Admin & Governance / Action Card) */}
          {footer.showColumn3 !== false && (
            <div className="sm:col-span-2 md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 sm:mb-4 font-heading flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{footer.column3Title || 'Admin & Governance'}</span>
              </h4>
              <p className="text-slate-400 text-xs mb-3.5 leading-relaxed font-light">
                {footer.column3Text ||
                  'Protected by Firebase Authentication with real-time Firestore database synchronization.'}
              </p>

              {footer.column3ActionType !== 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    if (footer.column3ActionType === 'contact') {
                      const el = document.querySelector('#contact');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else if (footer.column3ActionType === 'link' && footer.column3ButtonHref) {
                      if (footer.column3ButtonHref.startsWith('http')) {
                        window.open(footer.column3ButtonHref, '_blank', 'noopener,noreferrer');
                      } else {
                        window.location.href = footer.column3ButtonHref;
                      }
                    } else {
                      onOpenAdmin();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 font-semibold text-xs transition-colors active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>{footer.column3ButtonText || 'Open Admin CMS Portal'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4. Optional Accepted Payment Methods Bar */}
        {footer.showPaymentMethods !== false && (
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-300">Encrypted 256-Bit SSL Checkout</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Stripe</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Visa</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Mastercard</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Apple Pay</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">PayPal</span>
            </div>
          </div>
        )}

        {/* 5. Bottom Bar (Copyright, Legal Links, Theme Pill, Mode Toggle, Back to Top) */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-slate-500 text-xs">{formattedCopyright}</p>
            {footer.showThemeIndicator !== false && (
              <>
                <span className="hidden sm:inline text-slate-700">•</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: effectiveTheme.colors.primary }}
                  />
                  <span className="text-[11px] text-slate-400 font-medium">
                    Theme: <strong className="text-slate-300">{effectiveTheme.name}</strong>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Legal Links row */}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
              {legalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="hover:text-amber-400 transition-colors py-0.5 cursor-pointer underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {footer.showModeToggle !== false && (
              <button
                type="button"
                onClick={toggleMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
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
            )}

            {footer.showBackToTop !== false && (
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. Built-in Legal Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-heading">{activeLegalModal.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light mb-5">
              {activeLegalModal.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
