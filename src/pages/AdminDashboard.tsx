import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, Product, CustomerSummary, StoreSettings } from '../types';
import { formatBDT } from '../utils/phoneValidation';
import { 
  Lock, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  FileSpreadsheet, 
  Printer, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  ChevronDown, 
  LogOut,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageCircle
} from 'lucide-react';

const ADMIN_TOKEN_KEY = 'snehomoyi_admin_token_v1';

export const AdminDashboard: React.FC = () => {
  const { path, navigate } = useRouter();
  const { settings, refreshSettings, refreshProducts, products } = useStore();

  // Determine active tab from URL or state
  const getTabFromPath = () => {
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/customers')) return 'customers';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/orders')) return 'orders';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'settings'>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [path]);

  // Auth State
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Orders Filter & Selection
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);

  // Print Packing Slip Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [ordersToPrint, setOrdersToPrint] = useState<Order[]>([]);

  // Product CRUD Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Check auth and fetch data
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [ordersRes, customersRes] = await Promise.all([
        fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (ordersRes.status === 401 || customersRes.status === 401) {
        handleLogout();
        return;
      }

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        if (oData.orders) setOrders(oData.orders);
      }

      if (customersRes.ok) {
        const cData = await customersRes.json();
        if (cData.customers) setCustomers(cData.customers);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setToken(data.token);
        setPasswordInput('');
      } else {
        setAuthError(data.message || 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।');
      }
    } catch (e) {
      setAuthError('লগইন ব্যর্থ হয়েছে। সার্ভার সংযোগ চেক করুন।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  };

  // Update Status of Single Order
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder({ ...viewingOrder, status: newStatus });
        }
      }
    } catch (e) {
      alert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async (newStatus: OrderStatus) => {
    if (!token || selectedOrderIds.length === 0) return;
    try {
      const res = await fetch('/api/orders/bulk-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderIds: selectedOrderIds, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            selectedOrderIds.includes(o.id) ? { ...o, status: newStatus } : o
          )
        );
        setSelectedOrderIds([]);
        setIsBulkStatusOpen(false);
      }
    } catch (e) {
      alert('বাল্ক আপডেট ব্যর্থ হয়েছে');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!token || !window.confirm(`আপনি কি সত্যিই অর্ডার #${orderId} মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
        if (viewingOrder && viewingOrder.id === orderId) setViewingOrder(null);
      }
    } catch (e) {
      alert('অর্ডার মোছা সম্ভব হয়নি');
    }
  };

  // Export to Excel using xlsx
  const handleExportToExcel = () => {
    const ordersToExport =
      selectedOrderIds.length > 0
        ? orders.filter((o) => selectedOrderIds.includes(o.id))
        : filteredOrders;

    if (ordersToExport.length === 0) {
      alert('এক্সপোর্ট করার মতো কোনো অর্ডার পাওয়া যায়নি');
      return;
    }

    const rows = ordersToExport.map((o) => {
      const itemsDetail = o.items
        .map((it) => `${it.productName} (সাইজ: ${it.size}) x${it.quantity}`)
        .join('; ');

      return {
        'Order ID': o.id,
        'Date & Time': new Date(o.createdAt).toLocaleString('en-US'),
        'Customer Name': o.customerName,
        'Mobile Phone': o.phone,
        'Delivery Address': o.address,
        'District': o.district,
        'Division': o.division,
        'Ordered Items & Sizes': itemsDetail,
        'Subtotal (BDT)': o.subtotal,
        'Delivery Charge (BDT)': o.deliveryCharge,
        'Total COD Amount (BDT)': o.totalAmount,
        'Payment Method': o.paymentMethod.toUpperCase(),
        'Order Status': o.status,
        'Special Notes': o.orderNotes || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    
    // Auto column widths
    const max_width = rows.reduce((w, r) => Math.max(w, r['Customer Name'].length), 10);
    worksheet['!cols'] = [
      { wch: 12 }, { wch: 20 }, { wch: max_width + 4 }, { wch: 15 },
      { wch: 35 }, { wch: 15 }, { wch: 12 }, { wch: 45 },
      { wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 15 },
      { wch: 14 }, { wch: 30 }
    ];

    const fileName = `Snehomoyi_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Print Packing Slip / Shipping Label
  const triggerPrintPackingSlips = (targetOrders: Order[]) => {
    setOrdersToPrint(targetOrders);
    setIsPrintModalOpen(true);
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProduct) return;

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        await refreshProducts();
        setIsProductModalOpen(false);
        setEditingProduct(null);
      } else {
        alert('পণ্য সেভ করা যায়নি');
      }
    } catch (e) {
      alert('পণ্য সেভ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token || !window.confirm('আপনি কি এই চুড়িটি তালিকা থেকে মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await refreshProducts();
      }
    } catch (e) {
      alert('পণ্য মোছা সম্ভব হয়নি');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        await refreshSettings();
        alert('স্টোর সেটিংস সফলভাবে আপডেট হয়েছে!');
      }
    } catch (e) {
      alert('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  // Filtered Orders calculation
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.district.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Render Login Modal if not authenticated
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              স্নেহময়ী অ্যাডমিন লগইন
            </h2>
            <p className="text-xs text-slate-500">
              অর্ডার পরিচালনা ও স্টোর কন্ট্রোলের জন্য পাসওয়ার্ড লিখুন
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড (Admin Password)
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                placeholder="ডিফল্ট পাসওয়ার্ড: admin123"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                পাসওয়ার্ড: <code className="font-mono text-slate-600 font-bold">admin123</code> অথবা <code className="font-mono text-slate-600 font-bold">snehomoyi2026</code>
              </p>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm shadow-md transition"
            >
              {isLoggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (Access Admin)'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              ← স্টোরে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">স্নেহময়ী কন্ট্রোল প্যানেল</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            ম্যানেজমেন্ট ড্যাশবোর্ড
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-rose-600' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            স্টোর ভিউ
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setActiveTab('overview');
            navigate('/admin');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'overview'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>পরিসংখ্যান (Overview)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
            navigate('/admin/orders');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার তালিকা ({orders.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('products');
            navigate('/admin/products');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'products'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>চুড়ি পণ্য ব্যবস্থাপনা ({products.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('customers');
            navigate('/admin/customers');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'customers'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>গ্রাহক তালিকা ({customers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            navigate('/admin/settings');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'settings'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>স্টোর ও ডেলিভারি সেটিংস</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>মোট বিক্রয় রেভিনিউ</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">৳</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-sans">{formatBDT(totalRevenue)}</p>
              <p className="text-[11px] text-slate-400">সকল সফল ও চলমান অর্ডার</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>মোট অর্ডার সংখ্যা</span>
                <ShoppingBag className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-sans">{orders.length} টি</p>
              <p className="text-[11px] text-amber-600 font-semibold">{pendingOrders} টি নতুন পেন্ডিং অর্ডার</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>কুরিয়ার ও ডেলিভারি</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-sans">{shippedOrders + deliveredOrders} টি</p>
              <p className="text-[11px] text-slate-400">{shippedOrders} টি ট্রানজিটে, {deliveredOrders} টি ডেলিভার্ড</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>স্টোর পণ্য সংখ্যা</span>
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-sans">{products.length} টি চুড়ি</p>
              <p className="text-[11px] text-emerald-600 font-semibold">সবগুলো লাইভ ও সক্রিয়</p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-slate-900 text-base">দ্রুত অ্যাকশন (Quick Actions)</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    navigate('/admin/orders');
                  }}
                  className="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-between transition"
                >
                  <span>অর্ডার প্রসেসিং শুরু করুন</span>
                  <ShoppingBag className="w-4 h-4" />
                </button>

                <button
                  onClick={handleExportToExcel}
                  className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-between transition"
                >
                  <span>সব অর্ডার এক্সেল (Excel) ফাইলে ডাউনলোড</span>
                  <FileSpreadsheet className="w-4 h-4" />
                </button>

                <button
                  onClick={() => triggerPrintPackingSlips(orders.filter(o => o.status !== 'Cancelled'))}
                  className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-between transition"
                >
                  <span>ডেলিভারি প্যাকিং স্লিপ প্রিন্ট করুন</span>
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-slate-900 text-base">সাম্প্রতিক অর্ডারসমূহ</h3>
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    navigate('/admin/orders');
                  }}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  সকল অর্ডার দেখুন ({orders.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{o.id}</span>
                      <span className="text-slate-500 ml-2">{o.customerName}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{o.district} • {o.items.length} টি আইটেম</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-sans">{formatBDT(o.totalAmount)}</span>
                      <p className="text-[10px] mt-0.5 font-semibold text-rose-700">{o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Order Filters and Actions Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, নাম, ফোন বা জেলা দিয়ে খুঁজুন..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 px-3 pl-9 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200 w-full md:w-auto"
                >
                  <option value="all">সকল স্ট্যাটাস ({orders.length})</option>
                  <option value="Pending">পেন্ডিং (Pending)</option>
                  <option value="Confirmed">কনফার্মড (Confirmed)</option>
                  <option value="Processing">প্রসেসিং (Processing)</option>
                  <option value="Shipped">কুরিয়ারে পাঠানো (Shipped)</option>
                  <option value="Delivered">ডেলিভার্ড (Delivered)</option>
                  <option value="Cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>

              {/* Actions: Export to Excel & Print */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  id="admin-export-excel-btn"
                  onClick={handleExportToExcel}
                  className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>এক্সেল এক্সপোর্ট</span>
                </button>

                <button
                  id="admin-print-labels-btn"
                  onClick={() => {
                    const toPrint =
                      selectedOrderIds.length > 0
                        ? orders.filter((o) => selectedOrderIds.includes(o.id))
                        : filteredOrders;
                    triggerPrintPackingSlips(toPrint);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>লেবেল প্রিন্ট ({selectedOrderIds.length || filteredOrders.length})</span>
                </button>
              </div>

            </div>

            {/* Bulk Selection Bar */}
            {selectedOrderIds.length > 0 && (
              <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-rose-900">
                  {selectedOrderIds.length} টি অর্ডার সিলেক্ট করেছেন
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">বাল্ক স্ট্যাটাস পরিবর্তন:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleBulkStatusUpdate(e.target.value as OrderStatus);
                    }}
                    defaultValue=""
                    className="bg-white border border-rose-300 rounded-xl py-1 px-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="" disabled>স্ট্যাটাস নির্বাচন...</option>
                    <option value="Confirmed">Confirmed চিহ্নিত করুন</option>
                    <option value="Processing">Processing চিহ্নিত করুন</option>
                    <option value="Shipped">Shipped চিহ্নিত করুন</option>
                    <option value="Delivered">Delivered চিহ্নিত করুন</option>
                    <option value="Cancelled">Cancelled চিহ্নিত করুন</option>
                  </select>
                  <button
                    onClick={() => setSelectedOrderIds([])}
                    className="text-rose-600 hover:underline font-semibold ml-2"
                  >
                    সিলেকশন বাতিল
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table & Mobile Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredOrders.length > 0 &&
                          selectedOrderIds.length === filteredOrders.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds(filteredOrders.map((o) => o.id));
                          } else {
                            setSelectedOrderIds([]);
                          }
                        }}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </th>
                    <th className="py-3.5 px-3">অর্ডার আইডি</th>
                    <th className="py-3.5 px-3">তারিখ</th>
                    <th className="py-3.5 px-3">গ্রাহকের নাম ও ফোন</th>
                    <th className="py-3.5 px-3">জেলা ও এলাকা</th>
                    <th className="py-3.5 px-3">আইটেম ও সাইজ</th>
                    <th className="py-3.5 px-3">মোট (COD)</th>
                    <th className="py-3.5 px-3">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        কোনো অর্ডার পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedOrderIds.includes(order.id);
                      return (
                        <tr key={order.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-rose-50/40' : ''}`}>
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrderIds([...selectedOrderIds, order.id]);
                                } else {
                                  setSelectedOrderIds(selectedOrderIds.filter((id) => id !== order.id));
                                }
                              }}
                              className="rounded text-rose-600 focus:ring-rose-500"
                            />
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-rose-700">
                            #{order.id}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-3">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-[11px] font-mono text-slate-500">{order.phone}</p>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-medium text-slate-800">{order.district}</span>
                            <span className="text-[10px] text-slate-400 block">{order.division}</span>
                          </td>
                          <td className="py-3.5 px-3 max-w-[200px]">
                            <div className="truncate text-xs text-slate-700 font-medium">
                              {order.items.map((it) => `${it.productName} (${it.size})`).join(', ')}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              মোট {order.items.reduce((s, i) => s + i.quantity, 0)} জোড়া/সেট
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900 font-sans whitespace-nowrap">
                            {formatBDT(order.totalAmount)}
                          </td>
                          <td className="py-3.5 px-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`py-1 px-2 rounded-xl text-xs font-bold border ${
                                order.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : order.status === 'Confirmed'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : order.status === 'Processing'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : order.status === 'Shipped'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                  : order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => triggerPrintPackingSlips([order])}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Print Label"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  কোনো অর্ডার পাওয়া যায়নি
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('880')
                    ? cleanPhone
                    : cleanPhone.startsWith('0')
                    ? `88${cleanPhone}`
                    : `880${cleanPhone}`;
                  const waMsg = encodeURIComponent(
                    `আসসালামু আলাইকুম ${order.customerName}, স্নেহময়ী থেকে আপনার অর্ডার #${order.id} সংক্রান্ত তথ্য নিশ্চিত করার জন্য যোগাযোগ করা হচ্ছে।`
                  );

                  return (
                    <div
                      key={order.id}
                      className={`p-4 space-y-3 transition ${
                        isSelected ? 'bg-rose-50/50' : 'bg-white'
                      }`}
                    >
                      {/* Top Bar: Checkbox + ID + Date + Amount */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrderIds([...selectedOrderIds, order.id]);
                              } else {
                                setSelectedOrderIds(
                                  selectedOrderIds.filter((id) => id !== order.id)
                                );
                              }
                            }}
                            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                          />
                          <div>
                            <span className="font-mono font-bold text-rose-700 text-sm">
                              #{order.id}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 text-base font-sans">
                            {formatBDT(order.totalAmount)}
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                            {order.paymentMethod === 'bkash' ? 'bKash' : 'COD'}
                          </span>
                        </div>
                      </div>

                      {/* Customer Details & Quick Contact */}
                      <div className="bg-slate-50 rounded-2xl p-3 space-y-2 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {order.customerName}
                            </p>
                            <p className="font-mono text-xs text-slate-600">
                              {order.phone}
                            </p>
                          </div>
                          
                          {/* Quick Call & WhatsApp Shortcuts */}
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${order.phone}`}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shadow-2xs active:scale-95 transition"
                              title="কল করুন"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-2xs active:scale-95 transition"
                              title="WhatsApp মেসেজ"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-1.5">
                          {order.address}, <span className="font-semibold text-slate-800">{order.district}</span> ({order.division})
                        </p>
                      </div>

                      {/* Items Summary */}
                      <div className="text-xs space-y-1">
                        <div className="text-slate-500 text-[11px] font-semibold flex justify-between">
                          <span>অর্ডারকৃত চুড়ি</span>
                          <span>{order.items.reduce((s, i) => s + i.quantity, 0)} জোড়া/সেট</span>
                        </div>
                        <div className="bg-rose-50/50 rounded-xl p-2.5 text-xs text-slate-800 border border-rose-100/80 space-y-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="font-medium text-slate-900 line-clamp-1">
                                {it.productName} ({it.size})
                              </span>
                              <span className="font-bold text-slate-700 ml-2 shrink-0">
                                x{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Selector & Action Buttons (Mobile Touch Friendly) */}
                      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <div className="flex-1">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold border min-h-[44px] ${
                              order.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : order.status === 'Confirmed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'Processing'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : order.status === 'Shipped'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="Pending">Pending (অপেক্ষমাণ)</option>
                            <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                            <option value="Processing">Processing (প্রস্তুত হচ্ছে)</option>
                            <option value="Shipped">Shipped (কুরিয়ারে)</option>
                            <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                            <option value="Cancelled">Cancelled (বাতিল)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 min-h-[44px] transition active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>বিস্তারিত</span>
                          </button>
                          <button
                            onClick={() => triggerPrintPackingSlips([order])}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition active:scale-95"
                            title="প্যাকিং স্লিপ"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition active:scale-95"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PRODUCTS MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">চুড়ি ক্যাটালগ পণ্য</h2>
              <p className="text-xs text-slate-500">
                স্নেহময়ী ফেসবুক পেজের সকল আসল চুড়ি আইটেম পরিচালনা করুন।
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  nameBn: '',
                  nameEn: '',
                  price: 200,
                  originalPrice: 220,
                  discountPercent: 10,
                  category: 'bangle-sets',
                  categoryBn: 'চুড়ি সেট',
                  images: [
                    'https://images.unsplash.com/photo-1611591475152-473523a10fb8?w=800&auto=format&fit=crop&q=80'
                  ],
                  sizes: ['2.4', '2.6', '2.8'],
                  colors: ['লাল', 'সোনালী'],
                  descriptionBn: '',
                  descriptionEn: '',
                  featuresBn: ['১০০% হাতে তৈরি', 'সাইজ: ২.৪, ২.৬, ২.৮'],
                  featuresEn: ['100% handmade'],
                  specifications: {
                    material: 'সুতা ও মেটাল রিং',
                    bangleSizes: '2.4, 2.6, 2.8',
                    origin: 'ঢাকা, বাংলাদেশ',
                    customization: 'উপলব্ধ',
                    processingTime: '২-৪ দিন'
                  },
                  isFeatured: true,
                  inStock: true,
                  stockQuantity: 50,
                  facebookPostUrl: settings.facebookUrl,
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন চুড়ি আইটেম যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={p.images[0]}
                      alt={p.nameBn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold">
                      {p.categoryBn}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{p.nameBn}</h3>
                      <span className="font-bold text-rose-700 text-sm font-sans">{formatBDT(p.price)}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.descriptionBn}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>সাইজ:</span>
                      {p.sizes.map((s) => (
                        <span key={s} className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-800 font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${p.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.inStock ? `স্টকে আছে (${p.stockQuantity} সেট)` : 'আউট অফ স্টক'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: CUSTOMERS ================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-serif font-bold text-slate-900">গ্রাহক তালিকা (Customer Directory)</h2>
            <p className="text-xs text-slate-500">
              সকল সফল ও চলমান অর্ডারের ভিত্তিতে তৈরি স্বয়ংক্রিয় গ্রাহক তালিকা।
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">গ্রাহকের নাম</th>
                  <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                  <th className="py-3.5 px-4">ডেলিভারি ঠিকানা</th>
                  <th className="py-3.5 px-4 text-center">মোট অর্ডার</th>
                  <th className="py-3.5 px-4 text-right">মোট ক্রয় মূল্য (BDT)</th>
                  <th className="py-3.5 px-4">সর্বশেষ অর্ডার</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.phone} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-700 font-bold">{c.phone}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{c.address}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{c.totalOrders} টি</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-sans">{formatBDT(c.totalSpent)}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {new Date(c.lastOrderDate).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Customer Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {customers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                কোনো গ্রাহক পাওয়া যায়নি
              </div>
            ) : (
              customers.map((c) => {
                const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                const waNumber = cleanPhone.startsWith('880')
                  ? cleanPhone
                  : cleanPhone.startsWith('0')
                  ? `88${cleanPhone}`
                  : `880${cleanPhone}`;
                const waCustomerMsg = encodeURIComponent(
                  `আসসালামু আলাইকুম ${c.name}, স্নেহময়ী থেকে আপনাকে শুভেচ্ছা!`
                );

                return (
                  <div key={c.phone} className="p-4 space-y-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <p className="font-mono text-xs text-rose-700 font-semibold">{c.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-sm font-sans block">
                          {formatBDT(c.totalSpent)}
                        </span>
                        <span className="text-[10px] text-slate-400">মোট কেনাকাটা</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {c.address}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[11px]">
                          {c.totalOrders} টি অর্ডার
                        </span>
                        <span className="text-[11px] text-slate-400">
                          সর্বশেষ: {new Date(c.lastOrderDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${c.phone}`}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs active:scale-95"
                          title="কল করুন"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${waNumber}?text=${waCustomerMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-2xs active:scale-95"
                          title="WhatsApp চ্যাট"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: STORE SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
            স্টোর ও ডেলিভারি কনফিগারেশন
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            ডেলিভারি চার্জ, ফ্রি ডেলিভারি সীমা ও যোগাযোগ তথ্য পরিবর্তন করুন।
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ঢাকা সিটি ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  required
                  value={settingsForm.deliveryInsideDhaka}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryInsideDhaka: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  required
                  value={settingsForm.deliveryOutsideDhaka}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryOutsideDhaka: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ফ্রি ডেলিভারি নূন্যতম টাকার সীমা
                </label>
                <input
                  type="number"
                  required
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বিকাশ পার্সোনাল নম্বর (Pre-payment info)
                </label>
                <input
                  type="text"
                  value={settingsForm.bkashNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-rose-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ফেসবুক পেজ লিঙ্ক (Source URL)
              </label>
              <input
                type="url"
                value={settingsForm.facebookUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                শীর্ষ ঘোষণা বার্তা (Top Announcement Bar Banner)
              </label>
              <textarea
                rows={2}
                value={settingsForm.announcementBn}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementBn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 px-3 text-xs sm:text-sm focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition"
              >
                সেটিংস সংরক্ষণ করুন (Save Settings)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">
                  অর্ডার বিস্তারিত: #{viewingOrder.id}
                </h3>
                <p className="text-xs text-slate-500">
                  তারিখ: {new Date(viewingOrder.createdAt).toLocaleString('en-GB')}
                </p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">গ্রাহকের নাম:</span>
                <p className="font-bold text-slate-900">{viewingOrder.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">মোবাইল:</span>
                <p className="font-bold text-rose-700 font-mono">{viewingOrder.phone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">সম্পূর্ণ ঠিকানা:</span>
                <p className="font-medium text-slate-800">
                  {viewingOrder.address}, {viewingOrder.district}, {viewingOrder.division}
                </p>
              </div>
              {viewingOrder.orderNotes && (
                <div className="col-span-2 p-2.5 bg-amber-50 rounded-xl text-amber-900">
                  <span className="font-bold">নোট:</span> {viewingOrder.orderNotes}
                </div>
              )}
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-2.5 bg-slate-50 font-semibold text-slate-600 flex justify-between">
                <span>পণ্য ও সাইজ</span>
                <span>মূল্য</span>
              </div>
              {viewingOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">সাইজ: {item.size} • পরিমাণ: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 font-sans">{formatBDT(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-semibold font-sans">{formatBDT(viewingOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold font-sans">{formatBDT(viewingOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>মোট সংগ্রহযোগ্য (COD)</span>
                <span className="text-rose-700 font-sans">{formatBDT(viewingOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => triggerPrintPackingSlips([viewingOrder])}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্যাকিং স্লিপ প্রিন্ট</span>
              </button>
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRINTABLE PACKING SLIP / LABEL MODAL ================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 max-h-[92vh] overflow-y-auto print:max-w-none print:w-full print:p-0 print:border-none print:shadow-none">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">
                  কুরিয়ার শিপিং লেবেল ও প্যাকিং স্লিপ ({ordersToPrint.length} টি)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>এখনই প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Slips List */}
            <div className="space-y-8 print:space-y-6">
              {ordersToPrint.map((ord) => (
                <div
                  key={ord.id}
                  className="border-2 border-dashed border-slate-300 p-6 rounded-2xl bg-white space-y-4 print:border-2 print:border-black print:rounded-none page-break-after-always"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-slate-900">
                        স্নেহময়ী (Snehomoyi)
                      </h2>
                      <p className="text-[11px] text-slate-600 font-medium">
                        হাতে তৈরি এক্সক্লুসিভ চুড়ি ও গহনা কালেকশন • ঢাকা, বাংলাদেশ
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-lg text-slate-900">
                        #{ord.id}
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        {ord.paymentMethod === 'bkash' ? 'PAID / BKASH' : 'CASH ON DELIVERY (COD)'}
                      </p>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400">প্রাপক (Customer / Receiver):</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{ord.customerName}</p>
                      <p className="font-mono font-bold text-rose-700 text-xs mt-0.5">{ord.phone}</p>
                      <p className="text-slate-700 mt-1 leading-relaxed">{ord.address}</p>
                      <p className="font-semibold text-slate-900 mt-0.5">{ord.district}, {ord.division}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">প্রেরক (Sender):</p>
                        <p className="text-xs font-bold text-slate-900 mt-1">স্নেহময়ী স্টোর (Snehomoyi)</p>
                        <p className="text-[11px] text-slate-600">ফেসবুক: fb.com/profile.php?id=61591073385566</p>
                        <p className="text-[11px] text-slate-600">ঢাকা, বাংলাদেশ</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <p className="text-[10px] text-slate-500">সংগ্রহযোগ্য ক্যাশ (COD Amount):</p>
                        <p className="text-xl font-black text-rose-700 font-sans">{formatBDT(ord.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary for Packing Team */}
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-800 text-[11px]">প্যাকেজের আইটেমসমূহ:</p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {ord.items.map((it, i) => (
                        <div key={i} className="p-2 flex justify-between">
                          <span className="font-medium text-slate-800">
                            {it.productName} — সাইজ: <strong>{it.size}</strong>
                          </span>
                          <span className="font-bold text-slate-900">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {ord.orderNotes && (
                    <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900">
                      <strong>নোট:</strong> {ord.orderNotes}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                    আমাদের পণ্য গ্রহণ করার জন্য ধন্যবাদ! কোনো প্রয়োজনে ফেসবুক পেজে ইনবক্স করুন।
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ================= PRODUCT ADD/EDIT MODAL ================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                {editingProduct.id ? 'চুড়ি আইটেম সম্পাদনা (Edit Product)' : 'নতুন চুড়ি আইটেম যোগ করুন'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পণ্যের নাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameEn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বিক্রয় মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পূর্বের মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">প্রধান ছবির লিঙ্ক (Image URL)</label>
                <input
                  type="url"
                  required
                  value={editingProduct.images ? editingProduct.images[0] : ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.descriptionBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
