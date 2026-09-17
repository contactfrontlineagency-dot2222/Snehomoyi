import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { 
  Facebook, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Lock,
  MessageCircle
} from 'lucide-react';

interface FooterProps {
  onOpenSizeGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide }) => {
  const { navigate } = useRouter();
  const { settings } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Trust Highlights Section */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-xs text-slate-400 mt-1">
                  পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা (সারা বাংলাদেশে COD)।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">১০০% হাতে তৈরি</h4>
                <p className="text-xs text-slate-400 mt-1">
                  অভিজ্ঞ কারিগরের হাতে সুতা ও মেটালের নিখুঁত বুননে তৈরি চুড়ি।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">দ্রুত ডেলিভারি</h4>
                <p className="text-xs text-slate-400 mt-1">
                  ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৩-৫ কর্মদিবস।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">নিখুঁত কাস্টমাইজেশন</h4>
                <p className="text-xs text-slate-400 mt-1">
                  শাড়ি বা ড্রেসের রঙের সাথে ম্যাচ করে যেকোনো সাইজে অর্ডার করুন।
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="Snehomoyi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-stone-300 bg-[#ede5dc]" 
              />
              <div>
                <h3 className="text-xl font-bold text-white font-serif">স্নেহময়ী (Snehomoyi)</h3>
                <p className="text-xs text-rose-400 font-medium">হাতে তৈরি অনন্য চুড়ি ও গহনা কালেকশন</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              স্নেহময়ী বাংলাদেশের একটি জনপ্রিয় হ্যান্ডক্রাফটেড চুড়ি উদ্যোগ। আমাদের ফেসবুক পেজের আসল ও সেরা কালেকশন এখন সরাসরি ওয়েবসাইটের মাধ্যমে সারা দেশ থেকে সহজে ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
            </p>
            <div className="pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold transition"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>ভিজিট করুন অফিসিয়াল ফেসবুক পেজ</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">পণ্য ও বিভাগ</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-rose-400 transition">
                  সব চুড়ি কালেকশন
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?cat=festive-bridal')} className="hover:text-rose-400 transition">
                  উৎসব ও ব্রাইডাল সেট
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?cat=single-pairs')} className="hover:text-rose-400 transition">
                  সিঙ্গেল পেয়ার চুড়ি
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?cat=customized')} className="hover:text-rose-400 transition">
                  কাস্টমাইজড চুড়ি সেট
                </button>
              </li>
              <li>
                {onOpenSizeGuide && (
                  <button onClick={onOpenSizeGuide} className="text-amber-400 hover:underline">
                    📏 চুড়ির সাইজ মাপার নিয়ম
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Order & Delivery Info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">অর্ডার ও ডেলিভারি</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>ঢাকা সিটি: ৳{settings.deliveryInsideDhaka} (২৪-৪৮ ঘণ্টা)</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>ঢাকার বাইরে: ৳{settings.deliveryOutsideDhaka} (৩-৫ দিন)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>হ্যান্ডক্রাফট প্রসেসিং: ২-৪ দিন</span>
              </li>
              <li>
                <button onClick={() => navigate('/order')} className="hover:text-rose-400 transition">
                  সরাসরি অর্ডার ফর্ম
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">যোগাযোগ</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://wa.me/8801701841905" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 hover:underline"
                >
                  WhatsApp: 880 1701-841905
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="tel:+8801701841905" className="hover:text-white hover:underline">
                  +880 1701-841905
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                  অফিসিয়াল ফেসবুক পেজ
                </a>
              </li>
              <li className="pt-3">
                <button
                  id="footer-admin-link"
                  onClick={() => navigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>স্টোর অ্যাডমিন ড্যাশবোর্ড</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} স্নেহময়ী (Snehomoyi). সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            হাতে তৈরি শিল্পের সাথে ভালোবাসা 🌺 ঢাকা, বাংলাদেশ
          </p>
        </div>
      </div>
    </footer>
  );
};
