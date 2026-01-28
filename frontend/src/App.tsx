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
import GiveawaysPage from "./pages/events/EventsPage";
import GiveawayDetailPage from "./pages/events/EventsDetailPage";
import CreateGiveawayPage from "./pages/events/CreateEventsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LostFoundPage from "./pages/lost-found/LostFoundPage";
import CarpoolPage from "./pages/carpool/CarpoolPage";
import RideDetailPage from "./pages/carpool/RideDetailPage";
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

          {/* Marketplace - specific routes before dynamic ones */}
          <Route path="/marketplace/create" element={<CreateProductPage />} />
          <Route path="/marketplace/:id" element={<ProductDetailPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />

          {/* Trips - specific routes before dynamic ones */}
          <Route path="/trips/create" element={<CreateTripPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips" element={<TripsPage />} />

          {/* Donations - specific routes before dynamic ones */}
          <Route path="/donations/create" element={<CreateDonationPage />} />
          <Route path="/donations/:id" element={<DonationDetailPage />} />
          <Route path="/donations" element={<DonationsPage />} />

          {/* Giveaways - specific routes before dynamic ones */}
          <Route path="/giveaways/create" element={<CreateGiveawayPage />} />
          <Route path="/giveaways/:id" element={<GiveawayDetailPage />} />
          <Route path="/giveaways" element={<GiveawaysPage />} />

          {/* Carpooling - specific routes before dynamic ones */}
          <Route path="/carpooling/ride/:id" element={<RideDetailPage />} />
          <Route path="/carpooling" element={<CarpoolPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Lost & Found */}
          <Route path="/lost-found" element={<LostFoundPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;