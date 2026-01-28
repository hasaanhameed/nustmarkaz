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
import { getCurrentUser, User } from "@/api/user"

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch initial data here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
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
    </Layout>
  );
}