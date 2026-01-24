import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/ui/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockGiveaways } from "@/data/mockData";
import { Search, Plus, Gift } from "lucide-react";
import { getCurrentUser, User } from "@/api/user";

export default function GiveawaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUser(null);
    }
  };

  const filteredGiveaways = mockGiveaways.filter((giveaway) =>
    giveaway.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Giveaways</h1>
            <p className="text-muted-foreground mt-1">
              Win exciting prizes from student societies
            </p>
          </div>
          {currentUser ? (
            <Link to="/giveaways/create">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Plus className="h-4 w-4" />
                Host Giveaway
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Plus className="h-4 w-4" />
                Log in to Post
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search giveaways..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Giveaways Grid */}
        {filteredGiveaways.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGiveaways.map((giveaway) => (
              <ListingCard key={giveaway.id} {...giveaway} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Gift}
            title="No giveaways found"
            description="Be the first to host an exciting giveaway!"
            actionLabel="Host Giveaway"
            actionHref="/giveaways/create"
          />
        )}
      </div>
    </Layout>
  );
}
