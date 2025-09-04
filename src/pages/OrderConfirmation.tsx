import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/contexts/OrderContext';
import { useProperty } from '@/contexts/PropertyContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, MapPin, Calendar, Phone, Mail } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrder();
  const { getProperty } = useProperty();
  const navigate = useNavigate();
  
  const order = orders.find(o => o.id === id);
  const property = order ? getProperty(order.propertyId) : null;

  if (!order || !property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Your {order.type === 'buy' ? 'purchase' : 'booking'} has been successfully confirmed.</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location.city}, {property.location.state}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${order.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button onClick={() => navigate('/profile')} className="w-full">
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => navigate('/properties')} className="w-full">
              Browse More Properties
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}