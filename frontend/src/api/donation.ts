import api from "./api";

export interface Creator {
  id: number;
  username: string;
  email: string;
  department: string;
}

export interface DonationImage {
  id: number;
  image_path: string;
  donation_id: number;
}

export interface Donation {
  id: number;
  title: string;
  description: string;
  beneficiary: string;
  goal_amount: number;
  end_date: string;
  contact_number: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  creator: Creator;
  images: DonationImage[];
}

export interface DonationCreateRequest {
  title: string;
  description: string;
  beneficiary: string;
  goal_amount: number;
  end_date: string;
  contact_number: string;
  image_paths?: string[];
}

export interface DonationUpdateRequest {
  title?: string;
  description?: string;
  beneficiary?: string;
  goal_amount?: number;
  end_date?: string;
  contact_number?: string;
  image_paths?: string[];
}

// Get all donations
export const getAllDonations = async (
  skip: number = 0,
  limit: number = 100,
): Promise<Donation[]> => {
  try {
    const response = await api.get<Donation[]>("/donations/", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    throw error;
  }
};

// Get current user's donations
export const getMyDonations = async (
  skip: number = 0,
  limit: number = 10,
): Promise<Donation[]> => {
  try {
    const response = await api.get<Donation[]>("/donations/me", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my donations:", error);
    throw error;
  }
};

// Get a single donation by ID
export const getDonationById = async (
  donationId: string,
): Promise<Donation> => {
  try {
    const response = await api.get<Donation>(`/donations/${donationId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch donation ${donationId}:`, error);
    throw error;
  }
};

// Create a new donation
export const createDonation = async (
  donationData: DonationCreateRequest,
): Promise<Donation> => {
  try {
    const response = await api.post<Donation>("/donations/", donationData);
    return response.data;
  } catch (error) {
    console.error("Failed to create donation:", error);
    throw error;
  }
};

// Update a donation
export const updateDonation = async (
  donationId: number,
  donationData: DonationUpdateRequest,
): Promise<Donation> => {
  try {
    const response = await api.put<Donation>(
      `/donations/${donationId}`,
      donationData,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update donation ${donationId}:`, error);
    throw error;
  }
};

// Delete a donation
export const deleteDonation = async (donationId: number): Promise<void> => {
  try {
    await api.delete(`/donations/${donationId}`);
  } catch (error) {
    console.error(`Failed to delete donation ${donationId}:`, error);
    throw error;
  }
};