import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, PackageOpen, Layers } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { useData } from '../context/DataContext';

interface ProductsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onSelectProduct }) => {
  const { products, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setActiveModalProduct(product);
    }
  };

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active unless explicitly checking
      if (p.status === 'draft') return false;

      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden w-full">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Digital Product Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-3 sm:mb-4">
            Handcrafted Software & Productivity Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            Every product is engineered with extreme attention to detail, lifetime updates, and commercial usage rights included.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 active:scale-95 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or templates..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 text-base sm:text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 animate-pulse aspect-square flex flex-col justify-between"
              >
                <div className="w-full aspect-square bg-slate-800/60 rounded-xl mb-4" />
                <div className="h-5 bg-slate-800/80 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-800/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Products Grid with 1:1 Aspect Ratio Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => handleProductSelect(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Catalog State */
          <div className="text-center py-20 bg-slate-900/30 border border-slate-800/60 rounded-3xl max-w-lg mx-auto p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <PackageOpen className="w-6 h-6" />
            </div>
            {products.length === 0 ? (
              <>
                <h3 className="text-lg font-bold text-white font-heading mb-2">
                  Catalog Ready For New Products
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Pre-made sample products have been cleared. Products added through your Admin Panel will be stored in Firestore and published here in real-time.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white font-heading mb-2">No matching products</h3>
                <p className="text-xs text-slate-400 mb-6">
                  No products matched "{searchQuery}" in category "{selectedCategory}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
};
