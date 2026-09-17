import React, { useState } from 'react';
import { Product } from '../types';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../utils/phoneValidation';
import { ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || '2.6');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    navigate('/order');
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group relative bg-white rounded-3xl border border-slate-100/90 shadow-xs hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.nameBn}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold tracking-wide shadow-xs">
              {product.discountPercent}% ছাড়
            </span>
          )}
          {product.category === 'customized' && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-amber-950 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>কাস্টমাইজড</span>
            </span>
          )}
        </div>

        {/* Stock status if low */}
        {product.stockQuantity < 30 && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium">
            সীমিত স্টক ({product.stockQuantity} সেট)
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-rose-600 tracking-wide uppercase">
            <span>{product.categoryBn}</span>
            {product.colors && product.colors.length > 0 && (
              <span className="text-slate-400 font-normal lowercase">
                {product.colors.length} কালার
              </span>
            )}
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-rose-600 transition-colors mt-1">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
            {product.descriptionBn}
          </p>
        </div>

        {/* Size Selector */}
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="text-[11px] font-medium text-slate-500">সাইজ:</span>
            <span className="text-xs font-semibold text-rose-700">{selectedSize}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold border transition-all ${
                  selectedSize === size
                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-baseline justify-between flex-wrap gap-1">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-slate-900 font-sans">
                {formatBDT(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              COD
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              id={`add-to-cart-${product.id}`}
              type="button"
              onClick={handleAddToCart}
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 font-semibold text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition active:scale-95 whitespace-nowrap min-w-0"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold truncate">যোগ হয়েছে</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">কার্টে রাখুন</span>
                </>
              )}
            </button>

            <button
              id={`order-now-${product.id}`}
              type="button"
              onClick={handleDirectOrder}
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition active:scale-95 whitespace-nowrap min-w-0"
            >
              <span className="truncate">অর্ডার করুন</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
