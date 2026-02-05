import api from "./api";

export interface Driver {
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
  vehicle_type: string;
  vehicle_model: string;
  vehicle_color: string;
  price: number;
  contact: string;
  driver_id: number;
  created_at: string;
  updated_at: string;
  driver?: Driver;
}

export interface RideCreateRequest {
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_color: string;
  price: number;
  contact: string;
}

// Get all rides with pagination
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
    console.error("Failed to fetch rides:", error);
    throw error;
  }
};

// Get current user's rides
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
    console.error("Failed to fetch my rides:", error);
    throw error;
  }
};

// Get a single ride by ID
export const getRideById = async (rideId: number): Promise<Ride> => {
  try {
    const response = await api.get<Ride>(`/rides/${rideId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ride ${rideId}:`, error);
    throw error;
  }
};

// Create a new ride
export const createRide = async (
  rideData: RideCreateRequest,
): Promise<Ride> => {
  try {
    const response = await api.post<Ride>("/rides/", rideData);
    return response.data;
  } catch (error) {
    console.error("Failed to create ride:", error);
    throw error;
  }
};

// Update a ride
export const updateRide = async (
  rideId: number,
  rideData: Partial<RideCreateRequest>,
): Promise<Ride> => {
  try {
    const response = await api.put<Ride>(`/rides/${rideId}`, rideData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ride ${rideId}:`, error);
    throw error;
  }
};

// Delete a ride
export const deleteRide = async (rideId: number): Promise<void> => {
  try {
    await api.delete(`/rides/${rideId}`);
  } catch (error) {
    console.error(`Failed to delete ride ${rideId}:`, error);
    throw error;
  }
};