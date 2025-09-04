import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Calendar,
  Car,
  Shield,
  Wifi,
  Zap,
  TreePine,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { getProperty } = useProperty();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const property = id ? getProperty(id) : null;
  
  if (!property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
      toast({
        title: "Removed from Wishlist",
        description: "Property removed from your favorites",
      });
    } else {
      addToWishlist(property.id);
      toast({
        title: "Added to Wishlist",
        description: "Property added to your favorites",
      });
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    navigate(`/checkout/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleWishlistToggle}
                className={isInWishlist(property.id) ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(property.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant={property.type === 'buy' ? 'default' : 'secondary'}>
                {property.type === 'buy' ? 'For Sale' : 'For Rent'}
              </Badge>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location.address}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-4">
                ₹{property.price.toLocaleString()}
                {property.type === 'rent' && <span className="text-lg font-normal">/month</span>}
              </div>
            </div>

            {/* Property Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.details.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.details.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.details.area}</div>
                      <div className="text-sm text-muted-foreground">Sq Ft</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.category}</div>
                      <div className="text-sm text-muted-foreground">Type</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{property.sellerContact.name}</div>
                    <div className="text-sm text-muted-foreground">Property Agent</div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{property.sellerContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{property.sellerContact.email}</span>
                    </div>
                  </div>
                  <Separator />
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookNow}
                  >
                    {property.type === 'buy' ? 'Buy Now' : 'Book Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            {(property.details.plotSize || property.details.distanceFromHighway || property.details.plotNumber) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Info</h3>
                  <div className="space-y-3">
                    {property.details.plotSize && (
                      <div>
                        <div className="text-sm text-muted-foreground">Plot Size</div>
                        <div className="font-medium">
                          {property.details.plotSize.length} × {property.details.plotSize.breadth} ft
                        </div>
                      </div>
                    )}
                    {property.details.plotNumber && (
                      <div>
                        <div className="text-sm text-muted-foreground">Plot Number</div>
                        <div className="font-medium">{property.details.plotNumber}</div>
                      </div>
                    )}
                    {property.details.distanceFromHighway && (
                      <div>
                        <div className="text-sm text-muted-foreground">Distance from Highway</div>
                        <div className="font-medium">{property.details.distanceFromHighway} km</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}