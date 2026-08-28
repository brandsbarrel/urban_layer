import api from '../services/api';

export const addressesApi = {
  getAddresses: async () => {
    const response = await api.get('/customer/profile');
    return response.data.data?.addresses || [];
  },

  addAddress: async (address) => {
    const response = await api.post('/customer/addresses', address);
    return response.data.data?.items || [];
  },

  updateAddress: async (index, address) => {
    const response = await api.patch(`/customer/addresses/${index}`, address);
    return response.data.data?.items || [];
  },

  deleteAddress: async (index) => {
    const response = await api.delete(`/customer/addresses/${index}`);
    return response.data.data?.items || [];
  },
};

export default addressesApi;
