import api from "./api";

// Dashboard Types
export interface DashboardCard {
  id: number;
  type: 'product' | 'trip' | 'event' | 'ride' | 'donation' | 'lost_found';
  title: string;
  subtitle?: string;
  price?: number;
  image?: string;
  creator_username: string;
  created_at: string;
}

/**
 * Fetch the latest posts from all categories
 * @param limit - Maximum number of posts to return (default: 20)
 * @returns Promise with array of DashboardCard objects
 */
export const getLatestPosts = async (
  limit: number = 20
): Promise<DashboardCard[]> => {
  try {
    const response = await api.get<DashboardCard[]>("/dashboard/latest", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    throw error;
  }
};

/**
 * Get the appropriate icon or emoji for each post type
 */
export const getPostTypeIcon = (type: DashboardCard['type']): string => {
  const icons = {
    product: '🛍️',
    trip: '✈️',
    event: '🎉',
    ride: '🚗',
    donation: '💝',
    lost_found: '🔍',
  };
  return icons[type] || '📌';
};

/**
 * Get the appropriate label for each post type
 */
export const getPostTypeLabel = (type: DashboardCard['type']): string => {
  const labels = {
    product: 'Product',
    trip: 'Trip',
    event: 'Event',
    ride: 'Ride',
    donation: 'Donation',
    lost_found: 'Lost & Found',
  };
  return labels[type] || 'Post';
};

/**
 * Format price for display
 */
export const formatPrice = (price?: number): string => {
  if (price === null || price === undefined) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Get the route URL for a specific post type
 */
export const getPostRoute = (card: DashboardCard): string => {
  const routes = {
    product: `/products/${card.id}`,
    trip: `/trips/${card.id}`,
    event: `/events/${card.id}`,
    ride: `/rides/${card.id}`,
    donation: `/donations/${card.id}`,
    lost_found: `/lost-found/${card.id}`,
  };
  return routes[card.type] || '#';
};