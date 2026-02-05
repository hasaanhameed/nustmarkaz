import api from './api';

export interface Creator {
  id: number;
  username: string;
  email: string;
  department: string;
}

export interface LostFoundItem {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image_path: string;
  contact_method: string;
  contact_info: string;
  type: string;
  status: string;
  creator_id: number;
  creator: Creator;
}

export interface LostFoundItemCreate {
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image_path: string;
  contact_method: string;
  contact_info: string;
  type: string;
}

export const createLostFoundItem = async (itemData: LostFoundItemCreate): Promise<LostFoundItem> => {
  const response = await api.post('/lost-found/', itemData);
  return response.data;
};

export const getAllLostFoundItems = async (): Promise<LostFoundItem[]> => {
  const response = await api.get('/lost-found/');
  return response.data;
};

// Get current user's lost and found items
export const getMyLostFoundItems = async (
  skip: number = 0,
  limit: number = 10,
): Promise<LostFoundItem[]> => {
  try {
    const response = await api.get<LostFoundItem[]>("/lost-found/me", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my lost and found items:", error);
    throw error;
  }
};

export const getLostFoundItemById = async (id: number): Promise<LostFoundItem> => {
  const response = await api.get(`/lost-found/${id}`);
  return response.data;
};

export const claimItem = async (id: number): Promise<LostFoundItem> => {
  const response = await api.patch(`/lost-found/${id}/claim`);
  return response.data;
};