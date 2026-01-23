import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GeometricBackground } from "@/components/ui/GeometricBackground";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ui/ListingCard";
import {
  mockProducts,
  mockTrips,
  mockDonations,
  mockGiveaways,
} from "@/data/mockData";
import {
  ShoppingBag,
  MapPin,
  Heart,
  Gift,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser, User } from "@/api/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const features = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy and sell textbooks, electronics, and more within the NUST community.",
  },
  {
    icon: MapPin,
    title: "Trips & Events",
    description:
      "Organize and join exciting trips with fellow students. Book tickets hassle-free.",
  },
  {
    icon: Heart,
    title: "Donation Drives",
    description: "Support meaningful causes and make a difference together.",
  },
  {
    icon: Gift,
    title: "Giveaways",
    description:
      "Participate in exciting giveaways hosted by student societies.",
  },
];

export default function LandingPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }

  if (currentUser) {
    const allListings = [
      ...mockProducts.slice(0, 2),
      ...mockTrips.slice(0, 2),
      ...mockDonations.slice(0, 1),
      ...mockGiveaways.slice(0, 1),
    ];

    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.username}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening on campus.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/marketplace/create">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors group">
                <ShoppingBag className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium group-hover:text-accent transition-colors">
                  Sell Product
                </p>
                <p className="text-sm text-muted-foreground">
                  List something to sell
                </p>
              </div>
            </Link>
            <Link to="/trips/create">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-success transition-colors group">
                <MapPin className="h-6 w-6 text-success mb-2" />
                <p className="font-medium group-hover:text-success transition-colors">
                  Organize Trip
                </p>
                <p className="text-sm text-muted-foreground">Plan an adventure</p>
              </div>
            </Link>
            <Link to="/donations/create">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-warning transition-colors group">
                <Heart className="h-6 w-6 text-warning mb-2" />
                <p className="font-medium group-hover:text-warning transition-colors">
                  Start Drive
                </p>
                <p className="text-sm text-muted-foreground">Support a cause</p>
              </div>
            </Link>
            <Link to="/giveaways/create">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group">
                <Gift className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium group-hover:text-primary transition-colors">
                  Host Giveaway
                </p>
                <p className="text-sm text-muted-foreground">
                  Give back to community
                </p>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Latest Activity</h2>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="donations">Donations</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allListings.map((item) => (
                    <ListingCard key={item.id} {...item} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockProducts.slice(0, 8).map((product) => (
                    <ListingCard key={product.id} {...product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trips">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockTrips.slice(0, 8).map((trip) => (
                    <ListingCard key={trip.id} {...trip} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="donations">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockDonations.slice(0, 8).map((donation) => (
                    <ListingCard key={donation.id} {...donation} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/marketplace" className="group">
              <div className="p-6 rounded-xl border border-border bg-card hover:border-accent transition-all hover:shadow-lg">
                <ShoppingBag className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  Marketplace
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse {mockProducts.length}+ products
                </p>
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  View all <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link to="/trips" className="group">
              <div className="p-6 rounded-xl border border-border bg-card hover:border-success transition-all hover:shadow-lg">
                <MapPin className="h-8 w-8 text-success mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-success transition-colors">
                  Trips
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mockTrips.length}+ upcoming trips
                </p>
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  View all <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link to="/donations" className="group">
              <div className="p-6 rounded-xl border border-border bg-card hover:border-warning transition-all hover:shadow-lg">
                <Heart className="h-8 w-8 text-warning mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-warning transition-colors">
                  Donations
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mockDonations.length} active drives
                </p>
                <div className="flex items-center gap-2 text-warning text-sm font-medium">
                  View all <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link to="/giveaways" className="group">
              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary transition-all hover:shadow-lg">
                <Gift className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Giveaways
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mockGiveaways.length} active giveaways
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  View all <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative min-h-[85vh] flex items-center gradient-hero overflow-hidden">
        <GeometricBackground variant="hero" />

        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Your Campus,
              <br />
              <span className="text-accent">Your Marketplace</span>
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              NustMarkaz is the exclusive platform for NUST students to buy,
              sell, organize trips, run donation drives, and host giveaways.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Everything You Need</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              One platform for all your campus needs. Connect with fellow
              students and make the most of your university life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Latest Products</h2>
              <p className="section-subtitle">
                Fresh listings from your fellow students
              </p>
            </div>
            <Link
              to="/marketplace"
              className="hidden md:flex items-center gap-2 text-accent hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ListingCard key={product.id} {...product} />
            ))}
          </div>

          <Link
            to="/marketplace"
            className="md:hidden flex items-center justify-center gap-2 text-accent hover:underline mt-8"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Upcoming Trips</h2>
              <p className="section-subtitle">
                Join exciting adventures with fellow students
              </p>
            </div>
            <Link
              to="/trips"
              className="hidden md:flex items-center gap-2 text-accent hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTrips.map((trip) => (
              <ListingCard key={trip.id} {...trip} />
            ))}
          </div>

          <Link
            to="/trips"
            className="md:hidden flex items-center justify-center gap-2 text-accent hover:underline mt-8"
          >
            View all trips <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-24 gradient-hero relative overflow-hidden">
        <GeometricBackground variant="hero" />
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join NustMarkaz today and become part of the most vibrant student
            community at NUST.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}