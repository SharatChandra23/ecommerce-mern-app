import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Catalogue from "./pages/Catalogue";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";

// import AdminRoute from "./components/AdminRoute";
import ProductList from "./pages/admin/ProductList";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Addresses from "./pages/Addresses";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import AdminCoupons from "./pages/admin/AdminCoupons";
import OrdersList from "./pages/orders/OrdersList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <Toaster position="top-right" reverseOrder={false} />

          <Routes>

            {/* Layout Wrapper */}
            <Route element={<MainLayout />}>

              {/* Public Routes */}
              <Route path="/" element={<Catalogue />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}

              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />

              <Route path="/address" element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />

              <Route path="/payment/:orderId" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />

              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersList />
                </ProtectedRoute>
              } />

              {/* ================= ADMIN ROUTES ================= */}

              <Route
                path="/admin/coupons"
                element={
                  <ProtectedRoute role="admin">
                    <AdminCoupons />
                  </ProtectedRoute>
                } />

              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute role="admin">
                    <ProductList />
                  </ProtectedRoute>
                } />

              <Route
                path="/admin/add-product"
                element={
                  <ProtectedRoute role="admin">
                    <AddProduct />
                  </ProtectedRoute>
                } />

              <Route
                path="/admin/edit-product/:id"
                element={
                  <ProtectedRoute role="admin">
                    <EditProduct />
                  </ProtectedRoute>
                } />

              <Route
                path="*"
                element={<Navigate to="/" replace />} />

            </Route>

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;