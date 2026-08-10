import { createSlice } from "@reduxjs/toolkit";

// Valid forward transitions per the workflow's Order Status Workflow (Section 11).
// Any transition not listed here is invalid and must not be offered.
export const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered",
};

export const ACTION_LABEL = {
  Confirmed: "Confirm Order",
  Packed: "Mark Packed",
  Shipped: "Mark Shipped",
  "Out for Delivery": "Mark Out for Delivery",
  Delivered: "Mark Delivered",
};

const STATUS_TONE = {
  Pending: "amber",
  Confirmed: "blue",
  Packed: "blue",
  Shipped: "blue",
  "Out for Delivery": "blue",
  Delivered: "green",
  Cancelled: "red",
};

const initialState = {
  stats: [
    { id: "total", label: "Total Orders", value: 2842, change: "+12.5%", icon: "shopping_bag", tone: "primary" },
    { id: "pending", label: "Pending", value: 124, note: "+12 urgent today", tone: "amber" },
    { id: "shipped", label: "Shipped", value: 458, note: "65% on schedule for delivery", tone: "blue" },
    { id: "delivered", label: "Delivered", value: 2260, note: "Average delivery: 2.4 days", tone: "green" },
  ],
  items: [
    {
      id: "UL-2934",
      placedAt: "Oct 12, 10:45 AM",
      customer: { name: "Elena Rodriguez", email: "elena.r@lifestyle.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAptbBmwEmw77q2byuxsVIcVXDFEs7ZxAqIsnkZDPSbx55cbt7Ydx6q0qm9spxRykcTn63Jnuhaub1eTu9pvq84TvZAy5huR2ehNtyxaTzzNUUEYqXpkg3V-Hfeyzmimb6rRTBQyb0OTUgrA_xGPNemNd0ydyX6N0rbsCx5pNP5aH1lhAZ8el98HBHB3W1zalDcad5U_kBibvDPbWtVGBnBb462dpMuQ4HRsVdTneTw2v5UVZ66xLKZSxzWKHEduIO8rqpJiui8M2E" },
      products: [
        { id: "i1", name: "Obsidian Leather Tote", sku: "UL-ACC-012", variant: "Black", price: 950.0, qty: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2hhT4edSfXpWjxrXSo-21fyqZPFAg7FmCiAddVQAJ58WEIpyu7LaA75RxgNv5GaltEIKAGMKVpLcc7XN7ZmgV8ftIpxsRJVlGS40zJXW378Jz5Y3rclr2jhyxsFSyKZdH9_c5H2Wc29phgbhf9L_jT8MxjeZ_cc96WIanfUi8a-SKZLqKkTR3ghVkW2Cs2QwKsLiz1vJKjK25wT7IAV5vt_ooY17GGNGjvP2vsDUsOIzyBKT6Xx405PmtuaOo2RE7t1eZc2dDUnQ" },
        { id: "i2", name: "Gold-Frame Aviators", sku: "UL-SUN-005", variant: "Gold", price: 290.0, qty: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcQ5wN_oqK38jzEGMVAlT_3S4f48A4USzRaPmXiTrd7tQqaslNJfooKH7lrtL1dg8HkQ-ePNXxFfq0CefFMI5x8vVGlrrX_5N-Ft87jh7p_YO9e40fUpJSb-52T9NTTlGLkaEr97nY4wC5SERgDtLkiskwE7w-wm5LGqmH9rvSWU2IlZuyEArIas4LgEz8_8xQ1Z-T_fvZ5SzG0mu7Cfx4C6LKJfbTQIhrR7tgCTDXaOhRix846H_WPYGtkq6XMzU_y5bOFNjqW_Y" },
      ],
      amount: 1240.0,
      paymentMethod: "Card",
      paymentStatus: "Paid",
      status: "Shipped",
      shipping: {
        recipient: "Elena Rodriguez",
        address: "142 Lexington Ave, Suite 4B, New York, NY 10016",
        carrier: "DHL Priority Worldwide",
        trackingNumber: "#98421034293",
      },
      timeline: [
        { id: "t1", title: "Order Placed", date: "Oct 12, 2023 • 10:45 AM", note: "Payment verified via Stripe Enterprise Gateway.", done: true },
        { id: "t2", title: "Confirmed & Packaged", date: "Oct 12, 2023 • 01:30 PM", note: "Quality check passed by Warehouse Node 4.", done: true },
        { id: "t3", title: "In Transit", date: "Oct 13, 2023 • 09:12 AM", note: "Carrier: DHL Express (Tracking: #98421034293)", done: true, active: true },
        { id: "t4", title: "Out for Delivery", date: "Pending arrival at local hub", note: "", done: false },
      ],
      cancellationReason: null,
    },
    {
      id: "UL-2935",
      placedAt: "Oct 12, 11:20 AM",
      customer: { name: "Marcus Sterling", email: "m.sterling@globex.co", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIY_1qvNbJtAnV4LS8z-xa-6uL2OUuzQHTmtImtu2_7IBPiDOceEYux6h1iaDkg1J694yk8vZpxnuJBZEZo-yJkyfhJNiBwvRjq8UpiJBn3ddnq_Hg0PvxguZ5lYHO7HMaFpSzMabTa0WyX3OfFh7g4VXX66OhiCHzK3cTOfwBrFEpuzgQ9Yum4bZzpbhNZsZGa1JsMGUZ2ZxL3P1ARhIiqZmB0y1j6k7rKXl1L1XaYlRi5rrQfhu8fpbmKgbVTEP8SAQ5LWGZ5wM" },
      products: [
        { id: "i1", name: "Chrono Heritage Watch", sku: "UL-WCH-001", variant: "Gold/Black", price: 4850.0, qty: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4tv_3TJFOoPA3l_0ip3q7sysnp7w85uyZgmyAvdi_1dhQPlNJiFut6GvU1DXLuBXqrunsi53nP-pqAPtf_fqVfZwPpf34gnLmKCuXiPEAu7hBWicJR0MPUnbRPhQpn5v1ry_vJ0Fa0LQZpMrWcRGMmAI0OsfJEspxW9caumQGZUSadUu0TUyBOUNL2KfZw13cUf8gy-_5843_76XUc8Dcc631jIIElogYT8iKgpiy1WgJupx8aTBFAJaJNmx_4ginFx_PWaDckgM" },
      ],
      amount: 4850.0,
      paymentMethod: "Card",
      paymentStatus: "Pending",
      status: "Pending",
      shipping: {
        recipient: "Marcus Sterling",
        address: "8 Wall St, New York, NY 10005",
        carrier: "Not yet assigned",
        trackingNumber: null,
      },
      timeline: [
        { id: "t1", title: "Order Placed", date: "Oct 12, 2023 • 11:20 AM", note: "Awaiting payment confirmation.", done: true, active: true },
      ],
      cancellationReason: null,
    },
    {
      id: "UL-2936",
      placedAt: "Oct 11, 04:15 PM",
      customer: { name: "Sophie Chen", email: "sophie@chenstudio.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuItbGWHO1T9ju18sCnftJsDW-mUWVZFBOD1xtf4cLMtJriweTYOabNlk7KVHl1xtVMvpgd1-hv9FDxH9PHvWTI6ArNUHQ58k78RAsMILTk9ps-kNRqny9l-ZHfpOZoMDwasGxe5FNj4YWi48Mhb34U9UkVo8LW191GjNRpTD7_PSSVWddBOyvoBEffE1k9J5EQjW7jflpoJ88_mBAoAK66JD17Zvx3GKNUBAJbekCDSj2mg5suVn7DbeZ-pQceQbxRHxMw9X_GS0" },
      products: [
        { id: "i1", name: "Ceramic Vase Set", sku: "UL-HOM-021", variant: "White", price: 400.0, qty: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWkoFEtDko7poCIPi3G_aNAKqMPHp3mJyqtwInh1DsdzNRsmG08r7sCQUSw2tBci5XLhL1kpAEIYPQq2egTtUXxf-aMZ5AxI6Bpv4eO6Jk-MaJckYRr5CI5M3fvWfWKDp6--DuAtR9opdk8Vru62aN6T4-fiUNAfuLX5aU47beSsTIM4QDq34-YKLtqwruVyLczMfDcqcqh6znF-SjKglH5GJqFZSRXwDrlQlC6e5IbbQySUfxeSv6wpSqj46dJsiUZ_05J0EXre4" },
        { id: "i2", name: "Cashmere Scarf", sku: "UL-ACC-091", variant: "Beige", price: 490.0, qty: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChas7WHTWVsNt4cSQUIG7vIB0_fY5dIp4w972FtzDfc1cxwZlyEHiTlmrkXDiBfk_06SCzVdiJ9ZS_9eKQpTfUaVGB-SdUmW9mnfIr3GiEXN3XArQKiKu9omcSkiJ97Iw0z4s9od_dbzKN0r9HcnA2VTegTllYq3bwAqt2FY3VrBRAnt9Zlo1RfEjmUTtcTgfB8QM-8Utj6pDaOssyQXIXzCQpw1j1xi5TBkH2_-RYPrFwfihAUy9ZQuovjdnRgSDbASrQfjR9fbQ" },
      ],
      amount: 890.0,
      paymentMethod: "Card",
      paymentStatus: "Paid",
      status: "Delivered",
      shipping: {
        recipient: "Sophie Chen",
        address: "220 Bowery, New York, NY 10012",
        carrier: "DHL Priority Worldwide",
        trackingNumber: "#77234098120",
      },
      timeline: [
        { id: "t1", title: "Order Placed", date: "Oct 11, 2023 • 04:15 PM", note: "Payment verified.", done: true },
        { id: "t2", title: "Delivered", date: "Oct 13, 2023 • 02:00 PM", note: "Signed by recipient.", done: true, active: true },
      ],
      cancellationReason: null,
    },
  ],
  statusFilter: "All",
  paymentFilter: "All",
  dateRange: "",
  searchQuery: "",
  drawerOrderId: null,
  shipModalOpen: false,
  cancelModalOpen: false,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setPaymentFilter(state, action) {
      state.paymentFilter = action.payload;
    },
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    openDrawer(state, action) {
      state.drawerOrderId = action.payload;
    },
    closeDrawer(state) {
      state.drawerOrderId = null;
      state.shipModalOpen = false;
      state.cancelModalOpen = false;
    },
    openShipModal(state) {
      state.shipModalOpen = true;
    },
    closeShipModal(state) {
      state.shipModalOpen = false;
    },
    openCancelModal(state) {
      state.cancelModalOpen = true;
    },
    closeCancelModal(state) {
      state.cancelModalOpen = false;
    },
    // Advances an order exactly one valid step. Invalid calls are ignored
    // rather than silently succeeding, per the workflow's transition rules.
    advanceStatus(state, action) {
      const { orderId, timelineNote } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      if (!order) return;
      const next = NEXT_STATUS[order.status];
      if (!next) return;
      order.status = next;
      order.timeline.forEach((t) => delete t.active);
      order.timeline.push({
        id: `t${order.timeline.length + 1}`,
        title: ACTION_LABEL[next],
        date: new Date().toLocaleString(),
        note: timelineNote || "",
        done: true,
        active: true,
      });
    },
    setShippingInfo(state, action) {
      const { orderId, carrier, trackingNumber } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      if (!order) return;
      order.shipping.carrier = carrier;
      order.shipping.trackingNumber = trackingNumber;
    },
    cancelOrder(state, action) {
      const { orderId, reason } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      // Cancellation is only valid from Pending, per the workflow's
      // explicit status-transition rule.
      if (!order || order.status !== "Pending") return;
      order.status = "Cancelled";
      order.cancellationReason = reason;
      order.timeline.forEach((t) => delete t.active);
      order.timeline.push({
        id: `t${order.timeline.length + 1}`,
        title: "Order Cancelled",
        date: new Date().toLocaleString(),
        note: `Reason: ${reason}`,
        done: true,
        active: true,
      });
      state.cancelModalOpen = false;
    },
  },
});

export const {
  setStatusFilter,
  setPaymentFilter,
  setDateRange,
  setSearchQuery,
  openDrawer,
  closeDrawer,
  openShipModal,
  closeShipModal,
  openCancelModal,
  closeCancelModal,
  advanceStatus,
  setShippingInfo,
  cancelOrder,
} = ordersSlice.actions;
export { STATUS_TONE };
export default ordersSlice.reducer;