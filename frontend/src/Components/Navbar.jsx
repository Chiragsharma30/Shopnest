
import { Link, useNavigate } from "react-router";
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          🛒 ShopNest
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Order</Link>

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </nav>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            aria-label="Search for products"
          />

          <button type="button" aria-label="Search">
            🔍
          </button>
        </div>

        {/* Actions */}
        <div className="nav-actions">

          {/* Wishlist Heart Icon */}
          <Link
            to="/wishlist"
            className="icon-button"
            aria-label="My Wishlist"
            title="My Wishlist"
          >
            ♡
          </Link>

          {/* Login or Account */}
          {user ? (
            <div className="nav-user">
              <span title={user.name}>
                👤 {user.name?.split(" ")[0] || "Account"}
              </span>

              <button
                type="button"
                className="icon-button"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="icon-button"
              aria-label="Login"
              title="Login"
            >
              👤
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="cart-button"
            aria-label="Shopping Cart"
          >
            🛒
            <span>{cartCount}</span>
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
