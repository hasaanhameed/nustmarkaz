import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Search, Plus, Calendar, MapPin, Users, Share2, ExternalLink } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getAllEvents, Event } from "@/api/event";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      // Sort by date (newest first or upcoming)
      const sorted = data.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
      setEvents(sorted);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.society.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleShare = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/events/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard!");
  };

  if (loading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-custom py-16">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
            Campus Events
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Discover upcoming activities, workshops, and society events across NUST. Stay connected with your campus community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full"
              />
            </div>
            {currentUser ? (
              <Link to="/events/create">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Post Event
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Login to Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="group">
                <Card className="overflow-hidden border border-border hover:shadow-2xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col bg-card">
                  {/* Image Container - Clickable */}
                  <Link to={`/events/${event.id}`} className="block">
                    <div className="relative h-56 overflow-hidden bg-muted">
                      {event.images && event.images.length > 0 ? (
                        <img
                          src={event.images[0].image_path}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                          <Calendar className="w-16 h-16 text-primary/30" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 flex flex-col items-center shadow-lg min-w-[3.5rem]">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-gray-900 leading-none">
                          {new Date(event.event_date).getDate()}
                        </span>
                      </div>

                      {/* Society Badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border-0">
                          {event.society}
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <Link to={`/events/${event.id}`}>
                      <h2 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                        {event.title}
                      </h2>
                    </Link>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{formatDate(event.event_date)} • {formatTime(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-sm font-medium text-primary group-hover:text-accent transition-colors flex items-center gap-2"
                      >
                        View Details
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
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => handleShare(e, event.id)}
                        title="Share Event"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="Be the first to post an exciting campus event!"
            actionLabel={currentUser ? "Post an Event" : "Login to Post"}
            onAction={currentUser ? () => window.location.href = '/events/create' : () => window.location.href = '/login'}
          />
        )}
      </section>
    </Layout>
  );
}