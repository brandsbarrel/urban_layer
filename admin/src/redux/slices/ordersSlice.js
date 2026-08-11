import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered"
};

const ACTION_LABEL = {
  Confirmed: "Confirm Order",
  Packed: "Mark Packed",
  Shipped: "Mark Shipped",
  "Out for Delivery": "Mark Out for Delivery",
  Delivered: "Mark Delivered"
};

const STATUS_TONE = {
  Pending: "amber",
  Confirmed: "blue",
  Packed: "blue",
  Shipped: "blue",
  "Out for Delivery": "blue",
  Delivered: "green",
  Cancelled: "red"
};

const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const [ordersResponse, statsResponse] = await Promise.all([
    apiRequest("/admin/orders"),
    apiRequest("/admin/orders/stats")
  ]);

  return {
    items: ordersResponse.data.items,
    stats: statsResponse.data.items
  };
});

const advanceStatus = createAsyncThunk("orders/advanceStatus", async ({ orderId }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const next = NEXT_STATUS[order?.status];

  if (!order || !next) {
    return order;
  }

  let endpoint = "";
  let body;

  if (next === "Confirmed") endpoint = "confirm";
  if (next === "Packed") endpoint = "pack";
  if (next === "Shipped") {
    endpoint = "ship";
    const shippingInfo = getState().orders.pendingShipment[orderId] || {};
    body = JSON.stringify({
      courier: shippingInfo.courier,
      trackingNumber: shippingInfo.trackingNumber,
      shippingMethod: shippingInfo.shippingMethod || "Standard"
    });
  }
  if (next === "Out for Delivery") endpoint = "out-for-delivery";
  if (next === "Delivered") endpoint = "deliver";

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
    },
    setPaymentFilter(state, action) {
      state.paymentFilter = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
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
      })
      .addCase(advanceStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.shipModalOpen = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
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
  openDrawer,
  closeDrawer,
  openShipModal,
  closeShipModal,
  openCancelModal,
  closeCancelModal,
  setShippingInfo
} = ordersSlice.actions;
export default ordersSlice.reducer;
