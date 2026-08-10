import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: [
    { id: "total", label: "Total Categories", value: "24", note: "+2 this month", noteTone: "primary" },
    { id: "active", label: "Active Categories", value: "18", note: "75% RATIO", noteTone: "badge" },
    { id: "assigned", label: "Products Assigned", value: "1,248", note: "trending_up", noteTone: "icon" },
    { id: "top", label: "Top Performer", value: "iPhone Cases", note: "14% Growth", noteTone: "primary" },
  ],
  items: [
    {
      id: "phone-cases",
      name: "iPhone Cases",
      breadcrumb: "Accessories > Mobile",
      slug: "/iphone-cases",
      productsAssigned: 412,
      seoScore: 92,
      status: "Active",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYaxIxSNRdIFCiAuyV0SMqRrTMpPGNxCdfyVxYQHvtzGSWWJ95OnrWAvoVZRNctBNMGjlDXxP5EGwuckK8AU7S9pFlahLLT9aUNkDJ89DG7ZthUnumXJ5sD1JY3tkRtzh8CKVK0mRU_wvd6_J_ZsqnoL_ibbVJAvHUJ_jvwBpH5TRh75uqTLR7yHYCbeiX5ZmcouUMBB-b1YUsOZhkDXIy8wF1BZvEnuYUqffJ4Hak1_eytz1cwRmresRxiuOUhy2_DHUQI_3Ehc",
    },
    {
      id: "wallets-folios",
      name: "Wallets & Folios",
      breadcrumb: "Accessories > Carry",
      slug: "/wallets-folios",
      productsAssigned: 184,
      seoScore: 76,
      status: "Active",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1wWu5FPhDOIwtCxBDySclxkCfJ5CBg3a9kGATQZtNNDNq5jPeS998yx-ACz94Gw9wkLBE0DUXDtY3ogM0zd6Fv6zpcFsIrGv7ZD8hITAwkkivBXQmsUOdqxgEXH5kCOAX-DYTOFjHwO6TZvPeXv5dXY178O771jfCTBADjcvq1k6c4-zByC87gI06Lz_broL52wwjDiKYPV23FyOXuN54sFqxf_k-FEiS74Ldhga8qFUW07KxTzZC4r1DX1uOZWZD278ksBL1is8",
    },
    {
      id: "winter-23-drop",
      name: "Winter '23 Drop",
      breadcrumb: "Apparel > Seasonal",
      slug: "/winter-23-drop",
      productsAssigned: 92,
      seoScore: 45,
      status: "Hidden",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATFHOoi_cILi2H8G5IVn2G2muYF9Nq6U7sEvCpkzhIJJaUCFTA-7mSQUpeLrlvasXyExj9WVYTJV6GBBI4GINoQdbk6o7apcOB7EjjTY25XMe4eDDeVxzhDF2AHMVqUM39xz4fadsWJVcWLiLtR1Bak_eFEliJgIUDqgL3UEdHunNb6FVjYnSxjWyOXIAL2qkXgHAbwh1MUsw-Bxu3EE2mVVOMad5LJpjpbVS0OGzuVr3GVoEEysCVrwGQtm4xz4tV0gSKJUvjV8I",
    },
  ],
  selectedIds: [],
  searchQuery: "",
  statusFilter: "All",
  parentFilter: "None",
  drawerOpen: false,
  activeMenuId: null,
  previewCategory: {
    revenue: "$42,910.00",
    activeOrders: 128,
    avgTicket: "$335.23",
    growthIndex: [40, 60, 55, 80, 95],
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkb2-54kxpNqoOiBuhjWI9tCb8PpD6q22bF4p7IAWFCJNGDXc7F4JC4fzTvilSs0iL8RjrrfZupwZreWUkg72wtGq5FTv-zv-KY7WlH0CS2tC91VtWtl4H9lYDFRZtPQyrEHPflgmgWKWwXWNh_fKFJwJc2lEMF__JTmFzfGHfbZaea9xoB84vByckNTw46E0jDA1Roz8ACx56EQpBifZ6OsUVBc6Hr7CsbiXhR8gAcPpDSnd3ZUAEg1TV_KsTkp_MXQ3roIx8Ra4",
  },
};

const categoriesSlice = createSlice({
  name: "categories",
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
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setParentFilter(state, action) {
      state.parentFilter = action.payload;
    },
    openDrawer(state) {
      state.drawerOpen = true;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
    },
    toggleRowMenu(state, action) {
      state.activeMenuId =
        state.activeMenuId === action.payload ? null : action.payload;
    },
    closeRowMenu(state) {
      state.activeMenuId = null;
    },
    hideCategory(state, action) {
      const cat = state.items.find((c) => c.id === action.payload);
      if (cat) cat.status = cat.status === "Hidden" ? "Active" : "Hidden";
      state.activeMenuId = null;
    },
    deleteCategory(state, action) {
      state.items = state.items.filter((c) => c.id !== action.payload);
      state.activeMenuId = null;
    },
    moveCategory(state, action) {
      const { id, direction } = action.payload;
      const index = state.items.findIndex((c) => c.id === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= state.items.length)
        return;
      const [item] = state.items.splice(index, 1);
      state.items.splice(targetIndex, 0, item);
      state.activeMenuId = null;
    },
    addCategory(state, action) {
      state.items.unshift({
        id: `${Date.now()}`,
        productsAssigned: 0,
        seoScore: 0,
        status: "Active",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYaxIxSNRdIFCiAuyV0SMqRrTMpPGNxCdfyVxYQHvtzGSWWJ95OnrWAvoVZRNctBNMGjlDXxP5EGwuckK8AU7S9pFlahLLT9aUNkDJ89DG7ZthUnumXJ5sD1JY3tkRtzh8CKVK0mRU_wvd6_J_ZsqnoL_ibbVJAvHUJ_jvwBpH5TRh75uqTLR7yHYCbeiX5ZmcouUMBB-b1YUsOZhkDXIy8wF1BZvEnuYUqffJ4Hak1_eytz1cwRmresRxiuOUhy2_DHUQI_3Ehc",
        breadcrumb: action.payload.parent || "Root",
        ...action.payload,
      });
      state.drawerOpen = false;
    },
  },
});

export const {
  toggleSelect,
  toggleSelectAll,
  setSearchQuery,
  setStatusFilter,
  setParentFilter,
  openDrawer,
  closeDrawer,
  toggleRowMenu,
  closeRowMenu,
  hideCategory,
  deleteCategory,
  moveCategory,
  addCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;