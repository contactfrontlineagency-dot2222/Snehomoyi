import React from 'react';
import { Home, Grid, ShoppingBag, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppMessage } from './WhatsAppButton';

export const MobileBottomNav: React.FC = () => {
  const { path, navigate } = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { settings } = useStore();

  const rawPhone = settings.phone || '880 1701-841905';
  const phoneClean = rawPhone.replace(/[^0-9]/g, '');
  const waNumber = phoneClean.startsWith('880')
    ? phoneClean
    : phoneClean.startsWith('0')
    ? `88${phoneClean}`
    : `880${phoneClean}`;

  const defaultMsg = formatWhatsAppMessage({
    storeName: settings.storeNameBn || 'স্নেহময়ী'
  });
  const waUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  // Do not render bottom nav on admin dashboard to keep full-screen table space
  if (path.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center gap-1">
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors min-h-[48px] ${
            path === '/'
              ? 'text-rose-700 font-bold bg-rose-50/80'
              : 'text-slate-600 hover:text-rose-600 active:bg-slate-100'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">হোম</span>
        </button>

        {/* Shop / Products */}
        <button
          id="mobile-nav-shop"
          onClick={() => navigate('/products')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors min-h-[48px] ${
            path.startsWith('/products')
              ? 'text-rose-700 font-bold bg-rose-50/80'
              : 'text-slate-600 hover:text-rose-600 active:bg-slate-100'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">কালেকশন</span>
        </button>

        {/* Cart Drawer Trigger */}
        <button
          id="mobile-nav-cart"
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 hover:text-rose-700 active:bg-slate-100 transition-colors min-h-[48px] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-rose-600" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight font-medium">ব্যাগ</span>
        </button>

        {/* Order / Checkout */}
        <button
          id="mobile-nav-checkout"
          onClick={() => navigate('/order')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors min-h-[48px] ${
            path.startsWith('/order')
              ? 'text-rose-700 font-bold bg-rose-50/80'
              : 'text-slate-600 hover:text-rose-600 active:bg-slate-100'
          }`}
        >
          <ArrowRight className="w-5 h-5 mb-0.5 text-rose-600" />
          <span className="text-[10px] leading-tight font-medium">অর্ডার</span>
        </button>

        {/* WhatsApp Quick Chat */}
        <a
          id="mobile-nav-whatsapp"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-600 hover:text-emerald-700 active:bg-emerald-50 transition-colors min-h-[48px]"
        >
          <MessageCircle className="w-5 h-5 mb-0.5 text-emerald-600 fill-emerald-100" />
          <span className="text-[10px] leading-tight font-bold">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
