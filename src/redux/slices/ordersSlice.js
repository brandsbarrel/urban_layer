import { createSlice } from '@reduxjs/toolkit';

const HERITAGE_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAITkNZ7vfVw__jZlDMhlwEXaY9Q8qNPqhvrSanscTI5fwdTE_gbUd5tO3mcaI1XLiPkoUZnnXVbEgQ8EPdpzwr-JZVxnJrJZKksA1MHitVKBPFGZSkYnwOZWvuWJYM5hJ6RmAK1kORrerVrVHjAcsLUZbVXWBz2KTlmywBV2H3hYT0BLOp1F9NrhXMw7jbp4AMLSD91SYQ8yW7lv8MYmKutkQcyRCl9h90rimgy8tnl8PwvlQzlfQgbwQRuNMnm0uHAIM07cJogNQ';

const initialState = {
    orders: [
        {
            id: 'UL-98234',
            placedAt: '2024-01-12T00:00:00.000Z',
            shippedAt: '2024-01-14T00:00:00.000Z',
            status: 'shipped', // -> "In Transit"
            items: [
                {
                    id: 'heritage-leather-obsidian-tan',
                    name: 'Heritage Leather Case — Obsidian/Tan',
                    subtitle: 'iPhone 15 Pro',
                    price: 4999,
                    quantity: 1,
                    image: HERITAGE_IMAGE,
                },
            ],
            contactInfo: {},
            shippingAddress: {},
            deliveryMethod: 'standard',
            estimatedDelivery: 'Jan 15 - Jan 17, 2024',
            totals: { subtotal: 4999, shipping: 0, tax: 900, total: 5899 },
        },
        {
            id: 'UL-97120',
            placedAt: '2024-01-02T00:00:00.000Z',
            deliveredAt: '2024-01-05T00:00:00.000Z',
            status: 'delivered',
            items: [
                {
                    id: 'architectural-stand',
                    name: 'Architectural Stand — Silver',
                    subtitle: 'Universal',
                    price: 6499,
                    quantity: 1,
                    image:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuADsuJzF5pE2drptYQFL4P0glqT9VO5ELXJIG0v_RTNrwoIY_9b5fy_gPawkwuLrdIzQc-JoKAfWBhu7V7Itn3XQ9BnIatHW11lxtj2XA4IfLQLTS3XHjDJm0T6bmBNvJrKf96xhf8175ts-5gUJGWd_zqV4VvAFp8sFQASasbzX9z5lewHihNAD_zGTgpe8NCXFdsgq2_cELWHjQB1Mh_Fkt-h1-H4o7zUEPVZWEK6Jmxptw-nCk-dZBR38kEun1CtGdM0Hi4xRU4',
                },
            ],
            contactInfo: {},
            shippingAddress: {},
            deliveryMethod: 'standard',
            estimatedDelivery: 'Jan 5, 2024',
            totals: { subtotal: 6499, shipping: 0, tax: 1170, total: 7669 },
        },
        {
            id: 'UL-96541',
            placedAt: '2023-12-17T00:00:00.000Z',
            deliveredAt: '2023-12-20T00:00:00.000Z',
            status: 'delivered',
            items: [
                {
                    id: 'silk-braid-cable-carbon',
                    name: 'Silk-Braid Cable — Carbon',
                    subtitle: 'Universal',
                    price: 899,
                    quantity: 2,
                    image:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDmuEb5i0eoOBM1uebm9nQalgFjcellT90FiqBcc2AENh6gHjMriMzq9qLHoNeY2_akLKyfsgOamxXqF50PX0ZzNlXdvJQFvWkZ9ogAGtbi8ihoQtxeNc_pZUJm31KzIF9j8rnJUN8387cTgivyIn-8ENEsEZleVxdaRG8CLWGVcgL6Z0Lrwks5WIHyvnInDDXX3yQT6H8OQLI94ayv_ponCM5vdbEsFVwSoV9_uiMm0EIchtbUroqSUNBJNpSHgty5aC7uXq6t_LE',
                },
            ],
            contactInfo: {},
            shippingAddress: {},
            deliveryMethod: 'standard',
            estimatedDelivery: 'Dec 20, 2023',
            totals: { subtotal: 1798, shipping: 0, tax: 324, total: 2122 },
        },
    ],
    lastOrderId: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        placeOrder(state, action) {
            state.orders.push(action.payload);
            state.lastOrderId = action.payload.id;
        },
        updateOrderStatus(state, action) {
            const order = state.orders.find((o) => o.id === action.payload.id);
            if (order) order.status = action.payload.status;
        },
    },
});

export const { placeOrder, updateOrderStatus } = ordersSlice.actions;
export const selectOrders = (state) => state.orders.orders;
export const selectOrdersCount = (state) => state.orders.orders.length;
export const selectMostRecentOrder = (state) => {
    const orders = state.orders.orders;
    return orders.length > 0 ? orders[orders.length - 1] : null;
};
export const selectLastOrder = (state) =>
    state.orders.orders.find((o) => o.id === state.orders.lastOrderId) || null;
export default ordersSlice.reducer;