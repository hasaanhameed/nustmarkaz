import api from './api';
// Types for Cafe API responses

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user_id: number;
    cafe_id: number;
}

export interface Cafe {
    id: number;
    name: string;
    location: string | null;
    description: string | null;
    image_url: string | null;
}

export interface CafeWithReviews extends Cafe {
    reviews: Review[];
}

export interface AverageRating {
    cafe_id: number;
    average_rating: number;
    review_count: number;
}

// Request types
export interface CafeCreateRequest {
    name: string;
    location?: string;
    description?: string;
    image_url?: string;
}

export interface ReviewCreateRequest {
    rating: number;
    comment?: string;
}

// Display types (for frontend use)
export interface CafeCardData extends Cafe {
    average_rating: number;
    review_count: number;
}

// Supabase configuration
const SUPABASE_URL = 'https://rggmcwzkljndvytgedhy.supabase.co';
const STORAGE_BUCKET = 'Cafe%20Images';

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

// Process cafe data to ensure proper image URLs
const processCafeData = <T extends Cafe>(cafe: T): T => {
    return {
        ...cafe,
        image_url: convertToPublicUrl(cafe.image_url)
    };
};

// Get all cafes
export const getCafes = async (): Promise<Cafe[]> => {
    const response = await api.get<Cafe[]>('/cafes/');
    return response.data.map(processCafeData);
};

// Get a specific cafe with reviews
export const getCafeById = async (cafeId: number): Promise<CafeWithReviews> => {
    const response = await api.get<CafeWithReviews>(`/cafes/${cafeId}`);
    return processCafeData(response.data);
};

// Get average rating for a cafe
export const getCafeAverageRating = async (cafeId: number): Promise<AverageRating> => {
    const response = await api.get<AverageRating>(`/cafes/${cafeId}/average-rating`);
    return response.data;
};

// Get all cafes with their ratings (for listing page)
export const getCafesWithRatings = async (): Promise<CafeCardData[]> => {
    // OLD: Fetch cafes then loop for ratings (N+1 queries)
    // const cafes = await getCafes();
    // ...

    // NEW: Use optimized endpoint
    const response = await api.get<any[]>('/cafes/with-reviews');

    // Process image URLs
    return response.data.map(cafe => ({
        ...cafe,
        image_url: convertToPublicUrl(cafe.image_url)
    })) as CafeCardData[];
};

// Create a new cafe (admin/authenticated users)
export const createCafe = async (cafeData: CafeCreateRequest): Promise<Cafe> => {
    const response = await api.post<Cafe>('/cafes/', cafeData);
    return processCafeData(response.data);
};

// Create a review for a cafe
export const createReview = async (
    cafeId: number,
    reviewData: ReviewCreateRequest
): Promise<Review> => {
    const response = await api.post<Review>(
        `/cafes/${cafeId}/reviews`,
        reviewData
    );
    return response.data;
};

// Delete a review
export const deleteReview = async (cafeId: number, reviewId: number): Promise<void> => {
    await api.delete(`/cafes/${cafeId}/reviews/${reviewId}`);
};