import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

// Business-only status transitions (Shiprocket handles logistics statuses)
const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Processing",
  Processing: "Packed"
};

const ACTION_LABEL = {
  Confirmed: "Confirm Order",
  Processing: "Mark Processing",
  Packed: "Mark Packed",
  // Return actions
  "Return Approved": "Approve Return",
  "Return Rejected": "Reject Return",
  Refunded: "Process Refund"
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
  Returned: "blue",
  Received: "blue",
  "Refund Processing": "amber",
  Refunded: "green"
};

const PAYMENT_STATUS_TONE = {
  Paid: "green",
  Pending: "amber",
  Failed: "red",
  Refunded: "green",
  "Partially Refunded": "blue",
  "Refund Processing": "amber"
};

const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { getState }) => {
  const {
    statusFilter, paymentFilter, paymentMethodFilter,
    shippingStatusFilter, searchQuery, page, perPage,
    startDate, endDate, sortBy, sortOrder
  } = getState().orders;

  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== "All") params.append("status", statusFilter);
  if (paymentFilter && paymentFilter !== "All") params.append("paymentStatus", paymentFilter);
  if (paymentMethodFilter && paymentMethodFilter !== "All") params.append("paymentMethod", paymentMethodFilter);
  if (shippingStatusFilter && shippingStatusFilter !== "All") params.append("shippingStatus", shippingStatusFilter);
  if (searchQuery) params.append("search", searchQuery);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
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
  const next = NEXT_STATUS[order?.status];

  if (!order || !next) {
    return order;
  }

  let endpoint = "";
  if (next === "Confirmed") endpoint = "confirm";
  if (next === "Processing") endpoint = "process";
  if (next === "Packed") endpoint = "pack";

  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/${endpoint}`, {
    method: "POST"
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

const approveReturn = createAsyncThunk("orders/approveReturn", async ({ orderId }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/return/approve`, {
    method: "POST"
  });
  return response.data;
});

const rejectReturn = createAsyncThunk("orders/rejectReturn", async ({ orderId, reason }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/return/reject`, {
    method: "POST",
    body: JSON.stringify({ reason })
  });
  return response.data;
});

const processRefund = createAsyncThunk("orders/processRefund", async ({ orderId, amount, reason, method }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const body = {};
  if (amount) body.amount = amount;
  if (reason) body.reason = reason;
  if (method) body.method = method;
  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/refund`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return response.data;
});

const refreshTracking = createAsyncThunk("orders/refreshTracking", async ({ orderId }, { getState }) => {
  const order = getState().orders.items.find((item) => item.id === orderId);
  const response = await apiRequest(`/admin/orders/${order.orderDbId || order.id}/refresh-tracking`, {
    method: "POST"
  });
  return response.data;
});

const generateLabel = createAsyncThunk("orders/generateLabel", async ({ shipmentId }) => {
  const response = await apiRequest(`/admin/shiprocket/generate-label`, {
    method: "POST",
    body: JSON.stringify({ shipment_id: shipmentId })
  });
  return response.data;
});

const generateInvoice = createAsyncThunk("orders/generateInvoice", async ({ orderIds }) => {
  const response = await apiRequest(`/admin/shiprocket/generate-invoice`, {
    method: "POST",
    body: JSON.stringify({ ids: orderIds })
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
  paymentMethodFilter: "All",
  shippingStatusFilter: "All",
  startDate: "",
  endDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  searchQuery: "",
  drawerOrderId: null,
  cancelModalOpen: false,
  rejectReturnModalOpen: false,
  refundModalOpen: false,
  loading: false,
  actionLoading: false,
  error: null
};

const updateOrderInList = (state, payload) => {
  if (!payload) return;
  const index = state.items.findIndex((item) => item.id === payload.id || item.orderDbId === payload.orderDbId);
  if (index >= 0) {
    state.items[index] = payload;
  }
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
    setPaymentMethodFilter(state, action) {
      state.paymentMethodFilter = action.payload;
      state.page = 1;
    },
    setShippingStatusFilter(state, action) {
      state.shippingStatusFilter = action.payload;
      state.page = 1;
    },
    setStartDate(state, action) {
      state.startDate = action.payload;
      state.page = 1;
    },
    setEndDate(state, action) {
      state.endDate = action.payload;
      state.page = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
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
      state.cancelModalOpen = false;
      state.rejectReturnModalOpen = false;
      state.refundModalOpen = false;
    },
    openCancelModal(state) {
      state.cancelModalOpen = true;
    },
    closeCancelModal(state) {
      state.cancelModalOpen = false;
    },
    openRejectReturnModal(state) {
      state.rejectReturnModalOpen = true;
    },
    closeRejectReturnModal(state) {
      state.rejectReturnModalOpen = false;
    },
    openRefundModal(state) {
      state.refundModalOpen = true;
    },
    closeRefundModal(state) {
      state.refundModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.stats = action.payload.stats;
        state.meta = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(advanceStatus.pending, (state) => { state.actionLoading = true; })
      .addCase(advanceStatus.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
        state.actionLoading = false;
      })
      .addCase(advanceStatus.rejected, (state) => { state.actionLoading = false; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
        state.cancelModalOpen = false;
      })
      .addCase(approveReturn.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
      })
      .addCase(rejectReturn.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
        state.rejectReturnModalOpen = false;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
        state.refundModalOpen = false;
      })
      .addCase(refreshTracking.fulfilled, (state, action) => {
        updateOrderInList(state, action.payload);
      });
  }
});

export { NEXT_STATUS, ACTION_LABEL, STATUS_TONE, PAYMENT_STATUS_TONE };
export { fetchOrders, advanceStatus, cancelOrder, approveReturn, rejectReturn, processRefund, refreshTracking, generateLabel, generateInvoice };
export const {
  setStatusFilter,
  setPaymentFilter,
  setPaymentMethodFilter,
  setShippingStatusFilter,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder,
  setSearchQuery,
  setPage,
  openDrawer,
  closeDrawer,
  openCancelModal,
  closeCancelModal,
  openRejectReturnModal,
  closeRejectReturnModal,
  openRefundModal,
  closeRefundModal
} = ordersSlice.actions;
export default ordersSlice.reducer;
