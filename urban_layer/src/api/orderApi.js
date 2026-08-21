import api from "../services/api";

export const orderApi = {
  // Get all orders for the logged-in customer
  getOrders: async () => {
    const response = await api.get("/customer/orders");
    return response.data.data.items;
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/customer/orders/${orderId}`);
    return response.data.data;
  }
};

export default orderApi;