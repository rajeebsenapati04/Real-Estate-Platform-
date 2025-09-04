import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// ✅ explicitly point to .js so TS/Vite picks the right file
import { EXTRA_PROPERTIES } from '@/data/properties.js';

export interface Property {
  id: string;
  title: string;
  price: number;
  type: 'buy' | 'rent';
  category: 'apartment' | 'house' | 'villa' | 'condo';
  location: {
    state: string;
    city: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    plotSize?: { length: number; breadth: number };
    plotNumber?: string;
    distanceFromHighway?: number;
  };
  images: string[];
  description: string;
  features: string[];
  sellerId: string;
  sellerContact: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'available' | 'sold' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  type?: 'buy' | 'rent';
  category?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  getUserProperties: (userId: string) => Property[];
  searchProperties: (filters: PropertyFilters) => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperty must be used within a PropertyProvider');
  return context;
};

// ----------------------
// Base properties
// ----------------------
const baseProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 850000,
    type: 'buy',
    category: 'apartment',
    location: {
      state: 'California',
      city: 'San Francisco',
      address: '123 Market Street, San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      plotNumber: 'A-101',
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    description: 'Beautiful modern apartment in the heart of downtown San Francisco with stunning city views.',
    features: ['City View', 'Modern Kitchen', 'Hardwood Floors', 'In-unit Laundry', 'Gym Access'],
    sellerId: 'seller1',
    sellerContact: { name: 'John Smith', email: 'john.smith@email.com', phone: '+1-555-0123' },
    status: 'available',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Spacious Family House',
    price: 6500000,
    type: 'buy',
    category: 'house',
    location: {
      state: 'Texas',
      city: 'Austin',
      address: '456 Oak Avenue, Austin, TX',
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      plotSize: { length: 100, breadth: 80 },
      distanceFromHighway: 5,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
    ],
    description: 'Perfect family home with large backyard and great neighborhood amenities.',
    features: ['Large Backyard', 'Two-Car Garage', 'Updated Kitchen', 'Master Suite', 'Near Schools'],
    sellerId: 'seller2',
    sellerContact: { name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '+1-555-0456' },
    status: 'available',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
];

// ----------------------
// Generator for sample props
// ----------------------
function generateSampleProperties(total: number): Property[] {
  const cities = [
    { state: 'Maharashtra', city: 'Mumbai' },
    { state: 'Delhi', city: 'New Delhi' },
    { state: 'Karnataka', city: 'Bengaluru' },
    { state: 'Tamil Nadu', city: 'Chennai' },
    { state: 'Telangana', city: 'Hyderabad' },
    { state: 'West Bengal', city: 'Kolkata' },
    { state: 'Gujarat', city: 'Ahmedabad' },
    { state: 'Rajasthan', city: 'Jaipur' },
    { state: 'Punjab', city: 'Chandigarh' },
    { state: 'Madhya Pradesh', city: 'Indore' },
  ];
  const categories: Array<Property['category']> = ['apartment', 'house', 'villa', 'condo'];
  const imagePool = [
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c55f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154161-8c14b9a9a2f2?w=800&h=600&fit=crop',
  ];

  const list: Property[] = [];
  for (let i = 0; i < total; i++) {
    const city = cities[i % cities.length];
    const category = categories[i % categories.length];
    const bedrooms = (i % 4) + 1;
    const bathrooms = Math.max(1, (i % 3));
    const area = 600 + (i % 10) * 150;
    const price = 4500000 + (i % 12) * 250000;
    const id = (i + 3).toString();

    list.push({
      id,
      title: `${city.city} ${category.charAt(0).toUpperCase() + category.slice(1)} ${i + 1}`,
      price,
      type: 'buy',
      category,
      location: {
        state: city.state,
        city: city.city,
        address: `${100 + i} Main Road, ${city.city}, ${city.state}`,
        coordinates: { lat: 0, lng: 0 },
      },
      details: { bedrooms, bathrooms, area, plotNumber: `P-${i + 100}` },
      images: [imagePool[i % imagePool.length], imagePool[(i + 1) % imagePool.length]],
      description: `Spacious ${category} in ${city.city}, ideal for buyers seeking comfort and convenience.`,
      features: ['Balcony', 'Security', 'Parking', 'Lift', 'Power Backup'],
      sellerId: 'seller-seed',
      sellerContact: { name: 'Agent Desk', email: 'agent@example.com', phone: '+91-90000-00000' },
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return list;
}

// ----------------------
// Provider
// ----------------------
export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    } else {
      const generated = [...baseProperties, ...generateSampleProperties(20), ...EXTRA_PROPERTIES];
      setProperties(generated);
      localStorage.setItem('properties', JSON.stringify(generated));
    }
  }, []);

  const saveToStorage = (updated: Property[]) => {
    setProperties(updated);
    localStorage.setItem('properties', JSON.stringify(updated));
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage([...properties, newProperty]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    saveToStorage(
      properties.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  const deleteProperty = (id: string) => {
    saveToStorage(properties.filter(p => p.id !== id));
  };

  const getProperty = (id: string) => properties.find(p => p.id === id);

  const getUserProperties = (userId: string) => properties.filter(p => p.sellerId === userId);

  const searchProperties = (filters: PropertyFilters) =>
    properties.filter(p => {
      if (filters.type && p.type !== filters.type) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.state && !p.location.state.toLowerCase().includes(filters.state.toLowerCase()))
        return false;
      if (filters.city && !p.location.city.toLowerCase().includes(filters.city.toLowerCase()))
        return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.minBedrooms && p.details.bedrooms < filters.minBedrooms) return false;
      if (filters.maxBedrooms && p.details.bedrooms > filters.maxBedrooms) return false;
      if (filters.minArea && p.details.area < filters.minArea) return false;
      if (filters.maxArea && p.details.area > filters.maxArea) return false;
      return true;
    });

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getProperty,
        getUserProperties,
        searchProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
