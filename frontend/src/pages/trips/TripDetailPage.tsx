import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTrips } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, Users, Clock, Share2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TripDetailPage() {
  const { id } = useParams();
  const [ticketCount, setTicketCount] = useState("1");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];
  const spotsLeft = trip.spotsLeft ?? trip.spots ?? 0;

  const handleBookTicket = () => {
    // Mock booking - replace with API call later
    console.log("Booking tickets:", { tripId: id, count: ticketCount });
    setIsBookingOpen(false);
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
              <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
            </div>

            <Badge className="bg-success text-success-foreground mb-4">Trip</Badge>
            <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{trip.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{spotsLeft} spots left</span>
              </div>
            </div>

            <div className="border-t border-border py-6 mb-6">
              <h2 className="font-semibold text-lg mb-3">About This Trip</h2>
              <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
            </div>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">What's Included</h2>
              <ul className="space-y-2">
                {["Transport (AC Bus)", "Accommodation", "All Meals", "Tour Guide", "First Aid Kit"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">Rs. {trip.price?.toLocaleString()}</CardTitle>
                <p className="text-sm text-muted-foreground">per person</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available Spots</span>
                  <span className="font-medium">{spotsLeft} / {trip.spots}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full"
                    style={{ width: `${((trip.spots! - spotsLeft) / trip.spots!) * 100}%` }}
                  />
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Tickets</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Number of Tickets</Label>
                        <Select value={ticketCount} onValueChange={setTicketCount}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>{n} ticket{n > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input id="contact" placeholder="+92 300 1234567" />
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>Rs. {((trip.price ?? 0) * parseInt(ticketCount)).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button onClick={handleBookTicket} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Trip
                </Button>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {trip.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{trip.author.name}</p>
                        <p className="text-xs text-muted-foreground">Organizer</p>
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
