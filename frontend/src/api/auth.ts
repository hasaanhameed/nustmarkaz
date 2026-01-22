import api from './api';

// Login API response type
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Function to log in a user
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password
    });
    return response.data;  // Return the access_token and token_type
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};
