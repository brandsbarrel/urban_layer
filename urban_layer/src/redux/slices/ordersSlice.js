import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api/orderApi';

// Async thunks for API calls
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await orderApi.getOrders();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const fetchOrderTracking = createAsyncThunk(
  'orders/fetchOrderTracking',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderTracking(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tracking');
    }
  }
);

const initialState = {
    orders: [],
    selectedOrder: null,
    selectedOrderTracking: null,
    lastOrderId: null,
    loading: false,
    trackingLoading: false,
    error: null,
    trackingError: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        placeOrder(state, action) {
            state.orders.push(action.payload);
            state.lastOrderId = action.payload.id;
        },
        updateOrderStatus(state, action) {
            const order = state.orders.find((o) => o.id === action.payload.id);
            if (order) order.status = action.payload.status;
        },
        clearTracking(state) {
            state.selectedOrderTracking = null;
            state.trackingError = null;
        }
    },
    extraReducers: (builder) => {
      builder
        // Fetch orders
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.loading = false;
          state.orders = action.payload;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Fetch order by ID
        .addCase(fetchOrderById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrderById.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedOrder = action.payload;
          const index = state.orders.findIndex(o => o.id === action.payload.id || o.orderDbId === action.payload.orderDbId);
          if (index >= 0) {
            state.orders[index] = action.payload;
          } else {
            state.orders.unshift(action.payload);
          }
        })
        .addCase(fetchOrderById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Fetch order tracking
        .addCase(fetchOrderTracking.pending, (state) => {
          state.trackingLoading = true;
          state.trackingError = null;
        })
        .addCase(fetchOrderTracking.fulfilled, (state, action) => {
          state.trackingLoading = false;
          state.selectedOrderTracking = action.payload;
        })
        .addCase(fetchOrderTracking.rejected, (state, action) => {
          state.trackingLoading = false;
          state.trackingError = action.payload;
        });
    },
});

export const { placeOrder, updateOrderStatus, clearTracking } = ordersSlice.actions;
export const selectOrders = (state) => state.orders.orders;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectSelectedOrderTracking = (state) => state.orders.selectedOrderTracking;
export const selectOrdersCount = (state) => state.orders.orders.length;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectTrackingLoading = (state) => state.orders.trackingLoading;
export const selectTrackingError = (state) => state.orders.trackingError;
export const selectMostRecentOrder = (state) => {
    const orders = state.orders.orders;
    return orders.length > 0 ? orders[orders.length - 1] : null;
};
export const selectLastOrder = (state) =>
    state.orders.orders.find((o) => o.id === state.orders.lastOrderId) || null;
export default ordersSlice.reducer;