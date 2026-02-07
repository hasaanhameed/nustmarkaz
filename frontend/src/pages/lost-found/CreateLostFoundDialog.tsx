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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createLostFoundItem } from "@/api/lostFound";
import { toast } from "sonner";

interface CreateLostFoundDialogProps {
    type: "lost" | "found";
    onSuccess: () => void;
    autoOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CreateLostFoundDialog({ type, onSuccess, autoOpen = false, onOpenChange }: CreateLostFoundDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
        contactMethod: "phone",
        contactInfo: "",
        image: "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error("Please upload an image.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createLostFoundItem({
                title: formData.title,
                category: formData.category,
                description: formData.description,
                location: formData.location,
                date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
                image_path: formData.image,
                contact_method: formData.contactMethod,
                contact_info: formData.contactInfo,
                type,
            });

            toast.success("Post Active", {
                description: `Your ${type === "lost" ? "lost" : "found"} item report has been successfully posted. To keep the board relevant, please note that your post will be automatically removed in 7 days.`
            });
            handleOpenChange(false);
            onSuccess();

            // Reset form
            setFormData({
                title: "",
                category: "",
                description: "",
                location: "",
                contactMethod: "phone",
                contactInfo: "",
                image: "",
            });
            setDate(undefined);
        } catch (error) {
            console.error("Error creating item:", error);
            toast.error("Failed to post item. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Label htmlFor="title">Item Name *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g., Blue Water Bottle"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
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
                        <Label htmlFor="location">Campus Location *</Label>
                        <Input
                            id="location"
                            placeholder="e.g., SEECS, C1, Library"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Date *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
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
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            placeholder="Unique features, color, brand, etc."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Image *</Label>
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" className="w-full relative overflow-hidden">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    required
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
                                defaultValue="phone"
                                onValueChange={(v) => setFormData({ ...formData, contactMethod: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phone">Phone</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="contact">Contact Info *</Label>
                            <Input
                                id="contact"
                                type={formData.contactMethod === "email" ? "email" : "text"}
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                required
                                placeholder={
                                    formData.contactMethod === "email"
                                        ? "your.email@example.com"
                                        : formData.contactMethod === "whatsapp"
                                            ? "0300-XXXXXXX (WhatsApp)"
                                            : "0300-XXXXXXX"
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
