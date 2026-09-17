import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './src/data/initialProducts';
import { Product, Order, StoreSettings, CustomerSummary } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreDatabase {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}

function loadDatabase(): StoreDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_FILE)) {
    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return {
        products: data.products || INITIAL_PRODUCTS,
        orders: data.orders || getInitialOrders(),
        settings: data.settings || INITIAL_SETTINGS,
      };
    } catch (e) {
      console.error('Error reading store.json, falling back to initial data', e);
    }
  }

  const initialDb: StoreDatabase = {
    products: INITIAL_PRODUCTS,
    orders: getInitialOrders(),
    settings: INITIAL_SETTINGS,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: StoreDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store.json:', err);
  }
}

function getInitialOrders(): Order[] {
  return [
    {
      id: 'SN-1082',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      customerName: 'নুসরাত জাহান (Nusrat Jahan)',
      phone: '01712345678',
      address: 'বাড়ি ১২, রোড ৫, সেক্টর ৭, উত্তরা, ঢাকা',
      division: 'Dhaka',
      district: 'ঢাকা সিটি ও মেট্রোপলিটন',
      deliveryArea: 'inside_dhaka',
      deliveryCharge: 70,
      items: [
        {
          productId: 'prod-1',
          productName: 'উৎসব কালেকশন লাল ও সবুজ পুঁতি চুড়ি সেট',
          productSlug: 'festive-red-green-beaded-churi-set',
          image: 'https://images.unsplash.com/photo-1611591475152-473523a10fb8?w=800&auto=format&fit=crop&q=80',
          size: '2.6',
          quantity: 2,
          unitPrice: 220,
          totalPrice: 440,
        },
      ],
      subtotal: 440,
      totalAmount: 510,
      paymentMethod: 'cod',
      status: 'Shipped',
      orderNotes: 'দ্রুত ডেলিভারি দিলে উপকৃত হবো। লাল কালার গাঢ় রাখবেন।',
    },
    {
      id: 'SN-1083',
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      customerName: 'সাদিয়া আফরিন (Sadia Afrin)',
      phone: '01898765432',
      address: 'হোল্ডিং ৪৫/বি, জিইসি মোড়, চকবাজার, চট্টগ্রাম',
      division: 'Chittagong',
      district: 'চট্টগ্রাম',
      deliveryArea: 'outside_dhaka',
      deliveryCharge: 130,
      items: [
        {
          productId: 'prod-6',
          productName: 'কাস্টমাইজড ম্যাচিং চুড়ি সেট (Customize Your Own Set)',
          productSlug: 'customized-outfit-matching-bangle-set',
          image: 'https://images.unsplash.com/photo-1611591475152-473523a10fb8?w=800&auto=format&fit=crop&q=80',
          size: '2.4',
          quantity: 1,
          unitPrice: 250,
          totalPrice: 250,
        },
        {
          productId: 'prod-2',
          productName: 'রয়েল ব্ল্যাক ও সোনালী হ্যান্ডক্রাফটেড চুড়ি পেয়ার',
          productSlug: 'royal-black-gold-handcrafted-churi-pair',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
          size: '2.4',
          quantity: 1,
          unitPrice: 160,
          totalPrice: 160,
        },
      ],
      subtotal: 410,
      totalAmount: 540,
      paymentMethod: 'cod',
      status: 'Processing',
      orderNotes: 'নেভি ব্লু ও সিলভার জরি শাড়ির সাথে ম্যাচিং চাওয়া হয়েছে।',
    },
    {
      id: 'SN-1084',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      customerName: 'তাহমিনা আক্তার (Tahmina Akter)',
      phone: '01911223344',
      address: 'হাউজ ১৭, রোড ২, বনশ্রী, রামপুরা, ঢাকা',
      division: 'Dhaka',
      district: 'ঢাকা সিটি ও মেট্রোপলিটন',
      deliveryArea: 'inside_dhaka',
      deliveryCharge: 70,
      items: [
        {
          productId: 'prod-8',
          productName: 'স্নেহময়ী ব্রাইডাল ও উৎসব স্পেশাল চুড়ি বক্স',
          productSlug: 'snehomoyi-bridal-festive-deluxe-churi-box',
          image: 'https://images.unsplash.com/photo-1611591475152-473523a10fb8?w=800&auto=format&fit=crop&q=80',
          size: '2.6',
          quantity: 1,
          unitPrice: 550,
          totalPrice: 550,
        },
      ],
      subtotal: 550,
      totalAmount: 620,
      paymentMethod: 'cod',
      status: 'Confirmed',
      orderNotes: 'উপহারের বক্স ভালো করে বাবল র‍্যাপ করে পাঠাবেন প্লিজ।',
    },
    {
      id: 'SN-1085',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      customerName: 'মৌমিতা রায় (Moumita Roy)',
      phone: '01655667788',
      address: 'কলেজ রোড, জিন্দা বাজার, সিলেট',
      division: 'Sylhet',
      district: 'সিলেট',
      deliveryArea: 'outside_dhaka',
      deliveryCharge: 130,
      items: [
        {
          productId: 'prod-3',
          productName: 'ঐতিহ্যবাহী লাল-সাদা উৎসব চুড়ি সেট',
          productSlug: 'traditional-red-white-festive-churi-set',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
          size: '2.8',
          quantity: 2,
          unitPrice: 200,
          totalPrice: 400,
        },
      ],
      subtotal: 400,
      totalAmount: 530,
      paymentMethod: 'cod',
      status: 'Pending',
    },
  ];
}

let db = loadDatabase();

// Admin credentials token
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'snehomoyi_admin_2026';

function verifyAdminToken(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  return token === ADMIN_SECRET;
}

// ================= API ROUTES =================

// 1. Products
app.get('/api/products', (req, res) => {
  res.json({ success: true, products: db.products });
});

app.get('/api/products/:slug', (req, res) => {
  const product = db.products.find(
    (p) => p.slug === req.params.slug || p.id === req.params.slug
  );
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    slug:
      req.body.slug ||
      req.body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  };
  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  db.products = db.products.filter((p) => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 2. Orders
app.get('/api/orders', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  res.json({ success: true, orders: db.orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      division,
      district,
      deliveryArea,
      items,
      orderNotes,
      paymentMethod,
    } = req.body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'দয়া করে নাম, মোবাইল নম্বর, ঠিকানা এবং পণ্যের বিবরণ পূরণ করুন',
      });
    }

    // Delivery calculation
    const isInsideDhaka = deliveryArea === 'inside_dhaka';
    const deliveryCharge = isInsideDhaka
      ? db.settings.deliveryInsideDhaka
      : db.settings.deliveryOutsideDhaka;

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.unitPrice || 0) * (item.quantity || 1),
      0
    );
    const finalDeliveryCharge =
      subtotal >= db.settings.freeDeliveryThreshold ? 0 : deliveryCharge;
    const totalAmount = subtotal + finalDeliveryCharge;

    const orderCount = db.orders.length + 1000;
    const newOrderId = `SN-${orderCount + 83}`;

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      division: division || 'Dhaka',
      district: district || 'ঢাকা',
      deliveryArea: isInsideDhaka ? 'inside_dhaka' : 'outside_dhaka',
      deliveryCharge: finalDeliveryCharge,
      items,
      subtotal,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      status: 'Pending',
      orderNotes: orderNotes ? orderNotes.trim() : undefined,
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
      order: newOrder,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const { status } = req.body;
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = status;
  saveDatabase(db);
  res.json({ success: true, order });
});

app.patch('/api/orders/bulk-status', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const { orderIds, status } = req.body;
  if (!Array.isArray(orderIds) || !status) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }
  db.orders.forEach((o) => {
    if (orderIds.includes(o.id)) {
      o.status = status;
    }
  });
  saveDatabase(db);
  res.json({ success: true, count: orderIds.length, status });
});

app.delete('/api/orders/:id', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  db.orders = db.orders.filter((o) => o.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Order removed' });
});

// 3. Customers
app.get('/api/customers', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const customerMap = new Map<string, CustomerSummary>();

  for (const order of db.orders) {
    const key = order.phone;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        phone: order.phone,
        name: order.customerName,
        address: order.address,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        lastOrderDate: order.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount;
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
        existing.name = order.customerName;
        existing.address = order.address;
      }
    }
  }

  res.json({ success: true, customers: Array.from(customerMap.values()) });
});

// 4. Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// 5. Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Default password or custom env secret
  if (password === 'admin123' || password === 'snehomoyi2026' || password === ADMIN_SECRET) {
    res.json({
      success: true,
      token: ADMIN_SECRET,
      message: 'Login successful',
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'ভুল অ্যাডমিন পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।',
    });
  }
});

app.get('/api/admin/verify', (req, res) => {
  if (verifyAdminToken(req)) {
    res.json({ success: true, valid: true });
  } else {
    res.status(401).json({ success: false, valid: false });
  }
});

// ================= VITE / STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Snehomoyi E-commerce Server running on http://localhost:${PORT}`);
  });
}

startServer();
