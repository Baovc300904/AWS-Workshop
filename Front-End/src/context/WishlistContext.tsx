import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Game } from '../api/client';

interface WishlistContextValue {
  wishlist: string[];
  toggle: (game: Game) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// Get wishlist storage key based on logged-in user
const getWishlistKey = () => {
  const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
  if (!token) return 'wishlist_guest';
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub || payload.username || 'unknown';
    return `wishlist_${username}`;
  } catch {
    return 'wishlist_guest';
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(getWishlistKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggle = useCallback((game: Game) => {
    // Không yêu cầu đăng nhập để thêm vào wishlist
    // Wishlist được lưu local, có thể sync sau khi đăng nhập
    setWishlist((list) => {
      return list.includes(game.id)
        ? list.filter((id) => id !== game.id)
        : [...list, game.id];
    });
    return true;
  }, []);

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
