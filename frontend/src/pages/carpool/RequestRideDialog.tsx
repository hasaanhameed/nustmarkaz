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

interface RequestRideDialogProps {
  onRideCreated: () => void;
  autoOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function RequestRideDialog({
  onRideCreated,
  autoOpen = false,
  onOpenChange,
  children
}: RequestRideDialogProps) {
  const [open, setOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    ride_time: "",
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

  const validateTextInput = (value: string, fieldName: string): boolean => {
    if (!value.trim()) {
      toast.error(`${fieldName} cannot be empty.`);
      return false;
    }

    // Check if input contains only numbers
    if (/^\d+$/.test(value.trim())) {
      toast.error(`${fieldName} cannot contain only numbers.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date.");
      return;
    }

    // Validate locations
    if (!validateTextInput(formData.from_location, "Pickup location")) return;
    if (!validateTextInput(formData.to_location, "Destination location")) return;

    setIsLoading(true);
    try {
      const rideData: RideCreateRequest = {
        from_location: formData.from_location.trim(),
        to_location: formData.to_location.trim(),
        ride_date: format(date, "yyyy-MM-dd"),
        ride_time: formData.ride_time,
        contact: formData.contact,
      };

      await createRide(rideData);
      toast.success("Ride request posted successfully.");

      // Reset form
      setFormData({
        from_location: "",
        to_location: "",
        ride_time: "",
        contact: "",
      });
      setDate(undefined);
      handleOpenChange(false);

      // Show informational popup
      setShowSuccessPopup(true);

      onRideCreated();
    } catch (error) {
      toast.error("Failed to create ride request. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children || (
            <Button className="bg-primary text-primary-foreground">
              Request a Ride
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request a Ride</DialogTitle>
            <DialogDescription>
              Looking for a ride? Post your travel details and connect with drivers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="from">Pickup Location</Label>
                <Input
                  id="from"
                  placeholder="e.g., F-7, Bahria Town"
                  value={formData.from_location}
                  onChange={(e) =>
                    setFormData({ ...formData, from_location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="to">Destination</Label>
                <Input
                  id="to"
                  placeholder="e.g., NUST H-12, Blue Area"
                  value={formData.to_location}
                  onChange={(e) =>
                    setFormData({ ...formData, to_location: e.target.value })
                  }
                  required
                />
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
                {isLoading ? "Posting..." : "Post Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <AlertDialogContent className="rounded-2xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black italic text-primary">Request Posted!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium">
              Your ride request has been successfully posted.
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