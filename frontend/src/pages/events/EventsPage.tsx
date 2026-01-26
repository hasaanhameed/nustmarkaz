import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Plus, Calendar, MapPin, Users, Share2 } from "lucide-react";
import { getCurrentUser, User } from "@/api/user";
import { getAllEvents, Event } from "@/api/event";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function GiveawaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">Loading events...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Campus Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover upcoming events and activities
            </p>
          </div>
          {currentUser ? (
            <Link to="/giveaways/create">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                Post Event
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                Log in to Post
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, societies, beneficiaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Events List */}
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/giveaways/${event.id}`}
                    className="block"
                  >
                    <div className="border-l-4 border-blue-600 bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        {/* Left side - Content */}
                        <div className="flex-1 p-6">
                          {/* User Info */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getInitials(event.society)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{event.society}</p>
                                <p className="text-sm text-muted-foreground">
                                  Event Organizer
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              Upcoming
                            </Badge>
                          </div>

                          {/* Event Title */}
                          <h3 className="text-xl font-semibold mb-2">
                            {event.title}
                          </h3>

                          {/* Event Info */}
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Event Date:</span>
                              {formatDate(event.event_date)} at {formatTime(event.event_date)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Location:</span>
                              {event.location}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Organized by:</span>
                              {event.society}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                              Click to learn more
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Right side - Image */}
                        <div className="w-48 flex-shrink-0">
                          <div className="h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                            {event.images && event.images.length > 0 ? (
                              <img 
                                src={event.images[0].image_path} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="h-16 w-16 text-white/30" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No events found"
                description="Be the first to post an exciting campus event!"
                actionLabel="Post Event"
                actionHref="/giveaways/create"
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border sticky top-8">
              <h3 className="font-semibold mb-2">Upcoming Events</h3>
              <div className="text-4xl font-bold text-blue-600">
                {filteredEvents.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                out of {events.length} total
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}