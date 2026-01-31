import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "product" | "trip" | "donation" | "ride" | "event" | "lost_found";
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
  product: { label: "Product", color: "bg-blue-100 text-blue-700", iconColor: "text-blue-500", href: "/marketplace" },
  trip: { label: "Trip", color: "bg-orange-100 text-orange-700", iconColor: "text-orange-500", href: "/trips" },
  donation: { label: "Donation", color: "bg-rose-100 text-rose-700", iconColor: "text-rose-500", href: "/donations" },
  giveaway: { label: "Giveaway", color: "bg-amber-100 text-amber-700", iconColor: "text-amber-500", href: "/giveaways" },
  ride: { label: "Ride", color: "bg-sky-100 text-sky-700", iconColor: "text-sky-500", href: "/carpooling" },
  event: { label: "Event", color: "bg-indigo-100 text-indigo-700", iconColor: "text-indigo-500", href: "/events" },
  lost_found: { label: "Lost & Found", color: "bg-slate-100 text-slate-700", iconColor: "text-slate-500", href: "/lost-found" },
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
  const config = typeConfig[type] || typeConfig.product;

  return (
    <Link to={`${config.href}/${id}`} className="block h-full">
      <Card className={cn("card-premium group overflow-hidden h-full flex flex-col bg-white/40 backdrop-blur-sm hover:bg-white", className)}>
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-human group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Badge className={cn("absolute top-5 left-5 border-none shadow-lg font-bold px-4 py-1.5 rounded-xl z-20", config.color)}>
            {config.label}
          </Badge>
          {price !== null && price !== undefined && (
            <div className="absolute bottom-5 right-5 z-20 animate-spring opacity-0 group-hover:opacity-100 transition-all">
              <span className="font-black text-lg bg-white px-4 py-1.5 rounded-xl shadow-xl text-primary border border-primary/10">
                Rs. {price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-7 flex-1">
          <h3 className="font-bold text-2xl line-clamp-1 group-hover:text-primary transition-colors mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground/80 line-clamp-2 font-medium leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap gap-5">
            {location && (
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                <MapPin className={cn("h-4 w-4", config.iconColor)} />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                <Calendar className={cn("h-4 w-4", config.iconColor)} />
                <span>{date}</span>
              </div>
            )}
          </div>

          {/* Progress bar for donations */}
          {type === "donation" && goal !== null && goal !== undefined && (
            <div className="mt-8 p-5 rounded-2xl bg-secondary/40 border border-border/40 shadow-inner">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="text-primary">
                  Rs. {(raised ?? 0).toLocaleString()} RAISED
                </span>
                <span className="text-muted-foreground opacity-50">
                  GOAL: Rs. {goal.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-background/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(var(--primary),0.3)]"
                  style={{ width: `${Math.min(((raised ?? 0) / goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-7 py-5 border-t border-border/40 flex items-center justify-between bg-secondary/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
              {author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-muted-foreground/70 tracking-wide">{author.name}</span>
          </div>
          <div className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-all">
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}