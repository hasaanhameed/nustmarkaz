import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ui/ListingCard";
import {
  mockProducts,
  mockTrips,
  mockDonations,
  mockGiveaways,
} from "@/data/mockData";
import { ArrowRight, ShoppingBag, MapPin, Heart, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const allListings = [
    ...mockProducts.slice(0, 2),
    ...mockTrips.slice(0, 2),
    ...mockDonations.slice(0, 1),
    ...mockGiveaways.slice(0, 1),
  ];

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening on campus.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/marketplace/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors group">
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
              <p className="font-medium group-hover:text-success transition-colors">
                Organize Trip
              </p>
              <p className="text-sm text-muted-foreground">Plan an adventure</p>
            </div>
          </Link>
          <Link to="/donations/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-warning transition-colors group">
              <p className="font-medium group-hover:text-warning transition-colors">
                Start Drive
              </p>
              <p className="text-sm text-muted-foreground">Support a cause</p>
            </div>
          </Link>
          <Link to="/giveaways/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group">
              <p className="font-medium group-hover:text-primary transition-colors">
                 Upcoming Events
              </p>
              <p className="text-sm text-muted-foreground">
                Check out Campus Events
              </p>
            </div>
          </Link>
        </div>

        {/* Feed */}
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
                {mockProducts.map((product) => (
                  <ListingCard key={product.id} {...product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trips">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTrips.map((trip) => (
                  <ListingCard key={trip.id} {...trip} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="donations">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDonations.map((donation) => (
                  <ListingCard key={donation.id} {...donation} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Explore Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/marketplace"
            className="flex items-center justify-between p-4 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors group"
          >
            <span className="font-medium">Explore Marketplace</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/trips"
            className="flex items-center justify-between p-4 rounded-xl bg-success/10 hover:bg-success/20 transition-colors group"
          >
            <span className="font-medium">Browse Trips</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/donations"
            className="flex items-center justify-between p-4 rounded-xl bg-warning/10 hover:bg-warning/20 transition-colors group"
          >
            <span className="font-medium">View Donations</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/giveaways"
            className="flex items-center justify-between p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group"
          >
            <span className="font-medium">See Giveaways</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
