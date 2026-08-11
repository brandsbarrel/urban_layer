import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  id: null,
  code: "",
  title: "",
  subtitle: "",
  discountType: "Percentage",
  discountValue: "",
  minOrderValue: "",
  maxRedemption: "",
  startDate: "",
  endDate: "",
  status: "Scheduled"
};

const buildStats = (items) => {
  const active = items.filter((item) => item.status === "Active").length;
  const totalRevenue = items.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const avgDiscount = items.length
    ? Math.round(items.reduce((sum, item) => sum + Number(item.discountValue || 0), 0) / items.length)
    : 0;

  return [
    { id: "campaigns", label: "Total Campaigns", value: String(items.length), note: "Live backend data", tone: "up", icon: "campaign" },
    { id: "active", label: "Active Coupons", value: String(active), note: "Maintaining target reach", tone: "neutral", icon: "confirmation_number" },
    { id: "revenue", label: "Revenue Generated", value: `$${Math.round(totalRevenue).toLocaleString()}`, note: "Backend total", tone: "up", icon: "payments" },
    { id: "discount", label: "Average Discount", value: `${avgDiscount}%`, note: "Live average", tone: "neutral", icon: "percent" }
  ];
};

const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async () => {
  const response = await apiRequest("/admin/coupons");
  return response.data.items;
});

const saveCoupon = createAsyncThunk("coupons/saveCoupon", async (data) => {
  const payload = {
    code: data.code,
    title: data.title || data.code,
    subtitle: data.subtitle || "",
    discountType: data.discountType,
    discountValue: data.discountValue,
    minOrderValue: data.minOrderValue || "0.00",
    maxRedemption: data.maxRedemption || "Unlimited",
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status || "Scheduled"
  };

  if (data.id) {
    const response = await apiRequest(`/admin/coupons/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    return response.data;
  }

  const response = await apiRequest("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.data;
});

const setStatus = createAsyncThunk("coupons/setStatus", async ({ id, status }) => {
  let action = "pause";
  if (status === "Active") action = "activate";
  if (status === "Expired") action = "archive";

  const response = await apiRequest(`/admin/coupons/${id}/${action}`, {
    method: "POST"
  });
  return response.data;
});

const confirmDelete = createAsyncThunk("coupons/confirmDelete", async (_, { getState }) => {
  const id = getState().coupons.deleteTargetId;
  await apiRequest(`/admin/coupons/${id}`, {
    method: "DELETE"
  });
  return id;
});

const initialState = {
  stats: buildStats([]),
  items: [],
  searchQuery: "",
  statusFilter: "All",
  typeFilter: "All",
  detailsDrawerId: null,
  formDrawerOpen: false,
  editingId: null,
  deleteTargetId: null
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setTypeFilter(state, action) {
      state.typeFilter = action.payload;
    },
    openDetailsDrawer(state, action) {
      state.detailsDrawerId = action.payload;
    },
    closeDetailsDrawer(state) {
      state.detailsDrawerId = null;
    },
    openCreateDrawer(state) {
      state.formDrawerOpen = true;
      state.editingId = null;
    },
    openEditDrawer(state, action) {
      state.formDrawerOpen = true;
      state.editingId = action.payload;
      state.detailsDrawerId = null;
    },
    closeFormDrawer(state) {
      state.formDrawerOpen = false;
      state.editingId = null;
    },
    setDeleteTarget(state, action) {
      state.deleteTargetId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.items = action.payload;
        state.stats = buildStats(action.payload);
      })
      .addCase(saveCoupon.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
        state.formDrawerOpen = false;
        state.editingId = null;
        state.stats = buildStats(state.items);
      })
      .addCase(setStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.stats = buildStats(state.items);
      })
      .addCase(confirmDelete.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.deleteTargetId = null;
        state.detailsDrawerId = null;
        state.stats = buildStats(state.items);
      });
  }
});

export { emptyForm, fetchCoupons, saveCoupon, setStatus, confirmDelete };
export const {
  setSearchQuery,
  setStatusFilter,
  setTypeFilter,
  openDetailsDrawer,
  closeDetailsDrawer,
  openCreateDrawer,
  openEditDrawer,
  closeFormDrawer,
  setDeleteTarget
} = couponsSlice.actions;
export default couponsSlice.reducer;
