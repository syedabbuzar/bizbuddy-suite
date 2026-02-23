// Store context - provides global state management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  code: string;
  normalPrice: number;
  retailerPrice: number;
  buyingPrice: number;
  stock: number;
  createdAt: string;
}

export interface PriceHistory {
  id: string;
  productId: string;
  productName: string;
  oldNormalPrice: number;
  newNormalPrice: number;
  oldRetailerPrice: number;
  newRetailerPrice: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  type: 'normal' | 'retailer';
  totalPurchases: number;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  id: string;
  billNo: string;
  customerId: string;
  customerName: string;
  customerType: 'normal' | 'retailer';
  items: BillItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
}

export interface ShopInfo {
  name: string;
  contact: string;
  address: string;
  tagline: string;
}

interface StoreContextType {
  products: Product[];
  priceHistory: PriceHistory[];
  customers: Customer[];
  bills: Bill[];
  shopInfo: ShopInfo;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (c: Omit<Customer, 'id' | 'totalPurchases'>) => void;
  addBill: (b: Omit<Bill, 'id' | 'billNo' | 'date'>) => void;
  updateShopInfo: (s: ShopInfo) => void;
  updateStock: (productId: string, qty: number) => void;
  deleteCustomerBills: (customerName: string) => void;
  updateCustomerInBills: (oldName: string, newName: string, newType: 'normal' | 'retailer') => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const defaultShopInfo: ShopInfo = {
  name: 'SADIK TRADERS',
  contact: 'Imran: 8390090038 | Sadiq: 9359458298 | Dilshad: 9356720070',
  address: 'Your Shop Address Here',
  tagline: 'Visit Again, Thank You!',
};

const defaultCustomers: Customer[] = [
  { id: 'c1', name: 'Walk-in Customer', mobile: '', type: 'normal', totalPurchases: 0 },
];

const defaultProducts: Product[] = [
  { id: '1', name: 'Almonds (Badam)', category: 'Dry Fruits', code: 'DF001', normalPrice: 850, retailerPrice: 780, buyingPrice: 700, stock: 50, createdAt: '2026-01-15' },
  { id: '2', name: 'Cashew (Kaju)', category: 'Dry Fruits', code: 'DF002', normalPrice: 950, retailerPrice: 880, buyingPrice: 800, stock: 35, createdAt: '2026-01-15' },
  { id: '3', name: 'Turmeric Powder', category: 'Spices', code: 'SP001', normalPrice: 180, retailerPrice: 150, buyingPrice: 120, stock: 100, createdAt: '2026-01-15' },
  { id: '4', name: 'Red Chilli Powder', category: 'Spices', code: 'SP002', normalPrice: 220, retailerPrice: 190, buyingPrice: 160, stock: 80, createdAt: '2026-01-15' },
  { id: '5', name: 'Raisins (Kishmish)', category: 'Dry Fruits', code: 'DF003', normalPrice: 320, retailerPrice: 280, buyingPrice: 240, stock: 5, createdAt: '2026-01-20' },
  { id: '6', name: 'Black Pepper', category: 'Spices', code: 'SP003', normalPrice: 650, retailerPrice: 600, buyingPrice: 520, stock: 3, createdAt: '2026-01-20' },
];

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function load<T>(key: string, fallback: T): T {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load('st_products', defaultProducts));
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>(() => load('st_priceHistory', []));
  const [customers, setCustomers] = useState<Customer[]>(() => load('st_customers', defaultCustomers));
  const [bills, setBills] = useState<Bill[]>(() => load('st_bills', []));
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => load('st_shopInfo', defaultShopInfo));

  useEffect(() => { localStorage.setItem('st_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('st_priceHistory', JSON.stringify(priceHistory)); }, [priceHistory]);
  useEffect(() => { localStorage.setItem('st_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('st_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('st_shopInfo', JSON.stringify(shopInfo)); }, [shopInfo]);

  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    setProducts(prev => [...prev, { ...p, id: genId(), createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      if (updates.normalPrice !== undefined || updates.retailerPrice !== undefined) {
        setPriceHistory(h => [...h, {
          id: genId(), productId: id, productName: p.name,
          oldNormalPrice: p.normalPrice, newNormalPrice: updates.normalPrice ?? p.normalPrice,
          oldRetailerPrice: p.retailerPrice, newRetailerPrice: updates.retailerPrice ?? p.retailerPrice,
          date: new Date().toISOString().split('T')[0],
        }]);
      }
      return updated;
    }));
  };

  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const updateStock = (productId: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + qty } : p));
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'totalPurchases'>) => {
    setCustomers(prev => [...prev, { ...c, id: genId(), totalPurchases: 0 }]);
  };

  const addBill = (b: Omit<Bill, 'id' | 'billNo' | 'date'>) => {
    const billNo = `ST-${(bills.length + 1).toString().padStart(4, '0')}`;
    const newBill = { ...b, id: genId(), billNo, date: new Date().toISOString().split('T')[0] };
    setBills(prev => [...prev, newBill]);
    // Deduct stock
    b.items.forEach(item => updateStock(item.productId, -item.quantity));
    // Update customer total
    setCustomers(prev => prev.map(c => c.id === b.customerId ? { ...c, totalPurchases: c.totalPurchases + b.total } : c));
  };

  const deleteCustomerBills = (customerName: string) => {
    setBills(prev => prev.filter(b => b.customerName.toLowerCase().trim() !== customerName.toLowerCase().trim()));
  };

  const updateCustomerInBills = (oldName: string, newName: string, newType: 'normal' | 'retailer') => {
    setBills(prev => prev.map(b =>
      b.customerName.toLowerCase().trim() === oldName.toLowerCase().trim()
        ? { ...b, customerName: newName, customerType: newType }
        : b
    ));
  };

  const updateShopInfo = (s: ShopInfo) => setShopInfo(s);

  return (
    <StoreContext.Provider value={{ products, priceHistory, customers, bills, shopInfo, addProduct, updateProduct, deleteProduct, addCustomer, addBill, updateShopInfo, updateStock, deleteCustomerBills, updateCustomerInBills }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
