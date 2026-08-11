import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const buildStats = (items) => {
  const active = items.filter((item) => item.status === "Active").length;
  const lowStock = items.filter((item) => item.status === "Low Stock").length;
  const outOfStock = items.filter((item) => item.status === "Out of Stock").length;

  return [
    { id: "total", label: "TOTAL PRODUCTS", value: items.length.toLocaleString(), icon: "inventory_2", tone: "neutral", sparklinePath: "M0 30 Q 10 10, 20 25 T 40 15 T 60 20 T 80 5 T 100 15" },
    { id: "active", label: "ACTIVE PRODUCTS", value: active.toLocaleString(), icon: "check_circle", tone: "success", sparklinePath: "M0 20 L 20 25 L 40 10 L 60 15 L 80 5 L 100 10" },
    { id: "low-stock", label: "LOW STOCK", value: lowStock.toLocaleString(), icon: "warning", tone: "warning", sparklinePath: "M0 5 L 25 35 L 50 20 L 75 38 L 100 15" },
    { id: "out-of-stock", label: "OUT OF STOCK", value: outOfStock.toLocaleString(), icon: "error", tone: "error", sparklinePath: "M0 10 L 10 20 L 20 40 L 40 38 L 100 40" }
  ];
};

const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { getState }) => {
  const { page, perPage } = getState().products.pagination;
  const response = await apiRequest(`/admin/products?page=${page}&perPage=${perPage}`);
  return {
    items: response.data.items,
    meta: response.meta
  };
});

const archiveProduct = createAsyncThunk("products/archiveProduct", async (id) => {
  const response = await apiRequest(`/admin/products/${id}/archive`, {
    method: "POST"
  });

  return response.data;
});

const archiveSelected = createAsyncThunk("products/archiveSelected", async (_, { getState, dispatch }) => {
  const { selectedIds } = getState().products;
  await Promise.all(selectedIds.map((id) => dispatch(archiveProduct(id)).unwrap()));
  return selectedIds;
});

const deleteProducts = createAsyncThunk("products/deleteProducts", async (ids) => {
  await Promise.all(ids.map((id) => apiRequest(`/admin/products/${id}`, { method: "DELETE" })));
  return ids;
});

const initialState = {
  items: [],
  stats: buildStats([]),
  selectedIds: [],
  drawerProductId: null,
  searchQuery: "",
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 0
  }
};

const productsSlice = createSlice({
  name: "products",
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
    clearSelection(state) {
      state.selectedIds = [];
    },
    openDrawer(state, action) {
      state.drawerProductId = action.payload;
    },
    closeDrawer(state) {
      state.drawerProductId = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.pagination.totalItems = action.payload.meta?.totalItems || action.payload.items.length;
        state.stats = buildStats(action.payload.items);
      })
      .addCase(archiveProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.stats = buildStats(state.items);
      })
      .addCase(archiveSelected.fulfilled, (state) => {
        state.selectedIds = [];
      })
      .addCase(deleteProducts.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.payload.includes(item.id));
        state.selectedIds = [];
        state.stats = buildStats(state.items);
      });
  }
});

export { fetchProducts, archiveProduct, archiveSelected, deleteProducts };
export const {
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  openDrawer,
  closeDrawer,
  setSearchQuery,
  setPage
} = productsSlice.actions;
export default productsSlice.reducer;
