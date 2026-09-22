import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Training } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (training: Training, selectedDate: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateDate: (index: number, date: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'afforestt_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (training: Training, selectedDate: string, quantity: number = 1) => {
    const newItem: CartItem = {
      trainingId: training.id,
      slug: training.slug,
      name: training.name,
      duration: training.duration,
      price: training.price,
      image_url: training.image_url,
      quantity,
      selectedDate,
      format: training.format,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const updateDate = (index: number, date: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, selectedDate: date } : item)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, updateDate, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
