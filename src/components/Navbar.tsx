import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Phone, 
  Facebook, 
  ShieldCheck, 
  Truck,
  Heart,
  MessageCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { settings } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const rawPhone = settings.phone || '880 1701-841905';
  const phoneClean = rawPhone.replace(/[^0-9]/g, '');
  const waNumber = phoneClean.startsWith('880') ? phoneClean : `880${phoneClean}`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 text-white text-xs py-1.5 px-3 sm:px-4 font-medium overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span className="shrink-0 inline-flex items-center justify-center bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
              ক্যাশ অন ডেলিভারি
            </span>
            <div className="overflow-hidden whitespace-nowrap min-w-0 flex-1 relative">
              <div className="animate-ticker text-white/95 text-[11px] sm:text-xs font-medium inline-flex gap-8">
                <span>{settings.announcementBn || '✨ সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা! সাইজ ২.৪, ২.৬, ২.৮ উপলব্ধ। WhatsApp: 880 1701-841905'}</span>
                <span>•</span>
                <span>হোয়াটসঅ্যাপে ড্রেসের ছবি পাঠিয়ে কাস্টমাইজড চুড়ি অর্ডার করুন: 880 1701-841905</span>
                <span>•</span>
                <span>{settings.announcementBn || '✨ সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা!'}</span>
                <span>•</span>
                <span>হোয়াটসঅ্যাপে ড্রেসের ছবি পাঠিয়ে কাস্টমাইজড চুড়ি অর্ডার করুন: 880 1701-841905</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-rose-100 shrink-0 text-xs">
            <a 
              href={`https://wa.me/${waNumber}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
              <span>WhatsApp: 880 1701-841905</span>
            </a>
            <span className="text-white/40">|</span>
            <a 
              href={settings.facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook Page</span>
            </a>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>সারা দেশে হোম ডেলিভারি</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              id="navbar-brand-logo-btn"
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group min-h-[44px] min-w-0"
            >
              <img 
                src="/logo.png" 
                alt="Snehomoyi Logo" 
                className="w-10 h-10 sm:w-13 sm:h-13 rounded-full object-cover shadow-xs border-2 border-stone-200/90 group-hover:scale-105 transition-transform duration-200 bg-[#ede5dc] shrink-0"
                onError={(e) => {
                  // Fallback if image load error
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1 sm:gap-1.5">
                  <span className="font-bold text-lg sm:text-2xl text-slate-900 tracking-tight font-serif whitespace-nowrap">
                    স্নেহময়ী
                  </span>
                  <span className="text-[11px] sm:text-sm font-semibold text-rose-600 tracking-wide uppercase whitespace-nowrap">
                    Snehomoyi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate">
                  হাতে তৈরি খাঁটি চুড়ি ও গহনা কালেকশন
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                placeholder="চুড়ির নাম বা কালার দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-rose-400 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-rose-600 transition ${path === '/' ? 'text-rose-600 font-semibold' : ''}`}
            >
              হোম (Home)
            </button>
            <button
              onClick={() => navigate('/products')}
              className={`hover:text-rose-600 transition ${path.startsWith('/products') ? 'text-rose-600 font-semibold' : ''}`}
            >
              সব চুড়ি কালেকশন
            </button>
            <button
              onClick={() => navigate('/products?cat=festive-bridal')}
              className="hover:text-rose-600 transition"
            >
              উৎসব ও ব্রাইডাল
            </button>
            <button
              onClick={() => navigate('/products?cat=customized')}
              className="hover:text-rose-600 transition flex items-center gap-1 text-rose-700 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>কাস্টমাইজড সেট</span>
            </button>
          </nav>

          {/* Actions: Search (Mobile), Cart Icon, Facebook Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Facebook Source Page Button */}
            <a
              id="facebook-header-link"
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-full transition"
            >
              <Facebook className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>ফেসবুক পেজ</span>
            </a>

            {/* Cart Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-sm transition active:scale-95"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">কার্ট</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center bg-amber-400 text-rose-950 text-xs font-bold w-5 h-5 rounded-full ml-0.5">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {isSearchOpen && (
          <div className="py-3 px-1 md:hidden border-t border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="mobile-search-dropdown-input"
                type="text"
                placeholder="চুড়ির নাম বা কালার দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm ${path === '/' ? 'bg-rose-50 text-rose-700' : 'text-slate-800'}`}
            >
              হোম (Home)
            </button>
            <button
              onClick={() => {
                navigate('/products');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-50"
            >
              সকল চুড়ি কালেকশন (All Churi)
            </button>
            <button
              onClick={() => {
                navigate('/products?cat=festive-bridal');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-50"
            >
              উৎসব ও ব্রাইডাল চুড়ি (Bridal & Festive)
            </button>
            <button
              onClick={() => {
                navigate('/products?cat=customized');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm text-rose-700 bg-rose-50/70"
            >
              ✨ কাস্টমাইজড সেট (Customize Your Set)
            </button>
            <button
              onClick={() => {
                navigate('/order');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-50"
            >
              অর্ডার ও চেকআউট (Order Form)
            </button>
            
            <div className="pt-3 border-t border-slate-100">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-blue-600 text-white shadow-sm"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>আমাদের অফিসিয়াল ফেসবুক পেজ</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                অ্যাডমিন প্যানেল লগইন (Admin Login)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
