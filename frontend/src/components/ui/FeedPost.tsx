import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Plane, 
  Heart, 
  Calendar, 
  Car, 
  Package,
  ChevronRight,
  MapPin,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedPostProps {
  id: string;
  title: string;
  description: string;
  type: "product" | "trip" | "donation" | "event" | "ride" | "lost_found";
  price?: number | null;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt?: string;
  className?: string;
}

const typeConfig = {
  product: { 
    label: "Product", 
    color: "bg-accent/10 text-accent border-accent/20", 
    href: "/marketplace",
    icon: ShoppingBag,
    iconColor: "text-accent"
  },
  trip: { 
    label: "Trip", 
    color: "bg-success/10 text-success border-success/20", 
    href: "/trips",
    icon: Plane,
    iconColor: "text-success"
  },
  donation: { 
    label: "Donation", 
    color: "bg-warning/10 text-warning border-warning/20", 
    href: "/donations",
    icon: Heart,
    iconColor: "text-warning"
  },
  event: { 
    label: "Event", 
    color: "bg-primary/10 text-primary border-primary/20", 
    href: "/giveaways",
    icon: Calendar,
    iconColor: "text-primary"
  },
  ride: { 
    label: "Ride", 
    color: "bg-sky/10 text-sky border-sky/20", 
    href: "/carpooling/ride",
    icon: Car,
    iconColor: "text-sky"
  },
  lost_found: { 
    label: "Lost/Found", 
    color: "bg-purple/10 text-purple border-purple/20", 
    href: "/lost-found",
    icon: Package,
    iconColor: "text-purple"
  },
};

export function FeedPost({
  id,
  title,
  description,
  type,
  price,
  author,
  createdAt,
  className,
}: FeedPostProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  
  // Format timestamp
  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const posted = new Date(timestamp);
    const diffMs = now.getTime() - posted.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return posted.toLocaleDateString();
  };
  
  return (
    <Link to={`${config.href}/${id}`}>
      <div 
        className={cn(
          "group relative bg-card border border-border rounded-lg p-4 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer",
          className
        )}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Author Avatar */}
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-sm font-semibold border border-border">
              {author.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Author & Type Info */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate">
                  {author.name}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  posted
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs px-2 py-0 h-5 font-medium border", config.color)}
                >
                  <Icon className={cn("h-3 w-3 mr-1", config.iconColor)} />
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Price Badge (if applicable) */}
          {price !== null && price !== undefined && (
            <div className="flex-shrink-0 px-3 py-1.5 bg-muted rounded-md">
              <span className="font-bold text-sm">
                Rs. {price.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="mt-3 ml-11">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-accent transition-colors mb-1.5">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Footer - View Details Link */}
        <div className="mt-3 ml-11 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-accent transition-colors">
            <span className="font-medium">View details</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
        
        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-accent/20 transition-all duration-200 pointer-events-none" />
      </div>
    </Link>
  );
}