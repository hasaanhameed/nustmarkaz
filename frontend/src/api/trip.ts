import api from "./api";

export interface TripImage {
  id: number;
  image_path: string;
  trip_id: number;
}

export interface Creator {
  id: number;
  username: string;
  email: string;
  department: string;
}

export interface Trip {
  id: number;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  departure_location: string;
  max_participants: number;
  cost_per_person: number;
  contact_number: string;
  creator_id: number;
  images: TripImage[];
  creator: Creator;
}

export interface TripCreateRequest {
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  departure_location: string;
  max_participants: number;
  cost_per_person: number;
  contact_number: string;
  image_paths?: string[];
}

// Get all trips
export const getAllTrips = async (
  skip: number = 0,
  limit: number = 100,
): Promise<Trip[]> => {
  try {
    const response = await api.get<Trip[]>("/trips/", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    throw error;
  }
};

// Get current user's trips
export const getMyTrips = async (
  skip: number = 0,
  limit: number = 10,
): Promise<Trip[]> => {
  try {
    const response = await api.get<Trip[]>("/trips/me", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my trips:", error);
    throw error;
  }
};

// Get a single trip by ID
export const getTripById = async (tripId: string): Promise<Trip> => {
  try {
    const response = await api.get<Trip>(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch trip ${tripId}:`, error);
    throw error;
  }
};

// Create a new trip
export const createTrip = async (
  tripData: TripCreateRequest,
): Promise<Trip> => {
  try {
    const response = await api.post<Trip>("/trips/", tripData);
    return response.data;
  } catch (error) {
    console.error("Failed to create trip:", error);
    throw error;
  }
};

// Update a trip
// Update a trip
export const updateTrip = async (
  tripId: number,
  tripData: Partial<TripCreateRequest>,
): Promise<Trip> => {
  try {
    const response = await api.put<Trip>(`/trips/${tripId}`, tripData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (tripId: number): Promise<void> => {
  try {
    await api.delete(`/trips/${tripId}`);
  } catch (error) {
    console.error(`Failed to delete trip ${tripId}:`, error);
    throw error;
  }
};