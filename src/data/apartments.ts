import { Apartment } from '@/contexts/ApartmentsContext';

const imgs = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&h=750&fit=crop',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1000&h=750&fit=crop'
];

export function createMoreApartments(startId: number, count = 30): Apartment[] {
  const list: Apartment[] = [];
  for (let i = 0; i < count; i++) {
    const id = String(startId + i);
    list.push({
      id,
      name: `Premium Stay ${id}`,
      description: 'Modern rental apartment with essential amenities and easy access to attractions.',
      pricePerNight: 140 + (i % 12) * 10,
      capacity: (i % 4) + 1,
      size: 30 + (i % 6) * 10,
      images: [imgs[i % imgs.length], imgs[(i + 1) % imgs.length]],
      location: i % 2 ? 'Beachfront' : 'City Center',
      features: ['Wi-Fi', 'Air Conditioning', 'TV', 'Kitchen', 'Bathroom']
    });
  }
  return list;
}


