import { CustomerReview } from '../types';

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'তানজিলা রহমান',
    location: 'মিরপুর, ঢাকা',
    rating: 5,
    commentBn: 'চুড়িগুলো হাতে পেয়ে সত্যিই মুগ্ধ হয়েছি! ছবির থেকেও সামনাসামনি অনেক বেশি সুন্দর ও নিখুঁত ফিনিশিং। ২.৬ সাইজ একদম পারফেক্ট হয়েছে। খুব সুন্দর প্যাকেজিং ছিল।',
    verifiedBuyer: true,
    date: '৩ দিন আগে',
    bangleOrdered: 'উৎসব কালেকশন লাল ও সোনালী ব্রাইডাল চুড়ি সেট',
    image: '/9.png'
  },
  {
    id: 'rev-2',
    name: 'ফারহানা ইসলাম সুমি',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    rating: 5,
    commentBn: 'আমার হলুদ সন্ধ্যার শাড়ির সাথে ম্যাচ করে বানিয়ে দিয়েছিলেন। কালার ম্যাচিং ১০০% পারফেক্ট হয়েছে! বান্ধবীরা সবাই খুব প্রশংসা করেছে। ডেলিভারিও মাত্র ৩ দিনে পেয়েছি।',
    verifiedBuyer: true,
    date: '১ সপ্তাহ আগে',
    bangleOrdered: 'কাস্টমাইজড ম্যাচিং চুড়ি সেট (হলুদ ও পার্ল)',
    image: '/5.png'
  },
  {
    id: 'rev-3',
    name: 'নুসরাত জাহান মিথিলা',
    location: 'উপশহর, সিলেট',
    rating: 5,
    commentBn: 'সরাসরি ফেসবুক পেজে নক দিয়েছিলাম, আপু অনেক আন্তরিকভাবে সাইজ গাইড করেছিলেন। হাতে পরলে খুব হালকা লাগে, সুতার কোয়ালিটি অনেক ভালো। ধন্যবাদ স্নেহময়ী!',
    verifiedBuyer: true,
    date: '২ সপ্তাহ আগে',
    bangleOrdered: 'পান্না সবুজ ও জরি চুড়ি সেট',
    image: '/2.png'
  },
  {
    id: 'rev-4',
    name: 'সাদিয়া আফরিন',
    location: 'ধানমন্ডি, ঢাকা',
    rating: 5,
    commentBn: 'ক্যাশ অন ডেলিভারিতে নিলাম। প্যাকিং খুব শক্তপোক্ত ছিল, চুড়ির কোনো ক্ষতি হয়নি। ব্ল্যাক ও গোল্ডেন পেয়ারটা যেকোনো ওয়েস্টার্ন কিংবা শাড়ির সাথে দারুণ মানায়।',
    verifiedBuyer: true,
    date: '৩ সপ্তাহ আগে',
    bangleOrdered: 'রয়েল ব্ল্যাক ও সোনালী হ্যান্ডক্রাফটেড চুড়ি পেয়ার',
    image: '/6.png'
  }
];

export const DISPATCH_STATS = {
  totalDeliveredBn: '১,২০০+ সফল ডেলিভারি',
  districtsCoveredBn: '৬৪ জেলায় হোম ডেলিভারি',
  averageRating: '৪.৯ / ৫.০',
  happyCustomersBn: '৯৮% সন্তুষ্ট গ্রাহক',
  dispatchProofImage: '/12.png',
  customerShowcaseImage: '/9.png',
  reviewScreenshotImage: '/11.png'
};
