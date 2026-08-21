import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    items: [
        {
            id: 'addr-home',
            label: 'Home',
            fullName: 'Aniket Sharma',
            street: 'Apartment 402, Skyline Residency, Palm Drive, Sector 56',
            city: 'Gurugram',
            state: 'Haryana',
            pinCode: '122011',
            phone: '+91 98765 43210',
            isDefault: true,
        },
        {
            id: 'addr-office',
            label: 'Office',
            fullName: 'Aniket Sharma',
            street: 'Cyber Hub Tower C, 12th Floor, Digital Avenue, DLF Phase 3',
            city: 'Gurugram',
            state: 'Haryana',
            pinCode: '122002',
            phone: '+91 98765 43210',
            isDefault: false,
        },
    ],
    selectedForCheckoutId: null,
};

const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {
        addAddress: {
            reducer(state, action) {
                state.items.push(action.payload);
                if (action.payload.isDefault) {
                    state.items.forEach((addr) => {
                        addr.isDefault = addr.id === action.payload.id;
                    });
                }
            },
            prepare(address) {
                return { payload: { id: `addr-${nanoid(6)}`, ...address } };
            },
        },
        updateAddress(state, action) {
            const index = state.items.findIndex((a) => a.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
                if (action.payload.isDefault) {
                    state.items.forEach((addr) => {
                        addr.isDefault = addr.id === action.payload.id;
                    });
                }
            }
        },
        deleteAddress(state, action) {
            state.items = state.items.filter((a) => a.id !== action.payload);
        },
        setDefaultAddress(state, action) {
            state.items.forEach((addr) => {
                addr.isDefault = addr.id === action.payload;
            });
        },
        setSelectedForCheckout(state, action) {
            state.selectedForCheckoutId = action.payload;
        },
    },
});

export const {
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedForCheckout,
} = addressesSlice.actions;

export const selectAddresses = (state) => state.addresses.items;
export const selectAddressCount = (state) => state.addresses.items.length;
export const selectSelectedCheckoutAddress = (state) => {
    const id = state.addresses.selectedForCheckoutId;
    return state.addresses.items.find((a) => a.id === id) || null;
};
export default addressesSlice.reducer;