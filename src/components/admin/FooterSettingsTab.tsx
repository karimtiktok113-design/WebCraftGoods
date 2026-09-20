import React, { useState } from 'react';
import {
  Package,
  Check,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Download,
  RefreshCw,
  Sparkles,
  Lock,
  Mail,
  Twitter,
  Github,
  Dribbble,
  Linkedin,
  MessageSquare,
  Youtube,
  Instagram,
  Send,
  Eye,
  ArrowUp,
  Sun,
  Moon,
  Columns,
  Layers,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon,
  Globe,
  Share2,
  FileText,
  CreditCard,
  LucideIcon,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { FooterContent, FooterLinkItem, TrustBadgeItem } from '../../types';
import { INITIAL_WEBSITE_CONTENT } from '../../lib/sampleData';

const TRUST_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'ShieldCheck', label: 'Shield & Security' },
  { value: 'Download', label: 'Instant Download' },
  { value: 'RefreshCw', label: 'Updates & Sync' },
  { value: 'Sparkles', label: 'Premium Quality' },
  { value: 'Lock', label: 'Encrypted & Safe' },
  { value: 'CheckCircle2', label: 'Verified Check' },
  { value: 'Zap', label: 'High Velocity' },
];

export const FooterSettingsTab: React.FC = () => {
  const { websiteContent, updateWebsiteContent } = useData();
  const { effectiveTheme, mode, toggleMode } = useTheme();

  // Working form state initialized from context or initial defaults
  const [form, setForm] = useState<FooterContent>(() => {
    const live = websiteContent?.footer;
    const def = INITIAL_WEBSITE_CONTENT.footer;
    return {
      ...def,
      ...(live || {}),
      column1Links: Array.isArray(live?.column1Links) && live!.column1Links.length > 0 ? live!.column1Links : def.column1Links || [],
      column2Links: Array.isArray(live?.column2Links) && live!.column2Links.length > 0 ? live!.column2Links : def.column2Links || [],
      legalLinks: Array.isArray(live?.legalLinks) && live!.legalLinks.length > 0 ? live!.legalLinks : def.legalLinks || [],
      trustBadges: Array.isArray(live?.trustBadges) && live!.trustBadges.length > 0 ? live!.trustBadges : def.trustBadges || [],
      socialLinks: { ...(def.socialLinks || {}), ...(live?.socialLinks || {}) },
    };
  });

  const [activeSubTab, setActiveSubTab] = useState<
    'brand' | 'newsletter' | 'columns' | 'column3' | 'socials' | 'trust' | 'bottom' | 'presets'
  >('brand');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if live content changes externally
  const handleResetToLive = () => {
    if (websiteContent?.footer) {
      const live = websiteContent.footer;
      const def = INITIAL_WEBSITE_CONTENT.footer;
      setForm({
        ...def,
        ...live,
        column1Links: Array.isArray(live.column1Links) && live.column1Links.length > 0 ? live.column1Links : def.column1Links || [],
        column2Links: Array.isArray(live.column2Links) && live.column2Links.length > 0 ? live.column2Links : def.column2Links || [],
        legalLinks: Array.isArray(live.legalLinks) && live.legalLinks.length > 0 ? live.legalLinks : def.legalLinks || [],
        trustBadges: Array.isArray(live.trustBadges) && live.trustBadges.length > 0 ? live.trustBadges : def.trustBadges || [],
        socialLinks: { ...(def.socialLinks || {}), ...(live.socialLinks || {}) },
      });
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  };

  // Preset loaders
  const handleLoadPreset = (presetType: 'saas' | 'creator' | 'minimal' | 'agency') => {
    if (!confirm(`Are you sure you want to load the "${presetType.toUpperCase()}" template preset? Unsaved changes will be replaced.`)) {
      return;
    }

    if (presetType === 'saas') {
      setForm((prev) => ({
        ...prev,
        brandName: 'CloudMatrix',
        brandAccent: 'SaaS',
        brandDescription: 'High-performance developer toolkits, production boilerplates, and automated infrastructure presets.',
        badgeText: 'Enterprise Caliber',
        showNewsletter: true,
        newsletterTitle: 'Subscribe to Developer Changelogs',
        newsletterSubtitle: 'Receive architecture breakdowns, release notes, and SDK upgrade guides directly in your inbox.',
        newsletterButtonText: 'Join 50k+ Engineers',
        showColumn1: true,
        column1Title: 'Platform & SDKs',
        column1Links: [
          { id: 'saas-1', label: 'React & Next.js Templates', href: '#products' },
          { id: 'saas-2', label: 'Tailwind Design System', href: '#products' },
          { id: 'saas-3', label: 'Node API Boilerplates', href: '#products' },
          { id: 'saas-4', label: 'Database Schemas', href: '#products' },
        ],
        showColumn2: true,
        column2Title: 'Ecosystem',
        column2Links: [
          { id: 'eco-1', label: 'Documentation', href: '#features' },
          { id: 'eco-2', label: 'API Reference', href: '#faq' },
          { id: 'eco-3', label: 'System Status', href: '#status' },
          { id: 'eco-4', label: 'Security & Compliance', href: '#security' },
        ],
        showColumn3: true,
        column3Title: 'Developer Governance',
        column3Text: 'Automated CI/CD validation with certified clean code and zero external telemetry tracking.',
        column3ButtonText: 'Access Admin Console',
        column3ActionType: 'admin',
        showTrustBadges: true,
        showPaymentMethods: true,
        showThemeIndicator: true,
        showModeToggle: true,
      }));
    } else if (presetType === 'creator') {
      setForm((prev) => ({
        ...prev,
        brandName: 'CreatorKit',
        brandAccent: 'Studio',
        brandDescription: 'Curated Notion operating systems, financial planners, and content production systems for high-impact solo creators.',
        badgeText: 'Top 1% Notion Certified',
        showNewsletter: true,
        newsletterTitle: 'The Solo Creator Blueprint',
        newsletterSubtitle: 'Every Sunday: 1 Notion strategy, 1 automated workflow, and 1 exclusive free digital asset.',
        newsletterButtonText: 'Subscribe Free',
        showColumn1: true,
        column1Title: 'Notion Systems',
        column1Links: [
          { id: 'cr-1', label: 'Second Brain OS', href: '#products' },
          { id: 'cr-2', label: 'FIRE Financial Tracker', href: '#products' },
          { id: 'cr-3', label: 'Content Engine 3.0', href: '#products' },
          { id: 'cr-4', label: 'Habit & Goal Tracker', href: '#products' },
        ],
        showColumn2: true,
        column2Title: 'Resources',
        column2Links: [
          { id: 'cr-res-1', label: 'Creator Blog', href: '#about' },
          { id: 'cr-res-2', label: 'Notion Tutorials', href: '#features' },
          { id: 'cr-res-3', label: 'Template FAQs', href: '#faq' },
          { id: 'cr-res-4', label: 'Direct Creator Chat', href: '#contact' },
        ],
        showColumn3: true,
        column3Title: 'VIP Creator Portal',
        column3Text: 'Manage your storefront, upload new template packs, and view inbound client inquiries.',
        column3ButtonText: 'Open Store CMS',
        column3ActionType: 'admin',
        showTrustBadges: true,
        showPaymentMethods: true,
      }));
    } else if (presetType === 'minimal') {
      setForm((prev) => ({
        ...prev,
        brandName: 'Atelier',
        brandAccent: 'Goods',
        brandDescription: 'Essential digital instruments designed for clarity, intentionality, and undisturbed deep work.',
        badgeText: 'Minimal Edition',
        showNewsletter: false,
        showColumn1: true,
        column1Title: 'Archive',
        column1Links: [
          { id: 'min-1', label: 'All Artifacts', href: '#products' },
          { id: 'min-2', label: 'Editorial Systems', href: '#products' },
          { id: 'min-3', label: 'Typography Kits', href: '#products' },
        ],
        showColumn2: true,
        column2Title: 'Colophon',
        column2Links: [
          { id: 'min-c-1', label: 'Manifesto', href: '#about' },
          { id: 'min-c-2', label: 'Inquiries', href: '#contact' },
        ],
        showColumn3: false,
        showTrustBadges: false,
        showPaymentMethods: false,
        showThemeIndicator: true,
        showModeToggle: true,
      }));
    }
  };

  // Link Management Handlers
  const handleAddLink = (col: 'col1' | 'col2' | 'legal') => {
    const newId = `${col}-${Date.now()}`;
    const newLink: FooterLinkItem = { id: newId, label: 'New Link', href: '#products' };
    if (col === 'col1') {
      setForm((prev) => ({ ...prev, column1Links: [...(prev.column1Links || []), newLink] }));
    } else if (col === 'col2') {
      setForm((prev) => ({ ...prev, column2Links: [...(prev.column2Links || []), newLink] }));
    } else {
      setForm((prev) => ({ ...prev, legalLinks: [...(prev.legalLinks || []), newLink] }));
    }
  };

  const handleUpdateLink = (
    col: 'col1' | 'col2' | 'legal',
    index: number,
    field: keyof FooterLinkItem,
    value: any
  ) => {
    const key = col === 'col1' ? 'column1Links' : col === 'col2' ? 'column2Links' : 'legalLinks';
    const list = [...(form[key] || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setForm((prev) => ({ ...prev, [key]: list }));
    }
  };

  const handleDeleteLink = (col: 'col1' | 'col2' | 'legal', index: number) => {
    const key = col === 'col1' ? 'column1Links' : col === 'col2' ? 'column2Links' : 'legalLinks';
    const list = [...(form[key] || [])];
    list.splice(index, 1);
    setForm((prev) => ({ ...prev, [key]: list }));
  };

  const handleMoveLink = (col: 'col1' | 'col2' | 'legal', index: number, direction: 'up' | 'down') => {
    const key = col === 'col1' ? 'column1Links' : col === 'col2' ? 'column2Links' : 'legalLinks';
    const list = [...(form[key] || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setForm((prev) => ({ ...prev, [key]: list }));
  };

  // Trust Badges Handlers
  const handleAddTrustBadge = () => {
    const newBadge: TrustBadgeItem = {
      id: `tb-${Date.now()}`,
      label: 'Verified Safe',
      sublabel: 'Guaranteed quality',
      icon: 'ShieldCheck',
    };
    setForm((prev) => ({ ...prev, trustBadges: [...(prev.trustBadges || []), newBadge] }));
  };

  const handleUpdateTrustBadge = (index: number, field: keyof TrustBadgeItem, value: string) => {
    const list = [...(form.trustBadges || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setForm((prev) => ({ ...prev, trustBadges: list }));
    }
  };

  const handleDeleteTrustBadge = (index: number) => {
    const list = [...(form.trustBadges || [])];
    list.splice(index, 1);
    setForm((prev) => ({ ...prev, trustBadges: list }));
  };

  // Save to Firestore
  const handleSaveToFirestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      await updateWebsiteContent('footer', form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save footer settings to Firestore. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Save Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Columns className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white font-heading">Footer Customizer CMS</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Live Firestore Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Control branding, navigation links, newsletter captures, trust guarantees, social profiles, and bottom bar elements in real-time.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToLive}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Revert form back to currently saved Firestore data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToFirestore}
            disabled={isSaving}
            className="shimmer-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                <span>Saving to Firestore...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-950" />
                <span>Save Footer Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Footer settings published successfully! Your visitors now see the updated layout.
            </span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'brand', label: 'Brand & Identity', icon: Package },
          { id: 'newsletter', label: 'Newsletter Bar', icon: Mail },
          { id: 'columns', label: 'Nav Columns 1 & 2', icon: Columns },
          { id: 'column3', label: 'Column 3 / Action', icon: ShieldCheck },
          { id: 'socials', label: 'Social Media', icon: Share2 },
          { id: 'trust', label: 'Trust & Payments', icon: CreditCard },
          { id: 'bottom', label: 'Bottom Bar & Legal', icon: FileText },
          { id: 'presets', label: 'Templates & Presets', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Sub-Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. BRAND & IDENTITY */}
          {activeSubTab === 'brand' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-1">Brand Identity & Bio</h3>
                <p className="text-xs text-slate-400">
                  Configure the primary brand logo text, accent highlight, descriptive bio, and contact email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name (Prefix)</label>
                  <input
                    type="text"
                    value={form.brandName || ''}
                    onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                    placeholder="WebCraft"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Accent Word</label>
                  <input
                    type="text"
                    value={form.brandAccent || ''}
                    onChange={(e) => setForm({ ...form, brandAccent: e.target.value })}
                    placeholder="Goods"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline Badge Text</label>
                <input
                  type="text"
                  value={form.badgeText || ''}
                  onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                  placeholder="Curated Digital Assets"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Displayed as a subtle highlight pill beside the brand logo.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Description / Mission</label>
                <textarea
                  rows={3}
                  value={form.brandDescription || ''}
                  onChange={(e) => setForm({ ...form, brandDescription: e.target.value })}
                  placeholder="WebCraft Goods engineers elite digital templates..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Display Inquiries Email</span>
                    <span className="text-[11px] text-slate-400">Show clickable direct mailto link for business inquiries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showContactEmail !== false}
                    onChange={(e) => setForm({ ...form, showContactEmail: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {form.showContactEmail !== false && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Contact Email Address</label>
                    <input
                      type="email"
                      value={form.contactEmail || ''}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      placeholder="support@webcraftgoods.com"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. NEWSLETTER BAR */}
          {activeSubTab === 'newsletter' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading mb-1">Newsletter Subscription Banner</h3>
                  <p className="text-xs text-slate-400">
                    Prompt visitors to join your VIP mailing list directly above footer columns.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300 font-semibold">Enable Banner</span>
                  <input
                    type="checkbox"
                    checked={form.showNewsletter !== false}
                    onChange={(e) => setForm({ ...form, showNewsletter: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {form.showNewsletter !== false && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Headline</label>
                    <input
                      type="text"
                      value={form.newsletterTitle || ''}
                      onChange={(e) => setForm({ ...form, newsletterTitle: e.target.value })}
                      placeholder="Get 20% Off Your First Digital Good"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Subtitle / Value Hook</label>
                    <textarea
                      rows={2}
                      value={form.newsletterSubtitle || ''}
                      onChange={(e) => setForm({ ...form, newsletterSubtitle: e.target.value })}
                      placeholder="Join 45,000+ creators receiving our weekly templates, release updates, and exclusive perks."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Input Placeholder</label>
                      <input
                        type="text"
                        value={form.newsletterPlaceholder || ''}
                        onChange={(e) => setForm({ ...form, newsletterPlaceholder: e.target.value })}
                        placeholder="Enter your email address..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Button Call to Action</label>
                      <input
                        type="text"
                        value={form.newsletterButtonText || ''}
                        onChange={(e) => setForm({ ...form, newsletterButtonText: e.target.value })}
                        placeholder="Subscribe"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. NAVIGATION COLUMNS 1 & 2 */}
          {activeSubTab === 'columns' && (
            <div className="space-y-6">
              {/* Column 1 Editor */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-white font-heading">Navigation Column 1</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-300">Show Column</span>
                    <input
                      type="checkbox"
                      checked={form.showColumn1 !== false}
                      onChange={(e) => setForm({ ...form, showColumn1: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {form.showColumn1 !== false && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Column Title</label>
                      <input
                        type="text"
                        value={form.column1Title || ''}
                        onChange={(e) => setForm({ ...form, column1Title: e.target.value })}
                        placeholder="Marketplace"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400">Links ({form.column1Links?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => handleAddLink('col1')}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Link</span>
                        </button>
                      </div>

                      {form.column1Links?.map((link, idx) => (
                        <div
                          key={link.id || idx}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                        >
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveLink('col1', idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink('col1', idx, 'down')}
                              disabled={idx === (form.column1Links?.length || 0) - 1}
                              className="text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▼
                            </button>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => handleUpdateLink('col1', idx, 'label', e.target.value)}
                              placeholder="Label"
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => handleUpdateLink('col1', idx, 'href', e.target.value)}
                              placeholder="#products or https://..."
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono outline-none focus:border-amber-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteLink('col1', idx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2 Editor */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-white font-heading">Navigation Column 2</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-300">Show Column</span>
                    <input
                      type="checkbox"
                      checked={form.showColumn2 !== false}
                      onChange={(e) => setForm({ ...form, showColumn2: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {form.showColumn2 !== false && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Column Title</label>
                      <input
                        type="text"
                        value={form.column2Title || ''}
                        onChange={(e) => setForm({ ...form, column2Title: e.target.value })}
                        placeholder="Company"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400">Links ({form.column2Links?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => handleAddLink('col2')}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Link</span>
                        </button>
                      </div>

                      {form.column2Links?.map((link, idx) => (
                        <div
                          key={link.id || idx}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                        >
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveLink('col2', idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink('col2', idx, 'down')}
                              disabled={idx === (form.column2Links?.length || 0) - 1}
                              className="text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▼
                            </button>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => handleUpdateLink('col2', idx, 'label', e.target.value)}
                              placeholder="Label"
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => handleUpdateLink('col2', idx, 'href', e.target.value)}
                              placeholder="#about or https://..."
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono outline-none focus:border-amber-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteLink('col2', idx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. COLUMN 3 / CALL TO ACTION */}
          {activeSubTab === 'column3' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading mb-1">Column 3 / Action Card</h3>
                  <p className="text-xs text-slate-400">
                    A prominent highlighted callout card for Admin access, support desk, or special announcements.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Show Column 3</span>
                  <input
                    type="checkbox"
                    checked={form.showColumn3 !== false}
                    onChange={(e) => setForm({ ...form, showColumn3: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {form.showColumn3 !== false && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Card Heading</label>
                    <input
                      type="text"
                      value={form.column3Title || ''}
                      onChange={(e) => setForm({ ...form, column3Title: e.target.value })}
                      placeholder="Admin & Governance"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Descriptive Body Text</label>
                    <textarea
                      rows={2}
                      value={form.column3Text || ''}
                      onChange={(e) => setForm({ ...form, column3Text: e.target.value })}
                      placeholder="Protected by Firebase Authentication with real-time Firestore database synchronization."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={form.column3ButtonText || ''}
                        onChange={(e) => setForm({ ...form, column3ButtonText: e.target.value })}
                        placeholder="Open Admin CMS Portal"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Button Action Behavior</label>
                      <select
                        value={form.column3ActionType || 'admin'}
                        onChange={(e) => setForm({ ...form, column3ActionType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      >
                        <option value="admin">Open Admin CMS Portal Modal</option>
                        <option value="contact">Scroll to Contact Section</option>
                        <option value="link">Custom URL / External Link</option>
                        <option value="none">No Action Button (Text Only)</option>
                      </select>
                    </div>
                  </div>

                  {form.column3ActionType === 'link' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Button Destination URL</label>
                      <input
                        type="text"
                        value={form.column3ButtonHref || ''}
                        onChange={(e) => setForm({ ...form, column3ButtonHref: e.target.value })}
                        placeholder="https://example.com or #products"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. SOCIAL MEDIA PROFILES */}
          {activeSubTab === 'socials' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading mb-1">Social Media & Community Links</h3>
                  <p className="text-xs text-slate-400">
                    Connect your presence across modern networks. Leave blank to hide individual platform icons.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Show Socials</span>
                  <input
                    type="checkbox"
                    checked={form.showSocialLinks !== false}
                    onChange={(e) => setForm({ ...form, showSocialLinks: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {form.showSocialLinks !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  {[
                    { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/...' },
                    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/...' },
                    { key: 'dribbble', label: 'Dribbble', icon: Dribbble, placeholder: 'https://dribbble.com/...' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/...' },
                    { key: 'discord', label: 'Discord Community', icon: MessageSquare, placeholder: 'https://discord.gg/...' },
                    { key: 'youtube', label: 'YouTube Channel', icon: Youtube, placeholder: 'https://youtube.com/@...' },
                    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/...' },
                    { key: 'telegram', label: 'Telegram Group', icon: Send, placeholder: 'https://t.me/...' },
                    { key: 'threads', label: 'Threads', icon: Share2, placeholder: 'https://threads.net/@...' },
                    { key: 'producthunt', label: 'Product Hunt', icon: Globe, placeholder: 'https://producthunt.com/@...' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const val = (form.socialLinks as any)?.[item.key] || '';
                    return (
                      <div key={item.key} className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <Icon className="w-3 h-3 text-amber-400" />
                          <span>{item.label}</span>
                        </span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              socialLinks: {
                                ...(form.socialLinks || {}),
                                [item.key]: e.target.value,
                              },
                            })
                          }
                          placeholder={item.placeholder}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. TRUST & PAYMENTS */}
          {activeSubTab === 'trust' && (
            <div className="space-y-6">
              {/* Trust Guarantees */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading mb-1">Customer Trust & Guarantees</h3>
                    <p className="text-xs text-slate-400">
                      Showcase value propositions such as instant downloads, commercial licensing, and free lifetime updates.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-300">Show Trust Bar</span>
                    <input
                      type="checkbox"
                      checked={form.showTrustBadges !== false}
                      onChange={(e) => setForm({ ...form, showTrustBadges: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {form.showTrustBadges !== false && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Guarantee Badges ({form.trustBadges?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddTrustBadge}
                        className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Guarantee</span>
                      </button>
                    </div>

                    {form.trustBadges?.map((badge, idx) => (
                      <div
                        key={badge.id || idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                      >
                        <div className="sm:col-span-4">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Icon</span>
                          <select
                            value={badge.icon || 'ShieldCheck'}
                            onChange={(e) => handleUpdateTrustBadge(idx, 'icon', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                          >
                            {TRUST_ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-4">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Main Label</span>
                          <input
                            type="text"
                            value={badge.label}
                            onChange={(e) => handleUpdateTrustBadge(idx, 'label', e.target.value)}
                            placeholder="Instant Download"
                            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Sublabel</span>
                          <input
                            type="text"
                            value={badge.sublabel || ''}
                            onChange={(e) => handleUpdateTrustBadge(idx, 'sublabel', e.target.value)}
                            placeholder="Direct access"
                            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteTrustBadge(idx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete guarantee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading mb-1">Accepted Payment Method Badges</h3>
                    <p className="text-xs text-slate-400">
                      Display secure payment badges (Stripe, Visa, Mastercard, Apple Pay, Google Pay, 256-Bit SSL).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showPaymentMethods !== false}
                    onChange={(e) => setForm({ ...form, showPaymentMethods: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. BOTTOM BAR & LEGAL */}
          {activeSubTab === 'bottom' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-1">Bottom Bar & Legal Governance</h3>
                <p className="text-xs text-slate-400">
                  Manage copyright declarations, legal disclaimers, theme tags, and quick-scroll controls.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Copyright Notice Text
                </label>
                <input
                  type="text"
                  value={form.copyrightText || ''}
                  onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
                  placeholder="© {year} WebCraft Goods Inc. All rights reserved."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Tip: Use <strong className="text-amber-400">{`{year}`}</strong> to automatically show the current year ({new Date().getFullYear()}).
                </span>
              </div>

              {/* Toggles Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">Theme Indicator</span>
                  <input
                    type="checkbox"
                    checked={form.showThemeIndicator !== false}
                    onChange={(e) => setForm({ ...form, showThemeIndicator: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">Light / Dark Switch</span>
                  <input
                    type="checkbox"
                    checked={form.showModeToggle !== false}
                    onChange={(e) => setForm({ ...form, showModeToggle: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">Back to Top Button</span>
                  <input
                    type="checkbox"
                    checked={form.showBackToTop !== false}
                    onChange={(e) => setForm({ ...form, showBackToTop: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>

              {/* Legal Links Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Legal Links ({form.legalLinks?.length || 0})</span>
                  <button
                    type="button"
                    onClick={() => handleAddLink('legal')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Legal Link</span>
                  </button>
                </div>

                {form.legalLinks?.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink('legal', idx, 'label', e.target.value)}
                        placeholder="Privacy Policy"
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => handleUpdateLink('legal', idx, 'href', e.target.value)}
                        placeholder="#privacy or https://..."
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink('legal', idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. PRESETS & QUICK TEMPLATES */}
          {activeSubTab === 'presets' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-1">Quick-Apply Layout Presets</h3>
                <p className="text-xs text-slate-400">
                  Switch the entire footer configuration in one click with curated, production-tested layouts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleLoadPreset('saas')}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    <Columns className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Software & SaaS</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Rich developer SDKs, changelog newsletter, and enterprise security guarantees.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPreset('creator')}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Creator & Notion</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Solo creator blueprint, Notion operating systems, and creator newsletter perks.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPreset('minimal')}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Minimal Studio</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Ultra-clean typography, simple colophon links, zero noise, pure craftsmanship.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Preview (5 cols on desktop) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-white font-heading">Interactive Live Preview</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Embedded Mini Preview Container */}
            <div
              className={`rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 text-[10px] overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === 'mobile' ? 'max-w-xs mx-auto' : 'w-full'
              }`}
            >
              {/* Fake browser bar */}
              <div className="h-6 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="text-[9px] text-slate-500 font-mono ml-2">Footer Live Rendering</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Newsletter preview if enabled */}
                {form.showNewsletter !== false && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">
                      {form.newsletterTitle || 'Get 20% Off Your First Good'}
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      {form.newsletterSubtitle || 'Join 45,000+ creators receiving our updates.'}
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        readOnly
                        placeholder={form.newsletterPlaceholder || 'Your email...'}
                        className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[9px] text-slate-400 outline-none"
                      />
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[9px] shrink-0"
                      >
                        {form.newsletterButtonText || 'Subscribe'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Trust Badges preview */}
                {form.showTrustBadges !== false && form.trustBadges && form.trustBadges.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-800/80">
                    {form.trustBadges.slice(0, 4).map((b, i) => (
                      <div
                        key={i}
                        className="p-1.5 rounded-lg bg-slate-900/40 border border-slate-800/60 flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate font-medium text-slate-300">{b.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brand & Columns Preview Grid */}
                <div className={`grid gap-4 ${previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-12'}`}>
                  {/* Brand Column */}
                  <div className={previewDevice === 'mobile' ? 'col-span-1' : 'col-span-5'}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Package className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-white text-xs">
                        {form.brandName || 'WebCraft'}
                        <span className="text-amber-400">{form.brandAccent !== undefined ? form.brandAccent : 'Goods'}</span>
                      </span>
                      {form.badgeText && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {form.badgeText}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal line-clamp-3 mb-2">
                      {form.brandDescription}
                    </p>
                    {form.showContactEmail !== false && form.contactEmail && (
                      <div className="text-[9px] text-amber-400/90 underline mb-2">
                        {form.contactEmail}
                      </div>
                    )}
                  </div>

                  {/* Nav Column 1 */}
                  {form.showColumn1 !== false && (
                    <div className={previewDevice === 'mobile' ? 'col-span-1' : 'col-span-3'}>
                      <div className="font-bold text-white text-[10px] uppercase tracking-wider mb-1.5">
                        {form.column1Title || 'Marketplace'}
                      </div>
                      <ul className="space-y-1">
                        {form.column1Links?.slice(0, 4).map((l, i) => (
                          <li key={i} className="text-slate-400 truncate">
                            {l.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nav Column 2 */}
                  {form.showColumn2 !== false && (
                    <div className={previewDevice === 'mobile' ? 'col-span-1' : 'col-span-4'}>
                      <div className="font-bold text-white text-[10px] uppercase tracking-wider mb-1.5">
                        {form.column2Title || 'Company'}
                      </div>
                      <ul className="space-y-1">
                        {form.column2Links?.slice(0, 4).map((l, i) => (
                          <li key={i} className="text-slate-400 truncate">
                            {l.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Bar Preview */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500">
                  <div>
                    {(form.copyrightText || '© {year} WebCraft Goods').replace('{year}', String(new Date().getFullYear()))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {form.showThemeIndicator !== false && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 text-[8px] font-mono">
                        {effectiveTheme.name}
                      </span>
                    )}
                    {form.showBackToTop !== false && (
                      <span className="text-slate-400 flex items-center gap-0.5">
                        <span>Top</span>
                        <ArrowUp className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                All changes made here are saved directly to Firestore and immediately visible to every visitor.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
