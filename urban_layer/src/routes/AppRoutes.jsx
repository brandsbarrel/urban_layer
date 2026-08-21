import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import AccountLayout from '../layouts/AccountLayout/AccountLayout';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import ShopPage from '../pages/ShopPage/ShopPage';
import CollectionsPage from '../pages/CollectionsPage/CollectionsPage';
import AccessoriesPage from '../pages/AccessoriesPage/AccessoriesPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import CartPage from '../pages/CartPage/CartPage';
import OrderSuccessPage from '../pages/OrderSuccessPage/OrderSuccessPage';
import AccountPage from '../pages/AccountPage/AccountPage';
import OrdersPage from '../pages/OrdersPage/OrdersPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
// import TrackOrderPage from '../pages/TrackOrderPage/TrackOrderPage';
// import OrderDetailPage from '../pages/OrderDetailPage/OrderDetailPage';
// import AddressesPage from '../pages/AddressesPage/AddressesPage';
// import SettingsPage from '../pages/SettingsPage/SettingsPage';
// import ContactPage from '../pages/ContactPage/ContactPage';
import FAQPage from '../pages/FAQPage/FAQPage';
import JournalPage from '../pages/JournalPage/JournalPage';
import JournalArticleDetailPage from '../pages/JournalArticleDetailPage/JournalArticleDetailPage';
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        {/* <Route path="/contact" element={<ContactPage />} /> */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:slug" element={<JournalArticleDetailPage />} />

        <Route element={<AccountLayout />}>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          {/* <Route path="/track-order" element={<TrackOrderPage />} /> */}
          {/* <Route path="/account/orders/:orderId" element={<OrderDetailPage />} /> */}
          {/* <Route path="/account/addresses" element={<AddressesPage />} /> */}
          {/* <Route path="/account/settings" element={<SettingsPage />} /> */}
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

export default AppRoutes;