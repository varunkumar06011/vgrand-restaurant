import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { CartItem } from '@/types/restaurant';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const CART_ITEM_LIMIT = 5;

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        if (newQty > CART_ITEM_LIMIT) {
          toast.error(`Max ${CART_ITEM_LIMIT} of the same item allowed!`, {
            style: { background: '#1A1A1A', color: '#FF4444', border: '1px solid #FF4444' }
          });
          return prev;
        }
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        );
      }
      if (item.quantity > CART_ITEM_LIMIT) {
        toast.error(`Max ${CART_ITEM_LIMIT} of the same item allowed!`, {
          style: { background: '#1A1A1A', color: '#FF4444', border: '1px solid #FF4444' }
        });
        return [...prev, { ...item, quantity: CART_ITEM_LIMIT }];
      }
      return [...prev, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    if (quantity > CART_ITEM_LIMIT) {
      toast.error(`Max ${CART_ITEM_LIMIT} of the same item allowed!`, {
        style: { background: '#1A1A1A', color: '#FF4444', border: '1px solid #FF4444' }
      });
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
