import { createSlice } from "@reduxjs/toolkit";

const emptyForm = {
  id: null,
  code: "",
  title: "",
  subtitle: "",
  discountType: "Percentage",
  discountValue: "",
  minOrderValue: "",
  maxRedemption: "",
  startDate: "",
  endDate: "",
  status: "Scheduled",
};

const initialState = {
  stats: [
    { id: "campaigns", label: "Total Campaigns", value: "24", note: "+12% from last month", tone: "up", icon: "campaign" },
    { id: "active", label: "Active Coupons", value: "12", note: "Maintaining target reach", tone: "neutral", icon: "confirmation_number" },
    { id: "revenue", label: "Revenue Generated", value: "$428k", note: "+8.4% vs prev period", tone: "up", icon: "payments" },
    { id: "discount", label: "Average Discount", value: "15%", note: "Within margin safety zone", tone: "neutral", icon: "percent" },
  ],
  items: [
    {
      id: "SUMMER24",
      code: "SUMMER24",
      title: "SUMMER24",
      subtitle: "High-Season Fashion Promotion",
      type: "Flash Sale",
      discountType: "Percentage",
      discountValue: "25",
      minOrderValue: "150.00",
      maxRedemption: "Unlimited",
      status: "Active",
      revenue: 124000,
      redemptions: 1240,
      avgBasket: 210,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      progressPercent: 65,
      heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAON2ATuSf_FQu6Ho-AGtxP2o4A_hMxvDz456Pi-dCh5DnZu5mBc0DgDxTLf9VUssMay1cmxrAGHbKUpIf03ajF5MUNZNGTnvuSBDMMX3rKVVBfYhaS06jbPVJ9eaKD-K6KUSLwjFC7H48bvoczOPvj5rx1o-resAQJtsrWeZ_4a0ujSHTCmVY8ONEqFJdyXi2xrp0rTsQFu6aMTR8QONDVboA1IFmW990FKN7AI2j-7batzZLQN7ClA5EZ72jub3Z4c_IEbVvpy5Q",
      usageTrend: [40, 55, 45, 80, 70, 95, 85],
    },
    {
      id: "WELCOME10",
      code: "WELCOME10",
      title: "WELCOME10",
      subtitle: "First Order Promotion",
      type: "Direct Discount",
      discountType: "Percentage",
      discountValue: "10",
      minOrderValue: "0.00",
      maxRedemption: "Unlimited",
      status: "Active",
      revenue: 260400,
      redemptions: 1240,
      avgBasket: 210,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      progressPercent: 40,
      heroImage: null,
      usageTrend: [30, 40, 35, 50, 45, 60, 55],
    },
    {
      id: "BLACKGOLD",
      code: "BLACKGOLD",
      title: "BLACKGOLD",
      subtitle: "VIP Exclusive Offer",
      type: "Buy X Get Y",
      discountType: "BOGO",
      discountValue: "1",
      minOrderValue: "300.00",
      maxRedemption: "500",
      status: "Scheduled",
      revenue: 0,
      redemptions: 0,
      avgBasket: 0,
      startDate: "2024-12-01",
      endDate: "2024-12-08",
      progressPercent: 0,
      heroImage: null,
      usageTrend: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
  searchQuery: "",
  statusFilter: "All",
  typeFilter: "All",
  detailsDrawerId: null,
  formDrawerOpen: false,
  editingId: null,
  deleteTargetId: null,
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setTypeFilter(state, action) {
      state.typeFilter = action.payload;
    },
    openDetailsDrawer(state, action) {
      state.detailsDrawerId = action.payload;
    },
    closeDetailsDrawer(state) {
      state.detailsDrawerId = null;
    },
    openCreateDrawer(state) {
      state.formDrawerOpen = true;
      state.editingId = null;
    },
    openEditDrawer(state, action) {
      state.formDrawerOpen = true;
      state.editingId = action.payload;
      state.detailsDrawerId = null;
    },
    closeFormDrawer(state) {
      state.formDrawerOpen = false;
      state.editingId = null;
    },
    saveCoupon(state, action) {
      const data = action.payload;
      if (data.id) {
        const existing = state.items.find((c) => c.id === data.id);
        if (existing) Object.assign(existing, data);
      } else {
        state.items.unshift({
          ...data,
          id: data.code,
          revenue: 0,
          redemptions: 0,
          avgBasket: 0,
          progressPercent: 0,
          heroImage: null,
          usageTrend: [0, 0, 0, 0, 0, 0, 0],
        });
      }
      state.formDrawerOpen = false;
      state.editingId = null;
    },
    setStatus(state, action) {
      const { id, status } = action.payload;
      const coupon = state.items.find((c) => c.id === id);
      if (coupon) coupon.status = status;
    },
    setDeleteTarget(state, action) {
      state.deleteTargetId = action.payload;
    },
    confirmDelete(state) {
      state.items = state.items.filter((c) => c.id !== state.deleteTargetId);
      state.deleteTargetId = null;
      state.detailsDrawerId = null;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setTypeFilter,
  openDetailsDrawer,
  closeDetailsDrawer,
  openCreateDrawer,
  openEditDrawer,
  closeFormDrawer,
  saveCoupon,
  setStatus,
  setDeleteTarget,
  confirmDelete,
} = couponsSlice.actions;
export { emptyForm };
export default couponsSlice.reducer;