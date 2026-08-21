import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const buildStats = (items) => {
  const activeCount = items.filter((item) => item.status === "Active").length;
  const totalAssigned = items.reduce((sum, item) => sum + (item.productsAssigned || 0), 0);
  const topCategory = [...items].sort((a, b) => (b.productsAssigned || 0) - (a.productsAssigned || 0))[0];

  return [
    { id: "total", label: "Total Categories", value: String(items.length), note: "Live backend data", noteTone: "primary" },
    { id: "active", label: "Active Categories", value: String(activeCount), note: `${items.length ? Math.round((activeCount / items.length) * 100) : 0}% RATIO`, noteTone: "badge" },
    { id: "assigned", label: "Products Assigned", value: totalAssigned.toLocaleString(), note: "trending_up", noteTone: "icon" },
    { id: "top", label: "Top Performer", value: topCategory?.name || "-", note: `${topCategory?.productsAssigned || 0} assigned`, noteTone: "primary" }
  ];
};

const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await apiRequest("/admin/categories");
  return response.data.items;
});

const addCategory = createAsyncThunk("categories/addCategory", async (payload) => {
  const response = await apiRequest("/admin/categories", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      slug: payload.slug.replace(/^\//, ""),
      description: payload.description || "",
      image: payload.image || "",
      phoneModels: payload.phoneModels || [],
      seoTitle: payload.seoTitle || "",
      seoDescription: payload.seoDescription || "",
      parent: payload.parentId || null
    })
  });

  return response.data;
});

const updateCategory = createAsyncThunk("categories/updateCategory", async ({ id, ...payload }) => {
  const response = await apiRequest(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: payload.name,
      slug: payload.slug.replace(/^\//, ""),
      description: payload.description || "",
      image: payload.image || "",
      phoneModels: payload.phoneModels || [],
    })
  });

  return response.data;
});

const hideCategory = createAsyncThunk("categories/hideCategory", async (id) => {
  const response = await apiRequest(`/admin/categories/${id}/toggle-visibility`, {
    method: "POST"
  });

  return response.data;
});

const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id) => {
  await apiRequest(`/admin/categories/${id}`, {
    method: "DELETE"
  });

  return id;
});

const moveCategory = createAsyncThunk("categories/moveCategory", async ({ id, direction }) => {
  const response = await apiRequest(`/admin/categories/${id}/move`, {
    method: "POST",
    body: JSON.stringify({ direction })
  });

  return response.data;
});

const initialState = {
  stats: buildStats([]),
  items: [],
  selectedIds: [],
  searchQuery: "",
  statusFilter: "All",
  parentFilter: "None",
  drawerOpen: false,
  editingId: null,
  activeMenuId: null,
  previewCategory: {
    revenue: "$0.00",
    activeOrders: 0,
    avgTicket: "$0.00",
    growthIndex: [20, 30, 40, 50, 60],
    heroImage: ""
  }
};

const categoriesSlice = createSlice({
  name: "categories",
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
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setParentFilter(state, action) {
      state.parentFilter = action.payload;
    },
    openDrawer(state, action) {
      state.drawerOpen = true;
      state.editingId = action.payload || null;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
      state.editingId = null;
    },
    toggleRowMenu(state, action) {
      state.activeMenuId = state.activeMenuId === action.payload ? null : action.payload;
    },
    closeRowMenu(state) {
      state.activeMenuId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.stats = buildStats(action.payload);
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.drawerOpen = false;
        state.editingId = null;
        state.stats = buildStats(state.items);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.drawerOpen = false;
        state.editingId = null;
        state.activeMenuId = null;
        state.stats = buildStats(state.items);
      })
      .addCase(hideCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.activeMenuId = null;
        state.stats = buildStats(state.items);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.activeMenuId = null;
        state.stats = buildStats(state.items);
      })
      .addCase(moveCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.activeMenuId = null;
      });
  }
});

export {
  fetchCategories,
  addCategory,
  updateCategory,
  hideCategory,
  deleteCategory,
  moveCategory
};
export const {
  toggleSelect,
  toggleSelectAll,
  setSearchQuery,
  setStatusFilter,
  setParentFilter,
  openDrawer,
  closeDrawer,
  toggleRowMenu,
  closeRowMenu
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
