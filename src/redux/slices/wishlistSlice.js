import { createSlice } from '@reduxjs/toolkit';

const HERITAGE_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB7nv_zGUWwo0sllZM21wqbb1NS_xywtcvk6YsfjFPfg-qLKEQJ2lEis2CjKWaDiQMjVufw9htnkIb_zXEZZf5GOOpGYT4vJyAK6q5bOOOevn1U7Omai9TFL7mDk0-QdHINfiOL7UD9RDkyj71cfEEG_YD31J872Kv8B3rFAlu_svCssF3l1XhHjgTp7H_L7A9U4OV_bh0qKl4ekIWb4DOQFbVfCCa3vt3amwqEDGoJnhTnwdpe1ixHcC6r6gp29Nq_DsvCMslJ0ZI';

const initialState = {
    items: [
        {
            id: 'heritage-leather-wl',
            name: 'Heritage Leather',
            subtitle: 'Italian Full-Grain Cognac',
            price: 89,
            originalPrice: null,
            badge: 'New Arrival',
            rating: 4.5,
            reviewCount: 48,
            stockStatus: 'in-stock',
            stockLabel: 'In Stock',
            image: HERITAGE_IMAGE,
        },
        {
            id: 'carbon-stealth-wl',
            name: 'Carbon Stealth',
            subtitle: 'Military-Grade Carbon Fiber',
            price: 120,
            originalPrice: null,
            badge: null,
            rating: 5,
            reviewCount: 12,
            stockStatus: 'low-stock',
            stockLabel: 'Only 2 Left',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB9RMw-Cc4iASezo87mTsyTuzn3SxVGPiCTh5hiOiCZ9HiOgSev2QZKixUSETJxpLrfFNaxlWLOKK9s87Q36c9kF-mLgXsxLo4yY5AKB4Nf0ahikJtQSXvIXEs8gxH5CpHGRoqcDyN9Yuf5LA350em2ffisOT-f4XhM4vEVbM7dNCE0eLGhwYgFbEVeB6IlJQJ0mSmK-VdYakycaQSiE5fxJLK0IAfkuvDrISHE8PpUEu4FcwvhgXRHyK8_lRJObqQ4_CfHGJtagQc',
        },
        {
            id: 'crystal-magsafe-wl',
            name: 'Crystal MagSafe',
            subtitle: 'UV-Resistant Clear Case',
            price: 45,
            originalPrice: 65,
            badge: 'Sale',
            rating: 4,
            reviewCount: 156,
            stockStatus: 'in-stock',
            stockLabel: 'In Stock',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCH2d18XgZO7Fg_LIFgSvdDxYPj22V3ugzBBEEq1pN84tvMJScvYKENbG05BDPnxpSCYdjcG4cS-m-PbIhHEq7UFrklZ7MisdgoKNJKpkssWSdVsvDu0V73GGOgETTUqPQggtzMEJxpxtAGZ9H3E47dckHf9ogzcYrbaCvzY-pwU0Ig0ePA3OPYj0Zxz4mouKl_1QWiPzt_szA-x6vz6gM25IjY6ngsdy9a54yhSRQA1u10HThREa4gN0wTlpKdSueUYMs6j0tH2IQ',
        },
        {
            id: 'urban-magwallet-wl',
            name: 'Urban MagWallet',
            subtitle: 'RFID-Blocking Slim Leather',
            price: 55,
            originalPrice: null,
            badge: null,
            rating: 5,
            reviewCount: 24,
            stockStatus: 'in-stock',
            stockLabel: 'In Stock',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAvKim1s7TQ3_w-AdRrI4XDDSMDSqGeAFx2bk6hd_jCfjap2_r3Y5KVqZG0Pjbc0u7i_SJJ0Q7tqpSTZ1TOna7PVA1RJtr6N-OX_XZuPtTLq6Q62gaCuVO66RQM4vY-QsZBVqUHfLZnq33Zi_dazAKUexn7oFg82Ar0yhHVAJARBVloSq27VEehwjP_ygUf-gLhyiXgXhXTKLMao7DAPRsszEb8lDtnIueFsoI5qtO2eeDv0tzevtuNlOswt2RNcfA_cgQlYofzTfo',
        },
    ],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addItem(state, action) {
            const exists = state.items.some((item) => item.id === action.payload.id);
            if (!exists) state.items.push(action.payload);
        },
        removeItem(state, action) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        removeItems(state, action) {
            state.items = state.items.filter((item) => !action.payload.includes(item.id));
        },
        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, removeItems, clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistAvailableCount = (state) =>
    state.wishlist.items.filter((item) => item.stockStatus === 'in-stock').length;
export const selectWishlistTotalValue = (state) =>
    state.wishlist.items.reduce((total, item) => total + item.price, 0);
export default wishlistSlice.reducer;