
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CAMPUS_LOCATIONS, CITY_LOCATIONS, Ride } from "@/data/mockCarpool";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface OfferRideDialogProps {
    onAdd: (ride: Omit<Ride, "id" | "driver">) => void;
}

export function OfferRideDialog({ onAdd }: OfferRideDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        time: "",
        seats: "3",
        vehicleType: "Car",
        vehicleModel: "",
        vehicleColor: "",
        price: "",
        contact: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            from: formData.from,
            to: formData.to,
            date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            time: formData.time,
            availableSeats: parseInt(formData.seats),
            totalSeats: parseInt(formData.seats),
            vehicle: {
                type: formData.vehicleType as "Car" | "Bike",
                model: formData.vehicleModel,
                color: formData.vehicleColor,
            },
            price: parseInt(formData.price),
            contact: formData.contact,
        });
        setOpen(false);
        // Reset form logic simpler for now
    };

    const allLocations = [...CAMPUS_LOCATIONS, ...CITY_LOCATIONS].sort();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">Offer a Ride</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Offer a Ride</DialogTitle>
                    <DialogDescription>
                        Share your commute and split the cost with other students.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="from">From</Label>
                            <Select onValueChange={(v) => setFormData({ ...formData, from: v })} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Origin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allLocations.map((loc) => (
                                        <SelectItem key={`from-${loc}`} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="to">To</Label>
                            <Select onValueChange={(v) => setFormData({ ...formData, to: v })} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allLocations.map((loc) => (
                                        <SelectItem key={`to-${loc}`} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t my-2" />
                    <h4 className="font-medium text-sm text-muted-foreground">Vehicle Details</h4>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <Label>Type</Label>
                            <Select
                                defaultValue="Car"
                                onValueChange={(v) => setFormData({ ...formData, vehicleType: v, seats: v === "Bike" ? "1" : "3" })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Car">Car</SelectItem>
                                    <SelectItem value="Bike">Bike</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1">
                            <Label>Model</Label>
                            <Input
                                placeholder="Civic, Alto..."
                                value={formData.vehicleModel}
                                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <Label>Color</Label>
                            <Input
                                placeholder="White, Black..."
                                value={formData.vehicleColor}
                                onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="seats">Avail. Seats</Label>
                            <Select
                                value={formData.seats}
                                onValueChange={(v) => setFormData({ ...formData, seats: v })}
                                disabled={formData.vehicleType === "Bike"}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Seat</SelectItem>
                                    <SelectItem value="2">2 Seats</SelectItem>
                                    <SelectItem value="3">3 Seats</SelectItem>
                                    <SelectItem value="4">4 Seats</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (Rs.)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="200"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input
                            id="contact"
                            placeholder="03XX-XXXXXXX"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full">Post Ride</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
