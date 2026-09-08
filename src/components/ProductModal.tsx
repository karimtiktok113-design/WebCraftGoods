import React, { useState, useEffect, useRef } from 'react';
import {
  X,
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
} from 'lucide-react';
import { Product } from '../types';
import { FormattedDescription } from './FormattedDescription';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'];

  const hasMultipleImages = images.length > 1;

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
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
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePurchase = () => {
    if (product.purchaseLink) {
      window.open(product.purchaseLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id="product-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        id="product-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl my-auto animate-scaleUp text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/85 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 transition-colors shadow-lg active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto flex-1">
          {/* Left Column: 1:1 Square Image Gallery */}
          <div className="md:col-span-6 p-4 sm:p-6 md:p-8 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col items-center justify-center">
            {/* 1:1 Aspect Ratio Main Image Viewer */}
            <div
              className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-inner select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`${product.title} gallery preview`}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Buttons */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/85 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 shadow-xl backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/85 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 shadow-xl backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Counter Tag */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono font-medium text-slate-300 border border-slate-800">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery Below Main Image */}
            {hasMultipleImages && (
              <div className="w-full mt-3 sm:mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 active:scale-95 ${
                      idx === selectedImageIndex
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Features & Checkout */}
          <div className="md:col-span-6 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Header Badges */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] sm:text-xs font-semibold">
                  {product.category}
                </span>
                {product.isDiscounted && (
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] sm:text-xs font-bold">
                    {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'ON SALE'}
                  </span>
                )}
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex flex-row items-baseline justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight min-w-0 flex-1">
                  {product.title}
                </h2>
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 font-heading whitespace-nowrap tabular-nums">
                    {product.price}
                  </span>
                  {product.isDiscounted && product.originalPrice && (
                    <span className="text-xs sm:text-sm text-slate-400 line-through tabular-nums font-medium">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Short & Full Description with structured paragraphs & bullets */}
              <div className="mb-5 sm:mb-6">
                <FormattedDescription
                  content={product.description || product.shortDescription}
                  className="text-slate-300 text-xs sm:text-sm"
                />
              </div>

              {/* Features Checklist */}
              {product.features && product.features.length > 0 && (
                <div className="mb-5 sm:mb-6">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
                    Key Deliverables & Features
                  </h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Licensing & Trust Benefits */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-5 sm:mb-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Instant File Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Commercial License</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Free Future Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Zero Vendor Lock-in</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center gap-2.5 sm:gap-3 mt-auto">
              <button
                id="modal-purchase-now-btn"
                onClick={handlePurchase}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Purchase & Download</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
              </button>

              <button
                id="modal-share-btn"
                onClick={handleShare}
                title="Copy share link"
                className="p-3 sm:p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shrink-0 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
