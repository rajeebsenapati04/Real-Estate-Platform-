import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApartments } from '@/contexts/ApartmentsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>();
  const { getApartment } = useApartments();
  const navigate = useNavigate();
  const apt = id ? getApartment(id) : undefined;

  if (!apt) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Apartment Not Found</h1>
            <Button onClick={() => navigate('/apartments')}>Browse Apartments</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-4">
            <img src={apt.images[0]} alt={apt.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4">
              <Badge>For Rent</Badge>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {apt.images.map((img, i) => (
              <img key={i} src={img} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{apt.name}</h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{apt.location}</span>
              </div>
              <div className="text-3xl font-bold text-primary">₹{apt.pricePerNight}/night</div>
            </div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Apartment Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{apt.capacity}</div>
                      <div className="text-sm text-muted-foreground">Guests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <div>
                      <div className="font-medium">1</div>
                      <div className="text-sm text-muted-foreground">Bathroom</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{apt.size} m²</div>
                      <div className="text-sm text-muted-foreground">Area</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">{apt.description}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button className="w-full" size="lg" onClick={() => navigate('/booking')}>
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


