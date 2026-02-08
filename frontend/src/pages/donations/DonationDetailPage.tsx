import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { getDonationById, deleteDonation, Donation } from "@/api/donation";
import { getCurrentUser } from "@/api/user";
import { ArrowLeft, Share2, Phone, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";

import { useUser } from "@/contexts/UserContext";

export default function DonationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const fetchDonation = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const donationData = await getDonationById(id);
      setDonation(donationData);
    } catch (err) {
      console.error("Error fetching donation:", err);
      setError("Failed to load donation details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!donation) return;

    try {
      setIsDeleting(true);
      await deleteDonation(donation.id);
      toast.success("Donation drive deleted successfully.");
      navigate("/donations");
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation drive.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageLoader />
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

  const isCreator = currentUser?.id === donation.creator_id;

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
            {donation.images && donation.images.length > 0 && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
                <img
                  src={donation.images[0].image_path}
                  alt={donation.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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
                {/* Contact Information */}
                {donation.contact_number && (
                  <Card className="bg-accent/10">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-sm">Contact Organizer</h3>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-accent" />
                        <span className="font-medium">{donation.contact_number}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Call to contribute or learn more
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Edit/Delete or Share buttons */}
                {isCreator ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate(`/donations/edit/${donation.id}`)}
                      className="w-full gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Drive
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Drive
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Donation Drive</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this donation drive? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Drive
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Help support this cause by sharing it with others in the
                      community.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}