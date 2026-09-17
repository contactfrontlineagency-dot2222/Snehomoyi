import React from 'react';
import { X, Check, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-lg">
            <span>📏</span>
            <span>চুড়ির সাইজ নির্দেশিকা (Bangle Size Guide)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          <p className="leading-relaxed">
            বাংলাদেশে চুড়ির সাইজ সাধারণত ভিতরের ব্যাস (Inner Diameter) ইঞ্চি হিসেবে পরিমাপ করা হয়। স্নেহময়ীর প্রতিটি চুড়ি সাইজ অনুযায়ী তৈরি করা হয়:
          </p>

          {/* Size Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">সাইজ কোড</th>
                  <th className="py-3 px-4">ইঞ্চি (ব্যাস)</th>
                  <th className="py-3 px-4">মিলিমিটার (mm)</th>
                  <th className="py-3 px-4">কাদের জন্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-rose-50/40">
                  <td className="py-3 px-4 font-bold text-rose-700">2.4</td>
                  <td className="py-3 px-4">২.২৫ ইঞ্চি</td>
                  <td className="py-3 px-4">৫৭.২ মিমি</td>
                  <td className="py-3 px-4 text-slate-600">স্মল (ছোট হাত)</td>
                </tr>
                <tr className="bg-amber-50/30 hover:bg-rose-50/40">
                  <td className="py-3 px-4 font-bold text-rose-700">2.6</td>
                  <td className="py-3 px-4">২.৩৭৫ ইঞ্চি</td>
                  <td className="py-3 px-4">৬০.৩ মিমি</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">মাঝারি হাত (সর্বাধিক ব্যবহৃত) ⭐</td>
                </tr>
                <tr className="hover:bg-rose-50/40">
                  <td className="py-3 px-4 font-bold text-rose-700">2.8</td>
                  <td className="py-3 px-4">২.৫ ইঞ্চি</td>
                  <td className="py-3 px-4">৬৩.৫ মিমি</td>
                  <td className="py-3 px-4 text-slate-600">লার্জ (বড় হাত)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* How to measure */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2">
            <h5 className="font-semibold text-rose-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>ঘরে বসে মাপার সহজ নিয়ম:</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>আপনার বর্তমান মানানসই যেকোনো চুড়ি একটি সমান স্কেলের উপর রাখুন।</li>
              <li>চুড়ির ঠিক মাঝখানের ভিতরের প্রান্ত থেকে অপর প্রান্ত পর্যন্ত ইঞ্চি দাগ মেপে দেখুন।</li>
              <li>যদি মাপ ২.২৫" হয় তবে <strong>2.4</strong>, যদি ২.৩৮" হয় তবে <strong>2.6</strong> এবং যদি ২.৫" হয় তবে <strong>2.8</strong> নির্বাচন করুন।</li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition"
            >
              বুঝেছি, ধন্যবাদ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
