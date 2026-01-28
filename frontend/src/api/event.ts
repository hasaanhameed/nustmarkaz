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
  contact_number: string;
  creator_id: number;
  creator: Creator;
  images: EventImage[];
  max_attendees?: number; // <-- Add this line
}

export interface EventCreate {
  title: string;
  description: string;
  society: string;
  location: string;
  event_date: string;
  contact_number: string;
  image_paths?: string[];

}

export interface EventCreateRequest {
  title?: string;
  description?: string;
  society?: string;
  location?: string;
  event_date?: string;
  contact_number?: string;
  image_paths?: string[];
  max_attendees?: number; // <-- Add this line
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

export const updateEvent = async (
  eventId: number,
  eventData: Partial<EventCreateRequest>,
): Promise<Event> => {
  const response = await api.put<Event>(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  await api.delete(`/events/${eventId}`);
};