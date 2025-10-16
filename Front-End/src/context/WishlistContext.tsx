import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../api/client';

interface WishlistContextValue {
  wishlist: string[];
  toggle: (game: Game) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('wishlist_ids');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlist_ids', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggle = useCallback((game: Game) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    
    setWishlist((list) => {
      return list.includes(game.id)
        ? list.filter((id) => id !== game.id)
        : [...list, game.id];
    });
    return true;
  }, [navigate]);

  const remove = useCallback((id: string) => {
    setWishlist((list) => list.filter((gid) => gid !== id));
  }, []);

  const clear = useCallback(() => setWishlist([]), []);

  const isInWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, remove, clear, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
