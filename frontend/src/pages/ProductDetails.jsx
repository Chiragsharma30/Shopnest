
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useCart } from "../Context/CartContext.jsx";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/products/${id}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data.product);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load product.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  function handleAddToCart(goToCheckout = false) {
    if (!product) return;

    addToCart(product, quantity);

    if (goToCheckout) {
      navigate("/checkout");
      return;
    }

    setMessage(`${product.name} added to cart successfully!`);

    setTimeout(() => setMessage(""), 2500);
  }

  if (loading) {
    return (
      <div className="product-not-found">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>{error || "This product could not be found."}</p>
        <Link to="/products">← Back to Products</Link>
      </div>
    );
  }

  const price = Number(product.price ?? 0);
  const oldPrice = Number(product.oldPrice ?? 0);
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;

  return (
    <div className="product-details-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/products">Products</Link>
        <span>›</span>
        <strong>{product.name}</strong>
      </div>

      {message && (
        <div className="cart-success-message" role="status">
          ✓ {message}
        </div>
      )}

      <section className="product-details">
        <div className="details-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span>No image available</span>
          )}

          {product.discount && (
            <div className="details-discount">
              {product.discount}
            </div>
          )}
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <span>★</span>
            <strong>{rating}</strong>
            <span className="rating-reviews">
              ({reviews} reviews)
            </span>
          </div>

          <div className="details-price">
            <strong>₹{price.toLocaleString("en-IN")}</strong>

            {oldPrice > price && (
              <del>₹{oldPrice.toLocaleString("en-IN")}</del>
            )}

            {product.discount && <span>{product.discount}</span>}
          </div>

          <p className="details-description">
            {product.description || "No description available."}
          </p>

          <p>
            Stock available: {product.stock ?? "Not specified"}
          </p>

          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={
                  Number.isFinite(Number(product.stock)) &&
                  quantity >= Number(product.stock)
                }
                onClick={() =>
                  setQuantity((q) =>
                    product.stock == null
                      ? q + 1
                      : Math.min(Number(product.stock), q + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className="add-details-cart"
              disabled={Number(product.stock) <= 0}
              onClick={() => handleAddToCart(false)}
            >
              {Number(product.stock) <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              type="button"
              className="buy-now-btn"
              disabled={Number(product.stock) <= 0}
              onClick={() => handleAddToCart(true)}
            >
              Buy Now
            </button>

            <button
              type="button"
              className="details-wishlist"
              aria-label="Add to wishlist"
            >
              ♡
            </button>
          </div>

          <div className="product-features">
            <div>
              <span>🚚</span>
              <p>
                <strong>Free Delivery</strong>
                <br />
                On orders above ₹999
              </p>
            </div>

            <div>
              <span>↩️</span>
              <p>
                <strong>Easy Returns</strong>
                <br />
                7 days return policy
              </p>
            </div>

            <div>
              <span>🔒</span>
              <p>
                <strong>Secure Payment</strong>
                <br />
                100% secure checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description">
        <h2>Product Information</h2>
        <p>{product.description || "No additional information available."}</p>
      </section>
    </div>
  );
}

export default ProductDetails;
