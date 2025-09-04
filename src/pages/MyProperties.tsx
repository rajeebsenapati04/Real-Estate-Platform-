import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty, Property } from '@/contexts/PropertyContext';
import { useOrder } from '@/contexts/OrderContext';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export default function MyProperties() {
  const { user } = useAuth();
  const { addProperty, getUserProperties, getProperty, updateProperty } = useProperty();
  const { getUserOrders } = useOrder();
  const { hasSellSubscription } = useSubscription();
  const navigate = useNavigate();
  const myProps = user ? getUserProperties(user.id) : [];
  const ownedProps: Property[] = user
    ? getUserOrders(user.id)
        .filter(o => o.type === 'buy' && o.status === 'confirmed')
        .map(o => getProperty(o.propertyId))
        .filter(Boolean) as Property[]
    : [];

  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'apartment' as Property['category'],
    state: '',
    city: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: ''
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!hasSellSubscription(user.id)) {
      navigate('/subscribe', { state: { next: '/my-properties' } });
      return;
    }
    const images = form.images.split(',').map(s => s.trim()).filter(Boolean);
    addProperty({
      title: form.title,
      price: parseInt(form.price, 10),
      type: 'buy',
      category: form.category,
      location: {
        state: form.state,
        city: form.city,
        address: form.address,
        coordinates: { lat: 0, lng: 0 }
      },
      details: {
        bedrooms: parseInt(form.bedrooms, 10),
        bathrooms: parseInt(form.bathrooms, 10),
        area: parseInt(form.area, 10)
      },
      images: images.length ? images : [
        'https://images.unsplash.com/photo-1600585154161-8c14b9a9a2f2?w=800&h=600&fit=crop'
      ],
      description: 'User listed property',
      features: ['Balcony', 'Parking', 'Security'],
      sellerId: user.id,
      sellerContact: { name: user.name, email: user.email, phone: '+91-00000-00000' },
      status: 'available'
    });
    setForm({ title: '', price: '', category: 'apartment', state: '', city: '', address: '', bedrooms: '', bathrooms: '', area: '', images: '' });
  };

  const listOwnedForSale = (prop: Property) => {
    if (!user) return;
    if (!hasSellSubscription(user.id)) {
      navigate('/subscribe', { state: { next: '/my-properties' } });
      return;
    }
    const priceStr = window.prompt('Enter listing price (₹):', String(prop.price));
    if (!priceStr) return;
    const price = parseInt(priceStr, 10);
    if (Number.isNaN(price) || price <= 0) return;
    updateProperty(prop.id, {
      price,
      type: 'buy',
      sellerId: user.id,
      sellerContact: { name: user.name, email: user.email, phone: '+91-00000-00000' },
      status: 'available'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">Add new listings and manage your properties for sale.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Property['category'] })} />
              </div>
              <div>
                <Label>Bedrooms</Label>
                <Input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
              </div>
              <div>
                <Label>Area (sq ft)</Label>
                <Input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
              </div>
              <div>
                <Label>State</Label>
                <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Images (comma-separated URLs)</Label>
                <Textarea value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">Add Property</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listed by Me ({myProps.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProps.map(p => (
              <div key={p.id} className="border rounded-lg p-4">
                <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded mb-3" />
                <div className="font-semibold">{p.title}</div>
                <div className="text-primary font-bold">₹{p.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{p.location.city}, {p.location.state}</div>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="outline" size="sm"><Link to={`/property/${p.id}`}>View Details</Link></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Owned Properties ({ownedProps.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedProps.map(p => (
              <div key={p.id} className="border rounded-lg p-4">
                <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded mb-3" />
                <div className="font-semibold">{p.title}</div>
                <div className="text-primary font-bold">₹{p.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{p.location.city}, {p.location.state}</div>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="outline" size="sm"><Link to={`/property/${p.id}`}>View Details</Link></Button>
                  <Button size="sm" onClick={() => listOwnedForSale(p)}>List for Sale</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}


