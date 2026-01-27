import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ListingCard } from "@/components/ui/ListingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { getLatestPosts, type DashboardCard } from "@/api/dashboard";

export default function DashboardPage() {
  const [allPosts, setAllPosts] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  const filterPostsByType = (type?: DashboardCard["type"]) => {
    if (!type) return allPosts;
    return allPosts.filter((post) => post.type === type);
  };

  const renderPosts = (posts: DashboardCard[]) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => {
          // Map post type to ListingCard type
          const cardType = post.type === "event" ? "giveaway" : post.type;
          
          return (
            <ListingCard
              key={`${post.type}-${post.id}`}
              id={post.id.toString()}
              title={post.title}
              description={post.subtitle || ""}
              image={post.image || "/placeholder-image.jpg"}
              type={cardType as "product" | "trip" | "donation" | "giveaway"}
              price={post.price}
              author={{
                name: post.creator_username,
              }}
            />
          );
        })}
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
                      {renderPosts(allPosts)}
                    </TabsContent>

                    <TabsContent value="products">
                      {renderPosts(filterPostsByType("product"))}
                    </TabsContent>

                    <TabsContent value="trips">
                      {renderPosts(filterPostsByType("trip"))}
                    </TabsContent>

                    <TabsContent value="rides">
                      {renderPosts(filterPostsByType("ride"))}
                    </TabsContent>

                    <TabsContent value="donations">
                      {renderPosts(filterPostsByType("donation"))}
                    </TabsContent>

                    <TabsContent value="events">
                      {renderPosts(filterPostsByType("event"))}
                    </TabsContent>

                    <TabsContent value="lostfound">
                      {renderPosts(filterPostsByType("lost_found"))}
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