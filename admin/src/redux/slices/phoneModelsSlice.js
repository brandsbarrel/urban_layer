import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const fetchPhoneModels = createAsyncThunk("phoneModels/fetchPhoneModels", async (_, { getState }) => {
  const { page, perPage, searchQuery, activeFilter } = getState().phoneModels;
  const response = await apiRequest(
    `/admin/phone-models?page=${page}&perPage=${perPage}&search=${encodeURIComponent(searchQuery)}&active=${activeFilter}`
  );

  return {
    items: response.data.items,
    meta: response.meta
  };
});

const addPhoneModel = createAsyncThunk("phoneModels/addPhoneModel", async (payload) => {
  const response = await apiRequest("/admin/phone-models", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
});

const updatePhoneModel = createAsyncThunk("phoneModels/updatePhoneModel", async ({ id, ...payload }) => {
  const response = await apiRequest(`/admin/phone-models/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  return response.data;
});

const togglePhoneModelActive = createAsyncThunk("phoneModels/togglePhoneModelActive", async (id) => {
  const response = await apiRequest(`/admin/phone-models/${id}/toggle-active`, {
    method: "POST"
  });

  return response.data;
});

const deletePhoneModel = createAsyncThunk("phoneModels/deletePhoneModel", async (id) => {
  await apiRequest(`/admin/phone-models/${id}`, {
    method: "DELETE"
  });

  return id;
});

const initialState = {
  items: [],
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 1,
  searchQuery: "",
  activeFilter: "All",
  loading: false,
  error: null
};

const phoneModelsSlice = createSlice({
  name: "phoneModels",
  initialState,
  reducers: {
    setPhoneModelSearch(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPhoneModelActiveFilter(state, action) {
      state.activeFilter = action.payload;
      state.page = 1;
    },
    setPhoneModelPage(state, action) {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhoneModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhoneModels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.meta?.totalItems || action.payload.items.length;
        state.totalPages = action.payload.meta?.totalPages || 1;
      })
      .addCase(fetchPhoneModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unable to load phone models.";
      })
      .addCase(addPhoneModel.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(updatePhoneModel.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(togglePhoneModelActive.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePhoneModel.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems = Math.max(state.totalItems - 1, 0);
      });
  }
});

export { fetchPhoneModels, addPhoneModel, updatePhoneModel, togglePhoneModelActive, deletePhoneModel };
export const { setPhoneModelSearch, setPhoneModelActiveFilter, setPhoneModelPage } = phoneModelsSlice.actions;
export default phoneModelsSlice.reducer;
