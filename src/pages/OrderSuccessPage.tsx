import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { formatBDT } from '../utils/phoneValidation';
import { 
  CheckCircle, 
  Printer, 
  ArrowRight, 
  ShoppingBag, 
  Facebook, 
  Truck, 
  Clock, 
  Phone,
  MessageCircle
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId, navigate } = useRouter();
  const { settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (e) {
        console.error('Failed to fetch order details', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-500">
        অর্ডারের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Printable Area Wrapper */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Success Header */}
        <div className="text-center space-y-3 print:space-y-1">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            অর্ডার সফল হয়েছে (Order Confirmed)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
            ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            স্নেহময়ী টিম আপনার চুড়ির সাইজ ও ডিজাইন চেক করে শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবে।
          </p>
        </div>

        {/* Order ID & Status Ribbon */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500">অর্ডার নম্বর (Order ID):</span>
            <span className="ml-2 font-black text-rose-700 text-base font-mono">
              #{order?.id || orderId || 'SN-CONFIRMED'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">পদ্ধতি:</span>
            <span className="font-bold text-slate-900">
              {order?.paymentMethod === 'bkash' ? 'বিকাশ পেমেন্ট' : 'ক্যাশ অন ডেলিভারি (COD)'}
            </span>
          </div>
        </div>

        {/* Delivery Details Card */}
        {order && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              গ্রাহক ও ডেলিভারির বিবরণ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div>
                <p className="text-slate-400 text-xs">গ্রাহকের নাম:</p>
                <p className="font-bold text-slate-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">মোবাইল নম্বর:</p>
                <p className="font-bold text-slate-900 font-mono">{order.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-400 text-xs">ডেলিভারি ঠিকানা:</p>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {order.address}, {order.district}, {order.division}
                </p>
              </div>
              {order.orderNotes && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 text-[11px]">বিশেষ নির্দেশনা / পোশাকের রঙ:</p>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{order.orderNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ordered Items Table */}
        {order && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              অর্ডারের আইটেমসমূহ
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 font-semibold text-slate-600 grid grid-cols-12">
                <span className="col-span-7">পণ্যের নাম ও সাইজ</span>
                <span className="col-span-2 text-center">পরিমাণ</span>
                <span className="col-span-3 text-right">মূল্য</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 grid grid-cols-12 items-center bg-white">
                  <div className="col-span-7 flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        সাইজ: <span className="font-bold text-rose-700">{item.size}</span>
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800">
                    x{item.quantity}
                  </div>
                  <div className="col-span-3 text-right font-bold text-slate-900 font-sans">
                    {formatBDT(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>সাবটোটাল</span>
                <span className="font-sans font-semibold">{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-sans font-semibold">
                  {order.deliveryCharge === 0 ? 'ফ্রি' : formatBDT(order.deliveryCharge)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-bold text-slate-900">
                <span>সর্বমোট পরিশোধযোগ্য (COD)</span>
                <span className="text-rose-700 font-sans text-lg">{formatBDT(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expected Delivery Information Box */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2 print:hidden">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>ডেলিভারি সংক্রান্ত প্রয়োজনীয় তথ্য:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
            <li>হাতে তৈরি নিখুঁত চুড়ি প্রস্তুত হতে ২-৪ কর্মদিবস সময় লাগে।</li>
            <li>ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরের জেলাগুলোতে ৩-৫ দিনের মধ্যে পার্সেল পৌঁছাবে।</li>
            <li>পার্সেল গ্রহণের সময় পণ্য দেখে মূল্য পরিশোধ করার সুবিধা রয়েছে।</li>
          </ul>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>রসিদ প্রিন্ট করুন</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {(() => {
              const phoneClean = (settings.phone || '8801701841905').replace(/[^0-9]/g, '');
              const waNumber = phoneClean.startsWith('880') ? phoneClean : `880${phoneClean}`;
              const waMsg = encodeURIComponent(
                `নমস্কার স্নেহময়ী! আমি এইমাত্র অর্ডার করেছি:\n• অর্ডার আইডি: #${order?.id || orderId}\n• নাম: ${order?.customerName || ''}\n• ফোন: ${order?.phone || ''}\n• মোট: ৳${order?.totalAmount || ''}\n\nদয়া করে অর্ডারটি কনফার্ম করুন।`
              );
              return (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>WhatsApp-এ কনফার্ম করুন</span>
                </a>
              );
            })()}

            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
              <span>ফেসবুকে মেসেজ দিন</span>
            </a>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>আরও চুড়ি দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
