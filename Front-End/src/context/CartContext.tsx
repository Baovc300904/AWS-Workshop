import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game, addToCart as apiAddToCart } from '../api/client';

interface CartItem extends Game {
  quantity: number;
}

interface CartContextValue {
  cart: CartItem[];
  add: (game: Game, options?: { redirect?: boolean }) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  totalRaw: number;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('demo_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('demo_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const add = useCallback(async (game: Game, { redirect = false } = {}) => {
    // Always update local cart first (for immediate UI feedback)
    setCart((prev) => {
      const existing = prev.find((g) => g.id === game.id);
      if (existing) {
        return prev.map((g) =>
          g.id === game.id ? { ...g, quantity: g.quantity + 1 } : g
        );
      }
      return [...prev, { ...game, quantity: 1 }];
    });
    
    // Sync with backend if user is logged in
    const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
    if (token) {
      try {
        await apiAddToCart({ gameId: game.id, quantity: 1 });
        console.log('[CartContext] Synced cart with backend:', game.id);
      } catch (err) {
        console.error('[CartContext] Failed to sync cart with backend:', err);
        // Don't remove from local cart even if API fails - allow offline mode
      }
    }
    
    if (redirect) navigate('/checkout');
    return true;
  }, [navigate]);

  const remove = useCallback((id: string) => {
    setCart((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((g) => (g.id === id ? { ...g, quantity: Math.max(1, quantity) } : g))
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const totalRaw = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const salePercent = (item as any).salePercent || 0;
    const finalPrice = salePercent > 0 ? price * (1 - salePercent / 100) : price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const value = { cart, add, remove, clear, totalRaw, updateQuantity };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
