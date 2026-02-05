import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Tag, Phone, Mail, MessageCircle } from "lucide-react";
import { LostFoundItem } from "@/api/lostFound";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface LostFoundCardProps {
    item: LostFoundItem;
}

export function LostFoundCard({ item }: LostFoundCardProps) {

    const statusColors = {
        LOST: "bg-destructive text-destructive-foreground",
        FOUND: "bg-success text-success-foreground",
        CLAIMED: "bg-muted text-muted-foreground",
    };

    const ContactIcon = {
        email: Mail,
        phone: Phone,
        whatsapp: MessageCircle,
    }[item.contact_method];

    // Format date
    const formattedDate = format(new Date(item.date), "PPP");

    return (
        <Link to={`/lost-found/${item.id}`}>
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative aspect-video overflow-hidden bg-muted">
                {item.image_path ? (
                    <img
                        src={item.image_path}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                        <Tag className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <Badge className={cn("absolute top-3 left-3", statusColors[item.status])}>
                    {item.status}
                </Badge>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-background/80 backdrop-blur">
                    {item.category}
                </Badge>
            </div>

            <CardContent className="p-4 flex-1">
                <h3 className="font-semibold text-lg line-clamp-1 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ContactIcon className="h-4 w-4 shrink-0" />
                        <span className="capitalize">{item.contact_method}: {item.contact_info}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        </Link>
    );
}