import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDonations } from "@/data/mockData";
import { ArrowLeft, Share2, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const donationAmounts = [500, 1000, 2000, 5000];

export default function DonationDetailPage() {
  const { id } = useParams();
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  
  const donation = mockDonations.find((d) => d.id === id) || mockDonations[0];
  const progress = ((donation.raised ?? 0) / (donation.goal ?? 1)) * 100;

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount);
    console.log("Donating:", { donationId: id, amount });
    setIsDonateOpen(false);
  };

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
              <img src={donation.image} alt={donation.title} className="w-full h-full object-cover" />
            </div>

            <Badge className="bg-warning text-warning-foreground mb-4">Donation Drive</Badge>
            <h1 className="text-3xl font-bold mb-4">{donation.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>45 donors</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>15 days left</span>
              </div>
            </div>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-3">About This Drive</h2>
              <p className="text-muted-foreground leading-relaxed">{donation.description}</p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Your contribution will directly help those in need. All donations are tracked and a complete 
                breakdown of how funds are used will be shared with all donors.
              </p>
            </div>

            {/* Updates */}
            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">Recent Updates</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">2 days ago</p>
                    <p>We've reached 50% of our goal! Thank you to all 30 donors who have contributed so far.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">5 days ago</p>
                    <p>Drive launched! Help us reach our goal to support the community.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold">Rs. {donation.raised?.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">of Rs. {donation.goal?.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% funded</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Donate Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make a Donation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={selectedAmount === amount ? "bg-accent text-accent-foreground" : ""}
                          >
                            Rs. {amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label>Or enter custom amount</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                        />
                      </div>
                      <Button 
                        onClick={handleDonate} 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        disabled={!selectedAmount && !customAmount}
                      >
                        Donate Rs. {(selectedAmount || parseInt(customAmount) || 0).toLocaleString()}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Drive
                </Button>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {donation.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{donation.author.name}</p>
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
