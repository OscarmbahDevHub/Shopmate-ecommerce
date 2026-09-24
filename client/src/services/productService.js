const API_URL = "https://shopmate-ecommerce-a8o8.onrender.com/api/products";

// Get all products
export const getProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
};

// Get one product
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return await response.json();
};