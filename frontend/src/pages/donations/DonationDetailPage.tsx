import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getDonationById, Donation } from "@/api/donation";
import { ArrowLeft, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function DonationDetailPage() {
  const { id } = useParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const fetchDonation = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getDonationById(id);
      setDonation(data);
    } catch (err) {
      console.error("Error fetching donation:", err);
      setError("Failed to load donation details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !donation) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <Link
            to="/donations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Donations
          </Link>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                {error || "Donation not found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const endDate = new Date(donation.end_date);
  const today = new Date();
  const daysLeft = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        <Link
          to="/donations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donations
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
              <img
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"
                alt={donation.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Badge className="bg-warning text-warning-foreground mb-4">
              Donation Drive
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{donation.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <span>
                  {daysLeft > 0 ? `${daysLeft} days left` : "Drive ended"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>
                  Created by {donation.creator.username} (
                  {donation.creator.department})
                </span>
              </div>
            </div>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-3">About This Drive</h2>
              <p className="text-muted-foreground leading-relaxed">
                {donation.description}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Beneficiary:</span>{" "}
                  {donation.beneficiary}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">End Date:</span>{" "}
                  {format(new Date(donation.end_date), "PPP")}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    Rs. {donation.goal_amount.toLocaleString()}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fundraising Goal
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Drive
                </Button>
                <p className="text-sm text-muted-foreground">
                  Help support this cause by sharing it with others in the
                  community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
