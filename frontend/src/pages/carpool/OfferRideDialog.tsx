import { useState, useEffect } from "react";
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
import { CAMPUS_LOCATIONS, CITY_LOCATIONS } from "@/data/mockCarpool";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createRide, RideCreateRequest } from "@/api/ride";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OfferRideDialogProps {
  onRideCreated: () => void;
  autoOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function OfferRideDialog({
  onRideCreated,
  autoOpen = false,
  onOpenChange,
  children
}: OfferRideDialogProps) {
  const [open, setOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    ride_time: "",
    vehicle_type: "Car",
    vehicle_model: "",
    vehicle_color: "",
    price: "",
    contact: "",
  });

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!formData.from_location || !formData.to_location) {
      toast.error("Please select both origin and destination");
      return;
    }

    setIsLoading(true);
    try {
      const rideData: RideCreateRequest = {
        from_location: formData.from_location,
        to_location: formData.to_location,
        ride_date: format(date, "yyyy-MM-dd"),
        ride_time: formData.ride_time,
        vehicle_type: formData.vehicle_type,
        vehicle_model: formData.vehicle_model,
        vehicle_color: formData.vehicle_color,
        price: parseFloat(formData.price),
        contact: formData.contact,
      };

      await createRide(rideData);
      toast.success("Ride posted successfully!");

      // Reset form
      setFormData({
        from_location: "",
        to_location: "",
        ride_time: "",
        vehicle_type: "Car",
        vehicle_model: "",
        vehicle_color: "",
        price: "",
        contact: "",
      });
      setDate(undefined);
      handleOpenChange(false);

      // Show informational popup
      setShowSuccessPopup(true);

      onRideCreated();
    } catch (error) {
      toast.error("Failed to create ride. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const allLocations = [...CAMPUS_LOCATIONS, ...CITY_LOCATIONS].sort();

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children || (
            <Button className="bg-primary text-primary-foreground">
              Offer a Ride
            </Button>
          )}
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
                <Select
                  value={formData.from_location}
                  onValueChange={(v) =>
                    setFormData({ ...formData, from_location: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocations.map((loc) => (
                      <SelectItem key={`from-${loc}`} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="to">To</Label>
                <Select
                  value={formData.to_location}
                  onValueChange={(v) =>
                    setFormData({ ...formData, to_location: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocations.map((loc) => (
                      <SelectItem key={`to-${loc}`} value={loc}>
                        {loc}
                      </SelectItem>
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
                        !date && "text-muted-foreground",
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
                  value={formData.ride_time}
                  onChange={(e) =>
                    setFormData({ ...formData, ride_time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="border-t my-2" />
            <h4 className="font-medium text-sm text-muted-foreground">
              Vehicle Details
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Label>Type</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, vehicle_type: v })
                  }
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
                  value={formData.vehicle_model}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_model: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <Label>Color</Label>
                <Input
                  placeholder="White, Black..."
                  value={formData.vehicle_color}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_color: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input
                id="price"
                type="number"
                placeholder="200"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="03XX-XXXXXXX"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Ride"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <AlertDialogContent className="rounded-2xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black italic text-primary">Ride Live!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium">
              Your ride offer has been successfully posted.
              To keep the carpool listings fresh and accurate, please note that **your post will be automatically taken down in 1 hour**.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="h-12 px-8 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}