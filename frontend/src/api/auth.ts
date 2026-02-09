import api from './api';

// Login API response type
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Function to log in a user
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Use FormData for OAuth2 password flow
    const formData = new FormData();
    formData.append('username', email);  // OAuth2 uses 'username' field
    formData.append('password', password);

    const response = await api.post<LoginResponse>('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const socialLogin = async (email: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/authentication/login/social', { email });
    return response.data;
  } catch (error) {
    console.error("Social login check failed", error);
    throw error;
  }
};