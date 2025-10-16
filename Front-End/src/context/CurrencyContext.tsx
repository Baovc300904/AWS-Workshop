import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Currency = 'VND' | 'USD';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggle: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const EXCHANGE_RATE = 24000; // 1 USD = 24,000 VND (approximate)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('currency');
      return (saved === 'USD' ? 'USD' : 'VND') as Currency;
    } catch {
      return 'VND';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch {}
  }, [currency]);

  const toggle = useCallback(() => {
    setCurrency((c) => (c === 'VND' ? 'USD' : 'VND'));
  }, []);

  const value = { currency, setCurrency, toggle };
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside <CurrencyProvider>');
  return ctx;
}

export function formatPrice(price: number, currency: Currency = 'VND'): string {
  if (currency === 'USD') {
    return `$${(price / EXCHANGE_RATE).toFixed(2)}`;
  }
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
