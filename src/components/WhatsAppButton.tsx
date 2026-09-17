import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface WhatsAppButtonProps {
  productName?: string;
  size?: string;
  color?: string;
  quantity?: number;
  price?: number;
  mode?: 'floating' | 'button';
  className?: string;
}

export function formatWhatsAppMessage(params: {
  productName?: string;
  size?: string;
  color?: string;
  quantity?: number;
  price?: number;
  storeName?: string;
}): string {
  if (!params.productName) {
    return encodeURIComponent(
      `নমস্কার/হ্যালো স্নেহময়ী! আমি আপনাদের হ্যান্ডক্রাফটেড চুড়ির কালেকশন সম্পর্কে বিস্তারিত জানতে চাই এবং কাস্টমাইজড অর্ডার দিতে চাই।`
    );
  }

  const msg = `নমস্কার স্নেহময়ী! আমি এই চুড়ি সেটটি অর্ডার করতে চাই:
• প্রোডাক্ট: ${params.productName}
• সাইজ: ${params.size || '২.৬ (স্ট্যান্ডার্ড)'}
• কালার: ${params.color || 'ডিফল্ট'}
• পরিমাণ: ${params.quantity || 1}
${params.price ? `• মূল্য: ৳${params.price * (params.quantity || 1)}` : ''}

আমার নাম ও ডেলিভারি ঠিকানা পাঠিয়ে অর্ডার কনফার্ম করতে চাই।`;

  return encodeURIComponent(msg);
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  size,
  color,
  quantity = 1,
  price,
  mode = 'floating',
  className = ''
}) => {
  const { settings } = useStore();
  const rawPhone = settings.phone || '880 1701-841905';
  const phoneClean = rawPhone.replace(/[^0-9]/g, '');
  // Format for WhatsApp international standard for Bangladesh (880...)
  const waNumber = phoneClean.startsWith('880')
    ? phoneClean
    : phoneClean.startsWith('0')
    ? `88${phoneClean}`
    : `880${phoneClean}`;

  const messageText = formatWhatsAppMessage({
    productName,
    size,
    color,
    quantity,
    price,
    storeName: settings.storeNameBn || 'স্নেহময়ী'
  });

  const waUrl = `https://wa.me/${waNumber}?text=${messageText}`;

  if (mode === 'button') {
    return (
      <a
        id="btn-whatsapp-order"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 min-h-[44px] ${className}`}
      >
        <MessageCircle className="w-5 h-5 flex-shrink-0" />
        <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
      </a>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group">
      <a
        id="floating-whatsapp-btn"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Snehomoyi"
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 min-w-[48px] min-h-[48px] justify-center"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
          WhatsApp অর্ডার
        </span>
      </a>
    </div>
  );
};
