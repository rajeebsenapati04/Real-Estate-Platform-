import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/contexts/OrderContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function SignContract() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllOrders, updateOrder } = useOrder();
  const { getProperty } = useProperty();
  const { user } = useAuth();

  const order = getAllOrders().find(o => o.id === id);
  const property = order ? getProperty(order.propertyId) : null;

  const [govtId, setGovtId] = useState('');
  const [signerName, setSignerName] = useState(user?.name ?? '');
  const [animating, setAnimating] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!order || !property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Order not found.</p>
        </div>
      </div>
    );
  }

  const handleVerify = () => {
    if (!govtId.trim() || !signerName.trim()) return;
    updateOrder(order.id, { idVerified: true });
  };

  const handleSign = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setSigned(true);
      // Create a simple text "PDF" blob as placeholder for download
      const content = `Property Purchase Agreement\n\nBuyer: ${signerName}\nProperty: ${property.title}\nAmount: ₹${order.amount.toLocaleString()}\nOrder ID: ${order.id}\nDate: ${new Date().toLocaleString()}\n\nSignature: ${signerName}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      updateOrder(order.id, { contractSigned: true, contractUrl: url, signerName, status: 'confirmed' });
    }, 1500);
  };

  const canProceed = !!order.idVerified;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Verify ID & Sign Contract</h1>
            <p className="text-muted-foreground">Order #{order.id} • {property.title}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ID Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="govtId">Government ID Number</Label>
                <Input id="govtId" placeholder="Enter Aadhaar/PAN/Passport No." value={govtId} onChange={(e) => setGovtId(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="signer">Full Name (for signature)</Label>
                <Input id="signer" placeholder="Name as on ID" value={signerName} onChange={(e) => setSignerName(e.target.value)} />
              </div>
              <Button onClick={handleVerify} disabled={!govtId || !signerName}>Verify</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">After ID verification, click below to sign. Your signature will animate and be attached to the contract.</p>
              <div className="border rounded-lg p-6 h-24 flex items-center justify-center">
                <span className={animating ? 'animate-pulse text-2xl font-signature' : 'text-2xl font-signature'}>
                  {animating ? signerName.split('').map((c, i) => (<span key={i} style={{ animationDelay: `${i * 60}ms` }} className="inline-block animate-fade-in">{c}</span>)) : (signed ? signerName : 'Signature will appear here')}
                </span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSign} disabled={!canProceed || animating || signed}>
                  {signed ? 'Signed' : animating ? 'Signing…' : 'Click to Sign'}
                </Button>
                {order.contractUrl && (
                  <a className="btn-primary inline-flex items-center justify-center rounded-md px-4 py-2" href={order.contractUrl} download>
                    Download Contract
                  </a>
                )}
              </div>
              {signed && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Contract signed and saved. You can find it in your Profile &gt; Orders.</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/order-confirmation/${order.id}`)}>Finish</Button>
                    <Button onClick={() => navigate('/profile')}>Go to Profile</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}


