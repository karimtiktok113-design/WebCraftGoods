import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  HelpCircle,
  Globe,
  Mail,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  LogOut,
  Database,
  Search,
  Eye,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Check,
  Loader2,
  UploadCloud,
  MessageSquare,
  AlertCircle,
  Palette,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Product, Feature, FAQ } from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
import { ThemeSettingsTab } from './ThemeSettingsTab';
import { INITIAL_WEBSITE_CONTENT } from '../../lib/sampleData';
import { compressImageFile } from '../../lib/imageUtils';

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'overview' | 'products' | 'features' | 'faqs' | 'content' | 'theme' | 'messages';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const {
    products,
    features,
    faqs,
    websiteContent,
    messages,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    addFeature,
    updateFeature,
    deleteFeature,
    addFaq,
    updateFaq,
    deleteFaq,
    updateWebsiteContent,
    updateMessageStatus,
    deleteMessage,
    seedInitialDataToFirestore,
    isSeeding,
  } = useData();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Product editor state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Feature editor state
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureForm, setFeatureForm] = useState({ icon: 'Sparkles', heading: '', description: '', order: 1 });

  // FAQ editor state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order: 1 });

  // Website Content state
  const [heroForm, setHeroForm] = useState(websiteContent.hero);
  const [aboutForm, setAboutForm] = useState(websiteContent.about);
  const [footerForm, setFooterForm] = useState(websiteContent.footer);
  const [contentSavedToast, setContentSavedToast] = useState(false);
  const [savingSection, setSavingSection] = useState<'hero' | 'about' | 'footer' | null>(null);
  const [savedSectionSuccess, setSavedSectionSuccess] = useState<'hero' | 'about' | 'footer' | null>(null);
  const [contentError, setContentError] = useState('');
  const [heroUploading, setHeroUploading] = useState(false);
  const [aboutUploading, setAboutUploading] = useState(false);
  const hasLoadedCms = useRef(false);

  // Synchronize CMS form values initially once loaded, without wiping out user edits during active typing
  useEffect(() => {
    if (websiteContent && !hasLoadedCms.current) {
      if (websiteContent.hero) {
        setHeroForm({ ...INITIAL_WEBSITE_CONTENT.hero, ...websiteContent.hero });
      }
      if (websiteContent.about) {
        setAboutForm({ ...INITIAL_WEBSITE_CONTENT.about, ...websiteContent.about });
      }
      if (websiteContent.footer) {
        setFooterForm({ ...INITIAL_WEBSITE_CONTENT.footer, ...websiteContent.footer });
      }
      hasLoadedCms.current = true;
    }
  }, [websiteContent]);

  // Explicit reset functions to pull fresh data from live website content
  const handleResetHero = () => {
    if (websiteContent.hero) {
      setHeroForm({ ...INITIAL_WEBSITE_CONTENT.hero, ...websiteContent.hero });
    }
  };

  const handleResetAbout = () => {
    if (websiteContent.about) {
      setAboutForm({ ...INITIAL_WEBSITE_CONTENT.about, ...websiteContent.about });
    }
  };

  const handleResetFooter = () => {
    if (websiteContent.footer) {
      setFooterForm({
        ...INITIAL_WEBSITE_CONTENT.footer,
        ...websiteContent.footer,
        column1Links:
          Array.isArray(websiteContent.footer.column1Links) && websiteContent.footer.column1Links.length > 0
            ? websiteContent.footer.column1Links
            : INITIAL_WEBSITE_CONTENT.footer.column1Links,
        column2Links:
          Array.isArray(websiteContent.footer.column2Links) && websiteContent.footer.column2Links.length > 0
            ? websiteContent.footer.column2Links
            : INITIAL_WEBSITE_CONTENT.footer.column2Links,
      });
    }
  };

  // Footer dynamic links management
  const handleAddCol1Link = () => {
    const current = footerForm.column1Links || [];
    setFooterForm({
      ...footerForm,
      column1Links: [
        ...current,
        { id: `col1-${Date.now()}`, label: 'New Link', href: '#products' },
      ],
    });
  };

  const handleUpdateCol1Link = (index: number, field: 'label' | 'href', value: string) => {
    const current = [...(footerForm.column1Links || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setFooterForm({ ...footerForm, column1Links: current });
    }
  };

  const handleDeleteCol1Link = (index: number) => {
    const current = [...(footerForm.column1Links || [])];
    current.splice(index, 1);
    setFooterForm({ ...footerForm, column1Links: current });
  };

  const handleAddCol2Link = () => {
    const current = footerForm.column2Links || [];
    setFooterForm({
      ...footerForm,
      column2Links: [
        ...current,
        { id: `col2-${Date.now()}`, label: 'New Link', href: '#about' },
      ],
    });
  };

  const handleUpdateCol2Link = (index: number, field: 'label' | 'href', value: string) => {
    const current = [...(footerForm.column2Links || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setFooterForm({ ...footerForm, column2Links: current });
    }
  };

  const handleDeleteCol2Link = (index: number) => {
    const current = [...(footerForm.column2Links || [])];
    current.splice(index, 1);
    setFooterForm({ ...footerForm, column2Links: current });
  };

  // Image upload handler for Hero mockup
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setHeroUploading(true);
    setContentError('');
    try {
      const compressed = await compressImageFile(files[0], 1200, 0.8);
      setHeroForm((prev) => ({ ...prev, heroImage: compressed }));
    } catch (err: any) {
      setContentError(err.message || 'Failed to process hero image');
    } finally {
      setHeroUploading(false);
    }
  };

  // Image upload handler for About brand image
  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAboutUploading(true);
    setContentError('');
    try {
      const compressed = await compressImageFile(files[0], 1000, 0.8);
      setAboutForm((prev) => ({ ...prev, brandImage: compressed }));
    } catch (err: any) {
      setContentError(err.message || 'Failed to process brand image');
    } finally {
      setAboutUploading(false);
    }
  };

  // Filtered products for admin
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await addProduct(productData);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleClearAllProducts = async () => {
    if (confirm(`Are you sure you want to delete all ${products.length} products from your catalog?`)) {
      await clearAllProducts();
    }
  };

  // Feature operations
  const handleOpenNewFeature = () => {
    setEditingFeature(null);
    setFeatureForm({ icon: 'Sparkles', heading: '', description: '', order: features.length + 1 });
    setIsFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (feat: Feature) => {
    setEditingFeature(feat);
    setFeatureForm({ icon: feat.icon, heading: feat.heading, description: feat.description, order: feat.order || 1 });
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureForm.heading || !featureForm.description) return;
    if (editingFeature) {
      await updateFeature(editingFeature.id, featureForm);
    } else {
      await addFeature(featureForm);
    }
    setIsFeatureModalOpen(false);
  };

  // FAQ operations
  const handleOpenNewFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '', order: faqs.length + 1 });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer, order: faq.order || 1 });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    if (editingFaq) {
      await updateFaq(editingFaq.id, faqForm);
    } else {
      await addFaq(faqForm);
    }
    setIsFaqModalOpen(false);
  };

  // Website Content Save
  const handleSaveHeroContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection('hero');
    setContentError('');
    setSavedSectionSuccess(null);
    try {
      await updateWebsiteContent('hero', heroForm);
      setSavedSectionSuccess('hero');
      triggerSavedToast();
      setTimeout(() => setSavedSectionSuccess((prev) => (prev === 'hero' ? null : prev)), 4000);
    } catch (err: any) {
      setContentError(err.message || 'Failed to save Hero section. Please try again.');
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAboutContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection('about');
    setContentError('');
    setSavedSectionSuccess(null);
    try {
      await updateWebsiteContent('about', aboutForm);
      setSavedSectionSuccess('about');
      triggerSavedToast();
      setTimeout(() => setSavedSectionSuccess((prev) => (prev === 'about' ? null : prev)), 4000);
    } catch (err: any) {
      setContentError(err.message || 'Failed to save About section. Please try again.');
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveFooterContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection('footer');
    setContentError('');
    setSavedSectionSuccess(null);
    try {
      await updateWebsiteContent('footer', footerForm);
      setSavedSectionSuccess('footer');
      triggerSavedToast();
      setTimeout(() => setSavedSectionSuccess((prev) => (prev === 'footer' ? null : prev)), 4000);
    } catch (err: any) {
      setContentError(err.message || 'Failed to save Footer section. Please try again.');
    } finally {
      setSavingSection(null);
    }
  };

  const triggerSavedToast = () => {
    setContentSavedToast(true);
    setTimeout(() => setContentSavedToast(false), 3500);
  };

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div id="admin-panel-root" className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Website
          </button>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white font-heading">
              WebCraft<span className="text-amber-400">Admin</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Firestore CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Sync Active</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Products & Gallery</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${currentTab === 'products' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('features')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'features'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Features</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${currentTab === 'features' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                {features.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('faqs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'faqs'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>FAQs</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${currentTab === 'faqs' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                {faqs.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('content')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'content'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>Website Content</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('theme')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'theme'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4" />
                <span>Theme & Branding</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  currentTab === 'theme'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                Themes
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'messages'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Inbound Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Seed Initial Data Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1.5">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Database Sync</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Seed all default products, multi-image galleries, features, and FAQs to your Firestore collections.
            </p>
            <button
              id="admin-seed-database-btn"
              disabled={isSeeding}
              onClick={seedInitialDataToFirestore}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              {isSeeding ? 'Writing to Firestore...' : 'Seed Initial Data'}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          {/* Responsive Mobile Tab Navigation Bar */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-800 shrink-0">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'products' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setCurrentTab('features')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'features' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Features ({features.length})
            </button>
            <button
              onClick={() => setCurrentTab('faqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'faqs' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              FAQs ({faqs.length})
            </button>
            <button
              onClick={() => setCurrentTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'content' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Website Content
            </button>
            <button
              onClick={() => setCurrentTab('theme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'theme' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Themes & Modes
            </button>
            <button
              onClick={() => setCurrentTab('messages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                currentTab === 'messages' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              Messages {unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}
            </button>
          </div>

          {contentSavedToast && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Website Content saved to Firestore successfully!</span>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading mb-1">
                  CMS Analytics & Content Overview
                </h2>
                <p className="text-xs text-slate-400">
                  Manage your WebCraft Goods marketplace offerings in real time with Firebase Firestore.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Total Products</div>
                    <div className="text-3xl font-extrabold text-white font-heading mt-1">
                      {products.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Features Configured</div>
                    <div className="text-3xl font-extrabold text-white font-heading mt-1">
                      {features.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Active FAQs</div>
                    <div className="text-3xl font-extrabold text-white font-heading mt-1">
                      {faqs.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Inbound Inquiries</div>
                    <div className="text-3xl font-extrabold text-white font-heading mt-1">
                      {messages.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">Ready to add a new digital release?</h4>
                  <p className="text-xs text-slate-400">
                    Upload multiple 1:1 square preview screens, pricing tiers, and direct purchase checkout links.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleOpenNewProduct}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </button>
                  <button
                    onClick={() => setCurrentTab('content')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                    Customize Hero & Content
                  </button>
                </div>
              </div>

              {/* Recent Products Snapshot */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-heading">Product Catalog Overview</h3>
                  <button
                    onClick={() => setCurrentTab('products')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View all products →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3 items-center"
                    >
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                        alt={prod.title}
                        className="w-14 h-14 rounded-lg object-cover aspect-square bg-slate-950 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                        <div className="text-[11px] text-amber-400 font-semibold">{prod.price}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {prod.images?.length || 1} images • {prod.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {currentTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Products & Gallery Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add, edit, reorder multiple 1:1 square preview images, and set purchase links.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {products.length > 0 && (
                    <button
                      onClick={handleClearAllProducts}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-semibold transition-colors"
                      title="Delete all products"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                  <button
                    id="admin-add-product-btn"
                    onClick={handleOpenNewProduct}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by title or category..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Products Table & Mobile Cards */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {/* Mobile View: Cards */}
                <div className="block md:hidden divide-y divide-slate-800/80">
                  {filteredProducts.map((prod) => (
                    <div key={prod.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                            alt={prod.title}
                            className="w-full h-full object-cover aspect-square"
                            referrerPolicy="no-referrer"
                          />
                          {prod.images?.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[10px] font-mono text-amber-400 px-1 rounded">
                              {prod.images.length}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-sm truncate">{prod.title}</span>
                            <span className="font-bold text-amber-400 text-sm shrink-0">{prod.price}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{prod.shortDescription}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                              {prod.category}
                            </span>
                            {prod.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                                {prod.badge}
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                prod.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/50">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit Product</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Product & Gallery</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Badge</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-900/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                                <img
                                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                                  alt={prod.title}
                                  className="w-full h-full object-cover aspect-square"
                                  referrerPolicy="no-referrer"
                                />
                                {prod.images?.length > 1 && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-slate-950/80 text-[9px] font-mono text-amber-400 px-1 rounded">
                                    {prod.images.length}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{prod.title}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                  {prod.shortDescription}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{prod.category}</td>
                          <td className="py-3 px-4 font-bold text-amber-400">{prod.price}</td>
                          <td className="py-3 px-4">
                            {prod.badge ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                                {prod.badge}
                              </span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                prod.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-14 text-center">
                            <Package className="w-10 h-10 text-slate-700 mx-auto mb-2.5" />
                            <p className="text-sm font-semibold text-slate-200">No products found</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              {products.length === 0
                                ? 'All pre-made products have been removed. Click "Add New Product" to create and publish your first product to Firestore.'
                                : 'No products matched your search filter.'}
                            </p>
                            {products.length === 0 && (
                              <button
                                onClick={handleOpenNewProduct}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create First Product</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FEATURES TAB */}
          {currentTab === 'features' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Features Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Control the core value propositions and capabilities displayed on the public site.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewFeature}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px]">
                          Icon: {feat.icon}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditFeature(feat)}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteFeature(feat.id)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{feat.heading}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS TAB */}
          {currentTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">FAQ Management</h2>
                  <p className="text-xs text-slate-400">
                    Add and update frequently asked questions stored directly in Firestore.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewFaq}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditFaq(faq)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WEBSITE CONTENT CMS TAB */}
          {currentTab === 'content' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">
                  Website Content Management
                </h2>
                <p className="text-xs text-slate-400">
                  Update Hero headlines, About mission and live stats, and Footer brand details with instant live sync.
                </p>
              </div>

              {contentError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{contentError}</span>
                </div>
              )}

              {/* Hero Settings Form */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-heading">Hero Section CMS</h3>
                  <span className="text-[11px] text-amber-400 font-mono">Live Website Topfold</span>
                </div>
                <form onSubmit={handleSaveHeroContent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                    <input
                      type="text"
                      required
                      value={heroForm.heading}
                      onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={heroForm.badgeText}
                        onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Mockup Image</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={heroForm.heroImage}
                          onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                          placeholder="Image URL or upload"
                          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{heroUploading ? 'Compressing...' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={heroUploading}
                            onChange={handleHeroImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {heroForm.heroImage && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <img
                        src={heroForm.heroImage}
                        alt="Hero Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-[11px] text-slate-400">
                        <span className="text-slate-200 font-semibold block">Hero Image Loaded</span>
                        Displays prominently on the right side of the hero section.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button Label</label>
                      <input
                        type="text"
                        value={heroForm.primaryButtonText}
                        onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button Link</label>
                      <input
                        type="text"
                        value={heroForm.primaryButtonLink || '#products'}
                        onChange={(e) => setHeroForm({ ...heroForm, primaryButtonLink: e.target.value })}
                        placeholder="#products or https://"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Button Label</label>
                      <input
                        type="text"
                        value={heroForm.secondaryButtonText}
                        onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Button Link</label>
                      <input
                        type="text"
                        value={heroForm.secondaryButtonLink || '#features'}
                        onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonLink: e.target.value })}
                        placeholder="#features or https://"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleResetHero}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                      title="Reset form to currently live website data"
                    >
                      Reset to Live Content
                    </button>
                    <div className="flex items-center justify-end gap-3">
                      {savedSectionSuccess === 'hero' && (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Hero Saved Live!</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={savingSection === 'hero'}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {savingSection === 'hero' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Saving to Firestore...</span>
                          </>
                        ) : (
                          <span>Save Hero Settings</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* About Settings Form */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-heading">About Section CMS</h3>
                  <span className="text-[11px] text-amber-400 font-mono">Mission & Visuals</span>
                </div>
                <form onSubmit={handleSaveAboutContent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">About Heading</label>
                    <input
                      type="text"
                      required
                      value={aboutForm.heading}
                      onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={aboutForm.description}
                      onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mission Statement</label>
                      <textarea
                        rows={2}
                        value={aboutForm.mission}
                        onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Vision Statement</label>
                      <textarea
                        rows={2}
                        value={aboutForm.vision}
                        onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">About Showcase Image</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={aboutForm.brandImage}
                        onChange={(e) => setAboutForm({ ...aboutForm, brandImage: e.target.value })}
                        placeholder="Image URL or upload"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                      <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{aboutUploading ? 'Compressing...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={aboutUploading}
                          onChange={handleAboutImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {aboutForm.brandImage && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <img
                        src={aboutForm.brandImage}
                        alt="About Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-[11px] text-slate-400">
                        <span className="text-slate-200 font-semibold block">Brand Image Loaded</span>
                        Displays on the About section story card.
                      </div>
                    </div>
                  )}

                  {/* About Stats Editor */}
                  {aboutForm.stats && aboutForm.stats.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Key Performance Metrics & Stats
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {aboutForm.stats.map((st, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3"
                          >
                            <div className="flex-1">
                              <span className="text-[10px] text-slate-500 block mb-0.5">Label</span>
                              <input
                                type="text"
                                value={st.label}
                                onChange={(e) => {
                                  const newStats = [...aboutForm.stats];
                                  newStats[idx] = { ...newStats[idx], label: e.target.value };
                                  setAboutForm({ ...aboutForm, stats: newStats });
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
                              />
                            </div>
                            <div className="w-32">
                              <span className="text-[10px] text-slate-500 block mb-0.5">Value</span>
                              <input
                                type="text"
                                value={st.value}
                                onChange={(e) => {
                                  const newStats = [...aboutForm.stats];
                                  newStats[idx] = { ...newStats[idx], value: e.target.value };
                                  setAboutForm({ ...aboutForm, stats: newStats });
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleResetAbout}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                      title="Reset form to currently live website data"
                    >
                      Reset to Live Content
                    </button>
                    <div className="flex items-center justify-end gap-3">
                      {savedSectionSuccess === 'about' && (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>About Saved Live!</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={savingSection === 'about'}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {savingSection === 'about' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Saving to Firestore...</span>
                          </>
                        ) : (
                          <span>Save About Settings</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Settings Form */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-heading">Footer Settings CMS</h3>
                  <span className="text-[11px] text-amber-400 font-mono">Contact & Socials</span>
                </div>
                <form onSubmit={handleSaveFooterContent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Description</label>
                    <textarea
                      rows={2}
                      value={footerForm.brandDescription}
                      onChange={(e) => setFooterForm({ ...footerForm, brandDescription: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                      <input
                        type="email"
                        required
                        value={footerForm.contactEmail}
                        onChange={(e) => setFooterForm({ ...footerForm, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Copyright Text</label>
                      <input
                        type="text"
                        value={footerForm.copyrightText}
                        onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Social Links Form */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Social Profile Links</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Twitter / X URL</span>
                        <input
                          type="text"
                          value={footerForm.socialLinks?.twitter || ''}
                          onChange={(e) =>
                            setFooterForm({
                              ...footerForm,
                              socialLinks: {
                                ...(footerForm.socialLinks || { github: '', dribbble: '', linkedin: '' }),
                                twitter: e.target.value,
                              },
                            })
                          }
                          placeholder="https://twitter.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">GitHub URL</span>
                        <input
                          type="text"
                          value={footerForm.socialLinks?.github || ''}
                          onChange={(e) =>
                            setFooterForm({
                              ...footerForm,
                              socialLinks: {
                                ...(footerForm.socialLinks || { twitter: '', dribbble: '', linkedin: '' }),
                                github: e.target.value,
                              },
                            })
                          }
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Dribbble URL</span>
                        <input
                          type="text"
                          value={footerForm.socialLinks?.dribbble || ''}
                          onChange={(e) =>
                            setFooterForm({
                              ...footerForm,
                              socialLinks: {
                                ...(footerForm.socialLinks || { twitter: '', github: '', linkedin: '' }),
                                dribbble: e.target.value,
                              },
                            })
                          }
                          placeholder="https://dribbble.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">LinkedIn URL</span>
                        <input
                          type="text"
                          value={footerForm.socialLinks?.linkedin || ''}
                          onChange={(e) =>
                            setFooterForm({
                              ...footerForm,
                              socialLinks: {
                                ...(footerForm.socialLinks || { twitter: '', github: '', dribbble: '' }),
                                linkedin: e.target.value,
                              },
                            })
                          }
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleResetFooter}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                      title="Reset form to currently live website data"
                    >
                      Reset to Live Content
                    </button>
                    <div className="flex items-center justify-end gap-3">
                      {savedSectionSuccess === 'footer' && (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Footer Saved Live!</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={savingSection === 'footer'}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {savingSection === 'footer' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Saving to Firestore...</span>
                          </>
                        ) : (
                          <span>Save Footer Settings</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* INBOUND MESSAGES TAB */}
          {currentTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">
                  Inbound Customer Inquiries
                </h2>
                <p className="text-xs text-slate-400">
                  Submissions received from the public website contact form, stored directly in Firestore.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white">No inquiries yet</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    When visitors submit the contact form, their messages will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.status === 'unread'
                          ? 'bg-slate-900 border-amber-500/40 shadow-md'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                            <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                            {msg.status === 'unread' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-amber-400 mt-0.5">
                            {msg.subject || 'General Inquiry'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'WebCraft Goods Inquiry')}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                          >
                            Reply
                          </a>
                          <button
                            onClick={() => updateMessageStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          >
                            Mark {msg.status === 'unread' ? 'Read' : 'Unread'}
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-light mt-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                        {msg.message}
                      </p>
                      <div className="text-[10px] text-slate-500 mt-2 font-mono">
                        Received: {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* THEME & BRANDING TAB */}
          {currentTab === 'theme' && <ThemeSettingsTab />}
        </main>
      </div>

      {/* Product Editor Modal */}
      <ProductEditorModal
        key={editingProduct ? editingProduct.id : 'new-product'}
        product={editingProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Feature Editor Modal */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingFeature ? 'Edit Feature' : 'Add New Feature'}
            </h3>
            <form onSubmit={handleSaveFeature} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Lucide Icon Name</label>
                <select
                  value={featureForm.icon}
                  onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                >
                  <option value="Zap">Zap</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="RefreshCw">RefreshCw</option>
                  <option value="Sparkles">Sparkles</option>
                  <option value="Layers">Layers</option>
                  <option value="Headphones">Headphones</option>
                  <option value="Code2">Code2</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Palette">Palette</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Heading</label>
                <input
                  type="text"
                  required
                  value={featureForm.heading}
                  onChange={(e) => setFeatureForm({ ...featureForm, heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none resize-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Editor Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>
            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none resize-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
