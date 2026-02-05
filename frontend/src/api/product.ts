import api from "./api";

export interface ProductImage {
  id: number;
  image_path: string;
  product_id: number;
}

export interface Creator {
  id: number;
  username: string;
  email: string;
  department: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  pickup_location: string;
  condition: string;
  contact_number: string;
  creator_id: number;
  images: ProductImage[];
  creator: Creator;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  pickup_location: string;
  condition: string;
  contact_number: string;
  image_paths?: string[];
}

// Get all products with pagination
export const getAllProducts = async (
  skip: number = 0,
  limit: number = 100,
): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products/", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// Get current user's products
export const getMyProducts = async (
  skip: number = 0,
  limit: number = 10,
): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products/me", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my products:", error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (
  productData: ProductCreateRequest,
): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products/", productData);
    return response.data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  productId: number,
  productData: Partial<ProductCreateRequest>,
): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update product ${productId}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await api.delete(`/products/${productId}`);
  } catch (error) {
    console.error(`Failed to delete product ${productId}:`, error);
    throw error;
  }
};