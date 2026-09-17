export interface Product {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: 'bangle-sets' | 'single-pairs' | 'festive-bridal' | 'customized';
  categoryBn: string;
  images: string[];
  sizes: string[]; // e.g. ['2.4', '2.6', '2.8']
  colors: string[];
  colorImageMap?: Record<string, string>; // maps color name to specific image path
  descriptionBn: string;
  descriptionEn: string;
  featuresBn: string[];
  featuresEn: string[];
  specifications: {
    material: string;
    bangleSizes: string;
    origin: string;
    customization: string;
    processingTime: string;
  };
  isFeatured: boolean;
  inStock: boolean;
  stockQuantity: number;
  facebookPostUrl: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  commentBn: string;
  verifiedBuyer: boolean;
  date: string;
  bangleOrdered?: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  division: string;
  district: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  deliveryCharge: number;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash';
  status: OrderStatus;
  orderNotes?: string;
}

export interface StoreSettings {
  storeName: string;
  storeNameBn: string;
  storeTaglineBn: string;
  facebookUrl: string;
  phone: string;
  location: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  bkashNumber: string;
  processingTimeBn: string;
  announcementBn: string;
}

export interface CustomerSummary {
  phone: string;
  name: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}
