
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Apartments from "./pages/Apartments";
import BookingPage from "./pages/BookingPage";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Amenities from "./pages/Amenities";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SignContract from "./pages/SignContract";
import Subscribe from "./pages/Subscribe";
import MyProperties from "./pages/MyProperties";
import ApartmentDetails from "./pages/ApartmentDetails";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PropertyProvider } from "./contexts/PropertyContext";
import { OrderProvider } from "./contexts/OrderContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ApartmentsProvider } from "./contexts/ApartmentsContext";
import { WishlistProvider } from "./contexts/WishlistContext";

// Create a react-query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PropertyProvider>
          <OrderProvider>
            <SubscriptionProvider>
            <WishlistProvider>
            <ApartmentsProvider>
              <LanguageProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/apartments" element={<Apartments />} />
                    <Route path="/apartments/:id" element={<ApartmentDetails />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/sign-contract/:id" element={<ProtectedRoute><SignContract /></ProtectedRoute>} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/amenities" element={<Amenities />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </LanguageProvider>
            </ApartmentsProvider>
            </WishlistProvider>
            </SubscriptionProvider>
          </OrderProvider>
        </PropertyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
