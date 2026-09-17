import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CUSTOMER_REVIEWS, DISPATCH_STATS } from '../data/reviews';
import { formatBDT } from '../utils/phoneValidation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Facebook, 
  Heart, 
  Star,
  Layers,
  Palette,
  MessageCircle,
  ThumbsUp,
  MapPin,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onOpenSizeGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSizeGuide }) => {
  const { navigate } = useRouter();
  const { products, settings } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', nameBn: 'সকল কালেকশন', count: products.length },
    { id: 'festive-bridal', nameBn: 'উৎসব ও ব্রাইডাল', count: products.filter(p => p.category === 'festive-bridal').length },
    { id: 'bangle-sets', nameBn: 'চুড়ি সেট', count: products.filter(p => p.category === 'bangle-sets').length },
    { id: 'single-pairs', nameBn: 'সিঙ্গেল পেয়ার', count: products.filter(p => p.category === 'single-pairs').length },
    { id: 'customized', nameBn: 'কাস্টমাইজড সেট', count: products.filter(p => p.category === 'customized').length },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-amber-50/30 pt-6 pb-12 sm:pb-20 border-b border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold tracking-wide border border-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>স্নেহময়ী অফিশিয়াল হ্যান্ডমেড স্টোর</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-serif tracking-tight leading-tight sm:leading-[1.25]">
                হাতে তৈরি চুড়ির নান্দনিকতায়{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600">
                  ফুটে উঠুক আপনার রূপ
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                স্নেহময়ী ফেসবুক পেজের প্রতিটি খাঁটি চুড়ি এখন সরাসরি ওয়েবসাইটে। নিখুঁত সুতো, জরি ও পুঁতির কাজে তৈরি ঐতিহ্যবাহী চুড়ি সেট ও পেয়ার। আপনার পোশাকের সাথে যেকোনো রঙ ও সাইজে (২.৪, ২.৬, ২.৮) কাস্টমাইজড অর্ডার করুন।
              </p>

              {/* Trust bullet points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-700 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>সাইজ ২.৪, ২.৬, ২.৮</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 shadow-2xs col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>সারা দেশে হোম ডেলিভারি</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="hero-shop-all-btn"
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition active:scale-95 min-h-[44px]"
                >
                  <span>সব চুড়ি কালেকশন দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-custom-order-btn"
                  onClick={() => navigate('/products/customized-outfit-matching-bangle-set')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-sm shadow-2xs flex items-center justify-center gap-2 transition min-h-[44px]"
                >
                  <Palette className="w-4 h-4 text-rose-600" />
                  <span>ম্যাচিং কাস্টমাইজড চুড়ি অর্ডার</span>
                </button>
              </div>

              {/* Facebook Page attribution */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                <Facebook className="w-4 h-4 text-blue-600 fill-blue-600" />
                <span>অফিসিয়াল ফেসবুক পেজ:</span>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Snehomoyi (স্নেহময়ী)
                </a>
              </div>

            </div>

            {/* Right Hero Images Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Main Hero Card with real Snehomoyi product image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                  <img
                    src={products[0]?.images[0] || 'https://res.cloudinary.com/mdml3orw/image/upload/v1789659554/1.png'}
                    alt="Snehomoyi Handcrafted Bangles"
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-amber-300 font-medium uppercase tracking-wider">সিগনেচার হ্যান্ডক্রাফট</p>
                      <h4 className="font-serif font-bold text-sm">হাতে বোনা উৎসব চুড়ি কালেকশন</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-200">মূল্য শুরু</span>
                      <p className="font-bold text-base text-white">৳১৬০ / জোড়া</p>
                    </div>
                  </div>
                </div>

                {/* Floating trust badge */}
                <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">১০০% আসল প্রোডাক্ট</p>
                    <p className="text-[11px] text-slate-500">ফেসবুক পেজ ভেরিফায়েড</p>
                  </div>
                </div>

                {/* Floating size guide prompt */}
                <div 
                  onClick={onOpenSizeGuide}
                  className="absolute -top-3 -right-3 bg-white/95 backdrop-blur px-3.5 py-2 rounded-2xl shadow-lg border border-amber-200 flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition"
                >
                  <span className="text-base">📏</span>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-900">সাইজ গাইড</p>
                    <p className="text-[10px] text-rose-600 font-semibold">2.4 • 2.6 • 2.8</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular / Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>জনপ্রিয় কালেকশন</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              সবচেয়ে বেশি বিক্রিত চুড়ি
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 group transition"
          >
            <span>সবগুলো দেখুন ({products.length}টি)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Outfit-Matching Customization Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>স্পেশাল সার্ভিস</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif leading-snug">
              আপনার শাড়ি বা ড্রেসের সাথে ম্যাচিং করে চুড়ি বানিয়ে নিন!
            </h3>
            <p className="text-sm text-rose-100/90 leading-relaxed">
              যেকোনো পার্টি, বিয়ে বাড়ি বা গায়ে হলুদের জন্য নির্দিষ্ট কালারের চুড়ি খুঁজে পাচ্ছেন না? স্নেহময়ী দিচ্ছে সম্পূর্ণ কাস্টমাইজড চুড়ি তৈরির সুযোগ। আপনি শুধু সাইজ (২.৪, ২.৬ বা ২.৮) ও রঙের বিবরণ দিয়ে অর্ডার করুন।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/products/customized-outfit-matching-bangle-set')}
                className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-sm shadow-md transition active:scale-95 min-h-[44px]"
              >
                কাস্টমাইজড চুড়ি অর্ডার করুন
              </button>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2 min-h-[44px]"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>ফেসবুকে ছবি পাঠিয়ে ম্যাচিং করুন</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust & Dispatch Proof Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/60 rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">গ্রাহকের আস্থা ও বিশ্বস্ততা</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              সারা দেশে ১,২০০+ গ্রাহকের ভালোবাসা
            </h2>
            <p className="text-sm text-slate-600">
              আমাদের প্রতিটি পার্সেল নিখুঁত সুরক্ষা ও যত্নসহকারে প্যাক করে ডেলিভারি করা হয়।
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">{DISPATCH_STATS.totalDeliveredBn}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">সফল হোম ডেলিভারি</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-serif">{DISPATCH_STATS.districtsCoveredBn}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">ডেলিভারি নেটওয়ার্ক</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-serif">{DISPATCH_STATS.averageRating}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">ফেসবুক রেটিং ও রিভিউ</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">{DISPATCH_STATS.happyCustomersBn}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">সন্তুষ্ট বোন ও গ্রাহক</div>
            </div>
          </div>

          {/* Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{rev.commentBn}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {rev.image && (
                      <img 
                        src={rev.image} 
                        alt={rev.name} 
                        className="w-10 h-10 rounded-full object-cover border border-rose-200 shadow-2xs" 
                      />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> ভেরিফায়েড ক্রেতা
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rev.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded-full font-medium">
                      {rev.bangleOrdered}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Consultation Callout */}
          <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm sm:text-base font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>যেকোনো প্রশ্ন বা সরাসরি হোয়াটসঅ্যাপে কথা বলতে চান?</span>
              </h4>
              <p className="text-xs text-emerald-700">
                আমাদের প্রতিনিধি সাইজ নির্বাচন, কাস্টমাইজেশন ও অর্ডার সংক্রান্ত সহায়তায় সবসময় প্রস্তুত।
              </p>
            </div>
            <WhatsAppButton mode="button" className="shrink-0" />
          </div>

        </div>
      </section>

      {/* Full Catalog with Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            স্নেহময়ী সম্পূর্ণ চুড়ি ক্যাটালগ
          </h2>
          <p className="text-sm text-slate-500">
            ফেসবুক পেজের প্রতিটি আসল কালেকশন। আপনার পছন্দমতো ক্যাটাগরি বাছাই করুন।
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                activeCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              {cat.nameBn} ({cat.count})
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How to Order & Delivery Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">সহজ ও বিশ্বস্ত</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              কিভাবে অর্ডার করবেন ও পাবেন?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center">
                ১
              </div>
              <h4 className="font-bold text-slate-900 text-sm">চুড়ি ও সাইজ নির্বাচন</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                পছন্দের চুড়ির সাইজ (2.4, 2.6 বা 2.8) বেছে নিয়ে সরাসরি <strong>অর্ডার করুন</strong> বাটনে চাপ দিন।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center">
                ২
              </div>
              <h4 className="font-bold text-slate-900 text-sm">ঠিকানা ও ফোন নম্বর দিন</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার নাম, সচল মোবাইল নম্বর এবং ডেলিভারির সম্পূর্ণ ঠিকানা লিখে অর্ডার সাবমিট করুন।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center">
                ৩
              </div>
              <h4 className="font-bold text-slate-900 text-sm">হাতে পেয়ে মূল্য পরিশোধ</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                ডেলিভারি ম্যানের কাছ থেকে পার্সেল চেক করে ক্যাশ অন ডেলিভারিতে (COD) টাকা পরিশোধ করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

