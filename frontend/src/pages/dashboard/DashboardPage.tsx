import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ListingCard } from "@/components/ui/ListingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { getAllProducts, type Product } from "@/api/product";
import { getAllTrips, type Trip } from "@/api/trip";
import { getAllDonations, type Donation } from "@/api/donation";
import { getAllEvents, type Event } from "@/api/event";
import { getAllRides, type Ride } from "@/api/ride";
import { getAllLostFoundItems, type LostFoundItem } from "@/api/lostFound";

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  type: "product" | "trip" | "donation" | "event" | "ride" | "lostFound";
  createdAt?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          productsData,
          tripsData,
          donationsData,
          eventsData,
          ridesData,
          lostFoundData,
        ] = await Promise.all([
          getAllProducts(0, 10),
          getAllTrips(0, 10),
          getAllDonations(0, 10),
          getAllEvents(),
          getAllRides(0, 10),
          getAllLostFoundItems(),
        ]);

         setProducts(productsData.filter(p => p?.creator));
setTrips(tripsData.filter(t => t?.creator));
setDonations(donationsData.filter(d => d?.creator));
setEvents(eventsData.filter(e => e?.creator));
setRides(ridesData.filter(r => r?.driver_id));
setLostFoundItems(lostFoundData.filter(lf => lf?.creator));;
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, []);




  const getActivityItems = (): ActivityItem[] => {
    const items: ActivityItem[] = [
      ...products.slice(0, 2).map((p) => ({ ...p, type: "product" as const })),
      ...trips.slice(0, 2).map((t) => ({ ...t, type: "trip" as const })),
      ...donations
        .slice(0, 1)
        .map((d) => ({ ...d, type: "donation" as const })),
      ...events.slice(0, 1).map((e) => ({ ...e, type: "event" as const })),
    ];
    return items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  };

  if (error) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <Link to="/marketplace/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-accent transition-colors">
                Sell Product
              </p>
              <p className="text-xs text-muted-foreground">List an item</p>
            </div>
          </Link>

          <Link to="/trips/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-success transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-success transition-colors">
                Organize Trip
              </p>
              <p className="text-xs text-muted-foreground">Plan adventure</p>
            </div>
          </Link>

          <Link to="/carpooling">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-sky transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-sky transition-colors">
                Post Carpool
              </p>
              <p className="text-xs text-muted-foreground">Share a ride</p>
            </div>
          </Link>

          <Link to="/donations/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-warning transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-warning transition-colors">
                Start Drive
              </p>
              <p className="text-xs text-muted-foreground">Support cause</p>
            </div>
          </Link>

          <Link to="/giveaways/create">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                Post Event
              </p>
              <p className="text-xs text-muted-foreground">Organize event</p>
            </div>
          </Link>

          <Link to="/lost-found">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-purple transition-colors group cursor-pointer h-full">
              <p className="font-medium text-sm group-hover:text-purple transition-colors">
                Post Lost/Found
              </p>
              <p className="text-xs text-muted-foreground">Report item</p>
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
                <TabsTrigger value="rides">Rides</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="lostfound">Lost & Found</TabsTrigger>
              </TabsList>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading activity...</p>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {getActivityItems().length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No activity yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {getActivityItems().map((item) => (
                        <ListingCard
                          key={`${item.type}-${item.id}`}
                          {...(item as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="products">
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No products yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <ListingCard
                          key={product.id}
                          {...(product as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trips">
                  {trips.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No trips yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trips.map((trip) => (
                        <ListingCard
                          key={trip.id}
                          {...(trip as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rides">
                  {rides.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No rides yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rides.map((ride) => (
                        <ListingCard
                          key={ride.id}
                          {...(ride as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="donations">
                  {donations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No donations yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {donations.map((donation) => (
                        <ListingCard
                          key={donation.id}
                          {...(donation as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="events">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No events yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((event) => (
                        <ListingCard
                          key={event.id}
                          {...(event as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lostfound">
                  {lostFoundItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No lost & found items yet
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lostFoundItems.map((item) => (
                        <ListingCard
                          key={item.id}
                          {...(item as unknown as any)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
