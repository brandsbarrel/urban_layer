import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";

const fetchHeroSlides = createAsyncThunk(
  "heroSlides/fetchHeroSlides",
  async (_, { getState }) => {
    const { page, perPage } = getState().heroSlides;
    const response = await apiRequest(`/admin/hero-slides?page=${page}&perPage=${perPage}`);
    return {
      items: response.data.items,
      meta: response.meta
    };
  }
);

const createHeroSlide = createAsyncThunk(
  "heroSlides/createHeroSlide",
  async (payload) => {
    const response = await apiRequest("/admin/hero-slides", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response.data;
  }
);

const updateHeroSlide = createAsyncThunk(
  "heroSlides/updateHeroSlide",
  async ({ id, ...payload }) => {
    const response = await apiRequest(`/admin/hero-slides/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return response.data;
  }
);

const toggleHeroSlideActive = createAsyncThunk(
  "heroSlides/toggleHeroSlideActive",
  async ({ id, isActive }) => {
    const response = await apiRequest(`/admin/hero-slides/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !isActive })
    });
    return response.data;
  }
);

const deleteHeroSlide = createAsyncThunk(
  "heroSlides/deleteHeroSlide",
  async (id) => {
    await apiRequest(`/admin/hero-slides/${id}`, {
      method: "DELETE"
    });
    return id;
  }
);

const reorderHeroSlide = createAsyncThunk(
  "heroSlides/reorderHeroSlide",
  async ({ id, order }) => {
    const response = await apiRequest(`/admin/hero-slides/${id}`, {
      method: "PUT",
      body: JSON.stringify({ order })
    });
    return response.data;
  }
);

const initialState = {
  items: [],
  page: 1,
  perPage: 20,
  totalItems: 0,
  totalPages: 1,
  loading: false,
  error: null,
  formModalOpen: false,
  editingSlide: null
};

const heroSlidesSlice = createSlice({
  name: "heroSlides",
  initialState,
  reducers: {
    setHeroSlidePage(state, action) {
      state.page = action.payload;
    },
    openCreateModal(state) {
      state.formModalOpen = true;
      state.editingSlide = null;
    },
    openEditModal(state, action) {
      state.formModalOpen = true;
      state.editingSlide = action.payload;
    },
    closeFormModal(state) {
      state.formModalOpen = false;
      state.editingSlide = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.meta?.totalItems || action.payload.items.length;
        state.totalPages = action.payload.meta?.totalPages || 1;
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load hero slides.";
      })
      .addCase(createHeroSlide.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((a, b) => a.order - b.order);
        state.totalItems += 1;
        state.formModalOpen = false;
        state.editingSlide = null;
      })
      .addCase(updateHeroSlide.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
          state.items.sort((a, b) => a.order - b.order);
        }
        state.formModalOpen = false;
        state.editingSlide = null;
      })
      .addCase(toggleHeroSlideActive.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(reorderHeroSlide.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
          state.items.sort((a, b) => a.order - b.order);
        }
      })
      .addCase(deleteHeroSlide.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems = Math.max(state.totalItems - 1, 0);
      });
  }
});

export {
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  toggleHeroSlideActive,
  deleteHeroSlide,
  reorderHeroSlide
};

export const {
  setHeroSlidePage,
  openCreateModal,
  openEditModal,
  closeFormModal
} = heroSlidesSlice.actions;

export default heroSlidesSlice.reducer;
