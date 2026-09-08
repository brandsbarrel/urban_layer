import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { addressesApi } from '../../api/addressesApi';

export const MAX_ADDRESSES = 3;

const STORAGE_KEY = 'urbanLayerSavedAddresses';

const hasToken = () => Boolean(localStorage.getItem('customerAccessToken'));

const readLocalAddresses = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeLocalAddresses = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const mapBackendAddress = (address, index) => ({
  id: `api-${index}`,
  sourceIndex: index,
  label: address.label || '',
  fullName: address.recipientName || '',
  street: address.line1 || '',
  city: address.city || '',
  state: address.state || '',
  pinCode: address.postalCode || '',
  phone: address.phone || '',
  isDefault: Boolean(address.isDefault),
});

const mapBackendAddresses = (addresses = []) => addresses.map(mapBackendAddress);

const toApiAddress = (address) => ({
  label: address.label?.trim() || '',
  recipientName: address.fullName.trim(),
  line1: address.street.trim(),
  line2: '',
  city: address.city.trim(),
  state: address.state.trim(),
  postalCode: address.pinCode.trim(),
  country: 'India',
  phone: address.phone?.replace(/[\s-]/g, '').trim() || '',
  isDefault: Boolean(address.isDefault),
});

const normalizeLocalAddress = (address) => ({
  id: address.id || `addr-${nanoid(6)}`,
  label: address.label?.trim() || '',
  fullName: address.fullName?.trim() || '',
  street: address.street?.trim() || '',
  city: address.city?.trim() || '',
  state: address.state?.trim() || '',
  pinCode: address.pinCode?.trim() || '',
  phone: address.phone?.trim() || '',
  isDefault: Boolean(address.isDefault),
});

const ensureSingleDefault = (items, preferredId) => {
  if (items.length === 0) return items;
  const defaultId = preferredId || items.find((item) => item.isDefault)?.id || items[0].id;
  return items.map((item) => ({ ...item, isDefault: item.id === defaultId }));
};

export const fetchAddresses = createAsyncThunk('addresses/fetchAddresses', async (_, { rejectWithValue }) => {
  if (!hasToken()) {
    return { items: readLocalAddresses(), source: 'local' };
  }

  try {
    const addresses = await addressesApi.getAddresses();
    return { items: mapBackendAddresses(addresses), source: 'api' };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Unable to fetch addresses.');
  }
});

export const addAddressAsync = createAsyncThunk(
  'addresses/addAddress',
  async (address, { getState, rejectWithValue }) => {
    const currentItems = getState().addresses.items;
    if (currentItems.length >= MAX_ADDRESSES) {
      return rejectWithValue(`You can save a maximum of ${MAX_ADDRESSES} addresses.`);
    }

    if (!hasToken()) {
      const nextAddress = normalizeLocalAddress({
        ...address,
        isDefault: address.isDefault || currentItems.length === 0,
      });
      const items = ensureSingleDefault([...currentItems, nextAddress], nextAddress.isDefault ? nextAddress.id : null);
      writeLocalAddresses(items);
      return { items, selectedId: nextAddress.id, source: 'local' };
    }

    try {
      const addresses = await addressesApi.addAddress(toApiAddress({
        ...address,
        isDefault: address.isDefault || currentItems.length === 0,
      }));
      const items = mapBackendAddresses(addresses);
      return { items, selectedId: items[items.length - 1]?.id || null, source: 'api' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unable to save address.');
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  'addresses/updateAddress',
  async (address, { getState, rejectWithValue }) => {
    const currentItems = getState().addresses.items;
    const index = currentItems.findIndex((item) => item.id === address.id);
    if (index === -1) {
      return rejectWithValue('Address not found.');
    }

    if (!hasToken()) {
      const items = currentItems.map((item) => (
        item.id === address.id ? normalizeLocalAddress({ ...item, ...address }) : item
      ));
      const normalized = ensureSingleDefault(items, address.isDefault ? address.id : null);
      writeLocalAddresses(normalized);
      return { items: normalized, selectedId: address.id, source: 'local' };
    }

    try {
      const sourceIndex = currentItems[index].sourceIndex ?? index;
      const addresses = await addressesApi.updateAddress(sourceIndex, toApiAddress(address));
      return { items: mapBackendAddresses(addresses), selectedId: `api-${sourceIndex}`, source: 'api' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unable to update address.');
    }
  }
);

export const deleteAddressAsync = createAsyncThunk(
  'addresses/deleteAddress',
  async (id, { getState, rejectWithValue }) => {
    const currentItems = getState().addresses.items;
    const index = currentItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return rejectWithValue('Address not found.');
    }

    if (!hasToken()) {
      const items = ensureSingleDefault(currentItems.filter((item) => item.id !== id));
      writeLocalAddresses(items);
      return { items, deletedId: id, source: 'local' };
    }

    try {
      const sourceIndex = currentItems[index].sourceIndex ?? index;
      const addresses = await addressesApi.deleteAddress(sourceIndex);
      return { items: mapBackendAddresses(addresses), deletedId: id, source: 'api' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unable to delete address.');
    }
  }
);

const initialState = {
  items: [],
  selectedForCheckoutId: null,
  status: 'idle',
  error: null,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setSelectedForCheckout(state, action) {
      state.selectedForCheckoutId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.items = [];
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = ensureSingleDefault(action.payload.items || []);
        if (!state.items.some((item) => item.id === state.selectedForCheckoutId)) {
          state.selectedForCheckoutId = state.items.find((item) => item.isDefault)?.id || state.items[0]?.id || null;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to fetch addresses.';
        state.items = [];
      })
      .addCase(addAddressAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addAddressAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.items = ensureSingleDefault(action.payload.items || []);
        state.selectedForCheckoutId = action.payload.selectedId || state.selectedForCheckoutId;
      })
      .addCase(addAddressAsync.rejected, (state, action) => {
        state.error = action.payload || 'Unable to save address.';
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        state.error = null;
        state.items = ensureSingleDefault(action.payload.items || []);
        if (action.payload.selectedId) {
          state.selectedForCheckoutId = action.payload.selectedId;
        }
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.error = action.payload || 'Unable to update address.';
      })
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        state.error = null;
        state.items = ensureSingleDefault(action.payload.items || []);
        if (state.selectedForCheckoutId === action.payload.deletedId) {
          state.selectedForCheckoutId = state.items.find((item) => item.isDefault)?.id || state.items[0]?.id || null;
        }
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.error = action.payload || 'Unable to delete address.';
      });
  },
});

export const { setSelectedForCheckout } = addressesSlice.actions;

export const selectAddresses = (state) => state.addresses.items;
export const selectAddressCount = (state) => state.addresses.items.length;
export const selectAddressesStatus = (state) => state.addresses.status;
export const selectAddressesError = (state) => state.addresses.error;
export const selectSelectedCheckoutAddressId = (state) => state.addresses.selectedForCheckoutId;
export const selectSelectedCheckoutAddress = (state) => {
  const id = state.addresses.selectedForCheckoutId;
  return state.addresses.items.find((a) => a.id === id) || null;
};

export default addressesSlice.reducer;
