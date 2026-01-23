import api from "./api";

// Product image type
interface ProductImage {
  id: number;
  image_path: string;
  product_id: number;
}

// Product type
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  pickup_location: string;
  condition: string;
  user_id: number;
  images: ProductImage[];
}

// Product creation request type
export interface ProductCreateRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  pickup_location: string;
  condition: string;
  image_paths?: string[];
}

// Function to create a new product
export const createProduct = async (productData: ProductCreateRequest): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products/", productData);
    return response.data;
  } catch (error: any) {
    console.error("Product creation failed", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Function to get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};

// Function to get a single product by ID
export const getProductById = async (id: string | number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product", error);
    throw error;
  }
};