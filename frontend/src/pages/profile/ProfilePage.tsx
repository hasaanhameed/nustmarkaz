import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { getUserProfile, UserProfile } from "@/api/user";
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
  Zap,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { ListingCard } from "@/components/ui/ListingCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
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

  const { user, products, trips, rides, donations, events, lost_found_items } = profile;

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-primary mx-auto flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-muted-foreground">{user.department}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <School className="h-4 w-4" />
                    <span>{user.department}</span>
                  </div>
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  <EditProfileDialog
                    currentUsername={user.username}
                    currentDepartment={user.department}
                    currentEmail={user.email}
                    onProfileUpdated={fetchProfile}
                  />
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Main Content - Listings */}
          {/* Main Content - Personal Dashboard */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">My Listings</h2>
              <p className="text-muted-foreground font-medium">Manage your campus activity and listings in one place.</p>
            </div>

            <Tabs defaultValue="products" className="w-full space-y-6 md:space-y-8">
              <TabsList className="w-full overflow-x-auto flex justify-start h-auto p-1 bg-transparent gap-2 no-scrollbar pb-4 md:pb-0">
                <TabsTrigger
                  value="products"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Products ({products.length})
                </TabsTrigger>
                <TabsTrigger
                  value="trips"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Trips ({trips.length})
                </TabsTrigger>
                <TabsTrigger
                  value="carpool"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Carpool ({rides.length})
                </TabsTrigger>
                <TabsTrigger
                  value="donations"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Donations ({donations.length})
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Events ({events.length})
                </TabsTrigger>
                <TabsTrigger
                  value="lostfound"
                  className="rounded-full px-4 py-2 md:px-6 md:py-3 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-lg active:scale-95 transition-all font-bold text-sm md:text-base"
                >
                  Lost & Found ({lost_found_items.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {products.map((item: any) => (
                      <div key={item.id} className="h-full">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ShoppingBag}
                    title="No products listed"
                    description="You haven't listed any items for sale yet."
                    actionLabel="List an Item"
                    actionHref="/marketplace/create"
                  />
                )}
              </TabsContent>

              <TabsContent value="trips" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {trips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {trips.map((item: any) => (
                      <div key={item.id} className="h-full">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={MapPin}
                    title="No trips planned"
                    description="You haven't organized any trips yet."
                    actionLabel="Plan a Trip"
                    actionHref="/trips/create"
                  />
                )}
              </TabsContent>

              <TabsContent value="carpool" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {rides.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {rides.map((item: any) => (
                      <div key={item.id} className="h-full">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Car}
                    title="No rides offered"
                    description="You currently have no active carpool offers."
                    actionLabel="Offer a Ride"
                    actionHref="/carpooling/create"
                  />
                )}
              </TabsContent>

              <TabsContent value="donations" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {donations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {donations.map((item: any) => (
                      <div key={item.id} className="h-full">
                        <ListingCard
                          id={item.id.toString()}
                          title={item.title}
                          description={item.description}
                          image={"https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400"}
                          type="donation"
                          goal={item.goal_amount}
                          raised={0} // API doesn't return this yet
                          endsIn={new Date(item.end_date).toLocaleDateString()}
                          author={{ name: user.username }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Heart}
                    title="No donation drives"
                    description="You haven't started any donation campaigns."
                    actionLabel="Start a Campaign"
                    actionHref="/donations/create"
                  />
                )}
              </TabsContent>

              <TabsContent value="events" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {events.map((item: any) => (
                      <div key={item.id} className="h-full">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Gift}
                    title="No events hosted"
                    description="You haven't created any events."
                    actionLabel="Host an Event"
                    actionHref="/events/create"
                  />
                )}
              </TabsContent>

              <TabsContent value="lostfound" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {lost_found_items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {lost_found_items.map((item: any) => (
                      <div key={item.id} className="h-full">
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Search}
                    title="No reports"
                    description="You haven't reported any lost or found items."
                    actionLabel="Report Item"
                    actionHref="/lost-found/create"
                  />
                )}
              </TabsContent>
            </Tabs>

            {/* Quick Actions / Integration Tip */}
            <Card className="mt-8 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">Want to list something new?</h4>
                  <p className="text-muted-foreground font-medium">Head over to the respective sections to create new listings. Your dashboard will update instantly.</p>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}