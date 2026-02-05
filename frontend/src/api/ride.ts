import api from "./api";

export interface Requester {
  id: number;
  username: string;
  email: string;
}

export interface Ride {
  id: number;
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  contact: string;
  requester_id: number;
  created_at: string;
  updated_at: string;
  requester?: Requester;
}

export interface RideCreateRequest {
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  contact: string;
}

// Get all ride requests with pagination
export const getAllRides = async (
  skip: number = 0,
  limit: number = 100,
): Promise<Ride[]> => {
  try {
    const response = await api.get<Ride[]>("/rides/", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ride requests:", error);
    throw error;
  }
};

// Get current user's ride requests
export const getMyRides = async (
  skip: number = 0,
  limit: number = 10,
): Promise<Ride[]> => {
  try {
    const response = await api.get<Ride[]>("/rides/me", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my ride requests:", error);
    throw error;
  }
};

// Get a single ride request by ID
export const getRideById = async (rideId: number): Promise<Ride> => {
  try {
    const response = await api.get<Ride>(`/rides/${rideId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ride request ${rideId}:`, error);
    throw error;
  }
};

// Create a new ride request
export const createRide = async (
  rideData: RideCreateRequest,
): Promise<Ride> => {
  try {
    const response = await api.post<Ride>("/rides/", rideData);
    return response.data;
  } catch (error) {
    console.error("Failed to create ride request:", error);
    throw error;
  }
};

// Update a ride request
export const updateRide = async (
  rideId: number,
  rideData: Partial<RideCreateRequest>,
): Promise<Ride> => {
  try {
    const response = await api.put<Ride>(`/rides/${rideId}`, rideData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ride request ${rideId}:`, error);
    throw error;
  }
};

// Delete a ride request
export const deleteRide = async (rideId: number): Promise<void> => {
  try {
    await api.delete(`/rides/${rideId}`);
  } catch (error) {
    console.error(`Failed to delete ride request ${rideId}:`, error);
    throw error;
  }
};