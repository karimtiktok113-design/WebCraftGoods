import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, Star } from 'lucide-react';
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
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.purchaseLink) {
      try {
        const opened = window.open(product.purchaseLink, '_blank', 'noopener,noreferrer');
        if (!opened) {
          window.location.href = product.purchaseLink;
        }
      } catch {
        window.location.href = product.purchaseLink;
      }
    } else {
      onSelect(product);
    }
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-500/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 transform-gpu cursor-pointer h-full"
    >
      {/* 1:1 Aspect Ratio Square Image Area - Clean & Unobscured (No tags on top of image) */}
      <div
        className="relative w-full aspect-square bg-slate-950 overflow-hidden select-none shrink-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images Track */}
        <div className="w-full h-full relative">
          <img
            src={images[currentImageIndex] || images[0]}
            alt={`${product.title} view ${currentImageIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out ${
              isHovered && !hasMultipleImages ? 'group-hover:scale-105' : ''
            }`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800';
            }}
          />
        </div>

        {/* Carousel Navigation Arrows (Desktop hover or mobile tap) */}
        {hasMultipleImages && (
          <>
            <button
              id={`prev-image-btn-${product.id}`}
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/70 shadow-md backdrop-blur-sm transition-opacity duration-200 z-10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-200" />
            </button>

            <button
              id={`next-image-btn-${product.id}`}
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/70 shadow-md backdrop-blur-sm transition-opacity duration-200 z-10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 z-10 pointer-events-auto">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    idx === currentImageIndex
                      ? 'w-3.5 h-1 bg-amber-400'
                      : 'w-1 h-1 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Content Details (Daraz/Etsy Layout) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags & Badges Row (Properly adjusted inside the card, OFF the image) */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-slate-300 text-[10px] sm:text-[11px] font-medium tracking-wide truncate max-w-[110px] sm:max-w-[130px]">
              {product.category}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              {product.isDiscounted && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  {product.discountPercentage ? `-${product.discountPercentage}%` : 'SALE'}
                </span>
              )}
              {product.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${
                    product.badge.toLowerCase().includes('best')
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : product.badge.toLowerCase().includes('new')
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Title (Clean 2-line clamp with uniform height for clean grid alignment) */}
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug min-h-[2.1rem] sm:min-h-[2.5rem] mb-1.5">
            {product.title}
          </h3>

          {/* Etsy/Daraz Social Proof / Trust Line */}
          <div className="flex items-center gap-1.5 text-[11px] mb-2 text-slate-400">
            <div className="flex items-center text-amber-400 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span>5.0</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px] truncate">
              Instant Download
            </span>
          </div>

          {/* Price display with discount details */}
          <div className="flex items-baseline gap-1.5 mb-2.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-amber-400 font-heading tabular-nums">
              {product.price}
            </span>
            {product.isDiscounted && product.originalPrice && (
              <span className="text-[11px] sm:text-xs text-slate-500 line-through tabular-nums font-normal">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Bar - Compact, 2-column on mobile & desktop */}
        <div className="pt-2 sm:pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5 mt-auto">
          <button
            id={`details-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700/60 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Eye className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">View</span>
          </button>

          <button
            id={`purchase-btn-${product.id}`}
            type="button"
            onClick={handlePurchaseClick}
            className="shimmer-btn flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-all shadow-sm shadow-amber-500/20 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <ShoppingCart className="w-3 h-3 shrink-0" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
