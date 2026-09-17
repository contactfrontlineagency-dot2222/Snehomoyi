import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { formatBDT } from '../utils/phoneValidation';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Check, 
  Facebook, 
  Share2, 
  Maximize2, 
  X,
  HelpCircle,
  Package,
  Palette
} from 'lucide-react';

interface ProductDetailPageProps {
  onOpenSizeGuide: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenSizeGuide }) => {
  const { productSlug, navigate } = useRouter();
  const { products, settings } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === productSlug || p.id === productSlug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('2.6');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Set default size and color once product is loaded
  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[1] || product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [productSlug, product]);

  // Handle color change and dynamic image switching
  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    if (!product) return;

    // Check if color has a mapped image
    if (product.colorImageMap && product.colorImageMap[colorName]) {
      const targetImg = product.colorImageMap[colorName];
      const foundIdx = product.images.findIndex(
        (img) => img.toLowerCase() === targetImg.toLowerCase()
      );
      if (foundIdx !== -1) {
        setActiveImageIndex(foundIdx);
      } else {
        // If mapped image isn't currently in product.images, we can prepend or display it
        // Or if it matches by substring:
        const subIdx = product.images.findIndex((img) => img.includes(targetImg.replace('/', '')));
        if (subIdx !== -1) {
          setActiveImageIndex(subIdx);
        }
      }
    } else {
      // Map based on index if available
      const colorIdx = product.colors.indexOf(colorName);
      if (colorIdx >= 0 && colorIdx < product.images.length) {
        setActiveImageIndex(colorIdx);
      }
    }
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-900">চুড়িটি পাওয়া যায়নি</h2>
        <p className="text-sm text-slate-500">
          সম্ভবত পণ্যটির লিঙ্ক পরিবর্তিত হয়েছে অথবা পণ্যটি স্টকে নেই।
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition"
        >
          সকল চুড়ি কালেকশন দেখুন
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity, selectedColor);
    navigate('/order');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-rose-600">হোম</button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-rose-600">চুড়ি কালেকশন</button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.nameBn}</span>
      </nav>

      {/* Product Primary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.nameBn}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
              referrerPolicy="no-referrer"
            />
            
            {/* Zoom Button overlay */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur shadow-md text-slate-700 hover:text-rose-600 hover:bg-white transition"
              title="Zoom Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Discount Badge */}
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                {product.discountPercent}% ছাড়
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-rose-600 shadow-sm scale-95'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.nameBn} - view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Ordering Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full">
              {product.categoryBn}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
              {product.nameBn}
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">{product.nameEn}</p>
          </div>

          {/* Price & In-Stock Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">মূল্য (Price):</span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" />
                <span>স্টকে আছে</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-1">ক্যাশ অন ডেলিভারি প্রযোজ্য</p>
            </div>
          </div>

          {/* Color Variants Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-rose-600" />
                  <span>রঙ নির্বাচন করুন (Color):</span>
                </label>
                <span className="text-xs text-rose-600 font-medium">
                  {selectedColor || product.colors[0]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`py-2 px-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px] ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs ring-2 ring-rose-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border border-slate-300 ${
                          color.includes('লাল') || color.toLowerCase().includes('red')
                            ? 'bg-red-600'
                            : color.includes('সবুজ') || color.toLowerCase().includes('green')
                            ? 'bg-emerald-600'
                            : color.includes('নীল') || color.toLowerCase().includes('blue')
                            ? 'bg-blue-600'
                            : color.includes('কালো') || color.toLowerCase().includes('black')
                            ? 'bg-slate-900'
                            : color.includes('মেরুন') || color.toLowerCase().includes('maroon')
                            ? 'bg-rose-950'
                            : color.includes('হলুদ') || color.toLowerCase().includes('yellow')
                            ? 'bg-amber-400'
                            : color.includes('সাদা') || color.toLowerCase().includes('white')
                            ? 'bg-white'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span>{color}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * রঙ নির্বাচন করলে ছবিতে স্বয়ংক্রিয়ভাবে পরিবর্তন দেখা যাবে
              </p>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-slate-800">
                চুড়ির সাইজ নির্বাচন করুন:
              </label>
              <button
                onClick={onOpenSizeGuide}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>📏 সাইজ মাপার নিয়ম</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-3 rounded-2xl border text-center transition-all min-h-[44px] ${
                    selectedSize === size
                      ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold shadow-xs ring-2 ring-rose-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div className="text-sm font-bold">{size}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {size === '2.4' ? 'ছোট হাত' : size === '2.6' ? 'মাঝারি হাত ⭐' : 'বড় হাত'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-800">পরিমাণ (Quantity):</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">
                মোট মূল্য: <strong className="text-slate-900 font-bold font-sans">{formatBDT(product.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              id="product-buy-now-btn"
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              <span>এখনই অর্ডার করুন (Cash on Delivery)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="product-add-to-cart-btn"
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-sm flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">কার্টে যোগ করা হয়েছে!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-rose-600" />
                  <span>কার্টে যোগ করুন</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Order Button */}
            <WhatsAppButton
              mode="button"
              productName={product.nameBn}
              size={selectedSize}
              color={selectedColor}
              quantity={quantity}
              price={product.price}
              className="w-full"
            />
          </div>

          {/* Delivery & Trust Highlights Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">ডেলিভারি চার্জ:</strong> ঢাকা সিটিতে ৳{settings.deliveryInsideDhaka} (২৪-৪৮ ঘণ্টা), ঢাকার বাইরে ৳{settings.deliveryOutsideDhaka} (৩-৫ দিন)।
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">হ্যান্ডক্রাফট সময়:</strong> প্রতিটি চুড়ি অর্ডার অনুযায়ী নিখুঁতভাবে তৈরি করতে ২-৪ কর্মদিবস সময় লাগে।
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">পেমেন্ট নিশ্চয়তা:</strong> কোনো অগ্রিম টাকা ছাড়া সম্পূর্ণ ক্যাশ অন ডেলিভারিতে চেক করে নেওয়ার সুযোগ।
              </div>
            </div>
          </div>

          {/* Facebook Origin Link */}
          <div className="pt-2">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/70 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
              <span>স্নেহময়ী অফিশিয়াল ফেসবুক পেজের পোস্ট দেখুন</span>
            </a>
          </div>

        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
            পণ্যের পূর্ণ বিবরণ ও কারুকাজ
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
            {product.descriptionBn}
          </p>
          <p className="text-xs text-slate-400 mt-2 italic">
            {product.descriptionEn}
          </p>
        </div>

        {/* Features List */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            প্রধান বৈশিষ্ট্যসমূহ (Features)
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
            {product.featuresBn.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications Table */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            স্পেসিফিকেশন (Specifications)
          </h4>
          <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs sm:text-sm">
            <table className="w-full divide-y divide-slate-200">
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50 w-1/3">ম্যাটেরিয়াল / উপাদান</td>
                  <td className="py-2.5 px-4 text-slate-800">{product.specifications.material}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">চুড়ির সাইজ</td>
                  <td className="py-2.5 px-4 text-slate-800">{product.specifications.bangleSizes}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">উৎপত্তি</td>
                  <td className="py-2.5 px-4 text-slate-800">{product.specifications.origin}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">কাস্টমাইজেশন</td>
                  <td className="py-2.5 px-4 text-slate-800">{product.specifications.customization}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">তৈরি ও ডেলিভারি সময়</td>
                  <td className="py-2.5 px-4 text-slate-800">{product.specifications.processingTime}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              আরও কিছু পছন্দনীয় চুড়ি
            </h3>
            <button
              onClick={() => navigate('/products')}
              className="text-xs sm:text-sm font-semibold text-rose-600 hover:underline"
            >
              সবগুলো দেখুন
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Image Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.nameBn}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};
