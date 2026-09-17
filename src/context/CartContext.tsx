import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  addToCart: (product: Product, size: string, quantity?: number, color?: string) => void;
  updateQuantity: (productId: string, size: string, newQuantity: number, color?: string) => void;
  removeFromCart: (productId: string, size: string, color?: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsCartOpen?: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  subtotal: 0,
  totalItems: 0,
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: () => {},
});

export const useCart = () => {
  const ctx = useContext(CartContext);
  return {
    ...ctx,
    setIsCartOpen: ctx.setIsCartDrawerOpen,
  };
};

const CART_STORAGE_KEY = 'snehomoyi_cart_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, size: string, quantity = 1, color?: string) => {
    setItems((prev) => {
      const chosenColor = color || (product.colors && product.colors[0]) || '';
      const existingIndex = prev.findIndex(
        (it) => it.productId === product.id && it.size === size && (it.color || '') === chosenColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return updated;
      }

      // Pick image for chosen color if mapped
      let displayImage = product.images[0] || '';
      if (color && product.colorImageMap && product.colorImageMap[color]) {
        displayImage = product.colorImageMap[color];
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.nameBn,
          productSlug: product.slug,
          image: displayImage,
          size,
          color: chosenColor,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, size: string, newQuantity: number, color?: string) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          item.size === size &&
          (!color || item.color === color)
        ) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, size: string, color?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            (!color || item.color === color)
          )
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
