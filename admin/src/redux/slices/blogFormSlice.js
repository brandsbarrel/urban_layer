import { createSlice } from "@reduxjs/toolkit";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  category: "",
  author: { name: "Julian Sterling", initials: "JS", role: "Chief Editor" },
  content: "",
  featuredImage: "",
  tags: [],
  status: "Draft",
  publiclyVisible: false,
  publishedDate: null,
  scheduledDate: null,
  seoTitle: "",
  seoDescription: "",
};

const initialState = {
  form: { ...emptyForm },
  isDirty: false,
};

const blogFormSlice = createSlice({
  name: "blogForm",
  initialState,
  reducers: {
    loadForExisting(state, action) {
      state.form = { ...emptyForm, ...action.payload };
      state.isDirty = false;
    },
    resetForNew(state) {
      state.form = { ...emptyForm };
      state.isDirty = false;
    },
    updateField(state, action) {
      const { field, value } = action.payload;
      state.form[field] = value;
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
    markSaved(state) {
      state.isDirty = false;
    },
  },
});

export const {
  loadForExisting,
  resetForNew,
  updateField,
  addTag,
  removeTag,
  markSaved,
} = blogFormSlice.actions;
export { emptyForm };
export default blogFormSlice.reducer;