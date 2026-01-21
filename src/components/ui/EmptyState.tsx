import { LucideIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link to={actionHref}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
