import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, ExternalLink, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getSocietiesWithRatingsDetailed } from "@/api/society";
import type { SocietyCardData } from "@/api/society";

export default function SocietiesPage() {
    const [societies, setSocieties] = useState<SocietyCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                setLoading(true);
                const data = await getSocietiesWithRatingsDetailed();
                setSocieties(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch societies:", err);
                setError("Failed to load societies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSocieties();
    }, []);

    // Loading state
    if (loading) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading societies...</p>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                            <p className="text-destructive font-medium mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    // Empty state
    if (societies.length === 0) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="max-w-md mx-auto text-center">
                        <Card className="p-8">
                            <p className="text-muted-foreground mb-4">
                                No societies found. Check back later!
                            </p>
                        </Card>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="container-custom py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary tracking-tight">
                        Campus Societies
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Explore student societies on campus. Read reviews from fellow
                        students and share your own experiences with different societies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societies.map((society) => (
                        <div key={society.id} className="group">
                            <Card className="overflow-hidden border border-border hover:shadow-2xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col bg-card">
                                {/* Image Container - Clickable to details */}
                                <Link to={`/societies/${society.id}`} className="block">
                                    <div className="relative h-56 overflow-hidden bg-muted">
                                        {society.image_url ? (
                                            <img
                                                src={society.image_url}
                                                alt={society.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    const target = e.target as HTMLImageElement;
                                                    target.src =
                                                        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop";
                                                }}
                                            />
                                        ) : (
                                            // Fallback placeholder
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                                <Users className="w-16 h-16 text-primary/30" />
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-sm text-gray-900">
                                                {society.average_rating > 0
                                                    ? society.average_rating.toFixed(1)
                                                    : "New"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <Link to={`/societies/${society.id}`}>
                                        <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                                            {society.name}
                                        </h2>
                                    </Link>

                                    {/* Society Instagram URL - Clickable */}
                                    {society.instagram_url && (
                                        <a
                                            href={society.instagram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-3 w-fit"
                                        >
                                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm truncate">
                                                {society.instagram_url.replace(/^https?:\/\/(www\.)?/, '')}
                                            </span>
                                        </a>
                                    )}

                                    {/* Review Count */}
                                    <div className="text-sm text-muted-foreground mb-4">
                                        {society.review_count > 0 ? (
                                            <>
                                                {society.review_count}{" "}
                                                {society.review_count === 1 ? "review" : "reviews"}
                                            </>
                                        ) : (
                                            "No reviews yet"
                                        )}
                                    </div>

                                    {/* View Details Button */}
                                    <Link
                                        to={`/societies/${society.id}`}
                                        className="mt-auto pt-4 border-t border-border block"
                                    >
                                        <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                                            View Details & Reviews
                                            <svg
                                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}