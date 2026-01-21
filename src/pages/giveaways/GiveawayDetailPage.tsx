import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockGiveaways } from "@/data/mockData";
import { ArrowLeft, Share2, Clock, Users, CheckCircle, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export default function GiveawayDetailPage() {
  const { id } = useParams();
  const [isEntered, setIsEntered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const giveaway = mockGiveaways.find((g) => g.id === id) || mockGiveaways[0];

  const handleEnter = () => {
    setIsEntered(true);
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <Link
          to="/giveaways"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Giveaways
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
              <img src={giveaway.image} alt={giveaway.title} className="w-full h-full object-cover" />
            </div>

            <Badge className="bg-primary text-primary-foreground mb-4">Giveaway</Badge>
            <h1 className="text-3xl font-bold mb-4">{giveaway.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Ends in {giveaway.endsIn}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>234 entries</span>
              </div>
            </div>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-3">About This Giveaway</h2>
              <p className="text-muted-foreground leading-relaxed">{giveaway.description}</p>
            </div>

            {/* Rules */}
            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">Rules to Participate</h2>
              <ul className="space-y-3">
                {[
                  "Must be a verified NUST student",
                  "Follow the organizer on social media",
                  "Tag 2 friends in the announcement post",
                  "One entry per person",
                ].map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prize Details */}
            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">Prize Details</h2>
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Gift className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">{giveaway.title}</p>
                    <p className="text-sm text-muted-foreground">Estimated Value: Rs. 150,000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-accent mb-1">{giveaway.endsIn}</div>
                  <p className="text-sm text-muted-foreground">until winner is announced</p>
                </div>

                <div className="flex items-center justify-between text-sm py-3 border-t border-b border-border">
                  <span className="text-muted-foreground">Total Entries</span>
                  <span className="font-medium">234</span>
                </div>

                {isEntered ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                    <p className="font-semibold text-success">You're entered!</p>
                    <p className="text-sm text-muted-foreground">Good luck!</p>
                  </div>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Enter Giveaway
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Entry</DialogTitle>
                        <DialogDescription>
                          By entering, you confirm that you meet all the participation requirements.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                          {[
                            "I am a verified NUST student",
                            "I have followed the organizer",
                            "I have tagged 2 friends",
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Button onClick={handleEnter} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                          Confirm Entry
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Giveaway
                </Button>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {giveaway.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{giveaway.author.name}</p>
                        <p className="text-xs text-muted-foreground">Host</p>
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
