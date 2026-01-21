import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GeometricBackground } from "@/components/ui/GeometricBackground";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ui/ListingCard";
import { mockProducts, mockTrips, mockDonations, mockGiveaways } from "@/data/mockData";
import { ShoppingBag, MapPin, Heart, Gift, ArrowRight, Users, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Buy and sell textbooks, electronics, and more within the NUST community.",
  },
  {
    icon: MapPin,
    title: "Trips & Events",
    description: "Organize and join exciting trips with fellow students. Book tickets hassle-free.",
  },
  {
    icon: Heart,
    title: "Donation Drives",
    description: "Support meaningful causes and make a difference together.",
  },
  {
    icon: Gift,
    title: "Giveaways",
    description: "Participate in exciting giveaways hosted by student societies.",
  },
];

const stats = [
  { value: "5000+", label: "Active Students" },
  { value: "2500+", label: "Listings" },
  { value: "150+", label: "Trips Organized" },
  { value: "Rs. 2M+", label: "Donations Raised" },
];

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center gradient-hero overflow-hidden">
        <GeometricBackground variant="hero" />
        
        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Your Campus,
              <br />
              <span className="text-accent">Your Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              NustMarkaz is the exclusive platform for NUST students to buy, sell, organize trips, run donation drives, and host giveaways.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Everything You Need</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              One platform for all your campus needs. Connect with fellow students and make the most of your university life.
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
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Latest Products</h2>
              <p className="section-subtitle">Fresh listings from your fellow students</p>
            </div>
            <Link to="/marketplace" className="hidden md:flex items-center gap-2 text-accent hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ListingCard key={product.id} {...product} />
            ))}
          </div>
          
          <Link to="/marketplace" className="md:hidden flex items-center justify-center gap-2 text-accent hover:underline mt-6">
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Upcoming Trips */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Upcoming Trips</h2>
              <p className="section-subtitle">Adventure awaits with your classmates</p>
            </div>
            <Link to="/trips" className="hidden md:flex items-center gap-2 text-accent hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrips.map((trip) => (
              <ListingCard key={trip.id} {...trip} />
            ))}
          </div>
          
          <Link to="/trips" className="md:hidden flex items-center justify-center gap-2 text-accent hover:underline mt-6">
            View all trips <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Donation Drives */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Active Donation Drives</h2>
              <p className="section-subtitle">Support causes that matter</p>
            </div>
            <Link to="/donations" className="hidden md:flex items-center gap-2 text-accent hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDonations.map((donation) => (
              <ListingCard key={donation.id} {...donation} />
            ))}
          </div>
        </div>
      </section>

      {/* Why NustMarkaz */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Why NustMarkaz?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Verified Students Only</h3>
                    <p className="text-sm text-muted-foreground">
                      All users are verified NUST students, ensuring a safe and trusted community.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Community Driven</h3>
                    <p className="text-sm text-muted-foreground">
                      Built by students, for students. Your feedback shapes the platform.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast & Easy</h3>
                    <p className="text-sm text-muted-foreground">
                      List items in seconds, connect instantly, and transact within campus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-accent/80 p-8 flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <div className="text-6xl font-bold mb-2">N</div>
                  <div className="text-xl font-semibold">NustMarkaz</div>
                  <div className="text-sm opacity-80 mt-2">For NUST, By NUST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-hero text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of NUST students already using NustMarkaz to connect, trade, and make memories.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
