import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DonationPost } from "@/components/ui/DonationPost";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getAllDonations, Donation } from "@/api/donation";
import { Search, Plus, Heart } from "lucide-react";
import { getCurrentUser, User } from "@/api/user";

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchDonations();
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

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDonations(0, 100);
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(
    (donation) =>
      donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">Donation Drives</h1>
              <p className="text-muted-foreground mt-2">
                Support causes that matter to our community
              </p>
            </div>
            {currentUser ? (
              <Link to="/donations/create">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-10 px-4">
                  <Plus className="h-4 w-4" />
                  Start Drive
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-10 px-4">
                  <Plus className="h-4 w-4" />
                  Log in to Post
                </Button>
              </Link>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Feed */}
            <div className="lg:col-span-3">
              {/* Search */}
              <div className="relative mb-6 sticky top-20 z-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drives, beneficiaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <EmptyState
                  icon={Heart}
                  title="Error loading donations"
                  description={error}
                />
              ) : filteredDonations.length > 0 ? (
                <div className="space-y-4">
                  {filteredDonations.map((donation) => (
                    <DonationPost key={donation.id} donation={donation} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Heart}
                  title="No donation drives found"
                  description={
                    searchQuery
                      ? "Try adjusting your search terms"
                      : "Start a donation drive to support a cause you care about."
                  }
                  actionLabel={searchQuery ? undefined : "Start Drive"}
                  actionHref={searchQuery ? undefined : "/donations/create"}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-20 space-y-6">
                {/* Stats Card */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="font-semibold mb-3">Active Drives</h3>
                  <p className="text-3xl font-bold text-accent mb-2">
                    {
                      donations.filter((d) => {
                        const daysLeft = Math.ceil(
                          (new Date(d.end_date).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        );
                        return daysLeft > 0;
                      }).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    out of {donations.length} total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
