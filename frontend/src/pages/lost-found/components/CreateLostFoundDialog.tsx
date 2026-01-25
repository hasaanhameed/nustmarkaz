
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CAMPUS_LOCATIONS, LostFoundItem } from "@/data/mockLostFound";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CreateLostFoundDialogProps {
    type: "lost" | "found";
    onAdd: (item: Omit<LostFoundItem, "id" | "status">) => void;
}

export function CreateLostFoundDialog({ type, onAdd }: CreateLostFoundDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
        contactType: "Phone",
        contactValue: "",
        image: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            title: formData.title,
            category: formData.category as any,
            description: formData.description,
            location: formData.location,
            date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            image: formData.image || undefined,
            type,
            contact: {
                type: formData.contactType as any,
                value: formData.contactValue,
            },
        });
        setOpen(false);
        // Reset form
        setFormData({
            title: "",
            category: "",
            description: "",
            location: "",
            contactType: "Phone",
            contactValue: "",
            image: "",
        });
        setDate(undefined);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={type === "lost" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-success text-success-foreground hover:bg-success/90"}>
                    {type === "lost" ? "Report Lost Item" : "Report Found Item"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{type === "lost" ? "Report a Lost Item" : "Report a Found Item"}</DialogTitle>
                    <DialogDescription>
                        Fill in the details to help us reunite items with their owners.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Item Name</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g., Blue Water Bottle"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, category: v })} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Books">Books</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="ID Cards">ID Cards</SelectItem>
                                <SelectItem value="Clothing">Clothing</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="location">Campus Location</Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, location: v })} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Where was it?" />
                            </SelectTrigger>
                            <SelectContent>
                                {CAMPUS_LOCATIONS.map((loc) => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            placeholder="Unique features, color, brand, etc."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" className="w-full relative overflow-hidden">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                            {formData.image && (
                                <div className="h-10 w-10 shrink-0 rounded overflow-hidden border">
                                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <Label>Method</Label>
                            <Select
                                defaultValue="Phone"
                                onValueChange={(v) => setFormData({ ...formData, contactType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Phone">Phone</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Chat">Chat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="contact">Contact Info</Label>
                            <Input
                                id="contact"
                                value={formData.contactValue}
                                onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                                required
                                placeholder="0300-XXXXXXX"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Post Item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
