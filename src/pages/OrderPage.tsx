import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshGeo';
import { validateBangladeshiPhone, formatBDT } from '../utils/phoneValidation';
import { 
  ShoppingBag, 
  Trash2, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowLeft, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const { navigate } = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { settings, products } = useStore();

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('ঢাকা সিটি ও মেট্রোপলিটন');
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Available districts for chosen division
  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === selectedDivision);
  const availableDistricts = currentDivisionObj ? currentDivisionObj.districts : [];

  // When division changes, update district and delivery area automatically
  const handleDivisionChange = (divName: string) => {
    setSelectedDivision(divName);
    const div = BANGLADESH_DIVISIONS.find((d) => d.name === divName);
    if (div && div.districts.length > 0) {
      setSelectedDistrict(div.districts[0].nameBn);
    }
    if (divName === 'Dhaka') {
      setDeliveryArea('inside_dhaka');
    } else {
      setDeliveryArea('outside_dhaka');
    }
  };

  // Real-time phone validation
  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError('মোবাইল নম্বর প্রদান করুন');
      return;
    }
    const result = validateBangladeshiPhone(phone);
    if (!result.isValid) {
      setPhoneError(result.errorMessageBn || 'অকার্যকর বাংলাদেশী মোবাইল নম্বর');
    } else {
      setPhoneError(null);
      setPhone(result.normalizedNumber);
    }
  };

  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : deliveryArea === 'inside_dhaka'
    ? settings.deliveryInsideDhaka
    : settings.deliveryOutsideDhaka;
  const totalAmount = subtotal + deliveryCharge;

  // Handle Form Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate phone
    const phoneResult = validateBangladeshiPhone(phone);
    if (!phoneResult.isValid) {
      setPhoneError(phoneResult.errorMessageBn || 'সঠিক ১১ সংখ্যার বাংলাদেশী মোবাইল নম্বর দিন');
      return;
    }
    setPhoneError(null);

    if (!customerName.trim()) {
      setSubmitError('অনুগ্রহ করে আপনার পুরো নাম লিখুন');
      return;
    }

    if (!address.trim()) {
      setSubmitError('অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন');
      return;
    }

    if (items.length === 0) {
      setSubmitError('আপনার শপিং কার্টে কোনো চুড়ি নেই। দয়া করে চুড়ি যুক্ত করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phoneResult.normalizedNumber,
        address: address.trim(),
        division: selectedDivision,
        district: selectedDistrict,
        deliveryArea,
        items,
        orderNotes: orderNotes.trim() || undefined,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        clearCart();
        navigate(`/order-success/${data.order.id}`);
      } else {
        setSubmitError(data.message || 'অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setSubmitError('সার্ভারের সাথে যোগাযোগ করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900">আপনার কার্ট খালি</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            অর্ডার করার জন্য আগে স্নেহময়ী ফেসবুক ক্যাটালগ থেকে আপনার পছন্দের চুড়ি নির্বাচন করুন।
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-7 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition"
        >
          চুড়ি কালেকশন দেখুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>কেনাকাটা চালিয়ে যান</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-slate-900">
            অর্ডার ও ডেলিভারি ফর্ম (Checkout)
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>১০০% নিরাপদ ক্যাশ অন ডেলিভারি</span>
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Grid: Form + Summary */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Customer and Delivery Information */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Customer Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 font-serif font-bold text-lg border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                ১
              </span>
              <span>আপনার নাম ও মোবাইল নম্বর</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  আপনার পুরো নাম (Full Name) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="যেমন: নুসরাত জাহান বা সাদিয়া আফরিন"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  সচল মোবাইল নম্বর (11 Digit Mobile) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder="যেমন: 017XXXXXXXX বা 018XXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  onBlur={handlePhoneBlur}
                  className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                    phoneError
                      ? 'border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-200 focus:border-rose-400 focus:bg-white focus:ring-rose-200'
                  }`}
                />
                {phoneError ? (
                  <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{phoneError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    ডেলিভারি ম্যান এই নম্বরে কল করে পার্সেল পৌঁছে দেবেন।
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address & Zone */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 font-serif font-bold text-lg border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                ২
              </span>
              <span>ডেলিভারি ঠিকানা ও এলাকা</span>
            </div>

            <div className="space-y-4">
              
              {/* Delivery Zone Choice */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setDeliveryArea('inside_dhaka')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      deliveryArea === 'inside_dhaka'
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryArea"
                      checked={deliveryArea === 'inside_dhaka'}
                      onChange={() => setDeliveryArea('inside_dhaka')}
                      className="mt-1 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">ঢাকা সিটির ভিতরে</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        চার্জ: <strong>{formatBDT(settings.deliveryInsideDhaka)}</strong> (২৪-৪৮ ঘণ্টা)
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryArea('outside_dhaka')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      deliveryArea === 'outside_dhaka'
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryArea"
                      checked={deliveryArea === 'outside_dhaka'}
                      onChange={() => setDeliveryArea('outside_dhaka')}
                      className="mt-1 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">ঢাকা সিটির বাইরে</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        চার্জ: <strong>{formatBDT(settings.deliveryOutsideDhaka)}</strong> (৩-৫ দিন)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Division and District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    বিভাগ (Division)
                  </label>
                  <select
                    id="checkout-division-select"
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div.name} value={div.name}>
                        {div.nameBn} ({div.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    জেলা / এরিয়া (District)
                  </label>
                  <select
                    id="checkout-district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    {availableDistricts.map((dis) => (
                      <option key={dis.name} value={dis.nameBn}>
                        {dis.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  সম্পূর্ণ ডেলিভারি ঠিকানা (Detailed Address) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="checkout-address-input"
                  required
                  rows={3}
                  placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক সি, এলাকা/থানার নাম"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                />
              </div>

              {/* Order Notes / Matching Colors */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  বিশেষ নির্দেশনা বা পোশাকের রঙ (Order Notes / Color details)
                </label>
                <textarea
                  id="checkout-notes-input"
                  rows={2}
                  placeholder="কাস্টমাইজড চুড়ির জন্য আপনার পোশাকের রঙ বা জরুরি ডেলিভারি সংক্রান্ত কোনো তথ্য থাকলে লিখুন..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-2 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
                />
              </div>

            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-serif font-bold text-lg border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                ৩
              </span>
              <span>পেমেন্ট পদ্ধতি (Payment Method)</span>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      জনপ্রিয়
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                  </p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('bkash')}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-200'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="mt-1 text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    বিকাশ অগ্রিম পেমেন্ট (bKash Pre-payment)
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    অর্ডার কনফার্ম করার পর আমাদের বিকাশ পার্সোনাল নম্বরে সেন্ড মানি করতে পারেন: <strong>{settings.bkashNumber}</strong>
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5 sticky top-24">
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center justify-between border-b border-slate-100 pb-3">
              <span>অর্ডারের সারসংক্ষেপ</span>
              <span className="text-xs font-semibold text-rose-600 font-sans">
                {items.length} টি পণ্য
              </span>
            </h3>

            {/* Items List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      সাইজ: <span className="font-bold text-rose-700">{item.size}</span> | পরিমাণ: {item.quantity}
                    </p>
                    <div className="text-xs font-bold text-slate-900 font-sans mt-0.5">
                      {formatBDT(item.totalPrice)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>পণ্যের সাবটোটাল</span>
                <span className="font-bold text-slate-900 font-sans">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ ({deliveryArea === 'inside_dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'})</span>
                <span className="font-bold text-slate-900 font-sans">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-semibold">ফ্রি ডেলিভারি</span>
                  ) : (
                    formatBDT(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900">সর্বমোট প্রদেয় মূল্য</span>
                  <p className="text-[10px] text-slate-400">হাতে পেয়ে পরিশোধ করবেন</p>
                </div>
                <span className="text-2xl font-black text-rose-700 font-sans">
                  {formatBDT(totalAmount)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="confirm-order-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-70 text-white font-bold text-base shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition"
            >
              {isSubmitting ? (
                <span>অর্ডার তৈরি হচ্ছে...</span>
              ) : (
                <>
                  <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                অর্ডার সম্পন্ন হওয়ার পর আমাদের টিম থেকে আপনার মোবাইল নম্বরে দ্রুত যোগাযোগ করে সাইজ ও কালার কনফার্ম করা হবে।
              </span>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
