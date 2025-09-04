import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createMoreApartments } from '@/data/apartments';

export interface Apartment {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  size: number;
  images: string[];
  location: string;
  features: string[];
}

interface ApartmentsContextType {
  apartments: Apartment[];
  getApartment: (id: string) => Apartment | undefined;
}

const ApartmentsContext = createContext<ApartmentsContextType | undefined>(undefined);

export const useApartments = () => {
  const ctx = useContext(ApartmentsContext);
  if (!ctx) throw new Error('useApartments must be used within ApartmentsProvider');
  return ctx;
};

const images = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1000&h=750&fit=crop'
];

function generateApartments(n: number): Apartment[] {
  const list: Apartment[] = [];
  for (let i = 1; i <= n; i++) {
    list.push({
      id: String(i),
      name: `Apartment ${i}`,
      description: 'Comfortable, well-appointed apartment ideal for short stays with modern amenities.',
      pricePerNight: 120 + (i % 10) * 10,
      capacity: (i % 4) + 1,
      size: 25 + (i % 8) * 10,
      images: [images[i % images.length], images[(i + 1) % images.length]],
      location: i % 2 === 0 ? 'Beachfront' : 'City Center',
      features: ['Wi-Fi', 'Air Conditioning', 'TV', 'Kitchen', 'Bathroom']
    });
  }
  return list;
}

interface ProviderProps { children: ReactNode }

export const ApartmentsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('apartments');
    if (saved) {
      setApartments(JSON.parse(saved));
    } else {
      const base = generateApartments(20);
      const extra = createMoreApartments(100, 30);
      const gen = [...base, ...extra];
      setApartments(gen);
      localStorage.setItem('apartments', JSON.stringify(gen));
    }
  }, []);

  const getApartment = (id: string) => apartments.find(a => a.id === id);

  return (
    <ApartmentsContext.Provider value={{ apartments, getApartment }}>
      {children}
    </ApartmentsContext.Provider>
  );
};


