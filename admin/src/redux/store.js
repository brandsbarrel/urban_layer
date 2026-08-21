import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import productsReducer from "./slices/productsSlice";
import productFormReducer from "./slices/productFormSlice";
import categoriesReducer from "./slices/categoriesSlice";
import phoneModelsReducer from "./slices/phoneModelsSlice";
import ordersReducer from "./slices/ordersSlice";
import customersReducer from "./slices/customersSlice";
import couponsReducer from "./slices/couponsSlice";
import blogsReducer from "./slices/blogsSlice";
import blogFormReducer from "./slices/blogFormSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    products: productsReducer,
    productForm: productFormReducer,
    categories: categoriesReducer,
    phoneModels: phoneModelsReducer,
    orders: ordersReducer,
    customers: customersReducer,
    coupons: couponsReducer,
    blogs: blogsReducer,
    blogForm: blogFormReducer,
  },
});

export default store;
