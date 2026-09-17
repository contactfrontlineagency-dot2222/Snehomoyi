import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatBDT } from '../utils/phoneValidation';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { navigate } = useRouter();
  const { items, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { settings } = useStore();

  if (!isCartDrawerOpen) return null;

  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const remainingForFree = settings.freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-50 to-amber-50/50 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-serif">আপনার শপিং ব্যাগ</h3>
                <p className="text-xs text-slate-500 font-medium">{totalItems} টি পণ্য নির্বাচন করেছেন</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress prompt */}
          <div className="px-5 py-2.5 bg-rose-50/70 border-b border-rose-100 text-xs flex items-center gap-2 text-rose-800">
            <Truck className="w-4 h-4 text-rose-600 shrink-0" />
            {isFreeDelivery ? (
              <span className="font-semibold text-emerald-700">🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।</span>
            ) : (
              <span>
                আর <strong>{formatBDT(remainingForFree)}</strong> টাকার অর্ডার করলেই <strong>ফ্রি ডেলিভারি</strong>!
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">আপনার ব্যাগটি এখনো খালি!</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    আমাদের সুন্দর চুড়ি কালেকশন থেকে আপনার পছন্দের সেট বা পেয়ার পছন্দ করুন।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/products');
                  }}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs transition"
                >
                  কালেকশন দেখুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      সাইজ: <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">{item.size}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs font-semibold">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">{formatBDT(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>সাবটোটাল (Subtotal)</span>
                  <span className="font-semibold text-slate-900 text-sm">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>ডেলিভারি চার্জ (Inside Dhaka / Outside)</span>
                  <span>{isFreeDelivery ? 'ফ্রি' : 'চেকআউটে যুক্ত হবে'}</span>
                </div>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/order');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition"
              >
                <span>অর্ডার সম্পন্ন করুন (Cash on Delivery)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                অগ্রিম কোনো টাকা দিতে হবে না, পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
