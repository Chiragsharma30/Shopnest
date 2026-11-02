
import { useState, useEffect } from "react";
import { Link } from "react-router";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("shopnest-wishlist")) || [];

    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(
      (product) => (product._id || product.id) !== id
    );

    localStorage.setItem(
      "shopnest-wishlist",
      JSON.stringify(updated)
    );

    setWishlist(updated);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <h2>My Wishlist</h2>
        <p>Your wishlist is empty.</p>
        <Link to="/products">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div className="product-card" key={product._id || product.id}>
            <Link to={`/product/${product._id || product.id}`}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
            </Link>

            <p>₹{Number(product.price).toLocaleString("en-IN")}</p>

            <button
              onClick={() =>
                removeFromWishlist(product._id || product.id)
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
