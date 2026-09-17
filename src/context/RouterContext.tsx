import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (newPath: string) => void;
  productSlug?: string;
  orderId?: string;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string) => {
    if (newPath !== path) {
      window.history.pushState({}, '', newPath);
      setPath(newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Derive slug or orderId if path matches /products/:slug or /order-success/:orderId
  let productSlug: string | undefined;
  let orderId: string | undefined;

  if (path.startsWith('/products/')) {
    productSlug = path.replace('/products/', '').split('?')[0].split('#')[0];
  } else if (path.startsWith('/order-success/')) {
    orderId = path.replace('/order-success/', '').split('?')[0].split('#')[0];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, productSlug, orderId }}>
      {children}
    </RouterContext.Provider>
  );
};
