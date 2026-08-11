import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: [
    { id: "total", label: "Total Articles", value: "1,248", change: "12%", trend: "up" },
    { id: "published", label: "Published", value: "892", change: "5%", trend: "up" },
    { id: "readTime", label: "Avg. Read Time", value: "4:25", suffix: "min", change: "2%", trend: "down" },
    { id: "seo", label: "SEO Score", value: "94", suffix: "/100", change: "0.4%", trend: "up" },
  ],
  items: [
    {
      id: "b1",
      title: "Heritage Leather: The 2024 Collection",
      slug: "heritage-leather-2024-collection",
      author: { name: "Elias Sterling", initials: "ES", role: "Senior Editor" },
      category: "Craftsmanship",
      seoScore: 98,
      status: "Published",
      publiclyVisible: true,
      views: 14284,
      avgSessionDuration: "5m 12s",
      bounceRate: "32.4%",
      updatedAt: "2 hours ago",
      publishedDate: "March 14, 2024",
      scheduledDate: null,
      content: "A look into the philosophy behind the 2024 Heritage Leather collection...",
      tags: ["HeritageLeather", "LuxuryAccessories", "Craftsmanship", "SustainableFashion"],
      seoTitle: "Heritage Leather Phone Case Collection | Urban Layers Co.",
      seoDescription: "Discover the philosophy behind our 2024 heritage leather collection.",
      featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGCyA_FzQJvOpPFZTb7KtE8ARMTUIFdIVVF2ClUpiWm_m-t-fb_iHoJaxVFZP5ezLhRbvfiWTeiETUcZmMad-7q3nsN8BBJ3Hc5urZyZTPJMtoQg-2fcDbTkxbxbImzxn_5X2An3nXj-lFhxQncZoTSKVUq98edJt8D6J9YUaNXtoxvJr9FyZaxogupzdZO9Cui9OWFyXnP8GzgLkENXP6y3znoqYDsEf_vrdaB9KBUvmYPcY9k5Vf29AoZQQQE9Xj78tSUn45vkc",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpaCSbRWwq_eXixdCtmKQfSmP819K8BXSC_yeLgpIeh3fURw7v3Eo4GMgvABokfneCfP1_x9WJTjs4JviuTRL5eHOoeWrmCdfTq1Ii3_9pRlvwGEyu5JOmgzcW1K0EVLc1MBRZ3LUOarOEWONRRAJXfiGDRfAcbEBMPPhWIzQdrlDFbGyQh-Jm0S6pTg6Ry_amT8rXanXogPbzneIm4n6tUPAQeAB4z0NLG9ChXz4zt1ftt5AYRRJGsU0MGpSvOP6cBYpOJN_dWes",
    },
    {
      id: "b2",
      title: "Urban Minimalism in Tech Workspaces",
      slug: "urban-minimalism-tech-workspaces",
      author: { name: "Aria Hayes", initials: "AH", role: "Contributing Editor" },
      category: "Lifestyle",
      seoScore: 84,
      status: "Draft",
      publiclyVisible: false,
      views: null,
      avgSessionDuration: null,
      bounceRate: null,
      updatedAt: "1 day ago",
      publishedDate: null,
      scheduledDate: null,
      content: "Exploring minimalist design principles in modern tech workspaces...",
      tags: ["Minimalism", "Workspace"],
      seoTitle: "",
      seoDescription: "",
      featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPADh_QqH0NnKUTHV2qU9C182NIuaRj-z7qRZRNOuuGaAZ-gtswCnbcaDz8hCDcH5cFJdJzYqzo-VUUT5Z5G0be2-fbvYmLRXuAe4OkAOnU7GNytiYx3dgTgzU3qETlqidq5rAeS6YonQsNxLbXZPEcuvosVcTE0h9Wg42KocyHRwFlgwLT1EFZhjXVgWDQuqDZpN9IEyaz5W1awegtjun41xARA6d_8y_cjQFGj2ibaurDUN_iU_IUktWhNXuekquGM6_wcN5OIY",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPADh_QqH0NnKUTHV2qU9C182NIuaRj-z7qRZRNOuuGaAZ-gtswCnbcaDz8hCDcH5cFJdJzYqzo-VUUT5Z5G0be2-fbvYmLRXuAe4OkAOnU7GNytiYx3dgTgzU3qETlqidq5rAeS6YonQsNxLbXZPEcuvosVcTE0h9Wg42KocyHRwFlgwLT1EFZhjXVgWDQuqDZpN9IEyaz5W1awegtjun41xARA6d_8y_cjQFGj2ibaurDUN_iU_IUktWhNXuekquGM6_wcN5OIY",
    },
    {
      id: "b3",
      title: "The Future of Urban Accessories",
      slug: "future-of-urban-accessories",
      author: { name: "Elias Sterling", initials: "ES", role: "Senior Editor" },
      category: "Innovation",
      seoScore: 92,
      status: "Scheduled",
      publiclyVisible: false,
      views: null,
      avgSessionDuration: null,
      bounceRate: null,
      updatedAt: "3 days ago",
      publishedDate: null,
      scheduledDate: "2024-12-01T09:00",
      content: "A forward-looking piece on the next wave of accessory design...",
      tags: ["Innovation", "Accessories"],
      seoTitle: "",
      seoDescription: "",
      featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8elVAWzIXt-cvG8aPoaVkxL_w0HuXM2ODbBbZVCFRXWN5caYnNdgvJIY3KLejdfGXOGKZ-EURyl4ZYhQP6o8pTf10XikSYOfsQu0wCUn4yZU2j9PXHhf0awNnQGMuYa3tuChqQbKFQCKwe-csljcIusiU5VOrSeEJtOGqsjlWE3vtEzc9r634mF7o5IFwPP5P5fU9gw2sph0teKUGV-akm0r-eV32PajqkihcqO4Njn_PLW1AEBsg9XiUHSq8z2s_dNN3qm1JHv4",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8elVAWzIXt-cvG8aPoaVkxL_w0HuXM2ODbBbZVCFRXWN5caYnNdgvJIY3KLejdfGXOGKZ-EURyl4ZYhQP6o8pTf10XikSYOfsQu0wCUn4yZU2j9PXHhf0awNnQGMuYa3tuChqQbKFQCKwe-csljcIusiU5VOrSeEJtOGqsjlWE3vtEzc9r634mF7o5IFwPP5P5fU9gw2sph0teKUGV-akm0r-eV32PajqkihcqO4Njn_PLW1AEBsg9XiUHSq8z2s_dNN3qm1JHv4",
    },
  ],
  searchQuery: "",
  statusFilter: "All",
  categoryFilter: "All",
  authorFilter: "All",
  previewId: null,
  deleteTargetId: null,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    setAuthorFilter(state, action) {
      state.authorFilter = action.payload;
    },
    openPreview(state, action) {
      state.previewId = action.payload;
    },
    closePreview(state) {
      state.previewId = null;
    },
    setDeleteTarget(state, action) {
      state.deleteTargetId = action.payload;
    },
    confirmDelete(state) {
      state.items = state.items.filter((b) => b.id !== state.deleteTargetId);
      state.deleteTargetId = null;
      state.previewId = null;
    },
    // Called by BlogForm on Save Draft / Publish / Schedule / Archive.
    upsertBlog(state, action) {
      const data = action.payload;
      if (data.id) {
        const existing = state.items.find((b) => b.id === data.id);
        if (existing) Object.assign(existing, data);
      } else {
        state.items.unshift({
          ...data,
          id: `b${Date.now()}`,
          views: null,
          avgSessionDuration: null,
          bounceRate: null,
          updatedAt: "Just now",
          thumbnail: data.featuredImage,
        });
      }
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setAuthorFilter,
  openPreview,
  closePreview,
  setDeleteTarget,
  confirmDelete,
  upsertBlog,
} = blogsSlice.actions;
export default blogsSlice.reducer;