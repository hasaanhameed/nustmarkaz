import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FeedPost } from "@/components/ui/FeedPost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp } from "lucide-react";
import { getLatestPosts, type DashboardCard } from "@/api/dashboard";
import { RequestRideDialog } from "@/pages/carpool/RequestRideDialog";

export default function DashboardPage() {
  const [allPosts, setAllPosts] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const posts = await getLatestPosts(50);
      setAllPosts(posts);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterPostsByType = (type?: DashboardCard["type"]) => {
    if (!type) return allPosts;
    return allPosts.filter((post) => post.type === type);
  };

  const renderPosts = (posts: DashboardCard[]) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No activity yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Posts will appear here when they're created
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {posts.map((post) => (
          <FeedPost
            key={`${post.type}-${post.id}`}
            id={post.id.toString()}
            title={post.title}
            description={post.subtitle || ""}
            type={post.type}
            price={post.price}
            image={post.image}
            author={{
              name: post.creator_username,
            }}
            createdAt={post.created_at}
          />
        ))}
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
      <div className="container-custom py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Campus Feed</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Latest activity from your campus community
          </p>
        </div>

        {/* Quick Actions */}
        <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-3 mb-6">
          <Link to="/marketplace/create">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Sell Product
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">List an item</p>
            </div>
          </Link>

          <Link to="/trips/create">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Organize Trip
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Plan adventure</p>
            </div>
          </Link>

          <RequestRideDialog onRideCreated={fetchData}>
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Offer Ride
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Share a ride</p>
            </div>
          </RequestRideDialog>

          <Link to="/donations/create">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Support Cause
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Start donation</p>
            </div>
          </Link>

          <Link to="/giveaways/create">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Post Event
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Organize event</p>
            </div>
          </Link>

          <Link to="/lost-found?action=lost">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Report Lost
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Lost an item</p>
            </div>
          </Link>

          <Link to="/lost-found?action=found">
            <div className="group p-3 md:p-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
              <p className="font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                Report Found
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Found an item</p>
            </div>
          </Link>
        </div>

        {/* Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 mb-4 border-b">
                <h2 className="text-lg font-semibold mb-3">Activity Feed</h2>
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full h-auto p-1 bg-muted/50">
                  <TabsTrigger value="all" className="text-xs md:text-sm py-2">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="products" className="text-xs md:text-sm py-2">
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="trips" className="text-xs md:text-sm py-2">
                    Trips
                  </TabsTrigger>
                  <TabsTrigger value="rides" className="text-xs md:text-sm py-2">
                    Rides
                  </TabsTrigger>
                  <TabsTrigger value="donations" className="text-xs md:text-sm py-2">
                    Donations
                  </TabsTrigger>
                  <TabsTrigger value="events" className="text-xs md:text-sm py-2">
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="lostfound" className="text-xs md:text-sm py-2">
                    Lost/Found
                  </TabsTrigger>
                </TabsList>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading feed...</p>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="mt-0">
                    {renderPosts(allPosts)}
                  </TabsContent>

                  <TabsContent value="products" className="mt-0">
                    {renderPosts(filterPostsByType("product"))}
                  </TabsContent>

                  <TabsContent value="trips" className="mt-0">
                    {renderPosts(filterPostsByType("trip"))}
                  </TabsContent>

                  <TabsContent value="rides" className="mt-0">
                    {renderPosts(filterPostsByType("ride"))}
                  </TabsContent>

                  <TabsContent value="donations" className="mt-0">
                    {renderPosts(filterPostsByType("donation"))}
                  </TabsContent>

                  <TabsContent value="events" className="mt-0">
                    {renderPosts(filterPostsByType("event"))}
                  </TabsContent>

                  <TabsContent value="lostfound" className="mt-0">
                    {renderPosts(filterPostsByType("lost_found"))}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Right Sidebar - Quick Stats/Info */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-4 space-y-4">
              {/* Quick Stats Card */}
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold text-sm mb-3 text-muted-foreground">
                  Latest Campus Activity - Last 20 Posts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="font-semibold">{allPosts.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-semibold">
                      {filterPostsByType("product").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trips</span>
                    <span className="font-semibold">
                      {filterPostsByType("trip").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rides</span>
                    <span className="font-semibold">
                      {filterPostsByType("ride").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Donations</span>
                    <span className="font-semibold">
                      {filterPostsByType("donation").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Events</span>
                    <span className="font-semibold">
                      {filterPostsByType("event").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Lost/Found</span>
                    <span className="font-semibold">
                      {filterPostsByType("lost_found").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}