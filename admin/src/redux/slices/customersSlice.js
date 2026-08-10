import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: [
    { id: "total", label: "Total Customers", value: "12,482", change: "+12.5%", trend: "up", tone: "primary", icon: "group" },
    { id: "vip", label: "Active VIPs", value: "842", change: "+4.2%", trend: "up", tone: "tertiary", icon: "diamond" },
    { id: "points", label: "Reward Points Issued", value: "2.1M", change: "-2.1%", trend: "down", tone: "primary", icon: "stars" },
    { id: "retention", label: "Retention Rate", value: "94.2%", change: "+0.8%", trend: "up", tone: "neutral", icon: "refresh" },
  ],
  items: [
    {
      id: "UL-88219",
      name: "Isabella Montclaire",
      email: "i.montclaire@vogue.fr",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY17pIGaruR2RfVZL2yyMwA3udgyTB-1QMkibEvn0CneOQjPhg7skbpIBMJMV_a4c-lnTOy4Wpab-NT4PMU3yLcUOzwd7Y0f53ocsITcpTzM_Np76IMjbg0pFtoyufLs3cV9pEShhdxapXrODxL5QF0wJH7BerWrw6Pfemrzig6_EtsKsubEhLX8XO8MssZZjRmJUvvap9sycndWN43RxN7dk317EVPKCINPWNYIR3Efs03oY7zN6VWpDwDl6hiaXBg3KrqVQ71Ew",
      totalOrders: 42,
      lifetimeSpend: 12480.0,
      rewardPoints: 24500,
      status: "VIP Elite",
      lastLogin: "2 Hours Ago",
      customerSince: "Jan 12, 2021",
      avgOrderValue: 297.14,
      returnRate: "2.4%",
      tier: "PLATINUM LEVEL",
      activity: [
        { id: "a1", icon: "shopping_bag", title: "Order #UL-7721 Placed", meta: "$1,420.00 • 2 items • 4 hours ago" },
        { id: "a2", icon: "login", title: "Logged In", meta: "IP: 192.168.1.1 (Paris, FR) • 6 hours ago" },
        { id: "a3", icon: "support_agent", title: "Support Ticket Resolved", meta: "Topic: Size Exchange • Oct 21, 2023" },
        { id: "a4", icon: "star", title: "Points Tier Upgrade", meta: "Achieved Platinum Status • Oct 15, 2023" },
      ],
    },
    {
      id: "UL-90124",
      name: "Alistair Vance",
      email: "avance@tech-corp.uk",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBvX1Qk6bwDEcdnsdhGSCGfa5JjqsvKGXI02yQQ9Vy5MKVBC8oAFGZsFA30o307S9KXqTF8-iRUeZKlfbFNOcxZClibCCpLybX_tGVQApwvGAT_M7RfYKBmLo9ta5HOBgNYhxRqoB2uMQTKI4xZam_auwXKRMsngY7H9oKekyWeHyrFVOYa-GyxZxdkSQr45oe51KomIR0MKkfe7hKGj1tEGc86B2ZeOopWhLmHQhl77yoNDoTZbv14pFAwu3oHVQDaFQVq7EPh7E",
      totalOrders: 18,
      lifetimeSpend: 6250.0,
      rewardPoints: 8120,
      status: "Active",
      lastLogin: "Yesterday",
      customerSince: "Mar 04, 2022",
      avgOrderValue: 347.22,
      returnRate: "1.1%",
      tier: "GOLD LEVEL",
      activity: [
        { id: "a1", icon: "shopping_bag", title: "Order #UL-6210 Placed", meta: "$620.00 • 1 item • 1 day ago" },
      ],
    },
    {
      id: "UL-77210",
      name: "Elena Petrova",
      email: "elena.pet@global.ru",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDywyuDE_eyN50jFYe3LjJdsUdKgAcWisCKqsaabX1goI0HRFxMxcySwuJGy7vDX3xw4FJZHLSL1ZkDznVOD2Q22fDVQ160ZhAktU1HX2GghdhAeLrET8PCd9F42Qm99vmTNzQHzl1W4wq2CbPEuF7d_Y4FUDX2QVEHtM9yWm-OYgvVoy5PPVAeIRzVnIPK8Kau3d-K908ai_pLz63FOcR9nLFXnKqPgWIoJItGwyueuen8y13txYMQJbAX69qgd11htWt5VH-Rx6M",
      totalOrders: 5,
      lifetimeSpend: 1840.5,
      rewardPoints: 2200,
      status: "Verified",
      lastLogin: "Oct 12, 2023",
      customerSince: "Aug 20, 2023",
      avgOrderValue: 368.1,
      returnRate: "0.0%",
      tier: "SILVER LEVEL",
      activity: [],
    },
    {
      id: "UL-99002",
      name: "Marcus Thorne",
      email: "m.thorne@design-group.co",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy0eZn3XpQSeG0UKDiK1cuP0lLsDxxEV-6JwrHdW4W2tMt8ECm_1h8ZFFL-COVBSWY8B6jPw7qlTcG5NblYJPOzxufHqvU_yevvyeoWRu7s0mZnnCt3mMDH95QxCANPOExie63o3VVFZDGfEQGnrRWMmTyaICx_lBVDe2yQ4brBxXPL9WgEk9CXctZTHKBdsrA2UnigS9Crq-0ZygMBOTNpohbPqsuR-3Lk5kUtE0d2UeBaGk7MKAumtlhQO5xF0A4y3QSgBDygrw",
      totalOrders: 112,
      lifetimeSpend: 48200.0,
      rewardPoints: 102400,
      status: "VIP Elite",
      lastLogin: "4 Minutes Ago",
      customerSince: "Nov 02, 2019",
      avgOrderValue: 430.36,
      returnRate: "3.0%",
      tier: "PLATINUM LEVEL",
      activity: [
        { id: "a1", icon: "shopping_bag", title: "Order #UL-9981 Placed", meta: "$3,100.00 • 4 items • 4 mins ago" },
      ],
    },
  ],
  selectedIds: [],
  drawerCustomerId: null,
  searchQuery: "",
  vipFilter: "All",
  regionFilter: "All",
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    toggleSelect(state, action) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
    },
    toggleSelectAll(state, action) {
      const allIds = action.payload;
      state.selectedIds =
        state.selectedIds.length === allIds.length ? [] : allIds;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setVipFilter(state, action) {
      state.vipFilter = action.payload;
    },
    setRegionFilter(state, action) {
      state.regionFilter = action.payload;
    },
    openDrawer(state, action) {
      state.drawerCustomerId = action.payload;
    },
    closeDrawer(state) {
      state.drawerCustomerId = null;
    },
    deactivateCustomer(state, action) {
      const customer = state.items.find((c) => c.id === action.payload);
      if (customer) customer.status = "Deactivated";
    },
    deactivateSelected(state) {
      state.items.forEach((c) => {
        if (state.selectedIds.includes(c.id)) c.status = "Deactivated";
      });
      state.selectedIds = [];
    },
    deleteSelected(state) {
      state.items = state.items.filter(
        (c) => !state.selectedIds.includes(c.id)
      );
      state.selectedIds = [];
    },
  },
});

export const {
  toggleSelect,
  toggleSelectAll,
  setSearchQuery,
  setVipFilter,
  setRegionFilter,
  openDrawer,
  closeDrawer,
  deactivateCustomer,
  deactivateSelected,
  deleteSelected,
} = customersSlice.actions;
export default customersSlice.reducer;