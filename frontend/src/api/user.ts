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