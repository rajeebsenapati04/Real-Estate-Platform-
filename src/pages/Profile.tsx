import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProperty } from '@/contexts/PropertyContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Settings, 
  MapPin, 
  Calendar,
  DollarSign,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrder();
  const { wishlist } = useWishlist();
  const { getProperty } = useProperty();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const userOrders = getUserOrders(user.id);
  const wishlistProperties = wishlist.map(id => getProperty(id)).filter(Boolean);

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your activity</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="text-lg">{user.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-lg">{user.email}</p>
                      </div>
                      <div>
                        <Label>Account Type</Label>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'} className="ml-0">
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                        </Badge>
                      </div>
                      <div>
                        <Label>Member Since</Label>
                        <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Order History ({userOrders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No orders yet</p>
                      <Button onClick={() => navigate('/properties')}>
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => {
                        const property = getProperty(order.propertyId);
                        return (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  order.status === 'confirmed' ? 'default' :
                                  order.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            {property && (
                              <div className="flex items-center gap-3">
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{property.title}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{property.location.city}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{order.amount.toLocaleString()}</p>
                                  <p className="text-sm text-muted-foreground">{order.type}</p>
                                  {order.contractSigned ? (
                                    <a className="text-primary text-sm underline" href={order.contractUrl} download>
                                      Download Contract
                                    </a>
                                  ) : (
                                    <>
                                      {order.status === 'pending' && (
                                        <Button size="sm" onClick={() => navigate(`/sign-contract/${order.id}`)}>
                                          Verify & Sign
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    My Wishlist ({wishlistProperties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                      <Button onClick={() => navigate('/properties')}>
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistProperties.map((property) => (
                        <div
                          key={property.id}
                          className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{property.title}</p>
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{property.location.city}</span>
                              </div>
                              <p className="font-semibold text-primary">
                                ₹{property.price.toLocaleString()}
                                {property.type === 'rent' && '/mo'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Account Actions</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleLogout}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Account Information</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Account ID: {user.id}</p>
                      <p>Role: {user.role ?? 'user'}</p>
                      <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}