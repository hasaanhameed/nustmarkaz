import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { getUserProfile, UserProfileResponse } from "@/api/user";
import { useUser } from "@/contexts/UserContext";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  Mail,
  School,
  Package,
  MapPin,
  Heart,
  Gift,
  Car,
  Loader2,
  Search,
  ShoppingBag,
  ArrowRight,
  Plus
} from "lucide-react";
import { ListingCard } from "@/components/ui/ListingCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getMyProducts } from "@/api/product";
import { getMyTrips } from "@/api/trip";
import { getMyRides } from "@/api/ride";
import { getMyDonations } from "@/api/donation";
import { getMyEvents } from "@/api/event";
import { getMyLostFoundItems } from "@/api/lostFound";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user: authUser } = useUser();
  const [activeTab, setActiveTab] = useState("products");

  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    enabled: !!authUser,
  });

  if (isProfileLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-20 w-full mb-8 rounded-xl" />
              <Skeleton className="h-12 w-full mb-6 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <EmptyState
            icon={Package}
            title="Profile not found"
            description="Please log in to view your profile"
            actionLabel="Go to Login"
            actionHref="/login"
          />
        </div>
      </Layout>
    );
  }

  const { user, stats } = profileData;

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-blue-400 mx-auto flex items-center justify-center text-primary-foreground text-4xl font-black mb-6 shadow-2xl shadow-primary/20 ring-4 ring-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-2xl font-black text-foreground mb-1">{user.username}</h1>
                  <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs px-3 py-1 bg-primary/5 rounded-full inline-block">
                    {user.department}
                  </p>
                </div>

                <div className="space-y-6 text-sm mb-8">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/30 border border-white/40">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Email</p>
                      <p className="font-bold text-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/30 border border-white/40">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <School className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Department</p>
                      <p className="font-bold text-foreground">{user.department}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/40">
                  <EditProfileDialog
                    currentUsername={user.username}
                    currentDepartment={user.department}
                    currentEmail={user.email}
                    onProfileUpdated={() => refetchProfile()}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8 p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-white/40 shadow-sm">
              <h2 className="text-3xl font-black text-foreground mb-2">My Listings</h2>
              <p className="text-muted-foreground font-semibold">Manage your campus activities and listings in one place.</p>
            </div>

            <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
              <TabsList className="w-full overflow-x-auto flex justify-start h-auto p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 gap-1 no-scrollbar p-1.5">
                <TabsTrigger
                  value="products"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Products ({stats.product_count})
                </TabsTrigger>
                <TabsTrigger
                  value="trips"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Trips ({stats.trip_count})
                </TabsTrigger>
                <TabsTrigger
                  value="carpool"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Carpool ({stats.ride_count})
                </TabsTrigger>
                <TabsTrigger
                  value="donations"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Donations ({stats.donation_count})
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Events ({stats.event_count})
                </TabsTrigger>
                <TabsTrigger
                  value="lostfound"
                  className="rounded-xl px-4 py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all font-bold text-sm"
                >
                  Lost/Found ({stats.lost_found_count})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <TabContent
                  queryKey="my-products"
                  fetchFn={getMyProducts}
                  icon={ShoppingBag}
                  title="No products listed"
                  description="You haven't listed any items for sale yet."
                  actionLabel="List an Item"
                  actionHref="/marketplace/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={item.title}
                      description={item.description}
                      image={item.images?.[0]?.image_path || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"}
                      type="product"
                      price={item.price}
                      location={item.pickup_location}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="trips">
                <TabContent
                  queryKey="my-trips"
                  fetchFn={getMyTrips}
                  icon={MapPin}
                  title="No trips planned"
                  description="You haven't organized any trips yet."
                  actionLabel="Plan a Trip"
                  actionHref="/trips/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={item.title}
                      description={item.description}
                      image={item.images?.[0]?.image_path || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400"}
                      type="trip"
                      price={item.cost_per_person}
                      date={new Date(item.start_date).toLocaleDateString()}
                      location={item.destination}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="carpool">
                <TabContent
                  queryKey="my-rides"
                  fetchFn={getMyRides}
                  icon={Car}
                  title="No rides offered"
                  description="You currently have no active carpool offers."
                  actionLabel="Offer a Ride"
                  actionHref="/carpooling/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={`${item.from_location} to ${item.to_location}`}
                      description={`Vehicle: ${item.vehicle_color} ${item.vehicle_model}`}
                      image={"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400"}
                      type="ride"
                      price={item.price}
                      date={`${item.ride_date} at ${item.ride_time}`}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="donations">
                <TabContent
                  queryKey="my-donations"
                  fetchFn={getMyDonations}
                  icon={Heart}
                  title="No donation drives"
                  description="You haven't started any donation campaigns."
                  actionLabel="Start a Campaign"
                  actionHref="/donations/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={item.title}
                      description={item.description}
                      image={"https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400"}
                      type="donation"
                      goal={item.goal_amount}
                      raised={0}
                      endsIn={new Date(item.end_date).toLocaleDateString()}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="events">
                <TabContent
                  queryKey="my-events"
                  fetchFn={getMyEvents}
                  icon={Gift}
                  title="No events hosted"
                  description="You haven't created any events."
                  actionLabel="Host an Event"
                  actionHref="/events/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={item.title}
                      description={item.description}
                      image={item.images?.[0]?.image_path || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400"}
                      type="event"
                      location={item.location}
                      date={new Date(item.event_date).toLocaleDateString()}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="lostfound">
                <TabContent
                  queryKey="my-lostfound"
                  fetchFn={getMyLostFoundItems}
                  icon={Search}
                  title="No reports"
                  description="You haven't reported any lost or found items."
                  actionLabel="Report Item"
                  actionHref="/lost-found/create"
                  renderItem={(item) => (
                    <ListingCard
                      id={item.id.toString()}
                      title={item.title}
                      description={item.description}
                      image={item.image_path || "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400"}
                      type="lost_found"
                      location={item.location}
                      date={new Date(item.date).toLocaleDateString()}
                      author={{ name: user.username }}
                    />
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper component for lazy loading tab content with pagination
function TabContent({
  queryKey,
  fetchFn,
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  renderItem
}: any) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 0 }) => fetchFn(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
    initialPageParam: 0,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const allItems = data?.pages.flat() || [];

  if (allItems.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/30 backdrop-blur-sm rounded-[2rem] border border-white/40 p-12">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          actionLabel={actionLabel}
          actionHref={actionHref}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {allItems.map((item: any) => (
          <div key={item.id} className="h-full">
            {renderItem(item)}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="rounded-full px-8 h-12 font-black border-primary text-primary hover:bg-primary hover:text-white group"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
            )}
            {isFetchingNextPage ? "Loading More..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
