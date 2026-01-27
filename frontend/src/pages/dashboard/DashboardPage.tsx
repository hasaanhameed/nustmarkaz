import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  recordInteraction,
  getRecentActivityItems,
  type ActivityItem,
} from "@/api/interaction";

interface DashboardActivityItem {
  id: number;
  title: string;
  description?: string;
  type: "product" | "trip" | "donation" | "event" | "ride" | "lost_found";
  createdAt?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
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

        setProducts(productsData);
        setTrips(tripsData);
        setDonations(donationsData);
        setEvents(eventsData);
        setRides(ridesData);
        setLostFoundItems(lostFoundData);

        // Fetch recent activity
        await fetchRecentActivity();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch recent activity items
  const fetchRecentActivity = async () => {
    try {
      const activityData = await getRecentActivityItems(10);
      setRecentActivity(activityData);
    } catch (err) {
      console.error("Failed to fetch recent activity:", err);
    }
  };

  // Handle item click - record interaction and add to activity
  const handleItemClick = async (
    itemId: number,
    itemType: string,
    item: any
  ) => {
    try {
      // Record the interaction with backend
      await recordInteraction(itemId, itemType);

      // Update local recent activity - add to top of list
      const newActivityItem: ActivityItem = {
        id: itemId,
        type: itemType as any,
        title: item.title,
        ...item,
        creator: item.creator || { username: "Unknown" },
      };

      setRecentActivity((prev) => {
        // Remove duplicates and add new item to top
        const filtered = prev.filter(
          (a) => !(a.id === itemId && a.type === itemType)
        );
        return [newActivityItem, ...filtered].slice(0, 10);
      });
    } catch (err) {
      console.error("Failed to record interaction:", err);
    }
  };

  const getActivityItems = (): DashboardActivityItem[] => {
    const items: DashboardActivityItem[] = [
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

  // Wrap ListingCard to intercept clicks
  const InteractiveListingCard = ({ item, ...props }: any) => {
    const handleCardClick = async (e: React.MouseEvent) => {
      // Record interaction when card is clicked
      await handleItemClick(item.id, item.type, item);
    };

    // Transform creator to author format for ListingCard
    const transformedItem = {
      ...item,
      author: {
        name: item.creator?.username || item.creator?.name || "Unknown",
        avatar: item.creator?.avatar,
      },
    };

    return (
      <div onClick={handleCardClick} role="button" className="cursor-pointer">
        <ListingCard {...props} {...transformedItem} />
      </div>
    );
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Latest Activity Feed */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="all">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Latest Activity</h2>
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                    <TabsTrigger value="rides">Rides</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="lostfound">Lost/Found</TabsTrigger>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {getActivityItems().map((item) => (
                            <InteractiveListingCard
                              key={`${item.type}-${item.id}`}
                              item={item}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {products.map((product) => (
                            <InteractiveListingCard
                              key={product.id}
                              item={{ ...product, type: "product" }}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {trips.map((trip) => (
                            <InteractiveListingCard
                              key={trip.id}
                              item={{ ...trip, type: "trip" }}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {rides.map((ride) => (
                            <InteractiveListingCard
                              key={ride.id}
                              item={{ ...ride, type: "ride" }}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="donations">
                      {donations.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">
                            No donations yet
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {donations.map((donation) => (
                            <InteractiveListingCard
                              key={donation.id}
                              item={{ ...donation, type: "donation" }}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {events.map((event) => (
                            <InteractiveListingCard
                              key={event.id}
                              item={{ ...event, type: "event" }}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {lostFoundItems.map((item) => (
                            <InteractiveListingCard
                              key={item.id}
                              item={{ ...item, type: "lost_found" }}
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
        </div>
      </div>
    </Layout>
  );
}