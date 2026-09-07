import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/ProductsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ProductPage } from './components/ProductPage';
import { Product } from './types';

const MainLayout: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { products } = useData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync with browser hash (#product-{id}) for direct links and browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '' || hash === '#hero' || hash === '#products') {
        setSelectedProduct(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#product-')) {
      window.history.pushState('', document.title, window.location.pathname + '#products');
    }
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans w-full max-w-full overflow-x-hidden flex flex-col">
      {/* Customer-Facing Public Website Header */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        onNavigateHome={handleBackToCatalog}
        isProductPage={Boolean(selectedProduct)}
      />

      <main className="w-full max-w-full overflow-x-hidden flex-1">
        {selectedProduct ? (
          /* Full Product Page as requested */
          <ProductPage
            product={selectedProduct}
            onBack={handleBackToCatalog}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          /* Main Homepage & Catalog Layout */
          <>
            <Hero />
            <ProductsSection onSelectProduct={handleSelectProduct} />
            <FeaturesSection />
            <AboutSection />
            <FaqSection />
            <ContactSection />
          </>
        )}
      </main>

      <Footer
        onOpenAdmin={handleOpenAdmin}
        onNavigateHome={handleBackToCatalog}
      />

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Full Admin CMS Panel */}
      {isAdminOpen && (
        <AdminPanel onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}
