import api from './api';

export interface EventImage {
  id: number;
  image_path: string;
  event_id: number;
}

export interface Creator {
  id: number;
  username: string;
  email: string;
  department: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  society: string;
  location: string;
  event_date: string;
  creator_id: number;
  creator: Creator;
  images: EventImage[];
}

export interface EventCreate {
  title: string;
  description: string;
  society: string;
  location: string;
  event_date: string;
  image_paths?: string[];  // Add this line
}

export const createEvent = async (eventData: EventCreate): Promise<Event> => {
  const response = await api.post('/events/', eventData);
  return response.data;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events/');
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};