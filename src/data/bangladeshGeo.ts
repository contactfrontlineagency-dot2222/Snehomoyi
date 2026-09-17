export interface Division {
  name: string;
  nameBn: string;
  districts: { name: string; nameBn: string }[];
}

export const BANGLADESH_DIVISIONS: Division[] = [
  {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      { name: 'Dhaka', nameBn: 'ঢাকা সিটি ও মেট্রোপলিটন' },
      { name: 'Gazipur', nameBn: 'গাজীপুর' },
      { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
      { name: 'Tangail', nameBn: 'টাঙ্গাইল' },
      { name: 'Narsingdi', nameBn: 'নরসিংদী' },
      { name: 'Faridpur', nameBn: 'ফরিদপুর' },
      { name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
      { name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
      { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
      { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
      { name: 'Madaripur', nameBn: 'মাদারীপুর' },
      { name: 'Rajbari', nameBn: 'রাজবাড়ী' },
      { name: 'Shariatpur', nameBn: 'শরীয়তপুর' }
    ]
  },
  {
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    districts: [
      { name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
      { name: 'Cox\'s Bazar', nameBn: 'কক্সবাজার' },
      { name: 'Comilla', nameBn: 'কুমিল্লা' },
      { name: 'Feni', nameBn: 'ফেনী' },
      { name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া' },
      { name: 'Noakhali', nameBn: 'নোয়াখালী' },
      { name: 'Chandpur', nameBn: 'চাঁদপুর' },
      { name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর' }
    ]
  },
  {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      { name: 'Sylhet', nameBn: 'সিলেট' },
      { name: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
      { name: 'Habiganj', nameBn: 'হবিগঞ্জ' },
      { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ' }
    ]
  },
  {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      { name: 'Rajshahi', nameBn: 'রাজশাহী' },
      { name: 'Bogra', nameBn: 'বগুড়া' },
      { name: 'Pabna', nameBn: 'পাবনা' },
      { name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ' },
      { name: 'Naogaon', nameBn: 'নওগাঁ' },
      { name: 'Natore', nameBn: 'নাটোর' },
      { name: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ' },
      { name: 'Joypurhat', nameBn: 'জয়পুরহাট' }
    ]
  },
  {
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      { name: 'Khulna', nameBn: 'খুলনা' },
      { name: 'Jessore', nameBn: 'যশোর' },
      { name: 'Kushtia', nameBn: 'কুষ্টিয়া' },
      { name: 'Satkhira', nameBn: 'সাতক্ষীরা' },
      { name: 'Bagerhat', nameBn: 'বাগেরহাট' },
      { name: 'Jhenaidah', nameBn: 'ঝিনাইদহ' }
    ]
  },
  {
    name: 'Barisal',
    nameBn: 'বরিশাল',
    districts: [
      { name: 'Barisal', nameBn: 'বরিশাল' },
      { name: 'Patuakhali', nameBn: 'পটুয়াখালী' },
      { name: 'Bhola', nameBn: 'ভোলা' },
      { name: 'Pirojpur', nameBn: 'পিরোজপুর' }
    ]
  },
  {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      { name: 'Rangpur', nameBn: 'রংপুর' },
      { name: 'Dinajpur', nameBn: 'দিনাজপুর' },
      { name: 'Gaibandha', nameBn: 'গাইবান্ধা' },
      { name: 'Kurigram', nameBn: 'কুড়িগ্রাম' }
    ]
  },
  {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      { name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
      { name: 'Jamalpur', nameBn: 'জামালপুর' },
      { name: 'Netrokona', nameBn: 'নেত্রকোণা' },
      { name: 'Sherpur', nameBn: 'শেরপুর' }
    ]
  }
];
