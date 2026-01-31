import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/api/donation";
import { format } from "date-fns";
import { Share2 } from "lucide-react";

interface DonationPostProps {
  donation: Donation;
}

export function DonationPost({ donation }: DonationPostProps) {
  const endDate = new Date(donation.end_date);
  const today = new Date();
  const daysLeft = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isActive = daysLeft > 0;

  return (
    <Link
      to={`/donations/${donation.id}`}
      className="no-underline hover:no-underline"
    >
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary">
        {/* Header with Creator Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
              {donation.creator.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">
                {donation.creator.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {donation.creator.department}
              </p>
            </div>
          </div>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-primary text-primary-foreground" : ""}
          >
            {isActive ? `${daysLeft}d left` : "Ended"}
          </Badge>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2 text-foreground hover:text-primary transition-colors">
            {donation.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {donation.description}
          </p>
        </div>

        {/* Beneficiary Info */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">FOR</p>
          <p className="font-semibold text-sm">{donation.beneficiary}</p>
        </div>

        {/* Goal Amount */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Goal Amount</p>
            <p className="text-2xl font-bold text-primary">
              Rs. {donation.goal_amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Ends on</p>
            <p className="text-sm font-medium">{format(endDate, "MMM dd")}</p>
          </div>
        </div>

        {/* Footer with Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Click to learn more</p>
          <Share2 className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        </div>
      </Card>
    </Link>
  );
}
