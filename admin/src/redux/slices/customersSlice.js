import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const buildStats = (items) => {
  const vipCount = items.filter((item) => item.status === "VIP Elite").length;
  const totalPoints = items.reduce((sum, item) => sum + (item.rewardPoints || 0), 0);
  const retention = items.length
    ? (((items.length - items.filter((item) => item.status === "Deactivated").length) / items.length) * 100).toFixed(1)
    : "0.0";

  return [
    { id: "total", label: "Total Customers", value: items.length.toLocaleString(), change: "live", trend: "up", tone: "primary", icon: "group" },
    { id: "vip", label: "Active VIPs", value: vipCount.toLocaleString(), change: "live", trend: "up", tone: "tertiary", icon: "diamond" },
    { id: "points", label: "Reward Points Issued", value: totalPoints.toLocaleString(), change: "live", trend: "up", tone: "primary", icon: "stars" },
    { id: "retention", label: "Retention Rate", value: `${retention}%`, change: "live", trend: "up", tone: "neutral", icon: "refresh" }
  ];
};

const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async () => {
  const response = await apiRequest("/admin/customers");
  return response.data.items;
});

const deactivateCustomer = createAsyncThunk("customers/deactivateCustomer", async (id) => {
  const response = await apiRequest(`/admin/customers/${id}/deactivate`, {
    method: "POST"
  });
  return response.data;
});

const deactivateSelected = createAsyncThunk("customers/deactivateSelected", async (_, { getState }) => {
  const ids = getState().customers.selectedIds;
  const response = await apiRequest("/admin/customers/bulk/deactivate", {
    method: "POST",
    body: JSON.stringify({ ids })
  });
  return response.data.items;
});

const deleteSelected = createAsyncThunk("customers/deleteSelected", async (_, { getState }) => {
  const ids = getState().customers.selectedIds;
  await Promise.all(ids.map((id) => apiRequest(`/admin/customers/${id}`, { method: "DELETE" })));
  return ids;
});

const initialState = {
  stats: buildStats([]),
  items: [],
  selectedIds: [],
  drawerCustomerId: null,
  searchQuery: "",
  vipFilter: "All",
  regionFilter: "All"
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    toggleSelect(state, action) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
    },
    toggleSelectAll(state, action) {
      const allIds = action.payload;
      state.selectedIds = state.selectedIds.length === allIds.length ? [] : allIds;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setVipFilter(state, action) {
      state.vipFilter = action.payload;
    },
    setRegionFilter(state, action) {
      state.regionFilter = action.payload;
    },
    openDrawer(state, action) {
      state.drawerCustomerId = action.payload;
    },
    closeDrawer(state) {
      state.drawerCustomerId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.stats = buildStats(action.payload);
      })
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.stats = buildStats(state.items);
      })
      .addCase(deactivateSelected.fulfilled, (state, action) => {
        action.payload.forEach((customer) => {
          const index = state.items.findIndex((item) => item.id === customer.id);
          if (index >= 0) {
            state.items[index] = customer;
          }
        });
        state.selectedIds = [];
        state.stats = buildStats(state.items);
      })
      .addCase(deleteSelected.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.payload.includes(item.id));
        state.selectedIds = [];
        state.stats = buildStats(state.items);
      });
  }
});

export { fetchCustomers, deactivateCustomer, deactivateSelected, deleteSelected };
export const {
  toggleSelect,
  toggleSelectAll,
  setSearchQuery,
  setVipFilter,
  setRegionFilter,
  openDrawer,
  closeDrawer
} = customersSlice.actions;
export default customersSlice.reducer;
