
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";

import { AuthProvider } from "./Context/AuthContext";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Order.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import MainLayout from "./Layout/MainLayout";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Protected admin route */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />}/>
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
