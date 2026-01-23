import api from "./api";

// Trip image type
interface TripImage {
  id: number;
  image_path: string;
  trip_id: number;
}

// Trip type
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
  creator_id: number;
  images: TripImage[];
}

// Trip creation request type
export interface TripCreateRequest {
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  departure_location: string;
  max_participants: number;
  cost_per_person: number;
  image_paths?: string[];
}

// Function to create a new trip
export const createTrip = async (tripData: TripCreateRequest): Promise<Trip> => {
  try {
    const response = await api.post<Trip>("/trips/", tripData);
    return response.data;
  } catch (error: any) {
    console.error("Trip creation failed", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Function to get all trips
export const getAllTrips = async (): Promise<Trip[]> => {
  try {
    const response = await api.get<Trip[]>("/trips");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trips", error);
    throw error;
  }
};

// Function to get a single trip by ID
export const getTripById = async (id: string | number): Promise<Trip> => {
  try {
    const response = await api.get<Trip>(`/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trip", error);
    throw error;
  }
};