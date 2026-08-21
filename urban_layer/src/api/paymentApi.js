import api from "../services/api";

export const paymentApi = {
  // Create a payment order for an order
  createPaymentOrder: async (orderId) => {
    const response = await api.post(`/storefront/payments/orders/${orderId}/create`);
    return response.data.data;
  },

  // Verify payment after Razorpay modal/gateway completion
  verifyPayment: async (paymentData) => {
    const response = await api.post("/storefront/payments/verify", {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      orderId: paymentData.orderId || undefined
    });
    return response.data.data;
  }
};

export default paymentApi;