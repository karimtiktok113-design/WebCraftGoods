import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, ExternalLink, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'];

  const hasMultipleImages = images.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next image
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right -> prev image
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.purchaseLink) {
      window.open(product.purchaseLink, '_blank', 'noopener,noreferrer');
    } else {
      onSelect(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* 1:1 Aspect Ratio Square Image Area / Carousel */}
      <div
        className="relative w-full aspect-square bg-slate-950 overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images Track */}
        <div className="w-full h-full relative">
          {images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`${product.title} view ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
                idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              } ${isHovered && !hasMultipleImages ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        {/* Top Badges: Category & Tag Badge */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[11px] font-semibold tracking-wide shadow-sm">
            {product.category}
          </span>

          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
                product.badge.toLowerCase().includes('best')
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  : product.badge.toLowerCase().includes('new')
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-indigo-500/90 text-white border border-indigo-400/30'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Carousel Navigation Arrows (desktop hover or mobile always available) */}
        {hasMultipleImages && (
          <>
            <button
              id={`prev-image-btn-${product.id}`}
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/70 shadow-lg backdrop-blur-sm transition-opacity duration-200 z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-slate-200" />
            </button>

            <button
              id={`next-image-btn-${product.id}`}
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/70 shadow-lg backdrop-blur-sm transition-opacity duration-200 z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-slate-200" />
            </button>

            {/* Pagination Dots Overlay */}
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    idx === currentImageIndex
                      ? 'w-5 h-1.5 bg-amber-400'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Title with strict whitespace-nowrap and tabular numbers */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors flex-1 min-w-0">
              {product.title}
            </h3>
            <span className="text-base sm:text-lg font-black text-amber-400 font-heading shrink-0 whitespace-nowrap tabular-nums pl-1.5">
              {product.price}
            </span>
          </div>

          {/* Short description */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3.5 font-light">
            {product.shortDescription}
          </p>

          {/* Features Preview tags */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.features.slice(0, 2).map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 font-medium whitespace-nowrap"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800/50 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons Action Bar - clean, responsive single line per button */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 mt-auto">
          <button
            id={`details-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-[11px] sm:text-xs font-semibold transition-colors border border-slate-700/60 active:scale-95 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">View Product</span>
          </button>

          <button
            id={`purchase-btn-${product.id}`}
            type="button"
            onClick={handlePurchaseClick}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-bold transition-all shadow-sm shadow-amber-500/20 active:scale-95 whitespace-nowrap"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Purchase</span>
          </button>
        </div>
      </div>
    </div>
  );
};
