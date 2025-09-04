import { Property } from '@/contexts/PropertyContext';

const moreImages = [
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c55f?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1600585154161-8c14b9a9a2f2?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1000&h=750&fit=crop',
];

export function createMoreProperties(startId: number, count = 30): Property[] {
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat'];
  const cities = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Ahmedabad'];
  const categories: Array<Property['category']> = ['apartment', 'house', 'villa', 'condo'];
  const result: Property[] = [];
  for (let i = 0; i < count; i++) {
    const id = String(startId + i);
    const city = cities[i % cities.length];
    const state = states[i % states.length];
    const category = categories[i % categories.length];
    const price = 5000000 + (i % 15) * 175000;
    result.push({
      id,
      title: `${city} ${category} ${id}`,
      price,
      type: 'buy',
      category,
      location: {
        state,
        city,
        address: `${100 + i} ${city} Main Road, ${state}`,
        coordinates: { lat: 0, lng: 0 }
      },
      details: {
        bedrooms: (i % 4) + 1,
        bathrooms: Math.max(1, (i % 3)),
        area: 700 + (i % 10) * 120,
        plotNumber: `PX-${100 + i}`
      },
      images: [moreImages[i % moreImages.length], moreImages[(i + 1) % moreImages.length]],
      description: `Premium ${category} in ${city} with excellent connectivity and modern amenities.`,
      features: ['Security', 'Parking', 'Lift', 'Power Backup'],
      sellerId: 'global-market',
      sellerContact: { name: 'Marketplace', email: 'market@example.com', phone: '+91-90000-00000' },
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return result;
}


