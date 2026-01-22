import api from './api';

// User creation request type
interface UserCreateRequest {
  username: string;
  email: string;
  department: string;
  password: string;
}

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
