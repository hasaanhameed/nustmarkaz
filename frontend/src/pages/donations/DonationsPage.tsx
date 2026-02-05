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
import { useUser } from "@/contexts/UserContext";

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useUser();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

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
          {/* Header Hero Section */}
          <div className="text-center max-w-2xl mx-auto mb-12 animate-entrance">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Donation Drives
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Support causes that matter to our community. Connect with verified drives or start your own to make an impact.
            </p>
            <div className="flex justify-center">
              {currentUser ? (
                <Link to="/donations/create">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" />
                    Start a Drive
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" />
                    Log in to Post
                  </Button>
                </Link>
              )}
            </div>
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
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-20 space-y-6">
                {/* Stats Card */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="font-semibold mb-3">Active Drives</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
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
