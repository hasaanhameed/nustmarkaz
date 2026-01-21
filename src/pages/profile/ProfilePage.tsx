import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/components/ui/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockUserProfile, mockProducts, mockTrips, mockDonations } from "@/data/mockData";
import { Edit, Mail, Calendar, School, Package, MapPin, Heart, Gift, Settings } from "lucide-react";

export default function ProfilePage() {
  const user = mockUserProfile;

  // Mock user listings - filter to show user's items
  const userProducts = mockProducts.slice(0, 2);
  const userTrips = mockTrips.slice(0, 1);
  const userDonations = mockDonations.slice(0, 1);

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
                    {user.name.charAt(0)}
                  </div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.department}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <School className="h-4 w-4" />
                    <span>{user.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
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
                    <div className="text-xl font-bold">{user.listings.products}</div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 mx-auto mb-1 text-success" />
                    <div className="text-xl font-bold">{user.listings.trips}</div>
                    <div className="text-xs text-muted-foreground">Trips</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-warning" />
                    <div className="text-xl font-bold">{user.listings.donations}</div>
                    <div className="text-xs text-muted-foreground">Donations</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Gift className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{user.listings.giveaways}</div>
                    <div className="text-xs text-muted-foreground">Giveaways</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Link */}
            <Button variant="ghost" className="w-full mt-4 gap-2 text-muted-foreground">
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
          </div>

          {/* Main Content - Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="products">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                    <TabsTrigger value="giveaways">Giveaways</TabsTrigger>
                  </TabsList>

                  <TabsContent value="products" className="mt-6">
                    {userProducts.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {userProducts.map((product) => (
                          <ListingCard key={product.id} {...product} />
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
                    {userTrips.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {userTrips.map((trip) => (
                          <ListingCard key={trip.id} {...trip} />
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

                  <TabsContent value="donations" className="mt-6">
                    {userDonations.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {userDonations.map((donation) => (
                          <ListingCard key={donation.id} {...donation} />
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

                  <TabsContent value="giveaways" className="mt-6">
                    <EmptyState
                      icon={Gift}
                      title="No giveaways hosted"
                      description="Host your first giveaway for the community"
                      actionLabel="Host Giveaway"
                      actionHref="/giveaways/create"
                    />
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
