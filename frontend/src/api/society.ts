import api from './api';

// Types for Society API responses

export interface ReviewCreator {
    id: number;
    username: string;
    email: string;
}

export interface SocietyReview {
    id: number;
    rating: number;
    comment: string;
    user_id: number;
    society_id: number;
    creator: ReviewCreator;
}

export interface Society {
    id: number;
    name: string;
    instagram_url: string | null;
    image_url: string | null;
}

export interface SocietyWithReviews extends Society {
    reviews: SocietyReview[];
}

export interface AverageRating {
    society_id: number;
    average_rating: number;
    review_count: number;
}

// Request types
export interface SocietyCreateRequest {
    name: string;
    instagram_url?: string;
    image_url?: string;
}

export interface SocietyUpdateRequest {
    name?: string;
    instagram_url?: string;
    image_url?: string;
}

export interface SocietyReviewCreateRequest {
    rating: number;
    comment: string;
    society_id: number;
}

export interface SocietyReviewUpdateRequest {
    rating?: number;
    comment?: string;
}

// Display types (for frontend use)
export interface SocietyCardData extends Society {
    average_rating: number;
    review_count: number;
}

// Supabase configuration (if you're using Supabase for image storage)
const SUPABASE_URL = 'https://rggmcwzkljndvytgedhy.supabase.co';
const STORAGE_BUCKET = 'Society%20Images';

// Convert signed URL to public URL
const convertToPublicUrl = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;

    // If it's already a signed URL from Supabase, extract the filename and convert to public
    if (imageUrl.includes('/storage/v1/object/sign/')) {
        const match = imageUrl.match(/\/sign\/[^/]+\/([^?]+)/);
        if (match && match[1]) {
            const filename = match[1];
            return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
        }
    }

    // If it's already a public URL or external URL, return as is
    return imageUrl;
};

// Process society data to ensure proper image URLs
const processSocietyData = <T extends Society>(society: T): T => {
    return {
        ...society,
        image_url: convertToPublicUrl(society.image_url)
    };
};

// Get all societies
export const getSocieties = async (): Promise<Society[]> => {
    const response = await api.get<Society[]>('/societies/');
    return response.data.map(processSocietyData);
};

// Get a specific society with reviews
export const getSocietyById = async (societyId: number): Promise<SocietyWithReviews> => {
    const response = await api.get<SocietyWithReviews>(`/societies/${societyId}`);
    return processSocietyData(response.data);
};

// Get all societies with their ratings (for listing page)
export const getSocietiesWithRatings = async (): Promise<SocietyCardData[]> => {
    const societies = await getSocieties();

    // Calculate ratings from reviews for all societies
    const societiesWithRatings = societies.map((society) => {
        // If you want to fetch detailed reviews, you can call getSocietyById
        // For now, returning with default values
        return {
            ...society,
            average_rating: 0,
            review_count: 0,
        };
    });

    return societiesWithRatings;
};

// Alternative: Get societies with ratings by fetching each society's details
export const getSocietiesWithRatingsDetailed = async (): Promise<SocietyCardData[]> => {
    const response = await api.get<any[]>('/societies/with-reviews');
    
    return response.data.map(society => ({
        id: society.id,
        name: society.name,
        instagram_url: society.instagram_url,
        image_url: society.image_url,
        average_rating: society.average_rating,
        review_count: society.review_count
    }));
};

// Create a new society (authenticated users)
export const createSociety = async (societyData: SocietyCreateRequest): Promise<Society> => {
    const response = await api.post<Society>('/societies/', societyData);
    return processSocietyData(response.data);
};

// Update a society
export const updateSociety = async (
    societyId: number,
    societyData: SocietyUpdateRequest
): Promise<Society> => {
    const response = await api.put<Society>(`/societies/${societyId}`, societyData);
    return processSocietyData(response.data);
};

// Delete a society
export const deleteSociety = async (societyId: number): Promise<void> => {
    await api.delete(`/societies/${societyId}`);
};

// Create a review for a society
export const createSocietyReview = async (
    reviewData: SocietyReviewCreateRequest
): Promise<SocietyReview> => {
    const response = await api.post<SocietyReview>(
        '/societies/reviews',
        reviewData
    );
    return response.data;
};

// Get all reviews for a specific society
export const getSocietyReviews = async (societyId: number): Promise<SocietyReview[]> => {
    const response = await api.get<SocietyReview[]>(`/societies/${societyId}/reviews`);
    return response.data;
};

// Update a review
export const updateSocietyReview = async (
    reviewId: number,
    reviewData: SocietyReviewUpdateRequest
): Promise<SocietyReview> => {
    const response = await api.put<SocietyReview>(
        `/societies/reviews/${reviewId}`,
        reviewData
    );
    return response.data;
};

// Delete a review
export const deleteSocietyReview = async (reviewId: number): Promise<void> => {
    await api.delete(`/societies/reviews/${reviewId}`);
};