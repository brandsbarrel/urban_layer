import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../../api/wishlistApi';

const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);

const mapBackendWishlistItem = (product) => ({
  id: product.id,
  name: product.name,
  subtitle: product.phoneModel ? `${product.phoneModel.brand} ${product.phoneModel.name}` : product.sku || 'Standard',
  price: product.price,
  originalPrice: product.salePrice !== product.basePrice ? product.basePrice : null,
  badge: product.salePrice !== product.basePrice ? 'Sale' : null,
  rating: 4.5,
  reviewCount: 0,
  stockStatus: product.inStock ? 'in-stock' : 'out-of-stock',
  stockLabel: product.inStock ? 'In Stock' : 'Out of Stock',
  image: product.featuredImage || (product.images?.[0] || ''),
  inStock: product.inStock,
  stock: product.stock
});

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
  statusCache: {}
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('customerAccessToken');
    if (!token) {
      const currentItems = getState().wishlist.items;
      return { isApi: false, items: currentItems };
    }

    try {
      const data = await wishlistApi.getWishlist();
      const mappedItems = (data.items || []).map(mapBackendWishlistItem);
      return { isApi: true, data: mappedItems, count: data.count };
    } catch (error) {
      const currentItems = getState().wishlist.items;
      return { isApi: false, items: currentItems, error: error.response?.data?.message };
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async (productId, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('customerAccessToken');
    const product = getState().wishlist.items.find(item => item.id === productId);

    if (token && isValidObjectId(productId)) {
      try {
        const data = await wishlistApi.addItem(productId);
        const mappedItems = (data.items || []).map(mapBackendWishlistItem);
        return { isApi: true, data: mappedItems, productId };
      } catch (error) {
        if (product) {
          return { isApi: false, item: product };
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
      }
    }

    if (product) {
      return { isApi: false, item: product };
    }
    
    return rejectWithValue('Product not found');
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async (productId, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('customerAccessToken');

    if (token && isValidObjectId(productId)) {
      try {
        const data = await wishlistApi.removeItem(productId);
        const mappedItems = (data.items || []).map(mapBackendWishlistItem);
        return { isApi: true, data: mappedItems, productId };
      } catch (error) {
        return { isApi: false, productId };
      }
    }

    return { isApi: false, productId };
  }
);

export const checkWishlistStatusAsync = createAsyncThunk(
  'wishlist/checkWishlistStatusAsync',
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem('customerAccessToken');

    if (token && isValidObjectId(productId)) {
      try {
        const data = await wishlistApi.checkStatus(productId);
        return { productId, isWishlisted: data.isWishlisted };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist status');
      }
    }

    return { productId, isWishlisted: false };
  }
);

export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clearWishlistAsync',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('customerAccessToken');

    if (token) {
      try {
        await wishlistApi.clearWishlist();
        return { isApi: true };
      } catch (error) {
        return { isApi: false };
      }
    }

    return { isApi: false };
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem(state, action) {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
      if (action.payload.id) state.statusCache[action.payload.id] = true;
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (action.payload) state.statusCache[action.payload] = false;
    },
    removeItems(state, action) {
      state.items = state.items.filter((item) => !action.payload.includes(item.id));
      action.payload.forEach(id => { state.statusCache[id] = false; });
    },
    clearWishlist(state) {
      state.items = [];
      state.statusCache = {};
    },
    setWishlistStatus(state, action) {
      const { productId, isWishlisted } = action.payload;
      state.statusCache[productId] = isWishlisted;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.isApi && Array.isArray(action.payload.data)) {
          state.items = action.payload.data;
          action.payload.data.forEach(item => {
            state.statusCache[item.id] = true;
          });
        } else if (action.payload?.items) {
          state.items = action.payload.items;
          action.payload.items.forEach(item => {
            state.statusCache[item.id] = true;
          });
        }
        state.lastFetched = Date.now();
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.isApi && Array.isArray(action.payload.data)) {
          state.items = action.payload.data;
          action.payload.data.forEach(item => {
            state.statusCache[item.id] = true;
          });
        } else if (action.payload?.item) {
          const newItem = action.payload.item;
          const exists = state.items.some((item) => item.id === newItem.id);
          if (!exists) state.items.push(newItem);
          state.statusCache[newItem.id] = true;
        }
        if (action.payload?.productId) {
          state.statusCache[action.payload.productId] = true;
        }
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.isApi && Array.isArray(action.payload.data)) {
          state.items = action.payload.data;
          state.statusCache = {};
          action.payload.data.forEach(item => {
            state.statusCache[item.id] = true;
          });
        } else if (action.payload?.productId) {
          state.items = state.items.filter((item) => item.id !== action.payload.productId);
          state.statusCache[action.payload.productId] = false;
        }
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkWishlistStatusAsync.fulfilled, (state, action) => {
        if (action.payload?.productId) {
          state.statusCache[action.payload.productId] = action.payload.isWishlisted;
        }
      })
      .addCase(clearWishlistAsync.fulfilled, (state, action) => {
        state.items = [];
        state.statusCache = {};
      });
  },
});

export const { addItem, removeItem, removeItems, clearWishlist, setWishlistStatus } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistAvailableCount = (state) =>
  state.wishlist.items.filter((item) => item.inStock !== false && item.stockStatus !== 'out-of-stock').length;
export const selectWishlistTotalValue = (state) =>
  state.wishlist.items.reduce((total, item) => total + (item.price || 0), 0);
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistStatus = (state, productId) => state.wishlist.statusCache[productId] === true;

export default wishlistSlice.reducer;