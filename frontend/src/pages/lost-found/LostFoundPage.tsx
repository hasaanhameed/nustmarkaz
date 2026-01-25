
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockLostFoundItems, LostFoundItem, CAMPUS_LOCATIONS } from "@/data/mockLostFound";
import { LostFoundCard } from "./components/LostFoundCard";
import { CreateLostFoundDialog } from "./components/CreateLostFoundDialog";
import { toast } from "sonner";

export default function LostFoundPage() {
    const [items, setItems] = useState<LostFoundItem[]>(mockLostFoundItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesLocation = locationFilter === "All" || item.location === locationFilter;
        return matchesSearch && matchesCategory && matchesLocation;
    });

    const lostItems = filteredItems.filter((item) => item.type === "lost");
    const foundItems = filteredItems.filter((item) => item.type === "found");

    const handleAddItem = (newItem: Omit<LostFoundItem, "id" | "status">) => {
        const item: LostFoundItem = {
            ...newItem,
            id: `lf-${Date.now()}`,
            status: newItem.type === "lost" ? "LOST" : "FOUND",
        };
        setItems([item, ...items]);
        toast.success(`${newItem.type === "lost" ? "Lost" : "Found"} item posted successfully!`);
    };

    const handleClaimItem = (id: string) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, status: "CLAIMED" } : item
            )
        );
        toast.success("Item marked as claimed!");
    };

    return (
        <Layout>
            <div className="container-custom py-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lost & Found</h1>
                        <p className="text-muted-foreground mt-1">
                            Report lost items or help others find theirs.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CreateLostFoundDialog type="lost" onAdd={handleAddItem} />
                        <CreateLostFoundDialog type="found" onAdd={handleAddItem} />
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
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Locations</SelectItem>
                            {CAMPUS_LOCATIONS.map((loc) => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="lost" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
                        <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lost" className="mt-6">
                        {lostItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {lostItems.map((item) => (
                                    <LostFoundCard key={item.id} item={item} onClaim={handleClaimItem} />
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
                                    <LostFoundCard key={item.id} item={item} onClaim={handleClaimItem} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No found items matching your filters.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
