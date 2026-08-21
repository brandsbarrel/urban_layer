import api from "../services/api";

export const cartApi = {
  // Get customer's cart
  getCart: async () => {
    const response = await api.get("/customer/cart");
    return response.data.data;
  },

  // Add item to cart
  addItem: async (productId, quantity = 1, variantId = null) => {
    const response = await api.post("/customer/cart/items", {
      productId,
      quantity,
      variantId
    });
    return response.data.data;
  },

  // Update cart item quantity
  updateItem: async (productId, quantity, variantId = null) => {
    const response = await api.patch(`/customer/cart/items/${productId}`, {
      quantity,
      variantId
    });
    return response.data.data;
  },

  // Remove item from cart
  removeItem: async (productId, variantId = null) => {
    const response = await api.delete(`/customer/cart/items/${productId}`, {
      data: { variantId }
    });
    return response.data.data;
  },

  // Checkout cart - create order
  checkout: async (checkoutData) => {
    const response = await api.post("/customer/cart/checkout", checkoutData);
    return response.data.data;
  }
};

export default cartApi;