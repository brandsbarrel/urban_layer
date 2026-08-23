import api from "../services/api";

export const wishlistApi = {
  // Get customer's wishlist
  getWishlist: async () => {
    const response = await api.get("/customer/wishlist");
    return response.data.data;
  },

  // Add item to wishlist
  addItem: async (productId) => {
    const response = await api.post("/customer/wishlist", { productId });
    return response.data.data;
  },

  // Remove item from wishlist
  removeItem: async (productId) => {
    const response = await api.delete(`/customer/wishlist/${productId}`);
    return response.data.data;
  },

  // Check if a product is in wishlist
  checkStatus: async (productId) => {
    const response = await api.get(`/customer/wishlist/check/${productId}`);
    return response.data.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await api.delete("/customer/wishlist");
    return response.data.data;
  }
};

export default wishlistApi;