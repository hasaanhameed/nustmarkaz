import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Car, Phone } from "lucide-react";
import { Ride } from "@/api/ride";

interface RideCardProps {
  ride: Ride;
}

export function RideCard({ ride }: RideCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardContent className="p-5 flex-1 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {ride.driver_id ? "D" : "?"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Driver #{ride.driver_id}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                {ride.vehicle_type === "Car" ? (
                  <Car className="h-3 w-3" />
                ) : (
                  <div className="font-bold text-[10px]">BIKE</div>
                )}
                <span>
                  {ride.vehicle_model} ({ride.vehicle_color})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pl-6 space-y-6 my-6">
          {/* Route Timeline Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="relative">
            <div className="absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-background" />
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                From
              </span>
              <p className="font-medium leading-none">{ride.from_location}</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 border-accent bg-background ring-4 ring-background" />
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                To
              </span>
              <p className="font-medium leading-none">{ride.to_location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{ride.ride_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{ride.ride_time}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/5 flex items-center justify-between">
        <div className="font-bold text-lg">Rs. {ride.price}</div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          {ride.contact}
        </div>
      </CardFooter>
    </Card>
  );
}
