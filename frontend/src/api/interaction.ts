import api from "./api";

export interface Creator {
  id?: number;
  username: string;
  email?: string;
}

export interface ActivityItem {
  id: number;
  type: "product" | "trip" | "donation" | "event" | "ride" | "lost_found";
  title: string;
  price?: number;
  cost_per_person?: number;
  goal_amount?: number;
  category?: string;
  destination?: string;
  beneficiary?: string;
  society?: string;
  location?: string;
  from_location?: string;
  to_location?: string;
  type_?: string;
  image?: string;
  creator: Creator;
}

export interface UserInteractionCreate {
  item_id: number;
  item_type: string;
}

export interface UserInteractionResponse {
  id: number;
  user_id: number;
  item_id: number;
  item_type: string;
  created_at: string;
}

// Record a click/interaction when user clicks on an item
export const recordInteraction = async (
  itemId: number,
  itemType: string
): Promise<UserInteractionResponse> => {
  try {
    const response = await api.post<UserInteractionResponse>(
      "/interactions/click",
      {
        item_id: itemId,
        item_type: itemType,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to record interaction:", error);
    throw error;
  }
};

// Get recent clicked items for current user
export const getRecentActivityItems = async (
  limit: number = 10
): Promise<ActivityItem[]> => {
  try {
    const response = await api.get<ActivityItem[]>(
      "/interactions/user/recent-items",
      {
        params: { limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent activity items:", error);
    throw error;
  }
};
