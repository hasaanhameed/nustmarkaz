import api from "./api";

// User creation request type
interface UserCreateRequest {
  username: string;
  email: string;
  department: string;
  password: string;
}

// User response type
export interface User {
  id: number;
  username: string;
  email: string;
  department: string;
}

// Function to create a new user
export const createUser = async (userData: UserCreateRequest) => {
  try {
    console.log("API Base URL:", import.meta.env.VITE_BASE_URL);
    console.log("Calling endpoint: /users/");
    console.log("With data:", userData);

    const response = await api.post("/users/", userData);
    return response.data;
  } catch (error: any) {
    console.error("User creation failed", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw error;
  }
};

// Function to get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    const response = await api.get<User>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Failed to get current user", error);
    return null;
  }
};

// Add at the end of the file:

export interface UserProfile {
  user: User;
  products: any[];
  trips: any[];
  donations: any[];
  events: any[];
  lost_found_items: any[];
}
export const getUserProfile = async (): Promise<UserProfile> => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Fetch all user's listings in parallel with error handling
  const [products, trips, donations, events, lostFoundItems] = await Promise.all([
    api.get(`/products/`).then(res => res.data.filter((p: any) => p.creator_id === user.id)).catch(() => []),
    api.get(`/trips/`).then(res => res.data.filter((t: any) => t.creator_id === user.id)).catch(() => []),
    api.get(`/donations/`).then(res => res.data.filter((d: any) => d.creator_id === user.id)).catch(() => []),
    api.get(`/events/`).then(res => res.data.filter((e: any) => e.creator_id === user.id)).catch(() => []),
    api.get(`/lost-found/`).then(res => res.data.filter((lf: any) => lf.creator_id === user.id)).catch(() => []),
  ]);

  return {
    user,
    products,
    trips,
    donations,
    events,
    lost_found_items: lostFoundItems,
  };
};