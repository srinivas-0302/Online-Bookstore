import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBooksPage from "./pages/AdminBooksPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOrderDetailsPage from "./pages/AdminOrderDetailsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminSalesPage from "./pages/AdminSalesPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import BookFormPage from "./pages/BookFormPage";
import BooksPage from "./pages/BooksPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="/" element={<BooksPage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Customers only */}
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        </Route>

        {/* Admin only, with the side menu */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetailsPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/sales" element={<AdminSalesPage />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
            <Route path="/admin/books/new" element={<BookFormPage />} />
            <Route path="/admin/books/:bookId/edit" element={<BookFormPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}