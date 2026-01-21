import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import ProductDetailPage from "./pages/marketplace/ProductDetailPage";
import CreateProductPage from "./pages/marketplace/CreateProductPage";
import TripsPage from "./pages/trips/TripsPage";
import TripDetailPage from "./pages/trips/TripDetailPage";
import CreateTripPage from "./pages/trips/CreateTripPage";
import DonationsPage from "./pages/donations/DonationsPage";
import DonationDetailPage from "./pages/donations/DonationDetailPage";
import CreateDonationPage from "./pages/donations/CreateDonationPage";
import GiveawaysPage from "./pages/giveaways/GiveawaysPage";
import GiveawayDetailPage from "./pages/giveaways/GiveawayDetailPage";
import CreateGiveawayPage from "./pages/giveaways/CreateGiveawayPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<ProductDetailPage />} />
          <Route path="/marketplace/create" element={<CreateProductPage />} />

          {/* Trips */}
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/create" element={<CreateTripPage />} />

          {/* Donations */}
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/donations/:id" element={<DonationDetailPage />} />
          <Route path="/donations/create" element={<CreateDonationPage />} />

          {/* Giveaways */}
          <Route path="/giveaways" element={<GiveawaysPage />} />
          <Route path="/giveaways/:id" element={<GiveawayDetailPage />} />
          <Route path="/giveaways/create" element={<CreateGiveawayPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
