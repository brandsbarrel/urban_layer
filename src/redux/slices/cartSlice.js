import { createSlice } from '@reduxjs/toolkit';

// Mock initial items — sirf demo ke liye, taaki cart badge functional dikhe.
// Real backend integration ke time initialState empty array [] ho jayega.
const initialState = {
    items: [
        { id: 'carbon-stealth-pro', name: 'Carbon Stealth Pro', price: 2499, quantity: 1 },
        { id: 'signature-leather', name: 'Signature Leather', price: 3299, quantity: 1 },
    ],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existing = state.items.find((item) => item.id === action.payload.id);
            if (existing) {
                existing.quantity += action.payload.quantity || 1;
            } else {
                state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
            }
        },
        removeFromCart(state, action) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        updateQuantity(state, action) {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) item.quantity = action.payload.quantity;
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const selectCartCount = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;