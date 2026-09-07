import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CheckCircle2,
  Download,
  ShieldCheck,
  RefreshCw,
  Share2,
  ExternalLink,
  Sparkles,
  Check,
  Tag,
  Layers,
  ArrowUpRight,
  Maximize2,
  ZoomIn,
  X,
  Eye,
} from 'lucide-react';
import { Product } from '../types';
import { FormattedDescription } from './FormattedDescription';
import { useData } from '../context/DataContext';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { products } = useData();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Scroll to top whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setIsLightboxOpen(false);
  }, [product.id]);

  // Handle lightbox escape key & arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, product.images]);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'];

  const hasMultipleImages = images.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handlePurchase = () => {
    if (product.purchaseLink) {
      window.open(product.purchaseLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Related products from catalog
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status !== 'draft')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 w-full overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Breadcrumbs & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs text-slate-400">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Back to All Products</span>
          </button>

          <div className="flex items-center gap-2 text-slate-500">
            <span
              onClick={onBack}
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Marketplace
            </span>
            <span>/</span>
            <span className="text-slate-400">{product.category}</span>
            <span>/</span>
            <span className="text-amber-400 font-medium truncate max-w-[180px] sm:max-w-xs">
              {product.title}
            </span>
          </div>
        </div>

        {/* TOP SECTION: 2-COLUMN GRID (LEFT: IMAGE GALLERY WITH OVERVIEW | RIGHT: HEADLINE, TAGLINE, PURCHASE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
          {/* LEFT SIDE: PRODUCT IMAGE (NORMAL PROPORTIONAL SQUARE SIZE + CLICK TO OPEN OVERVIEW) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Square Aspect Ratio Image Box */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="group relative w-full aspect-square max-w-[440px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl select-none flex items-center justify-center cursor-zoom-in transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              title="Click to view full size overview"
            >
              <img
                src={images[selectedImageIndex]}
                alt={`${product.title} gallery visual`}
                className="w-full h-full aspect-square object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Hover Zoom Prompt Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none">
                <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md">
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>Click for Full Overview</span>
                </div>
              </div>

              {/* Category & Tag Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-semibold shadow-md">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{product.badge}</span>
                  </span>
                )}
              </div>

              {/* Prev / Next Inline Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous image"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-xl backdrop-blur-md transition-all active:scale-95 z-20 opacity-80 hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next image"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-xl backdrop-blur-md transition-all active:scale-95 z-20 opacity-80 hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Counter Tag */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-medium text-slate-300 border border-slate-800 shadow-md pointer-events-none">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {hasMultipleImages && (
              <div className="mt-4 flex items-center justify-center gap-2.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 active:scale-95 bg-slate-950 ${
                      idx === selectedImageIndex
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full aspect-square object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: HEADLINE, TAGLINE & PURCHASE BUTTON */}
          <div className="lg:col-span-7 flex flex-col justify-between pt-1">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-semibold">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* 1. HEADLINE (TITLE) */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading tracking-tight leading-tight mb-3">
                {product.title}
              </h1>

              {/* Price Tag with tabular numbers and nowrap */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 font-heading whitespace-nowrap tabular-nums">
                  {product.price}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  One-time fee • Lifetime license & updates included
                </span>
              </div>

              {/* 2. TAGLINE (SUBHEADING) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1.5">
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Product Tagline</span>
                </div>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  {product.shortDescription ||
                    'Premium handcrafted digital architecture designed for high-efficiency modern workflows.'}
                </p>
              </div>

              {/* Trust Value Points */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 min-w-0">
                  <Download className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Instant Download</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Commercial Rights</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 min-w-0">
                  <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Lifetime Updates</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Verified Clean Code</span>
                </div>
              </div>
            </div>

            {/* 3. PURCHASE BUTTON & SHARE */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2.5 sm:gap-3">
              <button
                id="product-page-purchase-btn"
                onClick={handlePurchase}
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm md:text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-95 whitespace-nowrap min-w-0"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">Purchase Now</span>
                <span className="opacity-80 font-black whitespace-nowrap tabular-nums">({product.price})</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
              </button>

              <button
                onClick={handleShare}
                title="Copy share link"
                className="p-3 sm:p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shrink-0 active:scale-95 relative"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-lg">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION (CENTERED & PROPER FULL WIDTH): DESCRIPTION, SPECIFICATIONS, DELIVERABLES & GUARANTEES */}
        <section id="product-full-content-section" className="pt-8 border-t border-slate-800/80">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Detailed Description Block */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-amber-400 font-heading mb-6 flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Complete Product Description & Overview</span>
              </h2>

              <div className="text-slate-300 text-sm sm:text-base leading-relaxed">
                <FormattedDescription
                  content={product.description || product.shortDescription}
                  className="space-y-4"
                />
              </div>

              {/* Features / Deliverables Checklist */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                    Key Deliverables Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky Purchase Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h4 className="text-base font-bold text-white font-heading">
                  Ready to upgrade your workflow with {product.title}?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant digital download with free lifetime updates and commercial license.
                </p>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                <span>Get It Now for {product.price}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-slate-800/80">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                  More From WebCraft Goods
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Discover more digital tools, Notion systems, and developer boilerplates.
                </p>
              </div>

              <button
                onClick={onBack}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 relative">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                      alt={p.title}
                      className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 border border-slate-800">
                      {p.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors truncate">
                      {p.title}
                    </h4>
                    <span className="font-bold text-amber-400 text-sm shrink-0">
                      {p.price}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {p.shortDescription}
                  </p>

                  <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 font-semibold">
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FULL-SCREEN IMAGE OVERVIEW / LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          id="product-image-lightbox-backdrop"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-lg animate-fadeIn select-none"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close Overview"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shadow-2xl transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          {hasMultipleImages && (
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-2xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {hasMultipleImages && (
            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-2xl transition-all active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Central Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center animate-scaleUp"
          >
            <img
              src={images[selectedImageIndex]}
              alt={`${product.title} full overview`}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
              referrerPolicy="no-referrer"
            />

            {/* Bottom Caption & Thumbnails inside Lightbox */}
            <div className="mt-4 flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-semibold text-white truncate max-w-xs">
                {product.title}
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {selectedImageIndex + 1} of {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
