import { createSlice } from "@reduxjs/toolkit";

// Mock product catalog data standing in for a real Products API.
const initialState = {
  items: [
    {
      id: "p1",
      name: "Heritage Leather Case",
      sku: "UL-HLC-BLK",
      category: "Leather",
      collectionLabel: "LEATHER COLLECTION",
      price: 129.0,
      stock: 842,
      unfulfilledOrders: 12,
      status: "Active",
      image:
        "https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA",
      description:
        "A premium obsidian leather case tanned in the French Alps. Features a precision-milled aerospace-grade aluminum frame and micro-fiber lining to ensure absolute protection and luxury.",
      variants: [
        { id: "v1", color: "#000000" },
        { id: "v2", color: "#3C3C3C" },
        { id: "v3", color: "#8B4513" },
      ],
      activity: [
        {
          id: "a1",
          message: "Stock restock (+200 units)",
          meta: "2 hours ago by Sarah J.",
        },
        {
          id: "a2",
          message: "Price updated from $119 to $129",
          meta: "Yesterday by Admin",
        },
      ],
    },
    {
      id: "p2",
      name: "Titanium Mesh Edition",
      sku: "UL-TME-SVR",
      category: "Carbon Fiber",
      collectionLabel: "CARBON FIBER COLLECTION",
      price: 189.0,
      stock: 18,
      unfulfilledOrders: 4,
      status: "Low Stock",
      image:
        "https://lh3.googleusercontent.com/aida/AP1WRLtOMnYrknK557CVr_4IdAN700c0tHdhwD4Brs4SyreXgG7Aw1itcahCKjoMTDZNkyfaFuyd9bnArvS5TgMl-DdEhRHAoUBKv2cgcqFXbx8ylUTPL9PWxuBk0Mz8RhhEn5her2frp_Gf7EoV7KJTjRkyx2It2Js9Cvy56wxzsi7MVV6qXC6ws2R_sN3dgSIHUHBKL13OvcoiMrMH0qRNesFLX4qwDnW9IVIcePvH845mrAdJEowQszddyYg",
      description:
        "A featherweight titanium mesh shell engineered for extreme durability, finished with a brushed silver coating and reinforced corner bumpers.",
      variants: [
        { id: "v1", color: "#C0C0C0" },
        { id: "v2", color: "#1F1F1F" },
      ],
      activity: [
        {
          id: "a1",
          message: "Low stock threshold reached",
          meta: "3 hours ago — system",
        },
      ],
    },
  ],
  stats: [
    {
      id: "total",
      label: "TOTAL PRODUCTS",
      value: "1,248",
      icon: "inventory_2",
      tone: "neutral",
      sparklinePath: "M0 30 Q 10 10, 20 25 T 40 15 T 60 20 T 80 5 T 100 15",
    },
    {
      id: "active",
      label: "ACTIVE PRODUCTS",
      value: "1,120",
      icon: "check_circle",
      tone: "success",
      sparklinePath: "M0 20 L 20 25 L 40 10 L 60 15 L 80 5 L 100 10",
    },
    {
      id: "low-stock",
      label: "LOW STOCK",
      value: "42",
      icon: "warning",
      tone: "warning",
      sparklinePath: "M0 5 L 25 35 L 50 20 L 75 38 L 100 15",
    },
    {
      id: "out-of-stock",
      label: "OUT OF STOCK",
      value: "12",
      icon: "error",
      tone: "error",
      sparklinePath: "M0 10 L 10 20 L 20 40 L 40 38 L 100 40",
    },
  ],
  selectedIds: [],
  drawerProductId: null,
  searchQuery: "",
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 1248, // mock total shown in the catalog stat, not tied to items.length
  },
};

const productsSlice = createSlice({
  name: "products",
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
    clearSelection(state) {
      state.selectedIds = [];
    },
    openDrawer(state, action) {
      state.drawerProductId = action.payload;
    },
    closeDrawer(state) {
      state.drawerProductId = null;
    },
    archiveProduct(state, action) {
      const product = state.items.find((p) => p.id === action.payload);
      if (product) product.status = "Archived";
    },
    archiveSelected(state) {
      state.items.forEach((p) => {
        if (state.selectedIds.includes(p.id)) p.status = "Archived";
      });
      state.selectedIds = [];
    },
    deleteProducts(state, action) {
      const ids = action.payload;
      state.items = state.items.filter((p) => !ids.includes(p.id));
      state.selectedIds = [];
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
  },
});

export const {
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  openDrawer,
  closeDrawer,
  archiveProduct,
  archiveSelected,
  deleteProducts,
  setSearchQuery,
  setPage,
} = productsSlice.actions;
export default productsSlice.reducer;