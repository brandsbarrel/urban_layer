import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);

// Async thunks for API calls with seamless local fallback
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue, getState }) => {
  const token = localStorage.getItem('customerAccessToken');
  if (!token) {
    // Unauthenticated guest user: preserve local cart state without erroring
    const currentItems = getState().cart.items;
    return { isApi: false, items: currentItems };
  }

  try {
    const data = await cartApi.getCart();
    return { isApi: true, data };
  } catch (error) {
    const currentItems = getState().cart.items;
    return { isApi: false, items: currentItems, error: error.response?.data?.message };
  }
});

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (payload, { rejectWithValue, getState }) => {
    const productId = payload.productId || payload.id;
    const quantity = payload.quantity || 1;
    const variantId = payload.variantId || null;
    const token = localStorage.getItem('customerAccessToken');

    const itemToAdd = {
      id: productId,
      name: payload.name || payload.product?.name || 'Product',
      subtitle: payload.subtitle || payload.product?.subtitle || (variantId ? `Variant: ${variantId}` : ''),
      price: Number(payload.price || payload.product?.price || 0),
      quantity: quantity,
      image: payload.image || payload.product?.image || payload.product?.heroImage || '',
    };

    if (token && isValidObjectId(productId)) {
      try {
        const data = await cartApi.addItem(productId, quantity, variantId);
        return { isApi: true, data };
      } catch (error) {
        return { isApi: false, item: itemToAdd };
      }
    }

    return { isApi: false, item: itemToAdd };
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ productId, quantity, variantId = null }, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('customerAccessToken');

    if (token && isValidObjectId(productId)) {
      try {
        const data = await cartApi.updateItem(productId, quantity, variantId);
        return { isApi: true, data };
      } catch (error) {
        return { isApi: false, productId, quantity };
      }
    }

    return { isApi: false, productId, quantity };
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ productId, variantId = null }, { rejectWithValue }) => {
    const token = localStorage.getItem('customerAccessToken');

    if (token && isValidObjectId(productId)) {
      try {
        const data = await cartApi.removeItem(productId, variantId);
        return { isApi: true, data };
      } catch (error) {
        return { isApi: false, productId };
      }
    }

    return { isApi: false, productId };
  }
);

export const checkoutCartAsync = createAsyncThunk(
  'cart/checkoutCartAsync',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await cartApi.checkout(checkoutData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Checkout failed');
    }
  }
);

const initialState = {
  items: [],
  savedForLater: [],
  promoCode: null,
  promoError: null,
  loading: false,
  error: null,
};

const mapBackendCartItems = (backendItems = []) => {
  return backendItems.map((item) => ({
    id: item.productId,
    name: item.name,
    subtitle: `${item.sku || ''} ${item.variantId ? '• ' + item.variantId : ''}`.trim() || 'Default',
    price: Math.round(item.unitPrice),
    quantity: item.quantity,
    image: item.image,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const payload = action.payload || {};
      const id = payload.id || payload.productId;
      if (!id) return;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += payload.quantity || 1;
      } else {
        state.items.push({
          id: id,
          name: payload.name || 'Product',
          subtitle: payload.subtitle || '',
          price: Number(payload.price || 0),
          quantity: payload.quantity || 1,
          image: payload.image || '',
        });
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload || {};
      const item = state.items.find((item) => item.id === id);
      if (item) item.quantity = Math.max(1, quantity);
    },
    incrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    moveToSaved(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        state.savedForLater.push(item);
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    moveToCart(state, action) {
      const id = action.payload;
      const item = state.savedForLater.find((item) => item.id === id);
      if (item) {
        state.items.push(item);
        state.savedForLater = state.savedForLater.filter((i) => i.id !== id);
      }
    },
    removeFromSaved(state, action) {
      const id = action.payload;
      state.savedForLater = state.savedForLater.filter((item) => item.id !== id);
    },
    applyPromoCode(state, action) {
      const code = (action.payload || '').toUpperCase();
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
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.isApi && action.payload?.data?.items) {
          state.items = mapBackendCartItems(action.payload.data.items);
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        }
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.isApi && action.payload?.data?.items) {
          state.items = mapBackendCartItems(action.payload.data.items);
        } else if (action.payload?.item) {
          const newItem = action.payload.item;
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            state.items.push(newItem);
          }
        }
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.loading = false;
      })
      // Update cart item
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        if (action.payload?.isApi && action.payload?.data?.items) {
          state.items = mapBackendCartItems(action.payload.data.items);
        } else if (action.payload) {
          const { productId, quantity } = action.payload;
          const item = state.items.find((i) => i.id === productId);
          if (item) item.quantity = Math.max(1, quantity);
        }
      })
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        if (action.payload?.isApi && action.payload?.data?.items) {
          state.items = mapBackendCartItems(action.payload.data.items);
        } else if (action.payload) {
          const { productId } = action.payload;
          state.items = state.items.filter((i) => i.id !== productId);
        }
      })
      // Checkout cart
      .addCase(checkoutCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.paymentMethod === 'COD' || action.payload?.status === 'Confirmed') {
          state.items = [];
          state.promoCode = null;
        }
      })
      .addCase(checkoutCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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

export const selectCartItems = (state) => state.cart.items || [];
export const selectSavedForLater = (state) => state.cart.savedForLater || [];
export const selectPromoCode = (state) => state.cart.promoCode;
export const selectPromoError = (state) => state.cart.promoError;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartCount = (state) =>
  (state.cart.items || []).reduce((total, item) => total + (item?.quantity || 0), 0);
export default cartSlice.reducer;