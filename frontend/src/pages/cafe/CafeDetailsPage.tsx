import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Star, MapPin, User, Loader2, AlertCircle } from "lucide-react";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import { getCafeById, createReview, deleteReview } from "@/api/cafe";
import type { CafeWithReviews } from "@/api/cafe";
import { toast } from "sonner";
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

export default function CafeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState<CafeWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  // Fetch cafe data
  useEffect(() => {
    const fetchCafe = async () => {
      if (!id) {
        setError("Invalid cafe ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCafeById(parseInt(id));
        setCafe(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch cafe:", err);
        if (err.response?.status === 404) {
          setError("Cafe not found");
        } else {
          setError("Failed to load cafe details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  // Handle review submission
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRating < 1 || newRating > 5) {
      setSubmitError("Please select a rating between 1 and 5");
      return;
    }

    if (!newComment.trim()) {
      setSubmitError("Please enter a comment");
      return;
    }

    if (!cafe) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const newReview = await createReview(cafe.id, {
        rating: newRating,
        comment: newComment.trim(),
      });

      // Add the new review to the local state
      setCafe({
        ...cafe,
        reviews: [...cafe.reviews, newReview],
      });

      // Reset form
      setNewRating(0);
      setNewComment("");

      // Show success message (optional)
      toast.success("Review submitted successfully.");
    } catch (err: any) {
      console.error("Failed to submit review:", err);

      if (err.response?.status === 401) {
        setSubmitError("Please log in to submit a review");
      } else if (err.response?.status === 404) {
        setSubmitError("Cafe not found");
      } else {
        setSubmitError("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: number) => {
    if (!cafe) return;

    setDeletingReviewId(reviewId);
    try {
      await deleteReview(cafe.id, reviewId);
      setCafe({
        ...cafe,
        reviews: cafe.reviews.filter(r => r.id !== reviewId)
      });
      toast.success("Review deleted successfully.");
    } catch (err: any) {
      toast.error(`Failed to delete review. ${err.response?.data?.detail || err.message}`);
    } finally {
      setDeletingReviewId(null);
    }
  };

  // 
  // Calculate average rating
  const averageRating =
    cafe && cafe.reviews.length > 0
      ? (
        cafe.reviews.reduce((sum, r) => sum + r.rating, 0) /
        cafe.reviews.length
      ).toFixed(1)
      : "0.0";

  // Render star rating
  const renderStars = (rating: number, size: string = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating
              ? "fill-primary text-primary"
              : "fill-gray-200 text-gray-200"
              }`}
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  // Error state
  if (error || !cafe) {
    return (
      <Layout>
        <section className="container-custom py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary mb-4">
                {error || "Cafe not found"}
              </h1>
              <button
                onClick={() => navigate("/cafes")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Back to Cafes
              </button>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-custom py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {cafe.image_url ? (
                <img
                  src={cafe.image_url}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                  <MapPin className="w-32 h-32 text-primary/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            </div>

            {/* Info Card */}
            <div className="lg:sticky lg:top-24">
              <Card className="p-8 shadow-xl border-border bg-card">
                <h1 className="text-4xl font-bold text-primary mb-4">
                  {cafe.name}
                </h1>

                {/* Location */}
                {cafe.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{cafe.location}</span>
                  </div>
                )}

                {/* Rating Display */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {averageRating}
                    </div>
                    {renderStars(Number(averageRating), "w-6 h-6")}
                    <span className="text-sm text-muted-foreground mt-2">
                      {cafe.reviews.length}{" "}
                      {cafe.reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {cafe.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-2">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {cafe.description}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Student Reviews
          </h2>

          {/* Existing Reviews */}
          <div className="space-y-4 mb-12">
            {cafe.reviews.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </p>
              </Card>
            )}
            {cafe.reviews.map((review) => (
              <Card
                key={review.id}
                className="p-6 hover:shadow-lg transition-shadow border-border bg-card"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-primary">
                          Anonymous Student
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating, "w-4 h-4")}
                          <span className="text-sm text-muted-foreground">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-destructive hover:text-destructive/80 text-sm font-semibold transition-colors">
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={deletingReviewId === review.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingReviewId === review.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Add Review Form */}
          <Card className="p-8 shadow-xl border-border bg-card">
            <h3 className="text-2xl font-bold text-primary mb-6">
              Share Your Experience
            </h3>

            {submitError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-6">
              {/* Rating Input */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-primary">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                      disabled={submitting}
                    >
                      <Star
                        className={`w-8 h-8 ${star <= newRating
                          ? "fill-primary text-primary"
                          : "fill-gray-200 text-gray-200 hover:fill-primary/50 hover:text-primary/50"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                {newRating > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You selected {newRating} star{newRating !== 1 && "s"}
                  </p>
                )}
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-primary">
                  Your Review *
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-background text-foreground"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  required
                  disabled={submitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={newRating === 0 || submitting}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </Card>
        </div>
      </section>
    </Layout>
  );
}