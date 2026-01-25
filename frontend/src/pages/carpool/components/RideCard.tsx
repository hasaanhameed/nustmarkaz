
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Users, Car, Phone } from "lucide-react";
import { Ride } from "@/data/mockCarpool";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface RideCardProps {
    ride: Ride;
    onJoin: (id: string) => void;
}

export function RideCard({ ride, onJoin }: RideCardProps) {
    const isFull = ride.availableSeats === 0;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardContent className="p-5 flex-1 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {ride.driver.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{ride.driver.name}</h3>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                {ride.vehicle.type === "Car" ? <Car className="h-3 w-3" /> : <div className="font-bold text-[10px]">BIKE</div>}
                                <span>{ride.vehicle.model} ({ride.vehicle.color})</span>
                            </div>
                        </div>
                    </div>
                    <Badge variant={isFull ? "destructive" : "secondary"}>
                        {isFull ? "FULL" : `${ride.availableSeats} seats left`}
                    </Badge>
                </div>

                <div className="relative pl-6 space-y-6 my-6">
                    {/* Route Timeline Line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

                    <div className="relative">
                        <div className="absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-background" />
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">From</span>
                            <p className="font-medium leading-none">{ride.from}</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 border-accent bg-background ring-4 ring-background" />
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">To</span>
                            <p className="font-medium leading-none">{ride.to}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{ride.time}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t bg-muted/5 flex items-center justify-between">
                <div className="font-bold text-lg">
                    Rs. {ride.price}
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={isFull} className={isFull ? "opacity-50" : ""}>
                            {isFull ? "Ride Full" : "Join Ride"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Join {ride.driver.name}'s Ride</DialogTitle>
                            <DialogDescription>
                                Confirm your booking for this ride.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="flex flex-col gap-2 p-4 bg-muted rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Route</span>
                                    <span className="font-medium text-right">{ride.from} ➔ {ride.to}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time</span>
                                    <span className="font-medium">{ride.date} at {ride.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vehicle</span>
                                    <span className="font-medium">{ride.vehicle.model}</span>
                                </div>
                                <div className="border-t my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>Rs. {ride.price}</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => onJoin(ride.id)}>Confirm Booking</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
