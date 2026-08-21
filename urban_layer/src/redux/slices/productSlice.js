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
            state.items = action.payload.data.items;
            state.meta = action.payload.meta;
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