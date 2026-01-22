import axios from 'axios';

// Use VITE_BASE_URL from the .env file
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (to add the JWT token if available in localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Assuming token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define the API methods

// Login API response type
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// User API request type
interface UserCreateRequest {
  username: string;
  email: string;
  department: string;
  password: string;
}

// Function to log in a user
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password,
    });
    return response.data;  // Returns the access_token and token_type
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Function to create a new user
export const createUser = async (userData: UserCreateRequest) => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;  // Return the newly created user
  } catch (error) {
    console.error("User creation failed", error);
    throw error;
  }
};

export default api;
