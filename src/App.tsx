import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider, useCart } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderPage } from './pages/OrderPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { 
  ShoppingBag, 
  Home, 
  Grid, 
  Sparkles, 
  Facebook, 
  PhoneCall, 
  CheckCircle2 
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { path, navigate, productSlug, orderId } = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { settings } = useStore();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const isAdminRoute = path.startsWith('/admin');

  // Router View Selection
  const renderCurrentView = () => {
    if (isAdminRoute) {
      return <AdminDashboard />;
    }
    if (path.startsWith('/order-success')) {
      return <OrderSuccessPage />;
    }
    if (path.startsWith('/order') || path === '/checkout') {
      return <OrderPage />;
    }
    if (path.startsWith('/cart')) {
      return <OrderPage />;
    }
    if (path.startsWith('/products/') && productSlug) {
      return <ProductDetailPage onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />;
    }
    if (path === '/products' || path.startsWith('/products?')) {
      return <ProductsPage />;
    }
    return <HomePage onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      {/* Global Navigation */}
      <Navbar />

      {/* Main App Content View */}
      <main className="flex-1 pb-16 sm:pb-0">
        {renderCurrentView()}
      </main>

      {/* Global Footer (hidden on admin to maximize workspace) */}
      {!isAdminRoute && (
        <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Bangle Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Floating WhatsApp Button for desktop/tablet/mobile customer assistance */}
      {!isAdminRoute && (
        <WhatsAppButton mode="floating" />
      )}

      {/* Mobile Sticky Bottom Navigation (Touch-optimized 5-action bar) */}
      {!isAdminRoute && (
        <MobileBottomNav />
      )}
    </div>
  );
};

export function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </StoreProvider>
    </RouterProvider>
  );
}

export default App;
