import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import AdminRoute from "./components/AdminRoute";
import ProductList from "./pages/admin/ProductList";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* Layout Wrapper */}
            <Route element={<MainLayout />}>

              {/* Public Routes */}
              <Route path="/" element={<Catalogue />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              {/* ================= ADMIN ROUTES ================= */}

              <Route
                path="/admin/products"
                element={
                  <RoleRoute allowedRoles={["admin", "superadmin"]}>
                    <ProductList />
                  </RoleRoute>
                }
              />

              <Route
                path="/admin/add-product"
                element={
                  <RoleRoute allowedRoles={["admin", "superadmin"]}>
                    <AddProduct />
                  </RoleRoute>
                }
              />

              <Route
                path="/admin/edit-product/:id"
                element={
                  <RoleRoute allowedRoles={["admin", "superadmin"]}>
                    <EditProduct />
                  </RoleRoute>
                }
              />

            </Route>

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;