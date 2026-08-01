import { createSlice } from '@reduxjs/toolkit';

// Mock initial items — matches the Cart page reference design.
// Real backend integration ke time initialState empty array [] ho jayega.
const initialState = {
  items: [
    {
      id: 'heritage-leather-case',
      name: 'Heritage Leather Case',
      subtitle: 'iPhone 15 Pro Max • Cognac Brown',
      price: 4999,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBln0BjxWttIcUuW3dHk8rki85-d17Imq9P9f5pInYpK-b4iWRK_uZUpj9xKA-UGv-BjjHeSsVCn9nt00byK-djjs9CTfDqONlWjcdvmBL7ZrfIvMhghM7XyhpgnmHdY0-JFypUSByFDqPRnTTH3QC-V9LGAF8HP5m0feER8Wvy6bIq7ezTJhkkaI6QRKOzCzctvr_jD4oqgafxT9k3wOnT1zBqaRbwqrnKbS1yBWC3HWH7sV_MmHLmhStqd66ddDMmO1CPm9VbDEQ',
    },
    {
      id: 'carbon-stealth-ii',
      name: 'Carbon Stealth II',
      subtitle: 'iPhone 15 Pro • Matte Obsidian',
      price: 6499,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAR7Vc-qqmBSR4uq7XV6cIJEubaSJYz0anWi0vNr47HaA5bbmd1FSH1zRsToXH3PhGsDKVJ6PYMRMOyC956Ig38kAgTeuylXNlQMkE-S3_WnfYOxEMSKtW6WOwfmPgiv-N0dSFqZIQA1gWMnCXd6jTkahpWirRtXaQoxokQpA-cNj21R-2keMCq7tb70EHb8ZQQXi6JhQK96Tk5toX2pE0CHe5d4y52qlvzXBVvaI5s4V9Zawoj3M5moDsJTBShyWwAb7PjzhL85u0',
    },
    {
      id: 'sapphire-guard-pro',
      name: 'Sapphire Guard Pro',
      subtitle: 'Camera Lens Protector • Clear Sapphire',
      price: 1999,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDN2KeVzXwtqBJRETmJuUgT-S8JBQum3uNzxZGAOD9B6ibxOvu9hDdT5wwNh7-G0xpOENyc4OKs3j7pXEdszl8dM0FyrzuFGcUZunBYWO_k4iEciCrdRZtNVJ4eJjf0MoW-hdO5OPcPF4JloQPefHNjgRIRQSru1f3rHUj37DYspK4lgxubcw5LFGWOcRjV0U_D1WZUA0RlMp0O8DS8k6rvNAxudRRQtzHjkhKuxDttZiFlDlvazVWJXbRGpSOBokW-6k6haPjXfgs',
    },
  ],
  savedForLater: [],
  promoCode: null,
  promoError: null,
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
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    incrementQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    moveToSaved(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        state.savedForLater.push(item);
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    moveToCart(state, action) {
      const item = state.savedForLater.find((item) => item.id === action.payload);
      if (item) {
        state.items.push(item);
        state.savedForLater = state.savedForLater.filter((i) => i.id !== action.payload);
      }
    },
    removeFromSaved(state, action) {
      state.savedForLater = state.savedForLater.filter((item) => item.id !== action.payload);
    },
    applyPromoCode(state, action) {
      const code = action.payload.toUpperCase();
      const validCodes = ['WELCOME10'];
      if (validCodes.includes(code)) {
        state.promoCode = code;
        state.promoError = null;
      } else {
        state.promoError = 'Invalid promo code. Please try again.';
      }
    },
    clearPromoCode(state) {
      state.promoCode = null;
      state.promoError = null;
    },
    clearCart(state) {
      state.items = [];
      state.promoCode = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  moveToSaved,
  moveToCart,
  removeFromSaved,
  applyPromoCode,
  clearPromoCode,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectSavedForLater = (state) => state.cart.savedForLater;
export const selectPromoCode = (state) => state.cart.promoCode;
export const selectPromoError = (state) => state.cart.promoError;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;