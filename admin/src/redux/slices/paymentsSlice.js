import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

// Payment status tones (reusing from orders)
const PAYMENT_STATUS_TONE = {
  Paid: "green",
  Pending: "amber",
  Failed: "red",
  Refunded: "green",
  "Partially Refunded": "blue",
  "Refund Processing": "amber",
  Collected: "green",
  Settled: "green",
  "Collection Failed": "red",
  "Settlement Failed": "red"
};

const fetchPayments = createAsyncThunk("payments/fetchPayments", async (_, { getState }) => {
  const {
    searchQuery, paymentFilter, paymentMethodFilter,
    startDate, endDate, sortBy, sortOrder, page, perPage
  } = getState().payments;

  const params = new URLSearchParams();
  if (paymentFilter && paymentFilter !== "All") params.append("paymentStatus", paymentFilter);
  if (paymentMethodFilter && paymentMethodFilter !== "All") params.append("paymentMethod", paymentMethodFilter);
  if (searchQuery) params.append("search", searchQuery);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (page) params.append("page", page);
  if (perPage) params.append("perPage", perPage);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await apiRequest(`/admin/orders/payments${queryString}`);

  return {
    items: response.data?.items || [],
    meta: response.meta || { page: page || 1, perPage: perPage || 20, totalItems: response.data?.items?.length || 0, totalPages: 1 }
  };
});

const initialState = {
  items: [],
  meta: { page: 1, perPage: 20, totalItems: 0, totalPages: 1 },
  searchQuery: "",
  paymentFilter: "All",
  paymentMethodFilter: "All",
  startDate: "",
  endDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  perPage: 20,
  loading: false,
  error: null,
  drawerPaymentId: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
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
    setPage(state, action) {
      state.page = action.payload;
    },
    openDrawer(state, action) {
      state.drawerPaymentId = action.payload;
    },
    closeDrawer(state) {
      state.drawerPaymentId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.meta = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export { PAYMENT_STATUS_TONE };
export { fetchPayments };
export const {
  setSearchQuery,
  setPaymentFilter,
  setPaymentMethodFilter,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder,
  setPage,
  openDrawer,
  closeDrawer
} = paymentsSlice.actions;
export default paymentsSlice.reducer;