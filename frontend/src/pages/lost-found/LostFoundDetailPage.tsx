import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Phone, Mail, MessageCircle, Pencil, Trash2 } from "lucide-react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getLostFoundItemById, deleteLostFoundItem, LostFoundItem } from "@/api/lostFound";
import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Item ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const itemData = await getLostFoundItemById(parseInt(id));
        setItem(itemData);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8 flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <Link
            to="/lost-found"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lost & Found
          </Link>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Item not found"}</p>
            <Link to="/lost-found">
              <Button variant="outline">Back to Lost & Found</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

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

  const formattedDate = format(new Date(item.date), "PPP");
  const isLost = item.type === "lost";
  const isOwner = currentUser?.id === item.creator_id;

  const handleDelete = async () => {
    if (!item) return;

    try {
      setIsDeleting(true);
      await deleteLostFoundItem(item.id);
      toast.success("Item deleted successfully.");
      navigate("/lost-found");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Back button */}
        <Link
          to="/lost-found"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lost & Found
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-muted relative">
              {item.image_path ? (
                <img
                  src={item.image_path}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                  <Tag className="h-24 w-24 opacity-20" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex gap-2 mb-4">
              <Badge className={cn(statusColors[item.status])}>
                {item.status}
              </Badge>
              <Badge variant="secondary">
                {item.category}
              </Badge>
              <Badge variant={isLost ? "destructive" : "default"}>
                {isLost ? "Lost Item" : "Found Item"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold mb-6">{item.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="border-t border-b border-border py-6 mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Posted By */}
            <Card className="mb-6 bg-muted/30">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Posted By
                </h3>
                <div className="space-y-1">
                  <p className="font-medium">{item.creator.username}</p>
                  <p className="text-sm text-muted-foreground">{item.creator.department}</p>
                  <p className="text-sm text-muted-foreground">{item.creator.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="flex items-center gap-2 text-lg mb-2">
                  <ContactIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium capitalize">{item.contact_method}</span>
                </div>
                <p className="font-medium text-lg mb-2">{item.contact_info}</p>
                <p className="text-sm text-muted-foreground">
                  {isLost 
                    ? "If you found this item, please contact the owner using the information above."
                    : "If this is your item, please contact the finder using the information above."}
                </p>
              </CardContent>
            </Card>

            {/* Edit/Delete Actions - Only for owner */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                  onClick={() => navigate(`/lost-found/edit/${item.id}`)}
                  className="flex-1 gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1 gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this item? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Help Message */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Please verify ownership details before claiming or returning any item. 
                  Stay safe and meet in public places when exchanging items.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
