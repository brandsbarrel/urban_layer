import { createSlice } from "@reduxjs/toolkit";

const emptyForm = {
  id: null,
  name: "",
  slug: "",
  sku: "",
  phoneModelId: "",
  description: "",
  featuredImage: "",
  galleryImages: ["", "", ""],
  status: "Draft",
  visibility: "Public",
  basePrice: "",
  salePrice: "",
  costPrice: "",
  taxRate: "",
  totalStock: 0,
  trackStock: true,
  categories: [],
  collection: "",
  tags: [],
  weight: "",
  length: "",
  width: "",
  height: "",
  packageType: "Box",
  shippingClass: "Standard",
  fragile: false,
  seoTitle: "",
  seoDescription: "",
  variants: [],
};

const initialState = {
  form: { ...emptyForm },
  isDirty: false,
  lastSavedStatus: null, // "Draft" | "Published" | null
};

const productFormSlice = createSlice({
  name: "productForm",
  initialState,
  reducers: {
    loadForExisting(state, action) {
      state.form = { ...emptyForm, ...action.payload };
      state.isDirty = false;
      state.lastSavedStatus = state.form.status;
    },
    resetForNew(state) {
      state.form = { ...emptyForm };
      state.isDirty = false;
      state.lastSavedStatus = null;
    },
    updateField(state, action) {
      const { field, value } = action.payload;
      state.form[field] = value;
      state.isDirty = true;
    },
    toggleCategory(state, action) {
      const category = action.payload;
      state.form.categories = state.form.categories.includes(category)
        ? state.form.categories.filter((c) => c !== category)
        : [...state.form.categories, category];
      state.isDirty = true;
    },
    addTag(state, action) {
      const tag = action.payload.trim();
      if (tag && !state.form.tags.includes(tag)) {
        state.form.tags.push(tag);
        state.isDirty = true;
      }
    },
    removeTag(state, action) {
      state.form.tags = state.form.tags.filter((t) => t !== action.payload);
      state.isDirty = true;
    },
    updateVariantField(state, action) {
      const { variantId, field, value } = action.payload;
      const variant = state.form.variants.find((v) => v.id === variantId);
      if (variant) {
        variant[field] = value;
        state.isDirty = true;
      }
    },
    removeVariant(state, action) {
      state.form.variants = state.form.variants.filter(
        (v) => v.id !== action.payload
      );
      state.isDirty = true;
    },
    markSaved(state, action) {
      state.lastSavedStatus = action.payload;
      state.isDirty = false;
    },
    discardChanges(state) {
      state.isDirty = false;
    },
  },
});

export const {
  loadForExisting,
  resetForNew,
  updateField,
  toggleCategory,
  addTag,
  removeTag,
  updateVariantField,
  removeVariant,
  markSaved,
  discardChanges,
} = productFormSlice.actions;
export default productFormSlice.reducer;
