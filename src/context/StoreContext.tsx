import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialProducts';

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  products: INITIAL_PRODUCTS,
  settings: INITIAL_SETTINGS,
  loading: false,
  error: null,
  refreshProducts: async () => {},
  refreshSettings: async () => {},
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (e: any) {
      console.warn('Failed to fetch products from backend, using initial catalog', e);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (e: any) {
      console.warn('Failed to fetch settings from backend, using default settings', e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchSettings()]);
      if (isMounted) setLoading(false);
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [fetchProducts, fetchSettings]);

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        loading,
        error,
        refreshProducts: fetchProducts,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
