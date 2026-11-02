
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "../Context/CartContext.jsx";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopnest-wishlist")) || [];

    setIsWishlisted(
      wishlist.some((item) => item._id === productId || item.id === productId)
    );
  }, [productId]);

  const toggleWishlist = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopnest-wishlist")) || [];

    const exists = wishlist.some(
      (item) => (item._id || item.id) === productId
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist = wishlist.filter(
        (item) => (item._id || item.id) !== productId
      );
    } else {
      updatedWishlist = [...wishlist, product];
    }

    localStorage.setItem(
      "shopnest-wishlist",
      JSON.stringify(updatedWishlist)
    );

    setIsWishlisted(!exists);
  };

  const price = Number(product.price ?? 0);
  const oldPrice = Number(product.oldPrice ?? 0);
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;

  return (
    <div className="product-card">
      <span className="discount-badge">
        {product.discount || ""}
      </span>

      <button
        className={`wishlist-button ${isWishlisted ? "active" : ""}`}
        type="button"
        onClick={toggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      <Link to={`/product/${productId}`} className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name || "Product"} />
        ) : (
          <span>No image available</span>
        )}
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${productId}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-rating">
          <span>★</span>
          <strong>{rating}</strong>
          <small>({reviews})</small>
        </div>

        <div className="product-price">
          <strong>₹{price.toLocaleString("en-IN")}</strong>
          {oldPrice > price && (
            <del>₹{oldPrice.toLocaleString("en-IN")}</del>
          )}
        </div>

        <button
          className="add-cart-btn"
          type="button"
          onClick={() => addToCart(product, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
