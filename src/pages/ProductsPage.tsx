import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, Sparkles, ArrowUpDown, X } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products } = useStore();
  const { path } = useRouter();
  
  // Parse query params from URL
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    const cat = urlParams.get('cat');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [path]);

  const categories = [
    { id: 'all', label: 'সব চুড়ি (All)' },
    { id: 'festive-bridal', label: 'উৎসব ও ব্রাইডাল' },
    { id: 'bangle-sets', label: 'চুড়ি সেট' },
    { id: 'single-pairs', label: 'সিঙ্গেল পেয়ার' },
    { id: 'customized', label: 'কাস্টমাইজড সেট ✨' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesQuery =
          !searchQuery.trim() ||
          p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.colors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আসল ফেসবুক কালেকশন</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          স্নেহময়ী হ্যান্ডক্রাফটেড চুড়ি কালেকশন
        </h1>
        <p className="text-sm text-slate-500">
          ঢাকা থেকে সারা দেশে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি। সাইজ ২.৪, ২.৬ ও ২.৮।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="চুড়ি বা কালার দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500 font-medium">সর্ট:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-full py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 min-h-[40px]"
            >
              <option value="featured">জনপ্রিয়তা অনুযায়ী</option>
              <option value="price-asc">মূল্য: কম থেকে বেশি</option>
              <option value="price-desc">মূল্য: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 -mx-1 px-1 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count and Active Filters */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>মোট {filteredProducts.length} টি চুড়ি পাওয়া গেছে</span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-rose-600 font-semibold hover:underline"
          >
            ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">কোনো চুড়ি পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              আপনার দেওয়া সার্চ টার্মের সাথে মিল রেখে কোনো চুড়ি পাওয়া যায়নি। দয়া করে অন্য কোনো নাম দিয়ে চেষ্টা করুন।
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
          >
            সব চুড়ি দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
