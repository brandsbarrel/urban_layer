import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    meta: {
        page: 1,
        perPage: 9,
        totalItems: 0,
        totalPages: 1,
    },
    loading: false,
    error: null,
};

const getProductItems = (payload = {}) => {
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.products)) return payload.products;
    return [];
};

const getProductMeta = (payload = {}, itemCount = 0) => ({
    page: Number(payload?.meta?.page || payload?.page || 1),
    perPage: Number(payload?.meta?.perPage || payload?.meta?.limit || payload?.perPage || 9),
    totalItems: Number(payload?.meta?.totalItems || payload?.meta?.total || payload?.total || itemCount),
    totalPages: Number(payload?.meta?.totalPages || payload?.totalPages || 1),
});

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        fetchProductsStart(state) {
            state.loading = true;
            state.error = null;
        },

        fetchProductsSuccess(state, action) {
            state.loading = false;
            state.items = getProductItems(action.payload);
            state.meta = getProductMeta(action.payload, state.items.length);
        },

        fetchProductsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
} = productSlice.actions;

export const selectProducts = (state) => state.products;

export default productSlice.reducer;
