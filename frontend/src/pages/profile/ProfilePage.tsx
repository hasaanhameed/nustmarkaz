import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { getUserProfile, UserProfile } from "@/api/user";
import { Mail, School, Package, MapPin, Heart, Gift, Car, Loader2 } from "lucide-react";
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
        <div className="grid lg:grid-cols-3 gap-8">
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

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Package className="h-5 w-5 mx-auto mb-1 text-accent" />
                    <div className="text-xl font-bold">{products.length}</div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 mx-auto mb-1 text-success" />
                    <div className="text-xl font-bold">{trips.length}</div>
                    <div className="text-xs text-muted-foreground">Trips</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Car className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-xl font-bold">{rides.length}</div>
                    <div className="text-xs text-muted-foreground">CarPool</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-warning" />
                    <div className="text-xl font-bold">{donations.length}</div>
                    <div className="text-xs text-muted-foreground">Donations</div>
                  </div>



                               <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Gift className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{events.length}</div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Package className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <div className="text-xl font-bold">{lost_found_items.length}</div>
                    <div className="text-xs text-muted-foreground">Lost&Found</div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="products">
                  <TabsList className="grid grid-cols-6 w-full">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                     <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
                    <TabsTrigger value="rides">CarPooling</TabsTrigger>
                    
                   
                  </TabsList>

                  <TabsContent value="products" className="mt-6">
                    {products.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/marketplace/${product.id}`}>
                              <div className="aspect-video bg-muted relative overflow-hidden">
                                {product.images?.[0]?.image_path ? (
                                  <img src={product.images[0].image_path} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-12 w-12 text-muted-foreground opacity-20" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                <p className="text-lg font-bold mt-2">Rs. {product.price}</p>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Package}
                        title="No products listed"
                        description="Start selling by listing your first product"
                        actionLabel="List Product"
                        actionHref="/marketplace/create"
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="trips" className="mt-6">
                    {trips.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {trips.map((trip) => (
                          <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/trips/${trip.id}`}>
                              <div className="aspect-video bg-muted relative overflow-hidden">
                                {trip.images?.[0]?.image_path ? (
                                  <img src={trip.images[0].image_path} alt={trip.destination} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <MapPin className="h-12 w-12 text-muted-foreground opacity-20" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{trip.title || trip.destination}</h3>
                                <p className="text-sm text-muted-foreground">{trip.destination}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-sm text-muted-foreground">{trip.max_participants} max</p>
                                  <p className="text-lg font-bold">Rs. {trip.cost_per_person}/person</p>
                                </div>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={MapPin}
                        title="No trips organized"
                        description="Organize your first trip for fellow students"
                        actionLabel="Create Trip"
                        actionHref="/trips/create"
                      />
                    )}
                  </TabsContent>

                                   <TabsContent value="rides" className="mt-6">
                    {rides.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {rides.map((ride) => (
                          <Card key={ride.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/carpooling`}>
                              <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden flex items-center justify-center">
                                <Car className="h-16 w-16 text-white/30" />
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{ride.from_location} → {ride.to_location}</h3>
                                <p className="text-sm text-muted-foreground">{ride.ride_date} at {ride.ride_time}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-sm text-muted-foreground">{ride.vehicle_type}</p>
                                  <p className="text-lg font-bold">Rs. {ride.price}</p>
                                </div>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Car}
                        title="No rides posted"
                        description="Share your ride and help others commute"
                        actionLabel="Post Ride"
                        actionHref="/carpooling"
                      />
                    )}
                  </TabsContent>
                
            
                  <TabsContent value="donations" className="mt-6">
                    {donations.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {donations.map((donation) => (
                          <Card key={donation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/donations/${donation.id}`}>
                              <div className="aspect-video bg-muted relative overflow-hidden">
                                {donation.image_paths?.[0] ? (
                                  <img src={donation.image_paths[0]} alt={donation.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Heart className="h-12 w-12 text-muted-foreground opacity-20" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{donation.title}</h3>
                                <p className="text-sm text-muted-foreground">{donation.category}</p>
                                <p className="text-lg font-bold mt-2">Goal: Rs. {donation.goal_amount}</p>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Heart}
                        title="No donation drives"
                        description="Start a donation drive for a cause you care about"
                        actionLabel="Start Drive"
                        actionHref="/donations/create"
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="events" className="mt-6">
                    {events.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {events.map((event) => (
                          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/events/${event.id}`}>
                              <div className="aspect-video bg-muted relative overflow-hidden">
                                {event.images?.[0]?.image_path ? (
                                  <img src={event.images[0].image_path} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Gift className="h-12 w-12 text-muted-foreground opacity-20" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">{event.society}</p>
                                <p className="text-sm text-muted-foreground mt-1">{new Date(event.event_date).toLocaleDateString()}</p>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Gift}
                        title="No events hosted"
                        description="Host your first event for the community"
                        actionLabel="Host Event"
                        actionHref="/events/create"
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="lost-found" className="mt-6">
                    {lost_found_items.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {lost_found_items.map((item) => (
                          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link to={`/lost-found`}>
                              <div className="aspect-video bg-muted relative overflow-hidden">
                                {item.image_path ? (
                                  <img src={item.image_path} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-12 w-12 text-muted-foreground opacity-20" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                <p className="text-lg font-bold mt-2 capitalize">{item.type}</p>
                              </CardContent>
                            </Link>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Package}
                        title="No lost & found items"
                        description="Report lost or found items to help the community"
                        actionLabel="Report Item"
                        actionHref="/lost-found"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}