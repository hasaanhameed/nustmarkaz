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
  ArrowRight
} from "lucide-react";
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
          {/* Main Content - Personal Dashboard */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">Personal Dashboard</h2>
              <p className="text-muted-foreground font-medium">Manage your campus activity and listings in one place.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "My Products", count: products.length, icon: Package, color: "text-accent", href: "/marketplace", description: "Items you're selling" },
                { title: "Current Trips", count: trips.length, icon: MapPin, color: "text-success", href: "/trips", description: "Journeys you've organized" },
                { title: "Carpool Offers", count: rides.length, icon: Car, color: "text-blue-500", href: "/carpooling", description: "Shared commutes" },
                { title: "Donation Drives", count: donations.length, icon: Heart, color: "text-warning", href: "/donations", description: "Causes you're supporting" },
                { title: "Hosted Events", count: events.length, icon: Gift, color: "text-primary", href: "/events", description: "Events you've created" },
                { title: "Lost & Found", count: lost_found_items.length, icon: Search, color: "text-purple-500", href: "/lost-found", description: "Reports you've made" },
              ].map((item, i) => (
                <Link key={i} to={item.href} className="group">
                  <Card className="h-full border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className={cn("p-4 rounded-2xl bg-muted/50 transition-colors group-hover:bg-primary/5", item.color)}>
                          <item.icon className="h-8 w-8" />
                        </div>
                        <div className="text-4xl font-black text-foreground/20 group-hover:text-primary/20 transition-colors">
                          {String(item.count).padStart(2, '0')}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-1">{item.description}</p>

                      <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        Manage Listings <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Quick Actions / Integration Tip */}
            <Card className="mt-8 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">Want to list something new?</h4>
                  <p className="text-muted-foreground font-medium">Head over to the respective sections to create new listings. Your dashboard will update instantly.</p>
                </div>
                <Link to="/marketplace">
                  <Button className="h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20">
                    Go to Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}