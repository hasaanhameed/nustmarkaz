import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LostFoundCard } from "@/components/ui/LostFoundCard";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { CreateLostFoundDialog } from "./CreateLostFoundDialog";
import { toast } from "sonner";
import { getAllLostFoundItems, LostFoundItem } from "@/api/lostFound";

export default function LostFoundPage() {
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [autoOpenLost, setAutoOpenLost] = useState(false);
    const [autoOpenFound, setAutoOpenFound] = useState(false);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const data = await getAllLostFoundItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to load items.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();

        // Check URL parameters for auto-opening dialogs
        const action = searchParams.get("action");
        if (action === "lost") {
            setAutoOpenLost(true);
        } else if (action === "found") {
            setAutoOpenFound(true);
        }
    }, [searchParams]);

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesSearch && matchesCategory && matchesLocation;
    });

    const lostItems = filteredItems.filter((item) => item.type === "lost");
    const foundItems = filteredItems.filter((item) => item.type === "found");

    return (
        <Layout>
            <div className="container-custom py-8 space-y-8">
                {/* Header Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 animate-entrance">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Lost & Found
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 text-balance">
                        Connect with the community to recover your lost belongings or help others find theirs. Reporting is fast and verified.
                    </p>
                    <div className="flex justify-center gap-4">
                        <CreateLostFoundDialog
                            type="lost"
                            onSuccess={fetchItems}
                            autoOpen={autoOpenLost}
                            onOpenChange={(open) => {
                                if (!open) setAutoOpenLost(false);
                            }}
                        />
                        <CreateLostFoundDialog
                            type="found"
                            onSuccess={fetchItems}
                            autoOpen={autoOpenFound}
                            onOpenChange={(open) => {
                                if (!open) setAutoOpenFound(false);
                            }}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="bg-background rounded-lg border flex items-center px-3 col-span-1 md:col-span-2">
                        <Search className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                            placeholder="Search items..."
                            className="border-0 focus-visible:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Books">Books</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="ID Cards">ID Cards</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Location"
                        className="bg-background"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <PageLoader />
                ) : (
                    <Tabs defaultValue="lost" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
                            <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="lost" className="mt-6">
                            {lostItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {lostItems.map((item) => (
                                        <LostFoundCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No lost items matching your filters.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="found" className="mt-6">
                            {foundItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {foundItems.map((item) => (
                                        <LostFoundCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No found items matching your filters.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </Layout>
    );
}