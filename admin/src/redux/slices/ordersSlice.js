import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

// Updated status transitions to match backend constants
const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Processing",
  Processing: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered"
};

// Return flow transitions (for future use)
const RETURN_NEXT_STATUS = {
  "Return Requested": "Return Approved",
  "Return Approved": "Return Pickup",
  "Return Pickup": "Picked Up",
  "Picked Up": "Received",
  Received: "Refund Processing",
  "Refund Processing": "Refunded"
};

const ACTION_LABEL = {
  Confirmed: "Confirm Order",
  Processing: "Mark Processing",
  Packed: "Mark Packed",
  Shipped: "Mark Shipped",
  "Out for Delivery": "Mark Out for Delivery",
  Delivered: "Mark Delivered",
  // Return actions
  "Return Approved": "Approve Return",
  "Return Rejected": "Reject Return",
  "Return Pickup": "Schedule Pickup",
  "Picked Up": "Mark Picked Up",
  Received: "Mark Received",
  "Refund Processing": "Process Refund"
};

const STATUS_TONE = {
  Pending: "amber",
  Confirmed: "blue",
  Processing: "blue",
  Packed: "blue",
  Shipped: "blue",
  "Out for Delivery": "blue",
  Delivered: "green",
  Cancelled: "red",
  "Return Requested": "amber",
  "Return Approved": "blue",
  "Return Rejected": "red",
  "Return Pickup": "blue",
  "Picked Up": "blue",
  Received: "blue",
  "Refund Processing": "amber",
  Refunded: "green"
};

const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { getState }) => {
  const { statusFilter, paymentFilter, searchQuery, page, perPage } = getState().orders;
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== "All") params.append("status", statusFilter);
  if (paymentFilter && paymentFilter !== "All") params.append("paymentStatus", paymentFilter);
  if (searchQuery) params.append("search", searchQuery);
  if (page) params.append("page", page);
  if (perPage) params.append("perPage", perPage);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const [ordersResponse, statsResponse] = await Promise.all([
    apiRequest(`/admin/orders${queryString}`),
    apiRequest("/admin/orders/stats")
  ]);

  return {
    items: ordersResponse.data?.items || [],
    stats: statsResponse.data?.items || [],
    meta: ordersResponse.meta || { page: page || 1, perPage: perPage || 20, totalItems: ordersResponse.data?.items?.length || 0, totalPages: 1 }
  };
});

const advanceStatus = createAsyncThunk("orders/advanceStatus", async ({ orderId }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  // Check regular flow first
  let next = NEXT_STATUS[order?.status];
  // If not in regular flow, check return flow
  if (!next) {
    next = RETURN_NEXT_STATUS[order?.status];
  }

  if (!order || !next) {
    return order;
  }

  let endpoint = "";
  let body;

  if (next === "Confirmed") endpoint = "confirm";
  if (next === "Processing") endpoint = "process";
  if (next === "Packed") endpoint = "pack";
  if (next === "Shipped") {
    endpoint = "ship";
    const shippingInfo = getState().orders.pendingShipment[orderId] || {};
    body = JSON.stringify({
      courier: shippingInfo.courier || "Standard Courier",
      trackingNumber: shippingInfo.trackingNumber || `TRACK-${Date.now()}`,
      shippingMethod: shippingInfo.shippingMethod || "Standard"
    });
  }
  if (next === "Out for Delivery") endpoint = "out-for-delivery";
  if (next === "Delivered") endpoint = "deliver";
  // Return flow endpoints
  if (next === "Return Approved") endpoint = "return/approve";
  if (next === "Return Rejected") endpoint = "return/reject";
  if (next === "Return Pickup") endpoint = "return/pickup";
  if (next === "Picked Up") endpoint = "return/pickup-complete";
  if (next === "Received") endpoint = "return/receive";
  if (next === "Refund Processing") endpoint = "refund/process";

  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/${endpoint}`, {
    method: "POST",
    body
  });

  return response.data;
});

const cancelOrder = createAsyncThunk("orders/cancelOrder", async ({ orderId, reason }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason })
  });

  return response.data;
});

const initialState = {
  stats: [],
  items: [],
  meta: { page: 1, perPage: 20, totalItems: 0, totalPages: 1 },
  page: 1,
  perPage: 20,
  statusFilter: "All",
  paymentFilter: "All",
  dateRange: "",
  searchQuery: "",
  drawerOrderId: null,
  shipModalOpen: false,
  cancelModalOpen: false,
  pendingShipment: {}
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPaymentFilter(state, action) {
      state.paymentFilter = action.payload;
      state.page = 1;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    openDrawer(state, action) {
      state.drawerOrderId = action.payload;
    },
    closeDrawer(state) {
      state.drawerOrderId = null;
      state.shipModalOpen = false;
      state.cancelModalOpen = false;
    },
    openShipModal(state) {
      state.shipModalOpen = true;
    },
    closeShipModal(state) {
      state.shipModalOpen = false;
    },
    openCancelModal(state) {
      state.cancelModalOpen = true;
    },
    closeCancelModal(state) {
      state.cancelModalOpen = false;
    },
    setShippingInfo(state, action) {
      const { orderId, carrier, trackingNumber, shippingMethod } = action.payload;
      state.pendingShipment[orderId] = {
        courier: carrier,
        trackingNumber,
        shippingMethod: shippingMethod || "Standard"
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.stats = action.payload.stats;
        state.meta = action.payload.meta;
      })
      .addCase(advanceStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((item) => item.id === action.payload.id || item.orderDbId === action.payload.orderDbId);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.shipModalOpen = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id || item.orderDbId === action.payload.orderDbId);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.cancelModalOpen = false;
      });
  }
});

export { NEXT_STATUS, ACTION_LABEL, STATUS_TONE, fetchOrders, advanceStatus, cancelOrder };
export const {
  setStatusFilter,
  setPaymentFilter,
  setDateRange,
  setSearchQuery,
  setPage,
  openDrawer,
  closeDrawer,
  openShipModal,
  closeShipModal,
  openCancelModal,
  closeCancelModal,
  setShippingInfo
} = ordersSlice.actions;
export default ordersSlice.reducer;
