import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type SubscriptionType = 'buy' | 'sell';

interface UserSubscriptions {
  buyActive: boolean;
  sellActive: boolean;
  buySince?: string;
  sellSince?: string;
}

interface SubscriptionContextType {
  getUserSubscriptions: (userId: string) => UserSubscriptions;
  hasBuySubscription: (userId: string) => boolean;
  hasSellSubscription: (userId: string) => boolean;
  activateSubscription: (userId: string, type: SubscriptionType) => void;
  refresh: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};

interface ProviderProps { children: ReactNode }

export const SubscriptionProvider: React.FC<ProviderProps> = ({ children }) => {
  const [store, setStore] = useState<Record<string, UserSubscriptions>>({});

  useEffect(() => {
    const saved = localStorage.getItem('subscriptions');
    if (saved) setStore(JSON.parse(saved));
  }, []);

  const save = (next: Record<string, UserSubscriptions>) => {
    setStore(next);
    localStorage.setItem('subscriptions', JSON.stringify(next));
  };

  const getUserSubscriptions = (userId: string): UserSubscriptions => {
    const persisted = localStorage.getItem('subscriptions');
    if (persisted) {
      try {
        const latest = JSON.parse(persisted);
        return latest[userId] ?? { buyActive: false, sellActive: false };
      } catch {}
    }
    return store[userId] ?? { buyActive: false, sellActive: false };
  };

  const hasBuySubscription = (userId: string) => getUserSubscriptions(userId).buyActive;
  const hasSellSubscription = (userId: string) => getUserSubscriptions(userId).sellActive;

  const activateSubscription = (userId: string, type: SubscriptionType) => {
    const current = getUserSubscriptions(userId);
    const updated: UserSubscriptions = {
      ...current,
      buyActive: type === 'buy' ? true : current.buyActive,
      sellActive: type === 'sell' ? true : current.sellActive,
      buySince: type === 'buy' ? new Date().toISOString() : current.buySince,
      sellSince: type === 'sell' ? new Date().toISOString() : current.sellSince,
    };
    const persisted = localStorage.getItem('subscriptions');
    const base = persisted ? JSON.parse(persisted) : store;
    const next = { ...base, [userId]: updated };
    save(next);
  };

  const refresh = () => {
    const persisted = localStorage.getItem('subscriptions');
    if (persisted) {
      try { setStore(JSON.parse(persisted)); } catch {}
    }
  };

  return (
    <SubscriptionContext.Provider value={{ getUserSubscriptions, hasBuySubscription, hasSellSubscription, activateSubscription, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
};


