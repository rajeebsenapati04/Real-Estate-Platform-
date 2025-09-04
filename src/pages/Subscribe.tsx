import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Subscribe() {
  const { user } = useAuth();
  const { activateSubscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<'buy' | 'sell' | null>(null);
  const [success, setSuccess] = useState<'buy' | 'sell' | null>(null);

  const handleSubscribe = (type: 'buy' | 'sell') => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setLoading(type);
    setTimeout(() => {
      activateSubscription(user.id, type);
      setLoading(null);
      setSuccess(type);
      const next = (location.state as any)?.next ?? '/profile';
      navigate(next);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Unlock Marketplace Access</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Subscribe to Buy or Sell Properties</h1>
          <p className="text-muted-foreground">Get instant access to verified listings, secure checkout, and seamless ownership transfer. No hidden charges.</p>
        </div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Buyer Plan</CardTitle>
                <Badge variant="default">₹599</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Purchase any property in the marketplace</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Access to buy-only listings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Secure payment and escrow-like flow</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> ID verification & e‑contract with PDF download</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Purchase history & documents in Profile</li>
              </ul>
              <Separator />
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Transactions protected with SSL</span>
              </div>
              <Button className="w-full" size="lg" disabled>
                Buy access is no longer required
              </Button>
              {success === 'buy' && (<p className="text-green-600 text-sm">Buyer subscription activated.</p>)}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Seller Plan</CardTitle>
                <Badge variant="default">₹699</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">List properties for sale to a global audience</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Create unlimited listings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Showcase with photos, features, and pricing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant buyer eligibility checks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Track offers and sales in Profile</li>
              </ul>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Admin receives platform fees; you keep sale proceeds at your set price.
              </div>
              <Button className="w-full" size="lg" disabled>
                Selling access is free now
              </Button>
              {success === 'sell' && (<p className="text-green-600 text-sm">Seller subscription activated.</p>)}
            </CardContent>
          </Card>
        </div>

        {/* Why Subscribe */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-6 rounded-lg bg-card">
            <div className="text-xl font-semibold mb-2">Verified Listings</div>
            <p className="text-sm text-muted-foreground">Curated properties with consistent data and quality imagery.</p>
          </div>
          <div className="p-6 rounded-lg bg-card">
            <div className="text-xl font-semibold mb-2">Digital Contracts</div>
            <p className="text-sm text-muted-foreground">Sign securely and download PDFs for your records.</p>
          </div>
          <div className="p-6 rounded-lg bg-card">
            <div className="text-xl font-semibold mb-2">Profile Records</div>
            <p className="text-sm text-muted-foreground">Access purchases, contracts, and invoices anytime.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


