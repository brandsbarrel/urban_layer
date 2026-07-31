import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import ShopPage from '../pages/ShopPage/ShopPage';
import CollectionsPage from '../pages/CollectionsPage/CollectionsPage';
import AccessoriesPage from '../pages/AccessoriesPage/AccessoriesPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;