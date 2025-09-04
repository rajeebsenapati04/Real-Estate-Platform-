import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Order {
  id: string;
  userId: string;
  propertyId: string;
  type: 'buy' | 'rent';
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  createdAt: string;
  completedAt?: string;
  idVerified?: boolean;
  contractSigned?: boolean;
  contractUrl?: string;
  signerName?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveToStorage = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedOrders = [...orders, newOrder];
    saveToStorage(updatedOrders);
    return newOrder.id;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, ...updates } : order
    );
    saveToStorage(updatedOrders);
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrder,
      getUserOrders,
      getAllOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
};