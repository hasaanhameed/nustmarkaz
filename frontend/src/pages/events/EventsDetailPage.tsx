import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Calendar, MapPin, Users, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getEventById, Event } from "@/api/event";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GiveawayDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      if (id) {
        const data = await getEventById(parseInt(id));
        setEvent(data);
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
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
          <div className="text-center">Loading event details...</div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">Event not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Link
          to="/giveaways"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 mb-6 flex items-center justify-center">
              {event.images?.[0]?.image_path ? (
                <img 
                  src={event.images[0].image_path} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Calendar className="h-24 w-24 text-white/20" />
              )}
            </div>

            <Badge className="bg-blue-600 text-white mb-4">Event</Badge>
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-3">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.event_date)} at {formatTime(event.event_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Organized By</p>
                    <p className="text-sm text-muted-foreground">{event.society}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center py-4 border-b">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-semibold mt-1">{formatDate(event.event_date)}</p>
                  <p className="text-sm text-blue-600 font-medium">{formatTime(event.event_date)}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-right">{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-muted-foreground">Society</span>
                    <span className="font-medium">{event.society}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <Card className="bg-accent/10">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">Contact Organizer</h3>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-accent" />
                      <span className="font-medium">{event.contact_number}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Call for more details or registration
                    </p>
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Event
                </Button>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">Posted by</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(event.creator.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{event.creator.username}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}