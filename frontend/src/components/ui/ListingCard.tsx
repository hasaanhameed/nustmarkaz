import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "product" | "trip" | "donation" | "giveaway" | "ride" | "event" | "lost_found";
  price?: number | null;
  location?: string;
  date?: string;
  spots?: number;
  spotsLeft?: number;
  goal?: number | null;
  raised?: number | null;
  endsIn?: string;
  author: {
    name: string;
    avatar?: string;
  };
  className?: string;
}

const typeConfig = {
  product: { label: "Product", color: "bg-accent text-accent-foreground", href: "/marketplace" },
  trip: { label: "Trip", color: "bg-success text-success-foreground", href: "/trips" },
  donation: { label: "Donation", color: "bg-warning text-warning-foreground", href: "/donations" },
  giveaway: { label: "Giveaway", color: "bg-primary text-primary-foreground", href: "/giveaways" },
  ride: { label: "Ride", color: "bg-sky text-sky-foreground", href: "/carpooling" },
  event: { label: "Event", color: "bg-primary text-primary-foreground", href: "/giveaways" },
  lost_found: { label: "Lost/Found", color: "bg-purple text-purple-foreground", href: "/lost-found" },
};

export function ListingCard({
  id,
  title,
  description,
  image,
  type,
  price,
  location,
  date,
  spots,
  spotsLeft,
  goal,
  raised,
  endsIn,
  author,
  className,
}: ListingCardProps) {
  const config = typeConfig[type];
  
  return (
    <Link to={`${config.href}/${id}`}>
      <Card className={cn("overflow-hidden card-hover group cursor-pointer h-full", className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className={cn("absolute top-3 left-3", config.color)}>
            {config.label}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{date}</span>
              </div>
            )}
            {spots && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{spotsLeft ?? spots} spots</span>
              </div>
            )}
            {endsIn && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Ends {endsIn}</span>
              </div>
            )}
          </div>
          
          {/* Progress bar for donations */}
          {type === "donation" && goal !== null && goal !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">
                  Rs. {(raised ?? 0).toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  of Rs. {goal.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min(((raised ?? 0) / goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
          {price !== null && price !== undefined && (
            <span className="font-semibold text-foreground">
              Rs. {price.toLocaleString()}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}